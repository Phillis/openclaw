import { d as getSession, f as hasActiveBackgroundExecSession } from "./bash-process-registry-CQvVr20S.js";
import { t as getProcessSupervisor } from "./supervisor-By4LUnR5.js";
//#region src/agents/bash-process-control.ts
function isBackgroundExecSessionActive(sessionId) {
	return hasActiveBackgroundExecSession(sessionId);
}
function cancelBackgroundExecSession(sessionId) {
	const session = getSession(sessionId);
	if (!session?.backgrounded || session.exited || session.finalizing) return false;
	const supervisor = getProcessSupervisor();
	const record = supervisor.getRecord(sessionId);
	if (!record || record.state === "exited") return false;
	supervisor.cancel(sessionId, "manual-cancel");
	return true;
}
//#endregion
export { isBackgroundExecSessionActive as n, cancelBackgroundExecSession as t };
