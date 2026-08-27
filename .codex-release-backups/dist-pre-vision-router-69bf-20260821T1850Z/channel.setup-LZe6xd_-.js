import { r as zalouserSetupContract } from "./setup-core-BdKLZPqG.js";
import { t as createZalouserPluginBase } from "./shared-BmlFQXEn.js";
import { t as zalouserSetupWizard } from "./setup-surface-BOWwbDqs.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
