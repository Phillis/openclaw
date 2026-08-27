import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { r as resolveAgentMainSessionKey } from "./main-session-er-Gn_t_.js";
//#region src/agents/internal-event-contract.ts
const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
const GENERATED_MEDIA_COMPLETION_SOURCES = /* @__PURE__ */ new Set([
	"image_generation",
	"video_generation",
	"music_generation"
]);
/** Identifies completion events that can resume an exact cron run. */
function hasGeneratedMediaCompletionEvent(events) {
	return Boolean(events?.some((event) => event.type === "task_completion" && GENERATED_MEDIA_COMPLETION_SOURCES.has(event.source)));
}
//#endregion
//#region src/agents/subagents/announce/subagent-requester-store-key.ts
/**
* Subagent requester store-key normalization.
*
* Converts raw requester session keys into the canonical registry key shape.
*/
/** Resolve the canonical store key for a subagent requester session. */
function resolveRequesterStoreKey(cfg, requesterSessionKey, explicitAgentId) {
	const raw = (requesterSessionKey ?? "").trim();
	if (!raw) return raw;
	if (raw === "global" || raw === "unknown") return raw;
	if (raw.startsWith("agent:")) return raw;
	const agentId = resolveSessionAgentId({
		sessionKey: raw,
		config: cfg,
		agentId: explicitAgentId
	});
	const mainKey = normalizeMainKey(cfg?.session?.mainKey);
	if (raw === "main" || raw === mainKey) return cfg.session?.scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	return `agent:${agentId}:${raw}`;
}
//#endregion
export { AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION as n, hasGeneratedMediaCompletionEvent as r, resolveRequesterStoreKey as t };
