import { n as runStatusJsonCommand } from "./status-json-command-0xd4G7mg.js";
import { t as scanStatusJsonFast } from "./status.scan.fast-json-Ix6tt4cT.js";
//#region src/commands/status-json.ts
/** Runs status JSON with the standard fast scan and all-mode security audit behavior. */
async function statusJsonCommand(opts, runtime) {
	await runStatusJsonCommand({
		opts,
		runtime,
		scanStatusJsonFast,
		includeSecurityAudit: opts.all === true || opts.deep === true,
		includePluginCompatibility: opts.all === true,
		suppressHealthErrors: true
	});
}
//#endregion
export { statusJsonCommand };
