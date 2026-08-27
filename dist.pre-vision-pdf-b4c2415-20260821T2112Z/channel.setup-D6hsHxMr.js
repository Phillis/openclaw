import { r as zalouserSetupContract } from "./setup-core-BmwCXOYR.js";
import { t as createZalouserPluginBase } from "./shared-ggGVzn7f.js";
import { t as zalouserSetupWizard } from "./setup-surface-C7zLBqEK.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
