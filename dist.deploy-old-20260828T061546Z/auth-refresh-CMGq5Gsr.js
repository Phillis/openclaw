import { o as callGateway } from "./call-BFtOrd_w.js";
//#region src/commands/models/auth-refresh.ts
/** Shared gateway refresh for CLI auth writes made outside the gateway process. */
async function refreshRunningGatewayAuthState(agentId) {
	try {
		await callGateway({
			method: "models.authStatus",
			params: {
				refresh: true,
				...agentId ? { agentId } : {}
			},
			timeoutMs: 3e3
		});
	} catch {}
}
//#endregion
export { refreshRunningGatewayAuthState as t };
