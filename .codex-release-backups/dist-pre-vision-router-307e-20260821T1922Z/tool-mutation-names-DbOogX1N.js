import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as LEGACY_AUTOMATIONS_TOOL_NAMES, t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-CYqaxHxr.js";
//#region src/agents/tool-mutation-names.ts
const FILE_MUTATION_TOOL_NAMES = /* @__PURE__ */ new Set([
	"write",
	"edit",
	"apply_patch"
]);
const MUTATING_TOOL_NAMES = /* @__PURE__ */ new Set([
	...FILE_MUTATION_TOOL_NAMES,
	"exec",
	"bash",
	"process",
	"message",
	"sessions",
	"sessions_spawn",
	"sessions_send",
	AUTOMATIONS_TOOL_NAME,
	...LEGACY_AUTOMATIONS_TOOL_NAMES,
	"gateway",
	"portal",
	"canvas",
	"computer",
	"mobile_ui",
	"conversations_send",
	"conversations_turn",
	"nodes",
	"session_status",
	"create_goal",
	"update_goal"
]);
function resolveFileMutationToolName(toolName) {
	const normalized = normalizeLowercaseStringOrEmpty(toolName);
	return FILE_MUTATION_TOOL_NAMES.has(normalized) ? normalized : void 0;
}
function isLikelyMutatingToolName(toolName) {
	const normalized = normalizeLowercaseStringOrEmpty(toolName);
	return Boolean(normalized && (MUTATING_TOOL_NAMES.has(normalized) || normalized.endsWith("_actions") || normalized.startsWith("message_") || normalized.includes("send")));
}
//#endregion
export { resolveFileMutationToolName as n, isLikelyMutatingToolName as t };
