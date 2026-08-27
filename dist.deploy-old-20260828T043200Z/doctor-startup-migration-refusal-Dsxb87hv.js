import { t as ExitError } from "./runtime-LRpY2Icg.js";
//#region src/commands/doctor-startup-migration-refusal.ts
function formatStartupMigrationFailure(params) {
	return [
		"OpenClaw startup migrations did not complete cleanly; refusing to report the gateway ready.",
		...[...params.warnings.map((warning) => `- ${warning}`), ...params.blockers.map((blocker) => `- ${blocker}`)],
		"Run \"openclaw doctor --fix\" against the same state/config, then restart the gateway."
	].join("\n");
}
function throwStartupMigrationRefusal(message) {
	console.error(message);
	throw new ExitError(1, message);
}
function throwStartupMigrationGuardRejected() {
	throw new Error("OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.");
}
function throwStartupMigrationIdentityChanged() {
	throwStartupMigrationRefusal("OpenClaw plugin migration inputs changed during startup convergence; refusing to report the gateway ready. Restart OpenClaw so state migrations run against the final config and plugin inventory.");
}
/**
* A gateway startup that will refuse readiness must stay side-effect-free: a live owner of
* this state directory means every pending startup write (config-health recovery, sidecar
* quarantine, automatic migrations) would mutate its files before the runtime lock refuses.
* Probe-only: the runtime lock stays owned by the gateway run loop's restart lifecycle.
* Test runs skip the probe like acquireGatewayLock does (locks are disabled under Vitest).
* Returns the refusal message so each mutation boundary can report through its own runtime.
*/
async function describeLiveGatewayOwnerStartupBlocker(env) {
	if (env.VITEST || env.NODE_ENV === "test") return;
	const { readActiveGatewayLockIdentity } = await import("./gateway-lock-5zz6bLWk.js");
	const activeGateway = await readActiveGatewayLockIdentity({ env });
	if (!activeGateway) return;
	return `Another gateway (pid ${activeGateway.pid}) already owns this state directory; refusing to run automatic startup migrations or report the gateway ready. Stop it with "openclaw gateway stop" (or select a different OPENCLAW_STATE_DIR), then retry startup.`;
}
async function refuseStartupMigrationsForLiveGatewayOwner(env) {
	const blocker = await describeLiveGatewayOwnerStartupBlocker(env);
	if (blocker) throwStartupMigrationRefusal(blocker);
}
//#endregion
export { throwStartupMigrationIdentityChanged as a, throwStartupMigrationGuardRejected as i, formatStartupMigrationFailure as n, throwStartupMigrationRefusal as o, refuseStartupMigrationsForLiveGatewayOwner as r, describeLiveGatewayOwnerStartupBlocker as t };
