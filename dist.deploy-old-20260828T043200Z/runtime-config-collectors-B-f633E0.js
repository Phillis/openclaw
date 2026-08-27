import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-DMd-TDFp.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { g as resolveDefaultAgentId, i as listAgentEntriesWithSource, n as hasAgentRosterProperty } from "./agent-scope-config-CUBiGmG3.js";
import { r as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-Dbce_H9p.js";
import { n as getBootstrapChannelSecrets } from "./bootstrap-registry-_cgCYAPa.js";
import { a as resolveConfiguredTalkRealtimeProviderId, o as resolveConfiguredTalkSpeechProviderId } from "./talk-kxni9fig.js";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-B7oW9g2j.js";
import { x as resolveVoiceModelRefs } from "./loader-D0AfkRZe.js";
import "./shared-DSMB324f.js";
import { n as collectRuntimeSecretInputAssignment, r as collectSecretInputAssignment } from "./runtime-shared-BoNGt4zS.js";
import { p as loadChannelSecretContractApi } from "./target-registry-query-DbXzcm95.js";
import { n as resolveSandboxScope } from "./config-contract-CFOz6uqW.js";
import { t as collectPluginConfigAssignments } from "./runtime-config-collectors-plugins-CEzhj7Md.js";
import { n as evaluateGatewayAuthSurfaceStates } from "./runtime-gateway-auth-surfaces-DFVYIaNz.js";
import { i as resolvePluginCapabilityProviders } from "./capability-provider-runtime-2izPQWsN.js";
import "./config-CfIhW1Vb.js";
import { n as runtimeSandboxSecretOwnerId } from "./runtime-sandbox-secret-owner-BoM2WBV0.js";
import { t as runtimeMemorySecretOwnerId } from "./runtime-memory-secret-owner-D9RpeF2L.js";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.js";
import { t as resolveImageCapableConfigProviderIds } from "./config-provider-models-C4gvrjuU.js";
import { a as resolveConfiguredMediaEntryCapabilities, n as runtimeMediaModelSecretOwnerId, o as resolveEffectiveMediaEntryCapabilities, r as runtimeMediaRequestSecretOwnerId } from "./runtime-media-secret-owner-hrrxUKqA.js";
import { t as collectTtsApiKeyAssignments } from "./runtime-config-collectors-tts-kDj7hNQo.js";
//#region src/secrets/runtime-config-collectors-channels.ts
/** Collects channel contract secret assignments during runtime preparation. */
/** Collects SecretRef assignments declared by active channel/plugin channel contracts. */
function collectChannelConfigAssignments(params) {
	const channelIds = Object.keys(params.config.channels ?? {});
	if (channelIds.length === 0) return;
	for (const channelId of channelIds) (loadChannelSecretContractApi({
		channelId,
		config: params.config,
		env: params.context.env,
		loadablePluginOrigins: params.loadablePluginOrigins
	})?.collectRuntimeConfigAssignments ?? getBootstrapChannelSecrets(channelId)?.collectRuntimeConfigAssignments)?.(params);
}
//#endregion
//#region src/media-understanding/provider-capability-registry.ts
function mergeProviderCapabilities(registry, provider) {
	const normalizedKey = normalizeMediaProviderId(provider.id);
	const existing = registry.get(normalizedKey);
	registry.set(normalizedKey, { capabilities: provider.capabilities ?? existing?.capabilities });
}
/** Builds provider capability metadata used to filter shared media model entries. */
function buildMediaUnderstandingCapabilityRegistry(cfg) {
	const registry = /* @__PURE__ */ new Map();
	for (const provider of resolvePluginCapabilityProviders({
		key: "mediaUnderstandingProviders",
		cfg
	})) mergeProviderCapabilities(registry, provider);
	for (const normalizedKey of resolveImageCapableConfigProviderIds(cfg)) if (!registry.has(normalizedKey)) mergeProviderCapabilities(registry, {
		id: normalizedKey,
		capabilities: ["image"]
	});
	return registry;
}
//#endregion
//#region src/secrets/runtime-config-collectors-memory.ts
/** Collects per-agent memory search secret refs from runtime config. */
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function resolveMemoryEmbeddingProviderContract(params) {
	const configuredProvider = normalizeOptionalString(params.override?.provider) ?? normalizeOptionalString(params.defaults?.provider);
	const providerId = !configuredProvider || configuredProvider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : configuredProvider;
	const lookupIds = new Set([providerId, resolveConfiguredGenericEmbeddingProviderId(providerId, params.config)].filter((id) => Boolean(id)).map(normalizeProviderId));
	const credentialOwnerIds = (params.context.manifestRegistry?.plugins ?? []).flatMap((plugin) => plugin.contracts?.embeddingProviders?.some((id) => lookupIds.has(normalizeProviderId(id))) ? plugin.providers : []);
	const contractProviderIds = new Set([providerId, ...credentialOwnerIds.length > 0 ? credentialOwnerIds : Object.keys(params.config.models?.providers ?? {})].map(normalizeProviderId));
	const providerConfigs = /* @__PURE__ */ new Map();
	for (const candidateId of contractProviderIds) {
		const providerConfig = findNormalizedProviderValue(params.config.models?.providers, candidateId);
		if (providerConfig) providerConfigs.set(candidateId, {
			baseUrl: providerConfig.baseUrl,
			apiKey: providerConfig.apiKey,
			auth: providerConfig.auth,
			authHeader: providerConfig.authHeader,
			headers: providerConfig.headers,
			request: providerConfig.request,
			params: providerConfig.params,
			region: providerConfig.region,
			localService: providerConfig.localService
		});
	}
	return {
		id: providerId,
		config: providerConfigs.size === 1 ? providerConfigs.values().next().value : providerConfigs.size > 1 ? Object.fromEntries(providerConfigs) : void 0
	};
}
/** Collects memory-search SecretRefs once for every agent that can inherit them. */
function collectAgentMemorySearchAssignments(params) {
	const memory = params.config.memory;
	const defaultsMemorySearch = isRecord(memory?.search) ? memory.search : void 0;
	const configuredEntries = listAgentEntriesWithSource(params.config);
	const entries = configuredEntries.length === 0 && !hasAgentRosterProperty(params.config) ? [{
		entry: {
			id: LEGACY_IMPLICIT_AGENT_ID,
			default: true
		},
		source: {
			kind: "entries",
			key: LEGACY_IMPLICIT_AGENT_ID
		}
	}] : configuredEntries;
	const defaultRemote = isRecord(defaultsMemorySearch?.remote) ? defaultsMemorySearch.remote : void 0;
	const defaultHeaders = isRecord(defaultRemote?.headers) ? defaultRemote.headers : void 0;
	let defaultApiKeyAssignmentCollected = false;
	const collectedDefaultHeaderKeys = /* @__PURE__ */ new Set();
	const collectForAgent = ({ entry: rawAgent, source }) => {
		const rawAgentValue = rawAgent;
		if (!isRecord(rawAgentValue)) return;
		const rawAgentRecord = rawAgentValue;
		const agentMemory = isRecord(rawAgentRecord.memory) ? rawAgentRecord.memory : void 0;
		const memorySearch = isRecord(agentMemory?.search) ? agentMemory.search : void 0;
		const remote = isRecord(memorySearch?.remote) ? memorySearch.remote : void 0;
		const agentId = normalizeAgentId(rawAgent.id);
		const agentPath = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		const active = rawAgentRecord["enabled"] !== false && (memorySearch?.enabled ?? defaultsMemorySearch?.enabled ?? true) !== false;
		const owner = {
			ownerKind: "capability",
			ownerId: runtimeMemorySecretOwnerId(agentId),
			requiredForGateway: false,
			disposition: "isolate",
			contract: {
				defaults: defaultsMemorySearch,
				override: memorySearch,
				agentEnabled: rawAgentRecord["enabled"],
				provider: resolveMemoryEmbeddingProviderContract({
					config: params.config,
					context: params.context,
					defaults: defaultsMemorySearch,
					override: memorySearch
				})
			}
		};
		const hasApiKeyOverride = Boolean(remote && Object.hasOwn(remote, "apiKey"));
		const apiKeyTarget = hasApiKeyOverride ? remote : defaultRemote;
		if (apiKeyTarget && Object.hasOwn(apiKeyTarget, "apiKey")) {
			collectRuntimeSecretInputAssignment({
				value: apiKeyTarget.apiKey,
				path: hasApiKeyOverride ? `${agentPath}.memory.search.remote.apiKey` : "memory.search.remote.apiKey",
				expected: "string",
				defaults: params.defaults,
				context: params.context,
				active,
				inactiveReason: "agent or memorySearch override is disabled.",
				owner,
				apply: (value) => {
					apiKeyTarget.apiKey = value;
				}
			});
			if (!hasApiKeyOverride && active) defaultApiKeyAssignmentCollected = true;
		}
		const overrideHeaders = isRecord(remote?.headers) ? remote.headers : void 0;
		const headerTarget = overrideHeaders ?? defaultHeaders;
		if (!headerTarget) return;
		for (const [headerKey, headerValue] of Object.entries(headerTarget)) {
			collectRuntimeSecretInputAssignment({
				value: headerValue,
				path: overrideHeaders ? `${agentPath}.memory.search.remote.headers.${headerKey}` : `memory.search.remote.headers.${headerKey}`,
				expected: "string",
				defaults: params.defaults,
				context: params.context,
				active,
				inactiveReason: "agent or memorySearch override is disabled.",
				owner,
				apply: (value) => {
					headerTarget[headerKey] = value;
				}
			});
			if (!overrideHeaders && active) collectedDefaultHeaderKeys.add(headerKey);
		}
	};
	entries.forEach(collectForAgent);
	if (defaultRemote && !defaultApiKeyAssignmentCollected) collectRuntimeSecretInputAssignment({
		value: defaultRemote.apiKey,
		path: "memory.search.remote.apiKey",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: false,
		inactiveReason: "no enabled agent inherits this memorySearch remote api key.",
		apply: (value) => {
			defaultRemote.apiKey = value;
		}
	});
	for (const [headerKey, headerValue] of Object.entries(defaultHeaders ?? {})) {
		if (collectedDefaultHeaderKeys.has(headerKey)) continue;
		collectRuntimeSecretInputAssignment({
			value: headerValue,
			path: `memory.search.remote.headers.${headerKey}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: false,
			inactiveReason: "no enabled agent inherits this memorySearch remote header.",
			apply: (value) => {
				defaultHeaders[headerKey] = value;
			}
		});
	}
}
//#endregion
//#region src/secrets/runtime-config-collectors-sandbox.ts
/** Collects agent-scoped sandbox SSH SecretRefs during runtime preparation. */
const SANDBOX_SSH_SECRET_KEYS = [
	"identityData",
	"certificateData",
	"knownHostsData"
];
function sandboxSecretOwner(agentId, contract) {
	return {
		ownerKind: "capability",
		ownerId: runtimeSandboxSecretOwnerId(agentId),
		requiredForGateway: false,
		disposition: "isolate",
		contract
	};
}
function collectAssignment(params) {
	collectRuntimeSecretInputAssignment({
		value: params.target[params.key],
		path: params.path,
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: params.active,
		inactiveReason: params.inactiveReason,
		owner: params.owner,
		apply: (value) => {
			params.target[params.key] = value;
		}
	});
}
/** Collects SSH material once for every agent whose current backend can manage it. */
function collectAgentSandboxAssignments(params) {
	const rawAgents = params.config.agents;
	const agents = isRecord(rawAgents) ? rawAgents : void 0;
	if (!agents) return;
	const defaultsAgent = isRecord(agents.defaults) ? agents.defaults : void 0;
	const defaultsSandbox = isRecord(defaultsAgent?.sandbox) ? defaultsAgent.sandbox : void 0;
	const defaultsSsh = isRecord(defaultsSandbox?.ssh) ? defaultsSandbox.ssh : void 0;
	const defaultsBackend = normalizeOptionalLowercaseString(defaultsSandbox?.backend) ?? "docker";
	const candidates = listAgentEntriesWithSource(params.config).map(({ entry, source }) => ({
		entry,
		entryId: entry.id,
		agentPath: source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`
	}));
	const activeDefaultKeys = /* @__PURE__ */ new Set();
	const seenAgentIds = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const rawAgentValue = candidate.entry;
		if (!isRecord(rawAgentValue)) continue;
		const rawAgentRecord = rawAgentValue;
		const agentId = normalizeAgentId(candidate.entryId);
		if (seenAgentIds.has(agentId)) continue;
		seenAgentIds.add(agentId);
		const sandbox = isRecord(rawAgentRecord.sandbox) ? rawAgentRecord.sandbox : void 0;
		const ssh = isRecord(sandbox?.ssh) ? sandbox.ssh : void 0;
		const backend = normalizeOptionalLowercaseString(sandbox?.backend) ?? normalizeOptionalLowercaseString(defaultsSandbox?.backend) ?? "docker";
		const scope = resolveSandboxScope({
			scope: typeof sandbox?.scope === "string" ? sandbox.scope : typeof defaultsSandbox?.scope === "string" ? defaultsSandbox.scope : void 0,
			perSession: typeof sandbox?.["perSession"] === "boolean" ? sandbox["perSession"] : typeof defaultsSandbox?.perSession === "boolean" ? defaultsSandbox.perSession : void 0
		});
		const active = backend === "ssh";
		const owner = sandboxSecretOwner(agentId, {
			defaults: defaultsSandbox,
			override: sandbox,
			agentEnabled: rawAgentRecord["enabled"]
		});
		for (const key of SANDBOX_SSH_SECRET_KEYS) {
			if (Boolean(ssh && Object.hasOwn(ssh, key)) && ssh) {
				if (scope !== "shared") {
					collectAssignment({
						target: ssh,
						key,
						path: `${candidate.agentPath}.sandbox.ssh.${key}`,
						defaults: params.defaults,
						context: params.context,
						active,
						inactiveReason: "sandbox SSH backend is not configured for this agent.",
						owner
					});
					continue;
				}
				collectAssignment({
					target: ssh,
					key,
					path: `${candidate.agentPath}.sandbox.ssh.${key}`,
					defaults: params.defaults,
					context: params.context,
					active: false,
					inactiveReason: "shared sandbox scope ignores agent SSH overrides.",
					owner
				});
			}
			if (!defaultsSsh || !Object.hasOwn(defaultsSsh, key)) continue;
			if (!active) continue;
			activeDefaultKeys.add(key);
			collectAssignment({
				target: defaultsSsh,
				key,
				path: `agents.defaults.sandbox.ssh.${key}`,
				defaults: params.defaults,
				context: params.context,
				active: true,
				inactiveReason: "sandbox SSH backend is not configured for this agent.",
				owner
			});
		}
	}
	if (!defaultsSsh) return;
	for (const key of SANDBOX_SSH_SECRET_KEYS) {
		if (!Object.hasOwn(defaultsSsh, key) || activeDefaultKeys.has(key)) continue;
		const active = defaultsBackend === "ssh";
		const fallbackAgentId = params.agentId === void 0 ? resolveDefaultAgentId(params.config) : normalizeAgentId(params.agentId);
		collectAssignment({
			target: defaultsSsh,
			key,
			path: `agents.defaults.sandbox.ssh.${key}`,
			defaults: params.defaults,
			context: params.context,
			active,
			inactiveReason: "no enabled agent uses the sandbox SSH material.",
			owner: sandboxSecretOwner(fallbackAgentId, { defaults: defaultsSandbox })
		});
	}
}
//#endregion
//#region src/secrets/runtime-config-collectors-core.ts
/** Collects core config secret refs during runtime preparation. */
function collectModelProviderAssignments(params) {
	for (const [providerId, provider] of Object.entries(params.providers)) {
		const providerIsActive = provider.enabled !== false;
		const owner = {
			ownerKind: "provider",
			ownerId: normalizeOptionalLowercaseString(providerId) ?? providerId,
			requiredForGateway: false,
			disposition: "isolate",
			contract: provider
		};
		collectRuntimeSecretInputAssignment({
			value: provider.apiKey,
			path: `models.providers.${providerId}.apiKey`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: providerIsActive,
			inactiveReason: "provider is disabled.",
			owner,
			apply: (value) => {
				provider.apiKey = value;
			}
		});
		const headers = isRecord(provider.headers) ? provider.headers : void 0;
		if (headers) for (const [headerKey, headerValue] of Object.entries(headers)) collectRuntimeSecretInputAssignment({
			value: headerValue,
			path: `models.providers.${providerId}.headers.${headerKey}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: providerIsActive,
			inactiveReason: "provider is disabled.",
			owner,
			apply: (value) => {
				headers[headerKey] = value;
			}
		});
		const request = isRecord(provider.request) ? provider.request : void 0;
		if (request) collectProviderRequestAssignments({
			request,
			pathPrefix: `models.providers.${providerId}.request`,
			defaults: params.defaults,
			context: params.context,
			active: providerIsActive,
			inactiveReason: "provider is disabled.",
			collectTransportSecrets: true,
			owner
		});
	}
}
function collectSkillAssignments(params) {
	for (const [skillKey, entry] of Object.entries(params.entries)) collectRuntimeSecretInputAssignment({
		value: entry.apiKey,
		path: `skills.entries.${skillKey}.apiKey`,
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: entry.enabled !== false,
		inactiveReason: "skill entry is disabled.",
		owner: {
			ownerKind: "capability",
			ownerId: `skill:${skillKey}`,
			requiredForGateway: false,
			disposition: "isolate",
			contract: entry
		},
		apply: (value) => {
			entry.apiKey = value;
		}
	});
}
function findTalkProviderConfig(providers, providerId) {
	if (!isRecord(providers)) return;
	const id = findNormalizedProviderKey(providers, providerId);
	const config = id ? providers[id] : void 0;
	return id && isRecord(config) ? {
		id,
		config
	} : void 0;
}
function collectTalkAssignments(params) {
	const talk = params.config.talk;
	if (!isRecord(talk)) return;
	for (const surface of ["speech", "realtime"]) {
		const section = surface === "speech" ? talk : isRecord(talk.realtime) ? talk.realtime : void 0;
		if (!section) continue;
		const configuredId = surface === "speech" ? resolveConfiguredTalkSpeechProviderId(params.config) : resolveConfiguredTalkRealtimeProviderId(params.config);
		const normalizedConfiguredId = normalizeOptionalLowercaseString(configuredId);
		const capability = surface === "speech" ? "speechProviders" : "realtimeVoiceProviders";
		const normalizedProviderIds = (normalizedConfiguredId ? params.context.manifestRegistry ? params.context.manifestRegistry.plugins.map((manifest) => manifest.contracts?.[capability]).find((ids) => ids?.some((id) => normalizeOptionalLowercaseString(id) === normalizedConfiguredId)) : [normalizedConfiguredId] : void 0)?.map((id) => normalizeOptionalLowercaseString(id) ?? id);
		const providerId = normalizedProviderIds?.[0];
		const selected = configuredId ? findTalkProviderConfig(section.providers, configuredId) : void 0;
		const inherited = surface === "speech" && providerId ? normalizedProviderIds.map((id) => findTalkProviderConfig(params.config.tts?.providers, id)).find((entry) => entry !== void 0) : void 0;
		const voiceModel = (surface === "realtime" ? section.model : selected?.config.model ?? selected?.config.modelId ?? inherited?.config.model ?? inherited?.config.modelId) === void 0 ? resolveVoiceModelRefs(params.config.agents?.defaults?.voiceModel).find((ref) => normalizedProviderIds?.includes(ref.provider.toLowerCase())) : void 0;
		const { providers: _providers, provider: _provider, ...realtimeDefaults } = section;
		const inheritedConfig = inherited && selected?.config.apiKey !== void 0 ? Object.fromEntries(Object.entries(inherited.config).filter(([key]) => key !== "apiKey")) : inherited?.config;
		const owner = providerId ? {
			ownerKind: "capability",
			ownerId: `talk:${surface}`,
			requiredForGateway: false,
			disposition: "isolate",
			contract: {
				provider: providerId,
				selectedProvider: configuredId,
				providerConfig: selected?.config,
				voiceModel,
				...surface === "realtime" ? {
					...realtimeDefaults,
					canonicalProviderConfig: findTalkProviderConfig(section.providers, providerId)?.config
				} : {
					inheritedProviderConfig: inheritedConfig,
					timeoutMs: params.config.tts?.timeoutMs,
					maxTextLength: params.config.tts?.maxTextLength
				}
			}
		} : void 0;
		const inheritedKey = surface === "speech" && inherited && selected?.config.apiKey === void 0 ? inherited : void 0;
		const entries = Object.entries(isRecord(section.providers) ? section.providers : {});
		if (inheritedKey && selected) entries.push([inheritedKey.id, inheritedKey.config]);
		for (const [id, config] of entries) {
			if (!isRecord(config)) continue;
			const isInherited = config === inheritedKey?.config;
			const destination = isInherited && selected ? selected.config : config;
			const normalized = normalizeOptionalLowercaseString(id);
			collectRuntimeSecretInputAssignment({
				value: config.apiKey,
				path: isInherited ? `tts.providers.${id}.apiKey` : `talk.${surface === "realtime" ? "realtime." : ""}providers.${id}.apiKey`,
				expected: "string",
				defaults: params.defaults,
				context: params.context,
				active: Boolean(isInherited || providerId && (normalized === normalizedConfiguredId || surface === "realtime" && normalized === providerId)),
				inactiveReason: "Talk provider is not selected.",
				owner,
				apply: (resolved) => {
					destination.apiKey = resolved;
				}
			});
		}
	}
}
function collectGatewayAssignments(params) {
	const gateway = params.config.gateway;
	if (!isRecord(gateway)) return;
	const auth = isRecord(gateway.auth) ? gateway.auth : void 0;
	const remote = isRecord(gateway.remote) ? gateway.remote : void 0;
	const controlUi = isRecord(gateway.controlUi) ? gateway.controlUi : void 0;
	const gatewaySurfaceStates = evaluateGatewayAuthSurfaceStates({
		config: params.config,
		env: params.context.env,
		defaults: params.defaults
	});
	if (auth) {
		const ingressAuthOwner = {
			ownerKind: "gateway",
			ownerId: "ingress-auth",
			requiredForGateway: true,
			disposition: "fail-closed",
			contract: auth
		};
		collectRuntimeSecretInputAssignment({
			value: auth.token,
			path: "gateway.auth.token",
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: gatewaySurfaceStates["gateway.auth.token"].active,
			inactiveReason: gatewaySurfaceStates["gateway.auth.token"].reason,
			owner: ingressAuthOwner,
			apply: (value) => {
				auth.token = value;
			}
		});
		collectRuntimeSecretInputAssignment({
			value: auth.password,
			path: "gateway.auth.password",
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: gatewaySurfaceStates["gateway.auth.password"].active,
			inactiveReason: gatewaySurfaceStates["gateway.auth.password"].reason,
			owner: ingressAuthOwner,
			apply: (value) => {
				auth.password = value;
			}
		});
	}
	if (remote) {
		collectSecretInputAssignment({
			value: remote.token,
			path: "gateway.remote.token",
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: gatewaySurfaceStates["gateway.remote.token"].active,
			inactiveReason: gatewaySurfaceStates["gateway.remote.token"].reason,
			apply: (value) => {
				remote.token = value;
			}
		});
		collectSecretInputAssignment({
			value: remote.password,
			path: "gateway.remote.password",
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: gatewaySurfaceStates["gateway.remote.password"].active,
			inactiveReason: gatewaySurfaceStates["gateway.remote.password"].reason,
			apply: (value) => {
				remote.password = value;
			}
		});
	}
	const controlUiGitHub = controlUi && isRecord(controlUi.github) ? controlUi.github : void 0;
	if (controlUiGitHub) collectRuntimeSecretInputAssignment({
		value: controlUiGitHub.token,
		path: "gateway.controlUi.github.token",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		owner: {
			ownerKind: "capability",
			ownerId: "control-ui-github",
			requiredForGateway: false,
			disposition: "isolate",
			contract: controlUiGitHub
		},
		apply: (value) => {
			controlUiGitHub.token = value;
		}
	});
}
function collectProviderRequestAssignments(params) {
	const headers = isRecord(params.request.headers) ? params.request.headers : void 0;
	if (headers) for (const [headerKey, headerValue] of Object.entries(headers)) collectRuntimeSecretInputAssignment({
		value: headerValue,
		path: `${params.pathPrefix}.headers.${headerKey}`,
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: params.active,
		inactiveReason: params.inactiveReason,
		owner: params.owner,
		apply: (value) => {
			headers[headerKey] = value;
		}
	});
	const auth = isRecord(params.request.auth) ? params.request.auth : void 0;
	if (auth) {
		collectRuntimeSecretInputAssignment({
			value: auth.token,
			path: `${params.pathPrefix}.auth.token`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: params.active,
			inactiveReason: params.inactiveReason,
			owner: params.owner,
			apply: (value) => {
				auth.token = value;
			}
		});
		collectRuntimeSecretInputAssignment({
			value: auth.value,
			path: `${params.pathPrefix}.auth.value`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: params.active,
			inactiveReason: params.inactiveReason,
			owner: params.owner,
			apply: (value) => {
				auth.value = value;
			}
		});
	}
	const collectTlsAssignments = (tls, pathPrefix) => {
		if (!tls) return;
		for (const key of [
			"ca",
			"cert",
			"key",
			"passphrase"
		]) collectRuntimeSecretInputAssignment({
			value: tls[key],
			path: `${pathPrefix}.${key}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: params.active,
			inactiveReason: params.inactiveReason,
			owner: params.owner,
			apply: (value) => {
				tls[key] = value;
			}
		});
	};
	if (params.collectTransportSecrets !== false) {
		collectTlsAssignments(isRecord(params.request.tls) ? params.request.tls : void 0, `${params.pathPrefix}.tls`);
		const proxy = isRecord(params.request.proxy) ? params.request.proxy : void 0;
		collectTlsAssignments(isRecord(proxy?.tls) ? proxy.tls : void 0, `${params.pathPrefix}.proxy.tls`);
	}
}
function collectMediaRequestAssignments(params) {
	const tools = isRecord(params.config.tools) ? params.config.tools : void 0;
	const media = isRecord(tools?.media) ? tools.media : void 0;
	if (!media) return;
	let providerRegistry;
	const getProviderRegistry = () => {
		providerRegistry ??= buildMediaUnderstandingCapabilityRegistry(params.config);
		return providerRegistry;
	};
	const capabilityKeys = [
		"audio",
		"image",
		"video"
	];
	const isCapabilityEnabled = (capability) => (isRecord(media[capability]) ? media[capability] : void 0)?.enabled !== false;
	const collectModelAssignments = (models, pathPrefix, resolveOwnerId, resolveActivity) => {
		if (!Array.isArray(models)) return;
		models.forEach((rawModel, index) => {
			if (!isRecord(rawModel) || !isRecord(rawModel.request)) return;
			const { active, inactiveReason } = resolveActivity(rawModel);
			collectProviderRequestAssignments({
				request: rawModel.request,
				pathPrefix: `${pathPrefix}.${index}.request`,
				defaults: params.defaults,
				context: params.context,
				active,
				inactiveReason,
				owner: {
					ownerKind: "capability",
					ownerId: resolveOwnerId(index),
					requiredForGateway: false,
					disposition: "isolate",
					contract: rawModel
				}
			});
		});
	};
	collectModelAssignments(media.models, "tools.media.models", (index) => runtimeMediaModelSecretOwnerId({
		source: "shared",
		index
	}), (rawModel) => {
		const entry = rawModel;
		const capabilities = resolveConfiguredMediaEntryCapabilities(entry) ?? resolveEffectiveMediaEntryCapabilities({
			entry,
			source: "shared",
			providerRegistry: getProviderRegistry()
		});
		if (!capabilities || capabilities.length === 0) return {
			active: false,
			inactiveReason: "shared media model does not declare capabilities and none could be inferred from its provider."
		};
		return {
			active: capabilities.some((capability) => isCapabilityEnabled(capability)),
			inactiveReason: `all configured media capabilities for this shared model are disabled: ${capabilities.join(", ")}.`
		};
	});
	for (const capability of capabilityKeys) {
		const section = isRecord(media[capability]) ? media[capability] : void 0;
		if (!section || !isRecord(section.request)) continue;
		const active = isCapabilityEnabled(capability);
		collectProviderRequestAssignments({
			request: section.request,
			pathPrefix: `tools.media.${capability}.request`,
			defaults: params.defaults,
			context: params.context,
			active,
			inactiveReason: `${capability} media understanding is disabled.`,
			owner: {
				ownerKind: "capability",
				ownerId: runtimeMediaRequestSecretOwnerId(capability),
				requiredForGateway: false,
				disposition: "isolate",
				contract: section
			}
		});
	}
}
function collectMessagesTtsAssignments(params) {
	const tts = params.config.tts;
	if (!isRecord(tts)) return;
	collectTtsApiKeyAssignments({
		tts,
		pathPrefix: "tts",
		defaults: params.defaults,
		context: params.context
	});
}
function collectAgentTtsAssignments(params) {
	for (const { entry, source } of listAgentEntriesWithSource(params.config)) {
		if (!isRecord(entry.tts)) continue;
		collectTtsApiKeyAssignments({
			tts: entry.tts,
			pathPrefix: source.kind === "entries" ? `agents.entries.${source.key}.tts` : `agents.list.${source.index}.tts`,
			defaults: params.defaults,
			context: params.context
		});
	}
}
function collectCronAssignments(params) {
	const cron = params.config.cron;
	if (!isRecord(cron)) return;
	collectRuntimeSecretInputAssignment({
		value: cron.webhookToken,
		path: "cron.webhookToken",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		owner: {
			ownerKind: "capability",
			ownerId: "cron-webhook",
			requiredForGateway: false,
			disposition: "isolate",
			contract: cron
		},
		apply: (value) => {
			cron.webhookToken = value;
		}
	});
}
/** Collects SecretRef assignments from core non-plugin config surfaces. */
function collectCoreConfigAssignments(params) {
	const providers = params.config.models?.providers;
	if (providers) collectModelProviderAssignments({
		providers,
		defaults: params.defaults,
		context: params.context
	});
	const skillEntries = params.config.skills?.entries;
	if (skillEntries) collectSkillAssignments({
		entries: skillEntries,
		defaults: params.defaults,
		context: params.context
	});
	collectAgentMemorySearchAssignments(params);
	collectTalkAssignments(params);
	collectGatewayAssignments(params);
	collectAgentSandboxAssignments(params);
	collectMessagesTtsAssignments(params);
	collectAgentTtsAssignments(params);
	collectCronAssignments(params);
	collectMediaRequestAssignments(params);
}
//#endregion
//#region src/secrets/runtime-config-collectors.ts
/** Collects every config-backed SecretRef assignment before runtime values are materialized. */
/** Collects concrete config path assignments that may need SecretRef conversion. */
function collectConfigAssignments(params) {
	const defaults = params.context.sourceConfig.secrets?.defaults;
	collectCoreConfigAssignments({
		config: params.config,
		defaults,
		context: params.context,
		agentId: params.agentId
	});
	collectChannelConfigAssignments({
		config: params.config,
		defaults,
		context: params.context,
		loadablePluginOrigins: params.loadablePluginOrigins
	});
	collectPluginConfigAssignments({
		config: params.config,
		defaults,
		context: params.context,
		loadablePluginOrigins: params.loadablePluginOrigins
	});
}
//#endregion
export { collectConfigAssignments as t };
