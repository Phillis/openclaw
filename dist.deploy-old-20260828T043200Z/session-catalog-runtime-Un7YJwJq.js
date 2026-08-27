import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-1slENmfx.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./command-auth-native-CoWIkJNh.js";
import { u as listSessionCatalogEntries } from "./session-catalog-DtAkh1F2.js";
import { t as CLAUDE_CLI_BACKEND_ID, u as CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS } from "./cli-constants-Djv4WtLq.js";
import { r as adoptedSourceKey, t as CLAUDE_LOCAL_SESSION_HOST_ID } from "./session-catalog-adoption-C3d_naEs.js";
//#region extensions/anthropic/session-catalog-runtime.ts
function currentClaudeSessionCatalogConfig(api) {
	return api.runtime.config?.current?.() ?? api.config ?? {};
}
function boundClaudeSource(pluginId, entry) {
	const anthropic = isRecord(entry.pluginExtensions) ? entry.pluginExtensions.anthropic : void 0;
	const marker = isRecord(anthropic) ? anthropic.sessionCatalog : void 0;
	const hostId = isRecord(marker) && typeof marker.sourceHostId === "string" ? marker.sourceHostId : entry.execHost === "node" && typeof entry.execNode === "string" && entry.execNode.trim() ? `node:${entry.execNode.trim()}` : CLAUDE_LOCAL_SESSION_HOST_ID;
	const binding = (isRecord(entry.cliSessionBindings) ? entry.cliSessionBindings : void 0)?.[CLAUDE_CLI_BACKEND_ID];
	if (isRecord(binding) && typeof binding.sessionId === "string" && binding.sessionId) return {
		hostId,
		threadId: binding.sessionId
	};
	if (entry.pluginOwnerId !== pluginId || entry.modelSelectionLocked !== true) return;
	return isRecord(marker) && typeof marker.sourceThreadId === "string" ? {
		hostId,
		threadId: marker.sourceThreadId
	} : void 0;
}
function listBoundClaudeSessions(api, agentId, sessionEntries) {
	const config = currentClaudeSessionCatalogConfig(api);
	const bound = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry } of listSessionCatalogEntries({
		agentId,
		config,
		runtime: api.runtime,
		sessionEntries
	})) {
		const source = boundClaudeSource(api.id, entry);
		if (source) bound.set(adoptedSourceKey(source.hostId, source.threadId), sessionKey);
	}
	return bound;
}
/**
* Resolve the Claude model an agent actually routes to the Claude CLI backend.
* Callers must not assume the current default is routed: existing configs pin
* older Claude models, and stamping the default onto their sessions would
* select a model the operator never routed or allowed.
*/
function resolveClaudeCliRoutedModelId(config, agentId) {
	return CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS.find((modelId) => resolveEffectiveAgentRuntime({
		cfg: config,
		provider: "anthropic",
		modelId,
		agentId
	}) === CLAUDE_CLI_BACKEND_ID);
}
//#endregion
export { listBoundClaudeSessions as n, resolveClaudeCliRoutedModelId as r, currentClaudeSessionCatalogConfig as t };
