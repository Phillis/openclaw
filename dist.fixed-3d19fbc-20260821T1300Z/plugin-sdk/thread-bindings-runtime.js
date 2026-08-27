import { g as isFutureDateTimestampMs } from "../number-coercion-oCkfUEEq.js";
import { i as resolveGlobalSingleton } from "../global-singleton-Dc_stLtU.js";
import { h as resolveSessionAgentId } from "../agent-scope-D9GLFAyB.js";
import { n as normalizeAccountId } from "../account-id-BRqK6RmF.js";
import { a as unregisterSessionBindingAdapter, r as registerSessionBindingAdapter } from "../session-binding-service-Dk6st5wa.js";
import { t as resolveThreadBindingLifecycle } from "../thread-binding-lifecycle-DRD2ETVq.js";
import { c as resolveThreadBindingMaxAgeMsForChannel, o as resolveThreadBindingIdleTimeoutMsForChannel } from "../thread-bindings-policy-dXDFaPvs.js";
import { n as resolveThreadBindingFarewellText } from "../thread-bindings-messages-Bu2rTgwL.js";
import { t as resolveThreadBindingConversationIdFromBindingId } from "../thread-binding-id-BL83Pq2C.js";
//#region src/infra/outbound/account-scoped-conversation-bindings.ts
function getState(stateKey) {
	return resolveGlobalSingleton(stateKey, () => ({
		managersByAccountId: /* @__PURE__ */ new Map(),
		bindingsByAccountConversation: /* @__PURE__ */ new Map()
	}));
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
	const existing = state.managersByAccountId.get(accountId);
	if (existing) return existing;
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
	const asSessionBindingRecord = (record) => toSessionBindingRecord({
		channel: params.channel,
		record,
		idleTimeoutMs,
		maxAgeMs,
		toSessionBindingTargetKind: params.toSessionBindingTargetKind
	});
	const resolveActiveBinding = (record, now = Date.now()) => {
		if (!record) return;
		const { expiresAt } = asSessionBindingRecord(record);
		if (expiresAt === void 0 || isFutureDateTimestampMs(expiresAt, { nowMs: now })) return record;
		state.bindingsByAccountConversation.delete(resolveBindingKey(accountId, record.conversationId));
	};
	const manager = {
		accountId,
		getByConversationId: (conversationId) => resolveActiveBinding(state.bindingsByAccountConversation.get(resolveBindingKey(accountId, conversationId))),
		listBySessionKey: (targetSessionKey) => {
			const now = Date.now();
			return [...state.bindingsByAccountConversation.values()].filter((record) => record.accountId === accountId && record.targetSessionKey === targetSessionKey && resolveActiveBinding(record, now) !== void 0);
		},
		bindConversation: ({ conversationId, targetKind, targetSessionKey, metadata }) => {
			const normalizedConversationId = conversationId.trim();
			const normalizedTargetSessionKey = targetSessionKey.trim();
			if (!normalizedConversationId || !normalizedTargetSessionKey) return null;
			const existingLocal = manager.getByConversationId(normalizedConversationId);
			const now = Date.now();
			const record = {
				accountId,
				conversationId: normalizedConversationId,
				targetKind: params.toStoredTargetKind(targetKind),
				targetSessionKey: normalizedTargetSessionKey,
				agentId: (typeof metadata?.agentId === "string" && metadata.agentId.trim() ? metadata.agentId.trim() : existingLocal?.agentId) ?? resolveSessionAgentId({
					config: params.cfg,
					sessionKey: normalizedTargetSessionKey
				}),
				label: typeof metadata?.label === "string" && metadata.label.trim() ? metadata.label.trim() : existingLocal?.label,
				boundBy: typeof metadata?.boundBy === "string" && metadata.boundBy.trim() ? metadata.boundBy.trim() : existingLocal?.boundBy,
				boundAt: now,
				lastActivityAt: now
			};
			state.bindingsByAccountConversation.set(resolveBindingKey(accountId, normalizedConversationId), record);
			return record;
		},
		touchConversation: (conversationId, at = Date.now()) => {
			const key = resolveBindingKey(accountId, conversationId);
			const existingRecord = manager.getByConversationId(conversationId);
			if (!existingRecord) return null;
			const updated = {
				...existingRecord,
				lastActivityAt: at
			};
			state.bindingsByAccountConversation.set(key, updated);
			return updated;
		},
		unbindConversation: (conversationId) => {
			const key = resolveBindingKey(accountId, conversationId);
			const existingRecord = state.bindingsByAccountConversation.get(key);
			if (!existingRecord) return null;
			state.bindingsByAccountConversation.delete(key);
			return existingRecord;
		},
		unbindBySessionKey: (targetSessionKey) => {
			const removed = [];
			for (const record of state.bindingsByAccountConversation.values()) {
				if (record.accountId !== accountId || record.targetSessionKey !== targetSessionKey) continue;
				state.bindingsByAccountConversation.delete(resolveBindingKey(accountId, record.conversationId));
				removed.push(record);
			}
			return removed;
		},
		stop: () => {
			for (const key of state.bindingsByAccountConversation.keys()) if (key.startsWith(`${accountId}:`)) state.bindingsByAccountConversation.delete(key);
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
			const bound = manager.bindConversation({
				conversationId: input.conversation.conversationId,
				targetKind: input.targetKind,
				targetSessionKey: input.targetSessionKey,
				metadata: input.metadata
			});
			return bound ? asSessionBindingRecord(bound) : null;
		},
		listBySession: (targetSessionKey) => manager.listBySessionKey(targetSessionKey).map(asSessionBindingRecord),
		resolveByConversation: (ref) => {
			if (ref.channel !== params.channel) return null;
			const found = manager.getByConversationId(ref.conversationId);
			return found ? asSessionBindingRecord(found) : null;
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return manager.unbindBySessionKey(input.targetSessionKey.trim()).map(asSessionBindingRecord);
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const removed = manager.unbindConversation(conversationId);
			return removed ? [asSessionBindingRecord(removed)] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	state.managersByAccountId.set(accountId, manager);
	return manager;
}
/** Stops registered managers and clears account-scoped binding state for one test key. */
function resetAccountScopedConversationBindingsForTests(params) {
	const state = getState(params.stateKey);
	for (const manager of state.managersByAccountId.values()) manager.stop();
	state.managersByAccountId.clear();
	state.bindingsByAccountConversation.clear();
}
//#endregion
export { createAccountScopedConversationBindingManager, registerSessionBindingAdapter, resetAccountScopedConversationBindingsForTests, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingLifecycle, resolveThreadBindingMaxAgeMsForChannel, unregisterSessionBindingAdapter };
