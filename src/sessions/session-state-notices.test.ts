// Session-state notice context key decoding: strict UTF-8 after hex validation.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestHeartbeat } from "../infra/heartbeat-wake.js";
import { enqueueSystemEvent } from "../infra/system-events.js";
import {
  decodeSessionStateNoticeContextKey,
  enqueueSessionStateNotice,
} from "./session-state-notices.js";

vi.mock("../infra/heartbeat-wake.js", () => ({
  requestHeartbeat: vi.fn(),
}));

vi.mock("../infra/system-events.js", () => ({
  enqueueSystemEvent: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(requestHeartbeat).mockClear();
  vi.mocked(enqueueSystemEvent).mockClear();
});

function encodeTarget(sessionKey: string): string {
  return `session-state:${Buffer.from(sessionKey, "utf8").toString("hex")}`;
}

describe("decodeSessionStateNoticeContextKey", () => {
  it("round-trips a valid encoded session key", () => {
    const sessionKey = "agent:main:slack:channel:C01234567";
    expect(decodeSessionStateNoticeContextKey(encodeTarget(sessionKey))).toBe(sessionKey);
  });

  it("round-trips a session key with a leading U+FEFF unchanged", () => {
    const sessionKey = "﻿agent:main";
    expect(decodeSessionStateNoticeContextKey(encodeTarget(sessionKey))).toBe(sessionKey);
  });

  it("rejects a context key whose hex payload is not valid UTF-8", () => {
    // 0xFF is not valid UTF-8; a forgiving decode would return U+FFFD and let a
    // corrupt context key collide with an unrelated watcher cursor.
    expect(decodeSessionStateNoticeContextKey("session-state:ff")).toBeUndefined();
  });

  it("rejects malformed prefixes and hex payloads", () => {
    expect(decodeSessionStateNoticeContextKey("other:ff")).toBeUndefined();
    expect(decodeSessionStateNoticeContextKey("session-state:")).toBeUndefined();
    expect(decodeSessionStateNoticeContextKey("session-state:abc")).toBeUndefined();
    expect(decodeSessionStateNoticeContextKey("session-state:zz")).toBeUndefined();
  });
});

describe("enqueueSessionStateNotice", () => {
  it("coalesces active wakes for 20 seconds and leaves queue-only notices asleep", () => {
    const notice = {
      watcherSessionKey: "agent:main:main",
      targetSessionKey: "agent:main:slack:channel:C01234567",
      lastSeenSequence: 42,
    };

    enqueueSessionStateNotice(notice);
    expect(requestHeartbeat).toHaveBeenCalledWith({
      source: "session-state",
      intent: "immediate",
      reason: `session-state:${notice.targetSessionKey}`,
      sessionKey: notice.watcherSessionKey,
      coalesceMs: 20_000,
    });

    vi.mocked(requestHeartbeat).mockClear();
    enqueueSessionStateNotice({ ...notice, queueOnly: true });
    expect(requestHeartbeat).not.toHaveBeenCalled();
  });

  it("queues the notice without waking for non-main watcher lanes", () => {
    const threadWatcher = "agent:oscar:slack:direct:u0b4khg0mkr:thread:1784430202.983759";
    const notice = {
      watcherSessionKey: threadWatcher,
      targetSessionKey: "agent:billnye:main",
      lastSeenSequence: 25,
    };

    enqueueSessionStateNotice(notice);

    // The durable event stays queued for the lane's next real turn; only the wake
    // is suppressed so restart sweeps cannot start isolated marathons per lane.
    expect(enqueueSystemEvent).toHaveBeenCalledWith(
      expect.stringContaining(`changesSince 25`),
      expect.objectContaining({ sessionKey: threadWatcher }),
    );
    expect(requestHeartbeat).not.toHaveBeenCalled();
  });

  it("wakes the watcher's own main lane as an immediate session-state wake", () => {
    const notice = {
      watcherSessionKey: "agent:oscar:main",
      targetSessionKey: "agent:sara:main",
      lastSeenSequence: 7,
    };

    enqueueSessionStateNotice(notice);

    expect(requestHeartbeat).toHaveBeenCalledTimes(1);
    expect(requestHeartbeat).toHaveBeenCalledWith({
      source: "session-state",
      intent: "immediate",
      reason: "session-state:agent:sara:main",
      sessionKey: "agent:oscar:main",
      coalesceMs: 20_000,
    });
  });

  it("honors a configured non-default main key when deciding wake eligibility", () => {
    const cfg = { session: { mainKey: "primary" } };
    const notice = {
      watcherSessionKey: "agent:oscar:primary",
      targetSessionKey: "agent:sara:main",
      lastSeenSequence: 7,
      cfg,
    };

    enqueueSessionStateNotice(notice);
    expect(requestHeartbeat).toHaveBeenCalledTimes(1);
    expect(requestHeartbeat).toHaveBeenCalledWith(
      expect.objectContaining({ sessionKey: "agent:oscar:primary" }),
    );

    vi.mocked(requestHeartbeat).mockClear();
    enqueueSessionStateNotice({ ...notice, cfg: undefined });
    expect(requestHeartbeat).not.toHaveBeenCalled();
  });

  it("never wakes subagent watchers", () => {
    const notice = {
      watcherSessionKey: "agent:main:subagent:child",
      targetSessionKey: "agent:main:main",
      lastSeenSequence: 3,
    };

    enqueueSessionStateNotice(notice);

    expect(enqueueSystemEvent).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ sessionKey: notice.watcherSessionKey }),
    );
    expect(requestHeartbeat).not.toHaveBeenCalled();
  });
});
