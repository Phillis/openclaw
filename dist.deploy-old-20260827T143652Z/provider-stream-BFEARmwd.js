import { a as unwrapSecretSentinelsForProviderEgress, i as unwrapModelHeaderSentinelsForProviderEgress, n as unwrapHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BZ7aTRBx.js";
import { k as resolveProviderStreamFn } from "./provider-runtime-D4zJxL0d.js";
import { s as getModelLlmRuntime } from "./stream-DUxdKJ02.js";
import { d as ensureCustomApiRegistered } from "./ai-transport-runtime-host-BkilSpNl.js";
import { createTransportAwareStreamFnForModel } from "@openclaw/ai/transports";
//#region src/agents/provider-stream.ts
/** Resolves and registers the stream function for a provider-backed model. */
function registerProviderStreamForModel(params) {
	const pluginModel = unwrapModelHeaderSentinelsForProviderEgress(params.model, "plugin provider stream construction");
	const providerStreamFn = resolveProviderStreamFn({
		provider: params.model.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		allowRuntimePluginLoad: params.allowRuntimePluginLoad,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.model.provider,
			modelId: params.model.id,
			model: pluginModel
		}
	});
	const transportFallback = providerStreamFn ? void 0 : createTransportAwareStreamFnForModel(params.model.api === "google-generative-ai" ? pluginModel : params.model, {
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const streamFn = providerStreamFn ? wrapPluginProviderStream(providerStreamFn) : transportFallback && params.model.api === "google-generative-ai" ? wrapPluginProviderStream(transportFallback) : transportFallback;
	if (!streamFn) return;
	const apiRegistry = params.apiRegistry ?? getModelLlmRuntime(params.model)?.registry;
	if (apiRegistry) ensureCustomApiRegistered(apiRegistry, params.model.api, streamFn);
	return streamFn;
}
function wrapPluginProviderStream(streamFn) {
	const boundary = "plugin provider stream handoff";
	return (model, context, options) => {
		const apiKey = options?.apiKey ? unwrapSecretSentinelsForProviderEgress(options.apiKey, boundary) : options?.apiKey;
		const headers = options?.headers ? unwrapHeaderSentinelsForProviderEgress(options.headers, boundary) : options?.headers;
		const resolvedOptions = apiKey === options?.apiKey && headers === options?.headers ? options : {
			...options,
			apiKey,
			headers
		};
		return streamFn(unwrapModelHeaderSentinelsForProviderEgress(model, boundary), context, resolvedOptions);
	};
}
//#endregion
export { registerProviderStreamForModel as t };
