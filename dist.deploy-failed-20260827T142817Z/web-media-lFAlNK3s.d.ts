import { a as MsgContext } from "./templating-DM7LQOTt.js";
import { c as SessionScope } from "./types-DWuuepH4.js";
import { a as MediaKind } from "./constants-Bjeg8sLB.js";
import { n as OutboundMediaReadFile } from "./load-options-CblTD2nP.js";
import { LookupAddress } from "node:dns";
import { ImageMetadata } from "rastermill";

//#region src/process/exec-output.d.ts
type CommandOutputCaptureMode = "head" | "tail" | "discard";
type CommandOutputStream = "stdout" | "stderr";
type CommandOutputCaptureOption = CommandOutputCaptureMode | {
  stdout?: CommandOutputCaptureMode;
  stderr?: CommandOutputCaptureMode;
};
type CommandOutputLimitOption = boolean | {
  stdout?: boolean;
  stderr?: boolean;
  combined?: boolean;
};
type PreserveOutputLine = (line: string, stream: CommandOutputStream) => boolean;
//#endregion
//#region src/process/exec-result.d.ts
type SpawnResult = {
  pid?: number;
  stdout: string;
  stderr: string;
  stdoutTruncatedBytes?: number;
  stderrTruncatedBytes?: number;
  preservedStdoutLines?: string[];
  preservedStderrLines?: string[];
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  termination: "exit" | "timeout" | "no-output-timeout" | "signal";
  noOutputTimedOut?: boolean;
  outputLimitExceeded?: boolean;
  outputErrorStream?: "stdout" | "stderr";
};
//#endregion
//#region src/process/exec-runner.d.ts
type CommandOptions = {
  timeoutMs?: number;
  cwd?: string;
  input?: string | Uint8Array;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  windowsVerbatimArguments?: boolean;
  noOutputTimeoutMs?: number;
  signal?: AbortSignal;
  maxOutputBytes?: number | {
    stdout?: number;
    stderr?: number;
  };
  maxCombinedOutputBytes?: number;
  outputCapture?: CommandOutputCaptureOption; /** Observe raw output without owning child lifecycle. Return false to stop the command. */
  onOutputChunk?: (chunk: Buffer, stream: CommandOutputStream) => boolean | void; /** Accept a successful exit when only the selected diagnostic output stream failed. */
  tolerateOutputError?: {
    stdout?: boolean;
    stderr?: boolean;
  };
  terminateOnOutputLimit?: CommandOutputLimitOption;
  maxPreservedOutputLines?: number;
  preserveOutputLine?: PreserveOutputLine;
  killProcessTree?: boolean; /** Signal used when terminating the direct child; tree termination owns its own grace policy. */
  killSignal?: NodeJS.Signals | number;
};
declare function runCommandWithTimeout(argv: string[], optionsOrTimeout: number | CommandOptions): Promise<SpawnResult>;
//#endregion
//#region src/process/exec.d.ts
type RunExecOptions = {
  timeoutMs?: number;
  maxBuffer?: number;
  logOutput?: boolean;
  cwd?: string;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  input?: string | Uint8Array;
  stdinFileDescriptor?: number;
  signal?: AbortSignal;
};
declare function runExec(command: string, args: string[], opts?: number | RunExecOptions): Promise<{
  stdout: string;
  stderr: string;
}>;
//#endregion
//#region src/cli/outbound-send-mapping.d.ts
type CliOutboundSendSource = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/cli/deps.types.d.ts
/** CLI dependency bag currently used by outbound send command plumbing. */
type CliDeps = CliOutboundSendSource;
//#endregion
//#region src/infra/net/ssrf.d.ts
type LookupFn = (hostname: string, options: {
  all: true;
}) => Promise<LookupAddress[]>;
type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  /**
   * Exempt addresses in `fc00::/7` (IPv6 Unique Local Address block, RFC 4193)
   * from the SSRF private-IP block. Companion to
   * `allowRfc2544BenchmarkRange` for fake-ip proxy stacks (sing-box, Clash,
   * Surge) that resolve foreign domains to ULA addresses alongside the IPv4
   * 198.18.0.0/15 range. See #74351.
   */
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  /**
   * Exact HTTP origins that may promote only the current request hostname into
   * `allowedHostnames`. Evaluated per URL inside the redirect loop.
   */
  allowedOrigins?: string[];
  hostnameAllowlist?: string[];
};
type PinnedHostnameOverride = {
  hostname: string;
  addresses: string[];
};
type PinnedDispatcherPolicy = {
  mode: "direct";
  connect?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
} | {
  mode: "env-proxy";
  connect?: Record<string, unknown>;
  proxyTls?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
} | {
  mode: "explicit-proxy";
  proxyUrl: string;
  allowPrivateProxy?: boolean;
  proxyTls?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
};
//#endregion
//#region src/config/sessions/paths.d.ts
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
declare function resolveSessionStorePathCore(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
//#region src/config/sessions/session-key.d.ts
/**
 * Derives the raw session bucket from message context before agent/main-key normalization.
 *
 * Direct chats use sender identity, groups use channel-owned group keys, and global scope bypasses
 * sender routing entirely.
 */
declare function deriveSessionKey(scope: SessionScope, ctx: MsgContext): string;
/**
 * Resolves the persisted session-store key for an inbound message.
 *
 * Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
 * agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
 */
declare function resolveSessionKey(scope: SessionScope, ctx: MsgContext, mainKey?: string, agentId?: string): string;
//#endregion
//#region src/media/image-ops.d.ts
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
//#endregion
//#region src/media/web-media.d.ts
/** Loaded media bytes plus resolved MIME kind and filename metadata for outbound/plugin callers. */
type WebMediaResult = {
  buffer: Buffer;
  contentType?: string;
  kind: MediaKind | undefined;
  fileName?: string; /** Source bytes came from a generated-HTML trust boundary. */
  trustedGeneratedHtmlSource?: boolean;
};
type WebMediaOptions = {
  maxBytes?: number;
  optimizeImages?: boolean;
  imageCompression?: ImageCompressionPolicy;
  ssrfPolicy?: SsrFPolicy;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  readIdleTimeoutMs?: number;
  trustExplicitProxyDns?: boolean;
  workspaceDir?: string; /** Allowed root directories for local path reads. "any" is deprecated; prefer sandboxValidated + readFile. */
  localRoots?: readonly string[] | "any"; /** Channel inbound attachment root patterns checked with inbound path policy semantics. */
  inboundRoots?: readonly string[]; /** Caller already validated the local path (sandbox/other guards); requires readFile override. */
  sandboxValidated?: boolean;
  readFile?: OutboundMediaReadFile; /** Host-local fs-policy read piggyback; rejects plaintext-like document sends. */
  hostReadCapability?: boolean;
};
/** Compression preference used to tune image size/quality search grids. */
type ImageQualityPreference = "auto" | "efficient" | "balanced" | "high";
/** Per-model image compression constraints merged into outbound media policy. */
type ImageCompressionModelPolicy = {
  maxBytes?: number;
  maxPixels?: number;
  maxSidePx?: number;
  preferredSidePx?: number;
};
/** Image compression policy for model/tool callers that need bounded media payloads. */
type ImageCompressionPolicy = {
  quality?: ImageQualityPreference;
  models?: ImageCompressionModelPolicy[];
  imageCount?: number;
};
/** Loads local, remote, hosted, or media-store media and optimizes images by default. */
declare function loadWebMedia(mediaUrl: string, maxBytesOrOptions?: number | WebMediaOptions, options?: {
  ssrfPolicy?: SsrFPolicy;
  localRoots?: readonly string[] | "any";
}): Promise<WebMediaResult>;
//#endregion
export { resolveSessionKey as a, PinnedDispatcherPolicy as c, runExec as d, CommandOptions as f, deriveSessionKey as i, SsrFPolicy as l, SpawnResult as m, getImageMetadata as n, resolveSessionStorePathCore as o, runCommandWithTimeout as p, resizeToJpeg as r, LookupFn as s, loadWebMedia as t, CliDeps as u };