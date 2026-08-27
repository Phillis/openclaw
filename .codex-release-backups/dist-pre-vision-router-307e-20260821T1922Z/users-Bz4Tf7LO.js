import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { a as NonEmptyString } from "./primitives-BSb7UY-n.js";
import { Type } from "typebox";
const USER_PREFS_VALUE_BYTES = 4 * 1024;
const UserProfileIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const UserProfileDisplayNameSchema = Type.String({ maxLength: 256 });
const UserPreferenceKeySchema = Type.String({ pattern: "^.{1,256}$" });
const UserPreferenceEntriesSchema = Type.Record(UserPreferenceKeySchema, Type.Unknown());
const UserPreferenceSetEntriesSchema = Type.Record(UserPreferenceKeySchema, Type.Unknown(), { maxProperties: 32 });
const UserProfileAvatarMimeSchema = Type.Union([
	Type.Literal("image/png"),
	Type.Literal("image/jpeg"),
	Type.Literal("image/webp")
]);
const UserProfileSchema = closedObject({
	id: UserProfileIdSchema,
	displayName: Type.Union([UserProfileDisplayNameSchema, Type.Null()]),
	avatarMime: Type.Union([UserProfileAvatarMimeSchema, Type.Null()]),
	mergedInto: Type.Union([UserProfileIdSchema, Type.Null()]),
	createdAt: Type.Integer({ minimum: 0 }),
	updatedAt: Type.Integer({ minimum: 0 }),
	emails: Type.Array(NonEmptyString),
	hasAvatar: Type.Boolean()
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
//#endregion
export { UsersListParamsSchema as a, UsersPrefsGetResultSchema as c, UsersSelfParamsSchema as d, UsersSelfResultSchema as f, UsersSetDisplayNameResultSchema as g, UsersSetDisplayNameParamsSchema as h, UsersLinkEmailResultSchema as i, UsersPrefsSetParamsSchema as l, UsersSetAvatarResultSchema as m, UserProfileSchema as n, UsersListResultSchema as o, UsersSetAvatarParamsSchema as p, UsersLinkEmailParamsSchema as r, UsersPrefsGetParamsSchema as s, USER_PREFS_VALUE_BYTES as t, UsersPrefsSetResultSchema as u };
