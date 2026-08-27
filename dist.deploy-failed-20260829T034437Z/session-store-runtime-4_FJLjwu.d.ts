import { E as ThinkingLevelMap } from "./types-DTWCh4Mv.js";
import "./types-Cc0P-Eyx.js";
import { n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import "./types-Kt4lh6nX.js";
import { a as ModelMediaInputConfig, n as ModelApi, r as ModelCompatConfig } from "./types.models-BxGvs1Ab.js";
import "./types-Ds34fJCS.js";
import { D as ModelCatalogStatus } from "./manifest-registry-BvU-V0_L.js";
import "./delivery-context.shared-tkGLbkan.js";
import "./sessions-6q8pRxwr.js";
import "./session-manager-Dxs2hJ-i.js";
import "./transcript-BIEElU_3.js";
import "./session-transcript-runtime-DbXRGJ98.js";
//#region src/plugins/provider-catalog-outcome.d.ts
type ProviderCatalogOutcome = {
  provider: string;
  /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  status: "ready" | "auth-rejected" | "unavailable";
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
type ModelContextWindowOption = {
  id: string;
  label: string;
  contextWindow: number;
};
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
  /** Provider-owned strongest-first picker order; internal and never projected to clients. */
  providerOrder?: number;
  alias?: string;
  api?: ModelApi;
  /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextWindows?: ModelContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  reasoning?: boolean;
  /** Config-authored reasoning override; internal provenance, never project to clients. */
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  /** Provider-owned effort support for this exact physical model route. */
  thinkingLevelMap?: ThinkingLevelMap;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
};
/** Logical catalog rows plus the physical variants used for route selection. */
type ModelCatalogSnapshot = {
  entries: ModelCatalogEntry[];
  routeVariants: ModelCatalogEntry[];
  /** Provider-owned outcome of each live catalog request in this generation. */
  providerOutcomes?: readonly ProviderCatalogOutcome[];
  /** Static provider-hook rows captured alongside the full lifecycle generation. */
  staticEntries?: ModelCatalogEntry[];
  /**
   * `false` only when this snapshot came from a degraded load (discovery threw,
   * static or empty fallback). Absent/`true` means authoritative — consumers that
   * destroy durable state (e.g. resetting a pinned model override) must treat only
   * an explicit `false` as degraded, so unrelated hand-built snapshots stay safe.
   */
  authoritative?: boolean;
};
//#endregion
//#region src/agents/agent-scope.d.ts
declare function resolveSessionAgentIds(params: {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string | undefined;
  fallbackAgentId?: string;
}): {
  defaultAgentId: string;
  sessionAgentId: string;
};
//#endregion
export { ProviderCatalogOutcome as i, ModelCatalogEntry as n, ModelCatalogSnapshot as r, resolveSessionAgentIds as t };