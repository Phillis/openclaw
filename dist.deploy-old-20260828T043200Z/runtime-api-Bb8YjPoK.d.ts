import "./plugin-entry-BZAeuuKK.js";
import "./types.openclaw-CZEJqSSW.js";
import { M as OutputRuntimeEnv } from "./target-registry-types-Ny7UXMrh.js";
import "./types-BL7F42yR.js";
import "./setup-wizard-types-BW-DTrda.js";
import "./markdown-tables.types-bT4dRxv9.js";
import "./install-security-scan.types-_JTtCcZ6.js";
import "./config-contracts-CAOod931.js";
import "./ssrf-runtime-BvO_PP7L.js";
//#region src/infra/dedupe.d.ts
/** Small in-memory TTL/LRU-style cache for replay and duplicate suppression. */
type DedupeCache = {
  /** Returns true for a recent duplicate; records the key and optional owner when absent. */
  check: (key: string | undefined | null, now?: number, ownerToken?: object) => boolean;
  /** Returns true for a recent duplicate without refreshing or recording the key. */
  peek: (key: string | undefined | null, now?: number) => boolean;
  delete: (key: string | undefined | null, ownerToken?: object) => void;
  clear: () => void;
  size: () => number;
};
/** Dedupe cache bounds; ttlMs <= 0 disables expiry, maxSize <= 0 disables storage. */
type DedupeCacheOptions = {
  ttlMs: number;
  maxSize: number;
};
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
declare function createDedupeCache(options: DedupeCacheOptions): DedupeCache;
//#endregion
//#region src/plugin-sdk/runtime-logger.internal.d.ts
type LoggerLike = {
  info: (message: string) => void;
  error: (message: string) => void;
};
declare function createLoggerBackedRuntime(params: {
  logger: LoggerLike;
  exitError?: (code: number) => Error;
}): OutputRuntimeEnv;
//#endregion
export { createDedupeCache as n, createLoggerBackedRuntime as t };