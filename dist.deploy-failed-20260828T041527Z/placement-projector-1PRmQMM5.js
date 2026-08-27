import "./device-provider-identity-v6nXqNq_.js";
//#region src/gateway/worker-environments/placement-projector.ts
function createWorkerPlacementRunnerAvailabilityReader(params) {
	let version = 0;
	const read = (record) => {
		if (record.state !== "active") return;
		const environment = params.environments.get(record.environmentId);
		if (environment?.providerId !== "device" || environment.state !== "attached" || environment.ownerEpoch !== record.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== record.sessionId || !environment.nodeDeviceId) return;
		return {
			kind: "device",
			deviceId: environment.nodeDeviceId,
			status: params.hasCurrentDeviceRunner(environment.nodeDeviceId) ? "available" : "offline"
		};
	};
	return {
		read,
		markChanged: () => {
			version += 1;
		},
		version: () => version
	};
}
function projectWorkerPlacementMove(intent) {
	return {
		target: intent.target,
		updatedAtMs: intent.updatedAtMs,
		...intent.lastError ? { error: intent.lastError } : {}
	};
}
/** Removes gateway-only identity and turn-claim fields from the operator projection. */
function projectWorkerSessionPlacement(record, diskSpace, runner) {
	const timing = {
		generation: record.generation,
		createdAtMs: record.createdAtMs,
		updatedAtMs: record.updatedAtMs,
		stateChangedAtMs: record.stateChangedAtMs
	};
	const conflict = record.workspaceResultConflict ? { workspaceResultConflict: record.workspaceResultConflict } : {};
	const terminal = {
		...record.terminalReason ? { terminalReason: record.terminalReason } : {},
		...record.terminalAtMs !== null ? { terminalAtMs: record.terminalAtMs } : {}
	};
	switch (record.state) {
		case "local": return {
			state: "local",
			...timing
		};
		case "requested": return {
			state: "requested",
			...timing
		};
		case "provisioning": return {
			state: "provisioning",
			...timing,
			...record.environmentId ? { environmentId: record.environmentId } : {}
		};
		case "syncing": return {
			state: "syncing",
			...timing,
			environmentId: record.environmentId,
			workerBundleHash: record.workerBundleHash
		};
		case "starting": return {
			state: "starting",
			...timing,
			environmentId: record.environmentId,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir
		};
		case "active": return {
			state: "active",
			...timing,
			environmentId: record.environmentId,
			activeOwnerEpoch: record.activeOwnerEpoch,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir,
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...diskSpace ? { diskSpace } : {},
			...runner ? { runner } : {},
			...conflict
		};
		case "draining": return {
			state: "draining",
			...timing,
			environmentId: record.environmentId,
			activeOwnerEpoch: record.activeOwnerEpoch,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir,
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...conflict
		};
		case "reconciling": return {
			state: "reconciling",
			...timing,
			environmentId: record.environmentId,
			activeOwnerEpoch: record.activeOwnerEpoch,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir,
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...conflict
		};
		case "reclaimed": return {
			state: "reclaimed",
			...timing,
			...record.environmentId ? { environmentId: record.environmentId } : {},
			...record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {},
			...record.workspaceBaseManifestRef ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef } : {},
			...record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {},
			...record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {},
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...conflict,
			...terminal
		};
		case "failed": return {
			state: "failed",
			...timing,
			...record.environmentId ? { environmentId: record.environmentId } : {},
			...record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {},
			...record.workspaceBaseManifestRef ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef } : {},
			...record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {},
			...record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {},
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...conflict,
			recoveryError: record.recoveryError,
			...terminal
		};
	}
	return record;
}
//#endregion
export { projectWorkerPlacementMove as n, projectWorkerSessionPlacement as r, createWorkerPlacementRunnerAvailabilityReader as t };
