import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-CYqaxHxr.js";
import { g as normalizeToolPolicyName, l as replaceWithEffectiveToolAllowlist, m as expandToolGroups, s as hasRestrictiveAllowPolicy } from "./tool-policy-CWmnHLY1.js";
import { n as isToolAllowedByPolicies, t as isRuntimeToolAllowed } from "./tool-policy-match-CEXvGj1C.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { i as resolveGatewayMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { X as listChannelAgentTools } from "./agent-tools.before-tool-call-BzRsADjV.js";
import { D as createReadTool, L as createEditTool, T as createWriteTool, b as createCodingTools } from "./sessions-DNOIAOJW.js";
import { t as ToolAuthorizationError } from "./common-BGOZLJ2_.js";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-CxLP0YN-.js";
import { s as isCompletionReportInputProvenance } from "./input-provenance-BA6fPshG.js";
import { i as resolveToolFsConfig, t as createToolFsPolicy } from "./tool-fs-policy-DRfGQzmo.js";
import { u as wrapToolWithGatewayCallerIdentity } from "./gateway-O0XoIBU1.js";
import { i as getPluginToolMeta, s as appendRuntimePluginToolGrant } from "./tools-cCwmXcan.js";
import { o as filterToolsByClientCaps, s as resolveOpenClawPluginToolsForOptions, t as createOpenClawTools } from "./openclaw-tools-DGkE1wbc.js";
import { r as mergeAgentRingZeroTools, t as getActiveAgentRingZeroTools } from "./agent-tools.ring-zero-context-C-QXByzs.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-jN4PguVr.js";
import { S as TOOL_SEARCH_CODE_MODE_TOOL_NAME, b as TOOL_CALL_RAW_TOOL_NAME, r as createToolSearchTools, s as resolveToolSearchConfig, w as TOOL_SEARCH_RAW_TOOL_NAME, x as TOOL_DESCRIBE_RAW_TOOL_NAME } from "./tool-search-D2p-VHdD.js";
import { r as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-89Sutewn.js";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-Bmw8_ghL.js";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-CyHYyyCM.js";
import { _ as resolveMemoryFlushPlan } from "./memory-state-DhEOmKyi.js";
import { a as messageToolOwnsVisibleReply, i as resolveLocalModelLeanPreserveToolNames, n as filterLocalModelLeanTools } from "./local-model-lean-BMyyuL8b.js";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-yKKwixN5.js";
import { r as resolveConversationToolPolicies, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-4ugqRa_4.js";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-DQRD2Zdf.js";
import { s as shouldSuppressManagedWebSearchTool } from "./codex-native-web-search-core-B2HC1py1.js";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-D02p88BV.js";
import { t as applyExecPolicyLayer } from "./exec-policy-fW6gzRky.js";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-Bxxlmk9C.js";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-C3dsDuHN.js";
import { a as finalizeAgentTools, i as isApplyPatchAllowedForModel, r as resolveExecToolConfig, t as createCoreCodingTools } from "./core-coding-tools-CsR0ZNB_.js";
import { c as wrapToolMemoryFlushAppendOnlyWrite, d as createMemoryWriteProvenanceObserver } from "./agent-tools.read-CmHNxwHo.js";
import "./codex-native-web-search-B_-ZPLHm.js";
import { t as bindActiveCronCreatorAuthorityResolver } from "./cron-creator-authority-context-HcTMUl6U.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-Mtb_s-wH.js";
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
	"image",
	"pdf",
	"tts",
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
			return await Reflect.apply(target.execute, void 0, [
				toolCallId,
				params,
				signal,
				onUpdate
			]);
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
		scheduledToolPolicy: options?.scheduledToolPolicy
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
	const allowBackground = isToolAllowedByPolicies("process", [
		conversationToolPolicies.profilePolicy,
		conversationToolPolicies.providerProfilePolicy,
		conversationToolPolicies.globalPolicy,
		conversationToolPolicies.globalProviderPolicy,
		conversationToolPolicies.agentPolicy,
		conversationToolPolicies.agentProviderPolicy,
		conversationToolPolicies.groupPolicy,
		conversationToolPolicies.senderPolicy,
		conversationToolPolicies.sandboxPolicy,
		conversationToolPolicies.subagentPolicy,
		conversationToolPolicies.inheritedToolPolicy
	]);
	options?.recordToolPrepStage?.("tool-policy");
	const execConfig = resolveExecToolConfig({
		cfg: options?.config,
		agentId
	});
	const fsConfig = resolveToolFsConfig({
		cfg: options?.config,
		agentId
	});
	const fsPolicy = createToolFsPolicy({ workspaceOnly: isMemoryFlushRun || fsConfig.workspaceOnly });
	const sandboxRoot = sandbox?.workspaceDir;
	const sandboxFsBridge = sandbox?.fsBridge;
	const allowWorkspaceWrites = sandbox?.workspaceAccess !== "ro";
	const workspaceRoot = capabilityProfile.workspace.workspaceRoot;
	const runtimeRoot = capabilityProfile.workspace.runtimeRoot;
	const codingRoot = sandboxRoot ?? runtimeRoot;
	const memoryFlushWriteRoot = sandboxRoot ?? workspaceRoot;
	const memoryWriteProvenance = isMemoryFlushRun ? void 0 : createMemoryWriteProvenanceObserver({
		mutationRoot: sandboxRoot ?? workspaceRoot,
		workspaceDir: workspaceRoot,
		plan: resolveMemoryFlushPlan({ cfg: options?.config }) ?? {},
		resolveOriginClass: () => options?.senderIsOwner === false || options?.isTurnTainted?.() === true ? "untrusted" : "agent"
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
	const workspaceOnly = fsPolicy.workspaceOnly;
	const applyPatchConfig = execConfig.applyPatch;
	const applyPatchWorkspaceOnly = workspaceOnly || applyPatchConfig?.workspaceOnly !== false;
	const applyPatchEnabled = applyPatchConfig?.enabled !== false && isApplyPatchAllowedForModel({
		modelProvider: options?.modelProvider,
		modelId: options?.modelId,
		allowModels: applyPatchConfig?.allowModels
	});
	const imageSanitization = resolveImageSanitizationLimits(options?.config);
	options?.recordToolPrepStage?.("workspace-policy");
	const { cleanupMs: cleanupMsOverride, ...execDefaults } = options?.exec ?? {};
	const effectiveExecPolicy = applyExecPolicyLayer(execConfig, options?.exec);
	const coreTools = createCoreCodingTools({
		codingRoot,
		includeBaseCodingTools,
		includeShellTools,
		workspaceOnly,
		sandbox,
		skillsSnapshot: options?.skillsSnapshot,
		modelContextWindowTokens: options?.modelContextWindowTokens,
		imageSanitization,
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
			host: options?.exec?.host ?? execConfig.host,
			mode: effectiveExecPolicy.mode,
			security: effectiveExecPolicy.security,
			ask: effectiveExecPolicy.ask,
			config: options?.exec?.config ?? options?.config,
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
			allowBackground,
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
	const gatewayCallerAccountId = options?.scheduledToolPolicy?.ownerAccountId ?? options?.agentAccountId;
	const pluginToolCallerIdentity = agentId && options?.sessionKey?.trim() ? {
		agentId,
		sessionKey: options.sessionKey.trim(),
		turnSourceChannel: resolveGatewayMessageChannel(options.messageChannel ?? options.messageProvider),
		turnSourceTo: options.currentMessagingTarget ?? options.currentChannelId ?? options.messageTo,
		turnSourceAccountId: gatewayCallerAccountId,
		turnSourceThreadId: options.currentThreadTs ?? options.messageThreadId
	} : void 0;
	const pluginToolsOnly = filterToolsByClientCaps(includeOpenClawTools || !includePluginTools ? [] : resolveOpenClawPluginToolsForOptions({
		options: {
			agentSessionKey: options?.sessionKey,
			agentChannel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider),
			agentAccountId: options?.agentAccountId,
			agentTo: options?.messageTo,
			agentThreadId: options?.messageThreadId,
			nativeChannelId: options?.nativeChannelId,
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
			runSessionKey: options?.runSessionKey,
			agentChannel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider),
			agentAccountId: options?.agentAccountId,
			gatewayCallerAccountId,
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
			webSearchEnabled: options?.webSearchEnabled,
			clientCaps: options?.clientCaps,
			toolBindings: options?.toolBindings,
			pluginToolAllowlist,
			pluginToolDenylist,
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
			skillWorkshop: options?.skillWorkshop,
			replyToMode: options?.replyToMode,
			hasRepliedRef: options?.hasRepliedRef,
			modelHasVision: options?.modelHasVision,
			computerContextEpoch: options?.computerContextEpoch,
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
		auditLogLevel: options?.toolPolicyAuditLogLevel,
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: options?.config,
			metadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot,
			workspaceDir: workspaceRoot,
			toolDenylist: pluginToolDenylist
		})
	})), options?.delegationCapability).filter((tool) => !options?.swarmCollector || tool.name !== "ask_user" && tool.name !== "sessions_send" && tool.name !== "sessions_yield");
	if (swarmStructuredOutputTool && !authorizedTools.some((tool) => tool.name === swarmStructuredOutputTool.name)) authorizedTools.push(swarmStructuredOutputTool);
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
		...sandboxRoot && allowWorkspaceWrites ? { sandbox: {
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
