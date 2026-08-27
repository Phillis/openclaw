import { r as zalouserSetupContract } from "./setup-core-Aa9LZ84T.js";
import { t as createZalouserPluginBase } from "./shared-CkhvXNr6.js";
import { t as zalouserSetupWizard } from "./setup-surface-b68X2EU2.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
