import { n as decodeNodePtyResumeParams, r as runNodePtyCommand } from "../../node-host-B926ObkZ.js";
import { n as validateClaudeSessionId } from "../../invoke-agent-cli-claude-params-B2EcHmj9.js";
import { t as resolveClaudeTerminalExecutable } from "../../session-catalog-executable-D75E8106.js";
import { o as isResumableClaudeSource } from "../../session-catalog-shared-B8NbCO28.js";
import { t as isExactClaudeSessionCursor } from "../../session-catalog-cursor-NPLrVaSJ.js";
import { o as readLocalClaudeTranscriptPage, r as listLocalClaudeSessionPage } from "../../session-catalog-listing-Cb9fcQ3O.js";
import "../../session-catalog-D6r8_48t.js";
//#region extensions/anthropic/session-catalog-node-commands.ts
const CLAUDE_NODE_LOOKUP_PAGE_LIMIT = 100;
function parseNodeParams(paramsJSON) {
	if (!paramsJSON) return;
	try {
		return JSON.parse(paramsJSON);
	} catch (error) {
		throw new Error("Claude session parameters must be valid JSON", { cause: error });
	}
}
async function requireLocalResumableClaudeSession(threadId) {
	let cursor;
	const seenCursors = /* @__PURE__ */ new Set();
	while (true) {
		const page = await listLocalClaudeSessionPage({
			limit: CLAUDE_NODE_LOOKUP_PAGE_LIMIT,
			...cursor ? { cursor } : {}
		});
		const record = page.sessions.find((candidate) => candidate.threadId === threadId);
		if (record) {
			if (isResumableClaudeSource(record.source)) return record;
			break;
		}
		const nextCursor = page.nextCursor;
		if (nextCursor === void 0 || seenCursors.has(nextCursor)) break;
		if (!isExactClaudeSessionCursor(nextCursor)) throw new Error("Claude session catalog returned an invalid cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
	throw new Error("Claude session cannot be resumed in a terminal");
}
async function listClaudeSessions(paramsJSON) {
	return JSON.stringify(await listLocalClaudeSessionPage(parseNodeParams(paramsJSON)));
}
async function readClaudeSession(paramsJSON) {
	return JSON.stringify(await readLocalClaudeTranscriptPage(parseNodeParams(paramsJSON)));
}
async function resumeClaudeSession(paramsJSON, io) {
	if (!io) throw new Error("Claude terminal command requires duplex transport");
	const params = decodeNodePtyResumeParams(paramsJSON, validateClaudeSessionId);
	const record = await requireLocalResumableClaudeSession(params.threadId);
	const resolution = resolveClaudeTerminalExecutable();
	if (!resolution) throw new Error("Claude CLI is unavailable");
	return JSON.stringify(await runNodePtyCommand({
		file: resolution.executable,
		args: ["--resume", params.threadId],
		cwd: record.cwd,
		...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
		cols: params.cols,
		rows: params.rows
	}, io));
}
//#endregion
export { listClaudeSessions, readClaudeSession, resumeClaudeSession };
