import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./operator-scopes-Dw7Gu2cA.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Ga as validateUsersLinkEmailParams, Ja as validateUsersPrefsGetParams, Qa as validateUsersSetAvatarParams, Xa as validateUsersSelfParams, Ya as validateUsersPrefsSetParams, eo as validateUsersSetDisplayNameParams, no as validateUsersSetRoleParams, qa as validateUsersListParams } from "./src-4dv5TpeQ.js";
import { d as errorShape, t as formatValidationErrors } from "./validation-errors-rELRlKfn.js";
import { C as getUserPreferences, T as setUserPreferences, _ as UserProfileNotFoundError } from "./user-profiles-tailscale-login-D_fNUJ0L.js";
import { a as getUserProfileListItem, c as resolveUserProfileId, d as setUserProfileRole, i as getUserProfileDisplay, l as setAvatar, m as listProfiles, n as ensureProfileForEmail, s as linkEmail, u as setDisplayName } from "./user-profiles-DGHdUlAe.js";
import { f as isGatewayClientProfilePending, l as authenticatedProfileUnavailableError, r as invalidateOperatorRolePolicy } from "./operator-role-policy-Bvt-UeJ1.js";
//#region src/gateway/server-methods/users.ts
function refreshConnectedProfile(context, profile) {
	const display = getUserProfileDisplay(profile.id);
	context.refreshConnectedUserProfile?.({
		...display,
		updatedAt: profile.updatedAt
	});
	return display;
}
function decodeBase64(value) {
	const trimmed = value.trim();
	if (!trimmed || trimmed.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(trimmed)) return;
	return Buffer.from(trimmed, "base64");
}
function invalidParams(name, errors) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${name} params: ${formatValidationErrors(errors)}`);
}
function profileError(error) {
	if (error instanceof UserProfileNotFoundError) return errorShape(ErrorCodes.INVALID_REQUEST, error.message);
	return errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
function resolveAuthenticatedProfileId(client) {
	if (client?.authenticatedUserProfile?.profileId) return resolveUserProfileId(client.authenticatedUserProfile.profileId);
	if (client?.authenticatedGitHubIdentitySync) return;
	const authenticatedUserId = client?.authenticatedUserId;
	if (!authenticatedUserId) return;
	if (client.authenticatedUserIsTailscaleProvider) return;
	return ensureProfileForEmail(authenticatedUserId).id;
}
function canMutateProfile(client, profileId) {
	if (client?.connect.scopes?.includes("operator.admin")) return true;
	const authenticatedProfileId = resolveAuthenticatedProfileId(client);
	return authenticatedProfileId !== void 0 && authenticatedProfileId === resolveUserProfileId(profileId);
}
function requireProfileMutationAccess(client, profileId, respond) {
	if (canMutateProfile(client, profileId)) return true;
	respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "profile edits require the owning user or operator.admin"));
	return false;
}
const usersHandlers = {
	"users.list": ({ params, respond }) => {
		if (!validateUsersListParams(params)) {
			respond(false, void 0, invalidParams("users.list", validateUsersListParams.errors));
			return;
		}
		respond(true, { profiles: listProfiles() });
	},
	"users.self": async ({ client, params, respond }) => {
		if (!validateUsersSelfParams(params)) {
			respond(false, void 0, invalidParams("users.self", validateUsersSelfParams.errors));
			return;
		}
		if (!client?.authenticatedUserId) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "users.self requires an authenticated user"));
			return;
		}
		try {
			if (client.authenticatedGitHubIdentitySync) try {
				await client.authenticatedGitHubIdentitySync();
			} catch {}
			const profileId = resolveAuthenticatedProfileId(client);
			if (!profileId) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { profile: getUserProfileListItem(profileId) });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.prefs.get": ({ client, params, respond }) => {
		if (!validateUsersPrefsGetParams(params)) {
			respond(false, void 0, invalidParams("users.prefs.get", validateUsersPrefsGetParams.errors));
			return;
		}
		const profileId = client?.authenticatedUserProfile?.profileId ?? "";
		if (!profileId) {
			if (isGatewayClientProfilePending(client)) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { status: "no_durable_identity" }, void 0);
			return;
		}
		try {
			const canonicalProfileId = resolveUserProfileId(profileId);
			if (!canonicalProfileId) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, {
				status: "ok",
				entries: getUserPreferences(canonicalProfileId, params.keys)
			}, void 0);
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.prefs.set": ({ client, context, params, respond }) => {
		if (!validateUsersPrefsSetParams(params)) {
			respond(false, void 0, invalidParams("users.prefs.set", validateUsersPrefsSetParams.errors));
			return;
		}
		const profileId = client?.authenticatedUserProfile?.profileId ?? "";
		if (!profileId) {
			if (isGatewayClientProfilePending(client)) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { status: "no_durable_identity" }, void 0);
			return;
		}
		try {
			const canonicalProfileId = resolveUserProfileId(profileId);
			if (!canonicalProfileId) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			const result = setUserPreferences(canonicalProfileId, params.entries);
			if (!result.ok) {
				if (result.error.code === "profile-key-limit") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `users.prefs.set exceeds the ${result.error.limit}-key profile limit (current count: ${result.error.currentCount})`, { details: {
						code: GatewayErrorDetailCodes.USER_PREFS_LIMIT_EXCEEDED,
						limit: result.error.limit,
						currentCount: result.error.currentCount
					} }));
					return;
				}
				const key = "key" in result.error ? ` for ${result.error.key}` : "";
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid users.prefs.set entry${key}: ${result.error.code}`));
				return;
			}
			respond(true, { status: "ok" }, void 0);
			const keys = Object.keys(params.entries);
			if (keys.length === 0) return;
			const connIds = context.getClientConnIds?.((connectedClient) => {
				const connectedProfileId = connectedClient.authenticatedUserProfile?.profileId;
				return Boolean(connectedProfileId && (connectedProfileId === canonicalProfileId || resolveUserProfileId(connectedProfileId) === canonicalProfileId));
			});
			if (connIds?.size) context.broadcastToConnIds("users.prefs.changed", {
				profileId: canonicalProfileId,
				keys
			}, connIds);
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.linkEmail": ({ context, params, respond }) => {
		if (!validateUsersLinkEmailParams(params)) {
			respond(false, void 0, invalidParams("users.linkEmail", validateUsersLinkEmailParams.errors));
			return;
		}
		const email = params.email.trim();
		if (!email) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "email must not be empty"));
			return;
		}
		try {
			const profile = linkEmail(email, params.targetProfileId);
			refreshConnectedProfile(context, profile);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setDisplayName": ({ client, context, params, respond }) => {
		if (!validateUsersSetDisplayNameParams(params)) {
			respond(false, void 0, invalidParams("users.setDisplayName", validateUsersSetDisplayNameParams.errors));
			return;
		}
		try {
			if (!requireProfileMutationAccess(client, params.profileId, respond)) return;
			const profile = setDisplayName(params.profileId, params.displayName);
			refreshConnectedProfile(context, profile);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setRole": ({ context, params, respond }) => {
		if (!validateUsersSetRoleParams(params)) {
			respond(false, void 0, invalidParams("users.setRole", validateUsersSetRoleParams.errors));
			return;
		}
		const roleDefinitions = context.getRuntimeConfig().gateway?.roles?.definitions;
		if (params.role !== null && (!roleDefinitions || !Object.hasOwn(roleDefinitions, params.role))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown operator role "${params.role}"; define it under gateway.roles.definitions before assigning it`));
			return;
		}
		try {
			const profile = setUserProfileRole(params.profileId, params.role);
			invalidateOperatorRolePolicy(profile.id);
			context.disconnectClientsForUserProfile?.(profile.id);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setAvatar": ({ client, context, params, respond }) => {
		if (!validateUsersSetAvatarParams(params)) {
			respond(false, void 0, invalidParams("users.setAvatar", validateUsersSetAvatarParams.errors));
			return;
		}
		const bytes = decodeBase64(params.avatarBase64);
		if (!bytes) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "avatarBase64 must be base64"));
			return;
		}
		try {
			if (!requireProfileMutationAccess(client, params.profileId, respond)) return;
			const result = setAvatar(params.profileId, bytes, params.mime);
			if (!result.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.error.code));
				return;
			}
			const display = refreshConnectedProfile(context, result.value);
			respond(true, {
				profile: result.value,
				avatarRevision: display.avatarRevision
			});
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	}
};
//#endregion
export { usersHandlers };
