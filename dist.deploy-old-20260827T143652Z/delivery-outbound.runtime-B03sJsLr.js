import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-BwPPBT4p.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { t as buildOutboundSessionContext } from "./session-context-Boxqt1oa.js";
import { r as createChannelReplyTransform } from "./reply-transform-D4mhFVwH.js";
import { t as sendDurableMessageBatchCore } from "./send-wWzlNbvX.js";
import "./runtime-CPF6L3ll.js";
import { n as resolveAgentOutboundIdentity } from "./identity-CtdF3cRx.js";
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
export { buildOutboundSessionContext, createOutboundSendDeps, enqueueSystemEvent, resolveAgentOutboundIdentity, resolveCronChannelReplyTransform, sendDurableMessageBatchCore };
