import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as resolveMatrixTargetIdentity } from "./target-ids-g6UnQdM7.js";
//#region extensions/matrix/src/thread-binding-api.ts
const defaultTopLevelPlacement = "child";
function resolveMatrixInboundConversation(params) {
	const rawTarget = params.to?.trim() || params.conversationId?.trim() || "";
	const target = rawTarget ? resolveMatrixTargetIdentity(rawTarget) : null;
	const parentConversationId = target?.kind === "room" ? target.id : void 0;
	const threadId = params.threadId != null ? normalizeOptionalString(String(params.threadId)) : void 0;
	if (threadId) return {
		conversationId: threadId,
		...parentConversationId ? { parentConversationId } : {}
	};
	return parentConversationId ? { conversationId: parentConversationId } : null;
}
//#endregion
export { resolveMatrixInboundConversation as n, defaultTopLevelPlacement as t };
