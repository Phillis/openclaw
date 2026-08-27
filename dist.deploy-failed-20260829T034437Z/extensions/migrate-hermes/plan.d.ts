import { I as MigrationPlan, L as MigrationProviderContext } from "../../runtime-api-IAhSVA75.js";
//#region extensions/migrate-hermes/plan.d.ts
declare function buildHermesPlan(ctx: MigrationProviderContext): Promise<MigrationPlan>;
//#endregion
export { buildHermesPlan };