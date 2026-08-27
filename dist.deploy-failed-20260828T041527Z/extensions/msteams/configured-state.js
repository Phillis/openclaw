import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "../../types.secrets-Bre8L6Ts.js";
import "../../secret-input-Dj-l6okR.js";
//#region extensions/msteams/configured-state.ts
/** Mirror Teams auth-mode requirements without loading the Azure SDK or full channel. */
function hasConfiguredMSTeamsChannelState(params) {
	const config = params.cfg.channels?.msteams;
	if (config?.enabled === false) return false;
	const env = params.env ?? process.env;
	const appId = normalizeSecretInputString(config && Object.hasOwn(config, "appId") ? config.appId : env.MSTEAMS_APP_ID);
	const tenantId = normalizeSecretInputString(config && Object.hasOwn(config, "tenantId") ? config.tenantId : env.MSTEAMS_TENANT_ID);
	if (!appId || !tenantId) return false;
	if ((config?.authType ?? env.MSTEAMS_AUTH_TYPE ?? "secret") === "federated") {
		const certificatePath = normalizeSecretInputString(config && Object.hasOwn(config, "certificatePath") ? config.certificatePath : env.MSTEAMS_CERTIFICATE_PATH);
		return Boolean(certificatePath || (config?.useManagedIdentity ?? env.MSTEAMS_USE_MANAGED_IDENTITY === "true"));
	}
	return config && Object.hasOwn(config, "appPassword") ? hasConfiguredSecretInput(config.appPassword) : Boolean(normalizeSecretInputString(env.MSTEAMS_APP_PASSWORD));
}
//#endregion
export { hasConfiguredMSTeamsChannelState };
