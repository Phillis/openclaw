import { C as resolveOAuthDir, f as resolveConfigPath, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import "./config-CfeGo4K4.js";
import { t as buildCleanupPlan } from "./cleanup-utils-Bm270Ayv.js";
//#region src/commands/cleanup-plan.ts
/** Build the cleanup plan for the current runtime config/state/credential paths on disk. */
function resolveCleanupPlanFromDisk() {
	const cfg = getRuntimeConfig();
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	return {
		cfg,
		stateDir,
		configPath,
		oauthDir,
		...buildCleanupPlan({
			cfg,
			stateDir,
			configPath,
			oauthDir
		})
	};
}
//#endregion
export { resolveCleanupPlanFromDisk as t };
