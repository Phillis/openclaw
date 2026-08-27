import { r as OpenClawConfig } from "./types.openclaw-a_kGc1gJ.js";
import { i as ReplyPayload } from "./reply-payload-D83wzoq7.js";
import { v as SourceReplyDeliveryMode } from "./types-Byd4mWhx.js";
import { t as InboundEventKind } from "./kind-CC2t750M.js";
import { ct as InputProvenance, m as GetReplyOptions, tt as CommandTurnContext } from "./templating-CW47wETJ.js";
//#region src/channels/typing.d.ts
type TypingCallbacks = {
  onReplyStart: () => Promise<void>;
  onIdle?: () => void; /** Called when the typing controller is cleaned up (e.g. on NO_REPLY). */
  onCleanup?: () => void;
};
type CreateTypingCallbacksParams = {
  start: () => Promise<void>;
  stop?: () => Promise<void>;
  onStartError: (err: unknown) => void;
  onStopError?: (err: unknown) => void;
  keepaliveIntervalMs?: number; /** Stop keepalive after this many consecutive start() failures. Default: 2 */
  maxConsecutiveFailures?: number; /** Maximum duration for typing indicator before auto-cleanup (safety TTL). Default: 60s */
  maxDurationMs?: number;
};
declare function createTypingCallbacks(params: CreateTypingCallbacksParams): TypingCallbacks;
//#endregion
//#region src/auto-reply/reply/response-prefix-template.d.ts
/**
 * Template interpolation for response prefix.
 *
 * Supports variables like `{model}`, `{provider}`, `{thinkingLevel}`, etc.
 * Variables are case-insensitive and unresolved ones remain as literal text.
 */
type ResponsePrefixContext = {
  /** Short model name (e.g., "gpt-5.4", "claude-opus-4-6") */model?: string; /** Full model ID including provider (e.g., "openai/gpt-5.6-sol") */
  modelFull?: string; /** Provider name (e.g., "openai", "anthropic") */
  provider?: string; /** Current thinking level (e.g., "high", "low", "off") */
  thinkingLevel?: string; /** Agent identity name */
  identityName?: string;
};
//#endregion
//#region src/auto-reply/reply/source-reply-delivery-mode.d.ts
/** Minimal inbound context needed for source-reply delivery decisions. */
type SourceReplyDeliveryModeContext = {
  ChatType?: string;
  InboundEventKind?: InboundEventKind;
  Provider?: string;
  Surface?: string;
  ExplicitDeliverRoute?: boolean;
  CommandAuthorized?: boolean;
  CommandBody?: string;
  CommandSource?: "text" | "native";
  CommandTurn?: CommandTurnContext;
  BotUsername?: string;
  InputProvenance?: InputProvenance;
};
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
 * Creates response-prefix options and a live context provider for the selected model.
 */
declare function createReplyPrefixContext(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel?: string;
  accountId?: string;
}): ReplyPrefixContextBundle;
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
type ReplyPrefixContext = ReplyPrefixContextBundle["prefixContext"];
/** Resolves whether a channel reply should use source delivery, message tools, or direct sending. */
declare function resolveChannelSourceReplyDeliveryMode(params: {
  /** Full config used to inspect source-reply delivery settings. */cfg: OpenClawConfig; /** Reply delivery context from the current channel turn. */
  ctx: SourceReplyDeliveryModeContext; /** Caller-requested delivery mode override. */
  requested?: SourceReplyDeliveryMode; /** Whether the message-send tool is available for this turn. */
  messageToolAvailable?: boolean;
}): SourceReplyDeliveryMode;
/** Reply pipeline options shared by core channel turns and plugin SDK callers. */
type ChannelReplyPipeline = ReplyPrefixOptions & {
  /** Resolves a response prefix against the pipeline's live selected-model context. */resolveResponsePrefix?: () => string | undefined; /** Optional typing lifecycle callbacks for reply generation. */
  typingCallbacks?: TypingCallbacks; /** Optional payload transform applied before channel delivery. */
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};
/** Parameters for building a channel reply pipeline with prefix, typing, and payload transforms. */
type CreateChannelReplyPipelineParams = {
  /** Full config used for reply prefix and channel plugin transform resolution. */cfg: Parameters<typeof createReplyPrefixOptions>[0]["cfg"]; /** Agent id used in reply prefix context. */
  agentId: string; /** Optional channel id for prefix context and plugin transform lookup. */
  channel?: string; /** Optional channel account id for prefix context and plugin transform lookup. */
  accountId?: string; /** Typing callback factory input. */
  typing?: CreateTypingCallbacksParams; /** Prebuilt typing callbacks that take precedence over `typing`. */
  typingCallbacks?: TypingCallbacks; /** Explicit payload transform; avoids channel plugin lookup when provided. */
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};
/** Builds the reply pipeline used by channel turns and plugin SDK reply helpers. */
declare function createChannelReplyPipeline(params: CreateChannelReplyPipelineParams): ChannelReplyPipeline;
//#endregion
export { resolveChannelSourceReplyDeliveryMode as a, createReplyPrefixContext as c, CreateTypingCallbacksParams as d, TypingCallbacks as f, createChannelReplyPipeline as i, createReplyPrefixOptions as l, CreateChannelReplyPipelineParams as n, ReplyPrefixContextBundle as o, createTypingCallbacks as p, ReplyPrefixContext as r, ReplyPrefixOptions as s, ChannelReplyPipeline as t, ResponsePrefixContext as u };