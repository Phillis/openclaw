import { l as MigrationItem } from "../../types-DYqBZyXL.js";
import { ClaudeSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-C6E7h6qW.js";

//#region extensions/migrate-claude/memory.d.ts
declare function buildMemoryItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
  includeInstructions?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildMemoryItems };