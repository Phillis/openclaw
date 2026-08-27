import { i as OpenClawConfig } from "../types.openclaw-woQof385.js";
import { M as McpServerConnectionResolved } from "../host-capability-types-DA-XTryG.js";
import { u as SessionToolOverrides } from "../types-7aAIDdHX.js";
import { n as PluginManifestRegistry } from "../manifest-registry-DsWy3jGA.js";
import { a as SessionMcpRequesterScope, i as RequesterMcpConnect, o as SessionMcpRuntime, r as McpToolCatalog, s as SessionMcpRuntimeManager } from "../agent-bundle-mcp-types-D2D7Xzlx.js";
import { ClientCapabilities } from "@modelcontextprotocol/sdk/types.js";
import { jsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/types.js";

//#region src/agents/agent-bundle-mcp-combined.d.ts
/**
 * Merge catalogs from static + requester partitions.
 * Safe names are precomputed from the full declared set, so no re-suffix is needed.
 */
declare function mergeMcpToolCatalogs(catalogs: readonly McpToolCatalog[]): McpToolCatalog;
//#endregion
//#region src/agents/agent-bundle-mcp-manager-api.d.ts
declare function getOrCreateSessionMcpRuntime(params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  requesterSenderId?: string | null;
  agentAccountId?: string | null;
  messageChannel?: string | null;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
}): Promise<SessionMcpRuntime>;
/**
 * Requester-scoped MCP runtime only (no static partition).
 * Shared-thread harnesses use this so static MCP stays harness-native.
 */
declare function getOrCreateRequesterScopedMcpRuntime(params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  requesterSenderId?: string | null;
  agentAccountId?: string | null;
  messageChannel?: string | null;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
}): Promise<SessionMcpRuntime | undefined>;
declare function rememberAdvertisedScopedMcpCatalog(sessionId: string, catalog: McpToolCatalog): void;
declare function getAdvertisedScopedMcpCatalog(sessionId: string): McpToolCatalog | null;
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
declare function peekSessionMcpRuntime(params: {
  sessionId?: string | null;
  sessionKey?: string | null;
}): SessionMcpRuntime | undefined;
declare function retireSessionMcpRuntime(params: {
  sessionId?: string | null;
  reason: string;
  preserveActiveLeases?: boolean;
  retainAcrossReuse?: boolean;
  onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
/** Completes a one-shot retirement after its final run, view, or request lease releases. */
declare function completeDeferredSessionMcpRuntimeRetirement(runtime: SessionMcpRuntime): Promise<boolean>;
declare function retireSessionMcpRuntimeForSessionKey(params: {
  sessionKey?: string | null;
  reason: string;
  preserveActiveLeases?: boolean;
  onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
declare function disposeAllSessionMcpRuntimes(): Promise<void>;
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-shared.d.ts
type CreateSessionMcpRuntime = (params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  includeServerNames?: ReadonlySet<string>;
  excludeServerNames?: ReadonlySet<string>;
  safeServerNamesByServer?: ReadonlyMap<string, string>;
  connectionOverrides?: ReadonlyMap<string, McpServerConnectionResolved>;
  redactConnectionServerNames?: ReadonlySet<string>;
  requesterScope?: SessionMcpRequesterScope;
  requesterConnect?: RequesterMcpConnect;
  configFingerprint?: string;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
}) => SessionMcpRuntime;
declare function resolveSessionMcpRuntimeIdleTtlMs(): number;
//#endregion
//#region src/agents/agent-bundle-mcp-manager-lifecycle.d.ts
type SessionMcpRuntimeManagerOpts = {
  createRuntime?: CreateSessionMcpRuntime;
  now?: () => number;
  enableIdleSweepTimer?: boolean;
  idleSweepIntervalMs?: number;
  maxIdleRequesterRuntimesPerSession?: number;
};
//#endregion
//#region src/agents/agent-bundle-mcp-manager.d.ts
declare function createSessionMcpRuntimeManager(opts?: SessionMcpRuntimeManagerOpts): SessionMcpRuntimeManager;
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-config.d.ts
/**
 * Loads enabled MCP config metadata for a session without creating runtimes,
 * connecting transports, or issuing MCP tools/list requests.
 */
declare function resolveSessionMcpConfigSummary(params: {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
}): {
  fingerprint: string;
  serverNames: string[];
};
//#endregion
//#region src/agents/mcp-json-schema-validator.d.ts
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
declare function createMcpJsonSchemaValidator(): jsonSchemaValidator;
//#endregion
//#region src/agents/agent-bundle-mcp-runtime.d.ts
declare function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs?: number): void;
declare function setBundleMcpDisposeTimeoutMsForTest(timeoutMs?: number): void;
declare function buildMcpClientCapabilities(mcpAppsEnabled: boolean): ClientCapabilities;
declare function createSessionMcpRuntime(params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  includeServerNames?: ReadonlySet<string>;
  excludeServerNames?: ReadonlySet<string>;
  /**
   * Precomputed name→safeName for the full declared server set. Required for
   * stable tool names when this runtime holds only a subset of servers.
   */
  safeServerNamesByServer?: ReadonlyMap<string, string>; /** Resolved per-requester url/headers; never logged/persisted as credentials. */
  connectionOverrides?: ReadonlyMap<string, McpServerConnectionResolved>;
  redactConnectionServerNames?: ReadonlySet<string>;
  requesterScope?: SessionMcpRequesterScope;
  requesterConnect?: RequesterMcpConnect;
  configFingerprint?: string;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
}): SessionMcpRuntime;
declare const testing: {
  buildMcpClientCapabilities: typeof buildMcpClientCapabilities;
  createSessionMcpRuntimeManager: typeof createSessionMcpRuntimeManager;
  resetSessionMcpRuntimeManager(): Promise<void>;
  getCachedSessionIds(): string[];
  getCachedRuntimeKeys(): string[];
  getBookkeepingSizes(manager: SessionMcpRuntimeManager): Record<string, number>;
  setBundleMcpCatalogListTimeoutMsForTest: typeof setBundleMcpCatalogListTimeoutMsForTest;
  setBundleMcpDisposeTimeoutMsForTest: typeof setBundleMcpDisposeTimeoutMsForTest;
  resolveSessionMcpRuntimeIdleTtlMs: typeof resolveSessionMcpRuntimeIdleTtlMs;
  mergeMcpToolCatalogs: typeof mergeMcpToolCatalogs;
};
//#endregion
export { completeDeferredSessionMcpRuntimeRetirement, createMcpJsonSchemaValidator as createBundleMcpJsonSchemaValidator, createSessionMcpRuntime, createSessionMcpRuntimeManager, disposeAllSessionMcpRuntimes, getAdvertisedScopedMcpCatalog, getOrCreateRequesterScopedMcpRuntime, getOrCreateSessionMcpRuntime, mergeMcpToolCatalogs, peekSessionMcpRuntime, rememberAdvertisedScopedMcpCatalog, resolveSessionMcpConfigSummary, retireSessionMcpRuntime, retireSessionMcpRuntimeForSessionKey, testing };