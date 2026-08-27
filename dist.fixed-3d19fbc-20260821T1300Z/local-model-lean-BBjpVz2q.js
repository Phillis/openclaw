import { g as resolveSessionAgentIds } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-CYqaxHxr.js";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-CrqljM7B.js";
import { g as normalizeToolPolicyName, m as expandToolGroups } from "./tool-policy-CWmnHLY1.js";
//#region src/auto-reply/source-reply-delivery-mode.ts
/** Canonical predicate for message-tool-owned visible replies. */
/**
* True when the visible source reply must flow through the message tool, either
* because the run forces it or because the delivery mode is message_tool_only.
* Consumers use this to keep the message tool visible/preserved: hiding the only
* reply path leaves the run mute. The mode is accepted as plain string because
* harness callers carry it untyped; only "message_tool_only" is meaningful here.
*/
function messageToolOwnsVisibleReply(params) {
	return params.forceMessageTool === true || params.sourceReplyDeliveryMode === "message_tool_only";
}
//#endregion
//#region src/agents/local-model-lean.ts
/**
* Local-model lean tool filtering.
* Removes high-latency or channel-dependent tools for local models while
* preserving explicitly required delivery tools.
*/
const LOCAL_MODEL_LEAN_DENY_TOOL_NAMES = /* @__PURE__ */ new Set([
	"browser",
	AUTOMATIONS_TOOL_NAME,
	"image_generate",
	"message",
	"music_generate",
	"pdf",
	"tts",
	"video_generate"
]);
const LOCAL_MODEL_LEAN_TOOL_SEARCH_DEFAULTS = {
	enabled: true,
	mode: "tools",
	searchDefaultLimit: 5,
	maxSearchLimit: 10
};
function resolvePreservedLocalModelLeanToolNames(names) {
	if (!names) return [];
	return compileGlobPatterns({
		raw: expandToolGroups([...names]).filter((name) => normalizeToolPolicyName(name) !== "*"),
		normalize: normalizeToolPolicyName
	});
}
/** Resolves tool names that must survive local-model lean filtering. */
function resolveLocalModelLeanPreserveToolNames(params) {
	const names = [...params?.toolNames ?? []];
	if (params && messageToolOwnsVisibleReply(params)) names.push("message");
	return [...new Set(names)];
}
function resolveLocalModelLeanAgentId(params) {
	const explicitAgentId = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	if (params.config) return resolveSessionAgentIds({
		config: params.config,
		agentId: explicitAgentId,
		sessionKey: params.sessionKey
	}).sessionAgentId;
	const parsedSessionAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
	return explicitAgentId ?? (parsedSessionAgentId ? normalizeAgentId(parsedSessionAgentId) : void 0);
}
/** Returns true when local-model lean mode is enabled for the selected agent. */
function isLocalModelLeanEnabled(params) {
	const normalizedAgentId = resolveLocalModelLeanAgentId(params);
	return (params.config && normalizedAgentId ? resolveAgentConfig(params.config, normalizedAgentId)?.experimental ?? params.config.agents?.defaults?.experimental : params.config?.agents?.defaults?.experimental)?.localModelLean ?? false;
}
/** Filters tools for local-model lean mode while preserving required delivery tools. */
function filterLocalModelLeanTools(params) {
	if (!isLocalModelLeanEnabled(params)) return params.tools;
	const preservedToolNames = resolvePreservedLocalModelLeanToolNames(params.preserveToolNames);
	return params.tools.filter((tool) => {
		const normalizedName = normalizeToolPolicyName(tool.name);
		return matchesAnyGlobPattern(normalizedName, preservedToolNames) || !LOCAL_MODEL_LEAN_DENY_TOOL_NAMES.has(normalizedName);
	});
}
function applyLocalModelLeanToolSearchDefaults(params) {
	if (!params.config || !isLocalModelLeanEnabled(params)) return params.config;
	if (params.config.tools?.toolSearch !== void 0) return params.config;
	return {
		...params.config,
		tools: {
			...params.config.tools,
			toolSearch: LOCAL_MODEL_LEAN_TOOL_SEARCH_DEFAULTS
		}
	};
}
//#endregion
export { messageToolOwnsVisibleReply as a, resolveLocalModelLeanPreserveToolNames as i, filterLocalModelLeanTools as n, isLocalModelLeanEnabled as r, applyLocalModelLeanToolSearchDefaults as t };
