import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as markdownToIRWithMeta } from "./construct-fallbacks-Dvy1yFH8.js";
import { t as stripMarkdown } from "./strip-markdown-B-Mt4yuJ.js";
import "./text-chunking-CJz4kAsi.js";
import "./text-utility-runtime-BNhX-3os.js";
import { c as normalizeLineAction, f as uriAction, i as createReceiptCard, s as messageAction, u as postbackAction } from "./send-receipt-I33lTCFa.js";
//#region extensions/line/src/template-messages.ts
const COMPACT_TEMPLATE_TEXT_LIMIT = 60;
const TEMPLATE_ALT_TEXT_LIMIT = 1500;
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function buildTemplatePayloadAction(action) {
	if (action.type === "uri" && action.uri) return uriAction(action.label, action.uri);
	if (action.type === "postback" && action.data) return postbackAction(action.label, action.data, action.label);
	return messageAction(action.label, action.data ?? action.label);
}
function resolveTemplateTextLimit(params) {
	return params.title !== void 0 || params.thumbnailImageUrl !== void 0 ? COMPACT_TEMPLATE_TEXT_LIMIT : params.textOnlyLimit;
}
function truncateTemplateText(text, limit) {
	let result = "";
	for (const { segment } of graphemeSegmenter.segment(text)) {
		if (result.length + segment.length > limit) {
			if (!result) for (const codePoint of segment) {
				if (result.length + codePoint.length > limit) break;
				result += codePoint;
			}
			break;
		}
		result += segment;
	}
	return result;
}
function truncateOptionalTemplateText(value, limit) {
	return value === void 0 ? void 0 : truncateTemplateText(value, limit);
}
function resolveTemplateAltText(value, fallback) {
	return truncateTemplateText(value ?? fallback, TEMPLATE_ALT_TEXT_LIMIT);
}
function normalizeCarouselColumnActions(column) {
	return {
		...column,
		actions: column.actions.map((action) => normalizeLineAction(action)),
		defaultAction: column.defaultAction === void 0 ? void 0 : normalizeLineAction(column.defaultAction)
	};
}
/**
* Create a confirm template (yes/no style dialog)
*/
function createConfirmTemplate(text, confirmAction, cancelAction, altText) {
	const template = {
		type: "confirm",
		text: truncateTemplateText(text, 240),
		actions: [normalizeLineAction(confirmAction), normalizeLineAction(cancelAction)]
	};
	return {
		type: "template",
		altText: resolveTemplateAltText(altText, text),
		template
	};
}
/**
* Create a button template with title, text, and action buttons
*/
function createButtonTemplate(title, text, actions, options) {
	const normalizedTitle = title || void 0;
	const textLimit = resolveTemplateTextLimit({
		title: normalizedTitle,
		thumbnailImageUrl: options?.thumbnailImageUrl,
		textOnlyLimit: 160
	});
	const template = {
		type: "buttons",
		...normalizedTitle ? { title: truncateTemplateText(normalizedTitle, 40) } : {},
		text: truncateTemplateText(text, textLimit),
		actions: actions.slice(0, 4).map((action) => normalizeLineAction(action)),
		thumbnailImageUrl: options?.thumbnailImageUrl,
		imageAspectRatio: options?.imageAspectRatio ?? "rectangle",
		imageSize: options?.imageSize ?? "cover",
		imageBackgroundColor: options?.imageBackgroundColor,
		defaultAction: options?.defaultAction === void 0 ? void 0 : normalizeLineAction(options.defaultAction)
	};
	return {
		type: "template",
		altText: resolveTemplateAltText(options?.altText, normalizedTitle ? `${normalizedTitle}: ${text}` : text),
		template
	};
}
/**
* Create a carousel template with multiple columns
*/
function createTemplateCarousel(columns, options) {
	const template = {
		type: "carousel",
		columns: columns.slice(0, 10).map(normalizeCarouselColumnActions),
		imageAspectRatio: options?.imageAspectRatio ?? "rectangle",
		imageSize: options?.imageSize ?? "cover"
	};
	return {
		type: "template",
		altText: resolveTemplateAltText(options?.altText, "View carousel"),
		template
	};
}
/**
* Create a carousel column for use with createTemplateCarousel
*/
function createCarouselColumn(params) {
	const textLimit = resolveTemplateTextLimit({
		...params,
		textOnlyLimit: 120
	});
	return {
		title: truncateOptionalTemplateText(params.title, 40),
		text: truncateTemplateText(params.text, textLimit),
		actions: params.actions.slice(0, 3).map((action) => normalizeLineAction(action)),
		thumbnailImageUrl: params.thumbnailImageUrl,
		imageBackgroundColor: params.imageBackgroundColor,
		defaultAction: params.defaultAction === void 0 ? void 0 : normalizeLineAction(params.defaultAction)
	};
}
/**
* Convert a TemplateMessagePayload from ReplyPayload to a LINE TemplateMessage
*/
function buildTemplateMessageFromPayload(payload) {
	switch (payload.type) {
		case "confirm": {
			const confirmAction = payload.confirmData.startsWith("http") ? uriAction(payload.confirmLabel, payload.confirmData) : payload.confirmData.includes("=") ? postbackAction(payload.confirmLabel, payload.confirmData, payload.confirmLabel) : messageAction(payload.confirmLabel, payload.confirmData);
			const cancelAction = payload.cancelData.startsWith("http") ? uriAction(payload.cancelLabel, payload.cancelData) : payload.cancelData.includes("=") ? postbackAction(payload.cancelLabel, payload.cancelData, payload.cancelLabel) : messageAction(payload.cancelLabel, payload.cancelData);
			return createConfirmTemplate(payload.text, confirmAction, cancelAction, payload.altText);
		}
		case "buttons": {
			const actions = payload.actions.slice(0, 4).map((action) => buildTemplatePayloadAction(action));
			return createButtonTemplate(payload.title, payload.text, actions, {
				thumbnailImageUrl: payload.thumbnailImageUrl,
				altText: payload.altText
			});
		}
		case "carousel": return createTemplateCarousel(payload.columns.slice(0, 10).map((col) => {
			const colActions = col.actions.slice(0, 3).map((action) => buildTemplatePayloadAction(action));
			return createCarouselColumn({
				title: col.title,
				text: col.text,
				thumbnailImageUrl: col.thumbnailImageUrl,
				actions: colActions
			});
		}), { altText: payload.altText });
		default: return null;
	}
}
//#endregion
//#region extensions/line/src/flex-templates/message.ts
/**
* Wrap a FlexContainer in a FlexMessage
*/
function toFlexMessage(altText, contents) {
	return {
		type: "flex",
		altText,
		contents
	};
}
//#endregion
//#region extensions/line/src/markdown-to-line.ts
const LINE_MARKDOWN_OPTIONS = {
	assistantTranscriptRoleHeaders: true,
	autolink: false,
	blockquotePrefix: "",
	headingStyle: "none",
	horizontalRuleText: "",
	linkify: false,
	preserveSourceBlockSpacing: true
};
const TRANSCRIPT_ROLE_PREFIX = "[assistant-authored transcript] ";
const LINE_FLEX_BUBBLE_MAX_BYTES = 3e4;
function parseLineMarkdown(text, tableMode = "block") {
	return markdownToIRWithMeta(text, {
		...LINE_MARKDOWN_OPTIONS,
		tableMode
	});
}
function toMarkdownTable(table) {
	return {
		headers: table.headers,
		rows: table.rows,
		headerCells: table.headerCells,
		rowCells: table.rowCells
	};
}
function codeBlockSpans(ir) {
	return ir.styles.filter((span) => span.style === "code_block");
}
function toCodeBlock(ir, span) {
	return {
		...span.language ? { language: span.language } : {},
		code: ir.text.slice(span.start, span.end).trimEnd()
	};
}
function rangesOverlap(left, right) {
	return left.start < right.end && right.start < left.end;
}
function projectPlainText(ir, omitted = [], additionalInsertions = [], onSegment) {
	const insertions = [...additionalInsertions];
	for (const link of ir.links) {
		if (omitted.some((range) => rangesOverlap(range, link))) continue;
		const href = link.href.trim();
		const label = ir.text.slice(link.start, link.end).trim();
		const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
		if (href && label && label !== href && label !== comparableHref) insertions.push({
			position: link.end,
			text: ` (${href})`
		});
	}
	for (const annotation of ir.annotations ?? []) if (annotation.type === "assistant_transcript_role" && !omitted.some((range) => rangesOverlap(range, annotation))) insertions.push({
		position: annotation.start,
		text: TRANSCRIPT_ROLE_PREFIX
	});
	const inlineCodeSpans = ir.styles.filter((span) => span.style === "code" && !omitted.some((range) => rangesOverlap(range, span)));
	for (const span of inlineCodeSpans) if (stripMarkdown(ir.text.slice(span.start, span.end), { assistantTranscriptRoleHeaders: true }).startsWith(TRANSCRIPT_ROLE_PREFIX)) insertions.push({
		position: span.start,
		text: TRANSCRIPT_ROLE_PREFIX
	});
	insertions.sort((left, right) => left.position - right.position);
	const underlineTags = [...ir.text.matchAll(/<\/?u>/gi)].map((match) => ({
		start: match.index,
		end: match.index + match[0].length
	})).filter((tag) => !inlineCodeSpans.some((span) => rangesOverlap(tag, span)) && !omitted.some((span) => rangesOverlap(tag, span)));
	const removed = [...omitted, ...underlineTags].toSorted((left, right) => left.start - right.start);
	let output = "";
	let segmentStart = 0;
	let cursor = 0;
	let insertionIndex = 0;
	const appendRange = (end) => {
		while (insertionIndex < insertions.length) {
			const insertion = insertions[insertionIndex];
			if (!insertion || insertion.position > end) break;
			if (insertion.position >= cursor) {
				output += ir.text.slice(cursor, insertion.position);
				if ("text" in insertion) output += insertion.text;
				else if (onSegment) {
					const precedingText = output.slice(segmentStart).trim();
					if (precedingText) onSegment({
						type: "text",
						text: precedingText
					});
					onSegment({
						type: "flex",
						message: insertion.message
					});
					segmentStart = output.length;
				}
				cursor = insertion.position;
			}
			insertionIndex += 1;
		}
		output += ir.text.slice(cursor, end);
		cursor = end;
	};
	for (const range of removed) {
		appendRange(range.start);
		cursor = Math.max(cursor, range.end);
		while (insertionIndex < insertions.length && (insertions[insertionIndex]?.position ?? cursor) < cursor) insertionIndex += 1;
	}
	appendRange(ir.text.length);
	if (onSegment) {
		const trailingText = output.slice(segmentStart).trim();
		if (trailingText) onSegment({
			type: "text",
			text: trailingText
		});
	}
	return output.trim();
}
function formatOversizedTableAsBullets(table) {
	const markdownCell = (cell) => projectPlainText(cell).replace(/[\\|`*_[\]~<>&]/gu, "\\$&").replace(/\r?\n/gu, " ");
	const markdownRow = (cells) => `| ${cells.map(markdownCell).join(" | ")} |`;
	return projectPlainText(parseLineMarkdown([
		markdownRow(table.headerCells),
		`| ${table.headerCells.map(() => "---").join(" | ")} |`,
		...table.rowCells.map(markdownRow)
	].join("\n"), "bullets").ir);
}
function sameSpanStyle(left, right) {
	return left.weight === right.weight && left.style === right.style && left.decoration === right.decoration;
}
function renderTableCell(cell, fallback) {
	if (!cell?.text.trim()) return {
		text: fallback,
		hasMarkup: false
	};
	const codeSpans = cell.styles.filter((span) => span.style === "code");
	const tags = [...cell.text.matchAll(/<\/?u>/gi)].map((match) => ({
		start: match.index,
		end: match.index + match[0].length,
		closing: match[0][1] === "/"
	})).filter((tag) => !codeSpans.some((span) => rangesOverlap(tag, span)));
	const boundaries = /* @__PURE__ */ new Set([0, cell.text.length]);
	for (const style of cell.styles) {
		boundaries.add(style.start);
		boundaries.add(style.end);
	}
	for (const link of cell.links) boundaries.add(link.end);
	for (const tag of tags) {
		boundaries.add(tag.start);
		boundaries.add(tag.end);
	}
	const sortedBoundaries = [...boundaries].toSorted((left, right) => left - right);
	const spans = [];
	let underlineDepth = 0;
	let hasMarkup = false;
	const appendSpan = (span) => {
		const previous = spans.at(-1);
		if (previous && sameSpanStyle(previous, span)) previous.text = `${previous.text ?? ""}${span.text ?? ""}`;
		else spans.push(span);
	};
	for (let index = 0; index < sortedBoundaries.length - 1; index += 1) {
		const start = sortedBoundaries[index];
		const end = sortedBoundaries[index + 1];
		if (start === void 0 || end === void 0) continue;
		const tag = tags.find((candidate) => candidate.start === start);
		if (tag) {
			underlineDepth += tag.closing ? -1 : 1;
			hasMarkup = true;
			continue;
		}
		const text = cell.text.slice(start, end);
		if (text) {
			const active = new Set(cell.styles.filter((style) => style.start <= start && style.end >= end).map((style) => style.style));
			const weight = active.has("bold") ? "bold" : void 0;
			const style = active.has("italic") ? "italic" : void 0;
			const decoration = active.has("strikethrough") ? "line-through" : underlineDepth > 0 ? "underline" : void 0;
			hasMarkup ||= weight !== void 0 || style !== void 0 || decoration !== void 0;
			appendSpan({
				type: "span",
				text,
				weight,
				style,
				decoration
			});
		}
		for (const link of cell.links.filter((candidate) => candidate.end === end)) {
			const href = link.href.trim();
			const label = cell.text.slice(link.start, link.end).trim();
			if (href && label && label !== href) {
				appendSpan({
					type: "span",
					text: ` (${href})`
				});
				hasMarkup = true;
			}
		}
	}
	return {
		text: spans.map((span) => span.text ?? "").join("").trim() || fallback,
		...hasMarkup ? { contents: spans } : {},
		hasMarkup
	};
}
function plainTableCell(text) {
	return parseLineMarkdown(text, "off").ir;
}
/** Convert a markdown table to a LINE Flex Message bubble. */
function convertTableToFlexBubble(table) {
	const headerCells = (table.headerCells ?? table.headers.map(plainTableCell)).map((cell) => renderTableCell(cell, "-"));
	const rowCells = (table.rowCells ?? table.rows.map((row) => row.map(plainTableCell))).map((row) => row.map((cell) => renderTableCell(cell, "-")));
	const hasInlineMarkup = headerCells.some((cell) => cell.hasMarkup) || rowCells.some((row) => row.some((cell) => cell.hasMarkup));
	if (table.headers.length === 2 && !hasInlineMarkup) return createReceiptCard({
		title: headerCells.map((cell) => cell.text).join(" / "),
		items: rowCells.map((row) => ({
			name: row[0]?.text ?? "-",
			value: row[1]?.text ?? "-"
		}))
	});
	return {
		type: "bubble",
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "box",
					layout: "horizontal",
					contents: headerCells.map((cell) => ({
						type: "text",
						text: cell.text,
						contents: cell.contents,
						weight: "bold",
						size: "sm",
						color: "#333333",
						flex: 1,
						wrap: true
					})),
					paddingBottom: "sm"
				},
				{
					type: "separator",
					margin: "sm"
				},
				...rowCells.slice(0, 10).map((row, rowIndex) => ({
					type: "box",
					layout: "horizontal",
					contents: table.headers.map((_, colIndex) => {
						const cell = row[colIndex] ?? {
							text: "-",
							hasMarkup: false
						};
						return {
							type: "text",
							text: cell.text,
							contents: cell.contents,
							size: "sm",
							color: "#666666",
							flex: 1,
							wrap: true
						};
					}),
					margin: rowIndex === 0 ? "md" : "sm"
				}))
			],
			paddingAll: "lg"
		}
	};
}
/** Convert a code block to a LINE Flex Message bubble. */
function convertCodeBlockToFlexBubble(block) {
	const titleText = block.language ? `Code (${block.language})` : "Code";
	const displayCode = block.code.length > 2e3 ? truncateUtf16Safe(block.code, 2e3) + "\n..." : block.code;
	return {
		type: "bubble",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: titleText,
				weight: "bold",
				size: "sm",
				color: "#666666"
			}, {
				type: "box",
				layout: "vertical",
				contents: [{
					type: "text",
					text: displayCode,
					size: "xs",
					color: "#333333",
					wrap: true
				}],
				backgroundColor: "#F5F5F5",
				paddingAll: "md",
				cornerRadius: "md",
				margin: "sm"
			}],
			paddingAll: "lg"
		}
	};
}
/** Parse once, route existing block surfaces to Flex, and project the remainder as plain text. */
function processLineMessage(text) {
	const { ir, tables } = parseLineMarkdown(text);
	const codeSpans = codeBlockSpans(ir);
	const plainTextInsertions = [];
	for (const table of tables) {
		const bubble = table.rowCells.length > 10 && (table.headers.length !== 2 || table.rowCells.length > 12 || [table.headerCells, ...table.rowCells].some((cells) => cells.some((cell) => renderTableCell(cell, "-").hasMarkup))) ? void 0 : convertTableToFlexBubble(toMarkdownTable(table));
		if (!bubble || Buffer.byteLength(JSON.stringify(bubble), "utf8") > LINE_FLEX_BUBBLE_MAX_BYTES) {
			plainTextInsertions.push({
				position: table.placeholderOffset,
				text: `\n\n${formatOversizedTableAsBullets(table)}\n\n`
			});
			continue;
		}
		const message = toFlexMessage("Table", bubble);
		plainTextInsertions.push({
			position: table.placeholderOffset,
			message
		});
	}
	for (const span of codeSpans) {
		const message = toFlexMessage("Code", convertCodeBlockToFlexBubble(toCodeBlock(ir, span)));
		plainTextInsertions.push({
			position: span.start,
			message
		});
	}
	const segments = [];
	return {
		text: projectPlainText(ir, codeSpans, plainTextInsertions, (segment) => segments.push(segment)),
		flexMessages: segments.flatMap((segment) => segment.type === "flex" ? [segment.message] : []),
		...plainTextInsertions.length > 0 ? { segments } : {}
	};
}
/** Check if text contains markdown that needs conversion. */
function hasMarkdownToConvert(text) {
	const { ir, tables } = parseLineMarkdown(text);
	return tables.length > 0 || ir.styles.length > 0 || ir.links.length > 0 || /<\/?u>/i.test(ir.text) || ir.text !== text.trimEnd();
}
//#endregion
export { toFlexMessage as a, createCarouselColumn as c, processLineMessage as i, createConfirmTemplate as l, convertTableToFlexBubble as n, buildTemplateMessageFromPayload as o, hasMarkdownToConvert as r, createButtonTemplate as s, convertCodeBlockToFlexBubble as t, createTemplateCarousel as u };
