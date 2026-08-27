import { d as MigrationProviderContext, u as MigrationPlan } from "../../types-7E39v2Gx.js";
//#region extensions/migrate-hermes/plan.d.ts
declare function buildHermesPlan(ctx: MigrationProviderContext): Promise<MigrationPlan>;
//#endregion
export { buildHermesPlan };