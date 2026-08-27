import { c as MigrationProviderContext, l as MigrationProviderPlugin } from "../../plugin-entry-CX5-Xb96.js";
//#region extensions/migrate-claude/provider.d.ts
declare function buildClaudeMigrationProvider(params?: {
  runtime?: MigrationProviderContext["runtime"];
}): MigrationProviderPlugin;
//#endregion
export { buildClaudeMigrationProvider };