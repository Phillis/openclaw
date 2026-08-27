import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as defaultSlotIdForKey } from "./slots-BTFPUFBt.js";
import { S as requireActivePluginRegistry, d as getActivePluginRegistry } from "./runtime-g0R28Sy0.js";
import { n as getProcessStartTime } from "./pid-alive-ClLrY9h9.js";
import { t as createCorePluginStateSyncKeyedStore } from "./plugin-state-store-D5dGBXer.js";
import { randomUUID } from "node:crypto";
//#region src/plugin-state/runtime-health-store.ts
const currentProcessToken = randomUUID();
function hasValidEnvelope(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.processId === "number" && Number.isInteger(record.processId) && record.processId > 0 && typeof record.processToken === "string" && record.processToken.length > 0 && (record.processStartTime === null || typeof record.processStartTime === "number" && Number.isFinite(record.processStartTime) && record.processStartTime >= 0) && typeof record.failedAtMs === "number" && Number.isFinite(record.failedAtMs);
}
/** Builds the common health envelope for records owned by this process. */
function createRuntimeHealthRecordEnvelope(failedAt) {
	return {
		processId: process.pid,
		processToken: currentProcessToken,
		processStartTime: getProcessStartTime(process.pid),
		failedAtMs: failedAt.getTime()
	};
}
function processLooksLive(record) {
	if (record.processId === process.pid) return record.processToken === currentProcessToken;
	const currentStartTime = getProcessStartTime(record.processId);
	return currentStartTime !== null && currentStartTime === record.processStartTime;
}
/** Opens a SQLite-backed health record namespace shared across runtime processes. */
function createRuntimeHealthStore(options) {
	const openStore = () => createCorePluginStateSyncKeyedStore({
		ownerId: options.ownerId,
		namespace: options.namespace,
		maxEntries: options.maxEntries,
		...options.ttlMs != null ? { defaultTtlMs: options.ttlMs } : {}
	});
	const normalize = (value) => hasValidEnvelope(value) ? options.normalizeRecord(value) : void 0;
	return {
		register(key, record) {
			openStore().register(key, record);
		},
		list() {
			try {
				const byGroup = /* @__PURE__ */ new Map();
				for (const entry of openStore().entries()) {
					const record = normalize(entry.value);
					if (!record || !processLooksLive(record)) continue;
					const groupKey = options.displayKey(record);
					const existing = byGroup.get(groupKey);
					if (!existing || (options.pick === "latest" ? record.failedAtMs > existing.failedAtMs : record.failedAtMs < existing.failedAtMs)) byGroup.set(groupKey, record);
				}
				return [...byGroup.values()];
			} catch {
				return [];
			}
		},
		clearForProcess(processId, matches) {
			try {
				const store = openStore();
				for (const entry of store.entries()) {
					const record = normalize(entry.value);
					if (record?.processId === processId && (!matches || matches(record))) store.delete(entry.key);
				}
			} catch {}
		}
	};
}
//#endregion
//#region src/context-engine/quarantine-health.ts
const quarantineStore = createRuntimeHealthStore({
	ownerId: "core:context-engine-quarantine-health",
	namespace: "runtime-quarantines",
	maxEntries: 64,
	normalizeRecord: (value) => {
		if (!hasNonEmptyString(value.engineId) || !hasNonEmptyString(value.operation) || !hasNonEmptyString(value.reason)) return;
		return {
			engineId: value.engineId,
			operation: value.operation,
			reason: value.reason,
			failedAtMs: value.failedAtMs,
			processId: value.processId,
			processToken: value.processToken,
			processStartTime: value.processStartTime,
			...hasNonEmptyString(value.owner) ? { owner: value.owner } : {}
		};
	},
	displayKey: (record) => record.engineId,
	pick: "earliest"
});
function recordPersistedContextEngineQuarantine(quarantine) {
	const record = {
		engineId: quarantine.engineId,
		operation: quarantine.operation,
		reason: quarantine.reason,
		...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
		...quarantine.owner ? { owner: quarantine.owner } : {}
	};
	quarantineStore.register(JSON.stringify([record.engineId, record.processId]), record);
}
function listPersistedContextEngineQuarantines() {
	return quarantineStore.list().map(({ engineId, operation, reason, owner, failedAtMs }) => {
		const quarantine = {
			engineId,
			operation,
			reason,
			failedAt: new Date(failedAtMs)
		};
		if (owner) quarantine.owner = owner;
		return quarantine;
	});
}
function clearPersistedContextEngineQuarantineForProcess(engineId, processId) {
	quarantineStore.clearForProcess(processId, engineId === void 0 ? void 0 : (record) => record.engineId === engineId);
}
//#endregion
//#region src/context-engine/registry.ts
const GUARDED_CONTEXT_ENGINE_METHODS = new Set("bootstrap maintain ingest ingestBatch afterTurn commitTurn assemble compact prepareSubagentSpawn onSubagentEnded".split(" "));
const CONTEXT_ENGINE_HOST_PARAMS = new Set("sessionKey prompt runtimeSettings sessionTarget runtimeContext".split(" "));
const resolvedEngineMetadata = /* @__PURE__ */ new WeakMap();
function projectContextEngineHostParams(engine, params) {
	const accepted = engine.info.acceptedHostParams;
	if (!accepted) return params;
	return Object.fromEntries(Object.entries(params).filter(([key]) => accepted.includes(key) || !CONTEXT_ENGINE_HOST_PARAMS.has(key)));
}
function wrapContextEngineHostParamProjection(engine, metadata) {
	const wrapped = new Proxy(Object.create(engine, { info: { get: () => engine.info } }), { get(_target, property) {
		if (property === "info") return engine.info;
		const method = Reflect.get(engine, property, engine);
		if (typeof method !== "function") return method;
		if (!GUARDED_CONTEXT_ENGINE_METHODS.has(property)) return method.bind(engine);
		return (params) => method.call(engine, projectContextEngineHostParams(engine, params));
	} });
	resolvedEngineMetadata.set(wrapped, metadata);
	return wrapped;
}
function wrapResolvedContextEngine(engine, metadata) {
	const fallback = metadata.defaultEngineId && metadata.factoryCtx && metadata.engineId !== metadata.defaultEngineId ? {
		defaultEngineId: metadata.defaultEngineId,
		factoryCtx: metadata.factoryCtx
	} : void 0;
	let fallbackEnginePromise;
	let resolvedFallbackEngine;
	const getFallbackEngine = fallback ? () => fallbackEnginePromise ??= resolveDefaultContextEngine(fallback.defaultEngineId, fallback.factoryCtx).then((resolved) => {
		resolvedFallbackEngine = resolved;
		return resolved;
	}) : void 0;
	const wrapped = new Proxy(Object.create(engine, { info: { get: () => engine.info } }), { get(_target, property) {
		if (property === "info") {
			if (!fallback || !getContextEngineQuarantine(metadata.engineId)) return engine.info;
			return resolvedFallbackEngine?.info ?? {
				id: fallback.defaultEngineId,
				name: fallback.defaultEngineId === "legacy" ? "Legacy Context Engine" : `${fallback.defaultEngineId} Context Engine`
			};
		}
		const method = Reflect.get(engine, property, engine);
		if (typeof method !== "function") return method;
		if (!GUARDED_CONTEXT_ENGINE_METHODS.has(property)) return method.bind(engine);
		if (!fallback || !getFallbackEngine) return (params) => method.call(engine, projectContextEngineHostParams(engine, params));
		const methodName = property;
		return async (methodParams) => {
			const abortSignal = contextEngineAbortSignal(methodParams);
			if (abortSignal?.aborted) {
				const reason = abortSignal.reason;
				throw reason instanceof Error ? reason : createAbortError(typeof reason === "string" && reason ? reason : "Context engine operation aborted.");
			}
			const invokeFallback = () => invokeFallbackContextEngineMethod({
				getFallbackEngine,
				methodName,
				methodParams
			});
			if (getContextEngineQuarantine(metadata.engineId)) return await invokeFallback();
			try {
				return await method.call(engine, projectContextEngineHostParams(engine, methodParams));
			} catch (error) {
				if (isContextEngineAbortRejection(error, abortSignal)) throw error;
				recordContextEngineQuarantine({
					engineId: metadata.engineId,
					owner: metadata.owner,
					operation: methodName,
					error,
					defaultEngineId: fallback.defaultEngineId
				});
				if (methodName === "compact" || methodName === "prepareSubagentSpawn") throw error;
				return await invokeFallback().catch(() => {
					throw error;
				});
			}
		};
	} });
	resolvedEngineMetadata.set(wrapped, metadata);
	return wrapped;
}
const CONTEXT_ENGINE_REGISTRY_STATE = Symbol.for("openclaw.contextEngineRegistryState");
const CORE_CONTEXT_ENGINE_OWNER = "core";
const contextEngineRegistryState = resolveGlobalSingleton(CONTEXT_ENGINE_REGISTRY_STATE, () => ({ quarantinedEngines: /* @__PURE__ */ new Map() }));
const getContextEngines = () => requireActivePluginRegistry().contextEngines;
function requireContextEngineOwner(owner) {
	const normalizedOwner = owner.trim();
	if (!normalizedOwner) throw new Error(`registerContextEngineForOwner: owner must be a non-empty string, got ${JSON.stringify(owner)}`);
	return normalizedOwner;
}
function recordContextEngineQuarantine(params) {
	const existing = contextEngineRegistryState.quarantinedEngines.get(params.engineId);
	if (existing) return existing;
	const quarantine = {
		engineId: params.engineId,
		operation: params.operation,
		reason: params.error instanceof Error ? params.error.message : String(params.error),
		failedAt: /* @__PURE__ */ new Date(),
		...params.owner ? { owner: params.owner } : {}
	};
	contextEngineRegistryState.quarantinedEngines.set(params.engineId, quarantine);
	try {
		recordPersistedContextEngineQuarantine(quarantine);
	} catch {}
	const ownerSuffix = params.owner ? ` owner=${sanitizeForLog(params.owner)}` : "";
	console.error(`[context-engine] Context engine "${sanitizeForLog(params.engineId)}"${ownerSuffix} failed during ${sanitizeForLog(params.operation)}: ${sanitizeForLog(quarantine.reason)}; quarantining it for this process and falling back to default engine "${params.defaultEngineId}".`);
	return quarantine;
}
function getContextEngineQuarantine(engineId) {
	return contextEngineRegistryState.quarantinedEngines.get(engineId);
}
function listContextEngineQuarantines() {
	const quarantines = Array.from(contextEngineRegistryState.quarantinedEngines.values(), ({ failedAt, ...quarantine }) => ({
		...quarantine,
		failedAt: new Date(failedAt)
	}));
	const seenEngineIds = new Set(quarantines.map((entry) => entry.engineId));
	return quarantines.concat(listPersistedContextEngineQuarantines().filter(({ engineId }) => !seenEngineIds.has(engineId)));
}
function clearContextEngineRuntimeQuarantine(engineId) {
	contextEngineRegistryState.quarantinedEngines.delete(engineId);
	clearPersistedContextEngineQuarantineForProcess(engineId, process.pid);
}
/**
* Register a context engine implementation under an explicit trusted owner.
*/
function registerContextEngineForOwner(id, factory, owner, opts) {
	const targetRegistry = requireActivePluginRegistry();
	const result = registerContextEngineInRegistry(targetRegistry, id, factory, owner, opts);
	if (result.ok && (opts?.lifecycle ?? "runtime") === "runtime" && getActivePluginRegistry() === targetRegistry) clearContextEngineRuntimeQuarantine(id);
	return result;
}
/** Registers an engine in a registry value while that value is being assembled. */
function registerContextEngineInRegistry(pluginRegistry, id, factory, owner, opts) {
	const normalizedOwner = requireContextEngineOwner(owner);
	const lifecycle = opts?.lifecycle ?? "runtime";
	const registry = pluginRegistry.contextEngines;
	const existing = registry.get(id);
	if (id === defaultSlotIdForKey("contextEngine") && normalizedOwner !== CORE_CONTEXT_ENGINE_OWNER) return {
		ok: false,
		existingOwner: CORE_CONTEXT_ENGINE_OWNER
	};
	if (existing && existing.owner !== normalizedOwner) return {
		ok: false,
		existingOwner: existing.owner
	};
	if (existing?.lifecycle === "runtime" && lifecycle === "readOnlyDiscovery") return { ok: true };
	if (existing && opts?.allowSameOwnerRefresh !== true) return {
		ok: false,
		existingOwner: existing.owner
	};
	registry.set(id, {
		factory,
		owner: normalizedOwner,
		lifecycle
	});
	return { ok: true };
}
/** Carries runtime-safe factories into a matching non-activating prepared registry. */
function promoteMatchingRuntimeContextEngineRegistrations(targetRegistry, runtimeRegistry) {
	for (const [id, target] of targetRegistry.contextEngines) {
		if (target.lifecycle !== "readOnlyDiscovery") continue;
		const runtime = runtimeRegistry.contextEngines.get(id);
		if (!runtime || runtime.lifecycle !== "runtime" || runtime.owner !== target.owner) continue;
		const pluginId = pluginIdFromContextEngineOwner(target.owner);
		const targetPlugin = targetRegistry.plugins.find((plugin) => plugin.id === pluginId);
		const runtimePlugin = runtimeRegistry.plugins.find((plugin) => plugin.id === pluginId);
		if (!targetPlugin || !runtimePlugin || targetPlugin.source !== runtimePlugin.source) continue;
		targetRegistry.contextEngines.set(id, runtime);
	}
}
/** Clear runtime quarantine only after a complete builder-local registry becomes active. */
function activateContextEngineRegistrations(pluginRegistry) {
	for (const [id, registration] of pluginRegistry.contextEngines) if (registration.lifecycle === "runtime") clearContextEngineRuntimeQuarantine(id);
}
/** Returns registration metadata so callers can distinguish discovery snapshots from runtime entries. */
function getContextEngineRegistration(id) {
	return getContextEngines().get(id);
}
/**
* List all registered engine ids.
*/
function listContextEngineIds() {
	return [...getContextEngines().keys()].toSorted();
}
/**
* Return the trusted plugin id that registered a resolved context engine.
*/
function resolveContextEngineOwnerPluginId(engine) {
	const metadata = engine ? resolvedEngineMetadata.get(engine) : void 0;
	const owner = metadata && !getContextEngineQuarantine(metadata.engineId) ? metadata.owner : void 0;
	return owner ? pluginIdFromContextEngineOwner(owner) : void 0;
}
function pluginIdFromContextEngineOwner(owner) {
	if (!owner.startsWith("plugin:")) return;
	return owner.slice(7).trim() || void 0;
}
function describeResolvedContextEngineContractError(engineId, engine) {
	if (!engine || typeof engine !== "object") return `Context engine "${engineId}" factory returned ${JSON.stringify(engine)} instead of a ContextEngine object.`;
	const candidate = engine;
	const issues = [];
	const info = candidate.info;
	if (!info || typeof info !== "object") issues.push("missing info");
	else {
		const infoRecord = info;
		for (const field of ["id", "name"]) {
			const value = infoRecord[field];
			if (typeof value !== "string" || !value.trim()) issues.push(`missing info.${field}`);
		}
	}
	for (const method of [
		"ingest",
		"assemble",
		"compact"
	]) if (typeof candidate[method] !== "function") issues.push(`missing ${method}()`);
	return issues.length === 0 ? null : `Context engine "${engineId}" factory returned an invalid ContextEngine: ${issues.join(", ")}.`;
}
const CONTEXT_ENGINE_FALLBACK_RESULTS = {
	bootstrap: {
		bootstrapped: false,
		reason: "context engine downgraded to legacy"
	},
	maintain: {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "context engine downgraded to legacy"
	},
	ingest: { ingested: false },
	ingestBatch: { ingestedCount: 0 }
};
function contextEngineAbortSignal(methodParams) {
	const signal = methodParams?.abortSignal;
	return signal && typeof signal === "object" && "aborted" in signal ? signal : void 0;
}
function isContextEngineAbortRejection(error, signal) {
	if (!signal?.aborted) return false;
	if (error === signal.reason) return true;
	if (error instanceof Error) return error.name === "AbortError" || /abort|cancelled|canceled/iu.test(error.message);
	return typeof error === "string" && /abort|cancelled|canceled/iu.test(error);
}
async function invokeFallbackContextEngineMethod(params) {
	const fallbackEngine = await params.getFallbackEngine();
	const fallbackMethod = fallbackEngine[params.methodName];
	if (typeof fallbackMethod === "function") return await fallbackMethod.call(fallbackEngine, params.methodParams);
	if (params.methodName === "assemble" || params.methodName === "compact") throw new Error(`No legacy fallback result for ${params.methodName}`);
	const fallbackResult = CONTEXT_ENGINE_FALLBACK_RESULTS[params.methodName];
	return fallbackResult ? { ...fallbackResult } : void 0;
}
function resolvedContextEngineRef(params) {
	const pluginId = pluginIdFromContextEngineOwner(params.owner);
	return Object.freeze({
		engine: params.engine,
		registeredId: params.registeredId,
		...pluginId ? { ownerPluginId: pluginId } : {}
	});
}
async function resolveRawContextEngineRef(engineId, factoryCtx) {
	const entry = getContextEngines().get(engineId);
	if (!entry) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
	const engine = await entry.factory(factoryCtx);
	const contractError = describeResolvedContextEngineContractError(engineId, engine);
	if (contractError) {
		await Promise.resolve(engine?.dispose?.()).catch(() => void 0);
		throw new Error(contractError);
	}
	return resolvedContextEngineRef({
		engine: wrapContextEngineHostParamProjection(engine, {
			engineId,
			owner: entry.owner
		}),
		registeredId: engineId,
		owner: entry.owner
	});
}
/**
* Resolve fresh engines for one logical turn without consulting or mutating
* process quarantine. A failed configured engine is retried by the next turn.
*/
async function resolveLogicalTurnContextEngines(config, options) {
	const defaultEngineId = defaultSlotIdForKey("contextEngine");
	const slotValue = config?.plugins?.slots?.contextEngine;
	const configuredEngineId = typeof slotValue === "string" && slotValue.trim() ? slotValue.trim() : defaultEngineId;
	const factoryCtx = {
		config,
		agentDir: options?.agentDir,
		workspaceDir: options?.workspaceDir
	};
	const fallback = await resolveRawContextEngineRef(defaultEngineId, factoryCtx);
	if (configuredEngineId === defaultEngineId) return {
		configured: fallback,
		configuredId: configuredEngineId,
		fallback
	};
	const entry = getContextEngines().get(configuredEngineId);
	if (!entry) return {
		configured: fallback,
		configuredId: configuredEngineId,
		configuredFailure: `context engine "${configuredEngineId}" is not registered`,
		fallback
	};
	if (entry.lifecycle === "readOnlyDiscovery") return {
		configured: fallback,
		configuredId: configuredEngineId,
		configuredFailure: `context engine "${configuredEngineId}" is available for discovery only`,
		fallback
	};
	try {
		return {
			configured: await resolveRawContextEngineRef(configuredEngineId, factoryCtx),
			configuredId: configuredEngineId,
			fallback
		};
	} catch (error) {
		return {
			configured: fallback,
			configuredId: configuredEngineId,
			configuredFailure: error instanceof Error ? error.message : String(error),
			fallback
		};
	}
}
/**
* Resolve which ContextEngine to use based on plugin slot configuration.
*
* Resolution order:
*   1. `config.plugins.slots.contextEngine` (explicit slot override)
*   2. Default slot value ("legacy")
*
* When `config` is provided it is forwarded to the factory as part of a
* {@link ContextEngineFactoryContext}. Additional runtime paths can be
* supplied via `options`. Existing no-arg factories continue to work
* because JavaScript permits extra arguments at call sites.
*
* Non-default engines that fail (unregistered, factory throw, or contract
* violation) are logged and silently replaced by the default engine.
* Throws only when the default engine itself cannot be resolved.
*/
async function resolveContextEngine(config, options) {
	const defaultEngineId = defaultSlotIdForKey("contextEngine");
	const slotValue = config?.plugins?.slots?.contextEngine;
	const engineId = typeof slotValue === "string" && slotValue.trim() ? slotValue.trim() : defaultEngineId;
	const isDefaultEngine = engineId === defaultEngineId;
	const factoryCtx = {
		config,
		agentDir: options?.agentDir,
		workspaceDir: options?.workspaceDir
	};
	if (!isDefaultEngine ? getContextEngineQuarantine(engineId) : void 0) return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	const entry = getContextEngines().get(engineId);
	if (!entry) {
		if (isDefaultEngine) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
		recordContextEngineQuarantine({
			engineId,
			operation: "resolve",
			error: "not registered",
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	if (!isDefaultEngine && entry.lifecycle === "readOnlyDiscovery") {
		console.warn(`[context-engine] Context engine "${engineId}" owner=${entry.owner} is registered for read-only discovery only; falling back to default engine "${defaultEngineId}" without quarantine until runtime activation registers it.`);
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	let engine;
	let operation = "factory";
	try {
		engine = await entry.factory(factoryCtx);
		operation = "contract-validation";
		const contractError = describeResolvedContextEngineContractError(engineId, engine);
		if (contractError) throw new Error(contractError);
	} catch (error) {
		if (isDefaultEngine) throw error;
		recordContextEngineQuarantine({
			engineId,
			owner: entry.owner,
			operation,
			error,
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	return wrapResolvedContextEngine(engine, {
		owner: entry.owner,
		engineId,
		defaultEngineId,
		factoryCtx
	});
}
/**
* Resolve the default context engine as a last-resort fallback.
*
* This helper is intentionally strict: if the default engine itself fails,
* there is no further fallback and the error must propagate.
*/
async function resolveDefaultContextEngine(defaultEngineId, factoryCtx) {
	const defaultEntry = getContextEngines().get(defaultEngineId);
	if (!defaultEntry) throw new Error(`[context-engine] fallback failed: default engine "${defaultEngineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
	const engine = await defaultEntry.factory(factoryCtx);
	const contractError = describeResolvedContextEngineContractError(defaultEngineId, engine);
	if (contractError) throw new Error(`[context-engine] ${contractError}`);
	return wrapResolvedContextEngine(engine, {
		owner: defaultEntry.owner,
		engineId: defaultEngineId
	});
}
//#endregion
export { promoteMatchingRuntimeContextEngineRegistrations as a, resolveContextEngine as c, createRuntimeHealthRecordEnvelope as d, createRuntimeHealthStore as f, listContextEngineQuarantines as i, resolveContextEngineOwnerPluginId as l, activateContextEngineRegistrations as n, registerContextEngineForOwner as o, getContextEngineRegistration as r, registerContextEngineInRegistry as s, CONTEXT_ENGINE_HOST_PARAMS as t, resolveLogicalTurnContextEngines as u };
