import { C as resolveOAuthDir, f as resolveConfigPath, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { d as readSourceConfigBestEffort, s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { r as formatConfigIssueSummary } from "./issue-format-I3BIXbd4.js";
import "./config-B_0xOnKq.js";
import { t as buildCleanupPlan } from "./cleanup-utils-DBlaUZGP.js";
//#region src/commands/cleanup-plan.ts
function affectsWorkspaceDiscovery(path) {
	return path === "agents.defaults.workspace" || path.startsWith("agents.entries.") && path.endsWith(".workspace");
}
function buildCleanupPlanForConfig(cfg) {
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
/** Build a read-only cleanup preview without recording config health state. */
async function resolveCleanupPlanForDryRun() {
	return buildCleanupPlanForConfig(await readSourceConfigBestEffort());
}
/** Resolve destructive cleanup inputs without mutating the state being guarded. */
async function resolveCleanupPlanForRemoval(runtime) {
	const snapshot = await readConfigFileSnapshot({
		observe: false,
		pluginValidation: "core-only"
	});
	const workspaceWarnings = snapshot.warnings.filter((issue) => affectsWorkspaceDiscovery(issue.path));
	if (!snapshot.valid || workspaceWarnings.length > 0) {
		const issueSummary = formatConfigIssueSummary(snapshot.valid ? workspaceWarnings : snapshot.issues) ?? "configuration read failed";
		runtime.error(`Cannot safely remove OpenClaw state because workspace configuration could not be resolved: ${issueSummary}. Fix the configuration and retry.`);
		return;
	}
	return buildCleanupPlanForConfig(snapshot.runtimeConfig);
}
//#endregion
export { resolveCleanupPlanForRemoval as n, resolveCleanupPlanForDryRun as t };
