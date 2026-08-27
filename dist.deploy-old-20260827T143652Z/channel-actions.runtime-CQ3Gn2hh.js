import { u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.js";
import { _ as readToolStringParam, h as readStringArrayParam, p as readPositiveIntegerParam } from "./common-BGOZLJ2_.js";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, v as renderMessagePresentationFallbackText } from "./payload-ByplrRCQ.js";
import { t as adaptMessagePresentationForChannel } from "./presentation-limits-DBZBXEoz.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./agent-runtime-BgD3Qbvt.js";
import { t as resolveReactionMessageId } from "./channel-actions-CeWsyukw.js";
import { n as buildDiscordPresentationComponents, t as buildDiscordInteractiveComponents } from "./shared-interactive-2G7G3w4_.js";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "./target-parsing-BCrLMCew.js";
import { a as readDiscordAutoArchiveDurationParam, t as handleDiscordAction } from "./runtime-CqYLyK4q.js";
import "./targets-CjO8laGa.js";
import "./action-runtime-api-BaQ8CYqA.js";
import { t as discordInboundEventDelivery } from "./inbound-event-delivery-h8Th1s9l.js";
import { r as isDiscordComponentSpecWithinMessageLimit, t as DISCORD_PRESENTATION_CAPABILITIES } from "./outbound-components-BJjc6KLk.js";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./handle-action.guild-admin-BNoJk901.js";
import { n as notifyDiscordActiveTurnThreadCreated, r as notifyDiscordActiveTurnThreadReplyDelivered } from "./active-turn-thread-route-C6Rgw7ql.js";
//#region extensions/discord/src/actions/handle-action.ts
const providerId = "discord";
function withCurrentSourceReplyRoute(result) {
	const details = result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : {};
	return {
		...result,
		details: {
			...details,
			sourceReplyRoute: "current-source"
		}
	};
}
function readCurrentDiscordTarget(toolContext) {
	const provider = toolContext?.currentChannelProvider?.trim().toLowerCase();
	if (provider && provider !== providerId) return;
	return toolContext?.currentChannelId?.trim() || void 0;
}
async function handleDiscordMessageAction(ctx) {
	const { action, params, cfg } = ctx;
	const accountId = ctx.accountId ?? readToolStringParam(params, "accountId");
	const readContext = ctx.requesterAccountId && ctx.toolContext?.currentChannelProvider && ctx.toolContext.currentChannelId ? {
		requesterAccountId: ctx.requesterAccountId,
		currentChannelProvider: ctx.toolContext.currentChannelProvider,
		currentChannelId: ctx.toolContext.currentChannelId
	} : void 0;
	const readPolicyOptions = ctx.conversationReadOrigin || readContext ? {
		...ctx.conversationReadOrigin ? { conversationReadOrigin: ctx.conversationReadOrigin } : {},
		...readContext ? { readContext } : {}
	} : void 0;
	const actionOptions = {
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile,
		...readPolicyOptions
	};
	const notifyVisibleOutbound = (result, to, fallbackSessionKey) => {
		if ((result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : void 0)?.ok !== true) return;
		discordInboundEventDelivery.notify({
			sessionKey: ctx.sessionKey ?? fallbackSessionKey ?? void 0,
			to,
			accountId,
			inboundEventKind: ctx.inboundEventKind
		});
	};
	const withAdoptedThreadReplyRoute = (result, to, fallbackSessionKey) => {
		if ((result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : void 0)?.ok !== true) return result;
		let target;
		try {
			target = parseDiscordTarget(to, { defaultKind: "channel" });
		} catch {
			return result;
		}
		if (target?.kind === "channel" && notifyDiscordActiveTurnThreadReplyDelivered({
			sessionKey: ctx.sessionKey ?? fallbackSessionKey,
			accountId,
			threadId: target.id
		})) return withCurrentSourceReplyRoute(result);
		return result;
	};
	const readTarget = () => {
		const target = readToolStringParam(params, "channelId") ?? readToolStringParam(params, "to") ?? readCurrentDiscordTarget(ctx.toolContext);
		if (!target) throw new Error("Discord channel target is required (use channel:<id>).");
		return target;
	};
	const resolveChannelId = () => resolveDiscordChannelId(readTarget());
	const readSendTarget = () => {
		const target = readToolStringParam(params, "to") ?? readToolStringParam(params, "target") ?? readCurrentDiscordTarget(ctx.toolContext);
		if (!target) throw new Error("Discord channel target is required (use channel:<id>).");
		return target;
	};
	if (action === "send") {
		const to = readSendTarget();
		const asVoice = readBooleanParam(params, "asVoice") === true;
		const mediaUrl = readToolStringParam(params, "media", { trim: false }) ?? readToolStringParam(params, "path", { trim: false }) ?? readToolStringParam(params, "filePath", { trim: false });
		const requestedContent = readToolStringParam(params, "message", { allowEmpty: true });
		const presentation = params.components == null ? normalizeMessagePresentation(params.presentation) : void 0;
		const adaptedPresentation = presentation ? adaptMessagePresentationForChannel({
			presentation,
			capabilities: DISCORD_PRESENTATION_CAPABILITIES
		}) : void 0;
		const generatedPresentationComponents = buildDiscordPresentationComponents(adaptedPresentation);
		const presentationComponents = generatedPresentationComponents && isDiscordComponentSpecWithinMessageLimit({
			spec: generatedPresentationComponents,
			fallbackText: requestedContent,
			includesMedia: Boolean(mediaUrl)
		}) ? generatedPresentationComponents : void 0;
		const presentationFellBack = Boolean(generatedPresentationComponents && !presentationComponents);
		const rawComponents = presentationFellBack ? void 0 : params.components ?? presentationComponents ?? buildDiscordInteractiveComponents(normalizeLegacyInteractiveReply(params.interactive));
		const hasComponents = Boolean(rawComponents) && (typeof rawComponents === "function" || typeof rawComponents === "object");
		const components = hasComponents ? rawComponents : void 0;
		const content = readToolStringParam(params, "message", {
			required: !asVoice && !hasComponents && !mediaUrl && !presentationFellBack,
			allowEmpty: true
		});
		const deliveryContent = presentationFellBack && adaptedPresentation ? renderMessagePresentationFallbackText({
			text: content,
			presentation: adaptedPresentation
		}) : content;
		const filename = readToolStringParam(params, "filename");
		const replyTo = readToolStringParam(params, "replyTo");
		const rawEmbeds = params.embeds;
		const embeds = Array.isArray(rawEmbeds) ? rawEmbeds : void 0;
		const silent = readBooleanParam(params, "silent") === true;
		const suppressEmbeds = readBooleanParam(params, "suppressEmbeds");
		const sessionKey = readToolStringParam(params, "__sessionKey");
		const agentId = readToolStringParam(params, "__agentId");
		const threadName = readToolStringParam(params, "threadName");
		const result = await handleDiscordAction({
			action: "sendMessage",
			accountId: accountId ?? void 0,
			to,
			content: deliveryContent ?? "",
			...threadName ? { threadName } : {},
			mediaUrl: mediaUrl ?? void 0,
			filename: filename ?? void 0,
			replyTo: replyTo ?? void 0,
			components,
			embeds,
			asVoice,
			silent,
			...suppressEmbeds === void 0 ? {} : { suppressEmbeds },
			__sessionKey: sessionKey ?? void 0,
			__agentId: agentId ?? void 0
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to, sessionKey);
		return withAdoptedThreadReplyRoute(result, to, sessionKey);
	}
	if (action === "upload-file") {
		const to = readSendTarget();
		const mediaUrl = readToolStringParam(params, "filePath", { trim: false }) ?? readToolStringParam(params, "path", { trim: false }) ?? readToolStringParam(params, "media", { trim: false });
		if (!mediaUrl) throw new Error("upload-file requires filePath, path, or media.");
		const content = readToolStringParam(params, "message", { allowEmpty: true }) ?? readToolStringParam(params, "content", { allowEmpty: true });
		const filename = readToolStringParam(params, "filename");
		const replyTo = readToolStringParam(params, "replyTo");
		const silent = readBooleanParam(params, "silent") === true;
		const suppressEmbeds = readBooleanParam(params, "suppressEmbeds");
		const sessionKey = readToolStringParam(params, "__sessionKey");
		const agentId = readToolStringParam(params, "__agentId");
		const result = await handleDiscordAction({
			action: "sendMessage",
			accountId: accountId ?? void 0,
			to,
			content: content ?? "",
			mediaUrl,
			filename: filename ?? void 0,
			replyTo: replyTo ?? void 0,
			silent,
			...suppressEmbeds === void 0 ? {} : { suppressEmbeds },
			__sessionKey: sessionKey ?? void 0,
			__agentId: agentId ?? void 0
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to, sessionKey);
		return withAdoptedThreadReplyRoute(result, to, sessionKey);
	}
	if (action === "poll") {
		const to = readToolStringParam(params, "to", { required: true });
		const question = readToolStringParam(params, "pollQuestion", { required: true });
		const answers = readStringArrayParam(params, "pollOption", { required: true });
		const allowMultiselect = readBooleanParam(params, "pollMulti");
		const durationHours = readPositiveIntegerParam(params, "pollDurationHours");
		const result = await handleDiscordAction({
			action: "poll",
			accountId: accountId ?? void 0,
			to,
			question,
			answers,
			allowMultiselect,
			durationHours: durationHours ?? void 0,
			content: readToolStringParam(params, "message")
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to);
		return result;
	}
	if (action === "react") {
		const messageId = normalizeOptionalStringifiedId(resolveReactionMessageId({
			args: params,
			toolContext: ctx.toolContext
		})) ?? "";
		if (!messageId) throw new Error("messageId required. Provide messageId explicitly or react to the current inbound message.");
		const emoji = readToolStringParam(params, "emoji", { allowEmpty: true });
		const remove = readBooleanParam(params, "remove");
		return await handleDiscordAction({
			action: "react",
			accountId: accountId ?? void 0,
			channelId: readTarget(),
			messageId,
			emoji,
			remove
		}, cfg, actionOptions);
	}
	if (action === "reactions") {
		const messageId = readToolStringParam(params, "messageId", { required: true });
		const limit = readPositiveIntegerParam(params, "limit");
		return await handleDiscordAction({
			action: "reactions",
			accountId: accountId ?? void 0,
			channelId: readTarget(),
			messageId,
			limit
		}, cfg, actionOptions);
	}
	if (action === "read") {
		const limit = readPositiveIntegerParam(params, "limit");
		return await handleDiscordAction({
			action: "readMessages",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			limit,
			before: readToolStringParam(params, "before"),
			after: readToolStringParam(params, "after"),
			around: readToolStringParam(params, "around")
		}, cfg, actionOptions);
	}
	if (action === "edit") {
		const messageId = readToolStringParam(params, "messageId", { required: true });
		const content = readToolStringParam(params, "message", { required: true });
		return await handleDiscordAction({
			action: "editMessage",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			messageId,
			content
		}, cfg, actionOptions);
	}
	if (action === "delete") {
		const messageId = readToolStringParam(params, "messageId", { required: true });
		return await handleDiscordAction({
			action: "deleteMessage",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			messageId
		}, cfg, actionOptions);
	}
	if (action === "pin" || action === "unpin" || action === "list-pins") {
		const messageId = action === "list-pins" ? void 0 : readToolStringParam(params, "messageId", { required: true });
		return await handleDiscordAction({
			action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			messageId
		}, cfg, actionOptions);
	}
	if (action === "permissions") return await handleDiscordAction({
		action: "permissions",
		accountId: accountId ?? void 0,
		channelId: resolveChannelId()
	}, cfg, actionOptions);
	if (action === "thread-create") {
		const name = readToolStringParam(params, "threadName", { required: true });
		const messageId = readToolStringParam(params, "messageId");
		const content = readToolStringParam(params, "message");
		const autoArchiveMinutes = readDiscordAutoArchiveDurationParam(params, "autoArchiveMin");
		const appliedTags = readStringArrayParam(params, "appliedTags");
		const result = await handleDiscordAction({
			action: "threadCreate",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			name,
			messageId,
			content,
			autoArchiveMinutes,
			appliedTags: appliedTags ?? void 0
		}, cfg, actionOptions);
		const details = result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : void 0;
		if (details?.ok === true) {
			const threadId = typeof details.thread?.id === "string" ? details.thread.id : void 0;
			await notifyDiscordActiveTurnThreadCreated({
				sessionKey: ctx.sessionKey,
				accountId,
				sourceChannelId: resolveChannelId(),
				sourceMessageId: messageId,
				threadId
			});
		}
		notifyVisibleOutbound(result, resolveChannelId());
		return result;
	}
	if (action === "sticker") {
		const to = readToolStringParam(params, "to", { required: true });
		const stickerIds = readStringArrayParam(params, "stickerId", {
			required: true,
			label: "sticker-id"
		}) ?? [];
		const result = await handleDiscordAction({
			action: "sticker",
			accountId: accountId ?? void 0,
			to,
			stickerIds,
			content: readToolStringParam(params, "message")
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to);
		return result;
	}
	if (action === "set-presence") return await handleDiscordAction({
		action: "setPresence",
		accountId: accountId ?? void 0,
		status: readToolStringParam(params, "status"),
		activityType: readToolStringParam(params, "activityType"),
		activityName: readToolStringParam(params, "activityName"),
		activityUrl: readToolStringParam(params, "activityUrl"),
		activityState: readToolStringParam(params, "activityState")
	}, cfg, actionOptions);
	const adminResult = await tryHandleDiscordMessageActionGuildAdmin({
		ctx,
		resolveChannelId,
		readPolicyOptions,
		actionOptions
	});
	if (adminResult !== void 0) {
		if (action === "thread-reply") {
			const threadId = readToolStringParam(params, "threadId") ?? readTarget();
			notifyVisibleOutbound(adminResult, threadId);
			return withAdoptedThreadReplyRoute(adminResult, threadId);
		}
		return adminResult;
	}
	throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
//#endregion
export { handleDiscordMessageAction };
