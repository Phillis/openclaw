//#region src/infra/agent-lifecycle-error.ts
const AGENT_RUN_STALE_LIFECYCLE_ERROR = "Agent run belongs to a stale gateway lifecycle";
const AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE = "ERR_STALE_GATEWAY_LIFECYCLE";
function createAgentRunStaleLifecycleError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_STALE_LIFECYCLE_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE;
	return error;
}
function isAgentRunStaleLifecycleError(value) {
	try {
		return value instanceof Error && "code" in value && value.code === AGENT_RUN_STALE_LIFECYCLE_ERROR_CODE;
	} catch {
		return false;
	}
}
//#endregion
export { isAgentRunStaleLifecycleError as n, createAgentRunStaleLifecycleError as t };
