//#region src/gateway/worker-environments/placement-projector.ts
/** Removes gateway-only identity and turn-claim fields from the operator projection. */
function projectWorkerSessionPlacement(record, diskSpace) {
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
export { projectWorkerSessionPlacement as t };
