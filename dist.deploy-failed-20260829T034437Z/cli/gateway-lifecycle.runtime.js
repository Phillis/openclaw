import { n as isTruthyEnvValue } from "../env-ChWDbSFK.js";
import { r as formatErrorMessage } from "../errors-Ccx0R-_Z.js";
import { m as rotateAgentEventLifecycleGeneration } from "../agent-events-CcZImb5w.js";
import { n as detectGatewayRespawnSupervisor, r as detectRespawnSupervisor } from "../supervisor-markers-BXjiMLrU.js";
import { t as isContainerEnvironment } from "../container-environment-CNsJSTpY.js";
import { n as scheduleDetachedLaunchdRestartHandoff } from "../launchd-restart-handoff-z-BP1LKf.js";
import { n as consumeGatewayRestartIntentPayloadSync, r as consumeGatewayRestartIntentSync } from "../restart-intent-B5BUJHU-.js";
import { a as markGatewaySigusr1RestartHandled, c as requestGatewayRestartWithSignalAdmission, d as rollbackGatewayRestartSignalAdmission, f as scheduleGatewaySigusr1Restart, h as triggerOpenClawRestart, i as isGatewaySigusr1RestartExternallyAllowed, l as resetGatewayRestartStateForInProcessRestart, n as consumeGatewaySigusr1RestartIntent, s as peekGatewaySigusr1RestartReason, t as consumeGatewaySigusr1RestartAuthorization, u as resolveGatewayRestartDeferralTimeoutMs } from "../restart-Znvaw4so.js";
import { i as writeGatewayRestartHandoffSync } from "../restart-handoff-Cn-vtimu.js";
import { n as reloadTaskRuntimeStateFromStore } from "../runtime-internal-KZAce0-2.js";
import { c as writeDiagnosticStabilityBundleForFailureSync } from "../diagnostic-stability-bundle-D-lqvuOF.js";
import { n as abortEmbeddedAgentRun } from "../runs-DpT-JSmi.js";
import { c as markUpdateRestartSentinelFailure } from "../restart-sentinel-BabYlCrz.js";
import { i as commitManagedServiceUpdateHandoff, n as cancelManagedServiceUpdateHandoff, o as requestManagedServiceUpdateHandoffPark, r as claimManagedServiceUpdateHandoff } from "../update-managed-service-handoff-BoFfquwu.js";
import { g as waitForActiveCronJobs, h as resetCronActiveJobs, t as advanceCronActiveJobGeneration } from "../active-jobs-BG_34AJh.js";
import { a as retireActiveCronTaskRunTracking, s as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "../active-run-cancellation-st3bUr95.js";
import { f as markGatewayDraining, m as resetAllLanes } from "../command-queue-CBS1Vl32.js";
import { n as waitForGatewayActiveWork, t as createGatewayActiveWorkSnapshot } from "../gateway-active-work-B-4dULVA.js";
import { r as resetGatewaySuspendCoordinatorForLifecycleRestart } from "../gateway-suspend-coordinator-l6ZLrxtE.js";
import { o as abortPendingChannelReloads } from "../server-reload-contracts-qB5pIcFL.js";
import { spawn } from "node:child_process";
//#region src/infra/process-respawn.ts
const PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN = /^(.*?)([\\/])node_modules\2\.pnpm\2openclaw@[^\\/]+\2node_modules\2openclaw\2.+$/;
function rewritePnpmVersionedOpenClawEntryPath(entryPath) {
	return entryPath.replace(PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN, "$1$2node_modules$2openclaw$2openclaw.mjs");
}
/**
* Attempt to restart this process with a fresh PID.
* - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
* - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
* - unmanaged environments: caller should keep in-process restart behavior so
*   custom supervisors keep tracking the same gateway PID
*/
function restartGatewayProcessWithFreshPid(_opts = {}) {
	if (isTruthyEnvValue(process.env.OPENCLAW_NO_RESPAWN)) return { mode: "disabled" };
	const supervisor = detectGatewayRespawnSupervisor(process.env);
	if (supervisor) {
		if (supervisor === "launchd") {
			const handoff = scheduleDetachedLaunchdRestartHandoff({
				mode: "start-after-exit",
				waitForPid: process.pid
			});
			return handoff.ok ? {
				mode: "supervised",
				handoffSpawned: handoff.value
			} : {
				mode: "failed",
				detail: handoff.error
			};
		}
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	return {
		mode: "disabled",
		detail: process.platform === "win32" ? "win32: detached respawn unsupported without Scheduled Task markers" : isContainerEnvironment() ? "container: use in-process restart to keep PID 1 alive" : "unmanaged: use in-process restart to keep custom supervisor PID tracking stable"
	};
}
/**
* Update restarts must replace the OS process so the new code runs from a
* fresh module graph after package files have changed on disk.
*
* The caller resolves supervisor ownership first; this path is only for an
* unmanaged process whose installed package contents have been replaced.
*/
function respawnGatewayProcessForUpdate(opts = {}) {
	if (isTruthyEnvValue(process.env.OPENCLAW_NO_RESPAWN)) return {
		mode: "disabled",
		detail: "OPENCLAW_NO_RESPAWN"
	};
	try {
		const [entryArg, ...entryArgs] = process.argv.slice(1);
		const args = [
			...process.execArgv,
			...entryArg ? [rewritePnpmVersionedOpenClawEntryPath(entryArg)] : [],
			...entryArgs
		];
		const child = spawn(process.execPath, args, {
			env: opts.env ? {
				...process.env,
				...opts.env
			} : process.env,
			detached: true,
			stdio: "inherit"
		});
		child.on("error", () => {});
		child.unref();
		return {
			mode: "spawned",
			pid: child.pid ?? void 0,
			child
		};
	} catch (err) {
		return {
			mode: "failed",
			detail: formatErrorMessage(err)
		};
	}
}
//#endregion
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, cancelManagedServiceUpdateHandoff, claimManagedServiceUpdateHandoff, commitManagedServiceUpdateHandoff, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, consumeGatewaySigusr1RestartAuthorization, consumeGatewaySigusr1RestartIntent, createGatewayActiveWorkSnapshot, detectGatewayRespawnSupervisor, detectRespawnSupervisor, isGatewaySigusr1RestartExternallyAllowed, markGatewayDraining, markGatewaySigusr1RestartHandled, markUpdateRestartSentinelFailure, peekGatewaySigusr1RestartReason, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, requestManagedServiceUpdateHandoffPark, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDeferralTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewaySigusr1Restart, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForGatewayActiveWork, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync };
