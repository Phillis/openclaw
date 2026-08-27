import { r as logVerbose } from "./globals-GZNLg1ns.js";
import "./runtime-env-_YEv0JPQ.js";
import { n as resolveConfiguredBindingRoute, r as resolveRuntimeConversationBindingRoute } from "./binding-routing-BKripjOQ.js";
import "./conversation-binding-runtime-0tfhjP7N.js";
import { o as shouldIgnoreStaleDiscordRouteBinding } from "./route-resolution-C_Emp4ym.js";
//#region extensions/discord/src/monitor/conversation-binding-route.ts
function resolveDiscordConversationBindingRoute(params) {
	let runtimeRoute = resolveRuntimeConversationBindingRoute({
		route: params.route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId: params.runtimeConversationId,
			parentConversationId: params.parentConversationId
		}
	});
	if (shouldIgnoreStaleDiscordRouteBinding({
		bindingRecord: runtimeRoute.bindingRecord,
		route: params.route
	})) {
		logVerbose(`discord: ignoring stale route binding for conversation ${params.runtimeConversationId} (${runtimeRoute.bindingRecord?.targetSessionKey} -> ${params.route.sessionKey})`);
		runtimeRoute = {
			bindingOwnerAvailable: true,
			bindingRecord: null,
			route: params.route
		};
	}
	const configuredRoute = runtimeRoute.bindingRecord ? null : resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route: params.route,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId: params.configuredConversationId,
			parentConversationId: params.parentConversationId
		}
	});
	return {
		runtimeRoute,
		configuredRoute
	};
}
//#endregion
export { resolveDiscordConversationBindingRoute as t };
