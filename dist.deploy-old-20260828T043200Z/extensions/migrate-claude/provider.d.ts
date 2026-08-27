import { c as MigrationProviderContext, l as MigrationProviderPlugin } from "../../plugin-entry-BZAeuuKK.js";
//#region extensions/migrate-claude/provider.d.ts
declare function buildClaudeMigrationProvider(params?: {
  runtime?: MigrationProviderContext["runtime"];
}): MigrationProviderPlugin;
//#endregion
export { buildClaudeMigrationProvider };