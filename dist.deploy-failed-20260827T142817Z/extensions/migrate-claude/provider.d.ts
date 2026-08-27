import { d as MigrationProviderContext, f as MigrationProviderPlugin } from "../../types-DYqBZyXL.js";
//#region extensions/migrate-claude/provider.d.ts
declare function buildClaudeMigrationProvider(params?: {
  runtime?: MigrationProviderContext["runtime"];
}): MigrationProviderPlugin;
//#endregion
export { buildClaudeMigrationProvider };