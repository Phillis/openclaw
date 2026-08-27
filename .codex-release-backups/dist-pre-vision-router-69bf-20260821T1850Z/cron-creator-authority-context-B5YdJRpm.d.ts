import { f as AgentToolResult, p as AgentToolUpdateCallback, u as AgentTool } from "./types-DKu1Bc4Q.js";
import { n as OpenClawConfig } from "./types.openclaw-6A5yUI1l.js";
import { d as CronScheduledToolPolicy } from "./types-B4JofTdW.js";
import { t as DeliveryContext } from "./delivery-context.types-CgrQeDKp.js";
import { t as CronRuntimeAuthority } from "./runtime-authority-CNt1IvWh.js";
import { TSchema } from "typebox";

//#region src/agents/tools/tool-results.d.ts
declare function jsonResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
//#endregion
//#region src/agents/tools/common.d.ts
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string; /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only"; /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: (params: unknown, ctx: {
    toolCallId?: string;
    hookContext?: unknown;
    signal?: AbortSignal;
  }) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute = {
  execute(this: void, toolCallId: string, params: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback): Promise<AgentToolResult<unknown>>;
};
type AnyAgentTool = Omit<AgentTool, "execute"> & ErasedAgentToolExecute & {
  displaySummary?: string; /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only"; /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["prepareBeforeToolCallParams"];
  finalizeBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["finalizeBeforeToolCallParams"];
};
declare function asToolParamsRecord(params: unknown): Record<string, unknown>;
type StringParamOptions = {
  required?: boolean;
  trim?: boolean;
  label?: string;
  allowEmpty?: boolean;
};
declare function readToolStringParam(params: Record<string, unknown>, key: string, options: StringParamOptions & {
  required: true;
}): string;
declare function readToolStringParam(params: Record<string, unknown>, key: string, options?: StringParamOptions): string | undefined;
declare function readNumberParam(params: Record<string, unknown>, key: string, options?: {
  required?: boolean;
  label?: string;
  integer?: boolean;
  strict?: boolean;
  positiveInteger?: boolean;
  nonNegativeInteger?: boolean;
}): number | undefined;
declare function readPositiveIntegerParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  max?: number;
}): number | undefined;
declare function readNonNegativeIntegerParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  max?: number;
}): number | undefined;
declare function readFiniteNumberParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  min?: number;
  max?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
}): number | undefined;
declare function readStringArrayParam(params: Record<string, unknown>, key: string, options: StringParamOptions & {
  required: true;
}): string[];
declare function readStringArrayParam(params: Record<string, unknown>, key: string, options?: StringParamOptions): string[] | undefined;
//#endregion
//#region src/agents/scheduled-tool-policy.d.ts
/** Trusted runtime context for a scheduled run with a server-stamped tool cap. */
type ScheduledToolPolicyContext = CronScheduledToolPolicy;
//#endregion
//#region src/agents/subagents/announce/subagent-announce-handoff.d.ts
type TrustedSubagentCompletionHandoff = {
  kind: "subagent-completion";
  sourceSessionKey: string;
  sourceSessionId?: string;
  targetSessionKey: string;
  targetSessionId: string;
  provider: string;
  model: string;
};
//#endregion
//#region src/plugins/runtime/tool-grant.d.ts
/** Owner-scoped additive plugin tools for one trusted agent run. */
type RuntimePluginToolGrant = {
  pluginId: string;
  toolNames: readonly string[];
};
//#endregion
//#region src/gateway/cron-creator-authority-grant.d.ts
type CronCreatorAuthorityGrant = Readonly<{
  runId: string;
  token: string;
}>;
type CronCreatorAuthorityRunScope = {
  readonly runId: string;
  readonly signal: AbortSignal;
  readonly grantTokens: Set<string>;
  active: boolean;
  abort: () => void;
};
//#endregion
//#region src/agents/system-prompt.types.d.ts
type PromptMode = "full" | "minimal" | "none";
type SilentReplyPromptMode = "generic" | "none";
//#endregion
//#region src/agents/tools/cron-tool.types.d.ts
type CronCreatorToolAllowlistEntry = string | {
  name: string;
  pluginId?: string;
};
type CronToolsAllowCaptureProvenance = {
  version: 1;
  source: "final-executable-surface";
};
type CronToolsAllowCaptureRef = {
  value?: CronToolsAllowCaptureProvenance;
};
type CronCreatorToolAuthorityMaterialization = {
  tools: readonly CronCreatorToolAllowlistEntry[];
  provenance: CronToolsAllowCaptureProvenance; /** Opaque runtime-owned authority captured with the same exact executable surface. */
  runtimeAuthority?: CronRuntimeAuthority;
};
type CronCreatorToolAuthoritySnapshot = Omit<CronCreatorToolAuthorityMaterialization, "runtimeAuthority"> & {
  /** Gateway-process one-shot proof consumed only at the matching cron write. */grant: CronCreatorAuthorityGrant;
};
type CronToolOptions = {
  agentSessionKey?: string;
  agentId?: string; /** Authenticated source account; authority must not be inferred from delivery. */
  agentAccountId?: string;
  /**
   * Resolved config for the calling context. Shapes the advertised schema and
   * description: when cron.triggers.enabled is off, trigger-gated surfaces
   * (trigger, script payloads, stream schedules) are not advertised. Omitting
   * config keeps the full surface for config-less callers.
   */
  config?: OpenClawConfig;
  currentDeliveryContext?: DeliveryContext;
  /**
   * Effective tool surface visible to the caller that created or edited a cron job.
   * Cron agent turns and trigger scripts use fresh runtimes, so agent-origin jobs
   * need this cap persisted before the original session policy is lost.
   */
  creatorToolAllowlist?: CronCreatorToolAllowlistEntry[]; /** Host-owned proof that creatorToolAllowlist reached the final executable surface. */
  creatorToolAllowlistCaptureRef?: CronToolsAllowCaptureRef; /** Attempt-cached authority resolved only when a mutation changes its tool cap. */
  resolveCreatorToolAuthority?: (options?: {
    signal?: AbortSignal;
  }) => Promise<CronCreatorToolAuthoritySnapshot>; /** Visible fail-closed reason when a queued local turn cannot retain fresh MCP authority. */
  creatorAuthorityUnavailableReason?: "queued-local-operator-configured-mcp";
  selfRemoveOnlyJobId?: string;
  runId?: string;
};
//#endregion
//#region src/agents/cron-creator-authority-context.d.ts
type CronCreatorAuthorityMaterializer = (options?: {
  signal?: AbortSignal;
}) => Promise<CronCreatorToolAuthorityMaterialization>;
/** Opaque in-process capability minted only by an admitted exact run. */
type CronCreatorAuthorityCapability = CronCreatorAuthorityRunScope;
/** Installs an explicitly transported capability only for synchronous tool construction. */
declare function runWithCronCreatorAuthorityCapabilityResolver<T>(params: {
  capability: CronCreatorAuthorityCapability | undefined;
  runId: string | undefined;
  resolve: CronCreatorAuthorityMaterializer;
  run: () => T;
}): T;
/** Carries a bundled-Codex resolver through synchronous core tool construction. */
declare function runWithCronCreatorAuthorityResolver<T>(params: {
  runId: string;
  resolve: CronCreatorAuthorityMaterializer;
  run: () => T;
}): T;
//#endregion
export { readNumberParam as _, CronToolOptions as a, readToolStringParam as b, SilentReplyPromptMode as c, TrustedSubagentCompletionHandoff as d, ScheduledToolPolicyContext as f, readNonNegativeIntegerParam as g, readFiniteNumberParam as h, CronCreatorToolAllowlistEntry as i, CronCreatorAuthorityGrant as l, asToolParamsRecord as m, runWithCronCreatorAuthorityCapabilityResolver as n, CronToolsAllowCaptureRef as o, AnyAgentTool as p, runWithCronCreatorAuthorityResolver as r, PromptMode as s, CronCreatorAuthorityCapability as t, RuntimePluginToolGrant as u, readPositiveIntegerParam as v, jsonResult as x, readStringArrayParam as y };