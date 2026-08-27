import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import "../input-provenance-tG11qAd-.js";
import { a as ToolSearchCatalogEntry, f as HookContext, i as createOpenClawCodingTools, o as ToolSearchCatalogRef, s as ToolSearchCatalogToolExecutor } from "../types-DP7cDwEi.js";
import { d as ScheduledToolPolicyContext, f as AnyAgentTool } from "../bundle-mcp-B4GOVNpD.js";
import "../sandbox-Dv-ip-Ri.js";
//#region src/agents/harness/prompt-tool-policy.d.ts
type NamedTool = {
  name: string;
};
declare function createAgentHarnessPromptToolPolicy<T extends NamedTool>(params: {
  tools: readonly T[];
  catalogRef?: ToolSearchCatalogRef;
  catalogEntries?: readonly ToolSearchCatalogEntry[];
  codeModeControlsEnabled: boolean;
}): {
  apply: (input?: {
    toolsAllow?: string[];
    forceToolNames?: readonly string[];
  }) => {
    tools: T[];
    callableToolNames: string[];
  };
};
//#endregion
//#region src/agents/harness/tool-surface-bridge.d.ts
type AgentHarnessToolSurfaceRuntime$1 = {
  codeModeControlsEnabled: boolean;
  compactTools: (tools: AnyAgentTool[], options?: {
    hookContext?: HookContext;
    localModelLeanApplied?: boolean;
  }) => {
    tools: AnyAgentTool[];
    promptToolPolicy: ReturnType<typeof createAgentHarnessPromptToolPolicy<AnyAgentTool>>;
  };
  config: OpenClawConfig | undefined;
  includeToolSearchControls: boolean;
  runtimeToolAllowlist: string[] | undefined;
  toolSearchCatalogRef: ToolSearchCatalogRef | undefined;
  toolSearchControlsEnabled: boolean;
  cleanup: () => void;
  toolSearchCatalogExecutor: ToolSearchCatalogToolExecutor | undefined;
};
declare function createAgentHarnessToolSurfaceRuntimeCore(params: {
  abortSignal?: AbortSignal;
  agentId?: string;
  config?: OpenClawConfig;
  disableTools?: boolean;
  executeTool: ToolSearchCatalogToolExecutor;
  forceMessageTool?: boolean;
  isRawModelRun?: boolean;
  /** Prepared model row carrying catalog compat; required for `"auto"` code-mode resolution. */
  model?: {
    compat?: unknown;
  };
  modelId?: string;
  modelProvider?: string;
  modelToolsEnabled: boolean;
  prompt?: string;
  runId?: string;
  runtimeToolAllowlist?: readonly string[];
  sessionId?: string;
  sessionKey?: string;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  sourceReplyDeliveryMode?: string;
  toolsAllow?: readonly string[];
}): AgentHarnessToolSurfaceRuntime$1;
//#endregion
//#region src/plugin-sdk/agent-harness-tool-runtime.d.ts
type OpenClawCodingToolsOptions = NonNullable<Parameters<typeof createOpenClawCodingTools>[0]>;
type AgentHarnessToolSurfaceRuntime = Omit<AgentHarnessToolSurfaceRuntime$1, "toolSearchCatalogExecutor" | "toolSearchCatalogRef"> & {
  toolSearchCatalogExecutor: OpenClawCodingToolsOptions["toolSearchCatalogExecutor"];
  toolSearchCatalogRef: OpenClawCodingToolsOptions["toolSearchCatalogRef"];
};
type AgentHarnessToolSurfaceRuntimeParams = Omit<Parameters<typeof createAgentHarnessToolSurfaceRuntimeCore>[0], "executeTool"> & {
  executeTool: NonNullable<OpenClawCodingToolsOptions["toolSearchCatalogExecutor"]>;
};
declare function createAgentHarnessToolSurfaceRuntime(params: AgentHarnessToolSurfaceRuntimeParams): AgentHarnessToolSurfaceRuntime;
//#endregion
export { AgentHarnessToolSurfaceRuntime, AgentHarnessToolSurfaceRuntimeParams, createAgentHarnessToolSurfaceRuntime };