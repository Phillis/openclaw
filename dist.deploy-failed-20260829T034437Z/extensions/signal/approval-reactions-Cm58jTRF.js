import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { n as normalizeSignalMessagingTarget } from "./normalize-l_b99hap.js";
import { i as resolveSignalTarget, n as signalApprovalAuth, t as getSignalApprovalApprovers } from "./approval-auth-BsYHLTHK.js";
import { l as looksLikeUuid } from "./identity-YXPmgFMu.js";
import { i as getOptionalSignalRuntime } from "./transport-detection-BoKa3jTK.js";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { addApprovalReactionHintToText, createApprovalReactionTargetStore, hasApprovalReactionHintText, listApprovalReactionBindings, readApprovalReactionDecisionList, resolveTypedApprovalReactionTarget } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/text-utility-runtime";
import { isApprovalNotFoundError } from "openclaw/plugin-sdk/error-runtime";
import { getExecApprovalReplyMetadata } from "openclaw/plugin-sdk/approval-reply-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
//#region extensions/signal/src/approval-reaction-routes.ts
function resolveApprovalForwardingConfig(params) {
	return params.approvalKind === "plugin" ? params.cfg.approvals?.plugin : params.cfg.approvals?.exec;
}
function normalizeApprovalForwardingMode(mode) {
	return mode ?? "session";
}
function approvalModeIncludesSession(mode) {
	return mode === "session" || mode === "both";
}
function approvalModeIncludesTargets(mode) {
	return mode === "targets" || mode === "both";
}
function matchesSignalApprovalReactionFilters(params) {
	return matchesApprovalRequestFilters({
		request: {
			agentId: params.route.agentId,
			sessionKey: params.route.sessionKey
		},
		agentFilter: params.config.agentFilter,
		sessionFilter: params.config.sessionFilter,
		fallbackAgentIdFromSessionKey: true
	});
}
function targetAccountMatches(params) {
	const configuredAccountId = normalizeOptionalString(params.configuredAccountId);
	if (!configuredAccountId) return true;
	const routeAccountId = normalizeOptionalString(params.routeAccountId);
	return Boolean(routeAccountId && normalizeAccountId(routeAccountId) === normalizeAccountId(configuredAccountId));
}
function resolveSignalApprovalRouteTarget(params) {
	try {
		return resolveSignalTarget({
			cfg: params.cfg,
			accountId: params.accountId,
			input: params.to
		})?.to ?? normalizeSignalMessagingTarget(params.to) ?? null;
	} catch {
		return null;
	}
}
function hasMatchingSignalApprovalReactionTarget(params) {
	return (params.config.targets ?? []).some((target) => {
		if (normalizeLowercaseStringOrEmpty(target.channel) !== "signal") return false;
		const configuredTo = resolveSignalApprovalRouteTarget({
			cfg: params.cfg,
			accountId: target.accountId ?? params.route.accountId,
			to: target.to
		});
		if (!configuredTo || configuredTo !== params.route.to) return false;
		return targetAccountMatches({
			routeAccountId: params.route.accountId,
			configuredAccountId: target.accountId
		});
	});
}
function isSignalApprovalReactionRouteStillEnabled(params) {
	const config = resolveApprovalForwardingConfig({
		cfg: params.cfg,
		approvalKind: params.target.approvalKind
	});
	if (!config?.enabled) return false;
	const mode = normalizeApprovalForwardingMode(config.mode);
	if (params.target.route.deliveryMode === "target") return approvalModeIncludesTargets(mode) && matchesSignalApprovalReactionFilters({
		config,
		route: params.target.route
	}) && hasMatchingSignalApprovalReactionTarget({
		cfg: params.cfg,
		config,
		route: params.target.route
	});
	if (!approvalModeIncludesSession(mode)) return false;
	return matchesSignalApprovalReactionFilters({
		config,
		route: params.target.route
	});
}
function buildTargetRoute(params) {
	const to = resolveSignalApprovalRouteTarget({
		cfg: params.cfg,
		accountId: params.accountId,
		to: params.to
	});
	if (!to) return null;
	const route = {
		deliveryMode: "target",
		to,
		...normalizeOptionalString(params.accountId) ? { accountId: normalizeOptionalString(params.accountId) } : {},
		...normalizeOptionalString(params.agentId) ? { agentId: normalizeOptionalString(params.agentId) } : {},
		...normalizeOptionalString(params.sessionKey) ? { sessionKey: normalizeOptionalString(params.sessionKey) } : {}
	};
	return isSignalApprovalReactionRouteStillEnabled({
		cfg: params.cfg,
		target: {
			approvalKind: params.approvalKind,
			route
		}
	}) ? route : null;
}
//#endregion
//#region extensions/signal/src/approval-reactions.ts
var approval_reactions_exports = /* @__PURE__ */ __exportAll({
	addSignalApprovalReactionHintToStructuredPayload: () => addSignalApprovalReactionHintToStructuredPayload,
	clearSignalApprovalReactionTargetsForTest: () => clearSignalApprovalReactionTargetsForTest,
	hasSignalApprovalReactionApprovers: () => hasSignalApprovalReactionApprovers,
	maybeResolveSignalApprovalReaction: () => maybeResolveSignalApprovalReaction,
	registerSignalApprovalReactionTarget: () => registerSignalApprovalReactionTarget,
	registerSignalApprovalReactionTargetForDeliveredPayload: () => registerSignalApprovalReactionTargetForDeliveredPayload,
	resolveSignalApprovalConversationKey: () => resolveSignalApprovalConversationKey,
	resolveSignalApprovalReactionTargetWithPersistence: () => resolveSignalApprovalReactionTargetWithPersistence,
	resolveSignalApprovalTargetAuthorKeys: () => resolveSignalApprovalTargetAuthorKeys,
	unregisterSignalApprovalReactionTarget: () => unregisterSignalApprovalReactionTarget
});
const PERSISTENT_NAMESPACE = "signal.approval-reactions.v2";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 1440 * 60 * 1e3;
const loadResolveApprovalOverGateway = createLazyRuntimeSurface(() => import("openclaw/plugin-sdk/approval-gateway-runtime"), (runtime) => runtime.resolveApprovalOverGateway);
const signalApprovalReactionTargets = createApprovalReactionTargetStore({
	namespace: PERSISTENT_NAMESPACE,
	maxEntries: PERSISTENT_MAX_ENTRIES,
	defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
	openStore: (storeParams) => getOptionalSignalRuntime()?.state.openKeyedStore(storeParams),
	logPersistentError: createPluginStateErrorReporter(getOptionalSignalRuntime, "signal", "approval-reaction-state", "Signal persistent approval reaction state failed"),
	readPersistedTarget
});
function resolveSignalApprovalConversationKey(to) {
	return normalizeSignalMessagingTarget(to) ?? null;
}
function resolveSignalApprovalConversationKeyForDeliveredTarget(params) {
	try {
		return resolveSignalTarget({
			cfg: params.cfg,
			accountId: params.accountId,
			input: params.to
		})?.to ?? resolveSignalApprovalConversationKey(params.to);
	} catch {
		return resolveSignalApprovalConversationKey(params.to);
	}
}
function normalizeSignalApprovalTargetAuthorKey(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return null;
	const withoutSignalPrefix = normalized.replace(/^signal:/i, "").trim();
	if (normalizeLowercaseStringOrEmpty(withoutSignalPrefix).startsWith("uuid:")) {
		const uuid = withoutSignalPrefix.slice(5).trim().toLowerCase();
		return uuid ? `uuid:${uuid}` : null;
	}
	if (looksLikeUuid(withoutSignalPrefix)) return `uuid:${withoutSignalPrefix.toLowerCase()}`;
	return normalizeE164(withoutSignalPrefix);
}
function resolveSignalApprovalTargetAuthorKeys(params) {
	const targetAuthorUuid = normalizeOptionalString(params.targetAuthorUuid);
	const keys = [targetAuthorUuid ? `uuid:${targetAuthorUuid.replace(/^uuid:/i, "").trim().toLowerCase()}` : null, params.targetAuthor ? normalizeSignalApprovalTargetAuthorKey(params.targetAuthor) : null].filter((key) => Boolean(key));
	return Array.from(new Set(keys));
}
function buildReactionTargetKey(params) {
	const accountId = params.accountId.trim();
	const conversationKey = params.conversationKey.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !conversationKey || !messageId || messageId === "unknown") return null;
	return `${accountId}:${conversationKey}:${messageId}`;
}
function readPersistedTarget(target) {
	const value = target;
	if (!value || typeof value.approvalId !== "string" || value.approvalKind !== "exec" && value.approvalKind !== "plugin" || !value.route || value.route.deliveryMode !== "session" && value.route.deliveryMode !== "target" || !Array.isArray(value.targetAuthorKeys)) return null;
	const allowedDecisions = readApprovalReactionDecisionList(value.allowedDecisions);
	if (!allowedDecisions) return null;
	const targetRouteTo = value.route.deliveryMode === "target" && typeof value.route.to === "string" ? normalizeSignalMessagingTarget(value.route.to) : null;
	if (value.route.deliveryMode === "target" && !targetRouteTo) return null;
	const route = value.route.deliveryMode === "target" ? {
		deliveryMode: "target",
		to: targetRouteTo,
		...typeof value.route.accountId === "string" ? { accountId: value.route.accountId } : {},
		...typeof value.route.agentId === "string" ? { agentId: value.route.agentId } : {},
		...typeof value.route.sessionKey === "string" ? { sessionKey: value.route.sessionKey } : {}
	} : {
		deliveryMode: "session",
		...typeof value.route.agentId === "string" ? { agentId: value.route.agentId } : {},
		...typeof value.route.sessionKey === "string" ? { sessionKey: value.route.sessionKey } : {}
	};
	return {
		approvalId: value.approvalId,
		approvalKind: value.approvalKind,
		allowedDecisions,
		targetAuthorKeys: value.targetAuthorKeys,
		route
	};
}
function hasSignalApprovalReactionApprovers(params) {
	return getSignalApprovalApprovers(params).length > 0;
}
function registerSignalApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params);
	const approvalId = params.approvalId.trim();
	const targetAuthorKeys = Array.from(new Set(params.targetAuthorKeys.map((entry) => normalizeSignalApprovalTargetAuthorKey(entry)).filter((entry) => Boolean(entry))));
	const allowedDecisions = listApprovalReactionBindings({ allowedDecisions: params.allowedDecisions }).map((binding) => binding.decision);
	if (!params.routeAllowed || params.approvalKind !== "exec" && params.approvalKind !== "plugin" || !key || !approvalId || allowedDecisions.length === 0) return null;
	if (targetAuthorKeys.length === 0) return null;
	const route = params.route.deliveryMode === "target" ? {
		deliveryMode: "target",
		to: params.route.to,
		...normalizeOptionalString(params.route.accountId) ? { accountId: normalizeOptionalString(params.route.accountId) } : {},
		...normalizeOptionalString(params.route.agentId) ? { agentId: normalizeOptionalString(params.route.agentId) } : {},
		...normalizeOptionalString(params.route.sessionKey) ? { sessionKey: normalizeOptionalString(params.route.sessionKey) } : {}
	} : {
		deliveryMode: "session",
		...normalizeOptionalString(params.route.agentId) ? { agentId: normalizeOptionalString(params.route.agentId) } : {},
		...normalizeOptionalString(params.route.sessionKey) ? { sessionKey: normalizeOptionalString(params.route.sessionKey) } : {}
	};
	const target = {
		approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions,
		targetAuthorKeys,
		route
	};
	signalApprovalReactionTargets.register(key, target, { ttlMs: params.ttlMs });
	return target;
}
function formatSignalApprovalTerminalTruth(approval) {
	const decision = "decision" in approval ? ` decision=${approval.decision}` : "";
	return `status=${approval.status}${decision}`;
}
function addSignalApprovalReactionHintToStructuredPayload(params) {
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (!metadata?.allowedDecisions || metadata.allowedDecisions.length === 0) return null;
	if (resolveSignalApprovalTargetAuthorKeys(params).length === 0) return null;
	if (!hasSignalApprovalReactionApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	})) return null;
	if (!buildTargetRoute({
		cfg: params.cfg,
		accountId: params.accountId,
		to: params.to,
		approvalKind: metadata.approvalKind,
		agentId: metadata.agentId,
		sessionKey: metadata.sessionKey
	}) || !params.payload.text) return null;
	return {
		...params.payload,
		text: addApprovalReactionHintToText({
			text: params.payload.text,
			allowedDecisions: metadata.allowedDecisions
		})
	};
}
function readSignalDeliveryVisibleText(result) {
	const visibleText = result.meta?.signalVisibleText ?? result.meta?.visibleText;
	return typeof visibleText === "string" ? visibleText : null;
}
function listDeliveredSignalMessageIdsWithVisibleHint(params) {
	const signalResults = params.results.filter((result) => !result.channel || normalizeLowercaseStringOrEmpty(result.channel) === "signal");
	const resultsWithVisibleText = signalResults.filter((result) => readSignalDeliveryVisibleText(result) !== null);
	const candidates = resultsWithVisibleText.length > 0 ? resultsWithVisibleText : signalResults;
	if (resultsWithVisibleText.length === 0 && candidates.length !== 1) return [];
	const ids = candidates.filter((result) => resultsWithVisibleText.length > 0 ? hasApprovalReactionHintText(readSignalDeliveryVisibleText(result)) : hasApprovalReactionHintText(params.payload.text)).map((result) => normalizeOptionalString(result.messageId)).filter((messageId) => Boolean(messageId && messageId !== "unknown"));
	return Array.from(new Set(ids));
}
function registerSignalApprovalReactionTargetForDeliveredPayload(params) {
	if (normalizeLowercaseStringOrEmpty(params.target.channel) !== "signal") return false;
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (!metadata?.allowedDecisions || metadata.allowedDecisions.length === 0) return false;
	if (!hasApprovalReactionHintText(params.payload.text)) return false;
	if (!hasSignalApprovalReactionApprovers({
		cfg: params.cfg,
		accountId: params.target.accountId
	})) return false;
	const conversationKey = resolveSignalApprovalConversationKeyForDeliveredTarget({
		cfg: params.cfg,
		accountId: params.target.accountId,
		to: params.target.to
	});
	if (!conversationKey) return false;
	const route = buildTargetRoute({
		cfg: params.cfg,
		accountId: params.target.accountId,
		to: params.target.to,
		approvalKind: metadata.approvalKind,
		agentId: metadata.agentId,
		sessionKey: metadata.sessionKey
	});
	if (!route) return false;
	const targetAuthorKeys = resolveSignalApprovalTargetAuthorKeys(params);
	if (targetAuthorKeys.length === 0) return false;
	let registered = false;
	for (const messageId of listDeliveredSignalMessageIdsWithVisibleHint({
		payload: params.payload,
		results: params.results
	})) registered = Boolean(registerSignalApprovalReactionTarget({
		accountId: normalizeAccountId(params.target.accountId ?? void 0),
		conversationKey,
		messageId,
		approvalId: metadata.approvalId,
		approvalKind: metadata.approvalKind,
		allowedDecisions: metadata.allowedDecisions,
		targetAuthorKeys,
		route,
		routeAllowed: true,
		ttlMs: params.ttlMs
	})) || registered;
	return registered;
}
function unregisterSignalApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params);
	if (!key) return;
	signalApprovalReactionTargets.delete(key);
}
function resolveTarget(params) {
	const target = params.target;
	if (!target) return null;
	if (params.targetAuthorKeys.length === 0 || !params.targetAuthorKeys.some((key) => target.targetAuthorKeys.includes(key))) return null;
	const resolved = resolveTypedApprovalReactionTarget({
		target,
		reactionKey: params.reactionKey
	});
	if (!resolved?.route) return null;
	return {
		approvalId: resolved.approvalId,
		approvalKind: resolved.approvalKind,
		decision: resolved.decision,
		route: resolved.route
	};
}
async function resolveSignalApprovalReactionTargetWithPersistence(params) {
	const key = buildReactionTargetKey(params);
	if (!key) return null;
	const targetAuthorKeys = resolveSignalApprovalTargetAuthorKeys(params);
	if (targetAuthorKeys.length === 0) return null;
	return resolveTarget({
		target: await signalApprovalReactionTargets.lookup(key),
		reactionKey: params.reactionKey,
		targetAuthorKeys
	});
}
async function maybeResolveSignalApprovalReaction(params) {
	const target = await resolveSignalApprovalReactionTargetWithPersistence({
		accountId: params.accountId,
		conversationKey: params.conversationKey,
		messageId: params.messageId,
		reactionKey: params.reactionKey,
		targetAuthor: params.targetAuthor,
		targetAuthorUuid: params.targetAuthorUuid
	});
	if (!target) return false;
	if (!isSignalApprovalReactionRouteStillEnabled({
		cfg: params.cfg,
		target
	})) {
		params.logVerboseMessage?.(`signal: approval reaction denied id=${target.approvalId}; approval route is no longer enabled`);
		return true;
	}
	const actorId = params.actorId?.trim();
	if (!actorId) {
		params.logVerboseMessage?.(`signal: approval reaction ignored for ${target.approvalId}; missing actor identity`);
		return true;
	}
	if (getSignalApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) {
		params.logVerboseMessage?.(`signal: approval reaction denied id=${target.approvalId}; reactions require explicit approvers`);
		return true;
	}
	if (!signalApprovalAuth.authorizeActorAction({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: actorId,
		action: "approve",
		approvalKind: target.approvalKind
	}).authorized) {
		params.logVerboseMessage?.(`signal: approval reaction denied id=${target.approvalId} sender=${actorId}`);
		return true;
	}
	const resolveApprovalOverGateway = await loadResolveApprovalOverGateway();
	try {
		const result = await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: target.approvalId,
			approvalKind: target.approvalKind,
			decision: target.decision,
			channel: "signal",
			accountId: params.accountId,
			senderId: actorId,
			gatewayUrl: params.gatewayUrl
		});
		const terminalTruth = formatSignalApprovalTerminalTruth(result.approval);
		unregisterSignalApprovalReactionTarget({
			accountId: params.accountId,
			conversationKey: params.conversationKey,
			messageId: params.messageId
		});
		if (!result.applied) {
			params.logVerboseMessage?.(`signal: approval reaction already resolved id=${target.approvalId} sender=${actorId} ${terminalTruth}`);
			return true;
		}
		params.logVerboseMessage?.(`signal: approval reaction resolved id=${target.approvalId} sender=${actorId} ${terminalTruth}`);
		return true;
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			unregisterSignalApprovalReactionTarget({
				accountId: params.accountId,
				conversationKey: params.conversationKey,
				messageId: params.messageId
			});
			params.logVerboseMessage?.(`signal: approval reaction ignored for expired approval id=${target.approvalId} sender=${actorId}`);
			return true;
		}
		params.logVerboseMessage?.(`signal: approval reaction failed id=${target.approvalId} sender=${actorId}: ${String(error)}`);
		throw error;
	}
}
function clearSignalApprovalReactionTargetsForTest() {
	signalApprovalReactionTargets.clearForTest();
	loadResolveApprovalOverGateway.clear();
}
//#endregion
export { registerSignalApprovalReactionTarget as a, resolveSignalApprovalTargetAuthorKeys as c, maybeResolveSignalApprovalReaction as i, unregisterSignalApprovalReactionTarget as l, approval_reactions_exports as n, registerSignalApprovalReactionTargetForDeliveredPayload as o, hasSignalApprovalReactionApprovers as r, resolveSignalApprovalConversationKey as s, addSignalApprovalReactionHintToStructuredPayload as t };
