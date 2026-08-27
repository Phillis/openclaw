import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.js";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.js";
import { a as expandToolGroups, c as normalizeToolPolicyName } from "./tool-policy-shared-DmpG3HvD.js";
import "./tool-policy-B1rvCc4B.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-tools.ring-zero-context.ts
const activeRingZeroTools = new AsyncLocalStorage();
var HostScopedAgentToolAuthorizationError = class extends Error {
	constructor(message) {
		super(message);
		this.status = 403;
		this.name = "HostScopedAgentToolAuthorizationError";
	}
};
function bindToolToScope(tool, scope) {
	const execute = tool.execute;
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			if (!scope.active) throw new HostScopedAgentToolAuthorizationError(`host-scoped tool "${tool.name}" is no longer authorized for this run`);
			return await execute(toolCallId, params, signal, onUpdate);
		}
	};
}
/**
* Bind host-owned tools to one selected harness run. The SDK reads this scope
* during tool construction, so plugins never receive private authority objects.
*/
function runWithAgentRingZeroTools(tools, run) {
	const scope = {
		active: true,
		tools: []
	};
	scope.tools = tools.map((tool) => bindToolToScope(tool, scope));
	try {
		const result = activeRingZeroTools.run(scope, run);
		if (isPromiseLike(result)) return Promise.resolve(result).finally(() => {
			scope.active = false;
		});
		scope.active = false;
		return result;
	} catch (error) {
		scope.active = false;
		throw error;
	}
}
/** Read the host-owned tools bound to the current harness run. */
function getActiveAgentRingZeroTools() {
	const scope = activeRingZeroTools.getStore();
	return scope?.active === true ? scope.tools : [];
}
function mergeAgentRingZeroTools(ringZeroTools, tools) {
	if (ringZeroTools.length === 0) return tools;
	const reservedNames = new Set(ringZeroTools.map((tool) => tool.name));
	return [...ringZeroTools, ...tools.filter((tool) => !reservedNames.has(tool.name))];
}
/**
* Read a host-owned tool fact for the current run. This does not activate or
* grant a tool; only the host can bind executable authority to the run scope.
*/
function isHostScopedAgentToolActive(toolName) {
	const normalizedName = toolName.trim().toLowerCase();
	return normalizedName.length > 0 && getActiveAgentRingZeroTools().some((tool) => tool.name.trim().toLowerCase() === normalizedName);
}
//#endregion
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
function buildHarnessVisibleReplyGuidance(params) {
	if (messageToolOwnsVisibleReply(params) && params.messageToolAvailable) return "Visible source replies are not automatically delivered for this run. Use `message(action=send)` for user-visible source-channel output. For progress, set `final=false`. Set `final=true`, or omit it, for the completed reply to the current source conversation; OpenClaw stops after confirming delivery. Do not repeat visible message content in your final answer.";
	return params.messageToolAvailable ? "For the current source conversation, reply normally in your final assistant message; OpenClaw will deliver it through the active source conversation. Use `message` for supported non-text actions in the current conversation, such as reacting to its current message. Reserve other `message` actions for explicit out-of-band sends or media/file delivery. Reactions are not delivered automatically." : "For the current source conversation, reply normally in your final assistant message; OpenClaw will deliver it through the active source conversation.";
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
export { buildHarnessVisibleReplyGuidance as a, isHostScopedAgentToolActive as c, resolveLocalModelLeanPreserveToolNames as i, mergeAgentRingZeroTools as l, filterLocalModelLeanTools as n, messageToolOwnsVisibleReply as o, isLocalModelLeanEnabled as r, getActiveAgentRingZeroTools as s, applyLocalModelLeanToolSearchDefaults as t, runWithAgentRingZeroTools as u };
