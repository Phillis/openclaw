/**
 * Locks the Code Mode reconciliation mechanism behind the 2026-08-28 tool-flap
 * report ("Current session has only read tool — no exec/catalog/gateway tools
 * available", 05:33Z, after a successful exec at 05:31Z).
 *
 * Chain (all in-tree):
 * 1. A failed code-mode exec with a mid-flight bridge dispatch marks the turn
 *    `codeModeReconciliationCandidate` (`run/code-mode-outcome.ts`).
 * 2. `activateCodeModeReconciliation` (`run/code-mode-reconciliation.ts`) sets
 *    `retryState.forceCodeModeReconciliationTools = true` + the reconciliation
 *    prompt; the SAME turn's next attempt dispatches with it
 *    (`run/attempt-dispatch-preparation.ts`).
 * 3. `resolveAgentToolSurfacePlan` (`tool-surface-plan.ts`) sees
 *    `forceDirectTools: true` → BOTH code-mode and tool-search controls off;
 *    `attempt-tool-prepare.ts` also filters the constructed tools to the
 *    reconciliation allowlist — exactly `["read"]`.
 * Result: one intra-turn, one-shot, by-design read-only inspection round; the
 * next turn (fresh terminalRetryState, `run-loop.ts`) restores the full surface.
 */
import { afterEach, describe, expect, it } from "vitest";
import { resetCodeModeTestState } from "./code-mode.test-support.js";
import {
  activateCodeModeReconciliation,
  isCodeModeReconciliationTool,
} from "./embedded-agent-runner/run/code-mode-reconciliation.js";
import { createEmbeddedRunTerminalRetryState } from "./embedded-agent-runner/run/terminal-retry-state.js";
import type { EmbeddedRunAttemptResult } from "./embedded-agent-runner/run/types.js";
import { resolveAgentToolSurfacePlan } from "./tool-surface-plan.js";

const CODE_MODE_CONFIG = {
  tools: { codeMode: { enabled: true }, toolSearch: { mode: "code" } },
} as never;

function reconciliationCandidateAttempt(): EmbeddedRunAttemptResult {
  // Minimal honest shape for the gating reads in shouldRetryCodeModeReconciliation.
  return {
    codeModeReconciliationCandidate: true,
    terminal: { kind: "ok" },
    itemLifecycle: { startedCount: 1, completedCount: 1, activeCount: 0 },
    clientToolCalls: false,
    yieldDetected: false,
    didSendDeterministicApprovalPrompt: false,
    runtimeContinuationStarted: false,
    toolMetas: [],
    acceptedSessionSpawns: [],
    didSendViaMessagingTool: false,
    successfulCronAdds: 0,
  } as unknown as EmbeddedRunAttemptResult;
}

describe("Code Mode reconciliation read-only surface (mid-session tool flap)", () => {
  afterEach(() => {
    resetCodeModeTestState();
  });

  it("forceDirectTools=true from reconciliation strips BOTH control surfaces (exec/catalog) leaving only direct tools", () => {
    const plan = resolveAgentToolSurfacePlan({
      config: CODE_MODE_CONFIG,
      agentId: "oscar",
      sessionKey: "agent:oscar:main",
      forceDirectMessageTool: false,
      model: { compat: { codeMode: "preferred" } },
      toolsEnabled: true,
      toolsAllow: ["read"],
      forceDirectTools: true,
    });
    // Reproduction: the model sees no exec/wait controls and no tool-search controls.
    expect(plan.codeModeControlsEnabled).toBe(false);
    expect(plan.toolSearchControlsEnabled).toBe(false);
  });

  it("same surface WITHOUT reconciliation stays fully enabled (exec/catalog controls present)", () => {
    const plan = resolveAgentToolSurfacePlan({
      config: CODE_MODE_CONFIG,
      agentId: "oscar",
      sessionKey: "agent:oscar:main",
      forceDirectMessageTool: false,
      model: { compat: { codeMode: "preferred" } },
      toolsEnabled: true,
      toolsAllow: ["read", "exec", "gateway"],
      forceDirectTools: false,
    });
    expect(plan.codeModeControlsEnabled).toBe(true);
  });

  it("activateCodeModeReconciliation arms exactly one read-only retry per turn", () => {
    const retryState = createEmbeddedRunTerminalRetryState();
    const activated = activateCodeModeReconciliation({
      attempt: reconciliationCandidateAttempt(),
      hostOwnsToolSurface: true,
      retryState,
      activateInternalPrompt: () => undefined,
    });
    expect(activated).toBe(true);
    expect(retryState.forceCodeModeReconciliationTools).toBe(true);
    expect(retryState.codeModeReconciliationAttempts).toBe(1);

    // One-shot: a second activation in the same turn is refused.
    const second = activateCodeModeReconciliation({
      attempt: reconciliationCandidateAttempt(),
      hostOwnsToolSurface: true,
      retryState,
      activateInternalPrompt: () => undefined,
    });
    expect(second).toBe(false);
  });

  it("the reconciliation tool allowlist is exactly read (matches attempt-tool-prepare filtering)", () => {
    expect(isCodeModeReconciliationTool({ name: "read" })).toBe(true);
    expect(isCodeModeReconciliationTool({ name: "exec" })).toBe(false);
    expect(isCodeModeReconciliationTool({ name: "terminal" })).toBe(false);
    expect(isCodeModeReconciliationTool({ name: "catalog" })).toBe(false);
    expect(isCodeModeReconciliationTool({ name: "gateway" })).toBe(false);
  });

  it("reconciliation retry is per-turn: a fresh turn restores the full surface", () => {
    // The flag lives in terminalRetryState, which run-loop.ts creates per turn.
    const firstTurn = createEmbeddedRunTerminalRetryState();
    expect(
      activateCodeModeReconciliation({
        attempt: reconciliationCandidateAttempt(),
        hostOwnsToolSurface: true,
        retryState: firstTurn,
        activateInternalPrompt: () => undefined,
      }),
    ).toBe(true);
    const secondTurn = createEmbeddedRunTerminalRetryState();
    expect(secondTurn.forceCodeModeReconciliationTools).toBe(false);
    const plan = resolveAgentToolSurfacePlan({
      config: CODE_MODE_CONFIG,
      agentId: "oscar",
      sessionKey: "agent:oscar:main",
      forceDirectMessageTool: false,
      model: { compat: { codeMode: "preferred" } },
      toolsEnabled: true,
      toolsAllow: ["read", "exec", "gateway"],
      forceDirectTools: false,
    });
    expect(plan.codeModeControlsEnabled).toBe(true);
  });
});
