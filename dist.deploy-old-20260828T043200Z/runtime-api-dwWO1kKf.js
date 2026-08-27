import "./channel-outbound-0oFCMpw9.js";
import "./reply-payload-i0RzN2iF.js";
import "./channel-inbound-BllqRtTK.js";
import "./runtime-group-policy-BLXPwMdH.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./channel-pairing-CPNZh_3Y.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
