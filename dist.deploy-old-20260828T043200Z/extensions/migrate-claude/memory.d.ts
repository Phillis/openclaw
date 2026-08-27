import { o as MigrationItem } from "../../plugin-entry-BZAeuuKK.js";
import { ClaudeSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-CcRAjXuR.js";
//#region extensions/migrate-claude/memory.d.ts
declare function buildMemoryItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
  includeInstructions?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildMemoryItems };