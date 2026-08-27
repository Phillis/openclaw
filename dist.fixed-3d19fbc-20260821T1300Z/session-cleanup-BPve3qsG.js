import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { i as isCronSessionKey } from "./session-key-utils-D8x_bjrd.js";
import "./lifecycle-4IbI4BFl.js";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-gNVONHel.js";
import "./agent-bundle-mcp-tools-Pq-7PI9s.js";
//#region src/cron/isolated-agent/session-cleanup.ts
const gatewayCallRuntimeLoader = createLazyImportLoader(() => import("./call.runtime.js"));
async function cleanupCronRunSessionAfterRun(params) {
	if (!shouldDeleteCronRunSessionAfterRun(params)) return "not-requested";
	params.beforeDelete?.();
	try {
		const { callGateway } = await gatewayCallRuntimeLoader.load();
		return (await callGateway({
			method: "sessions.delete",
			params: {
				key: params.agentSessionKey,
				deleteTranscript: true,
				emitLifecycleHooks: false,
				expectedSessionId: params.sessionId,
				expectedLifecycleRevision: params.lifecycleRevision,
				expectedSessionUpdatedAt: params.sessionUpdatedAt
			},
			timeoutMs: 1e4
		})).deleted === true ? "deleted" : "changed";
	} catch (error) {
		if (isSessionChangedGatewayError(error)) return "changed";
		if (params.job.sessionTarget === "isolated") {
			await retireSessionMcpRuntime({
				sessionId: params.sessionId,
				reason: params.reason
			});
			return "retired";
		}
		return "survived";
	}
}
function shouldDeleteCronRunSessionAfterRun(params) {
	return params.job.deleteAfterRun === true && isCronSessionKey(params.agentSessionKey);
}
function isSessionChangedGatewayError(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	const details = requestError.details;
	return requestError.gatewayCode === "INVALID_REQUEST" && typeof details === "object" && details !== null && details.reason === "session-changed";
}
//#endregion
export { cleanupCronRunSessionAfterRun as t };
