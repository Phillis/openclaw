import { n as lineChannelPluginCommon, t as linePlugin } from "../../channel-pwsESS_F.js";
import { r as lineSetupContract, t as lineSetupWizard } from "../../setup-surface-Ddo6di22.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { linePlugin, lineSetupPlugin };
