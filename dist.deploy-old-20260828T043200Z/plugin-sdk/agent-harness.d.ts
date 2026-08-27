import { $c as OpenClawAgentToolResult, Ca as abortEmbeddedAgentRun, Ea as resolveActiveEmbeddedRunSessionId, Gi as AgentHarnessV2, Ji as SandboxToolPolicy, K as createAgentToolResultMiddlewareRunner, Nn as createOpenClawCodingTools, Sa as abortAndDrainEmbeddedAgentRun, Yc as AgentToolResultMiddlewareEvent, ht as disposeRegisteredAgentHarnesses, i as EmbeddedRunAttemptParamsV2, io as ScheduledToolPolicyContext, q as createCodexAppServerToolResultExtensionRunner, qc as AgentToolResultMiddleware, r as EmbeddedRunAttemptParams, uc as TrustedSubagentCompletionHandoff, yi as AgentHarness } from "../agent-harness-runtime-D3DJE4wK.js";
import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import { ut as InputProvenance } from "../templating-tHzj-d8O.js";
import { n as AnyAgentTool } from "../common-BcF4g4is.js";
//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  webSearchEnabled?: boolean;
  config?: OpenClawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  sandboxToolPolicy?: SandboxToolPolicy;
  messageProvider?: string;
  agentAccountId?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  inputProvenance?: InputProvenance;
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  runtimeToolAllowlist?: string[];
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { type AgentHarness, type AgentHarnessV2, type AgentToolResultMiddleware, type AgentToolResultMiddlewareEvent, type AnyAgentTool, type EmbeddedRunAttemptParams, type EmbeddedRunAttemptParamsV2, type OpenClawAgentToolResult, abortEmbeddedAgentRun as abortAgentHarnessRun, abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, createOpenClawCodingTools, disposeRegisteredAgentHarnesses, resolveActiveEmbeddedRunSessionId, resolveWebSearchToolPolicy };