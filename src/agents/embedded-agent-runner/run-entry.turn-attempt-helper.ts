// Fork: turn-attempt fixture shared by run-entry tests (extracted to keep the
// main test file within the max-lines budget).
import type { ContextEngineTurnAttemptFacts } from "../harness/context-engine-turn-attempt.js";

export function recordTurnAttempt(
  record: ((facts: ContextEngineTurnAttemptFacts) => void) | undefined,
  label: string,
): void {
  if (!record) {
    throw new Error("expected context-engine turn candidate callback");
  }
  record({
    boundary: {
      admission: {
        agentId: "main",
        sessionId: label,
        sessionKey: `agent:main:${label}`,
        storePath: `/${label}.sqlite`,
        generation: "generation-1",
        entryId: `${label}-user`,
        rawSeq: 1,
        effectiveParentId: null,
        activeMessagePosition: 0,
        logicalTurnId: `${label}-turn`,
        role: "user",
      },
      terminal: {
        agentId: "main",
        sessionId: label,
        sessionKey: `agent:main:${label}`,
        storePath: `/${label}.sqlite`,
        generation: "generation-1",
        entryId: `${label}-assistant`,
        rawSeq: 2,
        effectiveParentId: `${label}-user`,
        activeMessagePosition: 1,
      },
    },
    sessionIdUsed: label,
    promptError: false,
    aborted: false,
    yieldAborted: false,
  });
}
