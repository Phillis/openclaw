import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { s as callGateway } from "./call-CZ1eu88h.js";
import { n as extractTextFromChatContent } from "./chat-content-BbLAEXko.js";
import { a as isNativeCommandTurn, s as resolveCommandTurnContext } from "./command-turn-context-CRxhzdEY.js";
import { n as buildSubagentRunReadIndex } from "./subagent-registry-read-DrbEdtLr.js";
import { r as resolveStoredSubagentCapabilities } from "./subagent-capabilities-QWxmiHl_.js";
import { b as looksLikeSessionId, l as resolveInternalSessionKey, u as resolveMainSessionAlias } from "./sessions-helpers-DkT3wqUw.js";
import { r as resolveSubagentTargetFromRuns, t as formatRunLabel } from "./subagents-utils-Bya_9C4V.js";
import { n as sanitizeTextContent } from "./chat-history-text-DJ2UV7io.js";
import { n as commandReply } from "./command-gates-Cn1fPIAB.js";
//#region src/auto-reply/reply/commands-subagents-text.ts
/** Text extraction helpers for subagent command output. */
/** Extracts sanitized display text from a subagent chat message. */
function extractSubagentMessageText(message) {
	const role = typeof message.role === "string" ? message.role : "";
	const shouldSanitize = role === "assistant";
	const text = extractTextFromChatContent(message.content, { sanitizeText: shouldSanitize ? sanitizeTextContent : void 0 });
	return text ? {
		role,
		text
	} : null;
}
//#endregion
//#region src/auto-reply/reply/commands-subagents/shared.ts
const COMMAND = "/subagents";
const COMMAND_FOCUS = "/focus";
const COMMAND_UNFOCUS = "/unfocus";
const COMMAND_AGENTS = "/agents";
const ACTIONS = /* @__PURE__ */ new Set([
	"list",
	"log",
	"info",
	"help"
]);
function stopWithUnknownTargetError(error) {
	return commandReply(`⚠️ ${error ?? "Unknown subagent."}`);
}
function resolveSubagentTarget(runs, token) {
	const readIndex = buildSubagentRunReadIndex();
	return resolveSubagentTargetFromRuns({
		runs,
		token,
		recentWindowMinutes: 30,
		label: (entry) => formatRunLabel(entry),
		aliases: (entry) => entry.taskName ? [entry.taskName] : [],
		isActive: (entry) => !entry.execution.endedAt || Math.max(0, readIndex.countPendingDescendantRuns(entry.childSessionKey)) > 0,
		errors: {
			missingTarget: "Missing subagent id.",
			invalidIndex: (value) => `Invalid subagent index: ${value}`,
			unknownSession: (value) => `Unknown subagent session: ${value}`,
			ambiguousLabel: (value) => `Ambiguous subagent label: ${value}`,
			ambiguousLabelPrefix: (value) => `Ambiguous subagent label prefix: ${value}`,
			ambiguousRunIdPrefix: (value) => `Ambiguous run id prefix: ${value}`,
			unknownTarget: (value) => `Unknown subagent id: ${value}`
		}
	});
}
function resolveSubagentEntryForToken(runs, token) {
	const resolved = resolveSubagentTarget(runs, token);
	if (!resolved.entry) return { reply: stopWithUnknownTargetError(resolved.error) };
	return { entry: resolved.entry };
}
function resolveRequesterSessionKey(params, opts) {
	const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
	const commandSession = normalizeOptionalString(params.sessionKey);
	const raw = opts?.preferCommandTarget ?? isNativeCommandTurn(resolveCommandTurnContext(params.ctx)) ? commandTarget || commandSession : commandSession || commandTarget;
	if (!raw) return;
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	return resolveInternalSessionKey({
		key: raw,
		alias,
		mainKey
	});
}
function resolveCommandSubagentController(params, requesterKey) {
	if (!isSubagentSessionKey(requesterKey)) return {
		controllerSessionKey: requesterKey,
		callerSessionKey: requesterKey,
		callerIsSubagent: false,
		controlScope: "children"
	};
	return {
		controllerSessionKey: requesterKey,
		callerSessionKey: requesterKey,
		callerIsSubagent: true,
		controlScope: resolveStoredSubagentCapabilities(requesterKey, { cfg: params.cfg }).controlScope
	};
}
function resolveHandledPrefix(normalized) {
	return normalized.startsWith(COMMAND) ? COMMAND : normalized.startsWith(COMMAND_FOCUS) ? COMMAND_FOCUS : normalized.startsWith(COMMAND_UNFOCUS) ? COMMAND_UNFOCUS : normalized.startsWith(COMMAND_AGENTS) ? COMMAND_AGENTS : null;
}
function resolveSubagentsAction(params) {
	if (params.handledPrefix === COMMAND) {
		const [actionRaw] = params.restTokens;
		const action = normalizeLowercaseStringOrEmpty(actionRaw) || "list";
		if (!ACTIONS.has(action)) return null;
		params.restTokens.splice(0, 1);
		return action;
	}
	if (params.handledPrefix === COMMAND_FOCUS) return "focus";
	if (params.handledPrefix === COMMAND_UNFOCUS) return "unfocus";
	if (params.handledPrefix === COMMAND_AGENTS) return "agents";
	return null;
}
async function resolveFocusTargetSession(params) {
	const subagentMatch = resolveSubagentTarget(params.runs, params.token);
	if (subagentMatch.entry) {
		const key = subagentMatch.entry.childSessionKey;
		return {
			targetKind: "subagent",
			targetSessionKey: key,
			agentId: parseAgentSessionKey(key)?.agentId ?? "main",
			label: formatRunLabel(subagentMatch.entry)
		};
	}
	const token = params.token.trim();
	if (!token) return null;
	const attempts = [];
	const requesterKey = normalizeOptionalString(params.requesterKey);
	const spawnedBy = requesterKey && isSubagentSessionKey(requesterKey) ? requesterKey : void 0;
	attempts.push({ key: token });
	if (looksLikeSessionId(token)) attempts.push({ sessionId: token });
	attempts.push({ label: token });
	for (const attempt of attempts) try {
		const key = normalizeOptionalString((await callGateway({
			method: "sessions.resolve",
			params: spawnedBy ? {
				...attempt,
				spawnedBy
			} : attempt
		}))?.key) ?? "";
		if (!key) continue;
		const parsed = parseAgentSessionKey(key);
		return {
			targetKind: key.includes(":subagent:") ? "subagent" : "acp",
			targetSessionKey: key,
			agentId: parsed?.agentId ?? "main",
			label: token
		};
	} catch {}
	return null;
}
function buildSubagentsHelp() {
	return [
		"Subagents",
		"Usage:",
		"- /subagents list",
		"- /subagents log <id|#> [limit] [tools]",
		"- /subagents info <id|#>",
		"- /focus <subagent-label|session-key|session-id|session-label>",
		"- /unfocus",
		"- /agents",
		"- /session idle <duration|off>",
		"- /session max-age <duration|off>",
		"",
		"Ids: use the list index (#), runId/session prefix, label, or full session key."
	].join("\n");
}
function formatLogLines(messages) {
	const lines = [];
	for (const msg of messages) {
		const extracted = extractSubagentMessageText(msg);
		if (!extracted) continue;
		const label = extracted.role === "assistant" ? "Assistant" : "User";
		lines.push(`${label}: ${extracted.text}`);
	}
	return lines;
}
//#endregion
export { resolveHandledPrefix as a, resolveSubagentsAction as c, resolveFocusTargetSession as i, formatLogLines as n, resolveRequesterSessionKey as o, resolveCommandSubagentController as r, resolveSubagentEntryForToken as s, buildSubagentsHelp as t };
