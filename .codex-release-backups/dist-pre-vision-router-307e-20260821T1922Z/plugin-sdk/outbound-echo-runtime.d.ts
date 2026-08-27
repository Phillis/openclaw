//#region src/channels/message/outbound-echo.d.ts
type OutboundMessageIdentityScope = {
  channel: string;
  accountId?: string;
  conversationId: string;
};
type OutboundMessageIdentity = OutboundMessageIdentityScope & ({
  messageId: string;
  sourceId?: string;
} | {
  messageId?: string;
  sourceId: string;
});
/** Records a platform message id emitted by a channel's own outbound send path. */
declare function recordOutboundMessageIdentity(identity: OutboundMessageIdentity): void;
//#endregion
export { recordOutboundMessageIdentity };