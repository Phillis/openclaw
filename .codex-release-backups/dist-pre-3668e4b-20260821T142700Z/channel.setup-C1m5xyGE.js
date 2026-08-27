import { r as zalouserSetupContract } from "./setup-core-BA6ilSt5.js";
import { t as createZalouserPluginBase } from "./shared-C1dFJ-be.js";
import { t as zalouserSetupWizard } from "./setup-surface-DaFCP4q9.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
