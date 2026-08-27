import { n as ModelApi } from "./types.models-Dfmf90bZ.js";

//#region src/plugin-sdk/provider-model-types.d.ts
type ProviderModelRouteSource = {
  api?: ModelApi | null;
  baseUrl?: unknown;
};
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */compatibleIds: readonly string[];
};
type ProviderModelRouteCandidate = {
  api: ModelApi;
  baseUrl: string;
  authRequirement: ProviderModelRouteAuthRequirement; /** Secret-free summary of request behavior the selected runtime must reproduce. */
  requestTransportOverrides: ProviderRouteOverridePresence; /** Provider-owned native-runtime compatibility for this concrete route. */
  runtimePolicy?: ProviderModelRouteRuntimePolicy;
};
type ProviderModelRouteResolution = {
  kind: "routes";
  routes: readonly [ProviderModelRouteCandidate, ...ProviderModelRouteCandidate[]]; /** Advisory only; authored agentRuntime policy remains authoritative. */
  defaultRuntimeId?: string;
} | {
  kind: "indeterminate"; /** Advisory only; preserves the provider's implicit runtime while route facts are absent. */
  defaultRuntimeId?: string;
} | {
  kind: "incompatible";
  code: string;
  message: string;
};
type ProviderResolveModelRoutesContext = {
  provider: string;
  modelId?: string; /** Effective secret-free request behavior for this provider/model pair. */
  requestTransportOverrides?: ProviderRouteOverridePresence;
  configuredModel?: ProviderModelRouteSource;
  configuredProvider?: ProviderModelRouteSource; /** Environment view; the provider owns interpretation of its variables. */
  env?: Readonly<Record<string, string | undefined>>; /** Physical route facts for one logical model; input order is not preference. */
  observedRoutes?: readonly ProviderModelRouteSource[];
};
type ProviderNormalizeModelCatalogIdContext = {
  provider: string;
  modelId: string;
};
/** Compares reported response identity without rewriting authored route identity. */
type ProviderResponseModelEquivalenceContext = {
  provider: string;
  requestedModelId: string;
  responseModelId: string;
};
//#endregion
export { ProviderModelRouteSource as a, ProviderResponseModelEquivalenceContext as c, ProviderModelRouteRuntimePolicy as i, ProviderRouteOverridePresence as l, ProviderModelRouteCandidate as n, ProviderNormalizeModelCatalogIdContext as o, ProviderModelRouteResolution as r, ProviderResolveModelRoutesContext as s, ProviderModelRouteAuthRequirement as t };