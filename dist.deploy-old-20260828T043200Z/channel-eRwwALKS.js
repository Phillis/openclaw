import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { C as parseStrictNonNegativeInteger, h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CLj0HTDM.js";
import { d as normalizeStringEntriesLower } from "./string-normalization-e_fvmxMf.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { n as extractErrorCode, r as formatErrorMessage, t as collectErrorGraphCandidates } from "./errors-Ccx0R-_Z.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { At as boolean, Et as array, Rn as string, Tn as object, Zn as unknown, wn as number } from "./schemas-CZ9Toj_c.js";
import { a as buildChannelConfigSchema } from "./config-schema-ikPYPY3Q.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import { l as readRequestBodyWithLimit, p as requestBodyErrorToText, s as isRequestBodyLimitError } from "./http-body-DthsuKdw.js";
import { n as safeParseWithSchema, t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { b as resolveRequestClientIp } from "./net-DeK7gO-9.js";
import { n as isInsideCode, t as findCodeRegions } from "./code-regions-C2SF8Hgg.js";
import { h as createChannelIngressError, p as defineChannelMessageAdapter } from "./channel-outbound-0oFCMpw9.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-BMBDlrGB.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import { t as buildAgentSessionKey } from "./resolve-route-CaHBZG2x.js";
import { n as createHybridChannelConfigAdapter, s as createScopedDmSecurityResolver } from "./channel-config-helpers-C7An4wuC.js";
import "./error-runtime-CmA1H4Zg.js";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.js";
import "./response-limit-runtime-Dd4g9Wqb.js";
import "./runtime-env-_YEv0JPQ.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as classifyTransientNetworkErrorCode } from "./retry-runtime-D94jIZiS.js";
import "./routing-DM8631ts.js";
import { i as createChatChannelPlugin } from "./core-wiAGUTYa.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-Bs9uwexj.js";
import { a as waitUntilAbort } from "./channel-lifecycle.core-CnejcREy.js";
import "./ssrf-runtime-CpSMUPcn.js";
import { t as chunkTextForOutbound } from "./text-chunking-CJz4kAsi.js";
import "./channel-secret-basic-runtime-D79B15GP.js";
import "./security-runtime-CYUTzVOk.js";
import { i as channelStoppedPatch, n as channelBlockedPatch, r as channelReadyPatch } from "./gateway-runtime-CwascfPd.js";
import "./account-resolution-B2Bh3J2z.js";
import { d as createDefaultChannelRuntimeState, u as createComputedAccountStatusAdapter } from "./status-helpers-CopMHs_f.js";
import "./extension-shared-BO-DUGkx.js";
import "./channel-config-schema-DeVmAx-r.js";
import "./channel-core-D0k0Lcs9.js";
import { s as resolveStableChannelMessageIngress, t as createStandardRawEventIngressMonitor } from "./channel-ingress-runtime-BcONVz10.js";
import { M as createConditionalWarningCollector } from "./channel-policy-BG3-cCKG.js";
import { n as createEmptyChannelDirectoryAdapter } from "./directory-adapters-CwR372GJ.js";
import "./directory-runtime-6zdCRTwq.js";
import "./text-utility-runtime-BNhX-3os.js";
import { a as createFixedWindowRateLimiter } from "./webhook-ingress-IarruVNi.js";
import { a as createWebhookInFlightLimiter, i as beginWebhookRequestPipelineOrReject } from "./webhook-request-guards-BYzmIdMp.js";
import { t as registerPluginHttpRoute } from "./http-registry--mJJX8Q3.js";
import { a as resolveAccount, i as listAccountIds, n as synologyChatSetupContract, r as synologyChatSetupWizard } from "./setup-surface-BN4GeweL.js";
import { n as resolveSynologyHostedMediaRoute, r as resolveSynologyPublicWebhookRouteKey } from "./hosted-media-route-D-eaLrIJ.js";
import { r as getSynologyRuntime, t as prepareSynologyHostedMedia } from "./outbound-media-C_T3jrB1.js";
import { t as collectSynologyChatSecurityAuditFindings } from "./security-audit-DIsaxIaB.js";
import * as http$1 from "node:http";
import * as https$1 from "node:https";
import * as querystring from "node:querystring";
//#region extensions/synology-chat/src/approval-auth.ts
function normalizeSynologyChatApproverId(value) {
	const trimmed = String(value).trim();
	return /^\d+$/.test(trimmed) ? trimmed : void 0;
}
const synologyChatApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Synology Chat",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveAccount(cfg ?? {}, accountId).allowedUserIds };
	},
	normalizeApprover: normalizeSynologyChatApproverId
}).approvalAuth;
//#endregion
//#region extensions/synology-chat/src/client.ts
/**
* Synology Chat HTTP client.
* Sends messages TO Synology Chat via the incoming webhook URL.
*/
const MIN_SEND_INTERVAL_MS = 500;
const SYNOLOGY_CHAT_TEXT_CHUNK_LIMIT = 2e3;
/** user_list JSON can be larger than inbound webhook pre-auth payloads. */
const USER_LIST_RESPONSE_MAX_BYTES = 1 * 1024 * 1024;
/** Wall-clock budget for user_list fetch including response body. */
const USER_LIST_REQUEST_TIMEOUT_MS = 15e3;
/** Wall-clock budget for outgoing webhook requests including response body. */
const POST_REQUEST_TIMEOUT_MS = 3e4;
let lastSendTime = 0;
let sendQueue = Promise.resolve();
const UNPROVEN_TRANSPORT_ERROR_BRANCH = "unproven transport error branch";
function nestedTransportErrorCandidates(current) {
	const aggregateBranches = Array.isArray(current.errors) ? current.errors.map((branch) => branch ?? UNPROVEN_TRANSPORT_ERROR_BRANCH) : [];
	const wrappers = [
		current.cause,
		current.original,
		current.error,
		current.reason
	].filter((candidate) => candidate !== void 0 && candidate !== null);
	return [...aggregateBranches, ...wrappers];
}
function isProvenPreConnectFailure(error) {
	let foundPreConnectLeaf = false;
	for (const candidate of collectErrorGraphCandidates(error, nestedTransportErrorCandidates)) {
		const classification = classifyTransientNetworkErrorCode(extractErrorCode(candidate));
		if ((candidate && typeof candidate === "object" ? nestedTransportErrorCandidates(candidate) : []).length > 0) {
			if (classification === "ambiguous") return false;
			continue;
		}
		if (classification !== "pre-connect") return false;
		foundPreConnectLeaf = true;
	}
	return foundPreConnectLeaf;
}
const ChatUserSchema = object({
	user_id: number(),
	username: string().optional(),
	nickname: string().optional()
}).transform((user) => ({
	user_id: user.user_id,
	username: user.username ?? "",
	nickname: user.nickname ?? ""
}));
const ChatUserListResponseSchema = object({
	success: boolean(),
	data: object({ users: array(unknown()).optional().transform((users) => (users ?? []).flatMap((user) => {
		const parsed = safeParseWithSchema(ChatUserSchema, user);
		return parsed ? [parsed] : [];
	})) }).optional()
});
const chatUserCache = /* @__PURE__ */ new Map();
const CACHE_TTL_MS = 300 * 1e3;
/**
* Send a text message to Synology Chat via the incoming webhook.
*
* @param incomingUrl - Synology Chat incoming webhook URL
* @param text - Message text to send
* @param userId - Optional user ID to mention with @
* @returns true if sent successfully
*/
async function sendMessage(incomingUrl, text, userId, allowInsecureSsl = false, onPlatformSendDispatch) {
	const chunks = chunkTextForOutbound(text, SYNOLOGY_CHAT_TEXT_CHUNK_LIMIT);
	for (const chunk of chunks.length > 0 ? chunks : [text]) {
		const body = buildWebhookBody({ text: chunk }, userId);
		await waitForSendSlot();
		await onPlatformSendDispatch?.();
		let result;
		try {
			result = await retryAsync(() => doPost(incomingUrl, body, allowInsecureSsl), {
				attempts: 3,
				minDelayMs: 0,
				shouldRetry: isProvenPreConnectFailure,
				delayMs: ({ attempt }) => 300 * 2 ** (attempt - 1),
				sleep: async (delayMs) => {
					await sleepWithAbort(delayMs);
					await waitForSendSlot();
					await onPlatformSendDispatch?.();
				}
			});
		} catch {
			return false;
		}
		if (result !== "accepted") return false;
	}
	return true;
}
/**
* Send an OpenClaw-hosted immutable file URL to Synology Chat.
*/
async function sendHostedFileUrl(incomingUrl, fileUrl, userId, allowInsecureSsl = false, onPlatformSendDispatch) {
	let body;
	try {
		body = buildWebhookBody({ file_url: assertHostedMediaUrl(fileUrl) }, userId);
	} catch {
		return { status: "not-dispatched" };
	}
	await waitForSendSlot();
	await onPlatformSendDispatch?.();
	try {
		return { status: await doPost(incomingUrl, body, allowInsecureSsl) };
	} catch (error) {
		return { status: isProvenPreConnectFailure(error) ? "not-dispatched" : "indeterminate" };
	}
}
/**
* Fetch the list of Chat users visible to this bot via the user_list API.
* Results are cached for CACHE_TTL_MS to avoid excessive API calls.
*
* The user_list endpoint uses the same base URL as the chatbot API but
* with method=user_list instead of method=chatbot.
*/
async function fetchChatUsers(incomingUrl, allowInsecureSsl = false, log) {
	const now = Date.now();
	const listUrl = incomingUrl.replace(/method=\w+/, "method=user_list");
	const cached = chatUserCache.get(listUrl);
	if (cached && now - cached.cachedAt < CACHE_TTL_MS) return cached.users;
	return new Promise((resolve) => {
		let settled = false;
		let deadlineTimer;
		const clearDeadline = () => {
			if (deadlineTimer !== void 0) {
				clearTimeout(deadlineTimer);
				deadlineTimer = void 0;
			}
		};
		const finish = (users) => {
			if (settled) return;
			settled = true;
			clearDeadline();
			resolve(users);
		};
		let parsedUrl;
		try {
			parsedUrl = new URL(listUrl);
		} catch {
			log?.warn("fetchChatUsers: invalid user_list URL, using cached data");
			finish(cached?.users ?? []);
			return;
		}
		const transport = parsedUrl.protocol === "https:" ? https$1 : http$1;
		const requestOptions = parsedUrl.protocol === "https:" ? { rejectUnauthorized: !allowInsecureSsl } : {};
		const req = transport.get(listUrl, requestOptions, (res) => {
			(async () => {
				try {
					const data = await readByteStreamWithLimit(res, {
						maxBytes: USER_LIST_RESPONSE_MAX_BYTES,
						onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`user_list response exceeded ${maxBytes} bytes`)
					});
					if (settled) return;
					const result = safeParseJsonWithSchema(ChatUserListResponseSchema, data.toString("utf8"));
					if (!result) {
						log?.warn("fetchChatUsers: failed to parse user_list response");
						finish(cached?.users ?? []);
						return;
					}
					if (result.success) {
						const users = result.data?.users ?? [];
						chatUserCache.set(listUrl, {
							users,
							cachedAt: now
						});
						finish(users);
						return;
					}
					log?.warn(`fetchChatUsers: API returned success=${result.success}, using cached data`);
					finish(cached?.users ?? []);
				} catch (err) {
					if (settled) return;
					log?.warn(`fetchChatUsers: ${formatErrorMessage(err)}, using cached data`);
					finish(cached?.users ?? []);
				}
			})();
		}).on("error", (err) => {
			if (settled) return;
			log?.warn(`fetchChatUsers: HTTP error — ${err instanceof Error ? err.message : err}`);
			finish(cached?.users ?? []);
		});
		deadlineTimer = setTimeout(() => {
			log?.warn("fetchChatUsers: request timed out, using cached data");
			req.destroy?.();
			finish(cached?.users ?? []);
		}, USER_LIST_REQUEST_TIMEOUT_MS);
		deadlineTimer.unref?.();
	});
}
async function waitForSendSlot() {
	const next = sendQueue.then(async () => {
		const elapsed = Date.now() - lastSendTime;
		if (elapsed < MIN_SEND_INTERVAL_MS) await sleep(MIN_SEND_INTERVAL_MS - elapsed);
		lastSendTime = Date.now();
	});
	sendQueue = next.catch(() => {});
	await next;
}
function assertHostedMediaUrl(fileUrl) {
	let parsed;
	try {
		parsed = new URL(fileUrl);
	} catch (err) {
		throw new Error(`Invalid Synology Chat file URL: ${formatErrorMessage(err)}`, { cause: err });
	}
	if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password || parsed.hash) throw new Error("Synology Chat hosted attachment URL must use HTTPS without credentials or a fragment");
	return parsed.toString();
}
/**
* Resolve a mutable webhook username/nickname to the correct Chat API user_id.
*
* Synology Chat outgoing webhooks send a user_id that may NOT match the
* Chat-internal user_id needed by the chatbot API (method=chatbot).
* The webhook's "username" field corresponds to the Chat user's "nickname".
*
* @returns The correct Chat user_id, or undefined if not found
*/
async function resolveLegacyWebhookNameToChatUserId(params) {
	const users = await fetchChatUsers(params.incomingUrl, params.allowInsecureSsl, params.log);
	const lower = normalizeLowercaseStringOrEmpty(params.mutableWebhookUsername);
	const byNickname = users.find((u) => normalizeLowercaseStringOrEmpty(u.nickname) === lower);
	if (byNickname) return byNickname.user_id;
	const byUsername = users.find((u) => normalizeLowercaseStringOrEmpty(u.username) === lower);
	if (byUsername) return byUsername.user_id;
}
function buildWebhookBody(payload, userId) {
	const numericId = parseNumericUserId(userId);
	if (numericId !== void 0) payload.user_ids = [numericId];
	return `payload=${encodeURIComponent(JSON.stringify(payload))}`;
}
function parseNumericUserId(userId) {
	if (userId === void 0) return;
	if (typeof userId === "number") return Number.isSafeInteger(userId) ? userId : void 0;
	return parseStrictNonNegativeInteger(userId);
}
function doPost(url, body, allowInsecureSsl = false) {
	return new Promise((resolve, reject) => {
		let settled = false;
		let response;
		let deadlineTimer;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			if (deadlineTimer !== void 0) {
				clearTimeout(deadlineTimer);
				deadlineTimer = void 0;
			}
			if (result.error) {
				reject(result.error);
				return;
			}
			resolve(result.status ?? "rejected");
		};
		let parsedUrl;
		try {
			parsedUrl = new URL(url);
		} catch {
			resolve("not-dispatched");
			return;
		}
		const transport = parsedUrl.protocol === "https:" ? https$1 : http$1;
		let req;
		try {
			req = transport.request(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Content-Length": Buffer.byteLength(body)
				},
				rejectUnauthorized: !allowInsecureSsl
			}, (res) => {
				response = res;
				const responseChunks = [];
				let responseBytes = 0;
				res.on("data", (chunk) => {
					responseBytes += chunk.length;
					if (responseBytes <= USER_LIST_RESPONSE_MAX_BYTES) responseChunks.push(chunk);
					else responseChunks.length = 0;
				});
				res.on("end", () => {
					const result = responseBytes <= USER_LIST_RESPONSE_MAX_BYTES ? safeParseJsonWithSchema(ChatUserListResponseSchema.pick({ success: true }), Buffer.concat(responseChunks).toString("utf8")) : null;
					if (res.statusCode === 200) {
						finish({ status: result?.success === false ? "rejected" : "accepted" });
						return;
					}
					finish({ status: (res.statusCode ?? 500) >= 500 ? "indeterminate" : "rejected" });
				});
				res.on("error", (error) => finish({ error }));
				res.resume();
			});
		} catch {
			finish({ status: "not-dispatched" });
			return;
		}
		req.on("error", (error) => finish({ error }));
		deadlineTimer = setTimeout(() => {
			finish({ error: /* @__PURE__ */ new Error("Request timeout") });
			response?.destroy();
			req.destroy();
		}, POST_REQUEST_TIMEOUT_MS);
		deadlineTimer.unref?.();
		req.write(body);
		req.end();
	});
}
//#endregion
//#region extensions/synology-chat/src/config-schema.ts
const SynologyChatChannelConfigSchema = buildChannelConfigSchema(object({
	webhookUrl: string().optional(),
	dangerouslyAllowNameMatching: boolean().optional(),
	dangerouslyAllowInheritedWebhookPath: boolean().optional()
}).passthrough(), { uiHints: {
	incomingUrl: { sensitive: true },
	"accounts.*.incomingUrl": { sensitive: true },
	webhookUrl: { sensitive: true },
	"accounts.*.webhookUrl": { sensitive: true }
} });
//#endregion
//#region extensions/synology-chat/src/doctor.ts
const synologyChatDoctor = { collectPreviewWarnings: ({ cfg }) => {
	const warnings = [];
	for (const accountId of listAccountIds(cfg)) {
		const account = resolveAccount(cfg, accountId);
		if (!account.enabled || !account.token || !account.incomingUrl) continue;
		try {
			resolveSynologyHostedMediaRoute(account);
		} catch (error) {
			warnings.push(`- channels.synology-chat${accountId === "default" ? "" : `.accounts.${accountId}`}.webhookUrl: attachments are unavailable; ${error instanceof Error ? error.message : String(error)} Text and inbound messages are unaffected.`);
		}
	}
	return warnings;
} };
//#endregion
//#region extensions/synology-chat/src/session-key.ts
const CHANNEL_ID$3 = "synology-chat";
function buildSynologyChatInboundSessionKey(params) {
	return buildAgentSessionKey({
		agentId: params.agentId,
		channel: CHANNEL_ID$3,
		accountId: params.accountId,
		peer: {
			kind: "direct",
			id: params.userId
		},
		dmScope: "per-account-channel-peer",
		identityLinks: params.identityLinks
	});
}
function buildSynologyChatOutboundSessionKey(params) {
	return buildAgentSessionKey({
		agentId: params.agentId,
		channel: CHANNEL_ID$3,
		accountId: params.accountId,
		peer: {
			kind: "direct",
			id: `chat-api-${params.chatUserId}`
		},
		dmScope: "per-account-channel-peer"
	});
}
//#endregion
//#region extensions/synology-chat/src/inbound-event.ts
const CHANNEL_ID$2 = "synology-chat";
function resolveSynologyChatInboundRoute(params) {
	const rt = getSynologyRuntime();
	const route = rt.channel.routing.resolveAgentRoute({
		cfg: params.cfg,
		channel: CHANNEL_ID$2,
		accountId: params.account.accountId,
		peer: {
			kind: "direct",
			id: params.userId
		}
	});
	return {
		rt,
		route,
		sessionKey: buildSynologyChatInboundSessionKey({
			agentId: route.agentId,
			accountId: params.account.accountId,
			userId: params.userId,
			identityLinks: params.cfg.session?.identityLinks
		})
	};
}
async function deliverSynologyChatReply(params) {
	const text = params.payload.text ?? params.payload.body;
	if (!text) return { visibleReplySent: false };
	return { visibleReplySent: await sendMessage(params.account.incomingUrl, text, params.sendUserId, params.account.allowInsecureSsl) };
}
async function dispatchSynologyChatInboundEvent(params) {
	const currentCfg = getSynologyRuntime().config.current();
	const sendUserId = params.msg.chatUserId ?? params.msg.from;
	const resolved = resolveSynologyChatInboundRoute({
		cfg: currentCfg,
		account: params.account,
		userId: params.msg.from
	});
	await resolved.rt.channel.inbound.run({
		channel: CHANNEL_ID$2,
		accountId: params.account.accountId,
		raw: params.msg,
		...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {},
		adapter: {
			ingest: (msg) => ({
				id: msg.messageId,
				timestamp: Date.now(),
				rawText: msg.body,
				textForAgent: msg.body,
				textForCommands: msg.body,
				raw: msg
			}),
			resolveTurn: async (input) => {
				const chatKind = params.msg.chatType === "group" || params.msg.chatType === "channel" ? params.msg.chatType : "direct";
				const channelIngress = await params.msg.resolveChannelIngress({
					agentId: resolved.route.agentId,
					sessionKey: resolved.sessionKey,
					messageId: input.id,
					inboundEventKind: "user_request"
				});
				const msgCtx = resolved.rt.channel.inbound.buildContext({
					channelIngress,
					channel: CHANNEL_ID$2,
					accountId: params.account.accountId,
					messageId: input.id,
					timestamp: input.timestamp,
					from: `synology-chat:${params.msg.from}`,
					sender: {
						id: params.msg.from,
						name: params.msg.senderName
					},
					conversation: {
						kind: chatKind,
						id: params.msg.from,
						label: params.msg.senderName || params.msg.from
					},
					route: {
						agentId: resolved.route.agentId,
						dmScope: resolved.route.dmScope,
						accountId: params.account.accountId,
						routeSessionKey: resolved.sessionKey,
						dispatchSessionKey: resolved.sessionKey
					},
					reply: { to: `synology-chat:${params.msg.from}` },
					message: {
						rawBody: input.rawText,
						commandBody: input.textForCommands,
						bodyForAgent: input.textForAgent
					},
					extra: {
						ChatType: params.msg.chatType,
						CommandAuthorized: params.msg.commandAuthorized
					}
				});
				return {
					cfg: currentCfg,
					channel: CHANNEL_ID$2,
					accountId: params.account.accountId,
					route: {
						agentId: resolved.route.agentId,
						dmScope: resolved.route.dmScope,
						sessionKey: resolved.route.sessionKey
					},
					ctxPayload: msgCtx,
					delivery: {
						durable: () => ({ to: sendUserId }),
						deliver: async (payload) => {
							return await deliverSynologyChatReply({
								account: params.account,
								sendUserId,
								payload
							});
						}
					},
					dispatcherOptions: { onReplyStart: () => {
						params.log?.info?.(`Agent reply started for ${params.msg.from}`);
					} },
					record: { onRecordError: (err) => {
						params.log?.info?.(`Session metadata update failed for ${params.msg.from}`, err);
					} }
				};
			}
		}
	});
	return null;
}
//#endregion
//#region extensions/synology-chat/src/security.ts
/**
* Security module: token validation, rate limiting, input sanitization, user allowlist.
*/
/**
* Validate webhook token using constant-time comparison.
* Reject empty tokens explicitly; use shared constant-time comparison otherwise.
*/
function validateToken(received, expected) {
	if (!received || !expected) return false;
	return safeEqualSecret(received, expected);
}
async function authorizeUserForDmWithIngress(params) {
	return await resolveStableChannelMessageIngress({
		channelId: "synology-chat",
		accountId: params.accountId,
		identity: {
			key: "sender-id",
			entryIdPrefix: "synology-chat-entry"
		},
		subject: { stableId: params.userId },
		conversation: {
			kind: "direct",
			id: params.userId
		},
		contextBinding: params.contextBinding,
		event: { mayPair: false },
		dmPolicy: params.dmPolicy,
		allowFrom: params.allowedUserIds
	});
}
/**
* Sanitize user input to prevent prompt injection attacks.
* Filters known dangerous patterns and truncates long messages.
*/
function sanitizeInput(text) {
	const dangerousPatterns = [
		/ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?)/gi,
		/you\s+are\s+now\s+/gi,
		/system:\s*/gi,
		/<\|.*?\|>/g
	];
	let sanitized = text;
	for (const pattern of dangerousPatterns) sanitized = sanitized.replace(pattern, "[FILTERED]");
	const maxLength = 4e3;
	if (sanitized.length > maxLength) sanitized = truncateUtf16Safe(sanitized, maxLength) + "... [truncated]";
	return sanitized;
}
/**
* Sliding window rate limiter per user ID.
*/
var RateLimiter = class {
	constructor(limit = 30, windowSeconds = 60, maxTrackedUsers = 5e3) {
		this.limit = limit;
		const windowMs = finiteSecondsToTimerSafeMilliseconds(windowSeconds) ?? 1;
		this.limiter = createFixedWindowRateLimiter({
			windowMs,
			maxRequests: Math.max(1, Math.floor(limit)),
			maxTrackedKeys: Math.max(1, Math.floor(maxTrackedUsers))
		});
	}
	/** Returns true if the request is allowed, false if rate-limited. */
	check(userId) {
		return !this.limiter.isRateLimited(userId);
	}
	/** Exposed for tests and diagnostics. */
	size() {
		return this.limiter.size();
	}
	/** Exposed for tests and account lifecycle cleanup. */
	clear() {
		this.limiter.clear();
	}
	/** Exposed for tests. */
	maxRequests() {
		return this.limit;
	}
};
//#endregion
//#region extensions/synology-chat/src/webhook-ingress.ts
const SynologyIngressPermanentError = createChannelIngressError("SynologyIngressPermanentError", { withReason: true });
function firstNonEmptyString$1(value) {
	if (Array.isArray(value)) {
		for (const item of value) {
			const normalized = firstNonEmptyString$1(item);
			if (normalized) return normalized;
		}
		return;
	}
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function pickRawField(event, field) {
	return firstNonEmptyString$1(event.bodyFields[field]) ?? firstNonEmptyString$1(event.queryFields[field]);
}
function inspectSynologyIngressEvent(event) {
	const eventId = pickRawField(event, "post_id");
	if (!eventId) throw new SynologyIngressPermanentError("invalid-event", "Synology Chat webhook is missing post_id.");
	const userId = pickRawField(event, "user_id") ?? pickRawField(event, "userId") ?? pickRawField(event, "user");
	if (!userId) throw new SynologyIngressPermanentError("invalid-event", "Synology Chat webhook is missing user_id.");
	const channelId = pickRawField(event, "channel_id");
	return {
		eventId,
		laneKey: channelId ? `channel:${channelId}` : `direct:${userId}`
	};
}
function deserializeSynologyIngressEvent(rawEvent, claimedId) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new SynologyIngressPermanentError("invalid-event", `Synology Chat ingress row ${claimedId} contains invalid JSON.`, { cause: error });
	}
	if (!isRecord(parsed) || !isRecord(parsed.bodyFields) || !isRecord(parsed.queryFields)) throw new SynologyIngressPermanentError("invalid-event", `Synology Chat ingress row ${claimedId} has an invalid webhook envelope.`);
	return {
		bodyFields: parsed.bodyFields,
		queryFields: parsed.queryFields
	};
}
function resolveSynologyIngressNonRetryableFailure(error) {
	for (const candidate of collectErrorGraphCandidates(error, (current) => [current.cause])) if (candidate instanceof SynologyIngressPermanentError) return {
		reason: candidate.reason,
		message: candidate.message
	};
	return null;
}
function createSynologyIngressMonitor(options) {
	const serializeForIngress = (rawEvent) => {
		const bodyFields = { ...rawEvent.bodyFields };
		const queryFields = { ...rawEvent.queryFields };
		delete bodyFields.token;
		delete queryFields.token;
		return JSON.stringify({
			bodyFields,
			queryFields
		});
	};
	return createStandardRawEventIngressMonitor({
		queue: options.queue ?? (() => getSynologyRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (rawEvent) => inspectSynologyIngressEvent(rawEvent),
		payload: {
			serialize: serializeForIngress,
			deserialize: (rawEvent, { claim }) => deserializeSynologyIngressEvent(rawEvent, claim.id),
			createClaimError: (kind, claim) => new SynologyIngressPermanentError("invalid-event", kind === "invalid-version" ? `Synology Chat ingress row ${claim.id} has an invalid payload.` : `Synology Chat ingress row ${claim.id} has invalid message identity.`)
		},
		deliver: (rawEvent, lifecycle) => options.dispatch(rawEvent, lifecycle),
		pollIntervalMs: options.pollIntervalMs,
		drain: {
			resolveNonRetryableFailure: resolveSynologyIngressNonRetryableFailure,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.error?.(`synology-chat: ${message}`)
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		createStoppedError: () => /* @__PURE__ */ new Error("Synology Chat ingress is stopped."),
		onError: (error) => options.runtime.error?.(`synology-chat ingress drain failed: ${formatErrorMessage(error)}`),
		classifyAdmissionError: (error) => error instanceof SynologyIngressPermanentError ? error.message : void 0
	});
}
//#endregion
//#region extensions/synology-chat/src/webhook-handler.ts
const rateLimiters = /* @__PURE__ */ new Map();
const invalidTokenRateLimiters = /* @__PURE__ */ new Map();
const webhookInFlightLimiter = createWebhookInFlightLimiter();
const PREAUTH_MAX_BODY_BYTES = 64 * 1024;
const PREAUTH_BODY_TIMEOUT_MS = 5e3;
const PREAUTH_MAX_REQUESTS_PER_MINUTE = 10;
const INVALID_TOKEN_WINDOW_MS = 6e4;
const INVALID_TOKEN_MAX_TRACKED_KEYS = 5e3;
var InvalidTokenRateLimiter = class {
	constructor(limit) {
		this.state = /* @__PURE__ */ new Map();
		this.limit = limit;
	}
	normalizeState(key, nowMs) {
		const existing = this.state.get(key);
		if (!existing) return;
		if (nowMs - existing.windowStartMs >= INVALID_TOKEN_WINDOW_MS) {
			this.state.delete(key);
			return;
		}
		return existing;
	}
	touch(key, value) {
		this.state.delete(key);
		this.state.set(key, value);
		while (this.state.size > INVALID_TOKEN_MAX_TRACKED_KEYS) {
			const oldestKey = this.state.keys().next().value;
			if (!oldestKey) break;
			this.state.delete(oldestKey);
		}
	}
	isLocked(key, nowMs = Date.now()) {
		if (!key) return false;
		return (this.normalizeState(key, nowMs)?.count ?? 0) > this.limit;
	}
	recordFailure(key, nowMs = Date.now()) {
		if (!key) return false;
		const existing = this.normalizeState(key, nowMs);
		const nextCount = (existing?.count ?? 0) + 1;
		const windowStartMs = existing?.windowStartMs ?? nowMs;
		this.touch(key, {
			count: nextCount,
			windowStartMs
		});
		return nextCount > this.limit;
	}
	clear() {
		this.state.clear();
	}
	maxRequests() {
		return this.limit;
	}
};
function getRateLimiter(account) {
	let rl = rateLimiters.get(account.accountId);
	if (!rl || rl.maxRequests() !== account.rateLimitPerMinute) {
		rl?.clear();
		rl = new RateLimiter(account.rateLimitPerMinute);
		rateLimiters.set(account.accountId, rl);
	}
	return rl;
}
function getInvalidTokenRateLimiter(account) {
	const limit = Math.min(account.rateLimitPerMinute, PREAUTH_MAX_REQUESTS_PER_MINUTE);
	let rl = invalidTokenRateLimiters.get(account.accountId);
	if (!rl || rl.maxRequests() !== limit) {
		rl?.clear();
		rl = new InvalidTokenRateLimiter(limit);
		invalidTokenRateLimiters.set(account.accountId, rl);
	}
	return rl;
}
function getSynologyWebhookInvalidTokenRateLimitKey(params) {
	return resolveRequestClientIp(params.req, params.trustedProxies, params.allowRealIpFallback === true) ?? params.req.socket?.remoteAddress ?? "unknown";
}
function getSynologyWebhookInFlightKey(account) {
	return account.accountId;
}
/** Read the full request body as a string. */
async function readBody(req, timeoutMs = PREAUTH_BODY_TIMEOUT_MS) {
	try {
		return {
			ok: true,
			body: await readRequestBodyWithLimit(req, {
				maxBytes: PREAUTH_MAX_BODY_BYTES,
				timeoutMs
			})
		};
	} catch (err) {
		if (isRequestBodyLimitError(err)) return {
			ok: false,
			statusCode: err.statusCode,
			error: requestBodyErrorToText(err.code)
		};
		return {
			ok: false,
			statusCode: 400,
			error: "Invalid request body"
		};
	}
}
function firstNonEmptyString(value) {
	if (Array.isArray(value)) {
		for (const item of value) {
			const normalized = firstNonEmptyString(item);
			if (normalized) return normalized;
		}
		return;
	}
	if (value === null || value === void 0) return;
	const str = typeof value === "string" ? value.trim() : "";
	return str.length > 0 ? str : void 0;
}
function pickAlias(record, aliases) {
	for (const alias of aliases) {
		const normalized = firstNonEmptyString(record[alias]);
		if (normalized) return normalized;
	}
}
function parseQueryParams(req) {
	try {
		const url = new URL(req.url ?? "", "http://localhost");
		const out = {};
		for (const [key, value] of url.searchParams.entries()) out[key] = value;
		return out;
	} catch {
		return {};
	}
}
function parseFormBody(body) {
	return querystring.parse(body);
}
function parseJsonBody(body) {
	if (!body.trim()) return {};
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		throw new Error("Invalid JSON body");
	}
	if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("Invalid JSON body");
	return parsed;
}
function headerValue(header) {
	return firstNonEmptyString(header);
}
function extractTokenFromHeaders(req) {
	const explicit = headerValue(req.headers["x-synology-token"]) ?? headerValue(req.headers["x-webhook-token"]) ?? headerValue(req.headers["x-openclaw-token"]);
	if (explicit) return explicit;
	const auth = headerValue(req.headers.authorization);
	if (!auth) return;
	const bearerMatch = auth.match(/^Bearer\s+(.+)$/i);
	if (bearerMatch?.[1]) return bearerMatch[1].trim();
	return auth.trim();
}
/**
* Parse/normalize incoming webhook payload.
*
* Supports:
* - application/x-www-form-urlencoded
* - application/json
*
* Token resolution order: body.token -> query.token -> headers
* Field aliases:
* - user_id <- user_id | userId | user
* - text    <- text | message | content
*/
function parseRawEvent(req, body) {
	const contentType = normalizeLowercaseStringOrEmpty(req.headers["content-type"]);
	let bodyFields;
	if (contentType.includes("application/json")) bodyFields = parseJsonBody(body);
	else if (contentType.includes("application/x-www-form-urlencoded")) bodyFields = parseFormBody(body);
	else try {
		bodyFields = parseJsonBody(body);
	} catch {
		bodyFields = parseFormBody(body);
	}
	const queryFields = parseQueryParams(req);
	const headerToken = extractTokenFromHeaders(req);
	return {
		rawEvent: {
			bodyFields,
			queryFields
		},
		token: pickAlias(bodyFields, ["token"]) ?? pickAlias(queryFields, ["token"]) ?? headerToken
	};
}
function parsePayload(rawEvent, token) {
	const { bodyFields, queryFields } = rawEvent;
	const userId = pickAlias(bodyFields, [
		"user_id",
		"userId",
		"user"
	]) ?? pickAlias(queryFields, [
		"user_id",
		"userId",
		"user"
	]);
	const text = pickAlias(bodyFields, [
		"text",
		"message",
		"content"
	]) ?? pickAlias(queryFields, [
		"text",
		"message",
		"content"
	]);
	if (!token || !userId || !text) return null;
	return {
		token,
		channel_id: pickAlias(bodyFields, ["channel_id"]) ?? pickAlias(queryFields, ["channel_id"]) ?? void 0,
		channel_name: pickAlias(bodyFields, ["channel_name"]) ?? pickAlias(queryFields, ["channel_name"]) ?? void 0,
		user_id: userId,
		username: pickAlias(bodyFields, [
			"username",
			"user_name",
			"name"
		]) ?? pickAlias(queryFields, [
			"username",
			"user_name",
			"name"
		]) ?? "unknown",
		post_id: pickAlias(bodyFields, ["post_id"]) ?? pickAlias(queryFields, ["post_id"]) ?? void 0,
		timestamp: pickAlias(bodyFields, ["timestamp"]) ?? pickAlias(queryFields, ["timestamp"]) ?? void 0,
		text,
		trigger_word: pickAlias(bodyFields, ["trigger_word", "triggerWord"]) ?? pickAlias(queryFields, ["trigger_word", "triggerWord"]) ?? void 0
	};
}
const SYNOLOGY_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const SYNOLOGY_WEBHOOK_ACCEPTED_VALUE = "durable";
/** Send a JSON response. */
function respondJson(res, statusCode, body) {
	res.writeHead(statusCode, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
}
/** Send a no-content ACK. */
function respondNoContent(res) {
	res.writeHead(204);
	res.end();
}
async function parseWebhookPayloadRequest(params) {
	const bodyResult = await readBody(params.req, params.bodyTimeoutMs);
	if (!bodyResult.ok) {
		params.log?.error("Failed to read request body", bodyResult.error);
		respondJson(params.res, bodyResult.statusCode, { error: bodyResult.error });
		return { ok: false };
	}
	let raw;
	try {
		raw = parseRawEvent(params.req, bodyResult.body);
	} catch (err) {
		params.log?.warn("Failed to parse webhook payload", err);
		respondJson(params.res, 400, { error: "Invalid request body" });
		return { ok: false };
	}
	const payload = parsePayload(raw.rawEvent, raw.token);
	if (!payload) {
		respondJson(params.res, 400, { error: "Missing required fields (token, user_id, text)" });
		return { ok: false };
	}
	return {
		ok: true,
		payload,
		rawEvent: raw.rawEvent
	};
}
async function authorizeSynologyWebhook(params) {
	const invalidTokenRateLimitKey = getSynologyWebhookInvalidTokenRateLimitKey({
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback
	});
	if (params.invalidTokenRateLimiter.isLocked(invalidTokenRateLimitKey)) {
		params.log?.warn(`Rate limit exceeded for remote IP: ${invalidTokenRateLimitKey}`);
		return {
			ok: false,
			statusCode: 429,
			error: "Rate limit exceeded"
		};
	}
	if (!validateToken(params.payload.token, params.account.token)) {
		if (params.invalidTokenRateLimiter.recordFailure(invalidTokenRateLimitKey)) {
			params.log?.warn(`Rate limit exceeded for remote IP: ${invalidTokenRateLimitKey}`);
			return {
				ok: false,
				statusCode: 429,
				error: "Rate limit exceeded"
			};
		}
		params.log?.warn(`Invalid token from ${params.req.socket?.remoteAddress}`);
		return {
			ok: false,
			statusCode: 401,
			error: "Invalid token"
		};
	}
	const auth = await authorizeUserForDmWithIngress({
		accountId: params.account.accountId,
		userId: params.payload.user_id,
		dmPolicy: params.account.dmPolicy,
		allowedUserIds: params.account.allowedUserIds
	});
	if (!auth.senderAccess.allowed) {
		if (auth.senderAccess.reasonCode === "dm_policy_disabled") return {
			ok: false,
			statusCode: 403,
			error: "DMs are disabled"
		};
		if (params.account.dmPolicy === "allowlist" && params.account.allowedUserIds.length === 0) {
			params.log?.warn("Synology Chat allowlist is empty while dmPolicy=allowlist; rejecting message");
			return {
				ok: false,
				statusCode: 403,
				error: "Allowlist is empty. Configure allowedUserIds or use dmPolicy=open with allowedUserIds=[\"*\"]."
			};
		}
		params.log?.warn(`Unauthorized user: ${params.payload.user_id}`);
		return {
			ok: false,
			statusCode: 403,
			error: "User not authorized"
		};
	}
	if (!params.rateLimiter.check(params.payload.user_id)) {
		params.log?.warn(`Rate limit exceeded for user: ${params.payload.user_id}`);
		return {
			ok: false,
			statusCode: 429,
			error: "Rate limit exceeded"
		};
	}
	return { ok: true };
}
function sanitizeSynologyWebhookText(payload) {
	let cleanText = sanitizeInput(payload.text);
	if (payload.trigger_word && cleanText.startsWith(payload.trigger_word)) cleanText = cleanText.slice(payload.trigger_word.length).trim();
	return cleanText;
}
async function parseAndAuthorizeSynologyWebhook(params) {
	const parsed = await parseWebhookPayloadRequest(params);
	if (!parsed.ok) return { ok: false };
	const authorized = await authorizeSynologyWebhook({
		req: params.req,
		account: params.account,
		payload: parsed.payload,
		invalidTokenRateLimiter: params.invalidTokenRateLimiter,
		rateLimiter: params.rateLimiter,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		log: params.log
	});
	if (!authorized.ok) {
		respondJson(params.res, authorized.statusCode, { error: authorized.error });
		return { ok: false };
	}
	return {
		ok: true,
		message: { rawEvent: parsed.rawEvent }
	};
}
async function resolveSynologyReplyDeliveryUserId(params) {
	if (!params.account.dangerouslyAllowNameMatching) return params.payload.user_id;
	const resolvedChatApiUserId = await resolveLegacyWebhookNameToChatUserId({
		incomingUrl: params.account.incomingUrl,
		mutableWebhookUsername: params.payload.username,
		allowInsecureSsl: params.account.allowInsecureSsl,
		log: params.log
	});
	if (resolvedChatApiUserId !== void 0) return String(resolvedChatApiUserId);
	params.log?.warn(`Could not resolve Chat API user_id for "${params.payload.username}" — falling back to webhook user_id ${params.payload.user_id}. Reply delivery may fail.`);
	return params.payload.user_id;
}
async function authorizeClaimedSynologyWebhook(params) {
	const auth = await authorizeUserForDmWithIngress({
		accountId: params.account.accountId,
		userId: params.payload.user_id,
		dmPolicy: params.account.dmPolicy,
		allowedUserIds: params.account.allowedUserIds,
		contextBinding: params.contextBinding
	});
	if (!auth.senderAccess.allowed) throw new SynologyIngressPermanentError("synology-auth", `Synology Chat user ${params.payload.user_id} is no longer authorized.`);
	return auth;
}
async function processSynologyWebhookIngressEvent(params) {
	const payload = parsePayload(params.rawEvent, params.account.token);
	if (!payload || !payload.post_id) throw new SynologyIngressPermanentError("invalid-event", "Synology Chat claimed webhook cannot be normalized.");
	const resolveChannelIngress = async (contextBinding) => await authorizeClaimedSynologyWebhook({
		account: params.account,
		payload,
		contextBinding
	});
	const channelIngress = await resolveChannelIngress();
	const body = sanitizeSynologyWebhookText(payload);
	if (!body) return;
	const preview = body.length > 100 ? `${truncateUtf16Safe(body, 100)}...` : body;
	params.log?.info?.(`Message from ${payload.username} (${payload.user_id}): ${preview}`);
	const authorizedWebhookUserId = payload.user_id;
	const deliveryUserId = await resolveSynologyReplyDeliveryUserId({
		account: params.account,
		payload,
		log: params.log
	});
	await params.deliver({
		body,
		channelIngress,
		resolveChannelIngress,
		messageId: payload.post_id,
		from: authorizedWebhookUserId,
		senderName: payload.username,
		provider: "synology-chat",
		chatType: "direct",
		accountId: params.account.accountId,
		commandAuthorized: channelIngress.senderAccess.allowed,
		chatUserId: deliveryUserId
	}, params.lifecycle);
}
function createWebhookHandler(deps) {
	const { account, log } = deps;
	const rateLimiter = getRateLimiter(account);
	const invalidTokenRateLimiter = getInvalidTokenRateLimiter(account);
	return async (req, res) => {
		if (req.method !== "POST") {
			respondJson(res, 405, { error: "Method not allowed" });
			return;
		}
		const requestLifecycle = beginWebhookRequestPipelineOrReject({
			req,
			res,
			inFlightLimiter: webhookInFlightLimiter,
			inFlightKey: getSynologyWebhookInFlightKey(account)
		});
		if (!requestLifecycle.ok) return;
		let authorized;
		try {
			authorized = await parseAndAuthorizeSynologyWebhook({
				req,
				res,
				account,
				invalidTokenRateLimiter,
				rateLimiter,
				trustedProxies: deps.trustedProxies,
				allowRealIpFallback: deps.allowRealIpFallback,
				log,
				bodyTimeoutMs: deps.bodyTimeoutMs
			});
		} finally {
			requestLifecycle.release();
		}
		if (!authorized.ok) return;
		let admitted;
		try {
			admitted = await deps.receive(authorized.message.rawEvent);
		} catch (error) {
			log?.error?.("Failed to durably admit Synology Chat webhook", error);
			respondJson(res, 503, { error: "Webhook admission failed" });
			return;
		}
		if (admitted.kind === "invalid") {
			respondJson(res, 400, { error: admitted.message });
			return;
		}
		res.setHeader(SYNOLOGY_WEBHOOK_ACCEPTED_HEADER, SYNOLOGY_WEBHOOK_ACCEPTED_VALUE);
		respondNoContent(res);
	};
}
//#endregion
//#region extensions/synology-chat/src/gateway-runtime.ts
const CHANNEL_ID$1 = "synology-chat";
const activeRouteCleanups = /* @__PURE__ */ new Map();
function buildStartupIssue(code, message, logLevel = "warn") {
	return {
		code,
		logLevel,
		message
	};
}
function logStartupIssues(log, issues) {
	for (const issue of issues) {
		const message = `Synology Chat ${issue.message}`;
		if (issue.logLevel === "info") {
			log?.info?.(message);
			continue;
		}
		log?.warn?.(message);
	}
}
function getRouteKey(account) {
	return `${account.accountId}:${account.webhookPath}`;
}
function createUnknownArgsLogAdapter(log) {
	if (!log) return;
	const formatArg = (value) => typeof value === "string" ? value : value instanceof Error ? value.message : "";
	const formatArgs = (args) => args.map(formatArg).filter(Boolean).join(": ");
	return {
		info: (...args) => log.info?.(formatArgs(args)),
		warn: (...args) => log.warn?.(formatArgs(args)),
		error: (...args) => log.error?.(formatArgs(args))
	};
}
function collectSynologyGatewayStartupIssues(params) {
	const { cfg, account, accountId } = params;
	const issues = [];
	if (!account.enabled) {
		issues.push(buildStartupIssue("disabled", `account ${accountId} is disabled, skipping`, "info"));
		return issues;
	}
	if (!account.token || !account.incomingUrl) issues.push(buildStartupIssue("missing-credentials", `account ${accountId} not fully configured (missing token or incomingUrl)`));
	if (account.dmPolicy === "allowlist" && account.allowedUserIds.length === 0) issues.push(buildStartupIssue("empty-allowlist", `account ${accountId} has dmPolicy=allowlist but empty allowedUserIds; refusing to start route`));
	if (account.dmPolicy === "open" && account.allowedUserIds.length === 0) issues.push(buildStartupIssue("empty-open-allowlist", `account ${accountId} has dmPolicy=open but empty allowedUserIds; add allowedUserIds=["*"] for public DMs or set explicit user IDs`));
	const accountIds = listAccountIds(cfg);
	if (accountIds.length > 1 && accountId !== "default" && account.webhookPathSource === "inherited-base" && !account.dangerouslyAllowInheritedWebhookPath) issues.push(buildStartupIssue("inherited-shared-webhook-path", `account ${accountId} must set an explicit webhookPath in multi-account setups; refusing inherited shared path. Set channels.synology-chat.accounts.${accountId}.webhookPath or opt in with dangerouslyAllowInheritedWebhookPath=true.`));
	const conflictingAccounts = accountIds.filter((candidateId) => {
		if (candidateId === accountId) return false;
		const candidate = resolveAccount(cfg, candidateId);
		return candidate.enabled && candidate.webhookPath === account.webhookPath;
	});
	if (conflictingAccounts.length > 0) issues.push(buildStartupIssue("duplicate-webhook-path", `account ${accountId} conflicts on webhookPath ${account.webhookPath} with ${conflictingAccounts.join(", ")}; refusing to start ambiguous shared route.`));
	const publicRouteKey = resolveSynologyPublicWebhookRouteKey(account.webhookUrl);
	if (publicRouteKey) {
		const conflictingPublicAccounts = accountIds.filter((candidateId) => {
			if (candidateId === accountId) return false;
			const candidate = resolveAccount(cfg, candidateId);
			return candidate.enabled && resolveSynologyPublicWebhookRouteKey(candidate.webhookUrl) === publicRouteKey;
		});
		if (conflictingPublicAccounts.length > 0) issues.push(buildStartupIssue("duplicate-webhook-url", `account ${accountId} conflicts on webhookUrl with ${conflictingPublicAccounts.join(", ")}; refusing to start ambiguous public route. Set a unique externally reachable callback URL for each account.`));
	}
	return issues;
}
function collectSynologyGatewayRoutingFindings(params) {
	return collectSynologyGatewayStartupIssues({
		cfg: params.cfg,
		account: params.account,
		accountId: params.account.accountId
	}).filter((issue) => issue.code === "inherited-shared-webhook-path" || issue.code === "duplicate-webhook-path" || issue.code === "duplicate-webhook-url").map((issue) => ({
		checkId: `channels.synology-chat.routing.${issue.code}`,
		severity: issue.code === "duplicate-webhook-url" ? "critical" : "warn",
		title: "Synology Chat security warning",
		detail: `Synology Chat: ${issue.message}`
	}));
}
function validateSynologyGatewayAccountStartup(params) {
	const issues = collectSynologyGatewayStartupIssues(params);
	if (issues.length > 0) {
		logStartupIssues(params.log, issues);
		return { ok: false };
	}
	return { ok: true };
}
async function registerSynologyWebhookRoute(params) {
	const { cfg, account, log } = params;
	const routeKey = getRouteKey(account);
	const previousCleanup = activeRouteCleanups.get(routeKey);
	if (previousCleanup) {
		log?.info?.(`Deregistering stale route before re-registering: ${account.webhookPath}`);
		await previousCleanup();
	}
	const logAdapter = createUnknownArgsLogAdapter(log);
	const ingress = createSynologyIngressMonitor({
		accountId: account.accountId,
		runtime: { error: (message) => log?.error?.(message) },
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		dispatch: async (rawEvent, lifecycle) => {
			await processSynologyWebhookIngressEvent({
				account,
				rawEvent,
				lifecycle,
				log: logAdapter,
				deliver: async (msg, turnAdoptionLifecycle) => {
					await dispatchSynologyChatInboundEvent({
						account,
						msg,
						log: logAdapter,
						turnAdoptionLifecycle
					});
				}
			});
		}
	});
	ingress.start();
	const handler = createWebhookHandler({
		account,
		trustedProxies: cfg.gateway?.trustedProxies,
		allowRealIpFallback: cfg.gateway?.allowRealIpFallback === true,
		receive: ingress.receive,
		log: logAdapter
	});
	let unregister;
	try {
		unregister = registerPluginHttpRoute({
			path: account.webhookPath,
			auth: "plugin",
			pluginId: CHANNEL_ID$1,
			accountId: account.accountId,
			log: (msg) => log?.info?.(msg),
			throwOnFailure: true,
			handler: async (req, res) => {
				const { tryHandleSynologyHostedMediaRequest } = await import("./outbound-media-DjMdCKL-.js");
				if (await tryHandleSynologyHostedMediaRequest(req, res, account)) return true;
				return await handler(req, res);
			}
		});
	} catch (error) {
		await ingress.stop();
		throw error;
	}
	let cleanupPromise;
	const cleanup = () => {
		cleanupPromise ??= (async () => {
			try {
				unregister();
			} finally {
				try {
					await ingress.stop();
				} finally {
					if (activeRouteCleanups.get(routeKey) === cleanup) activeRouteCleanups.delete(routeKey);
				}
			}
		})();
		return cleanupPromise;
	};
	activeRouteCleanups.set(routeKey, cleanup);
	return cleanup;
}
//#endregion
//#region extensions/synology-chat/src/channel.ts
/**
* Synology Chat Channel Plugin for OpenClaw.
*
* Implements the ChannelPlugin interface following the LINE pattern.
*/
const CHANNEL_ID = "synology-chat";
const SYNOLOGY_MARKDOWN_LINK_RE = /(?<!!)\[((?:\\[^\n]|[^\\\]\n])+)\]\((https?:\/\/(?:\\[^\n]|[^()\s<>\\])+(?:\((?:\\[^\n]|[^()\s<>\\])*\)(?:\\[^\n]|[^()\s<>\\])*)*)(?:\s+(?:"[^"\n]*"|'[^'\n]*'|\([^()\n]*\)))?\)/g;
function areSynologyAttachmentsReady(account) {
	try {
		resolveSynologyHostedMediaRoute(account);
		return true;
	} catch {
		return false;
	}
}
const resolveSynologyChatDmPolicy = createScopedDmSecurityResolver({
	channelKey: CHANNEL_ID,
	resolvePolicy: (account) => account.dmPolicy,
	resolveAllowFrom: (account) => account.allowedUserIds,
	policyPathSuffix: "dmPolicy",
	defaultPolicy: "allowlist",
	approveHint: "openclaw pairing approve synology-chat <code>",
	normalizeEntry: (raw) => normalizeLowercaseStringOrEmpty(raw)
});
const synologyChatConfigAdapter = createHybridChannelConfigAdapter({
	sectionKey: CHANNEL_ID,
	listAccountIds,
	resolveAccount,
	defaultAccountId: () => DEFAULT_ACCOUNT_ID,
	clearBaseFields: [
		"token",
		"incomingUrl",
		"webhookUrl",
		"nasHost",
		"webhookPath",
		"dangerouslyAllowNameMatching",
		"dangerouslyAllowInheritedWebhookPath",
		"dmPolicy",
		"allowedUserIds",
		"rateLimitPerMinute",
		"botName",
		"allowInsecureSsl"
	],
	resolveAllowFrom: (account) => account.allowedUserIds,
	formatAllowFrom: (allowFrom) => normalizeStringEntriesLower(allowFrom)
});
const collectSynologyChatSecurityWarnings = createConditionalWarningCollector((account) => !account.token && "- Synology Chat: token is not configured. The webhook will reject all requests.", (account) => !account.incomingUrl && "- Synology Chat: incomingUrl is not configured. The bot cannot send replies.", (account) => !account.webhookUrl && "- Synology Chat: webhookUrl is not configured. Text and inbound messages still work, but attachments require the exact externally reachable HTTPS callback URL.", (account) => account.allowInsecureSsl && "- Synology Chat: SSL verification is disabled (allowInsecureSsl=true). Only use this for local NAS with self-signed certificates.", (account) => account.dangerouslyAllowNameMatching && "- Synology Chat: dangerouslyAllowNameMatching=true re-enables mutable username/nickname recipient matching for replies. Prefer stable numeric user IDs.", (account) => account.dangerouslyAllowInheritedWebhookPath && account.webhookPathSource === "inherited-base" && "- Synology Chat: dangerouslyAllowInheritedWebhookPath=true opts a named account into a shared inherited webhook path. Prefer an explicit per-account webhookPath.");
const collectSynologyChatCriticalFindings = createConditionalWarningCollector.findings({
	collectWarnings: createConditionalWarningCollector((account) => account.dmPolicy === "open" && account.allowedUserIds.length === 0 && "- Synology Chat: dmPolicy=\"open\" with empty allowedUserIds blocks all senders. Add allowedUserIds=[\"*\"] for public DMs or set explicit user IDs.", (account) => account.dmPolicy === "open" && account.allowedUserIds.includes("*") && "- Synology Chat: dmPolicy=\"open\" allows any user to message the bot. Consider \"allowlist\" for production use.", (account) => account.dmPolicy === "allowlist" && account.allowedUserIds.length === 0 && "- Synology Chat: dmPolicy=\"allowlist\" with empty allowedUserIds blocks all senders. Add users or set dmPolicy=\"open\" with allowedUserIds=[\"*\"]."),
	checkId: "channels.synology-chat.dm.policy",
	severity: "critical",
	title: "Synology Chat security warning"
});
function resolveOutboundAccount(cfg, accountId) {
	return resolveAccount(cfg ?? {}, accountId);
}
function requireIncomingUrl(account) {
	if (!account.incomingUrl) throw new Error("Synology Chat incoming URL not configured");
	return account.incomingUrl;
}
function normalizeSynologyChatTarget(target) {
	const trimmed = target.trim();
	if (!trimmed) return;
	const chatUserId = parseStrictNonNegativeInteger(trimmed.replace(/^synology(?:[-_]?chat)?:/i, "").trim());
	return chatUserId === void 0 ? void 0 : String(chatUserId);
}
function createSynologyChatSendResult(params) {
	return {
		channel: CHANNEL_ID,
		messageId: "",
		target: {
			kind: "chat",
			id: params.chatId
		},
		receipt: createMessageReceiptFromOutboundResults({
			results: [],
			threadId: params.chatId,
			kind: params.kind
		})
	};
}
async function sendSynologyChatText(ctx) {
	const account = resolveOutboundAccount(ctx.cfg ?? {}, ctx.accountId);
	const incomingUrl = requireIncomingUrl(account);
	const codeRegions = findCodeRegions(ctx.text);
	const text = ctx.text.replace(SYNOLOGY_MARKDOWN_LINK_RE, (match, label, url, offset) => {
		if ((ctx.text.slice(0, offset).match(/\\+$/)?.[0].length ?? 0) % 2 === 1 || isInsideCode(offset, codeRegions) || /[<>|]/.test(label + url)) return match;
		return `<${url.replace(/\\([()])/g, "$1")}|${label.replace(/\\([[\]])/g, "$1")}>`;
	});
	const dispatch = ctx.onPlatformSendDispatch;
	if (!await sendMessage(incomingUrl, text, ctx.to, account.allowInsecureSsl, ...dispatch ? [dispatch] : [])) throw new Error("Failed to send message to Synology Chat");
	return createSynologyChatSendResult({
		chatId: ctx.to,
		kind: "text"
	});
}
async function sendSynologyChatMedia(ctx) {
	const account = resolveOutboundAccount(ctx.cfg ?? {}, ctx.accountId);
	const incomingUrl = requireIncomingUrl(account);
	const prepared = await prepareSynologyHostedMedia({
		account,
		mediaUrl: ctx.mediaUrl,
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile
	});
	const dispatch = ctx.onPlatformSendDispatch;
	const sendResult = await sendHostedFileUrl(incomingUrl, prepared.url, ctx.to, account.allowInsecureSsl, ...dispatch ? [dispatch] : []).catch(async (error) => {
		await Promise.allSettled([prepared.cleanup()]);
		throw error;
	});
	if (sendResult.status === "not-dispatched") {
		await prepared.cleanup();
		throw new Error("Synology Chat attachment request did not start. Retry, and check incomingUrl if it fails again.");
	}
	if (sendResult.status === "rejected") {
		await prepared.cleanup();
		throw new Error("Synology Chat rejected the attachment request");
	}
	if (sendResult.status === "indeterminate") throw new Error("Synology Chat attachment request acceptance could not be confirmed");
	return createSynologyChatSendResult({
		chatId: ctx.to,
		kind: "media"
	});
}
const synologyChatMessageAdapter = defineChannelMessageAdapter({
	id: CHANNEL_ID,
	durableFinal: { capabilities: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	send: {
		text: async (ctx) => await sendSynologyChatText(ctx),
		media: async (ctx) => await sendSynologyChatMedia(ctx)
	}
});
function createSynologyChatPlugin() {
	return createChatChannelPlugin({
		base: {
			id: CHANNEL_ID,
			meta: {
				id: CHANNEL_ID,
				label: "Synology Chat",
				selectionLabel: "Synology Chat (Webhook)",
				detailLabel: "Synology Chat (Webhook)",
				docsPath: "/channels/synology-chat",
				blurb: "Connect your Synology NAS Chat to OpenClaw",
				order: 90
			},
			capabilities: {
				chatTypes: ["direct"],
				media: true,
				threads: false,
				reactions: false,
				edit: false,
				unsend: false,
				reply: false,
				effects: false,
				blockStreaming: false
			},
			reload: { configPrefixes: [`channels.${CHANNEL_ID}`] },
			configSchema: SynologyChatChannelConfigSchema,
			setupContract: synologyChatSetupContract,
			setupWizard: synologyChatSetupWizard,
			config: { ...synologyChatConfigAdapter },
			approvalCapability: synologyChatApprovalAuth,
			doctor: synologyChatDoctor,
			messaging: {
				targetPrefixes: [
					"synology-chat",
					"synology_chat",
					"synology"
				],
				normalizeTarget: normalizeSynologyChatTarget,
				inferTargetChatType: ({ to }) => normalizeSynologyChatTarget(to) ? "direct" : void 0,
				resolveOutboundSessionRoute: ({ agentId, accountId, target }) => {
					const chatUserId = normalizeSynologyChatTarget(target);
					if (!chatUserId) return null;
					const sessionKey = buildSynologyChatOutboundSessionKey({
						agentId,
						accountId: accountId?.trim() || "default",
						chatUserId
					});
					return {
						sessionKey,
						baseSessionKey: sessionKey,
						recipientSessionExact: "delivery-identity",
						peer: {
							kind: "direct",
							id: `chat-api-${chatUserId}`
						},
						chatType: "direct",
						from: `synology-chat:chat-api:${chatUserId}`,
						to: chatUserId
					};
				},
				targetResolver: {
					looksLikeId: (id) => normalizeSynologyChatTarget(id) !== void 0,
					hint: "<userId>"
				}
			},
			directory: createEmptyChannelDirectoryAdapter(),
			status: createComputedAccountStatusAdapter({
				defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
				buildChannelSummary: ({ snapshot }) => ({ webhookPath: snapshot.webhookPath ?? null }),
				resolveAccountSnapshot: ({ account }) => ({
					accountId: account.accountId,
					enabled: account.enabled,
					configured: Boolean(account.token && account.incomingUrl),
					extra: {
						webhookPath: account.webhookPath,
						attachmentsReady: areSynologyAttachmentsReady(account)
					}
				})
			}),
			gateway: {
				startAccount: async (ctx) => {
					const { cfg, accountId, log, abortSignal } = ctx;
					const account = resolveAccount(cfg, accountId);
					if (!validateSynologyGatewayAccountStartup({
						cfg,
						account,
						accountId,
						log
					}).ok) {
						ctx.setStatus?.(channelBlockedPatch("Synology Chat account failed startup validation", {
							accountId,
							running: true
						}));
						return waitUntilAbort(abortSignal);
					}
					log?.info?.(`Starting Synology Chat channel (account: ${accountId}, path: ${account.webhookPath})`);
					const cleanup = await registerSynologyWebhookRoute({
						cfg,
						account,
						accountId,
						log,
						abortSignal
					});
					log?.info?.(`Registered HTTP route: ${account.webhookPath} for Synology Chat`);
					ctx.setStatus?.(channelReadyPatch({ accountId }));
					return waitUntilAbort(abortSignal, async () => {
						log?.info?.(`Stopping Synology Chat channel (account: ${accountId})`);
						await cleanup();
						ctx.setStatus?.(channelStoppedPatch({ accountId }));
					});
				},
				stopAccount: async (ctx) => {
					ctx.log?.info?.(`Synology Chat account ${ctx.accountId} stopped`);
				}
			},
			agentPrompt: { messageToolHints: () => [
				"",
				"### Synology Chat Formatting",
				"Synology Chat supports limited formatting. Use these patterns:",
				"",
				"**Links**: Use `<URL|display text>` to create clickable links.",
				"  Example: `<https://example.com|Click here>` renders as a clickable link.",
				"",
				"**File sharing**: Send files through the media attachment field.",
				"  OpenClaw freezes the bytes and gives the NAS a short-lived download capability (max 32 MB).",
				"",
				"**Limitations**:",
				"- No markdown, bold, italic, or code blocks",
				"- No buttons, cards, or interactive elements",
				"- No message editing after send",
				"- Keep messages under 2000 characters for best readability",
				"",
				"**Best practices**:",
				"- Use short, clear responses (Synology Chat has a minimal UI)",
				"- Use line breaks to separate sections",
				"- Use numbered or bulleted lists for clarity",
				"- Wrap URLs with `<URL|label>` for user-friendly links"
			] },
			message: synologyChatMessageAdapter
		},
		pairing: { text: {
			idLabel: "synologyChatUserId",
			message: "OpenClaw: your access has been approved.",
			normalizeAllowEntry: (entry) => normalizeLowercaseStringOrEmpty(entry),
			notify: async ({ cfg, id, message }) => {
				const account = resolveAccount(cfg);
				if (!account.incomingUrl) return;
				await sendMessage(account.incomingUrl, message, id, account.allowInsecureSsl);
			}
		} },
		security: {
			resolveDmPolicy: resolveSynologyChatDmPolicy,
			collectWarnings: ({ account, cfg }) => [
				...collectSynologyChatSecurityWarnings(account),
				...collectSynologyChatCriticalFindings(account),
				...collectSynologyGatewayRoutingFindings({
					account,
					cfg
				})
			],
			collectAuditFindings: collectSynologyChatSecurityAuditFindings
		},
		outbound: {
			deliveryMode: "gateway",
			chunker: chunkTextForOutbound,
			chunkerMode: "markdown",
			textChunkLimit: SYNOLOGY_CHAT_TEXT_CHUNK_LIMIT,
			sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
			sendText: sendSynologyChatText,
			sendMedia: async (ctx) => {
				if (!ctx.mediaUrl) throw new Error("Synology Chat media send requires mediaUrl");
				return await sendSynologyChatMedia({
					...ctx,
					mediaUrl: ctx.mediaUrl
				});
			}
		}
	});
}
const synologyChatPlugin = createSynologyChatPlugin();
//#endregion
export { synologyChatPlugin as t };
