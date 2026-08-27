import { d as MigrationProviderContext, f as MigrationProviderPlugin } from "../../types-BwmvzNiR.js";
//#region extensions/migrate-hermes/provider.d.ts
declare function buildHermesMigrationProvider(params?: {
  runtime?: MigrationProviderContext["runtime"];
}): MigrationProviderPlugin;
//#endregion
export { buildHermesMigrationProvider };