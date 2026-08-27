import { do as ResolvedTtsConfig, fo as ResolvedTtsModelOverrides, lo as TtsConfigResolutionContext, oo as normalizeSpeechProviderId, uo as resolveEffectiveTtsConfig } from "../agent-harness-runtime-D3DJE4wK.js";
import { lt as TtsAutoMode } from "../types.openclaw-Cjm06lg9.js";
//#region src/tts/tts-auto-mode.d.ts
/** Normalize an unknown value into a supported TTS auto mode. */
declare function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined;
//#endregion
export { type ResolvedTtsConfig, type ResolvedTtsModelOverrides, type TtsConfigResolutionContext, normalizeSpeechProviderId, normalizeTtsAutoMode, resolveEffectiveTtsConfig };