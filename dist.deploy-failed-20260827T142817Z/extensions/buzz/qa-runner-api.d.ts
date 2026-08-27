import { n as OpenClawConfig } from "../../types.openclaw-3CDavCPO.js";
import { Command } from "commander";

//#region src/plugin-sdk/qa-channel-protocol.d.ts
/** Conversation shape supported by the synthetic QA channel bus. */
type QaBusConversationKind = "direct" | "channel" | "group";
/** Addressable conversation used by QA bus messages and thread state. */
type QaBusConversation = {
  id: string;
  kind: QaBusConversationKind;
  title?: string;
};
/** Media/file attachment fixture accepted by QA bus message APIs. */
type QaBusAttachment = {
  id: string;
  kind: "image" | "video" | "audio" | "file";
  mimeType: string; /** Selects how QA Channel projects an inline fixture after saving it locally. */
  mediaFactCarrier?: "path" | "media-store-url";
  fileName?: string;
  inline?: boolean;
  url?: string;
  contentBase64?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  altText?: string;
  transcript?: string;
};
/** Tool-call fixture attached to QA messages for agent-runtime tests. */
type QaBusToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};
/** Channel-native command metadata attached to a synthetic inbound message. */
type QaBusNativeCommand = {
  name: string;
};
/** Stored QA bus message after defaults, reactions, and account ids are normalized. */
type QaBusMessage = {
  id: string;
  accountId: string;
  direction: "inbound" | "outbound";
  conversation: QaBusConversation;
  senderId: string;
  senderName?: string;
  text: string; /** Runtime-authored failure marker; copy wording is not a QA contract. */
  isError?: boolean;
  timestamp: number;
  threadId?: string;
  threadTitle?: string;
  replyToId?: string;
  deleted?: boolean;
  editedAt?: number;
  attachments?: QaBusAttachment[];
  nativeCommand?: QaBusNativeCommand;
  toolCalls?: QaBusToolCall[];
  reactions: Array<{
    emoji: string;
    senderId: string;
    timestamp: number;
  }>;
};
/** Input for injecting an inbound message from a synthetic user/channel. */
type QaBusInboundMessageInput = {
  accountId?: string;
  conversation: QaBusConversation;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp?: number;
  threadId?: string;
  threadTitle?: string;
  replyToId?: string;
  attachments?: QaBusAttachment[];
  nativeCommand?: QaBusNativeCommand;
  toolCalls?: QaBusToolCall[];
};
/** Input for recording an outbound message sent by an OpenClaw runtime. */
type QaBusOutboundMessageInput = {
  accountId?: string;
  to: string;
  senderId?: string;
  senderName?: string;
  text: string; /** Preserves ReplyPayload.isError through the synthetic channel transport. */
  isError?: boolean;
  timestamp?: number;
  threadId?: string;
  replyToId?: string;
  attachments?: QaBusAttachment[];
  toolCalls?: QaBusToolCall[];
};
/** Input for editing an existing QA bus message. */
type QaBusEditMessageInput = {
  accountId?: string;
  messageId: string;
  text: string;
  timestamp?: number;
};
//#endregion
//#region src/plugin-sdk/qa-runner-runtime.d.ts
type QaRunnerTransportPolicy = {
  requireGroupMention?: true;
  senderAllowlist?: readonly string[];
  topLevelReplies?: true;
};
type QaRunnerAdapterOptions = {
  explicitScenarioSelection?: boolean;
  repoRoot?: string;
  scenarioIds?: readonly string[];
  sutAccountId?: string;
  credentialFile?: string;
  credentialSource?: string;
  credentialRole?: string;
  transportPolicy?: QaRunnerTransportPolicy;
};
type QaRunnerMessageRecorder = {
  addInboundMessage: (input: QaBusInboundMessageInput) => QaBusMessage | Promise<QaBusMessage>;
  addOutboundMessage: (input: QaBusOutboundMessageInput) => QaBusMessage | Promise<QaBusMessage>;
  editMessage: (input: QaBusEditMessageInput) => QaBusMessage | Promise<QaBusMessage>;
};
type QaRunnerCredentialLease<TPayload> = {
  credentialId?: string;
  heartbeat(): Promise<void>;
  heartbeatIntervalMs: number;
  kind: string;
  leaseToken?: string;
  leaseTtlMs: number;
  ownerId?: string;
  payload: TPayload;
  release(): Promise<void>;
  role?: "ci" | "maintainer";
  source: "convex" | "env";
};
type QaRunnerCredentialLeaseOptions<TPayload> = {
  kind: string;
  parsePayload: (payload: unknown) => TPayload;
  resolveEnvPayload: () => TPayload;
  role?: string;
  source?: string;
};
type QaRunnerCredentialHeartbeat = {
  getFailure(): Error | null;
  stop(): Promise<void>;
  throwIfFailed(): void;
};
type QaRunnerCredentialHost = {
  acquire<TPayload>(options: QaRunnerCredentialLeaseOptions<TPayload>): Promise<QaRunnerCredentialLease<TPayload>>;
  startHeartbeat(lease: Pick<QaRunnerCredentialLease<unknown>, "heartbeat" | "heartbeatIntervalMs" | "kind" | "source">): QaRunnerCredentialHeartbeat;
};
type QaRunnerTransportFlowPreparationInput = {
  config: Record<string, unknown>;
  scenarioId: string;
  scenarioTitle: string;
  gateway: {
    baseUrl: string;
    tempRoot: string;
    workspaceDir: string;
    runtimeEnv: NodeJS.ProcessEnv;
    call: (method: string, params?: unknown, options?: {
      deadlineMs?: number;
      expectFinal?: boolean;
      timeoutMs?: number;
    }) => Promise<unknown>;
    restartAfterStateMutation?: (mutateState: (context: {
      configPath: string;
      runtimeEnv: NodeJS.ProcessEnv;
      stateDir: string;
      tempRoot: string;
    }) => Promise<void>) => Promise<void>;
    stop?: (options?: {
      preserveToDir?: string;
    }) => Promise<void>;
  };
  waitForConfigRestartSettle: (options?: {
    restartDelayMs?: number;
    timeoutMs?: number;
  }) => Promise<void>;
  outputDir: string;
  primaryModel?: string;
  timeoutMs: number;
};
type QaRunnerTransportAdapterDefinition = {
  id: string;
  label: string;
  accountId: string;
  requiredPluginIds: readonly string[];
  supportedActions: readonly ("delete" | "edit" | "react" | "thread-create")[];
  assertTransportHealthy?: () => void;
  describeTransportState?: () => string;
  resetTransport?: () => void | Promise<void>;
  sendInbound: (input: QaBusInboundMessageInput) => Promise<QaBusMessage>;
  sendNativeCommand?: (input: Omit<QaBusInboundMessageInput, "nativeCommand" | "text"> & {
    command: string;
  }) => Promise<void>;
  waitForOutboundSequence?: (input: {
    conversationId?: string;
    finalSettleMs?: number;
    finalTextIncludes: string;
    minimumPreviewEvents?: number;
    sinceCursor?: number;
    threadId?: string;
    timeoutMs?: number;
  }) => Promise<{
    events: Array<{
      cursor: number;
      kind: "sent" | "edited" | "deleted";
      message: QaBusMessage;
    }>;
    final: QaBusMessage;
  }>;
  createGatewayConfig: (params: {
    baseUrl: string;
  }) => Pick<OpenClawConfig, "channels" | "messages">;
  waitReady: (params: {
    gateway: {
      call: (method: string, params?: unknown, options?: {
        timeoutMs?: number;
      }) => Promise<unknown>;
    };
    timeoutMs?: number;
    pollIntervalMs?: number;
  }) => Promise<void>;
  buildAgentDelivery: (params: {
    target: string;
  }) => {
    channel: string;
    to?: string;
    replyChannel: string;
    replyTo: string;
  };
  createRuntimeEnvPatch?: () => NodeJS.ProcessEnv;
  prepareFlow?: (input: QaRunnerTransportFlowPreparationInput) => Promise<Record<string, unknown> | void>;
  handleAction: (params: {
    action: "delete" | "edit" | "react" | "thread-create";
    args: Record<string, unknown>;
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Promise<unknown>;
  createReportNotes: (params: {
    providerMode: "mock-openai" | "aimock" | "live-frontier";
    primaryModel: string;
    alternateModel: string;
    fastMode: boolean;
    concurrency: number;
    isolatedWorkers?: boolean;
  }) => string[];
  cleanup?: () => Promise<void>;
  cleanupAfterGatewayStop?: () => Promise<void>;
};
type QaRunnerTransportFactory = {
  id: string; /** Enables module-backed scenarios; every created adapter must implement `prepareFlow`. */
  supportsModuleFlows?: true; /** Each create() call owns isolated runtime state and may run concurrently. */
  isolatesInstances?: boolean;
  matches: (context: {
    channelId: string;
    driver: string;
  }) => boolean;
  create: (context: {
    adapterOptions?: QaRunnerAdapterOptions;
    channelId: string;
    credentials: QaRunnerCredentialHost;
    driver: string;
    messages: QaRunnerMessageRecorder;
    outputDir: string;
  }) => Promise<QaRunnerTransportAdapterDefinition>;
};
/** CLI registration and optional transport adapter factory exported by a QA runner plugin. */
type QaRunnerCliRegistration = {
  commandName: string;
  adapterFactory?: QaRunnerTransportFactory;
  register(qa: Command): void;
};
//#endregion
//#region extensions/buzz/qa-runner-api.d.ts
declare const qaRunnerCliRegistrations: QaRunnerCliRegistration[];
//#endregion
export { qaRunnerCliRegistrations };