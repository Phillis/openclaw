import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import "./errors-Ccx0R-_Z.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { n as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DTpp6ccf.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { u as hashRuntimeConfigValue } from "./runtime-snapshot-Cv5MaU8U.js";
import { n as listProfilesForProvider } from "./profile-list-CFe_FbXc.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, c as getRuntimeAuthProfileStoreSnapshot, r as ensureAuthProfileStore } from "./store-C6iqqcJy.js";
import "./workspace-DJ__UUS2.js";
import "./auth-profiles-wr_j3m1O.js";
import { n as externalCliDiscoveryForProviderAuth, r as externalCliDiscoveryForProviders } from "./external-cli-discovery-kohNMVnn.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-BvpvPrfG.js";
import { a as hasAvailableAuthForProvider, c as createRuntimeProviderAuthLookup, l as hasRuntimeAvailableProviderAuth } from "./model-auth-BWLQILnV.js";
import { a as getCurrentProviderAuthStates, c as setCurrentProviderAuthWarmWorker, i as clearCurrentProviderAuthWarmWorker, n as claimCurrentProviderAuthStateGeneration, o as isCurrentProviderAuthStateGeneration, s as publishProviderAuthWarmSnapshot, t as cancelCurrentProviderAuthWarmWorker } from "./model-provider-auth-state-DW_JYm-o.js";
import "./model-selection-Cp8EGD61.js";
import { Worker } from "node:worker_threads";
//#region src/agents/model-provider-auth.ts
/**
* Warms and queries provider-auth availability for model catalogs. The module
* keeps per-agent auth snapshots process-current so model listing can avoid
* repeated env/profile/plugin discovery on hot paths.
*/
const PROVIDER_AUTH_WARM_WORKER_TIMEOUT_MS = 12e4;
const PROVIDER_AUTH_WARM_CANCEL_POLL_MS = 25;
const configFingerprintCache = /* @__PURE__ */ new WeakMap();
function resolvePreparedStateForCaller(params) {
	if (!params.states) return null;
	if (params.callerAgentId !== void 0) return params.states.get(params.callerAgentId) ?? null;
	if (!params.cfg) return null;
	return params.states.get(resolveDefaultAgentId(params.cfg)) ?? null;
}
function resolveProviderAuthConfigFingerprint(cfg) {
	if (!cfg) return null;
	const cached = configFingerprintCache.get(cfg);
	if (cached !== void 0) return cached;
	const fingerprint = hashRuntimeConfigValue(cfg);
	configFingerprintCache.set(cfg, fingerprint);
	return fingerprint;
}
/** Resolves whether auth is available for a model provider in the caller's runtime scope. */
async function hasAuthForModelProvider(params) {
	const provider = normalizeProviderId(params.provider);
	const preparedStates = getCurrentProviderAuthStates();
	const workspaceDir = params.workspaceDir ?? resolveDefaultAgentWorkspaceDir();
	const configFingerprint = resolveProviderAuthConfigFingerprint(params.cfg);
	const preparedState = resolvePreparedStateForCaller({
		states: preparedStates,
		cfg: params.cfg,
		callerAgentId: params.agentId
	});
	const expectedWorkspaceDir = preparedState !== null && params.cfg ? resolveAgentWorkspaceDir(params.cfg, preparedState.agentId) : null;
	const expectedAgentDir = preparedState !== null && params.cfg ? resolveAgentDir(params.cfg, preparedState.agentId) : null;
	if (preparedState !== null && configFingerprint === preparedState.configFingerprint && workspaceDir === expectedWorkspaceDir && (params.agentDir === void 0 || params.agentDir === expectedAgentDir) && (params.allowPreparedRuntimeAuth === true || params.discoverExternalCliAuth !== false && params.allowPluginSyntheticAuth !== false) && params.env === void 0 && params.store === void 0 && params.modelApi === void 0) {
		const preparedAnswer = preparedState.providers.get(provider);
		if (preparedAnswer !== void 0) return preparedAnswer;
	}
	await new Promise((resolve) => {
		setImmediate(resolve);
	});
	const slowPathAgentDir = params.agentDir ?? (params.agentId && params.cfg ? resolveAgentDir(params.cfg, params.agentId, params.env) : void 0);
	const store = params.store ?? (params.discoverExternalCliAuth === false ? ensureAuthProfileStoreWithoutExternalProfiles(slowPathAgentDir, { allowKeychainPrompt: false }) : ensureAuthProfileStore(slowPathAgentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg: params.cfg,
		provider
	}) }));
	if (hasRuntimeAvailableProviderAuth({
		provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		allowPluginSyntheticAuth: params.allowPluginSyntheticAuth,
		runtimeLookup: params.runtimeAuthLookup ?? params.resolveRuntimeAuthLookup?.(),
		modelApi: params.modelApi,
		store
	})) return true;
	if (listProfilesForProvider(store, provider).length > 0) return params.modelApi === void 0 ? true : await hasAvailableAuthForProvider({
		provider,
		modelApi: params.modelApi,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		agentDir: slowPathAgentDir,
		store
	});
	return false;
}
/** Creates a cached provider-auth evaluator bound to one agent/runtime context. */
function createProviderAuthChecker(params) {
	const authCache = /* @__PURE__ */ new Map();
	let runtimeAuthLookup;
	let modelAuthResolver;
	const resolveModelAuthResolver = () => {
		if (modelAuthResolver) return modelAuthResolver;
		const agentDir = params.agentDir ?? (params.agentId && params.cfg ? resolveAgentDir(params.cfg, params.agentId, params.env) : void 0);
		const authStore = ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
		runtimeAuthLookup ??= createRuntimeProviderAuthLookup({
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			env: params.env,
			includePluginSyntheticAuth: params.allowPluginSyntheticAuth !== false
		});
		modelAuthResolver = createModelAuthAvailabilityResolver({
			cfg: params.cfg ?? {},
			authStore,
			agentDir,
			workspaceDir: params.workspaceDir,
			env: params.env,
			skipSetupProviderFallback: true,
			allowPreparedRuntimeAuth: params.allowPreparedRuntimeAuth === true || params.discoverExternalCliAuth !== false && params.allowPluginSyntheticAuth !== false,
			syntheticAuthProviderRefs: runtimeAuthLookup.syntheticAuthProviderRefs,
			...params.discoverExternalCliAuth === false ? {} : { externalCliProviderIds: ["openai"] }
		});
		return modelAuthResolver;
	};
	const evaluateModelAuth = (provider, ref = {}) => {
		const key = normalizeProviderId(provider);
		const hasRouteFacts = ref.modelId !== void 0 || ref.api !== void 0 || ref.baseUrl !== void 0 || ref.observedRoutes !== void 0;
		const cacheKey = hasRouteFacts ? `${key}\0${hashRuntimeConfigValue(ref)}` : key;
		const cached = authCache.get(cacheKey);
		if (cached) return cached;
		const resolveLegacyProviderAuth = () => hasAuthForModelProvider({
			provider: key,
			modelApi: typeof ref.api === "string" ? ref.api : void 0,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			agentId: params.agentId,
			env: params.env,
			allowPluginSyntheticAuth: params.allowPluginSyntheticAuth,
			discoverExternalCliAuth: params.discoverExternalCliAuth,
			allowPreparedRuntimeAuth: params.allowPreparedRuntimeAuth,
			resolveRuntimeAuthLookup: () => runtimeAuthLookup ??= createRuntimeProviderAuthLookup({
				cfg: params.cfg,
				workspaceDir: params.workspaceDir,
				env: params.env,
				includePluginSyntheticAuth: params.allowPluginSyntheticAuth !== false
			})
		});
		const evaluation = Promise.resolve().then(async () => {
			if (hasRouteFacts) return resolveModelAuthResolver().evaluateModelAuth(key, ref);
			return {
				availability: await resolveLegacyProviderAuth(),
				routeResolution: null
			};
		});
		authCache.set(cacheKey, evaluation);
		evaluation.catch(() => {
			if (authCache.get(cacheKey) === evaluation) authCache.delete(cacheKey);
		});
		return evaluation;
	};
	return Object.assign(async (provider, ref = {}) => (await evaluateModelAuth(provider, ref)).availability === true, { evaluateModelAuth });
}
function serializeProviderAuthStates(states) {
	return { agents: [...states.values()].map((state) => ({
		agentId: state.agentId,
		configFingerprint: state.configFingerprint,
		providers: [...state.providers.entries()]
	})) };
}
function resolveProviderConfigApi(cfg, provider) {
	const providers = cfg?.models?.providers ?? {};
	const direct = providers[provider];
	if (direct?.api) return direct.api;
	const normalized = normalizeProviderId(provider);
	return (Object.entries(providers).find(([key]) => normalizeProviderId(key) === normalized)?.[1])?.api;
}
function shouldOmitFalsePreparedAuthForProcessSyntheticProvider(params) {
	const syntheticRefs = params.runtimeAuthLookup.syntheticAuthProviderRefs;
	if (!syntheticRefs?.length) return false;
	const eligibleRefs = new Set(syntheticRefs.map((ref) => normalizeProviderId(ref)));
	const providerApi = resolveProviderConfigApi(params.cfg, params.provider);
	return [params.provider, providerApi].filter((ref) => typeof ref === "string" && ref.trim().length > 0).some((ref) => eligibleRefs.has(normalizeProviderId(ref)));
}
/** Builds a provider auth snapshot for every configured agent. */
async function buildCurrentProviderAuthStateSnapshot(cfg, options = {}) {
	const isWarmStale = () => options.isCancelled?.() === true;
	const configFingerprint = resolveProviderAuthConfigFingerprint(cfg) ?? "";
	const states = /* @__PURE__ */ new Map();
	for (const agentId of listAgentIds(cfg)) {
		if (isWarmStale()) return { agents: [] };
		const agentDir = resolveAgentDir(cfg, agentId);
		const { loadPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-CiP0KTjK.js");
		const preparedOwner = await loadPreparedModelCatalogOwnerSnapshot({
			config: cfg,
			agentId,
			agentDir,
			readOnly: true
		});
		const workspaceDir = preparedOwner.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId);
		const catalog = preparedOwner.modelCatalog.entries;
		if (isWarmStale()) return { agents: [] };
		const providers = new Set(catalog.map((entry) => normalizeProviderId(entry.provider)));
		const providerList = [...providers];
		const runtimeAuthLookup = options.runtimeAuthLookups?.get(agentId) ?? createRuntimeProviderAuthLookup({
			cfg,
			workspaceDir
		});
		const externalCli = externalCliDiscoveryForProviders({
			cfg,
			providers: providerList
		});
		const store = options.readOnlyAuthStore ? ensureAuthProfileStore(agentDir, {
			config: cfg,
			externalCli,
			readOnly: true,
			syncExternalCli: false
		}) : ensureAuthProfileStore(agentDir, {
			config: cfg,
			externalCli
		});
		const state = /* @__PURE__ */ new Map();
		for (const provider of providers) {
			if (isWarmStale()) return { agents: [] };
			const value = await hasAuthForModelProvider({
				provider,
				cfg,
				workspaceDir,
				agentId,
				store,
				runtimeAuthLookup
			});
			if (!value && (options.omitFalseProviderAuth || shouldOmitFalsePreparedAuthForProcessSyntheticProvider({
				cfg,
				provider,
				runtimeAuthLookup
			}))) continue;
			state.set(provider, value);
		}
		states.set(agentId, {
			agentId,
			configFingerprint,
			providers: state
		});
	}
	return serializeProviderAuthStates(states);
}
function isProviderAuthWarmSnapshot(value) {
	if (!value || typeof value !== "object" || !Array.isArray(value.agents)) return false;
	return value.agents.every((agent) => typeof agent.agentId === "string" && typeof agent.configFingerprint === "string" && Array.isArray(agent.providers) && agent.providers.every((entry) => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string" && typeof entry[1] === "boolean"));
}
function isProviderAuthWarmWorkerResult(value) {
	if (!value || typeof value !== "object") return false;
	const result = value;
	if (result.status === "failed") return typeof result.error === "string";
	return result.status === "ok" && isProviderAuthWarmSnapshot(result.snapshot);
}
function createProviderAuthWarmPresenceStore(store) {
	const profiles = {};
	for (const [profileId, credential] of Object.entries(store.profiles)) profiles[profileId] = {
		type: "api_key",
		provider: credential.provider
	};
	const usageStats = {};
	if (store.usageStats) {
		for (const [id, stats] of Object.entries(store.usageStats)) if (id.startsWith("inline-api-key:")) usageStats[id] = stats;
	}
	return {
		version: store.version,
		profiles,
		usageStats
	};
}
function collectProviderAuthWarmRuntimeAuthStores(cfg) {
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	const addStore = (agentDir) => {
		if (seen.has(agentDir)) return;
		seen.add(agentDir);
		const store = getRuntimeAuthProfileStoreSnapshot(agentDir);
		if (!store) return;
		entries.push({
			...agentDir === void 0 ? {} : { agentDir },
			store: createProviderAuthWarmPresenceStore(store)
		});
	};
	addStore();
	for (const agentId of listAgentIds(cfg)) addStore(resolveAgentDir(cfg, agentId));
	return entries;
}
function collectProviderAuthWarmRuntimeAuthLookups(cfg) {
	const entries = [];
	let omitFalseProviderAuth = false;
	for (const agentId of listAgentIds(cfg)) {
		const lookup = createRuntimeProviderAuthLookup({
			cfg,
			workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
		});
		if (lookup.syntheticAuthProviderRefsComplete === false) omitFalseProviderAuth = true;
		entries.push({
			agentId,
			lookup
		});
	}
	return {
		entries,
		omitFalseProviderAuth
	};
}
function runProviderAuthWarmWorker(params) {
	const workerUrl = params.workerUrl ?? resolveRuntimeWorkerUrl({
		currentModuleUrl: import.meta.url,
		sourceWorkerName: "model-provider-auth.worker",
		distWorkerPath: "agents/model-provider-auth.worker.js"
	});
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	const worker = new Worker(workerUrl, {
		workerData: {
			cfg: params.cfg,
			...params.runtimeAuthStores?.length ? { runtimeAuthStores: params.runtimeAuthStores } : {},
			...params.runtimeAuthLookups?.length ? { runtimeAuthLookups: params.runtimeAuthLookups } : {},
			...params.omitFalseProviderAuth ? { omitFalseProviderAuth: true } : {}
		},
		execArgv: sourceWorkerExecArgv
	});
	worker.unref?.();
	const handle = {
		worker,
		cancelled: false
	};
	setCurrentProviderAuthWarmWorker(handle);
	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (complete) => {
			if (settled) return;
			settled = true;
			clearCurrentProviderAuthWarmWorker(handle);
			if (timer) clearTimeout(timer);
			if (cancelTimer) clearInterval(cancelTimer);
			complete();
		};
		const cancelWorker = () => {
			handle.cancelled = true;
			worker.terminate();
			finish(() => resolve({ agents: [] }));
		};
		const timer = setTimeout(() => {
			handle.cancelled = true;
			worker.terminate();
			finish(() => reject(/* @__PURE__ */ new Error("provider auth warm worker timed out")));
		}, params.timeoutMs);
		timer.unref?.();
		const cancelTimer = setInterval(() => {
			if (params.isCancelled()) cancelWorker();
		}, PROVIDER_AUTH_WARM_CANCEL_POLL_MS);
		cancelTimer.unref?.();
		worker.once("message", (message) => {
			worker.terminate();
			finish(() => {
				if (handle.cancelled) {
					resolve({ agents: [] });
					return;
				}
				if (!isProviderAuthWarmWorkerResult(message)) {
					reject(/* @__PURE__ */ new Error("invalid provider auth warm worker response"));
					return;
				}
				if (message.status === "failed") {
					reject(new Error(message.error));
					return;
				}
				resolve(message.snapshot);
			});
		});
		worker.once("error", (error) => {
			finish(() => {
				if (handle.cancelled) {
					resolve({ agents: [] });
					return;
				}
				reject(toErrorObject(error, "Non-Error rejection"));
			});
		});
		worker.once("exit", (code) => {
			if (settled || code === 0) return;
			finish(() => {
				if (handle.cancelled) {
					resolve({ agents: [] });
					return;
				}
				reject(/* @__PURE__ */ new Error(`provider auth warm worker exited with code ${code}`));
			});
		});
		if (params.isCancelled()) cancelWorker();
	});
}
/** Warms process-current provider auth state in a worker thread. */
async function warmCurrentProviderAuthStateOffMainThread(cfg, options = {}) {
	const ownGeneration = claimCurrentProviderAuthStateGeneration();
	cancelCurrentProviderAuthWarmWorker();
	const isWarmStale = () => options.isCancelled?.() === true || !isCurrentProviderAuthStateGeneration(ownGeneration);
	if (isWarmStale()) return;
	const runtimeAuthStores = collectProviderAuthWarmRuntimeAuthStores(cfg);
	const runtimeAuthLookups = collectProviderAuthWarmRuntimeAuthLookups(cfg);
	const snapshot = await (options.runWorker ?? runProviderAuthWarmWorker)({
		cfg,
		...runtimeAuthStores.length ? { runtimeAuthStores } : {},
		...runtimeAuthLookups.entries.length ? { runtimeAuthLookups: runtimeAuthLookups.entries } : {},
		...runtimeAuthLookups.omitFalseProviderAuth ? { omitFalseProviderAuth: true } : {},
		timeoutMs: options.timeoutMs ?? PROVIDER_AUTH_WARM_WORKER_TIMEOUT_MS,
		isCancelled: isWarmStale,
		workerUrl: options.workerUrl
	});
	if (isWarmStale()) return;
	publishProviderAuthWarmSnapshot(snapshot);
}
//#endregion
export { warmCurrentProviderAuthStateOffMainThread as i, createProviderAuthChecker as n, hasAuthForModelProvider as r, buildCurrentProviderAuthStateSnapshot as t };
