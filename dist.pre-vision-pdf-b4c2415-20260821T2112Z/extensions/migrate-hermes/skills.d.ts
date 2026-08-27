import { l as MigrationItem } from "../../types-BwmvzNiR.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-5QQMDjT6.js";

//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };