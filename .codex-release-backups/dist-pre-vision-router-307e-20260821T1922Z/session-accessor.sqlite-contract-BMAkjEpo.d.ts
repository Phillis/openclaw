//#region src/config/sessions/session-accessor.types.d.ts
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
//#endregion
export { SessionTranscriptRuntimeTarget as t };