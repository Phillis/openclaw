import "./channel-outbound-DhlIXa0y.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./text-chunking-DrVvfnLf.js";
import "./channel-inbound-C_BpWedI.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import "./channel-status-yY5FGndl.js";
import "./channel-actions-CeWsyukw.js";
import "./channel-feedback-DgI18dCP.js";
import "./channel-pairing-BBZdNgVG.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-ingress-h_3NGYrN.js";
import "./webhook-request-guards-BMy0C0la.js";
import "./webhook-targets-D7udUQls.js";
import "./config-api-C20lXtnI.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
