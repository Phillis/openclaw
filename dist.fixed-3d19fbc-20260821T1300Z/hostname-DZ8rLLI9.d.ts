import { l as ReadResult, o as SymlinkPolicy, t as HardlinkPolicy } from "./root-impl-B4uQBsrS.js";
import { n as FsSafeErrorCode, t as FsSafeError } from "./errors-DXNB0NHR.js";
import fs, { Stats } from "node:fs";

//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/absolute-path.d.ts
type AbsolutePathSymlinkPolicy = "reject" | "follow";
type ResolvedAbsolutePath = {
  path: string;
  canonicalPath: string;
};
type ResolvedWritableAbsolutePath = ResolvedAbsolutePath & {
  parentDir: string;
  parentExists: boolean;
};
type EnsureAbsoluteDirectoryOptions = {
  scopeLabel?: string;
  mode?: number;
};
type EnsureAbsoluteDirectoryResult = {
  ok: true;
  path: string;
} | {
  ok: false;
  code: FsSafeErrorCode;
  error: FsSafeError;
};
declare function assertAbsolutePathInput(filePath: string): string;
declare function findExistingAncestor(filePath: string): Promise<string | null>;
declare function canonicalPathFromExistingAncestor(filePath: string): Promise<string>;
declare function resolveAbsolutePathForRead(filePath: string, options?: {
  symlinks?: AbsolutePathSymlinkPolicy;
}): Promise<ResolvedAbsolutePath>;
declare function resolveAbsolutePathForWrite(filePath: string, options?: {
  symlinks?: AbsolutePathSymlinkPolicy;
}): Promise<ResolvedWritableAbsolutePath>;
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/filename.d.ts
declare function sanitizeUntrustedFileName(fileName: string, fallbackName: string): string;
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/fs.d.ts
/**
 * Returns true when `fs.stat()` can stat the path.
 *
 * This follows stat semantics: broken symlinks return false, while symlinks to
 * existing targets return true.
 */
declare function pathExists(filePath: string): Promise<boolean>;
/**
 * Synchronous counterpart to `pathExists()`, with the same `fs.statSync()`
 * semantics.
 */
declare function pathExistsSync(filePath: string): boolean;
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/local-roots.d.ts
type LocalRootsPathResult = {
  path: string;
  root: string;
};
type LocalRootsReadResult = ReadResult & {
  root: string;
};
type LocalRootsInputOptions = {
  filePath: string;
  roots: readonly string[];
  label?: string;
};
type ResolveLocalPathFromRootsSyncOptions = LocalRootsInputOptions & {
  allowMissing?: boolean;
  requireFile?: boolean;
};
type ReadLocalFileFromRootsOptions = LocalRootsInputOptions & {
  hardlinks?: HardlinkPolicy;
  maxBytes?: number;
  nonBlockingRead?: boolean;
  symlinks?: SymlinkPolicy;
};
declare function resolveLocalPathFromRootsSync(options: ResolveLocalPathFromRootsSyncOptions): LocalRootsPathResult | null;
declare function readLocalFileFromRoots(options: ReadLocalFileFromRootsOptions): Promise<LocalRootsReadResult | null>;
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/timing.d.ts
declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, labelOrOptions?: string | {
  label?: string;
  message?: string;
  createError?: () => Error;
}): Promise<T>;
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/regular-file.d.ts
type RegularFileStatResult = {
  missing: true;
} | {
  missing: false;
  stat: Stats;
};
type RegularFileAppendFlagConstants = Pick<typeof fs.constants, "O_APPEND" | "O_CREAT" | "O_WRONLY"> & Partial<Pick<typeof fs.constants, "O_NOFOLLOW">>;
type AppendRegularFileOptions = {
  filePath: string;
  content: string | Uint8Array;
  encoding?: BufferEncoding;
  maxFileBytes?: number;
  mode?: number;
  rejectSymlinkParents?: boolean;
};
declare function resolveRegularFileAppendFlags(constants?: RegularFileAppendFlagConstants): number;
declare function statRegularFile(filePath: string): Promise<RegularFileStatResult>;
declare function statRegularFileSync(filePath: string): RegularFileStatResult;
declare function readRegularFile(params: {
  filePath: string;
  maxBytes?: number;
}): Promise<{
  buffer: Buffer;
  stat: Stats;
}>;
declare function readRegularFileSync(params: {
  filePath: string;
  maxBytes?: number;
}): {
  buffer: Buffer;
  stat: Stats;
};
declare function appendRegularFile(options: AppendRegularFileOptions): Promise<void>;
declare function appendRegularFileSync(options: AppendRegularFileOptions): void;
//#endregion
//#region src/infra/net/proxy-env.d.ts
declare const PROXY_ENV_KEYS: readonly ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"];
/** Return whether any supported proxy environment variable is non-blank. */
declare function hasProxyEnvConfigured(env?: NodeJS.ProcessEnv): boolean;
/** Explicit proxy option shape accepted by undici EnvHttpProxyAgent. */
type EnvHttpProxyAgentProxyOptions = {
  /** Proxy URL used for HTTP requests. */httpProxy?: string; /** Proxy URL used for HTTPS requests. */
  httpsProxy?: string;
};
/**
 * Match undici EnvHttpProxyAgent semantics for env-based HTTP/S proxy selection:
 * - lower-case vars take precedence over upper-case
 * - HTTPS requests prefer https_proxy/HTTPS_PROXY, then fall back to http_proxy/HTTP_PROXY
 * - ALL_PROXY is ignored by EnvHttpProxyAgent
 */
declare function resolveEnvHttpProxyUrl(protocol: "http" | "https", env?: NodeJS.ProcessEnv): string | undefined;
/** Return whether EnvHttpProxyAgent-style HTTP/S proxy resolution finds a proxy URL. */
declare function hasEnvHttpProxyConfigured(protocol?: "http" | "https", env?: NodeJS.ProcessEnv): boolean;
/**
 * Build explicit options for undici's EnvHttpProxyAgent.
 *
 * EnvHttpProxyAgent does not read ALL_PROXY itself, but it accepts explicit
 * HTTP/HTTPS proxy overrides. Keep this helper separate from the
 * HTTP(S)-only URL helpers so SSRF trusted-env proxy gates do not widen.
 */
declare function resolveEnvHttpProxyAgentOptions(env?: NodeJS.ProcessEnv): EnvHttpProxyAgentProxyOptions | undefined;
/** Return whether explicit EnvHttpProxyAgent options can be built from the environment. */
declare function hasEnvHttpProxyAgentConfigured(env?: NodeJS.ProcessEnv): boolean;
/** Return whether a target URL should use configured HTTP/S env proxy variables. */
declare function shouldUseEnvHttpProxyForUrl(targetUrl: string, env?: NodeJS.ProcessEnv): boolean;
/**
 * Check whether a target URL should bypass the HTTP proxy per NO_PROXY env var.
 *
 * Mirrors undici EnvHttpProxyAgent semantics
 * (`undici/lib/dispatcher/env-http-proxy-agent.js`):
 * - Entries separated by commas OR whitespace (undici splits on `/[,\s]/`)
 * - Case-insensitive
 * - Lower-case `no_proxy` shadows upper-case `NO_PROXY`, including blank values
 * - Empty or missing → no bypass
 * - Bare `*` value → bypass everything
 * - Exact hostname match
 * - Leading-dot match (`.example.com` matches `foo.example.com`)
 * - Leading `*.` wildcard match (`*.example.com` matches `foo.example.com`);
 *   undici normalizes via `.replace(/^\*?\./, '')`, so the bare domain also
 *   matches (kept in sync with that behavior)
 * - Subdomain suffix match (`openai.com` matches `api.openai.com`)
 * - Optional `:port` suffix; when present, must match target port
 * - IPv6 literals in bracketed (`[::1]`) or bare (`::1`) form
 * - OpenClaw extension: IPv4 CIDR and octet-wildcard entries
 *   (`100.64.0.0/10`, `100.64.*`) bypass the trusted env proxy mode before
 *   undici's EnvHttpProxyAgent is selected.
 *
 * Undici does not export its matcher, so this is a targeted reimplementation
 * kept in sync with the upstream file above. Paired with
 * `hasEnvHttpProxyConfigured` this gates the trusted-env-proxy auto-upgrade
 * in provider HTTP helpers; see openclaw#64974 review thread on NO_PROXY
 * SSRF bypass.
 */
declare function matchesNoProxy(targetUrl: string, env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/infra/net/hostname.d.ts
/** Normalize a hostname for policy comparisons. */
declare function normalizeHostname(hostname: string): string;
//#endregion
export { canonicalPathFromExistingAncestor as A, sanitizeUntrustedFileName as C, ResolvedAbsolutePath as D, EnsureAbsoluteDirectoryResult as E, resolveAbsolutePathForRead as M, resolveAbsolutePathForWrite as N, ResolvedWritableAbsolutePath as O, pathExistsSync as S, EnsureAbsoluteDirectoryOptions as T, statRegularFileSync as _, hasEnvHttpProxyConfigured as a, resolveLocalPathFromRootsSync as b, resolveEnvHttpProxyAgentOptions as c, appendRegularFile as d, appendRegularFileSync as f, statRegularFile as g, resolveRegularFileAppendFlags as h, hasEnvHttpProxyAgentConfigured as i, findExistingAncestor as j, assertAbsolutePathInput as k, resolveEnvHttpProxyUrl as l, readRegularFileSync as m, EnvHttpProxyAgentProxyOptions as n, hasProxyEnvConfigured as o, readRegularFile as p, PROXY_ENV_KEYS as r, matchesNoProxy as s, normalizeHostname as t, shouldUseEnvHttpProxyForUrl as u, withTimeout as v, AbsolutePathSymlinkPolicy as w, pathExists as x, readLocalFileFromRoots as y };