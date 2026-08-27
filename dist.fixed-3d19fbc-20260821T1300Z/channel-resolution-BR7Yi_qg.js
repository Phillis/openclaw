import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { d as getActivePluginRegistry } from "./runtime-LV4GwzTm.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-3kHPdlzP.js";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-BhvdDSLi.js";
import "./message-channel-C3nRvjrX.js";
import { t as bootstrapOutboundChannelPlugin } from "./channel-bootstrap.runtime-nVz-mdPC.js";
//#region src/infra/outbound/channel-resolution.ts
/** Normalizes a raw channel id and rejects non-deliverable/internal channels. */
function normalizeDeliverableOutboundChannel(raw) {
	const normalized = normalizeMessageChannel(raw);
	if (!normalized || !isDeliverableMessageChannel(normalized)) return;
	return normalized;
}
function getOutboundRuntimeRegistry() {
	return getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry();
}
function normalizeOutboundChannelForResolution(params) {
	const normalized = normalizeMessageChannel(params.channel);
	const deliverable = normalized && isDeliverableMessageChannel(normalized) ? normalized : void 0;
	if (deliverable || !normalized || normalized === "webchat") return {
		channel: deliverable,
		didBootstrap: false
	};
	const activeRuntimePlugin = resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, getOutboundRuntimeRegistry() ?? void 0);
	if (activeRuntimePlugin) return {
		channel: activeRuntimePlugin.id,
		didBootstrap: false
	};
	if (params.allowBootstrap !== true) return {
		channel: void 0,
		didBootstrap: false
	};
	const bootstrapRegistry = bootstrapOutboundChannelPlugin({
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return {
		channel: resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry)?.id ?? normalized,
		didBootstrap: true,
		...bootstrapRegistry ? { bootstrapRegistry } : {}
	};
}
function resolveDirectFromRegistry(registry, channel) {
	if (!registry) return;
	const normalizedChannel = normalizeOptionalLowercaseString(channel);
	if (!normalizedChannel) return;
	for (const entry of registry.channels) {
		const plugin = entry?.plugin;
		if (normalizeOptionalLowercaseString(plugin?.id) === normalizedChannel || plugin?.meta?.aliases?.some((alias) => normalizeOptionalLowercaseString(alias) === normalizedChannel)) return plugin;
	}
}
function messageAdapterCanSendText(message) {
	return typeof message?.send?.text === "function";
}
function resolveSendCapableMessageAdapter(plugin) {
	const message = plugin?.message;
	return messageAdapterCanSendText(message) ? message : void 0;
}
function channelPluginHasRuntimeOutboundSurface(plugin) {
	return Boolean(plugin?.outbound ?? resolveSendCapableMessageAdapter(plugin));
}
function channelPluginHasActivatedOutboundSurface(plugin) {
	return Boolean(plugin?.outbound?.sendText || plugin?.outbound?.deliveryMode === "gateway" || resolveSendCapableMessageAdapter(plugin));
}
function resolveRuntimeOutboundPlugin(plugin) {
	return channelPluginHasRuntimeOutboundSurface(plugin) ? plugin : void 0;
}
function resolveActivatedOutboundPlugin(plugin) {
	return channelPluginHasActivatedOutboundSurface(plugin) ? plugin : void 0;
}
function resolveRuntimeOutboundPluginCandidate(params) {
	const hasRuntimeSurface = params.requireActivatedRuntime ? channelPluginHasActivatedOutboundSurface : channelPluginHasRuntimeOutboundSurface;
	if (hasRuntimeSurface(params.loaded)) return params.loaded;
	if (hasRuntimeSurface(params.runtime)) return params.runtime;
	if (hasRuntimeSurface(params.bundled)) return params.bundled;
	if (params.allowSetupShell) return params.loaded ?? params.setupFallback ?? params.bundled;
}
function resolveValueFromRuntimeRegistry(channel, resolveValue, registry = getOutboundRuntimeRegistry()) {
	const plugin = resolveDirectFromRegistry(registry ?? null, channel);
	return plugin ? resolveValue(plugin) : void 0;
}
function resolveDirectFromRuntimeRegistry(channel, registry) {
	return resolveValueFromRuntimeRegistry(channel, (plugin) => plugin, registry);
}
function resolveRuntimeOutboundPluginFromRuntimeRegistry(channel, registry) {
	return resolveValueFromRuntimeRegistry(channel, resolveRuntimeOutboundPlugin, registry);
}
function resolveActivatedOutboundPluginFromRuntimeRegistry(channel, registry) {
	return resolveValueFromRuntimeRegistry(channel, resolveActivatedOutboundPlugin, registry);
}
/** Resolves a deliverable outbound channel plugin, optionally bootstrapping it. */
function resolveOutboundChannelPlugin(params) {
	const { channel: normalized, didBootstrap, bootstrapRegistry } = normalizeOutboundChannelForResolution(params);
	if (!normalized) return;
	const resolveLoaded = () => getLoadedChannelPlugin(normalized);
	const resolve = () => getChannelPlugin(normalized);
	const current = resolveLoaded();
	const requireActivatedRuntime = params.allowBootstrap === true;
	const candidate = resolveRuntimeOutboundPluginCandidate({
		loaded: current,
		runtime: requireActivatedRuntime ? resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry) : resolveRuntimeOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry),
		setupFallback: resolveDirectFromRuntimeRegistry(normalized, bootstrapRegistry),
		bundled: resolve(),
		allowSetupShell: params.allowBootstrap !== true,
		requireActivatedRuntime
	});
	if (candidate) return candidate;
	if (params.allowBootstrap !== true || didBootstrap) return;
	const registry = bootstrapOutboundChannelPlugin({
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolveRuntimeOutboundPluginCandidate({
		loaded: resolveLoaded(),
		runtime: resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, registry),
		setupFallback: resolveDirectFromRuntimeRegistry(normalized, registry),
		bundled: resolve(),
		requireActivatedRuntime: true
	});
}
/** Resolves the message adapter for a deliverable outbound channel. */
function resolveOutboundChannelMessageAdapter(params) {
	const { channel: normalized, didBootstrap, bootstrapRegistry } = normalizeOutboundChannelForResolution(params);
	if (!normalized) return;
	const current = resolveSendCapableMessageAdapter(getLoadedChannelPlugin(normalized)) ?? resolveValueFromRuntimeRegistry(normalized, resolveSendCapableMessageAdapter, bootstrapRegistry) ?? resolveSendCapableMessageAdapter(getChannelPlugin(normalized));
	if (current || params.allowBootstrap !== true || didBootstrap) return current;
	const registry = bootstrapOutboundChannelPlugin({
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolveSendCapableMessageAdapter(getLoadedChannelPlugin(normalized)) ?? resolveValueFromRuntimeRegistry(normalized, resolveSendCapableMessageAdapter, registry) ?? resolveSendCapableMessageAdapter(getChannelPlugin(normalized));
}
//#endregion
export { resolveOutboundChannelMessageAdapter as n, resolveOutboundChannelPlugin as r, normalizeDeliverableOutboundChannel as t };
