import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { F as resolvePluginRegistryLoadCacheKey, n as loadPluginRegistryHandle } from "./loader-D0AfkRZe.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { a as getMemoryRuntime, g as resolveMemoryCapabilityRegistration, y as setStandaloneMemoryManagerActive } from "./memory-state-B_83SJ8T.js";
//#region src/plugins/memory-runtime.ts
let standaloneMemoryRegistrySlot;
const registeredMemoryManagerAdapters = /* @__PURE__ */ new WeakMap();
function normalizeRegisteredMemoryReadResult(result) {
	if (result.status === "ok" || result.status === "not_found") return result;
	return {
		...result,
		status: "ok"
	};
}
function normalizeRegisteredMemoryManager(manager) {
	const existing = registeredMemoryManagerAdapters.get(manager);
	if (existing) return existing;
	const readFile = async (params) => normalizeRegisteredMemoryReadResult(await manager.readFile(params));
	const adapter = new Proxy(manager, { get(target, property) {
		if (property === "readFile") return readFile;
		const value = Reflect.get(target, property, target);
		if (typeof value !== "function") return value;
		return value.bind(target);
	} });
	registeredMemoryManagerAdapters.set(manager, adapter);
	return adapter;
}
/** Resolves the configured memory slot to the single runtime plugin that may load memory. */
function resolveMemoryRuntimePluginIds(config) {
	const plugins = normalizePluginsConfig(config.plugins);
	const memorySlot = plugins.slots.memory;
	if (!plugins.enabled || typeof memorySlot !== "string" || memorySlot.trim().length === 0) return [];
	const pluginId = memorySlot.trim();
	if (plugins.deny.includes(pluginId) || plugins.entries[pluginId]?.enabled === false) return [];
	return [pluginId];
}
function resolveMemoryRuntimeWorkspaceDir(cfg, agentId) {
	const dir = resolveAgentWorkspaceDir(cfg, agentId);
	if (typeof dir !== "string" || !dir.trim()) return;
	return resolveUserPath(dir);
}
function resolveMemoryRuntimeFromRegistry(registry) {
	return resolveMemoryCapabilityRegistration(registry.memoryCapabilities)?.capability.runtime;
}
function listCurrentMemoryRuntimeOwners() {
	const current = getMemoryRuntime();
	const owners = /* @__PURE__ */ new Map();
	for (const [runtime, registry] of standaloneMemoryRegistrySlot?.retiredRuntimes ?? []) owners.set(runtime, {
		runtime,
		registry
	});
	if (current) owners.set(current, { runtime: current });
	if (standaloneMemoryRegistrySlot) {
		const runtime = resolveMemoryRuntimeFromRegistry(standaloneMemoryRegistrySlot.registry);
		if (runtime) owners.set(runtime, {
			runtime,
			registry: standaloneMemoryRegistrySlot.registry
		});
	}
	return [...owners.values()];
}
function withMemoryRuntimeOwner(owner, run) {
	return withPluginRuntimeRegistryScope(owner.registry, () => run(owner.runtime));
}
function ensureMemoryRuntime(params) {
	const current = getMemoryRuntime();
	if (current || !params) return current ? { runtime: current } : void 0;
	const onlyPluginIds = resolveMemoryRuntimePluginIds(params.cfg);
	if (onlyPluginIds.length === 0) return;
	const workspaceDir = resolveMemoryRuntimeWorkspaceDir(params.cfg, params.agentId);
	const loadOptions = {
		config: params.cfg,
		onlyPluginIds,
		workspaceDir,
		activate: false
	};
	const key = resolvePluginRegistryLoadCacheKey(loadOptions);
	if (standaloneMemoryRegistrySlot?.key === key) {
		const runtime = resolveMemoryRuntimeFromRegistry(standaloneMemoryRegistrySlot.registry);
		return runtime ? {
			runtime,
			registry: standaloneMemoryRegistrySlot.registry
		} : void 0;
	}
	const registry = loadPluginRegistryHandle(loadOptions);
	if (!registry) return;
	const runtime = resolveMemoryRuntimeFromRegistry(registry);
	const previousSlot = standaloneMemoryRegistrySlot;
	const retiredRuntimes = new Map(previousSlot?.retiredRuntimes);
	const previousRuntime = previousSlot ? resolveMemoryRuntimeFromRegistry(previousSlot.registry) : void 0;
	if (previousSlot && previousRuntime && previousRuntime !== runtime) retiredRuntimes.set(previousRuntime, previousSlot.registry);
	standaloneMemoryRegistrySlot = {
		key,
		registry,
		retiredRuntimes
	};
	return runtime ? {
		runtime,
		registry
	} : void 0;
}
/** Returns the active plugin-backed memory search manager for an agent. */
async function getActiveMemorySearchManagerCore(params) {
	const owner = ensureMemoryRuntime(params);
	if (!owner) return {
		manager: null,
		error: "memory plugin unavailable"
	};
	if (owner.registry) setStandaloneMemoryManagerActive(true);
	const result = await withMemoryRuntimeOwner(owner, async (runtime) => await runtime.getMemorySearchManager(params));
	return {
		...result,
		manager: result.manager ? normalizeRegisteredMemoryManager(result.manager) : null
	};
}
/** Applies the selected memory plugin's authorization policy to raw search hits. */
async function authorizeActiveMemorySearchHits(params) {
	const owner = ensureMemoryRuntime(params);
	if (!owner) return params.hits.filter((hit) => hit.source !== "sessions");
	return await withMemoryRuntimeOwner(owner, async (runtime) => {
		if (!runtime.authorizeSearchHits) return params.hits.filter((hit) => hit.source !== "sessions");
		return await runtime.authorizeSearchHits(params);
	});
}
/** Classifies workspace memory paths through the selected memory plugin's provenance owner. */
async function classifyActiveMemoryWorkspacePaths(params) {
	const owner = ensureMemoryRuntime(params);
	if (!owner) return { status: "unavailable" };
	if (!owner.runtime.classifyWorkspaceMemoryPaths) return { status: "unsupported" };
	return {
		status: "classified",
		classifications: await withMemoryRuntimeOwner(owner, async (runtime) => await runtime.classifyWorkspaceMemoryPaths(params))
	};
}
/** Resolves current memory backend config without constructing a manager. */
function resolveActiveMemoryBackendConfig(params) {
	const owner = ensureMemoryRuntime(params);
	return owner ? withMemoryRuntimeOwner(owner, (runtime) => runtime.resolveMemoryBackendConfig(params)) : null;
}
/** Closes all active plugin-backed memory search managers. */
async function closeActiveMemorySearchManagersCore(cfg) {
	await Promise.all(listCurrentMemoryRuntimeOwners().map((owner) => withMemoryRuntimeOwner(owner, async (runtime) => {
		await runtime.closeAllMemorySearchManagers?.();
	})));
	standaloneMemoryRegistrySlot?.retiredRuntimes.clear();
	setStandaloneMemoryManagerActive(false);
}
/** Closes the plugin-backed memory search manager for one agent. */
async function closeActiveMemorySearchManagerCore(params) {
	await Promise.all(listCurrentMemoryRuntimeOwners().map((owner) => withMemoryRuntimeOwner(owner, async (runtime) => {
		await runtime.closeMemorySearchManager?.(params);
	})));
}
function resetStandaloneMemoryRegistrySlot() {
	standaloneMemoryRegistrySlot = void 0;
	setStandaloneMemoryManagerActive(false);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.memoryRuntimeTestApi")] = { resetStandaloneMemoryRegistrySlot };
//#endregion
export { getActiveMemorySearchManagerCore as a, closeActiveMemorySearchManagersCore as i, classifyActiveMemoryWorkspacePaths as n, resolveActiveMemoryBackendConfig as o, closeActiveMemorySearchManagerCore as r, authorizeActiveMemorySearchHits as t };
