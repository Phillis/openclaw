import { r as createPluginStateSyncKeyedStore } from "../../plugin-state-store-D5dGBXer.js";
import "../../plugin-state-store-runtime-mJsaxD9o.js";
import { i as normalizeMatrixStoredCredentials, t as MATRIX_CREDENTIALS_NAMESPACE } from "../../credentials-state-DyvgWf6L.js";
//#region extensions/matrix/auth-presence.ts
function hasAnyMatrixAuth(params, env = process.env) {
	const resolvedEnv = params && typeof params === "object" && "cfg" in params ? params.env ?? env : env;
	try {
		return createPluginStateSyncKeyedStore("matrix", {
			namespace: MATRIX_CREDENTIALS_NAMESPACE,
			maxEntries: 256,
			overflowPolicy: "reject-new",
			env: resolvedEnv
		}).entries().some((entry) => normalizeMatrixStoredCredentials(entry.value) !== null);
	} catch {
		return false;
	}
}
//#endregion
export { hasAnyMatrixAuth };
