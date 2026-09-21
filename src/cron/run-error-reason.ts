import { resolveFailoverReasonFromError } from "../agents/failover-error.js";
import type { FailoverReason } from "../agents/failover/signal.js";
import type { CronRunErrorClassification } from "./types.js";

/** Resolve one cron-owned classification before falling back to provider error inference. */
export function resolveCronRunErrorReason(
  error: unknown,
  provider?: string,
  classification?: CronRunErrorClassification,
): FailoverReason | undefined {
  if (classification?.kind === "permanent") {
    return undefined;
  }
  if (classification?.kind === "local_transient") {
    // A definitive LOCAL observation (e.g. the heartbeat zero-transcript
    // watchdog) must stay circuit-neutral: persisting a provider failover
    // reason would attribute a local wedge to the provider and pollute the
    // classified-authoritative lane of every later retry decision.
    return undefined;
  }
  if (classification?.kind === "reason") {
    return classification.reason;
  }
  return resolveFailoverReasonFromError(error, provider) ?? undefined;
}
