import { l as MigrationItem } from "../../types-7E39v2Gx.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-CASEHYOP.js";

//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };