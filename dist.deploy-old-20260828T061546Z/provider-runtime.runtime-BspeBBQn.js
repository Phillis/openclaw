import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
//#region src/plugins/provider-runtime.runtime.ts
/** Runtime-side provider discovery and provider registration resolution helpers. */
const providerRuntimeLoader = createLazyImportLoader(() => import("./provider-runtime-ynIloPGD.js"));
async function loadProviderRuntime() {
	return await providerRuntimeLoader.load();
}
/** Lazily augments the model catalog with provider plugin metadata. */
async function augmentModelCatalogWithProviderPlugins(...args) {
	return (await loadProviderRuntime()).augmentModelCatalogWithProviderPlugins(...args);
}
/** Lazily builds doctor hint text for provider auth problems. */
async function buildProviderAuthDoctorHintWithPlugin(...args) {
	return (await loadProviderRuntime()).buildProviderAuthDoctorHintWithPlugin(...args);
}
/** Lazily formats API-key auth profile display text with provider plugin rules. */
async function formatProviderAuthProfileApiKeyWithPlugin(...args) {
	return (await loadProviderRuntime()).formatProviderAuthProfileApiKeyWithPlugin(...args);
}
/** Lazily runs the callback-based OAuth login owned by a provider plugin. */
async function loginProviderOAuthWithPlugin(...args) {
	return (await loadProviderRuntime()).loginProviderOAuthWithPlugin(...args);
}
/** Lazily resolves or refreshes a session OAuth credential through its provider plugin. */
async function resolveProviderOAuthCredentialWithPlugin(...args) {
	return (await loadProviderRuntime()).resolveProviderOAuthCredentialWithPlugin(...args);
}
/** Lazily prepares provider runtime auth for model execution. */
async function prepareProviderRuntimeAuth(...args) {
	return (await loadProviderRuntime()).prepareProviderRuntimeAuth(...args);
}
/** Lazily refreshes OAuth credentials through provider plugin runtime hooks. */
async function refreshProviderOAuthCredentialWithPlugin(...args) {
	return (await loadProviderRuntime()).refreshProviderOAuthCredentialWithPlugin(...args);
}
//#endregion
export { prepareProviderRuntimeAuth as a, loginProviderOAuthWithPlugin as i, buildProviderAuthDoctorHintWithPlugin as n, refreshProviderOAuthCredentialWithPlugin as o, formatProviderAuthProfileApiKeyWithPlugin as r, resolveProviderOAuthCredentialWithPlugin as s, augmentModelCatalogWithProviderPlugins as t };
