import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { a as completeAgentDeletionJournal, c as removeAgentDeletionJournal, i as claimCompletedAgentDeletionJournal, l as updateAgentDeletionJournalCleanupPaths, r as beginAgentDeletionJournal, s as readAgentDeletionJournal, u as updateAgentDeletionJournalDatabasePaths } from "./agent-deletion-journal-CuS0p_kP.js";
import crypto from "node:crypto";
import path from "node:path";
//#region src/agents/agent-lifecycle-registry.ts
const agentLifecycle = resolveGlobalMap(Symbol.for("openclaw.agentLifecycle"), "close-and-restart");
var AgentDeletionAuthorityRollbackError = class extends AggregateError {};
var AgentDeletionCommitUncertainError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
	}
};
function lifecycleKey(agentId, options) {
	return `${path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env))}\0${agentId}`;
}
/** Fence authority producers while an agent deletion is pending or committed. */
function beginAgentDeletion(entry, options = {}) {
	const id = normalizeAgentId(entry.agentId);
	const key = lifecycleKey(id, options);
	const operationId = crypto.randomUUID();
	const journal = beginAgentDeletionJournal({
		...entry,
		agentId: id,
		operationId,
		deleteFiles: entry.deleteFiles !== false
	}, options);
	agentLifecycle.set(key, "deleting");
	return {
		entry: journal,
		commit: () => agentLifecycle.set(key, "deleted"),
		fenceDatabasePaths: (paths) => {
			if (!updateAgentDeletionJournalDatabasePaths(id, operationId, paths, options)) throw new Error(`Failed to fence database cleanup paths for agent ${id}.`);
			journal.databasePaths = [...new Set(paths.map((entryPath) => path.resolve(entryPath)))];
		},
		fenceCleanupPaths: (paths) => {
			if (!updateAgentDeletionJournalCleanupPaths(id, operationId, paths, options)) throw new Error(`Failed to fence cleanup paths for agent ${id}.`);
			journal.cleanupPaths = [...paths];
		},
		finish: () => {
			if (completeAgentDeletionJournal(id, operationId, options)) agentLifecycle.set(key, "deleted");
		},
		rollback: () => {
			if (removeAgentDeletionJournal(id, operationId, options)) agentLifecycle.delete(key);
		}
	};
}
/** Atomically claim a completed deletion tombstone for a newly created identity. */
function claimCompletedAgentDeletion(agentId, operationId, options = {}) {
	const id = normalizeAgentId(agentId);
	const removed = claimCompletedAgentDeletionJournal(id, operationId, options);
	if (removed) agentLifecycle.delete(lifecycleKey(id, options));
	return removed;
}
/** Return whether this process must refuse new authority for an agent id. */
function isAgentDeletionBlocked(agentId, options = {}) {
	const id = normalizeAgentId(agentId);
	const key = lifecycleKey(id, options);
	const journal = readAgentDeletionJournal(id, options);
	if (!journal) agentLifecycle.delete(key);
	return Boolean(journal);
}
//#endregion
export { isAgentDeletionBlocked as a, claimCompletedAgentDeletion as i, AgentDeletionCommitUncertainError as n, beginAgentDeletion as r, AgentDeletionAuthorityRollbackError as t };
