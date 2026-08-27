import "./channel-outbound-aGOT1sXi.js";
import "./reply-payload-DBNGwex4.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import "./channel-inbound-d8SJMJZS.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./channel-pairing-DFmBJcuC.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
