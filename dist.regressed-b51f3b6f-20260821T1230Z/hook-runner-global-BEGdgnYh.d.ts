import { $ as PluginHookSubagentEndedEvent, A as PluginHookInboundClaimResult, B as PluginHookReplyDispatchResult, Bt as PluginHookMessageSentEvent, C as PluginHookCronChangedEvent, Ct as PluginHookSkillChangedEvent, D as PluginHookGatewayStartEvent, Dt as PluginHookSkillProposalEvaluateEvent, E as PluginHookGatewayContext, Et as PluginHookSkillProposalChangedEvent, F as PluginHookName, G as PluginHookResolveExecEnvContext, H as PluginHookReplyPayloadSendingContext, I as PluginHookRegistration, It as PluginHookMessageContext, J as PluginHookSessionEndEvent, Jt as PluginHookBeforeModelResolveResult, K as PluginHookResolveExecEnvEvent, Kt as PluginHookBeforeToolCallResult, Lt as PluginHookMessageReceivedEvent, M as PluginHookLlmOutputEvent, Mt as PluginHookInboundClaimEvent, N as PluginHookModelCallEndedEvent, O as PluginHookGatewayStopEvent, P as PluginHookModelCallStartedEvent, Q as PluginHookSubagentDeliveryTargetResult, R as PluginHookReplyDispatchContext, Rt as PluginHookMessageSendingEvent, T as PluginHookCronReconciledEvent, U as PluginHookReplyPayloadSendingEvent, Ut as GateHookResult, W as PluginHookReplyPayloadSendingResult, Wt as InputGateDecision, X as PluginHookSubagentContext, Xt as PluginHookBeforePromptBuildResult, Y as PluginHookSessionStartEvent, Yt as PluginHookBeforePromptBuildEvent, Z as PluginHookSubagentDeliveryTargetEvent, _ as PluginHookBeforeInstallResult, a as PluginHookAgentEndEvent, b as PluginHookBeforeResetEvent, c as PluginHookBeforeAgentReplyEvent, ct as PluginHookToolResultPersistContext, d as PluginHookBeforeCompactionEvent, et as PluginHookSubagentProgressEvent, f as PluginHookBeforeDispatchContext, ft as PluginAgentTurnPrepareEvent, g as PluginHookBeforeInstallEvent, h as PluginHookBeforeInstallContext, ht as PluginHeartbeatPromptContributionResult, i as PluginHookAgentContext, it as PluginHookToolContext, j as PluginHookLlmInputEvent, jt as PluginHookInboundClaimContext, k as PluginHookHandlerMap, kt as PluginHookSkillProposalEvaluationOutcome, l as PluginHookBeforeAgentReplyResult, lt as PluginHookToolResultPersistEvent, m as PluginHookBeforeDispatchResult, mt as PluginHeartbeatPromptContributionEvent, n as PluginHookAfterCompactionEvent, nt as PluginHookSubagentSpawningEvent, o as PluginHookBeforeAgentFinalizeEvent, p as PluginHookBeforeDispatchEvent, pt as PluginAgentTurnPrepareResult, q as PluginHookSessionContext, qt as PluginHookBeforeModelResolveEvent, r as PluginHookAfterToolCallEvent, rt as PluginHookSubagentSpawningResult, s as PluginHookBeforeAgentFinalizeResult, t as PluginSubagentRequesterContext, tt as PluginHookSubagentSpawnedEvent, u as PluginHookBeforeAgentRunEvent, ut as PluginHookToolResultPersistResult, v as PluginHookBeforeMessageWriteEvent, w as PluginHookCronReconciledContext, wt as PluginHookSkillContext, x as PluginHookBeforeToolCallEvent, y as PluginHookBeforeMessageWriteResult, z as PluginHookReplyDispatchEvent, zt as PluginHookMessageSendingResult } from "./subagent-requester-context-CM5vebzA.js";

//#region src/hooks/types.d.ts
type HookInstallSpec = {
  id?: string;
  kind: "bundled" | "npm" | "git";
  label?: string;
  package?: string;
  repository?: string;
  bins?: string[];
};
type OpenClawHookMetadata = {
  always?: boolean;
  hookKey?: string;
  emoji?: string;
  homepage?: string; /** Events this hook handles (e.g., ["command:new", "session:start"]) */
  events: string[]; /** Optional export name (default: "default") */
  export?: string;
  os?: string[];
  requires?: {
    bins?: string[];
    anyBins?: string[];
    env?: string[];
    config?: string[];
  };
  install?: HookInstallSpec[];
};
type HookInvocationPolicy = {
  enabled: boolean;
};
type ParsedHookFrontmatter = Record<string, string>;
type Hook = {
  name: string;
  description: string;
  source: "openclaw-bundled" | "openclaw-managed" | "openclaw-workspace" | "openclaw-plugin";
  pluginId?: string;
  filePath: string;
  baseDir: string;
  handlerPath: string;
};
type HookEntry = {
  hook: Hook;
  frontmatter: ParsedHookFrontmatter;
  metadata?: OpenClawHookMetadata;
  invocation?: HookInvocationPolicy;
};
//#endregion
//#region src/plugins/hook-registry.types.d.ts
/** Legacy hook registration stored by the global hook runner registry. */
type PluginLegacyHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};
/** Hook runner registry state for legacy and typed plugin hooks. */
type HookRunnerRegistry = {
  hooks: PluginLegacyHookRegistration[];
  typedHooks: PluginHookRegistration[];
};
/** Global hook runner registry snapshot with plugin load status. */
type GlobalHookRunnerRegistry = HookRunnerRegistry & {
  plugins: Array<{
    id: string;
    packageVersion?: string;
    status: "loaded" | "disabled" | "error";
  }>;
};
//#endregion
//#region src/plugins/hooks.d.ts
type HookRunnerLogger = {
  debug?: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
type HookFailurePolicy = "fail-open" | "fail-closed";
type VoidHookRunOptions = {
  unrefTimeout?: boolean;
};
type HookRunnerOptions = {
  logger?: HookRunnerLogger; /** If true, errors in hooks will be caught and logged instead of thrown */
  catchErrors?: boolean;
  /**
   * Optional per-hook failure policy.
   * Defaults to fail-open unless explicitly overridden for a hook name.
   */
  failurePolicyByHook?: Partial<Record<PluginHookName, HookFailurePolicy>>;
  /**
   * Optional timeout for void/observation hooks. A timed-out hook is logged and
   * the runner continues, but the plugin's underlying work is not cancelled.
   */
  voidHookTimeoutMsByHook?: Partial<Record<PluginHookName, number>>;
  /**
   * Optional timeout for modifying hooks. A timed-out hook is logged and skipped,
   * but the plugin's underlying work is not cancelled.
   */
  modifyingHookTimeoutMsByHook?: Partial<Record<PluginHookName, number>>;
};
type PluginTargetedInboundClaimOutcome = {
  status: "handled";
  result: PluginHookInboundClaimResult;
} | {
  status: "missing_plugin";
} | {
  status: "no_handler";
} | {
  status: "declined";
} | {
  status: "error";
  error: string;
};
/**
 * Create a hook runner for a specific registry.
 */
declare function createHookRunner(registry: GlobalHookRunnerRegistry, options?: HookRunnerOptions): {
  runBeforeModelResolve: (event: PluginHookBeforeModelResolveEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeModelResolveResult | undefined>;
  runAgentTurnPrepare: (event: PluginAgentTurnPrepareEvent, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | undefined>;
  runBeforePromptBuild: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | undefined>;
  runBeforeAgentReply: (event: PluginHookBeforeAgentReplyEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentReplyResult | undefined>;
  runModelCallStarted: (event: PluginHookModelCallStartedEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runModelCallEnded: (event: PluginHookModelCallEndedEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runLlmInput: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runLlmOutput: (event: PluginHookLlmOutputEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeAgentFinalize: (event: PluginHookBeforeAgentFinalizeEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentFinalizeResult | undefined>;
  runAgentEnd: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext, optionsLocal?: VoidHookRunOptions) => Promise<void>;
  runBeforeCompaction: (event: PluginHookBeforeCompactionEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runAfterCompaction: (event: PluginHookAfterCompactionEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeReset: (event: PluginHookBeforeResetEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeAgentRun: (event: PluginHookBeforeAgentRunEvent, ctx: PluginHookAgentContext) => Promise<GateHookResult<InputGateDecision> | undefined>;
  runInboundClaim: (event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
  runInboundClaimForPlugin: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
  runInboundClaimForPluginOutcome: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginTargetedInboundClaimOutcome>;
  runChannelPairingRequested: (event: Parameters<PluginHookHandlerMap["channel_pairing_requested"]>[0], ctx: Parameters<PluginHookHandlerMap["channel_pairing_requested"]>[1]) => Promise<void>;
  runMessageReceived: (event: PluginHookMessageReceivedEvent, ctx: PluginHookMessageContext) => Promise<void>;
  runBeforeDispatch: (event: PluginHookBeforeDispatchEvent, ctx: PluginHookBeforeDispatchContext, requester?: PluginSubagentRequesterContext) => Promise<PluginHookBeforeDispatchResult | undefined>;
  runReplyDispatch: (event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext) => Promise<PluginHookReplyDispatchResult | undefined>;
  runReplyPayloadSending: (event: PluginHookReplyPayloadSendingEvent, ctx: PluginHookReplyPayloadSendingContext) => Promise<PluginHookReplyPayloadSendingResult | undefined>;
  runMessageSending: (event: PluginHookMessageSendingEvent, ctx: PluginHookMessageContext) => Promise<PluginHookMessageSendingResult | undefined>;
  runMessageSent: (event: PluginHookMessageSentEvent, ctx: PluginHookMessageContext) => Promise<void>;
  runBeforeToolCall: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => Promise<PluginHookBeforeToolCallResult | undefined>;
  runAfterToolCall: (event: PluginHookAfterToolCallEvent, ctx: PluginHookToolContext) => Promise<void>;
  runToolResultPersist: (event: PluginHookToolResultPersistEvent, ctx: PluginHookToolResultPersistContext) => PluginHookToolResultPersistResult | undefined;
  runBeforeMessageWrite: (event: PluginHookBeforeMessageWriteEvent, ctx: {
    agentId?: string;
    sessionKey?: string;
  }) => PluginHookBeforeMessageWriteResult | undefined;
  runSessionStart: (event: PluginHookSessionStartEvent, ctx: PluginHookSessionContext) => Promise<void>;
  runSessionEnd: (event: PluginHookSessionEndEvent, ctx: PluginHookSessionContext) => Promise<void>;
  runSubagentSpawning: (event: PluginHookSubagentSpawningEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentSpawningResult | undefined>;
  runSubagentDeliveryTarget: (event: PluginHookSubagentDeliveryTargetEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentDeliveryTargetResult | undefined>;
  runSubagentSpawned: (event: PluginHookSubagentSpawnedEvent, ctx: PluginHookSubagentContext) => Promise<void>;
  runSubagentProgress: (event: PluginHookSubagentProgressEvent, ctx: PluginHookSubagentContext) => Promise<void>;
  runSubagentEnded: (event: PluginHookSubagentEndedEvent, ctx: PluginHookSubagentContext) => Promise<void>;
  runGatewayStart: (event: PluginHookGatewayStartEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runGatewayStop: (event: PluginHookGatewayStopEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runHeartbeatPromptContribution: (event: PluginHeartbeatPromptContributionEvent, ctx: PluginHookAgentContext) => Promise<PluginHeartbeatPromptContributionResult | undefined>;
  runCronReconciled: (event: PluginHookCronReconciledEvent, ctx: PluginHookCronReconciledContext) => Promise<void>;
  runCronChanged: (event: PluginHookCronChangedEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runSkillProposalEvaluate: (event: PluginHookSkillProposalEvaluateEvent, ctx: PluginHookSkillContext) => Promise<PluginHookSkillProposalEvaluationOutcome[]>;
  runSkillProposalChanged: (event: PluginHookSkillProposalChangedEvent, ctx: PluginHookSkillContext) => Promise<void>;
  runSkillChanged: (event: PluginHookSkillChangedEvent, ctx: PluginHookSkillContext) => Promise<void>;
  runBeforeInstall: (event: PluginHookBeforeInstallEvent, ctx: PluginHookBeforeInstallContext) => Promise<PluginHookBeforeInstallResult | undefined>;
  runResolveExecEnv: (event: PluginHookResolveExecEnvEvent, ctx: PluginHookResolveExecEnvContext) => Promise<Record<string, string>>;
  hasHooks: <K extends PluginHookName>(hookName: K, ctx?: Parameters<PluginHookHandlerMap[K]>[1]) => boolean;
  getHookCount: (hookName: PluginHookName) => number;
};
type HookRunner = ReturnType<typeof createHookRunner>;
//#endregion
//#region src/plugins/hook-runner-global.d.ts
/**
 * Initialize the global hook runner with a plugin registry.
 * Called on every plugin registry activation and by SDK consumers. The runner
 * instance stays stable so references captured mid-run keep seeing current hooks.
 */
declare function initializeGlobalHookRunner(registry: GlobalHookRunnerRegistry): void;
/**
 * Get the global hook runner.
 * Returns null if plugins haven't been loaded yet.
 */
declare function getGlobalHookRunner(): HookRunner | null;
/**
 * Reset the global hook runner (for testing).
 */
declare function resetGlobalHookRunner(): void;
//#endregion
export { HookEntry as i, initializeGlobalHookRunner as n, resetGlobalHookRunner as r, getGlobalHookRunner as t };