import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { O as resolveSessionAuthProfileOverrideSource } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { x as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-Cv5MaU8U.js";
import { p as getActivePluginRegistryVersion } from "./runtime-B2KAtS3O.js";
import { s as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-C6iqqcJy.js";
import { c as getRuntimeAuthProfileStoreSnapshotRevision } from "./runtime-snapshots-a_60jBeK.js";
import { n as getPreparedModelFullCatalogAuth, r as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-runtime-auth-CnrySjUa.js";
import { i as getPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-hBq_POnm.js";
import "./auth-profiles-wr_j3m1O.js";
import { r as getSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as resolveSwarmConfig } from "./swarm-config-Df_H07Y6.js";
//#region src/gateway/server-methods/chat-metadata-runtime.ts
const CHAT_METADATA_CACHE_MAX_ENTRIES = 64;
function createMetadataReplacement() {
	let resolve;
	let reject;
	const promise = new Promise((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});
	promise.catch(() => {});
	return {
		promise,
		reject,
		resolve
	};
}
var ChatMetadataSnapshotUnavailableError = class extends Error {
	constructor(message = "prepared chat metadata snapshot is unavailable") {
		super(message);
		this.name = "ChatMetadataSnapshotUnavailableError";
	}
};
function captureGenerationFacts(deps) {
	const config = deps.getConfig();
	const agents = listAgentIds(config).map((rawAgentId) => {
		const agentId = normalizeAgentId(rawAgentId);
		const owner = deps.getPreparedOwner({
			agentId,
			config
		});
		if (!owner) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata owner is unavailable for agent "${agentId}"`);
		const workspaceDir = owner.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
		const fullModelCatalog = owner.readFullModelCatalog?.();
		const fullCatalogAuth = fullModelCatalog ? getPreparedModelFullCatalogAuth(fullModelCatalog) : void 0;
		if (fullModelCatalog && !fullCatalogAuth) throw new Error("prepared full model catalog omitted its auth generation");
		return {
			agentId,
			owner,
			authStore: fullCatalogAuth?.authStore ?? deps.getPreparedAuthStore(owner.agentDir, owner.inheritedAuthDir) ?? {
				version: 1,
				profiles: {}
			},
			authModes: fullCatalogAuth?.authModes ?? owner.authModes,
			authStoreRevision: `${deps.getAuthStoreRevision(owner.agentDir)}:${deps.getAuthStoreRevision(owner.inheritedAuthDir)}`,
			modelCatalog: fullModelCatalog ?? owner.modelCatalog,
			skillsVersion: deps.getSkillsVersion(workspaceDir)
		};
	});
	return {
		config,
		configKey: resolveRuntimeConfigCacheKey(config),
		pluginRegistryVersion: deps.getPluginRegistryVersion(),
		agents
	};
}
function generationFactsMatch(left, right) {
	if (left.configKey !== right.configKey || left.pluginRegistryVersion !== right.pluginRegistryVersion || left.agents.length !== right.agents.length) return false;
	return left.agents.every((agent, index) => {
		const candidate = right.agents[index];
		return candidate?.agentId === agent.agentId && candidate.owner === agent.owner && candidate.authStoreRevision === agent.authStoreRevision && candidate.modelCatalog === agent.modelCatalog && candidate.skillsVersion === agent.skillsVersion;
	});
}
function resolveSessionProfiles(sessionEntry) {
	const profileId = sessionEntry?.authProfileOverride?.trim();
	if (!profileId) return {};
	return {
		preferredProfileId: profileId,
		...resolveSessionAuthProfileOverrideSource(sessionEntry) === "user" ? { lockedProfileId: profileId } : {}
	};
}
function sessionProjectionKey(agentId, profiles) {
	return [
		normalizeAgentId(agentId),
		profiles.preferredProfileId ?? "",
		profiles.lockedProfileId ?? ""
	].join("\0");
}
async function defaultBuildCommands(params) {
	const { buildCommandsListResult } = await import("./commands-list-result-BwAo3Rjd.js");
	return buildCommandsListResult({
		cfg: params.cfg,
		agentId: params.agentId,
		includeArgs: true,
		scope: "text"
	});
}
async function defaultBuildProjection(params) {
	const { buildModelsListResult, createGatewayAgentModelCatalogProjector } = await import("./models-list-result-_T7QfOtg.js");
	const snapshot = params.facts.modelCatalog;
	const projector = createGatewayAgentModelCatalogProjector({
		cfg: params.facts.owner.config,
		agentId: params.facts.agentId,
		snapshot,
		metadataSnapshot: params.facts.owner.metadataSnapshot,
		preparedAuthStore: params.facts.authStore,
		preparedRuntimeAuthModes: params.facts.authModes,
		preparedRuntimeAuthMaterializations: getPreparedModelRuntimeAuthMaterializations(params.facts.owner),
		...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
		...params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {}
	});
	const [modelCatalog, metadata] = await Promise.all([projector.projectCatalog(), buildModelsListResult({
		context: params.context,
		agentId: params.facts.agentId,
		params: { view: "configured" },
		preloadedCatalog: {
			agentId: params.facts.agentId,
			config: params.facts.owner.config,
			snapshot
		},
		preloadedOnly: true,
		catalogProjector: projector
	})]);
	return {
		modelCatalog,
		models: metadata.models
	};
}
function createGatewayChatMetadataRuntime(params) {
	const deps = {
		getConfig: params.getConfig,
		getContext: params.getContext,
		getPreparedOwner: getPublishedPreparedModelCatalogOwnerSnapshot,
		getPreparedAuthStore: getPreparedRuntimeAuthProfileStoreSnapshot,
		getAuthStoreRevision: getRuntimeAuthProfileStoreSnapshotRevision,
		getSkillsVersion: getSkillsSnapshotVersion,
		getPluginRegistryVersion: getActivePluginRegistryVersion,
		buildCommands: defaultBuildCommands,
		buildProjection: defaultBuildProjection,
		...params.deps
	};
	let current;
	let lastError;
	let replacement;
	let invalidationEpoch = 0;
	let refreshTail = Promise.resolve();
	let pending;
	const projectAgent = (generation, agent, sessionEntry) => {
		const profiles = resolveSessionProfiles(sessionEntry);
		const neutral = profiles.preferredProfileId === void 0 && profiles.lockedProfileId === void 0;
		const projections = neutral ? generation.neutralProjectionByAgentId : generation.sessionProjectionByKey;
		const key = neutral ? agent.agentId : sessionProjectionKey(agent.agentId, profiles);
		const existing = projections.get(key);
		if (existing) return existing;
		const projection = deps.buildProjection({
			context: deps.getContext(),
			facts: agent,
			...profiles
		}).then(({ modelCatalog, ...models }) => ({
			modelCatalog,
			metadata: {
				...models,
				...agent.commands !== void 0 ? { commands: agent.commands } : {},
				swarmEnabled: agent.swarmEnabled
			}
		})).catch((error) => {
			projections.delete(key);
			throw error;
		});
		projections.set(key, projection);
		if (!neutral) pruneMapToMaxSize(projections, CHAT_METADATA_CACHE_MAX_ENTRIES);
		return projection;
	};
	const buildGeneration = async (facts, epoch) => {
		const agents = await Promise.all(facts.agents.map(async (agent) => {
			let commands;
			try {
				commands = (await deps.buildCommands({
					cfg: facts.config,
					agentId: agent.agentId
				})).commands;
			} catch (error) {
				params.log.warn(`chat metadata continuing without text commands for ${agent.agentId}: ${formatErrorMessage(error)}`);
			}
			return {
				...agent,
				...commands !== void 0 ? { commands } : {},
				swarmEnabled: resolveSwarmConfig(facts.config, agent.agentId).enabled
			};
		}));
		const generation = {
			epoch,
			facts,
			agentsById: new Map(agents.map((agent) => [agent.agentId, agent])),
			neutralProjectionByAgentId: /* @__PURE__ */ new Map(),
			sessionProjectionByKey: /* @__PURE__ */ new Map()
		};
		if (epoch !== invalidationEpoch) return false;
		await Promise.all(agents.map((agent) => projectAgent(generation, agent)));
		if (epoch !== invalidationEpoch) return false;
		current = generation;
		return epoch === invalidationEpoch;
	};
	const runRefresh = async () => {
		await params.beforeRefresh?.();
		for (;;) {
			const facts = captureGenerationFacts(deps);
			if (current && generationFactsMatch(current.facts, facts)) return;
			const epoch = invalidationEpoch;
			if (!await buildGeneration(facts, epoch)) continue;
			const latest = captureGenerationFacts(deps);
			if (epoch === invalidationEpoch && generationFactsMatch(facts, latest)) return;
		}
	};
	const refresh = () => {
		const trackRefresh = (promise, facts) => {
			refreshTail = promise;
			pending = {
				...facts ? { facts } : {},
				promise
			};
			promise.then(() => {
				if (pending?.promise !== promise) return;
				pending = void 0;
				if (current?.epoch !== invalidationEpoch) return;
				lastError = void 0;
				const committedReplacement = replacement;
				replacement = void 0;
				committedReplacement?.resolve();
			}, (error) => {
				if (pending?.promise !== promise) return;
				pending = void 0;
				fail(error);
			});
			return promise;
		};
		if (params.beforeRefresh) {
			if (pending) return pending.promise;
			return trackRefresh(refreshTail.catch(() => {}).then(runRefresh));
		}
		let facts;
		try {
			facts = captureGenerationFacts(deps);
		} catch (error) {
			const refreshError = error instanceof Error ? error : new Error(formatErrorMessage(error));
			fail(refreshError);
			return Promise.reject(refreshError);
		}
		if (current && generationFactsMatch(current.facts, facts)) return Promise.resolve();
		if (pending?.facts && generationFactsMatch(pending.facts, facts)) return pending.promise;
		return trackRefresh(refreshTail.catch(() => {}).then(runRefresh), facts);
	};
	const readCurrent = async (project) => {
		for (;;) {
			const replacementPromise = replacement?.promise;
			if (replacementPromise) {
				await replacementPromise;
				continue;
			}
			const refreshPromise = pending?.promise;
			if (refreshPromise) {
				await refreshPromise;
				continue;
			}
			let generation = current;
			const retryUnavailableOwner = lastError instanceof ChatMetadataSnapshotUnavailableError;
			if (!generation && (params.refreshOnRead || retryUnavailableOwner)) {
				await refresh();
				generation = current;
			}
			if (!generation) {
				if (lastError) throw lastError;
				throw new ChatMetadataSnapshotUnavailableError();
			}
			if (params.refreshOnRead) {
				let latest;
				try {
					latest = captureGenerationFacts(deps);
				} catch {
					await refresh();
					generation = current;
				}
				if (latest && generation && !generationFactsMatch(generation.facts, latest)) {
					await refresh();
					generation = current;
				}
			}
			if (!generation) throw new ChatMetadataSnapshotUnavailableError();
			if (params.refreshOnRead) {
				const latest = captureGenerationFacts(deps);
				if (!generationFactsMatch(generation.facts, latest)) throw new ChatMetadataSnapshotUnavailableError("prepared chat metadata snapshot is stale while its replacement is publishing");
			}
			try {
				const result = await project(generation);
				if (current === generation && generation.epoch === invalidationEpoch) return result;
			} catch (error) {
				if (current === generation && generation.epoch === invalidationEpoch) throw error;
			}
		}
	};
	const read = async (readParams) => await readCurrent(async (generation) => {
		const agentId = normalizeAgentId(readParams.agentId);
		const agent = generation.agentsById.get(agentId);
		if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata is unavailable for agent "${agentId}"`);
		return (await projectAgent(generation, agent, readParams.sessionEntry)).metadata;
	});
	const readStartup = async (readParams) => {
		const projectStartup = async (generation) => {
			const agentId = normalizeAgentId(readParams.agentId);
			const agent = generation.agentsById.get(agentId);
			if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat startup projection is unavailable for agent "${agentId}"`);
			const neutralProjection = await projectAgent(generation, agent);
			const sessionProjection = await projectAgent(generation, agent, readParams.sessionEntry);
			return {
				metadata: sessionProjection.metadata,
				sessionModelCatalog: sessionProjection.modelCatalog,
				defaultModelCatalog: neutralProjection.modelCatalog
			};
		};
		if (resolveSessionProfiles(readParams.sessionEntry).preferredProfileId) return readCurrent(projectStartup);
		const generation = current;
		if (!generation || replacement || pending || generation.epoch !== invalidationEpoch) return;
		const projection = await projectStartup(generation);
		return current === generation && generation.epoch === invalidationEpoch && !replacement && !pending ? projection : void 0;
	};
	const invalidate = () => {
		invalidationEpoch += 1;
		current = void 0;
		lastError = void 0;
		replacement ??= createMetadataReplacement();
	};
	const fail = (error) => {
		const replacementError = error instanceof Error ? error : new Error(formatErrorMessage(error));
		current = void 0;
		lastError = replacementError;
		const failedReplacement = replacement;
		replacement = void 0;
		failedReplacement?.reject(replacementError);
	};
	return {
		fail,
		invalidate,
		read,
		readStartup,
		refresh
	};
}
//#endregion
export { ChatMetadataSnapshotUnavailableError, createGatewayChatMetadataRuntime };
