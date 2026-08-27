import "./order-BxFkXXxj.js";
import "./persisted-Bjx2XcL3.js";
import "./store-C6iqqcJy.js";
import "./runtime-snapshots-a_60jBeK.js";
import "./usage-wmbnTa19.js";
import "./oauth-Dyo6Xu7D.js";
import { n as resolveAuthProfileMetadata } from "./identity-BamcuBvi.js";
import "./oauth-DmXswuwB.js";
import "./external-cli-discovery-kohNMVnn.js";
import "./profiles-FGrQtdwI.js";
import "./repair-B_GWNYPm.js";
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
