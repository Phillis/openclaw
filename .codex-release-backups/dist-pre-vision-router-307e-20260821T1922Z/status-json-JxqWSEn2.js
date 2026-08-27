import { n as runStatusJsonCommand } from "./status-json-command-DoaAKhKN.js";
import { t as scanStatusJsonFast } from "./status.scan.fast-json-BQkwVgka.js";
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
