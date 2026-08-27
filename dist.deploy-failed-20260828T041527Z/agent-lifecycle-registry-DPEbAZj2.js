import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { Xt as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-kmBThqu6.js";
import { a as completeAgentDeletionJournal, c as removeAgentDeletionJournal, f as readAgentProvenance, i as claimCompletedAgentDeletionJournal, l as updateAgentDeletionJournalCleanupPaths, r as beginAgentDeletionJournal, s as readAgentDeletionJournal, u as updateAgentDeletionJournalDatabasePaths } from "./agent-deletion-journal-C1nSMR13.js";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
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
/** Captures the exact durable incarnation of an existing, deletion-safe agent. */
function captureAgentLifecycleBinding(config, agentId, options = {}) {
	const id = normalizeAgentId(agentId);
	if (!resolveAgentConfig(config, id) || isAgentDeletionBlocked(id, options)) return;
	return Object.freeze({
		agentId: id,
		provenance: readAgentProvenance(id, options) ?? null
	});
}
/** Revalidates an agent binding against both the roster and lifecycle owner. */
function matchesAgentLifecycleBinding(config, binding, options = {}) {
	const id = normalizeAgentId(binding.agentId);
	return id === binding.agentId && Boolean(resolveAgentConfig(config, id)) && !isAgentDeletionBlocked(id, options) && isDeepStrictEqual(readAgentProvenance(id, options) ?? null, binding.provenance);
}
//#endregion
export { claimCompletedAgentDeletion as a, captureAgentLifecycleBinding as i, AgentDeletionCommitUncertainError as n, isAgentDeletionBlocked as o, beginAgentDeletion as r, matchesAgentLifecycleBinding as s, AgentDeletionAuthorityRollbackError as t };
