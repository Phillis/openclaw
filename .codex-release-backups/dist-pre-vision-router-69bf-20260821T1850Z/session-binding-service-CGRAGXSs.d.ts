import { a as SessionBindingPlacement, i as SessionBindingCapabilities, n as ConversationRef, o as SessionBindingRecord, r as SessionBindingBindInput, s as SessionBindingUnbindInput } from "./session-binding.types-iPttD8T3.js";

//#region src/infra/outbound/session-binding-service.d.ts
type SessionBindingService = {
  bind: (input: SessionBindingBindInput) => Promise<SessionBindingRecord>;
  getCapabilities: (params: {
    channel: string;
    accountId: string;
  }) => SessionBindingCapabilities;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  touch: (bindingId: string, at?: number) => void;
  unbind: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
type SessionBindingAdapterCapabilities = {
  placements?: SessionBindingPlacement[];
  bindSupported?: boolean;
  unbindSupported?: boolean;
};
type SessionBindingAdapter = {
  channel: string;
  accountId: string;
  capabilities?: SessionBindingAdapterCapabilities;
  bind?: (input: SessionBindingBindInput) => Promise<SessionBindingRecord | null>;
  listBySession: (targetSessionKey: string) => SessionBindingRecord[];
  resolveByConversation: (ref: ConversationRef) => SessionBindingRecord | null;
  touch?: (bindingId: string, at?: number) => void;
  unbind?: (input: SessionBindingUnbindInput) => Promise<SessionBindingRecord[]>;
};
declare function registerSessionBindingAdapter(adapter: SessionBindingAdapter): void;
declare function unregisterSessionBindingAdapter(params: {
  channel: string;
  accountId: string;
  adapter?: SessionBindingAdapter;
}): void;
declare function getSessionBindingService(): SessionBindingService;
declare const testing: {
  resetSessionBindingAdaptersForTests(): void;
  getRegisteredAdapterKeys(): string[];
};
//#endregion
export { testing as a, registerSessionBindingAdapter as i, SessionBindingService as n, unregisterSessionBindingAdapter as o, getSessionBindingService as r, SessionBindingAdapter as t };