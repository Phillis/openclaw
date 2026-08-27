import { d as hasActiveBackgroundExecSession, u as getSession } from "./bash-process-registry-08adq0zn.js";
import { t as getProcessSupervisor } from "./supervisor-DmhWHZD2.js";
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
