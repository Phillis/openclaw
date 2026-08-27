import { c as normalizeOptionalLowercaseString, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { a as unbindThreadBindingsBySessionKey, n as listThreadBindingsBySessionKey } from "./thread-bindings-CrOJ_YQb.js";
//#region extensions/discord/src/subagent-hooks.ts
function normalizeThreadBindingTargetKind(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "subagent" || normalized === "acp") return normalized;
}
function handleDiscordSubagentEnded(event) {
	unbindThreadBindingsBySessionKey({
		targetSessionKey: event.targetSessionKey,
		accountId: event.accountId,
		targetKind: normalizeThreadBindingTargetKind(event.targetKind),
		reason: event.reason,
		sendFarewell: event.sendFarewell
	});
}
function handleDiscordSubagentDeliveryTarget(event) {
	if (!event.expectsCompletionMessage) return;
	if (normalizeOptionalLowercaseString(event.requesterOrigin?.channel) !== "discord") return;
	const requesterAccountId = event.requesterOrigin?.accountId?.trim();
	const requesterThreadId = event.requesterOrigin?.threadId != null && event.requesterOrigin.threadId !== "" ? normalizeOptionalStringifiedId(event.requesterOrigin.threadId) ?? "" : "";
	const bindings = listThreadBindingsBySessionKey({
		targetSessionKey: event.childSessionKey,
		...requesterAccountId ? { accountId: requesterAccountId } : {},
		targetKind: "subagent"
	});
	if (bindings.length === 0) return;
	let binding;
	if (requesterThreadId) binding = bindings.find((entry) => {
		if (entry.threadId !== requesterThreadId) return false;
		if (requesterAccountId && entry.accountId !== requesterAccountId) return false;
		return true;
	});
	if (!binding && bindings.length === 1) binding = bindings[0];
	if (!binding) return;
	return { origin: {
		channel: "discord",
		accountId: binding.accountId,
		to: `channel:${binding.threadId}`,
		threadId: binding.threadId
	} };
}
//#endregion
export { handleDiscordSubagentEnded as n, handleDiscordSubagentDeliveryTarget as t };
