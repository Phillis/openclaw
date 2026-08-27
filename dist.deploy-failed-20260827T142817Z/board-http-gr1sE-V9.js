import { c as sendMethodNotAllowed } from "./http-common-CJ1Ivcyn.js";
import "./board-view-ticket-BF1ZeJAn.js";
import { i as respondPlainText, n as isReadHttpMethod, r as respondNotFound } from "./control-ui-http-utils-Bg-q1q5E.js";
import { n as boardStore, r as buildBoardWidgetContentSecurityPolicy, t as resolveAuthorizedBoardWidgetView } from "./board-widget-view-CWBMXgfu.js";
//#region src/gateway/board-http.ts
const BOARD_WIDGET_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;
function parseBoardWidgetPath(pathname) {
	const match = /^\/__openclaw__\/board\/([^/]+)\/([^/]+)\/index\.html$/.exec(pathname);
	if (!match) return;
	try {
		const sessionKey = decodeURIComponent(match[1]);
		const name = decodeURIComponent(match[2]);
		if (!sessionKey || !BOARD_WIDGET_NAME_PATTERN.test(name)) return;
		return {
			sessionKey,
			name
		};
	} catch {
		return;
	}
}
function handleBoardHttpRequest(req, res, opts = {}) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const pathname = url.pathname;
	if (!pathname.startsWith("/__openclaw__/board/")) return false;
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (!isReadHttpMethod(req.method)) {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const path = parseBoardWidgetPath(pathname);
	if (!path) {
		respondNotFound(res);
		return true;
	}
	const ticket = url.searchParams.get("bt");
	if (!ticket) {
		respondPlainText(res, 401, "Unauthorized");
		return true;
	}
	let authorized;
	try {
		authorized = resolveAuthorizedBoardWidgetView(opts.store ?? boardStore, ticket, { nowMs: opts.nowMs });
	} catch {
		respondPlainText(res, 401, "Unauthorized");
		return true;
	}
	if (authorized.sessionKey !== path.sessionKey || authorized.name !== path.name) {
		respondPlainText(res, 401, "Unauthorized");
		return true;
	}
	const html = authorized.document.html;
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.setHeader("Content-Security-Policy", buildBoardWidgetContentSecurityPolicy(authorized.document));
	res.setHeader("Cache-Control", "no-cache");
	res.end(req.method === "HEAD" ? void 0 : html);
	return true;
}
//#endregion
export { handleBoardHttpRequest };
