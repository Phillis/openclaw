import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
//#region src/cli/message-secret-scope.ts
function resolveScopedChannelCandidate(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeMessageChannel(value);
	if (!normalized || !isDeliverableMessageChannel(normalized)) return;
	return normalized;
}
function resolveChannelFromTargetValue(target) {
	const trimmed = normalizeOptionalString(target);
	if (!trimmed) return;
	const separator = trimmed.indexOf(":");
	if (separator <= 0) return;
	return resolveScopedChannelCandidate(trimmed.slice(0, separator));
}
function resolveChannelFromTargets(targets) {
	if (!Array.isArray(targets)) return;
	const seen = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const channel = resolveChannelFromTargetValue(target);
		if (channel) seen.add(channel);
	}
	if (seen.size !== 1) return;
	return [...seen][0];
}
function resolveScopedAccountId(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return normalizeAccountId(trimmed);
}
/** Resolve the narrowest channel/account secret scope visible from message CLI inputs. */
function resolveMessageSecretScope(params) {
	const channel = resolveScopedChannelCandidate(params.channel) ?? resolveChannelFromTargetValue(params.target) ?? resolveChannelFromTargets(params.targets) ?? resolveScopedChannelCandidate(params.fallbackChannel);
	const accountId = resolveScopedAccountId(params.accountId) ?? resolveScopedAccountId(params.fallbackAccountId ?? void 0);
	return {
		...channel ? { channel } : {},
		...accountId ? { accountId } : {}
	};
}
//#endregion
export { resolveMessageSecretScope as t };
