import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { nn as readSessionUpdatedAtCore } from "./session-accessor-CIiPoGwM.js";
import { a as resolveAgentRoute } from "./resolve-route-Dz19j5-0.js";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-dDJDsvuE.js";
//#region src/channels/inbound-event/envelope.ts
function createChannelInboundEnvelopeBuilder(params) {
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.route.agentId });
	const envelope = resolveEnvelopeFormatOptions(params.cfg);
	return (input) => {
		const previousTimestamp = input.previousTimestamp === null ? void 0 : input.previousTimestamp ?? readSessionUpdatedAtCore({
			storePath,
			sessionKey: params.route.sessionKey
		});
		return formatAgentEnvelope({
			...input,
			previousTimestamp,
			envelope: input.envelope ?? envelope
		});
	};
}
function resolveChannelInboundRouteEnvelope(params) {
	const route = resolveAgentRoute(params);
	return {
		route,
		buildEnvelope: createChannelInboundEnvelopeBuilder({
			cfg: params.cfg,
			route
		})
	};
}
function createInboundEnvelopeBuilder(params) {
	const storePath = params.resolveSessionStorePathCore(params.sessionStore, { agentId: params.route.agentId });
	const envelopeOptions = params.resolveEnvelopeFormatOptions(params.cfg);
	return (input) => {
		const previousTimestamp = params.readSessionUpdatedAt({
			storePath,
			sessionKey: params.route.sessionKey
		});
		const body = params.formatAgentEnvelope({
			channel: input.channel,
			from: input.from,
			timestamp: input.timestamp,
			previousTimestamp,
			envelope: envelopeOptions,
			body: input.body
		});
		return {
			storePath,
			body
		};
	};
}
function resolveInboundRouteEnvelopeBuilder(params) {
	const route = params.resolveAgentRoute({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	return {
		route,
		buildEnvelope: createInboundEnvelopeBuilder({
			cfg: params.cfg,
			route,
			sessionStore: params.sessionStore,
			resolveSessionStorePathCore: params.resolveSessionStorePathCore,
			readSessionUpdatedAt: params.readSessionUpdatedAt,
			resolveEnvelopeFormatOptions: params.resolveEnvelopeFormatOptions,
			formatAgentEnvelope: params.formatAgentEnvelope
		})
	};
}
/** Runtime-driven compatibility variant for shipped plugin SDK callers. */
function resolveInboundRouteEnvelopeBuilderWithRuntime(params) {
	return resolveInboundRouteEnvelopeBuilder({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		resolveAgentRoute: (routeParams) => params.runtime.routing.resolveAgentRoute(routeParams),
		sessionStore: params.sessionStore,
		resolveSessionStorePathCore: params.runtime.session.resolveStorePath,
		readSessionUpdatedAt: params.runtime.session.readSessionUpdatedAt,
		resolveEnvelopeFormatOptions: params.runtime.reply.resolveEnvelopeFormatOptions,
		formatAgentEnvelope: params.runtime.reply.formatAgentEnvelope
	});
}
//#endregion
export { resolveInboundRouteEnvelopeBuilderWithRuntime as a, resolveInboundRouteEnvelopeBuilder as i, createInboundEnvelopeBuilder as n, resolveChannelInboundRouteEnvelope as r, createChannelInboundEnvelopeBuilder as t };
