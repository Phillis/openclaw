import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-Bcgahbi5.js";
//#region extensions/memory-lancedb/doctor-contract-api.d.ts
declare function resolveMemoryLanceDbPluginRoot(moduleUrl: string): string;
declare function createMemoryLanceDbStateMigrations(pluginRoot?: string): PluginDoctorStateMigration[];
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { createMemoryLanceDbStateMigrations, resolveMemoryLanceDbPluginRoot, stateMigrations };