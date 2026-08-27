import { l as ModelProviderConfig, n as OpenClawConfig } from "./types.openclaw-DRR8P0H2.js";
import "./types-cxNMThub.js";
import { r as AuthProfileStore } from "./types-CMmxXHFm.js";
//#region packages/media-understanding-common/src/types.d.ts
/** Kind of media-understanding output produced for an attachment. */
type MediaUnderstandingKind = "audio.transcription" | "video.description" | "image.description";
/** Capability exposed by a media-understanding provider. */
type MediaUnderstandingCapability = "image" | "audio" | "video";
/** Normalized text output produced by media understanding. */
type MediaUnderstandingOutput = {
  kind: MediaUnderstandingKind;
  attachmentIndex: number;
  text: string;
  provider: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
};
//#endregion
//#region src/media-understanding/types.d.ts
/** Agent-owned runtime handle carried opaquely through media provider requests. */
type MediaPreparedModelRuntime = Readonly<{
  agentDir: string;
  workspaceDir?: string;
  config: OpenClawConfig;
  createStores: () => unknown;
}>;
type MediaUnderstandingDecisionOutcome = "success" | "failed" | "skipped" | "disabled" | "no-attachment" | "scope-deny";
type MediaUnderstandingModelDecision = {
  provider?: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
  type: "provider" | "cli";
  outcome: "success" | "skipped" | "failed";
  reason?: string;
};
type MediaUnderstandingAttachmentDecision = {
  attachmentIndex: number;
  attempts: MediaUnderstandingModelDecision[];
  chosen?: MediaUnderstandingModelDecision;
};
type MediaAttachmentDisposition = {
  kind: "handled";
} | {
  kind: "handed-to-native-vision";
} | {
  kind: "not-selected";
} | {
  kind: "capability-disabled";
} | {
  kind: "no-model";
} | {
  kind: "scope-denied";
} | {
  kind: "failed";
  reason?: string;
};
type MediaUnderstandingDecision = {
  capability: MediaUnderstandingCapability;
  outcome: MediaUnderstandingDecisionOutcome;
  attachments: MediaUnderstandingAttachmentDecision[];
  attachmentDispositions?: Record<number, MediaAttachmentDisposition>;
  nativeVisionActive?: boolean;
};
type MediaUnderstandingProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
type MediaUnderstandingProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
type MediaUnderstandingProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: MediaUnderstandingProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: MediaUnderstandingProviderRequestTlsOverride;
};
type MediaUnderstandingProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: MediaUnderstandingProviderRequestAuthOverride;
  proxy?: MediaUnderstandingProviderRequestProxyOverride;
  tls?: MediaUnderstandingProviderRequestTlsOverride;
  /** Runtime-only flag from trusted model-provider config; media config rejects it. */
  allowPrivateNetwork?: boolean;
};
type MediaUnderstandingProviderRequestAuth = {
  kind: "api-key";
  apiKey: string;
  source?: string;
} | {
  kind: "none";
  source: string;
};
type AudioTranscriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  /** Compatibility field for existing providers; prefer auth.kind/apiKey. */
  apiKey: string;
  auth?: MediaUnderstandingProviderRequestAuth;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: MediaUnderstandingProviderRequestTransportOverrides;
  model?: string;
  language?: string;
  prompt?: string;
  query?: Record<string, string | number | boolean>;
  timeoutMs: number;
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
};
type AudioTranscriptionResult = {
  text: string;
  model?: string;
};
type VideoDescriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  /** Compatibility field for existing providers; prefer auth.kind/apiKey. */
  apiKey: string;
  auth?: MediaUnderstandingProviderRequestAuth;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: MediaUnderstandingProviderRequestTransportOverrides;
  model?: string;
  prompt?: string;
  timeoutMs: number;
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
};
type VideoDescriptionResult = {
  text: string;
  model?: string;
};
type ImageDescriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  signal?: AbortSignal;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentId?: string;
  agentDir: string;
  workspaceDir?: string;
  preparedModelRuntime?: MediaPreparedModelRuntime;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};
type ImagesDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type ImagesDescriptionRequest = {
  images: ImagesDescriptionInput[];
  model: string;
  provider: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  signal?: AbortSignal;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentId?: string;
  agentDir: string;
  workspaceDir?: string;
  preparedModelRuntime?: MediaPreparedModelRuntime;
  cfg: OpenClawConfig;
};
type ImageDescriptionResult = {
  text: string;
  model?: string;
};
type ImagesDescriptionResult = {
  text: string;
  model?: string;
};
type StructuredExtractionTextInput = {
  type: "text";
  text: string;
};
type StructuredExtractionImageInput = {
  type: "image";
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type StructuredExtractionInput = StructuredExtractionTextInput | StructuredExtractionImageInput;
type StructuredExtractionRequest = {
  /** Image-first extraction input; callers must include at least one image. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  timeoutMs: number;
  signal?: AbortSignal;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};
type StructuredExtractionResult = {
  text: string;
  parsed?: unknown;
  model?: string;
  provider?: string;
  contentType?: "json" | "text";
};
type MediaUnderstandingDocumentModelDefaults = {
  textExtraction?: string;
  image?: string | false;
};
type MediaUnderstandingProviderAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
type MediaUnderstandingProviderAuthResult = {
  kind: "none";
  source: string;
} | {
  kind: "api-key";
  apiKey: string;
  source: string;
  mode?: "api-key";
};
type MediaUnderstandingProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: "api-key";
};
type MediaUnderstandingProvider = {
  id: string;
  capabilities?: MediaUnderstandingCapability[];
  defaultModels?: Partial<Record<MediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<MediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<Record<"pdf", MediaUnderstandingDocumentModelDefaults>>;
  resolveAuth?: (ctx: MediaUnderstandingProviderAuthContext) => MediaUnderstandingProviderAuthResult | null | undefined;
  /** @deprecated Use resolveAuth. */
  resolveSyntheticAuth?: (ctx: MediaUnderstandingProviderAuthContext) => MediaUnderstandingProviderSyntheticAuthResult | null | undefined;
  transcribeAudio?: (req: AudioTranscriptionRequest) => Promise<AudioTranscriptionResult>;
  describeVideo?: (req: VideoDescriptionRequest) => Promise<VideoDescriptionResult>;
  describeImage?: (req: ImageDescriptionRequest) => Promise<ImageDescriptionResult>;
  describeImages?: (req: ImagesDescriptionRequest) => Promise<ImagesDescriptionResult>;
  extractStructured?: (req: StructuredExtractionRequest) => Promise<StructuredExtractionResult>;
};
//#endregion
export { StructuredExtractionInput as a, MediaUnderstandingProvider as i, AudioTranscriptionResult as n, MediaUnderstandingOutput as o, MediaUnderstandingDecision as r, AudioTranscriptionRequest as t };