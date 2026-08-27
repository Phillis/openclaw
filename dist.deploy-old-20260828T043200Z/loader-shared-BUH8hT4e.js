import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as parseBooleanValue } from "./boolean-DmBL0YJK.js";
import { d as recordPluginCandidateInstallOwner, o as isPluginLifecycleTraceEnabled } from "./discovery-KmR2BWJK.js";
import { n as resolveRealpathOrAbsolute } from "./boundary-path-DDLrDh1C.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as validateJsonSchemaValue } from "./schema-validator-yfJyG0DX.js";
import { r as hasKind } from "./slots-CQdAEuat.js";
import { c as resolveEffectiveEnableState } from "./config-state-Bgpvw0Q6.js";
import { c as collectPluginManifestCompatCodes, y as isPluginEnabledByDefaultForPlatform } from "./installed-plugin-index-B1BZ_yR8.js";
import { m as resolvePluginManifestInstallOwner, p as isPluginManifestInstallOwnerAmbiguous } from "./manifest-registry-DRErrq38.js";
import { A as stageActivePluginRegistry, O as rollbackStagedPluginRegistry, i as commitStagedPluginRegistry, n as captureActivePluginRegistrySnapshot } from "./runtime-DMlUh4Cg.js";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig, l as DEFAULT_MEMORY_DREAMING_PLUGIN_ID } from "./dreaming-14k0XOwK.js";
import { a as resetGlobalHookRunner, i as initializeGlobalHookRunner, n as getGlobalPluginRegistry } from "./hook-runner-global-CWpWIBkz.js";
import { n as activateContextEngineRegistrations } from "./registry-BL4inl-J.js";
import { a as formatPluginVerificationDiagnostic } from "./runtime-degraded-state-B165q11W.js";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.js";
//#region src/plugins/loader-records.ts
/** Converts loaded plugin registries into stable plugin records for status and diagnostics. */
/** Builds the registry record shape shared by plugin loading, status, and diagnostics. */
function createPluginRecord(params) {
	return {
		id: params.id,
		name: params.name ?? params.id,
		description: params.description,
		packageVersion: params.packageVersion,
		version: params.version,
		builtWithOpenClawVersion: params.builtWithOpenClawVersion,
		packageName: params.packageName,
		format: params.format ?? "openclaw",
		bundleFormat: params.bundleFormat,
		bundleCapabilities: params.bundleCapabilities,
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		workspaceDir: params.workspaceDir,
		trustedOfficialInstall: params.trustedOfficialInstall,
		enabled: params.enabled,
		compat: params.compat,
		explicitlyEnabled: params.activationState?.explicitlyEnabled,
		activated: params.activationState?.activated,
		activationSource: params.activationState?.source,
		activationReason: params.activationState?.reason,
		syntheticAuthRefs: params.syntheticAuthRefs ?? [],
		status: params.enabled ? "loaded" : "disabled",
		toolNames: [],
		hookNames: [],
		channelIds: [...params.channelIds ?? []],
		cliBackendIds: [],
		providerIds: [...params.providerIds ?? []],
		embeddingProviderIds: [...params.contracts?.embeddingProviders ?? []],
		speechProviderIds: [...params.contracts?.speechProviders ?? []],
		realtimeTranscriptionProviderIds: [...params.contracts?.realtimeTranscriptionProviders ?? []],
		realtimeVoiceProviderIds: [...params.contracts?.realtimeVoiceProviders ?? []],
		mediaUnderstandingProviderIds: [...params.contracts?.mediaUnderstandingProviders ?? []],
		transcriptSourceProviderIds: [...params.contracts?.transcriptSourceProviders ?? []],
		imageGenerationProviderIds: [...params.contracts?.imageGenerationProviders ?? []],
		videoGenerationProviderIds: [...params.contracts?.videoGenerationProviders ?? []],
		musicGenerationProviderIds: [...params.contracts?.musicGenerationProviders ?? []],
		webFetchProviderIds: [...params.contracts?.webFetchProviders ?? []],
		webSearchProviderIds: [...params.contracts?.webSearchProviders ?? []],
		migrationProviderIds: [...params.contracts?.migrationProviders ?? []],
		contextEngineIds: [],
		agentHarnessIds: [],
		cliCommands: [],
		services: [],
		gatewayDiscoveryServiceIds: [],
		commands: [],
		httpRoutes: 0,
		hookCount: 0,
		configSchema: params.configSchema,
		configUiHints: void 0,
		configJsonSchema: void 0,
		contracts: params.contracts,
		dashboard: params.dashboard,
		mcpServers: params.mcpServers
	};
}
/** Marks a discovered plugin inactive without discarding its metadata record. */
function markPluginActivationDisabled(record, reason) {
	record.activated = false;
	record.activationSource = "disabled";
	record.activationReason = reason;
}
/** Records a boot-time payload quarantine without importing or activating the plugin. */
function recordPluginConfiguredUnavailable(params) {
	const error = formatPluginVerificationDiagnostic(params.degradedPlugin.diagnostic);
	params.record.status = "error";
	params.record.error = error;
	params.record.failurePhase = "validation";
	params.record.activated = false;
	params.record.activationReason = `configured-unavailable: ${params.degradedPlugin.diagnostic.reason}`;
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.record.id, params.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		code: "plugin-verification",
		message: error
	});
}
/** Joins auto-enable reasons into the single registry field shown by status surfaces. */
function formatAutoEnabledActivationReason(reasons) {
	if (!reasons || reasons.length === 0) return;
	return reasons.join("; ");
}
/** Records a loader failure in the registry, diagnostics list, and operator log consistently. */
function recordPluginError(params) {
	const errorText = isPluginLifecycleTraceEnabled() && params.error instanceof Error && typeof params.error.stack === "string" ? params.error.stack : String(params.error);
	const deprecatedApiHint = errorText.includes("api.registerHttpHandler") && errorText.includes("is not a function") ? "deprecated api.registerHttpHandler(...) was removed; use api.registerHttpRoute(...) for plugin-owned routes or registerPluginHttpRoute(...) for dynamic lifecycle routes" : null;
	const displayError = deprecatedApiHint ? `${deprecatedApiHint} (${errorText})` : errorText;
	params.logger.error(`${params.logPrefix}${displayError}`);
	params.record.status = "error";
	params.record.error = displayError;
	params.record.failedAt = /* @__PURE__ */ new Date();
	params.record.failurePhase = params.phase;
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.pluginId, params.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: `${params.diagnosticMessagePrefix}${displayError}`,
		...params.diagnosticCode ? { code: params.diagnosticCode } : {}
	});
}
/** Groups failed plugin ids by loader phase for compact startup summaries. */
function formatPluginFailureSummary(failedPlugins) {
	const grouped = /* @__PURE__ */ new Map();
	for (const plugin of failedPlugins) {
		const phase = plugin.failurePhase ?? "load";
		const ids = grouped.get(phase);
		if (ids) {
			ids.push(plugin.id);
			continue;
		}
		grouped.set(phase, [plugin.id]);
	}
	return [...grouped.entries()].map(([phase, ids]) => `${phase}: ${ids.join(", ")}`).join("; ");
}
function isPluginLoadDebugEnabled(env) {
	return parseBooleanValue(env.OPENCLAW_PLUGIN_LOAD_DEBUG) === true;
}
function describePluginModuleExportShape(value, label = "export", seen = /* @__PURE__ */ new Set()) {
	if (value === null) return [`${label}:null`];
	if (typeof value !== "object") return [`${label}:${typeof value}`];
	if (seen.has(value)) return [`${label}:circular`];
	seen.add(value);
	const record = value;
	const keys = Object.keys(record).toSorted();
	const visibleKeys = keys.slice(0, 8);
	const extraCount = keys.length - visibleKeys.length;
	const details = [`${label}:object keys=${visibleKeys.length > 0 ? `${visibleKeys.join(",")}${extraCount > 0 ? `,+${extraCount}` : ""}` : "none"}`];
	for (const key of [
		"default",
		"module",
		"register",
		"activate"
	]) if (Object.hasOwn(record, key)) details.push(...describePluginModuleExportShape(record[key], `${label}.${key}`, seen));
	return details;
}
function formatMissingPluginRegisterError(moduleExport, env) {
	const message = "plugin export missing register/activate";
	if (!isPluginLoadDebugEnabled(env)) return message;
	return `${message} (module shape: ${describePluginModuleExportShape(moduleExport).join("; ")})`;
}
//#endregion
//#region src/plugins/loader-shared.ts
function createPluginLoaderLogger() {
	return createSubsystemLogger("plugins");
}
function detailPluginStartupTrace(startupTrace, pluginId, metrics) {
	startupTrace?.detail(`plugins.gateway-load.plugin.${encodeStartupTraceSegment(pluginId)}`, metrics);
}
function resolveDreamingSidecarEngineId(params) {
	const normalizedMemorySlot = normalizeLowercaseStringOrEmpty(params.memorySlot);
	if (!normalizedMemorySlot || normalizedMemorySlot === "none" || normalizedMemorySlot === "memory-core") return null;
	return resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(params.cfg),
		cfg: params.cfg
	}).enabled ? DEFAULT_MEMORY_DREAMING_PLUGIN_ID : null;
}
function resolveAuthorizedDreamingSidecar(params) {
	const engineId = resolveDreamingSidecarEngineId({
		cfg: params.cfg,
		memorySlot: params.memorySlot
	});
	if (!engineId || !params.normalized.enabled || !params.activationSource.plugins.enabled) return null;
	const selectedMemoryPluginId = normalizeLowercaseStringOrEmpty(params.memorySlot);
	if (!selectedMemoryPluginId || selectedMemoryPluginId === engineId) return null;
	if (params.normalized.deny.includes(engineId) || params.activationSource.plugins.deny.includes(engineId) || params.normalized.entries[engineId]?.enabled === false || params.activationSource.plugins.entries[engineId]?.enabled === false) return null;
	const selectedMemoryPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === selectedMemoryPluginId);
	const sidecarPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === engineId);
	if (!selectedMemoryPlugin || !sidecarPlugin || !hasKind(selectedMemoryPlugin.kind, "memory") || !hasKind(sidecarPlugin.kind, "memory")) return null;
	return resolveEffectiveEnableState({
		id: selectedMemoryPlugin.id,
		origin: selectedMemoryPlugin.origin,
		config: params.normalized,
		rootConfig: params.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedMemoryPlugin),
		activationSource: params.activationSource
	}).enabled ? {
		engineId,
		selectedMemoryPluginId
	} : null;
}
function isAuthorizedDreamingSidecarPlugin(params) {
	return params.sidecar?.engineId === params.pluginId;
}
function matchesScopedPluginOrDreamingSidecar(params) {
	if (!params.onlyPluginIdSet || params.onlyPluginIdSet.has(params.pluginId)) return true;
	return params.pluginId === params.sidecar?.engineId && params.onlyPluginIdSet.has(params.sidecar.selectedMemoryPluginId);
}
function createPluginCandidatesFromManifestRegistry(manifestRegistry) {
	return manifestRegistry.plugins.map((record) => {
		const installOwner = resolvePluginManifestInstallOwner(record);
		return recordPluginCandidateInstallOwner({
			idHint: record.id,
			effectivePluginId: record.id,
			rootDir: record.rootDir,
			source: record.source,
			...record.setupSource !== void 0 ? { setupSource: record.setupSource } : {},
			origin: record.origin,
			...record.workspaceDir !== void 0 ? { workspaceDir: record.workspaceDir } : {},
			...record.format !== void 0 ? { format: record.format } : {},
			...record.bundleFormat !== void 0 ? { bundleFormat: record.bundleFormat } : {},
			...record.packageManifest !== void 0 ? { packageManifest: record.packageManifest } : {}
		}, installOwner, isPluginManifestInstallOwnerAmbiguous(record));
	});
}
var PluginLoadFailureError = class extends Error {
	constructor(registry) {
		const failedPlugins = registry.plugins.filter((entry) => entry.status === "error");
		const summary = failedPlugins.map((entry) => `${entry.id}: ${entry.error ?? "unknown plugin load error"}`).join("; ");
		super(`plugin load failed: ${summary}`);
		this.name = "PluginLoadFailureError";
		this.pluginIds = failedPlugins.map((entry) => entry.id);
		this.registry = registry;
	}
};
function validatePluginConfig(params) {
	const { schema, value } = params;
	if (!schema) return ok(value);
	if (isEmptyPluginConfigJsonSchema(schema)) {
		if (value === void 0 || value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return ok({});
		if (!value || typeof value !== "object" || Array.isArray(value)) return err(["<root>: must be object"]);
		return err(["<root>: config must be empty"]);
	}
	const result = validateJsonSchemaValue({
		schema,
		cacheKey: params.cacheKey ?? JSON.stringify(schema),
		value: value ?? {},
		applyDefaults: true
	});
	return result.ok ? ok(result.value) : err(result.errors.map((error) => error.text));
}
function isEmptyPluginConfigJsonSchema(schema) {
	if (schema.type !== "object" || schema.additionalProperties !== false) return false;
	const properties = schema.properties;
	if (!properties || typeof properties !== "object" || Array.isArray(properties) || Object.keys(properties).length > 0) return false;
	const hasConditional = "if" in schema && ("then" in schema || "else" in schema);
	return !("required" in schema || "dependentRequired" in schema || "dependentSchemas" in schema || "dependencies" in schema || "minProperties" in schema || "allOf" in schema || "anyOf" in schema || "oneOf" in schema || "not" in schema || "patternProperties" in schema || hasConditional);
}
function pushDiagnostics(diagnostics, append) {
	diagnostics.push(...append);
}
function pushPluginValidationError(params) {
	params.record.status = "error";
	params.record.error = params.message;
	params.record.failedAt = /* @__PURE__ */ new Date();
	params.record.failurePhase = "validation";
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.pluginId, params.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: params.record.error
	});
}
/** Builds the common manifest-backed record shape used by runtime and CLI loaders. */
function createManifestPluginRecord(params) {
	const { candidate, manifestRecord } = params;
	return createPluginRecord({
		id: manifestRecord.id,
		name: manifestRecord.name ?? manifestRecord.id,
		description: manifestRecord.description,
		packageVersion: manifestRecord.packageVersion,
		version: manifestRecord.version,
		builtWithOpenClawVersion: normalizeOptionalString(candidate.packageManifest?.build?.openclawVersion),
		packageName: manifestRecord.packageName,
		format: manifestRecord.format,
		bundleFormat: manifestRecord.bundleFormat,
		bundleCapabilities: manifestRecord.bundleCapabilities,
		source: candidate.source,
		rootDir: candidate.rootDir,
		origin: candidate.origin,
		workspaceDir: candidate.workspaceDir,
		trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
		enabled: params.enabled,
		compat: collectPluginManifestCompatCodes(manifestRecord),
		activationState: params.activationState,
		syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
		channelIds: manifestRecord.channels,
		providerIds: manifestRecord.providers,
		configSchema: Boolean(manifestRecord.configSchema),
		contracts: manifestRecord.contracts,
		dashboard: manifestRecord.dashboard,
		mcpServers: manifestRecord.mcpServers
	});
}
function applyPluginManifestRecordDetails(record, manifestRecord) {
	record.kind = manifestRecord.kind;
	record.configUiHints = manifestRecord.configUiHints;
	record.configJsonSchema = manifestRecord.configSchema;
	record.commandAliases = manifestRecord.commandAliases;
}
function applyManifestSnapshotMetadata(record, manifestRecord) {
	record.channelIds = [...manifestRecord.channels ?? []];
	record.providerIds = [...manifestRecord.providers ?? []];
	record.cliBackendIds = [...manifestRecord.cliBackends ?? [], ...manifestRecord.setup?.cliBackends ?? []];
	record.commands = (manifestRecord.commandAliases ?? []).map((alias) => alias.name);
}
function maybeThrowOnPluginLoadError(registry, throwOnLoadError) {
	if (throwOnLoadError && registry.plugins.some((entry) => entry.status === "error")) throw new PluginLoadFailureError(registry);
}
function activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir) {
	const activeSnapshot = captureActivePluginRegistrySnapshot();
	const previousHookRegistry = getGlobalPluginRegistry();
	try {
		stageActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir);
		initializeGlobalHookRunner(registry);
		activateContextEngineRegistrations(registry);
		commitStagedPluginRegistry(activeSnapshot.activeRegistry, registry);
	} catch (error) {
		rollbackStagedPluginRegistry(activeSnapshot);
		if (previousHookRegistry) initializeGlobalHookRunner(previousHookRegistry);
		else resetGlobalHookRunner();
		throw error;
	}
}
function safeRealpathOrResolve(value) {
	return resolveRealpathOrAbsolute(value);
}
//#endregion
export { formatMissingPluginRegisterError as _, createPluginCandidatesFromManifestRegistry as a, recordPluginConfiguredUnavailable as b, isAuthorizedDreamingSidecarPlugin as c, pushDiagnostics as d, pushPluginValidationError as f, formatAutoEnabledActivationReason as g, validatePluginConfig as h, createManifestPluginRecord as i, matchesScopedPluginOrDreamingSidecar as l, safeRealpathOrResolve as m, applyManifestSnapshotMetadata as n, createPluginLoaderLogger as o, resolveAuthorizedDreamingSidecar as p, applyPluginManifestRecordDetails as r, detailPluginStartupTrace as s, activatePluginRegistry as t, maybeThrowOnPluginLoadError as u, formatPluginFailureSummary as v, recordPluginError as x, markPluginActivationDisabled as y };
