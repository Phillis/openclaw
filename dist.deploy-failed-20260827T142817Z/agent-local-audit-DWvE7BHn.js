import { i as hasExecutionIdentityAdmissionSink, t as configureExecutionIdentityAdmissionSink } from "./execution-identity-admission-qTUfCaTZ.js";
import { t as createAuditEventRecorder } from "./audit-recorder-BDgJ0Oj-.js";
//#region src/commands/agent-local-audit.ts
/** Direct-local agent audit writer lifecycle shared by CLI entrypoints. */
/** Own one direct-process writer unless a surrounding runtime already owns it. */
function startAgentLocalAuditWriter(options = {}) {
	if (hasExecutionIdentityAdmissionSink()) return;
	const recorder = createAuditEventRecorder({
		messageMode: "off",
		...options.stateDir ? { stateDir: options.stateDir } : {}
	});
	const clearSink = configureExecutionIdentityAdmissionSink(recorder.recordExecutionIdentity);
	return async () => {
		clearSink();
		await recorder.stop();
	};
}
//#endregion
export { startAgentLocalAuditWriter };
