import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as createInboundEventDeliveryCorrelation } from "./inbound-event-delivery-CTNTAGiS.js";
//#region extensions/discord/src/inbound-event-delivery.ts
const DISCORD_INBOUND_EVENT_DELIVERY_KEY = "__openclawInboundEventDelivery";
function normalizeDiscordDeliveryTarget(value) {
	return value.trim().replace(/^discord:/iu, "").replace(/^channel:/iu, "").toLowerCase();
}
const discordInboundEventDelivery = createInboundEventDeliveryCorrelation({ targetsMatch: (expected, actual) => normalizeDiscordDeliveryTarget(expected) === normalizeDiscordDeliveryTarget(actual) });
function withDiscordInboundEventDeliveryMetadata(payload, params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey || params.inboundEventKind !== "room_event") return payload;
	const channelData = asOptionalRecord(payload.channelData) ?? {};
	const discordData = asOptionalRecord(channelData.discord) ?? {};
	return {
		...payload,
		channelData: {
			...channelData,
			discord: {
				...discordData,
				[DISCORD_INBOUND_EVENT_DELIVERY_KEY]: {
					sessionKey,
					inboundEventKind: params.inboundEventKind
				}
			}
		}
	};
}
function notifyDiscordInboundEventOutboundPayloadSuccess(params) {
	const metadata = asOptionalRecord(asOptionalRecord(asOptionalRecord(params.payload.channelData)?.discord)?.[DISCORD_INBOUND_EVENT_DELIVERY_KEY]);
	if (!metadata) return;
	discordInboundEventDelivery.notify({
		sessionKey: normalizeOptionalString(metadata.sessionKey),
		inboundEventKind: normalizeOptionalString(metadata.inboundEventKind),
		to: params.to,
		accountId: params.accountId
	});
}
//#endregion
export { notifyDiscordInboundEventOutboundPayloadSuccess as n, withDiscordInboundEventDeliveryMetadata as r, discordInboundEventDelivery as t };
