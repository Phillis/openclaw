import { C as Tool, Ct as ChatType, b as TextContent, ft as GroupScope, g as Message, gt as ReplyToMode, h as ImageContent, ht as MarkdownTableMode, j as AgentBinding, lt as DmPolicy, n as OpenClawConfig, ut as DmScope, wt as FastMode, y as StreamFn$1, z as GroupToolPolicyConfig } from "./types.openclaw-Dbu8qmVI.js";
import { j as RuntimeEnv, l as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-D1UqZD8O.js";
import "./types-dxkwMmct.js";
import { i as MediaUnderstandingOutput, t as MediaUnderstandingDecision } from "./types-DuZcu2Qa.js";
import { a as InternalSessionEntry, dt as SessionCreatedVia, it as SessionRestartRecoveryState, lt as SessionRunStatus, mt as ApprovalScopeSchema, s as SessionEntry, st as SourceReplyDeliveryMode, t as ChannelId, ut as SessionCreatedActor } from "./channel-id.types-p0WxQB90.js";
import { n as ResolverContext, r as SecretDefaults, t as SecretTargetRegistryEntry } from "./target-registry-types-CRvTs4zq.js";
import { Static, TSchema, Type } from "typebox";
import "@openclaw/ai/validation";
//#region src/channels/plugins/message-action-names.d.ts
/**
 * Deliberately closed, core-owned vocabulary so every transport can render every action.
 * Plugins add names through a core PR; runtime registration is intentionally unsupported.
 */
declare const CHANNEL_MESSAGE_ACTION_NAMES: readonly ["send", "broadcast", "poll", "poll-vote", "react", "reactions", "read", "edit", "unsend", "reply", "sendWithEffect", "renameGroup", "setGroupIcon", "addParticipant", "removeParticipant", "leaveGroup", "sendAttachment", "delete", "pin", "unpin", "list-pins", "permissions", "thread-create", "thread-list", "thread-reply", "search", "sticker", "sticker-search", "member-info", "role-info", "emoji-list", "emoji-upload", "sticker-upload", "role-add", "role-remove", "channel-info", "channel-list", "channel-create", "channel-edit", "channel-delete", "channel-move", "category-create", "category-edit", "category-delete", "topic-create", "topic-edit", "voice-status", "event-list", "event-create", "timeout", "kick", "ban", "set-profile", "set-presence", "download-file", "upload-file"];
/**
 * Message action name union derived from the canonical action list.
 */
type ChannelMessageActionName$1 = (typeof CHANNEL_MESSAGE_ACTION_NAMES)[number];
//#endregion
//#region packages/gateway-protocol/src/client-info.d.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
declare const GATEWAY_CLIENT_IDS: {
  readonly WEBCHAT_UI: "webchat-ui";
  readonly CONTROL_UI: "openclaw-control-ui";
  readonly BROWSER_COPILOT: "openclaw-browser-copilot";
  readonly TUI: "openclaw-tui";
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly GATEWAY_CLIENT: "gateway-client";
  readonly MACOS_APP: "openclaw-macos";
  readonly LINUX_APP: "openclaw-linux";
  readonly IOS_APP: "openclaw-ios";
  readonly WATCHOS_APP: "openclaw-watchos";
  readonly ANDROID_APP: "openclaw-android";
  readonly NODE_HOST: "node-host";
  readonly WORKER: "openclaw-worker";
  readonly TEST: "test";
  readonly FINGERPRINT: "fingerprint";
  readonly PROBE: "openclaw-probe";
};
/** Stable gateway client ids used on the wire during hello/connect handshakes. */
type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
/** Compatibility alias for internal callers that still use "name" terminology. */
type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
declare const GATEWAY_CLIENT_MODES: {
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly UI: "ui";
  readonly BACKEND: "backend";
  readonly NODE: "node";
  readonly WORKER: "worker";
  readonly PROBE: "probe";
  readonly TEST: "test";
};
/** Coarse client category used for gateway policy and diagnostics. */
type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
//#endregion
//#region packages/agent-core/src/types.d.ts
/**
 * Stream function used by the agent loop.
 *
 * Contract:
 * - Must not throw or return a rejected promise for request/model/runtime failures.
 * - Must return an AssistantMessageEventStream.
 * - Failures must be encoded in the returned stream via protocol events and a
 *   final AssistantMessage with stopReason "error" or "aborted" and errorMessage.
 */
type StreamFn = StreamFn$1;
/**
 * Configuration for how tool calls from a single assistant message are executed.
 *
 * - "sequential": each tool call is prepared, checked for steering, executed, and finalized before the next one starts.
 * - "parallel": tool calls are prepared sequentially, checked for steering once, then allowed tools execute concurrently.
 *   `tool_execution_end` is emitted in tool completion order after each tool is finalized,
 *   while tool-result message artifacts are emitted later in assistant source order.
 */
type ToolExecutionMode = "sequential" | "parallel";
interface BashExecutionMessage {
  /** Harness role for shell command transcripts. */
  role: "bashExecution";
  /** Command line that was executed. */
  command: string;
  /** Captured command output, usually already truncated for context. */
  output: string;
  /** Process exit code when the command reached process exit. */
  exitCode: number | undefined;
  /** True when the command was interrupted before normal completion. */
  cancelled: boolean;
  /** True when output was shortened for transcript/context storage. */
  truncated: boolean;
  /** Optional path containing the complete output when truncation occurred. */
  fullOutputPath?: string;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
  /** Exclude this command transcript from model context while keeping it in session history. */
  excludeFromContext?: boolean;
}
interface CustomMessage<T = unknown> {
  /** Harness role for application-defined transcript content. */
  role: "custom";
  /** Application-defined discriminator for rendering or handling this message. */
  customType: string;
  /** Content replayed into model context when this message is included. */
  content: string | (TextContent | ImageContent)[];
  /** Whether UI surfaces should display this message. */
  display: boolean;
  /** Keep display-only application activity out of future model context. */
  excludeFromContext?: boolean;
  /** Optional application-specific metadata. */
  details?: T;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
}
interface BranchSummaryMessage {
  /** Harness role for summaries produced when returning from another branch. */
  role: "branchSummary";
  /** Summary text inserted back into model context. */
  summary: string;
  /** Entry id of the branch root or source leaf being summarized. */
  fromId: string;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
}
interface CompactionSummaryMessage {
  /** Harness role for summaries that replace compacted transcript history. */
  role: "compactionSummary";
  /** Summary text inserted back into model context. */
  summary: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Timestamp may be numeric in memory or string when loaded from older persisted rows. */
  timestamp: number | string;
  /** Optional estimated context tokens after compaction. */
  tokensAfter?: number;
  /** Optional first retained entry id from the compaction range. */
  firstKeptEntryId?: string;
  /** Optional implementation-specific compaction metadata. */
  details?: unknown;
}
/**
 * Extensible interface for custom app and harness messages.
 * Apps can extend via declaration merging.
 */
interface CustomAgentMessages {
  bashExecution: BashExecutionMessage;
  custom: CustomMessage;
  branchSummary: BranchSummaryMessage;
  compactionSummary: CompactionSummaryMessage;
}
/**
 * AgentMessage: Union of LLM messages + custom messages.
 * This abstraction allows apps to add custom message types while maintaining
 * type safety and compatibility with the base LLM messages.
 */
type AgentMessage = Message | CustomAgentMessages[keyof CustomAgentMessages];
/** Channel-safe progress text emitted by a running tool. */
interface AgentToolProgress {
  /** Public text suitable for user-facing progress surfaces. */
  text: string;
  /** Tool progress is rendered by channel progress UIs. */
  visibility: "channel";
  /** Progress text must not contain secrets, private args, or fetched content. */
  privacy: "public";
  /** Optional stable id for progress line replacement. */
  id?: string;
}
/** Final or partial result produced by a tool. */
interface AgentToolResult<T> {
  /** Text or image content returned to the model. */
  content: (TextContent | ImageContent)[];
  /** Arbitrary structured details for logs or UI rendering. */
  details: T;
  /** Optional public progress hint for partial tool updates; never model content. */
  progress?: AgentToolProgress;
  /**
   * Hint that the agent should stop after the current tool batch.
   * Early termination only happens when every finalized tool result in the batch sets this to true.
   */
  terminate?: boolean;
}
/** Callback used by tools to stream partial execution updates. */
type AgentToolUpdateCallback<T = unknown> = (partialResult: AgentToolResult<T>) => void;
/** Origin class for tool output that can taint later model-authored content in the same turn. */
type ToolResultContentSource = "network";
/** Tool definition used by the agent runtime. */
interface AgentTool<TParameters extends TSchema = TSchema, TDetails = unknown> extends Tool<TParameters> {
  /** Human-readable label for UI display. */
  label: string;
  /** Optional schema for the structured `AgentToolResult.details` value. */
  outputSchema?: TSchema;
  /** Preserve lifecycle telemetry without rendering transient channel progress. */
  hideFromChannelProgress?: boolean;
  /** Tool results contain externally controlled network content. */
  resultContentSource?: ToolResultContentSource;
  /**
   * Optional compatibility shim for raw tool-call arguments before schema validation.
   * Must return an object that matches `TParameters`.
   */
  prepareArguments?: (args: unknown) => Static<TParameters>;
  /** Execute the tool call. Throw on failure instead of encoding errors in `content`. */
  execute: (toolCallId: string, params: Static<TParameters>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails>) => Promise<AgentToolResult<TDetails>>;
  /**
   * Per-tool execution mode override.
   * - "sequential": this tool must execute one at a time with other tool calls.
   * - "parallel": this tool can execute concurrently with other tool calls.
   *
   * If omitted, the default execution mode applies.
   */
  executionMode?: ToolExecutionMode;
}
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.d.ts
/** Generated compaction data ready to be persisted as a compaction entry. */
interface CompactionResult<T = unknown> {
  /** Summary text that replaces compacted history in future context. */
  summary: string;
  /** Entry id where retained history starts. */
  firstKeptEntryId: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Optional implementation-specific details stored with the compaction entry. */
  details?: T;
}
//#endregion
//#region src/channels/location.d.ts
/** Normalized source kind for channel-provided geographic locations. */
type LocationSource = "pin" | "place" | "live";
/** Channel-neutral location payload passed from plugins into shared prompt rendering. */
type NormalizedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  isLive?: boolean;
  source?: LocationSource;
  caption?: string;
};
/** Portable outbound location fields supported by channel send adapters. */
type OutboundLocation = Pick<NormalizedLocation, "latitude" | "longitude" | "accuracy" | "name" | "address">;
//#endregion
//#region src/infra/approval-scope.d.ts
type ApprovalScope = Static<typeof ApprovalScopeSchema>;
//#endregion
//#region src/infra/command-analysis/explain.d.ts
/** Compact command explanation summary shown in approval UI. */
type CommandExplanationSummary = {
  commandCount: number;
  nestedCommandCount: number;
  riskKinds: string[];
  warningLines: string[];
};
//#endregion
//#region src/infra/exec-approval-policy-snapshot.d.ts
type ExecApprovalPolicyRule = {
  pattern: string;
  argPattern?: string;
  source?: "allow-always";
};
type ExecApprovalPolicySnapshot = {
  security: "deny" | "allowlist" | "full";
  ask: "off" | "on-miss" | "always";
  askFallback: "deny" | "allowlist" | "full";
  autoAllowSkills: boolean;
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals-core.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
type ExecApprovalUnavailableDecision = "allow-always";
type SystemRunApprovalBinding = {
  argv: string[];
  cwd: string | null;
  agentId: string | null;
  sessionKey: string | null;
  envHash: string | null;
};
type SystemRunApprovalFileOperand = {
  argvIndex: number;
  path: string;
  sha256: string;
};
type SystemRunApprovalPlan = {
  argv: string[];
  cwd: string | null;
  commandText: string;
  commandPreview?: string | null;
  agentId: string | null;
  sessionKey: string | null;
  policySnapshot?: ExecApprovalPolicySnapshot;
  mutableFileOperand?: SystemRunApprovalFileOperand | null;
};
type ExecApprovalCommandSpan = {
  startIndex: number;
  endIndex: number;
};
/** Cron job identity recorded at approval creation for a cron isolated run. */
type ExecApprovalCronExecutionSource = {
  jobId: string;
  jobConfigRevision: string;
};
type ExecApprovalRequestPayload = {
  command: string;
  commandPreview?: string | null;
  commandArgv?: string[];
  envKeys?: string[];
  systemRunBinding?: SystemRunApprovalBinding | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  nodeId?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  warningText?: string | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandSpans?: ExecApprovalCommandSpan[];
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
  allowedDecisions?: readonly ExecApprovalDecision[];
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  runId?: string | null;
  toolCallId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
  /** Gateway-recorded cron source; never taken from client request params. */
  cronExecutionSource?: ExecApprovalCronExecutionSource | null;
  /** Exact operation binding prepared at creation for standing-grant minting. */
  cronOperationBinding?: string | null;
};
type ExecApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "exec";
  id: string;
  request: ExecApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type ExecApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: ExecApprovalRequest["request"];
};
//#endregion
//#region src/infra/plugin-approvals.d.ts
/** Button/action metadata shown with a plugin approval request. */
type PluginApprovalActionView = {
  kind?: "command" | "decision";
  label: string;
  command: string;
  decision?: ExecApprovalDecision;
  style?: "primary" | "secondary" | "success" | "danger";
};
/** Request payload supplied by plugin approval callers. */
type PluginApprovalRequestPayload = {
  pluginId?: string | null;
  title: string;
  description: string;
  detail?: string | null;
  severity?: "info" | "warning" | "critical" | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope | null;
  toolName?: string | null;
  toolCallId?: string | null;
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null;
  /** Host-derived source run; never accepted from plugin approval RPC params. */
  runId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
type PluginApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "plugin";
  id: string;
  request: PluginApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
/** Resolved plugin approval decision plus optional request snapshot. */
type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};
//#endregion
//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin";
/** Backward-compatible request shape accepted from Gateway events and replay. */
type ApprovalRequestInput = ExecApprovalRequest | PluginApprovalRequest;
//#endregion
//#region src/interactive/payload.d.ts
type InteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
/** Visual tone for a portable message presentation. */
type MessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
type QuestionPresentationAction = {
  /** Resolve one declared choice. */
  type: "question";
  questionId: string;
  optionValue: string;
} | {
  /** Switch this question to its free-text answer path. */
  type: "question";
  questionId: string;
  intent: "custom-input";
};
/** Core-owned model-picker action; channels serialize it only inside private envelopes. */
type ModelPickerAction = ({
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-providers";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-models";
  providerToken: string;
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-recents";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-model";
  providerToken: string;
  modelToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-runtime";
  providerToken: string;
  modelToken: string;
  runtimeToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "reset";
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "cancel";
}) & {
  /** Legacy command/callback payload fields are deliberately unavailable on picker actions. */
  readonly command?: never;
  readonly value?: never;
};
/** Portable typed action behind a button or select option. */
type MessagePresentationAction = {
  /** Run a core/plugin slash command through the target channel's native command path. */
  type: "command";
  command: string;
} | {
  /** Opaque callback value interpreted by the target channel/plugin. */
  type: "callback";
  value: string;
} | ModelPickerAction | {
  /** Resolve one durable operator approval without exposing transport callback data. */
  type: "approval";
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  decision: "allow-once" | "allow-always" | "deny";
} | QuestionPresentationAction | {
  /** Open a normal external link. */
  type: "url";
  url: string;
} | {
  /** Launch a channel-native web app. */
  type: "web-app";
  /** External web app URL for channels that launch web apps by URL. */
  url: string;
  /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId?: string;
} | {
  /** Launch a channel-native web app. */
  type: "web-app";
  /** External web app URL for channels that launch web apps by URL. */
  url?: string;
  /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId: string;
};
/** Portable action control rendered as a button or link by channel adapters. */
type MessagePresentationButton = {
  /** User-visible button label. */
  label: string;
  /** Typed action sent when the button is pressed. */
  action?: MessagePresentationAction;
  /**
   * Legacy opaque callback value sent when the button is pressed.
   * Prefer action for new presentation controls.
   * @deprecated Use action.
   */
  value?: string;
  /** @deprecated Use an action with type "url". */
  url?: string;
  /** @deprecated Use an action with type "web-app". */
  webApp?: {
    url: string;
  };
  /**
   * @deprecated Use an action with type "web-app". Accepted for legacy JSON payloads only.
   */
  web_app?: {
    url: string;
  };
  /** Higher-priority buttons are kept first when channel limits require truncation. */
  priority?: number;
  /** Disable the button when the target channel supports disabled controls. */
  disabled?: boolean;
  /** Keep this action available after a successful interaction when the target channel supports it. */
  reusable?: boolean;
  /** Optional visual style hint; unsupported channels ignore or normalize it. */
  style?: InteractiveButtonStyle;
};
/** Portable select/menu option. */
type MessagePresentationOption = {
  /** User-visible option label. */
  label: string;
  /** Typed action sent when the option is selected. */
  action?: Extract<MessagePresentationAction, {
    type: "command" | "callback" | "model-picker";
  }>;
  /** @deprecated Use action. */
  value?: string;
};
type LegacyInteractiveReplyOption = MessagePresentationOption;
type LegacyInteractiveReplyTextBlock = {
  type: "text";
  text: string;
};
type LegacyInteractiveReplySelectBlock = {
  type: "select";
  placeholder?: string;
  options: LegacyInteractiveReplyOption[];
};
type LegacyInteractiveReplyBlock = LegacyInteractiveReplyTextBlock | MessagePresentationButtonsBlock | LegacyInteractiveReplySelectBlock;
type LegacyInteractiveReply = {
  blocks: LegacyInteractiveReplyBlock[];
};
/** @deprecated Use MessagePresentation. */
type InteractiveReply = LegacyInteractiveReply;
type MessagePresentationTextBlock = {
  type: "text";
  /** Primary markdown-ish text rendered in the message body. */
  text: string;
};
type MessagePresentationContextBlock = {
  type: "context";
  /** Lower-emphasis contextual text, or normal text on channels without context support. */
  text: string;
};
type MessagePresentationDividerBlock = {
  type: "divider";
};
type MessagePresentationButtonsBlock = {
  type: "buttons";
  /** Button row candidates; core may split or truncate them for channel limits. */
  buttons: MessagePresentationButton[];
};
type MessagePresentationSelectBlock = {
  type: "select";
  /** Optional prompt shown above or inside the select control. */
  placeholder?: string;
  /** Menu options; core may truncate them for channel limits. */
  options: MessagePresentationOption[];
};
type MessagePresentationChartSegment = {
  /** Category label shown in the chart legend. */
  label: string;
  /** Positive segment magnitude. */
  value: number;
};
type MessagePresentationChartSeries = {
  /** Unique series name shown in the chart legend. */
  name: string;
  /** One finite value for each chart category, in category order. */
  values: number[];
};
type MessagePresentationChartBlock = {
  type: "chart";
  chartType: "pie";
  /** Short chart heading. */
  title: string;
  segments: MessagePresentationChartSegment[];
} | {
  type: "chart";
  chartType: "bar" | "area" | "line";
  /** Short chart heading. */
  title: string;
  /** Ordered categories shared by every series. */
  categories: string[];
  series: MessagePresentationChartSeries[];
  xLabel?: string;
  yLabel?: string;
};
/** Scalar cell value supported by portable table presentations. */
type MessagePresentationTableCell = string | number;
/** Portable table rendered natively where supported and linearly elsewhere. */
type MessagePresentationTableBlock = {
  type: "table";
  /** Short table heading used by native renderers and fallback text. */
  caption: string;
  /** Unique ordered column labels shared by every row. */
  headers: string[];
  /** Rows whose width exactly matches the header count. */
  rows: MessagePresentationTableCell[][];
  /** Optional column whose cells should be rendered as row headers. */
  rowHeaderColumnIndex?: number;
};
type MessagePresentationBlock = MessagePresentationTextBlock | MessagePresentationContextBlock | MessagePresentationDividerBlock | MessagePresentationButtonsBlock | MessagePresentationSelectBlock | MessagePresentationChartBlock | MessagePresentationTableBlock;
type MessagePresentation = {
  /** Optional short heading rendered before blocks when the channel supports it. */
  title?: string;
  /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: MessagePresentationTone;
  /** Ordered portable blocks rendered or downgraded by the target channel adapter. */
  blocks: MessagePresentationBlock[];
};
type ReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};
type ReplyPayloadDelivery = {
  pin?: boolean | ReplyPayloadDeliveryPin;
};
//#endregion
//#region src/auto-reply/reply-payload.d.ts
type ReplyMediaAttachment = {
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
  /** Internal per-URL trust carried until mixed media is split for history projection. */
  trustedLocalMedia?: boolean;
};
/** Channel-agnostic assistant reply payload. */
type ReplyPayload = {
  text?: string;
  /** Visible body a channel adapter may use when native structured content requires text. */
  fallbackText?: {
    text: string;
    /** Batch payload replaced when the adapter adopts this fallback body. */
    replacesPayloadIndex?: number;
  };
  mediaUrl?: string;
  mediaUrls?: string[];
  /** Prepared metadata aligned with mediaUrls for client-facing history projection. */
  attachments?: ReplyMediaAttachment[];
  /** Internal-only trust signal for gateway webchat local media embedding. */
  trustedLocalMedia?: boolean;
  /** Treat media as live-only content and avoid persisting the underlying media reference. */
  sensitiveMedia?: boolean;
  /** Channel-agnostic rich presentation. Core degrades or asks the channel renderer to map it. */
  presentation?: MessagePresentation;
  /** Runtime-authored text is the exact fallback, not additional native presentation content. */
  presentationTextMode?: "fallback";
  /** Channel-agnostic delivery preferences, e.g. pin the sent message when supported. */
  delivery?: ReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   *
   * Internal legacy representation used by existing approval/reply helpers during migration.
   */
  interactive?: InteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean;
  /** True when [[reply_to_current]] was present but not yet mapped to a message id. */
  replyToCurrent?: boolean;
  /** Send audio as voice message (bubble) instead of audio file. Defaults to false. */
  audioAsVoice?: boolean;
  /** Send video media as a round video note when the channel supports it. */
  videoAsNote?: boolean;
  /** Channel-neutral geographic location or named place. */
  location?: OutboundLocation;
  /**
   * Text synthesized into an audio-only TTS payload. Exposed to hooks for
   * archival/search use when no visible channel text is sent.
   */
  spokenText?: string;
  /**
   * Marks a TTS media payload as supplemental audio for assistant text that is
   * already visible through streaming or transcript projection.
   */
  ttsSupplement?: ReplyPayloadTtsSupplement;
  isError?: boolean;
  /** Marks this payload as a reasoning/thinking block. Channels that do not
   *  have a dedicated reasoning lane (e.g. WhatsApp, web) should suppress it. */
  isReasoning?: boolean;
  /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
  /** Reasoning stream text is a complete replacement snapshot, not a delta. */
  isReasoningSnapshot?: boolean;
  /** Marks this payload as a compaction status notice (start/end).
   *  Should be excluded from TTS transcript accumulation so compaction
   *  status lines are not synthesised into the spoken assistant reply. */
  isCompactionNotice?: boolean;
  /** Marks this payload as a model-fallback transition/recovery notice. */
  isFallbackNotice?: boolean;
  /** Marks this payload as transient status, not assistant answer content. */
  isStatusNotice?: boolean;
  /** Channel-specific payload data (per-channel envelope). */
  channelData?: Record<string, unknown>;
};
/** Metadata for audio-only media that supplements already-visible assistant text. */
type ReplyPayloadTtsSupplement = {
  spokenText: string;
  visibleTextAlreadyDelivered?: boolean;
};
/** Reply policy facts that provider adapters use to resolve the final transport route. */
type ReplyDeliveryContext = {
  chatType?: "direct" | "group" | "channel" | null;
  replyToMode: ReplyToMode;
};
//#endregion
//#region src/channels/inbound-event/kind.d.ts
/**
 * High-level inbound event class used to separate actionable user requests from room activity.
 */
type InboundEventKind = "user_request" | "room_event";
//#endregion
//#region packages/media-core/src/constants.d.ts
/** Canonical media families used by attachment facts, routing, and MIME classification. */
type MediaKind = "image" | "audio" | "video" | "document" | "sticker" | "unknown";
/** Maps a MIME type to the media family used for size limits and routing. */
declare function mediaKindFromMime(mime?: string | null): MediaKind | undefined;
//#endregion
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
//#endregion
//#region src/media/media-facts.d.ts
/** One ordered runtime attachment; array position is its alignment identity. */
type MediaFact = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: MediaKind;
  fileName?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  transcribed?: boolean;
  messageId?: string;
  workspaceDir?: string;
  /** Internal proof that this exact fact was covered by a legacy staged projection. */
  staged?: boolean;
  hydrationSuppressed?: boolean;
};
type MediaFactInput = { [Key in keyof MediaFact]?: MediaFact[Key] | null; };
declare const LEGACY_MEDIA_CONTEXT_KEYS: readonly ["MediaPath", "MediaPaths", "MediaUrl", "MediaUrls", "MediaType", "MediaTypes", "MediaDir", "MediaTranscribedIndexes", "MediaStaged", "MediaWorkspaceDir"];
type LegacyMediaContextKey = (typeof LEGACY_MEDIA_CONTEXT_KEYS)[number];
//#endregion
//#region src/plugins/hook-channel-context.types.d.ts
interface PluginHookChannelSenderContext {
  /** Channel-scoped sender ID, matching `ctx.senderId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelChatContext {
  /** Transport-native conversation ID, matching `ctx.chatId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelContext {
  /** Sender metadata supplied by the originating channel. */
  sender?: PluginHookChannelSenderContext;
  /** Chat/conversation metadata supplied by the originating channel. */
  chat?: PluginHookChannelChatContext;
}
//#endregion
//#region src/sessions/input-provenance.d.ts
declare const INPUT_PROVENANCE_KIND_VALUES: readonly ["external_user", "inter_session", "internal_system"];
type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];
type InputProvenance = {
  kind: InputProvenanceKind;
  originSessionId?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
};
//#endregion
//#region src/auto-reply/command-turn-context.d.ts
type CommandTurnKind = "native" | "text-slash" | "normal";
type BaseCommandTurnContext = {
  commandName?: string;
  body?: string;
};
type NativeCommandTurnContext = BaseCommandTurnContext & {
  kind: "native";
  source: "native";
  authorized: boolean;
};
type TextSlashCommandTurnContext = BaseCommandTurnContext & {
  kind: "text-slash";
  source: "text";
  authorized: boolean;
};
type NormalCommandTurnContext = BaseCommandTurnContext & {
  kind: "normal";
  source: "message";
  authorized: false;
};
type CommandTurnContext = NativeCommandTurnContext | TextSlashCommandTurnContext | NormalCommandTurnContext;
//#endregion
//#region src/auto-reply/commands-args.types.d.ts
/** Primitive values accepted by parsed auto-reply command args. */
type CommandArgValue = string | number | boolean | bigint;
/** Named parsed auto-reply command values. */
type CommandArgValues = Record<string, CommandArgValue>;
/** Parsed command argument bundle with raw source and structured values. */
type CommandArgs = {
  raw?: string;
  values?: CommandArgValues;
};
//#endregion
//#region src/auto-reply/reply/history.types.d.ts
/** Normalized history message used when building reply context. */
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
/** Media metadata attached to a normalized history message. */
type HistoryMediaEntry = Pick<MediaFact, "contentType" | "durationMs" | "height" | "kind" | "messageId" | "path" | "url" | "width">;
//#endregion
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/channels/streaming.d.ts
type AgentPlanStepStatus = "pending" | "in_progress" | "completed";
type AgentPlanStep = {
  step: string;
  status: AgentPlanStepStatus;
};
//#endregion
//#region src/config/sessions/session-transcript-turn-lifecycle.types.d.ts
/** Authoritative lifecycle snapshot required for an atomic transcript admission. */
type SessionTranscriptTurnExpectedState = {
  /** Rejects a run-owned turn after another admitted run takes writer ownership. */
  expectedWriterRunId?: string;
  abortedLastRun: boolean | undefined;
  /** Fences recovery-only transcript writes against concurrent ownership changes. */
  mainRestartRecoveryCycleId: string | undefined;
  mainRestartRecoveryRevision: number | undefined;
  restartRecoveryBeforeAgentReplyState: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryRequestFingerprint: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryTerminalRunIds: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  status: SessionRunStatus | undefined;
};
/** Lifecycle fields committed with an accepted transcript turn. */
type SessionTranscriptTurnLifecyclePatch = {
  abortedLastRun?: boolean;
  endedAt?: number;
  lifecycleRunId?: InternalSessionEntry["lifecycleRunId"];
  lastRunId?: InternalSessionEntry["lastRunId"];
  lastRunError?: InternalSessionEntry["lastRunError"];
  pendingFinalDelivery?: InternalSessionEntry["pendingFinalDelivery"];
  mainRestartRecovery?: InternalSessionEntry["mainRestartRecovery"];
  restartRecoveryBeforeAgentReplyState?: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState?: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId?: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryContext?: SessionRestartRecoveryState["restartRecoveryDeliveryContext"];
  restartRecoveryDeliveryRequestFingerprint?: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId?: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId?: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId?: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId?: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired?: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress?: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode?: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryForceSafeTools?: InternalSessionEntry["restartRecoveryForceSafeTools"];
  restartRecoveryRuns?: InternalSessionEntry["restartRecoveryRuns"];
  /** Durable tombstones merged with the fresh row inside the SQLite write transaction. */
  restartRecoveryTerminalRunIds?: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  runtimeMs?: number;
  startedAt?: number;
  status?: SessionRunStatus;
  updatedAt?: number;
};
//#endregion
//#region src/config/sessions/transcript-entry-anchor.d.ts
/** Immutable transcript identity issued by the SQLite append transaction. */
type TranscriptEntryAnchor = Readonly<{
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  generation: string;
  entryId: string;
  rawSeq: number;
  effectiveParentId: string | null;
  activeMessagePosition: number;
  idempotencyKey?: string;
}>;
/** Current user row bound to one recorder-owned logical turn. */
type TranscriptTurnAdmission = TranscriptEntryAnchor & Readonly<{
  logicalTurnId: string;
  role: "user";
}>;
/** Exact accepted transcript range, inclusive of admission and terminal. */
type TranscriptTurnBoundary = Readonly<{
  admission: TranscriptTurnAdmission;
  terminal: TranscriptEntryAnchor;
}>;
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = SessionEntry;
type PersistedUserTurnMediaInput = Pick<MediaFactInput, "contentType" | "durationMs" | "fileName" | "height" | "hydrationSuppressed" | "messageId" | "path" | "sizeBytes" | "transcribed" | "url" | "width"> & {
  kind?: string | null;
  workspaceDir?: string | null;
};
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}> & {
  __openclaw?: Record<string, unknown>;
};
type UserTurnInput = {
  text?: string | null;
  media?: readonly PersistedUserTurnMediaInput[] | null;
  /** Restart-safe native image placement; model-visible prompt bytes remain separate. */
  mediaImageLayout?: {
    slots: readonly {
      kind: "inline" | "offloaded";
      factIndex?: number;
    }[];
    suppressedFactIndexes?: readonly number[];
  } | null;
  timestamp?: number;
  idempotencyKey?: string;
  /** Durable transcript message reference used to render and hydrate replies. */
  replyToId?: string;
  /** Bounded display fallback for replies whose target is outside loaded history. */
  replyToPreview?: {
    text: string;
    senderLabel?: string | null;
  } | null;
  senderIsOwner?: boolean;
  provenance?: InputProvenance;
  /** Durable participant attribution. Callers must opt in at the product boundary. */
  sender?: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
  } | null;
  /** Durable transport correlation; stored privately and never rendered into model input. */
  transport?: {
    channel?: string;
    conversationRef?: string;
    messageId?: string;
    replyToId?: string;
    threadId?: string;
  };
};
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptPersistenceTarget = {
  sessionId: string;
  expectedSessionId?: string;
  sessionKey: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  sessionStore?: Record<string, UserTurnSessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptTarget = UserTurnTranscriptPersistenceTarget;
type UserTurnTranscriptAdmissionReceipt = TranscriptTurnAdmission;
type UserTurnTranscriptPersistResult = {
  /** True only when this call inserted the transcript message. */
  appended?: boolean;
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  /** Confirms exact-run steering provenance after transcript commitment is proven. */
  confirmSteerTargetRunIdForPersistence?: (targetRunId: string) => Promise<void>;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  getAdmissionReceipt: () => UserTurnTranscriptAdmissionReceipt | undefined;
  setAdmissionHandler?: (handler: (admission: UserTurnTranscriptAdmissionReceipt) => void) => void;
  markSentToProvider?: () => void;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage, anchor?: TranscriptEntryAnchor | UserTurnTranscriptAdmissionReceipt) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
    expectedSessionId?: string;
    expectedSessionState?: SessionTranscriptTurnExpectedState;
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch;
    /** Allow a later explicit persistence attempt when this attempt appends nothing. */
    retryIfUnpersisted?: boolean;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (message: PersistedUserTurnMessage, params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
//#region src/auto-reply/reply/typing.d.ts
/** Controller for channel typing indicator lifecycle during a reply run. */
type TypingController = {
  onReplyStart: () => Promise<void>;
  startTypingLoop: () => Promise<void>;
  startTypingOnText: (text?: string) => Promise<void>;
  refreshTypingTtl: () => void;
  isActive: () => boolean;
  markRunComplete: () => void;
  markDispatchIdle: () => void;
  cleanup: () => void;
};
//#endregion
//#region src/auto-reply/get-reply-options.types.d.ts
type BlockReplyContext = {
  abortSignal?: AbortSignal;
  timeoutMs?: number;
  /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
  /** @internal Stable durable outbound intent owned by the producing runtime. */
  deliveryIntentId?: string;
};
/** Context passed to onModelSelected callback with actual model used. */
type ModelSelectedContext = {
  provider: string;
  model: string;
  thinkLevel: string | undefined;
};
/** Typing indicator class for channel-owned UX policy. */
type TypingPolicy = "auto" | "user_message" | "system_event" | "internal_webchat" | "heartbeat";
/** Per-turn policy for source-message reply threading. */
type ReplyThreadingPolicy = {
  /** Override implicit reply-to-current behavior for the current turn. */
  implicitCurrentMessage?: "default" | "allow" | "deny";
};
/** Action sink available for model-proposed follow-up tasks during this turn. */
type TaskSuggestionDeliveryMode = "gateway";
/** Correlates queued reply ownership transfer with later delivery drains. */
type QueuedReplyDeliveryCorrelation = {
  begin: () => (() => void) | void;
};
/**
 * Exclusive: each lifecycle is its own collect-admission identity.
 * Cancel-only: share collect identity via ownerKey (gateway chat.send).
 */
type TurnAdoptionAdmission = "exclusive" | "cancel-only";
/**
 * Canonical turn-ownership lifecycle (adopt / defer / abandon / settle).
 * Single surface for durable ingress, gateway cancel identity, and reply-lane transfer.
 */
type TurnAdoptionLifecycle = {
  /**
   * Admission isolation mode (closed). Exclusive isolates collect identity per
   * lifecycle; cancel-only shares via ownerKey. Never inferred from onAbandoned.
   * Durable ingress sets exclusive; gateway cancel identity sets cancel-only.
   */
  admission?: TurnAdoptionAdmission;
  /** Transcript branch leaf from which this turn was admitted. */
  originatingLeafEntryId?: string | null;
  onAdopted: () => void | Promise<void>;
  /** Return false to reject followup enqueue. */
  onDeferred?: () => boolean | void;
  /** Deferred turn finished without owning the reply lane. */
  onAbandoned?: () => void;
  /** Always fires when the followup ownership cycle ends (admitted or not). Gateway cleanup. */
  onSettled?: () => void;
  /** Retires cancellation ownership while retaining live identity. */
  onCancellationRetired?: () => void;
  /** Stable cancellation owner for collect-mode batches. */
  ownerKey?: string;
  abortSignal?: AbortSignal;
  /** Ephemeral fact: a direct local operator turn lost fresh cron authority when queued. */
  cronCreatorAuthorityUnavailable?: "queued-local-operator";
};
/** Partial assistant payload emitted during streaming or replacement updates. */
type PartialReplyPayload = {
  /**
   * Sanitized text, which may be an enumerable memoized getter. Content materializes on first
   * read: direct-delivery consumers pay per partial, while throttled consumers pay per flush.
   */
  text?: ReplyPayload["text"];
  mediaUrls?: ReplyPayload["mediaUrls"];
  delta?: string;
  replace?: true;
};
type ReasoningStreamPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"> & {
  requiresReasoningProgressOptIn?: boolean;
};
type ReasoningProgressPayload = {
  progressTokens: number;
};
/** Return false until the channel has accepted operator-visible progress. */
type ProgressCallbackResult = boolean | void;
/** Reply generation options shared by auto-reply, webchat, channels, and tests. */
type GetReplyOptions = {
  /** Override run id for agent events (defaults to random UUID). */
  runId?: string;
  /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string;
  /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal;
  /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[];
  /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered media facts whose model-facing text projection is already present in the prompt. */
  media?: MediaFact[];
  /** Notifies when an agent run actually starts (useful for webchat command handling). */
  onAgentRunStart?: (runId: string, executionIdentityToken?: ExecutionIdentityAdmissionToken) => void;
  /** Reports the terminal agent-run classification to the shared dispatch owner. */
  onAgentRunTerminalOutcome?: (outcome: "completed" | "failed") => void;
  /**
   * Canonical adoption lifecycle (adopted / deferred / abandoned / settled + pre-adoption abort).
   */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
  /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  /** Gateway-owned start-or-steer decision for this turn. */
  messageInjectionDisposition?: "none" | "accepted" | "rejected";
  /** Current user turn is already durable; replay it without appending another copy. */
  suppressNextUserMessagePersistence?: boolean;
  onReplyStart?: () => Promise<void> | void;
  /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void;
  /** If false, send only the initial typing signal without periodic keepalive refreshes. */
  typingKeepalive?: boolean;
  isHeartbeat?: boolean;
  /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy;
  /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean;
  /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string;
  /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string;
  /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode;
  /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number;
  /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight";
  /** If true, suppress tool error warning payloads for this run. */
  suppressToolErrorWarnings?: boolean;
  /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean;
  /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[];
  /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean;
  /** Suppress standalone tool/progress text even when verbose progress is enabled. */
  suppressToolProgressMessages?: boolean;
  /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void;
  /** Preserve source-event callback start order for stateful channel progress renderers. */
  preserveProgressCallbackStartOrder?: boolean;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningStream?: (payload: ReasoningStreamPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningProgress?: (payload: ReasoningProgressPayload) => Promise<void> | void;
  streamReasoningInNonStreamModes?: boolean;
  /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a concrete work item starts, updates, or completes. */
  onItemEvent?: (payload: {
    itemId?: string;
    toolCallId?: string;
    kind?: string;
    title?: string;
    name?: string;
    phase?: string;
    status?: string;
    summary?: string;
    progressText?: string;
    meta?: string;
    commandBearing?: boolean;
    approvalId?: string;
    approvalSlug?: string;
    suppressDurableProgress?: true;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /**
   * Called when the utility-model narration of the in-progress turn changes.
   * Providing this callback opts the channel into progress narration; core
   * only generates narration when a utility model resolves (explicit
   * config or the provider-declared default; utilityModel: "" disables).
   * An empty text clears narration; a retained model preamble still wins before
   * the channel falls back to raw tool progress.
   */
  onNarrationUpdate?: (payload: {
    text: string;
  }) => Promise<void> | void;
  /** Channel-owned final and queued-turn boundaries for the current narrator. */
  onProgressNarratorLifecycle?: (lifecycle: {
    beginTurn: () => void;
    stopTurn: () => void;
  }) => void;
  /** False while utility-model narration has no visible progress draft. */
  isProgressDraftVisible?: () => boolean;
  /**
   * Omit exec/bash command text from narration model input, mirroring the
   * channel's `streaming.progress.commandText: "status"` display policy so
   * narration never receives more command detail than the draft shows.
   */
  narrationHideCommandText?: boolean;
  /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean;
  /** Bridge typed preambles to a channel-owned progress headline without commentary. */
  progressPreambleEnabled?: boolean;
  /** Deliver durable reasoning payloads to channels that own a separate reasoning lane. */
  reasoningPayloadsEnabled?: boolean;
  /** Deliver durable commentary (💬) payloads to channels that own a separate commentary lane. */
  commentaryPayloadsEnabled?: boolean;
  /** Optional turn-frozen commentary owner; visibility is live by default.
   * With the static opt-in and this callback, core freezes, evaluates once, and snapshots. */
  shouldDeliverCommentaryPayloads?: () => boolean;
  /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    steps?: AgentPlanStep[];
    source?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when an approval becomes pending or resolves. */
  onApprovalEvent?: (payload: {
    phase?: string;
    kind?: string;
    status?: string;
    title?: string;
    itemId?: string;
    toolCallId?: string;
    approvalId?: string;
    approvalSlug?: string;
    command?: string;
    host?: string;
    reason?: string;
    scope?: "turn" | "session";
    message?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when command output streams or completes. */
  onCommandOutput?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    output?: string;
    status?: string;
    exitCode?: number | null;
    durationMs?: number;
    cwd?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a patch completes with a file summary. */
  onPatchSummary?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction completes. */
  onCompactionEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when the actual model is selected (including after fallback).
   * Use this to get model/provider/thinkLevel for responsePrefix template interpolation. */
  onModelSelected?: (ctx: ModelSelectedContext) => void;
  /**
   * Controls whether normal assistant replies are automatically delivered to
   * the source conversation. `message_tool_only` prefers message-tool visible
   * delivery and keeps normal final text, block output, and preview output
   * private unless dispatch explicitly marks a source reply as deliverable.
   */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Enables task-suggestion tools only when the initiating surface can action Gateway events. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[];
  /** Called after a queued followup owns the reply lane, before its model run starts. */
  onQueuedFollowupAdmitted?: () => Promise<void> | void;
  /** Called after an admitted queued followup finishes, including failed attempts. */
  onQueuedFollowupSettled?: () => Promise<void> | void;
  /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean;
  /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void;
  /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean;
  /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number;
  /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[];
  /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
};
//#endregion
//#region src/auto-reply/templating.d.ts
/** Valid message channels for routing. */
type OriginatingChannelType = string & {
  readonly __originatingChannelBrand?: never;
};
type MentionSource = "explicit_bot" | "subteam" | "mention_pattern" | "implicit_thread" | "command_bypass" | "none";
type InboundSourceModality = "text" | "voice" | "audio" | "image" | "video" | "document";
type StickerContextMetadata = {
  cachedDescription?: string;
  emoji?: string;
  setName?: string;
  description?: string;
  fileId?: string;
  fileUniqueId?: string;
  uniqueFileId?: string;
  isAnimated?: boolean;
  isVideo?: boolean;
} & Record<string, unknown>;
type ChannelStructuredContextEntry = {
  label: string;
  source?: string;
  type?: string;
  payload: unknown;
  /** Internal exact-id hints for canonical transcript/live-cache deduplication. */
  sessionTranscriptDedupeMessageIds?: string[];
  /** Internal visible-text hints for legacy assistant rows without transcript ids. */
  sessionTranscriptAssistantTextDedupeKeys?: string[];
};
type SessionTranscriptContext = {
  chatWindow?: boolean;
  historyLimit: number;
  beforeTimestampMs?: number;
  minTimestampMs?: number;
  senderLabels?: {
    assistant: string;
    user: string;
  };
};
/** @deprecated Use ChannelStructuredContextEntry. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
type UntrustedStructuredContextEntry = ChannelStructuredContextEntry;
/** Structured supplemental facts projected into prompt context by inbound finalization. */
type SupplementalContextFacts = {
  quote?: {
    id?: string;
    fullId?: string;
    body?: string;
    sender?: string;
    senderAllowed?: boolean;
    isExternal?: boolean;
    isQuote?: boolean;
  };
  forwarded?: {
    from?: string;
    fromType?: string;
    fromId?: string;
    date?: number;
    senderAllowed?: boolean;
  };
  thread?: {
    id?: string;
    starterBody?: string;
    historyBody?: string;
    label?: string;
    parentSessionKey?: string;
    modelParentSessionKey?: string;
    senderAllowed?: boolean;
  };
  channelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use channelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  untrustedContext?: ChannelStructuredContextEntry[];
  groupSystemPrompt?: string;
  /** Prompt-like group metadata from user-controlled sources; never enters the system prompt. */
  untrustedGroupSystemPrompt?: string;
};
/** Canonical normalized inbound text populated once by `finalizeInboundContext`. */
type CanonicalInboundText = {
  /** Clean text used for command and directive parsing. */
  commandText: string;
  /** Prompt-facing text used for the agent turn. */
  agentText: string;
  /** Normalized visible/raw inbound text before command-specific projection. */
  rawText: string;
};
/** Raw inbound message context accepted from channels before finalization. */
type MsgContext = Partial<CanonicalInboundText> & {
  Body?: string;
  InboundEventKind?: InboundEventKind;
  /**
   * Agent prompt body (may include envelope/history/context). Prefer this for prompt shaping.
   * Should use real newlines (`\n`), not escaped `\\n`.
   */
  BodyForAgent?: string;
  /**
   * Recent chat history for context (untrusted user content). Prefer passing this
   * as structured context blocks in the user prompt rather than rendering plaintext envelopes.
   */
  InboundHistory?: HistoryEntry[];
  /** Internal facts used to merge canonical transcript turns before dispatch. */
  SessionTranscriptContext?: SessionTranscriptContext;
  /**
   * @deprecated Use CommandBody.
   *
   * Raw message body without structural context (history, sender labels).
   * Legacy alias for CommandBody. Falls back to Body if not set.
   */
  RawBody?: string;
  /**
   * Prefer for command detection; RawBody is treated as legacy alias.
   */
  CommandBody?: string;
  /**
   * Command parsing body. Prefer this over CommandBody/RawBody when set.
   * Should be the "clean" text (no history/sender context).
   */
  BodyForCommands?: string;
  CommandArgs?: CommandArgs;
  From?: string;
  To?: string;
  SessionKey?: string;
  /**
   * Resolved agent scope for canonical session keys that do not encode the agent
   * id, such as selected-agent global sessions.
   */
  AgentId?: string;
  /** Effective routed DM scope, including binding overrides. */
  DmScope?: DmScope;
  /**
   * Session-like key used for runtime policy (sandbox/tool policy) when the
   * conversation key intentionally remains broader, such as a main-session DM.
   */
  RuntimePolicySessionKey?: string;
  /** Provider account id (multi-account). */
  AccountId?: string;
  ParentSessionKey?: string;
  /**
   * Session key used only for inheriting session-scoped model/provider
   * overrides. Unlike ParentSessionKey, this must not trigger transcript
   * forking or parent-session lifecycle behavior.
   */
  ModelParentSessionKey?: string;
  MessageSid?: string;
  /** Provider-specific full message id when MessageSid is a shortened alias. */
  MessageSidFull?: string;
  MessageSids?: string[];
  MessageSidFirst?: string;
  MessageSidLast?: string;
  AmbientTranscriptWatermarkKey?: string;
  AmbientTranscriptBody?: string;
  AmbientTranscriptMessageId?: string;
  AmbientTranscriptTimestampMs?: number;
  AmbientTranscriptPreviousMessageId?: string;
  AmbientTranscriptPreviousTimestampMs?: number;
  /** Per-turn reply-threading overrides. */
  ReplyThreading?: ReplyThreadingPolicy;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: ReplyToMode;
  ReplyToId?: string;
  /**
   * Root message id for thread reconstruction (used by Feishu for root_id).
   * When a message is part of a thread, this is the id of the first message.
   */
  RootMessageId?: string;
  /** Provider-specific full reply-to id when ReplyToId is a shortened alias. */
  ReplyToIdFull?: string;
  ReplyToBody?: string;
  ReplyToQuoteText?: string;
  ReplyToSender?: string;
  ReplyChain?: Array<{
    messageId?: string;
    threadId?: string;
    sender?: string;
    senderId?: string;
    senderUsername?: string;
    timestamp?: number;
    body?: string;
    isQuote?: boolean;
    mediaType?: string;
    mediaPath?: string;
    mediaRef?: string;
    replyToId?: string;
    forwardedFrom?: string;
    forwardedFromId?: string;
    forwardedFromUsername?: string;
    forwardedDate?: number;
  }>;
  ReplyToIsQuote?: boolean;
  /** Forward origin from the reply target (when reply_to_message is a forwarded message). */
  ReplyToForwardedFrom?: string;
  ReplyToForwardedFromType?: string;
  ReplyToForwardedFromId?: string;
  ReplyToForwardedFromUsername?: string;
  ReplyToForwardedFromTitle?: string;
  ReplyToForwardedDate?: number;
  ForwardedFrom?: string;
  ForwardedFromType?: string;
  ForwardedFromId?: string;
  ForwardedFromUsername?: string;
  ForwardedFromTitle?: string;
  ForwardedFromSignature?: string;
  ForwardedFromChatType?: string;
  ForwardedFromMessageId?: number;
  ForwardedDate?: number;
  ThreadStarterBody?: string;
  /** Full thread history when starting a new thread session. */
  ThreadHistoryBody?: string;
  IsFirstThreadTurn?: boolean;
  ThreadLabel?: string;
  /** @deprecated Use `media?.[0]?.path`. */
  MediaPath?: string;
  /** @deprecated Use `media?.[0]?.url`. */
  MediaUrl?: string;
  /** @deprecated Use `media?.[0]?.contentType` or `.kind`. */
  MediaType?: string;
  /** @deprecated Derive the directory from `media?.[0]?.path` at the consuming boundary. */
  MediaDir?: string;
  /** @deprecated Use `media?.map((entry) => entry.path)`. */
  MediaPaths?: string[];
  /** @deprecated Use `media?.map((entry) => entry.url)`. */
  MediaUrls?: string[];
  /** @deprecated Use `media?.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[];
  /** Ordered current-turn media facts; array position is attachment identity. */
  media?: MediaFact[];
  /** Original message modality before transcription or other media normalization. */
  SourceModality?: InboundSourceModality;
  /** @deprecated Use each media fact's `workspaceDir`. */
  MediaWorkspaceDir?: string;
  /** Attachment indexes whose audio was already transcribed before media understanding runs. */
  /** @deprecated Use each media fact's `transcribed` field. */
  MediaTranscribedIndexes?: number[];
  /**
   * Marker: skip downstream stageSandboxMedia. chat.send RPC sets this so
   * staging runs synchronously before respond() and surfaces 5xx to the
   * client; any later failure only reaches the broadcast channel.
   */
  /** @deprecated Use each media fact's `workspaceDir` or `staged` proof. */
  MediaStaged?: boolean;
  /** Telegram sticker metadata (emoji, set name, file IDs, cached description). */
  Sticker?: StickerContextMetadata;
  /** True when current-turn sticker media is present in structured facts. */
  StickerMediaIncluded?: boolean;
  /** Skip automatic understanding for the current sticker because its cached description is used. */
  SkipStickerMediaUnderstanding?: boolean;
  OutputDir?: string;
  OutputBase?: string;
  /** Remote host for SCP when media lives on a different machine (e.g., openclaw@192.168.64.3). */
  MediaRemoteHost?: string;
  Transcript?: string;
  MediaUnderstanding?: MediaUnderstandingOutput[];
  MediaUnderstandingDecisions?: MediaUnderstandingDecision[];
  LinkUnderstanding?: string[];
  Prompt?: string;
  MaxChars?: number;
  ChatType?: string;
  /** Trusted channel-configured policy for this admitted conversation turn. */
  ConversationToolPolicy?: GroupToolPolicyConfig;
  /** Human label for envelope headers (conversation label, not sender). */
  ConversationLabel?: string;
  GroupSubject?: string;
  /** Human label for channel-like group conversations (e.g. #general, #support). */
  GroupChannel?: string;
  GroupSpace?: string;
  /** Trusted provider role ids for the sender in this group turn. */
  MemberRoleIds?: string[];
  GroupMembers?: string;
  GroupSystemPrompt?: string;
  /**
   * Canonical inbound supplemental facts for new channel code. `finalizeInboundContext`
   * projects these to the existing flat reply/forward/thread/group prompt fields.
   */
  SupplementalContext?: SupplementalContextFacts;
  /** Channel-provided metadata that must not be treated as system instructions. */
  ChannelPromptContext?: string[];
  /** @deprecated Use ChannelPromptContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedContext?: string[];
  /** Structured channel metadata rendered by prompt assembly as fenced JSON. */
  ChannelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use ChannelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedStructuredContext?: UntrustedStructuredContextEntry[];
  /** System-attached provenance for the current inbound message. */
  InputProvenance?: InputProvenance;
  /** Explicit owner allowlist overrides (trusted, configuration-derived). */
  OwnerAllowFrom?: Array<string | number>;
  SenderName?: string;
  SenderId?: string;
  /** Trusted in-process creation provenance; never populated from channel payloads. */
  SessionCreation?: {
    via: SessionCreatedVia;
    actor?: SessionCreatedActor;
    sandbox?: "required";
  };
  SenderUsername?: string;
  SenderTag?: string;
  SenderE164?: string;
  SenderIsBot?: boolean;
  /** Channel-ingress fact: sender is the operator's own account (from-me). */
  SenderIsSelf?: boolean;
  Timestamp?: number;
  LocationLat?: number;
  LocationLon?: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource?: string;
  LocationIsLive?: boolean;
  LocationLivePeriodSeconds?: number;
  LocationCaption?: string;
  /** Stable identity of the provider update that carried this message. */
  ProviderUpdateId?: string;
  /** Provider update kind, for example `message` or `edited_message`. */
  ProviderUpdateKind?: string;
  /** Provider-native timestamp for the original message. */
  ProviderMessageTimestamp?: number;
  /** Provider-native timestamp for an edited message update. */
  ProviderEditTimestamp?: number;
  /** Provider label. */
  Provider?: string;
  /** Provider surface label. Prefer this over `Provider` when available. */
  Surface?: string;
  /** Platform bot username when command mentions should be normalized. */
  BotUsername?: string;
  WasMentioned?: boolean;
  /** Effective channel-owned mention policy before any plugin-binding bypass. */
  GroupRequireMention?: boolean;
  /** True when this turn explicitly mentioned the current bot target. */
  ExplicitlyMentionedBot?: boolean;
  /** Provider-native explicit user mention ids present on this turn. */
  MentionedUserIds?: string[];
  /** Provider-native explicit user-group/subteam mention ids present on this turn. */
  MentionedSubteamIds?: string[];
  /** Provider-native implicit mention wake reasons present on this turn. */
  ImplicitMentionKinds?: string[];
  /** Provider-native source that caused the current mention decision. */
  MentionSource?: MentionSource;
  CommandAuthorized?: boolean;
  CommandTurn?: CommandTurnContext;
  CommandSource?: "text" | "native";
  CommandInterpretationSuppressed?: boolean;
  CommandTargetSessionKey?: string;
  /**
   * Internal flag: command handling prepared trailing prompt text for ACP dispatch.
   * Used for `/new <prompt>` and `/reset <prompt>` on ACP-bound sessions.
   */
  AcpDispatchTailAfterReset?: boolean;
  /** Gateway client scopes when the message originates from the gateway. */
  GatewayClientScopes?: string[];
  /** Gateway client capabilities when the message originates from the gateway. */
  GatewayClientCaps?: string[];
  /** Run-scoped plugin tool bindings; never rendered into prompt text. */
  GatewayRunToolBindings?: Readonly<Record<string, unknown>>;
  /** Gateway device id allowed to review approvals initiated by this turn. */
  ApprovalReviewerDeviceId?: string;
  /** Thread identifier (Telegram topic id or Matrix thread event id). */
  MessageThreadId?: string | number;
  /** Provider-native thread target for reply delivery without making the session thread-scoped. */
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
  /** Channel-owned local conversation image reference; never rendered into prompt text. */
  ConversationAvatar?: string;
  /** Channel-owned metadata exposed to plugin hook context, not prompt text. */
  ChannelContext?: PluginHookChannelContext;
  /** Provider-native chat/conversation id used by channel plugins that expose `chat_id`. */
  ChatId?: string;
  /** Stable provider-native direct-peer id when a DM room/user mapping must survive later writes. */
  NativeDirectUserId?: string;
  /** Telegram forum supergroup marker. */
  IsForum?: boolean;
  /** Human-readable Telegram forum topic name (cached from service messages). */
  TopicName?: string;
  /** Warning: DM has topics enabled but this message is not in a topic. */
  TopicRequiredButMissing?: boolean;
  /**
   * Originating channel for reply routing.
   * When set, replies should be routed back to this provider
   * instead of using lastChannel from the session.
   */
  OriginatingChannel?: OriginatingChannelType;
  /**
   * Originating destination for reply routing.
   * The chat/channel/user ID where the reply should be sent.
   */
  OriginatingTo?: string;
  /**
   * True when the current turn intentionally requested external delivery to
   * OriginatingChannel/OriginatingTo, rather than inheriting stale session route metadata.
   */
  ExplicitDeliverRoute?: boolean;
  /**
   * Internal proof that the channel ingress owner admitted this sender/event.
   * Correlation interceptors must fail closed when this proof is absent.
   */
  InboundAccessAuthorized?: boolean;
  /** Internal marker that channel ingress authoritatively observed route-context facts. */
  ConversationRouteContextObserved?: boolean;
  /** Canonical peer used by route selection; delivery targets may use a different namespace. */
  ConversationRoutePeerId?: string;
  /**
   * Internal flag for channels that emit message_received through a channel-specific
   * privacy gate before entering the shared reply dispatcher.
   */
  SuppressMessageReceivedHooks?: boolean;
  /**
   * Provider-specific parent conversation id for threaded contexts.
   * For Discord threads, this is the parent channel id.
   */
  ThreadParentId?: string;
  /**
   * Messages from hooks to be included in the response.
   * Used for hook confirmation messages like "Session context saved to memory".
   */
  HookMessages?: string[];
};
type FinalizedMsgContext = Omit<MsgContext, "CommandAuthorized"> & {
  /**
   * Always set by finalizeInboundContext().
   * Default-deny: missing/undefined becomes false.
   */
  CommandAuthorized: boolean;
  /**
   * Populated by finalizeInboundContext(); optional for public SDK
   * compatibility with existing plugin-constructed finalized contexts.
   */
  CommandTurn?: CommandTurnContext;
};
type RuntimeMediaContextKey = "MediaPath" | "MediaUrl" | "MediaType" | "MediaDir" | "MediaPaths" | "MediaUrls" | "MediaTypes" | "MediaWorkspaceDir" | "MediaTranscribedIndexes" | "MediaStaged";
/** Internal inbound context; legacy media fields exist only on the shipped SDK adapter. */
type RuntimeMsgContext = Omit<MsgContext, RuntimeMediaContextKey>;
type FinalizedRuntimeMsgContext = Omit<RuntimeMsgContext, "CommandAuthorized" | keyof CanonicalInboundText> & CanonicalInboundText & {
  CommandAuthorized: boolean;
  CommandTurn?: CommandTurnContext;
};
//#endregion
//#region src/media/load-options.d.ts
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile;
  /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
};
//#endregion
//#region src/infra/outbound/send-deps.d.ts
/**
 * Dynamic bag of per-channel send functions, keyed by channel ID.
 * Each outbound adapter resolves its own function from this record and
 * falls back to a direct import when the key is absent.
 */
type OutboundSendDeps = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/polls.d.ts
type PollInput = {
  question: string;
  options: string[];
  maxSelections?: number;
  /**
   * Poll duration in seconds.
   * Channel-specific limits apply in each owning plugin.
   */
  durationSeconds?: number;
  /**
   * Poll duration in hours.
   * Used by channels that model duration in hours.
   */
  durationHours?: number;
};
//#endregion
//#region src/channels/message/types.d.ts
type OutboundReplyFacts = Readonly<{
  source: "explicit";
  replyToId: string;
}> | Readonly<{
  source: "implicit";
  replyToId: string;
  mode: "first" | "all";
}>;
/** Capability names a channel must advertise before core can rely on durable final delivery. */
declare const durableFinalDeliveryCapabilities: readonly ["text", "media", "poll", "payload", "silent", "replyTo", "thread", "nativeQuote", "messageSendingHooks", "batch", "reconcileUnknownSend", "afterSendSuccess", "afterCommit"];
/** Durable final delivery capability key understood by message-channel adapters. */
type DurableFinalDeliveryCapability = (typeof durableFinalDeliveryCapabilities)[number];
/** Capability map used by adapters to declare which final-send guarantees they support. */
type DurableFinalDeliveryRequirementMap = Partial<Record<DurableFinalDeliveryCapability, boolean>>;
/** Raw platform result shape normalized into a message receipt. */
type MessageReceiptSourceResult = {
  channel?: string;
  messageId?: string;
  target?: {
    kind: "chat" | "channel" | "room" | "conversation";
    id: string;
  };
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  toJid?: string;
  pollId?: string;
  timestamp?: number;
  meta?: Record<string, unknown>;
};
/** Logical part kind for multi-part rendered messages. */
type MessageReceiptPartKind = "text" | "media" | "voice" | "poll" | "card" | "preview" | "unknown";
/** One platform message produced by a logical outbound send. */
type MessageReceiptPart = {
  platformMessageId: string;
  kind: MessageReceiptPartKind;
  index: number;
  threadId?: string;
  replyToId?: string;
  raw?: MessageReceiptSourceResult;
};
/** Normalized receipt for all platform messages that make up a logical send. */
type MessageReceipt = {
  primaryPlatformMessageId?: string;
  platformMessageIds: string[];
  parts: MessageReceiptPart[];
  threadId?: string;
  replyToId?: string;
  editToken?: string;
  deleteToken?: string;
  sentAt: number;
  raw?: readonly MessageReceiptSourceResult[];
};
/** Render-plan item category used before adapter-specific send execution. */
type RenderedMessageBatchPlanKind = "text" | "media" | "voice" | "presentation" | "interactive" | "channelData" | "empty";
/** Render plan for a single reply payload after text/media/presentation splitting. */
type RenderedMessageBatchPlanItem = {
  index: number;
  kinds: readonly RenderedMessageBatchPlanKind[];
  text?: string;
  mediaUrls: readonly string[];
  audioAsVoice?: boolean;
  presentationBlockCount?: number;
  hasInteractive?: boolean;
  hasChannelData?: boolean;
};
/** Aggregate render plan for a batch of reply payloads. */
type RenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};
/** Common text-send context shared by text, media, payload, and poll adapter calls. */
type ChannelMessageSendTextContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  to: string;
  text: string;
  accountId?: string | null;
  deps?: OutboundSendDeps;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
  signal?: AbortSignal;
  gatewayClientScopes?: readonly string[];
  /** @internal Opaque durable intent id for exact provider-side send reconciliation. */
  deliveryQueueId?: string;
  /** @internal Stable platform-send index within one durable payload. */
  deliveryPartIndex?: number;
  /** @internal Exact platform-send count within one durable payload. */
  deliveryPartCount?: number;
  /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string;
  /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** @internal Report each completed platform sub-send before another fallible step. */
  onDeliveryResult?: (result: ChannelMessageSendResult) => Promise<void> | void;
};
/** Media send context with validated access hooks and media presentation hints. */
type ChannelMessageSendMediaContext<TConfig = OpenClawConfig> = ChannelMessageSendTextContext<TConfig> & {
  mediaUrl: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  audioAsVoice?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean;
};
/** Rich reply payload send context used when adapters can consume structured payloads. */
type ChannelMessageSendPayloadContext<TConfig = OpenClawConfig> = ChannelMessageSendTextContext<TConfig> & {
  payload: ReplyPayload;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  audioAsVoice?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean;
};
/** Poll send context; thread ids stay string-like because poll APIs do not accept numeric ids. */
type ChannelMessageSendPollContext<TConfig = OpenClawConfig> = Omit<ChannelMessageSendTextContext<TConfig>, "text" | "threadId"> & {
  poll: PollInput;
  threadId?: string | null;
  isAnonymous?: boolean;
};
/** Adapter send result normalized to a receipt plus optional legacy message id. */
type ChannelMessageSendResult = {
  receipt: MessageReceipt;
  messageId?: string;
  target?: MessageReceiptSourceResult["target"];
};
/** Concrete send shapes an adapter can reconcile after an unknown platform outcome. */
declare const unknownSendReconciliationKinds: readonly ["text", "media", "payload", "poll", "batch"];
type UnknownSendReconciliationKind = (typeof unknownSendReconciliationKinds)[number];
/** Send-attempt context tagged with the adapter method core is about to call. */
type ChannelMessageSendAttemptContext<TConfig = OpenClawConfig> = (ChannelMessageSendTextContext<TConfig> & {
  kind: "text";
}) | (ChannelMessageSendMediaContext<TConfig> & {
  kind: "media";
}) | (ChannelMessageSendPayloadContext<TConfig> & {
  kind: "payload";
}) | (ChannelMessageSendPollContext<TConfig> & {
  kind: "poll";
});
/** Lifecycle context emitted after an adapter send succeeds but before commit finishes. */
type ChannelMessageSendSuccessContext<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = ChannelMessageSendAttemptContext<TConfig> & {
  result: TSendResult;
  attemptToken?: unknown;
};
/** Lifecycle context emitted after an adapter send throws or rejects. */
type ChannelMessageSendFailureContext<TConfig = OpenClawConfig> = ChannelMessageSendAttemptContext<TConfig> & {
  error: unknown;
  attemptToken?: unknown;
};
/** Lifecycle context emitted when a successful send is being durably committed. */
type ChannelMessageSendCommitContext<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = ChannelMessageSendSuccessContext<TConfig, TSendResult>;
/** Durable queue context used to reconcile a send whose platform state is unknown. */
type ChannelMessageUnknownSendContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  queueId: string;
  channel: string;
  to: string;
  accountId?: string | null;
  enqueuedAt: number;
  retryCount: number;
  platformSendStartedAt?: number;
  /** Canonical reply target persisted after hooks and before platform I/O. */
  effectiveReplyToId?: string | null;
  payloads: readonly ReplyPayload[];
  renderedBatchPlan?: RenderedMessageBatchPlan;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
};
/** Adapter verdict for whether an unknown queued send reached the platform. */
type ChannelMessageUnknownSendReconciliationResult = {
  status: "sent";
  receipt: MessageReceipt;
  messageId?: string;
} | {
  status: "not_sent";
} | {
  status: "unresolved";
  error?: string;
  retryable?: boolean;
};
/** Provider decision made before core persists or replays a deferred delivery. */
type ChannelMessageDeferredDeliveryAdmissionResult = {
  status: "allowed";
} | {
  status: "permanent_rejection";
  reason: string;
};
/** Minimal context available at deferred-delivery admission boundaries. */
type ChannelMessageDeferredDeliveryAdmissionContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  channel: string;
  to: string;
  accountId?: string | null;
  phase: "live" | "recovery";
};
/** Optional hooks around adapter send attempts, platform success/failure, and commit. */
type ChannelMessageSendLifecycleAdapter<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  beforeSendAttempt?: (ctx: ChannelMessageSendAttemptContext<TConfig>) => unknown;
  afterSendSuccess?: (ctx: ChannelMessageSendSuccessContext<TConfig, TSendResult>) => Promise<void> | void;
  afterSendFailure?: (ctx: ChannelMessageSendFailureContext<TConfig>) => Promise<void> | void;
  afterCommit?: (ctx: ChannelMessageSendCommitContext<TConfig, TSendResult>) => Promise<void> | void;
};
/** Adapter methods a message channel can implement for outbound text/media/payload/poll sends. */
type ChannelMessageSendAdapter<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  text?: (ctx: ChannelMessageSendTextContext<TConfig>) => Promise<TSendResult>;
  media?: (ctx: ChannelMessageSendMediaContext<TConfig>) => Promise<TSendResult>;
  payload?: (ctx: ChannelMessageSendPayloadContext<TConfig>) => Promise<TSendResult>;
  poll?: (ctx: ChannelMessageSendPollContext<TConfig>) => Promise<TSendResult>;
  lifecycle?: ChannelMessageSendLifecycleAdapter<TConfig, TSendResult>;
};
/** Durable final-delivery extension for queue reconciliation and capability declaration. */
type ChannelMessageDurableFinalAdapter = {
  capabilities?: DurableFinalDeliveryRequirementMap;
  /** Opt into provider reconciliation for ordinary single-payload queued sends. */
  automaticUnknownSendReconciliation?: boolean;
  /**
   * Synchronous provider admission before a durable intent is created or replayed.
   * Providers must not perform I/O from this hook.
   */
  admitDeferredDelivery?: (ctx: ChannelMessageDeferredDeliveryAdmissionContext) => ChannelMessageDeferredDeliveryAdmissionResult;
  /** Send shapes for which reconciliation can prove the complete durable intent. */
  reconcileUnknownSendKinds?: Partial<Record<UnknownSendReconciliationKind, boolean>>;
  reconcileUnknownSend?: (ctx: ChannelMessageUnknownSendContext) => Promise<ChannelMessageUnknownSendReconciliationResult | null> | ChannelMessageUnknownSendReconciliationResult | null;
  /** Cleanup after core authoritatively retires an ambiguous send as failed. */
  afterUnknownSendTerminal?: (ctx: ChannelMessageUnknownSendContext) => Promise<void> | void;
};
/** Live-message feature key declared by adapters that support preview or streaming behavior. */
type ChannelMessageLiveCapability = "draftPreview" | "previewFinalization" | "progressUpdates" | "nativeStreaming" | "quietFinalization";
/** Capability keys for turning a preview into a final platform message. */
declare const livePreviewFinalizerCapabilities: readonly ["finalEdit", "normalFallback", "discardPending", "previewReceipt", "retainOnAmbiguousFailure"];
/** Finalizer capability key understood by live-message adapters. */
type LivePreviewFinalizerCapability = (typeof livePreviewFinalizerCapabilities)[number];
/** Capability map for preview finalization behavior. */
type LivePreviewFinalizerCapabilityMap = Partial<Record<LivePreviewFinalizerCapability, boolean>>;
/** Adapter shape for finalizing live previews. */
type ChannelMessageLiveFinalizerAdapterShape = {
  capabilities?: LivePreviewFinalizerCapabilityMap;
};
/** Adapter shape for live preview and streaming message features. */
type ChannelMessageLiveAdapterShape = {
  capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
  finalizer?: ChannelMessageLiveFinalizerAdapterShape;
};
/** Receive acknowledgement timing policy for durable inbound message records. */
type ChannelMessageReceiveAckPolicy = "after_receive_record" | "after_agent_dispatch" | "after_durable_send" | "manual";
/** Adapter receive shape for default and supported inbound acknowledgement policies. */
type ChannelMessageReceiveAdapterShape = {
  defaultAckPolicy?: ChannelMessageReceiveAckPolicy;
  supportedAckPolicies?: readonly ChannelMessageReceiveAckPolicy[];
};
/** Full message adapter shape composed from send, durable-final, live, and receive facets. */
type ChannelMessageAdapterShape<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  id?: string;
  durableFinal?: ChannelMessageDurableFinalAdapter;
  send?: ChannelMessageSendAdapter<TConfig, TSendResult>;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};
//#endregion
//#region src/channels/plugins/conversation-read-origin.d.ts
/**
 * Server-owned origin for one tool or message-action invocation.
 *
 * Missing and unknown values must remain delegated; callers must never derive
 * this from model arguments, provider parameters, config, or persisted state.
 */
type ConversationReadInvocationOrigin = "delegated" | "direct-operator";
//#endregion
//#region src/channels/plugins/message-capabilities.d.ts
/**
 * Channel message capabilities advertised through plugin discovery hooks.
 */
declare const CHANNEL_MESSAGE_CAPABILITIES: readonly ["presentation", "delivery-pin"];
/**
 * Message capability union derived from the canonical capability list.
 */
type ChannelMessageCapability = (typeof CHANNEL_MESSAGE_CAPABILITIES)[number];
//#endregion
//#region src/channels/plugins/legacy-state-migration.types.d.ts
type ChannelLegacyStateMigrationPlan = {
  kind: "copy" | "move";
  label: string;
  sourcePath: string;
  targetPath: string;
} | {
  kind: "plugin-state-import";
  label: string;
  sourcePath: string;
  targetPath: string;
  pluginId: string;
  namespace: string;
  maxEntries: number;
  defaultTtlMs?: number;
  scopeKey: string;
  stateDir?: string;
  cleanupSource?: "rename" | "remove";
  cleanupWhenEmpty?: boolean;
  /** Deletes a non-file legacy source (e.g. plugin-state rows) once all entries are covered. */
  removeSource?: () => void | Promise<void>;
  preview?: string;
  shouldReplaceExistingEntry?: (params: {
    key: string;
    existingValue: unknown;
    incomingValue: unknown;
  }) => boolean | Promise<boolean>;
  /**
   * `timestamp` (epoch ms) and `ttlMs` order entries newest-first when capacity forces a
   * partial import; `timestamp` is also persisted as the migrated row's creation time so
   * cap eviction keeps treating imported rows as old as their legacy source.
   */
  readEntries: () => Array<{
    key: string;
    value: unknown;
    ttlMs?: number;
    timestamp?: number;
  }> | Promise<Array<{
    key: string;
    value: unknown;
    ttlMs?: number;
    timestamp?: number;
  }>>;
};
//#endregion
//#region src/channels/plugins/types.core.d.ts
type ChannelExposure = {
  configured?: boolean;
  setup?: boolean;
  docs?: boolean;
};
type ChannelOutboundTargetMode = "explicit" | "implicit" | "heartbeat";
/** Agent tool registered by a channel plugin. */
type ChannelAgentTool = AgentTool;
/** Lazy agent-tool factory used when tool availability depends on config. */
type ChannelAgentToolFactory = (params: {
  cfg?: OpenClawConfig;
}) => ChannelAgentTool[];
/**
 * Discovery-time inputs passed to channel action adapters when the core is
 * asking what an agent should be allowed to see. This is intentionally
 * smaller than execution context: it carries routing/account scope, but no
 * tool params or runtime handles.
 */
type ChannelMessageActionDiscoveryContext = {
  cfg: OpenClawConfig;
  currentChannelId?: string | null;
  currentChannelProvider?: string | null;
  currentThreadTs?: string | null;
  currentMessageId?: string | number | null;
  accountId?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  agentId?: string | null;
  requesterSenderId?: string | null;
  senderIsOwner?: boolean;
};
/**
 * Plugin-owned schema fragments for the shared `message` tool.
 * `current-channel` means expose the fields only when that provider is the
 * active runtime channel. `all-configured` keeps the fields visible even while
 * another configured channel is active, which is useful for cross-channel
 * sends from cron or isolated agents.
 */
type ChannelMessageToolSchemaContribution = {
  properties: Record<string, TSchema>;
  /**
   * Actions whose validation depends on this schema fragment. Cross-channel
   * discovery can hide only these actions when the fragment is current-channel
   * scoped. Omit to keep the legacy conservative behavior.
   */
  actions?: readonly ChannelMessageActionName[] | null;
  visibility?: "current-channel" | "all-configured";
};
type ChannelMessageToolMediaSourceParams = readonly string[] | Partial<Record<ChannelMessageActionName, readonly string[]>>;
type ChannelMessageToolDiscovery = {
  actions?: readonly ChannelMessageActionName[] | null;
  capabilities?: readonly ChannelMessageCapability[] | null;
  schema?: ChannelMessageToolSchemaContribution | ChannelMessageToolSchemaContribution[] | null;
  /**
   * Plugin-owned message-tool params that carry media sources.
   * Core uses this to derive sandbox path normalization and host media-access
   * hints without hardcoding plugin-specific param names. Prefer scoping keys
   * by action so unrelated actions do not inherit another action's media args.
   */
  mediaSourceParams?: ChannelMessageToolMediaSourceParams | null;
};
type ChannelStatusIssue = {
  channel: ChannelId;
  accountId: string;
  kind: "intent" | "permissions" | "config" | "auth" | "runtime";
  message: string;
  fix?: string;
};
type ChannelAccountState = "linked" | "not linked" | "configured" | "not configured" | "enabled" | "disabled";
type ChannelHeartbeatDeps = {
  webAuthExists?: () => Promise<boolean>;
  hasActiveWebListener?: (accountId?: string) => boolean;
};
/** User-facing metadata used in docs, pickers, and setup surfaces. */
type ChannelMeta = {
  id: ChannelId;
  label: string;
  selectionLabel: string;
  docsPath: string;
  docsLabel?: string;
  blurb: string;
  order?: number;
  aliases?: readonly string[];
  selectionDocsPrefix?: string;
  selectionDocsOmitLabel?: boolean;
  selectionExtras?: readonly string[];
  detailLabel?: string;
  systemImage?: string;
  markdownCapable?: boolean;
  exposure?: ChannelExposure;
  quickstartAllowFrom?: boolean;
  forceAccountBinding?: boolean;
  preferSessionLookupForAnnounceTarget?: boolean;
  preferOver?: readonly string[];
};
/** Snapshot row returned by channel status and lifecycle surfaces. */
type ChannelAccountSnapshot = {
  accountId: string;
  name?: string;
  enabled?: boolean;
  configured?: boolean;
  statusState?: string;
  linked?: boolean;
  running?: boolean;
  connected?: boolean;
  restartPending?: boolean;
  reconnectAttempts?: number;
  lastConnectedAt?: number | null;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | null;
  lastMessageAt?: number | null;
  lastEventAt?: number | null;
  lastTransportActivityAt?: number | null;
  stateReason?: string;
  lastError?: string | null;
  /**
   * Legacy channel-authored health label; channel plugins should publish `lifecycle` instead.
   * Core-derived policy writes remain supported. There is no removal date; removal awaits
   * external plugin adoption.
   */
  healthState?: string;
  /**
   * Recorded account lifecycle, independent of inferred transport health.
   * Optional so channels that never publish lifecycle remain unaffected.
   */
  lifecycle?: "starting" | "ready" | "recovering" | "blocked" | "stopped";
  /**
   * Inbound admission, which is a different failure domain from `connected`.
   * Optional-`true` on purpose: there is no `false` to mistake for "unknown",
   * so the 20+ channels that never report ingress at all stay unaffected.
   */
  ingressUnavailable?: true;
  terminalDisconnect?: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
  mode?: string;
  dmPolicy?: string;
  allowFrom?: string[];
  tokenSource?: string;
  botTokenSource?: string;
  appTokenSource?: string;
  userTokenSource?: string;
  signingSecretSource?: string;
  tokenStatus?: string;
  botTokenStatus?: string;
  appTokenStatus?: string;
  signingSecretStatus?: string;
  userTokenStatus?: string;
  identity?: string;
  credentialSource?: string;
  secretSource?: string;
  audienceType?: string;
  audience?: string;
  webhookPath?: string;
  webhookUrl?: string;
  baseUrl?: string;
  allowUnmentionedGroups?: boolean;
  cliPath?: string | null;
  dbPath?: string | null;
  port?: number | null;
  probe?: unknown;
  lastProbeAt?: number | null;
  audit?: unknown;
  application?: unknown;
  bot?: unknown;
  publicKey?: string | null;
  profile?: unknown;
  channelAccessToken?: string;
  channelSecret?: string;
};
type ChannelLogSink = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  debug?: (msg: string) => void;
};
type ChannelGroupContext = {
  cfg: OpenClawConfig;
  groupId?: string | null;
  /** Human label for channel-like group conversations (e.g. #general). */
  groupChannel?: string | null;
  groupSpace?: string | null;
  accountId?: string | null;
  /** Trusted host instruction to ignore toolsBySender for non-ingress work. */
  senderPolicyMode?: "always" | "never";
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
};
/** TTS voice delivery behavior advertised by a channel plugin. */
/**
 * Container tokens (file-extension shape, no leading dot) that the host
 * TTS pipeline knows how to pre-transcode synthesized audio into.
 * Channels that benefit from a specific container — currently only
 * iMessage, which needs Apple's native voice-memo CAF descriptor — name
 * one here. Adding a new entry requires extending the host transcoder
 * recipe table in lockstep so a typed declaration cannot silently no-op.
 */
type PreferredAudioFileFormat = "caf";
type ChannelTtsVoiceDeliveryCapabilities = {
  synthesisTarget: "audio-file" | "voice-note";
  transcodesAudio?: boolean;
  audioFileFormats?: readonly string[];
  /** Voice notes can carry the final reply text as a visible caption. */
  captionedFinalText?: boolean;
  /**
   * Optional preferred audio container the channel wants for voice-memo
   * delivery. When set and the host can transcode (e.g. `afconvert` on
   * macOS), the TTS pipeline pre-encodes synthesized audio to this format
   * before handing it to the channel. Useful for channels (such as
   * iMessage) whose downstream attempts its own container conversion
   * that races against the upload write and fails.
   */
  preferAudioFileFormat?: PreferredAudioFileFormat;
};
/** Static capability flags advertised by a channel plugin. */
type ChannelCapabilities = {
  chatTypes: Array<ChatType | "thread">;
  polls?: boolean;
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  effects?: boolean;
  groupManagement?: boolean;
  threads?: boolean;
  media?: boolean;
  tts?: {
    voice?: ChannelTtsVoiceDeliveryCapabilities;
  };
  nativeCommands?: boolean;
  blockStreaming?: boolean;
};
type ChannelSecurityDmPolicy = {
  policy: string;
  allowFrom?: Array<string | number> | null;
  policyPath?: string;
  allowFromPath: string;
  approveHint: string;
  normalizeEntry?: (raw: string) => string;
};
type ChannelSecurityContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  account: ResolvedAccount;
};
type ChannelMentionAdapter = {
  stripRegexes?: (params: {
    ctx: MsgContext;
    cfg: OpenClawConfig | undefined;
    agentId?: string;
  }) => RegExp[];
  stripPatterns?: (params: {
    ctx: MsgContext;
    cfg: OpenClawConfig | undefined;
    agentId?: string;
  }) => string[];
  stripMentions?: (params: {
    text: string;
    ctx: MsgContext;
    cfg: OpenClawConfig | undefined;
    agentId?: string;
  }) => string;
};
type ChannelStreamingAdapter = {
  blockStreamingCoalesceDefaults?: {
    minChars: number;
    idleMs: number;
  };
};
type ChannelCrossContextPresentationFactory = (params: {
  originLabel: string;
  message: string;
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => MessagePresentation;
type ChannelReplyTransport = {
  replyToId?: string | null;
  threadId?: string | number | null;
};
type ChannelFocusedBindingContext = {
  conversationId: string;
  parentConversationId?: string;
  placement: "current" | "child";
  labelNoun: string;
};
type ChannelOutboundSessionRoute = {
  sessionKey: string;
  baseSessionKey: string;
  /** Route authority for explicit recipient session selection. */
  recipientSessionExact?: boolean | "direct-alias" | "delivery-identity";
  peer: {
    kind: ChatType;
    id: string;
  };
  chatType: "direct" | "group" | "channel";
  from: string;
  to: string;
  threadId?: string | number;
};
type ChannelThreadingAdapter = {
  /**
   * Where the transport keeps thread identity.
   * "address" (default): the thread is part of the routing address (own channel id, topic id
   * in the target tuple), fully known before send.
   * "message": thread identity lives on a message (e.g. Slack thread_ts) — replying to a
   * message enters its thread, and routes can discover a session-scoping thread only after
   * target lookup.
   */
  threadAddressing?: "address" | "message";
  matchesToolContextTarget?: (params: {
    target: string;
    toolContext: ChannelThreadingToolContext;
  }) => boolean;
  resolveReplyToMode?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    chatType?: string | null;
  }) => "off" | "first" | "all" | "batched";
  /**
   * When replyToMode is "off", allow explicit reply tags/directives to keep replyToId.
   *
   * Default in shared reply flow: true for known providers; per-channel opt-out supported.
   */
  allowExplicitReplyTagsWhenOff?: boolean;
  /**
   * @deprecated Use allowExplicitReplyTagsWhenOff.
   *
   * Deprecated alias for allowExplicitReplyTagsWhenOff.
   * Kept for compatibility with older plugin surfaces.
   */
  allowTagsWhenOff?: boolean;
  buildToolContext?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    context: ChannelThreadingContext;
    hasRepliedRef?: {
      value: boolean;
    };
  }) => ChannelThreadingToolContext | undefined;
  resolveAutoThreadId?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    to: string;
    toolContext?: ChannelThreadingToolContext;
    replyToId?: string | null;
  }) => string | undefined;
  resolveCurrentChannelId?: (params: {
    to: string;
    threadId?: string | number | null;
  }) => string | undefined;
  resolveReplyTransport?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    threadId?: string | number | null;
    replyToId?: string | null;
    /** True when replyToId came from an explicit payload target or reply tag. */
    replyToIsExplicit?: boolean;
    replyDelivery?: ReplyDeliveryContext;
  }) => ChannelReplyTransport | null;
  resolveFocusedBinding?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    context: ChannelThreadingContext;
  }) => ChannelFocusedBindingContext | null;
};
type ChannelThreadingContext = {
  Channel?: string;
  From?: string;
  To?: string;
  ChatType?: string;
  CurrentMessageId?: string | number;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: MsgContext["ReplyToMode"];
  ReplyToId?: string;
  ReplyToIdFull?: string;
  ThreadLabel?: string;
  MessageThreadId?: string | number;
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
};
type ChannelThreadingToolContext = {
  currentChannelId?: string;
  /** Trusted normalized conversation kind for the active inbound turn. */
  currentChatType?: ChatType;
  /** Routable messaging target when it differs from the platform-native channel id. */
  currentMessagingTarget?: string;
  currentGraphChannelId?: string;
  currentChannelProvider?: ChannelId;
  currentThreadTs?: string;
  currentMessageId?: string | number;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  };
  /** True when posting at the parent conversation root would leak a thread-originated reply. */
  sameChannelThreadRequired?: boolean;
  /**
   * When true, skip cross-context decoration (e.g., "[from X]" prefix).
   * Use this for direct tool invocations where the agent is composing a new message,
   * not forwarding/relaying a message from another conversation.
   */
  skipCrossContextDecoration?: boolean;
};
/** Channel-owned messaging helpers for target parsing, routing, and payload shaping. */
type ChannelMessagingAdapter = {
  /**
   * Provider prefixes accepted in explicit targets, including aliases not used
   * as channel-selection aliases. Core uses these to reject cross-channel
   * targets before plugin-specific normalization.
   */
  targetPrefixes?: readonly string[];
  /** Re-resolve the current owner when channel behavior exceeds generic bindings. */
  resolveConversationRouteOwner?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    conversation: {
      kind: "direct" | "group" | "channel";
      peerId: string;
      /** Canonical delivery target when it differs from the routing peer. */
      target?: string;
      threadId?: string;
      nativeChannelId?: string;
      context?: {
        parentPeerId?: string;
        guildId?: string;
        teamId?: string;
        memberRoleIds?: string[];
      };
    };
  }) => {
    kind: "agent";
    agentId: string;
  } | {
    kind: "plugin";
    pluginId: string;
    fallbackAgentId: string;
  } | {
    kind: "unavailable";
  } | null | undefined;
  /** DM targets rebuilt from session keys require an explicit `user:` kind prefix. */
  directTargetStyle?: "user-prefixed";
  /** Equality rule for ids carried by prefixed outbound targets. */
  targetIdComparison?: "case-sensitive" | "lowercase";
  /** Bare numeric conversation/topic shorthand is valid for this channel. */
  numericTopicShorthand?: true;
  normalizeTarget?: (raw: string) => string | undefined;
  defaultMarkdownTableMode?: MarkdownTableMode;
  normalizeExplicitSessionKey?: (params: {
    sessionKey: string;
    ctx: MsgContext;
  }) => string | undefined;
  deriveLegacySessionChatType?: (sessionKey: string) => "direct" | "group" | "channel" | undefined;
  isLegacyGroupSessionKey?: (key: string) => boolean;
  canonicalizeLegacySessionKey?: (params: {
    key: string;
    agentId: string;
  }) => string | null | undefined;
  resolveLegacyGroupSessionKey?: (ctx: MsgContext) => {
    key: string;
    channel: string;
    id: string;
    chatType: "group" | "channel";
  } | null;
  resolveInboundAttachmentRoots?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[];
  resolveRemoteInboundAttachmentRoots?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[];
  /**
   * Bundled plugins that need inbound conversation resolution before runtime
   * bootstrap can mirror it through a top-level `thread-binding-api.ts` surface.
   */
  resolveInboundConversation?: (params: {
    from?: string;
    to?: string;
    conversationId?: string;
    threadId?: string | number;
    threadParentId?: string | number;
    isGroup: boolean;
  }) => {
    conversationId?: string;
    parentConversationId?: string;
  } | null;
  resolveDeliveryTarget?: (params: {
    conversationId: string;
    parentConversationId?: string;
  }) => {
    to?: string;
    threadId?: string;
  } | null;
  /**
   * Canonical plugin-owned session conversation grammar.
   * Use this when the provider encodes thread or scoped-conversation semantics
   * inside `rawId` (for example Telegram topics or Feishu sender scopes).
   * Return `baseConversationId` and `parentConversationCandidates` here when
   * you can so parsing and inheritance stay in one place.
   * `parentConversationCandidates`, when present, should be ordered from the
   * narrowest parent to the broadest/base conversation.
   * Bundled plugins that need the same grammar before runtime bootstrap can
   * mirror this contract through a top-level `session-key-api.ts` surface.
   */
  resolveSessionConversation?: (params: {
    kind: "group" | "channel";
    rawId: string;
  }) => {
    id: string;
    threadId?: string | null;
    baseConversationId?: string | null;
    parentConversationCandidates?: string[];
  } | null;
  /**
   * @deprecated Return parentConversationCandidates from resolveSessionConversation.
   *
   * Legacy compatibility hook for parent fallbacks when a plugin does not need
   * to customize `id` or `threadId`. Core only uses this when
   * `resolveSessionConversation(...)` does not return
   * `parentConversationCandidates`.
   */
  resolveParentConversationCandidates?: (params: {
    kind: "group" | "channel";
    rawId: string;
  }) => string[] | null;
  resolveSessionTarget?: (params: {
    kind: "group" | "channel";
    id: string;
    threadId?: string | null;
  }) => string | undefined;
  /**
   * Lightweight chat-type inference used before directory lookup so plugins can
   * steer peer-vs-group resolution without reimplementing host search flow.
   */
  inferTargetChatType?: (params: {
    to: string;
  }) => ChatType | undefined;
  /**
   * Preserve the session thread/topic id for heartbeat replies when that thread
   * is part of the destination identity, not a transient reply thread.
   */
  preserveHeartbeatThreadIdForGroupRoute?: boolean;
  buildCrossContextPresentation?: ChannelCrossContextPresentationFactory;
  transformReplyPayload?: (params: {
    payload: ReplyPayload;
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => ReplyPayload | null;
  hasStructuredReplyPayload?: (params: {
    payload: ReplyPayload;
  }) => boolean;
  targetResolver?: {
    looksLikeId?: (raw: string, normalized?: string) => boolean;
    hint?: string;
    /** Bare words that are command/session references for this channel, not literal destinations. */
    reservedLiterals?: readonly string[];
    /**
     * Plugin-owned fallback for explicit/native targets or post-directory-miss
     * resolution. This should complement directory lookup, not duplicate it.
     */
    resolveTarget?: (params: {
      cfg: OpenClawConfig;
      accountId?: string | null;
      input: string;
      normalized: string;
      preferredKind?: ChannelDirectoryEntryKind | "channel";
    }) => Promise<{
      to: string;
      kind: ChannelDirectoryEntryKind | "channel";
      display?: string;
      source?: "normalized" | "directory";
    } | null>;
  };
  formatTargetDisplay?: (params: {
    target: string;
    display?: string;
    kind?: ChannelDirectoryEntryKind;
  }) => string;
  /**
   * Provider-specific session-route builder used after target resolution.
   * Keep session-key orchestration in core and channel-native routing rules here.
   * Set `recipientSessionExact` to true only when the target maps unambiguously
   * to the same canonical session that inbound delivery uses. `direct-alias`
   * may be used when only the direct chat kind is authoritative.
   * `delivery-identity` requires a stable outbound-only recipient identity and
   * a provider-keyed session that stays isolated from the agent main session.
   */
  resolveOutboundSessionRoute?: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    accountId?: string | null;
    target: string;
    currentSessionKey?: string;
    resolvedTarget?: {
      to: string;
      kind: ChannelDirectoryEntryKind | "channel";
      display?: string;
      source: "normalized" | "directory";
    };
    replyToId?: string | null;
    threadId?: string | number | null;
  }) => ChannelOutboundSessionRoute | Promise<ChannelOutboundSessionRoute | null> | null;
};
type ChannelAgentPromptAdapter = {
  messageToolHints?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[];
  messageToolCapabilities?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[] | undefined;
  inboundFormattingHints?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    text_markup: string;
    rules: string[];
  } | undefined;
  reactionGuidance?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    level: "minimal" | "extensive";
    channelLabel?: string;
  } | undefined;
};
type ChannelDirectoryEntryKind = "user" | "group" | "channel";
type ChannelDirectoryEntry = {
  kind: ChannelDirectoryEntryKind;
  id: string;
  name?: string;
  handle?: string;
  avatarUrl?: string;
  rank?: number;
  raw?: unknown;
};
type ChannelMessageActionName = ChannelMessageActionName$1;
/** Execution context passed to channel-owned actions on the shared `message` tool. */
type ChannelMessageActionContext = {
  channel: ChannelId;
  action: ChannelMessageActionName;
  cfg: OpenClawConfig;
  params: Record<string, unknown>;
  reply?: OutboundReplyFacts;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  accountId?: string | null;
  /** Trusted originating account id paired with requesterSenderId. */
  requesterAccountId?: string | null;
  /**
   * Trusted sender id from inbound context. This is server-injected and must
   * never be sourced from tool/model-controlled params.
   */
  requesterSenderId?: string | null;
  /** Trusted owner identity bit from command/channel-action auth. */
  senderIsOwner?: boolean;
  /**
   * Server-owned origin for this operation. Missing values are delegated.
   * Plugins must use it only for conversation-read visibility policy.
   */
  conversationReadOrigin?: ConversationReadInvocationOrigin;
  sessionKey?: string | null;
  sessionId?: string | null;
  inboundEventKind?: InboundEventKind;
  agentId?: string | null;
  gateway?: {
    url?: string;
    token?: string;
    timeoutMs?: number;
    clientName: GatewayClientName;
    clientDisplayName?: string;
    mode: GatewayClientMode;
  };
  toolContext?: ChannelThreadingToolContext;
  dryRun?: boolean;
  gatewayClientScopes?: readonly string[];
  /**
   * Server-owned fact: this caller receives proven-not-sent failures and resends
   * them. Plugins forward it into durable sends so recovery does not replay too.
   */
  deliveryRetryOwner?: "caller";
};
type ChannelToolSend = {
  to: string;
  accountId?: string | null;
  threadId?: string | null;
  /** True when the native provider send may inherit the active conversation thread. */
  threadImplicit?: boolean;
  threadSuppressed?: boolean;
};
type ChannelMessagePreparedSendPayloadContext = {
  ctx: ChannelMessageActionContext;
  to: string;
  payload: ReplyPayload;
  replyToId?: string | null;
  /** Preserve caller intent when plugins translate reply ids into durable payloads. */
  replyToIdSource?: "explicit" | "implicit";
  threadId?: string | number | null;
};
/** Channel-owned action surface for the shared `message` tool. */
type ChannelMessageActionAdapter = {
  /**
   * Unified discovery surface for the shared `message` tool.
   * This returns the scoped actions,
   * capabilities, schema fragments, and any plugin-owned media-source params
   * together so they cannot drift.
   */
  describeMessageTool: (params: ChannelMessageActionDiscoveryContext) => ChannelMessageToolDiscovery | null | undefined;
  /** Delegate conversation-read authorization to this adapter for bundled registrations only. */
  providerOwnedReadGates?: true | readonly ChannelMessageActionName[];
  supportsAction?: (params: {
    action: ChannelMessageActionName;
  }) => boolean;
  resolveExecutionMode?: (params: {
    action: ChannelMessageActionName;
  }) => "local" | "gateway";
  resolveCliActionRequest?: (params: {
    action: ChannelMessageActionName;
    args: Record<string, unknown>;
  }) => {
    action: ChannelMessageActionName;
    args: Record<string, unknown>;
  };
  messageActionTargetAliases?: Partial<Record<ChannelMessageActionName, {
    aliases: string[];
    /** Alias fields that identify the destination conversation, not an existing message. */
    deliveryTargetAliases?: string[];
    /** Convert typed owner fields such as chatId into the canonical shared target shape. */
    resolveDeliveryTarget?: (params: {
      args: Record<string, unknown>;
    }) => string | undefined;
    /**
     * Prove that provider-native aliases name the trusted current conversation.
     * Core consults this only for host-owned bundled registrations.
     */
    matchesCurrentConversation?: (params: {
      args: Record<string, unknown>;
      accountId: string;
      toolContext: ChannelThreadingToolContext;
    }) => boolean;
  }>>;
  requiresTrustedRequesterSender?: (params: {
    action: ChannelMessageActionName;
    toolContext?: ChannelThreadingToolContext;
  }) => boolean;
  /** Return true when a provider-native tool invocation has a visible or destructive side effect. */
  isToolDeliveryAction?: (params: {
    args: Record<string, unknown>;
  }) => boolean;
  extractToolSend?: (params: {
    args: Record<string, unknown>;
  }) => ChannelToolSend | null;
  /** Recover the actual resolved send route from a successful action result. */
  extractToolSendResult?: (params: {
    result: unknown;
    send: ChannelToolSend;
  }) => ChannelToolSend | null;
  /**
   * Translate generic `message(action=send)` arguments into the payload core
   * should persist, retry, recover, and ack. Return null to keep the legacy
   * plugin-owned action path for sends that cannot be represented durably.
   */
  prepareSendPayload?: (params: ChannelMessagePreparedSendPayloadContext) => ReplyPayload | null | undefined | Promise<ReplyPayload | null | undefined>;
  /**
   * Prefer this for channel-specific poll semantics or extra poll parameters.
   * Core only parses the shared poll model when falling back to `outbound.sendPoll`.
   */
  handleAction?: (ctx: ChannelMessageActionContext) => Promise<AgentToolResult<unknown>>;
};
type ChannelPollResult = Pick<MessageReceiptSourceResult, "messageId" | "toJid" | "channelId" | "conversationId" | "pollId"> & {
  messageId: string;
  receipt?: MessageReceipt;
};
/** Shared poll input after core has normalized the common poll model. */
type ChannelPollContext = Pick<ChannelMessageSendPollContext, "cfg" | "to" | "poll" | "accountId" | "threadId" | "silent" | "isAnonymous" | "gatewayClientScopes" | "onPlatformSendDispatch"> & {
  content?: string;
  /** Trusted originating turn context for channel-owned delivery correlation. */
  sessionKey?: string;
  inboundEventKind?: InboundEventKind;
};
/** Minimal base for all channel probe results. Channel-specific probes extend this. */
type BaseProbeResult<TError = string | null> = {
  ok: boolean;
  error?: TError;
};
//#endregion
//#region src/config/legacy.shared.d.ts
type LegacyConfigRule = {
  path: string[];
  message: string;
  match?: (value: unknown, root: Record<string, unknown>) => boolean;
  requireSourceLiteral?: boolean;
};
//#endregion
//#region src/channels/plugins/approval-native.types.d.ts
/**
 * Native channel surface that can receive approval prompts.
 */
type ChannelApprovalNativeSurface = "origin" | "approver-dm";
/**
 * Native channel destination for an approval prompt.
 */
type ChannelApprovalNativeTarget = {
  to: string;
  threadId?: string | number | null;
};
/**
 * Preferred native delivery surface for approval prompts.
 */
type ChannelApprovalNativeDeliveryPreference = ChannelApprovalNativeSurface | "both";
/**
 * Approval request shapes supported by native channel approval delivery.
 */
type ChannelApprovalNativeRequest = ExecApprovalRequest | PluginApprovalRequest;
/**
 * Capabilities returned by native channel approval delivery inspection.
 */
type ChannelApprovalNativeDeliveryCapabilities = {
  enabled: boolean;
  preferredSurface: ChannelApprovalNativeDeliveryPreference;
  supportsOriginSurface: boolean;
  supportsApproverDmSurface: boolean;
  notifyOriginWhenDmOnly?: boolean;
};
/**
 * Adapter implemented by channel plugins that support native approval delivery.
 */
type ChannelApprovalNativeAdapter = {
  describeDeliveryCapabilities: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeDeliveryCapabilities;
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget | null | Promise<ChannelApprovalNativeTarget | null>;
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget[] | Promise<ChannelApprovalNativeTarget[]>;
};
//#endregion
//#region src/infra/approval-native-delivery.d.ts
/** One native approval delivery target selected by the channel adapter plan. */
type ChannelApprovalNativePlannedTarget = {
  surface: ChannelApprovalNativeSurface;
  target: ChannelApprovalNativeTarget;
  reason: "preferred" | "fallback";
};
//#endregion
//#region src/infra/approval-native-runtime-types.d.ts
/** Prepared delivery target plus the stable key used to avoid duplicate native messages. */
type PreparedChannelNativeApprovalTarget<TPreparedTarget> = {
  dedupeKey: string;
  target: TPreparedTarget;
};
//#endregion
//#region src/infra/approval-view-model.types.d.ts
type ApprovalPhase = "pending" | "resolved" | "expired";
/** Button or command action shown with a pending approval prompt. */
type ApprovalActionView = {
  kind?: "command" | "decision";
  decision: ExecApprovalDecision;
  label: string;
  style: NonNullable<MessagePresentationButton["style"]>;
  action?: MessagePresentationAction;
  /** Copyable command fallback for non-interactive surfaces. */
  command: string;
};
/** Label/value metadata row rendered with an approval prompt. */
type ApprovalMetadataView = {
  label: string;
  value: string;
};
type ApprovalViewBase = {
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  phase: ApprovalPhase;
  title: string;
  description?: string | null;
  metadata: ApprovalMetadataView[];
};
/** Shared presentation fields for exec approval views across all phases. */
type ExecApprovalViewBase = ApprovalViewBase & {
  approvalKind: "exec";
  ask?: string | null;
  agentId?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandText: string;
  commandPreview?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host?: string | null;
  nodeId?: string | null;
  scope?: ApprovalScope | null;
  sessionKey?: string | null;
};
/** Pending exec approval view, including executable reply actions. */
type ExecApprovalPendingView = ExecApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
/** Resolved exec approval view with the recorded decision. */
type ExecApprovalResolvedView = ExecApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
/** Expired exec approval view without reply actions. */
type ExecApprovalExpiredView = ExecApprovalViewBase & {
  phase: "expired";
};
/** Shared presentation fields for plugin approval views across all phases. */
type PluginApprovalViewBase = ApprovalViewBase & {
  approvalKind: "plugin";
  agentId?: string | null;
  pluginId?: string | null;
  scope?: ApprovalScope | null;
  toolName?: string | null;
  severity: "info" | "warning" | "critical";
};
/** Pending plugin approval view, including executable reply actions. */
type PluginApprovalPendingView = PluginApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
/** Resolved plugin approval view with the recorded decision. */
type PluginApprovalResolvedView = PluginApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
/** Expired plugin approval view without reply actions. */
type PluginApprovalExpiredView = PluginApprovalViewBase & {
  phase: "expired";
};
/** Any pending approval view that still accepts a user decision. */
type PendingApprovalView = ExecApprovalPendingView | PluginApprovalPendingView;
/** Any approval view after a decision was recorded. */
type ResolvedApprovalView = ExecApprovalResolvedView | PluginApprovalResolvedView;
/** Any approval view after it can no longer be acted on. */
type ExpiredApprovalView = ExecApprovalExpiredView | PluginApprovalExpiredView;
//#endregion
//#region src/infra/approval-handler-runtime-types.d.ts
/** Backward-compatible approval request accepted by public plugin callbacks. */
type ApprovalRequest = ApprovalRequestInput;
/** Union of approval resolution events a native approval handler can finalize. */
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
/** Shared context passed to channel-native approval hooks. */
type ChannelApprovalCapabilityHandlerContext = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  gatewayUrl?: string;
  context?: unknown;
};
/** Result instruction for updating, deleting, clearing, or leaving a delivered approval entry. */
type ChannelApprovalNativeFinalAction<TPayload> = {
  kind: "update";
  payload: TPayload;
} | {
  kind: "delete";
} | {
  kind: "clear-actions";
} | {
  kind: "leave";
};
/** Availability gate for deciding whether a channel-native approval runtime can handle work. */
type ChannelApprovalNativeAvailabilityAdapter = {
  isConfigured: (params: ChannelApprovalCapabilityHandlerContext) => boolean;
  shouldHandle: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    /** Payload-derived owner; channel adapters must not infer ownership from the id. */
    approvalKind: ChannelApprovalKind;
  }) => boolean;
};
/** Builds channel-native payloads for pending, resolved, and expired approval views. */
type ChannelApprovalNativePresentationAdapter<TPendingPayload = unknown, TFinalPayload = unknown> = {
  buildPendingPayload: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    nowMs: number;
    view: PendingApprovalView;
  }) => TPendingPayload | Promise<TPendingPayload>;
  buildResolvedResult: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    resolved: ApprovalResolved;
    view: ResolvedApprovalView;
    entry: unknown;
  }) => ChannelApprovalNativeFinalAction<TFinalPayload> | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
  buildExpiredResult: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    view: ExpiredApprovalView;
    entry: unknown;
  }) => ChannelApprovalNativeFinalAction<TFinalPayload> | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
};
type ChannelApprovalNativeTransportAdapterForView<TPreparedTarget = unknown, TPendingEntry = unknown, TPendingPayload = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  prepareTarget: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => PreparedChannelNativeApprovalTarget<TPreparedTarget> | null | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverPending: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
  updateEntry?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    payload: TFinalPayload;
    phase: "resolved" | "expired";
  }) => Promise<void>;
  deleteEntry?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    phase: "resolved" | "expired";
  }) => Promise<void>;
};
/** Transport hooks for preparing, delivering, updating, and deleting native approval entries. */
type ChannelApprovalNativeTransportAdapter<TPreparedTarget = unknown, TPendingEntry = unknown, TPendingPayload = unknown, TFinalPayload = unknown> = ChannelApprovalNativeTransportAdapterForView<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload>;
type ChannelApprovalNativeInteractionAdapterForView<TPendingEntry = unknown, TBinding = unknown, TPendingPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  bindPending?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => TBinding | null | Promise<TBinding | null>;
  unbindPending?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    binding: TBinding;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
  }) => Promise<void> | void;
  clearPendingActions?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    phase: "resolved" | "expired";
  }) => Promise<void>;
  cancelDelivered?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
  }) => Promise<void> | void;
};
/** Optional hooks for binding and clearing interactive approval controls. */
type ChannelApprovalNativeInteractionAdapter<TPendingEntry = unknown, TBinding = unknown> = ChannelApprovalNativeInteractionAdapterForView<TPendingEntry, TBinding>;
type ChannelApprovalNativeObserveAdapterForView<TPreparedTarget = unknown, TPendingPayload = unknown, TPendingEntry = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  onDeliveryError?: (params: ChannelApprovalCapabilityHandlerContext & {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => void;
  onDuplicateSkipped?: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => void;
  onDelivered?: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
    entry: TPendingEntry;
  }) => void;
};
/** Optional observer hooks for delivery errors, duplicates, and successful deliveries. */
type ChannelApprovalNativeObserveAdapter<TPreparedTarget = unknown, TPendingPayload = unknown, TPendingEntry = unknown> = ChannelApprovalNativeObserveAdapterForView<TPreparedTarget, TPendingPayload, TPendingEntry>;
/** Runtime adapter consumed by core after a plugin's strongly typed spec has been erased. */
type ChannelApprovalNativeRuntimeAdapter<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown> = {
  eventKinds?: readonly ChannelApprovalKind[];
  /**
   * Trusted legacy ownership override retained for compatibility.
   * @deprecated Omit this so core derives approval ownership from the request payload.
   */
  resolveApprovalKind?: (request: ApprovalRequest) => ChannelApprovalKind;
  availability: ChannelApprovalNativeAvailabilityAdapter;
  presentation: ChannelApprovalNativePresentationAdapter<TPendingPayload, TFinalPayload>;
  transport: ChannelApprovalNativeTransportAdapter<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload>;
  interactions?: ChannelApprovalNativeInteractionAdapter<TPendingEntry, TBinding>;
  observe?: ChannelApprovalNativeObserveAdapter;
};
//#endregion
//#region src/routing/resolve-route.d.ts
type RoutePeer = {
  kind: ChatType;
  id: string;
};
type ResolveAgentRouteInput = {
  cfg: OpenClawConfig;
  channel: string;
  /** Known owner when no configured binding matches this route. */
  defaultAgentId?: string;
  accountId?: string | null;
  peer?: RoutePeer | null;
  dmScope?: DmScope;
  groupScope?: GroupScope;
  /** Parent peer for threads — used for binding inheritance when peer doesn't match directly. */
  parentPeer?: RoutePeer | null;
  guildId?: string | null;
  teamId?: string | null;
  /** Discord member role IDs — used for role-based agent routing. */
  memberRoleIds?: string[];
};
type ResolvedAgentRoute = {
  agentId: string;
  channel: string;
  accountId: string;
  /** Effective direct-message scope after a matching binding override. */
  dmScope?: DmScope;
  groupScope?: GroupScope;
  /** Internal session key used for persistence + concurrency. */
  sessionKey: string;
  /** Convenience alias for direct-chat collapse. */
  mainSessionKey: string;
  /** Which session should receive inbound last-route updates. */
  lastRoutePolicy: "main" | "session";
  /** Match description for debugging/logging. */
  matchedBy: "binding.peer" | "binding.peer.parent" | "binding.peer.wildcard" | "binding.guild+roles" | "binding.guild" | "binding.team" | "binding.account" | "binding.channel" | "default";
};
declare function buildAgentSessionKey(params: {
  agentId: string;
  mainKey?: string;
  channel: string;
  accountId?: string | null;
  peer?: RoutePeer | null;
  /** DM session scope. */
  dmScope?: DmScope;
  groupScope?: GroupScope;
  identityLinks?: Record<string, string[]>;
}): string;
declare function resolveAgentRoute(input: ResolveAgentRouteInput): ResolvedAgentRoute;
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
//#region src/channels/plugins/channel-runtime-surface.types.d.ts
/**
 * Channel runtime context registry types.
 *
 * Defines the public plugin SDK surface for channel runtime context registration and watches.
 */
type ChannelRuntimeContextKey = {
  channelId: string;
  accountId?: string | null;
  capability: string;
};
type ChannelRuntimeContextEvent = {
  type: "registered" | "unregistered";
  key: {
    channelId: string;
    accountId?: string;
    capability: string;
  };
  context?: unknown;
};
type ChannelRuntimeContextRegistry = {
  register: (params: ChannelRuntimeContextKey & {
    context: unknown;
    abortSignal?: AbortSignal;
  }) => {
    dispose: () => void;
  };
  get: <T = unknown>(params: ChannelRuntimeContextKey) => T | undefined;
  watch: (params: {
    channelId?: string;
    accountId?: string | null;
    capability?: string;
    onEvent: (event: ChannelRuntimeContextEvent) => void;
  }) => () => void;
};
/**
 * Minimal channel-runtime surface exported through the public plugin SDK.
 *
 * Gateway startup supplies the full plugin channel runtime, but external callers
 * may still type context-only helpers against this compatibility surface.
 */
type ChannelRuntimeSurface = {
  runtimeContexts: ChannelRuntimeContextRegistry;
  [key: string]: unknown;
};
//#endregion
//#region src/channels/plugins/config-write-policy-shared.d.ts
/**
 * Channel/account scope used to evaluate config write policy.
 */
type ConfigWriteScopeLike<TChannelId extends string = string> = {
  channelId?: TChannelId | null;
  accountId?: string | null;
};
/**
 * Target affected by a config write command.
 */
type ConfigWriteTargetLike<TChannelId extends string = string> = {
  kind: "global";
} | {
  kind: "channel";
  scope: {
    channelId: TChannelId;
  };
} | {
  kind: "account";
  scope: {
    channelId: TChannelId;
    accountId: string;
  };
} | {
  kind: "ambiguous";
  scopes: ConfigWriteScopeLike<TChannelId>[];
};
//#endregion
//#region src/channels/plugins/config-writes.d.ts
/**
 * Target affected by a channel config write.
 */
type ConfigWriteTarget = ConfigWriteTargetLike;
//#endregion
//#region src/infra/outbound/deliver-types.d.ts
/** Successful channel send result normalized for core delivery accounting. */
type OutboundDeliveryResult = {
  channel: ChannelId;
  messageId: string;
  target?: {
    kind: "chat" | "channel" | "room" | "conversation";
    id: string;
  };
  timestamp?: number;
  toJid?: string;
  pollId?: string;
  receipt?: MessageReceipt;
  meta?: Record<string, unknown>;
};
/** Reason a payload was intentionally not sent after normalization or hooks. */
type OutboundPayloadDeliverySuppressionReason = "cancelled_by_message_sending_hook" | "cancelled_by_reply_payload_sending_hook" | "empty_after_message_sending_hook" | "empty_after_reply_payload_sending_hook" | "no_visible_payload" | "adapter_returned_no_identity";
/** Delivery phase where a failure occurred. */
type OutboundDeliveryFailureStage = "platform_send" | "queue" | "unknown";
type OutboundPayloadDeliveryKind = "text" | "media" | "other";
/** Per-payload delivery status emitted to callers and channel send summaries. */
type OutboundPayloadDeliveryOutcome = {
  index: number;
  status: "sent";
  results: OutboundDeliveryResult[];
  /** Effective post-hook, post-render payload kind. */
  deliveryKind?: OutboundPayloadDeliveryKind;
} | {
  index: number;
  status: "suppressed";
  reason: OutboundPayloadDeliverySuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
} | {
  index: number;
  status: "failed";
  error: unknown;
  sentBeforeError: boolean;
  stage: OutboundDeliveryFailureStage;
  /** Identified platform sends from this payload before its terminal failure. */
  results?: OutboundDeliveryResult[];
  /** Effective post-hook, post-render payload kind when platform delivery began. */
  deliveryKind?: OutboundPayloadDeliveryKind;
};
//#endregion
//#region src/auto-reply/chunk.d.ts
type TextChunkProvider = ChannelId;
/**
 * Chunking mode for outbound messages:
 * - "length": Split only when exceeding textChunkLimit (default)
 * - "newline": Prefer breaking on "soft" boundaries. Historically this split on every
 *   newline; now it only breaks on paragraph boundaries (blank lines) unless the text
 *   exceeds the length limit.
 */
type ChunkMode = "length" | "newline";
declare function resolveTextChunkLimit(cfg: OpenClawConfig | undefined, provider?: TextChunkProvider, accountId?: string | null, opts?: {
  fallbackLimit?: number;
}): number;
declare function resolveChunkMode(cfg: OpenClawConfig | undefined, provider?: TextChunkProvider, accountId?: string | null): ChunkMode;
/**
 * Split text on newlines, trimming line whitespace.
 * Blank lines are folded into the next non-empty line as leading "\n" prefixes.
 * Long lines can be split by length (default) or kept intact via splitLongLines:false.
 */
declare function chunkByNewline(text: string, maxLineLength: number, opts?: {
  splitLongLines?: boolean;
  trimLines?: boolean;
  isSafeBreak?: (index: number) => boolean;
}): string[];
/**
 * Unified chunking function that dispatches based on mode.
 */
declare function chunkTextWithMode(text: string, limit: number, mode: ChunkMode): string[];
declare function chunkMarkdownTextWithMode(text: string, limit: number, mode: ChunkMode): string[];
declare function chunkText(text: string, limit: number): string[];
declare function chunkMarkdownText(text: string, limit: number): string[];
//#endregion
//#region src/infra/outbound/formatting.d.ts
/**
 * Formatting and chunking hints carried through outbound delivery planning.
 */
type OutboundDeliveryFormattingOptions = {
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  parseMode?: "HTML";
};
//#endregion
//#region src/infra/outbound/identity-types.d.ts
/** Agent identity metadata that outbound channels can render with a message. */
type OutboundIdentity = {
  name?: string;
  avatarUrl?: string;
  emoji?: string;
  theme?: string;
};
//#endregion
//#region src/channels/plugins/outbound.types.d.ts
type ChannelOutboundContext = {
  cfg: OpenClawConfig;
  to: string;
  text: string;
  mediaUrl?: string;
  audioAsVoice?: boolean;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  gifPlayback?: boolean;
  /** Send image, GIF, or video as document to avoid channel compression. */
  forceDocument?: boolean;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  threadId?: string | number | null;
  accountId?: string | null;
  identity?: OutboundIdentity;
  deps?: OutboundSendDeps;
  silent?: boolean;
  gatewayClientScopes?: readonly string[];
  /** @internal Opaque durable intent id for exact provider-side send reconciliation. */
  deliveryQueueId?: string;
  /** @internal Stable platform-send index within one durable payload. */
  deliveryPartIndex?: number;
  /** @internal Exact platform-send count within one durable payload. */
  deliveryPartCount?: number;
  /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string;
  /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** @internal Report each completed platform sub-send before starting another fallible step. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
};
type ChannelOutboundPayloadContext = ChannelOutboundContext & {
  payload: ReplyPayload;
};
type ChannelPresentationCapabilities = {
  /** Whether the channel accepts structured presentation payloads at all. */
  supported?: boolean;
  /** Whether the channel can render button action blocks natively. */
  buttons?: boolean;
  /** Whether the channel can render select/menu blocks natively. */
  selects?: boolean;
  /** Whether the channel can render low-emphasis context blocks natively. */
  context?: boolean;
  /** Whether the channel can render divider blocks natively. */
  divider?: boolean;
  /** Whether the channel can render chart blocks natively. */
  charts?: boolean;
  /** Whether the channel can render table blocks natively. */
  tables?: boolean;
  /** Per-channel limits used to adapt portable presentation blocks before rendering. */
  limits?: {
    actions?: {
      /** Maximum total button/select actions in one message. */
      maxActions?: number;
      /** Maximum buttons per rendered action row. */
      maxActionsPerRow?: number;
      /** Maximum action rows in one message. */
      maxRows?: number;
      /** Maximum user-visible button label length. */
      maxLabelLength?: number;
      /** Maximum callback/action value size in UTF-8 bytes. */
      maxValueBytes?: number;
      /** Whether action styles such as primary or danger are preserved. */
      supportsStyles?: boolean;
      /** Whether disabled button state is preserved. */
      supportsDisabled?: boolean;
      /** Whether priority/layout hints affect native rendering. */
      supportsLayoutHints?: boolean;
    };
    selects?: {
      /** Maximum options in one select/menu block. */
      maxOptions?: number;
      /** Maximum user-visible option label length. */
      maxLabelLength?: number;
      /** Maximum option callback value size in UTF-8 bytes. */
      maxValueBytes?: number;
    };
    text?: {
      /** Maximum text length for title, text, and context blocks. */
      maxLength?: number;
      /** Unit used by maxLength. Defaults to Unicode code points. */
      encoding?: "characters" | "utf8-bytes" | "utf16-units";
      /** Markdown dialect understood by rendered text blocks. */
      markdownDialect?: "plain" | "markdown" | "html" | "slack-mrkdwn" | "discord-markdown";
      /** Whether the channel can edit presentation text in-place. */
      supportsEdit?: boolean;
    };
  };
};
type ChannelDeliveryCapabilities = {
  pin?: boolean;
  durableFinal?: {
    text?: boolean;
    media?: boolean;
    poll?: boolean;
    payload?: boolean;
    silent?: boolean;
    replyTo?: boolean;
    thread?: boolean;
    nativeQuote?: boolean;
    messageSendingHooks?: boolean;
    batch?: boolean;
    reconcileUnknownSend?: boolean;
    afterSendSuccess?: boolean;
    afterCommit?: boolean;
  };
};
type ChannelOutboundPayloadHint = {
  kind: "approval-pending";
  approvalKind: ChannelApprovalKind;
  nativeRouteActive?: boolean;
} | {
  kind: "approval-resolved";
  approvalKind: ChannelApprovalKind;
};
type ChannelOutboundTargetRef = {
  channel: string;
  to: string;
  accountId?: string | null;
  threadId?: string | number | null;
};
type ChannelOutboundFormattedContext = ChannelOutboundContext & {
  abortSignal?: AbortSignal;
};
type ChannelOutboundChunkContext = {
  formatting?: OutboundDeliveryFormattingOptions;
};
type ChannelOutboundNormalizePayloadParams = {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ChannelOutboundNormalizePayloadBatchParams = {
  payloads: readonly {
    index: number;
    payload: ReplyPayload;
  }[];
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ChannelOutboundAdapter = {
  deliveryMode: "direct" | "gateway" | "hybrid";
  chunker?: ((text: string, limit: number, ctx?: ChannelOutboundChunkContext) => string[]) | null;
  chunkerMode?: "text" | "markdown";
  chunkedTextFormatting?: OutboundDeliveryFormattingOptions;
  /** Lift remote Markdown image syntax in text into outbound media attachments. */
  extractMarkdownImages?: boolean;
  /** Preserve model-authored Markdown details blocks for a native channel renderer. */
  preserveMarkdownDetails?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean;
  textChunkLimit?: number;
  /**
   * Reserve the exact provider id used by the next single-message send.
   * Presence opts the channel into conversations_turn reply correlation.
   */
  prepareConversationTurnMessageId?: (params: {
    cfg: OpenClawConfig;
    to: string;
    text: string;
    accountId?: string | null;
    threadId?: string | number | null;
  }) => string;
  sanitizeText?: (params: {
    text: string;
    payload: ReplyPayload;
    cfg?: OpenClawConfig;
    accountId?: string;
  }) => string;
  pollMaxOptions?: number;
  supportsPollDurationSeconds?: boolean;
  supportsAnonymousPolls?: boolean;
  normalizePayload?: (params: ChannelOutboundNormalizePayloadParams) => ReplyPayload | null;
  /** Normalize an ordered batch in place. Return one entry per input; null suppresses that send. */
  normalizePayloadBatch?: (params: ChannelOutboundNormalizePayloadBatchParams) => ReadonlyArray<ReplyPayload | null>;
  sendTextOnlyErrorPayloads?: boolean;
  shouldSkipPlainTextSanitization?: (params: {
    payload: ReplyPayload;
  }) => boolean;
  resolveEffectiveTextChunkLimit?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    fallbackLimit?: number;
    formatting?: OutboundDeliveryFormattingOptions;
  }) => number | undefined;
  shouldSuppressLocalPayloadPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    payload: ReplyPayload;
    hint?: ChannelOutboundPayloadHint;
  }) => boolean;
  beforeDeliverPayload?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    payload: ReplyPayload;
    hint?: ChannelOutboundPayloadHint;
  }) => Promise<void> | void;
  afterDeliverPayload?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    payload: ReplyPayload;
    results: readonly OutboundDeliveryResult[];
  }) => Promise<void> | void;
  /** Adopt a provider-created thread for later payloads in the same durable batch. */
  adoptTargetFromDelivery?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    result: OutboundDeliveryResult;
  }) => {
    threadId: string | number;
  } | null | undefined;
  /** Channel-advertised presentation features and limits used by core adaptation. */
  presentationCapabilities?: ChannelPresentationCapabilities;
  /**
   * Account- and formatting-aware capability resolution; takes precedence over
   * the static declaration. Formatting is the delivery's outbound formatting
   * options, so capabilities that only apply to one text funnel (for example
   * rich tables on the markdown path) can turn off for HTML-mode sends.
   */
  resolvePresentationCapabilities?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    formatting?: OutboundDeliveryFormattingOptions;
  }) => ChannelPresentationCapabilities;
  deliveryCapabilities?: ChannelDeliveryCapabilities;
  /** Render an adapted portable presentation into channel-native payload data. */
  renderPresentation?: (params: {
    payload: ReplyPayload;
    presentation: MessagePresentation;
    ctx: ChannelOutboundPayloadContext;
  }) => Promise<ReplyPayload | null> | ReplyPayload | null;
  pinDeliveredMessage?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    messageId: string;
    pin: ReplyPayloadDeliveryPin;
    gatewayClientScopes?: readonly string[];
  }) => Promise<void> | void;
  /**
   * @deprecated Use shouldTreatDeliveredTextAsVisible instead.
   */
  shouldTreatRoutedTextAsVisible?: (params: {
    kind: "tool" | "block" | "final";
    text?: string;
  }) => boolean;
  shouldTreatDeliveredTextAsVisible?: (params: {
    kind: "tool" | "block" | "final";
    text?: string;
  }) => boolean;
  preferFinalAssistantVisibleText?: boolean;
  targetsMatchForReplySuppression?: (params: {
    originTarget: string;
    targetKey: string;
    targetThreadId?: string;
  }) => boolean;
  resolveTarget?: (params: {
    cfg?: OpenClawConfig;
    to?: string;
    allowFrom?: string[];
    accountId?: string | null;
    mode?: ChannelOutboundTargetMode;
  }) => {
    ok: true;
    to: string;
  } | {
    ok: false;
    error: Error;
  };
  sendPayload?: (ctx: ChannelOutboundPayloadContext) => Promise<OutboundDeliveryResult>;
  sendFormattedText?: (ctx: ChannelOutboundFormattedContext) => Promise<OutboundDeliveryResult[]>;
  sendFormattedMedia?: (ctx: ChannelOutboundFormattedContext & {
    mediaUrl: string;
  }) => Promise<OutboundDeliveryResult>;
  sendText?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
  sendMedia?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
  sendPoll?: (ctx: ChannelPollContext) => Promise<ChannelPollResult>;
};
//#endregion
//#region src/channels/plugins/pairing.types.d.ts
/**
 * Channel pairing hooks used by setup and allowlist approval flows.
 */
type ChannelPairingAdapter = {
  idLabel: string;
  normalizeAllowEntry?: (entry: string) => string;
  /** Derive the persisted approval entry from the locally issued request. */
  resolveApprovalStoreEntry?: (request: {
    id: string;
    meta?: Record<string, string>;
  }) => string | null | undefined;
  notifyApproval?: (params: {
    cfg: OpenClawConfig;
    id: string;
    accountId?: string;
    meta?: Record<string, string>;
    runtime?: RuntimeEnv;
  }) => Promise<void>;
};
//#endregion
//#region src/channels/plugins/types.adapters.d.ts
type ConfiguredBindingRule = AgentBinding;
type ChannelActionAvailabilityState = {
  kind: "enabled";
} | {
  kind: "disabled";
} | {
  kind: "unsupported";
};
type ChannelApprovalForwardTarget = {
  channel: string;
  to: string;
  accountId?: string | null;
  threadId?: string | number | null;
  source?: "session" | "target";
};
type ChannelCapabilitiesDisplayTone = "default" | "muted" | "success" | "warn" | "error";
type ChannelCapabilitiesDisplayLine = {
  text: string;
  tone?: ChannelCapabilitiesDisplayTone;
};
type ChannelCapabilitiesDiagnostics = {
  lines?: ChannelCapabilitiesDisplayLine[];
  details?: Record<string, unknown>;
};
type ChannelAdapterCallback<T extends (...args: never[]) => unknown> = T;
type ChannelAccountLinkState = "linked" | "not-linked" | "unknown";
type ChannelConfigAdapter<ResolvedAccount> = {
  listAccountIds: (cfg: OpenClawConfig) => string[];
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  inspectAccount?: (cfg: OpenClawConfig, accountId?: string | null) => unknown;
  defaultAccountId?: (cfg: OpenClawConfig) => string;
  setAccountEnabled?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    enabled: boolean;
  }) => OpenClawConfig;
  deleteAccount?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig;
  isEnabled?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => boolean>;
  disabledReason?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => string>;
  isConfigured?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => boolean | Promise<boolean>>;
  isLinked?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => ChannelAccountLinkState | Promise<ChannelAccountLinkState>>;
  unconfiguredReason?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => string>;
  unlinkedReason?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => string>;
  describeAccount?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => ChannelAccountSnapshot>;
  resolveAllowFrom?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Array<string | number> | undefined;
  formatAllowFrom?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    allowFrom: Array<string | number>;
  }) => string[];
  hasConfiguredState?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => boolean;
  hasPersistedAuthState?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => boolean;
  resolveDefaultTo?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string | undefined;
};
type ChannelSecretsAdapter = {
  secretTargetRegistryEntries?: readonly SecretTargetRegistryEntry[];
  unsupportedSecretRefSurfacePatterns?: readonly string[];
  collectUnsupportedSecretRefConfigCandidates?: (raw: unknown) => Array<{
    path: string;
    value: unknown;
  }>;
  collectRuntimeConfigAssignments?: (params: {
    config: OpenClawConfig;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
  }) => void;
};
type ChannelGroupAdapter = {
  resolveRequireMention?: (params: ChannelGroupContext) => boolean | undefined;
  resolveToolPolicy?: (params: ChannelGroupContext) => GroupToolPolicyConfig | undefined;
};
type ChannelStatusAdapter<ResolvedAccount, Probe = unknown, Audit = unknown> = {
  defaultRuntime?: ChannelAccountSnapshot;
  buildChannelSummary?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    defaultAccountId: string;
    snapshot: ChannelAccountSnapshot;
  }) => Record<string, unknown> | Promise<Record<string, unknown>>>;
  probeAccount?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
  }) => Promise<Probe>>;
  formatCapabilitiesProbe?: ChannelAdapterCallback<(params: {
    probe: Probe;
  }) => ChannelCapabilitiesDisplayLine[]>;
  auditAccount?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
    probe?: Probe;
  }) => Promise<Audit>>;
  buildCapabilitiesDiagnostics?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
    probe?: Probe;
    audit?: Audit;
    target?: string;
  }) => Promise<ChannelCapabilitiesDiagnostics | undefined>>;
  buildAccountSnapshot?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    runtime?: ChannelAccountSnapshot;
    probe?: Probe;
    audit?: Audit;
  }) => ChannelAccountSnapshot | Promise<ChannelAccountSnapshot>>;
  logSelfId?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    includeChannelPrefix?: boolean;
  }) => void>;
  resolveAccountState?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    configured: boolean;
    enabled: boolean;
  }) => ChannelAccountState>;
  collectStatusIssues?: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
};
type ChannelGatewayContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: ResolvedAccount;
  runtime: RuntimeEnv;
  abortSignal: AbortSignal;
  log?: ChannelLogSink;
  getStatus: () => ChannelAccountSnapshot;
  setStatus: (next: ChannelAccountSnapshot) => void;
  /** Clear cached outbound directory lookups after the channel accepts newer directory data. */
  invalidateDirectoryCache?: () => void;
  /**
   * Optional channel runtime helpers for external channel plugins.
   *
   * This field provides the canonical channel runtime helpers for channel
   * dispatch, routing, session, reply, and startup context work.
   *
   * ## Available Features
   *
   * - **reply**: AI response dispatching, formatting, and delivery
   * - **routing**: Agent route resolution and matching
   * - **text**: Text chunking, markdown processing, and control command detection
   * - **session**: Session management and metadata tracking
   * - **media**: Remote media fetching and buffer saving
   * - **commands**: Command authorization and control command handling
   * - **groups**: Group policy resolution and mention requirements
   * - **pairing**: Channel pairing and allow-from management
   *
   * ## Use Cases
   *
   * Channel plugins that need:
   * - AI-powered response generation and delivery
   * - Advanced text processing and formatting
   * - Session tracking and management
   * - Agent routing and policy resolution
   *
   * ## Example
   *
   * ```typescript
   * const emailGatewayAdapter: ChannelGatewayAdapter<EmailAccount> = {
   *   startAccount: async (ctx) => {
   *     // Check availability (for backward compatibility)
   *     if (!ctx.channelRuntime) {
   *       ctx.log?.warn?.("channelRuntime not available - skipping AI features");
   *       return;
   *     }
   *
   *     // Use AI dispatch
   *     await ctx.channelRuntime.reply.dispatchReplyWithBufferedBlockDispatcher({
   *       ctx: { ... },
   *       cfg: ctx.cfg,
   *       dispatcherOptions: {
   *         deliver: async (payload) => {
   *           // Send reply via email
   *         },
   *       },
   *     });
   *   },
   * };
   * ```
   *
   * ## Backward Compatibility
   *
   * - This field is **optional** - channels that don't need it can ignore it
   * - Gateway startup passes a full `createPluginRuntime().channel` surface
   *   when a runtime resolver is configured
   * - External plugins should check for undefined before using
   *
   * @since Plugin SDK 2026.2.19
   * @see {@link https://docs.openclaw.ai/plugins/building-plugins | Plugin SDK documentation}
   */
  channelRuntime?: ChannelRuntimeSurface;
};
type ChannelLogoutResult = {
  cleared: boolean;
  loggedOut?: boolean;
  [key: string]: unknown;
};
type ChannelLoginWithQrStartResult = {
  qrDataUrl?: string;
  message: string;
  connected?: boolean;
};
type ChannelLoginWithQrWaitResult = {
  connected: boolean;
  message: string;
  qrDataUrl?: string;
};
type ChannelLogoutContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: ResolvedAccount;
  runtime: RuntimeEnv;
  log?: ChannelLogSink;
};
type ChannelGatewayAdapter<ResolvedAccount = unknown> = {
  startAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<unknown>;
  stopAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<void>;
  /** Keep gateway auth bypass resolution mirrored through a lightweight top-level `gateway-auth-api.ts` artifact. */
  resolveGatewayAuthBypassPaths?: (params: {
    cfg: OpenClawConfig;
  }) => string[];
  loginWithQrStart?: (params: {
    accountId?: string;
    force?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
  }) => Promise<ChannelLoginWithQrStartResult>;
  loginWithQrWait?: (params: {
    accountId?: string;
    timeoutMs?: number;
    currentQrDataUrl?: string;
  }) => Promise<ChannelLoginWithQrWaitResult>;
  logoutAccount?: (ctx: ChannelLogoutContext<ResolvedAccount>) => Promise<ChannelLogoutResult>;
};
type ChannelAuthAdapter = {
  login?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    runtime: RuntimeEnv;
    verbose?: boolean;
    channelInput?: string | null;
  }) => Promise<void>;
};
type ChannelHeartbeatAdapter = {
  checkReady?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<{
    ok: boolean;
    reason: string;
  }>;
  sendTyping?: (params: {
    cfg: OpenClawConfig;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<void> | void;
  clearTyping?: (params: {
    cfg: OpenClawConfig;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<void> | void;
};
type ChannelDirectorySelfParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryListParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryListGroupMembersParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  groupId: string;
  limit?: number | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryAdapter = {
  self?: (params: ChannelDirectorySelfParams) => Promise<ChannelDirectoryEntry | null>;
  listPeers?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listPeersLive?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroups?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroupsLive?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroupMembers?: (params: ChannelDirectoryListGroupMembersParams) => Promise<ChannelDirectoryEntry[]>;
};
type ChannelResolveKind = "user" | "group";
type ChannelResolveResult = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  note?: string;
};
type ChannelResolverAdapter = {
  resolveTargets: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    inputs: string[];
    kind: ChannelResolveKind;
    runtime: RuntimeEnv;
  }) => Promise<ChannelResolveResult[]>;
};
type ChannelElevatedAdapter = {
  allowFromFallback?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Array<string | number> | undefined;
};
type ChannelCommandAdapter = {
  enforceOwnerForCommands?: boolean;
  skipWhenConfigEmpty?: boolean;
  nativeCommandsAutoEnabled?: boolean;
  nativeSkillsAutoEnabled?: boolean;
  preferSenderE164ForCommands?: boolean;
  resolveNativeCommandName?: (params: {
    commandKey: string;
    defaultName: string;
  }) => string | undefined;
  buildCommandsListChannelData?: (params: {
    currentPage: number;
    totalPages: number;
    agentId?: string;
  }) => ReplyPayload["channelData"] | null;
  buildModelsMenuChannelData?: (params: {
    providers: Array<{
      id: string;
      count: number;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsProviderChannelData?: (params: {
    providers: Array<{
      id: string;
      count: number;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsAddProviderChannelData?: (params: {
    providers: Array<{
      id: string;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsListChannelData?: (params: {
    provider: string;
    models: readonly string[];
    currentModel?: string;
    currentPage: number;
    totalPages: number;
    pageSize?: number;
    modelNames?: ReadonlyMap<string, string>;
  }) => ReplyPayload["channelData"] | null;
  buildModelBrowseChannelData?: () => ReplyPayload["channelData"] | null;
};
type ChannelDoctorConfigMutation = {
  config: OpenClawConfig;
  changes: string[];
  warnings?: string[];
};
type ChannelDoctorLegacyConfigRule = LegacyConfigRule;
type ChannelDoctorSequenceResult = {
  changeNotes: string[];
  warningNotes: string[];
};
type ChannelDoctorEmptyAllowlistAccountContext = {
  account: Record<string, unknown>;
  channelName: string;
  dmPolicy?: string;
  effectiveAllowFrom?: Array<string | number>;
  parent?: Record<string, unknown>;
  prefix: string;
};
type ChannelDoctorAdapter = {
  dmAllowFromMode?: "topOnly" | "topOrNested" | "nestedOnly";
  groupModel?: "sender" | "route" | "hybrid";
  groupAllowFromFallbackToAllowFrom?: boolean;
  warnOnEmptyGroupSenderAllowlist?: boolean;
  legacyConfigRules?: LegacyConfigRule[];
  normalizeCompatibilityConfig?: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation;
  collectPreviewWarnings?: (params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
  }) => string[] | Promise<string[]>;
  collectMutableAllowlistWarnings?: (params: {
    cfg: OpenClawConfig;
  }) => string[] | Promise<string[]>;
  repairConfig?: (params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  runConfigSequence?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    shouldRepair: boolean;
  }) => ChannelDoctorSequenceResult | Promise<ChannelDoctorSequenceResult>;
  cleanStaleConfig?: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  collectEmptyAllowlistExtraWarnings?: (params: ChannelDoctorEmptyAllowlistAccountContext) => string[];
  shouldSkipDefaultEmptyGroupAllowlistWarning?: (params: ChannelDoctorEmptyAllowlistAccountContext) => boolean;
};
type ChannelLifecycleAdapter = {
  onAccountConfigChanged?: (params: {
    prevCfg: OpenClawConfig;
    nextCfg: OpenClawConfig;
    accountId: string;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  onAccountRemoved?: (params: {
    prevCfg: OpenClawConfig;
    accountId: string;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  runStartupMaintenance?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log: {
      info?: (message: string) => void;
      warn?: (message: string) => void;
    };
    trigger?: string;
    logPrefix?: string;
  }) => Promise<void> | void;
  /**
   * @deprecated Export stateMigrations from the plugin doctor contract instead.
   * Removal plan: remove the lifecycle adapter after the 2027.1 external-plugin migration window.
   */
  detectLegacyStateMigrations?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
  }) => ChannelLegacyStateMigrationPlan[] | Promise<ChannelLegacyStateMigrationPlan[]>;
};
type ChannelApprovalDeliveryAdapter = {
  hasConfiguredDmRoute?: (params: {
    cfg: OpenClawConfig;
  }) => boolean;
  shouldSuppressForwardingFallback?: (params: {
    cfg: OpenClawConfig;
    approvalKind: ChannelApprovalKind;
    target: ChannelApprovalForwardTarget;
    request: ExecApprovalRequest | PluginApprovalRequest;
  }) => boolean;
};
type ChannelApproveCommandBehavior = {
  kind: "allow";
} | {
  kind: "ignore";
} | {
  kind: "reply";
  text: string;
};
type ChannelApprovalRenderAdapter = {
  exec?: {
    buildPendingPayload?: (params: {
      cfg: OpenClawConfig;
      request: ExecApprovalRequest;
      target: ChannelApprovalForwardTarget;
      nowMs: number;
    }) => ReplyPayload | null;
    buildResolvedPayload?: (params: {
      cfg: OpenClawConfig;
      resolved: ExecApprovalResolved;
      target: ChannelApprovalForwardTarget;
    }) => ReplyPayload | null;
  };
  plugin?: {
    buildPendingPayload?: (params: {
      cfg: OpenClawConfig;
      request: PluginApprovalRequest;
      target: ChannelApprovalForwardTarget;
      nowMs: number;
    }) => ReplyPayload | null;
    buildResolvedPayload?: (params: {
      cfg: OpenClawConfig;
      resolved: PluginApprovalResolved;
      target: ChannelApprovalForwardTarget;
    }) => ReplyPayload | null;
  };
};
type ChannelApprovalAdapter = {
  delivery?: ChannelApprovalDeliveryAdapter;
  nativeRuntime?: ChannelApprovalNativeRuntimeAdapter;
  render?: ChannelApprovalRenderAdapter;
  native?: ChannelApprovalNativeAdapter;
  describeExecApprovalSetup?: (params: {
    channel: string;
    channelLabel: string;
    accountId?: string;
  }) => string | null | undefined;
  describePluginApprovalSetup?: (params: {
    channel: string;
    channelLabel: string;
    accountId?: string;
  }) => string | null | undefined;
};
type ChannelApprovalCapability = ChannelApprovalAdapter & {
  authorizeActorAction?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    action: "approve";
    approvalKind: ChannelApprovalKind;
  }) => {
    authorized: boolean;
    reason?: string;
  };
  getActionAvailabilityState?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
    approvalKind?: ChannelApprovalKind;
  }) => ChannelActionAvailabilityState;
  /** Exec-native client availability for the initiating surface; distinct from same-chat auth. */
  getExecInitiatingSurfaceState?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
  }) => ChannelActionAvailabilityState;
  resolveApproveCommandBehavior?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    approvalKind: ChannelApprovalKind;
  }) => ChannelApproveCommandBehavior | undefined;
};
type ChannelAllowlistAdapter = {
  applyConfigEdit?: (params: {
    cfg: OpenClawConfig;
    parsedConfig: Record<string, unknown>;
    accountId?: string | null;
    scope: "dm" | "group";
    action: "add" | "remove";
    entry: string;
  }) => {
    kind: "ok";
    changed: boolean;
    pathLabel: string;
    writeTarget: ConfigWriteTarget;
  } | {
    kind: "invalid-entry";
  } | Promise<{
    kind: "ok";
    changed: boolean;
    pathLabel: string;
    writeTarget: ConfigWriteTarget;
  } | {
    kind: "invalid-entry";
  }> | null;
  readConfig?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    dmAllowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    dmPolicy?: string;
    groupPolicy?: string;
    groupOverrides?: Array<{
      label: string;
      entries: Array<string | number>;
    }>;
  } | Promise<{
    dmAllowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    dmPolicy?: string;
    groupPolicy?: string;
    groupOverrides?: Array<{
      label: string;
      entries: Array<string | number>;
    }>;
  }>;
  resolveNames?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    scope: "dm" | "group";
    entries: string[];
  }) => Array<{
    input: string;
    resolved: boolean;
    name?: string | null;
  }> | Promise<Array<{
    input: string;
    resolved: boolean;
    name?: string | null;
  }>>;
  supportsScope?: (params: {
    scope: "dm" | "group" | "all";
  }) => boolean;
};
type ChannelConfiguredBindingConversationRef = {
  conversationId: string;
  parentConversationId?: string;
};
type ChannelConfiguredBindingMatch = ChannelConfiguredBindingConversationRef & {
  matchPriority?: number;
};
type ChannelCommandConversationContext = {
  accountId: string;
  threadId?: string;
  threadParentId?: string;
  senderId?: string;
  sessionKey?: string;
  parentSessionKey?: string;
  from?: string;
  chatType?: string;
  originatingTo?: string;
  commandTo?: string;
  fallbackTo?: string;
};
type ChannelConfiguredBindingProvider = {
  selfParentConversationByDefault?: boolean;
  compileConfiguredBinding: (params: {
    binding: ConfiguredBindingRule;
    conversationId: string;
  }) => ChannelConfiguredBindingConversationRef | null;
  matchInboundConversation: (params: {
    binding: ConfiguredBindingRule;
    compiledBinding: ChannelConfiguredBindingConversationRef;
    conversationId: string;
    parentConversationId?: string;
  }) => ChannelConfiguredBindingMatch | null;
  resolveCommandConversation?: (params: ChannelCommandConversationContext) => ChannelConfiguredBindingConversationRef | null;
};
type ChannelConversationBindingSupport = {
  supportsCurrentConversationBinding?: boolean;
  isCurrentConversationBindingSupported?: (params: {
    accountId: string;
  }) => boolean;
  /** Declares that live bindings come from a channel-registered adapter, never generic storage. */
  bindingStore?: "adapter";
  /**
   * Preferred placement when a command is started from a top-level conversation
   * without an existing native thread id.
   *
   * - `current`: bind/spawn in the current conversation
   * - `child`: create a child thread/conversation first
   */
  defaultTopLevelPlacement?: "current" | "child";
  resolveConversationRef?: (params: {
    accountId?: string | null;
    conversationId: string;
    parentConversationId?: string;
    threadId?: string | number | null;
  }) => {
    conversationId: string;
    parentConversationId?: string;
  } | null;
  buildBoundReplyPayload?: (params: {
    operation: "acp-spawn";
    placement: "current" | "child";
    conversation: {
      channel: string;
      accountId?: string | null;
      conversationId: string;
      parentConversationId?: string;
    };
  }) => Pick<ReplyPayload, "channelData" | "delivery" | "presentation"> | null | Promise<Pick<ReplyPayload, "channelData" | "delivery" | "presentation"> | null>;
  buildModelOverrideParentCandidates?: (params: {
    parentConversationId?: string | null;
  }) => string[] | null | undefined;
  shouldStripThreadFromAnnounceOrigin?: (params: {
    requester: {
      channel?: string;
      to?: string;
      threadId?: string | number;
    };
    entry: {
      channel?: string;
      to?: string;
      threadId?: string | number;
    };
  }) => boolean;
  setIdleTimeoutBySessionKey?: (params: {
    targetSessionKey: string;
    accountId?: string | null;
    idleTimeoutMs: number;
  }) => Array<{
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
  }>;
  setMaxAgeBySessionKey?: (params: {
    targetSessionKey: string;
    accountId?: string | null;
    maxAgeMs: number;
  }) => Array<{
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
  }>;
  createManager?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    stop: () => void | Promise<void>;
  } | Promise<{
    stop: () => void | Promise<void>;
  }>;
};
type ChannelSecurityDmRouteContext<ResolvedAccount> = ChannelSecurityContext<ResolvedAccount> & {
  accountId: string;
  principalId?: string;
};
type ChannelSecurityAdapter<ResolvedAccount = unknown> = {
  applyConfigFixes?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  resolveDmPolicy?: ChannelAdapterCallback<(ctx: ChannelSecurityContext<ResolvedAccount>) => ChannelSecurityDmPolicy | null>;
  dmRouting?: {
    resolveDmScope?: (ctx: ChannelSecurityDmRouteContext<ResolvedAccount>) => DmScope | undefined;
    resolveDmRoute?: (ctx: ChannelSecurityDmRouteContext<ResolvedAccount> & {
      route: ResolvedAgentRoute;
    }) => {
      kind: "core" | "isolated";
    } | {
      sessionKey: string;
    } | undefined;
  };
  collectWarnings?: ChannelAdapterCallback<(ctx: ChannelSecurityContext<ResolvedAccount>) => Promise<Array<string | SecurityAuditFinding>> | Array<string | SecurityAuditFinding>>;
  collectAuditFindings?: ChannelAdapterCallback<(ctx: ChannelSecurityContext<ResolvedAccount> & {
    sourceConfig: OpenClawConfig;
    orderedAccountIds: string[];
    hasExplicitAccountPath: boolean;
  }) => Promise<SecurityAuditFinding[]> | SecurityAuditFinding[]>;
};
//#endregion
//#region src/wizard/prompts.d.ts
type WizardSelectOption<T = string> = {
  value: T;
  label: string;
  hint?: string;
};
type WizardPromptNavigation = {
  canGoBack?: boolean;
  canGoForward?: boolean;
};
type WizardSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValue?: T;
  searchable?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardMultiSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValues?: T[];
  searchable?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardTextParams = {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  signal?: AbortSignal;
  sensitive?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardConfirmParams = {
  message: string;
  initialValue?: boolean;
  layout?: "inline" | "vertical";
  navigation?: WizardPromptNavigation;
};
type WizardProgress = {
  update: (message: string) => void;
  stop: (message?: string) => void;
};
type WizardDeviceCodeParams = {
  title: string;
  code: string;
  expiresInMinutes?: number;
  message?: string;
};
type WizardPrompter = {
  intro: (title: string) => Promise<void>;
  outro: (message: string) => Promise<void>;
  note: (message: string, title?: string) => Promise<void>;
  /** Present a browser device code as structured UI when the client supports it. */
  deviceCode?: (params: WizardDeviceCodeParams) => Promise<void>;
  plain?: (message: string) => Promise<void>;
  select: <T>(params: WizardSelectParams<T>) => Promise<T>;
  multiselect: <T>(params: WizardMultiSelectParams<T>) => Promise<T[]>;
  text: (params: WizardTextParams) => Promise<string>;
  confirm: (params: WizardConfirmParams) => Promise<boolean>;
  progress: (label: string) => WizardProgress;
  /** Queue an explicit browser destination for the next interactive client step. */
  openUrl?: (url: string) => Promise<void>;
  disableBackNavigation?: () => void;
};
//#endregion
//#region src/channels/plugins/setup-group-access.d.ts
/**
 * Group access policy selected during channel setup.
 */
type ChannelAccessPolicy = "allowlist" | "open" | "disabled";
//#endregion
//#region src/channels/plugins/setup-wizard-types.d.ts
type ChannelSetupPlugin = {
  id: ChannelId;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  config: ChannelConfigAdapter<unknown>;
  setupContract?: ChannelOwnedSetupContract;
  setup?: ChannelSetupAdapter;
  setupWizard?: ChannelSetupWizard | ChannelSetupWizardAdapter;
};
/** Status block shown before users select channels during setup. */
type ChannelSetupWizardStatus = {
  configuredLabel: string;
  unconfiguredLabel: string;
  configuredHint?: string;
  unconfiguredHint?: string;
  configuredScore?: number;
  unconfiguredScore?: number;
  resolveConfigured: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
  }) => boolean | Promise<boolean>;
  resolveStatusLines?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string[] | Promise<string[]>;
  resolveSelectionHint?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string | undefined | Promise<string | undefined>;
  resolveQuickstartScore?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => number | undefined | Promise<number | undefined>;
};
/** Snapshot of one credential before prompting or reusing existing config. */
type ChannelSetupWizardCredentialState = {
  accountConfigured: boolean;
  hasConfiguredValue: boolean;
  resolvedValue?: string;
  envValue?: string;
};
type ChannelSetupWizardCredentialValues = Partial<Record<string, string>>;
/** Optional explanatory note shown when its owning step is reached. */
type ChannelSetupWizardNote = {
  title: string;
  lines: string[];
  shouldShow?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => boolean | Promise<boolean>;
};
/** Lets a wizard configure an account entirely from existing environment. */
type ChannelSetupWizardEnvShortcut = {
  prompt: string;
  preferredEnvVar?: string;
  isAvailable: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  apply: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative secret/input step for a channel account credential. */
type ChannelSetupWizardCredential = {
  /** Plugin-owned key written into the runtime setup input. */
  inputKey: string;
  providerHint: string;
  credentialLabel: string;
  preferredEnvVar?: string;
  helpTitle?: string;
  helpLines?: string[];
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  allowEnv?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  inspect: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => ChannelSetupWizardCredentialState;
  shouldPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    currentValue?: string;
    state: ChannelSetupWizardCredentialState;
  }) => boolean | Promise<boolean>;
  applyUseEnv?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
  applySet?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    value: unknown;
    resolvedValue: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative text step that can depend on resolved credentials. */
type ChannelSetupWizardTextInput = {
  /** Plugin-owned key written into the runtime setup input. */
  inputKey: string;
  message: string;
  placeholder?: string;
  /** Mask input and keep any configured value server-side. */
  sensitive?: boolean;
  required?: boolean;
  applyEmptyValue?: boolean;
  helpTitle?: string;
  helpLines?: string[];
  confirmCurrentValue?: boolean;
  keepPrompt?: string | ((value: string) => string);
  currentValue?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined | Promise<string | undefined>;
  initialValue?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined | Promise<string | undefined>;
  shouldPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    currentValue?: string;
  }) => boolean | Promise<boolean>;
  applyCurrentValue?: boolean;
  validate?: (params: {
    value: string;
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined;
  normalizeValue?: (params: {
    value: string;
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string;
  applySet?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    value: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
type ChannelSetupWizardAllowFromEntry = {
  input: string;
  resolved: boolean;
  id: string | null;
};
/** Channel-specific resolver for user-entered allowlist targets. */
type ChannelSetupWizardAllowFrom = {
  helpTitle?: string;
  helpLines?: string[];
  credentialInputKey?: string;
  message: string;
  placeholder: string;
  invalidWithoutCredentialNote: string;
  parseInputs?: (raw: string) => string[];
  parseId: (raw: string) => string | null;
  resolveEntries: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    entries: string[];
  }) => Promise<ChannelSetupWizardAllowFromEntry[]>;
  apply: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    allowFrom: string[];
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative group/DM access policy step used by interactive setup. */
type ChannelSetupWizardGroupAccess = {
  label: string;
  placeholder: string;
  helpTitle?: string;
  helpLines?: string[];
  skipAllowlistEntries?: boolean;
  currentPolicy: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => ChannelAccessPolicy;
  currentEntries: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => string[];
  updatePrompt: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  setPolicy: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    policy: ChannelAccessPolicy;
  }) => OpenClawConfig;
  resolveAllowlist?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    entries: string[];
    prompter: Pick<WizardPrompter, "note">;
  }) => Promise<unknown>;
  applyAllowlist?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    resolved: unknown;
  }) => OpenClawConfig;
};
/** Optional pre-step hook for deriving helper config or credential values. */
type ChannelSetupWizardPrepare = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  credentialValues: ChannelSetupWizardCredentialValues;
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
}) => {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
/** Optional post-step hook for final validation, writes, or post prompts. */
type ChannelSetupWizardFinalize = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  credentialValues: ChannelSetupWizardCredentialValues;
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
  forceAllowFrom: boolean;
}) => {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
/** Full declarative setup wizard consumed by the generic setup adapter. */
type ChannelSetupWizard = {
  channel: string;
  status: ChannelSetupWizardStatus;
  introNote?: ChannelSetupWizardNote;
  envShortcut?: ChannelSetupWizardEnvShortcut;
  resolveAccountIdForConfigure?: (params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    options?: ChannelSetupConfigureContext["options"];
    accountOverride?: string;
    shouldPromptAccountIds: boolean;
    listAccountIds: ChannelSetupPlugin["config"]["listAccountIds"];
    defaultAccountId: string;
  }) => string | Promise<string>;
  resolveShouldPromptAccountIds?: (params: {
    cfg: OpenClawConfig;
    options?: ChannelSetupConfigureContext["options"];
    shouldPromptAccountIds: boolean;
  }) => boolean;
  prepare?: ChannelSetupWizardPrepare;
  stepOrder?: "credentials-first" | "text-first";
  credentials: ChannelSetupWizardCredential[];
  textInputs?: ChannelSetupWizardTextInput[];
  finalize?: ChannelSetupWizardFinalize;
  completionNote?: ChannelSetupWizardNote;
  dmPolicy?: ChannelSetupDmPolicy;
  allowFrom?: ChannelSetupWizardAllowFrom;
  groupAccess?: ChannelSetupWizardGroupAccess;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
  onAccountRecorded?: ChannelSetupWizardAdapter["onAccountRecorded"];
};
/** Runtime options for selecting and configuring one or more channels. */
type SetupChannelsOptions = {
  allowDisable?: boolean;
  allowIMessageInstall?: boolean;
  allowSignalInstall?: boolean;
  /** Revalidate host authority immediately before an installer or other durable effect. */
  beforePersistentEffect?: () => Promise<void>;
  onSelection?: (selection: ChannelId[]) => void;
  onPostWriteHook?: (hook: ChannelOnboardingPostWriteHook) => void;
  accountIds?: Partial<Record<ChannelId, string>>;
  onAccountId?: (channel: ChannelId, accountId: string) => void;
  onResolvedPlugin?: (channel: ChannelId, plugin: ChannelSetupPlugin) => void;
  promptAccountIds?: boolean;
  forceAllowFromChannels?: ChannelId[];
  deferStatusUntilSelection?: boolean;
  /**
   * The controlling client finishes device linking itself after config is
   * written (e.g. Control UI renders the WhatsApp QR via web.login.*), so
   * setup surfaces must skip terminal-interactive login/link prompts.
   */
  deferDeviceLinkToClient?: boolean;
  skipStatusNote?: boolean;
  skipDmPolicyPrompt?: boolean;
  skipConfirm?: boolean;
  quickstartDefaults?: boolean;
  initialSelection?: ChannelId[];
  /** Finish after the explicitly targeted channel is configured or paused. */
  finishAfterInitialSelection?: boolean;
  secretInputMode?: "plaintext" | "ref";
};
type ChannelSetupStatus = {
  channel: ChannelId;
  configured: boolean;
  statusLines: string[];
  selectionHint?: string;
  quickstartScore?: number;
};
/** Shared context for status checks before channel selection. */
type ChannelSetupStatusContext = {
  cfg: OpenClawConfig;
  options?: SetupChannelsOptions;
  accountOverrides: Partial<Record<ChannelId, string>>;
};
/** Shared context for applying setup changes for a selected channel. */
type ChannelSetupConfigureContext = {
  cfg: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  options?: SetupChannelsOptions;
  accountOverrides: Partial<Record<ChannelId, string>>;
  shouldPromptAccountIds: boolean;
  forceAllowFrom: boolean;
};
/** Context passed after setup has written config to disk. */
type ChannelOnboardingPostWriteContext = {
  previousCfg: OpenClawConfig;
  cfg: OpenClawConfig;
  accountId: string;
  runtime: RuntimeEnv;
};
/** Deferred hook for channel work that must run after config persistence. */
type ChannelOnboardingPostWriteHook = {
  channel: ChannelId;
  accountId: string;
  run: (ctx: {
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
};
type ChannelSetupResult = {
  cfg: OpenClawConfig;
  accountId?: string;
  completion?: "configured";
} | {
  cfg: OpenClawConfig;
  /** Paused setup is persisted without configured-account hooks or routing. */
  completion: "paused";
  accountId?: never;
};
type ChannelSetupConfiguredResult = ChannelSetupResult | "skip";
type ChannelSetupInteractiveContext = ChannelSetupConfigureContext & {
  configured: boolean;
  label: string;
};
/** Optional direct-message policy contract exposed by setup adapters. */
type ChannelSetupDmPolicy = {
  label: string;
  channel: ChannelId;
  policyKey: string;
  allowFromKey: string;
  resolveConfigKeys?: (cfg: OpenClawConfig, accountId?: string) => {
    policyKey: string;
    allowFromKey: string;
  };
  getCurrent: (cfg: OpenClawConfig, accountId?: string) => DmPolicy;
  setPolicy: (cfg: OpenClawConfig, policy: DmPolicy, accountId?: string) => OpenClawConfig;
  promptAllowFrom?: (params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    accountId?: string;
  }) => Promise<OpenClawConfig>;
};
/** Imperative adapter consumed by onboarding and setup flows. */
type ChannelSetupWizardAdapter = {
  channel: ChannelId;
  getStatus: (ctx: ChannelSetupStatusContext) => Promise<ChannelSetupStatus>;
  configure: (ctx: ChannelSetupConfigureContext) => Promise<ChannelSetupResult>;
  configureInteractive?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
  configureWhenConfigured?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
  afterConfigWritten?: (ctx: ChannelOnboardingPostWriteContext) => Promise<void> | void;
  dmPolicy?: ChannelSetupDmPolicy;
  onAccountRecorded?: (accountId: string, options?: SetupChannelsOptions) => void;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
};
//#endregion
export { ChannelMessageActionAdapter as $, LegacyInteractiveReply as $t, chunkByNewline as A, TurnAdoptionLifecycle as At, SecurityAuditFinding as B, HistoryMediaEntry as Bt, ChannelSecurityAdapter as C, OriginatingChannelType as Ct, ChannelOutboundAdapter as D, GetReplyOptions as Dt, ChannelDeliveryCapabilities as E, BlockReplyContext as Et, resolveChunkMode as F, TranscriptTurnBoundary as Ft, ChannelAccountSnapshot as G, LegacyMediaContextKey as Gt, resolveAgentRoute as H, CommandTurnKind as Ht, resolveTextChunkLimit as I, AgentPlanStep as It, ChannelAgentToolFactory as J, MediaKind as Jt, ChannelAgentPromptAdapter as K, MediaFact as Kt, OutboundDeliveryResult as L, ExecutionIdentityAdmissionFacts as Lt, chunkMarkdownTextWithMode as M, UserTurnTranscriptRecorder as Mt, chunkText as N, TranscriptEntryAnchor as Nt, OutboundIdentity as O, PartialReplyPayload as Ot, chunkTextWithMode as P, TranscriptTurnAdmission as Pt, ChannelMentionAdapter as Q, ReplyPayload as Qt, OutboundPayloadDeliveryOutcome as R, ExecutionIdentityAdmissionToken as Rt, ChannelSecretsAdapter as S, MsgContext as St, ChannelPairingAdapter as T, SupplementalContextFacts as Tt, LegacyConfigRule as U, InputProvenance as Ut, buildAgentSessionKey as V, CommandTurnContext as Vt, BaseProbeResult as W, PluginHookChannelContext as Wt, ChannelDirectoryEntry as X, InboundEventKind as Xt, ChannelCapabilities as Y, mediaKindFromMime as Yt, ChannelGroupContext as Z, ReplyMediaAttachment as Zt, ChannelGatewayContext as _, AgentToolUpdateCallback as _n, OutboundMediaReadFile as _t, ChannelApprovalCapability as a, PluginApprovalRequestPayload as an, ChannelThreadingAdapter as at, ChannelLifecycleAdapter as b, StreamFn as bn, InboundSourceModality as bt, ChannelConfigAdapter as c, ExecAsk as cn, ConversationReadInvocationOrigin as ct, ChannelDirectoryAdapter as d, ExecTarget as dn, ChannelMessageSendTextContext as dt, MessagePresentation as en, ChannelMessagingAdapter as et, ChannelDoctorAdapter as f, ApprovalScope as fn, MessageReceipt as ft, ChannelGatewayAdapter as g, AgentToolResult as gn, OutboundMediaAccess as gt, ChannelElevatedAdapter as h, AgentTool as hn, OutboundSendDeps as ht, ChannelAllowlistAdapter as i, PluginApprovalRequest as in, ChannelStreamingAdapter as it, chunkMarkdownText as j, UserTurnInput as jt, OutboundDeliveryFormattingOptions as k, TaskSuggestionDeliveryMode as kt, ChannelConfiguredBindingProvider as l, ExecMode as ln, ChannelMessageAdapterShape as lt, ChannelDoctorLegacyConfigRule as m, AgentMessage as mn, RenderedMessageBatchPlanItem as mt, ChannelSetupWizardAdapter as n, ReplyPayloadDelivery as nn, ChannelOutboundTargetMode as nt, ChannelAuthAdapter as o, ExecApprovalDecision as on, ChannelThreadingToolContext as ot, ChannelDoctorConfigMutation as p, CompactionResult as pn, OutboundReplyFacts as pt, ChannelAgentTool as q, PromptImageOrderEntry as qt, WizardPrompter as r, ChannelApprovalKind as rn, ChannelStatusIssue as rt, ChannelCommandAdapter as s, ExecApprovalRequestPayload as sn, ChannelLegacyStateMigrationPlan as st, ChannelSetupWizard as t, MessagePresentationAction as tn, ChannelMeta as tt, ChannelConversationBindingSupport as u, ExecSecurity as un, ChannelMessageSendMediaContext as ut, ChannelGroupAdapter as v, BashExecutionMessage as vn, FinalizedMsgContext as vt, ChannelStatusAdapter as w, SessionTranscriptContext as wt, ChannelResolverAdapter as x, ToolExecutionMode as xn, MentionSource as xt, ChannelHeartbeatAdapter as y, CustomMessage as yn, FinalizedRuntimeMsgContext as yt, OutboundPayloadDeliverySuppressionReason as z, HistoryEntry as zt };