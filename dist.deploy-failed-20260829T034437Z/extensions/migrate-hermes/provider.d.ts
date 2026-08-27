import { L as MigrationProviderContext, R as MigrationProviderPlugin } from "../../runtime-api-IAhSVA75.js";
//#region extensions/migrate-hermes/provider.d.ts
declare function buildHermesMigrationProvider(params?: {
  runtime?: MigrationProviderContext["runtime"];
}): MigrationProviderPlugin;
//#endregion
export { buildHermesMigrationProvider };