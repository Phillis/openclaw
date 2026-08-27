import { t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import "./media-runtime-BdAMhkEx.js";
//#region extensions/voice-call/src/media-base64.ts
function canonicalizeVoiceCallMediaBase64(payloadBase64) {
	return canonicalizeBase64(payloadBase64.replaceAll("-", "+").replaceAll("_", "/"));
}
//#endregion
export { canonicalizeVoiceCallMediaBase64 as t };
