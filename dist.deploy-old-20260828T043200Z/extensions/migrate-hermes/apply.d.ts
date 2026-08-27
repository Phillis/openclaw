import { I as MigrationPlan, L as MigrationProviderContext, P as MigrationApplyResult } from "../../runtime-api-IAhSVA75.js";
//#region extensions/migrate-hermes/apply.d.ts
declare function applyHermesPlan(params: {
  ctx: MigrationProviderContext;
  plan?: MigrationPlan;
  runtime?: MigrationProviderContext["runtime"];
}): Promise<MigrationApplyResult>;
//#endregion
export { applyHermesPlan };