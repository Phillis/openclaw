import { i as OpenClawConfig } from "../types.openclaw-ClnaeuRs.js";
import { t as AnyAgentTool } from "../common-Bt5m2WDZ.js";
import { f as SystemAgentToolOptions } from "../types-Hf0Z4d9b.js";
import "../bundle-mcp-BMuCsZVH.js";
//#region src/mcp/openclaw-tools-serve-config.d.ts
declare const OPENCLAW_TOOLS_MCP_TOOLS_ENV = "OPENCLAW_TOOLS_MCP_TOOLS";
declare const OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV = "OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE";
declare const OPENCLAW_TOOLS_MCP_TOOL_IDS: readonly ["cron", "openclaw"];
type OpenClawToolsMcpToolId = (typeof OPENCLAW_TOOLS_MCP_TOOL_IDS)[number];
//#endregion
//#region src/mcp/agent-session-env.d.ts
declare const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
//#endregion
//#region src/mcp/openclaw-tools-serve.d.ts
declare function resolveOpenClawToolsMcpAgentSessionKey(env?: NodeJS.ProcessEnv): string | undefined;
declare function resolveOpenClawToolsForMcp(params?: {
  agentSessionKey?: string;
  tools?: OpenClawToolsMcpToolId[];
  systemAgentSurface?: SystemAgentToolOptions["surface"];
  config?: OpenClawConfig;
}): AnyAgentTool[];
//#endregion
export { OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, OPENCLAW_TOOLS_MCP_TOOLS_ENV, resolveOpenClawToolsForMcp, resolveOpenClawToolsMcpAgentSessionKey };