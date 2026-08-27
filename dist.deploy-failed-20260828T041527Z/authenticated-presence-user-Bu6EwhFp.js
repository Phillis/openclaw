import { s as buildControlUiUserAvatarPath } from "./control-ui-contract-CgrOMhfo.js";
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
		avatarUrl: buildControlUiUserAvatarPath(params.authenticatedUserProfile.profileId, params.authenticatedUserProfile.avatarRevision)
	};
}
//#endregion
export { buildAuthenticatedPresenceUser as t };
