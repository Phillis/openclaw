import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import "./config-B2bSneS2.js";
import { s as mintSecretSentinel } from "./sentinel-DFKnr2-n.js";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-D5EZZ925.js";
import { g as resolveLiteralProviderConfigApiKeyAuth, i as hasSecretRefProviderApiKey, u as providerConfigMatchesRuntimeSnapshot } from "./model-auth-provider-config-DW3Bgqni.js";
//#region src/agents/model-auth-runtime-config.ts
/**
* Runtime-config-backed provider auth that does not require plugin activation.
*/
/** Reads a runtime-resolved credential for a SecretRef-backed provider entry. */
function resolveManagedSecretRefRuntimeProviderAuth(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (params.cfg && params.cfg !== runtimeConfig && !runtimeSourceConfig) return;
	const usesRuntimeProvider = selectApplicableRuntimeConfig({
		inputConfig: params.cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) === runtimeConfig || providerConfigMatchesRuntimeSnapshot({
		inputConfig: params.cfg,
		runtimeConfig,
		provider: params.provider
	});
	if (!hasSecretRefProviderApiKey(usesRuntimeProvider ? runtimeSourceConfig ?? void 0 : params.cfg, params.provider)) return;
	if (!runtimeConfig || !usesRuntimeProvider) return;
	const resolved = resolveLiteralProviderConfigApiKeyAuth({
		cfg: runtimeConfig,
		provider: params.provider
	});
	if (!resolved?.apiKey) return;
	return {
		...resolved,
		apiKey: params.secretSentinels ? mintSecretSentinel(resolved.apiKey, { label: `model-auth:${params.provider}` }) : resolved.apiKey
	};
}
function assertRuntimeProviderSecretOwnerAvailable(params) {
	const provider = normalizeProviderId(params.provider);
	const degraded = findActiveDegradedSecretOwner("provider", provider);
	if (!degraded) return;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!params.cfg || params.cfg === runtimeConfig || params.cfg === runtimeSourceConfig || providerConfigMatchesRuntimeSnapshot({
		inputConfig: params.cfg,
		runtimeConfig,
		provider
	})) throw new SecretSurfaceUnavailableError(degraded);
}
//#endregion
export { resolveManagedSecretRefRuntimeProviderAuth as n, assertRuntimeProviderSecretOwnerAvailable as t };
