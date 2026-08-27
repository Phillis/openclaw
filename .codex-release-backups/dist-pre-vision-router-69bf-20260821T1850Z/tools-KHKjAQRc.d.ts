import { R as McpCodexToolApprovalMode, i as OpenClawConfig, p as PluginInstallRecord } from "./types.openclaw-woQof385.js";
import { A as PluginRegistry, f as OpenClawPluginToolContext, s as PluginLogger } from "./host-capability-types-BB7_xyrh.js";
import { n as PluginManifestRegistry } from "./manifest-registry-DsWy3jGA.js";
import { r as PluginMetadataSnapshot, t as PluginMetadataManifestView } from "./plugin-metadata-snapshot.types-DzTdp-gX.js";
import { c as McpCodexToolAnnotations } from "./agent-bundle-mcp-types-D2D7Xzlx.js";
import { t as AnyAgentTool } from "./common-DmoEedH3.js";
//#region src/plugins/runtime/load-context.d.ts
/** Resolved plugin runtime load context shared by runtime loader callers. */
type PluginRuntimeLoadContext = {
  rawConfig: OpenClawConfig;
  config: OpenClawConfig;
  activationSourceConfig: OpenClawConfig;
  autoEnabledReasons: Readonly<Record<string, string[]>>;
  workspaceDir: string | undefined;
  env: NodeJS.ProcessEnv;
  logger: PluginLogger;
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: PluginMetadataSnapshot;
  installRecords?: Record<string, PluginInstallRecord>;
};
/** Options accepted while resolving plugin runtime load context. */
type PluginRuntimeLoadContextOptions = {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  onlyPluginIds?: readonly string[];
  logger?: PluginLogger;
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: PluginMetadataSnapshot;
};
/** Creates the default plugin runtime loader logger. */
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
declare function resolvePluginRuntimeLoadContext(options?: PluginRuntimeLoadContextOptions): PluginRuntimeLoadContext;
//#endregion
//#region src/plugins/tools.d.ts
/** MCP bridge metadata attached to plugin tools surfaced through agent tool lists. */
type PluginToolMcpMeta = {
  serverName: string;
  safeServerName: string;
  toolName: string;
  operation: "tool" | "resources_list" | "resources_read" | "prompts_list" | "prompts_get";
  deniedBySession?: true;
  codexApproval?: {
    mode: McpCodexToolApprovalMode;
    annotations?: McpCodexToolAnnotations;
  };
  node?: {
    id: string;
    displayName?: string;
  };
};
/** Runtime metadata used to trace an agent tool back to its owning plugin registration. */
type PluginToolMeta = {
  pluginId: string;
  optional: boolean;
  replaySafe?: boolean;
  trustedLocalMedia?: boolean;
  mcp?: PluginToolMcpMeta;
};
/** Attaches plugin ownership metadata to a concrete agent tool instance. */
declare function setPluginToolMeta(tool: AnyAgentTool, meta: PluginToolMeta): void;
/** Reads plugin ownership metadata for a concrete agent tool instance. */
declare function getPluginToolMeta(tool: AnyAgentTool): PluginToolMeta | undefined;
/** Copies plugin ownership metadata when wrappers replace a tool object. */
declare function copyPluginToolMeta(source: AnyAgentTool, target: AnyAgentTool): void;
/**
 * Builds a collision-proof key for plugin-owned tool metadata lookups.
 */
declare function buildPluginToolMetadataKey(pluginId: string, toolName: string): string;
type PreparedPluginToolRuntime = {
  loadContext?: ReturnType<typeof resolvePluginRuntimeLoadContext>;
  metadataSnapshot: PluginMetadataManifestView;
  registry?: PluginRegistry;
};
declare function ensureStandalonePluginToolRegistryLoaded(params: {
  context: OpenClawPluginToolContext;
  toolAllowlist?: string[];
  toolDenylist?: string[];
  allowGatewaySubagentBinding?: boolean;
  hasAuthForProvider?: (providerId: string) => boolean;
  env?: NodeJS.ProcessEnv;
}): PluginRegistry | undefined;
declare function resolvePluginTools(params: {
  context: OpenClawPluginToolContext;
  existingToolNames?: Set<string>;
  clientCaps?: string[];
  toolAllowlist?: string[];
  toolDenylist?: string[];
  suppressNameConflicts?: boolean;
  allowGatewaySubagentBinding?: boolean;
  hasAuthForProvider?: (providerId: string) => boolean;
  env?: NodeJS.ProcessEnv;
  runtimeRegistry?: PluginRegistry;
  preparedRuntime?: PreparedPluginToolRuntime;
}): AnyAgentTool[];
//#endregion
export { getPluginToolMeta as a, ensureStandalonePluginToolRegistryLoaded as i, buildPluginToolMetadataKey as n, resolvePluginTools as o, copyPluginToolMeta as r, setPluginToolMeta as s, PluginToolMcpMeta as t };