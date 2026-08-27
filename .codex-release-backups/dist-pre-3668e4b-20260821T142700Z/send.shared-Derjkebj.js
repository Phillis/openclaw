import { s as __toESM } from "./rolldown-runtime-DE1ahGrs.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as extensionForMime } from "./mime-Hm4eS2i0.js";
import { u as resolveTextChunksWithFallback } from "./reply-payload-DBNGwex4.js";
import { n as loadWebMedia } from "./web-media-DRJtrLMa.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { n as normalizePollInput, t as normalizePollDurationHours } from "./polls-C-v11_tu.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./media-runtime-B_HWTN-G.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-CeK7PFoj.js";
import "./web-media-BtTeEG1w.js";
import { s as resolveDiscordAccount } from "./accounts-nD0JW5tp.js";
import { $t as require_v10, D as serializePayload, Q as createUserDmChannel, X as stripUndefinedFields, lt as getChannel, qt as MessageFlags$1, rt as createChannelMessage } from "./discord-CSDU62IF.js";
import { i as fetchChannelPermissionsDiscord, l as isThreadChannelType, u as createDiscordClient } from "./send.permissions-Cx7SL08g.js";
import { t as parseAndResolveDiscordTarget } from "./target-resolver-K-70mhJH.js";
import { r as resolveDiscordReplyMessageId, t as chunkDiscordTextWithMode } from "./chunk-C0CVXD5_.js";
import { randomBytes } from "node:crypto";
//#region extensions/discord/src/internal/embeds.ts
var Embed = class {
	constructor(embed) {
		Object.assign(this, embed);
	}
	serialize() {
		return stripUndefinedFields({
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: typeof this.image === "string" ? { url: this.image } : this.image,
			thumbnail: typeof this.thumbnail === "string" ? { url: this.thumbnail } : this.thumbnail,
			author: this.author,
			fields: this.fields
		});
	}
};
//#endregion
//#region extensions/discord/src/recipient-resolution.ts
var import_v10 = /* @__PURE__ */ __toESM(require_v10(), 1);
async function parseAndResolveRecipient(raw, cfg, accountId, parseOptions = {}) {
	if (!cfg) throw new Error("Discord recipient resolution requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const resolvedCfg = requireRuntimeConfig(cfg, "Discord recipient resolution");
	const resolved = await parseAndResolveDiscordTarget(raw, {
		cfg: resolvedCfg,
		accountId: resolveDiscordAccount({
			cfg: resolvedCfg,
			accountId
		}).accountId
	}, parseOptions);
	return {
		kind: resolved.kind,
		id: resolved.id
	};
}
async function parseAndResolveChannelRecipient(raw, cfg, accountId) {
	return await parseAndResolveRecipient(raw, cfg, accountId, { defaultKind: "channel" });
}
import_v10.default.APIApplicationCommandPermissionsConstant;
import_v10.default.ActivityFlags;
import_v10.default.ActivityLocationKind;
import_v10.default.ActivityPlatform;
import_v10.default.ActivityType;
import_v10.default.AllowedMentionsTypes;
import_v10.default.ApplicationCommandOptionType;
import_v10.default.ApplicationCommandPermissionType;
import_v10.default.ApplicationCommandType;
import_v10.default.ApplicationFlags;
import_v10.default.ApplicationIntegrationType;
import_v10.default.ApplicationRoleConnectionMetadataType;
import_v10.default.ApplicationWebhookEventStatus;
import_v10.default.ApplicationWebhookEventType;
import_v10.default.ApplicationWebhookType;
import_v10.default.AttachmentFlags;
import_v10.default.AuditLogEvent;
import_v10.default.AuditLogOptionsType;
import_v10.default.AutoModerationActionType;
import_v10.default.AutoModerationRuleEventType;
import_v10.default.AutoModerationRuleKeywordPresetType;
import_v10.default.AutoModerationRuleTriggerType;
import_v10.default.BaseThemeType;
import_v10.default.ButtonStyle;
import_v10.default.ChannelFlags;
import_v10.default.ChannelType;
import_v10.default.ComponentType;
import_v10.default.ConnectionService;
import_v10.default.ConnectionVisibility;
import_v10.default.EmbedFlags;
import_v10.default.EmbedMediaFlags;
import_v10.default.EmbedType;
import_v10.default.EntitlementType;
import_v10.default.EntryPointCommandHandlerType;
import_v10.default.ForumLayoutType;
import_v10.default.GuildDefaultMessageNotifications;
import_v10.default.GuildExplicitContentFilter;
import_v10.default.GuildFeature;
import_v10.default.GuildHubType;
import_v10.default.GuildMFALevel;
import_v10.default.GuildMemberFlags;
import_v10.default.GuildNSFWLevel;
import_v10.default.GuildOnboardingMode;
import_v10.default.GuildOnboardingPromptType;
import_v10.default.GuildPremiumTier;
import_v10.default.GuildScheduledEventEntityType;
import_v10.default.GuildScheduledEventPrivacyLevel;
import_v10.default.GuildScheduledEventRecurrenceRuleFrequency;
import_v10.default.GuildScheduledEventRecurrenceRuleMonth;
import_v10.default.GuildScheduledEventRecurrenceRuleWeekday;
import_v10.default.GuildScheduledEventStatus;
import_v10.default.GuildSystemChannelFlags;
import_v10.default.GuildVerificationLevel;
import_v10.default.GuildWidgetStyle;
import_v10.default.IntegrationExpireBehavior;
import_v10.default.InteractionContextType;
import_v10.default.InteractionResponseType;
import_v10.default.InteractionType;
import_v10.default.InviteFlags;
import_v10.default.InviteTargetType;
import_v10.default.InviteType;
import_v10.default.MembershipScreeningFieldType;
import_v10.default.MessageActivityType;
import_v10.default.MessageFlags;
import_v10.default.MessageReferenceType;
import_v10.default.MessageSearchAuthorType;
import_v10.default.MessageSearchEmbedType;
import_v10.default.MessageSearchHasType;
import_v10.default.MessageSearchSortMode;
import_v10.default.MessageType;
import_v10.default.NameplatePalette;
import_v10.default.OAuth2Scopes;
import_v10.default.OverwriteType;
import_v10.default.PermissionFlagsBits;
const PollLayoutType = import_v10.default.PollLayoutType;
import_v10.default.PresenceUpdateStatus;
import_v10.default.RoleFlags;
import_v10.default.SKUFlags;
import_v10.default.SKUType;
import_v10.default.SelectMenuDefaultValueType;
import_v10.default.SeparatorSpacingSize;
import_v10.default.SortOrderType;
import_v10.default.StageInstancePrivacyLevel;
import_v10.default.StatusDisplayType;
import_v10.default.StickerFormatType;
import_v10.default.StickerType;
import_v10.default.SubscriptionStatus;
import_v10.default.TeamMemberMembershipState;
import_v10.default.TeamMemberRole;
import_v10.default.TextInputStyle;
import_v10.default.ThreadAutoArchiveDuration;
import_v10.default.ThreadMemberFlags;
import_v10.default.UnfurledMediaItemFlags;
import_v10.default.UnfurledMediaItemLoadingState;
import_v10.default.UserFlags;
import_v10.default.UserPremiumType;
import_v10.default.VideoQualityMode;
import_v10.default.WebhookType;
//#endregion
//#region extensions/discord/src/send.types.ts
var DiscordSendError = class extends Error {
	constructor(message, opts) {
		super(message);
		this.name = "DiscordSendError";
		if (opts) Object.assign(this, opts);
	}
	toString() {
		return this.message;
	}
};
const DISCORD_MAX_EMOJI_BYTES = 256 * 1024;
const DISCORD_MAX_STICKER_BYTES = 512 * 1024;
const DISCORD_MAX_EVENT_COVER_BYTES = 8 * 1024 * 1024;
//#endregion
//#region extensions/discord/src/send.message-request.ts
const SUPPRESS_EMBEDS_FLAG = MessageFlags$1.SuppressEmbeds;
const SUPPRESS_NOTIFICATIONS_FLAG = MessageFlags$1.SuppressNotifications;
function createDiscordMessageNonce() {
	return randomBytes(12).toString("hex");
}
function resolveDiscordSendComponents(params) {
	if (!params.components || !params.isFirst) return;
	return typeof params.components === "function" ? params.components(params.text) : params.components;
}
function normalizeDiscordEmbeds(embeds) {
	if (!embeds?.length) return;
	return embeds.map((embed) => embed instanceof Embed ? embed : new Embed(embed));
}
function resolveDiscordSendEmbeds(params) {
	if (!params.embeds || !params.isFirst) return;
	return normalizeDiscordEmbeds(params.embeds);
}
function buildDiscordMessagePayload(params) {
	const payload = {};
	const hasV2 = hasV2Components(params.components);
	const trimmed = params.text.trim();
	if (!hasV2 && trimmed) payload.content = params.text;
	if (params.components?.length) payload.components = params.components;
	if (!hasV2 && params.embeds?.length) payload.embeds = params.embeds;
	if (params.allowedMentions) payload.allowed_mentions = params.allowedMentions;
	if (params.flags !== void 0) payload.flags = params.flags;
	if (params.files?.length) payload.files = params.files;
	return payload;
}
function resolveDiscordMessageFlags(params) {
	let flags = 0;
	if (params.suppressEmbeds) flags |= SUPPRESS_EMBEDS_FLAG;
	if (params.silent) flags |= SUPPRESS_NOTIFICATIONS_FLAG;
	return flags || void 0;
}
function resolveDiscordSuppressEmbeds(params) {
	return params.override ?? params.configured ?? true;
}
function buildDiscordMessageRequest(params) {
	const payload = buildDiscordMessagePayload(params);
	const nonce = params.endpoint === "create-message" ? params.nonce ?? createDiscordMessageNonce() : void 0;
	return stripUndefinedFields({
		...serializePayload(payload),
		...params.replyTo ? { message_reference: {
			message_id: params.replyTo,
			fail_if_not_exists: false
		} } : {},
		nonce,
		enforce_nonce: nonce ? true : void 0
	});
}
function hasV2Components(components) {
	return Boolean(components?.some((component) => "isV2" in component && component.isV2));
}
//#endregion
//#region extensions/discord/src/send.shared.ts
const DISCORD_TEXT_LIMIT = 2e3;
const DISCORD_MAX_STICKERS = 3;
const DISCORD_POLL_MAX_ANSWERS = 10;
const DISCORD_POLL_MAX_DURATION_HOURS = 768;
const DISCORD_MISSING_PERMISSIONS = 50013;
const DISCORD_CANNOT_DM = 50007;
const DISCORD_UPLOAD_TOO_LARGE = 40005;
const DISCORD_UPLOAD_TOO_LARGE_STATUS = 413;
const DISCORD_UPLOAD_TOO_LARGE_NOTICE = "Attachment skipped: Discord rejected the file as too large.";
function normalizeReactionEmoji(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("emoji required");
	const customMatch = trimmed.match(/^<a?:([^:>]+):(\d+)>$/);
	const identifier = customMatch ? `${customMatch[1]}:${customMatch[2]}` : trimmed.replace(/[\uFE0E\uFE0F]/g, "");
	return encodeURIComponent(identifier);
}
function normalizeStickerIds(raw) {
	const ids = normalizeStringEntries(raw);
	if (ids.length === 0) throw new Error("At least one sticker id is required");
	if (ids.length > DISCORD_MAX_STICKERS) throw new Error("Discord supports up to 3 stickers per message");
	return ids;
}
function normalizeEmojiName(raw, label) {
	const name = raw.trim();
	if (!name) throw new Error(`${label} is required`);
	return name;
}
function normalizeDiscordPollInput(input) {
	const poll = normalizePollInput(input, { maxOptions: DISCORD_POLL_MAX_ANSWERS });
	const duration = normalizePollDurationHours(poll.durationHours, {
		defaultHours: 24,
		maxHours: DISCORD_POLL_MAX_DURATION_HOURS
	});
	return {
		question: { text: poll.question },
		answers: poll.options.map((answer) => ({ poll_media: { text: answer } })),
		duration,
		allow_multiselect: poll.maxSelections > 1,
		layout_type: PollLayoutType.Default
	};
}
function getDiscordErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "code" in err && err.code !== void 0 ? err.code : "rawError" in err && err.rawError && typeof err.rawError === "object" ? err.rawError.code : void 0;
	if (typeof candidate === "number") return candidate;
	if (typeof candidate === "string" && /^\d+$/.test(candidate)) return Number(candidate);
}
function getDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "status" in err && err.status !== void 0 ? err.status : "statusCode" in err && err.statusCode !== void 0 ? err.statusCode : void 0;
	if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
	if (typeof candidate === "string" && /^\d+$/.test(candidate)) return Number(candidate);
}
function isDiscordUploadTooLargeError(err) {
	return getDiscordErrorCode(err) === DISCORD_UPLOAD_TOO_LARGE || getDiscordErrorStatus(err) === DISCORD_UPLOAD_TOO_LARGE_STATUS;
}
function buildDiscordUploadTooLargeFallbackText(text) {
	return text.trim() ? `${text}\n\n[${DISCORD_UPLOAD_TOO_LARGE_NOTICE}]` : DISCORD_UPLOAD_TOO_LARGE_NOTICE;
}
async function buildDiscordSendError(err, ctx) {
	if (err instanceof DiscordSendError) return err;
	const code = getDiscordErrorCode(err);
	if (code === DISCORD_CANNOT_DM) return new DiscordSendError(`discord dm failed: user blocks dms or privacy settings disallow it (code=${code})`, {
		kind: "dm-blocked",
		discordCode: code,
		status: getDiscordErrorStatus(err)
	});
	if (code !== DISCORD_MISSING_PERMISSIONS) return err;
	let missing = [];
	let probedChannelType;
	try {
		const permissions = await fetchChannelPermissionsDiscord(ctx.channelId, {
			rest: ctx.rest,
			token: ctx.token,
			cfg: ctx.cfg
		});
		probedChannelType = permissions.channelType;
		const current = new Set(permissions.permissions);
		const required = ["ViewChannel", "SendMessages"];
		if (isThreadChannelType(probedChannelType)) required.push("SendMessagesInThreads");
		if (ctx.hasMedia) required.push("AttachFiles");
		missing = required.filter((permission) => !current.has(permission));
	} catch {}
	const status = getDiscordErrorStatus(err);
	const apiDetails = [`code=${code}`, status != null ? `status=${status}` : void 0].filter(Boolean).join(" ");
	const probedPermissions = ["ViewChannel", "SendMessages"];
	if (isThreadChannelType(probedChannelType)) probedPermissions.push("SendMessagesInThreads");
	if (ctx.hasMedia) probedPermissions.push("AttachFiles");
	const probeSummary = probedPermissions.join("/");
	return new DiscordSendError(`${missing.length ? `discord missing permissions in channel ${ctx.channelId}: ${missing.join(", ")}` : `discord missing permissions in channel ${ctx.channelId}; permission probe did not identify missing ${probeSummary}`} (${apiDetails}). bot might be blocked by channel/thread overrides, archived thread state, reply target visibility, or app-role position`, {
		kind: "missing-permissions",
		channelId: ctx.channelId,
		missingPermissions: missing,
		discordCode: code,
		status
	});
}
async function resolveChannelId(rest, recipient, request) {
	if (recipient.kind === "channel") return { channelId: recipient.id };
	const dmChannel = await request(() => createUserDmChannel(rest, recipient.id), "dm-channel");
	if (!dmChannel?.id) throw new Error("Failed to create Discord DM channel");
	return {
		channelId: dmChannel.id,
		dm: true
	};
}
async function resolveDiscordTargetChannelId(raw, opts) {
	const recipient = await parseAndResolveRecipient(raw, requireRuntimeConfig(opts.cfg, "Discord target channel resolution"), opts.accountId, { defaultKind: "channel" });
	const { rest, request } = createDiscordClient(opts);
	return await resolveChannelId(rest, recipient, request);
}
async function resolveDiscordChannel(rest, channelId) {
	try {
		return await getChannel(rest, channelId);
	} catch {
		return;
	}
}
function buildDiscordTextChunks(text, opts = {}) {
	if (!text) return [];
	return resolveTextChunksWithFallback(text, chunkDiscordTextWithMode(text, {
		maxChars: opts.maxChars ?? DISCORD_TEXT_LIMIT,
		maxLines: opts.maxLinesPerMessage,
		chunkMode: opts.chunkMode
	}));
}
async function sendDiscordText(params) {
	const { rest, channelId, text, request, reply, maxLinesPerMessage, components, embeds, allowedMentions, chunkMode, silent, suppressEmbeds, maxChars, onResult, onPlatformSendDispatch } = params;
	if (!text.trim()) throw new Error("Message must be non-empty for Discord sends");
	const chunks = buildDiscordTextChunks(text, {
		maxLinesPerMessage,
		chunkMode,
		maxChars
	});
	const sendChunk = async (chunk, isFirst) => {
		const chunkReplyTo = resolveDiscordReplyMessageId(reply, isFirst);
		const chunkComponents = resolveDiscordSendComponents({
			components,
			text: chunk,
			isFirst
		});
		const chunkEmbeds = resolveDiscordSendEmbeds({
			embeds,
			isFirst
		});
		const flags = resolveDiscordMessageFlags({
			silent,
			suppressEmbeds: suppressEmbeds && !chunkEmbeds?.length
		});
		const body = buildDiscordMessageRequest({
			endpoint: "create-message",
			text: chunk,
			components: chunkComponents,
			embeds: chunkEmbeds,
			allowedMentions,
			flags,
			replyTo: chunkReplyTo
		});
		await onPlatformSendDispatch?.();
		return {
			result: await request(() => createChannelMessage(rest, channelId, { body }), "text", { safety: "nonce-protected-create" }),
			replyToId: chunkReplyTo
		};
	};
	if (chunks.length === 1) {
		const { result, replyToId } = await sendChunk(expectDefined(chunks.at(0), "single Discord text chunk"), true);
		await onResult?.(result, "text", replyToId);
		return {
			...result,
			platformMessageIds: result.id ? [result.id] : []
		};
	}
	const platformMessageIds = [];
	let last = null;
	for (const [index, chunk] of chunks.entries()) {
		const sent = await sendChunk(chunk, index === 0);
		last = sent.result;
		await onResult?.(last, "text", sent.replyToId);
		if (last.id) platformMessageIds.push(last.id);
	}
	if (!last) throw new Error("Discord send failed (empty chunk result)");
	return {
		...last,
		platformMessageIds
	};
}
async function sendDiscordMedia(params) {
	const { rest, channelId, text, mediaUrl, filename, mediaAccess, mediaLocalRoots, mediaReadFile, maxBytes, reply, request, maxLinesPerMessage, components, embeds, allowedMentions, chunkMode, silent, suppressEmbeds, maxChars, onResult, onPlatformSendDispatch } = params;
	const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes,
		mediaAccess,
		mediaLocalRoots,
		mediaReadFile
	}));
	const resolvedFileName = filename?.trim() || media.fileName || (media.contentType ? `upload${extensionForMime(media.contentType) ?? ""}` : "") || "upload";
	const chunks = text ? buildDiscordTextChunks(text, {
		maxLinesPerMessage,
		chunkMode,
		maxChars
	}) : [];
	const caption = chunks[0] ?? "";
	const captionComponents = resolveDiscordSendComponents({
		components,
		text: caption,
		isFirst: true
	});
	const captionEmbeds = resolveDiscordSendEmbeds({
		embeds,
		isFirst: true
	});
	const body = buildDiscordMessageRequest({
		endpoint: "create-message",
		text: caption,
		components: captionComponents,
		embeds: captionEmbeds,
		allowedMentions,
		flags: resolveDiscordMessageFlags({
			silent,
			suppressEmbeds: suppressEmbeds && !captionEmbeds?.length
		}),
		replyTo: resolveDiscordReplyMessageId(reply, true),
		files: [{
			data: media.buffer,
			name: resolvedFileName,
			contentType: media.contentType
		}]
	});
	let res;
	try {
		await onPlatformSendDispatch?.();
		res = await request(() => createChannelMessage(rest, channelId, { body }), "media", { safety: "nonce-protected-create" });
	} catch (err) {
		if (!isDiscordUploadTooLargeError(err)) throw err;
		return sendDiscordText({
			rest,
			channelId,
			text: buildDiscordUploadTooLargeFallbackText(text),
			reply,
			request,
			maxLinesPerMessage,
			chunkMode,
			silent,
			suppressEmbeds,
			allowedMentions,
			maxChars,
			onResult,
			onPlatformSendDispatch
		});
	}
	await onResult?.(res, "media", reply?.messageId);
	const platformMessageIds = res.id ? [res.id] : [];
	const followupReply = reply?.scope === "all" ? reply : void 0;
	for (const chunk of chunks.slice(1)) {
		if (!chunk.trim()) continue;
		const followup = await sendDiscordText({
			rest,
			channelId,
			text: chunk,
			reply: followupReply,
			request,
			maxLinesPerMessage,
			chunkMode,
			silent,
			suppressEmbeds,
			allowedMentions,
			maxChars,
			onResult
		});
		for (const id of followup.platformMessageIds) if (id) platformMessageIds.push(id);
	}
	return {
		...res,
		platformMessageIds
	};
}
function buildReactionIdentifier(emoji) {
	if (emoji.id && emoji.name) return `${emoji.name}:${emoji.id}`;
	return emoji.name ?? "";
}
function formatReactionEmoji(emoji) {
	return buildReactionIdentifier(emoji);
}
//#endregion
export { DISCORD_MAX_STICKER_BYTES as C, DISCORD_MAX_EVENT_COVER_BYTES as S, parseAndResolveChannelRecipient as T, resolveDiscordMessageFlags as _, normalizeDiscordPollInput as a, resolveDiscordSuppressEmbeds as b, normalizeStickerIds as c, resolveDiscordTargetChannelId as d, sendDiscordMedia as f, createDiscordMessageNonce as g, buildDiscordMessageRequest as h, formatReactionEmoji as i, resolveChannelId as l, SUPPRESS_NOTIFICATIONS_FLAG as m, buildDiscordTextChunks as n, normalizeEmojiName as o, sendDiscordText as p, buildReactionIdentifier as r, normalizeReactionEmoji as s, buildDiscordSendError as t, resolveDiscordChannel as u, resolveDiscordSendComponents as v, DiscordSendError as w, DISCORD_MAX_EMOJI_BYTES as x, resolveDiscordSendEmbeds as y };
