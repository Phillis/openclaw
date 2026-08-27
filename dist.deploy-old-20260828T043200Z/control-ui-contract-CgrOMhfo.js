import { t as normalizeControlUiBasePath } from "./control-ui-shared-l0wakFAx.js";
//#region src/gateway/control-ui-user-avatar-route.ts
const CONTROL_UI_USER_AVATAR_PATH_PREFIX = "/api/users/";
const CONTROL_UI_USER_AVATAR_PATH_SUFFIX = "/avatar";
function buildControlUiUserAvatarPath(profileId, revision, basePath) {
	const path = `${normalizeControlUiBasePath(basePath)}${CONTROL_UI_USER_AVATAR_PATH_PREFIX}${encodeURIComponent(profileId)}${CONTROL_UI_USER_AVATAR_PATH_SUFFIX}`;
	return revision === void 0 ? path : `${path}?v=${encodeURIComponent(String(revision))}`;
}
//#endregion
//#region src/gateway/control-ui-resource-routes.ts
const CONTROL_UI_RESOURCE_ROUTES = {
	agentAvatar: {
		prefix: "/avatar",
		suffix: ""
	},
	catalogIcon: {
		prefix: "/__openclaw__/catalog-icon",
		suffix: ""
	},
	channelAvatar: {
		prefix: "/__openclaw__/channel-avatar",
		suffix: ""
	},
	linkFavicon: {
		prefix: "/__openclaw__/link-favicon",
		suffix: ""
	},
	pluginIcon: {
		prefix: "/__openclaw__/plugin-icon",
		suffix: ""
	},
	userAvatar: {
		prefix: CONTROL_UI_USER_AVATAR_PATH_PREFIX.slice(0, -1),
		suffix: CONTROL_UI_USER_AVATAR_PATH_SUFFIX
	},
	workspaceIcon: {
		prefix: "/__openclaw__/workspace-icon",
		suffix: ""
	}
};
/** Builds one canonical, encoded Control UI resource path. */
function buildControlUiResourcePath(route, basePath, value) {
	const definition = CONTROL_UI_RESOURCE_ROUTES[route];
	return `${normalizeControlUiBasePath(basePath)}${definition.prefix}/${encodeURIComponent(value)}${definition.suffix}`;
}
/** Parses one exact encoded route segment while retaining malformed-route ownership. */
function parseControlUiResourcePath(route, pathname, basePath) {
	if (!pathname) return { matched: false };
	const definition = CONTROL_UI_RESOURCE_ROUTES[route];
	const prefix = `${normalizeControlUiBasePath(basePath)}${definition.prefix}/`;
	if (!pathname.startsWith(prefix)) return { matched: false };
	const remainder = pathname.slice(prefix.length);
	if (!remainder.endsWith(definition.suffix)) return {
		matched: true,
		value: null
	};
	const encoded = definition.suffix ? remainder.slice(0, -definition.suffix.length) : remainder;
	if (!encoded || encoded.includes("/")) return {
		matched: true,
		value: null
	};
	try {
		return {
			matched: true,
			value: decodeURIComponent(encoded) || null
		};
	} catch {
		return {
			matched: true,
			value: null
		};
	}
}
function parseControlUiUserAvatarPath(pathname, basePath) {
	const canonical = parseControlUiResourcePath("userAvatar", pathname);
	if (canonical.matched) return canonical;
	return normalizeControlUiBasePath(basePath) ? parseControlUiResourcePath("userAvatar", pathname, basePath) : canonical;
}
function matchControlUiResourcePath(route, pathname, basePath) {
	const parsed = parseControlUiResourcePath(route, pathname, basePath);
	return parsed.matched && parsed.value ? parsed.value : void 0;
}
/** Builds the authenticated conversation-avatar URL for a session. */
function buildControlUiChannelAvatarUrl(basePath, sessionKey, revision) {
	return `${buildControlUiResourcePath("channelAvatar", basePath, sessionKey)}?v=${encodeURIComponent(revision)}`;
}
/** Matches an exact root-relative same-origin resource URL without parser reinterpretation. */
function matchControlUiResourceUrl(route, value, basePath) {
	if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return;
	try {
		const origin = "http://openclaw.invalid";
		const parsed = new URL(value, origin);
		if (parsed.origin !== origin || `${parsed.pathname}${parsed.search}${parsed.hash}` !== value) return;
		const routeValue = matchControlUiResourcePath(route, parsed.pathname, basePath);
		return routeValue === void 0 ? void 0 : {
			value: routeValue,
			search: parsed.search,
			hash: parsed.hash
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/gateway/control-ui-contract.ts
/** Targeted pushed PR snapshot event for subscribed Control UI connections. */
const CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT = "controlUi.sessionPullRequests.changed";
//#endregion
export { parseControlUiResourcePath as a, matchControlUiResourceUrl as i, buildControlUiChannelAvatarUrl as n, parseControlUiUserAvatarPath as o, buildControlUiResourcePath as r, buildControlUiUserAvatarPath as s, CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT as t };
