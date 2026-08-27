import { n as lineChannelPluginCommon, t as linePlugin } from "../../channel-B6OrjOls.js";
import { r as lineSetupContract, t as lineSetupWizard } from "../../setup-surface-BHPX96hV.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { linePlugin, lineSetupPlugin };
