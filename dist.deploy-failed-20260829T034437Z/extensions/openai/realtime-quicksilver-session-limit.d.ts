//#region extensions/openai/realtime-quicksilver-session-limit.d.ts
declare function reserveOpenAIQuicksilverSession(owner: unknown, opts?: {
  expiresAtMs?: number;
}): void;
declare function releaseOpenAIQuicksilverSession(owner: unknown): void;
//#endregion
export { releaseOpenAIQuicksilverSession, reserveOpenAIQuicksilverSession };