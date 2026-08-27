import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { C as hashConfigIncludeRaw, D as parseJsonWithJson5Fallback, E as resolveConfigIncludes, T as resolveConfigIncludeWritePath, w as readConfigIncludeFileWithGuards } from "./redact-CWP17HFN.js";
import { o as resolveRequiredHomeDir } from "./home-dir-BFvskzn8.js";
import { n as containsEnvVarReference, r as resolveConfigEnvVars } from "./env-substitution-DXYJj0ec.js";
import { f as resolveConfigPath, v as resolveIncludeRoots, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { n as extractErrorCode, t as collectErrorGraphCandidates } from "./errors-Ccx0R-_Z.js";
import { t as loadDotEnv } from "./dotenv-e2A4jMLG.js";
import { c as getPublishedConfigRuntimeEnvState, i as collectConfigRuntimeEnvVars, s as createConfigRuntimeEnvBase, t as applyConfigEnvVars } from "./config-env-vars-C_yEEhJa.js";
import "./env-vars-B2e3bjCN.js";
import { i as createConfigResolutionFacts } from "./resolution-facts-DIK_QG79.js";
import { c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import JSON5 from "json5";
//#region src/config/gateway-env-selection.ts
const GATEWAY_CONFIG_SELECTION_ENV_KEYS = /* @__PURE__ */ new Set([
	"ANDROID_DATA",
	"HOME",
	"HOMEDRIVE",
	"HOMEPATH",
	"OPENCLAW_AGENT_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_HOME",
	"OPENCLAW_INCLUDE_ROOTS",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_OAUTH_DIR",
	"OPENCLAW_PACKAGE_DIR",
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_WORKSPACE_DIR",
	"PI_CODING_AGENT_DIR",
	"PREFIX",
	"USERPROFILE"
]);
/** Rejects config.env changes that would retarget a running Gateway process. */
function assertGatewayConfigEnvSelectionUnchanged(previousConfig, nextConfig) {
	const normalize = (config) => new Map(Object.entries(collectConfigRuntimeEnvVars(config)).map(([key, value]) => [key.toUpperCase(), value]));
	const previous = normalize(previousConfig);
	const next = normalize(nextConfig);
	for (const key of GATEWAY_CONFIG_SELECTION_ENV_KEYS) if (previous.get(key) !== next.get(key)) throw new Error(`Config env cannot change process-stable Gateway selector ${key} during reload. Restart with the target environment instead.`);
}
//#endregion
//#region src/config/io.read-helpers.ts
function hashConfigRaw(raw) {
	if (raw === null) return hashConfigIncludeRaw(null);
	return crypto.createHash("sha256").update(raw).digest("hex");
}
function resolveConfigSnapshotHash(snapshot) {
	if (typeof snapshot.hash === "string") {
		const trimmed = snapshot.hash.trim();
		if (trimmed) return trimmed;
	}
	if (typeof snapshot.raw !== "string") return null;
	return hashConfigRaw(snapshot.raw);
}
function coerceConfig(value) {
	return asOptionalRecord(value) ?? {};
}
function hasConfigMeta(value) {
	if (!isRecord(value)) return false;
	return isRecord(value.meta);
}
function resolveGatewayMode(value) {
	if (!isRecord(value)) return null;
	const gateway = value.gateway;
	if (!isRecord(gateway) || typeof gateway.mode !== "string") return null;
	const trimmed = gateway.mode.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function rejectConfigNonFiniteNumbers(value) {
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new Error(`Value must be a finite number, got ${String(value)}`);
		return;
	}
	if (Array.isArray(value)) {
		for (const entry of value) rejectConfigNonFiniteNumbers(entry);
		return;
	}
	if (isRecord(value)) for (const entry of Object.values(value)) rejectConfigNonFiniteNumbers(entry);
}
function collectEnvRefPaths(value, pathLocal, output) {
	if (typeof value === "string") {
		if (containsEnvVarReference(value)) output.set(pathLocal, value);
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			collectEnvRefPaths(item, `${pathLocal}[${index}]`, output);
		});
		return;
	}
	if (isRecord(value)) for (const [key, child] of Object.entries(value)) collectEnvRefPaths(child, pathLocal ? `${pathLocal}.${key}` : key, output);
}
function containsConfigIncludeDirective(value) {
	if (Array.isArray(value)) return value.some((item) => containsConfigIncludeDirective(item));
	if (!isRecord(value)) return false;
	if ("$include" in value) return true;
	return Object.values(value).some((item) => containsConfigIncludeDirective(item));
}
function resolveConfigPathForDeps(deps) {
	if (deps.configPath) return deps.configPath;
	return resolveConfigPath(deps.env, resolveStateDir(deps.env, deps.homedir));
}
function normalizeConfigIoDeps(overrides = {}) {
	const env = overrides.env ?? process.env;
	return {
		fs: overrides.fs ?? fs,
		json5: overrides.json5 ?? JSON5,
		env,
		lowerPrecedenceEnv: overrides.lowerPrecedenceEnv ?? {},
		homedir: overrides.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
		configPath: overrides.configPath ?? "",
		logger: overrides.logger ?? console,
		measure: overrides.measure ?? (async (_name, run) => await run()),
		suppressFutureVersionWarning: overrides.suppressFutureVersionWarning ?? (isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE)),
		observe: overrides.observe ?? true
	};
}
function maybeLoadDotEnvForConfig(env) {
	if (env === process.env) loadDotEnv({ quiet: true });
}
function parseConfigJson5(raw, json5 = JSON5) {
	try {
		return {
			ok: true,
			parsed: parseJsonWithJson5Fallback(raw, json5)
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err)
		};
	}
}
const TILDE_PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_LIKE_CONFIG_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIKE_CONFIG_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
function isPathLikeConfigKey(key) {
	return Boolean(key && (PATH_LIKE_CONFIG_KEY_RE.test(key) || PATH_LIKE_CONFIG_LIST_KEYS.has(key)));
}
function expandAuthoredTildePath(value, home) {
	const suffix = value.slice(1);
	if (!suffix) return home;
	if (suffix.startsWith("/") || suffix.startsWith("\\")) return path.join(home, suffix.slice(1));
	return value;
}
function restoreAuthoredTildePathsForWrite(next, authored, key, home) {
	if (typeof next === "string" && typeof authored === "string" && isPathLikeConfigKey(key) && TILDE_PATH_VALUE_RE.test(authored.trim()) && path.normalize(next) === path.normalize(expandAuthoredTildePath(authored.trim(), home))) return authored;
	if (Array.isArray(next) && Array.isArray(authored)) {
		const normalizeChildren = isPathLikeConfigKey(key);
		return next.map((entry, index) => restoreAuthoredTildePathsForWrite(entry, authored[index], normalizeChildren ? key : void 0, home));
	}
	if (!isRecord(next) || !isRecord(authored)) return next;
	const out = { ...next };
	for (const [childKey, childValue] of Object.entries(out)) if (Object.hasOwn(authored, childKey)) out[childKey] = restoreAuthoredTildePathsForWrite(childValue, authored[childKey], childKey, home);
	return out;
}
function resolveConfigIncludesForRead(parsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, onIncludeResolved) {
	const allowedRoots = resolveIncludeRoots(deps.env, deps.homedir);
	const recordIncludeWatchPath = (resolvedPath) => {
		includeFilePathsForWatch?.add(path.normalize(resolvedPath));
	};
	const recordIncludeTarget = (resolvedPath, canonicalPath) => {
		if (!includeFileTargetsForWrite) return;
		const normalizedPath = path.normalize(resolvedPath);
		try {
			includeFileTargetsForWrite[normalizedPath] = path.normalize(canonicalPath ?? resolveConfigIncludeWritePath({
				configPath,
				includePath: resolvedPath,
				allowedRoots
			}));
		} catch {}
	};
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
		onLexicalPath: recordIncludeWatchPath,
		onIncludeResolved,
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => {
			try {
				const raw = readConfigIncludeFileWithGuards({
					includePath,
					resolvedPath,
					rootRealDir,
					ioFs: deps.fs,
					onResolvedPath: (canonicalPath) => {
						recordIncludeWatchPath(canonicalPath);
						recordIncludeTarget(resolvedPath, canonicalPath);
					}
				});
				if (includeFileHashesForWrite) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(raw);
				return raw;
			} catch (error) {
				const missing = collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === "ENOENT");
				if (includeFileHashesForWrite && missing) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(null);
				if (missing) recordIncludeTarget(resolvedPath);
				throw error;
			}
		},
		parseJson: (raw) => deps.json5.parse(raw)
	}, { allowedRoots });
}
function resolveConfigForRead(resolvedIncludes, env, lowerPrecedenceEnv = {}) {
	if (resolvedIncludes && typeof resolvedIncludes === "object" && "env" in resolvedIncludes) applyConfigEnvVars(resolvedIncludes, env, { lowerPrecedenceEnv });
	const envWarnings = [];
	const pendingEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedConfigRaw = resolveConfigEnvVars(resolvedIncludes, env, {
		onMissing: (warning) => envWarnings.push(warning),
		onPendingEnvSecretRef: (id, configPath) => pendingEnvSecretRefs.set(configPath, id)
	});
	return {
		resolvedConfigRaw,
		envSnapshotForRestore: { ...env },
		envWarnings,
		resolutionFacts: createConfigResolutionFacts(envWarnings, pendingEnvSecretRefs, coerceConfig(resolvedConfigRaw).secrets?.defaults?.env)
	};
}
function snapshotEnv(env) {
	return { ...env };
}
function replaceEnvSnapshot(env, next) {
	for (const key of Object.keys(env)) delete env[key];
	Object.assign(env, next);
}
function resolveManagedRuntimeEnvBaseline() {
	const published = getPublishedConfigRuntimeEnvState();
	return {
		generation: published.generation,
		sourceConfig: published.sourceConfig ?? getRuntimeConfigSourceSnapshot() ?? {}
	};
}
function createManagedRuntimeEnvBase() {
	return createConfigRuntimeEnvBase(resolveManagedRuntimeEnvBaseline().sourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS });
}
function restoreEnvChangesIfUnchanged(params) {
	const keys = /* @__PURE__ */ new Set([...Object.keys(params.before), ...Object.keys(params.after)]);
	for (const key of keys) {
		if (params.before[key] === params.after[key] || params.env[key] !== params.after[key]) continue;
		const previous = params.before[key];
		if (previous === void 0) delete params.env[key];
		else params.env[key] = previous;
	}
}
//#endregion
export { assertGatewayConfigEnvSelectionUnchanged as S, resolveManagedRuntimeEnvBaseline as _, hasConfigMeta as a, snapshotEnv as b, normalizeConfigIoDeps as c, replaceEnvSnapshot as d, resolveConfigForRead as f, resolveGatewayMode as g, resolveConfigSnapshotHash as h, createManagedRuntimeEnvBase as i, parseConfigJson5 as l, resolveConfigPathForDeps as m, collectEnvRefPaths as n, hashConfigRaw as o, resolveConfigIncludesForRead as p, containsConfigIncludeDirective as r, maybeLoadDotEnvForConfig as s, coerceConfig as t, rejectConfigNonFiniteNumbers as u, restoreAuthoredTildePathsForWrite as v, GATEWAY_CONFIG_SELECTION_ENV_KEYS as x, restoreEnvChangesIfUnchanged as y };
