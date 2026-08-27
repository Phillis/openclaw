import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { _a as validateToolsInvokeParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as resolveGatewayConversationReadOrigin } from "./conversation-read-origin-CcxTNkzD.js";
import { t as invokeGatewayTool } from "./tools-invoke-shared-CHXlzjf7.js";
//#region src/gateway/server-methods/tools-invoke.ts
/**
* RPC adapter for invoking gateway-visible tools from connected clients.
*/
function resolveRpcErrorCode(params) {
	if (params.requiresApproval) return "requires_approval";
	switch (params.type) {
		case "invalid_request": return "validation_error";
		case "not_found": return "not_found";
		case "tool_call_blocked": return "forbidden";
		case "tool_error": return "internal_error";
	}
	return "internal_error";
}
/** Handles `tools.invoke` with protocol-shaped success and failure payloads. */
const toolsInvokeHandlers = { "tools.invoke": async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateToolsInvokeParams, "tools.invoke", respond)) return;
	const requestedToolName = normalizeOptionalString(params.name);
	if (!requestedToolName) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid tools.invoke params: name required"));
		return;
	}
	const outcome = await invokeGatewayTool({
		cfg: context.getRuntimeConfig(),
		input: params,
		senderIsOwner: client?.connect?.scopes?.includes("operator.admin"),
		clientCaps: client?.connect?.caps,
		conversationReadOrigin: resolveGatewayConversationReadOrigin({
			client,
			requestedOrigin: params.conversationReadOrigin
		}),
		toolCallIdPrefix: "rpc",
		approvalMode: params.confirm === true ? "request" : "report"
	});
	if (outcome.ok) {
		respond(true, {
			ok: true,
			toolName: outcome.toolName,
			output: outcome.result,
			source: outcome.source
		}, void 0);
		return;
	}
	respond(true, {
		ok: false,
		toolName: outcome.toolName || requestedToolName,
		...outcome.error.requiresApproval ? { requiresApproval: true } : {},
		error: {
			code: resolveRpcErrorCode(outcome.error),
			message: outcome.error.message
		}
	}, void 0);
} };
//#endregion
export { toolsInvokeHandlers };
