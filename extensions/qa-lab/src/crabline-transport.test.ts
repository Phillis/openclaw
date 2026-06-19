// Qa Lab tests cover Crabline transport integration behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createQaBusState } from "./bus-state.js";
import {
  createQaCrablineTransportAdapter,
  type QaCrablineProviderAdapter,
} from "./crabline-transport.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

async function createTempOutputDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "qa-crabline-transport-"));
  tempDirs.push(dir);
  return dir;
}

function createSelection(channel = "telegram") {
  return {
    capabilityMatrixPath: "crabline-channel-capability-matrix.json",
    channel,
    channelDriver: "crabline",
    smokeArtifactPath: "crabline-channel-smoke.json",
  } as const;
}

function createProvider(overrides: Partial<QaCrablineProviderAdapter> = {}) {
  const provider = {
    id: "telegram",
    platform: "telegram",
    status: "ready",
    supports: ["probe", "send", "roundtrip", "agent"],
    normalizeTarget: vi.fn((target) => ({ id: target.id, metadata: target.metadata })),
    probe: vi.fn(async () => ({ details: [], healthy: true })),
    send: vi.fn(async (params) => ({
      accepted: true,
      messageId: "driver-message-1",
      threadId: `${params.providerId}:dm:alice`,
    })),
    waitForInbound: vi
      .fn()
      .mockResolvedValueOnce({
        author: "assistant",
        id: "mock-message-1",
        provider: "telegram",
        sentAt: new Date().toISOString(),
        text: "[telegram mock] DM baseline marker check.",
        threadId: "telegram:dm:alice",
      })
      .mockResolvedValue(null),
    cleanup: vi.fn(async () => {}),
    ...overrides,
  } satisfies QaCrablineProviderAdapter;
  return provider;
}

describe("crabline transport", () => {
  it("configures a local mock transport without live channel plugins or secrets", async () => {
    const outputDir = await createTempOutputDir();
    const transport = await createQaCrablineTransportAdapter({
      env: {},
      outputDir,
      runtime: {
        provider: createProvider(),
      },
      selection: createSelection(),
      state: createQaBusState(),
    });

    expect(transport.id).toBe("crabline");
    expect(transport.requiredPluginIds).toEqual([]);
    expect(transport.createGatewayConfig({ baseUrl: "http://127.0.0.1:1" })).toEqual({});
    expect(transport.createChannelDriverSmokeEnv?.({})).toEqual({});
    expect(transport.buildAgentDelivery({ target: "dm:alice" })).toEqual({
      channel: "telegram",
      replyChannel: "telegram",
      replyTo: "telegram:dm:alice",
    });

    const manifest = JSON.parse(
      await fs.readFile(path.join(outputDir, "crabline-runtime.json"), "utf8"),
    ) as {
      providers?: Record<string, unknown>;
    };
    expect(manifest.providers).toHaveProperty("telegram");
    await transport.cleanup?.();
  });

  it("supports non-Telegram Crabline mock channels", async () => {
    const provider = createProvider({
      send: vi.fn(async () => ({
        accepted: true,
        messageId: "slack-send-1",
        threadId: "slack:dm:alice",
      })),
      waitForInbound: vi.fn(async () => null),
    });
    const outputDir = await createTempOutputDir();
    const transport = await createQaCrablineTransportAdapter({
      outputDir,
      runtime: { provider },
      selection: createSelection("slack"),
      state: createQaBusState(),
    });

    expect(transport.label).toBe("crabline + slack");
    expect(transport.buildAgentDelivery({ target: "channel:C123" })).toEqual({
      channel: "slack",
      replyChannel: "slack",
      replyTo: "slack:channel:C123",
    });
    const manifest = JSON.parse(
      await fs.readFile(path.join(outputDir, "crabline-runtime.json"), "utf8"),
    ) as {
      providers?: Record<string, unknown>;
    };
    expect(manifest.providers).toHaveProperty("slack");
    await transport.cleanup?.();
  });

  it("sends scenario inbound messages through Crabline and mirrors mock replies", async () => {
    const provider = createProvider();
    const transport = await createQaCrablineTransportAdapter({
      observeIdleMs: 1,
      observeTimeoutMs: 200,
      outputDir: await createTempOutputDir(),
      runtime: {
        provider,
      },
      selection: createSelection(),
      state: createQaBusState(),
    });

    await transport.state.addInboundMessage({
      conversation: {
        id: "alice",
        kind: "direct",
      },
      senderId: "alice",
      senderName: "Alice",
      text: "DM baseline marker check.",
    });

    await transport.state.waitFor({
      direction: "outbound",
      kind: "message-text",
      textIncludes: "[telegram mock]",
      timeoutMs: 500,
    });

    expect(provider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "agent",
        providerId: "telegram",
        text: "DM baseline marker check.",
      }),
    );
    expect(provider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        fixture: expect.objectContaining({
          target: {
            id: "dm:alice",
            metadata: {},
          },
        }),
      }),
    );
    expect(transport.state.getSnapshot().messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          conversation: expect.objectContaining({
            id: "alice",
            kind: "direct",
          }),
          direction: "outbound",
          text: "[telegram mock] DM baseline marker check.",
        }),
      ]),
    );
    await transport.cleanup?.();
    expect(provider.cleanup).toHaveBeenCalled();
  });
});
