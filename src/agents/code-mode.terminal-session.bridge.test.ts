/**
 * Regression coverage for the live "sessionId required" code-mode bridge failure
 * (deployed build 8c417e9a6c7c, failing since 2026-08-28T00:29Z).
 *
 * Oscar's exec turns that nest a `terminal` read (action=read without a
 * sessionId) fail as `Error: sessionId required at settle (openclaw-code-mode:
 * controller.js:166:49)`, failurePhase=bridge, replaySafe=false.
 *
 * Throw-site: `src/agents/tools/terminal-tool.ts` calls
 * `readToolStringParam(params, "sessionId", { required: true })` for the
 * read/resize/close/input actions; `src/agents/tools/common.ts` turns that into
 * `new ToolInputError(\`${label} required\`)` -> "sessionId required".
 *
 * Bridge half: the guest's pending request rejects with that message and the
 * controller `settle` wrapper re-throws it (controller source `settle`), so an
 * uncaught guest rejection finalizes the exec with failurePhase=bridge and
 * replaySafe=false (code-mode-execution.ts).
 */
import { expectDefined } from "@openclaw/normalization-core";
import { afterEach, describe, expect, it } from "vitest";
import { applyCodeModeCatalog } from "./code-mode.js";
import {
  createCodeModeHarness,
  resetCodeModeTestState,
  runUntilCompleted,
  testing,
} from "./code-mode.test-support.js";
import { createToolSearchCatalogRef } from "./tool-search.js";
import type { AnyAgentTool } from "./tools/common.js";
import { createTerminalTool } from "./tools/terminal-tool.js";

const TERMINAL_SESSION_ID = "term-session-1";

function createFakeTerminalManager() {
  return {
    listAgent: () => [
      {
        sessionId: TERMINAL_SESSION_ID,
        agentId: "oscar",
        shell: "sh",
        cwd: "/tmp",
        attached: true,
        owner: "agent:oscar:main",
        createdAtMs: 0,
      },
      {
        sessionId: "term-session-2",
        agentId: "oscar",
        shell: "sh",
        cwd: "/tmp",
        attached: true,
        owner: "agent:oscar:main",
        createdAtMs: 0,
      },
    ],
    snapshotAgent: (_owner: unknown, sessionId: string) => `buffer of ${sessionId}`,
    resizeAgent: () => ({ ok: true }),
    closeAgent: () => ({ ok: true }),
  };
}

function registerTerminalToolInCodeModeCatalog(params: {
  catalogRef: ReturnType<typeof createToolSearchCatalogRef>;
  config: unknown;
  sessionId: string;
  sessionKey: string;
  runId: string;
  execTool: AnyAgentTool;
  waitTool: AnyAgentTool;
}) {
  const terminal = createTerminalTool({
    agentId: "oscar",
    agentSessionKey: params.sessionKey,
    sessionId: params.sessionId,
    config: {} as never,
    getGatewayContext: () => ({ terminalSessions: createFakeTerminalManager() }) as never,
  });
  applyCodeModeCatalog({
    tools: [params.execTool, params.waitTool, terminal],
    config: params.config as never,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    runId: params.runId,
    catalogRef: params.catalogRef,
  });
  return terminal;
}

describe("code-mode nested terminal read surfaces the terminal tool's sessionId contract", () => {
  afterEach(() => {
    resetCodeModeTestState();
  });

  it("reproduces the live failure: nested terminal read without sessionId fails with phase=bridge and replaySafe=false", async () => {
    const {
      config,
      catalogRef,
      tools: codeModeTools,
    } = createCodeModeHarness({
      agentId: "oscar",
    });
    const execTool = expectDefined(codeModeTools[0], "codeModeTools[0] test invariant");
    const waitTool = expectDefined(codeModeTools[1], "codeModeTools[1] test invariant");
    registerTerminalToolInCodeModeCatalog({
      catalogRef,
      config,
      sessionId: "session-code-mode",
      sessionKey: "agent:oscar:main",
      runId: "run-code-mode",
      execTool,
      waitTool,
    });

    // Mirrors Oscar's failing pattern: the guest calls `terminal({ action: "read" })`
    // without the sessionId it can only obtain from a prior `terminal list` call.
    const details = await runUntilCompleted({
      execTool,
      waitTool,
      code: `
        const buffer = await terminal({ action: "read" });
        return buffer;
      `,
    });

    expect(details.status).toBe("failed");
    expect(details.failurePhase).toBe("bridge");
    expect(details.replaySafe).toBe(false);
    expect(String(details.error)).toContain("sessionId required");
  });

  it("guest-caught nested rejection surfaces the settle wrapper message exactly as reported", async () => {
    const {
      config,
      catalogRef,
      tools: codeModeTools,
    } = createCodeModeHarness({
      agentId: "oscar",
    });
    const execTool = expectDefined(codeModeTools[0], "codeModeTools[0] test invariant");
    const waitTool = expectDefined(codeModeTools[1], "codeModeTools[1] test invariant");
    registerTerminalToolInCodeModeCatalog({
      catalogRef,
      config,
      sessionId: "session-code-mode",
      sessionKey: "agent:oscar:main",
      runId: "run-code-mode",
      execTool,
      waitTool,
    });

    const details = await runUntilCompleted({
      execTool,
      waitTool,
      code: `
        try {
          await terminal({ action: "read" });
          return "no error";
        } catch (error) {
          return String(error);
        }
      `,
    });

    expect(details.status).toBe("completed");
    // Reported live shape: `Error: sessionId required at settle (openclaw-code-mode:controller.js:166:49)`.
    // The guest-facing Error is constructed inside the controller `settle` wrapper
    // (controller source `settle`), so the message is the nested handler message.
    expect(String(details.value)).toContain("sessionId required");
  });

  it("direct tool path requires sessionId for read but not for list (tool contract, not bridge injection)", async () => {
    const {
      config,
      catalogRef,
      tools: codeModeTools,
    } = createCodeModeHarness({
      agentId: "oscar",
    });
    const execTool = expectDefined(codeModeTools[0], "codeModeTools[0] test invariant");
    const waitTool = expectDefined(codeModeTools[1], "codeModeTools[1] test invariant");
    const terminal = registerTerminalToolInCodeModeCatalog({
      catalogRef,
      config,
      sessionId: "session-code-mode",
      sessionKey: "agent:oscar:main",
      runId: "run-code-mode",
      execTool,
      waitTool,
    });

    // Same missing-sessionId call through the direct (non-bridge) path rejects
    // with the identical message: the bridge does not fabricate the error.
    await expect(terminal.execute("direct-read", { action: "read" })).rejects.toThrow(
      "sessionId required",
    );

    // list is the intended discovery action and works without sessionId.
    const listed = await terminal.execute("direct-list", { action: "list" });
    expect(listed.details).toMatchObject({
      sessions: [{ sessionId: TERMINAL_SESSION_ID }, { sessionId: "term-session-2" }],
    });
  });

  it("nested terminal read succeeds once the guest supplies the sessionId from a prior list", async () => {
    const {
      config,
      catalogRef,
      tools: codeModeTools,
    } = createCodeModeHarness({
      agentId: "oscar",
    });
    const execTool = expectDefined(codeModeTools[0], "codeModeTools[0] test invariant");
    const waitTool = expectDefined(codeModeTools[1], "codeModeTools[1] test invariant");
    registerTerminalToolInCodeModeCatalog({
      catalogRef,
      config,
      sessionId: "session-code-mode",
      sessionKey: "agent:oscar:main",
      runId: "run-code-mode",
      execTool,
      waitTool,
    });

    const details = await runUntilCompleted({
      execTool,
      waitTool,
      code: `
        const listed = await terminal({ action: "list" });
        const read = await terminal({ action: "read", sessionId: listed.sessions[0].sessionId });
        return read.text;
      `,
    });

    expect(details.status).toBe("completed");
    expect(details.value).toBe(`buffer of ${TERMINAL_SESSION_ID}`);
    expect(testing.activeRuns.size).toBe(0);
  });
});

describe("single-session fallback (patched behavior)", () => {
  it("resolves the caller's only terminal when sessionId is omitted", async () => {
    const manager = createFakeTerminalManager();
    manager.listAgent = () => [
      {
        sessionId: "term-only",
        agentId: "oscar",
        shell: "sh",
        cwd: "/tmp",
        attached: true,
        owner: "agent:oscar:main",
        createdAtMs: 0,
      },
    ];
    const terminal = createTerminalTool({
      getGatewayContext: () => ({ terminalSessions: manager }) as never,
      agentId: "oscar",
      agentSessionKey: "agent:oscar:main",
      sessionId: "session-fallback",
    });
    const result = await terminal.execute("fallback-read", { action: "read" });
    const json = JSON.stringify(result);
    expect(json).toContain("term-only");
  });
});
