import { A as MessageReceipt, D as ConversationReadInvocationOrigin, F as OutboundMediaReadFile, T as ChannelThreadingToolContext, _ as ChannelOutboundTargetMode, m as ChannelMessageActionAdapter, n as ChannelAccountSnapshot } from "./types.core-D9YiZM0R.js";
import { T as ThinkingLevel, d as Model, j as Usage, l as ImageContent$1, n as Api, r as AssistantMessage } from "./types-DTWCh4Mv.js";
import "./index-DspOpKBe.js";
import "./agent-core-BkRJ6FA8.js";
import { b as StreamFn, c as AgentMessage, f as AgentToolResult, p as AgentToolUpdateCallback, u as AgentTool } from "./types-aADBdueZ.js";
import { t as Result } from "./result-VHVNeWs6.js";
import { l as ModelRegistry$1, s as ToolDefinition, u as AuthStorage } from "./index-CbLguB1A.js";
import "./types-Cc0P-Eyx.js";
import "./index-Bf1XfcnS.js";
import { A as PluginApprovalRequestPayload, C as MessagePresentationAction, O as ChannelApprovalKind, S as MessagePresentation, _ as PromptImageOrderEntry, a as TaskSuggestionDeliveryMode, b as ReplyPayload, c as UserTurnTranscriptRecorder, d as TranscriptTurnBoundary, f as AgentPlanStep, g as MediaFact, h as LegacyMediaContextKey, k as PluginApprovalRequest$1, l as TranscriptEntryAnchor, m as ExecutionIdentityAdmissionToken, n as GetReplyOptions, o as TurnAdoptionLifecycle, p as ExecutionIdentityAdmissionFacts, r as PartialReplyPayload, s as UserTurnInput, t as BlockReplyContext, u as TranscriptTurnAdmission, y as ReplyMediaAttachment } from "./types-DpImvtmp.js";
import { A as ResolvedTtsPersona, Ct as ChatType, F as TtsProvider, G as AcpRuntimeCapabilities, J as AcpRuntimeEvent, M as TtsConfig, N as TtsMode, P as TtsModelOverrideConfig, Q as AcpRuntimeStatus, St as SessionScope, U as AcpElicitationHandler, V as FastMode, W as AcpRuntime, X as AcpRuntimePromptMode, Y as AcpRuntimeHandle, Z as AcpRuntimeSessionMode, _t as HumanDelayConfig, a as McpServerToolFilterConfig, c as TalkProviderConfig, dt as MemoryCitationsMode, et as AcpRuntimeTurnAttachment, ft as SafeBinProfileFixture, ht as DmScope, i as McpCodexToolApprovalMode, j as TtsAutoMode, l as OperatorScope, lt as GroupToolPolicyConfig, n as OpenClawConfig, pt as ContextVisibilityMode, st as SilentReplyConversationType, t as ConfigFileSnapshot, ut as ToolLoopDetectionConfig, vt as IdentityConfig, x as ChannelImplicitMentionsConfig, z as QueueMode } from "./types.openclaw-DckSqIPo.js";
import { a as ExecApprovalDecision, d as ExecMode, f as ExecSecurity, g as ApprovalScope, p as ExecTarget, s as ExecApprovalRequestPayload$1, u as ExecAsk } from "./exec-approvals-DOpNCvPj.js";
import { r as SessionApprovalReplay, t as ApprovalPresentation } from "./approvals-Xlp2ut16.js";
import { a as SessionEntry, b as SessionCreatedVia, c as SessionToolOverrides, g as SessionAcpMeta, h as SessionAcpIdentity, i as SessionContextBudgetStatus, l as SessionSystemPromptReport, m as AcpSessionRuntimeOptions, n as GroupKeyResolution, o as SessionPluginJsonValue, p as CronScheduledToolPolicy, t as CliSessionBinding, v as SourceReplyDeliveryMode, y as SessionCreatedActor } from "./types-DPz-SxBl.js";
import { _ as MediaUnderstandingOutput, a as MsgContext, c as SupplementalContextFacts, d as CommandTurnContext, f as CommandTurnKind, g as StructuredExtractionInput, h as MediaUnderstandingProvider, i as MentionSource, l as HistoryEntry, m as MediaUnderstandingDecision, n as FinalizedRuntimeMsgContext, o as OriginatingChannelType, p as PluginHookChannelContext, r as InboundSourceModality, s as SessionTranscriptContext, t as FinalizedMsgContext, u as HistoryMediaEntry, v as InboundEventKind } from "./templating-vVIL_k5D.js";
import { n as SecretRef, t as SecretInput } from "./types.secrets-ktKWXaKr.js";
import { a as ModelMediaInputConfig, f as AgentModelConfig, i as ModelDefinitionConfig, n as ModelApi, o as ModelProviderAuthMode, r as ModelCompatConfig, s as ModelProviderConfig } from "./types.models-BxGvs1Ab.js";
import { c as MemorySearchResult, i as MemoryOriginClass, o as MemoryReadResult, r as MemoryExtraPath, s as MemorySearchManager, t as LegacyMemoryReadResult } from "./types-Cyy1uoGn.js";
import { i as OAuthCredential, n as AuthProfileCredential, r as AuthProfileStore, t as ApiKeyCredential } from "./types-ZIfSo0I1.js";
import "./types-B4QsRB1k.js";
import { n as mediaKindFromMime, t as MediaKind } from "./constants-CbtCb9df.js";
import { t as InputProvenance } from "./input-provenance-tG11qAd-.js";
import { A as SessionsCatalogContinueParams, B as ConnectParams, C as SystemAgentChatQuestion, D as AgentWaitParams, E as ToolsGitHubAuthorizeStartResult, F as WorkerConnectParams, G as SessionPermissionMode, I as WorkerTranscriptCommitParams, L as WorkerTranscriptMessage, M as SessionsCatalogReadResult, N as WorkerInferenceModelRef, O as SessionCatalogHost, P as WorkerInferenceOptions, R as SessionGitHubPublicationResult, S as WorkerTunnelStatus, T as ToolsGitHubAuthorizePollResult, V as ErrorShape, W as RequestFrame, _ as QuestionWaitAnswerResult, a as Snapshot, b as ScopeUpgradeResult, c as SessionsCompanionStateResult, d as SessionPlacementRunner, f as Question, g as QuestionResolvedEvent, h as QuestionResolveResult, i as PortalSummary, j as SessionsCatalogReadParams, k as SessionsCatalogArchiveParams, l as SessionMoveTarget, m as QuestionRecord, n as WizardStep$1, o as SessionObserverDigest, p as QuestionAnswers, r as PortalOpenResult, s as SessionsCompanionAskResult, t as WizardAnswer, u as SessionPlacementDiskSpace, v as NodePluginToolDescriptor, w as SystemAgentWizardCancel, x as WorkerEnvironmentState, y as NodeSkillDescriptor, z as SessionGitHubPublishParams } from "./index-DonKUfyV.js";
import { r as ChannelRouteRef } from "./channel-route-Dbb9bNro.js";
import { t as DeliveryContext } from "./delivery-context.types-D9JsPwhy.js";
import { t as ChatChannelId } from "./ids-BUiVO67E.js";
import { t as ChannelId$1 } from "./channel-id.types-myn0PI2A.js";
import { A as chunkByNewline, E as ChannelOutboundAdapter, F as resolveChunkMode, I as resolveTextChunkLimit, J as buildAgentSessionKey, K as SecurityAuditFinding, M as chunkMarkdownTextWithMode, N as chunkText, P as chunkTextWithMode, Y as resolveAgentRoute, j as chunkMarkdownText, z as OutboundPayloadDeliverySuppressionReason } from "./types.adapters-DSFOIJRX.js";
import { E as ModelCatalogContextWindowOption, O as UnifiedModelCatalogEntry, _ as PluginManifestDashboardActionVerb, a as PluginOrigin$1, d as PluginBundleFormat, f as PluginConfigUiHint, g as PluginManifestDashboard, h as PluginManifestContracts, i as PluginDependencyStatus, k as UnifiedModelCatalogKind, m as PluginFormat, p as PluginDiagnostic, t as PluginManifestRecord, v as PluginManifestDashboardDataBinding, w as PluginKind, y as PluginManifestMcpServer } from "./manifest-registry-DlXWkAjt.js";
import { t as RuntimeEnv } from "./runtime-DQuhivO0.js";
import { t as JsonSchemaObject } from "./json-schema.types-C6Gpa9tj.js";
import { n as WizardPrompter, t as ChannelPlugin$3 } from "./types.plugin-6ADbGQTO.js";
import "./types.public-CrLR9xRK.js";
import { o as SessionBindingRecord } from "./session-binding.types-iPttD8T3.js";
import { i as PluginCompatCode, n as PluginMetadataSnapshot, t as PluginMetadataRegistryView } from "./plugin-metadata-snapshot.types-CtWP2XaL.js";
import "./plugin-metadata-snapshot-N0cS4S-r.js";
import { i as ConfigWriteAfterWrite, n as ConfigReplaceResult, t as resolveStateDir } from "./config-ApKLtW3N.js";
import "./channel-contract-Bz6Blpdo.js";
import { n as createSubsystemLogger, r as LogLevel } from "./subsystem-RmDRaRJV.js";
import { n as OpenClawStateDatabaseOptions, t as OpenClawStateDatabase } from "./openclaw-state-db-contract-BbwGU0Ve.js";
import { i as VerboseLevel, n as ThinkLevel, r as ThinkingCatalogEntry, t as ReasoningLevel } from "./thinking.shared-C7tD_Pkp.js";
import { x as completeSimple } from "./llm-DXDoKfBx.js";
import { i as ProviderCatalogOutcome, n as ModelCatalogEntry, r as ModelCatalogSnapshot } from "./session-store-runtime-C3ijbxsj.js";
import { B as DiagnosticTraceContext, F as ReplyDispatchKind, I as ReplyDispatchReceipt, L as ReplyDispatchRuntimeInfo, M as PluginHookBeforeToolCallResult, N as ReplyDispatchBeforeDeliver, P as ReplyDispatchBeforeDeliverOptions, R as ReplyDispatcher, V as PluginJsonValue, _ as PluginToolMatcher, a as PluginHookRegistration$1, d as PluginHookToolContext, f as PluginHookToolInputKind, i as PluginHookName, j as PluginApprovalResolution, m as PluginHookToolRequesterContext, n as PluginHookBeforeToolCallEvent, o as PluginHookRegistrationOptions, p as PluginHookToolKind, r as PluginHookHandlerMap, v as PluginNextTurnInjection, y as PluginNextTurnInjectionEnqueueResult, z as ReplyFollowupAdmissionBarrierTimeoutPolicy } from "./hook-types-DzJ6T1Zz.js";
import { $ as TalkEventType, C as RealtimeVoiceBridge, D as RealtimeVoiceBrowserSession, F as RealtimeVoiceProviderConfiguredContext, I as RealtimeVoiceProviderId, J as TalkBrain, L as RealtimeVoiceProviderResolveConfigContext, N as RealtimeVoiceProviderCapabilities, O as RealtimeVoiceBrowserSessionCreateRequest, P as RealtimeVoiceProviderConfig, T as RealtimeVoiceBridgeCreateRequest, et as TalkMode, s as TranscriptSourceProvider$2, tt as TalkTransport } from "./provider-types-CbuAPn98.js";
import { t as FailoverReason } from "./signal-DTFr3i_8.js";
import { a as CronJobCreate, c as CronRunStatus, d as NormalizeReplySkipReason, i as CronJob, l as CronStoredJob, o as CronJobPatch, s as CronPayload, u as CronToolsAllowProvenance } from "./store-D6ktQ-qW.js";
import { t as CronRuntimeAuthority } from "./runtime-authority-UwYXiqCS.js";
import { n as HeartbeatRunResult, t as requestHeartbeat } from "./heartbeat-wake-nIRu4VaB.js";
import "./openclaw-state-db.generated-CIYJwO5s.js";
import { C as RuntimePluginToolGrant, S as TrustedSubagentCompletionHandoff, a as CronCreatorAuthorityCapability, c as CronCreatorToolAllowlistEntry, d as ScheduledToolPolicyContext, f as AnyAgentTool, i as SilentReplyPromptMode, l as CronToolOptions, n as ResolvedConversationCapabilityProfile, r as PromptMode, u as CronToolsAllowCaptureRef, w as CronCreatorAuthorityGrant, x as SubagentCompletionToolHandoffRegistration } from "./bundle-mcp-B4GOVNpD.js";
import { o as runCommandWithTimeout, s as SpawnResult } from "./exec-VwHB8J3Z.js";
import "./delivery-context.shared-BvqoxGnQ.js";
import { i as projectOutboundPayloadPlanForJson, n as DurableFinalDeliveryRequirements, o as PluginSubagentRequesterContext, r as OutboundDeliveryQueuePolicy, t as DeliverOutboundPayloadsParams } from "./deliver-contracts-BZlOINXx.js";
import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-CFXqHr3d.js";
import { l as ImageGenerationProvider } from "./types-CBj3dJsd.js";
import { c as MusicGenerationProvider, f as MusicGenerationSourceImage, o as MusicGenerationNormalization, r as MusicGenerationIgnoredOverride, s as MusicGenerationOutputFormat, t as GeneratedMusicAsset } from "./types-BLU0iP9x.js";
import { l as VideoGenerationProvider } from "./types-BGSj9yXQ.js";
import { i as PluginConversationBindingResolvedEvent$1, n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "./conversation-binding.types-BD9crVlm.js";
import { a as EmbeddingProviderCreateOptions, c as EmbeddingProviderRuntime, i as EmbeddingProviderCallOptions, n as EmbeddingProvider, o as EmbeddingProviderCreateResult, r as EmbeddingProviderAdapter, s as EmbeddingProviderIndexIdentity } from "./embedding-providers-CxjYYzgo.js";
import { n as resolveAgentDir, r as resolveAgentWorkspaceDir } from "./sessions-CcYLge8i.js";
import { b as MemoryMultimodalSettings, r as MemoryChunk, v as EmbeddingInput } from "./internal-CWnoK0BO.js";
import { g as onSessionTranscriptUpdate, h as ResolvedSessionMaintenanceConfigInput, n as SessionManager } from "./session-manager-9ZigNj1A.js";
import { t as resolveSessionStorePathCore } from "./paths-Bf-grF6E.js";
import { a as retryAsync, r as RetryOptions } from "./index-BtQwxzkW.js";
import { a as fetchWithSsrFGuard } from "./fetch-guard-DExAY3EM.js";
import { o as shouldUseEnvHttpProxyForUrl } from "./proxy-env-CUnGCQ8d.js";
import { S as SkillUsagePath, b as SkillSnapshot, g as SandboxFsBridge, l as SandboxBackendExecSpec, m as SandboxBackendWorkdirValidator, n as SandboxContext, p as SandboxBackendWorkdirValidation, x as SkillTelemetrySource, y as ExplicitSkillSelection } from "./types-BnWnz8Sq.js";
import { i as ExecAutoReviewer } from "./exec-auto-review-D8kEqNZE.js";
import { n as ModelFallbackAttemptProvenance, t as FallbackAttempt } from "./model-fallback.types-DRMjhurk.js";
import { i as OAuthLoginCallbacks, r as OAuthCredentials } from "./provider-oauth-runtime-BZ49xsx4.js";
import "./sandbox-Dv-ip-Ri.js";
import { c as InboundImplicitMentionKind, g as resolveInboundMentionDecision, h as implicitMentionKindWhen, i as MatchesMentionWithExplicit, r as MatchesMentionPatterns, t as BuildMentionRegexes, u as InboundMentionFacts } from "./mentions.types-BjYN2_OF.js";
import { n as ShouldHandleTextCommandsParams, t as CommandNormalizeOptions } from "./commands-registry.types-DlqupOSw.js";
import { t as convertMarkdownTables } from "./tables-BdlTasHh.js";
import { i as UpsertChannelPairingRequestForAccount, n as ReadChannelAllowFromStoreForAccount, r as RemoveChannelAllowFromStoreEntryForAccount, t as buildPairingReply } from "./pairing-messages-TqyEWnss.js";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-DHmfFkL5.js";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-CMPZH0DR.js";
import { i as PairLoopGuardConfig } from "./pair-loop-guard-runtime-C-sW-TdY.js";
import { t as ResolveMarkdownTableMode } from "./markdown-tables.types-CuEm7WFS.js";
import { o as ProviderUsageSnapshot } from "./provider-usage.types-C1Xx8-CM.js";
import { t as ModelProviderRequestTransportOverrides$1 } from "./provider-request-config-Bmr3aFM9.js";
import { n as ProviderThinkingProfile, t as ProviderDefaultThinkingPolicyContext } from "./provider-thinking.types-Dxc6gDm5.js";
import "./model-ref-shared-Cug-8F6W.js";
import { t as ProviderAuthEvidence } from "./provider-env-vars-Ob29-zkr.js";
import { i as ProviderModelRouteRuntimePolicy, l as ProviderRouteOverridePresence, t as ProviderModelRouteAuthRequirement } from "./provider-model-types-BNZPSOa4.js";
import { t as enqueueSystemEvent } from "./system-events-DOMq8LSr.js";
import { n as GenerateImageRuntimeResult, t as GenerateImageParams } from "./runtime-types-BxSAgYIT.js";
import { n as GenerateVideoRuntimeResult, t as GenerateVideoParams } from "./runtime-types-BmPjBEnA.js";
import { i as PluginStateSyncKeyedStore, r as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "./plugin-state-store.types-DnCvxs0P.js";
import { Static, TSchema, Type } from "typebox";
import { ZodTypeAny } from "zod";
import { DatabaseSync } from "node:sqlite";
import { IncomingMessage, ServerResponse } from "node:http";
import { Duplex } from "node:stream";
import { Command } from "commander";
import "kysely";
import { WebSocket } from "ws";
import "@modelcontextprotocol/sdk/types.js";
import "@openclaw/ai";
import { ImageMetadata } from "rastermill";
import "@openclaw/ai/internal/openai";
//#region src/agents/agent-runtime-id.d.ts
type EmbeddedAgentRuntime = "openclaw" | "auto" | (string & {});
//#endregion
//#region src/config/mutation-types.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
//#endregion
//#region src/plugins/provider-auth-types.d.ts
/** Provider secret input modes: inline plaintext or external secret reference. */
type SecretInputMode = "plaintext" | "ref";
//#endregion
//#region src/commands/daemon-runtime.d.ts
type GatewayDaemonRuntime = "bun" | "node";
//#endregion
//#region src/commands/onboard-types.d.ts
type OnboardMode = "local" | "remote";
/**
 * Auth choices are plugin-owned contract ids plus a few legacy aliases that
 * are normalized elsewhere (for example `oauth` -> `setup-token`).
 */
type BuiltInAuthChoice =
/** @deprecated Use `setup-token`. */
"oauth" | "setup-token" | "token" | "apiKey" | "custom-api-key" | "skip";
type AuthChoice = BuiltInAuthChoice | (string & {});
type GatewayAuthChoice = "token" | "password";
type ResetScope = "config" | "config+creds+sessions" | "full";
type GatewayBind = "loopback" | "lan" | "auto" | "custom" | "tailnet";
type TailscaleMode = "off" | "serve" | "funnel";
declare const NODE_MANAGER_CHOICES: readonly ["npm", "pnpm", "bun"];
type NodeManagerChoice = (typeof NODE_MANAGER_CHOICES)[number];
declare const ONBOARD_FLOWS: readonly ["quickstart", "advanced", "manual", "import"];
type OnboardFlow = (typeof ONBOARD_FLOWS)[number];
type OnboardDynamicProviderOptions = {
  /**
   * Provider-specific non-interactive auth flags are plugin-owned and keyed by
   * manifest `providerAuthChoices[].optionKey` values.
   */
  [optionKey: string]: unknown;
};
/** Parsed options accepted by `openclaw onboard`. */
type OnboardOptions = OnboardDynamicProviderOptions & {
  mode?: OnboardMode;
  /** "manual" is an alias for "advanced". */
  flow?: OnboardFlow;
  /** Force the classic multi-step interactive wizard instead of guided setup. */
  classic?: boolean;
  /** Force the terminal hatch instead of the guided browser handoff. */
  tui?: boolean;
  workspace?: string;
  /** Name for the first persisted agent; defaults to `main` in non-interactive setup. */
  agentName?: string;
  nonInteractive?: boolean;
  /** Required for non-interactive setup; skips the interactive risk prompt when true. */
  acceptRisk?: boolean;
  reset?: boolean;
  resetScope?: ResetScope;
  authChoice?: AuthChoice;
  /** Used when `authChoice=token` in non-interactive mode. */
  tokenProvider?: string;
  /** Used when `authChoice=token` in non-interactive mode. */
  token?: string;
  /** Used when `authChoice=token` in non-interactive mode. */
  tokenProfileId?: string;
  /** Used when `authChoice=token` in non-interactive mode. */
  tokenExpiresIn?: string;
  /** API key persistence mode for setup flows (default: plaintext). */
  secretInputMode?: SecretInputMode;
  arceeaiApiKey?: string;
  cloudflareAiGatewayAccountId?: string;
  cloudflareAiGatewayGatewayId?: string;
  customBaseUrl?: string;
  customApiKey?: string;
  lmstudioApiKey?: string;
  customModelId?: string;
  customProviderId?: string;
  customCompatibility?: "openai" | "openai-responses" | "anthropic";
  customImageInput?: boolean;
  gatewayPort?: number;
  gatewayBind?: GatewayBind;
  gatewayAuth?: GatewayAuthChoice;
  gatewayToken?: string;
  gatewayTokenRefEnv?: string;
  gatewayPassword?: string;
  tailscale?: TailscaleMode;
  installDaemon?: boolean;
  daemonRuntime?: GatewayDaemonRuntime;
  skipChannels?: boolean;
  skipSkills?: boolean;
  skipBootstrap?: boolean;
  skipSearch?: boolean;
  skipHealth?: boolean;
  skipUi?: boolean;
  suppressGatewayTokenOutput?: boolean;
  skipHooks?: boolean;
  nodeManager?: NodeManagerChoice;
  remoteUrl?: string;
  remoteToken?: string;
  remotePassword?: string;
  importFrom?: string;
  importSource?: string;
  importSecrets?: boolean;
  json?: boolean;
};
//#endregion
//#region src/agents/auth-profiles/runtime-snapshots.d.ts
type RuntimeAuthProfileStoreMutationListener = (event: {
  agentDir?: string;
  affectsInheritedStores: boolean;
}) => void;
/** Observes credential snapshot changes at their lifecycle publication edge. */
declare function registerRuntimeAuthProfileStoreMutationListener(listener: RuntimeAuthProfileStoreMutationListener): () => void;
//#endregion
//#region src/tts/provider-types.d.ts
/** Canonical speech provider identifier after provider registry normalization. */
type SpeechProviderId = string;
/** Output context requested from a speech provider. */
type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";
/** Provider-owned normalized config map. */
type SpeechProviderConfig = Record<string, unknown>;
/** Provider-owned per-request directive/persona overrides. */
type SpeechProviderOverrides = Record<string, unknown>;
/** Policy controlling which [[tts:*]] directive fields can affect synthesis. */
type SpeechModelOverridePolicy = {
  enabled: boolean;
  allowText: boolean;
  allowProvider: boolean;
  allowVoice: boolean;
  allowModelId: boolean;
  allowVoiceSettings: boolean;
  allowNormalization: boolean;
  allowSeed: boolean;
};
/** Parsed directive overrides grouped by provider. */
type TtsDirectiveOverrides = {
  ttsText?: string;
  provider?: SpeechProviderId;
  providerOverrides?: Record<string, SpeechProviderOverrides>;
};
/** Result of parsing TTS directives from message text. */
type TtsDirectiveParseResult = {
  cleanedText: string;
  ttsText?: string;
  hasDirective: boolean;
  overrides: TtsDirectiveOverrides;
  warnings: string[];
};
/** Context for checking whether a provider has enough config to synthesize. */
type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};
/** Request for buffered speech synthesis. */
type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Buffered speech synthesis result plus file/voice-note compatibility metadata. */
type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};
type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;
/** Streaming speech synthesis result; release frees provider transport resources. */
type SpeechSynthesisStreamResult = {
  audioStream: ReadableStream<Uint8Array>;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
  release?: () => Promise<void>;
};
/** Telephony synthesis request for provider output that needs a fixed sample rate. */
type SpeechTelephonySynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Telephony synthesis result with sample-rate metadata for call transports. */
type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};
/** Provider hook input for applying persona/config before synthesis. */
type SpeechProviderPrepareSynthesisContext = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  persona?: ResolvedTtsPersona;
  personaProviderConfig?: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  timeoutMs: number;
};
/** Optional provider-prepared synthesis overrides. */
type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};
/** Voice metadata returned by provider list-voices hooks. */
type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};
/** Provider voice-listing request with optional direct auth/URL overrides. */
type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string;
  /** Core-resolved request timeout after config and provider defaults. */
  timeoutMs?: number;
};
/** Provider hook input for resolving normalized config from raw OpenClaw config. */
type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};
/** One parsed directive key/value plus current provider override state. */
type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};
/** Provider directive parser result. */
type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};
/** Provider hook input for resolving talk-command speech config. */
type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};
/** Provider hook input for per-call talk-command overrides. */
type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
//#endregion
//#region src/tts/directives.d.ts
type ParseTtsDirectiveOptions = {
  cfg?: OpenClawConfig;
  providers?: readonly SpeechProviderPlugin$1[];
  providerConfigs?: Record<string, SpeechProviderConfig>;
  preferredProviderId?: string;
};
/** Parse TTS directives from final message text, leaving markdown code spans unchanged. */
declare function parseTtsDirectives(text: string, policy: SpeechModelOverridePolicy, options?: ParseTtsDirectiveOptions): TtsDirectiveParseResult;
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
//#region src/agents/embedded-agent-runner/execution-phase.d.ts
/**
 * Ordered execution milestones reported by the embedded runner while a turn starts up.
 *
 * Keep labels stable: external status surfaces and diagnostics consume the formatted values.
 */
declare const EMBEDDED_AGENT_EXECUTION_PHASES: readonly ["runner_entered", "workspace", "runtime_plugins", "before_agent_reply", "model_resolution", "auth", "context_engine", "attempt_dispatch", "context_assembled", "turn_accepted", "process_spawned", "tool_execution_started", "assistant_output_started", "model_call_started"];
type EmbeddedAgentExecutionPhase = (typeof EMBEDDED_AGENT_EXECUTION_PHASES)[number];
//#endregion
//#region src/infra/diagnostic-events.d.ts
type DiagnosticSessionState = "idle" | "processing" | "waiting";
type DiagnosticBaseEvent = {
  ts: number;
  seq: number;
  trace?: DiagnosticTraceContext;
};
type DiagnosticUsageEvent = DiagnosticBaseEvent & {
  type: "model.usage";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  agentId?: string;
  provider?: string;
  model?: string;
  usage: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    promptTokens?: number;
    total?: number;
  };
  lastCallUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  context?: {
    limit?: number;
    used?: number;
  };
  costUsd?: number;
  durationMs?: number;
};
type DiagnosticFailoverEvent = DiagnosticBaseEvent & {
  type: "model.failover";
  sessionId?: string;
  sessionKey?: string;
  lane?: string;
  fromProvider?: string;
  fromModel?: string;
  toProvider?: string;
  toModel?: string;
  reason: string;
  cascadeDepth?: number;
  suspended?: boolean;
};
type DiagnosticSecurityEventActor = {
  kind: "operator" | "node" | "agent" | "plugin" | "channel_sender" | "system";
  idHash?: string;
  deviceIdHash?: string;
  channel?: string;
  role?: string;
  scopes?: string[];
};
type DiagnosticSecurityEventTarget = {
  kind: "gateway" | "device" | "node" | "tool" | "plugin" | "secret_ref" | "channel" | "config" | "session";
  idHash?: string;
  name?: string;
  owner?: string;
};
type DiagnosticSecurityEventPolicy = {
  id?: string;
  decision?: "allow" | "deny" | "ask" | "auto" | "full" | "not_applicable";
  reason?: string;
};
type DiagnosticSecurityEventControl = {
  id?: string;
  family?: "auth" | "authorization" | "approval" | "sandbox" | "secret" | "supply_chain";
};
type DiagnosticSecurityEvent = DiagnosticBaseEvent & {
  type: "security.event";
  eventId: string;
  category: "auth" | "approval" | "tool" | "plugin" | "secret" | "channel" | "config" | "audit" | "telemetry";
  action: string;
  outcome: "success" | "failure" | "denied" | "error";
  severity: "info" | "low" | "medium" | "high" | "critical";
  actor?: DiagnosticSecurityEventActor;
  target?: DiagnosticSecurityEventTarget;
  policy?: DiagnosticSecurityEventPolicy;
  control?: DiagnosticSecurityEventControl;
  reason?: string;
  attributes?: Record<string, string | number | boolean>;
};
type DiagnosticWebhookReceivedEvent = DiagnosticBaseEvent & {
  type: "webhook.received";
  channel: string;
  updateType?: string;
  chatId?: number | string;
};
type DiagnosticWebhookProcessedEvent = DiagnosticBaseEvent & {
  type: "webhook.processed";
  channel: string;
  updateType?: string;
  chatId?: number | string;
  durationMs?: number;
};
type DiagnosticWebhookErrorEvent = DiagnosticBaseEvent & {
  type: "webhook.error";
  channel: string;
  updateType?: string;
  chatId?: number | string;
  error: string;
};
type DiagnosticMessageQueuedEvent = DiagnosticBaseEvent & {
  type: "message.queued";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  source: string;
  queueDepth?: number;
};
type DiagnosticMessageReceivedEvent = DiagnosticBaseEvent & {
  type: "message.received";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  messageId?: number | string;
  chatId?: number | string;
  source: string;
};
type DiagnosticMessageDispatchStartedEvent = DiagnosticBaseEvent & {
  type: "message.dispatch.started";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  source: string;
};
type DiagnosticMessageDispatchCompletedEvent = DiagnosticBaseEvent & {
  type: "message.dispatch.completed";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  source: string;
  durationMs: number;
  outcome: "completed" | "skipped" | "error";
  reason?: string;
  error?: string;
};
type DiagnosticMessageProcessedEvent = DiagnosticBaseEvent & {
  type: "message.processed";
  channel: string;
  messageId?: number | string;
  chatId?: number | string;
  sessionKey?: string;
  sessionId?: string;
  durationMs?: number;
  outcome: "completed" | "skipped" | "error";
  reason?: string;
  error?: string;
};
type DiagnosticMessageDeliveryKind = "text" | "media" | "edit" | "reaction" | "other";
type DiagnosticMessageDeliveryBaseEvent = DiagnosticBaseEvent & {
  channel: string;
  sessionKey?: string;
  deliveryKind: DiagnosticMessageDeliveryKind;
};
type DiagnosticMessageDeliveryStartedEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.started";
};
type DiagnosticMessageDeliveryCompletedEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.completed";
  durationMs: number;
  resultCount: number;
};
type DiagnosticMessageDeliveryErrorEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.error";
  durationMs: number;
  errorCategory: string;
};
type DiagnosticTalkEvent = DiagnosticBaseEvent & {
  type: "talk.event";
  sessionId?: string;
  turnId?: string;
  captureId?: string;
  talkEventType: TalkEventType;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
  final?: boolean;
  durationMs?: number;
  byteLength?: number;
};
type DiagnosticSessionStateEvent = DiagnosticBaseEvent & {
  type: "session.state";
  sessionKey?: string;
  sessionId?: string;
  prevState?: DiagnosticSessionState;
  state: DiagnosticSessionState;
  reason?: string;
  queueDepth?: number;
};
type DiagnosticSessionActiveWorkKind = "embedded_run" | "model_call" | "tool_call";
type DiagnosticSessionAttentionClassification = "long_running" | "blocked_tool_call" | "stalled_agent_run" | "stale_session_state";
type DiagnosticSessionAttentionBaseEvent = DiagnosticBaseEvent & {
  sessionKey?: string;
  sessionId?: string;
  state: DiagnosticSessionState;
  ageMs: number;
  queueDepth?: number;
  reason?: string;
  classification: DiagnosticSessionAttentionClassification;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  repeatedRequestNoProgressAgeMs?: number;
  terminalProgressStale?: boolean;
};
type DiagnosticSessionLongRunningEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.long_running";
  classification: "long_running";
};
type DiagnosticSessionStalledEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.stalled";
  classification: "blocked_tool_call" | "stalled_agent_run";
};
type DiagnosticSessionStuckEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.stuck";
  classification: "stale_session_state";
};
type DiagnosticSessionRecoveryStatus = "aborted" | "released" | "skipped" | "noop" | "failed";
type DiagnosticSessionRecoveryBaseEvent = DiagnosticBaseEvent & {
  sessionKey?: string;
  sessionId?: string;
  state: DiagnosticSessionState;
  stateGeneration?: number;
  ageMs: number;
  queueDepth?: number;
  reason?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  allowActiveAbort?: boolean;
};
type DiagnosticSessionRecoveryRequestedEvent = DiagnosticSessionRecoveryBaseEvent & {
  type: "session.recovery.requested";
};
type DiagnosticSessionRecoveryCompletedEvent = DiagnosticSessionRecoveryBaseEvent & {
  type: "session.recovery.completed";
  status: DiagnosticSessionRecoveryStatus;
  action: string;
  outcomeReason?: string;
  released?: number;
  stale?: boolean;
};
type DiagnosticSessionTurnCreatedEvent = DiagnosticBaseEvent & {
  type: "session.turn.created";
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  channel?: string;
  trigger: "user" | "heartbeat";
};
type DiagnosticLaneEnqueueEvent = DiagnosticBaseEvent & {
  type: "queue.lane.enqueue";
  lane: string;
  queueSize: number;
};
type DiagnosticLaneDequeueEvent = DiagnosticBaseEvent & {
  type: "queue.lane.dequeue";
  lane: string;
  queueSize: number;
  waitMs: number;
};
type DiagnosticRunAttemptEvent = DiagnosticBaseEvent & {
  type: "run.attempt";
  sessionKey?: string;
  sessionId?: string;
  runId: string;
  attempt: number;
};
type DiagnosticRunProgressEvent = DiagnosticBaseEvent & {
  type: "run.progress";
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  reason: string;
};
/**
 * Session-correlated embedded-runner execution milestone. Emitted for every
 * phase transition so external status surfaces can render turn startup
 * without a control-UI subscription. `phase` is the closed
 * EmbeddedAgentExecutionPhase contract (type-only import keeps this module
 * runtime-independent of the agents layer).
 */
type DiagnosticRunExecutionPhaseEvent = DiagnosticBaseEvent & {
  type: "run.execution_phase";
  sessionKey?: string;
  sessionId: string;
  runId: string;
  phase: EmbeddedAgentExecutionPhase;
  provider?: string;
  model?: string;
  backend?: string;
  source?: string;
  tool?: string;
  toolCallId?: string;
  itemId?: string;
  firstModelCallStarted?: boolean;
};
type DiagnosticHeartbeatEvent = DiagnosticBaseEvent & {
  type: "diagnostic.heartbeat";
  webhooks: {
    received: number;
    processed: number;
    errors: number;
  };
  active: number;
  waiting: number;
  queued: number;
};
type DiagnosticLivenessWarningReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type DiagnosticPhaseDetails = Record<string, string | number | boolean>;
type DiagnosticPhaseSnapshot = {
  name: string;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
  details?: DiagnosticPhaseDetails;
};
type DiagnosticLivenessWarningEvent = DiagnosticBaseEvent & {
  type: "diagnostic.liveness.warning";
  reasons: DiagnosticLivenessWarningReason[];
  intervalMs: number;
  degradedSinceMs?: number;
  eventLoopDelayP99Ms?: number;
  eventLoopDelayMaxMs?: number;
  eventLoopUtilization?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
  active: number;
  waiting: number;
  queued: number;
  phase?: string;
  recentPhases?: DiagnosticPhaseSnapshot[];
  activeWorkLabels?: string[];
  waitingWorkLabels?: string[];
  queuedWorkLabels?: string[];
};
type DiagnosticPhaseCompletedEvent = DiagnosticBaseEvent & DiagnosticPhaseSnapshot & {
  type: "diagnostic.phase.completed";
};
type DiagnosticToolLoopEvent = DiagnosticBaseEvent & {
  type: "tool.loop";
  sessionKey?: string;
  sessionId?: string;
  toolName: string;
  level: "warning" | "critical";
  action: "warn" | "block";
  detector: "generic_repeat" | "argument_churn" | "unknown_tool_repeat" | "known_poll_no_progress" | "global_circuit_breaker" | "ping_pong";
  count: number;
  message: string;
  pairedToolName?: string;
};
type DiagnosticToolParamsSummary = {
  kind: "object";
} | {
  kind: "array";
  length: number;
} | {
  kind: "string";
  length: number;
} | {
  kind: "number" | "boolean" | "null" | "undefined" | "other";
};
type DiagnosticToolSource = "channel" | "core" | "mcp" | "plugin";
type DiagnosticToolTerminalReason = "failed" | "cancelled" | "timed_out";
type DiagnosticToolExecutionBaseEvent = DiagnosticBaseEvent & {
  runId?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  /** Authoritative lifecycle time from the tool runtime, when it exposes one. */
  sourceTimestampMs?: number;
  toolName: string;
  toolSource?: DiagnosticToolSource;
  toolOwner?: string;
  toolCallId?: string;
  paramsSummary?: DiagnosticToolParamsSummary;
  /** Deterministic mutation classification computed before tool execution. */
  mutatingAction?: boolean;
};
type DiagnosticToolExecutionStartedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.started";
};
type DiagnosticToolExecutionCompletedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.completed";
  durationMs: number;
};
type DiagnosticToolExecutionErrorEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.error";
  durationMs: number;
  errorCategory: string;
  errorCode?: string;
  terminalReason?: DiagnosticToolTerminalReason;
};
type DiagnosticToolExecutionBlockedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.blocked";
  deniedReason: string;
  reason: string;
};
type DiagnosticSkillTelemetrySource = "bundled" | "unknown" | "workspace";
type DiagnosticSkillActivation = "command" | "read";
type DiagnosticSkillUsedEvent = DiagnosticBaseEvent & {
  type: "skill.used";
  runId?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  skillName: string;
  skillSource: DiagnosticSkillTelemetrySource;
  activation: DiagnosticSkillActivation;
  toolName?: string;
  toolCallId?: string;
};
type DiagnosticExecProcessCompletedEvent = DiagnosticBaseEvent & {
  type: "exec.process.completed";
  sessionKey?: string;
  target: "host" | "sandbox";
  mode: "child" | "pty";
  outcome: "completed" | "failed";
  durationMs: number;
  commandLength: number;
  exitCode?: number;
  exitSignal?: string;
  timedOut?: boolean;
  failureKind?: "shell-command-not-found" | "shell-not-executable" | "overall-timeout" | "no-output-timeout" | "signal" | "aborted" | "runtime-error";
};
type DiagnosticExecApprovalFollowupSuppressedEvent = DiagnosticBaseEvent & {
  type: "exec.approval.followup_suppressed";
  approvalId: string;
  reason: "session_rebound";
  phase: "direct_delivery" | "gateway_preflight";
};
type DiagnosticRunBaseEvent = DiagnosticBaseEvent & {
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  provider?: string;
  model?: string;
  trigger?: string;
  channel?: string;
};
type DiagnosticRunStartedEvent = DiagnosticRunBaseEvent & {
  type: "run.started";
};
type DiagnosticRunCompletedEvent = DiagnosticRunBaseEvent & {
  type: "run.completed";
  durationMs: number;
  outcome: "completed" | "aborted" | "blocked" | "error";
  errorCategory?: string;
  blockedBy?: string;
};
type DiagnosticHarnessRunPhase = "prepare" | "start" | "send" | "resolve" | "cleanup";
type DiagnosticHarnessRunOutcome = "completed" | "aborted" | "timed_out" | "error";
type DiagnosticHarnessRunBaseEvent = DiagnosticBaseEvent & {
  type: "harness.run.started" | "harness.run.completed" | "harness.run.error";
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  provider?: string;
  model?: string;
  trigger?: string;
  channel?: string;
  harnessId: string;
  pluginId?: string;
};
type DiagnosticHarnessRunStartedEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.started";
};
type DiagnosticHarnessRunCompletedEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.completed";
  durationMs: number;
  outcome: DiagnosticHarnessRunOutcome;
  resultClassification?: "empty" | "reasoning-only" | "planning-only";
  yieldDetected?: boolean;
  itemLifecycle?: {
    startedCount: number;
    completedCount: number;
    activeCount: number;
  };
};
type DiagnosticHarnessRunErrorEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.error";
  durationMs: number;
  phase: DiagnosticHarnessRunPhase;
  errorCategory: string;
  cleanupFailed?: boolean;
};
type DiagnosticModelCallBaseEvent = DiagnosticBaseEvent & {
  type: "model.call.started" | "model.call.completed" | "model.call.error";
  runId: string;
  callId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  api?: string;
  transport?: string;
  /** Defaults to request for emitters created before turn-level CLI diagnostics. */
  observationUnit?: "request" | "turn";
  contextTokenBudget?: number;
  contextWindowSource?: "model" | "modelsConfig" | "agentContextTokens" | "default";
  contextWindowReferenceTokens?: number;
  upstreamRequestIdHash?: string;
  promptStats?: DiagnosticModelCallPromptStats;
};
type DiagnosticModelCallStartedEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.started";
};
type DiagnosticModelCallCompletedEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.completed";
  durationMs: number;
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  usage?: DiagnosticModelCallUsage;
};
type DiagnosticModelCallErrorEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.error";
  durationMs: number;
  errorCategory: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  memory?: DiagnosticMemoryUsage;
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  usage?: DiagnosticModelCallUsage;
};
type DiagnosticModelCallPromptStats = Readonly<{
  inputMessagesCount?: number;
  inputMessagesChars?: number;
  systemPromptChars?: number;
  toolDefinitionsCount?: number;
  toolDefinitionsChars?: number;
  totalChars?: number;
}>;
type DiagnosticModelCallUsage = Readonly<{
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  reasoningTokens?: number;
  promptTokens?: number;
  total?: number;
}>;
type DiagnosticContextAssembledEvent = DiagnosticBaseEvent & {
  type: "context.assembled";
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  channel?: string;
  trigger?: string;
  messageCount: number;
  historyTextChars: number;
  historyImageBlocks: number;
  maxMessageTextChars: number;
  systemPromptChars: number;
  promptChars: number;
  promptImages: number;
  contextTokenBudget?: number;
  reserveTokens?: number;
};
type DiagnosticMemoryUsage = {
  rssBytes: number;
  heapTotalBytes: number;
  heapUsedBytes: number;
  externalBytes: number;
  arrayBuffersBytes: number;
};
type DiagnosticMemorySampleEvent = DiagnosticBaseEvent & {
  type: "diagnostic.memory.sample";
  memory: DiagnosticMemoryUsage;
  uptimeMs?: number;
};
type DiagnosticMemoryPressureEvent = DiagnosticBaseEvent & {
  type: "diagnostic.memory.pressure";
  level: "warning" | "critical";
  reason: "rss_threshold" | "heap_threshold" | "rss_growth";
  memory: DiagnosticMemoryUsage;
  thresholdBytes?: number;
  rssGrowthBytes?: number;
  windowMs?: number;
};
type DiagnosticPayloadLargeEvent = DiagnosticBaseEvent & {
  type: "payload.large";
  surface: string;
  action: "rejected" | "truncated" | "chunked";
  bytes?: number;
  limitBytes?: number;
  count?: number;
  channel?: string;
  pluginId?: string;
  reason?: string;
};
type DiagnosticLogRecordEvent = DiagnosticBaseEvent & {
  type: "log.record";
  level: string;
  message: string;
  loggerName?: string;
  loggerParents?: string[];
  attributes?: Record<string, string | number | boolean>;
  code?: {
    line?: number;
    functionName?: string;
  };
};
type DiagnosticTelemetryExporterEvent = DiagnosticBaseEvent & {
  type: "telemetry.exporter";
  exporter: string;
  signal: "traces" | "metrics" | "logs";
  status: "started" | "failure" | "dropped";
  reason?: "configured" | "emit_failed" | "handler_failed" | "queue_full" | "shutdown_failed" | "start_failed" | "unsupported_protocol";
  errorCategory?: string;
};
type DiagnosticAsyncQueueDroppedEvent = DiagnosticBaseEvent & {
  type: "diagnostic.async_queue.dropped";
  droppedEvents: number;
  droppedTrustedEvents?: number;
  droppedUntrustedEvents?: number;
  droppedPriorityEvents?: number;
  queueLength: number;
  maxQueueLength: number;
  drainBatchSize: number;
};
type DiagnosticEventPayload = DiagnosticUsageEvent | DiagnosticWebhookReceivedEvent | DiagnosticWebhookProcessedEvent | DiagnosticWebhookErrorEvent | DiagnosticMessageQueuedEvent | DiagnosticMessageReceivedEvent | DiagnosticMessageDispatchStartedEvent | DiagnosticMessageDispatchCompletedEvent | DiagnosticMessageProcessedEvent | DiagnosticMessageDeliveryStartedEvent | DiagnosticMessageDeliveryCompletedEvent | DiagnosticMessageDeliveryErrorEvent | DiagnosticTalkEvent | DiagnosticSessionStateEvent | DiagnosticSessionLongRunningEvent | DiagnosticSessionStalledEvent | DiagnosticSessionStuckEvent | DiagnosticSessionRecoveryRequestedEvent | DiagnosticSessionRecoveryCompletedEvent | DiagnosticSessionTurnCreatedEvent | DiagnosticLaneEnqueueEvent | DiagnosticLaneDequeueEvent | DiagnosticRunAttemptEvent | DiagnosticRunProgressEvent | DiagnosticRunExecutionPhaseEvent | DiagnosticHeartbeatEvent | DiagnosticLivenessWarningEvent | DiagnosticPhaseCompletedEvent | DiagnosticToolLoopEvent | DiagnosticToolExecutionStartedEvent | DiagnosticToolExecutionCompletedEvent | DiagnosticToolExecutionErrorEvent | DiagnosticToolExecutionBlockedEvent | DiagnosticSkillUsedEvent | DiagnosticExecProcessCompletedEvent | DiagnosticExecApprovalFollowupSuppressedEvent | DiagnosticRunStartedEvent | DiagnosticRunCompletedEvent | DiagnosticHarnessRunStartedEvent | DiagnosticHarnessRunCompletedEvent | DiagnosticHarnessRunErrorEvent | DiagnosticModelCallStartedEvent | DiagnosticModelCallCompletedEvent | DiagnosticModelCallErrorEvent | DiagnosticContextAssembledEvent | DiagnosticMemorySampleEvent | DiagnosticMemoryPressureEvent | DiagnosticPayloadLargeEvent | DiagnosticLogRecordEvent | DiagnosticSecurityEvent | DiagnosticTelemetryExporterEvent | DiagnosticAsyncQueueDroppedEvent | DiagnosticFailoverEvent;
type DiagnosticNonSecurityEventPayload = Exclude<DiagnosticEventPayload, DiagnosticSecurityEvent>;
type DiagnosticEventInput = DiagnosticNonSecurityEventPayload extends (infer Event) ? Event extends DiagnosticEventPayload ? Omit<Event, "seq" | "ts"> : never : never;
type DiagnosticEventMetadata = Readonly<{
  internal?: boolean;
  trustedTraceContext?: boolean;
  trusted: boolean;
}>;
type DiagnosticModelCallContent = Readonly<{
  inputMessages?: unknown;
  outputMessages?: unknown;
  systemPrompt?: string;
  toolDefinitions?: unknown;
}>;
type DiagnosticToolCallContent = Readonly<{
  toolInput?: unknown;
  toolOutput?: unknown;
}>;
type DiagnosticSkillUsagePrivateData = Readonly<{
  skillFile: string;
}>;
type DiagnosticEventPrivateData = Readonly<{
  /** Raw failure text for trusted diagnostics exporters; never part of the public event payload. */
  errorMessage?: string;
  modelContent?: DiagnosticModelCallContent;
  skillUsage?: DiagnosticSkillUsagePrivateData;
  toolContent?: DiagnosticToolCallContent;
}>;
//#endregion
//#region src/infra/diagnostic-trace-propagation.d.ts
type DiagnosticTracePropagationBridge$1<TEvent, TMetadata> = Readonly<{
  /** Selects events that need synchronous exporter preparation. */
  shouldPrepareEvent?: (event: TEvent) => boolean;
  /** Prepares exporter-owned state before an outbound caller can resolve it. */
  prepareEvent?: (event: TEvent, metadata: TMetadata) => void;
  /** Translates a diagnostic correlation context to an exporter-owned context. */
  resolveTraceContext: (traceContext: DiagnosticTraceContext) => DiagnosticTraceContext | undefined;
}>;
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
//#region src/plugins/types.node-host.d.ts
type OpenClawPluginNodeHostCommandAvailabilityContext = {
  /** Node-local configuration used to build this host's Gateway declaration. */
  config: OpenClawConfig;
  /** Node-host process environment. */
  env: NodeJS.ProcessEnv;
};
type OpenClawPluginNodeHostCommandIo = {
  emitChunk(chunk: string): Promise<void>;
  onInput(callback: (payloadJSON: string) => void): void;
  /** Complete binary messages; available when the node host dispatches a duplex command. */
  frames?: {
    send(message: Uint8Array): Promise<void>;
    onMessage(listener: (message: Uint8Array) => void | Promise<void>): () => void;
  };
  signal: AbortSignal;
};
type OpenClawPluginNodeHostCommandContext = {
  /** Emit one node-owned event through the active Gateway connection. */
  sendNodeEvent(event: string, payload: unknown): Promise<unknown>;
  /** Agent session that owns this invocation, when the caller supplied one. */
  sessionKey?: string;
  /** Aborts when the Gateway cancels this specific node-host invocation. */
  signal?: AbortSignal;
  /** Protect one exact node-owned placement workspace for this invocation's lifetime. */
  acquireManagedWorkspace?: (request: {
    workspaceDir: string;
    environmentId: string;
    sessionId: string;
    ownerEpoch: number;
    sessionKey: string;
  }) => {
    workspaceDir: string;
    release: () => void;
  };
};
type OpenClawPluginNodeHostCommandBase = {
  command: string;
  cap?: string;
  dangerous?: boolean;
  /** Return false to omit this command and capability from the node declaration. */
  isAvailable?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => boolean;
  /** Watch node-local availability and request a fresh Gateway declaration. */
  watchAvailability?: (context: OpenClawPluginNodeHostCommandAvailabilityContext, onChange: () => void) => (() => void) | void;
  /** Release command-owned state when the active Gateway connection closes. */
  onDisconnect?: () => Promise<void> | void;
  /** Optional Computer Use declaration published with this command's node manifest. */
  computerUse?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => unknown;
  agentTool?: {
    name: string;
    description: string;
    parameters?: Record<string, unknown>;
    /** Platforms where this tool is allowlisted by default; omit for explicit config only. */
    defaultPlatforms?: Array<"ios" | "android" | "macos" | "windows" | "linux" | "unknown">;
    mcp?: {
      server: string;
      tool: string;
    };
  };
};
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommandBase & {
  duplex?: boolean;
  handle: (paramsJSON?: string | null, io?: OpenClawPluginNodeHostCommandIo, context?: OpenClawPluginNodeHostCommandContext) => Promise<string>;
};
//#endregion
//#region src/plugins/plugin-registration.types.d.ts
type ChannelPlugin$2 = ChannelPlugin$3;
type DiagnosticTracePropagationBridge = DiagnosticTracePropagationBridge$1<DiagnosticEventPayload, DiagnosticEventMetadata>;
type PluginInteractiveHandlerResult = {
  handled?: boolean;
} | void;
type PluginInteractiveRegistration<TContext = unknown, TChannel extends string = string, TResult = PluginInteractiveHandlerResult> = {
  channel: TChannel;
  namespace: string;
  handler: (ctx: TContext) => Promise<TResult> | TResult;
};
type PluginInteractiveHandlerRegistration$1 = PluginInteractiveRegistration;
type OpenClawPluginHttpRouteAuth = "gateway" | "plugin";
type OpenClawPluginHttpRouteMatch$1 = "exact" | "prefix";
type OpenClawPluginGatewayRuntimeScopeSurface$1 = "write-default" | "trusted-operator";
type OpenClawPluginHttpRouteHandler$1 = (req: IncomingMessage, res: ServerResponse) => Promise<boolean | void> | boolean | void;
type OpenClawPluginHttpRouteUpgradeHandler = (req: IncomingMessage, socket: Duplex, head: Buffer) => Promise<boolean | void> | boolean | void;
type OpenClawPluginHttpRouteParams = {
  path: string;
  handler: OpenClawPluginHttpRouteHandler$1;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match?: OpenClawPluginHttpRouteMatch$1;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface$1;
  nodeCapability?: {
    surface: string;
    ttlMs?: number;
  };
  replaceExisting?: boolean;
};
type OpenClawPluginHostedMediaResolver$1 = (mediaUrl: string) => string | null | undefined | Promise<string | null | undefined>;
type WidgetPresenterContext = Readonly<{
  messageChannel?: string;
  accountId?: string;
  deliveryContext?: Readonly<DeliveryContext>;
  nativeChannelId?: string;
  currentChannelId?: string;
  currentMessagingTarget?: string;
  sessionKey?: string;
}>;
type WidgetPresenterDocument = Readonly<{
  kind: "html";
  html: string;
  hostedUrl?: string;
}>;
type WidgetPresentationError = {
  code: "no_eligible_node";
  message: string;
} | {
  code: "node_error";
  message: string;
  nodeId?: string;
} | {
  code: "unavailable";
  message: string;
} | {
  code: "presentation_error";
  message: string;
};
type WidgetPresentationSuccess = {
  kind: "node";
  nodeId: string;
  nodeName?: string;
} | {
  kind: "message";
  receipt: MessageReceipt;
};
type WidgetPresenterBase = {
  description: string;
  availability: (context: WidgetPresenterContext) => Promise<Result<{
    available: true;
  }, WidgetPresentationError>>;
  present: (params: {
    document: WidgetPresenterDocument;
    title: string;
    context: WidgetPresenterContext;
  }) => Promise<Result<WidgetPresentationSuccess, WidgetPresentationError>>;
};
type WidgetPresenter = WidgetPresenterBase & ({
  target: "node_panel";
  match?: never;
  capabilities?: never;
} | {
  target: "current_channel";
  match: (context: WidgetPresenterContext) => boolean;
  capabilities: Readonly<{
    sourceKinds: readonly string[];
    maxSourceBytes?: number;
  }>;
});
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
type OpenClawPluginCliRegistrar$1 = (ctx: OpenClawPluginCliContext) => void | Promise<void>;
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
type OpenClawPluginCliRootCommandDescriptor$1 = OpenClawPluginCliCommandDescriptor & {
  machineOutput?: (params: {
    argv: readonly string[];
    stdoutIsTTY: boolean;
  }) => boolean;
};
type OpenClawPluginRootCliRegistrationOptions = {
  /** Omit or pass an empty path for root commands. */
  parentPath?: readonly [];
  commands?: readonly string[];
  descriptors?: readonly OpenClawPluginCliRootCommandDescriptor$1[];
};
/** Backward-compatible registration shape for dynamic root or nested paths. */
type OpenClawPluginLegacyCliRegistrationOptions = {
  parentPath?: readonly string[];
  commands?: readonly string[];
  descriptors?: readonly OpenClawPluginCliCommandDescriptor[];
};
type OpenClawPluginCliRegistrationOptions = OpenClawPluginRootCliRegistrationOptions | OpenClawPluginLegacyCliRegistrationOptions;
type OpenClawPluginNodeCliFeatureOptions = {
  /** Explicit node feature command names owned under `openclaw nodes`. */
  commands?: string[];
  /**
   * Parse-time command descriptors for lazy node feature CLI registration.
   *
   * Descriptors are registered under `openclaw nodes`, so a descriptor named
   * `"camera"` exposes `openclaw nodes camera`.
   */
  descriptors?: OpenClawPluginCliCommandDescriptor[];
};
type OpenClawPluginReloadRegistration$1 = {
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
    scope?: ApprovalScope;
    severity?: "info" | "warning" | "critical";
    toolName?: string;
    toolCallId?: string;
    agentId?: string;
    sessionKey?: string;
    allowedDecisions?: readonly OpenClawPluginNodeInvokeApprovalDecision[];
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
  risk?: {
    level: "ordinary" | "high";
    /** Stable, content-free family name; never include user or action arguments. */
    family: string;
  };
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
  /**
   * Classify exact command arguments before the policy handler or node transport runs.
   * Throwing rejects the invocation before dispatch.
   */
  classifyRisk?: (ctx: Pick<OpenClawPluginNodeInvokePolicyContext, "command" | "params">) => NonNullable<OpenClawPluginNodeInvokePolicyContext["risk"]>;
  handle: (ctx: OpenClawPluginNodeInvokePolicyContext) => Promise<OpenClawPluginNodeInvokePolicyResult> | OpenClawPluginNodeInvokePolicyResult;
};
type OpenClawPluginSecurityAuditContext = {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  configPath: string;
};
type OpenClawPluginSecurityAuditCollector$1 = (ctx: OpenClawPluginSecurityAuditContext) => SecurityAuditFinding[] | Promise<SecurityAuditFinding[]>;
type OpenClawGatewayDiscoveryAdvertiseContext = {
  machineDisplayName: string;
  gatewayPort: number;
  gatewayTlsEnabled: boolean;
  gatewayTlsFingerprintSha256?: string;
  gatewayDirectReachable: boolean;
  tailnetDns?: string;
  sshPort?: number;
  cliPath?: string;
  minimal: boolean;
};
type OpenClawGatewayDiscoveryService$1 = {
  id: string;
  advertise: (ctx: OpenClawGatewayDiscoveryAdvertiseContext) => void | Promise<void | {
    stop?: () => void | Promise<void>;
  }>;
};
/** Context passed to long-lived plugin services. */
type OpenClawPluginServiceHealth = {
  reportFailure: (error: unknown) => void;
  clearFailure: () => void;
};
type OpenClawPluginServiceContext = {
  config: OpenClawConfig;
  workspaceDir?: string;
  stateDir: string;
  logger: PluginLogger;
  serviceHealth?: OpenClawPluginServiceHealth;
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
type OpenClawPluginService$1 = {
  id: string;
  start: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
  stop?: (ctx: OpenClawPluginServiceContext) => void | Promise<void>;
};
type OpenClawPluginChannelRegistration = {
  plugin: ChannelPlugin$2;
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
//#region src/auto-reply/reply/response-prefix-template.d.ts
/**
 * Template interpolation for response prefix.
 *
 * Supports variables like `{model}`, `{provider}`, `{thinkingLevel}`, etc.
 * Variables are case-insensitive and unresolved ones remain as literal text.
 */
type ResponsePrefixContext = {
  /** Short model name (e.g., "gpt-5.4", "claude-opus-4-6") */
  model?: string;
  /** Full model ID including provider (e.g., "openai/gpt-5.6-sol") */
  modelFull?: string;
  /** Provider name (e.g., "openai", "anthropic") */
  provider?: string;
  /** Current thinking level (e.g., "high", "low", "off") */
  thinkingLevel?: string;
  /** Agent identity name */
  identityName?: string;
};
//#endregion
//#region src/cron/service/list-page-types.d.ts
/** Enabled-state filter accepted by paginated cron listing. */
type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Schedule-kind filter accepted by paginated cron listing. */
type CronJobsScheduleKindFilter = "all" | "at" | "every" | "cron" | "on-exit" | "stream";
/** Last-run status filter, including jobs that have not produced a status yet. */
type CronJobsLastRunStatusFilter = "all" | CronRunStatus | "unknown";
/** Condition-trigger filter accepted by paginated cron listing. */
type CronJobsTriggerFilter = "all" | "conditional" | "unconditional";
/** Stable sort keys supported by paginated cron listing. */
type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Sort direction for paginated cron listing. */
type CronSortDir = "asc" | "desc";
/** Input contract for filtered, sorted, offset-based cron job pages. */
type CronListPageOptions = {
  includeDisabled?: boolean;
  limit?: number;
  offset?: number;
  query?: string;
  enabled?: CronJobsEnabledFilter;
  scheduleKind?: CronJobsScheduleKindFilter;
  lastRunStatus?: CronJobsLastRunStatusFilter;
  trigger?: CronJobsTriggerFilter;
  sortBy?: CronJobsSortBy;
  sortDir?: CronSortDir;
  agentId?: string;
};
/** Offset-page result returned by cron listPage callers. */
type CronListPageResult<TJobs extends readonly CronJob[] = CronJob[]> = {
  jobs: TJobs;
  /** Opaque revision for the complete filtered, sorted result set. */
  snapshotRevision: string;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
};
//#endregion
//#region src/infra/agent-run-registry.d.ts
type AgentRunDelegatedAuthority = Readonly<{
  operationalRunInstance: Readonly<{
    instanceId: string;
    runId: string;
  }>;
  lifecycleGeneration: string;
  claimId: string;
}>;
declare namespace admitted_run_context_d_exports {
  export { AdmittedRunContext, OperationalRunInstanceRef, PreparedAgentRunAdmission, closeAdmittedRunDelegatedAuthority, createExecutionIdentityRecoveryAdmission, createOperationalRunInstanceRef, getAdmittedRunDelegatedAuthority, prepareAgentRunAdmission, prepareSystemAgentRunAdmission, resolveAdmittedRunActiveAssertion, resolvePreparedRunAdmission, retainAdmittedRunBeforeToolCallRecovery };
}
/** Operational lifecycle correlation. This is never identity or authorization evidence. */
type OperationalRunInstanceRef = Readonly<{
  instanceId: string;
  runId: string;
}>;
/** Exact context carried by one admitted execution and every retry/fallback it owns. */
type AdmittedRunContext = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
}>;
type PreparedAgentRunAdmission = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>;
  /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
/** Reads the immutable outer-run authority without reviving a closed claim. */
declare function getAdmittedRunDelegatedAuthority(context: AdmittedRunContext): AgentRunDelegatedAuthority | undefined;
/** Captures an exact admitted-run assertion for work that may cross an await boundary. */
declare function resolveAdmittedRunActiveAssertion(context: AdmittedRunContext, signal?: AbortSignal): (() => void) | undefined;
/** Idempotently compare-releases the authority captured by this admission. */
declare function closeAdmittedRunDelegatedAuthority(context: AdmittedRunContext): boolean;
type AdmittedRunBeforeToolCallRecovery = Readonly<{
  assertActive: () => void;
  release: () => void;
}>;
/** Recovery-only lease for the already-created native pre-tool policy callback. */
declare function retainAdmittedRunBeforeToolCallRecovery(context: AdmittedRunContext): AdmittedRunBeforeToolCallRecovery | undefined;
type ExecutionIdentityRecoveryAdmission = Readonly<{
  /** Recovery retries never manufacture replacement identity when exact evidence is absent. */
  retryOnly: boolean;
  consume: (runId: string) => Readonly<{
    accepted: boolean;
    token?: ExecutionIdentityAdmissionToken;
  }>;
}>;
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
declare function createExecutionIdentityRecoveryAdmission(params: {
  retryOnly: boolean;
  token?: ExecutionIdentityAdmissionToken;
  expectedOperationalRunId?: string;
}): ExecutionIdentityRecoveryAdmission;
declare function createOperationalRunInstanceRef(runId: string): OperationalRunInstanceRef;
/** Prepares a system-owned run without selecting its eventual execution runtime early. */
declare function prepareSystemAgentRunAdmission(cfg: OpenClawConfig, runId: string, agentId: string, boundary: string): PreparedAgentRunAdmission;
/**
 * Freezes ingress facts before preparation while deferring allocation/capture until the
 * authoritative runtime owner is selected immediately before execution.
 */
declare function prepareAgentRunAdmission(params: {
  cfg: OpenClawConfig;
  facts: Omit<ExecutionIdentityAdmissionFacts, "runtime">;
  operationalRunInstance: OperationalRunInstanceRef;
  recovery?: ExecutionIdentityRecoveryAdmission;
  onAdmitted?: (context: AdmittedRunContext) => void | Promise<void>;
}): PreparedAgentRunAdmission;
/** Resolves a host-only continuation or validates an already-admitted internal caller. */
declare function resolvePreparedRunAdmission(params: {
  runId: string;
  runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"];
  runtimeInstanceId?: string;
  admittedRunContext?: AdmittedRunContext;
  preparedRunAdmission?: PreparedAgentRunAdmission;
}): Promise<AdmittedRunContext>;
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
  taskTimeoutAbortGraceMs?: number;
  /** Ends the task after a caller-owned timeout cleanup grace has already elapsed. */
  taskTimeoutReleaseSignal?: AbortSignal;
  priority?: "foreground" | "normal" | "background";
};
/** Minimal queue function contract used by code that only needs to schedule work. */
type CommandQueueEnqueueFn = <T>(task: () => Promise<T>, opts?: CommandQueueEnqueueOptions) => Promise<T>;
//#endregion
//#region src/cron/service/state.d.ts
/** Direct-run mode: respect due time, force execution, or run immediately while enabled. */
type CronRunMode = "due" | "force" | "if-enabled";
/** Main-session wake strategy used after enqueuing cron text. */
type CronWakeMode = "now" | "next-heartbeat";
/** Lightweight service status returned to gateway/control surfaces. */
type CronStatusSummary = {
  enabled: boolean;
  triggersEnabled: boolean;
  /** @deprecated Alias for `sqlitePath`. */
  storePath: string;
  /** Storage backend identifier. */
  storage: "sqlite";
  /** Resolved path to the shared state SQLite database. */
  sqlitePath: string;
  jobs: number;
  nextWakeAtMs: number | null;
};
/** Result shape for immediate or queued cron run requests. */
type CronRunResult = {
  ok: true;
  ran: true;
} | {
  ok: true;
  enqueued: true;
  runId: string;
} | {
  ok: true;
  ran: false;
  reason: "disabled";
} | {
  ok: true;
  ran: false;
  reason: "not-due";
} | {
  ok: true;
  ran: false;
  reason: "already-running";
} | {
  ok: true;
  ran: false;
  reason: "invalid-spec";
} | {
  ok: true;
  ran: false;
  reason: "stopped";
} | {
  ok: false;
};
/** Remove result that distinguishes missing jobs from failed removal. */
type CronRemoveResult = {
  ok: true;
  removed: boolean;
} | {
  ok: false;
  removed: false;
};
/** Created cron job returned by service mutation calls. */
type CronDeclarativeAddResult = CronStoredJob & {
  created: boolean;
  updated?: boolean;
  job: CronStoredJob;
};
type CronAddResult = CronStoredJob | CronDeclarativeAddResult;
/** Updated cron job returned by service mutation calls. */
type CronUpdateResult = CronJob;
/** Chronological job list returned by service read calls. */
type CronListResult = CronJob[];
/** Normalized create input accepted by the cron service. */
type CronAddInput = CronJobCreate;
/** Caller-specific declaration-key visibility and explicit enablement metadata. */
type CronAddOptions = {
  matchesExisting?: (job: CronJob) => boolean;
  enabledExplicit?: boolean;
  /** Gateway/doctor-owned heartbeat jobs require this opt-in at service creation. */
  systemOwned?: boolean;
  /** Trusted creator provenance persisted with new jobs; never accepted from public input. */
  createdActor?: SessionCreatedActor;
  /** Authenticated caller provenance stamped by the service, never public input. */
  scheduledToolPolicy?: CronScheduledToolPolicy;
  /** Private proof from an authenticated agent-runtime caller. */
  toolsAllowProvenance?: CronToolsAllowProvenance;
  /** Synchronous Gateway-owned liveness guard consumed immediately before mutation. */
  commitGuard?: () => void;
  /** One-use fresh capture; callback presence means fresh even when it returns undefined. */
  captureRuntimeAuthority?: () => CronRuntimeAuthority | undefined;
};
/** Normalized patch input accepted by cron service updates. */
type CronUpdateInput = CronJobPatch;
/** Authenticated caller provenance used only when a tool policy is explicitly adopted. */
type CronUpdateOptions = {
  scheduledToolPolicy?: CronScheduledToolPolicy;
  toolsAllowProvenance?: CronToolsAllowProvenance;
  /** Synchronous Gateway-owned liveness guard consumed immediately before mutation. */
  commitGuard?: () => void;
  /** One-use fresh capture; callback presence means fresh even when it returns undefined. */
  captureRuntimeAuthority?: () => CronRuntimeAuthority | undefined;
};
type CronCommitGuardOptions = {
  /** Synchronous Gateway-owned guard consumed at the mutation owner. */
  commitGuard?: () => void;
};
/** Cron-store-locked guard evaluated against the current job before an update applies. */
type CronUpdatePrecondition = (job: CronJob, nowMs: number) => void | Promise<void>;
//#endregion
//#region src/cron/service-contract.d.ts
type CronWakeResult = {
  ok: true;
} | {
  ok: false;
  reason?: "unwakeable-session-key";
};
/** Result shape for direct/queued cron runs. */
type CronServiceRunResult = CronRunResult;
type CronServiceRunOptions = {
  payload?: CronPayload;
  /** Internal event-source runs keep their persisted trigger on force execution. */
  evaluateTrigger?: boolean;
  /** Current stream batch exposed to trigger scripts as trigger.streamBatch. */
  streamBatch?: string;
  /** Source schedule identity checked under the cron store lock before admission. */
  streamScheduleKey?: string;
  /** Logical source identity; rejects retired batches under same-schedule ABA. */
  streamSourceIdentity?: string;
  onTriggerDisposition?: (disposition: "fired" | "dropped" | "busy" | "error") => void;
  /** Synchronous caller-authority guard consumed before run reservation. */
  commitGuard?: () => void;
};
/** Public cron service facade used by gateway, plugin SDK, and tests. */
interface CronServiceContract {
  start(): Promise<void>;
  stop(): void;
  status(): Promise<CronStatusSummary>;
  list(opts?: {
    includeDisabled?: boolean;
  }): Promise<CronListResult>;
  listPage(opts?: CronListPageOptions): Promise<CronListPageResult>;
  add(input: CronAddInput, opts?: CronAddOptions): Promise<CronAddResult>;
  update(id: string, patch: CronUpdateInput, opts?: CronUpdateOptions): Promise<CronUpdateResult>;
  updateWithPrecondition(id: string, patch: CronUpdateInput, precondition: CronUpdatePrecondition, opts?: CronUpdateOptions): Promise<CronUpdateResult>;
  remove(id: string, opts?: {
    systemOwned?: boolean;
  } & CronCommitGuardOptions): Promise<CronRemoveResult>;
  run(id: string, mode?: CronRunMode, opts?: CronServiceRunOptions): Promise<CronServiceRunResult>;
  enqueueRun(id: string, mode?: CronRunMode, opts?: CronCommitGuardOptions): Promise<CronServiceRunResult>;
  getJob(id: string): CronJob | undefined;
  readJob(id: string): Promise<CronJob | undefined>;
  getDefaultAgentId(): string | undefined;
  wake(opts: {
    mode: CronWakeMode;
    text: string;
    sessionKey?: string;
    agentId?: string;
  }): CronWakeResult;
}
//#endregion
//#region src/gateway/methods/descriptor.d.ts
/** Scope marker for methods that only authenticated node clients may call. */
declare const NODE_GATEWAY_METHOD_SCOPE: "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
declare const DYNAMIC_GATEWAY_METHOD_SCOPE: "dynamic";
/** Authorization scope attached to a gateway method descriptor. */
type GatewayMethodScope = OperatorScope | typeof NODE_GATEWAY_METHOD_SCOPE | typeof DYNAMIC_GATEWAY_METHOD_SCOPE;
/** Owner metadata used to keep core, plugin, channel, and auxiliary methods distinguishable. */
type GatewayMethodOwner = {
  kind: "core";
  area: string;
} | {
  kind: "plugin";
  pluginId: string;
} | {
  kind: "channel";
  channelId: string;
} | {
  kind: "aux";
  area: string;
};
/** Startup availability flag exposed to clients as retryable startup-unavailable errors. */
type GatewayMethodStartupAvailability = "available" | "unavailable-until-sidecars";
type GatewayMethodProfileAccess = "independent" | "required";
type GatewayMethodHandler = (opts: never) => unknown;
/** Complete metadata for one dispatchable gateway method. */
type GatewayMethodDescriptor = {
  name: string;
  handler: GatewayMethodHandler;
  scope: GatewayMethodScope;
  owner: GatewayMethodOwner;
  profileAccess: GatewayMethodProfileAccess;
  since?: string;
  startup?: GatewayMethodStartupAvailability;
  controlPlaneWrite?: boolean;
  advertise?: boolean;
  description?: string;
};
/** Read-only method registry view used by request dispatch and method listing. */
type GatewayMethodRegistryView = {
  /** Opaque registry handle carried into request scope by the gateway composition root. */
  pluginRegistry?: object;
  getHandler: (name: string) => GatewayMethodHandler | undefined;
  listMethods: () => string[];
  listAdvertisedMethods: () => string[];
  getScope: (name: string) => GatewayMethodScope | undefined;
  isStartupUnavailable: (name: string) => boolean;
  isControlPlaneWrite: (name: string) => boolean;
  requiresAuthenticatedProfile: (name: string) => boolean;
  descriptors: () => readonly GatewayMethodDescriptor[];
};
//#endregion
//#region src/wizard/session.d.ts
type WizardStep = WizardStep$1;
type WizardSessionStatus = "running" | "done" | "cancelled" | "error";
type WizardNextResult = {
  done: boolean;
  step?: WizardStep;
  status: WizardSessionStatus;
  error?: string;
  channels?: string[];
  accounts?: Array<{
    channel: string;
    accountId: string;
  }>;
  preparedModelRef?: string;
};
declare class WizardSession {
  private runner;
  private readonly abortController;
  private readonly expiryTimer;
  private readonly runnerPromise;
  private currentStep;
  private progressSteps;
  private deliveredProgressStepIds;
  private stepDeferred;
  private pendingTerminalResolution;
  private cancellationLocked;
  private settled;
  private pendingExternalUrl;
  private answerDeferred;
  private status;
  private error;
  private configuredAccounts;
  private preparedModelRef;
  constructor(runner: (prompter: WizardPrompter, signal: AbortSignal, session: WizardSession) => Promise<void>, options?: {
    timeoutMs?: number;
  });
  next(): Promise<WizardNextResult>;
  private terminalResult;
  /** Record what the channels flow actually configured (channels flow only). */
  setConfiguredAccounts(accounts: ReadonlyArray<{
    channel: string;
    accountId: string;
  }>): void;
  /** Record the exact provider-owned model prepared by a setup flow. */
  setPreparedModelRef(modelRef: string): void;
  answer(stepId: string, value: unknown): Promise<string | undefined>;
  cancel(): boolean;
  /** The underlying mutation crossed its durable commit point and must finish. */
  lockCancellation(): void;
  get signal(): AbortSignal;
  pushStep(step: WizardStep): void;
  pushProgress(message: string): void;
  private rememberDeliveredProgressStep;
  queueExternalUrl(url: string): void;
  consumeExternalUrl(): string | undefined;
  private run;
  awaitAnswer(step: WizardStep, validate?: (value: string) => string | undefined): Promise<unknown>;
  private resolveStep;
  getStatus(): WizardSessionStatus;
  /** Whether the runner has stopped and can no longer mutate setup state. */
  isSettled(): boolean;
  /** Resolves after the runner can no longer mutate setup state. */
  whenSettled(): Promise<void>;
  getError(): string | undefined;
}
//#endregion
//#region src/gateway/session-observer-contract.d.ts
type SessionObserverEvent = {
  runId: string;
  seq: number;
  stream: string;
  ts: number;
  data: Record<string, unknown>;
  lifecycleGeneration?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
};
type SessionObserverCompanionSnapshot = {
  agentId: string;
  runId?: string;
  digest?: SessionObserverDigest;
  notes: Array<{
    sequence: number;
    text: string;
  }>;
};
type SessionObserverService = {
  handleEvent: (event: SessionObserverEvent) => void;
  setConnectionVisibility: (connId: string, visible: boolean) => void;
  removeConnection: (connId: string) => void;
  getCompanionSnapshot: (sessionKey: string, agentId?: string) => SessionObserverCompanionSnapshot;
  dispose: () => void;
};
//#endregion
//#region src/gateway/session-companion.d.ts
type SessionCompanionTarget = {
  sessionKey: string;
  agentId: string;
};
type SessionCompanionService = {
  ask: (params: {
    agentId: string;
    sessionKey: string;
    question: string;
    connId: string;
    signal?: AbortSignal;
  }) => Promise<SessionsCompanionAskResult>;
  state: (target: SessionCompanionTarget) => SessionsCompanionStateResult;
  reset: (target: SessionCompanionTarget) => void;
  dispose: () => void;
};
//#endregion
//#region src/gateway/chat-queued-turns.d.ts
type QueuedChatTurnEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string;
  /** False once collect-mode transfers cancellation to the aggregate owner. */
  abortable?: boolean;
  agentId?: string;
  ownerConnId?: string;
  ownerDeviceId?: string;
};
//#endregion
//#region src/gateway/server-methods/wizard.d.ts
type ChannelSetupWizardRunner = (opts: {
  channel?: string;
  onConfigured?: (accounts: Array<{
    channel: string;
    accountId: string;
  }>) => void;
  beforePersistentEffect?: () => Promise<void>;
}, runtime: RuntimeEnv, prompter: WizardPrompter) => Promise<void>;
//#endregion
//#region src/gateway/methods/registry.d.ts
type GatewayMethodRegistry = GatewayMethodRegistryView;
//#endregion
//#region src/gateway/control-ui-contract.d.ts
/** Check-run rollup for a PR head commit, chip pill + CI monitoring popover. */
type ControlUiSessionPullRequestChecks = {
  state: "pending" | "passing" | "failing";
  passed: number;
  failed: number;
  skipped: number;
  /** Queued/in-progress runs plus stale conclusions GitHub invalidated. */
  running: number;
};
/** One GitHub pull request whose head is the session's working branch. */
type ControlUiSessionPullRequest = {
  number: number;
  owner: string;
  repo: string;
  branch: string;
  title: string;
  url: string;
  state: "open" | "draft" | "merged" | "closed";
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  /** Latest check-run rollup for the head commit; absent when no checks ran. */
  checks?: ControlUiSessionPullRequestChecks;
  checksUrl?: string;
};
/**
 * The session's working branch, resolved from local git only so the pre-PR
 * "Create PR" row keeps rendering while the GitHub quota is exhausted.
 */
type ControlUiSessionBranch = {
  owner: string;
  repo: string;
  branch: string;
  /** Working-tree diff vs the merge base with the remote default branch. */
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  /**
   * GitHub "open a pull request for this branch" page. Absent while the
   * branch is unpushed or has nothing to compare — the row then only reports
   * the session's local changed files.
   */
  createUrl?: string;
};
/** Pull requests detected for a session's git branch, chip row payload. */
type ControlUiSessionPullRequests = {
  pullRequests: ControlUiSessionPullRequest[];
  /**
   * Present when the session's non-default GitHub branch has a creatable PR
   * on origin or local changed files in the working tree.
   */
  branch?: ControlUiSessionBranch;
  /** GitHub quota exhausted; entries may be stale until the limit resets. */
  rateLimited: boolean;
};
//#endregion
//#region src/gateway/control-ui-session-prs.d.ts
type ControlUiSessionPullRequestsParams = {
  sessionKey: string;
  agentId?: string;
  refresh?: boolean;
};
//#endregion
//#region src/gateway/server-broadcast-types.d.ts
type GatewayBroadcastStateVersion = {
  presence?: number;
  health?: number;
};
/** Options for gateway websocket broadcasts. */
type GatewayBroadcastOpts = {
  /** Agent scope for agent-relative keys such as `global`. */
  agentId?: string;
  dropIfSlow?: boolean;
  /** Canonical subscription keys for session-scoped delivery. */
  sessionKeys?: readonly string[];
  stateVersion?: GatewayBroadcastStateVersion;
};
/** Broadcast function signature for all connected clients. */
type GatewayBroadcastFn = (event: string, payload: unknown, opts?: GatewayBroadcastOpts) => void;
/** Broadcast function signature for targeted connection ids. */
type GatewayBroadcastToConnIdsFn = (event: string, payload: unknown, connIds: ReadonlySet<string>, opts?: GatewayBroadcastOpts) => void;
//#endregion
//#region src/gateway/control-ui-session-pr-subscriptions.d.ts
type LoadSessionPullRequests = (params: ControlUiSessionPullRequestsParams) => Promise<ControlUiSessionPullRequests>;
type SubscriptionDeps = {
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  isConnectionActive?: (connId: string) => boolean;
  load?: LoadSessionPullRequests;
  setTimer?: typeof globalThis.setTimeout;
  clearTimer?: typeof globalThis.clearTimeout;
};
type ControlUiSessionPullRequestSubscriptions = {
  replace: (connId: string, sessionKeys: readonly string[], refreshSessionKeys?: ReadonlySet<string>) => Promise<void>;
  unsubscribe: (connId: string) => void;
  pollNow: () => Promise<void>;
  stop: () => void;
};
/**
 * Owns the union of connection replace-sets. Only this union drives GitHub
 * refreshes, so hidden/disconnected clients cannot leave orphan polling work.
 */
declare function createControlUiSessionPullRequestSubscriptions(deps: SubscriptionDeps): ControlUiSessionPullRequestSubscriptions;
//#endregion
//#region src/gateway/agent-runtime-session-spawn-context.d.ts
type AgentRuntimeSessionSpawnContext = {
  completionOwnerSessionKey?: string;
  inheritedToolPolicy: {
    version: 1;
    allow: string[];
    deny: string[];
  };
};
//#endregion
//#region src/channels/threading-tool-context-internal.d.ts
/** Host-only turn correlation carried beside the plugin-facing threading contract. */
type InternalChannelThreadingToolContext = ChannelThreadingToolContext & {
  currentSourceTurnId?: string;
};
//#endregion
//#region src/gateway/message-action-turn-capability.d.ts
type MessageActionRequesterIdentity = {
  requesterAccountId?: string;
  requesterSenderId?: string;
  requesterSenderName?: string;
  requesterSenderUsername?: string;
  requesterSenderE164?: string;
};
type AgentRuntimeMessageActionContextBase = MessageActionRequesterIdentity & {
  expiresAtMs: number;
  /** Process-local owner reference revalidated before privileged Gateway use. */
  turnCapability?: string;
  sessionId?: string;
  /** Durable session entry that owns restart-recovery receipt state. */
  sourceReplySessionKey?: string;
  toolContext?: InternalChannelThreadingToolContext;
};
type AgentRuntimeMessageActionContext = AgentRuntimeMessageActionContextBase & ({
  sourceReplyFinal: true;
  sourceReplyToolCallId: string;
} | {
  sourceReplyFinal?: false;
  sourceReplyToolCallId?: string;
});
//#endregion
//#region src/gateway/worker-environments/placement-state.d.ts
declare const WORKER_SESSION_PLACEMENT_STATES: readonly ["local", "requested", "provisioning", "syncing", "starting", "active", "draining", "reconciling", "reclaimed", "failed"];
type WorkerSessionPlacementState = (typeof WORKER_SESSION_PLACEMENT_STATES)[number];
//#endregion
//#region src/gateway/worker-environments/placement-record.d.ts
type WorkerSessionPlacementIdentity = {
  sessionId: string;
  agentId: string;
  sessionKey: string;
};
type WorkerPlacementExecutionMode = "worker-turn" | "remote-exec";
type WorkerSessionPlacementDispatchIdentity = WorkerSessionPlacementIdentity & {
  executionMode?: WorkerPlacementExecutionMode;
};
type WorkerSessionTurnOwner = {
  kind: "local";
  environmentId?: string;
  ownerEpoch?: number;
} | {
  kind: "worker";
  environmentId: string;
  ownerEpoch: number;
};
type WorkerSessionTurnClaim = {
  sessionId: string;
  claimId: string;
  runId: string;
  placementGeneration: number;
  owner: WorkerSessionTurnOwner;
};
type PersistedTurnClaim = {
  owner: "local";
  claimId: string;
  runId: string;
  generation: number;
  ownerEpoch: null;
} | {
  owner: "worker";
  claimId: string;
  runId: string;
  generation: number;
  ownerEpoch: number;
};
type WorkerWorkspaceResultConflict = {
  paths: string[];
  stagedResultRef: string;
  totalCount?: number;
};
type PersistedLocalTurnClaim = Extract<PersistedTurnClaim, {
  owner: "local";
}>;
type PlacementRecordBase<TurnClaim extends PersistedTurnClaim | null> = WorkerSessionPlacementIdentity & {
  generation: number;
  executionMode: WorkerPlacementExecutionMode;
  turnClaim: TurnClaim;
  createdAtMs: number;
  updatedAtMs: number;
  stateChangedAtMs: number;
  /** Process-local UI projection; deliberately absent from SQLite. */
  workspaceResultConflict?: WorkerWorkspaceResultConflict;
};
type UnclaimedPlacementRecordBase = PlacementRecordBase<null>;
type LocalClaimablePlacementRecordBase = PlacementRecordBase<PersistedLocalTurnClaim | null>;
type EmptyWorkerPlacementMetadata = {
  environmentId: null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type ProvisioningPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type SyncingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type StartingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type OwnedWorkerPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: number;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type TerminalPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: number | null;
  workspaceBaseManifestRef: string | null;
  remoteWorkspaceDir: string | null;
  workerBundleHash: string | null;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  terminalReason: string | null;
  terminalAtMs: number | null;
};
type LocalPlacementRecord = LocalClaimablePlacementRecordBase & EmptyWorkerPlacementMetadata & {
  state: "local";
};
type RequestedPlacementRecord = LocalClaimablePlacementRecordBase & EmptyWorkerPlacementMetadata & {
  state: "requested";
};
type ProvisioningPlacementRecord = UnclaimedPlacementRecordBase & ProvisioningPlacementMetadata & {
  state: "provisioning";
};
type SyncingPlacementRecord = UnclaimedPlacementRecordBase & SyncingPlacementMetadata & {
  state: "syncing";
};
type StartingPlacementRecord = UnclaimedPlacementRecordBase & StartingPlacementMetadata & {
  state: "starting";
};
type ActivePlacementRecord = PlacementRecordBase<PersistedTurnClaim | null> & OwnedWorkerPlacementMetadata & {
  state: "active";
};
type DrainingPlacementRecord = PlacementRecordBase<PersistedTurnClaim | null> & OwnedWorkerPlacementMetadata & {
  state: "draining";
};
type ReconcilingPlacementRecord = UnclaimedPlacementRecordBase & OwnedWorkerPlacementMetadata & {
  state: "reconciling";
};
type ReclaimedPlacementRecord = UnclaimedPlacementRecordBase & Omit<OwnedWorkerPlacementMetadata, "terminalReason" | "terminalAtMs"> & TerminalPlacementMetadata & {
  state: "reclaimed";
};
type FailedPlacementRecord = LocalClaimablePlacementRecordBase & TerminalPlacementMetadata & {
  state: "failed";
  recoveryError: string;
};
type WorkerSessionPlacementRecord = LocalPlacementRecord | RequestedPlacementRecord | ProvisioningPlacementRecord | SyncingPlacementRecord | StartingPlacementRecord | ActivePlacementRecord | DrainingPlacementRecord | ReconcilingPlacementRecord | ReclaimedPlacementRecord | FailedPlacementRecord;
type WorkerSessionPlacementTransitionPatch = {
  environmentId?: string | null;
  activeOwnerEpoch?: number | null;
  workspaceBaseManifestRef?: string | null;
  remoteWorkspaceDir?: string | null;
  workerBundleHash?: string | null;
  lastTranscriptAckCursor?: number | null;
  lastLiveEventAckCursor?: number | null;
  recoveryError?: string | null;
  terminalReason?: string | null;
};
//#endregion
//#region src/gateway/agent-runtime-identity-token.d.ts
type AgentRuntimeCronSelfManagementContext = {
  jobId: string;
  expiresAtMs: number;
};
type AgentRuntimeIdentity = {
  kind: "agentRuntime";
  agentId: string;
  sessionKey: string;
  operationalRunInstance: OperationalRunInstanceRef;
  delegatedAuthority: AgentRuntimeDelegatedAuthority;
  approvalOwnerPluginId?: string;
  executionIdentity?: ExecutionIdentityAdmissionToken;
  turnSourceChannel?: string;
  /** Explicit admission fact; omission is unknown, never inferred from session routing. */
  turnSourceLocal?: true;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
  messageActionContext?: AgentRuntimeMessageActionContext;
  cronSelfManagementContext?: AgentRuntimeCronSelfManagementContext;
  cronToolsAllowCapture?: "final-executable-surface";
  cronCreatorAuthorityGrant?: CronCreatorAuthorityGrant;
  sessionSpawnContext?: AgentRuntimeSessionSpawnContext;
};
type AgentRuntimeDelegatedAuthority = AgentRunDelegatedAuthority & ({
  kind: "local";
} | {
  kind: "worker";
  turnClaim: WorkerSessionTurnClaim;
});
type AgentRuntimeApprovalAuthorityValidator = (identity: AgentRuntimeIdentity) => boolean;
//#endregion
//#region src/gateway/github-user-identity.d.ts
type AuthenticatedGitHubIdentitySyncResult = {
  profileId: string;
  updatedAt: number;
};
type AuthenticatedGitHubIdentitySync = () => Promise<AuthenticatedGitHubIdentitySyncResult>;
//#endregion
//#region src/gateway/operator-role-actor.d.ts
/** Host-minted role authority; never accepted from Gateway wire params.
    Leaf contract: both ws-types and server-methods/shared-types embed it in
    client `internal` state, so it must not import either hub. */
type GatewayOperatorRoleActor = {
  kind: "system";
} | {
  kind: "operator";
  profileId: string;
};
//#endregion
//#region src/gateway/plugin-node-capability.d.ts
/** Declared plugin surface that may receive scoped node capabilities. */
type PluginNodeCapabilitySurface = {
  surface: string;
  ttlMs?: number;
  scopeKey?: string;
};
/** Client state used to authorize plugin-node surface capabilities. */
type PluginNodeCapabilityClient = {
  /** Retired clients cannot back HTTP capability auth or its renewal while close is pending. */
  invalidated?: boolean;
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, {
    capability: string;
    expiresAtMs: number;
  }>;
};
//#endregion
//#region src/gateway/worker-environments/connection-identity.d.ts
/** Hash-only worker identity retained after admission. */
type WorkerConnectionIdentity = {
  environmentId: string;
  credentialHash: string;
  bundleHash: string;
  sessionId: string | null;
  runId: string | null;
  turnClaim: WorkerSessionTurnClaim | null;
  ownerEpoch: number;
  rpcSetVersion: number;
  protocolFeatures: string[];
  credentialExpiresAtMs: number;
};
//#endregion
//#region src/gateway/server/ws-types.d.ts
type GatewayWsConnectionKind = "gateway" | "worker";
/**
 * Runtime WebSocket client state tracked by the gateway server.
 */
type GatewayWsClient = PluginNodeCapabilityClient & {
  socket: WebSocket;
  connect: ConnectParams;
  connId: string;
  connectionKind?: GatewayWsConnectionKind;
  worker?: WorkerConnectionIdentity;
  isDeviceTokenAuth?: boolean;
  /** Client id verified against the server-approved device pairing record. */
  pairedClientId?: string;
  usesSharedGatewayAuth: boolean;
  sharedGatewaySessionGeneration?: string;
  presenceKey?: string;
  /** Shared by overlapping identified person sockets; never owned by the presence TTL cache. */
  personPresence?: {
    onlineSince: number;
    lastActivityAt?: number;
  };
  authenticatedUserId?: string;
  /** Verified Tailscale provider identity; generic proxy identities must not infer this. */
  authenticatedUserIsTailscaleProvider?: boolean;
  authenticatedGitHubIdentitySync?: AuthenticatedGitHubIdentitySync;
  authenticatedUserProfile?: {
    profileId: string;
    displayName: string | null;
    avatarRevision: string;
    hasAvatar: boolean;
    updatedAt: number;
  };
  clientIp?: string;
  internal?: {
    /** Handshake-attested direct-local transport; never accepted from wire params. */
    isLocalClient?: true;
    approvalRuntime?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
    /** Server-attested role-policy actor; never accepted from WebSocket wire params. */
    operatorRoleActor?: GatewayOperatorRoleActor;
  };
  canvasHostUrl?: string;
  canvasCapability?: string;
  canvasCapabilityExpiresAtMs?: number;
  invalidatedReason?: string;
};
//#endregion
//#region src/gateway/server/client-registry.d.ts
declare class GatewayClientRegistry extends Set<GatewayWsClient> {
  #private;
  constructor(clients?: Iterable<GatewayWsClient>);
  add(client: GatewayWsClient): this;
  delete(client: GatewayWsClient): boolean;
  clear(): void;
  getByConnectionId(connId: string): GatewayWsClient | undefined;
  getByConnectionIds(connIds: ReadonlySet<string>): GatewayWsClient[];
}
//#endregion
//#region src/gateway/server/presence-events.d.ts
/**
 * Presence snapshot broadcaster for gateway clients.
 */
declare function broadcastPresenceSnapshot(params: {
  broadcast: GatewayBroadcastFn;
  incrementPresenceVersion: () => number;
  getHealthVersion: () => number;
}): number;
//#endregion
//#region src/gateway/session-viewer-presence.d.ts
type SessionViewerPresenceDeclarationsDeps = Parameters<typeof broadcastPresenceSnapshot>[0] & {
  clients: GatewayClientRegistry;
};
type SessionViewerPresenceDeclarations = {
  replace: (connId: string, sessionKeys: readonly string[]) => readonly string[];
  unsubscribe: (connId: string) => void;
  stop: () => void;
};
/** Owns one replace-set per websocket connection until empty declaration or disconnect. */
declare function createSessionViewerPresenceDeclarations(deps: SessionViewerPresenceDeclarationsDeps): SessionViewerPresenceDeclarations;
//#endregion
//#region src/process/supervisor/types.d.ts
type TerminationReason = "manual-cancel" | "overall-timeout" | "no-output-timeout" | "spawn-error" | "signal" | "exit";
//#endregion
//#region src/gateway/desktop/managed-linux.d.ts
type ManagedLinuxDesktopStatus = {
  state: "not-started";
} | {
  state: "starting";
  display?: number;
  port?: number;
} | {
  state: "running";
  display: number;
  port: number;
} | {
  state: "failed";
  error: string;
  display?: number;
  port?: number;
};
//#endregion
//#region src/gateway/desktop/host-source.d.ts
type HostDesktopStatus = {
  enabled: false;
  state: "disabled";
  port: number;
} | {
  enabled: true;
  state: "attached";
  port: number;
  security: string;
} | {
  enabled: true;
  state: "unavailable";
  port: number;
  security?: string;
} | {
  enabled: true;
  state: "managed";
  managedState: ManagedLinuxDesktopStatus["state"] | "unknown";
  port: number;
  display?: number;
  error?: string;
  security?: "VncAuth";
};
type HostDesktopService = {
  observe(params: {
    control: boolean;
    credentials?: {
      username?: string;
      password?: string;
    };
  }): Promise<{
    transport: "rfb";
    wsPath: string;
    expiresAtMs: number;
    control: boolean;
    auth: "vnc-password" | "ard-account";
    vncPassword?: string;
  }>;
  status(): Promise<HostDesktopStatus>;
};
//#endregion
//#region src/gateway/worker-environments/placement-workspace-result.d.ts
type WorkerWorkspacePendingResult = {
  sessionId: string;
  environmentId: string;
  ownerEpoch: number;
  placementGeneration: number;
  claimId: string;
  runId: string;
  gatewayInstanceId: string;
  recoveryRequestedAtMs: number | null;
  workspaceAcceptedAtMs: number | null;
  stagedResultRef: string | null;
};
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.d.ts
type WorkerWorkspaceManifestEntry = {
  path: string;
  type: "file";
  mode: number;
  size: number;
  sha256: string;
} | {
  path: string;
  type: "symlink";
  mode: number;
  target: string;
};
type WorkerWorkspaceManifest = {
  version: 1;
  baseCommit: string | null;
  entries: WorkerWorkspaceManifestEntry[];
  directories?: string[];
};
type WorkerWorkspaceReconciliationJournal = {
  version: 1;
  temporaryNonce: string;
  baseManifestRef: string;
  currentManifestRef: string;
  baseEntries: WorkerWorkspaceManifestEntry[];
  appliedEntries: WorkerWorkspaceManifestEntry[];
  baseDirectories?: string[];
  appliedDirectories?: string[];
  appliedManifestRef?: string;
  baseTree: string;
  basePackSha256: string;
  basePack: Uint8Array;
};
type WorkerWorkspaceReconciliationJournalAdapter = {
  load(): WorkerWorkspaceReconciliationJournal | undefined;
  begin(journal: WorkerWorkspaceReconciliationJournal): void;
  commit(manifestRef: string): void;
  abort(): void;
};
//#endregion
//#region src/gateway/worker-environments/placement-move-intent.d.ts
type WorkerPlacementMoveTarget = SessionMoveTarget;
type WorkerPlacementMoveSource = {
  generation: number;
  environmentId: string;
  ownerEpoch: number;
};
type WorkerPlacementMoveIntent = {
  operationId: string;
  sessionId: string;
  source: WorkerPlacementMoveSource;
  target: WorkerPlacementMoveTarget;
  abandonSource: boolean;
  lastError: string | null;
  createdAtMs: number;
  updatedAtMs: number;
};
//#endregion
//#region src/gateway/worker-environments/placement-store.d.ts
declare const RETIRABLE_PLACEMENT_STATES: readonly ["local", "requested", "reclaimed", "failed"];
type WorkerSessionPlacementRetirement = {
  sessionId: string;
  expectedState: (typeof RETIRABLE_PLACEMENT_STATES)[number];
  expectedGeneration: number;
};
declare function createWorkerSessionPlacementStore(options?: {
  database?: OpenClawStateDatabase;
  now?: () => number;
}): {
  registerTurnClaimClosedHandler(handler: (claim: WorkerSessionTurnClaim) => void): () => void;
  get(sessionId: string): WorkerSessionPlacementRecord | undefined;
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
  retireSessionPlacement(input: WorkerSessionPlacementRetirement): void;
  recordWorkspaceResultConflict(claim: WorkerSessionTurnClaim, conflict: WorkerWorkspaceResultConflict | undefined): void;
  startDispatch(input: WorkerSessionPlacementDispatchIdentity): WorkerSessionPlacementRecord;
  transition(input: {
    sessionId: string;
    from: WorkerSessionPlacementState;
    to: WorkerSessionPlacementState;
    expectedGeneration: number;
    patch?: WorkerSessionPlacementTransitionPatch;
  }): WorkerSessionPlacementRecord;
  startDrain(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    workspaceBaseManifestRef?: string;
  }): WorkerSessionPlacementRecord;
  startWorkspaceResultDrain(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  startReconcile(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    forceLocalClaim?: true;
  }): WorkerSessionPlacementRecord;
  validateWorkerOwner(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
  }): boolean;
  fail(input: {
    sessionId: string;
    recoveryError: string;
    expectedGeneration?: number;
  }): WorkerSessionPlacementRecord;
  adoptActive(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration?: number;
  }): WorkerSessionPlacementRecord;
  listForReconcile(): WorkerSessionPlacementRecord[];
  list(): WorkerSessionPlacementRecord[];
  workspaceResultInstanceId(): string;
  validateWorkspaceResultClaim(claim: WorkerSessionTurnClaim): boolean;
  listPendingWorkspaceResults(): WorkerWorkspacePendingResult[];
  markWorkspaceResultPending(claim: WorkerSessionTurnClaim): void;
  recordStagedWorkspaceResult(claim: WorkerSessionTurnClaim, stagedResultRef: string): void;
  acceptWorkspaceResult(claim: WorkerSessionTurnClaim): void;
  handoffWorkspaceResultRecovery(claim: WorkerSessionTurnClaim): void;
  abandonWorkspaceResult(pending: WorkerWorkspacePendingResult): void;
  listWorkspaceReconciliationOwners(): {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }[];
  pruneOrphanedWorkspaceReconciliations(options: {
    retainFailedOwner: (recoveryError: string) => boolean;
  }): {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }[];
  loadWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, options?: {
    allowFailedOwner?: boolean;
  }): WorkerWorkspaceReconciliationJournal | undefined;
  beginWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, journal: WorkerWorkspaceReconciliationJournal): void;
  abortWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, options?: {
    force?: boolean;
  }): void;
  getPlacementMove(sessionId: string): WorkerPlacementMoveIntent | undefined;
  getPlacementMoves(sessionIds: readonly string[]): ReadonlyMap<string, WorkerPlacementMoveIntent>;
  listPlacementMoves(): WorkerPlacementMoveIntent[];
  beginPlacementMove(input: {
    sessionId: string;
    source: WorkerPlacementMoveSource;
    target: WorkerPlacementMoveTarget;
    abandonSource?: true;
  }): {
    intent: WorkerPlacementMoveIntent;
    placement: WorkerSessionPlacementRecord;
    joined: boolean;
  };
  preparePlacementMove(input: {
    sessionId: string;
    source: WorkerPlacementMoveSource;
    target: WorkerPlacementMoveTarget;
    abandonSource?: true;
  }, prepareNew: () => Promise<void>): Promise<{
    intent: WorkerPlacementMoveIntent;
    placement: WorkerSessionPlacementRecord;
    joined: boolean;
  }>;
  recordPlacementMoveError(input: {
    operationId: string;
    sessionId: string;
    error: string;
  }): boolean;
  cancelPlacementMove(input: {
    operationId: string;
    sessionId: string;
  }): void;
  completePlacementMoveSourceToLocal(input: {
    operationId: string;
    sessionId: string;
    expectedGeneration: number;
  }): WorkerSessionPlacementRecord;
  completeAbandonedPlacementMoveSourceToLocal(input: {
    operationId: string;
    sessionId: string;
    expectedGeneration: number;
    expectedRecoveryError: string;
  }): WorkerSessionPlacementRecord;
  completePlacementMoveToWorker(input: {
    operationId: string;
    sessionId: string;
    expectedGeneration: number;
    environmentId: string;
    ownerEpoch: number;
  }): WorkerSessionPlacementRecord;
  failWorkspaceResultAndReleaseTurn(pending: WorkerWorkspacePendingResult, error: unknown): WorkerSessionPlacementRecord;
  releaseTurn(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  completeWorkspaceResultAndReleaseTurn(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  cancelWorkspaceResultAndReleaseTurn(claim: WorkerSessionTurnClaim, options?: {
    reason: "node-disconnect";
  }): WorkerSessionPlacementRecord;
  clearLocalTurnClaimsAfterRestart(): number;
  waitForTurnClaimRelease(sessionIdInput: string, waitOptions: {
    timeoutMs: number;
    signal?: AbortSignal;
  }): Promise<void>;
  validateTurnClaim(claim: WorkerSessionTurnClaim): boolean;
  updateAckCursors(input: {
    claim: WorkerSessionTurnClaim;
    transcript?: number;
    liveEvent?: number;
    workspaceResultPending?: boolean;
  }): WorkerSessionPlacementRecord;
  updateWorkspaceBaseManifest(input: {
    claim: WorkerSessionTurnClaim;
    manifestRef: string;
  }): WorkerSessionPlacementRecord;
  acceptIdleWorkspaceReconciliation(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    manifestRef: string;
  }): WorkerSessionPlacementRecord;
  authorizeWorkerTurnTools(claim: WorkerSessionTurnClaim, toolNames: readonly string[]): void;
  isWorkerTurnToolAuthorized(claim: WorkerSessionTurnClaim, toolName: string): boolean;
  closeWorkerTurnToolAdmission(claim: WorkerSessionTurnClaim): void;
  closeWorkerTurnToolState(claim: WorkerSessionTurnClaim): Promise<void>;
  beginWorkerSessionToolOperation(params: {
    claim: WorkerSessionTurnClaim;
    toolName: "sessions_spawn" | "sessions_send";
    toolCallId: string;
    requestDigest: string;
    childSessionKey?: string;
  }): {
    kind: "execute";
    operationSeed: string;
    childSessionKey?: string;
  } | {
    kind: "in-progress";
  } | {
    kind: "completed";
    resultJson: string;
  } | {
    kind: "unknown";
  } | {
    kind: "capacity";
  } | {
    kind: "conflict";
  } | {
    kind: "unauthorized";
  };
  bindWorkerSessionToolOperationChild(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
    childSessionKey: string;
  }): boolean;
  completeWorkerSessionToolOperation(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
    resultJson: string;
    failed?: boolean;
  }): boolean;
  abandonWorkerSessionToolOperation(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
  }): boolean;
  recoverWorkerSessionToolOperationsAfterRestart(): number;
  claimTurn(input: WorkerSessionPlacementIdentity & {
    owner: WorkerSessionTurnOwner;
    claimId: string;
    runId: string;
  }): WorkerSessionTurnClaim;
  claimReclaimWorkspaceResult(input: WorkerSessionPlacementIdentity & {
    owner: WorkerSessionTurnOwner;
    claimId: string;
    runId: string;
  }): WorkerSessionTurnClaim;
};
type WorkerSessionPlacementStore = ReturnType<typeof createWorkerSessionPlacementStore>;
type WorkerSessionPlacementRetirementService = Pick<WorkerSessionPlacementStore, "retireSessionPlacement">;
//#endregion
//#region src/gateway/github-publication.d.ts
type GitHubPublicationCoordinator = ReturnType<typeof createGitHubPublicationCoordinator>;
declare function createGitHubPublicationCoordinator(params: {
  placements: WorkerSessionPlacementStore;
}): {
  requestForSession(input: SessionGitHubPublishParams & {
    agentId: string;
    expectedRunId?: string;
    assertCurrent?: () => void;
  }): Promise<SessionGitHubPublicationResult>;
  resumeSessionRequests(): Promise<void>;
  processClaim(claim: WorkerSessionTurnClaim): Promise<SessionGitHubPublicationResult[]>;
  deferOrphanedRequests(): void;
  listUnreportedResults(): Array<{
    sessionId: string;
    sessionKey: string;
    agentId: string;
    result: SessionGitHubPublicationResult;
  }>;
  read(requestId: string): SessionGitHubPublicationResult | undefined;
  markReported(requestId: string): void;
  requestForClaim: (request: {
    claim: WorkerSessionTurnClaim;
    sessionKey: string;
    agentId: string;
    idempotencyKey: string;
    title?: string;
    body?: string;
    assertCurrent?: () => void;
  }) => Promise<SessionGitHubPublicationResult>;
  prepareClaimWorkspace: (claim: WorkerSessionTurnClaim) => Promise<void>;
  deferClaimPreparation: (claim: WorkerSessionTurnClaim) => void;
};
//#endregion
//#region src/agents/github-oauth-records.d.ts
type GitHubIdentityScope = "system" | "agent";
//#endregion
//#region src/gateway/github-oauth-lifecycle.d.ts
declare function createGitHubOAuthLifecycle(params: {
  getConfig: () => OpenClawConfig;
  getPersistedConfig?: () => OpenClawConfig;
  warn: (message: string) => void;
}): {
  startAuthorization: (input: {
    scope: GitHubIdentityScope;
    agentId: string;
  }) => Promise<ToolsGitHubAuthorizeStartResult>;
  pollAuthorization: (requestId: string) => Promise<ToolsGitHubAuthorizePollResult>;
  cancelAuthorization: (requestId: string) => boolean;
  status: (agentId: string, selectedScope: GitHubIdentityScope) => Promise<{
    agentId: string;
    effective: {
      account: {
        login: string;
      } | null;
      source: "system-detected" | "system-configured" | "agent-override";
      credentialKind: "native" | "managed-pat" | "managed-oauth";
      credentialState: "available" | "unavailable" | "unverified" | "configured_unavailable" | "rate_limited";
      gitAuthor: {
        name: string | null;
        email: string | null;
      };
      evidence: "none" | "unverified" | "github-api" | "rate-limited";
      accessExpiresAtMs: number | null;
      refreshState: "failed" | "expired" | "available" | "unavailable" | "not_applicable" | "refreshing";
      oauthScopes: string[];
      repositoryGrants: "unknown";
    };
    selectedScope: "agent" | "system";
    selected: {
      identity: {
        account: {
          login: string;
        } | null;
        source: "system-detected" | "system-configured" | "agent-override";
        credentialKind: "native" | "managed-pat" | "managed-oauth";
        credentialState: "available" | "unavailable" | "unverified" | "configured_unavailable" | "rate_limited";
        gitAuthor: {
          name: string | null;
          email: string | null;
        };
        evidence: "none" | "unverified" | "github-api" | "rate-limited";
        accessExpiresAtMs: number | null;
        refreshState: "failed" | "expired" | "available" | "unavailable" | "not_applicable" | "refreshing";
        oauthScopes: string[];
        repositoryGrants: "unknown";
      } | null;
      scope: "agent" | "system";
      configured: boolean;
    };
  }>;
  retireProfile: (profileId: string) => void;
  refreshEffectiveIdentity: (agentId: string) => Promise<void>;
  maintain: () => Promise<void>;
  start: () => void;
  stop: () => Promise<void>;
};
//#endregion
//#region src/infra/voicewake-routing.d.ts
type VoiceWakeRouteTarget = {
  mode: "current";
  agentId?: undefined;
  sessionKey?: undefined;
} | {
  agentId: string;
  sessionKey?: undefined;
  mode?: undefined;
} | {
  sessionKey: string;
  agentId?: undefined;
  mode?: undefined;
};
type VoiceWakeRouteRule = {
  trigger: string;
  target: VoiceWakeRouteTarget;
};
type VoiceWakeRoutingConfig = {
  version: 1;
  defaultTarget: VoiceWakeRouteTarget;
  routes: VoiceWakeRouteRule[];
  updatedAtMs: number;
};
//#endregion
//#region src/cli/outbound-send-mapping.d.ts
type CliOutboundSendSource = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/cli/deps.types.d.ts
/** CLI dependency bag currently used by outbound send command plumbing. */
type CliDeps = CliOutboundSendSource;
//#endregion
//#region src/infra/system-agent-approvals.d.ts
type SystemAgentApprovalRequestPayload = {
  title: string;
  description: string;
  command: string;
  proposalHash: string;
  allowedDecisions: readonly ExecApprovalDecision[];
  agentId?: string | null;
  sessionKey?: string | null;
  sessionId: string;
  turnSourceChannel?: null;
  turnSourceAccountId?: null;
};
//#endregion
//#region src/system-agent/operation-types.d.ts
/** Parsed OpenClaw operation before approval/execution. */
type SystemAgentOperation = {
  kind: "none";
  message: string;
} | {
  kind: "overview";
} | {
  kind: "doctor";
} | {
  kind: "doctor-fix";
} | {
  kind: "status";
} | {
  kind: "health";
} | {
  kind: "config-validate";
} | {
  kind: "config-get";
  path: string;
} | {
  kind: "config-schema";
  path?: string;
} | {
  kind: "config-set";
  path: string;
  value: string;
} | {
  kind: "config-set-ref";
  path: string;
  source: "env" | "file" | "exec" | "store";
  id: string;
  provider?: string;
} | {
  kind: "setup";
  workspace?: string;
  model?: string;
  agentName?: string;
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "channel-list";
} | {
  kind: "channel-info";
  channel: string;
} | {
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
  kind: "open-setup";
  target: "guided" | "classic" | "channels" | "search" | "gateway";
  channel?: string;
} | {
  kind: "gateway-status";
} | {
  kind: "gateway-start";
} | {
  kind: "gateway-stop";
} | {
  kind: "gateway-restart";
} | {
  kind: "agents";
} | {
  kind: "models";
} | {
  kind: "plugin-list";
} | {
  kind: "plugin-search";
  query: string;
} | {
  kind: "plugin-install";
  spec: string;
} | {
  kind: "plugin-uninstall";
  pluginId: string;
} | {
  kind: "audit";
} | {
  kind: "create-agent";
  agentId: string;
  workspace?: string;
  model?: string;
  requesterAgentId?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
  agentDraft?: "hatch";
} | {
  kind: "set-default-model";
  model: string;
  agentId?: string;
};
//#endregion
//#region src/infra/agent-events.d.ts
/** Stream name for agent events delivered to gateway listeners and plugin host hooks. */
type AgentEventStream = "lifecycle" | "tool" | "assistant" | "usage" | "error" | "item" | "plan" | "approval" | "command_output" | "patch" | "compaction" | "thinking" | (string & {});
/** Enriched event delivered to subscribers after sequencing and context stamping. */
type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: AgentEventStream;
  ts: number;
  data: Record<string, unknown>;
  /** Internal, non-enumerable gateway lifecycle generation that owns this run. */
  lifecycleGeneration?: string;
  sessionKey?: string;
  /**
   * sessionId the run was bound to when it started. Lifecycle persistence uses
   * this to reject terminal events from a pre-`sessions.reset` run that would
   * otherwise clobber the rotated session row resolved by the shared sessionKey.
   */
  sessionId?: string;
  agentId?: string;
};
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
declare function onAgentEvent(listener: (evt: AgentEventPayload) => void): () => void;
//#endregion
//#region src/gateway/server-chat-progress-snapshot.d.ts
type ChatRunProgressSnapshot = {
  events: AgentEventPayload[];
  byteLength: number;
  lastSeq: number;
};
//#endregion
//#region src/gateway/server-chat-state.d.ts
type ChatRunTiming = {
  ackedAtMs: number;
  connId: string;
  dispatchStartedAtMs?: number;
  firstAssistantEventSent?: boolean;
  receivedAtMs: number;
};
type ChatRunRegistration = {
  sessionKey: string;
  agentId?: string;
  clientRunId: string;
  chatSendTiming?: ChatRunTiming;
};
type ChatRunEntry = ChatRunRegistration & {
  registeredSequence: number;
};
type ChatAbortMarker = {
  abortedAtMs: number;
  sequence: number;
};
type BufferedAgentEvent = {
  sessionKey?: string;
  agentId?: string;
  payload: AgentEventPayload & {
    spawnedBy?: string;
  };
};
type ChatRunPlanSnapshot = {
  steps: AgentPlanStep[];
  explanation?: string;
};
type ChatRunAgentTextState = {
  lastSentAt?: number;
  bufferedEvent?: BufferedAgentEvent;
};
type ChatRunToolRecipientState = {
  connIds: Set<string>;
  updatedAt: number;
  finalizedAt?: number;
};
type ChatRunRecord = {
  registrations?: ChatRunEntry[];
  rawBuffer?: string;
  buffer?: string;
  /** Projection stays valid only while source matches rawBuffer; readers refresh it lazily. */
  bufferProjection?: {
    source: string;
    suppress: boolean;
  };
  planSnapshot?: ChatRunPlanSnapshot;
  progressSnapshot?: ChatRunProgressSnapshot;
  /** Last time any buffered assistant text changed, including suppressed raw buffers. */
  bufferUpdatedAt?: number;
  deltaSentAt?: number;
  /** Length of text at the time of the last broadcast, used to avoid duplicate flushes. */
  deltaLastBroadcastLen?: number;
  deltaLastBroadcastText?: string;
  agentText?: {
    assistant?: ChatRunAgentTextState;
    thinking?: ChatRunAgentTextState;
  };
  abortMarker?: ChatAbortMarker;
  toolRecipient?: ChatRunToolRecipientState;
};
type ChatRunRegistry = {
  add: (sessionId: string, entry: ChatRunRegistration) => void;
  peek: (sessionId: string) => ChatRunEntry | undefined;
  shift: (sessionId: string) => ChatRunEntry | undefined;
  remove: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
};
type ChatRunState = {
  runs: Map<string, ChatRunRecord>;
  registry: ChatRunRegistry;
  toolEventRecipients: ToolEventRecipientRegistry;
  getOrCreate: (runId: string) => ChatRunRecord;
  resolveBuffer: (runId: string) => {
    text: string;
    suppress: boolean;
  };
  hasAbortMarker: (runId: string) => boolean;
  deleteAbortMarker: (runId: string) => void;
  recordProgressEvent: (runId: string, event: AgentEventPayload, mode?: "full" | "summary") => void;
  clearRun: (runId: string) => void;
  clear: () => void;
};
type ToolEventRecipientRegistry = {
  add: (runId: string, connId: string) => void;
  get: (runId: string) => ReadonlySet<string> | undefined;
  markFinal: (runId: string) => void;
};
//#endregion
//#region src/gateway/chat-abort.d.ts
type ChatAbortControllerEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string;
  lifecycleGeneration?: string;
  /** Exact operational instance created by this controller registration. */
  operationalRunInstance?: OperationalRunInstanceRef;
  /** Exact approval lease captured when this controller's execution was admitted. */
  agentRunDelegatedAuthority?: AgentRunDelegatedAuthority;
  agentId?: string;
  startedAtMs: number;
  /** False until lane admission reaches the execution boundary. */
  executionStarted?: boolean;
  expiresAtMs: number;
  ownerConnId?: string;
  ownerDeviceId?: string;
  providerId?: string;
  authProviderId?: string;
  abortStopReason?: string;
  /** Latest argument-free validation diagnostic for operator-initiated aborts. */
  toolErrorSummary?: string;
  /**
   * False for backend/internal agent runs that may share a session key but must
   * not be projected into operator chat surfaces.
   */
  controlUiVisible?: boolean;
  /**
   * Controls only the sessions.list active-run projection. Terminal lifecycle
   * clears this before chat.send settles, while the entry stays as the retry
   * idempotency guard until normal cleanup removes it.
   */
  projectSessionActive?: boolean;
  /** True after the terminal session-store update has completed. */
  projectSessionTerminalPersisted?: boolean;
  /** A terminal lifecycle event was observed and is awaiting persistence. */
  projectSessionTerminalPending?: boolean;
  /** Store timestamp expected from the observed terminal lifecycle event. */
  projectSessionTerminalObservedAt?: number;
  /** In-flight terminal session-store update used by restart shutdown. */
  projectSessionTerminalPersistence?: Promise<void>;
  /** Caller completion requested cleanup before terminal lifecycle persistence settled. */
  registrationCleanupRequested?: boolean;
  /** False after the owning reply run commits a terminal outcome. */
  isAbortable?: (entry: ChatAbortControllerEntry) => boolean;
  /** Runs once when this registration is actually removed. */
  onRemoved?: () => void;
  /**
   * Which RPC owns this registration. Absent (undefined) is treated as
   * `"chat-send"` so pre-existing callers that constructed entries without
   * a kind keep their behavior. Consumers that need "chat.send specifically
   * is active" must check `kind !== "agent"`, not just `.has(runId)`.
   */
  kind?: "chat-send" | "agent";
  /** Side questions stay independent from main-turn TUI session stops. */
  turnKind?: "main" | "btw";
};
//#endregion
//#region src/gateway/config-reload-status.types.d.ts
type GatewayHotReloadStatus = "active" | "disabled";
//#endregion
//#region src/gateway/config-revision-token.d.ts
type GatewayConfigRevisionProjector = {
  projectRawHash: (hash: string) => string;
  projectResolvedHash: (hash: string) => string;
};
//#endregion
//#region src/gateway/device-scope-upgrade.d.ts
type UpgradeOwner = {
  deviceId: string;
  publicKey: string;
};
/** Coordinates live device scope-upgrade waiters with the durable pairing store. */
declare class ScopeUpgradeCoordinator {
  private readonly entries;
  register(params: {
    requestId: string;
    expiresAtMs: number;
    owner: UpgradeOwner;
    requestedScopes: string[];
    initialToken?: string;
    initialApprovedAtMs?: number;
  }): boolean;
  notify(requestId: string, resolution: "approved" | "rejected"): void;
  wait(requestId: string, owner: UpgradeOwner): Promise<ScopeUpgradeResult | null>;
  private waitForResult;
  private readDurableResult;
  private retainTerminal;
}
//#endregion
//#region src/gateway/operator-approval-standing-grants.d.ts
/** Cron identity plus exact operation binding recorded at approval creation. */
type CronStandingGrantMintSpec = {
  agentId: string;
  cronJobId: string;
  jobConfigRevision: string;
  operationBinding: string;
};
//#endregion
//#region src/gateway/operator-approval-store.d.ts
type OperatorApprovalKind = "exec" | "plugin" | "system-agent";
type OperatorApprovalStatus = "pending" | "allowed" | "denied" | "expired" | "cancelled";
type OperatorApprovalDecision = "allow-once" | "allow-always" | "deny";
type OperatorApprovalTerminalReason = "user" | "timeout" | "malformed-verdict" | "no-route" | "run-aborted" | "gateway-restart" | "storage-corrupt";
type OperatorApprovalResolverKind = "device" | "channel" | "runtime" | "system";
type OperatorApprovalRequester = {
  deviceId: string | null;
  clientId: string | null;
  deviceTokenAuth: boolean;
};
type OperatorApprovalSource = {
  agentId: string | null;
  sessionKey: string | null;
  sessionId: string | null;
  runId: string | null;
  toolCallId: string | null;
  toolName: string | null;
};
type OperatorApprovalResolver = {
  kind: OperatorApprovalResolverKind;
  id: string | null;
};
type OperatorApprovalRecord = {
  id: string;
  resolutionRef: string;
  kind: OperatorApprovalKind;
  status: OperatorApprovalStatus;
  presentation: ApprovalPresentation;
  requester: OperatorApprovalRequester;
  reviewerDeviceIds: string[];
  source: OperatorApprovalSource;
  audienceSessionKeys: string[];
  runtimeEpoch: string;
  createdAtMs: number;
  expiresAtMs: number;
  updatedAtMs: number;
  decision: OperatorApprovalDecision | null;
  terminalReason: OperatorApprovalTerminalReason | null;
  resolvedAtMs: number | null;
  resolver: OperatorApprovalResolver | null;
  consumedAtMs: number | null;
  consumedBy: string | null;
};
type ResolveOperatorApprovalResult = {
  outcome: "resolved";
  record: OperatorApprovalRecord;
} | {
  outcome: "expired";
  record: OperatorApprovalRecord;
} | {
  outcome: "already-resolved";
  retry: "same" | "conflict";
  record: OperatorApprovalRecord;
} | {
  outcome: "decision-not-allowed";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-found";
} | {
  outcome: "corrupt";
};
type ForceDenyOperatorApprovalResult = {
  outcome: "denied";
  record: OperatorApprovalRecord;
} | {
  outcome: "expired";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-due";
  record: OperatorApprovalRecord;
} | {
  outcome: "already-terminal";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-found";
} | {
  outcome: "corrupt";
};
//#endregion
//#region src/gateway/exec-approval-manager.d.ts
type ExecApprovalRequestPayload = ExecApprovalRequestPayload$1;
type ExecApprovalResolutionSource = "operator" | "auto-review";
type ExecApprovalRecord<TPayload = ExecApprovalRequestPayload> = {
  id: string;
  request: TPayload;
  createdAtMs: number;
  expiresAtMs: number;
  requestedByConnId?: string | null;
  requestedByDeviceId?: string | null;
  requestedByClientId?: string | null;
  requestedByDeviceTokenAuth?: boolean;
  approvalReviewerDeviceIds?: string[];
  resolvedAtMs?: number;
  decision?: ExecApprovalDecision;
  consumedDecision?: ExecApprovalDecision;
  resolutionSource?: ExecApprovalResolutionSource;
  askFallbackConsumed?: boolean;
  resolvedBy?: string | null;
  status?: OperatorApprovalStatus;
  terminalReason?: OperatorApprovalTerminalReason | null;
  runtimeEpoch?: string;
  resolverKind?: OperatorApprovalResolver["kind"] | null;
  consumedAtMs?: number | null;
  consumedBy?: string | null;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
  /** Exact source authority retained only for use-time liveness validation. */
  agentRuntimeDelegatedAuthority?: AgentRuntimeDelegatedAuthority;
};
type OperatorApprovalPersistenceRuntime = {
  runtimeEpoch: string;
  databaseOptions?: OpenClawStateDatabaseOptions;
};
type ExecApprovalManagerOptions<TPayload> = {
  approvalKind?: OperatorApprovalKind;
  persistence?: OperatorApprovalPersistenceRuntime;
  resolveAllowedDecisions?: (request: TPayload) => readonly ExecApprovalDecision[];
  /** Session-lineage audience policy is gateway-owned and injected as a
   * non-throwing resolver; importing it here would close an agents->gateway
   * barrel cycle. Absent resolver (tests) seeds only the raising session. */
  resolveAudienceSessionKeys?: (sourceSessionKey: string, sourceAgentId?: string | null) => string[];
  onError?: (error: Error, context: {
    approvalId: string;
    approvalKind: OperatorApprovalKind;
    operation: "expire";
  }) => void;
  onLifecycle?: (event: OperatorApprovalLifecycleEvent) => void;
  /** Cron-context allow-always requests mint a scoped standing grant in the
   * durable resolution transaction. Returning null keeps the decision
   * grant-free (non-cron requests, aborted runs, missing bindings). */
  resolveStandingGrantMint?: (request: TPayload) => CronStandingGrantMintSpec | null;
  /** Durable timeout expiry can be first observed by a timer, lookup, or replay.
   * Publish from the local settlement owner so every ordering reaches reviewers. */
  onExpired?: (record: OperatorApprovalRecord, liveRecord: ExecApprovalRecord<TPayload>) => void;
  validateAgentRuntimeDelegatedAuthority?: (authority: AgentRuntimeDelegatedAuthority) => boolean;
};
type OperatorApprovalLifecycleEvent = {
  phase: "pending" | "terminal";
  record: OperatorApprovalRecord;
};
type WithLiveRecord<TResult, TPayload> = TResult extends {
  record: OperatorApprovalRecord;
} ? TResult & {
  liveRecord?: ExecApprovalRecord<TPayload>;
} : TResult;
type ExecApprovalResolveResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<ResolveOperatorApprovalResult, TPayload>;
type ExecApprovalForceDenyResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<ForceDenyOperatorApprovalResult, TPayload>;
type ExecApprovalDurableLookup = {
  outcome: "found";
  record: OperatorApprovalRecord;
} | {
  outcome: "missing" | "corrupt";
  id: string;
};
type ExecApprovalIdLookupResult = {
  kind: "exact" | "prefix";
  id: string;
} | {
  kind: "ambiguous";
  ids: string[];
} | {
  kind: "none";
};
declare class ExecApprovalManager<TPayload = ExecApprovalRequestPayload> {
  private readonly options;
  private pending;
  constructor(options?: ExecApprovalManagerOptions<TPayload>);
  get approvalKind(): OperatorApprovalKind;
  get runtimeEpoch(): string | null;
  create(request: TPayload, timeoutMs: number, id?: string | null): ExecApprovalRecord<TPayload>;
  /**
   * Register an approval record and return a promise that resolves when the decision is made.
   * This separates registration (synchronous) from waiting (async), allowing callers to
   * confirm registration before the decision is made.
   */
  register(record: ExecApprovalRecord<TPayload>, _timeoutMs: number): Promise<ExecApprovalDecision | null>;
  private emitLifecycle;
  private projectLocalRecord;
  /** Persist the first verdict, then release the process-local waiter. */
  resolveDetailed(recordId: string, decision: ExecApprovalDecision, resolver: OperatorApprovalResolver, localResolvedBy?: string | null, localResolutionSource?: ExecApprovalResolutionSource): ExecApprovalResolveResult<TPayload>;
  /** Persist a fail-closed terminal state, then release the local waiter. */
  forceDenyDetailed(recordId: string, reason: OperatorApprovalTerminalReason, resolver: OperatorApprovalResolver, status?: "denied" | "expired" | "cancelled", localDecision?: ExecApprovalDecision | null, requireDue?: boolean, localResolvedBy?: string | null): ExecApprovalForceDenyResult<TPayload>;
  private settleLocalFromStore;
  /** Settle one durable terminal transition and report whether this manager published it. */
  reconcileDurableTerminal(record: OperatorApprovalRecord): boolean;
  /** Reconciles durable truth with an existing waiter without rehydrating its request. */
  reconcileDurableLookup(lookup: ExecApprovalDurableLookup, localResolvedBy?: string | null): OperatorApprovalRecord | null;
  private settleLocalStorageFailure;
  private persistStorageCorruptDeny;
  private settleLocalEntry;
  private scheduleResolvedCleanup;
  private resolvedGraceAnchorMs;
  /** Retains an existing local binding across async delivery; final release starts a fresh grace. */
  retainForHandoff(recordId: string): (() => void) | null;
  private reportError;
  private scheduleExpiryTimer;
  private createExpiryTimer;
  private expireDue;
  private resolveLocal;
  private expireLocal;
  resolve(recordId: string, decision: ExecApprovalDecision, resolvedBy?: string | null): boolean;
  /**
   * Trusted auto-review resolution (identity-matched approval runtime).
   * Always allow-once; system.run replay validation treats the resulting
   * record more strictly than an operator decision (see #103515).
   */
  resolveAutoReview(recordId: string, resolvedBy?: string | null): boolean;
  /**
   * One-shot ask-fallback re-admission for a timed-out approval. This is
   * pre-gate policy on the process-local record only: the durable row stays
   * `expired` and no execution authority is minted here. The strict exec
   * timeout cutover is deferred (docs/refactor/operator-approvals.md); until
   * then system.run replay uses this flag to keep re-admission single-use.
   */
  consumeAskFallback(recordId: string): boolean;
  expire(recordId: string, resolvedBy?: string | null): boolean;
  getSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  /** Returns an exact live request snapshot without reading durable state or mutating expiry. */
  getLiveSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  /** Re-enters the exact admitted request root only while this approval is pending. */
  runPendingContinuation<T>(recordId: string, run: () => Promise<T>): Promise<T> | null;
  listPendingRecords(): ExecApprovalRecord<TPayload>[];
  consumeAllowOnce(recordId: string, consumerId?: string): boolean;
  /**
   * Wait for decision on an already-registered approval.
   * Returns the decision promise if the ID is pending, null otherwise.
   */
  awaitDecision(recordId: string): Promise<ExecApprovalDecision | null> | null;
  /** Projects an allowed decision only while its exact runtime authority is live. */
  projectDecisionIfActive(recordId: string, decision: ExecApprovalDecision | null): ExecApprovalDecision | null;
  /** Atomically closes a live approval whose exact delegated owner is gone. */
  forceDenyIfDelegatedAuthorityClosed(recordId: string): ExecApprovalForceDenyResult<TPayload> | null;
  lookupApprovalId(input: string, opts?: {
    includeResolved?: boolean;
    filter?: (record: ExecApprovalRecord<TPayload>) => boolean;
  }): ExecApprovalIdLookupResult;
}
//#endregion
//#region src/plugins/runtime-degraded-state.d.ts
/** Boot-stable quarantine state for configured plugins whose payload failed verification. */
type PluginVerificationFailureReason = "missing-install-path" | "missing-package-dir" | "missing-package-json" | "unreadable-package-json" | "invalid-package-json" | "missing-bundle-manifest" | "invalid-bundle-manifest" | "missing-main-entry" | "missing-extension-entry" | "missing-openclaw-peer-link";
//#endregion
//#region src/gateway/health/types.d.ts
type ProtocolHealth = Snapshot["health"];
type ProtocolPlugin = NonNullable<ProtocolHealth["plugins"]>;
type UnavailablePlugin = NonNullable<ProtocolPlugin["unavailable"]>[number];
/** Health snapshot for one configured channel account. */
type ChannelAccountHealthSummary = ChannelAccountSnapshot & {
  authAgeMs?: number | null;
  [key: string]: unknown;
};
/** Channel-level health summary with optional per-account details. */
type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};
type AgentHealthSummary = NonNullable<ProtocolHealth["agents"]>[number];
/** Plugin registry health summary. */
type PluginHealthSummary = Omit<ProtocolPlugin, "unavailable"> & {
  unavailable?: Array<Omit<UnavailablePlugin, "diagnostic"> & {
    diagnostic: Omit<UnavailablePlugin["diagnostic"], "reason"> & {
      reason: PluginVerificationFailureReason;
    };
  }>;
};
/** Full gateway health payload consumed by `openclaw health`. */
type HealthSummary = ProtocolHealth & {
  ok: true;
  ts: number;
  durationMs: number;
  plugins?: PluginHealthSummary;
  channels: Record<string, ChannelHealthSummary>;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  agents: AgentHealthSummary[];
  sessions: NonNullable<ProtocolHealth["sessions"]>;
};
//#endregion
//#region src/infra/device-pairing-node-state.d.ts
/** Registry projection of a paired device's authenticated node-role state. */
type PairedDeviceNodeBinding = {
  identity: string;
  generation?: string;
};
//#endregion
//#region src/plugins/computer-use-contract.d.ts
declare const ComputerUseCapabilityDescriptorSchema: Type.TObject<{
  contractVersion: Type.TLiteral<2>;
  provider: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    generation: Type.TString;
  }>;
  actions: Type.TArray<Type.TEnum<["screenshot", "left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move", "left_click_drag", "left_mouse_down", "left_mouse_up", "scroll", "type", "key", "hold_key", "wait", "list_apps", "list_windows", "get_accessibility_tree", "get_cursor_position", "get_window_state", "launch_app", "kill_app", "bring_to_front", "set_value", "zoom", "get_browser_state", "browser_prepare", "browser_navigate", "browser_click", "browser_type", "browser_dialog", "browser_set_input_files", "browser_download", "browser_pointer", "escalate_scope", "get_recording_state", "start_recording", "stop_recording", "replay_trajectory", "invoke_menu"]>>;
  targets: Type.TArray<Type.TEnum<["screen", "window", "element", "browser"]>>;
  deliveryModes: Type.TArray<Type.TEnum<["background", "foreground"]>>;
  observations: Type.TArray<Type.TEnum<["image", "accessibility", "browser"]>>;
  features: Type.TObject<{
    recording: Type.TBoolean;
    agentCursor: Type.TBoolean;
    multiDisplay: Type.TBoolean;
  }>;
}>;
type ComputerUseCapabilityDescriptor = Static<typeof ComputerUseCapabilityDescriptorSchema>;
//#endregion
//#region src/gateway/node-plugin-tool-snapshot.d.ts
type RegisteredNodePluginToolCommand = {
  pluginId: string;
  command: {
    command?: string;
    agentTool?: {
      name?: string;
      description?: string;
      parameters?: unknown;
      mcp?: {
        server?: string;
        tool?: string;
      };
    };
  };
};
//#endregion
//#region src/gateway/node-registry.invoke-stream.d.ts
type NodeInvokeProgressParams = {
  invokeId: string;
  nodeId: string;
  connId: string | undefined;
  seq: number;
  chunk: string;
};
type NodeInvokeResultParams = {
  id: string;
  nodeId: string;
  connId: string | undefined;
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
//#endregion
//#region src/gateway/node-registry.d.ts
/** Connected node session advertised over Gateway websocket. */
type NodeSession = {
  nodeId: string;
  connId: string;
  /** Persistent device key and node-token identity authenticated for this connection. */
  pairingIdentity?: string;
  /** Persistent pairing generation authenticated before this session was registered. */
  pairingGeneration?: string;
  client: GatewayWsClient;
  clientId?: string;
  clientMode?: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  remoteIp?: string;
  declaredCaps: string[];
  sessionCapsCeiling?: string[];
  caps: string[];
  declaredCommands: string[];
  sessionCommandsCeiling?: string[];
  commands: string[];
  declaredComputerUse?: ComputerUseCapabilityDescriptor;
  computerUse?: ComputerUseCapabilityDescriptor;
  declaredNodePluginTools: NodePluginToolDescriptor[];
  nodePluginTools: NodePluginToolDescriptor[];
  nodeSkills: NodeSkillDescriptor[];
  declaredPermissions?: Record<string, boolean>;
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  connectedAtMs: number;
  lastActiveAtMs?: number;
  presenceUpdatedAtMs?: number;
};
type PairingBoundNodeSession = NodeSession & {
  pairingIdentity: string;
};
/** Result payload returned from node.invoke. */
type NodeInvokeResult = {
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
/** Connectivity probe result for a registered node. */
type NodeConnectivityResult = {
  ok: true;
} | {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};
declare const SERIALIZED_EVENT_PAYLOAD: unique symbol;
type SerializedEventPayload = {
  readonly json: string;
  readonly [SERIALIZED_EVENT_PAYLOAD]: true;
};
/** Event transport for nodes that cannot keep a WebSocket open, such as watchOS. */
type NodeEventTransport = {
  send: (event: string, payload: unknown) => boolean;
  sendRaw: (event: string, payloadJSON?: SerializedEventPayload | null) => boolean;
  checkConnectivity?: (timeoutMs: number) => Promise<NodeConnectivityResult>;
};
type PairedDeviceNodeBindingSnapshot = PairedDeviceNodeBinding;
type NodeSessionRegistrationOptions = {
  remoteIp?: string | undefined;
  pairingIdentity: string;
  pairingGeneration?: string | undefined;
};
type NodeRegistryOptions = {
  listRegisteredNodePluginToolCommands?: (() => readonly RegisteredNodePluginToolCommand[] | undefined) | undefined;
  nodePluginToolsEnabled?: boolean;
  nodeSkillsEnabled?: boolean;
  resolveCurrentPairingState?: (nodeId: string) => Promise<PairedDeviceNodeBindingSnapshot | undefined>;
  isPairingStateCurrent?: (nodeId: string, expected: PairedDeviceNodeBinding) => boolean;
  onPairingGenerationChanged?: (params: {
    nodeId: string;
    previousPairingGeneration: string;
    nextPairingGeneration: string;
    preserveSessionState: boolean;
  }) => void;
  onPairingInvalidated?: (params: {
    nodeId: string;
    connId: string;
  }) => void;
};
/** Registry of currently connected Gateway nodes. */
declare class NodeRegistry {
  private readonly options;
  private nodesById;
  private nodesByConn;
  private eventTransportsByConn;
  private pendingInvokes;
  private invokeStreams;
  private authorizedSystemRunEvents;
  private pairingGenerationEventChains;
  constructor(options?: NodeRegistryOptions);
  private listConnectedSessions;
  private capturePairingLease;
  private currentSessionForLease;
  private settlePairingLease;
  private resolvePairingLease;
  private normalizePluginToolDescriptors;
  private replaceEffectiveNodePluginTools;
  refreshNodePluginTools(): void;
  /** Register a websocket client as the current connection for its node id. */
  register(client: GatewayWsClient, opts: NodeSessionRegistrationOptions): PairingBoundNodeSession;
  /** Register a node whose events are delivered by an HTTP polling transport. */
  registerTransport(client: GatewayWsClient, opts: NodeSessionRegistrationOptions, transport: NodeEventTransport): PairingBoundNodeSession;
  private registerSession;
  /** Unregister one connection and reject invokes tied to that connection. */
  unregister(connId: string): string | null;
  /** List connected node sessions. */
  listConnected(): NodeSession[];
  /** Filter connected sessions against an already-loaded pairing-state snapshot. */
  listConnectedForPairingStates(currentPairingStates: ReadonlyMap<string, PairedDeviceNodeBindingSnapshot>): NodeSession[];
  /** Reconcile connected sessions through the synchronous persistent-pairing owner. */
  listCurrentConnectedSync(): NodeSession[];
  /** Resolve persistent pairing state before projecting connected sessions. */
  listCurrentConnected(): Promise<NodeSession[]>;
  private invalidateSessionForPairingChange;
  /** Immediately retires one exact transport after its persisted pairing authority changes. */
  invalidateConnectionForPairingChange(connId: string, reason?: string): boolean;
  /** Return a connected node session by node id. */
  get(nodeId: string): NodeSession | undefined;
  private getRegisteredSession;
  /** Return only the session authenticated for the requested persistent pairing generation. */
  getForPairingGeneration(nodeId: string, pairingGeneration: string): NodeSession | undefined;
  private getRegisteredSessionForPairingGeneration;
  /** Revalidates that one inbound node connection still owns its persisted pairing state. */
  isConnectionCurrentPairingState(connId: string): Promise<boolean>;
  /** Updates recent input activity for the exact authenticated node connection. */
  updatePresenceActivity(params: {
    nodeId: string;
    connId?: string;
    idleSeconds: number;
    saturated?: boolean;
    observedAtMs?: number;
  }): NodeSession | null;
  /** Clears recent input activity for the exact authenticated node connection. */
  clearPresenceActivity(params: {
    nodeId: string;
    connId?: string;
  }): boolean | null;
  /** Returns the connected node with the freshest reported local input. */
  getActiveNode(connectedNodes?: readonly NodeSession[]): NodeSession | undefined;
  private publishActiveNodeContext;
  /** Probe websocket liveness with ping/pong when the socket supports it. */
  checkConnectivity(nodeId: string, timeoutMs?: number): Promise<NodeConnectivityResult>;
  updateNodePluginTools(nodeId: string, connId: string | undefined, tools: readonly NodePluginToolDescriptor[]): NodeSession | null;
  updateNodeSkills(nodeId: string, connId: string | undefined, skills: readonly NodeSkillDescriptor[]): NodeSession | null;
  updateSurface(nodeId: string, surface: {
    caps?: readonly string[];
    commands: readonly string[];
    permissions?: Record<string, boolean> | undefined;
  }, generationTransition?: {
    expectedConnId: string;
    expectedPairingIdentity: string;
    expectedPairingGeneration?: string;
    nextPairingGeneration: string;
  }): NodeSession | null;
  private clearPresenceIfAccessibilityUnavailable;
  invoke(params: {
    nodeId: string;
    expectedConnId?: string;
    expectedPairingGeneration?: string;
    command: string;
    params?: unknown;
    timeoutMs?: number;
    /** Inactivity deadline reset by each ordered progress chunk. */
    idleTimeoutMs?: number;
    onProgress?: (chunk: string) => void;
    signal?: AbortSignal;
    idempotencyKey?: string;
    sessionKey?: string;
    /** Receives the id after pairing validation and a successful dispatch. */
    onDispatchReady?: (invokeId: string) => void;
    /** Revalidates caller authority at the registry-owned transport handoff. */
    isDispatchAuthorized?: () => boolean;
  }): Promise<NodeInvokeResult>;
  /** Send one ordered input frame to a pending streaming invoke. */
  sendInvokeInput(invokeId: string, payload: unknown): void;
  handleInvokeProgress(params: NodeInvokeProgressParams): boolean;
  /** Re-enters only the root that owns this exact live node invocation. */
  runPendingInvokeContinuation<T>(params: {
    invokeId: string;
    nodeId: string;
    connId: string | undefined;
    run: () => Promise<T>;
  }): Promise<T> | null;
  /** Authorize an inbound system.run event against a recently issued node invoke. */
  authorizeSystemRunEvent(params: {
    nodeId: string;
    connId?: string;
    runId?: string;
    sessionKey: string;
    terminal: boolean;
  }): boolean;
  private rememberAuthorizedSystemRunEvent;
  private forgetAuthorizedSystemRunEvent;
  private authorizedSystemRunEventExpiresAt;
  private matchAuthorizedSystemRunEvent;
  private matchSingleAuthorizedSystemRunEvent;
  private authorizedSystemRunSessionMatches;
  private allowsLegacyMacRunIdFallback;
  private pruneAuthorizedSystemRunEvents;
  private authorizedSystemRunEventKey;
  handleInvokeResult(params: NodeInvokeResultParams): boolean;
  sendEvent(nodeId: string, event: string, payload?: unknown): boolean;
  sendEventRaw(nodeId: string, event: string, payloadJSON?: SerializedEventPayload | null): boolean;
  /** Sends command-free events only to the exact authenticated pairing connection. */
  sendEventForPairingIdentity(params: {
    nodeId: string;
    connId: string;
    pairingIdentity: string;
    event: string;
    payload?: unknown;
  }): Promise<boolean>;
  /** Sends only to a session that still owns the requested persistent pairing generation. */
  sendEventRawForPairingGeneration(nodeId: string, pairingGeneration: string, event: string, payloadJSON?: SerializedEventPayload | null): Promise<boolean>;
  private sendEventRawForPairingGenerationNow;
  private sendEventInternal;
  private sendEventRawInternal;
  private sendEventToSession;
  private observeEventSend;
  private isNodeWebSocketOpen;
  private rejectSlowNodeSocket;
}
//#endregion
//#region src/gateway/portals/portal-http-proxy.d.ts
type PortalTarget = {
  kind: "local";
  port: number;
} | {
  kind: "worker";
  environmentId: string;
  ownerEpoch: number;
  remotePort: number;
  connect: () => Promise<Duplex>;
};
//#endregion
//#region src/gateway/portals/portal-service.d.ts
type GatewayPortalOpenParams = {
  targetPort: number;
  target?: PortalTarget;
  /** Revalidated before metadata mutation or publication after asynchronous listener startup. */
  assertCurrent?: () => void;
  /** Ownership transfers to open; unused targets are released even when it rejects or reuses a portal. */
  onClose?: () => Promise<void> | void;
  origin?: string;
  title?: string;
  description?: string;
  path?: string;
};
type GatewayPortalService = {
  open: (params: GatewayPortalOpenParams) => Promise<PortalOpenResult>;
  list: () => PortalSummary[];
  listWorkerPortals: (environmentId: string, ownerEpoch: number) => PortalSummary[];
  close: (id: string, assertCurrent?: () => void) => Promise<void>;
  closeWorkerPortals: (environmentId: string, ownerEpoch?: number) => Promise<void>;
  closeAll: () => Promise<void>;
};
//#endregion
//#region src/gateway/question-manager.d.ts
type QuestionManagerRequest = {
  id?: string;
  questions: Question[];
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  timeoutMs: number;
  onResolved?: (event: QuestionResolvedEvent) => void;
};
/** Process-local lifecycle owner for pending questions. */
declare class QuestionManager {
  private readonly entries;
  request(params: QuestionManagerRequest): QuestionRecord;
  get(id: string): QuestionRecord | null;
  list(): QuestionRecord[];
  /** Re-enters only the still-pending question's original admitted root. */
  runPendingContinuation<T>(id: string, run: () => Promise<T>): Promise<T> | null;
  waitAnswer(id: string, timeoutMs?: number): Promise<QuestionWaitAnswerResult>;
  resolve(id: string, answers: QuestionAnswers, resolvedBy?: string): QuestionResolveResult;
  cancel(id: string, resolvedBy?: string): QuestionResolveResult;
  /** Clears all manager-owned timers and releases waiters. */
  reset(): void;
  private requireRecord;
  private requirePendingEntry;
  /** Validates answers against stored questions and returns them in canonical form. */
  private validateAnswers;
  private invalidAnswer;
  private notFound;
  private expire;
  private finish;
}
//#endregion
//#region src/gateway/server-channel-runtime.types.d.ts
/** Snapshot of channel runtime state keyed by channel and account id. */
type ChannelRuntimeSnapshot = {
  channels: Partial<Record<ChannelId$1, ChannelAccountSnapshot>>;
  channelAccounts: Partial<Record<ChannelId$1, Record<string, ChannelAccountSnapshot>>>;
};
type StartChannelOptions = {
  preserveRestartAttempts?: boolean;
  preserveManualStop?: boolean;
  deferAccountStartUntil?: Promise<void>;
  manual?: boolean;
};
//#endregion
//#region src/cron/scratch-store.d.ts
type CronJobScratch = {
  content: string;
  revision: number;
  sourceSha256?: string;
  updatedAtMs: number;
};
/**
 * Present scratch content plus the persisted revision. An unset scratch keeps a
 * tombstone row so `currentRevision` stays monotonic across unset/recreate and
 * stale compare-and-swap writers cannot resurrect old content.
 */
type CronJobScratchState = {
  currentRevision: number;
  scratch?: CronJobScratch;
};
type CronJobScratchWriteResult = {
  ok: true;
  currentRevision: number;
  scratch?: CronJobScratch;
} | {
  ok: false;
  reason: "revision-conflict";
  currentRevision: number;
};
//#endregion
//#region src/gateway/server-cron-contract.d.ts
type GatewayCronServiceContract = CronServiceContract & {
  /** Remove an owned declarative job family from obsolete SQLite store partitions. */
  removeStaleJobFamily(family: {
    declarationKey: string;
    name: string;
    ownerPluginTag: string;
  }): Promise<number>;
  readScratch(id: string): Promise<CronJobScratchState>;
  writeScratch(id: string, params: {
    content: string | null;
    expectedRevision?: number;
    sourceSha256?: string;
    commitGuard?: () => void;
  }): Promise<CronJobScratchWriteResult>;
  /** Serialize agent-job removal with the roster commit and restore on failure. */
  removeAgentJobsTransactional<T>(agentId: string, commit: () => Promise<T>): Promise<T>;
  /** Temporarily disarm ticks without running startup recovery on resume. */
  pauseScheduling(): void;
  resumeScheduling(): void;
  /** Scheduler-owned work not represented by active cron run markers. */
  getSuspensionBlockerCount?(): number;
  /** Materialize lazy cron dependencies before a synchronous operator wake. */
  prepareWake?(): Promise<void>;
  /** Stop cron and await scheduler-owned child process teardown. */
  stopAndDrain?(): Promise<void>;
};
//#endregion
//#region src/agents/internal-event-contract.d.ts
declare const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION: "task_completion";
declare const AGENT_INTERNAL_EVENT_SOURCES: readonly ["subagent", "cron", "image_generation", "video_generation", "music_generation"];
declare const AGENT_INTERNAL_EVENT_STATUSES: readonly ["ok", "timeout", "error", "unknown"];
type AgentInternalEventSource = (typeof AGENT_INTERNAL_EVENT_SOURCES)[number];
type AgentInternalEventStatus = (typeof AGENT_INTERNAL_EVENT_STATUSES)[number];
//#endregion
//#region src/agents/generated-attachments.d.ts
type AgentGeneratedAttachment = {
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
};
//#endregion
//#region src/agents/internal-events.d.ts
type AgentTaskCompletionInternalEvent = {
  type: typeof AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION;
  source: AgentInternalEventSource;
  childSessionKey: string;
  childSessionId?: string;
  announceType: string;
  taskLabel: string;
  status: AgentInternalEventStatus;
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
  replyInstruction: string;
};
/** Internal event variants that can be rendered into agent prompt context. */
type AgentInternalEvent = AgentTaskCompletionInternalEvent;
//#endregion
//#region src/gateway/server-methods/agent-request-types.d.ts
type AgentRunRequest = {
  message: string;
  agentId?: string;
  provider?: string;
  model?: string;
  to?: string;
  replyTo?: string;
  sessionId?: string;
  sessionKey?: string;
  expectedExistingSessionId?: string;
  thinking?: string;
  deliver?: boolean;
  attachments?: Array<{
    type?: string;
    mimeType?: string;
    fileName?: string;
    content?: unknown;
  }>;
  channel?: string;
  replyChannel?: string;
  accountId?: string;
  replyAccountId?: string;
  threadId?: string;
  groupId?: string;
  groupChannel?: string;
  groupSpace?: string;
  lane?: string;
  cwd?: string;
  extraSystemPrompt?: string;
  modelRun?: boolean;
  promptMode?: "full" | "minimal" | "none";
  bootstrapContextMode?: "full" | "lightweight";
  bootstrapContextRunKind?: "default" | "heartbeat" | "cron";
  acpTurnSource?: "manual_spawn";
  internalRuntimeHandoffId?: string;
  internalExecutionIdentityRetry?: boolean;
  internalExecutionIdentityRecoveryAttempt?: number;
  execApprovalFollowupExpectedSessionId?: string;
  internalEvents?: AgentInternalEvent[];
  suppressPromptPersistence?: boolean;
  sessionEffects?: "visible" | "internal";
  idempotencyKey: string;
  sourceReplyDeliveryMode?: "automatic" | "message_tool_only";
  disableMessageTool?: boolean;
  swarmCollector?: boolean;
  swarmOutputSchema?: Record<string, unknown>;
  forceRestartSafeTools?: boolean;
  forceCodeModeTools?: boolean;
  timeout?: number;
  bestEffortDeliver?: boolean;
  cleanupBundleMcpOnRunEnd?: boolean;
  label?: string;
  inputProvenance?: InputProvenance;
  workspaceDir?: string;
  voiceWakeTrigger?: string;
};
//#endregion
//#region src/gateway/server-instance-runtime.types.d.ts
type GatewayInstanceAgentDispatchOptions = {
  allowModelOverride?: boolean;
  allowSyntheticModelOverride?: boolean;
  allowSyntheticCronRunContinuation?: boolean;
  delegatedToolPolicyHandoff?: SubagentCompletionToolHandoffRegistration;
  expectFinal?: boolean;
  /** Instance-owned dispatch always uses a synthetic client. */
  forceSyntheticClient?: boolean;
  internalDeliveryMediaUrls?: string[];
  internalDeliverySuppressText?: boolean;
  onAccepted?: (payload: unknown) => void;
  onExecutionStarted?: () => void;
  onSignalAbort?: () => Promise<void> | void;
  scopes?: string[];
  signal?: AbortSignal;
  syntheticScopes?: string[];
};
type GatewayApprovalEventPublisher = {
  publishRequested: (kind: ChannelApprovalKind, request: unknown) => number;
  publishResolved: (kind: ChannelApprovalKind, resolved: unknown) => void;
};
type GatewayRecoveryRuntime = {
  abortAgent: (params: {
    agentId: string;
    runId: string;
    sessionKey: string;
  }, timeoutMs?: number) => Promise<{
    aborted?: boolean;
    runIds?: string[];
  }>;
  dispatchAgent: <T = unknown>(params: AgentRunRequest, timeoutMs?: number, options?: GatewayInstanceAgentDispatchOptions) => Promise<T>;
  waitForAgent: <T = unknown>(params: AgentWaitParams, timeoutMs?: number) => Promise<T>;
  sendRecoveryNotice: (params: {
    channel: string;
    to: string;
    accountId?: string;
    threadId?: string | number;
    text: string;
    idempotencyKey: string;
  }) => Promise<{
    /** True when delivery produced zero platform results (policy/channel suppression). */
    suppressed: boolean;
  }>;
};
//#endregion
//#region src/gateway/server-model-catalog.types.d.ts
type GatewayModelCatalogSnapshot = ModelCatalogSnapshot & {
  agentId: string;
  agentDir: string;
  catalogComplete: boolean;
  workspaceDir: string;
  config: OpenClawConfig;
};
//#endregion
//#region src/gateway/server-shared.d.ts
type DedupeEntry = {
  ts: number;
  ok: boolean;
  /** Optional effectful-request fingerprint for methods with caller-supplied operation ids. */
  requestIdentity?: string;
  payload?: unknown;
  error?: ErrorShape;
};
//#endregion
//#region src/gateway/server/event-loop-health.d.ts
type GatewayEventLoopHealthReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type GatewayEventLoopHealth = {
  degraded: boolean;
  degradedSinceMs: number | null;
  reasons: GatewayEventLoopHealthReason[];
  intervalMs: number;
  delayP99Ms: number;
  delayMaxMs: number;
  utilization: number;
  cpuCoreRatio: number;
};
//#endregion
//#region src/gateway/terminal/launch.d.ts
/** Why a terminal cannot open, or `null` when it can. */
type TerminalLaunchBlock = {
  kind: "disabled";
} | {
  kind: "owner-required";
  message: string;
} | {
  kind: "unknown-agent";
  agentId: string;
} | {
  kind: "sandboxed";
  agentId: string;
  mode: "all";
};
/** Resolved plan for a host terminal session. */
type TerminalLaunchPlan = {
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  initialCommand?: string[];
  cwdOverride?: string;
};
/** Terminal launch resolution result: either a runnable plan or a block reason. */
type TerminalLaunchResolution = {
  ok: true;
  plan: TerminalLaunchPlan;
} | {
  ok: false;
  block: TerminalLaunchBlock;
};
//#endregion
//#region src/infra/terminal-file-upload.d.ts
type TerminalUploadFile = {
  name: string;
  contentBase64: string;
};
type TerminalUploadResult = {
  path: string;
  size: number;
};
//#endregion
//#region src/process/terminal-pty.d.ts
/** Live PTY handle shared by gateway terminals and node-host commands. */
type TerminalPtyHandle = {
  pid: number;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  onData(listener: (chunk: string) => void): void;
  onExit(listener: (event: {
    exitCode: number;
    signal?: number;
  }) => void): void;
  kill(signal?: string): void;
};
declare function spawnTerminalPty(params: {
  file: string;
  args: string[];
  cwd?: string;
  env: Record<string, string>;
  cols: number;
  rows: number;
}): Promise<TerminalPtyHandle>;
//#endregion
//#region src/gateway/terminal/backend.d.ts
type TerminalBackendExit = {
  exitCode?: number;
  signal?: number;
  error?: string;
};
interface TerminalBackend {
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  kill(): void;
  onData(callback: (data: string) => void): void;
  onExit(callback: (exit: TerminalBackendExit) => void): void;
}
type LocalTerminalBackendSpawner = typeof spawnTerminalPty;
//#endregion
//#region src/gateway/terminal/session-manager.types.d.ts
type TerminalEventSink = (connId: string, event: string, payload: unknown) => void;
type AgentTerminalOwner = {
  kind: "agent";
  agentSessionKey: string;
  agentSessionId: string;
  agentId: string;
};
type TerminalOwner = {
  kind: "conn";
  connId: string;
} | AgentTerminalOwner;
type AgentTerminalSessionDrain = {
  drained: Promise<void>;
  hasWork(): boolean;
  release(): void;
};
type TerminalSessionManagerOptions = {
  emit: TerminalEventSink;
  getBufferedAmount?: (connId: string) => number | undefined;
  spawn?: LocalTerminalBackendSpawner;
  maxSessions?: number;
  env?: NodeJS.ProcessEnv;
  /** Detach grace; 0 preserves kill-on-disconnect. Gateway wiring owns its default. */
  detachGraceMs?: number;
  maxDetachedSessions?: number;
  scrollbackChars?: number;
};
type TerminalOpenRequest = {
  owner: TerminalOwner;
  /** Operator connection initially viewing an agent-owned session. */
  viewerConnId?: string;
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  cols: number;
  rows: number;
  env: Record<string, string>;
  /** Request-scoped cancellation; a late backend is killed before registration. */
  signal?: AbortSignal;
  createBackend?: () => Promise<TerminalBackend>;
  stageUpload?: (file: TerminalUploadFile) => Promise<TerminalUploadResult>;
};
type TerminalOpenOutcome = {
  ok: true;
  sessionId: string;
  agentId: string;
  cwd: string;
  shell: string;
} | {
  ok: false;
  code: "limit" | "spawn_failed" | "closed";
  message: string;
};
type TerminalAgentActionOutcome = {
  ok: true;
} | {
  ok: false;
  code: "session_unavailable" | "backend_failed";
};
//#endregion
//#region src/gateway/terminal/session-types.d.ts
type TerminalSessionSummary = {
  sessionId: string;
  agentId: string;
  shell: string;
  cwd: string;
  attached: boolean;
  owner: "conn" | `agent:${string}`;
  createdAtMs: number;
};
type TerminalAttachSummary = Omit<TerminalSessionSummary, "attached" | "owner" | "createdAtMs"> & {
  buffer: string;
  seq: number;
};
//#endregion
//#region src/gateway/terminal/session-manager.d.ts
/**
 * Tracks live PTY sessions keyed by session id, with a reverse index for
 * connection owners and viewers so disconnect cleanup stays bounded.
 */
declare class TerminalSessionManager {
  private readonly sessions;
  private readonly pendingOpens;
  private readonly agentSessionDrain;
  private readonly connections;
  private readonly emit;
  private readonly getBufferedAmount;
  private readonly spawn?;
  private readonly maxSessions;
  private readonly detachGraceMs;
  private readonly maxDetachedSessions;
  private readonly scrollbackChars;
  private opening;
  private spawning;
  constructor(options: TerminalSessionManagerOptions);
  /** Number of live sessions; used by tests and health surfaces. */
  get size(): number;
  /** Spawns a shell and wires its output/exit to its live connection recipients. */
  open(request: TerminalOpenRequest): Promise<TerminalOpenOutcome>;
  /** Writes client input to a session; returns false when the session is gone. */
  write(connId: string, sessionId: string, data: string): boolean;
  /** Writes agent input after proving exact agent-session ownership. */
  writeAgent(owner: AgentTerminalOwner, sessionId: string, data: string): TerminalAgentActionOutcome;
  private writeSession;
  /** Applies a new PTY grid size; returns false when the session is gone. */
  resize(connId: string, sessionId: string, cols: number, rows: number): boolean;
  /** Resizes an agent-owned PTY after proving exact agent-session ownership. */
  resizeAgent(owner: AgentTerminalOwner, sessionId: string, cols: number, rows: number): TerminalAgentActionOutcome;
  private resizeSession;
  /** Stages a file on the same host as an owned terminal session. */
  upload(connId: string, sessionId: string, file: TerminalUploadFile): Promise<TerminalUploadResult | undefined>;
  /** Closes one session on operator request. */
  close(connId: string, sessionId: string): boolean;
  /** Closes an agent-owned PTY after proving session-key ownership. */
  closeAgent(owner: AgentTerminalOwner, sessionId: string): TerminalAgentActionOutcome;
  /** Closes every live or spawning PTY bound to one exact terminal task. */
  closeTaskSessions(taskId: string): number;
  /** Fences and closes one durable agent-session incarnation through archive commit. */
  beginAgentSessionDrain(owner: AgentTerminalOwner): AgentTerminalSessionDrain;
  /**
   * Rebinds a connection-owned session, or co-attaches a viewer to an
   * agent-owned session. Operator-to-operator attach remains take-over; only
   * agent-owned sessions gain shared viewers.
   */
  attach(connId: string, sessionId: string): TerminalAttachSummary | undefined;
  /** Every live session, oldest first; all admin connections see the same list. */
  list(): TerminalSessionSummary[];
  /** Raw buffered output for one session, or undefined when it is gone. */
  snapshot(sessionId: string): string | undefined;
  /** Raw buffer for an agent-owned session, guarded by the caller session key. */
  snapshotAgent(owner: AgentTerminalOwner, sessionId: string): string | undefined;
  /** Live sessions owned by one agent tool caller. */
  listAgent(owner: AgentTerminalOwner): TerminalSessionSummary[];
  private trackPendingOpen;
  private hasAgentSessionWork;
  private resolveAgentSessionDrainIfIdle;
  private openAbortMessage;
  private untrackPendingOpen;
  /**
   * Handles a dropped connection: detaches its sessions for later reattach
   * when a grace period is configured, otherwise kills them (legacy behavior,
   * still selected by detachedSessionTimeoutSeconds: 0).
   */
  handleDisconnect(connId: string): void;
  /** Closes live and pending sessions whose agent no longer permits a host shell. */
  closeDisallowedAgents(isAllowed: (agentId: string) => boolean): void;
  /** Parks a session ownerless with a reaper; PTY output keeps buffering. */
  private detach;
  private enforceDetachedCap;
  /**
   * Tears down every session — detached ones included — on gateway
   * shutdown/stop. Silent because the sockets are going away anyway (disabling
   * the terminal is a `gateway` restart, so that path also runs through here,
   * not a live notification).
   */
  disposeAll(): void;
  /**
   * Claims the longest-idle agent-owned session as an eviction candidate when
   * the pool is exhausted. Viewer-attached and connection-owned sessions are
   * never evicted; an idle viewer-free background job losing its PTY under
   * pressure is the accepted tradeoff for keeping the pool available. Claimed
   * sessions are skipped so concurrent opens select distinct victims.
   */
  private claimLongestIdleAgentSession;
  private removeViewer;
  private interactiveSession;
  /** Agents may operate only PTYs created by their exact trusted session key. */
  private agentOwnedSession;
  private markSharedSessionAdopted;
  private finalize;
}
//#endregion
//#region src/realtime-transcription/provider-types.d.ts
type RealtimeTranscriptionProviderId = string;
type RealtimeTranscriptionProviderConfig = Record<string, unknown>;
type RealtimeTranscriptionProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeTranscriptionProviderConfig;
};
type RealtimeTranscriptionProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Callback hooks emitted by realtime transcription sessions. */
type RealtimeTranscriptionSessionCallbacks = {
  onPartial?: (partial: string) => void;
  onTranscript?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onError?: (error: Error) => void;
};
/** Inputs passed to a provider when creating a transcription session. */
type RealtimeTranscriptionSessionCreateRequest = RealtimeTranscriptionSessionCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Runtime control surface for a realtime transcription session. */
type RealtimeTranscriptionSession = {
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  close(): void;
  isConnected(): boolean;
};
//#endregion
//#region src/plugins/host-hooks.d.ts
/** Reason passed to plugin cleanup callbacks when host-owned state changes. */
type PluginHostCleanupReason = "disable" | "reset" | "delete" | "restart";
type PluginSessionExtensionProjectionContext = {
  sessionKey: string;
  sessionId?: string;
  state: PluginJsonValue | undefined;
};
/** Session extension registration owned by a plugin namespace. */
type PluginSessionExtensionRegistration = {
  namespace: string;
  description: string;
  project?: (ctx: PluginSessionExtensionProjectionContext) => PluginJsonValue | undefined;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
  }) => void | Promise<void>;
  /**
   * When set, after every successful `patchSessionExtension` the projected
   * value is mirrored to `SessionEntry[<slotKey>]` so non-plugin readers
   * can consume the typed slot without reaching into
   * `pluginExtensions[pluginId][namespace]`.
   *
   * The slot is a read-only mirror: writes always go through
   * `patchSessionExtension`; the host overwrites the slot value on every
   * subsequent patch.
   */
  sessionEntrySlotKey?: string;
  /**
   * Optional JSON-compatible schema describing the projected slot value.
   * Purely informational at this layer; clients may use it to validate the
   * mirrored slot against a contract.
   */
  sessionEntrySlotSchema?: PluginJsonValue;
};
type PluginToolPolicyDecision = PluginHookBeforeToolCallResult | {
  allow?: boolean;
  reason?: string;
};
type PluginTrustedToolPolicyRegistration = {
  id: string;
  description: string;
  matcher?: PluginToolMatcher;
  evaluate: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => PluginToolPolicyDecision | void | Promise<PluginToolPolicyDecision | void>;
};
type PluginToolMetadataRegistration = {
  toolName: string;
  displayName?: string;
  description?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};
type PluginControlUiTabGroup = "control" | "agent";
type PluginControlUiDescriptor = {
  id: string;
  /** "tab" adds a sidebar tab; "widget" advertises a trusted dashboard renderer. */
  surface: "session" | "tool" | "run" | "settings" | "tab" | "widget";
  label: string;
  description?: string;
  /** Bundled plugins may claim their matching native route as `route:<pluginId>`. */
  placement?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  /** Icon name hint for tab descriptors; unknown names fall back to a generic icon. */
  icon?: string;
  /**
   * Gateway HTTP path (e.g. /plugins/<id>/panel) rendered in a sandboxed frame
   * when the Control UI has no bundled view for this tab.
   */
  path?: string;
  /** Sidebar group for tab descriptors; defaults to "control". */
  group?: PluginControlUiTabGroup;
  /** Sort order among plugin tabs; lower renders first. */
  order?: number;
};
type PluginSessionActionContext = {
  pluginId: string;
  actionId: string;
  sessionKey?: string;
  agentId?: string;
  payload?: PluginJsonValue;
  client?: {
    connId?: string;
    scopes: string[];
  };
};
type PluginSessionActionResult = {
  ok?: true;
  result?: PluginJsonValue;
  reply?: PluginJsonValue;
  continueAgent?: boolean;
} | {
  ok: false;
  error: string;
  code?: string;
  details?: PluginJsonValue;
};
type PluginSessionActionRegistration = {
  id: string;
  description?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  handler: (ctx: PluginSessionActionContext) => PluginSessionActionResult | void | Promise<PluginSessionActionResult | void>;
};
type PluginRuntimeLifecycleRegistration = {
  id: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
  }) => void | Promise<void>;
};
type PluginAgentEventSubscriptionRegistration = {
  id: string;
  description?: string;
  streams?: AgentEventStream[];
  handle: (event: AgentEventPayload, ctx: {
    getRunContext: <T extends PluginJsonValue = PluginJsonValue>(namespace: string) => T | undefined;
    setRunContext: (namespace: string, value: PluginJsonValue) => void;
    clearRunContext: (namespace?: string) => void;
  }) => void | Promise<void>;
};
type PluginAgentEventEmitParams = {
  runId: string;
  stream: AgentEventStream;
  data: PluginJsonValue;
  sessionKey?: string;
};
type PluginAgentEventEmitResult = {
  emitted: true;
  stream: AgentEventStream;
} | {
  emitted: false;
  reason: string;
};
type PluginRunContextPatch = {
  runId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};
type PluginRunContextGetParams = {
  runId: string;
  namespace: string;
};
type PluginSessionSchedulerJobRegistration = {
  id: string;
  sessionKey: string;
  kind: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey: string;
    jobId: string;
  }) => void | Promise<void>;
};
type PluginSessionSchedulerJobHandle = {
  id: string;
  pluginId: string;
  sessionKey: string;
  kind: string;
};
type PluginSessionAttachmentFile = {
  path: string;
};
type PluginAttachmentChannelHints = {
  parseMode?: "HTML";
  silent?: boolean;
  /** Require host detection to match this MIME before forcing document delivery. */
  forceDocumentMime?: string;
  threadId?: string | number;
  /** @deprecated Put portable attachment hints directly on `channelHints`. */
  telegram?: {
    parseMode?: "HTML";
    disableNotification?: boolean;
    /**
     * Require host-side detection to match this MIME before forcing document delivery.
     * Mismatched files are rejected before the outbound adapter is called.
     */
    forceDocumentMime?: string;
  };
  /** @deprecated Use `channelHints.threadId`. */
  slack?: {
    threadTs?: string;
  };
};
type PluginSessionAttachmentCaptionFormat = "plain" | "html" | "markdown";
type PluginSessionAttachmentParams = {
  sessionKey: string;
  files: PluginSessionAttachmentFile[];
  text?: string;
  threadId?: string | number;
  forceDocument?: boolean;
  maxBytes?: number;
  captionFormat?: PluginSessionAttachmentCaptionFormat;
  channelHints?: PluginAttachmentChannelHints;
};
type PluginSessionAttachmentResult = {
  ok: true;
  channel: string;
  deliveredTo: string;
  count: number;
} | {
  ok: false;
  error: string;
};
type PluginSessionTurnScheduleCommonParams = {
  sessionKey: string;
  message: string;
  agentId?: string;
  deliveryMode?: "none" | "announce";
  name?: string;
  /** Optional cleanup tag. Reserved cron-name delimiters like `:` are rejected. */
  tag?: string;
};
type PluginSessionTurnScheduleParams = ({
  at: string | number | Date;
  deleteAfterRun?: boolean;
} & PluginSessionTurnScheduleCommonParams) | ({
  delayMs: number;
  deleteAfterRun?: boolean;
} & PluginSessionTurnScheduleCommonParams) | ({
  cron: string;
  tz?: string;
  deleteAfterRun?: false;
} & PluginSessionTurnScheduleCommonParams);
type PluginSessionTurnUnscheduleByTagParams = {
  sessionKey: string;
  tag: string;
};
type PluginSessionTurnUnscheduleByTagResult = {
  removed: number;
  failed: number;
};
//#endregion
//#region src/plugins/capability-provider.types.d.ts
/** JSON-compatible provider settings for one configured worker profile. */
type WorkerProfile = Readonly<Record<string, PluginJsonValue>>;
/** Provider-authored picker metadata for one machine class or exact machine type. */
type WorkerMachineOption = Readonly<{
  id: string;
  label: string;
  cpu?: number;
  memoryGb?: number;
  default?: boolean;
}>;
/** SSH endpoint material returned by a worker provider after provisioning. */
type WorkerSshEndpoint = {
  host: string;
  port: number;
  /**
   * Up to 10 ordered unique integer ports (1..65535) after `port`; excludes the primary.
   * Core rotates only for idempotent probes, content-addressed transfers, receipt/lock-guarded
   * artifact installation, convergent managed-worktree mirroring, and tunnel reconnects.
   * Ambiguous unguarded stateful commands fail closed and are not replayed.
   */
  fallbackPorts?: readonly number[];
  user: string;
  /** OpenSSH public host-key line obtained from trusted provisioning output. */
  hostKey: string;
  /** Secret reference only; providers must never return plaintext key material. */
  keyRef: SecretRef;
};
/** Resolved SSH client identity. Providers may return a local path or ephemeral material. */
type WorkerSshIdentity = {
  kind: "path";
  path: string;
} | {
  kind: "material";
  contents: string;
};
/** Durable context supplied when a worker provider resolves the identity it minted. */
type WorkerSshIdentityRequest = {
  leaseId: string;
  profile: WorkerProfile;
  keyRef: SecretRef;
};
/** Closed set of applications installed and launchable on a provisioned worker desktop. */
type WorkerDesktopApp = {
  id: "browser";
  executablePath: string;
  cdpPort: number;
} | {
  id: "terminal";
  executablePath: string;
};
/** Optional interactive desktop endpoint provisioned with the lease (warm-time capability). */
type WorkerDesktopEndpoint = {
  /** Desktop service protocol on the worker loopback; "rfb" is the only phase-1 value. */
  protocol: "rfb";
  /** Loopback port on the worker (e.g. 5900). */
  port: number;
  /** Absolute on-box path to the per-lease password file; read by the owning transport, never persisted as plaintext. */
  passwordFilePath?: string;
  /** Closed application metadata advertised by the provider for this desktop. */
  apps?: WorkerDesktopApp[];
};
/** Placement execution modes a worker provider can carry. */
type WorkerExecutionMode = "worker-turn" | "remote-exec";
/** Replay-safe node enrollment prepared only after a provider has allocated its machine. */
type WorkerNodeEnrollment = {
  openclawVersion: string;
  packageSpecs: readonly string[];
  displayName: string;
  /** Gateway shutdown cancels enrollment without releasing its replay-owned provider lease. */
  signal?: AbortSignal;
  waitForDeviceId: () => Promise<string>;
} & ({
  mode: "connect";
  setupCode: string;
  setupId: string;
} | {
  mode: "resume";
  deviceId: string;
});
/** Durable lease identity and endpoint returned by a successful provision operation. */
type WorkerLease = {
  leaseId: string;
  /** The SSH account also owns processes unrelated to this worker lease. */
  sharedHost?: boolean;
  desktop?: WorkerDesktopEndpoint;
} & ({
  ssh: WorkerSshEndpoint;
  node?: never;
} | {
  node: {
    deviceId: string;
  };
  ssh?: never;
});
/** Authoritative inspection result for an already-known worker lease. */
type WorkerLeaseStatus = {
  status: "active";
  /** Explicit provider fact used to reconcile leases persisted before this metadata existed. */
  sharedHost?: boolean;
} | {
  status: "dormant";
} | {
  status: "destroyed";
} | {
  status: "unknown";
};
/** Cloud-worker lifecycle capability shared by plugin and internal providers. */
type WorkerProvider$1 = {
  id: string;
  /** Process-stable choices available for this profile; omit the hook to hide machine selection. */
  listMachineOptions?: (profile: WorkerProfile) => Promise<readonly WorkerMachineOption[]>;
  /** Omission advertises no placement support; multiple modes use their canonical order. */
  supportedExecutionModes?: readonly [WorkerExecutionMode] | readonly ["worker-turn", "remote-exec"];
  /**
   * Provision before preparing an installation when the lease transport decides whether an
   * installation is needed. Defaults to false so SSH providers retain prepare-before-allocation.
   */
  provisionBeforeInstallation?: boolean;
  /** Provider allocates a node host through the environment-owned enrollment callback. */
  requiresNodeEnrollment?: boolean;
  /**
   * Provision or adopt the lease for this operation id.
   * Repeating the same operation id must be idempotent across gateway restarts.
   */
  provision: (profile: WorkerProfile, operationId: string, options?: {
    executionMode?: WorkerExecutionMode;
    machineClass?: string;
    beginNodeEnrollment?: () => Promise<WorkerNodeEnrollment>;
  }) => Promise<WorkerLease>;
  /** Maximum core wait for one provision attempt, including provider-owned setup and cleanup. */
  resolveProvisionTimeoutMs?: (profile: WorkerProfile) => number;
  /** Throws on transient/indeterminate failures; `unknown` means authoritative absence. */
  inspect: (lease: {
    leaseId: string;
    profile: WorkerProfile;
  }) => Promise<WorkerLeaseStatus>;
  /**
   * Resolves provider-owned dynamic identities. When absent, the gateway uses its generic
   * SecretRef resolver; when present, failures are authoritative and never fall back.
   */
  resolveSshIdentity?: (request: WorkerSshIdentityRequest) => Promise<WorkerSshIdentity>;
  renew?: (leaseId: string) => Promise<void>;
  /** Idempotent; resolves only after the provider can prove teardown. */
  destroy: (lease: {
    leaseId: string;
    profile: WorkerProfile;
  }) => Promise<void>;
};
/** Speech capability registered by a plugin. */
type SpeechProviderPlugin$1 = {
  id: SpeechProviderId;
  label: string;
  aliases?: string[];
  autoSelectOrder?: number;
  /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  defaultModel?: string;
  models?: readonly string[];
  voices?: readonly string[];
  resolveConfig?: (ctx: SpeechProviderResolveConfigContext) => SpeechProviderConfig;
  parseDirectiveToken?: (ctx: SpeechDirectiveTokenParseContext) => SpeechDirectiveTokenParseResult;
  resolveTalkConfig?: (ctx: SpeechProviderResolveTalkConfigContext) => SpeechProviderConfig;
  resolveTalkOverrides?: (ctx: SpeechProviderResolveTalkOverridesContext) => SpeechProviderConfig | undefined;
  prepareSynthesis?: (ctx: SpeechProviderPrepareSynthesisContext) => SpeechProviderPreparedSynthesis | undefined | Promise<SpeechProviderPreparedSynthesis | undefined>;
  isConfigured: (ctx: SpeechProviderConfiguredContext) => boolean;
  synthesize: (req: SpeechSynthesisRequest) => Promise<SpeechSynthesisResult>;
  streamSynthesize?: (req: SpeechSynthesisStreamRequest) => Promise<SpeechSynthesisStreamResult>;
  synthesizeTelephony?: (req: SpeechTelephonySynthesisRequest) => Promise<SpeechTelephonySynthesisResult>;
  listVoices?: (req: SpeechListVoicesRequest) => Promise<SpeechVoiceOption[]>;
};
/** Realtime transcription capability registered by a plugin. */
type RealtimeTranscriptionProviderPlugin$1 = {
  id: RealtimeTranscriptionProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[];
  autoSelectOrder?: number;
  resolveConfig?: (ctx: RealtimeTranscriptionProviderResolveConfigContext) => RealtimeTranscriptionProviderConfig;
  isConfigured: (ctx: RealtimeTranscriptionProviderConfiguredContext) => boolean;
  createSession: (req: RealtimeTranscriptionSessionCreateRequest) => RealtimeTranscriptionSession;
};
/** Transcript source capability registered by a channel or meeting plugin. */
type TranscriptSourceProvider$1 = TranscriptSourceProvider$2;
/** Realtime voice capability registered by a plugin. */
type RealtimeVoiceProviderPlugin$1 = {
  id: RealtimeVoiceProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[];
  /** Known speaker voices for pickers; providers still accept free-form values. */
  voices?: readonly string[];
  autoSelectOrder?: number;
  capabilities?: RealtimeVoiceProviderCapabilities;
  resolveConfig?: (ctx: RealtimeVoiceProviderResolveConfigContext) => RealtimeVoiceProviderConfig;
  isConfigured: (ctx: RealtimeVoiceProviderConfiguredContext) => boolean;
  createBridge: (req: RealtimeVoiceBridgeCreateRequest) => RealtimeVoiceBridge;
  createBrowserSession?: (req: RealtimeVoiceBrowserSessionCreateRequest) => Promise<RealtimeVoiceBrowserSession>;
};
type MediaUnderstandingProviderPlugin$1 = MediaUnderstandingProvider;
type ImageGenerationProviderPlugin$1 = ImageGenerationProvider;
type VideoGenerationProviderPlugin$1 = VideoGenerationProvider;
type MusicGenerationProviderPlugin$1 = MusicGenerationProvider;
//#endregion
//#region src/worker/tool-authority.d.ts
declare const WORKER_TOOL_NAMES: readonly ["read", "write", "edit", "apply_patch", "exec", "process", "browser", "sessions_spawn", "sessions_send", "github_publish", "portal"];
type WorkerToolName = (typeof WORKER_TOOL_NAMES)[number];
type WorkerToolAuthority = {
  allowedToolNames: WorkerToolName[];
};
//#endregion
//#region src/worker/launch-descriptor.d.ts
type WorkerBrowserLaunchDescriptor = {
  cdpUrl: string;
  launcherPath: string;
};
type WorkerLaunchPermissionContext = {
  permissionMode: SessionPermissionMode;
  workerContainmentRoot: string;
} | {
  permissionMode?: never;
  workerContainmentRoot?: never;
};
type WorkerLaunchAssignment = WorkerLaunchPermissionContext & {
  /** Host placement namespace used for worker-local policy, hooks, and audit attribution. */
  agentId: string;
  operationalRunInstance: OperationalRunInstanceRef;
  /** Opaque host-signed runtime envelope; worker code never parses private identity. */
  agentRuntimeIdentityToken: string;
  runId: string;
  turnId: string;
  prompt: string;
  suppressPromptTranscript: boolean;
  workspaceDir: string;
  modelRef: WorkerInferenceModelRef;
  inferenceOptions: WorkerInferenceOptions;
  systemPrompt?: string;
  initialMessages: WorkerTranscriptMessage[];
  transcript: {
    baseLeafId: WorkerTranscriptCommitParams["baseLeafId"];
    nextSeq: number;
  };
  liveEvents: {
    ackedSeq: number;
    nextSeq: number;
  };
  toolAuthority: WorkerToolAuthority;
  browser?: WorkerBrowserLaunchDescriptor;
};
type WorkerLaunchAdmission = Omit<WorkerConnectParams["admission"], "runId"> & {
  sessionId: string;
};
type WorkerLaunchPlan = {
  version: 4;
  admission: WorkerLaunchAdmission;
  assignment: WorkerLaunchAssignment;
};
//#endregion
//#region src/worker/node-workspace-transfer-protocol.d.ts
type NodeWorkerWorkspaceTransferInput = {
  direction: "download";
  token: string;
  manifestRef: string;
} | {
  direction: "upload";
  token: string;
  baseManifestRef: string;
};
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-core.d.ts
type WorkerWorkspaceApplyResult = {
  manifestRef: string;
  manifest: WorkerWorkspaceManifest;
  conflictPaths: string[];
  verifyLocalStable(): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/tunnel-contract.d.ts
type WorkerTunnelRequest = {
  environmentId: string;
  ownerEpoch: number;
};
type WorkerWorkspaceCommand = {
  argv: readonly string[];
  transportRetry: "idempotent" | "never";
  onDispatchReady?: () => void;
  input?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  transfer?: NodeWorkerWorkspaceTransferInput;
};
type WorkerWorkspaceSyncRequest = {
  localPath: string;
  sessionId: string;
  generation: number;
  gitAuthor?: {
    name?: string;
    email?: string;
  };
};
type WorkerWorkspaceSyncResult = {
  mode: "git" | "plain";
  remoteWorkspaceDir: string;
  manifestRef: string;
};
type WorkerWorkspaceReconcileRequest = {
  localPath: string;
  remoteWorkspaceDir: string;
  baseManifestRef: string;
  journal: WorkerWorkspaceReconciliationJournalAdapter;
  stagedResult?: {
    ref: string;
    record(ref: string): void;
  };
};
type WorkerWorkspaceReconcileResult = {
  manifestRef: string;
  changed: boolean;
  /** Re-read the remote workspace after local acceptance, immediately before teardown. */
  verifyStable(): Promise<void>;
  /** Re-read the accepted local result after the remote stability fence. */
  verifyLocalStable(): Promise<void>;
  /** Apply the prepared candidate locally without making it restart-authoritative. */
  applyPreparedStagedResult?(): Promise<void>;
  /** Return the accepted local manifest and any keep-local conflicts after apply. */
  getAppliedWorkspaceResult?(): WorkerWorkspaceApplyResult | undefined;
  /** Publish the verified candidate for restart recovery. */
  publishStagedResult?(): Promise<void>;
  discardPreparedStagedResult?(): Promise<void>;
};
type WorkerWorkspaceQuiescence = {
  /** Prove the watchdog lease still owns stopped processes and extend it through teardown. */
  assertActive(): Promise<void>;
  /** Resume only the remote processes stopped by this quiescence owner. */
  resume(): Promise<void>;
};
type WorkerTurnLaunchRequest = {
  plan: WorkerLaunchPlan;
  turnClaim: WorkerSessionTurnClaim;
  timeoutMs?: number;
  credentialExpiresAtMs?: number;
  signal?: AbortSignal;
  onDispatchReady?: () => void;
};
type WorkerWorkspaceTunnelHandle = {
  environmentId: string;
  ownerEpoch: number;
  launchTurn?: never;
  runWorkspaceCommand(command: WorkerWorkspaceCommand): Promise<SpawnResult>;
  quiesceWorkspace(remoteWorkspaceDir: string): Promise<WorkerWorkspaceQuiescence>;
  syncWorkspace(request: WorkerWorkspaceSyncRequest): Promise<WorkerWorkspaceSyncResult>;
  reconcileWorkspace(request: WorkerWorkspaceReconcileRequest): Promise<WorkerWorkspaceReconcileResult>;
  stop(): Promise<void>;
};
type WorkerTurnTunnelHandle = Omit<WorkerWorkspaceTunnelHandle, "launchTurn"> & {
  launchTurn(request: WorkerTurnLaunchRequest): Promise<SpawnResult>;
};
type WorkerTunnelHandle = WorkerWorkspaceTunnelHandle | WorkerTurnTunnelHandle;
//#endregion
//#region src/gateway/worker-environments/service-contract.d.ts
/** Non-secret worker projection available to Gateway request handlers. */
type WorkerEnvironmentServiceRecord = {
  environmentId: string;
  providerId: string;
  leaseId: string | null;
  nodeDeviceId?: string | null;
  sharedHost: boolean | null;
  state: WorkerEnvironmentState;
  ownerEpoch: number;
  createdAtMs: number;
  idleSinceAtMs: number | null;
  attachedSessionIds: readonly string[];
  desktopAvailable: boolean;
  desktopApps: readonly WorkerDesktopApp["id"][];
  tunnelStatus: WorkerTunnelStatus;
  error?: string;
};
type WorkerDesktopObserveResult = {
  transport: "rfb";
  wsPath: string;
  expiresAtMs: number;
  control: boolean;
  vncPassword?: string;
};
type WorkerDesktopLaunchResult = {
  app: WorkerDesktopApp["id"];
  status: "ready";
};
/** Request-facing lifecycle methods, kept separate from persistence and provider internals. */
type WorkerEnvironmentServiceContract = {
  list(): WorkerEnvironmentServiceRecord[];
  get(environmentId: string): WorkerEnvironmentServiceRecord | undefined;
  supportsExecutionMode?(profileId: string, mode: WorkerPlacementExecutionMode): boolean;
  listMachineOptions(profileId: string): Promise<readonly WorkerMachineOption[] | undefined>;
  create(profileId: string, idempotencyKey: string, machineClass?: string, executionMode?: WorkerPlacementExecutionMode): Promise<WorkerEnvironmentServiceRecord>;
  destroy(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  destroyUnattached(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  observeDesktop(request: {
    environmentId: string;
    control: boolean;
  }): Promise<WorkerDesktopObserveResult>;
  launchDesktopApp(request: {
    environmentId: string;
    app: WorkerDesktopApp["id"];
  }): Promise<WorkerDesktopLaunchResult>;
  startTunnel(request: WorkerTunnelRequest): Promise<WorkerTunnelHandle>;
  stopTunnel(environmentId: string, ownerEpoch?: number): Promise<void>;
};
type WorkerPlacementDispatchRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
  profileId: string;
  executionMode: WorkerPlacementExecutionMode;
  devicePlacement?: DevicePlacementRequirement;
  idempotencyKey?: string;
  deviceId?: string;
  machineClass?: string;
  inheritedProfile?: {
    providerId: string;
    profileSnapshot: WorkerProfile;
  };
};
type WorkerPlacementReclaimRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
};
type WorkerPlacementMoveRequest = WorkerPlacementReclaimRequest & {
  source: WorkerPlacementMoveSource;
  target: WorkerPlacementMoveTarget;
  abandonSource?: true;
};
/** Closure-bound request authority; in-process only and never part of durable placement intent. */
type WorkerPlacementAuthorization = () => void;
type WorkerPlacementDispatchContract = {
  dispatch(request: WorkerPlacementDispatchRequest, onTransition?: (placement: WorkerSessionPlacementRecord) => void, authorize?: WorkerPlacementAuthorization): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "active";
  }>>;
  move?(request: WorkerPlacementMoveRequest, onTransition?: (placement: WorkerSessionPlacementRecord) => void, authorize?: WorkerPlacementAuthorization): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "local" | "active";
  }>>;
  reclaim?(request: WorkerPlacementReclaimRequest, authorize?: WorkerPlacementAuthorization, beforeDrain?: WorkerPlacementAuthorization): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "local" | "reclaimed";
  }>>;
  forceDestroyEnvironment?(environmentId: string, onCleanupError?: (error: unknown) => void): Promise<WorkerEnvironmentServiceRecord>;
  reconcileActive?(environmentId?: string): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/placement-projector.d.ts
type WorkerSessionPlacementReader = {
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
  getPlacementMoves?(sessionIds: readonly string[]): ReadonlyMap<string, WorkerPlacementMoveIntent>;
};
type WorkerPlacementDiskSpaceReader = {
  read(record: WorkerSessionPlacementRecord): SessionPlacementDiskSpace | undefined;
  version(): number;
};
type WorkerPlacementRunnerAvailabilityReader = {
  read(record: WorkerSessionPlacementRecord): SessionPlacementRunner | undefined;
  version(): number;
};
//#endregion
//#region src/gateway/server-methods/chat-metadata-contract.d.ts
type ChatMetadataSessionEntry = {
  authProfileOverride?: string;
  authProfileOverrideSource?: "auto" | "user";
  authProfileOverrideCompactionCount?: number;
};
type ChatMetadataReadParams = {
  agentId: string;
  sessionEntry?: ChatMetadataSessionEntry;
};
type ChatMetadataResult = {
  commands?: unknown[];
  models?: unknown[];
  swarmEnabled: boolean;
};
//#endregion
//#region src/gateway/server-methods/chat-startup-projection-contract.d.ts
type ChatStartupProjectionReadParams = {
  agentId: string;
  sessionEntry?: ChatMetadataSessionEntry;
};
type ChatStartupProjectionResult = {
  metadata: ChatMetadataResult;
  sessionModelCatalog: ModelCatalogEntry[];
  defaultModelCatalog: ModelCatalogEntry[];
};
//#endregion
//#region src/gateway/server-methods/session-creation-provenance.d.ts
type TrustedSessionCreation = {
  via: SessionCreatedVia;
  actor?: SessionCreatedActor;
  /** Creator-owned isolation requirement resolved only by the trusted Gateway boundary. */
  sandbox?: "required";
  /** Exact spawning session retained separately from the stable actor identity. */
  requesterSessionKey?: string;
  /** Immutable completion recipient for a spawn-owned visible session. */
  completionOwnerSessionKey?: string;
  /** Effective caller tool-policy snapshot for an in-process visible spawn. */
  inheritedToolPolicy?: {
    version: 1;
    allow: string[];
    deny: string[];
  };
};
//#endregion
//#region src/gateway/server-methods/shared-types.d.ts
/**
 * Shared gateway request types used by every server-method module.
 */
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
/** Trusted in-process spawn control plane that already owns this run's task row.
    Gateway CLI tracking only covers runs nobody else records, so a marked run
    must never get a second row. */
type GatewayAgentRunTaskOwner = "plugin_subagent" | "native_subagent";
/** Caller identity captured by a built-in agent tool before trusted in-process dispatch. */
type TrustedAgentToolCaller = Readonly<{
  agentId: string;
  sessionKey: string;
}>;
/** Closure-bound streaming hooks attached only to trusted plugin-owned synthetic clients. */
type GatewayNodeInvokeStream = {
  onProgress: (chunk: string) => void;
  onDispatchReady: (invokeId: string) => void;
  idleTimeoutMs?: number;
  isRuntimeCurrent: () => boolean;
};
/** Per-connection client metadata captured after the gateway handshake. */
type GatewayClient = {
  connect: ConnectParams;
  connId?: string;
  presenceKey?: string;
  clientIp?: string;
  /** Client id verified against the server-approved device pairing record. */
  pairedClientId?: string;
  authenticatedUserId?: string;
  /** Verified Tailscale provider identity; generic proxy identities must not infer this. */
  authenticatedUserIsTailscaleProvider?: boolean;
  authenticatedGitHubIdentitySync?: AuthenticatedGitHubIdentitySync;
  authenticatedUserProfile?: {
    profileId: string;
    displayName: string | null;
    avatarRevision?: string;
    hasAvatar: boolean;
    updatedAt: number;
  };
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, {
    capability: string;
    expiresAtMs: number;
  }>;
  isDeviceTokenAuth?: boolean;
  internal?: {
    /** Handshake-attested direct-local transport; never accepted from wire params. */
    isLocalClient?: true;
    /** Marks the server-constructed client used by trusted in-process dispatch. */
    syntheticClient?: true;
    /** Host-owned role authority retained separately from an autonomous run principal. */
    operatorRoleActor?: GatewayOperatorRoleActor;
    /** Overrides persisted sender attribution without changing the authorizing client identity. */
    senderAttribution?: {
      id: string;
      name?: string;
    };
    /** Trusted session creation provenance; never accepted from Gateway wire params. */
    sessionCreation?: TrustedSessionCreation;
    /** Trusted built-in agent tool caller; never accepted from Gateway wire params. */
    agentToolCaller?: TrustedAgentToolCaller;
    allowModelOverride?: boolean;
    approvalRuntime?: boolean;
    cronRunContinuation?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
    pluginRuntimeOwnerId?: string;
    /** Plugin-owned in-process invoke hooks; never accepted from Gateway wire params. */
    nodeInvokeStream?: GatewayNodeInvokeStream;
    agentRunTracking?: GatewayAgentRunTaskOwner;
    /** Host-captured requester lineage for opt-in plugin subagent completion delivery. */
    pluginSubagentRequester?: PluginSubagentRequesterContext;
    /** Host-owned exact media set for a scoped automatic recovery delivery. */
    internalDeliveryMediaUrls?: string[];
    internalDeliverySuppressText?: boolean;
    /** Plugin-owned tools authorized for this internal subagent run. */
    runtimePluginToolGrant?: RuntimePluginToolGrant;
    /** Host-owned exact tool cap for a tracked plugin subagent run. */
    pluginSubagentToolsAllow?: string[];
    /** Opaque in-process subagent-completion capability; never accepted from wire params. */
    delegatedToolPolicyHandoffId?: string;
  };
};
/** Callback used by method handlers to emit one protocol response frame. */
type RespondFn = (ok: boolean, payload?: unknown, error?: ErrorShape, meta?: Record<string, unknown>) => void;
/** Minimal hosted OpenClaw contract retained by the gateway request router. */
/**
 * Structural mirror of the engine's SystemAgentAssistantTurn. Kept local as a
 * leaf contract: importing the assistant module here closes a madge cycle
 * through the agents/config cluster.
 */
type SystemAgentHistoryTurn = {
  role: "user" | "assistant";
  text: string;
};
type GatewaySystemAgentSession = {
  engine: {
    handle: (message: string, options?: {
      uiContext?: {
        page: string;
      };
    }) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    answerWizard: (answer: WizardAnswer) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    cancelWizard: (cancel: SystemAgentWizardCancel) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    decorateRejoinReply: (reply: {
      text: string;
      action: "none";
    }) => {
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      wizardInputPending?: boolean;
      question?: SystemAgentChatQuestion;
      step?: WizardStep;
    };
    seedHistory: (turns: readonly SystemAgentHistoryTurn[]) => void;
    historyLength: () => number;
    historySince: (index: number) => SystemAgentHistoryTurn[];
    getPendingOperatorProposal: () => {
      operation: SystemAgentOperation;
      hash: string;
    } | null;
    resolveOperatorApproval: (decision: "allow-once" | "allow-always" | "deny" | null, proposalHash: string) => Promise<unknown>;
    dispose: () => Promise<void>;
  };
  welcome: string;
  welcomeQuestion?: SystemAgentChatQuestion;
  /** Audit cursor captured with the pending caretaker welcome; cleared after delivery. */
  welcomeAuditSequence?: number;
  lastUsedAt: number;
  ownerKey: string;
  pendingApproval?: {
    id: string;
    proposalHash: string;
  };
};
/** Kernel-owned services and state that can be constructed without binding sockets. */
type GatewayKernelContext = {
  deps: CliDeps;
  /** Host-bound plugin ingress; the transport owns its shared hook dispatch queue. */
  dispatchHookAgentTurn?: (pluginId: string, params: Parameters<PluginRuntimeCore["hooks"]["dispatchHookAgentTurn"]>[0]) => ReturnType<PluginRuntimeCore["hooks"]["dispatchHookAgentTurn"]>;
  configRevisionProjector: GatewayConfigRevisionProjector;
  cron: GatewayCronServiceContract;
  cronStorePath: string;
  getRuntimeConfig: () => OpenClawConfig;
  /** Prepared listener certificate pin; undefined when Gateway TLS is disabled. */
  gatewayTlsFingerprint?: string;
  sessionCompanion?: SessionCompanionService;
  sessionObserver?: SessionObserverService;
  resolveTerminalLaunchPolicy: (agentId?: string) => TerminalLaunchResolution;
  isTerminalEnabled: () => boolean;
  execApprovalManager?: ExecApprovalManager;
  questionManager?: QuestionManager;
  scopeUpgradeCoordinator?: ScopeUpgradeCoordinator;
  /** Cancels durable approvals owned by one actively aborted run. */
  cancelRunBoundApprovals?: (runId: string) => number;
  pluginApprovalManager?: ExecApprovalManager<PluginApprovalRequestPayload>;
  systemAgentApprovalManager?: ExecApprovalManager<SystemAgentApprovalRequestPayload>;
  forwardPluginApprovalRequest?: (request: PluginApprovalRequest$1) => Promise<boolean>;
  pluginApprovalIosPushDelivery?: {
    handleRequested?: (request: PluginApprovalRequest$1, opts?: {
      isTargetVisible?: (target: {
        deviceId: string;
        scopes: readonly string[];
      }) => boolean;
    }) => Promise<boolean>;
    handleExpired?: (request: PluginApprovalRequest$1) => Promise<void>;
  };
  listSessionPendingApprovals?: (sessionKey: string, client: GatewayClient | null) => SessionApprovalReplay;
  loadGatewayModelCatalog: (params?: {
    agentId?: string;
    agentDir?: string;
    readOnly?: boolean;
    workspaceDir?: string;
  }) => Promise<ModelCatalogEntry[]>;
  loadGatewayModelCatalogSnapshot: (params?: {
    agentId?: string;
    agentDir?: string;
    readOnly?: boolean;
    workspaceDir?: string;
  }) => Promise<GatewayModelCatalogSnapshot>;
  readPreparedGatewayModelCatalog?: (params?: {
    agentId?: string;
    agentDir?: string;
    workspaceDir?: string;
  }) => Promise<ModelCatalogEntry[] | undefined>;
  readChatMetadata: (params: ChatMetadataReadParams) => Promise<ChatMetadataResult>;
  readChatStartupProjection?: (params: ChatStartupProjectionReadParams) => Promise<ChatStartupProjectionResult | undefined>;
  getHealthCache: () => HealthSummary | null;
  logHealth: {
    error: (message: string) => void;
  };
  logGateway: SubsystemLogger;
  incrementPresenceVersion: () => number;
  getHealthVersion: () => number;
  /** Instance-local native approval subscribers; never derived from a network client. */
  approvalEvents?: GatewayApprovalEventPublisher;
  recoveryRuntime?: GatewayRecoveryRuntime;
  enforceSharedGatewayAuthGenerationForConfigWrite?: (nextConfig: OpenClawConfig) => void;
  nodeRegistry: NodeRegistry;
  agentRunSeq: Map<string, number>;
  chatAbortControllers: Map<string, ChatAbortControllerEntry>;
  /** Cancel identities for turns waiting in the followup/collect queue. */
  chatQueuedTurns: Map<string, QueuedChatTurnEntry>;
  chatRunState: ChatRunState;
  addChatRun: (sessionId: string, entry: ChatRunRegistration) => void;
  removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  dedupe: Map<string, DedupeEntry>;
  wizardSessions: Map<string, WizardSession>;
  systemAgentSessions: Map<string, GatewaySystemAgentSession>;
  findRunningWizard: () => string | null;
  purgeWizardSession: (id: string) => void;
  wizardRunner: (opts: OnboardOptions, runtime: RuntimeEnv, prompter: WizardPrompter) => Promise<void>;
  channelWizardRunner: ChannelSetupWizardRunner;
  unavailableGatewayMethods?: ReadonlySet<string>;
};
/** Socket-bound services and connection state supplied by the Gateway transports. */
type GatewayTransportContext = {
  portalService?: GatewayPortalService;
  getMcpAppSandboxPort?: () => number | undefined;
  ensureSandboxHostPort?: () => Promise<number>;
  broadcast: GatewayBroadcastFn;
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  getClientConnIds?: (filter?: (client: GatewayClient) => boolean) => ReadonlySet<string>;
  nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
  nodeSendToAllSubscribed: (event: string, payload: unknown) => void;
  nodeSubscribe: (nodeId: string, sessionKey: string, connId?: string) => void;
  nodeUnsubscribe: (nodeId: string, sessionKey: string, connId?: string) => void;
  nodeUnsubscribeAll: (nodeId: string) => void;
  hasConnectedTalkNode: () => Promise<boolean>;
  isConnectionActive?: (connId: string) => boolean;
  /** Server-stamped activity from an accepted request on the exact live person connection. */
  recordClientActivity?: (client: GatewayClient | null) => void;
  hasExecApprovalClients?: (excludeConnId?: string) => boolean;
  getApprovalClientConnIds?: <TPayload>(params?: {
    approvalKind?: "exec" | "plugin" | "system-agent";
    excludeConnId?: string;
    filter?: (client: GatewayClient, record?: ExecApprovalRecord<TPayload>) => boolean;
    record?: ExecApprovalRecord<TPayload>;
  }) => ReadonlySet<string>;
  disconnectClientsForDevice?: (deviceId: string, opts?: {
    role?: string;
  }) => void;
  disconnectClientsForUserProfile?: (profileId: string) => void;
  invalidateClientsForDevice?: (deviceId: string, opts?: {
    role?: string;
    reason?: string;
  }) => void;
  hasConnectedClientsForDevice?: (deviceId: string) => boolean;
  refreshConnectedUserProfile?: (profile: {
    id: string;
    displayName: string | null;
    avatarRevision: string;
    hasAvatar: boolean;
    updatedAt: number;
  }) => void;
  disconnectClientsUsingSharedGatewayAuth?: () => void;
  terminalSessions?: TerminalSessionManager;
  subscribeSessionEvents: (connId: string) => void;
  unsubscribeSessionEvents: (connId: string) => void;
  subscribeSessionMessageEvents: (connId: string, sessionKey: string, opts?: {
    includeApprovals?: boolean;
    provisional?: boolean;
  }) => ((() => void) & {
    commit: () => void;
  }) | undefined;
  unsubscribeSessionMessageEvents: (connId: string, sessionKey: string) => void;
  unsubscribeAllSessionEvents: (connId: string) => void;
  getSessionEventSubscriberConnIds: () => ReadonlySet<string>;
  registerToolEventRecipient: (runId: string, connId: string) => void;
};
/** Resident-owned services bridged into request handling by the server lifecycle. */
type GatewayResidentBridgeContext = {
  getGatewayMethodRegistry?: () => GatewayMethodRegistry;
  controlUiSessionPullRequests?: ReturnType<typeof createControlUiSessionPullRequestSubscriptions>;
  sessionViewerPresence?: ReturnType<typeof createSessionViewerPresenceDeclarations>;
  notifyPluginMetadataChanged: () => void;
  refreshHealthSnapshot: (opts?: {
    probe?: boolean;
    includeSensitive?: boolean;
  }) => Promise<HealthSummary>;
  /** Durable cloud-worker lifecycle; absent from lightweight in-process contexts. */
  workerEnvironmentService?: WorkerEnvironmentServiceContract;
  /** Gateway-host desktop acquisition and observation; present only after enabled startup. */
  hostDesktopService?: HostDesktopService;
  /** Durable per-session worker placement; absent only from lightweight in-process contexts. */
  workerSessionPlacementService?: WorkerSessionPlacementReader & Partial<WorkerSessionPlacementRetirementService>;
  /** Process-local health samples fenced to the exact active placement owner. */
  workerPlacementDiskSpaceReader?: WorkerPlacementDiskSpaceReader;
  /** Process-current paired-device runner proof for active placement projection. */
  workerPlacementRunnerAvailabilityReader?: WorkerPlacementRunnerAvailabilityReader;
  /** Use-time approval authority validation over the live run/worker owners. */
  validateAgentRuntimeApprovalAuthority?: AgentRuntimeApprovalAuthorityValidator;
  /** One-way local-to-worker dispatch; absent when cloud workers are disabled. */
  workerPlacementDispatchService?: WorkerPlacementDispatchContract;
  githubPublicationService?: GitHubPublicationCoordinator;
  githubOAuthService?: ReturnType<typeof createGitHubOAuthLifecycle>;
  getRuntimeSnapshot: () => ChannelRuntimeSnapshot;
  getEventLoopHealth?: () => GatewayEventLoopHealth | undefined;
  getConfigReloaderHotReloadStatus?: () => GatewayHotReloadStatus | undefined;
  startChannel: (channel: ChannelId$1, accountId?: string, opts?: StartChannelOptions) => Promise<void>;
  stopChannel: (channel: ChannelId$1, accountId?: string) => Promise<void>;
  markChannelLoggedOut: (channelId: ChannelId$1, cleared: boolean, accountId?: string) => void;
  broadcastVoiceWakeChanged: (triggers: string[]) => void;
  broadcastVoiceWakeRoutingChanged: (config: VoiceWakeRoutingConfig) => void;
};
/** Complete runtime context available to gateway request handlers. */
type GatewayContextResolver = () => GatewayRequestContext | undefined;
type GatewayRequestContext = GatewayKernelContext & GatewayTransportContext & GatewayResidentBridgeContext & {
  /** Live instance routing only; never authorization or wire state. */
  resolveGatewayContext?: GatewayContextResolver;
};
/** Commit-time guard captured by the pre-dispatch session participation check. */
type SessionMutationAuthorization = {
  assertCurrent: () => void;
  assertTargetCurrent: (target: {
    sessionKey: string;
    agentId?: string;
  }) => void;
};
/** Normalized method invocation options passed to registered handlers. */
type GatewayRequestHandlerOptions = {
  req: RequestFrame;
  params: Record<string, unknown>;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
  sessionMutationCommitGuard?: () => void;
  sessionMutationAuthorization?: SessionMutationAuthorization;
  /** In-process caller lifetime; absent for ordinary transport requests. */
  signal?: AbortSignal;
};
/** Single gateway method implementation. */
type GatewayRequestHandler = (opts: GatewayRequestHandlerOptions) => Promise<void> | void;
/** Registry fragment keyed by gateway protocol method name. */
type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;
//#endregion
//#region src/hooks/internal-hook-types.d.ts
type InternalHookEventType = "command" | "session" | "agent" | "gateway" | "message";
interface InternalHookEvent {
  /** The type of event (command, session, agent, gateway, etc.) */
  type: InternalHookEventType;
  /** The specific action within the type (e.g., 'new', 'reset', 'stop') */
  action: string;
  /** The session key this event relates to */
  sessionKey: string;
  /** Additional context specific to the event */
  context: Record<string, unknown>;
  /** Timestamp when the event occurred */
  timestamp: Date;
  /** Messages to send back to the user (hooks can push to this array) */
  messages: string[];
}
type InternalHookHandler = (event: InternalHookEvent) => Promise<void> | void;
//#endregion
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
  homepage?: string;
  /** Events this hook handles (e.g., ["command:new", "session:start"]) */
  events: string[];
  /** Optional export name (default: "default") */
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
//#region src/tasks/task-registry.types.d.ts
/** JSON value shape persisted with runtime-owned task detail. */
type JsonValue = null | boolean | number | string | JsonValue[] | {
  [key: string]: JsonValue;
};
/** Runtime families that own task run lifecycles. */
declare const TASK_RUNTIMES: readonly ["subagent", "acp", "cron", "cli"];
declare const TASK_STATUSES: readonly ["queued", "running", "succeeded", "failed", "timed_out", "cancelled", "lost"];
type TaskRuntime = (typeof TASK_RUNTIMES)[number];
type TaskStatus = (typeof TASK_STATUSES)[number];
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
  warning?: string;
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
  cleanupAfter?: number;
  /** Tool invocations observed on this run's agent-event stream. */
  toolUseCount?: number;
  /** Name of the most recent tool invocation observed for this run. */
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
//#region src/plugins/board-widget-content-kind.types.d.ts
/** Plugin-owned source kind rendered through the board's sandboxed document host. */
type PluginBoardWidgetContentKind = {
  /** Agent-facing kind, for example `diagram`. Must be globally unique. */
  kind: string;
  /** Short label shown in dashboard chrome. */
  label: string;
  /** Capability-scoped static resources used by the composed document. */
  resources: {
    surface: string;
    paths: string[];
  };
  /** Reject malformed or unsupported source before it reaches persistent storage. */
  validateSource: (source: string) => void;
  /** Build the untrusted document body; core adds the canonical bridge and CSP shell. */
  composeDocument: (params: {
    source: string;
    title: string;
    resourceUrls: Readonly<Record<string, string>>;
    promptGranted: boolean;
  }) => string;
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
//#region src/plugins/config-activation-shared.d.ts
type PluginActivationSource = "disabled" | "explicit" | "auto" | "default";
//#endregion
//#region src/agents/agent-settings.d.ts
declare const DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR = 20000;
//#endregion
//#region src/agents/memory-search.d.ts
type ResolvedMemorySearchConfig = {
  enabled: boolean;
  rememberAcrossConversations: boolean;
  /** Sources indexed by the manager. */
  sources: Array<"memory" | "sessions">;
  /** Sources searched when memory_search omits an explicit corpus. */
  searchSources: Array<"memory" | "sessions">;
  extraPaths: MemoryExtraPath[];
  multimodal: MemoryMultimodalSettings;
  provider: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
    nonBatchConcurrency?: number;
    batch?: {
      enabled: boolean;
      wait: boolean;
      concurrency: number;
      pollIntervalMs: number;
      timeoutMinutes: number;
    };
  };
  experimental: {
    sessionMemory: boolean;
  };
  fallback: string;
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
  local: {
    modelPath?: string;
    modelCacheDir?: string;
    contextSize?: number | "auto";
  };
  store: {
    driver: "sqlite";
    databasePath: string;
    fts: {
      tokenizer: "unicode61" | "trigram";
    };
    vector: {
      enabled: boolean;
      extensionPath?: string;
    };
  };
  chunking: {
    tokens: number;
    overlap: number;
  };
  sync: {
    onSessionStart: boolean;
    onSearch: boolean;
    watch: boolean;
    watchDebounceMs: number;
    intervalMinutes: number;
    embeddingBatchTimeoutSeconds: number | undefined;
    sessions: {
      deltaBytes: number;
      deltaMessages: number;
      postCompactionForce: boolean;
    };
  };
  query: {
    maxResults: number;
    minScore: number;
    hybrid: {
      enabled: boolean;
      vectorWeight: number;
      textWeight: number;
      candidateMultiplier: number;
      mmr: {
        enabled: boolean;
        lambda: number;
      };
      temporalDecay: {
        enabled: boolean;
        halfLifeDays: number;
      };
    };
  };
  cache: {
    enabled: boolean;
    maxEntries?: number;
  };
};
declare function resolveMemorySearchConfig(cfg: OpenClawConfig, agentId: string): ResolvedMemorySearchConfig | null;
//#endregion
//#region packages/media-core/src/mime.d.ts
/** Detects the best MIME type from bytes, file path, and header metadata. */
declare function detectMime(opts: {
  buffer?: Buffer;
  headerMime?: string | null;
  additionalMimeHints?: readonly (string | null | undefined)[];
  filePath?: string;
}): Promise<string | undefined>;
//#endregion
//#region src/plugins/memory-embedding-provider-runtime.d.ts
/** Lists registered memory embedding provider adapters without registry metadata. */
declare function listRegisteredMemoryEmbeddingProviderAdapters(): MemoryEmbeddingProviderAdapter[];
/** Lists memory embedding providers from runtime config and registered adapters. */
declare function listMemoryEmbeddingProviders(cfg?: OpenClawConfig): MemoryEmbeddingProviderAdapter[];
/** Resolves one memory embedding provider by id, alias, or configured API owner. */
declare function getMemoryEmbeddingProvider(id: string, cfg?: OpenClawConfig): MemoryEmbeddingProviderAdapter | undefined;
//#endregion
//#region src/plugins/memory-state.d.ts
declare function registerMemoryCapability(requestedPluginId: string, capability: MemoryPluginCapability): void;
declare function listMemoryCorpusSupplements(): MemoryCorpusSupplementRegistration[];
declare function clearMemoryPluginState(): void;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-http.d.ts
/** POST JSON and retry provider 429/5xx failures with bounded backoff. */
declare function postJsonWithRetry<T>(params: {
  url: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  retryImpl?: typeof retryAsync;
  body: unknown;
  errorPrefix: string;
}): Promise<T>;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-utils.d.ts
/** Minimal HTTP client config needed by batch providers. */
type BatchHttpClientConfig = {
  baseUrl?: string;
  headers?: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
};
/** Normalize batch API base URLs by removing one trailing slash. */
declare function normalizeBatchBaseUrl(client: BatchHttpClientConfig): string;
/** Build request headers, preserving caller auth and controlling JSON/form content type. */
declare function buildBatchHeaders(client: Pick<BatchHttpClientConfig, "headers">, params: {
  json: boolean;
}): Record<string, string>;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-upload.d.ts
/** Upload embedding batch requests and return the provider file id. */
declare function uploadBatchJsonlFile(params: {
  client: BatchHttpClientConfig;
  requests: unknown[];
  errorPrefix: string;
  maxResponseBytes?: number;
  signal?: AbortSignal;
}): Promise<string>;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-chunk-limits.d.ts
/**
 * Split text-only chunks to the provider's effective input limit.
 *
 * Structured multimodal chunks are preserved because only the provider can decide how to count
 * non-text parts.
 */
declare function enforceEmbeddingMaxInputTokens(provider: EmbeddingProvider, chunks: MemoryChunk[], hardMaxInputTokens?: number): MemoryChunk[];
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-client.d.ts
/** Provider id used for remote embedding auth and config lookup. */
type RemoteEmbeddingProviderId = string;
/** Whether provider-owned embedding credentials belong to the selected destination. */
declare function embeddingProviderOwnsDestination(params: {
  baseUrl: string;
  providerBaseUrl: string;
}): boolean;
/** Append an embedding endpoint without changing its destination-owned query. */
declare function resolveEmbeddingEndpointUrl(baseUrl: string, endpoint: string): string;
/** Resolve base URL, bearer headers, header overrides, and SSRF policy for remote embeddings. */
declare function resolveRemoteEmbeddingBearerClient(params: {
  provider: RemoteEmbeddingProviderId;
  options: EmbeddingProviderCreateOptions;
  defaultBaseUrl: string;
}): Promise<{
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
}>;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-provider.d.ts
/** HTTP client details required by a remote embedding provider. */
type RemoteEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  model: string;
};
/** Create an EmbeddingProvider backed by a remote embeddings endpoint. */
declare function createRemoteEmbeddingProvider(params: {
  id: string;
  client: RemoteEmbeddingClient;
  errorPrefix: string;
  maxInputTokens?: number;
  /** Keep query arrays in one request when the provider has no query/document wire distinction. */
  batchQueryInputs?: boolean;
}): EmbeddingProvider;
/** Resolve a normalized remote embedding client from provider config and model options. */
declare function resolveRemoteEmbeddingClient(params: {
  provider: RemoteEmbeddingProviderId;
  options: EmbeddingProviderCreateOptions;
  defaultBaseUrl: string;
  normalizeModel: (model: string) => string;
}): Promise<RemoteEmbeddingClient>;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-fetch.d.ts
/** POST an embedding request and return validated vectors in request order. */
declare function fetchRemoteEmbeddingVectors(params: {
  url: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  signal?: AbortSignal;
  body: unknown;
  errorPrefix: string;
}): Promise<number[][]>;
//#endregion
//#region packages/memory-host-sdk/src/host/remote-http.d.ts
/** Build an SSRF allow policy from a configured remote base URL. */
declare const buildRemoteBaseUrlPolicy: (baseUrl: string) => SsrFPolicy | undefined;
/** Execute a remote HTTP request under SSRF guard and always release the response handle. */
declare function withRemoteHttpResponse<T>(params: {
  url: string;
  init?: RequestInit;
  signal?: AbortSignal;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  fetchWithSsrFGuardImpl?: typeof fetchWithSsrFGuard;
  shouldUseEnvHttpProxyForUrlImpl?: typeof shouldUseEnvHttpProxyForUrl;
  auditContext?: string;
  onResponse: (response: Response) => Promise<T>;
}): Promise<T>;
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
type MemoryEmbeddingProvider = EmbeddingProvider;
type MemoryEmbeddingProviderCreateOptions = Omit<EmbeddingProviderCreateOptions, "local"> & {
  fallback?: string;
  local?: NonNullable<EmbeddingProviderCreateOptions["local"]> & {
    contextSize?: number | "auto";
  };
};
type MemoryEmbeddingProviderCreateResult = Omit<EmbeddingProviderCreateResult, "runtime"> & {
  runtime?: MemoryEmbeddingProviderRuntime;
};
type MemoryEmbeddingProviderAdapter = Omit<EmbeddingProviderAdapter, "create"> & {
  autoSelectPriority?: number;
  allowExplicitWhenConfiguredAuto?: boolean;
  supportsMultimodalEmbeddings?: (params: {
    model: string;
  }) => boolean;
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
};
type MemoryFlushPlanResolver = (params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
  contextWindowTokens?: number;
}) => MemoryFlushPlan | null;
type RegisteredMemorySearchManager = Omit<MemorySearchManager, "readFile"> & {
  readFile(params: Parameters<MemorySearchManager["readFile"]>[0]): Promise<LegacyMemoryReadResult | MemoryReadResult>;
};
type MemoryRuntimeBackendConfig = {
  backend: "builtin";
};
type MemoryPluginRuntime = {
  getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
    /** Request a read-only source freshness scan; runtimes may ignore unsupported diagnostics. */
    inspectSources?: boolean;
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
  }): MemoryRuntimeBackendConfig;
  /** Authorize raw hits before caller-visible use; absent runtimes must not expose session hits. */
  authorizeSearchHits?(params: {
    cfg: OpenClawConfig;
    agentId: string;
    requesterSessionKey: string | undefined;
    sandboxed: boolean;
    hits: MemorySearchResult[];
  }): Promise<MemorySearchResult[]>;
  classifyWorkspaceMemoryPaths?(params: {
    cfg: OpenClawConfig;
    agentId: string;
    workspaceDir: string;
    relativePaths: string[];
  }): Promise<Array<{
    relativePath: string;
    originClass: MemoryOriginClass;
  }>>;
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
  /** Local deterministic recall tool required by provider-owned direct lookup. */
  deterministicRecallToolName?: string;
  /** Whether recall may read protected same-agent private session transcripts. */
  supportsPrivateTranscriptRecall?: boolean;
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
//#region src/gateway/worker-environments/session-placement-lifecycle.d.ts
type SessionWorkerPlacementContext = {
  workerEnvironmentService?: Pick<WorkerEnvironmentServiceContract, "get">;
  workerPlacementDispatchService?: Pick<WorkerPlacementDispatchContract, "reclaim">;
  workerSessionPlacementService?: Pick<WorkerSessionPlacementStore, "getMany"> & Partial<Pick<WorkerSessionPlacementStore, "retireSessionPlacement">>;
};
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
  breakPreference?: "paragraph" | "newline" | "sentence";
  /** When true, prefer \n\n paragraph boundaries once minChars has been satisfied. */
  flushOnParagraph?: boolean;
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
  workdirRoots?: readonly string[];
  /** Approved read-only skill mounts that may be selected as an exec workdir. */
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
//#region src/auto-reply/heartbeat-tool-response.d.ts
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
  nextCheck?: string;
  /** Complete replacement for the current heartbeat monitor's private scratch. */
  scratch?: string;
};
//#endregion
//#region src/agents/accepted-session-spawn.d.ts
type AcceptedSessionSpawn = {
  runId: string;
  childSessionKey: string;
};
//#endregion
//#region src/agents/agent-run-terminal-receipt.d.ts
type AgentRunTerminalModelRef = {
  provider: string;
  model: string;
};
type AgentRunTerminalReceipt = {
  runId: string;
  sessionId: string;
  turnId: string;
  requested: AgentRunTerminalModelRef;
  effective: AgentRunTerminalModelRef & {
    responseModel: string;
  };
  successfulToolNames: string[];
  rerouted: boolean;
  terminalDisposition: "visible" | "not-visible";
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
  hasRichContent?: true;
  /** Current-source progress (`false`) or completed reply (`true`). */
  sourceReplyFinal?: boolean;
};
type MessagingToolSourceReplyPayload = Pick<ReplyPayload, "audioAsVoice" | "channelData" | "interactive" | "mediaUrl" | "mediaUrls" | "presentation" | "text"> & {
  idempotencyKey?: string;
  transcriptOwner?: true;
  /** Current-source progress (`false`) or completed reply (`true`). */
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
  toolFilter?: McpServerToolFilterConfig;
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
  tools: McpCatalogTool[];
  /** Listed tools hidden only by the session override, retained for read-only inventory. */
  sessionDeniedTools?: McpCatalogTool[];
  diagnostics?: readonly McpToolCatalogDiagnostic[];
};
type McpToolCatalogDiagnostic = {
  serverName: string;
  safeServerName: string;
  launchSummary: string;
  message: string;
};
//#endregion
//#region src/agents/mcp-ui-resource.d.ts
type McpAppChannelView = {
  viewId: string;
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
//#endregion
//#region src/agents/embedded-agent-runner/types.d.ts
type BlockReplyFlushContext = {
  /** Boundary that requested the flush. */
  reason: "message_end" | "terminal";
} | {
  /** Tool boundary separating pre-tool narration from the eventual answer. */
  reason: "tool_start";
  assistantMessageIndex: number;
} | {
  /** Pre-compaction delivery is safe only for a completed assistant attempt. */
  reason: "pre_compaction";
  attemptAccepted: boolean;
};
type EmbeddedAgentUsage = Omit<NormalizedUsage, "contextUsage">;
type EmbeddedAgentMeta = {
  sessionId: string;
  sessionFile?: string;
  provider: string;
  model: string;
  contextTokens?: number;
  contextTokensSource?: "runtime" | "runtime-configured" | "resolved";
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
  usage?: EmbeddedAgentUsage;
  /** Terminal cumulative usage reserved for turn-level diagnostics. */
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
  codeModeEngaged?: boolean;
  /** Completed assistant/provider round trips accumulated across run attempts. */
  assistantTurns?: number;
  /**
   * Code-mode/tool-search inner bridge calls for the run's catalog. These are
   * invisible to the provider; `toolSummary.calls` stays the outer count.
   */
  bridgeCalls?: {
    search: number;
    describe: number;
    call: number;
  };
  /** Estimated USD cost of the run's accumulated usage. Omitted when the model has no cost data. */
  costUsd?: number;
  terminalReceipt?: Omit<AgentRunTerminalReceipt, "terminalDisposition">;
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
type EmbeddedRunTerminalToolFailure = {
  source: "tool";
  toolName: "exec" | "wait";
  code: "UNKNOWN_TOOL_ID";
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
  /** An exact, successfully settled tool batch intentionally completed the turn without a reply. */
  intentionalTerminalCompletion?: "tool-batch";
  terminalReply?: AgentRunTerminalReplySnapshot;
  yielded?: boolean;
  /** Explicit user-facing waiting status supplied to sessions_yield. */
  yieldAcknowledgment?: string;
  error?: {
    kind: "context_overflow" | "compaction_failure" | "role_ordering" | "image_size" | "retry_limit" | "incomplete_turn" | "hook_block";
    message: string;
    /** True only when model fallback can retry this terminal error without repeating side effects. */
    fallbackSafe?: boolean;
    /** True when the payload includes a trusted structured terminal tool summary. */
    terminalPresentation?: boolean;
  };
  failureSignal?: EmbeddedRunFailureSignal;
  /** Bounded, sanitized unresolved Code Mode failure for operator diagnostics. */
  terminalToolFailure?: EmbeddedRunTerminalToolFailure;
  /** Stop reason for the agent run (e.g., "completed", "tool_calls"). */
  stopReason?: string;
  /** Pending tool calls when stopReason is "tool_calls". */
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
    isReasoning?: boolean;
    /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
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
  reason?: string;
  /** Structured failure metadata used by model fallback classification. */
  failure?: {
    reason?: string;
    status?: number;
    code?: string;
    rawError?: string;
  };
  result?: {
    /** Identifies summaryless provider compaction in RPC and UI consumers. */
    kind?: "server-endpoint";
    /** Server-endpoint compaction has no transcript summary or first-kept entry. */
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
//#region src/agents/exec-auto-reviewer.d.ts
/** Config for the optional model-backed exec reviewer. */
type ExecReviewerConfig = {
  model?: AgentModelConfig;
  timeoutMs?: number;
};
//#endregion
//#region src/agents/github-tool-identity.d.ts
type PreparedGitHubToolEnvironment = Readonly<{
  credentialScrubEnv: Readonly<Record<string, string>>;
  localIdentityEnv: Readonly<Record<string, string>>;
  excludedStoreNames: readonly string[];
  /** A local process must retain the host-selected profile and author identity. */
  managedLocalIdentity: boolean;
}>;
//#endregion
//#region src/agents/bash-tools.exec-types.d.ts
/** Runtime defaults passed into exec/process tool factories. */
type ExecToolDefaults = {
  hasCronTool?: boolean;
  host?: ExecTarget;
  mode?: ExecMode;
  bypassHostApprovalFloors?: boolean;
  security?: ExecSecurity;
  ask?: ExecAsk;
  trigger?: string;
  node?: string;
  /** Default working directory for node-host execution only. */
  nodeCwd?: string;
  pathPrepend?: string[];
  safeBins?: string[];
  strictInlineEval?: boolean;
  commandHighlighting?: boolean;
  safeBinTrustedDirs?: string[];
  safeBinProfiles?: Record<string, SafeBinProfileFixture>;
  reviewer?: ExecReviewerConfig;
  config?: OpenClawConfig;
  /** Host-prepared non-secret environment and store projection exclusions. */
  preparedRunEnvironment?: PreparedGitHubToolEnvironment;
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
  /** Immutable session policy that forbids execution outside its provisioned sandbox. */
  sandboxRequired?: boolean;
  elevated?: ExecElevatedDefaults;
  allowBackground?: boolean;
  /** Final run-local availability of the process continuation tool. */
  processToolAvailabilityRef?: {
    value?: boolean;
  };
  scopeKey?: string;
  sessionKey?: string;
  /** Stable agent run that owns any approval created by this tool. */
  runId?: string;
  /** Exact admitted execution instance that owns secret-egress proxy access. */
  operationalRunInstance?: OperationalRunInstanceRef;
  /** Durable session that receives detached exec completion events and approval followups. */
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
  sessionScope?: "per-sender" | "global";
  /** Start-time routing policy for detached exec system events. */
  eventRouting?: EventSessionRoutingPolicy;
  messageProvider?: string;
  currentChannelId?: string;
  currentThreadTs?: string;
  /** Channel-owned sender/chat metadata. Exec subprocesses receive only sender/chat IDs. */
  channelContext?: PluginHookChannelContext;
  accountId?: string;
  approvalReviewerDeviceId?: string;
  /** Deny approval-requiring commands without creating operator approval events. */
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
  /** Provider stream params override (best-effort). */
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  /** Stop sequences forwarded to the provider (best-effort). */
  stop?: string[];
  /** Provider fast-mode override (best-effort). */
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
    parameters?: Record<string, unknown>;
    /** Strict argument enforcement (Responses API). Propagated from the request. */
    strict?: boolean;
  };
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
  steeringMode?: "all";
  /** True when this queue item came from the channel's current user turn. */
  isInboundUserMessage?: boolean;
  /** Exact tool authority resolved for an inbound user turn before steering. */
  toolAuthorityFingerprint?: string;
  /** Internal proof that a mismatched route recomputes to the active run's full authority. */
  pendingInputAuthorityFingerprint?: string;
  debounceMs?: number;
  /** Ordered current-turn images to inject with the steering text. */
  images?: ImageContent$1[];
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered facts represented by attachment text in this steering prompt. */
  media?: MediaFact[];
  deliveryTimeoutMs?: number;
  waitForTranscriptCommit?: boolean;
  /** Stable source identity for exact queued-message commit/cancellation matching. */
  queueIdentity?: string;
  abortSignal?: AbortSignal;
  /** Releases arrival ordering once the runtime has actually accepted this queue item. */
  onQueueAccepted?: (accepted: boolean) => void;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** Prepared channel turn to merge only at transcript persistence. */
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
  /** Acceptance was irreversible, but the harness could not prove transcript commitment. */
  transcriptCommit: "unconfirmed";
  errorMessage: string;
};
type ReplyBackendMessageInjection = {
  /** Runtime-owned admission state; independent from token streaming. */
  isAvailable(): boolean;
  queueMessage(text: string, options?: ReplyBackendQueueMessageOptions): Promise<void | ReplyBackendQueueMessageResult>;
};
type ReplyBackendHandle = {
  readonly kind: ReplyBackendKind;
  readonly runId?: string;
  /** Exact authority of this concrete backend attempt, after fallback selection. */
  readonly toolAuthorityFingerprint?: string;
  readonly sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  readonly taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** True only when queueMessage preserves images supplied in its options. */
  readonly supportsQueueMessageImages?: boolean;
  claimPendingUserInputAnswer?: (text: string, options?: ReplyBackendQueueMessageOptions) => Promise<boolean>;
  cancelPendingUserInput?: (resolvedBy: string) => Promise<boolean>;
  cancel(reason?: ReplyBackendCancelReason): void;
  readonly messageInjection?: ReplyBackendMessageInjection;
  /** @deprecated Compatibility for shipped embedded handles. Use messageInjection. */
  isStreaming?: () => boolean;
  isStopped?: () => boolean;
  isAbortable?: () => boolean;
  /** @deprecated Compatibility for shipped embedded handles. Use messageInjection. */
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
  readonly turnKind: ReplyTurnKind;
  /** Gateway lifecycle that admitted this process-local owner. */
  readonly lifecycleGeneration?: string;
  readonly routeThreadId?: string | number;
  /** Transcript branch leaf from which this operation was admitted. */
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
  readonly acceptedSteeredInboundAudio: boolean;
  /** Immutable tool authority accepted by the active backend for steered user turns. */
  readonly toolAuthorityFingerprint?: string;
  /** Concrete provider/model route currently selected for this operation. */
  readonly toolAuthorityRoute?: ReplyToolAuthorityRoute;
  readonly phase: ReplyOperationPhase;
  readonly result: ReplyOperationResult | null;
  /** Set when a stale-watchdog expiry forced this operation's run_stalled result. */
  readonly staleExpiryReason?: ReplyOperationStaleReason;
  readonly startedAtMs: number;
  readonly lastActivityAtMs: number;
  /** True when this operation has owned the supplied session ID. */
  hasOwnedSessionId(sessionId: string): boolean;
  recordActivity(): void;
  setPhase(next: "queued" | "waiting_for_deferred_maintenance" | "waiting_for_global_lane" | "preflight_compacting" | "memory_flushing" | "running"): void;
  /** Mark this operation as waiting on prior same-session maintenance. */
  markWaitingForDeferredMaintenance(): void;
  /** Return a maintenance-waiting operation to queued if the run has not started. */
  markDeferredMaintenanceWaitEnded(): void;
  /** Mark this operation as waiting for process-global run capacity. */
  markWaitingForGlobalLane(): void;
  /** Return a global-lane-waiting operation to queued once capacity is granted. */
  markGlobalLaneWaitEnded(): void;
  /** Mark this operation as an in-flight terminal-session recovery. */
  markTerminalRecovery(): void;
  markAcceptedSteeredInboundAudio(): void;
  /** Bind provisional request authority before a concrete backend attempt attaches. */
  bindToolAuthorityFingerprint(fingerprint: string): void;
  /** Bind the active run's immutable authority projector for direct inbound steering. */
  bindToolAuthorityProjector(projector: ReplyToolAuthorityProjector): void;
  /** Project an inbound turn through the current concrete route; settled owners fail closed. */
  projectToolAuthorityFingerprint(overlay: ReplyToolAuthorityOverlay): string | undefined;
  /** Record the concrete candidate route; fallback attempts may replace it. */
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
  detachBackend(handle: ReplyBackendHandle): void;
  /** Reject later aborts after the backend has committed its terminal outcome. */
  freezeAbort(): void;
  /**
   * Keep a failed operation active until complete() releases the session lane.
   * Dispatch uses this while a user-visible failure payload still needs delivery.
   */
  retainFailureUntilComplete(): void;
  /** Settles after the lifecycle owner's final delivery/persistence barrier. */
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
  supersede(beforeSupersede?: () => void): boolean;
};
type ReplyOperationStaleReason = ReplyOperationStaleReason$1;
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
  assertCurrent?: () => void;
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
type SkillWorkshopPreparedPatch = {
  skillFile: string;
  contentHash: string;
  oldString: string;
};
/** Run-scoped budget shared by every workshop tool instance created across runner retries. */
type SkillWorkshopProposalMutationBudget = {
  remaining: number;
  /** Distinct proposal records successfully mutated by this run. */
  completed?: number;
  /** Successful persisted mutation calls, including repeated revisions. */
  successfulMutations?: number;
  /** Failed or incompletely checkpointed reservations in the current model run. */
  failedMutations?: number;
  /** Run-local identity set used to keep idea counts distinct. */
  mutatedProposalIds?: Set<string>;
  /** Content hash per live skill read this run; autonomous updates require a matching receipt. */
  readSkillHashes?: Map<string, string>;
  /** Single-use exact-span patch authority prepared from authoritative live content. */
  preparedSkillPatches?: Map<string, SkillWorkshopPreparedPatch>;
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
/** Exact proposal revision an operator reviewed before requesting an agent-authored revision. */
type SkillWorkshopProposalRevisionConstraint = {
  readonly agentId: string;
  readonly workspaceDir: string;
  readonly proposalId: string;
  readonly expectedRevisionHash: string;
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
  proposalRevision?: SkillWorkshopProposalRevisionConstraint;
};
//#endregion
//#region src/agents/bootstrap-mode.d.ts
type BootstrapContextRunKind = "default" | "heartbeat" | "cron";
//#endregion
//#region src/agents/workspace.d.ts
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
//#region src/agents/run-session-target.d.ts
/** Identifies a run transcript target without naming the current storage artifact. */
type AgentRunSessionTarget = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  storePath?: string;
  threadId?: string | number;
  /** Internal admission fence paired with sessionId for run-owned transcript writes. */
  expectedLifecycleRevision?: string;
  /** Internal durable writer claim installed after session-lane admission. */
  expectedWriterRunId?: string;
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
  isReasoning?: boolean;
  /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
  replyToId?: string;
  replyToTag?: boolean;
  replyToCurrent?: boolean;
  /** Portable controls attached to a harness-owned blocking prompt. */
  presentation?: MessagePresentation;
  /** Runtime-authored text is the fallback for the portable presentation. */
  presentationTextMode?: "fallback";
  /** Channel-specific routing metadata for runtime-owned interactions. */
  channelData?: Record<string, unknown>;
};
//#endregion
//#region src/agents/bash-tools.exec-approval-output.d.ts
type ExecApprovalContinuationPromptRange = {
  start: number;
  end: number;
};
//#endregion
//#region src/agents/conversation-recall.types.d.ts
type ConversationRecallContext = {
  /** Private conversation that requested this bounded recall pass. */
  anchorSessionKey: string;
  /** Only same-agent private transcript hits may pass. */
  scope: "same-agent-private";
  /** Product-only recall searches sessions; advanced recall keeps configured corpora. */
  corpus: "sessions" | "configured";
};
//#endregion
//#region src/infra/agent-activity-events.d.ts
/** Status rendered for an item-level agent activity event. */
type AgentItemEventStatus = "running" | "completed" | "failed" | "blocked";
/** Incremental command output payload associated with an item/tool call. */
type AgentCommandOutputEventFields = {
  itemId: string;
  phase: "delta" | "end";
  title: string;
  toolCallId: string;
  name?: string;
  output?: string;
  status?: AgentItemEventStatus | "running";
  exitCode?: number | null;
  durationMs?: number;
  cwd?: string;
};
//#endregion
//#region src/agents/embedded-agent-subscribe.shared-types.d.ts
/** Rendering mode for completed tool results in subscribed replies. */
type ToolResultFormat = "markdown" | "plain";
/** Detail level for in-flight tool progress messages. */
type ToolProgressDetailMode = "explain" | "raw";
type EmbeddedAgentEvent = {
  stream: string;
  data: Record<string, unknown> & Omit<Partial<AgentCommandOutputEventFields>, "phase" | "status"> & {
    phase?: string;
    status?: string;
    args?: Record<string, unknown>;
    summary?: string;
    commandBearing?: boolean;
    isError?: boolean;
  };
  sessionKey?: string;
};
//#endregion
//#region src/shared/fast-mode.d.ts
type FastModeAutoProgressState = {
  offAnnounced: boolean;
  resetAnnounced: boolean;
};
//#endregion
//#region src/context-engine/host-compat.d.ts
type ContextEngineHostSupport = {
  id: string;
  label: string;
  capabilities: readonly ContextEngineHostCapability[];
};
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
  /** Compatibility getter for internal callers while the single context object is threaded. */
  readonly engine: ContextEngine;
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
//#region src/agents/model-catalog-lookup.d.ts
type ModelThinkingCompat = {
  thinkingFormat?: ModelCompatConfig["thinkingFormat"];
  supportedReasoningEfforts?: readonly string[] | null;
};
type PreparedModelThinkingCapability = Readonly<{
  provider: string;
  modelId: string;
  agentRuntime: string;
  /** Present only when the capability came from a physical provider route. */
  route?: Readonly<{
    api: string;
    baseUrl: string;
  }>;
  compat: ModelThinkingCompat;
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
  promptJoiner?: "\n\n" | "\n" | " ";
  /** Generated goal blocks owned by inbound-context assembly, never user text. */
  injectedGoalContexts?: string[];
};
type RunEmbeddedAgentParams = {
  /** Already-admitted internal execution; mutually exclusive with preparedRunAdmission. */
  admittedRunContext?: AdmittedRunContext;
  /** Host-only post-prepare continuation, removed before plugin invocation. */
  preparedRunAdmission?: PreparedAgentRunAdmission;
  /** Caller-owned in-memory transcript for ephemeral helper runs. */
  sessionManager?: SessionManager;
  /** Detached runs may read session identity but never write its durable transcript or metadata. */
  sessionPersistence?: "durable" | "detached";
  sessionId: string;
  sessionKey?: string;
  /** Storage-neutral transcript/session target. Defaults to sessionId/sessionKey/agentId. */
  sessionTarget?: AgentRunSessionTarget;
  /** Immutable gateway lifecycle ownership captured when this execution was admitted. */
  lifecycleGeneration?: string;
  /** Provider prompt-cache affinity key; distinct from transcript/session identity. */
  promptCacheKey?: string;
  /** Session-like key for sandbox and tool-policy resolution. Defaults to sessionKey. */
  sandboxSessionKey?: string;
  agentId?: string;
  messageChannel?: string;
  messageProvider?: string;
  /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[];
  /** Out-of-band plugin bindings attached by the run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>;
  chatType?: ChatType;
  agentAccountId?: string;
  /** What initiated this agent run: "user", "heartbeat", "cron", "memory", "overflow", or "manual". */
  trigger?: EmbeddedRunTrigger;
  /** Stable cron job identifier populated for cron-triggered runs. */
  jobId?: string;
  /** Store-private runtime authority forwarded only by the cron execution owner. */
  scheduledRuntimeAuthority?: CronRuntimeAuthority;
  /** A known runtime-specific authority envelope was explicitly cleared. */
  scheduledRuntimeAuthorityRecoveryRequired?: boolean;
  /** Relative workspace path that memory-triggered writes are allowed to append to. */
  memoryFlushWritePath?: string;
  /** Sticky source-turn taint inherited by an internal maintenance run. */
  initialTurnTainted?: boolean;
  /** Delivery target for topic/thread routing. */
  messageTo?: string;
  /** Thread/topic identifier for routing replies to the originating thread. */
  messageThreadId?: string | number;
  /** Trusted channel-configured policy for the admitted conversation turn. */
  conversationToolPolicy?: GroupToolPolicyConfig;
  /** Group id for channel-level tool policy resolution. */
  groupId?: string | null;
  /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null;
  /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null;
  /** Trusted provider role ids for the requester in this group turn. */
  memberRoleIds?: string[];
  /** Opaque host-issued capability for current-turn channel message actions. */
  messageActionTurnCapability?: string;
  /** Parent session key for subagent policy inheritance. */
  spawnedBy?: string | null;
  /** Whether workspaceDir points at the canonical agent workspace for bootstrap purposes. */
  isCanonicalWorkspace?: boolean;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  /** Trusted sender identity bit for command/channel-action auth. */
  senderIsOwner?: boolean;
  /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string;
  /** Current channel ID for auto-threading (Slack). */
  currentChannelId?: string;
  /** Transport-native chat/conversation ID for hook identity context. */
  chatId?: string;
  /** Channel-specific identity metadata surfaced to plugin hooks. */
  channelContext?: PluginHookChannelContext;
  /** Routable target for the current conversation when it differs from the native channel ID. */
  currentMessagingTarget?: string;
  /** Current thread timestamp for auto-threading (Slack). */
  currentThreadTs?: string;
  /** Current inbound message id for action fallbacks (e.g. Telegram react). */
  currentMessageId?: string | number;
  /** True when the current inbound turn carried audio media. */
  currentInboundAudio?: boolean;
  /** Reply-to mode for Slack auto-threading. */
  replyToMode?: "off" | "first" | "all" | "batched";
  /** Mutable ref to track if a reply was sent (for "first" mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Require explicit message tool targets (no implicit last-route sends). */
  requireExplicitMessageTarget?: boolean;
  /** If true, omit the message tool from the tool list. */
  disableMessageTool?: boolean;
  /** Host-prepared proof that the exact session can request Gateway publication. */
  githubPublicationAvailable?: boolean;
  swarmCollector?: boolean;
  swarmOutputSchema?: Record<string, unknown>;
  /** Restrict this reconstructed run to restart-safe tools. */
  forceRestartSafeTools?: boolean;
  /** Restrict one internal post-mutation recovery attempt to audited core reads. */
  forceCodeModeReconciliationTools?: boolean;
  /** Preserve Code Mode controls for a replay-safe restart recovery turn. */
  forceCodeModeTools?: boolean;
  /** Internal one-shot model probe mode: no tools, no workspace/chat prompt policy. */
  modelRun?: boolean;
  /** Disable trajectory persistence for auxiliary runs with no durable session owner. */
  disableTrajectory?: boolean;
  /** Restrict Skill Workshop to a bounded pending-proposal budget for an internal review run. */
  skillWorkshopProposalOnly?: boolean;
  /** Mark proposals created by this internal review as autonomous captures. */
  skillWorkshopAutonomousCapture?: boolean;
  skillWorkshopUpdateProposals?: boolean;
  /** Preserve the foreground run as proposal provenance for an internal review run. */
  skillWorkshopOrigin?: SkillProposalOrigin;
  /** Run-scoped mutation budget shared across internal runner attempts. */
  skillWorkshopProposalMutationBudget?: SkillWorkshopProposalMutationBudget;
  /** Optional state environment for isolated Skill Workshop proposal persistence. */
  skillWorkshopProposalEnv?: NodeJS.ProcessEnv;
  /** Shared completion latch for proposal-only review runs that checkpoint their batch. */
  skillWorkshopProposalReviewCompletion?: SkillWorkshopRunOptions["proposalReviewCompletion"];
  /** Restrict Skill Workshop to one atomic collection reconciliation. */
  skillWorkshopCollectionReconcile?: SkillWorkshopRunOptions["collectionReconcile"];
  /** Bind an operator-requested revision turn to the exact proposal revision they reviewed. */
  skillWorkshopProposalRevision?: SkillWorkshopRunOptions["proposalRevision"];
  /** Explicit system prompt mode override for trusted callers. */
  promptMode?: PromptMode;
  /** Keep the message tool available even when a narrow profile would omit it. */
  forceMessageTool?: boolean;
  /** Include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** Keep the heartbeat response tool available even when a narrow profile would omit it. */
  forceHeartbeatTool?: boolean;
  /** Allow runtime plugins for this run to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean;
  /** @deprecated Use sessionTarget plus sessionId/sessionKey/agentId for runtime identity. */
  sessionFile?: string;
  workspaceDir: string;
  /** Canonical agent workspace used for bootstrap files when execution runs elsewhere. */
  bootstrapWorkspaceDir?: string;
  /** Task working directory for tool/runtime execution. Defaults to workspaceDir. */
  cwd?: string;
  permissionMode?: SessionEntry["permissionMode"];
  sessionRoot?: string;
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
  prompt: string;
  /** User-visible prompt body to submit and persist; runtime context travels separately. */
  transcriptPrompt?: string;
  /** Finalizes caller-owned guidance after the submitted tool surface is known. */
  finalizePromptForResolvedTools?: ResolvedToolPromptFinalizer;
  currentInboundEventKind?: InboundEventKind;
  currentInboundContext?: CurrentInboundPromptContext;
  explicitSkillSelections?: ExplicitSkillSelection[];
  images?: ImageContent$1[];
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered facts represented by attachment text in the current prompt. */
  media?: MediaFact[];
  /** Optional client-provided tools (OpenResponses hosted tools). */
  clientTools?: ClientToolDefinition[];
  /** Disable built-in tools for this run (LLM-only mode). */
  disableTools?: boolean;
  provider?: string;
  model?: string;
  /** Outer model-fallback owner facts for this admitted attempt. */
  modelRoutingProvenance?: ModelFallbackAttemptProvenance;
  /** Vision capability resolved by the run owner from its prepared model catalog. */
  modelHasVision?: boolean;
  /** Session-selected context-window option id carried by the run owner. */
  contextWindow?: string;
  /** Route-bound thinking capability resolved from the selected prepared catalog row. */
  modelThinkingCapability?: PreparedModelThinkingCapability;
  /** Effective model fallback chain for this session attempt. Undefined uses config defaults. */
  modelFallbacksOverride?: string[];
  /** Session-pinned embedded harness id. Prevents runtime hot-switching. */
  agentHarnessId?: string;
  /** True when the pinned non-default harness owns model selection for this session. */
  modelSelectionLocked?: boolean;
  /** Explicit runtime override selected for this turn. Unlike agentHarnessId, this may force OpenClaw. */
  agentHarnessRuntimeOverride?: string;
  /** Verified setup continuation: pin both the harness and its local implementation. */
  expectedAgentHarnessRuntimeArtifact?: ExpectedAgentHarnessRuntimeArtifact;
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
  thinkLevel?: ThinkLevel;
  fastMode?: FastMode;
  /** Stable outer-run start time for auto fast-mode cutoff across retries/fallbacks. */
  fastModeStartedAtMs?: number;
  /** Effective auto fast-mode cutoff for this run, in seconds. */
  fastModeAutoOnSeconds?: number;
  /** Shared notification state for nested harnesses that can observe the same tool boundary. */
  fastModeAutoProgressState?: FastModeAutoProgressState;
  /** True when the outer model fallback loop has reached its final candidate. */
  isFinalFallbackAttempt?: boolean;
  verboseLevel?: VerboseLevel;
  reasoningLevel?: ReasoningLevel;
  toolResultFormat?: ToolResultFormat;
  toolProgressDetail?: ToolProgressDetailMode;
  /** If true, suppress tool error warning payloads for this run (including mutating tools). */
  suppressToolErrorWarnings?: boolean;
  /** Bootstrap context mode for workspace file injection. */
  bootstrapContextMode?: "full" | "lightweight";
  /** Run kind hint for context mode behavior. */
  bootstrapContextRunKind?: BootstrapContextRunKind;
  /** Optional tool allow-list; when set, only these tools are sent to the model. */
  toolsAllow?: string[];
  /** Preserve the visible tool schemas while allowing execution only for these names. */
  toolExecutionAllow?: readonly string[];
  /** Exact attempt authority attached to the active steering backend. */
  toolAuthorityFingerprint?: string;
  /** Owner-scoped plugin tool grant; normal policy and deny rules still apply. */
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  /** Consumed in-process subagent-completion capability; never derived from public input. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  /** Trusted server-stamped authority for an explicitly capped scheduled run. */
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  /** Host-stamped exact-run capability for late Codex creator-authority capture. */
  cronCreatorAuthorityCapability?: CronCreatorAuthorityCapability;
  /** Ephemeral reason fresh local-operator cron authority cannot survive this queued turn. */
  cronCreatorAuthorityUnavailableReason?: "queued-local-operator";
  /** Seen bootstrap truncation warning signatures for this session (once mode dedupe). */
  bootstrapPromptWarningSignaturesSeen?: string[];
  /** Last shown bootstrap truncation warning signature for this session. */
  bootstrapPromptWarningSignature?: string;
  execOverrides?: Pick<ExecToolDefaults, "host" | "mode" | "security" | "ask" | "node" | "nodeCwd" | "notifyOnExit" | "notifyOnExitEmptySuccess">;
  bashElevated?: ExecElevatedDefaults;
  /** Trusted approved-exec runtime prompt span awaiting the resolved attempt cap. */
  execApprovalContinuationPromptRange?: ExecApprovalContinuationPromptRange;
  /** Corresponding span in the undecorated transcript prompt. */
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
  runId: string;
  /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
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
  onToolResult?: (payload: ReplyPayload) => void | Promise<void>;
  /** Synchronous private observer for the sanitized per-tool result. */
  onAgentToolResult?: (event: {
    toolName: string;
    result: unknown;
    isError: boolean;
  }) => void;
  onAgentEvent?: (evt: EmbeddedAgentEvent) => void | Promise<void>;
  onToolStreamBoundary?: () => void | Promise<void>;
  /**
   * Emit lifecycle "finishing" when the attempt ends; the caller owns the
   * final lifecycle "end" or "error" after fallback and post-turn work settle.
   */
  deferTerminalLifecycle?: boolean;
  /** @deprecated Use deferTerminalLifecycle. */
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
  silentExpected?: boolean;
  /** Skip per-chunk live visible-text parsing when no live stream consumer exists (e.g. subagents). */
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
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  /** Context engine resolved once by the outer logical-turn owner. */
  contextEngineLogicalTurnLease?: ContextEngineLogicalTurnLease;
  /** Emits immutable attempt facts for selection by the outer logical-turn owner. */
  onContextEngineTurnCandidate?: (facts: ContextEngineTurnAttemptFacts) => void;
  /** Keep an internal continuation prompt from being replaced by the original prepared turn. */
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
  cleanupBundleMcpOnRunEnd?: boolean;
  /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean;
};
//#endregion
//#region src/agents/cli-runner/types.d.ts
type CliSessionBindingFacts = {
  extraSystemPromptStatic?: string;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  requireExplicitMessageTarget?: boolean;
};
//#endregion
//#region src/channels/message-access/identifier-authentication.d.ts
/** Ordered strength of one identifier-authentication claim. */
type IdentifierAuthentication = "verified" | "asserted" | "unverified" | "mutable";
//#endregion
//#region src/config/implicit-mentions.d.ts
type ResolvedChannelImplicitMentions = Required<ChannelImplicitMentionsConfig>;
//#endregion
//#region src/channels/message-access/types.d.ts
/** Channel identifier used in ingress diagnostics and config lookups. */
type ChannelIngressChannelId = ChatChannelId;
/** Redacted identifier category used by allowlist normalization and matching. */
type ChannelIngressIdentifierKind = "stable-id" | "username" | "email" | "phone" | "role" | `plugin:${string}`;
/** Public, redacted identifier material that can participate in allowlist matching. */
type MatchableIdentifier = {
  opaqueId: string;
  kind: ChannelIngressIdentifierKind;
  authentication?: IdentifierAuthentication;
  /** @deprecated Use `authentication: "mutable"`. Remove in the next Plugin SDK major. */
  dangerous?: boolean;
  sensitivity?: "normal" | "pii";
};
/** Internal identifier material with the raw comparable value retained. */
type InternalMatchMaterial = MatchableIdentifier & {
  value: string;
};
/** Internal subject representation used by the shared ingress kernel. */
type InternalChannelIngressSubject = {
  identifiers: InternalMatchMaterial[];
};
/** Public, redacted form of a normalized allowlist entry. */
type ChannelIngressNormalizedEntry = {
  opaqueEntryId: string;
  kind: ChannelIngressIdentifierKind;
  wildcard?: boolean;
  authentication?: IdentifierAuthentication;
  /** @deprecated Use `authentication: "mutable"`. Remove in the next Plugin SDK major. */
  dangerous?: boolean;
  sensitivity?: "normal" | "pii";
};
/** Redacted diagnostic for an invalid, disabled, or unsupported allowlist entry. */
type RedactedIngressEntryDiagnostic = {
  opaqueEntryId?: string;
  reasonCode: IngressReasonCode;
};
/** Redacted allowlist match result exposed to callers and access facts. */
type RedactedIngressMatch = {
  matched: boolean;
  matchedEntryIds: string[];
  /** Exact redacted entry-to-subject edges retained for authentication policy. */
  matchedPairs?: RedactedIngressMatchedPair[];
};
type RedactedIngressMatchedPair = {
  opaqueEntryId: string;
  opaqueSubjectId: string;
  subjectAuthentication: IdentifierAuthentication;
};
/** Fully normalized allowlist facts for one ingress gate. */
type ResolvedIngressAllowlist = {
  rawEntryCount: number;
  normalizedEntries: ChannelIngressNormalizedEntry[];
  invalidEntries: RedactedIngressEntryDiagnostic[];
  disabledEntries: RedactedIngressEntryDiagnostic[];
  matchedEntryIds: string[];
  hasConfiguredEntries: boolean;
  hasMatchableEntries: boolean;
  hasWildcard: boolean;
  accessGroups: {
    referenced: string[];
    matched: string[];
    missing: string[];
    unsupported: string[];
    failed: string[];
  };
  match: RedactedIngressMatch;
  authentication?: RedactedIdentifierAuthenticationResult;
};
type RedactedIdentifierAuthenticationResult = {
  evaluated: boolean;
  threshold: IdentifierAuthentication;
  affectedMatch: boolean;
  rejectedEntryIds: string[];
};
type RedactedIdentifierAuthenticationDecision = {
  evaluated: boolean;
  affectedMatch: boolean;
};
/** Redacted allowlist facts safe to expose in the access graph. */
type RedactedIngressAllowlistFacts = {
  configured: boolean;
  matched: boolean;
  reasonCode: IngressReasonCode;
  matchedEntryIds: string[];
  invalidEntryCount: number;
  disabledEntryCount: number;
  accessGroups: ResolvedIngressAllowlist["accessGroups"];
};
/** Route lookup state projected into the ingress access graph. */
type RouteGateState = "not-configured" | "matched" | "not-matched" | "disabled" | "lookup-failed";
/** How a matched route affects sender allowlist evaluation. */
type RouteSenderPolicy = "inherit" | "replace" | "deny-when-empty";
/** Source list used when a route sender policy contributes sender entries. */
type RouteSenderAllowlistSource = "effective-dm" | "effective-group";
/** Raw route gate facts supplied by a channel-specific router. */
type RouteGateFacts = {
  id: string;
  kind: "route" | "routeSender" | "membership" | "ownerAllowlist" | "nestedAllowlist";
  gate: RouteGateState;
  effect: "allow" | "block-dispatch" | "ignore";
  precedence: number;
  senderPolicy: RouteSenderPolicy;
  senderAllowFrom?: Array<string | number>;
  senderAllowFromSource?: RouteSenderAllowlistSource;
  match?: RedactedIngressMatch;
};
/** Route gate facts after any route-specific sender allowlist is normalized. */
type ResolvedRouteGateFacts = Omit<RouteGateFacts, "senderAllowFrom" | "senderAllowFromSource"> & {
  senderAllowlist?: ResolvedIngressAllowlist;
};
/** Inbound event facts used to choose command, pairing, and origin-subject rules. */
type ChannelIngressEventInput = {
  kind: "message" | "reaction" | "button" | "postback" | "native-command" | "slash-command" | "system";
  authMode: "inbound" | "command" | "origin-subject" | "route-only" | "none";
  mayPair: boolean;
  originSubject?: InternalChannelIngressSubject;
};
/** Redacted event facts exposed in decisions and access facts. */
type RedactedChannelIngressEvent = Omit<ChannelIngressEventInput, "originSubject"> & {
  hasOriginSubject: boolean;
  originSubjectMatched: boolean;
  originSubjectAuthentication?: IdentifierAuthentication;
};
/** Policy knobs that decide how the ingress graph is evaluated. */
type ChannelIngressPolicyInput = {
  dmPolicy: "pairing" | "allowlist" | "open" | "disabled";
  groupPolicy: "allowlist" | "open" | "disabled";
  groupAllowFromFallbackToAllowFrom?: boolean;
  minIdentifierAuthentication?: IdentifierAuthentication;
  /** @deprecated `enabled` maps to minimum `mutable`; otherwise minimum `asserted`. Remove in the next Plugin SDK major. */
  mutableIdentifierMatching?: "disabled" | "enabled";
  activation?: {
    requireMention: boolean;
    allowTextCommands: boolean;
    implicitMentions?: ResolvedChannelImplicitMentions;
    allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
    order?: "before-sender" | "after-command";
  };
  command?: {
    useAccessGroups?: boolean;
    allowTextCommands: boolean;
    hasControlCommand: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
  };
};
/** Ordered phase for a gate in the ingress graph. */
type IngressGatePhase = "route" | "sender" | "command" | "event" | "activation";
/** Gate kind used in the ingress graph and projected access facts. */
type IngressGateKind = "route" | "routeSender" | "dmSender" | "groupSender" | "membership" | "ownerAllowlist" | "nestedAllowlist" | "command" | "event" | "mention";
/** Effect produced by a gate when computing final ingress admission. */
type IngressGateEffect = "allow" | "block-dispatch" | "block-command" | "skip" | "observe" | "ignore";
/** Stable machine-readable reason code for ingress diagnostics. */
type IngressReasonCode = "allowed" | "route_blocked" | "route_sender_empty" | "dm_policy_disabled" | "dm_policy_open" | "dm_policy_allowlisted" | "dm_policy_pairing_required" | "dm_policy_not_allowlisted" | "group_policy_disabled" | "group_policy_open" | "group_policy_allowed" | "group_policy_empty_allowlist" | "group_policy_not_allowlisted" | "command_authorized" | "control_command_unauthorized" | "event_authorized" | "event_unauthorized" | "event_pairing_not_allowed" | "sender_not_required" | "origin_subject_missing" | "origin_subject_not_matched" | "activation_allowed" | "activation_skipped" | "access_group_missing" | "access_group_unsupported" | "access_group_failed" | "mutable_identifier_disabled" | "identifier_authentication_too_weak" | "no_policy_match";
/** One evaluated gate in the ordered ingress access graph. */
type AccessGraphGate = {
  id: string;
  phase: IngressGatePhase;
  kind: IngressGateKind;
  effect: IngressGateEffect;
  allowed: boolean;
  reasonCode: IngressReasonCode;
  match?: RedactedIngressMatch;
  allowlist?: RedactedIngressAllowlistFacts;
  identifierAuthentication?: RedactedIdentifierAuthenticationDecision;
  sender?: {
    policy: ChannelIngressPolicyInput["dmPolicy"] | ChannelIngressPolicyInput["groupPolicy"];
  };
  command?: {
    useAccessGroups: boolean;
    allowTextCommands: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    shouldBlockControlCommand: boolean;
  };
  event?: RedactedChannelIngressEvent;
  activation?: {
    hasMentionFacts: boolean;
    requireMention: boolean;
    allowTextCommands: boolean;
    allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
    order?: "before-sender" | "after-command";
    shouldSkip: boolean;
    canDetectMention?: boolean;
    wasMentioned?: boolean;
    hasAnyMention?: boolean;
    implicitMentionKinds?: readonly InboundImplicitMentionKind[];
    effectiveWasMentioned?: boolean;
    shouldBypassMention?: boolean;
  };
};
/** Ordered graph of all evaluated ingress gates. */
type AccessGraph = {
  gates: AccessGraphGate[];
};
/** Normalized ingress state before policy gates are reduced into a decision. */
type ChannelIngressState = {
  channelId: ChannelIngressChannelId;
  accountId: string;
  conversationKind: "direct" | "group" | "channel";
  event: RedactedChannelIngressEvent;
  mentionFacts?: InboundMentionFacts;
  routeFacts: ResolvedRouteGateFacts[];
  allowlists: {
    dm: ResolvedIngressAllowlist;
    pairingStore: ResolvedIngressAllowlist;
    group: ResolvedIngressAllowlist;
    commandOwner: ResolvedIngressAllowlist;
    commandGroup: ResolvedIngressAllowlist;
  };
};
/** Final runtime admission action for the inbound event. */
type ChannelIngressAdmission = "dispatch" | "observe" | "skip" | "drop" | "pairing-required";
/** Final decision and graph for a resolved channel ingress event. */
type ChannelIngressDecision = {
  admission: ChannelIngressAdmission;
  decision: "allow" | "block" | "pairing";
  decisiveGateId: string;
  reasonCode: IngressReasonCode;
  graph: AccessGraph;
};
//#endregion
//#region src/channels/message-access/runtime-types.d.ts
/** Sender/conversation projection consumed by channel handlers. */
type ChannelIngressSenderAccess = {
  /** True when the sender gate admits the event. */
  allowed: boolean;
  /** Final ingress decision after all gates, not just the sender gate. */
  decision: ChannelIngressDecision["decision"];
  /** Sender gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode;
  /** Sender gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
  /** Effective DM allowlist entries after store and access-group processing. */
  effectiveAllowFrom: string[];
  /** Effective group allowlist entries after fallback and access-group processing. */
  effectiveGroupAllowFrom: string[];
  /** Whether provider-specific fallback behavior was applied. */
  providerMissingFallbackApplied: boolean;
};
/** Command projection consumed by channel command/control handlers. */
type ChannelIngressCommandAccess = {
  /** True when a command gate was requested for this event. */
  requested: boolean;
  /** True when the command gate authorizes this sender. */
  authorized: boolean;
  /** True when an unauthorized control command should be blocked. */
  shouldBlockControlCommand: boolean;
  /** Command gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode;
  /** Command gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Route projection consumed by room/thread/topic handlers. */
type ChannelIngressRouteAccess = {
  /** True when all configured route gates admit the event. */
  allowed: boolean;
  /** Route gate reason when a route gate decided. */
  reasonCode?: IngressReasonCode;
  /** Optional route-specific reason text. */
  reason?: string;
  /** Route gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Activation/mention projection consumed by group handlers. */
type ChannelIngressActivationAccess = {
  /** True when an activation gate ran. */
  ran: boolean;
  /** True when activation admits the event. */
  allowed: boolean;
  /** True when the event should be skipped instead of dispatched. */
  shouldSkip: boolean;
  /** Activation gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode;
  /** Effective mention match after command bypass and activation policy. */
  effectiveWasMentioned?: boolean;
  /** True when mention gating was bypassed by policy or command facts. */
  shouldBypassMention?: boolean;
  /** Activation gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Full ingress result returned by runtime resolvers. */
type ResolvedChannelMessageIngress = {
  /** Redacted normalized state used as input to the decision engine. */
  state: ChannelIngressState;
  /** Ordered access graph plus final admission decision. */
  ingress: ChannelIngressDecision;
  /** Sender/conversation projection. */
  senderAccess: ChannelIngressSenderAccess;
  /** Route projection. */
  routeAccess: ChannelIngressRouteAccess;
  /** Command projection. */
  commandAccess: ChannelIngressCommandAccess;
  /** Activation/mention projection. */
  activationAccess: ChannelIngressActivationAccess;
};
//#endregion
//#region src/auto-reply/reply/queue/types.d.ts
type FollowupQueueDisposition = "queue-cap" | "queue-cap-old" | "queue-cap-new";
type QueuedFollowupReplyBatch = {
  kind: "queued-followup";
  runId: string;
  originatingChannel: string | undefined;
  payloads: ReplyPayload[];
};
//#endregion
//#region src/shared/keyed-fifo-lease.d.ts
type KeyedFifoLease = {
  wait(signal?: AbortSignal): Promise<boolean>;
  release(): void;
};
//#endregion
//#region src/auto-reply/reply/reply-admission-ticket.d.ts
declare const REPLY_ADMISSION_TICKET: unique symbol;
type ReplyAdmissionTicket = KeyedFifoLease;
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
  messageInjectionAborted?: true;
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
  /** Host-stamped exact-run capability for late Codex creator-authority capture. */
  cronCreatorAuthorityCapability?: CronCreatorAuthorityCapability;
  expectedExistingSessionId?: string;
  onDeliberateSilentTerminalReply?: () => void;
  onPendingContinuation?: () => void;
  onSessionPrepared?: (binding: ReplySessionBinding) => void;
  /** Prevent implicit rollover after a caller has durably admitted this exact session. */
  pinExpectedExistingSession?: boolean;
  requestedSessionId?: string;
  resumeRequestedSession?: boolean;
  sessionPromptSourceReplyDeliveryMode?: GetReplyOptions["sourceReplyDeliveryMode"];
  /** Receives terminal queue-cap outcomes without widening the public reply API. */
  onFollowupQueueDisposition?: (disposition: FollowupQueueDisposition) => void;
  /** Delivers queued replies only through their originating Gateway admission. */
  onQueuedFollowupReplyBatch?: (batch: QueuedFollowupReplyBatch) => Promise<void> | void;
  /** Overrides persisted queue mode for this reply only. */
  queueModeOverride?: QueueMode;
  /** Dispatch-owned operation used to defer hooks until durable run admission. */
  replyOperation?: ReplyOperation;
  skillOverrides?: SessionToolOverrides["skills"];
  /** Gateway-private optimistic-concurrency constraint for an operator-requested proposal revision. */
  skillWorkshopProposalRevision?: SkillWorkshopProposalRevisionConstraint;
};
type InternalGetReplyOptions = GetReplyOptions & PluginCommandReplyOptions & InternalReplySessionOptions & ReplyOptionsWithOperationRunState & ReplyOptionsWithAdmissionTicket;
/** Reply resolver signature used by dispatchers and tests for dependency injection. */
type GetReplyFromConfig = (ctx: MsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
type InternalGetReplyFromConfig = (ctx: MsgContext, opts?: InternalGetReplyOptions, configOverride?: OpenClawConfig) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
//#region src/auto-reply/reply/command-session-metadata.d.ts
type CommandSessionMetadataChange = {
  sessionKey: string;
  agentId?: string;
  reason: "command-metadata";
};
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.types.d.ts
type DispatchFromConfigResult = {
  queuedFinal: boolean;
  counts: Record<ReplyDispatchKind, number>;
  failedCounts?: Partial<Record<ReplyDispatchKind, number>>;
  settledReceipt?: ReplyDispatchReceipt;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  sendPolicyDenied?: boolean;
  observedReplyDelivery?: boolean;
  deferredToActiveRun?: "steer" | "followup";
  noVisibleReplyFallbackEligible?: boolean;
  noVisibleReplyFallbackDelivered?: boolean;
  deliberateSilentTerminalReply?: true;
  beforeAgentRunBlocked?: boolean;
  sessionMetadataChanges?: CommandSessionMetadataChange[];
};
type DispatchFromConfigParams = {
  ctx: FinalizedMsgContext;
  /** Full runtime config captured by the channel; reply resolution refreshes it per turn. */
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  replyOptions?: Omit<InternalGetReplyOptions, "onBlockReply">;
  replyResolver?: InternalGetReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
  fastAbortResolver?: TryFastAbortFromMessage;
  formatAbortReplyTextResolver?: FormatAbortReplyText;
  /** Optional patch applied to the current runtime config before reply resolution. */
  configOverride?: OpenClawConfig;
  /** Gateway-owned worker services for archive recovery outside a request scope. */
  sessionWorkerPlacementContext?: SessionWorkerPlacementContext;
  /**
   * Channel turns consume the Gateway's committed model-runtime owner even when the global
   * config snapshot is unavailable during startup or durable ingress replay.
   */
  usePublishedModelRuntime?: boolean;
};
type DispatchReplyFromConfig = (params: DispatchFromConfigParams) => Promise<DispatchFromConfigResult>;
//#endregion
//#region src/channels/typing.d.ts
type TypingCallbacks = {
  onReplyStart: () => Promise<void>;
  onIdle?: () => void;
  /** Called when the typing controller is cleaned up (e.g. on NO_REPLY). */
  onCleanup?: () => void;
};
type CreateTypingCallbacksParams = {
  start: () => Promise<void>;
  stop?: () => Promise<void>;
  onStartError: (err: unknown) => void;
  onStopError?: (err: unknown) => void;
  keepaliveIntervalMs?: number;
  /** Stop keepalive after this many consecutive start() failures. Default: 2 */
  maxConsecutiveFailures?: number;
  /** Maximum duration for typing indicator before auto-cleanup (safety TTL). Default: 60s */
  maxDurationMs?: number;
};
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
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
  /** Static context for response prefix template interpolation. */
  responsePrefixContext?: ResponsePrefixContext;
  /** Dynamic context provider for response prefix template interpolation.
   * Called at normalization time, after model selection is complete. */
  responsePrefixContextProvider?: () => ResponsePrefixContext;
  onHeartbeatStrip?: () => void;
  onIdle?: () => Promise<void> | void;
  onError?: ReplyDispatchErrorHandler;
  /** Let a durable ingress owner retry when every attempted send proves no recipient visibility. */
  propagateRetryableNoSendFailure?: boolean;
  onSkip?: ReplyDispatchSkipHandler;
  /** Human-like delay between block replies for natural rhythm. */
  humanDelay?: HumanDelayConfig;
  beforeDeliver?: ReplyDispatchBeforeDeliver;
  /** Owner-declared deadline for the constructor before-delivery callback. */
  beforeDeliverOptions?: ReplyDispatchBeforeDeliverOptions;
  onBeforeDeliverCancelled?: ReplyDispatchCancelHandler;
  /** Observe each queued payload settling, including cancellation and delivery failure. */
  onDeliverySettled?: (info: ReplyDispatchRuntimeInfo) => void;
  /** Resolve an owner activity policy for holding queued follow-ups behind delivery. */
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
  onFreshSettledDelivery?: () => unknown;
  /** Called when the typing controller is cleaned up (e.g., on NO_REPLY). */
  onCleanup?: () => void;
};
type ReplyDispatcherWithTypingResult = {
  dispatcher: ReplyDispatcher;
  replyOptions: Pick<GetReplyOptions, "onReplyStart" | "onTypingController" | "onTypingCleanup">;
  markDispatchIdle: () => void;
  /** Signal that the model run is complete so the typing controller can stop. */
  markRunComplete: () => void;
};
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
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
}) => Promise<DispatchFromConfigResult>;
//#endregion
//#region src/channels/session.types.d.ts
type InboundLastRouteUpdate = {
  sessionKey: string;
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  mainDmOwnerPin?: {
    ownerRecipient: string;
    senderRecipient: string;
    onSkip?: (params: {
      ownerRecipient: string;
      senderRecipient: string;
    }) => void;
  };
};
/** Function contract for recording inbound channel session state. */
type RecordInboundSession$1 = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}) => Promise<void>;
//#endregion
//#region src/auto-reply/command-detection.d.ts
/** Returns true when text starts with a configured control command alias. */
declare function hasControlCommand(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
//#endregion
//#region src/agents/identity.d.ts
/** Resolve the configured identity block for one agent. */
declare function resolveAgentIdentity(cfg: OpenClawConfig, agentId: string): IdentityConfig | undefined;
/** Resolve message and response prefix values together for channel delivery. */
declare function resolveEffectiveMessagesConfig(cfg: OpenClawConfig, agentId: string, opts?: {
  hasAllowFrom?: boolean;
  fallbackMessagePrefix?: string;
  channel?: string;
  accountId?: string;
}): {
  messagePrefix: string;
  responsePrefix?: string;
};
/** Resolve per-agent human-delay settings over global agent defaults. */
declare function resolveHumanDelayConfig(cfg: OpenClawConfig, agentId: string): HumanDelayConfig | undefined;
//#endregion
//#region src/auto-reply/dispatch-dispatcher.d.ts
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
declare function settleReplyDispatcher(params: {
  dispatcher: ReplyDispatcher;
  onSettled?: () => void | Promise<void>;
}): Promise<ReplyDispatchReceipt | undefined>;
/** Run work with a dispatcher and always drain it before returning or throwing. */
declare function withReplyDispatcher<T>(params: {
  dispatcher: ReplyDispatcher;
  run: () => Promise<T>;
  onSettled?: () => void | Promise<void>;
  onSettledReceipt?: (receipt: ReplyDispatchReceipt | undefined) => void;
}): Promise<T>;
//#endregion
//#region src/auto-reply/reply/inbound-context.d.ts
type FinalizeInboundContextOptions = {
  forceBodyForAgent?: boolean;
  forceBodyForCommands?: boolean;
  forceChatType?: boolean;
};
declare function finalizeInboundContext<T extends Record<string, unknown>>(ctx: T, opts?: FinalizeInboundContextOptions): Omit<T, LegacyMediaContextKey> & FinalizedRuntimeMsgContext;
//#endregion
//#region src/auto-reply/envelope.d.ts
type AgentEnvelopeParams = {
  channel: string;
  from?: string;
  timestamp?: number | Date;
  host?: string;
  ip?: string;
  body: string;
  previousTimestamp?: number | Date;
  envelope?: EnvelopeFormatOptions;
};
/** User/config-facing controls for timestamp rendering in prompt envelopes. */
type EnvelopeFormatOptions = {
  /**
   * "local" (default), "utc", "user", or an explicit IANA timezone string.
   */
  timezone?: string;
  /**
   * Include absolute timestamps in the envelope (default: true).
   */
  includeTimestamp?: boolean;
  /**
   * Include elapsed time suffix when previousTimestamp is provided (default: true).
   */
  includeElapsed?: boolean;
  /**
   * Optional user timezone used when timezone="user".
   */
  userTimezone?: string;
};
/** Resolves envelope formatting defaults from agent config. */
declare function resolveEnvelopeFormatOptions(cfg?: OpenClawConfig): EnvelopeFormatOptions;
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
declare function formatAgentEnvelope(params: AgentEnvelopeParams): string;
//#endregion
//#region src/media/store.d.ts
/** Media-store file metadata returned after bytes are persisted under a safe media ID. */
type SavedMedia = {
  id: string;
  path: string;
  size: number;
  contentType?: string;
};
/** Saves an in-memory media buffer under a UUID-backed media ID. */
declare function saveMediaBuffer(buffer: Buffer, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
//#endregion
//#region src/media/fetch.d.ts
/** Remote media bytes plus metadata before they are persisted to the media store. */
type FetchMediaResult = {
  buffer: Buffer;
  contentType?: string;
  fileName?: string;
};
/** Saved media record enriched with the best remote filename candidate. */
type SavedRemoteMedia = SavedMedia & {
  fileName?: string;
};
/** Retry policy applied around the complete guarded fetch and body read/save operation. */
type MediaFetchRetryOptions = RetryOptions;
/** Fetch-compatible injection point used by tests and guarded network callers. */
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Alternate dispatcher/lookup pair tried inside a single guarded fetch attempt. */
type FetchDispatcherAttempt = {
  dispatcherPolicy?: PinnedDispatcherPolicy;
  lookupFn?: LookupFn;
};
type FetchMediaOptions = {
  url: string;
  fetchImpl?: FetchLike;
  requestInit?: RequestInit;
  filePathHint?: string;
  maxBytes?: number;
  maxRedirects?: number;
  /** Require HTTPS for the initial URL and every redirect target. */
  requireHttps?: boolean;
  /** Abort the complete guarded fetch and body operation after this deadline (ms). */
  timeoutMs?: number;
  /** Abort if final response headers have not arrived by this deadline (ms). */
  responseHeaderTimeoutMs?: number;
  /** Abort if the response body stops yielding data for this long (ms). */
  readIdleTimeoutMs?: number;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  dispatcherAttempts?: FetchDispatcherAttempt[];
  shouldRetryFetchError?: (error: unknown) => boolean;
  /**
   * Retries the complete guarded fetch/read-or-save operation. Dispatcher
   * attempts still run inside each retry attempt.
   */
  retry?: MediaFetchRetryOptions;
  /**
   * Allow an operator-configured explicit proxy to resolve target DNS after
   * hostname-policy checks instead of forcing local pinned-DNS first.
   */
  trustExplicitProxyDns?: boolean;
};
/** Options for validating and saving an existing Response body into the media store. */
type SaveResponseMediaOptions = {
  sourceUrl?: string;
  filePathHint?: string;
  maxBytes?: number;
  readIdleTimeoutMs?: number;
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Options for guarded URL fetches that are saved directly into the media store. */
type SaveRemoteMediaOptions = FetchMediaOptions & {
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Validates and saves a caller-provided response without performing a new fetch. */
declare function saveResponseMedia(res: Response, options?: SaveResponseMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and saves the body into the media store. */
declare function saveRemoteMedia(options: SaveRemoteMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
declare function readRemoteMediaBuffer(options: FetchMediaOptions): Promise<FetchMediaResult>;
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
declare const fetchRemoteMedia: typeof readRemoteMediaBuffer;
//#endregion
//#region src/channels/ack-reactions.d.ts
type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
/** Sent ack reaction state plus the cleanup hook callers can run after reply delivery. */
type AckReactionHandle = {
  ackReactionPromise: Promise<boolean>;
  ackReactionValue: string;
  remove: () => Promise<void>;
};
/**
 * Inputs for the reusable direct/group/mention gate shared by channel plugins.
 *
 * `effectiveWasMentioned` should already include any channel-specific mention
 * normalization. `shouldBypassMention` is only for an earlier channel gate that
 * proved the active conversation, such as a group activation state.
 */
type AckReactionGateParams = {
  scope: AckReactionScope | undefined;
  inboundEventKind?: "user_request" | "room_event";
  isDirect: boolean;
  isGroup: boolean;
  isMentionableGroup: boolean;
  canDetectMention: boolean;
  effectiveWasMentioned: boolean;
  shouldBypassMention?: boolean;
};
/** Resolves the generic ack reaction gate without sending or removing reactions. */
declare function shouldAckReaction(params: AckReactionGateParams): boolean;
/** Starts sending an ack reaction and returns the success-tracking cleanup handle. */
declare function createAckReactionHandle(params: {
  ackReactionValue: string;
  send: () => Promise<void>;
  remove: () => Promise<void>;
  onSendError?: (err: unknown) => void;
}): AckReactionHandle | null;
/** Schedules removal of a previously sent ack reaction after reply delivery. */
declare function removeAckReactionAfterReply(params: {
  removeAfterReply: boolean;
  ackReactionPromise: Promise<boolean> | null;
  ackReactionValue: string | null;
  remove: () => Promise<void>;
  onError?: (err: unknown) => void;
}): void;
/** Convenience wrapper that removes an ack reaction handle after reply delivery. */
declare function removeAckReactionHandleAfterReply(params: {
  removeAfterReply: boolean;
  ackReaction: AckReactionHandle | null | undefined;
  onError?: (err: unknown) => void;
}): void;
//#endregion
//#region src/auto-reply/inbound-debounce.d.ts
/** Resolve effective inbound debounce milliseconds from explicit, channel, and global config. */
declare function resolveInboundDebounceMs(params: {
  cfg: OpenClawConfig;
  channel: string;
  overrideMs?: number;
}): number;
/** A flush releases its debounce lane at admission while completion remains drainable. */
type InboundDebounceFlush = {
  admission: Promise<void>;
  completion: Promise<void>;
};
type InboundDebounceAdmissionLifecycleInput = {
  abortSignal?: AbortSignal;
  onAdopted?: () => void | Promise<void>;
  onDeferred?: () => boolean | void;
  onAdoptionFinalizing?: () => void;
  onFailed?: (error: unknown) => void | Promise<void>;
  onAbandoned?: () => void | Promise<void>;
};
/** Lifecycle shape passed to a channel dispatch so it can signal session-lane admission. */
type InboundDebounceAdmissionLifecycle = {
  abortSignal: AbortSignal;
  onAdopted: () => Promise<void>;
  onDeferred: () => boolean | void;
  onAdoptionFinalizing: () => void;
  onFailed?: (error: unknown) => Promise<void>;
  onAbandoned: () => Promise<void>;
};
/**
 * Start one flush and bind its admission signal to the turn lifecycle.
 * Completion also releases admission for gated work that never enters a session lane.
 */
declare function createInboundDebounceFlush(params: {
  lifecycle?: InboundDebounceAdmissionLifecycleInput;
  dispatch: (lifecycle: InboundDebounceAdmissionLifecycle) => Promise<void>;
}): InboundDebounceFlush;
/** Options for creating a keyed inbound debouncer. */
type InboundDebounceCreateParams<T> = {
  debounceMs: number;
  maxTrackedKeys?: number;
  buildKey: (item: T) => string | null | undefined;
  shouldDebounce?: (item: T) => boolean;
  resolveDebounceMs?: (item: T) => number | undefined;
  serializeImmediate?: boolean;
  onFlush: (items: T[], createFlush: typeof createInboundDebounceFlush) => InboundDebounceFlush;
  onError?: (err: unknown, items: T[]) => void;
  onCancel?: (items: T[]) => void;
};
/** Create a keyed debouncer with flush/cancel controls and same-key serialization. */
declare function createInboundDebouncer<T>(params: InboundDebounceCreateParams<T>): {
  enqueue: (item: T) => Promise<void>;
  flushKey: (key: string) => Promise<void>;
  cancelKey: (key: string) => boolean;
  drain: () => Promise<void>;
};
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
  /** True when this channel/user identity has an access-group rule configured. */
  configured: boolean;
  /** True when the configured rule permits the command. Ignored when unconfigured. */
  allowed: boolean;
};
/** Fallback policy for channels that have access groups globally disabled. */
type CommandGatingModeWhenAccessGroupsOff = "allow" | "deny" | "configured";
/** Resolves whether any configured authorizer permits a control command. */
declare function resolveCommandAuthorizedFromAuthorizers(params: {
  /** Global access-group switch for the channel/runtime. */
  useAccessGroups: boolean;
  /** Independent authorization sources, such as sender id and actor id. */
  authorizers: CommandAuthorizer[];
  /** Policy used only when `useAccessGroups` is false. Defaults to open. */
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): boolean;
//#endregion
//#region src/channels/reply-prefix.d.ts
type ModelSelectionContext = Parameters<NonNullable<GetReplyOptions["onModelSelected"]>>[0];
/**
 * Mutable response-prefix state shared between reply setup and model selection callbacks.
 */
type ReplyPrefixContextBundle = {
  prefixContext: ResponsePrefixContext;
  responsePrefix?: string;
  responsePrefixContextProvider: () => ResponsePrefixContext;
  onModelSelected: (ctx: ModelSelectionContext) => void;
};
/**
 * Reply option subset consumed by channel reply dispatchers.
 */
type ReplyPrefixOptions = Pick<ReplyPrefixContextBundle, "responsePrefix" | "responsePrefixContextProvider" | "onModelSelected">;
/**
 * Creates the reply-prefix options object expected by `getReply` call sites.
 */
declare function createReplyPrefixOptions(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel?: string;
  accountId?: string;
}): ReplyPrefixOptions;
//#endregion
//#region src/channels/message/reply-pipeline.d.ts
/** Parameters for building a channel reply pipeline with prefix, typing, and payload transforms. */
type CreateChannelReplyPipelineParams = {
  /** Full config used for reply prefix and channel plugin transform resolution. */
  cfg: Parameters<typeof createReplyPrefixOptions>[0]["cfg"];
  /** Agent id used in reply prefix context. */
  agentId: string;
  /** Optional channel id for prefix context and plugin transform lookup. */
  channel?: string;
  /** Optional channel account id for prefix context and plugin transform lookup. */
  accountId?: string;
  /** Typing callback factory input. */
  typing?: CreateTypingCallbacksParams;
  /** Prebuilt typing callbacks that take precedence over `typing`. */
  typingCallbacks?: TypingCallbacks;
  /** Explicit payload transform; avoids channel plugin lookup when provided. */
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
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
  avatar?: string;
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
  visibleReplySent?: boolean;
  /** Final provider-visible text used for this logical payload's terminal observation. */
  content?: string;
};
/** Result returned after delivering one channel reply payload. */
type ChannelDeliveryResult = ChannelDeliveryOutcome & {
  deliveryIntent?: ChannelDeliveryIntent;
  /** Intentional no-send outcome after payload policy or modifying hooks settle. */
  suppression?: {
    reason: OutboundPayloadDeliverySuppressionReason | "channel_transform" | "no_visible_result";
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
  /** Same-payload native settlement; resolved fields override this result before observation. */
  finalization?: Promise<ChannelDeliveryOutcome>;
};
/** Durable outbound delivery options available to channel turn delivery adapters. */
type ChannelTurnDurableDeliveryOptions = Pick<DeliverOutboundPayloadsParams, "deps" | "formatting" | "identity" | "mediaAccess" | "replyToMode" | "silent" | "threadId"> & {
  to?: string | null;
  replyToId?: string | null;
  requiredCapabilities?: DurableFinalDeliveryRequirements;
};
type ChannelDeliveryAdapterBase = {
  /** Return null when channel policy intentionally suppresses this logical payload. */
  preparePayload?: (payload: ReplyPayload, info: ChannelDeliveryInfo) => MaybePromise$1<ReplyPayload | null>;
  onDelivered?: (payload: ReplyPayload, info: ChannelDeliveryInfo, result: ChannelDeliveryResult | void) => Promise<void> | void;
  /** Let core emit the one canonical `message_sent` after non-durable provider settlement. */
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
  /** Instance-bound reply dispatcher supplied by the owning plugin runtime. */
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
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
  botLoopProtection?: ChannelBotLoopProtectionFacts;
  /** Transport-defined outbound source identity, such as a webhook id. */
  outboundEchoSourceId?: string;
  log?: (event: ChannelTurnLogEvent) => void;
  messageId?: string;
  /** Canonical adoption lifecycle threaded into replyOptions. */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
};
type PreparedChannelTurnDispatchSkipReason = "botLoopProtection" | "observeOnly" | "outboundEcho";
/** Lifecycle ownership declared alongside an already-prepared dispatch runner. */
type PreparedChannelTurnDispatchLifecycle = {
  /** Exact adoption lifecycle captured by runDispatch, or undefined for non-durable turns. */
  turnAdoptionLifecycle: TurnAdoptionLifecycle | undefined;
  /** Releases resources that runDispatch would otherwise settle when dispatch is skipped. */
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
  runDispatch: () => Promise<TDispatchResult>;
  /** Optional for the legacy direct prepared runner; inbound adapters use the stricter type. */
  runDispatchLifecycle?: PreparedChannelTurnDispatchLifecycle;
  observeOnlyDispatchResult?: TDispatchResult;
  admission?: Extract<ChannelTurnAdmission, {
    kind: "dispatch" | "observeOnly";
  }>;
  botLoopProtection?: ChannelBotLoopProtectionFacts;
  /** Transport-defined outbound source identity, such as a webhook id. */
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
  log?: (event: ChannelTurnLogEvent) => void;
  /** Canonical adoption lifecycle for this turn. */
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
  commands?: Pick<ChannelIngressCommandAccess, "authorized">;
  /** Channel-configured policy resolved at the trusted ingress boundary. */
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
  extra?: Record<string, unknown>;
  /** Exact host-resolved ingress result, or an explicit unsupported adapter marker. */
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
declare function buildChannelInboundEventContext(params: BuildChannelInboundEventContextAsyncParams): Promise<BuiltChannelInboundEventContext>;
declare function buildChannelInboundEventContext(params: BuildChannelInboundEventContextParams): BuiltChannelInboundEventContext;
//#endregion
//#region src/channels/turn/run-channel-turn.d.ts
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
    readRemoteMediaBuffer: typeof readRemoteMediaBuffer;
    /** @deprecated Use `readRemoteMediaBuffer`. */
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
    /** @deprecated Prefer channel turn helpers that record inbound sessions as part of dispatch. */
    resolveStorePath: typeof resolveSessionStorePathCore;
    readSessionUpdatedAt: ReadSessionUpdatedAt;
    recordSessionMetaFromInbound: RecordSessionMetaFromInbound;
    /** @deprecated Prefer channel turn helpers that record inbound sessions as part of dispatch. */
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
    run: typeof runChannelTurn;
    /** @deprecated Prefer `run` for raw inbound events or `dispatchReply` for assembled contexts. */
    runPreparedReply: typeof runPreparedChannelTurn;
    dispatch: typeof dispatchRoutedChannelTurn;
    /** Compatibility escape hatch; prefer `dispatch`, which keeps session wiring in core. */
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
//#region src/agents/run-wait.types.d.ts
/** Normalized terminal or pending state returned by `agent.wait`. */
type AgentWaitResult = {
  status: "ok" | "timeout" | "error" | "pending";
  error?: string;
  startedAt?: number;
  endedAt?: number;
  stopReason?: string;
  livenessState?: string;
  yielded?: boolean;
  pendingError?: boolean;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
  terminalReply?: AgentRunTerminalReplySnapshot;
};
//#endregion
//#region src/plugins/runtime/types.d.ts
type PluginRuntimeChannel = PluginRuntimeChannel$1;
type SubagentRunParams = {
  sessionKey: string;
  message: string;
  /** Run with an exact empty tool surface. */
  disableTools?: boolean;
  /** Add exact tools registered by the calling plugin to the worker's normal tool surface. */
  toolsAlsoAllow?: string[];
  provider?: string;
  model?: string;
  extraSystemPrompt?: string;
  lane?: string;
  lightContext?: boolean;
  deliver?: boolean;
  /** Deliver the completion to the authenticated requester of the current hook invocation. */
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
  /** Canonical accepted session identity. Optional for explicit/custom runtimes. */
  sessionKey?: string;
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
    platform?: string;
    clientId?: string;
    remoteIp?: string;
    connected?: boolean;
    connectedAtMs?: number;
    lastSeenAtMs?: number;
    caps?: string[];
    commands?: string[];
    /** True only for the node host installed alongside this Gateway. */
    gatewayLocal?: boolean;
    /** Advertised commands currently permitted by Gateway node-command policy. */
    invocableCommands?: string[];
    nodePluginTools?: NodePluginToolDescriptor[];
  }>;
};
type RuntimeNodeInvokeParams = {
  nodeId: string;
  command: string;
  params?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
  sessionKey?: string;
  /** Cancel the invocation and any work already dispatched to a first-party node. */
  signal?: AbortSignal;
  /** Requested Gateway scopes. Honored only for bundled or trusted official plugins. */
  scopes?: OperatorScope[];
};
/** A lifecycle-bound, complete-message binary channel for one node invocation. */
type RuntimeNodeDuplexChannel = {
  send: (message: Uint8Array) => Promise<void>;
  onMessage: (listener: (message: Uint8Array) => void | Promise<void>) => () => void;
  closed: Promise<unknown>;
  close: () => void;
};
type RuntimeGatewayRequestOptions = {
  timeoutMs?: number;
  /** Requested Gateway scopes. Honored only for bundled or trusted official plugins. */
  scopes?: OperatorScope[];
};
/** Trusted in-process runtime surface injected into native plugins. */
type PluginRuntime = PluginRuntimeCore & {
  gateway: {
    /** Whether this process owns an active Gateway request context. */
    isAvailable: () => Promise<boolean>;
    /** Dispatch a Gateway method as the current trusted plugin. */
    request: <T = unknown>(method: string, params?: Record<string, unknown>, options?: RuntimeGatewayRequestOptions) => Promise<T>;
  };
  subagent: {
    run: (params: SubagentRunParams) => Promise<SubagentRunResult>;
    waitForRun: (params: SubagentWaitParams) => Promise<AgentWaitResult>;
    getSessionMessages: (params: SubagentGetSessionMessagesParams) => Promise<SubagentGetSessionMessagesResult>;
    deleteSession: (params: SubagentDeleteSessionParams) => Promise<void>;
  };
  nodes: {
    list: (params?: RuntimeNodeListParams) => Promise<RuntimeNodeListResult>;
    invoke: (params: RuntimeNodeInvokeParams) => Promise<unknown>;
    /** Open a connection-scoped binary node command inside the trusted Gateway runtime. */
    openDuplex: (params: RuntimeNodeInvokeParams & {
      maxMessageBytes?: number;
      maxOutstandingDeliveryBytes?: number;
    }) => Promise<RuntimeNodeDuplexChannel>;
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
//#endregion
//#region src/plugins/session-catalog.d.ts
type SessionCatalogListProviderParams = {
  /** Gateway always supplies this; optional only for pre-existing external provider types. */
  agentId?: string;
  /** False when Gateway-local scans must not inherit a root from process HOME. */
  allowProcessHomeFallback?: boolean;
  /** Trimmed, non-empty search capped at 500 UTF-16 code units by the gateway. */
  search?: string;
  limitPerHost?: number;
  hostIds?: string[];
  cursors?: Record<string, string>;
  /** Request-owned shared entries. Providers must not mutate or retain them past `list`. */
  sessionEntries?: SessionCatalogEntrySnapshot;
  /** Lazily lists Gateway nodes once per catalog request. Providers must not retain this past `list`. */
  listNodes?: () => ReturnType<PluginRuntime["nodes"]["list"]>;
  /** Publishes completed hosts without waiting for slower machines in the same list. */
  onHost?: (host: SessionCatalogHost) => void;
};
type SessionCatalogReadProviderParams = Omit<SessionsCatalogReadParams, "catalogId"> & {
  /** Gateway always supplies this; optional only for pre-existing external provider types. */
  agentId?: string;
  /** False when Gateway-local reads must not inherit a root from process HOME. */
  allowProcessHomeFallback?: boolean;
};
type SessionCatalogContinueProviderParams = Omit<SessionsCatalogContinueParams, "catalogId"> & {
  /** Gateway always supplies this; optional only for pre-existing external provider types. */
  agentId?: string;
  /** False when Gateway-local continuation must not inherit a root from process HOME. */
  allowProcessHomeFallback?: boolean;
  /** Caller's gateway scopes so providers can gate high-authority continues up front. */
  clientScopes?: readonly string[];
};
type SessionCatalogArchiveProviderParams = Omit<SessionsCatalogArchiveParams, "catalogId"> & {
  /** Gateway always supplies this; optional only for pre-existing external provider types. */
  agentId?: string;
  /** False when Gateway-local archive must not inherit a root from process HOME. */
  allowProcessHomeFallback?: boolean;
};
type SessionCatalogStartTerminalProviderParams = {
  /** False when Gateway-local terminal start must not inherit process HOME. */
  allowProcessHomeFallback?: boolean;
  agentId: string;
  cwd: string;
  initialMessage?: string;
  /** Present only when the caller selected a catalog host backed by this node. */
  nodeId?: string;
};
type SessionCatalogTerminalPlan = {
  kind: "local";
  argv: string[];
  cwd?: string;
  title?: string;
  /** Bounded command-specific environment overrides. */
  env?: Record<string, string>;
  /** PATH that resolved argv[0], needed by env-based script interpreters. */
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
  model: string;
  /** Concrete runtime pinned onto the created session so config reloads cannot retarget it. */
  agentRuntime: string;
};
interface SessionCatalogEntrySummary {
  sessionKey: string;
  entry: SessionEntry;
}
/** Shared, logically frozen store state for one request; copy locally before mutating. */
type SessionCatalogEntrySnapshot = {
  entriesForAgent: (agentId: string) => readonly SessionCatalogEntrySummary[];
  /** Request-wide flatten; optional for compatibility with pre-flatten plugin hosts. */
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
  sessionKey: string;
  /** Plugin binding installed for this authenticated Control UI session. */
  conversationBinding?: {
    summary?: string;
    detachHint?: string;
    data?: Record<string, unknown>;
  };
  /** Publishes provider state only after the requested binding is durable. */
  afterConversationBound?: () => Promise<void>;
  /** Upstream link seed so the monitor can detect direct external activity. */
  upstream?: {
    kind: SessionUpstreamKind;
    ref: SessionUpstreamJsonValue;
    marker: SessionUpstreamJsonValue;
  };
};
type SessionCatalogCreateParams = {
  /** Agent whose model/runtime policy must authorize the catalog target. */
  agentId?: string;
};
type SessionCatalogProvider = {
  id: string;
  label: string;
  /** Declares that every HOME-sensitive action honors the host isolation policy. */
  supportsProcessHomeIsolation?: true;
  /** Config-derived target; the Gateway memoizes it for one runtime-config object identity. */
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
    /** Gateway always supplies this; optional only for pre-existing external provider types. */
    agentId?: string;
    hostId: string;
    threadId: string;
  }) => Promise<SessionCatalogTerminalPlan>;
  startTerminalSession?: (request: SessionCatalogStartTerminalProviderParams) => Promise<SessionCatalogTerminalPlan>;
};
//#endregion
//#region src/plugins/types.mcp-connection.d.ts
/** Plugin-owned MCP server connection resolver contracts. */
/**
 * Trusted runtime identity for per-requester MCP connection resolution.
 * Only host-provided fields; plugins must not invent sender identity.
 * Future trusted fields (for example cron/subagent user context) can be added additively.
 */
type McpServerConnectionResolveContext = {
  /** Trusted message sender id. Required; runs without one fail closed. */
  requesterSenderId: string;
  /** Channel account id that received the message. */
  agentAccountId?: string;
  /** Message channel id (for example telegram or slack). */
  messageChannel?: string;
};
/** Transport connection resolved for one requester-scoped MCP server. */
type McpServerConnectionResolved = {
  url: string;
  /** Per-user credentials; never logged, fingerprinted, or persisted by core. */
  headers?: Record<string, string>;
};
/**
 * Plugin-owned connection resolver for a statically declared MCP server.
 * Server name/tool surface stay static; only the transport is requester-bound.
 */
type OpenClawPluginMcpServerConnectionResolver = {
  /** Server name matching `mcp.servers` / bundle MCP declaration. */
  serverName: string;
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
type ChannelPlugin$1 = ChannelPlugin$3;
type CliBackendPlugin$1 = CliBackendPlugin;
type ImageGenerationProviderPlugin = ImageGenerationProviderPlugin$1;
type MediaUnderstandingProviderPlugin = MediaUnderstandingProviderPlugin$1;
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type MusicGenerationProviderPlugin = MusicGenerationProviderPlugin$1;
type OpenClawPluginCliRootCommandDescriptor = OpenClawPluginCliRootCommandDescriptor$1;
type OpenClawPluginCliRegistrar = OpenClawPluginCliRegistrar$1;
type OpenClawPluginCommandDefinition$1 = OpenClawPluginCommandDefinition;
type PluginInteractiveHandlerRegistration = PluginInteractiveHandlerRegistration$1;
type OpenClawPluginGatewayRuntimeScopeSurface = OpenClawPluginGatewayRuntimeScopeSurface$1;
type OpenClawGatewayDiscoveryService = OpenClawGatewayDiscoveryService$1;
type OpenClawPluginHttpRouteHandler = OpenClawPluginHttpRouteHandler$1;
type OpenClawPluginHttpRouteMatch = OpenClawPluginHttpRouteMatch$1;
type OpenClawPluginHostedMediaResolver = OpenClawPluginHostedMediaResolver$1;
type OpenClawPluginReloadRegistration = OpenClawPluginReloadRegistration$1;
type OpenClawPluginSecurityAuditCollector = OpenClawPluginSecurityAuditCollector$1;
type OpenClawPluginService = OpenClawPluginService$1;
type OpenClawPluginToolFactory$1 = OpenClawPluginToolFactory;
type PluginConversationBindingResolvedEvent = PluginConversationBindingResolvedEvent$1;
type TypedPluginHookRegistration = PluginHookRegistration$1;
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
  optional: boolean;
  /** Loader-owned provenance. Missing values are conservative legacy registrations. */
  origin?: PluginOrigin;
  source: string;
  rootDir?: string;
};
type PluginCliRegistration = {
  pluginId: string;
  pluginName?: string;
  register: OpenClawPluginCliRegistrar;
  parentPath: string[];
  commands: string[];
  descriptors: OpenClawPluginCliRootCommandDescriptor[];
  source: string;
  rootDir?: string;
};
/** Gateway HTTP route registered by a plugin runtime. */
type PluginHttpRouteRegistration$1 = {
  pluginId?: string;
  path: string;
  handler: OpenClawPluginHttpRouteHandler;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match: OpenClawPluginHttpRouteMatch;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface;
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
  resolver: OpenClawPluginHostedMediaResolver;
  source: string;
  rootDir?: string;
};
type PluginChannelRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin$1;
  /** Exact record-bound runtime resolver captured when the active plugin registered the channel. */
  resolveChannelRuntime?: () => PluginRuntime["channel"];
  /** Loader-owned provenance. Missing values are conservative legacy registrations. */
  origin?: PluginOrigin;
  source: string;
  rootDir?: string;
};
type PluginChannelSetupRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin$1;
  /** Loader-owned provenance. Missing values are conservative legacy registrations. */
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
type PluginBoardWidgetContentKindRegistration = {
  pluginId: string;
  pluginKind: string;
  definition: PluginBoardWidgetContentKind;
};
type PluginCliBackendRegistration = {
  pluginId: string;
  pluginName?: string;
  builtWithOpenClawVersion?: string;
  backend: CliBackendPlugin$1;
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
  nativeCompaction?: AgentHarnessNativeCompaction;
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
  service: OpenClawPluginService;
  source: string;
  origin: PluginOrigin;
  trustedOfficialInstall?: boolean;
  rootDir?: string;
};
type PluginGatewayDiscoveryServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawGatewayDiscoveryService;
  source: string;
  rootDir?: string;
};
type PluginReloadRegistration = {
  pluginId: string;
  pluginName?: string;
  registration: OpenClawPluginReloadRegistration;
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
type PluginWidgetPresenterRegistration = {
  pluginId: string;
  pluginName?: string;
  presenter: WidgetPresenter;
  source: string;
  rootDir?: string;
};
type PluginSecurityAuditCollectorRegistration = {
  pluginId: string;
  pluginName?: string;
  collector: OpenClawPluginSecurityAuditCollector;
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
type PluginInteractiveHandlerRegistryRegistration = PluginInteractiveHandlerRegistration & {
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
  agentHarnessIds: string[];
  cliCommands: string[];
  services: string[];
  gatewayDiscoveryServiceIds: string[];
  commands: string[];
  commandAliases?: PluginManifestRecord["commandAliases"];
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
  boardWidgetContentKinds: Map<string, PluginBoardWidgetContentKindRegistration>;
  coreGatewayMethodNames: string[];
  httpRoutes: PluginHttpRouteRegistration$1[];
  hostedMediaResolvers: PluginHostedMediaResolverRegistration[];
  widgetPresenters: PluginWidgetPresenterRegistration[];
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
  runtime: RuntimeEnv;
  /** Cancels browser callbacks, device polling, and other app-owned auth work. */
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
  /** Canonical provider/model reference returned unchanged during activation. */
  modelRef: string;
  /** Optional provider-owned detail shown beside the auth-choice label. */
  detail?: string;
};
type ProviderAppGuidedSetup = {
  /**
   * Report whether the provider's local service is reachable, even when no
   * model is suitable for automatic activation. This probe must be read-only.
   */
  detectAvailability?: (ctx: ProviderAppGuidedSetupContext) => Promise<boolean>;
  /** Detection is read-only: no model pull, download, login, or config write. */
  detect: (ctx: ProviderAppGuidedSetupContext) => Promise<ProviderAppGuidedSetupCandidate | null>;
  /** Recheck one detected model and return the config required for a live probe. */
  prepare: (ctx: ProviderAppGuidedSetupContext & {
    modelRef: string;
  }) => Promise<ProviderAuthResult | null>;
};
type ProviderAuthMethod = {
  id: string;
  label: string;
  hint?: string;
  kind: ProviderAuthKind;
  /** Provider-owned model used to validate app-guided secret setup. */
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
  runNonInteractive?: (ctx: ProviderAuthMethodNonInteractiveContext) => Promise<OpenClawConfig | null>;
  /** Side-effect-free prerequisite validation used before destructive reset handling. */
  validateNonInteractive?: (ctx: ProviderAuthMethodNonInteractiveValidationContext) => Promise<boolean>;
  /** Provider-owned local model discovery for the shared guided setup ladder. */
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
//#region src/plugins/provider-catalog.types.d.ts
type ProviderCatalogOrder = "simple" | "profile" | "paired" | "late";
type ProviderCatalogContext = {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  /** Normalized provider identities selected for this catalog owner; absent means the full catalog. */
  providerIds?: readonly string[];
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
//#region src/plugins/provider-runtime-model.types.d.ts
/**
 * Fully-resolved runtime model shape used after provider/plugin-owned
 * discovery, overrides, and compat normalization.
 */
type ProviderRuntimeModel = Omit<Model, "compat"> & {
  compat?: ModelCompatConfig;
  contextWindows?: ModelCatalogContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  /** Host-resolved provenance for the top-level wire output cap. */
  maxTokensSource?: "configured" | "discovered";
  params?: Record<string, unknown>;
  requestTimeoutMs?: number;
  mediaInput?: ModelMediaInputConfig;
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
//#region src/llm/model-registry.d.ts
/** Registry abstraction used by model pickers and provider availability checks. */
type ModelRegistry = {
  getAll(): Model[];
  getAvailable(): Model[];
  find(provider: string, modelId: string): Model | undefined;
  hasConfiguredAuth(model: Model): boolean;
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
 * Optional async preparation for dynamic model resolution.
 *
 * Called only from async model resolution paths. Providers can return the
 * requested model directly or refresh reusable metadata before the sync retry.
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
  }) => string | undefined;
  /** Ordered API-key/token candidates, including resolved SecretRefs, for credential classification. */
  resolveApiKeyCandidatesFromConfigAndStore?: (params?: {
    providerIds?: string[];
    envDirect?: Array<string | undefined>;
  }) => Promise<string[]>;
  resolveOAuthToken: (params?: {
    provider?: string;
    excludeProfileIds?: string[];
  }) => Promise<ProviderUsageAuthToken | null>;
};
type ProviderUsageAuthToken = {
  token: string;
  accountId?: string;
  /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */
  subscriptionType?: string;
  rateLimitTier?: string;
  /** Account email captured on the resolved credential, when known. */
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
  authProfileId?: string;
  /** Non-secret plan metadata from the resolved credential (e.g. Claude "max"). */
  subscriptionType?: string;
  rateLimitTier?: string;
  /** Account email captured on the resolved credential, when known. */
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
  model?: ProviderRuntimeModel;
  /** Wire-format API before simple completion projects an internal transport alias. */
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
   * Keep this hook cheap and deterministic. Async model discovery belongs in
   * `prepareDynamicModel`, which can return the prepared model directly.
   */
  resolveDynamicModel?: (ctx: ProviderResolveDynamicModelContext) => ProviderRuntimeModel | null | undefined;
  /**
   * Optional async preparation for dynamic model resolution.
   *
   * OpenClaw calls this only from async model resolution paths. Return the
   * requested model directly, or return nothing to retry `resolveDynamicModel`.
   */
  prepareDynamicModel?: (ctx: ProviderPrepareDynamicModelContext) => Promise<ProviderRuntimeModel | void>;
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
   * Legacy auth-profile ids that generic auth must ignore and `openclaw doctor` should remove.
   *
   * Use this when a provider plugin replaces an older core-managed profile id
   * and wants cleanup/migration messaging to live with the provider instead of
   * in hardcoded doctor tables. A runtime-only external CLI profile remains usable by its exact
   * provider when it intentionally reuses a retired id.
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
//#region src/agents/embedded-agent-runner/model.inline-provider.d.ts
/**
 * Normalizes inline `models.providers` config into runtime model entries.
 */
type InlineModelEntry = Omit<ModelDefinitionConfig, "api" | "contextWindow"> & {
  api?: Api;
  contextWindow?: number;
  provider: string;
  baseUrl?: string;
  headers?: Record<string, string>;
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
//#region src/agents/agent-auth-credential-modes.d.ts
/** Secret-free credential modes captured by a prepared agent runtime. */
type PreparedAgentCredentialModes = Readonly<Record<string, "api_key" | "oauth" | "token">>;
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
  workspaceDir?: string;
  /** Run-prepared repository root; null means discovery completed without a match. */
  repoRoot?: string | null;
  /** Stable identity derived from repoRoot; null means the run is outside a repository. */
  projectKey?: string | null;
  /** Session active project set, ordered most-recent first; empty before run binding. */
  activeProjectKeys: readonly string[];
  config: OpenClawConfig;
  /** Secret-free usable auth modes captured by this exact lifecycle generation. */
  authModes: PreparedAgentCredentialModes;
  metadataSnapshot: PluginMetadataSnapshot;
  messageToolCatalog?: PreparedMessageToolCatalog;
  mediaCapabilityProviders?: ReturnType<typeof prepareMediaCapabilityProviders>;
  /** Registry value owned by this generation; omitted from read-only/static-catalog builds. */
  pluginRegistry?: PluginRegistry;
  allowGatewaySubagentBinding: boolean;
  /**
   * Configured model projection used by turn admission and synchronous callers.
   * Full inventory discovery is deliberately outside the startup publication boundary.
   */
  modelCatalog: ModelCatalogSnapshot;
  /** Reads a completed full catalog without starting provider discovery. */
  readFullModelCatalog?: () => ModelCatalogSnapshot | undefined;
  /** Builds this generation's full control-plane catalog without replacing turn facts. */
  loadFullModelCatalog?: (options?: {
    refresh?: boolean;
  }) => Promise<ModelCatalogSnapshot>;
  /** Full static models for configured refs, resolved once at the lifecycle boundary. */
  configuredRuntimeModels: readonly PreparedConfiguredRuntimeModel[];
  /** Inline provider projection prepared once for all resolutions owned by this snapshot. */
  inlineProviderModels: readonly InlineModelEntry[];
  createStores: () => PreparedModelRuntimeStores;
}>;
type PreparedModelRuntimeStores = {
  authStorage: AuthStorage;
  modelRegistry: ModelRegistry$1;
};
//#endregion
//#region src/plugins/provider-runtime.d.ts
declare function runProviderDynamicModel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function prepareProviderDynamicModel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderPrepareDynamicModelContext;
}): Promise<ProviderRuntimeModel | void>;
declare function shouldPreferProviderRuntimeResolvedModel(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderPreferRuntimeResolvedModelContext;
}): boolean;
declare function normalizeProviderResolvedModelWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
  context: {
    config?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    provider: string;
    modelId: string;
    model: ProviderRuntimeModel;
  };
}): ProviderRuntimeModel | undefined;
declare function applyProviderResolvedTransportWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderNormalizeResolvedModelContext;
}): ProviderRuntimeModel | undefined;
declare function normalizeProviderTransportWithPlugin(params: {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderNormalizeTransportContext;
}): {
  api?: string | null;
  baseUrl?: string;
} | undefined;
declare function buildProviderUnknownModelHintWithPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  context: ProviderBuildUnknownModelHintContext;
}): string | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/model.provider-hooks.d.ts
type ProviderRuntimeHooks = {
  applyProviderResolvedTransportWithPlugin?: (params: Parameters<typeof applyProviderResolvedTransportWithPlugin>[0]) => unknown;
  buildProviderUnknownModelHintWithPlugin: (params: Parameters<typeof buildProviderUnknownModelHintWithPlugin>[0]) => string | undefined;
  prepareProviderDynamicModel: (params: Parameters<typeof prepareProviderDynamicModel>[0]) => ReturnType<typeof prepareProviderDynamicModel>;
  runProviderDynamicModel: (params: Parameters<typeof runProviderDynamicModel>[0]) => unknown;
  shouldPreferProviderRuntimeResolvedModel?: (params: Parameters<typeof shouldPreferProviderRuntimeResolvedModel>[0]) => boolean;
  normalizeProviderResolvedModelWithPlugin: (params: Parameters<typeof normalizeProviderResolvedModelWithPlugin>[0]) => unknown;
  normalizeProviderTransportWithPlugin: typeof normalizeProviderTransportWithPlugin;
};
//#endregion
//#region src/agents/embedded-agent-runner/model.d.ts
type CommonModelResolutionOptions = {
  authStorage?: AuthStorage;
  modelRegistry?: ModelRegistry$1;
  agentId?: string;
  runtimeHooks?: ProviderRuntimeHooks;
  skipProviderRuntimeHooks?: boolean;
  workspaceDir?: string;
  authProfileId?: string;
  authProfileMode?: AuthProfileCredential["type"] | "aws-sdk";
  preferredProfile?: string;
};
type AsyncModelResolutionOptions = CommonModelResolutionOptions & {
  allowBundledStaticCatalogFallback?: boolean;
  preferBundledStaticCatalogTransport?: boolean;
  agentRuntimeId?: string;
  skipAgentDiscovery?: boolean;
  preparedModelRuntime?: PreparedModelRuntimeSnapshot;
};
declare function resolveModelAsync(provider: string, modelId: string, agentDir?: string, cfg?: OpenClawConfig, options?: AsyncModelResolutionOptions): Promise<{
  model?: Model;
  error?: string;
  authStorage: AuthStorage;
  modelRegistry: ModelRegistry$1;
}>;
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.d.ts
type AuthProfileUpsertParams = {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
  stateDir?: string;
};
/** Upserts an auth profile under the store lock, returning null on store write failure. */
declare function upsertAuthProfileWithLock(params: AuthProfileUpsertParams): Promise<AuthProfileStore | null>;
/** Upserts an auth profile under the store lock, failing when the store cannot be written. */
declare function upsertAuthProfileWithLockOrThrow(params: Parameters<typeof upsertAuthProfileWithLock>[0]): Promise<void>;
//#endregion
//#region src/agents/auth-profiles/profiles.d.ts
/** Upserts an auth profile immediately into the local store. */
declare function upsertAuthProfile(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
}): void;
/** Removes auth profiles and related state for a provider, optionally narrowed to exact IDs. */
declare function removeProviderAuthProfilesWithLock(params: {
  provider: string;
  agentDir?: string;
  profileIds?: readonly string[];
}): Promise<AuthProfileStore | null>;
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
/** Return the AWS credential env var that proves SDK auth is configured. */
declare function resolveAwsSdkEnvVarName(env?: NodeJS.ProcessEnv): string | undefined;
/** Require a normalized API key or throw a provider-auth error. */
declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
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
  credentialPrecedence?: ProviderCredentialPrecedence;
  /** Skip implicit profile discovery for a prepared env/config fallback attempt. */
  allowAuthProfileFallback?: boolean;
  /** Skip plugin setup fallback when the prepared route already excludes it. */
  skipSetupProviderFallback?: boolean;
  modelId?: string;
  modelApi?: string;
  /** Keep SecretRef-backed model credentials opaque until a sentinel-aware transport boundary. */
  secretSentinels?: boolean;
}): Promise<ResolvedProviderAuth>;
//#endregion
//#region src/agents/model-auth-model.d.ts
type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
//#endregion
//#region src/agents/simple-completion-runtime.d.ts
type AllowedMissingApiKeyMode = ResolvedProviderAuth["mode"];
type SimpleCompletionModelOptions = {
  maxTokens?: number;
  temperature?: number;
  reasoning?: ThinkLevel | ThinkingLevel;
  signal?: AbortSignal;
};
type PreparedSimpleCompletionModel = {
  model: Model;
  auth: ResolvedProviderAuth;
  /** Non-reversible owner proof captured from the same auth snapshot. */
  sourceAuthFingerprint?: string;
} | {
  error: string;
  auth?: ResolvedProviderAuth;
};
type AgentSimpleCompletionSelection = {
  provider: string;
  modelId: string;
  /** Provider used for auth/transport when runtime policy redirects the logical model ref. */
  runtimeProvider?: string;
  profileId?: string;
  agentDir: string;
};
type PreparedSimpleCompletionModelForAgent = (Extract<PreparedSimpleCompletionModel, {
  model: Model;
}> & {
  selection: AgentSimpleCompletionSelection;
}) | (Extract<PreparedSimpleCompletionModel, {
  error: string;
}> & {
  selection?: AgentSimpleCompletionSelection;
});
declare function prepareSimpleCompletionModel(params: {
  cfg: OpenClawConfig | undefined;
  agentId?: string;
  provider: string;
  modelId: string;
  agentDir?: string;
  profileId?: string;
  preferredProfile?: string;
  allowMissingApiKeyModes?: ReadonlyArray<AllowedMissingApiKeyMode>;
  allowBundledStaticCatalogFallback?: boolean;
  skipAgentDiscovery?: boolean;
  bindAuthOwner?: boolean;
  modelResolver?: typeof resolveModelAsync;
  /** Internal caller-owned generation. Public plugin callers use the agent helper below. */
  preparedModelRuntime?: PreparedModelRuntimeSnapshot;
  workspaceDir?: string;
  agentRuntimeId?: string;
}): Promise<PreparedSimpleCompletionModel>;
declare function prepareSimpleCompletionModelForAgent(params: {
  cfg: OpenClawConfig;
  agentId: string;
  agentDir?: string;
  modelRef?: string;
  useUtilityModel?: boolean;
  preferredProfile?: string;
  allowMissingApiKeyModes?: ReadonlyArray<AllowedMissingApiKeyMode>;
  allowBundledStaticCatalogFallback?: boolean;
  /** @deprecated no-op; kept for plugin-SDK source compatibility, remove at next SDK-breaking window. */
  useAsyncModelResolution?: boolean;
  skipAgentDiscovery?: boolean;
  bindAuthOwner?: boolean;
  modelResolver?: typeof resolveModelAsync;
}): Promise<PreparedSimpleCompletionModelForAgent>;
declare function completeWithPreparedSimpleCompletionModel(params: {
  model: Model;
  auth: ResolvedProviderAuth;
  context: Parameters<typeof completeSimple>[1];
  cfg?: OpenClawConfig;
  options?: SimpleCompletionModelOptions;
}): Promise<AssistantMessage>;
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
//#region src/tts/tts-core.d.ts
type SummarizeTextDeps = {
  completeWithPreparedSimpleCompletionModel: typeof completeWithPreparedSimpleCompletionModel;
  prepareSimpleCompletionModel: typeof prepareSimpleCompletionModel;
  requireApiKey: typeof requireApiKey;
};
type SummarizeResult = {
  summary: string;
  latencyMs: number;
  inputLength: number;
  outputLength: number;
};
/** Summarize long text before synthesis using the configured summary model. */
declare function summarizeText(params: {
  text: string;
  targetLength: number;
  cfg: OpenClawConfig;
  config: ResolvedTtsConfig;
  timeoutMs: number;
}, deps?: SummarizeTextDeps): Promise<SummarizeResult>;
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
//#region src/tts/tts-settings.d.ts
declare function setTtsMachinePrefsPathResolver(resolver?: () => string | undefined): void;
declare function resolveModelOverridePolicy(overrides: TtsModelOverrideConfig | undefined): ResolvedTtsModelOverrides;
declare function resolveTtsConfig(cfgInput: OpenClawConfig, contextOrAgentId?: string | TtsConfigResolutionContext): ResolvedTtsConfig;
declare function resolveTtsPrefsPath(config: ResolvedTtsConfig): string;
declare function resolveTtsAutoMode(params: {
  config: ResolvedTtsConfig;
  prefsPath: string;
  sessionAuto?: string;
}): TtsAutoMode;
declare function buildTtsSystemPromptHint(cfg: OpenClawConfig, agentId?: string, options?: {
  messageToolOnly?: boolean;
}): string | undefined;
declare function isTtsEnabled(config: ResolvedTtsConfig, prefsPath: string, sessionAuto?: string): boolean;
declare function getTtsPersona(config: ResolvedTtsConfig, prefsPath: string): ResolvedTtsPersona | undefined;
declare function listTtsPersonas(config: ResolvedTtsConfig): ResolvedTtsPersona[];
declare function getTtsMaxLength(prefsPath: string): number;
declare function isSummarizationEnabled(prefsPath: string): boolean;
//#endregion
//#region src/tts/tts-provider-resolution.d.ts
declare function getResolvedSpeechProviderConfig(config: ResolvedTtsConfig, providerId: string, cfg?: OpenClawConfig): SpeechProviderConfig;
declare function resolveTtsProviderOrder(primary: TtsProvider, cfg?: OpenClawConfig, providers?: readonly SpeechProviderPlugin$1[]): TtsProvider[];
declare function isTtsProviderConfigured(config: ResolvedTtsConfig, provider: TtsProvider | SpeechProviderPlugin$1, cfg?: OpenClawConfig): boolean;
//#endregion
//#region src/tts/provider-registry-core.d.ts
/** Normalize user/provider IDs into the canonical speech provider ID shape. */
declare function normalizeSpeechProviderId(providerId: string | undefined): SpeechProviderId | undefined;
//#endregion
//#region src/tts/provider-registry.d.ts
/** List configured speech providers using manifest/capability discovery. */
declare const listSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin$1[];
/** List currently loaded speech providers from the active runtime registry. */
declare const listLoadedSpeechProviders: (cfg?: OpenClawConfig) => SpeechProviderPlugin$1[];
/** Resolve a configured speech provider by canonical ID or alias. */
declare const getSpeechProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderPlugin$1 | undefined;
/** Resolve an input provider ID or alias to the provider's canonical ID. */
declare const canonicalizeSpeechProviderId: (providerId: string | undefined, cfg?: OpenClawConfig) => SpeechProviderId | undefined;
//#endregion
//#region src/tts/tts-runtime-types.d.ts
type TtsAttemptReasonCode = "success" | "no_provider_registered" | "not_configured" | "unsupported_for_streaming" | "unsupported_for_telephony" | "timeout" | "provider_error";
type TtsProviderAttempt = {
  provider: string;
  outcome: "success" | "skipped" | "failed";
  reasonCode: TtsAttemptReasonCode;
  persona?: string;
  personaBinding?: "applied" | "missing" | "none";
  latencyMs?: number;
  error?: string;
};
type TtsAttemptOutcome = {
  success: boolean;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
};
type TtsMediaOutcome = TtsAttemptOutcome & {
  outputFormat?: string;
};
type TtsProviderMediaOutcome = TtsMediaOutcome & {
  providerModel?: string;
  providerVoice?: string;
};
type TtsVoiceMediaOutcome = TtsProviderMediaOutcome & {
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: "audio-file" | "voice-note";
};
type TtsResult = TtsMediaOutcome & {
  audioPath?: string;
  voiceCompatible?: boolean;
  audioAsVoice?: boolean;
  target?: "audio-file" | "voice-note";
};
type TtsSynthesisResult = TtsVoiceMediaOutcome & {
  audioBuffer?: Buffer;
};
type TtsStreamResult = TtsVoiceMediaOutcome & {
  audioStream?: ReadableStream<Uint8Array>;
  release?: () => Promise<void>;
};
type TtsSynthesisStreamResult = TtsStreamResult;
type TtsTelephonyResult = TtsProviderMediaOutcome & {
  audioBuffer?: Buffer;
  sampleRate?: number;
};
type TtsStatusEntry = TtsAttemptOutcome & {
  timestamp: number;
  textLength: number;
  summarized: boolean;
};
//#endregion
//#region src/tts/tts-synthesis-support.d.ts
declare function formatTtsProviderError(provider: TtsProvider, err: unknown): string;
declare function sanitizeTtsErrorForLog(err: unknown): string;
//#endregion
//#region src/tts/tts-synthesis.d.ts
type TtsAudioPersistence = (params: {
  audioBuffer: Buffer;
  cfg: OpenClawConfig;
  fileExtension: string;
  outputFormat?: string;
}) => Promise<string>;
declare function supportsNativeVoiceNoteTts(channel: string | undefined): boolean;
declare function supportsTranscodedVoiceNoteTts(channel: string | undefined): boolean;
declare function resolveTtsSynthesisTarget(channel: string | undefined): "audio-file" | "voice-note";
declare function shouldDeliverTtsAsVoice(params: {
  channel: string | undefined;
  target: "audio-file" | "voice-note" | undefined;
  voiceCompatible: boolean | undefined;
  fileExtension?: string;
  outputFormat?: string;
}): boolean;
declare function textToSpeechCore(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}, persistTtsAudio: TtsAudioPersistence): Promise<TtsResult>;
type SpeechSynthesisParams = {
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
declare function synthesizeSpeech(params: SpeechSynthesisParams): Promise<TtsSynthesisResult>;
//#endregion
//#region src/tts/runtime-availability.d.ts
/** Host-owned availability guard shared by every speech runtime entrypoint. */
/** Installs the process-lifecycle availability guard owned by the OpenClaw host. */
declare function setSpeechRuntimeAvailabilityGuard(guard: (() => void) | undefined): void;
//#endregion
//#region src/tts/tts-settings-writes.d.ts
declare function setTtsAutoMode(prefsPath: string, mode: TtsAutoMode): void;
declare function setTtsEnabled(prefsPath: string, enabled: boolean): void;
declare function setTtsPersona(prefsPath: string, persona: string | null | undefined): void;
declare function setTtsProvider(prefsPath: string, provider: TtsProvider): void;
declare function setTtsMaxLength(prefsPath: string, maxLength: number): void;
declare function setSummarizationEnabled(prefsPath: string, enabled: boolean): void;
//#endregion
//#region src/tts/tts-payload.d.ts
declare function getLastTtsAttempt(): TtsStatusEntry | undefined;
declare function setLastTtsAttempt(entry: TtsStatusEntry | undefined): void;
declare function listSpeechVoices(params: {
  provider: string;
  cfg?: OpenClawConfig;
  config?: ResolvedTtsConfig;
  apiKey?: string;
  baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
declare function maybeApplyTtsToPayloadCore(params: {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  channel?: string;
  kind?: "tool" | "block" | "final";
  inboundAudio?: boolean;
  ttsAuto?: string;
  agentId?: string;
  accountId?: string;
}, persistTtsAudio: TtsAudioPersistence): Promise<ReplyPayload>;
//#endregion
//#region src/tts/tts-request.d.ts
type PreparedTtsRequest = {
  cfg: OpenClawConfig;
  directives: TtsDirectiveParseResult;
};
/** Merge a surface TTS override and resolve its inline synthesis directives. */
declare function prepareTtsRequest(params: {
  cfg: OpenClawConfig;
  override?: TtsConfig;
  text: string;
}): PreparedTtsRequest;
declare function resolveExplicitTtsOverrides(params: {
  cfg: OpenClawConfig;
  prefsPath?: string;
  provider?: string;
  modelId?: string;
  voiceId?: string;
  agentId?: string;
  channelId?: string;
  accountId?: string;
}): TtsDirectiveOverrides;
//#endregion
//#region src/tts/tts-streaming.d.ts
declare function streamSpeech(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsSynthesisStreamResult>;
declare function textToSpeechStream(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsStreamResult>;
//#endregion
//#region src/tts/tts-telephony.d.ts
declare function textToSpeechTelephony(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  overrides?: TtsDirectiveOverrides;
  timeoutMs?: number;
}): Promise<TtsTelephonyResult>;
declare namespace runtime_api_d_exports {
  export { ResolvedTtsConfig, ResolvedTtsModelOverrides, TtsDirectiveOverrides, TtsDirectiveParseResult, TtsStreamResult, TtsSynthesisResult, TtsSynthesisStreamResult, TtsTelephonyResult, buildTtsSystemPromptHint, getLastTtsAttempt, getResolvedSpeechProviderConfig, getTtsMaxLength, getTtsPersona, getTtsProvider, isSummarizationEnabled, isTtsEnabled, isTtsProviderConfigured, listSpeechVoices, listTtsPersonas, prepareTtsRequest, resolveExplicitTtsOverrides, resolveTtsAutoMode, resolveTtsConfig, resolveTtsPrefsPath, resolveTtsProviderOrder, setLastTtsAttempt, setSpeechRuntimeAvailabilityGuard, setSummarizationEnabled, setTtsAutoMode, setTtsEnabled, setTtsMachinePrefsPathResolver, setTtsMaxLength, setTtsPersona, setTtsProvider, streamSpeech, synthesizeSpeech, testApi, textToSpeechStream, textToSpeechTelephony };
}
declare function getTtsProvider(config: ResolvedTtsConfig, prefsPath: string): TtsProvider;
declare const testApi: {
  parseTtsDirectives: typeof parseTtsDirectives;
  resolveModelOverridePolicy: typeof resolveModelOverridePolicy;
  supportsNativeVoiceNoteTts: typeof supportsNativeVoiceNoteTts;
  supportsTranscodedVoiceNoteTts: typeof supportsTranscodedVoiceNoteTts;
  resolveTtsSynthesisTarget: typeof resolveTtsSynthesisTarget;
  shouldDeliverTtsAsVoice: typeof shouldDeliverTtsAsVoice;
  summarizeText: typeof summarizeText;
  getResolvedSpeechProviderConfig: typeof getResolvedSpeechProviderConfig;
  formatTtsProviderError: typeof formatTtsProviderError;
  sanitizeTtsErrorForLog: typeof sanitizeTtsErrorForLog;
};
//#endregion
//#region src/tts/tts.d.ts
declare function textToSpeech(params: Parameters<typeof textToSpeechCore>[0]): Promise<TtsResult>;
declare function maybeApplyTtsToPayload(params: Parameters<typeof maybeApplyTtsToPayloadCore>[0]): Promise<ReplyPayload>;
//#endregion
//#region src/agents/defaults.d.ts
declare const DEFAULT_PROVIDER = "openai";
declare const DEFAULT_MODEL = "gpt-5.6-sol";
declare const DEFAULT_CONTEXT_TOKENS = 200000;
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
//#region src/agents/tool-fs-policy.types.d.ts
type PreparedSessionPermissionPolicy = Readonly<{
  root: string;
  mode: SessionPermissionMode;
}>;
/** Filesystem policy for agent tools that can touch local paths. */
type ToolFsPolicy = {
  workspaceOnly: boolean;
  root?: string;
};
//#endregion
//#region src/agents/spawned-context.d.ts
type SpawnedRunMetadata = {
  spawnedBy?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  workspaceDir?: string | null;
};
//#endregion
//#region src/agents/main-session-recovery/main-session-recovery-types.d.ts
type MainSessionRecoveryOwnerClaim = {
  cycleId: string;
  lifecycleGeneration: string;
  claimId: string;
  sessionId: string;
  sessionKey: string;
  runId?: string;
};
//#endregion
//#region src/agents/main-session-recovery/main-session-recovery-store.d.ts
type MainSessionRecoveryStoreTarget = {
  sessionKey: string;
  storePath: string;
};
type MainSessionRecoveryOwnerLease = MainSessionRecoveryOwnerClaim & MainSessionRecoveryStoreTarget;
//#endregion
//#region src/agents/command/types.d.ts
/** Image content block for Claude API multimodal messages. */
type ImageContent = {
  type: "image";
  data: string;
  mimeType: string;
};
/** ACP turn source markers accepted by trusted command callsites. */
type AcpTurnSource = "manual_spawn";
/** Channel/account/thread context carried into an agent run. */
type AgentRunContext = {
  messageChannel?: string;
  accountId?: string;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  currentChannelId?: string;
  /** Transport-native chat/conversation ID for plugin hook identity context. */
  chatId?: string;
  /** Channel-specific sender/chat metadata for plugin hook identity context. */
  channelContext?: PluginHookChannelContext;
  currentThreadTs?: string;
  currentInboundAudio?: boolean;
  senderId?: string | null;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  };
};
/** Full trusted option surface for running an agent command. */
type AgentCommandOpts = {
  message: string;
  /** User-visible transcript body; defaults to message and excludes runtime-only context. */
  transcriptMessage?: string;
  /** Durable media metadata for the user-visible transcript turn. */
  transcriptMedia?: UserTurnInput["media"];
  /** Optional image attachments for multimodal messages. */
  images?: ImageContent[];
  /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered facts represented by attachment text in this prompt. */
  media?: MediaFact[];
  /** Optional client-provided tools (OpenResponses hosted tools). */
  clientTools?: ClientToolDefinition[];
  /** Agent id override (must exist in config). */
  agentId?: string;
  /** Per-run provider override. */
  provider?: string;
  /** Per-run model override. */
  model?: string;
  /** Explicit ordered fallback chain for this run. Undefined uses normal selection policy. */
  modelFallbacksOverride?: string[];
  to?: string;
  sessionId?: string;
  sessionKey?: string;
  thinking?: string;
  thinkingOnce?: string;
  verbose?: string;
  json?: boolean;
  timeout?: string;
  deliver?: boolean;
  /** Override delivery target (separate from session routing). */
  replyTo?: string;
  /** Override delivery channel (separate from session routing). */
  replyChannel?: string;
  /** Override delivery account id (separate from session routing). */
  replyAccountId?: string;
  /** Override delivery thread/topic id (separate from session routing). */
  threadId?: string | number;
  /** Message channel context. */
  messageChannel?: string;
  /** Tool-policy/output surface context. Defaults to messageChannel. */
  messageProvider?: string;
  /** Delivery channel. */
  channel?: string;
  /** Account ID for multi-account channel routing. */
  accountId?: string;
  /** Context for embedded run routing (channel/account/thread). */
  runContext?: AgentRunContext;
  /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string;
  /** Internal trusted exec approval follow-up elevated defaults. */
  bashElevated?: ExecElevatedDefaults;
  /** Trusted span whose final cap is resolved with the selected model. */
  execApprovalContinuationPromptRange?: ExecApprovalContinuationPromptRange;
  /** Corresponding span in the undecorated transcript message. */
  execApprovalContinuationTranscriptPromptRange?: ExecApprovalContinuationPromptRange;
  /** Trusted sender identity bit for command/channel-action auth; defaults true for local CLI calls. */
  senderIsOwner?: boolean;
  /** Whether this caller is authorized to use provider/model per-run overrides. */
  allowModelOverride?: boolean;
  /** Optional runtime tool allow-list; when set, only these tools are exposed for this run. */
  toolsAllow?: string[];
  /** Trusted owner-scoped plugin tool grant; normal policy and deny rules still apply. */
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  /** Consumed in-process subagent-completion capability; never accepted from public RPC params. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  /** Internal marker identifying a server-managed default cap. */
  toolsAllowIsDefault?: boolean;
  /** Trusted server-stamped authority for an explicitly capped scheduled run. */
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  /** Preserve the originating run's message-tool policy across internal continuation turns. */
  requireExplicitMessageTarget?: boolean;
  cliSessionBindingFacts?: CliSessionBindingFacts;
  /** Group/spawn metadata for subagent policy inheritance and routing context. */
  groupId?: SpawnedRunMetadata["groupId"];
  groupChannel?: SpawnedRunMetadata["groupChannel"];
  groupSpace?: SpawnedRunMetadata["groupSpace"];
  spawnedBy?: SpawnedRunMetadata["spawnedBy"];
  deliveryTargetMode?: ChannelOutboundTargetMode;
  bestEffortDeliver?: boolean;
  abortSignal?: AbortSignal;
  lane?: string;
  runId?: string;
  /** Immutable gateway lifecycle ownership captured when this run was admitted. */
  lifecycleGeneration?: string;
  /** Called once when the selected runtime actually admits the prompt for execution. */
  onExecutionStarted?: () => void;
  extraSystemPrompt?: string;
  /** Frozen profile-backed human Git attribution prepared by trusted ingress. */
  gitCoauthorAttribution?: string;
  /** Bootstrap workspace context injection mode for this run. */
  bootstrapContextMode?: "full" | "lightweight";
  /** Run kind hint for bootstrap context behavior. */
  bootstrapContextRunKind?: BootstrapContextRunKind;
  internalEvents?: AgentInternalEvent[];
  inputProvenance?: InputProvenance;
  /** Internal runs can execute against a session without updating visible status/model/usage. */
  sessionEffects?: "visible" | "internal";
  /** Internal handoffs can write transcript turns without changing user-facing model/usage state. */
  preserveUserFacingSessionModelState?: boolean;
  /** Visible source replies must be sent through the message tool when set. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Internal runs can omit the channel message tool entirely. */
  disableMessageTool?: boolean;
  /** Collector children fail closed instead of emitting operator approval requests. */
  swarmCollector?: boolean;
  /** Synthetic structured_output input schema for collector children. */
  swarmOutputSchema?: Record<string, unknown>;
  /** Restrict this reconstructed run to restart-safe tools. */
  forceRestartSafeTools?: boolean;
  forceCodeModeTools?: boolean;
  /** Host-owned exact media set for a scoped automatic recovery delivery. */
  internalDeliveryMediaUrls?: string[];
  internalDeliverySuppressText?: boolean;
  /** Gateway ingress that already persisted visible activity can skip the duplicate pre-run touch. */
  skipInitialSessionTouch?: boolean;
  /** Per-call stream param overrides (best-effort). */
  streamParams?: AgentStreamParams;
  /** Resolved per-run fast mode from channel/directive handling. */
  fastMode?: FastMode;
  /** Resolved per-run auto cutoff seconds for fast mode. */
  fastModeAutoOnSeconds?: number;
  /** Explicit workspace directory override (for subagents to inherit parent workspace). */
  workspaceDir?: SpawnedRunMetadata["workspaceDir"];
  /** Explicit task working directory for this run. Bootstrap still uses workspaceDir. */
  cwd?: string;
  /** Force bundled MCP teardown when a one-shot local run completes. */
  cleanupBundleMcpOnRunEnd?: boolean;
  /** Force long-lived CLI live session teardown when a one-shot local run completes. */
  cleanupCliLiveSessionOnRunEnd?: boolean;
  /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean;
  /** Gateway-owned runs can late-bind plugin subagent and node runtime helpers. */
  allowGatewaySubagentBinding?: boolean;
  /** Opaque foreground fence transferred by Gateway after atomic session admission. */
  mainRestartRecoveryOwnerLease?: MainSessionRecoveryOwnerLease;
  /** Gateway already consumed this automatic recovery run's durable reservation. */
  mainRestartRecoveryAdmitted?: boolean;
  /** Exact durable recovery attempt allowed to bind post-admission execution identity. */
  mainRestartRecoveryAttempt?: number;
  /** Private recovery correlation; public ingress callers cannot author identity evidence. */
  executionIdentityAdmission?: ReturnType<(typeof admitted_run_context_d_exports)["createExecutionIdentityRecoveryAdmission"]>;
  /** Gateway-owned exact operational instance shared with its abort controller. */
  operationalRunInstance?: OperationalRunInstanceRef;
  /** Gateway-minted exact-run capability for late Codex creator-authority capture. */
  cronCreatorAuthorityCapability?: CronCreatorAuthorityCapability;
  /** Private exact-instance binding hook invoked after delegated authority admission. */
  onAdmittedRunContext?: (context: AdmittedRunContext) => void | Promise<void>;
  /** Private owner binding hook invoked only after exact admission has resolved. */
  onPostAdmittedRunContext?: (context: AdmittedRunContext) => void;
  /** Called when the actual run model is selected, including fallback retries. */
  onActiveModelSelected?: (ctx: {
    provider: string;
    model: string;
  }) => void | Promise<void>;
  /** Called when every candidate in the run's model fallback chain failed. */
  onModelFallbackExhausted?: () => void;
  /** Called before delivery projection when the raw run contains an error payload. */
  onResultErrorPayload?: (message?: string) => void;
  /** Called when compaction rotates the active run onto a successor session. */
  onSessionIdChanged?: (sessionId: string) => void;
  /** Internal one-shot model probe mode: no tools, no workspace/chat prompt policy. */
  modelRun?: boolean;
  /** Internal prompt-mode override for trusted local/gateway callsites. */
  promptMode?: PromptMode;
  /** Internal ACP-ready session turn source. Manual spawn turns bypass only the dispatch gate. */
  acpTurnSource?: AcpTurnSource;
  /** Internal handoffs can feed the model without writing the synthetic prompt to transcript. */
  suppressPromptPersistence?: boolean;
  /** Gateway/channel ingress can provide a canonical user-turn persistence owner. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
};
/** Restricted option surface for external ingress callsites. */
type AgentCommandIngressOpts = Omit<AgentCommandOpts, "senderIsOwner" | "allowModelOverride" | "mainRestartRecoveryOwnerLease" | "mainRestartRecoveryAdmitted" | "mainRestartRecoveryAttempt" | "executionIdentityAdmission" | "operationalRunInstance" | "cronCreatorAuthorityCapability" | "onAdmittedRunContext" | "onPostAdmittedRunContext"> & {
  /** @deprecated Public ingress ignores owner claims; use the host-injected channel runtime. */
  senderIsOwner?: boolean;
  /** Ingress callsites must always pass explicit model-override authorization state. */
  allowModelOverride: boolean;
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
  config?: unknown;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
};
type PreparedAgentRuntimeProviderHandle = AgentRuntimeProviderHandle & {
  modelId: string | null;
  prepared: true;
};
type AgentRuntimeInteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
/** Portable action control exposed to agent runtime reply payloads. */
type AgentRuntimeMessagePresentationButton = {
  /** User-visible button label. */
  label: string;
  /** Typed action sent when pressed. */
  action?: MessagePresentationAction;
  /** @deprecated Use action. */
  value?: string;
  /** @deprecated Use an action with type "url". */
  url?: string;
  /** @deprecated Use an action with type "web-app". */
  webApp?: {
    url: string;
  };
  /** @deprecated Use an action with type "web-app". */
  web_app?: {
    url: string;
  };
  /** Higher values are kept first when channel action limits require dropping controls. */
  priority?: number;
  /** Disabled action hint; channels without disabled-state support render fallback text. */
  disabled?: boolean;
  /** Optional visual style hint for renderers that support styled actions. */
  style?: AgentRuntimeInteractiveButtonStyle;
};
/** Portable select/menu option exposed to agent runtime reply payloads. */
type AgentRuntimeMessagePresentationOption = {
  /** User-visible option label. */
  label: string;
  /** Typed action sent when selected. */
  action?: Extract<MessagePresentationAction, {
    type: "command" | "callback" | "model-picker";
  }>;
  /** @deprecated Use action. */
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
  /** Optional short heading rendered before blocks when supported. */
  title?: string;
  /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: AgentRuntimeMessagePresentationTone;
  /** Ordered portable blocks rendered or downgraded by channel adapters. */
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
  isReasoning?: boolean;
  /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
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
  config?: unknown;
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
  authRequirement: "api-key" | "subscription";
  /** Secret-free request behavior that the selected runtime must reproduce. */
  requestTransportOverrides: ProviderRouteOverridePresence;
  /** Provider-owned native-runtime compatibility for this concrete route. */
  runtimePolicy?: ProviderModelRouteRuntimePolicy;
};
/** Common native-runtime support proven across every route left to the harness. */
type AgentRuntimeAuthDeferredRouteSupport = {
  requestTransportOverrides: ProviderRouteOverridePresence;
  runtimePolicy: ProviderModelRouteRuntimePolicy;
};
/** Auth forwarding decision for one runtime attempt. */
type AgentRuntimeAuthPlan = {
  providerForAuth: string;
  /** Model whose order, cooldown, and route facts produced this plan. */
  modelId?: string;
  authProfileProviderForAuth: string;
  harnessAuthProvider?: string;
  /** Preferred or user-locked profile; automatic selection may not have resolved its secret yet. */
  forwardedAuthProfileId?: string;
  forwardedAuthProfileSource?: "auto" | "user";
  /** Ordered exhaustive candidates for the selected route; a singleton is terminal. */
  forwardedAuthProfileCandidateIds?: string[];
  /** Exact selected credential/config mode; secret-free route materialization input. */
  selectedAuthMode?: string;
  /** Concrete provider-owned route selected before runtime dispatch. */
  modelRoute?: AgentRuntimeAuthModelRoute;
  /** Secret-free support shared by every route deferred to harness-owned auth. */
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
//#endregion
//#region src/agents/embedded-agent-runner/compact.types.d.ts
type CompactEmbeddedAgentSessionParams = {
  /** Explicit session owner captured before fallback agent resolution. */
  contextEngineAgentId?: string;
  sessionId: string;
  runId?: string;
  sessionKey?: string;
  /** Storage-neutral transcript/session target. Defaults to sessionId/sessionKey/agentId. */
  sessionTarget?: AgentRunSessionTarget;
  /** Caller-resolved owner agent for global session aliases. */
  agentId?: string;
  /** Session key used only for runtime policy/sandbox resolution. Defaults to sessionKey. */
  sandboxSessionKey?: string;
  messageChannel?: string;
  messageProvider?: string;
  /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[];
  chatType?: ChatType;
  agentAccountId?: string;
  conversationToolPolicy?: GroupToolPolicyConfig;
  currentChannelId?: string;
  currentThreadTs?: string;
  currentMessageId?: string | number;
  /** Trusted sender id from inbound context for scoped message-tool discovery. */
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  authProfileId?: string;
  authProfileIdSource?: "auto" | "user";
  /** Host-resolved provider credential for native harness compaction. */
  resolvedApiKey?: string;
  /** Group id for channel-level tool policy resolution. */
  groupId?: string | null;
  /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null;
  /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null;
  memberRoleIds?: string[];
  /** Parent session key for subagent policy inheritance. */
  spawnedBy?: string | null;
  inputProvenance?: InputProvenance;
  /** Consumed in-process subagent-completion capability; never derived from public input. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  toolsAllow?: string[];
  disableTools?: boolean;
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  /** Host-resolved ambient native-tool boundary for this compaction operation. */
  nativeToolSurface?: "unrestricted" | "host-isolated";
  sessionFile: string;
  /** Optional caller-observed live prompt tokens used for compaction diagnostics. */
  currentTokenCount?: number;
  workspaceDir: string;
  /** Canonical agent workspace used for bootstrap files when execution runs elsewhere. */
  bootstrapWorkspaceDir?: string;
  /** Optional task working directory; workspaceDir remains the agent bootstrap workspace. */
  cwd?: string;
  permissionMode?: SessionEntry["permissionMode"];
  sessionRoot?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  toolOverrides?: SessionToolOverrides;
  skillsSnapshot?: SkillSnapshot;
  senderIsOwner?: boolean;
  provider?: string;
  model?: string;
  /** Caller-resolved model/provider shape used by native harness compactors. */
  runtimeModel?: Model;
  /** Effective model fallback chain for this session attempt. Undefined uses config defaults. */
  modelFallbacksOverride?: string[];
  /** Optional caller-resolved context engine for harness-owned compaction. */
  contextEngine?: ContextEngine;
  /** Optional caller-resolved token budget for harness-owned compaction. */
  contextTokenBudget?: number;
  /** Optional caller-resolved runtime context for harness-owned context-engine compaction. */
  contextEngineRuntimeContext?: ContextEngineRuntimeContext;
  /** Session-pinned embedded harness id. Prevents compaction hot-switching. */
  agentHarnessId?: string;
  /** Resumable native CLI session targeted by an explicit manual compaction. */
  cliSessionId?: string;
  /** Complete persisted CLI binding targeted by an explicit manual compaction. */
  cliSessionBinding?: CliSessionBinding;
  /** Owning session facts required for placement and runtime preparation. */
  sessionEntry?: SessionEntry;
  /** Prevent compaction from changing the persisted session runtime or model. */
  modelSelectionLocked?: boolean;
  /** OpenClaw-owned runtime policy prepared for this compaction path. */
  runtimePlan?: AgentRuntimePlan;
  /** Host-prepared route and credential selection for native harness compaction. */
  runtimeAuthPlan?: AgentRuntimeAuthPlan;
  thinkLevel?: ThinkLevel;
  reasoningLevel?: ReasoningLevel;
  execOverrides?: Pick<ExecToolDefaults, "host" | "mode" | "security" | "ask" | "node" | "nodeCwd">;
  bashElevated?: ExecElevatedDefaults;
  customInstructions?: string;
  tokenBudget?: number;
  force?: boolean;
  /** Force compaction because the caller already determined this turn must compact before prompt submission. */
  forcePreflight?: boolean;
  /** Alias for forcePreflight used by preflight budget gates. */
  preflightRequired?: boolean;
  /** Diagnostic trigger that made preflight compaction mandatory. */
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
  }) => void | Promise<void>;
  /** Allow runtime plugins for this compaction to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean;
  /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean;
};
//#endregion
//#region src/agents/embedded-agent-runner/runs.d.ts
type EmbeddedAgentQueueFailureReason = "no_active_run" | "not_streaming" | "stale_run" | "compacting" | "tool_authority_mismatch" | "image_input_unsupported" | "source_reply_delivery_mode_mismatch" | "task_suggestion_delivery_mode_mismatch" | "transcript_commit_wait_unsupported" | "runtime_rejected";
type EmbeddedAgentQueueMessageOutcome = {
  queued: true;
  sessionId: string;
  target: "embedded_run" | "reply_run";
  gatewayHealth: "live";
  /** Present only when acceptance was irreversible but transcript confirmation failed. */
  transcriptCommit?: "unconfirmed";
  errorMessage?: string;
  deliveredAtMs?: number;
  enqueuedAtMs?: number;
} | {
  queued: false;
  sessionId: string;
  reason: EmbeddedAgentQueueFailureReason;
  gatewayHealth: "live";
  errorMessage?: string;
};
//#endregion
//#region src/channels/message/send.d.ts
type DurableMessageSuppressionReason = OutboundPayloadDeliverySuppressionReason | "no_visible_result";
type DurableMessageFailureStage = "platform_send" | "queue" | "unknown";
type SerializedDurableMessagePayloadOutcome = {
  index: number;
  status: "sent";
  resultCount: number;
} | {
  index: number;
  status: "suppressed";
  reason: DurableMessageSuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
} | {
  index: number;
  status: "failed";
  error: string;
  sentBeforeError: boolean;
  stage: DurableMessageFailureStage;
};
//#endregion
//#region packages/acp-core/src/runtime/errors.d.ts
declare const ACP_ERROR_CODES: readonly ["ACP_BACKEND_MISSING", "ACP_BACKEND_UNAVAILABLE", "ACP_BACKEND_UNSUPPORTED_CONTROL", "ACP_DISPATCH_DISABLED", "ACP_INVALID_RUNTIME_OPTION", "ACP_SESSION_INIT_FAILED", "ACP_TURN_FAILED"];
type AcpRuntimeErrorCode = (typeof ACP_ERROR_CODES)[number];
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
declare class AcpRuntimeError extends Error {
  readonly code: AcpRuntimeErrorCode;
  /**
   * Backend-specific structured failure code (e.g. acpx "SESSION_RESUME_REQUIRED"),
   * preserved so recovery decisions key on the failure kind rather than parsing
   * the human-readable message.
   */
  readonly detailCode?: string;
  readonly cause?: unknown;
  constructor(code: AcpRuntimeErrorCode, message: string, options?: {
    cause?: unknown;
    detailCode?: string;
  });
}
/** Recognizes local and cross-realm ACP runtime errors by their stable error code. */
declare function isAcpRuntimeError(value: unknown): value is AcpRuntimeError;
//#endregion
//#region src/acp/runtime/registry.d.ts
/** Registered ACP backend with optional health probe used for auto-selection. */
type AcpRuntimeBackend = {
  id: string;
  runtime: AcpRuntime;
  healthy?: () => boolean;
};
/** Registers or replaces an ACP runtime backend by normalized id. */
declare function registerAcpRuntimeBackend(backend: AcpRuntimeBackend): void;
/** Removes a registered ACP runtime backend by id. */
declare function unregisterAcpRuntimeBackend(id: string): void;
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
declare function getAcpRuntimeBackend(id?: string): AcpRuntimeBackend | null;
/** Resolves a healthy backend or throws a typed ACP runtime error. */
declare function requireAcpRuntimeBackend(id?: string): AcpRuntimeBackend;
//#endregion
//#region src/acp/runtime/session-meta.d.ts
type AcpSessionStoreEntry = {
  cfg: OpenClawConfig;
  agentId?: string;
  storePath: string;
  sessionKey: string;
  storeSessionKey: string;
  entry?: SessionEntry;
  acp?: SessionAcpMeta;
  storeReadFailed?: boolean;
};
declare function readAcpSessionEntry(params: {
  sessionKey: string;
  agentId?: string;
  cfg?: OpenClawConfig;
  clone?: boolean;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
}): AcpSessionStoreEntry | null;
declare function listAcpSessionEntries(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  clone?: boolean;
  databasePath?: string;
}): Promise<AcpSessionStoreEntry[]>;
declare function upsertAcpSessionMeta(params: {
  sessionKey: string;
  agentId?: string;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
  now?: () => number;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  mutate: (current: SessionAcpMeta | undefined, entry: SessionEntry | undefined) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
//#endregion
//#region src/acp/control-plane/manager.types.d.ts
/** Result of resolving persisted ACP metadata for a session key. */
type AcpSessionResolution = {
  kind: "none";
  sessionKey: string;
} | {
  kind: "stale";
  sessionKey: string;
  error: AcpRuntimeError;
} | {
  kind: "ready";
  sessionKey: string;
  meta: SessionAcpMeta;
  entry?: SessionEntry;
};
/** Input required to create or resume an ACP runtime session. */
type AcpInitializeSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  agent: string;
  mode: AcpRuntimeSessionMode;
  resumeSessionId?: string;
  runtimeOptions?: Partial<AcpSessionRuntimeOptions>;
  modelExplicit?: boolean;
  cwd?: string;
  backendId?: string;
};
type AcpTurnAttachment = AcpRuntimeTurnAttachment;
/** Input for one ACP prompt turn routed through the manager. */
type AcpRunTurnInput = {
  /** Private admitted execution context supplied by the owning host ingress. */
  admittedRunContext: AdmittedRunContext;
  cfg: OpenClawConfig;
  sessionKey: string;
  provenance: "human" | "agent" | "system";
  text: string;
  attachments?: AcpTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
  onElicitation?: AcpElicitationHandler;
  /** Throwable host admission fence immediately before runtime prompt submission. */
  onBeforePrompt?: () => Promise<void> | void;
  onLifecycle?: (event: AcpTurnLifecycleEvent) => Promise<void> | void;
  onEvent?: (event: AcpRuntimeEvent) => Promise<void> | void;
};
type AcpTurnLifecycleEvent = {
  type: "prompt_submitted";
  at: number;
};
/** Input for closing, resetting, or cleaning up an ACP session. */
type AcpCloseSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: string;
  discardPersistentState?: boolean;
  clearMeta?: boolean;
  allowBackendUnavailable?: boolean;
  requireAcpSession?: boolean;
};
type AcpCloseSessionResult = {
  runtimeClosed: boolean;
  runtimeNotice?: string;
  metaCleared: boolean;
};
/** User-facing session status assembled from persisted metadata and runtime status. */
type AcpSessionStatus = {
  sessionKey: string;
  backend: string;
  agent: string;
  identity?: SessionAcpIdentity;
  state: SessionAcpMeta["state"];
  mode: AcpRuntimeSessionMode;
  runtimeOptions: AcpSessionRuntimeOptions;
  capabilities: AcpRuntimeCapabilities;
  runtimeStatus?: AcpRuntimeStatus;
  lastActivityAt: number;
  lastError?: string;
};
/** Process-local ACP manager counters exposed for diagnostics. */
type AcpManagerObservabilitySnapshot = {
  runtimeCache: {
    activeSessions: number;
    idleTtlMs: number;
    evictedTotal: number;
    lastEvictedAt?: number;
  };
  turns: {
    active: number;
    queueDepth: number;
    completed: number;
    failed: number;
    averageLatencyMs: number;
    maxLatencyMs: number;
  };
  errorsByCode: Record<string, number>;
};
type AcpStartupIdentityReconcileResult = {
  checked: number;
  resolved: number;
  failed: number;
};
type AcpSessionManagerDeps = {
  listAcpSessions: typeof listAcpSessionEntries;
  loadSessionEntry: typeof readAcpSessionEntry;
  upsertSessionMeta: typeof upsertAcpSessionMeta;
  getRuntimeBackend: typeof getAcpRuntimeBackend;
  requireRuntimeBackend: typeof requireAcpRuntimeBackend;
};
//#endregion
//#region src/acp/control-plane/manager.core.d.ts
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
declare class AcpSessionManager {
  private readonly actorQueue;
  private readonly runtimeHandles;
  private readonly activeTurnBySession;
  private readonly turnLatencyStats;
  private readonly errorCountsByCode;
  private readonly deps;
  constructor(deps?: AcpSessionManagerDeps);
  resolveSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }): AcpSessionResolution;
  getObservabilitySnapshot(): AcpManagerObservabilitySnapshot;
  reconcilePendingSessionIdentities(params: {
    cfg: OpenClawConfig;
  }): Promise<AcpStartupIdentityReconcileResult>;
  initializeSession(input: AcpInitializeSessionInput): Promise<{
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
  }>;
  getSessionStatus(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    signal?: AbortSignal;
  }): Promise<AcpSessionStatus>;
  setSessionRuntimeMode(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    runtimeMode: string;
  }): Promise<AcpSessionRuntimeOptions>;
  setSessionConfigOption(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    key: string;
    value: string;
  }): Promise<AcpSessionRuntimeOptions>;
  updateSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    patch: Partial<AcpSessionRuntimeOptions>;
  }): Promise<AcpSessionRuntimeOptions>;
  resetSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }): Promise<AcpSessionRuntimeOptions>;
  runTurn(input: AcpRunTurnInput): Promise<void>;
  cancelSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason?: string;
    expectedRunId?: string;
    expectedInstanceId?: string;
    expectedOwnerKey?: string;
  }): Promise<void>;
  closeSession(input: AcpCloseSessionInput): Promise<AcpCloseSessionResult>;
  private ensureRuntimeHandle;
  private runtimeOptionCommandServices;
  private recordTurnCompletion;
  private recordErrorCode;
  private resolveRuntimeCapabilities;
  private applyRuntimeControls;
  private setSessionState;
  private reconcileRuntimeSessionIdentifiers;
  private writeSessionMeta;
  private withSessionActor;
  private throwIfAborted;
}
//#endregion
//#region src/agents/agent-command.d.ts
/** Runs an agent turn from an inbound channel/gateway ingress context. */
declare function agentCommandFromIngress(opts: AgentCommandIngressOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
  payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
  meta: EmbeddedAgentRunMeta;
  didSendViaMessagingTool?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  didSendDeterministicApprovalPrompt?: true;
  acceptedSessionSpawns?: NonNullable<AcceptedSessionSpawn[] | undefined>;
  successfulCronAdds?: number;
  deliverySucceeded?: boolean;
  deliveryStatus?: {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: SerializedDurableMessagePayloadOutcome[];
  };
}>;
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
  agentId?: string;
  /** Explicitly pinned auth profile for the run; decisive when it resolves. */
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
//#region src/media/image-ops.d.ts
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
//#endregion
//#region src/media/web-media.d.ts
/** Loaded media bytes plus resolved MIME kind and filename metadata for outbound/plugin callers. */
type WebMediaResult = {
  buffer: Buffer;
  contentType?: string;
  kind: MediaKind | undefined;
  fileName?: string;
  /** Source bytes came from a generated-HTML trust boundary. */
  trustedGeneratedHtmlSource?: boolean;
};
type WebMediaOptions = {
  maxBytes?: number;
  optimizeImages?: boolean;
  imageCompression?: ImageCompressionPolicy;
  ssrfPolicy?: SsrFPolicy;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  readIdleTimeoutMs?: number;
  trustExplicitProxyDns?: boolean;
  workspaceDir?: string;
  /** Allowed root directories for local path reads. "any" is deprecated; prefer sandboxValidated + readFile. */
  localRoots?: readonly string[] | "any";
  /** Channel inbound attachment root patterns checked with inbound path policy semantics. */
  inboundRoots?: readonly string[];
  /** Caller already validated the local path (sandbox/other guards); requires readFile override. */
  sandboxValidated?: boolean;
  readFile?: OutboundMediaReadFile;
  /** Host-local fs-policy read piggyback; rejects plaintext-like document sends. */
  hostReadCapability?: boolean;
};
/** Compression preference used to tune image size/quality search grids. */
type ImageQualityPreference = "auto" | "efficient" | "balanced" | "high";
/** Per-model image compression constraints merged into outbound media policy. */
type ImageCompressionModelPolicy = {
  maxBytes?: number;
  maxPixels?: number;
  maxSidePx?: number;
  preferredSidePx?: number;
};
/** Image compression policy for model/tool callers that need bounded media payloads. */
type ImageCompressionPolicy = {
  quality?: ImageQualityPreference;
  models?: ImageCompressionModelPolicy[];
  imageCount?: number;
};
/** Loads local, remote, hosted, or media-store media and optimizes images by default. */
declare function loadWebMedia(mediaUrl: string, maxBytesOrOptions?: number | WebMediaOptions, options?: {
  ssrfPolicy?: SsrFPolicy;
  localRoots?: readonly string[] | "any";
}): Promise<WebMediaResult>;
//#endregion
//#region src/media/audio.d.ts
/**
 * Backward-compatible alias for voice-message audio compatibility checks.
 *
 * @deprecated Use isVoiceMessageCompatibleAudio.
 */
declare function isVoiceCompatibleAudio(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean;
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
  autoProviderFallback?: boolean;
  /** Optional per-request provider timeout in milliseconds. */
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
  /** Provider explicitly configured in source config, before auto-detect fallback. */
  providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none";
  /** Provider that runtime calls should use after config validation and credential lookup. */
  selectedProvider?: string;
  /** Source that supplied the selected provider credential, or why it is unavailable. */
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing";
  /** Perplexity transport chosen from provider config or runtime default. */
  perplexityTransport?: "search_api" | "chat_completions";
  diagnostics: RuntimeWebDiagnostic[];
};
/** Runtime selection metadata for the web fetch tool. */
type RuntimeWebFetchMetadata = {
  /** Provider explicitly configured in source config, before auto-detect fallback. */
  providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none";
  /** Provider that runtime calls should use after config validation and credential lookup. */
  selectedProvider?: string;
  /** Source that supplied the selected provider credential, or why it is unavailable. */
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
  envVars: string[];
  /** Optional model-provider auth profile id that can satisfy this web provider without a tool-specific API key. */
  authProviderId?: string;
  placeholder: string;
  signupUrl: string;
  docsUrl?: string;
  /** Optional note shown before credential collection for provider-specific prerequisites. */
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
//#region src/globals.d.ts
declare function shouldLogVerbose(): boolean;
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
//#region src/channels/message/ingress-queue.d.ts
/** Pending or retryable inbound channel event stored in the durable ingress queue. */
type ChannelIngressQueueRecord<TPayload, TMetadata = unknown> = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  payload: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  laneKey?: string;
  attempts: number;
  lastAttemptAt?: number;
  lastError?: string;
};
/** Pending ingress event currently claimed by a worker. */
type ChannelIngressQueueClaim<TPayload, TMetadata = unknown> = ChannelIngressQueueRecord<TPayload, TMetadata> & {
  claim: {
    token: string;
    ownerId: string;
    claimedAt: number;
  };
};
/** Minimal claim reference used to guard completion/release/failure with a claim token. */
type ChannelIngressQueueClaimRef = {
  id: string;
  claim: {
    token: string;
  };
};
/** Claim identity available when a stale row's payload cannot be decoded. */
type ChannelIngressQueueCorruptClaim = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  laneKey?: string;
  reason: "corrupt_payload";
  claim: {
    token: string;
    ownerId: string;
    claimedAt: number;
  };
};
/** Completed ingress event tombstone retained for duplicate detection. */
type ChannelIngressQueueCompletedRecord<TCompletedMetadata = unknown> = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  completedAt: number;
  metadata?: TCompletedMetadata;
};
/** Failed ingress event tombstone retained for duplicate detection. */
type ChannelIngressQueueFailedRecord = {
  id: string;
  channelId: string;
  accountId: string;
  queueName: string;
  failedAt: number;
  reason: string;
  message?: string;
};
/** Rich failed ingress event retained for diagnostics and operator recovery. */
type ChannelIngressQueueDeadLetterRecord<TPayload = unknown, TMetadata = unknown> = ChannelIngressQueueFailedRecord & {
  payload?: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  laneKey?: string;
  attempts: number;
  lastAttemptAt?: number;
};
/** Outcome of asking a channel/account queue to re-enqueue one failed event. */
type ChannelIngressQueueResubmitResult<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  kind: "resubmitted";
  record: ChannelIngressQueueRecord<TPayload, TMetadata>;
  previous: ChannelIngressQueueDeadLetterRecord<TPayload, TMetadata>;
} | {
  kind: "not-found";
} | {
  kind: "completed";
  record: ChannelIngressQueueCompletedRecord<TCompletedMetadata>;
} | {
  kind: "active";
  status: "pending" | "claimed";
} | {
  kind: "unrecoverable";
  record: ChannelIngressQueueDeadLetterRecord<TPayload, TMetadata>;
};
/** Retention options for pending, completed, and failed ingress queue rows. */
type ChannelIngressQueuePruneOptions = {
  pendingTtlMs?: number;
  completedTtlMs?: number;
  failedTtlMs?: number;
  pendingMaxEntries?: number;
  completedMaxEntries?: number;
  failedMaxEntries?: number;
  protectIds?: Iterable<string>;
  now?: number;
};
/** Result of enqueueing a possibly duplicate ingress event id. */
type ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata> = {
  kind: "accepted";
  duplicate: false;
  record: ChannelIngressQueueRecord<TPayload, TMetadata>;
} | {
  kind: "pending";
  duplicate: true;
  record: ChannelIngressQueueRecord<TPayload, TMetadata>;
} | {
  kind: "claimed";
  duplicate: true;
  record: ChannelIngressQueueClaim<TPayload, TMetadata>;
} | {
  kind: "completed";
  duplicate: true;
  record: ChannelIngressQueueCompletedRecord<TCompletedMetadata>;
} | {
  kind: "failed";
  duplicate: true;
  record: ChannelIngressQueueFailedRecord;
};
/** Durable FIFO-ish ingress queue with claims, duplicate detection, and retention pruning. */
type ChannelIngressQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  enqueue(id: string, payload: TPayload, options?: {
    metadata?: TMetadata;
    receivedAt?: number;
    laneKey?: string;
  }): Promise<ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata>>;
  listPending(options?: {
    limit?: number | "all";
    orderBy?: "received" | "id";
  }): Promise<Array<ChannelIngressQueueRecord<TPayload, TMetadata>>>;
  listClaims(): Promise<Array<ChannelIngressQueueClaim<TPayload, TMetadata>>>;
  /** Additive SDK seam; optional so existing external queue test doubles remain compatible. */
  listFailed?(options?: {
    limit?: number | "all";
  }): Promise<Array<ChannelIngressQueueDeadLetterRecord<TPayload, TMetadata>>>;
  claimNext(options?: {
    ownerId?: string;
    blockedLaneKeys?: Iterable<string>;
    staleMs?: number;
    orderBy?: "received" | "id";
    scanLimit?: number;
    candidateIds?: Iterable<string>;
    deriveLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>) => string | undefined;
    /** Authorize a changed durable lane before the atomic pending-to-claimed transition. */
    reconcileStoredLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>, storedLaneKey: string, derivedLaneKey: string) => boolean;
  }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
  claim(id: string, options?: {
    ownerId?: string;
  }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
  refreshClaim?(claim: ChannelIngressQueueClaimRef, options?: {
    refreshedAt?: number;
  }): Promise<boolean>;
  complete(idOrClaim: string | ChannelIngressQueueClaimRef, options?: {
    metadata?: TCompletedMetadata;
    completedAt?: number;
  }): Promise<boolean>;
  release(idOrClaim: string | ChannelIngressQueueClaimRef, options?: {
    lastError?: string;
    releasedAt?: number;
    recordAttempt?: boolean;
  }): Promise<boolean>;
  fail(idOrClaim: string | ChannelIngressQueueClaimRef, options: {
    reason: string;
    message?: string;
    failedAt?: number;
  }): Promise<boolean>;
  /** Additive SDK seam; actual runtime queues support operator resubmission. */
  resubmit?(id: string, options?: {
    resubmittedAt?: number;
  }): Promise<ChannelIngressQueueResubmitResult<TPayload, TMetadata, TCompletedMetadata>>;
  delete(idOrClaim: string | ChannelIngressQueueRecord<TPayload, TMetadata> | ChannelIngressQueueClaimRef): Promise<boolean>;
  recoverStaleClaims(options?: {
    staleMs?: number;
    now?: number;
    shouldRecover?: (claim: ChannelIngressQueueClaim<TPayload, TMetadata>) => boolean | Promise<boolean>;
    shouldRecoverCorrupt?: (claim: ChannelIngressQueueCorruptClaim) => boolean | Promise<boolean>;
  }): Promise<number>;
  prune(options?: ChannelIngressQueuePruneOptions): Promise<number>;
};
/** Construction options for a channel/account-scoped ingress queue. */
type CreateChannelIngressQueueOptions = {
  channelId: string;
  accountId?: string;
  stateDir?: string;
  now?: () => number;
};
//#endregion
//#region src/channels/message/ingress-drain-lifecycle.d.ts
/** Full pre-adoption -> adoption ownership lifecycle for one claimed event. */
type ChannelIngressDispatchLifecycle = {
  /** Pre-adoption only. After adopt the drain treats this signal as inert. */
  abortSignal: AbortSignal;
  /**
   * Fires when recovery-relevant session/run state is durable.
   * Drain completes (tombstones) the claim here -- never at settle.
   */
  onAdopted: () => void | Promise<void>;
  /**
   * Turn ownership deferred to reply-lane admission (queued followup).
   * Claim remains held until adopted or abandoned.
   */
  onDeferred: () => void;
  /**
   * Durable adoption finalization is in progress (e.g. settlement hold while
   * committing dedupe). Clears the pre-adoption stall watchdog so a timeout
   * settlement cannot race and dead-letter an about-to-complete claim.
   * Claim stays held until onAdopted / onAbandoned / fail.
   */
  onAdoptionFinalizing: () => void;
  /** Deferred work terminally failed after dispatch returned. */
  onFailed?: (error: unknown) => void | Promise<void>;
  /** Explicit cancellation before adoption; releases without consuming retry budget. */
  onCancelled?: () => void | Promise<void>;
  /**
   * Deferred turn finished without ever owning the reply lane.
   * Drain releases the claim for retry.
   */
  onAbandoned: () => void | Promise<void>;
};
//#endregion
//#region src/channels/message/ingress-drain-state.d.ts
type ChannelIngressDrainDispatchResult = {
  kind: "completed";
} | {
  kind: "deferred";
} | {
  kind: "failed-retryable";
  error: unknown;
};
//#endregion
//#region src/channels/message/ingress-retry-policy.d.ts
type IngressRetryPolicyConfig = {
  maxAttempts?: number;
  deadLetterMinAgeMs?: number;
  baseMs?: number;
  maxMs?: number;
};
type IngressNonRetryableFailure = {
  reason: string;
  message: string;
};
//#endregion
//#region src/channels/message/ingress-drain.d.ts
type DeferredLaneOccupancy = "hold" | "release";
type CreateChannelIngressDrainOptions<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
  queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  /**
   * Dispatch a claimed event. Wire lifecycle into reply options (see
   * bindIngressLifecycleToReplyOptions). Return deferred when ownership will
   * transfer at reply-lane admission; otherwise complete or throw.
   */
  dispatchClaimedEvent: (event: ChannelIngressQueueClaim<TPayload, TMetadata>, lifecycle: ChannelIngressDispatchLifecycle) => Promise<ChannelIngressDrainDispatchResult | void> | ChannelIngressDrainDispatchResult | void;
  resolveNonRetryableFailure?: (err: unknown) => IngressNonRetryableFailure | null;
  shouldSupersedePending?: (newEvent: ChannelIngressQueueRecord<TPayload, TMetadata> | ChannelIngressQueueClaim<TPayload, TMetadata>, pendingEvent: ChannelIngressQueueClaim<TPayload, TMetadata>) => boolean | Promise<boolean>;
  deriveLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>) => string | undefined;
  reconcileStoredLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>, storedLaneKey: string, derivedLaneKey: string) => boolean;
  ownerId?: string;
  adoptionStallTimeoutMs?: number;
  claimLeaseMs?: number;
  /**
   * Whether a claimed event keeps occupying its ingress serialization lane after
   * dispatch hands ownership to deferred work. Default "hold" (current behavior).
   */
  deferredLaneOccupancy?: DeferredLaneOccupancy;
  retryPolicy?: IngressRetryPolicyConfig;
  now?: () => number;
  formatError?: (err: unknown) => string;
  onLog?: (message: string) => void;
  abortSignal?: AbortSignal;
  orderBy?: "received" | "id";
  scanLimit?: number;
  startLimit?: number;
};
type ChannelIngressDrain = {
  recoverStaleClaims: () => Promise<number>;
  drainOnce: (options?: {
    shouldStop?: () => boolean;
  }) => Promise<{
    started: number;
  }>;
  activeLaneKeys: () => ReadonlySet<string>;
  waitForIdle: () => Promise<void>;
  dispose: () => void;
};
//#endregion
//#region src/tasks/task-flow-registry.types.d.ts
type TaskFlowSyncMode = "task_mirrored" | "managed";
/** Lifecycle statuses for multi-step task flows. */
declare const TASK_FLOW_STATUSES: readonly ["queued", "running", "waiting", "blocked", "succeeded", "failed", "cancelled", "lost"];
type TaskFlowStatus = (typeof TASK_FLOW_STATUSES)[number];
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
//#region src/plugins/tool-types.d.ts
type OpenClawPluginActiveModelContext = {
  provider?: string;
  modelId?: string;
  modelRef?: string;
};
/** Current-turn outbound delivery capability bound to the host-selected route and media policy. */
type OpenClawPluginToolDelivery = {
  send: (params: {
    text?: string;
    mediaUrl?: string;
  }) => Promise<void>;
};
/** Trusted execution context passed to plugin-owned agent tool factories. */
type OpenClawPluginToolContext = {
  config?: OpenClawConfig;
  /** Active runtime-resolved config snapshot when one is available. */
  runtimeConfig?: OpenClawConfig;
  /** Returns the latest runtime-resolved config snapshot for long-lived tool definitions. */
  getRuntimeConfig?: () => OpenClawConfig | undefined;
  /** Effective filesystem policy for the active tool run. */
  fsPolicy?: ToolFsPolicy;
  workspaceDir?: string;
  agentDir?: string;
  agentId?: string;
  sessionKey?: string;
  /** Ephemeral session UUID - regenerated on /new and /reset. Use for per-conversation isolation. */
  sessionId?: string;
  /** Out-of-band plugin-owned bindings attached by the current run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>;
  /** Host-prepared repository identities for project-aware tool behavior. */
  activeProjectKeys?: readonly string[];
  /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
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
  agentAccountId?: string;
  /** Trusted provider auth availability from the active auth profile store. */
  hasAuthForProvider?: (providerId: string) => boolean;
  /** Resolves an API key from the active auth profile store when available. */
  resolveApiKeyForProvider?: (providerId: string) => Promise<string | undefined>;
  /** Trusted ambient delivery route for the active agent/session. */
  deliveryContext?: DeliveryContext;
  /** Host-bound current-route delivery. Retained copies fail after the owning turn closes. */
  delivery?: OpenClawPluginToolDelivery;
  /** Trusted platform-native conversation id for the active inbound turn. */
  nativeChannelId?: string;
  /** Trusted sender id from inbound context (runtime-provided, not tool args). */
  requesterSenderId?: string;
  /** Trusted owner bit from inbound context (runtime-provided, not tool args). */
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
//#region packages/media-understanding-common/src/active-model.d.ts
/** Provider/model pair selected for one media-understanding request. */
type ActiveMediaModel = {
  provider: string;
  model?: string;
};
//#endregion
//#region src/media-understanding/runtime-types.d.ts
type RunMediaUnderstandingFileParams = {
  capability: "image" | "audio" | "video";
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
  scopeContext?: MediaUnderstandingScopeContext;
};
type MediaUnderstandingScopeContext = {
  sessionKey?: string;
  channel?: string;
  chatType?: string;
};
type RunMediaUnderstandingFileResult = {
  text: string | undefined;
  provider?: string;
  model?: string;
  output?: MediaUnderstandingOutput;
  decision?: MediaUnderstandingDecision;
};
type DescribeImageFileParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
  scopeContext?: MediaUnderstandingScopeContext;
};
type DescribeImageFileWithModelParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  provider: string;
  model: string;
  prompt: string;
  maxTokens?: number;
  timeoutMs?: number;
};
type PreparedImageDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type PrepareImageDescriptionInputParams = Pick<DescribeImageFileWithModelParams, "filePath" | "mediaUrl" | "mime" | "cfg" | "timeoutMs">;
type DescribePreparedImageWithModelParams = Omit<DescribeImageFileWithModelParams, "filePath" | "mediaUrl" | "mime"> & {
  image: PreparedImageDescriptionInput;
};
type DescribeImageFileWithModelResult = Awaited<ReturnType<NonNullable<MediaUnderstandingProvider["describeImage"]>>>;
type ExtractStructuredWithModelParams = {
  /** At least one image input is required; text inputs provide supplemental context. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  cfg: OpenClawConfig;
  agentDir?: string;
  provider: string;
  model: string;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
};
type ExtractStructuredWithModelResult = Awaited<ReturnType<NonNullable<MediaUnderstandingProvider["extractStructured"]>>>;
type DescribeVideoFileParams = {
  filePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
};
type TranscribeAudioFileParams = {
  filePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  language?: string;
  prompt?: string;
};
type MediaUnderstandingRuntime = {
  runMediaUnderstandingFile: (params: RunMediaUnderstandingFileParams) => Promise<RunMediaUnderstandingFileResult>;
  describeImageFile: (params: DescribeImageFileParams) => Promise<RunMediaUnderstandingFileResult>;
  prepareImageDescriptionInput: (params: PrepareImageDescriptionInputParams) => Promise<PreparedImageDescriptionInput>;
  describePreparedImageWithModel: (params: DescribePreparedImageWithModelParams) => Promise<DescribeImageFileWithModelResult>;
  describeImageFileWithModel: (params: DescribeImageFileWithModelParams) => Promise<DescribeImageFileWithModelResult>;
  extractStructuredWithModel: (params: ExtractStructuredWithModelParams) => Promise<ExtractStructuredWithModelResult>;
  describeVideoFile: (params: DescribeVideoFileParams) => Promise<RunMediaUnderstandingFileResult>;
  transcribeAudioFile: (params: TranscribeAudioFileParams) => Promise<RunMediaUnderstandingFileResult>;
};
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
type TtsRuntimeApi = typeof runtime_api_d_exports;
type ListSpeechVoices = TtsRuntimeApi["listSpeechVoices"];
type PrepareTtsRequest = (...args: Parameters<TtsRuntimeApi["prepareTtsRequest"]>) => Promise<ReturnType<TtsRuntimeApi["prepareTtsRequest"]>>;
type TextToSpeech = typeof textToSpeech;
type TextToSpeechStream = TtsRuntimeApi["textToSpeechStream"];
type TextToSpeechTelephony = TtsRuntimeApi["textToSpeechTelephony"];
type RuntimeRequestHeartbeatOptions = Parameters<typeof requestHeartbeat>[0];
type RuntimeRequestHeartbeatNowOptions = Omit<RuntimeRequestHeartbeatOptions, "source" | "intent"> & Partial<Pick<RuntimeRequestHeartbeatOptions, "source" | "intent">>;
type RuntimeWriteConfigOptions = {
  envSnapshotForRestore?: Record<string, string | undefined>;
  expectedConfigPath?: string;
  unsetPaths?: string[][];
};
type DeepReadonly<T> = T extends ((...args: never[]) => unknown) ? T : T extends readonly (infer U)[] ? ReadonlyArray<DeepReadonly<U>> : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]>; } : T;
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
  spawnedCwd?: string;
  sessionRoot?: string;
  permissionMode?: RuntimeSessionEntry["permissionMode"];
  /** Bind the created session's CLI execution to this paired node. */
  execNode?: string;
  /** Working directory interpreted only by execNode. */
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
    pluginExtensions?: RuntimeSessionPluginExtensions;
    /** Registry-injected owner; plugin callers cannot select another owner. */
    pluginOwnerId?: string;
  } | {
    acpBackendId: string;
    acpSessionBinding: {
      acpAgentId: string;
      agentSessionId: string;
    };
    modelSelectionLocked?: true;
    pluginExtensions?: RuntimeSessionPluginExtensions;
    /** Registry-injected owner; plugin callers cannot select another owner. */
    pluginOwnerId?: string;
  };
};
type RuntimeCreateSessionEntryParams = RuntimeCreateSessionEntryBaseParams & ({
  /** Retry an interrupted initializer only when persisted trusted state matches exactly. */
  recoverMatchingInitialEntry: true;
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
  sessionKey?: string;
  /** Override heartbeat config (e.g. `{ target: "last" }` to deliver to the last active channel). */
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
  /** Model ref (e.g. "anthropic/claude-sonnet-4-6"); defaults to the target agent's configured model. */
  model?: string;
  /** Advisory output limit; runtime owners without an equivalent control may ignore it. */
  maxTokens?: number;
  /** Advisory sampling hint; runtime owners without an equivalent control may ignore it. */
  temperature?: number;
  /** Requested reasoning effort; the host normalizes it for the selected model. */
  reasoning?: ThinkLevel;
  systemPrompt?: string;
  signal?: AbortSignal;
  /** Human-readable reason for audit/debug output. */
  purpose?: string;
  /** Agent whose model/credentials to use. Session-bound capabilities may disallow overrides. */
  agentId?: string;
};
type LlmDirectCompleteParams = LlmCompleteCommonParams & {
  messages: LlmCompleteMessage[];
  execution?: undefined;
};
type LlmIsolatedAgentRuntimeCompleteParams = LlmCompleteCommonParams & {
  /** Isolated runtimes currently accept one fresh user prompt, not a replayed chat history. */
  messages: [{
    role: "user";
    content: string;
  }];
  execution: {
    /** Fresh, literal-zero-tool completion through the configured agent runtime. */
    mode: "isolated-agent-runtime";
    /** Exact credential owner. Requires host-granted plugin policy. */
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
    /** Current process runtime config snapshot. Prefer config passed into the active call path. */
    current: () => DeepReadonly<OpenClawConfig>;
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
    resolveAgentIdentity: typeof resolveAgentIdentity;
    /** Resolve an allowed catalog create target through canonical agent model/runtime policy. */
    resolveSessionCatalogCreateTarget: typeof resolveAgentCatalogCreateTarget;
    resolveThinkingDefault: (params: {
      cfg: OpenClawConfig;
      provider: string;
      model: string;
      catalog?: ModelCatalogEntry[];
    }) => ThinkLevel;
    normalizeThinkingLevel: (raw?: string | null) => ThinkLevel | undefined;
    resolveThinkingPolicy: (params: PluginRuntimeThinkingPolicyRequest) => PluginRuntimeThinkingPolicy;
    /** Admit a turn for this exact trusted channel plugin and its authenticated sender. */
    runCommandFromIngress: (opts: AgentCommandIngressOpts, runtime: RuntimeEnv) => ReturnType<typeof agentCommandFromIngress>;
    runEmbeddedAgent: RuntimeRunEmbeddedAgent;
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
  hooks: {
    /** Dispatch untrusted external content through an isolated, contained hook agent turn. */
    dispatchHookAgentTurn: (params: {
      name: string;
      agentId: string;
      sessionKey: string;
      message: string;
      externalContentSource: "email";
      deliver: boolean;
      model?: string;
      thinking?: ThinkLevel;
      timeoutSeconds?: number;
      idempotencyKey?: string;
    }) => Promise<{
      ok: true;
      runId: string;
    } | {
      ok: false;
      reason: string;
    }>;
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
    /** Resolve auth for a model. Only provider/model, optional cfg, and workspaceDir are used. */
    getApiKeyForModel: (params: {
      model: Model<Api>;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderAuth>;
    /** Resolve request-ready auth for a model, including provider runtime exchanges. */
    getRuntimeAuthForModel: (params: {
      model: Model<Api>;
      cfg?: OpenClawConfig;
      workspaceDir?: string;
    }) => Promise<ResolvedProviderRuntimeAuth>;
    /** Resolve auth for a provider by name. Only provider, optional cfg, and workspaceDir are used. */
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
  /** Ordered messages to use as model context */
  messages: AgentMessage[];
  /** Estimated total tokens in assembled context */
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
  promptAuthority?: "assembled" | "preassembly_may_overflow";
  /** Optional context-engine-provided instructions prepended to the runtime system prompt */
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
  /** How the assembled context should be projected into the backend runtime. */
  mode: "per_turn" | "thread_bootstrap";
  /** Stable context epoch. Changing this tells persistent backends to rotate. */
  epoch?: string;
  /** Optional diagnostic fingerprint for the projected context payload. */
  fingerprint?: string;
};
type ContextEngineOperation = "agent-run" | "manual-compact" | "subagent-spawn";
type ContextEngineRuntimeMode = "normal" | "fallback" | "degraded";
type ContextEngineSelectionSource = "configured" | "default" | "unknown";
type ContextEngineRuntimeReasonCode = "provider_timeout" | "provider_unavailable" | "rate_limited" | "context_overflow" | "runtime_unavailable" | "unknown";
type ContextEngineHostCapability = "bootstrap" | "assemble-before-prompt" | "after-turn" | "maintain" | "compact" | "runtime-llm-complete" | "thread-bootstrap-projection";
type ContextEngineHostRequirements = {
  /** Host capabilities required before the engine can safely serve this operation. */
  requiredCapabilities: ContextEngineHostCapability[];
  /** Optional engine-authored guidance appended to the host compatibility error. */
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
    details?: unknown;
    /** Session id after compaction, when the runtime rotated transcripts. */
    sessionId?: string;
    /** Typed post-compaction live session target; successor when the runtime rotated transcripts. */
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
  /** Whether the message was ingested (false if duplicate or no-op) */
  ingested: boolean;
};
type IngestBatchResult = {
  /** Number of messages ingested from the supplied batch */
  ingestedCount: number;
};
type BootstrapResult = {
  /** Whether bootstrap ran and initialized the engine's store */
  bootstrapped: boolean;
  /** Number of historical messages imported (if applicable) */
  importedMessages?: number;
  /** Optional reason when bootstrap was skipped */
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
  };
  /** True when the engine manages its own compaction lifecycle. */
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
  /** Roll back pre-spawn setup when subagent launch fails. */
  rollback: () => void | Promise<void>;
};
type SubagentEndReason = "deleted" | "completed" | "swept" | "released";
type TranscriptRewriteReplacement = {
  /** Existing transcript entry id to replace on the active branch. */
  entryId: string;
  /** Replacement message content for that entry. */
  message: AgentMessage;
};
type TranscriptRewriteRequest = {
  /** Message entry replacements to apply in one branch-and-reappend pass. */
  replacements: TranscriptRewriteReplacement[];
  /** Optional entry-id set that must cover every active-branch entry from the first replacement onward. */
  allowedRewriteSuffixEntryIds?: string[];
};
type TranscriptRewriteResult = {
  /** Whether the active branch changed. */
  changed: boolean;
  /** Estimated bytes removed from the active branch message payloads. */
  bytesFreed: number;
  /** Number of transcript message entries rewritten. */
  rewrittenEntries: number;
  /** Optional reason when no rewrite occurred. */
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
  /** Runtime-resolved retention for the actual provider/model/request path. */
  retention?: ContextEnginePromptCacheRetention;
  /** Usage from the most recent API call, not accumulated retry/tool-loop totals. */
  lastCallUsage?: ContextEnginePromptCacheUsage;
  /** Result from the runtime's prompt-cache observability heuristic. */
  observation?: ContextEnginePromptCacheObservation;
  /** Last known cache-touch timestamp from runtime-managed cache-TTL bookkeeping. */
  lastCacheTouchAt?: number;
  /** Known cache expiry time when the runtime can source it confidently. */
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
  /** Agent that owns the session in the runtime store. */
  agentId?: string;
  /** Runtime session id to compact. */
  sessionId?: string;
  /** Stable session key used for aliases, policy, and store resolution. */
  sessionKey?: string;
  /** Session store path that scopes the SQLite-backed runtime session. */
  storePath?: string;
  /** Optional transport thread identity for session target resolution. */
  threadId?: string | number;
};
type ContextEngineRuntimeContext = Record<string, unknown> & {
  /** Runtime task working directory; workspaceDir remains the agent bootstrap workspace. */
  cwd?: string;
  /**
   * True when the host has explicitly opted this maintenance run into
   * consuming deferred compaction debt.
   */
  allowDeferredCompactionExecution?: boolean;
  /** Runtime-resolved context window budget for the active model call. */
  tokenBudget?: number;
  /** Selected agent harness id when compaction delegates back to the runtime. */
  agentHarnessId?: string;
  /** Best-effort current prompt/context token estimate for this turn. */
  currentTokenCount?: number;
  /** Optional prompt-cache telemetry for cache-aware engines. */
  promptCache?: ContextEnginePromptCacheInfo;
  /** Authoritative transcript backend for this turn. */
  transcriptStorage?: ContextEngineTranscriptStorageInfo;
  /** Storage-neutral runtime session target for compaction delegation. */
  sessionTarget?: ContextEngineSessionTarget;
  /**
   * Safe transcript rewrite helper implemented by the runtime.
   *
   * Engines decide what is safe to rewrite; the runtime owns how the session
   * DAG is updated on disk.
   */
  rewriteTranscriptEntries?: (request: TranscriptRewriteRequest) => Promise<TranscriptRewriteResult>;
  /** LLM completion capability for engines that need model inference. */
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
    sessionKey?: string;
    /** Storage-neutral runtime session target for transcript/session SDK helpers. */
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
    sessionKey?: string;
    /** Storage-neutral runtime session target for transcript/session SDK helpers. */
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
    message: AgentMessage;
    /** True when the message belongs to a heartbeat run. */
    isHeartbeat?: boolean;
  }): Promise<IngestResult>;
  /**
   * Ingest a completed turn batch as a single unit.
   */
  ingestBatch?(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[];
    /** True when the batch belongs to a heartbeat run. */
    isHeartbeat?: boolean;
  }): Promise<IngestBatchResult>;
  /**
   * Execute optional post-turn lifecycle work after a run attempt completes.
   * Engines can use this to persist canonical context and trigger background
   * compaction decisions.
   */
  afterTurn?(params: {
    sessionId: string;
    sessionKey?: string;
    /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    messages: AgentMessage[];
    /** Number of messages that existed before the prompt was sent. */
    prePromptMessageCount: number;
    /** Optional auto-compaction summary emitted by the runtime. */
    autoCompactionSummary?: string;
    /** True when this turn belongs to a heartbeat run. */
    isHeartbeat?: boolean;
    /** Optional model context token budget for proactive compaction. */
    tokenBudget?: number;
    /** Optional runtime-owned context for engines that need caller state. */
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
    tokenBudget?: number;
    /** Tool names available for this run so engines can align prompt guidance with runtime tool access. */
    availableTools?: Set<string>;
    /** Active memory citation mode when engines want to mirror memory prompt guidance. */
    citationsMode?: MemoryCitationsMode;
    /** Current model identifier (e.g. "claude-opus-4", "gpt-4o", "qwen2.5-7b").
     *  Allows context engine plugins to adapt formatting per model. */
    model?: string;
    /** The incoming user prompt for this turn (useful for retrieval-oriented engines). */
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
    sessionKey: string;
    /** Caller-resolved owner agent for global session aliases. */
    agentId?: string;
    /** Storage-neutral runtime session target for delegated compaction. */
    sessionTarget?: ContextEngineSessionTarget;
    tokenBudget?: number;
    /** Force compaction even below the default trigger threshold. */
    force?: boolean;
    /** Optional live token estimate from the caller's active context. */
    currentTokenCount?: number;
    /** Controls convergence target; defaults to budget. */
    compactionTarget?: "budget" | "threshold";
    customInstructions?: string;
    /** Optional runtime-owned context for engines that need caller state. */
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
//#region src/plugins/cli-backend.types.d.ts
/** Static command adapter owned by a CLI backend plugin registration. */
type CliBackendConfig = {
  /** CLI command to execute (absolute path or on PATH). */
  command: string;
  /** Base args applied to every invocation. */
  args?: string[];
  /** Output parsing mode (default: json). */
  output?: "json" | "text" | "jsonl";
  /** Output parsing mode when resuming a CLI session. */
  resumeOutput?: "json" | "text" | "jsonl";
  /** JSONL event dialect for CLIs with provider-specific stream formats. */
  jsonlDialect?: "claude-stream-json" | "gemini-stream-json";
  /** Long-lived CLI process mode. */
  liveSession?: "claude-stdio";
  /** Prompt input mode (default: arg). */
  input?: "arg" | "stdin";
  /** Max prompt length for arg mode (if exceeded, stdin is used). */
  maxPromptArgChars?: number;
  /** Extra env vars injected for this CLI. */
  env?: Record<string, string>;
  /** Env vars to remove before launching this CLI. */
  clearEnv?: string[];
  /** Flag used to pass model id (e.g. --model). */
  modelArg?: string;
  /** Model aliases mapping (OpenClaw model id → CLI model id). */
  modelAliases?: Record<string, string>;
  /** Args used to pass a session id (use {sessionId} placeholder). */
  sessionArgs?: string[];
  /** Alternate args to use when resuming a session (use {sessionId} placeholder). */
  resumeArgs?: string[];
  /** Argument appended to one explicitly forked resume invocation. */
  forkArg?: string;
  /** Argument followed by an assistant checkpoint id to bound one resumed fork. */
  resumeAtArg?: string;
  /** When to pass session ids. */
  sessionMode?: "always" | "existing" | "none";
  /** JSON fields to read session id from (in order). */
  sessionIdFields?: string[];
  /** Flag used to pass system prompt. */
  systemPromptArg?: string;
  /** Flag used to pass a system prompt file. */
  systemPromptFileArg?: string;
  /** Config override flag used to pass a system prompt file (e.g. -c). */
  systemPromptFileConfigArg?: string;
  /** Config override key used to pass a system prompt file. */
  systemPromptFileConfigKey?: string;
  /** System prompt behavior (append vs replace). */
  systemPromptMode?: "append" | "replace";
  /** When to send system prompt. */
  systemPromptWhen?: "first" | "always" | "never";
  /** Flag used to pass image paths. */
  imageArg?: string;
  /** How to pass multiple images. */
  imageMode?: "repeat" | "list";
  /** Where staged image files should live before handing them to the CLI. */
  imagePathScope?: "temp" | "workspace";
  /** Serialize runs for this CLI. */
  serialize?: boolean;
  /** Opt in to bounded raw transcript reseed before compaction for safe session resets. */
  reseedFromRawTranscriptWhenUncompacted?: boolean;
  /**
   * Controls fresh recovery after a recoverable resumed-session failure.
   *
   * Undefined and `replace-binding` preserve the legacy clear-and-reseed behavior.
   * `invalidated-only` retries fresh only when the failure proves the binding expired.
   */
  freshSessionRecovery?: "replace-binding" | "invalidated-only";
  /** Runtime reliability tuning for this backend's process lifecycle. */
  reliability?: {
    /** No-output watchdog tuning (fresh vs resumed runs). */
    watchdog?: {
      /** Fresh/new sessions (non-resume). */
      fresh?: {
        /** Fraction of overall timeout used when fixed timeout is not set. */
        noOutputTimeoutRatio?: number;
        /** Lower bound for computed watchdog timeout. */
        minMs?: number;
        /** Upper bound for computed watchdog timeout. */
        maxMs?: number;
      };
      /** Resume sessions. */
      resume?: {
        /** Fraction of overall timeout used when fixed timeout is not set. */
        noOutputTimeoutRatio?: number;
        /** Lower bound for computed watchdog timeout. */
        minMs?: number;
        /** Upper bound for computed watchdog timeout. */
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
  /** Rewrites applied to outbound prompt text before provider/CLI transport. */
  input?: PluginTextReplacement[];
  /** Rewrites applied to inbound assistant text before OpenClaw consumes it. */
  output?: PluginTextReplacement[];
};
type CliBundleMcpMode = "claude-config-file" | "codex-config-overrides" | "gemini-system-settings";
type CliBackendPrepareExecutionContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  /** Effective catalog context-window option selected for this run. */
  contextWindow?: string;
  /** Effective OpenClaw context budget selected for this run. */
  contextTokenBudget?: number;
  /** Effective OpenClaw thinking level selected for this run. */
  thinkingLevel?: CliBackendThinkingLevel;
  authProfileId?: string;
  executionMode?: CliBackendExecutionMode;
  /** Exact runtime tool surface the backend must enforce for this run. */
  toolAvailability?: CliBackendToolAvailability;
  /** Core-prepared environment, including any bundled MCP settings path. */
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
  cleanup?: () => Promise<void>;
  /** Positive acknowledgement for `prepare-execution` tool enforcement. */
  toolAvailabilityEnforced?: true;
  /** Optional plugin-owned execution transport for this prepared local run. */
  execute?: CliBackendExecute;
};
type CliBackendThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
type CliBackendExecutionMode = "agent" | "side-question";
/** Exact backend-native plus canonical OpenClaw tool surface for one CLI run. */
type CliBackendToolAvailability = {
  native: readonly string[];
  /** Canonical OpenClaw tool names served through the host-isolated transport. */
  openClaw: readonly string[];
};
/** Native action a plugin-owned runtime asks the admitted host run to authorize. */
type CliBackendToolPermissionRequest = {
  toolName: string;
  toolInput: Record<string, unknown>;
  toolCallId?: string;
  abortSignal?: AbortSignal;
};
/** Host-owned native action decision; plugins never acquire approval authority. */
type CliBackendToolPermissionResult = {
  behavior: "allow";
  updatedInput: Record<string, unknown>;
} | {
  behavior: "deny";
  message: string;
};
type CliBackendUserInputOption = {
  label: string;
  description?: string;
};
type CliBackendUserInputQuestion = {
  id: string;
  header: string;
  question: string;
  multiSelect?: boolean;
  isOther?: boolean;
  options?: readonly CliBackendUserInputOption[] | null;
};
/** Structured operator input requested by a plugin-owned native runtime. */
type CliBackendUserInputRequest = {
  toolName: string;
  questions: readonly CliBackendUserInputQuestion[];
  intro?: string;
  toolCallId?: string;
  abortSignal?: AbortSignal;
};
type CliBackendUserInputResult = {
  status: "answered";
  answers: Record<string, string[]>;
} | {
  status: "cancelled";
  message: string;
};
/** Lifecycle reasons accepted by a plugin-owned reusable execution process. */
type CliBackendLiveSessionCloseReason = "idle" | "restart" | "abort" | "mcp-capture-rotation";
/** Plugin-owned process lifecycle registered with the generic host owner. */
type CliBackendLiveSessionHandle = {
  generation: string;
  fingerprint: string;
  isIdle(): boolean;
  close(reason: CliBackendLiveSessionCloseReason, error?: unknown): void;
  waitForExit(): Promise<void>;
};
/** Closure-bound host capability for one admitted reusable-runtime turn. */
type CliBackendLiveSessionCapability = {
  fingerprint: string;
  current(): CliBackendLiveSessionHandle | undefined;
  register(handle: CliBackendLiveSessionHandle): void;
  /** Rebinds this exact admitted turn to the registered process's stable capture. */
  activate(handle: CliBackendLiveSessionHandle): void;
  remove(handle: CliBackendLiveSessionHandle): void;
};
/** Exact prepared local process facts consumed by a plugin-owned execution transport. */
type CliBackendExecuteContext = {
  command: string;
  args: readonly string[];
  cwd: string;
  env: Record<string, string>;
  prompt: string;
  modelId: string;
  systemPrompt: string;
  sessionId?: string;
  useResume: boolean;
  abortSignal?: AbortSignal;
  timeoutMs: number;
  executionMode?: CliBackendExecutionMode;
  toolAvailability?: CliBackendToolAvailability;
  /** Exact host-owned reusable process lifecycle and current-turn admission. */
  liveSession?: CliBackendLiveSessionCapability;
  /** Closure-bound approval capability; retained copies fail after the run closes. */
  requestToolPermission: (request: CliBackendToolPermissionRequest) => Promise<CliBackendToolPermissionResult>;
  /** Closure-bound structured-input capability; retained copies fail after the run closes. */
  requestUserInput: (request: CliBackendUserInputRequest) => Promise<CliBackendUserInputResult>;
};
/** Plugin-owned runtime yielding the backend's existing structured stream records. */
type CliBackendExecute = (context: CliBackendExecuteContext) => AsyncIterable<Record<string, unknown>>;
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
type CliBackendResolveModelIdContext = {
  modelId: string;
  contextWindow?: string;
};
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
  /** Inclusive floor for stable package releases. */
  stableMinimum: string;
  /** Inclusive floors keyed by the first SemVer prerelease identifier. */
  prereleaseMinimums?: Readonly<Record<string, string>>;
}>;
type CliBackendNormalizeConfigContext = {
  config?: OpenClawConfig;
  backendId: string;
  agentId?: string;
};
/** Backend-owned implementation boundary for script-backed CLI executables. */
type CliBackendRuntimeArtifactPolicy = Readonly<{
  kind: "bundled-package-tree";
  /** Exact package.json name whose complete installed tree owns inference. */
  packageName: string;
  /** Only the command itself may be the package entrypoint. */
  entrypoint: "command";
  /** Supported package release lines when a run requests exact tool availability. */
  exactToolAvailabilityVersionPolicy?: CliBackendExactToolAvailabilityVersionPolicy;
  /** Canonical basenames allowed when this backend ships a self-contained native build. */
  nativeExecutableNames?: readonly string[];
}>;
/** Complete backend-owned contract for in-place native session compaction. */
type CliBackendManualCompaction = Readonly<{
  /** Builds the exact backend command for the resumed native session. */
  buildPrompt: (customInstructions?: string) => string;
  /** Prompt transport required by the backend control command. */
  input: "arg" | "stdin";
  /** Positively confirms that a successful process exit performed compaction. */
  validateOutput: (rawOutput: string) => {
    ok: true;
  } | {
    ok: false;
    reason: string;
  };
}>;
/** Plugin-owned CLI backend defaults used by the text-only CLI runner. */
type CliBackendPluginBase = {
  /** Provider id used in model refs, for example `claude-cli/opus`. */
  id: string;
  /** Canonical model provider whose models this CLI backend can execute. */
  modelProvider?: string;
  /** Static command adapter owned by this plugin. */
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
  };
  /** Required whenever this backend can become a verified inference owner. */
  runtimeArtifact?: CliBackendRuntimeArtifactPolicy;
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
  resolveExecutionArgs?: CliBackendResolveExecutionArgs;
  /** Backend-owned native model id selected from validated session metadata. */
  resolveModelId?: (ctx: CliBackendResolveModelIdContext) => string;
  /** How this backend enforces an exact per-run `toolAvailability` contract. */
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
  /** Backend-owned compaction for a persisted resumable CLI transcript. */
  ownsNativeCompaction: true;
  /** Optional control operation for explicit manual compaction. */
  manualCompaction?: CliBackendManualCompaction;
} | {
  /** Boolean-compatible ownership for existing plugins without manual compaction. */
  ownsNativeCompaction?: boolean;
  manualCompaction?: never;
};
/** Plugin-owned CLI backend defaults used by the text-only CLI runner. */
type CliBackendPlugin = CliBackendPluginBase & CliBackendNativeCompactionContract;
//#endregion
//#region src/plugins/enable.d.ts
type PluginEnableOptions = {
  updateChannelConfig?: boolean;
};
/** Result of enabling a plugin in config. */
type PluginEnableResult = {
  config: OpenClawConfig;
  enabled: boolean;
  pluginId: string;
  reason?: string;
};
/** Enables a plugin in config unless global, denylist, or allowlist policy blocks it. */
declare function enablePluginInConfig(cfg: OpenClawConfig, pluginId: string, options?: PluginEnableOptions): PluginEnableResult;
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
  sensitive?: boolean;
  /** Onboarding may defer non-rollbackable effects only for retry-safe providers. */
  applyPhase?: MigrationApplyPhase;
  /** Retry-safe deferred apply may report a non-mutating already-satisfied terminal result. */
  deferredCompletion?: true;
  /** Core-owned source revision bound by reviewed embedded migration flows. */
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
  runtime?: PluginRuntime;
  /** Host-owned config mutation target for isolated embedded migration flows. */
  configRuntime?: MigrationConfigRuntime;
  logger: PluginLogger;
  stateDir: string;
  /** Explicit destination agent for embedded migration surfaces such as Control UI. */
  targetAgentId?: string;
  /** Optional item-kind scope used by embedded migration surfaces to avoid unrelated discovery. */
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
  description?: string;
  /** Item kinds this provider can expose without requiring a full plan. */
  supportedItemKinds?: readonly string[];
  /** Required when this provider plans items for `after-promotion`. */
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
  /** Stable host session key when available. */
  sessionKey?: string;
  /** Ephemeral OpenClaw session id when available. */
  sessionId?: string;
  /** Canonical SQLite identity for active transcript access. */
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
  sessionFile?: string;
  /** Embedded agent harness selected for this session. */
  agentHarnessId?: string;
  /** Channel/provider for this session when available. */
  channel?: string;
  /** Provider channel id when available. */
  channelId?: ChannelId;
  /** Account id for multi-account channels when available. */
  accountId?: string;
  /** Thread/topic id when available. */
  messageThreadId?: string | number;
  /** Parent conversation id for thread-capable channels when available. */
  threadParentId?: string;
};
/**
 * Context passed to plugin command handlers.
 */
type PluginCommandContext = {
  /** The sender's identifier (for example a channel-scoped user ID) */
  senderId?: string;
  /** The channel/surface (for example "chat" or "team-chat") */
  channel: string;
  /** Provider channel id */
  channelId?: ChannelId;
  /** Whether the sender is on the allowlist */
  isAuthorizedSender: boolean;
  /** Whether the sender is an owner for owner-only command surfaces. */
  senderIsOwner?: boolean;
  /** Gateway client scopes for internal control-plane callers */
  gatewayClientScopes?: string[];
  /** Host-resolved agent that owns the active session. */
  agentId?: string;
  /** Stable host session key for the active conversation when available. */
  sessionKey?: string;
  /** Ephemeral host session id for the active conversation when available. */
  sessionId?: string;
  /** Canonical SQLite identity for active transcript access. */
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
  sessionFile?: string;
  /** Raw command arguments after the command name */
  args?: string;
  /** The full normalized command body */
  commandBody: string;
  /** Current OpenClaw configuration */
  config: OpenClawConfig;
  /** Raw "From" value (channel-scoped id) */
  from?: string;
  /** Raw "To" value (channel-scoped id) */
  to?: string;
  /** Account id for multi-account channels */
  accountId?: string;
  /** Thread/topic id if available */
  messageThreadId?: string | number;
  /** Parent conversation id for thread-capable channels */
  threadParentId?: string;
  /** Sensitive diagnostics-only session inventory for owner-gated commands. */
  diagnosticsSessions?: PluginCommandDiagnosticsSession[];
  /** Host-bound runtime capabilities scoped to this command invocation. */
  runtimeContext?: {
    llm?: Pick<PluginRuntimeCore["llm"], "complete">;
    compactCurrent?: () => Promise<{
      compacted: boolean;
      reason?: string;
      tokensBefore?: number;
      tokensAfter?: number;
    }>;
  };
  /** Internal diagnostics-only marker that exec approval already authorized upload. */
  diagnosticsUploadApproved?: boolean;
  /** Internal diagnostics-only marker to preview upload effects without exposing ids. */
  diagnosticsPreviewOnly?: boolean;
  /** Internal diagnostics-only marker for owner-private routed confirmations. */
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
  /** Allows the agent session to continue processing after the command. */
  continueAgent?: boolean;
  /** Suppresses channel fallback replies when the handler already delivered a response. */
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
  /** Command name without leading slash (e.g., "tts") */
  name: string;
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
  };
  /** Description shown in /help and command menus */
  description: string;
  /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  /**
   * Optional channel ids this command belongs to.
   * Omit to keep the command available on every channel surface.
   */
  channels?: readonly string[];
  /** Optional system-prompt guidance for agents when this command is registered. */
  agentPromptGuidance?: readonly AgentPromptGuidance[];
  /** Whether this command accepts arguments */
  acceptsArgs?: boolean;
  /** Optional bounded presentation for clients that explicitly support it. */
  clientPresentation?: {
    /** Parsed invocation shape eligible for client handling. */
    when: "no-arguments";
    action: {
      kind: "device-pairing";
    };
  };
  /** Whether only authorized senders can use this command (default: true) */
  requireAuth?: boolean;
  /** Operator scopes required by gateway clients; command owners may satisfy this on chat surfaces. */
  requiredScopes?: OperatorScope[];
  /** Whether a trusted bundled handler needs owner status for subcommand-level authorization. */
  exposeSenderIsOwner?: boolean;
  /**
   * Allows a bundled plugin to claim a command name that is otherwise reserved
   * by core. External plugins cannot use this field.
   */
  ownership?: "plugin" | "reserved";
  /** The handler function */
  handler: PluginCommandHandler;
};
//#endregion
//#region src/plugins/plugin-api.types.d.ts
type ChannelPlugin = ChannelPlugin$3;
type PluginTextTransformRegistration = PluginTextTransforms;
type OpenClawPluginSessionStateApi = {
  /** Register plugin-owned session state projected into Gateway session rows. */
  registerSessionExtension: (extension: PluginSessionExtensionRegistration) => void;
};
type OpenClawPluginSessionWorkflowApi = {
  /** Queue one plugin-owned context injection for the next agent turn in a session. */
  enqueueNextTurnInjection: (injection: PluginNextTurnInjection) => Promise<PluginNextTurnInjectionEnqueueResult>;
  /**
   * Register cleanup metadata for a plugin-owned session scheduler job.
   * This does not schedule work or create task records; it only lets the host
   * clean external scheduler state during reset/delete/disable.
   */
  registerSessionSchedulerJob: (job: PluginSessionSchedulerJobRegistration) => PluginSessionSchedulerJobHandle | undefined;
  /** Send host-validated files to the active direct-outbound route for a session. */
  sendSessionAttachment: (params: PluginSessionAttachmentParams) => Promise<PluginSessionAttachmentResult>;
  /**
   * Schedule a future agent turn in a session through Cron.
   * Cron owns timing and creates the task ledger entry when the turn runs.
   */
  scheduleSessionTurn: (params: PluginSessionTurnScheduleParams) => Promise<PluginSessionSchedulerJobHandle | undefined>;
  /** Remove Cron-backed scheduled session turns that share a plugin-owned tag. */
  unscheduleSessionTurnsByTag: (params: PluginSessionTurnUnscheduleByTagParams) => Promise<PluginSessionTurnUnscheduleByTagResult>;
};
type OpenClawPluginSessionControlsApi = {
  /** Register a typed session action that clients can dispatch through the Gateway. */
  registerSessionAction: (action: PluginSessionActionRegistration) => void;
  /** Register a generic Control UI contribution descriptor. */
  registerControlUiDescriptor: (descriptor: PluginControlUiDescriptor) => void;
};
type OpenClawPluginSessionApi = {
  state: OpenClawPluginSessionStateApi;
  workflow: OpenClawPluginSessionWorkflowApi;
  controls: OpenClawPluginSessionControlsApi;
};
type OpenClawPluginAgentEventsApi = {
  /** Subscribe to sanitized agent events through the host-owned plugin lifecycle. */
  registerAgentEventSubscription: (subscription: PluginAgentEventSubscriptionRegistration) => void;
  /** Emit a host-routed, plugin-attributed event for workflow/UI subscribers. */
  emitAgentEvent: (params: PluginAgentEventEmitParams) => PluginAgentEventEmitResult;
};
type OpenClawPluginAgentApi = {
  events: OpenClawPluginAgentEventsApi;
};
type OpenClawPluginRunContextApi = {
  /** Store namespaced, JSON-compatible data for the active run. Cleared on run end/error. */
  setRunContext: (patch: PluginRunContextPatch) => boolean;
  /** Read namespaced plugin data for a run. */
  getRunContext: (params: PluginRunContextGetParams) => PluginJsonValue | undefined;
  /** Clear one namespace or all namespaces this plugin owns for a run. */
  clearRunContext: (params: {
    runId: string;
    namespace?: string;
  }) => void;
};
type OpenClawPluginLifecycleApi = {
  /** Register cleanup hooks for plugin-owned host state and background work. */
  registerRuntimeLifecycle: (lifecycle: PluginRuntimeLifecycleRegistration) => void;
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
  session: OpenClawPluginSessionApi;
  /** Grouped facade for agent-event workflow seams. */
  agent: OpenClawPluginAgentApi;
  /** Grouped facade for run-scoped plugin scratch state. */
  runContext: OpenClawPluginRunContextApi;
  /** Grouped facade for plugin-owned lifecycle cleanup hooks. */
  lifecycle: OpenClawPluginLifecycleApi;
  registerTool: (tool: AnyAgentTool | OpenClawPluginToolFactory, opts?: OpenClawPluginToolOptions) => void;
  registerHook: (events: string | string[], handler: InternalHookHandler, opts?: OpenClawPluginHookOptions) => void;
  registerHttpRoute: (params: OpenClawPluginHttpRouteParams) => void;
  /** Register a plugin-owned resolver for browser-style hosted media URLs. */
  registerHostedMediaResolver: (resolver: OpenClawPluginHostedMediaResolver$1) => void;
  /** Register a plugin-owned destination for presenting hosted widget documents. */
  registerWidgetPresenter: (presenter: WidgetPresenter) => void;
  /** Bind a declared MCP server's transport to the trusted message requester. */ registerMcpServerConnectionResolver: (resolver: OpenClawPluginMcpServerConnectionResolver) => void;
  /** Register a native messaging channel plugin (channel capability). */
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
    profileAccess?: "independent" | "required";
  }) => void;
  /** Register a sandboxed board widget source kind owned by this plugin. */
  registerBoardWidgetContentKind: (definition: PluginBoardWidgetContentKind) => void;
  /** Register a read-only external-session catalog with optional native adoption actions. */
  registerSessionCatalog: (provider: SessionCatalogProvider) => void;
  registerCli: (registrar: OpenClawPluginCliRegistrar$1, opts?: OpenClawPluginCliRegistrationOptions) => void;
  /**
   * Register a plugin-owned node feature command group under `openclaw nodes`.
   *
   * This is equivalent to `registerCli(registrar, { parentPath: ["nodes"], ... })`
   * and is intended for paired-node capabilities such as camera, screen, or Canvas.
   */
  registerNodeCliFeature: (registrar: OpenClawPluginCliRegistrar$1, opts?: OpenClawPluginNodeCliFeatureOptions) => void;
  registerReload: (registration: OpenClawPluginReloadRegistration$1) => void;
  registerNodeHostCommand: (command: OpenClawPluginNodeHostCommand) => void;
  registerNodeInvokePolicy: (policy: OpenClawPluginNodeInvokePolicy) => void;
  registerSecurityAuditCollector: (collector: OpenClawPluginSecurityAuditCollector$1) => void;
  registerService: (service: OpenClawPluginService$1) => void;
  /** Register a local gateway discovery advertiser such as mDNS/Bonjour. */
  registerGatewayDiscoveryService: (service: OpenClawGatewayDiscoveryService$1) => void;
  /** Register a text-only CLI backend used by the local CLI runner. */
  registerCliBackend: (backend: CliBackendPlugin) => void;
  /** Register plugin-owned prompt/message compatibility text transforms. */
  registerTextTransforms: (transforms: PluginTextTransformRegistration) => void;
  /** Register a lightweight config migration that can run before plugin runtime loads. */
  registerConfigMigration: (migrate: PluginConfigMigration) => void;
  /** Register an importer for `openclaw migrate` (migration capability). */
  registerMigrationProvider: (provider: MigrationProviderPlugin) => void;
  /** Register a lightweight config probe that can auto-enable this plugin generically. */
  registerAutoEnableProbe: (probe: PluginSetupAutoEnableProbe) => void;
  /** Register a native model/provider plugin (text inference capability). */
  registerProvider: (provider: ProviderPlugin) => void;
  /** Register a cloud-worker lifecycle provider. */
  registerWorkerProvider: (provider: WorkerProvider$1) => void;
  /** Register provider-owned model catalog rows for text and media generation. */
  registerModelCatalogProvider: (provider: UnifiedModelCatalogProviderPlugin) => void;
  /** Register a general embedding provider (embedding capability). */
  registerEmbeddingProvider: (adapter: EmbeddingProviderAdapter) => void;
  /** Register a speech synthesis provider (speech capability). */
  registerSpeechProvider: (provider: SpeechProviderPlugin$1) => void;
  /** Register a realtime transcription provider (streaming STT capability). */
  registerRealtimeTranscriptionProvider: (provider: RealtimeTranscriptionProviderPlugin$1) => void;
  /** Register a realtime voice provider (duplex voice capability). */
  registerRealtimeVoiceProvider: (provider: RealtimeVoiceProviderPlugin$1) => void;
  /** Register a media understanding provider (media understanding capability). */
  registerMediaUnderstandingProvider: (provider: MediaUnderstandingProviderPlugin$1) => void;
  /** Register a transcripts source provider (live or imported meeting transcript capability). */
  registerTranscriptSourceProvider: (provider: TranscriptSourceProvider$1) => void;
  /** Register an image generation provider (image generation capability). */
  registerImageGenerationProvider: (provider: ImageGenerationProviderPlugin$1) => void;
  /** Register a video generation provider (video generation capability). */
  registerVideoGenerationProvider: (provider: VideoGenerationProviderPlugin$1) => void;
  /** Register a music generation provider (music generation capability). */
  registerMusicGenerationProvider: (provider: MusicGenerationProviderPlugin$1) => void;
  /** Register a web fetch provider (web fetch capability). */
  registerWebFetchProvider: (provider: WebFetchProviderPlugin) => void;
  /** Register a web search provider (web search capability). */
  registerWebSearchProvider: (provider: WebSearchProviderPlugin) => void;
  registerInteractiveHandler: (registration: PluginInteractiveHandlerRegistration$1) => void;
  onConversationBindingResolved: (handler: (event: PluginConversationBindingResolvedEvent$1) => void | Promise<void>) => void;
  /**
   * Register a custom command that bypasses the LLM agent.
   * Plugin commands are processed before built-in commands and before agent invocation.
   * Use this for simple state-toggling or status commands that don't need AI reasoning.
   */
  registerCommand: (command: OpenClawPluginCommandDefinition) => void;
  /** Register a context engine implementation (exclusive slot - only one active at a time). */
  registerContextEngine: (id: string, factory: ContextEngineFactory) => void;
  /** Register a compaction provider (pluggable summarization backend). */
  registerCompactionProvider: (provider: CompactionProvider) => void;
  /** Register an agent harness implementation. */
  registerAgentHarness: (harness: AgentHarness, options?: AgentHarnessRegistrationOptions) => void;
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
  unscheduleSessionTurnsByTag: (params: PluginSessionTurnUnscheduleByTagParams) => Promise<PluginSessionTurnUnscheduleByTagResult>;
  /** Register the active detached task runtime for this plugin (exclusive slot). */
  registerDetachedTaskRuntime: (runtime: DetachedTaskLifecycleRuntime) => void;
  /** Register the active memory capability for this memory plugin (exclusive slot). */
  registerMemoryCapability: (capability: MemoryPluginCapability) => void;
  /** Register an additive memory-adjacent prompt section (non-exclusive). */
  registerMemoryPromptSupplement: (builder: MemoryPromptSectionBuilder) => void;
  /** Register an async memory prompt preparation step (non-exclusive). */
  registerMemoryPromptPreparation: (prepare: (params: MemoryPromptSectionParams) => Promise<readonly string[]>) => void;
  /** Register an additive memory-adjacent search/read corpus supplement (non-exclusive). */
  registerMemoryCorpusSupplement: (supplement: MemoryCorpusSupplement) => void;
  resolvePath: (input: string) => string;
  /** Register a lifecycle hook handler */
  on: <K extends PluginHookName>(hookName: K, handler: PluginHookHandlerMap[K], opts?: PluginHookRegistrationOptions<K>) => void;
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
  kind: "timeout";
  /** Non-terminal observations preserve timeout detail without interrupting the attempt. */
  phase: AgentRunAttemptTimeoutObservation;
  source: "observation";
  failure?: AgentRunAttemptFailure;
} | {
  kind: "timeout";
  phase: "prompt" | AgentRunAttemptTimeoutObservation;
  source: AgentRunAttemptTimeoutSource;
  /** Present only when timeout handling also aborted the live harness run. */
  aborted?: true;
  failure?: AgentRunAttemptFailure;
} | {
  kind: "failed";
  source: AgentRunAttemptFailureSource;
  error: unknown;
  timeoutObservation?: AgentRunAttemptTimeoutObservation;
};
//#endregion
//#region src/agents/agent-tools.before-tool-call.types.d.ts
type ToolOutcomeObservation = {
  toolName: string;
  argsHash: string;
  resultHash: string;
  resultContentSource?: AgentTool["resultContentSource"];
  /** Monotonic model-call order within the owning embedded run. */
  toolCallOrdinal?: number;
  terminalPresentation?: string;
  presentationOnly?: boolean;
};
type ToolOutcomeObserver = (observation: ToolOutcomeObservation) => void;
type HookContext = {
  agentId?: string;
  config?: OpenClawConfig;
  /** Tool execution cwd for host-derived path facts. */
  cwd?: string;
  /** Host workspace used to resolve relative tool params for diagnostics only. */
  workspaceDir?: string;
  sessionKey?: string;
  /** Ephemeral session UUID — regenerated on /new and /reset. */
  sessionId?: string;
  runId?: string;
  /** What initiated this run, used to reject approvals on unattended surfaces. */
  trigger?: string;
  /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string;
  trace?: DiagnosticTraceContext;
  channelId?: string;
  /** Host-derived message requester for sender-aware tool hooks. */
  requester?: PluginHookToolRequesterContext;
  /** Originating channel for approval delivery routing; mirrors exec approval turn-source fields. */
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
  genericDecision?: true;
}) | (HookBlockedOutcome & {
  kind: "failure";
  disposition: BeforeToolCallFailureDisposition;
}) | {
  blocked: false;
  params: unknown;
  ownerDecision?: true;
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
type BeforeToolCallDiagnosticOptions = {
  emitDiagnostics: boolean;
  protectNetworkErrors?: boolean;
  approvalMode?: "request" | "report" | "deny";
};
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
declare function wrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext, options?: Partial<BeforeToolCallDiagnosticOptions>): AnyAgentTool;
/** Rebuild a before_tool_call wrapper while preserving the original source tool. */
declare function rewrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext, options?: Partial<BeforeToolCallDiagnosticOptions>): AnyAgentTool;
declare namespace agent_tools_before_tool_call_d_exports {
  export { BeforeToolCallFailureDisposition, BeforeToolCallPolicyDiagnosticState, DeferredPluginToolApproval, HookContext, ToolOutcomeObservation, ToolOutcomeObserver, buildBlockedToolResult, cancelDeferredPluginToolApproval, consumeAdjustedParamsForToolCall, consumePreExecutionBlockedToolCall, finalizeToolTerminalPresentation, getBeforeToolCallFailureDisposition, getBeforeToolCallPolicyDiagnosticState, hasBeforeToolCallPolicy, isBeforeToolCallBlockedError, isPreExecutionBlockedToolResult, isToolWrappedWithBeforeToolCallHook, peekAdjustedParamsForToolCall, recordAdjustedParamsForToolCall, recordStructuredReplayTrustForToolCall, requestDeferredPluginToolApproval, rewrapToolWithBeforeToolCallHook, runBeforeToolCallHook, setBeforeToolCallDiagnosticsEnabled, wrapToolWithBeforeToolCallHook };
}
//#endregion
//#region src/agents/harness/native-hook-relay-types.d.ts
type NativeHookRelayApprovalContext = Pick<HookContext, "approvalReviewerDeviceId" | "trigger" | "turnSourceAccountId" | "turnSourceChannel" | "turnSourceThreadId" | "turnSourceTo">;
declare const NATIVE_HOOK_RELAY_EVENTS: readonly ["pre_tool_use", "post_tool_use", "permission_request", "before_agent_finalize"];
declare const NATIVE_HOOK_RELAY_PROVIDERS: readonly ["codex"];
type NativeHookRelayEvent = (typeof NATIVE_HOOK_RELAY_EVENTS)[number];
type NativeHookRelayProvider = (typeof NATIVE_HOOK_RELAY_PROVIDERS)[number];
type NativeHookRelayRegistration = {
  relayId: string;
  provider: NativeHookRelayProvider;
  generationMismatchGraceExpiresAtMs?: number;
  generationMismatchGraceAcceptedGeneration?: string;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  requester?: PluginHookToolRequesterContext;
  approvalContext?: NativeHookRelayApprovalContext;
  allowedEvents: readonly NativeHookRelayEvent[];
  expiresAtMs: number;
  signal?: AbortSignal;
  /** Exact host policy capability for authority-bearing native callbacks. */
  runBeforeToolCall?: AgentHarnessHostCapabilities["runBeforeToolCall"];
  /** Revalidates the exact admitted owner after authority-bearing awaits. */
  assertActive?: AgentHarnessHostCapabilities["assertActive"];
  onPreToolUseFailure?: (failure: {
    toolName: string;
    toolCallId: string;
    disposition: Exclude<BeforeToolCallFailureDisposition, "blocked">;
    durationMs: number;
  }) => void | Promise<void>;
};
type NativeHookRelayRegistrationHandle = NativeHookRelayRegistration & {
  generation?: string;
  shouldRelayEvent: (event: NativeHookRelayEvent) => boolean;
  toolMatcherForEvent: (event: NativeHookRelayEvent) => readonly string[] | undefined;
  commandForEvent: (event: NativeHookRelayEvent, options?: NativeHookRelayCommandForEventOptions) => string;
  renew: (ttlMs?: number) => void;
  unregister: () => void;
};
type RegisterNativeHookRelayParams = {
  provider: NativeHookRelayProvider;
  relayId?: string;
  generation?: string;
  generationMismatchGraceMs?: number;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  requester?: PluginHookToolRequesterContext;
  approvalContext?: NativeHookRelayApprovalContext;
  allowedEvents?: readonly NativeHookRelayEvent[];
  /** Whether this relay should run OpenClaw loop detection from native PreToolUse hooks. */
  preToolUseLoopDetection?: boolean;
  ttlMs?: number;
  command?: NativeHookRelayCommandOptions;
  signal?: AbortSignal;
  runBeforeToolCall?: NativeHookRelayRegistration["runBeforeToolCall"];
  assertActive?: NativeHookRelayRegistration["assertActive"];
  onPreToolUseFailure?: NativeHookRelayRegistration["onPreToolUseFailure"];
};
type NativeHookRelayCommandOptions = {
  executable?: string;
  nice?: number | false;
  nodeExecutable?: string;
  timeoutMs?: number;
};
type NativeHookRelayCommandForEventOptions = {
  timeoutMs?: number;
};
type ActiveNativeHookRelayRegistrationHandle = NativeHookRelayRegistrationHandle & {
  generation: string;
};
//#endregion
//#region src/agents/harness/native-hook-relay.d.ts
/** Private bundled-runtime callbacks for retained direct-child hook policy. */
type NativeHookRelayRetention = Readonly<{
  readClaim: (rawPayload: unknown) => string | undefined;
  shouldRetainAfterForegroundClose: () => boolean;
  allowPreToolUse: (claim: string) => boolean;
  awaitForegroundAdmission?: (claim: string) => Promise<(() => boolean) | undefined>;
  onDispose: () => void;
}>;
//#endregion
//#region src/agents/core-tool-factory-descriptors.d.ts
type OpenClawCodingToolConstructionPlan = {
  includeBaseCodingTools: boolean;
  includeShellTools: boolean;
  includeChannelTools: boolean;
  includeOpenClawTools: boolean;
  includePluginTools: boolean;
};
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
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.types.d.ts
/**
 * Route chosen before a model call when context pressure may require compaction or truncation.
 */
type PreemptiveCompactionRoute = "fits" | "compact_only" | "truncate_tool_results_only" | "compact_then_truncate";
//#endregion
//#region src/plugins/registry.d.ts
type PluginHttpRouteRegistration = PluginHttpRouteRegistration$1 & {
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface$1;
};
//#endregion
//#region src/agents/tools/system-agent-tool.d.ts
type SystemAgentToolOptions = {
  /** Where setup side effects run; the gateway surface never manages its own daemon. */
  surface: "cli" | "gateway";
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
//#region src/agents/agent-tools.read.d.ts
type SkillInstructionDeliveryCache = Map<string, Promise<boolean>>;
//#endregion
//#region src/agents/delegation-capability.d.ts
type DelegationCapability = "full" | "report_only";
//#endregion
//#region src/agents/tool-search-types.d.ts
type CatalogSource = "openclaw" | "mcp" | "client";
type CatalogTool = AnyAgentTool | ToolDefinition;
type ToolSearchCatalogToolExecutor = (params: {
  tool: CatalogTool;
  toolName: string;
  source: CatalogSource;
  sourceName?: string;
  toolCallId: string;
  parentToolCallId?: string;
  input: unknown;
  signal?: AbortSignal;
  onUpdate?: AgentToolUpdateCallback;
  acceptResultBeforeProjection: (result: AgentToolResult<unknown>) => Promise<AgentToolResult<unknown>>;
}) => Promise<AgentToolResult<unknown>>;
/** Catalog entry retained behind compacted Tool Search control tools. */
type ToolSearchCatalogEntry = {
  id: string;
  source: CatalogSource;
  sourceName?: string;
  mcp?: PluginToolMcpMeta;
  name: string;
  label?: string;
  description: string;
  parameters?: unknown;
  outputSchema?: TSchema;
  tool: CatalogTool;
};
type ToolSearchCatalogSession = {
  entries: ToolSearchCatalogEntry[];
  counterScope: string;
  searchCount: number;
  describeCount: number;
  callCount: number;
};
type ToolSearchCatalogRef = {
  current?: ToolSearchCatalogSession;
  onChange?: () => void;
  onDispose?: () => void;
};
//#endregion
//#region src/agents/tool-loop-detection-config.d.ts
/** Resolves effective tool loop-detection config by overlaying agent settings on globals. */
declare function resolveToolLoopDetectionConfig(params: {
  cfg?: OpenClawConfig;
  agentId?: string;
}): ToolLoopDetectionConfig | undefined;
declare namespace agent_tools_d_exports {
  export { createOpenClawCodingTools, resolveToolLoopDetectionConfig };
}
/** Public options for building one plugin-owned agent tool surface. */
type OpenClawCodingToolsOptions = {
  agentId?: string;
  exec?: ExecToolDefaults & ProcessToolDefaults;
  messageProvider?: string;
  /** Canonical transport channel when tool-policy provider differs from delivery channel. */
  messageChannel?: string;
  /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[];
  /** Out-of-band plugin bindings attached by the run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>;
  /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
  conversationRecall?: ConversationRecallContext;
  /** Normalized conversation kind when the caller already has channel metadata. */
  chatType?: ChatType;
  /** Specific ingress provider used only for transport tool availability. */
  toolPolicyMessageProvider?: string;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?: string | number;
  /** Trusted platform-native conversation id for the active inbound turn. */
  nativeChannelId?: string;
  /** Opaque host-issued capability for current-turn channel message actions. */
  messageActionTurnCapability?: string;
  sandbox?: SandboxContext | null;
  sessionKey?: string;
  /**
   * The durable store session key for the live run when it differs from the
   * sandbox/policy session key used to construct the tool set.
   */
  runSessionKey?: string;
  /** Ephemeral session UUID — regenerated on /new and /reset. */
  sessionId?: string;
  /**
   * Explicit one-shot local CLI runs should not keep plugin-owned process
   * resources alive after emitting their result.
   */
  oneShotCliRun?: boolean;
  /** Stable run identifier for this agent invocation. */
  runId?: string;
  /** Exact admitted run instance for lifecycle-bound subprocess capabilities. */
  operationalRunInstance?: OperationalRunInstanceRef;
  /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string;
  /** Diagnostic trace context for hook/log correlation during this run. */
  trace?: DiagnosticTraceContext;
  /** What initiated this run (for trigger-specific tool restrictions). */
  trigger?: string;
  /** Stable cron job identifier populated for cron-triggered runs. */
  jobId?: string;
  /** Relative workspace path that memory-triggered writes may append to. */
  memoryFlushWritePath?: string;
  agentDir?: string;
  preparedModelRuntime?: PreparedModelRuntimeSnapshot;
  /** Task working directory for coding tools. Defaults to workspaceDir. */
  cwd?: string;
  workspaceDir?: string;
  sessionPermissionPolicy?: PreparedSessionPermissionPolicy;
  /**
   * Workspace directory that spawned subagents should inherit.
   * When sandboxing uses a copied workspace (`ro` or `none`), workspaceDir is the
   * sandbox copy but subagents should inherit the real agent workspace instead.
   * Defaults to workspaceDir when not set.
   */
  spawnWorkspaceDir?: string;
  config?: OpenClawConfig;
  /** Explicitly distinguishes live Gateway session policy from a pinned run override. */
  sessionConfigSource?: "runtime" | "pinned";
  abortSignal?: AbortSignal;
  /** Disable hook-owned diagnostics when an outer runtime owns tool diagnostics. */
  emitBeforeToolCallDiagnostics?: boolean;
  /** Skip hook wrapping when an outer tool-call boundary owns hook execution. */
  wrapBeforeToolCallHook?: boolean;
  /**
   * Provider of the currently selected model (used for provider-specific tool quirks).
   * Example: "anthropic", "openai", "google", "openai".
   */
  modelProvider?: string;
  /** Model id for the current provider (used for model-specific tool gating). */
  modelId?: string;
  /** Internal review-run restrictions and proposal provenance. */
  skillWorkshop?: SkillWorkshopRunOptions;
  /** Attempt-local authority to start or redirect delegated work. */
  delegationCapability?: DelegationCapability;
  /** Model API for the current provider (used for provider-native tool arbitration). */
  modelApi?: string;
  /** Model context window in tokens (used to scale read-tool output budget). */
  modelContextWindowTokens?: number;
  /** Resolved runtime model compatibility hints. */
  modelCompat?: ModelCompatConfig;
  /** If false, keep OpenClaw web_search even when a provider-native search tool is active. */
  suppressManagedWebSearch?: boolean;
  webFetchHostnameAllowlistRef?: {
    value?: string[];
  };
  webSearchEnabled?: boolean;
  /**
   * Auth mode for the current provider. We only need this for Anthropic OAuth
   * tool-name blocking quirks.
   */
  modelAuthMode?: ModelAuthMode;
  /** Current channel ID for auto-threading (Slack). */
  currentChannelId?: string;
  /** Routable target for the current conversation when it differs from the native channel ID. */
  currentMessagingTarget?: string;
  /** Normalized conversation id exposed to tool hooks. Defaults to currentChannelId. */
  hookChannelId?: string;
  /** Channel-owned sender/chat metadata exposed to subprocess environments. */
  channelContext?: PluginHookChannelContext;
  /** Current thread timestamp for auto-threading (Slack). */
  currentThreadTs?: string;
  /** Current inbound message id for action fallbacks (e.g. Telegram react). */
  currentMessageId?: string | number;
  /** True when the current inbound turn carried audio media. */
  currentInboundAudio?: boolean;
  /** Dynamic audio state for runs that can accept steered input after tool creation. */
  hasCurrentInboundAudio?: () => boolean;
  /** Group id for channel-level tool policy resolution. */
  groupId?: string | null;
  /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null;
  /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null;
  /** Trusted provider role ids for the requester in this group turn. */
  memberRoleIds?: string[];
  /** Parent session key for subagent group policy inheritance. */
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  /** Reply-to mode for Slack auto-threading. */
  replyToMode?: "off" | "first" | "all" | "batched";
  /** Mutable ref to track if a reply was sent (for "first" mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Allow plugin tools for this run to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean;
  /** Runtime-scoped explicit allowlist used to materialize matching plugin tools. */
  runtimeToolAllowlist?: string[];
  /** Host-prepared proof that this exact session can request Gateway publication. */
  githubPublicationAvailable?: boolean;
  /** True when runtimeToolAllowlist is real parent authority that child sessions inherit. */
  inheritRuntimeToolAllowlist?: boolean;
  /** Mutable spawn capability snapshot refreshed after late-bound runtime tools are authorized. */
  inheritedToolAllowlistRef?: string[];
  /** Mutable cron creator cap ref for callers that append final runtime tools later. */
  cronCreatorToolAllowlistRef?: CronCreatorToolAllowlistEntry[];
  /** Mutable proof that the cron cap reached the final executable surface. */
  cronCreatorToolAllowlistCaptureRef?: CronToolsAllowCaptureRef;
  /** Visible fail-closed reason for queued Codex configured-MCP cron mutations. */
  cronCreatorAuthorityUnavailableReason?: CronToolOptions["creatorAuthorityUnavailableReason"];
  /** If true, the model has native vision capability */
  modelHasVision?: boolean;
  /** Mutable model-context generation used to expire screenshot coordinate frames. */
  computerContextEpoch?: {
    value: number;
  };
  /** Attempt-local full skill reads that remain visible in the model context. */
  skillInstructionDeliveryCache?: SkillInstructionDeliveryCache;
  /** Registers run-owned cleanup for tools that hold node resources. */
  registerRunCleanup?: (cleanup: (reason: string) => Promise<void>) => void;
  /** Require explicit message targets (no implicit last-route sends). */
  requireExplicitMessageTarget?: boolean;
  /** Visible source replies must be sent through the message tool when set to message_tool_only. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Action sink available for model-proposed follow-up tasks. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  inboundEventKind?: InboundEventKind;
  /** If true, omit the message tool from the tool list. */
  disableMessageTool?: boolean;
  /** Collector runs never open operator approval flows. */
  swarmCollector?: boolean;
  /** Synthetic structured_output schema for collector runs. */
  swarmOutputSchema?: Record<string, unknown>;
  /** Keep the message tool available even when the selected profile omits it. */
  forceMessageTool?: boolean;
  /** Include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** Keep the heartbeat response tool available even when the selected profile omits it. */
  forceHeartbeatTool?: boolean;
  /** If false, build plugin tools only while preserving the shared policy pipeline. */
  includeCoreTools?: boolean;
  /** Include Tool Search control tools when enabled for this run. */
  includeToolSearchControls?: boolean;
  /** Executes cataloged tools through the active agent run lifecycle. */
  toolSearchCatalogExecutor?: ToolSearchCatalogToolExecutor;
  /** Runtime-local Tool Search catalog ref shared with attempt compaction. */
  toolSearchCatalogRef?: ToolSearchCatalogRef;
  /** Limits which tool families are materialized before the shared policy pipeline runs. */
  toolConstructionPlan?: OpenClawCodingToolConstructionPlan;
  /** Ring-zero OpenClaw tool; set only by the OpenClaw agent runner. */
  systemAgentTool?: SystemAgentToolOptions;
  /** Trusted sender identity bit for command/channel-action auth and owner-gated plugin tools. */
  senderIsOwner?: boolean;
  /** Auth profiles already loaded for this run; used for prompt-time tool availability. */
  authProfileStore?: AuthProfileStore;
  /** Callback invoked when sessions_yield tool is called. */
  onYield?: (message: string, acknowledgment?: string) => Promise<void> | void;
  /** Side-effect-free runtime completion claimant composed with the durable subagent claim. */
  claimYieldCompletion?: () => boolean | Promise<boolean>;
  /** Optional instrumentation callback for tool preparation stage timing. */
  recordToolPrepStage?: (name: string) => void;
  /** Live observer called after wrapped tool outcomes are recorded. */
  onToolOutcome?: ToolOutcomeObserver;
  /** Reads the sticky untrusted-content flag for the current user turn. */
  isTurnTainted?: () => boolean;
  /** Supplies run-global model-call ordering for parallel tool outcomes. */
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
  /** Runtime-only resolved skill paths that the read tool may load under workspaceOnly. */
  skillsSnapshot?: SkillSnapshot;
  /** Original identities for sandbox-materialized skill instruction paths. */
  skillUsagePaths?: SkillUsagePath[];
  /** Prepared conversation-scoped facts for callers that already resolved this run context. */
  conversationCapabilityProfile?: ResolvedConversationCapabilityProfile;
  /** Trusted conversation policy prepared at channel ingress. */
  conversationToolPolicy?: GroupToolPolicyConfig;
  inputProvenance?: InputProvenance;
  /** Consumed in-process completion capability; never derived from model-facing input. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  /** Trusted server-stamped authority for an explicitly capped scheduled run. */
  scheduledToolPolicy?: ScheduledToolPolicyContext;
};
/** Build the runtime tool list exposed through the public agent harness SDK. */
declare function createOpenClawCodingTools(options?: OpenClawCodingToolsOptions): AnyAgentTool[];
//#endregion
//#region src/agents/harness/host-capability-types.d.ts
type AgentHarnessHostApprovalDecision = "allow-once" | "allow-always" | "deny";
type AgentHarnessHostApprovalTerminalReason = "user" | "timeout" | "malformed-verdict" | "no-route" | "run-aborted" | "gateway-restart" | "storage-corrupt";
type AgentHarnessHostApprovalResult = Readonly<{
  decision: AgentHarnessHostApprovalDecision | null | undefined;
  terminalReason: AgentHarnessHostApprovalTerminalReason | null | undefined;
}>;
type AgentHarnessPreparedEnvironment = Readonly<{
  credentialScrubEnv: Readonly<Record<string, string>>;
  localIdentityEnv: Readonly<Record<string, string>>;
  /** Non-secret fact used to select the local GitHub identity overlay. */
  managedLocalIdentity: boolean;
}>;
type AgentHarnessToolSurfaceOptions = Omit<NonNullable<Parameters<(typeof agent_tools_d_exports)["createOpenClawCodingTools"]>[0]>, "operationalRunInstance">;
type AgentHarnessHostCapabilities = Readonly<{
  kind: "agent-harness-host-capability";
  version: 1;
  /** Fails closed unless this exact admitted run capability remains active. */
  assertActive: () => void;
  /** Closure-bound event sink backed by the host-owned trajectory recorder. */
  trajectory?: Readonly<{
    recordEvent: (type: string, data?: Record<string, unknown>) => void;
    flush: () => Promise<void>;
  }>;
  /** Closure-bound non-secret maps prepared before harness placement. */
  preparedEnvironment?: () => AgentHarnessPreparedEnvironment;
  /** Applies the exact host caller binding to a plugin-built tool surface. */
  bindToolSurface: (tools: AnyAgentTool[], options?: Readonly<{
    cwd?: string;
  }>) => AnyAgentTool[];
  /** Creates and binds core tools without exposing admitted-run correlation to the plugin. */
  createToolSurface?: (options: AgentHarnessToolSurfaceOptions, bindingOptions?: Readonly<{
    cwd?: string;
  }>) => AnyAgentTool[];
  /** Core-owned byte binding for a native command approval, scoped to this admitted run. */
  prepareMutableFileApproval?: (request: {
    command: string;
    cwd?: string;
  }) => Promise<{
    ok: true;
    requiresOneShot: boolean;
    revalidate: () => Promise<{
      ok: true;
    } | {
      ok: false;
      message: string;
    }>;
  } | {
    ok: false;
    message: string;
  }>;
  /** Runs policy with host-fixed HookContext; callers provide only the native action tuple. */
  runBeforeToolCall: (request: Omit<Parameters<(typeof agent_tools_before_tool_call_d_exports)["runBeforeToolCallHook"]>[0], "approvalMode" | "ctx"> & {
    /** Native relays may defer approval for a correlated app-server callback. */
    approvalMode?: "request" | "defer";
    /** Action-local facts from the native runtime; host authority remains closure-bound. */
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
  }) => Promise<AgentHarnessHostApprovalResult | undefined>;
}>;
//#endregion
//#region src/tasks/agent-harness-task-runtime-scope.d.ts
type AgentHarnessTaskRuntimeScope = {
  readonly requesterSessionKey: string;
  readonly requesterOrigin?: DeliveryContext;
};
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
  executionStarted?: boolean;
  meta?: string;
  errorCode?: string;
  error?: string;
  validationErrorSummary?: string;
  timedOut?: boolean;
  middlewareError?: boolean;
  mutatingAction?: boolean;
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
  failure?: Omit<ToolErrorSummary, "toolName" | "meta" | "mutatingAction">;
  /** Protocol-owned mutation facts for native tools that do not use OpenClaw definitions. */
  nativeMutation?: {
    mutatingAction: boolean;
    replaySafe: boolean;
  };
  /** Concrete plugin owner; the terminal observer derives mutation facts from executed args. */
  ownerMutation?: {
    ownerKey: string;
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
  admittedRunContext: NonNullable<RunEmbeddedAgentParams["admittedRunContext"]>;
  /**
   * Run-owned start timestamp captured by the embedded-run orchestrator before
   * admission. Flows onto the queue handle so recovery can project the active
   * run's authoritative start time instead of the session's subagent first-run.
   */
  startedAtMs?: number;
  /** Explicit session owner captured before fallback agent resolution. */
  contextEngineAgentId?: string;
  /** Host-resolved sandbox snapshot for plugin harness tool construction. */
  sandbox?: SandboxContext | null;
  /** Host-created authority available only after harness selection. */
  hostCapabilities?: AgentHarnessHostCapabilities;
  /** Sticky operation identity used to suppress ordinary retry and hook policy. */
  operation?: EmbeddedRunAttemptOperation;
  /** Core-prepared fact that explicit requester/config policy restricts plugin-native tools. */
  pluginHarnessToolPolicyRestricted?: boolean;
  /** Audited exact denies that the plugin harness must enforce against native equivalents. */
  pluginHarnessToolPolicySafeDeniedTools?: readonly string[];
  preparedModelRuntime?: PreparedModelRuntimeSnapshot;
  /** Active file-backed artifact target resolved by the run/session target seam. */
  sessionFile: string;
  initialReplayState?: EmbeddedRunReplayState;
  /** Pluggable context engine for ingest/assemble/compact lifecycle. */
  contextEngine?: ContextEngine;
  /** Resolved model context window in tokens for assemble/compact budgeting. */
  contextTokenBudget?: number;
  /** Per-model contextTokens cap authored by the operator; absent when none was authored. */
  authoredContextTokenCap?: number;
  /** Source metadata for the resolved model context budget. */
  contextWindowInfo?: EmbeddedRunContextWindowInfo;
  /** Resolved API key for this run when runtime auth did not replace it. */
  resolvedApiKey?: string;
  /** Auth profile resolved for this attempt's provider/model call. */
  authProfileId?: string;
  /** Source for the resolved auth profile (user-locked or automatic). */
  authProfileIdSource?: "auto" | "user";
  provider: string;
  modelId: string;
  /** Operator-requested or initial model id before any fallback resolution. */
  requestedModelId?: string | null;
  /** True when this attempt is running after a model fallback decision. */
  fallbackActive?: boolean;
  /** Concrete fallback reason that selected this attempt, when known. */
  fallbackReason?: string | null;
  /** Whether this attempt may start or redirect work to another agent/task. */
  delegationCapability?: DelegationCapability;
  /** Concrete degraded-runtime reason for this attempt, when known. */
  degradedReason?: string | null;
  /** Session-pinned embedded harness id. Prevents runtime hot-switching. */
  agentHarnessId?: string;
  /** Capture a local harness implementation only for setup/verified continuations. */
  captureRuntimeArtifact?: boolean;
  /** Exact implementation that must own the attempt before it creates a native thread. */
  expectedRuntimeArtifact?: AgentHarnessRuntimeArtifactBinding;
  /** OpenClaw-owned runtime policy prepared by the orchestrator for this attempt. */
  runtimePlan?: AgentRuntimePlan;
  /** Reports terminal tool facts to the host-owned attempt outcome accumulator. */
  observeToolTerminal?: EmbeddedRunAttemptToolTerminalObserver;
  /** Host-issued scope for harnesses that mirror native child runs into task state. */
  agentHarnessTaskRuntimeScope?: AgentHarnessTaskRuntimeScope;
  /** Storage-aware trajectory recorder owned by the OpenClaw host. */
  trajectoryRecorder?: EmbeddedRunAttemptTrajectoryRecorder | null;
  /** Live observer called after wrapped tool outcomes are recorded. */
  onToolOutcome?: ToolOutcomeObserver;
  /** Reads the sticky untrusted-content flag for the current user turn. */
  isTurnTainted?: () => boolean;
  /** Signals that the attempt's own run-timeout watchdog is active. */
  onAttemptTimeoutArmed?: () => void;
  /** Signals that this attempt's timeout has fired and must unwind promptly. */
  onAttemptTimeout?: (reason: Error) => void;
  /** Signals an explicit cancellation through the active native run handle. */
  onAttemptAbort?: () => void;
  /** Supplies run-global model-call ordering for parallel tool outcomes. */
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
  model: Model;
  authStorage: AuthStorage;
  /** Auth profile store already resolved during startup for this attempt. */
  authProfileStore: AuthProfileStore;
  /**
   * Full auth profile store for OpenClaw tool availability.
   * Plugin-owned harnesses may scope `authProfileStore` to model transport credentials.
   */
  toolAuthProfileStore?: AuthProfileStore;
  modelRegistry: ModelRegistry$1;
  thinkLevel: ThinkLevel;
  fastMode?: EmbeddedRunFastModeParam;
  /** True when this attempt is running the auto fast-mode policy. */
  fastModeAuto?: boolean;
  beforeAgentFinalizeRevisionAttempts?: number;
  maxBeforeAgentFinalizeRevisions?: number;
};
type EmbeddedRunAttemptResult = {
  terminal: AgentRunAttemptTerminal;
  /** True when the runtime made the authoritative final-assistant transcript decision. */
  assistantTranscriptOwned?: boolean;
  /** Exact idempotency key for the runtime-owned final-assistant transcript row. */
  assistantTranscriptIdempotencyKey?: string;
  /** Host-private terminal identity used to close the accepted transcript turn. */
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
  agentHarnessId?: string;
  /** Exact credential material fingerprint reported by a harness-owned auth boundary. */
  authBindingFingerprint?: string;
  /** Exact local implementation used by a plugin-owned harness attempt. */
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
  finalPromptText?: string;
  /** Exact provider-response count when the harness can observe model iterations directly. */
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
    toolCallId?: string;
    meta?: string;
    replaySafe?: boolean;
    isError?: boolean;
    terminate?: boolean;
    asyncStarted?: boolean;
    asyncTaskRunId?: string;
    asyncTaskId?: string;
    /** Producer-recorded: this exec result parked a Code Mode run (status "waiting"). */
    codeModeSuspended?: boolean;
  }>;
  acceptedSessionSpawns?: AcceptedSessionSpawn[];
  /** This attempt accepted work whose future output has a runtime-owned delivery path. */
  runtimeContinuationStarted?: boolean;
  lastAssistant: AssistantMessage | undefined;
  /**
   * Omission preserves the legacy `lastAssistant` fallback; explicit `undefined`
   * means this attempt produced no assistant response.
   */
  currentAttemptAssistant?: AssistantMessage | undefined;
  /** Completed message_end snapshot owned by this model attempt. */
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
  cloudCodeAssistFormatError: boolean;
  /** Effective context window reported by the harness during this attempt. */
  contextTokens?: number;
  /** Whether the harness observed the window or carried prepared resolution forward. */
  contextTokensSource?: "runtime" | "runtime-configured" | "resolved";
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
  }>;
  /** True when sessions_yield tool was called during this attempt. */
  yieldDetected?: boolean;
  /** Explicit user-facing waiting status supplied to sessions_yield. */
  yieldAcknowledgment?: string;
  /**
   * True when code mode owned this attempt's model tool surface. Absent means
   * the harness did not report engagement (treated as not engaged), which is
   * how config-enabled code mode stays visible as a no-op on harness routes.
   */
  codeModeEngaged?: boolean;
  /** Host-authenticated request for one bounded post-mutation inspection attempt. */
  codeModeReconciliationCandidate?: boolean;
  /** Completed assistant round trips observed during this attempt. */
  assistantTurns?: number;
  /** Inner bridge call counts from this attempt's tool-search/code-mode catalog. */
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
    azureApiVersion?: string;
    /** Secret-free projection of request behavior a native harness must reproduce. */
    requestTransportOverrides?: ProviderRouteOverridePresence;
    /** Provider-owned native-runtime compatibility for the prepared route. */
    runtimePolicy?: ProviderModelRouteRuntimePolicy;
    /** Secret-free auth source the native runtime must reproduce for this attempt. */
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
  reason?: string;
  /** Lossless host fallback when this harness cannot reproduce the prepared request. */
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
type AgentHarnessAttemptResult = AgentHarnessCanonicalAttemptResult | AgentHarnessLegacyAttemptResult;
type AgentHarnessSettledTurnFinalizationAttemptParams<TAttemptParams extends AgentHarnessAttemptParams = AgentHarnessAttemptParams> = Omit<TAttemptParams, "hostCapabilities"> & {
  hostCapabilities?: never;
};
type AgentHarnessSettledTurnFinalizationParams<TAttemptParams extends AgentHarnessAttemptParams = AgentHarnessAttemptParams> = {
  /** Fully prepared attempt context for the isolated finalization operation. */
  attempt: AgentHarnessSettledTurnFinalizationAttemptParams<TAttemptParams>;
  /** Settled result whose completed tool transcript needs a final visible answer. */
  settledAttempt: AgentHarnessCanonicalAttemptResult;
};
type AgentHarnessSettledTurnFinalizationResult = {
  /** The single completed assistant answer produced by the isolated operation. */
  assistant: AssistantMessage;
  /** Normalized usage for the finalization model call only. */
  usage?: NormalizedUsage;
  /** True when the harness already persisted the assistant into the application transcript. */
  assistantTranscriptOwned?: boolean;
  /** Exact idempotency key for the harness-owned assistant transcript row. */
  assistantTranscriptIdempotencyKey?: string;
  /** Assistant stream generation index used to correlate final reply delivery. */
  assistantMessageIndex?: number;
  diagnosticTrace?: DiagnosticTraceContext;
};
/** @deprecated Use AgentHarnessIsolatedCompletionParamsV2. Remove after 2026-10-12. */
type AgentHarnessIsolatedCompletionParams = {
  /** Logical provider selected by the caller before harness dispatch. */
  provider: string;
  /** Logical model id selected by the caller before harness dispatch. */
  modelId: string;
  /** Exact prepared transport model; harnesses must not resolve another route. */
  model: Model;
  /** Exact prepared credential; harnesses must not rotate or substitute it. */
  auth: ResolvedProviderAuth;
  /** Non-reversible proof of the prepared credential owner when available. */
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
  /** OpenClaw resolved the exact transport model and credential before handoff. */
  owner: "host";
  model: Model;
  auth: ResolvedProviderAuth;
  /** Non-reversible proof of the prepared credential owner when available. */
  sourceAuthFingerprint?: string;
} | {
  /** The selected harness owns credential resolution for this prepared route. */
  owner: "harness";
  plan: AgentRuntimeAuthPlan;
  /** Credential snapshot restricted to the single profile selected for this call. */
  authProfileStore: AuthProfileStore;
};
type AgentHarnessIsolatedCompletionParamsV2 = Omit<AgentHarnessIsolatedCompletionParams, "model" | "auth" | "sourceAuthFingerprint"> & {
  authorization: AgentHarnessIsolatedCompletionAuthorization;
};
type AgentHarnessIsolatedCompletionResult = {
  /** The single assistant completion. Core rejects tool-shaped or failed results. */
  assistant: AssistantMessage;
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
  /** Host-bound authority for this admitted side execution; contains no public token fields. */
  hostCapabilities?: AgentHarnessHostCapabilities;
  /** Host-resolved sandbox snapshot for this side execution. */
  sandbox?: SandboxContext | null;
  /** Prepared plugin/model generation that owns this side execution. */
  preparedModelRuntime?: PreparedModelRuntimeSnapshot;
  cfg: OpenClawConfig;
  agentDir: string;
  provider: string;
  model: string;
  runtimeModel?: Model<Api>;
  /** One atomic route/profile/store snapshot prepared before native dispatch. */
  preparedRuntimeAuth: {
    plan: AgentRuntimeAuthPlan;
    authProfileStore: AuthProfileStore;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry$1;
    /** Resolved host credential for an immutable API-key route only. */
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
type AgentHarnessSideQuestionResult = {
  text: string;
};
type AgentHarnessCompactParams = CompactEmbeddedAgentSessionParams;
type AgentHarnessCompactResult = EmbeddedAgentCompactResult;
type AgentHarnessNativeCompactionRequest = "after_context_engine" | "required_preflight";
type AgentHarnessNativeCompactionParams = AgentHarnessCompactParams & {
  nativeCompactionRequest: AgentHarnessNativeCompactionRequest;
};
type AgentHarnessNativeCompaction = (params: AgentHarnessNativeCompactionParams) => Promise<AgentHarnessCompactResult | undefined>;
type AgentHarnessRegistrationOptions = {
  /**
   * Registers the Codex-only native preflight bridge in host-owned registry
   * metadata. Arbitrary properties on the public harness never grant it.
   */
  nativeCompaction?: AgentHarnessNativeCompaction;
};
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
  /** Default visible-reply policy when config does not override the harness. */
  visibleReplies?: "automatic" | "message_tool";
  /**
   * @deprecated Use visibleReplies. Kept for existing harness plugins.
   */
  sourceVisibleReplies?: "automatic" | "message_tool";
};
/** Exact node authority and worker capacity required by one paired-device runtime. */
type DevicePlacementRequirement = {
  requiredNodeCommands: readonly string[];
  consumesWorkerSlot: boolean;
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
  /** Declares host-owned remote execution and its exact paired-device requirements. */
  cloudPlacement?: {
    mode: "remote-exec";
    devicePlacement?: DevicePlacementRequirement;
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
  deliveryDefaults?: AgentHarnessDeliveryDefaults;
  /** Certifies exact runAttempt enforcement; direct-policy-restricted channel side questions fail in core. */
  conversationToolPolicySupport?: "exact";
  /**
   * Canonical OpenClaw tool names whose exact denies the harness can also enforce
   * against native equivalents. Every other deny remains fail-closed.
   */
  conversationToolPolicySafeDenyTools?: readonly string[];
  supports(ctx: AgentHarnessSupportContext): AgentHarnessSupport;
  /** Lets this harness resolve forwarded profiles or its own native credentials. */
  authBootstrap?: "harness";
  runAttempt(params: TAttemptParams): Promise<AgentHarnessAttemptResult>;
  /**
   * Produces one final answer from a settled tool transcript without exposing
   * capabilities that can repeat or extend the completed work.
   */
  finalizeSettledTurn?(params: AgentHarnessSettledTurnFinalizationParams<TAttemptParams>): Promise<AgentHarnessSettledTurnFinalizationResult>;
  /** @deprecated Implement runIsolatedCompletionV2. Remove after 2026-10-12. */
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
type AgentHarnessSessionDeletionParams = {
  agentId: string;
  sessionKey: string;
  sessionId: string;
  lifecycleRevision?: string;
  /** Revalidate the captured registry, harness, and operation before each side effect. */
  assertCurrent: () => void;
};
type AgentHarnessSessionDeletionMutation = {
  /** Synchronously remove only the prepared owner's state at the session commit edge. */
  commit: () => void;
  /** Restore only that removal when the authoritative session transaction rolls back. */
  rollback: () => void;
};
type AgentHarnessSessionLifecycleCapability = {
  reset?(params: AgentHarnessResetParams): Promise<void> | void;
  /** Prepare outside the session writer; release native resources after its commit completes. */
  withSessionDeletion?<T>(this: void, params: AgentHarnessSessionDeletionParams, run: (mutation: AgentHarnessSessionDeletionMutation) => Promise<T>): Promise<T>;
  dispose?(): Promise<void> | void;
};
type AgentHarnessSessionForkCapability = {
  sessionFork?: {
    upstreamKinds: readonly SessionUpstreamKind[];
    fork(params: AgentHarnessSessionForkParams): Promise<AgentHarnessSessionForkResult>;
  };
};
type AgentHarnessRuntimeArtifactCapability = {
  /** Revalidate an artifact only at setup and persistent-operation boundaries. */
  runtimeArtifact?: {
    validate(binding: AgentHarnessRuntimeArtifactBinding): Promise<boolean>;
  };
};
type AgentHarnessAuthBindingCapability = {
  /** Recomputes the exact credential fingerprint at persistent trust boundaries. */
  authBinding?: {
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
  workspaceDir: string;
  /** OpenClaw-configured servers whose session policy this harness can enforce. */
  mcpServerNames: readonly string[];
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
};
type AgentHarnessMcpCatalogCapability = {
  /** Lists the MCP tools owned by this session's native runtime, if it is already bound. */
  loadMcpToolCatalog?(params: AgentHarnessMcpCatalogParams): Promise<McpToolCatalog | undefined>;
};
type AgentHarnessModelCatalogParams = {
  config: OpenClawConfig;
  agentId: string;
  agentDir: string;
  workspaceDir: string;
};
type AgentHarnessModelCatalogCapability = {
  /** Lists account-scoped models owned by this native runtime. */
  loadModelCatalog?(params: AgentHarnessModelCatalogParams): Promise<readonly ModelCatalogEntry[]>;
};
/**
 * @deprecated Implement AgentHarnessV2. This registration contract remains
 * source-compatible for existing plugins through 2026-10-12.
 */
type AgentHarness = AgentHarnessRunCapability & AgentHarnessSideQuestionCapability & AgentHarnessClassificationCapability & AgentHarnessCompactionCapability & AgentHarnessRuntimeArtifactCapability & AgentHarnessAuthBindingCapability & AgentHarnessProviderUsageCapability & AgentHarnessModelCatalogCapability & AgentHarnessMcpCatalogCapability & AgentHarnessSessionForkCapability & AgentHarnessSessionLifecycleCapability;
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
  reload?: OpenClawPluginReloadRegistration$1;
  nodeHostCommands?: OpenClawPluginNodeHostCommand[];
  securityAuditCollectors?: OpenClawPluginSecurityAuditCollector$1[];
  register?: (api: OpenClawPluginApi) => void;
};
//#endregion
export { PluginRuntimeCore as $, ProviderSystemPromptContribution as $n, RealtimeTranscriptionSession as $r, listLoadedSpeechProviders as $t, CliBackendLiveSessionCloseReason as A, ProviderPlugin as An, buildBatchHeaders as Ar, getTtsProvider as At, CliBackendResolveExecutionArgs as B, ProviderToolSchemaDiagnostic as Bn, DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR as Br, setTtsAutoMode as Bt, CliBackendAuthEpochMode as C, SpeechTelephonySynthesisRequest as Ci, requireApiKey as Cn, RemoteEmbeddingProviderId as Cr, AcpRuntimeError as Ct, CliBackendExecutionMode as D, registerRuntimeAuthProfileStoreMutationListener as Di, upsertAuthProfile as Dn, enforceEmbeddingMaxInputTokens as Dr, DEFAULT_CONTEXT_TOKENS as Dt, CliBackendExecuteContext as E, TtsDirectiveParseResult as Ei, removeProviderAuthProfilesWithLock as En, resolveRemoteEmbeddingBearerClient as Er, EmbeddedAgentQueueMessageOutcome as Et, CliBackendParseJsonlEventContext as F, ProviderNormalizeToolSchemasContext as Fn, registerMemoryCapability as Fr, resolveExplicitTtsOverrides as Ft, CliBackendToolAvailability as G, ProviderPluginCatalog as Gn, ImageGenerationProviderPlugin$1 as Gr, synthesizeSpeech as Gt, CliBackendRuntimeArtifactPolicy as H, ProviderAugmentModelCatalogContext as Hn, DetachedTaskLifecycleRuntime as Hr, setTtsMaxLength as Ht, CliBackendParsedJsonlEvent as I, ProviderReasoningOutputMode as In, getMemoryEmbeddingProvider as Ir, getLastTtsAttempt as It, CliBackendToolPermissionResult as J, ProviderAuthContext as Jn, SpeechProviderPlugin$1 as Jr, TtsSynthesisResult as Jt, CliBackendToolAvailabilityEnforcement as K, UnifiedModelCatalogProviderContext as Kn, RealtimeTranscriptionProviderPlugin$1 as Kr, TtsResult as Kt, CliBackendPlugin as L, ProviderReplayPolicy as Ln, listMemoryEmbeddingProviders as Lr, listSpeechVoices as Lt, CliBackendNativeToolMode as M, ProviderPrepareDynamicModelContext as Mn, postJsonWithRetry as Mr, textToSpeechTelephony as Mt, CliBackendNormalizeConfigContext as N, ProviderPreparedRuntimeAuth as Nn, clearMemoryPluginState as Nr, streamSpeech as Nt, CliBackendJsonlUsage as O, SecretInputMode as Oi, upsertAuthProfileWithLock as On, uploadBatchJsonlFile as Or, maybeApplyTtsToPayload as Ot, CliBackendParseJsonlEvent as P, ProviderResolveDynamicModelContext as Pn, listMemoryCorpusSupplements as Pr, textToSpeechStream as Pt, CliBackendUserInputResult as Q, ProviderPluginWizardSetup as Qn, RealtimeTranscriptionProviderResolveConfigContext as Qr, getSpeechProvider as Qt, CliBackendPrepareExecutionContext as R, ProviderReplayPolicyContext as Rn, listRegisteredMemoryEmbeddingProviderAdapters as Rr, setLastTtsAttempt as Rt, enablePluginInConfig as S, SpeechSynthesisTarget as Si, ResolvedProviderAuth as Sn, resolveRemoteEmbeddingClient as Sr, unregisterAcpRuntimeBackend as St, CliBackendExecute as T, TtsDirectiveOverrides as Ti, resolveEnvApiKey as Tn, resolveEmbeddingEndpointUrl as Tr, isAcpRuntimeError as Tt, CliBackendSideQuestionToolMode as U, ProviderCatalogContext as Un, TaskRecord as Ur, setTtsPersona as Ut, CliBackendResolveExecutionArgsContext as V, ProviderRuntimeModel as Vn, DetachedTaskFinalizeParams as Vr, setTtsEnabled as Vt, CliBackendThinkingLevel as W, ProviderCatalogResult as Wn, GatewayContextResolver as Wr, setTtsProvider as Wt, CliBackendUserInputQuestion as X, ProviderAuthMethodNonInteractiveContext as Xn, RealtimeTranscriptionProviderConfiguredContext as Xr, TtsTelephonyResult as Xt, CliBackendUserInputOption as Y, ProviderAuthMethod as Yn, RealtimeTranscriptionProviderConfig as Yr, TtsSynthesisStreamResult as Yt, CliBackendUserInputRequest as Z, ProviderAuthResult as Zn, RealtimeTranscriptionProviderId as Zr, canonicalizeSpeechProviderId as Zt, MigrationItem as _, SpeechProviderResolveTalkConfigContext as _i, ResolvedTtsConfig as _n, buildRemoteBaseUrlPolicy as _r, readAcpSessionEntry as _t, ToolSearchCatalogEntry as a, DiagnosticEventInput as ai, buildTtsSystemPromptHint as an, MemoryEmbeddingBatchChunk as ar, PluginBlobStore as at, MigrationProviderPlugin as b, SpeechSynthesisStreamRequest as bi, prepareSimpleCompletionModelForAgent as bn, RemoteEmbeddingClient as br, registerAcpRuntimeBackend as bt, PluginHttpRouteRegistration as c, SpeechDirectiveTokenParseResult as ci, isSummarizationEnabled as cn, MemoryEmbeddingProviderAdapter as cr, WebFetchProviderToolDefinition as ct, RegisterNativeHookRelayParams as d, SpeechProviderConfig as di, resolveTtsAutoMode as dn, MemoryEmbeddingProviderCreateResult as dr, WebSearchProviderSetupContext as dt, RealtimeTranscriptionSessionCallbacks as ei, listSpeechProviders as en, PluginRegistry as er, RuntimeLogger as et, HookContext as f, SpeechProviderConfiguredContext as fi, resolveTtsConfig as fn, MemoryEmbeddingProviderIndexIdentity as fr, WebSearchProviderToolDefinition as ft, MigrationDetection as g, SpeechProviderResolveConfigContext as gi, summarizeText as gn, MemoryPromptSectionBuilder as gr, AcpSessionStoreEntry as gt, MigrationConfigRuntime as h, SpeechProviderPreparedSynthesis as hi, resolveEffectiveTtsConfig as hn, MemoryPluginRuntime as hr, AcpSessionManager as ht, createOpenClawCodingTools as i, OpenClawPluginNodeHostCommandIo as ii, resolveTtsProviderOrder as in, MemoryCorpusSearchResult as ir, PluginBlobEntryInfo as it, CliBackendLiveSessionHandle as j, ProviderWrapStreamFnContext as jn, normalizeBatchBaseUrl as jr, testApi as jt, CliBackendLiveSessionCapability as k, upsertAuthProfileWithLockOrThrow as kn, BatchHttpClientConfig as kr, textToSpeech as kt, NativeHookRelayRetention as l, SpeechListVoicesRequest as li, isTtsEnabled as ln, MemoryEmbeddingProviderCallOptions as lr, WebSearchCredentialResolutionSource as lt, MigrationApplyResult as m, SpeechProviderPrepareSynthesisContext as mi, TtsConfigResolutionContext as mn, MemoryFlushPlan as mr, WebMediaResult as mt, OpenClawPluginConfigSchema as n, spawnTerminalPty as ni, getResolvedSpeechProviderConfig as nn, PluginRuntime as nr, OpenBlobStoreOptions as nt, ToolSearchCatalogRef as o, parseTtsDirectives as oi, getTtsMaxLength as on, MemoryEmbeddingBatchOptions as or, WebFetchCredentialResolutionSource as ot, OpenClawPluginApi as p, SpeechProviderOverrides as pi, resolveTtsPrefsPath as pn, MemoryEmbeddingProviderRuntime as pr, WebSearchProviderToolExecutionContext as pt, CliBackendToolPermissionRequest as q, UnifiedModelCatalogProviderPlugin as qn, RealtimeVoiceProviderPlugin$1 as qr, TtsStreamResult as qt, AgentHarnessTaskRuntimeScope as r, AgentInternalEvent as ri, isTtsProviderConfigured as rn, RunEmbeddedAgentParams as rr, PluginBlobEntry as rt, ToolSearchCatalogToolExecutor as s, SpeechDirectiveTokenParseContext as si, getTtsPersona as sn, MemoryEmbeddingProvider as sr, WebFetchProviderPlugin as st, OpenClawPluginDefinition as t, RealtimeTranscriptionSessionCreateRequest as ti, normalizeSpeechProviderId as tn, SessionCatalogProvider as tr, ResolvedProviderRuntimeAuth as tt, ActiveNativeHookRelayRegistrationHandle as u, SpeechModelOverridePolicy as ui, listTtsPersonas as un, MemoryEmbeddingProviderCreateOptions as ur, WebSearchProviderPlugin as ut, MigrationPlan as v, SpeechProviderResolveTalkOverridesContext as vi, ResolvedTtsModelOverrides as vn, withRemoteHttpResponse as vr, AcpRuntimeBackend as vt, CliBackendConfig as w, SpeechVoiceOption as wi, resolveAwsSdkEnvVarName as wn, embeddingProviderOwnsDestination as wr, AcpRuntimeErrorCode as wt, MigrationSummary as x, SpeechSynthesisStreamResult as xi, resolveApiKeyForProviderCore as xn, createRemoteEmbeddingProvider as xr, requireAcpRuntimeBackend as xt, MigrationProviderContext as y, SpeechSynthesisRequest as yi, completeWithPreparedSimpleCompletionModel as yn, fetchRemoteEmbeddingVectors as yr, getAcpRuntimeBackend as yt, CliBackendPreparedExecution as z, ProviderSanitizeReplayHistoryContext as zn, resolveMemorySearchConfig as zr, setSummarizationEnabled as zt };