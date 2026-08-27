import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import { n as isCwdBoundHashedArgPattern } from "./exec-command-resolution-CJ9Vm03p.js";
import { s as readAgentDeletionJournal } from "./agent-deletion-journal-BpQsagX8.js";
import { c as resolveExecApprovalsPath, i as generateToken, l as resolveExecApprovalsSocketPath, o as normalizeExecApprovalsInternal, r as createFailClosedExecApprovalsFallback, s as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-_UJgdeLU.js";
import { n as AgentDeletionCommitUncertainError, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-D1dm9wFG.js";
import { c as snapshotFromExecApprovalsRow, i as deleteExecApprovalsConfigRow, l as writeExecApprovalsConfigRow, n as assertExecApprovalsMutationAllowed, o as readExecApprovalsConfigRow, r as assertExecApprovalsMutationAuthority, s as serializeExecApprovals, t as ExecApprovalsMutationFencedError } from "./exec-approvals-sqlite-DwEMj6ui.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/exec-approvals-migration-gate.ts
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const legacyAbsenceCache = /* @__PURE__ */ new Set();
/**
* Doctor repairs whichever state directory its own environment resolves to, so a bare
* `openclaw doctor --fix` repairs the default root while a scoped install stays blocked.
* Name the directory whenever this process is scoped to a non-default one. Say it in
* prose rather than as a `VAR=value cmd` one-liner, which no Windows shell accepts.
*/
function doctorFixInstruction(filePath) {
	const command = "Run `openclaw doctor --fix`";
	return process.env.OPENCLAW_STATE_DIR?.trim() ? `${command} with OPENCLAW_STATE_DIR set to ${path.dirname(filePath)}` : command;
}
var ExecApprovalsMigrationRequiredError = class extends Error {
	constructor(filePath) {
		super(`Legacy exec approvals exist at ${filePath}. ${doctorFixInstruction(filePath)} before using exec approvals.`);
		this.name = "ExecApprovalsMigrationRequiredError";
	}
};
function pathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
/** Refuse runtime access until Doctor owns the one-time legacy import. */
function assertNoPendingLegacyExecApprovals(options = {}) {
	const sourcePath = resolveExecApprovalsPath();
	if (legacyAbsenceCache.has(sourcePath)) return;
	const probe = options.pathMayExist ?? pathMayExist;
	const sourceBefore = probe(sourcePath);
	const claim = probe(`${sourcePath}${DOCTOR_CLAIM_SUFFIX}`);
	const sourceAfter = probe(sourcePath);
	if (sourceBefore || claim || sourceAfter) throw new ExecApprovalsMigrationRequiredError(sourcePath);
	legacyAbsenceCache.add(sourcePath);
}
function resetExecApprovalsMigrationGateForTest() {
	legacyAbsenceCache.clear();
}
//#endregion
//#region src/infra/exec-approvals-store.ts
const log = createSubsystemLogger("infra/exec-approvals");
const WARN_INTERVAL_MS = 6e4;
let lastWarnAt;
var ExecApprovalsStoreUnavailableError = class extends Error {
	constructor(cause) {
		super(`Exec approvals SQLite state is unavailable: ${String(cause)}`, { cause });
		this.name = "ExecApprovalsStoreUnavailableError";
	}
};
function warnFailClosed(message, error) {
	const now = Date.now();
	if (lastWarnAt !== void 0 && now - lastWarnAt < WARN_INTERVAL_MS) return;
	lastWarnAt = now;
	if (error === void 0) log.warn(message);
	else log.warn(message, { error: formatErrorMessage(error) });
}
function snapshotFromExecApprovalsDatabase(db) {
	return snapshotFromExecApprovalsRow({
		path: resolveExecApprovalsDisplayPath(),
		row: readExecApprovalsConfigRow(db),
		onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
	});
}
function readExecApprovalsSnapshotFromDatabase() {
	assertNoPendingLegacyExecApprovals();
	return snapshotFromExecApprovalsDatabase(openOpenClawStateDatabase().db);
}
function readExecApprovalsSnapshotFromDatabaseReadOnly() {
	assertNoPendingLegacyExecApprovals();
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => snapshotFromExecApprovalsDatabase(db)) ?? snapshotFromExecApprovalsRow({
		path: resolveExecApprovalsDisplayPath(),
		row: void 0
	});
}
function readExecApprovalsSnapshot() {
	try {
		return readExecApprovalsSnapshotFromDatabase();
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		throw new ExecApprovalsStoreUnavailableError(error);
	}
}
function loadExecApprovals() {
	try {
		return readExecApprovalsSnapshot().file;
	} catch (error) {
		if (!(error instanceof ExecApprovalsStoreUnavailableError)) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return createFailClosedExecApprovalsFallback();
	}
}
/** Loads exec approvals without creating or migrating shared state. */
function loadExecApprovalsReadOnly() {
	try {
		return readExecApprovalsSnapshotFromDatabaseReadOnly().file;
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) throw error;
		warnFailClosed("exec approvals SQLite state is unavailable; denying host execution", error);
		return createFailClosedExecApprovalsFallback();
	}
}
async function loadExecApprovalsAsync() {
	return loadExecApprovals();
}
function replaceExecApprovalsSnapshot(target, source) {
	target.version = source.version;
	if (source.socket === void 0) delete target.socket;
	else target.socket = source.socket;
	if (source.defaults === void 0) delete target.defaults;
	else target.defaults = source.defaults;
	if (source.agents === void 0) delete target.agents;
	else target.agents = source.agents;
}
function updateExecApprovalsInTransaction(params) {
	assertNoPendingLegacyExecApprovals();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = snapshotFromExecApprovalsRow({
			path: resolveExecApprovalsDisplayPath(),
			row: readExecApprovalsConfigRow(db),
			onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
		});
		if (params.baseHash !== void 0 && current.hash !== params.baseHash) return null;
		const next = params.update(structuredClone(current.file));
		if (next === null) return current;
		assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next,
			authority: params.authority
		});
		const raw = serializeExecApprovals(next);
		if (current.exists && current.raw === raw) return current;
		writeExecApprovalsConfigRow({
			db,
			file: next,
			raw
		});
		return snapshotFromExecApprovalsRow({
			path: current.path,
			row: { raw_json: raw }
		});
	}, {}, { operationLabel: "exec-approvals.update" });
}
function updateExecApprovalsSync(params) {
	return updateExecApprovalsInTransaction(params);
}
function saveExecApprovals(file) {
	updateExecApprovalsSync({ update: () => file });
}
async function updateExecApprovals(params) {
	return updateExecApprovalsInTransaction(params);
}
/** Remove one deleted agent's policy aliases, restoring them if commit fails. */
async function withAgentExecApprovalsRemoved(agentId, commit) {
	const key = normalizeAgentId(agentId);
	const snapshot = readExecApprovalsSnapshot();
	const operationId = readAgentDeletionJournal(key)?.operationId;
	if (!operationId) throw new ExecApprovalsMutationFencedError();
	const removedPolicyEntries = Object.entries(snapshot.file.agents ?? {}).filter(([policyKey]) => {
		const normalizedPolicyKey = normalizeAgentIdStrict(policyKey);
		return normalizedPolicyKey.ok && normalizedPolicyKey.value === key;
	});
	if (removedPolicyEntries.length > 0) {
		if (!updateExecApprovalsInTransaction({
			baseHash: snapshot.hash,
			authority: {
				action: "remove",
				agentId: key,
				operationId
			},
			update: (file) => {
				const agents = { ...file.agents };
				for (const [policyKey] of removedPolicyEntries) delete agents[policyKey];
				return {
					...file,
					agents
				};
			}
		})) throw new Error("Exec approvals changed while deleting agent; retry deletion.");
	} else runOpenClawStateWriteTransaction(({ db }) => {
		assertExecApprovalsMutationAuthority(db, {
			action: "remove",
			agentId: key,
			operationId
		});
	});
	try {
		return await commit();
	} catch (error) {
		if (error instanceof AgentDeletionCommitUncertainError) throw error;
		if (removedPolicyEntries.length > 0) try {
			updateExecApprovalsInTransaction({
				authority: {
					action: "restore",
					agentId: key,
					operationId
				},
				update: (file) => ({
					...file,
					agents: {
						...file.agents,
						...Object.fromEntries(removedPolicyEntries)
					}
				})
			});
		} catch (rollbackError) {
			throw new AgentDeletionAuthorityRollbackError([error, rollbackError], `Failed to roll back exec approvals deletion for agent ${key}.`, { cause: error });
		}
		throw error;
	}
}
function restoreExecApprovalsSnapshotInTransaction(snapshot) {
	runOpenClawStateWriteTransaction(({ db }) => {
		assertExecApprovalsMutationAllowed({
			db,
			current: snapshotFromExecApprovalsRow({
				path: resolveExecApprovalsDisplayPath(),
				row: readExecApprovalsConfigRow(db)
			}).file,
			next: snapshot.file
		});
		if (!snapshot.exists) {
			deleteExecApprovalsConfigRow(db);
			return;
		}
		const raw = snapshot.raw ?? serializeExecApprovals(snapshot.file);
		writeExecApprovalsConfigRow({
			db,
			file: snapshot.file,
			raw
		});
	}, {}, { operationLabel: "exec-approvals.restore" });
}
function restoreExecApprovalsSnapshot(snapshot) {
	assertNoPendingLegacyExecApprovals();
	restoreExecApprovalsSnapshotInTransaction(snapshot);
}
async function restoreExecApprovalsSnapshotLocked(snapshot, baseHash) {
	assertNoPendingLegacyExecApprovals();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = snapshotFromExecApprovalsRow({
			path: resolveExecApprovalsDisplayPath(),
			row: readExecApprovalsConfigRow(db)
		});
		if (current.hash !== baseHash) return false;
		assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next: snapshot.file
		});
		if (!snapshot.exists) deleteExecApprovalsConfigRow(db);
		else {
			const raw = snapshot.raw ?? serializeExecApprovals(snapshot.file);
			writeExecApprovalsConfigRow({
				db,
				file: snapshot.file,
				raw
			});
		}
		return true;
	}, {}, { operationLabel: "exec-approvals.restore-cas" });
}
function ensureExecApprovalsSocket(file) {
	const next = normalizeExecApprovalsInternal(file);
	const socketPath = next.socket?.path?.trim();
	const token = next.socket?.token?.trim();
	return {
		...next,
		socket: {
			path: socketPath || resolveExecApprovalsSocketPath(),
			token: token || generateToken()
		}
	};
}
function requireInitializedExecApprovals(snapshot) {
	if (!snapshot) throw new Error("Failed to initialize exec approvals");
	return snapshot;
}
async function ensureExecApprovalsSnapshot() {
	return requireInitializedExecApprovals(updateExecApprovalsInTransaction({ update: ensureExecApprovalsSocket }));
}
function ensureExecApprovals() {
	return requireInitializedExecApprovals(updateExecApprovalsInTransaction({ update: ensureExecApprovalsSocket })).file;
}
const testing = { reset() {
	resetExecApprovalsMigrationGateForTest();
	lastWarnAt = void 0;
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.execApprovalsStoreTestApi")] = testing;
//#endregion
//#region src/infra/exec-approvals-generated-migration.ts
function isObsoleteGeneratedEntry(entry) {
	const pattern = entry.pattern.trim();
	return entry.source === "allow-always" && !pattern.startsWith("=command:") && !pattern.startsWith("=node-command:") && !isCwdBoundHashedArgPattern(entry.argPattern);
}
function countObsoleteGeneratedExecApprovals(file) {
	return Object.values(file.agents ?? {}).reduce((count, agent) => count + (agent.allowlist ?? []).filter(isObsoleteGeneratedEntry).length, 0);
}
function removeObsoleteGeneratedExecApprovals(file) {
	let removed = 0;
	const agents = Object.fromEntries(Object.entries(file.agents ?? {}).map(([agentId, agent]) => {
		const allowlist = (agent.allowlist ?? []).filter((entry) => {
			if (!isObsoleteGeneratedEntry(entry)) return true;
			removed += 1;
			return false;
		});
		return [agentId, {
			...agent,
			allowlist
		}];
	}));
	return removed === 0 ? {
		file,
		removed
	} : {
		file: {
			...file,
			agents
		},
		removed
	};
}
function repairObsoleteGeneratedExecApprovals() {
	let removed = 0;
	updateExecApprovalsSync({ update: (file) => {
		const result = removeObsoleteGeneratedExecApprovals(file);
		removed = result.removed;
		return result.removed > 0 ? result.file : null;
	} });
	return removed;
}
//#endregion
export { loadExecApprovals as a, readExecApprovalsSnapshot as c, restoreExecApprovalsSnapshotLocked as d, saveExecApprovals as f, withAgentExecApprovalsRemoved as h, ensureExecApprovalsSnapshot as i, replaceExecApprovalsSnapshot as l, updateExecApprovalsSync as m, repairObsoleteGeneratedExecApprovals as n, loadExecApprovalsAsync as o, updateExecApprovals as p, ensureExecApprovals as r, loadExecApprovalsReadOnly as s, countObsoleteGeneratedExecApprovals as t, restoreExecApprovalsSnapshot as u };
