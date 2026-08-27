import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { n as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-Cx7vLPdb.js";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-WvD0I0ZR.js").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
		expectedSessionId: target.sessionId,
		getConfig: getRuntimeConfig,
		getGatewayRuntime: getGatewayRecoveryRuntime,
		sessionKey: target.sessionKey,
		stateDir: target.stateDir,
		storePath: target.storePath
	}), () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
