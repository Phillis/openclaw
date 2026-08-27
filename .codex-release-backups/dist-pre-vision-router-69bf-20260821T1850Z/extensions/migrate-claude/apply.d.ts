import { c as MigrationApplyResult, d as MigrationProviderContext, u as MigrationPlan } from "../../types-CCx6rk6K.js";
//#region extensions/migrate-claude/apply.d.ts
declare function applyClaudePlan(params: {
  ctx: MigrationProviderContext;
  plan?: MigrationPlan;
  runtime?: MigrationProviderContext["runtime"];
}): Promise<MigrationApplyResult>;
//#endregion
export { applyClaudePlan };