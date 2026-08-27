import { a as toStringifiedError } from "./error-coercion-DisD0JTb.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { m as resolveRunModelFallbacksOverride } from "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-CsnnOL14.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import "./defaults-CdX9UGcX.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-WCq2iqcj.js";
import { u as hashRuntimeConfigValue } from "./runtime-snapshot-DIuCzlel.js";
import { i as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-CGszFH8G.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { h as registerRuntimeAuthProfileStoreMutationListener, x as registerRuntimeAuthMaterializationMutationListener, y as getPreparedRuntimeAuthMaterializations } from "./runtime-snapshots-CVpJCNdz.js";
import { a as setPreparedModelRuntimeAuthLoader, n as resolvePublishedModelCatalogOwner, o as setPreparedModelRuntimeAuthMaterializations, s as setPreparedModelRuntimeAuthStore } from "./prepared-model-catalog-owner-CUGU07tR.js";
import { n as PreparedModelRuntimePublicationSupersededError, t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DUOk3SoP.js";
import { a as prepareConfiguredRuntimeFactsBatch, i as prepareAgentCatalogSource, l as createPreparedInboundRegistryLoader, m as resolveUsableAgentCredentialModes, o as prepareFullCatalogFacts, s as prepareWorkspaceBuildGroup, t as fingerprintPreparedRuntimeFacts, u as preparedModelRuntimeWorkspaceFactsKey } from "./prepared-model-runtime.facts-B0EtkVQK.js";
import { gt as AuthStorage } from "./sessions-BHNzcBA2.js";
import { i as resolveSelectedAgentHarnessRuntime, t as requiresAgentHarnessPluginSelection } from "./runtime-plugin-load-plan-BNIibCSY.js";
import { n as createPreparedModelCatalogWorkerInput, t as createPreparedModelCatalogWorker } from "./prepared-model-catalog-worker-UYICDCc6.js";
import { r as isReservedSystemAgentId } from "./agent-id-BYpRMvce.js";
import { r as resolveModelCandidateChain } from "./model-fallback-candidates-Cm265CbA.js";
import { t as runAbortableTimeout } from "./with-timeout-CRFXnEKz.js";
import path from "node:path";
import fs from "node:fs/promises";
import { performance } from "node:perf_hooks";
import pLimit from "p-limit";
import { setImmediate } from "node:timers/promises";
//#region src/agents/prepared-model-runtime.build.ts
const MAX_CONCURRENT_MODEL_RUNTIME_AGENT_SOURCE_BUILDS = 2;
const MAX_CONCURRENT_FULL_MODEL_CATALOG_BUILDS = 1;
const limitFullModelCatalogBuild = pLimit(MAX_CONCURRENT_FULL_MODEL_CATALOG_BUILDS);
function runSerializedPreparedModelRuntimeTask(params) {
	const previous = params.agentBuildCompletions.get(params.agentDir);
	const pending = (async () => {
		if (previous) await previous;
		await setImmediate();
		if (!params.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime catalog generation was superseded for ${params.agentDir}`);
		return await params.task();
	})();
	const completion = pending.then(() => void 0, () => void 0);
	params.agentBuildCompletions.set(params.agentDir, completion);
	completion.then(() => {
		if (params.agentBuildCompletions.get(params.agentDir) === completion) params.agentBuildCompletions.delete(params.agentDir);
	});
	return pending;
}
function assertPreparedModelRuntimeInputCurrent(input, guards) {
	const isCurrent = typeof guards === "function" ? guards : guards.get(input);
	if (isCurrent && !isCurrent()) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`);
}
function assertPreparedModelRuntimeInputsCurrent(inputs, guards) {
	for (const input of inputs) assertPreparedModelRuntimeInputCurrent(input, guards);
}
function createFullModelCatalogAccess(params) {
	let fullCatalog;
	let pending;
	let pendingAuth;
	const assertCurrent = () => {
		if (!params.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime catalog generation was superseded for ${params.agentFacts.input.agentDir}`);
	};
	const worker = createPreparedModelCatalogWorker({
		input: createPreparedModelCatalogWorkerInput({
			agentFacts: params.agentFacts,
			pluginMetadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot
		}),
		isCurrent: params.isCurrent
	});
	return {
		loadAuth: ({ providerIds, profileIds }) => {
			const cacheKey = `${[...new Set(providerIds)].toSorted((left, right) => left.localeCompare(right)).join("\0")}\0\0${[...new Set(profileIds ?? [])].toSorted((left, right) => left.localeCompare(right)).join("\0")}`;
			if (pendingAuth?.key === cacheKey) return pendingAuth.promise;
			const promise = worker.loadAuth({
				providerIds,
				...profileIds?.length ? { profileIds } : {}
			}).then((refreshed) => {
				const authModes = { ...resolveUsableAgentCredentialModes(params.agentFacts.credentials) };
				for (const providerId of providerIds) delete authModes[normalizeProviderId(providerId)];
				Object.assign(authModes, refreshed.authModes);
				return {
					authStore: refreshed.authStore,
					authModes: Object.freeze(authModes)
				};
			}).finally(() => {
				if (pendingAuth?.promise === promise) pendingAuth = void 0;
			});
			pendingAuth = {
				key: cacheKey,
				promise
			};
			return promise;
		},
		readFullModelCatalog: () => {
			assertCurrent();
			return fullCatalog;
		},
		loadFullModelCatalog: (options) => {
			try {
				assertCurrent();
			} catch (error) {
				return Promise.reject(toStringifiedError(error));
			}
			if (!options?.refresh && fullCatalog) return Promise.resolve(fullCatalog);
			if (!pending) pending = runSerializedPreparedModelRuntimeTask({
				agentDir: params.agentFacts.input.agentDir,
				agentBuildCompletions: params.agentBuildCompletions,
				isCurrent: params.isCurrent,
				task: async () => await limitFullModelCatalogBuild(async () => {
					assertCurrent();
					const catalog = await worker.loadCatalog();
					assertCurrent();
					return catalog;
				})
			}).then((catalog) => {
				fullCatalog = catalog;
				return catalog;
			}).finally(() => {
				pending = void 0;
			});
			return pending;
		}
	};
}
function createSnapshot(agentFacts, pluginGeneration, catalogFacts, catalogAccess) {
	const { credentials, input } = agentFacts;
	const { mediaCapabilityProviders, messageToolCatalog, pluginMetadataSnapshot, pluginRegistry } = pluginGeneration;
	const { configuredRuntimeModels, inlineProviderModels, modelCatalog, templateModelRegistry } = catalogFacts;
	const createStores = () => {
		const authStorage = AuthStorage.inMemory(credentials);
		return {
			authStorage,
			modelRegistry: templateModelRegistry.fork(authStorage)
		};
	};
	const snapshot = Object.freeze({
		...input.agentId ? { agentId: input.agentId } : {},
		agentDir: input.agentDir,
		activeProjectKeys: [],
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		config: input.config,
		authModes: resolveUsableAgentCredentialModes(credentials),
		metadataSnapshot: pluginMetadataSnapshot,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		...pluginRegistry ? { pluginRegistry } : {},
		...messageToolCatalog ? { messageToolCatalog } : {},
		...mediaCapabilityProviders ? { mediaCapabilityProviders } : {},
		modelCatalog,
		readFullModelCatalog: catalogAccess.readFullModelCatalog,
		loadFullModelCatalog: catalogAccess.loadFullModelCatalog,
		configuredRuntimeModels,
		inlineProviderModels,
		createStores
	});
	setPreparedModelRuntimeAuthStore(snapshot, agentFacts.authStore);
	setPreparedModelRuntimeAuthLoader(snapshot, catalogAccess.loadAuth);
	setPreparedModelRuntimeAuthMaterializations(snapshot, Object.freeze([...getPreparedRuntimeAuthMaterializations(input.agentDir)]));
	return snapshot;
}
async function buildSnapshotBatch(inputs, catalogMode, agentBuildCompletions, generationGuards, buildGuards, inboundPluginRegistryInputs, reusablePluginGenerations, onBuildStats) {
	const freshGroups = /* @__PURE__ */ new Map();
	const reusableGroups = /* @__PURE__ */ new Map();
	for (const input of inputs) {
		const reusablePluginGeneration = reusablePluginGenerations.get(input);
		if (reusablePluginGeneration) {
			const group = reusableGroups.get(reusablePluginGeneration);
			if (group) group.push(input);
			else reusableGroups.set(reusablePluginGeneration, [input]);
			continue;
		}
		const key = `${inboundPluginRegistryInputs.has(input) ? "configured" : "dynamic"}\0${preparedModelRuntimeWorkspaceFactsKey(input)}`;
		const group = freshGroups.get(key);
		if (group) group.push(input);
		else freshGroups.set(key, [input]);
	}
	const groups = [...[...reusableGroups].map(([pluginGeneration, groupInputs]) => ({
		groupInputs,
		pluginGeneration
	})), ...[...freshGroups.values()].map((groupInputs) => ({ groupInputs }))];
	const preparedInputs = /* @__PURE__ */ new Map();
	const pluginGenerations = /* @__PURE__ */ new Map();
	const loadInboundPluginRegistry = createPreparedInboundRegistryLoader();
	let runtimePluginMs = 0;
	let pluginMetadataMs = 0;
	let staticProviderCatalogMs = 0;
	let ambientCredentialsMs = 0;
	let agentFactsMs = 0;
	let configuredProjectionMs = 0;
	const workspaceFactsStartedAt = performance.now();
	for (const { groupInputs, pluginGeneration } of groups) {
		if (typeof buildGuards === "function") assertPreparedModelRuntimeInputsCurrent(groupInputs, buildGuards);
		const prepared = await prepareWorkspaceBuildGroup(groupInputs, catalogMode, {}, groupInputs.some((input) => inboundPluginRegistryInputs.has(input)) ? loadInboundPluginRegistry : void 0, pluginGeneration);
		assertPreparedModelRuntimeInputsCurrent(groupInputs, buildGuards);
		runtimePluginMs += prepared.buildStats.runtimePluginMs;
		pluginMetadataMs += prepared.buildStats.pluginMetadataMs;
		staticProviderCatalogMs += prepared.buildStats.staticProviderCatalogMs;
		ambientCredentialsMs += prepared.buildStats.ambientCredentialsMs;
		agentFactsMs += prepared.buildStats.agentFactsMs;
		configuredProjectionMs += prepared.buildStats.configuredProjectionMs;
		for (const agentFacts of prepared.agentFacts) {
			preparedInputs.set(agentFacts.input, agentFacts);
			pluginGenerations.set(agentFacts.input, prepared.pluginGeneration);
		}
	}
	const workspaceFactsMs = performance.now() - workspaceFactsStartedAt;
	const catalogSourceStartedAt = performance.now();
	const catalogSources = /* @__PURE__ */ new Map();
	if (catalogMode === "live") {
		const sourceInputsByAgentDir = /* @__PURE__ */ new Map();
		for (const input of inputs) {
			const group = sourceInputsByAgentDir.get(input.agentDir);
			if (group) group.push(input);
			else sourceInputsByAgentDir.set(input.agentDir, [input]);
		}
		const sourceErrors = [];
		const sourceBuild = await runTasksWithConcurrency({
			limit: MAX_CONCURRENT_MODEL_RUNTIME_AGENT_SOURCE_BUILDS,
			errorMode: "stop",
			onTaskError: (error) => {
				sourceErrors.push(error);
			},
			tasks: [...sourceInputsByAgentDir.values()].map((sourceInputs) => async () => {
				for (const input of sourceInputs) {
					const prepared = preparedInputs.get(input);
					const pluginGeneration = pluginGenerations.get(input);
					if (!prepared) throw new Error(`prepared model runtime agent facts missing for ${input.agentDir}`);
					if (!pluginGeneration) throw new Error(`prepared model runtime plugin generation missing for ${input.agentDir}`);
					assertPreparedModelRuntimeInputCurrent(input, buildGuards);
					const catalogSource = await prepareAgentCatalogSource(prepared, pluginGeneration, catalogMode);
					assertPreparedModelRuntimeInputCurrent(input, buildGuards);
					catalogSources.set(input, catalogSource);
				}
			})
		});
		if (sourceBuild.hasError) throw toStringifiedError(sourceErrors.find((error) => !(error instanceof PreparedModelRuntimePublicationSupersededError)) ?? sourceBuild.firstError);
	}
	const catalogSourceMs = performance.now() - catalogSourceStartedAt;
	const preparedCatalogs = /* @__PURE__ */ new Map();
	let runtimeRegistryCount = 0;
	const registryStartedAt = performance.now();
	if (catalogMode === "live") for (const input of inputs) {
		const agentFacts = preparedInputs.get(input);
		const pluginGeneration = pluginGenerations.get(input);
		if (!agentFacts || !pluginGeneration) throw new Error(`prepared model runtime facts missing for ${input.agentDir}`);
		const catalogSource = catalogSources.get(input);
		if (!catalogSource) throw new Error(`prepared model runtime catalog source missing for ${input.agentDir}`);
		assertPreparedModelRuntimeInputCurrent(input, buildGuards);
		preparedCatalogs.set(input, await prepareFullCatalogFacts(agentFacts, pluginGeneration, catalogMode, catalogSource));
		assertPreparedModelRuntimeInputCurrent(input, buildGuards);
		runtimeRegistryCount += 1;
	}
	else for (const { groupInputs } of groups) {
		assertPreparedModelRuntimeInputsCurrent(groupInputs, buildGuards);
		const pluginGeneration = pluginGenerations.get(groupInputs[0]);
		if (!pluginGeneration) throw new Error("prepared model runtime plugin generation is missing");
		const batch = prepareConfiguredRuntimeFactsBatch({
			agentFacts: groupInputs.map((input) => {
				const agentFacts = preparedInputs.get(input);
				if (!agentFacts) throw new Error(`prepared model runtime facts missing for ${input.agentDir}`);
				return agentFacts;
			}),
			pluginGeneration
		});
		runtimeRegistryCount += batch.registryCount;
		for (const [input, catalogFacts] of batch.catalogs) preparedCatalogs.set(input, catalogFacts);
		assertPreparedModelRuntimeInputsCurrent(groupInputs, buildGuards);
	}
	const registryMs = performance.now() - registryStartedAt;
	const preparedAgentFacts = [...preparedInputs.values()];
	const configuredRuntimeModelCount = [...preparedCatalogs.values()].reduce((count, facts) => count + facts.configuredRuntimeModels.length, 0);
	const generatedCatalogPluginCount = new Set(preparedAgentFacts.flatMap((facts) => facts.configuredGeneratedCatalogPluginIds)).size;
	const generatedCatalogReadCount = preparedAgentFacts.reduce((count, facts) => count + facts.configuredGeneratedCatalogPluginIds.length, 0);
	onBuildStats?.({
		agentCount: inputs.length,
		workspaceGroupCount: groups.length,
		configuredFactsGroupCount: groups.length,
		catalogSourceCount: catalogMode === "live" ? [...preparedInputs.values()].filter(({ input }) => !input.readOnly).length : 0,
		credentialGroupCount: new Set([...preparedInputs.values()].map((agentFacts) => fingerprintPreparedRuntimeFacts(agentFacts.credentials))).size,
		catalogGroupCount: catalogMode === "live" ? inputs.length : 0,
		runtimeRegistryCount,
		configuredRuntimeModelCount,
		generatedCatalogPluginCount,
		generatedCatalogReadCount,
		workspaceFactsMs,
		runtimePluginMs,
		pluginMetadataMs,
		staticProviderCatalogMs,
		ambientCredentialsMs,
		agentFactsMs,
		configuredProjectionMs,
		catalogSourceMs,
		registryMs,
		sourceConcurrencyLimit: MAX_CONCURRENT_MODEL_RUNTIME_AGENT_SOURCE_BUILDS,
		fullCatalogConcurrencyLimit: MAX_CONCURRENT_FULL_MODEL_CATALOG_BUILDS
	});
	assertPreparedModelRuntimeInputsCurrent(inputs, buildGuards);
	return inputs.map((input) => {
		const agentFacts = preparedInputs.get(input);
		const pluginGeneration = pluginGenerations.get(input);
		const catalogFacts = preparedCatalogs.get(input);
		if (!agentFacts || !pluginGeneration || !catalogFacts) throw new Error(`prepared model runtime snapshot facts missing for ${input.agentDir}`);
		return {
			snapshot: createSnapshot(agentFacts, pluginGeneration, catalogFacts, createFullModelCatalogAccess({
				agentFacts,
				pluginGeneration,
				agentBuildCompletions,
				isCurrent: generationGuards.get(input) ?? (() => false)
			})),
			pluginGeneration
		};
	});
}
function startSerializedSnapshotBuildBatch(inputs, agentBuildCompletions, buildTimeoutMs, catalogMode = "live", onBuildStats, generationGuards = /* @__PURE__ */ new Map(), buildGuards = generationGuards, inboundPluginRegistryInputs = /* @__PURE__ */ new Set(), reusablePluginGenerations = /* @__PURE__ */ new Map()) {
	const agentDirs = [...new Set(inputs.map((input) => input.agentDir))];
	const previousBuildCompletions = [...new Set(agentDirs.map((agentDir) => agentBuildCompletions.get(agentDir)).filter((completion) => completion !== void 0))];
	const startBuild = (async () => {
		if (previousBuildCompletions.length > 0) await Promise.all(previousBuildCompletions);
		return { actualBuild: buildSnapshotBatch(inputs, catalogMode, agentBuildCompletions, generationGuards, buildGuards, inboundPluginRegistryInputs, reusablePluginGenerations, onBuildStats) };
	})();
	const completion = startBuild.then(async ({ actualBuild }) => await actualBuild).then(() => void 0, () => void 0);
	for (const agentDir of agentDirs) {
		agentBuildCompletions.set(agentDir, completion);
		completion.then(() => {
			if (agentBuildCompletions.get(agentDir) === completion) agentBuildCompletions.delete(agentDir);
		});
	}
	return {
		pending: runAbortableTimeout(async () => {
			const { actualBuild } = await startBuild;
			return await actualBuild;
		}, buildTimeoutMs, "prepared model runtime publication"),
		completion
	};
}
function startSerializedSnapshotBuild(input, agentBuildCompletions, buildTimeoutMs, catalogMode = "live", generationGuard = () => true, prepareInboundPluginRegistry = false) {
	const build = startSerializedSnapshotBuildBatch([input], agentBuildCompletions, buildTimeoutMs, catalogMode, void 0, /* @__PURE__ */ new Map([[input, generationGuard]]), void 0, prepareInboundPluginRegistry ? /* @__PURE__ */ new Set([input]) : void 0);
	return {
		pending: build.pending.then((results) => results[0]),
		completion: build.completion
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.owner.ts
function createPreparedModelRuntimeOwner(input, provenance, catalogMode = "live") {
	return {
		input,
		environmentFingerprint: effectiveEnvironmentFingerprint(input),
		catalogMode,
		provenance,
		generation: 0,
		needsRefresh: true
	};
}
var PreparedModelRuntimeOwnerRetention = class {
	#retained = /* @__PURE__ */ new Map();
	constructor(maxSize) {
		this.maxSize = maxSize;
	}
	clear(owners) {
		for (const [key, owner] of this.#retained) if (owner.provenance === "run" && (owner.leaseCount ?? 0) === 0 && owners.get(key) === owner) owners.delete(key);
		this.#retained.clear();
	}
	has(key, owner) {
		return this.#retained.get(key) === owner;
	}
	retain(key, owner, owners) {
		if (owner.provenance !== "run") return;
		this.#retained.delete(key);
		this.#retained.set(key, owner);
		while (this.#retained.size > this.maxSize) {
			const oldest = this.#retained.entries().next().value;
			if (!oldest) return;
			const [oldestKey, oldestOwner] = oldest;
			this.#retained.delete(oldestKey);
			if ((oldestOwner.leaseCount ?? 0) === 0 && owners.get(oldestKey) === oldestOwner) owners.delete(oldestKey);
		}
	}
};
function findConfiguredOwnerCandidates(owners, rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const configured = [...owners.values()].filter((owner) => owner.provenance === "configured");
	const identityCandidates = input.agentId === void 0 ? [] : configured.filter((owner) => owner.input.agentId === input.agentId);
	const exactCandidates = identityCandidates.filter((owner) => owner.input.agentDir === input.agentDir);
	const directoryCandidates = configured.filter((owner) => owner.input.agentDir === input.agentDir);
	const canRebindByDirectory = input.agentId === void 0 || isReservedSystemAgentId(input.agentId);
	return exactCandidates.length > 0 ? exactCandidates : canRebindByDirectory && directoryCandidates.length > 0 ? directoryCandidates : identityCandidates;
}
/** Whether a configured owner matches the requesting runtime's identity/directory. */
function hasConfiguredOwnerMatching(owners, rawInput) {
	return findConfiguredOwnerCandidates(owners, rawInput).length > 0;
}
function rebindInputToCommittedConfiguredOwner(owners, rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const candidates = findConfiguredOwnerCandidates(owners, rawInput).filter((owner) => owner.snapshot && !owner.needsRefresh && !owner.pending);
	if (candidates.length !== 1) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not committed after replacement for ${input.agentDir}`);
	const owner = candidates[0];
	const preserveWorkspaceDir = input.preserveWorkspaceDirOnRefresh === true && input.workspaceDir !== void 0;
	const agentId = input.agentId ?? owner.input.agentId;
	return normalizePreparedModelRuntimeInput({
		...input,
		...agentId ? { agentId } : {},
		agentDir: owner.input.agentDir,
		config: owner.input.config,
		inheritedAuthDir: owner.input.inheritedAuthDir,
		env: owner.input.env,
		workspaceDir: preserveWorkspaceDir ? input.workspaceDir : owner.input.workspaceDir,
		preserveWorkspaceDirOnRefresh: preserveWorkspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding ?? owner.input.allowGatewaySubagentBinding,
		runtimePluginSelections: input.runtimePluginSelections ?? owner.input.runtimePluginSelections
	});
}
/** Accepts canonical config clones without weakening projected-config isolation. */
function preparedModelRuntimeConfigsMatch(left, right) {
	if (left === right) return true;
	try {
		return hashRuntimeConfigValue(left) === hashRuntimeConfigValue(right);
	} catch {
		return false;
	}
}
function normalizeOptionalDir(dirname) {
	return dirname ? path.resolve(dirname) : void 0;
}
function normalizePreparedModelRuntimeInput(input) {
	const { inheritedAuthDir: _inheritedAuthDir, readOnly, runtimePluginSelections: _runtimePluginSelections, skipCredentials, workspaceDir: _workspaceDir, ...rest } = input;
	const inheritedAuthDir = normalizeOptionalDir(input.inheritedAuthDir ?? resolveLegacyInheritedAuthDir(input.config, input.env));
	const workspaceDir = normalizeOptionalDir(input.workspaceDir);
	const env = input.env ? Object.freeze({ ...input.env }) : void 0;
	const runtimePluginSelections = input.runtimePluginSelections ? Object.freeze([...input.runtimePluginSelections].filter((selection) => requiresAgentHarnessPluginSelection(selection, input.config)).map((selection) => {
		const runtime = resolveSelectedAgentHarnessRuntime(selection, input.config);
		const { agentId: _agentId, ...normalized } = selection;
		return Object.freeze({
			...normalized,
			runtime
		});
	}).toSorted((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)))) : void 0;
	return {
		...rest,
		agentDir: path.resolve(input.agentDir),
		...inheritedAuthDir ? { inheritedAuthDir } : {},
		...readOnly === true ? { readOnly: true } : {},
		...skipCredentials === true ? { skipCredentials: true } : {},
		...workspaceDir ? { workspaceDir } : {},
		...env ? { env } : {},
		...input.allowGatewaySubagentBinding === true ? { allowGatewaySubagentBinding: true } : {},
		...runtimePluginSelections?.length ? { runtimePluginSelections } : {}
	};
}
function environmentFingerprint(env) {
	return env ? hashRuntimeConfigValue(env) : void 0;
}
function effectiveEnvironmentFingerprint(input) {
	return hashRuntimeConfigValue(input.env ?? process.env);
}
function ownerKey(input) {
	return JSON.stringify({
		agentId: input.agentId,
		agentDir: input.agentDir,
		inheritedAuthDir: input.inheritedAuthDir,
		readOnly: input.readOnly === true,
		loadRuntimePlugins: input.loadRuntimePlugins === true,
		skipCredentials: input.skipCredentials === true,
		workspaceDir: input.workspaceDir,
		env: environmentFingerprint(input.env),
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections,
		config: input.readOnly ? hashRuntimeConfigValue(input.config) : void 0
	});
}
function resolvePublishedOwner(owners, input, options = {}) {
	const exact = owners.get(ownerKey(input));
	if (exact) return exact;
	if (!options.allowConfiguredWorkspaceFallback) return;
	const candidates = [...owners.values()].filter((owner) => owner.provenance === "configured" && (input.agentId === void 0 || owner.input.agentId === input.agentId) && owner.input.agentDir === input.agentDir && owner.input.inheritedAuthDir === input.inheritedAuthDir && owner.input.readOnly === input.readOnly && owner.input.loadRuntimePlugins === input.loadRuntimePlugins && owner.input.skipCredentials === input.skipCredentials && (input.allowGatewaySubagentBinding === void 0 || owner.input.allowGatewaySubagentBinding === input.allowGatewaySubagentBinding) && (input.runtimePluginSelections === void 0 || JSON.stringify(owner.input.runtimePluginSelections) === JSON.stringify(input.runtimePluginSelections)) && (input.env === void 0 || owner.environmentFingerprint === environmentFingerprint(input.env)) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
	return candidates.length === 1 ? candidates[0] : void 0;
}
function hasSameLifecycleInput(left, right) {
	return left.config === right.config && left.agentId === right.agentId && left.inheritedAuthDir === right.inheritedAuthDir && left.readOnly === right.readOnly && left.loadRuntimePlugins === right.loadRuntimePlugins && left.skipCredentials === right.skipCredentials && left.workspaceDir === right.workspaceDir && environmentFingerprint(left.env) === environmentFingerprint(right.env) && left.preserveWorkspaceDirOnRefresh === right.preserveWorkspaceDirOnRefresh && left.allowGatewaySubagentBinding === right.allowGatewaySubagentBinding && JSON.stringify(left.runtimePluginSelections) === JSON.stringify(right.runtimePluginSelections);
}
function createPreparedModelRuntimeReplacement() {
	let resolve;
	let reject;
	const promise = new Promise((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});
	promise.catch(() => void 0);
	return {
		gateId: Symbol("prepared-model-runtime-replacement"),
		promise,
		resolve,
		reject
	};
}
function listConfiguredOwnerInputs(config, defaultWorkspaceDir, allowGatewaySubagentBinding) {
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const inheritedAuthDir = resolveLegacyInheritedAuthDir(config);
	return listAgentIds(config).map((agentId) => {
		const preserveWorkspaceDirOnRefresh = agentId === compatibilityAgentId && defaultWorkspaceDir;
		const input = {
			agentId,
			agentDir: resolveAgentDir(config, agentId),
			config,
			inheritedAuthDir,
			workspaceDir: preserveWorkspaceDirOnRefresh ? defaultWorkspaceDir : resolveAgentWorkspaceDir(config, agentId),
			runtimePluginSelections: resolveConfiguredRuntimePluginSelections(config, agentId)
		};
		if (allowGatewaySubagentBinding === true) input.allowGatewaySubagentBinding = true;
		if (preserveWorkspaceDirOnRefresh) input.preserveWorkspaceDirOnRefresh = true;
		return input;
	});
}
function resolveConfiguredRuntimePluginSelections(config, agentId) {
	const configured = resolveDefaultModelForAgent({
		cfg: config,
		agentId
	});
	return resolveModelCandidateChain({
		cfg: config,
		manifestPlugins: [],
		provider: configured.provider || "openai",
		model: configured.model || "gpt-5.6-sol",
		requestedRouteResolution: "resolved",
		fallbacksOverride: resolveRunModelFallbacksOverride({
			cfg: config,
			agentId
		})
	}).map((candidate) => ({
		provider: candidate.provider,
		modelId: candidate.model,
		agentId
	}));
}
async function publishPreparedModelRuntimeOwnerBatch(params) {
	const candidates = params.entries.map(({ owner, input }) => {
		owner.input = input;
		owner.environmentFingerprint = effectiveEnvironmentFingerprint(input);
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = void 0;
		const generation = owner.generation;
		const key = ownerKey(input);
		let registered = params.owners.get(key) === owner;
		return {
			catalogMode: owner.catalogMode,
			input,
			isEligible: () => (params.isPublicationCurrent?.() ?? true) && owner.generation === generation && (registered ? params.owners.get(key) === owner : params.registerEntriesAfterBuildStart === true),
			isCurrent: () => (params.isPublicationCurrent?.() ?? true) && owner.generation === generation && params.owners.get(key) === owner,
			key,
			markRegistered: () => {
				registered = true;
			},
			owner
		};
	});
	const groups = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const group = groups.get(candidate.catalogMode);
		if (group) group.push(candidate);
		else groups.set(candidate.catalogMode, [candidate]);
	}
	const results = /* @__PURE__ */ new Map();
	const publication = (async () => {
		try {
			while (true) {
				const attempt = candidates.filter((candidate) => candidate.isEligible() && !results.has(candidate.owner));
				if (attempt.length === 0) break;
				try {
					for (const [catalogMode, group] of groups) {
						const currentGroup = group.filter((candidate) => candidate.isEligible() && !results.has(candidate.owner));
						if (currentGroup.length === 0) continue;
						const build = startSerializedSnapshotBuildBatch(currentGroup.map(({ input }) => input), params.agentBuildCompletions, params.buildTimeoutMs, catalogMode, params.onBuildStats, new Map(currentGroup.map((candidate) => [candidate.input, candidate.isCurrent])), params.isBuildCurrent, new Set(currentGroup.filter((candidate) => candidate.owner.provenance === "configured").map((candidate) => candidate.input)), params.reusePluginGenerations ? new Map(currentGroup.flatMap((candidate) => candidate.owner.pluginGeneration ? [[candidate.input, candidate.owner.pluginGeneration]] : [])) : void 0);
						for (const candidate of currentGroup) {
							if (params.registerEntriesAfterBuildStart === true) {
								params.owners.set(candidate.key, candidate.owner);
								candidate.markRegistered();
							}
							candidate.owner.buildCompletion = build.completion;
							build.completion.then(() => {
								if (candidate.owner.buildCompletion === build.completion) candidate.owner.buildCompletion = void 0;
							});
						}
						const built = await build.pending;
						for (const [index, candidate] of currentGroup.entries()) results.set(candidate.owner, built[index]);
					}
					break;
				} catch (error) {
					const refreshError = toStringifiedError(error);
					const lostCandidate = attempt.some((candidate) => !candidate.isCurrent());
					if (!(refreshError instanceof PreparedModelRuntimePublicationSupersededError) || !(params.isPublicationCurrent?.() ?? true) || !lostCandidate) throw refreshError;
				}
			}
			for (const candidate of candidates) {
				if (!candidate.isCurrent()) continue;
				const result = results.get(candidate.owner);
				if (!result) throw new Error(`prepared model runtime snapshot missing after auth refresh for ${candidate.input.agentDir}`);
				candidate.owner.snapshot = result.snapshot;
				candidate.owner.pluginGeneration = result.pluginGeneration;
				candidate.owner.pending = void 0;
				candidate.owner.needsRefresh = false;
			}
		} catch (error) {
			const refreshError = toStringifiedError(error);
			for (const candidate of candidates) {
				if (!candidate.isCurrent()) continue;
				candidate.owner.pending = void 0;
				candidate.owner.needsRefresh = true;
				candidate.owner.refreshError = refreshError;
			}
			throw refreshError;
		}
	})();
	for (const candidate of candidates) {
		const pending = publication.then(() => {
			if (!candidate.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${candidate.input.agentDir}`);
			return results.get(candidate.owner).snapshot;
		});
		candidate.owner.pending = pending;
		pending.catch(() => void 0);
	}
	await publication;
}
async function publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, buildTimeoutMs, existing, provenance = "explicit", catalogMode = existing?.catalogMode ?? "live") {
	const key = ownerKey(input);
	const owner = existing ?? createPreparedModelRuntimeOwner(input, provenance, catalogMode);
	owner.input = input;
	owner.environmentFingerprint = effectiveEnvironmentFingerprint(input);
	owner.catalogMode = catalogMode;
	owner.provenance = provenance;
	owner.generation += 1;
	owner.needsRefresh = true;
	owner.refreshError = void 0;
	owner.pluginGeneration = void 0;
	const generation = owner.generation;
	const build = startSerializedSnapshotBuild(input, agentBuildCompletions, buildTimeoutMs, catalogMode, () => owner.generation === generation && owners.get(key) === owner, provenance === "configured");
	owner.buildCompletion = build.completion;
	build.completion.then(() => {
		if (owner.buildCompletion === build.completion) owner.buildCompletion = void 0;
	});
	owners.set(key, owner);
	const publication = (async () => {
		try {
			const result = await build.pending;
			if (owner.generation !== generation || owners.get(key) !== owner) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`);
			owner.snapshot = result.snapshot;
			owner.pluginGeneration = result.pluginGeneration;
			owner.pending = void 0;
			owner.needsRefresh = false;
			return result.snapshot;
		} catch (error) {
			const refreshError = toStringifiedError(error);
			if (owner.generation === generation && owners.get(key) === owner) {
				owner.pending = void 0;
				owner.needsRefresh = true;
				owner.refreshError = refreshError;
			}
			throw refreshError;
		}
	})();
	owner.pending = publication;
	return await publication;
}
//#endregion
//#region src/agents/prepared-model-runtime-lease.ts
/** Agent-run lease admission for lifecycle-owned prepared model runtimes. */
async function resolveCoalescedWorkspacePluginRootPresence(input, context) {
	const key = ownerKey(input);
	const existing = context.workspacePluginRootPresenceResolutions.get(key);
	if (existing) return await existing;
	const pending = resolveWorkspacePluginRootPresence(input);
	context.workspacePluginRootPresenceResolutions.set(key, pending);
	try {
		return await pending;
	} finally {
		if (context.workspacePluginRootPresenceResolutions.get(key) === pending) context.workspacePluginRootPresenceResolutions.delete(key);
	}
}
async function resolveWorkspacePluginRootPresence(input) {
	if (input.workspacePluginRootPresent !== void 0 || !input.workspaceDir) return input.workspacePluginRootPresent;
	return await fs.stat(path.join(input.workspaceDir, ".openclaw", "extensions")).then(() => true).catch((error) => {
		const code = error.code;
		if (code === "ENOENT" || code === "ENOTDIR") return false;
		throw error;
	});
}
async function acquirePreparedModelRuntimeLeaseFromOwners(rawInput, provenance, context, options = {}) {
	let normalizedInput = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	if (provenance === "run" && context.getGatewayLifecycleActive() && !context.getPendingReplacement()) try {
		normalizedInput = rebindInputToCommittedConfiguredOwner(context.owners, normalizedInput);
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	const retainedWorkspacePluginRootPresent = context.owners.get(ownerKey(normalizedInput))?.input.workspacePluginRootPresent;
	const workspacePluginRootPresent = rawInput.workspacePluginRootPresent ?? retainedWorkspacePluginRootPresent ?? (provenance === "run" ? await resolveCoalescedWorkspacePluginRootPresence(normalizedInput, context) : void 0);
	let input = normalizePreparedModelRuntimeInput({
		...normalizedInput,
		...workspacePluginRootPresent === void 0 ? {} : { workspacePluginRootPresent }
	});
	let key = ownerKey(input);
	let owner;
	let snapshot;
	for (;;) {
		const replacement = context.getPendingReplacement();
		if (replacement) {
			await replacement.promise;
			if (context.getPendingReplacement()) continue;
			if (provenance === "run") {
				input = rebindInputToCommittedConfiguredOwner(context.owners, input);
				key = ownerKey(input);
			}
			continue;
		}
		let existing = context.owners.get(key);
		let staleDynamicOwner = existing?.needsRefresh && !existing.pending && (existing.provenance === "run" || existing.provenance === "ephemeral");
		if (context.getGatewayLifecycleActive() && provenance === "run" && (!existing || staleDynamicOwner)) try {
			input = rebindInputToCommittedConfiguredOwner(context.owners, input);
			key = ownerKey(input);
			existing = context.owners.get(key);
			staleDynamicOwner = existing?.needsRefresh && !existing.pending && (existing.provenance === "run" || existing.provenance === "ephemeral");
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
			const canActivateConfiglessSetup = input.agentId !== void 0 && isReservedSystemAgentId(input.agentId);
			if (hasConfiguredOwnerMatching(context.owners, input) || !canActivateConfiglessSetup) throw error;
		}
		try {
			if (staleDynamicOwner) snapshot = await publishModelRuntimeSnapshot(input, context.owners, context.agentBuildCompletions, context.getBuildTimeoutMs(), void 0, provenance, options.catalogMode);
			else if (existing) snapshot = await context.prepareSnapshot(input);
			else snapshot = await context.publishSnapshot(input, {
				provenance,
				catalogMode: options.catalogMode
			});
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError) continue;
			throw error;
		}
		const published = context.owners.get(key);
		if (context.getPendingReplacement() || !published || published.snapshot !== snapshot || published.needsRefresh || published.pending) continue;
		owner = published;
		break;
	}
	if (owner.provenance !== provenance) return {
		snapshot,
		release: () => {}
	};
	if (provenance === "run" && options.retainIdleRunOwner) context.retainedDirectRunOwners.retain(key, owner, context.owners);
	else if (provenance === "run" && context.getGatewayLifecycleActive()) context.retainedGatewayRunOwners.retain(key, owner, context.owners);
	owner.leaseCount = (owner.leaseCount ?? 0) + 1;
	let released = false;
	return {
		snapshot,
		release: () => {
			if (released) return;
			released = true;
			owner.leaseCount = Math.max(0, (owner.leaseCount ?? 1) - 1);
			if (owner.leaseCount === 0 && context.owners.get(key) === owner) {
				if (!context.retainedDirectRunOwners.has(key, owner) && !context.retainedGatewayRunOwners.has(key, owner)) context.owners.delete(key);
			}
		}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime-materializations.ts
function registerPreparedRuntimeAuthMaterializationPublisher(owners, notify) {
	return registerRuntimeAuthMaterializationMutationListener((event) => {
		publishPreparedRuntimeAuthMaterializations({
			event,
			owners,
			onInvalidated: () => notify({ phase: "invalidated" }),
			onPublished: () => notify({ phase: "published" })
		});
	});
}
function publishPreparedRuntimeAuthMaterializations(params) {
	const event = {
		...params.event,
		agentDir: normalizeOptionalDir(params.event.agentDir)
	};
	const affectedOwners = [...params.owners.values()].flatMap((owner) => {
		return (event.affectsInheritedStores || owner.input.agentDir === event.agentDir || owner.input.inheritedAuthDir === event.agentDir) && owner.snapshot && !owner.pending && !owner.needsRefresh ? [{
			owner,
			snapshot: owner.snapshot
		}] : [];
	});
	if (affectedOwners.length === 0) return;
	params.onInvalidated();
	const read = params.read ?? getPreparedRuntimeAuthMaterializations;
	for (const { owner, snapshot } of affectedOwners) setPreparedModelRuntimeAuthMaterializations(snapshot, Object.freeze([...read(owner.input.agentDir)]));
	params.onPublished();
}
//#endregion
//#region src/agents/prepared-model-runtime.publication-events.ts
const log$1 = createSubsystemLogger("agents/prepared-model-runtime");
const publicationListeners = /* @__PURE__ */ new Set();
/** Observes committed prepared model/auth generations without starting discovery. */
function registerPreparedModelRuntimePublicationListener(listener) {
	publicationListeners.add(listener);
	return () => publicationListeners.delete(listener);
}
function notifyPreparedModelRuntimePublication(event) {
	for (const listener of publicationListeners) try {
		listener(event);
	} catch (error) {
		log$1.warn(`prepared model runtime publication listener failed: ${String(error)}`);
	}
}
function resetPreparedModelRuntimePublicationListenersForTest() {
	publicationListeners.clear();
}
//#endregion
//#region src/agents/prepared-reply-dispatch-runtime.ts
const EMPTY_REPLY_DISPATCH_PUBLICATION = Object.freeze({ runtimes: Object.freeze([]) });
function createReplyDispatchRuntime(runtimeOwner) {
	const snapshot = runtimeOwner.snapshot;
	const owner = resolvePublishedModelCatalogOwner(snapshot);
	const inboundPluginRegistry = runtimeOwner.pluginGeneration?.inboundPluginRegistry;
	if (!inboundPluginRegistry) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared inbound plugin registry was not published for ${snapshot.agentDir}`);
	return Object.freeze({
		agentId: owner.agentId,
		agentDir: owner.agentDir,
		workspaceDir: owner.workspaceDir,
		config: owner.config,
		modelCatalog: owner.modelCatalog,
		inboundPluginRegistry
	});
}
function buildReplyDispatchPublication(owners) {
	const runtimes = [...owners].filter((owner) => owner.provenance === "configured").map((owner) => {
		if (!owner.snapshot || owner.needsRefresh || owner.pending) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared reply dispatch runtime owner was not published for ${owner.input.agentId ?? owner.input.agentDir}`);
		return createReplyDispatchRuntime(owner);
	}).toSorted((left, right) => left.agentId.localeCompare(right.agentId));
	if (new Set(runtimes.map((runtime) => runtime.agentId)).size !== runtimes.length) throw new PreparedModelRuntimeOwnerNotPublishedError("prepared reply dispatch runtime publication contains duplicate configured agents");
	return Object.freeze({ runtimes: Object.freeze(runtimes) });
}
function removeReplyDispatchRuntimeProjections(publication, agentIds) {
	if (agentIds.size === 0) return publication;
	return Object.freeze({ runtimes: Object.freeze(publication.runtimes.filter((runtime) => !agentIds.has(runtime.agentId))) });
}
/** Reads one immutable configured Gateway dispatch generation without activating an owner. */
var PreparedReplyDispatchPublicationOwner = class {
	#publication;
	constructor(host) {
		this.host = host;
		this.#publication = EMPTY_REPLY_DISPATCH_PUBLICATION;
		this.load = async ({ agentId }) => {
			for (;;) {
				if (!this.host.isGatewayLifecycleActive()) return;
				const replacement = this.host.getPendingReplacement();
				if (replacement) {
					await replacement;
					continue;
				}
				const matches = this.#publication.runtimes.filter((runtime) => runtime.agentId === agentId);
				if (matches.length !== 1) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared reply dispatch runtime owner was not published for ${agentId}`);
				return matches[0];
			}
		};
	}
	clear() {
		this.#publication = EMPTY_REPLY_DISPATCH_PUBLICATION;
	}
	rebuild(owners) {
		this.#publication = this.host.isGatewayLifecycleActive() ? buildReplyDispatchPublication(owners) : EMPTY_REPLY_DISPATCH_PUBLICATION;
	}
	remove(agentIds) {
		this.#publication = removeReplyDispatchRuntimeProjections(this.#publication, agentIds);
	}
};
//#endregion
//#region src/agents/prepared-model-runtime.ts
/** Lifecycle-owned auth/model discovery snapshots for agent runs. */
const log = createSubsystemLogger("agents/prepared-model-runtime");
const DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS = 12e4;
let modelRuntimeBuildTimeoutMs = DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS;
const owners = /* @__PURE__ */ new Map();
const agentBuildCompletions = /* @__PURE__ */ new Map();
const workspacePluginRootPresenceResolutions = /* @__PURE__ */ new Map();
const standaloneActivationTails = /* @__PURE__ */ new Map();
const retainedDirectRunOwners = new PreparedModelRuntimeOwnerRetention(1);
const retainedGatewayRunOwners = new PreparedModelRuntimeOwnerRetention(8);
let gatewayLifecycleActive = false;
let refreshTail = Promise.resolve();
let refreshRequestEpoch = 0;
let pendingModelRuntimeReplacement;
const pendingAuthMutations = [];
const replyDispatchPublication = new PreparedReplyDispatchPublicationOwner({
	isGatewayLifecycleActive: () => gatewayLifecycleActive,
	getPendingReplacement: () => pendingModelRuntimeReplacement?.promise
});
const loadPublishedGatewayReplyDispatchRuntime = replyDispatchPublication.load;
/** Resolves a published owner or activates a standalone lifecycle owner. */
async function loadPreparedModelRuntimeSnapshot(rawInput) {
	let input = normalizePreparedModelRuntimeInput({
		...rawInput,
		preserveWorkspaceDirOnRefresh: rawInput.preserveWorkspaceDirOnRefresh ?? rawInput.workspaceDir !== void 0
	});
	for (;;) {
		const replacement = pendingModelRuntimeReplacement;
		if (replacement) {
			await replacement.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			continue;
		}
		try {
			return await prepareModelRuntimeSnapshot(input);
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
		const activationGate = pendingModelRuntimeReplacement;
		if (activationGate) {
			await activationGate.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			continue;
		}
		const activated = await activateStandalonePreparedModelRuntime(input);
		const replacementAfterActivation = pendingModelRuntimeReplacement;
		if (replacementAfterActivation) {
			await replacementAfterActivation.promise;
			if (pendingModelRuntimeReplacement) continue;
			input = rebindInputToCommittedConfiguredOwner(owners, input);
			continue;
		}
		if (!activated) return await prepareModelRuntimeSnapshot(input);
		try {
			return await prepareModelRuntimeSnapshot(input);
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
	}
}
/** Returns an already-published generation without starting discovery. */
function getPreparedModelRuntimeSnapshot(rawInput) {
	if (pendingModelRuntimeReplacement) return;
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const owner = resolvePublishedOwner(owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 || rawInput.runtimePluginSelections === void 0 });
	if (!owner?.snapshot || owner.needsRefresh || owner.pending) return;
	if (input.readOnly && !preparedModelRuntimeConfigsMatch(owner.input.config, input.config)) return;
	return owner.snapshot;
}
/** Publishes one owner from an explicit startup/activation lifecycle boundary. */
async function publishPreparedModelRuntimeSnapshot(rawInput, options = {}) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const existing = owners.get(ownerKey(input));
	if (existing?.pending) {
		if (!options.force && hasSameLifecycleInput(existing.input, input)) return await existing.pending;
		return await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, modelRuntimeBuildTimeoutMs, existing, options.provenance, options.catalogMode);
	}
	if (existing?.buildCompletion) throw existing.refreshError ?? /* @__PURE__ */ new Error(`prepared model runtime build is still settling for ${input.agentDir}`);
	if (existing?.snapshot && !existing.needsRefresh && !options.force && hasSameLifecycleInput(existing.input, input)) return existing.snapshot;
	return await publishModelRuntimeSnapshot(input, owners, agentBuildCompletions, modelRuntimeBuildTimeoutMs, existing, options.provenance, options.catalogMode);
}
/** Activates lifecycle publication for direct embedded runtimes without a gateway startup. */
async function activateStandalonePreparedModelRuntime(rawInput) {
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const key = ownerKey(input);
	const activation = (standaloneActivationTails.get(key) ?? Promise.resolve()).then(async () => await activateStandalonePreparedModelRuntimeNow(input));
	const tail = activation.then(() => void 0, () => void 0);
	standaloneActivationTails.set(key, tail);
	try {
		return await activation;
	} finally {
		if (standaloneActivationTails.get(key) === tail) standaloneActivationTails.delete(key);
	}
}
async function activateStandalonePreparedModelRuntimeNow(input) {
	for (;;) {
		const overlapsConfiguredOwner = [...owners.values()].some((owner) => owner.provenance === "configured" && owner.input.agentDir === input.agentDir && (input.agentId === void 0 || owner.input.agentId === input.agentId) && (input.workspaceDir === void 0 || owner.input.workspaceDir === input.workspaceDir));
		if (gatewayLifecycleActive && (!input.readOnly || overlapsConfiguredOwner)) return;
		try {
			return await publishPreparedModelRuntimeSnapshot({
				...input,
				preserveWorkspaceDirOnRefresh: input.workspaceDir !== void 0
			}, { provenance: "standalone" });
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimePublicationSupersededError)) throw error;
			const replacement = pendingModelRuntimeReplacement;
			if (replacement) await replacement.promise;
		}
	}
}
const preparedModelRuntimeLeaseContext = {
	owners,
	agentBuildCompletions,
	workspacePluginRootPresenceResolutions,
	retainedDirectRunOwners,
	retainedGatewayRunOwners,
	getBuildTimeoutMs: () => modelRuntimeBuildTimeoutMs,
	getGatewayLifecycleActive: () => gatewayLifecycleActive,
	getPendingReplacement: () => pendingModelRuntimeReplacement,
	prepareSnapshot: prepareModelRuntimeSnapshot,
	publishSnapshot: publishPreparedModelRuntimeSnapshot
};
/** Acquires the exact writable workspace generation at agent-run admission. */
async function acquireAgentRunPreparedModelRuntime(rawInput, options = {}) {
	return await acquirePreparedModelRuntimeLeaseFromOwners(rawInput, "run", preparedModelRuntimeLeaseContext, options);
}
/** Acquires an exact read-only generation scoped to the returned lease. */
async function acquireReadOnlyPreparedModelRuntime(rawInput) {
	return await acquirePreparedModelRuntimeLeaseFromOwners({
		...rawInput,
		readOnly: true
	}, "ephemeral", preparedModelRuntimeLeaseContext);
}
/** Returns the snapshot published by the lifecycle owner. Request config cannot replace it. */
async function prepareModelRuntimeSnapshot(rawInput) {
	const replacement = pendingModelRuntimeReplacement;
	if (replacement) {
		await replacement.promise;
		return await prepareModelRuntimeSnapshot(rawInput);
	}
	const input = normalizePreparedModelRuntimeInput(rawInput);
	const existing = resolvePublishedOwner(owners, input, { allowConfiguredWorkspaceFallback: rawInput.workspaceDir === void 0 || rawInput.agentId === void 0 || rawInput.runtimePluginSelections === void 0 });
	if (input.readOnly && existing && !preparedModelRuntimeConfigsMatch(existing.input.config, input.config)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared read-only model runtime owner was not published for the requested config (${input.agentDir})`);
	if (existing?.pending) {
		try {
			await existing.pending;
		} catch {}
		return await prepareModelRuntimeSnapshot(rawInput);
	}
	if (existing?.needsRefresh) throw existing.refreshError ?? /* @__PURE__ */ new Error("prepared model runtime refresh is pending");
	if (existing?.snapshot) return existing.snapshot;
	throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model runtime owner was not published for ${input.agentDir}`);
}
/** Invalidates every published generation before config/plugin runtime replacement. */
function markPreparedModelRuntimeSnapshotsStale(reason = "prepared model runtime owner is stale after config publication", options = {}) {
	replyDispatchPublication.clear();
	if (options.waitForReplacement) {
		const superseded = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = createPreparedModelRuntimeReplacement();
		superseded?.resolve();
	} else if (!options.preserveReplacementWait && pendingModelRuntimeReplacement) {
		const cancelled = pendingModelRuntimeReplacement;
		pendingModelRuntimeReplacement = void 0;
		cancelled.resolve();
	}
	refreshRequestEpoch += 1;
	const staleError = new Error(reason);
	for (const [key, owner] of owners) {
		if (owner.provenance === "standalone") {
			owner.generation += 1;
			owners.delete(key);
			continue;
		}
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = staleError;
		owner.pluginGeneration = void 0;
	}
	notifyPreparedModelRuntimePublication({ phase: "invalidated" });
	if (!pendingModelRuntimeReplacement) notifyPreparedModelRuntimePublication({
		phase: "failed",
		error: staleError
	});
	return pendingModelRuntimeReplacement?.gateId;
}
/** Rejects readers waiting for a replacement when its owning reload cannot continue. */
function rejectPendingPreparedModelRuntimeReplacement(gateId, error) {
	const replacement = pendingModelRuntimeReplacement;
	if (!replacement || !gateId || replacement.gateId !== gateId) return;
	pendingModelRuntimeReplacement = void 0;
	const replacementError = toStringifiedError(error);
	replacement.reject(replacementError);
	notifyPreparedModelRuntimePublication({
		phase: "failed",
		error: replacementError
	});
}
/** Rebuilds active owners after config/plugin runtime publication. */
async function refreshPreparedModelRuntimeSnapshotsNow(config, options, publicationEpoch) {
	retainedGatewayRunOwners.clear(owners);
	const { defaultWorkspaceDir: workspace, allowGatewaySubagentBinding: bindings } = options;
	const catalogMode = options.catalogMode ?? "live";
	gatewayLifecycleActive ||= options.gatewayLifecycle === true;
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after config publication");
	for (const owner of owners.values()) {
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = staleError;
	}
	const entries = [];
	const knownKeys = /* @__PURE__ */ new Set();
	for (const rawInput of listConfiguredOwnerInputs(config, workspace, bindings)) {
		let input = normalizePreparedModelRuntimeInput(rawInput);
		const workspacePluginRootPresent = await resolveWorkspacePluginRootPresence(input);
		if (workspacePluginRootPresent !== void 0) input = normalizePreparedModelRuntimeInput({
			...input,
			workspacePluginRootPresent
		});
		const preservedOwner = [...owners.values()].find((owner) => owner.provenance === "configured" && owner.input.agentId === input.agentId && owner.input.agentDir === input.agentDir && owner.input.preserveWorkspaceDirOnRefresh && owner.input.workspaceDir);
		if (preservedOwner?.input.workspaceDir) input = {
			...input,
			workspaceDir: preservedOwner.input.workspaceDir,
			preserveWorkspaceDirOnRefresh: true
		};
		const key = ownerKey(input);
		if (knownKeys.has(key)) continue;
		knownKeys.add(key);
		const owner = owners.get(key);
		entries.push({
			owner,
			input
		});
	}
	for (const [key, owner] of owners) if (!knownKeys.has(key) && (gatewayLifecycleActive || owner.provenance === "configured")) owners.delete(key);
	await publishPreparedModelRuntimeOwnerBatch({
		entries: entries.map(({ owner: existing, input }) => {
			const owner = existing?.provenance === "configured" ? existing : createPreparedModelRuntimeOwner(input, "configured", catalogMode);
			owner.input = input;
			owner.environmentFingerprint = effectiveEnvironmentFingerprint(input);
			owner.catalogMode = catalogMode;
			owner.provenance = "configured";
			return {
				input,
				owner
			};
		}),
		owners,
		agentBuildCompletions,
		buildTimeoutMs: modelRuntimeBuildTimeoutMs,
		isPublicationCurrent: () => publicationEpoch === refreshRequestEpoch,
		isBuildCurrent: () => publicationEpoch === refreshRequestEpoch,
		onBuildStats: options.onBuildStats,
		registerEntriesAfterBuildStart: true
	});
}
/** Serializes config/plugin publications so only the latest completed refresh retires owners. */
function refreshPreparedModelRuntimeSnapshots(config, options = {}) {
	markPreparedModelRuntimeSnapshotsStale(void 0, { waitForReplacement: true });
	const requestEpoch = refreshRequestEpoch;
	const replacement = pendingModelRuntimeReplacement;
	return enqueuePreparedModelRuntimePublication(async () => {
		if (requestEpoch !== refreshRequestEpoch) return;
		await refreshPreparedModelRuntimeSnapshotsNow(config, options, requestEpoch);
		if (requestEpoch !== refreshRequestEpoch) return;
		await drainPendingAuthMutations();
		if (requestEpoch !== refreshRequestEpoch) return;
		replyDispatchPublication.rebuild(owners.values());
	}).then(() => {
		if (requestEpoch === refreshRequestEpoch && replacement && pendingModelRuntimeReplacement === replacement) {
			pendingModelRuntimeReplacement = void 0;
			replacement.resolve();
			notifyPreparedModelRuntimePublication({ phase: "published" });
		}
	}, (error) => {
		const refreshError = toStringifiedError(error);
		if (requestEpoch === refreshRequestEpoch) for (const owner of owners.values()) {
			owner.generation += 1;
			owner.pending = void 0;
			owner.needsRefresh = true;
			owner.refreshError = refreshError;
			owner.pluginGeneration = void 0;
		}
		if (requestEpoch === refreshRequestEpoch && replacement && pendingModelRuntimeReplacement === replacement) {
			pendingModelRuntimeReplacement = void 0;
			replacement.reject(refreshError);
			notifyPreparedModelRuntimePublication({
				phase: "failed",
				error: refreshError
			});
		}
		throw refreshError;
	});
}
function enqueuePreparedModelRuntimePublication(task) {
	const publication = refreshTail.then(task);
	refreshTail = publication.then(() => void 0, () => void 0);
	return publication;
}
async function drainPendingAuthMutations() {
	while (pendingAuthMutations.length > 0) {
		const events = pendingAuthMutations.splice(0);
		for (const event of events) event.agentDir = normalizeOptionalDir(event.agentDir);
		const entries = [];
		for (const owner of owners.values()) if (events.some((event) => event.affectsInheritedStores || owner.input.agentDir === event.agentDir || owner.input.inheritedAuthDir === event.agentDir)) entries.push({
			owner,
			input: owner.input
		});
		await publishPreparedModelRuntimeOwnerBatch({
			entries,
			owners,
			agentBuildCompletions,
			buildTimeoutMs: modelRuntimeBuildTimeoutMs,
			reusePluginGenerations: true
		});
	}
}
function invalidateForAuthMutation(event) {
	const normalizedEvent = {
		...event,
		agentDir: normalizeOptionalDir(event.agentDir)
	};
	const staleError = /* @__PURE__ */ new Error("prepared model runtime owner is stale after auth mutation");
	let invalidatedOwner = false;
	const invalidatedConfiguredAgentIds = /* @__PURE__ */ new Set();
	for (const owner of owners.values()) {
		if (!normalizedEvent.affectsInheritedStores && owner.input.agentDir !== normalizedEvent.agentDir && owner.input.inheritedAuthDir !== normalizedEvent.agentDir) continue;
		invalidatedOwner = true;
		owner.generation += 1;
		owner.needsRefresh = true;
		owner.refreshError = staleError;
		if (owner.provenance === "configured" && owner.input.agentId) invalidatedConfiguredAgentIds.add(owner.input.agentId);
	}
	if (!invalidatedOwner) return;
	replyDispatchPublication.remove(invalidatedConfiguredAgentIds);
	notifyPreparedModelRuntimePublication({ phase: "invalidated" });
	pendingAuthMutations.push(normalizedEvent);
	enqueuePreparedModelRuntimePublication(async () => {
		await drainPendingAuthMutations();
		replyDispatchPublication.rebuild(owners.values());
		notifyPreparedModelRuntimePublication({ phase: "published" });
	}).catch((error) => {
		if (error instanceof PreparedModelRuntimePublicationSupersededError) return;
		const refreshError = toStringifiedError(error);
		notifyPreparedModelRuntimePublication({
			phase: "failed",
			error: refreshError
		});
		log.warn(`auth-triggered model runtime refresh failed: ${String(refreshError)}`);
	});
}
registerRuntimeAuthProfileStoreMutationListener(invalidateForAuthMutation);
registerPreparedRuntimeAuthMaterializationPublisher(owners, notifyPreparedModelRuntimePublication);
function resetPreparedModelRuntimeSnapshotsForTest() {
	pendingModelRuntimeReplacement?.resolve();
	pendingModelRuntimeReplacement = void 0;
	owners.clear();
	agentBuildCompletions.clear();
	workspacePluginRootPresenceResolutions.clear();
	standaloneActivationTails.clear();
	retainedGatewayRunOwners.clear(owners);
	gatewayLifecycleActive = false;
	refreshTail = Promise.resolve();
	refreshRequestEpoch = 0;
	pendingAuthMutations.length = 0;
	replyDispatchPublication.clear();
	resetPreparedModelRuntimePublicationListenersForTest();
	modelRuntimeBuildTimeoutMs = DEFAULT_MODEL_RUNTIME_BUILD_TIMEOUT_MS;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.preparedModelRuntimeTestApi")] = {
	resetPreparedModelRuntimeSnapshotsForTest,
	getPreparedModelRuntimeOwnerCountForTest: () => owners.size,
	setModelRuntimeBuildTimeoutMsForTest: (timeoutMs) => {
		modelRuntimeBuildTimeoutMs = timeoutMs;
	}
};
//#endregion
export { loadPreparedModelRuntimeSnapshot as a, prepareModelRuntimeSnapshot as c, rejectPendingPreparedModelRuntimeReplacement as d, registerPreparedModelRuntimePublicationListener as f, getPreparedModelRuntimeSnapshot as i, publishPreparedModelRuntimeSnapshot as l, acquireReadOnlyPreparedModelRuntime as n, loadPublishedGatewayReplyDispatchRuntime as o, preparedModelRuntimeConfigsMatch as p, activateStandalonePreparedModelRuntime as r, markPreparedModelRuntimeSnapshotsStale as s, acquireAgentRunPreparedModelRuntime as t, refreshPreparedModelRuntimeSnapshots as u };
