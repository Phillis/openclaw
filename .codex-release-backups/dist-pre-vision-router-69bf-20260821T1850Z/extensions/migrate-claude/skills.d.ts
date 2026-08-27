import { l as MigrationItem } from "../../types-CCx6rk6K.js";
import { ClaudeSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-Cldaj63W.js";

//#region extensions/migrate-claude/skills.d.ts
declare function buildSkillItems(params: {
  source: ClaudeSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
declare function applyGeneratedSkillItem(item: MigrationItem, opts?: {
  overwrite?: boolean;
}): Promise<MigrationItem>;
//#endregion
export { applyGeneratedSkillItem, buildSkillItems };