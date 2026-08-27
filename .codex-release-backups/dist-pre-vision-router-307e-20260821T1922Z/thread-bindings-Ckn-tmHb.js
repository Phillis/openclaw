import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { g as isFutureDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { a as unregisterSessionBindingAdapter, r as registerSessionBindingAdapter } from "./session-binding-service-tMO6MxaM.js";
import { c as resolveThreadBindingMaxAgeMsForChannel, o as resolveThreadBindingIdleTimeoutMsForChannel } from "./thread-bindings-policy-BQCu1bho.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import "./conversation-runtime-NY0yBPvh.js";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-BL83Pq2C.js";
import "./agent-scope-runtime-Cx8GdDGm.js";
//#region extensions/feishu/src/thread-bindings.ts
const FEISHU_THREAD_BINDINGS_STATE_KEY = Symbol.for("openclaw.feishuThreadBindingsState");
let state;
function getState() {
	if (!state) {
		const globalStore = globalThis;
		state = globalStore[FEISHU_THREAD_BINDINGS_STATE_KEY] ?? {
			managersByAccountId: /* @__PURE__ */ new Map(),
			bindingsByAccountConversation: /* @__PURE__ */ new Map()
		};
		globalStore[FEISHU_THREAD_BINDINGS_STATE_KEY] = state;
	}
	return state;
}
function resolveBindingKey(params) {
	return `${params.accountId}:${params.conversationId}`;
}
function toSessionBindingTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "session";
}
function toFeishuTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "acp";
}
function toSessionBindingRecord(record, defaults) {
	const idleExpiresAt = defaults.idleTimeoutMs > 0 ? record.lastActivityAt + defaults.idleTimeoutMs : void 0;
	const maxAgeExpiresAt = defaults.maxAgeMs > 0 ? record.boundAt + defaults.maxAgeMs : void 0;
	const expiresAt = idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt;
	return {
		bindingId: resolveBindingKey({
			accountId: record.accountId,
			conversationId: record.conversationId
		}),
		targetSessionKey: record.targetSessionKey,
		targetKind: toSessionBindingTargetKind(record.targetKind),
		conversation: {
			channel: "feishu",
			accountId: record.accountId,
			conversationId: record.conversationId,
			parentConversationId: record.parentConversationId
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt,
		metadata: {
			agentId: record.agentId,
			label: record.label,
			boundBy: record.boundBy,
			deliveryTo: record.deliveryTo,
			deliveryThreadId: record.deliveryThreadId,
			lastActivityAt: record.lastActivityAt,
			idleTimeoutMs: defaults.idleTimeoutMs,
			maxAgeMs: defaults.maxAgeMs
		}
	};
}
function createFeishuThreadBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const existing = getState().managersByAccountId.get(accountId);
	if (existing) return existing;
	const bindingTimeouts = {
		idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel({
			cfg: params.cfg,
			channel: "feishu",
			accountId
		}),
		maxAgeMs: resolveThreadBindingMaxAgeMsForChannel({
			cfg: params.cfg,
			channel: "feishu",
			accountId
		})
	};
	const resolveActiveBinding = (record, now = Date.now()) => {
		if (!record) return;
		const { expiresAt } = toSessionBindingRecord(record, bindingTimeouts);
		if (expiresAt === void 0 || isFutureDateTimestampMs(expiresAt, { nowMs: now })) return record;
		getState().bindingsByAccountConversation.delete(resolveBindingKey({
			accountId,
			conversationId: record.conversationId
		}));
	};
	const manager = {
		accountId,
		getByConversationId: (conversationId) => resolveActiveBinding(getState().bindingsByAccountConversation.get(resolveBindingKey({
			accountId,
			conversationId
		}))),
		listBySessionKey: (targetSessionKey) => {
			const now = Date.now();
			return [...getState().bindingsByAccountConversation.values()].filter((record) => record.accountId === accountId && record.targetSessionKey === targetSessionKey && resolveActiveBinding(record, now) !== void 0);
		},
		bindConversation: ({ conversationId, parentConversationId, targetKind, targetSessionKey, metadata }) => {
			const normalizedConversationId = conversationId.trim();
			const normalizedTargetSessionKey = targetSessionKey.trim();
			if (!normalizedConversationId || !normalizedTargetSessionKey) return null;
			const existingLocal = manager.getByConversationId(normalizedConversationId);
			const now = Date.now();
			const record = {
				accountId,
				conversationId: normalizedConversationId,
				parentConversationId: normalizeOptionalString(parentConversationId) ?? existingLocal?.parentConversationId,
				deliveryTo: typeof metadata?.deliveryTo === "string" && metadata.deliveryTo.trim() ? metadata.deliveryTo.trim() : existingLocal?.deliveryTo,
				deliveryThreadId: typeof metadata?.deliveryThreadId === "string" && metadata.deliveryThreadId.trim() ? metadata.deliveryThreadId.trim() : existingLocal?.deliveryThreadId,
				targetKind: toFeishuTargetKind(targetKind),
				targetSessionKey: normalizedTargetSessionKey,
				agentId: normalizeOptionalString(metadata?.agentId) ?? existingLocal?.agentId ?? resolveSessionAgentId({
					config: params.cfg,
					sessionKey: normalizedTargetSessionKey
				}),
				label: typeof metadata?.label === "string" && metadata.label.trim() ? metadata.label.trim() : existingLocal?.label,
				boundBy: typeof metadata?.boundBy === "string" && metadata.boundBy.trim() ? metadata.boundBy.trim() : existingLocal?.boundBy,
				boundAt: now,
				lastActivityAt: now
			};
			getState().bindingsByAccountConversation.set(resolveBindingKey({
				accountId,
				conversationId: normalizedConversationId
			}), record);
			return record;
		},
		touchConversation: (conversationId, at = Date.now()) => {
			const key = resolveBindingKey({
				accountId,
				conversationId
			});
			const existingRecord = manager.getByConversationId(conversationId);
			if (!existingRecord) return null;
			const updated = {
				...existingRecord,
				lastActivityAt: at
			};
			getState().bindingsByAccountConversation.set(key, updated);
			return updated;
		},
		unbindConversation: (conversationId) => {
			const key = resolveBindingKey({
				accountId,
				conversationId
			});
			const existingRecord = getState().bindingsByAccountConversation.get(key);
			if (!existingRecord) return null;
			getState().bindingsByAccountConversation.delete(key);
			return existingRecord;
		},
		unbindBySessionKey: (targetSessionKey) => {
			const removed = [];
			for (const record of getState().bindingsByAccountConversation.values()) {
				if (record.accountId !== accountId || record.targetSessionKey !== targetSessionKey) continue;
				getState().bindingsByAccountConversation.delete(resolveBindingKey({
					accountId,
					conversationId: record.conversationId
				}));
				removed.push(record);
			}
			return removed;
		},
		stop: () => {
			for (const key of getState().bindingsByAccountConversation.keys()) if (key.startsWith(`${accountId}:`)) getState().bindingsByAccountConversation.delete(key);
			getState().managersByAccountId.delete(accountId);
			unregisterSessionBindingAdapter({
				channel: "feishu",
				accountId,
				adapter: sessionBindingAdapter
			});
		}
	};
	const sessionBindingAdapter = {
		channel: "feishu",
		accountId,
		capabilities: { placements: ["current"] },
		bind: async (input) => {
			if (input.conversation.channel !== "feishu" || input.placement === "child") return null;
			const bound = manager.bindConversation({
				conversationId: input.conversation.conversationId,
				parentConversationId: input.conversation.parentConversationId,
				targetKind: input.targetKind,
				targetSessionKey: input.targetSessionKey,
				metadata: input.metadata
			});
			return bound ? toSessionBindingRecord(bound, bindingTimeouts) : null;
		},
		listBySession: (targetSessionKey) => manager.listBySessionKey(targetSessionKey).map((entry) => toSessionBindingRecord(entry, bindingTimeouts)),
		resolveByConversation: (ref) => {
			if (ref.channel !== "feishu") return null;
			const found = manager.getByConversationId(ref.conversationId);
			return found ? toSessionBindingRecord(found, bindingTimeouts) : null;
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (conversationId) manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return manager.unbindBySessionKey(input.targetSessionKey.trim()).map((entry) => toSessionBindingRecord(entry, bindingTimeouts));
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const removed = manager.unbindConversation(conversationId);
			return removed ? [toSessionBindingRecord(removed, bindingTimeouts)] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	getState().managersByAccountId.set(accountId, manager);
	return manager;
}
function getFeishuThreadBindingManager(accountId) {
	return getState().managersByAccountId.get(normalizeAccountId(accountId)) ?? null;
}
const testing = { resetFeishuThreadBindingsForTests() {
	for (const manager of getState().managersByAccountId.values()) manager.stop();
	getState().managersByAccountId.clear();
	getState().bindingsByAccountConversation.clear();
} };
//#endregion
export { getFeishuThreadBindingManager as n, testing as r, createFeishuThreadBindingManager as t };
