//#region src/worker/replay-message-window.ts
function windowWorkerReplayMessages(messages, limitMessages) {
	if (messages.length <= limitMessages) return {
		kind: "complete",
		messages
	};
	const minimumStart = messages.length - limitMessages;
	const replayIndex = messages.findLastIndex((message) => message.providerReplay !== void 0);
	if (replayIndex >= 0 && messages.length - replayIndex > limitMessages) return {
		kind: "provider-replay-unavailable",
		details: {
			reason: "provider-replay-message-limit",
			messageCount: messages.length - replayIndex,
			limitMessages
		}
	};
	const completeTurnStart = messages.findIndex((message, index) => index >= minimumStart && message.role === "user");
	const start = replayIndex >= 0 && (completeTurnStart < 0 || completeTurnStart > replayIndex) ? replayIndex : completeTurnStart;
	if (start < 0) throw new Error("Worker context has no complete user turn within the message limit.");
	return {
		kind: "complete",
		messages: messages.slice(start)
	};
}
//#endregion
export { windowWorkerReplayMessages as t };
