import "./channel-outbound-BbXJ4rch.js";
import "./reply-payload-DBNGwex4.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./channel-inbound-BBUw8SLQ.js";
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
