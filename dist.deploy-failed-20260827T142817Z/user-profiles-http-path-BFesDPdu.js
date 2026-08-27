//#region src/gateway/user-profiles-http-path.ts
const USER_PROFILE_AVATAR_PATH = /^\/api\/users\/([^/]+)\/avatar$/u;
function formatUserProfileAvatarPath(profileId, revision) {
	const path = `/api/users/${encodeURIComponent(profileId)}/avatar`;
	return revision === void 0 ? path : `${path}?v=${encodeURIComponent(String(revision))}`;
}
function matchUserProfileAvatarPath(pathname) {
	const profileId = USER_PROFILE_AVATAR_PATH.exec(pathname)?.[1];
	if (!profileId) return;
	try {
		return decodeURIComponent(profileId);
	} catch {
		return;
	}
}
function canonicalizeUserProfileAvatarPath(pathname, controlUiBasePath) {
	if (matchUserProfileAvatarPath(pathname) !== void 0) return pathname;
	if (!controlUiBasePath || !pathname.startsWith(`${controlUiBasePath}/`)) return;
	const canonicalPath = pathname.slice(controlUiBasePath.length);
	return matchUserProfileAvatarPath(canonicalPath) !== void 0 ? canonicalPath : void 0;
}
//#endregion
export { formatUserProfileAvatarPath as n, matchUserProfileAvatarPath as r, canonicalizeUserProfileAvatarPath as t };
