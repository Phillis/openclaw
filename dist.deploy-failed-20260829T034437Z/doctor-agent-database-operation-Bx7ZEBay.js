import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as note } from "./note-YH_0kY-3.js";
//#region src/commands/doctor-agent-database-operation.ts
/** Keep one unusable agent database from aborting sibling Doctor work. */
function runDoctorAgentDatabaseOperation(params) {
	try {
		return {
			ok: true,
			value: params.run()
		};
	} catch (error) {
		note(`- Agent ${params.agentId} database ${shortenHomePath(params.path)}: ${formatErrorMessage(error)}`, "Doctor warnings");
		return { ok: false };
	}
}
//#endregion
export { runDoctorAgentDatabaseOperation as t };
