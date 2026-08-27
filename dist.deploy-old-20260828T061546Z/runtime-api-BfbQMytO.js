import "./channel-outbound-DO-F9-0m.js";
import "./reply-payload-i0RzN2iF.js";
import "./channel-inbound-BmDzyYQ4.js";
import "./runtime-group-policy-BLXPwMdH.js";
import "./ssrf-runtime-CIuLn0o4.js";
import "./channel-pairing-YowAfeUY.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
