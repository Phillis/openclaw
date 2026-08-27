import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-BBST5Lo5.js";
import "./plugin-registry-DS2siXub.js";
import { n as getActiveRuntimeWebToolsMetadataFromState } from "./runtime-web-tools-state-B2O6toZJ.js";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-LhRdbFR1.js";
//#region src/agents/tools/web-tool-runtime-context.ts
function resolveConfiguredWebProviderId(config, kind) {
	const provider = config?.tools?.web?.[kind]?.provider;
	return typeof provider === "string" ? provider.trim().toLowerCase() : "";
}
function resolveRuntimeWebProviderId(metadata) {
	return metadata?.selectedProvider ?? metadata?.providerConfigured ?? "";
}
function shouldPreferRuntimeProviders(params) {
	if (!params.providerSelectionId || params.kind === "search") return true;
	return !resolveManifestContractOwnerPluginId({
		contract: "webFetchProviders",
		value: params.providerSelectionId,
		origin: "bundled",
		config: params.config
	});
}
function resolveWebToolRuntimeContext(params) {
	const runtimeMetadata = (params.lateBindRuntimeConfig === true ? getActiveRuntimeWebToolsMetadataFromState() : null)?.[params.kind] ?? params.capturedRuntimeMetadata;
	const config = params.lateBindRuntimeConfig === true ? getActiveSecretsRuntimeConfigSnapshot()?.config ?? params.capturedConfig : params.capturedConfig;
	const providerSelectionId = resolveRuntimeWebProviderId(runtimeMetadata) || resolveConfiguredWebProviderId(config, params.kind);
	return {
		config,
		preferRuntimeProviders: shouldPreferRuntimeProviders({
			config,
			kind: params.kind,
			providerSelectionId
		}),
		providerSelectionId,
		runtimeMetadata
	};
}
/** Resolves runtime provider context for the web_search tool. */
function resolveWebSearchToolRuntimeContext(params) {
	const resolved = resolveWebToolRuntimeContext({
		capturedConfig: params.config,
		capturedRuntimeMetadata: params.runtimeWebSearch,
		kind: "search",
		lateBindRuntimeConfig: params.lateBindRuntimeConfig
	});
	return {
		config: resolved.config,
		preferRuntimeProviders: resolved.preferRuntimeProviders,
		providerSelectionId: resolved.providerSelectionId,
		runtimeWebSearch: resolved.runtimeMetadata
	};
}
/** Resolves runtime provider context for the web_fetch tool. */
function resolveWebFetchToolRuntimeContext(params) {
	const resolved = resolveWebToolRuntimeContext({
		capturedConfig: params.config,
		capturedRuntimeMetadata: params.runtimeWebFetch,
		kind: "fetch",
		lateBindRuntimeConfig: params.lateBindRuntimeConfig
	});
	return {
		config: resolved.config,
		preferRuntimeProviders: resolved.preferRuntimeProviders,
		providerSelectionId: resolved.providerSelectionId,
		runtimeWebFetch: resolved.runtimeMetadata
	};
}
//#endregion
export { resolveWebSearchToolRuntimeContext as n, resolveWebFetchToolRuntimeContext as t };
