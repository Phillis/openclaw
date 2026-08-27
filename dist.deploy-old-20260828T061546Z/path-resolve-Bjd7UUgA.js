import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { r as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-Dbce_H9p.js";
import { Xt as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-kmBThqu6.js";
import { r as readConfigMachineState } from "./config-machine-state-DjliVw3j.js";
import path from "node:path";
//#region src/agents/auth-profiles/shared-main-dir.ts
/** Resolve the shipped shared-main auth store, including its supported relocation. */
function resolveSharedMainAuthAgentDir(env = process.env) {
	const configured = env.OPENCLAW_AGENT_DIR?.trim();
	return configured ? resolveUserPath(configured, env) : path.join(resolveStateDir(env), "agents", LEGACY_IMPLICIT_AGENT_ID, "agent");
}
//#endregion
//#region src/agents/auth-profiles/path-resolve.ts
/**
* Auth profile path resolution.
* Centralizes canonical shared SQLite and cross-agent OAuth refresh lock paths.
*/
const SHARED_AUTH_STORE_STATE_KEY = "auth.sharedStore";
const SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT = 256;
const sharedAuthStoreOwnershipByDatabasePath = /* @__PURE__ */ new Map();
var InvalidSharedAuthStoreOwnershipError = class extends Error {
	constructor(value) {
		super(`Config machine state ${SHARED_AUTH_STORE_STATE_KEY} has an invalid shared auth store location (${JSON.stringify(value)}); run openclaw doctor --fix.`);
		this.code = "INVALID_SHARED_AUTH_STORE_OWNERSHIP";
		this.action = "openclaw doctor --fix";
		this.stateKey = SHARED_AUTH_STORE_STATE_KEY;
		this.name = "InvalidSharedAuthStoreOwnershipError";
	}
};
function parseSharedAuthStoreOwnership(value) {
	if (value === void 0) return { location: "legacy-main" };
	if (isRecord(value) && Object.keys(value).length === 1 && (value.location === "legacy-main" || value.location === "state-db")) return { location: value.location };
	throw new InvalidSharedAuthStoreOwnershipError(value);
}
/** Resolve the process-stable owner of the shared auth store. */
function resolveSharedAuthStoreOwnership(env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	if (sharedAuthStoreOwnershipByDatabasePath.size >= SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT) throw new Error("Shared auth store ownership cache exceeded its process root limit; restart OpenClaw.");
	const ownership = parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, {
		env,
		path: databasePath
	}));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Update the process-stable cache after this process commits the ownership row. */
function noteCommittedSharedAuthStoreOwnership(ownership, env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
}
/** Resolve the canonical shared auth database path. */
function resolveSharedAuthStorePath(env = process.env) {
	if (resolveSharedAuthStoreOwnership(env).location === "state-db") return resolveOpenClawStateSqlitePath(env);
	return path.join(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite");
}
/**
* Resolve the path of the cross-agent, per-profile OAuth refresh coordination
* lock. The filename digests a JSON tuple of `[provider, profileId]` so it is
* filesystem-safe for arbitrary unicode/control-character inputs and always
* bounded in length. Tuple encoding makes it impossible to collide two distinct
* `(provider, profileId)` pairs by separator-sensitive string concatenation.
*
* This lock is the serialization point that prevents the `refresh_token_reused`
* storm when N agents share one OAuth profile (see issue #26322): every agent
* that attempts a refresh acquires this same file lock, so only one HTTP
* refresh is in-flight at a time and peers can adopt the resulting fresh
* credentials instead of racing against a single-use refresh token.
*
* The key intentionally includes `provider` so that two profiles that
* happen to share a `profileId` across providers (operator-renamed profile,
* test fixture, etc.) do not needlessly serialize against each other.
*/
function resolveOAuthRefreshLockPath(provider, profileId) {
	const safeId = `lock-${oauthLockPathDigest(JSON.stringify([provider, profileId]))}`;
	return path.join(resolveStateDir(), "locks", "oauth-refresh", safeId);
}
function oauthLockPathDigest(value) {
	let left = 14695981039346656037n;
	let right = 11160318154034397263n;
	const prime = 1099511628211n;
	const mask = 18446744073709551615n;
	for (const byte of Buffer.from(value, "utf8")) {
		const octet = BigInt(byte);
		left = (left ^ octet) * prime & mask;
		right = (right ^ octet + 11400714819323198485n) * prime & mask;
	}
	return `${left.toString(16).padStart(16, "0")}${right.toString(16).padStart(16, "0")}`;
}
//#endregion
export { resolveSharedAuthStorePath as a, resolveSharedAuthStoreOwnership as i, noteCommittedSharedAuthStoreOwnership as n, resolveSharedMainAuthAgentDir as o, resolveOAuthRefreshLockPath as r, SHARED_AUTH_STORE_STATE_KEY as t };
