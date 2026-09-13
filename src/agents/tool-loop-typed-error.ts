// Typed-error retry identity for loop detection: tool error contracts stamp
// codes like EXPECTED_VERSION_CONFLICT, and retries rotate arguments, so every
// identical-args detector misses the storm. Identity = outer tool (+ dispatched
// inner id) + typed code, args-agnostic by design. Exec is excluded: it owns its
// own failure identity and no-progress handling.
import { sha256Hex } from "../infra/crypto-digest.js";
import type { ToolCallRecord } from "../logging/diagnostic-session-state.js";
import {
  TOOL_LOOP_TYPED_ERROR_CRITICAL_THRESHOLD,
  TOOL_LOOP_TYPED_ERROR_WARNING_THRESHOLD,
} from "./tool-loop-thresholds.js";
import { tryReadToolSearchId } from "./tool-search-id.js";
import { TOOL_CALL_RAW_TOOL_NAME } from "./tool-search-types.js";

export type TypedErrorIdentity = Pick<
  ToolCallRecord,
  "failureIdentityHash" | "failureIdentityFamily" | "typedErrorCode"
>;

// Tool error contracts stamp uppercase snake codes (typed_code=EXPECTED_VERSION_CONFLICT
// in free text, "typed_code":"..." in JSON). The bound keeps a pathological run-on
// capture from bloating records and prompts; a truncated code still hashes stably.
const TYPED_ERROR_CODE_PATTERN = /typed_code"?\s*[:=]\s*"?([A-Z0-9_]{2,64})/;

function extractTypedErrorCode(text: string): string | undefined {
  return TYPED_ERROR_CODE_PATTERN.exec(text)?.[1];
}

// The family is what admission can match before the next result exists:
// `tool_call` folds its dispatched catalog tool id (story reads and story
// controls are different families), every other tool is its own family.
function resolveTypedFailureFamily(toolName: string, params: unknown): string | undefined {
  if (toolName !== TOOL_CALL_RAW_TOOL_NAME) {
    return toolName;
  }
  const innerId = tryReadToolSearchId(params);
  return innerId ? `${toolName}:${innerId}` : undefined;
}

export function readTypedErrorIdentity(
  toolName: string,
  params: unknown,
  text: string,
): TypedErrorIdentity | undefined {
  if (toolName === "exec") {
    return undefined;
  }
  const typedErrorCode = extractTypedErrorCode(text);
  const family = typedErrorCode ? resolveTypedFailureFamily(toolName, params) : undefined;
  if (!typedErrorCode || !family) {
    return undefined;
  }
  return {
    failureIdentityHash: sha256Hex(`${family}:${typedErrorCode}`),
    failureIdentityFamily: family,
    typedErrorCode,
  };
}

/**
 * Count this call's typed failure family in the (run-scoped) history. Anchored
 * on the most recent stamped record of the family so rotated codes (A, A, B, B)
 * stay separate identities, counted args-agnostically across interleaved
 * successes — the exact shape identical-args detectors cannot see.
 */
function detectTypedErrorRepeat(
  history: readonly ToolCallRecord[],
  toolName: string,
  params: unknown,
): { count: number; typedErrorCode?: string } {
  const family = resolveTypedFailureFamily(toolName, params);
  if (!family) {
    return { count: 0 };
  }
  let anchor: ToolCallRecord | undefined;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const record = history[i];
    if (record?.failureIdentityFamily === family && record.failureIdentityHash) {
      anchor = record;
      break;
    }
  }
  if (!anchor) {
    return { count: 0 };
  }
  const failureIdentityHash = anchor.failureIdentityHash;
  return {
    count: history.filter((record) => record.failureIdentityHash === failureIdentityHash).length,
    typedErrorCode: anchor.typedErrorCode,
  };
}

export type TypedErrorRepeatIntervention = {
  level: "warning" | "critical";
  count: number;
  message: string;
  warningKey: string;
};

/**
 * Warning names the typed code and the park-and-end remediation (the contract's
 * single retry is spent); critical blocks the call. Both keep the agent on a
 * visible outcome — never a dead end.
 */
export function detectTypedErrorRepeatIntervention(
  history: readonly ToolCallRecord[],
  toolName: string,
  params: unknown,
): TypedErrorRepeatIntervention | undefined {
  const repeat = detectTypedErrorRepeat(history, toolName, params);
  const code = repeat.typedErrorCode ?? "unknown";
  const warningKey = `typed-error:${toolName}:${code}`;
  if (repeat.count >= TOOL_LOOP_TYPED_ERROR_CRITICAL_THRESHOLD) {
    return {
      level: "critical",
      count: repeat.count,
      message:
        `CRITICAL: ${toolName} failed ${repeat.count} times in this run with the same typed error (${code}) ` +
        `even as the arguments changed. Session execution blocked to prevent resource waste. Do not retry this call again: ` +
        `record the outcome, park or roll back the affected target, and end the turn with a final summary of what remains blocked.`,
      warningKey,
    };
  }
  if (repeat.count >= TOOL_LOOP_TYPED_ERROR_WARNING_THRESHOLD) {
    return {
      level: "warning",
      count: repeat.count,
      message:
        `WARNING: ${toolName} has failed ${repeat.count} times in this run with the same typed error (${code}) ` +
        `even as the arguments changed. A typed failure earns at most one retry and that retry is spent. Stop retrying: ` +
        `record the outcome, park or roll back the affected target, and end the turn with a final summary of what remains blocked.`,
      warningKey,
    };
  }
  return undefined;
}
