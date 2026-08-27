import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { a as NonEmptyString } from "./primitives-TdbrOFJ1.js";
import { Type } from "typebox";
const USER_PREFS_VALUE_BYTES = 4 * 1024;
const GIT_COAUTHOR_PREFERENCE_KEY = "git.coauthor.enabled";
const UserProfileIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const UserProfileDisplayNameSchema = Type.String({ maxLength: 256 });
const UserProfileRoleSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "\\S"
});
const UserPreferenceKeySchema = Type.String({ pattern: "^.{1,256}$" });
const UserPreferenceEntriesSchema = Type.Record(UserPreferenceKeySchema, Type.Unknown());
const UserPreferenceSetEntriesSchema = Type.Record(UserPreferenceKeySchema, Type.Unknown(), { maxProperties: 32 });
const UserProfileAvatarMimeSchema = Type.Union([
	Type.Literal("image/png"),
	Type.Literal("image/jpeg"),
	Type.Literal("image/webp")
]);
const UserProfileGitHubIdentitySchema = closedObject({
	login: Type.String({
		minLength: 1,
		maxLength: 39
	}),
	profileUrl: NonEmptyString,
	avatarUrl: NonEmptyString
});
const UserProfileSchema = closedObject({
	id: UserProfileIdSchema,
	displayName: Type.Union([UserProfileDisplayNameSchema, Type.Null()]),
	avatarMime: Type.Union([UserProfileAvatarMimeSchema, Type.Null()]),
	mergedInto: Type.Union([UserProfileIdSchema, Type.Null()]),
	createdAt: Type.Integer({ minimum: 0 }),
	updatedAt: Type.Integer({ minimum: 0 }),
	emails: Type.Array(NonEmptyString),
	githubIdentity: Type.Union([UserProfileGitHubIdentitySchema, Type.Null()]),
	hasAvatar: Type.Boolean(),
	role: Type.Optional(UserProfileRoleSchema)
});
const UsersListParamsSchema = closedObject({});
const UsersListResultSchema = closedObject({ profiles: Type.Array(UserProfileSchema) });
const UsersSelfParamsSchema = closedObject({});
const UsersSelfResultSchema = closedObject({ profile: UserProfileSchema });
const UsersLinkEmailParamsSchema = closedObject({
	email: Type.String({
		minLength: 1,
		maxLength: 320
	}),
	targetProfileId: UserProfileIdSchema
});
const UsersLinkEmailResultSchema = closedObject({ profile: UserProfileSchema });
const UsersSetDisplayNameParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	displayName: Type.Union([UserProfileDisplayNameSchema, Type.Null()])
});
const UsersSetDisplayNameResultSchema = closedObject({ profile: UserProfileSchema });
const UsersSetRoleParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	role: Type.Union([UserProfileRoleSchema, Type.Null()])
});
const UsersSetRoleResultSchema = closedObject({ profile: UserProfileSchema });
const UsersSetAvatarParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	mime: UserProfileAvatarMimeSchema,
	avatarBase64: Type.String({
		minLength: 1,
		maxLength: 7e5
	})
});
const UsersSetAvatarResultSchema = closedObject({
	profile: UserProfileSchema,
	avatarRevision: NonEmptyString
});
const UsersPrefsGetParamsSchema = closedObject({ keys: Type.Optional(Type.Array(UserPreferenceKeySchema, {
	maxItems: 32,
	uniqueItems: true
})) });
const UsersPrefsGetResultSchema = Type.Union([closedObject({
	status: Type.Literal("ok"),
	entries: UserPreferenceEntriesSchema
}), closedObject({ status: Type.Literal("no_durable_identity") })]);
const UsersPrefsSetParamsSchema = closedObject({ entries: UserPreferenceSetEntriesSchema });
const UsersPrefsSetResultSchema = Type.Union([closedObject({ status: Type.Literal("ok") }), closedObject({ status: Type.Literal("no_durable_identity") })]);
const UsersPrefsChangedEventSchema = closedObject({
	profileId: UserProfileIdSchema,
	keys: Type.Array(UserPreferenceKeySchema, {
		maxItems: 32,
		uniqueItems: true
	})
});
//#endregion
export { UsersSetDisplayNameParamsSchema as _, UsersLinkEmailResultSchema as a, UsersSetRoleResultSchema as b, UsersPrefsChangedEventSchema as c, UsersPrefsSetParamsSchema as d, UsersPrefsSetResultSchema as f, UsersSetAvatarResultSchema as g, UsersSetAvatarParamsSchema as h, UsersLinkEmailParamsSchema as i, UsersPrefsGetParamsSchema as l, UsersSelfResultSchema as m, USER_PREFS_VALUE_BYTES as n, UsersListParamsSchema as o, UsersSelfParamsSchema as p, UserProfileSchema as r, UsersListResultSchema as s, GIT_COAUTHOR_PREFERENCE_KEY as t, UsersPrefsGetResultSchema as u, UsersSetDisplayNameResultSchema as v, UsersSetRoleParamsSchema as y };
