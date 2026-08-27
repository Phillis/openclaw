import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./registry-DbgR8dhg.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-DUo8QOyN.js";
import { a as stripMentions } from "./mentions-BHWGvP4S.js";
import { t as resolveCommandAuthorization } from "./command-auth-Cc49F07l.js";
//#region src/auto-reply/reply/commands-context.ts
/** Builds normalized command context from inbound message and authorization state. */
/** Builds command routing/auth metadata consumed by command handlers. */
function buildCommandContext(params) {
	const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized } = params;
	const auth = resolveCommandAuthorization({
		ctx,
		cfg,
		commandAuthorized: params.commandAuthorized
	});
	const surface = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider);
	const channel = normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel ?? ctx.Provider ?? surface);
	const from = auth.from ?? normalizeOptionalString(ctx.SenderId);
	const to = auth.to ?? normalizeOptionalString(ctx.OriginatingTo);
	const abortKey = sessionKey ?? from ?? to;
	const channelId = normalizeAnyChannelId(channel) ?? (channel ? channel : void 0);
	const rawBodyNormalized = triggerBodyNormalized;
	const commandBodyNormalized = normalizeCommandBody(isGroup ? stripMentions(rawBodyNormalized, ctx, cfg, agentId) : rawBodyNormalized, { botUsername: ctx.BotUsername });
	return {
		surface,
		channel,
		channelId: channelId ?? auth.providerId,
		accountId: normalizeOptionalString(ctx.AccountId),
		ownerList: auth.ownerList,
		senderIsOwner: auth.senderIsOwner,
		isAuthorizedSender: auth.isAuthorizedSender,
		senderId: auth.senderId,
		abortKey,
		rawBodyNormalized,
		commandBodyNormalized,
		from,
		to
	};
}
//#endregion
export { buildCommandContext as t };
