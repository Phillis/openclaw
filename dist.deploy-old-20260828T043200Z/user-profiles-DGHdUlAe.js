import { n as ok, t as err } from "./result-BQGgYouL.js";
import { An as executeSqliteQuerySync, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { S as ensureUserPreferencesSchema, _ as UserProfileNotFoundError, b as hasEnsuredUserProfileRoleSchema, d as requireResolvedUserProfileById, f as selectResolvedUserProfileById, g as fetchTailscaleAvatar, h as USER_PROFILE_AVATAR_MIME_TYPES, i as prepareUserProfileGitHubMerge, m as MAX_USER_PROFILE_AVATAR_BYTES, n as applyVerifiedGitHubIdentity, p as userProfilesDb, r as githubAuthenticationSubject, s as selectUserProfileGitHubIdentities, t as classifyTailscaleLogin, u as normalizeUserProfileAvatarMime, v as ensureUserProfileRoleSchema, w as mergeUserPreferences, y as ensureUserProfilesSchema } from "./user-profiles-tailscale-login-D_fNUJ0L.js";
import { createHash } from "node:crypto";
import { sql } from "kysely";
//#region src/state/user-profile-list.ts
function listProfiles(options = {}) {
	ensureUserProfilesSchema(options);
	const database = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const kysely = userProfilesDb(database.db);
		const profiles = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profiles").select([
			"id",
			"display_name",
			"avatar_mime",
			"merged_into",
			...hasEnsuredUserProfileRoleSchema(database.db) ? ["role"] : [],
			"created_at",
			"updated_at",
			sql`CASE WHEN avatar IS NULL THEN 0 ELSE 1 END`.as("has_avatar")
		]).orderBy("created_at", "asc").orderBy("id", "asc")).rows;
		const emails = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profile_emails").select(["profile_id", "email"]).orderBy("email", "asc")).rows;
		const githubIdentities = selectUserProfileGitHubIdentities(database.db);
		const emailsByProfile = /* @__PURE__ */ new Map();
		for (const email of emails) {
			const list = emailsByProfile.get(email.profile_id) ?? [];
			list.push(email.email);
			emailsByProfile.set(email.profile_id, list);
		}
		return profiles.map((profile) => Object.assign({
			id: profile.id,
			displayName: profile.display_name,
			avatarMime: normalizeUserProfileAvatarMime(profile.avatar_mime),
			mergedInto: profile.merged_into,
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,
			emails: emailsByProfile.get(profile.id) ?? [],
			githubIdentity: githubIdentities.get(profile.id) ?? null,
			hasAvatar: profile.has_avatar === 1
		}, profile.role ? { role: profile.role } : {}));
	}, {
		databaseLabel: database.path,
		operationLabel: "user-profiles.list"
	});
}
/** True when session-sharing policy can distinguish at least two durable people. */
function hasMultipleSessionSharingIdentities(options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return executeSqliteQuerySync(db, userProfilesDb(db).selectFrom("user_profiles").select("id").where("merged_into", "is", null).limit(2)).rows.length >= 2;
}
//#endregion
//#region src/state/user-profiles.ts
const MAX_USER_PROFILE_DISPLAY_NAME_LENGTH = 256;
function normalizeEmail(email) {
	const normalized = email.trim().toLowerCase();
	if (!normalized) throw new TypeError("email must not be empty");
	return normalized;
}
function normalizeInitialDisplayName(name) {
	const normalized = name?.trim();
	return normalized ? normalized.slice(0, MAX_USER_PROFILE_DISPLAY_NAME_LENGTH) : null;
}
function toUserProfile(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: normalizeUserProfileAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		...row.role ? { role: row.role } : {},
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function insertUserProfile(db, displayName, now) {
	const row = {
		id: generateSecureUuid(),
		display_name: displayName,
		avatar: null,
		avatar_mime: null,
		avatar_sha256: null,
		merged_into: null,
		created_at: now,
		updated_at: now
	};
	executeSqliteQuerySync(db, userProfilesDb(db).insertInto("user_profiles").values(row));
	return row;
}
function toUserProfileListItem(row, emails, githubIdentity) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: normalizeUserProfileAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		...row.role ? { role: row.role } : {},
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		emails,
		githubIdentity,
		hasAvatar: row.has_avatar === 1
	};
}
function hasAvatarColumn() {
	return sql`CASE WHEN avatar IS NULL THEN 0 ELSE 1 END`.as("has_avatar");
}
function selectUserProfileListItemById(db, profileId) {
	const kysely = userProfilesDb(db);
	const profile = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").select([
		"id",
		"display_name",
		"avatar_mime",
		"merged_into",
		...hasEnsuredUserProfileRoleSchema(db) ? ["role"] : [],
		"created_at",
		"updated_at",
		hasAvatarColumn()
	]).where("id", "=", profileId));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profileId).orderBy("email", "asc")).rows;
	return toUserProfileListItem(profile, emails.map((alias) => alias.email), selectUserProfileGitHubIdentities(db, [profileId]).get(profileId) ?? null);
}
/** Resolves a durable profile reference to its current one-hop merge head. */
function resolveUserProfileId(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectResolvedUserProfileById(db, profileId)?.id;
}
/** Reads a profile's protocol-facing representation through its merge head. */
function getUserProfileListItem(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectUserProfileListItemById(db, requireResolvedUserProfileById(db, profileId).id);
}
/** Reads the role assigned to an existing profile's current merge head. */
function getUserProfileRole(profileId, options = {}) {
	ensureUserProfileRoleSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return requireResolvedUserProfileById(db, profileId).role ?? null;
}
/** Assigns or clears the role on an existing profile's current merge head. */
function setUserProfileRole(profileId, role, options = {}) {
	ensureUserProfileRoleSchema(options);
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileById(db, profileId);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			role,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-role" });
}
/** Reads merge-aware display data without exposing avatar content through list/RPC shapes. */
function getUserProfileDisplay(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	const profile = requireResolvedUserProfileById(db, profileId);
	const avatarMime = normalizeUserProfileAvatarMime(profile.avatar_mime);
	const avatarRevision = profile.avatar_sha256 && avatarMime ? `${profile.avatar_sha256}-${avatarMime.slice(6)}` : String(profile.updated_at);
	return {
		id: profile.id,
		displayName: profile.display_name,
		avatarRevision,
		hasAvatar: profile.avatar !== null
	};
}
function ensureProfileForEmailWithInitialName(email, initialDisplayName, options) {
	const normalizedEmail = normalizeEmail(email);
	const now = Date.now();
	const displayName = initialDisplayName ?? (normalizedEmail.split("@", 1)[0] || normalizedEmail).slice(0, MAX_USER_PROFILE_DISPLAY_NAME_LENGTH);
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = userProfilesDb(db);
		const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		if (existingAlias) return toUserProfile(requireResolvedUserProfileById(db, existingAlias.profile_id));
		const row = insertUserProfile(db, displayName, now);
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_emails").values({
			email: normalizedEmail,
			profile_id: row.id,
			created_at: now
		}));
		return toUserProfile(row);
	}, options, { operationLabel: "user-profiles.ensure" });
}
/** Resolves an email alias or atomically creates its first durable profile. */
function ensureProfileForEmail(email, options = {}) {
	return ensureProfileForEmailWithInitialName(email, null, options);
}
function ensureProfileForProviderIdentity(params) {
	const now = Date.now();
	const subject = params.provider === "github" ? githubAuthenticationSubject(params.subject) : params.subject;
	ensureUserProfilesSchema(params.options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = userProfilesDb(db);
		let existingQuery = kysely.selectFrom("user_profile_identities").select(["profile_id", "subject"]).where("provider", "=", params.provider);
		existingQuery = params.provider === "github" ? existingQuery.where((eb) => eb.or([eb("subject", "=", subject), eb.and([eb("subject", "=", params.subject), eb("canonical_login", "is", null)])])).orderBy(sql`CASE WHEN subject = ${subject} THEN 0 ELSE 1 END`) : existingQuery.where("subject", "=", subject);
		const existingIdentity = executeSqliteQueryTakeFirstSync(db, existingQuery);
		if (existingIdentity) {
			if (existingIdentity.subject !== subject) executeSqliteQuerySync(db, kysely.updateTable("user_profile_identities").set({ subject }).where("provider", "=", params.provider).where("subject", "=", existingIdentity.subject));
			return toUserProfile(requireResolvedUserProfileById(db, existingIdentity.profile_id));
		}
		const row = insertUserProfile(db, params.initialDisplayName, now);
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
			provider: params.provider,
			subject,
			profile_id: row.id,
			canonical_login: null,
			created_at: now
		}));
		return toUserProfile(row);
	}, params.options, { operationLabel: "user-profiles.ensure-identity" });
}
function mergeUserProfiles(db, sourceProfileId, targetProfileId, now) {
	if (sourceProfileId === targetProfileId) return;
	const kysely = userProfilesDb(db);
	const sourceProfileIds = [sourceProfileId, ...executeSqliteQuerySync(db, kysely.selectFrom("user_profiles").select("id").where("merged_into", "=", sourceProfileId)).rows.map((row) => row.id)];
	prepareUserProfileGitHubMerge(db, sourceProfileIds, targetProfileId);
	for (const mergedProfileId of sourceProfileIds) mergeUserPreferences(db, mergedProfileId, targetProfileId);
	executeSqliteQuerySync(db, kysely.updateTable("user_profile_emails").set({ profile_id: targetProfileId }).where("profile_id", "in", sourceProfileIds));
	executeSqliteQuerySync(db, kysely.updateTable("user_profile_identities").set({ profile_id: targetProfileId }).where("profile_id", "in", sourceProfileIds));
	executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
		merged_into: targetProfileId,
		updated_at: now
	}).where("id", "in", sourceProfileIds));
	executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", targetProfileId));
}
function adoptDisplayNameIfEmpty(profileId, displayName, options) {
	if (!displayName) {
		const { db } = openOpenClawStateDatabase(options);
		return toUserProfile(requireResolvedUserProfileById(db, profileId));
	}
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileById(db, profileId);
		if (profile.display_name !== null) return toUserProfile(profile);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: displayName,
			updated_at: now
		}).where("id", "=", profile.id));
		return toUserProfile({
			...profile,
			display_name: displayName,
			updated_at: now
		});
	}, options, { operationLabel: "user-profiles.adopt-display-name" });
}
async function adoptAvatarIfEmpty(params) {
	const { db } = openOpenClawStateDatabase(params.options);
	const beforeFetch = requireResolvedUserProfileById(db, params.profileId);
	if (beforeFetch.avatar !== null || !params.profilePic) return toUserProfile(beforeFetch);
	const avatar = await fetchTailscaleAvatar(params.profilePic, params.fetchOptions);
	if (!avatar) return toUserProfile(requireResolvedUserProfileById(db, params.profileId));
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		const profile = requireResolvedUserProfileById(transactionDb, params.profileId);
		if (profile.avatar !== null) return toUserProfile(profile);
		const sha256 = createHash("sha256").update(avatar.bytes).digest("hex");
		executeSqliteQuerySync(transactionDb, userProfilesDb(transactionDb).updateTable("user_profiles").set({
			avatar: avatar.bytes,
			avatar_mime: avatar.mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		return toUserProfile({
			...profile,
			avatar: avatar.bytes,
			avatar_mime: avatar.mime,
			avatar_sha256: sha256,
			updated_at: now
		});
	}, params.options, { operationLabel: "user-profiles.adopt-avatar" });
}
/** Resolves a verified Tailscale login and adopts its display name into an empty field. */
function ensureProfileForTailscaleIdentity(identity, options = {}) {
	const classified = classifyTailscaleLogin(identity.login);
	if (classified.kind === "invalid") throw new TypeError("Tailscale login must contain a nonempty subject and suffix");
	const displayName = normalizeInitialDisplayName(identity.name);
	return adoptDisplayNameIfEmpty((classified.kind === "email" ? ensureProfileForEmailWithInitialName(classified.email, displayName, options) : ensureProfileForProviderIdentity({
		provider: classified.provider,
		subject: classified.subject,
		initialDisplayName: displayName,
		options
	})).id, displayName, options);
}
/** Best-effort avatar adoption runs after authentication so remote I/O cannot delay login. */
async function adoptTailscaleProfileAvatar(profileId, profilePic, options = {}, fetchOptions = {}) {
	return await adoptAvatarIfEmpty({
		profileId,
		profilePic,
		options,
		fetchOptions
	});
}
/** Links an email to a profile and retains an aliasless prior profile as a merge tombstone. */
function linkEmail(email, targetProfileId, options = {}) {
	const normalizedEmail = normalizeEmail(email);
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = userProfilesDb(db);
		const target = requireResolvedUserProfileById(db, targetProfileId);
		const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		if (!existingAlias) {
			executeSqliteQuerySync(db, kysely.insertInto("user_profile_emails").values({
				email: normalizedEmail,
				profile_id: target.id,
				created_at: now
			}));
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
			return selectUserProfileListItemById(db, target.id);
		}
		if (existingAlias.profile_id === target.id) return selectUserProfileListItemById(db, target.id);
		executeSqliteQuerySync(db, kysely.updateTable("user_profile_emails").set({ profile_id: target.id }).where("email", "=", normalizedEmail));
		const remainingAliases = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", existingAlias.profile_id)).rows;
		executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
		if (remainingAliases.length === 0) mergeUserProfiles(db, existingAlias.profile_id, target.id, now);
		else executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", existingAlias.profile_id));
		return selectUserProfileListItemById(db, target.id);
	}, options, { operationLabel: "user-profiles.link-email" });
}
function setDisplayName(profileId, name, options = {}) {
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileById(db, profileId);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: name,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-display-name" });
}
function normalizeGitHubAuthenticationAlias(alias) {
	return alias.kind === "email" ? {
		kind: "email",
		email: normalizeEmail(alias.email)
	} : {
		kind: "github-login",
		subject: githubAuthenticationSubject(alias.login)
	};
}
function syncGitHubIdentity(params, options = {}) {
	const alias = normalizeGitHubAuthenticationAlias(params.authenticationAlias);
	const initialDisplayName = normalizeInitialDisplayName(params.initialDisplayName);
	ensureUserProfilesSchema(options);
	ensureUserPreferencesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const now = Date.now();
		const kysely = userProfilesDb(db);
		const canonicalProfileId = applyVerifiedGitHubIdentity({
			db,
			alias,
			identity: params.identity,
			createProfile: () => insertUserProfile(db, initialDisplayName, now).id,
			mergeProfiles: (sourceProfileId, targetProfileId) => mergeUserProfiles(db, sourceProfileId, targetProfileId, now)
		});
		if (initialDisplayName) executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
			display_name: initialDisplayName,
			updated_at: now
		}).where("id", "=", canonicalProfileId).where("display_name", "is", null));
		executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", canonicalProfileId));
		return selectUserProfileListItemById(db, canonicalProfileId);
	}, options, { operationLabel: "user-profiles.sync-github-identity" });
}
/** Stores a bounded, allowlisted avatar without ever leaving the write transaction async. */
function setAvatar(profileId, bytes, mime, options = {}) {
	if (bytes.byteLength > 524288) return err({
		code: "avatar_too_large",
		maxBytes: MAX_USER_PROFILE_AVATAR_BYTES
	});
	if (!USER_PROFILE_AVATAR_MIME_TYPES.includes(mime)) return err({
		code: "unsupported_avatar_mime",
		mime
	});
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return ok(runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileById(db, profileId);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			avatar: bytes,
			avatar_mime: mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-avatar" }));
}
//#endregion
export { getUserProfileListItem as a, resolveUserProfileId as c, setUserProfileRole as d, syncGitHubIdentity as f, getUserProfileDisplay as i, setAvatar as l, listProfiles as m, ensureProfileForEmail as n, getUserProfileRole as o, hasMultipleSessionSharingIdentities as p, ensureProfileForTailscaleIdentity as r, linkEmail as s, adoptTailscaleProfileAvatar as t, setDisplayName as u };
