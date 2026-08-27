import { n as formatUserProfileAvatarPath } from "./user-profiles-http-path-BFesDPdu.js";
//#region src/gateway/authenticated-presence-user.ts
function buildAuthenticatedPresenceUser(params) {
	if (!params.authenticatedUserId) return;
	if (!params.authenticatedUserProfile) return {
		id: params.authenticatedUserId,
		...params.authenticatedUserIsTailscaleProvider ? {} : { email: params.authenticatedUserId }
	};
	return {
		id: params.authenticatedUserProfile.profileId,
		...params.authenticatedUserIsTailscaleProvider ? {} : { email: params.authenticatedUserId },
		...params.authenticatedUserProfile.displayName ? { name: params.authenticatedUserProfile.displayName } : {},
		avatarUrl: formatUserProfileAvatarPath(params.authenticatedUserProfile.profileId, params.authenticatedUserProfile.avatarRevision)
	};
}
//#endregion
export { buildAuthenticatedPresenceUser as t };
