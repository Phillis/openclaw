import { u as resolveToolProfilePolicy } from "./tool-policy-shared-DmpG3HvD.js";
import { a as collectExplicitDenylist, c as hasRestrictiveAllowPolicy, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-B1rvCc4B.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { m as resolveGatewayMessageChannel } from "./message-channel-BZwx7FCw.js";
import { r as resolveEffectiveToolPolicy } from "./agent-tools.policy-DrNOM40T.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Jg1T3gN6.js";
import { i as getPluginToolMeta } from "./tools-DL5ef4Om.js";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-BwKWjHQX.js";
import { r as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-nNZ7-Jy3.js";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-NN2j7ePJ.js";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-D2GNahvB.js";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-BB5wnYEo.js";
import { t as applyToolAvailabilityDescriptions } from "./agent-tools.deferred-followup-DTu8kxDS.js";
//#region src/skills/runtime/tool-dispatch.ts
/**
* Policy-enforcement seam for skill `command-dispatch: tool` invocations.
* Keep this aligned with normal tool surfaces across sender, group, sandbox,
* and subagent policy layers.
*/
function resolveSkillDispatchTools(params, dependencies) {
	const channel = resolveGatewayMessageChannel(params.message.surface) ?? resolveGatewayMessageChannel(params.message.provider) ?? void 0;
	const { agentId: resolvedAgentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		modelProvider: params.provider,
		modelId: params.model
	});
	const profilePolicy = resolveToolProfilePolicy(profile);
	const providerProfilePolicy = resolveToolProfilePolicy(providerProfile);
	const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, profileAlsoAllow);
	const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, providerProfileAlsoAllow);
	const groupId = params.sessionEntry?.groupId ?? params.groupId;
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = resolveRequesterToolPolicies({
		config: params.cfg,
		sessionKey: params.sessionKey,
		subagentSessionKey: params.sessionKey,
		agentId: resolvedAgentId,
		spawnedBy: params.sessionEntry?.spawnedBy,
		messageProvider: channel,
		groupId,
		groupChannel: params.sessionEntry?.groupChannel,
		groupSpace: params.sessionEntry?.space,
		accountId: params.message.accountId,
		senderId: params.message.senderId ?? params.senderId,
		senderName: params.message.senderName,
		senderUsername: params.message.senderUsername,
		senderE164: params.message.senderE164
	});
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	});
	const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
	const ownerOnlyCoreToolPolicy = !params.senderIsOwner ? { deny: [...GATEWAY_OWNER_ONLY_CORE_TOOLS] } : void 0;
	const explicitPolicyList = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy,
		groupPolicy,
		senderPolicy,
		sandboxPolicy,
		subagentPolicy,
		inheritedToolPolicy,
		ownerOnlyCoreToolPolicy
	];
	const explicitDenylist = collectExplicitDenylist(explicitPolicyList);
	const inheritedToolAllowlist = [];
	const cronCreatorToolAllowlist = [];
	const beforeToolCallHookContext = params.skillCommand ? {
		cwd: params.workspaceDir,
		workspaceDir: params.workspaceDir,
		...params.sessionEntry?.skillsSnapshot ? { skillsSnapshot: params.sessionEntry.skillsSnapshot } : {},
		skillCommand: {
			commandName: params.skillCommand.name,
			...params.skillCommand.skillFile ? { skillFile: params.skillCommand.skillFile } : {},
			skillName: params.skillCommand.skillName,
			skillSource: params.skillCommand.skillSource ?? "unknown",
			...params.skillCommand.toolName ? { toolName: params.skillCommand.toolName } : {}
		}
	} : void 0;
	const finalized = applyToolAvailabilityDescriptions(applyToolPolicyPipeline({
		tools: dependencies.createOpenClawTools({
			agentSessionKey: params.sessionKey,
			agentChannel: channel,
			agentAccountId: params.message.accountId,
			agentTo: params.message.originatingTo ?? params.message.to,
			agentThreadId: params.message.messageThreadId ?? void 0,
			nativeChannelId: params.message.nativeChannelId,
			agentGroupId: groupId,
			agentGroupChannel: params.sessionEntry?.groupChannel,
			agentGroupSpace: params.sessionEntry?.space,
			agentMemberRoleIds: params.message.memberRoleIds,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			config: params.cfg,
			sessionConfigSource: "runtime",
			allowGatewaySubagentBinding: true,
			sandboxed: sandboxRuntime.sandboxed,
			requesterAgentIdOverride: params.agentId,
			requesterSenderId: params.senderId,
			senderIsOwner: params.senderIsOwner,
			sessionId: params.sessionEntry?.sessionId,
			currentChannelId: params.currentChannelId,
			...beforeToolCallHookContext ? { beforeToolCallHookContext } : {},
			modelProvider: params.provider,
			modelId: params.model,
			pluginToolAllowlist: collectExplicitAllowlist(explicitPolicyList),
			pluginToolDenylist: explicitDenylist,
			cronCreatorToolAllowlist,
			inheritedToolAllowlist,
			inheritedToolDenylist: explicitDenylist
		}),
		toolMeta: (tool) => getPluginToolMeta(tool),
		warn: logVerbose,
		steps: [
			...buildDefaultToolPolicyPipelineSteps({
				profilePolicy: profilePolicyWithAlsoAllow,
				profile,
				profileUnavailableCoreWarningAllowlist: profilePolicy?.allow,
				providerProfilePolicy: providerProfilePolicyWithAlsoAllow,
				providerProfile,
				providerProfileUnavailableCoreWarningAllowlist: providerProfilePolicy?.allow,
				globalPolicy,
				globalProviderPolicy,
				agentPolicy,
				agentProviderPolicy,
				groupPolicy,
				senderPolicy,
				agentId: resolvedAgentId
			}),
			{
				policy: sandboxPolicy,
				label: "sandbox tools.allow"
			},
			{
				policy: subagentPolicy,
				label: "subagent tools.allow"
			},
			{
				policy: inheritedToolPolicy,
				label: "inherited tools"
			},
			{
				policy: ownerOnlyCoreToolPolicy,
				label: "gateway sender owner-only tools"
			}
		],
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			toolDenylist: explicitDenylist
		})
	}), { agentId: resolvedAgentId });
	if (explicitPolicyList.some(hasRestrictiveAllowPolicy)) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, finalized);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, finalized, (tool) => getPluginToolMeta(tool));
	return finalized;
}
//#endregion
export { resolveSkillDispatchTools };
