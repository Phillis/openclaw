//#region extensions/openai/realtime-quicksilver-audio-buffer.d.ts
declare const OPENAI_QUICKSILVER_RELAY_FRAME_BYTES: number;
declare class OpenAIQuicksilverPendingAudio {
  private storage;
  private readOffset;
  private pendingBytes;
  get length(): number;
  append(incoming: Buffer): void;
  readInto(target: Buffer): number;
  clear(): void;
}
//#endregion
export { OpenAIQuicksilverPendingAudio as n, OPENAI_QUICKSILVER_RELAY_FRAME_BYTES as t };