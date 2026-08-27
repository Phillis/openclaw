import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { a as buildAgentMainSessionKey } from "./session-key-D8GLfPr_.js";
import { t as normalizeRouteBindingChannelId } from "./binding-scope-DnE8jImh.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { t as resolveSessionDeliveryTarget } from "./targets-session-CnUotwvF.js";
import { i as resolveChannelTarget } from "./target-resolver--eBeHIN9.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
import { a as resolveAgentRoute } from "./resolve-route-CUq-ePT_.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-BYCoGAhh.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-C-WC19Mc.js";
import { r as resolveOutboundSessionRoute } from "./outbound-session-BJsbg3br.js";
import { a as resolveOutboundTarget } from "./targets-DoJq8_y_.js";
//#region src/infra/outbound/agent-delivery.ts
function rebaseOutboundSessionRoute(route, baseSessionKey) {
	if (route.baseSessionKey === baseSessionKey) return route;
	if (route.sessionKey === route.baseSessionKey) return {
		...route,
		sessionKey: baseSessionKey,
		baseSessionKey
	};
	const basePrefix = `${route.baseSessionKey}:`;
	if (!route.sessionKey.startsWith(basePrefix)) return null;
	return {
		...route,
		sessionKey: `${baseSessionKey}:${route.sessionKey.slice(basePrefix.length)}`,
		baseSessionKey
	};
}
function resolveAgentDeliveryPlan(params) {
	const requestedRaw = normalizeOptionalString(params.requestedChannel) ?? "";
	const requestedChannel = (requestedRaw ? normalizeMessageChannel(requestedRaw) : void 0) || "last";
	const explicitTo = normalizeOptionalString(params.explicitTo) ?? void 0;
	const normalizedTurnSource = params.turnSourceChannel ? normalizeMessageChannel(params.turnSourceChannel) : void 0;
	const turnSourceChannel = normalizedTurnSource && isDeliverableMessageChannel(normalizedTurnSource) ? normalizedTurnSource : void 0;
	const turnSourceTo = normalizeOptionalString(params.turnSourceTo) ?? void 0;
	const turnSourceAccountId = normalizeOptionalAccountId(params.turnSourceAccountId);
	const turnSourceThreadId = params.turnSourceThreadId != null && params.turnSourceThreadId !== "" ? params.turnSourceThreadId : void 0;
	const baseDelivery = resolveSessionDeliveryTarget({
		entry: params.sessionEntry,
		requestedChannel: requestedChannel === "webchat" ? "last" : requestedChannel,
		explicitTo,
		explicitThreadId: params.explicitThreadId,
		turnSourceChannel,
		turnSourceTo,
		turnSourceAccountId,
		turnSourceThreadId
	});
	const resolvedChannel = (() => {
		if (requestedChannel === "webchat") return INTERNAL_MESSAGE_CHANNEL;
		if (requestedChannel === "last") {
			if (baseDelivery.channel && baseDelivery.channel !== "webchat") return baseDelivery.channel;
			return INTERNAL_MESSAGE_CHANNEL;
		}
		if (isGatewayMessageChannel(requestedChannel)) return requestedChannel;
		if (baseDelivery.channel && baseDelivery.channel !== "webchat") return baseDelivery.channel;
		return INTERNAL_MESSAGE_CHANNEL;
	})();
	const deliveryTargetMode = explicitTo ? "explicit" : isDeliverableMessageChannel(resolvedChannel) ? "implicit" : void 0;
	const resolvedAccountId = normalizeOptionalAccountId(params.accountId) ?? (deliveryTargetMode === "implicit" ? baseDelivery.accountId : void 0);
	let resolvedTo = explicitTo;
	if (!resolvedTo && isDeliverableMessageChannel(resolvedChannel) && resolvedChannel === baseDelivery.lastChannel) resolvedTo = baseDelivery.lastTo;
	return {
		baseDelivery,
		resolvedChannel,
		resolvedTo,
		resolvedAccountId,
		resolvedThreadId: baseDelivery.threadId,
		deliveryTargetMode
	};
}
async function resolveAgentDeliveryPlanWithSessionRoute(params) {
	const plan = resolveAgentDeliveryPlan(params);
	const { resolvedChannel } = plan;
	if (!params.wantsDelivery || !isDeliverableMessageChannel(resolvedChannel)) return plan;
	const plugin = params.preparedPlugin ?? resolveOutboundChannelPlugin({
		channel: resolvedChannel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	if (!plugin) return plan;
	const pluginPlan = {
		...plan,
		plugin
	};
	const hasPluginSessionRoute = Boolean(plugin?.messaging?.resolveOutboundSessionRoute);
	const hasPluginTargetResolver = Boolean(plugin?.messaging?.targetResolver);
	const hasPluginConcreteTargetResolver = Boolean(plugin?.messaging?.targetResolver?.resolveTarget);
	if (!hasPluginSessionRoute && !hasPluginTargetResolver && params.sessionRouteMode !== "allow-fallback") return pluginPlan;
	const resolvedAccountId = pluginPlan.resolvedAccountId ?? (params.sessionRouteMode === "allow-fallback" ? resolveChannelDefaultAccountId({
		plugin,
		cfg: params.cfg
	}) : void 0);
	const routedPlan = resolvedAccountId === pluginPlan.resolvedAccountId ? pluginPlan : {
		...pluginPlan,
		resolvedAccountId
	};
	const normalizedTarget = resolveOutboundTarget({
		channel: resolvedChannel,
		plugin,
		to: routedPlan.resolvedTo,
		cfg: params.cfg,
		accountId: routedPlan.resolvedAccountId,
		mode: routedPlan.deliveryTargetMode ?? "explicit"
	});
	const targetInput = normalizedTarget.ok ? normalizedTarget.to : routedPlan.resolvedTo;
	if (!targetInput) return normalizedTarget.ok ? routedPlan : {
		...routedPlan,
		targetResolutionError: normalizedTarget.error
	};
	const resolvedTarget = await resolveChannelTarget({
		cfg: params.cfg,
		channel: resolvedChannel,
		input: targetInput,
		accountId: routedPlan.resolvedAccountId,
		unknownTargetMode: hasPluginConcreteTargetResolver ? "error" : "normalized",
		plugin
	});
	if (!resolvedTarget.ok) return {
		...routedPlan,
		targetResolutionError: resolvedTarget.error
	};
	if (!normalizedTarget.ok && resolvedTarget.target.resolutionSource === "normalized") return {
		...routedPlan,
		targetResolutionError: normalizedTarget.error
	};
	const sessionRouteTarget = resolvedTarget.target.to;
	const resolvedSessionRouteTarget = !normalizedTarget.ok || normalizedTarget.to !== resolvedTarget.target.to || resolvedTarget.target.resolutionSource === "directory" ? resolvedTarget.target : void 0;
	const resolvedPlan = {
		...routedPlan,
		resolvedTo: sessionRouteTarget
	};
	if (!hasPluginSessionRoute && params.sessionRouteMode !== "allow-fallback") return resolvedPlan;
	const explicitThreadId = params.explicitThreadId != null && params.explicitThreadId !== "" ? params.explicitThreadId : void 0;
	const route = await (async () => {
		try {
			return await resolveOutboundSessionRoute({
				cfg: params.cfg,
				channel: resolvedChannel,
				plugin,
				agentId: params.agentId,
				accountId: routedPlan.resolvedAccountId,
				target: sessionRouteTarget,
				...resolvedSessionRouteTarget ? { resolvedTarget: resolvedSessionRouteTarget } : {},
				currentSessionKey: params.currentSessionKey,
				threadId: routedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId
			});
		} catch {
			return null;
		}
	})();
	const globalDmScope = params.cfg.session?.dmScope ?? "main";
	const bindingRoute = route?.recipientSessionExact === true && route.chatType === "direct" && route.peer.kind === "direct" ? resolveAgentRoute({
		cfg: params.cfg,
		channel: resolvedChannel,
		accountId: routedPlan.resolvedAccountId,
		peer: route.peer
	}) : null;
	const bindingAwareRoute = route && bindingRoute?.dmScope !== void 0 && bindingRoute.dmScope !== globalDmScope && normalizeAgentId(bindingRoute.agentId) === normalizeAgentId(params.agentId) ? rebaseOutboundSessionRoute(route, bindingRoute.sessionKey) : route;
	const knownNonExactRoute = params.sessionRouteMode === "allow-fallback" && (bindingAwareRoute?.recipientSessionExact === false || bindingAwareRoute?.recipientSessionExact === "direct-alias");
	const canonicalMainSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.cfg.session?.mainKey
	});
	const usesCanonicalMainSession = bindingAwareRoute?.recipientSessionExact === "direct-alias" && bindingAwareRoute.chatType === "direct" && bindingAwareRoute.sessionKey === bindingAwareRoute.baseSessionKey && bindingAwareRoute.sessionKey === canonicalMainSessionKey && globalDmScope === "main" && !listRouteBindings(params.cfg).some((binding) => binding.session?.dmScope !== void 0 && binding.session.dmScope !== "main" && normalizeRouteBindingChannelId(binding.match.channel) === resolvedChannel);
	const usesIsolatedDeliveryIdentity = bindingAwareRoute?.recipientSessionExact === "delivery-identity" && bindingAwareRoute.baseSessionKey !== canonicalMainSessionKey && bindingAwareRoute.baseSessionKey.startsWith(`agent:${normalizeAgentId(params.agentId)}:${resolvedChannel}:`) && (bindingAwareRoute.sessionKey === bindingAwareRoute.baseSessionKey || bindingAwareRoute.sessionKey.startsWith(`${bindingAwareRoute.baseSessionKey}:`));
	const selectedRoute = bindingAwareRoute && (bindingAwareRoute.recipientSessionExact === "delivery-identity" ? usesIsolatedDeliveryIdentity : !knownNonExactRoute || usesCanonicalMainSession) ? bindingAwareRoute : null;
	if (!selectedRoute) {
		if (resolvedSessionRouteTarget) return {
			...resolvedPlan,
			resolvedTo: resolvedSessionRouteTarget.to,
			resolvedThreadId: resolvedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId
		};
		return resolvedPlan;
	}
	return {
		...resolvedPlan,
		resolvedSessionKey: selectedRoute.sessionKey,
		resolvedTo: hasPluginSessionRoute ? selectedRoute.to : resolvedSessionRouteTarget?.to ?? sessionRouteTarget,
		resolvedThreadId: selectedRoute.threadId ?? (resolvedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId)
	};
}
/** Resolves an explicit recipient into its canonical or stable provider-owned session. */
async function resolveAgentExplicitRecipientSession(params) {
	const plan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		requestedChannel: params.channel,
		explicitTo: params.to,
		explicitThreadId: params.threadId,
		accountId: params.accountId,
		wantsDelivery: true,
		sessionRouteMode: "allow-fallback"
	});
	if (!plan.resolvedSessionKey && !plan.targetResolutionError) return { error: /* @__PURE__ */ new Error(`Unable to resolve a session route for channel "${params.channel}"`) };
	return {
		sessionKey: plan.resolvedSessionKey,
		channel: plan.resolvedChannel,
		to: plan.resolvedTo,
		accountId: plan.resolvedAccountId,
		threadId: plan.resolvedThreadId,
		error: plan.targetResolutionError
	};
}
function resolveAgentOutboundTarget(params) {
	const targetMode = params.targetMode ?? params.plan.deliveryTargetMode ?? (params.plan.resolvedTo ? "explicit" : "implicit");
	if (params.plan.targetResolutionError) return {
		resolvedTarget: {
			ok: false,
			error: params.plan.targetResolutionError
		},
		resolvedTo: void 0,
		targetMode
	};
	if (!isDeliverableMessageChannel(params.plan.resolvedChannel)) return {
		resolvedTarget: null,
		resolvedTo: params.plan.resolvedTo,
		targetMode
	};
	if (params.validateExplicitTarget !== true && params.plan.resolvedTo) return {
		resolvedTarget: null,
		resolvedTo: params.plan.resolvedTo,
		targetMode
	};
	const resolvedTarget = resolveOutboundTarget({
		channel: params.plan.resolvedChannel,
		...params.plan.plugin ? { plugin: params.plan.plugin } : {},
		to: params.plan.resolvedTo,
		cfg: params.cfg,
		accountId: params.plan.resolvedAccountId,
		mode: targetMode
	});
	return {
		resolvedTarget,
		resolvedTo: resolvedTarget.ok ? resolvedTarget.to : params.plan.resolvedTo,
		targetMode
	};
}
//#endregion
export { resolveAgentExplicitRecipientSession as n, resolveAgentOutboundTarget as r, resolveAgentDeliveryPlanWithSessionRoute as t };
