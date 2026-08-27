import { a as resolveAgentRoute } from "./resolve-route-CUq-ePT_.js";
import "./routing-DG_rmd7A.js";
//#region extensions/telegram/src/account-owner.ts
/** Resolves the agent that owns account-scoped Telegram runtime state. */
function resolveTelegramAccountOwnerAgentId(params) {
	return resolveAgentRoute({
		cfg: params.cfg,
		channel: "telegram",
		accountId: params.accountId
	}).agentId;
}
//#endregion
export { resolveTelegramAccountOwnerAgentId as t };
