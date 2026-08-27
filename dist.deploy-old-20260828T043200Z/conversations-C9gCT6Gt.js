import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { at as validateConversationTurnCancelParams, it as validateConversationSendParams, ot as validateConversationTurnParams, rt as validateConversationListParams } from "./src-4dv5TpeQ.js";
import { W as buildConversationIdentity } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { r as resolveMessageReceiptPrimaryId } from "./receipt-BzekpwQi.js";
import { c as beginConversationDeliveryOperation, d as markConversationDeliveryQueued, m as markConversationDeliverySuppressed, p as markConversationDeliverySent, s as ConversationDeliveryInputError, u as getConversationDeliveryOperation } from "./delivery-completion-DBkrMmbZ.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B1taGHmD.js";
import { r as resolveOutboundSessionRoute, t as bindOutboundSessionEntry } from "./outbound-session-B9AYez4r.js";
import { n as runMessageAction } from "./message-action-runner-CxKIh4RX.js";
import { r as registerPendingConversationTurn, t as cancelPendingConversationTurn } from "./conversation-turns-CGd1HUcH.js";
import { t as formatForLog } from "./ws-log-CjO1AAG7.js";
import { n as defineValidatedGatewayMethod } from "./validation-kYFXohur.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-WSekhXHE.js";
import { a as resolveConversationRouteFingerprint, c as resolveConversation, d as ConversationOperationConflictError, i as resolveConversationRouteEligibilityForAgent, l as resolveConversationRegistryScope, n as assertConversationRouteEligibleForAgent, o as listConversations, s as registerConversationAddresses, t as assertConversationDeliveryAttemptAuthorized, u as ConversationInputError } from "./conversation-route-ownership-STTzyg-F.js";
import { n as resolveGatewayInflightRequest, r as runGatewayInflightWork, t as cacheGatewayDedupeResult } from "./inflight-C7tVF6RA.js";
import crypto, { createHash } from "node:crypto";
//#region src/gateway/conversation-list.ts
const log = createSubsystemLogger("gateway/conversations");
const defaultDeps$2 = {
	listConversations,
	registerConversationAddresses,
	resolveOutboundChannelPlugin,
	resolveOutboundSessionRoute
};
function presentConversation(conversation) {
	return {
		conversationRef: conversation.conversationRef,
		channel: conversation.channel,
		accountId: conversation.accountId,
		kind: conversation.kind,
		target: conversation.target,
		...conversation.threadId ? { threadId: conversation.threadId } : {},
		...conversation.label ? { label: conversation.label } : {},
		firstSeenAt: conversation.firstSeenAt,
		lastSeenAt: conversation.lastSeenAt
	};
}
async function listLiveDirectoryEntries(params) {
	try {
		return await params.run();
	} catch (error) {
		log.warn("live directory discovery failed; using configured entries", {
			channel: params.channel,
			accountId: params.accountId,
			kind: params.kind,
			error: formatErrorMessage(error)
		});
		return [];
	}
}
async function listDirectoryEntries(params) {
	const input = {
		cfg: params.config,
		accountId: params.accountId,
		...params.query ? { query: params.query } : {},
		limit: params.limit,
		runtime: defaultRuntime
	};
	const directory = params.plugin.directory;
	const listPeersLive = directory?.listPeersLive;
	const listGroupsLive = directory?.listGroupsLive;
	const [configuredPeers, livePeers, configuredGroups, liveGroups] = await Promise.all([
		directory?.listPeers?.(input) ?? [],
		listPeersLive ? listLiveDirectoryEntries({
			channel: params.plugin.id,
			accountId: params.accountId,
			kind: "peers",
			run: () => listPeersLive(input)
		}) : [],
		directory?.listGroups?.(input) ?? [],
		listGroupsLive ? listLiveDirectoryEntries({
			channel: params.plugin.id,
			accountId: params.accountId,
			kind: "groups",
			run: () => listGroupsLive(input)
		}) : []
	]);
	const entries = /* @__PURE__ */ new Map();
	for (const entry of [
		...configuredPeers,
		...livePeers,
		...configuredGroups,
		...liveGroups
	]) entries.set(`${entry.kind}\u0000${entry.id.trim()}`, entry);
	return [...entries.values()];
}
async function discoverChannelAddresses(params) {
	const plugin = params.deps.resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.config
	});
	if (!plugin?.directory) return {
		channel: params.channel.trim().toLowerCase(),
		discoveredConversationRefs: /* @__PURE__ */ new Set()
	};
	const identities = /* @__PURE__ */ new Map();
	for (const accountId of new Set(plugin.config.listAccountIds(params.config).filter(Boolean))) {
		const account = plugin.config.resolveAccount(params.config, accountId);
		if (plugin.config.isEnabled?.(account, params.config) === false) continue;
		if (plugin.config.isConfigured && !await plugin.config.isConfigured(account, params.config)) continue;
		const entries = await listDirectoryEntries({
			config: params.config,
			accountId,
			...params.query ? { query: params.query } : {},
			limit: params.limit,
			plugin
		});
		for (const entry of entries) {
			const target = entry.id.trim();
			if (!target) continue;
			const display = entry.name?.trim() || entry.handle?.trim() || void 0;
			const route = await params.deps.resolveOutboundSessionRoute({
				cfg: params.config,
				channel: plugin.id,
				plugin,
				agentId: params.agentId,
				accountId,
				target,
				resolvedTarget: {
					to: target,
					kind: entry.kind,
					...display ? { display } : {},
					source: "directory",
					resolutionSource: "directory"
				}
			});
			if (!route) continue;
			const identity = buildConversationIdentity({
				channel: plugin.id,
				accountId,
				kind: route.chatType,
				peerId: route.from,
				deliveryTarget: route.to,
				...route.threadId !== void 0 ? { threadId: route.threadId } : {},
				...route.peer.kind === "direct" ? { nativeDirectUserId: route.peer.id } : { nativeChannelId: route.peer.id },
				...display ? { label: display } : {}
			});
			if (identity) identities.set(identity.conversationRef, identity);
		}
	}
	const currentConfig = params.readCurrentConfig?.() ?? params.config;
	const eligibleIdentities = [...identities.values()].filter((identity) => {
		const eligibility = resolveConversationRouteEligibilityForAgent({
			config: currentConfig,
			agentId: params.agentId,
			conversation: {
				...identity,
				target: identity.deliveryTarget
			}
		});
		if (eligibility === "unavailable") throw new Error("Conversation route ownership is temporarily unavailable");
		return eligibility === "eligible";
	});
	params.deps.registerConversationAddresses(params.scope, eligibleIdentities);
	return {
		channel: plugin.id,
		discoveredConversationRefs: new Set(eligibleIdentities.map((identity) => identity.conversationRef))
	};
}
function matchesConversationQuery(conversation, rawQuery) {
	const query = rawQuery.trim().toLowerCase();
	if (!query) return true;
	const terms = query.startsWith("@") ? [query, query.slice(1)] : [query];
	const values = [
		conversation.conversationRef,
		conversation.target,
		conversation.label
	].filter((value) => Boolean(value)).map((value) => value.toLowerCase());
	return terms.some((term) => term && values.some((value) => value.includes(term)));
}
/** Lists persisted and channel-directory addresses from the Gateway's live plugin runtime. */
async function runGatewayConversationList(params, deps = defaultDeps$2) {
	const scope = resolveConversationRegistryScope(params);
	const query = params.query?.trim() || void 0;
	const discovery = params.channel ? await discoverChannelAddresses({
		config: params.config,
		agentId: params.agentId,
		channel: params.channel,
		...query ? { query } : {},
		limit: params.limit,
		scope,
		deps,
		...params.readCurrentConfig ? { readCurrentConfig: params.readCurrentConfig } : {}
	}) : void 0;
	const conversations = deps.listConversations(scope, discovery ? { channel: discovery.channel } : {});
	const currentConfig = params.readCurrentConfig?.() ?? params.config;
	return { conversations: conversations.filter((entry) => {
		if (query && discovery?.discoveredConversationRefs.has(entry.conversationRef) !== true && !matchesConversationQuery(entry, query)) return false;
		const eligibility = resolveConversationRouteEligibilityForAgent({
			config: currentConfig,
			agentId: params.agentId,
			conversation: entry
		});
		if (eligibility === "unavailable") throw new Error("Conversation route ownership is temporarily unavailable");
		return eligibility === "eligible";
	}).slice(0, params.limit).map(presentConversation) };
}
//#endregion
//#region src/infra/outbound/conversation-delivery.ts
/** Durable external-conversation delivery independent from local model sessions. */
const defaultConversationDeliveryDeps = {
	beginOperation: beginConversationDeliveryOperation,
	getOperation: getConversationDeliveryOperation,
	markQueued: markConversationDeliveryQueued,
	markSent: markConversationDeliverySent,
	markSuppressed: markConversationDeliverySuppressed,
	runMessageAction
};
var ConversationDeliveryRejectedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConversationDeliveryRejectedError";
	}
};
function buildConversationDeliveryIntentId(agentId, operationId) {
	return `convq_${crypto.createHash("sha256").update(JSON.stringify([agentId, operationId])).digest("hex").slice(0, 32)}`;
}
function resolveConversationDeliveryStoreScope(context) {
	return {
		agentId: context.agentId,
		storePath: resolveSessionStorePathCore(context.config.session?.store, { agentId: context.agentId })
	};
}
function readMessageIdFromActionResult(result) {
	if (result.kind !== "send") return;
	const sendResult = result.sendResult?.result;
	if (sendResult && "receipt" in sendResult && sendResult.receipt) {
		const receiptId = resolveMessageReceiptPrimaryId(sendResult.receipt);
		if (receiptId) return receiptId;
	}
	if (sendResult && "messageId" in sendResult && typeof sendResult.messageId === "string") return sendResult.messageId.trim() || void 0;
	const payload = result.payload;
	if (payload && typeof payload === "object" && !Array.isArray(payload)) {
		const messageId = payload.messageId;
		return typeof messageId === "string" && messageId.trim() ? messageId.trim() : void 0;
	}
}
function resultFromExistingOperation(operation) {
	switch (operation.status) {
		case "sent":
		case "replied": return {
			deliveryStatus: "sent",
			operation,
			...operation.platformMessageId || operation.preparedMessageId ? { messageId: operation.platformMessageId ?? operation.preparedMessageId } : {}
		};
		case "queued": return {
			deliveryStatus: "queued",
			operation,
			...operation.preparedMessageId ? { messageId: operation.preparedMessageId } : {}
		};
		case "suppressed": return {
			deliveryStatus: "suppressed",
			operation
		};
		case "rejected": throw new ConversationDeliveryRejectedError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
		case "unknown": return {
			deliveryStatus: "unknown",
			operation
		};
		case "created": return;
	}
	return operation.status;
}
/**
* Sends one external message after a durable operation and queue intent exist.
* A retry with the same operation id observes prior state instead of re-sending.
*/
async function sendGatewayConversationMessage(params) {
	const scope = resolveConversationDeliveryStoreScope(params.context);
	const begun = params.operation ? {
		created: false,
		record: params.operation
	} : params.deps.beginOperation(scope, {
		operationId: params.operationId,
		operationKind: params.operationKind,
		conversationRef: params.conversation.conversationRef,
		...params.context.sourceSessionKey ? { sourceSessionKey: params.context.sourceSessionKey } : {},
		message: params.message,
		...params.preparedMessageId ? { preparedMessageId: params.preparedMessageId } : {}
	});
	const existing = resultFromExistingOperation(begun.record);
	if (existing) return existing;
	let latestOperation = begun.record;
	const readAuthoritativeOperation = () => params.deps.getOperation(scope, begun.record.operationId) ?? latestOperation;
	const onDeliveryIntent = (intent) => {
		latestOperation = params.deps.markQueued(scope, begun.record.operationId, intent.id);
	};
	try {
		const action = await params.deps.runMessageAction({
			cfg: params.context.config,
			action: "send",
			params: {
				channel: params.conversation.channel,
				to: params.conversation.target,
				message: params.message,
				...params.conversation.threadId ? { threadId: params.conversation.threadId } : {},
				idempotencyKey: params.operationId
			},
			defaultAccountId: params.conversation.accountId,
			agentId: params.context.agentId,
			sessionKey: params.context.sourceSessionKey,
			senderIsOwner: params.context.senderIsOwner,
			suppressTranscriptMirror: true,
			forceCoreDelivery: true,
			gatewayOwnedDelivery: true,
			requireQueuePersistence: true,
			deliveryIntentId: buildConversationDeliveryIntentId(params.context.agentId, begun.record.operationId),
			deliveryCompletion: {
				kind: "conversation",
				agentId: scope.agentId,
				operationId: begun.record.operationId,
				...scope.storePath ? { storePath: scope.storePath } : {},
				routeFingerprint: params.routeFingerprint
			},
			onDeliveryIntent,
			onDeliveryAttempt: params.onDeliveryAttempt,
			...begun.record.preparedMessageId ? { preparedMessageId: begun.record.preparedMessageId } : {},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		if (action.kind !== "send") throw new Error(`Conversation delivery returned unexpected action: ${action.kind}`);
		if (action.dryRun) throw new Error("Conversation delivery was only prepared; no message was sent");
		if (action.handledBy !== "core" || !action.sendResult) throw new Error("Conversation delivery did not return a core platform send result");
		const messageId = readMessageIdFromActionResult(action);
		if (action.sendResult.deliveryStatus === "suppressed") return {
			deliveryStatus: "suppressed",
			operation: params.deps.markSuppressed(scope, begun.record.operationId)
		};
		if (action.sendResult.deliveryStatus !== "sent") throw new Error(`Conversation delivery was not confirmed (${action.sendResult.deliveryStatus ?? "unknown"})`);
		const authoritativeOperation = readAuthoritativeOperation();
		const operation = authoritativeOperation.status === "sent" || authoritativeOperation.status === "replied" ? authoritativeOperation : params.deps.markSent(scope, begun.record.operationId, messageId);
		const confirmedMessageId = messageId ?? operation.platformMessageId ?? operation.preparedMessageId;
		return {
			deliveryStatus: "sent",
			operation,
			...confirmedMessageId ? { messageId: confirmedMessageId } : {}
		};
	} catch (error) {
		const persisted = resultFromExistingOperation(readAuthoritativeOperation());
		if (persisted) return persisted;
		throw error;
	}
}
//#endregion
//#region src/gateway/conversation-send.ts
const defaultDeps$1 = {
	...defaultConversationDeliveryDeps,
	resolveConversation
};
function resultForCompletedOperation$1(operation) {
	const base = {
		conversationRef: operation.conversationRef,
		channel: operation.channel,
		...operation.queueId ? { queueId: operation.queueId } : {}
	};
	switch (operation.status) {
		case "sent":
		case "replied": return {
			...base,
			status: "sent",
			...operation.platformMessageId || operation.preparedMessageId ? { messageId: operation.platformMessageId ?? operation.preparedMessageId } : {}
		};
		case "queued": return {
			...base,
			status: "queued",
			...operation.preparedMessageId ? { messageId: operation.preparedMessageId } : {}
		};
		case "suppressed": return {
			...base,
			status: "suppressed"
		};
		case "rejected": throw new ConversationDeliveryRejectedError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
		case "unknown": return {
			...base,
			status: "unknown"
		};
		case "created": return;
	}
	return operation.status;
}
/** Performs one durable conversation send inside the Gateway channel owner. */
async function runGatewayConversationSend(params, deps = defaultDeps$1) {
	const scope = resolveConversationRegistryScope(params);
	try {
		const prior = deps.getOperation(scope, params.operationId);
		let operation;
		if (prior) operation = deps.beginOperation(scope, {
			operationId: params.operationId,
			operationKind: "send",
			conversationRef: params.conversationRef,
			...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
			message: params.message
		}).record;
		const conversation = deps.resolveConversation(scope, params.conversationRef);
		if (!conversation) throw new ConversationInputError(`Conversation not found: ${params.conversationRef} (use conversations_list)`);
		const currentConfig = params.readCurrentConfig?.() ?? params.config;
		assertConversationRouteEligibleForAgent({
			config: currentConfig,
			agentId: params.agentId,
			conversation
		});
		const routeFingerprint = resolveConversationRouteFingerprint(conversation);
		if (operation) {
			const completed = resultForCompletedOperation$1(operation);
			if (completed) return completed;
		}
		const sent = await sendGatewayConversationMessage({
			deps,
			context: {
				agentId: params.agentId,
				...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
				config: currentConfig,
				senderIsOwner: params.senderIsOwner
			},
			conversation,
			message: params.message,
			operationId: params.operationId,
			operationKind: "send",
			routeFingerprint,
			onDeliveryAttempt: async () => {
				assertConversationDeliveryAttemptAuthorized({
					config: params.readCurrentConfig?.() ?? currentConfig,
					agentId: params.agentId,
					conversationRef: conversation.conversationRef,
					expectedRouteFingerprint: routeFingerprint,
					scope,
					resolveConversation: deps.resolveConversation
				});
			},
			...operation ? { operation } : {},
			...params.signal ? { signal: params.signal } : {}
		});
		return {
			status: sent.deliveryStatus,
			conversationRef: conversation.conversationRef,
			channel: conversation.channel,
			...sent.messageId ? { messageId: sent.messageId } : {},
			...sent.operation.queueId ? { queueId: sent.operation.queueId } : {}
		};
	} catch (error) {
		if (error instanceof ConversationDeliveryInputError) throw new ConversationOperationConflictError(error.message);
		if (error instanceof ConversationDeliveryRejectedError) throw new ConversationInputError(error.message);
		throw error;
	}
}
//#endregion
//#region src/gateway/conversation-turn.ts
function hasConversationSessionBinding(conversation) {
	return Boolean(conversation.sessionId && conversation.sessionKey);
}
const defaultDeps = {
	...defaultConversationDeliveryDeps,
	registerPendingConversationTurn,
	resolveConversation,
	resolveOutboundChannelPlugin,
	bindOutboundSessionEntry,
	resolveOutboundSessionRoute
};
function resultForCompletedOperation(params) {
	const { operation } = params;
	const messageId = operation.platformMessageId ?? operation.preparedMessageId;
	if (operation.status === "replied" && operation.reply && messageId) return {
		status: "replied",
		conversationRef: operation.conversationRef,
		channel: operation.channel,
		messageId,
		correlationPersisted: true,
		reply: {
			conversationRef: operation.conversationRef,
			messageId: operation.reply.messageId,
			...operation.reply.replyToId ? { replyToId: operation.reply.replyToId } : {},
			...operation.reply.threadId ? { threadId: operation.reply.threadId } : {},
			text: operation.reply.text,
			timestamp: operation.reply.timestamp
		}
	};
	if (operation.status === "created") return;
	const base = {
		conversationRef: operation.conversationRef,
		channel: operation.channel,
		...messageId ? { messageId } : {}
	};
	switch (operation.status) {
		case "sent": return {
			...base,
			status: "sent",
			correlationPersisted: true,
			error: "Message was already sent; no process-local reply waiter remains."
		};
		case "queued": return {
			...base,
			status: "queued",
			correlationPersisted: true,
			error: "Delivery is queued; a later reply will start an ordinary inbound turn."
		};
		case "suppressed": return {
			...base,
			status: "suppressed",
			correlationPersisted: false,
			error: "Delivery was suppressed before a message was sent."
		};
		case "rejected": throw new ConversationInputError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
		case "unknown": return {
			...base,
			status: "unknown",
			correlationPersisted: false,
			error: "Delivery could not be confirmed and will not be retried automatically."
		};
		case "replied": return {
			...base,
			status: "sent",
			correlationPersisted: true,
			error: "A reply was recorded, but its durable reply payload is incomplete."
		};
	}
	return operation.status;
}
function prepareConversationMessageId(params) {
	const prepare = params.plugin?.outbound?.prepareConversationTurnMessageId;
	if (!prepare) throw new ConversationInputError(`Channel ${params.conversation.channel} does not support correlated conversation turns; use conversations_send`);
	let preparedMessageId;
	try {
		preparedMessageId = prepare({
			cfg: params.config,
			to: params.conversation.target,
			text: params.message,
			accountId: params.conversation.accountId,
			threadId: params.conversation.threadId
		}).trim();
	} catch (error) {
		throw new ConversationInputError(error instanceof Error ? error.message : String(error));
	}
	if (!preparedMessageId) throw new ConversationInputError(`Channel ${params.conversation.channel} prepared an empty conversation-turn message id`);
	return preparedMessageId;
}
async function ensureConversationContextBinding(params) {
	if (hasConversationSessionBinding(params.conversation)) return params.conversation;
	const channel = params.plugin?.id ?? params.conversation.channel;
	const route = await params.deps.resolveOutboundSessionRoute({
		cfg: params.config,
		channel,
		...params.plugin ? { plugin: params.plugin } : {},
		agentId: params.agentId,
		accountId: params.conversation.accountId,
		target: params.conversation.target,
		...params.conversation.threadId ? { threadId: params.conversation.threadId } : {}
	});
	if (!route) throw new ConversationInputError(`Conversation ${params.conversation.conversationRef} no longer resolves to a channel route`);
	await params.deps.bindOutboundSessionEntry({
		cfg: params.config,
		channel,
		accountId: params.conversation.accountId,
		route,
		assertCommitAllowed: () => {
			assertConversationDeliveryAttemptAuthorized({
				config: params.readCurrentConfig(),
				agentId: params.agentId,
				conversationRef: params.conversation.conversationRef,
				expectedRouteFingerprint: params.expectedRouteFingerprint,
				scope: params.scope,
				resolveConversation: params.deps.resolveConversation
			});
		}
	});
	const bound = params.deps.resolveConversation(params.scope, params.conversation.conversationRef);
	if (!bound || !hasConversationSessionBinding(bound)) throw new Error(`Conversation ${params.conversation.conversationRef} could not create its local context binding`);
	return bound;
}
/** Owns correlation, delivery, and waiting inside the Gateway process that receives ingress. */
async function runGatewayConversationTurn(params, deps = defaultDeps) {
	const scope = resolveConversationRegistryScope(params);
	const prior = deps.getOperation(scope, params.turnId);
	let begun;
	try {
		if (prior) begun = deps.beginOperation(scope, {
			operationId: params.turnId,
			operationKind: "turn",
			conversationRef: params.conversationRef,
			...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
			message: params.message,
			...prior.preparedMessageId ? { preparedMessageId: prior.preparedMessageId } : {}
		});
	} catch (error) {
		if (error instanceof ConversationDeliveryInputError) throw new ConversationOperationConflictError(error.message);
		throw error;
	}
	const discoveredConversation = deps.resolveConversation(scope, params.conversationRef);
	if (!discoveredConversation) throw new ConversationInputError(`Conversation not found: ${params.conversationRef} (use conversations_list)`);
	const readCurrentConfig = params.readCurrentConfig ?? (() => params.config);
	const currentConfig = readCurrentConfig();
	assertConversationRouteEligibleForAgent({
		config: currentConfig,
		agentId: params.agentId,
		conversation: discoveredConversation
	});
	const discoveredRouteFingerprint = resolveConversationRouteFingerprint(discoveredConversation);
	if (begun) {
		const completed = resultForCompletedOperation({ operation: begun.record });
		if (completed) return completed;
	}
	const plugin = deps.resolveOutboundChannelPlugin({
		channel: discoveredConversation.channel,
		cfg: currentConfig
	});
	const candidatePreparedMessageId = begun ? begun.record.preparedMessageId : prepareConversationMessageId({
		plugin,
		config: currentConfig,
		conversation: discoveredConversation,
		message: params.message
	});
	if (!candidatePreparedMessageId) throw new ConversationInputError(`Conversation turn ${params.turnId} is missing its prepared message id`);
	const conversation = await ensureConversationContextBinding({
		deps,
		scope,
		config: currentConfig,
		agentId: params.agentId,
		conversation: discoveredConversation,
		plugin,
		expectedRouteFingerprint: discoveredRouteFingerprint,
		readCurrentConfig
	});
	const authorizedConfig = readCurrentConfig();
	assertConversationRouteEligibleForAgent({
		config: authorizedConfig,
		agentId: params.agentId,
		conversation
	});
	const routeFingerprint = resolveConversationRouteFingerprint(conversation);
	if (!begun) {
		try {
			begun = deps.beginOperation(scope, {
				operationId: params.turnId,
				operationKind: "turn",
				conversationRef: conversation.conversationRef,
				...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
				message: params.message,
				preparedMessageId: candidatePreparedMessageId
			});
		} catch (error) {
			if (error instanceof ConversationDeliveryInputError) throw new ConversationOperationConflictError(error.message);
			throw error;
		}
		const completed = resultForCompletedOperation({ operation: begun.record });
		if (completed) return completed;
	}
	const preparedMessageId = begun.record.preparedMessageId;
	if (!preparedMessageId) throw new ConversationInputError(`Conversation turn ${params.turnId} is missing its prepared message id`);
	const pending = deps.registerPendingConversationTurn({
		agentId: params.agentId,
		id: params.turnId,
		conversationRef: conversation.conversationRef,
		sessionId: conversation.sessionId,
		...conversation.threadId ? { threadId: conversation.threadId } : {},
		timeoutMs: params.timeoutMs
	});
	pending.setOutboundMessageId(preparedMessageId);
	try {
		const sent = await sendGatewayConversationMessage({
			deps,
			context: {
				agentId: params.agentId,
				...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
				config: authorizedConfig,
				senderIsOwner: params.senderIsOwner
			},
			conversation,
			message: params.message,
			operationId: pending.id,
			operationKind: "turn",
			operation: begun.record,
			preparedMessageId,
			routeFingerprint,
			onDeliveryAttempt: async () => {
				assertConversationDeliveryAttemptAuthorized({
					config: readCurrentConfig(),
					agentId: params.agentId,
					conversationRef: conversation.conversationRef,
					expectedRouteFingerprint: routeFingerprint,
					expectedSessionId: conversation.sessionId,
					expectedSessionKey: conversation.sessionKey,
					scope,
					resolveConversation: deps.resolveConversation
				});
			}
		});
		if (sent.deliveryStatus !== "sent") {
			pending.cancel();
			return resultForCompletedOperation({ operation: sent.operation });
		}
		if (!(sent.messageId === preparedMessageId)) {
			pending.cancel();
			return {
				status: "sent",
				conversationRef: conversation.conversationRef,
				channel: conversation.channel,
				...sent.messageId ? { messageId: sent.messageId } : {},
				correlationPersisted: true,
				error: "Channel delivery did not preserve its prepared message id; reply correlation was disabled."
			};
		}
		pending.markReady();
		const reply = await pending.wait();
		return reply ? {
			status: "replied",
			conversationRef: conversation.conversationRef,
			channel: conversation.channel,
			messageId: preparedMessageId,
			correlationPersisted: true,
			reply
		} : {
			status: "timeout",
			conversationRef: conversation.conversationRef,
			channel: conversation.channel,
			messageId: preparedMessageId,
			correlationPersisted: true
		};
	} catch (error) {
		pending.cancel();
		if (error instanceof ConversationDeliveryRejectedError) throw new ConversationInputError(error.message);
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/conversations.ts
function isAuthenticatedOwner(client) {
	return client?.connect?.scopes?.includes(ADMIN_SCOPE) === true;
}
function validateConversationSourceSession(params) {
	if (!params.sourceSessionKey) return true;
	const parsed = parseAgentSessionKey(params.sourceSessionKey);
	if (parsed) {
		if (normalizeAgentId(parsed.agentId) === normalizeAgentId(params.agentId)) return true;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${params.agentId}" does not match session key agent "${parsed.agentId}"`));
		return false;
	}
	const owner = resolveRequestedSessionAgentId(params.config, params.sourceSessionKey, params.agentId);
	if (owner.ok) return true;
	params.respond(false, void 0, owner.error);
	return false;
}
function conversationOperationKey(params) {
	return `conversations.${params.method}:${JSON.stringify([params.agentId, params.operationId])}`;
}
function bindConversationOperationIdentity(context, request) {
	const identity = createHash("sha256").update(JSON.stringify([
		request.agentId,
		request.sourceSessionKey ?? null,
		request.conversationRef,
		request.message,
		request.timeoutMs ?? null
	])).digest("hex");
	const operationKey = conversationOperationKey(request);
	const identityKey = `${operationKey}:identity`;
	const completed = context.dedupe.get(operationKey);
	if (completed && completed.requestIdentity !== identity) return null;
	const prior = context.dedupe.get(identityKey);
	if (prior) {
		if (!prior.ok || prior.requestIdentity !== identity) return null;
		context.dedupe.set(identityKey, {
			...prior,
			ts: Date.now()
		});
		return identity;
	}
	context.dedupe.set(identityKey, {
		ts: Date.now(),
		ok: true,
		requestIdentity: identity
	});
	return identity;
}
function releaseConversationOperationIdentity(params) {
	const identityKey = `${params.operationKey}:identity`;
	if (params.context.dedupe.get(identityKey)?.requestIdentity === params.requestIdentity) params.context.dedupe.delete(identityKey);
}
async function runConversationOperation(params) {
	const inflight = resolveGatewayInflightRequest({
		context: params.context,
		dedupeKey: params.dedupeKey,
		idempotencyKey: params.operationId,
		respond: params.respond
	});
	if (inflight.kind === "handled") {
		await inflight.done;
		return;
	}
	const { dedupeKey, inflightMap } = inflight;
	let releaseRequestIdentity = false;
	const work = (async () => {
		try {
			const payload = await params.execute();
			const result = {
				ok: true,
				payload,
				meta: { channel: payload.channel }
			};
			cacheGatewayDedupeResult({
				context: params.context,
				dedupeKey,
				requestIdentity: params.requestIdentity,
				result
			});
			return result;
		} catch (cause) {
			const isTerminalInputError = cause instanceof ConversationInputError;
			const isOperationConflict = cause instanceof ConversationOperationConflictError;
			const result = {
				ok: false,
				error: errorShape(isTerminalInputError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, cause instanceof Error ? cause.message : String(cause)),
				meta: { error: formatForLog(cause) }
			};
			if (isOperationConflict) releaseRequestIdentity = true;
			else if (isTerminalInputError) cacheGatewayDedupeResult({
				context: params.context,
				dedupeKey,
				requestIdentity: params.requestIdentity,
				result
			});
			return result;
		}
	})();
	try {
		await runGatewayInflightWork({
			inflightMap,
			dedupeKey,
			work,
			respond: params.respond
		});
	} finally {
		if (releaseRequestIdentity) releaseConversationOperationIdentity({
			context: params.context,
			operationKey: dedupeKey,
			requestIdentity: params.requestIdentity
		});
	}
}
const defaultConversationHandlerDeps = {
	cancelConversationTurn: cancelPendingConversationTurn,
	runConversationList: runGatewayConversationList,
	runConversationSend: runGatewayConversationSend,
	runConversationTurn: runGatewayConversationTurn
};
function createConversationHandlers(overrides = {}) {
	const deps = {
		...defaultConversationHandlerDeps,
		...overrides
	};
	return {
		"conversations.list": defineValidatedGatewayMethod("conversations.list", validateConversationListParams, async ({ params: request, respond, context }) => {
			const readCurrentConfig = () => resolveGatewayPluginConfig({ config: context.getRuntimeConfig() });
			try {
				respond(true, await deps.runConversationList({
					config: readCurrentConfig(),
					readCurrentConfig,
					agentId: request.agentId,
					...request.channel ? { channel: request.channel } : {},
					...request.query ? { query: request.query } : {},
					limit: request.limit ?? 50
				}), void 0);
			} catch (cause) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, cause instanceof Error ? cause.message : String(cause)));
			}
		}),
		"conversations.send": defineValidatedGatewayMethod("conversations.send", validateConversationSendParams, async ({ params: request, respond, context, client }) => {
			const readCurrentConfig = () => resolveGatewayPluginConfig({ config: context.getRuntimeConfig() });
			const config = readCurrentConfig();
			if (!validateConversationSourceSession({
				config,
				agentId: request.agentId,
				sourceSessionKey: request.sourceSessionKey,
				respond
			})) return;
			const requestIdentity = bindConversationOperationIdentity(context, {
				method: "send",
				operationId: request.operationId,
				agentId: request.agentId,
				...request.sourceSessionKey ? { sourceSessionKey: request.sourceSessionKey } : {},
				conversationRef: request.conversationRef,
				message: request.message
			});
			if (!requestIdentity) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `conversation send ${request.operationId} was already used with different input`));
				return;
			}
			await runConversationOperation({
				context,
				dedupeKey: conversationOperationKey({
					method: "send",
					agentId: request.agentId,
					operationId: request.operationId
				}),
				operationId: request.operationId,
				requestIdentity,
				respond,
				execute: async () => await deps.runConversationSend({
					config,
					readCurrentConfig,
					agentId: request.agentId,
					senderIsOwner: isAuthenticatedOwner(client),
					...request.sourceSessionKey ? { sourceSessionKey: request.sourceSessionKey } : {},
					operationId: request.operationId,
					conversationRef: request.conversationRef,
					message: request.message
				})
			});
		}),
		"conversations.turn.cancel": defineValidatedGatewayMethod("conversations.turn.cancel", validateConversationTurnCancelParams, ({ params: request, respond }) => {
			respond(true, { cancelled: deps.cancelConversationTurn({
				agentId: request.agentId,
				id: request.turnId
			}) }, void 0);
		}),
		"conversations.turn": defineValidatedGatewayMethod("conversations.turn", validateConversationTurnParams, async ({ params: request, respond, context, client }) => {
			const readCurrentConfig = () => resolveGatewayPluginConfig({ config: context.getRuntimeConfig() });
			const config = readCurrentConfig();
			if (!validateConversationSourceSession({
				config,
				agentId: request.agentId,
				sourceSessionKey: request.sourceSessionKey,
				respond
			})) return;
			const requestIdentity = bindConversationOperationIdentity(context, {
				method: "turn",
				operationId: request.turnId,
				agentId: request.agentId,
				...request.sourceSessionKey ? { sourceSessionKey: request.sourceSessionKey } : {},
				conversationRef: request.conversationRef,
				message: request.message,
				timeoutMs: request.timeoutMs
			});
			if (!requestIdentity) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `conversation turn ${request.turnId} was already used with different input`));
				return;
			}
			await runConversationOperation({
				context,
				dedupeKey: conversationOperationKey({
					method: "turn",
					agentId: request.agentId,
					operationId: request.turnId
				}),
				operationId: request.turnId,
				requestIdentity,
				respond,
				execute: async () => await deps.runConversationTurn({
					config,
					readCurrentConfig,
					agentId: request.agentId,
					senderIsOwner: isAuthenticatedOwner(client),
					...request.sourceSessionKey ? { sourceSessionKey: request.sourceSessionKey } : {},
					turnId: request.turnId,
					conversationRef: request.conversationRef,
					message: request.message,
					timeoutMs: request.timeoutMs
				})
			});
		})
	};
}
const conversationHandlers = createConversationHandlers();
//#endregion
export { conversationHandlers };
