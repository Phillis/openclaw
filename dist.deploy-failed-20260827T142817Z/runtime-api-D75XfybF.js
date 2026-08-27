import "./channel-outbound-aGOT1sXi.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import "./text-chunking-DrVvfnLf.js";
import "./channel-inbound-d8SJMJZS.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import "./channel-status-yY5FGndl.js";
import "./channel-actions-DHWyakIv.js";
import "./channel-feedback-DgI18dCP.js";
import "./channel-pairing-DFmBJcuC.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-ingress-Bh_CUqSI.js";
import "./webhook-request-guards-BMy0C0la.js";
import "./webhook-targets-DJkaUYZG.js";
import "./config-api-C20lXtnI.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
