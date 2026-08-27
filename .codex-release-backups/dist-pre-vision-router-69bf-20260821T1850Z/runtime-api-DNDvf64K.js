import "./channel-outbound-CI0BSGM5.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./text-chunking-BrrQ2GHk.js";
import "./channel-inbound-BQIYtmB7.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import "./channel-status-BgzZxd8A.js";
import "./channel-actions-Ht8PCq9o.js";
import "./channel-feedback-B6I2nrI5.js";
import "./channel-pairing-BagrMBLr.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-ingress-Bfu_BdL5.js";
import "./webhook-request-guards-DNMZaVoi.js";
import "./webhook-targets-g6lXgrzb.js";
import "./config-api-DpnA44s8.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
