import { L as MigrationProviderContext, R as MigrationProviderPlugin } from "../../runtime-api-B8urSeFb.js";
//#region extensions/migrate-hermes/provider.d.ts
declare function buildHermesMigrationProvider(params?: {
  runtime?: MigrationProviderContext["runtime"];
}): MigrationProviderPlugin;
//#endregion
export { buildHermesMigrationProvider };