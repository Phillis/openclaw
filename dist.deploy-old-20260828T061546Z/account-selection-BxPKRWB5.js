import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-BH0zJUew.js";
import { i as hasConfiguredAccountValue, s as resolveListedDefaultAccountId, t as createAccountListHelpers } from "./account-helpers-Cnv50TjD.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./account-core-D-Gu5DXB.js";
import "./routing-DM8631ts.js";
import "./agent-scope-runtime-D15-6dFI.js";
//#region extensions/telegram/src/account-selection.ts
function resolveBindingAccount(params) {
	if (!params.binding || typeof params.binding !== "object") return null;
	const binding = params.binding;
	if (normalizeLowercaseStringOrEmpty(binding.match?.channel) !== params.channelId) return null;
	const accountId = typeof binding.match?.accountId === "string" ? binding.match.accountId : "";
	if (!accountId.trim() || accountId.trim() === "*") return null;
	return {
		agentId: normalizeAgentId(typeof binding.agentId === "string" ? binding.agentId : void 0),
		accountId: normalizeAccountId(accountId)
	};
}
function listBoundAccountIds(cfg, channelId) {
	const ids = /* @__PURE__ */ new Set();
	for (const binding of cfg.bindings ?? []) {
		const resolved = resolveBindingAccount({
			binding,
			channelId
		});
		if (resolved) ids.add(resolved.accountId);
	}
	return [...ids].toSorted((left, right) => left.localeCompare(right));
}
function resolveDefaultAgentBoundAccountId(cfg, channelId) {
	if (cfg.agents?.ownership === "explicit" && listAgentIds(cfg).length !== 1) return null;
	const defaultAgentId = resolveDefaultAgentId(cfg);
	for (const binding of cfg.bindings ?? []) {
		const resolved = resolveBindingAccount({
			binding,
			channelId
		});
		if (resolved?.agentId === defaultAgentId) return resolved.accountId;
	}
	return null;
}
function hasImplicitDefaultTelegramAccount(cfg) {
	const telegram = cfg.channels?.telegram;
	if (!telegram) return false;
	return hasConfiguredAccountValue(telegram.botToken) || hasConfiguredAccountValue(telegram.tokenFile) || hasConfiguredAccountValue(process.env.TELEGRAM_BOT_TOKEN);
}
const { listAccountIds: listTelegramAccountIds } = createAccountListHelpers("telegram", {
	normalizeAccountId,
	additionalAccountIds: (cfg) => listBoundAccountIds(cfg, "telegram"),
	hasImplicitDefaultAccount: hasImplicitDefaultTelegramAccount
});
function resolveDefaultTelegramAccountSelection(cfg) {
	const boundDefault = resolveDefaultAgentBoundAccountId(cfg, "telegram");
	if (boundDefault) return {
		accountId: boundDefault,
		accountIds: listTelegramAccountIds(cfg),
		shouldWarnMissingDefault: false
	};
	const accountIds = listTelegramAccountIds(cfg);
	const configuredDefaultAccountId = normalizeOptionalAccountId(cfg.channels?.telegram?.defaultAccount) ?? void 0;
	const hasExplicitDefaultAccount = configuredDefaultAccountId ? accountIds.includes(configuredDefaultAccountId) : false;
	const resolved = resolveListedDefaultAccountId({
		accountIds,
		configuredDefaultAccountId
	});
	return {
		accountId: resolved,
		accountIds,
		shouldWarnMissingDefault: resolved === accountIds[0] && !hasExplicitDefaultAccount && !accountIds.includes("default") && accountIds.length > 1
	};
}
function resolveDefaultTelegramAccountId(cfg) {
	return resolveDefaultTelegramAccountSelection(cfg).accountId;
}
//#endregion
export { resolveDefaultTelegramAccountId as n, resolveDefaultTelegramAccountSelection as r, listTelegramAccountIds as t };
