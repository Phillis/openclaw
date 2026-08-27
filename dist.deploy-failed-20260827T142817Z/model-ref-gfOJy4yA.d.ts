import { t as FailoverReason } from "./signal-DTFr3i_8.js";
import { t as ProviderModelRef } from "./model-catalog-refs-BnIZkSu-.js";

//#region src/agents/failover-error.d.ts
type CliTimeoutContext = {
  mode: "overall" | "no-output";
  timeoutSeconds: number;
  observedActivity: boolean;
  activeToolCount: number;
  backgroundTaskCount: number;
};
type FallbackAttemptRecord = {
  provider: string;
  model: string;
  reason: FailoverReason;
  status?: number;
  error?: string;
};
/** Structured error used to carry model fallback/failover metadata across layers. */
declare class FailoverError extends Error {
  readonly reason: FailoverReason;
  readonly provider?: string;
  readonly model?: string;
  readonly profileId?: string;
  readonly authMode?: string;
  readonly status?: number;
  readonly code?: string;
  readonly rawError?: string;
  readonly authProfileFailure?: {
    allInCooldown: boolean;
  };
  readonly sessionId?: string;
  readonly lane?: string;
  readonly suspend?: boolean;
  readonly cliTimeout?: CliTimeoutContext;
  readonly attempts?: readonly FallbackAttemptRecord[];
  readonly soonestCooldownExpiry?: number | null;
  constructor(message: string, params: {
    reason: FailoverReason;
    provider?: string;
    model?: string;
    profileId?: string;
    authMode?: string;
    status?: number;
    code?: string;
    rawError?: string;
    authProfileFailure?: {
      allInCooldown: boolean;
    };
    sessionId?: string;
    lane?: string;
    cause?: unknown;
    suspend?: boolean;
    cliTimeout?: CliTimeoutContext;
    attempts?: readonly FallbackAttemptRecord[];
    soonestCooldownExpiry?: number | null;
  });
}
/** Return true for native or serialized failover errors. */
declare function isFailoverError(err: unknown): err is FailoverError;
/** Convert a failover or raw error into structured fields for logs/UI. */
declare function describeFailoverError(err: unknown): {
  message: string;
  rawError?: string;
  reason?: FailoverReason;
  status?: number;
  code?: string;
  provider?: string;
  model?: string;
  profileId?: string;
  authMode?: string;
  sessionId?: string;
  lane?: string;
};
//#endregion
//#region packages/media-generation-core/src/model-ref.d.ts
/** Parses strict generation model refs and rejects missing provider or model segments. */
declare function parseGenerationModelRef(raw: string | undefined): ProviderModelRef | null;
//#endregion
export { describeFailoverError as n, isFailoverError as r, parseGenerationModelRef as t };