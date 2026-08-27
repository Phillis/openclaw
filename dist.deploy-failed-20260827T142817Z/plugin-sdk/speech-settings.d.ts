import { V as TtsAutoMode } from "../types.channels-D0WNvlsX.js";
import { Qt as resolveEffectiveTtsConfig, Xt as ResolvedTtsModelOverrides, Yt as ResolvedTtsConfig, Zt as TtsConfigResolutionContext } from "../host-capability-types-3XBDy-df.js";
import { t as normalizeSpeechProviderId } from "../provider-registry-core-Ca6Ns0ee.js";

//#region src/tts/tts-auto-mode.d.ts
/** Normalize an unknown value into a supported TTS auto mode. */
declare function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined;
//#endregion
export { type ResolvedTtsConfig, type ResolvedTtsModelOverrides, type TtsConfigResolutionContext, normalizeSpeechProviderId, normalizeTtsAutoMode, resolveEffectiveTtsConfig };