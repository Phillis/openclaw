import { m as normalizeUniqueStringEntries, u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { i as getCurrentPluginMetadataSnapshotState, n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { r as createPluginCacheKey, t as PluginLruCache } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { n as createPluginModuleLoaderCache, r as getCachedPluginModuleLoader, t as clearPluginModuleLoaderLifecycleCache } from "./plugin-module-loader-cache-DNYw5tMM.js";
import { o as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-3yWCh0UH.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-BBST5Lo5.js";
import "./plugin-registry-DS2siXub.js";
import { n as listSetupProviderIds, t as listSetupCliBackendIds } from "./setup-descriptors-C6ZUmfj0.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-DG2DrbrX.js";
import "./config-contracts-BDz_3xlE.js";
import { i as createUnavailableRuntime, n as resolvePreferredBundledRootArtifact, r as buildPluginApi } from "./plugin-runtime-artifact-selection-VqjOEbH8.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/setup-registry-loader-state.ts
/** Shared loader state for plugin setup registration and test fixtures. */
const pluginSetupRegistryLoaderState = {
	moduleLoaders: createPluginModuleLoaderCache(),
	moduleRoots: /* @__PURE__ */ new Map(),
	moduleLoaderFactory: void 0
};
//#endregion
//#region src/plugins/setup-registry.ts
const log = createSubsystemLogger("plugins/setup-registry");
const SETUP_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
const NOOP_LOGGER = {
	info() {},
	warn() {},
	error() {}
};
const MAX_SETUP_REGISTRY_CACHE_ENTRIES = 16;
let setupRegistrySnapshotIdSeq = 0;
let setupRegistrySnapshotIds = /* @__PURE__ */ new WeakMap();
const setupManifestRegistryCache = new PluginLruCache(MAX_SETUP_REGISTRY_CACHE_ENTRIES);
const pluginSetupRegistryCache = new PluginLruCache(MAX_SETUP_REGISTRY_CACHE_ENTRIES);
function clearPluginSetupRegistryCache() {
	clearPluginModuleLoaderLifecycleCache(pluginSetupRegistryLoaderState);
	setupRegistrySnapshotIds = /* @__PURE__ */ new WeakMap();
	setupManifestRegistryCache.clear();
	pluginSetupRegistryCache.clear();
}
registerPluginMetadataProcessMemoLifecycleClear(clearPluginSetupRegistryCache);
function getModuleLoader(modulePath, rootDir) {
	pluginSetupRegistryLoaderState.moduleRoots.set(modulePath, rootDir);
	return getCachedPluginModuleLoader({
		cache: pluginSetupRegistryLoaderState.moduleLoaders,
		modulePath,
		importerUrl: import.meta.url,
		...pluginSetupRegistryLoaderState.moduleLoaderFactory ? { createLoader: pluginSetupRegistryLoaderState.moduleLoaderFactory } : {}
	});
}
function resolveSetupApiPath(rootDir, options) {
	const orderedExtensions = RUNNING_FROM_BUILT_ARTIFACT ? SETUP_API_EXTENSIONS : [...SETUP_API_EXTENSIONS.slice(3), ...SETUP_API_EXTENSIONS.slice(0, 3)];
	const findSetupApi = (candidateRootDir) => {
		for (const extension of orderedExtensions) {
			const candidate = path.join(candidateRootDir, `setup-api${extension}`);
			if (fs.existsSync(candidate)) return candidate;
		}
		return null;
	};
	const direct = findSetupApi(rootDir);
	if (direct) return direct;
	if (options?.includeBundledSourceFallback === false) return null;
	const bundledExtensionDir = path.basename(rootDir);
	const repoRootCandidates = [path.resolve(path.dirname(CURRENT_MODULE_PATH), "..", "..")];
	for (const repoRoot of repoRootCandidates) {
		const sourceExtensionRoot = path.join(repoRoot, "extensions", bundledExtensionDir);
		if (sourceExtensionRoot === rootDir) continue;
		const sourceFallback = findSetupApi(sourceExtensionRoot);
		if (sourceFallback) return sourceFallback;
	}
	return null;
}
function collectConfiguredPluginEntryIds(config) {
	const entries = config.plugins?.entries;
	if (!entries || typeof entries !== "object") return [];
	return normalizeStringEntries(Object.keys(entries)).toSorted();
}
function resolveRelevantSetupMigrationPluginIds(params) {
	const ids = new Set(collectConfiguredPluginEntryIds(params.config));
	const registry = loadSetupManifestRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	for (const plugin of registry.plugins) {
		const paths = plugin.configContracts?.compatibilityMigrationPaths;
		if (!paths?.length) continue;
		if (paths.some((pathPattern) => collectPluginConfigContractMatches({
			root: params.config,
			pathPattern
		}).length > 0)) ids.add(plugin.id);
	}
	return [...ids].toSorted();
}
function resolveRegister(mod) {
	if (typeof mod === "function") return { register: mod };
	if (mod && typeof mod === "object" && typeof mod.register === "function") return {
		definition: mod,
		register: mod.register.bind(mod)
	};
	return {};
}
function resolveLoadableSetupRuntimeSource(record) {
	const source = record.setupSource ?? resolveSetupApiPath(record.rootDir);
	if (!source) return null;
	if (record.origin !== "bundled") return {
		source,
		rootDir: record.rootDir
	};
	return resolvePreferredBundledRootArtifact({
		source,
		rootDir: record.rootDir,
		packageManifest: record.packageManifest
	});
}
function resolveDeclaredSetupRuntimeSource(record) {
	return record.setupSource ?? resolveSetupApiPath(record.rootDir, { includeBundledSourceFallback: false });
}
function resolveSetupRegistration(record, diagnostics) {
	if (record.setup?.requiresRuntime === false) return null;
	const setupArtifact = resolveLoadableSetupRuntimeSource(record);
	if (!setupArtifact) return null;
	const setupSource = setupArtifact.source;
	let mod;
	try {
		mod = getModuleLoader(setupSource, setupArtifact.rootDir)(setupSource);
	} catch (error) {
		diagnostics.push({
			pluginId: record.id,
			code: "setup-entry-load-failed",
			message: `setup entry failed to load from ${setupSource}: ${String(error)}`
		});
		return null;
	}
	const resolved = resolveRegister(mod.default ?? mod);
	if (!resolved.register) return null;
	if (resolved.definition?.id && resolved.definition.id !== record.id) return null;
	return {
		setupSource,
		register: resolved.register
	};
}
function buildSetupPluginApi(params) {
	return buildPluginApi({
		id: params.record.id,
		name: params.record.name ?? params.record.id,
		version: params.record.version,
		description: params.record.description,
		source: params.setupSource,
		rootDir: params.record.rootDir,
		registrationMode: "setup-only",
		config: {},
		runtime: createUnavailableRuntime("setup-only", params.record.id),
		logger: NOOP_LOGGER,
		resolvePath: (input) => input,
		handlers: params.handlers
	});
}
function ignoreAsyncSetupRegisterResult(result) {
	if (!result || typeof result.then !== "function") return;
	Promise.resolve(result).catch(() => void 0);
}
function runSetupRegistration(register, api, onError) {
	try {
		ignoreAsyncSetupRegisterResult(register(api));
		return true;
	} catch (error) {
		onError(error);
		return false;
	}
}
function matchesProvider(provider, providerId) {
	const normalized = normalizeProviderId(providerId);
	if (normalizeProviderId(provider.id) === normalized) return true;
	return [...provider.aliases ?? [], ...provider.hookAliases ?? []].some((alias) => normalizeProviderId(alias) === normalized);
}
function resolveSetupRegistryCacheKey(params) {
	const env = params?.env ?? process.env;
	if (env !== process.env) return null;
	return createPluginCacheKey([
		"setup-registry",
		resolvePluginControlPlaneFingerprint({
			config: params?.config,
			env,
			workspaceDir: params?.workspaceDir
		}),
		resolvePluginMetadataEnvFingerprint(env),
		resolveCurrentSetupSnapshotCacheId(),
		process.cwd(),
		params?.pluginIds ? [...params.pluginIds].toSorted() : null
	]);
}
function resolveCurrentSetupSnapshotCacheId() {
	const { snapshot } = getCurrentPluginMetadataSnapshotState();
	if (!snapshot || typeof snapshot !== "object") return "nosnap";
	let id = setupRegistrySnapshotIds.get(snapshot);
	if (id === void 0) {
		id = `s${++setupRegistrySnapshotIdSeq}`;
		setupRegistrySnapshotIds.set(snapshot, id);
	}
	return id;
}
function cloneSetupRegistryValue(value, seen = /* @__PURE__ */ new WeakMap()) {
	if (!value || typeof value !== "object") return value;
	const cached = seen.get(value);
	if (cached !== void 0) return cached;
	if (value instanceof Date) {
		const clone = new Date(value);
		seen.set(value, clone);
		return clone;
	}
	if (value instanceof RegExp) {
		const clone = new RegExp(value.source, value.flags);
		clone.lastIndex = value.lastIndex;
		seen.set(value, clone);
		return clone;
	}
	if (Array.isArray(value)) {
		const clone = [];
		seen.set(value, clone);
		clone.push(...value.map((entry) => cloneSetupRegistryValue(entry, seen)));
		return clone;
	}
	if (value instanceof Map) {
		const clone = /* @__PURE__ */ new Map();
		seen.set(value, clone);
		for (const [key, entry] of value.entries()) clone.set(cloneSetupRegistryValue(key, seen), cloneSetupRegistryValue(entry, seen));
		return clone;
	}
	if (value instanceof Set) {
		const clone = /* @__PURE__ */ new Set();
		seen.set(value, clone);
		for (const entry of value.values()) clone.add(cloneSetupRegistryValue(entry, seen));
		return clone;
	}
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== Object.prototype && prototype !== null) return value;
	const clone = Object.create(prototype);
	seen.set(value, clone);
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		if (!descriptor) continue;
		if ("value" in descriptor) descriptor.value = cloneSetupRegistryValue(descriptor.value, seen);
		Object.defineProperty(clone, key, descriptor);
	}
	return clone;
}
function cloneSetupRegistry(registry) {
	return cloneSetupRegistryValue(registry);
}
function loadSetupManifestRegistry(params) {
	const env = params?.env ?? process.env;
	const cacheKey = resolveSetupRegistryCacheKey(params);
	if (cacheKey !== null) {
		const cached = setupManifestRegistryCache.get(cacheKey);
		if (cached) return cached;
	}
	const registry = loadPluginManifestRegistryForPluginRegistry({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env,
		pluginIds: params?.pluginIds,
		includeDisabled: true
	});
	if (cacheKey !== null) setupManifestRegistryCache.set(cacheKey, registry);
	return registry;
}
function findUniqueSetupManifestOwner(params) {
	const matches = params.registry.plugins.filter((entry) => params.listIds(entry).some((id) => normalizeProviderId(id) === params.normalizedId));
	if (matches.length === 0) return;
	return matches.length === 1 ? matches[0] : void 0;
}
function resolveSetupRegistryForManifestOwner(record) {
	return resolvePluginSetupRegistry({ manifestRegistry: {
		plugins: [record],
		diagnostics: []
	} });
}
function mapNormalizedIds(ids) {
	const mapped = /* @__PURE__ */ new Map();
	for (const id of ids) {
		const normalized = normalizeProviderId(id);
		if (!normalized || mapped.has(normalized)) continue;
		mapped.set(normalized, id);
	}
	return mapped;
}
function pushDescriptorRuntimeDisabledDiagnostic(params) {
	if (!resolveDeclaredSetupRuntimeSource(params.record)) return;
	params.diagnostics.push({
		pluginId: params.record.id,
		code: "setup-descriptor-runtime-disabled",
		message: "setup.requiresRuntime is false, so OpenClaw ignored the plugin setup runtime entry. Remove setup-api/openclaw.setupEntry or set requiresRuntime true if setup lookup still needs plugin code."
	});
}
function pushSetupDescriptorDriftDiagnostics(params) {
	const declaredProviderIds = params.record.setup?.providers?.map((entry) => entry.id);
	if (declaredProviderIds) {
		for (const provider of params.providers) if (!declaredProviderIds.some((declaredId) => matchesProvider(provider, declaredId))) params.diagnostics.push({
			pluginId: params.record.id,
			code: "setup-descriptor-provider-runtime-undeclared",
			runtimeId: provider.id,
			message: `setup runtime registered provider "${provider.id}" but setup.providers does not declare it.`
		});
	}
	const declaredCliBackendIds = params.record.setup?.cliBackends;
	if (declaredCliBackendIds) {
		const declaredCliBackends = mapNormalizedIds(declaredCliBackendIds);
		const runtimeCliBackends = mapNormalizedIds(params.cliBackends.map((backend) => backend.id));
		for (const [normalized, declaredId] of declaredCliBackends) if (!runtimeCliBackends.has(normalized)) params.diagnostics.push({
			pluginId: params.record.id,
			code: "setup-descriptor-cli-backend-missing-runtime",
			declaredId,
			message: `setup.cliBackends declares "${declaredId}" but setup runtime did not register a matching CLI backend.`
		});
		for (const [normalized, runtimeId] of runtimeCliBackends) if (!declaredCliBackends.has(normalized)) params.diagnostics.push({
			pluginId: params.record.id,
			code: "setup-descriptor-cli-backend-runtime-undeclared",
			runtimeId,
			message: `setup runtime registered CLI backend "${runtimeId}" but setup.cliBackends does not declare it.`
		});
	}
}
function resolvePluginSetupRegistry(params) {
	const env = params?.env ?? process.env;
	const scopedPluginIds = params?.pluginIds ? new Set(normalizeUniqueStringEntries(params.pluginIds)) : null;
	if (scopedPluginIds && scopedPluginIds.size === 0) return {
		providers: [],
		cliBackends: [],
		configMigrations: [],
		autoEnableProbes: [],
		diagnostics: []
	};
	const resultCacheKey = params?.manifestRegistry ? null : resolveSetupRegistryCacheKey(params);
	if (resultCacheKey !== null) {
		const cached = pluginSetupRegistryCache.get(resultCacheKey);
		if (cached) return cloneSetupRegistry(cached);
	}
	const providers = [];
	const cliBackends = [];
	const configMigrations = [];
	const autoEnableProbes = [];
	const diagnostics = [];
	let providerKeys = /* @__PURE__ */ new Set();
	let cliBackendKeys = /* @__PURE__ */ new Set();
	const manifestRegistry = params?.manifestRegistry ?? loadSetupManifestRegistry({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env,
		pluginIds: params?.pluginIds
	});
	for (const record of manifestRegistry.plugins) {
		if (scopedPluginIds && !scopedPluginIds.has(record.id)) continue;
		if (record.setup?.requiresRuntime === false) {
			pushDescriptorRuntimeDisabledDiagnostic({
				record,
				diagnostics
			});
			continue;
		}
		const setupRegistration = resolveSetupRegistration(record, diagnostics);
		if (!setupRegistration) continue;
		const recordProviders = [];
		const recordCliBackends = [];
		const recordConfigMigrations = [];
		const recordAutoEnableProbes = [];
		const recordProviderKeys = new Set(providerKeys);
		const recordCliBackendKeys = new Set(cliBackendKeys);
		let acceptingRegistrations = true;
		const api = buildSetupPluginApi({
			record,
			setupSource: setupRegistration.setupSource,
			handlers: {
				registerProvider(provider) {
					const key = `${record.id}:${normalizeProviderId(provider.id)}`;
					if (!acceptingRegistrations || recordProviderKeys.has(key)) return;
					recordProviderKeys.add(key);
					recordProviders.push({
						pluginId: record.id,
						provider
					});
				},
				registerCliBackend(backend) {
					const key = `${record.id}:${normalizeProviderId(backend.id)}`;
					if (!acceptingRegistrations || recordCliBackendKeys.has(key)) return;
					recordCliBackendKeys.add(key);
					recordCliBackends.push({
						pluginId: record.id,
						backend
					});
				},
				registerConfigMigration(migrate) {
					if (!acceptingRegistrations) return;
					recordConfigMigrations.push({
						pluginId: record.id,
						migrate
					});
				},
				registerAutoEnableProbe(probe) {
					if (!acceptingRegistrations) return;
					recordAutoEnableProbes.push({
						pluginId: record.id,
						probe
					});
				}
			}
		});
		const registered = runSetupRegistration(setupRegistration.register, api, (error) => {
			diagnostics.push({
				pluginId: record.id,
				code: "setup-registration-failed",
				message: `setup registration threw: ${String(error)}`
			});
		});
		acceptingRegistrations = false;
		if (!registered) continue;
		providers.push(...recordProviders);
		cliBackends.push(...recordCliBackends);
		configMigrations.push(...recordConfigMigrations);
		autoEnableProbes.push(...recordAutoEnableProbes);
		providerKeys = recordProviderKeys;
		cliBackendKeys = recordCliBackendKeys;
		pushSetupDescriptorDriftDiagnostics({
			record,
			providers: recordProviders.map((entry) => entry.provider),
			cliBackends: recordCliBackends.map((entry) => entry.backend),
			diagnostics
		});
	}
	const registry = {
		providers,
		cliBackends,
		configMigrations,
		autoEnableProbes,
		diagnostics
	};
	for (const diagnostic of diagnostics) log.warn(`plugin setup [${diagnostic.pluginId}] ${diagnostic.code}: ${diagnostic.message}`);
	if (resultCacheKey === null) return registry;
	pluginSetupRegistryCache.set(resultCacheKey, cloneSetupRegistry(registry));
	return registry;
}
function resolvePluginSetupProviderCore(params) {
	const env = params.env ?? process.env;
	const normalizedProvider = normalizeProviderId(params.provider);
	const record = findUniqueSetupManifestOwner({
		registry: loadSetupManifestRegistry({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env,
			pluginIds: params.pluginIds
		}),
		normalizedId: normalizedProvider,
		listIds: listSetupProviderIds
	});
	if (!record) return;
	return resolveSetupRegistryForManifestOwner(record).providers.findLast((entry) => matchesProvider(entry.provider, normalizedProvider))?.provider;
}
function resolvePluginSetupCliBackend(params) {
	const normalized = normalizeProviderId(params.backend);
	const env = params.env ?? process.env;
	const record = findUniqueSetupManifestOwner({
		registry: loadSetupManifestRegistry({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env
		}),
		normalizedId: normalized,
		listIds: listSetupCliBackendIds
	});
	if (!record) return;
	return resolveSetupRegistryForManifestOwner(record).cliBackends.find((entry) => normalizeProviderId(entry.backend.id) === normalized);
}
function runPluginSetupConfigMigrations(params) {
	let next = params.config;
	const changes = [];
	const pluginIds = resolveRelevantSetupMigrationPluginIds(params);
	if (pluginIds.length === 0) return {
		config: next,
		changes
	};
	for (const entry of resolvePluginSetupRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds
	}).configMigrations) {
		const migration = entry.migrate(next);
		if (!migration || migration.changes.length === 0) continue;
		next = migration.config;
		changes.push(...migration.changes);
	}
	return {
		config: next,
		changes
	};
}
function resolvePluginSetupAutoEnableReasons(params) {
	const env = params.env ?? process.env;
	const reasons = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of resolvePluginSetupRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		pluginIds: params.pluginIds,
		manifestRegistry: params.manifestRegistry
	}).autoEnableProbes) {
		const raw = entry.probe({
			config: params.config,
			env
		});
		const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
		for (const reason of values) {
			const normalized = reason.trim();
			if (!normalized) continue;
			const key = `${entry.pluginId}:${normalized}`;
			if (seen.has(key)) continue;
			seen.add(key);
			reasons.push({
				pluginId: entry.pluginId,
				reason: normalized
			});
		}
	}
	return reasons;
}
//#endregion
export { runPluginSetupConfigMigrations as a, resolvePluginSetupRegistry as i, resolvePluginSetupCliBackend as n, resolvePluginSetupProviderCore as r, resolvePluginSetupAutoEnableReasons as t };
