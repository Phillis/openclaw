import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { d as isSecretRef, p as isValidEnvSecretRefId } from "./types.secrets-Bre8L6Ts.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { n as isManagedGitHubProfileId } from "./github-identity-profile-id-BJzGq1wi.js";
import { t as runCommandBuffered } from "./exec-D2kbpwdA.js";
import { d as deleteHiddenGitHubSecretRecord, f as listHiddenGitHubSecretRecordNames, m as writeHiddenGitHubSecretRecord, p as readHiddenGitHubSecretRecord } from "./secret-store-CxIqAOaM.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
//#region src/agents/github-oauth-records.ts
const GITHUB_DEVICE_VERIFICATION_URI = "https://github.com/login/device";
const OAUTH_RECORD_PREFIX = "github-oauth-";
const OPAQUE_ID_PATTERN = /^[a-f0-9]{32}$/u;
const DEVICE_REQUEST_ID_PATTERN = /^github-device-[a-f0-9]{32}$/u;
const DEVICE_CODE_PATTERN = /^[A-Za-z0-9_-]{40}$/u;
const USER_CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/u;
const MAX_DEVICE_LIFETIME_MS = 15 * 6e4;
const MAX_POLL_INTERVAL_MS = 6e4;
const MAX_TOKEN_LENGTH = 2048;
const MAX_SCOPE_COUNT = 32;
const MAX_SCOPE_LENGTH = 64;
function createGitHubOAuthRecord(params) {
	return {
		version: 1,
		profileId: params.profileId,
		scope: params.scope,
		agentId: params.agentId,
		accountId: params.account.accountId,
		login: params.account.login,
		refreshToken: params.tokens.refreshToken,
		accessExpiresAtMs: params.now + params.tokens.expiresInSeconds * 1e3,
		refreshExpiresAtMs: params.now + params.tokens.refreshTokenExpiresInSeconds * 1e3,
		scopes: params.tokens.scopes,
		createdAtMs: params.now,
		...params.pendingInitial ? { pendingInitial: params.pendingInitial } : {},
		...params.pendingRefresh ? { pendingRefresh: true } : {}
	};
}
function hasExactKeys(value, keys) {
	const actual = Object.keys(value).toSorted();
	return actual.length === keys.length && actual.every((key, index) => key === keys[index]);
}
function isTimestamp(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function parseIdentityConfig(value) {
	if (value === null) return null;
	if (!isRecord(value)) return;
	const keys = [
		...value.gitAuthor === void 0 ? [] : ["gitAuthor"],
		...value.kind === void 0 ? [] : ["kind"],
		"profileId"
	].toSorted();
	const profileId = typeof value.profileId === "string" ? value.profileId : "";
	if (!hasExactKeys(value, keys) || !isManagedGitHubProfileId(profileId) || value.kind !== void 0 && value.kind !== "oauth") return;
	if (value.gitAuthor === void 0) return {
		profileId,
		...value.kind === "oauth" ? { kind: "oauth" } : {}
	};
	if (!isRecord(value.gitAuthor)) return;
	const authorKeys = Object.keys(value.gitAuthor).toSorted();
	if (authorKeys.length === 0 || authorKeys.some((key) => key !== "email" && key !== "name") || value.gitAuthor.name !== void 0 && (typeof value.gitAuthor.name !== "string" || !value.gitAuthor.name.trim()) || value.gitAuthor.email !== void 0 && (typeof value.gitAuthor.email !== "string" || !value.gitAuthor.email.trim())) return;
	return {
		profileId,
		...value.kind === "oauth" ? { kind: "oauth" } : {},
		gitAuthor: {
			...typeof value.gitAuthor.name === "string" ? { name: value.gitAuthor.name } : {},
			...typeof value.gitAuthor.email === "string" ? { email: value.gitAuthor.email } : {}
		}
	};
}
function parseScope(value) {
	return value === "system" || value === "agent" ? value : void 0;
}
function parseCanonicalAgentId(value) {
	if (typeof value !== "string" || !value || value.length > 128) return;
	return normalizeAgentId(value) === value ? value : void 0;
}
function parseAgentLifecycleBinding(value) {
	if (!isRecord(value) || !hasExactKeys(value, ["agentId", "provenance"])) return;
	const agentId = parseCanonicalAgentId(value.agentId);
	if (!agentId) return;
	if (value.provenance === null) return {
		agentId,
		provenance: null
	};
	if (!isRecord(value.provenance) || !hasExactKeys(value.provenance, [
		"agentId",
		"createdAtMs",
		"createdVia",
		"creatorAgentId"
	])) return;
	const provenanceAgentId = parseCanonicalAgentId(value.provenance.agentId);
	const creatorAgentId = value.provenance.creatorAgentId === null ? null : parseCanonicalAgentId(value.provenance.creatorAgentId);
	if (provenanceAgentId !== agentId || value.provenance.createdVia !== "operator" && value.provenance.createdVia !== "agent" && value.provenance.createdVia !== "claw" || creatorAgentId === void 0 || !isTimestamp(value.provenance.createdAtMs)) return;
	return {
		agentId,
		provenance: {
			agentId,
			createdVia: value.provenance.createdVia,
			creatorAgentId,
			createdAtMs: value.provenance.createdAtMs
		}
	};
}
function githubDeviceRecordName(requestId) {
	if (!DEVICE_REQUEST_ID_PATTERN.test(requestId)) throw new Error("GitHub device authorization request id is invalid.");
	return requestId;
}
function githubOAuthRecordName(profileId) {
	if (!isManagedGitHubProfileId(profileId)) throw new Error("Managed GitHub profile id is invalid.");
	return `${OAUTH_RECORD_PREFIX}${profileId.slice(4)}`;
}
function parseGitHubOAuthProfileId(name) {
	const opaqueId = name.startsWith(OAUTH_RECORD_PREFIX) ? name.slice(13) : "";
	return OPAQUE_ID_PATTERN.test(opaqueId) ? `ghp_${opaqueId}` : void 0;
}
function parseGitHubDeviceAuthorizationRecord(raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		return;
	}
	if (!isRecord(value)) return;
	const expectedIdentity = parseIdentityConfig(value.expectedIdentity);
	const scope = parseScope(value.scope);
	const agentId = parseCanonicalAgentId(value.agentId);
	const agentLifecycleBinding = value.agentLifecycleBinding === void 0 ? void 0 : parseAgentLifecycleBinding(value.agentLifecycleBinding);
	const keys = [
		"agentId",
		...value.agentLifecycleBinding === void 0 ? [] : ["agentLifecycleBinding"],
		"createdAtMs",
		"deviceCode",
		"expectedIdentity",
		"expiresAtMs",
		"nextPollAtMs",
		"pollIntervalMs",
		"requestId",
		"scope",
		"userCode",
		"verificationUri",
		"version"
	].toSorted();
	if (!hasExactKeys(value, keys) || value.version !== 1 || typeof value.requestId !== "string" || !DEVICE_REQUEST_ID_PATTERN.test(value.requestId) || typeof value.deviceCode !== "string" || !DEVICE_CODE_PATTERN.test(value.deviceCode) || typeof value.userCode !== "string" || !USER_CODE_PATTERN.test(value.userCode) || value.verificationUri !== GITHUB_DEVICE_VERIFICATION_URI || !isTimestamp(value.createdAtMs) || !isTimestamp(value.expiresAtMs) || value.expiresAtMs <= value.createdAtMs || value.expiresAtMs - value.createdAtMs > MAX_DEVICE_LIFETIME_MS || !isTimestamp(value.pollIntervalMs) || value.pollIntervalMs < 1e3 || value.pollIntervalMs > MAX_POLL_INTERVAL_MS || !isTimestamp(value.nextPollAtMs) || value.nextPollAtMs < value.createdAtMs || value.nextPollAtMs > value.expiresAtMs || !agentId || !scope || (scope === "agent" ? !agentLifecycleBinding || agentLifecycleBinding.agentId !== agentId : agentLifecycleBinding !== void 0) || expectedIdentity === void 0) return;
	return {
		version: 1,
		requestId: value.requestId,
		deviceCode: value.deviceCode,
		userCode: value.userCode,
		verificationUri: GITHUB_DEVICE_VERIFICATION_URI,
		createdAtMs: value.createdAtMs,
		expiresAtMs: value.expiresAtMs,
		pollIntervalMs: value.pollIntervalMs,
		nextPollAtMs: value.nextPollAtMs,
		agentId,
		scope,
		expectedIdentity,
		...agentLifecycleBinding ? { agentLifecycleBinding } : {}
	};
}
function parseScopes(value) {
	if (!Array.isArray(value) || value.length > MAX_SCOPE_COUNT || value.some((scope) => typeof scope !== "string" || scope.length < 1 || scope.length > MAX_SCOPE_LENGTH || !/^[a-z0-9:_-]+$/u.test(scope))) return;
	const normalized = [...new Set(value)].toSorted((left, right) => left.localeCompare(right));
	return normalized.length === value.length && normalized.every((scope, index) => scope === value[index]) ? normalized : void 0;
}
function parsePendingInitial(value) {
	if (!isRecord(value)) return;
	const expectedIdentity = parseIdentityConfig(value.expectedIdentity);
	const scope = parseScope(value.scope);
	const agentId = parseCanonicalAgentId(value.agentId);
	const agentLifecycleBinding = value.agentLifecycleBinding === void 0 ? void 0 : parseAgentLifecycleBinding(value.agentLifecycleBinding);
	if (!hasExactKeys(value, [
		"agentId",
		...value.agentLifecycleBinding === void 0 ? [] : ["agentLifecycleBinding"],
		"expectedIdentity",
		"requestId",
		"scope"
	].toSorted()) || typeof value.requestId !== "string" || !DEVICE_REQUEST_ID_PATTERN.test(value.requestId) || !scope || !agentId || expectedIdentity === void 0 || (scope === "agent" ? !agentLifecycleBinding || agentLifecycleBinding.agentId !== agentId : agentLifecycleBinding !== void 0)) return;
	return {
		requestId: value.requestId,
		scope,
		agentId,
		expectedIdentity,
		...agentLifecycleBinding ? { agentLifecycleBinding } : {}
	};
}
function parseGitHubOAuthRecord(raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		return;
	}
	if (!isRecord(value)) return;
	const keys = [
		...[
			"accessExpiresAtMs",
			"accountId",
			"agentId",
			"createdAtMs",
			"login",
			"profileId",
			"refreshExpiresAtMs",
			"refreshToken",
			"scope",
			"scopes",
			"version"
		],
		...value.pendingInitial === void 0 ? [] : ["pendingInitial"],
		...value.pendingRefresh === void 0 ? [] : ["pendingRefresh"],
		...value.refreshFailure === void 0 ? [] : ["refreshFailure"]
	];
	const scope = parseScope(value.scope);
	const agentId = parseCanonicalAgentId(value.agentId);
	const scopes = parseScopes(value.scopes);
	const profileId = typeof value.profileId === "string" ? value.profileId : "";
	const pendingInitial = value.pendingInitial === void 0 ? void 0 : parsePendingInitial(value.pendingInitial);
	if (!hasExactKeys(value, keys.toSorted()) || value.version !== 1 || !isManagedGitHubProfileId(profileId) || value.pendingInitial !== void 0 && (!pendingInitial || pendingInitial.scope !== scope || pendingInitial.agentId !== agentId) || value.pendingRefresh !== void 0 && value.pendingRefresh !== true || value.pendingInitial !== void 0 && value.pendingRefresh !== void 0 || value.pendingRefresh !== void 0 && value.refreshFailure !== void 0 || value.refreshFailure !== void 0 && value.refreshFailure !== "expired" && value.refreshFailure !== "failed" || !agentId || !scope || !Number.isSafeInteger(value.accountId) || Number(value.accountId) <= 0 || typeof value.login !== "string" || !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/u.test(value.login) || typeof value.refreshToken !== "string" || value.refreshToken.length < 1 || value.refreshToken.length > MAX_TOKEN_LENGTH || /[\r\n]/u.test(value.refreshToken) || !isTimestamp(value.createdAtMs) || !isTimestamp(value.accessExpiresAtMs) || !isTimestamp(value.refreshExpiresAtMs) || value.accessExpiresAtMs <= value.createdAtMs || value.refreshExpiresAtMs <= value.accessExpiresAtMs || !scopes) return;
	return {
		version: 1,
		profileId,
		agentId,
		scope,
		accountId: Number(value.accountId),
		login: value.login,
		refreshToken: value.refreshToken,
		accessExpiresAtMs: value.accessExpiresAtMs,
		refreshExpiresAtMs: value.refreshExpiresAtMs,
		scopes,
		createdAtMs: value.createdAtMs,
		...pendingInitial ? { pendingInitial } : {},
		...value.pendingRefresh === true ? { pendingRefresh: true } : {},
		...value.refreshFailure === "expired" || value.refreshFailure === "failed" ? { refreshFailure: value.refreshFailure } : {}
	};
}
function writeGitHubDeviceAuthorizationRecord(record) {
	const parsed = parseGitHubDeviceAuthorizationRecord(JSON.stringify(record));
	if (!parsed || parsed.requestId !== record.requestId) throw new Error("GitHub device authorization record is invalid.");
	writeHiddenGitHubSecretRecord({
		name: githubDeviceRecordName(record.requestId),
		value: JSON.stringify(parsed)
	});
}
function readGitHubDeviceAuthorizationRecord(requestId) {
	const raw = readHiddenGitHubSecretRecord({ name: githubDeviceRecordName(requestId) });
	const record = raw === void 0 ? void 0 : parseGitHubDeviceAuthorizationRecord(raw);
	return record?.requestId === requestId ? record : void 0;
}
function deleteGitHubDeviceAuthorizationRecord(requestId) {
	deleteHiddenGitHubSecretRecord({ name: githubDeviceRecordName(requestId) });
}
function listGitHubDeviceAuthorizationRecords() {
	return listHiddenGitHubSecretRecordNames({ prefix: "github-device" }).flatMap((name) => {
		const requestId = name;
		if (!DEVICE_REQUEST_ID_PATTERN.test(requestId)) return [];
		return [{
			requestId,
			record: readGitHubDeviceAuthorizationRecord(requestId)
		}];
	});
}
function writeGitHubOAuthRecord(record) {
	const parsed = parseGitHubOAuthRecord(JSON.stringify(record));
	if (!parsed || parsed.profileId !== record.profileId) throw new Error("GitHub OAuth record is invalid.");
	writeHiddenGitHubSecretRecord({
		name: githubOAuthRecordName(record.profileId),
		value: JSON.stringify(parsed)
	});
}
function readGitHubOAuthRecord(profileId) {
	const raw = readHiddenGitHubSecretRecord({ name: githubOAuthRecordName(profileId) });
	const record = raw === void 0 ? void 0 : parseGitHubOAuthRecord(raw);
	return record?.profileId === profileId ? record : void 0;
}
function inspectGitHubOAuthRecord(profileId) {
	const raw = readHiddenGitHubSecretRecord({ name: githubOAuthRecordName(profileId) });
	if (raw === void 0) return { state: "missing" };
	const record = parseGitHubOAuthRecord(raw);
	return record?.profileId === profileId ? {
		state: "valid",
		record
	} : { state: "invalid" };
}
function deleteGitHubOAuthRecord(profileId) {
	deleteHiddenGitHubSecretRecord({ name: githubOAuthRecordName(profileId) });
}
function listGitHubOAuthRecords() {
	return listHiddenGitHubSecretRecordNames({ prefix: "github-oauth" }).flatMap((name) => {
		const profileId = parseGitHubOAuthProfileId(name);
		if (!profileId) return [];
		return [{
			profileId,
			record: readGitHubOAuthRecord(profileId)
		}];
	});
}
//#endregion
//#region src/agents/github-tool-identity.ts
const GITHUB_HOST = "github.com";
const PROFILE_COMMAND_TIMEOUT_MS = 15e3;
const PROFILE_OUTPUT_LIMIT_BYTES = 32 * 1024;
const MANAGED_GITHUB_ROOT_SEGMENTS = ["credentials", "github"];
var GitHubAccountMismatchError = class extends Error {};
function createManagedGitHubProfileId() {
	return `ghp_${randomBytes(16).toString("hex")}`;
}
function resolveManagedGitHubProfileDir(params) {
	if (!isManagedGitHubProfileId(params.profileId)) throw new Error("Managed GitHub profile id is invalid.");
	const root = resolveManagedGitHubProfileRoot(params);
	return path.join(root, params.profileId);
}
function resolveManagedGitHubProfileRoot(params) {
	const root = path.join(resolveStateDir(params.env), ...MANAGED_GITHUB_ROOT_SEGMENTS);
	return params.scope === "agent" ? path.join(root, "agents", resolveManagedGitHubAgentKey(params.agentId)) : path.join(root, "system");
}
function resolveManagedGitHubAgentKey(agentId) {
	return createHash("sha256").update(normalizeAgentId(agentId), "utf8").digest("hex");
}
function resolveConfiguredGitHubToolIdentity(params) {
	return params.scope === "agent" ? resolveAgentConfig(params.config, params.agentId)?.tools?.github : params.config.tools?.github;
}
function resolveGitHubToolIdentity(params) {
	const agentOverride = resolveAgentConfig(params.config, params.agentId)?.tools?.github;
	const config = agentOverride ?? params.config.tools?.github;
	if (!config) return { source: "system-detected" };
	const source = agentOverride ? "agent-override" : "system-configured";
	return {
		source,
		config,
		profileDir: resolveManagedGitHubProfileDir({
			agentId: params.agentId,
			env: params.env,
			scope: source === "agent-override" ? "agent" : "system",
			profileId: config.profileId
		})
	};
}
function resolveScopedGitHubToolIdentity(params) {
	const config = resolveConfiguredGitHubToolIdentity(params);
	if (!config) return params.scope === "system" ? { source: "system-detected" } : void 0;
	return {
		source: params.scope === "system" ? "system-configured" : "agent-override",
		config,
		profileDir: resolveManagedGitHubProfileDir({
			agentId: params.agentId,
			env: params.env,
			scope: params.scope,
			profileId: config.profileId
		})
	};
}
function localIdentityEnvironmentForIdentity(identity) {
	if (identity.source === "system-detected") return {};
	const author = identity.config.gitAuthor;
	const gitConfigEntries = Object.entries({
		...author?.name ? { "user.name": author.name } : {},
		...author?.email ? { "user.email": author.email } : {}
	});
	const gitConfigEnv = Object.fromEntries(gitConfigEntries.flatMap(([key, value], index) => [[`GIT_CONFIG_KEY_${index}`, key], [`GIT_CONFIG_VALUE_${index}`, value]]));
	return {
		GH_CONFIG_DIR: identity.profileDir,
		...gitConfigEntries.length > 0 ? {
			GIT_CONFIG_COUNT: String(gitConfigEntries.length),
			...gitConfigEnv
		} : {},
		...author?.name ? {
			GIT_AUTHOR_NAME: author.name,
			GIT_COMMITTER_NAME: author.name
		} : {},
		...author?.email ? {
			GIT_AUTHOR_EMAIL: author.email,
			GIT_COMMITTER_EMAIL: author.email
		} : {}
	};
}
/** Prepares the non-secret child overlay and store exclusions once per agent run. */
function prepareGitHubToolEnvironment(params) {
	const identity = resolveGitHubToolIdentity(params);
	const managedLocalIdentity = identity.source !== "system-detected";
	const previewToken = params.sourceConfig?.gateway?.controlUi?.github?.token ?? params.config.gateway?.controlUi?.github?.token;
	const credentialScrubEnv = managedLocalIdentity ? {
		GH_TOKEN: "",
		GITHUB_TOKEN: ""
	} : {};
	const excludedStoreNames = [];
	if (isSecretRef(previewToken)) {
		if (previewToken.source === "env" && isValidEnvSecretRefId(previewToken.id)) credentialScrubEnv[previewToken.id] = "";
		else if (previewToken.source === "store") {
			credentialScrubEnv[previewToken.id] = "";
			excludedStoreNames.push(previewToken.id);
		}
	}
	return Object.freeze({
		credentialScrubEnv: Object.freeze(credentialScrubEnv),
		localIdentityEnv: Object.freeze({ ...localIdentityEnvironmentForIdentity(identity) }),
		excludedStoreNames: Object.freeze(excludedStoreNames),
		managedLocalIdentity
	});
}
async function runIdentityCommand(argv, env, input, cwd) {
	return await runCommandBuffered(argv, {
		env: env ? { ...env } : {},
		input,
		cwd,
		timeoutMs: PROFILE_COMMAND_TIMEOUT_MS,
		maxOutputBytes: PROFILE_OUTPUT_LIMIT_BYTES
	});
}
function parseAccount(stdout) {
	try {
		const value = JSON.parse(stdout.toString("utf8"));
		if (!isRecord(value)) return;
		const accountId = value.id;
		const login = readNonBlankString(value.login)?.trim();
		if (!Number.isSafeInteger(accountId) || Number(accountId) <= 0 || !login) return;
		return {
			accountId: Number(accountId),
			login,
			avatarUrl: readNonBlankString(value.avatarUrl)?.trim() ?? null
		};
	} catch {
		return;
	}
}
async function probeAccount(env) {
	const result = await runIdentityCommand([
		"gh",
		"api",
		"user",
		"--hostname",
		GITHUB_HOST,
		"--jq",
		"{id: .id, login: .login, avatarUrl: .avatar_url}"
	], env);
	return {
		result,
		account: result.code === 0 ? parseAccount(result.stdout) : void 0
	};
}
function isRateLimitedProbe(result) {
	if (result.code === 0) return false;
	const stderr = result.stderr.toString("utf8");
	return /\bHTTP 403\b/iu.test(stderr) && /(?:rate.?limit|abuse detection)/iu.test(stderr);
}
function isInvalidCredentialProbe(result) {
	if (result.code === 4) return true;
	const stderr = result.stderr.toString("utf8");
	return /\bHTTP 401\b|bad credentials|authentication required/iu.test(stderr);
}
async function readGitAuthor(env, cwd) {
	const result = await runIdentityCommand([
		"git",
		"config",
		"--null",
		"--get-regexp",
		"^user\\.(name|email)$"
	], env, void 0, cwd);
	const author = {
		name: null,
		email: null
	};
	if (result.code !== 0) return author;
	for (const entry of result.stdout.toString("utf8").split("\0")) {
		const separator = entry.indexOf("\n");
		if (separator < 0) continue;
		const key = entry.slice(0, separator);
		const value = readNonBlankString(entry.slice(separator + 1))?.trim() ?? null;
		if (key === "user.name") author.name = value;
		else if (key === "user.email") author.email = value;
	}
	return author;
}
async function isPrivateManagedGitHubProfile(profileDir) {
	try {
		const [profile, hosts] = await Promise.all([fs.lstat(profileDir), fs.lstat(path.join(profileDir, "hosts.yml"))]);
		if (!profile.isDirectory() || profile.isSymbolicLink() || !hosts.isFile() || hosts.isSymbolicLink()) return false;
		return process.platform === "win32" || (profile.mode & 63) === 0 && (hosts.mode & 63) === 0;
	} catch {
		return false;
	}
}
async function resolveGitHubToolIdentityStatus(params) {
	const effectiveIdentity = resolveGitHubToolIdentity(params);
	const selectedIdentity = resolveScopedGitHubToolIdentity({
		...params,
		scope: params.selectedScope
	});
	const effective = await resolveGitHubIdentityFacts({
		...params,
		identity: effectiveIdentity
	});
	const selectedMatchesEffective = selectedIdentity?.source === effectiveIdentity.source && (selectedIdentity?.source === "system-detected" || effectiveIdentity.source !== "system-detected" && selectedIdentity?.config.profileId === effectiveIdentity.config.profileId);
	const selected = !selectedIdentity ? null : selectedMatchesEffective ? effective : await resolveGitHubIdentityFacts({
		...params,
		identity: selectedIdentity
	});
	return {
		agentId: params.agentId,
		selectedScope: params.selectedScope,
		selected: {
			scope: params.selectedScope,
			configured: selectedIdentity?.source !== "system-detected" && selectedIdentity !== void 0,
			identity: selected
		},
		effective
	};
}
async function resolveGitHubIdentityFacts(params) {
	const identity = params.identity;
	const managed = identity.source !== "system-detected";
	const localIdentityEnv = localIdentityEnvironmentForIdentity(identity);
	const nativeEnv = params.env ?? {};
	const probeEnv = managed ? {
		...nativeEnv,
		GH_TOKEN: void 0,
		GITHUB_TOKEN: void 0,
		...localIdentityEnv
	} : nativeEnv;
	const profileAvailable = !managed || await isPrivateManagedGitHubProfile(identity.profileDir);
	const workspaceDir = resolveAgentWorkspaceDir(params.config, params.agentId);
	const [probe, author] = await Promise.all([profileAvailable ? probeAccount(probeEnv) : void 0, readGitAuthor(probeEnv, workspaceDir)]);
	const account = probe?.account ?? null;
	const credentialState = account ? "available" : probe && isRateLimitedProbe(probe.result) ? "rate_limited" : probe && isInvalidCredentialProbe(probe.result) ? managed ? "configured_unavailable" : "unavailable" : probe ? "unverified" : managed ? "configured_unavailable" : "unavailable";
	const oauth = managed && identity.config.kind === "oauth" ? inspectGitHubOAuthRecord(identity.config.profileId) : { state: "missing" };
	const oauthRecord = oauth.state === "valid" ? oauth.record : void 0;
	const refreshState = !managed || identity.config.kind !== "oauth" ? "not_applicable" : oauth.state !== "valid" ? "unavailable" : oauth.record.pendingRefresh ? "refreshing" : oauth.record.refreshFailure ?? (oauth.record.refreshExpiresAtMs <= Date.now() ? "expired" : "available");
	return {
		source: identity.source,
		credentialKind: !managed ? "native" : identity.config.kind === "oauth" ? "managed-oauth" : "managed-pat",
		credentialState,
		account: account ? { login: account.login } : null,
		gitAuthor: author,
		evidence: account ? "github-api" : probe && isRateLimitedProbe(probe.result) ? "rate-limited" : probe ? "unverified" : "none",
		accessExpiresAtMs: oauthRecord?.accessExpiresAtMs ?? null,
		refreshState,
		oauthScopes: [...oauthRecord?.scopes ?? []],
		repositoryGrants: "unknown"
	};
}
/** Confirms the current config still selects the prepared publication profile. */
function matchesPreparedGitHubPublicationIdentity(params) {
	const current = resolveGitHubToolIdentity(params);
	return current.source === params.identity.source && (current.source === "system-detected" || current.config.profileId === params.identity.profileId);
}
/** Resolves a Gateway-owned publication identity without exposing its child environment. */
async function prepareGitHubPublicationIdentity(params) {
	const identity = resolveGitHubToolIdentity(params);
	const managed = identity.source !== "system-detected";
	if (managed && !await isPrivateManagedGitHubProfile(identity.profileDir)) throw new Error("The configured GitHub identity profile is unavailable.");
	const hostEnv = params.env ?? process.env;
	const prepared = prepareGitHubToolEnvironment({
		config: params.config,
		sourceConfig: params.sourceConfig,
		agentId: params.agentId,
		env: hostEnv
	});
	const directScrubEnv = Object.fromEntries(Object.keys(prepared.credentialScrubEnv).map((name) => [name, void 0]));
	const env = {
		...hostEnv,
		...directScrubEnv,
		...prepared.localIdentityEnv,
		...managed ? {
			GH_TOKEN: void 0,
			GITHUB_TOKEN: void 0
		} : {},
		GH_PROMPT_DISABLED: "1"
	};
	const probe = await probeAccount(env);
	if (!probe.account) throw new Error("The effective GitHub identity could not be verified.");
	return Object.freeze({
		source: identity.source,
		...managed ? { profileId: identity.config.profileId } : {},
		account: probe.account,
		env
	});
}
async function removeManagedGitHubProfile(profileDir) {
	await fs.rm(profileDir, {
		recursive: true,
		force: true
	});
}
async function makePrivateTree(root) {
	await fs.chmod(root, 448);
	for (const entry of await fs.readdir(root, { withFileTypes: true })) {
		const child = path.join(root, entry.name);
		if (entry.isDirectory()) await makePrivateTree(child);
		else if (entry.isFile()) await fs.chmod(child, 384);
		else throw new Error("Managed GitHub profile contains an unsupported filesystem entry.");
	}
}
function normalizeManagedGitHubToken(token) {
	const normalized = token.trim();
	if (!normalized || /[\r\n]/u.test(normalized)) throw new Error("Managed GitHub credential must be one non-empty line.");
	return normalized;
}
async function stageManagedGitHubProfile(parent, token) {
	await fs.mkdir(parent, {
		recursive: true,
		mode: 448
	});
	await fs.chmod(parent, 448);
	const stagingRoot = await fs.mkdtemp(path.join(parent, ".github-profile.staging-"));
	const stagedProfile = path.join(stagingRoot, "profile");
	try {
		await fs.mkdir(stagedProfile, { mode: 448 });
		const stagedEnv = {
			GH_CONFIG_DIR: stagedProfile,
			GH_TOKEN: void 0,
			GITHUB_TOKEN: void 0
		};
		if ((await runIdentityCommand([
			"gh",
			"auth",
			"login",
			"--hostname",
			GITHUB_HOST,
			"--with-token",
			"--insecure-storage"
		], stagedEnv, `${normalizeManagedGitHubToken(token)}\n`)).code !== 0) throw new Error("GitHub CLI rejected the managed credential.");
		const verified = await probeAccount(stagedEnv);
		if (!verified.account) throw new Error("GitHub CLI could not verify the managed credential.");
		await makePrivateTree(stagedProfile);
		return {
			account: verified.account,
			stagedProfile,
			stagingRoot
		};
	} catch (error) {
		await fs.rm(stagingRoot, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
/** Verifies a rotated token, then atomically replaces credentials in one stable profile. */
async function refreshManagedGitHubProfile(params) {
	if (!await isPrivateManagedGitHubProfile(params.profileDir)) throw new Error("The configured GitHub identity profile is unavailable.");
	const staged = await stageManagedGitHubProfile(path.dirname(params.profileDir), params.token);
	const targetHosts = path.join(params.profileDir, "hosts.yml");
	const replacementHosts = path.join(params.profileDir, `.hosts.yml.refresh-${randomBytes(16).toString("hex")}`);
	try {
		if (staged.account.accountId !== params.expectedAccountId) throw new GitHubAccountMismatchError("GitHub OAuth refresh returned a different account.");
		const targetStat = await fs.lstat(targetHosts);
		if (!targetStat.isFile() || targetStat.isSymbolicLink()) throw new Error("The configured GitHub identity profile is unavailable.");
		await fs.copyFile(path.join(staged.stagedProfile, "hosts.yml"), replacementHosts);
		await fs.chmod(replacementHosts, 384);
		await fs.rename(replacementHosts, targetHosts);
		return staged.account;
	} finally {
		await fs.rm(replacementHosts, { force: true });
		await fs.rm(staged.stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
/** Publishes a new inactive profile and switches config without retiring in-use generations. */
async function installManagedGitHubProfile(params) {
	const staged = await stageManagedGitHubProfile(path.dirname(params.profileDir), params.token);
	let published = false;
	let committed = false;
	try {
		await fs.rename(staged.stagedProfile, params.profileDir);
		published = true;
		await params.commitConfig(staged.account);
		committed = true;
		return staged.account;
	} finally {
		if (published && !committed && !params.retainProfileOnCommitFailure) await fs.rm(params.profileDir, {
			recursive: true,
			force: true
		});
		await fs.rm(staged.stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { writeGitHubOAuthRecord as S, inspectGitHubOAuthRecord as _, prepareGitHubPublicationIdentity as a, readGitHubDeviceAuthorizationRecord as b, removeManagedGitHubProfile as c, resolveManagedGitHubAgentKey as d, resolveManagedGitHubProfileDir as f, deleteGitHubOAuthRecord as g, deleteGitHubDeviceAuthorizationRecord as h, matchesPreparedGitHubPublicationIdentity as i, resolveConfiguredGitHubToolIdentity as l, createGitHubOAuthRecord as m, createManagedGitHubProfileId as n, prepareGitHubToolEnvironment as o, resolveManagedGitHubProfileRoot as p, installManagedGitHubProfile as r, refreshManagedGitHubProfile as s, GitHubAccountMismatchError as t, resolveGitHubToolIdentityStatus as u, listGitHubDeviceAuthorizationRecords as v, writeGitHubDeviceAuthorizationRecord as x, listGitHubOAuthRecords as y };
