//#region extensions/ollama/src/provider-base-url.ts
function readProviderBaseUrl(provider) {
	if (!provider) return;
	if (Object.hasOwn(provider, "baseUrl") && typeof provider.baseUrl === "string" && provider.baseUrl.trim()) return provider.baseUrl.trim();
	const alternate = provider;
	if (Object.hasOwn(alternate, "baseURL") && typeof alternate.baseURL === "string" && alternate.baseURL.trim()) return alternate.baseURL.trim();
}
//#endregion
export { readProviderBaseUrl as t };
