import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { s as statRegularFileSync } from "./regular-file-SotPWt-b.js";
import { o as getReplyPayloadTtsSupplement } from "./reply-payload-DVcGHORx.js";
import "./channel-outbound-CI0BSGM5.js";
import { _ as sendTextMediaPayload, b as createReplyToFanout, l as resolvePayloadMediaUrls, p as sendPayloadMediaSequenceAndFinalize } from "./reply-payload-DBNGwex4.js";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, l as legacyInteractiveReplyToPresentation, v as renderMessagePresentationFallbackText, x as resolveLegacyInteractiveTextFallback } from "./payload-ByplrRCQ.js";
import { i as isChannelPartialDeliveryError } from "./delivery-result-CTssVT68.js";
import { c as resolveTextChunkLimit, s as resolveChunkMode } from "./chunk-D68NbSMe.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./security-runtime-fAO34zGh.js";
import "./text-chunking-BrrQ2GHk.js";
import { t as convertMarkdownTables } from "./tables-B5czjBEh.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-CUY1CGUC.js";
import "./reply-chunking-CHD0FVKS.js";
import "./channel-inbound-BQIYtmB7.js";
import "./markdown-table-runtime-Bq4UlJHf.js";
import { i as createAttachedChannelResultAdapter, t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.js";
import { l as resolveFeishuRuntimeAccount, s as resolveFeishuAccount } from "./accounts-CbPcV0DY.js";
import { a as readNativeFeishuCardJson, d as chunkFeishuPostMarkdown, f as materializeFeishuPostMarkdownSoftBreaks, o as resolveFeishuCardTemplate, s as sanitizeNativeFeishuCard, u as chunkFeishuMarkdown } from "./send-result-D4UBKEbR.js";
import { c as listFeishuDirectoryPeers, i as isFeishuCardWithinEnvelope, r as buildFeishuPresentationCardElements, s as listFeishuDirectoryGroups, t as assertFeishuCardWithinEnvelope } from "./presentation-card-eG7yUyT8.js";
import { n as createFeishuClient } from "./client-BUh9xEhw.js";
import { _ as parseFeishuCommentTarget, a as assertFeishuChatMember, c as getChatMembers, l as getFeishuMemberInfo, o as buildFeishuDirectChatMembers, r as cleanupAmbientCommentTypingReaction, s as getChatInfo, t as deliverCommentThreadText } from "./drive-DZfDLg5x.js";
import { a as getMessageFeishu, b as resolveFeishuIdentityHeaderTitle, c as sendMarkdownCardFeishu, i as editMessageFeishu, l as sendMessageFeishu, n as sendMediaFeishu, r as shouldSuppressFeishuTextForVoiceMedia, s as sendCardFeishu, u as sendStructuredCardFeishu, v as buildFeishuMediaFallbackText } from "./media-GyX8rJtJ.js";
import { t as probeFeishu } from "./probe-OmWm_fqX.js";
import path from "node:path";
//#region extensions/feishu/src/directory.ts
const MAX_FEISHU_DIRECTORY_PAGES = 100;
async function listFeishuDirectoryPeersLive(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) return listFeishuDirectoryPeers(params);
	try {
		const client = createFeishuClient(account);
		const peers = [];
		const limit = params.limit ?? 50;
		const response = await client.contact.user.list({ params: { page_size: Math.min(limit, 50) } });
		if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
		const q = normalizeLowercaseStringOrEmpty(params.query);
		for (const user of response.data?.items ?? []) {
			if (user.open_id) {
				const name = user.name || "";
				if (!q || normalizeLowercaseStringOrEmpty(user.open_id).includes(q) || normalizeLowercaseStringOrEmpty(name).includes(q)) peers.push({
					kind: "user",
					id: user.open_id,
					name: name || void 0
				});
			}
			if (peers.length >= limit) break;
		}
		return peers;
	} catch (err) {
		if (params.fallbackToStatic === false) throw err instanceof Error ? err : /* @__PURE__ */ new Error("Feishu live peer lookup failed");
		return listFeishuDirectoryPeers(params);
	}
}
async function listFeishuDirectoryGroupsLive(params) {
	const account = resolveFeishuAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) return listFeishuDirectoryGroups(params);
	try {
		const client = createFeishuClient(account);
		const groups = [];
		const limit = params.limit ?? 50;
		const q = normalizeLowercaseStringOrEmpty(params.query);
		let pageToken;
		let pages = 0;
		const seenPageTokens = /* @__PURE__ */ new Set();
		do {
			const response = await client.im.chat.list({ params: {
				page_size: Math.min(limit, 100),
				page_token: pageToken
			} });
			if (response.code !== 0) throw new Error(response.msg || `code ${response.code}`);
			for (const chat of response.data?.items ?? []) {
				if (chat.chat_id) {
					const name = chat.name || "";
					const group = {
						kind: "group",
						id: chat.chat_id,
						name: name || void 0
					};
					if ((!q || normalizeLowercaseStringOrEmpty(chat.chat_id).includes(q) || normalizeLowercaseStringOrEmpty(name).includes(q)) && (!params.filter || params.filter(group))) groups.push(group);
				}
				if (groups.length >= limit) break;
			}
			pages += 1;
			const nextPageToken = response.data?.has_more ? response.data.page_token : void 0;
			if (nextPageToken && seenPageTokens.has(nextPageToken)) throw new Error("Feishu live group directory returned a repeated page token");
			if (nextPageToken) seenPageTokens.add(nextPageToken);
			pageToken = nextPageToken;
		} while (pageToken && groups.length < limit && pages < MAX_FEISHU_DIRECTORY_PAGES);
		if (pageToken && pages >= MAX_FEISHU_DIRECTORY_PAGES) throw new Error("Feishu live group directory pagination limit exceeded");
		return groups;
	} catch (err) {
		if (params.fallbackToStatic === false) throw err instanceof Error ? err : /* @__PURE__ */ new Error("Feishu live group lookup failed");
		return listFeishuDirectoryGroups(params);
	}
}
//#endregion
//#region extensions/feishu/src/outbound.ts
const RENDERED_FEISHU_CARD = Symbol("openclaw.renderedFeishuCard");
const FEISHU_PRESENTATION_FALLBACK_MARKER = "__openclawPresentationFallback";
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
async function reportFeishuOutboundDelivery(result, onDeliveryResult) {
	await onDeliveryResult?.(attachChannelToResult("feishu", result));
	return result;
}
function consumeFeishuPresentationFallbackMarker(payload) {
	const feishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
	if (feishuData?.[FEISHU_PRESENTATION_FALLBACK_MARKER] !== true) return {
		payload,
		presentationFallback: false
	};
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
		presentationFallback: true
	};
}
function buildFeishuPayloadCard(params) {
	const nativeCard = readNativeFeishuCard(params.payload);
	if (nativeCard) {
		assertFeishuCardWithinEnvelope(nativeCard, "Feishu native card");
		return nativeCard;
	}
	const rawText = params.text ?? params.payload.text;
	const textCard = readNativeFeishuCardJson(rawText);
	const interactive = normalizeLegacyInteractiveReply(params.payload.interactive);
	const presentation = normalizeMessagePresentation(params.payload.presentation) ?? (interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0);
	if (!presentation && !interactive) {
		if (!textCard) return;
		assertFeishuCardWithinEnvelope(textCard, "Feishu native card");
		return markRenderedFeishuCard(textCard);
	}
	const text = textCard ? void 0 : resolveLegacyInteractiveTextFallback({
		text: rawText,
		interactive
	});
	const elements = presentation ? buildFeishuPresentationCardElements({
		presentation,
		fallbackText: text
	}) : [{
		tag: "markdown",
		content: renderMessagePresentationFallbackText({
			text,
			presentation
		})
	}];
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
function hasVisibleFallbackCommand(blocks) {
	return blocks?.some((block) => block.type === "buttons" && block.buttons.some((button) => !button.disabled && button.action?.type === "command" && !button.url && !button.webApp?.url && !button.web_app?.url)) ?? false;
}
function renderFeishuPresentationPayload({ payload, presentation, ctx }) {
	const fallbackText = renderMessagePresentationFallbackText({
		text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
		presentation
	});
	const card = buildFeishuPayloadCard({
		payload,
		text: payload.text,
		identity: ctx.identity
	});
	const existingFeishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
	const fallbackHasCommand = hasVisibleFallbackCommand(presentation?.blocks);
	if (!card) return {
		...payload,
		text: fallbackText,
		channelData: {
			...payload.channelData,
			feishu: {
				...existingFeishuData,
				[FEISHU_PRESENTATION_FALLBACK_MARKER]: true,
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
			messageId: typeof result.reply_id === "string" && result.reply_id || typeof result.comment_id === "string" && result.comment_id || "",
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
		accountId,
		replyToMessageId: preserveThread ? replyToMessageId : nextReplyToMessageId(),
		replyInThread: preserveThread ? true : i === 0 ? replyInThread : void 0
	}), onDeliveryResult);
	return lastResult;
}
async function sendFeishuFallbackPayload(params) {
	const ctx = {
		...params.ctx,
		payload: params.payload
	};
	const mediaUrls = normalizeStringEntries(resolvePayloadMediaUrls(params.payload));
	const text = params.payload.text ?? "";
	const textChunks = text ? chunkFeishuMarkdown(text, FEISHU_TEXT_CHUNK_LIMIT) : [];
	if (!(mediaUrls.length > 0 && (params.separateMediaAndText === true || textChunks.length > 1))) return await sendTextMediaPayload({
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
		audioAsVoice: params.payload.audioAsVoice ?? ctx.audioAsVoice
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
	} else if (params.supplement.visibleTextAlreadyDelivered !== true) {
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
			const interactive = normalizeLegacyInteractiveReply(payload.interactive);
			const normalizedPresentation = normalizeMessagePresentation(payload.presentation) ?? (interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0);
			const textCard = readNativeFeishuCardJson(payload.text);
			const presentationFallbackText = renderMessagePresentationFallbackText({
				text: textCard ? void 0 : payload.text,
				presentation: normalizedPresentation
			});
			const hasFallbackMedia = normalizeStringEntries(resolvePayloadMediaUrls(payload)).length > 0;
			if (!presentationFallbackText.trim() && !hasFallbackMedia && (textCard || readNativeFeishuCard(payload))) throw new Error("Feishu native cards cannot be sent to document comments without a text or media fallback.");
			const text = hasVisibleFallbackCommand(normalizedPresentation?.blocks) || isRecord(payload.channelData?.feishu) && payload.channelData.feishu.fallbackHasCommand === true ? `${presentationFallbackText}\n\n> Interactive buttons are unavailable in Feishu document comments. You can type the command shown above manually.` : presentationFallbackText;
			return await sendFeishuFallbackPayload({
				ctx,
				payload: {
					...payload,
					text,
					interactive: void 0,
					presentation: void 0,
					channelData: void 0
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
			if (ttsSupplement) return await sendFeishuTtsSupplementPayload({
				ctx,
				payload,
				supplement: ttsSupplement
			});
			const interactive = normalizeLegacyInteractiveReply(payload.interactive);
			const presentation = normalizeMessagePresentation(payload.presentation) ?? (interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0);
			return await sendFeishuFallbackPayload({
				ctx,
				payload: presentation ? {
					...payload,
					text: renderMessagePresentationFallbackText({
						text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
						presentation
					}),
					presentation: void 0,
					interactive: void 0
				} : payload,
				separateMediaAndText: presentationFallback || presentation !== void 0
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
				return attachChannelToResult("feishu", await sendCardFeishu({
					cfg: ctx.cfg,
					to: ctx.to,
					card,
					replyToMessageId,
					replyInThread,
					accountId: ctx.accountId ?? void 0
				}));
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
		return attachChannelToResult("feishu", await sendPayloadMediaSequenceAndFinalize({
			text: payload.text ?? "",
			mediaUrls,
			onResult: async (deliveryResult) => {
				await ctx.onDeliveryResult?.(attachChannelToResult("feishu", deliveryResult));
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
		}));
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
					return await sendOutboundText({
						cfg,
						to,
						text: await buildFeishuMediaFallbackText({}),
						accountId: accountId ?? void 0,
						replyToMessageId,
						replyInThread,
						...deliveryOptions
					});
				}
				return await reportFeishuOutboundDelivery(mediaResult, onDeliveryResult);
			}
			if (parseFeishuCommentTarget(to)) return await sendOutboundText({
				cfg,
				to,
				text,
				accountId: accountId ?? void 0,
				replyToMessageId,
				replyInThread,
				...deliveryOptions
			});
			const card = readNativeFeishuCardJson(text);
			if (card) {
				assertFeishuCardWithinEnvelope(card, "Feishu native card");
				return await reportFeishuOutboundDelivery(await sendCardFeishu({
					cfg,
					to,
					card: markRenderedFeishuCard(card),
					accountId: accountId ?? void 0,
					replyToMessageId,
					replyInThread
				}), onDeliveryResult);
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
				return await reportFeishuOutboundDelivery(await sendStructuredCardFeishu({
					cfg,
					to,
					text,
					replyToMessageId,
					replyInThread,
					accountId: accountId ?? void 0,
					header: header?.title ? header : void 0
				}), onDeliveryResult);
			}
			return await sendOutboundText({
				cfg,
				to,
				text,
				accountId: accountId ?? void 0,
				replyToMessageId,
				replyInThread,
				...deliveryOptions
			});
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, audioAsVoice, accountId, mediaAccess, mediaLocalRoots, mediaReadFile, replyToId, replyToIdSource, replyToMode, threadId, onDeliveryResult }) => {
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
			if (parseFeishuCommentTarget(to)) return await sendOutboundText({
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
			});
			if (!mediaUrl) return await sendOutboundText({
				cfg,
				to,
				text: text ?? "",
				accountId: accountId ?? void 0,
				...nextReplyMode(),
				...deliveryOptions
			});
			const suppressTextForVoiceMedia = shouldSuppressFeishuTextForVoiceMedia({
				mediaUrl,
				audioAsVoice
			});
			let textSent = false;
			if (text?.trim() && !suppressTextForVoiceMedia) {
				await sendOutboundText({
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
				console.error(`[feishu] sendMediaFeishu failed:`, err);
				return await sendOutboundText({
					cfg,
					to,
					text: await buildFeishuMediaFallbackText({
						text: textSent ? void 0 : text,
						mediaUrl
					}),
					accountId: accountId ?? void 0,
					...textSent ? nextReplyMode() : mediaReplyMode,
					...deliveryOptions
				});
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
			return mediaResult;
		}
	})
};
//#endregion
//#region extensions/feishu/src/pins.ts
function assertFeishuPinApiSuccess(response, action) {
	if (response.code !== 0) throw new Error(`Feishu ${action} failed: ${response.msg || `code ${response.code}`}`);
}
function normalizePin(pin) {
	return {
		messageId: pin.message_id,
		chatId: pin.chat_id,
		operatorId: pin.operator_id,
		operatorIdType: pin.operator_id_type,
		createTime: pin.create_time
	};
}
async function createPinFeishu(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const response = await createFeishuClient(account).im.pin.create({ data: { message_id: params.messageId } });
	assertFeishuPinApiSuccess(response, "pin create");
	return response.data?.pin ? normalizePin(response.data.pin) : null;
}
async function removePinFeishu(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	assertFeishuPinApiSuccess(await createFeishuClient(account).im.pin.delete({ path: { message_id: params.messageId } }), "pin delete");
}
async function listPinsFeishu(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const response = await createFeishuClient(account).im.pin.list({ params: {
		chat_id: params.chatId,
		...params.startTime ? { start_time: params.startTime } : {},
		...params.endTime ? { end_time: params.endTime } : {},
		...typeof params.pageSize === "number" ? { page_size: Math.max(1, Math.min(100, Math.floor(params.pageSize))) } : {},
		...params.pageToken ? { page_token: params.pageToken } : {}
	} });
	assertFeishuPinApiSuccess(response, "pin list");
	return {
		chatId: params.chatId,
		pins: (response.data?.items ?? []).map(normalizePin),
		hasMore: response.data?.has_more === true,
		pageToken: response.data?.page_token
	};
}
//#endregion
//#region extensions/feishu/src/reactions.ts
function resolveConfiguredFeishuClient(params) {
	const account = resolveFeishuRuntimeAccount(params);
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	return createFeishuClient(account);
}
function assertFeishuReactionApiSuccess(response, action) {
	if (response.code !== 0) throw new Error(`Feishu ${action} failed: ${response.msg || `code ${response.code}`}`);
}
/**
* Add a reaction (emoji) to a message.
* @param emojiType - Feishu emoji type, e.g., "SMILE", "THUMBSUP", "HEART"
* @see https://open.feishu.cn/document/server-docs/im-v1/message-reaction/emojis-introduce
*/
async function addReactionFeishu(params) {
	const { cfg, messageId, emojiType, accountId } = params;
	const response = await resolveConfiguredFeishuClient({
		cfg,
		accountId
	}).im.messageReaction.create({
		path: { message_id: messageId },
		data: { reaction_type: { emoji_type: emojiType } }
	});
	assertFeishuReactionApiSuccess(response, "add reaction");
	const reactionId = response.data?.reaction_id;
	if (!reactionId) throw new Error("Feishu add reaction failed: no reaction_id returned");
	return { reactionId };
}
/**
* Remove a reaction from a message.
*/
async function removeReactionFeishu(params) {
	const { cfg, messageId, reactionId, accountId } = params;
	assertFeishuReactionApiSuccess(await resolveConfiguredFeishuClient({
		cfg,
		accountId
	}).im.messageReaction.delete({ path: {
		message_id: messageId,
		reaction_id: reactionId
	} }), "remove reaction");
}
/**
* List all reactions for a message.
*/
async function listReactionsFeishu(params) {
	const { cfg, messageId, emojiType, accountId } = params;
	const client = resolveConfiguredFeishuClient({
		cfg,
		accountId
	});
	const reactions = [];
	const seenPageTokens = /* @__PURE__ */ new Set();
	let pageToken;
	while (true) {
		const response = await client.im.messageReaction.list({
			path: { message_id: messageId },
			params: emojiType || pageToken ? {
				...emojiType ? { reaction_type: emojiType } : {},
				...pageToken ? { page_token: pageToken } : {}
			} : void 0
		});
		assertFeishuReactionApiSuccess(response, "list reactions");
		for (const item of response.data?.items ?? []) reactions.push({
			reactionId: item.reaction_id ?? "",
			emojiType: item.reaction_type?.emoji_type ?? "",
			operatorType: item.operator?.operator_type === "app" ? "app" : item.operator?.operator_type === "user" ? "user" : "unknown",
			operatorId: item.operator?.operator_id ?? ""
		});
		if (response.data?.has_more !== true) return reactions;
		const nextPageToken = response.data.page_token?.trim();
		if (!nextPageToken) throw new Error("Feishu reaction pagination is missing its next page token");
		if (seenPageTokens.has(nextPageToken)) throw new Error("Feishu reaction pagination returned a repeated page token");
		seenPageTokens.add(nextPageToken);
		pageToken = nextPageToken;
	}
}
//#endregion
//#region extensions/feishu/src/channel.runtime.ts
const feishuChannelRuntime = {
	assertFeishuChatMember,
	buildFeishuDirectChatMembers,
	listFeishuDirectoryGroupsLive,
	listFeishuDirectoryPeersLive,
	feishuOutbound: { ...feishuOutbound },
	createPinFeishu,
	listPinsFeishu,
	removePinFeishu,
	probeFeishu,
	addReactionFeishu,
	listReactionsFeishu,
	removeReactionFeishu,
	getChatInfo,
	getChatMembers,
	getFeishuMemberInfo,
	editMessageFeishu,
	getMessageFeishu,
	sendCardFeishu,
	sendMessageFeishu
};
//#endregion
export { feishuChannelRuntime };
