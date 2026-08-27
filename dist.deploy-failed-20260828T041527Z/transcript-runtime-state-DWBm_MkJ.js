import { w as resolveSessionTranscriptRuntimeTarget } from "./session-accessor-fcDZuc2H.js";
import "./sessions-BLpYW515.js";
import { stripCompactionReplayCheckpoint } from "@openclaw/ai/transports";
//#region src/agents/session-raw-append-message.ts
const RAW_APPEND_MESSAGE = Symbol("openclaw.session.rawAppendMessage");
/** Return the unguarded appendMessage implementation for a session manager. */
function getRawSessionAppendMessage(sessionManager) {
	return sessionManager[RAW_APPEND_MESSAGE] ?? sessionManager.appendMessage.bind(sessionManager);
}
/** Stores the unguarded appendMessage implementation on a session manager. */
function setRawSessionAppendMessage(sessionManager, appendMessage) {
	sessionManager[RAW_APPEND_MESSAGE] = appendMessage;
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-rewrite.ts
/** Rewrites transcript entries by branching and re-appending the active suffix. */
function stripStalePrefixReplay(message) {
	return message.role === "assistant" ? stripCompactionReplayCheckpoint(message) : message;
}
function estimateMessageBytes(message) {
	return Buffer.byteLength(JSON.stringify(message), "utf8");
}
function findTranscriptRewriteMatches(branch, replacementsById) {
	const matchedIndices = [];
	let bytesFreed = 0;
	for (const [index, entry] of branch.entries()) {
		if (entry.type !== "message") continue;
		const replacement = replacementsById.get(entry.id);
		if (!replacement) continue;
		const originalBytes = estimateMessageBytes(entry.message);
		const replacementBytes = estimateMessageBytes(replacement);
		matchedIndices.push(index);
		bytesFreed += Math.max(0, originalBytes - replacementBytes);
	}
	return {
		matchedIndices,
		bytesFreed
	};
}
function remapEntryId(entryId, rewrittenEntryIds) {
	if (!entryId) return null;
	return rewrittenEntryIds.get(entryId) ?? entryId;
}
function appendBranchEntry(params) {
	const { sessionManager, entry, rewrittenEntryIds, appendMessage } = params;
	if (entry.type === "message") return appendMessage(stripStalePrefixReplay(entry.message));
	if (entry.type === "compaction") return sessionManager.appendCompaction(entry.summary, remapEntryId(entry.firstKeptEntryId, rewrittenEntryIds) ?? entry.firstKeptEntryId, entry.tokensBefore, entry.details, entry.fromHook);
	if (entry.type === "reset") return sessionManager.appendResetBoundary(entry.reason, entry.firstKeptEntryId ? remapEntryId(entry.firstKeptEntryId, rewrittenEntryIds) ?? entry.firstKeptEntryId : void 0);
	if (entry.type === "thinking_level_change") return sessionManager.appendThinkingLevelChange(entry.thinkingLevel);
	if (entry.type === "model_change") return sessionManager.appendModelChange(entry.provider, entry.modelId);
	if (entry.type === "custom") return sessionManager.appendCustomEntry(entry.customType, entry.data);
	if (entry.type === "custom_message") return sessionManager.appendCustomMessageEntry(entry.customType, entry.content, entry.display, entry.details);
	if (entry.type === "session_info") {
		if (entry.name) return sessionManager.appendSessionInfo(entry.name);
		return sessionManager.appendSessionInfo("");
	}
	if (entry.type === "branch_summary") return sessionManager.branchWithSummary(remapEntryId(entry.parentId, rewrittenEntryIds), entry.summary, entry.details, entry.fromHook);
	return sessionManager.appendLabelChange(remapEntryId(entry.targetId, rewrittenEntryIds) ?? entry.targetId, entry.label);
}
/**
* Safely rewrites transcript message entries on the active branch by branching
* from the first rewritten message's parent and re-appending the suffix.
*/
function rewriteTranscriptEntriesInSessionManager(params) {
	const replacementsById = new Map(params.replacements.filter((replacement) => replacement.entryId.trim().length > 0).map((replacement) => [replacement.entryId, replacement.message]));
	if (replacementsById.size === 0) return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "no replacements requested"
	};
	const branch = params.sessionManager.getBranch();
	if (branch.length === 0) return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "empty session"
	};
	const { matchedIndices, bytesFreed } = findTranscriptRewriteMatches(branch, replacementsById);
	if (matchedIndices.length === 0) return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "no matching message entries"
	};
	const firstMatchedIndex = matchedIndices.at(0);
	const firstMatchedEntry = firstMatchedIndex === void 0 ? void 0 : branch.at(firstMatchedIndex);
	if (!firstMatchedEntry || firstMatchedEntry.type !== "message") return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "invalid first rewrite target"
	};
	if (!firstMatchedEntry.parentId) params.sessionManager.resetLeaf();
	else params.sessionManager.branch(firstMatchedEntry.parentId);
	const appendMessage = getRawSessionAppendMessage(params.sessionManager);
	const rewrittenEntryIds = /* @__PURE__ */ new Map();
	for (const entry of branch.slice(firstMatchedIndex)) {
		const replacement = entry.type === "message" ? replacementsById.get(entry.id) : void 0;
		const newEntryId = replacement === void 0 ? appendBranchEntry({
			sessionManager: params.sessionManager,
			entry,
			rewrittenEntryIds,
			appendMessage
		}) : appendMessage(params.preserveReplacementCompactionReplay ? replacement : stripStalePrefixReplay(replacement));
		rewrittenEntryIds.set(entry.id, newEntryId);
	}
	return {
		changed: true,
		bytesFreed,
		rewrittenEntries: matchedIndices.length
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-runtime-state.ts
/**
* Resolves the runtime transcript target for read/probe operations without
* linking missing file-backed metadata into the session store.
*/
async function resolveRuntimeTranscriptReadTarget(scope) {
	return await resolveSessionTranscriptRuntimeTarget(scope);
}
//#endregion
export { setRawSessionAppendMessage as i, rewriteTranscriptEntriesInSessionManager as n, getRawSessionAppendMessage as r, resolveRuntimeTranscriptReadTarget as t };
