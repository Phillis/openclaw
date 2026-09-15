import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { discoverRestartRecoveryStoreTargets } from "../agents/main-session-recovery/main-session-restart-recovery-shared.js";
import { replaceSessionEntry, loadSessionEntry } from "../config/sessions/session-accessor.js";

it("probe2", async () => {
  const stateDir = await fs.mkdtemp(path.join(os.tmpdir(), "probe2-hb-"));
  const prevStateDir = process.env.OPENCLAW_STATE_DIR;
  process.env.OPENCLAW_STATE_DIR = stateDir;
  try {
    const storePath = path.join(stateDir, "sessions.json");
    await replaceSessionEntry(
      { storePath, sessionKey: "agent:main:main:heartbeat" },
      {
        sessionId: "s1",
        status: "running",
        startedAt: Date.now() - 60_000,
        updatedAt: Date.now(),
        heartbeatIsolatedBaseSessionKey: "agent:main:main",
      },
    );
    const loaded = loadSessionEntry({ storePath, sessionKey: "agent:main:main:heartbeat" });
    console.log("loaded back:", JSON.stringify(loaded)?.slice(0, 120));
    console.log(
      "flat file exists:",
      await fs.stat(storePath).then(
        () => true,
        () => false,
      ),
    );
    const cfg = { agents: { entries: { main: {} } }, session: { store: storePath } } as never;
    const all = await discoverRestartRecoveryStoreTargets({ cfg, stateDir });
    console.log("all targets:", JSON.stringify(all));
    const running = await discoverRestartRecoveryStoreTargets({
      cfg,
      stateDir,
      statuses: ["running"],
    });
    console.log("running targets:", JSON.stringify(running));
    expect(true).toBe(true);
  } finally {
    process.env.OPENCLAW_STATE_DIR = prevStateDir;
  }
});
