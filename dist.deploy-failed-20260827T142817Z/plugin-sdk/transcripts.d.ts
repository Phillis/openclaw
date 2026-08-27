import { it as resolveTranscriptsConfig, n as OpenClawConfig } from "../types.openclaw-CNftZ6Ix.js";
import { a as TranscriptSourceLocator, c as TranscriptStartRequest, d as TranscriptsStartResult, f as TranscriptsStopResult, i as TranscriptSourceKind, l as TranscriptStopRequest, n as TranscriptParticipant, o as TranscriptSourceProvider, r as TranscriptSessionDescriptor, s as TranscriptSourceStatus, t as TranscriptImportRequest, u as TranscriptUtterance } from "../provider-types-DIZT6Dex.js";
import { t as normalizeCapabilityProviderId } from "../provider-registry-shared-BstaErUn.js";

//#region src/transcripts/provider-registry.d.ts
/** Transcript providers use targeted lookup to avoid broad capability discovery. */
declare const listTranscriptSourceProviders: (cfg?: OpenClawConfig) => TranscriptSourceProvider[], getTranscriptSourceProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => TranscriptSourceProvider | undefined;
//#endregion
//#region src/meeting-bot/transcripts-bridge.d.ts
type MeetingTranscriptSourceRuntime = {
  startTranscriptSource(request: TranscriptStartRequest): Promise<TranscriptsStartResult>;
  stopTranscriptSource(request: TranscriptStopRequest): Promise<TranscriptsStopResult>;
};
declare function createMeetingTranscriptSourceProvider(params: {
  id: string;
  aliases?: readonly string[];
  name: string;
  runtime: () => Promise<MeetingTranscriptSourceRuntime>;
}): TranscriptSourceProvider;
//#endregion
export { type MeetingTranscriptSourceRuntime, type TranscriptImportRequest, type TranscriptParticipant, type TranscriptSessionDescriptor, type TranscriptSourceKind, type TranscriptSourceLocator, type TranscriptSourceProvider, type TranscriptSourceStatus, type TranscriptStartRequest, type TranscriptStopRequest, type TranscriptUtterance, type TranscriptsStartResult, type TranscriptsStopResult, createMeetingTranscriptSourceProvider, getTranscriptSourceProvider, listTranscriptSourceProviders, normalizeCapabilityProviderId as normalizeTranscriptSourceProviderId, resolveTranscriptsConfig };