import "./order-C7dw_-HZ.js";
import "./persisted-DGErf7Xt.js";
import "./store-C0UG5FOx.js";
import "./runtime-snapshots-ChaCVIEN.js";
import "./usage-6-myLAu1.js";
import "./oauth-BKQY7qvz.js";
import { n as resolveAuthProfileMetadata } from "./identity-BamcuBvi.js";
import "./oauth-CtYm__qO.js";
import "./external-cli-discovery-kohNMVnn.js";
import "./profiles-B9i8Wh87.js";
import "./repair-CSVcAvMR.js";
//#region src/agents/auth-profiles/display.ts
/** Builds the human-readable profile label used in status and auth listings. */
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	if (displayName) return `${params.profileId} (${displayName})`;
	if (email) return `${params.profileId} (${email})`;
	return params.profileId;
}
//#endregion
export { resolveAuthProfileDisplayLabel as t };
