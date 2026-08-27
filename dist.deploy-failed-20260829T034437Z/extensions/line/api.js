import { n as lineChannelPluginCommon, t as linePlugin } from "../../channel-Ddm3b_HC.js";
import { r as lineSetupContract, t as lineSetupWizard } from "../../setup-surface-B3lHQJAQ.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { linePlugin, lineSetupPlugin };
