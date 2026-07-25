import type { FailoverReason } from "../../embedded-agent-helpers.js";

const FALLBACK_TELEMETRY_REASONS = [
  "auth",
  "auth_permanent",
  "format",
  "rate_limit",
  "overloaded",
  "billing",
  "server_error",
  "timeout",
  "context_overflow",
  "model_not_found",
  "session_expired",
  "empty_response",
  "no_error_details",
  "unclassified",
  "unknown",
] as const satisfies readonly FailoverReason[];

type MissingFallbackTelemetryReason = Exclude<
  FailoverReason,
  (typeof FALLBACK_TELEMETRY_REASONS)[number]
>;

const assertAllFallbackTelemetryReasonsListed: MissingFallbackTelemetryReason extends never
  ? true
  : never = true;
void assertAllFallbackTelemetryReasonsListed;

const fallbackTelemetryReasonSet = new Set<string>(FALLBACK_TELEMETRY_REASONS);

export function resolveFallbackTelemetryReason(
  value: string | null | undefined,
): FailoverReason | null {
  return value && fallbackTelemetryReasonSet.has(value) ? (value as FailoverReason) : null;
}
