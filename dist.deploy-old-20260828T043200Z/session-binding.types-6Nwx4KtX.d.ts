//#region src/infra/outbound/session-binding.types.d.ts
/**
 * Runtime destination a conversation binding points at.
 */
type BindingTargetKind = "subagent" | "session";
/**
 * Lifecycle state for a registered session binding.
 */
type BindingStatus = "active" | "ending" | "ended";
/**
 * Channel/account/conversation tuple used to resolve a bound delivery route.
 */
type ConversationRef = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};
/**
 * Persistable record that connects one conversation to one target session.
 */
type SessionBindingRecord = {
  bindingId: string;
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  status: BindingStatus;
  boundAt: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
};
//#endregion
export { SessionBindingRecord as n, BindingTargetKind as t };