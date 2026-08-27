import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { C as resolveSessionAuthProfileOverrideSource } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { p as getActivePluginRegistryVersion } from "./runtime-g0R28Sy0.js";
import { x as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-Dp7mvsA3.js";
import { c as getRuntimeAuthProfileStoreSnapshotRevision } from "./runtime-snapshots-CJ87Vu4S.js";
import { s as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-2zwMbXSG.js";
import { r as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-catalog-owner-DOM4UhG5.js";
import { r as getSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as getPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-lswR6K7d.js";
import "./auth-profiles-i3N9ji0c.js";
import { w as listAgentsForGateway } from "./session-utils-row-CB3Fore5.js";
import "./session-utils-DZT0oaJU.js";
import { t as resolveSwarmConfig } from "./swarm-config-DqpqlTRZ.js";
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
			config,
			readOnly: true
		});
		if (!owner) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata owner is unavailable for agent "${agentId}"`);
		const workspaceDir = owner.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
		return {
			agentId,
			owner,
			authStore: deps.getPreparedAuthStore(owner.agentDir, owner.inheritedAuthDir) ?? {
				version: 1,
				profiles: {}
			},
			authStoreRevision: `${deps.getAuthStoreRevision(owner.agentDir)}:${deps.getAuthStoreRevision(owner.inheritedAuthDir)}`,
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
		return candidate?.agentId === agent.agentId && candidate.owner === agent.owner && candidate.authStoreRevision === agent.authStoreRevision && candidate.skillsVersion === agent.skillsVersion;
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
	const { buildCommandsListResult } = await import("./commands-list-result-ClTiXE2A.js");
	return buildCommandsListResult({
		cfg: params.cfg,
		agentId: params.agentId,
		includeArgs: true,
		scope: "text"
	});
}
async function defaultBuildProjection(params) {
	const { buildModelsListResult, createGatewayAgentModelCatalogProjector } = await import("./models-list-result-CIE540yG.js");
	const snapshot = params.facts.owner.modelCatalog;
	const projector = createGatewayAgentModelCatalogProjector({
		cfg: params.facts.owner.config,
		agentId: params.facts.agentId,
		snapshot,
		metadataSnapshot: params.facts.owner.metadataSnapshot,
		preparedAuthStore: params.facts.authStore,
		preparedRuntimeAuthModes: params.facts.owner.authModes,
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
		getPreparedOwner: getPreparedModelCatalogOwnerSnapshot,
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
			sessionProjectionByKey: /* @__PURE__ */ new Map(),
			agentsListByKey: /* @__PURE__ */ new Map()
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
			if (!generation && params.refreshOnRead) {
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
	const readStartup = async (readParams) => await readCurrent(async (generation) => {
		const sessionAgentId = normalizeAgentId(readParams.agentId);
		const sessionAgent = generation.agentsById.get(sessionAgentId);
		if (!sessionAgent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat startup projection is unavailable for agent "${sessionAgentId}"`);
		const defaultAgentId = sessionAgentId;
		const profileNeutralProjections = await Promise.all([...generation.agentsById.values()].map(async (agent) => [agent.agentId, await projectAgent(generation, agent)]));
		const projectionByAgentId = new Map(profileNeutralProjections);
		const sessionProjection = await projectAgent(generation, sessionAgent, readParams.sessionEntry);
		const defaultProjection = projectionByAgentId.get(defaultAgentId);
		if (!defaultProjection) throw new ChatMetadataSnapshotUnavailableError(`prepared chat startup projection is unavailable for default agent "${defaultAgentId}"`);
		const agentsListKey = readParams.includeSystem ? "include-system" : "agents-only";
		let agentsList = generation.agentsListByKey.get(agentsListKey);
		if (!agentsList) {
			const modelCatalogByAgentId = new Map(profileNeutralProjections.map(([agentId, projection]) => [agentId, projection.modelCatalog]));
			agentsList = listAgentsForGateway(generation.facts.config, defaultProjection.modelCatalog, {
				modelCatalogByAgentId,
				includeSystem: readParams.includeSystem
			});
			generation.agentsListByKey.set(agentsListKey, agentsList);
		}
		return {
			metadata: sessionProjection.metadata,
			sessionModelCatalog: sessionProjection.modelCatalog,
			defaultModelCatalog: defaultProjection.modelCatalog,
			agentsList
		};
	});
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
