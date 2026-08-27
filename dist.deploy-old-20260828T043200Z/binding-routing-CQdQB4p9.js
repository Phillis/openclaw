import { r as isCronRunSessionKey } from "./session-key-utils-Di3FvABa.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { n as inspectSessionBindingByConversation, t as getSessionBindingService } from "./session-binding-service-B0hkzhLM.js";
import { n as deriveLastRoutePolicy } from "./resolve-route-CaHBZG2x.js";
import { n as resolveConfiguredBinding } from "./configured-binding-registry-C7X9_YWx.js";
import { t as ensureConfiguredBindingTargetReady } from "./binding-targets-DB-MM-Ol.js";
//#region src/channels/plugins/binding-routing.ts
const CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS = 3e4;
function resolveConfiguredBindingConversationRef(params) {
	if ("conversation" in params) return params.conversation;
	return {
		channel: params.channel,
		accountId: params.accountId,
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	};
}
function resolvePluginOwnedRuntimeBindingPluginId(record) {
	const metadata = record?.metadata;
	if (!metadata || typeof metadata !== "object") return;
	const pluginId = metadata.pluginId;
	return metadata.pluginBindingOwner === "plugin" && typeof pluginId === "string" && typeof metadata.pluginRoot === "string" ? pluginId.trim() || void 0 : void 0;
}
/**
* Rewrites an agent route when the current conversation matches a configured binding.
*/
function resolveConfiguredBindingRoute(params) {
	const bindingResolution = resolveConfiguredBinding({
		cfg: params.cfg,
		conversation: resolveConfiguredBindingConversationRef(params)
	}) ?? null;
	if (!bindingResolution) return {
		bindingResolution: null,
		route: params.route
	};
	const boundSessionKey = bindingResolution.statefulTarget.sessionKey.trim();
	if (!boundSessionKey) return {
		bindingResolution,
		route: params.route
	};
	const boundAgentId = resolveAgentIdFromSessionKey(boundSessionKey) || bindingResolution.statefulTarget.agentId;
	return {
		bindingResolution,
		boundSessionKey,
		boundAgentId,
		route: {
			...params.route,
			sessionKey: boundSessionKey,
			agentId: boundAgentId,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey: boundSessionKey,
				mainSessionKey: params.route.mainSessionKey
			}),
			matchedBy: "binding.channel"
		}
	};
}
/**
* Rewrites an agent route using a persisted runtime conversation binding, when applicable.
*/
function resolveRuntimeConversationBindingRoute(params) {
	const inspection = inspectSessionBindingByConversation(resolveConfiguredBindingConversationRef(params));
	if (inspection.status === "unavailable") return {
		bindingOwnerAvailable: false,
		bindingRecord: null,
		route: params.route
	};
	const bindingRecord = inspection.binding;
	const boundSessionKey = bindingRecord?.targetSessionKey?.trim();
	if (!bindingRecord || !boundSessionKey) return {
		bindingOwnerAvailable: true,
		bindingRecord: null,
		route: params.route
	};
	if (isCronRunSessionKey(boundSessionKey)) {
		logVerbose(`ignored runtime conversation binding ${bindingRecord.bindingId} to isolated cron run session ${boundSessionKey}`);
		return {
			bindingOwnerAvailable: true,
			bindingRecord: null,
			route: params.route
		};
	}
	if (params.touchBinding !== false) getSessionBindingService().touch(bindingRecord.bindingId);
	const pluginId = resolvePluginOwnedRuntimeBindingPluginId(bindingRecord);
	if (pluginId) return {
		bindingOwnerAvailable: true,
		bindingRecord,
		pluginId,
		route: params.route
	};
	const boundAgentId = resolveAgentIdFromSessionKey(boundSessionKey) || params.route.agentId;
	return {
		bindingOwnerAvailable: true,
		bindingRecord,
		boundSessionKey,
		boundAgentId,
		route: {
			...params.route,
			sessionKey: boundSessionKey,
			agentId: boundAgentId,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey: boundSessionKey,
				mainSessionKey: params.route.mainSessionKey
			}),
			matchedBy: "binding.channel"
		}
	};
}
/**
* Ensures a configured binding target is ready without blocking route resolution indefinitely.
*/
async function ensureConfiguredBindingRouteReady(params) {
	const readyPromise = ensureConfiguredBindingTargetReady(params);
	let timer;
	const timeoutToken = Symbol("configured-binding-route-ready-timeout");
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve(timeoutToken), CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS);
		timer.unref?.();
	});
	try {
		const result = await Promise.race([readyPromise, timeoutPromise]);
		if (result !== timeoutToken) return result;
		logVerbose(`configured binding route ready check timed out after ${CONFIGURED_BINDING_ROUTE_READY_TIMEOUT_MS / 1e3}s`);
		readyPromise.then((lateResult) => logVerbose(`configured binding route ready check settled after timeout (ok=${lateResult.ok})`), (err) => logVerbose(`configured binding route ready check rejected after timeout: ${String(err)}`));
		return {
			ok: false,
			error: "Configured binding route ready check timed out"
		};
	} finally {
		clearTimeout(timer);
	}
}
//#endregion
export { resolveConfiguredBindingRoute as n, resolveRuntimeConversationBindingRoute as r, ensureConfiguredBindingRouteReady as t };
