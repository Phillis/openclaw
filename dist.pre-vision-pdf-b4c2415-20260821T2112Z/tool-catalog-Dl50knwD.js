import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-CYqaxHxr.js";
//#region src/agents/tool-description-presets.ts
const EXEC_TOOL_DISPLAY_SUMMARY = "Run shell now.";
const PROCESS_TOOL_DISPLAY_SUMMARY = "Inspect/control exec sessions.";
const CRON_TOOL_DISPLAY_SUMMARY = "Schedule reminders, automations, wake events.";
const SESSIONS_LIST_TOOL_DISPLAY_SUMMARY = "List visible sessions; filters/previews.";
const SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY = "Read sanitized session history.";
const SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY = "Search past session transcripts.";
const SESSIONS_SEND_TOOL_DISPLAY_SUMMARY = "Run same-Gateway session/agent.";
const SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY = "Spawn subagent or ACP session.";
const SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY = "Spawn subagent session.";
const AGENTS_WAIT_TOOL_DISPLAY_SUMMARY = "Wait for collector subagents.";
const SESSION_STATUS_TOOL_DISPLAY_SUMMARY = "Show session status/model/usage.";
const UPDATE_PLAN_TOOL_DISPLAY_SUMMARY = "Track short work plan.";
const ASK_USER_TOOL_DISPLAY_SUMMARY = "Ask the user and wait for an answer.";
const SUGGEST_TASK_TOOL_DISPLAY_SUMMARY = "Suggest follow-up work for operator approval.";
const DISMISS_TASK_TOOL_DISPLAY_SUMMARY = "Withdraw a pending task suggestion.";
const SESSION_VISIBILITY_SCOPE_COPY = {
	self: "current session only",
	tree: "current session + own spawn subtree; reads also cover any watched same-agent group sessions",
	agent: "all sessions of this agent",
	all: "all sessions, cross-agent per tools.agentToAgent"
};
function describeSessionVisibilityScope(visibility, options) {
	if (options?.spawnRestricted && visibility === "tree") return "current session + own spawn subtree (sandbox: spawned sessions only)";
	return SESSION_VISIBILITY_SCOPE_COPY[visibility];
}
/** Describes the sessions_list tool for model-facing instructions. */
function describeSessionsListTool() {
	return [
		"List visible sessions; filter kind/label/agentId/search/activity/archive.",
		"Preview recent messages inline via includeLastMessage/messageLimit; includeDerivedTitles adds derived titles.",
		"Use before history/send target selection."
	].join(" ");
}
/** Describes the sessions_history tool for model-facing instructions. */
function describeSessionsHistoryTool() {
	return ["Read sanitized visible-session history.", "Before reply/debug/resume. Supports limit, offset, search-result sessionId/messageId anchors, and tool messages."].join(" ");
}
/** Describes the sessions_search tool for model-facing instructions. */
function describeSessionsSearchTool() {
	return ["Search your own past sessions for matching user and assistant text.", "Follow up with sessions_history using a returned sessionKey, sessionId, and messageId for neighboring context."].join(" ");
}
/** Describes the sessions_send tool for model-facing instructions. */
function describeSessionsSendTool() {
	return [
		"Run a visible session on this Gateway by sessionKey/label, or a configured local agent by agentId; sessionKey wins redundant label.",
		"A session identifies model context, not an external address; its reply may still announce through established delivery context.",
		"For an exact external destination, use `conversations_list` plus `conversations_send`/`conversations_turn`, or `message` with an explicit channel and target.",
		"Thread chats rejected: target parent channel. Missing configured-agent main created. Waits for reply when available.",
		"watch:true: notice arrives when others later change target session."
	].join(" ");
}
/** Describes the sessions_spawn tool for model-facing instructions. */
function describeSessionsSpawnTool(options) {
	const visibilityLine = options?.sessionToolsVisibility ? `Session listing/addressing obeys \`tools.sessions.visibility\` (${options.sessionToolsVisibility}: ${describeSessionVisibilityScope(options.sessionToolsVisibility, { spawnRestricted: options.spawnRestricted })}).` : `Session listing/addressing obeys \`tools.sessions.visibility\` (\`tree\` default: ${describeSessionVisibilityScope("tree")}).`;
	const runtimeDescription = options?.acpAvailable === false ? "Spawn clean child; default `runtime=\"subagent\"`." : "Spawn clean child; default `runtime=\"subagent\"`; ACP needs explicit `runtime=\"acp\"`.";
	const sessionCompletionGuidance = options?.acpAvailable === false ? "After spawn, do non-overlap work. Run result returns; session output stays thread." : "After spawn, do non-overlap work. Run result returns; session output stays thread unless ACP `streamTo=\"parent\"`.";
	const completionGuidance = options?.threadAvailable ? sessionCompletionGuidance : "After spawn, do non-overlap work while run result returns.";
	return [
		runtimeDescription,
		options?.threadAvailable ? "`mode=\"run\"` one-shot; `mode=\"session\"` persistent/thread-bound only on supporting requester channel." : "`mode=\"run\"` one-shot background.",
		"`agentId` targets a configured agent (see agents_list); `model` overrides its model; `cleanup` delete|keep hidden child session; `sandbox` inherit|require.",
		"`visible=true`: persistent sidebar dashboard session; use when the user asks to create/open a thread; subagent only; omit `mode` (no `mode=\"run\"`), `thread`, `thinking`, `lightContext`, `attachments`, `attachAs`; inherits the caller tool-policy ceiling; may check out a git worktree via `worktree`/`worktreeName`/`worktreeBaseRef`.",
		visibilityLine,
		...options?.swarmEnabled ? ["`collect=true` (swarm): parallel fan-out collector children; structured result per `outputSchema`; `groupId` groups a batch; await with agents_wait."] : [],
		"Inherits parent workspace. Native task arrives as first `[Subagent Task]`.",
		...options?.acpAvailable === false ? [] : ["`runtime=\"acp\"` ids: codex, claude, gemini, opencode, or configured ACP."],
		"Native transcript needed: `context=\"fork\"`; else omit/isolated.",
		"Use fresh child for sidecar/parallel batch reads, multi-step search, data collection; avoid quick lookup/single read unless policy prefers.",
		completionGuidance
	].join(" ");
}
/** Describes the session_status tool for model-facing instructions. */
function describeSessionStatusTool() {
	return [
		"Show visible-session model/usage/time/cost/tasks.",
		"`sessionKey=\"current\"` for current; UI labels are not keys.",
		"`model` overrides; `model=default` resets. Use for active model/session questions."
	].join(" ");
}
/** Describes the update_plan tool for model-facing instructions. */
function describeUpdatePlanTool() {
	return "Maintain a user-visible work plan: ordered steps, each pending/in_progress/completed. Use for multi-step work. Send the full list each call; keep statuses current and exactly one `in_progress` until done.";
}
/** Describes the ask_user tool and its decision-only use policy. */
function describeAskUserTool() {
	return [
		"Ask the human user 1-3 structured questions and wait for their answer; `multiSelect` allows picking several options and `timeoutSeconds` bounds the wait.",
		"Use only when blocked on a decision genuinely theirs that cannot be resolved from the request, code, or sensible defaults; never ask whether to proceed or confirm a plan.",
		"Prefer one question. Put the recommended option first and suffix its label with ` (Recommended)`.",
		"Do not include an Other option; free text is added automatically.",
		"If the result is no_answer, continue with best judgment."
	].join(" ");
}
//#endregion
//#region src/agents/tool-catalog.ts
/**
* Core tool catalog and profile defaults.
* Drives built-in profile allowlists, group expansion, and UI section metadata
* for OpenClaw-owned tools.
*
* This module is bundled into the Control UI via tool-policy-shared. Keep it
* pure data + tiny pure functions: a value import of server config/runtime
* modules here drags the whole gateway graph into the ui build and breaks it.
*/
const CORE_TOOL_SECTION_ORDER = [
	{
		id: "fs",
		label: "Files"
	},
	{
		id: "runtime",
		label: "Runtime"
	},
	{
		id: "web",
		label: "Web"
	},
	{
		id: "memory",
		label: "Memory"
	},
	{
		id: "sessions",
		label: "Sessions"
	},
	{
		id: "ui",
		label: "UI"
	},
	{
		id: "messaging",
		label: "Messaging"
	},
	{
		id: "automation",
		label: "Automation"
	},
	{
		id: "nodes",
		label: "Nodes"
	},
	{
		id: "agents",
		label: "Agents"
	},
	{
		id: "media",
		label: "Media"
	}
];
const CORE_TOOL_DEFINITIONS = [
	{
		id: "read",
		label: "read",
		description: "Read file contents",
		sectionId: "fs",
		profiles: ["coding"]
	},
	{
		id: "write",
		label: "write",
		description: "Create or overwrite files",
		sectionId: "fs",
		profiles: ["coding"]
	},
	{
		id: "edit",
		label: "edit",
		description: "Make precise edits",
		sectionId: "fs",
		profiles: ["coding"]
	},
	{
		id: "apply_patch",
		label: "apply_patch",
		description: "Patch files",
		sectionId: "fs",
		profiles: ["coding"]
	},
	{
		id: "exec",
		label: "exec",
		description: EXEC_TOOL_DISPLAY_SUMMARY,
		sectionId: "runtime",
		profiles: ["coding"]
	},
	{
		id: "process",
		label: "process",
		description: PROCESS_TOOL_DISPLAY_SUMMARY,
		sectionId: "runtime",
		profiles: ["coding"]
	},
	{
		id: "code_execution",
		label: "code_execution",
		description: "Run sandboxed remote analysis",
		sectionId: "runtime",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "web_search",
		label: "web_search",
		description: "Search the web",
		sectionId: "web",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "web_fetch",
		label: "web_fetch",
		description: "Fetch web content",
		sectionId: "web",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "x_search",
		label: "x_search",
		description: "Search X posts",
		sectionId: "web",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "memory_search",
		label: "memory_search",
		description: "Semantic search",
		sectionId: "memory",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "memory_get",
		label: "memory_get",
		description: "Read memory files",
		sectionId: "memory",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions",
		label: "sessions",
		description: "Session settings: label, pin, archive, groups",
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions_list",
		label: "sessions_list",
		description: SESSIONS_LIST_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions_history",
		label: "sessions_history",
		description: SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions_search",
		label: "sessions_search",
		description: SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "conversations_list",
		label: "conversations_list",
		description: "List exact external conversation addresses",
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "conversations_send",
		label: "conversations_send",
		description: "Send to an exact external conversation",
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "conversations_turn",
		label: "conversations_turn",
		description: "Send and wait for a correlated external reply",
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions_send",
		label: "sessions_send",
		description: SESSIONS_SEND_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions_spawn",
		label: "sessions_spawn",
		description: SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "agents_wait",
		label: "agents_wait",
		description: AGENTS_WAIT_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "sessions_yield",
		label: "sessions_yield",
		description: "End turn to receive sub-agent results",
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "subagents",
		label: "subagents",
		description: "Background work: subagents, media gen, automation runs. list/cancel.",
		sectionId: "sessions",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "session_status",
		label: "session_status",
		description: SESSION_STATUS_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: [
			"minimal",
			"coding",
			"messaging"
		],
		includeInOpenClawGroup: true
	},
	{
		id: "suggest_task",
		label: "suggest_task",
		description: SUGGEST_TASK_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "dismiss_task",
		label: "dismiss_task",
		description: DISMISS_TASK_TOOL_DISPLAY_SUMMARY,
		sectionId: "sessions",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "browser",
		label: "browser",
		description: "Control web browser",
		sectionId: "ui",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "screen",
		label: "screen",
		description: "Drive operator web UI",
		sectionId: "ui",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "dashboard",
		label: "dashboard",
		description: "Read and arrange the session dashboard",
		sectionId: "ui",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "terminal",
		label: "terminal",
		description: "Own visible gateway terminal",
		sectionId: "ui",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "portal",
		label: "portal",
		description: "Expose local web apps through the gateway",
		sectionId: "ui",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "canvas",
		label: "canvas",
		description: "Control node Canvas surfaces when the Canvas plugin is enabled",
		sectionId: "ui",
		profiles: []
	},
	{
		id: "show_widget",
		label: "show_widget",
		description: "Show an interactive widget on chat or an auto-fitting dashboard",
		sectionId: "ui",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "message",
		label: "message",
		description: "Send messages",
		sectionId: "messaging",
		profiles: ["messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "heartbeat_respond",
		label: "heartbeat_respond",
		description: "Record heartbeat outcomes",
		sectionId: "automation",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: AUTOMATIONS_TOOL_NAME,
		label: AUTOMATIONS_TOOL_NAME,
		description: CRON_TOOL_DISPLAY_SUMMARY,
		sectionId: "automation",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "gateway",
		label: "gateway",
		description: "Read Gateway config and schema",
		sectionId: "automation",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "nodes",
		label: "nodes",
		description: "Nodes + devices",
		sectionId: "nodes",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "computer",
		label: "computer",
		description: "Control a paired computer node desktop",
		sectionId: "nodes",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "mobile_ui",
		label: "mobile_ui",
		description: "Observe and control a paired Android app",
		sectionId: "nodes",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "agents_list",
		label: "agents_list",
		description: "List agents",
		sectionId: "agents",
		profiles: [],
		includeInOpenClawGroup: true
	},
	{
		id: "get_goal",
		label: "get_goal",
		description: "Get current thread goal",
		sectionId: "agents",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "create_goal",
		label: "create_goal",
		description: "Create a thread goal",
		sectionId: "agents",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "update_goal",
		label: "update_goal",
		description: "Complete or block a thread goal",
		sectionId: "agents",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "update_plan",
		label: "update_plan",
		description: UPDATE_PLAN_TOOL_DISPLAY_SUMMARY,
		sectionId: "agents",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "ask_user",
		label: "ask_user",
		description: ASK_USER_TOOL_DISPLAY_SUMMARY,
		sectionId: "agents",
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	},
	{
		id: "skill_workshop",
		label: "skill_workshop",
		description: "Create, update, revise, list, inspect, apply, reject, or quarantine Skill Workshop proposals",
		sectionId: "agents",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "image",
		label: "image",
		description: "Image understanding",
		sectionId: "media",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "image_generate",
		label: "image_generate",
		description: "Image generation",
		sectionId: "media",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "music_generate",
		label: "music_generate",
		description: "Music generation",
		sectionId: "media",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "video_generate",
		label: "video_generate",
		description: "Video generation",
		sectionId: "media",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "tts",
		label: "tts",
		description: "Text-to-speech conversion",
		sectionId: "media",
		profiles: [],
		includeInOpenClawGroup: true
	}
];
const CORE_TOOL_BY_ID = new Map(CORE_TOOL_DEFINITIONS.map((tool) => [tool.id, tool]));
function listCoreToolIdsForProfile(profile) {
	return CORE_TOOL_DEFINITIONS.filter((tool) => tool.profiles.includes(profile)).map((tool) => tool.id);
}
const CORE_TOOL_PROFILES = {
	minimal: { allow: listCoreToolIdsForProfile("minimal") },
	coding: { allow: [...listCoreToolIdsForProfile("coding"), "bundle-mcp"] },
	messaging: { allow: [...listCoreToolIdsForProfile("messaging"), "bundle-mcp"] },
	full: { allow: ["*"] }
};
function buildCoreToolGroupMap() {
	const sectionToolMap = /* @__PURE__ */ new Map();
	for (const tool of CORE_TOOL_DEFINITIONS) {
		const groupId = `group:${tool.sectionId}`;
		const list = sectionToolMap.get(groupId) ?? [];
		list.push(tool.id);
		sectionToolMap.set(groupId, list);
	}
	return {
		"group:openclaw": CORE_TOOL_DEFINITIONS.filter((tool) => tool.includeInOpenClawGroup).map((tool) => tool.id),
		...Object.fromEntries(sectionToolMap.entries())
	};
}
/** Built-in core tool groups keyed by group id. */
const CORE_TOOL_GROUPS = buildCoreToolGroupMap();
/** Profile options shown in model/tool configuration UIs. */
const PROFILE_OPTIONS = [
	{
		id: "minimal",
		label: "Minimal"
	},
	{
		id: "coding",
		label: "Coding"
	},
	{
		id: "messaging",
		label: "Messaging"
	},
	{
		id: "full",
		label: "Full"
	}
];
/** Resolves the allow/deny policy for a built-in tool profile. */
function resolveCoreToolProfilePolicy(profile) {
	if (!profile) return;
	const resolved = CORE_TOOL_PROFILES[profile];
	if (!resolved) return;
	if (!resolved.allow && !resolved.deny) return;
	return {
		allow: resolved.allow ? [...resolved.allow] : void 0,
		deny: resolved.deny ? [...resolved.deny] : void 0
	};
}
/** Lists core tools grouped into UI sections. */
function listCoreToolSections(params) {
	const swarmEnabled = params?.swarmEnabled === true;
	return CORE_TOOL_SECTION_ORDER.map((section) => ({
		id: section.id,
		label: section.label,
		tools: CORE_TOOL_DEFINITIONS.filter((tool) => tool.sectionId === section.id && (tool.id !== "agents_wait" || swarmEnabled)).map((tool) => ({
			id: tool.id,
			label: tool.label,
			description: tool.description
		}))
	})).filter((section) => section.tools.length > 0);
}
/** Lists built-in profile ids that include a core tool. */
function resolveCoreToolProfiles(toolId) {
	const tool = CORE_TOOL_BY_ID.get(toolId);
	if (!tool) return [];
	return [...tool.profiles];
}
/** Returns true when a tool id is a known core tool. */
function isKnownCoreToolId(toolId) {
	return CORE_TOOL_BY_ID.has(toolId);
}
//#endregion
export { describeSessionVisibilityScope as C, describeSessionsSendTool as D, describeSessionsSearchTool as E, describeSessionsSpawnTool as O, describeSessionStatusTool as S, describeSessionsListTool as T, SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY as _, resolveCoreToolProfilePolicy as a, UPDATE_PLAN_TOOL_DISPLAY_SUMMARY as b, CRON_TOOL_DISPLAY_SUMMARY as c, PROCESS_TOOL_DISPLAY_SUMMARY as d, SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY as f, SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY as g, SESSIONS_SEND_TOOL_DISPLAY_SUMMARY as h, listCoreToolSections as i, describeUpdatePlanTool as k, DISMISS_TASK_TOOL_DISPLAY_SUMMARY as l, SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY as m, PROFILE_OPTIONS as n, resolveCoreToolProfiles as o, SESSIONS_LIST_TOOL_DISPLAY_SUMMARY as p, isKnownCoreToolId as r, ASK_USER_TOOL_DISPLAY_SUMMARY as s, CORE_TOOL_GROUPS as t, EXEC_TOOL_DISPLAY_SUMMARY as u, SESSION_STATUS_TOOL_DISPLAY_SUMMARY as v, describeSessionsHistoryTool as w, describeAskUserTool as x, SUGGEST_TASK_TOOL_DISPLAY_SUMMARY as y };
