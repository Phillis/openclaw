import { t as formatRuntimeStatusWithDetails } from "./runtime-status-u-PlImob.js";
import { t as getSystemdCgroupHygieneSummary } from "./service-runtime-E6hYEM49.js";
//#region src/daemon/runtime-format.ts
/** Formats daemon runtime state into compact status lines for CLI output. */
const SIGNAL_NAMES_BY_STATUS = /* @__PURE__ */ new Map([
	[129, "SIGHUP"],
	[130, "SIGINT"],
	[131, "SIGQUIT"],
	[134, "SIGABRT/abort"],
	[137, "SIGKILL"],
	[143, "SIGTERM"]
]);
function formatLastExitStatus(status) {
	const signalName = SIGNAL_NAMES_BY_STATUS.get(status);
	return signalName ? `last exit ${status} (${signalName})` : `last exit ${status}`;
}
function formatRuntimeStatus(runtime) {
	if (!runtime) return null;
	const details = [];
	if (runtime.subState) details.push(`sub ${runtime.subState}`);
	if (runtime.lastExitStatus !== void 0) details.push(formatLastExitStatus(runtime.lastExitStatus));
	if (runtime.lastExitReason) details.push(`reason ${runtime.lastExitReason}`);
	if (runtime.lastRunResult) details.push(`last run ${runtime.lastRunResult}`);
	if (runtime.lastRunTime) details.push(`last run time ${runtime.lastRunTime}`);
	const cgroupSummary = getSystemdCgroupHygieneSummary(runtime.systemd);
	if (cgroupSummary) details.push(cgroupSummary);
	if (runtime.detail) details.push(runtime.detail);
	return formatRuntimeStatusWithDetails({
		status: runtime.status,
		pid: runtime.pid,
		state: runtime.state,
		details
	});
}
//#endregion
export { formatRuntimeStatus as t };
