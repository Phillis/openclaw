import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { a as resolveOsHomeRelativePath } from "./home-dir-DcrXWQPU.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { F as OPENAI_CODEX_DEFAULT_PROFILE_ID, I as authProfilesLog, M as MINIMAX_CLI_PROFILE_ID, S as shouldBootstrapFromExternalCliCredential, T as isSafeToCopyOAuthIdentity, _ as areOAuthCredentialsEquivalent, j as EXTERNAL_CLI_SYNC_TTL_MS, k as CLAUDE_CLI_PROFILE_ID, y as isSafeToAdoptBootstrapOAuthIdentity } from "./persisted-tYYP9V51.js";
import { r as hasUsableOAuthCredential } from "./credential-state-DRH6Q-Y3.js";
import { t as loadJsonFileThroughSymlink } from "./json-file-C59d_t6b.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
//#region src/agents/cli-credentials.claude-keychain.ts
const CLAUDE_CLI_KEYCHAIN_SERVICE = "Claude Code-credentials";
const CLAUDE_CLI_KEYCHAIN_TIMEOUT_MS = 2e3;
function readClaudeCliKeychainPayload(execSyncImpl = execSync, timeout = 5e3) {
	try {
		const result = execSyncImpl(`security find-generic-password -s "${CLAUDE_CLI_KEYCHAIN_SERVICE}" -w`, {
			encoding: "utf8",
			timeout,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
		const parsed = JSON.parse(result.trim());
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function hasClaudeCliKeychainItem(execSyncImpl = execSync) {
	try {
		execSyncImpl(`security find-generic-password -s "${CLAUDE_CLI_KEYCHAIN_SERVICE}"`, {
			encoding: "utf8",
			timeout: CLAUDE_CLI_KEYCHAIN_TIMEOUT_MS,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/agents/cli-credentials.ts
/**
* Reads and refreshes credentials stored by external CLI runtimes such as
* Claude Code, Codex, Gemini, and MiniMax.
*/
const log = createSubsystemLogger("agents/auth-profiles");
const CLAUDE_CLI_CREDENTIALS_RELATIVE_PATH = ".claude/.credentials.json";
const CLAUDE_CLI_USER_SETTINGS_RELATIVE_PATH = ".claude/settings.json";
const CODEX_CLI_AUTH_FILENAME = "auth.json";
const MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH = ".minimax/oauth_creds.json";
const GEMINI_CLI_CREDENTIALS_RELATIVE_PATH = ".gemini/oauth_creds.json";
const CODEX_CLI_FALLBACK_EXPIRY_MS = 3600 * 1e3;
let claudeCliCache = null;
let codexCliCache = null;
let minimaxCliCache = null;
let geminiCliCache = null;
/** Clears in-memory CLI credential caches for isolated tests. */
function resetCliCredentialCachesForTest() {
	claudeCliCache = null;
	codexCliCache = null;
	minimaxCliCache = null;
	geminiCliCache = null;
}
function resolveClaudeCliCredentialsPath(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
	return path.join(baseDir, CLAUDE_CLI_CREDENTIALS_RELATIVE_PATH);
}
function resolveClaudeCliUserSettingsPath(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
	return path.join(baseDir, CLAUDE_CLI_USER_SETTINGS_RELATIVE_PATH);
}
function parseClaudeCliOauthCredential(claudeOauth) {
	if (!claudeOauth || typeof claudeOauth !== "object") return null;
	const data = claudeOauth;
	const accessToken = data.accessToken;
	const refreshToken = data.refreshToken;
	const expiresAt = data.expiresAt;
	const subscriptionType = typeof data.subscriptionType === "string" && data.subscriptionType.trim() ? data.subscriptionType.trim() : void 0;
	const rateLimitTier = typeof data.rateLimitTier === "string" && data.rateLimitTier.trim() ? data.rateLimitTier.trim() : void 0;
	const planFields = {
		...subscriptionType ? { subscriptionType } : {},
		...rateLimitTier ? { rateLimitTier } : {}
	};
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt) || expiresAt <= 0) return null;
	if (typeof refreshToken === "string" && refreshToken) return {
		type: "oauth",
		provider: "anthropic",
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt,
		...planFields
	};
	return {
		type: "token",
		provider: "anthropic",
		token: accessToken,
		expires: expiresAt,
		...planFields
	};
}
function resolveCodexHomePath(codexHome) {
	const home = resolveOsHomeRelativePath((codexHome ?? process.env.CODEX_HOME) || "~/.codex");
	try {
		return fs.realpathSync.native(home);
	} catch {
		return home;
	}
}
function codexAuthJsonUsesChatGptTokens(data) {
	const authMode = typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0;
	if (authMode) return authMode === "chatgpt" || authMode === "chatgptauthtokens";
	return typeof data.OPENAI_API_KEY !== "string";
}
function codexAuthJsonUsesApiKey(data) {
	const authMode = typeof data.auth_mode === "string" ? data.auth_mode.toLowerCase() : void 0;
	if (authMode) return authMode === "apikey" || authMode === "api_key";
	return typeof data.OPENAI_API_KEY === "string";
}
function resolveMiniMaxCliCredentialsPath(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
	return path.join(baseDir, MINIMAX_CLI_CREDENTIALS_RELATIVE_PATH);
}
function resolveGeminiCliCredentialsPath(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
	return path.join(baseDir, GEMINI_CLI_CREDENTIALS_RELATIVE_PATH);
}
function readFileMtimeMs(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}
function readCachedCliCredential(options) {
	const { ttlMs, cache, cacheKey, read, setCache, readSourceFingerprint } = options;
	if (ttlMs <= 0) return read();
	const now = Date.now();
	const sourceFingerprint = readSourceFingerprint?.();
	if (cache && cache.cacheKey === cacheKey && cache.sourceFingerprint === sourceFingerprint && now - cache.readAt < ttlMs) return cache.value;
	const value = read();
	const cachedSourceFingerprint = readSourceFingerprint?.();
	if (!readSourceFingerprint || cachedSourceFingerprint === sourceFingerprint) setCache({
		value,
		readAt: now,
		cacheKey,
		sourceFingerprint: cachedSourceFingerprint
	});
	else setCache(null);
	return value;
}
function computeCodexKeychainAccount(codexHome) {
	return `cli|${createHash("sha256").update(codexHome).digest("hex").slice(0, 16)}`;
}
function resolveCodexKeychainParams(options) {
	return {
		platform: options?.platform ?? process.platform,
		execSyncImpl: options?.execSync ?? execSync,
		codexHome: resolveCodexHomePath(options?.codexHome)
	};
}
function decodeJwtExpiryMs(token) {
	const parts = token.split(".");
	if (parts.length < 2) return null;
	const encodedPayload = parts.at(1);
	if (!encodedPayload) return null;
	try {
		const payloadRaw = Buffer.from(encodedPayload, "base64url").toString("utf8");
		const payload = JSON.parse(payloadRaw);
		if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= 0) return null;
		return asDateTimestampMs(payload.exp * 1e3) ?? null;
	} catch {
		return null;
	}
}
function decodeJwtIdentityClaims(token) {
	const parts = token.split(".");
	if (parts.length < 2) return {};
	const encodedPayload = parts.at(1);
	if (!encodedPayload) return {};
	try {
		const payloadRaw = Buffer.from(encodedPayload, "base64url").toString("utf8");
		const payload = JSON.parse(payloadRaw);
		return {
			sub: typeof payload.sub === "string" && payload.sub ? payload.sub : void 0,
			email: typeof payload.email === "string" && payload.email ? payload.email : void 0
		};
	} catch {
		return {};
	}
}
function readCodexKeychainAuthRecord(options) {
	const { platform, execSyncImpl, codexHome } = resolveCodexKeychainParams(options);
	if (platform !== "darwin" || options?.allowKeychainPrompt === false) return null;
	const account = computeCodexKeychainAccount(codexHome);
	try {
		const secret = execSyncImpl(`security find-generic-password -s "Codex Auth" -a "${account}" -w`, {
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		}).trim();
		return JSON.parse(secret);
	} catch {
		return null;
	}
}
function resolveCodexFallbackExpiryMs(nowMs) {
	return resolveExpiresAtMsFromDurationMs(CODEX_CLI_FALLBACK_EXPIRY_MS, { nowMs: nowMs === void 0 ? void 0 : Math.floor(nowMs) });
}
function parseCodexOauthCredential(data, fallbackExpiry) {
	if (!codexAuthJsonUsesChatGptTokens(data)) return null;
	const tokens = data.tokens;
	const accessToken = tokens?.access_token;
	const refreshToken = tokens?.refresh_token;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	const expires = decodeJwtExpiryMs(accessToken) ?? fallbackExpiry;
	if (expires === void 0) return null;
	return {
		type: "oauth",
		provider: "openai",
		access: accessToken,
		refresh: refreshToken,
		expires,
		accountId: typeof tokens?.account_id === "string" ? tokens.account_id : void 0,
		idToken: typeof tokens?.id_token === "string" ? tokens.id_token : void 0
	};
}
function parseCodexApiKeyCredential(data) {
	if (!codexAuthJsonUsesApiKey(data)) return null;
	const key = typeof data.OPENAI_API_KEY === "string" ? data.OPENAI_API_KEY.trim() : "";
	return key ? {
		type: "api_key",
		provider: "openai",
		key
	} : null;
}
function readCliOauthTokenFields(data) {
	const accessToken = data.access_token;
	const refreshToken = data.refresh_token;
	const expiresAt = data.expiry_date;
	if (typeof accessToken !== "string" || !accessToken) return null;
	if (typeof refreshToken !== "string" || !refreshToken) return null;
	if (typeof expiresAt !== "number" || !Number.isFinite(expiresAt)) return null;
	return {
		access: accessToken,
		refresh: refreshToken,
		expires: expiresAt
	};
}
function readPortalCliOauthCredentials(credPath, provider) {
	const raw = loadJsonFileThroughSymlink(credPath);
	if (!raw || typeof raw !== "object") return null;
	const tokens = readCliOauthTokenFields(raw);
	return tokens ? {
		type: "oauth",
		provider,
		...tokens
	} : null;
}
function readMiniMaxCliCredentials(options) {
	return readPortalCliOauthCredentials(resolveMiniMaxCliCredentialsPath(options?.homeDir), "minimax-portal");
}
function readGeminiCliCredentials(options) {
	const raw = loadJsonFileThroughSymlink(resolveGeminiCliCredentialsPath(options?.homeDir));
	if (!raw || typeof raw !== "object") return null;
	const data = raw;
	const tokens = readCliOauthTokenFields(data);
	if (!tokens) return null;
	const idTokenRaw = data.id_token;
	const identity = typeof idTokenRaw === "string" && idTokenRaw ? decodeJwtIdentityClaims(idTokenRaw) : {};
	return {
		type: "oauth",
		provider: "google-gemini-cli",
		...tokens,
		...identity.email ? { email: identity.email } : {},
		...identity.sub ? { accountId: identity.sub } : {}
	};
}
function readClaudeCliUserApiKeyHelperCredential(homeDir) {
	const raw = loadJsonFileThroughSymlink(resolveClaudeCliUserSettingsPath(homeDir));
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
	const helper = raw.apiKeyHelper;
	return typeof helper === "string" && helper.trim().length > 0 ? {
		type: "api_key_helper",
		provider: "anthropic",
		helperHash: createHash("sha256").update(helper.trim()).digest("hex")
	} : null;
}
function readClaudeCliAccountEmail(homeDir) {
	const baseDir = resolveOsHomeRelativePath(homeDir ?? "~");
	const raw = loadJsonFileThroughSymlink(path.join(baseDir, ".claude.json"));
	if (!raw || typeof raw !== "object") return;
	const account = raw.oauthAccount;
	if (!account || typeof account !== "object") return;
	const email = account.emailAddress;
	return typeof email === "string" && email.trim() ? email.trim() : void 0;
}
function withClaudeAccountEmail(cliLogin, homeDir) {
	if (!cliLogin) return null;
	if (cliLogin.type === "api_key_helper") return cliLogin;
	const email = readClaudeCliAccountEmail(homeDir);
	return email ? {
		...cliLogin,
		email
	} : cliLogin;
}
/** Reads Claude CLI credentials in Claude Code's credential precedence order. */
function readClaudeCliCredentials(options) {
	const helperAuth = readClaudeCliUserApiKeyHelperCredential(options?.homeDir);
	if (helperAuth) return helperAuth;
	const platform = options?.platform ?? process.platform;
	if (platform === "darwin" && (options?.allowKeychainPrompt !== false || options?.tryKeychainWithoutPrompt === true)) {
		const keychainCreds = parseClaudeCliOauthCredential(readClaudeCliKeychainPayload(options?.execSync, options?.tryKeychainWithoutPrompt ? CLAUDE_CLI_KEYCHAIN_TIMEOUT_MS : void 0)?.claudeAiOauth);
		if (keychainCreds) {
			log.info("read anthropic credentials from claude cli keychain", { type: keychainCreds.type });
			return withClaudeAccountEmail(keychainCreds, options?.homeDir);
		}
	}
	const credPath = resolveClaudeCliCredentialsPath(options?.homeDir);
	const raw = loadJsonFileThroughSymlink(credPath);
	const fileCredential = raw && typeof raw === "object" ? withClaudeAccountEmail(parseClaudeCliOauthCredential(raw.claudeAiOauth), options?.homeDir) : null;
	if (fileCredential) return fileCredential;
	if (options?.tryKeychainWithoutPrompt && (fs.existsSync(credPath) || platform === "darwin" && hasClaudeCliKeychainItem(options.execSync))) options.onStoredCredentialUnreadable?.();
	return null;
}
/** @deprecated Anthropic provider-owned CLI credential helper; do not use from third-party plugins. */
function readClaudeCliCredentialsCached(options) {
	const platform = options?.platform ?? process.platform;
	const ttlMs = options?.ttlMs ?? 0;
	const credentialsPath = resolveClaudeCliCredentialsPath(options?.homeDir);
	const settingsPath = resolveClaudeCliUserSettingsPath(options?.homeDir);
	const keychainIntent = platform !== "darwin" ? "file" : options?.tryKeychainWithoutPrompt ? "keychain-bounded" : options?.allowKeychainPrompt !== false ? "keychain" : "file";
	return readCachedCliCredential({
		ttlMs,
		cache: claudeCliCache,
		cacheKey: `${credentialsPath}:${keychainIntent}`,
		read: () => readClaudeCliCredentials({
			allowKeychainPrompt: options?.allowKeychainPrompt,
			tryKeychainWithoutPrompt: options?.tryKeychainWithoutPrompt,
			onStoredCredentialUnreadable: options?.onStoredCredentialUnreadable,
			platform,
			homeDir: options?.homeDir,
			execSync: options?.execSync
		}),
		setCache: (next) => {
			claudeCliCache = next;
		},
		readSourceFingerprint: () => `${readFileMtimeMs(credentialsPath) ?? "missing"}:${readFileMtimeMs(settingsPath) ?? "missing"}`
	});
}
function formatCodexApiKeyForLoginStatus(key) {
	return key.length <= 13 ? "***" : `${key.slice(0, 8)}***${key.slice(-5)}`;
}
/** Reads an API key only when Codex confirms that exact credential is active. */
function readCodexCliActiveApiKey(options) {
	const { execSyncImpl, codexHome } = resolveCodexKeychainParams(options);
	let status;
	try {
		status = execSyncImpl("codex login status 2>&1", {
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: {
				...process.env,
				CODEX_HOME: codexHome
			}
		}).trim();
	} catch {
		return null;
	}
	const activeFingerprint = /^Logged in using an API key - (.+)$/mu.exec(status)?.[1]?.trim();
	const legacyApiKeyStatus = status.trim() === "Logged in using an API key";
	if (!activeFingerprint && !legacyApiKeyStatus) return null;
	const candidates = [];
	const raw = loadJsonFileThroughSymlink(path.join(codexHome, CODEX_CLI_AUTH_FILENAME));
	if (raw && typeof raw === "object") {
		const fileCredential = parseCodexApiKeyCredential(raw);
		if (fileCredential) candidates.push(fileCredential);
	}
	const keychainRecord = readCodexKeychainAuthRecord({
		codexHome,
		allowKeychainPrompt: options?.allowKeychainPrompt,
		platform: options?.platform,
		execSync: options?.execSync
	});
	if (keychainRecord) {
		const keychainCredential = parseCodexApiKeyCredential(keychainRecord);
		if (keychainCredential) candidates.push(keychainCredential);
	}
	const matchingKeys = new Set(candidates.filter((candidate) => legacyApiKeyStatus || formatCodexApiKeyForLoginStatus(candidate.key) === activeFingerprint).map((candidate) => candidate.key));
	if (matchingKeys.size !== 1) return null;
	const key = [...matchingKeys][0];
	return key ? {
		type: "api_key",
		provider: "openai",
		key
	} : null;
}
/** Reads Codex CLI OAuth credentials from Keychain or CODEX_HOME auth.json. */
function readCodexCliCredentials(options) {
	const keychainRecord = readCodexKeychainAuthRecord(options);
	if (keychainRecord) {
		const lastRefreshRaw = keychainRecord.last_refresh;
		const keychainCredential = parseCodexOauthCredential(keychainRecord, resolveCodexFallbackExpiryMs(typeof lastRefreshRaw === "string" || typeof lastRefreshRaw === "number" ? new Date(lastRefreshRaw).getTime() : Date.now()) ?? resolveCodexFallbackExpiryMs());
		if (keychainCredential) return keychainCredential;
	}
	const authPath = path.join(resolveCodexHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
	const raw = loadJsonFileThroughSymlink(authPath);
	if (!raw || typeof raw !== "object") return null;
	let fallbackExpiry;
	try {
		fallbackExpiry = resolveCodexFallbackExpiryMs(fs.statSync(authPath).mtimeMs);
	} catch {
		fallbackExpiry = resolveCodexFallbackExpiryMs();
	}
	return parseCodexOauthCredential(raw, fallbackExpiry);
}
/** Reads Codex CLI credentials with optional short-lived cache and file fingerprinting. */
function readCodexCliCredentialsCached(options) {
	const platform = options?.platform ?? process.platform;
	const ttlMs = options?.ttlMs ?? 0;
	const authPath = path.join(resolveCodexHomePath(options?.codexHome), CODEX_CLI_AUTH_FILENAME);
	const keychainIntent = platform === "darwin" && options?.allowKeychainPrompt !== false ? "keychain" : "file";
	return readCachedCliCredential({
		ttlMs,
		cache: codexCliCache,
		cacheKey: `${platform}|${authPath}:${keychainIntent}`,
		read: () => readCodexCliCredentials({
			codexHome: options?.codexHome,
			allowKeychainPrompt: options?.allowKeychainPrompt,
			platform: options?.platform,
			execSync: options?.execSync
		}),
		setCache: (next) => {
			codexCliCache = next;
		},
		readSourceFingerprint: () => readFileMtimeMs(authPath)
	});
}
/** Reads MiniMax CLI credentials with optional short-lived cache. */
function readMiniMaxCliCredentialsCached(options) {
	const credPath = resolveMiniMaxCliCredentialsPath(options?.homeDir);
	return readCachedCliCredential({
		ttlMs: options?.ttlMs ?? 0,
		cache: minimaxCliCache,
		cacheKey: credPath,
		read: () => readMiniMaxCliCredentials({ homeDir: options?.homeDir }),
		setCache: (next) => {
			minimaxCliCache = next;
		},
		readSourceFingerprint: () => readFileMtimeMs(credPath)
	});
}
/** Reads Gemini CLI credentials with optional short-lived cache. */
function readGeminiCliCredentialsCached(options) {
	const credPath = resolveGeminiCliCredentialsPath(options?.homeDir);
	return readCachedCliCredential({
		ttlMs: options?.ttlMs ?? 0,
		cache: geminiCliCache,
		cacheKey: credPath,
		read: () => readGeminiCliCredentials({ homeDir: options?.homeDir }),
		setCache: (next) => {
			geminiCliCache = next;
		},
		readSourceFingerprint: () => readFileMtimeMs(credPath)
	});
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cliCredentialsTestApi")] = {
	readCodexAuth: readCodexCliCredentials,
	resetCaches: resetCliCredentialCachesForTest
};
//#endregion
//#region src/agents/auth-profiles/external-cli-sync.ts
/**
* External CLI OAuth synchronization.
* Reads supported CLI credential stores, decides whether those credentials can
* safely bootstrap local auth profiles, and returns runtime/persisted overlays.
*/
/** Return true when imported CLI credentials match an existing profile identity. */
function isSafeToUseExternalCliCredential(existing, imported) {
	if (!existing) return true;
	if (existing.provider !== imported.provider) return false;
	return isSafeToCopyOAuthIdentity(existing, imported);
}
const EXTERNAL_CLI_SYNC_PROVIDERS = [
	{
		profileId: OPENAI_CODEX_DEFAULT_PROFILE_ID,
		profileAliases: ["openai:default"],
		provider: "openai",
		aliases: [
			"openai",
			"codex",
			"codex-cli",
			"codex-app-server"
		],
		readCredentials: (options) => readCodexCliCredentialsCached({
			ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
			allowKeychainPrompt: options?.allowKeychainPrompt
		}),
		bootstrapOnly: true
	},
	{
		profileId: CLAUDE_CLI_PROFILE_ID,
		provider: "claude-cli",
		readCredentials: (options) => {
			const credential = readClaudeCliCredentialsCached({
				ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
				allowKeychainPrompt: options?.allowKeychainPrompt
			});
			if (credential?.type !== "oauth") return null;
			return {
				...credential,
				provider: "claude-cli"
			};
		}
	},
	{
		profileId: MINIMAX_CLI_PROFILE_ID,
		provider: "minimax-portal",
		aliases: ["minimax", "minimax-cli"],
		readCredentials: () => readMiniMaxCliCredentialsCached({ ttlMs: EXTERNAL_CLI_SYNC_TTL_MS })
	}
];
function resolveExternalCliSyncProvider(params) {
	const provider = EXTERNAL_CLI_SYNC_PROVIDERS.find((entry) => externalCliProfileIdMatches(entry, params.profileId));
	if (!provider) return null;
	if (params.credential && !listExternalCliProviderIds(provider).includes(params.credential.provider)) return null;
	return provider;
}
function listExternalCliProfileIds(providerConfig) {
	return [providerConfig.profileId, ...providerConfig.profileAliases ?? []];
}
function listExternalCliProviderIds(providerConfig) {
	return [providerConfig.provider, ...providerConfig.aliases ?? []];
}
/** Provider ids whose external CLI credentials can be refreshed by this owner. */
function listExternalCliSyncProviderIds() {
	return [...new Set(EXTERNAL_CLI_SYNC_PROVIDERS.flatMap(listExternalCliProviderIds))];
}
function normalizeExternalCliCredentialProvider(credential, provider) {
	return credential ? {
		...credential,
		provider
	} : null;
}
function getAuthProfileProviderPrefix(profileId) {
	return profileId.split(":", 1)[0]?.trim() ?? "";
}
function externalCliProfileIdMatches(providerConfig, profileId, options) {
	if (listExternalCliProfileIds(providerConfig).includes(profileId)) return true;
	if (!options?.allowLegacyNamespace || providerConfig.profileId !== "openai:default") return false;
	return normalizeProviderId(getAuthProfileProviderPrefix(profileId)) === "openai";
}
function hasInlineOAuthTokenMaterial(credential) {
	return [
		credential.access,
		credential.refresh,
		credential.idToken
	].some((value) => typeof value === "string" && value.trim().length > 0);
}
function hasManagedProviderOAuth(store, providerConfig) {
	return Object.values(store.profiles).some((credential) => credential?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(credential.provider) && hasInlineOAuthTokenMaterial(credential));
}
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
function readExternalCliBootstrapCredential(params) {
	const provider = resolveExternalCliSyncProvider(params);
	if (!provider) return null;
	if (provider.bootstrapOnly && hasManagedProviderOAuth(params.store, provider)) return null;
	if (provider.bootstrapOnly && !params.allowInlineOAuthTokenMaterial && hasInlineOAuthTokenMaterial(params.credential)) return null;
	return normalizeExternalCliCredentialProvider(provider.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt }), params.credential.provider);
}
function normalizeProviderScope(values) {
	if (values === void 0) return;
	const out = /* @__PURE__ */ new Set();
	for (const value of values) {
		const raw = value.trim();
		if (!raw) continue;
		out.add(raw.toLowerCase());
		const normalized = normalizeProviderId(raw);
		if (normalized) out.add(normalized);
	}
	return out;
}
function isExternalCliProviderInScope(params) {
	const { providerConfig, options, store } = params;
	const providerScope = normalizeProviderScope(options?.providerIds);
	if (providerScope === void 0 && options?.profileIds === void 0) return Object.entries(store.profiles).some(([profileId, existing]) => {
		return externalCliProfileIdMatches(providerConfig, profileId) && existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider);
	});
	if (Array.from(options?.profileIds ?? []).some((profileId) => externalCliProfileIdMatches(providerConfig, profileId.trim(), { allowLegacyNamespace: true }))) return true;
	if (!providerScope || providerScope.size === 0) return false;
	return listExternalCliProviderIds(providerConfig).some((alias) => {
		const raw = alias.trim().toLowerCase();
		const normalized = normalizeProviderId(alias);
		return providerScope.has(raw) || (normalized ? providerScope.has(normalized) : false);
	});
}
/** True when a previously resolved built-in CLI profile belongs to this refresh scope. */
function isExternalCliAuthProfileInScope(params) {
	const credential = params.store.profiles[params.profileId];
	const providerConfig = resolveExternalCliSyncProvider({
		profileId: params.profileId,
		...credential?.type === "oauth" ? { credential } : {}
	});
	return providerConfig ? isExternalCliProviderInScope({
		providerConfig,
		store: params.store,
		options: {
			...params.providerIds ? { providerIds: params.providerIds } : {},
			...params.profileIds ? { profileIds: params.profileIds } : {}
		}
	}) : false;
}
function listScopedExternalCliProfileIds(params) {
	const { options, providerConfig, store } = params;
	if (providerConfig.bootstrapOnly && hasManagedProviderOAuth(store, providerConfig)) return [];
	const matchingRequestedProfileIds = Array.from(options?.profileIds ?? []).map((value) => value.trim()).filter((value) => value.length > 0).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId, { allowLegacyNamespace: true }));
	if (matchingRequestedProfileIds.length > 0) return matchingRequestedProfileIds;
	const existingProfileIds = Object.keys(store.profiles).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId));
	if (existingProfileIds.length > 0) return existingProfileIds;
	return options?.providerIds ? [providerConfig.profileId] : [];
}
function backfillExternalCliIdentity(params) {
	if (params.existingOAuth.email) return null;
	const creds = params.providerConfig.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt });
	return creds?.email && (creds.refresh === params.existingOAuth.refresh || creds.access === params.existingOAuth.access) ? {
		...params.existingOAuth,
		email: creds.email
	} : null;
}
/** Resolve scoped external CLI auth profiles available to overlay or persist. */
function resolveExternalCliAuthProfiles(store, options) {
	const profiles = [];
	const now = Date.now();
	for (const providerConfig of EXTERNAL_CLI_SYNC_PROVIDERS) {
		if (!isExternalCliProviderInScope({
			providerConfig,
			store,
			options
		})) continue;
		const scopedProfileIds = listScopedExternalCliProfileIds({
			providerConfig,
			store,
			options
		});
		for (const profileId of scopedProfileIds) {
			const existing = store.profiles[profileId];
			const existingOAuth = existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider) ? existing : void 0;
			if (existing && !existingOAuth) {
				authProfilesLog.debug("kept explicit local auth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localType: existing.type,
					localProvider: existing.provider
				});
				continue;
			}
			if (providerConfig.bootstrapOnly && existingOAuth && hasInlineOAuthTokenMaterial(existingOAuth)) {
				authProfilesLog.debug("kept local oauth over external cli bootstrap-only provider", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !providerConfig.bootstrapOnly && hasUsableOAuthCredential(existingOAuth, { now })) {
				const backfilled = backfillExternalCliIdentity({
					providerConfig,
					existingOAuth,
					allowKeychainPrompt: options?.allowKeychainPrompt
				});
				if (backfilled) profiles.push({
					profileId,
					credential: backfilled,
					persistence: "persisted"
				});
				continue;
			}
			const creds = normalizeExternalCliCredentialProvider(providerConfig.readCredentials({ allowKeychainPrompt: options?.allowKeychainPrompt }), existingOAuth?.provider ?? providerConfig.provider);
			if (!creds) continue;
			if (existingOAuth && !isSafeToUseExternalCliCredential(existingOAuth, creds)) {
				authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !isSafeToAdoptBootstrapOAuthIdentity(existingOAuth, creds) && !areOAuthCredentialsEquivalent(existingOAuth, creds)) {
				authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch or missing binding", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (!shouldBootstrapFromExternalCliCredential({
				existing: existingOAuth,
				imported: creds,
				now
			})) {
				if (existingOAuth) authProfilesLog.debug("kept usable local oauth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localExpires: existingOAuth.expires,
					externalExpires: creds.expires
				});
				continue;
			}
			authProfilesLog.debug("used external cli oauth bootstrap because local oauth was missing or unusable", {
				profileId,
				provider: providerConfig.provider,
				localExpires: existingOAuth?.expires,
				externalExpires: creds.expires
			});
			profiles.push({
				profileId,
				credential: creds,
				persistence: providerConfig.bootstrapOnly ? "runtime-only" : "persisted"
			});
		}
	}
	return profiles;
}
//#endregion
export { resolveExternalCliAuthProfiles as a, readCodexCliCredentialsCached as c, readExternalCliBootstrapCredential as i, readGeminiCliCredentialsCached as l, isSafeToUseExternalCliCredential as n, readClaudeCliCredentialsCached as o, listExternalCliSyncProviderIds as r, readCodexCliActiveApiKey as s, isExternalCliAuthProfileInScope as t };
