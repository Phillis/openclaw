import { s as callGateway } from "./call-CZ1eu88h.js";
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
