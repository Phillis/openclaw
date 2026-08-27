import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { S as parseStrictInteger, s as asFiniteNumber, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { a as formatUncaughtError, r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { l as readConfigFileSnapshotForWrite } from "./io-DlN5njvP.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-Doha8xVC.js";
import { d as resolveCronStorePath, m as saveCronStore, o as loadCronStore } from "./store-pLPqGtqL.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { l as kindFromMime, r as extensionForMime, s as isGifMedia } from "./mime-Hm4eS2i0.js";
import "./channel-outbound-0oFCMpw9.js";
import { c as getImageMetadata } from "./image-ops-CNJmjS8j.js";
import { r as probeVideoDimensions } from "./media-services-B8MVUzbz.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import { E as normalizeOutboundLocation, T as formatLocationText } from "./reply-payload-i0RzN2iF.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-cLEWJ7Kr.js";
import { n as loadWebMedia } from "./web-media-DSbBQ0o1.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { m as resolveStorePath } from "./session-store-runtime-BNwfvw44.js";
import { n as firstDefined } from "./allow-from-D4kg2zcb.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-_fxsAvI_.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import { r as makeProxyFetch } from "./proxy-fetch-CIh_-v0I.js";
import "./error-runtime-CmA1H4Zg.js";
import "./runtime-env-_YEv0JPQ.js";
import { S as tagTelegramNetworkError, a as TelegramRequestNotStartedError, b as rethrowTelegramSendError, c as isSafeToRetrySendError, h as isTelegramMisdirectedRequestError, o as isRecoverableTelegramNetworkError, r as resolveTelegramTransport, u as isTelegramBadRequestError, v as isTelegramServerError, w as normalizeTelegramApiRoot, x as shouldRetryTelegramSendError } from "./fetch-C5ACq5TR.js";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.js";
import { t as responseWithRelease } from "./fetch-runtime-Cwc39ud2.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-ClSo0q_q.js";
import "./retry-runtime-D94jIZiS.js";
import { r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-CKECj_57.js";
import "./routing-DM8631ts.js";
import { i as isChannelPartialDeliveryError, n as createChannelPartialDeliveryError } from "./delivery-result-BB-vQ7ul.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-D_24uQPz.js";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.js";
import { n as isVoiceMessageCompatibleAudio } from "./audio-Dm6sjmv5.js";
import "./runtime-doctor-migrations-BXpzR2WJ.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-C2UoeqsI.js";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "./runtime-group-policy-GURwo_0L.js";
import "./config-mutation-B2LY0k5j.js";
import "./cron-store-runtime-DSguYypk.js";
import "./reply-reference-CTh6ydO0.js";
import "./reply-chunking-BXCYNOLj.js";
import "./channel-inbound-BllqRtTK.js";
import "./web-media-Cxkh7M6r.js";
import "./runtime-group-policy-BLXPwMdH.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./media-runtime-qcekT37I.js";
import "./media-mime-DQ4Ibr5o.js";
import "./logging-core-BaUBu9tm.js";
import "./markdown-table-runtime-D3JrYpcZ.js";
import "./diagnostic-runtime-rMWwqmy-.js";
import { a as DEFAULT_EMOJIS } from "./channel-feedback-CJM4EQH2.js";
import { t as createChannelHistoryWindow } from "./reply-history-ydRF4RaB.js";
import { r as isSenderAllowed } from "./access-groups-D9ipmCdc.js";
import { o as resolveTelegramAccount } from "./accounts-3yDZGxKI.js";
import { a as normalizeTelegramLookupTarget, i as normalizeTelegramChatId, s as parseTelegramTarget } from "./topic-conversation-Cl4csGES.js";
import { n as parseTelegramMessageThreadId, t as normalizeTelegramReplyToMessageId } from "./outbound-params-BUIfhgvx.js";
import { n as getTelegramRuntime, t as getOptionalTelegramRuntime } from "./runtime-D4cq5Nic.js";
import { n as resolveTelegramBotUserIdFromToken } from "./token-fingerprint-z983D2R-.js";
import { D as buildSenderName, F as normalizeForwardedContext, H as escapeTelegramHtml, I as resolveTelegramPrimaryMedia, J as splitTelegramHtmlChunks, K as renderTelegramHtmlText, L as resolveTelegramRichMessageBody, O as extractTelegramLocation, U as markdownToTelegramChunks, W as markdownToTelegramHtml, X as wrapFileReferencesInHtml, Y as telegramHtmlToPlainTextFallback, b as resolveTelegramMessageThreadSpec, c as buildTelegramThreadParams, k as getTelegramTextParts, l as buildTypingThreadParams } from "./helpers-nPengbaU.js";
import { B as resolveTelegramScopedGroupConfig, I as telegramMessagingTargetsMatch, M as splitTelegramCaption, N as telegramCaptionDeliveryMetadata, _ as withTelegramPlainFallback, c as removeTelegramRichNativeQuoteParam, f as splitTelegramRichBlocks, g as warnTelegramRichBlocksDegradations, h as splitTelegramPlainTextChunks, i as buildTelegramRichBlocksPlan, j as resolveTelegramPlainCaption, k as buildInlineKeyboard, l as splitTelegramRichMessageTextChunks, m as isTelegramHtmlParseError, n as resolveTelegramTextChunkLimit, o as buildTelegramRichMarkdownPlan, p as isTelegramEmptyContentError, s as getTelegramRichRawApi, u as toTelegramRichMessageContextParams, w as parseTelegramPromptContextProjection } from "./text-chunk-limit-BGlmry9l.js";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-CfbMzFBO.js";
import { a as resolveSentMessageScopeKey, c as TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE, f as resolveTelegramMessageCachePersistentScopeKey, l as isTelegramMessageCacheSourceMessage, n as TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE, o as sentMessageEntryKey, p as resolveTelegramMessageCacheScope, r as TTL_MS, s as TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES, t as TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES, u as parseTelegramResolvedMedia } from "./sent-message-cache.legacy-state-C4DKtnhZ.js";
import { t as withTelegramApiErrorLogging } from "./api-logging-KkPWCBmJ.js";
import { Bot, Bot as Bot$1, GrammyError, HttpError, InputFile } from "grammy";
import { sequentialize } from "@grammyjs/runner";
import { apiThrottler } from "@grammyjs/transformer-throttler";
//#region extensions/telegram/src/group-access.ts
function isGroupAllowOverrideAuthorized(params) {
	if (!params.effectiveGroupAllow.hasEntries) return false;
	const senderId = params.senderId ?? "";
	if (params.requireSenderForAllowOverride && !senderId) return false;
	return isSenderAllowed({
		allow: params.effectiveGroupAllow,
		senderId,
		senderUsername: params.senderUsername ?? ""
	});
}
const evaluateTelegramGroupBaseAccess = (params) => {
	if (params.groupConfig?.enabled === false) return {
		allowed: false,
		reason: "group-disabled"
	};
	if (params.topicConfig?.enabled === false) return {
		allowed: false,
		reason: "topic-disabled"
	};
	if (!params.isGroup) {
		if (params.enforceAllowOverride && params.hasGroupAllowOverride) {
			if (!isGroupAllowOverrideAuthorized({
				effectiveGroupAllow: params.effectiveGroupAllow,
				senderId: params.senderId,
				senderUsername: params.senderUsername,
				requireSenderForAllowOverride: params.requireSenderForAllowOverride
			})) return {
				allowed: false,
				reason: "group-override-unauthorized"
			};
		}
		return { allowed: true };
	}
	if (!params.enforceAllowOverride || !params.hasGroupAllowOverride) return { allowed: true };
	if (!isGroupAllowOverrideAuthorized({
		effectiveGroupAllow: params.effectiveGroupAllow,
		senderId: params.senderId,
		senderUsername: params.senderUsername,
		requireSenderForAllowOverride: params.requireSenderForAllowOverride
	})) return {
		allowed: false,
		reason: "group-override-unauthorized"
	};
	return { allowed: true };
};
const resolveTelegramRuntimeGroupPolicy = (params) => resolveOpenProviderRuntimeGroupPolicy({
	providerConfigPresent: params.providerConfigPresent,
	groupPolicy: params.groupPolicy,
	defaultGroupPolicy: params.defaultGroupPolicy
});
const resolveTelegramEffectiveGroupPolicy = (params) => {
	const { groupPolicy: runtimeFallbackPolicy } = resolveTelegramRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.telegram !== void 0,
		groupPolicy: params.telegramCfg.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	return firstDefined(params.topicConfig?.groupPolicy, params.groupConfig?.groupPolicy, params.telegramCfg.groupPolicy, params.cfg.channels?.defaults?.groupPolicy) ?? runtimeFallbackPolicy;
};
const evaluateTelegramGroupPolicyAccess = (params) => {
	const groupPolicy = resolveTelegramEffectiveGroupPolicy(params);
	if (!params.isGroup || !params.enforcePolicy) return {
		allowed: true,
		groupPolicy
	};
	if (groupPolicy === "disabled") return {
		allowed: false,
		reason: "group-policy-disabled",
		groupPolicy
	};
	let chatExplicitlyAllowed = false;
	if (params.checkChatAllowlist) {
		const groupAllowlist = params.resolveGroupPolicy(params.chatId, params.cfg);
		if (groupAllowlist.allowlistEnabled && !groupAllowlist.allowed) return {
			allowed: false,
			reason: "group-chat-not-allowed",
			groupPolicy
		};
		if (groupAllowlist.allowlistEnabled && groupAllowlist.allowed && groupAllowlist.groupConfig) chatExplicitlyAllowed = true;
	}
	if (groupPolicy === "allowlist" && params.enforceAllowlistAuthorization) {
		const senderId = params.senderId ?? "";
		const allowlistConfigured = chatExplicitlyAllowed || params.allowEmptyAllowlistEntries || params.effectiveGroupAllow.hasEntries;
		const allowlistMatched = chatExplicitlyAllowed && !params.effectiveGroupAllow.hasEntries || isSenderAllowed({
			allow: params.effectiveGroupAllow,
			senderId,
			senderUsername: params.senderUsername ?? ""
		});
		if (params.requireSenderForAllowlistAuthorization && !senderId) return {
			allowed: false,
			reason: "group-policy-allowlist-no-sender",
			groupPolicy
		};
		if (!allowlistConfigured) return {
			allowed: false,
			reason: "group-policy-allowlist-empty",
			groupPolicy
		};
		if (!allowlistMatched) return {
			allowed: false,
			reason: "group-policy-allowlist-unauthorized",
			groupPolicy
		};
	}
	return {
		allowed: true,
		groupPolicy
	};
};
//#endregion
//#region extensions/telegram/src/account-throttler.ts
var GroupFairQueue = class {
	constructor() {
		this.lanes = /* @__PURE__ */ new Map();
		this.laneOrder = [];
		this.nextLaneIndex = 0;
		this.running = false;
	}
	enqueue(laneKey, run) {
		return new Promise((resolve, reject) => {
			const request = {
				run,
				resolve,
				reject
			};
			const existing = this.lanes.get(laneKey);
			if (existing) existing.push(request);
			else {
				this.lanes.set(laneKey, [request]);
				this.laneOrder.push(laneKey);
			}
			this.start();
		});
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.drain();
	}
	async drain() {
		try {
			while (true) {
				const request = this.takeNext();
				if (!request) return;
				try {
					request.resolve(await request.run());
				} catch (err) {
					request.reject(err);
				}
			}
		} finally {
			this.running = false;
			if (this.laneOrder.length > 0) this.start();
		}
	}
	takeNext() {
		for (let remaining = this.laneOrder.length; remaining > 0; remaining -= 1) {
			this.nextLaneIndex %= this.laneOrder.length;
			const laneKey = expectDefined(this.laneOrder[this.nextLaneIndex], "non-empty Telegram throttle lane order");
			const queue = this.lanes.get(laneKey);
			if (!queue || queue.length === 0) {
				this.lanes.delete(laneKey);
				this.laneOrder.splice(this.nextLaneIndex, 1);
				if (this.laneOrder.length === 0) {
					this.nextLaneIndex = 0;
					return;
				}
				continue;
			}
			const request = queue.shift();
			this.nextLaneIndex += 1;
			return request;
		}
	}
};
const TELEGRAM_ACCOUNT_THROTTLERS_KEY = Symbol.for("openclaw.telegram.accountThrottlers");
function getAccountThrottlers() {
	const globalRecord = globalThis;
	const existing = globalRecord[TELEGRAM_ACCOUNT_THROTTLERS_KEY];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	globalRecord[TELEGRAM_ACCOUNT_THROTTLERS_KEY] = created;
	return created;
}
function readNumericId(value) {
	return parseStrictInteger(value);
}
function readPayload(payload) {
	return payload && typeof payload === "object" ? payload : void 0;
}
function resolveGroupChatKey(payload) {
	const chatId = readNumericId(payload.chat_id);
	return chatId !== void 0 && chatId < 0 ? String(chatId) : void 0;
}
function resolveForumLaneKey(payload) {
	const threadId = readNumericId(payload.message_thread_id);
	if (threadId !== void 0) return `topic:${threadId}`;
	const directTopicId = readNumericId(payload.direct_messages_topic_id);
	if (directTopicId !== void 0) return `direct-topic:${directTopicId}`;
	const messageId = readNumericId(payload.message_id);
	if (messageId !== void 0) return `message:${messageId}`;
	return "main";
}
function createTelegramAccountThrottler(createThrottler = apiThrottler) {
	const baseThrottler = createThrottler();
	const fairQueuesByChat = /* @__PURE__ */ new Map();
	return (prev, method, payload, signal) => {
		const apiPayload = readPayload(payload);
		const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
		if (!apiPayload || !groupChatKey) return baseThrottler(prev, method, payload, signal);
		let fairQueue = fairQueuesByChat.get(groupChatKey);
		if (!fairQueue) {
			fairQueue = new GroupFairQueue();
			fairQueuesByChat.set(groupChatKey, fairQueue);
		}
		const laneKey = resolveForumLaneKey(apiPayload);
		return fairQueue.enqueue(laneKey, () => baseThrottler(prev, method, payload, signal));
	};
}
function getOrCreateAccountThrottler(token, createThrottler = apiThrottler) {
	const throttlerByToken = getAccountThrottlers();
	let throttler = throttlerByToken.get(token);
	if (!throttler) {
		throttler = createTelegramAccountThrottler(createThrottler);
		throttlerByToken.set(token, throttler);
	}
	return throttler;
}
//#endregion
//#region extensions/telegram/src/client-fetch.ts
function asTelegramClientFetch(fetchImpl) {
	return fetchImpl;
}
function asTelegramCompatFetch(fetchImpl) {
	return fetchImpl;
}
function isTelegramAbortSignalLike(value) {
	return typeof value === "object" && value !== null && "aborted" in value && typeof value.aborted === "boolean" && typeof value.addEventListener === "function" && typeof value.removeEventListener === "function";
}
function readRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (input instanceof Request) return input.url;
	return null;
}
function extractTelegramApiMethod(input) {
	const url = readRequestUrl(input);
	if (!url) return null;
	try {
		const segments = new URL(url).pathname.split("/").filter(Boolean);
		return normalizeOptionalLowercaseString(segments.length > 0 ? segments.at(-1) ?? null : null) ?? null;
	} catch {
		return null;
	}
}
const TELEGRAM_TIMEOUT_FALLBACK_METHODS = /* @__PURE__ */ new Set([
	"deletemycommands",
	"deletewebhook",
	"getme",
	"sendchataction",
	"setmycommands",
	"setwebhook"
]);
function shouldRetryTimedOutTelegramControlRequest(method) {
	return method !== null && TELEGRAM_TIMEOUT_FALLBACK_METHODS.has(method);
}
function resolveTelegramClientTimeoutSeconds(params) {
	const { value, minimum } = params;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const configured = Math.max(1, Math.floor(value));
	if (typeof minimum !== "number" || !Number.isFinite(minimum)) return configured;
	return Math.max(configured, Math.max(1, Math.floor(minimum)));
}
function resolveTelegramClientTimeoutMinimumSeconds(values) {
	let minimum;
	for (const value of values) {
		if (typeof value !== "number" || !Number.isFinite(value)) continue;
		const normalized = Math.max(1, Math.ceil(value));
		minimum = minimum === void 0 ? normalized : Math.max(minimum, normalized);
	}
	return minimum;
}
function resolveTelegramOutboundClientTimeoutFloorSeconds(timeoutSeconds) {
	const timeoutMs = resolveTelegramRequestTimeoutMs("sendmessage", timeoutSeconds);
	return timeoutMs === void 0 ? void 0 : timeoutMs / 1e3;
}
function createTelegramClientFetch(params) {
	if (!params.fetchImpl && !params.shutdownSignal) return;
	const callFetch = asTelegramCompatFetch(params.fetchImpl ?? asTelegramClientFetch(globalThis.fetch));
	const wrappedFetch = async (input, init) => {
		const method = extractTelegramApiMethod(input);
		const requestTimeoutMs = resolveTelegramRequestTimeoutMs(method, params.timeoutSeconds);
		const shutdownSignal = isTelegramAbortSignalLike(params.shutdownSignal) ? params.shutdownSignal : void 0;
		const requestSignal = isTelegramAbortSignalLike(init?.signal) ? init.signal : void 0;
		const canForceTransportFallback = (reason) => !shutdownSignal?.aborted && !requestSignal?.aborted && params.transport?.forceFallback?.(reason) === true;
		const runFetch = async (allowMisdirectedFallback = false) => {
			const controller = new AbortController();
			const abortWith = (signal) => controller.abort(signal.reason);
			const onShutdown = () => {
				if (shutdownSignal) abortWith(shutdownSignal);
			};
			let requestTimeout;
			let onRequestAbort;
			let requestTimedOut = false;
			const timeoutError = requestTimeoutMs !== void 0 ? /* @__PURE__ */ new Error(`Telegram ${method} timed out after ${requestTimeoutMs}ms`) : void 0;
			if (shutdownSignal?.aborted) abortWith(shutdownSignal);
			else if (shutdownSignal) shutdownSignal.addEventListener("abort", onShutdown, { once: true });
			if (requestSignal) if (requestSignal.aborted) abortWith(requestSignal);
			else {
				onRequestAbort = () => abortWith(requestSignal);
				requestSignal.addEventListener("abort", onRequestAbort);
			}
			if (requestTimeoutMs && timeoutError) {
				requestTimeout = setTimeout(() => {
					requestTimedOut = true;
					controller.abort(timeoutError);
				}, requestTimeoutMs);
				requestTimeout.unref?.();
			}
			const releaseRequest = async () => {
				if (requestTimeout) clearTimeout(requestTimeout);
				shutdownSignal?.removeEventListener("abort", onShutdown);
				if (requestSignal && onRequestAbort) requestSignal.removeEventListener("abort", onRequestAbort);
			};
			try {
				const response = await callFetch(input, {
					...init,
					signal: controller.signal
				});
				if (response.status === 421) {
					const retry = allowMisdirectedFallback && canForceTransportFallback("misdirected-request");
					await response.body?.cancel().catch(() => void 0);
					if (retry) {
						await releaseRequest();
						return runFetch();
					}
					throw new TelegramRequestNotStartedError();
				}
				return responseWithRelease(response, releaseRequest);
			} catch (err) {
				await releaseRequest();
				if (requestTimedOut && timeoutError) throw timeoutError;
				throw err;
			}
		};
		try {
			return await runFetch(true);
		} catch (err) {
			if (requestTimeoutMs && shouldRetryTimedOutTelegramControlRequest(method) && canForceTransportFallback("request-timeout")) return await runFetch();
			if (isTelegramMisdirectedRequestError(err) && canForceTransportFallback("misdirected-request")) return await runFetch();
			throw err;
		}
	};
	return (input, init) => {
		return Promise.resolve(wrappedFetch(input, init)).catch((err) => {
			try {
				tagTelegramNetworkError(err, {
					method: extractTelegramApiMethod(input),
					url: readRequestUrl(input)
				});
			} catch {}
			throw err;
		});
	};
}
//#endregion
//#region extensions/telegram/src/reply-parameters.ts
const QUOTE_PARAM_RE = /\bquote not found\b|\bQUOTE_TEXT_INVALID\b|\bquote text invalid\b/i;
const GrammyErrorCtor = typeof GrammyError === "function" ? GrammyError : void 0;
function resolveTelegramSendThreadSpec(params) {
	if (params.targetDirectMessagesTopicId != null) return {
		id: params.targetDirectMessagesTopicId,
		scope: "direct-messages"
	};
	const messageThreadId = params.messageThreadId != null ? params.messageThreadId : params.targetMessageThreadId;
	if (messageThreadId == null) return;
	return {
		id: messageThreadId,
		scope: params.chatType === "direct" ? "dm" : "forum"
	};
}
function buildTelegramThreadReplyParams(opts) {
	const params = { ...buildTelegramThreadParams(opts?.thread) };
	const replyToMessageId = normalizeTelegramReplyToMessageId(opts?.replyToMessageId);
	if (replyToMessageId == null) return params;
	const defaultQuoteMessageId = opts?.useReplyIdAsQuoteSource === true ? replyToMessageId : void 0;
	const replyQuoteTextRaw = normalizeTelegramReplyToMessageId(opts?.replyQuoteMessageId ?? defaultQuoteMessageId) === replyToMessageId ? opts?.replyQuoteText : void 0;
	const replyQuoteText = replyQuoteTextRaw?.trim() ? replyQuoteTextRaw : void 0;
	if (!replyQuoteText) {
		params.reply_to_message_id = replyToMessageId;
		params.allow_sending_without_reply = true;
		return params;
	}
	const replyParameters = {
		message_id: replyToMessageId,
		quote: replyQuoteText,
		allow_sending_without_reply: true
	};
	if (typeof opts?.replyQuotePosition === "number" && Number.isFinite(opts.replyQuotePosition)) replyParameters.quote_position = Math.trunc(opts.replyQuotePosition);
	if (Array.isArray(opts?.replyQuoteEntities) && opts.replyQuoteEntities.length > 0) replyParameters.quote_entities = opts.replyQuoteEntities;
	params.reply_parameters = replyParameters;
	return params;
}
function buildTelegramSendParams(opts) {
	const params = { ...buildTelegramThreadReplyParams(opts) };
	if (opts?.silent === true) params.disable_notification = true;
	return params;
}
function getTelegramNativeQuoteReplyMessageId(params) {
	const replyParameters = params?.reply_parameters;
	if (!replyParameters || typeof replyParameters !== "object") return;
	const messageId = replyParameters.message_id;
	return asFiniteNumber(messageId);
}
function isTelegramQuoteParamError(err) {
	if (GrammyErrorCtor && err instanceof GrammyErrorCtor) return QUOTE_PARAM_RE.test(err.description);
	return QUOTE_PARAM_RE.test(formatErrorMessage(err));
}
function removeTelegramNativeQuoteParam(params) {
	if (!params) return {};
	const replyMessageId = getTelegramNativeQuoteReplyMessageId(params);
	const { reply_parameters: _ignored, ...rest } = params;
	if (replyMessageId != null) {
		rest.reply_to_message_id = replyMessageId;
		rest.allow_sending_without_reply = true;
	}
	return rest;
}
//#endregion
//#region extensions/telegram/src/retry-after.ts
const TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS = 6e4;
//#endregion
//#region extensions/telegram/src/target-writeback.ts
const writebackLogger = createSubsystemLogger("telegram/target-writeback");
const TELEGRAM_ADMIN_SCOPE = "operator.admin";
function buildResolvedTelegramTarget(params) {
	const { raw, parsed, resolvedChatId } = params;
	if (parsed.directMessagesTopicId != null) return `${resolvedChatId}:direct-topic:${parsed.directMessagesTopicId}`;
	if (parsed.messageThreadId == null) return resolvedChatId;
	return raw.includes(":topic:") ? `${resolvedChatId}:topic:${parsed.messageThreadId}` : `${resolvedChatId}:${parsed.messageThreadId}`;
}
function resolveLegacyRewrite(params) {
	const parsed = parseTelegramTarget(params.raw);
	if (normalizeTelegramChatId(parsed.chatId) || !normalizeTelegramLookupTarget(parsed.chatId)) return null;
	return {
		sourceTarget: params.raw,
		resolvedTarget: buildResolvedTelegramTarget({
			raw: params.raw,
			parsed,
			resolvedChatId: params.resolvedChatId
		})
	};
}
function rewriteTargetIfMatch(params) {
	if (typeof params.rawValue !== "string" && typeof params.rawValue !== "number") return null;
	const value = normalizeOptionalString(String(params.rawValue)) ?? "";
	if (!value) return null;
	if (!telegramMessagingTargetsMatch(value, params.sourceTarget)) return null;
	return params.resolvedTarget;
}
function replaceTelegramDefaultToTargets(params) {
	let changed = false;
	const telegram = asNullableRecord(params.cfg.channels?.telegram);
	if (!telegram) return changed;
	const maybeReplace = (holder, key) => {
		const nextTarget = rewriteTargetIfMatch({
			rawValue: holder[key],
			sourceTarget: params.sourceTarget,
			resolvedTarget: params.resolvedTarget
		});
		if (!nextTarget) return;
		holder[key] = nextTarget;
		changed = true;
	};
	maybeReplace(telegram, "defaultTo");
	const accounts = asNullableRecord(telegram.accounts);
	if (!accounts) return changed;
	for (const accountId of Object.keys(accounts)) {
		const account = asNullableRecord(accounts[accountId]);
		if (!account) continue;
		maybeReplace(account, "defaultTo");
	}
	return changed;
}
async function maybePersistResolvedTelegramTarget(params) {
	const raw = params.rawTarget.trim();
	if (!raw) return;
	const rewrite = resolveLegacyRewrite({
		raw,
		resolvedChatId: params.resolvedChatId
	});
	if (!rewrite) return;
	const { sourceTarget, resolvedTarget } = rewrite;
	const hasGatewayAdminScope = params.gatewayClientScopes?.includes(TELEGRAM_ADMIN_SCOPE) === true;
	const trustedInternalWriteback = params.gatewayClientScopes === void 0 && params.trustedInternalWriteback === true;
	if (!hasGatewayAdminScope && !trustedInternalWriteback) {
		writebackLogger.warn(`skipping Telegram target writeback for ${raw} because gateway caller is missing ${TELEGRAM_ADMIN_SCOPE}`);
		return;
	}
	try {
		const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
		const nextConfig = structuredClone(snapshot.config ?? {});
		if (replaceTelegramDefaultToTargets({
			cfg: nextConfig,
			sourceTarget,
			resolvedTarget
		})) {
			await replaceConfigFile({
				nextConfig,
				snapshot,
				writeOptions,
				afterWrite: { mode: "auto" }
			});
			if (params.verbose) writebackLogger.warn(`resolved Telegram defaultTo target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram defaultTo target ${raw}: ${String(err)}`);
	}
	try {
		const storePath = resolveCronStorePath();
		const store = await loadCronStore(storePath);
		let cronChanged = false;
		for (const job of store.jobs) {
			if (job.delivery?.channel !== "telegram") continue;
			const nextTarget = rewriteTargetIfMatch({
				rawValue: job.delivery.to,
				sourceTarget,
				resolvedTarget
			});
			if (!nextTarget) continue;
			job.delivery.to = nextTarget;
			cronChanged = true;
		}
		if (cronChanged) {
			await saveCronStore(storePath, store);
			if (params.verbose) writebackLogger.warn(`resolved Telegram cron delivery target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram cron target ${raw}: ${String(err)}`);
	}
}
//#endregion
//#region extensions/telegram/src/send-context.ts
function resolveTelegramMessageIdOrThrow(result, context) {
	if (typeof result?.message_id === "number" && Number.isFinite(result.message_id)) return Math.trunc(result.message_id);
	throw new Error(`Telegram ${context} returned no message_id`);
}
function logTelegramOutboundSendOk(params) {
	const parts = [
		"telegram outbound send ok",
		`accountId=${params.accountId}`,
		`chatId=${params.chatId}`,
		`messageId=${params.messageId}`,
		`operation=${params.operation}`
	];
	if (params.deliveryKind) parts.push(`deliveryKind=${params.deliveryKind}`);
	if (typeof params.messageThreadId === "number") parts.push(`threadId=${params.messageThreadId}`);
	if (typeof params.replyToMessageId === "number") parts.push(`replyToMessageId=${params.replyToMessageId}`);
	if (params.silent === true) parts.push("silent=true");
	if (typeof params.chunkCount === "number") parts.push(`chunkCount=${params.chunkCount}`);
	sendLogger.info(parts.join(" "));
}
function resolveAcceptedReplyToMessageId(params) {
	if (!params) return;
	if ("reply_to_message_id" in params) return params.reply_to_message_id;
	return params.reply_parameters?.message_id;
}
function toAcceptedThreadScopedParams(params) {
	if (!params) return;
	const scoped = {};
	if (typeof params.message_thread_id === "number" && Number.isFinite(params.message_thread_id)) scoped.message_thread_id = params.message_thread_id;
	if (typeof params.reply_to_message_id === "number" && Number.isFinite(params.reply_to_message_id)) scoped.reply_to_message_id = params.reply_to_message_id;
	const replyParameters = params.reply_parameters;
	if (replyParameters && typeof replyParameters === "object") {
		const messageId = replyParameters.message_id;
		if (typeof messageId === "number" && Number.isFinite(messageId)) scoped.reply_parameters = { message_id: messageId };
	}
	return Object.keys(scoped).length > 0 ? scoped : void 0;
}
const MESSAGE_NOT_MODIFIED_RE = /400:\s*Bad Request:\s*message is not modified|MESSAGE_NOT_MODIFIED/i;
const MESSAGE_HAS_NO_TEXT_RE = /400:\s*Bad Request:\s*there is no text in the message to edit/i;
const MESSAGE_DELETE_NOOP_RE = /message to delete not found|message can't be deleted|MESSAGE_ID_INVALID|MESSAGE_DELETE_FORBIDDEN/i;
const CHAT_NOT_FOUND_RE = /400: Bad Request: chat not found/i;
const sendLogger = createSubsystemLogger("telegram/send");
const diagLogger = createSubsystemLogger("telegram/diagnostic");
const telegramClientOptionsCache = /* @__PURE__ */ new Map();
const MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE = 64;
function resetTelegramClientOptionsCacheForTests() {
	telegramClientOptionsCache.clear();
}
function createTelegramHttpLogger(cfg) {
	if (!isDiagnosticFlagEnabled("telegram.http", cfg)) return () => {};
	return (label, err) => {
		if (!(err instanceof HttpError)) return;
		const detail = redactSensitiveText(formatUncaughtError(err.error ?? err));
		diagLogger.warn(`telegram http error (${label}): ${detail}`);
	};
}
function shouldUseTelegramClientOptionsCache() {
	return !process.env.VITEST && true;
}
function buildTelegramClientOptionsCacheKey(params) {
	const proxyKey = params.account.config.proxy?.trim() ?? "";
	const autoSelectFamily = params.account.config.network?.autoSelectFamily;
	const autoSelectFamilyKey = typeof autoSelectFamily === "boolean" ? String(autoSelectFamily) : "default";
	const dnsResultOrderKey = params.account.config.network?.dnsResultOrder ?? "default";
	const apiRootKey = params.account.config.apiRoot?.trim() ?? "";
	const timeoutSecondsKey = typeof params.timeoutSeconds === "number" ? String(params.timeoutSeconds) : "default";
	return `${params.account.accountId}::${proxyKey}::${autoSelectFamilyKey}::${dnsResultOrderKey}::${apiRootKey}::${timeoutSecondsKey}`;
}
function closeCachedTelegramClientOptions(entry) {
	entry.retired = true;
	if (entry.activeLeases > 0 || entry.closeStarted) return;
	entry.closeStarted = true;
	entry.transport.close().catch((err) => {
		diagLogger.warn(`telegram client options cache transport close failed: ${redactSensitiveText(formatUncaughtError(err))}`);
	});
}
function leaseCachedTelegramClientOptions(entry) {
	entry.activeLeases += 1;
	let released = false;
	return { release: () => {
		if (released) return;
		released = true;
		entry.activeLeases = Math.max(0, entry.activeLeases - 1);
		if (entry.retired) closeCachedTelegramClientOptions(entry);
	} };
}
function setCachedTelegramClientOptions(cacheKey, entry) {
	telegramClientOptionsCache.set(cacheKey, entry);
	if (telegramClientOptionsCache.size > MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE) {
		const oldestKey = telegramClientOptionsCache.keys().next().value;
		if (oldestKey !== void 0) {
			const evictedEntry = telegramClientOptionsCache.get(oldestKey);
			telegramClientOptionsCache.delete(oldestKey);
			if (evictedEntry) closeCachedTelegramClientOptions(evictedEntry);
		}
	}
	return {
		clientOptions: entry.clientOptions,
		lease: () => leaseCachedTelegramClientOptions(entry)
	};
}
function resolveTelegramClientOptions(account) {
	const timeoutSeconds = void 0;
	const cacheKey = shouldUseTelegramClientOptionsCache() ? buildTelegramClientOptionsCacheKey({
		account,
		timeoutSeconds
	}) : null;
	if (cacheKey && telegramClientOptionsCache.has(cacheKey)) {
		const entry = telegramClientOptionsCache.get(cacheKey);
		if (entry) return {
			clientOptions: entry.clientOptions,
			lease: () => leaseCachedTelegramClientOptions(entry)
		};
	}
	const proxyUrl = normalizeOptionalString(account.config.proxy);
	const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
	const apiRoot = normalizeOptionalString(account.config.apiRoot);
	const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: account.config.network });
	const fetchImpl = createTelegramClientFetch({
		fetchImpl: asTelegramClientFetch(transport.fetch),
		timeoutSeconds,
		transport
	});
	const clientOptions = fetchImpl || normalizedApiRoot ? {
		...fetchImpl ? { fetch: asTelegramClientFetch(fetchImpl) } : {},
		...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
	} : void 0;
	if (cacheKey) return setCachedTelegramClientOptions(cacheKey, {
		activeLeases: 0,
		clientOptions,
		closeStarted: false,
		retired: false,
		transport
	});
	return { clientOptions };
}
function resolveToken(explicit, params) {
	if (explicit?.trim()) return explicit.trim();
	if (!params.token) throw new Error(`Telegram bot token missing for account "${params.accountId}" (set channels.telegram.accounts.${params.accountId}.botToken/tokenFile or TELEGRAM_BOT_TOKEN for default).`);
	return params.token.trim();
}
async function resolveChatId(to, params) {
	const numericChatId = normalizeTelegramChatId(to);
	if (numericChatId) return numericChatId;
	const lookupTarget = normalizeTelegramLookupTarget(to);
	const getChat = params.api.getChat;
	if (!lookupTarget || typeof getChat !== "function") throw new Error("Telegram recipient must be a numeric chat ID");
	try {
		const chat = await getChat.call(params.api, lookupTarget);
		const resolved = normalizeTelegramChatId(String(chat?.id ?? ""));
		if (!resolved) throw new Error(`resolved chat id is not numeric (${String(chat?.id ?? "")})`);
		if (params.verbose) sendLogger.warn(`telegram recipient ${lookupTarget} resolved to numeric chat id ${resolved}`);
		return resolved;
	} catch (err) {
		const detail = formatErrorMessage(err);
		throw new Error(`Telegram recipient ${lookupTarget} could not be resolved to a numeric chat ID (${detail})`, { cause: err });
	}
}
async function resolveAndPersistChatId(params) {
	const chatId = await resolveChatId(params.lookupTarget, {
		api: params.api,
		verbose: params.verbose
	});
	await maybePersistResolvedTelegramTarget({
		cfg: params.cfg,
		rawTarget: params.persistTarget,
		resolvedChatId: chatId,
		verbose: params.verbose,
		gatewayClientScopes: params.gatewayClientScopes,
		...params.gatewayClientScopes === void 0 ? { trustedInternalWriteback: true } : {}
	});
	return chatId;
}
function normalizeMessageId(raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
	if (typeof raw === "string") {
		const value = raw.trim();
		if (!value) throw new Error("Message id is required for Telegram actions");
		const parsed = parseStrictInteger(value);
		if (parsed !== void 0) return parsed;
	}
	throw new Error("Message id is required for Telegram actions");
}
function isTelegramMessageNotModifiedError(err) {
	return MESSAGE_NOT_MODIFIED_RE.test(formatErrorMessage(err));
}
function isTelegramMessageHasNoTextError(err) {
	return MESSAGE_HAS_NO_TEXT_RE.test(formatErrorMessage(err));
}
function isTelegramMessageDeleteNoopError(err) {
	return MESSAGE_DELETE_NOOP_RE.test(formatErrorMessage(err));
}
async function withTelegramNativeQuoteFallback(params) {
	try {
		return {
			result: await params.request(params.requestParams, params.label),
			acceptedParams: params.requestParams
		};
	} catch (err) {
		if (getTelegramNativeQuoteReplyMessageId(params.requestParams) == null || !isTelegramQuoteParamError(err)) throw err;
		sendLogger.warn(`telegram ${params.label} native quote rejected, retrying with legacy reply_to_message_id: ${formatErrorMessage(err)}`);
		const acceptedParams = (params.removeNativeQuoteParam ?? removeTelegramNativeQuoteParam)(params.requestParams);
		return {
			result: await params.request(acceptedParams, `${params.label}-legacy-reply`),
			acceptedParams
		};
	}
}
function resolveTelegramApiContext(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Telegram API context");
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = resolveToken(opts.token, account);
	let api;
	let clientOptionsLease;
	if (opts.api) api = opts.api;
	else {
		const client = resolveTelegramClientOptions(account);
		clientOptionsLease = client.lease?.();
		const bot = new Bot(token, client.clientOptions ? { client: client.clientOptions } : void 0);
		bot.api.config.use(getOrCreateAccountThrottler(token));
		api = bot.api;
	}
	return {
		cfg,
		account,
		ownerAgentId: resolveTelegramAccountOwnerAgentId({
			cfg,
			accountId: account.accountId
		}),
		api,
		...clientOptionsLease ? { clientOptionsLease } : {}
	};
}
function withTelegramApiContextLease(context, operation) {
	return operation.finally(() => context.clientOptionsLease?.release());
}
function createTelegramRequestWithDiag(params) {
	const request = createChannelApiRetryRunner({
		retry: params.retry,
		verbose: params.verbose,
		...params.retryAfterMaxDelayMs !== void 0 ? { retryAfterMaxDelayMs: params.retryAfterMaxDelayMs } : {},
		...params.shouldRetry ? { shouldRetry: params.shouldRetry } : {},
		...params.strictShouldRetry ? { strictShouldRetry: true } : {}
	});
	const logHttpError = createTelegramHttpLogger(params.cfg);
	return (fn, label, options) => {
		const runRequest = () => request(fn, label);
		return (params.useApiErrorLogging === false ? runRequest() : withTelegramApiErrorLogging({
			operation: label ?? "request",
			fn: runRequest,
			...options?.shouldLog ? { shouldLog: options.shouldLog } : {}
		})).catch((err) => {
			logHttpError(label ?? "request", err);
			throw err;
		});
	};
}
function wrapTelegramChatNotFoundError(err, params) {
	const errorMsg = formatErrorMessage(err);
	if (/403.*(bot.*not.*member|bot.*blocked|bot.*kicked)/i.test(errorMsg)) return new Error([
		`Telegram send failed: bot is not a member of the chat, was blocked, or was kicked (chat_id=${params.chatId}).`,
		`Telegram API said: ${errorMsg}.`,
		"Fix: Add the bot to the channel/group, or ensure it has not been removed/blocked/kicked by the user.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
	if (!CHAT_NOT_FOUND_RE.test(errorMsg)) return err;
	return new Error([
		`Telegram send failed: chat not found (chat_id=${params.chatId}).`,
		"Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
}
function createRequestWithChatNotFound(params) {
	return async (fn, label, options) => params.requestWithDiag(fn, label, options).catch((err) => {
		throw wrapTelegramChatNotFoundError(err, {
			chatId: params.chatId,
			input: params.input
		});
	});
}
function createTelegramNonIdempotentRequestWithDiag(params) {
	const request = createTelegramRequestWithDiag({
		cfg: params.cfg,
		account: params.account,
		retry: params.retry,
		verbose: params.verbose,
		useApiErrorLogging: params.useApiErrorLogging,
		retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS,
		shouldRetry: shouldRetryTelegramSendError,
		strictShouldRetry: true
	});
	return (fn, label, options) => request(fn, label, options).catch(rethrowTelegramSendError);
}
//#endregion
//#region extensions/telegram/src/group-history-window.ts
const TELEGRAM_SELF_SENDER_SUFFIX = " (you)";
function buildTelegramSelfSenderName(configuredName, telegramIdentity) {
	return `${configuredName?.trim() || telegramIdentity?.first_name?.trim() || telegramIdentity?.username?.trim() || "OpenClaw"}${TELEGRAM_SELF_SENDER_SUFFIX}`;
}
function isTelegramSelfSenderName(name) {
	return name?.endsWith(TELEGRAM_SELF_SENDER_SUFFIX) === true;
}
function isTelegramGroupHistorySelfEntry(entry) {
	return isTelegramSelfSenderName(entry.sender);
}
function telegramPromptMessageKey(message) {
	const messageId = message["message_id"];
	const body = message["body"];
	const timestampMs = message["timestamp_ms"];
	if (typeof messageId === "string" && messageId.trim()) return `id:${messageId.trim()}`;
	if (typeof body === "string" && typeof timestampMs === "number") return `text:${timestampMs}:${body.trim()}`;
}
function telegramHistoryEntryKey(entry) {
	if (entry.messageId?.trim()) return `id:${entry.messageId.trim()}`;
	if (entry.timestamp !== void 0) return `text:${entry.timestamp}:${entry.body.trim()}`;
}
function numericMessageId(value) {
	if (!value?.trim()) return;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isTelegramHistoryEntryAfterAmbientWatermark(entry, watermark) {
	if (!watermark) return true;
	if (entry.timestamp !== void 0 && watermark.timestampMs !== void 0) {
		if (entry.timestamp !== watermark.timestampMs) return entry.timestamp > watermark.timestampMs;
		const entryMessageId = numericMessageId(entry.messageId);
		const watermarkMessageId = numericMessageId(watermark.messageId);
		return entryMessageId !== void 0 && watermarkMessageId !== void 0 && entryMessageId > watermarkMessageId;
	}
	const entryMessageId = numericMessageId(entry.messageId);
	const watermarkMessageId = numericMessageId(watermark.messageId);
	if (entryMessageId !== void 0 && watermarkMessageId !== void 0) return entryMessageId > watermarkMessageId;
	return entry.messageId !== watermark.messageId;
}
function telegramChatWindowPayload(entry) {
	return entry?.payload && typeof entry.payload === "object" && !Array.isArray(entry.payload) ? entry.payload : void 0;
}
function telegramPromptMessages(payload) {
	return Array.isArray(payload?.["messages"]) ? payload["messages"].filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message)) : [];
}
function selectTelegramGroupHistoryAfterLastSelf(entries) {
	const lastSelfIndex = entries.findLastIndex(isTelegramGroupHistorySelfEntry);
	return lastSelfIndex === -1 ? [...entries] : entries.slice(lastSelfIndex + 1);
}
function isTelegramChatWindowPromptContext(entry) {
	return entry.source === "telegram" && entry.type === "chat_window";
}
function retainTelegramGroupHistoryPromptContext(params) {
	const entryKeys = new Set(params.entries.flatMap((entry) => {
		const key = telegramHistoryEntryKey(entry);
		return key ? [key] : [];
	}));
	return params.promptContext.flatMap((entry) => {
		if (!isTelegramChatWindowPromptContext(entry)) return [entry];
		const payload = telegramChatWindowPayload(entry);
		const messages = telegramPromptMessages(payload).filter((message) => {
			const key = telegramPromptMessageKey(message);
			return message["is_reply_target"] === true || Boolean(key && entryKeys.has(key));
		});
		if (messages.length === 0) return [];
		return [{
			...entry,
			payload: {
				...payload,
				messages
			}
		}];
	});
}
function mergeTelegramGroupHistoryPromptContext(params) {
	if (params.entries.length === 0) return params.promptContext;
	const historyMessages = params.entries.map((entry) => ({
		...entry.messageId ? { message_id: entry.messageId } : {},
		sender: entry.sender,
		...entry.timestamp !== void 0 ? { timestamp_ms: entry.timestamp } : {},
		body: entry.body
	}));
	const chatWindowIndex = params.promptContext.findIndex(isTelegramChatWindowPromptContext);
	const baseEntry = params.promptContext[chatWindowIndex];
	const existingMessages = telegramPromptMessages(telegramChatWindowPayload(baseEntry));
	const messagesByKey = /* @__PURE__ */ new Map();
	for (const message of [...historyMessages, ...existingMessages]) {
		const key = telegramPromptMessageKey(message);
		if (key) messagesByKey.set(key, message);
	}
	const mergedMessages = [...messagesByKey.values()].toSorted((left, right) => {
		return (typeof left["timestamp_ms"] === "number" ? left["timestamp_ms"] : 0) - (typeof right["timestamp_ms"] === "number" ? right["timestamp_ms"] : 0);
	});
	const mergedEntry = {
		...baseEntry,
		label: "Conversation context",
		source: baseEntry?.source ?? "telegram",
		type: "chat_window",
		payload: {
			order: "chronological",
			relation: "selected_for_current_message",
			messages: mergedMessages
		}
	};
	if (!baseEntry) return [...params.promptContext, mergedEntry];
	return params.promptContext.map((entry, index) => index === chatWindowIndex ? mergedEntry : entry);
}
function recordTelegramGroupHistoryEntry(params) {
	if (!params.historyKey) return;
	createChannelHistoryWindow({ historyMap: params.historyMap }).record({
		historyKey: params.historyKey,
		limit: params.limit,
		entry: params.entry
	});
}
//#endregion
//#region extensions/telegram/src/message-cache.ts
const DEFAULT_MAX_MESSAGES = 5e3;
const PERSISTENT_BUCKET_KEY = `plugin-state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`;
const TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY = Symbol.for("openclaw.telegram.messageCacheBuckets");
function getPersistedMessageCacheBuckets() {
	const globalRecord = globalThis;
	const existing = globalRecord[TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	globalRecord[TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY] = created;
	return created;
}
function telegramMessageCacheKey(params) {
	const key = `${params.accountId}:${params.chatId}:${params.messageId}`;
	return params.scopeKey ? `${params.scopeKey}:${key}` : key;
}
function telegramMessageCacheKeyPrefix(params) {
	const prefix = `${params.accountId}:${params.chatId}:`;
	return params.scopeKey ? `${params.scopeKey}:${prefix}` : prefix;
}
function resolveReplyMessage(msg) {
	const externalReply = msg.external_reply;
	return msg.reply_to_message ?? externalReply;
}
function resolveEmbeddedReplyMessage(msg) {
	return msg.reply_to_message;
}
function isTelegramMessageFromCurrentBot(msg, botUserId) {
	const currentBotUserId = parseStrictPositiveInteger(botUserId);
	if (currentBotUserId === void 0) return msg.from?.is_bot === true;
	return msg.from?.id === currentBotUserId || msg.sender_business_bot?.id === currentBotUserId;
}
function resolveMessageBody(msg, preserveWhitespace) {
	const text = getTelegramTextParts(msg).text;
	if (text.trim()) return preserveWhitespace ? text : text.trim();
	const location = extractTelegramLocation(msg);
	if (location) return formatLocationText(location);
	return resolveTelegramRichMessageBody(msg);
}
function resolveMessageTimestamp(msg) {
	const promptContextTimestamp = msg.openclaw_prompt_context_timestamp_ms;
	return typeof promptContextTimestamp === "number" && Number.isFinite(promptContextTimestamp) ? promptContextTimestamp : msg.date ? msg.date * 1e3 : void 0;
}
function normalizeMessageNode(msg, params) {
	const media = resolveTelegramPrimaryMedia(msg);
	const fileId = media?.fileRef.file_id;
	const forwardedFrom = normalizeForwardedContext(msg);
	const replyMessage = resolveReplyMessage(msg);
	const body = resolveMessageBody(msg, params.promptContextProjectionMarker !== void 0);
	const threadBinding = normalizeTelegramMessageThreadBinding(params.threadBinding);
	const threadId = parseTelegramMessageThreadId(threadBinding?.threadSpec.id ?? params.threadId);
	const timestamp = resolveMessageTimestamp(msg);
	return {
		sourceMessage: msg,
		messageId: String(msg.message_id),
		sender: buildSenderName(msg) ?? "unknown sender",
		...msg.from?.id != null ? { senderId: String(msg.from.id) } : {},
		...msg.from?.username ? { senderUsername: msg.from.username } : {},
		...timestamp !== void 0 ? { timestamp } : {},
		...body ? { body } : {},
		...media ? { mediaType: media.kind } : {},
		...fileId ? { mediaRef: `telegram:file/${fileId}` } : {},
		...replyMessage?.message_id != null ? { replyToId: String(replyMessage.message_id) } : {},
		...forwardedFrom?.from ? { forwardedFrom: forwardedFrom.from } : {},
		...forwardedFrom?.fromId ? { forwardedFromId: forwardedFrom.fromId } : {},
		...forwardedFrom?.fromUsername ? { forwardedFromUsername: forwardedFrom.fromUsername } : {},
		...forwardedFrom?.date ? { forwardedDate: forwardedFrom.date * 1e3 } : {},
		...threadId !== void 0 ? { threadId: String(threadId) } : {},
		...params.promptContextProjectionMarker ? { promptContextProjectionMarker: params.promptContextProjectionMarker } : {},
		...params.resolvedMedia ? { resolvedMedia: params.resolvedMedia } : {},
		...threadBinding ? { threadBinding } : {}
	};
}
function normalizeTelegramMessageThreadBinding(value) {
	if (!isRecord(value) || value.kind !== "provider-observed-v1") return;
	const threadSpec = value.threadSpec;
	if (!isRecord(threadSpec)) return;
	const id = parseTelegramMessageThreadId(threadSpec.id);
	if (id === void 0 || threadSpec.scope !== "direct-messages" && threadSpec.scope !== "dm" && threadSpec.scope !== "forum") return;
	return {
		kind: "provider-observed-v1",
		threadSpec: {
			scope: threadSpec.scope,
			id
		}
	};
}
function createTelegramMessageThreadBinding(threadSpec) {
	return normalizeTelegramMessageThreadBinding({
		kind: "provider-observed-v1",
		threadSpec
	});
}
function hasProviderObservedTelegramThreadBinding(node, threadId) {
	const normalizedThreadId = parseTelegramMessageThreadId(threadId);
	return normalizedThreadId !== void 0 && resolveProviderObservedTelegramThreadSpec(node)?.id === normalizedThreadId;
}
function resolveProviderObservedTelegramThreadSpec(node) {
	return normalizeTelegramMessageThreadBinding(node?.threadBinding)?.threadSpec;
}
function normalizeMessageNodes(msg, params) {
	const observations = [];
	const visited = /* @__PURE__ */ new Set();
	const nodeThreadId = (node) => parseTelegramMessageThreadId(node.threadId);
	const visit = (message, inheritedThreadId, mode, promptContextProjectionMarker, threadBinding, resolvedMedia) => {
		const embeddedThreadId = parseTelegramMessageThreadId(message.message_thread_id);
		const inheritedThread = parseTelegramMessageThreadId(inheritedThreadId);
		const observedBinding = normalizeTelegramMessageThreadBinding(threadBinding);
		const threadId = mode === "authoritative" ? observedBinding?.threadSpec.id ?? inheritedThread ?? embeddedThreadId : embeddedThreadId ?? inheritedThread;
		const matchingBinding = observedBinding?.threadSpec.id === threadId ? observedBinding : void 0;
		const node = normalizeMessageNode(message, {
			...threadId !== void 0 ? { threadId } : {},
			...promptContextProjectionMarker ? { promptContextProjectionMarker } : {},
			...resolvedMedia ? { resolvedMedia } : {},
			...matchingBinding ? { threadBinding: matchingBinding } : {}
		});
		if (visited.has(node.messageId)) return;
		visited.add(node.messageId);
		const replyMessage = resolveEmbeddedReplyMessage(message);
		if (replyMessage?.message_id != null) visit(replyMessage, nodeThreadId(node) ?? inheritedThreadId, "partial", void 0, node.threadBinding, void 0);
		observations.push({
			node,
			mode
		});
	};
	visit(msg, params.threadId, "authoritative", params.promptContextProjectionMarker, params.threadBinding, params.resolvedMedia);
	return observations;
}
function parseSafeMessageId(value) {
	return value === void 0 ? void 0 : parseStrictPositiveInteger(value);
}
function parsePersistedCacheValue(key, value) {
	if (!isRecord(value) || value.version !== void 0 && value.version !== 1) return [];
	const separatorIndex = key.lastIndexOf(":");
	if (separatorIndex === -1 || !isTelegramMessageCacheSourceMessage(value.sourceMessage)) return [];
	const threadId = parseTelegramMessageThreadId(value.threadId);
	const botUserId = parseStrictPositiveInteger(value.botUserId);
	const promptContextProjectionMarker = value.version === 1 && isTelegramMessageFromCurrentBot(value.sourceMessage, botUserId) ? parseTelegramPromptContextProjection(value.promptContextProjection) : void 0;
	const threadBinding = value.version === 1 ? normalizeTelegramMessageThreadBinding(value.threadBinding) : void 0;
	const resolvedMedia = parseTelegramResolvedMedia(value.resolvedMedia);
	return normalizeMessageNodes(value.sourceMessage, {
		...threadId !== void 0 ? { threadId } : {},
		...promptContextProjectionMarker ? { promptContextProjectionMarker } : {},
		...threadBinding ? { threadBinding } : {},
		...resolvedMedia ? { resolvedMedia } : {}
	}).map(({ node, mode }) => ({
		key: `${key.slice(0, separatorIndex + 1)}${node.messageId}`,
		node,
		mode
	}));
}
function trimMessages(messages, maxMessages) {
	while (messages.size > maxMessages) {
		const oldest = messages.keys().next().value;
		if (oldest === void 0) break;
		messages.delete(oldest);
	}
}
function mergeTelegramSourceMessage(existing, incoming) {
	const existingReply = resolveEmbeddedReplyMessage(existing);
	const incomingReply = resolveEmbeddedReplyMessage(incoming);
	if (existingReply?.message_id != null && incomingReply?.message_id === existingReply.message_id) return Object.assign({}, existing, incoming, { reply_to_message: mergeTelegramSourceMessage(existingReply, incomingReply) });
	return Object.assign({}, existing, incoming);
}
function mergeAuthoritativeTelegramSourceMessage(existing, incoming) {
	const existingReply = resolveEmbeddedReplyMessage(existing);
	const incomingReply = resolveEmbeddedReplyMessage(incoming);
	if (existingReply?.message_id != null && incomingReply?.message_id === existingReply.message_id) return Object.assign({}, incoming, { reply_to_message: mergeTelegramSourceMessage(existingReply, incomingReply) });
	return incoming;
}
function mergeCachedMessageNode(existing, incoming, mode) {
	const mergedSourceMessage = mode === "authoritative" ? mergeAuthoritativeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage) : mergeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage);
	const syntheticOutboundFrom = existing.senderId === "0" && incoming.sourceMessage.sender_chat ? existing.sourceMessage.from : void 0;
	const sourceMessage = syntheticOutboundFrom ? {
		...mergedSourceMessage,
		from: syntheticOutboundFrom
	} : mergedSourceMessage;
	const promptContextProjectionMarker = incoming.promptContextProjectionMarker ?? existing.promptContextProjectionMarker;
	const threadBinding = normalizeTelegramMessageThreadBinding(incoming.threadBinding) ?? normalizeTelegramMessageThreadBinding(existing.threadBinding);
	const threadId = parseTelegramMessageThreadId(threadBinding?.threadSpec.id ?? incoming.threadId ?? existing.threadId);
	const primaryMedia = resolveTelegramPrimaryMedia(sourceMessage);
	const resolvedMedia = existing.resolvedMedia?.fileUniqueId === primaryMedia?.fileRef.file_unique_id ? existing.resolvedMedia : void 0;
	return normalizeMessageNode(sourceMessage, {
		...threadId !== void 0 ? { threadId } : {},
		...promptContextProjectionMarker ? { promptContextProjectionMarker } : {},
		...threadBinding ? { threadBinding } : {},
		...resolvedMedia ? { resolvedMedia } : {}
	});
}
function upsertCachedMessageNode(params) {
	const existing = params.messages.get(params.key);
	const node = existing ? mergeCachedMessageNode(existing, params.node, params.mode) : params.node;
	params.messages.delete(params.key);
	params.messages.set(params.key, node);
	return node;
}
function resolveDefaultPersistentStore() {
	const runtime = getOptionalTelegramRuntime();
	if (!runtime) return;
	try {
		return runtime.state.openKeyedStore({
			namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
			maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES
		});
	} catch (error) {
		logVerbose(`telegram: failed to open message cache plugin state: ${String(error)}`);
		return;
	}
}
function resolveMessageCacheBucket(params) {
	const { bucketKey } = params;
	if (!bucketKey) return {
		messages: /* @__PURE__ */ new Map(),
		hydrated: true
	};
	const persistedMessageCacheBuckets = getPersistedMessageCacheBuckets();
	const existing = persistedMessageCacheBuckets.get(bucketKey);
	if (existing) {
		existing.persistentStore = params.persistentStore ?? existing.persistentStore;
		return existing;
	}
	const bucket = {
		messages: /* @__PURE__ */ new Map(),
		hydrated: false,
		...params.persistentStore ? { persistentStore: params.persistentStore } : {}
	};
	persistedMessageCacheBuckets.set(bucketKey, bucket);
	return bucket;
}
async function hydrateMessageCacheBucket(bucket, maxMessages, scopeKey) {
	if (bucket.hydrated) return;
	if (bucket.hydratePromise) {
		await bucket.hydratePromise;
		return;
	}
	bucket.hydratePromise = (async () => {
		let storeEntries = [];
		try {
			storeEntries = await bucket.persistentStore?.entries() ?? [];
		} catch (error) {
			logVerbose(`telegram: failed to hydrate message cache from plugin state: ${String(error)}`);
		}
		const scopedStoreEntries = scopeKey ? storeEntries.filter(({ key }) => key.startsWith(`${scopeKey}:`)) : storeEntries;
		for (const { key, value } of scopedStoreEntries) for (const entry of parsePersistedCacheValue(key, value)) {
			upsertCachedMessageNode({
				messages: bucket.messages,
				key: entry.key,
				node: entry.node,
				mode: entry.mode
			});
			trimMessages(bucket.messages, maxMessages);
		}
		bucket.hydrated = true;
	})().finally(() => {
		bucket.hydratePromise = void 0;
	});
	await bucket.hydratePromise;
}
async function persistCachedNode(params) {
	const { persistentStore } = params.bucket;
	if (!persistentStore) return;
	try {
		const marker = params.node.promptContextProjectionMarker;
		const promptContextProjection = marker?.kind === "valid" ? marker.projection : marker ? { transcriptMessageId: marker.transcriptMessageId } : void 0;
		await persistentStore.register(params.key, {
			version: 1,
			sourceMessage: params.node.sourceMessage,
			...params.botUserId !== void 0 ? { botUserId: params.botUserId } : {},
			...promptContextProjection ? { promptContextProjection } : {},
			...params.node.resolvedMedia ? { resolvedMedia: params.node.resolvedMedia } : {},
			...params.node.threadBinding ? { threadBinding: params.node.threadBinding } : {},
			...params.node.threadId ? { threadId: params.node.threadId } : {}
		});
	} catch (error) {
		logVerbose(`telegram: failed to persist message cache: ${String(error)}`);
		const marker = params.node.promptContextProjectionMarker;
		if (marker) {
			params.node.promptContextProjectionMarker = {
				kind: "invalid",
				transcriptMessageId: marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId
			};
			throw error;
		}
	}
}
function createTelegramMessageCache(params) {
	const persistentStore = params?.persistentStore ?? resolveDefaultPersistentStore();
	const maxMessages = params?.maxMessages ?? (persistentStore ? 3e3 : DEFAULT_MAX_MESSAGES);
	const scopeKey = persistentStore ? resolveTelegramMessageCachePersistentScopeKey(params?.scope ?? "default") : void 0;
	const bucket = resolveMessageCacheBucket({
		bucketKey: params?.bucketKey ?? (persistentStore ? `${PERSISTENT_BUCKET_KEY}:${scopeKey}` : void 0),
		...persistentStore ? { persistentStore } : {}
	});
	const { messages } = bucket;
	const get = async ({ accountId, chatId, messageId }) => {
		await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
		if (!messageId) return null;
		const key = telegramMessageCacheKey({
			scopeKey,
			accountId,
			chatId,
			messageId
		});
		const entry = messages.get(key);
		if (!entry) return null;
		messages.delete(key);
		messages.set(key, entry);
		return entry;
	};
	const listChatMessages = async (paramsLocal) => {
		await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
		const prefix = telegramMessageCacheKeyPrefix({
			scopeKey,
			...paramsLocal
		});
		const normalizedThreadId = parseTelegramMessageThreadId(paramsLocal.threadId);
		if (paramsLocal.threadId != null && normalizedThreadId === void 0) return [];
		const threadId = normalizedThreadId !== void 0 ? String(normalizedThreadId) : void 0;
		return Array.from(messages, ([key, node]) => ({
			key,
			node
		})).filter(({ key, node }) => {
			if (!key.startsWith(prefix)) return false;
			return threadId === void 0 || node.threadId === threadId;
		}).map(({ node }) => node).toSorted(compareCachedMessageNodes);
	};
	return {
		record: async ({ accountId, botUserId, chatId, msg, promptContextProjection, providerObservedThread, threadId }) => {
			await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
			const threadBinding = createTelegramMessageThreadBinding(providerObservedThread);
			const observations = normalizeMessageNodes(msg, {
				threadId,
				...promptContextProjection && isTelegramMessageFromCurrentBot(msg, botUserId) ? { promptContextProjectionMarker: {
					kind: "valid",
					projection: promptContextProjection
				} } : {},
				...threadBinding ? { threadBinding } : {}
			});
			const currentObservation = observations.at(-1);
			let recordedEntry = currentObservation.node;
			for (const { node, mode } of observations) {
				const { messageId } = node;
				const key = telegramMessageCacheKey({
					scopeKey,
					accountId,
					chatId,
					messageId
				});
				const cachedNode = upsertCachedMessageNode({
					messages,
					key,
					node,
					mode
				});
				if (messageId === currentObservation.node.messageId) recordedEntry = cachedNode;
				trimMessages(messages, maxMessages);
				await persistCachedNode({
					bucket,
					key,
					node: cachedNode,
					...botUserId !== void 0 ? { botUserId } : {}
				});
			}
			return recordedEntry;
		},
		recordResolvedMedia: async ({ accountId, botUserId, chatId, messageId, media }) => {
			await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
			const key = telegramMessageCacheKey({
				scopeKey,
				accountId,
				chatId,
				messageId
			});
			const node = messages.get(key);
			if (!node) throw new Error(`Telegram message ${messageId} was not recorded before media resolution`);
			if (resolveTelegramPrimaryMedia(node.sourceMessage)?.fileRef.file_unique_id !== media.fileUniqueId) throw new Error(`Telegram message ${messageId} media changed during resolution`);
			const { path: _path, fileName: _fileName, ...resolvedMedia } = media;
			const resolvedNode = {
				...node,
				resolvedMedia
			};
			messages.delete(key);
			messages.set(key, resolvedNode);
			await persistCachedNode({
				bucket,
				key,
				node: resolvedNode,
				...botUserId !== void 0 ? { botUserId } : {}
			});
		},
		get,
		recentBefore: async ({ accountId, chatId, messageId, threadId, limit }) => {
			if (!messageId || limit <= 0) return [];
			const targetId = parseSafeMessageId(messageId);
			if (targetId === void 0) return [];
			return (await listChatMessages({
				accountId,
				chatId,
				threadId
			})).filter((entry) => {
				const entryId = parseSafeMessageId(entry.messageId);
				return entryId !== void 0 && entryId < targetId;
			}).slice(-limit);
		},
		around: async ({ accountId, chatId, messageId, threadId, before, after }) => {
			if (!messageId) return [];
			const entries = await listChatMessages({
				accountId,
				chatId,
				threadId
			});
			const targetIndex = entries.findIndex((entry) => entry.messageId === messageId);
			if (targetIndex === -1) return [];
			return entries.slice(Math.max(0, targetIndex - Math.max(0, before)), targetIndex + Math.max(0, after) + 1);
		},
		latestMatchingAtOrBefore: async ({ accountId, chatId, messageId, threadId, matches }) => {
			if (!messageId) return null;
			const targetId = parseSafeMessageId(messageId);
			if (targetId === void 0) return null;
			await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey);
			const prefix = telegramMessageCacheKeyPrefix({
				scopeKey,
				accountId,
				chatId
			});
			const normalizedThreadId = parseTelegramMessageThreadId(threadId);
			if (threadId != null && normalizedThreadId === void 0) return null;
			const normalizedThread = normalizedThreadId !== void 0 ? String(normalizedThreadId) : void 0;
			let latest = null;
			for (const [key, entry] of messages) {
				if (!key.startsWith(prefix)) continue;
				if (normalizedThread !== void 0 && entry.threadId !== normalizedThread) continue;
				const entryId = parseSafeMessageId(entry.messageId);
				if (entryId === void 0 || entryId > targetId || !matches(entry)) continue;
				if (!latest || compareCachedMessageNodes(entry, latest) > 0) latest = entry;
			}
			return latest;
		}
	};
}
function compareCachedMessageNodes(left, right) {
	const leftId = parseSafeMessageId(left.messageId);
	const rightId = parseSafeMessageId(right.messageId);
	if (leftId !== void 0 && rightId !== void 0) return leftId - rightId;
	return (left.messageId ?? "").localeCompare(right.messageId ?? "");
}
const SESSION_BOUNDARY_COMMAND_RE = /^\/(?:new|reset)(?:@[A-Za-z0-9_]+)?(?:\s|$)/i;
const SOFT_RESET_COMMAND_RE = /^\/reset(?:@[A-Za-z0-9_]+)?\s+soft(?:\s|$)/i;
function isTelegramSessionBoundaryCommandText(text) {
	const body = text?.trim();
	return Boolean(body && SESSION_BOUNDARY_COMMAND_RE.test(body) && !SOFT_RESET_COMMAND_RE.test(body));
}
function isSessionBoundaryCommandNode(node) {
	return isTelegramSessionBoundaryCommandText(node.body);
}
function isAfterSessionBoundary(node, boundary) {
	if (!boundary) return true;
	const nodeId = parseSafeMessageId(node.messageId);
	const boundaryId = parseSafeMessageId(boundary.messageId);
	if (nodeId !== void 0 && boundaryId !== void 0) return nodeId > boundaryId;
	if (typeof node.timestamp === "number" && Number.isFinite(node.timestamp) && typeof boundary.timestamp === "number" && Number.isFinite(boundary.timestamp)) return node.timestamp > boundary.timestamp;
	return true;
}
function normalizeSessionBoundaryTimestamp(timestampMs) {
	if (typeof timestampMs !== "number" || !Number.isFinite(timestampMs)) return;
	return Math.floor(timestampMs / 1e3) * 1e3;
}
function isAtOrAfterSessionBoundaryTimestamp(node, boundaryTimestampMs) {
	if (boundaryTimestampMs === void 0) return true;
	return typeof node.timestamp !== "number" || !Number.isFinite(node.timestamp) ? true : node.timestamp >= boundaryTimestampMs;
}
async function resolveSessionBoundaryNode(params) {
	if (!params.messageId) return;
	return await params.cache.latestMatchingAtOrBefore({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: params.messageId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {},
		matches: isSessionBoundaryCommandNode
	}) ?? void 0;
}
async function buildTelegramReplyChain(params) {
	const replyMessage = resolveReplyMessage(params.msg);
	if (!replyMessage?.message_id) return [];
	const maxDepth = params.maxDepth ?? 4;
	const visited = /* @__PURE__ */ new Set();
	const chain = [];
	let current = await params.cache.get({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: String(replyMessage.message_id)
	}) ?? normalizeMessageNode(replyMessage, {});
	while (current?.messageId && chain.length < maxDepth && !visited.has(current.messageId)) {
		visited.add(current.messageId);
		chain.push(current);
		current = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId: current.replyToId
		});
	}
	return chain;
}
async function buildTelegramConversationContext(params) {
	const selected = /* @__PURE__ */ new Map();
	const replyTargetIds = /* @__PURE__ */ new Set();
	const sessionBoundary = await resolveSessionBoundaryNode(params);
	const sessionBoundaryTimestamp = normalizeSessionBoundaryTimestamp(params.minTimestampMs);
	const addNode = (node, flags) => {
		if (!node.messageId || node.messageId === params.messageId) return false;
		if (!isAfterSessionBoundary(node, sessionBoundary)) return false;
		if (!isAtOrAfterSessionBoundaryTimestamp(node, sessionBoundaryTimestamp)) return false;
		if (params.includeNode && !params.includeNode(node, flags)) return false;
		const existing = selected.get(node.messageId);
		const isReplyTarget = existing?.isReplyTarget === true || flags?.replyTarget === true;
		selected.set(node.messageId, {
			node: existing?.node ?? node,
			isReplyTarget: isReplyTarget ? true : void 0
		});
		return true;
	};
	const addReplyTargetWindow = async (messageId) => {
		replyTargetIds.add(messageId);
		for (const node of await params.cache.around({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId,
			...params.threadId !== void 0 ? { threadId: params.threadId } : {},
			before: params.replyTargetWindowSize,
			after: params.replyTargetWindowSize
		})) addNode(node, { replyTarget: node.messageId === messageId });
	};
	const currentWindow = await params.cache.recentBefore({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: params.messageId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {},
		limit: params.recentLimit
	});
	for (const node of currentWindow) if (addNode(node) && node.replyToId) await addReplyTargetWindow(node.replyToId);
	for (const [index, node] of params.replyChainNodes.entries()) {
		const added = addNode(node, { replyTarget: index === 0 });
		if (added && index === 0 && node.messageId) await addReplyTargetWindow(node.messageId);
		if (added && node.replyToId) replyTargetIds.add(node.replyToId);
	}
	for (const messageId of replyTargetIds) {
		const node = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId
		});
		if (node) addNode(node, { replyTarget: true });
	}
	return Array.from(selected.values()).toSorted((left, right) => compareCachedMessageNodes(left.node, right.node));
}
//#endregion
//#region extensions/telegram/src/provider-thread-proof.ts
function resolveTelegramProviderObservedThreadId(params) {
	if (params.successfulSendThread?.scope === "direct-messages") return params.message.direct_messages_topic?.topic_id;
	if (typeof params.message.message_thread_id === "number") return params.message.message_thread_id;
	return params.message.chat?.type === "supergroup" && params.successfulSendThread?.scope === "forum" && params.successfulSendThread.id === 1 ? 1 : void 0;
}
function resolveTelegramProviderObservedThreadSpec(params) {
	const providerThreadId = resolveTelegramProviderObservedThreadId(params);
	const successfulSendThread = params.successfulSendThread;
	if (providerThreadId === void 0 || successfulSendThread?.id !== providerThreadId || successfulSendThread.scope === "none") return;
	return {
		scope: successfulSendThread.scope,
		id: providerThreadId
	};
}
function assertTelegramProviderThread(params) {
	const expectedThreadId = params.successfulSendThread?.id;
	if (expectedThreadId === void 0) return;
	const providerThreadId = resolveTelegramProviderObservedThreadId(params);
	if (providerThreadId !== expectedThreadId) throw new Error(`Telegram delivered message ${params.message.message_id ?? "unknown"} to topic ${providerThreadId ?? "unknown"}; expected topic ${expectedThreadId}`);
}
//#endregion
//#region extensions/telegram/src/outbound-message-context.ts
const outboundGroupHistoryRecorders = /* @__PURE__ */ new Map();
function registerTelegramOutboundGroupHistoryRecorder(params) {
	outboundGroupHistoryRecorders.set(params.accountId, params.recorder);
	return () => {
		if (outboundGroupHistoryRecorders.get(params.accountId) === params.recorder) outboundGroupHistoryRecorders.delete(params.accountId);
	};
}
function resolveOutboundCacheMessageTimestamp(msg) {
	if (typeof msg.openclaw_prompt_context_timestamp_ms === "number" && Number.isFinite(msg.openclaw_prompt_context_timestamp_ms)) return msg.openclaw_prompt_context_timestamp_ms;
	return typeof msg.date === "number" && Number.isFinite(msg.date) ? msg.date * 1e3 : void 0;
}
function inferTelegramChatType(chatId) {
	return String(chatId).startsWith("-") ? "supergroup" : "private";
}
function buildOutboundCacheMessage(params) {
	const chat = params.message.chat ?? {};
	const text = params.message.text ?? params.message.caption ?? params.text;
	const rawSender = params.message.from;
	const stableSender = params.message.sender_chat ? void 0 : rawSender;
	const selfSenderName = buildTelegramSelfSenderName(params.account.name, params.account.bot ?? stableSender);
	return {
		...params.message,
		message_id: params.messageId,
		...params.promptContextTimestampMs !== void 0 ? { openclaw_prompt_context_timestamp_ms: params.promptContextTimestampMs } : {},
		date: typeof params.message.date === "number" && Number.isFinite(params.message.date) ? params.message.date : Math.floor(Date.now() / 1e3),
		chat: {
			id: chat.id ?? params.chatId,
			type: chat.type ?? inferTelegramChatType(params.chatId),
			...chat.title ? { title: chat.title } : {},
			...chat.username ? { username: chat.username } : {}
		},
		from: {
			id: params.message.sender_chat ? 0 : stableSender?.id ?? params.botUserId ?? 0,
			is_bot: true,
			first_name: selfSenderName,
			...stableSender?.username ? { username: stableSender.username } : {}
		},
		...text ? { text } : {},
		...params.messageThreadId !== void 0 ? { message_thread_id: params.messageThreadId } : {}
	};
}
async function recordOutboundMessageForPromptContext(params) {
	try {
		const providerObservedThread = resolveTelegramProviderObservedThreadSpec({
			message: params.message,
			successfulSendThread: params.successfulSendThread
		});
		const messageThreadId = providerObservedThread?.id ?? params.messageThreadId;
		const cacheMessage = buildOutboundCacheMessage({
			...params,
			...messageThreadId !== void 0 ? { messageThreadId } : {}
		});
		await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store, { agentId: params.ownerAgentId?.trim() || resolveTelegramAccountOwnerAgentId({
			cfg: params.cfg,
			accountId: params.account.accountId
		}) })) }).record({
			accountId: params.account.accountId,
			chatId: params.chatId,
			msg: cacheMessage,
			...params.botUserId !== void 0 ? { botUserId: params.botUserId } : {},
			...params.promptContextProjection ? { promptContextProjection: params.promptContextProjection } : {},
			...providerObservedThread ? { providerObservedThread } : {},
			...messageThreadId !== void 0 ? { threadId: messageThreadId } : {}
		});
		if (params.recordGroupHistory !== false) {
			const timestamp = resolveOutboundCacheMessageTimestamp(cacheMessage);
			const threadSpec = providerObservedThread ?? params.successfulSendThread;
			outboundGroupHistoryRecorders.get(params.account.accountId)?.({
				chatId: params.chatId,
				messageId: params.messageId,
				text: params.text ?? cacheMessage.text ?? cacheMessage.caption,
				...threadSpec ? { threadSpec } : {},
				...timestamp !== void 0 ? { timestamp } : {}
			});
		}
		return true;
	} catch (error) {
		logVerbose(`telegram: failed to record outbound message context: ${String(error)}`);
		return false;
	}
}
//#endregion
//#region extensions/telegram/src/sent-message-cache.ts
const CLEANUP_INTERVAL_MS = 3600 * 1e3;
const TELEGRAM_SENT_MESSAGES_STATE_KEY = Symbol.for("openclaw.telegramSentMessagesState");
function getSentMessageState() {
	const globalStore = globalThis;
	const existing = globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY];
	if (existing) return existing;
	const state = { bucketsByScope: /* @__PURE__ */ new Map() };
	globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY] = state;
	return state;
}
function createSentMessageStore() {
	return /* @__PURE__ */ new Map();
}
function openSentMessageStore() {
	return getTelegramRuntime().state.openSyncKeyedStore({
		namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES
	});
}
function cleanupExpired(store, scopeKey, entry, now) {
	for (const [id, timestamp] of entry) if (now - timestamp >= 864e5) entry.delete(id);
	if (entry.size === 0) store.delete(scopeKey);
}
function cleanupExpiredSentMessages(store, now) {
	for (const [scopeKey, entry] of store) cleanupExpired(store, scopeKey, entry, now);
}
function readPersistedSentMessages(scopeKey) {
	const now = Date.now();
	const store = createSentMessageStore();
	try {
		for (const entry of openSentMessageStore().entries()) {
			if (entry.value.scopeKey !== scopeKey || now - entry.value.timestamp > 864e5) continue;
			let messages = store.get(entry.value.chatId);
			if (!messages) {
				messages = /* @__PURE__ */ new Map();
				store.set(entry.value.chatId, messages);
			}
			messages.set(entry.value.messageId, entry.value.timestamp);
		}
	} catch (error) {
		logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
	}
	return store;
}
function getSentMessageBucket(cfg, owner) {
	const state = getSentMessageState();
	const scopeKey = resolveSentMessageScopeKey(cfg, owner);
	const existing = state.bucketsByScope.get(scopeKey);
	if (existing) return existing;
	const bucket = {
		scopeKey,
		store: readPersistedSentMessages(scopeKey),
		nextCleanupAt: Date.now() + CLEANUP_INTERVAL_MS
	};
	state.bucketsByScope.set(scopeKey, bucket);
	return bucket;
}
function getSentMessages(cfg, owner) {
	return getSentMessageBucket(cfg, owner).store;
}
function persistSentMessage(bucket, chatId, messageId, timestamp) {
	openSentMessageStore().register(sentMessageEntryKey(bucket.scopeKey, chatId, messageId), {
		scopeKey: bucket.scopeKey,
		chatId,
		messageId,
		timestamp
	}, { ttlMs: TTL_MS });
}
function recordSentMessage(chatId, messageId, cfg, owner) {
	const scopeKey = String(chatId);
	const idKey = String(messageId);
	const now = Date.now();
	const bucket = getSentMessageBucket(cfg, owner);
	const { store } = bucket;
	let entry = store.get(scopeKey);
	if (!entry) {
		entry = /* @__PURE__ */ new Map();
		store.set(scopeKey, entry);
	}
	entry.set(idKey, now);
	if (now >= bucket.nextCleanupAt) {
		cleanupExpiredSentMessages(store, now);
		bucket.nextCleanupAt = now + CLEANUP_INTERVAL_MS;
	}
	try {
		persistSentMessage(bucket, scopeKey, idKey, now);
	} catch (error) {
		logVerbose(`telegram: failed to persist sent-message cache: ${String(error)}`);
	}
}
function wasSentByBot(chatId, messageId, cfg, owner) {
	const scopeKey = String(chatId);
	const idKey = String(messageId);
	const store = getSentMessages(cfg, owner);
	const entry = store.get(scopeKey);
	if (!entry) return false;
	cleanupExpired(store, scopeKey, entry, Date.now());
	return entry.has(idKey);
}
//#endregion
//#region extensions/telegram/src/send-outbound.ts
async function reportTelegramProviderDelivery(params) {
	const messageId = String(params.messageId);
	const chatId = String(params.message.chat?.id ?? params.fallbackChatId);
	const providerThreadId = resolveTelegramProviderObservedThreadId({
		message: params.message,
		successfulSendThread: params.successfulSendThread
	});
	const delivery = {
		messageId,
		chatId,
		...providerThreadId !== void 0 ? { receipt: createMessageReceiptFromOutboundResults({
			results: [{
				messageId,
				chatId
			}],
			...params.kind !== void 0 ? { kind: params.kind } : {},
			threadId: String(providerThreadId)
		}) } : {},
		...params.meta ? { meta: params.meta } : {}
	};
	params.onPrepared?.(delivery);
	await params.onDeliveryResult?.(delivery);
	try {
		assertTelegramProviderThread({
			message: params.message,
			successfulSendThread: params.successfulSendThread
		});
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: [messageId],
			...delivery.receipt ? { receipt: delivery.receipt } : {},
			visibleReplySent: true
		});
	}
	return delivery;
}
async function prepareTelegramOutbound(params) {
	const { cfg, account, api } = params.context;
	const rawTarget = String(params.to);
	const target = parseTelegramTarget(rawTarget);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: rawTarget,
		verbose: params.opts.verbose,
		gatewayClientScopes: params.opts.gatewayClientScopes
	});
	const threadSpec = params.thread ? resolveTelegramSendThreadSpec({
		targetMessageThreadId: target.messageThreadId,
		targetDirectMessagesTopicId: target.directMessagesTopicId,
		messageThreadId: params.thread.messageThreadId,
		chatType: target.chatType
	}) : void 0;
	const threadParams = buildTelegramThreadReplyParams({
		thread: threadSpec,
		replyToMessageId: params.thread?.replyToMessageId,
		replyQuoteText: params.thread?.replyQuoteText,
		useReplyIdAsQuoteSource: params.thread?.useReplyIdAsQuoteSource
	});
	const requestWithDiag = params.request.kind === "nonIdempotent" ? createTelegramNonIdempotentRequestWithDiag({
		cfg,
		account,
		retry: params.opts.retry,
		verbose: params.opts.verbose,
		useApiErrorLogging: params.request.useApiErrorLogging
	}) : createTelegramRequestWithDiag({
		cfg,
		account,
		retry: params.opts.retry,
		verbose: params.opts.verbose,
		shouldRetry: params.request.shouldRetry
	});
	const request = params.request.kind === "nonIdempotent" ? createRequestWithChatNotFound({
		requestWithDiag,
		chatId,
		input: rawTarget
	}) : requestWithDiag;
	return {
		chatId,
		...params.messageIdInput !== void 0 ? { messageId: normalizeMessageId(params.messageIdInput) } : {},
		threadSpec,
		threadParams,
		request
	};
}
async function finalizeTelegramOutbound(params) {
	const { cfg, account, ownerAgentId } = params.context;
	const messageId = resolveTelegramMessageIdOrThrow(params.result, params.resultContext);
	recordSentMessage(params.prepared.chatId, messageId, cfg, {
		accountId: account.accountId,
		agentId: ownerAgentId
	});
	const resultIds = await reportTelegramProviderDelivery({
		message: params.result,
		messageId,
		fallbackChatId: params.prepared.chatId,
		successfulSendThread: params.prepared.threadSpec,
		onDeliveryResult: params.onDeliveryResult
	});
	const projection = params.promptContextProjectionPlan?.cursor.take(params.promptContextProjectionPlan.finalPart);
	const recorded = await recordOutboundMessageForPromptContext({
		cfg,
		ownerAgentId,
		account,
		botUserId: params.botUserId,
		chatId: params.prepared.chatId,
		message: params.result,
		messageId,
		text: params.text,
		messageThreadId: params.messageThreadId ?? params.prepared.threadSpec?.id,
		successfulSendThread: params.prepared.threadSpec,
		promptContextProjection: projection
	});
	if (projection && !recorded) params.promptContextProjectionPlan?.cursor.invalidate();
	params.beforeActivity?.(resultIds);
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return resultIds;
}
//#endregion
//#region extensions/telegram/src/status-reaction-variants.ts
const TELEGRAM_GENERIC_REACTION_FALLBACKS = [
	"👍",
	"👀",
	"🔥"
];
const TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST = [
	"❤",
	"👍",
	"👎",
	"🔥",
	"🥰",
	"👏",
	"😁",
	"🤔",
	"🤯",
	"😱",
	"🤬",
	"😢",
	"🎉",
	"🤩",
	"🤮",
	"💩",
	"🙏",
	"👌",
	"🕊",
	"🤡",
	"🥱",
	"🥴",
	"😍",
	"🐳",
	"❤‍🔥",
	"🌚",
	"🌭",
	"💯",
	"🤣",
	"⚡",
	"🍌",
	"🏆",
	"💔",
	"🤨",
	"😐",
	"🍓",
	"🍾",
	"💋",
	"🖕",
	"😈",
	"😴",
	"😭",
	"🤓",
	"👻",
	"👨‍💻",
	"👀",
	"🎃",
	"🙈",
	"😇",
	"😨",
	"🤝",
	"✍",
	"🤗",
	"🫡",
	"🎅",
	"🎄",
	"☃",
	"💅",
	"🤪",
	"🗿",
	"🆒",
	"💘",
	"🙉",
	"🦄",
	"😘",
	"💊",
	"🙊",
	"😎",
	"👾",
	"🤷‍♂",
	"🤷",
	"🤷‍♀",
	"😡"
];
const TELEGRAM_SUPPORTED_REACTION_EMOJIS = new Map(TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST.map((emoji) => [emoji, emoji]));
const TELEGRAM_STATUS_REACTION_VARIANTS = {
	queued: [
		"👀",
		"👍",
		"🔥"
	],
	thinking: [
		"🤔",
		"🤓",
		"👀"
	],
	tool: [
		"🔥",
		"⚡",
		"👍"
	],
	coding: [
		"👨‍💻",
		"🔥",
		"⚡"
	],
	web: [
		"⚡",
		"🔥",
		"👍"
	],
	deploy: [
		"🔥",
		"⚡",
		"👍"
	],
	build: [
		"🔥",
		"👨‍💻",
		"⚡"
	],
	concierge: [
		"👀",
		"🔥",
		"⚡"
	],
	done: [
		"👍",
		"🎉",
		"💯"
	],
	error: [
		"😱",
		"😨",
		"🤯"
	],
	stallSoft: [
		"🥱",
		"😴",
		"🤔"
	],
	stallHard: [
		"😨",
		"😱",
		"⚡"
	],
	compacting: [
		"✍",
		"🤔",
		"🤯"
	]
};
const STATUS_REACTION_EMOJI_KEYS = [
	"queued",
	"thinking",
	"tool",
	"coding",
	"web",
	"deploy",
	"build",
	"concierge",
	"done",
	"error",
	"stallSoft",
	"stallHard",
	"compacting"
];
function toUniqueNonEmpty(values) {
	return uniqueStrings(normalizeStringEntries(values));
}
function resolveTelegramStatusReactionEmojis(params) {
	const { overrides } = params;
	const queuedFallback = normalizeOptionalString(params.initialEmoji) ?? DEFAULT_EMOJIS.queued;
	return {
		queued: normalizeOptionalString(overrides?.queued) ?? queuedFallback,
		thinking: normalizeOptionalString(overrides?.thinking) ?? DEFAULT_EMOJIS.thinking,
		tool: normalizeOptionalString(overrides?.tool) ?? DEFAULT_EMOJIS.tool,
		coding: normalizeOptionalString(overrides?.coding) ?? DEFAULT_EMOJIS.coding,
		web: normalizeOptionalString(overrides?.web) ?? DEFAULT_EMOJIS.web,
		deploy: normalizeOptionalString(overrides?.deploy) ?? DEFAULT_EMOJIS.deploy,
		build: normalizeOptionalString(overrides?.build) ?? DEFAULT_EMOJIS.build,
		concierge: normalizeOptionalString(overrides?.concierge) ?? DEFAULT_EMOJIS.concierge,
		done: normalizeOptionalString(overrides?.done) ?? DEFAULT_EMOJIS.done,
		error: normalizeOptionalString(overrides?.error) ?? DEFAULT_EMOJIS.error,
		stallSoft: normalizeOptionalString(overrides?.stallSoft) ?? DEFAULT_EMOJIS.stallSoft,
		stallHard: normalizeOptionalString(overrides?.stallHard) ?? DEFAULT_EMOJIS.stallHard,
		compacting: normalizeOptionalString(overrides?.compacting) ?? DEFAULT_EMOJIS.compacting
	};
}
function buildTelegramStatusReactionVariants(emojis) {
	const variantsByRequested = /* @__PURE__ */ new Map();
	for (const key of STATUS_REACTION_EMOJI_KEYS) {
		const requested = normalizeOptionalString(emojis[key]);
		if (!requested) continue;
		const candidates = toUniqueNonEmpty([requested, ...TELEGRAM_STATUS_REACTION_VARIANTS[key] ?? []]);
		variantsByRequested.set(requested, candidates);
	}
	return variantsByRequested;
}
function resolveTelegramReactionEmoji(emoji) {
	return TELEGRAM_SUPPORTED_REACTION_EMOJIS.get(emoji.trim().replace(/[\uFE0E\uFE0F]/gu, ""));
}
function extractTelegramAllowedReactions(chat) {
	if (!chat) return;
	const availableReactions = chat.available_reactions;
	if (availableReactions === void 0) return;
	if (availableReactions == null) return null;
	if (!Array.isArray(availableReactions)) return [];
	const allowed = [];
	const identifiers = /* @__PURE__ */ new Set();
	for (const reaction of availableReactions) {
		if (reaction.type === "custom_emoji") {
			const identifier = normalizeOptionalString(reaction.custom_emoji_id);
			if (identifier && !identifiers.has(`custom:${identifier}`)) {
				identifiers.add(`custom:${identifier}`);
				allowed.push({
					type: "custom_emoji",
					custom_emoji_id: identifier
				});
			}
			continue;
		}
		if (reaction.type !== "emoji") continue;
		const emoji = resolveTelegramReactionEmoji(reaction.emoji);
		if (emoji && !identifiers.has(`emoji:${emoji}`)) {
			identifiers.add(`emoji:${emoji}`);
			allowed.push({
				type: "emoji",
				emoji
			});
		}
	}
	return allowed;
}
async function resolveTelegramAllowedReactions(params) {
	const fromMessage = extractTelegramAllowedReactions(params.chat);
	if (fromMessage !== void 0) return fromMessage;
	if (params.getChat) {
		const fromLookup = extractTelegramAllowedReactions(await params.getChat(params.chatId));
		if (fromLookup !== void 0) return fromLookup;
	}
	return null;
}
function resolveTelegramReactionVariant(params) {
	const requestedEmoji = normalizeOptionalString(params.requestedEmoji);
	if (!requestedEmoji) return;
	const variants = toUniqueNonEmpty([...params.variantsByRequestedEmoji.get(requestedEmoji) ?? [requestedEmoji], ...TELEGRAM_GENERIC_REACTION_FALLBACKS]);
	for (const candidate of variants) {
		const emoji = resolveTelegramReactionEmoji(candidate);
		if (!emoji) continue;
		if (params.allowedEmojiReactions == null || params.allowedEmojiReactions.has(emoji)) return emoji;
	}
}
//#endregion
//#region extensions/telegram/src/send-actions.ts
async function getTelegramAllowedReactions(chatId, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, resolveTelegramAllowedReactions({
		chat: void 0,
		chatId,
		getChat: (targetChatId) => context.api.getChat(targetChatId)
	}));
}
async function sendTypingTelegram(to, opts) {
	const target = parseTelegramTarget(to);
	if (target.directMessagesTopicId != null) throw new Error("Telegram typing is not supported in channel Direct Messages chats.");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendTypingTelegramWithContext(to, target, opts, context));
}
async function sendTypingTelegramWithContext(to, target, opts, context) {
	const { cfg, account, api } = context;
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: to,
		verbose: opts.verbose
	});
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose,
		shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "action" })
	});
	const threadParams = buildTypingThreadParams(target.messageThreadId ?? opts.messageThreadId);
	await requestWithDiag(() => api.sendChatAction(chatId, "typing", threadParams), "typing");
	return { ok: true };
}
async function reactMessageTelegram(chatIdInput, messageIdInput, emoji, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, reactMessageTelegramWithContext(chatIdInput, messageIdInput, emoji, opts, context));
}
async function reactMessageTelegramWithContext(chatIdInput, messageIdInput, emoji, opts, context) {
	const { api } = context;
	const { chatId, messageId, request } = await prepareTelegramOutbound({
		to: chatIdInput,
		context,
		opts,
		messageIdInput,
		request: {
			kind: "standard",
			shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "react" })
		}
	});
	const remove = opts.remove === true;
	const trimmedEmoji = emoji.trim();
	const reactionEmoji = resolveTelegramReactionEmoji(trimmedEmoji) ?? trimmedEmoji;
	const reactions = remove || !trimmedEmoji ? [] : /^\d+$/.test(trimmedEmoji) ? [{
		type: "custom_emoji",
		custom_emoji_id: trimmedEmoji
	}] : [{
		type: "emoji",
		emoji: reactionEmoji
	}];
	if (typeof api.setMessageReaction !== "function") throw new Error("Telegram reactions are unavailable in this bot API.");
	try {
		await request(() => api.setMessageReaction(chatId, messageId, reactions), "reaction");
	} catch (err) {
		const msg = formatErrorMessage(err);
		if (/REACTION_INVALID/i.test(msg)) return {
			ok: false,
			warning: `Reaction unavailable: ${trimmedEmoji}`
		};
		throw err;
	}
	return { ok: true };
}
async function deleteMessageTelegram(chatIdInput, messageIdInput, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, deleteMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context));
}
async function deleteMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
	const { api } = context;
	const { chatId, messageId, request } = await prepareTelegramOutbound({
		to: chatIdInput,
		context,
		opts,
		messageIdInput,
		request: {
			kind: "standard",
			shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "delete" })
		}
	});
	try {
		await request(() => api.deleteMessage(chatId, messageId), "deleteMessage", { shouldLog: (err) => !isTelegramMessageDeleteNoopError(err) });
	} catch (err) {
		if (!isTelegramMessageDeleteNoopError(err)) throw err;
		const detail = formatErrorMessage(err);
		logVerbose(`[telegram] Delete skipped for message ${messageId} in chat ${chatId}: ${detail}`);
		return {
			ok: false,
			warning: `Message ${messageId} was not deleted: ${detail}`
		};
	}
	logVerbose(`[telegram] Deleted message ${messageId} from chat ${chatId}`);
	return { ok: true };
}
async function pinMessageTelegram(chatIdInput, messageIdInput, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, pinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context));
}
async function pinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
	const { api } = context;
	const { chatId, messageId, request } = await prepareTelegramOutbound({
		to: chatIdInput,
		context,
		opts,
		messageIdInput,
		request: { kind: "standard" }
	});
	await request(() => api.pinChatMessage(chatId, messageId, { disable_notification: opts.notify !== true }), "pinChatMessage");
	logVerbose(`[telegram] Pinned message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
async function unpinMessageTelegram(chatIdInput, messageIdInput, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, unpinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context));
}
async function unpinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
	const { api } = context;
	const { chatId, messageId, request } = await prepareTelegramOutbound({
		to: chatIdInput,
		context,
		opts,
		...messageIdInput !== void 0 ? { messageIdInput } : {},
		request: { kind: "standard" }
	});
	await request(() => api.unpinChatMessage(chatId, messageId), "unpinChatMessage");
	logVerbose(`[telegram] Unpinned ${messageId != null ? `message ${messageId}` : "active message"} in chat ${chatId}`);
	return {
		ok: true,
		chatId,
		...messageId != null ? { messageId: String(messageId) } : {}
	};
}
//#endregion
//#region extensions/telegram/src/send-forum-topics.ts
async function editForumTopicTelegram(chatIdInput, messageThreadIdInput, opts) {
	const nameProvided = opts.name !== void 0;
	const trimmedName = opts.name?.trim();
	if (nameProvided && !trimmedName) throw new Error("Telegram forum topic name is required");
	if (trimmedName && Array.from(trimmedName).length > 128) throw new Error("Telegram forum topic name must be 128 characters or fewer");
	const iconProvided = opts.iconCustomEmojiId !== void 0;
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	if (iconProvided && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic icon custom emoji ID is required");
	if (!trimmedName && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic update requires a name or iconCustomEmojiId");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, editForumTopicTelegramWithContext(chatIdInput, messageThreadIdInput, opts, context));
}
async function editForumTopicTelegramWithContext(chatIdInput, messageThreadIdInput, opts, context) {
	const trimmedName = opts.name?.trim();
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	const { cfg, account, api } = context;
	const rawTarget = String(chatIdInput);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: parseTelegramTarget(rawTarget).chatId,
		persistTarget: rawTarget,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const messageThreadId = normalizeMessageId(messageThreadIdInput);
	const requestWithDiag = createTelegramRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const payload = {
		...trimmedName ? { name: trimmedName } : {},
		...trimmedIconCustomEmojiId ? { icon_custom_emoji_id: trimmedIconCustomEmojiId } : {}
	};
	await requestWithDiag(() => api.editForumTopic(chatId, messageThreadId, payload), "editForumTopic");
	logVerbose(`[telegram] Edited forum topic ${messageThreadId} in chat ${chatId}`);
	return {
		ok: true,
		chatId,
		messageThreadId,
		...trimmedName ? { name: trimmedName } : {},
		...trimmedIconCustomEmojiId ? { iconCustomEmojiId: trimmedIconCustomEmojiId } : {}
	};
}
async function renameForumTopicTelegram(chatIdInput, messageThreadIdInput, name, opts) {
	const result = await editForumTopicTelegram(chatIdInput, messageThreadIdInput, {
		...opts,
		name
	});
	return {
		ok: true,
		chatId: result.chatId,
		messageThreadId: result.messageThreadId,
		name: result.name ?? name.trim()
	};
}
/**
* Create a forum topic in a Telegram supergroup.
* Requires the bot to have `can_manage_topics` permission.
*
* @param chatId - Supergroup chat ID
* @param name - Topic name (1-128 characters)
* @param opts - Optional configuration
*/
async function createForumTopicTelegram(chatId, name, opts) {
	if (!name?.trim()) throw new Error("Forum topic name is required");
	const trimmedName = name.trim();
	if (Array.from(trimmedName).length > 128) throw new Error("Forum topic name must be 128 characters or fewer");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, createForumTopicTelegramWithContext(chatId, name, opts, context));
}
async function createForumTopicTelegramWithContext(chatId, name, opts, context) {
	const trimmedName = name.trim();
	const { cfg, account, api } = context;
	const normalizedChatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: parseTelegramTarget(chatId).chatId,
		persistTarget: chatId,
		verbose: opts.verbose,
		gatewayClientScopes: opts.gatewayClientScopes
	});
	const requestWithDiag = createTelegramNonIdempotentRequestWithDiag({
		cfg,
		account,
		retry: opts.retry,
		verbose: opts.verbose
	});
	const extra = {};
	if (opts.iconColor != null) extra.icon_color = opts.iconColor;
	if (opts.iconCustomEmojiId?.trim()) extra.icon_custom_emoji_id = opts.iconCustomEmojiId.trim();
	const hasExtra = Object.keys(extra).length > 0;
	const result = await requestWithDiag(() => api.createForumTopic(normalizedChatId, trimmedName, hasExtra ? extra : void 0), "createForumTopic");
	const topicId = result.message_thread_id;
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return {
		topicId,
		name: result.name ?? trimmedName,
		chatId: normalizedChatId
	};
}
//#endregion
//#region extensions/telegram/src/telegram-text-delivery.ts
function plainPage(text) {
	return {
		plainText: text,
		sourceText: text,
		sourceTextMode: "markdown"
	};
}
function fallbackPage(text) {
	return {
		plainText: text,
		sourceText: escapeTelegramHtml(text),
		sourceTextMode: "html"
	};
}
function planTelegramTextDeliveryPages(params) {
	const maxChars = Math.max(1, Math.floor(params.maxChars));
	if (params.richMessages && params.textMode !== "html" && params.textMode !== "plain") {
		if (params.richMessage) {
			const skipEntityDetection = params.richMessage.skip_entity_detection === true;
			const pages = splitTelegramRichBlocks(params.richMessage.blocks, { textLimit: maxChars }).map((blocks, index) => {
				const plan = buildTelegramRichBlocksPlan(blocks, { skipEntityDetection });
				const degradationReasons = index === 0 ? params.degradationReasons : void 0;
				return {
					plainText: plan.plainText,
					sourceText: plan.plainText,
					sourceTextMode: "markdown",
					richMessage: plan.richMessage,
					degradationReasons
				};
			});
			if (pages.length === 0 && params.text.trim()) return [{
				plainText: params.text,
				sourceText: params.text,
				sourceTextMode: "markdown",
				richMessage: {
					blocks: [{
						type: "paragraph",
						text: params.text
					}],
					...skipEntityDetection ? { skip_entity_detection: true } : {}
				},
				...params.degradationReasons?.length ? { degradationReasons: params.degradationReasons } : {}
			}];
			return pages;
		}
		const richPlan = buildTelegramRichMarkdownPlan(params.text, {
			tableMode: params.tableMode,
			skipEntityDetection: params.skipEntityDetection
		});
		if (richPlan.richMessage.blocks.length === 0 && params.text.trim()) return [plainPage(params.text)];
		return splitTelegramRichMessageTextChunks({
			plan: richPlan,
			textLimit: maxChars
		}).map((chunk) => ({
			plainText: chunk.plainText,
			sourceText: chunk.plainText,
			sourceTextMode: "markdown",
			richMessage: chunk.richMessage,
			degradationReasons: chunk.degradationReasons
		}));
	}
	if (params.textMode === "plain") return splitTelegramPlainTextChunks(params.text, maxChars).map((text, index) => index === 0 ? text.trimEnd() : text.trim()).filter(Boolean).map(plainPage);
	if (params.textMode === "html") {
		const plainText = telegramHtmlToPlainTextFallback(params.text);
		try {
			const normalizedHtml = params.text.replace(/<br\s*\/?>/giu, "\n");
			const chunks = splitTelegramHtmlChunks(normalizedHtml, maxChars);
			return chunks.map((htmlText) => ({
				htmlText,
				plainText: chunks.length === 1 ? plainText : telegramHtmlToPlainTextFallback(htmlText),
				sourceText: htmlText,
				sourceTextMode: "html",
				fullSourceText: normalizedHtml
			}));
		} catch (error) {
			params.warn?.(`telegram HTML chunk planning failed; sending plain text: ${String(error)}`);
			return splitTelegramPlainTextChunks(plainText, maxChars).map(plainPage);
		}
	}
	const markdownParts = params.chunkMode === "newline" ? chunkMarkdownTextWithMode(params.text, maxChars, params.chunkMode) : [params.text];
	const pages = [];
	for (const markdown of markdownParts) {
		const chunks = markdownToTelegramChunks(markdown, maxChars, { tableMode: params.tableMode });
		if (!chunks.length && markdown) {
			const htmlText = wrapFileReferencesInHtml(markdownToTelegramHtml(markdown, {
				tableMode: params.tableMode,
				wrapFileRefs: false
			}));
			pages.push({
				htmlText,
				plainText: markdown,
				sourceText: htmlText,
				sourceTextMode: "html"
			});
			continue;
		}
		pages.push(...chunks.map((chunk) => ({
			htmlText: chunk.html,
			plainText: telegramHtmlToPlainTextFallback(chunk.html),
			sourceText: chunk.html,
			sourceTextMode: "html"
		})));
	}
	return pages;
}
async function* sendTelegramTextPageParts(params) {
	const { page } = params;
	if (!page.richMessage && !page.htmlText) {
		yield {
			result: await params.sender.sendPlain(page.plainText),
			page
		};
		return;
	}
	if (page.richMessage) warnTelegramRichBlocksDegradations({
		context: params.context,
		reasons: page.degradationReasons ?? [],
		warn: params.warn
	});
	const delivery = await withTelegramPlainFallback({
		kind: page.richMessage ? "rich" : "html",
		context: params.context,
		plainText: page.plainText,
		warn: params.warn,
		...page.richMessage ? { limit: params.fallbackLimit } : {},
		sendFormatted: async () => ({ result: page.richMessage ? await params.sender.sendRich(page.richMessage) : await params.sender.sendHtml(page.htmlText) }),
		sendPlain: async (plan, label) => ({
			chunks: page.richMessage ? plan.chunks : [plan.plainText],
			label
		})
	});
	if ("result" in delivery) {
		yield {
			result: delivery.result,
			page
		};
		return;
	}
	for (const [index, text] of delivery.chunks.entries()) yield {
		result: await params.sender.sendPlain(text, page.richMessage ? {
			index,
			count: delivery.chunks.length
		} : void 0, delivery.label),
		page: fallbackPage(text)
	};
}
async function deliverTelegramTextPage(params) {
	const delivered = [];
	for await (const part of sendTelegramTextPageParts(params)) delivered.push(part);
	return delivered;
}
//#endregion
//#region extensions/telegram/src/send-edit.ts
async function editMessageReplyMarkupTelegram(chatIdInput, messageIdInput, buttons, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, editMessageReplyMarkupTelegramWithContext(chatIdInput, messageIdInput, buttons, opts, context));
}
async function editMessageReplyMarkupTelegramWithContext(chatIdInput, messageIdInput, buttons, opts, context) {
	const { api } = context;
	const { chatId, messageId, request } = await prepareTelegramOutbound({
		to: chatIdInput,
		context,
		opts,
		messageIdInput,
		request: { kind: "standard" }
	});
	const replyMarkup = buildInlineKeyboard(buttons) ?? { inline_keyboard: [] };
	try {
		await request(() => api.editMessageReplyMarkup(chatId, messageId, { reply_markup: replyMarkup }), "editMessageReplyMarkup", { shouldLog: (err) => !isTelegramMessageNotModifiedError(err) });
	} catch (err) {
		if (!isTelegramMessageNotModifiedError(err)) throw err;
	}
	logVerbose(`[telegram] Edited reply markup for message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
async function editMessageTelegram(chatIdInput, messageIdInput, text, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, editMessageTelegramWithContext(chatIdInput, messageIdInput, text, opts, context));
}
async function editMessageTelegramWithContext(chatIdInput, messageIdInput, text, opts, context) {
	const { cfg, account, api } = context;
	const { chatId, messageId, request } = await prepareTelegramOutbound({
		to: chatIdInput,
		context,
		opts,
		messageIdInput,
		request: {
			kind: "standard",
			shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "edit" }) || isTelegramServerError(err)
		}
	});
	const requestWithEditShouldLog = (fn, label, shouldLog) => request(fn, label, shouldLog ? { shouldLog } : void 0);
	const textMode = opts.textMode ?? "markdown";
	const linkPreviewEnabled = opts.linkPreview ?? account.config.linkPreview ?? true;
	const useRichMessages = account.config.richMessages === true && textMode !== "html";
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		supportsBlockTables: useRichMessages
	});
	const htmlText = renderTelegramHtmlText(text, {
		textMode,
		tableMode
	});
	const plainText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : text;
	const shouldTouchButtons = opts.buttons !== void 0;
	const builtKeyboard = shouldTouchButtons ? buildInlineKeyboard(opts.buttons) : void 0;
	const replyMarkup = shouldTouchButtons ? builtKeyboard ?? { inline_keyboard: [] } : void 0;
	const commonTextParams = {
		...linkPreviewEnabled ? {} : { link_preview_options: { is_disabled: true } },
		...replyMarkup === void 0 ? {} : { reply_markup: replyMarkup }
	};
	const captionEditParams = {
		caption: htmlText,
		parse_mode: "HTML"
	};
	if (replyMarkup !== void 0) captionEditParams.reply_markup = replyMarkup;
	const plainCaptionParams = { caption: plainText };
	if (replyMarkup !== void 0) plainCaptionParams.reply_markup = replyMarkup;
	const performTextEdit = async () => {
		const richPlan = useRichMessages ? buildTelegramRichMarkdownPlan(text, {
			tableMode,
			skipEntityDetection: !linkPreviewEnabled
		}) : void 0;
		const page = richPlan?.richMessage.blocks.length ? {
			...richPlan,
			sourceText: richPlan.plainText,
			sourceTextMode: "markdown"
		} : planTelegramTextDeliveryPages({
			text: textMode === "html" ? htmlText : text,
			maxChars: Number.MAX_SAFE_INTEGER,
			tableMode,
			richMessages: useRichMessages,
			skipEntityDetection: !linkPreviewEnabled,
			...textMode === "html" ? { textMode: "html" } : {}
		})[0];
		if (!page) throw new Error("telegram editMessage failed: empty text");
		const edit = (fn, label = "editMessage") => requestWithEditShouldLog(fn, label, (err) => !isTelegramMessageNotModifiedError(err));
		const [accepted] = await deliverTelegramTextPage({
			page,
			context: "editMessage",
			warn: (message) => sendLogger.warn(message),
			fallbackLimit: Number.MAX_SAFE_INTEGER,
			sender: {
				sendPlain: (value, _fallback, label) => edit(() => Object.keys(commonTextParams).length ? api.editMessageText(chatId, messageId, value, commonTextParams) : api.editMessageText(chatId, messageId, value), label),
				sendHtml: (value) => edit(() => api.editMessageText(chatId, messageId, value, {
					parse_mode: "HTML",
					...commonTextParams
				})),
				sendRich: (richMessage) => edit(() => getTelegramRichRawApi(api).editMessageText({
					chat_id: chatId,
					message_id: messageId,
					rich_message: richMessage,
					...commonTextParams
				}))
			}
		});
		return accepted.result;
	};
	const performCaptionEdit = () => withTelegramPlainFallback({
		kind: "html",
		context: "editMessageCaption",
		plainText,
		warn: (message) => sendLogger.warn(message),
		sendFormatted: () => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, captionEditParams), "editMessageCaption", (err) => !isTelegramMessageNotModifiedError(err)),
		sendPlain: (_plan, label) => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, plainCaptionParams), label, (plainErr) => !isTelegramMessageNotModifiedError(plainErr))
	});
	let editedMessage;
	try {
		const editMode = opts.editMode ?? "text";
		if (editMode === "caption") editedMessage = await performCaptionEdit();
		else try {
			editedMessage = await performTextEdit();
		} catch (err) {
			if (editMode === "auto" && isTelegramMessageHasNoTextError(err)) editedMessage = await performCaptionEdit();
			else throw err;
		}
	} catch (err) {
		if (isTelegramMessageNotModifiedError(err)) {} else throw err;
	}
	if (editedMessage && editedMessage !== true && typeof editedMessage.message_id === "number") {
		const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
		const successfulSendThread = resolveTelegramMessageThreadSpec(editedMessage);
		await recordOutboundMessageForPromptContext({
			cfg,
			account,
			chatId,
			message: editedMessage,
			messageId: editedMessage.message_id,
			recordGroupHistory: false,
			successfulSendThread,
			...botUserId !== void 0 ? { botUserId } : {},
			...editedMessage.message_thread_id !== void 0 ? { messageThreadId: editedMessage.message_thread_id } : {}
		});
	}
	logVerbose(`[telegram] Edited message ${messageId} in chat ${chatId}`);
	return {
		ok: true,
		messageId: String(messageId),
		chatId
	};
}
//#endregion
//#region extensions/telegram/src/send-location.ts
/** Send a standalone location pin or named venue through Telegram's native payload. */
async function sendLocationTelegram(to, input, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendLocationTelegramWithContext(to, input, opts, context));
}
async function sendLocationTelegramWithContext(to, input, opts, context) {
	const location = normalizeOutboundLocation(input);
	if (!location) throw new Error("Telegram location is required.");
	const hasName = Boolean(location.name);
	if (hasName !== Boolean(location.address)) throw new Error("Telegram venues require both location.name and location.address.");
	const { account, api } = context;
	const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
	const prepared = await prepareTelegramOutbound({
		to,
		context,
		opts,
		thread: {
			messageThreadId: opts.messageThreadId,
			replyToMessageId: opts.replyToMessageId,
			replyQuoteText: opts.quoteText,
			useReplyIdAsQuoteSource: true
		},
		request: { kind: "nonIdempotent" }
	});
	const replyMarkup = buildInlineKeyboard(opts.buttons);
	const commonParams = {
		...prepared.threadParams,
		...replyMarkup ? { reply_markup: replyMarkup } : {},
		...opts.silent === true ? { disable_notification: true } : {}
	};
	const label = hasName ? "venue" : "location";
	const delivery = await withTelegramNativeQuoteFallback({
		label,
		requestParams: commonParams,
		request: async (effectiveParams, retryLabel) => {
			await opts.onPlatformSendDispatch?.();
			return await prepared.request(() => hasName ? api.sendVenue(prepared.chatId, location.latitude, location.longitude, location.name ?? "", location.address ?? "", effectiveParams) : api.sendLocation(prepared.chatId, location.latitude, location.longitude, {
				...effectiveParams,
				...location.accuracy !== void 0 ? { horizontal_accuracy: location.accuracy } : {}
			}), retryLabel);
		}
	});
	const result = delivery.result;
	const acceptedParams = toAcceptedThreadScopedParams(delivery.acceptedParams);
	return finalizeTelegramOutbound({
		context,
		prepared,
		result,
		resultContext: `${label} send`,
		...botUserId !== void 0 ? { botUserId } : {},
		text: formatLocationText(location),
		...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {},
		promptContextProjectionPlan: opts.promptContextProjectionPlan,
		onDeliveryResult: opts.onDeliveryResult,
		beforeActivity: ({ messageId, chatId }) => logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId,
			messageId,
			operation: hasName ? "sendVenue" : "sendLocation",
			deliveryKind: label,
			messageThreadId: acceptedParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent
		})
	});
}
//#endregion
//#region extensions/telegram/src/send-error-predicates.ts
const TELEGRAM_CAPTION_TOO_LONG_RE = /caption is too long/i;
const TELEGRAM_PHOTO_LIMIT_ERROR_RE = /\b(?:PHOTO_INVALID_DIMENSIONS|PHOTO_TOO_BIG)\b/i;
const TELEGRAM_VOICE_FORBIDDEN_MARKER = "VOICE_MESSAGES_FORBIDDEN";
function resolveTelegramErrorDescription(error) {
	return isRecord(error) && typeof error.description === "string" ? error.description : formatErrorMessage(error);
}
function isTelegramCaptionTooLongError(error) {
	return TELEGRAM_CAPTION_TOO_LONG_RE.test(resolveTelegramErrorDescription(error));
}
function isTelegramPhotoLimitError(error) {
	return TELEGRAM_PHOTO_LIMIT_ERROR_RE.test(resolveTelegramErrorDescription(error));
}
function isTelegramVoiceMessagesForbiddenError(error) {
	return resolveTelegramErrorDescription(error).includes(TELEGRAM_VOICE_FORBIDDEN_MARKER);
}
//#endregion
//#region extensions/telegram/src/voice.ts
function resolveTelegramVoiceDecision(opts) {
	if (!opts.wantsVoice) return { useVoice: false };
	if (isVoiceMessageCompatibleAudio(opts)) return { useVoice: true };
	return {
		useVoice: false,
		reason: `media is ${opts.contentType ?? "unknown"} (${opts.fileName ?? "unknown"})`
	};
}
function resolveTelegramVoiceSend(opts) {
	const decision = resolveTelegramVoiceDecision(opts);
	if (decision.reason && opts.logFallback) opts.logFallback(`Telegram voice requested but ${decision.reason}; sending as audio file instead.`);
	return { useVoice: decision.useVoice };
}
//#endregion
//#region extensions/telegram/src/outbound-media.ts
function resolveTelegramOutboundMediaFilename(params) {
	if (params.fileName) return params.fileName;
	if (params.isGif) return "animation.gif";
	const basename = params.kind === "image" || params.kind === "video" || params.kind === "audio" ? params.kind : "file";
	const defaultExtension = params.kind === "image" ? ".jpg" : params.kind === "video" ? ".mp4" : params.kind === "audio" ? ".ogg" : ".bin";
	return `${basename}${extensionForMime(params.contentType) ?? defaultExtension}`;
}
function prepareTelegramOutboundMedia(params) {
	const kind = kindFromMime(params.media.contentType ?? void 0);
	const isGif = isGifMedia({
		contentType: params.media.contentType,
		fileName: params.media.fileName
	});
	const deliveryKind = params.forceDocument === true && (kind === "image" || kind === "video") ? "document" : kind;
	if (params.asVideoNote === true && deliveryKind !== "video") throw new Error("Telegram video notes require video media.");
	const isVideoNote = deliveryKind === "video" && params.asVideoNote === true;
	const fileName = resolveTelegramOutboundMediaFilename({
		fileName: params.media.fileName,
		contentType: params.media.contentType,
		kind,
		isGif
	});
	const text = params.text;
	const trimmedText = text?.trim();
	const renderedCaption = !isVideoNote && trimmedText ? params.preparedHtml === true && params.textMode === "html" ? trimmedText : renderTelegramHtmlText(trimmedText, {
		textMode: params.textMode ?? "markdown",
		tableMode: params.tableMode
	}) : void 0;
	const { caption, followUpText } = isVideoNote ? {
		caption: void 0,
		followUpText: trimmedText ? text : void 0
	} : splitTelegramCaption(text, renderedCaption);
	const htmlCaption = caption ? renderedCaption : void 0;
	return {
		kind,
		deliveryKind,
		isGif,
		isVideoNote,
		fileName,
		file: new InputFile(params.media.buffer, fileName),
		caption,
		htmlCaption,
		plainCaption: resolveTelegramPlainCaption(caption && params.textMode === "html" ? telegramHtmlToPlainTextFallback(caption) : caption, htmlCaption),
		followUpText
	};
}
function resolveTelegramOutboundMediaSenders(params) {
	const createSender = (label) => {
		const operation = `send${label.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
		const method = params.api[operation];
		return {
			label,
			operation,
			send: (effectiveParams) => method.call(params.api, params.chatId, params.plan.file, label === "document" && params.forceDocument ? {
				...effectiveParams,
				disable_content_type_detection: true
			} : effectiveParams)
		};
	};
	const documentSender = createSender("document");
	let label = "document";
	if (params.plan.isGif && params.plan.deliveryKind !== "document") label = "animation";
	else if (params.plan.deliveryKind === "image" && !params.plan.isGif && params.sendImageAsPhoto !== false) label = "photo";
	else if (params.plan.deliveryKind === "video") label = params.plan.isVideoNote ? "video_note" : "video";
	else if (params.plan.kind === "audio") {
		const { useVoice } = resolveTelegramVoiceSend({
			wantsVoice: params.asVoice === true,
			contentType: params.media.contentType,
			fileName: params.plan.fileName,
			logFallback: logVerbose
		});
		label = useVoice ? "voice" : "audio";
	}
	return {
		sender: label === "document" ? documentSender : createSender(label),
		documentSender
	};
}
async function sendTelegramCaptionedMediaWithFallback(params) {
	const requestCaption = typeof params.requestParams.caption === "string" ? params.requestParams.caption : void 0;
	const sendCaptionless = async () => {
		const captionlessParams = { ...params.requestParams };
		delete captionlessParams.caption;
		delete captionlessParams.parse_mode;
		return {
			result: await params.send(captionlessParams, params.shouldLog),
			...requestCaption !== void 0 ? { captionRemoved: true } : {}
		};
	};
	try {
		return {
			result: await params.send(params.requestParams, (err) => !isTelegramHtmlParseError(err) && !isTelegramEmptyContentError(err) && (params.shouldLog?.(err) ?? true)),
			...requestCaption !== void 0 ? { deliveredCaption: params.plainCaption ?? requestCaption } : {}
		};
	} catch (err) {
		if (isTelegramEmptyContentError(err) && requestCaption !== void 0) return await sendCaptionless();
		if (!isTelegramHtmlParseError(err) || !params.plainCaption) throw err;
		logVerbose(`telegram ${params.operation} caption HTML rejected; retrying as plain caption: ${formatErrorMessage(err)}`);
		const plainParams = {
			...params.requestParams,
			caption: params.plainCaption
		};
		delete plainParams.parse_mode;
		try {
			return {
				result: await params.send(plainParams, (plainError) => !isTelegramEmptyContentError(plainError) && (params.shouldLog?.(plainError) ?? true)),
				deliveredCaption: params.plainCaption
			};
		} catch (plainError) {
			if (!isTelegramEmptyContentError(plainError)) throw plainError;
			return await sendCaptionless();
		}
	}
}
async function sendTelegramOutboundMediaWithPhotoFallback(params) {
	try {
		return {
			result: await params.send(params.sender),
			sender: params.sender
		};
	} catch (error) {
		if (params.sender.label !== "photo" || !isTelegramPhotoLimitError(error)) throw error;
		logVerbose(`telegram sendPhoto exceeded photo limits; retrying as document: ${formatErrorMessage(error)}`);
		return {
			result: await params.send(params.documentSender),
			sender: params.documentSender
		};
	}
}
//#endregion
//#region extensions/telegram/src/send-message-text.ts
function buildTelegramTextSendReceipt(params) {
	if (params.results.length === 0) return;
	if (params.results.length === 1) return params.results[0]?.receipt;
	const receipt = createMessageReceiptFromOutboundResults({
		results: params.results,
		kind: "text",
		...typeof params.replyToMessageId === "number" ? { replyToId: String(params.replyToMessageId) } : {}
	});
	receipt.parts = receipt.parts.map((part, index) => ({
		...part,
		index
	}));
	return receipt;
}
function createTelegramTextSender(config) {
	const { cfg, ownerAgentId, account, api, chatId, opts, replyMarkup, reportDelivery, recordDeliveredPromptContext, singleUseReplyTo, buildThreadParams, sender, textMode, tableMode, renderHtmlText, linkPreviewOptions, useRichMessages } = config;
	const shouldIncludeReply = (index, count, alreadyUsed) => !alreadyUsed && (!singleUseReplyTo || count === 1 && index === 0);
	const buildTextParams = (index, count, finalPart, alreadyUsed) => {
		const thread = buildThreadParams(shouldIncludeReply(index, count, alreadyUsed));
		return Object.keys(thread).length || finalPart && replyMarkup ? {
			...thread,
			...finalPart && replyMarkup ? { reply_markup: replyMarkup } : {}
		} : void 0;
	};
	const createTextDelivery = (context, beforeFirstAccepted) => {
		const start = sender.parts.length;
		let lastAcceptedParams;
		let acceptedReplyToMessageId;
		const deliveryResults = [];
		let pendingChunk;
		let finalMeta;
		const flushChunk = async (chunk, finalPart) => {
			let keyboardError;
			if (finalPart && replyMarkup && !chunk.hasInlineKeyboard) try {
				await api.editMessageReplyMarkup(chunk.reportChatId, chunk.messageId, { reply_markup: replyMarkup });
				finalMeta = {
					telegramDeliveredText: chunk.plainText,
					telegramHasInlineKeyboard: true
				};
			} catch (error) {
				keyboardError = error;
			}
			await recordDeliveredPromptContext({
				message: chunk.result,
				messageId: chunk.messageId,
				text: chunk.plainText,
				...chunk.acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: chunk.acceptedParams.message_thread_id } : {}
			}, finalPart);
			if (keyboardError !== void 0) {
				if (keyboardError instanceof Error) throw keyboardError;
				throw new Error(formatErrorMessage(keyboardError));
			}
		};
		const flushPending = async (finalPart) => {
			const chunk = pendingChunk;
			pendingChunk = void 0;
			if (chunk) await flushChunk(chunk, finalPart);
		};
		const record = async (params) => {
			const { messageId } = params;
			lastAcceptedParams = params.acceptedParams;
			acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(params.acceptedParams);
			if (sender.parts.length === start + 1) await beforeFirstAccepted?.();
			recordSentMessage(chatId, messageId, cfg, {
				accountId: account.accountId,
				agentId: ownerAgentId
			});
			await reportDelivery(messageId, params.result?.chat?.id ?? chatId, params.result, {
				telegramDeliveredText: params.plainText,
				telegramHasInlineKeyboard: params.hasInlineKeyboard
			}, "text", (delivery) => deliveryResults.push(delivery));
			const previousChunk = pendingChunk;
			pendingChunk = {
				result: params.result,
				messageId,
				acceptedParams: params.acceptedParams,
				plainText: params.plainText,
				reportChatId: params.result?.chat?.id ?? chatId,
				hasInlineKeyboard: params.hasInlineKeyboard
			};
			if (previousChunk) await flushChunk(previousChunk, false);
		};
		const finish = async (operation) => {
			await flushPending(true);
			const parts = sender.parts.slice(start);
			const last = parts.at(-1);
			const lastMessageId = last ? String(last.messageId) : "";
			const lastChatId = String(last?.result.chat?.id ?? chatId);
			if (lastMessageId) logTelegramOutboundSendOk({
				accountId: account.accountId,
				chatId: lastChatId,
				messageId: lastMessageId,
				operation,
				deliveryKind: "text",
				messageThreadId: lastAcceptedParams?.message_thread_id,
				replyToMessageId: opts.replyToMessageId,
				silent: opts.silent,
				chunkCount: parts.length
			});
			const receipt = buildTelegramTextSendReceipt({
				results: deliveryResults,
				replyToMessageId: acceptedReplyToMessageId
			});
			return {
				messageId: lastMessageId,
				chatId: lastChatId,
				...receipt ? { receipt } : {},
				...finalMeta ? { meta: finalMeta } : {}
			};
		};
		const partialDeliveryResult = () => {
			const receipt = buildTelegramTextSendReceipt({
				results: deliveryResults,
				replyToMessageId: acceptedReplyToMessageId
			});
			return {
				messageIds: sender.parts.slice(start).map((part) => String(part.messageId)),
				...receipt ? { receipt } : {},
				visibleReplySent: true
			};
		};
		const fail = async (error) => {
			try {
				await flushPending(false);
			} catch (flushError) {
				sendLogger.warn(`telegram ${context} delivery bookkeeping cleanup failed: ${formatErrorMessage(flushError)}`);
			}
			return sender.fail(error, start, partialDeliveryResult());
		};
		return {
			record,
			finish,
			fail,
			partialDeliveryResult
		};
	};
	const sendChunkedText = async (rawText, context, options = {}) => {
		const delivery = createTextDelivery(context, options.beforeFirstAccepted);
		const tracking = {
			invalidate: () => opts.promptContextProjectionPlan?.cursor.invalidate(),
			onRejected: (error) => logVerbose(`telegram ${context} text chunk rejected; continuing: ${formatErrorMessage(error)}`),
			onSilentSkip: (error) => logVerbose(`telegram ${context} text chunk rendered empty; skipping: ${formatErrorMessage(error)}`),
			partialDeliveryResult: delivery.partialDeliveryResult
		};
		const alreadyUsed = options.replyToAlreadyUsed === true;
		const maxChars = useRichMessages ? resolveTelegramTextChunkLimit({
			cfg,
			accountId: account.accountId
		}) : 4e3;
		const pages = planTelegramTextDeliveryPages({
			text: textMode === "html" ? renderHtmlText(rawText) : rawText,
			maxChars,
			tableMode,
			richMessages: useRichMessages,
			skipEntityDetection: account.config.linkPreview === false,
			...textMode === "html" ? { textMode: "html" } : {},
			warn: (message) => sendLogger.warn(message)
		});
		try {
			await sender.sendText({
				pages,
				context,
				tracking,
				drainFallback: true,
				observe: delivery.record,
				preparePage: (index) => ({ requestParams: (fallback) => ({
					...buildTextParams(fallback && pages.length === 1 ? fallback.index : index, Math.max(pages.length, fallback?.count ?? pages.length), index === pages.length - 1 && (!fallback || fallback.index === fallback.count - 1), alreadyUsed),
					...linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {},
					...opts.silent === true ? { disable_notification: true } : {}
				}) })
			});
			return await delivery.finish(useRichMessages ? "sendRichMessage" : "sendMessage");
		} catch (error) {
			if (isChannelPartialDeliveryError(error) || !isTelegramEmptyContentError(error)) opts.promptContextProjectionPlan?.cursor.invalidate();
			return await delivery.fail(error);
		}
	};
	return { sendChunkedText };
}
//#endregion
//#region extensions/telegram/src/chunk-delivery.ts
const TELEGRAM_TERMINAL_BAD_REQUEST_RE = /\b(?:chat|message thread) not found\b/i;
function mergeTelegramPartialDeliveryError(error, priorDeliveryResult) {
	if (!isChannelPartialDeliveryError(error)) return createChannelPartialDeliveryError(error, priorDeliveryResult);
	const currentDeliveryResult = error.deliveryResult;
	const messageIds = [.../* @__PURE__ */ new Set([...priorDeliveryResult.messageIds ?? [], ...currentDeliveryResult.messageIds ?? []])];
	return createChannelPartialDeliveryError(error, {
		...priorDeliveryResult,
		...currentDeliveryResult,
		...messageIds.length > 0 ? { messageIds } : {},
		visibleReplySent: true
	});
}
function isTelegramSkippableChunkSendError(error) {
	if (isSafeToRetrySendError(error)) return true;
	return isTelegramBadRequestError(error) && !TELEGRAM_TERMINAL_BAD_REQUEST_RE.test(formatErrorMessage(error));
}
function createTelegramChunkDeliveryTracker(params) {
	let acceptedCount = 0;
	let firstRejectedError;
	let firstSilentSkipError;
	const throwAfterAccepted = (error) => {
		if (acceptedCount === 0) throw error;
		throw mergeTelegramPartialDeliveryError(error, params.partialDeliveryResult());
	};
	const reject = (error) => {
		if (params.isSilentSkip?.(error)) {
			firstSilentSkipError ??= error;
			params.onSilentSkip?.(error);
			return "silent-skip";
		}
		if (!isTelegramSkippableChunkSendError(error)) throwAfterAccepted(error);
		firstRejectedError ??= error;
		params.invalidate();
		params.onRejected(error);
		return "rejected";
	};
	const recordAccepted = async (result, record) => {
		acceptedCount += 1;
		try {
			await record(result);
		} catch (error) {
			throwAfterAccepted(error);
		}
	};
	return {
		async attempt(send, record) {
			let result;
			try {
				result = await send();
			} catch (error) {
				return reject(error);
			}
			await recordAccepted(result, record);
			return "accepted";
		},
		recordAccepted,
		reject,
		fail: throwAfterAccepted,
		finish() {
			if (firstRejectedError !== void 0) throwAfterAccepted(firstRejectedError);
			if (acceptedCount === 0 && firstSilentSkipError !== void 0) throwAfterAccepted(firstSilentSkipError);
		}
	};
}
//#endregion
//#region extensions/telegram/src/send-prepared.ts
function createTelegramReplyRequest(runtime) {
	const retry = createChannelApiRetryRunner({
		shouldRetry: shouldRetryTelegramSendError,
		strictShouldRetry: true,
		retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS
	});
	return (send, operation, options) => withTelegramApiErrorLogging({
		operation,
		runtime,
		shouldLog: options?.shouldLog,
		fn: () => retry(send, operation)
	}).catch(rethrowTelegramSendError);
}
function createTelegramPreparedSender(config) {
	const parts = [];
	const fail = (error, start = 0, details) => {
		if (parts.length === start) throw error;
		throw mergeTelegramPartialDeliveryError(error, {
			...details,
			messageIds: parts.slice(start).map((part) => String(part.messageId)),
			visibleReplySent: true
		});
	};
	const recordAcceptance = (part) => {
		const accepted = {
			...part,
			messageId: resolveTelegramMessageIdOrThrow(part.result, "send")
		};
		parts.push(accepted);
		return accepted;
	};
	const accept = async (part, observe, details) => {
		const accepted = recordAcceptance(part);
		try {
			await observe(accepted);
		} catch (error) {
			fail(error, 0, details?.());
		}
	};
	const request = (label, requestParams, send, options) => withTelegramNativeQuoteFallback({
		label,
		requestParams,
		...options?.rich ? { removeNativeQuoteParam: removeTelegramRichNativeQuoteParam } : {},
		request: (effective, operation) => config.request(() => send(effective), operation, { shouldLog: (error) => (options?.shouldLog?.(error) ?? true) && !(getTelegramNativeQuoteReplyMessageId(effective) && isTelegramQuoteParamError(error)) })
	});
	const sendText = async (params) => {
		const start = parts.length;
		const tracker = createTelegramChunkDeliveryTracker({
			...params.tracking,
			isSilentSkip: isTelegramEmptyContentError,
			partialDeliveryResult: () => ({
				...params.tracking.partialDeliveryResult?.(),
				messageIds: parts.slice(start).map((part) => String(part.messageId)),
				visibleReplySent: true
			})
		});
		let acceptedPages = 0;
		for (const [index, page] of params.pages.entries()) {
			let prepared;
			try {
				await config.beforeTextPage?.();
				prepared = params.preparePage(index, acceptedPages);
			} catch (error) {
				tracker.reject(error);
				continue;
			}
			const sendPlainOrHtml = async (text, html, fallback, label = "sendMessage") => {
				const requestParams = {
					...prepared.requestParams(fallback),
					...html ? { parse_mode: "HTML" } : {}
				};
				const send = () => request(label, requestParams, (effective) => Object.keys(effective).length ? config.api.sendMessage(config.chatId, text, effective) : config.api.sendMessage(config.chatId, text), { shouldLog: (error) => !isTelegramHtmlParseError(error) && !isTelegramEmptyContentError(error) });
				let sent;
				try {
					sent = await send();
				} catch (error) {
					if (!fallback || !params.drainFallback) throw error;
					tracker.reject(error);
					return;
				}
				return {
					...sent,
					hasInlineKeyboard: Boolean(sent.acceptedParams.reply_markup)
				};
			};
			const iterator = sendTelegramTextPageParts({
				page,
				context: params.context,
				warn: config.warn,
				sender: {
					sendPlain: (text, fallback, label) => sendPlainOrHtml(text, false, fallback, label),
					sendHtml: (text) => sendPlainOrHtml(text, true),
					sendRich: async (richMessage) => {
						const rawParams = prepared.requestParams();
						const markup = rawParams.reply_markup ? { reply_markup: rawParams.reply_markup } : {};
						const sent = await request("sendRichMessage", toTelegramRichMessageContextParams(rawParams), (effective) => getTelegramRichRawApi(config.api).sendRichMessage({
							chat_id: config.chatId,
							rich_message: richMessage,
							...effective,
							...markup
						}), { rich: true });
						const acceptedParams = {
							...sent.acceptedParams,
							...markup
						};
						return {
							...sent,
							acceptedParams,
							hasInlineKeyboard: Boolean(acceptedParams.reply_markup)
						};
					}
				}
			});
			try {
				while (true) {
					let next;
					try {
						next = await iterator.next();
					} catch (error) {
						tracker.reject(error);
						break;
					}
					if (next.done) {
						acceptedPages += 1;
						prepared.delivered?.();
						break;
					}
					if (next.value.result) {
						const part = {
							...next.value.result,
							plainText: next.value.page.plainText
						};
						await tracker.recordAccepted(recordAcceptance(part), params.observe);
					}
				}
			} finally {
				await iterator.return(void 0);
			}
		}
		tracker.finish();
		return parts.slice(start);
	};
	const sendMedia = async (params) => {
		const send = async (sender) => {
			await config.beforeMedia?.();
			return sendTelegramCaptionedMediaWithFallback({
				operation: sender.operation,
				requestParams: params.requestParams,
				plainCaption: params.plainCaption,
				shouldLog: (error) => sender.label === "photo" ? !isTelegramPhotoLimitError(error) : sender.label !== "voice" || !isTelegramVoiceMessagesForbiddenError(error),
				send: (requestParams, shouldLog) => request(sender.operation, requestParams, sender.send, { shouldLog })
			});
		};
		const delivery = await sendTelegramOutboundMediaWithPhotoFallback({
			sender: params.sender,
			documentSender: params.documentSender ?? params.sender,
			send
		});
		return {
			...delivery.result.result,
			plainText: delivery.result.deliveredCaption ?? "",
			hasInlineKeyboard: Boolean(delivery.result.result.acceptedParams.reply_markup),
			captionRemoved: delivery.result.captionRemoved,
			sender: delivery.sender
		};
	};
	return {
		parts,
		accept,
		fail,
		sendText,
		sendMedia
	};
}
//#endregion
//#region extensions/telegram/src/send-message.ts
const MAX_TELEGRAM_PHOTO_DIMENSION_SUM = 1e4;
const MAX_TELEGRAM_PHOTO_ASPECT_RATIO = 20;
async function sendMessageTelegram(to, text, opts) {
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendMessageTelegramWithContext(to, text, opts, context));
}
async function sendMessageTelegramWithContext(to, text, opts, apiContext) {
	const { cfg, account, api, ownerAgentId } = apiContext;
	const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
	const { chatId, threadSpec, threadParams: preparedThreadParams, request: requestWithChatNotFound } = await prepareTelegramOutbound({
		to,
		context: apiContext,
		opts,
		thread: {
			messageThreadId: opts.messageThreadId,
			replyToMessageId: opts.replyToMessageId,
			replyQuoteText: opts.quoteText,
			useReplyIdAsQuoteSource: true
		},
		request: { kind: "nonIdempotent" }
	});
	const reportDelivery = async (messageId, deliveredChatId, message, meta, kind, onPrepared) => {
		return await reportTelegramProviderDelivery({
			message,
			messageId,
			fallbackChatId: deliveredChatId,
			successfulSendThread: threadSpec,
			...meta ? { meta } : {},
			...kind ? { kind } : {},
			...onPrepared ? { onPrepared } : {},
			onDeliveryResult: opts.onDeliveryResult
		});
	};
	const recordDeliveredPromptContext = async (params, finalPart) => {
		const plan = opts.promptContextProjectionPlan;
		const projection = plan?.cursor.take(plan.finalPart && finalPart);
		const recorded = await recordOutboundMessageForPromptContext({
			cfg,
			ownerAgentId,
			account,
			...botUserId !== void 0 ? { botUserId } : {},
			chatId,
			...threadSpec?.id !== void 0 ? { messageThreadId: threadSpec.id } : {},
			...threadSpec ? { successfulSendThread: threadSpec } : {},
			...params,
			promptContextProjection: projection
		});
		if (projection && !recorded) plan?.cursor.invalidate();
	};
	const mediaUrl = opts.mediaUrl?.trim();
	const mediaMaxBytes = opts.maxBytes ?? (typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb : 100) * 1024 * 1024;
	const replyMarkup = buildInlineKeyboard(opts.buttons);
	const singleUseReplyTo = opts.replyToIdSource === "implicit" && opts.replyToMode !== void 0 && isSingleUseReplyToMode(opts.replyToMode);
	let threadParamsWithoutReply;
	const buildThreadParams = (includeReplyTo) => {
		if (includeReplyTo) return preparedThreadParams;
		threadParamsWithoutReply ??= buildTelegramThreadReplyParams({ thread: threadSpec });
		return threadParamsWithoutReply;
	};
	const textMode = opts.textMode ?? "markdown";
	const useRichMessages = account.config.richMessages === true && textMode !== "html";
	const tableMode = opts.tableMode ?? resolveMarkdownTableMode({
		cfg,
		channel: "telegram",
		accountId: account.accountId,
		supportsBlockTables: useRichMessages
	});
	const renderHtmlText = (value) => renderTelegramHtmlText(value, {
		textMode,
		tableMode
	});
	const linkPreviewOptions = account.config.linkPreview ?? true ? void 0 : { is_disabled: true };
	const sender = createTelegramPreparedSender({
		api,
		chatId,
		warn: (message) => sendLogger.warn(message),
		request: async (send, label, options) => {
			await opts.onPlatformSendDispatch?.();
			return requestWithChatNotFound(send, label, options);
		}
	});
	const { sendChunkedText } = createTelegramTextSender({
		cfg,
		ownerAgentId,
		account,
		api,
		chatId,
		opts,
		replyMarkup,
		reportDelivery,
		recordDeliveredPromptContext,
		singleUseReplyTo,
		buildThreadParams,
		sender,
		textMode,
		tableMode,
		renderHtmlText,
		linkPreviewOptions,
		useRichMessages
	});
	async function shouldSendTelegramImageAsPhoto(buffer) {
		try {
			const metadata = await getImageMetadata(buffer);
			const width = metadata?.width;
			const height = metadata?.height;
			if (typeof width !== "number" || typeof height !== "number") {
				sendLogger.warn("Photo dimensions are unavailable. Sending as document instead.");
				return false;
			}
			const shorterSide = Math.min(width, height);
			const longerSide = Math.max(width, height);
			if (!(width + height <= MAX_TELEGRAM_PHOTO_DIMENSION_SUM && shorterSide > 0 && longerSide <= shorterSide * MAX_TELEGRAM_PHOTO_ASPECT_RATIO)) {
				sendLogger.warn(`Photo dimensions (${width}x${height}) are not valid for Telegram photos. Sending as document instead.`);
				return false;
			}
			return true;
		} catch (err) {
			sendLogger.warn(`Failed to validate photo dimensions: ${formatErrorMessage(err)}. Sending as document instead.`);
			return false;
		}
	}
	if (mediaUrl) {
		const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
			maxBytes: mediaMaxBytes,
			mediaAccess: opts.mediaAccess,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			optimizeImages: opts.forceDocument ? false : void 0
		}));
		const mediaPlan = prepareTelegramOutboundMedia({
			media,
			text,
			textMode,
			tableMode,
			forceDocument: opts.forceDocument,
			asVideoNote: opts.asVideoNote
		});
		const sendImageAsPhoto = mediaPlan.deliveryKind !== "image" || mediaPlan.isGif || await shouldSendTelegramImageAsPhoto(media.buffer);
		const { sender: mediaSender, documentSender } = resolveTelegramOutboundMediaSenders({
			api,
			chatId,
			media,
			plan: mediaPlan,
			forceDocument: opts.forceDocument,
			asVoice: opts.asVoice,
			sendImageAsPhoto
		});
		const { htmlCaption, plainCaption, followUpText } = mediaPlan;
		const needsSeparateText = Boolean(followUpText);
		const mediaThreadParams = preparedThreadParams;
		const mediaUsedReplyTo = resolveAcceptedReplyToMessageId(mediaThreadParams) !== void 0;
		const baseMediaParams = {
			...mediaThreadParams,
			...!needsSeparateText && replyMarkup ? { reply_markup: replyMarkup } : {}
		};
		const videoDimensions = mediaPlan.deliveryKind === "video" && !mediaPlan.isVideoNote ? await probeVideoDimensions(media.buffer) : void 0;
		const mediaParams = {
			...htmlCaption ? {
				caption: htmlCaption,
				parse_mode: "HTML"
			} : {},
			...baseMediaParams,
			...opts.silent === true ? { disable_notification: true } : {},
			...videoDimensions ? {
				width: videoDimensions.width,
				height: videoDimensions.height
			} : {}
		};
		let mediaDelivery;
		try {
			mediaDelivery = await sender.sendMedia({
				sender: mediaSender,
				documentSender,
				requestParams: mediaParams,
				plainCaption: htmlCaption ? plainCaption : void 0
			});
		} catch (error) {
			if (mediaSender.label === "voice" && isTelegramVoiceMessagesForbiddenError(error) && text.trim()) {
				logVerbose("telegram sendVoice forbidden by recipient privacy settings; falling back to text");
				const textResult = await sendChunkedText(text, "voice fallback text send");
				recordChannelActivity({
					channel: "telegram",
					accountId: account.accountId,
					direction: "outbound"
				});
				return textResult;
			}
			opts.promptContextProjectionPlan?.cursor.invalidate();
			throw error;
		}
		const result = mediaDelivery.result;
		const deliveredCaption = mediaDelivery.plainText || void 0;
		const acceptedMediaParams = toAcceptedThreadScopedParams(mediaDelivery.acceptedParams);
		const mediaMessageId = resolveTelegramMessageIdOrThrow(result, "media send");
		const resolvedChatId = String(result?.chat?.id ?? chatId);
		let mediaDeliveryResult;
		let mediaPromptRecorded = false;
		const reportMediaDelivery = async (hasInlineKeyboard) => {
			const meta = {
				...deliveredCaption ? { telegramDeliveredText: deliveredCaption } : {},
				telegramHasInlineKeyboard: hasInlineKeyboard
			};
			telegramCaptionDeliveryMetadata.add(meta);
			mediaDeliveryResult = await reportDelivery(mediaMessageId, resolvedChatId, result, meta, "media", (delivery) => {
				mediaDeliveryResult = delivery;
			});
		};
		const recordMediaPromptContext = async (finalPart) => {
			if (!mediaPromptRecorded) {
				await recordDeliveredPromptContext({
					message: result,
					messageId: mediaMessageId,
					...deliveredCaption ? { text: deliveredCaption } : {},
					...acceptedMediaParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedMediaParams.message_thread_id } : {}
				}, finalPart);
				mediaPromptRecorded = true;
			}
		};
		await sender.accept(mediaDelivery, async () => {
			recordSentMessage(chatId, mediaMessageId, cfg, {
				accountId: account.accountId,
				agentId: ownerAgentId
			});
			await reportMediaDelivery(!needsSeparateText && Boolean(replyMarkup));
			if (!needsSeparateText) await recordMediaPromptContext(true);
		}, () => ({
			...mediaDeliveryResult?.receipt ? { receipt: mediaDeliveryResult.receipt } : {},
			visibleReplySent: true
		}));
		logTelegramOutboundSendOk({
			accountId: account.accountId,
			chatId: resolvedChatId,
			messageId: String(mediaMessageId),
			operation: mediaDelivery.sender.operation,
			deliveryKind: mediaDelivery.sender.label,
			messageThreadId: acceptedMediaParams?.message_thread_id,
			replyToMessageId: opts.replyToMessageId,
			silent: opts.silent
		});
		recordChannelActivity({
			channel: "telegram",
			accountId: account.accountId,
			direction: "outbound"
		});
		if (needsSeparateText && followUpText) {
			let textResult;
			try {
				textResult = await sendChunkedText(followUpText, "text follow-up send", {
					replyToAlreadyUsed: singleUseReplyTo && mediaUsedReplyTo,
					beforeFirstAccepted: () => recordMediaPromptContext(false)
				});
			} catch (error) {
				if (!isChannelPartialDeliveryError(error) && isTelegramEmptyContentError(error)) {
					let hasInlineKeyboard = false;
					let keyboardError;
					if (replyMarkup) try {
						await api.editMessageReplyMarkup(resolvedChatId, mediaMessageId, { reply_markup: replyMarkup });
						hasInlineKeyboard = true;
					} catch (editError) {
						keyboardError = editError;
					}
					await recordMediaPromptContext(true);
					if (keyboardError !== void 0) throw createChannelPartialDeliveryError(keyboardError, {
						messageIds: [String(mediaMessageId)],
						...mediaDeliveryResult?.receipt ? { receipt: mediaDeliveryResult.receipt } : {},
						visibleReplySent: true
					});
					const finalMediaResult = mediaDeliveryResult ?? {
						messageId: String(mediaMessageId),
						chatId: resolvedChatId
					};
					if (!hasInlineKeyboard) return finalMediaResult;
					const meta = {
						...finalMediaResult.meta,
						telegramHasInlineKeyboard: true
					};
					telegramCaptionDeliveryMetadata.add(meta);
					return {
						...finalMediaResult,
						meta
					};
				}
				await recordMediaPromptContext(false);
				return sender.fail(error);
			}
			const mediaReplyToId = resolveAcceptedReplyToMessageId(acceptedMediaParams)?.toString();
			const receipt = createMessageReceiptFromOutboundResults({
				results: [mediaDeliveryResult ?? {
					messageId: String(mediaMessageId),
					chatId: resolvedChatId
				}, textResult],
				kind: "text"
			});
			if (mediaReplyToId) receipt.replyToId = mediaReplyToId;
			receipt.parts = receipt.parts.map((part, index) => ({
				...part,
				index,
				...index === 0 ? { kind: "media" } : {},
				...mediaReplyToId && (index === 0 || !textResult.receipt && !singleUseReplyTo) ? { replyToId: mediaReplyToId } : {}
			}));
			return {
				...textResult,
				chatId: resolvedChatId,
				receipt
			};
		}
		return mediaDeliveryResult?.meta?.telegramHasInlineKeyboard ? mediaDeliveryResult : {
			messageId: String(mediaMessageId),
			chatId: resolvedChatId,
			...mediaDeliveryResult?.receipt ? { receipt: mediaDeliveryResult.receipt } : {}
		};
	}
	if (!text || !text.trim()) throw new Error("Message must be non-empty for Telegram sends");
	const textResult = await sendChunkedText(text, "text send");
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return textResult;
}
//#endregion
//#region extensions/telegram/src/poll-registry.ts
const TELEGRAM_POLL_REGISTRY_NAMESPACE = "telegram.poll-registry";
const TELEGRAM_POLL_REGISTRY_MAX_ENTRIES = 1e4;
const TELEGRAM_CLOSED_POLL_RETENTION_MS = 2880 * 60 * 1e3;
function openPollRegistryStore(env) {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_POLL_REGISTRY_NAMESPACE,
		maxEntries: TELEGRAM_POLL_REGISTRY_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function openPollRegistrySyncStore(env) {
	return getTelegramRuntime().state.openSyncKeyedStore({
		namespace: TELEGRAM_POLL_REGISTRY_NAMESPACE,
		maxEntries: TELEGRAM_POLL_REGISTRY_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function telegramPollRegistryKey(accountId, pollId) {
	return `${normalizeAccountId(accountId)}:${pollId}`;
}
function normalizePollChat(raw) {
	if (!isRecord(raw) || raw.is_direct_messages === true) return null;
	const id = parseStrictInteger(raw.id);
	if (id === void 0) return null;
	if (raw.type === "private" && typeof raw.first_name === "string") return {
		id,
		type: "private",
		first_name: raw.first_name
	};
	if (raw.type === "group" && typeof raw.title === "string") return {
		id,
		type: "group",
		title: raw.title
	};
	if (raw.type === "supergroup" && typeof raw.title === "string") return {
		id,
		type: "supergroup",
		title: raw.title,
		...raw.is_forum === true ? { is_forum: true } : {}
	};
	return null;
}
function normalizePollThreadSpec(raw, chat) {
	if (!isRecord(raw)) return null;
	const id = parseStrictPositiveInteger(raw.id);
	if (raw.scope === "none") return raw.id === void 0 && chat.type !== "private" && chat.is_forum !== true ? { scope: "none" } : null;
	if (raw.scope === "dm") {
		if (chat.type !== "private" || raw.id !== void 0 && id === void 0) return null;
		return id === void 0 ? { scope: "dm" } : {
			scope: "dm",
			id
		};
	}
	return raw.scope === "forum" && chat.type === "supergroup" && id !== void 0 ? {
		scope: "forum",
		id
	} : null;
}
function normalizePollRegistryEntry(raw) {
	if (!isRecord(raw)) return null;
	const chat = normalizePollChat(raw.chat);
	const messageId = parseStrictInteger(raw.messageId);
	const threadSpec = chat ? normalizePollThreadSpec(raw.threadSpec, chat) : null;
	if (typeof raw.pollId !== "string" || !chat || !threadSpec || messageId === void 0 || typeof raw.question !== "string" || !Array.isArray(raw.options) || !raw.options.every((option) => typeof option === "string")) return null;
	return {
		pollId: raw.pollId,
		chat,
		messageId,
		threadSpec,
		question: raw.question,
		options: raw.options
	};
}
async function recordTelegramPollRegistryEntry(params) {
	const entry = createTelegramPollRegistryEntry(params);
	await openPollRegistryStore(params.env).register(telegramPollRegistryKey(params.accountId, params.pollId), entry);
	return entry;
}
function createTelegramPollRegistryEntry(params) {
	const entry = normalizePollRegistryEntry({
		pollId: params.pollId,
		chat: params.chat,
		messageId: params.messageId,
		threadSpec: params.threadSpec,
		question: params.question,
		options: [...params.options]
	});
	if (!entry) throw new Error("Invalid Telegram poll registry route");
	return entry;
}
async function findTelegramPollRegistryEntry(params) {
	return normalizePollRegistryEntry(await openPollRegistryStore(params.env).lookup(telegramPollRegistryKey(params.accountId, params.pollId)));
}
function findTelegramPollRegistryEntrySync(params) {
	return normalizePollRegistryEntry(openPollRegistrySyncStore(params.env).lookup(telegramPollRegistryKey(params.accountId, params.pollId)));
}
async function retireTelegramPollRegistryEntry(params) {
	const store = openPollRegistryStore(params.env);
	const key = telegramPollRegistryKey(params.accountId, params.pollId);
	const entry = normalizePollRegistryEntry(await store.lookup(key));
	if (!entry) return;
	await store.register(key, entry, { ttlMs: TELEGRAM_CLOSED_POLL_RETENTION_MS });
}
//#endregion
//#region extensions/telegram/src/poll-answer-context.ts
const preparedPollAnswers = /* @__PURE__ */ new WeakMap();
const pendingPollRegistrations = /* @__PURE__ */ new Map();
function beginTelegramPollRegistration(params) {
	const key = telegramPollRegistryKey(params.accountId, params.entry.pollId);
	let completeRegistration = () => {};
	const completion = new Promise((resolve) => {
		completeRegistration = resolve;
	});
	const registration = {
		entry: params.entry,
		completion
	};
	pendingPollRegistrations.set(key, registration);
	return { complete: (entry) => {
		completeRegistration(entry);
		if (pendingPollRegistrations.get(key) === registration) pendingPollRegistrations.delete(key);
	} };
}
function prepareTelegramPollAnswerContext(params) {
	if (!isEligibleTelegramPollAnswerUpdate(params.update)) return;
	if (preparedPollAnswers.has(params.update)) return;
	const pollId = params.update.poll_answer.poll_id;
	const pending = pendingPollRegistrations.get(telegramPollRegistryKey(params.accountId, pollId));
	const prepared = pending ? {
		entry: pending.entry,
		registrationPending: true
	} : { entry: findTelegramPollRegistryEntrySync({
		pollId,
		accountId: params.accountId
	}) };
	preparedPollAnswers.set(params.update, prepared);
}
async function settleTelegramPollAnswerContext(params) {
	if (!preparedPollAnswers.get(params.update)?.registrationPending || !isEligibleTelegramPollAnswerUpdate(params.update)) return;
	const pollId = params.update.poll_answer.poll_id;
	const pending = pendingPollRegistrations.get(telegramPollRegistryKey(params.accountId, pollId));
	const entry = pending ? await pending.completion : findTelegramPollRegistryEntrySync({
		pollId,
		accountId: params.accountId
	});
	preparedPollAnswers.set(params.update, { entry });
}
function getPreparedTelegramPollAnswer(update) {
	return preparedPollAnswers.get(update);
}
function isEligibleTelegramPollAnswerUpdate(update) {
	if (!update || typeof update !== "object") return false;
	const pollAnswer = update.poll_answer;
	return Boolean(pollAnswer?.poll_id && pollAnswer.user && !pollAnswer.user.is_bot && pollAnswer.option_ids?.length);
}
function recordPreparedTelegramPollAnswer(update, prepared) {
	preparedPollAnswers.set(update, prepared);
}
//#endregion
//#region extensions/telegram/src/send-special.ts
function resolveTelegramPollThreadSpec(threadSpec) {
	if (threadSpec.scope === "none") return { scope: "none" };
	if (threadSpec.scope === "dm") return threadSpec.id === void 0 ? { scope: "dm" } : {
		scope: "dm",
		id: threadSpec.id
	};
	return threadSpec.scope === "forum" && threadSpec.id !== void 0 ? {
		scope: "forum",
		id: threadSpec.id
	} : void 0;
}
/**
* Send a sticker to a Telegram chat by file_id.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param fileId - Telegram file_id of the sticker to send
* @param opts - Optional configuration
*/
async function sendStickerTelegram(to, fileId, opts) {
	if (!fileId?.trim()) throw new Error("Telegram sticker file_id is required");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendStickerTelegramWithContext(to, fileId, opts, context));
}
async function sendStickerTelegramWithContext(to, fileId, opts, context) {
	const { api } = context;
	const prepared = await prepareTelegramOutbound({
		to,
		context,
		opts,
		thread: {
			messageThreadId: opts.messageThreadId,
			replyToMessageId: opts.replyToMessageId
		},
		request: {
			kind: "nonIdempotent",
			useApiErrorLogging: false
		}
	});
	const stickerParams = Object.keys(prepared.threadParams).length > 0 ? prepared.threadParams : void 0;
	return finalizeTelegramOutbound({
		context,
		prepared,
		result: await prepared.request(() => api.sendSticker(prepared.chatId, fileId.trim(), stickerParams), "sticker"),
		resultContext: "sticker send"
	});
}
/**
* Send a poll to a Telegram chat.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param poll - Poll input with question, options, maxSelections, and optional durationHours
* @param opts - Optional configuration
*/
async function sendPollTelegram(to, poll, opts) {
	if (parseTelegramTarget(to).directMessagesTopicId != null) throw new Error("Telegram polls are not supported in channel Direct Messages chats.");
	const context = resolveTelegramApiContext(opts);
	return withTelegramApiContextLease(context, sendPollTelegramWithContext(to, poll, opts, context));
}
async function sendPollTelegramWithContext(to, poll, opts, context) {
	const { api } = context;
	const prepared = await prepareTelegramOutbound({
		to,
		context,
		opts,
		thread: {
			messageThreadId: opts.messageThreadId,
			replyToMessageId: opts.replyToMessageId
		},
		request: { kind: "nonIdempotent" }
	});
	const normalizedPoll = normalizePollInput(poll, { maxOptions: 12 });
	const durationSeconds = normalizedPoll.durationSeconds;
	if (durationSeconds === void 0 && normalizedPoll.durationHours !== void 0) throw new Error("Telegram poll durationHours is not supported. Use durationSeconds (5-604800) instead.");
	if (durationSeconds !== void 0 && (durationSeconds < 5 || durationSeconds > 604800)) throw new Error("Telegram poll durationSeconds must be between 5 and 604800");
	const pollParams = {
		allows_multiple_answers: normalizedPoll.maxSelections > 1,
		is_anonymous: opts.isAnonymous ?? true,
		...durationSeconds !== void 0 ? { open_period: durationSeconds } : {},
		...Object.keys(prepared.threadParams).length > 0 ? prepared.threadParams : {},
		...opts.silent === true ? { disable_notification: true } : {}
	};
	await opts.onPlatformSendDispatch?.();
	const result = await prepared.request(() => api.sendPoll(prepared.chatId, normalizedPoll.question, normalizedPoll.options, pollParams), "poll");
	const pollId = result.poll.id;
	const routeChat = result.chat.type === "channel" ? void 0 : result.chat;
	const routeMessage = result.message_thread_id === void 0 && prepared.threadSpec?.id !== void 0 ? {
		...result,
		message_thread_id: prepared.threadSpec.id
	} : result;
	const resolvedThreadSpec = routeChat ? resolveTelegramMessageThreadSpec(routeMessage, prepared.threadSpec?.scope === "forum" || result.chat.is_forum === true) : void 0;
	const threadSpec = resolvedThreadSpec ? resolveTelegramPollThreadSpec(resolvedThreadSpec) : void 0;
	const messageThreadId = threadSpec && "id" in threadSpec ? threadSpec.id : void 0;
	const provisionalEntry = opts.isAnonymous === false && routeChat && threadSpec ? createTelegramPollRegistryEntry({
		pollId,
		chat: routeChat,
		messageId: result.message_id,
		threadSpec,
		question: normalizedPoll.question,
		options: normalizedPoll.options
	}) : void 0;
	const registration = provisionalEntry ? beginTelegramPollRegistration({
		accountId: context.account.accountId,
		entry: provisionalEntry
	}) : void 0;
	let registeredEntry = null;
	let pollAnswerRouting;
	let warning;
	try {
		const finalized = await finalizeTelegramOutbound({
			context,
			prepared,
			result,
			resultContext: "poll send"
		});
		if (pollId && opts.isAnonymous !== false) {
			pollAnswerRouting = "unavailable";
			warning = "Poll sent anonymously, so Telegram does not identify voters and answers cannot reach the agent. Send a public poll to route votes into this conversation.";
		} else if (pollId) {
			const isGroup = result.chat.type === "group" || result.chat.type === "supergroup";
			const botUserId = resolveTelegramBotUserIdFromToken(opts.token || context.account.token);
			let canVerifyVoters = result.chat.type === "private";
			if (result.chat.type === "channel") {
				pollAnswerRouting = "unavailable";
				warning = "Poll sent, but public poll answer routing is not supported for Telegram channels. Send the poll in a direct chat or group, or ask subscribers to reply in text.";
			} else if (isGroup) {
				const { groupConfig, topicConfig } = resolveTelegramScopedGroupConfig(context.account.config, result.chat.id, messageThreadId);
				const groupPolicyConfig = groupConfig && "groupPolicy" in groupConfig ? groupConfig : void 0;
				if (groupConfig?.enabled === false || topicConfig?.enabled === false || resolveTelegramEffectiveGroupPolicy({
					cfg: opts.cfg,
					telegramCfg: context.account.config,
					groupConfig: groupPolicyConfig,
					topicConfig
				}) === "disabled") {
					pollAnswerRouting = "unavailable";
					warning = "Poll sent, but answers cannot reach the agent because inbound messages are disabled for this group or topic. Enable inbound messages for this target and send a new poll, or ask participants to reply in text.";
				} else if (botUserId == null) {
					pollAnswerRouting = "unavailable";
					warning = "Poll sent, but answers cannot reach the agent because the bot account could not be verified. Check the bot token and send a new poll, or ask the user to reply in text.";
				} else try {
					const botMember = await api.getChatMember(result.chat.id, botUserId);
					canVerifyVoters = botMember.status === "creator" || botMember.status === "administrator";
					if (!canVerifyVoters) {
						pollAnswerRouting = "unavailable";
						warning = "Poll sent, but answers cannot reach the agent because the bot is not an administrator in this group. Make the bot an administrator and send a new poll, or ask the user to reply in text.";
					}
				} catch (err) {
					pollAnswerRouting = "unavailable";
					warning = "Poll sent, but answers cannot reach the agent because group membership verification failed. Make the bot an administrator and send a new poll, or ask the user to reply in text.";
					logVerbose(`telegram: failed to verify poll voter access for poll ${pollId}: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
			if (canVerifyVoters && provisionalEntry) try {
				registeredEntry = await recordTelegramPollRegistryEntry({
					accountId: context.account.accountId,
					...provisionalEntry
				});
				pollAnswerRouting = "enabled";
			} catch (err) {
				pollAnswerRouting = "unavailable";
				warning = "Poll sent, but answers cannot reach the agent because routing state could not be saved. Ask the user to reply in text.";
				logVerbose(`telegram: failed to record poll registry entry for poll ${pollId}: ${err instanceof Error ? err.message : String(err)}`);
			}
		}
		return {
			...finalized,
			pollId,
			...pollAnswerRouting ? { pollAnswerRouting } : {},
			...warning ? { warning } : {}
		};
	} finally {
		registration?.complete(registeredEntry);
	}
}
//#endregion
export { recordTelegramGroupHistoryEntry as $, unpinMessageTelegram as A, recordOutboundMessageForPromptContext as B, editForumTopicTelegram as C, pinMessageTelegram as D, getTelegramAllowedReactions as E, resolveTelegramReactionVariant as F, hasProviderObservedTelegramThreadBinding as G, buildTelegramConversationContext as H, resolveTelegramStatusReactionEmojis as I, buildTelegramSelfSenderName as J, isTelegramMessageFromCurrentBot as K, reportTelegramProviderDelivery as L, buildTelegramStatusReactionVariants as M, resolveTelegramAllowedReactions as N, reactMessageTelegram as O, resolveTelegramReactionEmoji as P, mergeTelegramGroupHistoryPromptContext as Q, recordSentMessage as R, createForumTopicTelegram as S, deleteMessageTelegram as T, buildTelegramReplyChain as U, registerTelegramOutboundGroupHistoryRecorder as V, createTelegramMessageCache as W, isTelegramHistoryEntryAfterAmbientWatermark as X, isTelegramChatWindowPromptContext as Y, isTelegramSelfSenderName as Z, isTelegramVoiceMessagesForbiddenError as _, prepareTelegramPollAnswerContext as a, createTelegramClientFetch as at, editMessageTelegram as b, findTelegramPollRegistryEntry as c, resolveTelegramOutboundClientTimeoutFloorSeconds as ct, createTelegramPreparedSender as d, apiThrottler as dt, retainTelegramGroupHistoryPromptContext as et, createTelegramReplyRequest as f, sequentialize as ft, isTelegramCaptionTooLongError as g, resolveTelegramRuntimeGroupPolicy as gt, resolveTelegramOutboundMediaSenders as h, resolveTelegramEffectiveGroupPolicy as ht, isEligibleTelegramPollAnswerUpdate as i, asTelegramClientFetch as it, TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST as j, sendTypingTelegram as k, retireTelegramPollRegistryEntry as l, getOrCreateAccountThrottler as lt, prepareTelegramOutboundMedia as m, evaluateTelegramGroupPolicyAccess as mt, sendStickerTelegram as n, resetTelegramClientOptionsCacheForTests as nt, recordPreparedTelegramPollAnswer as o, resolveTelegramClientTimeoutMinimumSeconds as ot, mergeTelegramPartialDeliveryError as p, evaluateTelegramGroupBaseAccess as pt, resolveProviderObservedTelegramThreadSpec as q, getPreparedTelegramPollAnswer as r, buildTelegramSendParams as rt, settleTelegramPollAnswerContext as s, resolveTelegramClientTimeoutSeconds as st, sendPollTelegram as t, selectTelegramGroupHistoryAfterLastSelf as tt, sendMessageTelegram as u, Bot$1 as ut, sendLocationTelegram as v, renameForumTopicTelegram as w, planTelegramTextDeliveryPages as x, editMessageReplyMarkupTelegram as y, wasSentByBot as z };
