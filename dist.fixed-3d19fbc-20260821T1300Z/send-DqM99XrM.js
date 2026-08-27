import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString, x as parseStrictFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as writeExternalFileWithinRoot } from "./fs-safe-X_oyl7Rx.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { r as withTempWorkspace } from "./private-temp-workspace-zVw6pimH.js";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-hKtCSlbr.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { h as readResponseTextLimited, p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-Hm4eS2i0.js";
import "./channel-outbound-CP6yKwU3.js";
import { c as runFfmpeg, l as runFfprobe, o as parseFfprobeCodecAndSampleRate, u as MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS } from "./media-services-BhxTAMtw.js";
import { r as loadWebMediaRaw } from "./web-media-DRJtrLMa.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import "./temp-path-Buyb_0PI.js";
import "./error-runtime-oXQewkZq.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./text-utility-runtime-BSdEoze8.js";
import "./extension-shared-D4oakjAV.js";
import "./security-runtime-fAO34zGh.js";
import "./provider-http-D7FntVgP.js";
import { i as unlinkIfExists } from "./media-runtime-B_HWTN-G.js";
import { n as recordOutboundMessageIdentity } from "./outbound-echo-DmYajtce.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-CeK7PFoj.js";
import "./web-media-BtTeEG1w.js";
import { s as resolveDiscordAccount } from "./accounts-nD0JW5tp.js";
import { At as listGuildChannels, Ct as createGuildScheduledEvent, Dt as getGuildMember, Et as getGuild, Ft as putChannelPermission, It as removeGuildMember, Lt as removeGuildMemberRole, Mt as listGuildRoles, Nt as listGuildScheduledEvents, Ot as getGuildVoiceState, Pt as moveGuildChannels, Rt as timeoutGuildMember, St as createGuildEmoji, Tt as deleteChannelPermission, Vt as ChannelType, _ as RateLimitError, _t as sendChannelTyping, at as deleteChannel, b as readDiscordMessage, bt as createGuildBan, ct as editChannelMessage, ft as listChannelArchivedThreads, g as DiscordError, gt as searchGuildMessages, ht as pinChannelMessage, it as createThread, jt as listGuildEmojis, kt as listGuildActiveThreads, lt as getChannel, mt as listChannelPins, ot as deleteChannelMessage, pt as listChannelMessages, st as editChannel, ut as getChannelMessage, v as isUnknownDiscordVoiceStateError, vt as unpinChannelMessage, wt as createGuildSticker, x as readRetryAfter, xt as createGuildChannel, y as readDiscordCode, yt as addGuildMemberRole } from "./discord-CSDU62IF.js";
import { C as DISCORD_MAX_STICKER_BYTES, S as DISCORD_MAX_EVENT_COVER_BYTES, T as parseAndResolveChannelRecipient, _ as resolveDiscordMessageFlags, b as resolveDiscordSuppressEmbeds, g as createDiscordMessageNonce, l as resolveChannelId, n as buildDiscordTextChunks, o as normalizeEmojiName, p as sendDiscordText, t as buildDiscordSendError, x as DISCORD_MAX_EMOJI_BYTES } from "./send.shared-Derjkebj.js";
import { t as parseDiscordRetryAfterBodySeconds } from "./retry-after-BRwE1ySf.js";
import { h as DISCORD_REST_TIMEOUT_MS, m as resolveDiscordRest, p as resolveDiscordClientAccountContext, u as createDiscordClient } from "./send.permissions-Cx7SL08g.js";
import "./send.outbound-CVJHlGgT.js";
import { r as rewriteDiscordKnownMentions } from "./mentions-BfRB7yll.js";
import { r as createDiscordSendResult } from "./send.receipt-pUz0Empg.js";
import { i as recordDiscordMessageCreateAmbiguity, n as createDiscordRetryRunner, t as classifyDiscordDeliveryFailure } from "./retry-CZflNmNM.js";
import { n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS } from "./timeouts-BTHN67kZ.js";
import "./send.reactions-RWLcNk0-.js";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/discord/src/send.channels.ts
async function createChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { name: payload.name };
	if (payload.type !== void 0) body.type = payload.type;
	if (payload.parentId) body.parent_id = payload.parentId;
	if (payload.topic) body.topic = payload.topic;
	if (payload.position !== void 0) body.position = payload.position;
	if (payload.nsfw !== void 0) body.nsfw = payload.nsfw;
	return await createGuildChannel(rest, payload.guildId, { body });
}
async function editChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = {};
	if (payload.name !== void 0) body.name = payload.name;
	if (payload.topic !== void 0) body.topic = payload.topic;
	if (payload.position !== void 0) body.position = payload.position;
	if (payload.parentId !== void 0) body.parent_id = payload.parentId;
	if (payload.nsfw !== void 0) body.nsfw = payload.nsfw;
	if (payload.rateLimitPerUser !== void 0) body.rate_limit_per_user = payload.rateLimitPerUser;
	if (payload.archived !== void 0) body.archived = payload.archived;
	if (payload.locked !== void 0) body.locked = payload.locked;
	if (payload.autoArchiveDuration !== void 0) body.auto_archive_duration = payload.autoArchiveDuration;
	if (payload.availableTags !== void 0) body.available_tags = payload.availableTags.map((t) => ({
		...t.id !== void 0 && { id: t.id },
		name: t.name,
		...t.moderated !== void 0 && { moderated: t.moderated },
		...t.emoji_id !== void 0 && { emoji_id: t.emoji_id },
		...t.emoji_name !== void 0 && { emoji_name: t.emoji_name }
	}));
	return await editChannel(rest, payload.channelId, { body });
}
async function deleteChannelDiscord(channelId, opts) {
	await deleteChannel(resolveDiscordRest(opts), channelId);
	return {
		ok: true,
		channelId
	};
}
async function moveChannelDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = [{
		id: payload.channelId,
		...payload.parentId !== void 0 && { parent_id: payload.parentId },
		...payload.position !== void 0 && { position: payload.position }
	}];
	await moveGuildChannels(rest, payload.guildId, { body });
	return { ok: true };
}
async function setChannelPermissionDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const body = { type: payload.targetType };
	if (payload.allow !== void 0) body.allow = payload.allow;
	if (payload.deny !== void 0) body.deny = payload.deny;
	await putChannelPermission(rest, payload.channelId, payload.targetId, { body });
	return { ok: true };
}
async function removeChannelPermissionDiscord(channelId, targetId, opts) {
	await deleteChannelPermission(resolveDiscordRest(opts), channelId, targetId);
	return { ok: true };
}
//#endregion
//#region extensions/discord/src/send.emojis-stickers.ts
async function listGuildEmojisDiscord(guildId, opts) {
	return await listGuildEmojis(resolveDiscordRest(opts), guildId);
}
async function uploadEmojiDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const media = await loadWebMediaRaw(payload.mediaUrl, DISCORD_MAX_EMOJI_BYTES);
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || ![
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/gif"
	].includes(contentType)) throw new Error("Discord emoji uploads require a PNG, JPG, or GIF image");
	const image = `data:${contentType};base64,${media.buffer.toString("base64")}`;
	const roleIds = normalizeStringEntries(payload.roleIds ?? []);
	return await createGuildEmoji(rest, payload.guildId, { body: {
		name: normalizeEmojiName(payload.name, "Emoji name"),
		image,
		roles: roleIds.length ? roleIds : void 0
	} });
}
async function uploadStickerDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const media = await loadWebMediaRaw(payload.mediaUrl, DISCORD_MAX_STICKER_BYTES);
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || ![
		"image/png",
		"image/apng",
		"application/json"
	].includes(contentType)) throw new Error("Discord sticker uploads require a PNG, APNG, or Lottie JSON file");
	return await createGuildSticker(rest, payload.guildId, {
		multipartStyle: "form",
		body: {
			name: normalizeEmojiName(payload.name, "Sticker name"),
			description: normalizeEmojiName(payload.description, "Sticker description"),
			tags: normalizeEmojiName(payload.tags, "Sticker tags"),
			files: [{
				data: media.buffer,
				fieldName: "file",
				name: media.fileName ?? "sticker",
				contentType
			}]
		}
	});
}
//#endregion
//#region extensions/discord/src/send.guild.ts
async function fetchMemberInfoDiscord(guildId, userId, opts) {
	return await getGuildMember(resolveDiscordRest(opts), guildId, userId);
}
async function fetchRoleInfoDiscord(guildId, opts) {
	return await listGuildRoles(resolveDiscordRest(opts), guildId);
}
async function addRoleDiscord(payload, opts) {
	await addGuildMemberRole(resolveDiscordRest(opts), payload.guildId, payload.userId, payload.roleId);
	return { ok: true };
}
async function removeRoleDiscord(payload, opts) {
	await removeGuildMemberRole(resolveDiscordRest(opts), payload.guildId, payload.userId, payload.roleId);
	return { ok: true };
}
async function fetchChannelInfoDiscord(channelId, opts) {
	return await getChannel(resolveDiscordRest(opts), channelId);
}
async function fetchGuildInfoDiscord(guildId, opts) {
	return await getGuild(resolveDiscordRest(opts), guildId);
}
async function listGuildChannelsDiscord(guildId, opts) {
	return await listGuildChannels(resolveDiscordRest(opts), guildId);
}
async function fetchVoiceStatusDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		return await getGuildVoiceState(rest, guildId, userId);
	} catch (err) {
		if (!isUnknownDiscordVoiceStateError(err)) throw err;
		return {
			guild_id: guildId,
			user_id: userId,
			channel_id: null,
			connected: false,
			absent: true,
			reason: "unknown_voice_state"
		};
	}
}
async function listScheduledEventsDiscord(guildId, opts) {
	return await listGuildScheduledEvents(resolveDiscordRest(opts), guildId);
}
const ALLOWED_EVENT_COVER_TYPES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/gif"
]);
async function resolveEventCoverImage(imageUrl, opts) {
	const media = await loadWebMediaRaw(imageUrl, DISCORD_MAX_EVENT_COVER_BYTES, { localRoots: opts?.localRoots });
	const contentType = normalizeOptionalLowercaseString(media.contentType);
	if (!contentType || !ALLOWED_EVENT_COVER_TYPES.has(contentType)) throw new Error(`Discord event cover images must be PNG, JPG, or GIF (got ${contentType ?? "unknown"})`);
	return `data:${contentType};base64,${media.buffer.toString("base64")}`;
}
async function createScheduledEventDiscord(guildId, payload, opts) {
	return await createGuildScheduledEvent(resolveDiscordRest(opts), guildId, payload);
}
async function timeoutMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	let until = payload.until;
	if (!until && payload.durationMinutes) {
		until = timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(payload.durationMinutes * 60 * 1e3));
		if (!until) throw new Error("Discord timeout duration is outside the supported Date range");
	}
	return await timeoutGuildMember(rest, payload.guildId, payload.userId, {
		body: { communication_disabled_until: until ?? null },
		headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0
	});
}
async function kickMemberDiscord(payload, opts) {
	await removeGuildMember(resolveDiscordRest(opts), payload.guildId, payload.userId, { headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0 });
	return { ok: true };
}
async function banMemberDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	const deleteMessageDays = typeof payload.deleteMessageDays === "number" && Number.isFinite(payload.deleteMessageDays) ? Math.min(Math.max(Math.floor(payload.deleteMessageDays), 0), 7) : void 0;
	await createGuildBan(rest, payload.guildId, payload.userId, {
		body: deleteMessageDays !== void 0 ? { delete_message_days: deleteMessageDays } : void 0,
		headers: payload.reason ? { "X-Audit-Log-Reason": encodeURIComponent(payload.reason) } : void 0
	});
	return { ok: true };
}
//#endregion
//#region extensions/discord/src/send.messages.ts
const DISCORD_THREAD_TRANSPORT_ONLY_MAX_LINES = Number.MAX_SAFE_INTEGER;
function resolveDiscordThreadStarterMessageId(thread) {
	const starterMessage = "message" in thread ? thread.message : void 0;
	if (starterMessage && typeof starterMessage === "object" && "id" in starterMessage && typeof starterMessage.id === "string") return starterMessage.id;
	return thread.id;
}
function assertDiscordResponseArray(value, label) {
	if (!Array.isArray(value)) throw new Error(`Unexpected Discord response for ${label}: expected array.`);
	return value;
}
function assertDiscordResponseObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Unexpected Discord response for ${label}: expected object.`);
	return value;
}
function resolveDefaultThreadAutoArchiveDuration(channel) {
	if (!channel || !("default_auto_archive_duration" in channel)) return;
	return channel.default_auto_archive_duration;
}
function describeDiscordThreadInitialMessageFailure(delivery) {
	if (delivery?.failedChunkDelivery === "unknown") return delivery.deliveredChunkCount > 0 ? "Discord thread was created, but delivery of the remaining initial content could not be confirmed" : "Discord thread was created, but initial message delivery could not be confirmed";
	return delivery && delivery.deliveredChunkCount > 0 ? "Discord thread was created, but its initial content was only partially delivered" : "Discord thread was created, but sending the initial message failed";
}
var DiscordThreadInitialMessageError = class extends Error {
	constructor(thread, error, initialMessageDelivery) {
		const initialMessageError = formatErrorMessage(error);
		const initialMessageWarning = describeDiscordThreadInitialMessageFailure(initialMessageDelivery);
		super(`${initialMessageWarning}: ${initialMessageError}`, { cause: error });
		this.name = "DiscordThreadInitialMessageError";
		this.initialMessageDelivery = initialMessageDelivery ? {
			...initialMessageDelivery,
			deliveredMessageIds: [...initialMessageDelivery.deliveredMessageIds]
		} : void 0;
		this.initialMessageError = initialMessageError;
		this.initialMessageWarning = initialMessageWarning;
		this.thread = thread;
	}
};
async function readMessagesDiscord(channelId, query, opts) {
	const messageQuery = query ?? {};
	const rest = resolveDiscordRest(opts);
	const limit = typeof messageQuery.limit === "number" && Number.isFinite(messageQuery.limit) ? Math.min(Math.max(Math.floor(messageQuery.limit), 1), 100) : void 0;
	const params = {};
	if (limit) params.limit = limit;
	if (messageQuery.before) params.before = messageQuery.before;
	if (messageQuery.after) params.after = messageQuery.after;
	if (messageQuery.around) params.around = messageQuery.around;
	return assertDiscordResponseArray(await listChannelMessages(rest, channelId, params), "message read");
}
async function fetchMessageDiscord(channelId, messageId, opts) {
	return await getChannelMessage(resolveDiscordRest(opts), channelId, messageId);
}
async function editMessageDiscord(channelId, messageId, payload, opts) {
	return await editChannelMessage(resolveDiscordRest(opts), channelId, messageId, { body: {
		content: payload.content,
		...payload.flags !== void 0 ? { flags: payload.flags } : {}
	} });
}
async function deleteMessageDiscord(channelId, messageId, opts) {
	await deleteChannelMessage(resolveDiscordRest(opts), channelId, messageId);
	return { ok: true };
}
async function pinMessageDiscord(channelId, messageId, opts) {
	await pinChannelMessage(resolveDiscordRest(opts), channelId, messageId);
	return { ok: true };
}
async function unpinMessageDiscord(channelId, messageId, opts) {
	await unpinChannelMessage(resolveDiscordRest(opts), channelId, messageId);
	return { ok: true };
}
async function listPinsDiscord(channelId, opts) {
	return await listChannelPins(resolveDiscordRest(opts), channelId);
}
async function createThreadDiscord(channelId, payload, opts) {
	const { rest, request } = createDiscordClient(opts);
	const body = { name: payload.name };
	if (!payload.messageId && payload.type !== void 0) body.type = payload.type;
	let channel;
	if (!payload.messageId) try {
		channel = await getChannel(rest, channelId);
	} catch {}
	const archiveDuration = payload.autoArchiveMinutes ?? resolveDefaultThreadAutoArchiveDuration(channel);
	if (archiveDuration !== void 0) body.auto_archive_duration = archiveDuration;
	const isForumLike = channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
	const initialMessageChunks = buildDiscordTextChunks(isForumLike ? payload.content?.trim() ? payload.content : payload.name : payload.content?.trim() ? payload.content : "", { maxLinesPerMessage: DISCORD_THREAD_TRANSPORT_ONLY_MAX_LINES });
	if (isForumLike) {
		body.message = { content: initialMessageChunks[0] ?? payload.name };
		if (payload.appliedTags?.length) body.applied_tags = payload.appliedTags;
	}
	if (!payload.messageId && !isForumLike && body.type === void 0) body.type = ChannelType.PublicThread;
	const thread = await createThread(rest, channelId, { body }, payload.messageId);
	const followupChunks = isForumLike ? initialMessageChunks.slice(1) : initialMessageChunks;
	if (followupChunks.length && "id" in thread) {
		const deliveredMessageIds = isForumLike ? [resolveDiscordThreadStarterMessageId(thread)] : [];
		let deliveredChunkCount = isForumLike ? 1 : 0;
		const firstFollowupChunkIndex = isForumLike ? 1 : 0;
		for (const [followupIndex, content] of followupChunks.entries()) {
			let chunkMayHaveDelivered = false;
			const trackedRequest = (fn, label, options) => request(async () => {
				try {
					return await fn();
				} catch (error) {
					chunkMayHaveDelivered ||= classifyDiscordDeliveryFailure(error) === "ambiguous";
					throw error;
				}
			}, label, options);
			try {
				const result = await sendDiscordText({
					rest,
					request: trackedRequest,
					channelId: thread.id,
					text: content,
					maxLinesPerMessage: DISCORD_THREAD_TRANSPORT_ONLY_MAX_LINES
				});
				deliveredMessageIds.push(...result.platformMessageIds);
				deliveredChunkCount += 1;
			} catch (error) {
				const finalFailure = classifyDiscordDeliveryFailure(error);
				const failedChunkDelivery = chunkMayHaveDelivered || finalFailure === "ambiguous" || finalFailure === "unknown" ? "unknown" : "not_delivered";
				if (failedChunkDelivery === "unknown") recordDiscordMessageCreateAmbiguity(error);
				throw new DiscordThreadInitialMessageError(thread, error, {
					starterMessageDelivered: isForumLike,
					deliveredChunkCount,
					deliveredMessageIds,
					failedChunkDelivery,
					failedChunkIndex: firstFollowupChunkIndex + followupIndex,
					totalChunkCount: initialMessageChunks.length
				});
			}
		}
	}
	return thread;
}
async function listThreadsDiscord(payload, opts) {
	const rest = resolveDiscordRest(opts);
	if (payload.includeArchived) {
		if (!payload.channelId) throw new Error("channelId required to list archived threads");
		const params = {};
		if (payload.before) params.before = payload.before;
		if (payload.limit) params.limit = payload.limit;
		return await listChannelArchivedThreads(rest, payload.channelId, params);
	}
	return await listGuildActiveThreads(rest, payload.guildId);
}
async function searchMessagesDiscord(query, opts) {
	const rest = resolveDiscordRest(opts);
	const params = new URLSearchParams();
	params.set("content", query.content);
	if (query.channelIds?.length) for (const channelId of query.channelIds) params.append("channel_id", channelId);
	if (query.authorIds?.length) for (const authorId of query.authorIds) params.append("author_id", authorId);
	if (query.limit) {
		const limit = Math.min(Math.max(Math.floor(query.limit), 1), 25);
		params.set("limit", String(limit));
	}
	const result = assertDiscordResponseObject(await searchGuildMessages(rest, query.guildId, params), "message search");
	if (result.code === 11e4) {
		const message = typeof result.message === "string" && result.message.trim() ? result.message.trim() : "Discord search index is not yet available";
		const retryAfter = parseDiscordRetryAfterBodySeconds(result.retry_after);
		const retryHint = retryAfter === void 0 ? "" : ` (retry after ${retryAfter}s)`;
		throw new Error(`Discord message search unavailable: ${message}${retryHint}`);
	}
	if (!Array.isArray(result.messages)) throw new Error("Unexpected Discord response for message search: expected messages array.");
	return result;
}
//#endregion
//#region extensions/discord/src/send.webhook.ts
const DISCORD_WEBHOOK_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const DISCORD_WEBHOOK_TIMEOUT_MS = DISCORD_REST_TIMEOUT_MS;
function resolveWebhookExecutionUrl(params) {
	const baseUrl = new URL(`https://discord.com/api/v10/webhooks/${encodeURIComponent(params.webhookId)}/${encodeURIComponent(params.webhookToken)}`);
	baseUrl.searchParams.set("wait", params.wait === false ? "false" : "true");
	if (params.threadId !== void 0 && params.threadId !== null && params.threadId !== "") baseUrl.searchParams.set("thread_id", String(params.threadId));
	return baseUrl.toString();
}
function coerceWebhookErrorBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return { message: truncateUtf16Safe(raw, 200) };
	}
}
function throwIfWebhookDeadlineExpired(signal) {
	if (!signal?.aborted) return;
	throw signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Discord webhook send timed out");
}
async function throwWebhookResponseError(response, signal) {
	const parsed = coerceWebhookErrorBody(await readResponseTextLimited(response, DISCORD_WEBHOOK_ERROR_BODY_LIMIT_BYTES, { chunkTimeoutMs: DISCORD_WEBHOOK_TIMEOUT_MS }).catch(() => {
		throwIfWebhookDeadlineExpired(signal);
		return "";
	}));
	if (response.status === 429) throw new RateLimitError(response, {
		message: readDiscordMessage(parsed, "Rate limited"),
		retry_after: readRetryAfter(parsed, response, 1),
		code: readDiscordCode(parsed),
		global: parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false
	});
	throw new DiscordError(response, parsed);
}
async function sendWebhookMessageDiscord(text, opts) {
	const webhookId = normalizeOptionalString(opts.webhookId) ?? "";
	const webhookToken = normalizeOptionalString(opts.webhookToken) ?? "";
	if (!webhookId || !webhookToken) throw new Error("Discord webhook id/token are required");
	const replyTo = normalizeOptionalString(opts.replyTo) ?? "";
	const messageReference = replyTo ? {
		message_id: replyTo,
		fail_if_not_exists: false
	} : void 0;
	const { account, proxyFetch } = resolveDiscordClientAccountContext({
		cfg: opts.cfg,
		accountId: opts.accountId
	});
	const rewrittenText = rewriteDiscordKnownMentions(text, {
		accountId: account.accountId,
		mentionAliases: account.config.mentionAliases
	});
	const flags = resolveDiscordMessageFlags({ suppressEmbeds: resolveDiscordSuppressEmbeds({ configured: account.config.suppressEmbeds }) });
	const threadConversationId = opts.threadId == null ? "" : String(opts.threadId).trim();
	if (threadConversationId) recordOutboundMessageIdentity({
		channel: "discord",
		accountId: account.accountId,
		conversationId: threadConversationId,
		sourceId: webhookId
	});
	const url = resolveWebhookExecutionUrl({
		webhookId,
		webhookToken,
		threadId: opts.threadId,
		wait: opts.wait
	});
	const deadline = buildTimeoutAbortSignal({
		timeoutMs: DISCORD_WEBHOOK_TIMEOUT_MS,
		operation: "discord.webhook.send"
	});
	const request = createDiscordRetryRunner({ signal: deadline.signal });
	try {
		const response = await request(async () => {
			await opts.onPlatformSendDispatch?.();
			const attemptResponse = await (proxyFetch ?? fetch)(url, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					content: rewrittenText,
					username: normalizeOptionalString(opts.username),
					avatar_url: normalizeOptionalString(opts.avatarUrl),
					...flags ? { flags } : {},
					...messageReference ? { message_reference: messageReference } : {}
				}),
				signal: deadline.signal
			});
			if (!attemptResponse.ok) await throwWebhookResponseError(attemptResponse, deadline.signal);
			return attemptResponse;
		}, "webhook", { safety: "non-idempotent-create" });
		const payload = response.status === 204 ? {} : await readProviderJsonResponse(response, "Discord webhook send").catch(() => {
			throwIfWebhookDeadlineExpired(deadline.signal);
			return {};
		});
		try {
			recordChannelActivity({
				channel: "discord",
				accountId: account.accountId,
				direction: "outbound"
			});
		} catch {}
		const result = createDiscordSendResult({
			result: payload,
			fallbackChannelId: opts.threadId ? String(opts.threadId) : "",
			kind: "text",
			...opts.threadId != null ? { threadId: opts.threadId } : {},
			...replyTo ? { replyToId: replyTo } : {}
		});
		const resultConversationId = result.channelId.trim();
		if (result.messageId !== "unknown" && resultConversationId) recordOutboundMessageIdentity({
			channel: "discord",
			accountId: account.accountId,
			conversationId: resultConversationId,
			messageId: result.messageId,
			sourceId: webhookId
		});
		return result;
	} finally {
		deadline.cleanup();
	}
}
//#endregion
//#region extensions/discord/src/voice-message.ts
/**
* Discord Voice Message Support
*
* Implements sending voice messages via Discord's API.
* Voice messages require:
* - OGG/Opus format audio
* - Waveform data (base64 encoded, up to 256 samples, 0-255 values)
* - Duration in seconds
* - Message flag 8192 (IS_VOICE_MESSAGE)
* - No other content (text, embeds, etc.)
*/
const DISCORD_VOICE_MESSAGE_FLAG = 8192;
const WAVEFORM_SAMPLES = 256;
const DISCORD_OPUS_SAMPLE_RATE_HZ = 48e3;
const DISCORD_VOICE_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const DISCORD_VOICE_UPLOAD_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true
};
async function runFfmpegToOutput(params) {
	const rootDir = path.dirname(params.outputPath);
	await fs.mkdir(rootDir, { recursive: true });
	await writeExternalFileWithinRoot({
		rootDir,
		path: path.basename(params.outputPath),
		write: async (tempPath) => {
			await runFfmpeg(params.buildArgs(tempPath));
		}
	});
}
function createRateLimitError(response, body, request) {
	return new RateLimitError(response, body, request ?? new Request("https://discord.com/api/v10/channels/voice/messages", { method: "POST" }));
}
/**
* Get audio duration using ffprobe
*/
async function getAudioDuration(filePath) {
	try {
		const duration = parseStrictFiniteNumber(await runFfprobe([
			"-v",
			"error",
			"-show_entries",
			"format=duration",
			"-of",
			"csv=p=0",
			filePath
		]));
		if (duration === void 0) throw new Error("Could not parse duration");
		return Math.round(duration * 100) / 100;
	} catch (err) {
		const errMessage = formatErrorMessage(err);
		throw new Error(`Failed to get audio duration: ${errMessage}`, { cause: err });
	}
}
/**
* Generate waveform data from audio file using ffmpeg
* Returns base64 encoded byte array of amplitude samples (0-255)
*/
async function generateWaveform(filePath) {
	try {
		return await generateWaveformFromPcm(filePath);
	} catch {
		return generatePlaceholderWaveform();
	}
}
/**
* Generate waveform by extracting raw PCM data and sampling amplitudes
*/
async function generateWaveformFromPcm(filePath) {
	const tempDir = resolvePreferredOpenClawTmpDir();
	const tempPcm = path.join(tempDir, `waveform-${crypto.randomUUID()}.raw`);
	try {
		await runFfmpegToOutput({
			outputPath: tempPcm,
			buildArgs: (outputPath) => [
				"-y",
				"-i",
				filePath,
				"-vn",
				"-sn",
				"-dn",
				"-t",
				String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
				"-f",
				"s16le",
				"-acodec",
				"pcm_s16le",
				"-ac",
				"1",
				"-ar",
				"8000",
				outputPath
			]
		});
		const pcmData = await fs.readFile(tempPcm);
		const samples = new Int16Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength / 2);
		const step = Math.max(1, Math.floor(samples.length / WAVEFORM_SAMPLES));
		const waveform = [];
		for (let i = 0; i < WAVEFORM_SAMPLES && i * step < samples.length; i++) {
			let sum = 0;
			let count = 0;
			for (let j = 0; j < step && i * step + j < samples.length; j++) {
				sum += Math.abs(expectDefined(samples.at(i * step + j), "bounded PCM waveform sample"));
				count++;
			}
			const avg = count > 0 ? sum / count : 0;
			const normalized = Math.min(255, Math.round(avg / 32767 * 255));
			waveform.push(normalized);
		}
		while (waveform.length < WAVEFORM_SAMPLES) waveform.push(0);
		return Buffer.from(waveform).toString("base64");
	} finally {
		await unlinkIfExists(tempPcm);
	}
}
/**
* Generate a placeholder waveform (for when audio processing fails)
*/
function generatePlaceholderWaveform() {
	const waveform = [];
	for (let i = 0; i < WAVEFORM_SAMPLES; i++) {
		const value = Math.round(128 + 64 * Math.sin(i / WAVEFORM_SAMPLES * Math.PI * 8));
		waveform.push(Math.min(255, Math.max(0, value)));
	}
	return Buffer.from(waveform).toString("base64");
}
/**
* Convert audio file to OGG/Opus format if needed
* Returns path to the OGG file (may be same as input if already OGG/Opus)
*/
async function ensureOggOpus(filePath) {
	const trimmed = filePath.trim();
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) throw new Error(`Voice message conversion requires a local file path; received a URL/protocol source: ${trimmed}`);
	if (normalizeLowercaseStringOrEmpty(path.extname(filePath)) === ".ogg") try {
		const { codec, sampleRateHz } = parseFfprobeCodecAndSampleRate(await runFfprobe([
			"-v",
			"error",
			"-select_streams",
			"a:0",
			"-show_entries",
			"stream=codec_name,sample_rate",
			"-of",
			"csv=p=0",
			filePath
		]));
		if (codec === "opus" && sampleRateHz === DISCORD_OPUS_SAMPLE_RATE_HZ) return {
			path: filePath,
			cleanup: false
		};
	} catch {}
	const tempDir = resolvePreferredOpenClawTmpDir();
	const outputPath = path.join(tempDir, `voice-${crypto.randomUUID()}.ogg`);
	await runFfmpegToOutput({
		outputPath,
		buildArgs: (tempPath) => [
			"-y",
			"-i",
			filePath,
			"-vn",
			"-sn",
			"-dn",
			"-t",
			String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
			"-ar",
			String(DISCORD_OPUS_SAMPLE_RATE_HZ),
			"-c:a",
			"libopus",
			"-b:a",
			"64k",
			"-f",
			"ogg",
			tempPath
		]
	});
	return {
		path: outputPath,
		cleanup: true
	};
}
/**
* Get voice message metadata (duration and waveform)
*/
async function getVoiceMessageMetadata(filePath) {
	const [durationSecs, waveform] = await Promise.all([getAudioDuration(filePath), generateWaveform(filePath)]);
	return {
		durationSecs,
		waveform
	};
}
function coerceDiscordErrorBody(raw) {
	if (!raw) return;
	try {
		return JSON.parse(raw);
	} catch {
		return { message: truncateUtf16Safe(raw, 200) };
	}
}
async function createVoiceRequestError(response, fallbackMessage) {
	const parsed = coerceDiscordErrorBody(await readResponseTextLimited(response, DISCORD_VOICE_ERROR_BODY_LIMIT_BYTES).catch(() => ""));
	if (response.status === 429) throw createRateLimitError(response, {
		message: readDiscordMessage(parsed, "You are being rate limited."),
		retry_after: readRetryAfter(parsed, response, 1),
		global: parsed && typeof parsed === "object" && "global" in parsed ? Boolean(parsed.global) : false
	});
	return new DiscordError(response, parsed ?? { message: fallbackMessage });
}
async function requestVoiceUploadUrl(params) {
	const { response: res, release } = await fetchWithSsrFGuard({
		url: `${params.rest.options?.baseUrl ?? "https://discord.com/api"}/channels/${params.channelId}/attachments`,
		init: {
			method: "POST",
			headers: {
				Authorization: `Bot ${params.botToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ files: [{
				filename: params.filename,
				file_size: params.fileSize,
				id: "0"
			}] })
		},
		timeoutMs: params.rest.options.timeout,
		policy: DISCORD_VOICE_UPLOAD_SSRF_POLICY,
		auditContext: "discord.voice.upload-url"
	});
	try {
		if (!res.ok) throw await createVoiceRequestError(res, "Upload URL request failed");
		return await readProviderJsonResponse(res, "discord.voice.upload-url");
	} finally {
		await release();
	}
}
async function uploadVoiceAttachment(params) {
	const { response: uploadResponse, release } = await fetchWithSsrFGuard({
		url: params.uploadUrl,
		init: {
			method: "PUT",
			headers: { "Content-Type": "audio/ogg" },
			body: new Uint8Array(params.audioBuffer)
		},
		timeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
		policy: DISCORD_VOICE_UPLOAD_SSRF_POLICY,
		auditContext: "discord.voice.attachment-upload"
	});
	try {
		if (!uploadResponse.ok) throw await createVoiceRequestError(uploadResponse, "Failed to upload voice message");
		await uploadResponse.body?.cancel().catch(() => void 0);
	} finally {
		await release();
	}
}
/**
* Send a voice message to Discord
*
* This follows Discord's voice message protocol:
* 1. Request upload URL from Discord
* 2. Upload the OGG file to the provided URL
* 3. Send the message with flag 8192 and attachment metadata
*/
async function sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, replyTo, request, silent, token) {
	const filename = "voice-message.ogg";
	const fileSize = audioBuffer.byteLength;
	const botToken = token;
	if (!botToken) throw new Error("Discord bot token is required for voice message upload");
	const { upload_filename } = await request(async () => {
		const uploadUrlResponse = await requestVoiceUploadUrl({
			rest,
			channelId,
			botToken,
			filename,
			fileSize
		});
		if (!uploadUrlResponse.attachments?.[0]) throw new Error("Failed to get upload URL for voice message");
		const attachment = uploadUrlResponse.attachments[0];
		await uploadVoiceAttachment({
			uploadUrl: attachment.upload_url,
			audioBuffer
		});
		return attachment;
	}, "voice-upload");
	const messagePayload = {
		flags: silent ? 12288 : DISCORD_VOICE_MESSAGE_FLAG,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		attachments: [{
			id: "0",
			filename,
			uploaded_filename: upload_filename,
			duration_secs: metadata.durationSecs,
			waveform: metadata.waveform
		}]
	};
	if (replyTo) messagePayload.message_reference = {
		message_id: replyTo,
		fail_if_not_exists: false
	};
	let messageCreateMayHaveCommitted = false;
	try {
		return await request(async () => {
			try {
				return await rest.post(`/channels/${channelId}/messages`, { body: messagePayload });
			} catch (error) {
				messageCreateMayHaveCommitted ||= classifyDiscordDeliveryFailure(error) === "ambiguous";
				throw error;
			}
		}, "voice-message", { safety: "nonce-protected-create" });
	} catch (error) {
		if (messageCreateMayHaveCommitted) recordDiscordMessageCreateAmbiguity(error);
		throw error;
	}
}
//#endregion
//#region extensions/discord/src/send.voice.ts
function toDiscordSendResult(result, fallbackChannelId, reply) {
	return createDiscordSendResult({
		result,
		fallbackChannelId,
		kind: "voice",
		reply
	});
}
async function withMaterializedVoiceMessageInput(mediaUrl, opts, run) {
	const media = await loadWebMediaRaw(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes: maxBytesForKind("audio"),
		mediaAccess: opts.mediaAccess,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile
	}));
	const extFromName = media.fileName ? path.extname(media.fileName) : "";
	const extFromMime = media.contentType ? extensionForMime(media.contentType) : "";
	const ext = extFromName || extFromMime || ".bin";
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "voice-src-"
	}, async (workspace) => await run(await workspace.write(`input${ext}`, media.buffer)));
}
/**
* Send a voice message to Discord.
*
* Voice messages are a special Discord feature that displays audio with a waveform
* visualization. They require OGG/Opus format and cannot include text content.
*
* @param to - Recipient (user ID for DM or channel ID)
* @param audioPath - Path to local audio file (will be converted to OGG/Opus if needed)
* @param opts - Send options
*/
async function sendVoiceMessageDiscord(to, audioPath, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord voice send");
	return await withMaterializedVoiceMessageInput(audioPath, opts, async (localInputPath) => {
		let oggPath = null;
		let oggCleanup = false;
		let token;
		let rest;
		let channelId;
		try {
			const accountInfo = resolveDiscordAccount({
				cfg,
				accountId: opts.accountId
			});
			const client = createDiscordClient({
				...opts,
				cfg
			});
			token = client.token;
			rest = client.rest;
			const request = client.request;
			const recipient = await parseAndResolveChannelRecipient(to, cfg, opts.accountId);
			channelId = (await resolveChannelId(rest, recipient, request)).channelId;
			const ogg = await ensureOggOpus(localInputPath);
			oggPath = ogg.path;
			oggCleanup = ogg.cleanup;
			const metadata = await getVoiceMessageMetadata(oggPath);
			const audioBuffer = await fs.readFile(oggPath);
			await opts.onPlatformSendDispatch?.();
			const result = await sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, opts.reply?.messageId, request, opts.silent, token);
			recordChannelActivity({
				channel: "discord",
				accountId: accountInfo.accountId,
				direction: "outbound"
			});
			return toDiscordSendResult(result, channelId, opts.reply);
		} catch (err) {
			if (channelId && rest && token) throw await buildDiscordSendError(err, {
				channelId,
				cfg,
				rest,
				token,
				hasMedia: true
			});
			throw err;
		} finally {
			await unlinkIfExists(oggCleanup ? oggPath : null);
		}
	});
}
//#endregion
//#region extensions/discord/src/send.typing.ts
async function sendTypingDiscord(channelId, opts) {
	await sendChannelTyping(resolveDiscordRest(opts), channelId);
	return {
		ok: true,
		channelId
	};
}
//#endregion
export { uploadEmojiDiscord as A, kickMemberDiscord as C, resolveEventCoverImage as D, removeRoleDiscord as E, moveChannelDiscord as F, removeChannelPermissionDiscord as I, setChannelPermissionDiscord as L, createChannelDiscord as M, deleteChannelDiscord as N, timeoutMemberDiscord as O, editChannelDiscord as P, fetchVoiceStatusDiscord as S, listScheduledEventsDiscord as T, createScheduledEventDiscord as _, createThreadDiscord as a, fetchMemberInfoDiscord as b, fetchMessageDiscord as c, pinMessageDiscord as d, readMessagesDiscord as f, banMemberDiscord as g, addRoleDiscord as h, DiscordThreadInitialMessageError as i, uploadStickerDiscord as j, listGuildEmojisDiscord as k, listPinsDiscord as l, unpinMessageDiscord as m, sendVoiceMessageDiscord as n, deleteMessageDiscord as o, searchMessagesDiscord as p, sendWebhookMessageDiscord as r, editMessageDiscord as s, sendTypingDiscord as t, listThreadsDiscord as u, fetchChannelInfoDiscord as v, listGuildChannelsDiscord as w, fetchRoleInfoDiscord as x, fetchGuildInfoDiscord as y };
