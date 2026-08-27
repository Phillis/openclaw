import { y as provider_runtime_d_exports } from "../host-capability-types-BX08s7pv.js";

//#region src/plugins/provider-runtime.runtime.d.ts
type ProviderRuntimeModule = typeof provider_runtime_d_exports;
type AugmentModelCatalogWithProviderPlugins = ProviderRuntimeModule["augmentModelCatalogWithProviderPlugins"];
type BuildProviderAuthDoctorHintWithPlugin = ProviderRuntimeModule["buildProviderAuthDoctorHintWithPlugin"];
type FormatProviderAuthProfileApiKeyWithPlugin = ProviderRuntimeModule["formatProviderAuthProfileApiKeyWithPlugin"];
type LoginProviderOAuthWithPlugin = ProviderRuntimeModule["loginProviderOAuthWithPlugin"];
type ResolveProviderOAuthCredentialWithPlugin = ProviderRuntimeModule["resolveProviderOAuthCredentialWithPlugin"];
type PrepareProviderRuntimeAuth = ProviderRuntimeModule["prepareProviderRuntimeAuth"];
type RefreshProviderOAuthCredentialWithPlugin = ProviderRuntimeModule["refreshProviderOAuthCredentialWithPlugin"];
/** Lazily augments the model catalog with provider plugin metadata. */
declare function augmentModelCatalogWithProviderPlugins(...args: Parameters<AugmentModelCatalogWithProviderPlugins>): Promise<Awaited<ReturnType<AugmentModelCatalogWithProviderPlugins>>>;
/** Lazily builds doctor hint text for provider auth problems. */
declare function buildProviderAuthDoctorHintWithPlugin(...args: Parameters<BuildProviderAuthDoctorHintWithPlugin>): Promise<Awaited<ReturnType<BuildProviderAuthDoctorHintWithPlugin>>>;
/** Lazily formats API-key auth profile display text with provider plugin rules. */
declare function formatProviderAuthProfileApiKeyWithPlugin(...args: Parameters<FormatProviderAuthProfileApiKeyWithPlugin>): Promise<Awaited<ReturnType<FormatProviderAuthProfileApiKeyWithPlugin>>>;
/** Lazily runs the callback-based OAuth login owned by a provider plugin. */
declare function loginProviderOAuthWithPlugin(...args: Parameters<LoginProviderOAuthWithPlugin>): Promise<Awaited<ReturnType<LoginProviderOAuthWithPlugin>>>;
/** Lazily resolves or refreshes a session OAuth credential through its provider plugin. */
declare function resolveProviderOAuthCredentialWithPlugin(...args: Parameters<ResolveProviderOAuthCredentialWithPlugin>): Promise<Awaited<ReturnType<ResolveProviderOAuthCredentialWithPlugin>>>;
/** Lazily prepares provider runtime auth for model execution. */
declare function prepareProviderRuntimeAuth(...args: Parameters<PrepareProviderRuntimeAuth>): Promise<Awaited<ReturnType<PrepareProviderRuntimeAuth>>>;
/** Lazily refreshes OAuth credentials through provider plugin runtime hooks. */
declare function refreshProviderOAuthCredentialWithPlugin(...args: Parameters<RefreshProviderOAuthCredentialWithPlugin>): Promise<Awaited<ReturnType<RefreshProviderOAuthCredentialWithPlugin>>>;
//#endregion
export { augmentModelCatalogWithProviderPlugins, buildProviderAuthDoctorHintWithPlugin, formatProviderAuthProfileApiKeyWithPlugin, loginProviderOAuthWithPlugin, prepareProviderRuntimeAuth, refreshProviderOAuthCredentialWithPlugin, resolveProviderOAuthCredentialWithPlugin };