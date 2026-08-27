import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { i as resolveSignalTarget } from "./approval-auth-BsYHLTHK.js";
import { c as resolveSignalApprovalTargetAuthorKeys, s as resolveSignalApprovalConversationKey } from "./approval-reactions-Cm58jTRF.js";
import { createQuestionReactionTargetStore, questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
//#region extensions/signal/src/question-reactions.ts
var question_reactions_exports = /* @__PURE__ */ __exportAll({
	maybeResolveSignalQuestionReaction: () => maybeResolveSignalQuestionReaction,
	registerSignalQuestionReactionTargetForDeliveredPayload: () => registerSignalQuestionReactionTargetForDeliveredPayload
});
function buildKey(identity) {
	const values = [
		identity.accountId,
		identity.conversationKey,
		identity.messageId
	].map((value) => value.trim());
	return values.every(Boolean) ? values.join(":") : null;
}
const questionReactionTargets = createQuestionReactionTargetStore({
	channel: "signal",
	channelDisplayName: "Signal",
	buildKey,
	identityMatches: (stored, incoming) => Boolean(stored && incoming?.some((authorKey) => stored.includes(authorKey))),
	registerChannelDelivery: questionGatewayRuntime.registerChannelDelivery,
	resolveReaction: questionGatewayRuntime.resolveReaction
});
function resolveConversationKey(params) {
	try {
		return resolveSignalTarget({
			cfg: params.cfg,
			accountId: params.accountId,
			input: params.to
		})?.to ?? resolveSignalApprovalConversationKey(params.to);
	} catch {
		return resolveSignalApprovalConversationKey(params.to);
	}
}
function registerSignalQuestionReactionTargetForDeliveredPayload(params) {
	const binding = questionGatewayRuntime.readReactionBinding(params.payload);
	if (params.target.channel !== "signal" || !binding) return false;
	const conversationKey = resolveConversationKey({
		cfg: params.cfg,
		...params.target
	});
	const targetAuthorKeys = resolveSignalApprovalTargetAuthorKeys(params);
	if (!conversationKey || targetAuthorKeys.length === 0) return false;
	const accountId = normalizeAccountId(params.target.accountId ?? void 0);
	let registered = false;
	for (const result of params.results) {
		const messageId = result.channel === "signal" ? result.messageId.trim() : "";
		if (!messageId || messageId === "unknown") continue;
		registered = questionReactionTargets.register(binding, {
			accountId,
			conversationKey,
			messageId
		}, targetAuthorKeys) || registered;
	}
	return registered;
}
async function maybeResolveSignalQuestionReaction(params) {
	if (params.isRemove) return false;
	const optionIndex = questionGatewayRuntime.resolveReactionIndex(params.reactionKey);
	if (optionIndex === void 0) return false;
	const authorKeys = resolveSignalApprovalTargetAuthorKeys(params);
	return await questionReactionTargets.resolve({
		identities: [{
			accountId: params.accountId,
			conversationKey: params.conversationKey,
			messageId: params.messageId
		}],
		optionIndex,
		cfg: params.cfg,
		senderId: params.actorId,
		gatewayUrl: params.gatewayUrl,
		metadata: authorKeys,
		logDebug: params.logDebug
	});
}
//#endregion
export { question_reactions_exports as n, registerSignalQuestionReactionTargetForDeliveredPayload as r, maybeResolveSignalQuestionReaction as t };
