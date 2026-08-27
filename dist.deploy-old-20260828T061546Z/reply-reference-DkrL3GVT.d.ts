import { a as ChannelCoreManagedTurnDeliveryAdapter, c as InboundMediaFacts, o as ChannelProviderOwnedMessageSendingDeliveryAdapter, s as ChannelTurnPlan } from "./runtime-api-B8urSeFb.js";
import "./types.openclaw-R2xZRh0U.js";
import "./types-BRhHKLsn.js";
import "./channel-contract-C7AAps4m.js";
import "./channel-outbound-Y2zUxgcH.js";
//#region src/channels/inbound-event/media.d.ts
/** Attachment metadata accepted from channel plugins before core normalization. */
type ChannelInboundMediaInput = {
  path?: string | null;
  url?: string | null;
  contentType?: string | null;
  fileName?: string | null;
  kind?: InboundMediaFacts["kind"] | null;
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
  transcribed?: boolean | null;
  messageId?: string | null;
};
//#endregion
//#region src/plugin-sdk/channel-inbound.d.ts
type ChannelInboundTurnPlan<TOwnership extends "core" | "provider_message_sending" = "core"> = ChannelTurnPlan<TOwnership extends "provider_message_sending" ? ChannelProviderOwnedMessageSendingDeliveryAdapter : ChannelCoreManagedTurnDeliveryAdapter>;
//#endregion
export { ChannelInboundMediaInput as n, ChannelInboundTurnPlan as t };