import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { a as buildAgentMainSessionKey } from "./session-key-D8GLfPr_.js";
import { Zt as loadExactSessionEntryReadOnly } from "./session-accessor-CIiPoGwM.js";
import { s as listAmbientGroupWatchTargets } from "./session-state-events-DTKQ6kKc.js";
import { P as deriveSessionTitle } from "./session-utils-row-xwseApeF.js";
import "./session-utils-DvNvk7rk.js";
import { t as sanitizeForPromptLiteral } from "./sanitize-for-prompt-Bz_9VqrX.js";
import { s as resolveSandboxSessionToolsVisibility } from "./session-visibility-Dylhk5vA.js";
//#region src/agents/skill-workshop-prompt.ts
/**
* System-prompt contribution for routing durable skill edits through the
* Skill Workshop tool instead of direct filesystem writes.
*/
const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop routing rules. */
function buildSkillWorkshopPromptSection() {
	return [
		"## Skill Workshop",
		"Durable reusable skill/playbook/workflow work: `skill_workshop`; never write proposal/skill files directly.",
		"Used skill proved wrong or incomplete: call `skill_workshop` read, then patch it now; the configured autonomous mode disables repair, leaves it pending, or applies it immediately. Capture only durable, evidenced procedure changes—never task artifacts, transient failures, or unresolved guesses.",
		"Other generated work = pending proposal. Apply/reject/quarantine only explicit user ask.",
		"proposal_content = complete final skill body, never plan/diff; update/revise preserves unchanged content.",
		""
	];
}
//#endregion
//#region src/agents/watched-sessions-prompt.ts
/**
* Prepares the Watched Sessions system-prompt section (openclaw#114797).
*
* Ambient group watches make same-agent group sessions readable from the main
* session, but the model only acts on that when the prompt names them. Prepare
* runs before synchronous prompt assembly, mirroring prepareAgentMemoryPrompt.
*/
const WATCHED_SESSIONS_PROMPT_LIMIT = 20;
const WATCHED_SESSION_TITLE_MAX_CHARS = 80;
const WATCHED_SESSION_READ_TOOLS = ["sessions_history", "sessions_search"];
/** Resolve watched same-agent group sessions for the current session's prompt. */
function prepareWatchedSessionsPrompt(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!params.enabled || !sessionKey) return;
	const parsedKey = parseAgentSessionKey(sessionKey);
	if (!parsedKey || buildAgentMainSessionKey({ agentId: parsedKey.agentId }) !== sessionKey) return;
	if (params.sandboxed && resolveSandboxSessionToolsVisibility(params.config ?? {}) === "spawned") return;
	const availableTools = new Set([...params.toolNames, ...params.capabilityToolNames ?? []].map((tool) => tool.trim().toLowerCase()).filter(Boolean));
	const readToolNames = WATCHED_SESSION_READ_TOOLS.filter((tool) => availableTools.has(tool));
	if (readToolNames.length === 0) return;
	const targets = [...listAmbientGroupWatchTargets(sessionKey)].toSorted();
	if (targets.length === 0) return;
	const sessions = targets.slice(0, WATCHED_SESSIONS_PROMPT_LIMIT).map((key) => {
		const row = { key };
		const entry = loadExactSessionEntryReadOnly({
			sessionKey: key,
			clone: false
		})?.entry;
		const title = deriveSessionTitle(entry);
		if (title) row.title = truncateUtf16Safe(title, WATCHED_SESSION_TITLE_MAX_CHARS);
		return row;
	});
	return {
		sessions,
		hiddenCount: targets.length - sessions.length,
		readToolNames,
		listToolAvailable: availableTools.has("sessions_list")
	};
}
/** Renders the shared Watched Sessions block used by every prompt-assembly surface. */
function buildWatchedSessionsPromptLines(prepared) {
	if (!prepared || prepared.sessions.length === 0) return [];
	const listHint = prepared.listToolAvailable ? "; rows appear in sessions_list" : "";
	return [
		"## Watched Sessions",
		`Group/topic sessions this session ambiently watches. Readable now (read-only) via ${prepared.readToolNames.join("/")}${listHint}.`,
		...prepared.sessions.map((session) => {
			const title = session.title ? ` — ${sanitizeForPromptLiteral(session.title)}` : "";
			return `- ${sanitizeForPromptLiteral(session.key)}${title}`;
		}),
		...prepared.hiddenCount > 0 ? [prepared.listToolAvailable ? `(+${prepared.hiddenCount} more: sessions_list kinds=["group"].)` : `(+${prepared.hiddenCount} more.)`] : [],
		""
	];
}
//#endregion
export { buildSkillWorkshopPromptSection as i, prepareWatchedSessionsPrompt as n, SKILL_WORKSHOP_TOOL_NAME as r, buildWatchedSessionsPromptLines as t };
