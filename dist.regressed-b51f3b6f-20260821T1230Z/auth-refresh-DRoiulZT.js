import { s as callGateway } from "./call-D4XcT41c.js";
//#region src/commands/models/auth-refresh.ts
/** Shared gateway refresh for CLI auth writes made outside the gateway process. */
async function refreshRunningGatewayAuthState() {
	try {
		await callGateway({
			method: "models.authStatus",
			params: { refresh: true },
			timeoutMs: 3e3
		});
	} catch {}
}
//#endregion
export { refreshRunningGatewayAuthState as t };
