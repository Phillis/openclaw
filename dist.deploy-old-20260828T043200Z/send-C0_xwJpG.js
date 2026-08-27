import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as writeExternalFileWithinRoot } from "./fs-safe-CmrQUApq.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { r as withTempWorkspace } from "./private-temp-workspace-DLvP_dJe.js";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-BXG5plR9.js";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BIltidPw.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-D2tMUB-B.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-Hm4eS2i0.js";
import "./channel-outbound-0oFCMpw9.js";
import { c as runFfmpeg, l as runFfprobe, o as parseFfprobeCodecAndSampleRate, u as MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS } from "./media-services-B8MVUzbz.js";
import { r as loadWebMediaRaw } from "./web-media-DSbBQ0o1.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import "./temp-path-wP_7naJE.js";
import "./error-runtime-CmA1H4Zg.js";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { n as recordOutboundMessageIdentity } from "./outbound-echo-CyACqynM.js";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-C2UoeqsI.js";
import "./web-media-Cxkh7M6r.js";
import "./ssrf-runtime-CpSMUPcn.js";
import { i as unlinkIfExists } from "./media-runtime-qcekT37I.js";
import "./security-runtime-CYUTzVOk.js";
import "./extension-shared-BO-DUGkx.js";
import "./provider-http-S5IuZe1q.js";
import "./text-utility-runtime-BNhX-3os.js";
import { i as ChannelType } from "./v10-BDbFcnZN.js";
import { At as listGuildActiveThreads, Ct as createGuildEmoji, Dt as getGuild, Et as deleteChannelPermission, Ft as moveGuildChannels, It as putChannelPermission, Lt as removeGuildMember, Mt as listGuildEmojis, Nt as listGuildRoles, Ot as getGuildMember, Pt as listGuildScheduledEvents, Rt as removeGuildMemberRole, St as createGuildChannel, Tt as createGuildSticker, _ as RateLimitError, _t as searchGuildMessages, at as createThread, b as readDiscordMessage, bt as addGuildMemberRole, ct as editChannel, dt as getChannelMessage, g as DiscordError, gt as pinChannelMessage, ht as listChannelPins, jt as listGuildChannels, kt as getGuildVoiceState, lt as editChannelMessage, mt as listChannelMessages, nt as deleteOwnMessageReaction, ot as deleteChannel, pt as listChannelArchivedThreads, rt as listMessageReactionUsers, st as deleteChannelMessage, tt as createOwnMessageReaction, ut as getChannel, v as isUnknownDiscordVoiceStateError, vt as sendChannelTyping, wt as createGuildScheduledEvent, x as readRetryAfter, xt as createGuildBan, y as readDiscordCode, yt as unpinChannelMessage, zt as timeoutGuildMember } from "./discord-Cr3IyWY2.js";
import { T as parseAndResolveChannelRecipient, b as createDiscordMessageNonce, g as DISCORD_MAX_STICKER_BYTES, h as DISCORD_MAX_EVENT_COVER_BYTES, i as formatReactionEmoji, l as resolveChannelId, m as DISCORD_MAX_EMOJI_BYTES, n as buildDiscordTextChunks, o as normalizeEmojiName, p as sendDiscordText, r as buildReactionIdentifier, s as normalizeReactionEmoji, t as buildDiscordSendError, w as resolveDiscordSuppressEmbeds, x as resolveDiscordMessageFlags } from "./send.shared-BHDfKfNT.js";
import { t as parseDiscordRetryAfterBodySeconds } from "./retry-after-0wq-2NFv.js";
import "./send.outbound-DJ9o8c17.js";
import { r as rewriteDiscordKnownMentions } from "./mentions-6W2EaW04.js";
import { r as createDiscordSendResult } from "./send.receipt-lKybbzSF.js";
import { f as resolveDiscordClientAccountContext, l as createDiscordClient, m as DISCORD_REST_TIMEOUT_MS, p as resolveDiscordRest } from "./send.permissions-_uPaFgjs.js";
import { i as recordDiscordMessageCreateAmbiguity, n as createDiscordRetryRunner, t as classifyDiscordDeliveryFailure } from "./retry-fsDEy3oF.js";
import { n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS } from "./timeouts-DfTLdOJX.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
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
function createRateLimitError(response, body) {
	return new RateLimitError(response, body);
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
async function sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, replyTo, request, silent, token, onPlatformSendDispatch) {
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
			await onPlatformSendDispatch?.();
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
			const client = createDiscordClient({
				...opts,
				cfg
			});
			token = client.token;
			rest = client.rest;
			const request = client.request;
			const accountInfo = client.account;
			const recipient = await parseAndResolveChannelRecipient(to, cfg, accountInfo.accountId);
			channelId = (await resolveChannelId(rest, recipient, request)).channelId;
			const ogg = await ensureOggOpus(localInputPath);
			oggPath = ogg.path;
			oggCleanup = ogg.cleanup;
			const metadata = await getVoiceMessageMetadata(oggPath);
			const audioBuffer = await fs.readFile(oggPath);
			const result = await sendDiscordVoiceMessage(rest, channelId, audioBuffer, metadata, opts.reply?.messageId, request, opts.silent, token, opts.onPlatformSendDispatch);
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
//#region extensions/discord/src/send.reactions.ts
function resolveDiscordReactionClient(opts) {
	if (opts.rest && opts.cfg && opts.accountId) return createDiscordClient(opts);
	if (!opts.cfg) throw new Error("Discord reactions requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Discord reactions");
	return createDiscordClient({
		...opts,
		cfg
	});
}
async function reactMessageDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => createOwnMessageReaction(rest, channelId, messageId, encoded), "react");
	return { ok: true };
}
async function removeReactionDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => deleteOwnMessageReaction(rest, channelId, messageId, encoded), "reaction-remove");
	return { ok: true };
}
async function removeOwnReactionsDiscord(channelId, messageId, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const message = await request(() => getChannelMessage(rest, channelId, messageId), "reaction-list");
	const identifiers = /* @__PURE__ */ new Set();
	for (const reaction of message.reactions ?? []) {
		const identifier = reaction.me ? buildReactionIdentifier(reaction.emoji) : void 0;
		if (identifier) identifiers.add(identifier);
	}
	if (identifiers.size === 0) return {
		ok: true,
		removed: []
	};
	const removed = Array.from(identifiers);
	await Promise.all(removed.map((identifier) => request(() => deleteOwnMessageReaction(rest, channelId, messageId, normalizeReactionEmoji(identifier)), "reaction-remove")));
	return {
		ok: true,
		removed
	};
}
async function fetchReactionsDiscord(channelId, messageId, opts) {
	const { rest, request } = resolveDiscordReactionClient(opts);
	const reactions = (await request(() => getChannelMessage(rest, channelId, messageId), "reaction-list")).reactions ?? [];
	if (reactions.length === 0) return [];
	const limit = typeof opts.limit === "number" && Number.isFinite(opts.limit) ? Math.min(Math.max(Math.floor(opts.limit), 1), 100) : 100;
	const summaries = [];
	for (const reaction of reactions) {
		const identifier = buildReactionIdentifier(reaction.emoji);
		if (!identifier) continue;
		const encoded = encodeURIComponent(identifier);
		const users = await request(() => listMessageReactionUsers(rest, channelId, messageId, encoded, { limit }), "reaction-users");
		summaries.push({
			emoji: {
				id: reaction.emoji.id ?? null,
				name: reaction.emoji.name ?? null,
				raw: formatReactionEmoji(reaction.emoji)
			},
			count: reaction.count,
			users: users.map((user) => ({
				id: user.id,
				username: user.username,
				tag: user.username && user.discriminator ? `${user.username}#${user.discriminator}` : user.username
			}))
		});
	}
	return summaries;
}
//#endregion
export { removeRoleDiscord as A, removeChannelPermissionDiscord as B, fetchGuildInfoDiscord as C, kickMemberDiscord as D, fetchVoiceStatusDiscord as E, uploadStickerDiscord as F, createChannelDiscord as I, deleteChannelDiscord as L, timeoutMemberDiscord as M, listGuildEmojisDiscord as N, listGuildChannelsDiscord as O, uploadEmojiDiscord as P, editChannelDiscord as R, fetchChannelInfoDiscord as S, fetchRoleInfoDiscord as T, setChannelPermissionDiscord as V, searchMessagesDiscord as _, sendTypingDiscord as a, banMemberDiscord as b, DiscordThreadInitialMessageError as c, editMessageDiscord as d, fetchMessageDiscord as f, readMessagesDiscord as g, pinMessageDiscord as h, removeReactionDiscord as i, resolveEventCoverImage as j, listScheduledEventsDiscord as k, createThreadDiscord as l, listThreadsDiscord as m, reactMessageDiscord as n, sendVoiceMessageDiscord as o, listPinsDiscord as p, removeOwnReactionsDiscord as r, sendWebhookMessageDiscord as s, fetchReactionsDiscord as t, deleteMessageDiscord as u, unpinMessageDiscord as v, fetchMemberInfoDiscord as w, createScheduledEventDiscord as x, addRoleDiscord as y, moveChannelDiscord as z };
