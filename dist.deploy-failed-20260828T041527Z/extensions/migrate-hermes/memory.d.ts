import { I as MigrationPlan, L as MigrationProviderContext } from "../../runtime-api-B8urSeFb.js";
import { HermesSource } from "./source.js";
//#region extensions/migrate-hermes/memory.d.ts
declare function isMemoryOnlyMigration(ctx: MigrationProviderContext): boolean;
declare function buildHermesMemoryPlan(ctx: MigrationProviderContext, source: HermesSource): Promise<MigrationPlan>;
//#endregion
export { buildHermesMemoryPlan, isMemoryOnlyMigration };