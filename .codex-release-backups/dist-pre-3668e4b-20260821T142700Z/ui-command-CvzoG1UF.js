import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-yubNQC1L.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Cc0gbvo8.js";
import { ya as validateUiCommandParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
//#region src/gateway/server-methods/ui-command.ts
const uiCommandHandlers = { "ui.command": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateUiCommandParams, "ui.command", respond)) return;
	const commandParams = params;
	const commandSessionKey = "sessionKey" in commandParams.command ? commandParams.command.sessionKey : commandParams.sessionKey;
	const requestedSession = commandSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), commandSessionKey, commandParams.agentId) : void 0;
	if (requestedSession && !requestedSession.ok) {
		respond(false, void 0, requestedSession.error);
		return;
	}
	const canonicalSessionKey = commandSessionKey && requestedSession?.ok ? resolveStoredSessionKeyForAgentStore({
		cfg: context.getRuntimeConfig(),
		agentId: requestedSession.agentId,
		sessionKey: commandSessionKey
	}) : void 0;
	const normalizedParams = {
		...commandParams,
		...canonicalSessionKey ? { sessionKey: canonicalSessionKey } : {},
		...requestedSession?.ok ? { agentId: requestedSession.agentId } : {},
		command: canonicalSessionKey && "sessionKey" in commandParams.command ? {
			...commandParams.command,
			sessionKey: canonicalSessionKey
		} : commandParams.command
	};
	const connIds = context.getClientConnIds?.((client) => client.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && hasGatewayClientCap(client.connect.caps, GATEWAY_CLIENT_CAPS.UI_COMMANDS)) ?? /* @__PURE__ */ new Set();
	if (connIds.size === 0) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "no ui client"));
		return;
	}
	context.broadcastToConnIds("ui.command", normalizedParams, connIds);
	respond(true, { ok: true });
} };
//#endregion
export { uiCommandHandlers };
