//#region src/talk/realtime-session-lifecycle.d.ts
type RealtimeVoiceAudioOverflowPolicy = "drop-oldest" | "reject-newest";
type RealtimeVoiceAudioQueue = {
  clear: () => void;
  dequeue: () => Buffer | undefined;
  drain: () => Buffer[];
  enqueue: (audio: Buffer) => boolean;
};
declare function createRealtimeVoiceAudioQueue(overflowPolicy: RealtimeVoiceAudioOverflowPolicy, onOverflow?: () => void): RealtimeVoiceAudioQueue;
type RealtimeVoiceSessionPhase = "idle" | "connecting" | "ready" | "retry-wait" | "terminal";
type RealtimeVoiceTerminalOutcome = "completed" | "error";
type RealtimeVoiceSessionConnection = Readonly<{
  id: symbol;
  signal: AbortSignal;
}>;
type RealtimeVoiceConnectAttempt = {
  readonly promise: Promise<void>;
  readonly ready: boolean;
  readonly settled: boolean;
  readonly startupFailed: boolean;
  reject: (error: Error) => void;
  rejectStartup: (error: Error) => boolean;
  resolve: (providerReady?: boolean) => void;
  startTimeout: () => void;
};
type RealtimeVoiceConnectAttemptOptions = {
  connection: RealtimeVoiceSessionConnection;
  onAbort: (outcome: RealtimeVoiceTerminalOutcome | undefined) => void;
  onTimeout: () => void;
  timeoutError: () => Error;
  timeoutMs: number;
};
declare class RealtimeVoiceSessionLifecycle {
  private readonly label;
  private state;
  private connectPromise;
  private readonly pendingAudio;
  private pendingAudioOverflowReported;
  constructor(label: string, options?: {
    pendingAudioOverflowPolicy?: RealtimeVoiceAudioOverflowPolicy;
    onPendingAudioOverflow?: () => void;
  });
  connect(start: (connection: RealtimeVoiceSessionConnection) => Promise<void>): Promise<void>;
  reconnect(connection: RealtimeVoiceSessionConnection): RealtimeVoiceSessionConnection | undefined;
  ready(connection: RealtimeVoiceSessionConnection): boolean;
  retry(connection: RealtimeVoiceSessionConnection, maxAttempts: number): {
    attempt: number;
    signal: AbortSignal;
  } | "exhausted" | undefined;
  createConnectAttempt(options: RealtimeVoiceConnectAttemptOptions): RealtimeVoiceConnectAttempt;
  cancel(): boolean;
  failure(connection: RealtimeVoiceSessionConnection): boolean;
  close(connection: RealtimeVoiceSessionConnection, outcome: RealtimeVoiceTerminalOutcome): RealtimeVoiceTerminalOutcome | undefined;
  currentConnection(): RealtimeVoiceSessionConnection | undefined;
  isCurrent(connection: RealtimeVoiceSessionConnection): boolean;
  acceptsEvents(connection: RealtimeVoiceSessionConnection): boolean;
  isReady(): boolean;
  phase(): RealtimeVoiceSessionPhase;
  terminalOutcome(connection: RealtimeVoiceSessionConnection): RealtimeVoiceTerminalOutcome | undefined;
  enqueuePendingAudio(audio: Buffer): boolean;
  drainPendingAudio(): Buffer[];
  private clearPendingAudio;
  private createFreshConnection;
  private createConnection;
  private currentState;
}
//#endregion
export { createRealtimeVoiceAudioQueue as i, RealtimeVoiceSessionConnection as n, RealtimeVoiceSessionLifecycle as r, RealtimeVoiceAudioQueue as t };