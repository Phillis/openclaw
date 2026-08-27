import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { c as looksLikeAvatarPath, f as isRenderableAvatarImageDataUrl, i as isAvatarHttpUrl, n as hasAvatarUriScheme, r as isAvatarDataUrl, s as isWindowsAbsolutePath } from "./agent-workspace-roster-transition-DoqG2wNw.js";
import { i as matchControlUiResourceUrl, r as buildControlUiResourcePath } from "./control-ui-contract-CgrOMhfo.js";
import { n as readOpenedLocalAgentAvatarDataUrl, t as openLocalAgentAvatarFile } from "./identity-avatar-file-DgtrLWCY.js";
import { t as DEFAULT_ASSISTANT_IDENTITY } from "./assistant-identity-DhH5lN5I.js";
import fs from "node:fs";
//#region src/gateway/assistant-avatar-cache.ts
const GATEWAY_AVATAR_DATA_URL_CACHE_MAX_ENTRIES = 4;
function createGatewayAvatarDataUrlCache(params) {
	const maxEntries = params?.maxEntries ?? GATEWAY_AVATAR_DATA_URL_CACHE_MAX_ENTRIES;
	const read = params?.read ?? readOpenedLocalAgentAvatarDataUrl;
	const close = params?.close ?? ((fd) => fs.closeSync(fd));
	const entries = /* @__PURE__ */ new Map();
	return { read(opened) {
		const cached = entries.get(opened.path);
		if (cached && cached.ctimeMs === opened.stat.ctimeMs && cached.dev === opened.stat.dev && cached.ino === opened.stat.ino && cached.mtimeMs === opened.stat.mtimeMs && cached.size === opened.stat.size) {
			close(opened.fd);
			entries.delete(opened.path);
			entries.set(opened.path, cached);
			return cached.dataUrl;
		}
		entries.delete(opened.path);
		const dataUrl = read(opened);
		if (!dataUrl || maxEntries <= 0) return dataUrl;
		entries.set(opened.path, {
			ctimeMs: opened.stat.ctimeMs,
			dev: opened.stat.dev,
			ino: opened.stat.ino,
			mtimeMs: opened.stat.mtimeMs,
			size: opened.stat.size,
			dataUrl
		});
		pruneMapToMaxSize(entries, maxEntries);
		return dataUrl;
	} };
}
//#endregion
//#region src/gateway/assistant-avatar.ts
const gatewayAvatarDataUrlCache = createGatewayAvatarDataUrlCache();
function resolveSameOriginAvatarUrl(cfg, source) {
	const basePath = cfg.gateway?.controlUi?.basePath;
	const unbased = matchControlUiResourceUrl("agentAvatar", source);
	if (unbased) return `${buildControlUiResourcePath("agentAvatar", basePath, unbased.value)}${unbased.search}${unbased.hash}`;
	return matchControlUiResourceUrl("agentAvatar", source, basePath) ? source : void 0;
}
/**
* Resolve and open a selected local avatar for route delivery.
* A projection with `openedFile` transfers fd ownership to the caller.
*/
function openGatewayAssistantAvatar(params) {
	const { cfg, identity } = params;
	const source = identity.avatar;
	if (isAvatarHttpUrl(source)) return { resolution: {
		kind: "remote",
		url: source,
		source
	} };
	if (isRenderableAvatarImageDataUrl(source)) return { resolution: {
		kind: "data",
		url: source,
		source
	} };
	if (isAvatarDataUrl(source)) return { resolution: {
		kind: "none",
		reason: "unsupported_data_url",
		source
	} };
	if (hasAvatarUriScheme(source) && !isWindowsAbsolutePath(source)) return { resolution: {
		kind: "none",
		reason: "unsupported_uri",
		source
	} };
	if (resolveSameOriginAvatarUrl(cfg, source)) return { resolution: null };
	if (!looksLikeAvatarPath(source)) return { resolution: null };
	const opened = openLocalAgentAvatarFile({
		cfg,
		agentId: identity.agentId,
		source
	});
	if (!opened.ok) return { resolution: {
		kind: "none",
		reason: opened.reason,
		source
	} };
	return {
		resolution: {
			kind: "local",
			filePath: opened.file.path,
			source
		},
		openedFile: opened.file
	};
}
/** Resolve one selected identity avatar and its matching public metadata. */
function resolveGatewayAssistantAvatar(params) {
	const { cfg, identity } = params;
	const source = identity.avatar;
	const sameOriginAvatarUrl = resolveSameOriginAvatarUrl(cfg, source);
	if (sameOriginAvatarUrl) return {
		avatar: sameOriginAvatarUrl,
		resolution: null
	};
	const opened = openGatewayAssistantAvatar(params);
	if (opened.resolution?.kind === "none") return {
		avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		resolution: opened.resolution
	};
	if (!opened.openedFile) return {
		avatar: source,
		resolution: opened.resolution
	};
	const dataUrl = gatewayAvatarDataUrlCache.read(opened.openedFile);
	if (!dataUrl) return {
		avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		resolution: {
			kind: "none",
			reason: "unreadable",
			source
		}
	};
	return {
		avatar: dataUrl,
		resolution: opened.resolution
	};
}
//#endregion
export { resolveGatewayAssistantAvatar as n, openGatewayAssistantAvatar as t };
