import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeConversationRef } from "./session-binding-normalization-CFh5eVeP.js";
import { t as getSessionBindingService } from "./session-binding-service-tMO6MxaM.js";
import { r as resolveConversationBindingContextFromAcpCommand } from "./conversation-binding-input-D6QuFe0A.js";
import { n as commandReply } from "./command-gates-BJ_TboV4.js";
//#region src/auto-reply/reply/commands-subagents/action-unfocus.ts
async function handleSubagentsUnfocusAction(ctx) {
	const { params } = ctx;
	const bindingService = getSessionBindingService();
	const bindingContext = resolveConversationBindingContextFromAcpCommand(params);
	if (!bindingContext) return commandReply("⚠️ /unfocus must be run inside a focused conversation.");
	const binding = bindingService.resolveByConversation(normalizeConversationRef({
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		parentConversationId: bindingContext.parentConversationId
	}));
	if (!binding) return commandReply("ℹ️ This conversation is not currently focused.");
	const senderId = normalizeOptionalString(params.command.senderId) ?? "";
	const boundBy = normalizeOptionalString(binding.metadata?.boundBy) ?? "";
	if (boundBy && boundBy !== "system" && senderId && senderId !== boundBy) return commandReply(`⚠️ Only ${boundBy} can unfocus this conversation.`);
	await bindingService.unbind({
		bindingId: binding.bindingId,
		reason: "manual"
	});
	return commandReply("✅ Conversation unfocused.");
}
//#endregion
export { handleSubagentsUnfocusAction };
