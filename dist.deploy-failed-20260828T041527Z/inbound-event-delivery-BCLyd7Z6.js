import { t as createInboundEventDeliveryCorrelation } from "./inbound-event-delivery-CTNTAGiS.js";
import { l as stripTelegramInternalPrefixes } from "./topic-conversation-Cl4csGES.js";
//#region extensions/telegram/src/inbound-event-delivery.ts
function normalizeTelegramDeliveryTarget(value) {
	return stripTelegramInternalPrefixes(value).toLowerCase();
}
function stripTelegramTopicTarget(value) {
	return value.replace(/:topic:\d+$/u, "");
}
function hasTelegramTopicTarget(value) {
	return /:topic:\d+$/u.test(value);
}
function telegramDeliveryTargetsMatch(expected, actual) {
	const expectedTarget = normalizeTelegramDeliveryTarget(expected);
	const actualTarget = normalizeTelegramDeliveryTarget(actual);
	if (expectedTarget === actualTarget) return true;
	if (hasTelegramTopicTarget(expectedTarget)) return false;
	const expectedBase = stripTelegramTopicTarget(expectedTarget);
	const actualBase = stripTelegramTopicTarget(actualTarget);
	return expectedBase === actualBase && (expectedTarget === expectedBase || actualTarget === actualBase);
}
const telegramInboundEventDelivery = createInboundEventDeliveryCorrelation({ targetsMatch: telegramDeliveryTargetsMatch });
//#endregion
export { telegramInboundEventDelivery as t };
