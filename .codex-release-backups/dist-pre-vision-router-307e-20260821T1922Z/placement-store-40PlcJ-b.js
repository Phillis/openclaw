import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { i as projectWorkspaceResultConflict } from "./workspace-conflicts-Vx0i_s3y.js";
import { t as boundedWorkerError } from "./worker-error-BY3ISuTB.js";
import { _ as normalizeWorkerPlacementExecutionMode, a as find, c as query, f as assertRecordShape, g as normalizeIdentity, h as normalizeEpoch, i as ensureLocal, l as transitionValues, m as nextGeneration, n as clearWorkerTurnToolState, o as fromRow, p as isCurrentPlacementTurnClaim, s as getRequired, t as assertNoRunningWorkerSessionToolOperations, u as canTransitionWorkerSessionPlacement, v as required } from "./placement-session-tool-operations-Ba4gGaev.js";
import { a as clearWorkerWorkspaceReconciliation, c as signalWorkerTurnClaimClosed, i as hasWorkerWorkspacePendingResult, n as createPlacementTurnClaimOps, o as createPlacementWorkspaceJournalOps, r as createPlacementWorkspaceResultOps, s as registerWorkerTurnClaimClosedHandler } from "./placement-turn-claims-CzcxARPk.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/placement-pending-failure.ts
function createPlacementPendingFailureOps(runtime) {
	const { now, path, write } = runtime;
	return { failWorkspaceResultAndReleaseTurn(pending, error) {
		const sessionId = required(pending.sessionId, "session id");
		const recoveryError = boundedWorkerError(error);
		const outcome = write((db) => {
			const current = getRequired(db, sessionId);
			const persisted = current.turnClaim;
			const exactClaim = persisted === null || persisted.owner === "worker" && persisted.claimId === pending.claimId && persisted.runId === pending.runId && persisted.generation === pending.placementGeneration && persisted.ownerEpoch === pending.ownerEpoch;
			if (current.state !== "active" && current.state !== "draining" || current.environmentId !== pending.environmentId || current.activeOwnerEpoch !== pending.ownerEpoch || current.generation !== (current.state === "active" ? pending.placementGeneration : pending.placementGeneration + 1) || !exactClaim) throw new Error(`Session ${sessionId} workspace result owner changed before failure`);
			const pendingQuery = getNodeSqliteKysely(db);
			if (!executeSqliteQuerySync(db, pendingQuery.selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).rows[0]) throw new Error(`Session ${sessionId} workspace result changed before failure`);
			const terminalAtMs = now();
			let transitioning = current;
			if (transitioning.state === "active") {
				const values = transitionValues(transitioning, "draining", {}, terminalAtMs);
				if (persisted) {
					values.turn_claim_owner = persisted.owner;
					values.turn_claim_id = persisted.claimId;
					values.turn_claim_run_id = persisted.runId;
					values.turn_claim_generation = persisted.generation;
					values.turn_claim_owner_epoch = persisted.ownerEpoch;
				}
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "active").where("transition_generation", "=", transitioning.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during drain`);
				transitioning = getRequired(db, sessionId);
			}
			if (transitioning.state !== "draining") throw new Error(`Session ${sessionId} workspace result did not reach draining`);
			if (persisted) {
				assertNoRunningWorkerSessionToolOperations(db, {
					sessionId,
					claimId: persisted.claimId
				});
				clearWorkerTurnToolState(db, {
					sessionId,
					claimId: persisted.claimId
				});
			}
			const reconcilingValues = transitionValues(transitioning, "reconciling", {}, terminalAtMs);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(reconcilingValues).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", transitioning.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during reconcile`);
			transitioning = getRequired(db, sessionId);
			const failedValues = transitionValues(transitioning, "failed", {
				recoveryError,
				terminalReason: recoveryError
			}, terminalAtMs);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(failedValues).where("session_id", "=", sessionId).where("state", "=", "reconciling").where("transition_generation", "=", transitioning.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			if (executeSqliteQuerySync(db, pendingQuery.deleteFrom("worker_workspace_pending_results").where("session_id", "=", sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			return {
				record: getRequired(db, sessionId),
				releasedClaim: persisted?.owner === "worker" ? {
					sessionId,
					owner: {
						kind: "worker",
						environmentId: pending.environmentId,
						ownerEpoch: pending.ownerEpoch
					},
					claimId: pending.claimId,
					runId: pending.runId,
					placementGeneration: pending.placementGeneration
				} : null
			};
		});
		if (outcome.releasedClaim) signalWorkerTurnClaimClosed(path, outcome.releasedClaim);
		return outcome.record;
	} };
}
//#endregion
//#region src/gateway/worker-environments/placement-store.ts
const RETIRABLE_PLACEMENT_STATES = [
	"local",
	"reclaimed",
	"failed"
];
function exactConflictPath(value) {
	if (typeof value !== "string" || value.length === 0) throw new Error("Worker placement conflict path is required");
	return value;
}
function updateTransition(db, current, to, patch, nowMs) {
	const values = transitionValues(current, to, patch, nowMs);
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${current.sessionId} changed during transition`);
	return getRequired(db, current.sessionId);
}
function projectWorkerTurnClaim(record) {
	const claim = record.turnClaim;
	return claim?.owner === "worker" && record.environmentId && claim.ownerEpoch !== null && claim.ownerEpoch !== void 0 ? {
		sessionId: record.sessionId,
		claimId: claim.claimId,
		runId: claim.runId,
		placementGeneration: claim.generation,
		owner: {
			kind: "worker",
			environmentId: record.environmentId,
			ownerEpoch: claim.ownerEpoch
		}
	} : void 0;
}
function createWorkerSessionPlacementStore(options = {}) {
	const path = (options.database ?? openOpenClawStateDatabase()).path;
	const now = options.now ?? Date.now;
	const runtime = {
		path,
		instanceId: randomUUID(),
		now,
		read: () => openOpenClawStateDatabase({ path }).db,
		write: (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path })
	};
	const { read, write } = runtime;
	const workspaceResultConflicts = /* @__PURE__ */ new Map();
	const withWorkspaceResultConflict = (record) => {
		if (!record) return;
		const conflict = workspaceResultConflicts.get(record.sessionId);
		return conflict ? {
			...record,
			workspaceResultConflict: conflict
		} : record;
	};
	const requireClaimOwner = (claim) => {
		const current = find(read(), required(claim.sessionId, "session id"));
		if (!current || !isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${claim.sessionId} workspace result conflict owner changed`);
	};
	return {
		...createPlacementTurnClaimOps(runtime),
		...createPlacementPendingFailureOps(runtime),
		...createPlacementWorkspaceJournalOps(runtime),
		...createPlacementWorkspaceResultOps(runtime),
		registerTurnClaimClosedHandler(handler) {
			return registerWorkerTurnClaimClosedHandler(path, handler);
		},
		get(sessionId) {
			return withWorkspaceResultConflict(find(read(), required(sessionId, "session id")));
		},
		getMany(sessionIds) {
			const normalizedIds = [...new Set(sessionIds.map((sessionId) => required(sessionId, "session id")))];
			const records = /* @__PURE__ */ new Map();
			const db = read();
			for (let offset = 0; offset < normalizedIds.length; offset += 250) {
				const chunk = normalizedIds.slice(offset, offset + 250);
				for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "in", chunk)).rows) {
					const record = fromRow(row);
					records.set(record.sessionId, withWorkspaceResultConflict(record));
				}
			}
			return records;
		},
		retireSessionPlacement(input) {
			const sessionId = required(input.sessionId, "session id");
			if (!RETIRABLE_PLACEMENT_STATES.includes(input.expectedState)) throw new Error(`Cannot retire worker session placement from ${input.expectedState}`);
			write((db) => {
				if (executeSqliteQuerySync(db, query(db).deleteFrom("worker_session_placements").where("session_id", "=", sessionId).where("state", "=", input.expectedState).where("transition_generation", "=", input.expectedGeneration).where("turn_claim_owner", "is", null).where("turn_claim_id", "is", null).where("turn_claim_run_id", "is", null).where("turn_claim_generation", "is", null).where("turn_claim_owner_epoch", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed before retirement`);
			});
			workspaceResultConflicts.delete(sessionId);
		},
		recordWorkspaceResultConflict(claim, conflict) {
			requireClaimOwner(claim);
			if (!conflict) {
				workspaceResultConflicts.delete(claim.sessionId);
				return;
			}
			const paths = conflict.paths.map(exactConflictPath);
			const stagedResultRef = required(conflict.stagedResultRef, "staged result ref");
			if (paths.length === 0 || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(stagedResultRef)) throw new Error("Cloud workspace result conflict projection is invalid");
			workspaceResultConflicts.set(claim.sessionId, projectWorkspaceResultConflict(paths, stagedResultRef, conflict.totalCount));
		},
		startDispatch(input) {
			const identity = normalizeIdentity(input);
			const executionMode = normalizeWorkerPlacementExecutionMode(input.executionMode);
			return write((db) => {
				const current = ensureLocal(db, identity, now());
				if (current.state !== "local" && current.state !== "reclaimed" && current.state !== "failed") throw new Error(`Cannot dispatch session ${identity.sessionId} from placement ${current.state}`);
				const updatedAtMs = now();
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
					state: "requested",
					execution_mode: executionMode,
					environment_id: null,
					transition_generation: nextGeneration(current.generation),
					active_owner_epoch: null,
					workspace_base_manifest_ref: null,
					remote_workspace_dir: null,
					worker_bundle_hash: null,
					last_transcript_ack_cursor: null,
					last_live_event_ack_cursor: null,
					recovery_error: null,
					terminal_reason: null,
					terminal_at_ms: null,
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs
				}).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Session ${identity.sessionId} placement changed during dispatch barrier`);
				return getRequired(db, identity.sessionId);
			});
		},
		transition(input) {
			if (!canTransitionWorkerSessionPlacement(input.from, input.to)) throw new Error(`Illegal worker session placement transition: ${input.from} -> ${input.to}`);
			if (input.from === "draining" && input.to === "reconciling") throw new Error("Use startReconcile after fencing the drained worker environment");
			if (input.to === "failed") throw new Error("Use fail to record terminal worker placement diagnostics");
			const sessionId = required(input.sessionId, "session id");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== input.from || current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed: expected ${input.from}@${input.expectedGeneration}, found ${current.state}@${current.generation}`);
				if (current.turnClaim) throw new Error(`Cannot transition session ${sessionId} during an active turn`);
				return updateTransition(db, current, input.to, input.patch ?? {}, now());
			});
		},
		startDrain(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== "active" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch) throw new Error(`Cannot drain stale worker placement for session ${sessionId}`);
				if (hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Cannot drain session ${sessionId} with a pending cloud workspace result`);
				const values = transitionValues(current, "draining", input.workspaceBaseManifestRef === void 0 ? {} : { workspaceBaseManifestRef: input.workspaceBaseManifestRef }, now());
				const turnClaim = current.turnClaim;
				if (turnClaim) {
					values.turn_claim_owner = turnClaim.owner;
					values.turn_claim_id = turnClaim.claimId;
					values.turn_claim_run_id = turnClaim.runId;
					values.turn_claim_generation = turnClaim.generation;
					values.turn_claim_owner_epoch = turnClaim.ownerEpoch;
				}
				assertRecordShape({
					state: "draining",
					executionMode: current.executionMode,
					environmentId,
					activeOwnerEpoch: ownerEpoch,
					workspaceBaseManifestRef: values.workspace_base_manifest_ref,
					remoteWorkspaceDir: values.remote_workspace_dir,
					workerBundleHash: values.worker_bundle_hash,
					lastTranscriptAckCursor: values.last_transcript_ack_cursor,
					lastLiveEventAckCursor: values.last_live_event_ack_cursor,
					recoveryError: values.recovery_error,
					terminalReason: values.terminal_reason,
					terminalAtMs: values.terminal_at_ms,
					turnClaim
				});
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "active").where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during drain`);
				if (input.workspaceBaseManifestRef !== void 0) clearWorkerWorkspaceReconciliation(db, sessionId, input.workspaceBaseManifestRef);
				return getRequired(db, sessionId);
			});
		},
		finishReclaim(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== "active" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || current.turnClaim !== null || hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Cannot finish stale worker reclaim for session ${sessionId}`);
				return updateTransition(db, current, "reclaimed", {}, now());
			});
		},
		startReconcile(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const outcome = write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== "draining" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch) throw new Error(`Cannot reconcile stale worker placement for session ${sessionId}`);
				if (hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Cannot reconcile session ${sessionId} with a pending cloud workspace result`);
				const releasedClaim = current.turnClaim !== null;
				if (current.turnClaim) {
					assertNoRunningWorkerSessionToolOperations(db, {
						sessionId,
						claimId: current.turnClaim.claimId
					});
					clearWorkerTurnToolState(db, {
						sessionId,
						claimId: current.turnClaim.claimId
					});
				}
				const values = transitionValues(current, "reconciling", {}, now());
				const update = query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch);
				if (executeSqliteQuerySync(db, current.turnClaim ? update.where("turn_claim_owner", "=", "worker").where("turn_claim_id", "=", current.turnClaim.claimId).where("turn_claim_run_id", "=", current.turnClaim.runId).where("turn_claim_generation", "=", current.turnClaim.generation).where("turn_claim_owner_epoch", "=", current.turnClaim.ownerEpoch) : update.where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during reconcile`);
				return {
					record: getRequired(db, sessionId),
					releasedClaim: releasedClaim ? projectWorkerTurnClaim(current) : void 0
				};
			});
			if (outcome.releasedClaim) signalWorkerTurnClaimClosed(path, outcome.releasedClaim);
			return outcome.record;
		},
		validateWorkerOwner(input) {
			const current = find(read(), required(input.sessionId, "session id"));
			return current?.state === "active" && current.environmentId === required(input.environmentId, "environment id") && current.activeOwnerEpoch === normalizeEpoch(input.ownerEpoch, "active owner epoch");
		},
		fail(input) {
			const sessionId = required(input.sessionId, "session id");
			const recoveryError = boundedWorkerError(input.recoveryError);
			const outcome = write((db) => {
				const current = getRequired(db, sessionId);
				if (input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed before failure`);
				if (current.state === "failed") {
					if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
						recovery_error: recoveryError,
						updated_at_ms: now()
					}).where("session_id", "=", sessionId).where("state", "=", "failed").where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure update`);
					return {
						record: getRequired(db, sessionId),
						releasedClaim: void 0
					};
				}
				if (!canTransitionWorkerSessionPlacement(current.state, "failed")) throw new Error(`Cannot fail worker session placement from ${current.state}`);
				const localClaim = current.turnClaim?.owner === "local" ? current.turnClaim : null;
				const updatedAtMs = now();
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
					state: "failed",
					transition_generation: nextGeneration(current.generation),
					recovery_error: recoveryError,
					terminal_reason: recoveryError,
					terminal_at_ms: updatedAtMs,
					turn_claim_owner: localClaim ? "local" : null,
					turn_claim_id: localClaim?.claimId ?? null,
					turn_claim_run_id: localClaim?.runId ?? null,
					turn_claim_generation: localClaim?.generation ?? null,
					turn_claim_owner_epoch: null,
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure`);
				return {
					record: getRequired(db, sessionId),
					releasedClaim: projectWorkerTurnClaim(current)
				};
			});
			if (outcome.releasedClaim) signalWorkerTurnClaimClosed(path, outcome.releasedClaim);
			return outcome.record;
		},
		adoptActive(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const current = getRequired(read(), sessionId);
			if (current.state !== "active" || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Cannot adopt stale worker placement for session ${sessionId}`);
			return current;
		},
		listForReconcile() {
			const db = read();
			return executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().where("state", "not in", ["local", "reclaimed"]).orderBy("updated_at_ms").orderBy("session_id")).rows.map((row) => withWorkspaceResultConflict(fromRow(row)));
		},
		list() {
			const db = read();
			return executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().orderBy("session_id")).rows.map((row) => withWorkspaceResultConflict(fromRow(row)));
		}
	};
}
//#endregion
export { createWorkerSessionPlacementStore as t };
