import { r as normalizeCapabilityProviderId } from "./provider-registry-shared-CYfJZ_PT.js";
//#region src/plugins/worker-provider-registry.ts
/** Deterministic lookup helpers for plugin-registered cloud-worker providers. */
/** Validates the provider methods, normalized id, and manifest ownership contract. */
function validateWorkerProviderContract(provider, declaredIds) {
	const missingMethod = [
		"provision",
		"inspect",
		"destroy"
	].find((method) => typeof provider[method] !== "function");
	if (missingMethod) return {
		ok: false,
		message: `worker provider registration missing method: ${missingMethod}`
	};
	if (provider.renew !== void 0 && typeof provider.renew !== "function") return {
		ok: false,
		message: "worker provider registration renew must be a function"
	};
	if (provider.provisionBeforeInstallation !== void 0 && typeof provider.provisionBeforeInstallation !== "boolean") return {
		ok: false,
		message: "worker provider registration provisionBeforeInstallation must be a boolean"
	};
	if (provider.resolveSshIdentity !== void 0 && typeof provider.resolveSshIdentity !== "function") return {
		ok: false,
		message: "worker provider registration resolveSshIdentity must be a function"
	};
	const id = normalizeCapabilityProviderId(provider.id);
	if (!id) return {
		ok: false,
		message: "worker provider registration missing valid id"
	};
	return declaredIds.some((candidate) => normalizeCapabilityProviderId(candidate) === id) ? {
		ok: true,
		id
	} : {
		ok: false,
		message: `plugin must declare contracts.workerProviders for provider: ${id}`
	};
}
/** Resolves one provider by its normalized manifest capability id. */
function resolveWorkerProvider(registry, providerId) {
	const normalizedId = normalizeCapabilityProviderId(providerId);
	return normalizedId ? registry.workerProviders.get(normalizedId)?.provider : void 0;
}
//#endregion
export { validateWorkerProviderContract as n, resolveWorkerProvider as t };
