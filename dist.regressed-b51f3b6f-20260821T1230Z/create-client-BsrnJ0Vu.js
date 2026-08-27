import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { N as resolveOptionalIntegerOption } from "./number-coercion-oCkfUEEq.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { m as normalizeResolvedSecretInputString, s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./retry-runtime-ELyDVNAC.js";
import { i as isPrivateNetworkOptInEnabled, s as ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "./ssrf-policy-DykNyVe7.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-D7ikroCS.js";
import "./secret-input-runtime-BLGhNtWu.js";
import { a as resolveMatrixDefaultOrOnlyAccountId, n as requiresExplicitMatrixDefaultAccount, o as resolveMatrixAccountStringValues } from "./account-selection-BNXF4bJK.js";
import { t as getMatrixScopedEnvVarNames } from "./env-vars-B5wpK6d0.js";
import { o as resolveMatrixBaseConfig, r as listNormalizedMatrixAccountIds, t as findMatrixAccountConfig } from "./account-config-B_H9560K.js";
import { i as resolveScopedMatrixEnvConfig, n as resolveGlobalMatrixEnvConfig } from "./env-auth-B2ZAokPF.js";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-B0GLR7RK.js";
import { t as resolveValidatedMatrixHomeserverUrl } from "./url-validation-C2MpdjIb.js";
import { d as writeStorageMeta, l as resolveMatrixStoragePaths, r as maybeMigrateLegacyStorage, s as repairCurrentTokenStorageMetaDeviceId } from "./storage-CYRD9STi.js";
import fs from "node:fs";
//#region extensions/matrix/src/matrix/client/config.ts
const loadMatrixAuthClientDeps = createLazyRuntimeModule(() => Promise.all([import("./sdk-DbzCN5i8.js"), import("./logging-BZAJcOfo.js")]).then(([sdkModule, loggingModule]) => ({
	MatrixClient: sdkModule.MatrixClient,
	ensureMatrixSdkLoggingConfigured: loggingModule.ensureMatrixSdkLoggingConfigured
})));
const MATRIX_AUTH_REQUEST_RETRY_RE = /\b(fetch failed|econnreset|econnrefused|enotfound|etimedout|ehostunreach|enetunreach|eai_again|und_err_|socket hang up|network|headers timeout|body timeout|connect timeout)\b/i;
const loadMatrixCredentialsReadDeps = createLazyRuntimeModule(() => import("./credentials-read-DafRfxMi.js"));
const loadMatrixCredentialsWriteRuntime = createLazyRuntimeModule(() => import("./credentials-write.runtime.js"));
const loadMatrixSecretInputDeps = createLazyRuntimeModule(() => import("./config-secret-input.runtime.js"));
function shouldRetryMatrixAuthRequest(err) {
	return MATRIX_AUTH_REQUEST_RETRY_RE.test(formatErrorMessage(err));
}
function isAbortSignalTriggered(signal) {
	return signal?.aborted === true;
}
function credentialsMatchBackfillAuthLineage(params) {
	if (!params.stored) return true;
	return params.stored.homeserver === params.auth.homeserver && params.stored.userId === params.auth.userId && params.stored.accessToken === params.auth.accessToken;
}
async function retryMatrixAuthRequest(label, run, signal) {
	return await retryAsync(run, {
		attempts: 3,
		minDelayMs: 250,
		maxDelayMs: 1500,
		jitter: .1,
		label,
		shouldRetry: (err) => shouldRetryMatrixAuthRequest(err),
		sleep: (ms) => sleepWithAbort(ms, signal)
	});
}
async function fetchMatrixWhoamiIdentity(params) {
	const { MatrixClient, ensureMatrixSdkLoggingConfigured } = await loadMatrixAuthClientDeps();
	ensureMatrixSdkLoggingConfigured();
	const tempClient = new MatrixClient(params.homeserver, params.accessToken, {
		userId: params.userId,
		ssrfPolicy: params.ssrfPolicy,
		dispatcherPolicy: params.dispatcherPolicy
	});
	return await retryMatrixAuthRequest("matrix auth whoami", async () => await tempClient.doRequest("GET", "/_matrix/client/v3/account/whoami"), params.signal);
}
const MATRIX_CONFIG_STRING_FIELDS = [
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName"
];
const MATRIX_AUTH_SECRET_FIELDS = ["accessToken", "password"];
function readMatrixEnvSecretRef(params) {
	const provider = params.cfg.secrets?.providers?.[params.ref.provider];
	if (provider) {
		if (provider.source !== "env") throw new Error(`Secret provider "${params.ref.provider}" has source "${provider.source}" but ref requests "env".`);
		if (provider.allowlist && !provider.allowlist.includes(params.ref.id)) throw new Error(`Environment variable "${params.ref.id}" is not allowlisted in secrets.providers.${params.ref.provider}.allowlist.`);
	} else if (params.ref.provider !== (params.cfg.secrets?.defaults?.env?.trim() || "default")) throw new Error(`Secret provider "${params.ref.provider}" is not configured (ref: env:${params.ref.provider}:${params.ref.id}).`);
	return params.env[params.ref.id]?.trim() || void 0;
}
function readMatrixConfigString(params) {
	const ref = coerceSecretRef(params.value, params.cfg.secrets?.defaults);
	if (params.suppressSecretRef && ref) return "";
	return normalizeResolvedSecretInputString({
		value: params.allowEnvSecretRef ? ref?.source === "env" ? readMatrixEnvSecretRef({
			ref,
			cfg: params.cfg,
			env: params.env
		}) ?? params.value : ref ? "" : params.value : params.value,
		path: params.path,
		defaults: params.cfg.secrets?.defaults
	}) ?? "";
}
function resolveMatrixBaseConfigFieldPath(field) {
	return `channels.matrix.${field}`;
}
function hasConfiguredMatrixSecret(value, cfg) {
	return typeof value === "string" && value.trim().length > 0 || Boolean(coerceSecretRef(value, cfg.secrets?.defaults));
}
async function resolveConfiguredMatrixAuthSecretInput(params) {
	const configured = params.configured;
	if (!configured) return;
	if (!coerceSecretRef(configured.value, params.cfg.secrets?.defaults)) return normalizeResolvedSecretInputString({
		value: configured.value,
		path: configured.path,
		defaults: params.cfg.secrets?.defaults
	});
	const { resolveConfiguredSecretInputString } = await loadMatrixSecretInputDeps();
	const resolved = await resolveConfiguredSecretInputString({
		config: params.cfg,
		env: params.env,
		value: configured.value,
		path: configured.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.value !== void 0) return resolved.value;
	throw new Error(resolved.unresolvedRefReason ?? `${configured.path} SecretRef could not be resolved.`);
}
function clampMatrixInitialSyncLimit(value) {
	return resolveOptionalIntegerOption(value, { min: 0 });
}
function buildMatrixNetworkFields(params) {
	const dispatcherPolicy = params.dispatcherPolicy ?? (params.proxy ? {
		mode: "explicit-proxy",
		proxyUrl: params.proxy
	} : void 0);
	if (!params.allowPrivateNetwork && !dispatcherPolicy) return {};
	return {
		...params.allowPrivateNetwork ? {
			allowPrivateNetwork: true,
			ssrfPolicy: ssrfPolicyFromDangerouslyAllowPrivateNetwork(true)
		} : {},
		...dispatcherPolicy ? { dispatcherPolicy } : {}
	};
}
function buildResolvedMatrixAuth(resolved, auth) {
	return {
		...auth,
		deviceName: resolved.deviceName,
		initialSyncLimit: resolved.initialSyncLimit,
		encryption: resolved.encryption,
		...buildMatrixNetworkFields({
			allowPrivateNetwork: resolved.allowPrivateNetwork,
			dispatcherPolicy: resolved.dispatcherPolicy
		})
	};
}
function hasScopedMatrixEnvConfig(accountId, env) {
	const scoped = resolveScopedMatrixEnvConfig(accountId, env);
	return Boolean(scoped.homeserver || scoped.userId || scoped.accessToken || scoped.password || scoped.deviceId || scoped.deviceName);
}
function readMatrixConfigStrings(params) {
	return Object.fromEntries(MATRIX_CONFIG_STRING_FIELDS.map((field) => [field, readMatrixConfigString({
		value: params.values[field],
		path: params.path(field),
		cfg: params.cfg,
		env: params.env,
		allowEnvSecretRef: MATRIX_AUTH_SECRET_FIELDS.includes(field),
		suppressSecretRef: field === "password" && params.suppressPasswordSecretRef
	})]));
}
function resolveMatrixAccountConfigSnapshot(cfg, accountId, env) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const matrix = resolveMatrixBaseConfig(cfg);
	const account = findMatrixAccountConfig(cfg, normalizedAccountId) ?? {};
	const scopedKeys = getMatrixScopedEnvVarNames(normalizedAccountId);
	const scopedEnv = resolveScopedMatrixEnvConfig(normalizedAccountId, env);
	const globalEnv = resolveGlobalMatrixEnvConfig(env);
	const authCandidates = (field) => [
		{
			value: account[field],
			path: resolveMatrixConfigFieldPath(cfg, accountId, field)
		},
		{
			value: scopedEnv[field],
			path: scopedKeys[field]
		},
		...normalizedAccountId === "default" ? [{
			value: matrix[field],
			path: resolveMatrixBaseConfigFieldPath(field)
		}, {
			value: globalEnv[field],
			path: field === "accessToken" ? "MATRIX_ACCESS_TOKEN" : "MATRIX_PASSWORD"
		}] : []
	];
	const accessTokenCandidates = authCandidates("accessToken");
	const passwordCandidates = authCandidates("password");
	const suppressPasswordSecretRef = accessTokenCandidates.some((source) => hasConfiguredMatrixSecret(source.value, cfg));
	const resolvedStrings = resolveMatrixAccountStringValues({
		accountId: normalizedAccountId,
		account: readMatrixConfigStrings({
			cfg,
			env,
			values: account,
			path: (field) => resolveMatrixConfigFieldPath(cfg, normalizedAccountId, field),
			suppressPasswordSecretRef
		}),
		scopedEnv,
		channel: readMatrixConfigStrings({
			cfg,
			env,
			values: matrix,
			path: resolveMatrixBaseConfigFieldPath,
			suppressPasswordSecretRef
		}),
		globalEnv
	});
	const accountInitialSyncLimit = clampMatrixInitialSyncLimit(account.initialSyncLimit);
	const allowPrivateNetwork = isPrivateNetworkOptInEnabled(account) || isPrivateNetworkOptInEnabled(matrix) ? true : void 0;
	return {
		resolved: {
			homeserver: resolvedStrings.homeserver,
			userId: resolvedStrings.userId,
			accessToken: resolvedStrings.accessToken || void 0,
			password: resolvedStrings.password || void 0,
			deviceId: resolvedStrings.deviceId || void 0,
			deviceName: resolvedStrings.deviceName || void 0,
			initialSyncLimit: accountInitialSyncLimit ?? clampMatrixInitialSyncLimit(matrix.initialSyncLimit),
			encryption: typeof account.encryption === "boolean" ? account.encryption : matrix.encryption ?? false,
			...buildMatrixNetworkFields({
				allowPrivateNetwork,
				proxy: account.proxy ?? matrix.proxy
			})
		},
		authInputs: {
			accessToken: accessTokenCandidates.find((source) => source.value !== void 0),
			password: passwordCandidates.find((source) => source.value !== void 0)
		}
	};
}
function resolveImplicitMatrixAccountId(cfg, env = process.env) {
	if (requiresExplicitMatrixDefaultAccount(cfg, env)) return null;
	return normalizeAccountId(resolveMatrixDefaultOrOnlyAccountId(cfg, env));
}
function resolveMatrixAuthState(params) {
	const cfg = requireRuntimeConfig(params.cfg, "Matrix auth context");
	const env = params?.env ?? process.env;
	const requestedAccountId = params?.accountId?.trim();
	const explicitAccountId = normalizeOptionalAccountId(params?.accountId);
	if (requestedAccountId && !explicitAccountId) throw new Error(`Matrix account id "${requestedAccountId}" is invalid.`);
	const effectiveAccountId = explicitAccountId ?? resolveImplicitMatrixAccountId(cfg, env);
	if (!effectiveAccountId) throw new Error("Multiple Matrix accounts are configured and channels.matrix.defaultAccount is not set. Set \"channels.matrix.defaultAccount\" to the intended account or pass --account <id>.");
	if (explicitAccountId && explicitAccountId !== "default" && !listNormalizedMatrixAccountIds(cfg).includes(explicitAccountId) && !hasScopedMatrixEnvConfig(explicitAccountId, env)) throw new Error(`Matrix account "${explicitAccountId}" is not configured. Add channels.matrix.accounts.${explicitAccountId} or define scoped ${getMatrixScopedEnvVarNames(explicitAccountId).accessToken.replace(/_ACCESS_TOKEN$/, "")}_* variables.`);
	const matrix = resolveMatrixBaseConfig(cfg);
	const account = findMatrixAccountConfig(cfg, effectiveAccountId);
	if (matrix.enabled === false || account?.enabled === false) throw new Error(`Matrix account "${effectiveAccountId}" is disabled.`);
	const snapshot = resolveMatrixAccountConfigSnapshot(cfg, effectiveAccountId, env);
	return {
		context: {
			cfg,
			env,
			accountId: effectiveAccountId,
			resolved: snapshot.resolved
		},
		authInputs: snapshot.authInputs
	};
}
function resolveMatrixAuthContext(params) {
	return resolveMatrixAuthState(params).context;
}
async function resolveMatrixAuth(params) {
	if (!params?.cfg) throw new Error("Matrix auth requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const { context, authInputs } = resolveMatrixAuthState({
		cfg: params.cfg,
		env: params.env,
		accountId: params.accountId
	});
	const { cfg, env, accountId, resolved } = context;
	const accessToken = await resolveConfiguredMatrixAuthSecretInput({
		cfg,
		env,
		configured: authInputs.accessToken
	}) ?? resolved.accessToken;
	const tokenAuthPassword = resolved.password;
	const homeserver = await resolveValidatedMatrixHomeserverUrl(resolved.homeserver, { dangerouslyAllowPrivateNetwork: resolved.allowPrivateNetwork });
	const { loadMatrixCredentials, credentialsMatchConfig } = await loadMatrixCredentialsReadDeps();
	const cached = loadMatrixCredentials(env, accountId);
	const cachedCredentials = cached && credentialsMatchConfig(cached, {
		homeserver,
		userId: resolved.userId || "",
		accessToken
	}) ? cached : null;
	if (accessToken) {
		let userId = resolved.userId;
		const hasMatchingCachedToken = cachedCredentials?.accessToken === accessToken;
		let knownDeviceId = hasMatchingCachedToken ? cachedCredentials?.deviceId || resolved.deviceId : resolved.deviceId;
		if (!userId) {
			const whoami = await fetchMatrixWhoamiIdentity({
				homeserver,
				accessToken,
				userId,
				ssrfPolicy: resolved.ssrfPolicy,
				dispatcherPolicy: resolved.dispatcherPolicy
			});
			const fetchedUserId = whoami.user_id?.trim();
			if (!fetchedUserId) throw new Error("Matrix whoami did not return user_id");
			userId = fetchedUserId;
			knownDeviceId = knownDeviceId || whoami.device_id?.trim() || resolved.deviceId;
		}
		if (!cachedCredentials || !hasMatchingCachedToken || cachedCredentials.userId !== userId || (cachedCredentials.deviceId || void 0) !== knownDeviceId) {
			const { saveMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
			await saveMatrixCredentials({
				homeserver,
				userId,
				accessToken,
				deviceId: knownDeviceId
			}, env, accountId);
		} else if (hasMatchingCachedToken) {
			const { touchMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
			await touchMatrixCredentials(env, accountId);
		}
		return buildResolvedMatrixAuth(resolved, {
			accountId,
			homeserver,
			userId,
			accessToken,
			password: tokenAuthPassword,
			deviceId: knownDeviceId
		});
	}
	if (cachedCredentials) {
		const { touchMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
		await touchMatrixCredentials(env, accountId);
		return buildResolvedMatrixAuth(resolved, {
			accountId,
			homeserver: cachedCredentials.homeserver,
			userId: cachedCredentials.userId,
			accessToken: cachedCredentials.accessToken,
			password: tokenAuthPassword,
			deviceId: cachedCredentials.deviceId || resolved.deviceId
		});
	}
	if (!resolved.userId) throw new Error("Matrix userId is required when no access token is configured (matrix.userId)");
	const password = await resolveConfiguredMatrixAuthSecretInput({
		cfg,
		env,
		configured: authInputs.password
	}) ?? resolved.password;
	if (!password) throw new Error("Matrix password is required when no access token is configured (matrix.password)");
	const { MatrixClient, ensureMatrixSdkLoggingConfigured } = await loadMatrixAuthClientDeps();
	ensureMatrixSdkLoggingConfigured();
	const loginClient = new MatrixClient(homeserver, "", {
		ssrfPolicy: resolved.ssrfPolicy,
		dispatcherPolicy: resolved.dispatcherPolicy
	});
	const login = await retryMatrixAuthRequest("matrix auth login", async () => await loginClient.doRequest("POST", "/_matrix/client/v3/login", void 0, {
		type: "m.login.password",
		identifier: {
			type: "m.id.user",
			user: resolved.userId
		},
		password,
		device_id: resolved.deviceId,
		initial_device_display_name: resolved.deviceName ?? "OpenClaw Gateway"
	}));
	const loginAccessToken = login.access_token?.trim();
	if (!loginAccessToken) throw new Error("Matrix login did not return an access token");
	const auth = buildResolvedMatrixAuth(resolved, {
		accountId,
		homeserver,
		userId: login.user_id ?? resolved.userId,
		accessToken: loginAccessToken,
		password,
		deviceId: login.device_id ?? resolved.deviceId
	});
	const { saveMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
	await saveMatrixCredentials({
		homeserver: auth.homeserver,
		userId: auth.userId,
		accessToken: auth.accessToken,
		deviceId: auth.deviceId
	}, env, accountId);
	return auth;
}
async function backfillMatrixAuthDeviceIdAfterStartup(params) {
	const knownDeviceId = params.auth.deviceId?.trim();
	if (knownDeviceId) return knownDeviceId;
	if (isAbortSignalTriggered(params.abortSignal)) return;
	let whoami;
	try {
		whoami = await fetchMatrixWhoamiIdentity({
			homeserver: params.auth.homeserver,
			accessToken: params.auth.accessToken,
			userId: params.auth.userId,
			ssrfPolicy: params.auth.ssrfPolicy,
			dispatcherPolicy: params.auth.dispatcherPolicy,
			signal: params.abortSignal
		});
	} catch (err) {
		if (isAbortSignalTriggered(params.abortSignal)) return;
		throw err;
	}
	const deviceId = whoami.device_id?.trim();
	if (!deviceId) return;
	if (isAbortSignalTriggered(params.abortSignal)) return;
	const env = params.env ?? process.env;
	const { loadMatrixCredentials } = await loadMatrixCredentialsReadDeps();
	if (!credentialsMatchBackfillAuthLineage({
		stored: loadMatrixCredentials(env, params.auth.accountId),
		auth: params.auth
	})) return;
	if (!repairCurrentTokenStorageMetaDeviceId({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		accountId: params.auth.accountId,
		deviceId,
		env: params.env
	})) throw new Error("Matrix deviceId backfill failed to repair current-token storage metadata");
	if (isAbortSignalTriggered(params.abortSignal)) return;
	return await (await loadMatrixCredentialsWriteRuntime()).saveBackfilledMatrixDeviceId({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		deviceId
	}, env, params.auth.accountId) === "saved" ? deviceId : void 0;
}
//#endregion
//#region extensions/matrix/src/matrix/client/create-client.ts
const loadMatrixCreateClientRuntimeDeps = createLazyRuntimeModule(() => Promise.all([import("./sdk-DbzCN5i8.js"), import("./logging-BZAJcOfo.js")]).then(([sdkModule, loggingModule]) => ({
	MatrixClient: sdkModule.MatrixClient,
	ensureMatrixSdkLoggingConfigured: loggingModule.ensureMatrixSdkLoggingConfigured
})));
async function createMatrixClient(params) {
	const { MatrixClient, ensureMatrixSdkLoggingConfigured } = await loadMatrixCreateClientRuntimeDeps();
	ensureMatrixSdkLoggingConfigured();
	const homeserver = await resolveValidatedMatrixHomeserverUrl(params.homeserver, { dangerouslyAllowPrivateNetwork: params.allowPrivateNetwork });
	const matrixClientUserId = normalizeOptionalString(params.userId);
	const userId = matrixClientUserId ?? "unknown";
	const storagePaths = params.persistStorage !== false ? resolveMatrixStoragePaths({
		homeserver,
		userId,
		accessToken: params.accessToken,
		accountId: params.accountId,
		deviceId: params.deviceId,
		env: process.env
	}) : null;
	if (storagePaths) {
		await maybeMigrateLegacyStorage({
			storagePaths,
			env: process.env
		});
		fs.mkdirSync(storagePaths.rootDir, { recursive: true });
		writeStorageMeta({
			storagePaths,
			homeserver,
			userId,
			accountId: params.accountId,
			deviceId: params.deviceId
		});
	}
	const cryptoDatabasePrefix = storagePaths ? `openclaw-matrix-${storagePaths.accountKey}-${storagePaths.tokenHash}` : void 0;
	return new MatrixClient(homeserver, params.accessToken, {
		userId: matrixClientUserId,
		password: params.password,
		deviceId: params.deviceId,
		encryption: params.encryption,
		localTimeoutMs: params.localTimeoutMs,
		initialSyncLimit: params.initialSyncLimit,
		storageRootDir: storagePaths?.rootDir,
		recoveryKeyPath: storagePaths?.recoveryKeyPath,
		idbSnapshotPath: storagePaths?.idbSnapshotPath,
		cryptoDatabasePrefix,
		autoBootstrapCrypto: params.autoBootstrapCrypto,
		ssrfPolicy: params.ssrfPolicy ?? ssrfPolicyFromDangerouslyAllowPrivateNetwork(params.allowPrivateNetwork),
		dispatcherPolicy: params.dispatcherPolicy
	});
}
//#endregion
export { resolveMatrixAuthContext as i, backfillMatrixAuthDeviceIdAfterStartup as n, resolveMatrixAuth as r, createMatrixClient as t };
