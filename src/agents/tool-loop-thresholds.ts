export const TOOL_LOOP_WARNING_THRESHOLD = 10;

// A typed tool-error contract earns exactly one retry; a third identical typed
// failure within one run (same identity, any arguments) is already off-contract
// and only the fifth hard-stops the call, so legitimate contention retries stay
// silent and successes are never vetoed.
export const TOOL_LOOP_TYPED_ERROR_WARNING_THRESHOLD = 3;
export const TOOL_LOOP_TYPED_ERROR_CRITICAL_THRESHOLD = 5;

export function resolveToolLoopWarningThreshold(): number {
  // Numeric loop tuning was retired in #111382. Keep every admission path on
  // the same built-in threshold so policy rewrites cannot drift from detection.
  return TOOL_LOOP_WARNING_THRESHOLD;
}
