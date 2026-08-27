import { _ as ChannelRouteRef, r as GroupKeyResolution } from "./types-ByIHlRxL.js";
import { s as MsgContext } from "./templating-DzyASgcc.js";
import { t as PairingChannel } from "./pairing-store.types-Clt16zYO.js";

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
type RecordInboundSession = (params: {
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
 * Placement requested when binding a child/current session to a conversation.
 */
type SessionBindingPlacement = "current" | "child";
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
/**
 * Request to create or refresh a session binding for a conversation.
 */
type SessionBindingBindInput = {
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  placement?: SessionBindingPlacement;
  metadata?: Record<string, unknown>;
  ttlMs?: number;
};
/**
 * Request to remove bindings by id or target session.
 */
type SessionBindingUnbindInput = {
  bindingId?: string;
  targetSessionKey?: string;
  reason: string;
};
/**
 * Capability summary exposed by the active binding adapter for a conversation scope.
 */
type SessionBindingCapabilities = {
  adapterAvailable: boolean;
  bindSupported: boolean;
  unbindSupported: boolean;
  placements: SessionBindingPlacement[];
};
//#endregion
//#region src/pairing/pairing-messages.d.ts
declare function buildPairingReply(params: {
  channel: PairingChannel;
  idLine: string;
  code: string;
}): string;
//#endregion
export { SessionBindingCapabilities as a, SessionBindingUnbindInput as c, SessionBindingBindInput as i, InboundLastRouteUpdate as l, BindingTargetKind as n, SessionBindingPlacement as o, ConversationRef as r, SessionBindingRecord as s, buildPairingReply as t, RecordInboundSession as u };