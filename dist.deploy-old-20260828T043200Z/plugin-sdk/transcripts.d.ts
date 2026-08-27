import { n as OpenClawConfig, ot as resolveTranscriptsConfig } from "../types.openclaw-BssW6c46.js";
import { a as TranscriptSourceKind, c as TranscriptSourceStatus, d as TranscriptToolAction, f as TranscriptToolCaller, h as TranscriptsStopResult, i as TranscriptSourceAccessControl, l as TranscriptStartRequest, m as TranscriptsStartResult, n as TranscriptParticipant, o as TranscriptSourceLocator, p as TranscriptUtterance, r as TranscriptSessionDescriptor, s as TranscriptSourceProvider, t as TranscriptImportRequest, u as TranscriptStopRequest } from "../provider-types-LPwXd68p.js";
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
export { type MeetingTranscriptSourceRuntime, type TranscriptImportRequest, type TranscriptParticipant, type TranscriptSessionDescriptor, type TranscriptSourceAccessControl, type TranscriptSourceKind, type TranscriptSourceLocator, type TranscriptSourceProvider, type TranscriptSourceStatus, type TranscriptStartRequest, type TranscriptStopRequest, type TranscriptToolAction, type TranscriptToolCaller, type TranscriptUtterance, type TranscriptsStartResult, type TranscriptsStopResult, createMeetingTranscriptSourceProvider, getTranscriptSourceProvider, listTranscriptSourceProviders, normalizeCapabilityProviderId as normalizeTranscriptSourceProviderId, resolveTranscriptsConfig };