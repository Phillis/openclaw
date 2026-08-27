import { F as MigrationItem } from "../../runtime-api-B8urSeFb.js";
import { HermesSource } from "./source.js";
import { t as PlannedMigrationTargets } from "../../targets-BCy_KoFf.js";
//#region extensions/migrate-hermes/skills.d.ts
declare function buildSkillItems(params: {
  source: HermesSource;
  targets: PlannedMigrationTargets;
  overwrite?: boolean;
}): Promise<MigrationItem[]>;
//#endregion
export { buildSkillItems };