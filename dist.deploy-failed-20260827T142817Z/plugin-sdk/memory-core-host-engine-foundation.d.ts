import { T as MemorySearchConfig, r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { i as resolveStateDir } from "../paths-D6SJ5QqB.js";
import { c as resolveUserPath } from "../home-dir-4pOw9r_P.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { a as resolveAgentWorkspaceDir, i as resolveAgentDir, r as resolveAgentContextLimits } from "../agent-scope-config-m1tHy6iC.js";
import { a as resolveMemorySearchSyncConfig, i as resolveMemorySearchConfig, r as ResolvedMemorySearchConfig, t as onInternalSessionTranscriptUpdate } from "../transcript-events-BXZR4GSv.js";
import { r as resolveSessionTranscriptsDirForAgent } from "../paths-ksWeUTdn.js";
import { l as isPathInside, o as root } from "../fs-safe-D38Q48m-.js";

//#region packages/normalization-core/src/utf16-slice.d.ts
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
declare function truncateUtf16Safe(input: string, maxLen: number): string;
//#endregion
//#region src/shared/global-singleton.d.ts
type GlobalSingletonLifecycle = "close-and-restart" | "close-only" | "plugin-registry";
type GlobalSingletonReset<T> = (value: T) => void | Promise<void>;
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
declare function resolveGlobalSingleton<T>(key: symbol, create: () => T, reset?: GlobalSingletonReset<T>, lifecycle?: GlobalSingletonLifecycle): T;
//#endregion
export { type MemorySearchConfig, type OpenClawConfig, type ResolvedMemorySearchConfig, createSubsystemLogger, isPathInside, onInternalSessionTranscriptUpdate, resolveAgentContextLimits, resolveAgentDir, resolveAgentWorkspaceDir, resolveGlobalSingleton, resolveMemorySearchConfig, resolveMemorySearchSyncConfig, resolveSessionTranscriptsDirForAgent, resolveStateDir, resolveUserPath, root, truncateUtf16Safe };