import { t as canonicalizeBase64 } from "./base64-Vw7DZYSc.js";
import "./media-runtime-qcekT37I.js";
//#region extensions/voice-call/src/media-base64.ts
function canonicalizeVoiceCallMediaBase64(payloadBase64) {
	return canonicalizeBase64(payloadBase64.replaceAll("-", "+").replaceAll("_", "/"));
}
//#endregion
export { canonicalizeVoiceCallMediaBase64 as t };
