import { describe, expect, it, vi } from "vitest";
import {
  createOpenAIResponsesTransportHealth,
  createOpenAIResponsesTransportHealthFetch,
  OpenAIResponsesCircuitBreaker,
  OpenAIResponsesConcurrencyGate,
  OpenAIResponsesTransportOpenError,
  parseRateLimitResetSeconds,
  resolveOpenAIResponsesTransportRetryDelayMs,
  resolveRateLimitResetSeconds,
  resolveRetryAfterHintMs,
  unwrapOpenAIResponsesTransportOpenError,
} from "./openai-responses-transport-health.js";

const NOW = 1_780_000_000_000;

function fakeResponse(status: number, headerInit: Record<string, string> = {}): Response {
  return new Response(null, { status, headers: headerInit });
}

// HTTP-date convenience generator. Retry-After HTTP-date is resolved against
// the real clock (parseRetryAfterHttpDateMs uses Date.now internally), so the
// generated date must be in the future relative to the actual wall clock.
function httpDate(gmtSecondsAhead: number): string {
  return new Date(Date.now() + gmtSecondsAhead * 1000).toUTCString();
}

type TestHealth = {
  health: ReturnType<typeof createOpenAIResponsesTransportHealth>;
  advance: (ms: number) => void;
  sleeps: number[];
  now: number;
};

function makeHealth(options?: { maxConcurrency?: number; maxRetries?: number }): TestHealth {
  let now = NOW;
  const sleeps: number[] = [];
  const health = createOpenAIResponsesTransportHealth({
    maxConcurrency: options?.maxConcurrency ?? 4,
    maxRetries: options?.maxRetries ?? 3,
    random: () => 0,
    nowMs: () => now,
    sleep: async (ms) => {
      sleeps.push(ms);
      now += ms;
    },
  });
  return {
    health,
    advance: (ms) => (now += ms),
    sleeps,
    get now() {
      return now;
    },
  };
}

function wrap(
  underlying: typeof fetch,
  testHealth: TestHealth,
  key = "transport-key",
): typeof fetch {
  return createOpenAIResponsesTransportHealthFetch(underlying, testHealth.health, key);
}

// ---------------------------------------------------------------------------
// Header parsing: Retry-After and x-ratelimit-reset-*
// ---------------------------------------------------------------------------

describe("Retry-After / x-ratelimit header parsing", () => {
  it("parses Retry-After seconds", () => {
    expect(resolveRetryAfterHintMs(new Headers({ "retry-after": "30" }), NOW)).toBe(30_000);
  });

  it("parses Retry-After HTTP-date", () => {
    const waitMs = resolveRetryAfterHintMs(new Headers({ "retry-after": httpDate(45) }), NOW);
    expect(waitMs).toBeGreaterThan(44_000);
    expect(waitMs).toBeLessThan(45_500);
  });

  it("parses x-ratelimit-reset-requests as relative seconds", () => {
    expect(
      resolveRateLimitResetSeconds(new Headers({ "x-ratelimit-reset-requests": "17.5" }), NOW),
    ).toBe(17.5);
  });

  it("parses x-ratelimit-reset-tokens as absolute epoch seconds", () => {
    const epochSeconds = (NOW + 120_000) / 1000;
    expect(parseRateLimitResetSeconds(String(epochSeconds), NOW)).toBeCloseTo(120);
  });

  it("combines requests and tokens by taking the larger wait", () => {
    const headers = new Headers({
      "x-ratelimit-reset-requests": "3",
      "x-ratelimit-reset-tokens": "9",
    });
    expect(resolveRateLimitResetSeconds(headers, NOW)).toBe(9);
  });
});

// ---------------------------------------------------------------------------
// Backoff schedule
// ---------------------------------------------------------------------------

describe("backoff schedule", () => {
  it("is monotonic exponential when no headers are present", () => {
    const headers = new Headers();
    const d0 = resolveOpenAIResponsesTransportRetryDelayMs(0, headers, NOW, { random: () => 0 });
    const d1 = resolveOpenAIResponsesTransportRetryDelayMs(1, headers, NOW, { random: () => 0 });
    const d2 = resolveOpenAIResponsesTransportRetryDelayMs(2, headers, NOW, { random: () => 0 });
    expect(d0).toBe(1_000);
    expect(d1).toBe(2_000);
    expect(d2).toBe(4_000);
    expect(d1).toBeGreaterThan(d0);
    expect(d2).toBeGreaterThan(d1);
  });

  it("honors Retry-After over the exponential fallback", () => {
    const headers = new Headers({ "retry-after": "12" });
    expect(resolveOpenAIResponsesTransportRetryDelayMs(0, headers, NOW, { random: () => 0 })).toBe(
      12_000,
    );
  });

  it("caps per-attempt delay at maxBackoffMs even when the server asks for more", () => {
    const headers = new Headers({ "retry-after": "600" });
    expect(
      resolveOpenAIResponsesTransportRetryDelayMs(0, headers, NOW, {
        maxBackoffMs: 60_000,
        random: () => 0,
      }),
    ).toBe(60_000);
  });

  it("bounded jitter stays within the cap", () => {
    const headers = new Headers();
    expect(
      resolveOpenAIResponsesTransportRetryDelayMs(0, headers, NOW, {
        maxBackoffMs: 50_000,
        jitterMs: 250,
        random: () => 1,
      }),
    ).toBe(1_000 + 250);
  });
});

// ---------------------------------------------------------------------------
// Concurrency gate
// ---------------------------------------------------------------------------

describe("concurrency gate", () => {
  it("caps concurrent in-flight requests", async () => {
    const gate = new OpenAIResponsesConcurrencyGate(2);
    let active = 0;
    let peak = 0;
    const run = async (): Promise<void> => {
      const release = await gate.acquire();
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      active -= 1;
      release();
    };
    await Promise.all([run(), run(), run(), run(), run()]);
    expect(peak).toBe(2);
    expect(gate.inFlight).toBe(0);
  });

  it("queues waiters FIFO until a slot frees", async () => {
    const gate = new OpenAIResponsesConcurrencyGate(1);
    const first = await gate.acquire();
    expect(gate.pending).toBe(0);
    let thirdResolved = false;
    void gate.acquire().then((release) => {
      thirdResolved = true;
      release();
    });
    expect(gate.pending).toBe(1);
    expect(thirdResolved).toBe(false);
    first();
    await vi.waitFor(() => expect(thirdResolved).toBe(true));
    expect(gate.pending).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Circuit breaker
// ---------------------------------------------------------------------------

describe("circuit breaker", () => {
  it("opens after the consecutive-429 threshold within the window", () => {
    const breaker = new OpenAIResponsesCircuitBreaker(5, 60_000, 120_000);
    for (let i = 0; i < 4; i++) {
      breaker.observe(429, NOW + i);
    }
    expect(breaker.snapshot(NOW + 4).state).toBe("closed");
    breaker.observe(429, NOW + 5);
    const snapshot = breaker.snapshot();
    expect(snapshot.state).toBe("open");
    expect(snapshot.openUntilMs).toBeGreaterThan(NOW);
  });

  it("respects a server Retry-After hint longer than the cooldown", () => {
    const breaker = new OpenAIResponsesCircuitBreaker(5, 60_000, 120_000);
    for (let i = 0; i < 5; i++) {
      breaker.observe(429, NOW + i, i === 4 ? 300_000 : undefined);
    }
    // The 5th 429 (i==4) trips the breaker at nowMs NOW+4 with the 300s hint.
    const snapshot = breaker.snapshot();
    expect(snapshot.state).toBe("open");
    expect(snapshot.openUntilMs).toBe(NOW + 4 + 300_000);
  });

  it("recovers through half-open after the pause", () => {
    const breaker = new OpenAIResponsesCircuitBreaker(5, 60_000, 120_000);
    for (let i = 0; i < 5; i++) {
      breaker.observe(429, NOW + i);
    }
    expect(breaker.snapshot(NOW + 130_000).state).toBe("half-open");
    breaker.observe(200, NOW + 130_000);
    expect(breaker.snapshot().state).toBe("closed");
  });

  it("reopens from half-open on a failed probe", () => {
    const breaker = new OpenAIResponsesCircuitBreaker(5, 60_000, 120_000);
    for (let i = 0; i < 5; i++) {
      breaker.observe(429, NOW + i);
    }
    expect(breaker.snapshot(NOW + 130_000).state).toBe("half-open");
    breaker.observe(429, NOW + 130_000);
    expect(breaker.snapshot().state).toBe("open");
  });
});

// ---------------------------------------------------------------------------
// Fetch wrapper: retry, exhaustion, fail-fast typed error
// ---------------------------------------------------------------------------

describe("transport health fetch wrapper", () => {
  it("retries a 429 honoring Retry-After and then succeeds", async () => {
    const test = makeHealth();
    const underlying = vi
      .fn()
      .mockResolvedValueOnce(fakeResponse(429, { "retry-after": "2" }))
      .mockResolvedValueOnce(fakeResponse(429, { "retry-after": "2" }))
      .mockResolvedValueOnce(fakeResponse(200));
    const response = await wrap(underlying, test)("https://example.invalid", { method: "POST" });
    expect(response.status).toBe(200);
    expect(underlying).toHaveBeenCalledTimes(3);
    expect(test.sleeps).toHaveLength(2);
    expect(test.sleeps[0]).toBe(2000);
    expect(test.sleeps[1]).toBe(2000);
  });

  it("returns the terminal non-2xx after max retries are exhausted", async () => {
    const test = makeHealth();
    const underlying = vi.fn().mockResolvedValue(fakeResponse(429, { "retry-after": "1" }));
    const response = await wrap(underlying, test)("https://example.invalid", {});
    expect(response.status).toBe(429);
    expect(underlying).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  it("retries a thrown connection error", async () => {
    const test = makeHealth();
    const underlying = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(fakeResponse(200));
    const response = await wrap(underlying, test)("https://example.invalid", {});
    expect(response.status).toBe(200);
    expect(underlying).toHaveBeenCalledTimes(2);
  });

  it("fail-fast with a typed error while the breaker is open", async () => {
    const test = makeHealth();
    for (let i = 0; i < 5; i++) {
      test.health.breaker.observe(429, test.now);
    }
    expect(test.health.breaker.snapshot(test.now).state).toBe("open");
    const underlying = vi.fn().mockResolvedValue(fakeResponse(200));
    await expect(
      wrap(underlying, test)("https://example.invalid", { method: "POST" }),
    ).rejects.toBeInstanceOf(OpenAIResponsesTransportOpenError);
    expect(underlying).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Typed error unwrapping
// ---------------------------------------------------------------------------

describe("typed error unwrapping", () => {
  it("recovers the typed error through an SDK-style cause chain", () => {
    const open = new OpenAIResponsesTransportOpenError("k", 1234);
    const sdkWrapped = new Error("Connection error.", { cause: open });
    expect(unwrapOpenAIResponsesTransportOpenError(sdkWrapped)).toBe(open);
    expect(unwrapOpenAIResponsesTransportOpenError(new Error("plain"))).toBeUndefined();
  });
});
