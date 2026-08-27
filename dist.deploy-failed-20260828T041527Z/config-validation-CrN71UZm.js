import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { n as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import "./config-B_0xOnKq.js";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint } from "./config-recovery-hints-szfrjhDU.js";
import { t as renderConfigValidationIssueLines } from "./issue-location-CeXXU4dq.js";
import { r as buildPluginCompatibilitySnapshotNotices } from "./status-DINEeQjY.js";
import { t as formatPluginCompatibilityNotice } from "./status-compatibility-DdQ1VWdc.js";
//#region src/commands/config-validation.ts
/** Read the config file and exit through the runtime when validation fails. */
async function requireValidConfigFileSnapshot(runtime, opts) {
	const readOptions = {
		...opts?.observe === false ? { observe: false } : {},
		...opts?.skipPluginValidation ? { skipPluginValidation: true } : {}
	};
	const snapshot = opts?.adoptPluginMetadata ? (await (await import("./command-config-snapshot-DTYT3-tC.js")).readCommandConfigSnapshot(readOptions)).snapshot : await readConfigFileSnapshot(Object.keys(readOptions).length > 0 ? readOptions : void 0);
	if (snapshot.exists && !snapshot.valid) {
		const issues = snapshot.issues.length > 0 ? renderConfigValidationIssueLines(snapshot).join("\n") : "Unknown validation issue.";
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
