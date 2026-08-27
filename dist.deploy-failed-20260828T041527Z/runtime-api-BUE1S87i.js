import "./channel-outbound-DO-F9-0m.js";
import "./channel-inbound-BmDzyYQ4.js";
import "./runtime-group-policy-BLXPwMdH.js";
import "./ssrf-runtime-CIuLn0o4.js";
import "./text-chunking-CJz4kAsi.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import "./channel-status-Bt34VDhN.js";
import "./channel-actions-D2ZN81sL.js";
import "./channel-feedback-CJM4EQH2.js";
import "./channel-pairing-YowAfeUY.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-ingress-ByuWujwG.js";
import "./webhook-request-guards-BYzmIdMp.js";
import "./webhook-targets-Bm2XLMzf.js";
import "./config-api-CZzsoMzm.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
