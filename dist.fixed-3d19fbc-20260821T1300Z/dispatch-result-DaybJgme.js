//#region src/channels/turn/dispatch-result.ts
/** Zero-filled reply dispatch count map used before merging optional provider counts. */
const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS = {
	tool: 0,
	block: 0,
	final: 0
};
/** Resolves dispatch counts with missing reply kinds filled as zero. */
function resolveChannelTurnDispatchCounts(result) {
	return {
		...EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
		...result?.counts
	};
}
/** Returns whether a turn produced any visible reply delivery signal. */
function hasVisibleChannelTurnDispatch(result, signals = {}) {
	const counts = resolveChannelTurnDispatchCounts(result);
	return result?.observedReplyDelivery === true || signals.observedReplyDelivery === true || signals.fallbackDelivered === true || signals.deliverySummaryDelivered === true || result?.queuedFinal === true || counts.tool > 0 || counts.block > 0 || counts.final > 0;
}
/** Returns whether a turn produced a final reply, fallback, summary, or queued final payload. */
function hasFinalChannelTurnDispatch(result, signals = {}) {
	const counts = resolveChannelTurnDispatchCounts(result);
	return signals.fallbackDelivered === true || signals.deliverySummaryDelivered === true || result?.queuedFinal === true || counts.final > 0;
}
//#endregion
export { resolveChannelTurnDispatchCounts as i, hasFinalChannelTurnDispatch as n, hasVisibleChannelTurnDispatch as r, EMPTY_CHANNEL_TURN_DISPATCH_COUNTS as t };
