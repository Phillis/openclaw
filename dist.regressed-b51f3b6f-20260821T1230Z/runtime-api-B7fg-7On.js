import "./channel-outbound-DhlIXa0y.js";
import "./reply-payload-DBNGwex4.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./channel-inbound-C_BpWedI.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./channel-pairing-BBZdNgVG.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
