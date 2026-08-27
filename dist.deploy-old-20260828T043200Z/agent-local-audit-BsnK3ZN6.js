import { t as configureRuntimeActionDecisionSink } from "./runtime-action-decision-C4JNkXkP.js";
import { i as hasExecutionIdentityAdmissionSink, t as configureExecutionIdentityAdmissionSink } from "./execution-identity-admission-Tv8ni-9_.js";
import { t as configureExecutionDecisionWorkSink } from "./execution-decision-work-C829f_qO.js";
import { t as createAuditEventRecorder } from "./audit-recorder-DESsWXJT.js";
//#region src/commands/agent-local-audit.ts
/** Direct-local agent audit writer lifecycle shared by CLI entrypoints. */
/** Own one direct-process writer unless a surrounding runtime already owns it. */
function startAgentLocalAuditWriter(options = {}) {
	if (hasExecutionIdentityAdmissionSink()) return;
	const recorder = createAuditEventRecorder({
		messageMode: "off",
		...options.stateDir ? { stateDir: options.stateDir } : {}
	});
	const clearAdmissionSink = configureExecutionIdentityAdmissionSink(recorder.recordExecutionIdentity);
	const clearDecisionWorkSink = configureExecutionDecisionWorkSink(recorder.recordExecutionDecisionWork);
	const clearRuntimeActionSink = configureRuntimeActionDecisionSink(recorder.recordExecutionDecision);
	return async () => {
		clearRuntimeActionSink();
		clearDecisionWorkSink();
		clearAdmissionSink();
		await recorder.stop();
	};
}
//#endregion
export { startAgentLocalAuditWriter };
