import { a as resolveAgentRoute } from "./resolve-route-Dz19j5-0.js";
import "./routing-CERGQFBr.js";
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
