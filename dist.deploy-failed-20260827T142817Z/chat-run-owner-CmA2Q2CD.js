import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
//#region src/gateway/chat-run-owner.ts
function resolveChatRunOwnerAgentId(params) {
	const ownerAgentId = normalizeOptionalString(params.agentId) ?? parseAgentSessionKey(params.sessionKey)?.agentId ?? normalizeOptionalString(params.defaultAgentId);
	return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function chatRunBelongsToAgent(params, agentId) {
	return resolveChatRunOwnerAgentId(params) === normalizeAgentId(agentId);
}
function chatRunBelongsToSelectedAgent(params) {
	const selectedAgentId = normalizeOptionalString(params.selectedAgentId);
	return selectedAgentId ? chatRunBelongsToAgent(params, selectedAgentId) : false;
}
//#endregion
export { chatRunBelongsToSelectedAgent as n, resolveChatRunOwnerAgentId as r, chatRunBelongsToAgent as t };
