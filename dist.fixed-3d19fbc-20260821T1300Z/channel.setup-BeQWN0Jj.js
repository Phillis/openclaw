import { r as zalouserSetupContract } from "./setup-core-B4b8lHiF.js";
import { t as createZalouserPluginBase } from "./shared-CXaiz9mz.js";
import { t as zalouserSetupWizard } from "./setup-surface-CORIgzAO.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
