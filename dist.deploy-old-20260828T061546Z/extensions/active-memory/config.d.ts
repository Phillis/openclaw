import { b as OpenClawPluginApi } from "../../plugin-entry-DyrRrRy2.js";
import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { d as ActiveMemoryFastMode, it as ResolvedActiveRecallPluginConfig } from "../../types-B0IzvLgE.js";
//#region extensions/active-memory/config.d.ts
declare function clampInt(value: number | undefined, fallback: number, min: number, max: number): number;
declare function hasDeprecatedModelFallbackPolicy(pluginConfig: unknown): boolean;
declare function resolveSafeTranscriptDir(baseSessionsDir: string, transcriptDir: string): string;
declare function resolvePersistentTranscriptBaseDir(api: OpenClawPluginApi, agentId: string): string;
declare function requireTransientWorkspaceDir(tempDir: string | undefined): string;
declare function isMissingRegisteredMemoryToolsError(error: unknown, toolsAllow?: readonly string[]): boolean;
declare function normalizePluginConfig(pluginConfig: unknown, cfg?: OpenClawConfig): ResolvedActiveRecallPluginConfig;
declare function resolveActiveMemoryCleanupConfig(api: OpenClawPluginApi): OpenClawConfig | undefined;
declare function normalizeActiveMemoryFastMode(fastMode: unknown): ActiveMemoryFastMode | undefined;
declare function resetActiveMemoryConfigForTests(): void;
declare function setMinimumTimeoutMsForTests(value: number): void;
declare function setSetupGraceTimeoutMsForTests(value: number): void;
/**
 * Recalls eligible for CLI-backend dispatch run a fresh CLI process, which
 * measured runs place at 9-20s — over the plain 15s default. Eligibility is
 * the runner's own dispatch decision (route, registered backend, stored
 * credential mode), so API-key setups that keep the direct passthrough also
 * keep the plain default. Explicit operator timeoutMs config always wins.
 */
declare function applyCliRuntimeRecallTimeoutDefault(config: ResolvedActiveRecallPluginConfig, cliDispatchEligible: boolean): ResolvedActiveRecallPluginConfig;
//#endregion
export { applyCliRuntimeRecallTimeoutDefault, clampInt, hasDeprecatedModelFallbackPolicy, isMissingRegisteredMemoryToolsError, normalizeActiveMemoryFastMode, normalizePluginConfig, requireTransientWorkspaceDir, resetActiveMemoryConfigForTests, resolveActiveMemoryCleanupConfig, resolvePersistentTranscriptBaseDir, resolveSafeTranscriptDir, setMinimumTimeoutMsForTests, setSetupGraceTimeoutMsForTests };