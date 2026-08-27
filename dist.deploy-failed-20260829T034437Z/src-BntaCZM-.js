import "./number-coercion-CLj0HTDM.js";
//#region packages/normalization-core/src/balanced-json.ts
function isJsonOpeningDelimiter(char, openers) {
	return (char === "{" || char === "[") && openers.includes(char);
}
/** Extracts the first balanced JSON object/array from text. */
function extractBalancedJsonPrefix(raw, opts = {}) {
	const openers = opts.openers ?? ["{", "["];
	let start = 0;
	while (start < raw.length && !isJsonOpeningDelimiter(raw[start], openers)) start += 1;
	const stack = [];
	let inString = false;
	let escaped = false;
	for (let index = start; index < raw.length; index += 1) {
		const char = raw[index];
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
		} else if (char === "\"") inString = true;
		else if (isJsonOpeningDelimiter(char, openers)) stack.push(char);
		else if (stack.length > 0 && char === (stack.at(-1) === "{" ? "}" : "]")) {
			stack.pop();
			if (stack.length === 0) return {
				json: raw.slice(start, index + 1),
				startIndex: start,
				endIndex: index
			};
		}
	}
	return null;
}
/** Extracts every balanced JSON object/array fragment from arbitrary text. */
function extractBalancedJsonFragments(raw, opts = {}) {
	const fragments = [];
	for (let offset = 0; offset < raw.length;) {
		const fragment = extractBalancedJsonPrefix(raw.slice(offset), opts);
		if (!fragment) break;
		fragments.push({
			json: fragment.json,
			startIndex: offset + fragment.startIndex,
			endIndex: offset + fragment.endIndex
		});
		offset += fragment.endIndex + 1;
	}
	return fragments;
}
//#endregion
//#region packages/normalization-core/src/text-decoding.ts
/** Decodes a byte prefix without inventing a replacement character for a cut trailing sequence. */
function decodeTextPrefix(bytes, options = {}) {
	return new TextDecoder(options.encoding).decode(bytes, options.truncated ? { stream: true } : void 0);
}
//#endregion
export { extractBalancedJsonFragments as n, extractBalancedJsonPrefix as r, decodeTextPrefix as t };
