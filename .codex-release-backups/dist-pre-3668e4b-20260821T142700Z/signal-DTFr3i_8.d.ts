//#region src/agents/failover/signal.d.ts
/** Persisted and wire-visible failover reason codes. Spellings are frozen. */
declare const FAILOVER_REASONS: readonly ["auth", "auth_permanent", "format", "rate_limit", "overloaded", "billing", "server_error", "timeout", "tls_certificate", "context_overflow", "model_not_found", "session_expired", "empty_response", "no_error_details", "unclassified", "unknown"];
type FailoverReason = (typeof FAILOVER_REASONS)[number];
//#endregion
export { FailoverReason as t };