import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { _ as readToolStringParam, d as readNonNegativeIntegerParam, h as readStringArrayParam, p as readPositiveIntegerParam } from "./common-CI1GnPjt.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./agent-runtime-BOXRUj3V.js";
import { c as readDiscordChannelMoveParams, n as isDiscordModerationAction, o as readDiscordChannelCreateParams, r as readDiscordModerationCommand, s as readDiscordChannelEditParams, t as handleDiscordAction } from "./runtime-CiER80Iq.js";
import "./action-runtime-api-DL0W8rBt.js";
import { t as isTrustedRequesterGuildAdminAction } from "./trusted-requester-actions-vFvBzRog.js";
//#region extensions/discord/src/actions/handle-action.guild-admin.ts
function readDiscordRequesterSenderId(ctx) {
	const currentProvider = normalizeOptionalString(ctx.toolContext?.currentChannelProvider);
	if (currentProvider?.toLowerCase() === "discord") return normalizeOptionalString(ctx.requesterSenderId);
	if (isTrustedRequesterGuildAdminAction(ctx.action) && (currentProvider || ctx.senderIsOwner !== true)) throw new Error("Discord guild admin actions require a trusted Discord sender identity.");
}
function senderParam(senderUserId) {
	return senderUserId ? { senderUserId } : {};
}
async function tryHandleDiscordMessageActionGuildAdmin(params) {
	const { ctx, resolveChannelId, readPolicyOptions, actionOptions } = params;
	const { action, params: actionParams, cfg } = ctx;
	const accountId = ctx.accountId ?? readToolStringParam(actionParams, "accountId");
	const senderUserId = readDiscordRequesterSenderId(ctx);
	if (action === "member-info") {
		const userId = readToolStringParam(actionParams, "userId", { required: true });
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		return await handleDiscordAction({
			action: "memberInfo",
			accountId: accountId ?? void 0,
			guildId,
			userId
		}, cfg, readPolicyOptions);
	}
	if (action === "role-info") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		return await handleDiscordAction({
			action: "roleInfo",
			accountId: accountId ?? void 0,
			guildId
		}, cfg, readPolicyOptions);
	}
	if (action === "emoji-list") {
		const guildId = readToolStringParam(actionParams, "guildId");
		const limit = readPositiveIntegerParam(actionParams, "limit");
		return await handleDiscordAction({
			action: "emojiList",
			accountId: accountId ?? void 0,
			...guildId ? { guildId } : { channelId: resolveChannelId() },
			...limit ? { limit } : {}
		}, cfg, readPolicyOptions);
	}
	if (action === "emoji-upload") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const name = readToolStringParam(actionParams, "emojiName", { required: true });
		const mediaUrl = readToolStringParam(actionParams, "media", {
			required: true,
			trim: false
		});
		const roleIds = readStringArrayParam(actionParams, "roleIds");
		return await handleDiscordAction({
			action: "emojiUpload",
			accountId: accountId ?? void 0,
			guildId,
			name,
			mediaUrl,
			roleIds,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "sticker-upload") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const name = readToolStringParam(actionParams, "stickerName", { required: true });
		const description = readToolStringParam(actionParams, "stickerDesc", { required: true });
		const tags = readToolStringParam(actionParams, "stickerTags", { required: true });
		const mediaUrl = readToolStringParam(actionParams, "media", {
			required: true,
			trim: false
		});
		return await handleDiscordAction({
			action: "stickerUpload",
			accountId: accountId ?? void 0,
			guildId,
			name,
			description,
			tags,
			mediaUrl,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "role-add" || action === "role-remove") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const userId = readToolStringParam(actionParams, "userId", { required: true });
		const roleId = readToolStringParam(actionParams, "roleId", { required: true });
		return await handleDiscordAction({
			action: action === "role-add" ? "roleAdd" : "roleRemove",
			accountId: accountId ?? void 0,
			guildId,
			userId,
			roleId,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "channel-info") {
		const channelId = readToolStringParam(actionParams, "channelId", { required: true });
		return await handleDiscordAction({
			action: "channelInfo",
			accountId: accountId ?? void 0,
			channelId
		}, cfg, readPolicyOptions);
	}
	if (action === "channel-list") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		return await handleDiscordAction({
			action: "channelList",
			accountId: accountId ?? void 0,
			guildId
		}, cfg, readPolicyOptions);
	}
	if (action === "channel-create") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		return await handleDiscordAction({
			action: "channelCreate",
			accountId: accountId ?? void 0,
			...readDiscordChannelCreateParams({
				...actionParams,
				guildId
			}),
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "channel-edit") {
		const channelId = readToolStringParam(actionParams, "channelId", { required: true });
		return await handleDiscordAction({
			action: "channelEdit",
			accountId: accountId ?? void 0,
			...readDiscordChannelEditParams({
				...actionParams,
				channelId
			}),
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "channel-delete") {
		const channelId = readToolStringParam(actionParams, "channelId", { required: true });
		return await handleDiscordAction({
			action: "channelDelete",
			accountId: accountId ?? void 0,
			channelId,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "channel-move") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const channelId = readToolStringParam(actionParams, "channelId", { required: true });
		return await handleDiscordAction({
			action: "channelMove",
			accountId: accountId ?? void 0,
			...readDiscordChannelMoveParams({
				...actionParams,
				guildId,
				channelId
			}),
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "category-create") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const name = readToolStringParam(actionParams, "name", { required: true });
		const position = readNonNegativeIntegerParam(actionParams, "position");
		return await handleDiscordAction({
			action: "categoryCreate",
			accountId: accountId ?? void 0,
			guildId,
			name,
			position: position ?? void 0,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "category-edit") {
		const categoryId = readToolStringParam(actionParams, "categoryId", { required: true });
		const name = readToolStringParam(actionParams, "name");
		const position = readNonNegativeIntegerParam(actionParams, "position");
		return await handleDiscordAction({
			action: "categoryEdit",
			accountId: accountId ?? void 0,
			categoryId,
			name: name ?? void 0,
			position: position ?? void 0,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "category-delete") {
		const categoryId = readToolStringParam(actionParams, "categoryId", { required: true });
		return await handleDiscordAction({
			action: "categoryDelete",
			accountId: accountId ?? void 0,
			categoryId,
			...senderParam(senderUserId)
		}, cfg);
	}
	if (action === "voice-status") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const userId = readToolStringParam(actionParams, "userId", { required: true });
		return await handleDiscordAction({
			action: "voiceStatus",
			accountId: accountId ?? void 0,
			guildId,
			userId
		}, cfg, readPolicyOptions);
	}
	if (action === "event-list") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		return await handleDiscordAction({
			action: "eventList",
			accountId: accountId ?? void 0,
			guildId
		}, cfg, readPolicyOptions);
	}
	if (action === "event-create") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const name = readToolStringParam(actionParams, "eventName", { required: true });
		const startTime = readToolStringParam(actionParams, "startTime", { required: true });
		const endTime = readToolStringParam(actionParams, "endTime");
		const description = readToolStringParam(actionParams, "desc");
		const channelId = readToolStringParam(actionParams, "channelId");
		const location = readToolStringParam(actionParams, "location");
		const entityType = readToolStringParam(actionParams, "eventType");
		const image = readToolStringParam(actionParams, "image", { trim: false });
		return await handleDiscordAction({
			action: "eventCreate",
			accountId: accountId ?? void 0,
			guildId,
			name,
			startTime,
			endTime,
			description,
			channelId,
			location,
			entityType,
			image,
			...senderParam(senderUserId)
		}, cfg, { mediaLocalRoots: ctx.mediaLocalRoots });
	}
	if (isDiscordModerationAction(action)) {
		const moderation = readDiscordModerationCommand(action, {
			...actionParams,
			durationMinutes: readNonNegativeIntegerParam(actionParams, "durationMin"),
			deleteMessageDays: readNonNegativeIntegerParam(actionParams, "deleteDays", {
				max: 7,
				message: "deleteDays must be an integer from 0 to 7"
			})
		});
		return await handleDiscordAction({
			action: moderation.action,
			accountId: accountId ?? void 0,
			guildId: moderation.guildId,
			userId: moderation.userId,
			durationMinutes: moderation.durationMinutes,
			until: moderation.until,
			reason: moderation.reason,
			deleteMessageDays: moderation.deleteMessageDays,
			senderUserId
		}, cfg);
	}
	if (action === "thread-list") {
		const guildId = readToolStringParam(actionParams, "guildId", { required: true });
		const channelId = readToolStringParam(actionParams, "channelId");
		const includeArchived = typeof actionParams.includeArchived === "boolean" ? actionParams.includeArchived : void 0;
		const before = readToolStringParam(actionParams, "before");
		const limit = readPositiveIntegerParam(actionParams, "limit");
		return await handleDiscordAction({
			action: "threadList",
			accountId: accountId ?? void 0,
			guildId,
			channelId,
			includeArchived,
			before,
			limit
		}, cfg, readPolicyOptions);
	}
	if (action === "thread-reply") {
		const content = readToolStringParam(actionParams, "message", { required: true });
		const mediaUrl = readToolStringParam(actionParams, "media", { trim: false }) ?? readToolStringParam(actionParams, "path", { trim: false }) ?? readToolStringParam(actionParams, "filePath", { trim: false });
		const replyTo = readToolStringParam(actionParams, "replyTo");
		const channelId = readToolStringParam(actionParams, "threadId") ?? resolveChannelId();
		return await handleDiscordAction({
			action: "threadReply",
			accountId: accountId ?? void 0,
			channelId,
			content,
			mediaUrl: mediaUrl ?? void 0,
			replyTo: replyTo ?? void 0,
			...readBooleanParam(actionParams, "silent") === true ? { silent: true } : {}
		}, cfg, actionOptions);
	}
	if (action === "search") {
		const guildId = readToolStringParam(actionParams, "guildId");
		const query = readToolStringParam(actionParams, "query") ?? readToolStringParam(actionParams, "content");
		if (!query) throw new Error("Discord search requires query text. Provide query or content.");
		const explicitChannelIds = readStringArrayParam(actionParams, "channelIds");
		const channelId = readToolStringParam(actionParams, "channelId") ?? (!guildId && !explicitChannelIds?.length && ctx.toolContext?.currentChannelProvider?.trim().toLowerCase() === "discord" ? ctx.toolContext?.currentChannelId?.trim() || void 0 : void 0);
		return await handleDiscordAction({
			action: "searchMessages",
			accountId: accountId ?? void 0,
			...guildId ? { guildId } : {},
			content: query,
			channelId,
			channelIds: explicitChannelIds,
			authorId: readToolStringParam(actionParams, "authorId"),
			authorIds: readStringArrayParam(actionParams, "authorIds"),
			limit: readPositiveIntegerParam(actionParams, "limit")
		}, cfg, readPolicyOptions);
	}
}
//#endregion
export { tryHandleDiscordMessageActionGuildAdmin as t };
