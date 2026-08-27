import { r as OpenClawConfig } from "../types.openclaw-D3TBp_34.js";
import { i as ReplyPayload } from "../reply-payload-BCOsEWHC.js";
import { m as GetReplyOptions, r as FinalizedMsgContext } from "../templating-DzyASgcc.js";
import { Ji as ChannelTurnDroppedHistoryOptions, Xi as ChannelTurnRecordOptions, fa as DispatchReplyWithBufferedBlockDispatcher, ia as recordChannelBotPairLoopAndCheckSuppression, ki as recordDroppedChannelTurnHistory, ra as ChannelBotLoopProtectionFacts } from "../host-capability-types-BQXGgYpD.js";
import { f as runChannelInboundEvent, i as ChannelInboundEventRunnerParams, l as dispatchChannelInboundReply, o as InboundReplyDispatchResult, p as runPreparedInboundReply, s as PreparedInboundReply, t as AssembledInboundReply } from "../channel-inbound-DJStPVKU.js";
import { n as hasVisibleChannelTurnDispatch, r as resolveChannelTurnDispatchCounts, t as hasFinalChannelTurnDispatch } from "../dispatch-result-D-HYkvBv.js";
import { n as DurableInboundReplyDeliveryParams, t as DurableInboundReplyDeliveryOptions } from "../durable-delivery-CgEypHGA.js";
import { t as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-aayBn_GJ.js";
import { t as recordInboundSession } from "../session-CBuqMVMM.js";

//#region src/infra/outbound/reply-payload-normalize.d.ts
/**
 * Outbound-facing subset of reply payload fields accepted from loose producers.
 */
type OutboundReplyPayload = {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
  presentation?: ReplyPayload["presentation"];
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  /**
   * @deprecated Use presentation. Runtime support remains for legacy producers.
   */
  interactive?: ReplyPayload["interactive"];
  channelData?: ReplyPayload["channelData"];
  sensitiveMedia?: boolean;
  replyToId?: string;
  location?: ReplyPayload["location"];
  videoAsNote?: boolean;
};
//#endregion
//#region src/plugin-sdk/inbound-reply-dispatch.d.ts
type ReplyOptionsWithoutModelSelected = Omit<Omit<GetReplyOptions, "onBlockReply">, "onModelSelected">;
type RecordInboundSessionFn = typeof recordInboundSession;
declare function buildInboundReplyDispatchBase(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  route: {
    agentId: string;
    sessionKey: string;
  };
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  core: {
    channel: {
      session: {
        recordInboundSession: RecordInboundSessionFn;
      };
      reply: {
        dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
      };
    };
  };
}): {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string | undefined;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: typeof recordInboundSession;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
};
type BuildInboundReplyDispatchBaseParams = Parameters<typeof buildInboundReplyDispatchBase>[0];
type RecordInboundSessionAndDispatchReplyParams = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSessionFn;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
  deliver: (payload: OutboundReplyPayload) => Promise<void>;
  durable?: false | DurableInboundReplyDeliveryOptions;
  onRecordError: (err: unknown) => void;
  onDispatchError: (err: unknown, info: {
    kind: string;
  }) => void;
  replyOptions?: ReplyOptionsWithoutModelSelected;
};
declare function dispatchInboundReplyWithBase(params: BuildInboundReplyDispatchBaseParams & Pick<RecordInboundSessionAndDispatchReplyParams, "deliver" | "durable" | "onRecordError" | "onDispatchError" | "replyOptions">): Promise<void>;
//#endregion
export { type AssembledInboundReply, type ChannelBotLoopProtectionFacts, type ChannelTurnDroppedHistoryOptions as ChannelInboundDroppedHistoryOptions, type ChannelTurnDroppedHistoryOptions, type ChannelInboundEventRunnerParams, type ChannelTurnRecordOptions, type ChannelTurnRecordOptions as InboundReplyRecordOptions, type DurableInboundReplyDeliveryParams, type InboundReplyDispatchResult, type PreparedInboundReply, deliverInboundReplyWithMessageSendContext, dispatchChannelInboundReply, dispatchInboundReplyWithBase, hasFinalChannelTurnDispatch as hasFinalInboundReplyDispatch, hasVisibleChannelTurnDispatch as hasVisibleInboundReplyDispatch, recordChannelBotPairLoopAndCheckSuppression, recordDroppedChannelTurnHistory as recordDroppedChannelInboundHistory, recordDroppedChannelTurnHistory, resolveChannelTurnDispatchCounts as resolveInboundReplyDispatchCounts, runChannelInboundEvent, runPreparedInboundReply };