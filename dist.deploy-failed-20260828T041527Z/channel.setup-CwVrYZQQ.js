import { r as zalouserSetupContract } from "./setup-core-r6PlZ_Cq.js";
import { t as createZalouserPluginBase } from "./shared-y42qQfhq.js";
import { t as zalouserSetupWizard } from "./setup-surface-C2Cpcmwl.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
