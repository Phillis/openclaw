import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { Rn as RealtimeTranscriptionProviderPlugin, dr as RealtimeTranscriptionProviderId, fr as RealtimeTranscriptionProviderResolveConfigContext, hr as RealtimeTranscriptionSessionCreateRequest, lr as RealtimeTranscriptionProviderConfig, mr as RealtimeTranscriptionSessionCallbacks, pr as RealtimeTranscriptionSession, ur as RealtimeTranscriptionProviderConfiguredContext } from "../types-BJ8oTDFw.js";
import { t as normalizeCapabilityProviderId } from "../provider-registry-shared-BstaErUn.js";

//#region src/realtime-transcription/provider-registry.d.ts
/** Realtime transcription uses targeted lookup to avoid broad capability discovery. */
declare const listRealtimeTranscriptionProviders: (cfg?: OpenClawConfig) => RealtimeTranscriptionProviderPlugin[], getRealtimeTranscriptionProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => RealtimeTranscriptionProviderPlugin | undefined;
/** Canonicalizes a configured provider id while preserving unknown ids. */
declare function canonicalizeRealtimeTranscriptionProviderId(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeTranscriptionProviderId | undefined;
//#endregion
//#region src/realtime-transcription/websocket-session.d.ts
type RealtimeTranscriptionWebSocketTransport = {
  readonly callbacks: RealtimeTranscriptionSessionCallbacks;
  closeNow(): void;
  failConnect(error: Error): void;
  isOpen(): boolean;
  isReady(): boolean;
  markReady(): void;
  sendBinary(payload: Buffer): boolean;
  sendJson(payload: unknown): boolean;
};
/** Provider-specific hooks for creating a websocket transcription session. */
type RealtimeTranscriptionWebSocketSessionOptions<Event = unknown> = {
  callbacks: RealtimeTranscriptionSessionCallbacks;
  connectClosedBeforeReadyMessage?: string;
  connectTimeoutMessage?: string;
  connectTimeoutMs?: number;
  closeTimeoutMs?: number;
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>);
  maxQueuedBytes?: number;
  maxReconnectAttempts?: number;
  onClose?: (transport: RealtimeTranscriptionWebSocketTransport) => void;
  onMessage?: (event: Event, transport: RealtimeTranscriptionWebSocketTransport) => void;
  onOpen?: (transport: RealtimeTranscriptionWebSocketTransport) => void;
  parseMessage?: (payload: Buffer) => Event;
  providerId: string;
  readyOnOpen?: boolean;
  reconnectDelayMs?: number;
  reconnectLimitMessage?: string;
  sendAudio: (audio: Buffer, transport: RealtimeTranscriptionWebSocketTransport) => void;
  url: string | (() => string | Promise<string>);
};
/** Creates a reusable websocket session wrapper for a provider implementation. */
declare function createRealtimeTranscriptionWebSocketSession<Event = unknown>(options: RealtimeTranscriptionWebSocketSessionOptions<Event>): RealtimeTranscriptionSession;
//#endregion
export { type RealtimeTranscriptionProviderConfig, type RealtimeTranscriptionProviderConfiguredContext, type RealtimeTranscriptionProviderId, type RealtimeTranscriptionProviderPlugin, type RealtimeTranscriptionProviderResolveConfigContext, type RealtimeTranscriptionSession, type RealtimeTranscriptionSessionCallbacks, type RealtimeTranscriptionSessionCreateRequest, type RealtimeTranscriptionWebSocketSessionOptions, type RealtimeTranscriptionWebSocketTransport, canonicalizeRealtimeTranscriptionProviderId, createRealtimeTranscriptionWebSocketSession, getRealtimeTranscriptionProvider, listRealtimeTranscriptionProviders, normalizeCapabilityProviderId as normalizeRealtimeTranscriptionProviderId };