import { d as MigrationProviderContext, l as MigrationItem } from "../../types-BwmvzNiR.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-5QQMDjT6.js";

//#region extensions/migrate-hermes/secrets.d.ts
declare function buildSecretItems(params: {
  config: Record<string, unknown>;
  ctx: MigrationProviderContext;
  source: HermesSource;
  targets: PlannedMigrationTargets;
}): Promise<MigrationItem[]>;
declare function applySecretItem(ctx: MigrationProviderContext, item: MigrationItem, targets: PlannedMigrationTargets): Promise<MigrationItem>;
//#endregion
export { applySecretItem, buildSecretItems };