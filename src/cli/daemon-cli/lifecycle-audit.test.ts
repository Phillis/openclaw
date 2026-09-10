// CLI lifecycle audit tests cover parent-process attribution on lifecycle lines.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { appendGatewayLifecycleAudit } from "./lifecycle-audit.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("gateway lifecycle audit parent attribution", () => {
  it("records the CLI process parent pid and bounded parent command", () => {
    const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-cli-lifecycle-audit-"));
    tempDirs.push(stateDir);

    appendGatewayLifecycleAudit({
      action: "restart",
      source: "cli",
      mode: "enable",
      env: { OPENCLAW_STATE_DIR: stateDir },
    });

    const line = fs.readFileSync(path.join(stateDir, "logs", "gateway-restart.log"), "utf8");
    expect(line).toContain("source=cli");
    expect(line).toContain("action=restart");
    expect(line).toContain("mode=enable");
    expect(line).toContain(`ppid=${process.ppid}`);
    if (process.platform === "win32") {
      expect(line).not.toContain("ppid_cmd=");
    } else {
      expect(line).toMatch(/ppid_cmd=\S/);
    }
  });
});
