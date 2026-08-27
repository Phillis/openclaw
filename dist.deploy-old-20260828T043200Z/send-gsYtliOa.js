import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./channel-outbound-0oFCMpw9.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-D_24uQPz.js";
import { r as loadOutboundMediaFromUrl } from "./outbound-media-Be17J8p1.js";
import { r as resolveChannelMediaMaxBytes } from "./media-runtime-qcekT37I.js";
import "./markdown-table-runtime-D3JrYpcZ.js";
import { t as getMSTeamsRuntime } from "./runtime-WoHzfrEz.js";
import "./runtime-api-3yfRVTNd.js";
import { D as loadMSTeamsSdkWithAuth, E as createMSTeamsTokenProvider, F as resolveMSTeamsSdkCloudOptions, I as validateMSTeamsProactiveServiceUrlBoundary, M as isAllowedBotFrameworkServiceUrl, N as normalizeBotFrameworkServiceUrl, S as resolveMSTeamsCredentials, j as describeBotFrameworkServiceUrlHost, r as normalizeMSTeamsConversationId, t as extractMSTeamsConversationMessageId } from "./inbound-5byP9f5_.js";
import { i as resolveMSTeamsRouteConfig, r as resolveMSTeamsReplyPolicy } from "./policy-BuF0wyio.js";
import { r as resolveMSTeamsAccount } from "./channel-config-Be-TsfQY.js";
import { i as formatUnknownError, r as formatMSTeamsSendErrorHint, t as classifyMSTeamsSendError } from "./errors-wR6Jg-1j.js";
import { o as buildMSTeamsPollCard, v as createMSTeamsConversationStoreState } from "./polls-DmtubpOT.js";
import { S as setPendingUploadActivityIdFs, a as sendMSTeamsActivityWithReference, c as extractFilename, d as requireMSTeamsSharePointSiteId, f as uploadAndShareSharePoint, g as requiresFileConsent, h as prepareFileConsentActivityFs, i as deleteMSTeamsActivityWithReference, l as extractMessageId, m as formatMSTeamsMarkdown, o as updateMSTeamsActivityWithReference, p as buildTeamsFileInfoCard, r as sendMSTeamsMessages, t as buildConversationReference, u as getDriveItemProperties, y as setPendingUploadActivityId } from "./messenger-B5Xu5Ns6.js";
//#region extensions/msteams/src/send-context.ts
function resolveMSTeamsProactiveReplyTarget(params) {
	const threadRootId = params.ref.threadId ?? params.ref.activityId;
	if (params.conversationType !== "channel" || !threadRootId) return { replyStyle: "top-level" };
	const routeConfig = resolveMSTeamsRouteConfig({
		cfg: params.cfg,
		teamId: params.ref.teamId,
		conversationId: params.conversationId,
		allowNameMatching: false
	});
	const { replyStyle } = resolveMSTeamsReplyPolicy({
		isDirectMessage: false,
		globalConfig: params.cfg,
		teamConfig: routeConfig.teamConfig,
		channelConfig: routeConfig.channelConfig
	});
	return replyStyle === "thread" ? {
		replyStyle,
		threadActivityId: threadRootId
	} : { replyStyle };
}
/**
* Parse the target value into a conversation reference lookup key.
* Supported formats:
* - conversation:19:abc@thread.tacv2 → lookup by conversation ID
* - conversation:19:abc@thread.tacv2;messageid=root → lookup base ID, use root
* - user:aad-object-id → lookup by user AAD object ID
* - 19:abc@thread.tacv2 → direct conversation ID
*/
function parseRecipient(to) {
	const trimmed = to.trim();
	const finalize = (type, id) => {
		const normalized = id.trim();
		if (!normalized) throw new Error(`Invalid target value: missing ${type} id`);
		if (type === "conversation") {
			const threadId = extractMSTeamsConversationMessageId(normalized);
			const normalizedConversationId = normalizeMSTeamsConversationId(normalized);
			const slashIndex = normalizedConversationId.indexOf("/");
			const graphChannelId = slashIndex > 0 ? normalizedConversationId.slice(slashIndex + 1) : void 0;
			return {
				type,
				id: graphChannelId && (graphChannelId.startsWith("19:") || graphChannelId.includes("@thread")) ? graphChannelId : normalizedConversationId,
				...threadId ? { threadId } : {}
			};
		}
		return {
			type,
			id: normalized
		};
	};
	if (trimmed.startsWith("conversation:")) return finalize("conversation", trimmed.slice(13));
	if (trimmed.startsWith("user:")) return finalize("user", trimmed.slice(5));
	if (trimmed.startsWith("19:") || trimmed.includes("@thread")) return finalize("conversation", trimmed);
	return finalize("user", trimmed);
}
/**
* Find a stored conversation reference for the given recipient.
*/
async function findConversationReference(recipient) {
	if (recipient.type === "conversation") {
		const ref = await recipient.store.get(recipient.id);
		if (ref) return {
			conversationId: recipient.id,
			ref
		};
		return null;
	}
	const found = await recipient.store.findPreferredDmByUserId(recipient.id);
	if (!found) return null;
	return {
		conversationId: found.conversationId,
		ref: found.reference
	};
}
async function resolveMSTeamsSendContext(params) {
	const msteamsCfg = params.cfg.channels?.msteams;
	if (!msteamsCfg?.enabled) throw new Error("msteams provider is not enabled");
	const account = resolveMSTeamsAccount(params.cfg);
	if (account.tokenStatus === "configured_unavailable") throw new Error("msteams credential file is configured but unavailable");
	if (!account.configured) throw new Error("msteams credentials not configured");
	const creds = resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) throw new Error("msteams credentials not configured");
	const store = createMSTeamsConversationStoreState();
	const recipient = parseRecipient(params.to);
	const found = await findConversationReference({
		...recipient,
		store
	});
	if (!found) throw new Error(`No conversation reference found for ${recipient.type}:${recipient.id}. The bot must receive a message from this conversation before it can send proactively.`);
	const conversationId = found.conversationId;
	const ref = recipient.threadId ? {
		...found.ref,
		threadId: recipient.threadId
	} : found.ref;
	const log = getMSTeamsRuntime().logging.getChildLogger({ name: "msteams:send" });
	if (ref.serviceUrl && !isAllowedBotFrameworkServiceUrl(ref.serviceUrl)) {
		try {
			await store.remove(conversationId);
		} catch (err) {
			log.warn?.("failed to remove blocked msteams conversation reference", {
				conversationId,
				error: formatUnknownError(err)
			});
		}
		throw new Error(`Stored Microsoft Teams conversation reference has blocked serviceUrl host: ${describeBotFrameworkServiceUrlHost(ref.serviceUrl)}. The bot must receive a new message from this conversation before it can send proactively.`);
	}
	const safeRef = ref.serviceUrl ? {
		...ref,
		serviceUrl: normalizeBotFrameworkServiceUrl(ref.serviceUrl)
	} : ref;
	if (recipient.type === "user") {
		const resolvedType = normalizeLowercaseStringOrEmpty(safeRef.conversation?.conversationType ?? "");
		if (resolvedType && resolvedType !== "personal") throw new Error(`Conversation reference for user:${recipient.id} resolved to a ${resolvedType} conversation (${conversationId}) instead of a personal DM. The bot must receive a DM from this user before it can send proactively.`);
	}
	const sdkCloudOptions = resolveMSTeamsSdkCloudOptions(msteamsCfg);
	const { app } = await loadMSTeamsSdkWithAuth(creds, sdkCloudOptions);
	validateMSTeamsProactiveServiceUrlBoundary({
		cloud: sdkCloudOptions.cloud,
		conversationId,
		storedServiceUrl: safeRef.serviceUrl,
		configuredServiceUrl: sdkCloudOptions.serviceUrl
	});
	const tokenProvider = createMSTeamsTokenProvider(app);
	const storedConversationType = normalizeLowercaseStringOrEmpty(safeRef.conversation?.conversationType ?? "");
	let conversationType;
	if (storedConversationType === "personal") conversationType = "personal";
	else if (storedConversationType === "channel") conversationType = "channel";
	else conversationType = "groupChat";
	const replyTarget = recipient.threadId && conversationType === "channel" ? {
		replyStyle: "thread",
		threadActivityId: recipient.threadId
	} : resolveMSTeamsProactiveReplyTarget({
		cfg: msteamsCfg,
		conversationId,
		ref: safeRef,
		conversationType
	});
	const sharePointSiteId = msteamsCfg.sharePointSiteId;
	const mediaMaxBytes = resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb
	});
	return {
		appId: creds.appId,
		conversationId,
		ref: safeRef,
		app,
		log,
		conversationType,
		...replyTarget,
		sdkCloudOptions,
		tokenProvider,
		sharePointSiteId,
		mediaMaxBytes
	};
}
//#endregion
//#region extensions/msteams/src/send.ts
/** Threshold for large files that require FileConsentCard flow in personal chats */
const FILE_CONSENT_THRESHOLD_BYTES = 4 * 1024 * 1024;
/**
* MSTeams-specific media size limit (100MB).
* Higher than the default to support Teams file-consent and SharePoint uploads.
*/
const MSTEAMS_MAX_MEDIA_BYTES = 100 * 1024 * 1024;
function createMSTeamsSendError(errorPrefix, error) {
	const classification = classifyMSTeamsSendError(error);
	const hint = formatMSTeamsSendErrorHint(classification);
	const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
	return new Error(`${errorPrefix} failed${status}: ${formatUnknownError(error)}${hint ? ` (${hint})` : ""}`, { cause: error });
}
function createMSTeamsSendReceipt(params) {
	const receipt = createMessageReceiptFromOutboundResults({
		kind: params.kind,
		results: params.platformMessageIds.map((messageId) => ({
			channel: "msteams",
			messageId,
			conversationId: params.conversationId
		}))
	});
	if (!params.kinds) return receipt;
	const kinds = params.kinds;
	return {
		...receipt,
		parts: receipt.parts.map((part, index) => {
			const nextPart = {
				platformMessageId: part.platformMessageId,
				kind: kinds[index] ?? params.kind,
				index: part.index
			};
			if (part.threadId) nextPart.threadId = part.threadId;
			if (part.replyToId) nextPart.replyToId = part.replyToId;
			if (part.raw) nextPart.raw = part.raw;
			return nextPart;
		})
	};
}
function createMSTeamsSendResult(params) {
	const platformMessageIds = (params.platformMessageIds?.length ? [...params.platformMessageIds] : [params.messageId]).map((messageId) => messageId.trim()).filter((messageId) => messageId && messageId !== "unknown");
	return {
		messageId: params.messageId,
		conversationId: params.conversationId,
		receipt: createMSTeamsSendReceipt({
			conversationId: params.conversationId,
			platformMessageIds,
			kind: params.kind
		}),
		...params.pendingUploadId ? { pendingUploadId: params.pendingUploadId } : {}
	};
}
/**
* Send a message to a Teams conversation or user.
*
* Uses the stored ConversationReference from previous interactions.
* The bot must have received at least one message from the conversation
* before proactive messaging works.
*
* File handling by conversation type:
* - Personal (1:1) chats: small images (<4MB) use base64, large files and non-images use FileConsentCard
* - Group chats / channels: files require configured SharePoint storage
*/
async function sendMessageMSTeams(params) {
	const { cfg, to, text, mediaUrl, filename, mediaAccess, mediaLocalRoots, mediaReadFile } = params;
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "msteams"
	});
	const messageText = formatMSTeamsMarkdown(text ?? "", tableMode);
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { conversationId, log, conversationType, tokenProvider, sharePointSiteId } = ctx;
	log.debug?.("sending proactive message", {
		conversationId,
		conversationType,
		textLength: messageText.length,
		hasMedia: Boolean(mediaUrl)
	});
	if (mediaUrl) {
		const media = await loadOutboundMediaFromUrl(mediaUrl, {
			maxBytes: ctx.mediaMaxBytes ?? MSTEAMS_MAX_MEDIA_BYTES,
			mediaAccess,
			mediaLocalRoots,
			mediaReadFile
		});
		const isLargeFile = media.buffer.length >= FILE_CONSENT_THRESHOLD_BYTES;
		const isImage = media.contentType?.startsWith("image/") ?? false;
		const fallbackFileName = await extractFilename(mediaUrl);
		const fileName = filename?.trim() || media.fileName || fallbackFileName;
		log.debug?.("processing media", {
			fileName,
			contentType: media.contentType,
			size: media.buffer.length,
			isLargeFile,
			isImage,
			conversationType
		});
		if (requiresFileConsent({
			conversationType,
			contentType: media.contentType,
			bufferSize: media.buffer.length,
			thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES
		})) {
			const { activity, uploadId } = await prepareFileConsentActivityFs({
				media: {
					buffer: media.buffer,
					filename: fileName,
					contentType: media.contentType
				},
				conversationId,
				description: messageText || void 0
			});
			log.debug?.("sending file consent card", {
				uploadId,
				fileName,
				size: media.buffer.length
			});
			const messageId = await sendProactiveActivity({
				ctx,
				activity,
				errorPrefix: "msteams consent card send"
			});
			setPendingUploadActivityId(uploadId, messageId);
			await setPendingUploadActivityIdFs(uploadId, messageId);
			log.info("sent file consent card", {
				conversationId,
				messageId,
				uploadId
			});
			return createMSTeamsSendResult({
				messageId,
				conversationId,
				kind: "card",
				pendingUploadId: uploadId
			});
		}
		if (conversationType === "personal") {
			const base64 = media.buffer.toString("base64");
			return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`);
		}
		if (isImage && !sharePointSiteId) {
			const base64 = media.buffer.toString("base64");
			return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`);
		}
		try {
			const siteId = requireMSTeamsSharePointSiteId(sharePointSiteId);
			log.debug?.("uploading to SharePoint for native file card", {
				fileName,
				conversationType,
				siteId
			});
			const uploaded = await uploadAndShareSharePoint({
				buffer: media.buffer,
				filename: fileName,
				contentType: media.contentType,
				tokenProvider,
				siteId,
				chatId: conversationId,
				usePerUserSharing: conversationType === "groupChat"
			});
			log.debug?.("SharePoint upload complete", {
				itemId: uploaded.itemId,
				shareUrl: uploaded.shareUrl
			});
			const driveItem = await getDriveItemProperties({
				siteId,
				itemId: uploaded.itemId,
				tokenProvider
			});
			log.debug?.("driveItem properties retrieved", {
				eTag: driveItem.eTag,
				webDavUrl: driveItem.webDavUrl
			});
			const fileCardAttachment = buildTeamsFileInfoCard(driveItem);
			const messageId = await sendProactiveActivityRaw({
				ctx,
				activity: {
					type: "message",
					text: messageText || void 0,
					attachments: [fileCardAttachment]
				}
			});
			log.info("sent native file card", {
				conversationId,
				messageId,
				fileName: driveItem.name
			});
			return createMSTeamsSendResult({
				messageId,
				conversationId,
				kind: "media"
			});
		} catch (err) {
			throw createMSTeamsSendError("msteams file send", err);
		}
	}
	return sendTextWithMedia(ctx, messageText, void 0);
}
/**
* Send a text message with optional base64 media URL.
*/
async function sendTextWithMedia(ctx, text, mediaUrl) {
	const { app, appId, conversationId, ref, log, tokenProvider, sharePointSiteId, mediaMaxBytes, replyStyle } = ctx;
	const messages = text && mediaUrl ? [{ text }, { mediaUrl }] : [{
		text: text || void 0,
		mediaUrl
	}];
	let platformMessageIds;
	try {
		platformMessageIds = await sendMSTeamsMessages({
			replyStyle,
			app,
			appId,
			conversationRef: ref,
			messages,
			retry: {},
			onRetry: (event) => {
				log.debug?.("retrying send", {
					conversationId,
					...event
				});
			},
			tokenProvider,
			sharePointSiteId,
			mediaMaxBytes,
			serviceUrlBoundary: ctx.sdkCloudOptions
		});
	} catch (err) {
		throw createMSTeamsSendError("msteams send", err);
	}
	const messageId = platformMessageIds[0] ?? "unknown";
	log.info("sent proactive message", {
		conversationId,
		messageId
	});
	return {
		messageId,
		conversationId,
		receipt: createMSTeamsSendReceipt({
			conversationId,
			platformMessageIds,
			kind: mediaUrl ? "media" : "text",
			...text && mediaUrl ? { kinds: ["text", "media"] } : {}
		})
	};
}
async function sendProactiveActivityRaw({ ctx, activity }) {
	const baseRef = buildConversationReference(ctx.ref);
	return extractMessageId(await sendMSTeamsActivityWithReference(ctx.app, baseRef, activity, {
		...ctx.threadActivityId ? { threadActivityId: ctx.threadActivityId } : {},
		serviceUrlBoundary: ctx.sdkCloudOptions
	})) ?? "unknown";
}
async function sendProactiveActivity({ ctx, activity, errorPrefix }) {
	try {
		return await sendProactiveActivityRaw({
			ctx,
			activity
		});
	} catch (err) {
		throw createMSTeamsSendError(errorPrefix, err);
	}
}
/**
* Send a poll (Adaptive Card) to a Teams conversation or user.
*/
async function sendPollMSTeams(params) {
	const { cfg, to, question, options, maxSelections } = params;
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { conversationId, log } = ctx;
	const pollCard = buildMSTeamsPollCard({
		question,
		options,
		maxSelections
	});
	log.debug?.("sending poll", {
		conversationId,
		pollId: pollCard.pollId,
		optionCount: pollCard.options.length
	});
	const messageId = await sendProactiveActivity({
		ctx,
		activity: {
			type: "message",
			attachments: [{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: pollCard.card
			}]
		},
		errorPrefix: "msteams poll send"
	});
	log.info("sent poll", {
		conversationId,
		pollId: pollCard.pollId,
		messageId
	});
	return {
		pollId: pollCard.pollId,
		messageId,
		conversationId
	};
}
/**
* Send an arbitrary Adaptive Card to a Teams conversation or user.
*/
async function sendAdaptiveCardMSTeams(params) {
	const { cfg, to, card } = params;
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { conversationId, log } = ctx;
	log.debug?.("sending adaptive card", {
		conversationId,
		cardType: card.type,
		cardVersion: card.version
	});
	const messageId = await sendProactiveActivity({
		ctx,
		activity: {
			type: "message",
			attachments: [{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: card
			}]
		},
		errorPrefix: "msteams card send"
	});
	log.info("sent adaptive card", {
		conversationId,
		messageId
	});
	return {
		messageId,
		conversationId
	};
}
/**
* Edit (update) a previously sent message in a Teams conversation.
*
* Uses the Bot Framework REST API for proactive edits outside of the
* original turn context.
*/
async function editMessageMSTeams(params) {
	return updateMSTeamsMessageActivity({
		...params,
		activity: {
			type: "message",
			id: params.activityId,
			text: params.text
		}
	});
}
async function editAdaptiveCardMSTeams(params) {
	return updateMSTeamsMessageActivity({
		...params,
		activity: {
			type: "message",
			id: params.activityId,
			attachments: [{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: params.card
			}]
		}
	});
}
async function updateMSTeamsMessageActivity(params) {
	const { cfg, to, activityId, activity } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	log.debug?.("editing proactive message", {
		conversationId,
		activityId
	});
	try {
		await updateMSTeamsActivityWithReference(app, buildConversationReference(ref), activityId, activity, { serviceUrlBoundary: sdkCloudOptions });
	} catch (err) {
		throw createMSTeamsSendError("msteams edit", err);
	}
	log.info("edited proactive message", {
		conversationId,
		activityId
	});
	return { conversationId };
}
/**
* Delete a previously sent message in a Teams conversation.
*
* Uses the Bot Framework REST API for proactive deletes outside of the
* original turn context.
*/
async function deleteMessageMSTeams(params) {
	const { cfg, to, activityId } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	log.debug?.("deleting proactive message", {
		conversationId,
		activityId
	});
	try {
		await deleteMSTeamsActivityWithReference(app, buildConversationReference(ref), activityId, { serviceUrlBoundary: sdkCloudOptions });
	} catch (err) {
		throw createMSTeamsSendError("msteams delete", err);
	}
	log.info("deleted proactive message", {
		conversationId,
		activityId
	});
	return { conversationId };
}
//#endregion
export { sendMessageMSTeams as a, sendAdaptiveCardMSTeams as i, editAdaptiveCardMSTeams as n, sendPollMSTeams as o, editMessageMSTeams as r, deleteMessageMSTeams as t };
