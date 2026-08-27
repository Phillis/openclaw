import { Br as ChannelDeliveryInfo, Hr as ChannelDeliveryResult, cd as __exportAll } from "./agent-harness-runtime-D3DJE4wK.js";
import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import { i as ReplyPayload } from "./reply-payload-BLqBLl6E.js";
import { nt as ExecutionIdentityAdmissionToken, r as FinalizedMsgContext } from "./templating-tHzj-d8O.js";
import { n as DurableFinalDeliveryRequirement, r as DurableFinalDeliveryRequirements, t as DeliverOutboundPayloadsParams } from "./deliver-contracts-X3p4-pMw.js";
import "./deliver-DtA9USSL.js";
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
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
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