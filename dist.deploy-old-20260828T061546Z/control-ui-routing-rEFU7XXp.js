import { r as normalizeControlUiBasePath } from "./grammar-HdFA7BPj.js";
import { _ as isReadHttpMethod, g as acceptsControlUiHtmlResponse } from "./http-common-Dy8Dj7pv.js";
import { i as classifyMcpAppStandalonePath, o as classifyNodeWorkspaceTransferPath, r as classifyGatewayProbePath, s as classifyWorkerGatewayPath } from "./gateway-http-route-contracts-ByqHS7gV.js";
//#region packages/session-url-contract/src/focus.ts
const FOCUS_SEGMENT = "/focus";
function normalizePathname(pathname) {
	const trimmed = pathname.trim();
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 ? withSlash.replace(/\/+$/u, "") : withSlash;
}
function isControlUiFocusPath(pathname, basePath = "") {
	const normalizedPath = normalizePathname(pathname);
	const root = `${normalizeControlUiBasePath(basePath)}${FOCUS_SEGMENT}`;
	return normalizedPath === root || normalizedPath.startsWith(`${root}/`);
}
//#endregion
//#region src/gateway/control-ui-routing.ts
const CONTROL_UI_PLUGIN_MANAGER_PATH = "/settings/plugins";
/** Keep the plugin recovery surface ahead of plugin-owned HTTP routes. */
function isControlUiPluginManagerRequest(params) {
	if (!isReadHttpMethod(params.method)) return false;
	const path = `${params.basePath}${CONTROL_UI_PLUGIN_MANAGER_PATH}`;
	return params.pathname === path || params.pathname === `${path}/`;
}
/** Core-owned standalone approval document namespace, before plugin routing. */
function isControlUiApprovalDocumentPath(params) {
	const root = `${params.basePath}/approve`;
	if (params.pathname === root || params.pathname === `${root}/`) return true;
	const prefix = `${root}/`;
	if (!params.pathname.startsWith(prefix)) return false;
	const encodedId = params.pathname.slice(prefix.length);
	return encodedId.length > 0 && !encodedId.includes("/");
}
/** Focused presentation namespace used only after plugin routing declines it. */
function isControlUiFocusDocumentPath(params) {
	return isControlUiFocusPath(params.pathname, params.basePath);
}
/** Classify an HTTP request as Control UI serving, redirect, 404, or non-Control-UI. */
function classifyControlUiRequest(params) {
	const { basePath, pathname, search, method } = params;
	const spaFallback = isControlUiPluginManagerRequest(params) || acceptsControlUiHtmlResponse(params.accept);
	if (!basePath) {
		if (pathname === "/ui" || pathname.startsWith("/ui/")) return { kind: "not-found" };
		if (classifyGatewayProbePath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (classifyMcpAppStandalonePath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (classifyWorkerGatewayPath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (classifyNodeWorkspaceTransferPath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (pathname === "/plugins" || pathname.startsWith("/plugins/")) return { kind: "not-control-ui" };
		if (pathname === "/api" || pathname.startsWith("/api/")) return { kind: "not-control-ui" };
		if (pathname === "/j" || pathname.startsWith("/j/")) return { kind: "not-control-ui" };
		if (pathname === "/v1" || pathname.startsWith("/v1/")) return { kind: "not-control-ui" };
		if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
		return {
			kind: "serve",
			spaFallback
		};
	}
	if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return { kind: "not-control-ui" };
	if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
	if (pathname === basePath) return {
		kind: "redirect",
		location: `${basePath}/${search}`
	};
	return {
		kind: "serve",
		spaFallback
	};
}
//#endregion
export { isControlUiPluginManagerRequest as i, isControlUiApprovalDocumentPath as n, isControlUiFocusDocumentPath as r, classifyControlUiRequest as t };
