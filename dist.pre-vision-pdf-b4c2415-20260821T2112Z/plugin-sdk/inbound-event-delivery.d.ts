//#region src/plugin-sdk/inbound-event-delivery.d.ts
type ActiveInboundEvent = {
  outboundTo: string;
  outboundAccountId?: string;
  markInboundEventDelivered: () => void;
};
type InboundEventDeliveryNotification = {
  sessionKey: string | undefined;
  to: string;
  accountId?: string | null;
  inboundEventKind?: string;
};
declare function createInboundEventDeliveryCorrelation(params: {
  targetsMatch: (expected: string, actual: string) => boolean;
}): {
  begin(sessionKey: string | undefined, event: ActiveInboundEvent, options?: {
    inboundEventKind?: string;
  }): () => void;
  notify(notification: InboundEventDeliveryNotification): void;
};
//#endregion
export { createInboundEventDeliveryCorrelation };