//#region src/plugins/provider-registry-shared.d.ts
/** Normalizes provider ids used by capability-provider registries. */
declare function normalizeCapabilityProviderId(providerId: string | undefined): string | undefined;
//#endregion
export { normalizeCapabilityProviderId as t };