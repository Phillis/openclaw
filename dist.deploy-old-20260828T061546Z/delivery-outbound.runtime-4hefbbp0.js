import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-Dbglb2uR.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import { t as buildOutboundSessionContext } from "./session-context-DpR13vn3.js";
import { r as createChannelReplyTransform } from "./reply-transform-CxQ46tLk.js";
import { n as sendDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-DNBXqsC_.js";
import "./runtime-ZE9Fgx13.js";
import { n as resolveAgentOutboundIdentity } from "./identity-BZBl_h-D.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CzQHPhLv.js";
//#region src/cron/isolated-agent/delivery-outbound.runtime.ts
function resolveCronChannelReplyTransform(params) {
	const messaging = getLoadedChannelPluginForRead(normalizeAnyChannelId(params.channel) ?? params.channel)?.messaging;
	const transform = createChannelReplyTransform({
		...params,
		messaging
	});
	return transform ? { apply: transform } : void 0;
}
//#endregion
export { buildOutboundSessionContext, createOutboundSendDeps, durableMessageBatchMayHaveReachedRecipient, enqueueSystemEvent, resolveAgentOutboundIdentity, resolveCronChannelReplyTransform, sendDurableMessageBatchCore };
