import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { a as unregisterSessionBindingAdapter, r as registerSessionBindingAdapter } from "./session-binding-service-tMO6MxaM.js";
import { n as readAcpSessionEntry } from "./session-meta-CkBRKe6w.js";
import { t as resolveThreadBindingLifecycle } from "./thread-binding-lifecycle-DRD2ETVq.js";
import { i as resolveThreadBindingEffectiveExpiresAt } from "./thread-bindings-policy-BQCu1bho.js";
import { t as formatThreadBindingDurationLabel } from "./thread-bindings-messages-Bu2rTgwL.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import { t as resolveTelegramToken } from "./token-D47gWAV0.js";
import "./conversation-runtime--ULGu1_N.js";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-BL83Pq2C.js";
import "./acp-runtime-BdQ2pX54.js";
import { n as getTelegramRuntime } from "./runtime-D4cq5Nic.js";
import { t as loadTelegramSendModule } from "./send-runtime-GOuPEqWc.js";
import { i as resolveStoredBindingKey, n as TELEGRAM_THREAD_BINDINGS_NAMESPACE, o as sanitizeStoredBinding, t as TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES } from "./thread-bindings-store-Bx9mFb83.js";
//#region extensions/telegram/src/thread-bindings.ts
const DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS = 1440 * 60 * 1e3;
const DEFAULT_THREAD_BINDING_MAX_AGE_MS = 0;
const THREAD_BINDINGS_SWEEP_INTERVAL_MS = 6e4;
/**
* Keep Telegram thread binding state shared across bundled chunks so routing,
* binding lookups, and binding mutations all observe the same live registry.
*/
const TELEGRAM_THREAD_BINDINGS_STATE_KEY = Symbol.for("openclaw.telegramThreadBindingsState");
let threadBindingsState;
function getThreadBindingsState() {
	if (!threadBindingsState) {
		const globalStore = globalThis;
		threadBindingsState = globalStore[TELEGRAM_THREAD_BINDINGS_STATE_KEY] ?? {
			managersByAccountId: /* @__PURE__ */ new Map(),
			bindingsByAccountConversation: /* @__PURE__ */ new Map()
		};
		globalStore[TELEGRAM_THREAD_BINDINGS_STATE_KEY] = threadBindingsState;
	}
	return threadBindingsState;
}
function normalizeDurationMs(raw, fallback) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return fallback;
	return Math.max(0, Math.floor(raw));
}
function resolveBindingKey(params) {
	return `${params.accountId}:${params.conversationId}`;
}
function openThreadBindingStore() {
	return getTelegramRuntime().state.openSyncKeyedStore({
		namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
		maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES
	});
}
function toSessionBindingTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "session";
}
function toTelegramTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "acp";
}
function toSessionBindingRecord(record, defaults) {
	return {
		bindingId: resolveBindingKey({
			accountId: record.accountId,
			conversationId: record.conversationId
		}),
		targetSessionKey: record.targetSessionKey,
		targetKind: toSessionBindingTargetKind(record.targetKind),
		conversation: {
			channel: "telegram",
			accountId: record.accountId,
			conversationId: record.conversationId
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt: resolveThreadBindingEffectiveExpiresAt({
			record,
			defaultIdleTimeoutMs: defaults.idleTimeoutMs,
			defaultMaxAgeMs: defaults.maxAgeMs
		}),
		metadata: {
			agentId: record.agentId,
			label: record.label,
			boundBy: record.boundBy,
			lastActivityAt: record.lastActivityAt,
			idleTimeoutMs: typeof record.idleTimeoutMs === "number" ? Math.max(0, Math.floor(record.idleTimeoutMs)) : defaults.idleTimeoutMs,
			maxAgeMs: typeof record.maxAgeMs === "number" ? Math.max(0, Math.floor(record.maxAgeMs)) : defaults.maxAgeMs,
			...record.metadata
		}
	};
}
function fromSessionBindingInput(params) {
	const now = Date.now();
	const metadata = params.input.metadata ?? {};
	const existing = getThreadBindingsState().bindingsByAccountConversation.get(resolveBindingKey({
		accountId: params.accountId,
		conversationId: params.input.conversationId
	}));
	const record = {
		accountId: params.accountId,
		conversationId: params.input.conversationId,
		targetKind: toTelegramTargetKind(params.input.targetKind),
		targetSessionKey: params.input.targetSessionKey,
		agentId: typeof metadata.agentId === "string" && metadata.agentId.trim() ? metadata.agentId.trim() : existing?.agentId,
		label: typeof metadata.label === "string" && metadata.label.trim() ? metadata.label.trim() : existing?.label,
		boundBy: typeof metadata.boundBy === "string" && metadata.boundBy.trim() ? metadata.boundBy.trim() : existing?.boundBy,
		boundAt: now,
		lastActivityAt: now,
		metadata: {
			...existing?.metadata,
			...metadata
		}
	};
	if (typeof metadata.idleTimeoutMs === "number" && Number.isFinite(metadata.idleTimeoutMs)) record.idleTimeoutMs = Math.max(0, Math.floor(metadata.idleTimeoutMs));
	else if (typeof existing?.idleTimeoutMs === "number") record.idleTimeoutMs = existing.idleTimeoutMs;
	if (typeof metadata.maxAgeMs === "number" && Number.isFinite(metadata.maxAgeMs)) record.maxAgeMs = Math.max(0, Math.floor(metadata.maxAgeMs));
	else if (typeof existing?.maxAgeMs === "number") record.maxAgeMs = existing.maxAgeMs;
	return record;
}
function summarizeLifecycleForLog(record, defaults) {
	const idleTimeoutMs = typeof record.idleTimeoutMs === "number" ? record.idleTimeoutMs : defaults.idleTimeoutMs;
	const maxAgeMs = typeof record.maxAgeMs === "number" ? record.maxAgeMs : defaults.maxAgeMs;
	return `idle=${formatThreadBindingDurationLabel(Math.max(0, Math.floor(idleTimeoutMs)))} maxAge=${formatThreadBindingDurationLabel(Math.max(0, Math.floor(maxAgeMs)))}`;
}
function loadBindingsFromStore(accountId) {
	let store;
	try {
		store = openThreadBindingStore();
	} catch (err) {
		logVerbose(`telegram thread bindings store open failed (${accountId}): ${String(err)}`);
		return [];
	}
	let entries;
	try {
		entries = store.entries();
	} catch (err) {
		logVerbose(`telegram thread bindings store read failed (${accountId}): ${String(err)}`);
		return [];
	}
	const bindings = [];
	for (const entry of entries) {
		if (entry.value.accountId !== accountId) continue;
		const sanitized = sanitizeStoredBinding(accountId, entry.value);
		if (sanitized) {
			bindings.push(sanitized);
			continue;
		}
		try {
			store.delete(entry.key);
		} catch (err) {
			logVerbose(`telegram thread bindings invalid row cleanup failed (${accountId}): ${String(err)}`);
		}
	}
	return bindings;
}
function persistBindingMutation(params) {
	if (!params.persist) return;
	try {
		const store = openThreadBindingStore();
		const key = resolveStoredBindingKey(params.binding);
		if (params.remove) {
			store.delete(key);
			return;
		}
		const stored = sanitizeStoredBinding(params.accountId, params.binding);
		if (stored) store.register(key, stored);
	} catch (err) {
		if (params.throwOnError) throw err;
		logVerbose(`telegram thread bindings persist failed (${params.accountId}, ${params.reason}): ${String(err)}`);
	}
}
function listBindingsForAccount(accountId) {
	return [...getThreadBindingsState().bindingsByAccountConversation.values()].filter((entry) => entry.accountId === accountId);
}
function normalizeTimestampMs(raw) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return Date.now();
	return Math.max(0, Math.floor(raw));
}
function createTelegramThreadBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const existing = getThreadBindingsState().managersByAccountId.get(accountId);
	if (existing) return existing;
	const persist = params.persist ?? true;
	const idleTimeoutMs = normalizeDurationMs(params.idleTimeoutMs, DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS);
	const maxAgeMs = normalizeDurationMs(params.maxAgeMs, DEFAULT_THREAD_BINDING_MAX_AGE_MS);
	const loaded = loadBindingsFromStore(accountId);
	for (const entry of loaded) {
		const key = resolveBindingKey({
			accountId,
			conversationId: entry.conversationId
		});
		getThreadBindingsState().bindingsByAccountConversation.set(key, {
			...entry,
			accountId
		});
	}
	const acpSessionKeys = /* @__PURE__ */ new Set();
	for (const binding of getThreadBindingsState().bindingsByAccountConversation.values()) {
		if (binding.targetKind !== "acp" || !isAcpSessionKey(binding.targetSessionKey)) continue;
		acpSessionKeys.add(binding.targetSessionKey);
	}
	const staleSessionKeys = /* @__PURE__ */ new Set();
	for (const targetSessionKey of acpSessionKeys) {
		const sessionEntry = readAcpSessionEntry({ sessionKey: targetSessionKey });
		if (!sessionEntry || sessionEntry.storeReadFailed) continue;
		if (!sessionEntry.entry || sessionEntry.entry.status === "failed" || sessionEntry.entry.status === "killed" || sessionEntry.entry.status === "timeout" || sessionEntry.acp?.state === "error") staleSessionKeys.add(targetSessionKey);
	}
	for (const sessionKey of staleSessionKeys) {
		const bindingsToRemove = listBindingsForAccount(accountId).filter((b) => b.targetSessionKey === sessionKey);
		for (const binding of bindingsToRemove) {
			getThreadBindingsState().bindingsByAccountConversation.delete(resolveBindingKey({
				accountId,
				conversationId: binding.conversationId
			}));
			persistBindingMutation({
				accountId,
				persist,
				binding,
				remove: true,
				reason: "cleanup-stale"
			});
		}
		if (bindingsToRemove.length > 0) logVerbose(`telegram thread binding: cleaned up ${bindingsToRemove.length} stale binding(s) for session ${sessionKey}`);
	}
	let sweepTimer = null;
	const manager = {
		accountId,
		shouldPersistMutations: () => persist,
		getIdleTimeoutMs: () => idleTimeoutMs,
		getMaxAgeMs: () => maxAgeMs,
		getByConversationId: (conversationIdRaw) => {
			const conversationId = normalizeOptionalString(conversationIdRaw);
			if (!conversationId) return;
			return getThreadBindingsState().bindingsByAccountConversation.get(resolveBindingKey({
				accountId,
				conversationId
			}));
		},
		listBySessionKey: (targetSessionKeyRaw) => {
			const targetSessionKey = targetSessionKeyRaw.trim();
			if (!targetSessionKey) return [];
			return listBindingsForAccount(accountId).filter((entry) => entry.targetSessionKey === targetSessionKey);
		},
		listBindings: () => listBindingsForAccount(accountId),
		touchConversation: (conversationIdRaw, at) => {
			const conversationId = normalizeOptionalString(conversationIdRaw);
			if (!conversationId) return null;
			const key = resolveBindingKey({
				accountId,
				conversationId
			});
			const existingLocal = getThreadBindingsState().bindingsByAccountConversation.get(key);
			if (!existingLocal) return null;
			const nextRecord = {
				...existingLocal,
				lastActivityAt: normalizeTimestampMs(at ?? Date.now())
			};
			getThreadBindingsState().bindingsByAccountConversation.set(key, nextRecord);
			persistBindingMutation({
				accountId,
				persist: manager.shouldPersistMutations(),
				binding: nextRecord,
				reason: "touch"
			});
			return nextRecord;
		},
		unbindConversation: (unbindParams) => {
			const conversationId = normalizeOptionalString(unbindParams.conversationId);
			if (!conversationId) return null;
			const key = resolveBindingKey({
				accountId,
				conversationId
			});
			const removed = getThreadBindingsState().bindingsByAccountConversation.get(key) ?? null;
			if (!removed) return null;
			getThreadBindingsState().bindingsByAccountConversation.delete(key);
			persistBindingMutation({
				accountId,
				persist: manager.shouldPersistMutations(),
				binding: removed,
				remove: true,
				reason: "unbind-conversation",
				throwOnError: unbindParams.throwOnPersistError
			});
			return removed;
		},
		unbindBySessionKey: (unbindParams) => {
			const targetSessionKey = unbindParams.targetSessionKey.trim();
			if (!targetSessionKey) return [];
			const removed = [];
			for (const entry of listBindingsForAccount(accountId)) {
				if (entry.targetSessionKey !== targetSessionKey) continue;
				const key = resolveBindingKey({
					accountId,
					conversationId: entry.conversationId
				});
				getThreadBindingsState().bindingsByAccountConversation.delete(key);
				persistBindingMutation({
					accountId,
					persist: manager.shouldPersistMutations(),
					binding: entry,
					remove: true,
					reason: "unbind-session",
					throwOnError: unbindParams.throwOnPersistError
				});
				removed.push(entry);
			}
			return removed;
		},
		stop: () => {
			if (sweepTimer) {
				clearInterval(sweepTimer);
				sweepTimer = null;
			}
			unregisterSessionBindingAdapter({
				channel: "telegram",
				accountId,
				adapter: sessionBindingAdapter
			});
			if (getThreadBindingsState().managersByAccountId.get(accountId) === manager) getThreadBindingsState().managersByAccountId.delete(accountId);
		}
	};
	const sessionBindingAdapter = {
		channel: "telegram",
		accountId,
		capabilities: { placements: ["current", "child"] },
		bind: async (input) => {
			if (input.conversation.channel !== "telegram") return null;
			const targetSessionKey = input.targetSessionKey.trim();
			if (!targetSessionKey) return null;
			const placement = input.placement === "child" ? "child" : "current";
			const metadata = input.metadata ?? {};
			let conversationId;
			if (placement === "child") {
				const rawConversationId = input.conversation.conversationId?.trim() ?? "";
				const chatId = (input.conversation.parentConversationId?.trim() ?? "") || rawConversationId;
				if (!chatId) {
					logVerbose(`telegram: child bind failed: could not resolve group chat ID from conversationId=${rawConversationId}`);
					return null;
				}
				if (!chatId.startsWith("-")) {
					logVerbose(`telegram: child bind failed: conversationId "${chatId}" looks like a bare topic ID, not a group chat ID (expected to start with "-"). Provide a full chatId:topic:topicId conversationId or set parentConversationId to the group chat ID.`);
					return null;
				}
				const threadName = (normalizeOptionalString(metadata.threadName) ?? "") || (normalizeOptionalString(metadata.label) ?? "") || `Agent: ${targetSessionKey.split(":").pop()}`;
				try {
					const tokenResolution = resolveTelegramToken(params.cfg, { accountId });
					if (!tokenResolution.token) return null;
					const { createForumTopicTelegram } = await loadTelegramSendModule();
					const result = await createForumTopicTelegram(chatId, threadName, {
						cfg: params.cfg,
						token: tokenResolution.token,
						accountId
					});
					conversationId = `${result.chatId}:topic:${result.topicId}`;
				} catch (err) {
					logVerbose(`telegram: child thread-binding failed for ${chatId}: ${formatErrorMessage(err)}`);
					return null;
				}
			} else conversationId = normalizeOptionalString(input.conversation.conversationId);
			if (!conversationId) return null;
			const record = fromSessionBindingInput({
				accountId,
				input: {
					targetSessionKey,
					targetKind: input.targetKind,
					conversationId,
					metadata: input.metadata
				}
			});
			getThreadBindingsState().bindingsByAccountConversation.set(resolveBindingKey({
				accountId,
				conversationId
			}), record);
			persistBindingMutation({
				accountId,
				persist: manager.shouldPersistMutations(),
				binding: record,
				reason: "bind",
				throwOnError: true
			});
			logVerbose(`telegram: bound conversation ${conversationId} -> ${targetSessionKey} (${summarizeLifecycleForLog(record, {
				idleTimeoutMs,
				maxAgeMs
			})})`);
			return toSessionBindingRecord(record, {
				idleTimeoutMs,
				maxAgeMs
			});
		},
		listBySession: (targetSessionKeyRaw) => {
			const targetSessionKey = targetSessionKeyRaw.trim();
			if (!targetSessionKey) return [];
			return manager.listBySessionKey(targetSessionKey).map((entry) => toSessionBindingRecord(entry, {
				idleTimeoutMs,
				maxAgeMs
			}));
		},
		resolveByConversation: (ref) => {
			if (ref.channel !== "telegram") return null;
			const conversationId = normalizeOptionalString(ref.conversationId);
			if (!conversationId) return null;
			const record = manager.getByConversationId(conversationId);
			return record ? toSessionBindingRecord(record, {
				idleTimeoutMs,
				maxAgeMs
			}) : null;
		},
		touch: (bindingId, at) => {
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId
			});
			if (!conversationId) return;
			manager.touchConversation(conversationId, at);
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return manager.unbindBySessionKey({
				targetSessionKey: input.targetSessionKey,
				reason: input.reason,
				sendFarewell: false,
				throwOnPersistError: true
			}).map((entry) => toSessionBindingRecord(entry, {
				idleTimeoutMs,
				maxAgeMs
			}));
			const conversationId = resolveThreadBindingConversationIdFromBindingId({
				accountId,
				bindingId: input.bindingId
			});
			if (!conversationId) return [];
			const removed = manager.unbindConversation({
				conversationId,
				reason: input.reason,
				sendFarewell: false,
				throwOnPersistError: true
			});
			return removed ? [toSessionBindingRecord(removed, {
				idleTimeoutMs,
				maxAgeMs
			})] : [];
		}
	};
	registerSessionBindingAdapter(sessionBindingAdapter);
	if (params.enableSweeper !== false) {
		sweepTimer = setInterval(() => {
			const now = Date.now();
			for (const record of listBindingsForAccount(accountId)) {
				const { expiresAt, reason } = resolveThreadBindingLifecycle({
					record,
					defaultIdleTimeoutMs: idleTimeoutMs,
					defaultMaxAgeMs: maxAgeMs
				});
				if (expiresAt === void 0 || now < expiresAt) continue;
				manager.unbindConversation({
					conversationId: record.conversationId,
					reason,
					sendFarewell: false
				});
			}
		}, THREAD_BINDINGS_SWEEP_INTERVAL_MS);
		sweepTimer.unref?.();
	}
	getThreadBindingsState().managersByAccountId.set(accountId, manager);
	return manager;
}
function getTelegramThreadBindingManager(accountId) {
	return getThreadBindingsState().managersByAccountId.get(normalizeAccountId(accountId)) ?? null;
}
function updateTelegramBindingsBySessionKey(params) {
	const targetSessionKey = params.targetSessionKey.trim();
	if (!targetSessionKey) return [];
	const now = Date.now();
	const updated = [];
	for (const entry of params.manager.listBySessionKey(targetSessionKey)) {
		const key = resolveBindingKey({
			accountId: params.manager.accountId,
			conversationId: entry.conversationId
		});
		const next = params.update(entry, now);
		getThreadBindingsState().bindingsByAccountConversation.set(key, next);
		persistBindingMutation({
			accountId: params.manager.accountId,
			persist: params.manager.shouldPersistMutations(),
			binding: next,
			reason: "session-lifecycle-update"
		});
		updated.push(next);
	}
	return updated;
}
function setTelegramThreadBindingIdleTimeoutBySessionKey(params) {
	const manager = getTelegramThreadBindingManager(params.accountId);
	if (!manager) return [];
	const idleTimeoutMs = normalizeDurationMs(params.idleTimeoutMs, 0);
	return updateTelegramBindingsBySessionKey({
		manager,
		targetSessionKey: params.targetSessionKey,
		update: (entry, now) => ({
			...entry,
			idleTimeoutMs,
			lastActivityAt: now
		})
	});
}
function setTelegramThreadBindingMaxAgeBySessionKey(params) {
	const manager = getTelegramThreadBindingManager(params.accountId);
	if (!manager) return [];
	const maxAgeMs = normalizeDurationMs(params.maxAgeMs, 0);
	return updateTelegramBindingsBySessionKey({
		manager,
		targetSessionKey: params.targetSessionKey,
		update: (entry, now) => ({
			...entry,
			maxAgeMs,
			lastActivityAt: now
		})
	});
}
function resetTelegramThreadBindingsForTests() {
	for (const manager of getThreadBindingsState().managersByAccountId.values()) manager.stop();
	getThreadBindingsState().managersByAccountId.clear();
	getThreadBindingsState().bindingsByAccountConversation.clear();
	return Promise.resolve();
}
//#endregion
export { setTelegramThreadBindingMaxAgeBySessionKey as a, setTelegramThreadBindingIdleTimeoutBySessionKey as i, getTelegramThreadBindingManager as n, resetTelegramThreadBindingsForTests as r, createTelegramThreadBindingManager as t };
