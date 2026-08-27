//#region src/meeting-bot/page-script-source.d.ts
type MeetingPageScriptGlobals = {
  audioOutputs: string;
  captionArchive: string;
  captions: string;
  meeting: string;
};
declare function createMeetingTranscriptSource(params: {
  expectedIdentity?: string;
  finalize: boolean;
  globals: Pick<MeetingPageScriptGlobals, "captionArchive" | "captions" | "meeting">;
  meetingSessionId: string;
  pageIdentitySource: string;
  platformDisplayName: string;
  transcriptMaxLines?: number;
}): string;
declare function createMeetingLeaveSource(params: {
  controlSource: string;
  departedMarkerSource: string;
  documentSetupSource?: string;
  expectedIdentity?: string;
  leaveInitiated: boolean;
  meetingSessionId: string;
  meetingStateSource?: string;
  pageIdentitySource: string;
  platform: {
    displayName: string;
    globals: Pick<MeetingPageScriptGlobals, "audioOutputs" | "meeting">;
  };
  selectors: string;
  sessionMatchSource: string;
}): string;
//#endregion
export { createMeetingLeaveSource, createMeetingTranscriptSource };