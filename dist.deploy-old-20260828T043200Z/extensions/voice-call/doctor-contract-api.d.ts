import "../../plugin-entry-SSZcu2d5.js";
import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BUTKbG4l.js";
//#region extensions/voice-call/doctor-contract-api.d.ts
/** Return Voice Call agents whose templated core session stores need migration. */
declare function resolveSessionStoreAgentIds(params: {
  cfg: OpenClawConfig;
}): string[];
/** Doctor migrations owned by the voice-call plugin. */
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { resolveSessionStoreAgentIds, stateMigrations };