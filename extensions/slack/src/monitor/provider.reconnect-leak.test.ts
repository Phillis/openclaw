// Slack tests cover socket-mode reconnect leak prevention: the monitor loop is
// the single reconnect authority and no websocket may outlive a stop.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSlackTestState, resetSlackTestState } from "../monitor.test-helpers.js";
import { gracefulStopSlackApp } from "./provider-support.js";

const { monitorSlackProvider } = await import("./provider.js");
const slackTestState = getSlackTestState();

type TrackedWebsocket = { readyState: number; disconnect: () => void };

function createTrackedWebsocket(registry: TrackedWebsocket[]): TrackedWebsocket {
  const websocket: TrackedWebsocket = {
    readyState: 1,
    disconnect: () => {
      websocket.readyState = 3;
    },
  };
  registry.push(websocket);
  return websocket;
}

function countLiveWebsockets(registry: TrackedWebsocket[]): number {
  return registry.filter((websocket) => websocket.readyState === 1).length;
}

function socketModeClient(): Record<string, unknown> {
  const client = slackTestState.socketModeClient;
  if (!client) {
    throw new Error("expected the mocked Socket Mode client");
  }
  return client;
}

function emitSocketEvent(event: string) {
  const emit = socketModeClient()["emit"] as (event: string, ...args: unknown[]) => void;
  emit(event);
}

function startMonitorProvider(controller: AbortController): Promise<unknown> {
  return monitorSlackProvider({
    botToken: "bot-token",
    appToken: "app-token",
    abortSignal: controller.signal,
    config: slackTestState.config,
    runtime: { log: vi.fn(), error: vi.fn(), exit: vi.fn() },
  });
}

describe("slack socket-mode reconnect leak guard", () => {
  beforeEach(() => {
    resetSlackTestState();
    // Reconnect backoff uses timeouts. Keep ingress polling and SQLite WAL intervals
    // real so runAllTimersAsync cannot turn periodic maintenance into an infinite loop.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("keeps at most one live websocket across repeated error/disconnect cycles", async () => {
    const controller = new AbortController();
    const registry: TrackedWebsocket[] = [];
    let peakLive = 0;
    let attempts = 0;
    const cycles = 5;
    slackTestState.appStartMock.mockImplementation(async () => {
      attempts += 1;
      // SDK start() shape: replace client.websocket without closing the prior
      // socket — the exact accumulation vector that leaked ESTABLISHED
      // connections up to Slack's 10-connections-per-app cap.
      socketModeClient()["websocket"] = createTrackedWebsocket(registry);
      peakLive = Math.max(peakLive, countLiveWebsockets(registry));
      if (attempts > cycles) {
        controller.abort();
        return;
      }
      emitSocketEvent("disconnected");
    });

    const run = startMonitorProvider(controller);
    await vi.runAllTimersAsync();
    await expect(run).resolves.toBeUndefined();

    expect(slackTestState.appStartMock).toHaveBeenCalledTimes(cycles + 1);
    expect(peakLive).toBe(1);
    expect(countLiveWebsockets(registry)).toBe(0);
  });

  it("closes a websocket assigned by a start that shutdown already fenced", async () => {
    const controller = new AbortController();
    const registry: TrackedWebsocket[] = [];
    let gateEntered = false;
    let releaseStart: (() => void) | undefined;
    const startGate = new Promise<void>((resolve) => {
      releaseStart = resolve;
    });
    slackTestState.appStartMock.mockImplementation(async () => {
      gateEntered = true;
      await startGate;
      // A start() still in flight when stop() ran assigns its websocket after
      // the disconnect — the guard must close it immediately.
      socketModeClient()["websocket"] = createTrackedWebsocket(registry);
    });

    const run = startMonitorProvider(controller);
    for (let ticks = 0; ticks < 20; ticks += 1) {
      if (gateEntered) {
        break;
      }
      await vi.advanceTimersByTimeAsync(1);
    }
    expect(gateEntered).toBe(true);

    controller.abort();
    releaseStart?.();
    await expect(run).resolves.toBeUndefined();

    expect(registry).toHaveLength(1);
    expect(countLiveWebsockets(registry)).toBe(0);
  });

  it("leaves zero open websockets after the provider stops", async () => {
    const controller = new AbortController();
    const registry: TrackedWebsocket[] = [];
    slackTestState.appStartMock.mockImplementation(async () => {
      socketModeClient()["websocket"] = createTrackedWebsocket(registry);
    });

    const run = startMonitorProvider(controller);
    await vi.advanceTimersByTimeAsync(5);
    expect(countLiveWebsockets(registry)).toBe(1);

    controller.abort();
    await expect(run).resolves.toBeUndefined();
    expect(countLiveWebsockets(registry)).toBe(0);
  });

  it("leaves a healthy single connection untouched while idle", async () => {
    const controller = new AbortController();
    const registry: TrackedWebsocket[] = [];
    slackTestState.appStartMock.mockImplementation(async () => {
      socketModeClient()["websocket"] = createTrackedWebsocket(registry);
    });

    const run = startMonitorProvider(controller);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(slackTestState.appStartMock).toHaveBeenCalledTimes(1);
    expect(countLiveWebsockets(registry)).toBe(1);

    controller.abort();
    await expect(run).resolves.toBeUndefined();
    expect(countLiveWebsockets(registry)).toBe(0);
  });

  it("disconnects the socket client even when app stop fails", async () => {
    const registry: TrackedWebsocket[] = [];
    const websocket = createTrackedWebsocket(registry);
    const disconnect = vi.fn(() => {
      websocket.readyState = 3;
    });
    const app = {
      receiver: { client: { shuttingDown: false, websocket, disconnect } },
      stop: vi.fn(async () => {
        throw new Error("stop failed");
      }),
    };

    await expect(gracefulStopSlackApp(app)).resolves.toBeUndefined();

    expect(app.stop).toHaveBeenCalledTimes(1);
    expect(app.receiver.client.shuttingDown).toBe(true);
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(websocket.readyState).toBe(3);
  });
});
