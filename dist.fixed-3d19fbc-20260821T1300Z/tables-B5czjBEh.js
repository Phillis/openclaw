import { c as isAutoLinkedMarkdownLink, i as markdownToIRWithMeta, s as copyMarkdownLinkSpan, t as applyConstructFallbacks } from "./construct-fallbacks-69epEQTJ.js";
//#region packages/markdown-core/src/render.ts
function getMarkdownLinkOrigin(link) {
	return isAutoLinkedMarkdownLink(link) ? "linkify" : "authored";
}
const STYLE_RANK = new Map([
	"blockquote",
	"code_block",
	"code",
	"heading_1",
	"heading_2",
	"heading_3",
	"heading_4",
	"heading_5",
	"heading_6",
	"bold",
	"italic",
	"underline",
	"strikethrough",
	"spoiler"
].map((style, index) => [style, index]));
const STRUCTURAL_STYLES = /* @__PURE__ */ new Set([
	"blockquote",
	"heading_1",
	"heading_2",
	"heading_3",
	"heading_4",
	"heading_5",
	"heading_6"
]);
function sortStyleSpans(spans) {
	return [...spans].toSorted((a, b) => {
		if (a.start !== b.start) return a.start - b.start;
		if (a.end !== b.end) return b.end - a.end;
		return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
	});
}
function mergeRanges(ranges) {
	const merged = [];
	for (const range of [...ranges].toSorted((a, b) => a.start - b.start || a.end - b.end)) {
		const previous = merged.at(-1);
		if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
		else merged.push({ ...range });
	}
	return merged;
}
function firstOverlappingRangeIndex(ranges, start) {
	let low = 0;
	let high = ranges.length;
	while (low < high) {
		const middle = low + Math.floor((high - low) / 2);
		const range = ranges[middle];
		if (range && range.end <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function subtractRanges(span, ranges) {
	const firstOverlap = firstOverlappingRangeIndex(ranges, span.start);
	const firstRange = ranges[firstOverlap];
	if (!firstRange || firstRange.start >= span.end) return [span];
	const pieces = [];
	let cursor = span.start;
	for (let index = firstOverlap; index < ranges.length; index += 1) {
		const range = ranges[index];
		if (!range || range.start >= span.end) break;
		const rangeStart = Math.max(span.start, range.start);
		const rangeEnd = Math.min(span.end, range.end);
		if (rangeStart > cursor) pieces.push({
			...span,
			start: cursor,
			end: rangeStart
		});
		cursor = Math.max(cursor, rangeEnd);
	}
	if (cursor < span.end) pieces.push({
		...span,
		start: cursor,
		end: span.end
	});
	return pieces;
}
function splitAtBoundaries(span, boundaries) {
	let low = 0;
	let high = boundaries.length;
	while (low < high) {
		const middle = low + Math.floor((high - low) / 2);
		if ((boundaries[middle] ?? Number.POSITIVE_INFINITY) <= span.start) low = middle + 1;
		else high = middle;
	}
	if ((boundaries[low] ?? Number.POSITIVE_INFINITY) >= span.end) return [span];
	const pieces = [];
	let cursor = span.start;
	for (let index = low; index < boundaries.length; index += 1) {
		const boundary = boundaries[index];
		if (boundary === void 0 || boundary >= span.end) break;
		pieces.push({
			...span,
			start: cursor,
			end: boundary
		});
		cursor = boundary;
	}
	pieces.push({
		...span,
		start: cursor,
		end: span.end
	});
	return pieces;
}
function sortAnnotationSpans(spans) {
	return [...spans].toSorted((a, b) => a.start - b.start || b.end - a.end);
}
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
function renderMarkdownWithMarkers(ir, options, profile) {
	const projected = profile ? applyConstructFallbacks(ir, profile) : ir;
	const text = projected.text ?? "";
	if (!text) return "";
	const styleMarkers = options.styleMarkers;
	const annotationMarkers = options.annotationMarkers ?? {};
	const annotated = sortAnnotationSpans((projected.annotations ?? []).filter((span) => Boolean(annotationMarkers[span.type])));
	const dominantAnnotationRanges = mergeRanges(annotated.filter((span) => annotationMarkers[span.type]?.suppressNestedFormatting === true));
	const annotationBoundaries = [...new Set(annotated.flatMap((span) => [span.start, span.end]))].toSorted((a, b) => a - b);
	const styled = sortStyleSpans(projected.styles.filter((span) => Boolean(styleMarkers[span.style])).flatMap((span) => {
		if (STRUCTURAL_STYLES.has(span.style)) return [span];
		return subtractRanges(span, dominantAnnotationRanges).flatMap((piece) => splitAtBoundaries(piece, annotationBoundaries));
	}));
	const boundaries = /* @__PURE__ */ new Set();
	boundaries.add(0);
	boundaries.add(text.length);
	const startsAt = /* @__PURE__ */ new Map();
	for (const span of styled) {
		if (span.start === span.end) continue;
		boundaries.add(span.start);
		boundaries.add(span.end);
		const bucket = startsAt.get(span.start);
		if (bucket) bucket.push(span);
		else startsAt.set(span.start, [span]);
	}
	for (const spans of startsAt.values()) spans.sort((a, b) => {
		if (a.end !== b.end) return b.end - a.end;
		return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
	});
	const annotationStarts = /* @__PURE__ */ new Map();
	for (const span of annotated) {
		if (span.start === span.end) continue;
		boundaries.add(span.start);
		boundaries.add(span.end);
		const bucket = annotationStarts.get(span.start);
		if (bucket) bucket.push(span);
		else annotationStarts.set(span.start, [span]);
	}
	const linkStarts = /* @__PURE__ */ new Map();
	if (options.buildLink) {
		const links = projected.links.flatMap((span) => subtractRanges(span, dominantAnnotationRanges).flatMap((piece) => splitAtBoundaries(piece, annotationBoundaries)).map((piece) => copyMarkdownLinkSpan(span, {
			start: piece.start,
			end: piece.end,
			href: piece.href
		})));
		for (const link of links) {
			if (link.start === link.end) continue;
			const rendered = options.buildLink(link, text, { origin: getMarkdownLinkOrigin(link) });
			if (!rendered) continue;
			boundaries.add(rendered.start);
			boundaries.add(rendered.end);
			const openBucket = linkStarts.get(rendered.start);
			if (openBucket) openBucket.push(rendered);
			else linkStarts.set(rendered.start, [rendered]);
		}
	}
	const points = [...boundaries].toSorted((a, b) => a - b);
	const stack = [];
	let out = "";
	for (const [i, pos] of points.entries()) {
		while (stack.length && stack[stack.length - 1]?.end === pos) {
			const item = stack.pop();
			if (item) out += item.close;
		}
		const openingItems = [];
		const openingAnnotations = annotationStarts.get(pos);
		if (openingAnnotations) for (const [index, span] of openingAnnotations.entries()) {
			const marker = annotationMarkers[span.type];
			if (!marker) continue;
			openingItems.push({
				end: span.end,
				open: typeof marker.open === "function" ? marker.open(span) : marker.open,
				close: marker.close,
				kind: "annotation",
				index
			});
		}
		const openingLinks = linkStarts.get(pos);
		if (openingLinks && openingLinks.length > 0) for (const [index, link] of openingLinks.entries()) openingItems.push({
			end: link.end,
			open: link.open,
			close: link.close,
			kind: "link",
			index
		});
		const openingStyles = startsAt.get(pos);
		if (openingStyles) for (const [index, span] of openingStyles.entries()) {
			const marker = styleMarkers[span.style];
			if (!marker) continue;
			openingItems.push({
				end: span.end,
				open: typeof marker.open === "function" ? marker.open(span) : marker.open,
				close: marker.close,
				kind: "style",
				style: span.style,
				index
			});
		}
		if (openingItems.length > 0) {
			openingItems.sort((a, b) => {
				if (a.end !== b.end) return b.end - a.end;
				const aStructural = a.kind === "style" && STRUCTURAL_STYLES.has(a.style);
				const bStructural = b.kind === "style" && STRUCTURAL_STYLES.has(b.style);
				if (aStructural !== bStructural || a.kind !== b.kind) {
					const kindRank = {
						annotation: 0,
						link: 1,
						style: 2
					};
					return (aStructural ? -1 : kindRank[a.kind]) - (bStructural ? -1 : kindRank[b.kind]);
				}
				if (a.kind === "style" && b.kind === "style") return (STYLE_RANK.get(a.style) ?? 0) - (STYLE_RANK.get(b.style) ?? 0);
				return a.index - b.index;
			});
			for (const item of openingItems) {
				out += item.open;
				stack.push({
					close: item.close,
					end: item.end
				});
			}
		}
		const next = points.at(i + 1);
		if (next === void 0) break;
		if (next > pos) out += options.escapeText(text.slice(pos, next));
	}
	return out;
}
//#endregion
//#region packages/markdown-core/src/tables.ts
const MARKDOWN_STYLE_MARKERS = {
	bold: {
		open: "**",
		close: "**"
	},
	italic: {
		open: "_",
		close: "_"
	},
	strikethrough: {
		open: "~~",
		close: "~~"
	},
	code: {
		open: "`",
		close: "`"
	},
	code_block: {
		open: "```\n",
		close: "```"
	}
};
/** Converts markdown tables into the configured plaintext/code rendering mode. */
function convertMarkdownTables(markdown, mode) {
	if (!markdown || mode === "off") return markdown;
	const { ir, hasTables } = markdownToIRWithMeta(markdown, {
		linkify: false,
		autolink: false,
		headingStyle: "none",
		blockquotePrefix: "",
		tableMode: mode === "block" ? "code" : mode
	});
	if (!hasTables) return markdown;
	return renderMarkdownWithMarkers(ir, {
		styleMarkers: MARKDOWN_STYLE_MARKERS,
		escapeText: (text) => text,
		buildLink: (link, text) => {
			const href = link.href.trim();
			if (!href) return null;
			if (!text.slice(link.start, link.end)) return null;
			return {
				start: link.start,
				end: link.end,
				open: "[",
				close: `](${href})`
			};
		}
	});
}
//#endregion
export { renderMarkdownWithMarkers as n, convertMarkdownTables as t };
