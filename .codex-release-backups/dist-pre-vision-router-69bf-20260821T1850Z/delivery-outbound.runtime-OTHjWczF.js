import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-W2ggd3eH.js";
import { a as enqueueSystemEvent } from "./system-events-DecgSLEt.js";
import { t as buildOutboundSessionContext } from "./session-context-CG6rue8D.js";
import { r as createChannelReplyTransform } from "./reply-transform-DBbT-l1w.js";
import { t as sendDurableMessageBatchCore } from "./send-DH9f4Dxk.js";
import "./runtime-B5A_7-7V.js";
import { n as resolveAgentOutboundIdentity } from "./identity-CIPut7-n.js";
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
