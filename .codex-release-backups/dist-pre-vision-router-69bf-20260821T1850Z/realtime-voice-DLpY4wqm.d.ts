//#region src/talk/agent-consult-tool.d.ts
/** Closed policy set controlling whether the consult tool is exposed. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly ["safe-read-only", "owner", "none"];
/** Tool exposure policy for the shared realtime voice consult tool. */
type RealtimeVoiceAgentConsultToolPolicy = (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
//#endregion
export { RealtimeVoiceAgentConsultToolPolicy as t };