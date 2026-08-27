import { D as MemorySearchManager, O as MemorySearchResult, P as SilentReplyConversationType, a as ModelApi, c as ModelMediaInputConfig, d as McpCodexToolApprovalMode, l as ModelProviderAuthMode, o as ModelCompatConfig, r as OpenClawConfig, s as ModelDefinitionConfig, t as ConfigFileSnapshot, u as ModelProviderConfig, w as MemoryCitationsMode, y as OperatorScope } from "./types.openclaw-D3TBp_34.js";
import { t as FastMode } from "./string-coerce-DjUc69CC.js";
import { E as SessionScope, M as ChatType, _ as HumanDelayConfig, f as ContextVisibilityMode, h as DmScope } from "./types.base-COwCxNSg.js";
import { n as SecretInput } from "./types.secrets-BBdlv1za.js";
import { B as ResolvedTtsPersona, H as TtsConfig, U as TtsMode, V as TtsAutoMode, X as GroupToolPolicyConfig, Z as ToolLoopDetectionConfig, ct as MentionPatternsPolicyConfig, dt as QueueMode, ft as AgentModelConfig, gt as SandboxDockerSettings, nt as SafeBinProfileFixture, q as TtsProvider, st as MentionPatternsMode } from "./types.channels-B7ph6mKI.js";
import { _ as Usage, l as Model, n as Api, o as ImageContent, r as AssistantMessage } from "./types-De8IanPo.js";
import { D as UnifiedModelCatalogKind, E as UnifiedModelCatalogEntry, _ as PluginManifestContracts, b as PluginManifestDashboardDataBinding, f as PluginBundleFormat, h as PluginFormat, i as PluginDependencyStatus, m as PluginDiagnostic, p as PluginConfigUiHint, t as PluginManifestRecord, v as PluginManifestDashboard, w as PluginKind, x as PluginManifestMcpServer, y as PluginManifestDashboardActionVerb } from "./manifest-registry-yhz__ZXy.js";
import { i as JsonSchemaObject } from "./types.config-C6_VK-8V.js";
import { n as RuntimeEnv } from "./runtime-DRcp7-j9.js";
import { t as PluginOrigin$1 } from "./plugin-origin.types-DOQEvsWL.js";
import { a as PluginCompatCode, n as PluginMetadataSnapshot, t as PluginMetadataRegistryView } from "./plugin-metadata-snapshot.types-C7yXs8r5.js";
import { l as ConfigWriteAfterWrite } from "./io-B5xgVxAr.js";
import { i as ConfigMutationBase, t as ConfigReplaceResult } from "./config-Da5NMdJh.js";
import { i as resolveStateDir } from "./paths-CVB8AiaC.js";
import { I as ConversationReadInvocationOrigin, h as ChannelMessageActionAdapter } from "./types.core-CInSoozE.js";
import { n as AgentTool, r as AgentToolResult, s as StreamFn, t as AgentMessage } from "./types-CkbcxW1I.js";
import { i as ReplyPayload, r as ReplyMediaAttachment } from "./reply-payload-BCOsEWHC.js";
import { A as ModelPickerAction, f as MessagePresentation } from "./payload-D0D49c9Y.js";
import { _ as ChannelRouteRef, c as SessionEntry, f as SessionSystemPromptReport, g as DeliveryContext, m as CronScheduledToolPolicy, n as CliSessionBinding, o as SessionContextBudgetStatus, p as SessionToolOverrides, r as GroupKeyResolution, u as SessionPluginJsonValue, v as SourceReplyDeliveryMode } from "./types-ByIHlRxL.js";
import { t as InboundEventKind } from "./kind-CC2t750M.js";
import { C as AuthProfileCredential, E as OAuthCredential, S as AuthProfileBlockedSource, T as AuthProfileStore, l as MediaUnderstandingProvider, w as AuthProfileFailureReason, x as ApiKeyCredential } from "./types-Bz5Nv8p5.js";
import { a as mediaKindFromMime } from "./constants-BCpSHoXd.js";
import { C as TranscriptTurnBoundary, S as TranscriptTurnAdmission, _ as TurnAdoptionLifecycle, a as InboundSourceModality, b as UserTurnTranscriptRecorder, c as OriginatingChannelType, ct as InputProvenance, d as SupplementalContextFacts, ft as PromptImageOrderEntry, g as TaskSuggestionDeliveryMode, h as PartialReplyPayload, i as FinalizedRuntimeMsgContext, m as GetReplyOptions, nt as CommandTurnKind, o as MentionSource, p as BlockReplyContext, r as FinalizedMsgContext, s as MsgContext, t as CanonicalInboundText, tt as CommandTurnContext, u as SessionTranscriptContext, ut as PluginHookChannelContext, x as TranscriptEntryAnchor } from "./templating-DzyASgcc.js";
import { n as MediaFact, t as LegacyMediaContextKey } from "./media-facts-D4qFhaJ1.js";
import { n as HistoryMediaEntry, t as HistoryEntry } from "./history.types-abIvF_Ce.js";
import { t as ChannelId$1 } from "./channel-id.types-CjcGKHk0.js";
import { St as DiagnosticToolTerminalReason, Yt as EmbeddedAgentExecutionPhase, a as DiagnosticEventPayload, i as DiagnosticEventMetadata, o as DiagnosticEventPrivateData, r as DiagnosticEventInput } from "./diagnostic-events-XF2IPtMP.js";
import { t as FailoverReason } from "./signal-DTFr3i_8.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";
import { i as VerboseLevel, n as ThinkLevel, r as ThinkingCatalogEntry, t as ReasoningLevel } from "./thinking.shared-Dn7xz8fk.js";
import { a as SessionManager, l as ResolvedSessionMaintenanceConfigInput } from "./transcript-GMGfC0_y.js";
import { $ as SpeechProviderConfig, $t as SecretInputMode, A as PluginRunContextPatch, At as ImageGenerationOutputFormat, B as PluginSessionSchedulerJobRegistration, Ct as MusicGenerationOutputFormat, D as PluginAgentEventSubscriptionRegistration, Dt as ImageGenerationBackground, E as PluginAgentEventEmitResult, Et as GeneratedImageAsset, F as PluginSessionAttachmentParams, Ft as ImageGenerationSourceImage, G as PluginTrustedToolPolicyRegistration, H as PluginSessionTurnUnscheduleByTagParams, I as PluginSessionAttachmentResult, J as VideoGenerationNormalization, Jt as CronCreatorAuthorityGrant, K as GeneratedVideoAsset, Kt as onAgentEvent, Mt as ImageGenerationProviderOptions, N as PluginSessionActionRegistration, Nt as ImageGenerationQuality, O as PluginControlUiDescriptor, Ot as ImageGenerationIgnoredOverride, Pt as ImageGenerationResolution, Q as SpeechModelOverridePolicy, Qt as SpawnResult, R as PluginSessionExtensionRegistration, St as MusicGenerationNormalization, T as PluginAgentEventEmitParams, Tt as MusicGenerationSourceImage, U as PluginSessionTurnUnscheduleByTagResult, V as PluginSessionTurnScheduleParams, W as PluginToolMetadataRegistration, X as VideoGenerationResolution, Y as VideoGenerationProvider, Yt as CronCreatorAuthorityRunScope, Z as VideoGenerationSourceAsset, an as AdmittedRunContext, b as WorkerProvider$1, bt as GeneratedMusicAsset, c as MediaUnderstandingProviderPlugin$1, d as RealtimeVoiceProviderPlugin$1, en as GatewayMethodDescriptor, f as SpeechProviderPlugin$1, i as GatewayRequestHandlers, in as SqliteWalMaintenance, j as PluginRuntimeLifecycleRegistration, jt as ImageGenerationProvider, k as PluginRunContextGetParams, kt as ImageGenerationNormalization, l as MusicGenerationProviderPlugin$1, ln as RuntimePluginToolGrant, m as VideoGenerationProviderPlugin$1, n as GatewayRequestHandler, nn as OpenClawStateDatabase, nt as TtsDirectiveOverrides, on as OperationalRunInstanceRef, p as TranscriptSourceProvider$1, q as VideoGenerationIgnoredOverride, rt as TtsDirectiveParseResult, s as ImageGenerationProviderPlugin$1, sn as PreparedAgentRunAdmission, tn as CronServiceContract, tt as SpeechVoiceOption, u as RealtimeTranscriptionProviderPlugin$1, un as AgentInternalEvent, wt as MusicGenerationProvider, xt as MusicGenerationIgnoredOverride, z as PluginSessionSchedulerJobHandle } from "./types-ClvtD-R6.js";
import { $t as ReplyDispatchKind, F as PluginHookName, Gt as PluginApprovalResolution, I as PluginHookRegistration$1, Kt as PluginHookBeforeToolCallResult, L as PluginHookRegistrationOptions, Qt as ReplyDispatchBeforeDeliverOptions, Zt as ReplyDispatchBeforeDeliver, _t as PluginNextTurnInjectionEnqueueResult, at as PluginHookToolInputKind, dt as PluginToolMatcher, en as ReplyDispatchRuntimeInfo, gt as PluginNextTurnInjection, k as PluginHookHandlerMap, nn as ReplyFollowupAdmissionBarrierTimeoutPolicy, ot as PluginHookToolKind, st as PluginHookToolRequesterContext, tn as ReplyDispatcher, yt as PluginJsonValue } from "./subagent-requester-context-CM5vebzA.js";
import { l as CronRuntimeAuthority } from "./types-BKb7Omjs.js";
import { a as PluginConversationBindingResolvedEvent$1, n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "./conversation-binding.types-DwbCbzuN.js";
import { a as SkillTelemetrySource, i as SkillSnapshot, o as SkillUsagePath, r as SkillEligibilityContext, t as ExplicitSkillSelection } from "./types-Hb8WnKto.js";
import { _ as ExecSecurity, g as ExecMode, m as ExecAsk, v as ExecTarget } from "./exec-approvals-core-ByvfWxmW.js";
import { n as AnyAgentTool } from "./common-B5mmPMAR.js";
import { a as AuthStorage, i as ModelRegistry$1, o as OAuthCredentials, s as OAuthLoginCallbacks } from "./model-catalog-BcMhxa3j.js";
import { n as ModelCatalogSnapshot, r as ProviderCatalogOutcome, t as ModelCatalogEntry } from "./model-catalog.types-CNC2UliR.js";
import { S as MessageReceipt } from "./types-Bw7pm7u4.js";
import { p as WizardPrompter } from "./setup-wizard-types-CJi1UTUw.js";
import { a as buildAgentSessionKey, s as resolveAgentRoute } from "./resolve-route-DygfN30k.js";
import { r as OutboundPayloadDeliverySuppressionReason } from "./deliver-types-DVCVe8Gi.js";
import { d as chunkMarkdownTextWithMode, f as chunkText, h as resolveTextChunkLimit, l as chunkByNewline, m as resolveChunkMode, n as ChannelOutboundAdapter, p as chunkTextWithMode, u as chunkMarkdownText } from "./outbound.types-d5PlQIet.js";
import { t as ChannelPlugin$3 } from "./types.plugin-dRT3k41V.js";
import { r as LogLevel } from "./subsystem-RmDRaRJV.js";
import { A as SessionsCatalogContinueParams, C as SessionCatalogHost, F as SessionsCatalogReadResult, O as SessionsCatalogArchiveParams, P as SessionsCatalogReadParams, f as NodePluginToolDescriptor } from "./index-Cf_fvo6T.js";
import { v as OpenClawPluginNodeHostCommand } from "./computer-use-contract-DHdgBL-1.js";
import { o as SsrFPolicy } from "./ssrf-UB_ute2q.js";
import { r as InternalHookHandler } from "./internal-hook-types-BwvTZGLB.js";
import { i as HookEntry } from "./hook-runner-global-BEGdgnYh.js";
import { r as PluginActivationSource } from "./config-state-ClGPNZQj.js";
import { a as resolveAgentWorkspaceDir, i as resolveAgentDir } from "./agent-scope-config-DWowhgWE.js";
import { n as onSessionTranscriptUpdate } from "./transcript-events-NaJslr2l.js";
import { n as resolveSessionStorePathCore } from "./paths-ksWeUTdn.js";
import { t as detectMime } from "./mime-utzY7B78.js";
import { N as ResolvedChannelMessageIngress, U as InboundImplicitMentionKind, X as implicitMentionKindWhen, Z as resolveInboundMentionDecision, c as ChannelIngressQueue, g as ChannelIngressCommandAccess, m as CreateChannelIngressQueueOptions, n as CreateChannelIngressDrainOptions, t as ChannelIngressDrain } from "./ingress-drain-ZR4BIzwU.js";
import { f as TypingCallbacks, n as CreateChannelReplyPipelineParams, u as ResponsePrefixContext } from "./reply-pipeline-C9c24B38.js";
import { l as InboundLastRouteUpdate, s as SessionBindingRecord, t as buildPairingReply, u as RecordInboundSession$1 } from "./pairing-messages-CKBHvQNZ.js";
import { s as CommandNormalizeOptions, u as ShouldHandleTextCommandsParams } from "./commands-registry.types-RlSWRsbu.js";
import { t as hasControlCommand } from "./command-detection-BkSIhRX4.js";
import { t as convertMarkdownTables } from "./tables-BBMGs0qO.js";
import { a as removeAckReactionAfterReply, d as resolveHumanDelayConfig, i as createAckReactionHandle, l as resolveAgentIdentity, o as removeAckReactionHandleAfterReply, s as shouldAckReaction, u as resolveEffectiveMessagesConfig } from "./ack-reactions-ok0cHNnJ.js";
import { o as resolveEnvelopeFormatOptions, r as formatAgentEnvelope } from "./envelope-eOG923rJ.js";
import { i as UpsertChannelPairingRequestForAccount, n as ReadChannelAllowFromStoreForAccount, r as RemoveChannelAllowFromStoreEntryForAccount } from "./pairing-store.types-Clt16zYO.js";
import { s as saveMediaBuffer } from "./store-CU-s5VWG.js";
import { c as saveRemoteMedia, l as saveResponseMedia, o as fetchRemoteMedia, s as readRemoteMediaBuffer, t as isVoiceCompatibleAudio } from "./audio-6Ll7Sv2l.js";
import { g as recordChannelActivity, h as getChannelActivity, o as enqueueSystemEvent } from "./system-events-Cj6jWrR0.js";
import { n as resolveChannelGroupPolicy, r as resolveChannelGroupRequireMention } from "./group-policy-CPq7Jrqp.js";
import { n as createInboundDebouncer, r as resolveInboundDebounceMs } from "./inbound-debounce-DTOFJXqQ.js";
import { a as OutboundDeliveryQueuePolicy, r as DurableFinalDeliveryRequirements, t as DeliverOutboundPayloadsParams } from "./deliver-CmJVAKa4.js";
import { t as ResolveMarkdownTableMode } from "./markdown-tables.types-KdkO16s1.js";
import { o as resizeToJpeg, r as getImageMetadata } from "./media-services-DbvkEzv8.js";
import { n as loadWebMedia } from "./web-media-JSotlhom.js";
import { i as shouldLogVerbose } from "./globals-BSGGiwb5.js";
import { a as MediaUnderstandingRuntime } from "./runtime-types-DSy6lpcT.js";
import { TSchema, Type } from "typebox";
import { ZodTypeAny } from "zod";
import { CallToolResult, ListResourceTemplatesResult, ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import { DatabaseSync } from "node:sqlite";
import { Duplex } from "node:stream";
import { IncomingMessage, ServerResponse } from "node:http";
import { Command } from "commander";

//#region src/agents/agent-runtime-id.d.ts
type EmbeddedAgentRuntime = "openclaw" | "auto" | (string & {});
//#endregion
//#region src/auto-reply/heartbeat-tool-response.d.ts
/** Tool name used by heartbeat runs to report visible or silent progress. */
declare const HEARTBEAT_RESPONSE_TOOL_NAME = "heartbeat_respond";
/** Allowed heartbeat response outcomes. */
declare const HEARTBEAT_TOOL_OUTCOMES: readonly ["no_change", "progress", "done", "blocked", "needs_attention"];
type HeartbeatToolOutcome = (typeof HEARTBEAT_TOOL_OUTCOMES)[number];
/** Allowed heartbeat notification priorities. */
declare const HEARTBEAT_TOOL_PRIORITIES: readonly ["low", "normal", "high"];
type HeartbeatToolPriority = (typeof HEARTBEAT_TOOL_PRIORITIES)[number];
/** Normalized response emitted by the heartbeat response tool. */
type HeartbeatToolResponse = {
  outcome: HeartbeatToolOutcome;
  notify: boolean;
  summary: string;
  notificationText?: string;
  reason?: string;
  priority?: HeartbeatToolPriority;
  nextCheck?: string; /** Complete replacement for the current heartbeat monitor's private scratch. */
  scratch?: string;
};
/** Validate and normalize unknown heartbeat tool output. */
declare function normalizeHeartbeatToolResponse(value: unknown): HeartbeatToolResponse | undefined;
//#endregion
//#region src/infra/heartbeat-wake-contracts.d.ts
type HeartbeatRunResult = {
  status: "ran";
  durationMs: number;
} | {
  status: "skipped";
  reason: string;
  retryAtMs?: number;
} | {
  status: "failed";
  reason: string;
};
type HeartbeatWakeIntent = "scheduled" | "task" | "event" | "immediate" | "manual";
type HeartbeatWakeSource = "interval" | "manual" | "exec-event" | "notifications-event" | "cron" | "hook" | "background-task" | "background-task-blocked" | "acp-spawn" | "session-state" | "cli-watchdog" | "restart-sentinel" | "retry" | "other";
type HeartbeatWakeOverride = {
  target?: string;
  to?: string | undefined;
  accountId?: string | undefined;
};
/** Cron-owned periodic work carried directly into a guarded heartbeat turn. */
type HeartbeatScheduledTask = {
  jobId: string;
  name: string;
  prompt: string;
};
//#endregion
//#region src/infra/heartbeat-wake.d.ts
declare function requestHeartbeat(opts: {
  source: HeartbeatWakeSource;
  intent: HeartbeatWakeIntent;
  reason?: string;
  coalesceMs?: number;
  agentId?: string;
  sessionKey?: string;
  heartbeat?: HeartbeatWakeOverride;
  scheduledEveryMs?: number;
  scheduledAnchorMs?: number;
  tasks?: readonly HeartbeatScheduledTask[];
}): void;
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
//#region src/auto-reply/reply/reply-run-finalization-lease.d.ts
type ReplyOperationStaleReason$1 = "terminal_unreleased" | "finalization_stalled" | "no_activity" | "stuck_recovery";
//#endregion
//#region src/auto-reply/reply/reply-run-registry.contracts.d.ts
type ReplyRunKey = string;
type ReplyBackendKind = "embedded" | "cli";
type ReplyBackendCancelReason = "user_abort" | "restart" | "superseded";
type ReplyTurnKind = "visible" | "heartbeat" | "queued_followup";
type ReplyBackendQueueMessageOptions = {
  steeringMode?: "all"; /** True when this queue item came from the channel's current user turn. */
  isInboundUserMessage?: boolean; /** Exact tool authority resolved for an inbound user turn before steering. */
  toolAuthorityFingerprint?: string; /** Internal proof that a mismatched route recomputes to the active run's full authority. */
  pendingInputAuthorityFingerprint?: string;
  debounceMs?: number; /** Ordered current-turn images to inject with the steering text. */
  images?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[]; /** Ordered facts represented by attachment text in this steering prompt. */
  media?: MediaFact[];
  deliveryTimeoutMs?: number;
  waitForTranscriptCommit?: boolean; /** Stable source identity for exact queued-message commit/cancellation matching. */
  queueIdentity?: string;
  abortSignal?: AbortSignal; /** Releases arrival ordering once the runtime has actually accepted this queue item. */
  onQueueAccepted?: (accepted: boolean) => void;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode; /** Prepared channel turn to merge only at transcript persistence. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
};
type ReplyToolAuthorityRoute = Readonly<{
  provider: string;
  model: string;
}>;
/** Per-message authority facts projected against an active run's frozen owner state. */
type ReplyToolAuthorityOverlay = Readonly<{
  originatingChannel?: OriginatingChannelType;
  messageProvider?: string;
  chatType?: ChatType;
  agentAccountId?: string;
  conversationToolPolicy?: GroupToolPolicyConfig;
  groupId?: string;
  groupChannel?: string;
  groupSpace?: string;
  memberRoleIds?: string[];
  spawnedBy?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  senderIsOwner: boolean;
  inputProvenance?: InputProvenance;
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  toolsAllow?: string[];
  disableTools: boolean;
  traceAuthorized: boolean;
  approvalReviewerDeviceId?: string;
  clientCaps?: string[];
  toolBindings?: Readonly<Record<string, unknown>>;
}>;
type ReplyToolAuthorityProjector = (overlay: ReplyToolAuthorityOverlay, route: ReplyToolAuthorityRoute) => string;
type ReplyBackendQueueMessageResult = {
  /** Acceptance was irreversible, but the harness could not prove transcript commitment. */transcriptCommit: "unconfirmed";
  errorMessage: string;
};
type ReplyBackendMessageInjection = {
  /** Runtime-owned admission state; independent from token streaming. */isAvailable(): boolean;
  queueMessage(text: string, options?: ReplyBackendQueueMessageOptions): Promise<void | ReplyBackendQueueMessageResult>;
};
type ReplyBackendHandle = {
  readonly kind: ReplyBackendKind;
  readonly runId?: string; /** Exact authority of this concrete backend attempt, after fallback selection. */
  readonly toolAuthorityFingerprint?: string;
  readonly sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  readonly taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode; /** True only when queueMessage preserves images supplied in its options. */
  readonly supportsQueueMessageImages?: boolean;
  cancel(reason?: ReplyBackendCancelReason): void;
  readonly messageInjection?: ReplyBackendMessageInjection; /** @deprecated Compatibility for shipped embedded handles. Use messageInjection. */
  isStreaming?: () => boolean;
  isStopped?: () => boolean;
  isAbortable?: () => boolean; /** @deprecated Compatibility for shipped embedded handles. Use messageInjection. */
  queueMessage?: (text: string, options?: ReplyBackendQueueMessageOptions) => Promise<void | ReplyBackendQueueMessageResult>;
  /**
   * Compatibility-only hook so legacy "abort compacting runs" paths can still
   * find embedded runs that are compacting during the main run phase.
   */
  isCompacting?: () => boolean;
};
/** Prevents steering a turn into a run that cannot preserve its model-facing input. */
type ReplyOperationPhase = "queued" | "waiting_for_deferred_maintenance" | "waiting_for_global_lane" | "preflight_compacting" | "memory_flushing" | "running" | "completed" | "failed" | "aborted";
type ReplyOperationFailureCode = "gateway_draining" | "command_lane_cleared" | "aborted_by_user" | "session_corruption_reset" | "run_stalled" | "run_failed";
type ReplyOperationAbortCode = "aborted_by_user" | "aborted_for_restart" | "aborted_for_supersession";
type ReplyOperationResult = {
  kind: "completed";
} | {
  kind: "failed";
  code: ReplyOperationFailureCode;
  cause?: unknown;
} | {
  kind: "aborted";
  code: ReplyOperationAbortCode;
};
type ReplyOperation = {
  readonly key: ReplyRunKey;
  readonly sessionId: string;
  readonly turnKind: ReplyTurnKind; /** Gateway lifecycle that admitted this process-local owner. */
  readonly lifecycleGeneration?: string;
  readonly routeThreadId?: string | number; /** Transcript branch leaf from which this operation was admitted. */
  readonly originatingLeafEntryId?: string | null;
  readonly abortSignal: AbortSignal;
  readonly resetTriggered: boolean;
  /**
   * True when this operation was admitted to recover a terminal session (a
   * leftover failed/timeout/killed run). Concurrent visible turns reading the
   * same terminal store snapshot must NOT force-clear such an operation: it is a
   * sibling recovery already in flight, not the proven stale leftover.
   */
  readonly terminalRecovery: boolean;
  /**
   * Sticky fact for audio accepted into this operation after its originating turn.
   * Final delivery reads it because the original dispatch context cannot change.
   */
  readonly acceptedSteeredInboundAudio: boolean; /** Immutable tool authority accepted by the active backend for steered user turns. */
  readonly toolAuthorityFingerprint?: string; /** Concrete provider/model route currently selected for this operation. */
  readonly toolAuthorityRoute?: ReplyToolAuthorityRoute;
  readonly phase: ReplyOperationPhase;
  readonly result: ReplyOperationResult | null; /** Set when a stale-watchdog expiry forced this operation's run_stalled result. */
  readonly staleExpiryReason?: ReplyOperationStaleReason;
  readonly startedAtMs: number;
  readonly lastActivityAtMs: number; /** True when this operation has owned the supplied session ID. */
  hasOwnedSessionId(sessionId: string): boolean;
  recordActivity(): void;
  setPhase(next: "queued" | "waiting_for_deferred_maintenance" | "waiting_for_global_lane" | "preflight_compacting" | "memory_flushing" | "running"): void; /** Mark this operation as waiting on prior same-session maintenance. */
  markWaitingForDeferredMaintenance(): void; /** Return a maintenance-waiting operation to queued if the run has not started. */
  markDeferredMaintenanceWaitEnded(): void; /** Mark this operation as waiting for process-global run capacity. */
  markWaitingForGlobalLane(): void; /** Return a global-lane-waiting operation to queued once capacity is granted. */
  markGlobalLaneWaitEnded(): void; /** Mark this operation as an in-flight terminal-session recovery. */
  markTerminalRecovery(): void;
  markAcceptedSteeredInboundAudio(): void; /** Bind provisional request authority before a concrete backend attempt attaches. */
  bindToolAuthorityFingerprint(fingerprint: string): void; /** Bind the active run's immutable authority projector for direct inbound steering. */
  bindToolAuthorityProjector(projector: ReplyToolAuthorityProjector): void; /** Project an inbound turn through the current concrete route; settled owners fail closed. */
  projectToolAuthorityFingerprint(overlay: ReplyToolAuthorityOverlay): string | undefined; /** Record the concrete candidate route; fallback attempts may replace it. */
  bindToolAuthorityRoute(route: ReplyToolAuthorityRoute): void;
  updateSessionId(nextSessionId: string): void;
  /**
   * Move this queued operation to another session key's run slot. Native command
   * turns admit under the slash SOURCE key; when the command continues into a full
   * agent turn it must own the TARGET session's slot so concurrent target inbounds
   * queue/steer instead of double-admitting. Throws ReplyRunAlreadyActiveError when
   * the target slot is owned.
   */
  updateSessionKey(nextSessionKey: string): void;
  attachBackend(handle: ReplyBackendHandle): void;
  detachBackend(handle: ReplyBackendHandle): void; /** Reject later aborts after the backend has committed its terminal outcome. */
  freezeAbort(): void;
  /**
   * Keep a failed operation active until complete() releases the session lane.
   * Dispatch uses this while a user-visible failure payload still needs delivery.
   */
  retainFailureUntilComplete(): void; /** Settles after the lifecycle owner's final delivery/persistence barrier. */
  readonly ownerSettlement?: Promise<void>;
  complete(): void;
  /**
   * Complete the operation, clear active-run state, then run follow-up work.
   * Use when the follow-up can create another ReplyOperation for this session.
   */
  completeThen(afterClear: () => void): void;
  /**
   * Clear active-run state immediately, but delay registered after-clear work
   * until delivery or another external barrier settles.
   */
  completeWithAfterClearBarrier(barrier: PromiseLike<unknown>, timeout?: number | ReplyFollowupAdmissionBarrierTimeoutPolicy): void;
  fail(code: Exclude<ReplyOperationFailureCode, "aborted_by_user">, cause?: unknown): void;
  abortByUser(): boolean;
  abortForRestart(): boolean;
  supersede(): boolean;
};
type ReplyOperationStaleReason = ReplyOperationStaleReason$1;
//#endregion
//#region src/process/command-queue.types.d.ts
/**
 * Public enqueue knobs shared by command-lane callers and narrower injection
 * points that should not import the full queue implementation.
 */
type CommandQueueEnqueueOptions = {
  warnAfterMs?: number;
  onWait?: (waitMs: number, queuedAhead: number) => void;
  taskTimeoutMs?: number;
  taskTimeoutProgressAtMs?: () => number | undefined;
  taskTimeoutAbortSignal?: AbortSignal;
  taskTimeoutAbortGraceMs?: number; /** Ends the task after a caller-owned timeout cleanup grace has already elapsed. */
  taskTimeoutReleaseSignal?: AbortSignal;
  priority?: "foreground" | "normal" | "background";
};
/** Minimal queue function contract used by code that only needs to schedule work. */
type CommandQueueEnqueueFn = <T>(task: () => Promise<T>, opts?: CommandQueueEnqueueOptions) => Promise<T>;
//#endregion
//#region src/skills/workshop/collection-contracts.d.ts
type SkillCollectionReconcileResult = {
  backupId: string;
  kept: string[];
  written: string[];
  dropped: Array<{
    name: string;
    reason: string;
  }>;
};
type SkillCollectionReconcileContext = {
  agentIds?: string[];
  approvedSkillNames?: Set<string>;
  approvedSkillNamesByAgent?: Array<Set<string>>;
  readSkillHashes?: Map<string, string>;
  readSkillTreeHashes?: Map<string, string>;
  readSkillBytes?: Map<string, number>;
  readByteCount?: number;
  reconciling?: boolean;
  result?: SkillCollectionReconcileResult;
};
//#endregion
//#region src/skills/workshop/types.d.ts
type SkillProposalOrigin = {
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
};
/** Run-scoped budget shared by every workshop tool instance created across runner retries. */
type SkillWorkshopProposalMutationBudget = {
  remaining: number; /** Distinct proposal records successfully mutated by this run. */
  completed?: number; /** Successful persisted mutation calls, including repeated revisions. */
  successfulMutations?: number; /** Failed or incompletely checkpointed reservations in the current model run. */
  failedMutations?: number; /** Run-local identity set used to keep idea counts distinct. */
  mutatedProposalIds?: Set<string>; /** Content hash per live skill read this run; autonomous updates require a matching receipt. */
  readSkillHashes?: Map<string, string>;
};
type SkillWorkshopProposalReviewProgress = {
  proposalIds: string[];
  remaining: number;
  successfulMutations: number;
};
/** Shared completion latch for proposal-only reviewers that require a durable final checkpoint. */
type SkillWorkshopProposalReviewCompletion = {
  activeMutations?: Set<Promise<void>>;
  completed: boolean;
  complete: () => Promise<void>;
  phase?: "open" | "completing" | "completed";
  recordProgress?: (progress: SkillWorkshopProposalReviewProgress) => Promise<void>;
};
type SkillWorkshopRunOptions = {
  env?: NodeJS.ProcessEnv;
  proposalOnly?: boolean;
  updateProposals?: boolean;
  autonomousCapture?: boolean;
  origin?: SkillProposalOrigin;
  proposalMutationBudget?: SkillWorkshopProposalMutationBudget;
  proposalReviewCompletion?: SkillWorkshopProposalReviewCompletion;
  collectionReconcile?: SkillCollectionReconcileContext;
};
//#endregion
//#region src/agents/bash-tools.exec-approval-output.d.ts
type ExecApprovalContinuationPromptRange = {
  start: number;
  end: number;
};
//#endregion
//#region src/infra/event-session-routing.d.ts
/** Routing policy derived from config and the source session for an event. */
type EventSessionRoutingPolicy = {
  mainKey?: string;
  sessionScope?: SessionScope;
  dmScope?: string | null;
  allowFrom?: ReadonlyArray<string | number> | null;
  channel?: string | null;
  accountId?: string | null;
  preserveSessionKey?: boolean;
};
//#endregion
//#region src/infra/exec-auto-review.d.ts
/** Risk level returned by exec auto-reviewers for approval routing decisions. */
type ExecAutoReviewRisk = "unknown" | "low" | "medium" | "high";
/** Auto-review outcome: either approve once or send the command to normal approval. */
type ExecAutoReviewDecision = {
  decision: "allow-once";
  rationale: string;
  risk: "low";
} | {
  decision: "ask";
  rationale: string;
  risk: ExecAutoReviewRisk;
};
/** Execution host whose command policy context is being reviewed. */
type ExecAutoReviewHost = "gateway" | "node" | "codex-app-server";
/** Command and policy facts supplied to an exec auto-reviewer. */
type ExecAutoReviewInput = {
  command: string;
  argv?: readonly string[];
  resolvedPath?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host: ExecAutoReviewHost;
  reason: "approval-required" | "allowlist-miss" | "strict-inline-eval" | "heredoc" | "execution-plan-miss";
  analysis: {
    parsed: boolean;
    allowlistMatched: boolean;
    safeBinMatched?: boolean;
    durableApprovalMatched?: boolean;
    inlineEval: boolean;
    heredoc?: boolean;
    shellWrapper?: boolean;
  };
  agent?: {
    id?: string | null;
    sessionKey?: string | null;
  };
};
/** Reviewer function used by gateway/node exec paths before human approval fallback. */
type ExecAutoReviewer = (input: ExecAutoReviewInput) => Promise<ExecAutoReviewDecision> | ExecAutoReviewDecision;
//#endregion
//#region src/process/supervisor/types.d.ts
type TerminationReason = "manual-cancel" | "overall-timeout" | "no-output-timeout" | "spawn-error" | "signal" | "exit";
//#endregion
//#region src/agents/sandbox/fs-bridge.types.d.ts
/**
 * Public sandbox filesystem bridge contracts.
 *
 * Tool and backend code use this interface to access files through the sandbox
 * boundary instead of reaching directly into host paths.
 */
/** Resolved sandbox path with host, relative, and container views. */
type SandboxResolvedPath = {
  hostPath?: string;
  relativePath: string;
  containerPath: string;
};
/** Minimal file stat shape returned by sandbox fs bridge implementations. */
type SandboxFsStat = {
  type: "file" | "directory" | "other";
  size: number;
  mtimeMs: number;
};
/** Filesystem operations exposed across the sandbox boundary. */
type SandboxFsBridge = {
  resolvePath(params: {
    filePath: string;
    cwd?: string;
  }): SandboxResolvedPath; /** Reads a safely opened regular file, rejecting growth beyond an optional byte limit. */
  readFile(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
    maxBytes?: number;
  }): Promise<Buffer>; /** Streams a regular file within the sandbox when the backend supports native copying. */
  copyFile?(params: {
    sourcePath: string;
    destinationPath: string;
    cwd?: string;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  writeFile(params: {
    filePath: string;
    cwd?: string;
    data: Buffer | string;
    encoding?: BufferEncoding;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  /**
   * Atomically creates a file only when no entry already exists at the path.
   * Backends without this capability must omit it rather than emulate it with
   * a check followed by writeFile.
   */
  createFileExclusive?(params: {
    filePath: string;
    cwd?: string;
    data: Buffer | string;
    encoding?: BufferEncoding;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<"created" | "exists">;
  mkdirp(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<void>;
  remove(params: {
    filePath: string;
    cwd?: string;
    recursive?: boolean;
    force?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  rename(params: {
    from: string;
    to: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<void>;
  stat(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<SandboxFsStat | null>;
};
//#endregion
//#region src/agents/sandbox/backend-handle.types.d.ts
/**
 * Backend-neutral sandbox runtime handles used by Docker, SSH, and future sandbox providers.
 */
type SandboxBackendId = string;
/** Shell exec specification prepared by a sandbox backend for process launch. */
type SandboxBackendExecSpec = {
  argv: string[];
  env: NodeJS.ProcessEnv;
  stdinMode: "pipe-open" | "pipe-closed";
  finalizeToken?: unknown;
};
type SandboxBackendWorkdirValidation = "host" | "backend";
type SandboxBackendWorkdirValidator = (workdir: string) => Promise<string | null>;
type SandboxBackendPreparedWorkdirDiscarder = (workdir: string) => void;
/** Parameters for backend-managed shell commands used by fs bridges and probes. */
type SandboxBackendCommandParams = {
  script: string;
  args?: string[];
  stdin?: Buffer | string;
  allowFailure?: boolean;
  signal?: AbortSignal;
};
/** Buffered command result returned by sandbox backend shell helpers. */
type SandboxBackendCommandResult = {
  stdout: Buffer;
  stderr: Buffer;
  code: number;
};
/** Runtime context passed to backend-provided filesystem bridge factories. */
type SandboxFsBridgeContext = {
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  workspaceAccess: "none" | "ro" | "rw";
  containerName: string;
  containerWorkdir: string;
  docker: {
    binds?: string[];
  };
  backend?: {
    runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
  };
};
/** Live sandbox backend handle for command execution, cleanup, and optional fs bridge creation. */
type SandboxBackendHandle = {
  id: SandboxBackendId;
  runtimeId: string;
  runtimeLabel: string;
  workdir: string;
  env?: Record<string, string>;
  configLabel?: string;
  configLabelKind?: string;
  /**
   * Remote backends own cwd existence checks because valid runtime paths may
   * not exist in the local workspace mirror. Backend validation must be paired
   * with validateWorkdir so cwd is proved after before_tool_call adjustments
   * and before env resolution, approval, preflight, and launch.
   */
  workdirValidation?: SandboxBackendWorkdirValidation;
  validateWorkdir?: SandboxBackendWorkdirValidator; /** Discard one-shot state created while validating a backend-owned cwd. */
  discardPreparedWorkdir?: SandboxBackendPreparedWorkdirDiscarder; /** Remote cwd roots managed by backend validation. Defaults to workdir. */
  workdirRoots?: readonly string[];
  capabilities?: {
    browser?: boolean;
  };
  buildExecSpec(params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
    usePty: boolean;
  }): Promise<SandboxBackendExecSpec>;
  finalizeExec?: (params: {
    status: "completed" | "failed";
    exitCode: number | null;
    timedOut: boolean;
    token?: unknown;
  }) => Promise<void>;
  runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
  createFsBridge?: (params: {
    sandbox: SandboxFsBridgeContext;
  }) => SandboxFsBridge;
};
//#endregion
//#region src/agents/bash-tools.shared.d.ts
/** Sandbox metadata needed to map host workspaces into container exec calls. */
type BashSandboxWorkdirMount = {
  hostPath: string;
  containerPath: string;
};
type BashSandboxConfig = {
  containerName: string;
  workspaceDir: string;
  containerWorkdir: string;
  workdirValidation?: SandboxBackendWorkdirValidation;
  validateWorkdir?: SandboxBackendWorkdirValidator;
  discardPreparedWorkdir?: (workdir: string) => void;
  workdirRoots?: readonly string[]; /** Approved read-only skill mounts that may be selected as an exec workdir. */
  readOnlyWorkspaceSkillMounts?: readonly BashSandboxWorkdirMount[];
  env?: Record<string, string>;
  buildExecSpec?: (params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
    usePty: boolean;
  }) => Promise<SandboxBackendExecSpec>;
  finalizeExec?: (params: {
    status: "completed" | "failed";
    exitCode: number | null;
    timedOut: boolean;
    token?: unknown;
  }) => Promise<void>;
};
//#endregion
//#region src/agents/accepted-session-spawn.d.ts
type AcceptedSessionSpawn = {
  runId: string;
  childSessionKey: string;
};
//#endregion
//#region src/agents/agent-run-terminal-reply.d.ts
type AgentRunTerminalReplySnapshot = {
  disposition: "visible";
  text: string;
} | {
  disposition: "silent";
} | {
  disposition: "empty";
};
//#endregion
//#region src/agents/embedded-agent-messaging.types.d.ts
type MessagingToolSend = {
  tool: string;
  provider: string;
  accountId?: string;
  to?: string;
  threadId?: string;
  threadImplicit?: boolean;
  threadSuppressed?: boolean;
  text?: string;
  mediaUrls?: string[];
  hasRichContent?: true; /** Current-source progress (`false`) or completed reply (`true`). */
  sourceReplyFinal?: boolean;
};
type MessagingToolSourceReplyPayload = Pick<ReplyPayload, "audioAsVoice" | "channelData" | "interactive" | "mediaUrl" | "mediaUrls" | "presentation" | "text"> & {
  idempotencyKey?: string; /** Current-source progress (`false`) or completed reply (`true`). */
  sourceReplyFinal?: boolean;
};
//#endregion
//#region src/agents/mcp-connect-action.d.ts
type McpConnectAction = {
  serverName: string;
  authorizationUrl: string;
};
//#endregion
//#region src/agents/mcp-codex-tool-approval.d.ts
type McpCodexToolAnnotations = {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
};
//#endregion
//#region src/agents/agent-bundle-mcp-types.d.ts
/** Catalog metadata for one configured MCP server. */
type McpServerCatalog = {
  serverName: string;
  safeServerName?: string;
  launchSummary: string;
  toolCount: number;
  resources?: {
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  tools?: {
    listChanged?: boolean;
    filteredCount?: number;
  };
  requestTimeoutMs?: number;
  supportsParallelToolCalls?: boolean;
  toolFilter?: {
    include?: string[];
    exclude?: string[];
  };
  deniedToolNames?: string[];
  codexApprovalMode?: McpCodexToolApprovalMode;
};
/** MCP tool entry after server-name sanitization and schema normalization. */
type McpCatalogTool = {
  serverName: string;
  safeServerName: string;
  toolName: string;
  title?: string;
  description?: string;
  inputSchema: TSchema;
  fallbackDescription: string;
  uiResourceUri?: string;
  uiVisibility?: Array<"app" | "model">;
  deniedBySession?: true;
  codexAnnotations?: McpCodexToolAnnotations;
};
/** Complete tool catalog for a session-scoped MCP runtime. */
type McpToolCatalog = {
  version: number;
  generatedAt: number;
  servers: Record<string, McpServerCatalog>;
  tools: McpCatalogTool[]; /** Listed tools hidden only by the session override, retained for read-only inventory. */
  sessionDeniedTools?: McpCatalogTool[];
  diagnostics?: readonly McpToolCatalogDiagnostic[];
};
/** Transient requester sign-in surface kept outside the remembered live catalog. */
type RequesterMcpConnect = {
  catalog: McpToolCatalog;
  authorizedServerNames: readonly string[];
  configFingerprint: string;
  createExecute: (serverName: string) => AnyAgentTool["execute"] | undefined;
};
type McpToolCatalogDiagnostic = {
  serverName: string;
  safeServerName: string;
  launchSummary: string;
  message: string;
};
type McpRequestOptions = {
  failureBackoff?: "track" | "ignore";
};
/** Trusted requester identity used to scope per-user MCP connections. */
type SessionMcpRequesterScope = {
  requesterSenderId: string;
  agentAccountId?: string;
  messageChannel?: string;
};
/** Live MCP runtime bound to one session/workspace. */
type SessionMcpRuntime = {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  agentDir?: string;
  configFingerprint: string; /** Present when this runtime is keyed by requester-scoped connection identity. */
  requesterScope?: SessionMcpRequesterScope;
  requesterConnect?: RequesterMcpConnect;
  /**
   * True when the named server's connection is requester-scoped. App views for
   * such servers stay fail-closed: views outlive the requester-authenticated
   * run and the gateway view boundary carries no requester identity.
   */
  isRequesterScopedServer?: (serverName: string) => boolean;
  mcpAppsEnabled?: boolean; /** Latest non-persisted App context, owned by the exact live view that supplied it. */
  pendingMcpAppModelContext?: {
    owner: object;
    text: string;
    leased?: boolean;
  }; /** Blocks a deferred-retirement view from restoring context across reset. */
  mcpAppModelContextRevoked?: boolean;
  createdAt: number;
  lastUsedAt: number;
  activeLeases?: number;
  acquireLease?: () => () => void; /** Lists tools if needed and may connect MCP transports. */
  getCatalog: () => Promise<McpToolCatalog>; /** Returns the cached catalog only; must not start runtimes, connect transports, or issue tools/list. */
  peekCatalog: () => McpToolCatalog | null; /** Returns the configured request timeout for a server from the connected session, without touching the catalog. */
  getServerRequestTimeoutMs?: (serverName: string) => number | undefined;
  markUsed: () => void;
  callTool: (serverName: string, toolName: string, input: unknown) => Promise<CallToolResult>;
  listTools?: (serverName: string, params?: {
    cursor?: string;
  }) => Promise<ListToolsResult>;
  listResources?: (serverName: string, options?: McpRequestOptions) => Promise<unknown>;
  readResource?: (serverName: string, uri: string, options?: McpRequestOptions) => Promise<unknown>;
  listResourceTemplates?: (serverName: string, params?: {
    cursor?: string;
  }) => Promise<ListResourceTemplatesResult>;
  listPrompts?: (serverName: string) => Promise<unknown>;
  getPrompt?: (serverName: string, name: string, args?: Record<string, string>) => Promise<unknown>;
  dispose: () => Promise<void>;
};
//#endregion
//#region src/agents/mcp-ui-resource.d.ts
type McpAppChannelView = {
  viewId: string;
};
//#endregion
//#region src/agents/model-fallback.types.d.ts
type ModelFallbackRouteResolution = "raw" | "resolved";
type FallbackAttempt = {
  provider: string;
  model: string;
  error: string;
  reason?: FailoverReason;
  authMode?: string;
  status?: number;
  code?: string;
};
//#endregion
//#region src/agents/run-timeout-attribution.d.ts
/** Agent run phases used when attributing timeout/cancellation sources. */
declare const AGENT_RUN_TIMEOUT_PHASES: readonly ["queue", "preflight", "provider", "post_turn", "gateway_draining"];
/** Timeout attribution phase for agent run lifecycle spans. */
type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
//#endregion
//#region src/agents/usage.d.ts
type ContextUsage = NonNullable<Usage["contextUsage"]>;
/** Provider/SDK usage payload variants accepted by usage normalization. */
type UsageLike = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  contextUsage?: ContextUsage;
  total?: number;
  inputTokens?: number;
  outputTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  input_tokens?: number;
  output_tokens?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  reasoningTokens?: number;
  reasoning_tokens?: number;
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
  output_tokens_details?: {
    reasoning_tokens?: number;
    thinking_tokens?: number;
  };
  cached_tokens?: number;
  input_tokens_details?: {
    cached_tokens?: number;
  };
  prompt_tokens_details?: {
    cached_tokens?: number;
  };
  totalTokens?: number;
  total_tokens?: number;
  cache_read?: number;
  cache_write?: number;
  prompt_n?: number;
  predicted_n?: number;
  timings?: {
    prompt_n?: number;
    predicted_n?: number;
  };
  cost?: Partial<Usage["cost"]>;
};
/** Normalized token counts used by runtime accounting. */
type NormalizedUsage = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  contextUsage?: ContextUsage;
  reasoningTokens?: number;
  total?: number;
};
/** Normalize provider-specific token usage fields into OpenClaw usage buckets. */
declare function normalizeUsage(raw?: UsageLike | null): NormalizedUsage | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/types.d.ts
type BlockReplyFlushContext = {
  /** Boundary that requested the flush. */reason: "message_end" | "terminal";
} | {
  /** Tool boundary separating pre-tool narration from the eventual answer. */reason: "tool_start";
  assistantMessageIndex: number;
} | {
  /** Pre-compaction delivery is safe only for a completed assistant attempt. */reason: "pre_compaction";
  attemptAccepted: boolean;
};
type EmbeddedAgentUsage = Omit<NormalizedUsage, "contextUsage">;
type EmbeddedAgentMeta = {
  sessionId: string;
  sessionFile?: string;
  provider: string;
  model: string;
  contextTokens?: number;
  agentHarnessId?: string;
  fallbackAttempts?: FallbackAttempt[];
  cliSessionBinding?: CliSessionBinding;
  clearCliSessionBinding?: boolean;
  compactionCount?: number;
  /**
   * Token count estimate after the most recent successful auto-compaction.
   * Used as the freshest context snapshot when the follow-up model call omits
   * usage metadata.
   */
  compactionTokensAfter?: number;
  /**
   * Prompt/context snapshot from the latest model request. Prefer this for
   * context-window utilization because provider usage totals can include cached
   * and completion tokens that are useful for billing but noisy as live context.
   */
  promptTokens?: number;
  usage?: EmbeddedAgentUsage; /** Terminal cumulative usage reserved for turn-level diagnostics. */
  diagnosticUsage?: EmbeddedAgentUsage;
  /**
   * Usage from the last individual API call (not accumulated across tool-use
   * loops or compaction retries). Used for context-window utilization display
   * (`totalTokens` in sessions.json) because the accumulated `usage.input`
   * sums input tokens from every API call in the run, which overstates the
   * actual context size.
   */
  lastCallUsage?: NormalizedUsage;
  contextBudgetStatus?: SessionContextBudgetStatus;
  /**
   * True when code mode owned the model tool surface for this run. Config
   * alone is not proof: the "auto" tier engages per model capability, raw
   * model runs and plugin-harness surfaces can decline engagement, and the
   * shell tool is also named `exec`, so consumers must read this flag
   * instead of config or tool names.
   */
  codeModeEngaged?: boolean; /** Completed assistant/provider round trips accumulated across run attempts. */
  assistantTurns?: number;
  /**
   * Code-mode/tool-search inner bridge calls for the run's catalog. These are
   * invisible to the provider; `toolSummary.calls` stays the outer count.
   */
  bridgeCalls?: {
    search: number;
    describe: number;
    call: number;
  }; /** Estimated USD cost of the run's accumulated usage. Omitted when the model has no cost data. */
  costUsd?: number;
};
type TraceAttempt = {
  provider: string;
  model: string;
  result: "success" | "timeout" | "surface_error" | "candidate_failed" | "rotate_profile" | "same_model_rate_limit" | "fallback_model" | "aborted" | "error";
  reason?: string;
  stage?: "prompt" | "assistant";
  elapsedMs?: number;
  status?: number;
};
type ExecutionTrace = {
  winnerProvider?: string;
  winnerModel?: string;
  attempts?: TraceAttempt[];
  fallbackUsed?: boolean;
  runner?: "embedded" | "cli";
};
type RequestShapingTrace = {
  authMode?: string;
  thinking?: string;
  reasoning?: string;
  verbose?: string;
  trace?: string;
  fallbackEligible?: boolean;
  blockStreaming?: string;
};
type PromptSegmentTrace = {
  key: string;
  chars: number;
};
type ToolSummaryTrace = {
  calls: number;
  tools: string[];
  failures?: number;
  totalToolTimeMs?: number;
};
type CompletionTrace = {
  finishReason?: string;
  stopReason?: string;
  refusal?: boolean;
};
type ContextManagementTrace = {
  sessionCompactions?: number;
  lastTurnCompactions?: number;
  preflightCompactionApplied?: boolean;
  postCompactionContextInjected?: boolean;
};
type EmbeddedRunLivenessState = "working" | "paused" | "blocked" | "abandoned";
type EmbeddedRunFailureSignal = {
  kind: "execution_denied";
  source: "tool";
  toolName?: string;
  code: "SYSTEM_RUN_DENIED" | "INVALID_REQUEST";
  message: string;
  fatalForCron: true;
};
type EmbeddedAgentRunMeta = {
  durationMs: number;
  agentMeta?: EmbeddedAgentMeta;
  aborted?: boolean;
  systemPromptReport?: SessionSystemPromptReport;
  finalPromptText?: string;
  finalAssistantVisibleText?: string;
  finalAssistantRawText?: string;
  replayInvalid?: boolean;
  livenessState?: EmbeddedRunLivenessState;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
  agentHarnessResultClassification?: "empty" | "reasoning-only" | "planning-only";
  terminalReplyKind?: "silent-empty";
  terminalReply?: AgentRunTerminalReplySnapshot;
  yielded?: boolean;
  error?: {
    kind: "context_overflow" | "compaction_failure" | "role_ordering" | "image_size" | "retry_limit" | "incomplete_turn" | "hook_block";
    message: string; /** True only when model fallback can retry this terminal error without repeating side effects. */
    fallbackSafe?: boolean; /** True when the payload includes a trusted structured terminal tool summary. */
    terminalPresentation?: boolean;
  };
  failureSignal?: EmbeddedRunFailureSignal; /** Stop reason for the agent run (e.g., "completed", "tool_calls"). */
  stopReason?: string; /** Pending tool calls when stopReason is "tool_calls". */
  pendingToolCalls?: Array<{
    id: string;
    name: string;
    arguments: string;
  }>;
  executionTrace?: ExecutionTrace;
  requestShaping?: RequestShapingTrace;
  promptSegments?: PromptSegmentTrace[];
  toolSummary?: ToolSummaryTrace;
  completion?: CompletionTrace;
  contextManagement?: ContextManagementTrace;
};
type EmbeddedAgentRunResult = {
  latestMcpAppChannelView?: McpAppChannelView;
  latestMcpConnectAction?: McpConnectAction;
  payloads?: Array<{
    text?: string;
    mediaUrl?: string;
    mediaUrls?: string[];
    replyToId?: string;
    isError?: boolean;
    isReasoning?: boolean; /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
    isCommentary?: boolean;
    audioAsVoice?: boolean;
    trustedLocalMedia?: boolean;
    channelData?: Record<string, unknown>;
  }>;
  meta: EmbeddedAgentRunMeta;
  diagnosticTrace?: DiagnosticTraceContext;
  didSendViaMessagingTool?: boolean;
  didDeliverSourceReplyViaMessageTool?: boolean;
  didSendDeterministicApprovalPrompt?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  messagingToolSourceReplyPayloads?: MessagingToolSourceReplyPayload[];
  acceptedSessionSpawns?: AcceptedSessionSpawn[];
  heartbeatToolResponse?: HeartbeatToolResponse;
  successfulCronAdds?: number;
};
type EmbeddedAgentCompactResult = {
  ok: boolean;
  compacted: boolean;
  compactionKind?: "context-engine" | "native-harness" | "server-endpoint";
  reason?: string; /** Structured failure metadata used by model fallback classification. */
  failure?: {
    reason?: string;
    status?: number;
    code?: string;
    rawError?: string;
  };
  result?: {
    /** Identifies summaryless provider compaction in RPC and UI consumers. */kind?: "server-endpoint"; /** Server-endpoint compaction has no transcript summary or first-kept entry. */
    summary?: string;
    firstKeptEntryId?: string;
    tokensBefore: number;
    tokensAfter?: number;
    details?: unknown;
    sessionId?: string;
    sessionFile?: string;
  };
};
type EmbeddedFullAccessBlockedReason = "sandbox" | "host-policy" | "channel" | "runtime";
//#endregion
//#region src/process/exec-output.d.ts
type CommandOutputCaptureMode = "head" | "tail" | "discard";
type CommandOutputStream = "stdout" | "stderr";
type CommandOutputCaptureOption = CommandOutputCaptureMode | {
  stdout?: CommandOutputCaptureMode;
  stderr?: CommandOutputCaptureMode;
};
type CommandOutputLimitOption = boolean | {
  stdout?: boolean;
  stderr?: boolean;
  combined?: boolean;
};
type PreserveOutputLine = (line: string, stream: CommandOutputStream) => boolean;
//#endregion
//#region src/process/exec-runner.d.ts
type CommandOptions = {
  timeoutMs?: number;
  cwd?: string;
  input?: string | Uint8Array;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  windowsVerbatimArguments?: boolean;
  noOutputTimeoutMs?: number;
  signal?: AbortSignal;
  maxOutputBytes?: number | {
    stdout?: number;
    stderr?: number;
  };
  maxCombinedOutputBytes?: number;
  outputCapture?: CommandOutputCaptureOption; /** Observe raw output without owning child lifecycle. Return false to stop the command. */
  onOutputChunk?: (chunk: Buffer, stream: CommandOutputStream) => boolean | void; /** Accept a successful exit when only the selected diagnostic output stream failed. */
  tolerateOutputError?: {
    stdout?: boolean;
    stderr?: boolean;
  };
  terminateOnOutputLimit?: CommandOutputLimitOption;
  maxPreservedOutputLines?: number;
  preserveOutputLine?: PreserveOutputLine;
  killProcessTree?: boolean; /** Signal used when terminating the direct child; tree termination owns its own grace policy. */
  killSignal?: NodeJS.Signals | number;
};
declare function runCommandWithTimeout(argv: string[], optionsOrTimeout: number | CommandOptions): Promise<SpawnResult>;
//#endregion
//#region src/tasks/task-registry.types.d.ts
/** JSON value shape persisted with runtime-owned task detail. */
type JsonValue = null | boolean | number | string | JsonValue[] | {
  [key: string]: JsonValue;
};
/** Runtime family that owns a task run lifecycle. */
type TaskRuntime = "subagent" | "acp" | "cli" | "cron";
type TaskStatus = "queued" | "running" | "succeeded" | "failed" | "timed_out" | "cancelled" | "lost";
type TaskDeliveryStatus = "pending" | "delivered" | "session_queued" | "failed" | "dismissed" | "parent_missing" | "not_applicable";
type TaskNotifyPolicy = "done_only" | "state_changes" | "silent";
/** Semantic success detail for required-completion task outcomes. */
type TaskTerminalOutcome = "succeeded" | "blocked";
type TaskScopeKind = "session" | "system";
type TaskStatusCounts = Record<TaskStatus, number>;
type TaskRuntimeCounts = Record<TaskRuntime, number>;
type TaskRegistrySummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};
type TaskDeliveryState = {
  taskId: string;
  requesterOrigin?: DeliveryContext;
  lastNotifiedEventAt?: number;
};
type TaskRecord = {
  taskId: string;
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey: string;
  ownerKey: string;
  scopeKind: TaskScopeKind;
  childSessionKey?: string;
  parentFlowId?: string;
  parentTaskId?: string;
  agentId?: string;
  /** Agent store for requester transcripts whose session key is unscoped, such as `global`.
   * Task authorization remains keyed by ownerKey. */
  requesterAgentId?: string;
  runId?: string;
  label?: string;
  task: string;
  status: TaskStatus;
  deliveryStatus: TaskDeliveryStatus;
  notifyPolicy: TaskNotifyPolicy;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  lastEventAt?: number;
  cleanupAfter?: number; /** Tool invocations observed on this run's agent-event stream. */
  toolUseCount?: number; /** Name of the most recent tool invocation observed for this run. */
  lastToolName?: string;
  error?: string;
  progressSummary?: string;
  terminalSummary?: string;
  terminalOutcome?: TaskTerminalOutcome;
  detail?: JsonValue;
};
//#endregion
//#region src/tasks/detached-task-runtime-contract.d.ts
type DetachedTaskCreateParams = {
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey?: string;
  ownerKey?: string;
  scopeKind?: TaskScopeKind;
  requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  parentFlowId?: string;
  childSessionKey?: string;
  parentTaskId?: string;
  agentId?: string;
  requesterAgentId?: string;
  runId?: string;
  label?: string;
  task: string;
  preferMetadata?: boolean;
  notifyPolicy?: TaskNotifyPolicy;
  deliveryStatus?: TaskDeliveryStatus;
  detail?: JsonValue;
};
type DetachedRunningTaskCreateParams = DetachedTaskCreateParams & {
  startedAt?: number;
  lastEventAt?: number;
  progressSummary?: string | null;
};
type DetachedTaskStartParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  startedAt?: number;
  lastEventAt?: number;
  progressSummary?: string | null;
  eventSummary?: string | null;
};
type DetachedTaskProgressParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  lastEventAt?: number;
  progressSummary?: string | null;
  eventSummary?: string | null;
};
type DetachedTaskFinalizeCommonParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  childSessionKey?: string | null;
  endedAt: number;
  lastEventAt?: number;
  progressSummary?: string | null;
  terminalSummary?: string | null;
  preserveTerminalSummary?: boolean;
  detail?: JsonValue;
  suppressDelivery?: boolean;
};
type DetachedTaskCompleteParams = DetachedTaskFinalizeCommonParams & {
  terminalOutcome?: TaskTerminalOutcome | null;
};
type DetachedTaskFailParams = DetachedTaskFinalizeCommonParams & {
  status?: Extract<TaskStatus, "failed" | "timed_out" | "cancelled">;
  error?: string;
};
type DetachedTaskFinalizeParams = DetachedTaskFinalizeCommonParams & {
  status: Extract<TaskStatus, "succeeded" | "failed" | "timed_out" | "cancelled">;
  error?: string;
  clearError?: boolean;
  terminalOutcome?: TaskTerminalOutcome | null;
};
type DetachedTaskDeliveryStatusParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  deliveryStatus: TaskDeliveryStatus;
  error?: string;
};
type DetachedTaskCancelParams = {
  cfg: OpenClawConfig;
  taskId: string;
  reason?: string;
};
type DetachedTaskCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskRecord;
};
type DetachedTaskRecoveryAttemptParams = {
  taskId: string;
  runtime: TaskRuntime;
  task: TaskRecord;
  now: number;
};
type DetachedTaskRecoveryAttemptResult = {
  recovered: boolean;
};
type DetachedTaskFindParams = {
  runId: string;
  runtime: TaskRuntime;
  sessionKey: string;
  createdAtOrAfter: number;
  createdBefore?: number;
  allowSessionFallback?: boolean;
};
type DetachedTaskLifecycleRuntime = {
  createQueuedTaskRun: (params: DetachedTaskCreateParams) => TaskRecord | null;
  createRunningTaskRun: (params: DetachedRunningTaskCreateParams) => TaskRecord | null;
  startTaskRunByRunId: (params: DetachedTaskStartParams) => TaskRecord[];
  recordTaskRunProgressByRunId: (params: DetachedTaskProgressParams) => TaskRecord[];
  finalizeTaskRunByRunId?: (params: DetachedTaskFinalizeParams) => TaskRecord[];
  completeTaskRunByRunId: (params: DetachedTaskCompleteParams) => TaskRecord[];
  failTaskRunByRunId: (params: DetachedTaskFailParams) => TaskRecord[];
  setDetachedTaskDeliveryStatusByRunId: (params: DetachedTaskDeliveryStatusParams) => TaskRecord[];
  /**
   * Resolve the task owned by one run generation. Custom runtimes should
   * implement this when their records are not mirrored into core task state.
   */
  findTaskRun?: (params: DetachedTaskFindParams) => TaskRecord | undefined;
  /**
   * Return `found: false` when this runtime does not own the task so core can
   * fall back to the legacy detached-task cancel path.
   */
  cancelDetachedTaskRunById: (params: DetachedTaskCancelParams) => Promise<DetachedTaskCancelResult>;
  /**
   * Give a registered detached runtime one last chance to recover a stale task
   * before core marks it lost during maintenance.
   */
  tryRecoverTaskBeforeMarkLost?: (params: DetachedTaskRecoveryAttemptParams) => DetachedTaskRecoveryAttemptResult | Promise<DetachedTaskRecoveryAttemptResult>;
};
type DetachedTaskLifecycleRuntimeRegistration = {
  pluginId: string;
  runtime: DetachedTaskLifecycleRuntime;
};
//#endregion
//#region src/plugins/agent-tool-result-middleware-types.d.ts
type OpenClawAgentToolResult<TResult = unknown> = AgentToolResult<TResult>;
type AgentToolResultMiddlewareRuntime = "openclaw" | "codex";
type AgentToolResultMiddlewareEvent = {
  threadId?: string;
  turnId?: string;
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  cwd?: string;
  isError?: boolean;
  result: OpenClawAgentToolResult;
};
type AgentToolResultMiddlewareContext = {
  runtime: AgentToolResultMiddlewareRuntime;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};
type AgentToolResultMiddlewareResult = {
  result: OpenClawAgentToolResult;
};
type AgentToolResultMiddleware = (event: AgentToolResultMiddlewareEvent, ctx: AgentToolResultMiddlewareContext) => Promise<AgentToolResultMiddlewareResult | void> | AgentToolResultMiddlewareResult | void;
type AgentToolResultMiddlewareOptions = {
  matcher?: PluginToolMatcher;
  runtimes?: AgentToolResultMiddlewareRuntime[];
};
type AgentToolResultMiddlewareScope = {
  matcher?: PluginToolMatcher;
  runtimes: AgentToolResultMiddlewareRuntime[];
};
//#endregion
//#region src/plugins/codex-app-server-extension-types.d.ts
/** Tool-result event emitted to Codex app-server plugin extensions. */
type CodexAppServerToolResultEvent = {
  threadId: string;
  turnId: string;
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result: AgentToolResult<unknown>;
};
/** Session context passed with Codex app-server extension events. */
type CodexAppServerExtensionContext = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};
/** Optional replacement result returned by a Codex app-server extension handler. */
type CodexAppServerToolResultHandlerResult = {
  result: AgentToolResult<unknown>;
};
/** Runtime event surface exposed to Codex app-server extension factories. */
type CodexAppServerExtensionRuntime = {
  on: (event: "tool_result", handler: (event: CodexAppServerToolResultEvent, ctx: CodexAppServerExtensionContext) => Promise<CodexAppServerToolResultHandlerResult | void> | CodexAppServerToolResultHandlerResult | void) => void;
};
/** Factory signature for Codex app-server plugin extensions. */
type CodexAppServerExtensionFactory = (runtime: CodexAppServerExtensionRuntime) => Promise<void> | void;
//#endregion
//#region src/plugins/embedding-provider-types.d.ts
/** Input accepted by embedding providers, including multimodal inline-data parts. */
type EmbeddingInput$1 = string | {
  text: string;
  parts?: Array<{
    type: "text";
    text: string;
  } | {
    type: "inline-data";
    mimeType: string;
    data: string;
  }>;
};
/** Per-call options passed to embedding provider calls. */
type EmbeddingProviderCallOptions = {
  signal?: AbortSignal;
  inputType?: "query" | "document" | "semantic" | "classification" | "clustering";
};
/** Runtime metadata returned with a created embedding provider. */
type EmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<string, unknown>; /** Prior persisted model/cache identities that are equivalent to the current identity. */
  indexIdentityAliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
};
/** Provider-owned canonical identity and exact aliases for persisted indexes. */
type EmbeddingProviderIndexIdentity = {
  model: string;
  cacheKeyData: Record<string, unknown>;
  aliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
};
/** Created embedding provider instance used by memory/search callers. */
type EmbeddingProvider = {
  id: string;
  model: string;
  dimensions?: number;
  maxInputTokens?: number;
  embed: (input: EmbeddingInput$1, options?: EmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (inputs: EmbeddingInput$1[], options?: EmbeddingProviderCallOptions) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};
/** Options passed to embedding provider adapters when creating providers. */
type EmbeddingProviderCreateOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
  };
  dimensions?: number;
  taskType?: string;
};
/** Result returned by an embedding provider adapter create call. */
type EmbeddingProviderCreateResult = {
  provider: EmbeddingProvider | null;
  runtime?: EmbeddingProviderRuntime;
};
/** Adapter contract registered by core or plugin embedding providers. */
type EmbeddingProviderAdapter = {
  id: string;
  defaultModel?: string;
  transport?: "local" | "remote";
  authProviderId?: string;
  resolveIndexIdentity?: (options: EmbeddingProviderCreateOptions) => EmbeddingProviderIndexIdentity;
  create: (options: EmbeddingProviderCreateOptions) => Promise<EmbeddingProviderCreateResult>;
  formatSetupError?: (err: unknown) => string;
};
//#endregion
//#region src/state/openclaw-agent-db-contract.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
//#endregion
//#region src/plugins/config-schema.d.ts
type BuildPluginConfigSchemaOptions = {
  /** @deprecated Declare top-level `uiHints` in `openclaw.plugin.json`. */uiHints?: Record<string, PluginConfigUiHint>;
  safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
type BuildJsonPluginConfigSchemaOptions = {
  cacheKey?: string; /** @deprecated Declare top-level `uiHints` in `openclaw.plugin.json`. */
  uiHints?: Record<string, PluginConfigUiHint>;
  safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
/** Build a plugin config schema from JSON Schema with runtime validation/default support. */
declare function buildJsonPluginConfigSchema(schema: JsonSchemaObject, options?: BuildJsonPluginConfigSchemaOptions): OpenClawPluginConfigSchema;
/** Build a plugin config schema from Zod, exporting JSON Schema when the Zod runtime supports it. */
declare function buildPluginConfigSchema(schema: ZodTypeAny, options?: BuildPluginConfigSchemaOptions): OpenClawPluginConfigSchema;
/** Return a schema for plugins that intentionally accept no config keys. */
declare function emptyPluginConfigSchema(): OpenClawPluginConfigSchema;
//#endregion
//#region src/plugins/memory-state.d.ts
declare function registerMemoryCorpusSupplement(requestedPluginId: string, supplement: MemoryCorpusSupplement): void;
declare function registerMemoryCapability(requestedPluginId: string, capability: MemoryPluginCapability): void;
declare function getMemoryCapabilityRegistration(): MemoryPluginCapabilityRegistration | undefined;
declare function buildMemoryPromptSection(params: MemoryPromptSectionParams, prepared?: PreparedMemoryPromptSection): string[];
declare function listActiveMemoryPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
declare function clearMemoryPluginState(): void;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-inputs.d.ts
/** Text part passed through embedding providers that support structured input. */
type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};
/** Inline binary payload encoded for providers with multimodal embedding support. */
type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};
/** Single structured embedding input part. */
type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;
/** Provider-facing input while preserving the plain text fallback. */
type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};
//#endregion
//#region src/plugins/registry-contribution-types.d.ts
type ContextEngineFactoryContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
};
type ContextEngineFactory = (ctx: ContextEngineFactoryContext) => ContextEngine | Promise<ContextEngine>;
type ContextEngineRegistrationLifecycle = "runtime" | "readOnlyDiscovery";
type ContextEngineRegistration = {
  factory: ContextEngineFactory;
  owner: string;
  lifecycle: ContextEngineRegistrationLifecycle;
};
type CompactionProviderSummarizationInstructions = {
  identifierPolicy?: "strict" | "off" | "custom";
  identifierInstructions?: string;
};
interface CompactionProvider {
  id: string;
  label: string;
  summarize(params: {
    messages: unknown[];
    signal?: AbortSignal;
    compressionRatio?: number;
    customInstructions?: string;
    summarizationInstructions?: CompactionProviderSummarizationInstructions;
    previousSummary?: string;
  }): Promise<string>;
}
type RegisteredCompactionProvider = {
  provider: CompactionProvider;
  ownerPluginId?: string;
};
type MemoryEmbeddingBatchChunk = {
  text: string;
  embeddingInput?: EmbeddingInput;
};
type MemoryEmbeddingBatchOptions = {
  agentId: string;
  chunks: MemoryEmbeddingBatchChunk[];
  wait: boolean;
  concurrency: number;
  pollIntervalMs: number;
  timeoutMs: number;
  debug: (message: string, data?: Record<string, unknown>) => void;
};
type MemoryEmbeddingProviderCallOptions = Pick<EmbeddingProviderCallOptions, "signal">;
type MemoryEmbeddingProviderRuntime = EmbeddingProviderRuntime & {
  sourceWideBatchEmbed?: boolean;
  batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};
type MemoryEmbeddingProviderIndexIdentity = EmbeddingProviderIndexIdentity;
type MemoryEmbeddingProvider = Pick<EmbeddingProvider, "id" | "model" | "maxInputTokens" | "close"> & {
  embedQuery: (text: string, options?: MemoryEmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (texts: string[], options?: MemoryEmbeddingProviderCallOptions) => Promise<number[][]>;
  embedBatchInputs?: (inputs: EmbeddingInput[], options?: MemoryEmbeddingProviderCallOptions) => Promise<number[][]>;
};
type MemoryEmbeddingProviderCreateOptions = Omit<EmbeddingProviderCreateOptions, "dimensions" | "local" | "taskType"> & {
  fallback?: string;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
    contextSize?: number | "auto";
  };
  outputDimensionality?: number;
  taskType?: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | "QUESTION_ANSWERING" | "FACT_VERIFICATION";
};
type MemoryEmbeddingProviderCreateResult = {
  provider: MemoryEmbeddingProvider | null;
  runtime?: MemoryEmbeddingProviderRuntime;
};
type MemoryEmbeddingProviderAdapter = Omit<EmbeddingProviderAdapter, "create" | "resolveIndexIdentity"> & {
  autoSelectPriority?: number;
  allowExplicitWhenConfiguredAuto?: boolean;
  supportsMultimodalEmbeddings?: (params: {
    model: string;
  }) => boolean;
  resolveIndexIdentity?: (options: MemoryEmbeddingProviderCreateOptions) => MemoryEmbeddingProviderIndexIdentity;
  create: (options: MemoryEmbeddingProviderCreateOptions) => Promise<MemoryEmbeddingProviderCreateResult>;
  shouldContinueAutoSelection?: (err: unknown) => boolean;
};
type MemoryPromptSectionParams = {
  availableTools: Set<string>;
  citationsMode?: MemoryCitationsMode;
  agentId?: string;
  agentSessionKey?: string;
  sandboxed?: boolean;
};
type MemoryPromptSectionBuilder = (params: MemoryPromptSectionParams) => string[];
type MemoryPromptSectionPreparer = (params: MemoryPromptSectionParams) => Promise<readonly string[]>;
type PreparedMemoryPromptSection = Readonly<{
  context: Readonly<{
    availableTools: readonly string[];
    citationsMode?: MemoryCitationsMode;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed: boolean;
  }>;
  lines: readonly string[];
}>;
type MemoryCorpusSearchResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  score: number;
  snippet: string;
  id?: string;
  startLine?: number;
  endLine?: number;
  citation?: string;
  source?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};
type MemoryCorpusGetResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  content: string;
  fromLine: number;
  lineCount: number;
  id?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};
type MemoryCorpusSupplement = {
  search(params: {
    query: string;
    maxResults?: number;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed?: boolean;
  }): Promise<MemoryCorpusSearchResult[]>;
  get(params: {
    lookup: string;
    fromLine?: number;
    lineCount?: number;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed?: boolean;
  }): Promise<MemoryCorpusGetResult | null>;
};
type MemoryCorpusSupplementRegistration = {
  pluginId: string;
  supplement: MemoryCorpusSupplement;
};
type MemoryPromptSupplementRegistration = {
  pluginId: string;
  builder: MemoryPromptSectionBuilder;
};
type MemoryPromptPreparationRegistration = {
  pluginId: string;
  prepare: MemoryPromptSectionPreparer;
};
type MemoryFlushPlan = {
  softThresholdTokens: number;
  forceFlushTranscriptBytes: number;
  reserveTokensFloor: number;
  model?: string;
  prompt: string;
  systemPrompt: string;
  relativePath: string;
  recordWriteProvenance?: (params: {
    workspaceDir: string;
    relativePath: string;
    contentBefore: string;
    contentAfter: string;
    originClass: "agent" | "untrusted";
    observedAt: number;
  }) => Promise<(() => Promise<void>) | void>;
  clearWriteProvenance?: (params: {
    workspaceDir: string;
    relativePath: string;
  }) => Promise<void>;
};
type MemoryFlushPlanResolver = (params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}) => MemoryFlushPlan | null;
type RegisteredMemorySearchManager = MemorySearchManager;
type MemoryRuntimeBackendConfig = {
  backend: "builtin";
};
type MemoryPluginRuntime = {
  getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
  }): Promise<{
    manager: RegisteredMemorySearchManager | null;
    debug?: {
      backend?: "builtin";
      purpose?: "default" | "status" | "cli";
      managerMs?: number;
    };
    error?: string;
  }>;
  resolveMemoryBackendConfig(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): MemoryRuntimeBackendConfig; /** Authorize raw hits before caller-visible use; absent runtimes must not expose session hits. */
  authorizeSearchHits?(params: {
    cfg: OpenClawConfig;
    agentId: string;
    requesterSessionKey: string | undefined;
    sandboxed: boolean;
    hits: MemorySearchResult[];
  }): Promise<MemorySearchResult[]>;
  closeMemorySearchManager?(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): Promise<void>;
  closeAllMemorySearchManagers?(): Promise<void>;
};
type MemoryPluginPublicArtifactContentType = "markdown" | "json" | "text";
type MemoryPluginPublicArtifact = {
  kind: string;
  workspaceDir: string;
  relativePath: string;
  absolutePath: string;
  agentIds: string[];
  contentType: MemoryPluginPublicArtifactContentType;
};
type MemoryPluginPublicArtifactsProvider = {
  listArtifacts(params: {
    cfg: OpenClawConfig;
  }): Promise<MemoryPluginPublicArtifact[]>;
};
type MemoryPluginCapability = {
  promptBuilder?: MemoryPromptSectionBuilder;
  flushPlanResolver?: MemoryFlushPlanResolver;
  runtime?: MemoryPluginRuntime;
  publicArtifacts?: MemoryPluginPublicArtifactsProvider;
};
type MemoryPluginCapabilityRegistration = {
  pluginId: string;
  capability: MemoryPluginCapability;
};
type SessionDiscussionState = "none" | "available" | "open";
type SessionDiscussionInfo = {
  state: SessionDiscussionState;
  embedUrl?: string;
  openUrl?: string;
};
type SessionDiscussionProvider = {
  id: string;
  info(params: {
    sessionKey: string;
    agentId: string;
  }): Promise<SessionDiscussionInfo>;
  open(params: {
    sessionKey: string;
    agentId: string;
  }): Promise<SessionDiscussionInfo>;
};
type ResolvedPluginRuntimeArtifact = {
  source: string;
  rootDir: string;
};
//#endregion
//#region src/plugins/plugin-command-dispatch-contract.d.ts
/** Lightweight reply-option contract for prepared plugin command ownership. */
declare const PLUGIN_COMMAND_DISPATCH: unique symbol;
type PluginCommandReplyOptions = Readonly<{
  [PLUGIN_COMMAND_DISPATCH]?: Readonly<{
    kind: "plugin" | "non-plugin";
  }>;
}>;
//#endregion
//#region src/auto-reply/reply/abort.runtime-types.d.ts
/** Result from the fast abort path before normal reply dispatch starts. */
type FastAbortResult = {
  handled: boolean;
  aborted: boolean;
  rejectionReason?: "finalizing";
  stoppedSubagents?: number;
  failedSubagents?: number;
};
/** Runtime hook that may convert a message into an immediate abort action. */
type TryFastAbortFromMessage = (params: {
  ctx: FinalizedRuntimeMsgContext;
  cfg: OpenClawConfig;
}) => Promise<FastAbortResult>;
/** Formats the user-visible abort acknowledgement text. */
type FormatAbortReplyText = (stoppedSubagents?: number, rejectionReason?: FastAbortResult["rejectionReason"], failedSubagents?: number) => string;
//#endregion
//#region src/agents/embedded-agent-block-chunker.d.ts
/**
 * Splits streamed embedded-agent replies into Markdown-safe message chunks.
 */
type BlockReplyChunking = {
  minChars: number;
  maxChars: number;
  breakPreference?: "paragraph" | "newline" | "sentence"; /** When true, prefer \n\n paragraph boundaries once minChars has been satisfied. */
  flushOnParagraph?: boolean;
};
declare class EmbeddedBlockChunker {
  #private;
  constructor(chunking: BlockReplyChunking);
  /** Add streamed text to the pending chunk buffer. */
  append(text: string): void;
  /** Clear any buffered reply text without emitting it. */
  reset(): void;
  /** Return the currently buffered text for tests and flush logic. */
  get bufferedText(): string;
  /** Return true when there is pending text to drain. */
  hasBuffered(): boolean;
  /** Emit safe chunks according to size and Markdown fence constraints. */
  drain(params: {
    force: boolean;
    emit: (chunk: string) => void;
  }): void;
}
//#endregion
//#region src/agents/bash-tools.process.d.ts
/** Defaults injected by tests, agent scopes, and scoped process registries. */
type ProcessToolDefaults = {
  cleanupMs?: number;
  hasCronTool?: boolean;
  inputWaitIdleMs?: number;
  scopeKey?: string;
};
//#endregion
//#region src/agents/command/shared-types.d.ts
/**
 * Shared command types that are imported by both public and runtime modules.
 */
/** Best-effort provider stream parameter overrides for an agent command. */
type AgentStreamParams = {
  /** Provider stream params override (best-effort). */temperature?: number;
  topP?: number;
  maxTokens?: number; /** Stop sequences forwarded to the provider (best-effort). */
  stop?: string[]; /** Provider fast-mode override (best-effort). */
  fastMode?: boolean;
  responseFormat?: Record<string, unknown>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};
/** Simplified tool definition for client-provided OpenResponses hosted tools. */
type ClientToolDefinition = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>; /** Strict argument enforcement (Responses API). Propagated from the request. */
    strict?: boolean;
  };
};
//#endregion
//#region src/plugins/cli-backend.types.d.ts
/** Static command adapter owned by a CLI backend plugin registration. */
type CliBackendConfig = {
  /** CLI command to execute (absolute path or on PATH). */command: string; /** Base args applied to every invocation. */
  args?: string[]; /** Output parsing mode (default: json). */
  output?: "json" | "text" | "jsonl"; /** Output parsing mode when resuming a CLI session. */
  resumeOutput?: "json" | "text" | "jsonl"; /** JSONL event dialect for CLIs with provider-specific stream formats. */
  jsonlDialect?: "claude-stream-json" | "gemini-stream-json"; /** Long-lived CLI process mode. */
  liveSession?: "claude-stdio"; /** Prompt input mode (default: arg). */
  input?: "arg" | "stdin"; /** Max prompt length for arg mode (if exceeded, stdin is used). */
  maxPromptArgChars?: number; /** Extra env vars injected for this CLI. */
  env?: Record<string, string>; /** Env vars to remove before launching this CLI. */
  clearEnv?: string[]; /** Flag used to pass model id (e.g. --model). */
  modelArg?: string; /** Model aliases mapping (OpenClaw model id → CLI model id). */
  modelAliases?: Record<string, string>; /** Args used to pass a session id (use {sessionId} placeholder). */
  sessionArgs?: string[]; /** Alternate args to use when resuming a session (use {sessionId} placeholder). */
  resumeArgs?: string[]; /** Argument appended to one explicitly forked resume invocation. */
  forkArg?: string; /** Argument followed by an assistant checkpoint id to bound one resumed fork. */
  resumeAtArg?: string; /** When to pass session ids. */
  sessionMode?: "always" | "existing" | "none"; /** JSON fields to read session id from (in order). */
  sessionIdFields?: string[]; /** Flag used to pass system prompt. */
  systemPromptArg?: string; /** Flag used to pass a system prompt file. */
  systemPromptFileArg?: string; /** Config override flag used to pass a system prompt file (e.g. -c). */
  systemPromptFileConfigArg?: string; /** Config override key used to pass a system prompt file. */
  systemPromptFileConfigKey?: string; /** System prompt behavior (append vs replace). */
  systemPromptMode?: "append" | "replace"; /** When to send system prompt. */
  systemPromptWhen?: "first" | "always" | "never"; /** Flag used to pass image paths. */
  imageArg?: string; /** How to pass multiple images. */
  imageMode?: "repeat" | "list"; /** Where staged image files should live before handing them to the CLI. */
  imagePathScope?: "temp" | "workspace"; /** Serialize runs for this CLI. */
  serialize?: boolean; /** Opt in to bounded raw transcript reseed before compaction for safe session resets. */
  reseedFromRawTranscriptWhenUncompacted?: boolean; /** Runtime reliability tuning for this backend's process lifecycle. */
  reliability?: {
    /** No-output watchdog tuning (fresh vs resumed runs). */watchdog?: {
      /** Fresh/new sessions (non-resume). */fresh?: {
        /** Fraction of overall timeout used when fixed timeout is not set. */noOutputTimeoutRatio?: number; /** Lower bound for computed watchdog timeout. */
        minMs?: number; /** Upper bound for computed watchdog timeout. */
        maxMs?: number;
      }; /** Resume sessions. */
      resume?: {
        /** Fraction of overall timeout used when fixed timeout is not set. */noOutputTimeoutRatio?: number; /** Lower bound for computed watchdog timeout. */
        minMs?: number; /** Upper bound for computed watchdog timeout. */
        maxMs?: number;
      };
    };
  };
};
type PluginTextReplacement = {
  from: string | RegExp;
  to: string;
};
type PluginTextTransforms = {
  /** Rewrites applied to outbound prompt text before provider/CLI transport. */input?: PluginTextReplacement[]; /** Rewrites applied to inbound assistant text before OpenClaw consumes it. */
  output?: PluginTextReplacement[];
};
type CliBundleMcpMode = "claude-config-file" | "codex-config-overrides" | "gemini-system-settings";
type CliBackendPrepareExecutionContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  agentDir?: string;
  provider: string;
  modelId: string; /** Effective OpenClaw context budget selected for this run. */
  contextTokenBudget?: number;
  authProfileId?: string;
  executionMode?: CliBackendExecutionMode; /** Exact runtime tool surface the backend must enforce for this run. */
  toolAvailability?: CliBackendToolAvailability; /** Core-prepared environment, including any bundled MCP settings path. */
  env?: Readonly<Record<string, string>>;
};
type CliBackendPreparedExecution = {
  env?: Record<string, string>;
  clearEnv?: string[];
  /**
   * Backend-owned staging that must run after the core CLI queue admits the turn.
   * Use this for mutable per-profile CLI homes that the launched process also owns.
   */
  beforeExecution?: () => Promise<void>;
  cleanup?: () => Promise<void>; /** Positive acknowledgement for `prepare-execution` tool enforcement. */
  toolAvailabilityEnforced?: true;
};
type CliBackendThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
type CliBackendExecutionMode = "agent" | "side-question";
/** Exact backend-native plus canonical OpenClaw tool surface for one CLI run. */
type CliBackendToolAvailability = {
  native: readonly string[]; /** Canonical OpenClaw tool names served through the host-isolated transport. */
  openClaw: readonly string[];
  /**
   * @deprecated Compatibility projection for CLI backend plugins built against
   * v2026.7.2-beta.1 through v2026.7.2-beta.3. Use `openClaw` for canonical names.
   */
  mcp: readonly string[];
};
type CliBackendResolveExecutionArgsContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  provider: string;
  modelId: string;
  authProfileId?: string;
  thinkingLevel?: CliBackendThinkingLevel;
  executionMode?: CliBackendExecutionMode;
  toolAvailability?: CliBackendToolAvailability;
  useResume: boolean;
  baseArgs: readonly string[];
};
type CliBackendResolveExecutionArgs = (ctx: CliBackendResolveExecutionArgsContext) => readonly string[] | null | undefined;
type CliBackendJsonlUsage = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  total?: number;
};
type CliBackendParsedJsonlEvent = {
  kind: "text";
  text: string;
} | {
  kind: "thinking";
  text: string;
} | {
  kind: "toolStart";
  toolCallId: string;
  name: string;
  args?: Record<string, unknown>;
} | {
  kind: "toolResult";
  toolCallId: string;
  name?: string;
  isError?: boolean;
  result?: unknown;
} | {
  kind: "result";
  text?: string;
  sessionId?: string;
  usage?: CliBackendJsonlUsage;
  errorText?: string;
} | {
  kind: "sessionId";
  sessionId: string;
};
type CliBackendParseJsonlEventContext = {
  backendId: string;
  backend: Readonly<CliBackendConfig>;
};
type CliBackendParseJsonlEvent = (line: string, ctx: CliBackendParseJsonlEventContext) => CliBackendParsedJsonlEvent | readonly CliBackendParsedJsonlEvent[] | null | undefined;
type CliBackendAuthEpochMode = "combined" | "profile-only";
type CliBackendNativeToolMode = "none" | "always-on" | "selectable";
/** Backend-owned mechanism that enforces exact per-run tool availability. */
type CliBackendToolAvailabilityEnforcement = "execution-args" | "prepare-execution";
type CliBackendSideQuestionToolMode = "disabled";
type CliBackendExactToolAvailabilityVersionPolicy = Readonly<{
  /** Inclusive floor for stable package releases. */stableMinimum: string; /** Inclusive floors keyed by the first SemVer prerelease identifier. */
  prereleaseMinimums?: Readonly<Record<string, string>>;
}>;
type CliBackendNormalizeConfigContext = {
  config?: OpenClawConfig;
  backendId: string;
  agentId?: string;
};
/** Backend-owned implementation boundary for script-backed CLI executables. */
type CliBackendRuntimeArtifactPolicy = Readonly<{
  kind: "bundled-package-tree"; /** Exact package.json name whose complete installed tree owns inference. */
  packageName: string; /** Only the command itself may be the package entrypoint. */
  entrypoint: "command"; /** Supported package release lines when a run requests exact tool availability. */
  exactToolAvailabilityVersionPolicy?: CliBackendExactToolAvailabilityVersionPolicy; /** Canonical basenames allowed when this backend ships a self-contained native build. */
  nativeExecutableNames?: readonly string[];
}>;
/** Provider-owned protocol requirement for a long-lived CLI session. */
type CliBackendLiveSessionRequirement = Readonly<{
  /** Exact capability the CLI must advertise before streamed output is trusted. */capability: string; /** First published version known to advertise the capability; runtime still feature-detects. */
  minimumVersion: string; /** Arguments used by setup and Doctor to obtain the installed CLI version. */
  versionArgs: readonly string[]; /** Operator command that installs a compatible CLI version. */
  updateCommand: string;
}>;
/** Complete backend-owned contract for in-place native session compaction. */
type CliBackendManualCompaction = Readonly<{
  /** Builds the exact backend command for the resumed native session. */buildPrompt: (customInstructions?: string) => string; /** Prompt transport required by the backend control command. */
  input: "arg" | "stdin"; /** Positively confirms that a successful process exit performed compaction. */
  validateOutput: (rawOutput: string) => {
    ok: true;
  } | {
    ok: false;
    reason: string;
  };
}>;
/** Plugin-owned CLI backend defaults used by the text-only CLI runner. */
type CliBackendPluginBase = {
  /** Provider id used in model refs, for example `claude-cli/opus`. */id: string; /** Canonical model provider whose models this CLI backend can execute. */
  modelProvider?: string; /** Static command adapter owned by this plugin. */
  config: CliBackendConfig;
  /**
   * Context-engine host capabilities provided by this backend when it is
   * driven through the generic CLI runner.
   */
  contextEngineHostCapabilities?: readonly ContextEngineHostCapability[];
  /**
   * Whether embedded runs opted into `cliBackendDispatch: "subscription-auth"`
   * execute through this backend when the selected credential is
   * subscription-scoped (oauth/token) or unresolvable.
   *
   * Set only when this backend's model provider rejects or meters direct API
   * calls on subscription tokens, so the passthrough would fail or silently
   * bill outside plan limits. API-key credentials always keep the passthrough.
   */
  subscriptionAuthDispatch?: boolean;
  /**
   * Optional live-smoke metadata owned by the backend plugin.
   *
   * Keep provider-specific test wiring here instead of scattering it across
   * Docker wrappers, docs, and gateway live tests.
   */
  liveTest?: {
    defaultModelRef?: string;
    defaultImageProbe?: boolean;
    defaultMcpProbe?: boolean;
    docker?: {
      npmPackage?: string;
      binaryName?: string;
    };
  }; /** Required whenever this backend can become a verified inference owner. */
  runtimeArtifact?: CliBackendRuntimeArtifactPolicy; /** Negotiated protocol capability required by this backend's live-session transport. */
  liveSessionRequirement?: CliBackendLiveSessionRequirement;
  /**
   * Whether OpenClaw should inject bundle MCP config for this backend.
   *
   * Keep this opt-in. Only backends that explicitly consume OpenClaw's bundle
   * MCP bridge should enable it.
   */
  bundleMcp?: boolean;
  /**
   * Provider-owned bundle MCP integration strategy.
   *
   * Different CLIs wire MCP through different surfaces:
   * - Claude: `--strict-mcp-config --mcp-config`
   * - Codex: `-c mcp_servers=...`
   * - Gemini: system-level `settings.json`
   */
  bundleMcpMode?: CliBundleMcpMode;
  /**
   * Optional config normalizer applied to the registered adapter.
   */
  normalizeConfig?: (config: CliBackendConfig, context?: CliBackendNormalizeConfigContext) => CliBackendConfig;
  /**
   * Backend-owned final system-prompt transform.
   *
   * Use this for tiny CLI-specific compatibility rewrites without replacing
   * the generic CLI runner or prompt builder.
   */
  transformSystemPrompt?: (ctx: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    provider: string;
    modelId: string;
    modelDisplay: string;
    agentId?: string;
    systemPrompt: string;
  }) => string | null | undefined;
  /**
   * Backend-owned bidirectional text replacements.
   *
   * `input` applies to the system prompt and user prompt passed to the CLI.
   * `output` applies to parsed/streamed assistant text from the CLI.
   */
  textTransforms?: PluginTextTransforms;
  /**
   * Preferred auth-profile id when the caller did not explicitly lock one.
   *
   * Use this when the backend should consume a canonical OpenClaw auth profile
   * rather than ambient host auth by default.
   */
  defaultAuthProfileId?: string;
  /**
   * Session/auth epoch source policy.
   *
   * `combined` keeps the legacy "host credential + auth profile" fingerprint.
   * `profile-only` treats the selected OpenClaw auth profile as the sole auth
   * owner for session invalidation when one is present.
   */
  authEpochMode?: CliBackendAuthEpochMode;
  /**
   * Whether `prepareExecution` may auto-select a configured auth profile.
   *
   * Defaults to true for auth bridges. Set false for environment/config-only
   * hooks that do not consume OpenClaw auth profiles.
   */
  autoSelectAuthProfile?: boolean;
  /**
   * Backend-owned execution bridge.
   *
   * Use this on async run paths when the backend needs a generated auth/config
   * bridge (for example a private CLI home directory) without teaching the core
   * runner about provider-specific file formats.
   */
  prepareExecution?: (ctx: CliBackendPrepareExecutionContext) => Promise<CliBackendPreparedExecution | null | undefined> | CliBackendPreparedExecution | null | undefined;
  /**
   * Backend-owned per-run argv rewrite.
   *
   * Use this for request-scoped CLI dialect flags that should not be modeled
   * as static config, such as mapping OpenClaw thinking levels to a backend's
   * native effort flag.
   */
  resolveExecutionArgs?: CliBackendResolveExecutionArgs; /** How this backend enforces an exact per-run `toolAvailability` contract. */
  toolAvailabilityEnforcement?: CliBackendToolAvailabilityEnforcement;
  /**
   * Backend-owned JSONL line parser for provider-specific stream formats.
   *
   * Tool events report execution already performed by the backend. OpenClaw
   * renders them but does not treat them as host tool execution or delivery evidence.
   */
  parseJsonlEvent?: CliBackendParseJsonlEvent;
  /**
   * Whether this CLI backend can expose native tools outside OpenClaw's tool
   * catalog. Exact restricted runs require `selectable` plus a declared
   * `toolAvailabilityEnforcement`; `always-on` backends fail closed.
   */
  nativeToolMode?: CliBackendNativeToolMode;
  /**
   * Side-question native tool behavior.
   *
   * Set to `disabled` only when `executionMode: "side-question"` reliably
   * launches the CLI without native tools, even if normal agent turns expose
   * backend-owned tools.
   */
  sideQuestionToolMode?: CliBackendSideQuestionToolMode;
};
type CliBackendNativeCompactionContract = {
  /** Backend-owned compaction for a persisted resumable CLI transcript. */ownsNativeCompaction: true; /** Optional control operation for explicit manual compaction. */
  manualCompaction?: CliBackendManualCompaction;
} | {
  /** Boolean-compatible ownership for existing plugins without manual compaction. */ownsNativeCompaction?: boolean;
  manualCompaction?: never;
};
/** Plugin-owned CLI backend defaults used by the text-only CLI runner. */
type CliBackendPlugin$1 = CliBackendPluginBase & CliBackendNativeCompactionContract;
//#endregion
//#region src/agents/bootstrap-mode.d.ts
type BootstrapContextRunKind = "default" | "heartbeat" | "cron";
//#endregion
//#region src/agents/workspace.d.ts
/**
 * Canonical bootstrap filenames in prompt order. Single source for the runtime
 * validation set, the name union, and the Control UI core-files list; a private
 * copy anywhere else silently drifts when a file is retired.
 */
declare const WORKSPACE_BOOTSTRAP_FILENAMES: readonly ["AGENTS.md", "SOUL.md", "IDENTITY.md", "USER.md", "BOOTSTRAP.md", "MEMORY.md"];
type WorkspaceBootstrapFileName = (typeof WORKSPACE_BOOTSTRAP_FILENAMES)[number];
type WorkspaceBootstrapFile = {
  name: WorkspaceBootstrapFileName;
  path: string;
  content?: string;
  missing: boolean;
};
declare function ensureAgentWorkspace(params?: {
  dir?: string;
  ensureBootstrapFiles?: boolean;
  /**
   * List of optional bootstrap filenames to skip writing.
   * Applies only to SOUL.md, USER.md, IDENTITY.md.
   * Required workspace setup such as AGENTS.md still runs.
   */
  skipOptionalBootstrapFiles?: string[];
}): Promise<{
  dir: string;
  agentsPath?: string;
  soulPath?: string;
  identityPath?: string;
  userPath?: string;
  bootstrapPath?: string;
  bootstrapPending?: boolean;
  identityPathCreated?: boolean;
}>;
//#endregion
//#region src/agents/embedded-agent-helpers/context-file.d.ts
/** Context file passed into embedded agents as preloaded workspace content. */
type EmbeddedContextFile = {
  path: string;
  content: string;
};
//#endregion
//#region src/agents/run-session-target.d.ts
/** Identifies a run transcript target without naming the current storage artifact. */
type AgentRunSessionTarget = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  storePath?: string;
  threadId?: string | number; /** Internal admission fence paired with sessionId for run-owned transcript writes. */
  expectedLifecycleRevision?: string; /** Internal durable writer claim installed after session-lane admission. */
  expectedWriterRunId?: string;
};
//#endregion
//#region src/agents/bootstrap-files.d.ts
type BootstrapContextMode = "full" | "lightweight";
/** Resolves hook-adjusted, session-filtered bootstrap files for a run. */
declare function resolveBootstrapFilesForRun(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  chatType?: ChatType;
  agentId?: string;
  warn?: (message: string) => void;
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): Promise<WorkspaceBootstrapFile[]>;
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
declare function resolveBootstrapContextForRun(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  chatType?: ChatType;
  agentId?: string;
  warn?: (message: string) => void;
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): Promise<{
  bootstrapFiles: WorkspaceBootstrapFile[];
  contextFiles: EmbeddedContextFile[];
}>;
/** Builds bounded context files from already-resolved bootstrap file metadata. */
declare function buildBootstrapContextForFiles(bootstrapFiles: WorkspaceBootstrapFile[], params: {
  config?: OpenClawConfig;
  agentId?: string | null;
  warn?: (message: string) => void;
}): EmbeddedContextFile[];
//#endregion
//#region src/shared/fast-mode.d.ts
type FastModeSource = "session" | "agent" | "config" | "default";
type FastModeAutoProgressState = {
  offAnnounced: boolean;
  resetAnnounced: boolean;
};
declare function resolveFastModeForElapsed(params: {
  mode?: FastMode;
  startedAtMs: number;
  fastAutoOnSeconds?: number;
  nowMs?: number;
}): {
  mode: FastMode | undefined;
  enabled: boolean;
  elapsedSeconds: number;
  fastAutoOnSeconds: number;
};
declare function formatFastModeAutoProgressText(params: {
  enabled: boolean;
  elapsedSeconds: number;
  fastAutoOnSeconds?: number;
}): string;
declare function formatFastModeStatusValue(params: {
  mode: FastMode | undefined;
  fastAutoOnSeconds?: number;
}): string;
declare function formatFastModeCommandOptions(params?: {
  fastAutoOnSeconds?: number;
}): string;
declare function formatFastModeSourceSuffix(source: FastModeSource | undefined): string;
declare function formatFastModeCurrentStatus(params: {
  mode: FastMode | undefined;
  source?: FastModeSource;
  fastAutoOnSeconds?: number;
  label?: string;
}): string;
//#endregion
//#region src/agents/fast-mode.d.ts
type FastModeState = {
  mode: FastMode;
  enabled: boolean;
  source: FastModeSource;
  fastAutoOnSeconds: number;
};
/** Resolve the effective fast-mode setting and its source. */
declare function resolveFastModeState(params: {
  cfg: OpenClawConfig | undefined;
  provider: string;
  model: string;
  agentId?: string;
  sessionEntry?: Pick<SessionEntry, "fastMode"> | undefined;
}): FastModeState;
//#endregion
//#region src/context-engine/host-compat.d.ts
type ContextEngineHostSupport = {
  id: string;
  label: string;
  capabilities: readonly ContextEngineHostCapability[];
};
declare const CODEX_APP_SERVER_CONTEXT_ENGINE_HOST: {
  readonly id: "codex-app-server";
  readonly label: "Codex app-server harness";
  readonly capabilities: readonly ["bootstrap", "assemble-before-prompt", "after-turn", "maintain", "compact", "runtime-llm-complete", "thread-bootstrap-projection"];
};
/** Assert that a context engine can safely run under the supplied host. */
declare function assertContextEngineHostSupport(params: {
  contextEngine: ContextEngine;
  operation: ContextEngineOperation;
  host: ContextEngineHostSupport;
}): void;
//#endregion
//#region src/agents/harness/context-engine-logical-turn.d.ts
type EffectiveContextEngineRef = Readonly<{
  engine: ContextEngine;
  registeredId: string;
  ownerPluginId?: string;
  mode: "configured" | "legacy-degraded";
  reason?: string;
}>;
type ContextEngineLogicalTurnLease = {
  /** Compatibility getter for internal callers while the single context object is threaded. */readonly engine: ContextEngine;
  readonly effectiveEngine: ContextEngine;
  readonly effectiveEngineId: string;
  readonly effectiveEnginePluginId?: string;
  readonly degraded: boolean;
  readonly degradedReason?: string;
  selectForHost: (params: {
    host: ContextEngineHostSupport;
    operation: ContextEngineOperation;
    requiresDurableCommit: boolean;
  }) => EffectiveContextEngineRef;
  degradeBeforeStart: (reason: string) => EffectiveContextEngineRef;
  begin: () => EffectiveContextEngineRef;
  deferDisposalUntil: (promise: Promise<unknown>) => void;
  dispose: () => Promise<void>;
};
//#endregion
//#region src/agents/harness/context-engine-turn-attempt.d.ts
type ContextEngineTurnAttemptFacts = {
  boundary: TranscriptTurnBoundary;
  sessionIdUsed: string;
  sessionKey?: string;
  sessionTarget?: ContextEngineSessionTarget;
  sessionFile: string;
  promptError: boolean;
  aborted: boolean;
  yieldAborted: boolean;
  tokenBudget?: number;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  config?: OpenClawConfig;
  isHeartbeat?: boolean;
};
//#endregion
//#region src/agents/system-prompt.types.d.ts
type PromptMode = "full" | "minimal" | "none";
type SilentReplyPromptMode = "generic" | "none";
//#endregion
//#region src/agents/cli-runner/types.d.ts
type CliSessionBindingFacts = {
  extraSystemPromptStatic?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  requireExplicitMessageTarget?: boolean;
};
//#endregion
//#region src/auto-reply/reply/queue/types.d.ts
type FollowupQueueDisposition = "queue-cap" | "queue-cap-old" | "queue-cap-new";
//#endregion
//#region src/auto-reply/reply/command-session-metadata.d.ts
type CommandSessionMetadataChange = {
  sessionKey: string;
  agentId?: string;
  reason: "command-metadata";
};
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
/** Opaque in-process capability minted only by an admitted exact run. */
type CronCreatorAuthorityCapability = CronCreatorAuthorityRunScope;
//#endregion
//#region src/auto-reply/reply/reply-admission-ticket.d.ts
declare const REPLY_ADMISSION_TICKET: unique symbol;
type ReplyAdmissionTicket = {
  wait(signal?: AbortSignal): Promise<boolean>;
  release(): void;
};
type ReplyOptionsWithAdmissionTicket = {
  [REPLY_ADMISSION_TICKET]?: ReplyAdmissionTicket;
};
//#endregion
//#region src/auto-reply/reply/reply-operation-run-state.d.ts
type ReplyOperationAdmissionSnapshot = {
  status: "owned";
} | {
  status: "accepted";
  mode: "steer" | "followup";
} | {
  status: "skipped";
  reason: "active-run" | "aborted" | "lifecycle-invalidated" | "queue-cap";
};
type ReplyOperationRunState = {
  admission?: ReplyOperationAdmissionSnapshot;
};
declare const REPLY_OPERATION_RUN_STATE: unique symbol;
type ReplyOptionsWithOperationRunState = {
  [REPLY_OPERATION_RUN_STATE]?: ReplyOperationRunState;
};
//#endregion
//#region src/auto-reply/reply/get-reply.types.d.ts
type ReplySessionBinding = {
  sessionKey?: string;
  sessionId: string;
  storePath?: string;
};
type InternalReplySessionOptions = {
  /** Host-stamped exact-run capability for late Codex creator-authority capture. */cronCreatorAuthorityCapability?: CronCreatorAuthorityCapability;
  expectedExistingSessionId?: string;
  onDeliberateSilentTerminalReply?: () => void;
  onPendingContinuation?: () => void;
  onSessionPrepared?: (binding: ReplySessionBinding) => void; /** Prevent implicit rollover after a caller has durably admitted this exact session. */
  pinExpectedExistingSession?: boolean;
  requestedSessionId?: string;
  resumeRequestedSession?: boolean;
  sessionPromptSourceReplyDeliveryMode?: GetReplyOptions["sourceReplyDeliveryMode"]; /** Marks when this reply is waiting to own its session's reply lane. */
  onReplyAdmissionWaitChange?: (waiting: boolean) => void; /** Receives terminal queue-cap outcomes without widening the public reply API. */
  onFollowupQueueDisposition?: (disposition: FollowupQueueDisposition) => void; /** Overrides persisted queue mode for this reply only. */
  queueModeOverride?: QueueMode; /** Dispatch-owned operation used to defer hooks until durable run admission. */
  replyOperation?: ReplyOperation;
  skillOverrides?: SessionToolOverrides["skills"]; /** Bind this Gateway turn to the committed prepared model-runtime owner. */
  usePublishedModelRuntime?: boolean;
};
type InternalGetReplyOptions = GetReplyOptions & PluginCommandReplyOptions & InternalReplySessionOptions & ReplyOptionsWithOperationRunState & ReplyOptionsWithAdmissionTicket;
/** Reply resolver signature used by dispatchers and tests for dependency injection. */
type GetReplyFromConfig = (ctx: MsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
type InternalGetReplyFromConfig = (ctx: MsgContext, opts?: InternalGetReplyOptions, configOverride?: OpenClawConfig) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.types.d.ts
type DispatchFromConfigResult = {
  queuedFinal: boolean;
  counts: Record<ReplyDispatchKind, number>;
  failedCounts?: Partial<Record<ReplyDispatchKind, number>>;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  sendPolicyDenied?: boolean;
  observedReplyDelivery?: boolean;
  noVisibleReplyFallbackEligible?: boolean;
  noVisibleReplyFallbackDelivered?: boolean;
  deliberateSilentTerminalReply?: true;
  beforeAgentRunBlocked?: boolean;
  sessionMetadataChanges?: CommandSessionMetadataChange[];
};
type DispatchFromConfigParams = {
  ctx: FinalizedMsgContext; /** Full runtime config captured by the channel; reply resolution refreshes it per turn. */
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  replyOptions?: Omit<InternalGetReplyOptions, "onBlockReply">;
  replyResolver?: InternalGetReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
  fastAbortResolver?: TryFastAbortFromMessage;
  formatAbortReplyTextResolver?: FormatAbortReplyText; /** Optional patch applied to the current runtime config before reply resolution. */
  configOverride?: OpenClawConfig;
  /**
   * Channel turns consume the Gateway's committed model-runtime owner even when the global
   * config snapshot is unavailable during startup or durable ingress replay.
   */
  usePublishedModelRuntime?: boolean;
};
type DispatchReplyFromConfig = (params: DispatchFromConfigParams) => Promise<DispatchFromConfigResult>;
//#endregion
//#region src/auto-reply/reply/normalize-reply.d.ts
type NormalizeReplySkipReason = "empty" | "silent" | "heartbeat" | "channel_transform";
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.d.ts
type ReplyDispatchErrorHandler = (err: unknown, info: ReplyDispatchRuntimeInfo) => Promise<void> | void;
type ReplyDispatchSkipHandler = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo & {
  reason: NormalizeReplySkipReason;
}) => void;
type ReplyDispatchCancelHandler = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo) => Promise<void> | void;
type ReplyDispatchDeliverer = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo) => Promise<unknown>;
type ReplyDispatcherOptions = {
  deliver: ReplyDispatchDeliverer;
  silentReplyContext?: {
    cfg?: OpenClawConfig;
    sessionKey?: string;
    surface?: string;
    conversationType?: SilentReplyConversationType;
  };
  responsePrefix?: string;
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null; /** Static context for response prefix template interpolation. */
  responsePrefixContext?: ResponsePrefixContext;
  /** Dynamic context provider for response prefix template interpolation.
   * Called at normalization time, after model selection is complete. */
  responsePrefixContextProvider?: () => ResponsePrefixContext;
  onHeartbeatStrip?: () => void;
  onIdle?: () => Promise<void> | void;
  onError?: ReplyDispatchErrorHandler;
  onSkip?: ReplyDispatchSkipHandler; /** Human-like delay between block replies for natural rhythm. */
  humanDelay?: HumanDelayConfig;
  beforeDeliver?: ReplyDispatchBeforeDeliver; /** Owner-declared deadline for the constructor before-delivery callback. */
  beforeDeliverOptions?: ReplyDispatchBeforeDeliverOptions;
  onBeforeDeliverCancelled?: ReplyDispatchCancelHandler; /** Observe each queued payload settling, including cancellation and delivery failure. */
  onDeliverySettled?: (info: ReplyDispatchRuntimeInfo) => void; /** Resolve an owner activity policy for holding queued follow-ups behind delivery. */
  resolveFollowupAdmissionBarrierTimeoutPolicy?: (context: {
    queuedCounts: Readonly<Record<ReplyDispatchKind, number>>;
    humanDelayBudgetMs: number;
  }) => ReplyFollowupAdmissionBarrierTimeoutPolicy | undefined;
};
type ReplyDispatcherWithTypingOptions = Omit<ReplyDispatcherOptions, "onIdle"> & {
  typingCallbacks?: TypingCallbacks;
  onReplyStart?: () => Promise<void> | void;
  onIdle?: () => Promise<void> | void;
  onSettled?: () => unknown;
  onFreshSettledDelivery?: () => unknown; /** Called when the typing controller is cleaned up (e.g., on NO_REPLY). */
  onCleanup?: () => void;
};
type ReplyDispatcherWithTypingResult = {
  dispatcher: ReplyDispatcher;
  replyOptions: Pick<GetReplyOptions, "onReplyStart" | "onTypingController" | "onTypingCleanup">;
  markDispatchIdle: () => void; /** Signal that the model run is complete so the typing controller can stop. */
  markRunComplete: () => void;
};
/** Normalize through a dispatcher's exact owner before TTS or other visible side effects. */
declare function createReplyDispatcher(options: ReplyDispatcherOptions): ReplyDispatcher;
declare function createReplyDispatcherWithTyping(options: ReplyDispatcherWithTypingOptions): ReplyDispatcherWithTypingResult;
//#endregion
//#region src/auto-reply/reply/provider-dispatcher.types.d.ts
type DispatchReplyContext = MsgContext | FinalizedMsgContext;
type DispatchReplyOptions = Omit<GetReplyOptions, "onBlockReply"> & PluginCommandReplyOptions;
/** Buffered block dispatcher entry point used by provider reply flows. */
type DispatchReplyWithBufferedBlockDispatcher$1 = (params: {
  ctx: DispatchReplyContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherWithTypingOptions;
  toolsAllow?: string[];
  replyOptions?: DispatchReplyOptions;
  replyResolver?: GetReplyFromConfig;
}) => Promise<DispatchFromConfigResult>;
/** Plain dispatcher entry point used when block buffering is not needed. */
type DispatchReplyWithDispatcher = (params: {
  ctx: DispatchReplyContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: DispatchReplyOptions;
  replyResolver?: GetReplyFromConfig;
}) => Promise<DispatchFromConfigResult>;
//#endregion
//#region src/auto-reply/dispatch-dispatcher.d.ts
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
declare function settleReplyDispatcher(params: {
  dispatcher: ReplyDispatcher;
  onSettled?: () => void | Promise<void>;
}): Promise<void>;
/** Run work with a dispatcher and always drain it before returning or throwing. */
declare function withReplyDispatcher<T>(params: {
  dispatcher: ReplyDispatcher;
  run: () => Promise<T>;
  onSettled?: () => void | Promise<void>;
}): Promise<T>;
//#endregion
//#region src/auto-reply/reply/inbound-context.d.ts
type FinalizeInboundContextOptions = {
  forceBodyForAgent?: boolean;
  forceBodyForCommands?: boolean;
  forceChatType?: boolean;
};
declare function finalizeInboundContext<T extends Record<string, unknown>>(ctx: T, opts?: FinalizeInboundContextOptions): Omit<T, LegacyMediaContextKey> & FinalizedRuntimeMsgContext;
/** Keeps the shipped Plugin SDK return type while internal callers use the stricter type above. */
declare function finalizeInboundContextForSdk<T extends Record<string, unknown>>(ctx: T, opts?: FinalizeInboundContextOptions): T & FinalizedMsgContext & CanonicalInboundText;
//#endregion
//#region src/channels/command-gating.d.ts
/**
 * Shared text-control command authorization policy for channel runtimes.
 *
 * These helpers are re-exported through the plugin SDK so built-in and external
 * channels make the same access-groups decisions for native command text.
 */
/** One channel-specific authorization source for text control commands. */
type CommandAuthorizer = {
  /** True when this channel/user identity has an access-group rule configured. */configured: boolean; /** True when the configured rule permits the command. Ignored when unconfigured. */
  allowed: boolean;
};
/** Fallback policy for channels that have access groups globally disabled. */
type CommandGatingModeWhenAccessGroupsOff = "allow" | "deny" | "configured";
/** Resolves whether any configured authorizer permits a control command. */
declare function resolveCommandAuthorizedFromAuthorizers(params: {
  /** Global access-group switch for the channel/runtime. */useAccessGroups: boolean; /** Independent authorization sources, such as sender id and actor id. */
  authorizers: CommandAuthorizer[]; /** Policy used only when `useAccessGroups` is false. Defaults to open. */
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): boolean;
/** Resolves command authorization and whether the current text command should be blocked. */
declare function resolveControlCommandGate(params: {
  /** Global access-group switch for the channel/runtime. */useAccessGroups: boolean; /** Authorization sources checked by this channel command. */
  authorizers: CommandAuthorizer[]; /** Channel setting that enables text commands as an input surface. */
  allowTextCommands: boolean; /** True when the current inbound message parsed as a control command. */
  hasControlCommand: boolean; /** Policy used only when `useAccessGroups` is false. Defaults to open. */
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): {
  commandAuthorized: boolean;
  shouldBlock: boolean;
};
/** Convenience gate for channels that check primary and secondary text command identities. */
declare function resolveDualTextControlCommandGate(params: {
  /** Global access-group switch for the channel/runtime. */useAccessGroups: boolean; /** Whether the primary identity has an access-group rule. */
  primaryConfigured: boolean; /** Whether the primary configured rule permits the command. */
  primaryAllowed: boolean; /** Whether the secondary identity has an access-group rule. */
  secondaryConfigured: boolean; /** Whether the secondary configured rule permits the command. */
  secondaryAllowed: boolean; /** True when the current inbound message parsed as a control command. */
  hasControlCommand: boolean; /** Policy used only when `useAccessGroups` is false. Defaults to open. */
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): {
  commandAuthorized: boolean;
  shouldBlock: boolean;
};
//#endregion
//#region src/plugin-sdk/pair-loop-guard-runtime.d.ts
/** User-facing pair-loop guard config accepted by channel plugins. */
type PairLoopGuardConfig = {
  /** Enables or disables loop protection for the channel/account scope. */enabled?: boolean; /** Number of pair events allowed before cooldown starts. */
  maxEventsPerWindow?: number; /** Rolling event window size in seconds for config files. */
  windowSeconds?: number; /** Suppression duration in seconds for config files. */
  cooldownSeconds?: number;
};
/** Result of recording one pair interaction against the loop guard. */
type PairLoopGuardResult = {
  suppressed: false;
} | {
  suppressed: true;
  cooldownUntilMs: number;
};
//#endregion
//#region src/channels/turn/bot-loop-protection.d.ts
/** Facts used to detect repeated bot-to-bot channel reply loops. */
type ChannelBotLoopProtectionFacts = {
  scopeId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  eventId?: string;
  config?: PairLoopGuardConfig;
  defaultsConfig?: PairLoopGuardConfig;
  defaultEnabled: boolean;
  nowMs?: number;
};
/** Records a bot pair interaction and returns whether the loop guard should suppress it. */
declare function recordChannelBotPairLoopAndCheckSuppression(params: ChannelBotLoopProtectionFacts): PairLoopGuardResult;
//#endregion
//#region src/channels/turn/types.d.ts
/** Admission decision for an inbound channel event before agent dispatch. */
type ChannelTurnAdmission = {
  kind: "dispatch";
  reason?: string;
} | {
  kind: "observeOnly";
  reason: string;
} | {
  kind: "handled";
  reason: string;
} | {
  kind: "drop";
  reason: string;
  recordHistory?: boolean;
};
/** Coarse event classification used to decide whether an event can start an agent turn. */
type ChannelEventClass = {
  kind: "message" | "command" | "interaction" | "reaction" | "lifecycle" | "unknown";
  canStartAgentTurn: boolean;
  requiresImmediateAck?: boolean;
};
/** Normalized inbound event text and raw payload after channel-specific ingestion. */
type NormalizedTurnInput = {
  id: string;
  timestamp?: number;
  rawText: string;
  textForAgent?: string;
  textForCommands?: string;
  raw?: unknown;
};
/** Sender identity facts projected into channel access, routing, and prompt context. */
type SenderFacts = {
  id?: string;
  name?: string;
  username?: string;
  tag?: string;
  roles?: string[];
  isBot?: boolean;
  isSelf?: boolean;
  displayLabel?: string;
};
/** Conversation identity and threading facts for a channel turn. */
type ConversationFacts = {
  kind: "direct" | "group" | "channel";
  id: string;
  label?: string;
  spaceId?: string;
  parentId?: string;
  threadId?: string;
  nativeChannelId?: string;
  routePeer?: {
    kind: "direct" | "group" | "channel";
    id: string;
  };
};
/** Session routing facts derived before dispatch. */
type RouteFacts = {
  agentId: string;
  dmScope?: DmScope;
  accountId?: string;
  routeSessionKey: string;
  dispatchSessionKey?: string;
  persistedSessionKey?: string;
  parentSessionKey?: string;
  modelParentSessionKey?: string;
  mainSessionKey?: string;
  createIfMissing?: boolean;
};
/** Reply target and source-delivery facts for a channel turn. */
type ReplyPlanFacts = {
  to: string;
  originatingTo?: string;
  nativeChannelId?: string;
  replyTarget?: string;
  deliveryTarget?: string;
  replyToId?: string;
  replyToIdFull?: string;
  messageThreadId?: string | number;
  threadParentId?: string;
  sourceReplyDeliveryMode?: "thread" | "reply" | "channel" | "direct" | "none";
};
/** Message text/history facts passed into templating and dispatch. */
type MessageFacts = {
  inboundEventKind?: InboundEventKind;
  body?: string;
  rawBody: string;
  bodyForAgent?: string;
  commandBody?: string;
  envelopeFrom?: string;
  senderLabel?: string;
  preview?: string;
  inboundHistory?: HistoryEntry[];
  sourceModality?: InboundSourceModality;
};
/** Parsed command facts for command-like channel turns. */
type CommandFacts = {
  kind: CommandTurnKind;
  body?: string;
  name?: string;
  authorized?: boolean;
};
/** Inbound media facts supplied to the agent context. */
type InboundMediaFacts = Omit<MediaFact, "staged" | "workspaceDir">;
type MaybePromise$1<T> = T | Promise<T>;
/** Adapter preflight output assembled before turn resolution. */
type PreflightFacts = {
  admission?: ChannelTurnAdmission;
  command?: CommandFacts;
  message?: Partial<MessageFacts>;
  media?: readonly InboundMediaFacts[] | (() => MaybePromise$1<readonly InboundMediaFacts[] | readonly HistoryMediaEntry[] | null | undefined>);
  supplemental?: SupplementalContextFacts;
  history?: ChannelTurnDroppedHistoryOptions;
};
/** Delivery metadata for one reply payload dispatch. */
type ChannelDeliveryInfo = ReplyDispatchRuntimeInfo;
type ChannelCoreManagedDeliveryInfo = Omit<ChannelDeliveryInfo, "bindPendingFinalDelivery" | "onPlatformSendDispatch">;
type ChannelProviderOwnedDeliveryInfo = ChannelDeliveryInfo & {
  onPlatformSendDispatch: () => Promise<void>;
};
/** Durable delivery queue intent recorded when a reply is deferred. */
type ChannelDeliveryIntent = {
  id: string;
  kind: "outbound_queue";
  queuePolicy: OutboundDeliveryQueuePolicy;
};
/** Provider-accepted outcome for one logical channel reply payload. */
type ChannelDeliveryOutcome = {
  messageIds?: string[];
  receipt?: MessageReceipt;
  threadId?: string;
  replyToId?: string;
  visibleReplySent?: boolean; /** Final provider-visible text used for this logical payload's terminal observation. */
  content?: string;
};
/** Result returned after delivering one channel reply payload. */
type ChannelDeliveryResult = ChannelDeliveryOutcome & {
  deliveryIntent?: ChannelDeliveryIntent; /** Intentional no-send outcome after payload policy or modifying hooks settle. */
  suppression?: {
    reason: OutboundPayloadDeliverySuppressionReason | "channel_transform" | "no_visible_result";
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  }; /** Same-payload native settlement; resolved fields override this result before observation. */
  finalization?: Promise<ChannelDeliveryOutcome>;
};
/** Durable outbound delivery options available to channel turn delivery adapters. */
type ChannelTurnDurableDeliveryOptions = Pick<DeliverOutboundPayloadsParams, "deps" | "formatting" | "identity" | "mediaAccess" | "replyToMode" | "silent" | "threadId"> & {
  to?: string | null;
  replyToId?: string | null;
  requiredCapabilities?: DurableFinalDeliveryRequirements;
};
type ChannelDeliveryAdapterBase = {
  /** Return null when channel policy intentionally suppresses this logical payload. */preparePayload?: (payload: ReplyPayload, info: ChannelDeliveryInfo) => MaybePromise$1<ReplyPayload | null>;
  onDelivered?: (payload: ReplyPayload, info: ChannelDeliveryInfo, result: ChannelDeliveryResult | void) => Promise<void> | void; /** Let core emit the one canonical `message_sent` after non-durable provider settlement. */
  observeMessageSent?: true;
  onError?: (err: unknown, info: {
    kind: string;
  }) => void;
};
type ChannelCoreManagedTurnDeliveryAdapter = ChannelDeliveryAdapterBase & {
  deliver: (payload: ReplyPayload, info: ChannelCoreManagedDeliveryInfo) => Promise<ChannelDeliveryResult | void>;
  durable?: false | ChannelTurnDurableDeliveryOptions | ((payload: ReplyPayload, info: ChannelDeliveryInfo) => false | ChannelTurnDurableDeliveryOptions | Promise<false | ChannelTurnDurableDeliveryOptions>);
};
/** Delivery adapter used by legacy caller-assembled channel turns. */
type ChannelEventDeliveryAdapter = ChannelCoreManagedTurnDeliveryAdapter;
type ChannelProviderOwnedMessageSendingDeliveryAdapter = ChannelDeliveryAdapterBase & {
  /**
   * Provider funnel that owns `message_sending` after its native payload preparation.
   * Use only when delivery cannot declare its durable/direct branch before entering the
   * provider funnel; core still owns `reply_payload_sending` for this routed turn.
   */
  deliverWithProviderMessageSending: (payload: ReplyPayload, info: ChannelProviderOwnedDeliveryInfo) => Promise<ChannelDeliveryResult | void>;
  deliver?: never;
  durable?: never;
};
/** Delivery adapter used by modern routed channel turns. */
type ChannelTurnDeliveryAdapter = (ChannelCoreManagedTurnDeliveryAdapter & {
  deliverWithProviderMessageSending?: never;
}) | ChannelProviderOwnedMessageSendingDeliveryAdapter;
/** Options for recording inbound session route state around a turn. */
type ChannelTurnRecordOptions = {
  /**
   * Override the session used for metadata and transcript context.
   * Must be non-empty and contain no surrounding whitespace.
   */
  sessionKey?: string;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError?: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
};
/** Options for finalizing visible conversation history after dispatch. */
type ChannelTurnHistoryFinalizeOptions = {
  isGroup?: boolean;
  historyKey?: string;
  historyMap?: Map<string, HistoryEntry[]>;
  limit?: number;
};
/** Options for recording history when an inbound event is dropped before dispatch. */
type ChannelTurnDroppedHistoryOptions = {
  key: string;
  limit: number;
  historyMap: Map<string, HistoryEntry[]>;
  recordOnDrop?: boolean;
  mediaLimit?: number;
  shouldRecord?: () => boolean;
};
/** Dispatcher options excluding delivery hooks owned by the channel turn adapter. */
type ChannelTurnDispatcherOptions = Omit<ReplyDispatcherWithTypingOptions, "deliver" | "onError">;
/** Reply options plus the opaque native command ownership decision carried by channel turns. */
type ChannelTurnReplyOptions = Omit<GetReplyOptions, "onBlockReply"> & PluginCommandReplyOptions;
/** Reply pipeline options excluding cfg/agent/channel identity supplied by the turn. */
type ChannelTurnReplyPipelineOptions = Omit<CreateChannelReplyPipelineParams, "cfg" | "agentId" | "channel" | "accountId">;
/** Fully assembled channel turn ready to build the dispatch runner. */
type AssembledChannelTurn = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSession$1;
  afterRecord?: () => void | Promise<void>;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher$1;
  delivery: ChannelEventDeliveryAdapter;
  replyPipeline?: ChannelTurnReplyPipelineOptions;
  dispatcherOptions?: ChannelTurnDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: ChannelTurnReplyOptions;
  replyResolver?: GetReplyFromConfig;
  sessionInitRetry?: {
    delaysMs: readonly number[];
    signal?: AbortSignal;
    sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
  };
  record?: ChannelTurnRecordOptions;
  history?: ChannelTurnHistoryFinalizeOptions;
  admission?: Extract<ChannelTurnAdmission, {
    kind: "dispatch" | "observeOnly";
  }>;
  botLoopProtection?: ChannelBotLoopProtectionFacts; /** Transport-defined outbound source identity, such as a webhook id. */
  outboundEchoSourceId?: string;
  log?: (event: ChannelTurnLogEvent) => void;
  messageId?: string; /** Canonical adoption lifecycle threaded into replyOptions. */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
};
type PreparedChannelTurnDispatchSkipReason = "botLoopProtection" | "observeOnly" | "outboundEcho";
/** Lifecycle ownership declared alongside an already-prepared dispatch runner. */
type PreparedChannelTurnDispatchLifecycle = {
  /** Exact adoption lifecycle captured by runDispatch, or undefined for non-durable turns. */turnAdoptionLifecycle: TurnAdoptionLifecycle | undefined; /** Releases resources that runDispatch would otherwise settle when dispatch is skipped. */
  onDispatchSkipped: (reason: PreparedChannelTurnDispatchSkipReason) => void | Promise<void>;
};
/** Channel turn with dispatch runner already prepared. */
type PreparedChannelTurn<TDispatchResult = DispatchFromConfigResult> = {
  channel: string;
  accountId?: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSession$1;
  afterRecord?: () => void | Promise<void>;
  record?: ChannelTurnRecordOptions;
  history?: ChannelTurnHistoryFinalizeOptions;
  onPreDispatchFailure?: (err: unknown) => void | Promise<void>;
  runDispatch: () => Promise<TDispatchResult>; /** Optional for the legacy direct prepared runner; inbound adapters use the stricter type. */
  runDispatchLifecycle?: PreparedChannelTurnDispatchLifecycle;
  observeOnlyDispatchResult?: TDispatchResult;
  admission?: Extract<ChannelTurnAdmission, {
    kind: "dispatch" | "observeOnly";
  }>;
  botLoopProtection?: ChannelBotLoopProtectionFacts; /** Transport-defined outbound source identity, such as a webhook id. */
  outboundEchoSourceId?: string;
  log?: (event: ChannelTurnLogEvent) => void;
  messageId?: string;
};
type ChannelTurnRoute = {
  agentId: string;
  dmScope?: DmScope;
  sessionKey: string;
};
type RoutedChannelTurn<T> = Omit<T, "routeSessionKey" | "storePath" | "recordInboundSession"> & {
  route: ChannelTurnRoute;
};
type InboundPreparedChannelTurn<TDispatchResult = DispatchFromConfigResult> = PreparedChannelTurn<TDispatchResult> & {
  runDispatchLifecycle: PreparedChannelTurnDispatchLifecycle;
};
type ChannelTurnPlan<TDelivery extends ChannelTurnDeliveryAdapter = ChannelCoreManagedTurnDeliveryAdapter> = RoutedChannelTurn<Omit<AssembledChannelTurn, "agentId" | "delivery" | "dispatchReplyWithBufferedBlockDispatcher"> & {
  delivery: TDelivery;
}>;
type PreparedChannelTurnPlan<TDispatchResult = DispatchFromConfigResult> = RoutedChannelTurn<InboundPreparedChannelTurn<TDispatchResult>> & {
  cfg: OpenClawConfig;
};
/** Resolved turn shape returned by adapters before final run/dispatch handling. */
type ChannelTurnResolved<TDispatchResult = DispatchFromConfigResult, TDelivery extends ChannelTurnDeliveryAdapter = ChannelCoreManagedTurnDeliveryAdapter> = ChannelTurnPlan<TDelivery> | PreparedChannelTurnPlan<TDispatchResult> | (AssembledChannelTurn & {
  admission?: Extract<ChannelTurnAdmission, {
    kind: "dispatch" | "observeOnly";
  }>;
}) | (InboundPreparedChannelTurn<TDispatchResult> & {
  admission?: Extract<ChannelTurnAdmission, {
    kind: "dispatch" | "observeOnly";
  }>;
});
/** Ordered lifecycle stage names emitted to channel turn log hooks. */
type ChannelTurnStage = "ingest" | "classify" | "preflight" | "resolve" | "authorize" | "assemble" | "record" | "dispatch" | "finalize";
/** Structured channel turn log event. */
type ChannelTurnLogEvent = {
  stage: ChannelTurnStage;
  event: "start" | "done" | "drop" | "handled" | "error" | "warning";
  channel: string;
  accountId?: string;
  messageId?: string;
  sessionKey?: string;
  admission?: ChannelTurnAdmission["kind"];
  reason?: string;
  error?: unknown;
};
/** Final result for a channel turn, dispatched or admitted without dispatch. */
type ChannelTurnResult<TDispatchResult = DispatchFromConfigResult> = DispatchedChannelTurnResult<TDispatchResult> | {
  admission: ChannelTurnAdmission;
  dispatched: false;
  ctxPayload?: MsgContext;
  routeSessionKey?: string;
};
/** Successful dispatch result for a channel turn. */
type DispatchedChannelTurnResult<TDispatchResult = DispatchFromConfigResult> = {
  admission: Extract<ChannelTurnAdmission, {
    kind: "dispatch" | "observeOnly";
  }>;
  dispatched: true;
  ctxPayload: MsgContext;
  routeSessionKey: string;
  dispatchResult: TDispatchResult;
};
/** Adapter contract for ingesting, classifying, resolving, and finalizing raw channel events. */
type ChannelTurnAdapter<TRaw, TDispatchResult = DispatchFromConfigResult, TDelivery extends ChannelTurnDeliveryAdapter = ChannelCoreManagedTurnDeliveryAdapter> = {
  ingest: (raw: TRaw) => Promise<NormalizedTurnInput | null> | NormalizedTurnInput | null;
  classify?: (input: NormalizedTurnInput) => Promise<ChannelEventClass> | ChannelEventClass;
  preflight?: (input: NormalizedTurnInput, eventClass: ChannelEventClass) => Promise<PreflightFacts | ChannelTurnAdmission | null | undefined> | PreflightFacts | ChannelTurnAdmission | null | undefined;
  resolveTurn: (input: NormalizedTurnInput, eventClass: ChannelEventClass, preflight: PreflightFacts) => Promise<ChannelTurnResolved<TDispatchResult, TDelivery>> | ChannelTurnResolved<TDispatchResult, TDelivery>;
  onFinalize?: (result: ChannelTurnResult<TDispatchResult>) => Promise<void> | void;
};
/** Parameters for running one raw channel event through the turn kernel. */
type RunChannelTurnParams<TRaw, TDispatchResult = DispatchFromConfigResult, TDelivery extends ChannelTurnDeliveryAdapter = ChannelCoreManagedTurnDeliveryAdapter> = {
  channel: string;
  accountId?: string;
  raw: TRaw;
  adapter: ChannelTurnAdapter<TRaw, TDispatchResult, TDelivery>;
  log?: (event: ChannelTurnLogEvent) => void; /** Canonical adoption lifecycle for this turn. */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
};
//#endregion
//#region src/channels/inbound-event/context.d.ts
type MaybePromise<T> = T | Promise<T>;
type ChannelInboundSupplementalMediaResolver = () => MaybePromise<readonly InboundMediaFacts[] | null | undefined>;
type ChannelInboundSupplementalQuoteFacts = NonNullable<SupplementalContextFacts["quote"]> & {
  isSelf?: boolean;
  media?: readonly InboundMediaFacts[] | ChannelInboundSupplementalMediaResolver;
};
type ChannelInboundSupplementalFacts = Omit<SupplementalContextFacts, "quote"> & {
  quote?: ChannelInboundSupplementalQuoteFacts;
};
/**
 * @deprecated Prefer passing `resolveSupplementalMedia: true` directly to
 * `buildChannelInboundEventContext` without naming this compatibility type.
 */
type ChannelInboundSupplementalResolutionOptions = {
  resolveSupplementalMedia: true;
  suppressSelfQuoteBody?: boolean;
  suppressSelfQuoteMedia?: boolean;
};
type BuildChannelInboundEventAccess = {
  commands?: Pick<ChannelIngressCommandAccess, "authorized">; /** Channel-configured policy resolved at the trusted ingress boundary. */
  toolPolicy?: GroupToolPolicyConfig;
  mentions?: {
    canDetectMention: boolean;
    wasMentioned: boolean;
    hasAnyMention?: boolean;
    explicitlyMentionedBot?: boolean;
    mentionedUserIds?: string[];
    mentionedSubteamIds?: string[];
    mentionSource?: MentionSource;
    implicitMentionKinds?: InboundImplicitMentionKind[];
    requireMention?: boolean;
    effectiveWasMentioned?: boolean;
  };
};
type BuildChannelInboundEventContextParams = {
  channel: string;
  accountId?: string;
  provider?: string;
  surface?: string;
  messageId?: string;
  messageIdFull?: string;
  timestamp?: number;
  from: string;
  sender: SenderFacts;
  conversation: ConversationFacts;
  route: RouteFacts;
  reply: ReplyPlanFacts;
  message: MessageFacts;
  sessionTranscript?: SessionTranscriptContext;
  access?: BuildChannelInboundEventAccess;
  command?: CommandFacts;
  commandTurn?: CommandTurnContext;
  media?: InboundMediaFacts[];
  supplemental?: ChannelInboundSupplementalFacts;
  channelContext?: PluginHookChannelContext;
  contextVisibility?: ContextVisibilityMode;
  finalize?: FinalizeInboundContextFn;
  finalizeOptions?: FinalizeInboundContextOptions;
  extra?: Record<string, unknown>; /** Exact host-resolved ingress result, or an explicit unsupported adapter marker. */
  channelIngress?: ResolvedChannelMessageIngress | readonly ResolvedChannelMessageIngress[] | "unsupported";
};
/**
 * @deprecated Prefer `BuildChannelInboundEventContextParams` with
 * `resolveSupplementalMedia: true` at call sites that need lazy quote media.
 */
type BuildChannelInboundEventContextAsyncParams = BuildChannelInboundEventContextParams & ChannelInboundSupplementalResolutionOptions;
type BuiltChannelInboundEventContext = FinalizedMsgContext & {
  Body: string;
  BodyForAgent: string;
  BodyForCommands: string;
  ChatType: ConversationFacts["kind"];
  CommandAuthorized: boolean;
  CommandBody: string;
  From: string;
  RawBody: string;
  SessionKey: string;
  To: string;
  InboundEventKind: InboundEventKind;
};
type FinalizeInboundContextFn = (ctx: Record<string, unknown>, opts?: FinalizeInboundContextOptions) => unknown;
/**
 * @deprecated Used by deprecated `finalizeChannelInboundContext`; new channel
 * code should pass facts to `buildChannelInboundEventContext`.
 */
type FinalizeChannelInboundContextParams<T extends Record<string, unknown>> = {
  context: T;
  supplemental?: SupplementalContextFacts | ChannelInboundSupplementalFacts;
  contextVisibility?: ContextVisibilityMode;
  media?: readonly InboundMediaFacts[];
  finalize?: FinalizeInboundContextFn;
  finalizeOptions?: FinalizeInboundContextOptions;
};
/**
 * @deprecated Prefer `FinalizeChannelInboundContextParams<T>` with
 * `resolveSupplementalMedia: true` when lazy quote media must be resolved.
 */
type FinalizeChannelInboundContextAsyncParams<T extends Record<string, unknown>> = FinalizeChannelInboundContextParams<T> & {
  resolveSupplementalMedia: true;
} & Pick<ChannelInboundSupplementalResolutionOptions, "suppressSelfQuoteBody" | "suppressSelfQuoteMedia">;
/**
 * @deprecated Result type for deprecated `finalizeChannelInboundContext`.
 */
type FinalizeChannelInboundContextResult<T extends Record<string, unknown>> = {
  context: T & FinalizedMsgContext;
  supplemental?: SupplementalContextFacts;
  quoteHidden: boolean;
  forwardedHidden: boolean;
  threadHidden: boolean;
};
declare function filterChannelInboundSupplementalContext(params: {
  supplemental?: SupplementalContextFacts;
  contextVisibility?: ContextVisibilityMode;
}): SupplementalContextFacts | undefined;
/** Resolves whether a supplemental-context sender passes the active group policy. */
declare function resolveInboundSupplementalSenderAllowed<TAllowFrom>(params: {
  isGroup: boolean;
  groupPolicy: string;
  allowFrom: readonly TAllowFrom[];
  isSenderAllowed: (allowFrom: readonly TAllowFrom[]) => boolean;
}): boolean;
declare function filterChannelInboundQuoteContext(contextVisibility: ContextVisibilityMode | undefined, quote: SupplementalContextFacts["quote"] | undefined): SupplementalContextFacts["quote"] | undefined;
/**
 * @deprecated Public compatibility for callers that already prepared legacy
 * prompt fields. New channel code should use `buildChannelInboundEventContext`.
 */
declare function finalizeChannelInboundContext<T extends Record<string, unknown>>(params: FinalizeChannelInboundContextAsyncParams<T>): Promise<FinalizeChannelInboundContextResult<T>>;
declare function finalizeChannelInboundContext<T extends Record<string, unknown>>(params: FinalizeChannelInboundContextParams<T>): FinalizeChannelInboundContextResult<T>;
declare function buildChannelInboundEventContext(params: BuildChannelInboundEventContextAsyncParams): Promise<BuiltChannelInboundEventContext>;
declare function buildChannelInboundEventContext(params: BuildChannelInboundEventContextParams): BuiltChannelInboundEventContext;
//#endregion
//#region src/channels/turn/run-channel-turn.d.ts
declare function recordDroppedChannelTurnHistory(params: {
  input: NormalizedTurnInput;
  preflight: PreflightFacts;
  admission?: ChannelTurnAdmission;
}): Promise<void>;
declare function runChannelTurn<TRaw, TDispatchResult = DispatchedChannelTurnResult["dispatchResult"]>(params: RunChannelTurnParams<TRaw, TDispatchResult, ChannelProviderOwnedMessageSendingDeliveryAdapter>): Promise<ChannelTurnResult<TDispatchResult>>;
declare function runChannelTurn<TRaw, TDispatchResult = DispatchedChannelTurnResult["dispatchResult"]>(params: RunChannelTurnParams<TRaw, TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
//#endregion
//#region src/channels/turn/execution.d.ts
declare function runPreparedChannelTurn<TDispatchResult = DispatchedChannelTurnResult["dispatchResult"]>(params: PreparedChannelTurn<TDispatchResult>): Promise<ChannelTurnResult<TDispatchResult>>;
//#endregion
//#region src/channels/turn/lifecycle.d.ts
declare function dispatchAssembledChannelTurn(params: AssembledChannelTurn): Promise<ChannelTurnResult>;
declare function dispatchRoutedChannelTurn(params: ChannelTurnPlan<ChannelTurnDeliveryAdapter>): Promise<ChannelTurnResult>;
declare function dispatchRoutedChannelTurn(params: ChannelTurnPlan<ChannelProviderOwnedMessageSendingDeliveryAdapter>): Promise<ChannelTurnResult>;
declare function dispatchRoutedChannelTurn(params: ChannelTurnPlan): Promise<ChannelTurnResult>;
//#endregion
//#region src/auto-reply/command-detection.runtime-types.d.ts
/** Runtime-injected predicate for deciding whether visible text is an OpenClaw command. */
type IsControlCommandMessage = (text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions) => boolean;
/** Runtime-injected predicate for deciding whether command authorization must be computed. */
type ShouldComputeCommandAuthorized = (text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions) => boolean;
//#endregion
//#region src/auto-reply/commands-registry.runtime-types.d.ts
/** Runtime-injected policy hook for whether text slash commands should be honored. */
type ShouldHandleTextCommands = (params: ShouldHandleTextCommandsParams) => boolean;
//#endregion
//#region src/channels/mention-pattern-policy.d.ts
/**
 * Inputs for resolving whether mention-pattern matching is enabled in a conversation.
 */
type ResolveMentionPatternPolicyParams = {
  cfg?: OpenClawConfig;
  provider?: string;
  conversationId?: string | null;
  providerPolicy?: MentionPatternsPolicyConfig;
  agentId?: string;
};
/**
 * Effective mention-pattern policy after provider and conversation allow/deny rules.
 */
type ResolvedMentionPatternPolicy = {
  effectiveMode: MentionPatternsMode;
  allowMatched: boolean;
  denyMatched: boolean;
  enabled: boolean;
};
/**
 * Resolves provider-scoped mention-pattern policy for a single conversation.
 */
declare function resolveMentionPatternPolicy(params: ResolveMentionPatternPolicyParams): ResolvedMentionPatternPolicy;
//#endregion
//#region src/auto-reply/reply/mentions.types.d.ts
/** Options for building mention regexes without binding config/agent id. */
type BuildMentionRegexesOptions = Omit<ResolveMentionPatternPolicyParams, "cfg" | "agentId">;
/** Builds mention regexes for the current config and agent. */
type BuildMentionRegexes = (cfg: OpenClawConfig | undefined, agentId?: string, options?: BuildMentionRegexesOptions) => RegExp[];
/** Tests plain text against mention regexes. */
type MatchesMentionPatterns = (text: string, mentionRegexes: RegExp[]) => boolean;
/** Explicit mention metadata supplied by channel adapters. */
type ExplicitMentionSignal = {
  hasAnyMention: boolean;
  isExplicitlyMentioned: boolean;
  canResolveExplicit: boolean;
};
/** Tests mention state using regexes plus explicit channel mention metadata. */
type MatchesMentionWithExplicit = (params: {
  text: string;
  mentionRegexes: RegExp[];
  explicit?: ExplicitMentionSignal;
  transcript?: string;
}) => boolean;
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.runtime-types.d.ts
/** Type of the lazy reply dispatcher factory used by runtime dispatch paths. */
type CreateReplyDispatcherWithTyping = typeof createReplyDispatcherWithTyping;
//#endregion
//#region src/channels/plugins/outbound/load.types.d.ts
/**
 * Lazy loader contract for channel outbound adapters.
 */
type LoadChannelOutboundAdapter = (id: ChannelId$1) => Promise<ChannelOutboundAdapter | undefined>;
//#endregion
//#region src/config/sessions/runtime-types.d.ts
/** Runtime hook for reading a session store entry timestamp. */
type ReadSessionUpdatedAt = (params: {
  storePath: string;
  sessionKey: string;
}) => number | undefined;
type RecordSessionMetaFromInbound = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}) => Promise<SessionEntry | null>;
type UpdateLastRoute = (params: {
  storePath: string;
  sessionKey: string;
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  ctx?: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}) => Promise<SessionEntry | null>;
//#endregion
//#region src/plugins/runtime/types-channel.d.ts
type DispatchReplyWithBufferedBlockDispatcher = DispatchReplyWithBufferedBlockDispatcher$1;
type RecordInboundSession = RecordInboundSession$1;
type RuntimeThreadBindingLifecycleRecord = SessionBindingRecord | {
  boundAt: number;
  lastActivityAt: number;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
};
type PluginRuntimeChannelContextKey = {
  channelId: string;
  accountId?: string | null;
  capability: string;
};
type PluginRuntimeChannelContextEvent = {
  type: "registered" | "unregistered";
  key: {
    channelId: string;
    accountId?: string;
    capability: string;
  };
  context?: unknown;
};
type PluginRuntimeChannelContextRegistry = {
  register: (params: PluginRuntimeChannelContextKey & {
    context: unknown;
    abortSignal?: AbortSignal;
  }) => {
    dispose: () => void;
  };
  get: <T = unknown>(params: PluginRuntimeChannelContextKey) => T | undefined;
  watch: (params: {
    channelId?: string;
    accountId?: string | null;
    capability?: string;
    onEvent: (event: PluginRuntimeChannelContextEvent) => void;
  }) => () => void;
};
type PluginRuntimeChannel$1 = {
  text: {
    chunkByNewline: typeof chunkByNewline;
    chunkMarkdownText: typeof chunkMarkdownText;
    chunkMarkdownTextWithMode: typeof chunkMarkdownTextWithMode;
    chunkText: typeof chunkText;
    chunkTextWithMode: typeof chunkTextWithMode;
    resolveChunkMode: typeof resolveChunkMode;
    resolveTextChunkLimit: typeof resolveTextChunkLimit;
    hasControlCommand: typeof hasControlCommand;
    resolveMarkdownTableMode: ResolveMarkdownTableMode;
    convertMarkdownTables: typeof convertMarkdownTables;
  };
  reply: {
    dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
    /**
     * @deprecated Prefer `openclaw/plugin-sdk/channel-outbound` adapters plus
     * `dispatchReplyWithBufferedBlockDispatcher` or channel turn helpers.
     * This is a low-level legacy dispatcher escape hatch.
     */
    createReplyDispatcherWithTyping: CreateReplyDispatcherWithTyping;
    resolveEffectiveMessagesConfig: typeof resolveEffectiveMessagesConfig;
    /**
     * @deprecated Prefer the channel-message reply pipeline helpers. This is
     * tied to the low-level legacy dispatcher path.
     */
    resolveHumanDelayConfig: typeof resolveHumanDelayConfig;
    /**
     * @deprecated Prefer `dispatchReplyWithBufferedBlockDispatcher` with a
     * channel-message adapter or the channel turn helpers. Direct use must
     * manually preserve source reply delivery metadata such as
     * `sourceReplyDeliveryMode`.
     */
    dispatchReplyFromConfig: DispatchReplyFromConfig;
    withReplyDispatcher: typeof withReplyDispatcher;
    settleReplyDispatcher: typeof settleReplyDispatcher;
    /**
     * @deprecated Prefer `buildChannelInboundEventContext` from
     * `openclaw/plugin-sdk/channel-inbound` so inbound event metadata is
     * carried into reply dispatch.
     */
    finalizeInboundContext: typeof finalizeInboundContext;
    formatAgentEnvelope: typeof formatAgentEnvelope;
    resolveEnvelopeFormatOptions: typeof resolveEnvelopeFormatOptions;
  };
  routing: {
    buildAgentSessionKey: typeof buildAgentSessionKey;
    resolveAgentRoute: typeof resolveAgentRoute;
  };
  pairing: {
    buildPairingReply: typeof buildPairingReply;
    readAllowFromStore: ReadChannelAllowFromStoreForAccount;
    removeAllowFromStoreEntry: RemoveChannelAllowFromStoreEntryForAccount;
    upsertPairingRequest: UpsertChannelPairingRequestForAccount;
  };
  media: {
    readRemoteMediaBuffer: typeof readRemoteMediaBuffer; /** @deprecated Use `readRemoteMediaBuffer`. */
    fetchRemoteMedia: typeof fetchRemoteMedia;
    saveRemoteMedia: typeof saveRemoteMedia;
    saveResponseMedia: typeof saveResponseMedia;
    saveMediaBuffer: typeof saveMediaBuffer;
  };
  activity: {
    record: typeof recordChannelActivity;
    get: typeof getChannelActivity;
  };
  session: {
    /** @deprecated Prefer channel turn helpers that record inbound sessions as part of dispatch. */resolveStorePath: typeof resolveSessionStorePathCore;
    readSessionUpdatedAt: ReadSessionUpdatedAt;
    recordSessionMetaFromInbound: RecordSessionMetaFromInbound; /** @deprecated Prefer channel turn helpers that record inbound sessions as part of dispatch. */
    recordInboundSession: RecordInboundSession;
    updateLastRoute: UpdateLastRoute;
  };
  mentions: {
    buildMentionRegexes: BuildMentionRegexes;
    matchesMentionPatterns: MatchesMentionPatterns;
    matchesMentionWithExplicit: MatchesMentionWithExplicit;
    implicitMentionKindWhen: typeof implicitMentionKindWhen;
    resolveInboundMentionDecision: typeof resolveInboundMentionDecision;
  };
  reactions: {
    createAckReactionHandle: typeof createAckReactionHandle;
    shouldAckReaction: typeof shouldAckReaction;
    removeAckReactionAfterReply: typeof removeAckReactionAfterReply;
    removeAckReactionHandleAfterReply: typeof removeAckReactionHandleAfterReply;
  };
  groups: {
    resolveGroupPolicy: typeof resolveChannelGroupPolicy;
    resolveRequireMention: typeof resolveChannelGroupRequireMention;
  };
  debounce: {
    createInboundDebouncer: typeof createInboundDebouncer;
    resolveInboundDebounceMs: typeof resolveInboundDebounceMs;
  };
  commands: {
    resolveCommandAuthorizedFromAuthorizers: typeof resolveCommandAuthorizedFromAuthorizers;
    isControlCommandMessage: IsControlCommandMessage;
    shouldComputeCommandAuthorized: ShouldComputeCommandAuthorized;
    shouldHandleTextCommands: ShouldHandleTextCommands;
  };
  outbound: {
    loadAdapter: LoadChannelOutboundAdapter;
  };
  inbound: {
    buildContext: typeof buildChannelInboundEventContext;
    run: typeof runChannelTurn; /** @deprecated Prefer `run` for raw inbound events or `dispatchReply` for assembled contexts. */
    runPreparedReply: typeof runPreparedChannelTurn;
    dispatch: typeof dispatchRoutedChannelTurn; /** Compatibility escape hatch; prefer `dispatch`, which keeps session wiring in core. */
    dispatchReply: typeof dispatchAssembledChannelTurn;
  };
  threadBindings: {
    setIdleTimeoutBySessionKey: (params: {
      channelId: string;
      targetSessionKey: string;
      accountId?: string;
      idleTimeoutMs: number;
    }) => RuntimeThreadBindingLifecycleRecord[];
    setMaxAgeBySessionKey: (params: {
      channelId: string;
      targetSessionKey: string;
      accountId?: string;
      maxAgeMs: number;
    }) => RuntimeThreadBindingLifecycleRecord[];
  };
  runtimeContexts: PluginRuntimeChannelContextRegistry;
};
//#endregion
//#region src/plugins/runtime/types.d.ts
type PluginRuntimeChannel = PluginRuntimeChannel$1;
type SubagentRunParams = {
  sessionKey: string;
  message: string; /** Add exact tools registered by the calling plugin to the worker's normal tool surface. */
  toolsAlsoAllow?: string[];
  /**
   * Restrict the worker to the listed tools. `undefined` keeps the default
   * tool surface; an explicit `[]` disables every tool. This restriction is
   * intersected with existing profile and operator policy.
   */
  toolsAllow?: string[];
  provider?: string;
  model?: string;
  extraSystemPrompt?: string;
  lane?: string;
  lightContext?: boolean;
  deliver?: boolean; /** Deliver the completion to the authenticated requester of the current hook invocation. */
  completionDelivery?: "current-requester";
  idempotencyKey?: string;
  cwd?: string;
};
type PluginManagedWorktree = {
  id: string;
  path: string;
  branch: string;
};
type SubagentRunResult = {
  runId: string;
  runtime?: {
    harness: string;
    provider: string;
    model: string;
  };
};
type SubagentWaitParams = {
  runId: string;
  timeoutMs?: number;
};
type SubagentWaitResult = {
  status: "ok" | "error" | "timeout";
  error?: string;
};
type SubagentGetSessionMessagesParams = {
  sessionKey: string;
  limit?: number;
};
type SubagentGetSessionMessagesResult = {
  messages: unknown[];
};
type SubagentDeleteSessionParams = {
  sessionKey: string;
  deleteTranscript?: boolean;
};
type RuntimeNodeListParams = {
  connected?: boolean;
};
type RuntimeNodeListResult = {
  nodes: Array<{
    nodeId: string;
    displayName?: string;
    remoteIp?: string;
    connected?: boolean;
    caps?: string[];
    commands?: string[]; /** True only for the node host installed alongside this Gateway. */
    gatewayLocal?: boolean; /** Advertised commands currently permitted by Gateway node-command policy. */
    invocableCommands?: string[];
    nodePluginTools?: NodePluginToolDescriptor[];
  }>;
};
type RuntimeNodeInvokeParams = {
  nodeId: string;
  command: string;
  params?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string; /** Cancel the invocation and any work already dispatched to a first-party node. */
  signal?: AbortSignal; /** Requested Gateway scopes. Honored only for bundled or trusted official plugins. */
  scopes?: OperatorScope[];
};
type RuntimeGatewayRequestOptions = {
  timeoutMs?: number; /** Requested Gateway scopes. Honored only for bundled or trusted official plugins. */
  scopes?: OperatorScope[];
};
/** Trusted in-process runtime surface injected into native plugins. */
type PluginRuntime = PluginRuntimeCore & {
  gateway: {
    /** Whether this process owns an active Gateway request context. */isAvailable: () => Promise<boolean>; /** Dispatch a Gateway method as the current trusted plugin. */
    request: <T = unknown>(method: string, params?: Record<string, unknown>, options?: RuntimeGatewayRequestOptions) => Promise<T>;
  };
  subagent: {
    run: (params: SubagentRunParams) => Promise<SubagentRunResult>;
    waitForRun: (params: SubagentWaitParams) => Promise<SubagentWaitResult>;
    getSessionMessages: (params: SubagentGetSessionMessagesParams) => Promise<SubagentGetSessionMessagesResult>;
    deleteSession: (params: SubagentDeleteSessionParams) => Promise<void>;
  };
  nodes: {
    list: (params?: RuntimeNodeListParams) => Promise<RuntimeNodeListResult>;
    invoke: (params: RuntimeNodeInvokeParams) => Promise<unknown>;
  };
  sandbox: {
    resolveWorkspaceAuthority: (params: {
      config: OpenClawConfig;
      agentId?: string;
      confinedToolNames?: readonly string[];
      requiredToolNames?: readonly string[];
      modelProvider?: string;
      modelId?: string;
      sessionKey: string;
    }) => {
      sandboxed: boolean;
      workspaceAccess: "none" | "ro" | "rw";
      confinementError?: string;
    };
    prepareWorkspaceAuthority: (params: {
      config: OpenClawConfig;
      agentId?: string;
      confinedToolNames?: readonly string[];
      requiredToolNames?: readonly string[];
      modelProvider?: string;
      modelId?: string;
      sessionKey: string;
      workspaceDir: string;
    }) => Promise<{
      sandboxed: boolean;
      workspaceAccess: "none" | "ro" | "rw";
      confinementError?: string;
    }>;
  };
  worktrees: {
    resolveCheckoutRoot: (params: {
      path: string;
    }) => Promise<string | undefined>;
    hasSelfContainedCheckoutMetadata?: (params: {
      path: string;
    }) => Promise<boolean>;
    create: (params: {
      repoRoot: string;
      name: string;
      baseRef?: string;
      ownerKind: "workboard";
      ownerId: string;
    }) => Promise<PluginManagedWorktree>;
    release: (params: {
      path: string;
    }) => Promise<void>;
    removeIfLossless: (params: {
      path: string;
      ownerKind: "workboard";
      ownerId: string;
    }) => Promise<boolean>;
  };
  channel: PluginRuntimeChannel;
};
type CreatePluginRuntimeOptions = {
  subagent?: PluginRuntime["subagent"];
  nodes?: PluginRuntime["nodes"];
  allowGatewaySubagentBinding?: boolean;
};
//#endregion
//#region src/plugins/session-catalog.d.ts
type SessionCatalogListProviderParams = {
  /** False when Gateway-local scans must not inherit a root from process HOME. */allowProcessHomeFallback?: boolean; /** Trimmed, non-empty search capped at 500 UTF-16 code units by the gateway. */
  search?: string;
  limitPerHost?: number;
  hostIds?: string[];
  cursors?: Record<string, string>; /** Request-owned shared entries. Providers must not mutate or retain them past `list`. */
  sessionEntries?: SessionCatalogEntrySnapshot; /** Lazily lists Gateway nodes once per catalog request. Providers must not retain this past `list`. */
  listNodes?: () => ReturnType<PluginRuntime["nodes"]["list"]>; /** Publishes completed hosts without waiting for slower machines in the same list. */
  onHost?: (host: SessionCatalogHost) => void;
};
type SessionCatalogReadProviderParams = Omit<SessionsCatalogReadParams, "catalogId"> & {
  /** False when Gateway-local reads must not inherit a root from process HOME. */allowProcessHomeFallback?: boolean;
};
type SessionCatalogContinueProviderParams = Omit<SessionsCatalogContinueParams, "catalogId"> & {
  /** False when Gateway-local continuation must not inherit a root from process HOME. */allowProcessHomeFallback?: boolean; /** Caller's gateway scopes so providers can gate high-authority continues up front. */
  clientScopes?: readonly string[];
};
type SessionCatalogArchiveProviderParams = Omit<SessionsCatalogArchiveParams, "catalogId"> & {
  /** False when Gateway-local archive must not inherit a root from process HOME. */allowProcessHomeFallback?: boolean;
};
type SessionCatalogStartTerminalProviderParams = {
  /** False when Gateway-local terminal start must not inherit process HOME. */allowProcessHomeFallback?: boolean;
  agentId: string;
  cwd: string;
  initialMessage?: string; /** Present only when the caller selected a catalog host backed by this node. */
  nodeId?: string;
};
type SessionCatalogTerminalPlan = {
  kind: "local";
  argv: string[];
  cwd?: string;
  title?: string; /** Bounded command-specific environment overrides. */
  env?: Record<string, string>; /** PATH that resolved argv[0], needed by env-based script interpreters. */
  pathEnv?: string;
} | {
  kind: "node";
  nodeId: string;
  command: string;
  paramsJSON: string;
  cwd?: string;
  title?: string;
};
type SessionCatalogCreateTarget = {
  model: string; /** Concrete runtime pinned onto the created session so config reloads cannot retarget it. */
  agentRuntime: string;
};
interface SessionCatalogEntrySummary {
  sessionKey: string;
  entry: SessionEntry;
}
/** Shared, logically frozen store state for one request; copy locally before mutating. */
type SessionCatalogEntrySnapshot = {
  entriesForAgent: (agentId: string) => readonly SessionCatalogEntrySummary[]; /** Request-wide flatten; optional for compatibility with pre-flatten plugin hosts. */
  entriesForCatalog?: () => SessionCatalogAgentEntry[];
};
type SessionCatalogAgentEntry = SessionCatalogEntrySummary & {
  agentId: string;
};
type SessionUpstreamJsonValue = null | boolean | number | string | SessionUpstreamJsonValue[] | {
  [key: string]: SessionUpstreamJsonValue;
};
type SessionUpstreamKind = "claude-cli" | "codex-app-server" | "opencode-cli" | "pi-cli";
type SessionUpstreamProbe = {
  sessionKey: string;
  agentId: string;
  threadId: string;
  hostId: string;
  upstreamKind: SessionUpstreamKind;
  upstreamRef: SessionUpstreamJsonValue;
  marker: SessionUpstreamJsonValue | null;
  ownRecentUserTexts: string[];
};
declare function normalizeUserText(text: string): string;
declare function isExternalUserText(probe: SessionUpstreamProbe, text: string | undefined): boolean;
type SessionUpstreamActivity = {
  kind: "activity";
  sessionKey: string;
  humanTurns: number;
  nextMarker: SessionUpstreamJsonValue;
  occurredAt?: number;
  dedupeId?: string;
} | {
  kind: "missing";
  sessionKey: string;
};
type SessionCatalogContinueProviderResult = {
  sessionKey: string; /** Plugin binding installed for this authenticated Control UI session. */
  conversationBinding?: {
    summary?: string;
    detachHint?: string;
    data?: Record<string, unknown>;
  }; /** Publishes provider state only after the requested binding is durable. */
  afterConversationBound?: () => Promise<void>; /** Upstream link seed so the monitor can detect direct external activity. */
  upstream?: {
    kind: SessionUpstreamKind;
    ref: SessionUpstreamJsonValue;
    marker: SessionUpstreamJsonValue;
  };
};
type SessionCatalogCreateParams = {
  /** Agent whose model/runtime policy must authorize the catalog target. */agentId?: string;
};
type SessionCatalogProvider = {
  id: string;
  label: string; /** Declares that every HOME-sensitive action honors the host isolation policy. */
  supportsProcessHomeIsolation?: true; /** Config-derived target; the Gateway memoizes it for one runtime-config object identity. */
  resolveCreateSession?: (params: SessionCatalogCreateParams) => SessionCatalogCreateTarget | undefined;
  list: (params: SessionCatalogListProviderParams) => Promise<SessionCatalogHost[]>;
  read: (params: SessionCatalogReadProviderParams) => Promise<SessionsCatalogReadResult>;
  continueSession?: (params: SessionCatalogContinueProviderParams) => Promise<SessionCatalogContinueProviderResult>;
  checkUpstreamActivity?: (probes: SessionUpstreamProbe[], policy?: {
    allowProcessHomeFallback?: boolean;
  }) => Promise<SessionUpstreamActivity[]>;
  archive?: (params: SessionCatalogArchiveProviderParams) => Promise<{
    ok: true;
  }>;
  openTerminal?: (request: {
    allowProcessHomeFallback?: boolean;
    hostId: string;
    threadId: string;
  }) => Promise<SessionCatalogTerminalPlan>;
  startTerminalSession?: (request: SessionCatalogStartTerminalProviderParams) => Promise<SessionCatalogTerminalPlan>;
};
type SessionCatalogAdoptedSource = {
  hostId: string;
  threadId: string;
};
type SessionCatalogEntry = SessionCatalogEntrySummary["entry"];
declare function listSessionCatalogEntries(params: {
  config: OpenClawConfig;
  runtime: PluginRuntime;
  sessionEntries?: SessionCatalogEntrySnapshot;
}): SessionCatalogAgentEntry[];
declare function sessionCatalogAdoptedSourceKey(hostId: string, threadId: string): string;
declare function sessionCatalogAdoptedSessionKey(prefix: string, source: string): string;
declare function listAdoptedSessionCatalogSessions(params: {
  config: OpenClawConfig;
  pluginId: string;
  runtime: PluginRuntime;
  sessionEntries?: SessionCatalogEntrySnapshot;
  sourceFromEntry: (entry: SessionCatalogEntry) => SessionCatalogAdoptedSource | undefined;
}): Map<string, string>;
declare function createSessionCatalogAdoptionCoordinator<TResult extends {
  sessionKey: string;
}>(): (params: {
  sourceKey: string;
  findExisting: () => string | undefined;
  create: () => Promise<{
    sessionKey: string;
  }>;
  complete: (continued: {
    sessionKey: string;
  }) => Promise<TResult>;
}) => Promise<TResult>;
//#endregion
//#region src/plugins/types.mcp-connection.d.ts
/** Plugin-owned MCP server connection resolver contracts. */
/**
 * Trusted runtime identity for per-requester MCP connection resolution.
 * Only host-provided fields; plugins must not invent sender identity.
 * Future trusted fields (for example cron/subagent user context) can be added additively.
 */
type McpServerConnectionResolveContext = {
  /** Trusted message sender id. Required; runs without one fail closed. */requesterSenderId: string; /** Channel account id that received the message. */
  agentAccountId?: string; /** Message channel id (for example telegram or slack). */
  messageChannel?: string;
};
/** Transport connection resolved for one requester-scoped MCP server. */
type McpServerConnectionResolved = {
  url: string; /** Per-user credentials; never logged, fingerprinted, or persisted by core. */
  headers?: Record<string, string>;
};
/**
 * Plugin-owned connection resolver for a statically declared MCP server.
 * Server name/tool surface stay static; only the transport is requester-bound.
 */
type OpenClawPluginMcpServerConnectionResolver = {
  /** Server name matching `mcp.servers` / bundle MCP declaration. */serverName: string;
  resolve: (ctx: McpServerConnectionResolveContext) => McpServerConnectionResolved | null | Promise<McpServerConnectionResolved | null>;
};
/** Registry entry for a plugin MCP server connection resolver. */
type PluginMcpServerConnectionResolverRegistration = {
  pluginId: string;
  pluginName?: string;
  resolver: OpenClawPluginMcpServerConnectionResolver;
  source: string;
  rootDir?: string;
};
//#endregion
//#region src/plugins/registry-types.d.ts
type ChannelPlugin$2 = ChannelPlugin$3;
type CliBackendPlugin = CliBackendPlugin$1;
type ImageGenerationProviderPlugin = ImageGenerationProviderPlugin$1;
type MediaUnderstandingProviderPlugin = MediaUnderstandingProviderPlugin$1;
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type MusicGenerationProviderPlugin = MusicGenerationProviderPlugin$1;
type OpenClawPluginCliRootCommandDescriptor$1 = OpenClawPluginCliRootCommandDescriptor;
type OpenClawPluginCliRegistrar$1 = OpenClawPluginCliRegistrar;
type OpenClawPluginCommandDefinition$1 = OpenClawPluginCommandDefinition;
type PluginInteractiveHandlerRegistration$1 = PluginInteractiveHandlerRegistration;
type OpenClawPluginGatewayRuntimeScopeSurface$1 = OpenClawPluginGatewayRuntimeScopeSurface;
type OpenClawGatewayDiscoveryService$1 = OpenClawGatewayDiscoveryService;
type OpenClawPluginHttpRouteHandler$1 = OpenClawPluginHttpRouteHandler;
type OpenClawPluginHttpRouteMatch$1 = OpenClawPluginHttpRouteMatch;
type OpenClawPluginHostedMediaResolver$1 = OpenClawPluginHostedMediaResolver;
type OpenClawPluginReloadRegistration$1 = OpenClawPluginReloadRegistration;
type OpenClawPluginSecurityAuditCollector$1 = OpenClawPluginSecurityAuditCollector;
type OpenClawPluginService$1 = OpenClawPluginService;
type OpenClawPluginToolFactory$1 = OpenClawPluginToolFactory;
type PluginConversationBindingResolvedEvent = PluginConversationBindingResolvedEvent$1;
type TypedPluginHookRegistration = PluginHookRegistration$1;
type PluginLogger$1 = PluginLogger;
type PluginOrigin = PluginOrigin$1;
type PluginTextTransformRegistration$1 = PluginTextTransformRegistration;
type MigrationProviderPlugin$1 = MigrationProviderPlugin;
type ProviderPlugin$1 = ProviderPlugin;
type RealtimeTranscriptionProviderPlugin = RealtimeTranscriptionProviderPlugin$1;
type RealtimeVoiceProviderPlugin = RealtimeVoiceProviderPlugin$1;
type SpeechProviderPlugin = SpeechProviderPlugin$1;
type VideoGenerationProviderPlugin = VideoGenerationProviderPlugin$1;
type WebFetchProviderPlugin$1 = WebFetchProviderPlugin;
type WebSearchProviderPlugin$1 = WebSearchProviderPlugin;
type WorkerProvider = WorkerProvider$1;
type UnifiedModelCatalogProviderPlugin$1 = UnifiedModelCatalogProviderPlugin;
/** Agent tool factory registered by one plugin runtime. */
type PluginToolRegistration = {
  pluginId: string;
  pluginName?: string;
  factory: OpenClawPluginToolFactory$1;
  names: string[];
  declaredNames?: string[];
  optional: boolean; /** Loader-owned provenance. Missing values are conservative legacy registrations. */
  origin?: PluginOrigin;
  source: string;
  rootDir?: string;
};
type PluginCliRegistration = {
  pluginId: string;
  pluginName?: string;
  register: OpenClawPluginCliRegistrar$1;
  parentPath: string[];
  commands: string[];
  descriptors: OpenClawPluginCliRootCommandDescriptor$1[];
  source: string;
  rootDir?: string;
};
/** Gateway HTTP route registered by a plugin runtime. */
type PluginHttpRouteRegistration = {
  pluginId?: string;
  path: string;
  handler: OpenClawPluginHttpRouteHandler$1;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match: OpenClawPluginHttpRouteMatch$1;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface$1;
  gatewayMethodDispatchAllowed?: boolean;
  nodeCapability?: {
    surface: string;
    ttlMs?: number;
  };
  source?: string;
};
type PluginHostedMediaResolverRegistration = {
  pluginId: string;
  pluginName?: string;
  resolver: OpenClawPluginHostedMediaResolver$1;
  source: string;
  rootDir?: string;
};
type PluginChannelRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin$2; /** Exact record-bound runtime resolver captured when the active plugin registered the channel. */
  resolveChannelRuntime?: () => PluginRuntime["channel"]; /** Loader-owned provenance. Missing values are conservative legacy registrations. */
  origin?: PluginOrigin;
  source: string;
  rootDir?: string;
};
type PluginChannelSetupRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin$2; /** Loader-owned provenance. Missing values are conservative legacy registrations. */
  origin?: PluginOrigin;
  source: string;
  enabled: boolean;
  rootDir?: string;
};
type PluginProviderRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: ProviderPlugin$1;
  source: string;
  rootDir?: string;
};
type PluginModelCatalogProviderRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: UnifiedModelCatalogProviderPlugin$1;
  source: string;
  rootDir?: string;
};
type PluginSessionCatalogRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: SessionCatalogProvider;
  source: string;
  rootDir?: string;
};
type PluginDashboardDataBindingRegistration = PluginManifestDashboardDataBinding & {
  pluginId: string;
  capabilityId: string;
  handler: GatewayRequestHandlers[string];
};
type PluginDashboardActionVerbRegistration = PluginManifestDashboardActionVerb & {
  pluginId: string;
  capabilityId: string;
  handler: GatewayRequestHandlers[string];
};
type PluginCliBackendRegistration = {
  pluginId: string;
  pluginName?: string;
  builtWithOpenClawVersion?: string;
  backend: CliBackendPlugin;
  source: string;
  rootDir?: string;
};
type PluginTextTransformsRegistration = {
  pluginId: string;
  pluginName?: string;
  transforms: PluginTextTransformRegistration$1;
  source: string;
  rootDir?: string;
};
type PluginOwnedProviderRegistration<T extends {
  id: string;
}> = {
  pluginId: string;
  pluginName?: string;
  provider: T;
  source: string;
  rootDir?: string;
};
type PluginSpeechProviderRegistration = PluginOwnedProviderRegistration<SpeechProviderPlugin>;
type PluginEmbeddingProviderRegistration = PluginOwnedProviderRegistration<EmbeddingProviderAdapter>;
type PluginRealtimeTranscriptionProviderRegistration = PluginOwnedProviderRegistration<RealtimeTranscriptionProviderPlugin>;
type PluginRealtimeVoiceProviderRegistration = PluginOwnedProviderRegistration<RealtimeVoiceProviderPlugin>;
type PluginMediaUnderstandingProviderRegistration = PluginOwnedProviderRegistration<MediaUnderstandingProviderPlugin>;
type PluginTranscriptsSourceProviderRegistration = PluginOwnedProviderRegistration<TranscriptSourceProvider>;
type PluginImageGenerationProviderRegistration = PluginOwnedProviderRegistration<ImageGenerationProviderPlugin>;
type PluginVideoGenerationProviderRegistration = PluginOwnedProviderRegistration<VideoGenerationProviderPlugin>;
type PluginMusicGenerationProviderRegistration = PluginOwnedProviderRegistration<MusicGenerationProviderPlugin>;
type PluginWebFetchProviderRegistration = PluginOwnedProviderRegistration<WebFetchProviderPlugin$1>;
type PluginWebSearchProviderRegistration = PluginOwnedProviderRegistration<WebSearchProviderPlugin$1>;
type PluginWorkerProviderRegistration = PluginOwnedProviderRegistration<WorkerProvider>;
type PluginMigrationProviderRegistration = PluginOwnedProviderRegistration<MigrationProviderPlugin$1>;
type PluginMemoryEmbeddingProviderRegistration = PluginOwnedProviderRegistration<MemoryEmbeddingProviderAdapter>;
type PluginCodexAppServerExtensionFactoryRegistration = {
  pluginId: string;
  pluginName?: string;
  rawFactory: CodexAppServerExtensionFactory;
  factory: CodexAppServerExtensionFactory;
  source: string;
  rootDir?: string;
};
type PluginAgentToolResultMiddlewareRegistration = {
  pluginId: string;
  pluginName?: string;
  rawHandler: AgentToolResultMiddleware;
  handler: AgentToolResultMiddleware;
  runtimes: AgentToolResultMiddlewareRuntime[];
  scopes?: AgentToolResultMiddlewareScope[];
  source: string;
  rootDir?: string;
};
type PluginAgentToolResultMiddlewareOwner = {
  pluginId: string;
  runtimes: AgentToolResultMiddlewareRuntime[];
  manifest: PluginManifestRecord;
};
type PluginAgentHarnessRegistration = {
  pluginId: string;
  pluginName?: string;
  harness: AgentHarness;
  source: string;
  rootDir?: string;
};
type PluginHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};
type PluginServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawPluginService$1;
  source: string;
  origin: PluginOrigin;
  trustedOfficialInstall?: boolean;
  rootDir?: string;
};
type PluginGatewayDiscoveryServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawGatewayDiscoveryService$1;
  source: string;
  rootDir?: string;
};
type PluginReloadRegistration = {
  pluginId: string;
  pluginName?: string;
  registration: OpenClawPluginReloadRegistration$1;
  source: string;
  rootDir?: string;
};
type PluginNodeHostCommandRegistration = {
  pluginId: string;
  pluginName?: string;
  command: OpenClawPluginNodeHostCommand;
  source: string;
  rootDir?: string;
};
type PluginNodeInvokePolicyRegistration = {
  pluginId: string;
  pluginName?: string;
  policy: OpenClawPluginNodeInvokePolicy;
  pluginConfig?: Record<string, unknown>;
  source: string;
  rootDir?: string;
};
type PluginSecurityAuditCollectorRegistration = {
  pluginId: string;
  pluginName?: string;
  collector: OpenClawPluginSecurityAuditCollector$1;
  source: string;
  rootDir?: string;
};
type PluginCommandRegistration = {
  pluginId: string;
  pluginName?: string;
  command: OpenClawPluginCommandDefinition$1;
  source: string;
  rootDir?: string;
  trustedOwnerStatusExposure?: true;
};
type PluginLegacyInternalHookRegistration = {
  pluginId: string;
  name: string;
  event: string;
  handler: InternalHookHandler;
};
type PluginSessionDiscussionRegistration = {
  pluginId: string;
  provider: SessionDiscussionProvider;
};
type PluginInteractiveHandlerRegistryRegistration = PluginInteractiveHandlerRegistration$1 & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
type PluginSessionExtensionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  extension: PluginSessionExtensionRegistration;
  source: string;
  rootDir?: string;
};
type PluginTrustedToolPolicyRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  policy: PluginTrustedToolPolicyRegistration;
  origin?: PluginRecord["origin"];
  source: string;
  rootDir?: string;
};
type PluginToolMetadataRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  metadata: PluginToolMetadataRegistration;
  source: string;
  rootDir?: string;
};
type PluginControlUiDescriptorRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  descriptor: PluginControlUiDescriptor;
  source: string;
  rootDir?: string;
};
type PluginRuntimeLifecycleRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  lifecycle: PluginRuntimeLifecycleRegistration;
  source: string;
  rootDir?: string;
};
type PluginAgentEventSubscriptionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  subscription: PluginAgentEventSubscriptionRegistration;
  source: string;
  rootDir?: string;
};
type PluginSessionSchedulerJobRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  job: PluginSessionSchedulerJobRegistration;
  generation?: number;
  source: string;
  rootDir?: string;
};
type PluginSessionActionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  action: PluginSessionActionRegistration;
  source: string;
  rootDir?: string;
};
type PluginConversationBindingResolvedHandlerRegistration = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  handler: (event: PluginConversationBindingResolvedEvent) => void | Promise<void>;
  source: string;
  rootDir?: string;
};
type PluginRecord = {
  id: string;
  name: string;
  packageVersion?: string;
  version?: string;
  builtWithOpenClawVersion?: string;
  packageName?: string;
  description?: string;
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  bundleCapabilities?: string[];
  kind?: PluginKind | PluginKind[];
  source: string;
  rootDir?: string;
  origin: PluginOrigin;
  workspaceDir?: string;
  trustedOfficialInstall?: boolean;
  enabled: boolean;
  explicitlyEnabled?: boolean;
  activated?: boolean;
  imported?: boolean;
  compat?: readonly PluginCompatCode[];
  activationSource?: PluginActivationSource;
  activationReason?: string;
  status: "loaded" | "disabled" | "error";
  error?: string;
  failedAt?: Date;
  failurePhase?: "validation" | "load" | "register";
  toolNames: string[];
  hookNames: string[];
  channelIds: string[];
  cliBackendIds: string[];
  providerIds: string[];
  syntheticAuthRefs?: string[];
  embeddingProviderIds: string[];
  speechProviderIds: string[];
  realtimeTranscriptionProviderIds: string[];
  realtimeVoiceProviderIds: string[];
  mediaUnderstandingProviderIds: string[];
  transcriptSourceProviderIds: string[];
  imageGenerationProviderIds: string[];
  videoGenerationProviderIds: string[];
  musicGenerationProviderIds: string[];
  webFetchProviderIds: string[];
  webSearchProviderIds: string[];
  migrationProviderIds: string[];
  contextEngineIds?: string[];
  memoryEmbeddingProviderIds: string[];
  agentHarnessIds: string[];
  cliCommands: string[];
  services: string[];
  gatewayDiscoveryServiceIds: string[];
  commands: string[];
  httpRoutes: number;
  hookCount: number;
  configSchema: boolean;
  configUiHints?: Record<string, PluginConfigUiHint>;
  configJsonSchema?: JsonSchemaObject;
  contracts?: PluginManifestContracts;
  dashboard?: PluginManifestDashboard;
  mcpServers?: Record<string, PluginManifestMcpServer>;
  memorySlotSelected?: boolean;
  dependencyStatus?: PluginDependencyStatus;
};
type PluginRegistry = {
  plugins: PluginRecord[];
  tools: PluginToolRegistration[];
  hooks: PluginHookRegistration[];
  typedHooks: TypedPluginHookRegistration[];
  channels: PluginChannelRegistration[];
  channelSetups: PluginChannelSetupRegistration[];
  providers: PluginProviderRegistration[];
  modelCatalogProviders: PluginModelCatalogProviderRegistration[];
  sessionCatalogs: PluginSessionCatalogRegistration[];
  cliBackends: PluginCliBackendRegistration[];
  textTransforms: PluginTextTransformsRegistration[];
  embeddingProviders: PluginEmbeddingProviderRegistration[];
  speechProviders: PluginSpeechProviderRegistration[];
  realtimeTranscriptionProviders: PluginRealtimeTranscriptionProviderRegistration[];
  realtimeVoiceProviders: PluginRealtimeVoiceProviderRegistration[];
  mediaUnderstandingProviders: PluginMediaUnderstandingProviderRegistration[];
  transcriptSourceProviders: PluginTranscriptsSourceProviderRegistration[];
  imageGenerationProviders: PluginImageGenerationProviderRegistration[];
  videoGenerationProviders: PluginVideoGenerationProviderRegistration[];
  musicGenerationProviders: PluginMusicGenerationProviderRegistration[];
  webFetchProviders: PluginWebFetchProviderRegistration[];
  webSearchProviders: PluginWebSearchProviderRegistration[];
  workerProviders: Map<string, PluginWorkerProviderRegistration>;
  migrationProviders: PluginMigrationProviderRegistration[];
  codexAppServerExtensionFactories: PluginCodexAppServerExtensionFactoryRegistration[];
  agentToolResultMiddlewareOwners: PluginAgentToolResultMiddlewareOwner[];
  agentToolResultMiddlewares: PluginAgentToolResultMiddlewareRegistration[];
  memoryEmbeddingProviders: PluginMemoryEmbeddingProviderRegistration[];
  agentHarnesses: PluginAgentHarnessRegistration[];
  pluginRuntimeArtifacts: Map<string, ResolvedPluginRuntimeArtifact>;
  compactionProviders: RegisteredCompactionProvider[];
  detachedTaskRuntimes: DetachedTaskLifecycleRuntimeRegistration[];
  legacyInternalHooks: PluginLegacyInternalHookRegistration[];
  memoryCapabilities: MemoryPluginCapabilityRegistration[];
  memoryCorpusSupplements: MemoryCorpusSupplementRegistration[];
  memoryPromptPreparations: MemoryPromptPreparationRegistration[];
  memoryPromptSupplements: MemoryPromptSupplementRegistration[];
  sessionDiscussionProviders: Map<string, PluginSessionDiscussionRegistration>;
  contextEngines: Map<string, ContextEngineRegistration>;
  gatewayHandlers: GatewayRequestHandlers;
  gatewayMethodDescriptors: GatewayMethodDescriptor[];
  dashboardDataBindings: Map<string, PluginDashboardDataBindingRegistration>;
  dashboardActionVerbs: Map<string, PluginDashboardActionVerbRegistration>;
  coreGatewayMethodNames: string[];
  httpRoutes: PluginHttpRouteRegistration[];
  hostedMediaResolvers: PluginHostedMediaResolverRegistration[];
  mcpServerConnectionResolvers: PluginMcpServerConnectionResolverRegistration[];
  cliRegistrars: PluginCliRegistration[];
  reloads: PluginReloadRegistration[];
  nodeHostCommands: PluginNodeHostCommandRegistration[];
  nodeInvokePolicies: PluginNodeInvokePolicyRegistration[];
  securityAuditCollectors: PluginSecurityAuditCollectorRegistration[];
  services: PluginServiceRegistration[];
  gatewayDiscoveryServices: PluginGatewayDiscoveryServiceRegistration[];
  commands: PluginCommandRegistration[];
  interactiveHandlers: PluginInteractiveHandlerRegistryRegistration[];
  sessionExtensions: PluginSessionExtensionRegistryRegistration[];
  trustedToolPolicies: PluginTrustedToolPolicyRegistryRegistration[];
  toolMetadata: PluginToolMetadataRegistryRegistration[];
  controlUiDescriptors: PluginControlUiDescriptorRegistryRegistration[];
  runtimeLifecycles: PluginRuntimeLifecycleRegistryRegistration[];
  agentEventSubscriptions: PluginAgentEventSubscriptionRegistryRegistration[];
  sessionSchedulerJobs: PluginSessionSchedulerJobRegistryRegistration[];
  sessionActions: PluginSessionActionRegistryRegistration[];
  conversationBindingResolvedHandlers: PluginConversationBindingResolvedHandlerRegistration[];
  diagnostics: PluginDiagnostic[];
};
type PluginRegistryParams = {
  logger: PluginLogger$1;
  coreGatewayHandlers?: GatewayRequestHandlers;
  coreGatewayMethodNames?: readonly string[];
  runtime: PluginRuntime; /** Process-owner policy for registering catalogs that may fall back to HOME. */
  allowProcessHomeSessionCatalogs?: boolean;
  hostServices?: {
    /** May be a live accessor; plugin APIs must read it at call time. */cron?: CronServiceContract;
  };
  activateGlobalSideEffects?: boolean;
};
//#endregion
//#region src/plugins/prepared-message-tool-catalog.d.ts
type PreparedMessageToolCatalogEntry = Readonly<{
  id: string;
  actions?: ChannelMessageActionAdapter;
  reconcilesUnknownSend: boolean;
}>;
type PreparedMessageToolCatalog = Readonly<{
  version: number;
  channels: readonly PreparedMessageToolCatalogEntry[];
  getChannel: (id: string) => PreparedMessageToolCatalogEntry | undefined;
}>;
//#endregion
//#region src/plugins/capability-provider-runtime.d.ts
declare function prepareMediaCapabilityProviders(params: {
  cfg?: OpenClawConfig;
  pluginMetadataSnapshot: Pick<PluginMetadataSnapshot, "index" | "plugins">;
  registry?: PluginRegistry;
}): Readonly<{
  mediaUnderstandingProviders: readonly MediaUnderstandingProvider[] | undefined;
  imageGenerationProviders: readonly ImageGenerationProvider[] | undefined;
  videoGenerationProviders: readonly VideoGenerationProvider[] | undefined;
  musicGenerationProviders: readonly MusicGenerationProvider[] | undefined;
}>;
//#endregion
//#region src/plugins/provider-catalog.types.d.ts
type ProviderCatalogOrder = "simple" | "profile" | "paired" | "late";
type ProviderCatalogContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  resolveProviderApiKey: (providerId?: string) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
  };
  resolveProviderAuth: (providerId?: string, options?: {
    oauthMarker?: string;
  }) => {
    apiKey: string | undefined;
    discoveryApiKey?: string;
    mode: "api_key" | "aws-sdk" | "oauth" | "token" | "none";
    source: "env" | "profile" | "none";
    profileId?: string;
  };
};
type ProviderCatalogResult = {
  provider: ModelProviderConfig;
  outcomes?: readonly ProviderCatalogOutcome[];
} | {
  providers: Record<string, ModelProviderConfig>;
  outcomes?: readonly ProviderCatalogOutcome[];
} | null | undefined;
type ProviderPluginCatalog = {
  order?: ProviderCatalogOrder;
  run: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
};
type UnifiedModelCatalogProviderContext = ProviderCatalogContext & {
  signal?: AbortSignal;
  includeLive?: boolean;
  timeoutMs?: number;
};
type UnifiedModelCatalogProviderPlugin = {
  provider: string;
  kinds: readonly UnifiedModelCatalogKind[];
  staticCatalog?: (ctx: UnifiedModelCatalogProviderContext) => readonly UnifiedModelCatalogEntry[] | Promise<readonly UnifiedModelCatalogEntry[] | null | undefined> | null | undefined;
  liveCatalog?: (ctx: UnifiedModelCatalogProviderContext) => readonly UnifiedModelCatalogEntry[] | Promise<readonly UnifiedModelCatalogEntry[] | null | undefined> | null | undefined;
};
/**
 * Built-in model suppression hook context.
 *
 * @deprecated Use manifest `modelCatalog.suppressions`. Runtime suppression
 * hooks are no longer called by model resolution.
 */
type ProviderBuiltInModelSuppressionContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  baseUrl?: string;
};
type ProviderBuiltInModelSuppressionResult = {
  suppress: boolean;
  errorMessage?: string;
};
/**
 * Provider-owned "modern model" policy input.
 *
 * Live smoke/model-profile selection uses this to keep provider-specific
 * inclusion/exclusion rules out of core.
 */
type ProviderModernModelPolicyContext = {
  provider: string;
  modelId: string;
};
/**
 * Final catalog augmentation hook.
 *
 * Runs after OpenClaw loads the discovered model catalog and merges configured
 * opt-in providers. Use this for forward-compat rows or vendor-owned synthetic
 * entries that should appear in `models list` and model pickers even when the
 * upstream registry has not caught up yet.
 */
type ProviderAugmentModelCatalogContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  resolveProviderApiKey?: ProviderCatalogContext["resolveProviderApiKey"];
  entries: ModelCatalogEntry[];
};
//#endregion
//#region src/plugins/provider-runtime-model.types.d.ts
/**
 * Fully-resolved runtime model shape used after provider/plugin-owned
 * discovery, overrides, and compat normalization.
 */
type ProviderRuntimeModel = Omit<Model, "compat"> & {
  compat?: ModelCompatConfig;
  contextTokens?: number; /** Host-resolved provenance for the top-level wire output cap. */
  maxTokensSource?: "configured" | "discovered";
  params?: Record<string, unknown>;
  requestTimeoutMs?: number;
  mediaInput?: ModelMediaInputConfig;
};
//#endregion
//#region src/agents/agent-auth-credential-modes.d.ts
/** Secret-free credential modes captured by a prepared agent runtime. */
type PreparedAgentCredentialModes = Readonly<Record<string, "api_key" | "oauth" | "token">>;
//#endregion
//#region src/agents/embedded-agent-runner/model.inline-provider.d.ts
/**
 * Normalizes inline `models.providers` config into runtime model entries.
 */
type InlineModelEntry = Omit<ModelDefinitionConfig, "api"> & {
  api?: Api;
  provider: string;
  baseUrl?: string;
  headers?: Record<string, string>;
};
//#endregion
//#region src/agents/prepared-model-runtime.configured.d.ts
type PreparedConfiguredRuntimeModel = Readonly<{
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
}>;
//#endregion
//#region src/agents/prepared-model-runtime.types.d.ts
type PreparedModelRuntimeSnapshot = Readonly<{
  agentId?: string;
  agentDir: string;
  inheritedAuthDir?: string;
  workspaceDir?: string; /** Run-prepared repository root; null means discovery completed without a match. */
  repoRoot?: string | null; /** Stable identity derived from repoRoot; null means the run is outside a repository. */
  projectKey?: string | null; /** Session active project set, ordered most-recent first; empty before run binding. */
  activeProjectKeys: readonly string[];
  config: OpenClawConfig; /** Secret-free usable auth modes captured by this exact lifecycle generation. */
  authModes: PreparedAgentCredentialModes;
  metadataSnapshot: PluginMetadataSnapshot;
  messageToolCatalog?: PreparedMessageToolCatalog;
  mediaCapabilityProviders?: ReturnType<typeof prepareMediaCapabilityProviders>; /** Registry value owned by this generation; omitted from read-only/static-catalog builds. */
  pluginRegistry?: PluginRegistry;
  allowGatewaySubagentBinding: boolean;
  /**
   * Configured model projection used by turn admission and synchronous callers.
   * Full inventory discovery is deliberately outside the startup publication boundary.
   */
  modelCatalog: ModelCatalogSnapshot; /** Reads a completed full catalog without starting provider discovery. */
  readFullModelCatalog?: () => ModelCatalogSnapshot | undefined; /** Builds this generation's full control-plane catalog without replacing turn facts. */
  loadFullModelCatalog?: (options?: {
    refresh?: boolean;
  }) => Promise<ModelCatalogSnapshot>; /** Full static models for configured refs, resolved once at the lifecycle boundary. */
  configuredRuntimeModels: readonly PreparedConfiguredRuntimeModel[]; /** Inline provider projection prepared once for all resolutions owned by this snapshot. */
  inlineProviderModels: readonly InlineModelEntry[];
  createStores: () => PreparedModelRuntimeStores;
}>;
type PreparedModelRuntimeStores = {
  authStorage: AuthStorage;
  modelRegistry: ModelRegistry$1;
};
//#endregion
//#region src/plugins/provider-replay.types.d.ts
type ProviderReplaySanitizeMode = "full" | "images-only";
type ProviderReplayToolCallIdMode = "strict" | "strict9";
type ProviderReasoningOutputMode = "native" | "tagged";
/**
 * Provider-owned replay/compaction transcript policy.
 *
 * These values are consumed by shared history replay and compaction logic.
 * Return only the fields the provider wants to override; core fills the rest
 * with its default policy.
 */
type ProviderReplayPolicy = {
  sanitizeMode?: ProviderReplaySanitizeMode;
  sanitizeToolCallIds?: boolean;
  toolCallIdMode?: ProviderReplayToolCallIdMode;
  duplicateToolCallIdStyle?: "openai";
  preserveNativeAnthropicToolUseIds?: boolean;
  preserveSignatures?: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  dropThinkingBlocks?: boolean;
  dropReasoningFromHistory?: boolean;
  repairToolUseResultPairing?: boolean;
  applyAssistantFirstOrderingFix?: boolean;
  validateGeminiTurns?: boolean;
  validateAnthropicTurns?: boolean;
  allowSyntheticToolResults?: boolean;
};
/**
 * Provider-owned replay/compaction policy input.
 *
 * Use this when transcript replay rules depend on provider/model transport
 * behavior and should stay with the provider plugin instead of core tables.
 */
type ProviderReplayPolicyContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  provider: string;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
};
type ProviderReplaySessionEntry = {
  customType: string;
  data?: unknown;
};
type ProviderReplaySessionState = {
  getCustomEntries(): ProviderReplaySessionEntry[];
  appendCustomEntry(customType: string, data: unknown): void;
};
/**
 * Provider-owned replay-history sanitization input.
 *
 * Runs after core applies generic transcript cleanup so plugins can make
 * provider-specific replay rewrites without owning the whole compaction flow.
 */
type ProviderSanitizeReplayHistoryContext = ProviderReplayPolicyContext & {
  sessionId: string;
  messages: AgentMessage[];
  allowedToolNames?: Iterable<string>;
  sessionState?: ProviderReplaySessionState;
};
/**
 * Provider-owned final replay-turn validation input.
 *
 * Use this for providers that require strict turn ordering or additional
 * replay-time transcript validation beyond generic sanitation.
 */
type ProviderValidateReplayTurnsContext = ProviderReplayPolicyContext & {
  sessionId?: string;
  messages: AgentMessage[];
  sessionState?: ProviderReplaySessionState;
};
/**
 * Provider-owned tool-schema normalization input.
 *
 * Runs before tool registration for replay/compaction/inference so providers
 * can rewrite schema keywords that their transport family does not support.
 */
type ProviderNormalizeToolSchemasContext = ProviderReplayPolicyContext & {
  tools: AnyAgentTool[];
};
type ProviderToolSchemaDiagnostic = {
  toolName: string;
  toolIndex?: number;
  violations: string[];
};
/**
 * Provider-owned reasoning output mode input.
 *
 * Use this when a provider requires a specific reasoning-output contract, such
 * as text tags instead of native structured reasoning fields.
 */
type ProviderReasoningOutputModeContext = ProviderReplayPolicyContext;
//#endregion
//#region src/agents/provider-request-config.d.ts
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides$1 = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
/** Attaches model-scoped provider request transport metadata without mutating the model. */
declare function attachModelProviderRequestTransport<TModel extends object>(model: TModel, request: ModelProviderRequestTransportOverrides$1 | undefined): TModel;
/** Reads provider request transport metadata attached to a model definition. */
declare function getModelProviderRequestTransport(model: object): ModelProviderRequestTransportOverrides$1 | undefined;
//#endregion
//#region src/agents/system-prompt-contribution.d.ts
/**
 * Provider-owned system prompt contribution types.
 * Separates cache-stable prefixes, dynamic suffixes, and section overrides for
 * runtime prompt assembly.
 */
/** Core system-prompt sections that providers may replace. */
type ProviderSystemPromptSectionId = "interaction_style" | "tool_call_style" | "execution_bias";
/** Provider guidance merged into the assembled agent system prompt. */
type ProviderSystemPromptContribution = {
  /**
   * Cache-stable provider guidance inserted above the system-prompt cache boundary.
   *
   * Use this for static provider/model-family instructions that should preserve
   * KV cache reuse across turns.
   */
  stablePrefix?: string;
  /**
   * Provider guidance inserted below the cache boundary.
   *
   * Use this only for genuinely dynamic text that is expected to vary across
   * runs or sessions.
   */
  dynamicSuffix?: string;
  /**
   * Whole-section replacements for selected core prompt sections.
   *
   * Values should contain the complete rendered section, including any desired
   * heading such as `## Tool Call Style`.
   */
  sectionOverrides?: Partial<Record<ProviderSystemPromptSectionId, string>>;
};
//#endregion
//#region src/llm/model-registry.d.ts
/** Registry abstraction used by model pickers and provider availability checks. */
type ModelRegistry = {
  getAll(): Model[];
  getAvailable(): Model[];
  find(provider: string, modelId: string): Model | undefined;
  hasConfiguredAuth(model: Model): boolean;
};
//#endregion
//#region src/plugins/provider-external-auth.types.d.ts
type ProviderAuthOptionBag = {
  token?: string;
  tokenProvider?: string;
  secretInputMode?: SecretInputMode;
  [key: string]: unknown;
};
/** Context for resolving synthetic provider credentials from config. */
type ProviderResolveSyntheticAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
/** Synthetic provider credential returned by plugin auth helpers. */
type ProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: Exclude<ModelProviderAuthMode, "aws-sdk">;
  expiresAt?: number;
};
/** Context for resolving external provider auth profiles. */
type ProviderResolveExternalAuthProfilesContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  store: AuthProfileStore;
};
/** External auth profile credential resolved for a provider. */
type ProviderExternalAuthProfile = {
  profileId: string;
  credential: OAuthCredential;
  persistence?: "runtime-only" | "persisted";
};
//#endregion
//#region src/plugins/provider-oauth-flow.d.ts
/** Prompt payload used when OAuth flow code entry needs user input. */
type OAuthPrompt = {
  message: string;
  placeholder?: string;
};
/** Creates OAuth callbacks that use local browser auth locally and manual code entry on VPS hosts. */
declare function createVpsAwareOAuthHandlers(params: {
  isRemote: boolean;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  spin: ReturnType<WizardPrompter["progress"]>;
  openUrl: (url: string) => Promise<unknown>;
  localBrowserMessage: string;
  manualPromptMessage?: string;
  manualPromptSignal?: AbortSignal;
}): {
  onAuth: (event: {
    url: string;
  }) => Promise<void>;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
};
//#endregion
//#region src/plugins/provider-authentication.types.d.ts
type ProviderAuthKind = "oauth" | "api_key" | "token" | "device_code" | "custom";
/** Standard result payload returned by provider auth methods. */
type ProviderAuthResult = {
  profiles: Array<{
    profileId: string;
    credential: AuthProfileCredential;
  }>;
  /**
   * Optional config patch to merge after credentials are written.
   *
   * Use this for provider-owned onboarding defaults such as
   * `models.providers.<id>` entries, default aliases, or agent model helpers.
   * The caller still persists auth-profile bindings separately.
   */
  configPatch?: Partial<OpenClawConfig>;
  defaultModel?: string;
  notes?: string[];
  /**
   * Opt in to replace `agents.defaults.models` wholesale with the patch map.
   * Default behavior merges the map so other providers' entries survive.
   * Set only from migrations that intentionally rename/remove model keys.
   */
  replaceDefaultModels?: boolean;
};
/** Interactive auth context passed to provider login/setup methods. */
type ProviderAuthContext = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  agentDir?: string;
  workspaceDir?: string;
  prompter: WizardPrompter;
  runtime: RuntimeEnv; /** Cancels browser callbacks, device polling, and other app-owned auth work. */
  signal?: AbortSignal;
  /**
   * Optional onboarding CLI options that triggered this auth flow.
   *
   * Present for setup/configure/auth-choice flows so provider methods can
   * honor preseeded flags like `--openai-api-key` or generic
   * `--token/--token-provider` pairs. Direct `models auth login` usually
   * leaves this undefined.
   */
  opts?: ProviderAuthOptionBag;
  /**
   * Onboarding secret persistence preference.
   *
   * Interactive wizard flows set this when the caller explicitly requested
   * plaintext or env/file/exec/store ref storage. Ad-hoc `models auth login` flows
   * usually leave it undefined.
   */
  secretInputMode?: SecretInputMode;
  /**
   * Whether the provider auth flow should offer the onboarding secret-storage
   * mode picker when `secretInputMode` is unset.
   *
   * This is true for onboarding/configure flows and false for direct
   * `models auth` commands, which should keep a tighter, provider-owned prompt
   * surface.
   */
  allowSecretRefPrompt?: boolean;
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  oauth: {
    createVpsAwareHandlers: typeof createVpsAwareOAuthHandlers;
  };
};
type ProviderNonInteractiveApiKeyResult = {
  key: string;
  source: "profile" | "env" | "flag";
  envVarName?: string;
};
type ProviderResolveNonInteractiveApiKeyParams = {
  provider: string;
  flagValue?: string;
  flagName: `--${string}`;
  envVar: string;
  envVarName?: string;
  allowProfile?: boolean;
  required?: boolean;
};
type ProviderNonInteractiveApiKeyCredentialParams = {
  provider: string;
  resolved: ProviderNonInteractiveApiKeyResult;
  email?: string;
  metadata?: Record<string, string>;
};
type ProviderAuthMethodNonInteractiveContext = {
  authChoice: string;
  config: OpenClawConfig;
  baseConfig: OpenClawConfig;
  opts: ProviderAuthOptionBag;
  runtime: RuntimeEnv;
  agentDir?: string;
  workspaceDir?: string;
  resolveApiKey: (params: ProviderResolveNonInteractiveApiKeyParams) => Promise<ProviderNonInteractiveApiKeyResult | null>;
  toApiKeyCredential: (params: ProviderNonInteractiveApiKeyCredentialParams) => ApiKeyCredential | null;
};
type ProviderAuthMethodNonInteractiveValidationContext = Omit<ProviderAuthMethodNonInteractiveContext, "toApiKeyCredential">;
/** Read-only context for app-guided discovery of already available inference. */
type ProviderAppGuidedSetupContext = {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  workspaceDir?: string;
  signal?: AbortSignal;
};
type ProviderAppGuidedSetupCandidate = {
  /** Canonical provider/model reference returned unchanged during activation. */modelRef: string; /** Optional provider-owned detail shown beside the auth-choice label. */
  detail?: string;
};
type ProviderAppGuidedSetup = {
  /**
   * Report whether the provider's local service is reachable, even when no
   * model is suitable for automatic activation. This probe must be read-only.
   */
  detectAvailability?: (ctx: ProviderAppGuidedSetupContext) => Promise<boolean>; /** Detection is read-only: no model pull, download, login, or config write. */
  detect: (ctx: ProviderAppGuidedSetupContext) => Promise<ProviderAppGuidedSetupCandidate | null>; /** Recheck one detected model and return the config required for a live probe. */
  prepare: (ctx: ProviderAppGuidedSetupContext & {
    modelRef: string;
  }) => Promise<ProviderAuthResult | null>;
};
type ProviderAuthMethod = {
  id: string;
  label: string;
  hint?: string;
  kind: ProviderAuthKind; /** Provider-owned model used to validate app-guided secret setup. */
  starterModel?: string;
  /**
   * Optional wizard/onboarding metadata for this specific auth method.
   *
   * Use this when one provider exposes multiple setup entries (for example API
   * key + OAuth, or region-specific login flows). OpenClaw uses this to expose
   * method-specific auth choices while keeping the provider id stable.
   */
  wizard?: ProviderPluginWizardSetup;
  run: (ctx: ProviderAuthContext) => Promise<ProviderAuthResult>;
  runNonInteractive?: (ctx: ProviderAuthMethodNonInteractiveContext) => Promise<OpenClawConfig | null>; /** Side-effect-free prerequisite validation used before destructive reset handling. */
  validateNonInteractive?: (ctx: ProviderAuthMethodNonInteractiveValidationContext) => Promise<boolean>; /** Provider-owned local model discovery for the shared guided setup ladder. */
  appGuidedSetup?: ProviderAppGuidedSetup;
};
type ProviderPluginWizardSetup = {
  choiceId?: string;
  choiceLabel?: string;
  choiceHint?: string;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
  onboardingFeatured?: boolean;
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  methodId?: string;
  /**
   * Interactive onboarding surfaces where this auth choice should appear.
   * Defaults to `["text-inference"]` when omitted.
   */
  onboardingScopes?: Array<"text-inference" | "image-generation" | "music-generation">;
  /**
   * Optional model-allowlist prompt policy applied after this auth choice is
   * selected in configure/onboarding flows.
   *
   * Keep this UI-facing and static. Provider logic that needs runtime state
   * should stay in `run`/`runNonInteractive`.
   */
  modelAllowlist?: {
    allowedKeys?: string[];
    initialSelections?: string[];
    loadCatalog?: boolean;
    message?: string;
  };
  /**
   * Optional default-model prompt policy for this auth/setup choice.
   *
   * Use this when selecting the auth choice should still force a model picker
   * even if the choice was preseeded via CLI/configure, or when "keep current"
   * would skip required provider-owned post-selection work.
   */
  modelSelection?: {
    promptWhenAuthChoiceProvided?: boolean;
    allowKeepCurrent?: boolean;
  };
};
/** Optional model-picker metadata shown in interactive provider selection flows. */
type ProviderPluginWizardModelPicker = {
  label?: string;
  hint?: string;
  methodId?: string;
};
/** UI metadata that lets provider plugins appear in onboarding and configure flows. */
type ProviderPluginWizard = {
  setup?: ProviderPluginWizardSetup;
  modelPicker?: ProviderPluginWizardModelPicker;
};
type ProviderOAuthProfileIdRepair = {
  /**
   * Legacy OAuth profile id to migrate away from.
   *
   * When omitted, OpenClaw falls back to `<provider>:default`.
   */
  legacyProfileId?: string;
  /**
   * Optional custom doctor prompt label.
   *
   * Defaults to the provider label when omitted.
   */
  promptLabel?: string;
};
type ProviderModelSelectedContext = {
  config: OpenClawConfig;
  model: string;
  prompter: WizardPrompter;
  agentDir?: string;
  workspaceDir?: string;
};
type ProviderDeferSyntheticProfileAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
  resolvedApiKey?: string;
};
type ProviderSystemPromptContributionContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  promptMode: PromptMode;
  runtimeChannel?: string;
  runtimeCapabilities?: string[];
  agentId?: string;
  trigger?: "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
};
type ProviderTransformSystemPromptContext = ProviderSystemPromptContributionContext & {
  systemPrompt: string;
};
//#endregion
//#region src/plugins/provider-runtime.types.d.ts
type ModelProviderRequestTransportOverrides = ModelProviderRequestTransportOverrides$1;
type ProviderRuntimeProviderConfig = {
  baseUrl?: string;
  api?: ModelProviderConfig["api"];
  auth?: ModelProviderConfig["auth"];
  models?: ModelProviderConfig["models"];
  headers?: unknown;
};
/**
 * Sync hook for provider-owned model ids that are not present in the local
 * registry/catalog yet.
 *
 * Use this for pass-through providers or provider-specific forward-compat
 * behavior. The hook should be cheap and side-effect free; async refreshes
 * belong in `prepareDynamicModel`.
 */
type ProviderResolveDynamicModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  agentRuntimeId?: string;
  provider: string;
  modelId: string;
  modelRegistry: ModelRegistry;
  providerConfig?: ProviderRuntimeProviderConfig;
  authProfileId?: string;
  authProfileMode?: AuthProfileCredential["type"] | "aws-sdk";
};
/**
 * Optional async warm-up for dynamic model resolution.
 *
 * Called only from async model resolution paths, before retrying
 * `resolveDynamicModel`. This is the place to refresh caches or fetch provider
 * metadata over the network.
 */
type ProviderPrepareDynamicModelContext = ProviderResolveDynamicModelContext;
type ProviderPreferRuntimeResolvedModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
};
/**
 * Last-chance rewrite hook for provider-owned transport normalization.
 *
 * Runs after OpenClaw resolves an explicit/discovered/dynamic model and before
 * the embedded runner uses it. Typical uses: swap API ids, fix base URLs, or
 * patch provider-specific compat bits.
 */
type ProviderNormalizeResolvedModelContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
};
/**
 * Provider-owned model-id normalization before config/runtime lookup.
 *
 * Use this for provider-specific alias cleanup that should stay with the
 * plugin rather than in core string tables.
 */
type ProviderNormalizeModelIdContext = {
  provider: string;
  modelId: string;
};
/**
 * Provider-owned transport normalization for arbitrary provider/model config.
 *
 * Use this when transport cleanup depends on API/baseUrl rather than the
 * owning provider id, for example custom providers that still target a
 * plugin-owned transport family.
 */
type ProviderNormalizeTransportContext = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  provider: string;
  modelId?: string;
  api?: string | null;
  baseUrl?: string;
};
/**
 * Runtime auth input for providers that need an extra exchange step before
 * inference. The incoming `apiKey` is the raw credential resolved from auth
 * profiles/env/config. The returned value should be the actual token/key to use
 * for the request.
 */
type ProviderPrepareRuntimeAuthContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
  apiKey: string;
  authMode: string;
  profileId?: string;
};
/**
 * Result of `prepareRuntimeAuth`.
 *
 * `apiKey` is required and becomes the runtime credential stored in auth
 * storage. `baseUrl` is optional and lets providers like GitHub Copilot swap to
 * an entitlement-specific endpoint at request time. `expiresAt` enables generic
 * background refresh in long-running turns.
 */
type ProviderPreparedRuntimeAuth = {
  apiKey: string;
  baseUrl?: string;
  request?: ModelProviderRequestTransportOverrides;
  expiresAt?: number;
};
/**
 * Usage/billing auth input for providers that expose quota/usage endpoints.
 *
 * This hook is intentionally separate from `prepareRuntimeAuth`: usage
 * snapshots often need a different credential source than live inference
 * requests, and they run outside the embedded runner.
 *
 * The helper methods cover the common OpenClaw auth resolution paths:
 *
 * - `resolveApiKeyFromConfigAndStore`: env/config/plain token/api_key profiles
 * - `resolveOAuthToken`: oauth/token profiles resolved through the auth store,
 *   optionally for an explicit provider override
 *
 * Plugins can still do extra provider-specific work on top (for example parse a
 * token blob, read a legacy credential file, or pick between aliases).
 */
type ProviderResolveUsageAuthContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  resolveApiKeyFromConfigAndStore: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) => string | undefined; /** Ordered API-key/token candidates, including resolved SecretRefs, for credential classification. */
  resolveApiKeyCandidatesFromConfigAndStore?: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) => Promise<string[]>;
  resolveOAuthToken: (params?: {
    provider?: string;
  }) => Promise<ProviderUsageAuthToken | null>;
};
type ProviderUsageAuthToken = {
  token: string;
  accountId?: string; /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */
  subscriptionType?: string;
  rateLimitTier?: string; /** Account email captured on the resolved credential, when known. */
  email?: string;
};
/**
 * Result of `resolveUsageAuth`.
 *
 * Two shapes are supported:
 * - `{ token: string; accountId?: string }` — use this token for provider usage endpoints.
 * - `{ handled: true }` — this provider handled the request but has no usable
 *   usage token; core must skip further fallback (generic API-key/OAuth fallback
 *   must not run).
 *
 * Returning `null` or `undefined` means "not handled by this provider"; core
 * proceeds to generic fallback resolution.
 */
type ProviderResolvedUsageAuth = ProviderUsageAuthToken | {
  handled: true;
};
/**
 * Usage/quota snapshot input for providers that own their usage endpoint
 * fetch/parsing behavior.
 *
 * This hook runs after `resolveUsageAuth` succeeds. Core still owns summary
 * fan-out, timeout wrapping, filtering, and formatting; the provider plugin
 * owns the provider-specific HTTP request + response normalization.
 */
type ProviderFetchUsageSnapshotContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  token: string;
  accountId?: string;
  authProfileId?: string; /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */
  subscriptionType?: string;
  rateLimitTier?: string; /** Account email captured on the resolved credential, when known. */
  email?: string;
  timeoutMs: number;
  fetchFn: typeof fetch;
};
/**
 * Provider-owned auth-doctor hint input.
 *
 * Called when OAuth refresh fails and OpenClaw wants a provider-specific repair
 * hint to append to the generic re-auth message. Use this for legacy profile-id
 * migrations or other provider-owned auth-store cleanup guidance.
 */
type ProviderAuthDoctorHintContext = {
  config?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  profileId?: string;
};
/**
 * Provider-owned extra-param normalization before OpenClaw builds its generic
 * stream option wrapper.
 *
 * Use this to set provider defaults or rewrite provider-specific config keys
 * into the merged `extraParams` object. Return the full next extraParams object.
 */
/** Provider-facing effort after OpenClaw lowers orchestration-only modes. */
type ProviderTransportThinkingLevel = Exclude<ThinkLevel, "ultra">;
type ProviderPrepareExtraParamsContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  agentId?: string;
  nativeWebSearchAllowedByToolPolicy?: boolean;
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  extraParams?: Record<string, unknown>;
  thinkingLevel?: ProviderTransportThinkingLevel;
};
type ProviderExtraParamsForTransportContext = Omit<ProviderPrepareExtraParamsContext, "extraParams"> & {
  model?: ProviderRuntimeModel;
  transport?: "sse" | "websocket" | "websocket-cached" | "auto";
  extraParams: Record<string, unknown>;
};
type ProviderExtraParamsForTransportResult = {
  patch?: Record<string, unknown> | null;
};
type ProviderResolvePromptOverlayContext = ProviderSystemPromptContributionContext & {
  baseOverlay?: ProviderSystemPromptContribution;
};
type ProviderFollowupFallbackRouteContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  payload: ReplyPayload;
  originatingChannel?: string;
  originatingTo?: string;
  originRoutable: boolean;
  dispatcherAvailable: boolean;
};
type ProviderFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};
type ProviderResolveAuthProfileIdContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  preferredProfileId?: string;
  lockedProfileId?: string;
  profileOrder: string[];
  authStore: AuthProfileStore;
};
//#endregion
//#region src/plugins/provider-transport.types.d.ts
/**
 * Provider-owned transport creation.
 *
 * Use this when the provider needs to replace shared model runtime's default transport with a
 * custom StreamFn (for example a native API transport that cannot be expressed
 * as a wrapper around `streamSimple`).
 */
type ProviderCreateStreamFnContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  model: ProviderRuntimeModel;
};
/**
 * Provider-owned stream wrapper hook after OpenClaw applies its generic
 * transport-independent wrappers.
 *
 * Use this for provider-specific payload/header/model mutations that still run
 * through the normal `shared model runtime` stream path.
 */
type ProviderWrapStreamFnContext = ProviderPrepareExtraParamsContext & {
  model?: ProviderRuntimeModel; /** Wire-format API before simple completion projects an internal transport alias. */
  sourceApi?: ProviderRuntimeModel["api"];
  streamFn?: StreamFn;
};
/**
 * Provider-owned WebSocket session policy.
 */
type ProviderWebSocketSessionPolicy = {
  headers?: Record<string, string>;
  degradeCooldownMs?: number;
};
/**
 * Provider-owned transport turn state.
 *
 * Use this for provider-native request headers or metadata that should stay
 * stable across retries while still being attached by generic core transports.
 */
type ProviderTransportTurnState = {
  headers?: Record<string, string>;
  metadata?: Record<string, string>;
  websocket?: ProviderWebSocketSessionPolicy;
};
/**
 * Provider-owned request identity for transport turns.
 *
 * Use this when the provider exposes native request/session metadata that must
 * be attached by both HTTP and WebSocket transports.
 */
type ProviderResolveTransportTurnStateContext = {
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  sessionId?: string;
  turnId: string;
  attempt: number;
  transport: "stream" | "websocket";
};
/**
 * Provider-owned WebSocket session policy input.
 */
type ProviderResolveWebSocketSessionPolicyContext = {
  provider: string;
  modelId: string;
  model?: ProviderRuntimeModel;
  sessionId?: string;
};
/**
 * Provider-owned failover error classification input.
 *
 * Use this when provider-specific transport or API errors need classification
 * hints that generic string matching cannot express safely.
 */
type ProviderFailoverErrorContext = {
  provider?: string;
  modelId?: string;
  errorMessage: string;
  status?: number;
  code?: string;
  errorType?: string;
};
/**
 * Generic embedding provider shape returned by provider plugins.
 *
 * Keep this aligned with the memory embedding contract without forcing the
 * plugin system to import memory internals directly.
 */
type PluginEmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string, options?: {
    signal?: AbortSignal;
  }) => Promise<number[]>;
  embedBatch: (texts: string[], options?: {
    signal?: AbortSignal;
  }) => Promise<number[][]>;
  embedBatchInputs?: (inputs: unknown[], options?: {
    signal?: AbortSignal;
  }) => Promise<number[][]>;
  client?: unknown;
};
/**
 * Provider-owned embedding transport creation.
 *
 * Use this when a provider wants memory embeddings to live with the provider
 * plugin instead of the core memory switchboard.
 */
type ProviderCreateEmbeddingProviderContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  model: string;
  remote?: {
    baseUrl?: string;
    apiKey?: unknown;
    headers?: Record<string, string>;
  };
  providerApiKey?: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
  taskType?: string;
};
/**
 * Provider-owned prompt-cache eligibility.
 *
 * Return `true` or `false` to override OpenClaw's built-in provider cache TTL
 * detection for this provider. Return `undefined` to fall back to core rules.
 */
type ProviderCacheTtlEligibilityContext = {
  provider: string;
  modelId: string;
  modelApi?: string;
};
/**
 * Provider-owned missing-auth message override.
 *
 * Runs only after OpenClaw exhausts normal env/profile/config auth resolution
 * for the requested provider. Return a custom message to replace the generic
 * "No API key found" error.
 */
type ProviderBuildMissingAuthMessageContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  listProfileIds: (providerId: string) => string[];
};
/**
 * Provider-owned unknown-model hint override.
 *
 * Runs after catalog/runtime lookup misses for the requested provider. Return a
 * hint suffix that OpenClaw should append to the generic `Unknown model`
 * error.
 */
type ProviderBuildUnknownModelHintContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  provider: string;
  modelId: string;
  baseUrl?: string;
};
//#endregion
//#region src/infra/provider-usage.types.d.ts
/** One quota window reported by a provider usage endpoint. */
type UsageWindow = {
  label: string;
  usedPercent: number;
  resetAt?: number;
};
/** Provider-reported monetary or credit facts. Units may be ISO currencies or provider credits. */
type ProviderUsageBilling = {
  type: "balance";
  label?: string;
  amount: number;
  unit: string;
} | {
  type: "spend";
  label?: string;
  amount: number;
  unit: string;
  period?: string;
  resetAt?: number;
} | {
  type: "budget";
  label?: string;
  used: number;
  limit: number;
  unit: string;
  period?: string;
  resetAt?: number;
};
/** Provider-reported daily cost and token totals. Costs are actual provider billing, not estimates. */
type ProviderUsageCostDaily = {
  date: string;
  amount: number;
  requests?: number;
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
  totalTokens: number;
};
/** Aggregate model activity for the provider history window. */
type ProviderUsageModelBreakdown = {
  name: string;
  requests?: number;
  inputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  outputTokens: number;
  totalTokens: number;
};
/** Aggregate provider billing category for the history window. */
type ProviderUsageCostBreakdown = {
  name: string;
  amount: number;
};
/** Provider-reported cost history and attribution for one bounded UTC window. */
type ProviderUsageCostHistory = {
  unit: string;
  periodDays: number;
  scope?: string;
  daily: ProviderUsageCostDaily[];
  models: ProviderUsageModelBreakdown[];
  categories: ProviderUsageCostBreakdown[];
};
type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  billing?: ProviderUsageBilling[];
  costHistory?: ProviderUsageCostHistory;
  summary?: string;
  plan?: string; /** Account identity (email) the usage was fetched under, when known. */
  accountEmail?: string;
  error?: string;
};
/** Normalized provider id. Usage providers are discovered from plugin hooks at runtime. */
type UsageProviderId = string;
//#endregion
//#region src/plugins/provider-hook-runtime.d.ts
type ProviderRuntimePluginLookupParams = {
  provider: string;
  providerOwner?: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
};
type ProviderRuntimePluginHandle = ProviderRuntimePluginLookupParams & {
  plugin?: ProviderPlugin;
};
//#endregion
//#region src/plugins/provider-thinking.types.d.ts
/**
 * Provider-owned thinking policy input.
 *
 * Used by shared `/think`, ACP controls, and directive parsing to ask a
 * provider whether a model supports special reasoning UX such as adaptive,
 * xhigh, max, or a binary on/off toggle.
 */
type ProviderThinkingPolicyContext = {
  provider: string;
  modelId: string;
};
type ProviderThinkingModelCompat = {
  thinkingFormat?: string;
  supportedReasoningEfforts?: readonly string[] | null;
};
/**
 * Provider-owned default thinking policy input.
 *
 * `reasoning` is the merged catalog hint for the selected model when one is
 * available. Providers can use it to keep "reasoning model => low" behavior
 * without re-reading the catalog themselves.
 *
 * `compat` carries model-level request contract facts for the selected model
 * when available. Providers can use it to expose model-specific thinking
 * profiles only when the configured payload style supports them.
 */
type ProviderDefaultThinkingPolicyContext = ProviderThinkingPolicyContext & {
  /** Effective agent runtime selected for this model, when known. */agentRuntime?: string | null; /** API adapter id from the selected catalog route, when known. */
  api?: string | null;
  reasoning?: boolean;
  params?: Record<string, unknown>;
  compat?: ProviderThinkingModelCompat | null;
};
type ProviderThinkingLevelId = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra";
type ProviderThinkingLevel = {
  id: ProviderThinkingLevelId;
  /**
   * Optional display label. Use this when the stored value differs from the
   * provider-facing UX, for example binary providers storing `low` but showing
   * `on`.
   */
  label?: string;
  /**
   * Relative strength used when downgrading a stored level that the selected
   * model no longer supports.
   */
  rank?: number;
};
type ProviderThinkingProfile = {
  levels: ProviderThinkingLevel[] | ReadonlyArray<ProviderThinkingLevel>;
  defaultLevel?: ProviderThinkingLevelId | null;
  /**
   * Some bundled providers have model-specific thinking contracts that are more
   * current than cached generic catalog metadata. Keep this opt-in so
   * `reasoning: false` remains authoritative for ordinary catalog entries.
   */
  preserveWhenCatalogReasoningFalse?: boolean;
};
//#endregion
//#region src/plugins/provider-runtime.d.ts
declare function augmentModelCatalogWithProviderPlugins(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  metadataSnapshot?: PluginMetadataSnapshot;
  context: ProviderAugmentModelCatalogContext;
}): Promise<ModelCatalogEntry[]>;
//#endregion
//#region src/agents/auth-profiles/credential-state.d.ts
/** Reason code for why a stored auth credential can or cannot be used. */
type AuthCredentialReasonCode = "ok" | "missing_credential" | "invalid_expires" | "expired" | "unresolved_ref" | "malformed_api_key";
/** Default OAuth access-token refresh margin before expiry. */
declare const DEFAULT_OAUTH_REFRESH_MARGIN_MS: number;
/** Returns true when an OAuth credential has a non-expiring access token. */
declare function hasUsableOAuthCredential(credential: OAuthCredential | undefined, opts?: {
  now?: number;
  refreshMarginMs?: number;
}): boolean;
//#endregion
//#region src/agents/provider-auth-aliases.d.ts
/** Inputs that control plugin metadata and trust scope for auth alias lookup. */
type ProviderAuthAliasLookupParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
};
/** Resolve the provider ID that should be used for credential lookup. */
declare function resolveProviderIdForAuth(provider: string, params?: ProviderAuthAliasLookupParams): string;
//#endregion
//#region src/agents/auth-profiles/order.d.ts
/** Reason a profile is or is not eligible for provider auth. */
type AuthProfileEligibilityReasonCode = AuthCredentialReasonCode | "profile_missing" | "provider_mismatch" | "mode_mismatch";
/** Eligibility decision for one auth profile candidate. */
type AuthProfileEligibility = {
  eligible: boolean;
  reasonCode: AuthProfileEligibilityReasonCode;
};
/** Returns true when a stored credential can authenticate the requested provider. */
/** Resolves whether a profile can be used for a provider right now. */
declare function resolveAuthProfileEligibility(params: {
  cfg?: OpenClawConfig;
  authAliasLookupParams?: ProviderAuthAliasLookupParams;
  store: AuthProfileStore;
  provider: string;
  profileId: string;
  now?: number;
}): AuthProfileEligibility;
type ResolveAuthProfileOrderParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string; /** Exact prepared metadata for request paths that must not rediscover plugin aliases. */
  authAliasLookupParams?: ProviderAuthAliasLookupParams;
  preferredProfile?: string; /** Model that will consume the profile, for model-scoped cooldowns. */
  forModel?: string; /** Read-only status keeps unresolved refs ordered so availability remains unknown. */
  readinessMode?: "execution" | "read-only";
};
/** Resolves ordered usable auth profile ids for a provider. */
declare function resolveAuthProfileOrder(params: ResolveAuthProfileOrderParams): string[];
//#endregion
//#region src/agents/auth-profiles/external-cli-discovery.d.ts
/** External CLI auth discovery mode used while loading auth profile stores. */
type ExternalCliAuthDiscovery = {
  mode: "none";
  allowKeychainPrompt?: false;
  config?: OpenClawConfig;
  workspaceDir?: string;
} | {
  mode: "existing";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  workspaceDir?: string;
} | {
  mode: "scoped";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  workspaceDir?: string;
  providerIds?: Iterable<string>;
  profileIds?: Iterable<string>;
};
//#endregion
//#region src/agents/auth-profiles/oauth.d.ts
type ResolveApiKeyForProfileResult = {
  apiKey: string;
  provider: string;
  email?: string;
  profileId: string;
  profileType: AuthProfileCredential["type"];
  credential?: AuthProfileCredential;
};
type ResolveApiKeyForProfileParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  profileId: string;
  agentDir?: string;
  forceRefresh?: boolean;
  allowProfileFallback?: boolean;
};
/** Refresh one OAuth credential and merge provider-returned token fields. */
declare function refreshOAuthCredentialForRuntime(params: {
  credential: OAuthCredential;
  cfg?: OpenClawConfig;
}): Promise<OAuthCredential | null>;
/** Resolve a selected auth profile into the provider API key string. */
declare function resolveApiKeyForProfile(params: ResolveApiKeyForProfileParams): Promise<ResolveApiKeyForProfileResult | null>;
//#endregion
//#region src/agents/auth-profiles/profile-list.d.ts
/** Lists auth profile ids whose credential provider matches the requested provider. */
declare function listProfilesForProvider(store: AuthProfileStore, provider: string): string[];
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.d.ts
/** Upserts an auth profile under the store lock, returning null on store write failure. */
declare function upsertAuthProfileWithLock(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
  stateDir?: string;
}): Promise<AuthProfileStore | null>;
//#endregion
//#region src/agents/auth-profiles/profiles.d.ts
/** Upserts an auth profile immediately into the local store. */
declare function upsertAuthProfile(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
}): void;
/** Removes all auth profiles and related state for a provider. */
declare function removeProviderAuthProfilesWithLock(params: {
  provider: string;
  agentDir?: string;
}): Promise<AuthProfileStore | null>;
//#endregion
//#region src/agents/auth-profiles/repair.d.ts
/** Suggests a modern OAuth profile id for a legacy provider:default profile. */
declare function suggestOAuthProfileIdForLegacyDefault(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  legacyProfileId: string;
}): string | null;
//#endregion
//#region src/agents/auth-profiles/runtime-snapshots.d.ts
/** Replaces all runtime auth profile snapshots with cloned entries. */
declare function replaceRuntimeAuthProfileStoreSnapshots(entries: Array<{
  databasePath?: string;
  agentDir?: string;
  store: AuthProfileStore;
}>): void;
/** Clears all runtime auth profile snapshots. */
declare function clearRuntimeAuthProfileStoreSnapshots(): void;
//#endregion
//#region src/agents/auth-profiles/sqlite.d.ts
type AuthProfileDatabase = OpenClawAgentDatabase | OpenClawStateDatabase;
//#endregion
//#region src/agents/auth-profiles/store.d.ts
type LoadAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  database?: AuthProfileDatabase;
  externalCli?: ExternalCliAuthDiscovery;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};
type SaveAuthProfileStoreOptions = {
  filterExternalAuthProfiles?: boolean;
  preserveOrderProfileIds?: Iterable<string>;
  preserveStateProfileIds?: Iterable<string>;
  pruneOrderProfileIds?: Iterable<string>;
  syncExternalCli?: boolean;
};
/** Run a bounded operation without persisted or external CLI auth profiles. */
/** Apply an auth store update inside the SQLite write lock. */
declare function updateAuthProfileStoreWithLock(params: {
  agentDir?: string;
  stateDir?: string;
  saveOptions?: SaveAuthProfileStoreOptions;
  updater: (store: AuthProfileStore) => boolean;
}): Promise<AuthProfileStore | null>;
/** Loads the effective runtime store for an agent, including inherited main profiles. */
declare function loadAuthProfileStoreForRuntime(agentDir?: string, options?: LoadAuthProfileStoreOptions): AuthProfileStore;
/** Load auth profiles for secret resolution without keychain prompts or writes. */
declare function loadAuthProfileStoreForSecretsRuntime(agentDir?: string, options?: Pick<LoadAuthProfileStoreOptions, "config" | "externalCli" | "externalCliProviderIds" | "externalCliProfileIds" | "inheritedAuthDir">): AuthProfileStore;
/** Load auth profiles with runtime external profiles removed from the result. */
declare function loadAuthProfileStoreWithoutExternalProfiles(agentDir?: string, loadOptions?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt" | "inheritedAuthDir">): AuthProfileStore;
/** Ensure an auth store is available, including runtime/external profile overlays. */
declare function ensureAuthProfileStore(agentDir?: string, options?: {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  externalCli?: ExternalCliAuthDiscovery;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
}): AuthProfileStore;
/** Find a persisted credential in the scoped store, falling back to the main store. */
declare function findPersistedAuthProfileCredential(params: {
  agentDir?: string;
  profileId: string;
}): AuthProfileStore["profiles"][string] | undefined;
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
declare function resolvePersistedAuthProfileOwnerAgentDir(params: {
  agentDir?: string;
  profileId: string;
}): string | undefined;
/** Load the store shape used when applying local-only auth updates. */
declare function ensureAuthProfileStoreForLocalUpdate(agentDir?: string): AuthProfileStore;
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
declare function saveAuthProfileStore(store: AuthProfileStore, agentDir?: string, options?: SaveAuthProfileStoreOptions, database?: AuthProfileDatabase): void;
//#endregion
//#region src/agents/auth-profiles/usage-state.d.ts
/**
 * Check if a profile is currently in cooldown (due to rate limits, overload, or other transient failures).
 */
declare function isProfileInCooldown(store: AuthProfileStore, profileId: string, now?: number, forModel?: string): boolean;
/**
 * Clear expired cooldowns from all profiles in the store.
 *
 * When `cooldownUntil` or `disabledUntil` has passed, the corresponding fields
 * are removed and error counters are reset so the profile gets a fresh start
 * (circuit-breaker half-open -> closed). Without this, a stale `errorCount`
 * causes the *next* transient failure to immediately escalate to a much longer
 * cooldown -- the root cause of profiles appearing "stuck" after rate limits.
 *
 * `cooldownUntil` and `disabledUntil` are handled independently: if a profile
 * has both and only one has expired, only that field is cleared.
 *
 * Mutates the in-memory store; disk persistence happens lazily on the next
 * store write (e.g. `markAuthProfileSuccess` / `markAuthProfileFailure`), which
 * matches the existing save pattern throughout the auth-profiles module.
 *
 * @returns `true` if any profile was modified.
 */
declare function clearExpiredCooldowns(store: AuthProfileStore, now?: number): boolean;
//#endregion
//#region src/agents/auth-profiles/usage.d.ts
/**
 * Infer the most likely reason all candidate profiles are currently unavailable.
 *
 * We prefer explicit active `disabledReason` values (for example billing/auth)
 * over generic cooldown buckets, then fall back to failure-count signals.
 */
declare function resolveProfilesUnavailableReason(params: {
  store: AuthProfileStore;
  profileIds: string[];
  now?: number;
}): AuthProfileFailureReason | null;
/** Resolves the display-facing unusable timestamp, honoring provider bypasses. */
declare function resolveProfileUnusableUntilForDisplay(store: AuthProfileStore, profileId: string): number | null;
/** Marks a profile blocked until a provider-reported reset timestamp. */
declare function markAuthProfileBlockedUntil(params: {
  store: AuthProfileStore;
  profileId: string;
  blockedUntil: number;
  source: AuthProfileBlockedSource;
  agentDir?: string;
  runId?: string;
  modelId?: string;
}): Promise<void>;
//#endregion
//#region src/secrets/provider-env-vars.d.ts
type ProviderEnvVarLookupParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
};
/** Manifest-provided evidence that a provider auth credential exists outside config. */
type ProviderAuthEvidence = {
  type: "local-file-with-env";
  fileEnvVar?: string;
  fallbackPaths?: readonly string[];
  requiresAnyEnv?: readonly string[];
  requiresAllEnv?: readonly string[];
  credentialMarker: string;
  source?: string;
};
/** Lists known provider auth env vars without bridge-only env vars. */
declare function listKnownProviderAuthEnvVarNames(params?: ProviderEnvVarLookupParams): string[];
/** Returns a copy of an env object with denied keys removed case-insensitively. */
declare function omitEnvKeysCaseInsensitive(baseEnv: NodeJS.ProcessEnv, keys: Iterable<string>): NodeJS.ProcessEnv;
//#endregion
//#region src/agents/model-auth-env.d.ts
type EnvApiKeyResult = {
  apiKey: string;
  source: string;
};
type EnvApiKeyLookupOptions = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  aliasMap?: Readonly<Record<string, string>>;
  candidateMap?: Readonly<Record<string, readonly string[]>>;
  authEvidenceMap?: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
  setupProviderFallbackRefs?: readonly string[];
  skipSetupProviderFallback?: boolean;
};
/** Resolve an API key or auth-evidence marker for a provider from environment state. */
declare function resolveEnvApiKey(provider: string, env?: NodeJS.ProcessEnv, options?: EnvApiKeyLookupOptions): EnvApiKeyResult | null;
//#endregion
//#region src/agents/model-auth-runtime-shared.d.ts
/** Resolved credential material and provenance for one provider request. */
type ResolvedProviderAuth = {
  apiKey?: string;
  profileId?: string;
  source: string;
  mode: "api-key" | "oauth" | "token" | "aws-sdk";
};
//#endregion
//#region src/agents/model-auth-provider.d.ts
type ProviderCredentialPrecedence = "profile-first" | "env-first";
/** Resolves the credential that should be used for one provider request. */
declare function resolveApiKeyForProviderCore(params: {
  provider: string;
  cfg?: OpenClawConfig;
  profileId?: string;
  preferredProfile?: string;
  store?: AuthProfileStore;
  agentDir?: string;
  workspaceDir?: string;
  /** When true, treat profileId as a user-locked selection that must not be
   *  silently overridden by env/config credentials. */
  lockedProfile?: boolean;
  forceRefresh?: boolean;
  credentialPrecedence?: ProviderCredentialPrecedence; /** Skip implicit profile discovery for a prepared env/config fallback attempt. */
  allowAuthProfileFallback?: boolean; /** Skip plugin setup fallback when the prepared route already excludes it. */
  skipSetupProviderFallback?: boolean;
  modelId?: string;
  modelApi?: string; /** Keep SecretRef-backed model credentials opaque until a sentinel-aware transport boundary. */
  secretSentinels?: boolean;
}): Promise<ResolvedProviderAuth>;
//#endregion
//#region src/agents/model-auth-model.d.ts
type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
declare function resolveModelAuthMode(provider?: string, cfg?: OpenClawConfig, store?: AuthProfileStore, options?: {
  workspaceDir?: string;
}): ModelAuthMode | undefined;
//#endregion
//#region src/agents/exec-auto-reviewer.d.ts
/** Config for the optional model-backed exec reviewer. */
type ExecReviewerConfig = {
  model?: AgentModelConfig;
  timeoutMs?: number;
};
//#endregion
//#region src/agents/bash-tools.exec-types.d.ts
/** Runtime defaults passed into exec/process tool factories. */
type ExecToolDefaults = {
  hasCronTool?: boolean;
  host?: ExecTarget;
  mode?: ExecMode;
  security?: ExecSecurity;
  ask?: ExecAsk;
  trigger?: string;
  node?: string; /** Default working directory for node-host execution only. */
  nodeCwd?: string;
  pathPrepend?: string[];
  safeBins?: string[];
  strictInlineEval?: boolean;
  commandHighlighting?: boolean;
  safeBinTrustedDirs?: string[];
  safeBinProfiles?: Record<string, SafeBinProfileFixture>;
  reviewer?: ExecReviewerConfig;
  config?: OpenClawConfig;
  autoReviewer?: ExecAutoReviewer;
  agentId?: string;
  backgroundMs?: number;
  timeoutSec?: number;
  approvalWarningText?: string;
  approvalFollowupText?: string;
  approvalFollowup?: ExecApprovalFollowupFactory;
  approvalFollowupMode?: "agent" | "direct";
  approvalRunningNoticeMs?: number;
  sandbox?: BashSandboxConfig;
  elevated?: ExecElevatedDefaults;
  allowBackground?: boolean;
  scopeKey?: string;
  sessionKey?: string; /** Stable agent run that owns any approval created by this tool. */
  runId?: string; /** Exact admitted execution instance that owns secret-egress proxy access. */
  operationalRunInstance?: OperationalRunInstanceRef; /** Durable session that receives detached exec completion events and approval followups. */
  notifySessionKey?: string;
  /** Ephemeral session UUID active when this exec tool was built. Regenerated
   *  on `/new` and `/reset`, so it pins exec-approval followups to the original
   *  session instance and lets stale followups drop after a session rebind. */
  sessionId?: string;
  /** `session.store` template from the runtime config. Lets the direct/denied
   *  exec approval followup path resolve the session key's current sessionId and
   *  drop the followup when the key was rebound by `/new` or `/reset`. */
  sessionStore?: string;
  /** `session.mainKey` from the runtime config; passed through into
   *  runExecProcess so background-exit notifications can remap cron-run
   *  session keys to the agent's main queue without an ambient config load. */
  mainKey?: string;
  /** `session.scope` from the runtime config; passed alongside `mainKey`
   *  so the cron-run remap can route global-scope agents to the "global"
   *  queue instead of agent-main. */
  sessionScope?: "per-sender" | "global"; /** Start-time routing policy for detached exec system events. */
  eventRouting?: EventSessionRoutingPolicy;
  messageProvider?: string;
  currentChannelId?: string;
  currentThreadTs?: string; /** Channel-owned sender/chat metadata. Exec subprocesses receive only sender/chat IDs. */
  channelContext?: PluginHookChannelContext;
  accountId?: string;
  approvalReviewerDeviceId?: string; /** Deny approval-requiring commands without creating operator approval events. */
  nonInteractiveApproval?: boolean;
  notifyOnExit?: boolean;
  notifyOnExitEmptySuccess?: boolean;
  cwd?: string;
};
/** Outcome passed to approval follow-up factories after approved async exec. */
type ExecApprovalFollowupOutcome = {
  status: "completed" | "failed";
  exitCode: number | null;
  exitReason?: TerminationReason;
  timedOut: boolean;
  aggregated: string;
  reason?: string;
};
type ExecApprovalFollowupContext = {
  approvalId: string;
  sessionId: string;
  trigger?: string;
  outcome: ExecApprovalFollowupOutcome;
};
/** Hook that can append domain-specific text to approval follow-up messages. */
type ExecApprovalFollowupFactory = (context: ExecApprovalFollowupContext) => string | undefined | Promise<string | undefined>;
/** Effective elevated-exec defaults derived from config/runtime policy. */
type ExecElevatedDefaults = {
  enabled: boolean;
  allowed: boolean;
  defaultLevel: "on" | "off" | "ask" | "full";
  fullAccessAvailable?: boolean;
  fullAccessBlockedReason?: EmbeddedFullAccessBlockedReason;
};
//#endregion
//#region src/agents/conversation-recall.types.d.ts
type ConversationRecallContext = {
  /** Private conversation that requested this bounded recall pass. */anchorSessionKey: string; /** Only same-agent private transcript hits may pass. */
  scope: "same-agent-private"; /** Product-only recall searches sessions; advanced recall keeps configured corpora. */
  corpus: "sessions" | "configured";
};
//#endregion
//#region src/agents/embedded-agent-payloads.d.ts
/**
 * Channel-facing reply payload emitted by embedded agents. Keep this type
 * small: channel adapters decide how to render text, media, and reply targets.
 */
type BlockReplyPayload = {
  text?: string;
  mediaUrls?: string[];
  attachments?: ReplyMediaAttachment[];
  audioAsVoice?: boolean;
  trustedLocalMedia?: boolean;
  sensitiveMedia?: boolean;
  isReasoning?: boolean; /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean; /** Portable controls attached to a harness-owned blocking prompt. */
  presentation?: MessagePresentation; /** Runtime-authored text is the fallback for the portable presentation. */
  presentationTextMode?: "fallback"; /** Channel-specific routing metadata for runtime-owned interactions. */
  channelData?: Record<string, unknown>;
};
//#endregion
//#region src/agents/embedded-agent-subscribe.shared-types.d.ts
/** Rendering mode for completed tool results in subscribed replies. */
type ToolResultFormat = "markdown" | "plain";
/** Detail level for in-flight tool progress messages. */
type ToolProgressDetailMode = "explain" | "raw";
//#endregion
//#region src/agents/harness/runtime-artifact.types.d.ts
/** Exact local implementation owned by one plugin agent harness process. */
type AgentHarnessRuntimeArtifactBinding = Readonly<{
  id: string;
  fingerprint: string;
}>;
/** Runtime artifact a verified continuation must keep using. */
type ExpectedAgentHarnessRuntimeArtifact = Readonly<{
  harnessId: string;
  artifact: AgentHarnessRuntimeArtifactBinding;
}>;
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.types.d.ts
/**
 * Scope used when classifying auth-profile failures for retry/fallback decisions.
 */
type AuthProfileFailurePolicy = "shared" | "local" | "local_transient";
//#endregion
//#region src/agents/embedded-agent-runner/run/params.d.ts
type EmbeddedRunTrigger = "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
type ResolvedToolPromptFinalizer = (params: {
  prompt: string;
  messageToolAvailable: boolean;
}) => string;
type ReasoningStreamPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"> & {
  requiresReasoningProgressOptIn?: boolean;
};
type CurrentInboundPromptContext = {
  text: string;
  resumableText?: string;
  promptJoiner?: "\n\n" | "\n" | " "; /** Generated goal blocks owned by inbound-context assembly, never user text. */
  injectedGoalContexts?: string[];
};
type RunEmbeddedAgentParams = {
  /** Already-admitted internal execution; mutually exclusive with preparedRunAdmission. */admittedRunContext?: AdmittedRunContext; /** Host-only post-prepare continuation, removed before plugin invocation. */
  preparedRunAdmission?: PreparedAgentRunAdmission; /** Caller-owned in-memory transcript for ephemeral helper runs. */
  sessionManager?: SessionManager;
  sessionId: string;
  sessionKey?: string; /** Storage-neutral transcript/session target. Defaults to sessionId/sessionKey/agentId. */
  sessionTarget?: AgentRunSessionTarget; /** Immutable gateway lifecycle ownership captured when this execution was admitted. */
  lifecycleGeneration?: string; /** Provider prompt-cache affinity key; distinct from transcript/session identity. */
  promptCacheKey?: string; /** Session-like key for sandbox and tool-policy resolution. Defaults to sessionKey. */
  sandboxSessionKey?: string;
  agentId?: string;
  messageChannel?: string;
  messageProvider?: string; /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[]; /** Out-of-band plugin bindings attached by the run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>;
  chatType?: ChatType;
  agentAccountId?: string; /** What initiated this agent run: "user", "heartbeat", "cron", "memory", "overflow", or "manual". */
  trigger?: EmbeddedRunTrigger; /** Stable cron job identifier populated for cron-triggered runs. */
  jobId?: string; /** Store-private runtime authority forwarded only by the cron execution owner. */
  scheduledRuntimeAuthority?: CronRuntimeAuthority; /** A known runtime-specific authority envelope was explicitly cleared. */
  scheduledRuntimeAuthorityRecoveryRequired?: boolean; /** Relative workspace path that memory-triggered writes are allowed to append to. */
  memoryFlushWritePath?: string; /** Delivery target for topic/thread routing. */
  messageTo?: string; /** Thread/topic identifier for routing replies to the originating thread. */
  messageThreadId?: string | number; /** Trusted channel-configured policy for the admitted conversation turn. */
  conversationToolPolicy?: GroupToolPolicyConfig; /** Group id for channel-level tool policy resolution. */
  groupId?: string | null; /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null; /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null; /** Trusted provider role ids for the requester in this group turn. */
  memberRoleIds?: string[]; /** Opaque host-issued capability for current-turn channel message actions. */
  messageActionTurnCapability?: string; /** Parent session key for subagent policy inheritance. */
  spawnedBy?: string | null; /** Whether workspaceDir points at the canonical agent workspace for bootstrap purposes. */
  isCanonicalWorkspace?: boolean;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null; /** Trusted sender identity bit for command/channel-action auth. */
  senderIsOwner?: boolean; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string; /** Current channel ID for auto-threading (Slack). */
  currentChannelId?: string; /** Transport-native chat/conversation ID for hook identity context. */
  chatId?: string; /** Channel-specific identity metadata surfaced to plugin hooks. */
  channelContext?: PluginHookChannelContext; /** Routable target for the current conversation when it differs from the native channel ID. */
  currentMessagingTarget?: string; /** Current thread timestamp for auto-threading (Slack). */
  currentThreadTs?: string; /** Current inbound message id for action fallbacks (e.g. Telegram react). */
  currentMessageId?: string | number; /** True when the current inbound turn carried audio media. */
  currentInboundAudio?: boolean; /** Reply-to mode for Slack auto-threading. */
  replyToMode?: "off" | "first" | "all" | "batched"; /** Mutable ref to track if a reply was sent (for "first" mode). */
  hasRepliedRef?: {
    value: boolean;
  }; /** Require explicit message tool targets (no implicit last-route sends). */
  requireExplicitMessageTarget?: boolean; /** If true, omit the message tool from the tool list. */
  disableMessageTool?: boolean;
  swarmCollector?: boolean;
  swarmOutputSchema?: Record<string, unknown>; /** Restrict this reconstructed run to restart-safe tools. */
  forceRestartSafeTools?: boolean; /** Preserve Code Mode controls for a replay-safe restart recovery turn. */
  forceCodeModeTools?: boolean; /** Internal one-shot model probe mode: no tools, no workspace/chat prompt policy. */
  modelRun?: boolean; /** Disable trajectory persistence for auxiliary runs with no durable session owner. */
  disableTrajectory?: boolean; /** Restrict Skill Workshop to a bounded pending-proposal budget for an internal review run. */
  skillWorkshopProposalOnly?: boolean; /** Mark proposals created by this internal review as autonomous captures. */
  skillWorkshopAutonomousCapture?: boolean;
  skillWorkshopUpdateProposals?: boolean; /** Preserve the foreground run as proposal provenance for an internal review run. */
  skillWorkshopOrigin?: SkillProposalOrigin; /** Run-scoped mutation budget shared across internal runner attempts. */
  skillWorkshopProposalMutationBudget?: SkillWorkshopProposalMutationBudget; /** Optional state environment for isolated Skill Workshop proposal persistence. */
  skillWorkshopProposalEnv?: NodeJS.ProcessEnv; /** Shared completion latch for proposal-only review runs that checkpoint their batch. */
  skillWorkshopProposalReviewCompletion?: SkillWorkshopRunOptions["proposalReviewCompletion"]; /** Restrict Skill Workshop to one atomic collection reconciliation. */
  skillWorkshopCollectionReconcile?: SkillWorkshopRunOptions["collectionReconcile"]; /** Explicit system prompt mode override for trusted callers. */
  promptMode?: PromptMode; /** Keep the message tool available even when a narrow profile would omit it. */
  forceMessageTool?: boolean; /** Include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean; /** Keep the heartbeat response tool available even when a narrow profile would omit it. */
  forceHeartbeatTool?: boolean; /** Allow runtime plugins for this run to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean; /** @deprecated Use sessionTarget plus sessionId/sessionKey/agentId for runtime identity. */
  sessionFile?: string;
  workspaceDir: string; /** Task working directory for tool/runtime execution. Defaults to workspaceDir. */
  cwd?: string;
  agentDir?: string;
  /**
   * Run config consumed by core paths (model selection, tools, plugin
   * activation). Plugin harnesses resolve `plugins.entries.<id>.config` from
   * the live global config, NOT from this object — per-run plugin-config
   * overrides are unsupported; use an explicit run param instead.
   */
  config?: OpenClawConfig;
  toolOverrides?: SessionToolOverrides;
  skillsSnapshot?: SkillSnapshot;
  prompt: string; /** User-visible prompt body to submit and persist; runtime context travels separately. */
  transcriptPrompt?: string; /** Finalizes caller-owned guidance after the submitted tool surface is known. */
  finalizePromptForResolvedTools?: ResolvedToolPromptFinalizer;
  currentInboundEventKind?: InboundEventKind;
  currentInboundContext?: CurrentInboundPromptContext;
  explicitSkillSelections?: ExplicitSkillSelection[];
  images?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[]; /** Ordered facts represented by attachment text in the current prompt. */
  media?: MediaFact[]; /** Optional client-provided tools (OpenResponses hosted tools). */
  clientTools?: ClientToolDefinition[]; /** Disable built-in tools for this run (LLM-only mode). */
  disableTools?: boolean;
  provider?: string;
  model?: string; /** Effective model fallback chain for this session attempt. Undefined uses config defaults. */
  modelFallbacksOverride?: string[]; /** Session-pinned embedded harness id. Prevents runtime hot-switching. */
  agentHarnessId?: string; /** True when the pinned non-default harness owns model selection for this session. */
  modelSelectionLocked?: boolean; /** Explicit runtime override selected for this turn. Unlike agentHarnessId, this may force OpenClaw. */
  agentHarnessRuntimeOverride?: string; /** Verified setup continuation: pin both the harness and its local implementation. */
  expectedAgentHarnessRuntimeArtifact?: ExpectedAgentHarnessRuntimeArtifact;
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
  thinkLevel?: ThinkLevel;
  fastMode?: FastMode; /** Stable outer-run start time for auto fast-mode cutoff across retries/fallbacks. */
  fastModeStartedAtMs?: number; /** Effective auto fast-mode cutoff for this run, in seconds. */
  fastModeAutoOnSeconds?: number; /** Shared notification state for nested harnesses that can observe the same tool boundary. */
  fastModeAutoProgressState?: FastModeAutoProgressState; /** True when the outer model fallback loop has reached its final candidate. */
  isFinalFallbackAttempt?: boolean;
  verboseLevel?: VerboseLevel;
  reasoningLevel?: ReasoningLevel;
  toolResultFormat?: ToolResultFormat;
  toolProgressDetail?: ToolProgressDetailMode; /** If true, suppress tool error warning payloads for this run (including mutating tools). */
  suppressToolErrorWarnings?: boolean | (() => boolean | undefined); /** Bootstrap context mode for workspace file injection. */
  bootstrapContextMode?: "full" | "lightweight"; /** Run kind hint for context mode behavior. */
  bootstrapContextRunKind?: BootstrapContextRunKind; /** Optional tool allow-list; when set, only these tools are sent to the model. */
  toolsAllow?: string[]; /** Exact attempt authority attached to the active steering backend. */
  toolAuthorityFingerprint?: string; /** Owner-scoped plugin tool grant; normal policy and deny rules still apply. */
  runtimePluginToolGrant?: RuntimePluginToolGrant; /** Consumed in-process subagent-completion capability; never derived from public input. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff; /** Trusted server-stamped authority for an explicitly capped scheduled run. */
  scheduledToolPolicy?: ScheduledToolPolicyContext; /** Host-stamped exact-run capability for late Codex creator-authority capture. */
  cronCreatorAuthorityCapability?: CronCreatorAuthorityCapability; /** Ephemeral reason fresh local-operator cron authority cannot survive this queued turn. */
  cronCreatorAuthorityUnavailableReason?: "queued-local-operator"; /** Seen bootstrap truncation warning signatures for this session (once mode dedupe). */
  bootstrapPromptWarningSignaturesSeen?: string[]; /** Last shown bootstrap truncation warning signature for this session. */
  bootstrapPromptWarningSignature?: string;
  execOverrides?: Pick<ExecToolDefaults, "host" | "security" | "ask" | "node" | "nodeCwd" | "notifyOnExit" | "notifyOnExitEmptySuccess">;
  bashElevated?: ExecElevatedDefaults; /** Trusted approved-exec runtime prompt span awaiting the resolved attempt cap. */
  execApprovalContinuationPromptRange?: ExecApprovalContinuationPromptRange; /** Corresponding span in the undecorated transcript prompt. */
  execApprovalContinuationTranscriptPromptRange?: ExecApprovalContinuationPromptRange;
  timeoutMs: number;
  /**
   * Explicit per-run timeout override, in milliseconds, when the caller knows
   * the run was launched with a deliberate per-run value (e.g. a cron payload's
   * `timeoutSeconds`) rather than inheriting `agents.defaults.timeoutSeconds`.
   * When set, the LLM idle watchdog honors this value directly instead of
   * inferring "explicitness" from `timeoutMs !== agents.defaults.timeoutSeconds`,
   * which fails when the explicit value happens to numerically equal the agent
   * default.
   */
  runTimeoutOverrideMs?: number;
  runId: string; /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
  conversationRecall?: ConversationRecallContext;
  abortSignal?: AbortSignal;
  onExecutionStarted?: (info?: {
    lifecycleGeneration?: string;
  }) => void;
  onExecutionPhase?: (info: {
    phase: EmbeddedAgentExecutionPhase;
    provider?: string;
    model?: string;
    backend?: string;
    source?: string;
    tool?: string;
    toolCallId?: string;
    itemId?: string;
    firstModelCallStarted?: boolean;
  }) => void;
  onLaneWait?: (info: {
    waitMs: number;
    queuedAhead: number;
    waiting?: boolean;
  }) => void;
  onRunProgress?: (info: {
    reason: string;
    provider?: string;
    model?: string;
    backend?: string;
  }) => void;
  onSessionIdChanged?: (sessionId: string) => void;
  replyOperation?: ReplyOperation;
  shouldEmitToolResult?: () => boolean;
  shouldEmitToolOutput?: () => boolean;
  onPartialReply?: (payload: PartialReplyPayload) => boolean | void | Promise<boolean | void>;
  onAssistantMessageStart?: () => void | Promise<void>;
  onBlockReply?: (payload: BlockReplyPayload, context?: BlockReplyContext) => void | Promise<void>;
  onBlockReplyFlush?: (context: BlockReplyFlushContext) => void | Promise<void>;
  blockReplyBreak?: "text_end" | "message_end";
  blockReplyChunking?: BlockReplyChunking;
  onReasoningStream?: (payload: ReasoningStreamPayload) => void | Promise<void>;
  streamReasoningInNonStreamModes?: boolean;
  onReasoningEnd?: () => void | Promise<void>;
  onToolResult?: (payload: ReplyPayload) => void | Promise<void>; /** Synchronous private observer for the sanitized per-tool result. */
  onAgentToolResult?: (event: {
    toolName: string;
    result: unknown;
    isError: boolean;
  }) => void;
  onAgentEvent?: (evt: {
    stream: string;
    data: Record<string, unknown>;
    sessionKey?: string;
  }) => void | Promise<void>;
  onToolStreamBoundary?: () => void | Promise<void>;
  /**
   * Emit lifecycle "finishing" when the attempt ends; the caller owns the
   * final lifecycle "end" or "error" after fallback and post-turn work settle.
   */
  deferTerminalLifecycle?: boolean; /** @deprecated Use deferTerminalLifecycle. */
  deferTerminalLifecycleEnd?: boolean;
  lane?: string;
  enqueue?: CommandQueueEnqueueFn;
  extraSystemPrompt?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  silentReplyPromptMode?: SilentReplyPromptMode;
  internalEvents?: AgentInternalEvent[];
  inputProvenance?: InputProvenance;
  streamParams?: AgentStreamParams;
  ownerNumbers?: string[];
  enforceFinalTag?: boolean;
  silentExpected?: boolean; /** Skip per-chunk live visible-text parsing when no live stream consumer exists (e.g. subagents). */
  suppressLiveStreamOutput?: boolean;
  /**
   * Treat a clean empty assistant stop as an intentional silent reply.
   * Only set when the caller's prompt policy already allows an exact NO_REPLY
   * final answer for silence.
   */
  allowEmptyAssistantReplyAsSilent?: boolean;
  /**
   * Whether this run still owes a visible reply after settled non-reporting tools.
   * Exact configured silence and committed delivery remain terminal outcomes.
   */
  terminalReplyExpectation?: "required" | "optional";
  authProfileFailurePolicy?: AuthProfileFailurePolicy;
  /**
   * One-shot helper runs may opt in to executing through the provider's CLI
   * backend instead of the direct-API passthrough when the run targets a CLI
   * runtime provider whose passthrough credentials are subscription-scoped.
   * Anthropic routes direct anthropic-messages calls on subscription OAuth to
   * metered extra-usage billing: without extra-usage balance the passthrough
   * fails closed with a billing error, and with it the run silently draws
   * paid usage instead of plan limits. The CLI backend is the plan-limits
   * path for those credentials. CLI dispatch translates `toolsAllow` into the
   * selectable-backend surface (no native tools, allowlisted loopback MCP
   * tools); the same list bounds the loopback MCP grant server-side, so tools
   * outside it — including the message tool, matching `disableMessageTool`
   * intent — can be neither listed nor called. Leave unset to keep the
   * direct-API passthrough.
   */
  cliBackendDispatch?: "subscription-auth";
  /**
   * Allow a single run attempt even when all auth profiles are in cooldown,
   * but only for inferred transient cooldowns like `rate_limit` or `overloaded`.
   *
   * This is used by model fallback when trying sibling models on providers
   * where transient service pressure is often model-scoped.
   */
  allowTransientCooldownProbe?: boolean;
  suppressNextUserMessagePersistence?: boolean;
  suppressTranscriptOnlyAssistantPersistence?: boolean;
  suppressAssistantErrorPersistence?: boolean;
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder; /** Context engine resolved once by the outer logical-turn owner. */
  contextEngineLogicalTurnLease?: ContextEngineLogicalTurnLease; /** Emits immutable attempt facts for selection by the outer logical-turn owner. */
  onContextEngineTurnCandidate?: (facts: ContextEngineTurnAttemptFacts) => void; /** Keep an internal continuation prompt from being replaced by the original prepared turn. */
  skipPreparedUserTurnMessage?: boolean;
  onUserMessagePersisted?: (message: Extract<AgentMessage, {
    role: "user";
  }>) => void;
  onUserMessagePersistenceInvalidated?: () => void;
  onAssistantErrorMessagePersisted?: (message: Extract<AgentMessage, {
    role: "assistant";
  }>) => void;
  /**
   * Dispose bundled MCP runtimes when the overall run ends instead of preserving
   * the session-scoped cache. Intended for one-shot local CLI runs that must
   * exit promptly after emitting the final JSON result.
   */
  cleanupBundleMcpOnRunEnd?: boolean; /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean;
};
//#endregion
//#region src/agents/defaults.d.ts
declare const DEFAULT_PROVIDER = "openai";
declare const DEFAULT_MODEL = "gpt-5.6-sol";
//#endregion
//#region src/plugins/runtime/runtime-agent-session-catalog.d.ts
type RuntimeSessionCatalogCreateTargetParams = {
  config: OpenClawConfig;
  requestedAgentId?: string;
  provider: string;
  modelIds: readonly string[];
  agentRuntime: string;
};
/**
 * Resolve a synchronous catalog create target through the same model/runtime
 * policy used by agent turns, without making plugins import that policy graph.
 */
declare function resolveAgentCatalogCreateTarget(params: RuntimeSessionCatalogCreateTargetParams): SessionCatalogCreateTarget | undefined;
//#endregion
//#region src/agents/timeout.d.ts
declare function resolveAgentTimeoutMs(opts: {
  cfg?: OpenClawConfig;
  overrideMs?: number | null;
  overrideSeconds?: number | null;
  minMs?: number;
}): number;
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-eligibility.d.ts
type EmbeddedCliBackendDispatchEligibilityParams = {
  provider?: string;
  model?: string;
  agentId?: string; /** Explicitly pinned auth profile for the run; decisive when it resolves. */
  authProfileId?: string;
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
};
/**
 * Decides whether an opted-in embedded run would execute through the CLI
 * backend. Resolution stays on stored credential metadata — no credential
 * materialization, refresh locks, or network calls on this per-turn path.
 */
declare function resolveEmbeddedCliBackendDispatchEligibility(params: EmbeddedCliBackendDispatchEligibilityParams): {
  provider: string;
} | undefined;
//#endregion
//#region src/plugins/runtime/native-deps.d.ts
/** Inputs used to format native dependency install/rebuild guidance. */
type NativeDependencyHintParams = {
  packageName: string;
  manager?: "pnpm" | "npm" | "yarn";
  rebuildCommand?: string;
  approveBuildsCommand?: string;
  downloadCommand?: string;
};
/** Formats concise guidance for installing and rebuilding a native dependency. */
declare function formatNativeDependencyHint(params: NativeDependencyHintParams): string;
//#endregion
//#region src/image-generation/runtime-types.d.ts
type GenerateImageParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution; /** Resolution inferred from reference images; omitted for incompatible fallback models. */
  inferredResolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  autoProviderFallback?: boolean; /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
  providerOptions?: ImageGenerationProviderOptions; /** SSRF policy to propagate into image-generation provider HTTP calls. */
  ssrfPolicy?: SsrFPolicy;
};
type GenerateImageRuntimeResult = {
  images: GeneratedImageAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  appliedResolution?: ImageGenerationResolution;
  normalization?: ImageGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: ImageGenerationIgnoredOverride[];
};
//#endregion
//#region src/video-generation/runtime-types.d.ts
type GenerateVideoParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number;
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[];
  inputAudios?: VideoGenerationSourceAsset[];
  autoProviderFallback?: boolean; /** Arbitrary provider-specific options forwarded as-is to provider.generateVideo. */
  providerOptions?: Record<string, unknown>; /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
};
type GenerateVideoRuntimeResult = {
  videos: GeneratedVideoAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  normalization?: VideoGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: VideoGenerationIgnoredOverride[];
};
//#endregion
//#region src/music-generation/runtime-types.d.ts
/**
 * Runtime input/output contracts for music generation.
 *
 * These are separate from provider contracts because runtime results include
 * fallback attempts, normalized metadata, and selected provider/model identity.
 */
/** Parameters accepted by the core music generation runtime. */
type GenerateMusicParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
  autoProviderFallback?: boolean; /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
};
/** Result returned after a successful runtime provider attempt. */
type GenerateMusicRuntimeResult = {
  tracks: GeneratedMusicAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  lyrics?: string[];
  normalization?: MusicGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: MusicGenerationIgnoredOverride[];
};
//#endregion
//#region src/secrets/runtime-web-tools.types.d.ts
/** Diagnostic codes emitted while selecting runtime web search/fetch providers. */
type RuntimeWebDiagnosticCode = "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT" | "WEB_SEARCH_AUTODETECT_SELECTED" | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK" | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT" | "WEB_FETCH_AUTODETECT_SELECTED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
/** User-facing diagnostic attached to runtime web-tool metadata. */
type RuntimeWebDiagnostic = {
  code: RuntimeWebDiagnosticCode;
  message: string;
  path?: string;
};
/** Runtime selection metadata for the web search tool. */
type RuntimeWebSearchMetadata = {
  /** Provider explicitly configured in source config, before auto-detect fallback. */providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none"; /** Provider that runtime calls should use after config validation and credential lookup. */
  selectedProvider?: string; /** Source that supplied the selected provider credential, or why it is unavailable. */
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing"; /** Perplexity transport chosen from provider config or runtime default. */
  perplexityTransport?: "search_api" | "chat_completions";
  diagnostics: RuntimeWebDiagnostic[];
};
/** Runtime selection metadata for the web fetch tool. */
type RuntimeWebFetchMetadata = {
  /** Provider explicitly configured in source config, before auto-detect fallback. */providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none"; /** Provider that runtime calls should use after config validation and credential lookup. */
  selectedProvider?: string; /** Source that supplied the selected provider credential, or why it is unavailable. */
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing";
  diagnostics: RuntimeWebDiagnostic[];
};
//#endregion
//#region src/plugins/web-provider-types.d.ts
type WebSearchProviderId = string;
type WebFetchProviderId = string;
type WebSearchProviderToolDefinition = {
  description: string;
  parameters: TSchema;
  execute: (args: Record<string, unknown>, context?: WebSearchProviderToolExecutionContext) => Promise<Record<string, unknown>>;
};
type WebFetchProviderToolDefinition = {
  description: string;
  parameters: TSchema;
  execute: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};
type WebSearchProviderContext = {
  config?: OpenClawConfig;
  searchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebSearchMetadata;
  agentDir?: string;
};
type WebSearchProviderToolExecutionContext = {
  signal?: AbortSignal;
};
type WebFetchProviderContext = {
  config?: OpenClawConfig;
  fetchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebFetchMetadata;
};
type WebSearchCredentialResolutionSource = "config" | "secretRef" | "env" | "missing";
type WebSearchProviderConfiguredCredentialFallback = {
  path: string;
  value: unknown;
};
type WebFetchProviderConfiguredCredentialFallback = {
  path: string;
  value: unknown;
};
type WebSearchRuntimeMetadataContext = {
  config?: OpenClawConfig;
  searchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebSearchMetadata;
  resolvedCredential?: {
    value?: string;
    source: WebSearchCredentialResolutionSource;
    fallbackEnvVar?: string;
  };
};
type WebSearchProviderSetupContext = {
  config: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  quickstartDefaults?: boolean;
  secretInputMode?: SecretInputMode;
};
type WebFetchCredentialResolutionSource = "config" | "secretRef" | "env" | "missing";
type WebFetchRuntimeMetadataContext = {
  config?: OpenClawConfig;
  fetchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebFetchMetadata;
  resolvedCredential?: {
    value?: string;
    source: WebFetchCredentialResolutionSource;
    fallbackEnvVar?: string;
  };
};
type WebSearchProviderPlugin = {
  id: WebSearchProviderId;
  label: string;
  hint: string;
  onboardingScopes?: readonly "text-inference"[];
  requiresCredential?: boolean;
  credentialLabel?: string;
  envVars: string[]; /** Optional model-provider auth profile id that can satisfy this web provider without a tool-specific API key. */
  authProviderId?: string;
  placeholder: string;
  signupUrl: string;
  docsUrl?: string; /** Optional note shown before credential collection for provider-specific prerequisites. */
  credentialNote?: string;
  autoDetectOrder?: number;
  credentialPath: string;
  inactiveSecretPaths?: string[];
  getCredentialValue: (searchConfig?: Record<string, unknown>) => unknown;
  setCredentialValue: (searchConfigTarget: Record<string, unknown>, value: unknown) => void;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  setConfiguredCredentialValue?: (configTarget: OpenClawConfig, value: unknown) => void;
  getConfiguredCredentialFallback?: (config?: OpenClawConfig) => WebSearchProviderConfiguredCredentialFallback | undefined;
  applySelectionConfig?: (config: OpenClawConfig) => OpenClawConfig;
  runSetup?: (ctx: WebSearchProviderSetupContext) => OpenClawConfig | Promise<OpenClawConfig>;
  resolveRuntimeMetadata?: (ctx: WebSearchRuntimeMetadataContext) => Partial<RuntimeWebSearchMetadata> | Promise<Partial<RuntimeWebSearchMetadata>>;
  createTool: (ctx: WebSearchProviderContext) => WebSearchProviderToolDefinition | null;
};
type PluginWebSearchProviderEntry = WebSearchProviderPlugin & {
  pluginId: string;
};
type WebFetchProviderPlugin = {
  id: WebFetchProviderId;
  label: string;
  hint: string;
  requiresCredential?: boolean;
  credentialLabel?: string;
  envVars: string[];
  placeholder: string;
  signupUrl: string;
  docsUrl?: string;
  autoDetectOrder?: number;
  credentialPath: string;
  inactiveSecretPaths?: string[];
  getCredentialValue: (fetchConfig?: Record<string, unknown>) => unknown;
  setCredentialValue: (fetchConfigTarget: Record<string, unknown>, value: unknown) => void;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  setConfiguredCredentialValue?: (configTarget: OpenClawConfig, value: unknown) => void;
  getConfiguredCredentialFallback?: (config?: OpenClawConfig) => WebFetchProviderConfiguredCredentialFallback | undefined;
  applySelectionConfig?: (config: OpenClawConfig) => OpenClawConfig;
  resolveRuntimeMetadata?: (ctx: WebFetchRuntimeMetadataContext) => Partial<RuntimeWebFetchMetadata> | Promise<Partial<RuntimeWebFetchMetadata>>;
  createTool: (ctx: WebFetchProviderContext) => WebFetchProviderToolDefinition | null;
};
//#endregion
//#region src/web-search/runtime-types.d.ts
/** Provider/tool resolution inputs for web_search. */
type ResolveWebSearchDefinitionParams = {
  config?: OpenClawConfig;
  agentDir?: string;
  sandboxed?: boolean;
  runtimeWebSearch?: RuntimeWebSearchMetadata;
  providerId?: string;
  preferRuntimeProviders?: boolean;
  preferInputConfig?: boolean;
};
/** Inputs for executing a web_search request through the selected provider. */
type RunWebSearchParams = ResolveWebSearchDefinitionParams & {
  args: Record<string, unknown>;
  signal?: AbortSignal;
};
/** Normalized execution result that records which provider answered. */
type RunWebSearchResult = {
  provider: string;
  result: Record<string, unknown>;
};
//#endregion
//#region src/plugin-state/plugin-blob-store.types.d.ts
type PluginBlobEntryInfo<TMetadata> = {
  key: string;
  metadata: TMetadata;
  sizeBytes: number;
  createdAt: number;
  expiresAt?: number;
};
type PluginBlobEntry<TMetadata> = PluginBlobEntryInfo<TMetadata> & {
  bytes: Uint8Array;
};
type PluginBlobStore<TMetadata> = {
  register(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  registerIfAbsent(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<boolean>;
  lookup(key: string): Promise<PluginBlobEntry<TMetadata> | undefined>;
  entries(): Promise<PluginBlobEntryInfo<TMetadata>[]>;
  delete(key: string): Promise<boolean>;
  deleteExpiredKey(key: string): Promise<PluginBlobEntryInfo<TMetadata> | undefined>;
  deleteExpired(): Promise<PluginBlobEntryInfo<TMetadata>[]>;
  clear(): Promise<void>;
};
type PluginBlobOverflowPolicy = "evict-oldest" | "reject-new";
type OpenBlobStoreOptions = {
  namespace: string;
  maxEntries: number;
  maxBytesPerEntry: number;
  maxBytesPerNamespace: number;
  overflowPolicy?: PluginBlobOverflowPolicy;
  defaultTtlMs?: number;
};
//#endregion
//#region src/plugin-state/plugin-state-store.types.d.ts
type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
};
type PluginStateKeyRangeQuery = {
  keyStartInclusive: string;
  keyEndExclusive: string;
  limit: number;
  order?: "asc" | "desc";
};
/** Async plugin state API exposed to plugin runtimes. */
type PluginStateKeyedStore<T> = {
  register(key: string, value: T, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  registerIfAbsent(key: string, value: T, opts?: {
    ttlMs?: number;
  }): Promise<boolean>;
  update?: (key: string, updateValue: (current: T | undefined) => T | undefined, opts?: {
    ttlMs?: number;
  }) => Promise<boolean>; /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => Promise<boolean>;
  lookup(key: string): Promise<T | undefined>;
  consume(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<PluginStateEntry<T>[]>;
  /**
   * Bounded key-range read for owners with sortable keys. Production stores
   * provide this; owner code must treat absence as a fallback to `entries()`
   * with prefix filtering. Start is inclusive, end is exclusive, and end must
   * sort strictly greater than start.
   */
  entriesInKeyRange?: (query: PluginStateKeyRangeQuery) => Promise<PluginStateEntry<T>[]>;
  clear(): Promise<void>;
};
/** Sync plugin state API used by trusted core/plugin bootstrap paths. */
type PluginStateSyncKeyedStore<T> = {
  register(key: string, value: T, opts?: {
    ttlMs?: number;
  }): void;
  registerIfAbsent(key: string, value: T, opts?: {
    ttlMs?: number;
  }): boolean;
  update?: (key: string, updateValue: (current: T | undefined) => T | undefined, opts?: {
    ttlMs?: number;
  }) => boolean; /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[]; /** Bounded key-range read; same contract as the async variant. */
  entriesInKeyRange?: (query: PluginStateKeyRangeQuery) => PluginStateEntry<T>[];
  clear(): void;
};
/** Options for opening a keyed plugin-state namespace. */
type PluginStateOverflowPolicy = "evict-oldest" | "reject-new";
type OpenKeyedStoreOptions = {
  namespace: string;
  maxEntries: number;
  overflowPolicy?: PluginStateOverflowPolicy;
  defaultTtlMs?: number;
  env?: NodeJS.ProcessEnv;
};
//#endregion
//#region src/tasks/task-flow-registry.types.d.ts
type TaskFlowSyncMode = "task_mirrored" | "managed";
/** Lifecycle status for multi-step task flows. */
type TaskFlowStatus = "queued" | "running" | "waiting" | "blocked" | "succeeded" | "failed" | "cancelled" | "lost";
type TaskFlowRecord = {
  flowId: string;
  syncMode: TaskFlowSyncMode;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  controllerId?: string;
  revision: number;
  status: TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  blockedTaskId?: string;
  blockedSummary?: string;
  stateJson?: JsonValue;
  waitJson?: JsonValue;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};
//#endregion
//#region src/agents/tool-fs-policy.types.d.ts
/** Filesystem policy for agent tools that can touch local paths. */
type ToolFsPolicy = {
  workspaceOnly: boolean;
};
//#endregion
//#region src/plugins/tool-types.d.ts
type OpenClawPluginActiveModelContext = {
  provider?: string;
  modelId?: string;
  modelRef?: string;
};
/** Trusted execution context passed to plugin-owned agent tool factories. */
type OpenClawPluginToolContext = {
  config?: OpenClawConfig; /** Active runtime-resolved config snapshot when one is available. */
  runtimeConfig?: OpenClawConfig; /** Returns the latest runtime-resolved config snapshot for long-lived tool definitions. */
  getRuntimeConfig?: () => OpenClawConfig | undefined; /** Effective filesystem policy for the active tool run. */
  fsPolicy?: ToolFsPolicy;
  workspaceDir?: string;
  agentDir?: string;
  agentId?: string;
  sessionKey?: string; /** Ephemeral session UUID - regenerated on /new and /reset. Use for per-conversation isolation. */
  sessionId?: string; /** Out-of-band plugin-owned bindings attached by the current run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>; /** Host-prepared repository identities for project-aware tool behavior. */
  activeProjectKeys?: readonly string[]; /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
  conversationRecall?: ConversationRecallContext;
  /**
   * Runtime-supplied active model metadata for informational use, diagnostics,
   * and plugin-owned policy decisions. This is not a security boundary against
   * the local operator, installed plugin code, or a modified OpenClaw runtime.
   */
  activeModel?: OpenClawPluginActiveModelContext;
  browser?: {
    sandboxBridgeUrl?: string;
    allowHostControl?: boolean;
  };
  messageChannel?: string;
  agentAccountId?: string; /** Trusted provider auth availability from the active auth profile store. */
  hasAuthForProvider?: (providerId: string) => boolean; /** Resolves an API key from the active auth profile store when available. */
  resolveApiKeyForProvider?: (providerId: string) => Promise<string | undefined>; /** Trusted ambient delivery route for the active agent/session. */
  deliveryContext?: DeliveryContext; /** Trusted platform-native conversation id for the active inbound turn. */
  nativeChannelId?: string; /** Trusted sender id from inbound context (runtime-provided, not tool args). */
  requesterSenderId?: string; /** Trusted owner bit from inbound context (runtime-provided, not tool args). */
  senderIsOwner?: boolean;
  /**
   * Server-owned origin for this operation. Missing values are delegated.
   * Plugins must use it only for conversation-read visibility policy.
   */
  conversationReadOrigin?: ConversationReadInvocationOrigin;
  sandboxed?: boolean;
  /**
   * True for explicit one-shot local CLI runs that must release plugin-owned
   * process resources before the command exits.
   */
  oneShotCliRun?: boolean;
};
type OpenClawPluginToolFactory = (ctx: OpenClawPluginToolContext) => AnyAgentTool | AnyAgentTool[] | null | undefined;
type OpenClawPluginToolOptions = {
  name?: string;
  names?: string[];
  optional?: boolean;
};
type OpenClawPluginHookOptions = {
  entry?: HookEntry;
  name?: string;
  description?: string;
  register?: boolean;
};
//#endregion
//#region src/plugins/runtime/runtime-taskflow.types.d.ts
type ManagedTaskFlowRecord = TaskFlowRecord & {
  syncMode: "managed";
  controllerId: string;
};
type ManagedTaskFlowMutationErrorCode = "not_found" | "not_managed" | "revision_conflict" | "persist_failed";
type ManagedTaskFlowMutationResult = {
  applied: true;
  flow: ManagedTaskFlowRecord;
} | {
  applied: false;
  code: ManagedTaskFlowMutationErrorCode;
  current?: TaskFlowRecord;
};
type ManagedTaskFlowCreateParams = {
  controllerId: string;
  goal: string;
  status?: ManagedTaskFlowRecord["status"];
  notifyPolicy?: TaskNotifyPolicy;
  currentStep?: string | null;
  stateJson?: JsonValue | null;
  waitJson?: JsonValue | null;
  cancelRequestedAt?: number | null;
  createdAt?: number;
  updatedAt?: number;
  endedAt?: number | null;
};
type BoundTaskFlowTaskRunResult = {
  created: true;
  flow: ManagedTaskFlowRecord;
  task: TaskRecord;
} | {
  created: false;
  reason: string;
  found: boolean;
  flow?: TaskFlowRecord;
};
type BoundTaskFlowCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  flow?: TaskFlowRecord;
  tasks?: TaskRecord[];
};
type BoundTaskFlowRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  createManaged: (params: ManagedTaskFlowCreateParams) => ManagedTaskFlowRecord;
  tryCreateManaged: (params: ManagedTaskFlowCreateParams) => ManagedTaskFlowRecord | null;
  get: (flowId: string) => TaskFlowRecord | undefined;
  list: () => TaskFlowRecord[];
  findLatest: () => TaskFlowRecord | undefined;
  resolve: (token: string) => TaskFlowRecord | undefined;
  getTaskSummary: (flowId: string) => TaskRegistrySummary | undefined;
  setWaiting: (params: {
    flowId: string;
    expectedRevision: number;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    waitJson?: JsonValue | null;
    blockedTaskId?: string | null;
    blockedSummary?: string | null;
    updatedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  resume: (params: {
    flowId: string;
    expectedRevision: number;
    status?: Extract<ManagedTaskFlowRecord["status"], "queued" | "running">;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    updatedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  finish: (params: {
    flowId: string;
    expectedRevision: number;
    stateJson?: JsonValue | null;
    updatedAt?: number;
    endedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  fail: (params: {
    flowId: string;
    expectedRevision: number;
    stateJson?: JsonValue | null;
    blockedTaskId?: string | null;
    blockedSummary?: string | null;
    updatedAt?: number;
    endedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  requestCancel: (params: {
    flowId: string;
    expectedRevision: number;
    cancelRequestedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  cancel: (params: {
    flowId: string;
    cfg: OpenClawConfig;
  }) => Promise<BoundTaskFlowCancelResult>;
  runTask: (params: {
    flowId: string;
    runtime: TaskRuntime;
    sourceId?: string;
    childSessionKey?: string;
    parentTaskId?: string;
    agentId?: string;
    runId?: string;
    label?: string;
    task: string;
    preferMetadata?: boolean;
    notifyPolicy?: TaskNotifyPolicy;
    deliveryStatus?: TaskDeliveryStatus;
    status?: "queued" | "running";
    startedAt?: number;
    lastEventAt?: number;
    progressSummary?: string | null;
  }) => BoundTaskFlowTaskRunResult;
};
type PluginRuntimeTaskFlow = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskFlowRuntime;
  fromToolContext: (ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">) => BoundTaskFlowRuntime;
};
//#endregion
//#region src/plugins/runtime/model-auth-types.d.ts
/**
 * Runtime-ready auth result exposed to native plugins and context engines.
 *
 * `source`, `mode`, and `profileId` describe how the original credential was
 * resolved. `apiKey` is the request-ready credential after any provider-owned
 * runtime exchange, so it may differ from the stored/raw credential.
 */
type ResolvedProviderRuntimeAuth = Omit<ResolvedProviderAuth, "apiKey"> & {
  apiKey?: string;
  baseUrl?: string;
  request?: ModelProviderRequestTransportOverrides$1;
  expiresAt?: number;
};
//#endregion
//#region src/tts/tts-config.d.ts
/** Routing context used to layer global, agent, channel, and account TTS config. */
type TtsConfigResolutionContext = {
  agentId?: string;
  channelId?: string;
  accountId?: string;
};
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
declare function resolveEffectiveTtsConfig(cfg: OpenClawConfig, contextOrAgentId?: string | TtsConfigResolutionContext): TtsConfig;
//#endregion
//#region src/tts/tts-types.d.ts
/** Resolved directive override policy after config defaults are applied. */
type ResolvedTtsModelOverrides = SpeechModelOverridePolicy;
/** Fully resolved TTS runtime config consumed by synthesis and status paths. */
type ResolvedTtsConfig = {
  auto: TtsAutoMode;
  mode: TtsMode;
  provider: TtsProvider;
  providerSource: "config" | "default";
  persona?: string;
  personas: Record<string, ResolvedTtsPersona>;
  summaryModel?: string;
  modelOverrides: ResolvedTtsModelOverrides;
  providerConfigs: Record<string, SpeechProviderConfig>;
  prefsPath?: string;
  maxTextLength: number;
  timeoutMs: number;
  timeoutMsSource?: "config" | "default";
  rawConfig?: TtsConfig;
  sourceConfig?: OpenClawConfig;
};
//#endregion
//#region src/plugin-sdk/tts-runtime.types.d.ts
/** Stable reason codes for one provider attempt in a TTS fallback chain. */
type TtsAttemptReasonCode = "success" | "no_provider_registered" | "not_configured" | "unsupported_for_streaming" | "unsupported_for_telephony" | "timeout" | "provider_error";
/** Per-provider attempt record used in TTS status, logs, and result metadata. */
type TtsProviderAttempt = {
  provider: string;
  outcome: "success" | "skipped" | "failed";
  reasonCode: TtsAttemptReasonCode;
  persona?: string;
  personaBinding?: "applied" | "missing" | "none";
  latencyMs?: number;
  error?: string;
};
/** Delivery target requested for synthesized speech output. */
type TtsSpeechTarget = "audio-file" | "voice-note";
/** Standard text-to-speech request for file or stream synthesis. */
type TtsRequestParams = {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
};
/** Inputs for surface-specific config merge and directive pre-resolution. */
type PrepareTtsRequestParams = {
  cfg: OpenClawConfig;
  override?: TtsConfig;
  text: string;
};
/** Effective synthesis inputs returned before choosing file, stream, or telephony output. */
type PreparedTtsRequest = {
  cfg: OpenClawConfig;
  directives: TtsDirectiveParseResult;
};
/** Shared surface-specific TTS request preparation contract. */
type PrepareTtsRequest = (params: PrepareTtsRequestParams) => Promise<PreparedTtsRequest>;
/** Telephony-specific synthesis request where output format is constrained by the caller. */
type TtsTelephonyRequestParams = {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  overrides?: TtsDirectiveOverrides;
};
/** Inputs for listing voices from a speech provider with optional resolved config. */
type ListSpeechVoicesParams = {
  provider: string;
  cfg?: OpenClawConfig;
  config?: ResolvedTtsConfig;
  apiKey?: string;
  baseUrl?: string;
};
/** File-backed text-to-speech result returned by high-level runtime helpers. */
type TtsResult = {
  success: boolean;
  audioPath?: string;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  audioAsVoice?: boolean;
  target?: TtsSpeechTarget;
};
/** Stream-backed synthesis result with optional release hook for provider resources. */
type TtsStreamResult = {
  success: boolean;
  audioStream?: ReadableStream<Uint8Array>;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: TtsSpeechTarget;
  release?: () => Promise<void>;
};
/** Telephony synthesis result with provider voice/model and sample-rate metadata. */
type TtsTelephonyResult = {
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  latencyMs?: number;
  provider?: string;
  providerModel?: string;
  providerVoice?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
  outputFormat?: string;
  sampleRate?: number;
};
/** High-level function contract for file-backed text-to-speech synthesis. */
type TextToSpeech = (params: TtsRequestParams) => Promise<TtsResult>;
/** High-level function contract for streaming text-to-speech synthesis. */
type TextToSpeechStream = (params: TtsRequestParams) => Promise<TtsStreamResult>;
/** High-level function contract for telephony-safe text-to-speech synthesis. */
type TextToSpeechTelephony = (params: TtsTelephonyRequestParams) => Promise<TtsTelephonyResult>;
/** Function contract for provider voice discovery. */
type ListSpeechVoices = (params: ListSpeechVoicesParams) => Promise<SpeechVoiceOption[]>;
//#endregion
//#region src/plugins/runtime/task-domain-types.d.ts
/** Aggregate task-run counts exposed to plugin task views. */
type TaskRunAggregateSummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};
/** Public task run summary exposed through plugin runtime task APIs. */
type TaskRunView = {
  id: string;
  runtime: TaskRuntime;
  sourceId?: string;
  sessionKey: string;
  ownerKey: string;
  scope: TaskScopeKind;
  childSessionKey?: string;
  flowId?: string;
  parentTaskId?: string;
  agentId?: string;
  runId?: string;
  label?: string;
  title: string;
  status: TaskStatus;
  deliveryStatus: TaskDeliveryStatus;
  notifyPolicy: TaskNotifyPolicy;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  lastEventAt?: number;
  cleanupAfter?: number;
  error?: string;
  progressSummary?: string;
  terminalSummary?: string;
  terminalOutcome?: TaskTerminalOutcome;
};
/** Detailed task run view; currently equal to the summary view. */
type TaskRunDetail = TaskRunView;
/** Result returned when cancelling a task run. */
type TaskRunCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskRunDetail;
};
/** Public task flow summary exposed through plugin runtime task APIs. */
type TaskFlowView = {
  id: string;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  status: TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};
/** Detailed task flow view with state, wait, blocked, and task summary data. */
type TaskFlowDetail = TaskFlowView & {
  state?: JsonValue;
  wait?: JsonValue;
  blocked?: {
    taskId?: string;
    summary?: string;
  };
  tasks: TaskRunView[];
  taskSummary: TaskRunAggregateSummary;
};
//#endregion
//#region src/plugins/runtime/runtime-tasks.types.d.ts
type BoundTaskRunsRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  get: (taskId: string) => TaskRunDetail | undefined;
  list: () => TaskRunView[];
  findLatest: () => TaskRunDetail | undefined;
  resolve: (token: string) => TaskRunDetail | undefined;
  cancel: (params: {
    taskId: string;
    cfg: OpenClawConfig;
  }) => Promise<TaskRunCancelResult>;
};
type PluginRuntimeTaskRuns = {
  bindSession: (params: {
    sessionKey: string;
    agentId?: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskRunsRuntime;
  fromToolContext: (ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "agentId" | "deliveryContext">) => BoundTaskRunsRuntime;
};
type BoundTaskFlowsRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  get: (flowId: string) => TaskFlowDetail | undefined;
  list: () => TaskFlowView[];
  findLatest: () => TaskFlowDetail | undefined;
  resolve: (token: string) => TaskFlowDetail | undefined;
  getTaskSummary: (flowId: string) => TaskRunAggregateSummary | undefined;
};
type PluginRuntimeTaskFlows = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskFlowsRuntime;
  fromToolContext: (ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">) => BoundTaskFlowsRuntime;
};
//#endregion
//#region src/plugins/runtime/types-core.d.ts
type RuntimeRequestHeartbeatOptions = Parameters<typeof requestHeartbeat>[0];
type RuntimeRequestHeartbeatNowOptions = Omit<RuntimeRequestHeartbeatOptions, "source" | "intent"> & Partial<Pick<RuntimeRequestHeartbeatOptions, "source" | "intent">>;
type RuntimeWriteConfigOptions = {
  envSnapshotForRestore?: Record<string, string | undefined>;
  expectedConfigPath?: string;
  unsetPaths?: string[][];
};
type DeepReadonly<T> = T extends ((...args: never[]) => unknown) ? T : T extends readonly (infer U)[] ? ReadonlyArray<DeepReadonly<U>> : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
type RuntimeConfigAfterWrite = ConfigWriteAfterWrite;
type RuntimeConfigReplaceResult = ConfigReplaceResult;
type RuntimeProviderListParams = {
  config?: OpenClawConfig;
};
type RuntimeConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
};
type RuntimeMutateConfigFileParams<T = void> = {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite: RuntimeConfigAfterWrite;
  writeOptions?: RuntimeWriteConfigOptions;
  mutate: (draft: OpenClawConfig, context: RuntimeConfigMutationContext) => Promise<T | void> | T | void;
};
type RuntimeReplaceConfigFileParams = {
  nextConfig: OpenClawConfig;
  baseHash?: string;
  afterWrite: RuntimeConfigAfterWrite;
  writeOptions?: RuntimeWriteConfigOptions;
};
type RuntimeSessionEntry = SessionEntry;
type RuntimeSessionPluginExtensions = Record<string, Record<string, SessionPluginJsonValue>> | undefined;
type RuntimeSessionStoreReadParams = {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  sessionKey: string;
  readConsistency?: "latest";
  storePath?: string;
};
type RuntimeSessionStoreListParams = Partial<Omit<RuntimeSessionStoreReadParams, "sessionKey">> & {
  readOnly?: boolean;
};
type RuntimeSessionStoreEntrySummary = {
  sessionKey: string;
  entry: RuntimeSessionEntry;
};
type RuntimeCreateSessionEntryResult = {
  key: string;
  agentId: string;
  sessionId: string;
  entry: RuntimeSessionEntry;
};
type RuntimeCreateSessionEntryFinalPatch = {
  pluginExtensions: RuntimeSessionPluginExtensions;
};
type RuntimeCreateSessionEntryBaseParams = {
  cfg: OpenClawConfig;
  key: string;
  agentId?: string;
  label?: string;
  spawnedCwd?: string; /** Bind the created session's CLI execution to this paired node. */
  execNode?: string; /** Working directory interpreted only by execNode. */
  execCwd?: string;
  initialEntry: {
    agentHarnessId: string;
    modelSelectionLocked?: true;
    pluginExtensions?: RuntimeSessionPluginExtensions;
  } | {
    cliBackendId: string;
    model: string;
    cliSessionBinding: CliSessionBinding;
    modelSelectionLocked: true;
    pluginExtensions?: RuntimeSessionPluginExtensions; /** Registry-injected owner; plugin callers cannot select another owner. */
    pluginOwnerId?: string;
  } | {
    acpBackendId: string;
    acpSessionBinding: {
      acpAgentId: string;
      agentSessionId: string;
    };
    modelSelectionLocked?: true;
    pluginExtensions?: RuntimeSessionPluginExtensions; /** Registry-injected owner; plugin callers cannot select another owner. */
    pluginOwnerId?: string;
  };
};
type RuntimeCreateSessionEntryParams = RuntimeCreateSessionEntryBaseParams & ({
  /** Retry an interrupted initializer only when persisted trusted state matches exactly. */recoverMatchingInitialEntry: true;
  afterCreate: (created: RuntimeCreateSessionEntryResult) => Promise<RuntimeCreateSessionEntryFinalPatch>;
} | {
  recoverMatchingInitialEntry?: never;
  afterCreate?: (created: RuntimeCreateSessionEntryResult) => Promise<RuntimeCreateSessionEntryFinalPatch | void>;
});
type RuntimeSessionStoreEntryPatchParams = RuntimeSessionStoreReadParams & {
  fallbackEntry?: RuntimeSessionEntry;
  maintenanceConfig?: ResolvedSessionMaintenanceConfigInput;
  preserveActivity?: boolean;
  replaceEntry?: boolean;
  update: (entry: RuntimeSessionEntry, context: {
    existingEntry?: RuntimeSessionEntry;
  }) => Promise<Partial<RuntimeSessionEntry> | null> | Partial<RuntimeSessionEntry> | null;
};
type RuntimeUpsertSessionEntryParams = RuntimeSessionStoreReadParams & {
  entry: RuntimeSessionEntry;
};
type RuntimeSessionWorkAdmissionParams = {
  storePath: string;
  sessionKey: string;
  signal?: AbortSignal;
};
type RuntimeSessionStoreEntryUpdateParams = {
  storePath: string;
  sessionKey: string;
  update: (entry: RuntimeSessionEntry) => Promise<Partial<RuntimeSessionEntry> | null> | Partial<RuntimeSessionEntry> | null;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  requireWriteSuccess?: boolean;
};
/** @public Part of the PluginRuntime declaration contract. */
type PluginRuntimeThinkingPolicyRequest = {
  provider?: string | null;
  model?: string | null;
  catalog?: ThinkingCatalogEntry[];
  agentRuntime?: string | null;
};
/** @public Part of the PluginRuntime declaration contract. */
type PluginRuntimeThinkingPolicyLevel = {
  id: ThinkLevel;
  label: string;
};
/** @public Part of the PluginRuntime declaration contract. */
type PluginRuntimeThinkingPolicy = {
  levels: PluginRuntimeThinkingPolicyLevel[];
  defaultLevel?: ThinkLevel | null;
};
/** Structured logger surface injected into runtime-backed plugin helpers. */
type RuntimeLogger = {
  debug?: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
};
type RunHeartbeatOnceOptions = {
  reason?: string;
  agentId?: string;
  sessionKey?: string; /** Override heartbeat config (e.g. `{ target: "last" }` to deliver to the last active channel). */
  heartbeat?: {
    target?: string;
  };
};
type LlmCompleteMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
type LlmCompleteCaller = {
  kind: "plugin" | "context-engine" | "host" | "unknown";
  id?: string;
  name?: string;
};
type LlmCompleteUsage = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  totalTokens?: number;
  costUsd?: number;
};
type LlmCompleteCommonParams = {
  /** Model ref (e.g. "anthropic/claude-sonnet-4-6"); defaults to the target agent's configured model. */model?: string; /** Advisory output limit; runtime owners without an equivalent control may ignore it. */
  maxTokens?: number; /** Advisory sampling hint; runtime owners without an equivalent control may ignore it. */
  temperature?: number; /** Requested reasoning effort; the host normalizes it for the selected model. */
  reasoning?: ThinkLevel;
  systemPrompt?: string;
  signal?: AbortSignal; /** Human-readable reason for audit/debug output. */
  purpose?: string; /** Agent whose model/credentials to use. Session-bound capabilities may disallow overrides. */
  agentId?: string;
};
type LlmDirectCompleteParams = LlmCompleteCommonParams & {
  messages: LlmCompleteMessage[];
  execution?: undefined;
};
type LlmIsolatedAgentRuntimeCompleteParams = LlmCompleteCommonParams & {
  /** Isolated runtimes currently accept one fresh user prompt, not a replayed chat history. */messages: [{
    role: "user";
    content: string;
  }];
  execution: {
    /** Fresh, literal-zero-tool completion through the configured agent runtime. */mode: "isolated-agent-runtime"; /** Exact credential owner. Requires host-granted plugin policy. */
    authProfileId?: string;
    timeoutMs?: number;
  };
};
type LlmCompleteParams = LlmDirectCompleteParams | LlmIsolatedAgentRuntimeCompleteParams;
type LlmCompleteExecution = {
  mode: "direct-provider";
  owner: {
    kind: "provider";
    id: string;
  };
} | {
  mode: "isolated-agent-runtime";
  owner: {
    kind: "cli" | "harness";
    id: string;
  };
};
type LlmCompleteResult = {
  text: string;
  provider: string;
  model: string;
  agentId: string;
  usage: LlmCompleteUsage;
  execution: LlmCompleteExecution;
  audit: {
    caller: LlmCompleteCaller;
    purpose?: string;
    sessionKey?: string;
  };
};
type RuntimeRunEmbeddedAgentParams = Omit<RunEmbeddedAgentParams, "admittedRunContext" | "preparedRunAdmission" | "skillWorkshopCollectionReconcile">;
type RuntimeRunEmbeddedAgent = (params: RuntimeRunEmbeddedAgentParams) => Promise<EmbeddedAgentRunResult>;
/** Core runtime helpers exposed to trusted native plugins. */
type PluginRuntimeCore = {
  version: string;
  config: {
    /** Current process runtime config snapshot. Prefer config passed into the active call path. */current: () => DeepReadonly<OpenClawConfig>;
    /**
     * Persist a focused config mutation. Callers must choose the post-write
     * behavior explicitly so the gateway can hot-reload, restart, or defer.
     */
    mutateConfigFile: <T = void>(params: RuntimeMutateConfigFileParams<T>) => Promise<RuntimeConfigReplaceResult & {
      result: T | undefined;
    }>;
    /**
     * Persist a full config replacement. Callers must choose the post-write
     * behavior explicitly so the gateway can hot-reload, restart, or defer.
     */
    replaceConfigFile: (params: RuntimeReplaceConfigFileParams) => Promise<RuntimeConfigReplaceResult>;
  };
  agent: {
    defaults: {
      model: typeof DEFAULT_MODEL;
      provider: typeof DEFAULT_PROVIDER;
    };
    resolveAgentDir: typeof resolveAgentDir;
    resolveAgentWorkspaceDir: typeof resolveAgentWorkspaceDir;
    resolveAgentIdentity: typeof resolveAgentIdentity; /** Resolve an allowed catalog create target through canonical agent model/runtime policy. */
    resolveSessionCatalogCreateTarget: typeof resolveAgentCatalogCreateTarget;
    resolveThinkingDefault: (params: {
      cfg: OpenClawConfig;
      provider: string;
      model: string;
      catalog?: ModelCatalogEntry[];
    }) => ThinkLevel;
    normalizeThinkingLevel: (raw?: string | null) => ThinkLevel | undefined;
    resolveThinkingPolicy: (params: PluginRuntimeThinkingPolicyRequest) => PluginRuntimeThinkingPolicy;
    runEmbeddedAgent: RuntimeRunEmbeddedAgent; /** @deprecated Use runEmbeddedAgent. */
    runEmbeddedPiAgent: RuntimeRunEmbeddedAgent;
    resolveAgentTimeoutMs: typeof resolveAgentTimeoutMs;
    /**
     * Shares the embedded runner's CLI-backend dispatch eligibility (route,
     * registered backend, stored credential mode) so opted-in callers can
     * budget timeouts for the run that will actually execute.
     */
    resolveCliBackendDispatchEligibility: typeof resolveEmbeddedCliBackendDispatchEligibility;
    ensureAgentWorkspace: typeof ensureAgentWorkspace;
    session: {
      resolveStorePath: typeof resolveSessionStorePathCore;
      createSessionEntry: (params: RuntimeCreateSessionEntryParams) => Promise<RuntimeCreateSessionEntryResult>;
      getSessionEntry: (params: RuntimeSessionStoreReadParams) => RuntimeSessionEntry | undefined;
      listSessionEntries: (params?: RuntimeSessionStoreListParams) => RuntimeSessionStoreEntrySummary[];
      patchSessionEntry: (params: RuntimeSessionStoreEntryPatchParams) => Promise<RuntimeSessionEntry | null>;
      upsertSessionEntry: (params: RuntimeUpsertSessionEntryParams) => Promise<void>;
      runWithWorkAdmission: <T>(params: RuntimeSessionWorkAdmissionParams, run: (signal: AbortSignal) => Promise<T>) => Promise<T>;
      updateSessionStoreEntry: (params: RuntimeSessionStoreEntryUpdateParams) => Promise<RuntimeSessionEntry | null>;
    };
  };
  system: {
    enqueueSystemEvent: typeof enqueueSystemEvent;
    requestHeartbeat: typeof requestHeartbeat;
    /**
     * @deprecated Use `requestHeartbeat({ source, intent, reason })` so wake producers declare
     * scheduler intent explicitly.
     */
    requestHeartbeatNow: (opts?: RuntimeRequestHeartbeatNowOptions) => void;
    /**
     * Run a single heartbeat cycle immediately (bypassing the coalesce timer).
     * Accepts an optional `heartbeat` config override so callers can choose
     * an explicit destination or opt into internal-only `target: "none"` runs.
     */
    runHeartbeatOnce: (opts?: RunHeartbeatOnceOptions) => Promise<HeartbeatRunResult>;
    runCommandWithTimeout: typeof runCommandWithTimeout;
    formatNativeDependencyHint: typeof formatNativeDependencyHint;
  };
  media: {
    loadWebMedia: typeof loadWebMedia;
    detectMime: typeof detectMime;
    mediaKindFromMime: typeof mediaKindFromMime;
    isVoiceCompatibleAudio: typeof isVoiceCompatibleAudio;
    getImageMetadata: typeof getImageMetadata;
    resizeToJpeg: typeof resizeToJpeg;
  };
  tts: {
    prepareTtsRequest: PrepareTtsRequest;
    textToSpeech: TextToSpeech;
    textToSpeechStream: TextToSpeechStream;
    textToSpeechTelephony: TextToSpeechTelephony;
    listVoices: ListSpeechVoices;
  };
  mediaUnderstanding: {
    runFile: MediaUnderstandingRuntime["runMediaUnderstandingFile"];
    describeImageFile: MediaUnderstandingRuntime["describeImageFile"];
    describeImageFileWithModel: MediaUnderstandingRuntime["describeImageFileWithModel"];
    extractStructuredWithModel: MediaUnderstandingRuntime["extractStructuredWithModel"];
    describeVideoFile: MediaUnderstandingRuntime["describeVideoFile"];
    transcribeAudioFile: MediaUnderstandingRuntime["transcribeAudioFile"];
  };
  imageGeneration: {
    generate: (params: GenerateImageParams) => Promise<GenerateImageRuntimeResult>;
    listProviders: (params?: RuntimeProviderListParams) => ImageGenerationProvider[];
  };
  videoGeneration: {
    generate: (params: GenerateVideoParams) => Promise<GenerateVideoRuntimeResult>;
    listProviders: (params?: RuntimeProviderListParams) => VideoGenerationProvider[];
  };
  musicGeneration: {
    generate: (params: GenerateMusicParams) => Promise<GenerateMusicRuntimeResult>;
    listProviders: (params?: RuntimeProviderListParams) => MusicGenerationProvider[];
  };
  webSearch: {
    listProviders: (params?: RuntimeProviderListParams) => PluginWebSearchProviderEntry[];
    search: (params: RunWebSearchParams) => Promise<RunWebSearchResult>;
  };
  events: {
    onAgentEvent: typeof onAgentEvent;
    onSessionTranscriptUpdate: typeof onSessionTranscriptUpdate;
  };
  logging: {
    shouldLogVerbose: typeof shouldLogVerbose;
    getChildLogger: (bindings?: Record<string, unknown>, opts?: {
      level?: LogLevel;
    }) => RuntimeLogger;
  };
  state: {
    resolveStateDir: typeof resolveStateDir;
    openBlobStore: <TMetadata>(options: OpenBlobStoreOptions) => PluginBlobStore<TMetadata>;
    openKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
    openSyncKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateSyncKeyedStore<T>;
    openChannelIngressQueue: <TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options?: Omit<CreateChannelIngressQueueOptions, "channelId">) => ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
    openChannelIngressDrain: <TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: Omit<CreateChannelIngressDrainOptions<TPayload, TMetadata, TCompletedMetadata>, "queue"> & {
      queue?: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
      accountId?: string;
      stateDir?: string;
    }) => ChannelIngressDrain;
  };
  tasks: {
    runs: PluginRuntimeTaskRuns;
    flows: PluginRuntimeTaskFlows;
    managedFlows: PluginRuntimeTaskFlow;
  };
  llm: {
    complete: (params: LlmCompleteParams) => Promise<LlmCompleteResult>;
    acquireLocalService: (target: {
      providerId: string;
      baseUrl: string;
      headers?: HeadersInit;
    }, signal?: AbortSignal | null) => Promise<{
      release: () => void;
    } | undefined>;
  };
  modelAuth: {
    /** Resolve auth for a model. Only provider/model, optional cfg, and workspaceDir are used. */getApiKeyForModel: (params: {
      model: Model<Api>;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderAuth>; /** Resolve request-ready auth for a model, including provider runtime exchanges. */
    getRuntimeAuthForModel: (params: {
      model: Model<Api>;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderRuntimeAuth>; /** Resolve auth for a provider by name. Only provider, optional cfg, and workspaceDir are used. */
    resolveApiKeyForProvider: (params: {
      provider: string;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderAuth>;
  };
};
//#endregion
//#region src/context-engine/types.d.ts
type AssembleResult = {
  /** Ordered messages to use as model context */messages: AgentMessage[]; /** Estimated total tokens in assembled context */
  estimatedTokens: number;
  /**
   * Controls which token estimate the runner treats as authoritative for
   * preemptive overflow prechecks. The returned `messages` are always the
   * prompt sent to the model; this only affects the precheck's token comparison.
   *
   * - "assembled": the generic precheck uses only the assembled prompt's estimate
   *   unless the engine owns compaction; owning engines manage prompt admission.
   * - "preassembly_may_overflow": the precheck takes the maximum of the
   *   assembled estimate and the pre-assembly (unwindowed) session-history
   *   estimate. Engines opt into this when their assembled view can hide an
   *   overflow that would still affect the underlying transcript. This opt-in
   *   keeps the generic precheck active even for engines that own compaction.
   *
   * Defaults to "assembled".
   */
  promptAuthority?: "assembled" | "preassembly_may_overflow"; /** Optional context-engine-provided instructions prepended to the runtime system prompt */
  systemPromptAddition?: string;
  /**
   * Optional projection lifecycle for hosts with persistent backend threads.
   *
   * Context engines that return `thread_bootstrap` ask the host to inject the
   * assembled context once for the supplied epoch, then reuse the backend
   * thread until the epoch changes. Engines that omit this field retain the
   * legacy per-turn projection behavior.
   */
  contextProjection?: ContextEngineProjection;
};
type ContextEngineProjection = {
  /** How the assembled context should be projected into the backend runtime. */mode: "per_turn" | "thread_bootstrap"; /** Stable context epoch. Changing this tells persistent backends to rotate. */
  epoch?: string; /** Optional diagnostic fingerprint for the projected context payload. */
  fingerprint?: string;
};
type ContextEngineOperation = "agent-run" | "manual-compact" | "subagent-spawn";
type ContextEngineRuntimeMode = "normal" | "fallback" | "degraded";
type ContextEngineSelectionSource = "configured" | "default" | "unknown";
type ContextEngineRuntimeReasonCode = "provider_timeout" | "provider_unavailable" | "rate_limited" | "context_overflow" | "runtime_unavailable" | "unknown";
type ContextEngineHostCapability = "bootstrap" | "assemble-before-prompt" | "after-turn" | "maintain" | "compact" | "runtime-llm-complete" | "thread-bootstrap-projection";
type ContextEngineHostRequirements = {
  /** Host capabilities required before the engine can safely serve this operation. */requiredCapabilities: ContextEngineHostCapability[]; /** Optional engine-authored guidance appended to the host compatibility error. */
  unsupportedMessage?: string;
};
type ContextEngineRuntimeSettings = {
  schemaVersion: 1;
  runtime: {
    host: "openclaw";
    mode: ContextEngineRuntimeMode;
    harnessId: string | null;
    runtimeId: string | null;
  };
  model: {
    requested: string | null;
    resolved: string | null;
    provider: string | null;
    family: string | null;
  };
  contextEngineSelection: {
    selectedId: string | null;
    source: ContextEngineSelectionSource;
  };
  executionHost: {
    id: string | null;
    label: string | null;
  };
  limits: {
    promptTokenBudget: number | null;
    maxOutputTokens: number | null;
  };
  diagnostics: {
    fallbackReason: ContextEngineRuntimeReasonCode | null;
    degradedReason: ContextEngineRuntimeReasonCode | null;
  };
};
type CompactResult = {
  ok: boolean;
  compacted: boolean;
  reason?: string;
  result?: {
    summary?: string;
    firstKeptEntryId?: string;
    tokensBefore: number;
    tokensAfter?: number;
    details?: unknown; /** Session id after compaction, when the runtime rotated transcripts. */
    sessionId?: string; /** Typed post-compaction live session target; successor when the runtime rotated transcripts. */
    sessionTarget?: ContextEngineSessionTarget;
    /**
     * Raw session file path after compaction.
     *
     * @deprecated Use `sessionTarget`. Shipped plugin-sdk contract: released
     * third-party context engines (v2026.6.x and earlier) report rotated
     * transcripts through this field. Remove once typed session targets are
     * the only successor contract.
     */
    sessionFile?: string;
  };
};
type IngestResult = {
  /** Whether the message was ingested (false if duplicate or no-op) */ingested: boolean;
};
type IngestBatchResult = {
  /** Number of messages ingested from the supplied batch */ingestedCount: number;
};
type BootstrapResult = {
  /** Whether bootstrap ran and initialized the engine's store */bootstrapped: boolean; /** Number of historical messages imported (if applicable) */
  importedMessages?: number; /** Optional reason when bootstrap was skipped */
  reason?: string;
};
type ContextEngineInfo = {
  id: string;
  name: string;
  version?: string;
  acceptedHostParams?: string[];
  transcriptSemantics?: {
    currentTurnFence?: "before-current-turn-entry-v1";
    turnAdvancementIdempotency?: "atomic-idempotent-v1";
  }; /** True when the engine manages its own compaction lifecycle. */
  ownsCompaction?: boolean;
  /**
   * Controls how turn-triggered maintenance should be executed.
   *
   * Engines remain compatible by default unless the host explicitly opts into
   * background turn maintenance.
   */
  turnMaintenanceMode?: "foreground" | "background";
  /**
   * Host capability requirements for operations where using an unsupported
   * runtime would silently degrade or corrupt the engine's behavior.
   */
  hostRequirements?: Partial<Record<ContextEngineOperation, ContextEngineHostRequirements>>;
};
type SubagentSpawnPreparation = {
  /** Roll back pre-spawn setup when subagent launch fails. */rollback: () => void | Promise<void>;
};
type SubagentEndReason = "deleted" | "completed" | "swept" | "released";
type TranscriptRewriteReplacement = {
  /** Existing transcript entry id to replace on the active branch. */entryId: string; /** Replacement message content for that entry. */
  message: AgentMessage;
};
type TranscriptRewriteRequest = {
  /** Message entry replacements to apply in one branch-and-reappend pass. */replacements: TranscriptRewriteReplacement[]; /** Optional entry-id set that must cover every active-branch entry from the first replacement onward. */
  allowedRewriteSuffixEntryIds?: string[];
};
type TranscriptRewriteResult = {
  /** Whether the active branch changed. */changed: boolean; /** Estimated bytes removed from the active branch message payloads. */
  bytesFreed: number; /** Number of transcript message entries rewritten. */
  rewrittenEntries: number; /** Optional reason when no rewrite occurred. */
  reason?: string;
};
type ContextEngineMaintenanceResult = TranscriptRewriteResult;
type ContextEnginePromptCacheRetention = "none" | "short" | "long" | "in_memory" | "24h";
type ContextEnginePromptCacheUsage = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  contextUsage?: {
    state: "available";
    promptTokens: number;
    totalTokens: number;
  } | {
    state: "unavailable";
  };
  total?: number;
};
type ContextEnginePromptCacheObservationChangeCode = "cacheRetention" | "model" | "streamStrategy" | "systemPrompt" | "tools" | "transport";
type ContextEnginePromptCacheObservationChange = {
  code: ContextEnginePromptCacheObservationChangeCode;
  detail: string;
};
type ContextEnginePromptCacheObservation = {
  broke: boolean;
  previousCacheRead?: number;
  cacheRead?: number;
  changes?: ContextEnginePromptCacheObservationChange[];
};
type ContextEnginePromptCacheInfo = {
  /** Runtime-resolved retention for the actual provider/model/request path. */retention?: ContextEnginePromptCacheRetention; /** Usage from the most recent API call, not accumulated retry/tool-loop totals. */
  lastCallUsage?: ContextEnginePromptCacheUsage; /** Result from the runtime's prompt-cache observability heuristic. */
  observation?: ContextEnginePromptCacheObservation; /** Last known cache-touch timestamp from runtime-managed cache-TTL bookkeeping. */
  lastCacheTouchAt?: number; /** Known cache expiry time when the runtime can source it confidently. */
  expiresAt?: number;
};
type ContextEngineTranscriptStorageInfo = {
  /**
   * Authoritative transcript backend for this runtime turn.
   *
   * Hosts may still pass legacy locator fields such as `sessionFile` for older
   * plugin contracts, but context engines should use this field to decide
   * whether that locator is a live transcript source.
   */
  kind: "sqlite";
};
type ContextEngineSessionTarget = {
  /** Agent that owns the session in the runtime store. */agentId?: string; /** Runtime session id to compact. */
  sessionId?: string; /** Stable session key used for aliases, policy, and store resolution. */
  sessionKey?: string; /** Session store path that scopes the SQLite-backed runtime session. */
  storePath?: string; /** Optional transport thread identity for session target resolution. */
  threadId?: string | number;
};
type ContextEngineRuntimeContext = Record<string, unknown> & {
  /** Runtime task working directory; workspaceDir remains the agent bootstrap workspace. */cwd?: string;
  /**
   * True when the host has explicitly opted this maintenance run into
   * consuming deferred compaction debt.
   */
  allowDeferredCompactionExecution?: boolean; /** Runtime-resolved context window budget for the active model call. */
  tokenBudget?: number; /** Selected agent harness id when compaction delegates back to the runtime. */
  agentHarnessId?: string; /** Best-effort current prompt/context token estimate for this turn. */
  currentTokenCount?: number; /** Optional prompt-cache telemetry for cache-aware engines. */
  promptCache?: ContextEnginePromptCacheInfo; /** Authoritative transcript backend for this turn. */
  transcriptStorage?: ContextEngineTranscriptStorageInfo; /** Storage-neutral runtime session target for compaction delegation. */
  sessionTarget?: ContextEngineSessionTarget;
  /**
   * Safe transcript rewrite helper implemented by the runtime.
   *
   * Engines decide what is safe to rewrite; the runtime owns how the session
   * DAG is updated on disk.
   */
  rewriteTranscriptEntries?: (request: TranscriptRewriteRequest) => Promise<TranscriptRewriteResult>; /** LLM completion capability for engines that need model inference. */
  llm?: {
    complete: (params: LlmCompleteParams) => Promise<LlmCompleteResult>;
  };
};
/**
 * ContextEngine defines the pluggable contract for context management.
 *
 * Required methods define a generic lifecycle; optional methods allow engines
 * to provide additional capabilities (retrieval, lineage, etc.).
 */
interface ContextEngine {
  /** Engine identifier and metadata */
  readonly info: ContextEngineInfo;
  /**
   * Initialize engine state for a session, optionally importing historical context.
   */
  bootstrap?(params: {
    sessionId: string;
    sessionKey?: string; /** Current persisted transcript messages for storage-neutral engines. */
    messages?: AgentMessage[]; /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<BootstrapResult>;
  /**
   * Run transcript maintenance after bootstrap, successful turns, or compaction.
   *
   * Engines can use runtimeContext.rewriteTranscriptEntries() to request safe
   * branch-and-reappend transcript rewrites without depending on runner internals.
   */
  maintain?(params: {
    sessionId: string;
    sessionKey?: string; /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<ContextEngineMaintenanceResult>;
  /**
   * Ingest a single message into the engine's store.
   */
  ingest(params: {
    sessionId: string;
    sessionKey?: string;
    message: AgentMessage; /** True when the message belongs to a heartbeat run. */
    isHeartbeat?: boolean;
  }): Promise<IngestResult>;
  /**
   * Ingest a completed turn batch as a single unit.
   */
  ingestBatch?(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[]; /** True when the batch belongs to a heartbeat run. */
    isHeartbeat?: boolean;
  }): Promise<IngestBatchResult>;
  /**
   * Execute optional post-turn lifecycle work after a run attempt completes.
   * Engines can use this to persist canonical context and trigger background
   * compaction decisions.
   */
  afterTurn?(params: {
    sessionId: string;
    sessionKey?: string; /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    messages: AgentMessage[]; /** Number of messages that existed before the prompt was sent. */
    prePromptMessageCount: number; /** Optional auto-compaction summary emitted by the runtime. */
    autoCompactionSummary?: string; /** True when this turn belongs to a heartbeat run. */
    isHeartbeat?: boolean; /** Optional model context token budget for proactive compaction. */
    tokenBudget?: number; /** Optional runtime-owned context for engines that need caller state. */
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<void>;
  /**
   * Atomically and idempotently commit one accepted durable transcript turn.
   * Messages span the admitted user entry through the accepted terminal entry.
   * Hosts may retry the same advancement key after process or plugin failure.
   */
  commitTurn?(params: {
    advancementKey: string;
    admission: TranscriptTurnAdmission;
    terminal: TranscriptEntryAnchor;
    messages: AgentMessage[];
    sessionId: string;
    sessionKey?: string;
    sessionTarget?: ContextEngineSessionTarget;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
    isHeartbeat?: boolean;
  }): Promise<{
    status: "committed" | "duplicate";
  }>;
  /**
   * Assemble model context under a token budget.
   * Returns an ordered set of messages ready for the model.
   */
  assemble(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[];
    tokenBudget?: number; /** Tool names available for this run so engines can align prompt guidance with runtime tool access. */
    availableTools?: Set<string>; /** Active memory citation mode when engines want to mirror memory prompt guidance. */
    citationsMode?: MemoryCitationsMode;
    /** Current model identifier (e.g. "claude-opus-4", "gpt-4o", "qwen2.5-7b").
     *  Allows context engine plugins to adapt formatting per model. */
    model?: string; /** The incoming user prompt for this turn (useful for retrieval-oriented engines). */
    prompt?: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<AssembleResult>;
  /**
   * Compact context to reduce token usage.
   * May create summaries, prune old turns, etc.
   *
   * The host always bounds this call with a finite safety timeout (the same
   * one that protects native runtime compaction). Engines that run long
   * operations SHOULD additionally honor `abortSignal` so an in-flight
   * compaction can be canceled promptly on run abort or host timeout instead
   * of running to completion in the background.
   */
  compact(params: {
    sessionId: string;
    sessionKey: string; /** Caller-resolved owner agent for global session aliases. */
    agentId?: string; /** Storage-neutral runtime session target for delegated compaction. */
    sessionTarget?: ContextEngineSessionTarget;
    tokenBudget?: number; /** Force compaction even below the default trigger threshold. */
    force?: boolean; /** Optional live token estimate from the caller's active context. */
    currentTokenCount?: number; /** Controls convergence target; defaults to budget. */
    compactionTarget?: "budget" | "threshold";
    customInstructions?: string; /** Optional runtime-owned context for engines that need caller state. */
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
    /**
     * Optional abort signal honored before and during compaction. The host
     * aborts it on run-level abort or when its compaction safety timeout
     * fires; engines should stop work and reject promptly when it aborts.
     */
    abortSignal?: AbortSignal;
  }): Promise<CompactResult>;
  /**
   * Prepare context-engine-managed subagent state before the child run starts.
   *
   * Implementations can return a rollback handle that is invoked when spawn
   * fails after preparation succeeds.
   */
  prepareSubagentSpawn?(params: {
    parentSessionKey: string;
    childSessionKey: string;
    contextMode?: "isolated" | "fork";
    parentSessionId?: string;
    parentSessionFile?: string;
    childSessionId?: string;
    childSessionFile?: string;
    ttlMs?: number;
  }): Promise<SubagentSpawnPreparation | undefined>;
  /**
   * Notify the context engine that a subagent lifecycle ended.
   */
  onSubagentEnded?(params: {
    childSessionKey: string;
    reason: SubagentEndReason;
  }): Promise<void>;
  /**
   * Dispose of any resources held by the engine.
   */
  dispose?(): Promise<void>;
}
//#endregion
//#region src/tasks/agent-harness-task-runtime-scope.d.ts
type AgentHarnessTaskRuntimeScope = {
  readonly requesterSessionKey: string;
  readonly requesterOrigin?: DeliveryContext;
};
//#endregion
//#region src/agents/agent-run-terminal-outcome.d.ts
type AgentRunAttemptFailureSource = "prompt" | "compaction" | "precheck" | "hook:before_agent_run";
type AgentRunAttemptFailure = {
  source: AgentRunAttemptFailureSource;
  error: unknown;
};
type AgentRunAttemptTimeoutObservation = "compaction" | "tool_execution";
type AgentRunAttemptTimeoutSource = "runtime" | "run_budget" | "idle" | "external";
type AgentRunAttemptTerminal = {
  kind: "ok";
} | {
  kind: "aborted";
  source: "runtime" | "external" | "yield_cleanup";
  failure?: AgentRunAttemptFailure;
  timeoutObservation?: AgentRunAttemptTimeoutObservation;
} | {
  kind: "timeout"; /** Non-terminal observations preserve timeout detail without interrupting the attempt. */
  phase: AgentRunAttemptTimeoutObservation;
  source: "observation";
  failure?: AgentRunAttemptFailure;
} | {
  kind: "timeout";
  phase: "prompt" | AgentRunAttemptTimeoutObservation;
  source: AgentRunAttemptTimeoutSource; /** Present only when timeout handling also aborted the live harness run. */
  aborted?: true;
  failure?: AgentRunAttemptFailure;
} | {
  kind: "failed";
  source: AgentRunAttemptFailureSource;
  error: unknown;
  timeoutObservation?: AgentRunAttemptTimeoutObservation;
};
type LegacyAgentRunAttemptTerminalInput = {
  aborted?: boolean;
  externalAbort?: boolean;
  idleTimedOut?: boolean;
  promptError?: unknown;
  promptErrorSource?: AgentRunAttemptFailureSource | null;
  timedOut?: boolean;
  timedOutByRunBudget?: boolean;
  timedOutDuringCompaction?: boolean;
  timedOutDuringToolExecution?: boolean;
};
/** Replaces attempt failure detail without changing a stronger interruption. */
declare function setAgentRunAttemptTerminalFailure(terminal: AgentRunAttemptTerminal, failure: AgentRunAttemptFailure | null): AgentRunAttemptTerminal;
/** Merges attempt observations while keeping terminal precedence in one owner. */
declare function mergeAgentRunAttemptTerminal(current: AgentRunAttemptTerminal, incoming: AgentRunAttemptTerminal): AgentRunAttemptTerminal;
/** Normalizes the shipped harness result shape at the Plugin SDK boundary. */
declare function normalizeAgentRunAttemptTerminal(input: LegacyAgentRunAttemptTerminalInput): AgentRunAttemptTerminal;
/** Projects the closed attempt terminal into legacy event/meta fields. */
declare function projectAgentRunAttemptTerminal(terminal: AgentRunAttemptTerminal): {
  aborted: boolean;
  cleanupYieldAborted: boolean;
  externalAbort: boolean;
  failed: boolean;
  idleTimedOut: boolean;
  interrupted: boolean;
  promptError: unknown;
  promptErrorSource: AgentRunAttemptFailureSource | null;
  timedOut: boolean;
  timedOutByRunBudget: boolean;
  timedOutDuringCompaction: boolean;
  timedOutDuringToolExecution: boolean;
};
//#endregion
//#region src/agents/delegation-capability.d.ts
type DelegationCapability = "full" | "report_only";
//#endregion
//#region src/plugin-sdk/provider-model-types.d.ts
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */compatibleIds: readonly string[];
};
//#endregion
//#region src/agents/runtime-plan/types.d.ts
/** Runtime transport selected for one model attempt. */
type AgentRuntimeTransport = "sse" | "websocket" | "websocket-cached" | "auto";
/** Thinking levels accepted by runtime-plan extra-param preparation. */
type AgentRuntimeThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
/** System prompt rendering mode selected for one attempt. */
type AgentRuntimePromptMode = "full" | "minimal" | "none";
/** Trigger source that can alter provider system prompt contributions. */
type AgentRuntimePromptTrigger = "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
/** Normalized failure reason used by model fallback classification. */
type AgentRuntimeFailoverReason = "auth" | "auth_permanent" | "format" | "rate_limit" | "overloaded" | "billing" | "server_error" | "timeout" | "tls_certificate" | "context_overflow" | "model_not_found" | "session_expired" | "empty_response" | "no_error_details" | "unclassified" | "unknown";
/** Provider/runtime config object passed through plugin boundaries. */
type AgentRuntimeConfig = unknown;
/** Provider model descriptor consumed by runtime-plan hooks. */
type AgentRuntimeModel = {
  id?: string;
  name?: string;
  api?: string;
  provider?: string;
  baseUrl?: string;
  reasoning?: boolean;
  input?: readonly string[];
  cost?: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  contextWindow?: number;
  maxTokens?: number;
  contextTokens?: number;
  compat?: unknown;
};
/** Text replacement rule used by provider input/output transforms. */
type AgentRuntimeTextReplacement = {
  from: string | RegExp;
  to: string;
};
/** Provider text transforms applied around model calls. */
type AgentRuntimeTextTransforms = {
  input?: AgentRuntimeTextReplacement[];
  output?: AgentRuntimeTextReplacement[];
};
/** Resolved provider runtime handle forwarded to plugin-owned hooks. */
type AgentRuntimeProviderHandle = {
  provider: string;
  modelId?: string | null;
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
};
type PreparedAgentRuntimeProviderHandle = AgentRuntimeProviderHandle & {
  modelId: string | null;
  prepared: true;
};
type AgentRuntimeInteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
type AgentRuntimeMessagePresentationAction = {
  type: "command";
  command: string;
} | {
  type: "callback";
  value: string;
} | {
  type: "approval";
  approvalId: string;
  approvalKind: "exec" | "plugin";
  decision: "allow-once" | "allow-always" | "deny";
} | {
  type: "question";
  questionId: string;
  optionValue: string;
} | {
  type: "url";
  url: string;
} | {
  type: "web-app";
  url: string;
  widgetId?: string;
} | {
  type: "web-app";
  url?: string;
  widgetId: string;
} | ModelPickerAction;
/** Portable action control exposed to agent runtime reply payloads. */
type AgentRuntimeMessagePresentationButton = {
  /** User-visible button label. */label: string; /** Typed action sent when pressed. */
  action?: AgentRuntimeMessagePresentationAction; /** @deprecated Use action. */
  value?: string; /** @deprecated Use an action with type "url". */
  url?: string; /** @deprecated Use an action with type "web-app". */
  webApp?: {
    url: string;
  }; /** @deprecated Use an action with type "web-app". */
  web_app?: {
    url: string;
  }; /** Higher values are kept first when channel action limits require dropping controls. */
  priority?: number; /** Disabled action hint; channels without disabled-state support render fallback text. */
  disabled?: boolean; /** Optional visual style hint for renderers that support styled actions. */
  style?: AgentRuntimeInteractiveButtonStyle;
};
/** Portable select/menu option exposed to agent runtime reply payloads. */
type AgentRuntimeMessagePresentationOption = {
  /** User-visible option label. */label: string; /** Typed action sent when selected. */
  action?: Extract<AgentRuntimeMessagePresentationAction, {
    type: "command" | "callback" | "model-picker";
  }>; /** @deprecated Use action. */
  value?: string;
};
type AgentRuntimeLegacyInteractiveReply = {
  blocks: Array<{
    type: "text";
    text: string;
  } | {
    type: "buttons";
    buttons: AgentRuntimeMessagePresentationButton[];
  } | {
    type: "select";
    placeholder?: string;
    options: AgentRuntimeMessagePresentationOption[];
  }>;
};
/** Portable reply presentation severity/style hint. */
type AgentRuntimeMessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
type AgentRuntimeMessagePresentationChartBlock = {
  type: "chart";
  chartType: "pie";
  title: string;
  segments: Array<{
    label: string;
    value: number;
  }>;
} | {
  type: "chart";
  chartType: "bar" | "area" | "line";
  title: string;
  categories: string[];
  series: Array<{
    name: string;
    values: number[];
  }>;
  xLabel?: string;
  yLabel?: string;
};
type AgentRuntimeMessagePresentationTableCell = string | number;
type AgentRuntimeMessagePresentationTableBlock = {
  type: "table";
  caption: string;
  headers: string[];
  rows: AgentRuntimeMessagePresentationTableCell[][];
  rowHeaderColumnIndex?: number;
};
/** Portable structured reply block rendered or downgraded by channels. */
type AgentRuntimeMessagePresentationBlock = {
  type: "text";
  text: string;
} | {
  type: "context";
  text: string;
} | {
  type: "divider";
} | {
  type: "buttons";
  buttons: AgentRuntimeMessagePresentationButton[];
} | {
  type: "select";
  placeholder?: string;
  options: AgentRuntimeMessagePresentationOption[];
} | AgentRuntimeMessagePresentationChartBlock | AgentRuntimeMessagePresentationTableBlock;
/** Portable structured reply presentation for channel adapters. */
type AgentRuntimeMessagePresentation = {
  /** Optional short heading rendered before blocks when supported. */title?: string; /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: AgentRuntimeMessagePresentationTone; /** Ordered portable blocks rendered or downgraded by channel adapters. */
  blocks: AgentRuntimeMessagePresentationBlock[];
};
/** Delivery pin options attached to runtime reply payloads. */
type AgentRuntimeReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};
/** Delivery instructions attached to runtime reply payloads. */
type AgentRuntimeReplyPayloadDelivery = {
  pin?: boolean | AgentRuntimeReplyPayloadDeliveryPin;
};
type AgentRuntimeReplyPayloadLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
};
/** Portable reply payload emitted by agent runtimes before channel rendering. */
type AgentRuntimeReplyPayload = {
  text?: string;
  fallbackText?: {
    text: string;
    replacesPayloadIndex?: number;
  };
  mediaUrl?: string;
  mediaUrls?: string[];
  attachments?: Array<{
    type?: "image" | "audio" | "video" | "file";
    path?: string;
    url?: string;
    mediaUrl?: string;
    filePath?: string;
    mimeType?: string;
    name?: string;
    sizeBytes?: number;
    durationMs?: number;
    width?: number;
    height?: number;
    trustedLocalMedia?: boolean;
  }>;
  trustedLocalMedia?: boolean;
  sensitiveMedia?: boolean;
  presentation?: AgentRuntimeMessagePresentation;
  presentationTextMode?: "fallback";
  delivery?: AgentRuntimeReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   */
  interactive?: AgentRuntimeLegacyInteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean;
  audioAsVoice?: boolean;
  videoAsNote?: boolean;
  location?: AgentRuntimeReplyPayloadLocation;
  spokenText?: string;
  ttsSupplement?: {
    spokenText: string;
    visibleTextAlreadyDelivered?: boolean;
  };
  isError?: boolean;
  isReasoning?: boolean; /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
  isReasoningSnapshot?: boolean;
  isCompactionNotice?: boolean;
  isFallbackNotice?: boolean;
  isStatusNotice?: boolean;
  channelData?: Record<string, unknown>;
};
/** Stable section IDs for provider system prompt overrides. */
type AgentRuntimeSystemPromptSectionId = "interaction_style" | "tool_call_style" | "execution_bias";
/** Provider-owned system prompt contribution and section overrides. */
type AgentRuntimeSystemPromptContribution = {
  stablePrefix?: string;
  dynamicSuffix?: string;
  sectionOverrides?: Partial<Record<AgentRuntimeSystemPromptSectionId, string>>;
};
/** Context passed when resolving provider system prompt contributions. */
type AgentRuntimeSystemPromptContributionContext = {
  config?: AgentRuntimeConfig;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  promptMode: AgentRuntimePromptMode;
  runtimeChannel?: string;
  runtimeCapabilities?: string[];
  agentId?: string;
  trigger?: AgentRuntimePromptTrigger;
};
/** Provider fallback route decision for follow-up delivery. */
type AgentRuntimeFollowupFallbackRouteResult = {
  route?: "origin" | "dispatcher" | "drop";
  reason?: string;
};
/** Tool-call id sanitizer mode for provider transcript policy. */
type AgentRuntimeToolCallIdMode = "strict" | "strict9";
/** Provider transcript sanitation, repair, and validation policy. */
type AgentRuntimeTranscriptPolicy = {
  sanitizeMode: "full" | "images-only";
  sanitizeToolCallIds: boolean;
  toolCallIdMode?: AgentRuntimeToolCallIdMode;
  duplicateToolCallIdStyle?: "openai";
  preserveNativeAnthropicToolUseIds: boolean;
  repairToolUseResultPairing: boolean;
  preserveSignatures: boolean;
  sanitizeThoughtSignatures?: {
    allowBase64Only?: boolean;
    includeCamelCase?: boolean;
  };
  dropThinkingBlocks: boolean;
  dropReasoningFromHistory?: boolean;
  applyGoogleTurnOrdering: boolean;
  validateGeminiTurns: boolean;
  validateAnthropicTurns: boolean;
  allowSyntheticToolResults: boolean;
};
/** Classified model-call failure or success observation for fallback. */
type AgentRuntimeOutcomeClassification = {
  message: string;
  reason?: AgentRuntimeFailoverReason;
  status?: number;
  code?: string;
  rawError?: string;
} | {
  error: unknown;
} | null | undefined;
/** Runtime hook that classifies run results for model fallback. */
type AgentRuntimeOutcomeClassifier = (params: {
  provider: string;
  model: string;
  result: unknown;
  hasDirectlySentBlockReply?: boolean;
  hasBlockReplyPipelineOutput?: boolean;
}) => AgentRuntimeOutcomeClassification;
/** Resolved provider/model/harness/transport reference for an attempt. */
type AgentRuntimeResolvedRef = {
  provider: string;
  modelId: string;
  modelApi?: string;
  harnessId?: string;
  transport?: AgentRuntimeTransport;
};
/** Concrete provider-owned route selected for one runtime attempt. */
type AgentRuntimeAuthModelRoute = {
  provider: string;
  modelId: string;
  api: ModelApi;
  baseUrl: string;
  authRequirement: "api-key" | "subscription"; /** Secret-free request behavior that the selected runtime must reproduce. */
  requestTransportOverrides: ProviderRouteOverridePresence; /** Provider-owned native-runtime compatibility for this concrete route. */
  runtimePolicy?: ProviderModelRouteRuntimePolicy;
};
/** Common native-runtime support proven across every route left to the harness. */
type AgentRuntimeAuthDeferredRouteSupport = {
  requestTransportOverrides: ProviderRouteOverridePresence;
  runtimePolicy: ProviderModelRouteRuntimePolicy;
};
/** Auth forwarding decision for one runtime attempt. */
type AgentRuntimeAuthPlan = {
  providerForAuth: string; /** Model whose order, cooldown, and route facts produced this plan. */
  modelId?: string;
  authProfileProviderForAuth: string;
  harnessAuthProvider?: string; /** Preferred or user-locked profile; automatic selection may not have resolved its secret yet. */
  forwardedAuthProfileId?: string;
  forwardedAuthProfileSource?: "auto" | "user"; /** Ordered exhaustive candidates for the selected route; a singleton is terminal. */
  forwardedAuthProfileCandidateIds?: string[]; /** Exact selected credential/config mode; secret-free route materialization input. */
  selectedAuthMode?: string; /** Concrete provider-owned route selected before runtime dispatch. */
  modelRoute?: AgentRuntimeAuthModelRoute; /** Secret-free support shared by every route deferred to harness-owned auth. */
  deferredRouteSupport?: AgentRuntimeAuthDeferredRouteSupport;
};
/** Prompt transforms and provider contribution hooks for one runtime attempt. */
type AgentRuntimePromptPlan = {
  provider: string;
  modelId: string;
  textTransforms?: AgentRuntimeTextTransforms;
  resolveSystemPromptContribution(context: AgentRuntimeSystemPromptContributionContext): AgentRuntimeSystemPromptContribution | undefined;
  transformSystemPrompt(context: AgentRuntimeSystemPromptContributionContext & {
    systemPrompt: string;
  }): string;
};
/** Prepared plugin metadata snapshot kept opaque to runtime-plan consumers. */
type AgentRuntimePreparedMetadataSnapshot = object;
/** Prepared metadata loader used by tool planning without eager manifest reads. */
type PreparedOpenClawToolPlanning = {
  metadataSnapshot?: AgentRuntimePreparedMetadataSnapshot;
  loadMetadataSnapshot?: () => AgentRuntimePreparedMetadataSnapshot;
};
/** Tool normalization and diagnostics hooks for one runtime attempt. */
type AgentRuntimeToolPlan = {
  preparedPlanning?: PreparedOpenClawToolPlanning;
  normalize<TSchemaType extends TSchema = TSchema, TResult = unknown>(tools: AgentTool<TSchemaType, TResult>[], params?: {
    workspaceDir?: string;
    modelApi?: string;
    model?: AgentRuntimeModel;
  }): AgentTool<TSchemaType, TResult>[];
  logDiagnostics(tools: AgentTool[], params?: {
    workspaceDir?: string;
    modelApi?: string;
    model?: AgentRuntimeModel;
  }): void;
};
/** Delivery behavior hooks for one runtime attempt. */
type AgentRuntimeDeliveryPlan = {
  isSilentPayload(payload: Pick<AgentRuntimeReplyPayload, "text" | "mediaUrl" | "mediaUrls" | "presentation" | "interactive" | "channelData">): boolean;
  resolveFollowupRoute(params: {
    payload: AgentRuntimeReplyPayload;
    originatingChannel?: string;
    originatingTo?: string;
    originRoutable: boolean;
    dispatcherAvailable: boolean;
  }): AgentRuntimeFollowupFallbackRouteResult | undefined;
};
/** Outcome classification hooks for one runtime attempt. */
type AgentRuntimeOutcomePlan = {
  classifyRunResult: AgentRuntimeOutcomeClassifier;
};
/** Extra transport parameter plan for one runtime attempt. */
type AgentRuntimeTransportPlan = {
  extraParams: Record<string, unknown>;
  resolveExtraParams(params?: {
    extraParamsOverride?: Record<string, unknown>;
    thinkingLevel?: AgentRuntimeThinkLevel;
    agentId?: string;
    workspaceDir?: string;
    model?: AgentRuntimeModel;
    resolvedTransport?: AgentRuntimeTransport;
  }): Record<string, unknown>;
};
/** Complete prepared runtime plan consumed by embedded-agent attempts. */
type AgentRuntimePlan = {
  resolvedRef: AgentRuntimeResolvedRef;
  providerRuntimeHandle?: PreparedAgentRuntimeProviderHandle;
  auth: AgentRuntimeAuthPlan;
  prompt: AgentRuntimePromptPlan;
  tools: AgentRuntimeToolPlan;
  transcript: {
    policy: AgentRuntimeTranscriptPolicy;
    resolvePolicy(params?: {
      workspaceDir?: string;
      modelApi?: string;
      model?: AgentRuntimeModel;
    }): AgentRuntimeTranscriptPolicy;
  };
  delivery: AgentRuntimeDeliveryPlan;
  outcome: AgentRuntimeOutcomePlan;
  transport: AgentRuntimeTransportPlan;
  observability: {
    resolvedRef: string;
    provider: string;
    modelId: string;
    modelApi?: string;
    harnessId?: string;
    authProfileId?: string;
    transport?: AgentRuntimeTransport;
  };
};
/** Inputs needed to build the full prepared runtime plan. */
type BuildAgentRuntimePlanParams = {
  config?: AgentRuntimeConfig;
  workspaceDir?: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  model?: AgentRuntimeModel;
  modelApi?: string | null;
  harnessId?: string;
  harnessRuntime?: string;
  allowHarnessAuthProfileForwarding?: boolean; /** Canonical route/auth decision prepared before attempt orchestration. */
  preparedAuthPlan?: AgentRuntimeAuthPlan;
  authProfileProvider?: string;
  authProfileMode?: string;
  sessionAuthProfileId?: string;
  sessionAuthProfileSource?: "auto" | "user";
  sessionAuthProfileCandidateIds?: string[];
  authProfileStore?: AuthProfileStore;
  modelRoute?: AgentRuntimeAuthModelRoute;
  agentId?: string;
  thinkingLevel?: AgentRuntimeThinkLevel;
  extraParamsOverride?: Record<string, unknown>;
  resolvedTransport?: AgentRuntimeTransport; /** Omit only when a standalone caller intentionally resolves provider hooks lazily. */
  providerRuntimeHandle?: PreparedAgentRuntimeProviderHandle; /** Lifecycle-owned plugin metadata prepared before the attempt starts. */
  metadataSnapshot?: AgentRuntimePreparedMetadataSnapshot;
};
//#endregion
//#region src/agents/sandbox/types.docker.d.ts
type RequiredDockerConfigKeys = "image" | "containerPrefix" | "workdir" | "readOnlyRoot" | "tmpfs" | "network" | "capDrop";
type SandboxDockerConfig = Omit<SandboxDockerSettings, RequiredDockerConfigKeys> & Required<Pick<SandboxDockerSettings, RequiredDockerConfigKeys>>;
//#endregion
//#region src/agents/sandbox/types.d.ts
type SandboxToolPolicy = {
  allow?: string[];
  deny?: string[];
};
type SandboxWorkspaceAccess = "none" | "ro" | "rw";
type SandboxBrowserContext = {
  bridgeUrl: string;
  noVncUrl?: string;
  containerName: string;
};
type SandboxContext = {
  enabled: boolean;
  backendId: SandboxBackendId;
  sessionKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  skillsEligibility?: SkillEligibilityContext;
  skillUsagePaths?: SkillUsagePath[];
  workspaceAccess: SandboxWorkspaceAccess;
  runtimeId: string;
  runtimeLabel: string;
  containerName: string;
  containerWorkdir: string;
  docker: SandboxDockerConfig;
  tools: SandboxToolPolicy;
  browserAllowHostControl: boolean;
  browser?: SandboxBrowserContext;
  fsBridge?: SandboxFsBridge;
  backend?: SandboxBackendHandle;
};
//#endregion
//#region src/agents/tool-mutation.d.ts
type FileTarget = {
  path?: string;
  oldpath?: string;
};
/** Return true only for tool calls whose structured contract proves replay safety. */
declare function isReplaySafeToolCall(toolName: string, args: unknown): boolean;
//#endregion
//#region src/agents/tool-error-summary.d.ts
type ProcessTerminalDiagnostic = {
  kind: "process";
  sessionId: string;
  reason: {
    kind: "exit";
    exitCode: number;
  } | {
    kind: "signal";
    signal: string | number;
  } | {
    kind: "timeout";
    timeoutKind?: "overall-timeout" | "no-output-timeout";
  };
};
type ToolErrorSummary = {
  toolName: string;
  meta?: string;
  errorCode?: string;
  error?: string;
  validationErrorSummary?: string;
  timedOut?: boolean;
  middlewareError?: boolean;
  mutatingAction?: boolean;
  actionFingerprint?: string;
  fileTarget?: FileTarget;
  terminalDiagnostic?: ProcessTerminalDiagnostic;
};
//#endregion
//#region src/agents/embedded-agent-runner/replay-state.d.ts
/**
 * Tracks whether an embedded run can be replayed after compaction or retry.
 */
type EmbeddedRunReplayState = {
  replayInvalid: boolean;
  hadPotentialSideEffects: boolean;
};
/** Serializable replay metadata stored with run results. */
type EmbeddedRunReplayMetadata = {
  hadPotentialSideEffects: boolean;
  replaySafe: boolean;
};
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.types.d.ts
/**
 * Route chosen before a model call when context pressure may require compaction or truncation.
 */
type PreemptiveCompactionRoute = "fits" | "compact_only" | "truncate_tool_results_only" | "compact_then_truncate";
//#endregion
//#region src/agents/embedded-agent-runner/run/types.d.ts
type EmbeddedRunAttemptBase = Omit<RunEmbeddedAgentParams, "provider" | "model" | "authProfileId" | "authProfileIdSource" | "thinkLevel" | "fastMode" | "lane" | "enqueue" | "sessionFile" | "preparedRunAdmission" | "admittedRunContext">;
type EmbeddedRunContextWindowInfo = {
  tokens: number;
  referenceTokens?: number;
  source: "model" | "modelsConfig" | "agentContextTokens" | "default";
};
type EmbeddedRunFastModeParam = boolean | (() => boolean | undefined);
type EmbeddedRunAttemptOperation = "attempt" | "settled-tool-finalization";
type EmbeddedRunAttemptToolTerminalObservation = {
  toolCallId?: string;
  toolName: string;
  arguments?: unknown;
  meta?: string;
  executionStarted?: boolean;
  outcome: "success" | "failure";
  failure?: Omit<ToolErrorSummary, "toolName" | "meta" | "mutatingAction" | "actionFingerprint" | "fileTarget">; /** Protocol-owned mutation facts for native tools that do not use OpenClaw definitions. */
  nativeMutation?: {
    mutatingAction: boolean;
    replaySafe: boolean;
    actionFingerprint?: string;
    fileTarget?: ToolErrorSummary["fileTarget"];
  };
};
type EmbeddedRunAttemptToolTerminalResolution = {
  lastToolError?: ToolErrorSummary;
  executionStarted: boolean;
  executedArguments?: Record<string, unknown>;
  sideEffectEvidence: boolean;
};
type EmbeddedRunAttemptToolTerminalObserver = (observation: EmbeddedRunAttemptToolTerminalObservation) => EmbeddedRunAttemptToolTerminalResolution;
/** Host-owned trajectory recorder supplied to plugin harnesses for attempt-local runtime events. */
type EmbeddedRunAttemptTrajectoryRecorder = {
  recordEvent: (type: string, data?: Record<string, unknown>) => void;
  flush: () => Promise<void>;
};
type EmbeddedRunAttemptParams = EmbeddedRunAttemptBase & {
  admittedRunContext: NonNullable<RunEmbeddedAgentParams["admittedRunContext"]>; /** Host-resolved sandbox snapshot for plugin harness tool construction. */
  sandbox?: SandboxContext | null; /** Host-created authority available only after harness selection. */
  hostCapabilities?: AgentHarnessHostCapabilities; /** Sticky operation identity used to suppress ordinary retry and hook policy. */
  operation?: EmbeddedRunAttemptOperation; /** Core-prepared fact that explicit requester/config policy restricts plugin-native tools. */
  pluginHarnessToolPolicyRestricted?: boolean;
  preparedModelRuntime?: PreparedModelRuntimeSnapshot; /** Active file-backed artifact target resolved by the run/session target seam. */
  sessionFile: string;
  initialReplayState?: EmbeddedRunReplayState; /** Pluggable context engine for ingest/assemble/compact lifecycle. */
  contextEngine?: ContextEngine; /** Resolved model context window in tokens for assemble/compact budgeting. */
  contextTokenBudget?: number; /** Source metadata for the resolved model context budget. */
  contextWindowInfo?: EmbeddedRunContextWindowInfo; /** Resolved API key for this run when runtime auth did not replace it. */
  resolvedApiKey?: string; /** Auth profile resolved for this attempt's provider/model call. */
  authProfileId?: string; /** Source for the resolved auth profile (user-locked or automatic). */
  authProfileIdSource?: "auto" | "user";
  provider: string;
  modelId: string; /** Original primary provider before any configured fallback selected this attempt. */
  requestedProvider?: string | null; /** Original primary model before any configured fallback selected this attempt. */
  requestedModel?: string | null; /** Operator-requested or initial model id before any fallback resolution. */
  requestedModelId?: string | null; /** True when this attempt is running after a model fallback decision. */
  fallbackActive?: boolean; /** Concrete fallback reason that selected this attempt, when known. */
  fallbackReason?: string | null; /** Whether this attempt may start or redirect work to another agent/task. */
  delegationCapability?: DelegationCapability; /** Concrete degraded-runtime reason for this attempt, when known. */
  degradedReason?: string | null; /** Session-pinned embedded harness id. Prevents runtime hot-switching. */
  agentHarnessId?: string; /** Capture a local harness implementation only for setup/verified continuations. */
  captureRuntimeArtifact?: boolean; /** Exact implementation that must own the attempt before it creates a native thread. */
  expectedRuntimeArtifact?: AgentHarnessRuntimeArtifactBinding; /** OpenClaw-owned runtime policy prepared by the orchestrator for this attempt. */
  runtimePlan?: AgentRuntimePlan; /** Reports terminal tool facts to the host-owned attempt outcome accumulator. */
  observeToolTerminal?: EmbeddedRunAttemptToolTerminalObserver; /** Host-issued scope for harnesses that mirror native child runs into task state. */
  agentHarnessTaskRuntimeScope?: AgentHarnessTaskRuntimeScope; /** Storage-aware trajectory recorder owned by the OpenClaw host. */
  trajectoryRecorder?: EmbeddedRunAttemptTrajectoryRecorder | null; /** Live observer called after wrapped tool outcomes are recorded. */
  onToolOutcome?: ToolOutcomeObserver; /** Reads the sticky untrusted-content flag for the current user turn. */
  isTurnTainted?: () => boolean; /** Signals that the attempt's own run-timeout watchdog is active. */
  onAttemptTimeoutArmed?: () => void; /** Signals that this attempt's timeout has fired and must unwind promptly. */
  onAttemptTimeout?: (reason: Error) => void; /** Signals an explicit cancellation through the active native run handle. */
  onAttemptAbort?: () => void; /** Supplies run-global model-call ordering for parallel tool outcomes. */
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
  model: Model;
  authStorage: AuthStorage; /** Auth profile store already resolved during startup for this attempt. */
  authProfileStore: AuthProfileStore;
  /**
   * Full auth profile store for OpenClaw tool availability.
   * Plugin-owned harnesses may scope `authProfileStore` to model transport credentials.
   */
  toolAuthProfileStore?: AuthProfileStore;
  modelRegistry: ModelRegistry$1;
  thinkLevel: ThinkLevel;
  fastMode?: EmbeddedRunFastModeParam; /** True when this attempt is running the auto fast-mode policy. */
  fastModeAuto?: boolean;
  beforeAgentFinalizeRevisionAttempts?: number;
  maxBeforeAgentFinalizeRevisions?: number;
};
type EmbeddedRunAttemptResult = {
  terminal: AgentRunAttemptTerminal; /** True when the runtime made the authoritative final-assistant transcript decision. */
  assistantTranscriptOwned?: boolean; /** Exact idempotency key for the runtime-owned final-assistant transcript row. */
  assistantTranscriptIdempotencyKey?: string; /** Host-private terminal identity used to close the accepted transcript turn. */
  contextEngineTerminalAnchor?: TranscriptEntryAnchor;
  preflightRecovery?: {
    route: Exclude<PreemptiveCompactionRoute, "fits">;
    source?: "mid-turn";
    estimatedPromptTokens?: number;
    promptBudgetBeforeReserve?: number;
    overflowTokens?: number;
    handled: true;
    truncatedCount?: number;
  } | {
    route: Exclude<PreemptiveCompactionRoute, "fits">;
    source?: "mid-turn";
    estimatedPromptTokens?: number;
    promptBudgetBeforeReserve?: number;
    overflowTokens?: number;
    handled?: false;
  };
  sessionIdUsed: string;
  sessionFileUsed?: string;
  diagnosticTrace?: DiagnosticTraceContext;
  agentHarnessId?: string; /** Exact credential material fingerprint reported by a harness-owned auth boundary. */
  authBindingFingerprint?: string; /** Exact local implementation used by a plugin-owned harness attempt. */
  runtimeArtifact?: AgentHarnessRuntimeArtifactBinding;
  agentHarnessResultClassification?: "empty" | "reasoning-only" | "planning-only";
  promptTimeoutOutcome?: {
    message?: string;
    replayInvalid?: boolean;
    livenessState?: EmbeddedRunLivenessState;
    timeoutPhase?: AgentRunTimeoutPhase;
    providerStarted?: boolean;
  };
  codexAppServerFailure?: {
    kind: "client_closed_before_turn_completed" | "turn_completion_idle_timeout";
    turnWatchTimeoutKind?: "progress" | "completion" | "terminal";
    transport: "stdio" | "unix" | "websocket";
    threadId?: string;
    turnId?: string;
    replaySafe: boolean;
    replayBlockedReason?: "assistant_output" | "tool_activity" | "potential_side_effect" | "active_item";
    diagnostics?: {
      transportError?: string;
      idleMs?: number;
      timeoutMs?: number;
      lastActivityReason?: string;
      lastNotificationMethod?: string;
      lastNotificationItemId?: string;
      lastNotificationItemType?: string;
      lastNotificationItemRole?: string;
      lastAssistantTextPreview?: string;
      activeAppServerTurnRequests?: number;
      activeTurnItemCount?: number;
      terminalTurnNotificationQueued?: boolean;
      completionIdleWatchArmed?: boolean;
      assistantCompletionIdleWatchArmed?: boolean;
      terminalIdleWatchArmed?: boolean;
    };
  };
  bootstrapPromptWarningSignaturesSeen?: string[];
  bootstrapPromptWarningSignature?: string;
  systemPromptReport?: SessionSystemPromptReport;
  finalPromptText?: string; /** Exact provider-response count when the harness can observe model iterations directly. */
  modelIterations?: number;
  messagesSnapshot: AgentMessage[];
  /**
   * Complete application transcript frozen through a settled tool boundary.
   * Projection-backed finalizers must fail closed when their harness does not provide it.
   */
  settledTurnFinalizationContext?: {
    readonly source: "openclaw-transcript";
    readonly messages: readonly AgentMessage[];
  };
  beforeAgentFinalizeRevisionReason?: string;
  assistantTexts: string[];
  latestMcpAppChannelView?: McpAppChannelView;
  latestMcpConnectAction?: McpConnectAction;
  lastAssistantTextMessageIndex?: number;
  toolMetas: Array<{
    toolName: string;
    meta?: string;
    replaySafe?: boolean;
    isError?: boolean;
    asyncStarted?: boolean;
    asyncTaskRunId?: string;
    asyncTaskId?: string;
  }>;
  acceptedSessionSpawns?: AcceptedSessionSpawn[];
  lastAssistant: AssistantMessage | undefined;
  /**
   * Omission preserves the legacy `lastAssistant` fallback; explicit `undefined`
   * means this attempt produced no assistant response.
   */
  currentAttemptAssistant?: AssistantMessage | undefined; /** Completed message_end snapshot owned by this model attempt. */
  currentAttemptCompletedAssistant?: AssistantMessage | undefined;
  lastToolError?: ToolErrorSummary;
  didSendViaMessagingTool: boolean;
  didDeliverSourceReplyViaMessageTool?: boolean;
  didSendDeterministicApprovalPrompt?: boolean;
  messagingToolSentTexts: string[];
  messagingToolSentMediaUrls: string[];
  messagingToolSentTargets: MessagingToolSend[];
  messagingToolSourceReplyPayloads?: MessagingToolSourceReplyPayload[];
  heartbeatToolResponse?: HeartbeatToolResponse;
  toolMediaUrls?: string[];
  /**
   * Native artifacts produced and owned by the harness, never model-selected
   * dynamic-tool output. Core validates this as a subset of toolMediaUrls.
   */
  hostOwnedToolMediaUrls?: string[];
  toolAudioAsVoice?: boolean;
  toolTrustedLocalMedia?: boolean;
  hasToolMediaBlockReply?: boolean;
  successfulCronAdds?: number;
  cloudCodeAssistFormatError: boolean; /** Effective context window reported by the harness during this attempt. */
  contextTokens?: number;
  attemptUsage?: NormalizedUsage;
  promptCache?: ContextEnginePromptCacheInfo;
  contextBudgetStatus?: SessionContextBudgetStatus;
  compactionCount?: number;
  compactionTokensAfter?: number;
  /**
   * Client tool calls detected during this attempt (OpenResponses hosted
   * tools), in the order the underlying LLM emitted them. Field is
   * `undefined` when no client tools were called so existing truthiness
   * checks across the runner pipeline (`attempt.clientToolCalls ? ...`)
   * keep their meaning. When set, the array always has at least one entry.
   */
  clientToolCalls?: Array<{
    name: string;
    params: Record<string, unknown>;
  }>; /** True when sessions_yield tool was called during this attempt. */
  yieldDetected?: boolean;
  /**
   * True when code mode owned this attempt's model tool surface. Absent means
   * the harness did not report engagement (treated as not engaged), which is
   * how config-enabled code mode stays visible as a no-op on harness routes.
   */
  codeModeEngaged?: boolean; /** Completed assistant round trips observed during this attempt. */
  assistantTurns?: number; /** Inner bridge call counts from this attempt's tool-search/code-mode catalog. */
  bridgeCalls?: {
    search: number;
    describe: number;
    call: number;
  };
  replayMetadata: EmbeddedRunReplayMetadata;
  /**
   * Replay metadata for this attempt before prior session state is accumulated.
   * Older harnesses may omit it and retain conservative cumulative retry gating.
   */
  currentAttemptReplayMetadata?: EmbeddedRunReplayMetadata;
  itemLifecycle: {
    startedCount: number;
    completedCount: number;
    activeCount: number;
  };
  setTerminalLifecycleMeta?: (meta: {
    replayInvalid?: boolean;
    livenessState?: EmbeddedRunLivenessState;
    stopReason?: string;
    yielded?: boolean;
    timeoutPhase?: AgentRunTimeoutPhase;
    providerStarted?: boolean;
    aborted?: boolean;
  }) => void;
};
//#endregion
//#region src/agents/embedded-agent-runner/compact.types.d.ts
type CompactEmbeddedAgentSessionParams = {
  sessionId: string;
  runId?: string;
  sessionKey?: string; /** Storage-neutral transcript/session target. Defaults to sessionId/sessionKey/agentId. */
  sessionTarget?: AgentRunSessionTarget; /** Caller-resolved owner agent for global session aliases. */
  agentId?: string; /** Session key used only for runtime policy/sandbox resolution. Defaults to sessionKey. */
  sandboxSessionKey?: string;
  messageChannel?: string;
  messageProvider?: string; /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[];
  chatType?: ChatType;
  agentAccountId?: string;
  conversationToolPolicy?: GroupToolPolicyConfig;
  currentChannelId?: string;
  currentThreadTs?: string;
  currentMessageId?: string | number; /** Trusted sender id from inbound context for scoped message-tool discovery. */
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user"; /** Host-resolved provider credential for native harness compaction. */
  resolvedApiKey?: string; /** Group id for channel-level tool policy resolution. */
  groupId?: string | null; /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null; /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null;
  memberRoleIds?: string[]; /** Parent session key for subagent policy inheritance. */
  spawnedBy?: string | null;
  inputProvenance?: InputProvenance; /** Consumed in-process subagent-completion capability; never derived from public input. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  toolsAllow?: string[];
  disableTools?: boolean;
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  scheduledToolPolicy?: ScheduledToolPolicyContext; /** Host-resolved ambient native-tool boundary for this compaction operation. */
  nativeToolSurface?: "unrestricted" | "host-isolated";
  sessionFile: string; /** Optional caller-observed live prompt tokens used for compaction diagnostics. */
  currentTokenCount?: number;
  workspaceDir: string; /** Optional task working directory; workspaceDir remains the agent bootstrap workspace. */
  cwd?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  toolOverrides?: SessionToolOverrides;
  skillsSnapshot?: SkillSnapshot;
  senderIsOwner?: boolean;
  provider?: string;
  model?: string; /** Caller-resolved model/provider shape used by native harness compactors. */
  runtimeModel?: Model; /** Effective model fallback chain for this session attempt. Undefined uses config defaults. */
  modelFallbacksOverride?: string[]; /** Optional caller-resolved context engine for harness-owned compaction. */
  contextEngine?: ContextEngine; /** Optional caller-resolved token budget for harness-owned compaction. */
  contextTokenBudget?: number; /** Optional caller-resolved runtime context for harness-owned context-engine compaction. */
  contextEngineRuntimeContext?: ContextEngineRuntimeContext; /** Session-pinned embedded harness id. Prevents compaction hot-switching. */
  agentHarnessId?: string; /** Resumable native CLI session targeted by an explicit manual compaction. */
  cliSessionId?: string; /** Complete persisted CLI binding targeted by an explicit manual compaction. */
  cliSessionBinding?: CliSessionBinding; /** Owning session facts required for placement and runtime preparation. */
  sessionEntry?: SessionEntry; /** Prevent compaction from changing the persisted session runtime or model. */
  modelSelectionLocked?: boolean; /** OpenClaw-owned runtime policy prepared for this compaction path. */
  runtimePlan?: AgentRuntimePlan; /** Host-prepared route and credential selection for native harness compaction. */
  runtimeAuthPlan?: AgentRuntimeAuthPlan;
  thinkLevel?: ThinkLevel;
  reasoningLevel?: ReasoningLevel;
  execOverrides?: Pick<ExecToolDefaults, "host" | "security" | "ask" | "node" | "nodeCwd">;
  bashElevated?: ExecElevatedDefaults;
  customInstructions?: string;
  tokenBudget?: number;
  force?: boolean; /** Force compaction because the caller already determined this turn must compact before prompt submission. */
  forcePreflight?: boolean; /** Alias for forcePreflight used by preflight budget gates. */
  preflightRequired?: boolean; /** Diagnostic trigger that made preflight compaction mandatory. */
  preflightCompactionTrigger?: "tokens" | "transcript_bytes";
  trigger?: "budget" | "overflow" | "manual";
  /**
   * Preflight callers can allow native/current-session harness compaction but
   * move plugin-owned budget compaction onto background turn maintenance.
   */
  deferOwningContextEngineCompaction?: boolean;
  diagId?: string;
  attempt?: number;
  maxAttempts?: number;
  lane?: string;
  enqueue?: CommandQueueEnqueueFn;
  extraSystemPrompt?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  ownerNumbers?: string[];
  abortSignal?: AbortSignal;
  onCompactionHookMessages?: (payload: {
    phase: "before" | "after";
    messages: string[];
    sessionId: string;
    sessionKey: string;
  }) => void | Promise<void>; /** Allow runtime plugins for this compaction to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean; /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean;
};
//#endregion
//#region src/agents/harness/types.d.ts
type AgentHarnessPreparedAuthSupport = {
  source: "profile" | "direct" | "harness" | "none";
  mode?: string;
  requirement?: ProviderModelRouteAuthRequirement;
};
type AgentHarnessSupportContext = {
  provider: string;
  modelId?: string;
  modelProvider?: {
    api?: string;
    baseUrl?: string;
    azureApiVersion?: string; /** Secret-free projection of request behavior a native harness must reproduce. */
    requestTransportOverrides?: ProviderRouteOverridePresence; /** Provider-owned native-runtime compatibility for the prepared route. */
    runtimePolicy?: ProviderModelRouteRuntimePolicy; /** Secret-free auth source the native runtime must reproduce for this attempt. */
    preparedAuth?: AgentHarnessPreparedAuthSupport;
    request?: {
      auth?: {
        mode?: unknown;
      };
      proxy?: unknown;
      tls?: unknown;
      allowPrivateNetwork?: unknown;
    };
  };
  requestedRuntime: EmbeddedAgentRuntime;
  providerOwnerStatus?: "unowned" | "owned" | "ambiguous";
  providerOwnerPluginIds?: readonly string[];
};
type AgentHarnessSupport = {
  supported: true;
  priority?: number;
  reason?: string;
} | {
  supported: false;
  reason?: string; /** Lossless host fallback when this harness cannot reproduce the prepared request. */
  fallbackRuntime?: "openclaw";
};
type InternalEmbeddedRunAttemptParams = EmbeddedRunAttemptParams;
/** @deprecated Read `terminal` instead. Remove no earlier than the 2026.9 stable release. */
type AgentHarnessDeprecatedAttemptTerminalFields = {
  aborted?: boolean;
  externalAbort?: boolean;
  timedOut?: boolean;
  idleTimedOut?: boolean;
  timedOutDuringCompaction?: boolean;
  timedOutDuringToolExecution?: boolean;
  timedOutByRunBudget?: boolean;
  promptError?: unknown;
  promptErrorSource?: AgentRunAttemptFailureSource | null;
};
type AgentHarnessCanonicalAttemptResult = Omit<EmbeddedRunAttemptResult, "contextEngineTerminalAnchor"> & AgentHarnessDeprecatedAttemptTerminalFields;
/** @deprecated Return `terminal` instead. Remove no earlier than the 2026.9 stable release. */
type AgentHarnessLegacyAttemptResult = Omit<EmbeddedRunAttemptResult, "contextEngineTerminalAnchor" | "terminal"> & AgentHarnessDeprecatedAttemptTerminalFields & {
  aborted: boolean;
  externalAbort: boolean;
  timedOut: boolean;
  idleTimedOut: boolean;
  timedOutDuringCompaction: boolean;
  timedOutDuringToolExecution?: boolean;
  timedOutByRunBudget?: boolean;
  promptError: unknown;
  promptErrorSource: AgentRunAttemptFailureSource | null;
};
type AgentHarnessAttemptParamsBase = Omit<InternalEmbeddedRunAttemptParams, "admittedRunContext" | "contextEngineLogicalTurnLease" | "onContextEngineTurnCandidate" | "trajectoryRecorder">;
/**
 * @deprecated Use AgentHarnessAttemptParamsV2. The optional capability keeps
 * existing harness source compatible through 2026-10-12.
 */
type AgentHarnessAttemptParams = AgentHarnessAttemptParamsBase & {
  hostCapabilities?: AgentHarnessHostCapabilities;
};
/** Current host-prepared attempt contract for agent harnesses. */
type AgentHarnessAttemptParamsV2 = AgentHarnessAttemptParamsBase & {
  hostCapabilities: AgentHarnessHostCapabilities;
};
type AgentHarnessAttemptResult = AgentHarnessCanonicalAttemptResult | AgentHarnessLegacyAttemptResult;
type AgentHarnessSettledTurnFinalizationAttemptParams<TAttemptParams extends AgentHarnessAttemptParams = AgentHarnessAttemptParams> = Omit<TAttemptParams, "hostCapabilities"> & {
  hostCapabilities?: never;
};
type AgentHarnessSettledTurnFinalizationParams<TAttemptParams extends AgentHarnessAttemptParams = AgentHarnessAttemptParams> = {
  /** Fully prepared attempt context for the isolated finalization operation. */attempt: AgentHarnessSettledTurnFinalizationAttemptParams<TAttemptParams>; /** Settled result whose completed tool transcript needs a final visible answer. */
  settledAttempt: AgentHarnessCanonicalAttemptResult;
};
type AgentHarnessSettledTurnFinalizationResult = {
  /** The single completed assistant answer produced by the isolated operation. */assistant: AssistantMessage; /** Normalized usage for the finalization model call only. */
  usage?: NormalizedUsage; /** True when the harness already persisted the assistant into the application transcript. */
  assistantTranscriptOwned?: boolean; /** Exact idempotency key for the harness-owned assistant transcript row. */
  assistantTranscriptIdempotencyKey?: string; /** Assistant stream generation index used to correlate final reply delivery. */
  assistantMessageIndex?: number;
  diagnosticTrace?: DiagnosticTraceContext;
};
/** @deprecated Use AgentHarnessIsolatedCompletionParamsV2. Remove after 2026-10-12. */
type AgentHarnessIsolatedCompletionParams = {
  /** Logical provider selected by the caller before harness dispatch. */provider: string; /** Logical model id selected by the caller before harness dispatch. */
  modelId: string; /** Exact prepared transport model; harnesses must not resolve another route. */
  model: Model; /** Exact prepared credential; harnesses must not rotate or substitute it. */
  auth: ResolvedProviderAuth; /** Non-reversible proof of the prepared credential owner when available. */
  sourceAuthFingerprint?: string;
  config: OpenClawConfig;
  agentId: string;
  agentDir: string;
  workspaceDir: string;
  systemPrompt: string;
  prompt: string;
  timeoutMs: number;
  abortSignal?: AbortSignal;
  thinkLevel?: ThinkLevel;
  streamParams?: {
    maxTokens?: number;
    temperature?: number;
  };
};
type AgentHarnessIsolatedCompletionAuthorization = {
  /** OpenClaw resolved the exact transport model and credential before handoff. */owner: "host";
  model: Model;
  auth: ResolvedProviderAuth; /** Non-reversible proof of the prepared credential owner when available. */
  sourceAuthFingerprint?: string;
} | {
  /** The selected harness owns credential resolution for this prepared route. */owner: "harness";
  plan: AgentRuntimeAuthPlan; /** Credential snapshot restricted to the single profile selected for this call. */
  authProfileStore: AuthProfileStore;
};
type AgentHarnessIsolatedCompletionParamsV2 = Omit<AgentHarnessIsolatedCompletionParams, "model" | "auth" | "sourceAuthFingerprint"> & {
  authorization: AgentHarnessIsolatedCompletionAuthorization;
};
type AgentHarnessIsolatedCompletionResult = {
  /** The single assistant completion. Core rejects tool-shaped or failed results. */assistant: AssistantMessage;
};
type AgentHarnessAuthBindingFingerprintParams = {
  authProfileId: string;
  authProfileStore: AuthProfileStore;
  agentDir: string;
  config?: OpenClawConfig;
};
/**
 * @deprecated Use {@link AgentHarnessSideQuestionParamsV2}. This compatibility
 * contract is retained through 2026-10-12.
 */
type AgentHarnessSideQuestionParams = {
  /** Host-bound authority for this admitted side execution; contains no public token fields. */hostCapabilities?: AgentHarnessHostCapabilities; /** Host-resolved sandbox snapshot for this side execution. */
  sandbox?: SandboxContext | null;
  cfg: OpenClawConfig;
  agentDir: string;
  provider: string;
  model: string;
  runtimeModel?: Model<Api>; /** One atomic route/profile/store snapshot prepared before native dispatch. */
  preparedRuntimeAuth: {
    plan: AgentRuntimeAuthPlan;
    authProfileStore: AuthProfileStore;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry$1; /** Resolved host credential for an immutable API-key route only. */
    resolvedApiKey?: string;
  };
  question: string;
  sessionEntry: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey?: string;
  storePath?: string;
  resolvedThinkLevel?: ThinkLevel;
  resolvedReasoningLevel: ReasoningLevel;
  blockReplyChunking?: BlockReplyChunking;
  resolvedBlockStreamingBreak?: "text_end" | "message_end";
  opts?: GetReplyOptions;
  isNewSession: boolean;
  sessionId: string;
  sessionFile: string;
  sandboxSessionKey?: string;
  agentId?: string;
  workspaceDir?: string;
  messageChannel?: string;
  messageProvider?: string;
  chatType?: ChatType;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?: string | number;
  chatId?: string;
  messageActionTurnCapability?: string;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  memberRoleIds?: string[];
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  senderIsOwner?: boolean;
  currentChannelId?: string;
  toolsAllow?: string[];
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
};
/** Current side-question contract for hosts that always provide closure-bound authority. */
type AgentHarnessSideQuestionParamsV2 = AgentHarnessSideQuestionParams & {
  hostCapabilities: AgentHarnessHostCapabilities;
};
type AgentHarnessSideQuestionResult = {
  text: string;
};
type AgentHarnessCompactParams = CompactEmbeddedAgentSessionParams;
type AgentHarnessCompactResult = EmbeddedAgentCompactResult;
type AgentHarnessResetParams = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  reason?: "new" | "reset" | "idle" | "daily" | "compaction" | "deleted" | "unknown";
};
type AgentHarnessSessionForkFailureCode = "steer-message" | "in-progress-turn" | "drift-mismatch" | "upstream-unavailable";
type AgentHarnessSessionForkParams = {
  targetKey: string;
  source: {
    agentId: string;
    sessionId: string;
    sessionKey: string;
    storePath: string;
    entryId: string;
  };
  upstream: {
    catalogId: string;
    hostId: string;
    kind: SessionUpstreamKind;
    threadId: string;
    ref: SessionUpstreamJsonValue;
  };
};
type AgentHarnessSessionForkResult = {
  status: "created";
  key: string;
  editorText?: string;
} | {
  status: "failed";
  code: AgentHarnessSessionForkFailureCode;
  message: string;
};
type AgentHarnessResultClassification = "ok" | NonNullable<AgentHarnessAttemptResult["agentHarnessResultClassification"]>;
type AgentHarnessDeliveryDefaults = {
  /** Default visible-reply policy when config does not override the harness. */visibleReplies?: "automatic" | "message_tool";
  /**
   * @deprecated Use visibleReplies. Kept for existing harness plugins.
   */
  sourceVisibleReplies?: "automatic" | "message_tool";
};
type AgentHarnessRunCapability<TAttemptParams extends AgentHarnessAttemptParams = AgentHarnessAttemptParams> = {
  id: string;
  label: string;
  pluginId?: string;
  /**
   * Exhaustive provider ids eligible for automatic selection. Omitting this hint preserves
   * dynamic probing; an empty list marks an explicit-only harness.
   */
  autoSelection?: {
    providerIds: readonly string[];
  };
  /**
   * Plugin ids this harness owner permits to execute its locked sessions.
   * Delegates receive work admission and execution only; session mutation stays owner-only.
   */
  delegatedExecutionPluginIds?: readonly string[];
  /**
   * Context-engine host capabilities provided by this harness during agent
   * runs. Harnesses that omit this are unsupported for engines that declare
   * host requirements.
   */
  contextEngineHostCapabilities?: readonly ContextEngineHostCapability[];
  deliveryDefaults?: AgentHarnessDeliveryDefaults; /** Certifies exact runAttempt enforcement; direct-policy-restricted channel side questions fail in core. */
  conversationToolPolicySupport?: "exact";
  /**
   * Canonical OpenClaw tool names whose exact denies are fully enforced outside
   * this harness's native surface. Every other deny remains fail-closed.
   */
  conversationToolPolicySafeDenyTools?: readonly string[];
  supports(ctx: AgentHarnessSupportContext): AgentHarnessSupport; /** Lets this harness resolve forwarded profiles or its own native credentials. */
  authBootstrap?: "harness";
  runAttempt(params: TAttemptParams): Promise<AgentHarnessAttemptResult>;
  /**
   * Produces one final answer from a settled tool transcript without exposing
   * capabilities that can repeat or extend the completed work.
   */
  finalizeSettledTurn?(params: AgentHarnessSettledTurnFinalizationParams<TAttemptParams>): Promise<AgentHarnessSettledTurnFinalizationResult>; /** @deprecated Implement runIsolatedCompletionV2. Remove after 2026-10-12. */
  runIsolatedCompletion?(params: AgentHarnessIsolatedCompletionParams): Promise<AgentHarnessIsolatedCompletionResult>;
  /**
   * Runs one fresh prompt-only completion with a literal zero-tool model surface.
   * The harness must fail closed when it cannot enforce that native boundary.
   */
  runIsolatedCompletionV2?(params: AgentHarnessIsolatedCompletionParamsV2): Promise<AgentHarnessIsolatedCompletionResult>;
};
type AgentHarnessSideQuestionCapability<TSideQuestionParams extends AgentHarnessSideQuestionParams = AgentHarnessSideQuestionParams> = {
  runSideQuestion?(params: TSideQuestionParams): Promise<AgentHarnessSideQuestionResult>;
};
type AgentHarnessClassificationCapability<TAttemptParams extends AgentHarnessAttemptParams = AgentHarnessAttemptParams> = {
  classify?(result: AgentHarnessAttemptResult, ctx: TAttemptParams): AgentHarnessResultClassification | undefined;
};
type AgentHarnessCompactionCapability = {
  compact?(params: AgentHarnessCompactParams): Promise<AgentHarnessCompactResult | undefined>;
};
type AgentHarnessSessionLifecycleCapability = {
  reset?(params: AgentHarnessResetParams): Promise<void> | void;
  dispose?(): Promise<void> | void;
};
type AgentHarnessSessionForkCapability = {
  sessionFork?: {
    upstreamKinds: readonly SessionUpstreamKind[];
    fork(params: AgentHarnessSessionForkParams): Promise<AgentHarnessSessionForkResult>;
  };
};
type AgentHarnessRuntimeArtifactCapability = {
  /** Revalidate an artifact only at setup and persistent-operation boundaries. */runtimeArtifact?: {
    validate(binding: AgentHarnessRuntimeArtifactBinding): Promise<boolean>;
  };
};
type AgentHarnessAuthBindingCapability = {
  /** Recomputes the exact credential fingerprint at persistent trust boundaries. */authBinding?: {
    fingerprint(params: AgentHarnessAuthBindingFingerprintParams): Promise<string | undefined>;
  };
};
type AgentHarnessProviderUsageCapability = {
  /**
   * Contributes runtime-owned quota data without registering a text provider.
   * Provider usage hooks remain authoritative when both surfaces exist.
   */
  fetchUsageSnapshot?: (ctx: ProviderFetchUsageSnapshotContext) => Promise<ProviderUsageSnapshot | null | undefined> | ProviderUsageSnapshot | null | undefined;
};
type AgentHarnessMcpCatalogParams = {
  config: OpenClawConfig;
  agentId: string;
  sessionId: string;
  sessionKey: string;
  workspaceDir: string; /** OpenClaw-configured servers whose session policy this harness can enforce. */
  mcpServerNames: readonly string[];
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
};
type AgentHarnessMcpCatalogCapability = {
  /** Lists the MCP tools owned by this session's native runtime, if it is already bound. */loadMcpToolCatalog?(params: AgentHarnessMcpCatalogParams): Promise<McpToolCatalog | undefined>;
};
/**
 * @deprecated Implement AgentHarnessV2. This registration contract remains
 * source-compatible for existing plugins through 2026-10-12.
 */
type AgentHarness = AgentHarnessRunCapability & AgentHarnessSideQuestionCapability & AgentHarnessClassificationCapability & AgentHarnessCompactionCapability & AgentHarnessRuntimeArtifactCapability & AgentHarnessAuthBindingCapability & AgentHarnessProviderUsageCapability & AgentHarnessMcpCatalogCapability & AgentHarnessSessionForkCapability & AgentHarnessSessionLifecycleCapability;
/** Current harness contract for hosts that always supply versioned capabilities. */
type AgentHarnessV2 = AgentHarnessRunCapability<AgentHarnessAttemptParamsV2> & AgentHarnessSideQuestionCapability<AgentHarnessSideQuestionParamsV2> & AgentHarnessClassificationCapability<AgentHarnessAttemptParamsV2> & AgentHarnessCompactionCapability & AgentHarnessRuntimeArtifactCapability & AgentHarnessAuthBindingCapability & AgentHarnessProviderUsageCapability & AgentHarnessMcpCatalogCapability & AgentHarnessSessionForkCapability & AgentHarnessSessionLifecycleCapability;
//#endregion
//#region src/plugins/logger-types.d.ts
/** Logger passed into plugin registration, services, and CLI surfaces. */
type PluginLogger = {
  debug?: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
//#endregion
//#region src/plugins/provider-config-context.types.d.ts
/**
 * Provider-owned config normalization for `models.providers.<id>` entries.
 *
 * Use this for provider-specific config cleanup that should stay with the
 * plugin rather than in core config-policy tables.
 */
type ProviderNormalizeConfigContext = {
  provider: string;
  providerConfig: ModelProviderConfig;
};
/**
 * Provider-owned env/config auth marker resolution for `models.providers`.
 *
 * Use this when a provider resolves auth from env vars that do not follow the
 * generic API-key conventions.
 */
type ProviderResolveConfigApiKeyContext = {
  provider: string;
  env: NodeJS.ProcessEnv;
};
/**
 * Provider-owned config-default application input.
 *
 * Use this when a provider needs to add global config defaults that depend on
 * provider auth mode or provider-specific model families.
 */
type ProviderApplyConfigDefaultsContext = {
  provider: string;
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
};
//#endregion
//#region src/plugins/migration-provider.types.d.ts
type PluginConfigMigration = (config: OpenClawConfig) => {
  config: OpenClawConfig;
  changes: string[];
} | null | undefined;
type MigrationItemStatus = "planned" | "migrated" | "skipped" | "warning" | "conflict" | "error";
type MigrationItemKind = "auth" | "config" | "secret" | "memory" | "skill" | "workspace" | "session" | "file" | "archive" | "manual";
type MigrationItemAction = "copy" | "create" | "update" | "merge" | "append" | "archive" | "skip" | "manual";
type MigrationApplyPhase = "before-promotion" | "after-promotion";
/** Provider guarantee required before onboarding defers non-rollbackable effects. */
type MigrationDeferredApplyContract = {
  retrySafe: true;
};
type MigrationItem = {
  id: string;
  kind: MigrationItemKind | (string & {});
  action: MigrationItemAction | (string & {});
  status: MigrationItemStatus;
  source?: string;
  target?: string;
  message?: string;
  reason?: string;
  sensitive?: boolean; /** Onboarding may defer non-rollbackable effects only for retry-safe providers. */
  applyPhase?: MigrationApplyPhase; /** Retry-safe deferred apply may report a non-mutating already-satisfied terminal result. */
  deferredCompletion?: true; /** Core-owned source revision bound by reviewed embedded migration flows. */
  sourceRevision?: {
    algorithm: "sha256";
    digest: string;
  };
  details?: Record<string, unknown>;
};
type MigrationSummary = {
  total: number;
  planned: number;
  migrated: number;
  skipped: number;
  conflicts: number;
  errors: number;
  sensitive: number;
};
type MigrationDetection = {
  found: boolean;
  source?: string;
  label?: string;
  confidence?: "low" | "medium" | "high";
  message?: string;
};
type MigrationPlan = {
  providerId: string;
  source: string;
  target?: string;
  summary: MigrationSummary;
  items: MigrationItem[];
  warnings?: string[];
  nextSteps?: string[];
  metadata?: Record<string, unknown>;
};
type MigrationApplyResult = MigrationPlan & {
  backupPath?: string;
  reportDir?: string;
};
type MigrationProviderPreparation = {
  dispose?: () => void | Promise<void>;
};
type MigrationConfigRuntime = Pick<NonNullable<PluginRuntime["config"]>, "current" | "mutateConfigFile">;
type MigrationProviderContext = {
  config: OpenClawConfig;
  runtime?: PluginRuntime; /** Host-owned config mutation target for isolated embedded migration flows. */
  configRuntime?: MigrationConfigRuntime;
  logger: PluginLogger;
  stateDir: string; /** Explicit destination agent for embedded migration surfaces such as Control UI. */
  targetAgentId?: string; /** Optional item-kind scope used by embedded migration surfaces to avoid unrelated discovery. */
  itemKinds?: readonly string[];
  source?: string;
  includeSecrets?: boolean;
  overwrite?: boolean;
  providerOptions?: Record<string, unknown>;
  backupPath?: string;
  reportDir?: string;
  signal?: AbortSignal;
};
/** Migration source implemented by a plugin and orchestrated by `openclaw migrate`. */
type MigrationProviderPlugin = {
  id: string;
  label: string;
  description?: string; /** Item kinds this provider can expose without requiring a full plan. */
  supportedItemKinds?: readonly string[]; /** Required when this provider plans items for `after-promotion`. */
  deferredApply?: MigrationDeferredApplyContract;
  detect?: (ctx: MigrationProviderContext) => MigrationDetection | Promise<MigrationDetection>;
  prepareApply?: (ctx: MigrationProviderContext) => MigrationProviderPreparation | Promise<MigrationProviderPreparation | undefined> | undefined;
  plan: (ctx: MigrationProviderContext) => MigrationPlan | Promise<MigrationPlan>;
  apply: (ctx: MigrationProviderContext, plan?: MigrationPlan) => MigrationApplyResult | Promise<MigrationApplyResult>;
};
type PluginSetupAutoEnableContext = {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
};
type PluginSetupAutoEnableProbe = (ctx: PluginSetupAutoEnableContext) => string | string[] | null | undefined;
//#endregion
//#region src/plugins/plugin-command.types.d.ts
type ChannelId = ChannelId$1;
type PluginCommandSessionTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
};
type PluginCommandDiagnosticsSession = {
  /** Stable host session key when available. */sessionKey?: string; /** Ephemeral OpenClaw session id when available. */
  sessionId?: string; /** Canonical SQLite identity for active transcript access. */
  sessionTarget?: PluginCommandSessionTarget;
  /**
   * Deprecated transcript locator for this OpenClaw session when available.
   *
   * SQLite-backed sessions use a `sqlite:<agentId>:<sessionId>:<storePath>`
   * marker, not a filesystem path. Use session id/key plus transcript-runtime
   * helpers for active transcript reads.
   *
   * @deprecated Use session identity fields with `plugin-sdk/session-transcript-runtime`.
   */
  sessionFile?: string; /** Embedded agent harness selected for this session. */
  agentHarnessId?: string; /** Channel/provider for this session when available. */
  channel?: string; /** Provider channel id when available. */
  channelId?: ChannelId; /** Account id for multi-account channels when available. */
  accountId?: string; /** Thread/topic id when available. */
  messageThreadId?: string | number; /** Parent conversation id for thread-capable channels when available. */
  threadParentId?: string;
};
/**
 * Context passed to plugin command handlers.
 */
type PluginCommandContext = {
  /** The sender's identifier (for example a channel-scoped user ID) */senderId?: string; /** The channel/surface (for example "chat" or "team-chat") */
  channel: string; /** Provider channel id */
  channelId?: ChannelId; /** Whether the sender is on the allowlist */
  isAuthorizedSender: boolean; /** Whether the sender is an owner for owner-only command surfaces. */
  senderIsOwner?: boolean; /** Gateway client scopes for internal control-plane callers */
  gatewayClientScopes?: string[]; /** Host-resolved agent that owns the active session. */
  agentId?: string; /** Stable host session key for the active conversation when available. */
  sessionKey?: string; /** Ephemeral host session id for the active conversation when available. */
  sessionId?: string; /** Canonical SQLite identity for active transcript access. */
  sessionTarget?: PluginCommandSessionTarget;
  /**
   * Deprecated transcript locator for the active OpenClaw session when available.
   *
   * SQLite-backed sessions use a `sqlite:<agentId>:<sessionId>:<storePath>`
   * marker, not a filesystem path. Use session id/key plus transcript-runtime
   * helpers for active transcript reads.
   *
   * @deprecated Use session identity fields with `plugin-sdk/session-transcript-runtime`.
   */
  sessionFile?: string; /** Raw command arguments after the command name */
  args?: string; /** The full normalized command body */
  commandBody: string; /** Current OpenClaw configuration */
  config: OpenClawConfig; /** Raw "From" value (channel-scoped id) */
  from?: string; /** Raw "To" value (channel-scoped id) */
  to?: string; /** Account id for multi-account channels */
  accountId?: string; /** Thread/topic id if available */
  messageThreadId?: string | number; /** Parent conversation id for thread-capable channels */
  threadParentId?: string; /** Sensitive diagnostics-only session inventory for owner-gated commands. */
  diagnosticsSessions?: PluginCommandDiagnosticsSession[]; /** Host-bound runtime capabilities scoped to this command invocation. */
  runtimeContext?: {
    llm?: Pick<PluginRuntimeCore["llm"], "complete">;
    compactCurrent?: () => Promise<{
      compacted: boolean;
      reason?: string;
      tokensBefore?: number;
      tokensAfter?: number;
    }>;
  }; /** Internal diagnostics-only marker that exec approval already authorized upload. */
  diagnosticsUploadApproved?: boolean; /** Internal diagnostics-only marker to preview upload effects without exposing ids. */
  diagnosticsPreviewOnly?: boolean; /** Internal diagnostics-only marker for owner-private routed confirmations. */
  diagnosticsPrivateRouted?: boolean;
  requestConversationBinding: (params?: PluginConversationBindingRequestParams) => Promise<PluginConversationBindingRequestResult>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
/**
 * Result returned by a plugin command handler.
 */
type PluginCommandResult = ReplyPayload & {
  /** Allows the agent session to continue processing after the command. */continueAgent?: boolean; /** Suppresses channel fallback replies when the handler already delivered a response. */
  suppressReply?: boolean;
};
/**
 * Handler function for plugin commands.
 */
type PluginCommandHandler = (ctx: PluginCommandContext) => PluginCommandResult | Promise<PluginCommandResult>;
/**
 * Definition for a plugin-registered command.
 */
declare const AGENT_PROMPT_SURFACE_KINDS: readonly ["openclaw_main", "pi_main", "codex_app_server", "cli_backend", "acp_backend", "subagent"];
type AgentPromptSurfaceKind = (typeof AGENT_PROMPT_SURFACE_KINDS)[number];
type AgentPromptGuidanceEntry = {
  text: string;
  surfaces?: readonly AgentPromptSurfaceKind[];
};
type AgentPromptGuidance = string | AgentPromptGuidanceEntry;
type OpenClawPluginCommandDefinition = {
  /** Command name without leading slash (e.g., "tts") */name: string;
  /**
   * Optional native-command aliases for slash/menu surfaces.
   * `default` applies to all native providers unless a provider-specific
   * override exists (for example `{ default: "talkvoice", teamChat: "voice2" }`).
   */
  nativeNames?: Partial<Record<string, string>> & {
    default?: string;
  };
  /**
   * Optional native progress placeholder text for native command surfaces.
   * `default` applies to all native providers unless a provider-specific
   * override exists.
   */
  nativeProgressMessages?: Partial<Record<string, string>> & {
    default?: string;
  }; /** Description shown in /help and command menus */
  description: string; /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  /**
   * Optional channel ids this command belongs to.
   * Omit to keep the command available on every channel surface.
   */
  channels?: readonly string[]; /** Optional system-prompt guidance for agents when this command is registered. */
  agentPromptGuidance?: readonly AgentPromptGuidance[]; /** Whether this command accepts arguments */
  acceptsArgs?: boolean; /** Optional bounded presentation for clients that explicitly support it. */
  clientPresentation?: {
    /** Parsed invocation shape eligible for client handling. */when: "no-arguments";
    action: {
      kind: "device-pairing";
    };
  }; /** Whether only authorized senders can use this command (default: true) */
  requireAuth?: boolean; /** Operator scopes required by gateway clients; command owners may satisfy this on chat surfaces. */
  requiredScopes?: OperatorScope[]; /** Whether a trusted bundled handler needs owner status for subcommand-level authorization. */
  exposeSenderIsOwner?: boolean;
  /**
   * Allows a bundled plugin to claim a command name that is otherwise reserved
   * by core. External plugins cannot use this field.
   */
  ownership?: "plugin" | "reserved"; /** The handler function */
  handler: PluginCommandHandler;
};
//#endregion
//#region src/plugins/gateway-events.d.ts
type OpenClawPluginGatewayEventScope = "operator.read" | "operator.write" | "operator.admin";
type OpenClawPluginSessionsChangedEvent = {
  sessionKey: string;
  agentId?: string;
  label?: string;
  displayName?: string;
  reason?: string;
  phase?: string;
};
type OpenClawPluginGatewayEvents = {
  emit: (event: string, payload: PluginJsonValue, opts: {
    scope: OpenClawPluginGatewayEventScope;
  }) => void;
  /**
   * Native plugins can already read full session entries through the injected runtime;
   * this notice only avoids polling and does not widen session access.
   */
  onSessionsChanged: (handler: (event: OpenClawPluginSessionsChangedEvent) => void) => () => void;
};
//#endregion
//#region src/infra/diagnostic-trace-propagation.d.ts
type DiagnosticTracePropagationBridge$1<TEvent, TMetadata> = Readonly<{
  /** Selects events that need synchronous exporter preparation. */shouldPrepareEvent?: (event: TEvent) => boolean; /** Prepares exporter-owned state before an outbound caller can resolve it. */
  prepareEvent?: (event: TEvent, metadata: TMetadata) => void; /** Translates a diagnostic correlation context to an exporter-owned context. */
  resolveTraceContext: (traceContext: DiagnosticTraceContext) => DiagnosticTraceContext | undefined;
}>;
//#endregion
//#region src/security/audit.types.d.ts
/** Severity levels emitted by security audit checks. */
type SecurityAuditSeverity = "info" | "warn" | "critical";
/** One actionable or informational security audit finding. */
type SecurityAuditFinding = {
  checkId: string;
  severity: SecurityAuditSeverity;
  title: string;
  detail: string;
  remediation?: string;
};
//#endregion
//#region src/plugins/plugin-registration.types.d.ts
type ChannelPlugin$1 = ChannelPlugin$3;
type DiagnosticTracePropagationBridge = DiagnosticTracePropagationBridge$1<DiagnosticEventPayload, DiagnosticEventMetadata>;
type PluginInteractiveHandlerResult = {
  handled?: boolean;
} | void;
type PluginInteractiveRegistration<TContext = unknown, TChannel extends string = string, TResult = PluginInteractiveHandlerResult> = {
  channel: TChannel;
  namespace: string;
  handler: (ctx: TContext) => Promise<TResult> | TResult;
};
type PluginInteractiveHandlerRegistration = PluginInteractiveRegistration;
type OpenClawPluginHttpRouteAuth = "gateway" | "plugin";
type OpenClawPluginHttpRouteMatch = "exact" | "prefix";
type OpenClawPluginGatewayRuntimeScopeSurface = "write-default" | "trusted-operator";
type OpenClawPluginHttpRouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean | void> | boolean | void;
type OpenClawPluginHttpRouteUpgradeHandler = (req: IncomingMessage, socket: Duplex, head: Buffer) => Promise<boolean | void> | boolean | void;
type OpenClawPluginHttpRouteParams = {
  path: string;
  handler: OpenClawPluginHttpRouteHandler;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match?: OpenClawPluginHttpRouteMatch;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface;
  nodeCapability?: {
    surface: string;
    ttlMs?: number;
  };
  replaceExisting?: boolean;
};
type OpenClawPluginHostedMediaResolver = (mediaUrl: string) => string | null | undefined | Promise<string | null | undefined>;
type OpenClawPluginCliContext = {
  /**
   * Command object where this plugin should register its commands.
   *
   * For root CLI registrations this is the root `openclaw` program. For nested
   * registrations it is the resolved parent command from `parentPath`.
   */
  program: Command;
  parentPath: readonly string[];
  config: OpenClawConfig;
  workspaceDir?: string;
  logger: PluginLogger;
};
type OpenClawPluginCliRegistrar = (ctx: OpenClawPluginCliContext) => void | Promise<void>;
/**
 * Top-level CLI metadata for plugin-owned commands.
 *
 * Descriptors are the parse-time contract for lazy plugin CLI registration.
 * If you want OpenClaw to keep a plugin command lazy-loaded while still
 * advertising it at the root CLI level, provide descriptors that cover every
 * top-level command root registered by that plugin CLI surface.
 */
type OpenClawPluginCliCommandDescriptor = {
  name: string;
  description: string;
  hasSubcommands: boolean;
};
/** Root-command metadata that is available before a plugin registrar is activated. */
type OpenClawPluginCliRootCommandDescriptor = OpenClawPluginCliCommandDescriptor & {
  machineOutput?: (params: {
    argv: readonly string[];
    stdoutIsTTY: boolean;
  }) => boolean;
};
type OpenClawPluginRootCliRegistrationOptions = {
  /** Omit or pass an empty path for root commands. */parentPath?: readonly [];
  commands?: readonly string[];
  descriptors?: readonly OpenClawPluginCliRootCommandDescriptor[];
};
/** Backward-compatible registration shape for dynamic root or nested paths. */
type OpenClawPluginLegacyCliRegistrationOptions = {
  parentPath?: readonly string[];
  commands?: readonly string[];
  descriptors?: readonly OpenClawPluginCliCommandDescriptor[];
};
type OpenClawPluginCliRegistrationOptions = OpenClawPluginRootCliRegistrationOptions | OpenClawPluginLegacyCliRegistrationOptions;
type OpenClawPluginNodeCliFeatureOptions = {
  /** Explicit node feature command names owned under `openclaw nodes`. */commands?: string[];
  /**
   * Parse-time command descriptors for lazy node feature CLI registration.
   *
   * Descriptors are registered under `openclaw nodes`, so a descriptor named
   * `"camera"` exposes `openclaw nodes camera`.
   */
  descriptors?: OpenClawPluginCliCommandDescriptor[];
};
type OpenClawPluginReloadRegistration = {
  restartPrefixes?: string[];
  hotPrefixes?: string[];
  noopPrefixes?: string[];
};
type OpenClawPluginNodeInvokeTransportResult = {
  ok: true;
  payload?: unknown;
  payloadJSON?: string | null;
} | {
  ok: false;
  code?: string;
  message: string;
  details?: Record<string, unknown>;
};
type OpenClawPluginNodeInvokeApprovalDecision = "allow-once" | "allow-always" | "deny";
type OpenClawPluginNodeInvokePolicyApprovalRuntime = {
  request: (input: {
    title: string;
    description: string;
    severity?: "info" | "warning" | "critical";
    toolName?: string;
    toolCallId?: string;
    agentId?: string;
    sessionKey?: string;
    timeoutMs?: number;
  }) => Promise<{
    id?: string;
    decision?: OpenClawPluginNodeInvokeApprovalDecision | null;
  }>;
};
type OpenClawPluginNodeInvokePolicyContext = {
  nodeId: string;
  command: string;
  params: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
  config: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  node?: {
    nodeId: string;
    displayName?: string;
    platform?: string;
    deviceFamily?: string;
    commands?: string[];
  };
  client?: {
    connId?: string;
    scopes?: string[];
  } | null;
  approvals?: OpenClawPluginNodeInvokePolicyApprovalRuntime;
  invokeNode: (input?: {
    params?: unknown;
    timeoutMs?: number;
    idempotencyKey?: string;
  }) => Promise<OpenClawPluginNodeInvokeTransportResult>;
};
type OpenClawPluginNodeInvokePolicyResult = {
  ok: true;
  payload?: unknown;
  payloadJSON?: string | null;
} | {
  ok: false;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  unavailable?: boolean;
};
type OpenClawPluginNodeInvokePolicy = {
  commands: string[];
  /**
   * Platforms where these node-handled commands should be allowlisted by default.
   * Omit for commands that require explicit `gateway.nodes.commands.allow`.
   */
  defaultPlatforms?: Array<"ios" | "android" | "macos" | "windows" | "linux" | "unknown">;
  /**
   * Dangerous policy commands are filtered out of default allowlists unless
   * explicitly allowed by config.
   */
  dangerous?: boolean;
  /**
   * iOS foreground-restricted commands should be queued for foreground delivery
   * when an iOS node reports BACKGROUND_UNAVAILABLE.
   */
  foregroundRestrictedOnIos?: boolean;
  handle: (ctx: OpenClawPluginNodeInvokePolicyContext) => Promise<OpenClawPluginNodeInvokePolicyResult> | OpenClawPluginNodeInvokePolicyResult;
};
type OpenClawPluginSecurityAuditContext = {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  configPath: string;
};
type OpenClawPluginSecurityAuditCollector = (ctx: OpenClawPluginSecurityAuditContext) => SecurityAuditFinding[] | Promise<SecurityAuditFinding[]>;
type OpenClawGatewayDiscoveryAdvertiseContext = {
  machineDisplayName: string;
  gatewayPort: number;
  gatewayTlsEnabled: boolean;
  gatewayTlsFingerprintSha256?: string;
  gatewayDirectReachable: boolean;
  canvasPort?: number;
  tailnetDns?: string;
  sshPort?: number;
  cliPath?: string;
  minimal: boolean;
};
type OpenClawGatewayDiscoveryService = {
  id: string;
  advertise: (ctx: OpenClawGatewayDiscoveryAdvertiseContext) => void | Promise<void | {
    stop?: () => void | Promise<void>;
  }>;
};
/** Context passed to long-lived plugin services. */
type OpenClawPluginServiceContext = {
  config: OpenClawConfig;
  workspaceDir?: string;
  stateDir: string;
  logger: PluginLogger;
  gatewayEvents?: OpenClawPluginGatewayEvents;
  startupTrace?: {
    detail?: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
    measure: <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
  };
  internalDiagnostics?: {
    emit: (event: DiagnosticEventInput, privateData?: DiagnosticEventPrivateData) => void;
    onEvent: (listener: (event: DiagnosticEventPayload, metadata: DiagnosticEventMetadata, privateData: DiagnosticEventPrivateData) => void) => () => void;
    registerTracePropagationBridge?: (bridge: DiagnosticTracePropagationBridge) => () => void;
  };
};
/** Background service registered by a plugin during `register(api)`. */
type OpenClawPluginService = {
  id: string;
  start: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
  stop?: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
};
type OpenClawPluginChannelRegistration = {
  plugin: ChannelPlugin$1;
};
/**
 * Public label exposed to plugin `register(api)` calls.
 *
 * Keep this as a compatibility signal for plugin authors. Loader internals
 * should derive explicit capability booleans from the mode instead of branching
 * on raw strings throughout the code path.
 *
 * - `full`: live runtime activation; long-lived side effects may start.
 * - `discovery`: read-only capability discovery; skip sockets/workers/clients.
 * - `tool-discovery`: capability discovery for executable tools; skip channel runtime hydration.
 * - `setup-only`: lightweight channel setup entry only.
 * - `setup-runtime`: setup flow that also needs the runtime channel entry.
 * - `cli-metadata`: CLI command metadata collection.
 */
type PluginRegistrationMode = "full" | "discovery" | "tool-discovery" | "setup-only" | "setup-runtime" | "cli-metadata";
//#endregion
//#region src/plugins/provider-plugin.types.d.ts
type ProviderPlugin = {
  id: string;
  pluginId?: string;
  label: string;
  docsPath?: string;
  aliases?: string[];
  /**
   * Internal-only aliases used for runtime/config hook lookup.
   *
   * Unlike `aliases`, these values are not treated as user-facing provider ids
   * for auth/setup surfaces. Use them for legacy config keys or compat-only
   * hook routing.
   */
  hookAliases?: string[];
  /**
   * Provider-related env vars shown in setup/search/help surfaces.
   *
   * Keep entries in preferred display order. This can include direct auth env
   * vars or setup inputs such as OAuth client id/secret vars.
   */
  envVars?: string[];
  auth: ProviderAuthMethod[];
  /**
   * Legacy text-provider catalog hook.
   *
   * @deprecated New catalog/control-plane surfaces should use
   * `api.registerModelCatalogProvider`. This hook remains the text runtime
   * source until the unified loader fully replaces it.
   * Returns provider config/model definitions that merge into models.providers.
   */
  catalog?: ProviderPluginCatalog;
  /**
   * Legacy offline text-provider catalog hook for display-only surfaces.
   *
   * @deprecated New static rows should be registered with
   * `api.registerModelCatalogProvider`.
   *
   * Unlike `catalog`, this hook must not perform network I/O or require real
   * credentials. Use it for bundled/static rows that can be shown before auth is
   * configured.
   */
  staticCatalog?: ProviderPluginCatalog;
  /**
   * Show catalog row labels as the literal `<provider>/<entry.id>`
   * composition instead of the canonical (deduped) key.
   *
   * `modelKey` strips a duplicate `<provider>/` prefix so storage and
   * lookups stay stable. This flag only changes the picker label — the
   * option value and persisted config remain canonical.
   *
   * Set when the leading `<provider>/` segment in the native model id is
   * a meaningful vendor namespace (e.g. NVIDIA's `nvidia/nemotron-...`
   * alongside `moonshotai/kimi-k2.5`).
   */
  preserveLiteralProviderPrefix?: boolean;
  /**
   * Sync runtime fallback for model ids not present in the local catalog.
   *
   * Hook order:
   * 1. discovered/static model lookup
   * 2. plugin `resolveDynamicModel`
   * 3. core fallback heuristics
   * 4. generic provider-config fallback
   *
   * Keep this hook cheap and deterministic. If you need network I/O first, use
   * `prepareDynamicModel` to prime state for the async retry path.
   */
  resolveDynamicModel?: (ctx: ProviderResolveDynamicModelContext) => ProviderRuntimeModel | null | undefined;
  /**
   * Optional async prefetch for dynamic model resolution.
   *
   * OpenClaw calls this only from async model resolution paths. After it
   * completes, `resolveDynamicModel` is called again.
   */
  prepareDynamicModel?: (ctx: ProviderPrepareDynamicModelContext) => Promise<void>;
  /**
   * Lets a provider plugin opt exact configured models into a runtime
   * metadata comparison pass before the embedded runner returns the explicit
   * entry unchanged.
   */
  preferRuntimeResolvedModel?: (ctx: ProviderPreferRuntimeResolvedModelContext) => boolean;
  /**
   * Provider-owned transport normalization.
   *
   * Use this to rewrite a resolved model without forking the generic runner:
   * swap API ids, update base URLs, or adjust compat flags for a provider's
   * transport quirks.
   */
  normalizeResolvedModel?: (ctx: ProviderNormalizeResolvedModelContext) => ProviderRuntimeModel | null | undefined;
  /**
   * Provider-owned model-id normalization.
   *
   * Runs before model lookup/canonicalization. Use this for alias cleanup such
   * as provider-owned preview/legacy model ids.
   */
  normalizeModelId?: (ctx: ProviderNormalizeModelIdContext) => string | null | undefined;
  /**
   * Provider-owned transport-family normalization before generic model
   * assembly.
   *
   * Use this for API/baseUrl cleanup that may apply to custom provider ids
   * which still target the provider's transport family.
   */
  normalizeTransport?: (ctx: ProviderNormalizeTransportContext) => {
    api?: string | null;
    baseUrl?: string;
  } | null | undefined;
  /**
   * Provider-owned config normalization for `models.providers.<id>`.
   *
   * Use this for provider-specific baseUrl/model-id cleanup that should stay
   * with the plugin rather than in core config-policy tables.
   */
  normalizeConfig?: (ctx: ProviderNormalizeConfigContext) => ModelProviderConfig | null | undefined;
  /**
   * Provider-owned final native-streaming compat pass for config providers.
   *
   * Use this when a provider opts specific native base URLs into
   * `supportsUsageInStreaming` or similar transport compatibility flags.
   */
  applyNativeStreamingUsageCompat?: (ctx: ProviderNormalizeConfigContext) => ModelProviderConfig | null | undefined;
  /**
   * Provider-owned config apiKey/env marker resolution.
   *
   * Use this when a provider resolves auth from env vars such as AWS/GCP
   * markers rather than a normal API-key env var.
   */
  resolveConfigApiKey?: (ctx: ProviderResolveConfigApiKeyContext) => string | null | undefined;
  /**
   * Provider-owned replay/compaction policy override.
   *
   * Use this when transcript replay or compaction should follow provider-owned
   * rules that are more expressive than the static `capabilities` bag.
   */
  buildReplayPolicy?: (ctx: ProviderReplayPolicyContext) => ProviderReplayPolicy | null | undefined;
  /**
   * Provider-owned replay-history sanitization.
   *
   * Runs after OpenClaw performs generic transcript cleanup. Use this for
   * provider-specific replay rewrites that should stay with the provider
   * plugin rather than in shared core compaction helpers.
   */
  sanitizeReplayHistory?: (ctx: ProviderSanitizeReplayHistoryContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /**
   * Provider-owned final replay-turn validation.
   *
   * Use this when provider transports need stricter replay-time validation or
   * turn reshaping after generic sanitation. Returning a non-null value
   * replaces the built-in replay validators rather than composing with them.
   */
  validateReplayTurns?: (ctx: ProviderValidateReplayTurnsContext) => Promise<AgentMessage[] | null | undefined> | AgentMessage[] | null | undefined;
  /**
   * Provider-owned tool-schema normalization.
   *
   * Use this for transport-family schema cleanup before OpenClaw registers
   * tools with the embedded runner.
   */
  normalizeToolSchemas?: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[] | null | undefined;
  /**
   * Provider-owned tool-schema diagnostics after normalization.
   *
   * Use this when a provider wants to surface transport-specific schema
   * warnings without teaching core about provider-specific keyword rules.
   */
  inspectToolSchemas?: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[] | null | undefined;
  /**
   * Provider-owned reasoning output mode.
   *
   * Use this when a provider requires tagged reasoning/final output instead of
   * native structured reasoning fields.
   */
  resolveReasoningOutputMode?: (ctx: ProviderReasoningOutputModeContext) => ProviderReasoningOutputMode | null | undefined;
  /**
   * Provider-owned extra-param normalization before generic stream option
   * wrapping.
   *
   * Typical uses: set provider-default `transport`, map provider-specific
   * config aliases, or inject extra request metadata sourced from
   * `agents.defaults.models.<provider>/<model>.params`.
   */
  prepareExtraParams?: (ctx: ProviderPrepareExtraParamsContext) => Record<string, unknown> | null | undefined;
  /**
   * Provider-owned request params after transport/model resolution.
   *
   * Use this for transport-family request knobs that should be keyed by the
   * resolved model API/transport rather than a hardcoded core allowlist.
   */
  extraParamsForTransport?: (ctx: ProviderExtraParamsForTransportContext) => ProviderExtraParamsForTransportResult | null | undefined;
  /**
   * Provider-owned transport factory.
   *
   * Use this when the provider needs a fully custom StreamFn instead of a
   * wrapper around the normal `streamSimple` path.
   */
  createStreamFn?: (ctx: ProviderCreateStreamFnContext) => StreamFn | null | undefined;
  /**
   * Provider-owned stream wrapper applied after generic OpenClaw wrappers.
   *
   * Typical uses: provider attribution headers, request-body rewrites, or
   * provider-specific compat payload patches that do not justify a separate
   * transport implementation.
   */
  wrapStreamFn?: (ctx: ProviderWrapStreamFnContext) => StreamFn | null | undefined;
  /**
   * Provider-owned wrapper for direct `completeSimple` callers.
   *
   * Opt in only when the provider must enforce the same wire contract outside
   * the embedded agent runtime.
   */
  wrapSimpleCompletionStreamFn?: (ctx: ProviderWrapStreamFnContext) => StreamFn | null | undefined;
  /**
   * Provider-owned native transport turn identity.
   *
   * Use this when a provider wants generic transports to attach provider-native
   * request headers or metadata on each turn without hardcoding vendor logic in
   * core.
   */
  resolveTransportTurnState?: (ctx: ProviderResolveTransportTurnStateContext) => ProviderTransportTurnState | null | undefined;
  /**
   * Provider-owned WebSocket session policy.
   *
   * @deprecated Return `websocket` from `resolveTransportTurnState`. When both
   * hooks provide a field, the new hook takes precedence.
   */
  resolveWebSocketSessionPolicy?: (ctx: ProviderResolveWebSocketSessionPolicyContext) => ProviderWebSocketSessionPolicy | null | undefined;
  /**
   * Provider-owned embedding provider factory.
   *
   * Use this when memory embedding behavior belongs with the provider plugin
   * rather than the core embedding switchboard.
   */
  createEmbeddingProvider?: (ctx: ProviderCreateEmbeddingProviderContext) => Promise<PluginEmbeddingProvider | null | undefined> | PluginEmbeddingProvider | null | undefined;
  /**
   * Runtime auth exchange hook.
   *
   * Called after OpenClaw resolves the raw configured credential but before the
   * runner stores it in runtime auth storage. This lets plugins exchange a
   * source credential (for example a GitHub token) into a short-lived runtime
   * token plus optional base URL override.
   */
  prepareRuntimeAuth?: (ctx: ProviderPrepareRuntimeAuthContext) => Promise<ProviderPreparedRuntimeAuth | null | undefined>;
  /**
   * Usage/billing auth resolution hook.
   *
   * Called by provider-usage surfaces (`/usage`, status snapshots, reporting).
   * Use this when a provider's usage endpoint needs provider-owned token
   * extraction, blob parsing, or alias handling.
   */
  resolveUsageAuth?: (ctx: ProviderResolveUsageAuthContext) => Promise<ProviderResolvedUsageAuth | null | undefined> | ProviderResolvedUsageAuth | null | undefined;
  /**
   * Usage/quota snapshot fetch hook.
   *
   * Called after `resolveUsageAuth` by `/usage` and related reporting surfaces.
   * Use this when the provider's usage endpoint or payload shape is
   * provider-specific and you want that logic to live with the provider plugin
   * instead of the core switchboard.
   */
  fetchUsageSnapshot?: (ctx: ProviderFetchUsageSnapshotContext) => Promise<ProviderUsageSnapshot | null | undefined> | ProviderUsageSnapshot | null | undefined;
  /**
   * Provider-owned failover context-overflow matcher.
   *
   * Return true when the provider recognizes the raw error as a context-window
   * overflow shape that generic heuristics would miss.
   */
  matchesContextOverflowError?: (ctx: ProviderFailoverErrorContext) => boolean | undefined;
  /**
   * Provider-owned failover error classification.
   *
   * Return a failover reason when the provider recognizes a provider-specific
   * raw error shape. Return undefined to fall back to generic classification.
   */
  classifyFailoverReason?: (ctx: ProviderFailoverErrorContext) => FailoverReason | null | undefined;
  /**
   * Provider-owned cache TTL eligibility.
   *
   * Use this when a proxy provider supports Anthropic-style prompt caching for
   * only a subset of upstream models.
   */
  isCacheTtlEligible?: (ctx: ProviderCacheTtlEligibilityContext) => boolean | undefined;
  /**
   * Provider-owned missing-auth message override.
   *
   * Return a custom message when the provider wants a more specific recovery
   * hint than OpenClaw's generic auth-store guidance.
   */
  buildMissingAuthMessage?: (ctx: ProviderBuildMissingAuthMessageContext) => string | null | undefined;
  /**
   * Provider-owned unknown-model hint override.
   *
   * Return a suffix when the provider wants a more specific recovery hint than
   * OpenClaw's generic `Unknown model` error after catalog/runtime lookup
   * fails.
   */
  buildUnknownModelHint?: (ctx: ProviderBuildUnknownModelHintContext) => string | null | undefined;
  /**
   * Provider-owned built-in model suppression.
   *
   * Return `{ suppress: true }` to hide a stale upstream row. Include
   * `errorMessage` when OpenClaw should surface a provider-specific hint for
   * direct model resolution failures.
   *
   * @deprecated Use manifest `modelCatalog.suppressions`. Runtime suppression
   * hooks are no longer called by model resolution.
   */
  suppressBuiltInModel?: (ctx: ProviderBuiltInModelSuppressionContext) => ProviderBuiltInModelSuppressionResult | null | undefined;
  /**
   * Provider-owned final catalog augmentation.
   *
   * @deprecated Use `api.registerModelCatalogProvider` for supplemental catalog
   * rows. This hook is kept only for existing text-provider runtime
   * compatibility during the migration window.
   *
   * Return extra rows to append to the final catalog after discovery/config
   * merging. OpenClaw deduplicates by `provider/id`, so plugins only need to
   * describe the desired supplemental rows.
   */
  augmentModelCatalog?: (ctx: ProviderAugmentModelCatalogContext) => Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | Promise<Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | null | undefined> | null | undefined;
  /**
   * Provider-owned thinking level profile.
   *
   * Prefer this over the individual thinking capability hooks when a provider
   * or model exposes a custom set of thinking levels. OpenClaw stores the
   * canonical `id`, shows `label` when provided, and downgrades stale stored
   * values by profile rank.
   */
  resolveThinkingProfile?: (ctx: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | null | undefined;
  /**
   * Provider-owned system-prompt contribution.
   *
   * Use this when a provider/model family needs cache-aware prompt tuning
   * without replacing the full OpenClaw-owned system prompt.
   */
  resolveSystemPromptContribution?: (ctx: ProviderSystemPromptContributionContext) => ProviderSystemPromptContribution | null | undefined;
  /**
   * Provider-owned GPT/model prompt overlay seam.
   *
   * Runs after OpenClaw's built-in overlay is resolved and before the
   * provider's regular system-prompt contribution is merged.
   */
  resolvePromptOverlay?: (ctx: ProviderResolvePromptOverlayContext) => ProviderSystemPromptContribution | null | undefined;
  /**
   * Provider-owned fallback route override for model/profile failure handling.
   *
   * Return undefined/null to keep OpenClaw's default fallback policy.
   */
  followupFallbackRoute?: (ctx: ProviderFollowupFallbackRouteContext) => ProviderFollowupFallbackRouteResult | null | undefined;
  /**
   * Provider-owned auth profile resolver.
   *
   * Return a profile id from the supplied order to prefer it for this attempt;
   * invalid or missing ids are ignored by core.
   */
  resolveAuthProfileId?: (ctx: ProviderResolveAuthProfileIdContext) => string | null | undefined;
  /**
   * Provider-owned final system-prompt transform.
   *
   * Use this sparingly when a provider transport needs small compatibility
   * rewrites after OpenClaw has assembled the complete prompt. Return
   * `undefined`/`null` to leave the prompt unchanged.
   */
  transformSystemPrompt?: (ctx: ProviderTransformSystemPromptContext) => string | null | undefined;
  /**
   * Provider-owned bidirectional text replacements.
   *
   * `input` applies to system prompts and text message content before transport.
   * `output` applies to assistant text deltas/final text before OpenClaw handles
   * its own control markers or channel delivery.
   */
  textTransforms?: PluginTextTransforms;
  /**
   * Provider-owned global config defaults.
   *
   * Use this when config materialization needs provider-specific defaults that
   * depend on auth mode, env, or provider model-family semantics.
   */
  applyConfigDefaults?: (ctx: ProviderApplyConfigDefaultsContext) => OpenClawConfig | null | undefined;
  /**
   * Provider-owned "modern model" matcher used by live profile/smoke filters.
   *
   * Return true when the given provider/model ref should be treated as a
   * preferred modern model candidate.
   */
  isModernModelRef?: (ctx: ProviderModernModelPolicyContext) => boolean | undefined;
  wizard?: ProviderPluginWizard;
  /**
   * Provider-owned auth-profile API-key formatter.
   *
   * OpenClaw uses this when a stored auth profile is already valid and needs to
   * be converted into the runtime `apiKey` string expected by the provider. Use
   * this for providers whose auth profile stores extra metadata alongside the
   * bearer token (for example Gemini CLI's `{ token, projectId }` payload).
   */
  formatApiKey?: (cred: AuthProfileCredential) => string;
  /**
   * Provider-owned OAuth login adapter for the session SDK AuthStorage API.
   *
   * This keeps the public callback-based login contract usable without seeding
   * provider implementations into core. Modern setup flows should use `auth`.
   */
  loginOAuth?: (callbacks: OAuthLoginCallbacks) => Promise<OAuthCredentials>;
  /**
   * Legacy auth-profile ids that should be retired by `openclaw doctor`.
   *
   * Use this when a provider plugin replaces an older core-managed profile id
   * and wants cleanup/migration messaging to live with the provider instead of
   * in hardcoded doctor tables.
   */
  deprecatedProfileIds?: string[];
  /**
   * Legacy OAuth profile-id migrations that `openclaw doctor` should offer.
   *
   * Use this when a provider moved from a legacy default OAuth profile id to a
   * newer identity-based id and wants doctor to own the config rewrite without
   * another core-specific migration branch.
   */
  oauthProfileIdRepairs?: ProviderOAuthProfileIdRepair[];
  /**
   * Provider-owned OAuth refresh.
   *
   * OpenClaw calls this before falling back to the shared `shared model runtime` OAuth
   * refreshers. Use it when the provider has a custom refresh endpoint, or when
   * the provider needs custom refresh-failure behavior that should stay out of
   * core auth-profile code.
   */
  refreshOAuth?: (cred: OAuthCredential) => Promise<OAuthCredential>;
  /**
   * Provider-owned auth-doctor hint.
   *
   * Return a multiline repair hint when OAuth refresh fails and the provider
   * wants to steer users toward a specific auth-profile migration or recovery
   * path. Return nothing to keep OpenClaw's generic error text.
   */
  buildAuthDoctorHint?: (ctx: ProviderAuthDoctorHintContext) => string | Promise<string | null | undefined> | null | undefined;
  /**
   * Provider-owned config-backed auth resolution.
   *
   * Providers own any provider-specific fallback secret rules here so core
   * auth/discovery code can stay generic and avoid parsing provider-private
   * config layouts.
   *
   * The returned `apiKey` may be:
   * - a real credential from the active runtime snapshot, suitable for runtime use
   * - a non-secret marker (for example a managed SecretRef marker), suitable only
   *   for discovery/bootstrap callers
   *
   * Runtime callers must not treat non-secret markers as runnable credentials;
   * they should retry against the active runtime snapshot when available.
   *
   * This hook is the canonical seam for provider-specific fallback auth
   * derived from plugin/private config. It may return:
   * - a runnable literal credential for runtime callers
   * - a non-secret marker for managed-secret source config, which is still useful
   *   for discovery/bootstrap callers
   *
   * Runtime callers must not treat non-secret markers as runnable credentials;
   * they should retry against the active runtime snapshot when available.
   *
   * Use this when the provider can operate without a real secret for certain
   * configured local/self-hosted cases and wants auth resolution to treat that
   * config as available.
   */
  resolveSyntheticAuth?: (ctx: ProviderResolveSyntheticAuthContext) => ProviderSyntheticAuthResult | null | undefined;
  /**
   * Provider-owned external auth profile discovery.
   *
   * Use this when credentials are managed by an external tool and should be visible
   * to runtime auth resolution without being written back into `auth-profiles.json`
   * by core.
   */
  resolveExternalAuthProfiles?: (ctx: ProviderResolveExternalAuthProfilesContext) => Array<ProviderExternalAuthProfile> | ReadonlyArray<ProviderExternalAuthProfile> | null | undefined;
  /**
   * Provider-owned precedence rule for stored synthetic auth profiles.
   *
   * Return true when a stored profile API key is only a provider-owned
   * synthetic placeholder and should yield to env/config-backed auth before
   * OpenClaw falls back to that stored profile.
   */
  shouldDeferSyntheticProfileAuth?: (ctx: ProviderDeferSyntheticProfileAuthContext) => boolean | undefined;
  onModelSelected?: (ctx: ProviderModelSelectedContext) => Promise<void>;
};
//#endregion
//#region src/plugins/plugin-api.types.d.ts
type ChannelPlugin = ChannelPlugin$3;
type PluginTextTransformRegistration = PluginTextTransforms;
type OpenClawPluginSessionStateApi = {
  /** Register plugin-owned session state projected into Gateway session rows. */registerSessionExtension: (extension: PluginSessionExtensionRegistration) => void;
};
type OpenClawPluginSessionWorkflowApi = {
  /** Queue one plugin-owned context injection for the next agent turn in a session. */enqueueNextTurnInjection: (injection: PluginNextTurnInjection) => Promise<PluginNextTurnInjectionEnqueueResult>;
  /**
   * Register cleanup metadata for a plugin-owned session scheduler job.
   * This does not schedule work or create task records; it only lets the host
   * clean external scheduler state during reset/delete/disable.
   */
  registerSessionSchedulerJob: (job: PluginSessionSchedulerJobRegistration) => PluginSessionSchedulerJobHandle | undefined; /** Send host-validated files to the active direct-outbound route for a session. */
  sendSessionAttachment: (params: PluginSessionAttachmentParams) => Promise<PluginSessionAttachmentResult>;
  /**
   * Schedule a future agent turn in a session through Cron.
   * Cron owns timing and creates the task ledger entry when the turn runs.
   */
  scheduleSessionTurn: (params: PluginSessionTurnScheduleParams) => Promise<PluginSessionSchedulerJobHandle | undefined>; /** Remove Cron-backed scheduled session turns that share a plugin-owned tag. */
  unscheduleSessionTurnsByTag: (params: PluginSessionTurnUnscheduleByTagParams) => Promise<PluginSessionTurnUnscheduleByTagResult>;
};
type OpenClawPluginSessionControlsApi = {
  /** Register a typed session action that clients can dispatch through the Gateway. */registerSessionAction: (action: PluginSessionActionRegistration) => void; /** Register a generic Control UI contribution descriptor. */
  registerControlUiDescriptor: (descriptor: PluginControlUiDescriptor) => void;
};
type OpenClawPluginSessionApi = {
  state: OpenClawPluginSessionStateApi;
  workflow: OpenClawPluginSessionWorkflowApi;
  controls: OpenClawPluginSessionControlsApi;
};
type OpenClawPluginAgentEventsApi = {
  /** Subscribe to sanitized agent events through the host-owned plugin lifecycle. */registerAgentEventSubscription: (subscription: PluginAgentEventSubscriptionRegistration) => void; /** Emit a host-routed, plugin-attributed event for workflow/UI subscribers. */
  emitAgentEvent: (params: PluginAgentEventEmitParams) => PluginAgentEventEmitResult;
};
type OpenClawPluginAgentApi = {
  events: OpenClawPluginAgentEventsApi;
};
type OpenClawPluginRunContextApi = {
  /** Store namespaced, JSON-compatible data for the active run. Cleared on run end/error. */setRunContext: (patch: PluginRunContextPatch) => boolean; /** Read namespaced plugin data for a run. */
  getRunContext: (params: PluginRunContextGetParams) => PluginJsonValue | undefined; /** Clear one namespace or all namespaces this plugin owns for a run. */
  clearRunContext: (params: {
    runId: string;
    namespace?: string;
  }) => void;
};
type OpenClawPluginLifecycleApi = {
  /** Register cleanup hooks for plugin-owned host state and background work. */registerRuntimeLifecycle: (lifecycle: PluginRuntimeLifecycleRegistration) => void;
};
/** Main registration API injected into native plugin entry files. */
type OpenClawPluginApi = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  source: string;
  rootDir?: string;
  registrationMode: PluginRegistrationMode;
  config: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  /**
   * In-process runtime helpers for trusted native plugins.
   *
   * This surface is broader than hooks. Prefer hooks for third-party
   * automation/integration unless you need native registry integration.
   */
  runtime: PluginRuntime;
  logger: PluginLogger;
  /**
   * Grouped facade over the existing flat session-related plugin API.
   * Flat methods remain supported for compatibility.
   */
  session: OpenClawPluginSessionApi; /** Grouped facade for agent-event workflow seams. */
  agent: OpenClawPluginAgentApi; /** Grouped facade for run-scoped plugin scratch state. */
  runContext: OpenClawPluginRunContextApi; /** Grouped facade for plugin-owned lifecycle cleanup hooks. */
  lifecycle: OpenClawPluginLifecycleApi;
  registerTool: (tool: AnyAgentTool | OpenClawPluginToolFactory, opts?: OpenClawPluginToolOptions) => void;
  registerHook: (events: string | string[], handler: InternalHookHandler, opts?: OpenClawPluginHookOptions) => void;
  registerHttpRoute: (params: OpenClawPluginHttpRouteParams) => void; /** Register a plugin-owned resolver for browser-style hosted media URLs. */
  registerHostedMediaResolver: (resolver: OpenClawPluginHostedMediaResolver) => void; /** Bind a declared MCP server's transport to the trusted message requester. */
  registerMcpServerConnectionResolver: (resolver: OpenClawPluginMcpServerConnectionResolver) => void; /** Register a native messaging channel plugin (channel capability). */
  registerChannel: (registration: OpenClawPluginChannelRegistration | ChannelPlugin) => void;
  /**
   * Register a gateway RPC method for this plugin.
   *
   * Reserved core admin namespaces (`config.*`, `exec.approvals.*`,
   * `wizard.*`, `update.*`) always normalize to `operator.admin` even if a
   * narrower scope is requested.
   */
  registerGatewayMethod: (method: string, handler: GatewayRequestHandler, opts?: {
    scope?: OperatorScope;
  }) => void; /** Register a read-only external-session catalog with optional native adoption actions. */
  registerSessionCatalog: (provider: SessionCatalogProvider) => void;
  registerCli: (registrar: OpenClawPluginCliRegistrar, opts?: OpenClawPluginCliRegistrationOptions) => void;
  /**
   * Register a plugin-owned node feature command group under `openclaw nodes`.
   *
   * This is equivalent to `registerCli(registrar, { parentPath: ["nodes"], ... })`
   * and is intended for paired-node capabilities such as camera, screen, or Canvas.
   */
  registerNodeCliFeature: (registrar: OpenClawPluginCliRegistrar, opts?: OpenClawPluginNodeCliFeatureOptions) => void;
  registerReload: (registration: OpenClawPluginReloadRegistration) => void;
  registerNodeHostCommand: (command: OpenClawPluginNodeHostCommand) => void;
  registerNodeInvokePolicy: (policy: OpenClawPluginNodeInvokePolicy) => void;
  registerSecurityAuditCollector: (collector: OpenClawPluginSecurityAuditCollector) => void;
  registerService: (service: OpenClawPluginService) => void; /** Register a local gateway discovery advertiser such as mDNS/Bonjour. */
  registerGatewayDiscoveryService: (service: OpenClawGatewayDiscoveryService) => void; /** Register a text-only CLI backend used by the local CLI runner. */
  registerCliBackend: (backend: CliBackendPlugin$1) => void; /** Register plugin-owned prompt/message compatibility text transforms. */
  registerTextTransforms: (transforms: PluginTextTransformRegistration) => void; /** Register a lightweight config migration that can run before plugin runtime loads. */
  registerConfigMigration: (migrate: PluginConfigMigration) => void; /** Register an importer for `openclaw migrate` (migration capability). */
  registerMigrationProvider: (provider: MigrationProviderPlugin) => void; /** Register a lightweight config probe that can auto-enable this plugin generically. */
  registerAutoEnableProbe: (probe: PluginSetupAutoEnableProbe) => void; /** Register a native model/provider plugin (text inference capability). */
  registerProvider: (provider: ProviderPlugin) => void; /** Register a cloud-worker lifecycle provider. */
  registerWorkerProvider: (provider: WorkerProvider$1) => void; /** Register provider-owned model catalog rows for text and media generation. */
  registerModelCatalogProvider: (provider: UnifiedModelCatalogProviderPlugin) => void; /** Register a general embedding provider (embedding capability). */
  registerEmbeddingProvider: (adapter: EmbeddingProviderAdapter) => void; /** Register a speech synthesis provider (speech capability). */
  registerSpeechProvider: (provider: SpeechProviderPlugin$1) => void; /** Register a realtime transcription provider (streaming STT capability). */
  registerRealtimeTranscriptionProvider: (provider: RealtimeTranscriptionProviderPlugin$1) => void; /** Register a realtime voice provider (duplex voice capability). */
  registerRealtimeVoiceProvider: (provider: RealtimeVoiceProviderPlugin$1) => void; /** Register a media understanding provider (media understanding capability). */
  registerMediaUnderstandingProvider: (provider: MediaUnderstandingProviderPlugin$1) => void; /** Register a transcripts source provider (live or imported meeting transcript capability). */
  registerTranscriptSourceProvider: (provider: TranscriptSourceProvider$1) => void; /** Register an image generation provider (image generation capability). */
  registerImageGenerationProvider: (provider: ImageGenerationProviderPlugin$1) => void; /** Register a video generation provider (video generation capability). */
  registerVideoGenerationProvider: (provider: VideoGenerationProviderPlugin$1) => void; /** Register a music generation provider (music generation capability). */
  registerMusicGenerationProvider: (provider: MusicGenerationProviderPlugin$1) => void; /** Register a web fetch provider (web fetch capability). */
  registerWebFetchProvider: (provider: WebFetchProviderPlugin) => void; /** Register a web search provider (web search capability). */
  registerWebSearchProvider: (provider: WebSearchProviderPlugin) => void;
  registerInteractiveHandler: (registration: PluginInteractiveHandlerRegistration) => void;
  onConversationBindingResolved: (handler: (event: PluginConversationBindingResolvedEvent$1) => void | Promise<void>) => void;
  /**
   * Register a custom command that bypasses the LLM agent.
   * Plugin commands are processed before built-in commands and before agent invocation.
   * Use this for simple state-toggling or status commands that don't need AI reasoning.
   */
  registerCommand: (command: OpenClawPluginCommandDefinition) => void; /** Register a context engine implementation (exclusive slot - only one active at a time). */
  registerContextEngine: (id: string, factory: ContextEngineFactory) => void; /** Register a compaction provider (pluggable summarization backend). */
  registerCompactionProvider: (provider: CompactionProvider) => void; /** Register an agent harness implementation. */
  registerAgentHarness: (harness: AgentHarness) => void;
  /**
   * Register a Codex app-server extension factory for Codex harness tool-result
   * middleware. Only bundled plugins may use this seam, and
   * `contracts.embeddedExtensionFactories` must include `"codex-app-server"`.
   */
  registerCodexAppServerExtensionFactory: (factory: CodexAppServerExtensionFactory) => void;
  /**
   * Register runtime-neutral tool-result middleware. Declare
   * `contracts.agentToolResultMiddleware` for every targeted runtime.
   */
  registerAgentToolResultMiddleware: (handler: AgentToolResultMiddleware, options?: AgentToolResultMiddlewareOptions) => void;
  /**
   * Register plugin-owned session state that can be projected into Gateway session rows.
   * @deprecated Use `api.session.state.registerSessionExtension(...)`.
   */
  registerSessionExtension: (extension: PluginSessionExtensionRegistration) => void;
  /**
   * Queue one plugin-owned context injection for the next agent turn in a session.
   * @deprecated Use `api.session.workflow.enqueueNextTurnInjection(...)`.
   */
  enqueueNextTurnInjection: (injection: PluginNextTurnInjection) => Promise<PluginNextTurnInjectionEnqueueResult>;
  /**
   * Register a trusted pre-tool policy. Installed plugins must declare the
   * policy id in `contracts.trustedToolPolicies`.
   */
  registerTrustedToolPolicy: (policy: PluginTrustedToolPolicyRegistration) => void;
  /**
   * Register display/policy metadata for a plugin-owned tool. Metadata is
   * scoped to the (pluginId, toolName) pair at projection time, so plugins
   * cannot decorate other plugins' tools or core tools through this surface.
   */
  registerToolMetadata: (metadata: PluginToolMetadataRegistration) => void;
  /**
   * Register a generic Control UI contribution descriptor.
   * @deprecated Use `api.session.controls.registerControlUiDescriptor(...)`.
   */
  registerControlUiDescriptor: (descriptor: PluginControlUiDescriptor) => void;
  /**
   * Register cleanup hooks for plugin-owned host state and background work.
   * @deprecated Use `api.lifecycle.registerRuntimeLifecycle(...)`.
   */
  registerRuntimeLifecycle: (lifecycle: PluginRuntimeLifecycleRegistration) => void;
  /**
   * Subscribe to sanitized agent events through the host-owned plugin lifecycle.
   * @deprecated Use `api.agent.events.registerAgentEventSubscription(...)`.
   */
  registerAgentEventSubscription: (subscription: PluginAgentEventSubscriptionRegistration) => void;
  /**
   * Emit a host-routed, plugin-attributed agent event for workflow/UI subscribers.
   * @deprecated Use `api.agent.events.emitAgentEvent(...)`.
   */
  emitAgentEvent: (params: PluginAgentEventEmitParams) => PluginAgentEventEmitResult;
  /**
   * Store namespaced, JSON-compatible data for the active run. Cleared on run end/error.
   * @deprecated Use `api.runContext.setRunContext(...)`.
   */
  setRunContext: (patch: PluginRunContextPatch) => boolean;
  /**
   * Read namespaced plugin data for a run.
   * @deprecated Use `api.runContext.getRunContext(...)`.
   */
  getRunContext: (params: PluginRunContextGetParams) => PluginJsonValue | undefined;
  /**
   * Clear one namespace or all namespaces this plugin owns for a run.
   * @deprecated Use `api.runContext.clearRunContext(...)`.
   */
  clearRunContext: (params: {
    runId: string;
    namespace?: string;
  }) => void;
  /**
   * Register cleanup metadata for a plugin-owned session scheduler job.
   * This does not schedule work or create task records; it only lets the host
   * clean external scheduler state during reset/delete/disable.
   *
   * @deprecated Use `api.session.workflow.registerSessionSchedulerJob(...)`.
   */
  registerSessionSchedulerJob: (job: PluginSessionSchedulerJobRegistration) => PluginSessionSchedulerJobHandle | undefined;
  /**
   * Register a typed session action that clients can dispatch through the Gateway.
   * @deprecated Use `api.session.controls.registerSessionAction(...)`.
   */
  registerSessionAction: (action: PluginSessionActionRegistration) => void;
  /**
   * Send one or more host-validated files to the active direct-outbound channel for a session.
   *
   * This API is intended for bundled plugins running with the host channel/session
   * integration available. Calls may resolve to `{ ok: false }` instead of attaching
   * files when global side effects are disabled or when the required plugin/channel
   * runtime is not loaded, so callers must handle rejection via the returned result.
   *
   * @deprecated Use `api.session.workflow.sendSessionAttachment(...)`.
   */
  sendSessionAttachment: (params: PluginSessionAttachmentParams) => Promise<PluginSessionAttachmentResult>;
  /**
   * Schedule a future agent turn in a session through Cron.
   * Cron owns timing and creates the task ledger entry when the turn runs.
   * Bundled plugins only; workspace plugins receive undefined.
   *
   * @deprecated Use `api.session.workflow.scheduleSessionTurn(...)`.
   */
  scheduleSessionTurn: (params: PluginSessionTurnScheduleParams) => Promise<PluginSessionSchedulerJobHandle | undefined>;
  /**
   * Remove Cron-backed scheduled session turns that share the same plugin-owned tag.
   * Bundled plugins only; workspace plugins receive a zero-count result.
   *
   * @deprecated Use `api.session.workflow.unscheduleSessionTurnsByTag(...)`.
   */
  unscheduleSessionTurnsByTag: (params: PluginSessionTurnUnscheduleByTagParams) => Promise<PluginSessionTurnUnscheduleByTagResult>; /** Register the active detached task runtime for this plugin (exclusive slot). */
  registerDetachedTaskRuntime: (runtime: DetachedTaskLifecycleRuntime) => void; /** Register the active memory capability for this memory plugin (exclusive slot). */
  registerMemoryCapability: (capability: MemoryPluginCapability) => void; /** Register an additive memory-adjacent prompt section (non-exclusive). */
  registerMemoryPromptSupplement: (builder: MemoryPromptSectionBuilder) => void; /** Register an async memory prompt preparation step (non-exclusive). */
  registerMemoryPromptPreparation: (prepare: (params: MemoryPromptSectionParams) => Promise<readonly string[]>) => void; /** Register an additive memory-adjacent search/read corpus supplement (non-exclusive). */
  registerMemoryCorpusSupplement: (supplement: MemoryCorpusSupplement) => void;
  /**
   * Register a memory embedding provider adapter. Multiple adapters may coexist.
   * @deprecated New embedding providers should use `registerEmbeddingProvider`
   * and `contracts.embeddingProviders`. This memory-specific seam is retained
   * while existing memory providers migrate.
   */
  registerMemoryEmbeddingProvider: (adapter: MemoryEmbeddingProviderAdapter) => void;
  resolvePath: (input: string) => string; /** Register a lifecycle hook handler */
  on: <K extends PluginHookName>(hookName: K, handler: PluginHookHandlerMap[K], opts?: PluginHookRegistrationOptions<K>) => void;
};
//#endregion
//#region src/plugins/plugin-config-schema.types.d.ts
type PluginConfigValidation = {
  ok: true;
  value?: unknown;
} | {
  ok: false;
  errors: string[];
};
/**
 * Config schema contract accepted by plugin manifests and runtime registration.
 *
 * Plugins can provide a Zod-like parser, a lightweight `validate(...)`
 * function, or both. `jsonSchema` is optional runtime schema metadata.
 */
type OpenClawPluginConfigSchema = {
  safeParse?: (value: unknown) => {
    success: boolean;
    data?: unknown;
    error?: {
      issues?: Array<{
        path: Array<string | number>;
        message: string;
      }>;
    };
  };
  parse?: (value: unknown) => unknown;
  validate?: (value: unknown) => PluginConfigValidation;
  /**
   * @deprecated Declare config presentation metadata in the plugin's
   * `openclaw.plugin.json` manifest via top-level `uiHints`. The host reads
   * manifest hints and does not consume runtime config-schema hints.
   */
  uiHints?: Record<string, PluginConfigUiHint>;
  jsonSchema?: JsonSchemaObject;
};
//#endregion
//#region src/plugins/plugin-definition.types.d.ts
/** Module-level plugin definition loaded from a native plugin entry file. */
type OpenClawPluginDefinition = {
  id?: string;
  name?: string;
  description?: string;
  version?: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-exported `kind` is kept as a compatibility
   * fallback for older plugins and may require loading plugin runtime on
   * metadata-only command paths.
   */
  kind?: PluginKind | PluginKind[];
  configSchema?: OpenClawPluginConfigSchema;
  reload?: OpenClawPluginReloadRegistration;
  nodeHostCommands?: OpenClawPluginNodeHostCommand[];
  securityAuditCollectors?: OpenClawPluginSecurityAuditCollector[];
  register?: (api: OpenClawPluginApi) => void;
};
//#endregion
//#region src/agents/agent-tools.before-tool-call.types.d.ts
type ToolOutcomeObservation = {
  toolName: string;
  argsHash: string;
  resultHash: string;
  resultContentSource?: AgentTool["resultContentSource"]; /** Monotonic model-call order within the owning embedded run. */
  toolCallOrdinal?: number;
  terminalPresentation?: string;
  presentationOnly?: boolean;
};
type ToolOutcomeObserver = (observation: ToolOutcomeObservation) => void;
type HookContext = {
  agentId?: string;
  config?: OpenClawConfig; /** Tool execution cwd for host-derived path facts. */
  cwd?: string; /** Host workspace used to resolve relative tool params for diagnostics only. */
  workspaceDir?: string;
  sessionKey?: string; /** Ephemeral session UUID — regenerated on /new and /reset. */
  sessionId?: string;
  runId?: string; /** What initiated this run, used to reject approvals on unattended surfaces. */
  trigger?: string; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string;
  trace?: DiagnosticTraceContext;
  channelId?: string; /** Host-derived message requester for sender-aware tool hooks. */
  requester?: PluginHookToolRequesterContext; /** Originating channel for approval delivery routing; mirrors exec approval turn-source fields. */
  turnSourceChannel?: string;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
  loopDetection?: ToolLoopDetectionConfig;
  onToolOutcome?: ToolOutcomeObserver;
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
  skillsSnapshot?: SkillSnapshot;
  skillUsagePaths?: SkillUsagePath[];
  skillCommand?: {
    commandName: string;
    skillFile?: string;
    skillName: string;
    skillSource?: SkillTelemetrySource;
    toolName?: string;
  };
  sandbox?: {
    root: string;
    bridge: SandboxFsBridge;
  };
};
type BeforeToolCallFailureDisposition = "blocked" | DiagnosticToolTerminalReason;
type PluginApprovalRequest = NonNullable<PluginHookBeforeToolCallResult["requireApproval"]>;
type DeferredPluginToolApproval = {
  approval: PluginApprovalRequest;
  toolName: string;
  toolCallId?: string;
  ctx?: HookContext;
  baseParams: unknown;
  overrideParams?: unknown;
};
type BeforeToolCallPolicyDiagnosticState = {
  hasBeforeToolCallHook: boolean;
  trustedToolPolicies: Array<{
    id: string;
    pluginId: string;
    pluginName?: string;
  }>;
};
type HookBlockedReason = "client-voice-confirmation" | "plugin-before-tool-call" | "plugin-approval" | "plugin-approval-unavailable" | "tool-loop";
type HookBlockedOutcome = {
  blocked: true;
  deniedReason?: HookBlockedReason;
  reason: string;
  params?: unknown;
};
type HookOutcome = (HookBlockedOutcome & {
  kind: "veto";
}) | (HookBlockedOutcome & {
  kind: "failure";
  disposition: BeforeToolCallFailureDisposition;
}) | {
  blocked: false;
  params: unknown;
  approvalResolution?: PluginApprovalResolution;
  deferredApproval?: DeferredPluginToolApproval;
};
//#endregion
//#region src/agents/agent-tools.before-tool-call.state.d.ts
/** Consume and remove hook-adjusted params for a completed tool call. */
declare function consumeAdjustedParamsForToolCall(toolCallId: string, runId?: string): unknown;
/** Snapshot hook-adjusted params without consuming later outcome bookkeeping. */
declare function peekAdjustedParamsForToolCall(toolCallId: string, runId?: string): unknown;
/** Consume whether policy prevented the target tool from starting. */
declare function consumePreExecutionBlockedToolCall(toolCallId: string, runId?: string): boolean;
//#endregion
//#region src/agents/before-tool-call-metadata.d.ts
/** Return true when a tool already carries the before_tool_call wrapper marker. */
declare function isToolWrappedWithBeforeToolCallHook(tool: AnyAgentTool): boolean;
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
declare function setBeforeToolCallDiagnosticsEnabled(tool: AnyAgentTool, enabled: boolean): void;
//#endregion
//#region src/agents/agent-tools.before-tool-call.diagnostics.d.ts
/** Finalizes a trusted terminal summary after harness result middleware. */
declare function finalizeToolTerminalPresentation(params: {
  toolCallId: string;
  runId?: string;
  result: Awaited<ReturnType<AnyAgentTool["execute"]>>;
  isError: boolean;
  observer?: ToolOutcomeObserver;
  toolName?: string;
  toolCallOrdinal?: number;
}): void;
//#endregion
//#region src/agents/agent-tools.before-tool-call.approval.d.ts
/** Resolve a deferred plugin approval request at the later execution boundary. */
declare function requestDeferredPluginToolApproval(params: {
  deferredApproval: DeferredPluginToolApproval;
  signal?: AbortSignal;
}): Promise<HookOutcome>;
/** Notify plugin approval callbacks that a deferred approval was cancelled. */
declare function cancelDeferredPluginToolApproval(deferredApproval: DeferredPluginToolApproval): void;
//#endregion
//#region src/agents/agent-tools.before-tool-call.policy.d.ts
declare function getBeforeToolCallPolicyDiagnosticState(): BeforeToolCallPolicyDiagnosticState;
/** Return true when any before_tool_call policy could affect tool execution. */
declare function hasBeforeToolCallPolicy(): boolean;
declare function runBeforeToolCallHook(args: {
  toolName: string;
  params: unknown;
  toolKind?: PluginHookToolKind;
  toolInputKind?: PluginHookToolInputKind;
  toolCallId?: string;
  ctx?: HookContext;
  signal?: AbortSignal;
  approvalMode?: "request" | "report" | "deny" | "defer";
}): Promise<HookOutcome>;
//#endregion
//#region src/agents/agent-tools.before-tool-call.wrapper.d.ts
declare class BeforeToolCallBlockedError extends Error {
  readonly reason: string;
  constructor(reason: string);
}
/** Return the closed terminal disposition carried by a before-tool failure. */
declare function getBeforeToolCallFailureDisposition(error: unknown): BeforeToolCallFailureDisposition | undefined;
/** Remember hook-adjusted params for later adapter-side execution. */
declare function recordAdjustedParamsForToolCall(toolCallId: string | undefined, params: unknown, runId?: string): void;
/** Record that one concrete core-owned tool call may use structured replay classification. */
declare function recordStructuredReplayTrustForToolCall(toolCallId: string | undefined, tool: AnyAgentTool, runId?: string): void;
/**
 * Returns true when an error represents an intentional before_tool_call veto.
 */
declare function isBeforeToolCallBlockedError(err: unknown): err is BeforeToolCallBlockedError;
declare function isPreExecutionBlockedToolResult(result: unknown): boolean;
/** Build the standard terminal result for vetoed tool calls. */
declare function buildBlockedToolResult(params: {
  reason: string;
  deniedReason?: HookBlockedReason;
  toolCallId?: string;
  runId?: string;
}): {
  content: {
    type: "text";
    text: string;
  }[];
  details: {
    status: string;
    deniedReason: HookBlockedReason;
    reason: string;
  };
};
declare function wrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext, options?: {
  approvalMode?: "request" | "report" | "deny";
  emitDiagnostics?: boolean;
}): AnyAgentTool;
/** Rebuild a before_tool_call wrapper while preserving the original source tool. */
declare function rewrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext, options?: {
  approvalMode?: "request" | "report" | "deny";
  emitDiagnostics?: boolean;
}): AnyAgentTool;
declare namespace agent_tools_before_tool_call_d_exports {
  export { BeforeToolCallFailureDisposition, BeforeToolCallPolicyDiagnosticState, DeferredPluginToolApproval, HookContext, ToolOutcomeObservation, ToolOutcomeObserver, buildBlockedToolResult, cancelDeferredPluginToolApproval, consumeAdjustedParamsForToolCall, consumePreExecutionBlockedToolCall, finalizeToolTerminalPresentation, getBeforeToolCallFailureDisposition, getBeforeToolCallPolicyDiagnosticState, hasBeforeToolCallPolicy, isBeforeToolCallBlockedError, isPreExecutionBlockedToolResult, isToolWrappedWithBeforeToolCallHook, peekAdjustedParamsForToolCall, recordAdjustedParamsForToolCall, recordStructuredReplayTrustForToolCall, requestDeferredPluginToolApproval, rewrapToolWithBeforeToolCallHook, runBeforeToolCallHook, setBeforeToolCallDiagnosticsEnabled, wrapToolWithBeforeToolCallHook };
}
//#endregion
//#region src/agents/harness/host-capability-types.d.ts
type AgentHarnessHostApprovalDecision = "allow-once" | "allow-always" | "deny";
type AgentHarnessHostCapabilities = Readonly<{
  kind: "agent-harness-host-capability";
  version: 1; /** Fails closed unless this exact admitted run capability remains active. */
  assertActive: () => void; /** Applies the exact host caller binding to a plugin-built tool surface. */
  bindToolSurface: (tools: AnyAgentTool[], options?: Readonly<{
    cwd?: string;
  }>) => AnyAgentTool[]; /** Runs policy with host-fixed HookContext; callers provide only the native action tuple. */
  runBeforeToolCall: (request: Omit<Parameters<(typeof agent_tools_before_tool_call_d_exports)["runBeforeToolCallHook"]>[0], "approvalMode" | "ctx"> & {
    /** Native relays may defer approval for a correlated app-server callback. */approvalMode?: "request" | "defer"; /** Action-local facts from the native runtime; host authority remains closure-bound. */
    nativeOperation?: Readonly<{
      cwd?: string;
    }>;
  }) => ReturnType<(typeof agent_tools_before_tool_call_d_exports)["runBeforeToolCallHook"]>;
  requestApproval: (request: {
    title: string;
    description: string;
    severity: "info" | "warning";
    toolName: string;
    toolCallId?: string;
    allowedDecisions?: AgentHarnessHostApprovalDecision[];
    timeoutMs: number;
    transportTimeoutMs?: number;
  }) => Promise<{
    id?: string;
    decision?: AgentHarnessHostApprovalDecision | null;
  } | undefined>;
  waitForApproval: (request: {
    approvalId: string;
    timeoutMs: number;
    transportTimeoutMs?: number;
    signal?: AbortSignal;
  }) => Promise<AgentHarnessHostApprovalDecision | null | undefined>;
}>;
//#endregion
export { ProviderNormalizeConfigContext as $, MemoryPromptSectionBuilder as $a, ConversationFacts as $i, ProviderBuildMissingAuthMessageContext as $n, PluginRegistry as $r, OpenClawPluginActiveModelContext as $t, OpenClawPluginSecurityAuditCollector as A, assertContextEngineHostSupport as Aa, BuildChannelInboundEventContextAsyncParams as Ai, clearRuntimeAuthProfileStoreSnapshots as An, McpToolCatalog as Ao, attachModelProviderRequestTransport as Ar, AgentRuntimePlan as At, AgentPromptGuidanceEntry as B, resolveBootstrapContextForRun as Ba, finalizeChannelInboundContext as Bi, resolveAuthProfileOrder as Bn, SkillWorkshopRunOptions as Bo, ProviderToolSchemaDiagnostic as Br, ContextEngineHostCapability as Bt, OpenClawGatewayDiscoveryService as C, CronToolOptions as Ca, PluginRuntime as Ci, findPersistedAuthProfileCredential as Cn, AgentToolResultMiddlewareRuntime as Co, ProviderAppGuidedSetupContext as Cr, EmbeddedRunAttemptParams as Ct, OpenClawPluginNodeInvokePolicyContext as D, PromptMode as Da, ResolvedMentionPatternPolicy as Di, resolvePersistedAuthProfileOwnerAgentDir as Dn, NormalizedUsage as Do, ProviderAuthResult as Dr, SandboxContext as Dt, OpenClawPluginNodeInvokePolicy as E, CliSessionBindingFacts as Ea, ResolveMentionPatternPolicyParams as Ei, loadAuthProfileStoreWithoutExternalProfiles as En, EmbeddedAgentRunMeta as Eo, ProviderAuthMethodNonInteractiveContext as Er, isReplaySafeToolCall as Et, PluginInteractiveRegistration as F, formatFastModeCurrentStatus as Fa, FinalizeChannelInboundContextParams as Fi, upsertAuthProfileWithLock as Fn, SandboxFsBridge as Fo, ProviderReplayPolicy as Fr, projectAgentRunAttemptTerminal as Ft, MigrationApplyResult as G, ClientToolDefinition as Ga, ChannelDeliveryOutcome as Gi, augmentModelCatalogWithProviderPlugins as Gn, ScheduledToolPolicyContext as Go, ProviderBuiltInModelSuppressionContext as Gr, ContextEngineRuntimeSettings as Gt, OpenClawPluginCommandDefinition as H, EmbeddedContextFile as Ha, AssembledChannelTurn as Hi, resolveProviderIdForAuth as Hn, ReplyBackendQueueMessageOptions as Ho, PreparedModelRuntimeSnapshot as Hr, ContextEngineProjection as Ht, OpenClawPluginGatewayEventScope as I, formatFastModeSourceSuffix as Ia, FinalizeChannelInboundContextResult as Ii, listProfilesForProvider as In, ExecAutoReviewDecision as Io, ProviderReplayPolicyContext as Ir, setAgentRunAttemptTerminalFailure as It, MigrationPlan as J, PLUGIN_COMMAND_DISPATCH as Ja, ChannelTurnDroppedHistoryOptions as Ji, ProviderThinkingProfile as Jn, normalizeHeartbeatToolResponse as Jo, ProviderCatalogResult as Jr, RuntimeLogger as Jt, MigrationDetection as K, ProcessToolDefaults as Ka, ChannelDeliveryResult as Ki, ProviderDefaultThinkingPolicyContext as Kn, HEARTBEAT_RESPONSE_TOOL_NAME as Ko, ProviderBuiltInModelSuppressionResult as Kr, ContextEngineSessionTarget as Kt, OpenClawPluginGatewayEvents as L, formatFastModeStatusValue as La, buildChannelInboundEventContext as Li, refreshOAuthCredentialForRuntime as Ln, ExecAutoReviewInput as Lo, ProviderReplaySessionEntry as Lr, AssembleResult as Lt, OpenClawPluginService as M, FastModeAutoProgressState as Ma, BuiltChannelInboundEventContext as Mi, suggestOAuthProfileIdForLegacyDefault as Mn, McpCodexToolAnnotations as Mo, ProviderNormalizeToolSchemasContext as Mr, DelegationCapability as Mt, OpenClawPluginServiceContext as N, formatFastModeAutoProgressText as Na, ChannelInboundSupplementalResolutionOptions as Ni, removeProviderAuthProfilesWithLock as Nn, MessagingToolSend as No, ProviderReasoningOutputMode as Nr, mergeAgentRunAttemptTerminal as Nt, OpenClawPluginNodeInvokePolicyResult as O, CODEX_APP_SERVER_CONTEXT_ENGINE_HOST as Oa, resolveMentionPatternPolicy as Oi, saveAuthProfileStore as On, normalizeUsage as Oo, ProviderDeferSyntheticProfileAuthContext as Or, SandboxToolPolicy as Ot, PluginInteractiveHandlerRegistration as P, formatFastModeCommandOptions as Pa, FinalizeChannelInboundContextAsyncParams as Pi, upsertAuthProfile as Pn, MessagingToolSourceReplyPayload as Po, ProviderReasoningOutputModeContext as Pr, normalizeAgentRunAttemptTerminal as Pt, ProviderApplyConfigDefaultsContext as Q, MemoryPluginPublicArtifactsProvider as Qa, CommandFacts as Qi, UsageWindow as Qn, PluginHttpRouteRegistration as Qr, resolveEffectiveTtsConfig as Qt, OpenClawPluginSessionsChangedEvent as R, resolveFastModeForElapsed as Ra, filterChannelInboundQuoteContext as Ri, resolveApiKeyForProfile as Rn, ExecAutoReviewer as Ro, ProviderReplaySessionState as Rr, CompactResult as Rt, OpenClawGatewayDiscoveryAdvertiseContext as S, CronCreatorToolAllowlistEntry as Sa, CreatePluginRuntimeOptions as Si, ensureAuthProfileStoreForLocalUpdate as Sn, AgentToolResultMiddlewareResult as So, ProviderAppGuidedSetupCandidate as Sr, CompactEmbeddedAgentSessionParams as St, OpenClawPluginHttpRouteHandler as T, CommandSessionMetadataChange as Ta, ExplicitMentionSignal as Ti, loadAuthProfileStoreForSecretsRuntime as Tn, EmbeddedAgentCompactResult as To, ProviderAuthMethod as Tr, PreemptiveCompactionRoute as Tt, PluginCommandContext as U, BootstrapContextRunKind as Ua, ChannelCoreManagedTurnDeliveryAdapter as Ui, DEFAULT_OAUTH_REFRESH_MARGIN_MS as Un, ReplyBackendQueueMessageResult as Uo, ProviderRuntimeModel as Ur, ContextEnginePromptCacheInfo as Ut, AgentPromptSurfaceKind as V, resolveBootstrapFilesForRun as Va, resolveInboundSupplementalSenderAllowed as Vi, ProviderAuthAliasLookupParams as Vn, ReplyBackendMessageInjection as Vo, ProviderValidateReplayTurnsContext as Vr, ContextEngineOperation as Vt, PluginCommandResult as W, AgentStreamParams as Wa, ChannelDeliveryInfo as Wi, hasUsableOAuthCredential as Wn, TrustedSubagentCompletionHandoff as Wo, ProviderAugmentModelCatalogContext as Wr, ContextEngineRuntimeContext as Wt, MigrationProviderPlugin as X, MemoryPluginCapability as Xa, ChannelTurnRecordOptions as Xi, ProviderUsageSnapshot as Xn, UnifiedModelCatalogProviderContext as Xr, ResolvedTtsModelOverrides as Xt, MigrationProviderContext as Y, PluginCommandReplyOptions as Ya, ChannelTurnPlan as Yi, ProviderRuntimePluginHandle as Yn, ProviderModernModelPolicyContext as Yr, ResolvedTtsConfig as Yt, MigrationSummary as Z, MemoryPluginPublicArtifact as Za, ChannelTurnResult as Zi, UsageProviderId as Zn, UnifiedModelCatalogProviderPlugin as Zr, TtsConfigResolutionContext as Zt, ToolOutcomeObserver as _, createReplyDispatcherWithTyping as _a, listAdoptedSessionCatalogSessions as _i, resolveProfileUnusableUntilForDisplay as _n, CodexAppServerToolResultHandlerResult as _o, ProviderResolveDynamicModelContext as _r, AgentHarnessSideQuestionParamsV2 as _t, hasBeforeToolCallPolicy as a, CommandAuthorizer as aa, SessionCatalogEntrySummary as ai, AgentHarnessRuntimeArtifactBinding as an, clearMemoryPluginState as ao, ProviderTransportTurnState as ar, AgentHarnessAttemptResult as at, OpenClawPluginApi as b, InternalGetReplyOptions as ba, sessionCatalogAdoptedSessionKey as bi, isProfileInCooldown as bn, AgentToolResultMiddlewareEvent as bo, ProviderUsageAuthToken as br, AgentHarnessSupportContext as bt, finalizeToolTerminalPresentation as c, resolveControlCommandGate as ca, SessionCatalogReadProviderParams as ci, ExecToolDefaults as cn, registerMemoryCapability as co, ProviderAuthDoctorHintContext as cr, AgentHarnessCompactResult as ct, consumeAdjustedParamsForToolCall as d, settleReplyDispatcher as da, SessionUpstreamActivity as di, resolveApiKeyForProviderCore as dn, buildPluginConfigSchema as do, ProviderNormalizeResolvedModelContext as dr, AgentHarnessResultClassification as dt, InboundMediaFacts as ea, PluginRegistryParams as ei, OpenClawPluginToolContext as en, MemoryPromptSectionParams as eo, ProviderBuildUnknownModelHintContext as er, ProviderResolveConfigApiKeyContext as et, consumePreExecutionBlockedToolCall as f, DispatchReplyWithBufferedBlockDispatcher$1 as fa, SessionUpstreamJsonValue as fi, ResolvedProviderAuth as fn, emptyPluginConfigSchema as fo, ProviderNormalizeTransportContext as fr, AgentHarnessSessionForkFailureCode as ft, HookContext as g, createReplyDispatcher as ga, isExternalUserText as gi, markAuthProfileBlockedUntil as gn, CodexAppServerToolResultEvent as go, ProviderPreparedRuntimeAuth as gr, AgentHarnessSideQuestionParams as gt, DeferredPluginToolApproval as h, ReplyDispatcherWithTypingOptions as ha, createSessionCatalogAdoptionCoordinator as hi, omitEnvKeysCaseInsensitive as hn, CodexAppServerExtensionRuntime as ho, ProviderPrepareRuntimeAuthContext as hr, AgentHarnessSettledTurnFinalizationResult as ht, getBeforeToolCallPolicyDiagnosticState as i, recordChannelBotPairLoopAndCheckSuppression as ia, SessionCatalogEntrySnapshot as ii, EmbeddedRunTrigger as in, buildMemoryPromptSection as io, ProviderResolveWebSocketSessionPolicyContext as ir, AgentHarnessAttemptParamsV2 as it, OpenClawPluginSecurityAuditContext as j, resolveFastModeState as ja, BuildChannelInboundEventContextParams as ji, replaceRuntimeAuthProfileStoreSnapshots as jn, SessionMcpRuntime as jo, getModelProviderRequestTransport as jr, BuildAgentRuntimePlanParams as jt, OpenClawPluginReloadRegistration as k, ContextEngineHostSupport as ka, recordDroppedChannelTurnHistory as ki, updateAuthProfileStoreWithLock as kn, ModelFallbackRouteResolution as ko, ProviderPluginWizardSetup as kr, SandboxWorkspaceAccess as kt, isToolWrappedWithBeforeToolCallHook as l, resolveDualTextControlCommandGate as la, SessionCatalogStartTerminalProviderParams as li, ModelAuthMode as ln, registerMemoryCorpusSupplement as lo, ProviderFetchUsageSnapshotContext as lr, AgentHarnessDeliveryDefaults as lt, BeforeToolCallPolicyDiagnosticState as m, ReplyDispatcherOptions as ma, SessionUpstreamProbe as mi, listKnownProviderAuthEnvVarNames as mn, CodexAppServerExtensionFactory as mo, ProviderPrepareExtraParamsContext as mr, AgentHarnessSessionForkResult as mt, getBeforeToolCallFailureDisposition as n, RunChannelTurnParams as na, SessionCatalogContinueProviderParams as ni, OpenKeyedStoreOptions as nn, SessionDiscussionProvider as no, ProviderFailoverErrorContext as nr, AgentHarness as nt, runBeforeToolCallHook as o, CommandGatingModeWhenAccessGroupsOff as oa, SessionCatalogListProviderParams as oi, ConversationRecallContext as on, getMemoryCapabilityRegistration as oo, ProviderWebSocketSessionPolicy as or, AgentHarnessAuthBindingFingerprintParams as ot, BeforeToolCallFailureDisposition as p, DispatchReplyWithDispatcher as pa, SessionUpstreamKind as pi, resolveEnvApiKey as pn, CodexAppServerExtensionContext as po, ProviderPrepareDynamicModelContext as pr, AgentHarnessSessionForkParams as pt, MigrationItem as q, EmbeddedBlockChunker as qa, ChannelProviderOwnedMessageSendingDeliveryAdapter as qi, ProviderThinkingPolicyContext as qn, HeartbeatToolResponse as qo, ProviderCatalogContext as qr, TranscriptRewriteResult as qt, wrapToolWithBeforeToolCallHook as r, ChannelBotLoopProtectionFacts as ra, SessionCatalogContinueProviderResult as ri, DEFAULT_PROVIDER as rn, SessionDiscussionState as ro, ProviderResolveTransportTurnStateContext as rr, AgentHarnessAttemptParams as rt, requestDeferredPluginToolApproval as s, resolveCommandAuthorizedFromAuthorizers as sa, SessionCatalogProvider as si, ExecElevatedDefaults as sn, listActiveMemoryPublicArtifacts as so, ProviderWrapStreamFnContext as sr, AgentHarnessCompactParams as st, AgentHarnessHostCapabilities as t, PreparedChannelTurn as ta, SessionCatalogArchiveProviderParams as ti, OpenClawPluginToolFactory as tn, SessionDiscussionInfo as to, ProviderCacheTtlEligibilityContext as tr, PluginLogger as tt, setBeforeToolCallDiagnosticsEnabled as u, finalizeInboundContextForSdk as ua, SessionCatalogTerminalPlan as ui, resolveModelAuthMode as un, buildJsonPluginConfigSchema as uo, ProviderNormalizeModelIdContext as ur, AgentHarnessResetParams as ut, OpenClawPluginDefinition as v, DispatchFromConfigResult as va, listSessionCatalogEntries as vi, resolveProfilesUnavailableReason as vn, AgentToolResultMiddleware as vo, ProviderResolveUsageAuthContext as vr, AgentHarnessSideQuestionResult as vt, OpenClawPluginGatewayRuntimeScopeSurface as w, CronToolsAllowCaptureRef as wa, BuildMentionRegexesOptions as wi, loadAuthProfileStoreForRuntime as wn, OpenClawAgentToolResult as wo, ProviderAuthContext as wr, EmbeddedRunAttemptResult as wt, ProviderPlugin as x, CronCreatorAuthorityCapability as xa, sessionCatalogAdoptedSourceKey as xi, ensureAuthProfileStore as xn, AgentToolResultMiddlewareOptions as xo, ProviderAppGuidedSetup as xr, AgentHarnessV2 as xt, OpenClawPluginConfigSchema as y, InternalGetReplyFromConfig as ya, normalizeUserText as yi, clearExpiredCooldowns as yn, AgentToolResultMiddlewareContext as yo, ProviderResolvedUsageAuth as yr, AgentHarnessSupport as yt, AgentPromptGuidance as z, buildBootstrapContextForFiles as za, filterChannelInboundSupplementalContext as zi, resolveAuthProfileEligibility as zn, ExecApprovalContinuationPromptRange as zo, ProviderSanitizeReplayHistoryContext as zr, ContextEngine as zt };