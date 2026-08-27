import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { Nn as record, Rn as string, Zn as unknown } from "./schemas-CZ9Toj_c.js";
import { d as isSecretRef, s as coerceSecretRef, y as resolveSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { n as safeParseWithSchema, t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
import { t as resolveAccountEntry } from "./account-lookup-gtl3eJfy.js";
import { t as createAccountListHelpers } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cz1V4EjA.js";
import "./secret-file-runtime-DD5yEM8Q.js";
import "./secret-input-Dv7SE4A5.js";
import "./text-utility-runtime-LRU688AB.js";
import "./extension-shared-BCgJMXly.js";
import { i as mergePairLoopGuardConfig } from "./pair-loop-guard-runtime-qcafZ164.js";
import "./account-resolution-Cb-rHsSW.js";
//#region extensions/googlechat/src/google-auth-limits.ts
const MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES = 64 * 1024;
//#endregion
//#region extensions/googlechat/src/accounts.ts
const ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
const ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
const JsonRecordSchema = record(string(), unknown());
const { listAccountIds: listGoogleChatAccountIds, resolveDefaultAccountId: resolveDefaultGoogleChatAccountId, resolveAccountConfig: resolveMergedGoogleChatAccountConfig } = createAccountListHelpers("googlechat", {
	implicitDefaultAccount: {
		channelKeys: ["serviceAccount", "serviceAccountFile"],
		envVars: [ENV_SERVICE_ACCOUNT, ENV_SERVICE_ACCOUNT_FILE]
	},
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["botLoopProtection"]
});
function mergeGoogleChatAccountConfig(cfg, accountId) {
	const raw = cfg.channels?.["googlechat"] ?? {};
	const base = resolveMergedGoogleChatAccountConfig(cfg, accountId);
	const defaultAccountConfig = resolveAccountEntry(raw.accounts, "default") ?? {};
	if (accountId === "default") return base;
	const { enabled: _ignoredEnabled, dangerouslyAllowNameMatching: _ignoredDangerouslyAllowNameMatching, serviceAccount: _ignoredServiceAccount, serviceAccountFile: _ignoredServiceAccountFile, ...defaultAccountShared } = defaultAccountConfig;
	const botLoopProtection = mergePairLoopGuardConfig(defaultAccountShared.botLoopProtection, base.botLoopProtection);
	return {
		...defaultAccountShared,
		...base,
		...botLoopProtection ? { botLoopProtection } : {}
	};
}
function resolveGoogleChatConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? params.cfg.channels?.googlechat?.defaultAccount);
	return { config: mergeGoogleChatAccountConfig(params.cfg, accountId) };
}
function parseServiceAccount(value) {
	if (isSecretRef(value)) return null;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;
		return safeParseJsonWithSchema(JsonRecordSchema, trimmed);
	}
	return safeParseWithSchema(JsonRecordSchema, value);
}
function resolveCredentialsFromConfig(params) {
	const { account, accountId } = params;
	const inline = parseServiceAccount(account.serviceAccount);
	if (inline) return {
		credentials: inline,
		source: "inline",
		status: "available"
	};
	if (coerceSecretRef(account.serviceAccount, params.cfg.secrets?.defaults)) return resolveSecretInputString({
		value: account.serviceAccount,
		defaults: params.cfg.secrets?.defaults,
		path: `channels.googlechat.accounts.${accountId}.serviceAccount`,
		mode: params.mode
	}).status === "configured_unavailable" ? {
		source: "none",
		status: "configured_unavailable"
	} : {
		source: "none",
		status: "missing"
	};
	const file = normalizeOptionalString(account.serviceAccountFile);
	if (file) {
		const result = tryReadSecretFileSync(resolveUserPath(file), "Google Chat service account file", {
			maxBytes: MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES,
			rejectHardlinks: false,
			rejectSymlink: false
		}, { configPath: `channels.googlechat.accounts.${accountId}.serviceAccountFile` });
		return result.status === "available" ? {
			credentialsFile: file,
			source: "file",
			status: "available"
		} : {
			credentialsFile: file,
			source: "file",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	if (accountId === "default") {
		const envJson = process.env[ENV_SERVICE_ACCOUNT];
		const envInline = parseServiceAccount(envJson);
		if (envInline) return {
			credentials: envInline,
			source: "env",
			status: "available"
		};
		const envFile = normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT_FILE]);
		if (envFile) {
			const result = tryReadSecretFileSync(resolveUserPath(envFile), "Google Chat service account file", {
				maxBytes: MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES,
				rejectHardlinks: false,
				rejectSymlink: false
			}, { configPath: `env.${ENV_SERVICE_ACCOUNT_FILE}` });
			return result.status === "available" ? {
				credentialsFile: envFile,
				source: "env",
				status: "available"
			} : {
				credentialsFile: envFile,
				source: "env",
				status: "configured_unavailable",
				diagnostic: result.diagnostic
			};
		}
	}
	return {
		source: "none",
		status: "missing"
	};
}
function resolveGoogleChatAccountWithMode(params) {
	const accountId = normalizeAccountId(params.accountId ?? params.cfg.channels?.["googlechat"]?.defaultAccount);
	const baseEnabled = params.cfg.channels?.["googlechat"]?.enabled !== false;
	const merged = mergeGoogleChatAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const credentials = resolveCredentialsFromConfig({
		cfg: params.cfg,
		accountId,
		account: merged,
		mode: params.mode
	});
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		config: merged,
		credentialSource: credentials.source,
		credentials: credentials.credentials,
		credentialsFile: credentials.credentialsFile,
		tokenStatus: credentials.status,
		...credentials.diagnostic ? { credentialDiagnostics: [credentials.diagnostic] } : {}
	};
}
function resolveGoogleChatAccount(params) {
	return resolveGoogleChatAccountWithMode({
		...params,
		mode: "strict"
	});
}
function inspectGoogleChatAccount(params) {
	return resolveGoogleChatAccountWithMode({
		...params,
		mode: "inspect"
	});
}
//#endregion
export { resolveGoogleChatConfigAccessorAccount as a, resolveGoogleChatAccount as i, listGoogleChatAccountIds as n, MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES as o, resolveDefaultGoogleChatAccountId as r, inspectGoogleChatAccount as t };
