import { j as TtsAutoMode } from "./types.openclaw-DckSqIPo.js";
//#region src/utils/boolean.d.ts
/** Returns only real boolean values and leaves boolean-like strings for explicit parsing. */
declare function asBoolean(value: unknown): boolean | undefined;
//#endregion
//#region src/tts/tts-provider-helpers.d.ts
/** Resolve the first non-blank API key in provider-defined precedence order. */
declare function resolveSpeechProviderApiKey(...candidates: Array<string | undefined>): string | undefined;
declare function requireInRange(value: number, min: number, max: number, label: string): void;
declare function normalizeLanguageCode(code?: string): string | undefined;
declare function normalizeApplyTextNormalization(mode?: string): "auto" | "on" | "off" | undefined;
declare function normalizeSeed(seed?: number): number | undefined;
declare function scheduleCleanup(tempDir: string, delayMs?: number): void;
//#endregion
//#region src/tts/tts-auto-mode.d.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
declare const TTS_AUTO_MODES: Set<TtsAutoMode>;
/** Normalize an unknown value into a supported TTS auto mode. */
declare function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined;
//#endregion
export { normalizeSeed as a, scheduleCleanup as c, normalizeLanguageCode as i, asBoolean as l, normalizeTtsAutoMode as n, requireInRange as o, normalizeApplyTextNormalization as r, resolveSpeechProviderApiKey as s, TTS_AUTO_MODES as t };