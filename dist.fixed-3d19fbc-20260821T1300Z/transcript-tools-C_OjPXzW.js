import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
//#region src/utils/transcript-tools.ts
/**
* Transcript inspection helpers shared by session filesystem views and usage metrics.
* Keep provider-specific block aliases centralized so both surfaces classify tools consistently.
*/
const TOOL_CALL_TYPES = /* @__PURE__ */ new Set([
	"tool_use",
	"toolcall",
	"tool_call"
]);
const TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["tool_result", "tool_result_error"]);
const normalizeType = (value) => {
	return typeof value === "string" ? normalizeOptionalLowercaseString(value) ?? "" : "";
};
/** Extracts de-duplicated tool names from direct fields and structured content blocks. */
const extractToolCallNames = (message) => {
	const names = /* @__PURE__ */ new Set();
	const toolNameRaw = message.toolName ?? message.tool_name;
	const toolName = typeof toolNameRaw === "string" ? normalizeOptionalString(toolNameRaw) : void 0;
	if (toolName) names.add(toolName);
	const content = message.content;
	if (!Array.isArray(content)) return Array.from(names);
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		const type = normalizeType(block.type);
		if (!TOOL_CALL_TYPES.has(type)) continue;
		const name = typeof block.name === "string" ? normalizeOptionalString(block.name) : void 0;
		if (name) names.add(name);
	}
	return Array.from(names);
};
/** Returns whether a transcript message contains any recognized tool-call marker. */
const hasToolCall = (message) => extractToolCallNames(message).length > 0;
/** Counts recognized tool-result blocks and the subset explicitly marked as errors. */
const countToolResults = (message) => {
	const content = message.content;
	if (!Array.isArray(content)) return {
		total: 0,
		errors: 0
	};
	let total = 0;
	let errors = 0;
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		const type = normalizeType(block.type);
		if (!TOOL_RESULT_TYPES.has(type)) continue;
		total += 1;
		if (block.is_error === true) errors += 1;
	}
	return {
		total,
		errors
	};
};
//#endregion
export { extractToolCallNames as n, hasToolCall as r, countToolResults as t };
