import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { l as readConfigFileSnapshot } from "./io-CeQckj5v.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { n as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import "./config-Dl8DJbzM.js";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint } from "./config-recovery-hints-Lnv7HBW0.js";
import { c as formatPluginCompatibilityNotice, r as buildPluginCompatibilitySnapshotNotices } from "./status-DYYEr43V.js";
//#region src/commands/config-validation.ts
/** Read the config file and exit through the runtime when validation fails. */
async function requireValidConfigFileSnapshot(runtime, opts) {
	const snapshot = await readConfigFileSnapshot(opts?.skipPluginValidation ? { skipPluginValidation: true } : void 0);
	if (snapshot.exists && !snapshot.valid) {
		const issues = snapshot.issues.length > 0 ? formatConfigIssueLines(snapshot.issues, "-").join("\n") : "Unknown validation issue.";
		runtime.error(`OpenClaw config is invalid: ${snapshot.path}\n${issues}`);
		runtime.error(isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? `Fix: ${formatPluginPackagingRuntimeOutputRecoveryHint()}` : `Fix: ${formatCliCommand("openclaw doctor --fix")}`);
		runtime.error(`Inspect: ${formatCliCommand("openclaw config validate")}`);
		runtime.exit(1);
		return null;
	}
	if (opts?.includeCompatibilityAdvisory !== true) return snapshot;
	const compatibility = buildPluginCompatibilitySnapshotNotices({ config: snapshot.config });
	if (compatibility.length > 0) runtime.log([
		`Plugin compatibility: ${compatibility.length} notice${compatibility.length === 1 ? "" : "s"}.`,
		...compatibility.slice(0, 3).map((notice) => `- ${formatPluginCompatibilityNotice(notice)}`),
		...compatibility.length > 3 ? [`- ... +${compatibility.length - 3} more`] : [],
		`Review: ${formatCliCommand("openclaw doctor")}`
	].join("\n"));
	return snapshot;
}
/** Read and return a valid OpenClaw config, or null after reporting validation errors. */
async function requireValidConfig(runtime, opts) {
	return (await requireValidConfigFileSnapshot(runtime, opts))?.config ?? null;
}
//#endregion
export { requireValidConfigFileSnapshot as n, requireValidConfig as t };
