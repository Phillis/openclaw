import { S as resolvePinnedHostnameWithPolicy, a as SsrFBlockedError, g as isPrivateNetworkAllowedByPolicy, o as SsrFPolicy, t as LookupFn, v as matchesHostnameAllowlist } from "../ssrf-UB_ute2q.js";
import { s as openLocalFileSafely } from "../root-impl-C4RbsRZF.js";
import { t as FsSafeError } from "../errors-BCyoc29e.js";
import { A as canonicalPathFromExistingAncestor, C as sanitizeUntrustedFileName, M as resolveAbsolutePathForRead, N as resolveAbsolutePathForWrite, S as pathExistsSync, _ as statRegularFileSync, b as resolveLocalPathFromRootsSync, d as appendRegularFile, g as statRegularFile, j as findExistingAncestor, m as readRegularFileSync, o as hasProxyEnvConfigured, p as readRegularFile, t as normalizeHostname, v as withTimeout, x as pathExists } from "../hostname-BBhJGnB6.js";
import { n as FileStoreSync } from "../file-store-Cui6rzwB.js";
import { l as isPathInside, o as root, s as writeExternalFileWithinRoot } from "../fs-safe-D38Q48m-.js";
import { n as redactSensitiveText } from "../redact-speZW_Gf.js";
import { n as extractErrorCode, r as formatErrorMessage } from "../errors-Dxvo_HjC.js";
import { a as parseAccessGroupAllowFromEntry } from "../allow-from-Bdiy2LH6.js";
import { i as shouldIncludeSupplementalContext, n as evaluateSupplementalContextVisibility, r as filterSupplementalContextItems, t as ContextVisibilityDecision } from "../context-visibility-CjUua1CB.js";
import { i as expandAllowFromWithAccessGroups } from "../access-groups-CgVZquhL.js";
import { s as resolvePinnedMainDmOwnerFromAllowlist } from "../dm-policy-shared-DaEyJ0H1.js";
import { r as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-BdLSz-Cn.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";

//#region src/security/external-content.d.ts
type ExternalContentSource = "email" | "webhook" | "api" | "browser" | "channel_metadata" | "web_search" | "web_fetch" | "unknown";
/** Bound sanitized external prose while preserving its exact retained source prefix. */
declare function truncateSanitizedExternalContent(value: string, maxChars: number): {
  text: string;
  truncated: boolean;
  retainedRawChars: number;
};
type WrapExternalContentOptions = {
  /** Source of the external content */source: ExternalContentSource; /** Original sender information (e.g., email address) */
  sender?: string; /** Subject line (for emails) */
  subject?: string; /** External task label associated with the content */
  taskName?: string; /** Whether to include detailed security warning */
  includeWarning?: boolean;
};
/**
 * Wraps external untrusted content with security boundaries and warnings.
 *
 * This function should be used whenever processing content from external sources
 * (emails, webhooks, API calls from untrusted clients) before passing to LLM.
 *
 * @example
 * ```ts
 * const safeContent = wrapExternalContent(emailBody, {
 *   source: "email",
 *   sender: "user@example.com",
 *   subject: "Help request"
 * });
 * // Pass safeContent to LLM instead of raw emailBody
 * ```
 */
declare function wrapExternalContent(content: string, options: WrapExternalContentOptions): string;
/**
 * Wraps web search/fetch content with security markers.
 * This is a simpler wrapper for web tools that just need content wrapped.
 */
declare function wrapWebContent(content: string, source?: "web_search" | "web_fetch"): string;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-paths.d.ts
type InvalidPathResult = {
  ok: false;
  error: string;
};
type ResolvePathsWithinRootParams = {
  rootDir: string;
  requestedPaths: string[];
  scopeLabel: string;
};
type ResolvePathsWithinRootResult = {
  ok: true;
  paths: string[];
} | InvalidPathResult;
type PathScopeResolveOptions = {
  defaultName?: string;
};
type PathScopeOptions = {
  label: string;
};
type PathScope = {
  rootDir: string;
  label: string;
  resolve(requestedPath: string, options?: PathScopeResolveOptions): {
    ok: true;
    path: string;
  } | {
    ok: false;
    error: string;
  };
  resolveAll(requestedPaths: string[]): ResolvePathsWithinRootResult;
  existing(requestedPaths: string[]): Promise<ResolvePathsWithinRootResult>;
  files(requestedPaths: string[]): Promise<ResolvePathsWithinRootResult>;
  writable(requestedPath: string, options?: PathScopeResolveOptions): Promise<{
    ok: true;
    path: string;
  } | {
    ok: false;
    error: string;
  }>;
  ensureDir(requestedPath: string, options?: PathScopeResolveOptions & {
    mode?: number;
  }): Promise<{
    ok: true;
    path: string;
  } | {
    ok: false;
    error: string;
  }>;
};
declare function resolveExistingPathsWithinRoot(params: ResolvePathsWithinRootParams): Promise<ResolvePathsWithinRootResult>;
declare function resolveStrictExistingPathsWithinRoot(params: ResolvePathsWithinRootParams): Promise<ResolvePathsWithinRootResult>;
declare function pathScope(rootDir: string, options: PathScopeOptions): PathScope;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/symlink-parents.d.ts
type AssertNoSymlinkParentsOptions = {
  rootDir: string;
  targetPath: string;
  allowMissing?: boolean;
  allowOutsideRoot?: boolean;
  allowRootChildSymlink?: boolean;
  requireDirectories?: boolean;
  messagePrefix?: string;
};
declare function assertNoSymlinkParents(params: AssertNoSymlinkParentsOptions): Promise<void>;
declare function assertNoSymlinkParentsSync(params: AssertNoSymlinkParentsOptions): void;
//#endregion
//#region src/security/channel-metadata.d.ts
/**
 * Build bounded, externally wrapped channel metadata for prompt context.
 * Channel-provided labels can be user-controlled, so keep the result externally wrapped.
 */
declare function buildChannelMetadata(params: {
  source: string;
  label: string;
  entries: Array<string | null | undefined>;
  maxChars?: number;
}): string | undefined;
/** @deprecated Use buildChannelMetadata. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
declare const buildUntrustedChannelMetadata: typeof buildChannelMetadata;
//#endregion
//#region src/security/safe-regex.d.ts
type SafeRegexRejectReason = "empty" | "unsafe-nested-repetition" | "invalid-regex";
type SafeRegexCompileResult = {
  regex: RegExp;
  source: string;
  flags: string;
  reason: null;
} | {
  regex: null;
  source: string;
  flags: string;
  reason: SafeRegexRejectReason;
};
declare function compileSafeRegexDetailed(source: string, flags?: string): SafeRegexCompileResult;
//#endregion
//#region src/infra/private-file-store.d.ts
type PrivateFileStoreSync = FileStoreSync;
/** Create a sync private file store rooted at `rootDir`. */
declare function privateFileStoreSync(rootDir: string): PrivateFileStoreSync;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/replace-file-copy-fallback.d.ts
type ReplaceFileDestinationHardlinkPolicy = "reject";
type ReplaceFileCopyFallbackRestorePolicy = "restore-original" | "none";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/replace-file.d.ts
type ReplaceFileAtomicFileSystem = {
  promises: Pick<typeof fs$1, "mkdir" | "writeFile" | "rename" | "copyFile" | "unlink" | "rm" | "open" | "stat" | "lstat"> & {
    /** @deprecated Accepted for adapter compatibility but never called. */chmod?: typeof fs$1.chmod;
  };
};
type ReplaceFileAtomicBaseOptions = {
  filePath: string;
  content: string | Uint8Array;
  dirMode?: number;
  mode?: number;
  preserveExistingMode?: boolean;
  tempPrefix?: string;
  renameMaxRetries?: number;
  renameRetryBaseDelayMs?: number;
  copyFallbackOnPermissionError?: boolean;
  copyFallbackRestore?: ReplaceFileCopyFallbackRestorePolicy;
  maxRestoreBytes?: number;
  destinationHardlinks?: ReplaceFileDestinationHardlinkPolicy;
  syncTempFile?: boolean;
  syncParentDir?: boolean;
  throwOnCleanupError?: boolean;
};
type ReplaceFileAtomicOptions = ReplaceFileAtomicBaseOptions & {
  fileSystem?: ReplaceFileAtomicFileSystem;
  beforeRename?: (params: {
    filePath: string;
    tempPath: string;
  }) => Promise<void>;
};
type ReplaceFileAtomicResult = {
  method: "rename" | "copy-fallback";
};
declare function replaceFileAtomic$1(options: ReplaceFileAtomicOptions): Promise<ReplaceFileAtomicResult>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/move-path.d.ts
type MovePathWithCopyFallbackOptions = {
  from: string;
  sourceHardlinks?: "allow" | "reject";
  to: string;
};
declare function movePathWithCopyFallback(options: MovePathWithCopyFallbackOptions): Promise<void>;
//#endregion
//#region src/infra/replace-file.d.ts
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
declare const replaceFileAtomic: typeof replaceFileAtomic$1;
//#endregion
//#region src/infra/ports.d.ts
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
declare function ensurePortAvailable(port: number, host?: string): Promise<void>;
//#endregion
//#region src/security/secret-equal.d.ts
/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
//#endregion
//#region src/plugin-sdk/security-runtime.d.ts
/** Public security runtime helpers for plugin-side trust boundaries. */
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
declare function fileExists(filePath: string): boolean;
//#endregion
export { type ContextVisibilityDecision, FsSafeError, type LookupFn, type SafeRegexRejectReason, SsrFBlockedError, type SsrFPolicy, appendRegularFile, assertNoSymlinkParents, assertNoSymlinkParentsSync, buildChannelMetadata, buildUntrustedChannelMetadata, canonicalPathFromExistingAncestor, compileSafeRegexDetailed, ensurePortAvailable, evaluateSupplementalContextVisibility, expandAllowFromWithAccessGroups, extractErrorCode, fileExists, filterSupplementalContextItems, findExistingAncestor, formatErrorMessage, hasProxyEnvConfigured, isPathInside, isPrivateNetworkAllowedByPolicy, matchesHostnameAllowlist, movePathWithCopyFallback, normalizeHostname, openLocalFileSafely, parseAccessGroupAllowFromEntry, pathExists, pathExistsSync, pathScope, privateFileStoreSync, readRegularFile, readRegularFileSync, redactSensitiveText, replaceFileAtomic, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveExistingPathsWithinRoot, resolveLocalPathFromRootsSync, resolvePinnedHostnameWithPolicy, resolvePinnedMainDmOwnerFromAllowlist, resolvePreferredOpenClawTmpDir, resolveStrictExistingPathsWithinRoot, root, safeEqualSecret, sanitizeUntrustedFileName, shouldIncludeSupplementalContext, statRegularFile, statRegularFileSync, truncateSanitizedExternalContent, withTimeout, wrapExternalContent, wrapWebContent, writeExternalFileWithinRoot };