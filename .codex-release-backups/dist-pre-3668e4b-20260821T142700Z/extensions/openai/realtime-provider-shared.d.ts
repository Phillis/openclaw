//#region extensions/openai/realtime-provider-shared.d.ts
declare function readRealtimeErrorDetail(error: unknown): string;
declare function resolveOpenAIProviderConfigRecord(config: Record<string, unknown>): Record<string, unknown> | undefined;
declare function captureOpenAIRealtimeWsClose(params: {
  url: string;
  flowId: string;
  capability: "realtime-transcription" | "realtime-voice";
  code: unknown;
  reasonBuffer: unknown;
}): void;
type OpenAIRealtimeClientSecretResult = {
  value: string;
  expiresAt?: number;
};
declare function createOpenAIRealtimeClientSecret(params: {
  authToken: string;
  auditContext: string;
  session: Record<string, unknown>;
  authRejectedMessage?: string;
}): Promise<OpenAIRealtimeClientSecretResult>;
declare function createOpenAIRealtimeTranscriptionClientSecret(params: {
  authToken: string;
  auditContext: string;
  session: Record<string, unknown>;
  authRejectedMessage?: string;
}): Promise<OpenAIRealtimeClientSecretResult>;
//#endregion
export { captureOpenAIRealtimeWsClose, createOpenAIRealtimeClientSecret, createOpenAIRealtimeTranscriptionClientSecret, readRealtimeErrorDetail, resolveOpenAIProviderConfigRecord };