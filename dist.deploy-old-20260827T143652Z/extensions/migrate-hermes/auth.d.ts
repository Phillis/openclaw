import { d as MigrationProviderContext, l as MigrationItem } from "../../types-BwmvzNiR.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-5QQMDjT6.js";

//#region extensions/migrate-hermes/auth.d.ts
declare function buildAuthItems(params: {
  ctx: MigrationProviderContext;
  source: HermesSource;
  targets: PlannedMigrationTargets;
}): Promise<MigrationItem[]>;
declare function applyAuthItem(ctx: MigrationProviderContext, item: MigrationItem, targets: PlannedMigrationTargets): Promise<MigrationItem>;
//#endregion
export { applyAuthItem, buildAuthItems };