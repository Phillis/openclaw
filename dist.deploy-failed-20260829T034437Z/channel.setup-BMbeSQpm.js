import { r as zalouserSetupContract } from "./setup-core-PPNa9MjD.js";
import { t as createZalouserPluginBase } from "./shared-CMHMg4RL.js";
import { t as zalouserSetupWizard } from "./setup-surface-Ck7MPESc.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
