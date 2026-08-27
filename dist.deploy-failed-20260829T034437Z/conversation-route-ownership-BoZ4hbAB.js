import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CUBiGmG3.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { An as executeSqliteQuerySync } from "./openclaw-state-db-CeAO_dqo.js";
import { n as normalizeRouteBindingId } from "./binding-scope-DG1HvdoC.js";
import { g as openOpenClawAgentDatabase } from "./openclaw-agent-db-CM8nAOgX.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import { J as parseStoredConversationRouteContext, U as upsertConversationIdentity, nt as parseSessionEntryJson, q as parseConversationRouteContext } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { i as getSessionKysely, m as toDatabaseOptions, s as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import { n as getGlobalPluginRegistry } from "./hook-runner-global-CWpWIBkz.js";
import { n as PlatformMessageNotDispatchedError } from "./deliver-types-w6kiySpD.js";
import { u as getConversationDeliveryOperation } from "./delivery-completion-DBkrMmbZ.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
import { l as peerKindMatches, o as resolveAgentRoute } from "./resolve-route-CaHBZG2x.js";
import { n as resolveConfiguredBindingRoute, r as resolveRuntimeConversationBindingRoute } from "./binding-routing-C1a-oNmf.js";
import { createHash } from "node:crypto";
//#region src/gateway/conversation-errors.ts
/** Terminal caller/input failure for Gateway-owned conversation operations. */
var ConversationInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConversationInputError";
	}
};
/** Durable operation id already belongs to a different request identity. */
var ConversationOperationConflictError = class extends ConversationInputError {
	constructor(message) {
		super(message);
		this.name = "ConversationOperationConflictError";
	}
};
//#endregion
//#region src/config/sessions/conversation-registry.ts
const CONVERSATION_REF_PATTERN = /^conv_[a-f0-9]{32}$/u;
function resolveConversationRegistryScope(params) {
	const configuredStore = params.config.session?.store;
	return {
		agentId: params.agentId,
		...configuredStore ? { storePath: resolveSessionStorePathCore(configuredStore, { agentId: params.agentId }) } : {}
	};
}
function normalizeConversationRef(value) {
	const normalized = value.trim().toLowerCase();
	if (!CONVERSATION_REF_PATTERN.test(normalized)) throw new Error(`Invalid conversationRef: ${value}`);
	return normalized;
}
function mapConversationRow(row) {
	if (row.kind !== "direct" && row.kind !== "group" && row.kind !== "channel") return null;
	const role = row.role === "primary" || row.role === "participant" || row.role === "related" ? row.role : void 0;
	const hasCurrentBinding = (row.current_entry_json ? parseSessionEntryJson({ entry_json: row.current_entry_json }) : null)?.sessionId === row.current_session_id;
	const associationIsCurrent = hasCurrentBinding && row.associated_session_id === row.current_session_id;
	const routeContext = parseStoredConversationRouteContext(row.route_context_json, row.last_seen_at);
	return {
		associationIsCurrent,
		record: {
			conversationRef: row.conversation_id,
			channel: row.channel,
			accountId: row.account_id,
			kind: row.kind,
			peerId: row.peer_id,
			target: row.delivery_target,
			...row.parent_conversation_id ? { parentConversationRef: row.parent_conversation_id } : {},
			...row.thread_id ? { threadId: row.thread_id } : {},
			...row.native_channel_id ? { nativeChannelId: row.native_channel_id } : {},
			...row.native_direct_user_id ? { nativeDirectUserId: row.native_direct_user_id } : {},
			...row.label ? { label: row.label } : {},
			...role && hasCurrentBinding && row.current_session_id && row.current_session_key ? {
				sessionId: row.current_session_id,
				sessionKey: row.current_session_key,
				role
			} : {},
			...role ? { observedFromSession: true } : {},
			...routeContext ? { routeContextObserved: true } : {},
			...routeContext?.context ? { routeContext: routeContext.context } : {},
			firstSeenAt: row.first_seen_at ?? row.conversation_created_at,
			lastSeenAt: row.last_seen_at ?? row.conversation_updated_at
		}
	};
}
function selectConversationRows(scope, options = {}) {
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteReadScope({
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.storePath ? { storePath: scope.storePath } : {}
	})));
	let query = getSessionKysely(database.db).selectFrom("conversations as c").leftJoin("session_conversations as sc", "sc.conversation_id", "c.conversation_id").leftJoin("session_windows as s", "s.session_id", "sc.session_id").leftJoin("session_nodes as sn", "sn.session_key", "s.session_key").select([
		"c.conversation_id",
		"c.channel",
		"c.account_id",
		"c.kind",
		"c.peer_id",
		"c.delivery_target",
		"c.parent_conversation_id",
		"c.thread_id",
		"c.native_channel_id",
		"c.native_direct_user_id",
		"c.label",
		"c.created_at as conversation_created_at",
		"c.updated_at as conversation_updated_at",
		"sc.role",
		"sc.route_context_json",
		"sc.first_seen_at",
		"sc.last_seen_at",
		"s.session_id as associated_session_id",
		"sn.current_session_id as current_session_id",
		"sn.entry_json as current_entry_json",
		"sn.session_key as current_session_key"
	]);
	const channel = normalizeOptionalLowercaseString(options.channel);
	if (channel) query = query.where("c.channel", "=", channel);
	if (options.conversationRef) query = query.where("c.conversation_id", "=", normalizeConversationRef(options.conversationRef));
	const rows = executeSqliteQuerySync(database.db, query.orderBy((eb) => eb.fn.coalesce("sc.last_seen_at", "c.updated_at"), "desc").orderBy("sn.updated_at", "desc")).rows;
	const unique = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const mapped = mapConversationRow(row);
		if (!mapped) continue;
		const existing = unique.get(mapped.record.conversationRef);
		if (!existing) {
			unique.set(mapped.record.conversationRef, mapped);
			continue;
		}
		if (!existing.associationIsCurrent && mapped.associationIsCurrent && mapped.record.sessionId && mapped.record.sessionKey && mapped.record.role) {
			const { routeContext: _staleRouteContext, routeContextObserved: _staleRouteContextObserved, ...existingRecord } = existing.record;
			unique.set(mapped.record.conversationRef, {
				associationIsCurrent: true,
				record: {
					...existingRecord,
					sessionId: mapped.record.sessionId,
					sessionKey: mapped.record.sessionKey,
					role: mapped.record.role,
					...mapped.record.routeContextObserved ? { routeContextObserved: true } : {},
					...mapped.record.routeContext ? { routeContext: mapped.record.routeContext } : {}
				}
			});
		}
	}
	const values = [...unique.values()].map(({ record }) => record);
	return options.limit === void 0 ? values : values.slice(0, options.limit);
}
/** Catalogs routable addresses without creating model-context sessions. */
function registerConversationAddresses(scope, identities, discoveredAt = Date.now()) {
	if (identities.length === 0) return;
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteReadScope({
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.storePath ? { storePath: scope.storePath } : {}
	})));
	for (const identity of identities) upsertConversationIdentity(database, identity, discoveredAt);
}
/** Lists stable external addresses for one agent, newest activity first. */
function listConversations(scope, options = {}) {
	return selectConversationRows(scope, options);
}
/** Resolves an opaque address to one exact channel target and its context binding, when present. */
function resolveConversation(scope, conversationRef) {
	return selectConversationRows(scope, {
		conversationRef: normalizeConversationRef(conversationRef),
		limit: 1
	})[0];
}
//#endregion
//#region src/config/sessions/conversation-route-fingerprint.ts
/** Binds queued authority to the exact route facts admitted by the Gateway. */
function resolveConversationRouteFingerprint(route) {
	const context = route.routeContext ? parseConversationRouteContext(route.routeContext) : void 0;
	return createHash("sha256").update(JSON.stringify([
		route.channel,
		route.accountId,
		route.kind,
		route.peerId,
		route.target,
		route.parentConversationRef ?? null,
		route.threadId ?? null,
		route.nativeChannelId ?? null,
		route.nativeDirectUserId ?? null,
		route.routeContextObserved === true,
		context ?? null
	])).digest("hex");
}
//#endregion
//#region src/gateway/conversation-route-ownership.ts
function hasActivePluginClaimOwner(pluginId) {
	return getGlobalPluginRegistry()?.typedHooks.some((hook) => hook.pluginId === pluginId && hook.hookName === "inbound_claim") === true;
}
function resolvePluginRouteOwner(config, conversation) {
	const channelId = normalizeChannelId(conversation.channel);
	const resolver = channelId ? getLoadedChannelPlugin(channelId)?.messaging?.resolveConversationRouteOwner : void 0;
	if (!resolver) return;
	try {
		const owner = resolver({
			cfg: config,
			accountId: normalizeAccountId(conversation.accountId),
			conversation: {
				kind: conversation.kind,
				peerId: conversation.peerId,
				target: conversation.target,
				...conversation.threadId ? { threadId: conversation.threadId } : {},
				...conversation.nativeChannelId ? { nativeChannelId: conversation.nativeChannelId } : {},
				...conversation.routeContext ? { context: conversation.routeContext } : {}
			}
		});
		if (owner === void 0) return;
		if (owner === null) return { kind: "available" };
		if (owner.kind === "unavailable") return owner;
		if (owner.kind === "plugin") return hasActivePluginClaimOwner(owner.pluginId) ? { kind: "available" } : {
			kind: "available",
			agentId: normalizeAgentId(owner.fallbackAgentId)
		};
		return {
			kind: "available",
			agentId: normalizeAgentId(owner.agentId)
		};
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return { kind: "available" };
		throw error;
	}
}
function resolveConfiguredRouteOwner(config, conversation, context) {
	try {
		return resolveAgentRoute({
			cfg: config,
			channel: conversation.channel,
			accountId: conversation.accountId,
			peer: {
				kind: conversation.kind,
				id: conversation.peerId
			},
			...context?.parentPeerId && conversation.kind !== "direct" ? { parentPeer: {
				kind: conversation.kind,
				id: context.parentPeerId
			} } : {},
			...context?.guildId ? { guildId: context.guildId } : {},
			...context?.teamId ? { teamId: context.teamId } : {},
			...context?.memberRoleIds ? { memberRoleIds: context.memberRoleIds } : {}
		});
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return;
		throw error;
	}
}
function resolveGenericRouteOwner(params) {
	const conversation = {
		channel: params.conversation.channel,
		accountId: normalizeAccountId(params.conversation.accountId),
		conversationId: params.conversation.peerId,
		...params.context?.parentPeerId ? { parentConversationId: params.context.parentPeerId } : {}
	};
	const runtime = resolveRuntimeConversationBindingRoute({
		route: resolveConfiguredBindingRoute({
			cfg: params.config,
			route: params.route,
			conversation
		}).route,
		conversation,
		touchBinding: false
	});
	if (runtime.bindingOwnerAvailable === false) return { kind: "unavailable" };
	if (runtime.pluginId && hasActivePluginClaimOwner(runtime.pluginId)) return { kind: "available" };
	return {
		kind: "available",
		agentId: normalizeAgentId(runtime.route.agentId)
	};
}
function bindingPeerCouldMatchConversation(binding, conversation) {
	const peer = binding.match.peer;
	if (!peer) return true;
	const kind = normalizeChatType(peer.kind);
	const id = normalizeRouteBindingId(peer.id);
	if (!kind || !id) return false;
	return peerKindMatches(kind, conversation.kind) && (id === "*" || id === conversation.peerId);
}
function hasUnrecordedContextualBinding(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.conversation.channel);
	const accountId = normalizeAccountId(params.conversation.accountId);
	const hasThreadContext = Boolean(params.conversation.parentConversationRef || params.conversation.threadId);
	const hasGuildContext = params.conversation.kind === "channel";
	return listRouteBindings(params.config).some((binding) => {
		const pattern = binding.match.accountId?.trim() ?? "";
		return Boolean(hasGuildContext && normalizeRouteBindingId(binding.match.guildId) || normalizeRouteBindingId(binding.match.teamId) || hasGuildContext && binding.match.roles?.length || hasThreadContext && binding.match.peer?.kind !== "direct" && normalizeRouteBindingId(binding.match.peer?.id)) && normalizeAgentId(binding.agentId) !== params.resolvedAgentId && normalizeLowercaseStringOrEmpty(binding.match.channel) === channel && (pattern === "*" || normalizeAccountId(pattern) === accountId) && bindingPeerCouldMatchConversation(binding, params.conversation);
	});
}
/** Replays current configured and plugin-owned routing for a persisted conversation address. */
function resolveConversationRouteEligibilityForAgent(params) {
	const requestedAgentId = normalizeAgentId(params.agentId);
	const hasObservedContext = Boolean(params.conversation.routeContextObserved || params.conversation.routeContext);
	const pluginOwner = resolvePluginRouteOwner(params.config, params.conversation);
	if (pluginOwner) {
		if (pluginOwner.kind === "unavailable") return "unavailable";
		return pluginOwner.agentId === requestedAgentId && !(!hasObservedContext && pluginOwner.agentId && hasUnrecordedContextualBinding({
			config: params.config,
			conversation: params.conversation,
			resolvedAgentId: pluginOwner.agentId
		})) ? "eligible" : "denied";
	}
	const route = resolveConfiguredRouteOwner(params.config, params.conversation, params.conversation.routeContext);
	if (!route) return "denied";
	const owner = resolveGenericRouteOwner({
		config: params.config,
		conversation: params.conversation,
		route,
		...params.conversation.routeContext ? { context: params.conversation.routeContext } : {}
	});
	if (owner.kind === "unavailable") return "unavailable";
	if (owner.agentId !== requestedAgentId) return "denied";
	return !hasObservedContext && hasUnrecordedContextualBinding({
		config: params.config,
		conversation: params.conversation,
		resolvedAgentId: owner.agentId
	}) ? "denied" : "eligible";
}
/** Enforces current route ownership at a Gateway request boundary. */
function assertConversationRouteEligibleForAgent(params) {
	const eligibility = resolveConversationRouteEligibilityForAgent(params);
	if (eligibility === "eligible") return;
	if (eligibility === "denied") throw new ConversationInputError(`Conversation is not available to this agent: ${params.conversation.conversationRef}`);
	throw new Error(`Conversation ownership is temporarily unavailable: ${params.conversation.conversationRef}`);
}
function assertConversationDeliveryAttemptAuthorized(params) {
	const conversation = (params.resolveConversation ?? resolveConversation)(params.scope, params.conversationRef);
	if (!conversation || resolveConversationRouteFingerprint(conversation) !== params.expectedRouteFingerprint || params.expectedSessionId !== void 0 && conversation.sessionId !== params.expectedSessionId || params.expectedSessionKey !== void 0 && conversation.sessionKey !== params.expectedSessionKey) throw new PlatformMessageNotDispatchedError(`Conversation is no longer available to this agent: ${params.conversationRef}`, {
		cause: void 0,
		retryable: false
	});
	const eligibility = resolveConversationRouteEligibilityForAgent({
		config: params.config,
		agentId: params.agentId,
		conversation
	});
	if (eligibility === "eligible") return;
	throw new PlatformMessageNotDispatchedError(eligibility === "unavailable" ? `Conversation ownership is temporarily unavailable: ${params.conversationRef}` : `Conversation is no longer available to this agent: ${params.conversationRef}`, {
		cause: void 0,
		retryable: eligibility === "unavailable"
	});
}
function assertQueuedConversationDeliveryAttemptAuthorized(params) {
	const scope = {
		agentId: params.agentId,
		...params.storePath ? { storePath: params.storePath } : {}
	};
	const operation = getConversationDeliveryOperation(scope, params.operationId);
	if (!operation) throw new PlatformMessageNotDispatchedError(`Conversation delivery operation no longer exists: ${params.operationId}`, {
		cause: void 0,
		retryable: false
	});
	assertConversationDeliveryAttemptAuthorized({
		config: params.config,
		agentId: params.agentId,
		conversationRef: operation.conversationRef,
		expectedRouteFingerprint: params.routeFingerprint,
		scope
	});
}
//#endregion
export { resolveConversationRouteFingerprint as a, resolveConversation as c, ConversationOperationConflictError as d, resolveConversationRouteEligibilityForAgent as i, resolveConversationRegistryScope as l, assertConversationRouteEligibleForAgent as n, listConversations as o, assertQueuedConversationDeliveryAttemptAuthorized as r, registerConversationAddresses as s, assertConversationDeliveryAttemptAuthorized as t, ConversationInputError as u };
