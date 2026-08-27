import "./channel-outbound-CI0BSGM5.js";
import "./reply-payload-DBNGwex4.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./channel-inbound-BQIYtmB7.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./channel-pairing-BagrMBLr.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
