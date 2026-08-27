import { r as zalouserSetupContract } from "./setup-core-Bu1GA28d.js";
import { t as createZalouserPluginBase } from "./shared-DFIebC8r.js";
import { t as zalouserSetupWizard } from "./setup-surface-Bv_uLN5s.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
