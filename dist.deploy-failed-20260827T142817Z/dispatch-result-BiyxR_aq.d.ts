import { $t as ReplyDispatchKind } from "./subagent-requester-context-z4dMhVci.js";

//#region src/channels/turn/dispatch-result.d.ts
/** Minimal dispatch result shape needed to count visible channel deliveries. */
type ChannelTurnDispatchResultLike = {
  queuedFinal?: boolean;
  counts?: Partial<Record<ReplyDispatchKind, number>>;
  observedReplyDelivery?: boolean;
} | null | undefined;
/** Extra delivery signals observed outside the normal dispatch count payload. */
type ChannelTurnVisibleDeliverySignals = {
  observedReplyDelivery?: boolean;
  fallbackDelivered?: boolean;
  deliverySummaryDelivered?: boolean;
};
/** Resolves dispatch counts with missing reply kinds filled as zero. */
declare function resolveChannelTurnDispatchCounts(result: ChannelTurnDispatchResultLike): Record<ReplyDispatchKind, number>;
/** Returns whether a turn produced any visible reply delivery signal. */
declare function hasVisibleChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: ChannelTurnVisibleDeliverySignals): boolean;
/** Returns whether a turn produced a final reply, fallback, summary, or queued final payload. */
declare function hasFinalChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: Pick<ChannelTurnVisibleDeliverySignals, "fallbackDelivered" | "deliverySummaryDelivered">): boolean;
//#endregion
export { hasVisibleChannelTurnDispatch as n, resolveChannelTurnDispatchCounts as r, hasFinalChannelTurnDispatch as t };