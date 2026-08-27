import { a as MigrationApplyResult, c as MigrationProviderContext, s as MigrationPlan } from "../../plugin-entry-BZAeuuKK.js";
//#region extensions/migrate-claude/apply.d.ts
declare function applyClaudePlan(params: {
  ctx: MigrationProviderContext;
  plan?: MigrationPlan;
  runtime?: MigrationProviderContext["runtime"];
}): Promise<MigrationApplyResult>;
//#endregion
export { applyClaudePlan };