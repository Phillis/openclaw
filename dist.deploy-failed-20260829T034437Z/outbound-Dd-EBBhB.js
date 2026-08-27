import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { s as statRegularFileSync } from "./regular-file-Dwz6p59y.js";
import { o as getReplyPayloadTtsSupplement } from "./reply-payload-BeeUJOmJ.js";
import "./channel-outbound-vVeKbh9E.js";
import { x as resolveLegacyInteractiveTextFallback } from "./payload-C7E4iMOo.js";
import { S as createReplyToFanout, d as resolvePayloadMediaUrls, h as sendPayloadMediaSequenceAndFinalize, y as sendTextMediaPayload } from "./reply-payload-i0RzN2iF.js";
import { c as resolveTextChunkLimit, s as resolveChunkMode } from "./chunk-_fxsAvI_.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as convertMarkdownTables } from "./tables-DNKAswSM.js";
import { i as isChannelPartialDeliveryError, n as createChannelPartialDeliveryError } from "./delivery-result-BB-vQ7ul.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-D_24uQPz.js";
import "./reply-chunking-BXCYNOLj.js";
import "./channel-inbound-Db8kr_sV.js";
import "./text-chunking-CJz4kAsi.js";
import "./security-runtime-CYUTzVOk.js";
import "./markdown-table-runtime-D3JrYpcZ.js";
import { i as createAttachedChannelResultAdapter, t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.js";
import { c as listDirectoryUserEntriesFromAllowFrom, l as listDirectoryUserEntriesFromAllowFromAndMapKeys, s as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, t as applyDirectoryQueryAndLimit } from "./directory-config-helpers-CWfb67CM.js";
import "./directory-runtime-6zdCRTwq.js";
import { s as resolveFeishuAccount } from "./accounts-BlxFHgUV.js";
import { r as normalizeFeishuTarget } from "./targets-CGcN9qP-.js";
import { E as buildFeishuMediaFallbackText, J as resolveFeishuCardTemplate, K as parseFeishuCommentTarget, L as cleanupAmbientCommentTypingReaction, O as resolveFeishuIdentityHeaderTitle, Q as materializeFeishuPostMarkdownSoftBreaks, X as chunkFeishuMarkdown, Y as sanitizeNativeFeishuCard, Z as chunkFeishuPostMarkdown, _ as sendMessageFeishu, a as isFeishuCardWithinEnvelope, d as shouldSuppressFeishuTextForVoiceMedia, g as sendMarkdownCardFeishu, h as sendCardFeishu, i as buildFeishuPresentationFallback, it as isFeishuGroupReadAllowed, k as deliverCommentThreadText, l as sendMediaFeishu, o as renderFeishuPresentationFallbackText, q as readNativeFeishuCardJson, r as buildFeishuPresentationCardElements, s as resolveFeishuRichReply, t as assertFeishuCardWithinEnvelope, v as sendStructuredCardFeishu } from "./presentation-card-DQSdrDWm.js";
import { n as createFeishuClient } from "./client-Bhwnl2Az.js";
import path from "node:path";
//#region extensions/feishu/src/directory.static.ts
function toFeishuDirectoryPeers(ids) {
	return ids.map((id) => ({
		kind: "user",
		id
	}));
}
function toFeishuDirectoryGroups(ids) {
	return ids.map((id) => ({
		kind: "group",
		id
	}));
}
async function listFeishuDirectoryPeers(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return toFeishuDirectoryPeers(listDirectoryUserEntriesFromAllowFromAndMapKeys({
		allowFrom: account.config.allowFrom,
		map: account.config.dms,
		query: params.query,
		limit: params.limit,
		normalizeAllowFromId: (entry) => normalizeFeishuTarget(entry) ?? entry,
		normalizeMapKeyId: (entry) => normalizeFeishuTarget(entry) ?? entry
	}).map((entry) => entry.id));
}
async function listFeishuDirectoryGroups(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return toFeishuDirectoryGroups(listDirectoryGroupEntriesFromMapKeysAndAllowFrom({
		groups: account.config.groups,
		allowFrom: account.config.groupAllowFrom,
		query: params.query,
		limit: params.limit
	}).map((entry) => entry.id));
}
async function listAuthorizedFeishuDirectoryPeers(params) {
	return toFeishuDirectoryPeers(listDirectoryUserEntriesFromAllowFrom({
		allowFrom: resolveFeishuAccount({
			cfg: params.cfg,
			accountId: params.accountId
		}).config.allowFrom,
		query: params.query,
		limit: params.limit,
		normalizeId: (entry) => normalizeFeishuTarget(entry) ?? entry
	}).map((entry) => entry.id));
}
async function listAuthorizedFeishuDirectoryGroups(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return toFeishuDirectoryGroups(applyDirectoryQueryAndLimit(listDirectoryGroupEntriesFromMapKeysAndAllowFrom({
		groups: Object.fromEntries(Object.entries(account.config.groups ?? {}).filter(([, group]) => group?.enabled !== false)),
		allowFrom: account.config.groupAllowFrom
	}).filter((entry) => isFeishuGroupReadAllowed(params.cfg, account, entry.id, false)).map((entry) => entry.id), params));
}
//#endregion
//#region extensions/feishu/src/outbound.ts
const RENDERED_FEISHU_CARD = Symbol("openclaw.renderedFeishuCard");
const FEISHU_PRESENTATION_FALLBACK_MARKER = "__openclawPresentationFallback";
const FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER = "__openclawPropagateMediaUploadFailure";
const FEISHU_TEXT_CHUNK_LIMIT = 4e3;
function normalizePossibleLocalImagePath(text) {
	const raw = text?.trim();
	if (!raw) return null;
	if (/\s/.test(raw)) return null;
	if (/^(https?:\/\/|data:|file:\/\/)/i.test(raw)) return null;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(raw));
	if (![
		".jpg",
		".jpeg",
		".png",
		".gif",
		".webp",
		".bmp",
		".ico",
		".heic",
		".tif",
		".tiff"
	].includes(ext)) return null;
	if (!path.isAbsolute(raw)) return null;
	try {
		if (statRegularFileSync(raw).missing) return null;
	} catch {
		return null;
	}
	return raw;
}
function shouldUseCard(text) {
	return /```[\s\S]*?```/.test(text) || /\|.+\|[\r\n]+\|[-:| ]+\|/.test(text);
}
function markRenderedFeishuCard(card) {
	Object.defineProperty(card, RENDERED_FEISHU_CARD, {
		value: true,
		enumerable: false
	});
	return card;
}
function readNativeFeishuCard(payload) {
	const feishuData = payload.channelData?.feishu;
	if (!isRecord(feishuData)) return;
	const card = feishuData.card ?? feishuData.interactiveCard;
	if (!isRecord(card)) return;
	if (card[RENDERED_FEISHU_CARD] === true) return card;
	const sanitizedCard = sanitizeNativeFeishuCard(card);
	return sanitizedCard ? markRenderedFeishuCard(sanitizedCard) : void 0;
}
function toFeishuOutboundResult(result) {
	const { chatId, ...delivery } = result;
	return {
		...delivery,
		target: {
			kind: "chat",
			id: chatId
		}
	};
}
async function reportFeishuOutboundDelivery(result, onDeliveryResult) {
	await onDeliveryResult?.(attachChannelToResult("feishu", toFeishuOutboundResult(result)));
	return result;
}
function consumeFeishuPresentationFallbackMarker(payload) {
	const feishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
	const presentationFallback = feishuData?.[FEISHU_PRESENTATION_FALLBACK_MARKER];
	if (!isRecord(presentationFallback) || typeof presentationFallback.hasVisibleContent !== "boolean") return { payload };
	const nextFeishuData = { ...feishuData };
	delete nextFeishuData[FEISHU_PRESENTATION_FALLBACK_MARKER];
	const nextChannelData = { ...payload.channelData };
	if (Object.keys(nextFeishuData).length > 0) nextChannelData.feishu = nextFeishuData;
	else delete nextChannelData.feishu;
	return {
		payload: {
			...payload,
			channelData: Object.keys(nextChannelData).length > 0 ? nextChannelData : void 0
		},
		presentationFallback: { hasVisibleContent: presentationFallback.hasVisibleContent }
	};
}
function readFeishuPropagateMediaUploadFailure(payload) {
	return (isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0)?.[FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER] === true;
}
function buildFeishuPropagationOnlyChannelData(payload) {
	if ((isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0)?.["__openclawPropagateMediaUploadFailure"] !== true) return;
	return { feishu: { [FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER]: true } };
}
function buildFeishuPayloadCard(params) {
	const nativeCard = readNativeFeishuCard(params.payload);
	if (nativeCard) {
		assertFeishuCardWithinEnvelope(nativeCard, "Feishu native card");
		return nativeCard;
	}
	const rawText = params.text ?? params.payload.text;
	const textCard = readNativeFeishuCardJson(rawText);
	const { interactive, presentation } = resolveFeishuRichReply(params.payload);
	if (!presentation) {
		if (!textCard) return;
		assertFeishuCardWithinEnvelope(textCard, "Feishu native card");
		return markRenderedFeishuCard(textCard);
	}
	const elements = buildFeishuPresentationCardElements({
		presentation,
		fallbackText: textCard ? void 0 : resolveLegacyInteractiveTextFallback({
			text: rawText,
			interactive
		})
	});
	const identityTitle = resolveFeishuIdentityHeaderTitle(params.identity);
	const title = presentation?.title ?? identityTitle;
	const template = resolveFeishuCardTemplate(presentation?.tone === "danger" ? "red" : presentation?.tone === "warning" ? "orange" : presentation?.tone === "success" ? "green" : "blue");
	const card = markRenderedFeishuCard({
		schema: "2.0",
		config: { width_mode: "fill" },
		...title ? { header: {
			title: {
				tag: "plain_text",
				content: title
			},
			template: template ?? "blue"
		} } : {},
		body: { elements }
	});
	return isFeishuCardWithinEnvelope(card) ? card : void 0;
}
function renderFeishuPresentationPayload({ payload, presentation, ctx }) {
	const { fallbackText, fallbackHasCommand } = buildFeishuPresentationFallback({
		text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
		presentation,
		textFormat: parseFeishuCommentTarget(ctx.to) ? "plain" : "markdown"
	});
	const card = buildFeishuPayloadCard({
		payload,
		text: payload.text,
		identity: ctx.identity
	});
	const existingFeishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
	if (!card) return {
		...payload,
		text: fallbackText,
		channelData: {
			...payload.channelData,
			feishu: {
				...existingFeishuData,
				[FEISHU_PRESENTATION_FALLBACK_MARKER]: { hasVisibleContent: Boolean(renderFeishuPresentationFallbackText({ presentation }).trim()) },
				...fallbackHasCommand ? { fallbackHasCommand: true } : {}
			}
		}
	};
	return {
		...payload,
		text: fallbackText,
		channelData: {
			...payload.channelData,
			feishu: {
				...existingFeishuData,
				card,
				...fallbackHasCommand ? { fallbackHasCommand: true } : {}
			}
		}
	};
}
function resolveFeishuReplyMode(params) {
	const replyToMessageId = params.replyToId?.trim();
	if (replyToMessageId) return {
		normalizedReplyToId: replyToMessageId,
		replyToMessageId,
		replyInThread: false
	};
	const threadId = params.threadId == null ? void 0 : String(params.threadId).trim();
	return threadId ? {
		normalizedReplyToId: void 0,
		replyToMessageId: threadId,
		replyInThread: true
	} : {
		normalizedReplyToId: void 0,
		replyToMessageId: void 0,
		replyInThread: false
	};
}
async function sendCommentThreadReply(params) {
	const target = parseFeishuCommentTarget(params.to);
	if (!target) return null;
	const client = createFeishuClient(resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}));
	const replyId = params.replyId?.trim();
	try {
		const result = await deliverCommentThreadText(client, {
			file_token: target.fileToken,
			file_type: target.fileType,
			comment_id: target.commentId,
			content: params.text
		});
		return {
			messageId: (result.delivery_mode === "reply_comment" ? result.reply_id : result.comment_id) ?? "",
			chatId: target.commentId,
			result
		};
	} finally {
		if (replyId) cleanupAmbientCommentTypingReaction({
			client,
			deliveryContext: {
				channel: "feishu",
				to: params.to,
				threadId: replyId
			}
		});
	}
}
async function sendOutboundText(params) {
	const { cfg, to, text, accountId, replyToMessageId, replyInThread, onDeliveryResult } = params;
	const commentResult = await sendCommentThreadReply({
		cfg,
		to,
		text,
		replyId: replyToMessageId,
		accountId
	});
	if (commentResult) return await reportFeishuOutboundDelivery(commentResult, onDeliveryResult);
	const renderMode = resolveFeishuAccount({
		cfg,
		accountId
	}).config?.renderMode ?? "auto";
	if (renderMode === "card" || renderMode === "auto" && shouldUseCard(text)) return await reportFeishuOutboundDelivery(await sendMarkdownCardFeishu({
		cfg,
		to,
		text,
		accountId,
		replyToMessageId,
		replyInThread
	}), onDeliveryResult);
	const normalizedText = materializeFeishuPostMarkdownSoftBreaks(convertMarkdownTables(text, resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	})));
	const subChunks = chunkFeishuPostMarkdown({
		text: normalizedText,
		limit: resolveTextChunkLimit(cfg, "feishu", accountId, { fallbackLimit: FEISHU_TEXT_CHUNK_LIMIT }),
		mode: resolveChunkMode(cfg, "feishu", accountId)
	});
	let lastResult;
	const preserveThread = replyInThread === true;
	const nextReplyToMessageId = createReplyToFanout({
		replyToId: replyToMessageId,
		replyToIdSource: params.replyToIdSource,
		replyToMode: params.replyToMode ?? "first"
	});
	for (const [i, chunk] of (subChunks.length ? subChunks : [normalizedText]).entries()) lastResult = await reportFeishuOutboundDelivery(await sendMessageFeishu({
		cfg,
		to,
		text: chunk,
		preparedPostText: true,
		accountId,
		replyToMessageId: preserveThread ? replyToMessageId : nextReplyToMessageId(),
		replyInThread: preserveThread ? true : i === 0 ? replyInThread : void 0
	}), onDeliveryResult);
	return lastResult;
}
async function sendFeishuFallbackPayload(params) {
	const propagateMediaUploadFailure = readFeishuPropagateMediaUploadFailure(params.payload);
	const ctx = {
		...params.ctx,
		payload: params.payload
	};
	const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(params.payload));
	const text = params.payload.text ?? "";
	const textChunks = text ? chunkFeishuMarkdown(text, FEISHU_TEXT_CHUNK_LIMIT) : [];
	if (!(mediaUrls.length > 0 && (propagateMediaUploadFailure || params.separateMediaAndText === true || textChunks.length > 1))) return await sendTextMediaPayload({
		channel: "feishu",
		ctx,
		adapter: feishuOutbound
	});
	const { normalizedReplyToId } = resolveFeishuReplyMode({
		replyToId: ctx.replyToId,
		threadId: ctx.threadId
	});
	const nextReplyToId = createReplyToFanout({
		replyToId: normalizedReplyToId,
		replyToIdSource: ctx.replyToIdSource,
		replyToMode: ctx.replyToMode
	});
	const sendMedia = feishuOutbound.sendMedia;
	const sendText = feishuOutbound.sendText;
	if (!sendMedia || !sendText) throw new Error("Feishu fallback delivery is not available.");
	let lastResult;
	for (const mediaUrl of mediaUrls) lastResult = await sendMedia({
		...ctx,
		text: "",
		mediaUrl,
		replyToId: nextReplyToId(),
		audioAsVoice: params.payload.audioAsVoice ?? ctx.audioAsVoice,
		...propagateMediaUploadFailure ? { propagateMediaUploadFailure: true } : {}
	});
	for (const chunk of textChunks) lastResult = await sendText({
		...ctx,
		text: chunk,
		replyToId: nextReplyToId()
	});
	return lastResult;
}
async function sendFeishuTtsSupplementPayload(params) {
	const sendMedia = feishuOutbound.sendMedia;
	const sendText = feishuOutbound.sendText;
	if (!sendMedia || !sendText) throw new Error("Feishu TTS supplement delivery is not available.");
	const { normalizedReplyToId } = resolveFeishuReplyMode({
		replyToId: params.ctx.replyToId,
		threadId: params.ctx.threadId
	});
	const nextReplyToId = createReplyToFanout({
		replyToId: normalizedReplyToId,
		replyToIdSource: params.ctx.replyToIdSource,
		replyToMode: params.ctx.replyToMode
	});
	const ctx = {
		...params.ctx,
		payload: params.payload
	};
	let lastResult;
	if (params.sendVisiblePayload) {
		lastResult = await params.sendVisiblePayload(nextReplyToId());
		await ctx.onDeliveryResult?.(lastResult);
	} else if (params.hasVisiblePresentationFallback || params.supplement.visibleTextAlreadyDelivered !== true) {
		const text = params.payload.text?.trim() ? params.payload.text : params.supplement.spokenText;
		for (const chunk of chunkFeishuMarkdown(text, FEISHU_TEXT_CHUNK_LIMIT)) lastResult = await sendText({
			...ctx,
			text: chunk,
			replyToId: nextReplyToId()
		});
	}
	for (const mediaUrl of normalizeStringEntries(resolvePayloadMediaUrls(params.payload))) lastResult = await sendMedia({
		...ctx,
		text: "",
		mediaUrl,
		replyToId: nextReplyToId(),
		audioAsVoice: params.payload.audioAsVoice ?? ctx.audioAsVoice
	});
	return lastResult ?? {
		channel: "feishu",
		messageId: ""
	};
}
const feishuOutbound = {
	deliveryMode: "direct",
	chunker: chunkFeishuMarkdown,
	chunkerMode: "markdown",
	textChunkLimit: FEISHU_TEXT_CHUNK_LIMIT,
	presentationCapabilities: {
		supported: true,
		buttons: true,
		selects: false,
		context: true,
		divider: true,
		limits: {
			actions: {
				maxActions: 20,
				maxActionsPerRow: 5,
				maxLabelLength: 40,
				maxValueBytes: 1024
			},
			text: {
				maxLength: FEISHU_TEXT_CHUNK_LIMIT,
				encoding: "characters",
				markdownDialect: "markdown"
			}
		}
	},
	renderPresentation: renderFeishuPresentationPayload,
	sendPayload: async (ctx) => {
		const { payload, presentationFallback } = consumeFeishuPresentationFallbackMarker(ctx.payload);
		const ttsSupplement = getReplyPayloadTtsSupplement(payload);
		if (parseFeishuCommentTarget(ctx.to)) {
			const { presentation } = resolveFeishuRichReply(payload);
			const textCard = readNativeFeishuCardJson(payload.text);
			const { commentText: text, fallbackText } = buildFeishuPresentationFallback({
				text: textCard ? void 0 : payload.text,
				presentation,
				fallbackHasCommand: isRecord(payload.channelData?.feishu) && payload.channelData.feishu.fallbackHasCommand === true
			});
			const hasFallbackMedia = normalizeStringEntries(resolvePayloadMediaUrls(payload)).length > 0;
			if (!fallbackText.trim() && !hasFallbackMedia && (textCard || readNativeFeishuCard(payload))) throw new Error("Feishu native cards cannot be sent to document comments without a text or media fallback.");
			return await sendFeishuFallbackPayload({
				ctx,
				payload: {
					...payload,
					text,
					interactive: void 0,
					presentation: void 0,
					channelData: buildFeishuPropagationOnlyChannelData(payload)
				},
				separateMediaAndText: true
			});
		}
		const card = buildFeishuPayloadCard({
			payload,
			text: ctx.text,
			identity: ctx.identity
		});
		if (!card) {
			const { presentation } = resolveFeishuRichReply(payload);
			const fallbackPayload = presentation ? {
				...payload,
				text: renderFeishuPresentationFallbackText({
					text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
					presentation
				}, "markdown"),
				presentation: void 0,
				interactive: void 0
			} : payload;
			if (ttsSupplement) return await sendFeishuTtsSupplementPayload({
				ctx,
				payload: fallbackPayload,
				supplement: ttsSupplement,
				hasVisiblePresentationFallback: presentationFallback?.hasVisibleContent ?? Boolean(renderFeishuPresentationFallbackText({ presentation }).trim())
			});
			return await sendFeishuFallbackPayload({
				ctx,
				payload: fallbackPayload,
				separateMediaAndText: presentationFallback !== void 0 || presentation !== void 0
			});
		}
		if (ttsSupplement) return await sendFeishuTtsSupplementPayload({
			ctx,
			payload,
			supplement: ttsSupplement,
			sendVisiblePayload: async (replyToId) => {
				const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
					replyToId,
					threadId: ctx.threadId
				});
				return attachChannelToResult("feishu", toFeishuOutboundResult(await sendCardFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					card,
					replyToMessageId,
					replyInThread,
					accountId: ctx.accountId ?? void 0
				})));
			}
		});
		const { normalizedReplyToId } = resolveFeishuReplyMode({
			replyToId: ctx.replyToId,
			threadId: ctx.threadId
		});
		const nextReplyToId = createReplyToFanout({
			replyToId: normalizedReplyToId,
			replyToIdSource: ctx.replyToIdSource,
			replyToMode: ctx.replyToMode
		});
		const nextReplyMode = () => resolveFeishuReplyMode({
			replyToId: nextReplyToId(),
			threadId: ctx.threadId
		});
		const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(payload));
		return attachChannelToResult("feishu", toFeishuOutboundResult(await sendPayloadMediaSequenceAndFinalize({
			text: payload.text ?? "",
			mediaUrls,
			onResult: async (deliveryResult) => {
				await ctx.onDeliveryResult?.(attachChannelToResult("feishu", toFeishuOutboundResult(deliveryResult)));
			},
			send: async ({ mediaUrl }) => {
				const { replyToMessageId, replyInThread } = nextReplyMode();
				return await sendMediaFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					mediaUrl,
					accountId: ctx.accountId ?? void 0,
					mediaAccess: ctx.mediaAccess,
					mediaLocalRoots: ctx.mediaLocalRoots,
					mediaReadFile: ctx.mediaReadFile,
					replyToMessageId,
					replyInThread,
					...payload.audioAsVoice === true || ctx.audioAsVoice === true ? { audioAsVoice: true } : {}
				});
			},
			finalize: async () => {
				const { replyToMessageId, replyInThread } = nextReplyMode();
				return await sendCardFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					card,
					replyToMessageId,
					replyInThread,
					accountId: ctx.accountId ?? void 0
				});
			}
		})));
	},
	...createAttachedChannelResultAdapter({
		channel: "feishu",
		sendText: async ({ cfg, to, text, accountId, replyToId, replyToIdSource, replyToMode, threadId, mediaAccess, mediaLocalRoots, mediaReadFile, identity, onDeliveryResult }) => {
			const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
				replyToId,
				threadId
			});
			const deliveryOptions = {
				replyToIdSource,
				replyToMode,
				onDeliveryResult
			};
			const localImagePath = normalizePossibleLocalImagePath(text);
			if (localImagePath) {
				let mediaResult;
				try {
					mediaResult = await sendMediaFeishu({
						cfg,
						to,
						mediaUrl: localImagePath,
						accountId: accountId ?? void 0,
						replyToMessageId,
						replyInThread,
						mediaAccess,
						mediaLocalRoots,
						mediaReadFile
					});
				} catch (err) {
					if (isChannelPartialDeliveryError(err)) throw err;
					console.error(`[feishu] local image path auto-send failed:`, err);
					return toFeishuOutboundResult(await sendOutboundText({
						cfg,
						to,
						text: await buildFeishuMediaFallbackText({}),
						accountId: accountId ?? void 0,
						replyToMessageId,
						replyInThread,
						...deliveryOptions
					}));
				}
				return toFeishuOutboundResult(await reportFeishuOutboundDelivery(mediaResult, onDeliveryResult));
			}
			if (parseFeishuCommentTarget(to)) return toFeishuOutboundResult(await sendOutboundText({
				cfg,
				to,
				text,
				accountId: accountId ?? void 0,
				replyToMessageId,
				replyInThread,
				...deliveryOptions
			}));
			const card = readNativeFeishuCardJson(text);
			if (card) {
				assertFeishuCardWithinEnvelope(card, "Feishu native card");
				return toFeishuOutboundResult(await reportFeishuOutboundDelivery(await sendCardFeishu({
					cfg,
					to,
					card: markRenderedFeishuCard(card),
					accountId: accountId ?? void 0,
					replyToMessageId,
					replyInThread
				}), onDeliveryResult));
			}
			const renderMode = resolveFeishuAccount({
				cfg,
				accountId: accountId ?? void 0
			}).config?.renderMode ?? "auto";
			if (renderMode === "card" || renderMode === "auto" && shouldUseCard(text)) {
				const header = identity ? {
					title: resolveFeishuIdentityHeaderTitle(identity),
					template: "blue"
				} : void 0;
				return toFeishuOutboundResult(await reportFeishuOutboundDelivery(await sendStructuredCardFeishu({
					cfg,
					to,
					text,
					replyToMessageId,
					replyInThread,
					accountId: accountId ?? void 0,
					header: header?.title ? header : void 0
				}), onDeliveryResult));
			}
			return toFeishuOutboundResult(await sendOutboundText({
				cfg,
				to,
				text,
				accountId: accountId ?? void 0,
				replyToMessageId,
				replyInThread,
				...deliveryOptions
			}));
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, audioAsVoice, accountId, mediaAccess, mediaLocalRoots, mediaReadFile, replyToId, replyToIdSource, replyToMode, threadId, onDeliveryResult, propagateMediaUploadFailure = false }) => {
			const { normalizedReplyToId } = resolveFeishuReplyMode({
				replyToId,
				threadId
			});
			const nextReplyToId = createReplyToFanout({
				replyToId: normalizedReplyToId,
				replyToIdSource,
				replyToMode
			});
			const nextReplyMode = () => {
				const { replyToMessageId, replyInThread } = resolveFeishuReplyMode({
					replyToId: nextReplyToId(),
					threadId
				});
				return {
					replyToMessageId,
					replyInThread
				};
			};
			const deliveryOptions = {
				replyToIdSource,
				replyToMode,
				onDeliveryResult
			};
			if (parseFeishuCommentTarget(to)) return toFeishuOutboundResult(await sendOutboundText({
				cfg,
				to,
				text: mediaUrl?.trim() ? await buildFeishuMediaFallbackText({
					text,
					mediaUrl,
					mediaLinkStyle: "plain"
				}) : text?.trim() ?? "",
				accountId: accountId ?? void 0,
				...nextReplyMode(),
				...deliveryOptions
			}));
			if (!mediaUrl) return toFeishuOutboundResult(await sendOutboundText({
				cfg,
				to,
				text: text ?? "",
				accountId: accountId ?? void 0,
				...nextReplyMode(),
				...deliveryOptions
			}));
			const suppressTextForVoiceMedia = shouldSuppressFeishuTextForVoiceMedia({
				mediaUrl,
				audioAsVoice
			});
			let textSent = false;
			let captionResult;
			if (text?.trim() && !suppressTextForVoiceMedia) {
				captionResult = await sendOutboundText({
					cfg,
					to,
					text,
					accountId: accountId ?? void 0,
					...nextReplyMode(),
					...deliveryOptions
				});
				textSent = true;
			}
			let mediaResult;
			const mediaReplyMode = nextReplyMode();
			try {
				mediaResult = await sendMediaFeishu({
					cfg,
					to,
					mediaUrl,
					accountId: accountId ?? void 0,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile,
					...mediaReplyMode,
					...audioAsVoice === true ? { audioAsVoice: true } : {}
				});
			} catch (err) {
				if (isChannelPartialDeliveryError(err)) throw err;
				if (propagateMediaUploadFailure) {
					if (textSent && captionResult) throw createChannelPartialDeliveryError(err, {
						messageIds: [captionResult.messageId],
						visibleReplySent: true
					});
					throw new Error(`Feishu send could not deliver the requested media attachment: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
				}
				console.error(`[feishu] sendMediaFeishu failed:`, err);
				return toFeishuOutboundResult(await sendOutboundText({
					cfg,
					to,
					text: await buildFeishuMediaFallbackText({
						text: textSent ? void 0 : text,
						mediaUrl
					}),
					accountId: accountId ?? void 0,
					...textSent ? nextReplyMode() : mediaReplyMode,
					...deliveryOptions
				}));
			}
			await reportFeishuOutboundDelivery(mediaResult, onDeliveryResult);
			if (mediaResult.voiceIntentDegradedToFile && text?.trim()) await sendOutboundText({
				cfg,
				to,
				text,
				accountId: accountId ?? void 0,
				...nextReplyMode(),
				...deliveryOptions
			});
			return toFeishuOutboundResult(mediaResult);
		}
	})
};
//#endregion
export { listAuthorizedFeishuDirectoryPeers as a, listAuthorizedFeishuDirectoryGroups as i, feishuOutbound as n, listFeishuDirectoryGroups as o, resolveFeishuReplyMode as r, listFeishuDirectoryPeers as s, FEISHU_PROPAGATE_MEDIA_UPLOAD_FAILURE_MARKER as t };
