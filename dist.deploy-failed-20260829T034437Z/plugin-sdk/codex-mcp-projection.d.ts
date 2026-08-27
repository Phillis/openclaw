import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import { c as SessionToolOverrides } from "../types-Kt4lh6nX.js";
import { c as CronCreatorToolAllowlistEntry, f as AnyAgentTool, o as runWithCronCreatorAuthorityCapabilityResolver, s as runWithCronCreatorAuthorityResolver, t as materializeStaticMcpToolsForScheduledHarnessRunCore, u as CronToolsAllowCaptureRef } from "../bundle-mcp-DF3euytK.js";
//#region src/agents/cli-runner/bundle-mcp-codex.d.ts
type CodexThreadConfigValue = string | number | boolean | null | CodexThreadConfigValue[] | {
  [key: string]: CodexThreadConfigValue;
};
type CodexThreadConfigObject = {
  [key: string]: CodexThreadConfigValue;
};
type CodexUserMcpServersProjectionOptions = {
  agentId?: string;
  agentDir?: string;
  allowLiteralOAuthProjection?: boolean;
  onServerUnavailable?: (serverName: string, error: unknown) => void;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
};
/**
 * Applies Codex-only agent scoping before OpenClaw resolves credentials or opens transports.
 * Session overrides may narrow this result, but cannot widen `codex.agents`.
 */
declare function resolveCodexMcpToolOverridesForAgent(cfg: OpenClawConfig | undefined, options: Pick<CodexUserMcpServersProjectionOptions, "agentId" | "toolOverrides">): Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny"> | undefined;
/**
 * Codex app-server runtime (extensions/codex) receives its thread config as a
 * JSON object through JSON-RPC `thread/start`/`thread/resume`, not as `-c` CLI
 * args. This returns a thread-config patch projecting user-configured
 * `cfg.mcp.servers` entries into Codex's `mcp_servers` table using the same
 * per-server normalization the CLI path uses, so app-server agents see the
 * same user MCP servers the CLI runtime exposes via `injectCodexMcpConfigArgs`.
 *
 * Only user-configured servers (`cfg.mcp.servers`) are projected. Plugin-
 * curated app-server apps are already attached separately through the codex
 * plugin thread-config `apps` patch, so they must not be re-projected here.
 */
declare function buildCodexUserMcpServersThreadConfigPatch(cfg: OpenClawConfig | undefined, options?: CodexUserMcpServersProjectionOptions): {
  mcp_servers: CodexThreadConfigObject;
} | undefined;
/** Async runtime projection that resolves OpenClaw-managed MCP bearer tokens. */
declare function buildCodexUserMcpServersThreadConfigPatchForRuntime(cfg: OpenClawConfig | undefined, options?: CodexUserMcpServersProjectionOptions): Promise<{
  mcp_servers: CodexThreadConfigObject;
} | undefined>;
//#endregion
//#region src/plugin-sdk/codex-mcp-projection.d.ts
/** Materialize static configured MCP under a scheduled Codex authority envelope. */
declare function materializeStaticMcpToolsForScheduledHarnessRun(params: Parameters<typeof materializeStaticMcpToolsForScheduledHarnessRunCore>[0]): Promise<{
  tools: AnyAgentTool[];
  diagnosticNotice?: string;
  dispose: () => Promise<void>;
}>;
/** Capture the final Codex dynamic-tool surface for cron creator authority. */
declare function captureFinalCodexCronCreatorToolAllowlist(target: CronCreatorToolAllowlistEntry[], captureRef: CronToolsAllowCaptureRef, tools: readonly AnyAgentTool[]): Promise<void>;
//#endregion
export { buildCodexUserMcpServersThreadConfigPatch, buildCodexUserMcpServersThreadConfigPatchForRuntime, captureFinalCodexCronCreatorToolAllowlist, materializeStaticMcpToolsForScheduledHarnessRun, resolveCodexMcpToolOverridesForAgent, runWithCronCreatorAuthorityCapabilityResolver, runWithCronCreatorAuthorityResolver };