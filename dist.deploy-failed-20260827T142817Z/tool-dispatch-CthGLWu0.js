import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy, i as collectExplicitAllowlist, l as replaceWithEffectiveToolAllowlist, s as hasRestrictiveAllowPolicy, v as resolveToolProfilePolicy } from "./tool-policy-CWmnHLY1.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { i as resolveGatewayMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DwfYu5UM.js";
import { r as resolveEffectiveToolPolicy } from "./agent-tools.policy-D3C_cMAq.js";
import { i as getPluginToolMeta } from "./tools-uoGjdHqF.js";
import { t as createOpenClawTools } from "./openclaw-tools-mwvSTuhZ.js";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-CIM84Ent.js";
import { r as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-BmEAeEgo.js";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-mznG5JNY.js";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-CvQf2cHG.js";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-C3dsDuHN.js";
//#region src/skills/runtime/tool-dispatch.ts
/**
* Policy-enforcement seam for skill `command-dispatch: tool` invocations.
* Keep this aligned with normal tool surfaces across sender, group, sandbox,
* and subagent policy layers.
*/
function resolveSkillDispatchTools(params) {
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
	const policyFiltered = applyToolPolicyPipeline({
		tools: createOpenClawTools({
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
	});
	if (explicitPolicyList.some(hasRestrictiveAllowPolicy)) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, policyFiltered);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, policyFiltered, (tool) => getPluginToolMeta(tool));
	return policyFiltered;
}
//#endregion
export { resolveSkillDispatchTools };
