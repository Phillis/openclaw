import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { p as defineChannelMessageAdapter } from "./channel-outbound-CEvoxZOx.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-CdBeRVUX.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import { r as missingTargetError } from "./target-errors-CZ0A80hz.js";
import { r as markdownToIR } from "./construct-fallbacks-CCQa__o1.js";
import { t as adaptScopedAccountAccessor } from "./channel-config-helpers-C6dKYMZI.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { i as FormatCapabilityProfile, r as renderMarkdownIRChunksWithinLimit } from "./text-chunking-DrVvfnLf.js";
import { n as renderMarkdownWithMarkers } from "./tables-Bu53rjrA.js";
import { t as sanitizeForPlainText } from "./sanitize-text-DMcfOVvX.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { E as composeAccountWarningCollectors, k as createAllowlistProviderOpenWarningCollector } from "./channel-policy-DlGVx39H.js";
import { f as listResolvedDirectoryGroupEntriesFromMapKeys, p as listResolvedDirectoryUserEntriesFromAllowFrom } from "./directory-config-helpers-CWfb67CM.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-DTJ8UiOr.js";
import { i as resolveGoogleChatAccount } from "./accounts-DOsM6Oru.js";
import { i as normalizeGoogleChatTarget, o as resolveGoogleChatOutboundSpace, r as isGoogleChatUserTarget, w as shouldSuppressGoogleChatManualExecApprovalFollowupPayload } from "./targets-8pMTYV5s.js";
import "./runtime-api-CSRGckER.js";
import { r as formatGoogleChatAllowFromEntry } from "./channel-base-BZ9jgxAh.js";
import { n as resolveGoogleChatGroupRequireMention } from "./group-policy-CJDleQKS.js";
//#region extensions/googlechat/src/format.ts
const GOOGLE_CHAT_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: {
		underline: "fallback",
		spoiler: "fallback",
		codeLanguage: "fallback",
		heading: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback",
		image: "fallback",
		mention: "strip"
	},
	chunk: {
		limit: 32e3,
		unit: "bytes"
	}
});
const GOOGLE_CHAT_LITERAL_FALLBACKS = /* @__PURE__ */ new Map([
	["*", "＊"],
	["_", "＿"],
	["~", "～"],
	["`", "｀"],
	["<", "＜"],
	[">", "＞"],
	["\\", "＼"],
	["-", "－"],
	["|", "｜"]
]);
function createPrivateMarkerGenerator(text) {
	const used = /* @__PURE__ */ new Set();
	let candidate = 0;
	const rangeSize = 6400;
	return () => {
		while (true) {
			const marker = String.fromCharCode(57344 + Math.floor(candidate / rangeSize), 57344 + candidate % rangeSize);
			candidate += 1;
			if (!used.has(marker) && !text.includes(marker)) {
				used.add(marker);
				return marker;
			}
		}
	};
}
function createGoogleChatMarkers(text) {
	const nextMarker = createPrivateMarkerGenerator(text);
	return {
		list: nextMarker(),
		blockquoteOpen: nextMarker(),
		blockquoteClose: nextMarker()
	};
}
/** Removes unsafe HTML and internal scaffolding while retaining source Markdown for chunking. */
function sanitizeGoogleChatText(text) {
	return sanitizeForPlainText(sanitizeAssistantVisibleText(text), { style: "markdown" });
}
function projectDecodedGoogleChatResources(ir) {
	const characters = ir.text.split("");
	let changed = false;
	for (const match of ir.text.matchAll(/<(?:users|customEmojis)\/[^<>\s]+>/giu)) {
		const start = match.index ?? 0;
		characters[start] = "＜";
		characters[start + match[0].length - 1] = "＞";
		changed = true;
	}
	return changed ? {
		...ir,
		text: characters.join("")
	} : ir;
}
function projectGoogleChatLinkLabels(ir) {
	const characters = ir.text.split("");
	let changed = false;
	for (const link of ir.links) {
		const label = ir.text.slice(link.start, link.end);
		const comparableHref = link.href.startsWith("mailto:") ? link.href.slice(7) : link.href;
		if (label === link.href || label === comparableHref) continue;
		for (let index = link.start; index < link.end; index += 1) {
			const character = characters[index] ?? "";
			const fallback = GOOGLE_CHAT_LITERAL_FALLBACKS.get(character);
			if (fallback && /[<>|*_~`]/u.test(character)) {
				characters[index] = fallback;
				changed = true;
			}
		}
	}
	return changed ? {
		...ir,
		text: characters.join("")
	} : ir;
}
function markGoogleChatBulletLists(ir, markerToken) {
	let text = ir.text;
	for (const item of ir.listItems ?? []) {
		const marker = item.listMarker;
		if (item.kind !== "bullet" || !marker || text.slice(marker.start, marker.end) !== "• ") continue;
		text = `${text.slice(0, marker.start)}${markerToken}${text.slice(marker.end)}`;
	}
	return text === ir.text ? ir : {
		...ir,
		text
	};
}
function projectUnsafeCodeFallbacks(ir) {
	let text = ir.text;
	const styles = ir.styles.filter((span) => {
		const content = ir.text.slice(span.start, span.end);
		const unsafe = span.style === "code" && content.includes("`") || span.style === "code_block" && content.includes("```");
		if (unsafe) {
			const replacement = content.split("").map((character) => GOOGLE_CHAT_LITERAL_FALLBACKS.get(character) ?? character).join("");
			text = `${text.slice(0, span.start)}${replacement}${text.slice(span.end)}`;
		}
		return !unsafe;
	});
	return styles.length === ir.styles.length ? ir : {
		...ir,
		styles,
		text
	};
}
function projectGoogleChatPlainLiterals(ir) {
	const codeRanges = ir.styles.filter((span) => span.style === "code" || span.style === "code_block");
	const inCode = (index) => codeRanges.some((span) => index >= span.start && index < span.end);
	const inLink = (index) => ir.links.some((span) => index >= span.start && index < span.end);
	const styleDelimiter = /* @__PURE__ */ new Map([
		["~", "strikethrough"],
		["_", "italic"],
		["*", "bold"],
		["`", "code"]
	]);
	const characters = ir.text.split("");
	let lineStart = 0;
	while (lineStart < characters.length) {
		const nextNewline = characters.indexOf("\n", lineStart);
		const lineEnd = nextNewline < 0 ? characters.length : nextNewline;
		for (const delimiter of [
			"~",
			"_",
			"*",
			"`"
		]) {
			const indexes = [];
			for (let index = lineStart; index < lineEnd; index += 1) if (characters[index] === delimiter && !inCode(index) && !inLink(index)) indexes.push(index);
			if (indexes.length === 0) continue;
			const renderedStyle = styleDelimiter.get(delimiter);
			const lineAddsDelimiter = ir.styles.some((span) => span.style === renderedStyle && span.start < lineEnd && span.end > lineStart);
			if (indexes.length >= 2 || lineAddsDelimiter) for (const index of indexes) characters[index] = GOOGLE_CHAT_LITERAL_FALLBACKS.get(delimiter) ?? delimiter;
		}
		let firstTextIndex = lineStart;
		while (firstTextIndex < lineEnd && characters[firstTextIndex] === " ") firstTextIndex += 1;
		if (firstTextIndex >= lineStart && !inCode(firstTextIndex)) {
			const character = characters[firstTextIndex];
			if ((character === "*" || character === "-") && characters[firstTextIndex + 1] === " " || character === ">") characters[firstTextIndex] = GOOGLE_CHAT_LITERAL_FALLBACKS.get(character) ?? character;
		}
		const line = characters.slice(lineStart, lineEnd).join("");
		for (const match of line.matchAll(/<[^<>\n]*\|[^<>\n]*>/gu)) {
			const open = lineStart + (match.index ?? 0);
			const close = open + match[0].length - 1;
			if (!inCode(open) && !inCode(close) && !inLink(open) && !inLink(close)) {
				characters[open] = "＜";
				characters[close] = "＞";
			}
		}
		lineStart = lineEnd + 1;
	}
	const text = characters.join("");
	return text === ir.text ? ir : {
		...ir,
		text
	};
}
function emitGoogleChatLists(text, markerToken) {
	return text.split("\n").map((line) => {
		const markerIndex = line.indexOf(markerToken);
		if (markerIndex < 0) return line;
		const prefix = line.slice(0, markerIndex);
		const quote = /^(?:> )*/u.exec(prefix)?.[0] ?? "";
		const indent = prefix.slice(quote.length);
		return `${quote}${" ".repeat(indent.length * 2)}* ${line.slice(markerIndex + markerToken.length)}`;
	}).join("\n");
}
function emitGoogleChatBlockquotes(text, markers) {
	let depth = 0;
	let lineStart = true;
	let rendered = "";
	for (let index = 0; index < text.length; index += 1) {
		if (text.startsWith(markers.blockquoteOpen, index)) {
			depth += 1;
			index += markers.blockquoteOpen.length - 1;
			continue;
		}
		if (text.startsWith(markers.blockquoteClose, index)) {
			depth = Math.max(0, depth - 1);
			index += markers.blockquoteClose.length - 1;
			continue;
		}
		const character = text[index] ?? "";
		if (lineStart && depth > 0) rendered += "> ".repeat(depth);
		rendered += character;
		lineStart = character === "\n";
	}
	return rendered;
}
function prepareGoogleChatIR(text) {
	const ir = projectGoogleChatPlainLiterals(projectGoogleChatLinkLabels(projectDecodedGoogleChatResources(projectUnsafeCodeFallbacks(markdownToIR(sanitizeGoogleChatText(text), {
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		tableMode: "bullets"
	})))));
	const markers = createGoogleChatMarkers(ir.text);
	return {
		ir: markGoogleChatBulletLists(ir, markers.list),
		markers
	};
}
function renderGoogleChatIR(ir, markers) {
	return emitGoogleChatLists(emitGoogleChatBlockquotes(renderMarkdownWithMarkers(ir, {
		styleMarkers: {
			bold: {
				open: "*",
				close: "*"
			},
			italic: {
				open: "_",
				close: "_"
			},
			strikethrough: {
				open: "~",
				close: "~"
			},
			code: {
				open: "`",
				close: "`"
			},
			code_block: {
				open: "```\n",
				close: "```"
			},
			blockquote: {
				open: markers.blockquoteOpen,
				close: markers.blockquoteClose
			}
		},
		escapeText: (value) => value,
		buildLink: (link, value, context) => {
			if (context.origin === "linkify") return null;
			const href = link.href.trim();
			const label = value.slice(link.start, link.end);
			if (!href || !label) return null;
			const labelHasStyles = ir.styles.some((span) => span.start < link.end && span.end > link.start);
			return /[<>|]/u.test(href) || /[<>|*_~`]/u.test(label) || labelHasStyles ? {
				start: link.start,
				end: link.end,
				open: "",
				close: ` (${href})`
			} : {
				start: link.start,
				end: link.end,
				open: `<${href}|`,
				close: ">"
			};
		}
	}, GOOGLE_CHAT_FORMAT_PROFILE), markers), markers.list);
}
/** Renders CommonMark into byte-bounded Google Chat app-message chunks. */
function formatGoogleChatTextChunks(text, limit = GOOGLE_CHAT_FORMAT_PROFILE.chunk.limit) {
	const prepared = prepareGoogleChatIR(text);
	return renderMarkdownIRChunksWithinLimit({
		ir: prepared.ir,
		limit: Math.min(limit, GOOGLE_CHAT_FORMAT_PROFILE.chunk.limit),
		measureRendered: (rendered) => new TextEncoder().encode(rendered).byteLength,
		renderChunk: (chunk) => renderGoogleChatIR(chunk, prepared.markers)
	}).map((chunk) => chunk.rendered);
}
//#endregion
//#region extensions/googlechat/src/channel.adapters.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-dvnaxPcr.js"), "googleChatChannelRuntime");
function createGoogleChatSendReceipt(params) {
	const messageId = params.messageId?.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "googlechat",
			messageId,
			chatId: params.chatId,
			conversationId: params.chatId
		}] : [],
		threadId: params.threadId,
		kind: params.kind
	});
}
const collectGoogleChatSecurityWarnings = composeAccountWarningCollectors(createAllowlistProviderOpenWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.googlechat !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	buildOpenWarning: {
		surface: "Google Chat spaces",
		openBehavior: "allows any space to trigger (mention-gated)",
		remediation: "Set channels.googlechat.groupPolicy=\"allowlist\" and configure channels.googlechat.groups"
	}
}), (account) => account.config.dmPolicy === "open" && "- Google Chat DMs are open to anyone. Set channels.googlechat.dmPolicy=\"pairing\" or \"allowlist\".");
const googlechatGroupsAdapter = { resolveRequireMention: resolveGoogleChatGroupRequireMention };
const googlechatDirectoryAdapter = createChannelDirectoryAdapter({
	listPeers: async (params) => listResolvedDirectoryUserEntriesFromAllowFrom({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveAllowFrom: (account) => account.config.allowFrom,
		normalizeId: (entry) => normalizeGoogleChatTarget(entry) ?? entry
	}),
	listGroups: async (params) => listResolvedDirectoryGroupEntriesFromMapKeys({
		...params,
		resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
		resolveGroups: (account) => account.config.groups
	})
});
const googlechatSecurityAdapter = {
	dm: {
		channelKey: "googlechat",
		resolvePolicy: (account) => account.config.dmPolicy,
		resolveAllowFrom: (account) => account.config.allowFrom,
		allowFromPathSuffix: "",
		normalizeEntry: (raw) => formatGoogleChatAllowFromEntry(raw)
	},
	collectWarnings: collectGoogleChatSecurityWarnings
};
const googlechatThreadingAdapter = {
	scopedAccountReplyToMode: {
		resolveAccount: (cfg, accountId) => resolveGoogleChatAccount({
			cfg,
			accountId
		}),
		resolveReplyToMode: (account, _chatType) => account.config.replyToMode,
		fallback: "off"
	},
	buildToolContext: ({ cfg, accountId, context, hasRepliedRef }) => {
		const currentChannelId = normalizeGoogleChatTarget(context.To);
		const replyToId = normalizeOptionalString(context.ReplyToIdFull) ?? normalizeOptionalString(context.ReplyToId);
		return {
			currentChannelId,
			currentMessageId: replyToId,
			currentThreadTs: replyToId,
			replyToMode: resolveGoogleChatAccount({
				cfg,
				accountId
			}).config.replyToMode,
			hasRepliedRef
		};
	}
};
const googlechatPairingTextAdapter = {
	idLabel: "googlechatUserId",
	message: PAIRING_APPROVED_MESSAGE,
	normalizeAllowEntry: (entry) => formatGoogleChatAllowFromEntry(entry),
	notify: async ({ cfg, id, message, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		if (account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") return;
		const user = normalizeGoogleChatTarget(id) ?? id;
		const space = await resolveGoogleChatOutboundSpace({
			account,
			target: isGoogleChatUserTarget(user) ? user : `users/${user}`
		});
		const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
		await sendGoogleChatMessage({
			account,
			space,
			text: message
		});
	}
};
const googlechatOutboundAdapter = {
	base: {
		deliveryMode: "direct",
		chunker: (text, limit) => formatGoogleChatTextChunks(text, limit),
		chunkerMode: "markdown",
		textChunkLimit: GOOGLE_CHAT_FORMAT_PROFILE.chunk.limit,
		sanitizeText: ({ text }) => sanitizeGoogleChatText(text),
		normalizePayload: ({ payload }) => shouldSuppressGoogleChatManualExecApprovalFollowupPayload(payload) ? null : payload,
		resolveTarget: ({ to }) => {
			const trimmed = normalizeOptionalString(to) ?? "";
			if (trimmed) {
				const normalized = normalizeGoogleChatTarget(trimmed);
				if (!normalized) return {
					ok: false,
					error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
				};
				return {
					ok: true,
					to: normalized
				};
			}
			return {
				ok: false,
				error: missingTargetError("Google Chat", "<spaces/{space}|users/{user}>")
			};
		}
	},
	attachedResults: {
		channel: "googlechat",
		sendText: async ({ cfg, to, text, accountId, replyToId, threadId }) => {
			const account = resolveGoogleChatAccount({
				cfg,
				accountId
			});
			const space = await resolveGoogleChatOutboundSpace({
				account,
				target: to
			});
			const thread = typeof threadId === "number" ? String(threadId) : threadId ?? replyToId ?? void 0;
			const { sendGoogleChatMessage } = await loadGoogleChatChannelRuntime();
			const result = await sendGoogleChatMessage({
				account,
				space,
				text,
				thread
			});
			const messageId = result?.messageName ?? "";
			return {
				messageId,
				chatId: space,
				receipt: createGoogleChatSendReceipt({
					messageId,
					chatId: space,
					threadId: result?.threadName ?? thread,
					kind: "text"
				})
			};
		}
	}
};
const googlechatMessageAdapter = defineChannelMessageAdapter({
	id: "googlechat",
	durableFinal: { capabilities: {
		text: true,
		thread: true,
		messageSendingHooks: true
	} },
	send: { text: googlechatOutboundAdapter.attachedResults.sendText }
});
//#endregion
export { googlechatPairingTextAdapter as a, googlechatOutboundAdapter as i, googlechatGroupsAdapter as n, googlechatSecurityAdapter as o, googlechatMessageAdapter as r, googlechatThreadingAdapter as s, googlechatDirectoryAdapter as t };
