import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isAcpSessionKey } from "./session-key-utils-Di3FvABa.js";
import "./account-id-BH0zJUew.js";
import { t as getSessionBindingService } from "./session-binding-service-47rBLtwF.js";
import { n as listAcpBindings } from "./bindings-CI-O7TMQ.js";
import { n as normalizeBindingConfig, t as buildConfiguredAcpSessionKey } from "./persistent-bindings.types-CcnVuNNq.js";
import { r as resolveConfiguredBindingRecord } from "./configured-binding-registry-CDr04TKb.js";
//#region src/auto-reply/reply/acp-reset-target.ts
const acpResetTargetDeps = {
	getSessionBindingService,
	listAcpBindings,
	resolveConfiguredBindingRecord
};
const acpResetTargetTestApi = { setDepsForTest(overrides) {
	acpResetTargetDeps.getSessionBindingService = overrides?.getSessionBindingService ?? getSessionBindingService;
	acpResetTargetDeps.listAcpBindings = overrides?.listAcpBindings ?? listAcpBindings;
	acpResetTargetDeps.resolveConfiguredBindingRecord = overrides?.resolveConfiguredBindingRecord ?? resolveConfiguredBindingRecord;
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.acpResetTargetTestApi")] = acpResetTargetTestApi;
function resolveResetTargetAccountId(params) {
	const explicit = normalizeOptionalString(params.accountId) ?? "";
	if (explicit) return explicit;
	const configuredDefault = params.cfg.channels[params.channel]?.defaultAccount;
	return normalizeOptionalString(configuredDefault) ?? "default";
}
function resolveRawConfiguredAcpSessionKey(params) {
	for (const binding of acpResetTargetDeps.listAcpBindings(params.cfg)) {
		const bindingChannel = normalizeLowercaseStringOrEmpty(normalizeOptionalString(binding.match.channel));
		if (!bindingChannel || bindingChannel !== params.channel) continue;
		const bindingAccountId = normalizeOptionalString(binding.match.accountId) ?? "";
		if (bindingAccountId && bindingAccountId !== "*" && bindingAccountId !== params.accountId) continue;
		const peerId = normalizeOptionalString(binding.match.peer?.id) ?? "";
		const matchedConversationId = peerId === params.conversationId ? params.conversationId : peerId && peerId === params.parentConversationId ? params.parentConversationId : void 0;
		if (!matchedConversationId) continue;
		const acp = normalizeBindingConfig(binding.acp);
		return buildConfiguredAcpSessionKey({
			channel: params.channel,
			accountId: bindingAccountId && bindingAccountId !== "*" ? bindingAccountId : params.accountId,
			conversationId: matchedConversationId,
			...params.parentConversationId ? { parentConversationId: params.parentConversationId } : {},
			agentId: binding.agentId,
			mode: acp.mode === "oneshot" ? "oneshot" : "persistent",
			...acp.cwd ? { cwd: acp.cwd } : {},
			...acp.backend ? { backend: acp.backend } : {},
			...acp.label ? { label: acp.label } : {}
		});
	}
}
function resolveEffectiveResetTargetSessionKey(params) {
	const activeSessionKey = normalizeOptionalString(params.activeSessionKey);
	const activeAcpSessionKey = activeSessionKey && isAcpSessionKey(activeSessionKey) ? activeSessionKey : void 0;
	const activeIsNonAcp = Boolean(activeSessionKey) && !activeAcpSessionKey;
	const channel = normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.channel));
	const conversationId = normalizeOptionalString(params.conversationId) ?? "";
	if (!channel || !conversationId) return activeAcpSessionKey;
	const accountId = resolveResetTargetAccountId({
		cfg: params.cfg,
		channel,
		accountId: params.accountId
	});
	const parentConversationId = normalizeOptionalString(params.parentConversationId) || void 0;
	const allowNonAcpBindingSessionKey = Boolean(params.allowNonAcpBindingSessionKey);
	const serviceBinding = acpResetTargetDeps.getSessionBindingService().resolveByConversation({
		channel,
		accountId,
		conversationId,
		parentConversationId
	});
	const serviceSessionKey = serviceBinding?.targetKind === "session" ? serviceBinding.targetSessionKey.trim() : "";
	if (serviceSessionKey) {
		if (allowNonAcpBindingSessionKey) return serviceSessionKey;
		return isAcpSessionKey(serviceSessionKey) ? serviceSessionKey : void 0;
	}
	if (activeIsNonAcp && params.skipConfiguredFallbackWhenActiveSessionNonAcp) return;
	const configuredBinding = acpResetTargetDeps.resolveConfiguredBindingRecord({
		cfg: params.cfg,
		channel,
		accountId,
		conversationId,
		parentConversationId
	});
	const configuredSessionKey = configuredBinding?.record.targetKind === "session" ? configuredBinding.record.targetSessionKey.trim() : "";
	if (configuredSessionKey) {
		if (allowNonAcpBindingSessionKey) return configuredSessionKey;
		return isAcpSessionKey(configuredSessionKey) ? configuredSessionKey : void 0;
	}
	const rawConfiguredSessionKey = resolveRawConfiguredAcpSessionKey({
		cfg: params.cfg,
		channel,
		accountId,
		conversationId,
		...parentConversationId ? { parentConversationId } : {}
	});
	if (rawConfiguredSessionKey) return rawConfiguredSessionKey;
	if (params.fallbackToActiveAcpWhenUnbound === false) return;
	return activeAcpSessionKey;
}
//#endregion
export { resolveEffectiveResetTargetSessionKey as t };
