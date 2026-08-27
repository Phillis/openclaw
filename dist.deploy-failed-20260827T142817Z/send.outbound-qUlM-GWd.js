import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as fromMarkdown } from "./lib-vv6_0VBO.js";
import { s as resolveChunkMode } from "./chunk-DbIKi2Y2.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-LRU688AB.js";
import { i as FormatCapabilityProfile } from "./text-chunking-DrVvfnLf.js";
import { n as renderMarkdownWithMarkers, t as convertMarkdownTables } from "./tables-Bu53rjrA.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-DdYb6NIl.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-D7ikroCS.js";
import "./reply-chunking-Bm5QeUSE.js";
import "./markdown-table-runtime-8RTWYLZO.js";
import { s as resolveDiscordAccount } from "./accounts-CafjbqFC.js";
import { Vt as ChannelType, it as createThread, rt as createChannelMessage } from "./discord-CY8XHqbK.js";
import { T as parseAndResolveChannelRecipient, _ as resolveDiscordMessageFlags, a as normalizeDiscordPollInput, b as resolveDiscordSuppressEmbeds, c as normalizeStickerIds, f as sendDiscordMedia, g as createDiscordMessageNonce, h as buildDiscordMessageRequest, l as resolveChannelId, n as buildDiscordTextChunks, p as sendDiscordText, t as buildDiscordSendError, u as resolveDiscordChannel, v as resolveDiscordSendComponents, y as resolveDiscordSendEmbeds } from "./send.shared-Cu7VsiZQ.js";
import { u as createDiscordClient } from "./send.permissions-CFxZUgER.js";
import { r as rewriteDiscordKnownMentions } from "./mentions-ClF_uUn_.js";
import { n as createReusableDiscordReplyReference } from "./chunk-CtE7OiH8.js";
import { n as createDiscordSendReceiptFromResults, r as createDiscordSendResult } from "./send.receipt-C48Rc9pj.js";
//#region extensions/discord/src/markdown.ts
const DISCORD_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: { table: "fallback" },
	chunk: {
		limit: 2e3,
		unit: "utf16"
	}
});
const DISCORD_BOLD_PROBE_TEXT = "openclaw-discord-bold";
const DISCORD_BOLD_PROBE = renderMarkdownWithMarkers({
	text: DISCORD_BOLD_PROBE_TEXT,
	styles: [{
		start: 0,
		end: 21,
		style: "bold"
	}],
	links: []
}, {
	styleMarkers: { bold: {
		open: "**",
		close: "**"
	} },
	escapeText: (value) => value
}, DISCORD_FORMAT_PROFILE);
const DISCORD_BOLD_MARKERS = {
	open: DISCORD_BOLD_PROBE.slice(0, DISCORD_BOLD_PROBE.indexOf(DISCORD_BOLD_PROBE_TEXT)),
	close: DISCORD_BOLD_PROBE.slice(DISCORD_BOLD_PROBE.indexOf(DISCORD_BOLD_PROBE_TEXT) + 21)
};
const DISCORD_NATIVE_TOKEN_RE = /<a?:[A-Za-z0-9_]+:\d+>|<\/[^>]+:\d+>/giu;
const DISCORD_URL_START_RE = /(?:[A-Za-z][A-Za-z0-9+.-]*:\/\/|www\.)/giu;
function findDiscordUrlRanges(markdown) {
	const ranges = [];
	for (const match of markdown.matchAll(DISCORD_URL_START_RE)) {
		const start = match.index;
		if (start === void 0) continue;
		const preceding = markdown[start - 1] ?? "";
		if (/[\p{L}\p{N}]/u.test(preceding) || preceding === "_" && markdown[start - 2] !== "_") continue;
		let end = start + match[0].length;
		let parenthesisDepth = 0;
		while (end < markdown.length) {
			const char = markdown[end];
			if (!char || /[\s<>]/u.test(char)) break;
			if (char === "(") parenthesisDepth += 1;
			else if (char === ")") {
				if (parenthesisDepth === 0) break;
				parenthesisDepth -= 1;
			}
			end += 1;
		}
		ranges.push({
			start,
			end
		});
	}
	return ranges;
}
function markdownSemanticSignature(root) {
	const parts = [];
	const pending = [{
		node: root,
		parentStrong: false
	}];
	while (pending.length > 0) {
		const event = pending.pop();
		if (!event) continue;
		if (event.exiting) {
			parts.push(")");
			continue;
		}
		const { node } = event;
		const redundantStrong = event.parentStrong && node.type === "strong";
		const fields = Object.fromEntries(Object.entries(node).filter(([key]) => key !== "children" && key !== "position"));
		const children = node.children ?? [];
		if (!redundantStrong) {
			parts.push(`(${JSON.stringify(fields)}`);
			pending.push({
				node,
				parentStrong: event.parentStrong,
				exiting: true
			});
		}
		const parentStrong = event.parentStrong || node.type === "strong";
		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (child) pending.push({
				node: child,
				parentStrong
			});
		}
	}
	return parts.join("\n");
}
function normalizeDiscordBold(markdown) {
	const spans = [];
	const contentEdits = [];
	const starEmphasisDelimiters = /* @__PURE__ */ new Set();
	const astLinkRanges = [];
	const sourceTree = fromMarkdown(markdown);
	const activeSpanIds = [];
	const pending = [{ node: sourceTree }];
	while (pending.length > 0) {
		const event = pending.pop();
		if (!event) continue;
		if (event.exiting !== void 0) {
			activeSpanIds.pop();
			continue;
		}
		const { node } = event;
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		if (node.type === "link" && start !== void 0 && end !== void 0 && markdown[start] === "<" && markdown[end - 1] === ">") astLinkRanges.push({
			start,
			end
		});
		let enteredSpanId;
		if (node.type === "strong" && start !== void 0 && end !== void 0 && markdown.startsWith("__", start) && markdown.slice(end - 2, end) === "__") {
			enteredSpanId = spans.length;
			spans.push({
				start,
				end
			});
			activeSpanIds.push(enteredSpanId);
		}
		const spanId = activeSpanIds.at(-1);
		if (spanId !== void 0 && start !== void 0 && end !== void 0) {
			if (node.type === "strong" && enteredSpanId === void 0 && markdown.startsWith("**", start) && markdown.slice(end - 2, end) === "**") contentEdits.push({
				spanId,
				start,
				marker: "****",
				consume: 2,
				delimiter: false
			}, {
				spanId,
				start: end - 2,
				marker: "****",
				consume: 2,
				delimiter: false
			});
			else if (node.type === "emphasis" && markdown[start] === "*" && markdown[end - 1] === "*") {
				starEmphasisDelimiters.add(start);
				starEmphasisDelimiters.add(end - 1);
				if (!(/[\p{L}\p{N}]/u.test(markdown[start - 1] ?? "") || /[\p{L}\p{N}]/u.test(markdown[end] ?? ""))) contentEdits.push({
					spanId,
					start,
					marker: "_",
					consume: 1,
					delimiter: false
				}, {
					spanId,
					start: end - 1,
					marker: "_",
					consume: 1,
					delimiter: false
				});
			} else if (node.type === "text") for (let offset = start; offset < end; offset += 1) {
				if (markdown[offset] !== "*") continue;
				let precedingSlashes = 0;
				for (let index = offset - 1; index >= start && markdown[index] === "\\"; index -= 1) precedingSlashes += 1;
				if (precedingSlashes % 2 === 0) contentEdits.push({
					spanId,
					start: offset,
					marker: "\\",
					consume: 0,
					delimiter: false
				});
			}
		}
		if (enteredSpanId !== void 0) pending.push({
			node,
			exiting: enteredSpanId
		});
		const children = node.children ?? [];
		for (let index = children.length - 1; index >= 0; index -= 1) {
			const child = children[index];
			if (child) pending.push({ node: child });
		}
	}
	if (spans.length === 0) return markdown;
	const strongInteriorStartByEnd = /* @__PURE__ */ new Map();
	for (const span of spans) {
		const interiorStart = span.start + 2;
		strongInteriorStartByEnd.set(span.end, Math.min(strongInteriorStartByEnd.get(span.end) ?? interiorStart, interiorStart));
	}
	const nativeTokenRanges = [...markdown.matchAll(DISCORD_NATIVE_TOKEN_RE)].flatMap((match) => match.index === void 0 ? [] : [{
		start: match.index,
		end: match.index + match[0].length
	}]);
	const protectedRanges = [
		...findDiscordUrlRanges(markdown),
		...astLinkRanges,
		...nativeTokenRanges
	].toSorted((left, right) => left.start - right.start).map(({ start, end: rawEnd }) => {
		let end = rawEnd;
		while (/[.,!?;:'"]/u.test(markdown[end - 1] ?? "")) end -= 1;
		let previousEnd = -1;
		while (end !== previousEnd) {
			previousEnd = end;
			while (starEmphasisDelimiters.has(end - 1)) end -= 1;
			let strongInteriorStart = strongInteriorStartByEnd.get(end);
			while (strongInteriorStart !== void 0 && start >= strongInteriorStart) {
				end -= 2;
				strongInteriorStart = strongInteriorStartByEnd.get(end);
			}
		}
		return {
			start,
			end
		};
	});
	const edits = [...spans.flatMap((span, spanId) => [{
		spanId,
		start: span.start,
		marker: DISCORD_BOLD_MARKERS.open,
		consume: 2,
		delimiter: true
	}, {
		spanId,
		start: span.end - 2,
		marker: DISCORD_BOLD_MARKERS.close,
		consume: 2,
		delimiter: true
	}]), ...contentEdits].toSorted((left, right) => left.start - right.start);
	const editsBySpan = /* @__PURE__ */ new Map();
	for (const edit of edits) {
		const spanEdits = editsBySpan.get(edit.spanId);
		if (spanEdits) spanEdits.push(edit);
		else editsBySpan.set(edit.spanId, [edit]);
	}
	const protectedSpanIds = /* @__PURE__ */ new Set();
	const protectedEditKeys = /* @__PURE__ */ new Set();
	const spansWithProtectedContent = /* @__PURE__ */ new Set();
	let rangeIndex = 0;
	for (const edit of edits) {
		while ((protectedRanges[rangeIndex]?.end ?? Number.POSITIVE_INFINITY) <= edit.start) rangeIndex += 1;
		const range = protectedRanges[rangeIndex];
		if (range && (edit.consume === 0 ? edit.start >= range.start && edit.start < range.end : edit.start < range.end && edit.start + edit.consume > range.start)) if (edit.delimiter) protectedSpanIds.add(edit.spanId);
		else {
			protectedEditKeys.add(`${edit.start}:${edit.consume}:${edit.marker}`);
			spansWithProtectedContent.add(edit.spanId);
		}
	}
	for (const spanId of spansWithProtectedContent) {
		const span = spans[spanId];
		if (!span) continue;
		let localCursor = span.start;
		const localRendered = (editsBySpan.get(spanId) ?? []).filter((edit) => {
			const key = `${edit.start}:${edit.consume}:${edit.marker}`;
			return !protectedEditKeys.has(key);
		}).map((edit) => {
			const chunk = `${markdown.slice(localCursor, edit.start)}${edit.marker}`;
			localCursor = edit.start + edit.consume;
			return chunk;
		}).join("") + markdown.slice(localCursor, span.end);
		const localSource = markdown.slice(span.start, span.end);
		if (markdownSemanticSignature(fromMarkdown(localRendered)) !== markdownSemanticSignature(fromMarkdown(localSource))) protectedSpanIds.add(spanId);
	}
	let cursor = 0;
	const seenEdits = /* @__PURE__ */ new Set();
	const rendered = edits.filter((edit) => {
		const key = `${edit.start}:${edit.consume}:${edit.marker}`;
		if (protectedSpanIds.has(edit.spanId) || protectedEditKeys.has(key) || seenEdits.has(key)) return false;
		seenEdits.add(key);
		return true;
	}).map((edit) => {
		const chunk = `${markdown.slice(cursor, edit.start)}${edit.marker}`;
		cursor = edit.start + edit.consume;
		return chunk;
	}).join("") + markdown.slice(cursor);
	return markdownSemanticSignature(fromMarkdown(rendered)) === markdownSemanticSignature(sourceTree) ? rendered : markdown;
}
function renderDiscordMarkdown(markdown, tableMode) {
	return normalizeDiscordBold(convertMarkdownTables(markdown, tableMode));
}
//#endregion
//#region extensions/discord/src/send.outbound.ts
const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;
/** Discord's ChannelFlags.RequireTag is bit 4 on forum/media parent channels. */
const DISCORD_FORUM_REQUIRE_TAG_FLAG = 16;
async function sendDiscordThreadTextChunks(params) {
	for (const chunk of params.chunks) await sendDiscordText({
		rest: params.rest,
		channelId: params.threadId,
		text: chunk,
		request: params.request,
		maxLinesPerMessage: params.maxLinesPerMessage,
		chunkMode: params.chunkMode,
		silent: params.silent,
		suppressEmbeds: params.suppressEmbeds,
		allowedMentions: params.allowedMentions,
		maxChars: params.maxChars,
		onResult: params.onResult,
		onPlatformSendDispatch: params.onPlatformSendDispatch
	});
}
/** Discord thread names are capped at 100 characters. */
const DISCORD_THREAD_NAME_LIMIT = 100;
/** Derive a thread title from the first non-empty line of the message text. */
function deriveForumThreadName(text) {
	return truncateUtf16Safe(normalizeOptionalString(text.split("\n").find((line) => normalizeOptionalString(line))) ?? "", DISCORD_THREAD_NAME_LIMIT) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
}
/** Forum/Media channels cannot receive regular messages; detect them here. */
function isForumLikeChannel(channel) {
	return channel?.type === ChannelType.GuildForum || channel?.type === ChannelType.GuildMedia;
}
function toDiscordSendResult(result, fallbackChannelId, params = {}) {
	const resultParams = {
		result,
		fallbackChannelId,
		kind: params.kind ?? "text"
	};
	if (params.threadId != null) resultParams.threadId = params.threadId;
	if (params.reply) resultParams.reply = params.reply;
	return createDiscordSendResult(resultParams);
}
async function resolveDiscordSendTarget(to, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord send target resolution");
	const { rest, request } = createDiscordClient({
		...opts,
		cfg
	});
	const { channelId } = await resolveChannelId(rest, await parseAndResolveChannelRecipient(to, cfg, opts.accountId), request);
	return {
		rest,
		request,
		channelId
	};
}
async function sendMessageDiscord(to, text, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord send");
	const accountInfo = resolveDiscordAccount({
		cfg,
		accountId: opts.accountId
	});
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "discord",
		accountId: accountInfo.accountId
	});
	const effectiveTableMode = opts.tableMode ?? tableMode;
	const chunkMode = opts.chunkMode ?? resolveChunkMode(cfg, "discord", accountInfo.accountId);
	const maxLinesPerMessage = opts.maxLinesPerMessage ?? accountInfo.config.maxLinesPerMessage;
	const suppressEmbeds = resolveDiscordSuppressEmbeds({
		configured: accountInfo.config.suppressEmbeds,
		override: opts.suppressEmbeds
	});
	const textLimit = typeof opts.textLimit === "number" && Number.isFinite(opts.textLimit) ? Math.max(1, Math.min(Math.floor(opts.textLimit), 2e3)) : void 0;
	const mediaMaxBytes = typeof accountInfo.config.mediaMaxMb === "number" ? accountInfo.config.mediaMaxMb * 1024 * 1024 : DEFAULT_DISCORD_MEDIA_MAX_MB * 1024 * 1024;
	const renderedText = renderDiscordMarkdown(text ?? "", effectiveTableMode);
	const textWithMentions = rewriteDiscordKnownMentions(renderedText, {
		accountId: accountInfo.accountId,
		mentionAliases: accountInfo.config.mentionAliases
	});
	const { token, rest, request } = createDiscordClient({
		...opts,
		cfg
	});
	const { channelId } = await resolveChannelId(rest, await parseAndResolveChannelRecipient(to, cfg, opts.accountId), request);
	const channel = await resolveDiscordChannel(rest, channelId);
	if (isForumLikeChannel(channel)) {
		if (((channel.flags ?? 0) & DISCORD_FORUM_REQUIRE_TAG_FLAG) !== 0) throw new Error(`Discord forum channel ${channelId} requires an applied tag; use thread-create with appliedTags, then send to the created thread.`);
		const threadName = deriveForumThreadName(renderedText);
		const chunks = buildDiscordTextChunks(textWithMentions, {
			maxLinesPerMessage,
			chunkMode,
			maxChars: textLimit
		});
		const starterContent = chunks[0]?.trim() ? chunks[0] : threadName;
		const starterComponents = resolveDiscordSendComponents({
			components: opts.components,
			text: starterContent,
			isFirst: true
		});
		const starterEmbeds = resolveDiscordSendEmbeds({
			embeds: opts.embeds,
			isFirst: true
		});
		const starterBody = buildDiscordMessageRequest({
			endpoint: "forum-thread",
			text: starterContent,
			components: starterComponents,
			embeds: starterEmbeds,
			flags: resolveDiscordMessageFlags({
				silent: opts.silent,
				suppressEmbeds: suppressEmbeds && !starterEmbeds?.length
			}),
			allowedMentions: opts.allowedMentions
		});
		let threadRes;
		try {
			await opts.onPlatformSendDispatch?.();
			threadRes = await request(() => createThread(rest, channelId, { body: {
				name: threadName,
				...channel.default_auto_archive_duration === void 0 ? {} : { auto_archive_duration: channel.default_auto_archive_duration },
				message: starterBody
			} }), "forum-thread", { safety: "non-idempotent-create" });
		} catch (err) {
			throw await buildDiscordSendError(err, {
				channelId,
				cfg,
				rest,
				token,
				hasMedia: Boolean(opts.mediaUrl)
			});
		}
		const threadId = threadRes.id;
		const messageId = threadRes.message?.id ?? threadId;
		const resultChannelId = threadRes.message?.channel_id ?? threadId;
		const remainingChunks = chunks.slice(1);
		const starterResult = toDiscordSendResult({
			id: messageId,
			channel_id: resultChannelId
		}, channelId, {
			kind: "text",
			threadId
		});
		const deliveredResults = [starterResult];
		await opts.onDeliveryResult?.(starterResult);
		const reportThreadResult = async (result, kind) => {
			const deliveredResult = toDiscordSendResult(result, threadId, {
				kind,
				threadId
			});
			deliveredResults.push(deliveredResult);
			await opts.onDeliveryResult?.(deliveredResult);
		};
		try {
			if (opts.mediaUrl) {
				const [mediaCaption, ...afterMediaChunks] = remainingChunks;
				await sendDiscordMedia({
					rest,
					channelId: threadId,
					text: mediaCaption ?? "",
					mediaUrl: opts.mediaUrl,
					filename: opts.filename,
					mediaAccess: opts.mediaAccess,
					mediaLocalRoots: opts.mediaLocalRoots,
					mediaReadFile: opts.mediaReadFile,
					maxBytes: mediaMaxBytes,
					request,
					maxLinesPerMessage,
					chunkMode,
					silent: opts.silent,
					suppressEmbeds,
					allowedMentions: opts.allowedMentions,
					maxChars: textLimit,
					onResult: reportThreadResult,
					onPlatformSendDispatch: opts.onPlatformSendDispatch
				});
				await sendDiscordThreadTextChunks({
					rest,
					threadId,
					chunks: afterMediaChunks,
					request,
					maxLinesPerMessage,
					chunkMode,
					maxChars: textLimit,
					silent: opts.silent,
					suppressEmbeds,
					allowedMentions: opts.allowedMentions,
					onResult: reportThreadResult,
					onPlatformSendDispatch: opts.onPlatformSendDispatch
				});
			} else await sendDiscordThreadTextChunks({
				rest,
				threadId,
				chunks: remainingChunks,
				request,
				maxLinesPerMessage,
				chunkMode,
				maxChars: textLimit,
				silent: opts.silent,
				suppressEmbeds,
				allowedMentions: opts.allowedMentions,
				onResult: reportThreadResult,
				onPlatformSendDispatch: opts.onPlatformSendDispatch
			});
		} catch (err) {
			throw await buildDiscordSendError(err, {
				channelId: threadId,
				cfg,
				rest,
				token,
				hasMedia: Boolean(opts.mediaUrl)
			});
		}
		recordChannelActivity({
			channel: "discord",
			accountId: accountInfo.accountId,
			direction: "outbound"
		});
		return {
			...starterResult,
			receipt: createDiscordSendReceiptFromResults({
				results: deliveredResults,
				threadId
			})
		};
	}
	let result;
	const reportResult = async (progressResult, kind, replyToId) => {
		await opts.onDeliveryResult?.(toDiscordSendResult(progressResult, channelId, {
			kind,
			reply: createReusableDiscordReplyReference(replyToId)
		}));
	};
	try {
		if (opts.mediaUrl) result = await sendDiscordMedia({
			rest,
			channelId,
			text: textWithMentions,
			mediaUrl: opts.mediaUrl,
			filename: opts.filename,
			mediaAccess: opts.mediaAccess,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			maxBytes: mediaMaxBytes,
			reply: opts.reply,
			request,
			maxLinesPerMessage,
			components: opts.components,
			embeds: opts.embeds,
			chunkMode,
			silent: opts.silent,
			suppressEmbeds,
			allowedMentions: opts.allowedMentions,
			maxChars: textLimit,
			onResult: reportResult,
			onPlatformSendDispatch: opts.onPlatformSendDispatch
		});
		else result = await sendDiscordText({
			rest,
			channelId,
			text: textWithMentions,
			reply: opts.reply,
			request,
			maxLinesPerMessage,
			components: opts.components,
			embeds: opts.embeds,
			chunkMode,
			silent: opts.silent,
			suppressEmbeds,
			allowedMentions: opts.allowedMentions,
			maxChars: textLimit,
			onResult: reportResult,
			onPlatformSendDispatch: opts.onPlatformSendDispatch
		});
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return toDiscordSendResult(result, channelId, {
		kind: opts.mediaUrl ? "media" : opts.components || opts.embeds ? "card" : "text",
		reply: opts.reply
	});
}
async function sendStickerDiscord(to, stickerIds, opts) {
	const { rest, request, channelId, rewrittenContent, suppressEmbeds } = await resolveDiscordStructuredSendContext(to, opts);
	const stickers = normalizeStickerIds(stickerIds);
	const flags = resolveDiscordMessageFlags({ suppressEmbeds });
	const body = {
		content: rewrittenContent || void 0,
		sticker_ids: stickers,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		...flags ? { flags } : {}
	};
	await opts.onPlatformSendDispatch?.();
	return toDiscordSendResult(await request(() => createChannelMessage(rest, channelId, { body }), "sticker", { safety: "nonce-protected-create" }), channelId, { kind: "card" });
}
async function sendPollDiscord(to, poll, opts) {
	const { rest, request, channelId, rewrittenContent, suppressEmbeds } = await resolveDiscordStructuredSendContext(to, opts);
	if (poll.durationSeconds !== void 0) throw new Error("Discord polls do not support durationSeconds; use durationHours");
	const payload = normalizeDiscordPollInput(poll);
	const flags = resolveDiscordMessageFlags({
		silent: opts.silent,
		suppressEmbeds
	});
	const body = {
		content: rewrittenContent || void 0,
		poll: payload,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true,
		...flags ? { flags } : {}
	};
	await opts.onPlatformSendDispatch?.();
	return toDiscordSendResult(await request(() => createChannelMessage(rest, channelId, { body }), "poll", { safety: "nonce-protected-create" }), channelId, { kind: "card" });
}
async function resolveDiscordStructuredSendContext(to, opts) {
	const accountInfo = resolveDiscordAccount({
		cfg: requireRuntimeConfig(opts.cfg, "Discord structured send"),
		accountId: opts.accountId
	});
	const { rest, request, channelId } = await resolveDiscordSendTarget(to, opts);
	const content = opts.content?.trim();
	return {
		rest,
		request,
		channelId,
		rewrittenContent: content ? rewriteDiscordKnownMentions(content, {
			accountId: accountInfo.accountId,
			mentionAliases: accountInfo.config.mentionAliases
		}) : void 0,
		suppressEmbeds: resolveDiscordSuppressEmbeds({
			configured: accountInfo.config.suppressEmbeds,
			override: opts.suppressEmbeds
		})
	};
}
//#endregion
export { sendPollDiscord as n, sendStickerDiscord as r, sendMessageDiscord as t };
