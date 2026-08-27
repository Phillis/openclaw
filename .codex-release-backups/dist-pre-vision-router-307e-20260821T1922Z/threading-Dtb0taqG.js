import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { t as createReplyReferencePlanner } from "./reply-reference-cLEWJ7Kr.js";
import { t as buildAgentSessionKey } from "./resolve-route-CUq-ePT_.js";
import { t as resolveChannelModelOverride } from "./model-overrides-PaNQoP9f.js";
import "./runtime-env-COkbgBI4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import "./text-utility-runtime-LRU688AB.js";
import { t as generateConversationLabel } from "./conversation-label-generator-DhMqKrgU.js";
import "./reply-dispatch-runtime-CiOXlp7K.js";
import "./reply-reference-cJj4KEHq.js";
import "./model-session-runtime-CfUSUFtU.js";
import { Vt as ChannelType, it as createThread, st as editChannel, ut as getChannelMessage } from "./discord-BinpTEur.js";
import { a as resolveDiscordChannelParentSafe, i as resolveDiscordChannelParentIdSafe, r as resolveDiscordChannelNameSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-C12aDZ0p.js";
import { a as formatDiscordMediaText, d as resolveDiscordChannelInfo, f as resolveDiscordMessageChannelId, n as resolveDiscordForwardedMessagesTextFromSnapshots, t as resolveDiscordEmbedText } from "./message-utils-DAe0TniR.js";
//#region extensions/discord/src/monitor/thread-title.ts
const DEFAULT_THREAD_TITLE_TIMEOUT_MS = 6e4;
const MAX_THREAD_TITLE_SOURCE_CHARS = 600;
const MAX_THREAD_TITLE_CHANNEL_NAME_CHARS = 120;
const MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS = 320;
const DISCORD_THREAD_TITLE_SYSTEM_PROMPT = "Generate a concise Discord thread title (3-6 words). Return only the title. Use channel context when provided and avoid redundant channel-name words unless needed for clarity.";
async function generateThreadTitle(params) {
	const sourceText = params.messageText.trim();
	if (!sourceText) return null;
	try {
		const userMessage = buildThreadTitleCompletionUserMessage({
			sourceText,
			channelName: params.channelName,
			channelDescription: params.channelDescription
		});
		const timeoutMs = resolveThreadTitleTimeoutMs(params.timeoutMs);
		const generated = await generateConversationLabel({
			cfg: params.cfg,
			agentId: params.agentId,
			userMessage,
			prompt: DISCORD_THREAD_TITLE_SYSTEM_PROMPT,
			...params.modelRef ? { modelRef: params.modelRef } : {},
			timeoutMs,
			maxLength: MAX_THREAD_TITLE_SOURCE_CHARS
		});
		return generated ? normalizeGeneratedThreadTitle(generated) : null;
	} catch (err) {
		logVerbose(`thread-title: title generation failed for agent ${params.agentId}: ${String(err)}`);
		return null;
	}
}
function buildThreadTitleCompletionUserMessage(params) {
	const sourceText = truncateThreadTitleSourceText(params.sourceText);
	const channelName = normalizeTitleContextField(params.channelName, MAX_THREAD_TITLE_CHANNEL_NAME_CHARS);
	const channelDescription = normalizeTitleContextField(params.channelDescription, MAX_THREAD_TITLE_CHANNEL_DESCRIPTION_CHARS);
	const messageLines = [];
	if (channelName) messageLines.push(`Channel: ${channelName}`);
	if (channelDescription) messageLines.push(`Channel description: ${channelDescription}`);
	messageLines.push(`Message:\n${sourceText}`);
	return messageLines.join("\n\n");
}
function truncateThreadTitleSourceText(sourceText) {
	if (sourceText.length <= MAX_THREAD_TITLE_SOURCE_CHARS) return sourceText;
	return `${truncateUtf16Safe(sourceText, MAX_THREAD_TITLE_SOURCE_CHARS)}...`;
}
function resolveThreadTitleTimeoutMs(timeoutMs) {
	return Math.max(100, Math.floor(timeoutMs ?? DEFAULT_THREAD_TITLE_TIMEOUT_MS));
}
function normalizeGeneratedThreadTitle(raw) {
	const lines = raw.replace(/\r/g, "").split("\n");
	let firstLine = "";
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (!firstLine && trimmed.startsWith("```")) continue;
		firstLine = trimmed;
		break;
	}
	return stripThreadTitleWrappers(firstLine);
}
function stripThreadTitleWrappers(raw) {
	let current = raw.trim();
	let previous = "";
	while (current && current !== previous) {
		previous = current;
		current = current.replace(/^["'`]+|["'`]+$/g, "").trim();
		current = stripBalancedWrapper(current, "**");
		current = stripBalancedWrapper(current, "__");
		current = stripBalancedWrapper(current, "*");
		current = stripBalancedWrapper(current, "_");
		current = stripBalancedWrapper(current, "~~");
	}
	return current;
}
function stripBalancedWrapper(text, marker) {
	if (text.length < marker.length * 2 + 1) return text;
	if (!text.startsWith(marker) || !text.endsWith(marker)) return text;
	const inner = text.slice(marker.length, text.length - marker.length);
	if (!inner || inner.includes(marker)) return text;
	return inner;
}
function normalizeTitleContextField(raw, maxChars) {
	const value = raw?.trim();
	if (!value) return;
	const singleLine = value.replace(/\s+/g, " ");
	if (singleLine.length <= maxChars) return singleLine;
	return `${truncateUtf16Safe(singleLine, maxChars)}...`;
}
//#endregion
//#region extensions/discord/src/monitor/threading.cache.ts
const DISCORD_THREAD_STARTER_CACHE_TTL_MS = 300 * 1e3;
const DISCORD_THREAD_STARTER_CACHE_MAX = 500;
const DISCORD_THREAD_STARTER_CACHE = /* @__PURE__ */ new Map();
function resetDiscordThreadStarterCacheForTest() {
	DISCORD_THREAD_STARTER_CACHE.clear();
}
function getCachedThreadStarter(key, now) {
	const entry = DISCORD_THREAD_STARTER_CACHE.get(key);
	if (!entry) return;
	if (now - entry.updatedAt > DISCORD_THREAD_STARTER_CACHE_TTL_MS) {
		DISCORD_THREAD_STARTER_CACHE.delete(key);
		return;
	}
	DISCORD_THREAD_STARTER_CACHE.delete(key);
	DISCORD_THREAD_STARTER_CACHE.set(key, {
		...entry,
		updatedAt: now
	});
	return entry.value;
}
function setCachedThreadStarter(key, value, now) {
	DISCORD_THREAD_STARTER_CACHE.delete(key);
	DISCORD_THREAD_STARTER_CACHE.set(key, {
		value,
		updatedAt: now
	});
	while (DISCORD_THREAD_STARTER_CACHE.size > DISCORD_THREAD_STARTER_CACHE_MAX) {
		const iter = DISCORD_THREAD_STARTER_CACHE.keys().next();
		if (iter.done) break;
		DISCORD_THREAD_STARTER_CACHE.delete(iter.value);
	}
}
//#endregion
//#region extensions/discord/src/monitor/threading.starter.ts
function isDiscordThreadType(type) {
	return type === ChannelType.PublicThread || type === ChannelType.PrivateThread || type === ChannelType.AnnouncementThread;
}
function isDiscordForumParentType(parentType) {
	return parentType === ChannelType.GuildForum || parentType === ChannelType.GuildMedia;
}
function resolveDiscordThreadChannel(params) {
	if (!params.isGuildMessage) return null;
	const { message, channelInfo } = params;
	const channel = "channel" in message ? message.channel : void 0;
	if (channel && typeof channel === "object" && "isThread" in channel && typeof channel.isThread === "function" && channel.isThread()) return channel;
	if (!isDiscordThreadType(channelInfo?.type)) return null;
	const messageChannelId = params.messageChannelId || resolveDiscordMessageChannelId({ message });
	if (!messageChannelId) return null;
	return {
		id: messageChannelId,
		name: channelInfo?.name ?? void 0,
		parentId: channelInfo?.parentId ?? void 0,
		parent: void 0,
		ownerId: channelInfo?.ownerId ?? void 0
	};
}
async function resolveDiscordThreadParentInfo(params) {
	const { threadChannel, channelInfo, client } = params;
	const parent = resolveDiscordChannelParentSafe(threadChannel);
	let parentId = resolveDiscordChannelParentIdSafe(threadChannel) ?? resolveDiscordChannelIdSafe(parent) ?? channelInfo?.parentId ?? void 0;
	if (!parentId && threadChannel.id) parentId = (await resolveDiscordChannelInfo(client, threadChannel.id))?.parentId ?? void 0;
	if (!parentId) return {};
	let parentName = resolveDiscordChannelNameSafe(parent);
	const parentInfo = await resolveDiscordChannelInfo(client, parentId);
	parentName = parentName ?? parentInfo?.name;
	const parentType = parentInfo?.type;
	return {
		id: parentId,
		name: parentName,
		type: parentType
	};
}
async function resolveDiscordThreadStarter(params) {
	const cacheKey = params.channel.id;
	const cached = getCachedThreadStarter(cacheKey, Date.now());
	if (cached) return cached;
	try {
		const messageChannelId = resolveDiscordThreadStarterMessageChannelId(params);
		if (!messageChannelId) return null;
		const starter = await fetchDiscordThreadStarterMessage({
			client: params.client,
			messageChannelId,
			threadId: params.channel.id
		});
		if (!starter) return null;
		const payload = buildDiscordThreadStarterPayload({
			starter,
			resolveTimestampMs: params.resolveTimestampMs
		});
		if (!payload) return null;
		setCachedThreadStarter(cacheKey, payload, Date.now());
		return payload;
	} catch {
		return null;
	}
}
function resolveDiscordThreadStarterMessageChannelId(params) {
	return isDiscordForumParentType(params.parentType) ? params.channel.id : params.parentId;
}
async function fetchDiscordThreadStarterMessage(params) {
	const starter = await getChannelMessage(params.client.rest, params.messageChannelId, params.threadId);
	return starter ? starter : null;
}
function buildDiscordThreadStarterPayload(params) {
	const text = resolveDiscordThreadStarterText(params.starter);
	if (!text) return null;
	return {
		text,
		...resolveDiscordThreadStarterIdentity(params.starter),
		timestamp: params.resolveTimestampMs(params.starter.timestamp) ?? void 0
	};
}
function resolveDiscordThreadStarterText(starter) {
	const content = normalizeOptionalString(starter.content) ?? "";
	const embedText = resolveDiscordEmbedText(starter.embeds?.[0]);
	const forwardedText = resolveDiscordForwardedMessagesTextFromSnapshots(starter.message_snapshots);
	return [content || embedText || forwardedText, formatDiscordMediaText({
		attachments: starter.attachments ?? void 0,
		stickers: starter.sticker_items ?? void 0
	})].filter(Boolean).join("\n");
}
function resolveDiscordThreadStarterIdentity(starter) {
	return {
		author: resolveDiscordThreadStarterAuthor(starter),
		authorId: starter.author?.id ?? void 0,
		authorName: starter.author?.username ?? void 0,
		authorTag: resolveDiscordThreadStarterAuthorTag(starter.author),
		memberRoleIds: resolveDiscordThreadStarterRoleIds(starter.member)
	};
}
function resolveDiscordThreadStarterAuthor(starter) {
	return starter.member?.nick ?? starter.member?.displayName ?? resolveDiscordThreadStarterAuthorTag(starter.author) ?? starter.author?.username ?? starter.author?.id ?? "Unknown";
}
function resolveDiscordThreadStarterAuthorTag(author) {
	if (!author?.username || !author.discriminator) return;
	if (author.discriminator !== "0") return `${author.username}#${author.discriminator}`;
	return author.username;
}
function resolveDiscordThreadStarterRoleIds(member) {
	return Array.isArray(member?.roles) ? member.roles : void 0;
}
function resolveDiscordReplyTarget(opts) {
	if (opts.replyToMode === "off") return;
	const replyToId = normalizeOptionalString(opts.replyToId);
	if (!replyToId) return;
	if (opts.replyToMode === "all") return replyToId;
	return opts.hasReplied ? void 0 : replyToId;
}
function sanitizeDiscordThreadName(rawName, fallbackId) {
	return truncateUtf16Safe(truncateUtf16Safe(rawName.replace(/<@!?\d+>/g, "").replace(/<@&\d+>/g, "").replace(/<#\d+>/g, "").replace(/\s+/g, " ").trim() || `Thread ${fallbackId}`, 80), 100) || `Thread ${fallbackId}`;
}
function resolveDiscordReplyDeliveryPlan(params) {
	const originalReplyTarget = params.replyTarget;
	let deliverTarget = originalReplyTarget;
	let replyTarget = originalReplyTarget;
	if (params.createdThreadId) {
		deliverTarget = `channel:${params.createdThreadId}`;
		replyTarget = deliverTarget;
	}
	const allowReference = deliverTarget === originalReplyTarget;
	const replyReference = createReplyReferencePlanner({
		replyToMode: allowReference ? params.replyToMode : "off",
		existingId: params.threadChannel ? params.messageId : void 0,
		startId: params.messageId,
		allowReference
	});
	return {
		deliverTarget,
		replyTarget,
		replyReference
	};
}
//#endregion
//#region extensions/discord/src/monitor/threading.auto-thread.ts
function resolveTrimmedDiscordMessageChannelId(params) {
	return (params.messageChannelId || resolveDiscordMessageChannelId({ message: params.message })).trim();
}
function resolveDiscordAutoThreadContext(params) {
	const createdThreadId = normalizeOptionalStringifiedId(params.createdThreadId) ?? "";
	if (!createdThreadId) return null;
	const messageChannelId = normalizeOptionalString(params.messageChannelId) ?? "";
	if (!messageChannelId) return null;
	const threadSessionKey = buildAgentSessionKey({
		agentId: params.agentId,
		channel: params.channel,
		peer: {
			kind: "channel",
			id: createdThreadId
		}
	});
	const parentSessionKey = buildAgentSessionKey({
		agentId: params.agentId,
		channel: params.channel,
		peer: {
			kind: "channel",
			id: messageChannelId
		}
	});
	return {
		createdThreadId,
		From: `${params.channel}:channel:${createdThreadId}`,
		To: `channel:${createdThreadId}`,
		OriginatingTo: `channel:${createdThreadId}`,
		SessionKey: threadSessionKey,
		ModelParentSessionKey: parentSessionKey,
		...params.parentInheritanceEnabled === true ? { ParentSessionKey: parentSessionKey } : {}
	};
}
async function resolveDiscordAutoThreadReplyPlan(params) {
	const messageChannelId = resolveTrimmedDiscordMessageChannelId(params);
	const originalReplyTarget = `channel:${params.threadChannel?.id ?? (messageChannelId || "unknown")}`;
	const createdThreadId = await maybeCreateDiscordAutoThread({
		client: params.client,
		message: params.message,
		messageChannelId: messageChannelId || void 0,
		channel: params.channel,
		isGuildMessage: params.isGuildMessage,
		channelConfig: params.channelConfig,
		threadChannel: params.threadChannel,
		channelType: params.channelType,
		channelName: params.channelName,
		channelDescription: params.channelDescription,
		baseText: params.baseText,
		combinedBody: params.combinedBody,
		cfg: params.cfg,
		agentId: params.agentId
	});
	const deliveryPlan = resolveDiscordReplyDeliveryPlan({
		replyTarget: originalReplyTarget,
		replyToMode: params.replyToMode,
		messageId: params.message.id,
		threadChannel: params.threadChannel,
		createdThreadId
	});
	const autoThreadContext = params.isGuildMessage ? resolveDiscordAutoThreadContext({
		agentId: params.agentId,
		channel: params.channel,
		messageChannelId,
		createdThreadId,
		parentInheritanceEnabled: params.threadParentInheritanceEnabled
	}) : null;
	return {
		...deliveryPlan,
		createdThreadId,
		autoThreadContext
	};
}
async function maybeCreateDiscordAutoThread(params) {
	if (!params.isGuildMessage) return;
	if (!params.channelConfig?.autoThread) return;
	if (params.threadChannel) return;
	if (params.channelType === ChannelType.GuildForum || params.channelType === ChannelType.GuildMedia || params.channelType === ChannelType.GuildVoice || params.channelType === ChannelType.GuildStageVoice) return;
	const messageChannelId = resolveTrimmedDiscordMessageChannelId(params);
	if (!messageChannelId) return;
	try {
		try {
			const existingThreadId = (await getChannelMessage(params.client.rest, messageChannelId, params.message.id))?.thread?.id;
			if (existingThreadId) {
				logVerbose(`discord: autoThread reusing existing thread ${existingThreadId} on ${messageChannelId}/${params.message.id}`);
				return existingThreadId;
			}
		} catch {}
		if (params.message.author?.bot) {
			logVerbose(`discord: autoThread skipped for bot-authored message ${messageChannelId}/${params.message.id}`);
			return;
		}
		const rawThreadSource = params.baseText || params.combinedBody || "Thread";
		const threadName = sanitizeDiscordThreadName(rawThreadSource, params.message.id);
		const archiveDuration = params.channelConfig?.autoArchiveDuration ? Number(params.channelConfig.autoArchiveDuration) : 60;
		const createdId = (await createThread(params.client.rest, messageChannelId, { body: {
			name: threadName,
			auto_archive_duration: archiveDuration
		} }, params.message.id))?.id || "";
		if (createdId && params.channelConfig?.autoThreadName === "generated" && params.cfg && params.agentId) {
			const modelRef = resolveDiscordThreadTitleModelRef({
				cfg: params.cfg,
				channel: params.channel,
				agentId: params.agentId,
				threadId: createdId,
				messageChannelId,
				channelName: params.channelName
			});
			maybeRenameDiscordAutoThread({
				client: params.client,
				threadId: createdId,
				currentName: threadName,
				fallbackId: params.message.id,
				sourceText: rawThreadSource,
				modelRef,
				channelName: params.channelName,
				channelDescription: params.channelDescription,
				cfg: params.cfg,
				agentId: params.agentId
			});
		}
		return createdId || void 0;
	} catch (err) {
		logVerbose(`discord: autoThread creation failed for ${messageChannelId}/${params.message.id}: ${String(err)}`);
		try {
			const existingThreadId = (await getChannelMessage(params.client.rest, messageChannelId, params.message.id))?.thread?.id || "";
			if (existingThreadId) {
				logVerbose(`discord: autoThread reusing existing thread ${existingThreadId} on ${messageChannelId}/${params.message.id}`);
				return existingThreadId;
			}
		} catch {}
		return;
	}
}
function resolveDiscordThreadTitleModelRef(params) {
	const channel = params.channel?.trim();
	if (!channel) return;
	const parentSessionKey = buildAgentSessionKey({
		agentId: params.agentId,
		channel,
		peer: {
			kind: "channel",
			id: params.messageChannelId
		}
	});
	const channelLabel = params.channelName?.trim();
	const groupChannel = channelLabel ? `#${channelLabel}` : void 0;
	return resolveChannelModelOverride({
		cfg: params.cfg,
		channel,
		groupId: params.threadId,
		groupChatType: "channel",
		groupChannel,
		groupSubject: groupChannel,
		parentSessionKey
	})?.model;
}
async function maybeRenameDiscordAutoThread(params) {
	try {
		const fallbackName = sanitizeDiscordThreadName("", params.fallbackId);
		const generated = await generateThreadTitle({
			cfg: params.cfg,
			agentId: params.agentId,
			messageText: params.sourceText,
			modelRef: params.modelRef,
			channelName: params.channelName,
			channelDescription: params.channelDescription
		});
		if (!generated) return;
		const nextName = sanitizeDiscordThreadName(generated, params.fallbackId);
		if (!nextName || nextName === params.currentName || nextName === fallbackName) return;
		await editChannel(params.client.rest, params.threadId, { body: { name: nextName } });
	} catch (err) {
		logVerbose(`discord: autoThread rename failed for ${params.threadId}: ${String(err)}`);
	}
}
//#endregion
export { resolveDiscordReplyTarget as a, resolveDiscordThreadStarter as c, resolveDiscordReplyDeliveryPlan as i, sanitizeDiscordThreadName as l, resolveDiscordAutoThreadContext as n, resolveDiscordThreadChannel as o, resolveDiscordAutoThreadReplyPlan as r, resolveDiscordThreadParentInfo as s, maybeCreateDiscordAutoThread as t, resetDiscordThreadStarterCacheForTest as u };
