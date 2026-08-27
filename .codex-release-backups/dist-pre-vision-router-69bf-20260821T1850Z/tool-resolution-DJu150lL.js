import { g as resolveSessionAgentIds } from "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy, g as normalizeToolPolicyName, i as collectExplicitAllowlist, l as replaceWithEffectiveToolAllowlist, s as hasRestrictiveAllowPolicy, v as resolveToolProfilePolicy } from "./tool-policy-CWmnHLY1.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-3kHPdlzP.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DlGUtpYV.js";
import { r as resolveEffectiveToolPolicy } from "./agent-tools.policy-Ba4icL7P.js";
import { i as getPluginToolMeta } from "./tools-BkbGUY3V.js";
import { t as createOpenClawTools } from "./openclaw-tools-BnRMSGjs.js";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-CA6pDi8g.js";
import { r as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-VX-ZM_3U.js";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-0VQKQ2xX.js";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-Cu-lqgYe.js";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-BbL5gxty.js";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS, t as DEFAULT_GATEWAY_HTTP_TOOL_DENY } from "./dangerous-tools-C3dsDuHN.js";
import { n as createLazyExecTool, r as resolveExecToolConfig } from "./core-coding-tools-D9wfQjz_.js";
import { r as filterToolsByMessageProvider, t as createOpenClawCodingTools } from "./agent-tools-kro5rXpZ.js";
import { n as nodeExecSchema } from "./bash-tools.schemas-401maNW8.js";
import { t as resolveExecDefaults } from "./exec-defaults-BrbKy5xz.js";
//#region src/gateway/tool-resolution.ts
/** Resolve the tools visible to a gateway caller after agent, channel, and surface policy. */
function resolveGatewayScopedTools(params) {
	const runtimePolicySessionKey = params.runtimePolicySessionKey?.trim() || params.sessionKey;
	const sessionAgentId = resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}).sessionAgentId;
	const runtimePolicyAgentId = Boolean(params.runtimePolicySessionKey?.trim() || params.runtimePolicyAgentId?.trim()) ? resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: runtimePolicySessionKey,
		agentId: params.runtimePolicyAgentId
	}).sessionAgentId : sessionAgentId;
	const { agentId: resolvedPolicyAgentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: params.cfg,
		sessionKey: runtimePolicySessionKey,
		agentId: runtimePolicyAgentId,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const policyAgentId = resolvedPolicyAgentId ?? runtimePolicyAgentId;
	const profilePolicy = resolveToolProfilePolicy(profile);
	const providerProfilePolicy = resolveToolProfilePolicy(providerProfile);
	const surface = params.surface ?? "http";
	const nodeExecSurface = surface === "loopback" && params.includeNodeExecTool === true;
	const gatewayRequestedTools = params.gatewayRequestedTools ?? [];
	const messageProvider = params.messageProvider?.trim().toLowerCase();
	const sourceReplyDeliveryMode = params.sourceReplyDeliveryMode ?? (params.inboundEventKind === "room_event" && messageProvider !== "webchat" ? "message_tool_only" : void 0);
	const runtimeAlsoAllow = sourceReplyDeliveryMode === "message_tool_only" ? ["message"] : [];
	const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, [
		...profileAlsoAllow ?? [],
		...gatewayRequestedTools,
		...runtimeAlsoAllow
	]);
	const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, [
		...providerProfileAlsoAllow ?? [],
		...gatewayRequestedTools,
		...runtimeAlsoAllow
	]);
	const senderId = params.channelContext?.sender?.id;
	const isOwnerInternalSession = nodeExecSurface && params.senderIsOwner === true && normalizeMessageChannel(params.messageProvider) === "webchat";
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = resolveRequesterToolPolicies({
		config: params.cfg,
		sessionKey: runtimePolicySessionKey,
		subagentSessionKey: runtimePolicySessionKey,
		agentId: policyAgentId,
		spawnedBy: params.spawnedBy,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.accountId ?? null,
		senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : nodeExecSurface ? isOwnerInternalSession ? "never" : "always" : "when-sender-id",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account"
	});
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: sessionAgentId,
		classificationSessionKey: runtimePolicySessionKey,
		classificationAgentId: policyAgentId
	});
	const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
	const excludedToolNames = params.excludeToolNames ? Array.from(params.excludeToolNames) : [];
	const mediatedToolNames = new Set(Array.from(params.mediatedToolNames ?? [], (name) => normalizeToolPolicyName(name)).filter(Boolean));
	const gatewayToolsCfg = params.cfg.gateway?.tools;
	const defaultGatewayDeny = surface === "http" ? DEFAULT_GATEWAY_HTTP_TOOL_DENY.filter((name) => !gatewayToolsCfg?.allow?.some((allowed) => normalizeToolPolicyName(allowed) === normalizeToolPolicyName(name))) : [];
	const ownerOnlyGatewayDeny = params.senderIsOwner === false || surface === "http" && params.senderIsOwner !== true ? [...GATEWAY_OWNER_ONLY_CORE_TOOLS] : [];
	const workspaceDir = params.workspaceDir?.trim() || resolveAgentWorkspaceDir(params.cfg, sessionAgentId);
	const explicitDenylist = collectExplicitDenylist([
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
		defaultGatewayDeny.length > 0 ? { deny: defaultGatewayDeny } : void 0,
		ownerOnlyGatewayDeny.length > 0 ? { deny: ownerOnlyGatewayDeny } : void 0,
		Array.isArray(gatewayToolsCfg?.deny) ? { deny: gatewayToolsCfg.deny } : void 0
	]);
	const inheritedToolDenylist = [...explicitDenylist];
	const inheritedToolAllowlist = [];
	const cronCreatorToolAllowlist = [];
	const shouldInheritEffectiveToolAllowlist = [
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
		gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0
	].some(hasRestrictiveAllowPolicy);
	const openClawTools = createOpenClawTools({
		agentSessionKey: params.sessionKey,
		runId: params.runId,
		requesterAgentIdOverride: sessionAgentId,
		agentChannel: params.messageProvider ?? void 0,
		agentAccountId: params.accountId,
		inboundEventKind: params.inboundEventKind,
		sourceReplyDeliveryMode,
		sourceReplyOnly: params.sourceReplyOnly,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		agentTo: params.agentTo,
		agentThreadId: params.agentThreadId,
		currentChannelId: params.currentChannelId ?? params.agentTo,
		currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		sessionId: params.sessionId,
		onYield: params.onYield,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		senderIsOwner: params.senderIsOwner,
		conversationReadOrigin: params.conversationReadOrigin,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
		allowMediaInvokeCommands: params.allowMediaInvokeCommands,
		disablePluginTools: params.disablePluginTools,
		wrapBeforeToolCallHook: false,
		config: params.cfg,
		agentDir: params.agentDir,
		authProfileStore: params.authProfileStore,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		clientCaps: params.clientCaps,
		workspaceDir,
		sandboxed: sandboxRuntime.sandboxed,
		pluginToolAllowlist: collectExplicitAllowlist([
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
			gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0
		]),
		pluginToolDenylist: explicitDenylist,
		cronCreatorToolAllowlist,
		inheritedToolAllowlist,
		inheritedToolDenylist
	});
	const execDefaults = nodeExecSurface || mediatedToolNames.size > 0 ? resolveExecDefaults({
		cfg: params.cfg,
		sessionEntry: params.execSession,
		execOverrides: params.execOverrides,
		agentId: policyAgentId,
		sessionKey: runtimePolicySessionKey,
		sandboxAvailable: sandboxRuntime.sandboxed
	}) : void 0;
	const nodeExecDefaults = nodeExecSurface && execDefaults?.canRequestNode === true ? execDefaults : void 0;
	const includeNodeExecTool = nodeExecDefaults !== void 0;
	const execConfig = includeNodeExecTool ? resolveExecToolConfig({
		cfg: params.cfg,
		agentId: policyAgentId
	}) : void 0;
	const includeMediatedBaseCodingTools = [
		"read",
		"write",
		"edit"
	].some((name) => mediatedToolNames.has(name));
	const includeMediatedShellTools = [
		"apply_patch",
		"exec",
		"process"
	].some((name) => mediatedToolNames.has(name));
	const mediatedCodingTools = surface === "loopback" && (includeMediatedBaseCodingTools || includeMediatedShellTools) ? createOpenClawCodingTools({
		config: params.cfg,
		agentId: policyAgentId,
		sessionKey: runtimePolicySessionKey,
		runSessionKey: params.sessionKey,
		sessionId: params.sessionId,
		runId: params.runId,
		workspaceDir,
		cwd: params.cwd?.trim() || workspaceDir,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		messageProvider: params.messageProvider,
		messageChannel: params.messageProvider,
		clientCaps: params.clientCaps,
		agentAccountId: params.accountId,
		currentChannelId: params.currentChannelId,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		channelContext: params.channelContext,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.channelContext?.sender?.id,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		trigger: params.trigger,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		inboundEventKind: params.inboundEventKind,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		runtimeToolAllowlist: [...mediatedToolNames],
		exec: execDefaults ? {
			host: execDefaults.host,
			mode: execDefaults.mode,
			security: execDefaults.security,
			ask: execDefaults.ask,
			node: execDefaults.node,
			elevated: params.bashElevated
		} : void 0,
		scheduledToolPolicy: params.scheduledToolPolicy,
		toolConstructionPlan: {
			includeBaseCodingTools: includeMediatedBaseCodingTools,
			includeShellTools: includeMediatedShellTools,
			includeChannelTools: false,
			includeOpenClawTools: false,
			includePluginTools: false
		},
		wrapBeforeToolCallHook: false,
		toolPolicyAuditLogLevel: "debug"
	}) : [];
	const toolsWithMediatedCoding = [...(nodeExecSurface ? openClawTools.filter((tool) => tool.name.trim().toLowerCase() !== "exec") : openClawTools).filter((tool) => !mediatedToolNames.has(normalizeToolPolicyName(tool.name))), ...mediatedCodingTools];
	const policyFiltered = applyToolPolicyPipeline({
		tools: filterToolsByMessageProvider(nodeExecDefaults ? [...toolsWithMediatedCoding, createLazyExecTool({
			host: "node",
			mode: nodeExecDefaults.mode,
			security: nodeExecDefaults.security,
			ask: nodeExecDefaults.ask,
			trigger: params.trigger,
			node: nodeExecDefaults.node,
			pathPrepend: execConfig?.pathPrepend,
			safeBins: execConfig?.safeBins,
			strictInlineEval: execConfig?.strictInlineEval,
			commandHighlighting: execConfig?.commandHighlighting,
			safeBinTrustedDirs: execConfig?.safeBinTrustedDirs,
			safeBinProfiles: execConfig?.safeBinProfiles,
			reviewer: execConfig?.reviewer,
			config: params.cfg,
			agentId: policyAgentId,
			elevated: params.bashElevated,
			cwd: workspaceDir,
			allowBackground: false,
			scopeKey: params.sessionKey,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			sessionStore: params.cfg.session?.store,
			mainKey: params.cfg.session?.mainKey,
			sessionScope: params.cfg.session?.scope,
			eventRouting: resolveEventSessionRoutingPolicy({
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				channel: params.messageProvider,
				accountId: params.accountId
			}),
			messageProvider: params.messageProvider,
			currentChannelId: params.currentChannelId ?? params.agentTo,
			currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
			channelContext: params.channelContext,
			accountId: params.accountId,
			approvalReviewerDeviceId: params.approvalReviewerDeviceId,
			backgroundMs: execConfig?.backgroundMs,
			timeoutSec: execConfig?.timeoutSec,
			approvalRunningNoticeMs: execConfig?.approvalRunningNoticeMs,
			notifyOnExit: execConfig?.notifyOnExit,
			notifyOnExitEmptySuccess: execConfig?.notifyOnExitEmptySuccess
		}, {
			description: "Execute a shell command on a connected OpenClaw node. This tool is node-only; use the CLI native shell for Gateway-local commands. Commands run synchronously. Set node when multiple nodes are available.",
			displaySummary: "Run commands on a connected node",
			parameters: nodeExecSchema
		})] : toolsWithMediatedCoding, params.messageProvider),
		toolMeta: (tool) => getPluginToolMeta(tool),
		warn: logWarn,
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
				agentId: policyAgentId
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
			}
		],
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.cfg,
			workspaceDir,
			toolDenylist: explicitDenylist
		})
	});
	const gatewayDenySet = /* @__PURE__ */ new Set([
		...defaultGatewayDeny,
		...ownerOnlyGatewayDeny,
		...Array.isArray(gatewayToolsCfg?.deny) ? gatewayToolsCfg.deny : [],
		...excludedToolNames
	]);
	const tools = policyFiltered.filter((tool) => !gatewayDenySet.has(tool.name));
	const inheritableTools = includeNodeExecTool ? tools.filter((tool) => tool.name.trim().toLowerCase() !== "exec") : tools;
	if (shouldInheritEffectiveToolAllowlist) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, inheritableTools);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, inheritableTools, (tool) => getPluginToolMeta(tool));
	return {
		agentId: sessionAgentId,
		tools,
		workspaceDir
	};
}
//#endregion
export { resolveGatewayScopedTools as t };
