import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-B5sNTTcg.js";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-CY1fQWF5.js").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
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
