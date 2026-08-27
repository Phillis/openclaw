import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import "./message-channel-BZwx7FCw.js";
import { d as getHeader, g as resolveOpenAiCompatibleHttpSenderIsOwner, h as resolveOpenAiCompatibleHttpOperatorScopes, s as authorizeScopedGatewayHttpRequestOrReply } from "./http-auth-utils-CrQlRW6b.js";
import { c as sendMethodNotAllowed, i as readJsonBodyOrError, m as watchClientDisconnect, s as sendJson } from "./http-common-m4pDgMA2.js";
import "./http-utils-BKAf5kRa.js";
import { t as invokeGatewayTool } from "./tools-invoke-shared-CwG07cMj.js";
//#region src/gateway/tools-invoke-http.ts
const DEFAULT_BODY_BYTES = 2 * 1024 * 1024;
/** Handle `/tools/invoke` requests and return false when another HTTP route should handle them. */
async function handleToolsInvokeHttpRequest(req, res, opts) {
	let url;
	try {
		url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
	} catch {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify({
			error: "bad_request",
			message: "Invalid request URL"
		}));
		return true;
	}
	if (url.pathname !== "/tools/invoke") return false;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res, "POST");
		return true;
	}
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter,
		operatorMethod: "agent",
		resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes
	});
	if (!authResult) return true;
	const { cfg, requestAuth, operatorScopes } = authResult;
	if (req.socket.destroyed || res.destroyed || res.socket?.destroyed) return true;
	const abortController = new AbortController();
	const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
	try {
		const bodyUnknown = await readJsonBodyOrError(req, res, opts.maxBodyBytes ?? DEFAULT_BODY_BYTES);
		if (bodyUnknown === void 0 || abortController.signal.aborted) return true;
		const body = bodyUnknown ?? {};
		const messageChannel = normalizeMessageChannel(getHeader(req, "x-openclaw-message-channel") ?? "");
		const accountId = normalizeOptionalString(getHeader(req, "x-openclaw-account-id"));
		const agentTo = normalizeOptionalString(getHeader(req, "x-openclaw-message-to"));
		const agentThreadId = normalizeOptionalString(getHeader(req, "x-openclaw-thread-id"));
		const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth);
		const outcome = await invokeGatewayTool({
			cfg,
			input: body,
			messageChannel: messageChannel ?? void 0,
			accountId,
			agentTo,
			agentThreadId,
			authenticatedUserProfile: requestAuth.authenticatedUserProfile,
			operatorScopes,
			senderIsOwner,
			conversationReadOrigin: "direct-operator",
			toolCallIdPrefix: "http",
			signal: abortController.signal
		});
		if (abortController.signal.aborted) return true;
		if (outcome.ok) sendJson(res, outcome.status, {
			ok: true,
			result: outcome.result
		});
		else sendJson(res, outcome.status, {
			ok: false,
			error: outcome.error
		});
	} finally {
		stopWatchingDisconnect();
	}
	return true;
}
//#endregion
export { handleToolsInvokeHttpRequest };
