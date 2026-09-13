import type { ToolCallRecord } from "../logging/diagnostic-session-state.js";

/** Error outcomes hash under this prefix; shared by the outcome writer and the streak reader. */
export const ERROR_RESULT_HASH_PREFIX = "error:";

function isErrorResultRecord(record: ToolCallRecord): boolean {
  return record.resultHash !== undefined && record.resultHash.startsWith(ERROR_RESULT_HASH_PREFIX);
}

export function getNoProgressStreak(
  history: readonly ToolCallRecord[],
  toolName: string,
  argsHash: string,
  options?: { resetOnError?: boolean },
): { count: number; latestResultHash?: string } {
  const resetOnError = options?.resetOnError === true;
  const repeatedArguments = countNoProgressStreak(history, toolName, argsHash, false, resetOnError);
  if (toolName !== "exec") {
    return repeatedArguments;
  }
  // Real terminal failures may repeat across fresh args; only a contiguous typed tail qualifies.
  const terminalFailures = countNoProgressStreak(history, toolName, argsHash, true, resetOnError);
  return terminalFailures.count > repeatedArguments.count ? terminalFailures : repeatedArguments;
}

function countNoProgressStreak(
  history: readonly ToolCallRecord[],
  toolName: string,
  argsHash: string,
  terminalExecFailuresOnly: boolean,
  resetOnError: boolean,
): { count: number; latestResultHash?: string } {
  let streak = 0;
  let latestOutcome: ToolCallRecord | undefined;
  let crossedArgumentBoundary = false;
  // Vetoes are provisional until an older concrete outcome anchors them; a newer
  // changed outcome must reset vetoes from the previous no-progress streak.
  let pendingLoopVetoes = 0;

  for (let i = history.length - 1; i >= 0; i -= 1) {
    const record = history[i];
    if (!record) {
      continue;
    }
    if (record.toolName !== toolName) {
      if (terminalExecFailuresOnly) {
        break;
      }
      continue;
    }
    if (!terminalExecFailuresOnly && record.argsHash !== argsHash) {
      continue;
    }
    if (record.outcomeKind === "tool-loop-veto") {
      pendingLoopVetoes += 1;
      continue;
    }
    if (typeof record.resultHash !== "string" || !record.resultHash) {
      continue;
    }
    if (terminalExecFailuresOnly && record.outcomeKind !== "terminal-exec-failure") {
      break;
    }
    if (!latestOutcome) {
      latestOutcome = record;
      crossedArgumentBoundary = record.argsHash !== argsHash;
      streak = pendingLoopVetoes + 1;
      pendingLoopVetoes = 0;
      continue;
    }
    if (terminalExecFailuresOnly) {
      // Once the scan crosses away from the requested command, finding it again
      // belongs to an older tail. Unique changing arguments can still count together.
      if (crossedArgumentBoundary && record.argsHash === argsHash) {
        break;
      }
      if (record.argsHash !== argsHash) {
        crossedArgumentBoundary = true;
      }
    }
    const repeatsSameFailure =
      terminalExecFailuresOnly &&
      record.failureIdentityHash !== undefined &&
      record.failureIdentityHash === latestOutcome.failureIdentityHash;
    if (record.resultHash !== latestOutcome.resultHash && !repeatsSameFailure) {
      break;
    }
    streak += pendingLoopVetoes + 1;
    pendingLoopVetoes = 0;
  }
  // resetOnError (config-gated): a failed call anchors a legitimate retry, so an
  // error-anchored tail carries no no-progress evidence. Successful identical
  // loops keep counting; the anchor's own error result stays in history.
  if (resetOnError && latestOutcome !== undefined && isErrorResultRecord(latestOutcome)) {
    return { count: 0, latestResultHash: latestOutcome.resultHash };
  }

  return {
    count: latestOutcome ? streak : terminalExecFailuresOnly ? 0 : pendingLoopVetoes,
    latestResultHash: latestOutcome?.resultHash,
  };
}
