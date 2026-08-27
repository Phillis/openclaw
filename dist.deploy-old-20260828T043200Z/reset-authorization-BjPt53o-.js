import { a as isInternalMessageChannel } from "./message-channel-BZwx7FCw.js";
import { t as resolveCommandAuthorization } from "./command-auth-Cc49F07l.js";
//#region src/auto-reply/reply/reset-authorization.ts
function isResetAuthorizedForContext(params) {
	if (!resolveCommandAuthorization(params).isAuthorizedSender) return false;
	const provider = params.ctx.Provider;
	if (!(provider ? isInternalMessageChannel(provider) : isInternalMessageChannel(params.ctx.Surface))) return true;
	const scopes = params.ctx.GatewayClientScopes;
	if (!Array.isArray(scopes) || scopes.length === 0) return true;
	return scopes.includes("operator.admin");
}
//#endregion
export { isResetAuthorizedForContext as t };
