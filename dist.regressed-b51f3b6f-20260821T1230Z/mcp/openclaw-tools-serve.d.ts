import { i as OpenClawConfig } from "../types.openclaw-woQof385.js";
import { Pt as SystemAgentOperation } from "../host-capability-types-BX08s7pv.js";
import { t as AnyAgentTool } from "../common-DmoEedH3.js";
//#region src/agents/tools/system-agent-tool.d.ts
type SystemAgentToolOptions = {
  /** Where setup side effects run; the gateway surface never manages its own daemon. */surface: "cli" | "gateway";
  /**
   * Host-verified consent for THIS turn: true only when the host judged the
   * user's actual message to be an explicit approval. The model-supplied
   * `approved` argument alone must never authorize a mutation (prompt
   * injection, model error).
   */
  approvalArmed?: boolean;
  /**
   * Approval is scoped to one exact operation: a denied mutating call records
   * its canonical hash here (host-owned, survives turns), and an armed turn
   * may execute only a call matching that hash. Cleared after use.
   */
  proposalRef?: {
    current?: string;
    operation?: SystemAgentOperation;
  };
  /**
   * Host handoff channel for actions the tool cannot perform itself
   * (interactive channel setup, external onboarding guidance, opening the
   * agent TUI). The engine reads it after the turn; CLI MCP hosts mirror it
   * from tool events.
   */
  directiveRef?: {
    current?: SystemAgentToolDirective;
  };
};
/** Host directives the hosting chat engine handles after the turn. */
type SystemAgentToolDirective = {
  kind: "channel-setup";
  channel: string;
} | {
  kind: "skills-setup";
} | {
  kind: "search-setup";
} | {
  kind: "gateway-config-setup";
} | {
  kind: "memory-import";
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
} | Extract<SystemAgentOperation, {
  kind: "open-setup";
}> | {
  kind: "approved-operation";
  operation: SystemAgentOperation;
};
//#endregion
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