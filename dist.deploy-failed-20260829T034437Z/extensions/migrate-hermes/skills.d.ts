import { F as MigrationItem } from "../../runtime-api-IAhSVA75.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-BtI04PuT.js";
//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };