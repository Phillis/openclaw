import { a as ModelApi, c as ModelMediaInputConfig, o as ModelCompatConfig } from "./types.openclaw-a_kGc1gJ.js";
import { T as ModelCatalogStatus } from "./manifest-registry-CRuFk5Rs.js";

//#region src/plugins/provider-catalog-outcome.d.ts
type ProviderCatalogOutcome = {
  provider: string; /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  status: "ready" | "auth-rejected" | "unavailable";
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string; /** Provider-owned strongest-first picker order; internal and never projected to clients. */
  providerOrder?: number;
  alias?: string;
  api?: ModelApi; /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
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
  routeVariants: ModelCatalogEntry[]; /** Provider-owned outcome of each live catalog request in this generation. */
  providerOutcomes?: readonly ProviderCatalogOutcome[]; /** Static provider-hook rows captured alongside the full lifecycle generation. */
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
export { ModelCatalogSnapshot as n, ProviderCatalogOutcome as r, ModelCatalogEntry as t };