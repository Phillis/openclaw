import { r as OpenClawPluginApi } from "../../types-Ci1t4mxf.js";
import { w as CircuitBreakerEntry, x as ActiveRecallResult } from "../../types-3KLlWwCz.js";

//#region extensions/active-memory/recall-state.d.ts
declare function buildCircuitBreakerKey(agentId: string, provider?: string, model?: string): string;
declare function isCircuitBreakerOpen(key: string, maxTimeouts: number, cooldownMs: number): boolean;
declare function recordCircuitBreakerTimeout(key: string): void;
declare function resetCircuitBreaker(key: string): void;
declare function scheduleMemorySearchCleanupAfterTimeout(api: OpenClawPluginApi, logPrefix: string, agentId: string): Promise<void>;
declare function resolveActiveRecallForRun(runId: string, start: (onTimeoutCleanup: (cleanup: Promise<void>) => void) => Promise<ActiveRecallResult>): Promise<ActiveRecallResult>;
declare function forgetActiveRecallRun(runId: string | undefined): void;
declare function buildCacheKey(params: {
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  query: string;
}): string;
declare function getCachedResult(cacheKey: string): ActiveRecallResult | undefined;
declare function setCachedResult(cacheKey: string, result: ActiveRecallResult, ttlMs: number): void;
declare function toSingleLineLogValue(value: unknown): string;
declare function toSingleLineErrorMessage(error: unknown): string;
declare function shouldCacheResult(result: ActiveRecallResult): boolean;
declare function resetActiveRecallStateForTests(): void;
declare function getCircuitBreakerEntry(key: string): CircuitBreakerEntry | undefined;
//#endregion
export { buildCacheKey, buildCircuitBreakerKey, forgetActiveRecallRun, getCachedResult, getCircuitBreakerEntry, isCircuitBreakerOpen, recordCircuitBreakerTimeout, resetActiveRecallStateForTests, resetCircuitBreaker, resolveActiveRecallForRun, scheduleMemorySearchCleanupAfterTimeout, setCachedResult, shouldCacheResult, toSingleLineErrorMessage, toSingleLineLogValue };