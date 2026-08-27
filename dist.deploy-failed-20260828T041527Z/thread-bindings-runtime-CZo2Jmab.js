import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { c as listCurrentConversationBindingRecordsBySession, i as registerSessionBindingAdapter, l as resolveCurrentConversationBindingRecord, o as unregisterSessionBindingAdapter, s as deleteCurrentConversationBindingRecordsBySession, u as updateCurrentConversationBindingRecord } from "./session-binding-service-47rBLtwF.js";
import { c as resolveThreadBindingMaxAgeMsForChannel, o as resolveThreadBindingIdleTimeoutMsForChannel } from "./thread-bindings-policy-Bjjk-DS_.js";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-BL83Pq2C.js";
//#region src/infra/outbound/account-scoped-conversation-bindings.ts
function getState(stateKey) {
	return resolveGlobalSingleton(stateKey, () => ({ managersByAccountId: /* @__PURE__ */ new Map() }));
}
function resolveBindingKey(accountId, conversationId) {
	return `${accountId}:${conversationId}`;
}
function toSessionBindingRecord(params) {
	const idleExpiresAt = params.idleTimeoutMs > 0 ? params.record.lastActivityAt + params.idleTimeoutMs : void 0;
	const maxAgeExpiresAt = params.maxAgeMs > 0 ? params.record.boundAt + params.maxAgeMs : void 0;
	const expiresAt = idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt;
	return {
		bindingId: resolveBindingKey(params.record.accountId, params.record.conversationId),
		targetSessionKey: params.record.targetSessionKey,
		targetKind: params.toSessionBindingTargetKind(params.record.targetKind),
		conversation: {
			channel: params.channel,
			accountId: params.record.accountId,
			conversationId: params.record.conversationId
		},
		status: "active",
		boundAt: params.record.boundAt,
		expiresAt,
		metadata: {
			...params.metadata,
			agentId: params.record.agentId,
			label: params.record.label,
			boundBy: params.record.boundBy,
			lastActivityAt: params.record.lastActivityAt,
			idleTimeoutMs: params.idleTimeoutMs,
			maxAgeMs: params.maxAgeMs
		}
	};
}
/** Creates a channel/account binding manager and registers it as a session-binding adapter. */
function createAccountScopedConversationBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const state = getState(params.stateKey);
	const existingManager = state.managersByAccountId.get(accountId);
	if (existingManager) return existingManager;
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMsForChannel({
		cfg: params.cfg,
		channel: params.channel,
		accountId
	});
	const maxAgeMs = resolveThreadBindingMaxAgeMsForChannel({
		cfg: params.cfg,
		channel: params.channel,
		accountId
	});
	const asSessionBindingRecord = (record, metadata) => toSessionBindingRecord({
		channel: params.channel,
		record,
		idleTimeoutMs,
		maxAgeMs,
		toSessionBindingTargetKind: params.toSessionBindingTargetKind,
		metadata
	});
	const conversationRef = (conversationId) => ({
		channel: params.channel,
		accountId,
		conversationId
	});
	const asAccountBindingRecord = (record) => {
		const metadata = record.metadata;
		return {
			accountId,
			conversationId: record.conversation.conversationId,
			targetKind: params.toStoredTargetKind(record.targetKind),
			targetSessionKey: record.targetSessionKey,
			agentId: typeof metadata?.agentId === "string" ? metadata.agentId : void 0,
			label: typeof metadata?.label === "string" ? metadata.label : void 0,
			boundBy: typeof metadata?.boundBy === "string" ? metadata.boundBy : void 0,
			boundAt: record.boundAt,
			lastActivityAt: typeof metadata?.lastActivityAt === "number" ? metadata.lastActivityAt : record.boundAt
		};
	};
	const bindConversationRecord = (input) => {
		const normalizedConversationId = input.conversationId.trim();
		const normalizedTargetSessionKey = input.targetSessionKey.trim();
		if (!normalizedConversationId || !normalizedTargetSessionKey) return null;
		const now = Date.now();
		const { current } = updateCurrentConversationBindingRecord(conversationRef(normalizedConversationId), (existing) => {
			const existingLocal = existing ? asAccountBindingRecord(existing) : void 0;
			const record = {
				accountId,
				conversationId: normalizedConversationId,
				targetKind: params.toStoredTargetKind(input.targetKind),
				targetSessionKey: normalizedTargetSessionKey,
				agentId: (typeof input.metadata?.agentId === "string" && input.metadata.agentId.trim() ? input.metadata.agentId.trim() : existingLocal?.agentId) ?? resolveSessionAgentId({
					config: params.cfg,
					sessionKey: normalizedTargetSessionKey
				}),
				label: typeof input.metadata?.label === "string" && input.metadata.label.trim() ? input.metadata.label.trim() : existingLocal?.label,
				boundBy: typeof input.metadata?.boundBy === "string" && input.metadata.boundBy.trim() ? input.metadata.boundBy.trim() : existingLocal?.boundBy,
				boundAt: now,
				lastActivityAt: now
			};
			return asSessionBindingRecord(record, {
				...existing?.metadata,
				...input.metadata
			});
		});
		return current;
	};
	const accountScope = {
		channel: params.channel,
		accountId
	};
	const manager = {
		accountId,
		getByConversationId: (conversationId) => {
			const record = resolveCurrentConversationBindingRecord(conversationRef(conversationId));
			return record ? asAccountBindingRecord(record) : void 0;
		},
		listBySessionKey: (targetSessionKey) => listCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope).map(asAccountBindingRecord),
		bindConversation: (input) => {
			const record = bindConversationRecord(input);
			return record ? asAccountBindingRecord(record) : null;
		},
		touchConversation: (conversationId, at = Date.now()) => {
			const { current } = updateCurrentConversationBindingRecord(conversationRef(conversationId), (existing) => {
				if (!existing) return null;
				const updated = {
					...asAccountBindingRecord(existing),
					lastActivityAt: at
				};
				return asSessionBindingRecord(updated, existing.metadata);
			});
			return current ? asAccountBindingRecord(current) : null;
		},
		unbindConversation: (conversationId) => {
			const { previous } = updateCurrentConversationBindingRecord(conversationRef(conversationId), () => null);
			return previous ? asAccountBindingRecord(previous) : null;
		},
		unbindBySessionKey: (targetSessionKey) => deleteCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope).map(asAccountBindingRecord),
		stop: () => {
			state.managersByAccountId.delete(accountId);
			unregisterSessionBindingAdapter({
				channel: params.channel,
				accountId,
				adapter: sessionBindingAdapter
			});
		}
	};
	const sessionBindingAdapter = {
		channel: params.channel,
		accountId,
		capabilities: { placements: ["current"] },
		bind: async (input) => {
			if (input.conversation.channel !== params.channel || input.placement === "child") return null;
			return bindConversationRecord({
				conversationId: input.conversation.conversationId,
				targetKind: input.targetKind,
				targetSessionKey: input.targetSessionKey,
				metadata: input.metadata
			});
		},
		listBySession: (targetSessionKey) => listCurrentConversationBindingRecordsBySession(targetSessionKey, accountScope),
		resolveByConversation: (ref) => {
			if (ref.channel !== params.channel) return null;
			return resolveCurrentConversationBindingRecord(conversationRef(ref.conversationId));
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return deleteCurrentConversationBindingRecordsBySession(input.targetSessionKey.trim(), accountScope);
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const { previous } = updateCurrentConversationBindingRecord(conversationRef(conversationId), () => null);
			return previous ? [previous] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	state.managersByAccountId.set(accountId, manager);
	return manager;
}
/** Stops registered account-scoped adapters for one test key without clearing durable bindings. */
function resetAccountScopedConversationBindingsForTests(params) {
	const state = getState(params.stateKey);
	for (const manager of state.managersByAccountId.values()) manager.stop();
	state.managersByAccountId.clear();
}
//#endregion
export { resetAccountScopedConversationBindingsForTests as n, createAccountScopedConversationBindingManager as t };
