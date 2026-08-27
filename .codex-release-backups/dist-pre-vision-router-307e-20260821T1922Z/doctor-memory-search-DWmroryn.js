import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, l as resolveAgentDir, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { n as defaultSlotIdForKey } from "./slots-BTFPUFBt.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { c as resolveRememberAcrossConversations } from "./legacy-BXBI_5fp.js";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig } from "./dreaming-BMAUTQQQ.js";
import { t as getProviderEnvVars } from "./provider-env-vars-D88PwWxT.js";
import { t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-jGX4iJ3y.js";
import { n as hasAuthProfileStoreSourceForProvider, t as hasAnyAuthProfileStoreSource } from "./source-check-Bvz8QyBz.js";
import { t as resolveEnvApiKey } from "./model-auth-env-B8fM73iy.js";
import "./auth-profiles-6l2OWljU.js";
import { x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-CpggQEC3.js";
import { s as resolveApiKeyForProviderCore } from "./model-auth-DFZ_cQnR.js";
import { t as resolveMemorySearchConfig } from "./memory-search-CFXa3Z-G.js";
import { a as resolveActiveMemoryBackendConfig, i as getActiveMemorySearchManagerCore } from "./memory-runtime-mvrDxQ08.js";
import { t as note } from "./note-D7f3pYFE.js";
import { t as hasConfiguredMemorySecretInput } from "./secret-input-DoknW-xw.js";
import { l as repairDreamingArtifacts, n as auditShortTermPromotionArtifacts, t as auditDreamingArtifacts, u as repairShortTermPromotionArtifacts } from "./memory-core-bundled-runtime--7MS93Y-.js";
import { i as maybeRepairWorkspaceMemoryHealth, o as noteWorkspaceMemoryHealth } from "./doctor-workspace-BAn0Ig69.js";
import fs from "node:fs";
//#region src/commands/doctor-memory-search.ts
function resolveMemoryDoctorAgentScopes(cfg) {
	return listAgentIds(cfg).map((agentId) => ({
		agentId,
		agentDir: resolveAgentDir(cfg, agentId),
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
}
function formatAgentMessage(agentId, labelAgent, message) {
	return `${labelAgent ? `Agent "${agentId}": ` : ""}${message}`;
}
function formatLocalRuntimeDoctorNote(facts) {
	const backend = facts.backend ?? "unknown";
	const build = facts.buildInfo ? `, ${facts.buildInfo}` : "";
	const model = facts.model?.id ? `\nModel: ${facts.model.id}${facts.model.path ? ` (${facts.model.path})` : ""}` : "";
	const capabilities = facts.capabilities ? `\nCapabilities: ${[facts.capabilities.vision ? "vision" : null, facts.capabilities.draft ? "draft" : null].filter(Boolean).join(", ") || "text only"}` : "";
	const endpoints = facts.endpoints ? `\nEndpoints: ${Object.entries(facts.endpoints).map(([name, status]) => `${name}=${status}`).join(" ")}` : "";
	const loadError = facts.loadError ? `\nLoad error: ${facts.loadError}` : "";
	return `llama.cpp server: ${backend}${build}${facts.state === "ready" ? "" : ` (${facts.state})`}${model}${capabilities}${endpoints}${loadError}`;
}
const BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA = [
	{
		providerId: "github-copilot",
		authProviderId: "github-copilot",
		transport: "remote",
		autoSelectPriority: 15
	},
	{
		providerId: "openai",
		authProviderId: "openai",
		transport: "remote",
		autoSelectPriority: 20
	},
	{
		providerId: "gemini",
		authProviderId: "google",
		transport: "remote",
		autoSelectPriority: 30
	},
	{
		providerId: "voyage",
		authProviderId: "voyage",
		transport: "remote",
		autoSelectPriority: 40
	},
	{
		providerId: "mistral",
		authProviderId: "mistral",
		transport: "remote",
		autoSelectPriority: 50
	},
	{
		providerId: "bedrock",
		authProviderId: "amazon-bedrock",
		transport: "remote",
		autoSelectPriority: 60
	}
];
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set(["openai-completions", "openai-responses"]);
function resolveMemoryEmbeddingProviderDoctorMetadata(providerId) {
	const metadata = BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA.find((candidate) => candidate.providerId === providerId) ?? null;
	if (!metadata) return null;
	return {
		...metadata,
		envVars: getProviderEnvVars(metadata.authProviderId)
	};
}
function listAutoSelectMemoryEmbeddingProviderDoctorMetadata() {
	return BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA.filter((provider) => typeof provider.autoSelectPriority === "number").toSorted((a, b) => (a.autoSelectPriority ?? 0) - (b.autoSelectPriority ?? 0)).map((provider) => ({
		providerId: provider.providerId,
		authProviderId: provider.authProviderId,
		transport: provider.transport,
		autoSelectPriority: provider.autoSelectPriority,
		envVars: getProviderEnvVars(provider.authProviderId)
	}));
}
function resolveSuggestedRemoteMemoryProvider() {
	return listAutoSelectMemoryEmbeddingProviderDoctorMetadata().find((provider) => provider.transport === "remote")?.providerId;
}
function hasConfiguredAwsSdkAuthForProvider(provider, cfg) {
	if (findNormalizedProviderValue(cfg.models?.providers, provider)?.auth === "aws-sdk") return true;
	return (findNormalizedProviderValue(cfg.auth?.order, provider) ?? (cfg.auth?.profiles ? Object.keys(cfg.auth.profiles) : [])).some((profileId) => isConfiguredAwsSdkAuthProfileForProvider({
		cfg,
		provider,
		profileId
	}));
}
function isOpenAICompatibleMemoryProvider(providerId, cfg) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (normalizedProviderId === OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER) return true;
	if (BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA.some((provider) => provider.providerId === normalizedProviderId)) return false;
	const providerConfig = findNormalizedProviderValue(cfg.models?.providers, providerId);
	if (!providerConfig) return false;
	const api = normalizeProviderId(providerConfig.api ?? "");
	if (api === OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER || OPENAI_COMPATIBLE_MODEL_APIS.has(api)) return true;
	return !api && Boolean(normalizeOptionalString(providerConfig.baseUrl));
}
function resolveOpenAICompatibleMemoryBaseUrl(providerId, cfg, remoteBaseUrl) {
	return normalizeOptionalString(remoteBaseUrl) ?? normalizeOptionalString(findNormalizedProviderValue(cfg.models?.providers, providerId)?.baseUrl);
}
function isKeyOptionalMemoryProvider(providerId, cfg) {
	return providerId === "local" || providerId === "ollama" || providerId === "lmstudio" || isOpenAICompatibleMemoryProvider(providerId, cfg);
}
async function resolveRuntimeMemoryAuditContext(cfg, agentId) {
	const manager = (await getActiveMemorySearchManagerCore({
		cfg,
		agentId,
		purpose: "status"
	})).manager;
	if (!manager) return null;
	try {
		return { workspaceDir: manager.status().workspaceDir?.trim() };
	} finally {
		await manager.close?.().catch(() => void 0);
	}
}
function buildMemoryRecallIssueNote(audit) {
	if (audit.issues.length === 0) return null;
	const issueLines = audit.issues.map((issue) => `- ${issue.message}`);
	const guidance = audit.issues.some((issue) => issue.fixable) ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}` : `Verify: ${formatCliCommand("openclaw memory status --deep")}`;
	return [
		"Memory recall artifacts need attention:",
		...issueLines,
		`Recall store: ${audit.storePath}`,
		guidance
	].join("\n");
}
function buildDreamingArtifactIssueNote(audit) {
	if (audit.issues.length === 0) return null;
	const issueLines = audit.issues.map((issue) => `- ${issue.message}`);
	const hasFixableIssue = audit.issues.some((issue) => issue.fixable);
	return [
		"Dreaming artifacts need attention:",
		...issueLines,
		`Dream corpus: ${audit.sessionCorpusDir}`,
		hasFixableIssue ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}` : `Verify: ${formatCliCommand("openclaw memory status --deep")}`
	].join("\n");
}
async function noteMemoryRecallHealth(cfg) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const labelAgents = scopes.length > 1;
	const dreaming = resolveMemoryDreamingConfig({
		cfg,
		pluginConfig: resolveMemoryDreamingPluginConfig(cfg)
	});
	for (const scope of scopes) try {
		const workspaceDir = (await resolveRuntimeMemoryAuditContext(cfg, scope.agentId))?.workspaceDir?.trim();
		if (!workspaceDir) continue;
		const message = buildMemoryRecallIssueNote(await auditShortTermPromotionArtifacts({ workspaceDir }));
		if (message) note(formatAgentMessage(scope.agentId, labelAgents, message), "Memory search");
		const dreamingMessage = buildDreamingArtifactIssueNote(await auditDreamingArtifacts({ workspaceDir }));
		if (dreamingMessage) note(formatAgentMessage(scope.agentId, labelAgents, dreamingMessage), "Memory search");
	} catch (err) {
		note(formatAgentMessage(scope.agentId, labelAgents, `Memory recall audit could not be completed: ${formatErrorMessage(err)}`), "Memory search");
	} finally {
		note(formatAgentMessage(scope.agentId, labelAgents, `Dreaming: ${dreaming.enabled ? "enabled" : "disabled"} (cadence ${dreaming.frequency}).`), "Memory search");
	}
}
async function maybeRepairMemoryRecallHealth(params) {
	const scopes = resolveMemoryDoctorAgentScopes(params.cfg);
	const labelAgents = scopes.length > 1;
	for (const scope of scopes) {
		await maybeRepairWorkspaceMemoryHealth({
			...params,
			scope: {
				agentId: scope.agentId,
				workspaceDir: scope.workspaceDir,
				labelAgent: labelAgents
			}
		});
		try {
			const workspaceDir = (await resolveRuntimeMemoryAuditContext(params.cfg, scope.agentId))?.workspaceDir?.trim();
			if (!workspaceDir) continue;
			if ((await auditShortTermPromotionArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable)) {
				if (await params.prompter.confirmRuntimeRepair({
					message: formatAgentMessage(scope.agentId, labelAgents, "Remove dangling memory recalls, normalize recall artifacts, and remove stale promotion locks?"),
					initialValue: true
				})) {
					const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
					if (repair.changed) {
						const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
						const details = [
							repair.removedInvalidEntries > 0 ? `-${repair.removedInvalidEntries} invalid entries` : null,
							(repair.removedDanglingEntries ?? 0) > 0 ? `-${repair.removedDanglingEntries} dangling entries` : null,
							removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow entries` : null
						].filter(Boolean).join(", ");
						const lines = [
							"Memory recall artifacts repaired:",
							repair.rewroteStore ? `- rewrote recall store${details ? ` (${details})` : ""}` : null,
							repair.removedStaleLock ? "- removed stale promotion lock" : null,
							`Verify: ${formatCliCommand("openclaw memory status --deep")}`
						].filter(Boolean);
						note(formatAgentMessage(scope.agentId, labelAgents, lines.join("\n")), "Doctor changes");
					}
				}
			}
			if (!(await auditDreamingArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable)) continue;
			if (!await params.prompter.confirmRuntimeRepair({
				message: formatAgentMessage(scope.agentId, labelAgents, "Archive contaminated dreaming artifacts and reset derived dream corpus state?"),
				initialValue: true
			})) continue;
			const dreamingRepair = await repairDreamingArtifacts({ workspaceDir });
			if (!dreamingRepair.changed) continue;
			const lines = [
				"Dreaming artifacts repaired:",
				dreamingRepair.archivedSessionCorpus ? "- archived session corpus" : null,
				dreamingRepair.archivedSessionIngestion ? "- archived session-ingestion state" : null,
				dreamingRepair.archivedDreamsDiary ? "- archived dream diary" : null,
				dreamingRepair.archiveDir ? `- archive dir: ${dreamingRepair.archiveDir}` : null,
				...dreamingRepair.warnings.map((warning) => `- warning: ${warning}`),
				`Verify: ${formatCliCommand("openclaw memory status --deep")}`
			].filter(Boolean);
			note(formatAgentMessage(scope.agentId, labelAgents, lines.join("\n")), "Doctor changes");
		} catch (err) {
			note(formatAgentMessage(scope.agentId, labelAgents, `Memory artifact repair could not be completed: ${formatErrorMessage(err)}`), "Memory search");
		}
	}
}
function hasActiveAlternateMemoryPluginSlot(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	if (!plugins.enabled) return false;
	const memorySlot = plugins.slots.memory;
	if (typeof memorySlot !== "string" || memorySlot.length === 0) return false;
	if (memorySlot === defaultSlotIdForKey("memory")) return false;
	if (plugins.deny.includes(memorySlot)) return false;
	if (!Object.hasOwn(plugins.entries, memorySlot)) return false;
	const entry = plugins.entries[memorySlot];
	if (!entry || entry.enabled === false) return false;
	return entry.enabled === true || entry.config !== void 0;
}
function isActiveMemoryPluginAvailable(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	if (!plugins.enabled || plugins.deny.includes("active-memory")) return false;
	if (plugins.allow.length > 0 && !plugins.allow.includes("active-memory")) return false;
	const entry = plugins.entries["active-memory"];
	if (entry?.enabled === false) return false;
	return (isRecord(entry?.config) ? entry.config : void 0)?.enabled !== false;
}
function resolveActiveMemoryConversationRecallSupport(cfg) {
	const providerSupported = normalizePluginsConfig(cfg.plugins).slots.memory === defaultSlotIdForKey("memory");
	const entry = cfg.plugins?.entries?.["active-memory"];
	const config = isRecord(entry?.config) ? entry.config : void 0;
	if (!Array.isArray(config?.toolsAllow)) return {
		providerSupported,
		memorySearchAllowed: true
	};
	return {
		providerSupported,
		memorySearchAllowed: config.toolsAllow.some((toolName) => typeof toolName === "string" && toolName.trim().toLowerCase() === "memory_search")
	};
}
function noteRememberAcrossConversationsHealth(params) {
	if (!resolveRememberAcrossConversations(params.cfg, params.agentId)) return { enabled: false };
	const activeMemoryAvailable = isActiveMemoryPluginAvailable(params.cfg);
	const conversationRecallSupport = resolveActiveMemoryConversationRecallSupport(params.cfg);
	if (!activeMemoryAvailable) params.noteFn(`Remember across conversations is effectively enabled for agent "${params.agentId}", but the Active Memory plugin is disabled. Enable the plugin or set memory.search.rememberAcrossConversations to false.`, "Memory search");
	if (activeMemoryAvailable && !conversationRecallSupport.providerSupported) params.noteFn(`Remember across conversations is effectively enabled for agent "${params.agentId}", but the current memory provider does not support protected private transcript recall. Set memory.search.rememberAcrossConversations to false or use that provider's own recall path; advanced Active Memory can still use its recall tools.`, "Memory search");
	else if (activeMemoryAvailable && !conversationRecallSupport.memorySearchAllowed) params.noteFn(`Remember across conversations is effectively enabled for agent "${params.agentId}", but Active Memory does not allow memory_search. Add memory_search to the plugin toolsAllow list or set memory.search.rememberAcrossConversations to false.`, "Memory search");
	return { enabled: true };
}
async function noteMemorySearchHealth(cfg, opts) {
	const scopes = resolveMemoryDoctorAgentScopes(cfg);
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const labelAgents = scopes.length > 1;
	for (const scope of scopes) {
		if (opts?.includeWorkspaceMemoryHealth !== false) await noteWorkspaceMemoryHealth(cfg, {
			agentId: scope.agentId,
			workspaceDir: scope.workspaceDir,
			labelAgent: labelAgents
		});
		const outputNote = opts?.noteFn ?? note;
		const noteFn = (message, title) => outputNote(formatAgentMessage(scope.agentId, labelAgents, String(message)), title);
		await noteMemorySearchHealthForAgent(cfg, scope, {
			...opts,
			noteFn,
			includeWorkspaceMemoryHealth: false,
			gatewayMemoryProbe: scope.agentId === defaultAgentId ? opts?.gatewayMemoryProbe : void 0
		});
	}
}
async function noteMemorySearchHealthForAgent(cfg, scope, opts) {
	const { agentId, agentDir } = scope;
	const noteFn = opts.noteFn ?? note;
	const recallHealth = noteRememberAcrossConversationsHealth({
		cfg,
		agentId,
		noteFn
	});
	const resolved = resolveMemorySearchConfig(cfg, agentId);
	const hasRemoteApiKey = hasConfiguredMemorySecretInput(resolved?.remote?.apiKey);
	if (!resolved) {
		noteFn(recallHealth.enabled ? `Remember across conversations is effectively enabled for agent "${agentId}", but memory search is disabled. Enable memory search or set memory.search.rememberAcrossConversations to false.` : "Memory search is explicitly disabled (enabled: false).", "Memory search");
		return;
	}
	const provider = resolved.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : resolved.provider;
	if (!resolveActiveMemoryBackendConfig({
		cfg,
		agentId
	})) {
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
		if (hasActiveAlternateMemoryPluginSlot(cfg)) return;
		noteFn("No active memory plugin is registered for the current config.", "Memory search");
		return;
	}
	if (provider === "none") return;
	if (provider === "local") {
		const suggestedRemoteProvider = resolveSuggestedRemoteMemoryProvider();
		const runtimeFacts = opts?.gatewayMemoryProbe?.runtimeFacts;
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
			if (runtimeFacts) noteFn(formatLocalRuntimeDoctorNote(runtimeFacts), "Memory search");
			return;
		}
		const hasExplicitLocalModel = hasLocalEmbeddings(resolved.local);
		const hasUnavailableConfiguredLocalModel = Boolean(normalizeOptionalString(resolved.local.modelPath)) && !hasExplicitLocalModel;
		if (opts?.gatewayMemoryProbe?.skipped && !hasUnavailableConfiguredLocalModel) return;
		const detail = opts?.gatewayMemoryProbe?.error?.trim();
		const gatewayDetail = detail && detail !== runtimeFacts?.loadError ? detail : null;
		noteFn([
			runtimeFacts ? formatLocalRuntimeDoctorNote(runtimeFacts) : null,
			runtimeFacts ? "" : null,
			hasExplicitLocalModel ? "Memory search provider is set to \"local\" and a local model path is configured, but local embeddings are not confirmed ready." : "Memory search provider is set to \"local\", but local embeddings are not confirmed ready.",
			gatewayDetail ? `Gateway probe: ${gatewayDetail}` : null,
			"",
			"Fix (pick one):",
			`- Install the llama.cpp provider plugin: ${formatCliCommand("openclaw plugins install @openclaw/llama-cpp-provider")}`,
			`- Set a local GGUF model path in config`,
			suggestedRemoteProvider ? `- Switch to a remote provider: ${formatCliCommand(`openclaw config set memory.search.provider ${suggestedRemoteProvider}`)}` : `- Switch to a remote embedding provider in config`,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].filter(Boolean).join("\n"), "Memory search");
		return;
	}
	if (isOpenAICompatibleMemoryProvider(provider, cfg) && !resolveOpenAICompatibleMemoryBaseUrl(provider, cfg, resolved.remote?.baseUrl)) {
		noteFn([
			`Memory search provider is set to "${provider}" but no OpenAI-compatible embeddings endpoint was configured.`,
			"Set memory.search.remote.baseUrl to the /v1 endpoint for your embeddings server.",
			"",
			"Fix:",
			`- ${formatCliCommand("openclaw config set memory.search.remote.baseUrl http://127.0.0.1:1234/v1")}`,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	if (isOpenAICompatibleMemoryProvider(provider, cfg) && !normalizeOptionalString(resolved.model)) {
		noteFn([
			`Memory search provider is set to "${provider}" but no OpenAI-compatible embedding model was configured.`,
			"Set memory.search.model to the embedding model id your server expects.",
			"",
			"Fix:",
			`- ${formatCliCommand("openclaw config set memory.search.model text-embedding-bge-m3")}`,
			"",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	if (isKeyOptionalMemoryProvider(provider, cfg)) {
		if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
		if (opts?.gatewayMemoryProbe?.skipped) return;
		const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
		noteFn([
			gatewayProbeWarning ? `Memory search provider "${provider}" is configured, but the gateway reports embeddings are not ready.` : `Memory search provider "${provider}" is configured, but the gateway could not confirm embeddings are ready.`,
			gatewayProbeWarning,
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].filter(Boolean).join("\n"), "Memory search");
		return;
	}
	if (hasRemoteApiKey || await hasApiKeyForProvider(provider, cfg, agentDir, { skipProfileResolution: opts?.skipAuthProfileResolution === true })) return;
	if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
		noteFn([
			`Memory search provider is set to "${provider}" but the API key was not found in the CLI environment.`,
			"The running gateway reports memory embeddings are ready for the default agent.",
			`Verify: ${formatCliCommand("openclaw memory status --deep")}`
		].join("\n"), "Memory search");
		return;
	}
	const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
	const envVar = resolvePrimaryMemoryProviderEnvVar(provider);
	noteFn([
		`Memory search provider is set to "${provider}" but no API key was found.`,
		`Semantic recall will not work without a valid API key.`,
		gatewayProbeWarning ? gatewayProbeWarning : null,
		"",
		"Fix (pick one):",
		`- Set ${envVar} in your environment`,
		`- Configure credentials: ${formatCliCommand("openclaw configure --section model")}`,
		`- To disable: ${formatCliCommand("openclaw config set memory.search.enabled false")}`,
		"",
		`Verify: ${formatCliCommand("openclaw memory status --deep")}`
	].join("\n"), "Memory search");
}
/**
* Check whether local embeddings are available.
*
*/
function hasLocalEmbeddings(local) {
	const modelPath = normalizeOptionalString(local.modelPath);
	if (!modelPath) return false;
	if (/^(hf:|https?:)/i.test(modelPath)) return true;
	const resolved = resolveUserPath(modelPath);
	try {
		return fs.statSync(resolved).isFile();
	} catch {
		return false;
	}
}
async function hasApiKeyForProvider(provider, cfg, agentDir, opts) {
	const authProviderId = resolveMemoryEmbeddingProviderDoctorMetadata(provider)?.authProviderId ?? provider;
	if (resolveEnvApiKey(authProviderId) || resolveUsableCustomProviderApiKey({
		cfg,
		provider: authProviderId
	})) return true;
	if (opts?.skipProfileResolution === true) {
		if (authProviderId === "amazon-bedrock") return hasConfiguredAwsSdkAuthForProvider(authProviderId, cfg);
		const orderedProfileIds = findNormalizedProviderValue(cfg.auth?.order, authProviderId);
		return orderedProfileIds === void 0 ? hasAuthProfileStoreSourceForProvider(authProviderId, agentDir) : hasAuthProfileStoreSourceForProvider(authProviderId, agentDir, { profileIds: orderedProfileIds });
	}
	if (authProviderId !== "amazon-bedrock" && !hasAnyAuthProfileStoreSource(agentDir)) return false;
	try {
		await resolveApiKeyForProviderCore({
			provider: authProviderId,
			cfg,
			agentDir
		});
		return true;
	} catch {
		return false;
	}
}
function resolvePrimaryMemoryProviderEnvVar(provider) {
	if (provider === "openai") return "OPENAI_API_KEY";
	return resolveMemoryEmbeddingProviderDoctorMetadata(provider)?.envVars[0] ?? `${provider.toUpperCase()}_API_KEY`;
}
function buildGatewayProbeWarning(probe) {
	if (!probe?.checked || probe.ready) return null;
	const detail = probe.error?.trim();
	return detail ? `Gateway memory probe for default agent is not ready: ${detail}` : "Gateway memory probe for default agent is not ready.";
}
//#endregion
export { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth };
