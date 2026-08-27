import { a as MigrationApplyResult, c as MigrationProviderContext, s as MigrationPlan } from "../../plugin-entry-CX5-Xb96.js";
//#region extensions/migrate-claude/apply.d.ts
declare function applyClaudePlan(params: {
  ctx: MigrationProviderContext;
  plan?: MigrationPlan;
  runtime?: MigrationProviderContext["runtime"];
}): Promise<MigrationApplyResult>;
//#endregion
export { applyClaudePlan };