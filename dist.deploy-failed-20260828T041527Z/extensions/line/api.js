import { n as lineChannelPluginCommon, t as linePlugin } from "../../channel-9XlKZV4S.js";
import { r as lineSetupContract, t as lineSetupWizard } from "../../setup-surface-CU0lmNov.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { linePlugin, lineSetupPlugin };
