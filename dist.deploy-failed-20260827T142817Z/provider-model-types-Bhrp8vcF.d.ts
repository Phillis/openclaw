//#region src/plugin-sdk/provider-model-types.d.ts
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */compatibleIds: readonly string[];
};
//#endregion
export { ProviderModelRouteRuntimePolicy as n, ProviderRouteOverridePresence as r, ProviderModelRouteAuthRequirement as t };