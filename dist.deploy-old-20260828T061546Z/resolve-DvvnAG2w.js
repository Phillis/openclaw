import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./redact-CWP17HFN.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { c as readSecureFile } from "./fs-safe-CmrQUApq.js";
import { l as safeStat, r as inspectPathPermissions } from "./permissions-DHG-s8_A.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { p as isValidEnvSecretRefId } from "./types.secrets-Bre8L6Ts.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as isBuiltInDefaultSecretProviderRef, c as isValidSecretProviderAlias, d as resolveSecretRefProviderSourceMismatch, f as secretRefKey, i as formatExecSecretRefIdValidationMessage, n as SINGLE_VALUE_FILE_REF_ID, o as isValidExecSecretRefId, s as isValidFileSecretRefId } from "./ref-contract-BHWY70rN.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-jAYIsS4O.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-DqYRJvWI.js";
import { n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-BL1Kt38K.js";
import { n as normalizePositiveInt, r as normalizePositiveTimerMs, t as isNonEmptyString } from "./shared-DSMB324f.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { c as refResolutionError, o as isSecretResolutionError, s as providerResolutionError } from "./resolve-errors-C2XRFrol.js";
import "./audit-fs-C2hsuc07.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import { n as readJsonPointer } from "./json-pointer-CAhyFpd7.js";
import { c as readSecretStoreValue, h as SECRET_STORE_VALUE_MAX_BYTES } from "./secret-store-DzZIiLba.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/secrets/provider-integrations.ts
/** Materializes trusted plugin secret-provider integrations into exec provider configs. */
const NODE_COMMAND_PLACEHOLDER = "${node}";
const PLUGIN_INTEGRATION_PROVIDER_ID_MAX_LENGTH = 128;
function resolvePluginRelativePath(value, pluginRoot) {
	const resolved = path.resolve(pluginRoot, value);
	return isPathInside(pluginRoot, resolved) ? resolved : void 0;
}
function isPluginRelativeEntrypoint(value) {
	return value.startsWith("./");
}
function resolveArg(arg, pluginRoot) {
	if (!arg.startsWith("./") && !arg.startsWith("../")) return arg;
	return resolvePluginRelativePath(arg, pluginRoot);
}
function withNodeCommandTrustedDir(command, pluginRoot) {
	return command === NODE_COMMAND_PLACEHOLDER ? [.../* @__PURE__ */ new Set([path.dirname(process.execPath), pluginRoot])] : [pluginRoot];
}
function isSecurePosixPathStat(stat) {
	if (process.platform === "win32") return true;
	if ((stat.mode & 18) !== 0) return false;
	if (typeof process.getuid !== "function" || typeof stat.uid !== "number") return true;
	const uid = process.getuid();
	return stat.uid === uid || stat.uid === 0;
}
function pathSegmentsBetween(rootDir, targetDir) {
	if (!isPathInside(rootDir, targetDir)) return;
	const relative = path.relative(rootDir, targetDir);
	if (relative === "") return [];
	return relative.split(path.sep).filter(Boolean);
}
function isSecurePluginEntrypointPath(params) {
	if (process.platform === "win32") return true;
	const originalSegments = pathSegmentsBetween(path.resolve(params.pluginRoot), path.dirname(path.resolve(params.resolvedEntrypoint)));
	const realpathSegments = pathSegmentsBetween(params.pluginRootRealpath, path.dirname(params.entrypointRealpath));
	if (!originalSegments || !realpathSegments) return false;
	let originalDir = path.resolve(params.pluginRoot);
	for (const [index, segment] of ["", ...originalSegments].entries()) {
		if (segment) originalDir = path.join(originalDir, segment);
		const stat = fs.lstatSync(originalDir);
		if (index === 0 && stat.isSymbolicLink()) continue;
		if (!stat.isDirectory() || stat.isSymbolicLink() || !isSecurePosixPathStat(stat)) return false;
	}
	let realpathDir = params.pluginRootRealpath;
	for (const segment of ["", ...realpathSegments]) {
		if (segment) realpathDir = path.join(realpathDir, segment);
		const stat = fs.lstatSync(realpathDir);
		if (!stat.isDirectory() || !isSecurePosixPathStat(stat)) return false;
	}
	return true;
}
function resolveNodeEntrypointArg(params) {
	const entrypoint = params.integration.args?.[0];
	if (!entrypoint || !isPluginRelativeEntrypoint(entrypoint)) return;
	let pluginRootRealpath;
	try {
		pluginRootRealpath = fs.realpathSync(params.pluginRoot);
	} catch {
		return;
	}
	const resolved = resolvePluginRelativePath(entrypoint, params.pluginRoot);
	if (!resolved) return;
	let stat;
	try {
		stat = fs.lstatSync(resolved);
	} catch {
		return;
	}
	if (!stat.isFile() || stat.isSymbolicLink()) return;
	if (params.rejectHardlinks && stat.nlink > 1) return;
	if (!isSecurePosixPathStat(stat)) return;
	try {
		const realpath = fs.realpathSync(resolved);
		if (!isPathInside(pluginRootRealpath, realpath)) return;
		if (!isSecurePluginEntrypointPath({
			pluginRoot: params.pluginRoot,
			pluginRootRealpath,
			resolvedEntrypoint: resolved,
			entrypointRealpath: realpath
		})) return;
		return realpath;
	} catch {
		return;
	}
}
function materializeExecProviderConfig(integration, record, env) {
	const pluginRoot = record.rootDir;
	if (integration.command !== NODE_COMMAND_PLACEHOLDER) return;
	const nodeEntrypoint = resolveNodeEntrypointArg({
		integration,
		pluginRoot,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: pluginRoot,
			env
		})
	});
	if (!nodeEntrypoint) return;
	const args = integration.args?.map((arg, index) => nodeEntrypoint && index === 0 ? nodeEntrypoint : resolveArg(arg, pluginRoot)).filter((arg) => arg !== void 0);
	if (integration.args && args?.length !== integration.args.length) return;
	const trustedDirs = withNodeCommandTrustedDir(integration.command, pluginRoot);
	return {
		source: "exec",
		command: process.execPath,
		...args ? { args } : {},
		...integration.timeoutMs !== void 0 ? { timeoutMs: integration.timeoutMs } : {},
		...integration.noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs: integration.noOutputTimeoutMs } : {},
		...integration.maxOutputBytes !== void 0 ? { maxOutputBytes: integration.maxOutputBytes } : {},
		...integration.jsonOnly === false ? { jsonOnly: false } : {},
		...integration.env ? { env: integration.env } : {},
		...integration.passEnv ? { passEnv: integration.passEnv } : {},
		trustedDirs
	};
}
function canExposeSecretProviderIntegrations(params) {
	if (params.record.origin !== "bundled" && params.record.origin !== "global") return false;
	return isActivatedManifestOwner({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.config
	});
}
function integrationDisplayName(record, integrationId, integration) {
	return normalizeOptionalString(integration.displayName) ?? normalizeOptionalString(record.name) ?? integrationId;
}
function createPluginIntegrationProviderConfig(params) {
	return {
		source: "exec",
		pluginIntegration: {
			pluginId: params.pluginId,
			integrationId: params.integrationId
		}
	};
}
function isValidPluginIntegrationProviderId(value) {
	return value.length > 0 && value.length <= PLUGIN_INTEGRATION_PROVIDER_ID_MAX_LENGTH;
}
/** Narrows a secret provider config to the plugin-integration exec shape. */
function isPluginIntegrationSecretProviderConfig(value) {
	return typeof value === "object" && value !== null && "source" in value && value.source === "exec" && "pluginIntegration" in value && typeof value.pluginIntegration === "object" && value.pluginIntegration !== null && "pluginId" in value.pluginIntegration && typeof value.pluginIntegration.pluginId === "string" && value.pluginIntegration.pluginId.trim().length > 0 && "integrationId" in value.pluginIntegration && typeof value.pluginIntegration.integrationId === "string" && value.pluginIntegration.integrationId.trim().length > 0;
}
/** Materializes an active trusted plugin secret-provider integration into an exec provider. */
/** Resolves a trusted plugin secret-provider integration into executable provider config. */
function resolveSecretProviderIntegrationConfig(params) {
	const config = params.config ?? {};
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	const { pluginId, integrationId } = params.providerConfig.pluginIntegration;
	if (!isValidSecretProviderAlias(params.providerAlias)) return {
		ok: false,
		reason: `provider alias "${params.providerAlias}" is invalid`
	};
	const record = params.manifestRegistry.plugins.find((candidate) => candidate.id === pluginId);
	if (!record) return {
		ok: false,
		reason: `plugin "${pluginId}" is not installed`
	};
	if (!canExposeSecretProviderIntegrations({
		record,
		normalizedConfig,
		config
	})) return {
		ok: false,
		reason: `plugin "${pluginId}" is not active or is not from a trusted install origin`
	};
	const integration = record.secretProviderIntegrations?.[integrationId];
	if (!integration) return {
		ok: false,
		reason: `plugin "${record.id}" does not declare secret provider integration "${integrationId}"`
	};
	const materialized = materializeExecProviderConfig(integration, record, env);
	if (!materialized) return {
		ok: false,
		reason: `plugin "${record.id}" integration "${integrationId}" could not be materialized`
	};
	return {
		ok: true,
		providerConfig: materialized
	};
}
/** Lists plugin secret-provider presets available to interactive configure flows. */
function listSecretProviderIntegrationPresets(params) {
	const presets = [];
	const config = params.config ?? {};
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	for (const record of params.manifestRegistry.plugins) {
		if (!canExposeSecretProviderIntegrations({
			record,
			normalizedConfig,
			config
		})) continue;
		for (const [integrationId, integration] of Object.entries(record.secretProviderIntegrations ?? {})) {
			const providerAlias = normalizeOptionalString(integration.providerAlias) ?? integrationId;
			if (!isValidSecretProviderAlias(providerAlias) || !isValidPluginIntegrationProviderId(record.id) || !isValidPluginIntegrationProviderId(integrationId)) continue;
			if (!materializeExecProviderConfig(integration, record, env)) continue;
			presets.push({
				id: integrationId,
				pluginId: record.id,
				providerAlias,
				displayName: integrationDisplayName(record, integrationId, integration),
				...integration.description ? { description: integration.description } : {},
				providerConfig: createPluginIntegrationProviderConfig({
					pluginId: record.id,
					integrationId
				})
			});
		}
	}
	return presets.toSorted((left, right) => `${left.displayName}:${left.providerAlias}`.localeCompare(`${right.displayName}:${right.providerAlias}`));
}
//#endregion
//#region src/secrets/resolve-store.ts
const STORE_SECRET_REF_BATCH_MAX_BYTES = 512 * SECRET_STORE_VALUE_MAX_BYTES;
function resolveStoreRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	let resolvedBytes = 0;
	for (const ref of params.refs) {
		const result = readSecretStoreValue({
			scope: { kind: "team" },
			name: ref.id,
			database: params.database
		});
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND") throw refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "store",
				provider: params.providerName,
				refId: ref.id,
				message: result.error.message
			});
			if (result.error.code === "SECRET_STORE_INVALID_NAME") throw refResolutionError({
				code: "SECRET_REF_INVALID",
				source: "store",
				provider: params.providerName,
				refId: ref.id,
				message: result.error.message
			});
			throw providerResolutionError({
				code: "SECRET_PROVIDER_UNAVAILABLE",
				source: "store",
				provider: params.providerName,
				message: result.error.message,
				cause: result.error.cause
			});
		}
		resolvedBytes += Buffer.byteLength(result.value, "utf8");
		if (resolvedBytes > STORE_SECRET_REF_BATCH_MAX_BYTES) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: "store",
			provider: params.providerName,
			message: `Store provider "${params.providerName}" exceeded its ${STORE_SECRET_REF_BATCH_MAX_BYTES}-byte batch limit.`
		});
		resolved.set(ref.id, result.value);
	}
	return resolved;
}
//#endregion
//#region src/secrets/resolve.ts
/** Resolves SecretRef values from env, file, exec, and store secret providers. */
const DEFAULT_PROVIDER_CONCURRENCY = 4;
const DEFAULT_MAX_REFS_PER_PROVIDER = 512;
const DEFAULT_MAX_BATCH_BYTES = 256 * 1024;
const DEFAULT_FILE_MAX_BYTES = 1024 * 1024;
const DEFAULT_FILE_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_MAX_OUTPUT_BYTES = 1024 * 1024;
const SAFE_EXEC_ERROR_CODES = /* @__PURE__ */ new Set(["AMBIGUOUS_DUPLICATE_KEY", "NOT_FOUND"]);
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function throwUnknownProviderResolutionError(params) {
	if (isSecretResolutionError(params.err)) throw params.err;
	throw providerResolutionError({
		...process.platform === "win32" && (params.source === "file" || params.source === "exec") && params.err instanceof FsSafeError && params.err.code === "permission-unverified" ? { code: "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE" } : {},
		source: params.source,
		provider: params.provider,
		message: formatErrorMessage(params.err),
		cause: params.err
	});
}
async function readFileStatOrThrow(pathname, label) {
	const stat = await safeStat(pathname);
	if (!stat.ok) throw new Error(`${label} is not readable: ${pathname}`);
	if (stat.isDir) throw new Error(`${label} must be a file: ${pathname}`);
	return stat;
}
function isAbsolutePathname(value) {
	return path.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
function resolveResolutionLimits() {
	return {
		maxProviderConcurrency: DEFAULT_PROVIDER_CONCURRENCY,
		maxRefsPerProvider: DEFAULT_MAX_REFS_PER_PROVIDER,
		maxBatchBytes: DEFAULT_MAX_BATCH_BYTES
	};
}
function toProviderKey(source, provider) {
	return `${source}:${provider}`;
}
function resolveConfiguredProvider(params) {
	const { ref, config } = params;
	const providerConfig = config.secrets?.providers?.[ref.provider];
	if (isBuiltInDefaultSecretProviderRef(config, ref)) {
		if (ref.source === "env") return { source: "env" };
		if (ref.source === "store") return { source: "store" };
	}
	if (!providerConfig) throw providerResolutionError({
		code: "SECRET_PROVIDER_NOT_CONFIGURED",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" is not configured (ref: ${ref.source}:${ref.provider}:${ref.id}).`
	});
	const configuredSource = resolveSecretRefProviderSourceMismatch(config, ref);
	if (configuredSource) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" has source "${configuredSource}" but ref requests "${ref.source}".`
	});
	if (isPluginIntegrationSecretProviderConfig(providerConfig)) {
		const resolved = resolveSecretProviderIntegrationConfig({
			manifestRegistry: params.manifestRegistry ?? getCurrentPluginMetadataSnapshot({
				config,
				env: params.env,
				allowWorkspaceScopedSnapshot: true
			})?.manifestRegistry ?? loadPluginManifestRegistryCore({
				config,
				env: params.env
			}),
			providerAlias: ref.provider,
			providerConfig,
			config,
			env: params.env
		});
		if (!resolved.ok) throw providerResolutionError({
			source: ref.source,
			provider: ref.provider,
			message: `Secret provider "${ref.provider}" plugin integration is unavailable: ${resolved.reason}.`
		});
		return resolved.providerConfig;
	}
	return providerConfig;
}
async function assertSecurePath(params) {
	if (!isAbsolutePathname(params.targetPath)) throw new Error(`${params.label} must be an absolute path.`);
	let effectivePath = params.targetPath;
	let stat = await readFileStatOrThrow(effectivePath, params.label);
	if (stat.isSymlink) {
		if (!params.allowSymlinkPath) throw new Error(`${params.label} must not be a symlink: ${effectivePath}`);
		try {
			effectivePath = await fs$1.realpath(effectivePath);
		} catch {
			throw new Error(`${params.label} symlink target is not readable: ${params.targetPath}`);
		}
		if (!isAbsolutePathname(effectivePath)) throw new Error(`${params.label} resolved symlink target must be an absolute path.`);
		stat = await readFileStatOrThrow(effectivePath, params.label);
		if (stat.isSymlink) throw new Error(`${params.label} symlink target must not be a symlink: ${effectivePath}`);
	}
	if (params.trustedDirs && params.trustedDirs.length > 0) {
		if (!params.trustedDirs.map((entry) => resolveUserPath(entry)).some((dir) => isPathInside(dir, effectivePath))) throw new Error(`${params.label} is outside trustedDirs: ${effectivePath}`);
	}
	const perms = await inspectPathPermissions(effectivePath);
	if (!perms.ok) throw new Error(`${params.label} permissions could not be verified: ${effectivePath}`);
	const writableByOthers = perms.worldWritable || perms.groupWritable;
	const readableByOthers = perms.worldReadable || perms.groupReadable;
	if (writableByOthers || !params.allowReadableByOthers && readableByOthers) throw new Error(`${params.label} permissions are too open: ${effectivePath}`);
	if (process.platform === "win32" && perms.source === "unknown") throw new FsSafeError("permission-unverified", `${params.label} ACL verification unavailable on Windows for ${effectivePath}. Move the command to a path whose ACLs OpenClaw can verify; there is no provider-level bypass.`);
	if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
		const uid = process.getuid();
		if (stat.uid !== uid) throw new Error(`${params.label} must be owned by the current user (uid=${uid}): ${effectivePath}`);
	}
	return effectivePath;
}
async function readFileProviderPayload(params) {
	const cacheKey = params.providerName;
	const cache = params.cache;
	const read = async () => {
		const filePath = resolveUserPath(params.providerConfig.path);
		const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_FILE_TIMEOUT_MS);
		const maxBytes = normalizePositiveInt(params.providerConfig.maxBytes, DEFAULT_FILE_MAX_BYTES);
		try {
			const { buffer: payload } = await readSecureFile({
				filePath,
				label: `secrets.providers.${params.providerName}.path`,
				io: {
					maxBytes,
					timeoutMs
				},
				permissions: { allowInsecure: false }
			});
			const text = payload.toString("utf8").replace(/^\uFEFF/, "");
			if (params.providerConfig.mode === "singleValue") return text.replace(/\r?\n$/, "");
			const parsed = JSON.parse(text);
			if (!isRecord(parsed)) throw new Error(`File provider "${params.providerName}" payload is not a JSON object.`);
			return parsed;
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "timeout") throw new Error(`File provider "${params.providerName}" timed out after ${timeoutMs}ms.`, { cause: error });
			throw error;
		}
	};
	if (!cache) return await read();
	cache.filePayloadByProvider ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.filePayloadByProvider, cacheKey, read);
}
async function resolveEnvRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	const allowlist = params.providerConfig.allowlist ? new Set(params.providerConfig.allowlist) : null;
	for (const ref of params.refs) {
		if (allowlist && !allowlist.has(ref.id)) throw refResolutionError({
			code: "SECRET_REF_POLICY_DENIED",
			source: "env",
			provider: params.providerName,
			refId: ref.id,
			message: `Environment variable "${ref.id}" is not allowlisted in secrets.providers.${params.providerName}.allowlist.`
		});
		const envValue = params.env[ref.id];
		if (!isNonEmptyString(envValue)) throw refResolutionError({
			code: "SECRET_REF_NOT_FOUND",
			source: "env",
			provider: params.providerName,
			refId: ref.id,
			message: `Environment variable "${ref.id}" is missing or empty.`
		});
		resolved.set(ref.id, envValue);
	}
	return resolved;
}
async function resolveFileRefs(params) {
	let payload;
	try {
		payload = await readFileProviderPayload({
			providerName: params.providerName,
			providerConfig: params.providerConfig,
			cache: params.cache
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "file",
			provider: params.providerName,
			err
		});
	}
	const mode = params.providerConfig.mode ?? "json";
	const resolved = /* @__PURE__ */ new Map();
	if (mode === "singleValue") {
		for (const ref of params.refs) {
			if (ref.id !== "value") throw refResolutionError({
				code: "SECRET_REF_INVALID",
				source: "file",
				provider: params.providerName,
				refId: ref.id,
				message: `singleValue file provider "${params.providerName}" expects ref id "${SINGLE_VALUE_FILE_REF_ID}".`
			});
			resolved.set(ref.id, payload);
		}
		return resolved;
	}
	for (const ref of params.refs) try {
		resolved.set(ref.id, readJsonPointer(payload, ref.id, { onMissing: "throw" }));
	} catch (err) {
		throw refResolutionError({
			code: "SECRET_REF_NOT_FOUND",
			source: "file",
			provider: params.providerName,
			refId: ref.id,
			message: formatErrorMessage(err),
			cause: err
		});
	}
	return resolved;
}
function parseExecValues(params) {
	const trimmed = params.stdout.trim();
	if (!trimmed) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" returned empty stdout.`
	});
	let parsed;
	if (!params.jsonOnly && params.ids.length === 1) try {
		parsed = JSON.parse(trimmed);
	} catch {
		return { [expectDefined(params.ids[0], "ids entry at 0")]: trimmed };
	}
	else try {
		parsed = JSON.parse(trimmed);
	} catch {
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" returned invalid JSON.`
		});
	}
	if (!isRecord(parsed)) {
		if (!params.jsonOnly && params.ids.length === 1 && typeof parsed === "string") return { [expectDefined(params.ids[0], "ids entry at 0")]: parsed };
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" response must be an object.`
		});
	}
	if (parsed.protocolVersion !== 1) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" protocolVersion must be 1.`
	});
	const responseValues = parsed.values;
	if (!isRecord(responseValues)) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" response missing "values".`
	});
	const responseErrors = isRecord(parsed.errors) ? parsed.errors : null;
	const out = {};
	for (const id of params.ids) {
		if (responseErrors && Object.hasOwn(responseErrors, id)) {
			const entry = responseErrors[id];
			const code = isRecord(entry) && typeof entry.code === "string" ? entry.code : null;
			const safeCode = code && SAFE_EXEC_ERROR_CODES.has(code) ? code : null;
			throw refResolutionError({
				code: safeCode === "NOT_FOUND" ? "SECRET_REF_NOT_FOUND" : "SECRET_REF_PROVIDER_ERROR",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" failed for id "${id}"${safeCode ? ` (${safeCode})` : ""}.`
			});
		}
		if (!Object.hasOwn(responseValues, id)) throw refResolutionError({
			code: "SECRET_REF_NOT_FOUND",
			source: "exec",
			provider: params.providerName,
			refId: id,
			message: `Exec provider "${params.providerName}" response missing id "${id}".`
		});
		out[id] = responseValues[id];
	}
	return out;
}
async function resolveExecRefs(params) {
	const ids = uniqueStrings(params.refs.map((ref) => ref.id));
	if (ids.length > params.limits.maxRefsPerProvider) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`
	});
	const commandPath = resolveUserPath(params.providerConfig.command);
	let secureCommandPath;
	try {
		secureCommandPath = await assertSecurePath({
			targetPath: commandPath,
			label: `secrets.providers.${params.providerName}.command`,
			trustedDirs: params.providerConfig.trustedDirs,
			allowReadableByOthers: true,
			allowSymlinkPath: false
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	const input = JSON.stringify({
		protocolVersion: 1,
		provider: params.providerName,
		ids
	});
	if (Buffer.byteLength(input, "utf8") > params.limits.maxBatchBytes) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" request exceeded maxBatchBytes (${params.limits.maxBatchBytes}).`
	});
	const childEnv = {};
	for (const key of params.providerConfig.passEnv ?? []) {
		const value = params.env[key];
		if (value !== void 0) childEnv[key] = value;
	}
	for (const [key, value] of Object.entries(params.providerConfig.env ?? {})) childEnv[key] = value;
	const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_EXEC_TIMEOUT_MS);
	const noOutputTimeoutMs = normalizePositiveTimerMs(params.providerConfig.noOutputTimeoutMs, timeoutMs);
	const maxOutputBytes = normalizePositiveInt(params.providerConfig.maxOutputBytes, DEFAULT_EXEC_MAX_OUTPUT_BYTES);
	const jsonOnly = params.providerConfig.jsonOnly ?? true;
	let result;
	try {
		result = await runCommandWithTimeout([secureCommandPath, ...params.providerConfig.args ?? []], {
			baseEnv: {},
			cwd: path.dirname(secureCommandPath),
			env: childEnv,
			input,
			killProcessTree: true,
			maxCombinedOutputBytes: maxOutputBytes,
			maxOutputBytes,
			noOutputTimeoutMs,
			outputCapture: "head",
			terminateOnOutputLimit: true,
			timeoutMs
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	if (result.termination === "timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" timed out after ${timeoutMs}ms.`
	});
	if (result.termination === "no-output-timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" produced no output for ${noOutputTimeoutMs}ms.`
	});
	if (result.outputLimitExceeded) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider output exceeded maxOutputBytes (${maxOutputBytes}).`
	});
	if (result.code !== 0) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exited with code ${String(result.code)}.`
	});
	let values;
	try {
		values = parseExecValues({
			providerName: params.providerName,
			ids,
			stdout: result.stdout,
			jsonOnly
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	const resolved = /* @__PURE__ */ new Map();
	for (const id of ids) resolved.set(id, values[id]);
	return resolved;
}
async function resolveProviderRefs(params) {
	try {
		if (params.providerConfig.source === "env") return await resolveEnvRefs({
			refs: params.refs,
			providerName: params.providerName,
			providerConfig: params.providerConfig,
			env: params.options.env ?? process.env
		});
		if (params.providerConfig.source === "file") return await resolveFileRefs({
			refs: params.refs,
			providerName: params.providerName,
			providerConfig: params.providerConfig,
			cache: params.options.cache
		});
		if (params.providerConfig.source === "store") return resolveStoreRefs({
			refs: params.refs,
			providerName: params.providerName,
			database: { env: params.options.env ?? process.env }
		});
		if (params.providerConfig.source === "exec") {
			if (isPluginIntegrationSecretProviderConfig(params.providerConfig)) throw providerResolutionError({
				source: params.source,
				provider: params.providerName,
				message: `Secret provider "${params.providerName}" plugin integration was not materialized before exec resolution.`
			});
			return await resolveExecRefs({
				refs: params.refs,
				providerName: params.providerName,
				providerConfig: params.providerConfig,
				env: params.options.env ?? process.env,
				limits: params.limits
			});
		}
		throw providerResolutionError({
			source: params.source,
			provider: params.providerName,
			message: `Unsupported secret provider source "${String(params.providerConfig.source)}".`
		});
	} catch (err) {
		return throwUnknownProviderResolutionError({
			source: params.source,
			provider: params.providerName,
			err
		});
	}
}
function normalizeAndGroupSecretRefs(refs) {
	if (refs.length === 0) return [];
	const uniqueRefs = /* @__PURE__ */ new Map();
	for (const ref of refs) {
		const id = ref.id.trim();
		if (!id) throw new Error("Secret reference id is empty.");
		if (!isValidSecretProviderAlias(ref.provider)) throw new Error(`Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "env" && !isValidEnvSecretRefId(id)) throw new Error(`Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "file" && !isValidFileSecretRefId(id)) throw new Error(`File secret reference id must be an absolute JSON pointer or "value" (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "store" && !isValidEnvSecretRefId(id)) throw new Error(`Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "exec" && !isValidExecSecretRefId(id)) throw new Error(`${formatExecSecretRefIdValidationMessage()} (ref: ${ref.source}:${ref.provider}:${id}).`);
		uniqueRefs.set(secretRefKey(ref), {
			...ref,
			id
		});
	}
	const grouped = /* @__PURE__ */ new Map();
	for (const ref of uniqueRefs.values()) {
		const key = toProviderKey(ref.source, ref.provider);
		const existing = grouped.get(key);
		if (existing) {
			existing.refs.push(ref);
			continue;
		}
		grouped.set(key, {
			source: ref.source,
			providerName: ref.provider,
			refs: [ref]
		});
	}
	return [...grouped.values()];
}
function createProviderResolutionTasks(params) {
	return params.groups.map((group) => async () => {
		if (group.refs.length > params.limits.maxRefsPerProvider) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: group.source,
			provider: group.providerName,
			message: `Secret provider "${group.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`
		});
		const providerConfig = resolveConfiguredProvider({
			ref: expectDefined(group.refs[0], "refs entry at 0"),
			config: params.options.config,
			env: params.options.env ?? process.env,
			manifestRegistry: params.options.manifestRegistry
		});
		const values = await resolveProviderRefs({
			refs: group.refs,
			source: group.source,
			providerName: group.providerName,
			providerConfig,
			options: params.options,
			limits: params.limits
		});
		for (const ref of group.refs) if (!values.has(ref.id)) throw refResolutionError({
			code: "SECRET_REF_PROVIDER_CONTRACT",
			source: group.source,
			provider: group.providerName,
			refId: ref.id,
			message: `Secret provider "${group.providerName}" did not return id "${ref.id}".`
		});
		return {
			group,
			values
		};
	});
}
async function resolveSecretRefProviderGroups(params) {
	const groups = normalizeAndGroupSecretRefs(params.refs);
	const limits = resolveResolutionLimits();
	const errorsByIndex = /* @__PURE__ */ new Map();
	const taskResults = await runTasksWithConcurrency({
		tasks: createProviderResolutionTasks({
			groups,
			options: params.options,
			limits
		}),
		limit: limits.maxProviderConcurrency,
		errorMode: params.errorMode,
		onTaskError: (error, index) => {
			errorsByIndex.set(index, error);
		}
	});
	const resolved = /* @__PURE__ */ new Map();
	for (const result of taskResults.results) {
		if (!result) continue;
		for (const ref of result.group.refs) resolved.set(secretRefKey(ref), result.values.get(ref.id));
	}
	const failures = [];
	for (const [index, group] of groups.entries()) if (errorsByIndex.has(index)) failures.push({
		group,
		error: errorsByIndex.get(index)
	});
	return {
		resolved,
		failures,
		hasError: taskResults.hasError,
		firstError: taskResults.firstError
	};
}
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
async function resolveSecretRefValues(refs, options) {
	const result = await resolveSecretRefProviderGroups({
		refs,
		options,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.resolved;
}
/** Internal owner-isolation resolver that preserves one provider call per batch. */
async function resolveSecretRefValuesSettledByProvider(refs, options) {
	const result = await resolveSecretRefProviderGroups({
		refs,
		options,
		errorMode: "continue"
	});
	return {
		resolved: result.resolved,
		failures: result.failures
	};
}
/** Resolves one SecretRef, using the optional shared runtime cache. */
/** Resolves one SecretRef to an unknown value using configured provider state. */
async function resolveSecretRefValue(ref, options) {
	const cache = options.cache;
	const key = secretRefKey(ref);
	const resolve = async () => {
		const resolved = await resolveSecretRefValues([ref], options);
		if (!resolved.has(key)) throw refResolutionError({
			code: "SECRET_REF_PROVIDER_CONTRACT",
			source: ref.source,
			provider: ref.provider,
			refId: ref.id,
			message: `Secret reference "${key}" resolved to no value.`
		});
		return resolved.get(key);
	};
	if (!cache) return await resolve();
	cache.resolvedByRefKey ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.resolvedByRefKey, key, resolve);
}
/** Resolves one SecretRef and requires a non-empty string result. */
async function resolveSecretRefString(ref, options) {
	const resolved = await resolveSecretRefValue(ref, options);
	if (!isNonEmptyString(resolved)) throw new Error(`Secret reference "${ref.source}:${ref.provider}:${ref.id}" resolved to a non-string or empty value.`);
	return resolved;
}
//#endregion
export { isPluginIntegrationSecretProviderConfig as a, resolveSecretRefValuesSettledByProvider as i, resolveSecretRefValue as n, listSecretProviderIntegrationPresets as o, resolveSecretRefValues as r, resolveSecretProviderIntegrationConfig as s, resolveSecretRefString as t };
