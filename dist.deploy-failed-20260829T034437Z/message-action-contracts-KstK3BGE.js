import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/infra/outbound/message-action-contracts.ts
function resolveMessageSendOutcome(sendResult, action = "Message") {
	if (!sendResult || sendResult.deliveryStatus === void 0 || sendResult.deliveryStatus === "sent") return { ok: true };
	switch (sendResult.deliveryStatus) {
		case "suppressed": return {
			ok: false,
			error: `${action} send suppressed: ${sendResult.suppressionReason ?? "unknown reason"}.`
		};
		case "failed": return {
			ok: false,
			error: sendResult.error ?? `${action} send failed.`
		};
		case "partial_failed": return {
			ok: false,
			error: sendResult.error ?? `${action} send partially failed.`,
			sentBeforeError: true
		};
	}
	return sendResult.deliveryStatus;
}
function resolveMessageActionOutcome(result) {
	if (result.kind === "broadcast") {
		const failure = result.payload.results.find((entry) => !entry.ok);
		return failure ? {
			ok: false,
			error: failure.error ?? "Broadcast failed."
		} : { ok: true };
	}
	if (result.dryRun) return { ok: true };
	const outcome = result.kind === "send" ? resolveMessageSendOutcome(result.sendResult) : { ok: true };
	const payload = result.payload;
	if (!outcome.ok || !isRecord(payload) || payload.ok !== false) return outcome;
	return {
		ok: false,
		error: [
			payload.error,
			payload.warning,
			payload.hint,
			payload.reason
		].map(normalizeOptionalString).find(Boolean) ?? `Message ${result.action} failed.`
	};
}
//#endregion
export { resolveMessageSendOutcome as n, resolveMessageActionOutcome as t };
