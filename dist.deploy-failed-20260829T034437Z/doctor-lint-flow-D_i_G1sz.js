import { t as scrubDoctorErrorMessage } from "./doctor-error-message-cjWLuv7y.js";
import { a as listHealthChecks } from "./health-check-registry-CBs_fO63.js";
import { n as healthFindingMeetsSeverity, t as HEALTH_FINDING_SEVERITY_RANK } from "./health-checks-DrfuiOOz.js";
//#region src/flows/doctor-lint-flow.ts
/** Runs selected health checks in lint mode and returns sorted findings. */
async function runDoctorLintChecks(ctx, opts = {}) {
	const all = opts.checks ?? listHealthChecks();
	const skip = opts.skipIds instanceof Set ? opts.skipIds : new Set(opts.skipIds ?? []);
	const only = opts.onlyIds instanceof Set ? opts.onlyIds : new Set(opts.onlyIds ?? []);
	const allIds = new Set(all.map((check) => check.id));
	const includeDefaultDisabled = opts.includeAllChecks === true;
	const selected = all.filter((c) => {
		if (only.size > 0 && !only.has(c.id)) return false;
		if (only.size === 0 && !includeDefaultDisabled && isDefaultDisabled(c)) return false;
		if (skip.has(c.id)) return false;
		return true;
	});
	const findings = [];
	for (const id of only) {
		let message;
		if (!allIds.has(id)) message = `Unknown health check id selected by --only: ${id}.`;
		else if (selected.length === 0 && skip.has(id)) message = `Health check ${id} cannot be selected by --only and excluded by --skip.`;
		else continue;
		findings.push({
			checkId: "core/doctor/lint-selection",
			severity: "error",
			message,
			path: id
		});
	}
	for (const check of selected) try {
		const out = await check.detect(ctx);
		for (const f of out) findings.push(f);
	} catch (err) {
		findings.push({
			checkId: check.id,
			severity: "error",
			message: `health check threw: ${scrubDoctorErrorMessage(err)}`
		});
	}
	findings.sort(compareFindings);
	return {
		findings,
		checksRun: selected.length,
		checksSkipped: all.length - selected.length
	};
}
function isDefaultDisabled(check) {
	return "defaultEnabled" in check && check.defaultEnabled === false;
}
function compareFindings(a, b) {
	const sevDelta = HEALTH_FINDING_SEVERITY_RANK[b.severity] - HEALTH_FINDING_SEVERITY_RANK[a.severity];
	if (sevDelta !== 0) return sevDelta;
	const idDelta = a.checkId.localeCompare(b.checkId);
	if (idDelta !== 0) return idDelta;
	return (a.path ?? "").localeCompare(b.path ?? "");
}
/** Converts findings to a process exit code using the requested minimum severity. */
function exitCodeFromFindings(findings, severityMin = "warning") {
	return findings.some((f) => healthFindingMeetsSeverity(f, severityMin)) ? 1 : 0;
}
//#endregion
export { runDoctorLintChecks as n, exitCodeFromFindings as t };
