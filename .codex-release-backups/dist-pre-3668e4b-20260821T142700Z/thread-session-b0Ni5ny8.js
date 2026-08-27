import { h as resolveThreadSessionKeys } from "./session-key-D8GLfPr_.js";
import "./routing-CERGQFBr.js";
//#region extensions/msteams/src/monitor-handler/thread-session.ts
const TRAILING_THREAD_SUFFIX = /(?::thread:[^:]+)+$/;
function resolveMSTeamsRouteSessionKey(params) {
	const channelThreadId = params.isChannel ? params.conversationMessageId ?? params.replyToId ?? void 0 : void 0;
	const cleanBase = params.baseSessionKey.replace(TRAILING_THREAD_SUFFIX, "");
	return resolveThreadSessionKeys({
		baseSessionKey: cleanBase,
		threadId: channelThreadId,
		parentSessionKey: channelThreadId ? cleanBase : void 0
	}).sessionKey;
}
//#endregion
export { resolveMSTeamsRouteSessionKey as t };
