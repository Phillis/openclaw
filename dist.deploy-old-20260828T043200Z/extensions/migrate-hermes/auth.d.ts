import { F as MigrationItem, L as MigrationProviderContext } from "../../runtime-api-IAhSVA75.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-BtI04PuT.js";
//#region extensions/migrate-hermes/auth.d.ts
declare function buildAuthItems(params: {
  ctx: MigrationProviderContext;
  source: HermesSource;
  targets: PlannedMigrationTargets;
}): Promise<MigrationItem[]>;
declare function applyAuthItem(ctx: MigrationProviderContext, item: MigrationItem, targets: PlannedMigrationTargets): Promise<MigrationItem>;
//#endregion
export { applyAuthItem, buildAuthItems };