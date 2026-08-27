import { s as resolveSharedAuthStorePath } from "./path-resolve-CttHagpC.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-CtUje688.js";
//#region src/secrets/runtime-auth-profile-owner.ts
/** Stable SecretRef owner identity for one agent-scoped auth profile. */
/** Tuple encoding distinguishes agents and avoids path/profile separator collisions. */
function resolveAuthProfileSecretOwnerId(params) {
	const storePath = params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : resolveSharedAuthStorePath();
	return JSON.stringify([storePath, params.profileId]);
}
//#endregion
export { resolveAuthProfileSecretOwnerId as t };
