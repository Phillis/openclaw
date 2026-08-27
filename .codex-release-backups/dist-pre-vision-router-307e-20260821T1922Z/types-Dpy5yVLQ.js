//#region packages/memory-host-sdk/src/host/types.ts
function resolveMemorySearchStaleness(status, agentId) {
	const identity = status.custom?.indexIdentity;
	const identityReason = (identity?.status === "mismatched" || identity?.status === "missing") && typeof identity.reason === "string" ? identity.reason.trim() : void 0;
	if (!status.dirty && !identityReason) return null;
	return {
		stale: true,
		warning: identityReason ? `Memory index is stale: ${identityReason}. Search results may be incomplete.` : "Memory index is dirty. Search results may be incomplete.",
		action: `Run: openclaw memory status --index${agentId?.trim() ? ` --agent ${agentId.trim()}` : ""}`
	};
}
//#endregion
export { resolveMemorySearchStaleness as t };
