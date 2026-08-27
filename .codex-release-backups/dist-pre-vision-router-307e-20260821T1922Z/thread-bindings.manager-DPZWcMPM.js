import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Dp7mvsA3.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { a as unregisterSessionBindingAdapter, r as registerSessionBindingAdapter } from "./session-binding-service-tMO6MxaM.js";
import { t as SYSTEM_MARK } from "./system-message-Dltw0_t9.js";
import { i as resolveThreadBindingThreadName, n as resolveThreadBindingFarewellText } from "./thread-bindings-messages-Bu2rTgwL.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import "./text-utility-runtime-LRU688AB.js";
import "./text-chunking-DrVvfnLf.js";
import "./runtime-config-snapshot-HfaoynDJ.js";
import "./conversation-runtime-NY0yBPvh.js";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-BL83Pq2C.js";
import "./agent-scope-runtime-Cx8GdDGm.js";
import { Vt as ChannelType, Z as createChannelWebhook, lt as getChannel } from "./discord-BinpTEur.js";
import { d as createDiscordRestClient } from "./send.permissions-g2olELEg.js";
import { n as resolveDiscordChannelId } from "./target-parsing-BCrLMCew.js";
import { t as sendMessageDiscord } from "./send.outbound-BhdhDia0.js";
import { a as createThreadDiscord, r as sendWebhookMessageDiscord } from "./send-DYOj_pdZ.js";
import { A as toReusableWebhookKey, C as resolveThreadBindingMaxAgeExpiresAt, D as shouldDefaultPersist, E as setBindingRecord, S as resolveThreadBindingInactivityExpiresAt, T as saveBindingsToDisk, _ as rememberThreadBindingToken, b as resolveBindingRecordKey, c as ensureBindingsLoaded, f as normalizeTargetKind, g as rememberReusableWebhook, h as refreshUnboundThreadWebhookIdentity, i as REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL, l as forgetThreadBindingToken, m as normalizeThreadId, n as MANAGERS_BY_ACCOUNT_ID, p as normalizeThreadBindingDurationMs, r as PERSIST_BY_ACCOUNT_ID, s as THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS, t as BINDINGS_BY_THREAD_ID, u as getThreadBindingToken, v as removeBindingRecord, w as resolveThreadBindingMaxAgeMs, x as resolveThreadBindingIdleTimeoutMs, y as resolveBindingIdsForSession } from "./thread-bindings.state-CN5XFWc-.js";
import { n as resolveDiscordChannelInfoSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-C12aDZ0p.js";
//#region extensions/discord/src/monitor/thread-bindings.persona.ts
const THREAD_BINDING_PERSONA_MAX_CHARS = 80;
function normalizePersonaLabel(value) {
	if (!value) return;
	return value.replace(/\s+/g, " ").trim() || void 0;
}
function resolveThreadBindingPersona(params) {
	return truncateUtf16Safe(`${SYSTEM_MARK} ${normalizePersonaLabel(params.label) || normalizePersonaLabel(params.agentId) || "agent"}`, THREAD_BINDING_PERSONA_MAX_CHARS);
}
function resolveThreadBindingPersonaFromRecord(record) {
	return resolveThreadBindingPersona({
		label: record.label,
		agentId: record.agentId
	});
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.types.ts
const THREAD_BINDINGS_SWEEP_INTERVAL_MS = 12e4;
const DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS = 1440 * 60 * 1e3;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.discord-api.ts
function buildThreadTarget(threadId) {
	return /^(channel:|user:)/i.test(threadId) ? threadId : `channel:${threadId}`;
}
function isThreadArchived(raw) {
	if (!raw || typeof raw !== "object") return false;
	const asRecord = raw;
	if (asRecord.archived === true) return true;
	if (asRecord.thread_metadata?.archived === true) return true;
	if (asRecord.threadMetadata?.archived === true) return true;
	return false;
}
function isThreadChannelType(type) {
	return type === ChannelType.PublicThread || type === ChannelType.PrivateThread || type === ChannelType.AnnouncementThread;
}
function normalizeDiscordBindingChannelId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return null;
	try {
		return resolveDiscordChannelId(trimmed);
	} catch {
		return null;
	}
}
function summarizeDiscordError(err) {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint" || typeof err === "symbol") return String(err);
	return "error";
}
function extractNumericDiscordErrorValue(value) {
	return parseStrictNonNegativeInteger(value);
}
function extractDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err;
	return extractNumericDiscordErrorValue(candidate.status) ?? extractNumericDiscordErrorValue(candidate.statusCode) ?? extractNumericDiscordErrorValue(candidate.response?.status);
}
function extractDiscordErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err;
	return extractNumericDiscordErrorValue(candidate.code) ?? extractNumericDiscordErrorValue(candidate.rawError?.code) ?? extractNumericDiscordErrorValue(candidate.body?.code) ?? extractNumericDiscordErrorValue(candidate.response?.body?.code) ?? extractNumericDiscordErrorValue(candidate.response?.data?.code);
}
function isDiscordThreadGoneError(err) {
	if (extractDiscordErrorCode(err) === 10003) return true;
	const status = extractDiscordErrorStatus(err);
	return status === 404 || status === 403;
}
async function maybeSendBindingMessage(params) {
	const text = params.text.trim();
	if (!text) return;
	const record = params.record;
	if (params.preferWebhook !== false && record.webhookId && record.webhookToken) try {
		await sendWebhookMessageDiscord(text, {
			cfg: params.cfg,
			webhookId: record.webhookId,
			webhookToken: record.webhookToken,
			accountId: record.accountId,
			threadId: record.threadId,
			username: resolveThreadBindingPersonaFromRecord(record)
		});
		return;
	} catch (err) {
		logVerbose(`discord thread binding webhook send failed: ${summarizeDiscordError(err)}`);
	}
	try {
		await sendMessageDiscord(buildThreadTarget(record.threadId), text, {
			cfg: params.cfg,
			accountId: record.accountId
		});
	} catch (err) {
		logVerbose(`discord thread binding fallback send failed: ${summarizeDiscordError(err)}`);
	}
}
async function createWebhookForChannel(params) {
	try {
		const rest = createDiscordRestClient({
			cfg: params.cfg,
			accountId: params.accountId,
			token: params.token
		}).rest;
		const created = await createChannelWebhook(rest, params.channelId, { body: { name: "OpenClaw Agents" } });
		const webhookId = normalizeOptionalString(created?.id) ?? "";
		const webhookToken = normalizeOptionalString(created?.token) ?? "";
		if (!webhookId || !webhookToken) return {};
		return {
			webhookId,
			webhookToken
		};
	} catch (err) {
		logVerbose(`discord thread binding webhook create failed for ${params.channelId}: ${summarizeDiscordError(err)}`);
		return {};
	}
}
function findReusableWebhook(params) {
	const reusableKey = toReusableWebhookKey({
		accountId: params.accountId,
		channelId: params.channelId
	});
	const cached = REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.get(reusableKey);
	if (cached) return {
		webhookId: cached.webhookId,
		webhookToken: cached.webhookToken
	};
	for (const record of BINDINGS_BY_THREAD_ID.values()) {
		if (record.accountId !== params.accountId) continue;
		if (record.channelId !== params.channelId) continue;
		if (!record.webhookId || !record.webhookToken) continue;
		rememberReusableWebhook(record);
		return {
			webhookId: record.webhookId,
			webhookToken: record.webhookToken
		};
	}
	return {};
}
async function resolveChannelIdForBinding(params) {
	const explicit = normalizeDiscordBindingChannelId(params.channelId);
	if (explicit) return explicit;
	const lookupThreadId = normalizeDiscordBindingChannelId(params.threadId);
	if (!lookupThreadId) return null;
	try {
		const rest = createDiscordRestClient({
			cfg: params.cfg,
			accountId: params.accountId,
			token: params.token
		}).rest;
		const channel = await getChannel(rest, lookupThreadId);
		const channelInfo = resolveDiscordChannelInfoSafe(channel);
		const channelId = normalizeOptionalString(resolveDiscordChannelIdSafe(channel)) ?? "";
		const type = channelInfo.type;
		const parentId = normalizeOptionalString(channelInfo.parentId) ?? "";
		if (parentId && isThreadChannelType(type)) return parentId;
		return channelId || null;
	} catch (err) {
		logVerbose(`discord thread binding channel resolve failed for ${lookupThreadId}: ${summarizeDiscordError(err)}`);
		return null;
	}
}
async function createThreadForBinding(params) {
	try {
		return (normalizeOptionalString((await createThreadDiscord(params.channelId, { name: params.threadName }, {
			cfg: params.cfg,
			accountId: params.accountId,
			token: params.token
		}))?.id) ?? "") || null;
	} catch (err) {
		logVerbose(`discord thread binding auto-thread create failed for ${params.channelId}: ${summarizeDiscordError(err)}`);
		return null;
	}
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-adapter.ts
function normalizeChildBindingParentChannelId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return;
	try {
		return resolveDiscordChannelId(trimmed);
	} catch {
		return;
	}
}
function toSessionBindingTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "session";
}
function toThreadBindingTargetKind(raw) {
	return raw === "subagent" ? "subagent" : "acp";
}
function resolveEffectiveBindingExpiresAt(params) {
	const inactivityExpiresAt = resolveThreadBindingInactivityExpiresAt({
		record: params.record,
		defaultIdleTimeoutMs: params.defaultIdleTimeoutMs
	});
	const maxAgeExpiresAt = resolveThreadBindingMaxAgeExpiresAt({
		record: params.record,
		defaultMaxAgeMs: params.defaultMaxAgeMs
	});
	if (inactivityExpiresAt != null && maxAgeExpiresAt != null) return Math.min(inactivityExpiresAt, maxAgeExpiresAt);
	return inactivityExpiresAt ?? maxAgeExpiresAt;
}
function toSessionBindingRecord(record, defaults) {
	return {
		bindingId: resolveBindingRecordKey({
			accountId: record.accountId,
			threadId: record.threadId
		}) ?? `${record.accountId}:${record.threadId}`,
		targetSessionKey: record.targetSessionKey,
		targetKind: toSessionBindingTargetKind(record.targetKind),
		conversation: {
			channel: "discord",
			accountId: record.accountId,
			conversationId: record.threadId,
			parentConversationId: record.channelId
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt: resolveEffectiveBindingExpiresAt({
			record,
			defaultIdleTimeoutMs: defaults.idleTimeoutMs,
			defaultMaxAgeMs: defaults.maxAgeMs
		}),
		metadata: {
			agentId: record.agentId,
			label: record.label,
			webhookId: record.webhookId,
			webhookToken: record.webhookToken,
			boundBy: record.boundBy,
			lastActivityAt: record.lastActivityAt,
			idleTimeoutMs: resolveThreadBindingIdleTimeoutMs({
				record,
				defaultIdleTimeoutMs: defaults.idleTimeoutMs
			}),
			maxAgeMs: resolveThreadBindingMaxAgeMs({
				record,
				defaultMaxAgeMs: defaults.maxAgeMs
			}),
			...record.metadata
		}
	};
}
function createThreadBindingSessionAdapter(params) {
	const serializeBinding = (entry) => toSessionBindingRecord(entry, params.defaults);
	return {
		channel: "discord",
		accountId: params.accountId,
		capabilities: { placements: ["current", "child"] },
		bind: async (input) => {
			if (input.conversation.channel !== "discord") return null;
			const targetSessionKey = input.targetSessionKey.trim();
			if (!targetSessionKey) return null;
			const conversationId = normalizeOptionalString(input.conversation.conversationId) ?? "";
			const placement = input.placement === "child" ? "child" : "current";
			const metadata = input.metadata ?? {};
			const label = normalizeOptionalString(metadata.label);
			const threadName = typeof metadata.threadName === "string" ? normalizeOptionalString(metadata.threadName) : void 0;
			const introText = typeof metadata.introText === "string" ? normalizeOptionalString(metadata.introText) : void 0;
			const boundBy = typeof metadata.boundBy === "string" ? normalizeOptionalString(metadata.boundBy) : void 0;
			const agentId = typeof metadata.agentId === "string" ? normalizeOptionalString(metadata.agentId) : void 0;
			let threadId;
			let channelId;
			let createThread = false;
			if (placement === "child") {
				createThread = true;
				channelId = normalizeChildBindingParentChannelId(input.conversation.parentConversationId);
				if (!channelId && conversationId) channelId = await resolveChannelIdForBinding({
					cfg: params.resolveCurrentCfg(),
					accountId: params.accountId,
					token: params.resolveCurrentToken(),
					threadId: conversationId
				}) ?? void 0;
			} else threadId = conversationId || void 0;
			const bound = await params.manager.bindTarget({
				threadId,
				channelId,
				createThread,
				threadName,
				targetKind: toThreadBindingTargetKind(input.targetKind),
				targetSessionKey,
				agentId,
				label,
				boundBy,
				introText,
				metadata
			});
			return bound ? serializeBinding(bound) : null;
		},
		listBySession: (targetSessionKey) => params.manager.listBySessionKey(targetSessionKey).map(serializeBinding),
		resolveByConversation: (ref) => {
			if (ref.channel !== "discord") return null;
			const binding = params.manager.getByThreadId(ref.conversationId);
			return binding ? serializeBinding(binding) : null;
		},
		touch: (bindingId, at) => {
			const threadId = resolveThreadBindingConversationIdFromBindingId({
				accountId: params.accountId,
				bindingId
			});
			if (!threadId) return;
			params.manager.touchThread({
				threadId,
				at,
				persist: true
			});
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return params.manager.unbindBySessionKey({
				targetSessionKey: input.targetSessionKey,
				reason: input.reason
			}).map(serializeBinding);
			const threadId = resolveThreadBindingConversationIdFromBindingId({
				accountId: params.accountId,
				bindingId: input.bindingId
			});
			if (!threadId) return [];
			const removed = params.manager.unbindThread({
				threadId,
				reason: input.reason
			});
			return removed ? [serializeBinding(removed)] : [];
		}
	};
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.manager.ts
function registerManager(manager) {
	MANAGERS_BY_ACCOUNT_ID.set(manager.accountId, manager);
}
function unregisterManager(accountId, manager) {
	if (MANAGERS_BY_ACCOUNT_ID.get(accountId) === manager) MANAGERS_BY_ACCOUNT_ID.delete(accountId);
}
function createNoopManager(accountIdRaw) {
	return {
		accountId: normalizeAccountId(accountIdRaw),
		getIdleTimeoutMs: () => DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS,
		getMaxAgeMs: () => 0,
		getByThreadId: () => void 0,
		getBySessionKey: () => void 0,
		listBySessionKey: () => [],
		listBindings: () => [],
		touchThread: () => null,
		bindTarget: async () => null,
		unbindThread: () => null,
		unbindBySessionKey: () => [],
		stop: () => {}
	};
}
function isDirectConversationBindingId(value) {
	const trimmed = normalizeOptionalString(value);
	return Boolean(trimmed && /^(user:|channel:)/i.test(trimmed));
}
function createThreadBindingManager(params) {
	ensureBindingsLoaded();
	const accountId = normalizeAccountId(params.accountId);
	const existing = MANAGERS_BY_ACCOUNT_ID.get(accountId);
	if (existing) {
		rememberThreadBindingToken({
			accountId,
			token: params.token
		});
		return existing;
	}
	rememberThreadBindingToken({
		accountId,
		token: params.token
	});
	const persist = params.persist ?? shouldDefaultPersist();
	PERSIST_BY_ACCOUNT_ID.set(accountId, persist);
	const idleTimeoutMs = normalizeThreadBindingDurationMs(params.idleTimeoutMs, DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS);
	const maxAgeMs = normalizeThreadBindingDurationMs(params.maxAgeMs, 0);
	const resolveCurrentCfg = () => getRuntimeConfigSnapshot() ?? params.cfg;
	const resolveCurrentToken = () => getThreadBindingToken(accountId) ?? params.token;
	let sweepTimer = null;
	const runSweepOnce = async () => {
		const bindings = manager.listBindings();
		if (bindings.length === 0) return;
		let rest = null;
		for (const snapshotBinding of bindings) {
			const binding = manager.getByThreadId(snapshotBinding.threadId);
			if (!binding) continue;
			const now = Date.now();
			const inactivityExpiresAt = resolveThreadBindingInactivityExpiresAt({
				record: binding,
				defaultIdleTimeoutMs: idleTimeoutMs
			});
			const maxAgeExpiresAt = resolveThreadBindingMaxAgeExpiresAt({
				record: binding,
				defaultMaxAgeMs: maxAgeMs
			});
			const expirationCandidates = [];
			if (inactivityExpiresAt != null && now >= inactivityExpiresAt) expirationCandidates.push({
				reason: "idle-expired",
				at: inactivityExpiresAt
			});
			if (maxAgeExpiresAt != null && now >= maxAgeExpiresAt) expirationCandidates.push({
				reason: "max-age-expired",
				at: maxAgeExpiresAt
			});
			if (expirationCandidates.length > 0) {
				expirationCandidates.sort((a, b) => a.at - b.at);
				const reason = expirationCandidates[0]?.reason ?? "idle-expired";
				manager.unbindThread({
					threadId: binding.threadId,
					reason,
					sendFarewell: true,
					farewellText: resolveThreadBindingFarewellText({
						reason,
						idleTimeoutMs: resolveThreadBindingIdleTimeoutMs({
							record: binding,
							defaultIdleTimeoutMs: idleTimeoutMs
						}),
						maxAgeMs: resolveThreadBindingMaxAgeMs({
							record: binding,
							defaultMaxAgeMs: maxAgeMs
						})
					})
				});
				continue;
			}
			if (isDirectConversationBindingId(binding.threadId)) continue;
			if (!rest) try {
				rest = createDiscordRestClient({
					cfg: resolveCurrentCfg(),
					accountId,
					token: resolveCurrentToken()
				}).rest;
			} catch {
				return;
			}
			try {
				const channel = await getChannel(rest, binding.threadId);
				if (!channel || typeof channel !== "object") {
					logVerbose(`discord thread binding sweep probe returned invalid payload for ${binding.threadId}`);
					continue;
				}
				if (isThreadArchived(channel)) manager.unbindThread({
					threadId: binding.threadId,
					reason: "thread-archived",
					sendFarewell: true
				});
			} catch (err) {
				if (isDiscordThreadGoneError(err)) {
					logVerbose(`discord thread binding sweep removing stale binding ${binding.threadId}: ${summarizeDiscordError(err)}`);
					manager.unbindThread({
						threadId: binding.threadId,
						reason: "thread-delete",
						sendFarewell: false
					});
					continue;
				}
				logVerbose(`discord thread binding sweep probe failed for ${binding.threadId}: ${summarizeDiscordError(err)}`);
			}
		}
	};
	const manager = {
		accountId,
		getIdleTimeoutMs: () => idleTimeoutMs,
		getMaxAgeMs: () => maxAgeMs,
		getByThreadId: (threadId) => {
			const key = resolveBindingRecordKey({
				accountId,
				threadId
			});
			if (!key) return;
			const entry = BINDINGS_BY_THREAD_ID.get(key);
			if (!entry || entry.accountId !== accountId) return;
			return entry;
		},
		getBySessionKey: (targetSessionKey) => {
			return manager.listBySessionKey(targetSessionKey)[0];
		},
		listBySessionKey: (targetSessionKey) => {
			return resolveBindingIdsForSession({
				targetSessionKey,
				accountId
			}).map((bindingKey) => BINDINGS_BY_THREAD_ID.get(bindingKey)).filter((entry) => Boolean(entry));
		},
		listBindings: () => [...BINDINGS_BY_THREAD_ID.values()].filter((entry) => entry.accountId === accountId),
		touchThread: (touchParams) => {
			const key = resolveBindingRecordKey({
				accountId,
				threadId: touchParams.threadId
			});
			if (!key) return null;
			const existingResult = BINDINGS_BY_THREAD_ID.get(key);
			if (!existingResult || existingResult.accountId !== accountId) return null;
			const now = Date.now();
			const at = typeof touchParams.at === "number" && Number.isFinite(touchParams.at) ? Math.max(0, Math.floor(touchParams.at)) : now;
			const nextRecord = {
				...existingResult,
				lastActivityAt: Math.max(existingResult.lastActivityAt || 0, at)
			};
			setBindingRecord(nextRecord);
			if (touchParams.persist ?? persist) saveBindingsToDisk({ minIntervalMs: THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS });
			return nextRecord;
		},
		bindTarget: async (bindParams) => {
			const cfg = resolveCurrentCfg();
			let threadId = normalizeThreadId(bindParams.threadId);
			let channelId = normalizeOptionalString(bindParams.channelId) ?? "";
			const directConversationBinding = isDirectConversationBindingId(threadId) || isDirectConversationBindingId(channelId);
			if (!threadId && bindParams.createThread) {
				if (!channelId) return null;
				const threadName = resolveThreadBindingThreadName({
					agentId: bindParams.agentId,
					label: bindParams.label
				});
				threadId = await createThreadForBinding({
					cfg,
					accountId,
					token: resolveCurrentToken(),
					channelId,
					threadName: normalizeOptionalString(bindParams.threadName) ?? threadName
				}) ?? void 0;
			}
			if (!threadId) return null;
			if (!channelId && directConversationBinding) channelId = threadId;
			if (!channelId) channelId = await resolveChannelIdForBinding({
				cfg,
				accountId,
				token: resolveCurrentToken(),
				threadId,
				channelId: bindParams.channelId
			}) ?? "";
			if (!channelId) return null;
			const existingValue = manager.getByThreadId(threadId);
			const targetSessionKey = normalizeOptionalString(bindParams.targetSessionKey) ?? "";
			if (!targetSessionKey) return null;
			const targetKind = normalizeTargetKind(bindParams.targetKind, targetSessionKey);
			let webhookId = normalizeOptionalString(bindParams.webhookId) ?? normalizeOptionalString(existingValue?.webhookId) ?? "";
			let webhookToken = normalizeOptionalString(bindParams.webhookToken) ?? normalizeOptionalString(existingValue?.webhookToken) ?? "";
			if (!directConversationBinding && (!webhookId || !webhookToken)) {
				const cachedWebhook = findReusableWebhook({
					accountId,
					channelId
				});
				webhookId = cachedWebhook.webhookId ?? "";
				webhookToken = cachedWebhook.webhookToken ?? "";
			}
			if (!directConversationBinding && (!webhookId || !webhookToken)) {
				const createdWebhook = await createWebhookForChannel({
					cfg,
					accountId,
					token: resolveCurrentToken(),
					channelId
				});
				webhookId = createdWebhook.webhookId ?? "";
				webhookToken = createdWebhook.webhookToken ?? "";
			}
			const now = Date.now();
			const record = {
				accountId,
				channelId,
				threadId,
				targetKind,
				targetSessionKey,
				agentId: normalizeOptionalString(bindParams.agentId) ?? normalizeOptionalString(existingValue?.agentId) ?? resolveSessionAgentId({
					config: cfg,
					sessionKey: targetSessionKey
				}),
				label: normalizeOptionalString(bindParams.label) ?? normalizeOptionalString(existingValue?.label),
				webhookId: webhookId || void 0,
				webhookToken: webhookToken || void 0,
				boundBy: normalizeOptionalString(bindParams.boundBy) ?? normalizeOptionalString(existingValue?.boundBy) ?? "system",
				boundAt: now,
				lastActivityAt: now,
				idleTimeoutMs: typeof existingValue?.idleTimeoutMs === "number" ? existingValue.idleTimeoutMs : idleTimeoutMs,
				maxAgeMs: typeof existingValue?.maxAgeMs === "number" ? existingValue.maxAgeMs : maxAgeMs,
				metadata: bindParams.metadata && typeof bindParams.metadata === "object" ? {
					...existingValue?.metadata,
					...bindParams.metadata
				} : existingValue?.metadata ? { ...existingValue.metadata } : void 0
			};
			setBindingRecord(record);
			if (persist) saveBindingsToDisk();
			const introText = bindParams.introText?.trim();
			if (introText && cfg) maybeSendBindingMessage({
				cfg,
				record,
				text: introText
			});
			return record;
		},
		unbindThread: (unbindParams) => {
			const bindingKey = resolveBindingRecordKey({
				accountId,
				threadId: unbindParams.threadId
			});
			if (!bindingKey) return null;
			const existingLocal = BINDINGS_BY_THREAD_ID.get(bindingKey);
			if (!existingLocal || existingLocal.accountId !== accountId) return null;
			const removed = removeBindingRecord(bindingKey);
			if (!removed) return null;
			refreshUnboundThreadWebhookIdentity(removed);
			if (persist) saveBindingsToDisk();
			if (unbindParams.sendFarewell !== false) {
				const cfg = resolveCurrentCfg();
				const farewell = resolveThreadBindingFarewellText({
					reason: unbindParams.reason,
					farewellText: unbindParams.farewellText,
					idleTimeoutMs: resolveThreadBindingIdleTimeoutMs({
						record: removed,
						defaultIdleTimeoutMs: idleTimeoutMs
					}),
					maxAgeMs: resolveThreadBindingMaxAgeMs({
						record: removed,
						defaultMaxAgeMs: maxAgeMs
					})
				});
				if (cfg) maybeSendBindingMessage({
					cfg,
					record: removed,
					text: farewell,
					preferWebhook: false
				});
			}
			return removed;
		},
		unbindBySessionKey: (unbindParams) => {
			const ids = resolveBindingIdsForSession({
				targetSessionKey: unbindParams.targetSessionKey,
				accountId,
				targetKind: unbindParams.targetKind
			});
			if (ids.length === 0) return [];
			const removed = [];
			for (const bindingKey of ids) {
				const binding = BINDINGS_BY_THREAD_ID.get(bindingKey);
				if (!binding) continue;
				const entry = manager.unbindThread({
					threadId: binding.threadId,
					reason: unbindParams.reason,
					sendFarewell: unbindParams.sendFarewell,
					farewellText: unbindParams.farewellText
				});
				if (entry) removed.push(entry);
			}
			return removed;
		},
		stop: () => {
			if (sweepTimer) {
				clearInterval(sweepTimer);
				sweepTimer = null;
			}
			unregisterManager(accountId, manager);
			unregisterSessionBindingAdapter({
				channel: "discord",
				accountId,
				adapter: sessionBindingAdapter
			});
			forgetThreadBindingToken(accountId);
		}
	};
	if (params.enableSweeper !== false) {
		sweepTimer = setInterval(() => {
			runSweepOnce();
		}, THREAD_BINDINGS_SWEEP_INTERVAL_MS);
		if (!(process.env.VITEST || false)) sweepTimer.unref?.();
	}
	const sessionBindingAdapter = createThreadBindingSessionAdapter({
		accountId,
		manager,
		defaults: {
			idleTimeoutMs,
			maxAgeMs
		},
		resolveCurrentCfg,
		resolveCurrentToken
	});
	registerSessionBindingAdapter(sessionBindingAdapter);
	registerManager(manager);
	return manager;
}
function createNoopThreadBindingManager(accountId) {
	return createNoopManager(accountId);
}
function getThreadBindingManager(accountId) {
	const normalized = normalizeAccountId(accountId);
	return MANAGERS_BY_ACCOUNT_ID.get(normalized) ?? null;
}
//#endregion
export { resolveChannelIdForBinding as a, isThreadArchived as i, createThreadBindingManager as n, resolveThreadBindingPersona as o, getThreadBindingManager as r, resolveThreadBindingPersonaFromRecord as s, createNoopThreadBindingManager as t };
