import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries, y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { a as parseConcreteConfigPathWithProvenance, i as parseConcreteConfigPathTokens, o as toDotPath, r as parseConcreteConfigPath } from "./dot-path-BOSboevO.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { p as isValidEnvSecretRefId, s as coerceSecretRef, v as resolveSecretInputRef } from "./types.secrets-Bre8L6Ts.js";
import { n as containsEnvVarReference, r as resolveConfigEnvVars } from "./env-substitution-DXYJj0ec.js";
import { a as readFileDescriptorBoundedSync } from "./boundary-file-read-h_n3tTfV.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { f as resolveConfigPath, t as CONFIG_PATH } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure } from "./failure-output-CdUzE2dC.js";
import { Q as isConfigSetJsonParseOnly, Z as isConfigMachineOutput } from "./argv-CCdO9MSu.js";
import { a as writeRuntimeJson, o as writeRuntimeStdout, r as defaultRuntime, t as ExitError } from "./runtime-LRpY2Icg.js";
import { t as collectManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-DvssXFxG.js";
import { a as resolveAgentModelPrimaryValue, n as normalizeAgentModelRefForConfig } from "./model-input-ILUprkGk.js";
import { c as resolveAgentExplicitModelPrimary, u as resolveAgentModelFallbacksOverride } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, i as listAgentEntriesWithSource, n as hasAgentRosterProperty, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { L as collectUnsupportedSecretRefPolicyIssues, N as validateConfigObjectRawWithPlugins, it as AUTO_MANAGED_CONFIG_META_PATHS, l as readConfigFileSnapshotForWrite, rt as ConfigMutationConflictError, s as readConfigFileSnapshot, u as readConfigFileSnapshotWithPluginMetadata } from "./io-ClLVsBMp.js";
import { c as isValidSecretProviderAlias, f as secretRefKey, i as formatExecSecretRefIdValidationMessage, o as isValidExecSecretRefId, p as validateExecSecretRefId, s as isValidFileSecretRefId } from "./ref-contract-BHWY70rN.js";
import { T as SecretProviderSchema } from "./zod-schema.core-CTdpjCBO.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-DbjoXfPH.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { u as rejectConfigNonFiniteNumbers } from "./io.read-helpers-BfhrMUhR.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as normalizeConfigIssues, n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-DTfT89zD.js";
import { c as resolveConfigSecretTargetByPath, n as discoverConfigSecretTargets } from "./target-registry-query-DREoZp4g.js";
import "./target-registry-CGWcufp7.js";
import { n as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import { r as replaceConfigFile } from "./mutate-BjBakg7Z.js";
import "./config-B_0xOnKq.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { a as isPluginIntegrationSecretProviderConfig, n as resolveSecretRefValue, s as resolveSecretProviderIntegrationConfig } from "./resolve-DvvnAG2w.js";
import { a as success, n as info, o as warn, t as danger } from "./globals-GZNLg1ns.js";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint } from "./config-recovery-hints-szfrjhDU.js";
import { t as renderConfigValidationIssueLines } from "./issue-location-CeXXU4dq.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { n as redactConfigObject } from "./redact-snapshot-Cc1aNUFV.js";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.js";
import { a as isConfigSchemaPath, c as setAtPath, i as getAtPath, l as unsetAtPath, n as formatConfigSetPath, o as mergeAtPath, r as formatConfigUnsetMissingPathMessage, s as parseConfigSetValue, t as assertNonDestructiveReplacement, u as validatePathSegments } from "./config-cli-path-D0uGAN56.js";
import { r as readBestEffortRuntimeConfigSchema, t as buildRuntimeConfigSchemaFromRegistry } from "./runtime-schema-I9JI2U6_.js";
import { t as normalizeSubmittedConfigModelRefs } from "./model-input-normalization-f1-gJOo4.js";
import { t as diffConfigPaths } from "./config-diff-DoHIoE3G.js";
import { t as buildGatewayReloadPlan } from "./config-reload-plan-DBp_hJKw.js";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-q1wYjpRM.js";
import { n as setCommandJsonMode } from "./json-mode-BvX-XNl0.js";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import JSON5 from "json5";
//#region src/cli/config-set-input.ts
const CONFIG_MUTATION_FILE_MAX_BYTES = 8 * 1024 * 1024;
function readConfigMutationFileSync(filePath, sourceLabel) {
	let fd;
	try {
		fd = fs.openSync(filePath, "r");
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error(`${sourceLabel} not found: ${filePath}. Check the path and try again.`, { cause: error });
		throw error;
	}
	try {
		if (!fs.fstatSync(fd).isFile()) throw new Error(`${sourceLabel} must be a regular file: ${filePath}. Choose a JSON5 input file and try again.`);
		try {
			return readFileDescriptorBoundedSync(fd, CONFIG_MUTATION_FILE_MAX_BYTES).toString("utf8");
		} catch (error) {
			if (error instanceof RangeError) throw new RangeError(`${sourceLabel} exceeds the 8 MiB supported maximum (${CONFIG_MUTATION_FILE_MAX_BYTES} bytes): ${filePath}`, { cause: error });
			throw error;
		}
	} finally {
		fs.closeSync(fd);
	}
}
function hasBatchMode(opts) {
	return Boolean(normalizeOptionalString(opts.batchJson) || normalizeOptionalString(opts.batchFile));
}
function hasRefBuilderOptions(opts) {
	return Boolean(opts.refProvider || opts.refSource || opts.refId);
}
function hasProviderBuilderOptions(opts) {
	return Boolean(opts.providerSource || opts.providerAllowlist?.length || opts.providerPath || opts.providerMode || opts.providerTimeoutMs || opts.providerMaxBytes || opts.providerCommand || opts.providerArg?.length || opts.providerNoOutputTimeoutMs || opts.providerMaxOutputBytes || opts.providerJsonOnly || opts.providerEnv?.length || opts.providerPassEnv?.length || opts.providerTrustedDir?.length);
}
function parseJson5Raw(raw, label) {
	let parsed;
	try {
		parsed = JSON5.parse(raw);
	} catch (err) {
		throw new Error(`Failed to parse ${label}: ${String(err)}`, { cause: err });
	}
	rejectConfigNonFiniteNumbers(parsed);
	return parsed;
}
function parseBatchEntries(raw, sourceLabel) {
	const parsed = parseJson5Raw(raw, sourceLabel);
	if (!Array.isArray(parsed)) throw new Error(`${sourceLabel} must be a JSON array.`);
	if (parsed.length === 0) throw new Error(`${sourceLabel} must contain at least one config update.`);
	const out = [];
	for (const [index, entry] of parsed.entries()) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`${sourceLabel}[${index}] must be an object.`);
		const typed = entry;
		const path = normalizeOptionalString(typed.path) ?? "";
		if (!path) throw new Error(`${sourceLabel}[${index}].path is required.`);
		const hasValue = Object.hasOwn(typed, "value");
		const hasRef = Object.hasOwn(typed, "ref");
		const hasProvider = Object.hasOwn(typed, "provider");
		if (Number(hasValue) + Number(hasRef) + Number(hasProvider) !== 1) throw new Error(`${sourceLabel}[${index}] must include exactly one of: value, ref, provider.`);
		out.push({
			path,
			...hasValue ? { value: typed.value } : {},
			...hasRef ? { ref: typed.ref } : {},
			...hasProvider ? { provider: typed.provider } : {}
		});
	}
	return out;
}
function parseBatchSource(opts) {
	const batchJson = normalizeOptionalString(opts.batchJson);
	const batchFile = normalizeOptionalString(opts.batchFile);
	const hasInline = Boolean(batchJson);
	const hasFile = Boolean(batchFile);
	if (!hasInline && !hasFile) return null;
	if (hasInline && hasFile) throw new Error("Use either --batch-json or --batch-file, not both.");
	if (hasInline) return parseBatchEntries(batchJson, "--batch-json");
	const pathname = normalizeStringifiedOptionalString(opts.batchFile) ?? "";
	if (!pathname) throw new Error("--batch-file must not be empty.");
	return parseBatchEntries(readConfigMutationFileSync(pathname, "--batch-file"), "--batch-file");
}
//#endregion
//#region src/cli/config-set-parser.ts
/** Resolve the config-set input mode or return the exact flag-conflict error. */
function resolveConfigSetMode(params) {
	if (params.hasBatchMode) {
		if (params.hasRefBuilderOptions || params.hasProviderBuilderOptions) return {
			ok: false,
			error: "batch mode (--batch-json/--batch-file) cannot be combined with ref builder (--ref-*) or provider builder (--provider-*) flags."
		};
		return {
			ok: true,
			mode: "batch"
		};
	}
	if (params.hasRefBuilderOptions && params.hasProviderBuilderOptions) return {
		ok: false,
		error: "choose exactly one mode: ref builder (--ref-provider/--ref-source/--ref-id) or provider builder (--provider-*), not both."
	};
	if (params.hasRefBuilderOptions) return {
		ok: true,
		mode: "ref_builder"
	};
	if (params.hasProviderBuilderOptions) return {
		ok: true,
		mode: "provider_builder"
	};
	return {
		ok: true,
		mode: params.strictJson ? "json" : "value"
	};
}
//#endregion
//#region src/cli/config-cli-input.ts
const SECRET_PROVIDER_PATH_PREFIX = ["secrets", "providers"];
const CONFIG_PATCH_STDIN_MAX_BYTES = 1024 * 1024;
var ConfigSetDryRunValidationError = class extends Error {
	constructor(result) {
		super("config set dry-run validation failed");
		this.result = result;
		this.name = "ConfigSetDryRunValidationError";
	}
};
function modeError(message) {
	return /* @__PURE__ */ new Error(`config set mode error: ${message}`);
}
function configPatchModeError(message) {
	return /* @__PURE__ */ new Error(`config patch mode error: ${message}`);
}
function parseSecretRefSource(raw, label) {
	const source = raw.trim();
	if (source === "env" || source === "file" || source === "exec" || source === "store") return source;
	throw new Error(`${label} must be one of: env, file, exec, store.`);
}
function parseSecretRefBuilder(params) {
	const provider = params.provider.trim();
	if (!provider) throw new Error(`${params.fieldPrefix}.provider is required.`);
	if (!isValidSecretProviderAlias(provider)) throw new Error(`${params.fieldPrefix}.provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: "default").`);
	const source = parseSecretRefSource(params.source, `${params.fieldPrefix}.source`);
	const id = params.id.trim();
	if (!id) throw new Error(`${params.fieldPrefix}.id is required.`);
	if (source === "env" && !isValidEnvSecretRefId(id)) throw new Error(`${params.fieldPrefix}.id must match /^[A-Z][A-Z0-9_]{0,127}$/ for env refs.`);
	if (source === "store" && !isValidEnvSecretRefId(id)) throw new Error(`${params.fieldPrefix}.id must match /^[A-Z][A-Z0-9_]{0,127}$/ for store refs.`);
	if (source === "file" && !isValidFileSecretRefId(id)) throw new Error(`${params.fieldPrefix}.id must be an absolute JSON pointer (or "value" for singleValue mode).`);
	if (source === "exec" && !validateExecSecretRefId(id).ok) throw new Error(formatExecSecretRefIdValidationMessage());
	return {
		source,
		provider,
		id
	};
}
function parseOptionalPositiveInteger(raw, flag) {
	if (raw === void 0) return;
	const trimmed = raw.trim();
	if (!trimmed) throw new Error(`${flag} must not be empty.`);
	const parsed = parseStrictPositiveInteger(trimmed);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
function parseProviderEnvEntries(entries) {
	if (!entries || entries.length === 0) return;
	const env = {};
	for (const entry of entries) {
		const separator = entry.indexOf("=");
		if (separator <= 0) throw new Error("--provider-env expects KEY=*** entries.");
		const key = entry.slice(0, separator).trim();
		if (!key) throw new Error("--provider-env key must not be empty.");
		env[key] = entry.slice(separator + 1);
	}
	return Object.keys(env).length > 0 ? env : void 0;
}
function parseProviderAliasPath(path) {
	if (path.length !== 3 || path[0] !== SECRET_PROVIDER_PATH_PREFIX[0] || path[1] !== SECRET_PROVIDER_PATH_PREFIX[1]) throw new Error("Provider builder mode requires path \"secrets.providers.<alias>\" (example: secrets.providers.vault).");
	const alias = path[2] ?? "";
	if (!isValidSecretProviderAlias(alias)) throw new Error(`Provider alias "${alias}" must match /^[a-z][a-z0-9_-]{0,63}$/ (example: "default").`);
	return alias;
}
function buildProviderFromBuilder(opts) {
	const sourceRaw = opts.providerSource?.trim();
	if (!sourceRaw) throw new Error("--provider-source is required in provider builder mode.");
	const source = parseSecretRefSource(sourceRaw, "--provider-source");
	const timeoutMs = parseOptionalPositiveInteger(opts.providerTimeoutMs, "--provider-timeout-ms");
	const maxBytes = parseOptionalPositiveInteger(opts.providerMaxBytes, "--provider-max-bytes");
	const noOutputTimeoutMs = parseOptionalPositiveInteger(opts.providerNoOutputTimeoutMs, "--provider-no-output-timeout-ms");
	const maxOutputBytes = parseOptionalPositiveInteger(opts.providerMaxOutputBytes, "--provider-max-output-bytes");
	const providerEnv = parseProviderEnvEntries(opts.providerEnv);
	let provider;
	if (source === "env") {
		const allowlist = normalizeStringEntries(opts.providerAllowlist);
		for (const envName of allowlist) if (!isValidEnvSecretRefId(envName)) throw new Error(`--provider-allowlist entry "${envName}" must match /^[A-Z][A-Z0-9_]{0,127}$/.`);
		provider = {
			source: "env",
			...allowlist.length > 0 ? { allowlist } : {}
		};
	} else if (source === "file") {
		const filePath = opts.providerPath?.trim();
		if (!filePath) throw new Error("--provider-path is required when --provider-source file is used.");
		const modeRaw = opts.providerMode?.trim();
		if (modeRaw && modeRaw !== "singleValue" && modeRaw !== "json") throw new Error("--provider-mode must be one of: singleValue, json.");
		const mode = modeRaw === "singleValue" || modeRaw === "json" ? modeRaw : void 0;
		provider = {
			source: "file",
			path: filePath,
			...mode ? { mode } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...maxBytes !== void 0 ? { maxBytes } : {}
		};
	} else if (source === "store") provider = { source: "store" };
	else {
		const command = opts.providerCommand?.trim();
		if (!command) throw new Error("--provider-command is required when --provider-source exec is used.");
		provider = {
			source: "exec",
			command,
			...opts.providerArg?.length ? { args: opts.providerArg.map((entry) => entry.trim()) } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...maxOutputBytes !== void 0 ? { maxOutputBytes } : {},
			...opts.providerJsonOnly ? { jsonOnly: true } : {},
			...providerEnv ? { env: providerEnv } : {},
			...opts.providerPassEnv?.length ? { passEnv: normalizeStringEntries(opts.providerPassEnv) } : {},
			...opts.providerTrustedDir?.length ? { trustedDirs: normalizeStringEntries(opts.providerTrustedDir) } : {}
		};
	}
	const validated = SecretProviderSchema.safeParse(provider);
	if (!validated.success) {
		const issue = validated.error.issues[0];
		throw new Error(`Provider builder config invalid at ${issue?.path?.join(".") ?? "<provider>"}: ${issue?.message ?? "Invalid provider config."}`);
	}
	return validated.data;
}
function parseSecretRefFromUnknown(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object with source/provider/id.`);
	const candidate = value;
	if (typeof candidate.provider !== "string" || typeof candidate.source !== "string" || typeof candidate.id !== "string") throw new Error(`${label} must include string fields: source, provider, id.`);
	return parseSecretRefBuilder({
		provider: candidate.provider,
		source: candidate.source,
		id: candidate.id,
		fieldPrefix: label
	});
}
function parseProviderAliasFromTargetPath(path) {
	return path.length >= 3 && path[0] === "secrets" && path[1] === "providers" ? path[2] ?? null : null;
}
function touchesSecretProviderCollection$1(path) {
	return path.length === 1 && path[0] === "secrets" || path.length === 2 && path[0] === "secrets" && path[1] === "providers";
}
function touchesSecretDefaults(path) {
	return path.length === 1 && path[0] === "secrets" || path.length === 2 && path[0] === "secrets" && path[1] === "defaults";
}
function buildRefAssignmentOperation(params) {
	const resolved = resolveConfigSecretTargetByPath(params.requestedPath, params.pathTokens);
	if (resolved?.entry.secretShape === "sibling_ref" && resolved.refPathSegments) return {
		inputMode: params.inputMode,
		requestedPath: params.requestedPath,
		...params.pathTokens ? { pathTokens: params.pathTokens } : {},
		...params.quotedNumericSegments ? { quotedNumericSegments: params.quotedNumericSegments } : {},
		setPath: resolved.refPathSegments,
		value: params.ref,
		schemaValidated: true,
		touchedSecretTargetPath: formatConfigSetPath(resolved.pathSegments, params.pathTokens),
		assignedRef: params.ref,
		...resolved.providerId ? { touchedProviderAlias: resolved.providerId } : {}
	};
	return {
		inputMode: params.inputMode,
		requestedPath: params.requestedPath,
		...params.pathTokens ? { pathTokens: params.pathTokens } : {},
		...params.quotedNumericSegments ? { quotedNumericSegments: params.quotedNumericSegments } : {},
		setPath: params.requestedPath,
		value: params.ref,
		...resolved ? { schemaValidated: true } : {},
		touchedSecretTargetPath: formatConfigSetPath(resolved?.pathSegments ?? params.requestedPath, params.pathTokens),
		assignedRef: params.ref,
		...resolved?.providerId ? { touchedProviderAlias: resolved.providerId } : {}
	};
}
function buildValueAssignmentOperation(params) {
	const resolved = resolveConfigSecretTargetByPath(params.requestedPath, params.pathTokens);
	const providerAlias = parseProviderAliasFromTargetPath(params.requestedPath);
	const coercedRef = coerceSecretRef(params.value);
	return {
		inputMode: params.inputMode,
		requestedPath: params.requestedPath,
		...params.pathTokens ? { pathTokens: params.pathTokens } : {},
		...params.quotedNumericSegments ? { quotedNumericSegments: params.quotedNumericSegments } : {},
		setPath: coercedRef && resolved?.entry.secretShape === "sibling_ref" && resolved.refPathSegments ? resolved.refPathSegments : params.requestedPath,
		value: params.value,
		...resolved ? { touchedSecretTargetPath: formatConfigSetPath(resolved.pathSegments, params.pathTokens) } : {},
		...providerAlias ? { touchedProviderAlias: providerAlias } : {},
		...coercedRef ? { assignedRef: coercedRef } : {}
	};
}
function parseBatchOperations(entries) {
	return entries.map((entry, index) => {
		const { tokens: pathTokens, quotedNumericSegments } = parseConcreteConfigPathWithProvenance(entry.path);
		const path = pathTokens.map(String);
		if (entry.ref !== void 0) return buildRefAssignmentOperation({
			requestedPath: path,
			pathTokens,
			quotedNumericSegments,
			ref: parseSecretRefFromUnknown(entry.ref, `batch[${index}].ref`),
			inputMode: "json"
		});
		if (entry.provider !== void 0) {
			const alias = parseProviderAliasPath(path);
			const validated = SecretProviderSchema.safeParse(entry.provider);
			if (!validated.success) {
				const issue = validated.error.issues[0];
				throw new Error(`batch[${index}].provider invalid at ${issue?.path?.join(".") ?? "<provider>"}: ${issue?.message ?? ""}`);
			}
			return {
				inputMode: "json",
				requestedPath: path,
				pathTokens,
				quotedNumericSegments,
				setPath: path,
				value: validated.data,
				schemaValidated: true,
				touchedProviderAlias: alias
			};
		}
		return buildValueAssignmentOperation({
			requestedPath: path,
			pathTokens,
			quotedNumericSegments,
			value: entry.value,
			inputMode: "json"
		});
	});
}
function buildSingleSetOperations(params) {
	const pathProvided = typeof params.path === "string" && params.path.trim().length > 0;
	const parsedConcretePath = pathProvided ? parseConcreteConfigPathWithProvenance(params.path) : null;
	const pathTokens = parsedConcretePath?.tokens ?? null;
	const parsedPath = pathTokens?.map(String) ?? null;
	const strictJson = Boolean(params.opts.strictJson || params.opts.json);
	const modeResolution = resolveConfigSetMode({
		hasBatchMode: false,
		hasRefBuilderOptions: hasRefBuilderOptions(params.opts),
		hasProviderBuilderOptions: hasProviderBuilderOptions(params.opts),
		strictJson
	});
	if (!modeResolution.ok) throw modeError(modeResolution.error);
	if (modeResolution.mode === "ref_builder") {
		if (!pathProvided || !parsedPath) throw modeError("ref builder mode requires <path>.");
		if (params.value !== void 0) throw modeError("ref builder mode does not accept <value>.");
		if (!params.opts.refProvider || !params.opts.refSource || !params.opts.refId) throw modeError("ref builder mode requires --ref-provider <alias>, --ref-source <env|file|exec|store>, and --ref-id <id>.");
		return [buildRefAssignmentOperation({
			requestedPath: parsedPath,
			pathTokens: pathTokens ?? void 0,
			quotedNumericSegments: parsedConcretePath?.quotedNumericSegments,
			ref: parseSecretRefBuilder({
				provider: params.opts.refProvider,
				source: params.opts.refSource,
				id: params.opts.refId,
				fieldPrefix: "ref"
			}),
			inputMode: "builder"
		})];
	}
	if (modeResolution.mode === "provider_builder") {
		if (!pathProvided || !parsedPath) throw modeError("provider builder mode requires <path>.");
		if (params.value !== void 0) throw modeError("provider builder mode does not accept <value>.");
		return [{
			inputMode: "builder",
			requestedPath: parsedPath,
			...pathTokens ? { pathTokens } : {},
			...parsedConcretePath ? { quotedNumericSegments: parsedConcretePath.quotedNumericSegments } : {},
			setPath: parsedPath,
			value: buildProviderFromBuilder(params.opts),
			schemaValidated: true,
			touchedProviderAlias: parseProviderAliasPath(parsedPath)
		}];
	}
	if (!pathProvided || !parsedPath) throw modeError("value/json mode requires <path> when batch mode is not used.");
	if (params.value === void 0) throw modeError("value/json mode requires <value>.");
	return [buildValueAssignmentOperation({
		requestedPath: parsedPath,
		pathTokens: pathTokens ?? void 0,
		quotedNumericSegments: parsedConcretePath?.quotedNumericSegments,
		value: parseConfigSetValue(params.value, strictJson),
		inputMode: modeResolution.mode === "json" ? "json" : "value"
	})];
}
function buildConfigSetOperations(params) {
	return params.batchEntries ? parseBatchOperations(params.batchEntries) : buildSingleSetOperations(params);
}
async function readStdinText() {
	if (process.stdin.isTTY) throw configPatchModeError("--stdin refuses to read from an interactive terminal; pipe input or use --file <path>.");
	process.stdin.setEncoding("utf8");
	return (await readByteStreamWithLimit(process.stdin, {
		maxBytes: CONFIG_PATCH_STDIN_MAX_BYTES,
		onOverflow: ({ maxBytes }) => configPatchModeError(`--stdin input exceeds ${maxBytes} bytes; use --file <path> for larger patches.`)
	})).toString("utf8");
}
async function readConfigPatchInput(opts) {
	const file = normalizeOptionalString(opts.file);
	const stdin = Boolean(opts.stdin);
	if (Boolean(file) === stdin) throw configPatchModeError("provide exactly one of --file <path> or --stdin.");
	const sourceLabel = stdin ? "--stdin" : "--file";
	let raw;
	if (stdin) raw = await readStdinText();
	else raw = readConfigMutationFileSync(file, "--file");
	let parsed;
	try {
		parsed = JSON5.parse(raw);
	} catch (err) {
		throw new Error(`Failed to parse ${sourceLabel} as JSON5: ${String(err)}`, { cause: err });
	}
	rejectConfigNonFiniteNumbers(parsed);
	return parsed;
}
function buildDeleteOperation(path) {
	return {
		inputMode: "json",
		requestedPath: path,
		setPath: path,
		value: void 0,
		mutation: "delete"
	};
}
function buildUnsetOperation(path, pathTokens) {
	const resolved = resolveConfigSecretTargetByPath(path, pathTokens);
	const providerAlias = parseProviderAliasFromTargetPath(path);
	return {
		inputMode: "unset",
		requestedPath: path,
		...pathTokens ? { pathTokens } : {},
		setPath: path,
		value: void 0,
		mutation: "delete",
		...touchesSecretProviderCollection$1(path) || touchesSecretDefaults(path) ? { touchesAllSecretRefs: true } : {},
		...resolved ? { touchedSecretTargetPath: formatConfigSetPath(resolved.pathSegments, pathTokens) } : {},
		...providerAlias ? { touchedProviderAlias: providerAlias } : {}
	};
}
function buildApplyValueOperation(params) {
	return {
		...(isRecord(params.value) ? coerceSecretRef(params.value) : null) ? buildRefAssignmentOperation({
			requestedPath: params.path,
			ref: parseSecretRefFromUnknown(params.value, `patch.${toDotPath(params.path)}`),
			inputMode: "json"
		}) : buildValueAssignmentOperation({
			requestedPath: params.path,
			value: params.value,
			inputMode: "json"
		}),
		...params.mutation ? { mutation: params.mutation } : {}
	};
}
function buildConfigPatchOperations(params) {
	if (!isRecord(params.patch)) throw configPatchModeError("input must be a JSON5 object patch.");
	const operations = [];
	const pathKey = (path) => JSON.stringify(path);
	const replacePathKeys = new Set(params.replacePaths.map(pathKey));
	const matchedReplacePathKeys = /* @__PURE__ */ new Set();
	const visit = (value, path) => {
		validatePathSegments(path);
		const replacementKey = pathKey(path);
		if (path.length > 0 && replacePathKeys.has(replacementKey)) {
			matchedReplacePathKeys.add(replacementKey);
			operations.push(value === null ? buildDeleteOperation(path) : buildApplyValueOperation({
				path,
				value,
				mutation: "replace"
			}));
			return;
		}
		if (path.length > 0 && value === null) {
			operations.push(buildDeleteOperation(path));
			return;
		}
		if (path.length > 0 && isRecord(value) && coerceSecretRef(value)) {
			operations.push(buildApplyValueOperation({
				path,
				value
			}));
			return;
		}
		if (isRecord(value)) {
			if (path.length > 0 && Object.keys(value).length === 0) {
				operations.push(buildApplyValueOperation({
					path,
					value,
					mutation: "merge"
				}));
				return;
			}
			for (const [key, child] of Object.entries(value)) visit(child, [...path, key]);
			return;
		}
		if (path.length === 0) throw configPatchModeError("input must contain at least one config key.");
		operations.push(buildApplyValueOperation({
			path,
			value
		}));
	};
	visit(params.patch, []);
	const unusedReplacePath = params.replacePaths.find((path) => !matchedReplacePathKeys.has(pathKey(path)));
	if (unusedReplacePath) throw configPatchModeError(`--replace-path ${toDotPath(unusedReplacePath)} did not match any value in the input patch.`);
	if (operations.length === 0) throw configPatchModeError("input patch did not contain any config updates.");
	return operations;
}
async function readConfigPatchOperations(opts) {
	return buildConfigPatchOperations({
		patch: await readConfigPatchInput(opts),
		replacePaths: (opts.replacePath ?? []).map(parseConcreteConfigPath)
	});
}
function formatPluginInstallConfigSetError() {
	return [
		"plugins.installs is managed by the plugin index and cannot be edited with config set.",
		"",
		"Use plugin commands instead:",
		`  ${formatCliCommand("openclaw plugins install <spec>")}`,
		`  ${formatCliCommand("openclaw plugins update <plugin-id>")}`,
		`  ${formatCliCommand("openclaw plugins uninstall <plugin-id>")}`
	].join("\n");
}
//#endregion
//#region src/cli/config-cli-model-normalization.ts
function normalizeConfigMutationModelRefs(cfg) {
	return normalizeSubmittedConfigModelRefs(cfg, collectManifestModelIdNormalizationPolicies(loadPluginMetadataSnapshot({
		config: cfg,
		env: process.env
	}).plugins));
}
function normalizeConfigMutationExplicitSetPath(path) {
	const modelKeyIndex = path[0] === "agents" && path[1] === "defaults" && path[2] === "models" ? 3 : path[0] === "agents" && (path[1] === "entries" || path[1] === "list") && path[3] === "models" ? 4 : void 0;
	if (modelKeyIndex !== void 0 && path.length > modelKeyIndex) {
		const modelId = expectDefined(path[modelKeyIndex], `path entry at ${modelKeyIndex}`);
		const normalizedModelId = normalizeAgentModelRefForConfig(modelId);
		return normalizedModelId === modelId ? path : [
			...path.slice(0, modelKeyIndex),
			normalizedModelId,
			...path.slice(modelKeyIndex + 1)
		];
	}
	return path;
}
//#endregion
//#region src/cli/config-cli-validation.ts
function formatInvalidConfigRepairHint(snapshot, doctorMessage) {
	return isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? formatPluginPackagingRuntimeOutputRecoveryHint() : `Run \`${formatCliCommand("openclaw doctor --fix")}\` ${doctorMessage}`;
}
function ensureValidConfigSnapshotForCli(snapshot, runtime, options = {}) {
	if (snapshot.valid) return true;
	if (options.json) {
		writeRuntimeJson(runtime, {
			...formatCliJsonFailure(`OpenClaw config is invalid: ${shortenHomePath(snapshot.path)}`),
			issues: normalizeConfigIssues(snapshot.issues)
		});
		runtime.exit(1);
		return false;
	}
	runtime.error(`OpenClaw config is invalid: ${shortenHomePath(snapshot.path)}`);
	for (const line of renderConfigValidationIssueLines(snapshot)) runtime.error(line);
	runtime.error(formatInvalidConfigRepairHint(snapshot, "to repair, then retry."));
	runtime.exit(1);
	return false;
}
async function loadValidConfig(runtime = defaultRuntime, options = {}) {
	const snapshot = options.observe === false ? await readConfigFileSnapshot({ observe: false }) : await readConfigFileSnapshot();
	ensureValidConfigSnapshotForCli(snapshot, runtime, options);
	return snapshot;
}
async function loadValidConfigForWrite(runtime = defaultRuntime) {
	const prepared = await readConfigFileSnapshotForWrite();
	ensureValidConfigSnapshotForCli(prepared.snapshot, runtime);
	return prepared;
}
function strictlyValidateConfigSnapshotForCli(snapshot, pluginMetadataSnapshot) {
	if (!snapshot.valid) return snapshot;
	const validated = validateConfigObjectRawWithPlugins(snapshot.sourceConfig, {
		semanticValidation: "strict",
		pluginMetadataSnapshot
	});
	return validated.ok ? snapshot : {
		...snapshot,
		valid: false,
		issues: validated.issues
	};
}
function collectSecretRefsFromUnknown(value) {
	const refs = [];
	const visit = (candidate) => {
		const ref = coerceSecretRef(candidate);
		if (ref) {
			refs.push(ref);
			return;
		}
		if (Array.isArray(candidate)) candidate.forEach(visit);
		else if (isRecord(candidate)) Object.values(candidate).forEach(visit);
	};
	visit(value);
	return refs;
}
function collectDryRunRefs(params) {
	const refsByKey = /* @__PURE__ */ new Map();
	const targetPaths = /* @__PURE__ */ new Set();
	const providerAliases = /* @__PURE__ */ new Set();
	let includeAllDiscoveredRefs = false;
	for (const operation of params.operations) {
		if (operation.assignedRef) refsByKey.set(secretRefKey(operation.assignedRef), operation.assignedRef);
		for (const ref of collectSecretRefsFromUnknown(operation.value)) refsByKey.set(secretRefKey(ref), ref);
		if (operation.touchedSecretTargetPath) targetPaths.add(operation.touchedSecretTargetPath);
		if (operation.touchedProviderAlias) providerAliases.add(operation.touchedProviderAlias);
		includeAllDiscoveredRefs ||= operation.touchesAllSecretRefs === true;
	}
	if (!includeAllDiscoveredRefs && targetPaths.size === 0 && providerAliases.size === 0) return [...refsByKey.values()];
	const defaults = params.config.secrets?.defaults;
	for (const target of discoverConfigSecretTargets(params.config)) {
		const { ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults
		});
		if (ref && (includeAllDiscoveredRefs || targetPaths.has(target.path) || providerAliases.has(ref.provider))) refsByKey.set(secretRefKey(ref), ref);
	}
	return [...refsByKey.values()];
}
async function collectDryRunResolvabilityErrors(params) {
	const failures = [];
	for (const ref of params.refs) try {
		await resolveSecretRefValue(ref, {
			config: params.config,
			env: process.env
		});
	} catch (err) {
		failures.push({
			kind: "resolvability",
			message: formatErrorMessage(err),
			ref: `${ref.source}:${ref.provider}:${ref.id}`
		});
	}
	return failures;
}
function collectDryRunStaticErrorsForSkippedExecRefs(params) {
	const failures = [];
	for (const ref of params.refs) {
		const id = ref.id.trim();
		const refLabel = `${ref.source}:${ref.provider}:${id}`;
		if (!id) {
			failures.push({
				kind: "resolvability",
				message: "Error: Secret reference id is empty.",
				ref: refLabel
			});
			continue;
		}
		if (!isValidExecSecretRefId(id)) {
			failures.push({
				kind: "resolvability",
				message: `Error: ${formatExecSecretRefIdValidationMessage()} (ref: ${refLabel}).`,
				ref: refLabel
			});
			continue;
		}
		const providerConfig = params.config.secrets?.providers?.[ref.provider];
		if (!providerConfig) {
			failures.push({
				kind: "resolvability",
				message: `Error: Secret provider "${ref.provider}" is not configured (ref: ${refLabel}).`,
				ref: refLabel
			});
			continue;
		}
		if (providerConfig.source !== ref.source) failures.push({
			kind: "resolvability",
			message: `Error: Secret provider "${ref.provider}" has source "${providerConfig.source}" but ref requests "${ref.source}".`,
			ref: refLabel
		});
	}
	return failures;
}
function selectDryRunRefsForResolution(params) {
	const refsToResolve = [];
	const skippedExecRefs = [];
	for (const ref of params.refs) (ref.source === "exec" && !params.allowExecInDryRun ? skippedExecRefs : refsToResolve).push(ref);
	return {
		refsToResolve,
		skippedExecRefs
	};
}
function collectStrictConfigErrors(config, pluginMetadataSnapshot) {
	const validated = validateConfigObjectRawWithPlugins(config, {
		semanticValidation: "strict",
		pluginMetadataSnapshot
	});
	if (validated.ok) return [];
	return formatConfigIssueLines(validated.issues, "-", { normalizeRoot: true }).map((message) => ({
		kind: "schema",
		message
	}));
}
function assertStrictConfigForMutation(config, pluginMetadataSnapshot) {
	const errors = collectStrictConfigErrors(config, pluginMetadataSnapshot);
	if (errors.length === 0) return;
	throw new Error(["Config validation failed.", ...errors.map((error) => `- ${error.message}`)].join("\n"));
}
function collectDryRunSchemaErrors(config, pluginMetadataSnapshot) {
	return collectStrictConfigErrors(config, pluginMetadataSnapshot);
}
function touchesSecretProviderCollection(path) {
	return path.length === 1 && path[0] === "secrets" || path.length === 2 && path[0] === "secrets" && path[1] === "providers";
}
function collectPluginIntegrationProviderErrors(params) {
	const providers = params.config.secrets?.providers ?? {};
	let validateAllProviders = false;
	const touchedProviderAliases = /* @__PURE__ */ new Set();
	for (const operation of params.operations) {
		if (operation.touchedProviderAlias) touchedProviderAliases.add(operation.touchedProviderAlias);
		if (operation.assignedRef) touchedProviderAliases.add(operation.assignedRef.provider);
		for (const ref of collectSecretRefsFromUnknown(operation.value)) touchedProviderAliases.add(ref.provider);
		validateAllProviders ||= touchesSecretProviderCollection(operation.setPath);
	}
	if (!validateAllProviders && touchedProviderAliases.size === 0) return [];
	const integrationProviders = [];
	for (const [alias, provider] of Object.entries(providers)) if ((validateAllProviders || touchedProviderAliases.has(alias)) && isPluginIntegrationSecretProviderConfig(provider)) integrationProviders.push({
		alias,
		provider
	});
	if (integrationProviders.length === 0) return [];
	const manifestRegistry = loadPluginMetadataSnapshot({
		config: params.config,
		env: process.env
	}).manifestRegistry;
	const errors = [];
	for (const { alias, provider } of integrationProviders) {
		const resolved = resolveSecretProviderIntegrationConfig({
			manifestRegistry,
			providerAlias: alias,
			providerConfig: provider,
			config: params.config,
			env: process.env
		});
		if (!resolved.ok) errors.push({
			kind: "schema",
			message: `secrets.providers.${alias}: ${resolved.reason}`
		});
	}
	return errors;
}
function dedupeDryRunErrors(errors) {
	const deduped = [];
	const seen = /* @__PURE__ */ new Set();
	for (const error of errors) {
		const key = error.kind === "resolvability" ? `${error.kind}\u0000${error.ref ?? ""}\u0000${error.message}` : `${error.kind}\u0000${error.message}`;
		if (!seen.has(key)) {
			seen.add(key);
			deduped.push(error);
		}
	}
	return deduped;
}
function formatDryRunFailureMessage(params) {
	const missingPathErrors = params.errors.filter((error) => error.kind === "missing-path");
	const schemaErrors = params.errors.filter((error) => error.kind === "schema");
	const resolveErrors = params.errors.filter((error) => error.kind === "resolvability");
	const modelErrors = params.errors.filter((error) => error.kind === "model");
	const lines = missingPathErrors.map((error) => error.message);
	if (schemaErrors.length > 0) lines.push("Dry run failed: config schema validation failed.", ...schemaErrors.map((error) => `- ${error.message}`));
	if (resolveErrors.length > 0) {
		lines.push(`Dry run failed: ${resolveErrors.length} SecretRef assignment(s) could not be resolved.`, ...resolveErrors.slice(0, 5).map((error) => `- ${error.ref ?? "<unknown-ref>"} -> ${error.message}`));
		if (resolveErrors.length > 5) lines.push(`- ... ${resolveErrors.length - 5} more`);
	}
	if (modelErrors.length > 0) lines.push("Dry run failed: model reference validation failed.", ...modelErrors.map((error) => `- ${error.message}`));
	if (params.skippedExecRefs > 0) lines.push(`Dry run note: skipped ${params.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during dry-run.`);
	return lines.join("\n");
}
//#endregion
//#region src/cli/config-model-validation.ts
function isPathPrefix(prefix, path) {
	return prefix.length <= path.length && prefix.every((segment, index) => path[index] === segment);
}
function collectTextModelConfigRefs(params) {
	if (typeof params.model === "string") {
		const value = params.model.trim();
		return [{
			path: params.path,
			value,
			...params.agentId ? { agentId: params.agentId } : {},
			fallback: false
		}];
	}
	if (!params.model || typeof params.model !== "object" || Array.isArray(params.model)) return [];
	const model = params.model;
	const refs = [];
	if (typeof model.primary === "string") {
		const value = model.primary.trim();
		refs.push({
			path: `${params.path}.primary`,
			value,
			...params.agentId ? { agentId: params.agentId } : {},
			fallback: false
		});
	}
	if (Array.isArray(model.fallbacks)) for (const [index, fallback] of model.fallbacks.entries()) {
		if (typeof fallback !== "string") continue;
		refs.push({
			path: `${params.path}.fallbacks.${index}`,
			value: fallback.trim(),
			...params.agentId ? { agentId: params.agentId } : {},
			fallback: true
		});
	}
	return refs;
}
function collectTextModelRefs(config) {
	const refs = collectTextModelConfigRefs({
		model: config.agents?.defaults?.model,
		path: "agents.defaults.model"
	});
	for (const { entry: agent, source } of listAgentEntriesWithSource(config)) {
		const agentId = agent.id;
		const agentPath = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		refs.push(...collectTextModelConfigRefs({
			model: agent.model,
			path: `${agentPath}.model`,
			agentId
		}));
	}
	for (const ref of refs) {
		if (ref.fallback) continue;
		const authProfileId = splitTrailingAuthProfile(ref.value).profile;
		if (authProfileId) ref.authProfileId = authProfileId;
	}
	return refs;
}
function modelRefComparisonKey(ref) {
	if (ref.agentId) {
		const modelOffset = ref.path.indexOf(".model");
		const relativePath = modelOffset >= 0 ? ref.path.slice(modelOffset + 1) : ref.path;
		return `agent:${normalizeAgentId(ref.agentId)}:${relativePath}`;
	}
	return `path:${ref.path}`;
}
function collectTouchedTextModelRefs(params) {
	const listedAgentEntries = listAgentEntriesWithSource(params.config);
	const defaultPrimaryPath = [
		"agents",
		"defaults",
		"model",
		"primary"
	];
	const defaultPrimaryTouched = params.touchedPaths.some((touchedPath) => isPathPrefix(touchedPath, defaultPrimaryPath) || isPathPrefix(defaultPrimaryPath, touchedPath));
	const refs = collectTextModelRefs(params.config);
	const previousRefs = params.previousConfig ? collectTextModelRefs(params.previousConfig) : void 0;
	const previousRefsByIdentity = previousRefs ? new Map(previousRefs.map((ref) => [modelRefComparisonKey(ref), ref])) : void 0;
	const previousDefaultAgentId = params.previousConfig ? tryResolveLegacyCompatibilityAgentId(params.previousConfig) : void 0;
	const defaultPrimaryProviderChanged = defaultPrimaryTouched && (!previousRefs || previousDefaultAgentId === void 0 || resolveDefaultModelForAgent({ cfg: params.config }).provider !== resolveDefaultModelForAgent({
		cfg: params.previousConfig,
		agentId: previousDefaultAgentId
	}).provider);
	const touchedRefs = refs.filter((ref) => {
		if (ref.fallback && defaultPrimaryProviderChanged) {
			const previousRef = previousRefsByIdentity?.get(modelRefComparisonKey(ref));
			const nextResolved = resolveCanonicalFallbackRef(params.config, ref.value);
			const previousResolved = params.previousConfig && previousRef ? resolveCanonicalFallbackRef(params.previousConfig, previousRef.value) : void 0;
			if (!nextResolved || !previousResolved || nextResolved.provider !== previousResolved.provider || nextResolved.model !== previousResolved.model) {
				ref.dependency = true;
				return true;
			}
		}
		const refPath = ref.path.split(".");
		const touched = params.touchedPaths.some((touchedPath) => isPathPrefix(touchedPath, refPath) || isPathPrefix(refPath, touchedPath));
		if (!touched || !previousRefsByIdentity) return touched;
		const previousRef = previousRefsByIdentity.get(modelRefComparisonKey(ref));
		const ownerChanged = previousRef?.agentId !== ref.agentId;
		if (ownerChanged) ref.dependency = true;
		return previousRef?.value !== ref.value || ownerChanged;
	});
	const defaultRefs = refs.filter((ref) => ref.agentId === void 0);
	if (defaultRefs.length === 0) return touchedRefs;
	for (const { entry, source } of listedAgentEntries) {
		const agentId = entry.id;
		const agentEntryPath = [
			"agents",
			source.kind,
			source.kind === "entries" ? source.key : String(source.index)
		];
		const agentModelPath = [...agentEntryPath, "model"];
		if (!params.touchedPaths.some((touchedPath) => isPathPrefix(touchedPath, agentEntryPath) || isPathPrefix(agentEntryPath, touchedPath) || isPathPrefix(touchedPath, agentModelPath) || isPathPrefix(agentModelPath, touchedPath))) continue;
		for (const defaultRef of defaultRefs) {
			const inherits = defaultRef.fallback ? resolveAgentModelFallbacksOverride(params.config, agentId) === void 0 : resolveAgentExplicitModelPrimary(params.config, agentId) === void 0;
			const previouslyInherited = (params.previousConfig ? listAgentEntries(params.previousConfig) : []).some((previousEntry) => normalizeAgentId(previousEntry.id) === normalizeAgentId(agentId)) && params.previousConfig ? defaultRef.fallback ? resolveAgentModelFallbacksOverride(params.previousConfig, agentId) === void 0 : resolveAgentExplicitModelPrimary(params.previousConfig, agentId) === void 0 : false;
			if (inherits && !previouslyInherited) touchedRefs.push({
				...defaultRef,
				agentId,
				dependency: true
			});
		}
	}
	return touchedRefs;
}
function resolveCanonicalPrimaryRef(config, value) {
	const resolved = resolveConfiguredModelRef({
		cfg: {
			...config,
			agents: {
				...config.agents,
				defaults: {
					...config.agents?.defaults,
					model: value
				}
			}
		},
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: "",
		allowPluginNormalization: true
	});
	return resolved.model ? resolved : void 0;
}
function resolveFallbackRef(config, value) {
	const defaultProvider = resolveDefaultModelForAgent({ cfg: config }).provider;
	return resolveModelRefFromString({
		cfg: config,
		raw: value,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg: config,
			defaultProvider,
			allowPluginNormalization: true
		}),
		allowPluginNormalization: true
	});
}
function resolveCanonicalFallbackRef(config, value) {
	return resolveFallbackRef(config, value)?.ref;
}
function hasUnresolvedInheritedFallbackProvider(config, ref, unresolvedPaths) {
	if (!ref.fallback || ref.value.includes("/") || !unresolvedPaths.has("agents.defaults.model") && !unresolvedPaths.has("agents.defaults.model.primary")) return false;
	const primary = resolveAgentModelPrimaryValue(config.agents?.defaults?.model);
	if (!primary) return false;
	const primaryModel = splitTrailingAuthProfile(primary).model;
	const slash = primaryModel.indexOf("/");
	const provider = slash > 0 ? primaryModel.slice(0, slash) : primaryModel;
	const fallback = resolveFallbackRef(config, ref.value);
	return Boolean(fallback && !fallback.alias && containsEnvVarReference(provider));
}
function expandInheritedDefaultRefs(config, refs) {
	const agentEntries = listAgentEntries(config);
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const expanded = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (ref) => {
		const key = `${ref.path}\u0000${ref.agentId ?? ""}`;
		if (!seen.has(key)) {
			seen.add(key);
			expanded.push(ref);
		}
	};
	for (const ref of refs) {
		if (ref.agentId !== void 0) {
			push(ref);
			continue;
		}
		if (defaultAgentId) {
			if (!agentEntries.some((entry) => normalizeAgentId(entry.id) === normalizeAgentId(defaultAgentId)) || (ref.fallback ? resolveAgentModelFallbacksOverride(config, defaultAgentId) === void 0 : resolveAgentExplicitModelPrimary(config, defaultAgentId) === void 0)) push(ref);
		}
		for (const { id: agentId } of agentEntries) {
			if (defaultAgentId && normalizeAgentId(agentId) === normalizeAgentId(defaultAgentId)) continue;
			if (ref.fallback ? resolveAgentModelFallbacksOverride(config, agentId) === void 0 : resolveAgentExplicitModelPrimary(config, agentId) === void 0) push({
				...ref,
				agentId
			});
		}
	}
	return expanded;
}
function modelRefEnvSourcePath(path) {
	return path.replace(/\.list\.(\d+)/u, ".list[$1]").replace(/\.fallbacks\.(\d+)$/u, ".fallbacks[$1]");
}
function validateModelRefSyntax(config, ref, unresolvedPaths) {
	if (!ref.value) return "Model reference is empty";
	if (unresolvedPaths.has(modelRefEnvSourcePath(ref.path))) return "Model reference contains an unresolved environment variable";
	return (ref.fallback ? resolveCanonicalFallbackRef(config, ref.value) : resolveCanonicalPrimaryRef(config, ref.value)) ? void 0 : "Invalid model reference or configured model alias target";
}
async function createRuntimeModelRefResolver() {
	const [agentScope, modelSelection] = await Promise.all([import("./agent-scope-WWPxWnDc.js"), import("./model-selection-nNBRo-Pm.js")]);
	const preparedByAgent = /* @__PURE__ */ new Map();
	let modelModules;
	const loadModelModules = () => modelModules ??= Promise.all([import("./model-C8oBhdcb.js"), import("./prepared-model-catalog-CiP0KTjK.js")]);
	return async ({ config, ref }) => {
		const resolvedRef = ref.fallback ? resolveCanonicalFallbackRef(config, ref.value) : resolveCanonicalPrimaryRef(config, ref.value);
		if (!resolvedRef) return `Unknown model: ${ref.value}`;
		if (modelSelection.isCliProvider(resolvedRef.provider, config)) return;
		const targetAgentId = ref.agentId ?? agentScope.tryResolveLegacyCompatibilityAgentId(config) ?? agentScope.resolveDefaultAgentId(config);
		const agentDir = agentScope.resolveAgentDir(config, targetAgentId);
		const workspaceDir = agentScope.resolveAgentWorkspaceDir(config, targetAgentId);
		const [modelRuntime, preparedCatalog] = await loadModelModules();
		let prepared = preparedByAgent.get(targetAgentId);
		if (!prepared) {
			prepared = await preparedCatalog.loadPreparedModelCatalogOwnerSnapshot({
				agentId: targetAgentId,
				agentDir,
				config,
				readOnly: true,
				workspaceDir
			});
			preparedByAgent.set(targetAgentId, prepared);
		}
		const stores = prepared.createStores();
		const resolution = await modelRuntime.resolveModelAsync(resolvedRef.provider, resolvedRef.model, agentDir, config, {
			agentId: targetAgentId,
			allowBundledStaticCatalogFallback: true,
			authStorage: stores.authStorage,
			...ref.authProfileId ? { authProfileId: ref.authProfileId } : {},
			modelRegistry: stores.modelRegistry,
			preparedModelRuntime: prepared,
			workspaceDir
		});
		return resolution.model ? void 0 : resolution.error ?? `Unknown model: ${resolvedRef.provider}/${resolvedRef.model}`;
	};
}
function formatModelRefError(ref, error, authoredValue = ref.value, options) {
	const safeError = options?.suppressDetail || authoredValue !== ref.value ? "Unable to resolve authored model reference" : error;
	const detail = safeError.endsWith(".") ? safeError : `${safeError}.`;
	return `Cannot set model reference "${authoredValue}" at ${ref.path}: ${detail} Run ${formatCliCommand("openclaw models list")} to list available models.`;
}
async function checkTouchedTextModelRefs(params) {
	const config = hasAgentRosterProperty(params.config) ? params.config : migratePersistedImplicitMainRoster(params.config).config;
	const previousConfig = params.previousConfig && !hasAgentRosterProperty(params.previousConfig) ? migratePersistedImplicitMainRoster(params.previousConfig).config : params.previousConfig;
	const authoredRefs = collectTouchedTextModelRefs({
		...params,
		config,
		previousConfig
	});
	const authoredValuesByPath = new Map(collectTextModelRefs(params.config).map((ref) => [ref.path, ref.value]));
	const previousAuthoredValuesByPath = new Map(collectTextModelRefs(params.previousConfig ?? {}).map((ref) => [ref.path, ref.value]));
	let validationConfig;
	let validationPreviousConfig;
	const unresolvedPaths = /* @__PURE__ */ new Set();
	try {
		const env = params.env ?? process.env;
		validationConfig = resolveConfigEnvVars(params.config, env, { onMissing: ({ configPath }) => unresolvedPaths.add(configPath) });
		validationPreviousConfig = params.previousConfig ? resolveConfigEnvVars(params.previousConfig, env, { onMissing: () => {} }) : void 0;
	} catch (cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		return {
			refsChecked: 0,
			refsTotal: authoredRefs.length,
			errors: [`Unable to validate changed model references before writing: ${detail}`]
		};
	}
	const validationValuesByPath = new Map(collectTextModelRefs(validationConfig).map((ref) => [ref.path, ref.value]));
	const modelEnvWasExpanded = [...authoredValuesByPath].some(([path, value]) => validationValuesByPath.get(path) !== value);
	const formatError = (ref, error) => {
		const redactDependency = Boolean(params.redactDependencyValues && ref.dependency);
		return formatModelRefError(ref, error, redactDependency ? "<configured model reference>" : authoredValuesByPath.get(ref.path), { suppressDetail: modelEnvWasExpanded || redactDependency });
	};
	const validationRefsByPath = new Map(collectTextModelRefs(validationConfig).map((ref) => [ref.path, ref]));
	const validationRosterConfig = hasAgentRosterProperty(validationConfig) ? validationConfig : migratePersistedImplicitMainRoster(validationConfig).config;
	const validationPreviousRosterConfig = validationPreviousConfig && !hasAgentRosterProperty(validationPreviousConfig) ? migratePersistedImplicitMainRoster(validationPreviousConfig).config : validationPreviousConfig;
	const refsByKey = new Map(collectTouchedTextModelRefs({
		config: validationRosterConfig,
		previousConfig: validationPreviousRosterConfig,
		touchedPaths: params.touchedPaths
	}).map((ref) => [modelRefComparisonKey(ref), ref]));
	for (const authoredRef of authoredRefs) {
		if (authoredRef.dependency && previousAuthoredValuesByPath.get(authoredRef.path) === authoredRef.value) continue;
		const validationRef = validationRefsByPath.get(authoredRef.path);
		if (!validationRef) continue;
		const key = modelRefComparisonKey(validationRef);
		const expandedRef = refsByKey.get(key);
		refsByKey.set(key, {
			...validationRef,
			...authoredRef.dependency || expandedRef?.dependency ? { dependency: true } : {}
		});
	}
	const refs = expandInheritedDefaultRefs(validationRosterConfig, [...refsByKey.values()]);
	if (refs.length === 0) return {
		refsChecked: 0,
		refsTotal: 0,
		errors: []
	};
	const validatedRefs = refs.filter((ref) => !hasUnresolvedInheritedFallbackProvider(config, ref, unresolvedPaths)).map((ref) => ({
		ref,
		error: validateModelRefSyntax(validationConfig, ref, unresolvedPaths)
	}));
	const syntaxFailures = validatedRefs.filter((entry) => Boolean(entry.error));
	const refsToResolve = validatedRefs.filter((entry) => !entry.error).map((entry) => entry.ref);
	const errors = syntaxFailures.map(({ ref, error }) => formatError(ref, error));
	if (refsToResolve.length === 0) return {
		refsChecked: syntaxFailures.length,
		refsTotal: refs.length,
		errors
	};
	let resolveModelRef = params.resolveModelRef;
	if (!resolveModelRef) try {
		resolveModelRef = await (params.createModelRefResolver ?? createRuntimeModelRefResolver)();
	} catch (cause) {
		const detail = modelEnvWasExpanded || Boolean(params.redactDependencyValues && refs.some((ref) => ref.dependency)) ? "model resolver setup failed" : cause instanceof Error ? cause.message : String(cause);
		return {
			refsChecked: syntaxFailures.length,
			refsTotal: refs.length,
			errors: [...errors, `Unable to validate changed model references before writing: ${detail}`]
		};
	}
	let refsChecked = syntaxFailures.length;
	for (const ref of refsToResolve) {
		let error;
		try {
			error = await resolveModelRef({
				config: validationConfig,
				ref
			});
			refsChecked += 1;
		} catch (cause) {
			const detail = cause instanceof Error ? cause.message : String(cause);
			errors.push(formatError(ref, `Unable to validate model reference: ${detail}`));
			continue;
		}
		if (!error) continue;
		errors.push(formatError(ref, error));
	}
	return {
		refsChecked,
		refsTotal: refs.length,
		errors
	};
}
//#endregion
//#region src/cli/config-cli-runner.ts
const GATEWAY_AUTH_MODE_PATH = [
	"gateway",
	"auth",
	"mode"
];
const PLUGIN_INSTALL_RECORD_PATH_PREFIX = ["plugins", "installs"];
const CONFIG_SET_POLICY_ERROR_MAX_ISSUES = 5;
function pathStartsWith(path, prefix) {
	return prefix.every((segment, index) => path[index] === segment);
}
function pathEquals(path, expected) {
	return path.length === expected.length && path.every((segment, index) => segment === expected[index]);
}
function valueHasAutoManagedChild(value, childPath) {
	let cursor = value;
	for (const segment of childPath) {
		if (cursor === null || typeof cursor !== "object" || Array.isArray(cursor)) return false;
		const record = cursor;
		if (!Object.hasOwn(record, segment)) return false;
		cursor = record[segment];
	}
	return cursor !== void 0;
}
function operationClobbersAncestorChild(operation, managedPath, merge) {
	if (operation.mutation === "delete") return true;
	const childPath = managedPath.slice(operation.requestedPath.length);
	return operation.mutation === "merge" || merge && operation.mutation !== "replace" ? valueHasAutoManagedChild(operation.value, childPath) : true;
}
function findAutoManagedMetaTargets(operations, merge) {
	const matches = [];
	const seen = /* @__PURE__ */ new Set();
	const record = (path) => {
		const key = toDotPath(path);
		if (!seen.has(key)) {
			seen.add(key);
			matches.push([...path]);
		}
	};
	for (const operation of operations) {
		if (AUTO_MANAGED_CONFIG_META_PATHS.some((path) => pathStartsWith(operation.requestedPath, path))) {
			record(operation.requestedPath);
			continue;
		}
		for (const managedPath of AUTO_MANAGED_CONFIG_META_PATHS) if (operation.requestedPath.length < managedPath.length && pathStartsWith(managedPath, operation.requestedPath) && operationClobbersAncestorChild(operation, managedPath, merge)) record(managedPath);
	}
	return matches;
}
function formatAutoManagedMetaError(paths) {
	const targets = paths.map(toDotPath);
	return [
		`${targets.length === 1 ? targets[0] : targets.join(", ")} is auto-managed by OpenClaw and cannot be edited; the value would be overwritten on the next config write.`,
		"",
		"These fields are stamped on every config write to record the OpenClaw version and timestamp that produced the file."
	].join("\n");
}
function assertConfigPathIsNotAutoManaged(path) {
	const targets = findAutoManagedMetaTargets([{
		inputMode: "json",
		requestedPath: path,
		setPath: path,
		value: void 0,
		mutation: "delete"
	}]);
	if (targets.length > 0) throw new Error(formatAutoManagedMetaError(targets));
}
function pruneInactiveGatewayAuthCredentials(params) {
	const touchedMode = params.operations.some(({ requestedPath }) => pathEquals(requestedPath, GATEWAY_AUTH_MODE_PATH));
	const gateway = params.root.gateway;
	if (!touchedMode || !gateway || typeof gateway !== "object" || Array.isArray(gateway)) return [];
	const auth = gateway.auth;
	if (!auth || typeof auth !== "object" || Array.isArray(auth)) return [];
	const authRecord = auth;
	const mode = typeof authRecord.mode === "string" ? authRecord.mode.trim() : "";
	const removedPaths = [];
	const remove = (key) => {
		if (Object.hasOwn(authRecord, key)) {
			delete authRecord[key];
			removedPaths.push(`gateway.auth.${key}`);
		}
	};
	if (mode === "token") remove("password");
	else if (mode === "password") remove("token");
	else if (mode === "trusted-proxy") {
		remove("token");
		remove("password");
	}
	return removedPaths;
}
function collectChangedLeafPaths(value, prefix) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
	const entries = Object.entries(value);
	return entries.length === 0 ? [prefix] : entries.flatMap(([key, child]) => collectChangedLeafPaths(child, prefix ? `${prefix}.${key}` : key));
}
function expandActualChangedPaths(actualPaths, requestedPaths, before, after) {
	const expanded = /* @__PURE__ */ new Set();
	for (const actualPath of actualPaths) {
		const descendants = requestedPaths.filter((requested) => requested !== actualPath && requested.startsWith(`${actualPath}.`));
		if (descendants.length > 0) {
			descendants.forEach((path) => expanded.add(path));
			continue;
		}
		const path = actualPath === "<root>" ? [] : actualPath.split(".");
		const beforeValue = getAtPath(before, path);
		const afterValue = getAtPath(after, path);
		const changedValue = beforeValue.found && !afterValue.found ? beforeValue : afterValue;
		(beforeValue.found !== afterValue.found ? collectChangedLeafPaths(changedValue.value, actualPath) : [actualPath]).forEach((entry) => expanded.add(entry));
	}
	return [...expanded];
}
function configApplyHintForOperations(operations, beforeConfig, afterConfig) {
	const requestedPaths = [];
	for (const operation of operations) {
		if (!operation.requestedPath) return "Restart the gateway to apply.";
		requestedPaths.push(toDotPath(operation.requestedPath));
	}
	const paths = expandActualChangedPaths(diffConfigPaths(beforeConfig, afterConfig), requestedPaths, beforeConfig, afterConfig);
	if (paths.length === 0) return "No gateway restart needed.";
	if (paths.some((path) => path === "plugins.entries" || path.startsWith("plugins.entries."))) return "Restart the gateway to apply.";
	const plan = buildGatewayReloadPlan(paths, { candidateConfig: afterConfig });
	if (plan.restartGateway || plan.hotReasons.length > 0 && resolveGatewayReloadSettings(afterConfig).mode === "off") return "Restart the gateway to apply.";
	return plan.hotReasons.length > 0 ? "Change will apply without restarting the gateway." : "No gateway restart needed.";
}
async function loadMutationSchema() {
	try {
		return structuredClone((await readBestEffortRuntimeConfigSchema()).schema);
	} catch {
		return;
	}
}
function formatPolicyFailure(issues) {
	const lines = ["Config policy validation failed: unsupported SecretRef usage was detected.", ...issues.slice(0, CONFIG_SET_POLICY_ERROR_MAX_ISSUES).map((issue) => `- ${issue}`)];
	if (issues.length > CONFIG_SET_POLICY_ERROR_MAX_ISSUES) lines.push(`- ... ${issues.length - CONFIG_SET_POLICY_ERROR_MAX_ISSUES} more`);
	return lines.join("\n");
}
async function runConfigOperations(params) {
	const { runtime, operations, options } = params;
	if (operations.some(({ requestedPath }) => pathStartsWith(requestedPath, PLUGIN_INSTALL_RECORD_PATH_PREFIX))) throw new Error(formatPluginInstallConfigSetError());
	const autoManagedTargets = findAutoManagedMetaTargets(operations, options.merge);
	if (autoManagedTargets.length > 0) throw new Error(formatAutoManagedMetaError(autoManagedTargets));
	const mutationStart = await loadValidConfigForWrite(runtime);
	const { snapshot } = mutationStart;
	const next = structuredClone(snapshot.resolved);
	const currentConfig = normalizeConfigMutationModelRefs(structuredClone(snapshot.resolved));
	const mutationSchema = await loadMutationSchema();
	const unsetPaths = [];
	const explicitSetPaths = [];
	for (const operation of operations) {
		if (operation.mutation === "delete") {
			const unsetResult = unsetAtPath(next, operation.setPath);
			if (!unsetResult.removed || unsetResult.leafContainer !== "array") unsetPaths.push(operation.setPath);
			continue;
		}
		explicitSetPaths.push(operation.setPath);
		if (operation.mutation === "merge" || options.merge && operation.mutation !== "replace") mergeAtPath(next, operation.setPath, operation.value, {
			numericObjectKeys: params.successMode === "patch",
			...operation.pathTokens ? { pathTokens: operation.pathTokens } : {},
			...operation.quotedNumericSegments ? { quotedNumericSegments: operation.quotedNumericSegments } : {},
			schema: mutationSchema
		});
		else {
			assertNonDestructiveReplacement({
				root: next,
				path: operation.setPath,
				value: operation.value,
				allowReplace: options.replace || operation.mutation === "replace"
			});
			setAtPath(next, operation.setPath, operation.value, {
				numericObjectKeys: params.successMode === "patch",
				...operation.pathTokens ? { pathTokens: operation.pathTokens } : {},
				...operation.quotedNumericSegments ? { quotedNumericSegments: operation.quotedNumericSegments } : {},
				schema: mutationSchema
			});
		}
	}
	const removedGatewayAuthPaths = pruneInactiveGatewayAuthCredentials({
		root: next,
		operations
	});
	const nextConfig = normalizeConfigMutationModelRefs(next);
	const normalizedExplicitSetPaths = explicitSetPaths.map(normalizeConfigMutationExplicitSetPath);
	const policyIssueLines = formatConfigIssueLines(collectUnsupportedSecretRefPolicyIssues(nextConfig), "", { normalizeRoot: true }).map((line) => line.trim());
	const pluginIntegrationErrors = collectPluginIntegrationProviderErrors({
		config: nextConfig,
		operations
	});
	if (options.dryRun) {
		const hasJsonMode = operations.some(({ inputMode }) => inputMode === "json");
		const hasBuilderMode = operations.some(({ inputMode }) => inputMode === "builder");
		const hasUnsetMode = operations.some(({ inputMode }) => inputMode === "unset");
		const requiresFullSchemaValidation = operations.some((operation) => operation.inputMode === "unset" || operation.inputMode === "json" && operation.schemaValidated !== true);
		const checksRefs = hasJsonMode || hasBuilderMode || hasUnsetMode;
		const selectedRefs = selectDryRunRefsForResolution({
			refs: checksRefs ? collectDryRunRefs({
				config: nextConfig,
				operations
			}) : [],
			allowExecInDryRun: Boolean(options.allowExec)
		});
		const errors = [];
		const modelRefCheck = await checkTouchedTextModelRefs({
			config: nextConfig,
			previousConfig: currentConfig,
			touchedPaths: operations.map(({ setPath }) => setPath),
			redactDependencyValues: true
		});
		errors.push(...modelRefCheck.errors.map((message) => ({
			kind: "model",
			message
		})));
		if ((!hasJsonMode || !requiresFullSchemaValidation) && policyIssueLines.length > 0) errors.push(...policyIssueLines.map((message) => ({
			kind: "schema",
			message
		})));
		errors.push(...pluginIntegrationErrors);
		if (requiresFullSchemaValidation) errors.push(...collectDryRunSchemaErrors(nextConfig, mutationStart.writeOptions.basePluginMetadataSnapshot));
		if (checksRefs) errors.push(...collectDryRunStaticErrorsForSkippedExecRefs({
			refs: selectedRefs.skippedExecRefs,
			config: nextConfig
		}), ...await collectDryRunResolvabilityErrors({
			refs: selectedRefs.refsToResolve,
			config: nextConfig
		}));
		const dedupedErrors = dedupeDryRunErrors(errors);
		const dryRunResult = {
			ok: dedupedErrors.length === 0,
			operations: operations.length,
			configPath: snapshot.path,
			inputModes: uniqueValues(operations.map(({ inputMode }) => inputMode)),
			checks: {
				schema: requiresFullSchemaValidation || policyIssueLines.length > 0 || pluginIntegrationErrors.length > 0,
				resolvability: checksRefs || modelRefCheck.refsTotal > 0,
				resolvabilityComplete: (checksRefs || modelRefCheck.refsTotal > 0) && selectedRefs.skippedExecRefs.length === 0 && modelRefCheck.refsChecked === modelRefCheck.refsTotal
			},
			refsChecked: selectedRefs.refsToResolve.length + modelRefCheck.refsChecked,
			skippedExecRefs: selectedRefs.skippedExecRefs.length,
			...dedupedErrors.length > 0 ? { errors: dedupedErrors } : {}
		};
		if (dedupedErrors.length > 0) {
			if (options.json) throw new ConfigSetDryRunValidationError(dryRunResult);
			throw new Error(formatDryRunFailureMessage({
				errors: dedupedErrors,
				skippedExecRefs: selectedRefs.skippedExecRefs.length
			}));
		}
		if (options.json) writeRuntimeJson(runtime, dryRunResult);
		else {
			if (!dryRunResult.checks.schema && !dryRunResult.checks.resolvability) runtime.log(info("Dry run note: value mode does not run schema/resolvability checks. Use --strict-json, builder flags, or batch mode to enable validation checks."));
			if (dryRunResult.skippedExecRefs > 0) runtime.log(info(`Dry run note: skipped ${dryRunResult.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during dry-run.`));
			runtime.log(info(`Dry run successful: ${operations.length} update(s) validated against ${shortenHomePath(snapshot.path)}.`));
		}
		return;
	}
	if (policyIssueLines.length > 0) throw new Error(formatPolicyFailure(policyIssueLines));
	if (pluginIntegrationErrors.length > 0) throw new Error(["Config validation failed: plugin-managed SecretRef provider integration is invalid.", ...pluginIntegrationErrors.map((error) => `- ${error.message}`)].join("\n"));
	if (params.successMode === "set" && isDeepStrictEqual(currentConfig, nextConfig)) {
		assertStrictConfigForMutation(nextConfig, mutationStart.writeOptions.basePluginMetadataSnapshot);
		runtime.log(info("No change"));
		return;
	}
	const modelRefCheck = await checkTouchedTextModelRefs({
		config: nextConfig,
		previousConfig: currentConfig,
		touchedPaths: operations.map(({ setPath }) => setPath),
		redactDependencyValues: true
	});
	if (modelRefCheck.errors[0]) throw new Error(modelRefCheck.errors[0]);
	await replaceConfigFile({
		nextConfig,
		snapshot,
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
		writeOptions: {
			...mutationStart.writeOptions,
			auditOrigin: "cli",
			...unsetPaths.length > 0 ? { unsetPaths } : {},
			...normalizedExplicitSetPaths.length > 0 ? { explicitSetPaths: normalizedExplicitSetPaths } : {}
		}
	});
	if (removedGatewayAuthPaths.length > 0) runtime.log(info(`Removed inactive ${removedGatewayAuthPaths.join(", ")} for gateway.auth.mode=${nextConfig.gateway?.auth?.mode ?? "<unset>"}.`));
	const hint = configApplyHintForOperations(operations, currentConfig, nextConfig);
	if (params.successMode === "set" && operations.length === 1) {
		const operation = operations[0];
		const action = operation?.mutation === "delete" ? "Removed" : "Updated";
		const requestedPath = formatConfigSetPath(operation?.requestedPath ?? [], operation?.pathTokens, nextConfig);
		runtime.log(info(`${action} ${requestedPath}. ${hint}`));
	} else if (params.successMode === "set") runtime.log(info(`Updated ${operations.length} config paths. ${hint}`));
	else runtime.log(info(`Applied ${operations.length} config update(s). ${hint}`));
}
function handleConfigMutationError(params) {
	const isConflict = params.err instanceof ConfigMutationConflictError;
	const detail = formatErrorMessage(params.err);
	const message = isConflict ? `The config file changed while this command was writing (${detail}), so nothing was changed. Re-run the same command to pick up the new file and try again.` : detail;
	if (params.options.dryRun && params.options.json) {
		if (params.err instanceof ConfigSetDryRunValidationError) {
			writeRuntimeJson(params.runtime, params.err.result);
			params.runtime.exit(1);
			return;
		}
		const result = {
			ok: false,
			operations: 0,
			configPath: resolveConfigPath(),
			inputModes: [],
			checks: {
				schema: false,
				resolvability: false,
				resolvabilityComplete: false
			},
			refsChecked: 0,
			skippedExecRefs: 0,
			errors: [{
				kind: isConflict ? "conflict" : "schema",
				message
			}]
		};
		writeRuntimeJson(params.runtime, result);
		params.runtime.error(danger(message));
		params.runtime.exit(1);
		return;
	}
	params.runtime.error(danger(message));
	params.runtime.exit(1);
}
//#endregion
//#region src/cli/config-cli.ts
const CONFIG_SET_DESCRIPTION = [
	"Set config values by path (value mode, ref/provider builder mode, or batch JSON mode).",
	"Examples:",
	formatCliCommand("openclaw config set gateway.port 19001 --strict-json"),
	formatCliCommand("openclaw config set channels.discord.token --ref-provider default --ref-source env --ref-id DISCORD_BOT_TOKEN"),
	formatCliCommand("openclaw config set secrets.providers.vault --provider-source file --provider-path /etc/openclaw/secrets.json --provider-mode json"),
	formatCliCommand("openclaw config set --batch-file ./config-set.batch.json --dry-run")
].join("\n");
const CONFIG_PATCH_DESCRIPTION = [
	"Patch config from a JSON5 object in one validated write.",
	"Objects merge recursively, arrays/scalars replace, and null deletes a path.",
	"Examples:",
	formatCliCommand("openclaw config patch --file ./openclaw.patch.json5 --dry-run"),
	formatCliCommand("openclaw config patch --stdin")
].join("\n");
async function runConfigSet(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const modeResolution = resolveConfigSetMode({
			hasBatchMode: hasBatchMode(opts.cliOptions),
			hasRefBuilderOptions: hasRefBuilderOptions(opts.cliOptions),
			hasProviderBuilderOptions: hasProviderBuilderOptions(opts.cliOptions),
			strictJson: Boolean(opts.cliOptions.strictJson || opts.cliOptions.json)
		});
		if (!modeResolution.ok) throw modeError(modeResolution.error);
		if (opts.cliOptions.allowExec && !opts.cliOptions.dryRun) throw modeError("--allow-exec requires --dry-run.");
		if (opts.cliOptions.merge && opts.cliOptions.replace) throw modeError("choose either --merge or --replace, not both.");
		const batchEntries = parseBatchSource(opts.cliOptions);
		if (batchEntries && (opts.path !== void 0 || opts.value !== void 0)) throw modeError("batch mode does not accept <path> or <value> arguments.");
		await runConfigOperations({
			runtime,
			operations: buildConfigSetOperations({
				path: opts.path,
				value: opts.value,
				opts: opts.cliOptions,
				batchEntries: batchEntries ?? null
			}),
			options: opts.cliOptions,
			successMode: "set"
		});
	} catch (err) {
		handleConfigMutationError({
			err,
			runtime,
			options: opts.cliOptions
		});
	}
}
async function runConfigPatch(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		if (opts.cliOptions.allowExec && !opts.cliOptions.dryRun) throw configPatchModeError("--allow-exec requires --dry-run.");
		if (opts.cliOptions.json && !opts.cliOptions.dryRun) throw configPatchModeError("--json requires --dry-run.");
		await runConfigOperations({
			runtime,
			operations: await readConfigPatchOperations(opts.cliOptions),
			options: opts.cliOptions,
			successMode: "patch"
		});
	} catch (err) {
		handleConfigMutationError({
			err,
			runtime,
			options: opts.cliOptions
		});
	}
}
async function runConfigGet(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const parsedPath = parseConcreteConfigPath(opts.path);
		const { snapshot, pluginMetadataSnapshot } = await readConfigFileSnapshotWithPluginMetadata({ observe: false });
		if (!ensureValidConfigSnapshotForCli(snapshot, runtime, { json: opts.json })) return;
		if (!pluginMetadataSnapshot) throw new Error("Config plugin metadata unavailable; refusing to display config values.");
		const { schema, uiHints } = buildRuntimeConfigSchemaFromRegistry(pluginMetadataSnapshot.manifestRegistry);
		const res = getAtPath(redactConfigObject(snapshot.config, uiHints), parsedPath);
		if (!res.found) {
			const message = isConfigSchemaPath(schema, parsedPath) ? `Config path is valid but unset: ${opts.path}. The runtime default applies until you set an authored value with ${formatCliCommand(`openclaw config set ${quoteCliArg(opts.path)} <value>`)}.` : `Unknown config path: ${opts.path}. Run ${formatCliCommand("openclaw config schema")} to inspect valid paths.`;
			if (opts.json) {
				writeRuntimeJson(runtime, formatCliJsonFailure(message));
				runtime.exit(1);
				return;
			}
			runtime.error(danger(message));
			runtime.exit(1);
			return;
		}
		if (opts.json) writeRuntimeJson(runtime, res.value ?? null);
		else if (typeof res.value === "string" || typeof res.value === "number" || typeof res.value === "boolean") writeRuntimeStdout(runtime, `${String(res.value)}\n`);
		else writeRuntimeJson(runtime, res.value ?? null);
	} catch (err) {
		if (err instanceof ExitError) throw err;
		if (opts.json) {
			writeRuntimeJson(runtime, formatCliJsonFailure(err));
			runtime.exit(1);
			return;
		}
		runtime.error(danger(formatErrorMessage(err)));
		runtime.exit(1);
	}
}
async function runConfigUnset(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const cliOptions = opts.cliOptions ?? {};
	try {
		if (cliOptions.allowExec && !cliOptions.dryRun) throw new Error("--allow-exec can only be used with --dry-run.");
		if (cliOptions.json && !cliOptions.dryRun) throw new Error("--json can only be used with --dry-run.");
		const pathTokens = parseConcreteConfigPathTokens(opts.path);
		const parsedPath = pathTokens.map(String);
		assertConfigPathIsNotAutoManaged(parsedPath);
		const mutationStart = cliOptions.dryRun ? {
			snapshot: await loadValidConfig(runtime),
			writeOptions: {}
		} : await loadValidConfigForWrite(runtime);
		const { snapshot } = mutationStart;
		const next = structuredClone(snapshot.resolved);
		const currentConfig = normalizeConfigMutationModelRefs(structuredClone(snapshot.resolved));
		const unsetResult = unsetAtPath(next, parsedPath);
		if (!unsetResult.removed) {
			const runtimeOnly = getAtPath(snapshot.runtimeConfig, parsedPath).found;
			const missingPathMessage = formatConfigUnsetMissingPathMessage({
				path: opts.path,
				runtimeOnly
			});
			if (cliOptions.json) throw new ConfigSetDryRunValidationError({
				ok: false,
				operations: 1,
				configPath: snapshot.path,
				inputModes: ["unset"],
				checks: {
					schema: false,
					resolvability: false,
					resolvabilityComplete: false
				},
				refsChecked: 0,
				skippedExecRefs: 0,
				errors: [{
					kind: "missing-path",
					message: runtimeOnly ? missingPathMessage : `Config path not found: ${opts.path}. Nothing was changed.`
				}]
			});
			if (!cliOptions.dryRun) assertStrictConfigForMutation(currentConfig, mutationStart.writeOptions.basePluginMetadataSnapshot);
			runtime.error(danger(missingPathMessage));
			runtime.exit(1);
			return;
		}
		const operation = buildUnsetOperation(parsedPath, pathTokens);
		if (cliOptions.dryRun) {
			await runConfigOperations({
				runtime,
				operations: [operation],
				options: cliOptions,
				successMode: "set"
			});
			return;
		}
		const nextConfig = normalizeConfigMutationModelRefs(structuredClone(next));
		if (isDeepStrictEqual(currentConfig, nextConfig)) {
			assertStrictConfigForMutation(nextConfig, mutationStart.writeOptions.basePluginMetadataSnapshot);
			runtime.log(info("No change"));
			return;
		}
		const modelRefCheck = await checkTouchedTextModelRefs({
			config: nextConfig,
			previousConfig: currentConfig,
			touchedPaths: [parsedPath],
			redactDependencyValues: true
		});
		if (modelRefCheck.errors[0]) throw new Error(modelRefCheck.errors[0]);
		await replaceConfigFile({
			nextConfig,
			snapshot,
			...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
			writeOptions: unsetResult.leafContainer === "array" ? {
				...mutationStart.writeOptions,
				auditOrigin: "cli"
			} : {
				...mutationStart.writeOptions,
				auditOrigin: "cli",
				unsetPaths: [parsedPath]
			}
		});
		const hint = configApplyHintForOperations([operation], currentConfig, nextConfig);
		runtime.log(info(`Removed ${opts.path}. ${hint}`));
	} catch (err) {
		handleConfigMutationError({
			err,
			runtime,
			options: cliOptions
		});
	}
}
async function runConfigFile(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const path = resolveConfigPath();
		if (opts.json) {
			writeRuntimeJson(runtime, { path });
			return;
		}
		writeRuntimeStdout(runtime, `${path}\n`);
	} catch (err) {
		runtime.error(danger(formatErrorMessage(err)));
		runtime.exit(1);
	}
}
async function runConfigSchema(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const schema = structuredClone((await readBestEffortRuntimeConfigSchema()).schema);
		schema.properties = {
			$schema: { type: "string" },
			...schema.properties
		};
		writeRuntimeJson(runtime, schema);
	} catch (err) {
		runtime.error(danger(`Config schema error: ${formatErrorMessage(err)}`));
		runtime.exit(1);
	}
}
async function runConfigValidate(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	let outputPath = CONFIG_PATH ?? "openclaw.json";
	try {
		const read = await readConfigFileSnapshotWithPluginMetadata({ observe: false });
		const snapshot = strictlyValidateConfigSnapshotForCli(read.snapshot, read.pluginMetadataSnapshot);
		outputPath = snapshot.path;
		const shortPath = shortenHomePath(outputPath);
		if (!snapshot.exists) {
			if (opts.json) writeRuntimeJson(runtime, {
				...formatCliJsonFailure("file not found"),
				valid: false,
				path: outputPath
			}, 0);
			else {
				runtime.error(danger(`Config file not found: ${shortPath}`));
				runtime.error(`Create one with ${formatCliCommand("openclaw onboard")} or run ${formatCliCommand("openclaw doctor --fix")}.`);
			}
			runtime.exit(1);
			return;
		}
		if (!snapshot.valid) {
			const issues = normalizeConfigIssues(snapshot.issues);
			if (opts.json) writeRuntimeJson(runtime, {
				...formatCliJsonFailure(`OpenClaw config is invalid: ${shortPath}`),
				valid: false,
				path: outputPath,
				issues
			});
			else {
				runtime.error(danger(`OpenClaw config is invalid: ${shortPath}`));
				for (const line of renderConfigValidationIssueLines(snapshot, danger("×"))) runtime.error(`  ${line}`);
				runtime.error("");
				runtime.error(formatInvalidConfigRepairHint(snapshot, "to repair, or fix the keys above manually."));
				runtime.error(`Inspect with ${formatCliCommand("openclaw config validate")}.`);
			}
			runtime.exit(1);
			return;
		}
		const warnings = normalizeConfigIssues(snapshot.warnings);
		if (opts.json) writeRuntimeJson(runtime, {
			valid: true,
			path: outputPath,
			warnings
		}, 0);
		else {
			runtime.log(success(`Config valid: ${shortPath}`));
			if (warnings.length > 0) {
				runtime.log(warn(`${warnings.length} warning(s):`));
				for (const line of formatConfigIssueLines(warnings, warn("!"), { normalizeRoot: true })) runtime.log(`  ${line}`);
			}
		}
	} catch (err) {
		if (opts.json) writeRuntimeJson(runtime, {
			...formatCliJsonFailure(err),
			valid: false,
			path: outputPath
		}, 0);
		else runtime.error(danger(`Config validation error: ${formatErrorMessage(err)}`));
		runtime.exit(1);
	}
}
function collectOption(value, previous) {
	return [...previous, value];
}
function registerConfigCli(program) {
	const cmd = program.command("config").description("Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/config", "docs.openclaw.ai/cli/config")}\n`).option("--section <section>", "Configuration sections for guided setup (repeatable). Use with no subcommand.", collectOption, []).action(async (opts) => {
		const { configureCommandFromSectionsArg } = await import("./configure-DpJiivhE.js");
		await configureCommandFromSectionsArg(opts.section, defaultRuntime);
	});
	setCommandJsonMode(cmd, "output", ({ argv }) => isConfigMachineOutput(argv));
	cmd.command("get").description("Get a config value by dot path").argument("<path>", "Config path (dot or bracket notation)").option("--json", "Output JSON", false).action(async (path, opts) => {
		await runConfigGet({
			path,
			json: Boolean(opts.json)
		});
	});
	setCommandJsonMode(cmd.command("set"), "parse-only", ({ argv }) => isConfigSetJsonParseOnly(argv)).description(CONFIG_SET_DESCRIPTION).argument("[path]", "Config path (dot or bracket notation)").argument("[value]", "Value (JSON/JSON5 or raw string)").option("--strict-json", "Strict JSON parsing (error instead of raw string fallback)", false).option("--json", "Legacy alias for --strict-json", false).option("--dry-run", "Validate changes without writing openclaw.json (checks run in builder/json/batch modes; exec SecretRefs are skipped unless --allow-exec is set)", false).option("--allow-exec", "Dry-run only: allow exec SecretRef resolvability checks (may execute provider commands)", false).option("--merge", "Merge object/map values instead of replacing the target path", false).option("--replace", "Allow full replacement of protected map/list paths such as agents.defaults.models", false).option("--ref-provider <alias>", "SecretRef builder: provider alias").option("--ref-source <source>", "SecretRef builder: source (env|file|exec|store)").option("--ref-id <id>", "SecretRef builder: ref id").option("--provider-source <source>", "Provider builder: source (env|file|exec|store)").option("--provider-allowlist <envVar>", "Provider builder (env): allowlist entry (repeatable)", collectOption, []).option("--provider-path <path>", "Provider builder (file): path").option("--provider-mode <mode>", "Provider builder (file): mode (singleValue|json)").option("--provider-timeout-ms <ms>", "Provider builder (file|exec): timeout ms").option("--provider-max-bytes <bytes>", "Provider builder (file): max bytes").option("--provider-command <path>", "Provider builder (exec): absolute command path").option("--provider-arg <arg>", "Provider builder (exec): command arg (repeatable)", collectOption, []).option("--provider-no-output-timeout-ms <ms>", "Provider builder (exec): no-output timeout ms").option("--provider-max-output-bytes <bytes>", "Provider builder (exec): max output bytes").option("--provider-json-only", "Provider builder (exec): require JSON output", false).option("--provider-env <key=value>", "Provider builder (exec): env assignment (repeatable)", collectOption, []).option("--provider-pass-env <envVar>", "Provider builder (exec): pass host env var (repeatable)", collectOption, []).option("--provider-trusted-dir <path>", "Provider builder (exec): trusted directory (repeatable)", collectOption, []).option("--batch-json <json>", "Batch mode: JSON array of set operations").option("--batch-file <path>", "Batch mode: read JSON array of set operations from file").action(async (path, value, opts) => {
		await runConfigSet({
			path,
			value,
			cliOptions: opts
		});
	});
	cmd.command("patch").description(CONFIG_PATCH_DESCRIPTION).option("--file <path>", "Read a JSON5 config patch object from file").option("--stdin", "Read a JSON5 config patch object from stdin", false).option("--dry-run", "Validate changes without writing openclaw.json (checks schema and SecretRef resolvability; exec SecretRefs are skipped unless --allow-exec is set)", false).option("--allow-exec", "Dry-run only: allow exec SecretRef resolvability checks (may execute provider commands)", false).option("--json", "Output dry-run result as JSON", false).option("--replace-path <path>", "Replace the object or array at this dot/bracket path instead of recursively applying it (repeatable)", collectOption, []).action(async (opts) => {
		await runConfigPatch({ cliOptions: opts });
	});
	cmd.command("unset").description("Remove a config value by dot path").argument("<path>", "Config path (dot or bracket notation)").option("--dry-run", "validate the removal without writing the config file").option("--allow-exec", "allow exec SecretRef providers during --dry-run").option("--json", "print dry-run result as JSON").action(async (path, options) => {
		await runConfigUnset({
			path,
			cliOptions: options
		});
	});
	cmd.command("file").description("Print the active config file path").option("--json", "Output JSON", false).action((opts) => runConfigFile(opts));
	cmd.command("schema").description("Print the JSON schema for openclaw.json").option("--json", "Output JSON", false).action(runConfigSchema);
	cmd.command("validate").description("Validate the current config against the schema without starting the gateway").option("--json", "Output validation result as JSON", false).action(async (opts) => {
		await runConfigValidate({ json: Boolean(opts.json) });
	});
}
//#endregion
export { parseConcreteConfigPath as parseConfigSetPath, registerConfigCli, runConfigGet, runConfigPatch, runConfigSet, runConfigUnset };
