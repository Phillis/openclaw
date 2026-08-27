import { n as isTruthyEnvValue } from "../env-y-_yRnBE.js";
import { r as formatErrorMessage } from "../errors-CSNUPl5U.js";
import { r as getRuntimeConfig } from "../io-CeQckj5v.js";
import { m as rotateAgentEventLifecycleGeneration } from "../agent-events-Cmj8toCy.js";
import "../config-Dl8DJbzM.js";
import { n as detectGatewayRespawnSupervisor, r as detectRespawnSupervisor } from "../supervisor-markers-DPGGuE_D.js";
import { t as isContainerEnvironment } from "../container-environment-CNsJSTpY.js";
import { n as scheduleDetachedLaunchdRestartHandoff } from "../launchd-restart-handoff-CPhG0f4c.js";
import { n as consumeGatewayRestartIntentPayloadSync, r as consumeGatewayRestartIntentSync } from "../restart-intent-DDPNjOjT.js";
import { y as waitForActiveGatewayRootWork } from "../gateway-work-admission-QDz202p9.js";
import { a as markGatewaySigusr1RestartHandled, c as resetGatewayRestartStateForInProcessRestart, d as scheduleGatewaySigusr1Restart, i as isGatewaySigusr1RestartExternallyAllowed, l as resolveGatewayRestartDeferralTimeoutMs, m as triggerOpenClawRestart, n as consumeGatewaySigusr1RestartIntent, o as peekGatewaySigusr1RestartReason, s as requestGatewayRestartWithSignalAdmission, t as consumeGatewaySigusr1RestartAuthorization, u as rollbackGatewayRestartSignalAdmission } from "../restart-DMO9lEo3.js";
import { i as writeGatewayRestartHandoffSync } from "../restart-handoff-9lx7m4gY.js";
import { n as reloadTaskRuntimeStateFromStore } from "../runtime-internal-ByOukZ5u.js";
import { l as writeDiagnosticStabilityBundleForFailureSync } from "../diagnostic-stability-bundle-QH_iL0Qw.js";
import { d as getActiveEmbeddedRunCount, f as listActiveEmbeddedRunSessionIds, p as listActiveEmbeddedRunSessionKeys } from "../run-state-BxqT1sw2.js";
import { E as waitForActiveEmbeddedRuns, n as abortEmbeddedAgentRun } from "../runs-CS8YarJf.js";
import { t as markRestartAbortedMainSessions } from "../main-session-restart-recovery-marking-CUfzG7EB.js";
import { h as waitForActiveCronJobs, m as resetCronActiveJobs, t as advanceCronActiveJobGeneration } from "../active-jobs-D5QwO55Q.js";
import { a as retireActiveCronTaskRunTracking, s as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "../active-run-cancellation-DsAOvXZX.js";
import { _ as waitForActiveTasks, f as markGatewayDraining, i as getActiveTaskCount, m as resetAllLanes } from "../command-queue-CqN2qr5o.js";
import { n as getInspectableActiveTaskRestartBlockers } from "../task-registry.maintenance-CM67vroH.js";
import { r as resetGatewaySuspendCoordinatorForLifecycleRestart } from "../gateway-suspend-coordinator-BRgRKPEa.js";
import { c as markUpdateRestartSentinelFailure } from "../restart-sentinel-CWrwiMK_.js";
import { o as abortPendingChannelReloads } from "../server-reload-contracts-DurasdFB.js";
import { spawn } from "node:child_process";
//#region src/infra/process-respawn.ts
const PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN = /^(.*?)([\\/])node_modules\2\.pnpm\2openclaw@[^\\/]+\2node_modules\2openclaw\2.+$/;
function rewritePnpmVersionedOpenClawEntryPath(entryPath) {
	return entryPath.replace(PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN, "$1$2node_modules$2openclaw$2openclaw.mjs");
}
function spawnDetachedGatewayProcess(opts = {}) {
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
		child,
		pid: child.pid ?? void 0
	};
}
function scheduleLaunchdRestartAfterExit() {
	const handoff = scheduleDetachedLaunchdRestartHandoff({
		mode: "start-after-exit",
		waitForPid: process.pid
	});
	if (!handoff.ok) return {
		mode: "failed",
		detail: handoff.error
	};
	return {
		mode: "supervised",
		handoffSpawned: handoff.value
	};
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
		if (supervisor === "launchd") return scheduleLaunchdRestartAfterExit();
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	if (process.platform === "win32") return {
		mode: "disabled",
		detail: "win32: detached respawn unsupported without Scheduled Task markers"
	};
	if (isContainerEnvironment()) return {
		mode: "disabled",
		detail: "container: use in-process restart to keep PID 1 alive"
	};
	return {
		mode: "disabled",
		detail: "unmanaged: use in-process restart to keep custom supervisor PID tracking stable"
	};
}
/**
* Update restarts must replace the OS process so the new code runs from a
* fresh module graph after package files have changed on disk.
*
* Unlike the generic restart path, update mode allows detached respawn on
* unmanaged Windows installs because there is no safe in-process fallback once
* the installed package contents have been replaced.
*/
function respawnGatewayProcessForUpdate(opts = {}) {
	const supervisor = detectGatewayRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (supervisor) {
		if (supervisor === "launchd") return scheduleLaunchdRestartAfterExit();
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	if (isTruthyEnvValue(process.env.OPENCLAW_NO_RESPAWN)) return {
		mode: "disabled",
		detail: "OPENCLAW_NO_RESPAWN"
	};
	try {
		const { child, pid } = spawnDetachedGatewayProcess(opts);
		return {
			mode: "spawned",
			pid,
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
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, consumeGatewaySigusr1RestartAuthorization, consumeGatewaySigusr1RestartIntent, detectGatewayRespawnSupervisor, detectRespawnSupervisor, getActiveEmbeddedRunCount, getActiveTaskCount, getInspectableActiveTaskRestartBlockers, getRuntimeConfig, isGatewaySigusr1RestartExternallyAllowed, listActiveEmbeddedRunSessionIds, listActiveEmbeddedRunSessionKeys, markGatewayDraining, markGatewaySigusr1RestartHandled, markRestartAbortedMainSessions, markUpdateRestartSentinelFailure, peekGatewaySigusr1RestartReason, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDeferralTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewaySigusr1Restart, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForActiveEmbeddedRuns, waitForActiveGatewayRootWork, waitForActiveTasks, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync };
