//#region src/agents/agent-bundle-mcp-runtime-shared.ts
const SESSION_MCP_RUNTIME_MANAGER_KEY = Symbol.for("openclaw.sessionMcpRuntimeManager");
const DEFAULT_SESSION_MCP_RUNTIME_IDLE_TTL_MS = 600 * 1e3;
const SESSION_MCP_RUNTIME_SWEEP_INTERVAL_MS = 60 * 1e3;
/** Checks whether harness-scoped MCP can affect a turn without loading its runtime graph. */
function shouldLoadRequesterScopedMcpHarnessRuntime(params) {
	if (params.requesterSenderId?.trim()) return true;
	return (globalThis[SESSION_MCP_RUNTIME_MANAGER_KEY]?.getAdvertisedScopedCatalog(params.sessionId)?.tools.length ?? 0) > 0;
}
function resolveSessionMcpRuntimeIdleTtlMs() {
	return DEFAULT_SESSION_MCP_RUNTIME_IDLE_TTL_MS;
}
//#endregion
export { shouldLoadRequesterScopedMcpHarnessRuntime as a, resolveSessionMcpRuntimeIdleTtlMs as i, SESSION_MCP_RUNTIME_MANAGER_KEY as n, SESSION_MCP_RUNTIME_SWEEP_INTERVAL_MS as r, DEFAULT_SESSION_MCP_RUNTIME_IDLE_TTL_MS as t };
