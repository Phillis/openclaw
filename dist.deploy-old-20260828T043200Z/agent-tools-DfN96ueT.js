import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.js";
import { a as expandToolGroups, c as normalizeToolPolicyName } from "./tool-policy-shared-DmpG3HvD.js";
import { c as hasRestrictiveAllowPolicy, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-B1rvCc4B.js";
import { t as isRuntimeToolAllowed } from "./tool-policy-match-DfCekeWz.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { m as resolveGatewayMessageChannel } from "./message-channel-BZwx7FCw.js";
import { X as listChannelAgentTools } from "./agent-tools.before-tool-call-DoS1-Lb6.js";
import { B as createEditTool, E as createWriteTool, k as createReadTool, x as createCodingTools } from "./sessions-PHTfe5gZ.js";
import { t as ToolAuthorizationError } from "./common-CI1GnPjt.js";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-CxLP0YN-.js";
import { t as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-DQOi_XmP.js";
import { r as resolveToolFsConfig } from "./tool-fs-policy-DwrFWb3k.js";
import { l as bindAssembledAgentToolActionDescriptor, s as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-D1DYQtHE.js";
import { c as appendRuntimePluginToolGrant, i as getPluginToolMeta } from "./tools-DL5ef4Om.js";
import { l as filterToolsByClientCaps, t as createOpenClawTools, u as resolveOpenClawPluginToolsForOptions } from "./openclaw-tools-BB9f2Pba.js";
import { i as resolveLocalModelLeanPreserveToolNames, l as mergeAgentRingZeroTools, n as filterLocalModelLeanTools, o as messageToolOwnsVisibleReply, s as getActiveAgentRingZeroTools } from "./local-model-lean-Bw0Ju4s5.js";
import { s as isCompletionReportInputProvenance } from "./input-provenance-CCQsDhUy.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BWn7VYWB.js";
import { S as TOOL_SEARCH_CODE_MODE_TOOL_NAME, b as TOOL_CALL_RAW_TOOL_NAME, r as createToolSearchTools, s as resolveToolSearchConfig, w as TOOL_SEARCH_RAW_TOOL_NAME, x as TOOL_DESCRIBE_RAW_TOOL_NAME } from "./tool-search-f7MtzgBB.js";
import { r as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-CnFGy-j2.js";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-Bmw8_ghL.js";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-B20LLiS1.js";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-NN2j7ePJ.js";
import { r as resolveConversationToolPolicies, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-BITK7kk9.js";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-D2GNahvB.js";
import { s as shouldSuppressManagedWebSearchTool } from "./codex-native-web-search-core-BIpclorp.js";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-CPkIEuBm.js";
import { t as applyExecPolicyLayer } from "./exec-policy-DnRWVctg.js";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-BLljw-ev.js";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-LhRdbFR1.js";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-BB5wnYEo.js";
import { a as finalizeAgentTools, i as isApplyPatchAllowedForModel, r as resolveExecToolConfig, t as createCoreCodingTools } from "./core-coding-tools-DMOEBOcu.js";
import { p as createMemoryWriteProvenanceObserver, u as wrapToolMemoryFlushAppendOnlyWrite } from "./agent-tools.read-B0kEbcx5.js";
import "./codex-native-web-search-DByifkTI.js";
import { t as bindActiveCronCreatorAuthorityResolver } from "./cron-creator-authority-context-hXifa_42.js";
import { o as prepareGitHubToolEnvironment } from "./github-tool-identity-C15aB8z0.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-L32y-3ZS.js";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-nD_VY4O2.js";
//#region src/agents/agent-tools.message-provider-policy.ts
/**
* Message-provider tool filtering.
* Channels can restrict tool names after runtime assembly when the active
* transport cannot safely render or execute a class of tools.
*/
const TOOL_DENY_BY_MESSAGE_PROVIDER = {
	"discord-voice": ["tts"],
	voice: ["tts"]
};
const TOOL_ALLOW_BY_MESSAGE_PROVIDER = { node: [
	"canvas",
	"pdf",
	"tts",
	"view_image",
	"web_fetch",
	"web_search"
] };
/** Applies message-provider filtering while preserving duplicate tool entries. */
function filterToolsByMessageProvider(tools, messageProvider) {
	const normalizedProvider = normalizeOptionalLowercaseString(messageProvider);
	if (!normalizedProvider) return [...tools];
	const allowedTools = TOOL_ALLOW_BY_MESSAGE_PROVIDER[normalizedProvider];
	if (allowedTools && allowedTools.length > 0) {
		const allowedSet = new Set(allowedTools);
		return tools.filter((tool) => allowedSet.has(tool.name));
	}
	const deniedTools = TOOL_DENY_BY_MESSAGE_PROVIDER[normalizedProvider];
	if (!deniedTools || deniedTools.length === 0) return [...tools];
	const deniedSet = new Set(deniedTools);
	return tools.filter((tool) => !deniedSet.has(tool.name));
}
//#endregion
//#region src/agents/delegation-capability.ts
const NEW_DELEGATION_TOOL_NAMES = /* @__PURE__ */ new Set([
	"codex_session_send",
	"llm-task",
	"openclaw",
	"sessions_send",
	"sessions_spawn"
]);
const REPORT_ONLY_TOOL_ACTIONS = /* @__PURE__ */ new Map([
	[AUTOMATIONS_TOOL_NAME, /* @__PURE__ */ new Set([
		"get",
		"list",
		"remove",
		"runs",
		"status"
	])],
	["image_generate", /* @__PURE__ */ new Set(["list", "status"])],
	["music_generate", /* @__PURE__ */ new Set(["list", "status"])],
	["video_generate", /* @__PURE__ */ new Set(["list", "status"])]
]);
const REPORT_ONLY_ERROR = "New delegation is unavailable while reporting a completion through a fallback model.";
function resolveDelegationCapability(params) {
	if (!isCompletionReportInputProvenance(params.inputProvenance)) return "full";
	if (params.fallbackActive || params.disableTools === true) return "report_only";
	if (params.toolsAllow === void 0) return "full";
	return [...NEW_DELEGATION_TOOL_NAMES].some((toolName) => isRuntimeToolAllowed(toolName, params.toolsAllow)) ? "full" : "report_only";
}
function readToolAction(params) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return "";
	const action = params.action;
	return typeof action === "string" ? action.trim().toLowerCase() : "";
}
function wrapReportOnlyTool(tool, allowedActions) {
	return new Proxy(tool, { get(target, property, receiver) {
		if (property !== "execute") return Reflect.get(target, property, receiver);
		return async (toolCallId, params, signal, onUpdate) => {
			if (!allowedActions.has(readToolAction(params))) throw new ToolAuthorizationError(REPORT_ONLY_ERROR);
			return await target.execute(toolCallId, params, signal, onUpdate);
		};
	} });
}
/**
* Enforces the run's delegation capability after ordinary tool authorization.
* Tool names and safe actions here are explicit built-in/plugin contracts: the
* gate removes task launchers while retaining status, history, and cleanup.
*/
function applyDelegationCapability(tools, capability) {
	if (capability !== "report_only") return tools;
	return tools.flatMap((tool) => {
		const name = normalizeToolPolicyName(tool.name);
		if (NEW_DELEGATION_TOOL_NAMES.has(name)) return [];
		const allowedActions = REPORT_ONLY_TOOL_ACTIONS.get(name);
		return allowedActions ? [wrapReportOnlyTool(tool, allowedActions)] : [tool];
	});
}
//#endregion
//#region src/agents/agent-tools.ts
const MEMORY_FLUSH_ALLOWED_TOOL_NAMES = /* @__PURE__ */ new Set(["read", "write"]);
function applyModelProviderToolPolicy(toolsInput, params) {
	let tools = toolsInput;
	tools = filterLocalModelLeanTools({
		tools,
		config: params?.config,
		agentId: params?.agentId,
		sessionKey: params?.sessionKey,
		preserveToolNames: params?.localModelLeanPreserveToolNames ?? params?.runtimeToolAllowlist
	});
	if (params?.suppressManagedWebSearch !== false && shouldSuppressManagedWebSearchTool({
		config: params?.config,
		modelProvider: params?.modelProvider,
		modelApi: params?.modelApi,
		modelId: params?.modelId,
		agentId: params?.agentId,
		sessionKey: params?.sessionKey,
		agentDir: params?.agentDir
	})) return tools.filter((tool) => tool.name !== "web_search");
	return tools;
}
function createOpenClawCodingToolsInternal(options) {
	const sandbox = options?.sandbox?.enabled ? options.sandbox : void 0;
	const isMemoryFlushRun = options?.trigger === "memory";
	if (isMemoryFlushRun && !options?.memoryFlushWritePath) throw new Error("memoryFlushWritePath required for memory-triggered tool runs");
	const memoryFlushWritePath = isMemoryFlushRun ? options.memoryFlushWritePath : void 0;
	const cronSelfRemoveOnlyJobId = options?.trigger === "cron" && options.jobId?.trim() ? options.jobId.trim() : void 0;
	const sandboxToolPolicy = sandbox?.tools;
	const capabilityProfile = options?.conversationCapabilityProfile ?? resolveConversationCapabilityProfile({
		config: options?.config,
		sessionKey: options?.sessionKey,
		runSessionKey: options?.runSessionKey,
		sessionId: options?.sessionId,
		runId: options?.runId,
		agentId: options?.agentId,
		agentDir: options?.agentDir,
		agentAccountId: options?.agentAccountId,
		messageProvider: options?.messageProvider,
		messageChannel: options?.messageChannel,
		chatType: options?.chatType,
		messageTo: options?.messageTo,
		messageThreadId: options?.messageThreadId,
		conversationToolPolicy: options?.conversationToolPolicy,
		currentChannelId: options?.currentChannelId,
		currentMessagingTarget: options?.currentMessagingTarget,
		currentThreadTs: options?.currentThreadTs,
		currentMessageId: options?.currentMessageId,
		groupId: options?.groupId,
		groupChannel: options?.groupChannel,
		groupSpace: options?.groupSpace,
		memberRoleIds: options?.memberRoleIds,
		spawnedBy: options?.spawnedBy,
		senderId: options?.senderId,
		senderName: options?.senderName,
		senderUsername: options?.senderUsername,
		senderE164: options?.senderE164,
		senderIsOwner: options?.senderIsOwner,
		modelProvider: options?.modelProvider,
		modelId: options?.modelId,
		modelApi: options?.modelApi,
		modelContextWindowTokens: options?.modelContextWindowTokens,
		modelHasVision: options?.modelHasVision,
		workspaceDir: options?.workspaceDir,
		cwd: options?.cwd,
		spawnWorkspaceDir: options?.spawnWorkspaceDir,
		skillsSnapshot: options?.skillsSnapshot,
		sandboxToolPolicy,
		runtimeToolAllowlist: options?.runtimeToolAllowlist,
		inheritRuntimeToolAllowlist: options?.inheritRuntimeToolAllowlist,
		inputProvenance: options?.inputProvenance,
		trustedInternalHandoff: options?.trustedInternalHandoff,
		scheduledToolPolicy: options?.scheduledToolPolicy,
		pluginMetadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot
	});
	const { agentId, runtimePluginToolGrant } = capabilityProfile.policy;
	const enableHeartbeatTool = options?.enableHeartbeatTool === true || options?.trigger === "heartbeat" && options?.config?.messages?.visibleReplies === "message_tool";
	const forceHeartbeatTool = options?.forceHeartbeatTool === true || enableHeartbeatTool;
	const toolSearchConfig = resolveToolSearchConfig(options?.config);
	const toolSearchControlsEnabled = options?.includeToolSearchControls === true && toolSearchConfig.enabled;
	const toolSearchControlAllowlist = toolSearchControlsEnabled ? [
		TOOL_SEARCH_CODE_MODE_TOOL_NAME,
		TOOL_SEARCH_RAW_TOOL_NAME,
		TOOL_DESCRIBE_RAW_TOOL_NAME,
		TOOL_CALL_RAW_TOOL_NAME
	] : [];
	const runtimeToolAllowlistIncludesMessage = expandToolGroups(options?.runtimeToolAllowlist ?? []).some((toolName) => {
		const normalized = normalizeToolPolicyName(toolName);
		return normalized === "*" || normalized === "message";
	});
	const sourceReplyOnly = capabilityProfile.policy.requesterPolicySource === "completion-handoff" && options?.sourceReplyDeliveryMode === "message_tool_only";
	const localModelLeanPreserveToolNames = resolveLocalModelLeanPreserveToolNames({
		toolNames: capabilityProfile.policy.explicitToolOverrideAllowlist,
		forceMessageTool: options?.forceMessageTool,
		sourceReplyDeliveryMode: options?.sourceReplyDeliveryMode
	});
	const conversationToolPolicies = resolveConversationToolPolicies({
		capabilityProfile,
		additionalProfileAllow: [
			...options && messageToolOwnsVisibleReply(options) ? ["message"] : [],
			...runtimeToolAllowlistIncludesMessage ? ["message"] : [],
			...forceHeartbeatTool ? [HEARTBEAT_RESPONSE_TOOL_NAME] : [],
			...toolSearchControlAllowlist
		],
		additionalPolicyAllow: toolSearchControlAllowlist
	});
	const scopeKey = resolveProcessToolScopeKey({
		scopeKey: options?.exec?.scopeKey,
		sessionKey: options?.sessionKey,
		sessionId: options?.sessionId,
		agentId
	});
	options?.recordToolPrepStage?.("tool-policy");
	const execConfig = resolveExecToolConfig({
		cfg: options?.config,
		agentId
	});
	const execRuntimeConfig = options?.exec?.config ?? options?.config;
	const preparedRunEnvironment = execRuntimeConfig && agentId ? prepareGitHubToolEnvironment({
		config: execRuntimeConfig,
		sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig,
		agentId
	}) : void 0;
	const fsConfig = resolveToolFsConfig({
		cfg: options?.config,
		agentId
	});
	const sessionPermissionPolicy = options?.sessionPermissionPolicy;
	const sessionCoreToolPolicy = sessionPermissionPolicy ? resolveSessionPermissionCoreToolPolicy(sessionPermissionPolicy) : void 0;
	const sandboxRoot = sandbox?.workspaceDir;
	const sandboxFsBridge = sandbox?.fsBridge;
	const allowWorkspaceWrites = sandbox?.workspaceAccess !== "ro";
	const workspaceRoot = capabilityProfile.workspace.workspaceRoot;
	const runtimeRoot = capabilityProfile.workspace.runtimeRoot;
	const codingRoot = sandboxRoot ?? runtimeRoot;
	const containmentRoot = sandboxRoot ?? sessionPermissionPolicy?.root ?? codingRoot;
	const memoryFlushWriteRoot = sandboxRoot ?? workspaceRoot;
	const memoryWriteProvenance = createMemoryWriteProvenanceObserver({
		mutationRoot: sandboxRoot ?? workspaceRoot,
		workspaceDir: workspaceRoot,
		resolveOriginClass: () => options?.senderIsOwner === false || options?.isTurnTainted?.() === true ? "untrusted" : "agent",
		sessionId: options?.sessionId,
		sessionKey: options?.runSessionKey ?? options?.sessionKey
	});
	const includeCoreTools = options?.includeCoreTools !== false;
	const toolConstructionPlan = options?.toolConstructionPlan ?? {
		includeBaseCodingTools: includeCoreTools,
		includeShellTools: includeCoreTools,
		includeChannelTools: includeCoreTools,
		includeOpenClawTools: includeCoreTools,
		includePluginTools: true
	};
	const includeBaseCodingTools = includeCoreTools && toolConstructionPlan.includeBaseCodingTools;
	const includeShellTools = includeCoreTools && toolConstructionPlan.includeShellTools;
	const includeOpenClawTools = includeCoreTools && toolConstructionPlan.includeOpenClawTools;
	const includeChannelTools = toolConstructionPlan.includeChannelTools;
	const includePluginTools = toolConstructionPlan.includePluginTools;
	const workspaceOnly = isMemoryFlushRun || (sessionCoreToolPolicy?.workspaceOnly ?? fsConfig.workspaceOnly === true);
	const fsPolicy = {
		workspaceOnly,
		...sessionPermissionPolicy ? { root: sessionPermissionPolicy.root } : {}
	};
	const readOnly = sessionCoreToolPolicy?.readOnly ?? false;
	const applyPatchConfig = execConfig.applyPatch;
	const applyPatchWorkspaceOnly = sessionCoreToolPolicy?.applyPatchWorkspaceOnly ?? (workspaceOnly || applyPatchConfig?.workspaceOnly !== false);
	const applyPatchEnabled = !readOnly && applyPatchConfig?.enabled !== false && isApplyPatchAllowedForModel({
		modelProvider: options?.modelProvider,
		modelId: options?.modelId,
		allowModels: applyPatchConfig?.allowModels
	});
	const imageSanitization = resolveImageSanitizationLimits(options?.config);
	options?.recordToolPrepStage?.("workspace-policy");
	const { cleanupMs: cleanupMsOverride, ...execDefaults } = options?.exec ?? {};
	const effectiveExecPolicy = applyExecPolicyLayer(execConfig, options?.exec);
	const processToolAvailabilityRef = {};
	const coreTools = createCoreCodingTools({
		codingRoot,
		containmentRoot,
		includeBaseCodingTools,
		includeShellTools,
		workspaceOnly,
		readOnly,
		sandbox,
		skillsSnapshot: options?.skillsSnapshot,
		skillInstructionPaths: options?.skillUsagePaths?.map((entry) => entry.readPath),
		skillInstructionDeliveryCache: options?.skillInstructionDeliveryCache,
		modelContextWindowTokens: options?.modelContextWindowTokens,
		imageSanitization,
		modelHasVision: options?.modelHasVision,
		memoryWriteProvenance,
		...includeBaseCodingTools ? { baseToolNames: createCodingTools(codingRoot).map((tool) => tool.name) } : {},
		baseToolFactories: {
			createEditTool,
			createReadTool,
			createWriteTool
		},
		applyPatchEnabled,
		applyPatchWorkspaceOnly,
		execDefaults: {
			...execDefaults,
			bypassHostApprovalFloors: sessionCoreToolPolicy?.bypassHostApprovalFloors,
			host: options?.exec?.host ?? execConfig.host,
			mode: effectiveExecPolicy.mode,
			security: effectiveExecPolicy.security,
			ask: effectiveExecPolicy.ask,
			config: execRuntimeConfig,
			preparedRunEnvironment,
			reviewer: options?.exec?.reviewer ?? execConfig.reviewer,
			trigger: options?.trigger,
			node: options?.exec?.node ?? execConfig.node,
			pathPrepend: mergeGatewayAgentCliPath(options?.exec?.pathPrepend ?? execConfig.pathPrepend),
			safeBins: options?.exec?.safeBins ?? execConfig.safeBins,
			strictInlineEval: options?.exec?.strictInlineEval ?? execConfig.strictInlineEval,
			commandHighlighting: options?.exec?.commandHighlighting ?? execConfig.commandHighlighting,
			safeBinTrustedDirs: options?.exec?.safeBinTrustedDirs ?? execConfig.safeBinTrustedDirs,
			safeBinProfiles: options?.exec?.safeBinProfiles ?? execConfig.safeBinProfiles,
			agentId,
			processToolAvailabilityRef,
			scopeKey,
			sessionKey: options?.sessionKey,
			runId: options?.runId,
			operationalRunInstance: options?.operationalRunInstance,
			notifySessionKey: options?.runSessionKey ?? options?.sessionKey,
			sessionId: options?.sessionId,
			sessionStore: options?.config?.session?.store,
			mainKey: options?.config?.session?.mainKey,
			sessionScope: options?.config?.session?.scope,
			eventRouting: resolveEventSessionRoutingPolicy({
				cfg: options?.config,
				sessionKey: options?.runSessionKey ?? options?.sessionKey,
				channel: options?.messageProvider,
				accountId: options?.agentAccountId
			}),
			messageProvider: options?.messageProvider,
			currentChannelId: options?.currentChannelId,
			currentThreadTs: options?.currentThreadTs,
			channelContext: options?.channelContext,
			accountId: options?.agentAccountId,
			approvalReviewerDeviceId: options?.approvalReviewerDeviceId,
			nonInteractiveApproval: options?.swarmCollector,
			backgroundMs: options?.exec?.backgroundMs ?? execConfig.backgroundMs,
			timeoutSec: options?.exec?.timeoutSec ?? execConfig.timeoutSec,
			approvalRunningNoticeMs: options?.exec?.approvalRunningNoticeMs ?? execConfig.approvalRunningNoticeMs,
			notifyOnExit: options?.exec?.notifyOnExit ?? execConfig.notifyOnExit,
			notifyOnExitEmptySuccess: options?.exec?.notifyOnExitEmptySuccess ?? execConfig.notifyOnExitEmptySuccess
		},
		processDefaults: {
			cleanupMs: cleanupMsOverride ?? execConfig.cleanupMs,
			scopeKey
		},
		recordToolPrepStage: options?.recordToolPrepStage
	});
	const cronCreatorAuthorityResolver = bindActiveCronCreatorAuthorityResolver(options?.runId);
	const ownerOnlyCoreToolDenylist = options?.senderIsOwner === false ? GATEWAY_OWNER_ONLY_CORE_TOOLS.filter((toolName) => toolName !== "automations" || !cronCreatorAuthorityResolver) : [];
	const ownerOnlyCoreToolPolicy = ownerOnlyCoreToolDenylist.length > 0 ? { deny: ownerOnlyCoreToolDenylist } : void 0;
	const pluginToolAllowlist = appendRuntimePluginToolGrant(capabilityProfile.policy.explicitToolAllowlist, runtimePluginToolGrant);
	const pluginToolDenylist = [...capabilityProfile.policy.explicitToolDenylist, ...ownerOnlyCoreToolDenylist];
	const inheritedToolDenylist = [...pluginToolDenylist];
	const inheritedToolAllowlist = options?.inheritedToolAllowlistRef ?? [];
	const shouldInheritEffectiveToolAllowlist = capabilityProfile.policy.inheritancePolicies.some(hasRestrictiveAllowPolicy);
	const cronCreatorToolAllowlist = options?.cronCreatorToolAllowlistRef ?? [];
	const cronCreatorToolAllowlistCaptureRef = options?.cronCreatorToolAllowlistCaptureRef;
	const gatewayCaller = resolveScheduledToolCallerContext({
		scheduledToolPolicy: options?.scheduledToolPolicy,
		accountId: options?.agentAccountId,
		channel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider)
	});
	const pluginToolCallerIdentity = agentId && options?.sessionKey?.trim() ? {
		agentId,
		sessionKey: options.sessionKey.trim(),
		turnSourceChannel: resolveGatewayMessageChannel(options.messageChannel ?? options.messageProvider),
		turnSourceTo: options.currentMessagingTarget ?? options.currentChannelId ?? options.messageTo,
		turnSourceAccountId: gatewayCaller.accountId,
		turnSourceThreadId: options.currentThreadTs ?? options.messageThreadId
	} : void 0;
	const pluginToolsOnly = filterToolsByClientCaps(includeOpenClawTools || !includePluginTools ? [] : resolveOpenClawPluginToolsForOptions({
		options: {
			agentSessionKey: options?.sessionKey,
			runId: options?.runId,
			agentChannel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider),
			agentAccountId: options?.agentAccountId,
			agentTo: options?.messageTo,
			agentThreadId: options?.messageThreadId,
			nativeChannelId: options?.nativeChannelId,
			messageActionTurnCapability: options?.messageActionTurnCapability,
			agentDir: options?.agentDir,
			preparedModelRuntime: options?.preparedModelRuntime,
			workspaceDir: workspaceRoot,
			config: options?.config,
			fsPolicy,
			requesterSenderId: options?.senderId,
			senderIsOwner: options?.senderIsOwner,
			sessionId: options?.sessionId,
			conversationRecall: options?.conversationRecall,
			oneShotCliRun: options?.oneShotCliRun,
			sandboxBrowserBridgeUrl: sandbox?.browser?.bridgeUrl,
			allowHostBrowserControl: sandbox ? sandbox.browserAllowHostControl : true,
			sandboxed: Boolean(sandbox),
			pluginToolAllowlist,
			pluginToolDenylist,
			currentChannelId: options?.currentChannelId,
			currentMessagingTarget: options?.currentMessagingTarget,
			currentThreadTs: options?.currentThreadTs,
			currentMessageId: options?.currentMessageId,
			modelProvider: options?.modelProvider,
			modelId: options?.modelId,
			modelHasVision: options?.modelHasVision,
			requireExplicitMessageTarget: options?.requireExplicitMessageTarget,
			disableMessageTool: options?.disableMessageTool || options?.swarmCollector,
			requesterAgentIdOverride: agentId,
			allowGatewaySubagentBinding: options?.allowGatewaySubagentBinding,
			clientCaps: options?.clientCaps,
			toolBindings: options?.toolBindings,
			authProfileStore: options?.authProfileStore
		},
		resolvedConfig: options?.config
	}), options?.clientCaps).map((tool) => wrapToolWithGatewayCallerIdentity(tool, pluginToolCallerIdentity));
	const ringZeroTools = includeOpenClawTools ? getActiveAgentRingZeroTools() : [];
	const toolSearchTools = toolSearchControlsEnabled && ringZeroTools.length === 0 ? createToolSearchTools({
		config: options?.config,
		runtimeConfig: options?.config,
		agentId,
		sessionKey: options?.sessionKey,
		sessionId: options?.sessionId,
		runId: options?.runId,
		catalogRef: options?.toolSearchCatalogRef,
		abortSignal: options?.abortSignal,
		executeTool: options?.toolSearchCatalogExecutor
	}) : [];
	const tools = [
		...coreTools,
		...includeChannelTools ? listChannelAgentTools({ cfg: options?.config }) : [],
		...includeOpenClawTools ? mergeAgentRingZeroTools(ringZeroTools, createOpenClawTools({
			...options?.systemAgentTool ? { systemAgentTool: options.systemAgentTool } : {},
			sandboxBrowserBridgeUrl: sandbox?.browser?.bridgeUrl,
			allowHostBrowserControl: sandbox ? sandbox.browserAllowHostControl : true,
			agentSessionKey: options?.sessionKey,
			runId: options?.runId,
			sessionPermissionPolicy,
			execSession: sessionPermissionPolicy ? { permissionMode: sessionPermissionPolicy.mode } : void 0,
			execOverrides: {
				host: options?.exec?.host ?? execConfig.host,
				mode: effectiveExecPolicy.mode,
				security: effectiveExecPolicy.security,
				ask: effectiveExecPolicy.ask,
				node: options?.exec?.node ?? execConfig.node
			},
			approvalReviewerDeviceIds: options?.approvalReviewerDeviceId ? [options.approvalReviewerDeviceId] : void 0,
			runSessionKey: options?.runSessionKey,
			agentChannel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider),
			agentAccountId: options?.agentAccountId,
			gatewayCallerAccountId: gatewayCaller.accountId,
			gatewayCallerChannel: gatewayCaller.channel,
			gatewayCallerLocal: gatewayCaller.local,
			gatewayCallerScheduled: gatewayCaller.scheduled,
			agentTo: options?.messageTo,
			agentThreadId: options?.messageThreadId,
			nativeChannelId: options?.nativeChannelId,
			messageActionTurnCapability: options?.messageActionTurnCapability,
			agentGroupId: options?.groupId ?? null,
			agentGroupChannel: options?.groupChannel ?? null,
			agentGroupSpace: options?.groupSpace ?? null,
			agentMemberRoleIds: options?.memberRoleIds,
			agentDir: options?.agentDir,
			preparedModelRuntime: options?.preparedModelRuntime,
			sandboxRoot,
			sandboxContainerWorkdir: sandbox?.containerWorkdir,
			sandboxFsBridge,
			fsPolicy,
			workspaceDir: workspaceRoot,
			spawnWorkspaceDir: capabilityProfile.workspace.spawnWorkspaceRoot,
			cwd: sandbox ? capabilityProfile.workspace.spawnWorkspaceRoot ?? runtimeRoot : runtimeRoot,
			sandboxed: Boolean(sandbox),
			config: options?.config,
			sessionConfigSource: options?.sessionConfigSource,
			webFetchHostnameAllowlistRef: options?.webFetchHostnameAllowlistRef,
			webSearchEnabled: options?.webSearchEnabled,
			clientCaps: options?.clientCaps,
			toolBindings: options?.toolBindings,
			pluginToolAllowlist,
			pluginToolDenylist,
			runtimeToolAllowlist: options?.runtimeToolAllowlist,
			githubPublicationAvailable: options?.githubPublicationAvailable,
			cronCreatorToolAllowlist,
			cronCreatorToolAllowlistCaptureRef,
			resolveCronCreatorToolAuthority: cronCreatorAuthorityResolver,
			cronCreatorAuthorityUnavailableReason: options?.cronCreatorAuthorityUnavailableReason,
			currentChannelId: options?.currentChannelId,
			currentChatType: options?.chatType,
			currentMessagingTarget: options?.currentMessagingTarget,
			currentThreadTs: options?.currentThreadTs,
			currentMessageId: options?.currentMessageId,
			currentInboundAudio: options?.currentInboundAudio,
			hasCurrentInboundAudio: options?.hasCurrentInboundAudio,
			modelProvider: options?.modelProvider,
			modelId: options?.modelId,
			modelContextWindowTokens: options?.modelContextWindowTokens,
			skillWorkshop: options?.skillWorkshop,
			replyToMode: options?.replyToMode,
			hasRepliedRef: options?.hasRepliedRef,
			modelHasVision: options?.modelHasVision,
			computerContextEpoch: options?.computerContextEpoch,
			registerRunCleanup: options?.registerRunCleanup,
			requireExplicitMessageTarget: options?.requireExplicitMessageTarget,
			sourceReplyDeliveryMode: options?.sourceReplyDeliveryMode,
			sourceReplyOnly,
			taskSuggestionDeliveryMode: options?.taskSuggestionDeliveryMode,
			inboundEventKind: options?.inboundEventKind,
			disableMessageTool: options?.disableMessageTool || options?.swarmCollector,
			swarmCollector: options?.swarmCollector,
			swarmOutputSchema: options?.swarmOutputSchema,
			enableHeartbeatTool,
			disablePluginTools: !includePluginTools,
			wrapBeforeToolCallHook: false,
			...cronSelfRemoveOnlyJobId ? { cronSelfRemoveOnlyJobId } : {},
			requesterAgentIdOverride: agentId,
			requesterSenderId: options?.senderId,
			senderIsOwner: options?.senderIsOwner,
			authProfileStore: options?.authProfileStore,
			sessionId: options?.sessionId,
			conversationRecall: options?.conversationRecall,
			oneShotCliRun: options?.oneShotCliRun,
			inheritedToolAllowlist,
			inheritedToolDenylist,
			onYield: options?.onYield,
			claimYieldCompletion: options?.claimYieldCompletion,
			allowGatewaySubagentBinding: options?.allowGatewaySubagentBinding,
			recordToolPrepStage: options?.recordToolPrepStage
		})) : pluginToolsOnly,
		...toolSearchTools
	];
	options?.recordToolPrepStage?.("openclaw-tools");
	const swarmStructuredOutputTool = options?.swarmCollector && options.swarmOutputSchema ? tools.find((tool) => tool.name === "structured_output") : void 0;
	const toolsForMemoryFlush = isMemoryFlushRun && memoryFlushWritePath ? [] : tools;
	if (isMemoryFlushRun && memoryFlushWritePath) for (const tool of tools) {
		if (!MEMORY_FLUSH_ALLOWED_TOOL_NAMES.has(tool.name)) continue;
		if (tool.name === "write") {
			toolsForMemoryFlush.push(wrapToolMemoryFlushAppendOnlyWrite(tool, {
				root: memoryFlushWriteRoot,
				relativePath: memoryFlushWritePath,
				memoryWriteProvenance,
				containerWorkdir: sandbox?.containerWorkdir,
				sandbox: sandboxRoot && sandboxFsBridge ? {
					root: sandboxRoot,
					bridge: sandboxFsBridge
				} : void 0
			}));
			continue;
		}
		toolsForMemoryFlush.push(tool);
	}
	const unavailableCoreToolReason = isMemoryFlushRun && memoryFlushWritePath ? "memory-triggered compaction runs expose only read and append-only write" : void 0;
	const toolsForMessageProvider = filterToolsByMessageProvider(toolsForMemoryFlush, options?.toolPolicyMessageProvider ?? options?.messageProvider);
	options?.recordToolPrepStage?.("message-provider-policy");
	const toolsForModelProvider = applyModelProviderToolPolicy(toolsForMessageProvider, {
		config: options?.config,
		modelProvider: options?.modelProvider,
		modelApi: options?.modelApi,
		modelId: options?.modelId,
		agentId: options?.agentId,
		sessionKey: options?.sessionKey,
		agentDir: options?.agentDir,
		modelCompat: options?.modelCompat,
		suppressManagedWebSearch: options?.suppressManagedWebSearch,
		runtimeToolAllowlist: options?.runtimeToolAllowlist,
		localModelLeanPreserveToolNames
	});
	options?.recordToolPrepStage?.("model-provider-policy");
	const authorizedTools = applyDelegationCapability(mergeAgentRingZeroTools(ringZeroTools, applyToolPolicyPipeline({
		tools: toolsForModelProvider,
		toolMeta: (tool) => getPluginToolMeta(tool),
		warn: logWarn,
		steps: buildConversationToolPolicyPipelineSteps({
			capabilityProfile,
			policies: conversationToolPolicies,
			additionalStepsAfterSandbox: [{
				policy: ownerOnlyCoreToolPolicy,
				label: "gateway sender owner-only tools",
				unavailableCoreToolReason
			}],
			includeRuntimeToolPolicy: true,
			unavailableCoreToolReason
		}),
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: options?.config,
			metadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot,
			workspaceDir: workspaceRoot,
			toolDenylist: pluginToolDenylist
		})
	})), options?.delegationCapability).filter((tool) => !options?.swarmCollector || tool.name !== "ask_user" && tool.name !== "sessions_send" && tool.name !== "sessions_yield");
	if (swarmStructuredOutputTool && !authorizedTools.some((tool) => tool.name === swarmStructuredOutputTool.name)) authorizedTools.push(swarmStructuredOutputTool);
	authorizedTools.forEach(bindAssembledAgentToolActionDescriptor);
	processToolAvailabilityRef.value = authorizedTools.some((tool) => tool.name === "process");
	if (shouldInheritEffectiveToolAllowlist) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, authorizedTools);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, authorizedTools, (tool) => getPluginToolMeta(tool));
	options?.recordToolPrepStage?.("authorization-policy");
	const turnSourceChannel = options?.messageChannel ?? options?.messageProvider;
	const turnSourceTo = options?.currentMessagingTarget ?? options?.currentChannelId;
	const requester = {
		...turnSourceChannel ? { channel: turnSourceChannel } : {},
		...options?.agentAccountId ? { accountId: options.agentAccountId } : {},
		...options?.senderId ? { senderId: options.senderId } : {},
		...options?.senderIsOwner !== void 0 ? { senderIsOwner: options.senderIsOwner } : {},
		...options?.memberRoleIds?.length ? { roleIds: [...options.memberRoleIds] } : {}
	};
	const hasRequester = Object.keys(requester).length > 0;
	const hookContext = {
		agentId,
		...options?.config ? { config: options.config } : {},
		cwd: codingRoot,
		workspaceDir: workspaceRoot,
		...options?.skillsSnapshot ? { skillsSnapshot: options.skillsSnapshot } : {},
		...options?.skillUsagePaths ? { skillUsagePaths: options.skillUsagePaths } : {},
		...sandboxRoot && sandboxFsBridge && allowWorkspaceWrites ? { sandbox: {
			root: sandboxRoot,
			bridge: sandboxFsBridge
		} } : {},
		sessionKey: options?.sessionKey,
		sessionId: options?.sessionId,
		runId: options?.runId,
		trigger: options?.trigger,
		approvalReviewerDeviceId: options?.approvalReviewerDeviceId,
		channelId: options?.hookChannelId ?? options?.currentChannelId,
		...hasRequester ? { requester } : {},
		...turnSourceChannel ? { turnSourceChannel } : {},
		...turnSourceTo ? { turnSourceTo } : {},
		...options?.agentAccountId ? { turnSourceAccountId: options.agentAccountId } : {},
		...options?.currentThreadTs ? { turnSourceThreadId: options.currentThreadTs } : {},
		...options?.trace ? { trace: options.trace } : {},
		loopDetection: resolveToolLoopDetectionConfig({
			cfg: options?.config,
			agentId
		}),
		onToolOutcome: options?.onToolOutcome,
		allocateToolOutcomeOrdinal: options?.allocateToolOutcomeOrdinal
	};
	return finalizeAgentTools({
		tools: authorizedTools,
		modelProvider: options?.modelProvider,
		modelId: options?.modelId,
		modelCompat: options?.modelCompat,
		hookContext,
		wrapBeforeToolCallHook: options?.wrapBeforeToolCallHook,
		emitBeforeToolCallDiagnostics: options?.emitBeforeToolCallDiagnostics,
		...options?.swarmCollector ? { approvalMode: "deny" } : {},
		abortSignal: options?.abortSignal,
		agentId,
		recordToolPrepStage: options?.recordToolPrepStage
	});
}
/** Build the runtime tool list exposed through the public agent harness SDK. */
function createOpenClawCodingTools(options) {
	return createOpenClawCodingToolsInternal(options);
}
//#endregion
export { resolveDelegationCapability as n, filterToolsByMessageProvider as r, createOpenClawCodingTools as t };
