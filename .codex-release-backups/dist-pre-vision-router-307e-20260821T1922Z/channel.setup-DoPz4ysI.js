import { r as zalouserSetupContract } from "./setup-core-DeehTuyQ.js";
import { t as createZalouserPluginBase } from "./shared-4vbBvXRo.js";
import { t as zalouserSetupWizard } from "./setup-surface-cQ4bBe0_.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
