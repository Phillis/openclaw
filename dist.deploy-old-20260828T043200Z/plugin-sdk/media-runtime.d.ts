import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import "../types-336a6ztO.js";
import { O as MediaUnderstandingCapability, l as MediaUnderstandingProvider } from "../types-DY2Fz8pS.js";
import { a as mediaKindFromMime, i as maxBytesForKind, n as MAX_IMAGE_BYTES, r as MediaKind, t as MAX_AUDIO_BYTES } from "../constants-BCpSHoXd.js";
import "../templating-tHzj-d8O.js";
import { n as OutboundMediaReadFile, r as buildOutboundMediaLoadOptions, t as OutboundMediaAccess } from "../load-options-BwtyeSvQ.js";
import { A as OutboundSendDeps } from "../types-C7JZOS3G.js";
import { n as normalizePollDurationHours, r as normalizePollInput, t as PollInput } from "../polls-sXqxREW1.js";
import "../types.adapters-DkCKs5U0.js";
import { n as ChannelOutboundAdapter } from "../outbound.types-0KyfFtcR.js";
import "../deliver-DtA9USSL.js";
import "../ssrf-DNrB9j1Q.js";
import { a as kindFromMime, i as isGifMedia, n as extensionForMime, r as getFileExtension, t as detectMime } from "../mime-DQ7_7W8X.js";
import { i as isImageProcessorUnavailableError, n as buildImageResizeSideGrid, o as resizeToJpeg, r as getImageMetadata, t as IMAGE_REDUCE_QUALITY_STEPS } from "../media-services-BG_PwyV4.js";
import { a as readRemoteMediaBuffer, c as isVoiceCompatibleAudio, i as fetchRemoteMedia, l as isVoiceMessageCompatibleAudio, n as MediaFetchError, o as saveRemoteMedia, r as SavedRemoteMedia, s as saveResponseMedia, t as FetchLike } from "../fetch-CMrNV4wI.js";
import { t as ActiveMediaModel } from "../active-model-Cxn6sQSw.js";
import { c as saveMediaSource, i as getMediaDir, n as ensureMediaDir, r as extractOriginalFilename, s as saveMediaBuffer, t as SavedMedia } from "../store-CU-s5VWG.js";
import { t as getAgentScopedMediaLocalRoots } from "../local-roots-CT9Phl4w.js";
import { n as buildAgentMediaPayload } from "../agent-media-payload-In1yg6mX.js";
import { i as normalizeInboundPathRoots, t as isInboundPathAllowed } from "../inbound-path-policy-nRJfbQMX.js";
import { h as readResponseWithLimit, m as readResponseTextSnippet } from "../http-body-Byq65kac.js";
import { t as transcribeFirstAudio } from "../audio-preflight-BTfroiiU.js";
import { t as describeImageWithModel } from "../image-runtime-DME3Gex4.js";
//#region src/media/audio-transcode.d.ts
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
declare function transcodeAudioBufferToOpus(params: {
  audioBuffer: Buffer;
  inputExtension?: string;
  inputFileName?: string;
  tempPrefix?: string;
  outputFileName?: string;
  timeoutMs?: number;
  sampleRateHz?: number;
  bitrate?: string;
  channels?: number;
  /** Maximum output duration passed to ffmpeg's `-t` option. */
  maxDurationSeconds?: number;
}): Promise<Buffer>;
/** Outcome for lightweight container transcodes that may be unsupported or intentionally skipped. */
type AudioContainerTranscodeOutcome = {
  ok: true;
  buffer: Buffer;
} | {
  ok: false;
  reason: "platform-unsupported" | "invalid-extension" | "noop-same-container" | "no-recipe" | "transcoder-failed";
  detail?: string;
};
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
declare function transcodeAudioBuffer(params: {
  audioBuffer: Buffer;
  sourceExtension: string;
  targetExtension: string;
  timeoutMs?: number;
}): Promise<AudioContainerTranscodeOutcome>;
//#endregion
//#region src/media/ffmpeg-exec.d.ts
/** Process limits and optional stdin payload for ffmpeg/ffprobe helper calls. */
type MediaExecOptions = {
  timeoutMs?: number;
  maxBufferBytes?: number;
  input?: Buffer | string;
  stdinFileDescriptor?: number;
};
/** Resolves ffmpeg from trusted system paths before command execution. */
declare function resolveFfmpegBin(): string;
/** Runs ffprobe with optional stdin input. */
declare function runFfprobe(args: string[], options?: MediaExecOptions): Promise<string>;
/** Runs ffmpeg with bounded timeout and buffer settings. */
declare function runFfmpeg(args: string[], options?: MediaExecOptions): Promise<string>;
/** Parses codec and positive sample rate from compact ffprobe stream output. */
declare function parseFfprobeCodecAndSampleRate(stdout: string): {
  codec: string | null;
  sampleRateHz: number | null;
};
//#endregion
//#region src/media/media-probe.d.ts
/** Positive video dimensions reported by ffprobe for the first video stream. */
type VideoDimensions = {
  width: number;
  height: number;
};
/** Probes a video buffer while preserving the existing public media-runtime API. */
declare function probeVideoDimensions(buffer: Buffer): Promise<VideoDimensions | undefined>;
//#endregion
//#region packages/media-core/src/base64.d.ts
/** Estimates decoded bytes without allocating a cleaned copy of the base64 payload. */
declare function estimateBase64DecodedBytes(base64: string): number;
/**
 * Normalizes and validates a base64 string, returning canonical no-whitespace
 * base64 only when the input has valid alphabet, padding, and length.
 */
declare function canonicalizeBase64(base64: string): string | undefined;
//#endregion
//#region packages/media-core/src/content-length.d.ts
/** Parses a Content-Length header as a safe integer or rejects malformed values. */
declare function parseMediaContentLength(raw: string | null): number | null;
//#endregion
//#region src/media/ffmpeg-limits.d.ts
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
declare const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS: number;
//#endregion
//#region src/media/outbound-attachment.d.ts
/** Loads a remote/local media URL and stages it into the outbound media store. */
declare function resolveOutboundAttachmentFromUrl(mediaUrl: string, maxBytes: number, options?: {
  mediaAccess?: OutboundMediaAccess;
  localRoots?: readonly string[];
  readFile?: (filePath: string) => Promise<Buffer>;
}): Promise<{
  path: string;
  contentType?: string;
}>;
//#endregion
//#region src/media/png-encode.d.ts
/**
 * Writes one RGBA pixel into a width-strided buffer.
 * Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
 */
declare function fillPixel(buf: Buffer, x: number, y: number, width: number, r: number, g: number, b: number, a?: number): void;
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
declare function encodePngRgba(buffer: Buffer, width: number, height: number): Buffer;
//#endregion
//#region src/media/qr-image.d.ts
type QrPngRenderOptions = {
  scale?: number;
  marginModules?: number;
};
/** Temp-file write options kept to filename segments so callers cannot choose parent paths. */
type QrPngTempFileOptions = QrPngRenderOptions & {
  tmpRoot: string;
  dirPrefix: string;
  fileName?: string;
};
type QrPngTempFile = {
  filePath: string;
  dirPath: string;
  mediaLocalRoots: string[];
};
/** Renders QR text as raw PNG base64 after validating bounded renderer options. */
declare function renderQrPngBase64(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Renders QR text as a PNG data URL. */
declare function renderQrPngDataUrl(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Writes QR PNG output into a scoped temp directory and returns that directory as a media root. */
declare function writeQrPngTempFile(input: string, opts: QrPngTempFileOptions): Promise<QrPngTempFile>;
//#endregion
//#region src/media/qr-terminal.d.ts
/** Renders QR text for terminal display, with an optional compact half-block mode. */
declare function renderQrTerminal(input: string, opts?: {
  small?: boolean;
}): Promise<string>;
//#endregion
//#region src/media/temp-files.d.ts
/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
declare function unlinkIfExists(filePath: string | null | undefined): Promise<void>;
//#endregion
//#region src/channels/plugins/media-limits.d.ts
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
declare function resolveChannelMediaMaxBytes(params: {
  cfg: OpenClawConfig;
  resolveChannelLimitMb: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => number | undefined;
  accountId?: string | null;
}): number | undefined;
//#endregion
//#region src/channels/plugins/outbound/direct-text-media.d.ts
type DirectSendOptions = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  replyToId?: string | null;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  maxBytes?: number;
};
type DirectSendResult = {
  messageId: string;
  [key: string]: unknown;
};
type DirectSendFn<TOpts extends Record<string, unknown>, TResult extends DirectSendResult> = (to: string, text: string, opts: TOpts) => Promise<TResult>;
/**
 * Builds a media byte-limit resolver for channels with `mediaMaxMb` config.
 */
declare function createScopedChannelMediaMaxBytesResolver(channel: string): (params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => number | undefined;
/**
 * Creates a channel outbound adapter backed by direct text/media send functions.
 */
declare function createDirectTextMediaOutbound<TOpts extends Record<string, unknown>, TResult extends DirectSendResult>(params: {
  channel: string;
  resolveSender: (deps: OutboundSendDeps | undefined) => DirectSendFn<TOpts, TResult>;
  resolveMaxBytes: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => number | undefined;
  buildTextOptions: (params: DirectSendOptions) => TOpts;
  buildMediaOptions: (params: DirectSendOptions) => TOpts;
}): ChannelOutboundAdapter;
//#endregion
//#region src/media-understanding/defaults.d.ts
/** Resolves the default provider model for a media capability from config or manifest metadata. */
declare function resolveDefaultMediaModel(params: {
  providerId: string;
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
  includeConfiguredImageModels?: boolean;
}): string | undefined;
/** Resolves auto-discovery provider order for a media capability using manifest priorities. */
declare function resolveAutoMediaKeyProviders(params: {
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string[];
//#endregion
//#region src/media-understanding/runner.d.ts
declare function resolveAutoImageModel(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  activeModel?: ActiveMediaModel;
}): Promise<ActiveMediaModel | null>;
//#endregion
export { type FetchLike, IMAGE_REDUCE_QUALITY_STEPS, MAX_AUDIO_BYTES, MAX_IMAGE_BYTES, MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS, MediaFetchError, type MediaKind, type OutboundMediaAccess, type OutboundMediaReadFile, type PollInput, type SavedMedia, type SavedRemoteMedia, buildAgentMediaPayload, buildImageResizeSideGrid, buildOutboundMediaLoadOptions, canonicalizeBase64, createDirectTextMediaOutbound, createScopedChannelMediaMaxBytesResolver, describeImageWithModel, detectMime, encodePngRgba, ensureMediaDir, estimateBase64DecodedBytes, extensionForMime, extractOriginalFilename, fetchRemoteMedia, fillPixel, getAgentScopedMediaLocalRoots, getFileExtension, getImageMetadata, getMediaDir, isGifMedia, isImageProcessorUnavailableError, isInboundPathAllowed, isVoiceCompatibleAudio, isVoiceMessageCompatibleAudio, kindFromMime, maxBytesForKind, mediaKindFromMime, normalizeInboundPathRoots, normalizePollDurationHours, normalizePollInput, parseFfprobeCodecAndSampleRate, parseMediaContentLength, probeVideoDimensions, readRemoteMediaBuffer, readResponseTextSnippet, readResponseWithLimit, renderQrPngBase64, renderQrPngDataUrl, renderQrTerminal, resizeToJpeg, resolveAutoImageModel, resolveAutoMediaKeyProviders, resolveChannelMediaMaxBytes, resolveDefaultMediaModel, resolveFfmpegBin, resolveOutboundAttachmentFromUrl, runFfmpeg, runFfprobe, saveMediaBuffer, saveMediaSource, saveRemoteMedia, saveResponseMedia, transcodeAudioBuffer, transcodeAudioBufferToOpus, transcribeFirstAudio, unlinkIfExists, writeQrPngTempFile };