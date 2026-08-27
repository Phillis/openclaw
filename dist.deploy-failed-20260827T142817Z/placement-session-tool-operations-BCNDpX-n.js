import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
//#region src/gateway/worker-environments/placement-record.ts
function required(value, field) {
	const normalized = value.trim();
	if (!normalized) throw new Error(`Worker session placement ${field} must be a non-empty string`);
	return normalized;
}
function normalizeWorkerPlacementExecutionMode(value) {
	if (value === null || value === void 0 || value === "worker-turn") return "worker-turn";
	if (value === "remote-exec") return value;
	throw new Error(`Invalid worker placement execution mode: ${value}`);
}
function nullableRequired(value, field) {
	return value === null ? null : required(value, field);
}
function normalizeEpoch(value, field) {
	if (!Number.isSafeInteger(value) || value < 1) throw new Error(`Worker session placement ${field} must be a positive safe integer`);
	return value;
}
function normalizeCursor(value, field) {
	if (value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error(`Worker session placement ${field} must be a non-negative safe integer`);
	return value;
}
function normalizeTimestamp(value, field) {
	if (value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error(`Worker session placement ${field} must be a non-negative safe integer`);
	return value;
}
function advanceCursor(current, value, field) {
	if (value === void 0) return current;
	const next = normalizeCursor(value, field);
	if (next === null || current === null) return next ?? current;
	return Math.max(current, next);
}
function normalizeIdentity(input) {
	return {
		sessionId: required(input.sessionId, "session id"),
		agentId: required(input.agentId, "agent id"),
		sessionKey: required(input.sessionKey, "session key")
	};
}
function nextGeneration(generation) {
	const next = generation + 1;
	if (!Number.isSafeInteger(next)) throw new Error("Worker session placement generation is exhausted");
	return next;
}
function localTurnClaimForState(turnClaim, state) {
	if (turnClaim?.owner === "worker") throw new Error(`Worker turn claim cannot survive placement ${state}`);
	return turnClaim;
}
function activeTurnClaimForState(turnClaim, state, executionMode) {
	if (turnClaim?.owner === "local" && executionMode !== "remote-exec" || turnClaim?.owner === "worker" && executionMode !== "worker-turn") throw new Error(`Turn claim owner does not match ${executionMode} placement ${state}`);
	return turnClaim;
}
function unclaimedTurnForState(turnClaim, state) {
	if (turnClaim !== null) throw new Error(`Turn claim cannot survive placement ${state}`);
	return null;
}
function assertRecordShape(record) {
	if (record.state === "reclaimed" || record.state === "failed") {
		normalizeTimestamp(record.terminalAtMs, "terminal timestamp");
		if (record.state === "reclaimed" && record.terminalReason !== null) throw new Error("Reclaimed worker session placement cannot retain a terminal reason");
		if (record.terminalReason !== null) required(record.terminalReason, "terminal reason");
	} else if (record.terminalReason !== null || record.terminalAtMs !== null) throw new Error(`Worker session placement ${record.state} cannot retain terminal facts`);
	if (record.state === "local" || record.state === "requested") {
		if (record.environmentId !== null || record.activeOwnerEpoch !== null || record.workspaceBaseManifestRef !== null || record.remoteWorkspaceDir !== null || record.workerBundleHash !== null || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error(`Worker session placement ${record.state} cannot retain worker metadata`);
	} else if (record.state === "provisioning") {
		if (record.activeOwnerEpoch !== null || record.workspaceBaseManifestRef !== null || record.remoteWorkspaceDir !== null || record.workerBundleHash !== null || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error("Provisioning worker session placement can only retain an environment id");
	} else if (record.state === "syncing") {
		if (!record.environmentId || record.activeOwnerEpoch !== null || record.workspaceBaseManifestRef !== null || record.remoteWorkspaceDir !== null || !record.workerBundleHash || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error("Syncing worker session placement requires an environment and bundle");
	} else if (record.state === "starting") {
		if (!record.environmentId || record.activeOwnerEpoch !== null || !record.workspaceBaseManifestRef || !record.remoteWorkspaceDir || !record.workerBundleHash || record.lastTranscriptAckCursor !== null || record.lastLiveEventAckCursor !== null || record.recoveryError !== null) throw new Error("Starting worker session placement requires complete workspace metadata");
	} else if (record.state === "active" || record.state === "draining" || record.state === "reconciling" || record.state === "reclaimed") {
		if (!record.environmentId || record.activeOwnerEpoch === null || !record.workspaceBaseManifestRef || !record.remoteWorkspaceDir || !record.workerBundleHash || record.recoveryError !== null) throw new Error(`Worker session placement ${record.state} requires complete worker ownership`);
		normalizeEpoch(record.activeOwnerEpoch, "active owner epoch");
	} else if (!record.recoveryError) throw new Error("Failed worker session placement requires a recovery error");
	if (record.turnClaim?.owner === "local" && record.state !== "local" && record.state !== "requested" && record.state !== "failed" && !(record.executionMode === "remote-exec" && (record.state === "active" || record.state === "draining"))) throw new Error("Local turn claim requires local, dispatch-barrier, or failed placement");
	if (record.turnClaim?.owner === "worker") {
		const workerMayFinish = record.state === "active" || record.state === "draining";
		if (record.executionMode !== "worker-turn" || !workerMayFinish || record.activeOwnerEpoch !== record.turnClaim.ownerEpoch) throw new Error("Worker turn claim requires the active or draining worker owner epoch");
	}
}
function isCurrentPlacementTurnClaim(record, claim) {
	const persisted = record.turnClaim;
	if (!persisted || persisted.claimId !== claim.claimId || persisted.runId !== claim.runId || persisted.generation !== claim.placementGeneration || persisted.owner !== claim.owner.kind) return false;
	if (claim.owner.kind === "worker") return persisted.ownerEpoch === claim.owner.ownerEpoch && record.executionMode === "worker-turn" && (record.state === "active" || record.state === "draining") && record.environmentId === claim.owner.environmentId && record.activeOwnerEpoch === claim.owner.ownerEpoch;
	if (record.state === "active" || record.state === "draining") return record.executionMode === "remote-exec" && claim.owner.environmentId === record.environmentId && claim.owner.ownerEpoch === record.activeOwnerEpoch;
	if (record.state === "failed" && record.executionMode === "remote-exec" && record.environmentId && record.activeOwnerEpoch !== null) return claim.owner.environmentId === record.environmentId && claim.owner.ownerEpoch === record.activeOwnerEpoch;
	return (record.state === "local" || record.state === "requested" || record.state === "failed") && claim.owner.environmentId === void 0 && claim.owner.ownerEpoch === void 0;
}
function resolvePlacementTurnEnvironment(record, claim) {
	if (!isCurrentPlacementTurnClaim(record, claim) || record.state !== "active" && record.state !== "draining" || !record.environmentId || record.activeOwnerEpoch === null) return;
	return {
		environmentId: record.environmentId,
		ownerEpoch: record.activeOwnerEpoch
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-state.ts
const WORKER_SESSION_PLACEMENT_STATES = [
	"local",
	"requested",
	"provisioning",
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling",
	"reclaimed",
	"failed"
];
const WORKER_SESSION_PLACEMENT_TRANSITIONS = {
	local: ["requested"],
	requested: ["provisioning", "failed"],
	provisioning: ["syncing", "failed"],
	syncing: ["starting", "failed"],
	starting: ["active", "failed"],
	active: ["draining"],
	draining: ["reconciling"],
	reconciling: [
		"local",
		"reclaimed",
		"failed"
	],
	reclaimed: ["requested"],
	failed: ["local", "requested"]
};
function parseWorkerSessionPlacementState(value) {
	if (WORKER_SESSION_PLACEMENT_STATES.includes(value)) return value;
	throw new Error(`Invalid worker session placement state: ${value}`);
}
function canTransitionWorkerSessionPlacement(from, to) {
	return WORKER_SESSION_PLACEMENT_TRANSITIONS[from].includes(to);
}
//#endregion
//#region src/gateway/worker-environments/placement-row-codec.ts
const query = (db) => getNodeSqliteKysely(db);
const EMPTY_WORKER_METADATA = {
	environmentId: null,
	activeOwnerEpoch: null,
	workspaceBaseManifestRef: null,
	remoteWorkspaceDir: null,
	workerBundleHash: null,
	lastTranscriptAckCursor: null,
	lastLiveEventAckCursor: null,
	recoveryError: null,
	terminalReason: null,
	terminalAtMs: null
};
function parseTurnClaim(row) {
	if (row.turn_claim_owner === null) return null;
	const claimId = required(row.turn_claim_id ?? "", "turn claim id");
	const runId = required(row.turn_claim_run_id ?? "", "turn claim run id");
	const generation = row.turn_claim_generation;
	if (generation === null || !Number.isSafeInteger(generation) || generation < 0) throw new Error("Worker session placement turn claim generation is invalid");
	if (row.turn_claim_owner === "local") {
		if (row.turn_claim_owner_epoch !== null) throw new Error("Local turn claim cannot retain a worker owner epoch");
		return {
			owner: "local",
			claimId,
			runId,
			generation,
			ownerEpoch: null
		};
	}
	if (row.turn_claim_owner === "worker") return {
		owner: "worker",
		claimId,
		runId,
		generation,
		ownerEpoch: normalizeEpoch(row.turn_claim_owner_epoch ?? 0, "turn claim owner epoch")
	};
	throw new Error(`Invalid worker session turn claim owner: ${row.turn_claim_owner}`);
}
function ownedWorkerMetadata(parsed, state) {
	if (parsed.environmentId === null || parsed.activeOwnerEpoch === null || parsed.workspaceBaseManifestRef === null || parsed.remoteWorkspaceDir === null || parsed.workerBundleHash === null) throw new Error(`Worker session placement ${state} requires complete worker ownership`);
	return {
		environmentId: parsed.environmentId,
		activeOwnerEpoch: parsed.activeOwnerEpoch,
		workspaceBaseManifestRef: parsed.workspaceBaseManifestRef,
		remoteWorkspaceDir: parsed.remoteWorkspaceDir,
		workerBundleHash: parsed.workerBundleHash,
		lastTranscriptAckCursor: parsed.lastTranscriptAckCursor,
		lastLiveEventAckCursor: parsed.lastLiveEventAckCursor,
		recoveryError: null,
		terminalReason: null,
		terminalAtMs: null
	};
}
function fromRow(row) {
	const state = parseWorkerSessionPlacementState(row.state);
	const executionMode = normalizeWorkerPlacementExecutionMode(row.execution_mode);
	const parsed = {
		environmentId: row.environment_id === null ? null : required(row.environment_id, "environment id"),
		activeOwnerEpoch: row.active_owner_epoch === null ? null : normalizeEpoch(row.active_owner_epoch, "active owner epoch"),
		workspaceBaseManifestRef: nullableRequired(row.workspace_base_manifest_ref, "workspace base manifest ref"),
		remoteWorkspaceDir: nullableRequired(row.remote_workspace_dir, "remote workspace directory"),
		workerBundleHash: nullableRequired(row.worker_bundle_hash, "worker bundle hash"),
		lastTranscriptAckCursor: normalizeCursor(row.last_transcript_ack_cursor, "transcript ACK cursor"),
		lastLiveEventAckCursor: normalizeCursor(row.last_live_event_ack_cursor, "live ACK cursor"),
		terminalReason: nullableRequired(row.terminal_reason, "terminal reason"),
		terminalAtMs: normalizeTimestamp(row.terminal_at_ms, "terminal timestamp")
	};
	const recoveryError = nullableRequired(row.recovery_error, "recovery error");
	const turnClaim = parseTurnClaim(row);
	const base = {
		sessionId: row.session_id,
		agentId: row.agent_id,
		sessionKey: row.session_key,
		executionMode,
		generation: row.transition_generation,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms,
		stateChangedAtMs: row.state_changed_at_ms
	};
	assertRecordShape({
		state,
		executionMode,
		...parsed,
		recoveryError,
		turnClaim
	});
	switch (state) {
		case "local": return {
			...base,
			state,
			turnClaim: localTurnClaimForState(turnClaim, state),
			...EMPTY_WORKER_METADATA
		};
		case "requested": return {
			...base,
			state,
			turnClaim: localTurnClaimForState(turnClaim, state),
			...EMPTY_WORKER_METADATA
		};
		case "provisioning": return {
			...base,
			state,
			turnClaim: unclaimedTurnForState(turnClaim, state),
			...EMPTY_WORKER_METADATA,
			environmentId: parsed.environmentId
		};
		case "syncing":
			if (parsed.environmentId === null || parsed.workerBundleHash === null) throw new Error("Syncing worker session placement requires an environment and bundle");
			return {
				...base,
				state,
				turnClaim: unclaimedTurnForState(turnClaim, state),
				...EMPTY_WORKER_METADATA,
				environmentId: parsed.environmentId,
				workerBundleHash: parsed.workerBundleHash
			};
		case "starting":
			if (parsed.environmentId === null || parsed.workspaceBaseManifestRef === null || parsed.remoteWorkspaceDir === null || parsed.workerBundleHash === null) throw new Error("Starting worker session placement requires complete workspace metadata");
			return {
				...base,
				state,
				turnClaim: unclaimedTurnForState(turnClaim, state),
				...EMPTY_WORKER_METADATA,
				environmentId: parsed.environmentId,
				workspaceBaseManifestRef: parsed.workspaceBaseManifestRef,
				remoteWorkspaceDir: parsed.remoteWorkspaceDir,
				workerBundleHash: parsed.workerBundleHash
			};
		case "active": return {
			...base,
			state,
			turnClaim: activeTurnClaimForState(turnClaim, state, executionMode),
			...ownedWorkerMetadata(parsed, state)
		};
		case "draining": return {
			...base,
			state,
			turnClaim: activeTurnClaimForState(turnClaim, state, executionMode),
			...ownedWorkerMetadata(parsed, state)
		};
		case "reconciling": return {
			...base,
			state,
			turnClaim: unclaimedTurnForState(turnClaim, state),
			...ownedWorkerMetadata(parsed, state)
		};
		case "reclaimed": return {
			...base,
			state,
			turnClaim: unclaimedTurnForState(turnClaim, state),
			...ownedWorkerMetadata(parsed, state),
			terminalReason: parsed.terminalReason,
			terminalAtMs: parsed.terminalAtMs
		};
		case "failed":
			if (recoveryError === null) throw new Error("Failed worker session placement requires a recovery error");
			return {
				...base,
				state,
				turnClaim: localTurnClaimForState(turnClaim, state),
				environmentId: parsed.environmentId,
				activeOwnerEpoch: parsed.activeOwnerEpoch,
				workspaceBaseManifestRef: parsed.workspaceBaseManifestRef,
				remoteWorkspaceDir: parsed.remoteWorkspaceDir,
				workerBundleHash: parsed.workerBundleHash,
				lastTranscriptAckCursor: parsed.lastTranscriptAckCursor,
				lastLiveEventAckCursor: parsed.lastLiveEventAckCursor,
				recoveryError,
				terminalReason: parsed.terminalReason,
				terminalAtMs: parsed.terminalAtMs
			};
	}
	return state;
}
function find(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "=", sessionId));
	return row ? fromRow(row) : void 0;
}
function getRequired(db, sessionId) {
	const record = find(db, sessionId);
	if (!record) throw new Error(`Unknown worker session placement: ${sessionId}`);
	return record;
}
function assertIdentity(record, identity) {
	if (record.agentId !== identity.agentId || record.sessionKey !== identity.sessionKey) throw new Error(`Worker session placement identity changed for ${identity.sessionId}`);
}
function insertLocal(db, identity, nowMs) {
	executeSqliteQuerySync(db, query(db).insertInto("worker_session_placements").values({
		session_id: identity.sessionId,
		agent_id: identity.agentId,
		session_key: identity.sessionKey,
		execution_mode: null,
		state: "local",
		environment_id: null,
		transition_generation: 0,
		active_owner_epoch: null,
		workspace_base_manifest_ref: null,
		remote_workspace_dir: null,
		worker_bundle_hash: null,
		last_transcript_ack_cursor: null,
		last_live_event_ack_cursor: null,
		recovery_error: null,
		terminal_reason: null,
		terminal_at_ms: null,
		turn_claim_owner: null,
		turn_claim_id: null,
		turn_claim_run_id: null,
		turn_claim_generation: null,
		turn_claim_owner_epoch: null,
		created_at_ms: nowMs,
		updated_at_ms: nowMs,
		state_changed_at_ms: nowMs
	}));
	return getRequired(db, identity.sessionId);
}
function ensureLocal(db, identity, nowMs) {
	const current = find(db, identity.sessionId);
	if (current) {
		assertIdentity(current, identity);
		return current;
	}
	return insertLocal(db, identity, nowMs);
}
function transitionValues(current, to, patch, nowMs) {
	const environmentId = to === "local" || to === "requested" ? null : patch.environmentId === void 0 ? current.environmentId : patch.environmentId === null ? null : required(patch.environmentId, "environment id");
	const activeOwnerEpoch = to === "local" || to === "requested" || to === "provisioning" || to === "syncing" || to === "starting" ? null : patch.activeOwnerEpoch === void 0 ? current.activeOwnerEpoch : patch.activeOwnerEpoch === null ? null : normalizeEpoch(patch.activeOwnerEpoch, "active owner epoch");
	const generation = nextGeneration(current.generation);
	const clearsWorkerMetadata = to === "local" || to === "requested";
	const values = {
		session_id: current.sessionId,
		agent_id: current.agentId,
		session_key: current.sessionKey,
		execution_mode: current.executionMode,
		state: to,
		environment_id: environmentId,
		transition_generation: generation,
		active_owner_epoch: activeOwnerEpoch,
		workspace_base_manifest_ref: clearsWorkerMetadata ? null : patch.workspaceBaseManifestRef === void 0 ? current.workspaceBaseManifestRef : patch.workspaceBaseManifestRef === null ? null : required(patch.workspaceBaseManifestRef, "workspace base manifest ref"),
		remote_workspace_dir: clearsWorkerMetadata ? null : patch.remoteWorkspaceDir === void 0 ? current.remoteWorkspaceDir : patch.remoteWorkspaceDir === null ? null : required(patch.remoteWorkspaceDir, "remote workspace directory"),
		worker_bundle_hash: clearsWorkerMetadata ? null : patch.workerBundleHash === void 0 ? current.workerBundleHash : patch.workerBundleHash === null ? null : required(patch.workerBundleHash, "worker bundle hash"),
		last_transcript_ack_cursor: clearsWorkerMetadata ? null : patch.lastTranscriptAckCursor === void 0 ? current.lastTranscriptAckCursor : normalizeCursor(patch.lastTranscriptAckCursor, "transcript ACK cursor"),
		last_live_event_ack_cursor: clearsWorkerMetadata ? null : patch.lastLiveEventAckCursor === void 0 ? current.lastLiveEventAckCursor : normalizeCursor(patch.lastLiveEventAckCursor, "live ACK cursor"),
		recovery_error: clearsWorkerMetadata ? null : patch.recoveryError === void 0 ? current.recoveryError : patch.recoveryError === null ? null : required(patch.recoveryError, "recovery error"),
		terminal_reason: to === "failed" ? patch.terminalReason === void 0 ? current.terminalReason : patch.terminalReason === null ? null : required(patch.terminalReason, "terminal reason") : null,
		terminal_at_ms: to === "reclaimed" || to === "failed" ? current.terminalAtMs ?? nowMs : null,
		turn_claim_owner: null,
		turn_claim_id: null,
		turn_claim_run_id: null,
		turn_claim_generation: null,
		turn_claim_owner_epoch: null,
		created_at_ms: current.createdAtMs,
		updated_at_ms: nowMs,
		state_changed_at_ms: nowMs
	};
	assertRecordShape({
		state: to,
		executionMode: current.executionMode,
		environmentId,
		activeOwnerEpoch,
		workspaceBaseManifestRef: values.workspace_base_manifest_ref,
		remoteWorkspaceDir: values.remote_workspace_dir,
		workerBundleHash: values.worker_bundle_hash,
		lastTranscriptAckCursor: values.last_transcript_ack_cursor,
		lastLiveEventAckCursor: values.last_live_event_ack_cursor,
		recoveryError: values.recovery_error,
		terminalReason: values.terminal_reason,
		terminalAtMs: values.terminal_at_ms,
		turnClaim: null
	});
	return values;
}
const workerSessionToolOperationWaiters = resolveGlobalMap(Symbol.for("openclaw.workerSessionToolOperationWaiters"), (waitersByPath) => {
	const error = /* @__PURE__ */ new Error("Gateway lifecycle ended while waiting for worker session operations");
	for (const byClaim of waitersByPath.values()) for (const waiters of byClaim.values()) for (const reject of waiters) reject(error);
	waitersByPath.clear();
});
function workerSessionToolOperationWaiterKey(identity) {
	return `${identity.sessionId}\0${identity.claimId}`;
}
function workerSessionToolOperationWaitersFor(path, identity) {
	let byClaim = workerSessionToolOperationWaiters.get(path);
	if (!byClaim) {
		byClaim = /* @__PURE__ */ new Map();
		workerSessionToolOperationWaiters.set(path, byClaim);
	}
	const key = workerSessionToolOperationWaiterKey(identity);
	let waiters = byClaim.get(key);
	if (!waiters) {
		waiters = /* @__PURE__ */ new Set();
		byClaim.set(key, waiters);
	}
	return waiters;
}
function signalWorkerSessionToolOperationChange(path, identity) {
	const byClaim = workerSessionToolOperationWaiters.get(path);
	const key = workerSessionToolOperationWaiterKey(identity);
	const waiters = byClaim?.get(key);
	if (!waiters) return;
	byClaim?.delete(key);
	if (byClaim?.size === 0) workerSessionToolOperationWaiters.delete(path);
	for (const resolve of waiters) resolve();
}
function hasRunningWorkerSessionToolOperations(db, identity) {
	return Boolean(executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").select("tool_call_id").where("source_session_id", "=", identity.sessionId).where("source_claim_id", "=", identity.claimId).where("status", "=", "running").limit(1)).rows[0]);
}
function assertNoRunningWorkerSessionToolOperations(db, identity) {
	if (hasRunningWorkerSessionToolOperations(db, identity)) throw new Error(`Session ${identity.sessionId} has a running worker session operation`);
}
function closeWorkerTurnToolAdmission(db, identity) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_turn_tool_authorities").where("session_id", "=", identity.sessionId).where("claim_id", "=", identity.claimId));
}
/** Removes authority and replay data in the same transaction that revokes the turn claim. */
function clearWorkerTurnToolState(db, identity) {
	closeWorkerTurnToolAdmission(db, identity);
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_session_tool_operations").where("source_session_id", "=", identity.sessionId).where("source_claim_id", "=", identity.claimId));
}
async function waitForWorkerSessionToolOperations(params) {
	while (hasRunningWorkerSessionToolOperations(params.read(), params.identity)) await new Promise((resolve, reject) => {
		const waiters = workerSessionToolOperationWaitersFor(params.path, params.identity);
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			waiters.delete(finish);
			if (waiters.size === 0) {
				const byClaim = workerSessionToolOperationWaiters.get(params.path);
				byClaim?.delete(workerSessionToolOperationWaiterKey(params.identity));
				if (byClaim?.size === 0) workerSessionToolOperationWaiters.delete(params.path);
			}
			if (error) reject(error);
			else resolve();
		};
		waiters.add(finish);
		if (!hasRunningWorkerSessionToolOperations(params.read(), params.identity)) finish();
	});
}
function createPlacementSessionToolOperationOps(runtime) {
	const { instanceId, path, now, read, write } = runtime;
	const exactWorkerClaim = (db, claim) => {
		if (claim.owner.kind !== "worker") throw new Error(`Session ${claim.sessionId} turn is not worker-owned`);
		const current = getRequired(db, required(claim.sessionId, "session id"));
		const persisted = current.turnClaim;
		if (current.state !== "active" && current.state !== "draining" || current.environmentId !== claim.owner.environmentId || current.activeOwnerEpoch !== claim.owner.ownerEpoch || !persisted || persisted.owner !== "worker" || persisted.claimId !== claim.claimId || persisted.runId !== claim.runId || persisted.generation !== claim.placementGeneration || persisted.ownerEpoch !== claim.owner.ownerEpoch) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
		return current;
	};
	const exactBindingClaim = (db, binding) => {
		const current = find(db, required(binding.sessionId, "session id"));
		const persisted = current?.turnClaim;
		if (!current || current.state !== "active" && current.state !== "draining" || current.environmentId !== binding.environmentId || current.activeOwnerEpoch !== binding.ownerEpoch || persisted?.owner !== "worker" || persisted.runId !== binding.runId || persisted.ownerEpoch !== binding.ownerEpoch) return;
		return {
			current,
			persisted
		};
	};
	const hasToolAuthority = (db, binding, toolName) => {
		const claim = exactBindingClaim(db, binding);
		if (!claim) return;
		const authority = executeSqliteQuerySync(db, query(db).selectFrom("worker_turn_tool_authorities").selectAll().where("session_id", "=", binding.sessionId)).rows[0];
		if (!authority || authority.environment_id !== binding.environmentId || authority.owner_epoch !== binding.ownerEpoch || authority.placement_generation !== claim.persisted.generation || authority.claim_id !== claim.persisted.claimId || authority.run_id !== claim.persisted.runId) return;
		try {
			const names = JSON.parse(authority.tool_names_json);
			return Array.isArray(names) && names.every((name) => typeof name === "string") && names.includes(toolName) ? claim : void 0;
		} catch {
			return;
		}
	};
	return {
		authorizeWorkerTurnTools(claim, toolNames) {
			const normalized = [...new Set(toolNames.map((name) => required(name, "worker tool name")))].toSorted();
			if (claim.owner.kind !== "worker") throw new Error(`Session ${claim.sessionId} turn is not worker-owned`);
			const owner = claim.owner;
			write((db) => {
				exactWorkerClaim(db, claim);
				executeSqliteQuerySync(db, query(db).insertInto("worker_turn_tool_authorities").values({
					session_id: claim.sessionId,
					environment_id: owner.environmentId,
					owner_epoch: owner.ownerEpoch,
					placement_generation: claim.placementGeneration,
					claim_id: claim.claimId,
					run_id: claim.runId,
					tool_names_json: JSON.stringify(normalized),
					updated_at_ms: now()
				}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
					environment_id: owner.environmentId,
					owner_epoch: owner.ownerEpoch,
					placement_generation: claim.placementGeneration,
					claim_id: claim.claimId,
					run_id: claim.runId,
					tool_names_json: JSON.stringify(normalized),
					updated_at_ms: now()
				})));
			});
		},
		isWorkerTurnToolAuthorized(binding, toolName) {
			return Boolean(hasToolAuthority(read(), binding, toolName));
		},
		async closeWorkerTurnToolState(claim) {
			if (claim.owner.kind !== "worker") {
				write((db) => {
					if (!isCurrentPlacementTurnClaim(getRequired(db, required(claim.sessionId, "session id")), claim)) throw new Error(`Session ${claim.sessionId} local turn authority changed`);
					const identity = {
						sessionId: claim.sessionId,
						claimId: claim.claimId
					};
					assertNoRunningWorkerSessionToolOperations(db, identity);
					clearWorkerTurnToolState(db, identity);
				});
				return;
			}
			const identity = {
				sessionId: claim.sessionId,
				claimId: claim.claimId
			};
			write((db) => {
				exactWorkerClaim(db, claim);
				closeWorkerTurnToolAdmission(db, identity);
			});
			await waitForWorkerSessionToolOperations({
				path,
				read,
				identity
			});
			write((db) => {
				exactWorkerClaim(db, claim);
				assertNoRunningWorkerSessionToolOperations(db, identity);
				clearWorkerTurnToolState(db, identity);
			});
		},
		beginWorkerSessionToolOperation(params) {
			return write((db) => {
				const claim = hasToolAuthority(db, params.binding, params.toolName);
				if (!claim) return { kind: "unauthorized" };
				const claimId = claim.persisted.claimId;
				const existing = executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").selectAll().where("source_session_id", "=", params.binding.sessionId).where("source_claim_id", "=", claimId).where("tool_call_id", "=", params.toolCallId)).rows[0];
				if (existing) {
					if (existing.tool_name !== params.toolName || existing.request_digest !== params.requestDigest || params.childSessionKey !== void 0 && existing.child_session_key !== params.childSessionKey) return { kind: "conflict" };
					if ((existing.status === "succeeded" || existing.status === "failed") && existing.result_json) return {
						kind: "completed",
						resultJson: existing.result_json
					};
					if (existing.status === "unknown") return { kind: "unknown" };
					if (existing.gateway_instance_id === instanceId) return {
						kind: "in-progress",
						claimId
					};
					return { kind: "unknown" };
				}
				if (executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").select("tool_call_id").where("source_session_id", "=", params.binding.sessionId).where("source_claim_id", "=", claimId).where("status", "=", "running")).rows.length >= 4) return { kind: "capacity" };
				const timestamp = now();
				const operationSeed = generateSecureToken(32);
				executeSqliteQuerySync(db, query(db).insertInto("worker_session_tool_operations").values({
					source_session_id: params.binding.sessionId,
					source_claim_id: claimId,
					tool_call_id: params.toolCallId,
					tool_name: params.toolName,
					request_digest: params.requestDigest,
					operation_seed: operationSeed,
					status: "running",
					child_session_key: params.childSessionKey ?? null,
					result_json: null,
					gateway_instance_id: instanceId,
					created_at_ms: timestamp,
					updated_at_ms: timestamp
				}));
				return {
					kind: "execute",
					claimId,
					operationSeed,
					...params.childSessionKey ? { childSessionKey: params.childSessionKey } : {}
				};
			});
		},
		bindWorkerSessionToolOperationChild(params) {
			return write((db) => {
				return executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					child_session_key: params.childSessionKey,
					updated_at_ms: now()
				}).where("source_session_id", "=", params.sourceSessionId).where("source_claim_id", "=", params.sourceClaimId).where("tool_call_id", "=", params.toolCallId).where("request_digest", "=", params.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running").where((expression) => expression.or([expression("child_session_key", "is", null), expression("child_session_key", "=", params.childSessionKey)]))).numAffectedRows === 1n;
			});
		},
		completeWorkerSessionToolOperation(params) {
			const completed = write((db) => {
				return executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					status: params.failed ? "failed" : "succeeded",
					result_json: params.resultJson,
					updated_at_ms: now()
				}).where("source_session_id", "=", params.sourceSessionId).where("source_claim_id", "=", params.sourceClaimId).where("tool_call_id", "=", params.toolCallId).where("request_digest", "=", params.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running")).numAffectedRows === 1n;
			});
			if (completed) signalWorkerSessionToolOperationChange(path, {
				sessionId: params.sourceSessionId,
				claimId: params.sourceClaimId
			});
			return completed;
		},
		abandonWorkerSessionToolOperation(params) {
			const abandoned = write((db) => {
				return executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					status: "unknown",
					updated_at_ms: now()
				}).where("source_session_id", "=", params.sourceSessionId).where("source_claim_id", "=", params.sourceClaimId).where("tool_call_id", "=", params.toolCallId).where("request_digest", "=", params.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running")).numAffectedRows === 1n;
			});
			if (abandoned) signalWorkerSessionToolOperationChange(path, {
				sessionId: params.sourceSessionId,
				claimId: params.sourceClaimId
			});
			return abandoned;
		},
		recoverWorkerSessionToolOperationsAfterRestart() {
			return write((db) => {
				const result = executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					status: "unknown",
					updated_at_ms: now()
				}).where("status", "=", "running"));
				return Number(result.numAffectedRows);
			});
		}
	};
}
//#endregion
export { normalizeWorkerPlacementExecutionMode as _, find as a, query as c, advanceCursor as d, assertRecordShape as f, normalizeIdentity as g, normalizeEpoch as h, ensureLocal as i, transitionValues as l, nextGeneration as m, clearWorkerTurnToolState as n, fromRow as o, isCurrentPlacementTurnClaim as p, createPlacementSessionToolOperationOps as r, getRequired as s, assertNoRunningWorkerSessionToolOperations as t, canTransitionWorkerSessionPlacement as u, required as v, resolvePlacementTurnEnvironment as y };
