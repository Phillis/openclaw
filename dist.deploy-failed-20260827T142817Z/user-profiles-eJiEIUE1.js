import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-sCL6pEgr.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { Mt as tableExists, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import "./users-Bz4Tf7LO.js";
import { r as readRemoteMediaBuffer } from "./fetch-CLYC5ZpH.js";
import { createHash } from "node:crypto";
import { sql } from "kysely";
import { fileTypeFromBuffer } from "file-type";
//#region src/state/user-preferences.ts
const ensuredDatabases$1 = /* @__PURE__ */ new WeakSet();
const USER_PREFERENCES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS user_preferences (
  profile_id TEXT NOT NULL,
  pref_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  updated_at_ms INT NOT NULL,
  PRIMARY KEY (profile_id, pref_key)
) STRICT;
`;
function ensureUserPreferencesSchema(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases$1.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(USER_PREFERENCES_SCHEMA_SQL);
	}, options, { operationLabel: "users.preferences.schema.ensure" });
	ensuredDatabases$1.add(database.db);
}
function openUserPreferencesDatabase(options = {}) {
	ensureUserPreferencesSchema(options);
	const state = openOpenClawStateDatabase(options);
	return {
		sqlite: state.db,
		kysely: getNodeSqliteKysely(state.db)
	};
}
function readPreferenceKeys(database, profileId) {
	const db = getNodeSqliteKysely(database);
	return new Set(executeSqliteQuerySync(database, db.selectFrom("user_preferences").select("pref_key").where("profile_id", "=", profileId)).rows.map((row) => row.pref_key));
}
/** Moves one retired profile's preferences without overwriting the merge target's choices. */
function mergeUserPreferences(database, sourceProfileId, targetProfileId) {
	if (sourceProfileId === targetProfileId || !tableExists(database, "user_preferences")) return;
	const db = getNodeSqliteKysely(database);
	const targetKeys = readPreferenceKeys(database, targetProfileId);
	const rows = executeSqliteQuerySync(database, db.selectFrom("user_preferences").selectAll().where("profile_id", "=", sourceProfileId).orderBy("pref_key", "asc")).rows;
	for (const row of rows) {
		if (targetKeys.has(row.pref_key)) continue;
		if (targetKeys.size >= 128) break;
		executeSqliteQuerySync(database, db.insertInto("user_preferences").values({
			...row,
			profile_id: targetProfileId
		}).onConflict((conflict) => conflict.columns(["profile_id", "pref_key"]).doNothing()));
		targetKeys.add(row.pref_key);
	}
	executeSqliteQuerySync(database, db.deleteFrom("user_preferences").where("profile_id", "=", sourceProfileId));
}
function getUserPreferences(profileId, keys, options = {}) {
	if (keys?.length === 0) return {};
	const { sqlite, kysely } = openUserPreferencesDatabase(options);
	let query = kysely.selectFrom("user_preferences").select(["pref_key", "value_json"]).where("profile_id", "=", profileId).orderBy("pref_key", "asc");
	if (keys) query = query.where("pref_key", "in", [...keys]);
	return Object.fromEntries(executeSqliteQuerySync(sqlite, query).rows.map((row) => [row.pref_key, JSON.parse(row.value_json)]));
}
function setUserPreferences(profileId, entries, options = {}) {
	const rawEntries = Object.entries(entries);
	if (rawEntries.length > 32) return err({ code: "invalid-entry-count" });
	const serialized = [];
	const deletionKeys = [];
	for (const [prefKey, value] of rawEntries) {
		if (!prefKey || prefKey.length > 256) return err({
			code: "invalid-key",
			key: prefKey
		});
		if (value === null) {
			deletionKeys.push(prefKey);
			continue;
		}
		let valueJson;
		try {
			valueJson = JSON.stringify(value);
		} catch {
			return err({
				code: "invalid-value",
				key: prefKey
			});
		}
		if (valueJson === void 0) return err({
			code: "invalid-value",
			key: prefKey
		});
		if (Buffer.byteLength(valueJson, "utf8") > 4096) return err({
			code: "value-too-large",
			key: prefKey
		});
		serialized.push({
			prefKey,
			valueJson
		});
	}
	if (serialized.length === 0 && deletionKeys.length === 0) return ok(void 0);
	ensureUserPreferencesSchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		const db = getNodeSqliteKysely(sqlite);
		const currentKeys = readPreferenceKeys(sqlite, profileId);
		const nextKeys = new Set(currentKeys);
		deletionKeys.forEach((key) => nextKeys.delete(key));
		serialized.forEach((entry) => nextKeys.add(entry.prefKey));
		if (serialized.length > 0 && nextKeys.size > 128) return err({
			code: "profile-key-limit",
			limit: 128,
			currentCount: currentKeys.size
		});
		if (deletionKeys.length > 0) executeSqliteQuerySync(sqlite, db.deleteFrom("user_preferences").where("profile_id", "=", profileId).where("pref_key", "in", deletionKeys));
		const updatedAtMs = Date.now();
		for (const entry of serialized) executeSqliteQuerySync(sqlite, db.insertInto("user_preferences").values({
			profile_id: profileId,
			pref_key: entry.prefKey,
			value_json: entry.valueJson,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.columns(["profile_id", "pref_key"]).doUpdateSet({
			value_json: entry.valueJson,
			updated_at_ms: updatedAtMs
		})));
		return ok(void 0);
	}, options, { operationLabel: "users.preferences.set" });
}
//#endregion
//#region src/state/user-profiles-schema.ts
const USER_PROFILES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  avatar BLOB,
  avatar_mime TEXT,
  avatar_sha256 TEXT,
  merged_into TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_emails (
  email TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_emails_profile_id
  ON user_profile_emails(profile_id);

CREATE TABLE IF NOT EXISTS user_profile_identities (
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (provider, subject)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id
  ON user_profile_identities(profile_id);
`;
//#endregion
//#region src/state/user-profiles-tailscale-avatar.ts
const MAX_USER_PROFILE_AVATAR_BYTES = 512 * 1024;
const USER_PROFILE_AVATAR_MIME_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp"
];
const TAILSCALE_AVATAR_FETCH_TIMEOUT_MS = 5e3;
const TAILSCALE_AVATAR_MAX_REDIRECTS = 3;
function toAvatarMime$1(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.includes(value) ? value : null;
}
async function fetchTailscaleAvatar(url, options) {
	try {
		const timeoutMs = options.timeoutMs ?? TAILSCALE_AVATAR_FETCH_TIMEOUT_MS;
		const loaded = await readRemoteMediaBuffer({
			url,
			fetchImpl: options.fetchImpl,
			maxBytes: MAX_USER_PROFILE_AVATAR_BYTES,
			maxRedirects: TAILSCALE_AVATAR_MAX_REDIRECTS,
			timeoutMs,
			responseHeaderTimeoutMs: timeoutMs,
			readIdleTimeoutMs: timeoutMs,
			requestInit: { headers: { Accept: USER_PROFILE_AVATAR_MIME_TYPES.join(",") } }
		});
		const mime = toAvatarMime$1(loaded.contentType);
		const detected = await fileTypeFromBuffer(loaded.buffer);
		return mime && detected?.mime === mime ? {
			bytes: loaded.buffer,
			mime
		} : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/state/user-profiles-tailscale-login.ts
/** Classify Tailscale's documented email or email-ish LoginName representation. */
function classifyTailscaleLogin(login) {
	const normalized = login.trim();
	const separator = normalized.lastIndexOf("@");
	if (separator <= 0 || separator === normalized.length - 1) return { kind: "invalid" };
	const subject = normalized.slice(0, separator);
	const suffix = normalized.slice(separator + 1);
	return suffix.includes(".") ? {
		kind: "email",
		email: normalized
	} : {
		kind: "provider",
		provider: suffix.toLowerCase(),
		subject: subject.toLowerCase()
	};
}
//#endregion
//#region src/state/user-profiles.ts
function formatUserProfileAvatarEtag(sha256, mime) {
	return `"${sha256}-${mime.slice(6)}"`;
}
var UserProfileNotFoundError = class extends Error {
	constructor(profileId) {
		super(`user profile not found: ${profileId}`);
		this.name = "UserProfileNotFoundError";
	}
};
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const MAX_USER_PROFILE_DISPLAY_NAME_LENGTH = 256;
function profileDb(db) {
	return getNodeSqliteKysely(db);
}
function ensureUserProfilesSchema(options) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(USER_PROFILES_SCHEMA_SQL);
	}, options, { operationLabel: "user-profiles.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function normalizeEmail(email) {
	const normalized = email.trim().toLowerCase();
	if (!normalized) throw new TypeError("email must not be empty");
	return normalized;
}
function normalizeInitialDisplayName(name) {
	const normalized = name?.trim();
	return normalized ? normalized.slice(0, MAX_USER_PROFILE_DISPLAY_NAME_LENGTH) : null;
}
function toAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.includes(value) ? value : null;
}
function toUserProfile(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: toAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function toUserProfileListItem(row, emails) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: toAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		emails,
		hasAvatar: row.has_avatar === 1
	};
}
function hasAvatarColumn() {
	return sql`CASE WHEN avatar IS NULL THEN 0 ELSE 1 END`.as("has_avatar");
}
function selectUserProfileListItemById(db, profileId) {
	const kysely = profileDb(db);
	const profile = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").select([
		"id",
		"display_name",
		"avatar_mime",
		"merged_into",
		"created_at",
		"updated_at",
		hasAvatarColumn()
	]).where("id", "=", profileId));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profileId).orderBy("email", "asc")).rows;
	return toUserProfileListItem(profile, emails.map((alias) => alias.email));
}
function selectProfileById(db, profileId) {
	return executeSqliteQueryTakeFirstSync(db, profileDb(db).selectFrom("user_profiles").selectAll().where("id", "=", profileId));
}
function selectResolvedProfileById(db, profileId) {
	const profile = selectProfileById(db, profileId);
	if (!profile?.merged_into) return profile;
	return selectProfileById(db, profile.merged_into) ?? profile;
}
function requireResolvedProfileById(db, profileId) {
	const profile = selectResolvedProfileById(db, profileId);
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
/** Resolves a durable profile reference to its current one-hop merge head. */
function resolveUserProfileId(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectResolvedProfileById(db, profileId)?.id;
}
/** Reads a profile's protocol-facing representation through its merge head. */
function getUserProfileListItem(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectUserProfileListItemById(db, requireResolvedProfileById(db, profileId).id);
}
/** Reads merge-aware display data without exposing avatar content through list/RPC shapes. */
function getUserProfileDisplay(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	const profile = requireResolvedProfileById(db, profileId);
	const avatarMime = toAvatarMime(profile.avatar_mime);
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
	const profileId = generateSecureUuid();
	const now = Date.now();
	const displayName = initialDisplayName ?? (normalizedEmail.split("@", 1)[0] || normalizedEmail).slice(0, MAX_USER_PROFILE_DISPLAY_NAME_LENGTH);
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = profileDb(db);
		const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		if (existingAlias) return toUserProfile(requireResolvedProfileById(db, existingAlias.profile_id));
		const row = {
			id: profileId,
			display_name: displayName,
			avatar: null,
			avatar_mime: null,
			avatar_sha256: null,
			merged_into: null,
			created_at: now,
			updated_at: now
		};
		executeSqliteQuerySync(db, kysely.insertInto("user_profiles").values(row));
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_emails").values({
			email: normalizedEmail,
			profile_id: profileId,
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
	const profileId = generateSecureUuid();
	const now = Date.now();
	ensureUserProfilesSchema(params.options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = profileDb(db);
		const existingIdentity = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_identities").select("profile_id").where("provider", "=", params.provider).where("subject", "=", params.subject));
		if (existingIdentity) return toUserProfile(requireResolvedProfileById(db, existingIdentity.profile_id));
		const row = {
			id: profileId,
			display_name: params.initialDisplayName,
			avatar: null,
			avatar_mime: null,
			avatar_sha256: null,
			merged_into: null,
			created_at: now,
			updated_at: now
		};
		executeSqliteQuerySync(db, kysely.insertInto("user_profiles").values(row));
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
			provider: params.provider,
			subject: params.subject,
			profile_id: profileId,
			created_at: now
		}));
		return toUserProfile(row);
	}, params.options, { operationLabel: "user-profiles.ensure-identity" });
}
function adoptDisplayNameIfEmpty(profileId, displayName, options) {
	if (!displayName) {
		const { db } = openOpenClawStateDatabase(options);
		return toUserProfile(requireResolvedProfileById(db, profileId));
	}
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedProfileById(db, profileId);
		if (profile.display_name !== null) return toUserProfile(profile);
		executeSqliteQuerySync(db, profileDb(db).updateTable("user_profiles").set({
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
	const beforeFetch = requireResolvedProfileById(db, params.profileId);
	if (beforeFetch.avatar !== null || !params.profilePic) return toUserProfile(beforeFetch);
	const avatar = await fetchTailscaleAvatar(params.profilePic, params.fetchOptions);
	if (!avatar) return toUserProfile(requireResolvedProfileById(db, params.profileId));
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		const profile = requireResolvedProfileById(transactionDb, params.profileId);
		if (profile.avatar !== null) return toUserProfile(profile);
		const sha256 = createHash("sha256").update(avatar.bytes).digest("hex");
		executeSqliteQuerySync(transactionDb, profileDb(transactionDb).updateTable("user_profiles").set({
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
		const kysely = profileDb(db);
		const target = requireResolvedProfileById(db, targetProfileId);
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
		if (remainingAliases.length === 0) {
			const mergeSourceIds = [existingAlias.profile_id, ...executeSqliteQuerySync(db, kysely.selectFrom("user_profiles").select("id").where("merged_into", "=", existingAlias.profile_id)).rows.map((row) => row.id)];
			for (const sourceProfileId of mergeSourceIds) mergeUserPreferences(db, sourceProfileId, target.id);
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
				merged_into: target.id,
				updated_at: now
			}).where("id", "=", existingAlias.profile_id));
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
				merged_into: target.id,
				updated_at: now
			}).where("merged_into", "=", existingAlias.profile_id));
		} else executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", existingAlias.profile_id));
		return selectUserProfileListItemById(db, target.id);
	}, options, { operationLabel: "user-profiles.link-email" });
}
function setDisplayName(profileId, name, options = {}) {
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedProfileById(db, profileId);
		executeSqliteQuerySync(db, profileDb(db).updateTable("user_profiles").set({
			display_name: name,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-display-name" });
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
		const profile = requireResolvedProfileById(db, profileId);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		executeSqliteQuerySync(db, profileDb(db).updateTable("user_profiles").set({
			avatar: bytes,
			avatar_mime: mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-avatar" }));
}
function getProfileAvatar(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	const profile = selectResolvedProfileById(db, profileId);
	if (!profile?.avatar || !profile.avatar_mime || !profile.avatar_sha256) return;
	const mime = toAvatarMime(profile.avatar_mime);
	return mime ? {
		bytes: profile.avatar,
		mime,
		sha256: profile.avatar_sha256,
		updatedAt: profile.updated_at
	} : void 0;
}
function listProfiles(options = {}) {
	ensureUserProfilesSchema(options);
	const database = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const kysely = profileDb(database.db);
		const profiles = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profiles").select([
			"id",
			"display_name",
			"avatar_mime",
			"merged_into",
			"created_at",
			"updated_at",
			hasAvatarColumn()
		]).orderBy("created_at", "asc").orderBy("id", "asc")).rows;
		const emails = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profile_emails").select(["profile_id", "email"]).orderBy("email", "asc")).rows;
		const emailsByProfile = /* @__PURE__ */ new Map();
		for (const email of emails) {
			const list = emailsByProfile.get(email.profile_id) ?? [];
			list.push(email.email);
			emailsByProfile.set(email.profile_id, list);
		}
		return profiles.map((profile) => toUserProfileListItem(profile, emailsByProfile.get(profile.id) ?? []));
	}, {
		databaseLabel: database.path,
		operationLabel: "user-profiles.list"
	});
}
/** True when session-sharing policy can distinguish at least two durable people. */
function hasMultipleSessionSharingIdentities(options = {}) {
	return listProfiles(options).filter((profile) => !profile.mergedInto).length >= 2;
}
//#endregion
export { getUserPreferences as _, ensureUserProfilesSchema as a, getUserProfileDisplay as c, linkEmail as d, listProfiles as f, classifyTailscaleLogin as g, setDisplayName as h, ensureProfileForTailscaleIdentity as i, getUserProfileListItem as l, setAvatar as m, adoptTailscaleProfileAvatar as n, formatUserProfileAvatarEtag as o, resolveUserProfileId as p, ensureProfileForEmail as r, getProfileAvatar as s, UserProfileNotFoundError as t, hasMultipleSessionSharingIdentities as u, setUserPreferences as v };
