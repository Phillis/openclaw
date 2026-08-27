import { c as MigrationApplyResult, d as MigrationProviderContext, u as MigrationPlan } from "../../types-BwmvzNiR.js";
//#region extensions/migrate-hermes/apply.d.ts
declare function applyHermesPlan(params: {
  ctx: MigrationProviderContext;
  plan?: MigrationPlan;
  runtime?: MigrationProviderContext["runtime"];
}): Promise<MigrationApplyResult>;
//#endregion
export { applyHermesPlan };