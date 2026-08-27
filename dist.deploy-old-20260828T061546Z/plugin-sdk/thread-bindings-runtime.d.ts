import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import { o as SessionBindingRecord, t as BindingTargetKind } from "../session-binding.types-iPttD8T3.js";
import { a as registerSessionBindingAdapter, s as unregisterSessionBindingAdapter, t as SessionBindingAdapter } from "../session-binding-service-BxW9NhJD.js";
import { n as resolveThreadBindingLifecycle, r as resolveThreadBindingFarewellText } from "../thread-binding-lifecycle-DEqKhK0l.js";
//#region src/channels/thread-binding-id.d.ts
/** Parses an account-prefixed binding id back into a conversation id. */
declare function resolveThreadBindingConversationIdFromBindingId(params: {
  accountId: string;
  bindingId?: string;
}): string | undefined;
//#endregion
//#region src/channels/thread-bindings-policy.d.ts
/** Resolves idle timeout for a concrete channel/account config scope. */
declare function resolveThreadBindingIdleTimeoutMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
/** Resolves max age for a concrete channel/account config scope. */
declare function resolveThreadBindingMaxAgeMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number;
//#endregion
//#region src/infra/outbound/account-scoped-conversation-bindings.d.ts
/** Binding record scoped to one channel account and conversation id. */
type AccountScopedConversationBindingRecord<TKind extends string = string> = {
  accountId: string;
  conversationId: string;
  targetKind: TKind;
  targetSessionKey: string;
  agentId?: string;
  label?: string;
  boundBy?: string;
  boundAt: number;
  lastActivityAt: number;
};
/** Account-local binding manager exposed by channel-specific conversation stores. */
type AccountScopedConversationBindingManager<TKind extends string = string> = {
  accountId: string;
  getByConversationId: (conversationId: string) => AccountScopedConversationBindingRecord<TKind> | undefined;
  listBySessionKey: (targetSessionKey: string) => AccountScopedConversationBindingRecord<TKind>[];
  bindConversation: (params: {
    conversationId: string;
    targetKind: BindingTargetKind;
    targetSessionKey: string;
    metadata?: Record<string, unknown>;
  }) => AccountScopedConversationBindingRecord<TKind> | null;
  touchConversation: (conversationId: string, at?: number) => AccountScopedConversationBindingRecord<TKind> | null;
  unbindConversation: (conversationId: string) => AccountScopedConversationBindingRecord<TKind> | null;
  unbindBySessionKey: (targetSessionKey: string) => AccountScopedConversationBindingRecord<TKind>[];
  stop: () => void;
};
/** Creates a channel/account binding manager and registers it as a session-binding adapter. */
declare function createAccountScopedConversationBindingManager<TKind extends string>(params: {
  channel: string;
  cfg: OpenClawConfig;
  stateKey: symbol;
  accountId?: string | null;
  toStoredTargetKind: (raw: BindingTargetKind) => TKind;
  toSessionBindingTargetKind: (raw: TKind) => BindingTargetKind;
}): AccountScopedConversationBindingManager<TKind>;
/** Stops registered account-scoped adapters for one test key without clearing durable bindings. */
declare function resetAccountScopedConversationBindingsForTests(params: {
  stateKey: symbol;
}): void;
//#endregion
export { type AccountScopedConversationBindingManager, type AccountScopedConversationBindingRecord, type BindingTargetKind, type SessionBindingAdapter, type SessionBindingRecord, createAccountScopedConversationBindingManager, registerSessionBindingAdapter, resetAccountScopedConversationBindingsForTests, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingLifecycle, resolveThreadBindingMaxAgeMsForChannel, unregisterSessionBindingAdapter };