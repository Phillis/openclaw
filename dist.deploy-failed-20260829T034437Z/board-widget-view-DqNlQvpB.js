import { c as verifyBoardViewTicket, o as requireBoardViewTicketAuthority } from "./board-view-ticket-CzaUvvHs.js";
import { a as resolveBoardWidgetContentKindResourceUrls, i as resolveBoardWidgetContentKindByPluginKind } from "./board-widget-content-kinds-DiWZfBNV.js";
import { r as buildSandboxHostPath } from "./sandbox-host-B8_dlG6f.js";
import { a as BoardValidationError } from "./board-capabilities-hTT3cLrc.js";
import { t as buildWidgetDocument } from "./wrap-DanFiQH0.js";
//#region src/gateway/board-sandbox.ts
function grantedConnectOrigins(document) {
	if (document.grantState !== "granted") return;
	const origins = document.declared?.netOrigins;
	return origins?.length ? origins : void 0;
}
function buildBoardWidgetSandboxPath(document) {
	const connectDomains = grantedConnectOrigins(document);
	return buildSandboxHostPath({
		blockDescendantFrames: true,
		...document.resourceOrigins?.length ? { resourceDomains: [...document.resourceOrigins] } : {},
		...connectDomains ? { connectDomains } : {}
	});
}
/** Defense in depth for direct/legacy widget document loads outside the proxy host. */
function buildBoardWidgetContentSecurityPolicy(document) {
	const connectSources = grantedConnectOrigins(document)?.join(" ") ?? "'none'";
	const resourceSources = document.resourceOrigins?.join(" ") ?? "";
	return [
		"default-src 'none'",
		`script-src 'unsafe-inline' ${resourceSources}`.trim(),
		"style-src 'unsafe-inline'",
		`img-src data: ${resourceSources}`.trim(),
		`media-src data: ${resourceSources}`.trim(),
		`connect-src ${connectSources}`,
		"webrtc 'block'",
		"base-uri 'none'",
		"object-src 'none'",
		"form-action 'none'",
		"frame-src 'none'",
		"sandbox allow-scripts"
	].join("; ");
}
//#endregion
//#region src/gateway/board-widget-view.ts
function resolveAuthorizedBoardWidgetView(store, ticket, options = {}) {
	const claims = verifyBoardViewTicket(ticket, options);
	if (!claims) throw new BoardValidationError("invalid_operation", "board widget view ticket is invalid");
	const authority = requireBoardViewTicketAuthority(claims, options.gatewayContext);
	const document = claims.pluginFrame ? store.readWidgetRegistered(claims.sessionKey, claims.name) : store.readWidgetHtml(claims.sessionKey, claims.name);
	if (!document || document.grantState !== "none" && document.grantState !== "granted" || document.revision !== claims.revision || document.viewGeneration !== claims.viewGeneration) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
	if (claims.pluginFrame) {
		if (!("source" in document) || document.pluginKind !== claims.pluginFrame.pluginKind) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
		const registration = resolveBoardWidgetContentKindByPluginKind(authority.pluginRegistry, document.pluginKind);
		const resourceUrls = registration ? resolveBoardWidgetContentKindResourceUrls(registration, claims.pluginFrame.scopedHostUrl) : void 0;
		if (!registration || !resourceUrls) throw new BoardValidationError("invalid_operation", "board widget content kind is unavailable");
		const resourceOrigins = [...new Set(Object.values(resourceUrls).map((url) => new URL(url).origin))];
		const body = registration.definition.composeDocument({
			source: document.source,
			title: document.title ?? claims.name,
			resourceUrls,
			promptGranted: document.grantState === "granted" && document.declared?.tools?.includes("prompt") === true
		});
		const composed = {
			html: buildWidgetDocument(document.title ?? claims.name, body, {
				connectOrigins: document.declared?.netOrigins,
				scriptOrigins: resourceOrigins
			}),
			revision: document.revision,
			sha256: document.sha256,
			viewGeneration: document.viewGeneration,
			grantState: document.grantState,
			...document.declared ? { declared: document.declared } : {},
			resourceOrigins
		};
		return {
			sessionKey: claims.sessionKey,
			name: claims.name,
			document: composed
		};
	}
	if (!("html" in document)) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
	return {
		sessionKey: claims.sessionKey,
		name: claims.name,
		document
	};
}
//#endregion
export { buildBoardWidgetContentSecurityPolicy as n, buildBoardWidgetSandboxPath as r, resolveAuthorizedBoardWidgetView as t };
