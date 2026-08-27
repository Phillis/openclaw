//#region src/talk/activation-name.d.ts
declare const REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS = 2;
/** Transcript edge where an activation name was heard. */
type RealtimeVoiceActivationNameEdge = "leading" | "trailing";
/** Whether the heard name matched exactly or through the guarded fuzzy path. */
type RealtimeVoiceActivationNameMatchKind = "exact" | "fuzzy";
/** Activation-name match result plus transcript text with the name removed. */
type RealtimeVoiceActivationNameTranscriptResult = {
  allowed: true;
  text: string;
  activationName: string;
  heardName: string;
  match: RealtimeVoiceActivationNameMatchKind;
  edge: RealtimeVoiceActivationNameEdge;
} | {
  allowed: false;
  text: string;
};
/** Count alphanumeric words in a configured activation name. */
declare function realtimeVoiceActivationNameWordCount(value: string): number;
/** Normalize configured activation names while preserving word boundaries. */
declare function normalizeRealtimeVoiceActivationName(value: string): string | undefined;
/** Extract the supported leading activation-name prefix from a longer phrase. */
declare function normalizeRealtimeVoiceActivationNamePrefix(value: string, maxWords?: number): string | undefined;
/** Validate the configured activation name length bound. */
declare function isSupportedRealtimeVoiceActivationName(value: string, maxWords?: number): boolean;
/** Normalize and reject unsupported activation names in one reusable step. */
declare function normalizeSupportedRealtimeVoiceActivationName(value: string | undefined, maxWords?: number): string | undefined;
/** Prefer longer names first so nested names match the most specific option. */
declare function sortRealtimeVoiceActivationNames(names: string[]): string[];
/** Match and strip a configured activation name from either transcript edge. */
declare function matchRealtimeVoiceActivationName(text: string, activationNames: string[], maxWords?: number): Extract<RealtimeVoiceActivationNameTranscriptResult, {
  allowed: true;
}> | undefined;
//#endregion
export { isSupportedRealtimeVoiceActivationName as a, normalizeRealtimeVoiceActivationNamePrefix as c, sortRealtimeVoiceActivationNames as d, RealtimeVoiceActivationNameTranscriptResult as i, normalizeSupportedRealtimeVoiceActivationName as l, RealtimeVoiceActivationNameEdge as n, matchRealtimeVoiceActivationName as o, RealtimeVoiceActivationNameMatchKind as r, normalizeRealtimeVoiceActivationName as s, REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS as t, realtimeVoiceActivationNameWordCount as u };