import "./channel-outbound-vVeKbh9E.js";
import "./channel-inbound-Db8kr_sV.js";
import "./runtime-group-policy-BLXPwMdH.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./text-chunking-CJz4kAsi.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import "./channel-status-Bt34VDhN.js";
import "./channel-actions-AIJ6nLei.js";
import "./channel-feedback-CJM4EQH2.js";
import "./channel-pairing-CPNZh_3Y.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-ingress-IarruVNi.js";
import "./webhook-request-guards-BYzmIdMp.js";
import "./webhook-targets-CO7f-8rt.js";
import "./config-api-CZzsoMzm.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
