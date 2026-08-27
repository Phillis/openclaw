import { r as OpenClawConfig } from "./types.openclaw-a_kGc1gJ.js";
import { i as ReplyPayload } from "./reply-payload-D83wzoq7.js";
import { r as FinalizedMsgContext } from "./templating-CW47wETJ.js";
import { Ki as ChannelDeliveryResult, Wi as ChannelDeliveryInfo } from "./host-capability-types-3XBDy-df.js";
import { n as DurableFinalDeliveryRequirement, r as DurableFinalDeliveryRequirements, t as DeliverOutboundPayloadsParams } from "./deliver-Cx1p7Uub.js";

//#region src/channels/turn/durable-delivery.d.ts
declare namespace durable_delivery_d_exports {
  export { DurableInboundReplyDeliveryOptions, DurableInboundReplyDeliveryParams, deliverInboundReplyWithMessageSendContextCore, isDurableInboundReplyDeliveryHandled, throwIfDurableInboundReplyDeliveryFailed };
}
/** Options controlling durable final delivery for inbound channel replies. */
type DurableInboundReplyDeliveryOptions = Pick<DeliverOutboundPayloadsParams, "deps" | "formatting" | "identity" | "mediaAccess" | "replyToMode" | "silent" | "threadId"> & {
  to?: string | null;
  replyToId?: string | null;
  requiredCapabilities?: DurableFinalDeliveryRequirements;
};
/** Full context required to deliver one inbound final reply through durable message sending. */
type DurableInboundReplyDeliveryParams = DurableInboundReplyDeliveryOptions & {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  ctxPayload: FinalizedMsgContext;
  payload: ReplyPayload;
  info: ChannelDeliveryInfo;
};
/** Outcome of attempting durable final delivery for an inbound reply payload. */
type DurableInboundReplyDeliveryResult = {
  status: "not_applicable";
  reason: "non_final";
} | {
  status: "unsupported";
  reason: "missing_channel" | "missing_target" | "missing_outbound_handler" | "capability_mismatch";
  capability?: DurableFinalDeliveryRequirement;
} | {
  status: "handled_visible";
  delivery: ChannelDeliveryResult;
} | {
  status: "handled_no_send";
  reason: "no_visible_result";
  delivery: ChannelDeliveryResult;
} | {
  status: "failed";
  error: unknown;
  sentBeforeError?: true;
};
/** Narrows durable delivery results that handled the payload without caller fallback. */
declare function isDurableInboundReplyDeliveryHandled(result: DurableInboundReplyDeliveryResult): result is Extract<DurableInboundReplyDeliveryResult, {
  status: "handled_visible" | "handled_no_send";
}>;
/** Throws failed durable delivery results, preserving visible-send metadata when applicable. */
declare function throwIfDurableInboundReplyDeliveryFailed(result: DurableInboundReplyDeliveryResult): void;
/** Delivers final inbound replies through the durable message-send context when supported. */
declare function deliverInboundReplyWithMessageSendContextCore(params: DurableInboundReplyDeliveryParams): Promise<DurableInboundReplyDeliveryResult>;
//#endregion
export { DurableInboundReplyDeliveryParams as n, durable_delivery_d_exports as r, DurableInboundReplyDeliveryOptions as t };