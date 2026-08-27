import { r as zalouserSetupContract } from "./setup-core-DHM_nB74.js";
import { t as createZalouserPluginBase } from "./shared-zdzp3IYc.js";
import { t as zalouserSetupWizard } from "./setup-surface-B8J0P6TN.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
