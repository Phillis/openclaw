import { n as ok, t as err } from "./result-BQGgYouL.js";
import { An as executeSqliteQuerySync, Bt as tableHasColumn, Mn as getNodeSqliteKysely, Rt as ensureColumn, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { t as GIT_COAUTHOR_PREFERENCE_KEY } from "./users-Dv8cbe7S.js";
import { r as readRemoteMediaBuffer } from "./fetch-evq4MjQ1.js";
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
function mutateUserPreference(database, profileId, key, value) {
	const db = getNodeSqliteKysely(database);
	if (value === void 0) {
		if (tableExists(database, "user_preferences")) executeSqliteQuerySync(database, db.deleteFrom("user_preferences").where("profile_id", "=", profileId).where("pref_key", "=", key));
		return;
	}
	const updatedAtMs = Date.now();
	const valueJson = JSON.stringify(value);
	executeSqliteQuerySync(database, db.insertInto("user_preferences").values({
		profile_id: profileId,
		pref_key: key,
		value_json: valueJson,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.columns(["profile_id", "pref_key"]).doUpdateSet({
		value_json: valueJson,
		updated_at_ms: updatedAtMs
	})));
}
function selectUserPreferenceValues(database, profileIds, key) {
	if (profileIds.length === 0 || !tableExists(database, "user_preferences")) return /* @__PURE__ */ new Map();
	const rows = executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("user_preferences").select(["profile_id", "value_json"]).where("profile_id", "in", [...profileIds]).where("pref_key", "=", key)).rows;
	return new Map(rows.map((row) => [row.profile_id, JSON.parse(row.value_json)]));
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
//#region src/utils/github-login.ts
const GITHUB_LOGIN_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/u;
function normalizeGitHubLogin(value) {
	const login = value.trim();
	return GITHUB_LOGIN_PATTERN.test(login) ? login : void 0;
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
  role TEXT,
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
  canonical_login TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (provider, subject)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id
  ON user_profile_identities(profile_id);
`;
var UserProfileNotFoundError = class extends Error {
	constructor(profileId) {
		super(`user profile not found: ${profileId}`);
		this.name = "UserProfileNotFoundError";
	}
};
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const roleEnsuredDatabases = /* @__PURE__ */ new WeakSet();
function ensureUserProfilesSchema(options, database = openOpenClawStateDatabase(options)) {
	if (ensuredDatabases.has(database.db)) return;
	let hasRoleColumn = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(USER_PROFILES_SCHEMA_SQL);
		ensureColumn(db, "user_profile_identities", "canonical_login TEXT");
		hasRoleColumn = tableHasColumn(db, "user_profiles", "role");
	}, options, { operationLabel: "user-profiles.schema.ensure" });
	ensuredDatabases.add(database.db);
	if (hasRoleColumn) roleEnsuredDatabases.add(database.db);
}
function ensureUserProfileRoleSchema(options, database = openOpenClawStateDatabase(options)) {
	if (roleEnsuredDatabases.has(database.db)) return;
	ensureUserProfilesSchema(options, database);
	if (roleEnsuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => ensureColumn(db, "user_profiles", "role TEXT"), options, { operationLabel: "user-profiles.role.schema.ensure" });
	roleEnsuredDatabases.add(database.db);
}
function hasEnsuredUserProfileRoleSchema(database) {
	return roleEnsuredDatabases.has(database);
}
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
function toAvatarMime(value) {
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
		const mime = toAvatarMime(loaded.contentType);
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
//#region src/state/user-profiles-internal.ts
function userProfilesDb(db) {
	return getNodeSqliteKysely(db);
}
function normalizeUserProfileAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.find((candidate) => candidate === value) ?? null;
}
function selectUserProfileById(db, profileId) {
	return executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profiles").selectAll().where("id", "=", profileId));
}
function selectResolvedUserProfileById(db, profileId) {
	const profile = selectUserProfileById(db, profileId);
	if (!profile?.merged_into) return profile;
	return selectUserProfileById(db, profile.merged_into) ?? profile;
}
function requireResolvedUserProfileById(db, profileId) {
	const profile = selectResolvedUserProfileById(db, profileId);
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
function formatUserProfileAvatarEtag(sha256, mime) {
	return `"${sha256}-${mime.slice(6)}"`;
}
function getProfileAvatar(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const profile = selectResolvedUserProfileById(openOpenClawStateDatabase(options).db, profileId);
	const mime = normalizeUserProfileAvatarMime(profile?.avatar_mime ?? null);
	return profile?.avatar && mime && profile.avatar_sha256 ? {
		bytes: profile.avatar,
		mime,
		sha256: profile.avatar_sha256,
		updatedAt: profile.updated_at
	} : void 0;
}
//#endregion
//#region src/state/user-profile-github-identity.ts
const GITHUB_PROVIDER = "github";
const GITHUB_LOGIN_SUBJECT_PREFIX = "login:";
function parseStoredGitHubIdentity(row) {
	const accountId = Number(row.subject);
	const login = row.canonical_login ? normalizeGitHubLogin(row.canonical_login) : void 0;
	return login && Number.isSafeInteger(accountId) && accountId > 0 ? {
		accountId,
		login
	} : null;
}
function toPublicGitHubIdentity(identity) {
	return {
		login: identity.login,
		profileUrl: `https://github.com/${identity.login}`,
		avatarUrl: `https://avatars.githubusercontent.com/u/${identity.accountId}?v=4`
	};
}
function selectStoredGitHubIdentities(db, profileIds) {
	if (profileIds?.length === 0) return /* @__PURE__ */ new Map();
	let query = userProfilesDb(db).selectFrom("user_profile_identities").select([
		"profile_id",
		"subject",
		"canonical_login"
	]).where("provider", "=", GITHUB_PROVIDER).where("canonical_login", "is not", null);
	if (profileIds) query = query.where("profile_id", "in", [...profileIds]);
	const rows = executeSqliteQuerySync(db, query).rows;
	return new Map(rows.flatMap((row) => {
		const identity = parseStoredGitHubIdentity(row);
		return identity ? [[row.profile_id, identity]] : [];
	}));
}
function resolveCachedGitHubIdentity(params, options = {}) {
	const email = params.email.trim().toLowerCase();
	if (!email || !Number.isSafeInteger(params.accountId) || params.accountId <= 0) return;
	const database = openOpenClawStateDatabase(options);
	ensureUserProfilesSchema(options, database);
	const { db } = database;
	const alias = executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_emails").select("profile_id").where("email", "=", email));
	const profile = alias ? selectResolvedUserProfileById(db, alias.profile_id) : void 0;
	if (!profile) return;
	return selectStoredGitHubIdentities(db, [profile.id]).get(profile.id)?.accountId === params.accountId ? {
		profileId: profile.id,
		updatedAt: profile.updated_at
	} : void 0;
}
function deleteProfileGitHubIdentities(db, profileIds, keepSubject) {
	if (profileIds.length === 0) return;
	let query = userProfilesDb(db).deleteFrom("user_profile_identities").where("provider", "=", GITHUB_PROVIDER).where("profile_id", "in", [...profileIds]).where("canonical_login", "is not", null);
	if (keepSubject) query = query.where("subject", "!=", keepSubject);
	executeSqliteQuerySync(db, query);
}
function githubAuthenticationSubject(login) {
	const normalized = login.trim().toLowerCase();
	if (!normalized) throw new TypeError("GitHub login is invalid");
	return `${GITHUB_LOGIN_SUBJECT_PREFIX}${normalized}`;
}
function selectUserProfileGitHubIdentities(db, profileIds) {
	return new Map([...selectStoredGitHubIdentities(db, profileIds)].map(([profileId, identity]) => [profileId, toPublicGitHubIdentity(identity)]));
}
/** Resolves bounded participants only when verified identity and public credit opt-in agree. */
function resolveUserProfileGitHubAttribution(profileIds, options = {}) {
	if (profileIds.length === 0) return /* @__PURE__ */ new Map();
	const database = openOpenClawStateDatabase(options);
	ensureUserProfilesSchema(options, database);
	const { db } = database;
	const profiles = executeSqliteQuerySync(db, userProfilesDb(db).selectFrom("user_profiles").select(["id", "merged_into"]).where("id", "in", [...profileIds])).rows;
	const canonicalBySource = new Map(profiles.map((profile) => [profile.id, profile.merged_into ?? profile.id]));
	const canonicalIds = [...new Set(canonicalBySource.values())];
	const identities = selectStoredGitHubIdentities(db, canonicalIds);
	const preferences = selectUserPreferenceValues(db, canonicalIds, GIT_COAUTHOR_PREFERENCE_KEY);
	return new Map([...canonicalBySource].map(([sourceId, canonicalId]) => [sourceId, preferences.get(canonicalId) === true ? identities.get(canonicalId) ?? null : null]));
}
/** Keeps GitHub consent attached only to the immutable account that survives a profile merge. */
function prepareUserProfileGitHubMerge(db, sourceProfileIds, targetProfileId) {
	const identities = selectStoredGitHubIdentities(db, [targetProfileId, ...sourceProfileIds]);
	const targetIdentity = identities.get(targetProfileId);
	const survivingSourceProfileId = targetIdentity ? void 0 : sourceProfileIds.find((profileId) => identities.has(profileId));
	const survivingAccountId = targetIdentity?.accountId ?? (survivingSourceProfileId ? identities.get(survivingSourceProfileId)?.accountId : void 0);
	for (const sourceProfileId of sourceProfileIds) {
		const sourceIdentity = identities.get(sourceProfileId);
		if (!sourceIdentity || sourceIdentity.accountId !== survivingAccountId) mutateUserPreference(db, sourceProfileId, GIT_COAUTHOR_PREFERENCE_KEY);
	}
	deleteProfileGitHubIdentities(db, sourceProfileIds.filter((profileId) => profileId !== survivingSourceProfileId));
}
function applyVerifiedGitHubIdentity(params) {
	if (!Number.isSafeInteger(params.identity.accountId) || params.identity.accountId <= 0) throw new TypeError("GitHub account id must be a positive safe integer");
	const login = normalizeGitHubLogin(params.identity.login);
	if (!login) throw new TypeError("GitHub login is invalid");
	const db = params.db;
	const kysely = userProfilesDb(db);
	const subject = String(params.identity.accountId);
	const now = Date.now();
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_identities").select("profile_id").where("provider", "=", GITHUB_PROVIDER).where("subject", "=", subject).where("canonical_login", "is not", null));
	const aliasIdentity = params.alias.kind === "email" ? executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", params.alias.email)) : executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_identities").select("profile_id").where("provider", "=", GITHUB_PROVIDER).where("subject", "=", params.alias.subject).where("canonical_login", "is", null));
	const aliasProfileId = aliasIdentity ? selectResolvedUserProfileById(db, aliasIdentity.profile_id)?.id : void 0;
	const aliasGitHubIdentity = aliasProfileId ? selectStoredGitHubIdentities(db, [aliasProfileId]).get(aliasProfileId) : void 0;
	const currentProfileId = (aliasProfileId && (aliasGitHubIdentity === void 0 || aliasGitHubIdentity.accountId === params.identity.accountId) ? aliasProfileId : void 0) ?? (existing ? selectResolvedUserProfileById(db, existing.profile_id)?.id : void 0) ?? params.createProfile();
	const targetProfileId = existing ? selectResolvedUserProfileById(db, existing.profile_id)?.id ?? currentProfileId : currentProfileId;
	const currentIdentity = selectStoredGitHubIdentities(db, [currentProfileId]).get(currentProfileId);
	if (targetProfileId === currentProfileId && currentIdentity?.accountId !== params.identity.accountId) mutateUserPreference(db, targetProfileId, GIT_COAUTHOR_PREFERENCE_KEY);
	if (currentProfileId !== targetProfileId) params.mergeProfiles(currentProfileId, targetProfileId);
	deleteProfileGitHubIdentities(db, [targetProfileId], subject);
	executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
		provider: GITHUB_PROVIDER,
		subject,
		profile_id: targetProfileId,
		canonical_login: login,
		created_at: now
	}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doUpdateSet({
		profile_id: targetProfileId,
		canonical_login: login
	})));
	if (params.alias.kind === "email") executeSqliteQuerySync(db, kysely.insertInto("user_profile_emails").values({
		email: params.alias.email,
		profile_id: targetProfileId,
		created_at: now
	}).onConflict((conflict) => conflict.column("email").doUpdateSet({ profile_id: targetProfileId })));
	else executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
		provider: GITHUB_PROVIDER,
		subject: params.alias.subject,
		profile_id: targetProfileId,
		canonical_login: null,
		created_at: now
	}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doUpdateSet({
		profile_id: targetProfileId,
		canonical_login: null
	})));
	return targetProfileId;
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
export { getUserPreferences as C, ensureUserPreferencesSchema as S, setUserPreferences as T, UserProfileNotFoundError as _, resolveCachedGitHubIdentity as a, hasEnsuredUserProfileRoleSchema as b, formatUserProfileAvatarEtag as c, requireResolvedUserProfileById as d, selectResolvedUserProfileById as f, fetchTailscaleAvatar as g, USER_PROFILE_AVATAR_MIME_TYPES as h, prepareUserProfileGitHubMerge as i, getProfileAvatar as l, MAX_USER_PROFILE_AVATAR_BYTES as m, applyVerifiedGitHubIdentity as n, resolveUserProfileGitHubAttribution as o, userProfilesDb as p, githubAuthenticationSubject as r, selectUserProfileGitHubIdentities as s, classifyTailscaleLogin as t, normalizeUserProfileAvatarMime as u, ensureUserProfileRoleSchema as v, mergeUserPreferences as w, normalizeGitHubLogin as x, ensureUserProfilesSchema as y };
