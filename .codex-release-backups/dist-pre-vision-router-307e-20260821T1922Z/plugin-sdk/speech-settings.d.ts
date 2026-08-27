import { V as TtsAutoMode } from "../types.channels-B7ph6mKI.js";
import { Qt as resolveEffectiveTtsConfig, Xt as ResolvedTtsModelOverrides, Yt as ResolvedTtsConfig, Zt as TtsConfigResolutionContext } from "../host-capability-types-BQXGgYpD.js";
import { t as normalizeSpeechProviderId } from "../provider-registry-core-CMuni2u-.js";

//#region src/tts/tts-auto-mode.d.ts
/** Normalize an unknown value into a supported TTS auto mode. */
declare function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined;
//#endregion
export { type ResolvedTtsConfig, type ResolvedTtsModelOverrides, type TtsConfigResolutionContext, normalizeSpeechProviderId, normalizeTtsAutoMode, resolveEffectiveTtsConfig };