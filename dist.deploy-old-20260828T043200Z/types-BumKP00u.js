//#region packages/memory-host-sdk/src/host/types.ts
/** Automatic prompt injection is reserved for content with authoritative trusted provenance. */
function isMemoryOriginEligibleForAutomaticInjection(originClass) {
	return originClass === "owner" || originClass === "agent";
}
function isAutomaticMemoryEntryEligible(entry) {
	return isMemoryOriginEligibleForAutomaticInjection(entry.provenance?.originClass);
}
function resolveMemorySearchStaleness(status, agentId) {
	const identity = status.custom?.indexIdentity;
	const identityReason = (identity?.status === "mismatched" || identity?.status === "missing") && typeof identity.reason === "string" ? identity.reason.trim() : void 0;
	const refreshingSessionsOnly = status.dirty === true && status.pendingSyncSources?.length === 1 && status.pendingSyncSources[0] === "sessions";
	if ((!status.dirty || refreshingSessionsOnly) && !identityReason) return null;
	return {
		stale: true,
		warning: identityReason ? `Memory index is stale: ${identityReason}. Search results may be incomplete.` : "Memory index is dirty. Search results may be incomplete.",
		action: `Run: openclaw memory status --index${agentId?.trim() ? ` --agent ${agentId.trim()}` : ""}`
	};
}
//#endregion
export { isMemoryOriginEligibleForAutomaticInjection as n, resolveMemorySearchStaleness as r, isAutomaticMemoryEntryEligible as t };
