import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { p as normalizeUniqueSingleOrTrimmedStringList, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { g as resolveSessionAgentIds } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { n as hasAgentRosterProperty, r as listAgentEntries, s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey, f as parseThreadSessionSuffix, u as parseRawSessionConversationRef } from "./session-key-utils-D8x_bjrd.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { r as resolveProviderToolPolicy } from "./provider-tool-policy-3XzDEL5e.js";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-CYqaxHxr.js";
import { c as mergeAlsoAllowPolicy, v as resolveToolProfilePolicy } from "./tool-policy-CWmnHLY1.js";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-Dj2EhvVn.js";
import { r as isToolAllowedByPolicyName } from "./tool-policy-match-CEXvGj1C.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { g as registerRuntimeConfigSnapshotPreparer } from "./runtime-snapshot-DIuCzlel.js";
import { n as normalizeMessageChannel } from "./message-channel-core-3kHPdlzP.js";
import { n as getLoadedChannelPlugin } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import "./message-channel-C3nRvjrX.js";
import { F as resolveSessionConversation } from "./agent-harness-session-key-BpWapmwX.js";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-DhUMjkbX.js";
import { a as registerClawInstallSchemaVersionSnapshotListener, i as readCachedClawInstallSchemaVersions, l as digestClawAgentConfig, r as initializeCachedClawInstallSchemaVersions } from "./provenance-runtime-read-BnGip8J4.js";
import { r as resolveChannelGroupToolsPolicy } from "./group-policy-C-9oSMC-.js";
import { a as resolveStoredSubagentInheritedToolDenylist, i as resolveStoredSubagentInheritedToolAllowlist, r as resolveStoredSubagentCapabilities, s as resolveSubagentCapabilityStore } from "./subagent-capabilities-QWxmiHl_.js";
//#region src/claws/tool-policy-runtime.ts
const frozenToolAllowPolicies = /* @__PURE__ */ new WeakSet();
const preparedClawToolPolicies = /* @__PURE__ */ new WeakMap();
let preparedCandidates = [];
let preparedStateOptions = {};
let readPreparedSchemaVersions = readCachedClawInstallSchemaVersions;
const uninitializedStateError = /* @__PURE__ */ new Error("OpenClaw state database has not initialized Claw consent provenance.");
function markFrozenClawToolAllowPolicy(policy) {
	if (policy) frozenToolAllowPolicies.add(policy);
}
function isFrozenClawToolAllowPolicy(policy) {
	return policy ? frozenToolAllowPolicies.has(policy) : false;
}
function applyPreparedClawToolPolicyConsent() {
	const snapshot = readPreparedSchemaVersions(preparedStateOptions);
	for (const candidate of preparedCandidates) {
		if (snapshot.kind === "uninitialized") {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: uninitializedStateError
			});
			continue;
		}
		if (snapshot.kind === "state-error") {
			if (snapshot.ownershipUnknown || snapshot.knownAgentIds.has(candidate.agentId)) preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: snapshot.error
			});
			else preparedClawToolPolicies.delete(candidate.tools);
			continue;
		}
		const schemaVersionRead = snapshot.schemaVersions.get(candidate.agentId);
		if (!schemaVersionRead) {
			preparedClawToolPolicies.delete(candidate.tools);
			continue;
		}
		if (schemaVersionRead.kind === "error") {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: schemaVersionRead.error
			});
			continue;
		}
		if (schemaVersionRead.schemaVersion === "openclaw.clawInstallRecord.v2" && schemaVersionRead.agentConfigDigest !== candidate.agentConfigDigest) {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: /* @__PURE__ */ new Error("Claw agent configuration does not match its consent provenance.")
			});
			continue;
		}
		preparedClawToolPolicies.set(candidate.tools, { kind: schemaVersionRead.schemaVersion === "openclaw.clawInstallRecord.v2" ? "current" : "legacy" });
	}
}
function prepareClawToolPolicyConsent(config, options = {}) {
	for (const candidate of preparedCandidates) preparedClawToolPolicies.delete(candidate.tools);
	preparedCandidates = listAgentEntries(config).flatMap((agent) => {
		const tools = agent.tools;
		return tools && (tools.profile || tools.allow?.length) ? [{
			agentId: agent.id,
			agentConfigDigest: digestClawAgentConfig(agent),
			tools
		}] : [];
	});
	const { readSchemaVersions, ...stateOptions } = options;
	preparedStateOptions = stateOptions;
	readPreparedSchemaVersions = readSchemaVersions ?? readCachedClawInstallSchemaVersions;
	if (!readSchemaVersions) initializeCachedClawInstallSchemaVersions(stateOptions);
	applyPreparedClawToolPolicyConsent();
}
registerClawInstallSchemaVersionSnapshotListener(() => applyPreparedClawToolPolicyConsent());
registerRuntimeConfigSnapshotPreparer((config) => prepareClawToolPolicyConsent(config));
var ClawToolProfileConsentError = class extends Error {
	constructor(agentId, options = {}) {
		super(options.unboundedFullProfile ? `Claw-managed agent ${JSON.stringify(agentId)} uses the legacy unbounded full tool profile. Add an explicit tools.allow list to its package OpenClaw profile, then run \`openclaw claws update ${agentId}\` and approve the refreshed tool authority.` : `Claw-managed agent ${JSON.stringify(agentId)} uses a legacy dynamic tool policy. Run \`openclaw claws update ${agentId}\` and approve the refreshed tool authority before running it.`);
		this.name = "ClawToolProfileConsentError";
	}
};
var ClawToolProfileConsentStateError = class extends Error {
	constructor(agentId, cause) {
		super(`Cannot verify the installed tool authority for Claw-managed agent ${JSON.stringify(agentId)}. Repair the OpenClaw state database before running it.`, { cause });
		this.name = "ClawToolProfileConsentStateError";
	}
};
function resolveClawToolPolicyConsent(params) {
	if (!params.agentId || !params.ownsProfile && !params.hasAgentAllowlist) return { frozen: false };
	const prepared = params.agentTools ? preparedClawToolPolicies.get(params.agentTools) : void 0;
	if (!prepared) return { frozen: false };
	if (prepared.kind === "state-error") throw new ClawToolProfileConsentStateError(params.agentId, prepared.error);
	if (prepared.kind === "legacy" || params.ownsProfile && (params.profile !== "full" || !params.hasAgentAllowlist)) throw new ClawToolProfileConsentError(params.agentId, { unboundedFullProfile: prepared.kind === "legacy" && params.profile === "full" && !params.hasAgentAllowlist });
	return { frozen: params.hasAgentAllowlist };
}
//#endregion
//#region src/agents/agent-tools.policy.ts
/**
* Resolves sandbox tool policies for agents, providers, sub-agents, and group
* sessions. Keeps runtime tool filtering tied to canonical config, session
* provenance, and inherited sub-agent capabilities.
*/
/**
* Tools always denied for sub-agents regardless of depth.
* These are system-level or interactive tools that sub-agents should never use.
*/
const SUBAGENT_TOOL_DENY_ALWAYS = [
	"gateway",
	"agents_list",
	"session_status",
	AUTOMATIONS_TOOL_NAME,
	"message",
	"sessions_send",
	"conversations_list",
	"conversations_send",
	"conversations_turn"
];
/** Tools that only make sense for orchestrator sub-agents that can spawn children. */
const SUBAGENT_TOOL_DENY_LEAF = [
	"subagents",
	"sessions_list",
	"sessions_history",
	"sessions_search",
	"sessions_spawn"
];
function resolveSubagentDenyListForRole(role) {
	if (role === "leaf") return [...SUBAGENT_TOOL_DENY_ALWAYS, ...SUBAGENT_TOOL_DENY_LEAF];
	return [...SUBAGENT_TOOL_DENY_ALWAYS];
}
function mergeConfiguredSubagentAllow(allow, alsoAllow) {
	return allow && alsoAllow ? uniqueStrings([...allow, ...alsoAllow]) : allow;
}
/** Resolve sub-agent tool policy from stored session capabilities. */
function resolveSubagentToolPolicyForSession(cfg, sessionKey, opts) {
	const configured = cfg?.tools?.subagents?.tools;
	const capabilities = resolveStoredSubagentCapabilities(sessionKey, {
		cfg,
		store: resolveSubagentCapabilityStore(sessionKey, {
			cfg,
			store: opts?.store
		})
	});
	const allow = Array.isArray(configured?.allow) ? configured.allow : void 0;
	const alsoAllow = Array.isArray(configured?.alsoAllow) ? configured.alsoAllow : void 0;
	const deny = [...resolveSubagentDenyListForRole(capabilities.role), ...Array.isArray(configured?.deny) ? configured.deny : []];
	return {
		allow: mergeConfiguredSubagentAllow(allow, alsoAllow),
		deny
	};
}
/** Resolve the tool policy inherited from a parent sub-agent session. */
function resolveInheritedToolPolicyForSession(cfg, sessionKey, opts) {
	const inheritedToolAllow = resolveStoredSubagentInheritedToolAllowlist(sessionKey, {
		cfg,
		store: opts?.store
	});
	const inheritedToolDeny = resolveStoredSubagentInheritedToolDenylist(sessionKey, {
		cfg,
		store: opts?.store
	});
	if (inheritedToolAllow.length === 0 && inheritedToolDeny.length === 0) return;
	return {
		...inheritedToolAllow.length > 0 ? { allow: inheritedToolAllow } : {},
		...inheritedToolDeny.length > 0 ? { deny: inheritedToolDeny } : {}
	};
}
/** Filter runtime tools by sandbox allow/deny policy. */
function filterToolsByPolicy(tools, policy) {
	if (!policy) return tools;
	return tools.filter((tool) => isToolAllowedByPolicyName(tool.name, policy));
}
/** Resolve the shared profile, scope, extra, and sandbox policy layers. */
function resolveConfiguredToolPolicies(params) {
	const policies = [];
	const profile = params.agentTools?.profile ?? params.cfg.tools?.profile;
	const profileAlsoAllow = resolveExplicitProfileAlsoAllow(params.agentTools) ?? resolveExplicitProfileAlsoAllow(params.cfg.tools);
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow);
	if (profilePolicy) policies.push(profilePolicy);
	const globalPolicy = pickSandboxToolPolicy(params.cfg.tools ?? void 0);
	if (globalPolicy) policies.push(globalPolicy);
	const agentPolicy = pickSandboxToolPolicy(params.agentTools);
	if (agentPolicy) policies.push(agentPolicy);
	for (const policy of params.extraPolicies ?? []) if (policy) policies.push(policy);
	if (params.sandboxMode === "all") policies.push(resolveSandboxToolPolicyForAgent(params.cfg, params.agentId ?? void 0));
	return policies;
}
function collectUniqueStrings(values) {
	return normalizeUniqueSingleOrTrimmedStringList(values);
}
function buildScopedGroupIdCandidates(groupId) {
	const raw = groupId?.trim();
	if (!raw) return [];
	const topicSenderMatch = raw.match(/^(.+):topic:([^:]+):sender:([^:]+)$/i);
	if (topicSenderMatch) {
		const [, chatId, topicId] = topicSenderMatch;
		return collectUniqueStrings([
			raw,
			`${chatId}:topic:${topicId}`,
			chatId
		]);
	}
	const topicMatch = raw.match(/^(.+):topic:([^:]+)$/i);
	if (topicMatch) {
		const [, chatId, topicId] = topicMatch;
		return collectUniqueStrings([`${chatId}:topic:${topicId}`, chatId]);
	}
	const senderMatch = raw.match(/^(.+):sender:([^:]+)$/i);
	if (senderMatch) {
		const [, chatId] = senderMatch;
		return collectUniqueStrings([raw, chatId]);
	}
	return [raw];
}
function resolveGroupContextFromSessionKey(sessionKey) {
	const raw = (sessionKey ?? "").trim();
	if (!raw) return {};
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(raw);
	const conversationKey = threadId ? baseSessionKey : raw;
	const conversation = parseRawSessionConversationRef(conversationKey);
	if (conversation) {
		const resolvedConversation = resolveSessionConversation({
			channel: conversation.channel,
			kind: conversation.kind,
			rawId: conversation.rawId
		});
		return {
			channel: conversation.channel,
			groupIds: collectUniqueStrings([
				...buildScopedGroupIdCandidates(conversation.rawId),
				resolvedConversation?.id,
				resolvedConversation?.baseConversationId,
				...resolvedConversation?.parentConversationCandidates ?? []
			])
		};
	}
	const parts = (conversationKey ?? raw).split(":").filter(Boolean);
	let body = parts[0] === "agent" ? parts.slice(2) : parts;
	if (body[0] === "subagent") body = body.slice(1);
	if (body.length < 3) return {};
	const [channel, kind, ...rest] = body;
	if (kind !== "group" && kind !== "channel") return {};
	const groupId = rest.join(":").trim();
	if (!groupId) return {};
	return {
		channel: normalizeLowercaseStringOrEmpty(channel),
		groupIds: buildScopedGroupIdCandidates(groupId)
	};
}
function resolveTrustedGroupIdFromContexts(params) {
	const callerGroupId = (params.groupId ?? "").trim();
	if (!callerGroupId) return {
		groupId: params.groupId,
		dropped: false
	};
	const trustedGroupIds = collectUniqueStrings([...params.sessionContext.groupIds ?? [], ...params.spawnedContext.groupIds ?? []]);
	if (trustedGroupIds.length === 0) return {
		groupId: null,
		dropped: true
	};
	if (trustedGroupIds.includes(callerGroupId)) return {
		groupId: params.groupId,
		dropped: false
	};
	return {
		groupId: null,
		dropped: true
	};
}
/** Validate caller-supplied group ids against server-derived session context. */
function resolveTrustedGroupId(params) {
	return resolveTrustedGroupIdFromContexts({
		groupId: params.groupId,
		sessionContext: resolveGroupContextFromSessionKey(params.sessionKey),
		spawnedContext: resolveGroupContextFromSessionKey(params.spawnedBy)
	});
}
/** True when a server-derived session key names a group/channel conversation. */
function sessionKeyNamesGroupConversation(sessionKey) {
	return (resolveGroupContextFromSessionKey(sessionKey).groupIds?.length ?? 0) > 0;
}
function resolveExplicitProfileAlsoAllow(tools) {
	return Array.isArray(tools?.alsoAllow) ? tools.alsoAllow : void 0;
}
function hasExplicitToolSection(section) {
	return section !== void 0 && section !== null;
}
function detectImplicitProfileGrants(params) {
	const entries = [];
	if (hasExplicitToolSection(params.agentTools?.exec) || params.includeGlobalSections && hasExplicitToolSection(params.globalTools?.exec)) entries.push({
		section: "tools.exec",
		grants: ["exec", "process"]
	});
	if (hasExplicitToolSection(params.agentTools?.fs) || params.includeGlobalSections && hasExplicitToolSection(params.globalTools?.fs)) entries.push({
		section: "tools.fs",
		grants: [
			"read",
			"write",
			"edit"
		]
	});
	if (entries.length === 0) return;
	return { entries };
}
function formatImplicitToolSections(sections) {
	return sections.join(" / ");
}
function formatToolListForWarning(toolNames) {
	return toolNames.map((toolName) => `"${toolName}"`).join(", ");
}
/** Resolve the layered global, provider, agent, and profile tool policies. */
function resolveEffectiveToolPolicy(params) {
	const explicitAgentId = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	const agentId = params.config && (!hasAgentRosterProperty(params.config) || listAgentEntries(params.config).length > 0) ? resolveSessionAgentIds({
		config: params.config,
		agentId: explicitAgentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : explicitAgentId ?? parseAgentSessionKey(params.sessionKey)?.agentId;
	const agentConfig = params.config && agentId ? resolveAgentConfig(params.config, agentId) : void 0;
	const implicitDefaultTools = params.config ? (params.config.agents?.defaults)?.tools : void 0;
	const agentTools = agentConfig?.tools ?? (params.config && !hasAgentRosterProperty(params.config) ? implicitDefaultTools : void 0);
	const globalTools = params.config?.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileSource = agentTools?.profile ? "agent" : globalTools?.profile ? "global" : void 0;
	const providerPolicy = resolveProviderToolPolicy({
		byProvider: globalTools?.byProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const agentProviderPolicy = resolveProviderToolPolicy({
		byProvider: agentTools?.byProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const explicitProfileAlsoAllow = resolveExplicitProfileAlsoAllow(agentTools) ?? resolveExplicitProfileAlsoAllow(globalTools);
	const agentPolicy = pickSandboxToolPolicy(agentTools);
	if (resolveClawToolPolicyConsent({
		agentTools,
		agentId,
		profile,
		ownsProfile: profileSource === "agent",
		hasAgentAllowlist: (agentPolicy?.allow?.length ?? 0) > 0
	}).frozen) markFrozenClawToolAllowPolicy(agentPolicy);
	if (profile) {
		const implicitGrants = detectImplicitProfileGrants({
			globalTools,
			agentTools,
			includeGlobalSections: profileSource === "global"
		});
		if (implicitGrants) {
			const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), explicitProfileAlsoAllow);
			const uncoveredEntries = implicitGrants.entries.map((entry) => ({
				section: entry.section,
				grants: entry.grants.filter((toolName) => !isToolAllowedByPolicyName(toolName, profilePolicy))
			})).filter((entry) => entry.grants.length > 0);
			const uncovered = uncoveredEntries.flatMap((entry) => entry.grants);
			if (uncovered.length > 0) logWarn(`tools policy: profile "${profile}"${agentId ? ` (agent "${agentId}")` : ""} has configured tool sections (${formatImplicitToolSections(uncoveredEntries.map((entry) => entry.section))}) that no longer implicitly widen the profile. Add alsoAllow: [${formatToolListForWarning(uncovered)}] explicitly if these tools should be available. See #47487.`);
		}
	}
	const profileAlsoAllow = explicitProfileAlsoAllow ? uniqueStrings(explicitProfileAlsoAllow) : void 0;
	return {
		agentId,
		globalPolicy: pickSandboxToolPolicy(globalTools),
		globalProviderPolicy: pickSandboxToolPolicy(providerPolicy),
		agentPolicy,
		agentProviderPolicy: pickSandboxToolPolicy(agentProviderPolicy),
		profile,
		providerProfile: agentProviderPolicy?.profile ?? providerPolicy?.profile,
		profileAlsoAllow,
		providerProfileAlsoAllow: Array.isArray(agentProviderPolicy?.alsoAllow) ? agentProviderPolicy?.alsoAllow : Array.isArray(providerPolicy?.alsoAllow) ? providerPolicy?.alsoAllow : void 0
	};
}
function denyAllToolPolicy() {
	return {
		allow: [],
		deny: ["*"]
	};
}
/**
* True when a named account id is still configured for at least one channel
* in the runtime config. Used by the scheduled-authority guard when no channel
* can be derived (for example a DM thread): deny-all is only correct for
* accounts that were genuinely removed, not for a still-configured creator
* account whose conversation simply happens to be a non-group (DM) scope.
*/
function isConfiguredChannelAccount(config, accountId) {
	const normalized = normalizeAccountId(accountId);
	const channels = config.channels;
	if (!channels) return false;
	for (const channelConfig of Object.values(channels)) {
		const accounts = channelConfig?.accounts;
		if (!accounts || typeof accounts !== "object") continue;
		if (Object.keys(accounts).some((candidate) => normalizeAccountId(candidate) === normalized)) return true;
	}
	return false;
}
/** Resolve group-scoped tool policy after validating session provenance. */
function resolveGroupToolPolicy(params) {
	if (!params.config) return;
	const sessionContext = resolveGroupContextFromSessionKey(params.sessionKey);
	const spawnedContext = resolveGroupContextFromSessionKey(params.spawnedBy);
	const trustedGroup = resolveTrustedGroupIdFromContexts({
		groupId: params.groupId,
		sessionContext,
		spawnedContext
	});
	const groupIds = collectUniqueStrings([
		...sessionContext.groupIds ?? [],
		...spawnedContext.groupIds ?? [],
		...buildScopedGroupIdCandidates(trustedGroup.groupId)
	]);
	const channel = normalizeMessageChannel(sessionContext.channel ?? spawnedContext.channel ?? params.messageProvider);
	const accountId = normalizeAccountId(params.accountId);
	if (!channel) return params.requireConfiguredAccount && accountId !== "default" ? isConfiguredChannelAccount(params.config, accountId) ? void 0 : denyAllToolPolicy() : void 0;
	let plugin;
	try {
		plugin = getLoadedChannelPlugin(channel);
	} catch {
		plugin = void 0;
	}
	if (params.requireConfiguredAccount && accountId !== "default") {
		let configured;
		try {
			configured = plugin?.config.listAccountIds(params.config).some((candidate) => normalizeAccountId(candidate) === accountId) === true;
		} catch {
			configured = false;
		}
		if (!configured) return denyAllToolPolicy();
	}
	if (groupIds.length === 0) return;
	for (const groupId of groupIds) {
		const toolsConfig = plugin?.groups?.resolveToolPolicy?.({
			cfg: params.config,
			groupId,
			groupChannel: trustedGroup.dropped ? null : params.groupChannel,
			groupSpace: trustedGroup.dropped ? null : params.groupSpace,
			accountId,
			senderPolicyMode: params.senderPolicyMode,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		});
		const policy = pickSandboxToolPolicy(toolsConfig);
		if (policy) return policy;
	}
	return pickSandboxToolPolicy(resolveChannelGroupToolsPolicy({
		cfg: params.config,
		channel,
		messageProvider: channel,
		groupId: groupIds[0],
		groupIdCandidates: groupIds.slice(1),
		accountId,
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	}));
}
//#endregion
export { resolveInheritedToolPolicyForSession as a, sessionKeyNamesGroupConversation as c, resolveGroupToolPolicy as i, isFrozenClawToolAllowPolicy as l, resolveConfiguredToolPolicies as n, resolveSubagentToolPolicyForSession as o, resolveEffectiveToolPolicy as r, resolveTrustedGroupId as s, filterToolsByPolicy as t };
