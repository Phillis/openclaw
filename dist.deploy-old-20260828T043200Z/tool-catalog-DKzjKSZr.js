import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.js";
//#region src/agents/tool-description-presets.ts
const EXEC_TOOL_DISPLAY_SUMMARY = "Run shell now.";
const PROCESS_TOOL_DISPLAY_SUMMARY = "Inspect/control exec sessions.";
const CRON_TOOL_DISPLAY_SUMMARY = "Schedule reminders, automations, wake events.";
const SESSIONS_LIST_TOOL_DISPLAY_SUMMARY = "List visible sessions; filters/previews.";
const SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY = "Read sanitized session history.";
const SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY = "Search past session transcripts.";
const SESSIONS_SEND_TOOL_DISPLAY_SUMMARY = "Run same-Gateway session/agent.";
const SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY = "Spawn hidden subagent (ephemeral) or visible work session (durable).";
const SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY = "Spawn subagent session.";
const AGENTS_WAIT_TOOL_DISPLAY_SUMMARY = "Wait for collector subagents.";
const SESSION_STATUS_TOOL_DISPLAY_SUMMARY = "Show session status/model/usage.";
const ASK_USER_TOOL_DISPLAY_SUMMARY = "Ask the user and wait for an answer.";
const SUGGEST_TASK_TOOL_DISPLAY_SUMMARY = "Suggest follow-up work for operator approval.";
const DISMISS_TASK_TOOL_DISPLAY_SUMMARY = "Withdraw a pending task suggestion.";
const SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY = "Manage reusable-skill proposals; inspect can select one stored artifact and returns complete content only when it fits the model budget.";
function describeAgentsListTool(sessionsSpawnAvailable) {
	return sessionsSpawnAvailable ? "List configured agent ids with name/model/runtime metadata, allowed as `sessions_spawn(runtime:\"subagent\")` targets." : "List configured agent ids with name/model/runtime metadata that can be used as subagent spawn targets.";
}
function describeAgentsWaitTool(sessionsSpawnAvailable) {
	return `Wait for ${sessionsSpawnAvailable ? "collector subagents started by sessions_spawn collect=true" : "collector subagent runs"}. Accepts many run ids; returns once any completes (completed results incl. structured output, plus pending ids), or on timeoutSeconds.`;
}
const SESSION_VISIBILITY_SCOPE_COPY = {
	self: "current session only",
	tree: "current session + own spawn subtree; the main session sees all sessions of its agent",
	agent: "all sessions of this agent",
	all: "all sessions, cross-agent per tools.agentToAgent"
};
function describeSessionVisibilityScope(visibility, options) {
	if (options?.spawnRestricted && visibility === "tree") return "current session + own spawn subtree (sandbox: spawned sessions only)";
	return SESSION_VISIBILITY_SCOPE_COPY[visibility];
}
function describeSessionLinkRule(base) {
	return `When pointing the user at a session, cite its Control UI URL: main session -> \`${base}/chat/<agentId>\`; any other display session key -> \`${base}/chat/<agentId>/~key/\` + key minus \`agent:<agentId>:\`, with \`:\` replaced by \`/\`.`;
}
/** Describes the sessions_list tool for model-facing instructions. */
function describeSessionsListTool(options) {
	return [
		"List visible sessions and sidebar categories; filter kind/label/agentId/search/activity/archive.",
		"Preview recent messages inline via includeLastMessage/messageLimit; includeDerivedTitles adds derived titles.",
		"Use before history/send target selection.",
		...options?.sessionLinkBase ? [describeSessionLinkRule(options.sessionLinkBase)] : []
	].join(" ");
}
/** Describes the sessions_history tool for model-facing instructions. */
function describeSessionsHistoryTool(options) {
	return [
		"Read sanitized visible-session history.",
		"Before reply/debug/resume. Supports limit, offset, search-result sessionId/messageId anchors, and tool messages.",
		...options?.sessionLinkBase ? [describeSessionLinkRule(options.sessionLinkBase)] : []
	].join(" ");
}
/** Describes the sessions_search tool for model-facing instructions. */
function describeSessionsSearchTool(options) {
	return ["Search your own past sessions for matching user and assistant text.", ...options?.sessionLinkBase ? [describeSessionLinkRule(options.sessionLinkBase)] : []].join(" ");
}
/** Describes the sessions_send tool for model-facing instructions. */
function describeSessionsSendTool() {
	return [
		"Run a visible session on this Gateway by sessionKey/label, or a configured local agent by agentId; sessionKey wins redundant label.",
		"A session identifies model context, not an external address; its reply may still announce through established delivery context.",
		"Thread chats rejected: target parent channel. Missing configured-agent main created. Waits for reply when available; status \"no_reply\" is terminal, so do not wait for an announcement.",
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
		"`agentId` targets a configured agent; `model` overrides its model; `cleanup` delete|keep hidden child session; `sandbox` inherit|require.",
		"`visible=true`: durable visible session. Default for coding, multi-step work, or results user may revisit/steer/keep — not only when a thread is requested. Shows in web UI sidebar; works without UI: completion announces back, progress checkable. `category` explicitly groups it; omission or an empty string leaves it ungrouped. Subagent only; omit `mode` (no `mode=\"run\"`), `thread`, `thinking`, `lightContext`, `attachments`, `attachAs`; inherits the caller tool-policy ceiling; may check out a git worktree via `worktree`/`worktreeName`/`worktreeBaseRef`. When its accepted result includes `sessionUrl`, channel acknowledgements put the session URL on the first line and `Owner: <label>` on the second line.",
		visibilityLine,
		...options?.swarmEnabled ? ["`collect=true` (swarm): parallel fan-out collector children; structured result per `outputSchema`; `groupId` groups a batch."] : [],
		"Inherits parent workspace. Native task arrives as first `[Subagent Task]`.",
		...options?.acpAvailable === false ? [] : ["`runtime=\"acp\"` ids: codex, claude, gemini, opencode, or configured ACP."],
		"Native transcript needed: `context=\"fork\"`; else omit/isolated.",
		"Hidden child: research, parallel/batch reads, throwaway side tasks. Coding, PRs, long builds, anything worth keeping: `visible=true`. No spawn for quick lookup/single read.",
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
/** Describes the ask_user tool and its decision-only use policy. */
function describeAskUserTool() {
	return [
		"Ask the human user 1-3 structured questions and wait for their answer; `multiSelect` allows picking several options and `timeoutSeconds` bounds the wait.",
		"Use only when blocked on a decision genuinely theirs that cannot be resolved from the request, code, or sensible defaults; never ask whether to proceed or confirm a plan.",
		"Ask exactly one question per call unless several answers must be submitted together; one single-select question uses native controls on supported messaging channels.",
		"Put every selectable choice in `options`, never only in the question text. Put the recommended option first and suffix its label with ` (Recommended)`.",
		"Use `multiSelect` only when the user may choose several options at once; otherwise omit it.",
		"Do not include an Other option; free text is added automatically.",
		"If the result is no_answer, continue with best judgment."
	].join(" ");
}
/** Describes the secrets tool and the store semantics the model cannot observe. */
function describeSecretsTool() {
	return [
		"Obtain and manage credentials you never see: `request` asks the human to type a value into a trusted prompt that stores it directly, `list` returns entry metadata, and `delete` removes an entry.",
		"A requested value is never readable back by any action; use `request` when you need a credential you do not have instead of asking for one in conversation, and never repeat a credential a human pasted into chat.",
		"`request` blocks until the human answers, so ask only for a credential the current task actually needs.",
		"Only protected secrets may be requested, and they reach a service through config references or, where the egress proxy is enabled, substitution into outbound requests; plain environment values are set by the operator in Settings or the CLI, never requested here.",
		"List every hostname that will receive the value in `allowedHosts`: a secret with no allowed hosts can never be substituted, so the request silently produces an unusable credential.",
		"`reason` is shown to the human deciding whether to provide the value. Stored entries are referenced elsewhere as {source:\"store\", id:NAME}; if the result is no_answer, continue with best judgment."
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
		id: "secrets",
		label: "secrets",
		description: "Request and manage write-only credentials",
		sectionId: "runtime",
		profiles: ["coding", "messaging"],
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
		id: "github_identity_status",
		label: "github_identity_status",
		description: "Inspect the effective GitHub identity and credential health",
		sectionId: "sessions",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "github_publish",
		label: "github_publish",
		description: "Publish the reconciled session worktree as a draft GitHub pull request",
		sectionId: "sessions",
		profiles: ["coding"],
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
		description: "Use shared operator terminals with policy-governed input",
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
		description: "Accept heartbeat outcomes for post-turn handling",
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
		id: "progress_card",
		label: "progress_card",
		description: "Maintain the session progress card",
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
		description: SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY,
		sectionId: "agents",
		profiles: ["coding"],
		includeInOpenClawGroup: true
	},
	{
		id: "view_image",
		label: "view_image",
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
		tools: CORE_TOOL_DEFINITIONS.filter((tool) => tool.sectionId === section.id && (tool.id !== "agents_wait" || swarmEnabled) && (tool.id !== "github_identity_status" || params?.githubPublicationAvailable !== void 0) && (tool.id !== "github_publish" || params?.githubPublicationAvailable === true)).map((tool) => ({
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
export { describeSessionsSearchTool as A, describeAskUserTool as C, describeSessionVisibilityScope as D, describeSessionStatusTool as E, describeSessionsSpawnTool as M, describeSessionsHistoryTool as O, describeAgentsWaitTool as S, describeSessionLinkRule as T, SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY as _, resolveCoreToolProfilePolicy as a, SUGGEST_TASK_TOOL_DISPLAY_SUMMARY as b, CRON_TOOL_DISPLAY_SUMMARY as c, PROCESS_TOOL_DISPLAY_SUMMARY as d, SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY as f, SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY as g, SESSIONS_SEND_TOOL_DISPLAY_SUMMARY as h, listCoreToolSections as i, describeSessionsSendTool as j, describeSessionsListTool as k, DISMISS_TASK_TOOL_DISPLAY_SUMMARY as l, SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY as m, PROFILE_OPTIONS as n, resolveCoreToolProfiles as o, SESSIONS_LIST_TOOL_DISPLAY_SUMMARY as p, isKnownCoreToolId as r, ASK_USER_TOOL_DISPLAY_SUMMARY as s, CORE_TOOL_GROUPS as t, EXEC_TOOL_DISPLAY_SUMMARY as u, SESSION_STATUS_TOOL_DISPLAY_SUMMARY as v, describeSecretsTool as w, describeAgentsListTool as x, SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY as y };
