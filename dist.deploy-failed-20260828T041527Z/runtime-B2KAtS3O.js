import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton, t as drainGlobalSingletonLifecycleState } from "./global-singleton-Dc_stLtU.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.js";
import "./runtime-state-B4nZOuAi.js";
import { u as onAgentEvent } from "./agent-events-CcZImb5w.js";
import { c as markPluginRegistryActive, l as markPluginRegistryRetired, s as isPluginRegistryRetired } from "./registry-lifecycle-DYhl0RY-.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { a as getActivePluginChannelRegistrySnapshotFromState } from "./registry-lookup-DLP3NSyt.js";
import { a as listLoadedChannelPluginsForRegistry } from "./registry-loaded-Dbglb2uR.js";
import { t as createEmptyPluginRegistry } from "./registry-empty-55wlVNzO.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/command-execution-lock.ts
/** Per-registry command execution admission and retirement drain. */
const executionStates = /* @__PURE__ */ new WeakMap();
const executionContext = new AsyncLocalStorage();
function getExecutionState(registry) {
	const existing = executionStates.get(registry);
	if (existing) return existing;
	const created = {
		count: 0,
		waiters: []
	};
	executionStates.set(registry, created);
	return created;
}
function getPluginCommandExecutionCount(registry) {
	return executionStates.get(registry)?.count ?? 0;
}
function beginPluginCommandExecution(registry) {
	if (isPluginRegistryRetired(registry)) return false;
	getExecutionState(registry).count += 1;
	return true;
}
function endPluginCommandExecution(registry) {
	const state = getExecutionState(registry);
	if (state.count <= 0) throw new Error("Plugin command execution lock is unbalanced.");
	state.count -= 1;
	if (state.count !== 0) return;
	const waiters = state.waiters.splice(0);
	for (const resolve of waiters) resolve();
}
function isPluginCommandExecutionActiveHere(registry) {
	return [...executionContext.getStore() ?? []].some((token) => token.registry === registry && token.active);
}
async function withPluginCommandExecution(registry, run) {
	if (!beginPluginCommandExecution(registry)) return { admitted: false };
	const token = {
		registry,
		active: true
	};
	const active = new Set([...executionContext.getStore() ?? []].filter((inherited) => inherited.registry !== registry));
	active.add(token);
	try {
		return {
			admitted: true,
			value: await executionContext.run(active, run)
		};
	} finally {
		token.active = false;
		endPluginCommandExecution(registry);
	}
}
async function waitForPluginCommandExecutions(registry) {
	const state = getExecutionState(registry);
	if (state.count === 0) return;
	await new Promise((resolve) => {
		state.waiters.push(resolve);
	});
}
//#endregion
//#region src/plugins/host-hook-cleanup-timeout.ts
/** Max time allowed for plugin host cleanup hooks before failing shutdown. */
const PLUGIN_HOST_CLEANUP_TIMEOUT_MS = 5e3;
/** Runs plugin host cleanup with a bounded timeout and clears the timer afterward. */
async function withPluginHostCleanupTimeout(hookId, cleanup) {
	let timeout;
	try {
		return await Promise.race([Promise.resolve().then(cleanup), new Promise((_, reject) => {
			timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`plugin host cleanup timed out: ${hookId}`));
			}, PLUGIN_HOST_CLEANUP_TIMEOUT_MS);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
//#endregion
//#region src/plugins/host-hook-runtime.ts
/** Stores plugin host-hook run context, scheduler jobs, and pending event cleanup state. */
const PLUGIN_HOST_RUNTIME_STATE_KEY = Symbol.for("openclaw.pluginHostRuntimeState");
const TRACKED_RUN_IDS_MAX = 512;
const PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS = 5e3;
const log$1 = createSubsystemLogger("plugins/host-hooks");
function getPluginHostRuntimeState() {
	return resolveGlobalSingleton(PLUGIN_HOST_RUNTIME_STATE_KEY, () => ({
		runContextByRunId: /* @__PURE__ */ new Map(),
		schedulerJobsByPlugin: /* @__PURE__ */ new Map(),
		nextSchedulerJobGeneration: 1,
		pendingAgentEventHandlersByRunId: /* @__PURE__ */ new Map(),
		closedRunIds: /* @__PURE__ */ new Set(),
		terminalEventCleanupExpiredRunIds: /* @__PURE__ */ new Set()
	}));
}
function normalizeNamespace(value) {
	return (value ?? "").trim();
}
function copyJsonValue(value) {
	return structuredClone(value);
}
function rememberBoundedRunId(runIds, runId) {
	runIds.delete(runId);
	runIds.add(runId);
	while (runIds.size > TRACKED_RUN_IDS_MAX) {
		const oldest = runIds.values().next().value;
		if (oldest === void 0) break;
		runIds.delete(oldest);
	}
}
function markPluginRunClosed(runId) {
	rememberBoundedRunId(getPluginHostRuntimeState().closedRunIds, runId);
}
function isPluginRunClosed(runId) {
	return getPluginHostRuntimeState().closedRunIds.has(runId);
}
function markTerminalEventCleanupExpired(runId) {
	rememberBoundedRunId(getPluginHostRuntimeState().terminalEventCleanupExpiredRunIds, runId);
}
function isTerminalEventCleanupExpired(runId) {
	return getPluginHostRuntimeState().terminalEventCleanupExpiredRunIds.has(runId);
}
function trackAgentEventHandler(runId, pending) {
	const state = getPluginHostRuntimeState();
	const handlers = state.pendingAgentEventHandlersByRunId.get(runId) ?? /* @__PURE__ */ new Set();
	handlers.add(pending);
	state.pendingAgentEventHandlersByRunId.set(runId, handlers);
	pending.finally(() => {
		handlers.delete(pending);
		if (handlers.size === 0 && getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.get(runId) === handlers) state.pendingAgentEventHandlersByRunId.delete(runId);
	});
}
async function waitForLiveTerminalEventHandlers(runId) {
	for (;;) {
		const pendingHandlers = getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.get(runId);
		if (!pendingHandlers || pendingHandlers.size === 0) return "settled";
		await Promise.allSettled(pendingHandlers);
	}
}
function waitForTerminalEventHandlers(params) {
	const { runId } = params;
	let timeout;
	const settled = waitForLiveTerminalEventHandlers(runId);
	const timedOut = new Promise((resolve) => {
		timeout = setTimeout(() => {
			markTerminalEventCleanupExpired(runId);
			getPluginHostRuntimeState().pendingAgentEventHandlersByRunId.delete(runId);
			log$1.warn(`plugin terminal agent event subscriptions still running after ${PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS}ms; clearing run context without waiting for them to settle`);
			resolve("timeout");
		}, PLUGIN_TERMINAL_EVENT_CLEANUP_WAIT_MS);
	});
	if (timeout) timeout.unref?.();
	return Promise.race([settled, timedOut]).then(() => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = void 0;
		}
	});
}
function getPluginRunContextNamespaces(params) {
	const state = getPluginHostRuntimeState();
	let byPlugin = state.runContextByRunId.get(params.runId);
	if (!byPlugin && params.create) {
		byPlugin = /* @__PURE__ */ new Map();
		state.runContextByRunId.set(params.runId, byPlugin);
	}
	if (!byPlugin) return;
	let namespaces = byPlugin.get(params.pluginId);
	if (!namespaces && params.create) {
		namespaces = /* @__PURE__ */ new Map();
		byPlugin.set(params.pluginId, namespaces);
	}
	return namespaces;
}
/** Stores JSON-compatible plugin run context for one run/plugin/namespace tuple. */
function setPluginRunContext(params) {
	const runId = normalizeOptionalString(params.patch.runId);
	const namespace = normalizeNamespace(params.patch.namespace);
	if (!runId || !namespace) return false;
	if (!params.allowClosedRun && isPluginRunClosed(runId)) return false;
	if (params.patch.unset === true) {
		clearPluginRunContext({
			pluginId: params.pluginId,
			runId,
			namespace
		});
		return true;
	}
	if (params.patch.value === void 0) return false;
	if (!isPluginJsonValue(params.patch.value)) return false;
	getPluginRunContextNamespaces({
		runId,
		pluginId: params.pluginId,
		create: true
	})?.set(namespace, copyJsonValue(params.patch.value));
	return true;
}
/** Reads previously stored plugin run context for one run/plugin/namespace tuple. */
function getPluginRunContext(params) {
	const runId = normalizeOptionalString(params.get.runId);
	const namespace = normalizeNamespace(params.get.namespace);
	if (!runId || !namespace) return;
	const value = getPluginRunContextNamespaces({
		runId,
		pluginId: params.pluginId
	})?.get(namespace);
	return value === void 0 ? void 0 : copyJsonValue(value);
}
function clearPluginRunContext(params) {
	const normalizedNamespace = params.namespace !== void 0 ? normalizeNamespace(params.namespace) : void 0;
	const namespaceFilter = normalizedNamespace !== void 0 && normalizedNamespace !== "" ? normalizedNamespace : void 0;
	const state = getPluginHostRuntimeState();
	const runIds = params.runId ? [params.runId] : [...state.runContextByRunId.keys()];
	for (const runId of runIds) {
		const byPlugin = state.runContextByRunId.get(runId);
		if (!byPlugin) continue;
		const pluginIds = params.pluginId ? [params.pluginId] : [...byPlugin.keys()];
		for (const pluginId of pluginIds) {
			const namespaces = byPlugin.get(pluginId);
			if (!namespaces) continue;
			if (namespaceFilter !== void 0) namespaces.delete(namespaceFilter);
			else namespaces.clear();
			if (namespaces.size === 0) byPlugin.delete(pluginId);
		}
		if (byPlugin.size === 0) state.runContextByRunId.delete(runId);
	}
	if (params.runId && !params.pluginId && namespaceFilter === void 0) state.pendingAgentEventHandlersByRunId.delete(params.runId);
}
function isTerminalAgentRunEvent(event) {
	const phase = event.data?.phase;
	return event.stream === "lifecycle" && (phase === "end" || phase === "error");
}
function logAgentEventSubscriptionFailure(params) {
	log$1.warn(`plugin agent event subscription failed: plugin=${params.pluginId} subscription=${params.subscriptionId} error=${String(params.error)}`);
}
function dispatchPluginAgentEventSubscriptions(params) {
	const subscriptions = params.registry?.agentEventSubscriptions ?? [];
	const pendingHandlers = [];
	const isTerminalEvent = isTerminalAgentRunEvent(params.event);
	for (const registration of subscriptions) {
		const streams = registration.subscription.streams;
		if (streams && streams.length > 0 && !streams.includes(params.event.stream)) continue;
		const pluginId = registration.pluginId;
		const runId = params.event.runId;
		let handlerActive = true;
		const ctx = {
			getRunContext: ((namespace) => params.isLive() ? getPluginRunContext({
				pluginId,
				get: {
					runId,
					namespace
				}
			}) : void 0),
			setRunContext: (namespace, value) => {
				if (!params.isLive()) return;
				setPluginRunContext({
					pluginId,
					patch: {
						runId,
						namespace,
						value
					},
					allowClosedRun: isTerminalEvent && handlerActive && !isTerminalEventCleanupExpired(runId)
				});
			},
			clearRunContext: (namespace) => {
				if (!params.isLive()) return;
				clearPluginRunContext({
					pluginId,
					runId,
					namespace
				});
			}
		};
		try {
			const pending = Promise.resolve(registration.subscription.handle(structuredClone(params.event), ctx)).catch((error) => {
				logAgentEventSubscriptionFailure({
					pluginId,
					subscriptionId: registration.subscription.id,
					error
				});
			}).finally(() => {
				handlerActive = false;
			});
			trackAgentEventHandler(runId, pending);
			pendingHandlers.push(pending);
		} catch (error) {
			handlerActive = false;
			logAgentEventSubscriptionFailure({
				pluginId,
				subscriptionId: registration.subscription.id,
				error
			});
		}
	}
	if (isTerminalEvent) {
		markPluginRunClosed(params.event.runId);
		waitForTerminalEventHandlers({ runId: params.event.runId }).then(() => {
			clearPluginRunContext({ runId: params.event.runId });
		});
	}
}
function registerPluginSessionSchedulerJob(params) {
	const id = normalizeOptionalString(params.job.id);
	const sessionKey = normalizeOptionalString(params.job.sessionKey);
	const kind = normalizeOptionalString(params.job.kind);
	if (!id || !sessionKey || !kind) return;
	const state = getPluginHostRuntimeState();
	const jobs = state.schedulerJobsByPlugin.get(params.pluginId) ?? /* @__PURE__ */ new Map();
	const generation = state.nextSchedulerJobGeneration++;
	jobs.set(id, {
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		job: {
			...params.job,
			id,
			sessionKey,
			kind
		},
		generation,
		...params.ownerRegistry ? { ownerRegistry: params.ownerRegistry } : {}
	});
	state.schedulerJobsByPlugin.set(params.pluginId, jobs);
	return {
		id,
		pluginId: params.pluginId,
		sessionKey,
		kind
	};
}
function deletePluginSessionSchedulerJob(params) {
	const state = getPluginHostRuntimeState();
	const jobs = state.schedulerJobsByPlugin.get(params.pluginId);
	const record = jobs?.get(params.jobId);
	if (!jobs || !record) return;
	if (params.sessionKey && record.job.sessionKey !== params.sessionKey) return;
	if (params.expectedGeneration !== void 0 && record.generation !== params.expectedGeneration) return;
	jobs.delete(params.jobId);
	if (jobs.size === 0) state.schedulerJobsByPlugin.delete(params.pluginId);
}
function hasPluginSessionSchedulerJob(params) {
	const record = getPluginHostRuntimeState().schedulerJobsByPlugin.get(params.pluginId)?.get(params.jobId);
	if (!record) return false;
	if (params.sessionKey && record.job.sessionKey !== params.sessionKey) return false;
	return params.generation === void 0 || record.generation === params.generation;
}
function getPluginSessionSchedulerJobGeneration(params) {
	const record = getPluginHostRuntimeState().schedulerJobsByPlugin.get(params.pluginId)?.get(params.jobId);
	if (!record) return;
	if (params.sessionKey && record.job.sessionKey !== params.sessionKey) return;
	return record.generation;
}
function makePluginSessionSchedulerJobKey(pluginId, jobId) {
	return JSON.stringify([pluginId, jobId]);
}
async function cleanupPluginSessionSchedulerJobs(params) {
	const state = getPluginHostRuntimeState();
	const failures = [];
	const shouldCleanup = params.shouldCleanup ?? (() => true);
	if (!shouldCleanup()) return failures;
	const registryRecordKeys = /* @__PURE__ */ new Set();
	const schedulerJobKey = (pluginId, jobId, sessionKey) => `${pluginId}\0${jobId}\0${sessionKey}`;
	if (params.records) for (const record of params.records) {
		if (!shouldCleanup()) return failures;
		if (params.pluginId && record.pluginId !== params.pluginId) continue;
		const jobId = normalizeOptionalString(record.job.id);
		const sessionKey = normalizeOptionalString(record.job.sessionKey);
		if (!jobId || !sessionKey) continue;
		if (params.sessionKey && sessionKey !== params.sessionKey) continue;
		registryRecordKeys.add(schedulerJobKey(record.pluginId, jobId, sessionKey));
		const liveGeneration = getPluginSessionSchedulerJobGeneration({
			pluginId: record.pluginId,
			jobId,
			sessionKey
		});
		if (record.generation !== void 0 && liveGeneration === void 0) continue;
		if (record.generation === void 0 && !hasPluginSessionSchedulerJob({
			pluginId: record.pluginId,
			jobId,
			sessionKey
		})) continue;
		if (params.preserveJobIds?.has(jobId) ?? false) continue;
		const hookId = `scheduler:${jobId}`;
		try {
			await withPluginHostCleanupTimeout(hookId, () => record.job.cleanup?.({
				reason: params.reason,
				sessionKey,
				jobId
			}));
		} catch (error) {
			failures.push({
				pluginId: record.pluginId,
				hookId,
				error
			});
			continue;
		}
		if (!shouldCleanup()) continue;
		deletePluginSessionSchedulerJob({
			pluginId: record.pluginId,
			jobId,
			sessionKey,
			expectedGeneration: record.generation
		});
	}
	const pluginIds = params.pluginId ? [params.pluginId] : [...state.schedulerJobsByPlugin.keys()];
	for (const pluginId of pluginIds) {
		if (!shouldCleanup()) return failures;
		const jobs = state.schedulerJobsByPlugin.get(pluginId);
		if (!jobs) continue;
		for (const [jobId, record] of jobs.entries()) {
			if (!shouldCleanup()) return failures;
			if (params.sessionKey && record.job.sessionKey !== params.sessionKey) continue;
			if (params.cleanupOwnerRegistry !== void 0 && record.ownerRegistry !== params.cleanupOwnerRegistry) continue;
			if (registryRecordKeys.has(schedulerJobKey(pluginId, jobId, record.job.sessionKey))) continue;
			if (params.preserveOwnerRegistry !== void 0 && record.ownerRegistry === params.preserveOwnerRegistry) continue;
			if (params.excludeJobKeys?.has(makePluginSessionSchedulerJobKey(pluginId, jobId))) continue;
			if (params.preserveJobIds?.has(jobId)) continue;
			const hookId = `scheduler:${jobId}`;
			try {
				await withPluginHostCleanupTimeout(hookId, () => record.job.cleanup?.({
					reason: params.reason,
					sessionKey: record.job.sessionKey,
					jobId
				}));
			} catch (error) {
				failures.push({
					pluginId,
					hookId,
					error
				});
				continue;
			}
			if (!shouldCleanup()) continue;
			jobs.delete(jobId);
		}
		if (jobs.size === 0) state.schedulerJobsByPlugin.delete(pluginId);
	}
	return failures;
}
function clearPluginHostRuntimeState(params) {
	clearPluginRunContext(params ?? {});
	if (params?.pluginId) getPluginHostRuntimeState().schedulerJobsByPlugin.delete(params.pluginId);
	else if (!params?.runId) {
		const state = getPluginHostRuntimeState();
		state.schedulerJobsByPlugin.clear();
		state.pendingAgentEventHandlersByRunId.clear();
		state.closedRunIds.clear();
		state.terminalEventCleanupExpiredRunIds.clear();
	}
}
//#endregion
//#region src/plugins/prepared-message-tool-catalog.ts
/** Registry-owned message-tool metadata prepared once per channel registry generation. */
const catalogsByRegistry = /* @__PURE__ */ new WeakMap();
const latestCatalogByRegistry = /* @__PURE__ */ new WeakMap();
function selectedRegistry(snapshot) {
	return snapshot.registry ?? void 0;
}
/** Settles the catalog after the process-root registry changes. */
function settlePreparedMessageToolCatalog(preparedRegistry, preparedVersion) {
	const snapshot = preparedRegistry && preparedVersion !== void 0 ? void 0 : getActivePluginChannelRegistrySnapshotFromState();
	const registry = preparedRegistry ?? (snapshot ? selectedRegistry(snapshot) : void 0);
	if (!registry) return;
	const version = preparedVersion ?? snapshot?.version ?? 0;
	let catalogs = catalogsByRegistry.get(registry);
	const existing = catalogs?.get(version);
	if (existing) return existing;
	const channels = Object.freeze(listLoadedChannelPluginsForRegistry(registry).map((plugin) => Object.freeze({
		id: plugin.id,
		...plugin.actions ? { actions: plugin.actions } : {},
		reconcilesUnknownSend: plugin.message?.durableFinal?.capabilities?.reconcileUnknownSend === true && typeof plugin.message.durableFinal.reconcileUnknownSend === "function"
	})));
	const byId = new Map(channels.map((entry) => [entry.id, entry]));
	const catalog = Object.freeze({
		version,
		channels,
		getChannel: (id) => byId.get(id)
	});
	if (!catalogs) {
		catalogs = /* @__PURE__ */ new Map();
		catalogsByRegistry.set(registry, catalogs);
	}
	catalogs.set(version, catalog);
	latestCatalogByRegistry.set(registry, catalog);
	return catalog;
}
/** Returns the catalog for the active channel generation without rebuilding it. */
function getPreparedMessageToolCatalog() {
	const snapshot = getActivePluginChannelRegistrySnapshotFromState();
	const registry = selectedRegistry(snapshot);
	if (!registry) return;
	return catalogsByRegistry.get(registry)?.get(snapshot.version);
}
/** Returns the catalog settled for one exact runtime registry generation. */
function getPreparedMessageToolCatalogForRegistry(registry) {
	return latestCatalogByRegistry.get(registry);
}
//#endregion
//#region src/plugins/runtime.ts
const log = createSubsystemLogger("plugins/runtime");
function asPluginRegistry(registry) {
	return registry;
}
const state = (() => {
	const globalState = globalThis;
	let registryState = globalState[PLUGIN_REGISTRY_STATE];
	if (!registryState) {
		registryState = {
			activeRegistry: null,
			activeVersion: 0,
			agentEventBridgeUnsubscribe: void 0,
			key: null,
			workspaceDir: null,
			runtimeSubagentMode: "default",
			importedPluginIds: /* @__PURE__ */ new Set()
		};
		globalState[PLUGIN_REGISTRY_STATE] = registryState;
	}
	return registryState;
})();
function registryHasPluginHostCleanupWork(registry) {
	if (!registry) return false;
	return registry.plugins.some((plugin) => plugin.status === "loaded") || registry.sessionExtensions.length > 0 || registry.runtimeLifecycles.length > 0 || registry.agentEventSubscriptions.length > 0 || registry.sessionSchedulerJobs.length > 0;
}
function isRegistryLive(registry) {
	return state.activeRegistry === registry;
}
const loadPluginHostCleanupRuntime = createLazyRuntimeModule(async () => {
	const [{ getRuntimeConfig }, { cleanupReplacedPluginHostRegistry }] = await Promise.all([import("./config/config.js"), import("./host-hook-cleanup-BYhS1eCR.js")]);
	return {
		getRuntimeConfig,
		cleanupReplacedPluginHostRegistry
	};
});
async function cleanupPreviousPluginHostRegistry(params) {
	const { getRuntimeConfig, cleanupReplacedPluginHostRegistry } = await loadPluginHostCleanupRuntime();
	const nextRegistry = asPluginRegistry(state.activeRegistry);
	if (nextRegistry === params.previousRegistry) return;
	const shouldCleanup = () => state.activeRegistry !== params.previousRegistry;
	const { failures } = await cleanupReplacedPluginHostRegistry({
		cfg: getRuntimeConfig(),
		previousRegistry: params.previousRegistry,
		nextRegistry,
		shouldCleanup
	});
	for (const failure of failures) log.warn(`plugin host cleanup failed for ${failure.pluginId} hook ${failure.hookId}: ${String(failure.error)}`);
}
function cleanupRetiredPluginHostRegistry(previousRegistry) {
	if (!registryHasPluginHostCleanupWork(previousRegistry)) return;
	const cleanup = () => cleanupPreviousPluginHostRegistry({ previousRegistry }).catch((error) => {
		log.warn(`plugin host registry cleanup failed: ${String(error)}`);
	});
	if (getPluginCommandExecutionCount(previousRegistry) > 0) {
		waitForPluginCommandExecutions(previousRegistry).then(cleanup);
		return;
	}
	cleanup();
}
function retirePluginRegistryIfUnused(registry) {
	if (!registry || isRegistryLive(registry)) return false;
	markPluginRegistryRetired(registry);
	return true;
}
function syncPluginAgentEventBridge() {
	state.agentEventBridgeUnsubscribe?.();
	state.agentEventBridgeUnsubscribe = void 0;
	const registry = asPluginRegistry(state.activeRegistry);
	if (!registry) return;
	const version = state.activeVersion;
	state.agentEventBridgeUnsubscribe = onAgentEvent((event) => {
		dispatchPluginAgentEventSubscriptions({
			registry,
			event,
			isLive: () => state.activeRegistry === registry && state.activeVersion === version
		});
	});
}
function recordImportedPluginId(pluginId) {
	state.importedPluginIds.add(pluginId);
}
function setActivePluginRegistry(registry, cacheKey, runtimeSubagentMode = "default", workspaceDir) {
	installActivePluginRegistry({
		registry,
		key: cacheKey ?? null,
		runtimeSubagentMode,
		workspaceDir: workspaceDir ?? null
	});
}
function stageActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir) {
	installActivePluginRegistry({
		registry,
		key: cacheKey,
		runtimeSubagentMode,
		workspaceDir: workspaceDir ?? null,
		retirePrevious: false
	});
}
function commitStagedPluginRegistry(previousRegistry, registry) {
	if (state.activeRegistry !== registry || !retirePluginRegistryIfUnused(previousRegistry)) return;
	cleanupRetiredPluginHostRegistry(previousRegistry);
}
function captureActivePluginRegistrySnapshot() {
	return {
		activeRegistry: state.activeRegistry,
		key: state.key,
		runtimeSubagentMode: state.runtimeSubagentMode,
		workspaceDir: state.workspaceDir
	};
}
function restoreActivePluginRegistrySnapshot(snapshot) {
	installActivePluginRegistry({
		registry: snapshot.activeRegistry,
		key: snapshot.key,
		runtimeSubagentMode: snapshot.runtimeSubagentMode,
		workspaceDir: snapshot.workspaceDir
	});
}
/** Rolls back a staged registry without reactivating the prior committed generation. */
function rollbackStagedPluginRegistry(snapshot) {
	installActivePluginRegistry({
		registry: snapshot.activeRegistry,
		key: snapshot.key,
		runtimeSubagentMode: snapshot.runtimeSubagentMode,
		workspaceDir: snapshot.workspaceDir,
		activateRegistry: false
	});
}
function installActivePluginRegistry(params) {
	const previousRegistry = asPluginRegistry(state.activeRegistry);
	state.activeRegistry = params.registry;
	if (params.activateRegistry !== false) markPluginRegistryActive(params.registry);
	state.activeVersion += 1;
	if (params.registry) settlePreparedMessageToolCatalog(params.registry, state.activeVersion);
	else settlePreparedMessageToolCatalog();
	state.key = params.key;
	state.workspaceDir = params.workspaceDir;
	state.runtimeSubagentMode = params.runtimeSubagentMode;
	syncPluginAgentEventBridge();
	if (params.retirePrevious === false || !previousRegistry || previousRegistry === params.registry) return;
	if (!retirePluginRegistryIfUnused(previousRegistry)) return;
	cleanupRetiredPluginHostRegistry(previousRegistry);
}
function getActivePluginRegistry() {
	return asPluginRegistry(state.activeRegistry);
}
function getActivePluginRegistryWorkspaceDir() {
	return state.workspaceDir ?? void 0;
}
/** Reads registration/request/active registry precedence without initializing a cold runtime. */
function getPluginRegistryForContext() {
	return state.registrationContext?.registry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry();
}
function requireActivePluginRegistry() {
	const registry = getPluginRegistryForContext();
	if (registry) return registry;
	state.activeRegistry = createEmptyPluginRegistry();
	markPluginRegistryActive(state.activeRegistry);
	state.activeVersion += 1;
	settlePreparedMessageToolCatalog(state.activeRegistry, state.activeVersion);
	syncPluginAgentEventBridge();
	return state.activeRegistry;
}
/** Binds unchanged direct SDK facades to the registry currently running synchronous register(). */
function withPluginRegistrationContext(registry, pluginId, run) {
	const previous = state.registrationContext;
	state.registrationContext = {
		registry,
		pluginId
	};
	try {
		return run();
	} finally {
		state.registrationContext = previous;
	}
}
function getPluginRegistrationContext() {
	return state.registrationContext;
}
/** Keeps direct registration facades owned by the plugin whose synchronous register() is running. */
function resolveDirectPluginRegistrationOwner(ownerPluginId) {
	return state.registrationContext?.pluginId ?? ownerPluginId;
}
/** A failed plugin must not displace an earlier plugin's builder-local contribution. */
function assertDirectPluginRegistrationReplacement(existingOwnerPluginId, capability) {
	const pluginId = state.registrationContext?.pluginId;
	if (pluginId && existingOwnerPluginId !== pluginId) throw new Error(`${capability} already registered by ${existingOwnerPluginId || "core"}`);
}
function getActivePluginHttpRouteRegistry() {
	return asPluginRegistry(state.activeRegistry);
}
function getActivePluginHttpRouteRegistryVersion() {
	return state.activeVersion;
}
function requireActivePluginHttpRouteRegistry() {
	const existing = getActivePluginHttpRouteRegistry();
	if (existing) return existing;
	return requireActivePluginRegistry();
}
function getActivePluginChannelRegistry() {
	return getActivePluginChannelRegistrySnapshotFromState().registry;
}
function getActivePluginChannelRegistryVersion() {
	return getActivePluginChannelRegistrySnapshotFromState().version;
}
function getActivePluginGatewayCommandRegistry() {
	return asPluginRegistry(state.activeRegistry);
}
function getActivePluginGatewayNodePolicyRegistry() {
	return asPluginRegistry(state.activeRegistry);
}
function requireActivePluginChannelRegistry() {
	const existing = getActivePluginChannelRegistry();
	if (existing) return existing;
	return requireActivePluginRegistry();
}
function getActivePluginSessionExtensionRegistry() {
	return asPluginRegistry(state.activeRegistry);
}
function getActivePluginRegistryKey() {
	return state.key;
}
function getActivePluginRuntimeSubagentMode() {
	return state.runtimeSubagentMode;
}
function getActivePluginRegistryVersion() {
	return state.activeVersion;
}
function collectLoadedPluginIds(registry, ids) {
	if (!registry) return;
	for (const plugin of registry.plugins) if (plugin.status === "loaded" && plugin.format !== "bundle") ids.add(plugin.id);
}
/**
* Returns plugin ids that were imported by plugin runtime or registry loading in
* the current process.
*
* This is a process-level view, not a fresh import trace: cached registry reuse
* still counts because the plugin code was loaded earlier in this process.
* Explicit loader import tracking covers plugins that were imported but later
* ended in an error state during registration.
* Bundle-format plugins are excluded because they can be "loaded" from metadata
* without importing any JS entrypoint.
*/
function listImportedRuntimePluginIds() {
	const imported = new Set(state.importedPluginIds);
	collectLoadedPluginIds(asPluginRegistry(state.activeRegistry), imported);
	return [...imported].toSorted((left, right) => left.localeCompare(right));
}
function clearActivePluginRegistryState() {
	const previousRegistry = asPluginRegistry(state.activeRegistry);
	state.activeRegistry = null;
	state.activeVersion += 1;
	state.key = null;
	state.workspaceDir = null;
	state.runtimeSubagentMode = "default";
	settlePreparedMessageToolCatalog();
	syncPluginAgentEventBridge();
	if (previousRegistry) markPluginRegistryRetired(previousRegistry);
	return previousRegistry;
}
async function clearActivePluginRegistry() {
	const previousRegistry = clearActivePluginRegistryState();
	const clearVersion = state.activeVersion;
	const clearRegistries = state.commandRegistryClearRegistries ??= /* @__PURE__ */ new Map();
	if (previousRegistry) clearRegistries.set(previousRegistry, (clearRegistries.get(previousRegistry) ?? 0) + 1);
	const completion = (state.commandRegistryClearTail ?? Promise.resolve()).catch(() => void 0).then(async () => {
		try {
			if (previousRegistry) {
				await waitForPluginCommandExecutions(previousRegistry);
				if (registryHasPluginHostCleanupWork(previousRegistry)) await cleanupPreviousPluginHostRegistry({ previousRegistry });
			}
		} finally {
			if (state.activeRegistry === null && state.activeVersion === clearVersion) try {
				await drainGlobalSingletonLifecycleState("plugin-registry");
			} finally {
				clearPluginHostRuntimeState();
			}
		}
	}).finally(() => {
		if (previousRegistry) {
			const remaining = (clearRegistries.get(previousRegistry) ?? 1) - 1;
			if (remaining === 0) clearRegistries.delete(previousRegistry);
			else clearRegistries.set(previousRegistry, remaining);
		}
	});
	state.commandRegistryClearTail = completion.catch((error) => {
		log.warn(`plugin registry clear failed: ${String(error)}`);
	});
	if ([...clearRegistries.keys()].some(isPluginCommandExecutionActiveHere)) return;
	await completion;
}
async function prepareActivePluginRegistryShutdown() {
	await loadPluginHostCleanupRuntime();
}
function resetPluginRuntimeStateForTest() {
	state.registrationContext = void 0;
	clearActivePluginRegistryState();
	state.importedPluginIds.clear();
	drainGlobalSingletonLifecycleState("plugin-registry");
	clearPluginHostRuntimeState();
	clearPluginMetadataLifecycleCaches();
}
//#endregion
export { stageActivePluginRegistry as A, registerPluginSessionSchedulerJob as B, requireActivePluginHttpRouteRegistry as C, restoreActivePluginRegistrySnapshot as D, resolveDirectPluginRegistrationOwner as E, clearPluginRunContext as F, withPluginHostCleanupTimeout as H, deletePluginSessionSchedulerJob as I, getPluginRunContext as L, getPreparedMessageToolCatalog as M, getPreparedMessageToolCatalogForRegistry as N, rollbackStagedPluginRegistry as O, cleanupPluginSessionSchedulerJobs as P, getPluginSessionSchedulerJobGeneration as R, requireActivePluginChannelRegistry as S, resetPluginRuntimeStateForTest as T, getPluginCommandExecutionCount as U, setPluginRunContext as V, withPluginCommandExecution as W, getPluginRegistrationContext as _, getActivePluginChannelRegistry as a, prepareActivePluginRegistryShutdown as b, getActivePluginGatewayNodePolicyRegistry as c, getActivePluginRegistry as d, getActivePluginRegistryKey as f, getActivePluginSessionExtensionRegistry as g, getActivePluginRuntimeSubagentMode as h, commitStagedPluginRegistry as i, withPluginRegistrationContext as j, setActivePluginRegistry as k, getActivePluginHttpRouteRegistry as l, getActivePluginRegistryWorkspaceDir as m, captureActivePluginRegistrySnapshot as n, getActivePluginChannelRegistryVersion as o, getActivePluginRegistryVersion as p, clearActivePluginRegistry as r, getActivePluginGatewayCommandRegistry as s, assertDirectPluginRegistrationReplacement as t, getActivePluginHttpRouteRegistryVersion as u, getPluginRegistryForContext as v, requireActivePluginRegistry as w, recordImportedPluginId as x, listImportedRuntimePluginIds as y, makePluginSessionSchedulerJobKey as z };
