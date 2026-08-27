import { n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
import "./types-Sg3pk96c.js";
import "./types-vfwkTnFP.js";
import "./plugin-metadata-snapshot.types-9gBeaSYD.js";
import { r as AuthProfileStore } from "./types-D6ppgs_3.js";
import { t as MediaNormalizationEntry } from "./normalization-CdPHM6JL.js";
import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-Ck7fh8Hg.js";
import { Dispatcher } from "undici";
//#region src/video-generation/types.d.ts
/** Video asset returned by a provider after generation or transformation. */
type GeneratedVideoAsset = {
  /** Non-empty raw video bytes; may accompany url as a delivery fallback. */
  buffer?: Buffer;
  /** Provider-hosted URL returned instead of bytes or alongside them as a delivery fallback.
   * When buffer is absent, callers can forward or download without materializing the video. */
  url?: string;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
/** Resolution label accepted by video generation providers. */
type VideoGenerationResolution = "360P" | "480P" | "540P" | "720P" | "768P" | "1080P" | (string & {});
/**
 * Canonical semantic role hints for reference assets (first/last frame,
 * reference image/video/audio). Providers may accept additional role strings;
 * the asset.role type accepts both canonical values and arbitrary strings.
 */
type VideoGenerationAssetRole = "first_frame" | "last_frame" | "reference_image" | "reference_video" | "reference_audio";
/** Source media asset supplied to image/video/audio-to-video providers. */
type VideoGenerationSourceAsset = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  /**
   * Optional semantic role hint forwarded to the provider. Canonical values
   * come from `VideoGenerationAssetRole`; plain strings are accepted for
   * provider-specific extensions.
   */
  role?: VideoGenerationAssetRole | (string & {});
  metadata?: Record<string, unknown>;
};
/** Context passed when checking whether a video provider is configured. */
type VideoGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Context passed when resolving model-specific video generation capabilities. */
type VideoGenerationModelCapabilitiesContext = {
  provider: string;
  model: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
};
/** Normalized request object passed to a selected video generation provider. */
type VideoGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number;
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[];
  /** Reference audio assets (e.g. background music) forwarded to the provider. */
  inputAudios?: VideoGenerationSourceAsset[];
  /** Arbitrary provider-specific parameters forwarded as-is (e.g. seed, draft, camerafixed). */
  providerOptions?: Record<string, unknown>;
};
/** Provider video generation response returned to the runtime. */
type VideoGenerationResult = {
  videos: GeneratedVideoAsset[];
  model?: string;
  metadata?: Record<string, unknown>;
};
/** Supported high-level video generation operation modes. */
type VideoGenerationMode = "generate" | "imageToVideo" | "videoToVideo";
/**
 * Primitive type tag for a declared `providerOptions` key. Keep narrow —
 * plugins that need richer shapes should leave them out of the typed contract
 * and interpret the forwarded opaque value inside their own provider code.
 */
type VideoGenerationProviderOptionType = "number" | "boolean" | "string";
/** Capability limits and supported options for one video generation mode. */
type VideoGenerationModeCapabilities = {
  maxVideos?: number;
  maxInputImages?: number;
  maxInputImagesByModel?: Readonly<Record<string, number>>;
  maxInputVideos?: number;
  maxInputVideosByModel?: Readonly<Record<string, number>>;
  /** Max number of reference audio assets the provider accepts (e.g. background music, voice reference). */
  maxInputAudios?: number;
  maxInputAudiosByModel?: Readonly<Record<string, number>>;
  maxDurationSeconds?: number;
  supportedDurationSeconds?: readonly number[];
  supportedDurationSecondsByModel?: Readonly<Record<string, readonly number[]>>;
  sizes?: readonly string[];
  aspectRatios?: readonly string[];
  resolutions?: readonly VideoGenerationResolution[];
  supportsSize?: boolean;
  supportsAspectRatio?: boolean;
  supportsResolution?: boolean;
  supportsAudio?: boolean;
  supportsWatermark?: boolean;
  /**
   * Declared typed schema for `VideoGenerationRequest.providerOptions`. Keys
   * listed here are accepted and validated against the declared primitive
   * type before forwarding; unknown keys or type mismatches skip the
   * candidate provider at runtime so mis-typed or provider-specific options
   * never silently reach the wrong provider.
   */
  providerOptions?: Readonly<Record<string, VideoGenerationProviderOptionType>>;
};
/** Capability block for transform modes that may be independently enabled. */
type VideoGenerationTransformCapabilities = VideoGenerationModeCapabilities & {
  enabled: boolean;
};
/** Full provider capability map including base and transform mode overrides. */
type VideoGenerationProviderCapabilities = VideoGenerationModeCapabilities & {
  generate?: VideoGenerationModeCapabilities;
  imageToVideo?: VideoGenerationTransformCapabilities;
  videoToVideo?: VideoGenerationTransformCapabilities;
};
/** Static catalog metadata that overrides provider defaults for one video model. */
type VideoGenerationCatalogModelEntry = {
  capabilities?: VideoGenerationProviderCapabilities;
  modes?: readonly VideoGenerationMode[];
};
/** Video generation provider contract implemented by provider plugins. */
type VideoGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  models?: string[];
  capabilities: VideoGenerationProviderCapabilities;
  catalogByModel?: Readonly<Record<string, VideoGenerationCatalogModelEntry>>;
  isConfigured?: (ctx: VideoGenerationProviderConfiguredContext) => boolean;
  resolveModelCapabilities?: (ctx: VideoGenerationModelCapabilitiesContext) => VideoGenerationProviderCapabilities | undefined | Promise<VideoGenerationProviderCapabilities | undefined>;
  generateVideo: (req: VideoGenerationRequest) => Promise<VideoGenerationResult>;
};
type VideoGenerationIgnoredOverride = {
  key: "size" | "aspectRatio" | "resolution" | "audio" | "watermark";
  value: string | boolean;
};
type VideoGenerationNormalization = {
  size?: MediaNormalizationEntry<string>;
  aspectRatio?: MediaNormalizationEntry<string>;
  resolution?: MediaNormalizationEntry<VideoGenerationResolution>;
  durationSeconds?: MediaNormalizationEntry<number>;
};
//#endregion
//#region src/agents/provider-request-config.d.ts
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
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
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region src/infra/net/pinned-dispatcher-pool.d.ts
type PinnedDispatcherLease = {
  dispatcher: Dispatcher;
  reused: boolean;
  release: () => Promise<void>;
};
type PinnedDispatcherPoolOptions = {
  maxEntries: number;
  idleTtlMs: number;
};
/**
 * Bounded cache of reusable DNS-pinned dispatchers.
 *
 * Callers must perform fresh DNS and SSRF validation before every acquisition
 * and include the resulting origin, address set, and connection policy in the key.
 */
declare class PinnedDispatcherPool {
  private readonly entries;
  private readonly ownedEntries;
  private readonly maxEntries;
  private readonly idleTtlMs;
  private closed;
  constructor(options: PinnedDispatcherPoolOptions);
  acquire(params: {
    key: string;
    groupKey: string;
    createDispatcher: () => Dispatcher;
  }): PinnedDispatcherLease | undefined;
  closeAll(): Promise<void>;
  private createLease;
  private retireEntry;
  private startClose;
}
//#endregion
//#region src/infra/net/fetch-guard.d.ts
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
declare const GUARDED_FETCH_MODE: {
  readonly STRICT: "strict";
  readonly TRUSTED_ENV_PROXY: "trusted_env_proxy";
  readonly TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy";
};
type GuardedFetchMode = (typeof GUARDED_FETCH_MODE)[keyof typeof GUARDED_FETCH_MODE];
type GuardedFetchOptions = {
  url: string;
  fetchImpl?: FetchLike;
  init?: RequestInit;
  capture?: false | {
    flowId?: string;
    meta?: Record<string, unknown>;
    sensitiveRequestHeaderNames?: readonly string[];
  };
  maxRedirects?: number;
  /**
   * Allow replaying unsafe request methods and bodies across cross-origin redirects.
   * Sensitive cross-origin headers (for example Authorization/Cookie) are still stripped.
   * Defaults to false.
   */
  allowCrossOriginUnsafeRedirectReplay?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  requireHttps?: boolean;
  policy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  retainAuthorizationRedirectHostnameAllowlist?: string[];
  mode?: GuardedFetchMode;
  pinDns?: boolean;
  /** @deprecated use `mode: "trusted_env_proxy"` for trusted/operator-controlled URLs. */
  proxy?: "env";
  /**
   * @deprecated use `mode: "trusted_env_proxy"` instead.
   */
  dangerouslyAllowEnvProxyWithoutPinnedDns?: boolean;
  auditContext?: string;
  /** Internal opt-in for reusing freshly revalidated, direct pinned dispatchers. */
  dispatcherPool?: PinnedDispatcherPool;
};
type GuardedFetchResult = {
  response: Response;
  finalUrl: string;
  release: () => Promise<void>;
  refreshTimeout?: () => void;
  dispatcherReused?: boolean;
};
declare function fetchWithSsrFGuard(params: GuardedFetchOptions): Promise<GuardedFetchResult>;
//#endregion
export { VideoGenerationNormalization as a, VideoGenerationSourceAsset as c, VideoGenerationIgnoredOverride as i, ModelProviderRequestTransportOverrides as n, VideoGenerationProvider as o, GeneratedVideoAsset as r, VideoGenerationResolution as s, fetchWithSsrFGuard as t };