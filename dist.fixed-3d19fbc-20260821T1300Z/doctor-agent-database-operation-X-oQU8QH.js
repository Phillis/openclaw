import { m as shortenHomePath } from "./utils-D9gvQMP6.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as note } from "./note-C_xoKlB9.js";
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
