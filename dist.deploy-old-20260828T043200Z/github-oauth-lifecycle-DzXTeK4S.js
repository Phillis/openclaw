import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./agent-scope-DigoIwHb.js";
import { a as listAgentIds, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { f as readResponseWithLimit } from "./http-body-DthsuKdw.js";
import { i as captureAgentLifecycleBinding, s as matchesAgentLifecycleBinding } from "./agent-lifecycle-registry-D1dm9wFG.js";
import { S as writeGitHubOAuthRecord, _ as inspectGitHubOAuthRecord, b as readGitHubDeviceAuthorizationRecord, c as removeManagedGitHubProfile, f as resolveManagedGitHubProfileDir, g as deleteGitHubOAuthRecord, h as deleteGitHubDeviceAuthorizationRecord, l as resolveConfiguredGitHubToolIdentity, m as createGitHubOAuthRecord, n as createManagedGitHubProfileId, r as installManagedGitHubProfile, s as refreshManagedGitHubProfile, t as GitHubAccountMismatchError, u as resolveGitHubToolIdentityStatus, v as listGitHubDeviceAuthorizationRecords, x as writeGitHubDeviceAuthorizationRecord, y as listGitHubOAuthRecords } from "./github-tool-identity-C15aB8z0.js";
import { t as updateGitHubToolIdentityConfig } from "./github-tool-identity-config-DF9RWjfD.js";
import { randomBytes } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/github-oauth-client.ts
const GITHUB_OAUTH_CLIENT_ID = "Ov23liUjOXHi28w2fDlH";
const GITHUB_OAUTH_DEVICE_CODE_URL = "https://github.com/login/device/code";
const GITHUB_OAUTH_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_OAUTH_VERIFICATION_URL = "https://github.com/login/device";
const GITHUB_OAUTH_SCOPE = "repo workflow read:org gist offline_access";
const GITHUB_OAUTH_REQUEST_TIMEOUT_MS = 3e4;
const GITHUB_OAUTH_RESPONSE_MAX_BYTES = 16 * 1024;
const GITHUB_OAUTH_STRING_MAX_CHARS = 2 * 1024;
const GITHUB_OAUTH_SCOPE_MAX_CHARS = 4 * 1024;
const GITHUB_OAUTH_SCOPE_MAX_COUNT = 32;
const GITHUB_OAUTH_SCOPE_MAX_LENGTH = 64;
const GITHUB_OAUTH_ERROR_TEXT_MAX_CHARS = 2 * 1024;
const GITHUB_OAUTH_MAX_DURATION_SECONDS = 366 * 24 * 60 * 60;
const GITHUB_OAUTH_MAX_INTERVAL_SECONDS = 3600;
function githubOAuthProtocolError(surface) {
	return /* @__PURE__ */ new Error(`GitHub OAuth ${surface} response was invalid`);
}
function readBoundedString(value, surface, maxChars = GITHUB_OAUTH_STRING_MAX_CHARS) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxChars || value.trim() !== value) throw githubOAuthProtocolError(surface);
	return value;
}
function readOptionalBoundedString(value, surface, maxChars) {
	if (value === void 0) return;
	return readBoundedString(value, surface, maxChars);
}
function readPositiveInteger(value, surface, max) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0 || value > max) throw githubOAuthProtocolError(surface);
	return value;
}
function readOptionalErrorUri(value, surface) {
	const raw = readOptionalBoundedString(value, surface, GITHUB_OAUTH_ERROR_TEXT_MAX_CHARS);
	if (raw === void 0) return;
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw githubOAuthProtocolError(surface);
	}
	if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw githubOAuthProtocolError(surface);
	return raw;
}
function normalizeGitHubScopes(value, surface) {
	if (typeof value !== "string" || value.length > GITHUB_OAUTH_SCOPE_MAX_CHARS) throw githubOAuthProtocolError(surface);
	const scopes = value.split(/[\s,]+/u).filter(Boolean).map((scope) => {
		if (scope.length > GITHUB_OAUTH_SCOPE_MAX_LENGTH || !/^[a-z0-9:_-]+$/u.test(scope)) throw githubOAuthProtocolError(surface);
		return scope;
	});
	const normalized = [...new Set(scopes)].toSorted();
	if (normalized.length > GITHUB_OAUTH_SCOPE_MAX_COUNT) throw githubOAuthProtocolError(surface);
	return normalized;
}
function parseGitHubOAuthTokenPair(record, surface) {
	if (record.token_type !== "bearer") throw githubOAuthProtocolError(surface);
	const scopes = normalizeGitHubScopes(record.scope, surface);
	if (!scopes.includes("repo") || !scopes.includes("workflow") || !scopes.includes("read:org") || !scopes.includes("gist")) throw githubOAuthProtocolError(surface);
	return {
		accessToken: readBoundedString(record.access_token, surface),
		tokenType: "bearer",
		scopes,
		expiresInSeconds: readPositiveInteger(record.expires_in, surface, GITHUB_OAUTH_MAX_DURATION_SECONDS),
		refreshToken: readBoundedString(record.refresh_token, surface),
		refreshTokenExpiresInSeconds: readPositiveInteger(record.refresh_token_expires_in, surface, GITHUB_OAUTH_MAX_DURATION_SECONDS)
	};
}
const GITHUB_OAUTH_ERROR_CODES = /* @__PURE__ */ new Set([
	"authorization_pending",
	"slow_down",
	"expired_token",
	"unsupported_grant_type",
	"incorrect_client_credentials",
	"incorrect_device_code",
	"bad_verification_code",
	"access_denied",
	"device_flow_disabled",
	"unverified_user_email",
	"bad_refresh_token"
]);
function isGitHubOAuthErrorCode(value) {
	return typeof value === "string" && GITHUB_OAUTH_ERROR_CODES.has(value);
}
function parseGitHubOAuthError(record, surface) {
	const code = record.error;
	if (!isGitHubOAuthErrorCode(code)) throw githubOAuthProtocolError(surface);
	const intervalSeconds = record.interval === void 0 ? void 0 : readPositiveInteger(record.interval, surface, GITHUB_OAUTH_MAX_INTERVAL_SECONDS);
	const errorDescription = readOptionalBoundedString(record.error_description, surface, GITHUB_OAUTH_ERROR_TEXT_MAX_CHARS);
	const errorUri = readOptionalErrorUri(record.error_uri, surface);
	return {
		code,
		...errorDescription !== void 0 ? { errorDescription } : {},
		...errorUri !== void 0 ? { errorUri } : {},
		...intervalSeconds !== void 0 ? { intervalSeconds } : {}
	};
}
function parseJsonObject(bytes, surface) {
	let parsed;
	try {
		parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
	} catch {
		throw githubOAuthProtocolError(surface);
	}
	const record = asOptionalRecord(parsed);
	if (!record) throw githubOAuthProtocolError(surface);
	return record;
}
async function postGitHubOAuthForm(url, form, surface, options) {
	const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, GITHUB_OAUTH_REQUEST_TIMEOUT_MS, 1);
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;
	const response = await fetch(url, {
		method: "POST",
		redirect: "error",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: form,
		signal
	});
	return {
		response,
		body: parseJsonObject(await readResponseWithLimit(response, GITHUB_OAUTH_RESPONSE_MAX_BYTES, {
			chunkTimeoutMs: timeoutMs,
			timeoutMs,
			onOverflow: () => githubOAuthProtocolError(surface),
			onIdleTimeout: () => githubOAuthProtocolError(surface),
			onTimeout: () => githubOAuthProtocolError(surface)
		}), surface)
	};
}
function throwGitHubOAuthHttpError(response, surface) {
	throw new Error(`GitHub OAuth ${surface} request failed (HTTP ${response.status})`);
}
async function requestGitHubOAuthDeviceCode(options = {}) {
	const { response, body } = await postGitHubOAuthForm(GITHUB_OAUTH_DEVICE_CODE_URL, new URLSearchParams({
		client_id: GITHUB_OAUTH_CLIENT_ID,
		scope: GITHUB_OAUTH_SCOPE
	}), "device authorization", options);
	if (!response.ok) throwGitHubOAuthHttpError(response, "device authorization");
	const deviceCode = readBoundedString(body.device_code, "device authorization");
	const userCode = readBoundedString(body.user_code, "device authorization", 64);
	if (!/^[A-Za-z0-9_-]{40}$/u.test(deviceCode) || !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/u.test(userCode)) throw githubOAuthProtocolError("device authorization");
	if (body.verification_uri !== GITHUB_OAUTH_VERIFICATION_URL) throw githubOAuthProtocolError("device authorization");
	return {
		deviceCode,
		userCode,
		verificationUri: GITHUB_OAUTH_VERIFICATION_URL,
		expiresInSeconds: readPositiveInteger(body.expires_in, "device authorization", GITHUB_OAUTH_MAX_DURATION_SECONDS),
		intervalSeconds: readPositiveInteger(body.interval, "device authorization", GITHUB_OAUTH_MAX_INTERVAL_SECONDS)
	};
}
async function pollGitHubOAuthDeviceToken(params) {
	const deviceCode = readBoundedString(params.deviceCode, "device token");
	if (!/^[A-Za-z0-9_-]{40}$/u.test(deviceCode)) throw githubOAuthProtocolError("device token");
	const { response, body } = await postGitHubOAuthForm(GITHUB_OAUTH_ACCESS_TOKEN_URL, new URLSearchParams({
		client_id: GITHUB_OAUTH_CLIENT_ID,
		device_code: deviceCode,
		grant_type: "urn:ietf:params:oauth:grant-type:device_code"
	}), "device token", params);
	if (body.error !== void 0 && body.access_token !== void 0) throw githubOAuthProtocolError("device token");
	if (body.error !== void 0) {
		const { code, intervalSeconds, ...details } = parseGitHubOAuthError(body, "device token");
		switch (code) {
			case "authorization_pending": return {
				status: code,
				...details
			};
			case "slow_down": return {
				status: code,
				...details,
				...intervalSeconds !== void 0 ? { intervalSeconds } : {}
			};
			case "expired_token":
			case "access_denied": return {
				status: code,
				...details
			};
			default: return {
				status: "error",
				code,
				...details
			};
		}
	}
	if (!response.ok) throwGitHubOAuthHttpError(response, "device token");
	return {
		status: "authorized",
		tokens: parseGitHubOAuthTokenPair(body, "device token")
	};
}
async function refreshGitHubOAuthToken(params) {
	const refreshToken = readBoundedString(params.refreshToken, "token refresh");
	const { response, body } = await postGitHubOAuthForm(GITHUB_OAUTH_ACCESS_TOKEN_URL, new URLSearchParams({
		client_id: GITHUB_OAUTH_CLIENT_ID,
		grant_type: "refresh_token",
		refresh_token: refreshToken
	}), "token refresh", params);
	if (body.error !== void 0 && body.access_token !== void 0) throw githubOAuthProtocolError("token refresh");
	if (body.error !== void 0) {
		const { code, errorDescription, errorUri } = parseGitHubOAuthError(body, "token refresh");
		return {
			status: "error",
			code,
			...errorDescription !== void 0 ? { errorDescription } : {},
			...errorUri !== void 0 ? { errorUri } : {}
		};
	}
	if (!response.ok) throwGitHubOAuthHttpError(response, "token refresh");
	return {
		status: "refreshed",
		tokens: parseGitHubOAuthTokenPair(body, "token refresh")
	};
}
const MAINTENANCE_INTERVAL_MS = 6e4;
const SHUTDOWN_DRAIN_TIMEOUT_MS = 31e3;
const defaultGitAuthor = (account) => ({
	name: account.login,
	email: `${account.accountId}+${account.login}@users.noreply.github.com`
});
function identityStillSelected(config, location, expected) {
	return isDeepStrictEqual(resolveConfiguredGitHubToolIdentity({
		config,
		...location
	}) ?? null, expected);
}
function authorizationStillOwned(config, record) {
	return identityStillSelected(config, record, record.expectedIdentity) && (record.scope === "system" || record.agentLifecycleBinding !== void 0 && matchesAgentLifecycleBinding(config, record.agentLifecycleBinding));
}
function configuredOAuthIdentities(config) {
	const identities = [];
	const system = config.tools?.github;
	if (system?.kind === "oauth") identities.push({
		scope: "system",
		agentId: "system",
		identity: {
			...system,
			kind: "oauth"
		}
	});
	for (const agentId of listAgentIds(config).toSorted()) {
		const identity = resolveAgentConfig(config, agentId)?.tools?.github;
		if (identity?.kind === "oauth") identities.push({
			scope: "agent",
			agentId,
			identity: {
				...identity,
				kind: "oauth"
			}
		});
	}
	return identities;
}
function currentIdentityForRecord(config, record) {
	return resolveConfiguredGitHubToolIdentity({
		config,
		...record
	});
}
//#endregion
//#region src/gateway/github-oauth-lifecycle.ts
let activeLifecycle;
function installActiveGitHubOAuthLifecycle(lifecycle) {
	activeLifecycle = lifecycle;
	return () => {
		if (activeLifecycle === lifecycle) activeLifecycle = void 0;
	};
}
async function requestCurrentGitHubOAuthRefresh(agentId) {
	await activeLifecycle?.refreshEffectiveIdentity(agentId);
}
function createGitHubOAuthLifecycle(params) {
	const deviceController = new AbortController();
	const devicePolls = /* @__PURE__ */ new Map();
	const committingRequests = /* @__PURE__ */ new Set();
	const refreshes = /* @__PURE__ */ new Map();
	const pendingRefreshes = /* @__PURE__ */ new Map();
	const pendingCleanup = /* @__PURE__ */ new Set();
	let maintenance;
	let interval;
	let stopping = false;
	const queueDeviceCleanup = (requestId) => {
		try {
			deleteGitHubDeviceAuthorizationRecord(requestId);
			pendingCleanup.delete(requestId);
		} catch {
			pendingCleanup.add(requestId);
		}
	};
	const queueOAuthCleanup = (profileId) => {
		try {
			deleteGitHubOAuthRecord(profileId);
		} catch {}
	};
	const status = (agentId, selectedScope) => resolveGitHubToolIdentityStatus({
		config: params.getConfig(),
		agentId,
		selectedScope
	});
	const installDeviceTokens = async (record, tokens) => {
		const current = params.getConfig();
		if (!authorizationStillOwned(current, record)) {
			queueDeviceCleanup(record.requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const profileId = createManagedGitHubProfileId();
		const profileDir = resolveManagedGitHubProfileDir({
			agentId: record.agentId,
			scope: record.scope,
			profileId
		});
		let nextConfig = current;
		let metadataWritten = false;
		try {
			await installManagedGitHubProfile({
				profileDir,
				token: tokens.accessToken,
				retainProfileOnCommitFailure: true,
				commitConfig: async (account) => {
					const pending = readGitHubDeviceAuthorizationRecord(record.requestId);
					if (!pending || pending.createdAtMs !== record.createdAtMs || pending.deviceCode !== record.deviceCode || !isDeepStrictEqual(pending.expectedIdentity, record.expectedIdentity) || !authorizationStillOwned(params.getConfig(), record)) throw new Error("GitHub authorization is no longer pending.");
					committingRequests.add(record.requestId);
					const pendingInitial = {
						requestId: record.requestId,
						scope: record.scope,
						agentId: record.agentId,
						expectedIdentity: record.expectedIdentity,
						...record.agentLifecycleBinding ? { agentLifecycleBinding: record.agentLifecycleBinding } : {}
					};
					writeGitHubOAuthRecord(createGitHubOAuthRecord({
						profileId,
						scope: record.scope,
						agentId: record.agentId,
						account,
						tokens,
						now: Date.now(),
						pendingInitial
					}));
					metadataWritten = true;
					const identity = {
						profileId,
						kind: "oauth",
						gitAuthor: record.expectedIdentity?.gitAuthor ? structuredClone(record.expectedIdentity.gitAuthor) : defaultGitAuthor(account)
					};
					nextConfig = await updateGitHubToolIdentityConfig({
						scope: record.scope,
						agentId: record.agentId,
						identity,
						expectedIdentity: record.expectedIdentity,
						...record.agentLifecycleBinding ? { agentLifecycleBinding: record.agentLifecycleBinding } : {}
					});
					const inspected = inspectGitHubOAuthRecord(profileId);
					if (inspected.state !== "valid" || !inspected.record.pendingInitial) throw new Error("GitHub OAuth initial record is unavailable.");
					writeGitHubOAuthRecord({
						...inspected.record,
						pendingInitial: void 0
					});
				}
			});
		} catch {
			if (metadataWritten) try {
				const persistedConfig = params.getPersistedConfig?.();
				if (!persistedConfig) throw new Error("Authoritative persisted config is unavailable.");
				const persistedIdentity = resolveConfiguredGitHubToolIdentity({
					config: persistedConfig,
					scope: record.scope,
					agentId: record.agentId
				});
				if (persistedIdentity?.profileId === profileId && persistedIdentity.kind === "oauth") {
					const inspected = inspectGitHubOAuthRecord(profileId);
					if (inspected.state === "valid" && inspected.record.pendingInitial) writeGitHubOAuthRecord({
						...inspected.record,
						pendingInitial: void 0
					});
					queueDeviceCleanup(record.requestId);
					if (record.expectedIdentity?.kind === "oauth") queueOAuthCleanup(record.expectedIdentity.profileId);
					return {
						status: "success",
						githubStatus: await resolveGitHubToolIdentityStatus({
							config: persistedConfig,
							agentId: record.agentId,
							selectedScope: record.scope
						})
					};
				}
			} catch {
				queueDeviceCleanup(record.requestId);
				return {
					status: "failed",
					reason: "setup_failed"
				};
			}
			if (metadataWritten) queueOAuthCleanup(profileId);
			await removeManagedGitHubProfile(profileDir).catch(() => void 0);
			queueDeviceCleanup(record.requestId);
			return {
				status: "failed",
				reason: "setup_failed"
			};
		} finally {
			committingRequests.delete(record.requestId);
		}
		queueDeviceCleanup(record.requestId);
		if (record.expectedIdentity?.kind === "oauth") queueOAuthCleanup(record.expectedIdentity.profileId);
		return {
			status: "success",
			githubStatus: await resolveGitHubToolIdentityStatus({
				config: nextConfig,
				agentId: record.agentId,
				selectedScope: record.scope
			})
		};
	};
	const pollOnce = async (requestId) => {
		const record = readGitHubDeviceAuthorizationRecord(requestId);
		const now = Date.now();
		if (!record || record.expiresAtMs <= now) {
			queueDeviceCleanup(requestId);
			return { status: "expired" };
		}
		if (!authorizationStillOwned(params.getConfig(), record)) {
			queueDeviceCleanup(requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		if (now < record.nextPollAtMs) return {
			status: "pending",
			retryAfterMs: record.nextPollAtMs - now
		};
		let result;
		try {
			result = await pollGitHubOAuthDeviceToken({
				deviceCode: record.deviceCode,
				signal: deviceController.signal
			});
		} catch {
			const currentRecord = readGitHubDeviceAuthorizationRecord(requestId);
			if (!currentRecord) return { status: "expired" };
			const retryAtMs = Math.min(currentRecord.expiresAtMs, now + currentRecord.pollIntervalMs);
			writeGitHubDeviceAuthorizationRecord({
				...currentRecord,
				nextPollAtMs: retryAtMs
			});
			return {
				status: "network_error",
				retryAfterMs: Math.max(1, retryAtMs - now)
			};
		}
		const currentRecord = readGitHubDeviceAuthorizationRecord(requestId);
		if (!currentRecord) return { status: "expired" };
		if (currentRecord.deviceCode !== record.deviceCode || currentRecord.createdAtMs !== record.createdAtMs || !isDeepStrictEqual(currentRecord.expectedIdentity, record.expectedIdentity)) {
			queueDeviceCleanup(requestId);
			return {
				status: "failed",
				reason: "identity_changed"
			};
		}
		const activeRecord = currentRecord;
		if (result.status === "authorized") return await installDeviceTokens(activeRecord, result.tokens);
		if (result.status === "authorization_pending" || result.status === "slow_down") {
			const pollIntervalMs = result.status === "slow_down" ? Math.min(60 * 1e3, Math.max(activeRecord.pollIntervalMs + 5e3, (result.intervalSeconds ?? 0) * 1e3)) : activeRecord.pollIntervalMs;
			const nextPollAtMs = Math.min(activeRecord.expiresAtMs, now + pollIntervalMs);
			writeGitHubDeviceAuthorizationRecord({
				...activeRecord,
				pollIntervalMs,
				nextPollAtMs
			});
			return {
				status: result.status === "slow_down" ? "slow_down" : "pending",
				retryAfterMs: Math.max(1, nextPollAtMs - now)
			};
		}
		queueDeviceCleanup(requestId);
		if (result.status === "access_denied") return { status: "access_denied" };
		if (result.status === "expired_token") return { status: "expired" };
		if (result.code === "incorrect_device_code" || result.code === "bad_verification_code") return { status: "incorrect_device_code" };
		return {
			status: "failed",
			reason: "setup_failed"
		};
	};
	const applyPendingRefresh = async (record, accessToken) => {
		const profileDir = resolveManagedGitHubProfileDir({
			agentId: record.agentId,
			scope: record.scope,
			profileId: record.profileId
		});
		let account;
		try {
			account = await refreshManagedGitHubProfile({
				profileDir,
				token: accessToken,
				expectedAccountId: record.accountId
			});
		} catch (error) {
			if (error instanceof GitHubAccountMismatchError) writeGitHubOAuthRecord({
				...record,
				pendingRefresh: void 0,
				refreshFailure: "expired"
			});
			return;
		}
		writeGitHubOAuthRecord({
			...record,
			login: account.login,
			pendingRefresh: void 0,
			refreshFailure: void 0
		});
	};
	const refreshOne = async (configured) => {
		const profileId = configured.identity.profileId;
		const inspected = inspectGitHubOAuthRecord(profileId);
		if (inspected.state !== "valid") return;
		const currentRecord = inspected.record;
		if (currentRecord.pendingInitial) return;
		const now = Date.now();
		if (currentRecord.refreshFailure === "expired" || currentRecord.refreshExpiresAtMs <= now) return;
		if (!currentRecord.pendingRefresh && currentRecord.accessExpiresAtMs > now + 6e5) return;
		const currentIdentity = currentIdentityForRecord(params.getConfig(), currentRecord);
		if (currentIdentity?.kind !== "oauth" || currentIdentity.profileId !== profileId) return;
		let refreshed;
		try {
			refreshed = await refreshGitHubOAuthToken({ refreshToken: currentRecord.refreshToken });
		} catch {
			if (!currentRecord.pendingRefresh) writeGitHubOAuthRecord({
				...currentRecord,
				refreshFailure: "failed"
			});
			return;
		}
		if (refreshed.status === "error") {
			const refreshFailure = refreshed.code === "bad_refresh_token" ? "expired" : "failed";
			writeGitHubOAuthRecord({
				...currentRecord,
				pendingRefresh: void 0,
				refreshFailure
			});
			return;
		}
		const rotatedRecord = {
			...currentRecord,
			refreshToken: refreshed.tokens.refreshToken,
			accessExpiresAtMs: now + refreshed.tokens.expiresInSeconds * 1e3,
			refreshExpiresAtMs: now + refreshed.tokens.refreshTokenExpiresInSeconds * 1e3,
			scopes: refreshed.tokens.scopes,
			pendingRefresh: true,
			pendingInitial: void 0,
			refreshFailure: void 0
		};
		pendingRefreshes.set(profileId, {
			record: rotatedRecord,
			accessToken: refreshed.tokens.accessToken
		});
		try {
			writeGitHubOAuthRecord(rotatedRecord);
		} catch {
			return;
		}
		pendingRefreshes.delete(profileId);
		await applyPendingRefresh(rotatedRecord, refreshed.tokens.accessToken);
	};
	const requestRefresh = (configured) => {
		const refreshKey = configured.identity.profileId;
		const existing = refreshes.get(refreshKey);
		if (existing) return existing;
		const operation = refreshOne(configured).catch((error) => {
			params.warn(`GitHub OAuth refresh failed; will retry: ${formatErrorMessage(error)}`);
		}).finally(() => {
			if (refreshes.get(refreshKey) === operation) refreshes.delete(refreshKey);
		});
		refreshes.set(refreshKey, operation);
		return operation;
	};
	const reconcileRecords = async () => {
		for (const { requestId, record } of listGitHubDeviceAuthorizationRecords()) if (!record || record.expiresAtMs <= Date.now()) queueDeviceCleanup(requestId);
		for (const { profileId, record } of listGitHubOAuthRecords()) {
			if (!record) {
				queueOAuthCleanup(profileId);
				continue;
			}
			if (record.pendingInitial) {
				if (committingRequests.has(record.pendingInitial.requestId)) continue;
				let persistedConfig;
				try {
					const persisted = params.getPersistedConfig?.();
					if (!persisted) continue;
					persistedConfig = persisted;
				} catch {
					continue;
				}
				const persistedIdentity = currentIdentityForRecord(persistedConfig, record);
				if ((record.scope === "system" || record.pendingInitial.agentLifecycleBinding !== void 0 && matchesAgentLifecycleBinding(persistedConfig, record.pendingInitial.agentLifecycleBinding)) && persistedIdentity?.profileId === profileId && persistedIdentity.kind === "oauth") {
					writeGitHubOAuthRecord({
						...record,
						pendingInitial: void 0
					});
					if (record.pendingInitial.expectedIdentity?.kind === "oauth") queueOAuthCleanup(record.pendingInitial.expectedIdentity.profileId);
					continue;
				}
				queueOAuthCleanup(profileId);
				await removeManagedGitHubProfile(resolveManagedGitHubProfileDir({
					agentId: record.agentId,
					scope: record.scope,
					profileId
				})).catch(() => void 0);
				continue;
			}
			const current = currentIdentityForRecord(params.getConfig(), record);
			if (current?.profileId !== profileId || current.kind !== "oauth") {
				queueOAuthCleanup(profileId);
				continue;
			}
			if (record.pendingRefresh && !stopping) await requestRefresh({
				scope: record.scope,
				agentId: record.agentId,
				identity: {
					...current,
					kind: "oauth"
				}
			});
		}
	};
	const runMaintenance = async () => {
		for (const requestId of pendingCleanup) queueDeviceCleanup(requestId);
		for (const [profileId, pending] of [...pendingRefreshes].toSorted(([left], [right]) => left.localeCompare(right))) try {
			writeGitHubOAuthRecord(pending.record);
			pendingRefreshes.delete(profileId);
			await applyPendingRefresh(pending.record, pending.accessToken);
		} catch {}
		await reconcileRecords();
		for (const configured of configuredOAuthIdentities(params.getConfig())) {
			if (stopping) break;
			await requestRefresh(configured);
		}
	};
	const maintain = () => {
		if (stopping && !maintenance) return Promise.resolve();
		if (maintenance) return maintenance;
		maintenance = runMaintenance().catch((error) => {
			params.warn(`GitHub OAuth maintenance failed; will retry: ${formatErrorMessage(error)}`);
		}).finally(() => {
			maintenance = void 0;
		});
		return maintenance;
	};
	return {
		startAuthorization: async (input) => {
			if (stopping) throw new Error("GitHub authorization lifecycle is stopping.");
			const expectedIdentity = structuredClone(resolveConfiguredGitHubToolIdentity({
				config: params.getConfig(),
				...input
			}) ?? null);
			const agentLifecycleBinding = input.scope === "agent" ? captureAgentLifecycleBinding(params.getConfig(), input.agentId) : void 0;
			if (input.scope === "agent" && !agentLifecycleBinding) throw new Error("GitHub authorization requires an active agent.");
			const authorization = await requestGitHubOAuthDeviceCode({ signal: deviceController.signal });
			if (!identityStillSelected(params.getConfig(), input, expectedIdentity) || agentLifecycleBinding !== void 0 && !matchesAgentLifecycleBinding(params.getConfig(), agentLifecycleBinding)) throw new Error("GitHub identity changed while authorization was starting.");
			if (authorization.expiresInSeconds > 900 || authorization.intervalSeconds > 60) throw new Error("GitHub device authorization timing is outside the supported bounds.");
			for (const existing of listGitHubDeviceAuthorizationRecords()) if (existing.record?.scope === input.scope && existing.record.agentId === input.agentId) queueDeviceCleanup(existing.requestId);
			const requestId = `github-device-${randomBytes(16).toString("hex")}`;
			const createdAtMs = Date.now();
			const expiresAtMs = createdAtMs + authorization.expiresInSeconds * 1e3;
			const pollIntervalMs = authorization.intervalSeconds * 1e3;
			const nextPollAtMs = createdAtMs + pollIntervalMs;
			writeGitHubDeviceAuthorizationRecord({
				version: 1,
				requestId,
				deviceCode: authorization.deviceCode,
				userCode: authorization.userCode,
				verificationUri: authorization.verificationUri,
				createdAtMs,
				expiresAtMs,
				pollIntervalMs,
				nextPollAtMs,
				agentId: input.agentId,
				scope: input.scope,
				expectedIdentity,
				...agentLifecycleBinding ? { agentLifecycleBinding } : {}
			});
			return {
				requestId,
				userCode: authorization.userCode,
				verificationUri: authorization.verificationUri,
				expiresInMs: authorization.expiresInSeconds * 1e3,
				pollAfterMs: pollIntervalMs
			};
		},
		pollAuthorization: (requestId) => {
			const existing = devicePolls.get(requestId);
			if (existing) return existing;
			const operation = pollOnce(requestId).finally(() => {
				if (devicePolls.get(requestId) === operation) devicePolls.delete(requestId);
			});
			devicePolls.set(requestId, operation);
			return operation;
		},
		cancelAuthorization: (requestId) => {
			if (committingRequests.has(requestId)) return false;
			const existed = readGitHubDeviceAuthorizationRecord(requestId) !== void 0;
			queueDeviceCleanup(requestId);
			return existed;
		},
		status,
		retireProfile: (profileId) => queueOAuthCleanup(profileId),
		refreshEffectiveIdentity: async (agentId) => {
			if (stopping) return;
			const config = params.getConfig();
			const agent = resolveAgentConfig(config, agentId)?.tools?.github;
			const identity = agent ?? config.tools?.github;
			if (identity?.kind !== "oauth") return;
			await requestRefresh({
				scope: agent ? "agent" : "system",
				agentId,
				identity: {
					...identity,
					kind: "oauth"
				}
			});
		},
		maintain,
		start: () => {
			if (stopping) return;
			maintain();
			interval ??= setInterval(() => void maintain(), MAINTENANCE_INTERVAL_MS);
			interval.unref?.();
		},
		stop: async () => {
			stopping = true;
			if (interval) {
				clearInterval(interval);
				interval = void 0;
			}
			deviceController.abort();
			const drain = (async () => {
				await Promise.allSettled([
					...maintenance ? [maintenance] : [],
					...devicePolls.values(),
					...refreshes.values()
				]);
				if (pendingRefreshes.size > 0) await runMaintenance();
			})();
			let timeout;
			try {
				await Promise.race([drain, new Promise((resolve) => {
					timeout = setTimeout(resolve, SHUTDOWN_DRAIN_TIMEOUT_MS);
					timeout.unref?.();
				})]);
			} finally {
				if (timeout) clearTimeout(timeout);
			}
		}
	};
}
//#endregion
export { installActiveGitHubOAuthLifecycle as n, requestCurrentGitHubOAuthRefresh as r, createGitHubOAuthLifecycle as t };
