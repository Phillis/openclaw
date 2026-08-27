import { a as closeRequestAfterResponse } from "./http-body-DthsuKdw.js";
import { n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-CVTrlUeM.js";
import { u as buildMissingScopeErrorDetails } from "./validation-errors-rELRlKfn.js";
import { n as logRejectedLargePayload, r as parseContentLengthHeader } from "./diagnostic-payload-CXKe0KzH.js";
import { f as readJsonBody } from "./hooks-DPpv7j1L.js";
//#region src/gateway/control-ui-http-utils.ts
/** Returns true for idempotent HTTP methods that can read Control UI assets. */
function isReadHttpMethod(method) {
	return method === "GET" || method === "HEAD";
}
/** Returns whether an Accept header permits an HTML document response. */
function acceptsControlUiHtmlResponse(accept) {
	const normalized = accept?.trim();
	if (!normalized) return true;
	return normalized.split(",").some((entry) => {
		const [rawMediaType, ...parameters] = entry.split(";");
		if (parameters.some((parameter) => /^\s*q\s*=\s*0(?:\.0{0,3})?\s*$/i.test(parameter))) return false;
		const mediaType = rawMediaType?.trim().toLowerCase();
		return mediaType === "*/*" || mediaType === "text/*" || mediaType === "text/html" || mediaType === "application/xhtml+xml";
	});
}
/** Sends a plain-text response with the standard UTF-8 content type. */
function respondPlainText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	if (statusCode !== 204) res.setHeader("Content-Length", String(Buffer.byteLength(body)));
	res.end(body);
}
/** Sends the shared plain-text 404 response for Control UI routes. */
function respondNotFound(res) {
	respondPlainText(res, 404, "Not Found");
}
//#endregion
//#region src/gateway/http-common.ts
/**
* Apply baseline security headers that are safe for all response types (API JSON,
* HTML pages, static assets, SSE streams). Headers that restrict framing or set a
* Content-Security-Policy are intentionally omitted here because some handlers
* (canvas host, A2UI) serve content that may be loaded inside frames.
*/
function setDefaultSecurityHeaders(res, opts) {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
	const strictTransportSecurity = opts?.strictTransportSecurity;
	if (typeof strictTransportSecurity === "string" && strictTransportSecurity.length > 0) res.setHeader("Strict-Transport-Security", strictTransportSecurity);
}
/** Finish a failed request without rewriting committed headers or orphaning its transport. */
function finishFailedGatewayHttpResponse(res) {
	if (res.destroyed || res.writableEnded) return;
	if (!res.headersSent) {
		for (const header of [
			"Content-Encoding",
			"Content-Disposition",
			"Content-Range",
			"Content-Language",
			"Content-Location",
			"ETag",
			"Last-Modified",
			"Transfer-Encoding",
			"Trailer"
		]) res.removeHeader(header);
		res.setHeader("Cache-Control", "no-store");
		res.statusMessage = "Internal Server Error";
		respondPlainText(res, 500, res.statusMessage);
		return;
	}
	res.destroy();
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(body));
}
function sendMethodNotAllowed(res, allow = "POST") {
	res.setHeader("Allow", allow);
	respondPlainText(res, 405, "Method Not Allowed");
}
function sendUnauthorized(res) {
	sendJson(res, 401, { error: {
		message: "Unauthorized",
		type: "unauthorized"
	} });
}
function sendRateLimited(res, retryAfterMs) {
	if (retryAfterMs && retryAfterMs > 0) res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1e3)));
	sendJson(res, 429, { error: {
		message: "Too many failed authentication attempts. Please try again later.",
		type: "rate_limited"
	} });
}
function sendGatewayAuthFailure(res, authResult) {
	if (authResult.rateLimited) {
		sendRateLimited(res, authResult.retryAfterMs);
		return;
	}
	if (authResult.reason === "proxy_attribution_required") {
		sendJson(res, 403, { error: {
			message: "Proxy client attribution is required. Configure gateway.trustedProxies narrowly and make the proxy overwrite or safely rebuild forwarded client headers.",
			type: PROXY_ATTRIBUTION_REQUIRED_REASON
		} });
		return;
	}
	sendUnauthorized(res);
}
function sendInvalidRequest(res, message) {
	sendJson(res, 400, { error: {
		message,
		type: "invalid_request_error"
	} });
}
function parseGatewayJsonRequest(res, body, schema) {
	const parsed = schema.safeParse(body);
	if (parsed.success) return parsed.data;
	const issue = parsed.error.issues[0];
	sendInvalidRequest(res, issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid request body");
}
function buildMissingScopeForbiddenBody(missingScope, requiredScopes) {
	const details = typeof missingScope === "string" && missingScope.length > 0 ? buildMissingScopeErrorDetails({
		missingScope,
		requiredScopes: requiredScopes ?? [missingScope]
	}) : void 0;
	return {
		ok: false,
		error: {
			type: "forbidden",
			message: `missing scope: ${missingScope}`,
			...details ? { details } : {}
		}
	};
}
function sendMissingScopeForbidden(res, missingScope, requiredScopes) {
	sendJson(res, 403, buildMissingScopeForbiddenBody(missingScope, requiredScopes));
}
async function readJsonBodyOrError(req, res, maxBytes) {
	const body = await readJsonBody(req, maxBytes);
	if (!body.ok) {
		if (body.error === "payload too large") {
			const contentLength = parseContentLengthHeader(req.headers?.["content-length"]);
			logRejectedLargePayload({
				surface: "gateway.http.json",
				limitBytes: maxBytes,
				reason: "json_body_limit",
				...contentLength !== void 0 ? { bytes: contentLength } : {}
			});
			closeRequestAfterResponse(req, res);
			sendJson(res, 413, { error: {
				message: "Payload too large",
				type: "invalid_request_error"
			} });
			return;
		}
		if (body.error === "request body timeout") {
			closeRequestAfterResponse(req, res);
			sendJson(res, 408, { error: {
				message: "Request body timeout",
				type: "invalid_request_error"
			} });
			return;
		}
		sendInvalidRequest(res, body.error);
		return;
	}
	return body.value;
}
function writeDone(res) {
	res.write("data: [DONE]\n\n");
}
const SSE_CONTENT_TYPE = "text/event-stream; charset=utf-8";
function setSseHeaders(res) {
	res.statusCode = 200;
	res.setHeader("Content-Type", SSE_CONTENT_TYPE);
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders?.();
}
/** Abort reason used when the HTTP client disconnects before delivery. */
var ClientDisconnectError = class extends Error {
	constructor(message = "HTTP client disconnected") {
		super(message);
		this.name = "ClientDisconnectError";
	}
};
function watchClientDisconnect(req, res, abortController, onDisconnect) {
	const sockets = Array.from(new Set([req.socket, res.socket].filter((socket) => socket !== null)));
	if (sockets.length === 0) return () => {};
	const handleClose = () => {
		onDisconnect?.();
		if (!abortController.signal.aborted) abortController.abort(new ClientDisconnectError());
	};
	const stopWatchingResponseErrors = () => {
		res.off("error", handleClose);
		res.off("close", stopWatchingResponseErrors);
	};
	res.on("error", handleClose);
	res.once("close", stopWatchingResponseErrors);
	if (res.destroyed || sockets.some((socket) => socket.destroyed)) {
		handleClose();
		return () => {};
	}
	for (const socket of sockets) socket.on("close", handleClose);
	return () => {
		for (const socket of sockets) socket.off("close", handleClose);
	};
}
//#endregion
export { isReadHttpMethod as _, sendGatewayAuthFailure as a, sendMethodNotAllowed as c, sendUnauthorized as d, setDefaultSecurityHeaders as f, acceptsControlUiHtmlResponse as g, writeDone as h, readJsonBodyOrError as i, sendMissingScopeForbidden as l, watchClientDisconnect as m, finishFailedGatewayHttpResponse as n, sendInvalidRequest as o, setSseHeaders as p, parseGatewayJsonRequest as r, sendJson as s, SSE_CONTENT_TYPE as t, sendRateLimited as u, respondNotFound as v, respondPlainText as y };
