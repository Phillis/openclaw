import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.js";
import { f as normalizeTrimmedStringList, g as normalizeUniqueTrimmedStringList, m as normalizeUniqueStringEntries, u as normalizeStringEntries, y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside, m as safeStatSync, p as safeRealpathSync } from "./path-D138yf8v.js";
import { f as recordPluginInstallOwnerLookup, m as resolvePluginInstallOwnerLookup, n as discoverOpenClawPlugins, p as resolvePluginCandidateInstallOwner, u as isPluginCandidateInstallOwnerAmbiguous } from "./discovery-KmR2BWJK.js";
import { i as openRootFileSync } from "./root-file-B4L4VJ7-.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { r as resolveConfigEnvVars } from "./env-substitution-DXYJj0ec.js";
import { t as describeRootFileOpenFailure } from "./boundary-file-read-h_n3tTfV.js";
import { n as resolveRealpathOrAbsolute } from "./boundary-path-DDLrDh1C.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as sanitizeCommandDescriptorDescription, i as normalizeCommandDescriptorName } from "./command-descriptor-utils-C7spGKc4.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { c as classifySessionKeyShape, f as resolveAgentIdFromSessionKey, l as isUnscopedSessionKeySentinel } from "./session-key-Dbce_H9p.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { l as tryReadJsonSync } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { t as validateJsonSchemaValue } from "./schema-validator-yfJyG0DX.js";
import { t as PluginLruCache } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { n as createPluginModuleLoaderCache, r as getCachedPluginModuleLoader, s as installOpenClawPluginSdkNativeResolver, u as toSafeImportPath } from "./plugin-module-loader-cache-DNYw5tMM.js";
import "./path-safety-Dv61TTin.js";
import { n as resolveOpenClawDevSourceRoot, t as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-C8kiYxGY.js";
import { c as resolvePluginRuntimeModulePathWithDiagnostics, t as buildPluginLoaderAliasMap } from "./sdk-alias-TKlN0lQ-.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { a as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./ids-Cgp0iV_A.js";
import { i as kindsEqual, n as defaultSlotIdForKey, r as hasKind } from "./slots-CQdAEuat.js";
import { c as resolveEffectiveEnableState, d as resolveMemorySlotDecision, l as resolveEffectivePluginActivationState, n as createPluginActivationSource, s as normalizePluginsConfig, t as applyTestPluginDefaults } from "./config-state-Bgpvw0Q6.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex, y as isPluginEnabledByDefaultForPlatform } from "./installed-plugin-index-Cr71VmpU.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-jAYIsS4O.js";
import { n as loadPluginManifestRegistryCore, s as loadInstalledPluginIndexInstallRecordsSync } from "./manifest-registry-DqYRJvWI.js";
import { Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Qt as normalizeSqliteNumber, Xt as resolveOpenClawStateSqlitePath, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { r as resolvePluginDiscoveryContext, t as fingerprintPluginDiscoveryContext } from "./plugin-control-plane-context-DGIHVL5k.js";
import { d as serializePluginIdScope, n as getCurrentPluginMetadataSnapshot, s as createPluginIdScopeSet, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { l as normalizeChannelMeta } from "./bundled-YAb6Bu5O.js";
import { t as unwrapDefaultModuleExport } from "./module-export-DsZgGIbX.js";
import { a as resolveManifestOwnerBasePolicyBlock, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-BL1Kt38K.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import { o as createConfigRuntimeEnv } from "./config-env-vars-C_yEEhJa.js";
import "./env-vars-B2e3bjCN.js";
import { S as getCoreEmbeddingProvider } from "./gateway-startup-plugin-ids-Dy6KWM9Y.js";
import { _ as hasInvalidLifecycleStartTimestamp, i as emitAgentEvent } from "./agent-events-CcZImb5w.js";
import { a as isPluginRegistryActivated, i as isPluginRecordLifecycleEpochActive, s as isPluginRegistryRetired, t as activatePluginRecordLifecycleEpoch, u as revokePluginRecordLifecycleEpoch } from "./registry-lifecycle-DYhl0RY-.js";
import { B as registerPluginSessionSchedulerJob, F as clearPluginRunContext, I as deletePluginSessionSchedulerJob, L as getPluginRunContext, P as cleanupPluginSessionSchedulerJobs, R as getPluginSessionSchedulerJobGeneration, V as setPluginRunContext, d as getActivePluginRegistry, f as getActivePluginRegistryKey, g as getActivePluginSessionExtensionRegistry, j as withPluginRegistrationContext, x as recordImportedPluginId } from "./runtime-B2KAtS3O.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { s as listChatChannels } from "./registry-DbgR8dhg.js";
import { t as createEmptyPluginRegistry } from "./registry-empty-55wlVNzO.js";
import { c as withPluginRuntimePluginIdScope, l as withPluginRuntimePluginScope, r as getGatewayContextResolver, u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { S as NODE_WORKER_PRIVATE_COMMANDS, a as NODE_EXEC_APPROVALS_COMMANDS, j as isPrivateNodeInvokeCommand, m as NODE_SYSTEM_RUN_COMMANDS, p as NODE_SYSTEM_NOTIFY_COMMAND } from "./node-commands-DRxP7loh.js";
import { y as normalizePluginGatewayMethodScope } from "./core-descriptors-8FmEpKxY.js";
import { w as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import { d as isDeliverableMessageChannel } from "./message-channel-BZwx7FCw.js";
import { i as sqliteSessionFileMarkerMatchesTarget, n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { Ht as updateResolvedSessionEntry, zt as resolveSessionEntryAccessTarget } from "./session-accessor-fcDZuc2H.js";
import { u as normalizeSessionEntrySlotKey } from "./restart-recovery-state-6FYlAu33.js";
import { a as isAgentHarnessSessionKey, o as isAgentHarnessSessionKeyOwnedBy } from "./agent-harness-session-key-D9_Ct3Lx.js";
import { d as normalizeMimeType, n as detectMime, t as FILE_TYPE_SNIFF_MAX_BYTES } from "./mime-Hm4eS2i0.js";
import { t as extractDeliveryInfo } from "./sessions-BI8dPUCI.js";
import { i as withProfile } from "./plugin-load-profile-TkvuJ07_.js";
import { a as attachPluginApiFacades, i as createUnavailableRuntime, r as buildPluginApi } from "./plugin-runtime-artifact-selection-VqjOEbH8.js";
import { _ as createPluginToolMatcherScope, b as pluginToolMatcherCoversTool, y as normalizePluginToolMatcher } from "./hook-runner-global-CDBq1X4a.js";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-dt8HPVE_.js";
import "./installed-plugin-index-records-CHK-Mu2-.js";
import { n as resolveCanonicalDistRuntimeSource, r as resolvePluginRuntimeArtifact, t as clearPluginRuntimeArtifactResolutionMemo } from "./plugin-runtime-artifact-resolution-C9zPisva.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { c as validateOptionalPluginStoreTtlMs, d as validatePluginStorePositiveInteger, l as validatePluginStoreKey, n as createPluginStateKeyedStore, r as createPluginStateSyncKeyedStore, s as serializePluginStoreJson, u as validatePluginStoreNamespace } from "./plugin-state-store-WXMs6Mfy.js";
import { s as registerContextEngineInRegistry } from "./registry-BUOAn3oY.js";
import { i as findActiveDegradedPlugin, n as clearActiveDegradedPlugin, r as degradedPluginMatchesRoot } from "./runtime-degraded-state-B165q11W.js";
import { _ as formatMissingPluginRegisterError, a as createPluginCandidatesFromManifestRegistry, b as recordPluginConfiguredUnavailable, c as isAuthorizedDreamingSidecarPlugin, d as pushDiagnostics, f as pushPluginValidationError, g as formatAutoEnabledActivationReason, h as validatePluginConfig, i as createManifestPluginRecord, l as matchesScopedPluginOrDreamingSidecar, m as safeRealpathOrResolve, n as applyManifestSnapshotMetadata, o as createPluginLoaderLogger, p as resolveAuthorizedDreamingSidecar, r as applyPluginManifestRecordDetails, s as detailPluginStartupTrace, t as activatePluginRegistry, u as maybeThrowOnPluginLoadError, v as formatPluginFailureSummary, x as recordPluginError, y as markPluginActivationDisabled } from "./loader-shared-clOILqTh.js";
import { t as isBundleCapabilitySupported } from "./bundle-capability-support-B86S0fqh.js";
import { n as inspectBundleMcpRuntimeSupport } from "./bundle-mcp-COf3pOpu.js";
import { o as PluginDashboardDeclarationError, s as registerPluginDashboardCapabilities, t as createPluginBoardWidgetContentKindRegistrar } from "./board-widget-content-kinds-DiWZfBNV.js";
import { a as resolveSetupChannelRegistration, i as resolveBundledRuntimeChannelRegistration, n as loadBundledRuntimeChannelPlugin, o as shouldLoadChannelPluginInSetupRuntime, r as mergeSetupRuntimeChannelPlugin, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-D4_spJP7.js";
import { n as resolvePathFromInput } from "./path-policy-DK2wTBdY.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-35xKeV2k.js";
import { i as readRecordValue } from "./safe-record-CjQoFebO.js";
import { r as copyProviderCatalogResultEntries, t as copyProviderCatalogModels } from "./provider-catalog-result-CC7IUe_c.js";
import { r as registerPluginInteractiveHandlerInRegistry } from "./interactive-registry-D1HgRfth.js";
import { n as normalizePluginHttpPath, t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-BiEmB859.js";
import { r as registerPluginCommandInRegistry, t as isReservedCommandName } from "./command-registration-C3uxM4em.js";
import { n as validateWorkerProviderContract } from "./worker-provider-registry-DJb9Q_U9.js";
import "./with-timeout-DH-MyY5v.js";
import { n as resolvePromptInjectionAllowed, t as resolveConversationAccessAllowed } from "./hook-policy-decisions-DL3kOjGW.js";
import { c as prepareHostChannelContextAdmissionEvidence, p as registerChannelAdmissionEvidenceOwner, t as bindHostChannelContextAdmissionEvidence } from "./admission-evidence-C8iAKYLB.js";
import { n as createChannelIngressDrain } from "./ingress-drain-ypsN4E6P.js";
import { t as createChannelIngressQueue } from "./ingress-queue-Czdiq-NP.js";
import fs from "node:fs";
import path from "node:path";
import * as fsPromises from "node:fs/promises";
import { lstat } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/plugins/host-hooks.ts
function normalizePluginHostHookId(value) {
	return (value ?? "").trim();
}
function normalizeQueuedInjectionText(entry, placement) {
	const candidate = entry;
	if (candidate.placement !== placement || typeof candidate.text !== "string") return;
	return candidate.text.trim() || void 0;
}
function buildPluginAgentTurnPrepareContext(params) {
	const prepend = params.queuedInjections.map((entry) => normalizeQueuedInjectionText(entry, "prepend_context")).filter(Boolean);
	const append = params.queuedInjections.map((entry) => normalizeQueuedInjectionText(entry, "append_context")).filter(Boolean);
	return {
		...prepend.length > 0 ? { prependContext: prepend.join("\n\n") } : {},
		...append.length > 0 ? { appendContext: append.join("\n\n") } : {}
	};
}
//#endregion
//#region src/plugins/agent-tool-result-middleware.ts
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES = ["openclaw", "codex"];
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET = new Set(AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES);
function normalizeAgentToolResultMiddlewareRuntime(runtime) {
	const normalized = runtime.trim().toLowerCase();
	return AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET.has(normalized) ? normalized : void 0;
}
function normalizeAgentToolResultMiddlewareRuntimes(options) {
	const requested = options?.runtimes;
	if (!requested) return [...AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES];
	const normalized = [];
	for (const runtime of requested) {
		const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
		if (!value) continue;
		if (!normalized.includes(value)) normalized.push(value);
	}
	return normalized;
}
function normalizeAgentToolResultMiddlewareRuntimeIds(runtimes) {
	const normalized = [];
	for (const runtime of runtimes ?? []) {
		const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
		if (value && !normalized.includes(value)) normalized.push(value);
	}
	return normalized;
}
function sameMiddlewareScope(left, right) {
	return left.runtimes.length === right.runtimes.length && left.runtimes.every((runtime) => right.runtimes.includes(runtime)) && (left.matcher ?? []).length === (right.matcher ?? []).length && (left.matcher ?? []).every((toolName) => right.matcher?.includes(toolName));
}
function readAgentToolResultMiddlewareScopes(registration) {
	return registration.scopes?.length ? registration.scopes : [{ runtimes: registration.runtimes }];
}
function appendAgentToolResultMiddlewareScope(registration, scope) {
	const normalizedMatcher = normalizePluginToolMatcher(scope.matcher);
	const normalizedScope = {
		runtimes: [...scope.runtimes],
		...normalizedMatcher ? { matcher: normalizedMatcher } : {}
	};
	const scopes = readAgentToolResultMiddlewareScopes(registration);
	if (!scopes.some((existing) => sameMiddlewareScope(existing, normalizedScope))) registration.scopes = [...scopes, normalizedScope];
	else if (!registration.scopes) registration.scopes = scopes;
	registration.runtimes = normalizeAgentToolResultMiddlewareRuntimeIds(readAgentToolResultMiddlewareScopes(registration).flatMap((entry) => entry.runtimes));
}
function agentToolResultMiddlewareRegistrationCoversTool(registration, runtime, toolName) {
	return readAgentToolResultMiddlewareScopes(registration).some((scope) => scope.runtimes.includes(runtime) && pluginToolMatcherCoversTool(scope.matcher, toolName));
}
function getAgentToolResultMiddlewareMatcherScope(runtime) {
	return createPluginToolMatcherScope((getActivePluginRegistry()?.agentToolResultMiddlewares ?? []).flatMap((registration) => readAgentToolResultMiddlewareScopes(registration).filter((scope) => scope.runtimes.includes(runtime)).map((scope) => scope.matcher)));
}
function listAgentToolResultMiddlewares(runtime) {
	return getActivePluginRegistry()?.agentToolResultMiddlewares?.filter((entry) => entry.runtimes.includes(runtime)).map((entry) => entry.handler) ?? [];
}
//#endregion
//#region src/plugins/loader-cache-state.ts
/** Cache state helper for plugin loader registries, in-flight loads, and warning suppression. */
/** Error thrown when one plugin registry cache key attempts nested loading. */
var PluginLoadReentryError = class extends Error {
	constructor(cacheKey) {
		super(`plugin load reentry detected for cache key: ${cacheKey}`);
		this.name = "PluginLoadReentryError";
		this.cacheKey = cacheKey;
	}
};
/** Small registry cache with reentry detection and per-key warning memory. */
var PluginLoaderCacheState = class {
	#registryCache;
	#inFlightLoads = /* @__PURE__ */ new Set();
	#openAllowlistWarningCache;
	constructor(defaultMaxEntries) {
		this.#registryCache = new PluginLruCache(defaultMaxEntries);
		this.#openAllowlistWarningCache = new PluginLruCache(defaultMaxEntries);
	}
	clear() {
		this.#registryCache.clear();
		this.#inFlightLoads.clear();
		this.#openAllowlistWarningCache.clear();
	}
	clearCachedRegistries() {
		this.#registryCache.clear();
		this.#openAllowlistWarningCache.clear();
	}
	get(cacheKey) {
		return this.#registryCache.get(cacheKey);
	}
	set(cacheKey, state) {
		this.#registryCache.set(cacheKey, state);
	}
	isLoadInFlight(cacheKey) {
		return this.#inFlightLoads.has(cacheKey);
	}
	beginLoad(cacheKey) {
		if (this.#inFlightLoads.has(cacheKey)) throw new PluginLoadReentryError(cacheKey);
		this.#inFlightLoads.add(cacheKey);
	}
	finishLoad(cacheKey) {
		this.#inFlightLoads.delete(cacheKey);
	}
	hasOpenAllowlistWarning(cacheKey) {
		return this.#openAllowlistWarningCache.get(cacheKey) === true;
	}
	recordOpenAllowlistWarning(cacheKey) {
		this.#openAllowlistWarningCache.set(cacheKey, true);
	}
};
//#endregion
//#region src/plugins/loader-load-context.ts
function resolveBundledPackageRootForCache(stockRoot) {
	if (!stockRoot) return;
	const resolved = path.resolve(stockRoot);
	const parent = path.dirname(resolved);
	if (path.basename(resolved) === "extensions" && (path.basename(parent) === "dist" || path.basename(parent) === "dist-runtime")) return path.dirname(parent);
	const sourcePackageRoot = parent;
	return fs.existsSync(path.join(sourcePackageRoot, "package.json")) ? sourcePackageRoot : void 0;
}
function readPackageVersionForCache(packageJsonPath) {
	const parsed = tryReadJsonSync(packageJsonPath);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "unknown";
	const version = parsed.version;
	return typeof version === "string" && version.trim() ? version.trim() : "unknown";
}
const bundledPackageCacheIdentityByStockRoot = /* @__PURE__ */ new Map();
const runtimeBindingCacheIds = /* @__PURE__ */ new WeakMap();
let nextRuntimeBindingCacheId = 1;
function resolveRuntimeBindingCacheId(value) {
	if (!value) return;
	const existing = runtimeBindingCacheIds.get(value);
	if (existing !== void 0) return existing;
	const id = nextRuntimeBindingCacheId++;
	runtimeBindingCacheIds.set(value, id);
	return id;
}
function resolveRuntimeBindingCacheIdentity(runtimeOptions) {
	return JSON.stringify({
		nodes: resolveRuntimeBindingCacheId(runtimeOptions?.nodes),
		subagent: resolveRuntimeBindingCacheId(runtimeOptions?.subagent)
	});
}
function resolveBundledPackageCacheIdentity(stockRoot) {
	if (!stockRoot) return;
	const packageRoot = resolveBundledPackageRootForCache(stockRoot);
	if (!packageRoot) return;
	const stockRootKey = path.resolve(stockRoot);
	const cached = bundledPackageCacheIdentityByStockRoot.get(stockRootKey);
	if (cached) return cached;
	const packageJsonPath = path.join(packageRoot, "package.json");
	let identity;
	try {
		const stat = fs.statSync(packageJsonPath);
		identity = {
			packageJson: resolveRealpathOrAbsolute(packageJsonPath),
			packageRoot: resolveRealpathOrAbsolute(packageRoot),
			packageVersion: readPackageVersionForCache(packageJsonPath),
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	} catch {
		identity = {
			packageJson: path.resolve(packageJsonPath),
			packageRoot: resolveRealpathOrAbsolute(packageRoot),
			packageVersion: "missing",
			size: -1,
			mtimeMs: -1
		};
	}
	bundledPackageCacheIdentityByStockRoot.set(stockRootKey, identity);
	return identity;
}
function buildActivationMetadataHash(params) {
	const enabledSourceChannels = Object.entries(params.activationSource.rootConfig?.channels ?? {}).filter(([, value]) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		return value.enabled === true;
	}).map(([channelId]) => channelId).toSorted((left, right) => left.localeCompare(right));
	const pluginEntryStates = Object.entries(params.activationSource.plugins.entries).map(([pluginId, entry]) => [pluginId, entry?.enabled ?? null]).toSorted(([left], [right]) => left.localeCompare(right));
	const autoEnableReasonEntries = Object.entries(params.autoEnabledReasons).map(([pluginId, reasons]) => [pluginId, [...reasons]]).toSorted(([left], [right]) => left.localeCompare(right));
	return createHash("sha256").update(JSON.stringify({
		enabled: params.activationSource.plugins.enabled,
		allow: params.activationSource.plugins.allow,
		deny: params.activationSource.plugins.deny,
		memorySlot: params.activationSource.plugins.slots.memory,
		entries: pluginEntryStates,
		enabledChannels: enabledSourceChannels,
		autoEnabledReasons: autoEnableReasonEntries
	})).digest("hex");
}
function buildCacheKey(params) {
	const discoveryContext = resolvePluginDiscoveryContext({
		workspaceDir: params.workspaceDir,
		loadPaths: params.plugins.loadPaths,
		env: params.env
	});
	const { roots, loadPaths } = discoveryContext;
	const bundledPackage = resolveBundledPackageCacheIdentity(roots.stock);
	const installs = Object.fromEntries(Object.entries(params.installs ?? {}).map(([pluginId, install]) => [pluginId, {
		...install,
		installPath: typeof install.installPath === "string" ? resolveUserPath(install.installPath, params.env) : install.installPath,
		sourcePath: typeof install.sourcePath === "string" ? resolveUserPath(install.sourcePath, params.env) : install.sourcePath
	}]));
	const setupOnlyKey = params.includeSetupOnlyChannelPlugins === true ? "setup-only" : "runtime";
	const setupOnlyModeKey = params.forceSetupOnlyChannelPlugins === true ? "force-setup" : "normal-setup";
	const setupOnlyRequirementKey = params.requireSetupEntryForSetupOnlyChannelPlugins === true ? "require-setup-entry" : "allow-full-fallback";
	const bundledArtifactMode = params.preferBuiltPluginArtifacts === true ? "prefer-built-artifacts" : "source-default";
	const rawConfigEnvMode = params.resolveRawConfigEnvVars === true ? "resolve-raw-env" : "runtime-config";
	const moduleLoadMode = params.loadModules === false ? "manifest-only" : "load-modules";
	const discoveryMode = params.toolDiscovery === true ? "tool-discovery" : "default-discovery";
	const activationMode = params.activate === false ? "snapshot" : "active";
	const cacheIdentity = `${roots.workspace ?? ""}::${roots.global ?? ""}::${roots.stock ?? ""}::${JSON.stringify({
		bundledPackage,
		devSourceRoot: params.devSourceRoot ?? "",
		discoveryFingerprint: fingerprintPluginDiscoveryContext(discoveryContext),
		...params.plugins,
		installs,
		loadPaths,
		activationMetadataKey: params.activationMetadataKey ?? "",
		allowProcessHomeSessionCatalogs: params.allowProcessHomeSessionCatalogs !== false
	})}::${serializePluginIdScope(params.onlyPluginIds)}::${setupOnlyKey}::${setupOnlyModeKey}::${setupOnlyRequirementKey}::${params.channelPluginLoadIntent}::${bundledArtifactMode}::${rawConfigEnvMode}::${moduleLoadMode}::${discoveryMode}::${params.runtimeSubagentMode ?? "default"}::${params.runtimeBindingIdentity ?? "{}"}::${params.pluginSdkResolution ?? "auto"}::${JSON.stringify(params.coreGatewayMethodNames ?? [])}::${activationMode}`;
	return createHash("sha256").update(cacheIdentity).digest("hex");
}
function resolveRuntimeSubagentMode(runtimeOptions) {
	if (runtimeOptions?.allowGatewaySubagentBinding === true) return "gateway-bindable";
	return runtimeOptions?.subagent ? "explicit" : "default";
}
function resolveCoreGatewayMethodNames(options) {
	const names = new Set(options.coreGatewayMethodNames ?? []);
	for (const name of Object.keys(options.coreGatewayHandlers ?? {})) names.add(name);
	return Array.from(names).toSorted();
}
function mergePluginTrustList(runtimeList, sourceList) {
	if (sourceList.length === 0) return runtimeList;
	const merged = [...runtimeList];
	const seen = new Set(merged);
	for (const entry of sourceList) if (!seen.has(entry)) {
		merged.push(entry);
		seen.add(entry);
	}
	return merged.length === runtimeList.length ? runtimeList : merged;
}
function mergeTrustPluginConfigFromActivationSource(params) {
	const source = params.activationSource.plugins;
	const allow = mergePluginTrustList(params.normalized.allow, source.allow);
	const deny = mergePluginTrustList(params.normalized.deny, source.deny);
	const loadPaths = mergePluginTrustList(params.normalized.loadPaths, source.loadPaths);
	if (allow === params.normalized.allow && deny === params.normalized.deny && loadPaths === params.normalized.loadPaths) return params.normalized;
	return {
		...params.normalized,
		allow,
		deny,
		loadPaths
	};
}
function resolvePluginLoadCacheContext(options = {}) {
	const shouldResolveRawConfigEnvVars = options.resolveRawConfigEnvVars === true;
	const baseEnv = options.env ?? process.env;
	const rawConfig = options.config ?? {};
	const rawActivationSourceConfig = resolvePluginActivationSourceConfig({
		config: options.config,
		activationSourceConfig: options.activationSourceConfig
	});
	const env = shouldResolveRawConfigEnvVars ? createConfigRuntimeEnv(rawConfig, baseEnv) : baseEnv;
	const cfg = applyTestPluginDefaults(shouldResolveRawConfigEnvVars ? resolveConfigEnvVars(rawConfig, env, { onMissing: () => void 0 }) : rawConfig, env);
	const activationSourceConfig = shouldResolveRawConfigEnvVars ? resolveConfigEnvVars(rawActivationSourceConfig, env, { onMissing: () => void 0 }) : rawActivationSourceConfig;
	const normalized = normalizePluginsConfig(cfg.plugins);
	const activationSource = createPluginActivationSource({ config: activationSourceConfig });
	const trustNormalized = mergeTrustPluginConfigFromActivationSource({
		normalized,
		activationSource
	});
	const onlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
	const includeSetupOnlyChannelPlugins = options.includeSetupOnlyChannelPlugins === true;
	const forceSetupOnlyChannelPlugins = options.forceSetupOnlyChannelPlugins === true;
	const requireSetupEntryForSetupOnlyChannelPlugins = options.requireSetupEntryForSetupOnlyChannelPlugins === true;
	const channelPluginLoadIntent = options.channelPluginLoadIntent ?? "full";
	const preferBuiltPluginArtifacts = options.preferBuiltPluginArtifacts === true;
	const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
	const coreGatewayMethodNames = resolveCoreGatewayMethodNames(options);
	const currentMetadataSnapshot = options.installRecords === void 0 && trustNormalized.loadPaths === normalized.loadPaths && !shouldResolveRawConfigEnvVars && (options.env === void 0 || options.env === process.env) ? getCurrentPluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: options.workspaceDir
	}) ?? (onlyPluginIds !== void 0 ? getCurrentPluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: options.workspaceDir,
		pluginIds: onlyPluginIds
	}) : void 0) : void 0;
	const preparedInstallRecords = currentMetadataSnapshot && (options.manifestRegistry === void 0 || options.manifestRegistry === currentMetadataSnapshot.manifestRegistry) ? extractPluginInstallRecordsFromInstalledPluginIndex(currentMetadataSnapshot.index) : void 0;
	const installRecords = {
		...options.installRecords ?? preparedInstallRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env }),
		...cfg.plugins?.installs
	};
	const devSourceRoot = resolveOpenClawDevSourceRoot(env);
	const cacheKey = buildCacheKey({
		workspaceDir: options.workspaceDir,
		plugins: trustNormalized,
		activationMetadataKey: buildActivationMetadataHash({
			activationSource,
			autoEnabledReasons: options.autoEnabledReasons ?? {}
		}),
		installs: installRecords,
		env,
		devSourceRoot,
		onlyPluginIds,
		includeSetupOnlyChannelPlugins,
		forceSetupOnlyChannelPlugins,
		requireSetupEntryForSetupOnlyChannelPlugins,
		channelPluginLoadIntent,
		preferBuiltPluginArtifacts,
		resolveRawConfigEnvVars: options.resolveRawConfigEnvVars,
		toolDiscovery: options.toolDiscovery,
		loadModules: options.loadModules,
		runtimeSubagentMode,
		runtimeBindingIdentity: resolveRuntimeBindingCacheIdentity(options.runtimeOptions),
		pluginSdkResolution: options.pluginSdkResolution,
		coreGatewayMethodNames,
		allowProcessHomeSessionCatalogs: options.allowProcessHomeSessionCatalogs,
		activate: options.activate
	});
	return {
		env,
		cfg,
		metadataSnapshot: currentMetadataSnapshot,
		normalized: trustNormalized,
		activationSourceConfig,
		activationSource,
		autoEnabledReasons: options.autoEnabledReasons ?? {},
		onlyPluginIds,
		includeSetupOnlyChannelPlugins,
		forceSetupOnlyChannelPlugins,
		requireSetupEntryForSetupOnlyChannelPlugins,
		channelPluginLoadIntent,
		preferBuiltPluginArtifacts,
		shouldActivate: options.activate !== false,
		shouldLoadModules: options.loadModules !== false,
		runtimeSubagentMode,
		installRecords,
		devSourceRoot,
		cacheKey
	};
}
const pluginLoaderCacheState = new PluginLoaderCacheState(128);
function setCachedPluginRegistry(cacheKey, registry) {
	pluginLoaderCacheState.set(cacheKey, registry);
}
function getReusableCachedPluginRegistry(cacheKey) {
	return pluginLoaderCacheState.get(cacheKey);
}
function clearPluginRegistryLoadCache() {
	clearPluginRuntimeArtifactResolutionMemo();
	pluginLoaderCacheState.clearCachedRegistries();
}
function resolvePluginRegistryLoadCacheKey(options = {}) {
	return resolvePluginLoadCacheContext(options).cacheKey;
}
function isPluginRegistryLoadInFlight(options = {}) {
	return pluginLoaderCacheState.isLoadInFlight(resolvePluginRegistryLoadCacheKey(options));
}
//#endregion
//#region src/plugins/loader-provenance.ts
function createPathMatcher() {
	return {
		exact: /* @__PURE__ */ new Set(),
		dirs: []
	};
}
function addPathToMatcher(matcher, rawPath, env = process.env) {
	const trimmed = rawPath.trim();
	if (!trimmed) return;
	const resolved = resolveUserPath(trimmed, env);
	if (!resolved) return;
	const canonical = safeRealpathSync(resolved) ?? resolved;
	if (matcher.exact.has(canonical) || matcher.dirs.includes(canonical)) return;
	if (safeStatSync(canonical)?.isDirectory()) {
		matcher.dirs.push(canonical);
		return;
	}
	matcher.exact.add(canonical);
}
function matchesPathMatcher(matcher, sourcePath) {
	if (matcher.exact.has(sourcePath)) return true;
	return matcher.dirs.some((dirPath) => isPathInside(dirPath, sourcePath));
}
function formatPluginInspectCommand(pluginId) {
	return `openclaw plugins inspect ${quoteCliArg(pluginId)}`;
}
/** Builds provenance matchers from configured load paths and install records. */
function buildProvenanceIndex(params) {
	const loadPathMatcher = createPathMatcher();
	for (const loadPath of params.normalizedLoadPaths) addPathToMatcher(loadPathMatcher, loadPath, params.env);
	const installRules = /* @__PURE__ */ new Map();
	const installs = params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
	for (const [pluginId, install] of Object.entries(installs)) {
		const rule = {
			trackedWithoutPaths: false,
			matcher: createPathMatcher()
		};
		const trackedPaths = normalizeTrimmedStringList([install.installPath, install.sourcePath]);
		if (trackedPaths.length === 0) rule.trackedWithoutPaths = true;
		else for (const trackedPath of trackedPaths) addPathToMatcher(rule.matcher, trackedPath, params.env);
		installRules.set(pluginId, rule);
	}
	return {
		loadPathMatcher,
		installRules
	};
}
function isTrackedByProvenance(params) {
	const sourcePath = resolveUserPath(params.source, params.env);
	const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
	const installRule = params.index.installRules.get(params.pluginId);
	if (installRule) {
		if (installRule.trackedWithoutPaths) return true;
		if (matchesPathMatcher(installRule.matcher, canonicalSourcePath)) return true;
	}
	return matchesPathMatcher(params.index.loadPathMatcher, canonicalSourcePath);
}
function matchesExplicitInstallRule(params) {
	const sourcePath = resolveUserPath(params.source, params.env);
	const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
	const installRule = params.index.installRules.get(params.pluginId);
	if (!installRule || installRule.trackedWithoutPaths) return false;
	return matchesPathMatcher(installRule.matcher, canonicalSourcePath);
}
function resolveCandidateDuplicateRank(params) {
	const installOwner = isPluginCandidateInstallOwnerAmbiguous(params.candidate) ? void 0 : resolvePluginCandidateInstallOwner(params.candidate);
	const isExplicitInstall = params.candidate.origin === "global" && installOwner !== void 0 && matchesExplicitInstallRule({
		pluginId: installOwner,
		source: params.candidate.source,
		index: params.provenance,
		env: params.env
	});
	if (params.candidate.origin === "config") return 0;
	if (params.candidate.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "global" && isExplicitInstall) return 2;
	if (params.candidate.origin === "bundled") return 3;
	if (params.candidate.origin === "workspace") return 4;
	return 5;
}
/** Orders duplicate plugin candidates by configured, installed, bundled, then workspace trust. */
function compareDuplicateCandidateOrder(params) {
	const leftPluginId = params.manifestBySource.get(params.left.source)?.id;
	const rightPluginId = params.manifestBySource.get(params.right.source)?.id;
	if (!leftPluginId || leftPluginId !== rightPluginId) return 0;
	return resolveCandidateDuplicateRank({
		candidate: params.left,
		provenance: params.provenance,
		env: params.env
	}) - resolveCandidateDuplicateRank({
		candidate: params.right,
		provenance: params.provenance,
		env: params.env
	});
}
/** Warns when an open plugin allowlist may auto-load non-bundled plugins. */
function warnWhenAllowlistIsOpen(params) {
	if (!params.emitWarning) return;
	if (!params.pluginsEnabled) return;
	const autoDiscoverable = params.discoverablePlugins.filter((entry) => (entry.origin === "workspace" || entry.origin === "global") && !params.explicitlyEnabledPluginIds?.has(entry.id));
	if (autoDiscoverable.length === 0) return;
	const allDiscoveredIds = new Set(params.discoverablePlugins.map((entry) => entry.id));
	const hasConfiguredAllowlist = params.allow.length > 0;
	const allowHasDiscoveredMatch = params.allow.some((id) => allDiscoveredIds.has(id));
	if (hasConfiguredAllowlist && allowHasDiscoveredMatch) return;
	if (params.warningCache.hasOpenAllowlistWarning(params.warningCacheKey)) return;
	const preview = autoDiscoverable.slice(0, 6).map((entry) => `${entry.id} (${entry.source})`).join(", ");
	const truncated = autoDiscoverable.length > 6;
	const extra = truncated ? ` (+${autoDiscoverable.length - 6} more)` : "";
	const inspectCommands = autoDiscoverable.map((entry) => `'${formatPluginInspectCommand(entry.id)}'`).join(", ");
	const remediation = truncated ? "Run 'openclaw plugins list --enabled --verbose' to enumerate every discovered plugin id, inspect trusted ids with 'openclaw plugins inspect <id>', and add the ones you trust to plugins.allow in openclaw.json." : `To trust them explicitly, set plugins.allow in openclaw.json (e.g. "plugins": { "allow": [${autoDiscoverable.map((entry) => JSON.stringify(entry.id)).join(", ")}] }). Run 'openclaw plugins list --enabled --verbose' or ${inspectCommands} to confirm plugin ids.`;
	params.warningCache.recordOpenAllowlistWarning(params.warningCacheKey);
	if (!hasConfiguredAllowlist) {
		params.logger.warn(`[plugins] plugins.allow is empty; discovered non-bundled plugins may auto-load: ${preview}${extra}. ${remediation}`);
		return;
	}
	const unmatchedEntries = params.allow.filter((id) => !allDiscoveredIds.has(id));
	const unmatchedPreview = unmatchedEntries.slice(0, 6).map((id) => `"${id}"`).join(", ");
	const unmatchedExtra = unmatchedEntries.length > 6 ? ` (+${unmatchedEntries.length - 6} more)` : "";
	params.logger.warn(`[plugins] plugins.allow entries ${unmatchedPreview}${unmatchedExtra} do not match any discovered plugin ids; discovered non-bundled plugins: ${preview}${extra}. Use the plugin id (not a channel id or npm package name).`);
}
/** Adds diagnostics for loaded plugins without install or load-path provenance. */
function warnAboutUntrackedLoadedPlugins(params) {
	const allowSet = new Set(params.allowlist);
	for (const plugin of params.registry.plugins) {
		if (plugin.status !== "loaded" || plugin.origin === "bundled") continue;
		if (allowSet.has(plugin.id)) continue;
		const installOwner = resolvePluginInstallOwnerLookup(params)?.get(plugin.id);
		if (installOwner && isTrackedByProvenance({
			pluginId: installOwner,
			source: plugin.source,
			index: params.provenance,
			env: params.env
		})) continue;
		const message = `OpenClaw can't verify where this plugin came from. Review it with '${formatPluginInspectCommand(plugin.id)}'. Adding it to plugins.allow lets it load, but does not make it trusted. If it's an official plugin, reinstall it from its official npm package or its official ClawHub listing to enable trusted features.`;
		params.registry.diagnostics.push({
			level: "warn",
			pluginId: plugin.id,
			source: plugin.source,
			message
		});
		if (params.emitWarning) params.logger.warn(`[plugins] ${plugin.id}: ${message} (${plugin.source})`);
	}
}
//#endregion
//#region src/plugins/loader-discovery.ts
function resolvePluginLoadDiscovery(params) {
	const { options, context } = params;
	const suppliedManifestRegistry = params.suppliedManifestRegistry ?? (options.discovery === void 0 ? context.metadataSnapshot?.manifestRegistry : void 0);
	const discovery = suppliedManifestRegistry ? {
		candidates: createPluginCandidatesFromManifestRegistry(suppliedManifestRegistry),
		diagnostics: []
	} : options.discovery ?? discoverOpenClawPlugins({
		workspaceDir: options.workspaceDir,
		extraPaths: context.normalized.loadPaths,
		env: context.env,
		installRecords: context.installRecords
	});
	const manifestRegistry = suppliedManifestRegistry ?? loadPluginManifestRegistryCore({
		config: context.cfg,
		workspaceDir: options.workspaceDir,
		env: context.env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics,
		installRecords: Object.keys(context.installRecords).length > 0 ? context.installRecords : void 0
	});
	pushDiagnostics(params.diagnostics, manifestRegistry.diagnostics);
	warnWhenAllowlistIsOpen({
		emitWarning: params.emitWarning,
		logger: params.logger,
		pluginsEnabled: context.normalized.enabled,
		allow: context.normalized.allow,
		warningCacheKey: params.warningCacheKey,
		warningCache: pluginLoaderCacheState,
		explicitlyEnabledPluginIds: new Set(Object.entries(context.normalized.entries).filter(([, entry]) => entry.enabled === true).map(([pluginId]) => pluginId)),
		discoverablePlugins: manifestRegistry.plugins.filter((plugin) => !params.onlyPluginIdSet || params.onlyPluginIdSet.has(plugin.id)).map((plugin) => ({
			id: plugin.id,
			source: plugin.source,
			origin: plugin.origin
		}))
	});
	const provenance = buildProvenanceIndex({
		normalizedLoadPaths: context.normalized.loadPaths,
		env: context.env,
		installRecords: context.installRecords
	});
	const manifestBySource = new Map(manifestRegistry.plugins.map((record) => [record.source, record]));
	return {
		discovery,
		manifestRegistry,
		orderedCandidates: [...discovery.candidates].toSorted((left, right) => compareDuplicateCandidateOrder({
			left,
			right,
			manifestBySource,
			provenance,
			env: context.env
		})),
		manifestBySource,
		provenance
	};
}
//#endregion
//#region src/plugins/api-lifecycle.ts
const PLUGIN_API_METHOD_POLICIES = {
	clearRunContext: {
		phase: "runtime",
		lateCallable: true
	},
	emitAgentEvent: {
		phase: "runtime",
		lateCallable: true
	},
	enqueueNextTurnInjection: {
		phase: "runtime",
		lateCallable: true
	},
	getRunContext: {
		phase: "runtime",
		lateCallable: true
	},
	sendSessionAttachment: {
		phase: "runtime",
		lateCallable: true
	},
	scheduleSessionTurn: {
		phase: "runtime",
		lateCallable: true
	},
	setRunContext: {
		phase: "runtime",
		lateCallable: true
	},
	unscheduleSessionTurnsByTag: {
		phase: "runtime",
		lateCallable: true
	}
};
/** Returns lifecycle policy for one plugin API method name. */
function getPluginApiMethodLifecyclePolicy(methodName) {
	return PLUGIN_API_METHOD_POLICIES[methodName];
}
/** True when a plugin API method remains callable after registration. */
function isLateCallablePluginApiMethod(methodName) {
	return getPluginApiMethodLifecyclePolicy(methodName)?.lateCallable === true;
}
//#endregion
//#region src/plugins/loader-module-runtime.ts
const LAZY_RUNTIME_REFLECTION_KEYS = [
	"version",
	"gateway",
	"config",
	"agent",
	"subagent",
	"system",
	"media",
	"mediaUnderstanding",
	"tts",
	"channel",
	"events",
	"logging",
	"state",
	"modelAuth",
	"imageGeneration",
	"videoGeneration",
	"musicGeneration",
	"llm"
];
function createGuardedPluginRegistrationApi(api) {
	let closed = false;
	return {
		api: attachPluginApiFacades(new Proxy(api, { get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof value !== "function") return value;
			if (typeof prop === "string" && isLateCallablePluginApiMethod(prop)) return (...args) => Reflect.apply(value, target, args);
			return (...args) => {
				if (closed) return;
				return Reflect.apply(value, target, args);
			};
		} })),
		close: () => {
			closed = true;
		}
	};
}
function runPluginRegisterSync(register, api) {
	const guarded = createGuardedPluginRegistrationApi(api);
	try {
		const result = register(guarded.api);
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => {});
			throw new Error("plugin register must be synchronous");
		}
	} finally {
		guarded.close();
	}
}
function runPluginRegisterSyncInRegistry(register, api, registry, pluginId) {
	withPluginRegistrationContext(registry, pluginId, () => runPluginRegisterSync(register, api));
}
function createPluginModuleLoader(options) {
	const moduleLoaders = createPluginModuleLoaderCache();
	const createLoaderForModule = (modulePath) => {
		if (options.installNativeSdkResolver !== false && options.tryNative !== false) installOpenClawPluginSdkNativeResolver({
			argv1: process.argv[1],
			moduleUrl: import.meta.url,
			pluginModulePath: modulePath,
			devSourceRoot: options.devSourceRoot,
			pluginSdkResolution: options.pluginSdkResolution
		});
		const aliasMap = buildPluginLoaderAliasMap(modulePath, process.argv[1], import.meta.url, options.pluginSdkResolution, options.devSourceRoot);
		return getCachedPluginModuleLoader({
			cache: moduleLoaders,
			modulePath,
			importerUrl: import.meta.url,
			loaderFilename: options.loaderFilename ?? modulePath,
			devSourceRoot: options.devSourceRoot,
			aliasMap,
			pluginSdkResolution: options.pluginSdkResolution,
			...options.tryNative !== void 0 ? { tryNative: options.tryNative } : {}
		});
	};
	return (modulePath) => createLoaderForModule(modulePath)(toSafeImportPath(modulePath));
}
function formatPluginRuntimeModuleResolutionError(params) {
	const { resolution } = params;
	const candidates = resolution.candidates.length > 0 ? resolution.candidates.join(", ") : "<none>";
	return [
		"Unable to resolve plugin runtime module",
		`loader=${resolution.modulePath ?? "<unresolved>"}`,
		`packageRoot=${resolution.packageRoot ?? "<none>"}`,
		`pluginSdkResolution=${params.pluginSdkResolution ?? "auto"}`,
		`candidates=${candidates}`,
		...resolution.error ? [`resolverError=${resolution.error}`] : []
	].join("; ");
}
/** Lazily materializes the broad plugin runtime only when registration reads it. */
function createLazyPluginRuntime(params) {
	let createPluginRuntimeFactory = null;
	const resolveCreatePluginRuntime = () => {
		if (createPluginRuntimeFactory) return createPluginRuntimeFactory;
		const resolution = resolvePluginRuntimeModulePathWithDiagnostics({
			devSourceRoot: params.devSourceRoot,
			pluginSdkResolution: params.pluginSdkResolution
		});
		if (!resolution.resolvedPath) throw new Error(formatPluginRuntimeModuleResolutionError({
			resolution,
			pluginSdkResolution: params.pluginSdkResolution
		}));
		const resolvedPath = resolution.resolvedPath;
		const runtimeModule = withProfile({ source: resolvedPath }, "runtime-module", () => params.loadPluginModule(resolvedPath));
		if (typeof runtimeModule.createPluginRuntime !== "function") throw new Error("Plugin runtime module missing createPluginRuntime export");
		createPluginRuntimeFactory = runtimeModule.createPluginRuntime;
		return createPluginRuntimeFactory;
	};
	let resolvedRuntime = null;
	const resolveRuntime = () => {
		resolvedRuntime ??= resolveCreatePluginRuntime()(params.runtimeOptions);
		return resolvedRuntime;
	};
	const lazyRuntimeReflectionKeySet = new Set(LAZY_RUNTIME_REFLECTION_KEYS);
	const resolveLazyRuntimeDescriptor = (prop) => {
		if (!lazyRuntimeReflectionKeySet.has(prop)) return Reflect.getOwnPropertyDescriptor(resolveRuntime(), prop);
		return {
			configurable: true,
			enumerable: true,
			get() {
				return Reflect.get(resolveRuntime(), prop);
			},
			set(value) {
				Reflect.set(resolveRuntime(), prop, value);
			}
		};
	};
	return new Proxy({}, {
		get(_target, prop, receiver) {
			if (prop === "gateway" || prop === "nodes" || prop === "subagent") {
				const value = params.runtimeOptions?.[prop];
				if (value !== void 0) return value;
			}
			return Reflect.get(resolveRuntime(), prop, receiver);
		},
		set(_target, prop, value, receiver) {
			return Reflect.set(resolveRuntime(), prop, value, receiver);
		},
		has(_target, prop) {
			return lazyRuntimeReflectionKeySet.has(prop) || Reflect.has(resolveRuntime(), prop);
		},
		ownKeys() {
			return [...LAZY_RUNTIME_REFLECTION_KEYS];
		},
		getOwnPropertyDescriptor(_target, prop) {
			return resolveLazyRuntimeDescriptor(prop);
		},
		defineProperty(_target, prop, attributes) {
			return Reflect.defineProperty(resolveRuntime(), prop, attributes);
		},
		deleteProperty(_target, prop) {
			return Reflect.deleteProperty(resolveRuntime(), prop);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(resolveRuntime());
		}
	});
}
function resolvePluginModuleExport(moduleExport) {
	const seen = /* @__PURE__ */ new Set();
	const candidates = [unwrapDefaultModuleExport(moduleExport), moduleExport];
	for (let index = 0; index < candidates.length && index < 12; index += 1) {
		const resolved = candidates[index];
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		if (typeof resolved === "function") return { register: resolved };
		if (resolved && typeof resolved === "object") {
			const definition = resolved;
			const register = definition.register;
			if (typeof register === "function") return {
				definition,
				register
			};
			for (const key of ["default", "module"]) if (key in definition) candidates.push(definition[key]);
		}
	}
	const resolved = candidates[0];
	if (typeof resolved === "function") return { register: resolved };
	if (resolved && typeof resolved === "object") {
		const definition = resolved;
		return {
			definition,
			register: definition.register
		};
	}
	return {};
}
function kindIncludes(kind, target) {
	return kind === target || Array.isArray(kind) && kind.includes(target);
}
function formatBundledChannelWrongLoaderError(kind) {
	if (kindIncludes(kind, "bundled-channel-setup-entry")) return "bundled channel setup entry requires setup-runtime loader";
	if (kindIncludes(kind, "bundled-channel-entry")) return "bundled channel entry requires setup-runtime loader";
	return null;
}
//#endregion
//#region src/plugins/loader-channel-runtime.ts
/**
* Handles the setup-entry channel path.
* Returns true when the candidate is complete (loaded, disabled, or failed).
*/
function loadSetupRuntimeChannelCandidate(params) {
	const { manifestRecord, record, registrationPlan, runtimeCandidateEntry, registryBuilder } = params;
	if (!registrationPlan.loadSetupEntry || !manifestRecord.setupSource) return false;
	const setupRegistration = resolveSetupChannelRegistration(params.mod);
	if (setupRegistration.loadError) {
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "load",
			error: setupRegistration.loadError,
			logPrefix: `[plugins] ${record.id} failed to load setup entry from ${record.source}: `,
			diagnosticMessagePrefix: "failed to load setup entry: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	if (!setupRegistration.plugin) return false;
	if (!channelPluginIdBelongsToManifest({
		channelId: setupRegistration.plugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${setupRegistration.plugin.id}")`);
		return true;
	}
	const api = registryBuilder.createApi(record, {
		config: params.cfg,
		pluginConfig: {},
		hookPolicy: params.entry?.hooks,
		registrationMode: registrationPlan.mode
	});
	let mergedSetupRegistration = setupRegistration;
	let runtimeSetterApplied = false;
	if (registrationPlan.loadSetupRuntimeEntry && setupRegistration.usesBundledSetupContract && resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source) !== params.safeSource) {
		const runtimeModuleSource = resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.source);
		const runtimeOpened = openRootFileSync({
			absolutePath: runtimeModuleSource,
			rootPath: resolveCanonicalDistRuntimeSource(runtimeCandidateEntry.rootDir),
			boundaryLabel: "plugin root",
			rejectHardlinks: params.rejectHardlinks,
			skipLexicalRootCheck: true
		});
		if (!runtimeOpened.ok) {
			params.pushPluginLoadError(describeRootFileOpenFailure({
				failure: runtimeOpened,
				subject: "plugin entry path",
				boundaryLabel: "plugin root",
				filePath: runtimeModuleSource
			}));
			return true;
		}
		const safeRuntimeSource = runtimeOpened.path;
		fs.closeSync(runtimeOpened.fd);
		let runtimeMod;
		try {
			runtimeMod = withProfile({
				pluginId: record.id,
				source: safeRuntimeSource
			}, "load-setup-runtime-entry", () => params.loadPluginModule(safeRuntimeSource));
		} catch (error) {
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "load",
				error,
				logPrefix: `[plugins] ${record.id} failed to load setup-runtime entry from ${record.source}: `,
				diagnosticMessagePrefix: "failed to load setup-runtime entry: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
		const runtimeRegistration = resolveBundledRuntimeChannelRegistration(runtimeMod);
		if (runtimeRegistration.id && runtimeRegistration.id !== record.id) {
			params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime entry uses "${runtimeRegistration.id}")`);
			return true;
		}
		if (runtimeRegistration.setChannelRuntime) try {
			runtimeRegistration.setChannelRuntime(api.runtime);
			runtimeSetterApplied = true;
		} catch (error) {
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "load",
				error,
				logPrefix: `[plugins] ${record.id} failed to apply setup-runtime channel runtime from ${record.source}: `,
				diagnosticMessagePrefix: "failed to apply setup-runtime channel runtime: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
		const runtimePluginRegistration = loadBundledRuntimeChannelPlugin({ registration: runtimeRegistration });
		if (runtimePluginRegistration.loadError) {
			recordPluginError({
				logger: params.logger,
				registry: registryBuilder.registry,
				record,
				seenIds: params.seenIds,
				pluginId: record.id,
				origin: params.candidateOrigin,
				phase: "load",
				error: runtimePluginRegistration.loadError,
				logPrefix: `[plugins] ${record.id} failed to load setup-runtime channel entry from ${record.source}: `,
				diagnosticMessagePrefix: "failed to load setup-runtime channel entry: ",
				diagnosticCode: "channel-setup-failure"
			});
			return true;
		}
		if (runtimePluginRegistration.plugin) {
			if (runtimePluginRegistration.plugin.id && runtimePluginRegistration.plugin.id !== record.id) {
				params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime export uses "${runtimePluginRegistration.plugin.id}")`);
				return true;
			}
			mergedSetupRegistration = {
				...setupRegistration,
				plugin: mergeSetupRuntimeChannelPlugin(runtimePluginRegistration.plugin, setupRegistration.plugin),
				setChannelRuntime: runtimeRegistration.setChannelRuntime ?? setupRegistration.setChannelRuntime
			};
		}
	}
	const mergedSetupPlugin = mergedSetupRegistration.plugin;
	if (!mergedSetupPlugin) return true;
	if (!channelPluginIdBelongsToManifest({
		channelId: mergedSetupPlugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${mergedSetupPlugin.id}")`);
		return true;
	}
	if (!runtimeSetterApplied) try {
		mergedSetupRegistration.setChannelRuntime?.(api.runtime);
	} catch (error) {
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "load",
			error,
			logPrefix: `[plugins] ${record.id} failed to apply setup channel runtime from ${record.source}: `,
			diagnosticMessagePrefix: "failed to apply setup channel runtime: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	if (registrationPlan.mode === "setup-runtime" && mergedSetupRegistration.registerSetupRuntime) try {
		runPluginRegisterSyncInRegistry((registrationApi) => mergedSetupRegistration.registerSetupRuntime?.(registrationApi), api, registryBuilder.registry, record.id);
	} catch (error) {
		registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "register",
			error,
			logPrefix: `[plugins] ${record.id} failed to register setup-runtime channel side effects from ${record.source}: `,
			diagnosticMessagePrefix: "failed to register setup-runtime channel side effects: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	try {
		api.registerChannel(mergedSetupPlugin);
	} catch (error) {
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			pluginId: record.id,
			origin: params.candidateOrigin,
			phase: "load",
			error,
			logPrefix: `[plugins] ${record.id} failed to register setup channel from ${record.source}: `,
			diagnosticMessagePrefix: "failed to register setup channel: ",
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	}
	registryBuilder.registry.plugins.push(record);
	params.seenIds.set(record.id, params.candidateOrigin);
	return true;
}
//#endregion
//#region src/plugins/loader-registration-plan.ts
/** Converts loader intent into explicit entrypoint and activation behavior. */
function resolvePluginRegistrationPlan(params) {
	if (params.canLoadScopedSetupOnlyChannelPlugin) return {
		mode: "setup-only",
		loadSetupEntry: true,
		loadSetupRuntimeEntry: false,
		runRuntimeCapabilityPolicy: false,
		runFullActivationOnlyRegistrations: false
	};
	if (params.scopedSetupOnlyChannelPluginRequested && params.requireSetupEntryForSetupOnlyChannelPlugins) return null;
	if (!params.enableStateEnabled) return null;
	if (params.toolDiscovery) return {
		mode: "tool-discovery",
		loadSetupEntry: false,
		loadSetupRuntimeEntry: false,
		runRuntimeCapabilityPolicy: true,
		runFullActivationOnlyRegistrations: false
	};
	if (params.shouldLoadModules && !params.validateOnly && shouldLoadChannelPluginInSetupRuntime({
		manifestChannels: params.manifestRecord.channels,
		setupSource: params.manifestRecord.setupSource,
		cfg: params.cfg,
		env: params.env,
		channelPluginLoadIntent: params.channelPluginLoadIntent
	})) return {
		mode: "setup-runtime",
		loadSetupEntry: true,
		loadSetupRuntimeEntry: true,
		runRuntimeCapabilityPolicy: false,
		runFullActivationOnlyRegistrations: false
	};
	const mode = params.shouldActivate ? "full" : "discovery";
	return {
		mode,
		loadSetupEntry: false,
		loadSetupRuntimeEntry: false,
		runRuntimeCapabilityPolicy: true,
		runFullActivationOnlyRegistrations: mode === "full"
	};
}
//#endregion
//#region src/plugins/loader-runtime-candidate.ts
function loadRuntimePluginCandidate(params) {
	const { candidate, manifestRecord, context, state } = params;
	const { registry } = params.registryBuilder;
	const pluginId = manifestRecord.id;
	const policyId = normalizePluginPolicyId(pluginId);
	if (!matchesScopedPluginOrDreamingSidecar({
		onlyPluginIdSet: params.onlyPluginIdSet,
		pluginId,
		sidecar: params.dreamingSidecar
	})) return;
	const isDreamingSidecar = isAuthorizedDreamingSidecarPlugin({
		sidecar: params.dreamingSidecar,
		pluginId
	});
	const activationState = isDreamingSidecar ? {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "auto",
		reason: `dreaming sidecar for selected memory slot "${params.dreamingSidecar?.selectedMemoryPluginId ?? ""}"`
	} : resolveEffectivePluginActivationState({
		id: pluginId,
		origin: candidate.origin,
		config: context.normalized,
		rootConfig: context.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		activationSource: context.activationSource,
		autoEnabledReason: formatAutoEnabledActivationReason(context.autoEnabledReasons[pluginId])
	});
	const existingOrigin = state.seenIds.get(pluginId);
	if (existingOrigin) {
		const duplicate = createManifestPluginRecord({
			candidate,
			manifestRecord,
			enabled: false,
			activationState
		});
		duplicate.status = "disabled";
		duplicate.error = `overridden by ${existingOrigin} plugin`;
		markPluginActivationDisabled(duplicate, duplicate.error);
		registry.plugins.push(duplicate);
		return;
	}
	const enableState = isDreamingSidecar ? { enabled: true } : resolveEffectiveEnableState({
		id: pluginId,
		origin: candidate.origin,
		config: context.normalized,
		rootConfig: context.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		activationSource: context.activationSource
	});
	const entry = context.normalized.entries[policyId];
	const record = createManifestPluginRecord({
		candidate,
		manifestRecord,
		enabled: enableState.enabled,
		activationState
	});
	applyPluginManifestRecordDetails(record, manifestRecord);
	const pluginRoot = safeRealpathOrResolve(candidate.rootDir);
	const degradedPluginForId = findActiveDegradedPlugin(pluginId);
	const degradedPlugin = degradedPluginForId && degradedPluginMatchesRoot(degradedPluginForId, pluginRoot) ? degradedPluginForId : void 0;
	const clearMismatchedQuarantineAfterLoad = enableState.enabled && Boolean(degradedPluginForId) && !degradedPlugin;
	if (enableState.enabled && degradedPlugin) {
		recordPluginConfiguredUnavailable({
			registry,
			record,
			seenIds: state.seenIds,
			origin: candidate.origin,
			degradedPlugin
		});
		return;
	}
	const trustedLocalScopedChannelSetupImport = resolveManifestOwnerBasePolicyBlock({
		plugin: { id: pluginId },
		normalizedConfig: context.normalized
	}) === null && (hasExplicitManifestOwnerTrust({
		plugin: { id: pluginId },
		normalizedConfig: context.normalized
	}) || candidate.origin === "workspace" && activationState.source === "auto");
	const blockUntrustedLocalScopedChannelSetupImport = context.includeSetupOnlyChannelPlugins && !params.validateOnly && Boolean(params.onlyPluginIdSet) && manifestRecord.channels.length > 0 && candidate.origin !== "bundled" && !trustedLocalScopedChannelSetupImport;
	const pushPluginLoadError = (message) => pushPluginValidationError({
		registry,
		seenIds: state.seenIds,
		pluginId,
		origin: candidate.origin,
		record,
		message
	});
	if (blockUntrustedLocalScopedChannelSetupImport) {
		record.status = "disabled";
		record.error = activationState.reason ?? enableState.reason ?? "local plugin requires explicit trust for setup";
		markPluginActivationDisabled(record, record.error);
		registry.plugins.push(record);
		return;
	}
	const runtimeCandidateEntry = resolvePluginRuntimeArtifact({
		pluginId,
		entryKind: "runtime",
		source: candidate.source,
		rootDir: pluginRoot,
		origin: candidate.origin,
		preferBuiltPluginArtifacts: context.preferBuiltPluginArtifacts,
		packageManifest: candidate.packageManifest,
		registry
	});
	const runtimeSetupEntry = manifestRecord.setupSource ? resolvePluginRuntimeArtifact({
		pluginId,
		entryKind: "setup",
		source: manifestRecord.setupSource,
		rootDir: pluginRoot,
		origin: candidate.origin,
		preferBuiltPluginArtifacts: context.preferBuiltPluginArtifacts,
		packageManifest: candidate.packageManifest,
		registry
	}) : void 0;
	const scopedSetupOnlyChannelPluginRequested = context.includeSetupOnlyChannelPlugins && !params.validateOnly && Boolean(params.onlyPluginIdSet) && manifestRecord.channels.length > 0 && (!enableState.enabled || context.forceSetupOnlyChannelPlugins);
	const registrationPlan = resolvePluginRegistrationPlan({
		canLoadScopedSetupOnlyChannelPlugin: scopedSetupOnlyChannelPluginRequested && (candidate.origin !== "workspace" || enableState.enabled) && (!context.requireSetupEntryForSetupOnlyChannelPlugins || Boolean(manifestRecord.setupSource)),
		scopedSetupOnlyChannelPluginRequested,
		requireSetupEntryForSetupOnlyChannelPlugins: context.requireSetupEntryForSetupOnlyChannelPlugins,
		enableStateEnabled: enableState.enabled,
		shouldLoadModules: context.shouldLoadModules,
		validateOnly: params.validateOnly,
		shouldActivate: context.shouldActivate,
		manifestRecord,
		cfg: context.cfg,
		env: context.env,
		channelPluginLoadIntent: context.channelPluginLoadIntent,
		toolDiscovery: params.options.toolDiscovery === true
	});
	if (!registrationPlan) {
		record.status = "disabled";
		record.error = enableState.reason;
		markPluginActivationDisabled(record, enableState.reason);
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	if (!enableState.enabled) {
		record.status = "disabled";
		record.error = enableState.reason;
		markPluginActivationDisabled(record, enableState.reason);
	}
	if (record.format === "bundle") {
		recordBundleDiagnostics({
			record,
			registry
		});
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	const memorySlot = context.normalized.slots.memory;
	if (registrationPlan.runRuntimeCapabilityPolicy && candidate.origin === "bundled" && hasKind(manifestRecord.kind, "memory") && !isDreamingSidecar) {
		const earlyMemoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: manifestRecord.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!earlyMemoryDecision.enabled) {
			record.enabled = false;
			record.status = "disabled";
			record.error = earlyMemoryDecision.reason;
			markPluginActivationDisabled(record, earlyMemoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
	}
	if (!manifestRecord.configSchema) {
		pushPluginLoadError("missing config schema");
		return;
	}
	if (!context.shouldLoadModules && registrationPlan.runRuntimeCapabilityPolicy) {
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!memoryDecision.enabled && !isDreamingSidecar) {
			record.enabled = false;
			record.status = "disabled";
			record.error = memoryDecision.reason;
			markPluginActivationDisabled(record, memoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
		if (memoryDecision.selected && hasKind(record.kind, "memory")) {
			state.selectedMemoryPluginId = record.id;
			state.memorySlotMatched = true;
			record.memorySlotSelected = true;
		}
	}
	const validatedConfig = validatePluginConfig({
		schema: manifestRecord.configSchema,
		cacheKey: manifestRecord.schemaCacheKey,
		value: entry?.config
	});
	if (!validatedConfig.ok) {
		params.logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
		pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
		return;
	}
	if (!context.shouldLoadModules) {
		applyManifestSnapshotMetadata(record, manifestRecord);
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	const loadEntry = registrationPlan.loadSetupEntry && runtimeSetupEntry ? runtimeSetupEntry : runtimeCandidateEntry;
	const moduleLoadSource = resolveCanonicalDistRuntimeSource(loadEntry.source);
	const moduleRoot = resolveCanonicalDistRuntimeSource(loadEntry.rootDir);
	const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
		origin: candidate.origin,
		rootDir: candidate.rootDir,
		env: context.env
	});
	const opened = openRootFileSync({
		absolutePath: moduleLoadSource,
		rootPath: moduleRoot,
		boundaryLabel: "plugin root",
		rejectHardlinks,
		skipLexicalRootCheck: true
	});
	if (!opened.ok) {
		pushPluginLoadError(describeRootFileOpenFailure({
			failure: opened,
			subject: "plugin entry path",
			boundaryLabel: "plugin root",
			filePath: moduleLoadSource
		}));
		return;
	}
	const safeSource = opened.path;
	fs.closeSync(opened.fd);
	let mod = null;
	let moduleLoadMs;
	let moduleLoadFailed = false;
	const beforeModuleLoad = performance.now();
	try {
		recordImportedPluginId(record.id);
		state.pluginLoadAttemptCount++;
		params.logger.debug?.(`[plugins] loading ${record.id} from ${safeSource}`);
		mod = withProfile({
			pluginId: record.id,
			source: safeSource
		}, registrationPlan.mode, () => params.loadPluginModule(safeSource));
	} catch (error) {
		recordPluginError({
			logger: params.logger,
			registry,
			record,
			seenIds: state.seenIds,
			pluginId,
			origin: candidate.origin,
			phase: "load",
			error,
			logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
			diagnosticMessagePrefix: "failed to load plugin: "
		});
		moduleLoadFailed = true;
		return;
	} finally {
		moduleLoadMs = performance.now() - beforeModuleLoad;
		detailPluginStartupTrace(params.options.startupTrace, record.id, [["loadMs", moduleLoadMs], ["loadFailedCount", moduleLoadFailed ? 1 : 0]]);
	}
	if (loadSetupRuntimeChannelCandidate({
		mod,
		manifestRecord,
		record,
		registrationPlan,
		runtimeCandidateEntry,
		safeSource,
		rejectHardlinks,
		loadPluginModule: params.loadPluginModule,
		registryBuilder: params.registryBuilder,
		cfg: context.cfg,
		entry,
		seenIds: state.seenIds,
		candidateOrigin: candidate.origin,
		logger: params.logger,
		pushPluginLoadError
	})) return;
	const { definition, register } = resolvePluginModuleExport(mod);
	if (definition?.id && definition.id !== record.id) {
		pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`);
		return;
	}
	record.name = definition?.name ?? record.name;
	record.description = definition?.description ?? record.description;
	record.version = definition?.version ?? record.version;
	const manifestKind = record.kind;
	const exportKind = definition?.kind;
	if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) registry.diagnostics.push({
		level: "warn",
		pluginId: record.id,
		source: record.source,
		message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`
	});
	record.kind = definition?.kind ?? record.kind;
	if (hasKind(record.kind, "memory") && memorySlot === record.id) state.memorySlotMatched = true;
	if (registrationPlan.runRuntimeCapabilityPolicy && !isDreamingSidecar) {
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!memoryDecision.enabled) {
			record.enabled = false;
			record.status = "disabled";
			record.error = memoryDecision.reason;
			markPluginActivationDisabled(record, memoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
		if (memoryDecision.selected && hasKind(record.kind, "memory")) {
			state.selectedMemoryPluginId = record.id;
			record.memorySlotSelected = true;
		}
	}
	if (params.validateOnly) {
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	if (typeof register !== "function") {
		const wrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
		if (wrongLoaderError) {
			params.logger.error(`[plugins] ${record.id} ${wrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`);
			pushPluginLoadError(wrongLoaderError);
		} else {
			params.logger.error(`[plugins] ${record.id} missing register/activate export`);
			pushPluginLoadError(formatMissingPluginRegisterError(mod, context.env));
		}
		return;
	}
	for (const nodeHostCommand of definition?.nodeHostCommands ?? []) params.registryBuilder.registerNodeHostCommand(record, nodeHostCommand);
	if (registrationPlan.runFullActivationOnlyRegistrations) {
		if (definition?.reload) params.registryBuilder.registerReload(record, definition.reload);
		for (const collector of definition?.securityAuditCollectors ?? []) params.registryBuilder.registerSecurityAuditCollector(record, collector);
	}
	const api = params.registryBuilder.createApi(record, {
		config: context.cfg,
		pluginConfig: validatedConfig.value,
		hookPolicy: entry?.hooks,
		registrationMode: registrationPlan.mode
	});
	const beforeRegister = performance.now();
	let registerFailed = false;
	try {
		withProfile({
			pluginId: record.id,
			source: record.source
		}, `${registrationPlan.mode}:register`, () => runPluginRegisterSyncInRegistry(register, api, registry, record.id));
		if (registrationPlan.runRuntimeCapabilityPolicy) registerPluginDashboardCapabilities({
			record,
			registry
		});
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		if (clearMismatchedQuarantineAfterLoad) clearActiveDegradedPlugin(pluginId);
	} catch (error) {
		params.registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
		recordPluginError({
			logger: params.logger,
			registry,
			record,
			seenIds: state.seenIds,
			pluginId,
			origin: candidate.origin,
			phase: "register",
			error,
			logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
			diagnosticMessagePrefix: "plugin failed during register: ",
			...error instanceof PluginDashboardDeclarationError ? { diagnosticCode: "dashboard-declaration-invalid" } : {}
		});
		registerFailed = true;
	} finally {
		const registerMs = performance.now() - beforeRegister;
		detailPluginStartupTrace(params.options.startupTrace, record.id, [
			["registerMs", registerMs],
			["loadAndRegisterMs", moduleLoadMs + registerMs],
			["registerFailedCount", registerFailed ? 1 : 0]
		]);
	}
}
function recordBundleDiagnostics(params) {
	const unsupportedCapabilities = (params.record.bundleCapabilities ?? []).filter((capability) => !params.record.bundleFormat || !isBundleCapabilitySupported(params.record.bundleFormat, capability));
	for (const capability of unsupportedCapabilities) params.registry.diagnostics.push({
		level: "warn",
		pluginId: params.record.id,
		source: params.record.source,
		message: `bundle capability detected but not wired into OpenClaw yet: ${capability}`
	});
	if (params.record.enabled && params.record.rootDir && params.record.bundleFormat && (params.record.bundleCapabilities ?? []).includes("mcpServers")) {
		const runtimeSupport = inspectBundleMcpRuntimeSupport({
			pluginId: params.record.id,
			rootDir: params.record.rootDir,
			bundleFormat: params.record.bundleFormat
		});
		for (const message of runtimeSupport.diagnostics) params.registry.diagnostics.push({
			level: "warn",
			pluginId: params.record.id,
			source: params.record.source,
			message
		});
		if (runtimeSupport.unsupportedServerNames.length > 0) params.registry.diagnostics.push({
			level: "warn",
			pluginId: params.record.id,
			source: params.record.source,
			message: `bundle MCP servers use unsupported transports or incomplete configs (${runtimeSupport.unsupportedServerNames.join(", ")})`
		});
	}
	params.registry.plugins.push(params.record);
}
//#endregion
//#region src/plugins/registry-runtime-binding.ts
const PLUGIN_REGISTRY_RUNTIME = Symbol.for("openclaw.pluginRegistryRuntime");
function bindPluginRegistryRuntime(registry, runtime) {
	Object.defineProperty(registry, PLUGIN_REGISTRY_RUNTIME, {
		configurable: false,
		enumerable: false,
		value: runtime,
		writable: false
	});
}
function getPluginRegistryRuntime(registry) {
	return registry[PLUGIN_REGISTRY_RUNTIME];
}
//#endregion
//#region src/plugins/agent-event-emission.ts
const HOST_OWNED_AGENT_EVENT_STREAMS = /* @__PURE__ */ new Set([
	"lifecycle",
	"tool",
	"assistant",
	"error",
	"item",
	"plan",
	"approval",
	"command_output",
	"patch",
	"compaction",
	"thinking",
	"model"
]);
function isPluginOwnedAgentEventStream(pluginId, stream) {
	return stream === pluginId || stream.startsWith(`${pluginId}.`);
}
function normalizePluginEventData(params) {
	if (params.data && typeof params.data === "object" && !Array.isArray(params.data)) return {
		...params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
	return {
		value: params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
}
function emitPluginAgentEvent(params) {
	const runId = normalizeOptionalString(params.event.runId);
	const sessionKey = normalizeOptionalString(params.event.sessionKey);
	const stream = normalizeOptionalString(params.event.stream);
	if (!runId || !stream) return {
		emitted: false,
		reason: "runId and stream are required"
	};
	if (!isPluginJsonValue(params.event.data)) return {
		emitted: false,
		reason: "event data must be JSON-compatible"
	};
	if (params.origin !== "bundled" && HOST_OWNED_AGENT_EVENT_STREAMS.has(stream)) return {
		emitted: false,
		reason: `stream ${stream} is reserved for bundled plugins`
	};
	if (params.origin !== "bundled" && !isPluginOwnedAgentEventStream(params.pluginId, stream)) return {
		emitted: false,
		reason: `stream ${stream} must be scoped to plugin ${params.pluginId}`
	};
	if (hasInvalidLifecycleStartTimestamp(stream, params.event.data)) return {
		emitted: false,
		reason: "lifecycle start requires a finite startedAt timestamp"
	};
	emitAgentEvent({
		runId,
		stream,
		...sessionKey ? { sessionKey } : {},
		data: normalizePluginEventData({
			pluginId: params.pluginId,
			pluginName: params.pluginName,
			data: params.event.data
		})
	});
	return {
		emitted: true,
		stream
	};
}
//#endregion
//#region src/plugins/host-hook-attachments.ts
const DEFAULT_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;
/** Filesystem adapter used by attachment MIME probes and tests. */
const attachmentProbeFs = { open: (...args) => fsPromises.open(...args) };
const MAX_ATTACHMENT_FILES = 10;
const loadSendMessage = createLazyRuntimeModule(() => import("./message-CCzijUjf.js").then((module) => module.sendMessage));
const loadGetChannelPlugin = createLazyRuntimeModule(() => import("./plugins-BK6XAmXj.js").then((module) => module.getChannelPlugin));
function captionFormatToParseMode(captionFormat) {
	if (captionFormat === "html") return "HTML";
}
function escapeHtmlText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function normalizeOptionalThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return normalizeOptionalString(value);
}
async function readMimeSniffBuffer(filePath, size) {
	let handle;
	try {
		handle = await attachmentProbeFs.open(filePath, "r");
		const length = Math.min(Math.max(0, size), FILE_TYPE_SNIFF_MAX_BYTES);
		const buffer = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buffer, 0, length, 0);
		return buffer.subarray(0, bytesRead);
	} catch (error) {
		return { error: `attachment file MIME read failed for ${filePath}: ${formatErrorMessage(error)}` };
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
/** Resolves portable attachment delivery options while honoring shipped channel-specific hints. */
function resolveAttachmentDelivery(params) {
	const fallbackParseMode = captionFormatToParseMode(params.captionFormat);
	const channel = params.channel.trim().toLowerCase();
	const hints = params.channelHints;
	const legacyTelegram = channel === "telegram" ? hints?.telegram : void 0;
	const legacySlack = channel === "slack" ? hints?.slack : void 0;
	const parseMode = hints?.parseMode ?? legacyTelegram?.parseMode ?? (channel === "telegram" && params.captionFormat === "plain" ? "HTML" : fallbackParseMode);
	const escapePlainHtmlCaption = params.captionFormat === "plain" && parseMode === "HTML";
	const silent = hints?.silent ?? legacyTelegram?.disableNotification;
	const forceDocumentMime = normalizeMimeType(hints?.forceDocumentMime ?? legacyTelegram?.forceDocumentMime);
	const threadId = normalizeOptionalThreadId(hints?.threadId) ?? normalizeOptionalString(legacySlack?.threadTs);
	return {
		...parseMode ? { parseMode } : {},
		...escapePlainHtmlCaption ? { escapePlainHtmlCaption: true } : {},
		...silent !== void 0 ? { silent } : {},
		...forceDocumentMime ? { forceDocumentMime } : {},
		...threadId !== void 0 ? { threadId } : {}
	};
}
async function validateAttachmentFiles(files, maxBytes, options) {
	if (files.length > MAX_ATTACHMENT_FILES) return { error: `at most ${MAX_ATTACHMENT_FILES} attachment files are allowed` };
	const paths = [];
	let totalBytes = 0;
	for (const file of files) {
		if (!file || typeof file !== "object" || Array.isArray(file)) return { error: "attachment file entry must be an object" };
		const filePath = normalizeOptionalString(file.path);
		if (!filePath) return { error: "attachment file path is required" };
		const resolvedPath = resolveAttachmentFilePath({
			filePath,
			config: options?.config,
			sessionKey: options?.sessionKey
		});
		const info = await lstat(resolvedPath).catch(() => void 0);
		if (info?.isSymbolicLink()) return { error: `attachment file symlinks are not allowed: ${resolvedPath}` };
		if (!info?.isFile()) return { error: `attachment file not found: ${resolvedPath}` };
		if (info.size > maxBytes) return { error: `attachment file exceeds ${maxBytes} bytes: ${resolvedPath}` };
		if (options?.forceDocumentMime) {
			const fileBuffer = await readMimeSniffBuffer(resolvedPath, info.size);
			if (!Buffer.isBuffer(fileBuffer)) return fileBuffer;
			let detectedMime;
			try {
				detectedMime = normalizeMimeType(await detectMime({ buffer: fileBuffer }));
			} catch (error) {
				return { error: `attachment file MIME detection failed for ${filePath}: ` + formatErrorMessage(error) };
			}
			if (detectedMime !== options.forceDocumentMime) return { error: `attachment file MIME mismatch for ${resolvedPath}: expected ${options.forceDocumentMime}, got ${detectedMime ?? "unknown"}` };
		}
		totalBytes += info.size;
		if (totalBytes > maxBytes) return { error: `attachment files exceed ${maxBytes} bytes total` };
		paths.push(resolvedPath);
	}
	return paths;
}
function resolveAttachmentFilePath(params) {
	const workspaceDir = params.sessionKey && params.config ? resolveAgentWorkspaceDir(params.config, resolveAgentIdFromSessionKey(params.sessionKey)) : void 0;
	return resolvePathFromInput(params.filePath, resolveWorkspaceRoot(workspaceDir));
}
/** Resolves the thread id used when delivering a plugin session attachment. */
function resolveSessionAttachmentThreadId(params) {
	return normalizeOptionalThreadId(params.hintThreadId) ?? normalizeOptionalThreadId(params.explicitThreadId) ?? normalizeOptionalThreadId(params.fallbackThreadId) ?? normalizeOptionalThreadId(params.deliveryThreadId);
}
/** Sends a bundled-plugin session attachment through the session's active delivery route. */
async function sendPluginSessionAttachment(params) {
	if (params.origin !== "bundled") return {
		ok: false,
		error: "session attachments are restricted to bundled plugins"
	};
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return {
		ok: false,
		error: "sessionKey is required"
	};
	if (!Array.isArray(params.files) || params.files.length === 0) return {
		ok: false,
		error: "at least one attachment file is required"
	};
	const maxBytes = typeof params.maxBytes === "number" && Number.isFinite(params.maxBytes) ? Math.min(DEFAULT_ATTACHMENT_MAX_BYTES, Math.max(1, Math.floor(params.maxBytes))) : DEFAULT_ATTACHMENT_MAX_BYTES;
	const { deliveryContext, threadId } = extractDeliveryInfo(sessionKey, { cfg: params.config });
	if (!deliveryContext?.channel || !deliveryContext.to) return {
		ok: false,
		error: `session has no active delivery route: ${sessionKey}`
	};
	const normalizedChannel = normalizeMessageChannel(deliveryContext.channel);
	try {
		if ((normalizedChannel && isDeliverableMessageChannel(normalizedChannel) ? (await loadGetChannelPlugin())(normalizedChannel) : void 0)?.outbound?.deliveryMode === "gateway") return {
			ok: false,
			error: `session attachments require direct outbound delivery for channel ${deliveryContext.channel}; channel uses gateway delivery`
		};
	} catch (error) {
		return {
			ok: false,
			error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
		};
	}
	const rawText = normalizeOptionalString(params.text) ?? "";
	const resolvedDelivery = resolveAttachmentDelivery({
		channel: deliveryContext.channel,
		captionFormat: params.captionFormat,
		channelHints: params.channelHints
	});
	const validated = await validateAttachmentFiles(params.files, maxBytes, {
		forceDocumentMime: resolvedDelivery.forceDocumentMime,
		config: params.config,
		sessionKey
	});
	if (!Array.isArray(validated)) return {
		ok: false,
		error: validated.error
	};
	const resolvedThreadId = resolveSessionAttachmentThreadId({
		deliveryThreadId: deliveryContext.threadId,
		explicitThreadId: params.threadId,
		fallbackThreadId: threadId,
		hintThreadId: resolvedDelivery.threadId
	});
	let result;
	try {
		result = await (await loadSendMessage())({
			to: deliveryContext.to,
			content: resolvedDelivery.escapePlainHtmlCaption ? escapeHtmlText(rawText) : rawText,
			channel: deliveryContext.channel,
			accountId: deliveryContext.accountId,
			threadId: resolvedThreadId,
			requesterSessionKey: sessionKey,
			mediaUrls: validated,
			forceDocument: resolvedDelivery.forceDocumentMime ? true : params.forceDocument,
			bestEffort: false,
			cfg: params.config,
			...resolvedDelivery.parseMode ? { parseMode: resolvedDelivery.parseMode } : {},
			...resolvedDelivery.silent !== void 0 ? { silent: resolvedDelivery.silent } : {}
		});
	} catch (error) {
		return {
			ok: false,
			error: `attachment delivery failed: ${formatErrorMessage(error)}`
		};
	}
	if (!result.result) return {
		ok: false,
		error: "attachment delivery failed: no delivery result returned"
	};
	return {
		ok: true,
		channel: result.channel,
		deliveredTo: deliveryContext.to,
		count: validated.length
	};
}
//#endregion
//#region src/cron/service/list-page-validation.ts
function isSafeNonNegativeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function readCanonicalCronListPage(value, maxLimit) {
	if (!isRecord(value) || !Array.isArray(value.jobs)) throw new Error("cron.list returned an invalid inventory page");
	const page = value;
	const jobs = value.jobs;
	const limit = typeof page.limit === "number" ? page.limit : 0;
	if (typeof page.snapshotRevision !== "string" || page.snapshotRevision.length === 0 || !isSafeNonNegativeInteger(page.total) || !isSafeNonNegativeInteger(page.offset) || !Number.isSafeInteger(limit) || limit < 1 || limit > maxLimit || jobs.length > limit || typeof page.hasMore !== "boolean" || page.nextOffset !== null && !isSafeNonNegativeInteger(page.nextOffset)) throw new Error("cron.list returned an invalid inventory page");
	return page;
}
function resolveCronListPageNextOffset(page, requestedOffset) {
	const nextOffset = requestedOffset + page.jobs.length;
	if (page.offset !== requestedOffset || !Number.isSafeInteger(nextOffset) || nextOffset > page.total || (page.hasMore ? page.nextOffset !== nextOffset || nextOffset <= requestedOffset || nextOffset >= page.total : page.nextOffset !== null || nextOffset !== page.total)) throw new Error("cron.list returned an invalid inventory page");
	return page.hasMore ? nextOffset : null;
}
//#endregion
//#region src/plugins/host-hook-scheduled-turns.ts
const log$1 = createSubsystemLogger("plugins/host-scheduled-turns");
const PLUGIN_CRON_NAME_PREFIX = "plugin:";
const PLUGIN_CRON_TAG_MARKER = ":tag:";
const PLUGIN_CRON_CLEANUP_PAGE_SIZE = 200;
const PLUGIN_CRON_CLEANUP_MAX_PAGES = 50;
const PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS = 3;
function resolveSchedule(params) {
	const cron = normalizeOptionalString(params.cron);
	if (cron) {
		const tz = normalizeOptionalString(params.tz);
		return {
			kind: "cron",
			expr: cron,
			...tz ? { tz } : {}
		};
	}
	if ("delayMs" in params) {
		if (!Number.isFinite(params.delayMs) || params.delayMs < 0) return;
		const at = timestampMsToIsoString(resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(params.delayMs))));
		if (!at) return;
		return {
			kind: "at",
			at
		};
	}
	const rawAt = params.at;
	const at = rawAt instanceof Date ? rawAt : new Date(rawAt);
	if (!Number.isFinite(at.getTime())) return;
	return {
		kind: "at",
		at: at.toISOString()
	};
}
function resolveSessionEventDeliveryMode(deliveryMode) {
	if (deliveryMode === void 0) return;
	if (deliveryMode === "none" || deliveryMode === "announce") return deliveryMode;
}
function formatScheduleLogContext(params) {
	const parts = [`pluginId=${params.pluginId}`];
	if (params.sessionKey) parts.push(`sessionKey=${params.sessionKey}`);
	if (params.name) parts.push(`name=${params.name}`);
	if (params.jobId) parts.push(`jobId=${params.jobId}`);
	return parts.join(" ");
}
async function removeScheduledSessionTurn(params) {
	try {
		return didCronCleanupJob(await params.cron.remove(params.jobId));
	} catch (error) {
		log$1.warn(`plugin session turn cleanup failed (${formatScheduleLogContext(params)}): ${formatErrorMessage(error)}`);
		return false;
	}
}
function didCronRemoveJob(value) {
	return isCronRemoveResult(value) && value.ok && value.removed;
}
function didCronCleanupJob(value) {
	return isCronRemoveResult(value) && value.ok;
}
const PLUGIN_CRON_RESERVED_DELIMITER = ":";
function resolvePluginSessionTurnTag(value) {
	const tag = normalizeOptionalString(value);
	if (!tag) return { invalid: false };
	if (tag.includes(PLUGIN_CRON_RESERVED_DELIMITER)) return { invalid: true };
	return {
		tag,
		invalid: false
	};
}
function buildPluginSchedulerCronName(params) {
	const uniqueId = params.uniqueId ?? randomUUID();
	if (!params.tag) return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}:${params.sessionKey}:${uniqueId}`;
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:${uniqueId}`;
}
function buildPluginSchedulerTagPrefix(params) {
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:`;
}
function isCronRemoveResult(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value) && typeof value.ok === "boolean" && typeof value.removed === "boolean";
}
async function listAllCronJobsForPluginTagCleanup(cron, query) {
	for (let restart = 0; restart <= PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS; restart += 1) {
		const jobs = [];
		let offset = 0;
		let snapshotRevision;
		let total;
		let snapshotChanged = false;
		for (let pageNumber = 0; pageNumber < PLUGIN_CRON_CLEANUP_MAX_PAGES; pageNumber += 1) {
			const page = readCanonicalCronListPage(await cron.listPage({
				includeDisabled: true,
				limit: PLUGIN_CRON_CLEANUP_PAGE_SIZE,
				offset,
				query,
				sortBy: "name",
				sortDir: "asc"
			}), PLUGIN_CRON_CLEANUP_PAGE_SIZE);
			if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) {
				snapshotChanged = true;
				break;
			}
			snapshotRevision ??= page.snapshotRevision;
			total ??= page.total;
			const nextOffset = resolveCronListPageNextOffset(page, offset);
			jobs.push(...page.jobs);
			if (nextOffset === null) return jobs;
			offset = nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages");
		if (restart === PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS) throw new Error("cron.list inventory changed repeatedly during cleanup");
	}
	throw new Error("cron.list inventory changed repeatedly during cleanup");
}
async function schedulePluginSessionTurn(params) {
	if (params.origin !== "bundled") return;
	const sessionKey = normalizeOptionalString(params.schedule.sessionKey);
	const message = normalizeOptionalString(params.schedule.message);
	if (!sessionKey || !message) return;
	const cronSchedule = resolveSchedule(params.schedule);
	if (!cronSchedule) return;
	const rawDeliveryMode = params.schedule.deliveryMode;
	const deliveryMode = resolveSessionEventDeliveryMode(rawDeliveryMode);
	const scheduleName = normalizeOptionalString(params.schedule.name);
	if (rawDeliveryMode !== void 0 && !deliveryMode) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): unsupported deliveryMode`);
		return;
	}
	if (cronSchedule.kind === "cron" && params.schedule.deleteAfterRun === true) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): deleteAfterRun requires a one-shot schedule`);
		return;
	}
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.schedule.tag);
	if (invalidTag) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): tag contains reserved delimiter ":"`);
		return;
	}
	const cronDeliveryMode = deliveryMode ?? "announce";
	if (params.shouldCommit && !params.shouldCommit()) return;
	if (!params.cron) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): cron service unavailable`);
		return;
	}
	const cron = params.cron;
	const cronJobName = buildPluginSchedulerCronName({
		pluginId: params.pluginId,
		sessionKey,
		...tag !== void 0 ? { tag } : {},
		...scheduleName ? { uniqueId: scheduleName } : {}
	});
	const cronPayload = {
		kind: "agentTurn",
		message
	};
	let result;
	try {
		result = await cron.add({
			name: cronJobName,
			enabled: true,
			schedule: cronSchedule,
			sessionTarget: `session:${sessionKey}`,
			payload: cronPayload,
			...params.schedule.agentId ? { agentId: params.schedule.agentId } : {},
			deleteAfterRun: params.schedule.deleteAfterRun ?? cronSchedule.kind === "at",
			wakeMode: "now",
			delivery: {
				mode: cronDeliveryMode,
				...cronDeliveryMode === "announce" ? { channel: "last" } : {}
			}
		});
	} catch (error) {
		log$1.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})}): ${formatErrorMessage(error)}`);
		return;
	}
	const jobId = result.id;
	if (!jobId) return;
	if (params.shouldCommit && !params.shouldCommit()) {
		if (!await removeScheduledSessionTurn({
			cron,
			jobId,
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})) log$1.warn(`plugin session turn scheduling rollback failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName,
			jobId
		})}): failed to remove stale scheduled session turn`);
		return;
	}
	return registerPluginSessionSchedulerJob({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		ownerRegistry: params.ownerRegistry,
		job: {
			id: jobId,
			sessionKey,
			kind: "session-turn",
			cleanup: async () => {
				if (!await removeScheduledSessionTurn({
					cron,
					jobId,
					pluginId: params.pluginId,
					sessionKey,
					name: cronJobName
				})) throw new Error(`failed to remove scheduled session turn: ${jobId}`);
			}
		}
	});
}
async function unschedulePluginSessionTurnsByTag(params) {
	if (params.origin !== "bundled") return {
		removed: 0,
		failed: 0
	};
	const sessionKey = normalizeOptionalString(params.request.sessionKey);
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.request.tag);
	if (!sessionKey || !tag || invalidTag) return {
		removed: 0,
		failed: 0
	};
	if (!params.cron) {
		log$1.warn("plugin session turn untag-list failed: cron service unavailable");
		return {
			removed: 0,
			failed: 1
		};
	}
	const cron = params.cron;
	const namePrefix = buildPluginSchedulerTagPrefix({
		pluginId: params.pluginId,
		tag,
		sessionKey
	});
	let jobs;
	try {
		jobs = await listAllCronJobsForPluginTagCleanup(cron, namePrefix);
	} catch (error) {
		log$1.warn(`plugin session turn untag-list failed: ${formatErrorMessage(error)}`);
		return {
			removed: 0,
			failed: 1
		};
	}
	const candidates = jobs.filter((job) => {
		return job.name.startsWith(namePrefix) && job.sessionTarget === `session:${sessionKey}`;
	});
	let removed = 0;
	let failed = 0;
	for (const job of candidates) {
		const id = job.id.trim();
		if (!id) continue;
		try {
			if (didCronRemoveJob(await cron.remove(id))) {
				removed += 1;
				deletePluginSessionSchedulerJob({
					pluginId: params.pluginId,
					jobId: id,
					sessionKey
				});
			} else failed += 1;
		} catch (error) {
			log$1.warn(`plugin session turn untag-remove failed: id=${id} error=${formatErrorMessage(error)}`);
			failed += 1;
		}
	}
	return {
		removed,
		failed
	};
}
//#endregion
//#region src/plugins/host-hook-state.ts
const log = createSubsystemLogger("plugins/host-hook-state");
const PROJECTION_FAILED = Symbol("plugin-session-extension-projection-failed");
const MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH = 32 * 1024;
const MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH = 512;
const MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION = 32;
function normalizeNamespace(value) {
	return value.trim();
}
function copyJsonValue(value) {
	return structuredClone(value);
}
function isPluginNextTurnInjectionPlacement(value) {
	return value === "prepend_context" || value === "append_context";
}
function isPluginNextTurnInjectionRecord(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && typeof candidate.pluginId === "string" && typeof candidate.text === "string" && typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt) && isPluginNextTurnInjectionPlacement(candidate.placement) && (candidate.ttlMs === void 0 || typeof candidate.ttlMs === "number" && Number.isFinite(candidate.ttlMs) && candidate.ttlMs >= 0) && (candidate.idempotencyKey === void 0 || typeof candidate.idempotencyKey === "string");
}
function isExpired(entry, now) {
	if (!isPluginNextTurnInjectionRecord(entry)) return true;
	return typeof entry.ttlMs === "number" && entry.ttlMs >= 0 && now - entry.createdAt > entry.ttlMs;
}
function isPluginPromptInjectionEnabled(cfg, pluginId) {
	return (cfg.plugins?.entries?.[pluginId])?.hooks?.allowPromptInjection !== false;
}
function toPluginNextTurnInjectionRecord(params) {
	return {
		id: params.injection.idempotencyKey?.trim() || randomUUID(),
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		text: params.injection.text,
		idempotencyKey: params.injection.idempotencyKey?.trim() || void 0,
		placement: params.injection.placement ?? "prepend_context",
		ttlMs: params.injection.ttlMs,
		createdAt: params.now,
		metadata: params.injection.metadata
	};
}
async function enqueuePluginNextTurnInjection(params) {
	if (typeof params.injection.sessionKey !== "string") return {
		enqueued: false,
		id: "",
		sessionKey: ""
	};
	const sessionKey = params.injection.sessionKey.trim();
	if (!sessionKey) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (typeof params.injection.text !== "string") return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const text = params.injection.text.trim();
	if (!text) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (text.length > MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.metadata !== void 0 && !isPluginJsonValue(params.injection.metadata)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.idempotencyKey !== void 0 && (typeof params.injection.idempotencyKey !== "string" || params.injection.idempotencyKey.trim().length === 0 || params.injection.idempotencyKey.length > MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.placement !== void 0 && !isPluginNextTurnInjectionPlacement(params.injection.placement)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	if (params.injection.ttlMs !== void 0 && (!Number.isFinite(params.injection.ttlMs) || params.injection.ttlMs < 0)) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	const now = params.now ?? Date.now();
	const record = toPluginNextTurnInjectionRecord({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		injection: {
			...params.injection,
			sessionKey,
			text
		},
		now
	});
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey
	}, (entry) => {
		let enqueued = false;
		let resultId = record.id;
		const injections = { ...entry.pluginNextTurnInjections };
		const rawExisting = injections[params.pluginId];
		const existing = (Array.isArray(rawExisting) ? [...rawExisting] : []).filter((candidate) => !isExpired(candidate, now));
		const duplicate = record.idempotencyKey ? existing.find((candidate) => candidate.idempotencyKey === record.idempotencyKey) : void 0;
		if (duplicate) {
			resultId = duplicate.id;
			injections[params.pluginId] = existing;
			entry.pluginNextTurnInjections = injections;
			return {
				enqueued,
				id: resultId
			};
		}
		if (existing.length >= MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION) {
			injections[params.pluginId] = existing;
			entry.pluginNextTurnInjections = injections;
			return {
				enqueued,
				id: resultId
			};
		}
		injections[params.pluginId] = [...existing, record];
		entry.pluginNextTurnInjections = injections;
		entry.updatedAt = now;
		enqueued = true;
		return {
			enqueued,
			id: resultId
		};
	});
	if (!updated.found) return {
		enqueued: false,
		id: "",
		sessionKey
	};
	return {
		...updated.result,
		sessionKey: updated.canonicalKey
	};
}
async function drainPluginNextTurnInjections(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return [];
	const target = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey
	});
	if (!target.entry) return [];
	if (!target.entry.pluginNextTurnInjections || Object.keys(target.entry.pluginNextTurnInjections).length === 0) return [];
	const now = params.now ?? Date.now();
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey
	}, (entry) => {
		if (!entry?.pluginNextTurnInjections) return [];
		const activePluginIds = new Set((getActivePluginRegistry()?.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id));
		const drained = [];
		for (const [pluginId, entries] of Object.entries(entry.pluginNextTurnInjections)) {
			if (!activePluginIds.has(pluginId) || !isPluginPromptInjectionEnabled(params.cfg, pluginId)) continue;
			if (!Array.isArray(entries)) continue;
			const liveEntries = entries.filter((candidate) => !isExpired(candidate, now));
			drained.push(...liveEntries);
		}
		drained.sort((left, right) => left.createdAt - right.createdAt);
		delete entry.pluginNextTurnInjections;
		if (drained.length > 0) entry.updatedAt = now;
		return drained;
	});
	return updated.found ? updated.result : [];
}
async function drainPluginNextTurnInjectionContext(params) {
	const queuedInjections = await drainPluginNextTurnInjections(params);
	return {
		queuedInjections,
		...buildPluginAgentTurnPrepareContext({ queuedInjections })
	};
}
function getPluginSessionExtensionStateSync(params) {
	const pluginId = params.pluginId.trim();
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!pluginId || !sessionKey) return;
	const value = resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey
	}).entry?.pluginExtensions?.[pluginId];
	return value ? copyJsonValue(value) : void 0;
}
async function patchPluginSessionExtension(params) {
	const namespace = normalizeNamespace(params.namespace);
	const pluginId = params.pluginId.trim();
	if (!pluginId || !namespace) return {
		ok: false,
		error: "pluginId and namespace are required"
	};
	if (params.unset === true && params.value !== void 0) return {
		ok: false,
		error: "plugin session extension cannot specify both unset and value"
	};
	if (params.value !== void 0 && !isPluginJsonValue(params.value)) return {
		ok: false,
		error: "plugin session extension value must be JSON-compatible"
	};
	if (params.unset !== true && params.value === void 0) return {
		ok: false,
		error: "plugin session extension value is required unless unset is true"
	};
	const nextPluginValue = params.value;
	const registration = (getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? []).find((entry) => entry.pluginId === pluginId && entry.extension.namespace === namespace);
	if (!registration) return {
		ok: false,
		error: `unknown plugin session extension: ${pluginId}/${namespace}`
	};
	const rawSlotKey = normalizeOptionalString(registration.extension.sessionEntrySlotKey);
	const normalizedSlotKey = rawSlotKey ? normalizeSessionEntrySlotKey(rawSlotKey) : void 0;
	if (normalizedSlotKey?.ok === false) log.warn(`plugin session extension slot promotion skipped for ${pluginId}/${namespace}: ${normalizedSlotKey.error}`);
	const slotKey = normalizedSlotKey?.ok === true ? normalizedSlotKey.key : void 0;
	const updated = await updateResolvedSessionEntry({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {}
	}, (entry, context) => {
		params.assertCurrent?.();
		const entryRecord = entry;
		const pluginExtensions = { ...entry.pluginExtensions };
		const pluginState = { ...pluginExtensions[pluginId] };
		if (params.unset === true) delete pluginState[namespace];
		else pluginState[namespace] = copyJsonValue(nextPluginValue);
		if (Object.keys(pluginState).length > 0) pluginExtensions[pluginId] = pluginState;
		else delete pluginExtensions[pluginId];
		if (Object.keys(pluginExtensions).length > 0) entry.pluginExtensions = pluginExtensions;
		else delete entry.pluginExtensions;
		const storedSlotKeys = { ...entry.pluginExtensionSlotKeys };
		const pluginSlotKeys = { ...storedSlotKeys[pluginId] };
		const previousSlotKey = normalizeSessionEntrySlotKey(pluginSlotKeys[namespace]);
		if (previousSlotKey.ok && previousSlotKey.key !== slotKey) delete entryRecord[previousSlotKey.key];
		if (slotKey && params.unset !== true) pluginSlotKeys[namespace] = slotKey;
		else delete pluginSlotKeys[namespace];
		if (Object.keys(pluginSlotKeys).length > 0) storedSlotKeys[pluginId] = pluginSlotKeys;
		else delete storedSlotKeys[pluginId];
		if (Object.keys(storedSlotKeys).length > 0) entry.pluginExtensionSlotKeys = storedSlotKeys;
		else delete entry.pluginExtensionSlotKeys;
		if (slotKey) {
			const projected = projectSessionExtensionValueForSlot({
				registration,
				sessionKey: context.canonicalKey,
				sessionId: entry.sessionId,
				nextValue: params.unset === true ? void 0 : nextPluginValue
			});
			if (projected === void 0) delete entryRecord[slotKey];
			else entryRecord[slotKey] = projected;
		}
		entry.updatedAt = Date.now();
		return pluginState[namespace];
	});
	if (!updated.found) return {
		ok: false,
		error: `unknown session key: ${params.sessionKey}`
	};
	return {
		ok: true,
		key: updated.canonicalKey,
		value: updated.result
	};
}
/**
* Resolve the value that should be mirrored to `SessionEntry[slotKey]` for a
* promoted session-extension namespace. Failures are swallowed so a
* misbehaving projector cannot block the primary patch from being persisted.
*/
function projectSessionExtensionValueForSlot(params) {
	if (params.nextValue === void 0) return;
	const projected = projectSessionExtensionValue({
		pluginId: params.registration.pluginId,
		namespace: params.registration.extension.namespace,
		project: params.registration.extension.project,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		state: params.nextValue
	});
	if (projected === PROJECTION_FAILED) return;
	if (isPromiseLike(projected)) {
		discardUnexpectedPromiseProjection(projected);
		return;
	}
	if (projected === void 0 || !isPluginJsonValue(projected)) return;
	return copyJsonValue(projected);
}
function collectPluginSessionExtensionProjections(params) {
	const extensions = getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? [];
	if (extensions.length === 0) return [];
	const projections = [];
	for (const registration of extensions) {
		const state = params.entry.pluginExtensions?.[registration.pluginId]?.[registration.extension.namespace];
		if (state === void 0) continue;
		const projected = projectSessionExtensionValue({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			project: registration.extension.project,
			sessionKey: params.sessionKey,
			sessionId: params.entry.sessionId,
			state
		});
		if (projected === PROJECTION_FAILED) continue;
		if (isPromiseLike(projected)) {
			discardUnexpectedPromiseProjection(projected);
			continue;
		}
		if (projected !== void 0 && isPluginJsonValue(projected)) projections.push({
			pluginId: registration.pluginId,
			namespace: registration.extension.namespace,
			value: copyJsonValue(projected)
		});
	}
	return projections;
}
function discardUnexpectedPromiseProjection(value) {
	Promise.resolve(value).catch(() => void 0);
}
function projectSessionExtensionValue(params) {
	try {
		return params.project ? params.project({
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			state: params.state
		}) : params.state;
	} catch (error) {
		log.warn(`plugin session extension projection failed: plugin=${params.pluginId} namespace=${params.namespace} error=${String(error)}`);
		return PROJECTION_FAILED;
	}
}
function projectPluginSessionExtensionsSync(params) {
	return collectPluginSessionExtensionProjections(params);
}
//#endregion
//#region packages/media-generation-core/src/catalog.ts
/** Return unique configured models with default model first when present. */
function uniqueModels(provider) {
	return normalizeUniqueTrimmedStringList([provider.defaultModel, ...provider.models ?? []]);
}
/** Synthesize static catalog entries from provider metadata. */
function synthesizeMediaGenerationCatalogEntries(params) {
	const defaultModel = normalizeUniqueTrimmedStringList([params.provider.defaultModel])[0];
	return uniqueModels(params.provider).map((model) => {
		const modelCatalogEntry = params.provider.catalogByModel?.[model];
		const entry = {
			kind: params.kind,
			provider: params.provider.id,
			model,
			source: "static",
			capabilities: modelCatalogEntry?.capabilities ?? params.provider.capabilities
		};
		if (params.provider.label) entry.label = params.provider.label;
		if (model === defaultModel) entry.default = true;
		const modes = modelCatalogEntry?.modes ?? params.modes;
		if (modes) entry.modes = modes;
		return entry;
	});
}
/** Return unique model ids exposed by a media generation provider. */
function listMediaGenerationProviderModels(provider) {
	return uniqueModels(provider);
}
//#endregion
//#region src/tts/voice-models.ts
function normalizeLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function parseVoiceModelRef(value) {
	const parsed = typeof value === "string" ? parseModelCatalogRef(value) : null;
	return parsed ? {
		provider: parsed.provider,
		model: parsed.modelId
	} : void 0;
}
function sameProvider(left, right) {
	const normalizedLeft = normalizeLowercaseString(left);
	return Boolean(normalizedLeft && normalizedLeft === normalizeLowercaseString(right));
}
/** Match provider ids case-insensitively across canonical id and aliases. */
function providerMatchesId(provider, providerId) {
	return sameProvider(provider.id, providerId) || (provider.aliases ?? []).some((alias) => sameProvider(alias, providerId));
}
/** Find the provider metadata for a configured provider id or alias. */
function findVoiceModelProvider(params) {
	return params.providers.find((provider) => providerMatchesId(provider, params.providerId));
}
/** Return true when a provider advertises the requested model. */
function voiceProviderSupportsModel(provider, model) {
	if (!provider) return false;
	const normalizedModel = normalizeOptionalString(model);
	return [provider.defaultModel, ...provider.models ?? []].some((candidate) => normalizeOptionalString(candidate) === normalizedModel);
}
/** Parse primary/fallback voice model refs from config. */
function resolveVoiceModelRefs(config) {
	const voiceModel = config;
	if (typeof voiceModel === "string") {
		const parsed = parseVoiceModelRef(voiceModel);
		return parsed ? [parsed] : [];
	}
	if (typeof voiceModel !== "object" || voiceModel === null || Array.isArray(voiceModel)) return [];
	const timeoutMs = normalizeTimeoutMs(voiceModel.timeoutMs);
	const refs = [];
	const addRef = (value) => {
		const parsed = parseVoiceModelRef(value);
		if (parsed) refs.push({
			...parsed,
			...timeoutMs === void 0 ? {} : { timeoutMs }
		});
	};
	addRef(voiceModel.primary);
	if (Array.isArray(voiceModel.fallbacks)) for (const fallback of voiceModel.fallbacks) addRef(fallback);
	return refs;
}
/** Resolve configured voice model refs that are supported by known providers. */
function resolveSupportedVoiceModelRefs(params) {
	return resolveVoiceModelRefs(params.config).flatMap((ref) => {
		const provider = findVoiceModelProvider({
			providers: params.providers,
			providerId: ref.provider
		});
		if (!provider || params.providerId && !providerMatchesId(provider, params.providerId)) return [];
		return voiceProviderSupportsModel(provider, ref.model) ? [{
			...ref,
			provider: provider.id
		}] : [];
	});
}
/** Build ordered provider candidates from primary provider plus voice-model fallbacks. */
function resolveVoiceProviderCandidates(params) {
	const primary = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const candidates = [];
	const seenProviders = /* @__PURE__ */ new Set();
	const addCandidate = (candidate) => {
		candidates.push(candidate);
		seenProviders.add(candidate.provider);
	};
	const refs = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers
	});
	const primaryRefs = refs.filter((ref) => ref.provider === primary);
	for (const voiceModel of primaryRefs) addCandidate({
		provider: primary,
		voiceModel
	});
	if (primaryRefs.length === 0) addCandidate({ provider: primary });
	for (const voiceModel of refs) if (voiceModel.provider !== primary) addCandidate({
		provider: voiceModel.provider,
		voiceModel
	});
	for (const provider of params.providers) if (!seenProviders.has(provider.id)) addCandidate({ provider: provider.id });
	return candidates;
}
/** Resolve only the primary provider candidate for direct synthesis paths. */
function resolvePrimaryVoiceProviderCandidate(params) {
	const provider = findVoiceModelProvider({
		providers: params.providers,
		providerId: params.primaryProvider
	})?.id ?? params.primaryProvider;
	const voiceModel = resolveSupportedVoiceModelRefs({
		config: params.voiceModelConfig,
		providers: params.providers,
		providerId: provider
	})[0];
	return voiceModel ? {
		provider,
		voiceModel
	} : { provider };
}
/** Read provider config by configured id, canonical id, or alias. */
function getVoiceProviderConfig(params) {
	const candidates = [
		normalizeOptionalString(params.configuredProviderId),
		params.provider.id,
		...params.provider.aliases ?? []
	].filter((key) => Boolean(key));
	const configuredKeys = Object.keys(params.providerConfigs);
	for (const candidate of candidates) {
		if (Object.hasOwn(params.providerConfigs, candidate)) return params.providerConfigs[candidate] ?? {};
		const normalizedCandidate = normalizeLowercaseString(candidate);
		const matchingKey = configuredKeys.find((key) => normalizeLowercaseString(key) === normalizedCandidate);
		if (matchingKey) return params.providerConfigs[matchingKey] ?? {};
	}
	return {};
}
/** Convert provider metadata into static voice catalog entries. */
function synthesizeVoiceModelCatalogEntries(params) {
	const seen = /* @__PURE__ */ new Set();
	return [params.provider.defaultModel, ...params.provider.models ?? []].flatMap((entry) => {
		const model = normalizeOptionalString(entry);
		if (!model || seen.has(model)) return [];
		seen.add(model);
		return [model];
	}).map((model) => {
		const entry = {
			kind: "voice",
			provider: params.provider.id,
			model,
			source: "static",
			capabilities: params.capabilities
		};
		if (params.provider.label) entry.label = params.provider.label;
		if (model === params.provider.defaultModel) entry.default = true;
		if (params.modes) entry.modes = params.modes;
		return entry;
	});
}
//#endregion
//#region src/plugins/provider-catalog-unified-text.ts
/** Projects plugin provider catalog results into unified text-model catalog rows. */
function projectProviderCatalogResultToUnifiedTextRows(params) {
	const rows = [];
	for (const [providerId, providerConfig] of copyProviderCatalogResultEntries(params)) for (const model of copyProviderCatalogModels(providerConfig)) {
		const modelId = readRecordValue(model, "id");
		if (typeof modelId !== "string") continue;
		const modelName = readRecordValue(model, "name");
		rows.push({
			kind: "text",
			provider: providerId,
			model: modelId,
			...typeof modelName === "string" && modelName ? { label: modelName } : {},
			source: params.source
		});
	}
	return rows;
}
//#endregion
//#region src/plugins/model-catalog-registration.ts
function mergeCatalogHookResults(source, left, right) {
	const rows = [...left ?? [], ...right ?? []];
	if (rows.length === 0) return null;
	const mergedRows = [];
	for (const row of rows) mergedRows.push({
		...row,
		source
	});
	return mergedRows;
}
function mergeModelCatalogHooks(source, left, right) {
	if (!left) return right;
	if (!right) return left;
	return async (ctx) => {
		const [leftRows, rightRows] = await Promise.all([left(ctx), right(ctx)]);
		return mergeCatalogHookResults(source, leftRows, rightRows);
	};
}
/** Creates handlers that register plugin model catalog providers into a registry. */
function createModelCatalogRegistrationHandlers(params) {
	const registerModelCatalogProvider = (record, provider) => {
		const providerId = normalizeOptionalString(provider.provider) ?? "";
		if (!providerId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "model catalog provider registration missing provider"
			});
			return;
		}
		if (!provider.kinds || provider.kinds.length === 0) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider "${providerId}" registration missing kinds`
			});
			return;
		}
		const existing = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId !== record.id);
		if (existing) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider already registered: ${providerId} (${existing.pluginId})`
			});
			return;
		}
		const normalizedKinds = uniqueValues(provider.kinds);
		const samePluginOverlapping = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId === record.id && entry.provider.kinds.some((kind) => normalizedKinds.includes(kind)));
		if (samePluginOverlapping) {
			samePluginOverlapping.provider = {
				...samePluginOverlapping.provider,
				...provider,
				provider: providerId,
				kinds: uniqueValues([...samePluginOverlapping.provider.kinds, ...normalizedKinds]),
				staticCatalog: mergeModelCatalogHooks("static", samePluginOverlapping.provider.staticCatalog, provider.staticCatalog),
				liveCatalog: mergeModelCatalogHooks("live", samePluginOverlapping.provider.liveCatalog, provider.liveCatalog)
			};
			return;
		}
		params.registry.modelCatalogProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				provider: providerId,
				kinds: normalizedKinds
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSynthesizedTextModelCatalogProvider = (registration) => {
		if (!registration.provider.catalog && !registration.provider.staticCatalog) return;
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: ["text"],
			...registration.provider.staticCatalog ? { staticCatalog: async (ctx) => projectProviderCatalogResultToUnifiedTextRows({
				providerId: registration.provider.id,
				result: await registration.provider.staticCatalog.run(ctx),
				source: "static"
			}) } : {},
			...registration.provider.catalog ? { liveCatalog: async (ctx) => projectProviderCatalogResultToUnifiedTextRows({
				providerId: registration.provider.id,
				result: await registration.provider.catalog.run(ctx),
				source: "live"
			}) } : {}
		});
	};
	const registerSynthesizedMediaModelCatalogProvider = (registration) => {
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: [registration.kind],
			staticCatalog: () => synthesizeMediaGenerationCatalogEntries({
				kind: registration.kind,
				provider: registration.provider
			})
		});
	};
	const registerSynthesizedVoiceModelCatalogProvider = (registration) => {
		registerModelCatalogProvider(registration.record, {
			provider: registration.provider.id,
			kinds: ["voice"],
			staticCatalog: () => synthesizeVoiceModelCatalogEntries({
				provider: registration.provider,
				capabilities: registration.capabilities,
				modes: registration.modes
			})
		});
	};
	return {
		registerModelCatalogProvider,
		registerSynthesizedTextModelCatalogProvider,
		registerSynthesizedMediaModelCatalogProvider,
		registerSynthesizedVoiceModelCatalogProvider
	};
}
//#endregion
//#region src/plugins/registry-state.ts
/** Decode the public mode once so domain registrars do not repeat string checks. */
function resolvePluginRegistrationCapabilities(mode) {
	return {
		capabilityHandlers: mode === "full" || mode === "discovery" || mode === "tool-discovery",
		setupRuntimeHandlers: mode === "setup-runtime",
		runtimeChannel: mode !== "setup-only" && mode !== "tool-discovery"
	};
}
function normalizeHookTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveTypedHookTimeoutMs(params) {
	return normalizeHookTimeoutMs(params.policy?.timeouts?.[params.hookName]) ?? normalizeHookTimeoutMs(params.policy?.timeoutMs) ?? normalizeHookTimeoutMs(params.opts?.timeoutMs);
}
function createPluginRegistryState(registryParams) {
	const registry = createEmptyPluginRegistry();
	bindPluginRegistryRuntime(registry, registryParams.runtime);
	const coreGatewayMethodNames = Array.from(/* @__PURE__ */ new Set([...registryParams.coreGatewayMethodNames ?? [], ...Object.keys(registryParams.coreGatewayHandlers ?? {})])).toSorted();
	registry.coreGatewayMethodNames = coreGatewayMethodNames;
	const pushDiagnostic = (diagnostic) => {
		registry.diagnostics.push(diagnostic);
	};
	const modelCatalogRegistrars = createModelCatalogRegistrationHandlers({
		registry,
		pushDiagnostic
	});
	return {
		registry,
		registryParams,
		allowProcessHomeSessionCatalogs: registryParams.allowProcessHomeSessionCatalogs ?? true,
		coreGatewayMethods: new Set(coreGatewayMethodNames),
		getHostCronService: () => registryParams.hostServices?.cron,
		pluginsWithChannelRegistrationConflict: /* @__PURE__ */ new Set(),
		pluginSideEffectGuards: /* @__PURE__ */ new Map(),
		pushDiagnostic,
		...modelCatalogRegistrars
	};
}
//#endregion
//#region src/plugins/registry-api.ts
function normalizeLogger(logger) {
	return {
		info: logger.info,
		warn: logger.warn,
		error: logger.error,
		debug: logger.debug
	};
}
function resolvePluginPath(input, rootDir) {
	const trimmed = input.trim();
	if (!trimmed || path.isAbsolute(trimmed) || trimmed.startsWith("~")) return resolveUserPath(input);
	return rootDir ? path.resolve(rootDir, trimmed) : resolveUserPath(input);
}
function createPluginApiFactory(state, registrars, runtimeResolver) {
	const { registry, registryParams, getHostCronService, pluginSideEffectGuards, pushDiagnostic } = state;
	const { registerTool, registerHook, registerHttpRoute, registerHostedMediaResolver, registerMcpServerConnectionResolver, registerProvider, registerWorkerProvider, registerModelCatalogProvider, registerEmbeddingProvider, registerAgentHarness, registerDetachedTaskRuntime, registerSpeechProvider, registerRealtimeTranscriptionProvider, registerRealtimeVoiceProvider, registerMediaUnderstandingProvider, registerTranscriptSourceProvider, registerImageGenerationProvider, registerVideoGenerationProvider, registerMusicGenerationProvider, registerWebFetchProvider, registerWebSearchProvider, registerMigrationProvider, registerGatewayMethod, registerSessionCatalog, registerService, registerGatewayDiscoveryService, registerCliBackend, registerTextTransforms, registerReload, registerNodeHostCommand, registerNodeInvokePolicy, registerWidgetPresenter, registerSecurityAuditCollector, registerInteractiveHandler, registerConversationBindingResolvedHandler, registerCommand, registerContextEngine, registerCompactionProvider, registerCodexAppServerExtensionFactory, registerAgentToolResultMiddleware, registerSessionExtension, registerTrustedToolPolicy, registerToolMetadata, registerControlUiDescriptor, registerBoardWidgetContentKind, registerRuntimeLifecycle, registerAgentEventSubscription, registerSessionSchedulerJob, registerSessionAction, registerTypedHook, registerMemoryCapability, registerMemoryPromptSupplement, registerMemoryPromptPreparation, registerMemoryCorpusSupplement, registerCli, registerChannel } = registrars;
	const { resolvePluginRuntime, resolveRegisteredChannelRuntime, setPluginRuntimeRecord } = runtimeResolver;
	const createPluginSideEffectGuard = (pluginId) => {
		const guard = { active: true };
		const guards = pluginSideEffectGuards.get(pluginId) ?? /* @__PURE__ */ new Set();
		guards.add(guard);
		pluginSideEffectGuards.set(pluginId, guards);
		return guard;
	};
	const deactivatePluginSideEffectGuards = (pluginId) => {
		const guards = pluginSideEffectGuards.get(pluginId);
		if (!guards) return;
		for (const guard of guards) guard.active = false;
		pluginSideEffectGuards.delete(pluginId);
	};
	const createApi = (record, params) => {
		const registrationMode = params.registrationMode ?? "full";
		const registrationCapabilities = resolvePluginRegistrationCapabilities(registrationMode);
		setPluginRuntimeRecord(record);
		const sideEffectGuard = createPluginSideEffectGuard(record.id);
		const isLoadedRecordInRegistry = () => registry.plugins.some((plugin) => plugin.id === record.id && plugin.status === "loaded");
		const isLoadedRecordInLiveRegistry = () => sideEffectGuard.active && isPluginRegistryActivated(registry) && !isPluginRegistryRetired(registry) && isLoadedRecordInRegistry();
		const isActivatingLoadedRecord = () => registryParams.activateGlobalSideEffects !== false && record.enabled && record.status === "loaded" && !registry.plugins.some((plugin) => plugin.id === record.id);
		const shouldCommitWorkflowSideEffect = () => sideEffectGuard.active && !isPluginRegistryRetired(registry) && (isActivatingLoadedRecord() || isPluginRegistryActivated(registry) && isLoadedRecordInRegistry());
		return buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			rootDir: record.rootDir,
			registrationMode,
			config: params.config,
			pluginConfig: params.pluginConfig,
			runtime: resolvePluginRuntime(record.id),
			logger: normalizeLogger(registryParams.logger),
			resolvePath: (input) => resolvePluginPath(input, record.rootDir),
			handlers: {
				...registrationCapabilities.capabilityHandlers ? {
					registerTool: (tool, opts) => registerTool(record, tool, opts),
					registerHook: (events, handler, opts) => registerHook(record, events, handler, opts, params.config, params.pluginConfig),
					registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
					registerHostedMediaResolver: (resolver) => registerHostedMediaResolver(record, resolver),
					registerMcpServerConnectionResolver: (resolver) => registerMcpServerConnectionResolver(record, resolver),
					registerProvider: (provider) => registerProvider(record, provider),
					registerWorkerProvider: (provider) => registerWorkerProvider(record, provider),
					registerModelCatalogProvider: (provider) => registerModelCatalogProvider(record, provider),
					registerEmbeddingProvider: (provider) => registerEmbeddingProvider(record, provider),
					registerAgentHarness: (harness, options) => registerAgentHarness(record, harness, options),
					registerDetachedTaskRuntime: (runtime) => registerDetachedTaskRuntime(record, runtime),
					registerSpeechProvider: (provider) => registerSpeechProvider(record, provider),
					registerRealtimeTranscriptionProvider: (provider) => registerRealtimeTranscriptionProvider(record, provider),
					registerRealtimeVoiceProvider: (provider) => registerRealtimeVoiceProvider(record, provider),
					registerMediaUnderstandingProvider: (provider) => registerMediaUnderstandingProvider(record, provider),
					registerTranscriptSourceProvider: (provider) => registerTranscriptSourceProvider(record, provider),
					registerImageGenerationProvider: (provider) => registerImageGenerationProvider(record, provider),
					registerVideoGenerationProvider: (provider) => registerVideoGenerationProvider(record, provider),
					registerMusicGenerationProvider: (provider) => registerMusicGenerationProvider(record, provider),
					registerWebFetchProvider: (provider) => registerWebFetchProvider(record, provider),
					registerWebSearchProvider: (provider) => registerWebSearchProvider(record, provider),
					registerMigrationProvider: (provider) => registerMigrationProvider(record, provider),
					registerGatewayMethod: (method, handler, opts) => registerGatewayMethod(record, method, handler, opts),
					registerSessionCatalog: (provider) => registerSessionCatalog(record, provider),
					registerService: (service) => registerService(record, service),
					registerGatewayDiscoveryService: (service) => registerGatewayDiscoveryService(record, service),
					registerCliBackend: (backend) => registerCliBackend(record, backend),
					registerTextTransforms: (transforms) => registerTextTransforms(record, transforms),
					registerReload: (registration) => registerReload(record, registration),
					registerNodeHostCommand: (command) => registerNodeHostCommand(record, command),
					registerNodeInvokePolicy: (policy) => registerNodeInvokePolicy(record, policy, params.pluginConfig),
					registerWidgetPresenter: (presenter) => registerWidgetPresenter(record, presenter),
					registerSecurityAuditCollector: (collector) => registerSecurityAuditCollector(record, collector),
					registerInteractiveHandler: (registration) => registerInteractiveHandler(record, registration),
					onConversationBindingResolved: (handler) => registerConversationBindingResolvedHandler(record, handler),
					registerCommand: (command) => registerCommand(record, command),
					registerContextEngine: (id, factory) => registerContextEngine(record, id, factory, registrationMode),
					registerCompactionProvider: (provider) => registerCompactionProvider(record, provider),
					registerCodexAppServerExtensionFactory: (factory) => {
						registerCodexAppServerExtensionFactory(record, factory);
					},
					registerAgentToolResultMiddleware: (handler, options) => {
						registerAgentToolResultMiddleware(record, handler, options, params.hookPolicy);
					},
					registerSessionExtension: (extension) => registerSessionExtension(record, extension),
					enqueueNextTurnInjection: (injection) => {
						if (params.hookPolicy?.allowPromptInjection === false) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: `next-turn injection blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
							});
							return Promise.resolve({
								enqueued: false,
								id: "",
								sessionKey: injection.sessionKey
							});
						}
						return enqueuePluginNextTurnInjection({
							cfg: registryParams.runtime.config.current(),
							pluginId: record.id,
							pluginName: record.name,
							injection
						});
					},
					registerTrustedToolPolicy: (policy) => registerTrustedToolPolicy(record, policy),
					registerToolMetadata: (metadata) => registerToolMetadata(record, metadata),
					registerControlUiDescriptor: (descriptor) => registerControlUiDescriptor(record, descriptor),
					registerBoardWidgetContentKind: (definition) => registerBoardWidgetContentKind(record, definition),
					registerRuntimeLifecycle: (lifecycle) => registerRuntimeLifecycle(record, lifecycle),
					registerAgentEventSubscription: (subscription) => registerAgentEventSubscription(record, subscription),
					emitAgentEvent: (event) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							emitted: false,
							reason: "global side effects disabled"
						};
						if (!shouldCommitWorkflowSideEffect()) return {
							emitted: false,
							reason: "plugin is not loaded"
						};
						return emitPluginAgentEvent({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							event
						});
					},
					setRunContext: (patch) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? setPluginRunContext({
						pluginId: record.id,
						patch
					}) : false,
					getRunContext: (get) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? getPluginRunContext({
						pluginId: record.id,
						get
					}) : void 0,
					clearRunContext: (paramsLocal) => {
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return;
						clearPluginRunContext({
							pluginId: record.id,
							runId: paramsLocal.runId,
							namespace: paramsLocal.namespace
						});
					},
					registerSessionSchedulerJob: (job) => registerSessionSchedulerJob(record, job),
					registerSessionAction: (action) => registerSessionAction(record, action),
					sendSessionAttachment: async (attachment) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							ok: false,
							error: "global side effects disabled"
						};
						try {
							if (!isLoadedRecordInLiveRegistry()) return {
								ok: false,
								error: "plugin is not loaded"
							};
							const runtimeConfig = registryParams.runtime.config?.current?.() ?? params.config;
							return await sendPluginSessionAttachment({
								...attachment,
								config: runtimeConfig,
								origin: record.origin
							});
						} catch (error) {
							return {
								ok: false,
								error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
							};
						}
					},
					scheduleSessionTurn: async (schedule) => {
						if (registryParams.activateGlobalSideEffects === false) return;
						await Promise.resolve();
						return schedulePluginSessionTurn({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							schedule,
							cron: getHostCronService(),
							shouldCommit: isLoadedRecordInLiveRegistry,
							ownerRegistry: registry
						});
					},
					unscheduleSessionTurnsByTag: async (request) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							removed: 0,
							failed: 0
						};
						await Promise.resolve();
						if (!isLoadedRecordInLiveRegistry()) return {
							removed: 0,
							failed: 0
						};
						return unschedulePluginSessionTurnsByTag({
							pluginId: record.id,
							origin: record.origin,
							cron: getHostCronService(),
							request
						});
					},
					registerMemoryCapability: (capability) => registerMemoryCapability(record, capability),
					registerMemoryPromptSupplement: (builder) => registerMemoryPromptSupplement(record, builder),
					registerMemoryPromptPreparation: (prepare) => registerMemoryPromptPreparation(record, prepare),
					registerMemoryCorpusSupplement: (supplement) => registerMemoryCorpusSupplement(record, supplement),
					on: (hookName, handler, opts) => registerTypedHook(record, hookName, handler, opts, params.hookPolicy)
				} : {},
				...registrationCapabilities.setupRuntimeHandlers ? {
					registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
					registerGatewayMethod: (method, handler, opts) => registerGatewayMethod(record, method, handler, opts),
					registerSessionCatalog: (provider) => registerSessionCatalog(record, provider)
				} : {},
				registerCli: (registrar, opts) => registerCli(record, registrar, opts),
				registerChannel: (registration) => registerChannel(record, registration, registrationMode, registrationCapabilities.runtimeChannel ? () => resolveRegisteredChannelRuntime(record) : void 0)
			}
		});
	};
	return {
		createApi,
		deactivatePluginSideEffectGuards
	};
}
//#endregion
//#region src/plugins/registry-registrars-capabilities.ts
function createCapabilityRegistrars(state) {
	const { registry, pushDiagnostic } = state;
	const registerDetachedTaskRuntime = (record, runtime) => {
		const existing = registry.detachedTaskRuntimes[0];
		if (existing && existing.pluginId !== record.id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `detached task runtime already registered by ${existing.pluginId}`
			});
			return;
		}
		const next = {
			pluginId: record.id,
			runtime
		};
		if (existing) registry.detachedTaskRuntimes.splice(0, 1, next);
		else registry.detachedTaskRuntimes.push(next);
	};
	const registerInteractiveHandler = (record, registration) => {
		const result = registerPluginInteractiveHandlerInRegistry(registry, record.id, registration, {
			pluginName: record.name,
			pluginRoot: record.rootDir
		});
		if (!result.ok) pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: result.error ?? "interactive handler registration failed"
		});
	};
	const registerContextEngine = (record, id, factory, registrationMode) => {
		const normalizedId = normalizeOptionalString(id) ?? "";
		if (!normalizedId) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "context engine registration missing id"
			});
			return;
		}
		if (typeof factory !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `context engine "${normalizedId}" registration missing factory`
			});
			return;
		}
		if (normalizedId === defaultSlotIdForKey("contextEngine")) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `context engine id reserved by core: ${normalizedId}`
			});
			return;
		}
		const result = registerContextEngineInRegistry(registry, normalizedId, factory, `plugin:${record.id}`, {
			allowSameOwnerRefresh: true,
			lifecycle: registrationMode === "full" ? "runtime" : "readOnlyDiscovery"
		});
		if (!result.ok) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `context engine already registered: ${normalizedId} (${result.existingOwner})`
			});
			return;
		}
		if (!record.contextEngineIds?.includes(normalizedId)) record.contextEngineIds = [...record.contextEngineIds ?? [], normalizedId];
	};
	const registerCompactionProvider = (record, provider) => {
		const id = normalizeOptionalString(provider?.id);
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "compaction provider registration missing id"
			});
			return;
		}
		if (typeof provider?.summarize !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `compaction provider "${id}" registration missing summarize`
			});
			return;
		}
		const existing = registry.compactionProviders.find((entry) => entry.provider.id === id);
		if (existing) {
			const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `compaction provider already registered: ${id}${ownerDetail}`
			});
			return;
		}
		registry.compactionProviders.push({
			provider,
			ownerPluginId: record.id
		});
	};
	return {
		registerDetachedTaskRuntime,
		registerInteractiveHandler,
		registerContextEngine,
		registerCompactionProvider
	};
}
//#endregion
//#region src/plugins/registry-control-ui-policy.ts
function validateControlUiNativeRoutePlacement(params) {
	if (!params.placement?.startsWith("route:")) return true;
	if (params.record.origin === "bundled" && params.placement === `route:${params.record.id}`) return true;
	params.pushDiagnostic({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: `native Control UI route placement must be owned by its bundled plugin: ${params.placement}`
	});
	return false;
}
//#endregion
//#region src/plugins/tool-contracts.ts
function normalizePluginToolContractNames(contracts) {
	return normalizePluginToolNames(contracts?.tools);
}
function normalizePluginToolNames(names) {
	const normalized = /* @__PURE__ */ new Set();
	for (const name of names ?? []) {
		const trimmed = name.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return [...normalized];
}
function findUndeclaredPluginToolNames(params) {
	const declared = new Set(normalizePluginToolNames(params.declaredNames));
	return normalizePluginToolNames(params.toolNames).filter((name) => !declared.has(name));
}
//#endregion
//#region src/plugins/registry-registrars-host.ts
const controlUiSurfaces = /* @__PURE__ */ new Set([
	"session",
	"tool",
	"run",
	"settings",
	"tab",
	"widget"
]);
function normalizeHostHookString(value) {
	return typeof value === "string" ? normalizePluginHostHookId(value) : "";
}
function normalizeOptionalHostHookString(value) {
	if (value === void 0) return;
	if (typeof value !== "string") return "";
	return value.trim();
}
function normalizeHostHookStringList(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return null;
	const normalized = value.map((item) => normalizeOptionalHostHookString(item));
	if (normalized.some((item) => !item)) return null;
	return normalized;
}
function createHostRegistrars(state) {
	const { registry, registryParams, pushDiagnostic } = state;
	const reportRegistrationError = (record, message) => {
		pushDiagnostic({
			level: "error",
			pluginId: record.id,
			source: record.source,
			message
		});
	};
	const validateSessionActionSchema = (record, id, schema) => {
		if (schema === void 0) return true;
		if (!isPluginJsonValue(schema)) {
			reportRegistrationError(record, `session action schema must be JSON-compatible: ${id}`);
			return false;
		}
		if (typeof schema !== "boolean" && (!schema || typeof schema !== "object" || Array.isArray(schema))) {
			reportRegistrationError(record, `session action schema must be a JSON schema object or boolean: ${id}`);
			return false;
		}
		try {
			validateJsonSchemaValue({
				schema,
				cacheKey: `plugin-session-action-registration:${record.id}:${id}`,
				value: void 0
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			reportRegistrationError(record, `session action schema is not valid JSON Schema: ${id}: ${message}`);
			return false;
		}
		return true;
	};
	const registerSessionExtension = (record, extension) => {
		const namespace = normalizeHostHookString(extension.namespace);
		const description = normalizeHostHookString(extension.description);
		const project = extension.project;
		let normalizedSessionEntrySlotKey;
		let invalidMessage;
		if (!namespace || !description) invalidMessage = "session extension registration requires namespace and description";
		else if (project !== void 0 && typeof project !== "function") invalidMessage = "session extension projector must be a function";
		else if (project?.constructor?.name === "AsyncFunction") invalidMessage = "session extension projector must be synchronous";
		else if (extension.cleanup !== void 0 && typeof extension.cleanup !== "function") invalidMessage = "session extension cleanup must be a function";
		else if (extension.sessionEntrySlotKey !== void 0) {
			const slotKey = normalizeSessionEntrySlotKey(extension.sessionEntrySlotKey);
			if (!slotKey.ok) invalidMessage = slotKey.error;
			else normalizedSessionEntrySlotKey = slotKey.key;
		}
		if (invalidMessage) {
			reportRegistrationError(record, invalidMessage);
			return;
		}
		if (registry.sessionExtensions.find((entry) => entry.pluginId === record.id && entry.extension.namespace === namespace)) {
			reportRegistrationError(record, `session extension already registered: ${namespace}`);
			return;
		}
		if (normalizedSessionEntrySlotKey) {
			if (registry.sessionExtensions.find((entry) => {
				const existingSlotKey = entry.extension.sessionEntrySlotKey;
				if (existingSlotKey === void 0) return false;
				const normalizedExistingSlotKey = normalizeSessionEntrySlotKey(existingSlotKey);
				return normalizedExistingSlotKey.ok && normalizedExistingSlotKey.key === normalizedSessionEntrySlotKey;
			})) {
				reportRegistrationError(record, `sessionEntrySlotKey already registered: ${normalizedSessionEntrySlotKey}`);
				return;
			}
		}
		registry.sessionExtensions.push({
			pluginId: record.id,
			pluginName: record.name,
			extension: {
				...extension,
				namespace,
				description,
				...normalizedSessionEntrySlotKey ? { sessionEntrySlotKey: normalizedSessionEntrySlotKey } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerTrustedToolPolicy = (record, policy) => {
		if (!policy || typeof policy !== "object") {
			reportRegistrationError(record, "trusted tool policy registration requires id, description, and evaluate()");
			return;
		}
		const id = normalizeHostHookString(policy.id);
		const description = normalizeHostHookString(policy.description);
		const matcher = normalizePluginToolMatcher(policy.matcher);
		if (!id || !description || typeof policy.evaluate !== "function") {
			reportRegistrationError(record, "trusted tool policy registration requires id, description, and evaluate()");
			return;
		}
		if (record.origin !== "bundled" && !(record.contracts?.trustedToolPolicies ?? []).includes(id)) {
			reportRegistrationError(record, `plugin must declare contracts.trustedToolPolicies for: ${id}`);
			return;
		}
		if (record.origin !== "bundled" && !(record.enabled && record.explicitlyEnabled === true)) {
			reportRegistrationError(record, `plugin must be explicitly enabled to register trusted tool policy: ${id}`);
			return;
		}
		const policies = registry.trustedToolPolicies;
		const existing = policies.find((entry) => entry.pluginId === record.id && entry.policy.id === id);
		if (existing) {
			reportRegistrationError(record, `trusted tool policy already registered: ${id} (${existing.pluginId})`);
			return;
		}
		const registration = {
			pluginId: record.id,
			pluginName: record.name,
			policy: {
				...policy,
				id,
				description,
				...matcher ? { matcher } : {}
			},
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		};
		if (record.origin === "bundled") {
			const firstInstalledPolicyIndex = policies.findIndex((entry) => entry.origin !== "bundled");
			if (firstInstalledPolicyIndex === -1) policies.push(registration);
			else policies.splice(firstInstalledPolicyIndex, 0, registration);
			return;
		}
		policies.push(registration);
	};
	const registerToolMetadata = (record, metadata) => {
		const toolName = normalizeHostHookString(metadata.toolName);
		if (!toolName) {
			reportRegistrationError(record, "tool metadata registration missing toolName");
			return;
		}
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames: normalizePluginToolContractNames(record.contracts),
			toolNames: [toolName]
		});
		if (undeclared.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.tools for tool metadata: ${undeclared.join(", ")}`);
			return;
		}
		const existing = registry.toolMetadata.find((entry) => entry.pluginId === record.id && entry.metadata.toolName === toolName);
		if (existing) {
			reportRegistrationError(record, `tool metadata already registered: ${toolName} (${existing.pluginId})`);
			return;
		}
		const displayName = normalizeOptionalHostHookString(metadata.displayName);
		const description = normalizeOptionalHostHookString(metadata.description);
		const tags = normalizeHostHookStringList(metadata.tags);
		if (displayName === "" || description === "" || tags === null || metadata.risk !== void 0 && ![
			"low",
			"medium",
			"high"
		].includes(metadata.risk)) {
			reportRegistrationError(record, `tool metadata registration has invalid metadata: ${toolName}`);
			return;
		}
		registry.toolMetadata.push({
			pluginId: record.id,
			pluginName: record.name,
			metadata: {
				...metadata,
				toolName,
				...displayName !== void 0 ? { displayName } : {},
				...description !== void 0 ? { description } : {},
				...tags !== void 0 ? { tags } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerControlUiDescriptor = (record, descriptor) => {
		const legacyDescriptor = descriptor;
		const id = normalizeHostHookString(descriptor.id);
		const label = normalizeHostHookString(descriptor.label ?? legacyDescriptor.name);
		const description = normalizeOptionalHostHookString(descriptor.description);
		const placement = normalizeOptionalHostHookString(descriptor.placement);
		const requiredScopes = normalizeHostHookStringList(descriptor.requiredScopes);
		const surface = typeof descriptor.surface === "string" ? descriptor.surface : "session";
		if (!id || !label || !controlUiSurfaces.has(surface) || description === "" || placement === "" || requiredScopes === null) {
			reportRegistrationError(record, "control UI descriptor registration requires id, surface, label, and valid optional fields");
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				reportRegistrationError(record, `control UI descriptor requiredScopes contains unknown operator scope: ${unknownScope}`);
				return;
			}
		}
		if (!validateControlUiNativeRoutePlacement({
			record,
			placement,
			pushDiagnostic
		})) return;
		if (descriptor.schema !== void 0 && !isPluginJsonValue(descriptor.schema)) {
			reportRegistrationError(record, `control UI descriptor schema must be JSON-compatible: ${id}`);
			return;
		}
		if (registry.controlUiDescriptors.find((entry) => entry.pluginId === record.id && entry.descriptor.id === id)) {
			reportRegistrationError(record, `control UI descriptor already registered: ${id}`);
			return;
		}
		const icon = normalizeOptionalHostHookString(descriptor.icon);
		const tabPath = normalizeOptionalHostHookString(descriptor.path);
		if (!(tabPath === void 0 || tabPath.startsWith("/") && !tabPath.startsWith("//") && !tabPath.startsWith("/\\"))) {
			reportRegistrationError(record, `control UI descriptor path must be a gateway-local absolute path: ${id}`);
			return;
		}
		const group = descriptor.group === "control" || descriptor.group === "agent" ? descriptor.group : void 0;
		const order = typeof descriptor.order === "number" && Number.isFinite(descriptor.order) ? descriptor.order : void 0;
		registry.controlUiDescriptors.push({
			pluginId: record.id,
			pluginName: record.name,
			descriptor: {
				...descriptor,
				id,
				surface,
				label,
				...description !== void 0 ? { description } : {},
				...placement !== void 0 ? { placement } : {},
				...requiredScopes !== void 0 ? { requiredScopes } : {},
				icon,
				path: tabPath,
				group,
				order
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerRuntimeLifecycle = (record, lifecycle) => {
		const id = normalizePluginHostHookId(lifecycle.id);
		if (!id) {
			reportRegistrationError(record, "runtime lifecycle registration missing id");
			return;
		}
		if (registry.runtimeLifecycles.find((entry) => entry.pluginId === record.id && entry.lifecycle.id === id)) {
			reportRegistrationError(record, `runtime lifecycle already registered: ${id}`);
			return;
		}
		if (lifecycle.cleanup !== void 0 && typeof lifecycle.cleanup !== "function") {
			reportRegistrationError(record, `runtime lifecycle cleanup must be a function: ${id}`);
			return;
		}
		registry.runtimeLifecycles.push({
			pluginId: record.id,
			pluginName: record.name,
			lifecycle: {
				...lifecycle,
				id
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerAgentEventSubscription = (record, subscription) => {
		const id = normalizePluginHostHookId(subscription.id);
		if (!id || typeof subscription.handle !== "function") {
			reportRegistrationError(record, "agent event subscription registration requires id and handle");
			return;
		}
		const streams = normalizeHostHookStringList(subscription.streams);
		if (streams === null) {
			reportRegistrationError(record, `agent event subscription streams must be an array of strings: ${id}`);
			return;
		}
		if (registry.agentEventSubscriptions.find((entry) => entry.pluginId === record.id && entry.subscription.id === id)) {
			reportRegistrationError(record, `agent event subscription already registered: ${id}`);
			return;
		}
		registry.agentEventSubscriptions.push({
			pluginId: record.id,
			pluginName: record.name,
			subscription: {
				...subscription,
				id,
				...streams !== void 0 ? { streams } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSessionSchedulerJob = (record, job) => {
		const jobId = normalizeHostHookString(job.id);
		const sessionKey = normalizeHostHookString(job.sessionKey);
		const kind = normalizeHostHookString(job.kind);
		if (jobId && registry.sessionSchedulerJobs.some((entry) => entry.pluginId === record.id && entry.job.id === jobId)) {
			reportRegistrationError(record, `session scheduler job already registered: ${jobId}`);
			return;
		}
		if (!jobId || !sessionKey || !kind) {
			reportRegistrationError(record, "session scheduler job registration requires unique id, sessionKey, and kind");
			return;
		}
		if (job.cleanup !== void 0 && typeof job.cleanup !== "function") {
			reportRegistrationError(record, `session scheduler job cleanup must be a function: ${jobId}`);
			return;
		}
		if (registryParams.activateGlobalSideEffects === false) {
			registry.sessionSchedulerJobs.push({
				pluginId: record.id,
				pluginName: record.name,
				job: {
					...job,
					id: jobId,
					sessionKey,
					kind
				},
				source: record.source,
				rootDir: record.rootDir
			});
			return {
				id: jobId,
				pluginId: record.id,
				sessionKey,
				kind
			};
		}
		const handle = registerPluginSessionSchedulerJob({
			pluginId: record.id,
			pluginName: record.name,
			ownerRegistry: registry,
			job: {
				...job,
				id: jobId,
				sessionKey,
				kind
			}
		});
		if (!handle) {
			reportRegistrationError(record, "session scheduler job registration requires unique id, sessionKey, and kind");
			return;
		}
		registry.sessionSchedulerJobs.push({
			pluginId: record.id,
			pluginName: record.name,
			job: {
				...job,
				id: handle.id,
				sessionKey: handle.sessionKey,
				kind: handle.kind
			},
			generation: getPluginSessionSchedulerJobGeneration({
				pluginId: record.id,
				jobId: handle.id,
				sessionKey: handle.sessionKey
			}),
			source: record.source,
			rootDir: record.rootDir
		});
		return handle;
	};
	const registerSessionAction = (record, action) => {
		const id = normalizeHostHookString(action.id);
		const description = normalizeOptionalHostHookString(action.description);
		const requiredScopes = normalizeHostHookStringList(action.requiredScopes);
		if (!id || description === "" || requiredScopes === null || typeof action.handler !== "function") {
			reportRegistrationError(record, "session action registration requires id, handler, and valid optional fields");
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				reportRegistrationError(record, `session action requiredScopes contains unknown operator scope: ${unknownScope}`);
				return;
			}
		}
		if (!validateSessionActionSchema(record, id, action.schema)) return;
		if (registry.sessionActions.find((entry) => entry.pluginId === record.id && entry.action.id === id)) {
			reportRegistrationError(record, `session action already registered: ${id}`);
			return;
		}
		registry.sessionActions.push({
			pluginId: record.id,
			pluginName: record.name,
			action: {
				...action,
				id,
				...description !== void 0 ? { description } : {},
				...requiredScopes !== void 0 ? { requiredScopes } : {}
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerConversationBindingResolvedHandler = (record, handler) => {
		registry.conversationBindingResolvedHandlers.push({
			pluginId: record.id,
			pluginName: record.name,
			pluginRoot: record.rootDir,
			handler,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerSessionExtension,
		registerTrustedToolPolicy,
		registerToolMetadata,
		registerControlUiDescriptor,
		registerBoardWidgetContentKind: createPluginBoardWidgetContentKindRegistrar(registry),
		registerRuntimeLifecycle,
		registerAgentEventSubscription,
		registerSessionSchedulerJob,
		registerSessionAction,
		registerConversationBindingResolvedHandler
	};
}
//#endregion
//#region src/plugins/registry-registrars-memory.ts
function createMemoryRegistrars(state) {
	const { registry, pushDiagnostic } = state;
	const requireMemorySlot = (record, surface) => {
		if (!hasKind(record.kind, "memory")) throw new Error(`only memory plugins can register a memory ${surface}`);
		if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `dual-kind plugin not selected for memory slot; skipping memory ${surface} registration`
			});
			return false;
		}
		return true;
	};
	const registerMemoryCapability = (record, capability) => {
		if (requireMemorySlot(record, "capability")) registry.memoryCapabilities.push({
			pluginId: record.id,
			capability
		});
	};
	const registerMemoryPromptSupplement = (record, builder) => {
		if (typeof builder !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "memory prompt supplement registration missing builder"
			});
			return;
		}
		registry.memoryPromptSupplements = registry.memoryPromptSupplements.filter((entry) => entry.pluginId !== record.id);
		registry.memoryPromptSupplements.push({
			pluginId: record.id,
			builder
		});
	};
	const registerMemoryPromptPreparation = (record, prepare) => {
		if (typeof prepare !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "memory prompt preparation registration missing prepare function"
			});
			return;
		}
		registry.memoryPromptPreparations = registry.memoryPromptPreparations.filter((entry) => entry.pluginId !== record.id);
		registry.memoryPromptPreparations.push({
			pluginId: record.id,
			prepare
		});
	};
	const registerMemoryCorpusSupplement = (record, supplement) => {
		registry.memoryCorpusSupplements = registry.memoryCorpusSupplements.filter((entry) => entry.pluginId !== record.id);
		registry.memoryCorpusSupplements.push({
			pluginId: record.id,
			supplement
		});
	};
	return {
		registerMemoryCapability,
		registerMemoryPromptSupplement,
		registerMemoryPromptPreparation,
		registerMemoryCorpusSupplement
	};
}
//#endregion
//#region src/gateway/methods/registry.ts
function normalizeMethodName(name) {
	return name.trim();
}
function normalizeDescriptor(input) {
	const name = normalizeMethodName(input.name);
	if (!name) throw new Error("gateway method descriptor name must not be empty");
	const normalizedScope = input.scope === "node" || input.scope === "dynamic" ? input.scope : input.owner.kind === "plugin" ? normalizePluginGatewayMethodScope(name, input.scope).scope : input.scope;
	if (!normalizedScope) throw new Error(`gateway method descriptor is missing a scope: ${name}`);
	return {
		...input,
		name,
		scope: normalizedScope,
		profileAccess: input.profileAccess ?? (input.owner.kind === "core" ? "independent" : "required"),
		...input.startup === "unavailable-until-sidecars" ? { startup: "unavailable-until-sidecars" } : {},
		...input.controlPlaneWrite === true ? { controlPlaneWrite: true } : {},
		...input.advertise === false ? { advertise: false } : {}
	};
}
/** Creates a read-only registry for gateway method lookup, listing, and policy metadata. */
function createGatewayMethodRegistry(inputs, pluginRegistry) {
	const descriptors = inputs.map(normalizeDescriptor);
	const byName = /* @__PURE__ */ new Map();
	for (const descriptor of descriptors) {
		if (byName.has(descriptor.name)) throw new Error(`gateway method already registered: ${descriptor.name}`);
		byName.set(descriptor.name, descriptor);
	}
	return {
		...pluginRegistry ? { pluginRegistry } : {},
		getHandler: (name) => byName.get(name)?.handler,
		listMethods: () => descriptors.map((descriptor) => descriptor.name),
		listAdvertisedMethods: () => descriptors.filter((descriptor) => descriptor.advertise !== false).map((descriptor) => descriptor.name),
		getScope: (name) => byName.get(name)?.scope,
		isStartupUnavailable: (name) => byName.get(name)?.startup === "unavailable-until-sidecars",
		isControlPlaneWrite: (name) => byName.get(name)?.controlPlaneWrite === true,
		requiresAuthenticatedProfile: (name) => byName.get(name)?.profileAccess === "required",
		descriptors: () => descriptors
	};
}
/** Converts a plain handler map into scoped descriptors owned by one gateway surface. */
function createGatewayMethodDescriptorsFromHandlers(params) {
	return Object.entries(params.handlers).map(([name, handler]) => {
		const scope = params.scopes?.[name] ?? params.defaultScope;
		if (!scope) throw new Error(`gateway method is missing a scope: ${name}`);
		return {
			name,
			handler,
			owner: params.owner,
			scope
		};
	});
}
/** Creates a plugin-owned method descriptor with plugin namespace scope normalization. */
function createPluginGatewayMethodDescriptor(params) {
	const normalizedScope = normalizePluginGatewayMethodScope(params.name, params.scope).scope;
	return {
		name: params.name,
		handler: params.handler,
		owner: {
			kind: "plugin",
			pluginId: params.pluginId
		},
		profileAccess: params.profileAccess ?? "required",
		scope: normalizedScope ?? "operator.admin"
	};
}
/** Resolves plugin method descriptors, including the legacy handler-only registry shape. */
function createPluginGatewayMethodDescriptors(registry) {
	const descriptors = registry.gatewayMethodDescriptors ?? [];
	if (descriptors.length > 0) return [...descriptors];
	return createGatewayMethodDescriptorsFromHandlers({
		handlers: registry.gatewayHandlers,
		owner: {
			kind: "plugin",
			pluginId: "unknown"
		},
		defaultScope: ADMIN_SCOPE
	});
}
//#endregion
//#region src/plugins/channel-validation.ts
function resolveBundledChannelMeta(id) {
	return listChatChannels().find((meta) => meta?.id === id) ?? resolveGeneratedBundledChannelMeta(id);
}
function resolveGeneratedBundledChannelMeta(id) {
	const channel = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === id && entry.configurable !== false);
	const label = normalizeOptionalString(channel?.label);
	if (!channel || !label) return;
	return {
		id,
		label,
		selectionLabel: label,
		docsPath: `/channels/${id}`,
		blurb: normalizeOptionalString(channel.description) ?? ""
	};
}
function collectMissingChannelMetaFields(meta) {
	const missing = [];
	if (!normalizeOptionalString(meta?.label)) missing.push("label");
	if (!normalizeOptionalString(meta?.selectionLabel)) missing.push("selectionLabel");
	if (!normalizeOptionalString(meta?.docsPath)) missing.push("docsPath");
	if (typeof meta?.blurb !== "string") missing.push("blurb");
	return missing;
}
/** Validates and normalizes a channel plugin registration before runtime catalog insertion. */
function normalizeRegisteredChannelPlugin(params) {
	const id = normalizeOptionalString(params.plugin?.id) ?? normalizeStringifiedOptionalString(params.plugin?.id) ?? "";
	if (!id) {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "channel registration missing id"
		});
		return null;
	}
	if (typeof params.plugin.config?.listAccountIds !== "function" || typeof params.plugin.config?.resolveAccount !== "function") {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: `channel "${id}" registration missing required config helpers`
		});
		return null;
	}
	const rawMeta = params.plugin.meta;
	const rawMetaId = normalizeOptionalString(rawMeta?.id);
	if (rawMetaId && rawMetaId !== id) params.pushDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" meta.id mismatch ("${rawMetaId}"); using registered channel id`
	});
	const missingFields = collectMissingChannelMetaFields(rawMeta);
	if (missingFields.length > 0) params.pushDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" registered incomplete metadata; filled missing ${missingFields.join(", ")}`
	});
	return {
		...params.plugin,
		id,
		meta: normalizeChannelMeta({
			id,
			meta: rawMeta,
			existing: resolveBundledChannelMeta(id)
		})
	};
}
//#endregion
//#region src/plugins/registry-registrars-network.ts
const GATEWAY_METHOD_DISPATCH_CONTRACT = "authenticated-request";
function adaptPluginGatewayMethodHandler(handler) {
	return async (opts) => {
		let responded = false;
		const respond = (ok, payload, error, meta) => {
			responded = true;
			opts.respond(ok, payload, error, meta);
		};
		const result = await handler({
			...opts,
			respond
		});
		if (!responded && result !== void 0) respond(true, result);
	};
}
function createNetworkRegistrars(state) {
	const { registry, coreGatewayMethods, pluginsWithChannelRegistrationConflict, pushDiagnostic } = state;
	let reportedLegacyCatalogSkip = false;
	const registerGatewayMethod = (record, method, handler, opts) => {
		const trimmed = method.trim();
		if (!trimmed) return;
		if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `gateway method already registered: ${trimmed}`
			});
			return;
		}
		const wrappedHandler = adaptPluginGatewayMethodHandler(handler);
		registry.gatewayHandlers[trimmed] = wrappedHandler;
		const normalizedScope = normalizePluginGatewayMethodScope(trimmed, opts?.scope);
		if (normalizedScope.coercedToReservedAdmin) pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `gateway method scope coerced to operator.admin for reserved core namespace: ${trimmed}`
		});
		registry.gatewayMethodDescriptors.push(createPluginGatewayMethodDescriptor({
			pluginId: record.id,
			name: trimmed,
			handler: wrappedHandler,
			scope: normalizedScope.scope,
			...opts?.profileAccess ? { profileAccess: opts.profileAccess } : {}
		}));
	};
	const registerSessionCatalog = (record, provider) => {
		const id = provider.id.trim();
		const label = provider.label.trim();
		if (!id || !label) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "session catalog requires non-empty id and label"
			});
			return;
		}
		if (!state.allowProcessHomeSessionCatalogs && provider.supportsProcessHomeIsolation !== true) {
			if (!reportedLegacyCatalogSkip) {
				reportedLegacyCatalogSkip = true;
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: "external session catalog skipped in isolated state: provider must declare supportsProcessHomeIsolation"
				});
			}
			return;
		}
		const existing = registry.sessionCatalogs.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `session catalog already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		registry.sessionCatalogs.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				id,
				label
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const describeHttpRouteOwner = (entry) => {
		return `${normalizeOptionalString(entry.pluginId) || "unknown-plugin"} (${normalizeOptionalString(entry.source) || "unknown-source"})`;
	};
	const canDispatchGatewayMethodsFromHttpRoute = (record) => (record.contracts?.gatewayMethodDispatch ?? []).includes(GATEWAY_METHOD_DISPATCH_CONTRACT);
	const registerHttpRoute = (record, params) => {
		const normalizedPath = normalizePluginHttpPath(params.path);
		if (!normalizedPath) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "http route registration missing path"
			});
			return;
		}
		if (params.auth !== "gateway" && params.auth !== "plugin") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `http route registration missing or invalid auth: ${normalizedPath}`
			});
			return;
		}
		const match = params.match ?? "exact";
		const { authOverlap, canonicalMatches } = findPluginHttpRouteRegistrationConflicts(registry.httpRoutes, {
			path: normalizedPath,
			match,
			auth: params.auth
		});
		if (authOverlap) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `http route overlap rejected: ${normalizedPath} (${match}, ${params.auth}) overlaps ${authOverlap.path} (${authOverlap.match}, ${authOverlap.auth}) owned by ${describeHttpRouteOwner(authOverlap)}`
			});
			return;
		}
		const existingIndex = canonicalMatches[0] ? registry.httpRoutes.indexOf(canonicalMatches[0]) : -1;
		const registration = {
			pluginId: record.id,
			path: normalizedPath,
			handler: params.handler,
			...params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {},
			auth: params.auth,
			match,
			...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
			...canDispatchGatewayMethodsFromHttpRoute(record) ? { gatewayMethodDispatchAllowed: true } : {},
			...params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {},
			source: record.source
		};
		if (existingIndex >= 0) {
			if (!registry.httpRoutes[existingIndex]) return;
			const foreignOwner = canonicalMatches.find((route) => route.pluginId !== record.id);
			if (foreignOwner) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: params.replaceExisting ? `http route replacement rejected: ${normalizedPath} (${match}) owned by ${describeHttpRouteOwner(foreignOwner)}` : `http route already registered: ${normalizedPath} (${match}) by ${describeHttpRouteOwner(foreignOwner)}`
				});
				return;
			}
			registry.httpRoutes[existingIndex] = registration;
			for (const route of canonicalMatches.toReversed()) {
				const index = registry.httpRoutes.indexOf(route);
				if (index >= 0 && index !== existingIndex) registry.httpRoutes.splice(index, 1);
			}
			return;
		}
		record.httpRoutes += 1;
		registry.httpRoutes.push(registration);
	};
	const registerHostedMediaResolver = (record, resolver) => {
		if (typeof resolver !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "hosted media resolver registration missing resolver"
			});
			return;
		}
		registry.hostedMediaResolvers.push({
			pluginId: record.id,
			pluginName: record.name,
			resolver,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerMcpServerConnectionResolver = (record, resolver) => {
		const serverName = normalizeOptionalString(resolver?.serverName);
		if (!serverName || typeof resolver.resolve !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "MCP server connection resolver registration missing serverName or resolve"
			});
			return;
		}
		const existingIndex = registry.mcpServerConnectionResolvers.findIndex((entry) => entry.resolver.serverName === serverName);
		const registration = {
			pluginId: record.id,
			pluginName: record.name,
			resolver: {
				serverName,
				resolve: resolver.resolve
			},
			source: record.source,
			rootDir: record.rootDir
		};
		if (existingIndex >= 0) {
			const existing = registry.mcpServerConnectionResolvers[existingIndex];
			if (existing && existing.pluginId !== record.id) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `MCP server connection resolver for "${serverName}" rejected: already registered by plugin "${existing.pluginId}"`
				});
				return;
			}
			registry.mcpServerConnectionResolvers[existingIndex] = registration;
			return;
		}
		registry.mcpServerConnectionResolvers.push(registration);
	};
	const registerChannel = (record, registration, mode = "full", resolveChannelRuntime) => {
		if (record.origin === "workspace" && !record.enabled) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `channel registration rejected for disabled workspace plugin: ${record.id}`
			});
			return;
		}
		const registrationCapabilities = resolvePluginRegistrationCapabilities(mode);
		const normalized = typeof registration.plugin === "object" ? registration : { plugin: registration };
		const plugin = normalizeRegisteredChannelPlugin({
			pluginId: record.id,
			source: record.source,
			plugin: normalized.plugin,
			pushDiagnostic
		});
		if (!plugin) return;
		const id = plugin.id;
		const existingRuntime = registry.channels.find((entry) => entry.plugin.id === id);
		if (registrationCapabilities.runtimeChannel && existingRuntime) {
			if (existingRuntime.pluginId === record.id) {
				existingRuntime.plugin = plugin;
				existingRuntime.pluginName = record.name;
				existingRuntime.resolveChannelRuntime = resolveChannelRuntime;
				existingRuntime.origin = record.origin;
				existingRuntime.source = record.source;
				existingRuntime.rootDir = record.rootDir;
				const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
				if (existingSetup) {
					existingSetup.plugin = plugin;
					existingSetup.pluginName = record.name;
					existingSetup.origin = record.origin;
					existingSetup.source = record.source;
					existingSetup.enabled = record.enabled;
					existingSetup.rootDir = record.rootDir;
				}
				return;
			}
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `channel already registered: ${id} (${existingRuntime.pluginId})`
			});
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
		if (existingSetup) {
			if (existingSetup.pluginId === record.id) {
				existingSetup.plugin = plugin;
				existingSetup.pluginName = record.name;
				existingSetup.origin = record.origin;
				existingSetup.source = record.source;
				existingSetup.enabled = record.enabled;
				existingSetup.rootDir = record.rootDir;
				return;
			}
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `channel setup already registered: ${id} (${existingSetup.pluginId})`
			});
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		if (!record.channelIds.includes(id)) record.channelIds.push(id);
		registry.channelSetups.push({
			pluginId: record.id,
			pluginName: record.name,
			plugin,
			origin: record.origin,
			source: record.source,
			enabled: record.enabled,
			rootDir: record.rootDir
		});
		if (!registrationCapabilities.runtimeChannel) return;
		registry.channels.push({
			pluginId: record.id,
			pluginName: record.name,
			plugin,
			resolveChannelRuntime,
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerGatewayMethod,
		registerSessionCatalog,
		registerHttpRoute,
		registerHostedMediaResolver,
		registerMcpServerConnectionResolver,
		registerChannel
	};
}
//#endregion
//#region src/plugins/hook-types.ts
const pluginHookNameSet = /* @__PURE__ */ new Set([
	"before_model_resolve",
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_reply",
	"model_call_started",
	"model_call_ended",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_compaction",
	"after_compaction",
	"before_reset",
	"inbound_claim",
	"channel_pairing_requested",
	"message_received",
	"message_sending",
	"reply_payload_sending",
	"message_sent",
	"before_tool_call",
	"after_tool_call",
	"tool_result_persist",
	"before_message_write",
	"session_start",
	"session_end",
	"subagent_delivery_target",
	"subagent_spawned",
	"subagent_progress",
	"subagent_ended",
	"gateway_start",
	"gateway_stop",
	"heartbeat_prompt_contribution",
	"cron_reconciled",
	"cron_changed",
	"skill_proposal_evaluate",
	"skill_proposal_changed",
	"skill_changed",
	"before_dispatch",
	"reply_dispatch",
	"before_install",
	"before_agent_run",
	"resolve_exec_env"
]);
const isPluginHookName = (hookName) => typeof hookName === "string" && pluginHookNameSet.has(hookName);
const promptInjectionHookNameSet = /* @__PURE__ */ new Set([
	"agent_turn_prepare",
	"before_prompt_build",
	"heartbeat_prompt_contribution"
]);
const isPromptInjectionHookName = (hookName) => promptInjectionHookNameSet.has(hookName);
const conversationHookNameSet = /* @__PURE__ */ new Set([
	"before_model_resolve",
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_reply",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_agent_run"
]);
const isConversationHookName = (hookName) => conversationHookNameSet.has(hookName);
const pluginHookAgentTriggerSet = /* @__PURE__ */ new Set([
	"cron",
	"heartbeat",
	"user"
]);
const isPluginHookAgentTrigger = (trigger) => typeof trigger === "string" && pluginHookAgentTriggerSet.has(trigger);
//#endregion
//#region src/plugins/registry-registrars-operations.ts
function isOfficialCodexPluginRecord(record) {
	if (record.id !== "codex" || record.origin !== "global") return false;
	if (record.packageName === "@openclaw/codex") return true;
	return path.normalize(record.rootDir ?? record.source).split(path.sep).join("/").includes("/node_modules/@openclaw/codex");
}
function canClaimReservedCommandOwnership(record) {
	return record.origin === "bundled" || isOfficialCodexPluginRecord(record);
}
function createOperationRegistrars(state) {
	const { registry, pushDiagnostic } = state;
	const registerWidgetPresenter = (record, presenter) => {
		const description = normalizeOptionalString(presenter.description);
		const currentCapabilities = presenter.target === "current_channel" ? presenter.capabilities : void 0;
		const currentChannelValid = presenter.target === "current_channel" && typeof presenter.match === "function" && currentCapabilities !== void 0 && Array.isArray(currentCapabilities.sourceKinds) && currentCapabilities.sourceKinds.length > 0 && currentCapabilities.sourceKinds.every((kind) => typeof kind === "string" && kind.trim().length > 0) && (currentCapabilities.maxSourceBytes === void 0 || Number.isInteger(currentCapabilities.maxSourceBytes) && currentCapabilities.maxSourceBytes > 0);
		if (presenter.target !== "node_panel" && !currentChannelValid || !description || description.length > 160 || typeof presenter.availability !== "function" || typeof presenter.present !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "invalid widget presenter registration"
			});
			return;
		}
		const existing = presenter.target === "current_channel" ? void 0 : registry.widgetPresenters.find((registration) => registration.presenter.target === presenter.target);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `widget presenter already registered for ${presenter.target} (${existing.pluginId})`
			});
			return;
		}
		registry.widgetPresenters.push({
			pluginId: record.id,
			pluginName: record.name,
			presenter: {
				...presenter,
				description
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCli = (record, registrar, opts) => {
		const normalizeCommandRoot = (raw, source) => {
			const normalized = normalizeCommandDescriptorName(raw);
			if (!normalized) pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `invalid cli ${source} name: ${JSON.stringify(raw.trim())}`
			});
			return normalized;
		};
		const parentPath = (opts?.parentPath ?? []).map((segment) => normalizeCommandRoot(segment, "command"));
		if (parentPath.some((segment) => segment === null)) return;
		const normalizedParentPath = parentPath;
		const rootRegistration = normalizedParentPath.length === 0;
		const descriptors = (opts?.descriptors ?? []).map((descriptor) => {
			const name = normalizeCommandRoot(descriptor.name, "descriptor");
			const description = sanitizeCommandDescriptorDescription(descriptor.description);
			const machineOutput = rootRegistration ? descriptor.machineOutput : void 0;
			if (!name || !description) return null;
			const normalized = {
				name,
				description,
				hasSubcommands: descriptor.hasSubcommands
			};
			if (machineOutput) normalized.machineOutput = machineOutput;
			return normalized;
		}).filter((descriptor) => descriptor !== null);
		const commands = normalizeUniqueStringEntries([...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)].map((command) => normalizeCommandRoot(command, "command")).filter((command) => command !== null));
		if (commands.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "cli registration missing explicit commands metadata"
			});
			return;
		}
		const serializeCommandPath = (command) => [...normalizedParentPath, command].join(" ");
		const commandPaths = commands.map(serializeCommandPath);
		const commandPathSet = new Set(commandPaths);
		const existing = registry.cliRegistrars.find((entry) => entry.commands.map((command) => [...entry.parentPath ?? [], command].join(" ")).some((commandPath) => commandPathSet.has(commandPath)));
		if (existing) {
			const existingCommandPaths = new Set(existing.commands.map((command) => [...existing.parentPath ?? [], command].join(" ")));
			const overlap = commandPaths.find((commandPath) => existingCommandPaths.has(commandPath));
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `cli command already registered: ${overlap ?? commands[0]} (${existing.pluginId})`
			});
			return;
		}
		record.cliCommands.push(...commandPaths);
		registry.cliRegistrars.push({
			pluginId: record.id,
			pluginName: record.name,
			register: registrar,
			parentPath: normalizedParentPath,
			commands,
			descriptors,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerReload = (record, registration) => {
		const normalized = {
			restartPrefixes: normalizeStringEntries(registration.restartPrefixes),
			hotPrefixes: normalizeStringEntries(registration.hotPrefixes),
			noopPrefixes: normalizeStringEntries(registration.noopPrefixes)
		};
		if ((normalized.restartPrefixes?.length ?? 0) === 0 && (normalized.hotPrefixes?.length ?? 0) === 0 && (normalized.noopPrefixes?.length ?? 0) === 0) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "reload registration missing prefixes"
			});
			return;
		}
		registry.reloads.push({
			pluginId: record.id,
			pluginName: record.name,
			registration: normalized,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const reservedNodeHostCommands = /* @__PURE__ */ new Set([
		...NODE_SYSTEM_RUN_COMMANDS,
		...NODE_EXEC_APPROVALS_COMMANDS,
		NODE_SYSTEM_NOTIFY_COMMAND,
		...NODE_WORKER_PRIVATE_COMMANDS
	]);
	const registerNodeHostCommand = (record, nodeCommand) => {
		const command = nodeCommand.command.trim();
		if (!command) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "node host command registration missing command"
			});
			return;
		}
		const bundledSystemNotify = record.origin === "bundled" && command === "system.notify";
		if (reservedNodeHostCommands.has(command) && !bundledSystemNotify) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node host command reserved by core: ${command}`
			});
			return;
		}
		const existing = registry.nodeHostCommands.find((entry) => entry.command.command === command);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node host command already registered: ${command} (${existing.pluginId})`
			});
			return;
		}
		registry.nodeHostCommands.push({
			pluginId: record.id,
			pluginName: record.name,
			command: {
				...nodeCommand,
				command,
				cap: normalizeOptionalString(nodeCommand.cap)
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerNodeInvokePolicy = (record, policy, pluginConfig) => {
		const commands = normalizeUniqueStringEntries(Array.isArray(policy.commands) ? policy.commands : []);
		if (commands.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "node invoke policy registration missing commands"
			});
			return;
		}
		const reservedCommand = commands.find(isPrivateNodeInvokeCommand);
		if (reservedCommand) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node invoke policy command reserved by core: ${reservedCommand}`
			});
			return;
		}
		if (typeof policy.handle !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `node invoke policy registration missing handler: ${commands.join(", ")}`
			});
			return;
		}
		for (const command of commands) {
			const existing = registry.nodeInvokePolicies.find((entry) => entry.policy.commands.includes(command));
			if (existing) {
				pushDiagnostic({
					level: "error",
					pluginId: record.id,
					source: record.source,
					message: `node invoke policy already registered for ${command} (${existing.pluginId})`
				});
				return;
			}
		}
		registry.nodeInvokePolicies.push({
			pluginId: record.id,
			pluginName: record.name,
			policy: {
				...policy,
				commands
			},
			pluginConfig,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerSecurityAuditCollector = (record, collector) => {
		registry.securityAuditCollectors.push({
			pluginId: record.id,
			pluginName: record.name,
			collector,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const resolveServiceRegistrationId = (record, service, kind) => {
		const id = service.id.trim();
		const registrations = kind === "service" ? registry.services : registry.gatewayDiscoveryServices;
		const existing = id ? registrations.find((entry) => entry.service.id.trim() === id) : void 0;
		if (id && !existing) return id;
		if (existing?.pluginId !== record.id) pushDiagnostic({
			level: "error",
			pluginId: record.id,
			source: record.source,
			message: existing ? `${kind} already registered: ${id} (${existing.pluginId})` : `${kind} registration missing id`
		});
	};
	const registerService = (record, service) => {
		const id = resolveServiceRegistrationId(record, service, "service");
		if (!id) return;
		record.services.push(id);
		registry.services.push({
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			origin: record.origin,
			trustedOfficialInstall: record.trustedOfficialInstall,
			rootDir: record.rootDir
		});
	};
	const registerGatewayDiscoveryService = (record, service) => {
		const id = resolveServiceRegistrationId(record, service, "gateway discovery service");
		if (!id) return;
		record.gatewayDiscoveryServiceIds.push(id);
		registry.gatewayDiscoveryServices.push({
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCommand = (record, command) => {
		const name = command.name.trim();
		if (!name) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "command registration missing name"
			});
			return;
		}
		const allowReservedCommandNames = command.ownership === "reserved";
		if (allowReservedCommandNames && !canClaimReservedCommandOwnership(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `only bundled plugins can claim reserved command ownership: ${name}`
			});
			return;
		}
		if (allowReservedCommandNames && !isReservedCommandName(name)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `reserved command ownership requires a reserved command name: ${name}`
			});
			return;
		}
		if (allowReservedCommandNames && record.id !== normalizeLowercaseStringOrEmpty(name)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `command registration failed: Reserved command ownership requires plugin id "${record.id}" to match reserved command name "${normalizeLowercaseStringOrEmpty(name)}"`
			});
			return;
		}
		const { ownership: _ownership, ...commandForRegistration } = command;
		const result = registerPluginCommandInRegistry(registry, record.id, allowReservedCommandNames ? commandForRegistration : command, {
			pluginName: record.name,
			pluginRoot: record.rootDir,
			allowReservedCommandNames,
			allowOwnerStatusExposure: canClaimReservedCommandOwnership(record)
		});
		if (!result.ok) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `command registration failed: ${result.error}`
			});
			return;
		}
		const registered = registry.commands.at(-1);
		if (registered?.pluginId === record.id) {
			registered.source = record.source;
			if (allowReservedCommandNames) registered.command.ownership = "reserved";
		}
		record.commands.push(name);
	};
	return {
		registerWidgetPresenter,
		registerCli,
		registerReload,
		registerNodeHostCommand,
		registerNodeInvokePolicy,
		registerSecurityAuditCollector,
		registerService,
		registerGatewayDiscoveryService,
		registerCommand
	};
}
//#endregion
//#region src/plugins/provider-validation.ts
/** Validates and normalizes provider plugin definitions before registry registration. */
function normalizeTextList(values) {
	const normalized = normalizeUniqueTrimmedStringList(values);
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeOnboardingScopes(values) {
	const normalized = Array.from(new Set((values ?? []).filter((value) => value === "text-inference" || value === "image-generation" || value === "music-generation")));
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeProviderOAuthProfileIdRepairs(values) {
	if (!Array.isArray(values)) return;
	const normalized = values.map((value) => {
		const legacyProfileId = normalizeOptionalString(value?.legacyProfileId);
		const promptLabel = normalizeOptionalString(value?.promptLabel);
		if (!legacyProfileId && !promptLabel) return null;
		return {
			...legacyProfileId ? { legacyProfileId } : {},
			...promptLabel ? { promptLabel } : {}
		};
	}).filter((value) => value !== null);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveWizardMethodId(params) {
	if (!params.methodId) return;
	if (params.auth.some((method) => method.id === params.methodId)) return params.methodId;
	params.pushDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `provider "${params.providerId}" ${params.metadataKind} method "${params.methodId}" not found; falling back to available methods`
	});
}
function buildNormalizedModelAllowlist(modelAllowlist) {
	if (!modelAllowlist) return;
	const allowedKeys = normalizeTextList(modelAllowlist.allowedKeys);
	const initialSelections = normalizeTextList(modelAllowlist.initialSelections);
	const loadCatalog = modelAllowlist.loadCatalog === true;
	const message = normalizeOptionalString(modelAllowlist.message);
	if (!allowedKeys && !initialSelections && !loadCatalog && !message) return;
	return {
		...allowedKeys ? { allowedKeys } : {},
		...initialSelections ? { initialSelections } : {},
		...loadCatalog ? { loadCatalog } : {},
		...message ? { message } : {}
	};
}
function buildNormalizedWizardSetup(params) {
	const choiceId = normalizeOptionalString(params.setup.choiceId);
	const choiceLabel = normalizeOptionalString(params.setup.choiceLabel);
	const choiceHint = normalizeOptionalString(params.setup.choiceHint);
	const groupId = normalizeOptionalString(params.setup.groupId);
	const groupLabel = normalizeOptionalString(params.setup.groupLabel);
	const groupHint = normalizeOptionalString(params.setup.groupHint);
	const onboardingScopes = normalizeOnboardingScopes(params.setup.onboardingScopes);
	const modelAllowlist = buildNormalizedModelAllowlist(params.setup.modelAllowlist);
	return {
		...choiceId ? { choiceId } : {},
		...choiceLabel ? { choiceLabel } : {},
		...choiceHint ? { choiceHint } : {},
		...typeof params.setup.assistantPriority === "number" && Number.isFinite(params.setup.assistantPriority) ? { assistantPriority: params.setup.assistantPriority } : {},
		...params.setup.assistantVisibility === "manual-only" || params.setup.assistantVisibility === "visible" ? { assistantVisibility: params.setup.assistantVisibility } : {},
		...params.setup.onboardingFeatured === true ? { onboardingFeatured: true } : {},
		...groupId ? { groupId } : {},
		...groupLabel ? { groupLabel } : {},
		...groupHint ? { groupHint } : {},
		...params.methodId ? { methodId: params.methodId } : {},
		...onboardingScopes ? { onboardingScopes } : {},
		...modelAllowlist ? { modelAllowlist } : {}
	};
}
function buildNormalizedModelPicker(modelPicker, methodId) {
	const label = normalizeOptionalString(modelPicker.label);
	const hint = normalizeOptionalString(modelPicker.hint);
	return {
		...label ? { label } : {},
		...hint ? { hint } : {},
		...methodId ? { methodId } : {}
	};
}
function normalizeProviderWizardSetup(params) {
	const hasAuthMethods = params.auth.length > 0;
	if (!params.setup) return;
	if (!hasAuthMethods) {
		params.pushDiagnostic({
			level: "warn",
			pluginId: params.pluginId,
			source: params.source,
			message: `provider "${params.providerId}" setup metadata ignored because it has no auth methods`
		});
		return;
	}
	const methodId = resolveWizardMethodId({
		providerId: params.providerId,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.auth,
		methodId: normalizeOptionalString(params.setup.methodId),
		metadataKind: "setup",
		pushDiagnostic: params.pushDiagnostic
	});
	return buildNormalizedWizardSetup({
		setup: params.setup,
		methodId
	});
}
function normalizeProviderAuthMethods(params) {
	const seenMethodIds = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const method of params.auth) {
		const methodId = normalizeOptionalString(method.id);
		if (!methodId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method missing id`
			});
			continue;
		}
		if (seenMethodIds.has(methodId)) {
			params.pushDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method duplicated id "${methodId}"`
			});
			continue;
		}
		seenMethodIds.add(methodId);
		const wizardSetup = method.wizard;
		const wizard = wizardSetup ? normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: [{
				...method,
				id: methodId
			}],
			setup: wizardSetup,
			pushDiagnostic: params.pushDiagnostic
		}) : void 0;
		normalized.push({
			...method,
			id: methodId,
			label: normalizeOptionalString(method.label) ?? methodId,
			...normalizeOptionalString(method.hint) ? { hint: normalizeOptionalString(method.hint) } : {},
			...wizard ? { wizard } : {}
		});
	}
	return normalized;
}
function normalizeProviderWizard(params) {
	if (!params.wizard) return;
	const hasAuthMethods = params.auth.length > 0;
	const normalizeSetup = () => {
		const setup = params.wizard?.setup;
		if (!setup) return;
		return normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			setup,
			pushDiagnostic: params.pushDiagnostic
		});
	};
	const normalizeModelPicker = () => {
		const modelPicker = params.wizard?.modelPicker;
		if (!modelPicker) return;
		if (!hasAuthMethods) {
			params.pushDiagnostic({
				level: "warn",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" model-picker metadata ignored because it has no auth methods`
			});
			return;
		}
		return buildNormalizedModelPicker(modelPicker, resolveWizardMethodId({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			methodId: normalizeOptionalString(modelPicker.methodId),
			metadataKind: "model-picker",
			pushDiagnostic: params.pushDiagnostic
		}));
	};
	const setup = normalizeSetup();
	const modelPicker = normalizeModelPicker();
	if (!setup && !modelPicker) return;
	return {
		...setup ? { setup } : {},
		...modelPicker ? { modelPicker } : {}
	};
}
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
function normalizeRegisteredProvider(params) {
	const id = normalizeOptionalString(params.provider.id);
	if (!id) {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "provider registration missing id"
		});
		return null;
	}
	const auth = normalizeProviderAuthMethods({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.provider.auth ?? [],
		pushDiagnostic: params.pushDiagnostic
	});
	const docsPath = normalizeOptionalString(params.provider.docsPath);
	const aliases = normalizeTextList(params.provider.aliases);
	const deprecatedProfileIds = normalizeTextList(params.provider.deprecatedProfileIds);
	const oauthProfileIdRepairs = normalizeProviderOAuthProfileIdRepairs(params.provider.oauthProfileIdRepairs);
	const envVars = normalizeTextList(params.provider.envVars);
	const wizard = normalizeProviderWizard({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth,
		wizard: params.provider.wizard,
		pushDiagnostic: params.pushDiagnostic
	});
	const catalog = params.provider.catalog;
	const { wizard: _ignoredWizard, docsPath: _ignoredDocsPath, aliases: _ignoredAliases, envVars: _ignoredEnvVars, catalog: _ignoredCatalog, ...restProvider } = params.provider;
	return {
		...restProvider,
		id,
		label: normalizeOptionalString(params.provider.label) ?? id,
		...docsPath ? { docsPath } : {},
		...aliases ? { aliases } : {},
		...deprecatedProfileIds ? { deprecatedProfileIds } : {},
		...oauthProfileIdRepairs ? { oauthProfileIdRepairs } : {},
		...envVars ? { envVars } : {},
		auth,
		...catalog ? { catalog } : {},
		...wizard ? { wizard } : {}
	};
}
//#endregion
//#region src/plugins/registry-registrars-providers.ts
function createProviderRegistrars(state) {
	const { registry, pushDiagnostic, registerSynthesizedTextModelCatalogProvider, registerSynthesizedMediaModelCatalogProvider, registerSynthesizedVoiceModelCatalogProvider } = state;
	const registerProvider = (record, provider) => {
		const normalizedProvider = normalizeRegisteredProvider({
			pluginId: record.id,
			source: record.source,
			provider,
			pushDiagnostic
		});
		if (!normalizedProvider) return;
		const id = normalizedProvider.id;
		const existing = registry.providers.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `provider already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		if (!record.providerIds.includes(id)) record.providerIds.push(id);
		registry.providers.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: normalizedProvider,
			source: record.source,
			rootDir: record.rootDir
		});
		registerSynthesizedTextModelCatalogProvider({
			record,
			provider: normalizedProvider
		});
	};
	const registerAgentHarness = (record, harness, options) => {
		const id = normalizeOptionalString(harness?.id) ?? "";
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent harness registration missing id"
			});
			return;
		}
		if (id === "openclaw") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent harness id \"openclaw\" is reserved for the built-in runtime"
			});
			return;
		}
		if (typeof harness.supports !== "function" || typeof harness.runAttempt !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent harness "${id}" registration missing required runtime methods`
			});
			return;
		}
		if (options?.nativeCompaction && (!canClaimReservedCommandOwnership(record) || id !== "codex" || typeof options.nativeCompaction !== "function")) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "native compaction requires the registry-owned \"codex\" harness"
			});
			return;
		}
		const existing = registry.agentHarnesses.find((entry) => entry.harness.id === id);
		if (existing) {
			const ownerPluginId = "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `agent harness already registered: ${id}${ownerDetail}`
			});
			return;
		}
		const normalizedHarness = {
			...harness,
			id,
			pluginId: harness.pluginId ?? record.id
		};
		record.agentHarnessIds.push(id);
		registry.agentHarnesses.push({
			pluginId: record.id,
			pluginName: record.name,
			harness: normalizedHarness,
			...options?.nativeCompaction ? { nativeCompaction: options.nativeCompaction } : {},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerCliBackend = (record, backend) => {
		const id = backend.id.trim();
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "cli backend registration missing id"
			});
			return;
		}
		const existing = registry.cliBackends.find((entry) => entry.backend.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `cli backend already registered: ${id} (${existing.pluginId})`
			});
			return;
		}
		registry.cliBackends.push({
			pluginId: record.id,
			pluginName: record.name,
			builtWithOpenClawVersion: record.builtWithOpenClawVersion,
			backend: {
				...backend,
				id
			},
			source: record.source,
			rootDir: record.rootDir
		});
		record.cliBackendIds.push(id);
	};
	const registerTextTransforms = (record, transforms) => {
		if ((!transforms.input || transforms.input.length === 0) && (!transforms.output || transforms.output.length === 0)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: "text transform registration has no input or output replacements"
			});
			return;
		}
		registry.textTransforms.push({
			pluginId: record.id,
			pluginName: record.name,
			transforms,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerEmbeddingProvider = (record, adapter) => {
		const id = adapter.id.trim();
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "embedding provider registration missing id"
			});
			return;
		}
		if (!(record.contracts?.embeddingProviders ?? []).includes(id)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.embeddingProviders for adapter: ${id}`
			});
			return;
		}
		const existing = getCoreEmbeddingProvider(id) ?? registry.embeddingProviders.find((entry) => entry.provider.id === id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `embedding provider already registered: ${id}${ownerDetail}`
			});
			return;
		}
		registry.embeddingProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: adapter,
			source: record.source,
			rootDir: record.rootDir
		});
		if (!record.embeddingProviderIds.includes(id)) record.embeddingProviderIds.push(id);
	};
	const createProviderLikeRegistrar = (params) => (record, provider) => {
		const id = provider.id.trim();
		const { kindLabel } = params;
		if (!id) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `${kindLabel} registration missing id`
			});
			return params.onRegister ? void 0 : false;
		}
		const existing = params.registrations.find((entry) => entry.provider.id === id);
		if (existing) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `${kindLabel} already registered: ${id} (${existing.pluginId})`
			});
			return params.onRegister ? void 0 : false;
		}
		const ownedIds = params.ownedIds(record);
		if (!ownedIds.includes(id)) ownedIds.push(id);
		params.registrations.push({
			pluginId: record.id,
			pluginName: record.name,
			provider,
			source: record.source,
			rootDir: record.rootDir
		});
		if (params.onRegister) {
			params.onRegister(record, provider);
			return;
		}
		return true;
	};
	const registerWorkerProvider = (record, provider) => {
		const reject = (message) => pushDiagnostic({
			level: "error",
			pluginId: record.id,
			source: record.source,
			message
		});
		const validation = validateWorkerProviderContract(provider, record.contracts?.workerProviders ?? []);
		if (!validation.ok) {
			reject(validation.message);
			return;
		}
		const { id } = validation;
		const existing = registry.workerProviders.get(id);
		if (existing) {
			reject(`worker provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		registry.workerProviders.set(id, {
			pluginId: record.id,
			pluginName: record.name,
			provider,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return {
		registerProvider,
		registerAgentHarness,
		registerCliBackend,
		registerTextTransforms,
		registerEmbeddingProvider,
		registerWorkerProvider,
		registerSpeechProvider: createProviderLikeRegistrar({
			kindLabel: "speech provider",
			registrations: registry.speechProviders,
			ownedIds: (record) => record.speechProviderIds,
			onRegister: (record, provider) => registerSynthesizedVoiceModelCatalogProvider({
				record,
				provider,
				capabilities: { tts: true },
				modes: ["tts"]
			})
		}),
		registerRealtimeTranscriptionProvider: createProviderLikeRegistrar({
			kindLabel: "realtime transcription provider",
			registrations: registry.realtimeTranscriptionProviders,
			ownedIds: (record) => record.realtimeTranscriptionProviderIds,
			onRegister: (record, provider) => registerSynthesizedVoiceModelCatalogProvider({
				record,
				provider,
				capabilities: { realtime_transcription: true },
				modes: ["realtime_transcription"]
			})
		}),
		registerRealtimeVoiceProvider: createProviderLikeRegistrar({
			kindLabel: "realtime voice provider",
			registrations: registry.realtimeVoiceProviders,
			ownedIds: (record) => record.realtimeVoiceProviderIds,
			onRegister: (record, provider) => registerSynthesizedVoiceModelCatalogProvider({
				record,
				provider,
				capabilities: { realtime_voice: true },
				modes: ["realtime_voice"]
			})
		}),
		registerMediaUnderstandingProvider: createProviderLikeRegistrar({
			kindLabel: "media provider",
			registrations: registry.mediaUnderstandingProviders,
			ownedIds: (record) => record.mediaUnderstandingProviderIds
		}),
		registerTranscriptSourceProvider: createProviderLikeRegistrar({
			kindLabel: "transcripts source provider",
			registrations: registry.transcriptSourceProviders,
			ownedIds: (record) => record.transcriptSourceProviderIds
		}),
		registerImageGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "image-generation provider",
			registrations: registry.imageGenerationProviders,
			ownedIds: (record) => record.imageGenerationProviderIds,
			onRegister: (record, provider) => registerSynthesizedMediaModelCatalogProvider({
				record,
				kind: "image_generation",
				provider
			})
		}),
		registerVideoGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "video-generation provider",
			registrations: registry.videoGenerationProviders,
			ownedIds: (record) => record.videoGenerationProviderIds,
			onRegister: (record, provider) => registerSynthesizedMediaModelCatalogProvider({
				record,
				kind: "video_generation",
				provider
			})
		}),
		registerMusicGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "music-generation provider",
			registrations: registry.musicGenerationProviders,
			ownedIds: (record) => record.musicGenerationProviderIds,
			onRegister: (record, provider) => registerSynthesizedMediaModelCatalogProvider({
				record,
				kind: "music_generation",
				provider
			})
		}),
		registerWebFetchProvider: createProviderLikeRegistrar({
			kindLabel: "web fetch provider",
			registrations: registry.webFetchProviders,
			ownedIds: (record) => record.webFetchProviderIds
		}),
		registerWebSearchProvider: createProviderLikeRegistrar({
			kindLabel: "web search provider",
			registrations: registry.webSearchProviders,
			ownedIds: (record) => record.webSearchProviderIds
		}),
		registerMigrationProvider: createProviderLikeRegistrar({
			kindLabel: "migration provider",
			registrations: registry.migrationProviders,
			ownedIds: (record) => record.migrationProviderIds
		})
	};
}
/** Lists active Codex app-server extension factories from the plugin registry. */
function listCodexAppServerExtensionFactories() {
	return getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? [];
}
//#endregion
//#region src/plugins/registry-registrars-tools-hooks.ts
function normalizeEligibleTriggers(value) {
	if (!Array.isArray(value)) return;
	const triggers = Array.from(value);
	if (triggers.length === 0 || !triggers.every(isPluginHookAgentTrigger)) return;
	return uniqueValues(triggers);
}
function canRegisterInstalledTrustedHook(record) {
	return record.origin === "bundled" || record.enabled && record.explicitlyEnabled === true;
}
function createToolHookRegistrars(state) {
	const { registry, registryParams, pluginsWithChannelRegistrationConflict, pushDiagnostic } = state;
	const registerCodexAppServerExtensionFactory = (record, factory) => {
		if (record.origin !== "bundled") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "only bundled plugins can register Codex app-server extension factories"
			});
			return;
		}
		if (!(record.contracts?.embeddedExtensionFactories ?? []).includes("codex-app-server")) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must declare contracts.embeddedExtensionFactories: [\"codex-app-server\"] to register Codex app-server extension factories"
			});
			return;
		}
		if (typeof factory !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "codex app-server extension factory must be a function"
			});
			return;
		}
		if (registry.codexAppServerExtensionFactories.some((entry) => entry.pluginId === record.id && entry.rawFactory === factory)) return;
		const safeFactory = async (codex) => {
			try {
				await factory(codex);
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				registryParams.logger.warn(`[plugins] codex app-server extension factory failed for ${record.id}: ${detail}`);
			}
		};
		registry.codexAppServerExtensionFactories.push({
			pluginId: record.id,
			pluginName: record.name,
			rawFactory: factory,
			factory: safeFactory,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerAgentToolResultMiddleware = (record, handler, options, policy) => {
		if (typeof handler !== "function") {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent tool result middleware must be a function"
			});
			return;
		}
		const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
		const matcher = normalizePluginToolMatcher(options?.matcher);
		if (runtimes.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "agent tool result middleware must target at least one supported runtime"
			});
			return;
		}
		const declared = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
		const missing = runtimes.filter((runtime) => !declared.includes(runtime));
		if (missing.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.agentToolResultMiddleware for: ${missing.join(", ")}`
			});
			return;
		}
		if (!canRegisterInstalledTrustedHook(record)) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must be explicitly enabled to register agent tool result middleware"
			});
			return;
		}
		const existing = registry.agentToolResultMiddlewares.find((entry) => entry.pluginId === record.id && entry.rawHandler === handler);
		if (existing) {
			appendAgentToolResultMiddlewareScope(existing, {
				runtimes,
				matcher
			});
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName: "after_tool_call",
			policy
		});
		const safeHandler = async (event, ctx) => {
			if (!agentToolResultMiddlewareRegistrationCoversTool(registration, ctx.runtime, event.toolName)) return;
			try {
				return await withTimeout(Promise.resolve(handler(event, ctx)), timeoutMs ?? 0, `agent tool result middleware for ${record.id}`);
			} catch (error) {
				registryParams.logger.warn(`[plugins] agent tool result middleware failed for ${record.id}`);
				throw error;
			}
		};
		const registration = {
			pluginId: record.id,
			pluginName: record.name,
			rawHandler: handler,
			handler: safeHandler,
			runtimes,
			scopes: [{
				runtimes,
				...matcher ? { matcher } : {}
			}],
			source: record.source,
			rootDir: record.rootDir
		};
		registry.agentToolResultMiddlewares.push(registration);
	};
	const registerTool = (record, tool, opts) => {
		if (pluginsWithChannelRegistrationConflict.has(record.id)) return;
		const declaredNames = normalizePluginToolContractNames(record.contracts);
		if (declaredNames.length === 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "plugin must declare contracts.tools before registering agent tools"
			});
			return;
		}
		const names = [...opts?.names ?? [], ...opts?.name ? [opts.name] : []];
		const optional = opts?.optional === true;
		const factory = typeof tool === "function" ? tool : (_ctx) => tool;
		if (typeof tool !== "function") names.push(tool.name);
		const normalized = normalizePluginToolNames(names);
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames,
			toolNames: normalized
		});
		if (undeclared.length > 0) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `plugin must declare contracts.tools for: ${undeclared.join(", ")}`
			});
			return;
		}
		if (normalized.length > 0) record.toolNames.push(...normalized);
		registry.tools.push({
			pluginId: record.id,
			pluginName: record.name,
			factory,
			names: normalized,
			declaredNames,
			optional,
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		});
	};
	const registerHook = (record, events, handler, opts, config, pluginConfig) => {
		const normalizedEvents = normalizeStringEntries(Array.isArray(events) ? events : [events]);
		for (const event of normalizedEvents) if (isPluginHookName(event)) pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `hook event "${event}" is dispatched by the typed hook runner only; api.registerHook registrations for it are not invoked. Use api.on("${event}", ...) instead.`
		});
		const entry = opts?.entry ?? null;
		const hookName = entry?.hook.name ?? opts?.name?.trim();
		if (!hookName) throw new Error("hook registration missing name");
		const existingHook = registry.hooks.find((entryLocal) => entryLocal.entry.hook.name === hookName);
		if (existingHook) {
			pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `hook already registered: ${hookName} (${existingHook.pluginId})`
			});
			return;
		}
		const description = entry?.hook.description ?? opts?.description ?? "";
		const hookEntry = entry ? {
			...entry,
			hook: {
				...entry.hook,
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id
			},
			metadata: {
				...entry.metadata,
				events: normalizedEvents
			}
		} : {
			hook: {
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id,
				filePath: record.source,
				baseDir: path.dirname(record.source),
				handlerPath: record.source
			},
			frontmatter: {},
			metadata: { events: normalizedEvents },
			invocation: { enabled: true }
		};
		record.hookNames.push(hookName);
		registry.hooks.push({
			pluginId: record.id,
			entry: hookEntry,
			events: normalizedEvents,
			source: record.source
		});
		if (!(config?.hooks?.internal?.enabled !== false) || opts?.register === false) return;
		for (const event of normalizedEvents) {
			const wrappedHandler = async (evt) => {
				const context = evt.context;
				const hadPluginConfig = Object.hasOwn(context, "pluginConfig");
				const previousPluginConfig = context.pluginConfig;
				context.pluginConfig = pluginConfig;
				try {
					return await handler({
						...evt,
						context
					});
				} finally {
					if (hadPluginConfig) context.pluginConfig = previousPluginConfig;
					else delete context.pluginConfig;
				}
			};
			registry.legacyInternalHooks.push({
				pluginId: record.id,
				name: hookName,
				event,
				handler: wrappedHandler
			});
		}
	};
	const registerTypedHook = (record, hookName, handler, opts, policy) => {
		if (!isPluginHookName(hookName)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `unknown typed hook "${String(hookName)}" ignored`
			});
			return;
		}
		if (!resolvePromptInjectionAllowed(policy) && isPromptInjectionHookName(hookName)) {
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `typed hook "${hookName}" blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
			});
			return;
		}
		if (isConversationHookName(hookName) && !resolveConversationAccessAllowed(record.origin, policy)) {
			if (record.origin !== "bundled") {
				pushDiagnostic({
					level: "warn",
					pluginId: record.id,
					source: record.source,
					message: `typed hook "${hookName}" blocked because non-bundled plugins must set plugins.entries.${record.id}.hooks.allowConversationAccess=true`
				});
				return;
			}
			pushDiagnostic({
				level: "warn",
				pluginId: record.id,
				source: record.source,
				message: `typed hook "${hookName}" blocked by plugins.entries.${record.id}.hooks.allowConversationAccess=false`
			});
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName,
			opts,
			policy
		});
		const eligibleTriggers = hookName === "before_agent_reply" ? normalizeEligibleTriggers(opts?.eligibleTriggers) : void 0;
		const matcher = hookName === "before_tool_call" || hookName === "after_tool_call" ? normalizePluginToolMatcher(opts?.matcher) : void 0;
		if (opts?.matcher && hookName !== "before_tool_call" && hookName !== "after_tool_call") pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `typed hook "${hookName}" ignores tool matcher`
		});
		record.hookCount += 1;
		registry.typedHooks.push({
			pluginId: record.id,
			...opts?.registrationId ? { registrationId: opts.registrationId } : {},
			hookName,
			handler,
			...matcher ? { matcher } : {},
			priority: opts?.priority,
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...eligibleTriggers ? { eligibleTriggers } : {},
			...hookName === "before_prompt_build" && opts?.requiresToolAuthority === true ? { requiresToolAuthority: true } : {},
			source: record.source
		});
	};
	return {
		registerCodexAppServerExtensionFactory,
		registerAgentToolResultMiddleware,
		registerTool,
		registerHook,
		registerTypedHook
	};
}
//#endregion
//#region src/plugins/registry-registrars.ts
/** Compose domain registrars over one explicit mutable registry state. */
function createPluginRegistrars(state) {
	return {
		...createCapabilityRegistrars(state),
		...createToolHookRegistrars(state),
		...createNetworkRegistrars(state),
		...createProviderRegistrars(state),
		...createOperationRegistrars(state),
		...createHostRegistrars(state),
		...createMemoryRegistrars(state),
		registerModelCatalogProvider: state.registerModelCatalogProvider
	};
}
//#endregion
//#region src/channels/inbound-event/host-context-builder.ts
/** Wrap the ordinary builder with the private bundled-channel evidence binding. */
function createHostChannelInboundEventContextBuilder(buildContext, owner) {
	return (params) => {
		const preparation = prepareHostChannelContextAdmissionEvidence({
			owner,
			channelId: params.channel,
			accountId: params.accountId,
			ingress: params.channelIngress,
			rawPrincipalRef: params.sender.id,
			contextParams: params
		});
		const result = buildContext(params);
		const bindEvidence = (built) => {
			bindHostChannelContextAdmissionEvidence({
				context: built,
				preparation
			});
			return built;
		};
		return isPromiseLike(result) ? result.then(bindEvidence) : bindEvidence(result);
	};
}
//#endregion
//#region src/plugin-state/plugin-blob-store.types.ts
var PluginBlobStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginBlobStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/plugin-state/plugin-blob-store.sqlite.ts
const MAX_PLUGIN_BLOB_BYTES_PER_ENTRY = 100 * 1024 * 1024;
const MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN = 512 * 1024 * 1024;
const MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN = 5e4;
function createError(params) {
	return new PluginBlobStoreError(params.message, {
		code: params.code,
		operation: params.operation,
		path: resolveOpenClawStateSqlitePath(params.env ?? process.env),
		cause: params.cause
	});
}
function wrapError(error, operation, fallbackCode, message, env) {
	return error instanceof PluginBlobStoreError ? error : createError({
		code: fallbackCode,
		operation,
		message,
		env,
		cause: error
	});
}
function openDatabase(operation, env) {
	try {
		return openOpenClawStateDatabase(env ? { env } : {});
	} catch (error) {
		throw wrapError(error, operation, "PLUGIN_BLOB_OPEN_FAILED", "Failed to open plugin blob store.", env);
	}
}
function kysely(db) {
	return getNodeSqliteKysely(db);
}
function selectLiveBlob(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"blob",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])));
}
function blobKeyExists(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select("entry_key").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key)) !== void 0;
}
function selectLiveInfo(db, params) {
	return executeSqliteQuerySync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
}
function selectExpiredKeyInfo(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key).where("expires_at", "is not", null).where("expires_at", "<=", params.now));
}
function selectLiveDescriptors(db, params) {
	let query = kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"namespace",
		"created_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]));
	if (params.namespace !== void 0) query = query.where("namespace", "=", params.namespace);
	if (params.excludeKey !== void 0) query = query.where("entry_key", "!=", params.excludeKey);
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
}
function selectStoredDescriptors(db, params) {
	let query = kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"namespace",
		"created_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId);
	if (params.namespace !== void 0) query = query.where("namespace", "=", params.namespace);
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
}
function selectStoredKeyDescriptor(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"namespace",
		"created_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
}
function deleteKey(db, params) {
	const result = executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
	return Number(result.numAffectedRows ?? 0);
}
function deleteKeys(db, params) {
	const batchSize = 500;
	for (let offset = 0; offset < params.keys.length; offset += batchSize) {
		const keys = params.keys.slice(offset, offset + batchSize);
		executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", keys));
	}
}
function deleteExpiredNamespace(db, params) {
	const result = executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", params.now));
	return Number(result.numAffectedRows ?? 0);
}
function totalBytes(rows) {
	return rows.reduce((total, row) => total + Number(row.size_bytes), 0);
}
function limitError$1(message, env) {
	return createError({
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register",
		message,
		env
	});
}
function assertProjectedLimits(params) {
	const namespaceRows = selectStoredDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace
	});
	const pluginRows = selectStoredDescriptors(params.db, { pluginId: params.write.pluginId });
	const previousBytes = params.existing ? Number(params.existing.size_bytes) : 0;
	const rowDelta = params.existing ? 0 : 1;
	if (namespaceRows.length + rowDelta > params.write.maxEntries) throw limitError$1("Plugin blob namespace reached its stored row limit.", params.write.env);
	if (totalBytes(namespaceRows) - previousBytes + params.write.bytes.byteLength > params.write.maxBytesPerNamespace) throw limitError$1("Plugin blob namespace reached its stored byte limit.", params.write.env);
	if (pluginRows.length + rowDelta > 5e4) throw limitError$1("Plugin blob store reached its per-plugin row limit.", params.write.env);
	if (totalBytes(pluginRows) - previousBytes + params.write.bytes.byteLength > 536870912) throw limitError$1("Plugin blob store reached its per-plugin byte limit.", params.write.env);
}
function deleteOldestUntilWithinLimits(params) {
	const namespaceRows = selectStoredDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace
	});
	let namespaceCount = namespaceRows.length;
	let namespaceBytes = totalBytes(namespaceRows);
	const namespaceKeysToDelete = [];
	const namespaceCandidates = selectLiveDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		now: params.now,
		excludeKey: params.write.key
	});
	for (const row of namespaceCandidates) {
		if (namespaceCount <= params.write.maxEntries && namespaceBytes <= params.write.maxBytesPerNamespace) break;
		namespaceKeysToDelete.push(row.entry_key);
		namespaceCount -= 1;
		namespaceBytes -= Number(row.size_bytes);
	}
	if (namespaceCount > params.write.maxEntries || namespaceBytes > params.write.maxBytesPerNamespace) throw limitError$1("Plugin blob namespace cannot satisfy its configured limits.", params.write.env);
	deleteKeys(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		keys: namespaceKeysToDelete
	});
	const pluginRows = selectStoredDescriptors(params.db, { pluginId: params.write.pluginId });
	let pluginCount = pluginRows.length;
	let pluginBytes = totalBytes(pluginRows);
	const liveNamespaceCandidates = selectLiveDescriptors(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		now: params.now,
		excludeKey: params.write.key
	});
	const pluginKeysToDelete = [];
	for (const row of liveNamespaceCandidates) {
		if (pluginCount <= 5e4 && pluginBytes <= 536870912) break;
		pluginKeysToDelete.push(row.entry_key);
		pluginCount -= 1;
		pluginBytes -= Number(row.size_bytes);
	}
	if (pluginCount > 5e4 || pluginBytes > 536870912) throw limitError$1("Plugin blob store cannot satisfy its per-plugin limits.", params.write.env);
	deleteKeys(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		keys: pluginKeysToDelete
	});
}
function upsertBlob(db, params, now) {
	const expiresAt = (() => {
		if (params.ttlMs === void 0) return null;
		const resolved = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: now });
		if (resolved === void 0) throw createError({
			code: "PLUGIN_BLOB_INVALID_INPUT",
			operation: "register",
			message: "Plugin blob ttlMs cannot produce a valid expiry timestamp.",
			env: params.env
		});
		return resolved;
	})();
	const row = {
		plugin_id: params.pluginId,
		namespace: params.namespace,
		entry_key: params.key,
		metadata_json: params.metadataJson,
		blob: params.bytes,
		created_at: now,
		expires_at: expiresAt
	};
	executeSqliteQuerySync(db, kysely(db).insertInto("plugin_blob_entries").values(row).onConflict((conflict) => conflict.columns([
		"plugin_id",
		"namespace",
		"entry_key"
	]).doUpdateSet({
		metadata_json: (eb) => eb.ref("excluded.metadata_json"),
		blob: (eb) => eb.ref("excluded.blob"),
		created_at: (eb) => eb.ref("excluded.created_at"),
		expires_at: (eb) => eb.ref("excluded.expires_at")
	})));
}
function writeBlob(params, ifAbsent) {
	try {
		openDatabase("register", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const now = Date.now();
			if (ifAbsent && blobKeyExists(db, params)) return false;
			const existing = selectStoredKeyDescriptor(db, params);
			if (params.overflowPolicy === "reject-new") assertProjectedLimits({
				db,
				write: params,
				existing
			});
			upsertBlob(db, params, now);
			if (params.overflowPolicy === "evict-oldest") deleteOldestUntilWithinLimits({
				db,
				write: params,
				now
			});
			return true;
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "register", "PLUGIN_BLOB_WRITE_FAILED", "Failed to register plugin blob entry.", params.env);
	}
}
function pluginBlobRegister(params) {
	writeBlob(params, false);
}
function pluginBlobRegisterIfAbsent(params) {
	return writeBlob(params, true);
}
function pluginBlobLookup(params) {
	try {
		const { db } = openDatabase("lookup", params.env);
		return selectLiveBlob(db, {
			...params,
			now: Date.now()
		});
	} catch (error) {
		throw wrapError(error, "lookup", "PLUGIN_BLOB_READ_FAILED", "Failed to read plugin blob entry.", params.env);
	}
}
function pluginBlobEntries(params) {
	try {
		const { db } = openDatabase("entries", params.env);
		return selectLiveInfo(db, {
			...params,
			now: Date.now()
		});
	} catch (error) {
		throw wrapError(error, "entries", "PLUGIN_BLOB_READ_FAILED", "Failed to list plugin blob entries.", params.env);
	}
}
function pluginBlobDelete(params) {
	try {
		openDatabase("delete", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => deleteKey(db, params) > 0, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "delete", "PLUGIN_BLOB_WRITE_FAILED", "Failed to delete plugin blob entry.", params.env);
	}
}
function pluginBlobDeleteExpiredKey(params) {
	try {
		openDatabase("sweep", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const row = selectExpiredKeyInfo(db, {
				...params,
				now: Date.now()
			});
			if (!row) return;
			params.validateMetadataJson(row.metadata_json);
			deleteKey(db, params);
			return row;
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "sweep", "PLUGIN_BLOB_WRITE_FAILED", "Failed to delete expired plugin blob.", params.env);
	}
}
function pluginBlobDeleteExpired(params) {
	try {
		openDatabase("sweep", params.env);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const now = Date.now();
			const rows = executeSqliteQuerySync(db, kysely(db).selectFrom("plugin_blob_entries").select([
				"entry_key",
				"metadata_json",
				"created_at",
				"expires_at"
			]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", now).orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows;
			for (const row of rows) params.validateMetadataJson(row.metadata_json);
			deleteExpiredNamespace(db, {
				...params,
				now
			});
			return rows;
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "sweep", "PLUGIN_BLOB_WRITE_FAILED", "Failed to delete expired plugin blobs.", params.env);
	}
}
function pluginBlobClear(params) {
	try {
		openDatabase("clear", params.env);
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace));
		}, params.env ? { env: params.env } : {});
	} catch (error) {
		throw wrapError(error, "clear", "PLUGIN_BLOB_WRITE_FAILED", "Failed to clear plugin blob entries.", params.env);
	}
}
//#endregion
//#region src/plugin-state/plugin-blob-store.ts
const namespaceOptionSignatures = /* @__PURE__ */ new Map();
function invalidInput(message, operation = "register") {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_INVALID_INPUT",
		operation
	});
}
function limitError(message) {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register"
	});
}
const validationErrors = (operation) => ({
	invalid: (message) => invalidInput(message, operation),
	limit: (message) => limitError(message)
});
function validateNamespace(value) {
	return validatePluginStoreNamespace({
		value,
		label: "plugin blob",
		errors: validationErrors("open")
	});
}
function validateKey(value, operation) {
	return validatePluginStoreKey({
		value,
		label: "plugin blob",
		errors: validationErrors(operation)
	});
}
function validatePositiveLimit(value, label, maximum) {
	const normalized = validatePluginStorePositiveInteger({
		value,
		label,
		errors: validationErrors("open")
	});
	if (normalized > maximum) throw invalidInput(`${label} must be <= ${maximum}`, "open");
	return normalized;
}
function validateOverflowPolicy(value) {
	if (value === void 0 || value === "evict-oldest") return "evict-oldest";
	if (value === "reject-new") return value;
	throw invalidInput("plugin blob overflowPolicy must be evict-oldest or reject-new", "open");
}
function validateTtl(value, operation) {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin blob ttlMs",
		errors: validationErrors(operation)
	});
}
function assertConsistentOptions(pluginId, namespace, signature) {
	const key = `${pluginId}\0${namespace}`;
	const existing = namespaceOptionSignatures.get(key);
	if (!existing) {
		namespaceOptionSignatures.set(key, signature);
		return;
	}
	if (existing.maxEntries !== signature.maxEntries || existing.maxBytesPerEntry !== signature.maxBytesPerEntry || existing.maxBytesPerNamespace !== signature.maxBytesPerNamespace || existing.overflowPolicy !== signature.overflowPolicy || existing.defaultTtlMs !== signature.defaultTtlMs) throw invalidInput(`plugin blob namespace ${namespace} for ${pluginId} was reopened with incompatible options`, "open");
}
function prepareBlob(params) {
	const key = validateKey(params.key, "register");
	if (!(params.bytes instanceof Uint8Array)) throw invalidInput("plugin blob bytes must be a Uint8Array");
	if (params.bytes.byteLength > params.maxBytesPerEntry) throw limitError(`plugin blob entry exceeds the configured ${params.maxBytesPerEntry} byte limit`);
	const metadataJson = serializePluginStoreJson({
		value: params.metadata,
		label: "plugin blob metadata",
		errors: validationErrors("register")
	});
	const ttlMs = validateTtl(params.opts?.ttlMs, "register") ?? params.defaultTtlMs;
	return {
		key,
		bytes: Uint8Array.from(params.bytes),
		metadataJson,
		...ttlMs !== void 0 ? { ttlMs } : {}
	};
}
function parseMetadata(raw, operation, env) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new PluginBlobStoreError("Plugin blob entry contains corrupt metadata JSON.", {
			code: "PLUGIN_BLOB_CORRUPT",
			operation,
			path: resolveOpenClawStateSqlitePath(env ?? process.env),
			cause: error
		});
	}
}
function storedInfoToEntryInfo(row, operation, env) {
	const expiresAt = normalizeSqliteNumber(row.expires_at);
	return {
		key: row.entry_key,
		metadata: parseMetadata(row.metadata_json, operation, env),
		sizeBytes: Number(row.size_bytes),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		...expiresAt != null ? { expiresAt } : {}
	};
}
function storedEntryToEntry(row, env) {
	return {
		...storedInfoToEntryInfo(row, "lookup", env),
		bytes: Uint8Array.from(row.blob)
	};
}
function createPluginBlobStoreInternal(pluginId, options, env) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	const namespace = validateNamespace(options.namespace);
	const maxEntries = validatePositiveLimit(options.maxEntries, "plugin blob maxEntries", MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN);
	const maxBytesPerEntry = validatePositiveLimit(options.maxBytesPerEntry, "plugin blob maxBytesPerEntry", MAX_PLUGIN_BLOB_BYTES_PER_ENTRY);
	const maxBytesPerNamespace = validatePositiveLimit(options.maxBytesPerNamespace, "plugin blob maxBytesPerNamespace", MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN);
	if (maxBytesPerEntry > maxBytesPerNamespace) throw invalidInput("plugin blob maxBytesPerEntry must not exceed maxBytesPerNamespace", "open");
	const overflowPolicy = validateOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateTtl(options.defaultTtlMs, "open");
	assertConsistentOptions(pluginId, namespace, {
		maxEntries,
		maxBytesPerEntry,
		maxBytesPerNamespace,
		overflowPolicy,
		defaultTtlMs
	});
	const writeParams = (blob) => ({
		pluginId,
		namespace,
		key: blob.key,
		bytes: blob.bytes,
		metadataJson: blob.metadataJson,
		maxEntries,
		maxBytesPerNamespace,
		overflowPolicy,
		...blob.ttlMs !== void 0 ? { ttlMs: blob.ttlMs } : {},
		...env ? { env } : {}
	});
	return {
		async register(key, bytes, metadata, opts) {
			const blob = prepareBlob({
				key,
				bytes,
				metadata,
				maxBytesPerEntry,
				defaultTtlMs,
				opts
			});
			pluginBlobRegister(writeParams(blob));
		},
		async registerIfAbsent(key, bytes, metadata, opts) {
			const blob = prepareBlob({
				key,
				bytes,
				metadata,
				maxBytesPerEntry,
				defaultTtlMs,
				opts
			});
			return pluginBlobRegisterIfAbsent(writeParams(blob));
		},
		async lookup(key) {
			const row = pluginBlobLookup({
				pluginId,
				namespace,
				key: validateKey(key, "lookup"),
				...env ? { env } : {}
			});
			return row ? storedEntryToEntry(row, env) : void 0;
		},
		async entries() {
			return pluginBlobEntries({
				pluginId,
				namespace,
				...env ? { env } : {}
			}).map((row) => storedInfoToEntryInfo(row, "entries", env));
		},
		async delete(key) {
			return pluginBlobDelete({
				pluginId,
				namespace,
				key: validateKey(key, "delete"),
				...env ? { env } : {}
			});
		},
		async deleteExpiredKey(key) {
			const row = pluginBlobDeleteExpiredKey({
				pluginId,
				namespace,
				key: validateKey(key, "sweep"),
				validateMetadataJson: (raw) => {
					parseMetadata(raw, "sweep", env);
				},
				...env ? { env } : {}
			});
			return row ? storedInfoToEntryInfo(row, "sweep", env) : void 0;
		},
		async deleteExpired() {
			return pluginBlobDeleteExpired({
				pluginId,
				namespace,
				validateMetadataJson: (raw) => {
					parseMetadata(raw, "sweep", env);
				},
				...env ? { env } : {}
			}).map((row) => storedInfoToEntryInfo(row, "sweep", env));
		},
		async clear() {
			pluginBlobClear({
				pluginId,
				namespace,
				...env ? { env } : {}
			});
		}
	};
}
/** Opens an async blob namespace for a non-core plugin id. */
function createPluginBlobStore(pluginId, options) {
	return createPluginBlobStoreInternal(pluginId, options);
}
//#endregion
//#region src/plugins/registry-runtime.ts
const PLUGIN_GATEWAY_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"agent",
	"chat.abort",
	"chat.inject",
	"chat.send",
	"message.action",
	"plugins.sessionAction",
	"send",
	"sessions.abort",
	"sessions.compact",
	"sessions.compaction.branch",
	"sessions.compaction.restore",
	"sessions.branches.switch",
	"sessions.rewind",
	"sessions.fork",
	"sessions.create",
	"sessions.delete",
	"sessions.patchMany",
	"sessions.patch",
	"sessions.pluginPatch",
	"sessions.reset",
	"sessions.send",
	"sessions.steer",
	"wake"
]);
const PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"sessions.cleanup",
	"sessions.groups.delete",
	"sessions.groups.rename"
]);
function createPluginRuntimeResolver(state) {
	const { registry, registryParams } = state;
	const currentSessionConfig = () => registryParams.runtime.config.current();
	const pluginRuntimeById = /* @__PURE__ */ new Map();
	const pluginRuntimeRecordById = /* @__PURE__ */ new Map();
	const activePluginRuntimeRecords = /* @__PURE__ */ new WeakSet();
	const recordChannelRuntime = /* @__PURE__ */ new WeakMap();
	const registeredChannelRuntime = /* @__PURE__ */ new WeakMap();
	const registeredRuntimeRecordById = /* @__PURE__ */ new Map();
	const registeredAdmissionOwnerByRecord = /* @__PURE__ */ new WeakMap();
	const addPluginRuntimeResolutionContext = (params) => {
		const { error, pluginId, prop } = params;
		if (error instanceof Error && error.message.startsWith("Unable to resolve plugin runtime module") && !error.message.includes("pluginRuntimeContext=")) {
			const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
			const propName = typeof prop === "symbol" ? prop.description ?? prop.toString() : String(prop);
			error.message = [
				error.message,
				`pluginRuntimeContext=pluginId:${pluginId}`,
				`property:${propName}`,
				...record?.source ? [`source:${record.source}`] : []
			].join("; ");
		}
		throw error;
	};
	const resolveRecordChannelRuntime = (record, requireCurrentRuntimeRecord) => {
		const cache = requireCurrentRuntimeRecord ? recordChannelRuntime : registeredChannelRuntime;
		const cached = cache.get(record);
		const cachedOwner = registeredAdmissionOwnerByRecord.get(record);
		if (cached && (requireCurrentRuntimeRecord || cachedOwner?.isLive() === true)) return cached;
		if (!requireCurrentRuntimeRecord && cachedOwner) {
			cachedOwner.dispose();
			registeredAdmissionOwnerByRecord.delete(record);
		}
		const channel = (() => {
			try {
				return Reflect.get(registryParams.runtime, "channel", registryParams.runtime);
			} catch (error) {
				return addPluginRuntimeResolutionContext({
					error,
					pluginId: record.id,
					prop: "channel"
				});
			}
		})();
		if (record.origin !== "bundled" || requireCurrentRuntimeRecord) {
			cache.set(record, channel);
			return channel;
		}
		const ownsLiveRegistrySlot = () => activePluginRuntimeRecords.has(record) && registeredRuntimeRecordById.get(record.id) === record && isPluginRegistryActivated(registry) && !isPluginRegistryRetired(registry) && registry.plugins.some((candidate) => candidate === record && candidate.status === "loaded");
		const previousRecord = registeredRuntimeRecordById.get(record.id);
		if (previousRecord && previousRecord !== record) {
			registeredAdmissionOwnerByRecord.get(previousRecord)?.dispose();
			registeredAdmissionOwnerByRecord.delete(previousRecord);
			revokePluginRecordLifecycleEpoch(registry, previousRecord);
		}
		registeredRuntimeRecordById.set(record.id, record);
		const epoch = activatePluginRecordLifecycleEpoch(registry, record);
		if (!epoch) {
			cache.set(record, channel);
			return channel;
		}
		const owner = Object.freeze({
			channelId: record.id,
			record,
			epoch,
			resolveGatewayContext: getGatewayContextResolver(registryParams.runtime.subagent),
			isLive: () => ownsLiveRegistrySlot() && isPluginRecordLifecycleEpochActive(registry, record, epoch)
		});
		const disposeOwner = registerChannelAdmissionEvidenceOwner(owner);
		registeredAdmissionOwnerByRecord.set(record, {
			isLive: owner.isLive,
			dispose: disposeOwner
		});
		const buildHostContext = createHostChannelInboundEventContextBuilder(channel.inbound.buildContext, owner);
		const buildContext = ((params) => {
			return buildHostContext(params);
		});
		const scoped = {
			...channel,
			inbound: {
				...channel.inbound,
				buildContext
			}
		};
		cache.set(record, scoped);
		return scoped;
	};
	const resolvePluginRuntime = (pluginId) => {
		const cached = pluginRuntimeById.get(pluginId);
		if (cached) return cached;
		const resolveHarnessRegistration = (harnessId) => {
			const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
			return normalizedHarnessId ? registry.agentHarnesses.find((entry) => normalizeOptionalAgentRuntimeId(entry.harness.id) === normalizedHarnessId) : void 0;
		};
		const resolveHarnessRegistrationForSessionKey = (sessionKey) => registry.agentHarnesses.find((entry) => {
			const rawHarnessId = normalizeOptionalString(entry.harness.id)?.toLowerCase();
			return rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId) && isAgentHarnessSessionKeyOwnedBy(sessionKey, rawHarnessId);
		});
		const assertOwnedHarness = (harnessId, action) => {
			const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
			if (!normalizedHarnessId) throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action}.`);
			const registration = resolveHarnessRegistration(normalizedHarnessId);
			if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${normalizedHarnessId}" before it can ${action}.`);
			if (registration.pluginId !== pluginId) throw new Error(`Agent harness "${normalizedHarnessId}" is owned by plugin "${registration.pluginId}", not "${pluginId}".`);
			return normalizedHarnessId;
		};
		const assertReservedSessionKeyOwned = (sessionKey, action) => {
			const normalizedSessionKey = normalizeOptionalString(sessionKey);
			if (!normalizedSessionKey || !isAgentHarnessSessionKey(normalizedSessionKey)) return;
			const registration = resolveHarnessRegistrationForSessionKey(normalizedSessionKey);
			if (!registration) throw new Error(`Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" because its harness is not registered.`);
			if (registration.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" owned by plugin "${registration.pluginId}".`);
		};
		const resolveLockedSessionHarnessRegistration = (sessionKey, entry, action) => {
			if (entry.modelSelectionLocked !== true) return;
			const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
			if (!harnessId) {
				const pluginOwnerId = normalizeOptionalString(entry.pluginOwnerId);
				if (pluginOwnerId) return { ownerPluginId: pluginOwnerId };
				throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action} locked sessions.`);
			}
			const registration = resolveHarnessRegistration(harnessId);
			if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${harnessId}" before it can ${action} locked sessions.`);
			if (isAgentHarnessSessionKey(sessionKey) && !isAgentHarnessSessionKeyOwnedBy(sessionKey, harnessId)) throw new Error(`Locked session "${sessionKey}" belongs to agent harness "${harnessId}", which does not match its reserved session key.`);
			return {
				ownerPluginId: registration.pluginId,
				harnessId,
				registration
			};
		};
		const assertLockedSessionEntryOwned = (sessionKey, entry, action) => {
			const resolved = resolveLockedSessionHarnessRegistration(sessionKey, entry, action);
			if (!resolved) return;
			if (resolved.ownerPluginId !== pluginId) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${resolved.ownerPluginId}", not "${pluginId}".`);
		};
		const assertSessionEntryOwned = (params) => {
			if (params.entry) {
				assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
				return;
			}
			assertReservedSessionKeyOwned(params.sessionKey, params.action);
		};
		const resolveStoredSessionOwnershipTarget = (params) => {
			if (classifySessionKeyShape(params.sessionKey) === "legacy_or_alias" && !isUnscopedSessionKeySentinel(params.sessionKey) && params.agentId === void 0 && params.storePath === void 0) {
				const target = resolveSessionEntryAccessTarget({
					cfg: currentSessionConfig(),
					sessionKey: params.sessionKey,
					...params.env !== void 0 ? { env: params.env } : {}
				});
				return {
					entry: target.entry,
					sessionKey: target.canonicalKey
				};
			}
			return {
				entry: registryParams.runtime.agent.session.getSessionEntry({
					sessionKey: params.sessionKey,
					readConsistency: "latest",
					...params.agentId !== void 0 ? { agentId: params.agentId } : {},
					...params.env !== void 0 ? { env: params.env } : {},
					...params.storePath !== void 0 ? { storePath: params.storePath } : {}
				}),
				sessionKey: params.sessionKey
			};
		};
		const assertStoredSessionEntryOwned = (params) => {
			const target = resolveStoredSessionOwnershipTarget(params);
			assertSessionEntryOwned({
				action: params.action,
				...target
			});
			return target.entry;
		};
		const resolveStoredSessionExecutionOwner = (params) => {
			const target = resolveStoredSessionOwnershipTarget(params);
			const { entry, sessionKey } = target;
			const locked = entry ? resolveLockedSessionHarnessRegistration(sessionKey, entry, params.action) : void 0;
			if (!entry || !locked || locked.ownerPluginId === pluginId) {
				assertSessionEntryOwned({
					action: params.action,
					...target
				});
				return;
			}
			const registration = "registration" in locked ? locked.registration : void 0;
			if (!registration) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`);
			if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId)) assertLockedSessionEntryOwned(sessionKey, entry, params.action);
			return locked.ownerPluginId;
		};
		const assertSessionIdentitiesOwned = (params) => {
			const agentId = normalizeOptionalString(params.agentId);
			const storePath = normalizeOptionalString(params.storePath);
			const sessionKeys = /* @__PURE__ */ new Set();
			for (const value of params.sessionKeys ?? []) {
				const sessionKey = normalizeOptionalString(value);
				if (sessionKey) sessionKeys.add(sessionKey);
			}
			for (const sessionKey of sessionKeys) assertStoredSessionEntryOwned({
				action: params.action,
				sessionKey,
				...agentId ? { agentId } : {},
				...storePath ? { storePath } : {}
			});
			const sessionIds = /* @__PURE__ */ new Set();
			for (const value of params.sessionIds ?? []) {
				const sessionId = normalizeOptionalString(value);
				if (sessionId) sessionIds.add(sessionId);
			}
			const sessionFiles = /* @__PURE__ */ new Set();
			for (const value of params.sessionFiles ?? []) {
				const sessionFile = normalizeOptionalString(value);
				if (sessionFile) sessionFiles.add(sessionFile);
			}
			if (sessionIds.size === 0 && sessionFiles.size === 0) return;
			const entries = registryParams.runtime.agent.session.listSessionEntries({
				...agentId ? { agentId } : {},
				...storePath ? { storePath } : {},
				readOnly: true
			});
			for (const { sessionKey, entry } of entries) if (sessionIds.has(entry.sessionId)) assertSessionEntryOwned({
				action: params.action,
				entry,
				sessionKey
			});
			for (const sessionFile of sessionFiles) {
				const sessionKeyMatches = entries.filter(({ sessionKey }) => sessionKey === sessionFile);
				if (sessionKeyMatches.length > 0) {
					for (const match of sessionKeyMatches) assertSessionEntryOwned({
						action: params.action,
						entry: match.entry,
						sessionKey: match.sessionKey
					});
					const matchedSessionIds = new Set(sessionKeyMatches.map(({ entry }) => normalizeOptionalString(entry.sessionId)).filter((sessionId) => Boolean(sessionId)));
					for (const match of entries) {
						const matchSessionId = normalizeOptionalString(match.entry.sessionId);
						if (matchSessionId && matchedSessionIds.has(matchSessionId)) assertSessionEntryOwned({
							action: params.action,
							entry: match.entry,
							sessionKey: match.sessionKey
						});
					}
					continue;
				}
				const marker = parseSqliteSessionFileMarker(sessionFile);
				if (!marker) throw new Error("Plugin session ownership checks require a SQLite transcript marker.");
				const matches = registryParams.runtime.agent.session.listSessionEntries({
					agentId: marker.agentId,
					storePath: marker.storePath,
					readOnly: true
				}).filter(({ entry }) => entry.sessionId === marker.sessionId);
				if (matches.length === 0) throw new Error(`Plugin session ownership target not found: ${marker.sessionId}`);
				for (const match of matches) assertSessionEntryOwned({
					action: params.action,
					entry: match.entry,
					sessionKey: match.sessionKey
				});
			}
		};
		const resolveRunSessionExecutionOwner = (params) => {
			const target = params.sessionTarget;
			const targetSessionKey = normalizeOptionalString(target?.sessionKey);
			const directSessionKey = normalizeOptionalString(params.sessionKey);
			if (targetSessionKey && directSessionKey && targetSessionKey !== directSessionKey) throw new Error("Delegated agent execution requires one exact session key.");
			const sessionKey = targetSessionKey ?? directSessionKey;
			const storePath = normalizeOptionalString(target?.storePath);
			const agentId = normalizeOptionalString(target?.agentId ?? params.agentId);
			const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
			const normalizedAgentId = agentId ? normalizeAgentId(agentId) : void 0;
			if (sessionKeyAgentId && normalizedAgentId && normalizedAgentId !== sessionKeyAgentId) throw new Error(`Plugin session ownership agent "${normalizedAgentId}" does not match session key agent "${sessionKeyAgentId}".`);
			const ownershipAgentId = sessionKeyAgentId ?? normalizedAgentId;
			const ownershipStorePath = sessionKey && sessionKeyAgentId ? resolveSessionStorePathForScope({
				agentId: sessionKeyAgentId,
				sessionKey,
				...storePath ? { storePath } : {}
			}) : storePath;
			const entry = sessionKey ? registryParams.runtime.agent.session.getSessionEntry({
				sessionKey,
				readConsistency: "latest",
				...agentId ? { agentId } : {},
				...storePath ? { storePath } : {}
			}) : void 0;
			const targetSessionId = normalizeOptionalString(target?.sessionId);
			const targetAgentId = normalizeOptionalString(target?.agentId);
			const directSessionId = normalizeOptionalString(params.sessionId);
			const directAgentId = normalizeOptionalString(params.agentId);
			const sessionFile = normalizeOptionalString(params.sessionFile);
			if (target) {
				const legacySessionIdentityMatches = Boolean(sessionFile) && Boolean(agentId) && Boolean(storePath) && Boolean(entry?.sessionId) && sqliteSessionFileMarkerMatchesTarget(sessionFile, {
					agentId,
					sessionId: entry.sessionId,
					storePath
				});
				if (!(targetSessionKey === sessionKey && Boolean(storePath) && Boolean(entry) && targetSessionId === entry?.sessionId && directSessionId === entry?.sessionId && targetAgentId === directAgentId && (!sessionFile || sessionFile === sessionKey || legacySessionIdentityMatches))) throw new Error(`Plugin "${pluginId}" may execute a persisted session only with its exact session target identity.`);
			}
			const locked = sessionKey && entry ? resolveLockedSessionHarnessRegistration(sessionKey, entry, "run") : void 0;
			const ownerPluginId = locked?.ownerPluginId;
			if (locked && entry && sessionKey && ownerPluginId !== pluginId) {
				const registration = "registration" in locked ? locked.registration : void 0;
				if (!registration) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`);
				if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId)) assertLockedSessionEntryOwned(sessionKey, entry, "run");
				const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
				const requestedRuntimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
				const identityMatches = Boolean(target) && targetSessionId === entry.sessionId && directSessionId === entry.sessionId;
				const harnessMatches = params.modelSelectionLocked === true && requestedHarnessId === locked.harnessId && requestedRuntimeOverride === locked.harnessId;
				if (!identityMatches || !harnessMatches) throw new Error(`Plugin "${pluginId}" may execute locked session "${sessionKey}" only with its exact persisted identity and harness.`);
				return ownerPluginId;
			}
			assertSessionIdentitiesOwned({
				action: "run",
				agentId: ownershipAgentId,
				sessionFiles: [params.sessionFile],
				sessionIds: [target?.sessionId ?? params.sessionId],
				sessionKeys: [target?.sessionKey ?? params.sessionKey],
				storePath: ownershipStorePath
			});
		};
		const assertGatewaySessionRequestOwned = (method, params) => {
			if (PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS.has(method)) throw new Error(`Plugin "${pluginId}" cannot request global session mutation "${method}".`);
			if (!PLUGIN_GATEWAY_SESSION_MUTATION_METHODS.has(method)) return;
			const request = params ?? {};
			if (method === "sessions.patchMany" && Array.isArray(request.targets)) {
				for (const target of request.targets) {
					if (!isRecord(target)) continue;
					assertSessionIdentitiesOwned({
						action: `request gateway method "${method}" for`,
						agentId: target.agentId,
						sessionKeys: [target.key]
					});
				}
				return;
			}
			const sessionKeys = [
				request.sessionKey,
				request.key,
				request.parentSessionKey
			];
			const sessionIds = [request.sessionId];
			assertSessionIdentitiesOwned({
				action: `request gateway method "${method}" for`,
				agentId: request.agentId,
				sessionIds,
				sessionKeys
			});
			if (method === "sessions.abort" && !sessionKeys.some((value) => normalizeOptionalString(value)) && !sessionIds.some((value) => normalizeOptionalString(value))) throw new Error(`Plugin "${pluginId}" must provide a session key when requesting gateway method "${method}".`);
		};
		const assertStoreEntryOwned = (params) => {
			if (params.entry.modelSelectionLocked === true) {
				assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
				return;
			}
			if (params.before?.modelSelectionLocked === true) {
				assertLockedSessionEntryOwned(params.sessionKey, params.before, params.action);
				return;
			}
			if (isAgentHarnessSessionKey(params.sessionKey) && !params.before) assertReservedSessionKeyOwned(params.sessionKey, params.action);
		};
		let scopedAgentRuntime;
		const assertTrustedPluginRuntime = (methodName) => {
			const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
			if (record?.origin !== "bundled" && record?.trustedOfficialInstall !== true) throw new Error(`${methodName} is only available for trusted plugins in this release. Plugin "${pluginId}" loaded with origin "${record?.origin ?? "unknown"}"; reinstall it from its official npm package or ClawHub listing to enable trusted plugin state.`);
		};
		const runtime = new Proxy(registryParams.runtime, { get(target, prop, receiver) {
			const runWithPluginScope = (run) => {
				const record = pluginRuntimeRecordById.get(pluginId) ?? registry.plugins.find((entry) => entry.id === pluginId);
				return record?.source ? withPluginRuntimePluginScope({
					pluginId,
					pluginSource: record.source,
					pluginOrigin: record.origin,
					pluginTrustedOfficialInstall: record.trustedOfficialInstall
				}, run) : withPluginRuntimePluginScope({ pluginId }, run);
			};
			const getRuntimeProperty = () => {
				try {
					return Reflect.get(target, prop, receiver);
				} catch (error) {
					return addPluginRuntimeResolutionContext({
						error,
						pluginId,
						prop
					});
				}
			};
			if (prop === "state") {
				const baseState = getRuntimeProperty();
				return {
					...baseState,
					openBlobStore: (options) => {
						assertTrustedPluginRuntime("openBlobStore");
						return createPluginBlobStore(pluginId, options);
					},
					openKeyedStore: (options) => {
						assertTrustedPluginRuntime("openKeyedStore");
						return createPluginStateKeyedStore(pluginId, options);
					},
					openSyncKeyedStore: (options) => {
						assertTrustedPluginRuntime("openSyncKeyedStore");
						return createPluginStateSyncKeyedStore(pluginId, options);
					},
					openChannelIngressQueue: (options) => {
						assertTrustedPluginRuntime("openChannelIngressQueue");
						const stateDir = options?.stateDir ?? baseState.resolveStateDir();
						return createChannelIngressQueue({
							...options,
							channelId: pluginId,
							stateDir
						});
					},
					openChannelIngressDrain: (options) => {
						assertTrustedPluginRuntime("openChannelIngressDrain");
						const stateDir = options.stateDir ?? baseState.resolveStateDir();
						const queue = options.queue ?? createChannelIngressQueue({
							channelId: pluginId,
							accountId: options.accountId,
							stateDir
						});
						const { queue: _queue, accountId: _accountId, stateDir: _stateDir, ...drainOptions } = options;
						return createChannelIngressDrain({
							...drainOptions,
							queue
						});
					}
				};
			}
			if (prop === "config") {
				const config = getRuntimeProperty();
				return {
					...config,
					current: () => runWithPluginScope(() => config.current()),
					mutateConfigFile: (params) => runWithPluginScope(() => config.mutateConfigFile(params)),
					replaceConfigFile: (params) => runWithPluginScope(() => config.replaceConfigFile(params))
				};
			}
			if (prop === "channel") {
				const ownerRecord = pluginRuntimeRecordById.get(pluginId);
				if (!ownerRecord) return getRuntimeProperty();
				return resolveRecordChannelRuntime(ownerRecord, true);
			}
			if (prop === "llm") {
				const llm = getRuntimeProperty();
				return {
					acquireLocalService: (...args) => withPluginRuntimePluginIdScope(pluginId, () => llm.acquireLocalService(...args)),
					complete: (params) => withPluginRuntimePluginIdScope(pluginId, () => llm.complete(params))
				};
			}
			if (prop === "gateway") {
				const gateway = getRuntimeProperty();
				return {
					isAvailable: () => runWithPluginScope(() => gateway.isAvailable()),
					request: async (method, params, options) => await runWithPluginScope(async () => {
						assertGatewaySessionRequestOwned(method, params);
						return await gateway.request(method, params, options);
					})
				};
			}
			if (prop === "hooks") {
				const hooks = getRuntimeProperty();
				return { dispatchHookAgentTurn: async (params) => {
					assertTrustedPluginRuntime("dispatchHookAgentTurn");
					return await runWithPluginScope(() => hooks.dispatchHookAgentTurn(params));
				} };
			}
			if (prop === "nodes") {
				const nodes = getRuntimeProperty();
				return {
					list: (params) => runWithPluginScope(() => nodes.list(params)),
					invoke: (params) => runWithPluginScope(() => nodes.invoke(params)),
					openDuplex: (params) => withPluginRuntimeRegistryScope(registry, () => runWithPluginScope(() => nodes.openDuplex(params)))
				};
			}
			if (prop === "agent") {
				if (scopedAgentRuntime) return scopedAgentRuntime;
				const agent = getRuntimeProperty();
				const session = agent.session;
				const scopedSession = {
					resolveStorePath: session.resolveStorePath,
					getSessionEntry: session.getSessionEntry,
					listSessionEntries: session.listSessionEntries,
					createSessionEntry: async (params) => await runWithPluginScope(async () => {
						if ([
							"agentHarnessId" in params.initialEntry,
							"cliBackendId" in params.initialEntry,
							"acpSessionBinding" in params.initialEntry
						].filter(Boolean).length !== 1) throw new Error(`Plugin "${pluginId}" session creation requires exactly one runtime owner.`);
						if ("agentHarnessId" in params.initialEntry) {
							assertOwnedHarness(params.initialEntry.agentHarnessId, "create its sessions");
							assertReservedSessionKeyOwned(params.key, "create");
							return await session.createSessionEntry(params);
						}
						if ("acpSessionBinding" in params.initialEntry) {
							if (!params.key.startsWith(`plugin:${pluginId}:`)) throw new Error(`Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`);
							return await session.createSessionEntry({
								...params,
								initialEntry: {
									...params.initialEntry,
									pluginOwnerId: pluginId
								}
							});
						}
						const cliInitial = params.initialEntry;
						const backend = registry.cliBackends.find((entry) => entry.backend.id === cliInitial.cliBackendId);
						if (!backend || backend.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" must own CLI backend "${cliInitial.cliBackendId}" to create its sessions.`);
						if (!params.key.startsWith(`plugin:${pluginId}:`)) throw new Error(`Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`);
						return await session.createSessionEntry({
							...params,
							initialEntry: {
								...cliInitial,
								pluginOwnerId: pluginId
							}
						});
					}),
					patchSessionEntry: async (params) => await runWithPluginScope(async () => {
						assertStoredSessionEntryOwned({
							action: "patch",
							sessionKey: params.sessionKey,
							...params.agentId !== void 0 ? { agentId: params.agentId } : {},
							...params.env !== void 0 ? { env: params.env } : {},
							...params.storePath !== void 0 ? { storePath: params.storePath } : {}
						});
						return await session.patchSessionEntry({
							...params,
							update: async (entry, context) => {
								const patch = await params.update(entry, context);
								if (!patch) return patch;
								const next = params.replaceEntry ? patch : {
									...entry,
									...patch
								};
								assertStoreEntryOwned({
									action: "patch",
									before: context.existingEntry ?? entry,
									entry: next,
									sessionKey: params.sessionKey
								});
								return patch;
							}
						});
					}),
					upsertSessionEntry: async (params) => await runWithPluginScope(async () => {
						const before = assertStoredSessionEntryOwned({
							action: "upsert",
							sessionKey: params.sessionKey,
							...params.agentId !== void 0 ? { agentId: params.agentId } : {},
							...params.env !== void 0 ? { env: params.env } : {},
							...params.storePath !== void 0 ? { storePath: params.storePath } : {}
						});
						assertStoreEntryOwned({
							action: "upsert",
							before,
							entry: params.entry,
							sessionKey: params.sessionKey
						});
						await session.upsertSessionEntry(params);
					}),
					runWithWorkAdmission: async (params, run) => await runWithPluginScope(async () => {
						const resolveCurrentExecutionOwner = () => resolveStoredSessionExecutionOwner({
							action: "admit work on",
							sessionKey: params.sessionKey,
							storePath: params.storePath
						});
						const ownerPluginId = resolveCurrentExecutionOwner();
						return await (ownerPluginId ? resolvePluginRuntime(ownerPluginId).agent.session : session).runWithWorkAdmission(params, async (signal) => {
							if (resolveCurrentExecutionOwner() !== ownerPluginId) throw new Error(`Session "${params.sessionKey}" changed execution ownership while starting work.`);
							return await runWithPluginScope(() => run(signal));
						});
					}),
					updateSessionStoreEntry: async (params) => await runWithPluginScope(async () => {
						assertStoredSessionEntryOwned({
							action: "update",
							sessionKey: params.sessionKey,
							storePath: params.storePath
						});
						return await session.updateSessionStoreEntry({
							...params,
							update: async (entry) => {
								const patch = await params.update(entry);
								if (!patch) return patch;
								assertStoreEntryOwned({
									action: "update",
									before: entry,
									entry: {
										...entry,
										...patch
									},
									sessionKey: params.sessionKey
								});
								return patch;
							}
						});
					})
				};
				const runEmbeddedAgent = async (params) => {
					const runParams = {
						...params,
						skillWorkshopCollectionReconcile: void 0
					};
					return await runWithPluginScope(async () => {
						const ownerPluginId = resolveRunSessionExecutionOwner(runParams);
						if (ownerPluginId) return await resolvePluginRuntime(ownerPluginId).agent.runEmbeddedAgent(runParams);
						return await agent.runEmbeddedAgent(runParams);
					});
				};
				const channelOwnerRecord = pluginRuntimeRecordById.get(pluginId);
				const runCommandFromIngress = async (params, commandRuntime) => {
					const { senderIsOwner: claimedOwner, messageChannel, ...remainingParams } = params;
					const senderIsOwner = claimedOwner === true;
					const ingressParams = {
						...remainingParams,
						senderIsOwner,
						messageChannel
					};
					if (!channelOwnerRecord || senderIsOwner && channelOwnerRecord.origin !== "bundled" && channelOwnerRecord.trustedOfficialInstall !== true || pluginRuntimeRecordById.get(pluginId) !== channelOwnerRecord || !activePluginRuntimeRecords.has(channelOwnerRecord) || isPluginRegistryRetired(registry) || !registry.plugins.some((record) => record === channelOwnerRecord && record.status === "loaded") || !registry.channels.some((channel) => channel.pluginId === pluginId && channel.plugin.id === messageChannel)) throw new Error(`Plugin "${pluginId}" cannot admit authenticated owner authority for channel "${messageChannel ?? "unknown"}".`);
					return await runWithPluginScope(() => agent.runCommandFromIngress(ingressParams, commandRuntime));
				};
				const scopedAgent = Object.create(Object.getPrototypeOf(agent), Object.getOwnPropertyDescriptors(agent));
				Object.defineProperties(scopedAgent, {
					runCommandFromIngress: {
						configurable: true,
						enumerable: true,
						value: runCommandFromIngress
					},
					runEmbeddedAgent: {
						configurable: true,
						enumerable: true,
						value: runEmbeddedAgent
					},
					session: {
						configurable: true,
						enumerable: true,
						value: scopedSession
					}
				});
				scopedAgentRuntime = scopedAgent;
				return scopedAgentRuntime;
			}
			if (prop !== "subagent") return getRuntimeProperty();
			const subagent = getRuntimeProperty();
			return {
				run: async (params) => await withPluginRuntimePluginIdScope(pluginId, async () => {
					assertSessionIdentitiesOwned({
						action: "run",
						sessionKeys: [params.sessionKey]
					});
					return await subagent.run(params);
				}),
				waitForRun: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.waitForRun(params)),
				getSessionMessages: (params) => withPluginRuntimePluginIdScope(pluginId, () => subagent.getSessionMessages(params)),
				deleteSession: async (params) => await withPluginRuntimePluginIdScope(pluginId, async () => {
					assertStoredSessionEntryOwned({
						action: "delete",
						sessionKey: params.sessionKey
					});
					await subagent.deleteSession(params);
				})
			};
		} });
		pluginRuntimeById.set(pluginId, runtime);
		return runtime;
	};
	return {
		resolvePluginRuntime,
		resolveRegisteredChannelRuntime: (record) => resolveRecordChannelRuntime(record, false),
		setPluginRuntimeRecord: (record) => {
			pluginRuntimeRecordById.set(record.id, record);
			activePluginRuntimeRecords.add(record);
		},
		revokePluginRuntimeRecord: (pluginId, record) => {
			const ownedRecord = record ?? pluginRuntimeRecordById.get(pluginId);
			if (ownedRecord) {
				activePluginRuntimeRecords.delete(ownedRecord);
				revokePluginRecordLifecycleEpoch(registry, ownedRecord);
				registeredAdmissionOwnerByRecord.get(ownedRecord)?.dispose();
				registeredAdmissionOwnerByRecord.delete(ownedRecord);
				if (registeredRuntimeRecordById.get(pluginId) === ownedRecord) registeredRuntimeRecordById.delete(pluginId);
			}
		}
	};
}
//#endregion
//#region src/plugins/registry.ts
/** In-memory plugin registry builder and mutation API for plugin runtime registration. */
function clonePluginRecord(record) {
	return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]));
}
function restorePluginRecord(record, snapshot) {
	Object.keys(record).forEach((key) => Reflect.deleteProperty(record, key));
	Object.assign(record, snapshot);
}
/**
* Compose the registry state, domain registrars, scoped runtime, and plugin API.
* Domain modules own validation and mutation; this function owns lifecycle wiring only.
*/
function createPluginRegistry(registryParams) {
	const state = createPluginRegistryState(registryParams);
	const registrars = createPluginRegistrars(state);
	const runtimeResolver = createPluginRuntimeResolver(state);
	const { createApi: createPluginApi, deactivatePluginSideEffectGuards } = createPluginApiFactory(state, registrars, runtimeResolver);
	const registrationRecordSnapshots = /* @__PURE__ */ new WeakMap();
	const createApi = (record, params) => {
		registrationRecordSnapshots.set(record, clonePluginRecord(record));
		return createPluginApi(record, params);
	};
	const rollbackPluginGlobalSideEffects = (pluginId, record) => {
		deactivatePluginSideEffectGuards(pluginId);
		runtimeResolver.revokePluginRuntimeRecord(pluginId, record);
		const schedulerRecords = state.registry.sessionSchedulerJobs.filter((r) => r.pluginId === pluginId);
		const gatewayMethods = state.registry.gatewayMethodDescriptors.filter((entry) => entry.owner.kind === "plugin" && entry.owner.pluginId === pluginId).map((entry) => entry.name);
		for (const [registryKey, value] of Object.entries(state.registry)) {
			if (registryKey === "plugins" || registryKey === "diagnostics") continue;
			if (Array.isArray(value)) for (let index = value.length - 1; index >= 0; index -= 1) {
				const entry = value[index];
				if (entry?.pluginId === pluginId || entry?.ownerPluginId === pluginId || entry?.owner?.pluginId === pluginId) value.splice(index, 1);
			}
			else if (value instanceof Map) for (const [key, entry] of value) {
				const owner = entry;
				if (owner?.pluginId === pluginId || owner?.owner === `plugin:${pluginId}`) value.delete(key);
			}
		}
		for (const method of gatewayMethods) delete state.registry.gatewayHandlers[method];
		for (const key of state.registry.pluginRuntimeArtifacts.keys()) if (JSON.parse(key)[0] === pluginId) state.registry.pluginRuntimeArtifacts.delete(key);
		const recordSnapshot = record ? registrationRecordSnapshots.get(record) : void 0;
		if (record && recordSnapshot) {
			restorePluginRecord(record, recordSnapshot);
			registrationRecordSnapshots.delete(record);
		}
		if (registryParams.activateGlobalSideEffects !== false && schedulerRecords.length > 0) cleanupPluginSessionSchedulerJobs({
			pluginId,
			reason: "disable",
			records: schedulerRecords,
			cleanupOwnerRegistry: state.registry
		}).then((failures) => {
			for (const failure of failures) state.pushDiagnostic({
				level: "warn",
				pluginId: failure.pluginId,
				message: `scheduler job cleanup failed during rollback: ${failure.hookId}`
			});
		});
	};
	return {
		registry: state.registry,
		createApi,
		rollbackPluginGlobalSideEffects,
		pushDiagnostic: state.pushDiagnostic,
		registerTool: registrars.registerTool,
		registerChannel: registrars.registerChannel,
		registerHostedMediaResolver: registrars.registerHostedMediaResolver,
		registerWidgetPresenter: registrars.registerWidgetPresenter,
		registerMcpServerConnectionResolver: registrars.registerMcpServerConnectionResolver,
		registerProvider: registrars.registerProvider,
		registerWorkerProvider: registrars.registerWorkerProvider,
		registerModelCatalogProvider: registrars.registerModelCatalogProvider,
		registerAgentHarness: registrars.registerAgentHarness,
		registerCliBackend: registrars.registerCliBackend,
		registerTextTransforms: registrars.registerTextTransforms,
		registerEmbeddingProvider: registrars.registerEmbeddingProvider,
		registerSpeechProvider: registrars.registerSpeechProvider,
		registerRealtimeTranscriptionProvider: registrars.registerRealtimeTranscriptionProvider,
		registerRealtimeVoiceProvider: registrars.registerRealtimeVoiceProvider,
		registerMediaUnderstandingProvider: registrars.registerMediaUnderstandingProvider,
		registerTranscriptSourceProvider: registrars.registerTranscriptSourceProvider,
		registerImageGenerationProvider: registrars.registerImageGenerationProvider,
		registerVideoGenerationProvider: registrars.registerVideoGenerationProvider,
		registerMusicGenerationProvider: registrars.registerMusicGenerationProvider,
		registerWebSearchProvider: registrars.registerWebSearchProvider,
		registerMigrationProvider: registrars.registerMigrationProvider,
		registerGatewayMethod: registrars.registerGatewayMethod,
		registerSessionCatalog: registrars.registerSessionCatalog,
		registerCli: registrars.registerCli,
		registerReload: registrars.registerReload,
		registerNodeHostCommand: registrars.registerNodeHostCommand,
		registerSecurityAuditCollector: registrars.registerSecurityAuditCollector,
		registerService: registrars.registerService,
		registerCommand: registrars.registerCommand,
		registerSessionExtension: registrars.registerSessionExtension,
		registerTrustedToolPolicy: registrars.registerTrustedToolPolicy,
		registerToolMetadata: registrars.registerToolMetadata,
		registerControlUiDescriptor: registrars.registerControlUiDescriptor,
		registerBoardWidgetContentKind: registrars.registerBoardWidgetContentKind,
		registerRuntimeLifecycle: registrars.registerRuntimeLifecycle,
		registerAgentEventSubscription: registrars.registerAgentEventSubscription,
		registerSessionSchedulerJob: registrars.registerSessionSchedulerJob,
		registerSessionAction: registrars.registerSessionAction,
		registerHook: registrars.registerHook,
		registerTypedHook: registrars.registerTypedHook
	};
}
//#endregion
//#region src/plugins/loader-runtime-load.ts
function createDeferredGatewaySubagentRuntime(runtime) {
	return {
		run: (...args) => runtime.subagent.run(...args),
		waitForRun: (...args) => runtime.subagent.waitForRun(...args),
		getSessionMessages: (...args) => runtime.subagent.getSessionMessages(...args),
		deleteSession: (...args) => runtime.subagent.deleteSession(...args)
	};
}
function createDeferredGatewayNodesRuntime(runtime) {
	return {
		list: (...args) => runtime.nodes.list(...args),
		invoke: (...args) => runtime.nodes.invoke(...args),
		openDuplex: (...args) => runtime.nodes.openDuplex(...args)
	};
}
function loadOpenClawPlugins(options = {}) {
	return loadOpenClawPluginsInternal(options);
}
/** Internal entry for host-owned snapshots that need a narrow registration runtime. */
function loadOpenClawPluginsWithInternalOverrides(options, overrides) {
	return loadOpenClawPluginsInternal(options, overrides);
}
function loadOpenClawPluginsInternal(options, overrides) {
	const requestedOnlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(options.onlyPluginIds));
	if (requestedOnlyPluginIdSet && requestedOnlyPluginIdSet.size === 0) {
		const emptyRegistry = createEmptyPluginRegistry();
		if (options.activate !== false) {
			const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
			activatePluginRegistry(emptyRegistry, `empty-plugin-scope::${runtimeSubagentMode}::${options.workspaceDir ?? ""}`, runtimeSubagentMode, options.workspaceDir);
		}
		return emptyRegistry;
	}
	const context = resolvePluginLoadCacheContext(options);
	const logger = options.logger ?? createPluginLoaderLogger();
	const validateOnly = options.mode === "validate";
	const onlyPluginIdSet = createPluginIdScopeSet(context.onlyPluginIds);
	const cacheEnabled = options.cache !== false && options.resolveRawConfigEnvVars !== true;
	if (cacheEnabled) {
		const cached = getReusableCachedPluginRegistry(context.cacheKey);
		if (cached) {
			maybeThrowOnPluginLoadError(cached, options.throwOnLoadError);
			if (context.shouldActivate) activatePluginRegistry(cached, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir);
			return cached;
		}
	}
	pluginLoaderCacheState.beginLoad(context.cacheKey);
	let registryBuilder;
	try {
		const loadPluginModule = createPluginModuleLoader({
			devSourceRoot: context.devSourceRoot,
			pluginSdkResolution: options.pluginSdkResolution,
			...overrides?.moduleLoader
		});
		const activeRuntime = options.runtimeOptions?.allowGatewaySubagentBinding === true ? getActivePluginRegistry() : void 0;
		const activeGatewayRuntime = activeRuntime ? getPluginRegistryRuntime(activeRuntime) : void 0;
		const borrowedSubagent = activeGatewayRuntime ? createDeferredGatewaySubagentRuntime(activeGatewayRuntime) : void 0;
		const borrowedNodes = activeGatewayRuntime ? createDeferredGatewayNodesRuntime(activeGatewayRuntime) : void 0;
		registryBuilder = createPluginRegistry({
			logger,
			runtime: overrides?.runtime ? overrides.runtime : createLazyPluginRuntime({
				devSourceRoot: context.devSourceRoot,
				pluginSdkResolution: options.pluginSdkResolution,
				runtimeOptions: {
					...options.runtimeOptions,
					subagent: options.runtimeOptions?.subagent ?? borrowedSubagent,
					nodes: options.runtimeOptions?.nodes ?? borrowedNodes
				},
				loadPluginModule
			}),
			allowProcessHomeSessionCatalogs: options.allowProcessHomeSessionCatalogs ?? true,
			coreGatewayHandlers: options.coreGatewayHandlers,
			...options.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: options.coreGatewayMethodNames },
			...options.hostServices !== void 0 && { hostServices: options.hostServices },
			activateGlobalSideEffects: context.shouldActivate
		});
		const { registry } = registryBuilder;
		const { manifestRegistry, orderedCandidates, manifestBySource, provenance } = resolvePluginLoadDiscovery({
			options,
			context,
			diagnostics: registry.diagnostics,
			logger,
			onlyPluginIdSet,
			emitWarning: context.shouldActivate,
			warningCacheKey: context.cacheKey,
			suppliedManifestRegistry: options.manifestRegistry
		});
		const selectedMiddlewareOwnerManifests = /* @__PURE__ */ new Map();
		for (const candidate of orderedCandidates) {
			const record = manifestBySource.get(candidate.source);
			if (record && !selectedMiddlewareOwnerManifests.has(record.id)) selectedMiddlewareOwnerManifests.set(record.id, record);
		}
		for (const record of selectedMiddlewareOwnerManifests.values()) {
			const activation = resolveEffectivePluginActivationState({
				id: record.id,
				origin: record.origin,
				config: context.normalized,
				rootConfig: context.cfg,
				enabledByDefault: isPluginEnabledByDefaultForPlatform(record),
				activationSource: context.activationSource
			});
			const runtimes = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
			if (runtimes.length > 0 && (record.origin === "bundled" || activation.enabled && activation.explicitlyEnabled)) registry.agentToolResultMiddlewareOwners.push({
				pluginId: record.id,
				runtimes,
				manifest: record
			});
		}
		const memorySlot = context.normalized.slots.memory;
		const state = {
			seenIds: /* @__PURE__ */ new Map(),
			selectedMemoryPluginId: null,
			memorySlotMatched: false,
			pluginLoadAttemptCount: 0
		};
		const dreamingSidecar = resolveAuthorizedDreamingSidecar({
			cfg: context.cfg,
			normalized: context.normalized,
			activationSource: context.activationSource,
			manifestRegistry,
			memorySlot
		});
		const pluginLoadStartMs = performance.now();
		for (const candidate of orderedCandidates) {
			const manifestRecord = manifestBySource.get(candidate.source);
			if (!manifestRecord) continue;
			loadRuntimePluginCandidate({
				candidate,
				manifestRecord,
				context,
				options,
				onlyPluginIdSet,
				dreamingSidecar,
				validateOnly,
				registryBuilder,
				loadPluginModule,
				logger,
				state
			});
		}
		const pluginLoadElapsedMs = performance.now() - pluginLoadStartMs;
		if (state.pluginLoadAttemptCount > 0) logger.debug?.(`[plugins] loaded ${registry.plugins.length} plugin(s) (${state.pluginLoadAttemptCount} attempted) in ${pluginLoadElapsedMs.toFixed(1)}ms`);
		if (!onlyPluginIdSet && typeof memorySlot === "string" && !state.memorySlotMatched) registry.diagnostics.push({
			level: "warn",
			message: `memory slot plugin not found or not marked as memory: ${memorySlot}`
		});
		warnAboutUntrackedLoadedPlugins(recordPluginInstallOwnerLookup({
			registry,
			provenance,
			allowlist: context.normalized.allow,
			emitWarning: context.shouldActivate,
			logger,
			env: context.env
		}, new Map(orderedCandidates.flatMap((candidate) => {
			const pluginId = manifestBySource.get(candidate.source)?.id;
			const installOwner = resolvePluginCandidateInstallOwner(candidate);
			return pluginId && installOwner ? [[pluginId, installOwner]] : [];
		}))));
		maybeThrowOnPluginLoadError(registry, options.throwOnLoadError);
		if (context.shouldActivate && options.mode !== "validate") {
			const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
			if (failedPlugins.length > 0) logger.warn(`[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(failedPlugins)}). Run 'openclaw plugins inspect <id> --runtime --json' for runtime diagnostics, 'openclaw plugins list' for registry state, and restart the Gateway after plugin code or load-path changes.`);
		}
		if (context.shouldActivate) activatePluginRegistry(registry, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir);
		if (cacheEnabled) setCachedPluginRegistry(context.cacheKey, registry);
		return registry;
	} catch (error) {
		if (context.shouldActivate && registryBuilder?.registry !== getActivePluginRegistry()) {
			for (const plugin of registryBuilder?.registry.plugins.toReversed() ?? []) if (plugin.status === "loaded") registryBuilder?.rollbackPluginGlobalSideEffects(plugin.id);
		}
		throw error;
	} finally {
		pluginLoaderCacheState.finishLoad(context.cacheKey);
	}
}
//#endregion
//#region src/plugins/loader-cli-registry.ts
async function loadOpenClawPluginCliRegistry(options = {}) {
	const context = resolvePluginLoadCacheContext({
		...options,
		activate: false
	});
	const logger = options.logger ?? createPluginLoaderLogger();
	const onlyPluginIdSet = createPluginIdScopeSet(context.onlyPluginIds);
	const loadPluginModule = createPluginModuleLoader({
		devSourceRoot: context.devSourceRoot,
		pluginSdkResolution: options.pluginSdkResolution
	});
	const { registry, registerCli, rollbackPluginGlobalSideEffects } = createPluginRegistry({
		logger,
		runtime: createUnavailableRuntime("cli-metadata"),
		coreGatewayHandlers: options.coreGatewayHandlers,
		...options.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: options.coreGatewayMethodNames },
		activateGlobalSideEffects: false
	});
	const { manifestRegistry, orderedCandidates, manifestBySource } = resolvePluginLoadDiscovery({
		options,
		context,
		diagnostics: registry.diagnostics,
		logger,
		onlyPluginIdSet,
		emitWarning: false,
		warningCacheKey: `${context.cacheKey}::cli-metadata`
	});
	const seenIds = /* @__PURE__ */ new Map();
	const memorySlot = context.normalized.slots.memory;
	let selectedMemoryPluginId = null;
	const dreamingSidecar = resolveAuthorizedDreamingSidecar({
		cfg: context.cfg,
		normalized: context.normalized,
		activationSource: context.activationSource,
		manifestRegistry,
		memorySlot
	});
	for (const candidate of orderedCandidates) {
		const manifestRecord = manifestBySource.get(candidate.source);
		if (!manifestRecord) continue;
		const pluginId = manifestRecord.id;
		const policyId = normalizePluginPolicyId(pluginId);
		if (!matchesScopedPluginOrDreamingSidecar({
			onlyPluginIdSet,
			pluginId,
			sidecar: dreamingSidecar
		})) continue;
		const isDreamingSidecar = isAuthorizedDreamingSidecarPlugin({
			sidecar: dreamingSidecar,
			pluginId
		});
		const activationState = isDreamingSidecar ? {
			enabled: true,
			activated: true,
			explicitlyEnabled: false,
			source: "auto",
			reason: `dreaming sidecar for selected memory slot "${dreamingSidecar?.selectedMemoryPluginId ?? ""}"`
		} : resolveEffectivePluginActivationState({
			id: pluginId,
			origin: candidate.origin,
			config: context.normalized,
			rootConfig: context.cfg,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
			activationSource: context.activationSource,
			autoEnabledReason: formatAutoEnabledActivationReason(context.autoEnabledReasons[pluginId])
		});
		const existingOrigin = seenIds.get(pluginId);
		if (existingOrigin) {
			const duplicate = createManifestPluginRecord({
				candidate,
				manifestRecord,
				enabled: false,
				activationState
			});
			duplicate.status = "disabled";
			duplicate.error = `overridden by ${existingOrigin} plugin`;
			markPluginActivationDisabled(duplicate, duplicate.error);
			registry.plugins.push(duplicate);
			continue;
		}
		const enableState = isDreamingSidecar ? { enabled: true } : resolveEffectiveEnableState({
			id: pluginId,
			origin: candidate.origin,
			config: context.normalized,
			rootConfig: context.cfg,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
			activationSource: context.activationSource
		});
		const entry = context.normalized.entries[policyId];
		const record = createManifestPluginRecord({
			candidate,
			manifestRecord,
			enabled: enableState.enabled,
			activationState
		});
		applyPluginManifestRecordDetails(record, manifestRecord);
		const pushPluginLoadError = (message) => pushPluginValidationError({
			registry,
			seenIds,
			pluginId,
			origin: candidate.origin,
			record,
			message
		});
		if (!enableState.enabled) {
			record.status = "disabled";
			record.error = enableState.reason;
			markPluginActivationDisabled(record, enableState.reason);
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			continue;
		}
		if (record.format === "bundle") {
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			continue;
		}
		if (!manifestRecord.configSchema) {
			pushPluginLoadError("missing config schema");
			continue;
		}
		const validatedConfig = validatePluginConfig({
			schema: manifestRecord.configSchema,
			cacheKey: manifestRecord.schemaCacheKey,
			value: entry?.config
		});
		if (!validatedConfig.ok) {
			logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
			pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
			continue;
		}
		const cliMetadataSource = resolveCliMetadataEntrySource(candidate.rootDir, candidate.source);
		const sourceForCliMetadata = candidate.origin === "bundled" ? cliMetadataSource ? safeRealpathOrResolve(cliMetadataSource) : null : cliMetadataSource ?? candidate.source;
		if (!sourceForCliMetadata) {
			record.status = "loaded";
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
			continue;
		}
		const opened = openRootFileSync({
			absolutePath: sourceForCliMetadata,
			rootPath: safeRealpathOrResolve(candidate.rootDir),
			boundaryLabel: "plugin root",
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: candidate.origin,
				rootDir: candidate.rootDir,
				env: context.env
			}),
			skipLexicalRootCheck: true
		});
		if (!opened.ok) {
			pushPluginLoadError(describeRootFileOpenFailure({
				failure: opened,
				subject: "plugin entry path",
				boundaryLabel: "plugin root",
				filePath: sourceForCliMetadata
			}));
			continue;
		}
		const safeSource = opened.path;
		fs.closeSync(opened.fd);
		let mod;
		try {
			mod = withProfile({
				pluginId: record.id,
				source: safeSource
			}, "cli-metadata", () => loadPluginModule(safeSource));
		} catch (error) {
			recordPluginError({
				logger,
				registry,
				record,
				seenIds,
				pluginId,
				origin: candidate.origin,
				phase: "load",
				error,
				logPrefix: `[plugins] ${record.id} failed to load from ${record.source}: `,
				diagnosticMessagePrefix: "failed to load plugin: "
			});
			continue;
		}
		const { definition, register } = resolvePluginModuleExport(mod);
		if (definition?.id && definition.id !== record.id) {
			pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`);
			continue;
		}
		record.name = definition?.name ?? record.name;
		record.description = definition?.description ?? record.description;
		record.version = definition?.version ?? record.version;
		const manifestKind = record.kind;
		const exportKind = definition?.kind;
		if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) registry.diagnostics.push({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`
		});
		record.kind = definition?.kind ?? record.kind;
		if (!isDreamingSidecar) {
			const memoryDecision = resolveMemorySlotDecision({
				id: record.id,
				kind: record.kind,
				slot: memorySlot,
				selectedId: selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) {
				record.enabled = false;
				record.status = "disabled";
				record.error = memoryDecision.reason;
				markPluginActivationDisabled(record, memoryDecision.reason);
				registry.plugins.push(record);
				seenIds.set(pluginId, candidate.origin);
				continue;
			}
			if (memoryDecision.selected && hasKind(record.kind, "memory")) {
				selectedMemoryPluginId = record.id;
				record.memorySlotSelected = true;
			}
		}
		if (typeof register !== "function") {
			const wrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
			if (wrongLoaderError) {
				logger.error(`[plugins] ${record.id} ${wrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`);
				pushPluginLoadError(wrongLoaderError);
			} else {
				logger.error(`[plugins] ${record.id} missing register/activate export`);
				pushPluginLoadError(formatMissingPluginRegisterError(mod, context.env));
			}
			continue;
		}
		const api = buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			rootDir: record.rootDir,
			registrationMode: "cli-metadata",
			config: context.cfg,
			pluginConfig: validatedConfig.value,
			runtime: createUnavailableRuntime("cli-metadata", record.id),
			logger,
			resolvePath: (input) => resolveUserPath(input),
			handlers: { registerCli: (registrar, opts) => registerCli(record, registrar, opts) }
		});
		try {
			withProfile({
				pluginId: record.id,
				source: record.source
			}, "cli-metadata:register", () => runPluginRegisterSyncInRegistry(register, api, registry, record.id));
			registry.plugins.push(record);
			seenIds.set(pluginId, candidate.origin);
		} catch (error) {
			rollbackPluginGlobalSideEffects(record.id, record);
			recordPluginError({
				logger,
				registry,
				record,
				seenIds,
				pluginId,
				origin: candidate.origin,
				phase: "register",
				error,
				logPrefix: `[plugins] ${record.id} failed during register from ${record.source}: `,
				diagnosticMessagePrefix: "plugin failed during register: "
			});
		}
	}
	return registry;
}
function resolveCliMetadataEntrySource(rootDir, source) {
	for (const directory of /* @__PURE__ */ new Set([rootDir, path.dirname(source)])) for (const extension of [
		".ts",
		".js",
		".mjs",
		".cjs"
	]) {
		const candidate = path.join(directory, `cli-metadata${extension}`);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
//#endregion
//#region src/plugins/loader-runtime-registry.ts
function getExactActivePluginRegistry(options) {
	const activeRegistry = getActivePluginRegistry() ?? void 0;
	if (!activeRegistry || options === void 0) return activeRegistry;
	const activeCacheKey = getActivePluginRegistryKey();
	if (!activeCacheKey) return;
	return resolvePluginLoadCacheContext(options).cacheKey === activeCacheKey ? activeRegistry : void 0;
}
function resolveRuntimePluginRegistry(options) {
	const activeRegistry = getExactActivePluginRegistry(options);
	if (activeRegistry) return activeRegistry;
	if (isPluginRegistryLoadInFlight(options)) return;
	return loadOpenClawPlugins({
		...options,
		activate: false
	});
}
function getRuntimePluginRegistryForLoadOptions(options) {
	return resolveRuntimePluginRegistry(options);
}
/** Return the exact active registry without triggering a fresh load on cache miss. */
function resolveCompatibleRuntimePluginRegistry(options) {
	return getExactActivePluginRegistry(options);
}
//#endregion
//#region src/plugins/loader.ts
/** Stable public facade for plugin loading and runtime-registry resolution. */
/** Loads a caller-owned registry value without changing the process-wide active registry. */
function loadPluginRegistryHandle(options = {}) {
	return loadOpenClawPlugins({
		...options,
		activate: false
	});
}
/** Loads and installs the registry owned by a process composition root. */
function loadAndActivateRootPluginRegistry(options = {}) {
	return loadOpenClawPlugins({
		...options,
		activate: true
	});
}
//#endregion
export { readCanonicalCronListPage as A, voiceProviderSupportsModel as C, getPluginSessionExtensionStateSync as D, drainPluginNextTurnInjectionContext as E, resolvePluginRegistryLoadCacheKey as F, getAgentToolResultMiddlewareMatcherScope as I, listAgentToolResultMiddlewares as L, getPluginRegistryRuntime as M, clearPluginRegistryLoadCache as N, patchPluginSessionExtension as O, isPluginRegistryLoadInFlight as P, buildPluginAgentTurnPrepareContext as R, resolveVoiceProviderCandidates as S, synthesizeMediaGenerationCatalogEntries as T, getVoiceProviderConfig as _, resolveRuntimePluginRegistry as a, resolveSupportedVoiceModelRefs as b, loadOpenClawPluginsWithInternalOverrides as c, isPluginHookAgentTrigger as d, createGatewayMethodDescriptorsFromHandlers as f, projectProviderCatalogResultToUnifiedTextRows as g, findUndeclaredPluginToolNames as h, resolveCompatibleRuntimePluginRegistry as i, resolveCronListPageNextOffset as j, projectPluginSessionExtensionsSync as k, createHostChannelInboundEventContextBuilder as l, createPluginGatewayMethodDescriptors as m, loadPluginRegistryHandle as n, loadOpenClawPluginCliRegistry as o, createGatewayMethodRegistry as p, getRuntimePluginRegistryForLoadOptions as r, loadOpenClawPlugins as s, loadAndActivateRootPluginRegistry as t, listCodexAppServerExtensionFactories as u, providerMatchesId as v, listMediaGenerationProviderModels as w, resolveVoiceModelRefs as x, resolvePrimaryVoiceProviderCandidate as y };
