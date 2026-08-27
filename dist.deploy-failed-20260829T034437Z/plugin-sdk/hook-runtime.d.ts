import "../types.openclaw-Cjm06lg9.js";
import "../types-CNsppBy_.js";
import { r as FinalizedMsgContext } from "../templating-tHzj-d8O.js";
import "../index-DHJKv4R9.js";
import { X as PluginHookInboundClaimEvent, et as PluginHookMessageContext, it as MessageHookMediaFact, n as initializeGlobalHookRunner, nt as PluginHookMessageSentEvent, r as resetGlobalHookRunner, tt as PluginHookMessageReceivedEvent } from "../hook-runner-global-CAS94Rk5.js";
import { t as DiagnosticTraceContext } from "../diagnostic-trace-context-DIVmGNEt.js";
import { n as InternalHookEventType, r as InternalHookHandler, t as InternalHookEvent } from "../internal-hook-types-BwvTZGLB.js";
//#region src/hooks/fire-and-forget.d.ts
/** Queue limits for bounded fire-and-forget hook execution. */
type FireAndForgetBoundedHookOptions = {
  maxConcurrency?: number;
  maxQueue?: number;
  timeoutMs?: number;
};
/** Run a hook promise without awaiting it, logging rejection safely. */
declare function fireAndForgetHook(task: Promise<unknown>, label: string, logger?: (message: string) => void): void;
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
declare function fireAndForgetBoundedHook(task: () => Promise<unknown>, label: string, logger?: (message: string) => void, options?: FireAndForgetBoundedHookOptions): void;
//#endregion
//#region src/hooks/internal-hooks.d.ts
type MessageReceivedHookContext = {
  /** Sender identifier (e.g., phone number, user ID) */
  from: string;
  /** Message content */
  content: string;
  /** Unix timestamp when the message was received */
  timestamp?: number;
  /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string;
  /** Provider account ID for multi-account setups */
  accountId?: string;
  /** Conversation/chat ID */
  conversationId?: string;
  /** Message ID from the provider */
  messageId?: string;
  /** Staged, locally usable attachments in stable source order. */
  media?: MessageHookMediaFact[];
  /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: MessageHookMediaFact[];
  /** True when originalMedia is present but media is withheld pending staging. */
  mediaStagingPending?: boolean;
  /** Additional provider-specific metadata */
  metadata?: Record<string, unknown>;
};
type MessageSentHookContext = {
  /** Recipient identifier */
  to: string;
  /** Message content */
  content: string;
  /** Whether the message was sent successfully */
  success: boolean;
  /** Error message if sending failed */
  error?: string;
  /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string;
  /** Provider account ID for multi-account setups */
  accountId?: string;
  /** Conversation/chat ID */
  conversationId?: string;
  /** Message ID returned by the provider */
  messageId?: string;
  /** Whether this message was sent in a group/channel context */
  isGroup?: boolean;
  /** Group or channel identifier, if applicable */
  groupId?: string;
};
/**
 * Register a hook handler for a specific event type or event:action combination
 *
 * @param eventKey - Event type (e.g., 'command') or specific action (e.g., 'command:new')
 * @param handler - Function to call when the event is triggered
 *
 * @example
 * ```ts
 * // Listen to all command events
 * registerInternalHook('command', async (event) => {
 *   console.log('Command:', event.action);
 * });
 *
 * // Listen only to /new commands
 * registerInternalHook('command:new', async (event) => {
 *   await saveSessionToMemory(event);
 * });
 * ```
 */
declare function registerInternalHook(eventKey: string, handler: InternalHookHandler): void;
/**
 * Clear all registered hooks (useful for testing)
 */
declare function clearInternalHooks(): void;
/**
 * Trigger a hook event
 *
 * Calls all handlers registered for:
 * 1. The general event type (e.g., 'command')
 * 2. The specific event:action combination (e.g., 'command:new')
 *
 * Handlers are called in registration order. Errors are caught and logged
 * but don't prevent other handlers from running.
 *
 * @param event - The event to trigger
 */
declare function triggerInternalHook(event: InternalHookEvent): Promise<void>;
/**
 * Create a hook event with common fields filled in
 *
 * @param type - The event type
 * @param action - The action within that type
 * @param sessionKey - The session key
 * @param context - Additional context
 */
declare function createInternalHookEvent(type: InternalHookEventType, action: string, sessionKey: string, context?: Record<string, unknown>): InternalHookEvent;
//#endregion
//#region src/hooks/message-hook-mappers.d.ts
type CanonicalInboundMessageHookContext = {
  from: string;
  to?: string;
  content: string;
  body?: string;
  bodyForAgent?: string;
  transcript?: string;
  timestamp?: number;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  agentId?: string;
  runId?: string;
  messageId?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  provider?: string;
  surface?: string;
  threadId?: string | number;
  threadParentId?: string | number;
  media?: MessageHookMediaFact[];
  originalMedia?: MessageHookMediaFact[];
  mediaPath?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaPaths?: string[];
  mediaUrls?: string[];
  mediaTypes?: string[];
  mediaRemoteHost?: string;
  mediaStagingPending?: boolean;
  originalMediaPath?: string;
  originalMediaUrl?: string;
  originalMediaType?: string;
  originalMediaPaths?: string[];
  originalMediaUrls?: string[];
  originalMediaTypes?: string[];
  originatingChannel?: string;
  originatingTo?: string;
  guildId?: string;
  channelName?: string;
  isGroup: boolean;
  groupId?: string;
  topicName?: string;
  location?: PluginHookInboundClaimEvent["location"];
  providerUpdate?: PluginHookInboundClaimEvent["providerUpdate"];
  trace?: DiagnosticTraceContext;
  callDepth?: number;
};
type CanonicalSentMessageHookContext = {
  to: string;
  content: string;
  success: boolean;
  error?: string;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
  isGroup?: boolean;
  groupId?: string;
};
declare function deriveInboundMessageHookContext(ctx: FinalizedMsgContext, overrides?: {
  content?: string;
  messageId?: string;
}): CanonicalInboundMessageHookContext;
declare function buildCanonicalSentMessageHookContext(params: {
  to: string;
  content: string;
  success: boolean;
  error?: string;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
  isGroup?: boolean;
  groupId?: string;
}): CanonicalSentMessageHookContext;
declare function toPluginMessageContext(canonical: CanonicalInboundMessageHookContext | CanonicalSentMessageHookContext): PluginHookMessageContext;
declare function toPluginMessageReceivedEvent(canonical: CanonicalInboundMessageHookContext): PluginHookMessageReceivedEvent;
declare function toPluginMessageSentEvent(canonical: CanonicalSentMessageHookContext): PluginHookMessageSentEvent;
declare function toInternalMessageReceivedContext(canonical: CanonicalInboundMessageHookContext): MessageReceivedHookContext;
declare function toInternalMessageSentContext(canonical: CanonicalSentMessageHookContext): MessageSentHookContext;
//#endregion
export { buildCanonicalSentMessageHookContext, clearInternalHooks, createInternalHookEvent, deriveInboundMessageHookContext, fireAndForgetBoundedHook, fireAndForgetHook, initializeGlobalHookRunner, registerInternalHook, resetGlobalHookRunner, toInternalMessageReceivedContext, toInternalMessageSentContext, toPluginMessageContext, toPluginMessageReceivedEvent, toPluginMessageSentEvent, triggerInternalHook };