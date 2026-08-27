import { r as zalouserSetupContract } from "./setup-core-BhRoyl_r.js";
import { t as createZalouserPluginBase } from "./shared-D-gvs9qM.js";
import { t as zalouserSetupWizard } from "./setup-surface-CeMKaz0Z.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
