import { kt as MemoryExtraPath, r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import { n as SecretInput } from "./types.secrets-BrR1WS-r.js";
import "./config-Cj6rqxXJ.js";
//#region src/sessions/transcript-events.d.ts
/** Storage-neutral identity for the session transcript that changed. */
type SessionTranscriptUpdateTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath?: string;
};
type SessionTranscriptUpdateFields = {
  sessionFile?: string;
  target?: SessionTranscriptUpdateTarget;
  sessionKey?: string;
  agentId?: string;
  sessionId?: string;
  /** Committed lifecycle owner; internal delivery must not expose it publicly. */
  lifecycleRevision?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
  runId?: string;
};
/** Normalized transcript update emitted after a session transcript changes. */
type SessionTranscriptUpdate = Omit<SessionTranscriptUpdateFields, "sessionFile" | "lifecycleRevision" | "target"> & {
  target: Omit<SessionTranscriptUpdateTarget, "storePath">;
};
/** Internal transcript update that may identify a transcript without a file path. */
type InternalSessionTranscriptUpdate = SessionTranscriptUpdateFields;
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
type InternalSessionTranscriptListener = (update: InternalSessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Registers an internal listener for identity-only or file-backed transcript updates. */
declare function onInternalSessionTranscriptUpdate(listener: InternalSessionTranscriptListener): () => void;
//#endregion
//#region packages/memory-host-sdk/src/host/multimodal.d.ts
declare const MEMORY_MULTIMODAL_SPECS: {
  readonly image: {
    readonly labelPrefix: "Image file";
    readonly extensions: readonly [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];
  };
  readonly audio: {
    readonly labelPrefix: "Audio file";
    readonly extensions: readonly [".mp3", ".wav", ".ogg", ".opus", ".m4a", ".m2a", ".aac", ".flac"];
  };
};
/** Supported multimodal memory modality. */
type MemoryMultimodalModality = keyof typeof MEMORY_MULTIMODAL_SPECS;
/** Normalized multimodal memory ingestion settings. */
type MemoryMultimodalSettings = {
  enabled: boolean;
  modalities: MemoryMultimodalModality[];
  maxFileBytes: number;
};
//#endregion
//#region src/agents/memory-search.d.ts
type ResolvedMemorySearchConfig = {
  enabled: boolean;
  rememberAcrossConversations: boolean;
  /** Sources indexed by the manager. */
  sources: Array<"memory" | "sessions">;
  /** Sources searched when memory_search omits an explicit corpus. */
  searchSources: Array<"memory" | "sessions">;
  extraPaths: MemoryExtraPath[];
  multimodal: MemoryMultimodalSettings;
  provider: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
    nonBatchConcurrency?: number;
    batch?: {
      enabled: boolean;
      wait: boolean;
      concurrency: number;
      pollIntervalMs: number;
      timeoutMinutes: number;
    };
  };
  experimental: {
    sessionMemory: boolean;
  };
  fallback: string;
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
  local: {
    modelPath?: string;
    modelCacheDir?: string;
    contextSize?: number | "auto";
  };
  store: {
    driver: "sqlite";
    databasePath: string;
    fts: {
      tokenizer: "unicode61" | "trigram";
    };
    vector: {
      enabled: boolean;
      extensionPath?: string;
    };
  };
  chunking: {
    tokens: number;
    overlap: number;
  };
  sync: {
    onSessionStart: boolean;
    onSearch: boolean;
    watch: boolean;
    watchDebounceMs: number;
    intervalMinutes: number;
    embeddingBatchTimeoutSeconds: number | undefined;
    sessions: {
      deltaBytes: number;
      deltaMessages: number;
      postCompactionForce: boolean;
    };
  };
  query: {
    maxResults: number;
    minScore: number;
    hybrid: {
      enabled: boolean;
      vectorWeight: number;
      textWeight: number;
      candidateMultiplier: number;
      mmr: {
        enabled: boolean;
        lambda: number;
      };
      temporalDecay: {
        enabled: boolean;
        halfLifeDays: number;
      };
    };
  };
  cache: {
    enabled: boolean;
    maxEntries?: number;
  };
};
type ResolvedMemorySearchSyncConfig = ResolvedMemorySearchConfig["sync"];
declare function resolveMemorySearchConfig(cfg: OpenClawConfig, agentId: string): ResolvedMemorySearchConfig | null;
declare function resolveMemorySearchSyncConfig(cfg: OpenClawConfig, agentId: string): ResolvedMemorySearchSyncConfig | null;
//#endregion
export { onSessionTranscriptUpdate as a, onInternalSessionTranscriptUpdate as i, resolveMemorySearchConfig as n, resolveMemorySearchSyncConfig as r, ResolvedMemorySearchConfig as t };