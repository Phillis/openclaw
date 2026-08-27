import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { g as resolveSessionAgentIds } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir, n as hasAgentRosterProperty, s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import "./session-key-D8GLfPr_.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { g as normalizeToolPolicyName, m as expandToolGroups } from "./tool-policy-CWmnHLY1.js";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-CdX9UGcX.js";
import "./config-Dl8DJbzM.js";
import { r as hasUsableOAuthCredential } from "./credential-state-DRH6Q-Y3.js";
import { i as resolveAuthProfileOrder } from "./order-jGX4iJ3y.js";
import { n as applyPluginTextReplacements } from "./text-transforms.runtime-SAr5EqHs.js";
import { c as resolveContextEngine } from "./registry-BcgtD5p6.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-IYtayVps.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-er-Gn_t_.js";
import "./message-channel-T4W5YOto.js";
import { i as readExternalCliBootstrapCredential, n as isSafeToUseExternalCliCredential } from "./external-cli-sync-CU9M9_mw.js";
import { d as loadAuthProfileStoreForRuntime, g as resolveRuntimeAuthProfileAgentDir } from "./store-BH6qiWJF.js";
import { r as buildOAuthRefreshFailureLoginCommand } from "./oauth-refresh-failure-DLKK-cud.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Ap-awZem.js";
import { n as resolveApiKeyForProfile } from "./oauth-DR1nOOg4.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DM5kEN0f.js";
import { _ as isWorkspaceBootstrapPending, n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-CiE104ur.js";
import { n as resolveCliAuthBindingFingerprint, r as resolveCliAuthEpoch } from "./cli-auth-epoch-Cr5X6Cox.js";
import { c as resolvePreparedRunAdmission } from "./admitted-run-context-BxSN0sUe.js";
import { a as resolveContextTokensForModel } from "./context-DCjX8f9I.js";
import { r as annotateInterSessionPromptText } from "./input-provenance-BA6fPshG.js";
import { l as isPrimaryBootstrapRun, u as resolveWorkspaceBootstrapRouting } from "./openclaw-tools--aBnq3g4.js";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.js";
import { i as buildGenericCliContextEngineHostSupport, r as assertContextEngineHostSupport } from "./host-compat-xESS3bi6.js";
import { o as buildBootstrapTruncationReportMeta, r as buildBootstrapBudgetState } from "./bootstrap-budget-BjndRqg9.js";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn } from "./bootstrap-files-DQdZlI4U.js";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-T79q0Len.js";
import { i as resolveEmbeddedRunSkillEntries, r as resolveSandboxSkillRuntimeInputs, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-DLLM_u-l.js";
import { t as ensureSandboxWorkspaceForSession } from "./context-BIHB56yZ.js";
import "./sandbox-DncyGHry.js";
import { a as prependSystemPromptAddition, c as resolvePromptBuildHookResult, s as resolveAttemptMediaTaskSystemPromptAddition, y as resolveHeartbeatPromptForSystemPrompt } from "./attempt-prompt-helpers-CUWaUsGQ.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-CTPOjF6w.js";
import { t as ensureContextEnginesInitialized } from "./init-0ay_bAJJ.js";
import { a as messageToolOwnsVisibleReply } from "./local-model-lean-BMyyuL8b.js";
import { n as mergeForcedEmbeddedAttemptToolsAllow, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D_uFFO7I.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-D6EJ_Q3z.js";
import { n as composeSystemPromptWithHookContext } from "./attempt-thread-helpers-C0Wm7-vX.js";
import { a as buildModelIdentityPromptLine, i as appendModelIdentitySystemPrompt } from "./system-prompt-params-BHFU-PU8.js";
import { t as buildCurrentInboundPrompt } from "./runtime-context-prompt-E9LRffzc.js";
import { i as resolveCliSessionReuse, n as hashCliSessionText } from "./cli-session-BMkhQ-yp.js";
import { n as collectRuntimeChannelCapabilities, t as buildSystemPromptReport } from "./system-prompt-report-flBV6DOo.js";
import { a as selectContextEngineForTranscriptHost, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-iXA9vvp1.js";
import { n as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-BrDfJg6S.js";
import { t as buildCliBackendToolAvailability } from "./tool-policy-DbdtO-eX.js";
import { a as buildSystemAgentToolsMcpServerConfig } from "./openclaw-tools-serve-config-CPi0gqnN.js";
import { r as cliBackendLog } from "./log-ClSqV59J.js";
import { a as normalizeCliModel, i as isClaudeCliBackendId, t as buildCliAgentSystemPrompt } from "./helpers-8rnQvDzb.js";
import { t as CliBackendAuthProfilePreparationError } from "./cli-backend-errors-ngojFnXq.js";
import { r as prepareCliBundleMcpConfig, t as prepareClaudeCliSkillsPlugin } from "./claude-skills-plugin-DNmVPpOW.js";
import { c as getClaudeGeneration } from "./claude-live-registry-DvemukXn.js";
import { a as createMcpLoopbackServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-CrkkrSyL.js";
import { a as mintMcpLoopbackClientGrant, d as revokeMcpLoopbackClientGrant, n as bindMcpLoopbackClientGrantAdmission, r as deactivateMcpLoopbackClientGrantCapture, t as activateMcpLoopbackClientGrantCapture } from "./mcp-grant-store-Bu9z2SVy.js";
import { i as resolveMcpLoopbackScopedTools, n as ensureMcpLoopbackServer, r as resolveMcpLoopbackPolicyTools } from "./mcp-http-D5CiLe6-.js";
import { a as loadCliSessionReseedMessages, c as CliAuthProfilePreparationError, d as claudeCliSessionTranscriptHasOrphanedToolUse, i as loadCliSessionHistoryMessages, n as hasCliSessionTranscript, o as resolveAutoCliSessionReseedHistoryChars, t as buildCliSessionHistoryPrompt, u as claudeCliSessionTranscriptHasContent } from "./session-history-D4e3ZFCN.js";
import { ensureSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/agents/cli-runner/cli-backend-auth-policy.ts
const BUNDLED_CLI_BACKEND_AUTH_POLICIES = {
	"claude-cli": {
		strictSelectedProfile: true,
		oauthRefreshOwner: "core",
		nativePassthroughProviderId: "claude-cli"
	},
	"google-gemini-cli": {
		strictSelectedProfile: false,
		oauthRefreshOwner: "cli"
	}
};
function resolveBundledCliBackendAuthPolicy(backendId) {
	return BUNDLED_CLI_BACKEND_AUTH_POLICIES[backendId];
}
//#endregion
//#region src/agents/cli-runner/mcp-grant-context.ts
function normalizeOptionalMcpContextValue(value) {
	return value?.trim() || void 0;
}
function buildCliMcpExecSession(sessionEntry) {
	const execSession = {
		execHost: normalizeOptionalMcpContextValue(sessionEntry?.execHost),
		execSecurity: normalizeOptionalMcpContextValue(sessionEntry?.execSecurity),
		execAsk: normalizeOptionalMcpContextValue(sessionEntry?.execAsk),
		execNode: normalizeOptionalMcpContextValue(sessionEntry?.execNode)
	};
	return Object.values(execSession).some(Boolean) ? execSession : void 0;
}
function buildCliMcpExecOverrides(execOverrides) {
	if (!execOverrides) return;
	const scopedOverrides = {
		...execOverrides.host !== void 0 ? { host: execOverrides.host } : {},
		...execOverrides.security !== void 0 ? { security: execOverrides.security } : {},
		...execOverrides.ask !== void 0 ? { ask: execOverrides.ask } : {},
		...execOverrides.node !== void 0 ? { node: execOverrides.node } : {}
	};
	return Object.keys(scopedOverrides).length > 0 ? scopedOverrides : void 0;
}
function buildCliMcpBashElevated(bashElevated) {
	if (!bashElevated) return;
	return {
		enabled: bashElevated.enabled,
		allowed: bashElevated.allowed,
		defaultLevel: bashElevated.defaultLevel,
		...bashElevated.fullAccessAvailable !== void 0 ? { fullAccessAvailable: bashElevated.fullAccessAvailable } : {},
		...bashElevated.fullAccessBlockedReason !== void 0 ? { fullAccessBlockedReason: bashElevated.fullAccessBlockedReason } : {}
	};
}
function buildCliMcpChannelContext(channelContext, senderId) {
	const resolvedSenderId = normalizeOptionalMcpContextValue(senderId ?? void 0) ?? normalizeOptionalMcpContextValue(channelContext?.sender?.id);
	const chatId = normalizeOptionalMcpContextValue(channelContext?.chat?.id);
	if (!resolvedSenderId && !chatId) return;
	return {
		...resolvedSenderId ? { sender: { id: resolvedSenderId } } : {},
		...chatId ? { chat: { id: chatId } } : {}
	};
}
function resolveCliMcpMessageProvider(run) {
	return normalizeMessageChannel(run.messageProvider ?? run.messageChannel) ?? void 0;
}
function resolveCliMcpSessionKey(run, config, agentId) {
	return canonicalizeMainSessionAlias({
		cfg: config,
		agentId,
		sessionKey: run.sessionKey?.trim() || "main"
	});
}
function buildCliMcpGrantContext(params) {
	const sessionKey = resolveCliMcpSessionKey(params.run, params.config, params.agentId);
	const runtimePolicySessionKey = normalizeOptionalMcpContextValue(params.run.runtimePolicySessionKey);
	const runtimePolicyAgentId = runtimePolicySessionKey ? normalizeOptionalMcpContextValue(params.run.agentId) : void 0;
	const clientCaps = uniqueStrings((params.run.clientCaps ?? []).map((cap) => cap.trim()).filter(Boolean));
	const execSession = buildCliMcpExecSession(params.run.sessionEntry);
	const execOverrides = buildCliMcpExecOverrides(params.run.execOverrides);
	const bashElevated = buildCliMcpBashElevated(params.run.bashElevated);
	const channelContext = buildCliMcpChannelContext(params.run.channelContext, params.run.senderId);
	const senderName = normalizeOptionalMcpContextValue(params.run.senderName ?? void 0);
	const senderUsername = normalizeOptionalMcpContextValue(params.run.senderUsername ?? void 0);
	const senderE164 = normalizeOptionalMcpContextValue(params.run.senderE164 ?? void 0);
	const groupId = normalizeOptionalMcpContextValue(params.run.groupId ?? void 0);
	const groupChannel = normalizeOptionalMcpContextValue(params.run.groupChannel ?? void 0);
	const groupSpace = normalizeOptionalMcpContextValue(params.run.groupSpace ?? void 0);
	const spawnedBy = normalizeOptionalMcpContextValue(params.run.spawnedBy ?? void 0);
	const messageProvider = resolveCliMcpMessageProvider(params.run);
	const currentChannelId = normalizeOptionalMcpContextValue(params.run.currentChannelId);
	const grantedToolsAllow = params.run.cliToolAvailability?.openClaw ?? params.toolsAllow;
	const sourceReplyOnly = params.run.inputProvenance?.kind === "inter_session" && params.run.inputProvenance.sourceTool === "subagent_announce" && params.run.sourceReplyDeliveryMode === "message_tool_only" && grantedToolsAllow?.length === 1 && grantedToolsAllow[0] === "message";
	return {
		sessionKey,
		runtimePolicySessionKey,
		...runtimePolicyAgentId ? { runtimePolicyAgentId } : {},
		agentId: params.agentId,
		sessionId: normalizeOptionalMcpContextValue(params.run.sessionId),
		runId: normalizeOptionalMcpContextValue(params.run.runId),
		workspaceDir: params.run.workspaceDir,
		...normalizeOptionalMcpContextValue(params.run.cwd) ? { cwd: params.run.cwd?.trim() } : {},
		...params.toolsAllow ? { toolsAllow: params.toolsAllow } : {},
		...params.run.scheduledToolPolicy ? { scheduledToolPolicy: { ...params.run.scheduledToolPolicy } } : {},
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		messageProvider,
		clientCaps: clientCaps.length > 0 ? clientCaps : void 0,
		currentChannelId,
		currentThreadTs: normalizeOptionalMcpContextValue(params.run.currentThreadTs),
		currentMessageId: params.run.currentMessageId == null ? void 0 : normalizeOptionalMcpContextValue(String(params.run.currentMessageId)),
		currentInboundAudio: params.run.currentInboundAudio === true ? true : void 0,
		accountId: normalizeOptionalMcpContextValue(params.run.agentAccountId),
		inboundEventKind: params.run.currentInboundEventKind,
		sourceReplyDeliveryMode: params.run.sourceReplyDeliveryMode,
		...sourceReplyOnly ? { sourceReplyOnly: true } : {},
		taskSuggestionDeliveryMode: params.run.taskSuggestionDeliveryMode,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget ? true : void 0,
		senderIsOwner: params.run.senderIsOwner === true,
		nodeExecAllowed: true,
		...execSession ? { execSession } : {},
		...execOverrides ? { execOverrides } : {},
		...bashElevated ? { bashElevated } : {},
		...params.run.trigger ? { trigger: params.run.trigger } : {},
		...normalizeOptionalMcpContextValue(params.run.approvalReviewerDeviceId) ? { approvalReviewerDeviceId: params.run.approvalReviewerDeviceId?.trim() } : {},
		...channelContext ? { channelContext } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...groupId ? { groupId } : {},
		...groupChannel ? { groupChannel } : {},
		...groupSpace ? { groupSpace } : {},
		...spawnedBy ? { spawnedBy } : {}
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-claude.ts
const CLAUDE_CLI_CONTEXT_MODEL_ALIASES = {
	opus: "claude-opus-5",
	"opus-5": "claude-opus-5",
	"opus-4.8": "claude-opus-4-8",
	"opus-4-8": "claude-opus-4-8",
	"opus-4.7": "claude-opus-4-7",
	"opus-4-7": "claude-opus-4-7",
	"opus-4.6": "claude-opus-4-6",
	"opus-4-6": "claude-opus-4-6",
	sonnet: "claude-sonnet-5",
	"sonnet-5": "claude-sonnet-5",
	"sonnet-4.6": "claude-sonnet-4-6",
	"sonnet-4-6": "claude-sonnet-4-6",
	fable: "claude-fable-5",
	"fable-5": "claude-fable-5"
};
function detectNodeClaudePlacement(params) {
	if (params.backendId === "claude-cli" && params.execHost === "node" && !params.execNode?.trim()) throw new Error("node-placed Claude CLI session is missing execNode");
	return params.backendId === "claude-cli" && params.execHost === "node" && Boolean(params.execNode?.trim());
}
//#endregion
//#region src/agents/cli-runner/prepare.ts
/**
* Prepares CLI backend run context: backend config, prompts, bootstrap context,
* MCP, auth epoch, and reusable session metadata.
*/
function unsupportedIsolatedCompletionError(backendId) {
	const error = /* @__PURE__ */ new Error(`CLI backend "${backendId}" does not support isolated completion; OpenClaw did not start the run.`);
	error.name = "IsolatedCompletionUnsupportedError";
	error.code = "unsupported";
	return error;
}
function resolveClaudeCliContextModelId(modelId) {
	const trimmed = modelId.trim();
	return CLAUDE_CLI_CONTEXT_MODEL_ALIASES[trimmed.toLowerCase()] ?? trimmed;
}
const defaultPrepareDeps = {
	isWorkspaceBootstrapPending,
	makeBootstrapWarn,
	resolveBootstrapContextForRun,
	getActiveMcpLoopbackRuntime,
	ensureMcpLoopbackServer,
	createMcpLoopbackServerConfig,
	activateMcpLoopbackClientGrantCapture,
	bindMcpLoopbackClientGrantAdmission,
	deactivateMcpLoopbackClientGrantCapture,
	mintMcpLoopbackClientGrant,
	revokeMcpLoopbackClientGrant,
	resolveMcpLoopbackPolicyTools,
	resolveMcpLoopbackScopedTools,
	resolveOpenClawReferencePaths: async (params) => (await import("./docs-path-C7svL1y2.js")).resolveOpenClawReferencePaths(params),
	prepareClaudeCliSkillsPlugin,
	claudeCliSessionTranscriptHasContent,
	claudeCliSessionTranscriptHasOrphanedToolUse,
	getClaudeGeneration,
	readExternalCliBootstrapCredential,
	resolveApiKeyForProfile
};
const prepareDeps = { ...defaultPrepareDeps };
function resolveReusableCliSessionId(reusableCliSession) {
	return reusableCliSession.mode === "reuse" || reusableCliSession.mode === "reuse-with-drift" ? reusableCliSession.sessionId : void 0;
}
function resolveCliSessionInvalidatedReason(reusableCliSession) {
	return reusableCliSession.mode === "invalidate" ? reusableCliSession.invalidatedReason : void 0;
}
function canTransportSystemPrompt(backend) {
	return backend.systemPromptWhen !== "never" && Boolean(backend.systemPromptArg || backend.systemPromptFileArg || backend.systemPromptFileConfigKey);
}
function buildCliSessionDriftUserContext(reusableCliSession) {
	if (reusableCliSession.mode !== "reuse-with-drift") return;
	return `OpenClaw resumed this CLI session after prompt content changed. Follow the current turn's instructions; changed=${reusableCliSession.drift.reasons.join(",")}.`;
}
function prependCliSessionDriftUserContext(context, reusableCliSession) {
	const note = buildCliSessionDriftUserContext(reusableCliSession);
	if (!note) return context;
	if (!context) return { text: note };
	return {
		...context,
		text: [note, context.text].join("\n\n"),
		...context.resumableText ? { resumableText: [note, context.resumableText].join("\n\n") } : {}
	};
}
async function resolveCliSkillsPrompt(params) {
	const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
		config: params.config,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	});
	if (!sandboxWorkspace) return resolveSkillsPrompt({
		skillsSnapshot: params.skillsSnapshot,
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId
	});
	const { skillsEligibility, skillsPromptWorkspaceDir, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir, workspaceOnly } = resolveSandboxSkillRuntimeInputs({
		sandbox: {
			enabled: true,
			...sandboxWorkspace.containerWorkdir ? { containerWorkdir: sandboxWorkspace.containerWorkdir } : {},
			...sandboxWorkspace.skillsEligibility ? { skillsEligibility: sandboxWorkspace.skillsEligibility } : {},
			...sandboxWorkspace.skillsWorkspaceDir ? { skillsWorkspaceDir: sandboxWorkspace.skillsWorkspaceDir } : {},
			...sandboxWorkspace.workspaceAccess ? { workspaceAccess: sandboxWorkspace.workspaceAccess } : {}
		},
		effectiveWorkspace: sandboxWorkspace.workspaceDir,
		skillsSnapshot: params.skillsSnapshot
	});
	const { shouldLoadSkillEntries, skillEntries } = resolveEmbeddedRunSkillEntries({
		workspaceDir: skillsWorkspaceDir,
		config: params.config,
		agentId: params.agentId,
		eligibility: skillsEligibility,
		skillsSnapshot: skillsSnapshotForRun,
		workspaceOnly
	});
	return resolveSkillsPrompt({
		skillsSnapshot: skillsSnapshotForRun,
		entries: mapSandboxSkillEntriesForPrompt({
			entries: shouldLoadSkillEntries ? skillEntries : void 0,
			skillsWorkspaceDir,
			skillsPromptWorkspaceDir
		}),
		workspaceDir: skillsPromptWorkspaceDir,
		config: params.config,
		agentId: params.agentId,
		eligibility: skillsEligibility
	});
}
/** Overrides preparation dependencies for CLI runner tests. */
function setCliRunnerPrepareTestDeps(overrides) {
	Object.assign(prepareDeps, overrides);
}
/** Restores preparation dependencies after CLI runner tests. */
function resetCliRunnerPrepareTestDeps() {
	Object.assign(prepareDeps, defaultPrepareDeps);
}
/** Returns whether profile-owned prepared execution should skip local CLI epoch hashing. */
function shouldSkipLocalCliCredentialEpoch(params) {
	return Boolean(params.authEpochMode === "profile-only" && params.authProfileId && params.authCredential && params.preparedExecution);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cliRunnerPrepareTestApi")] = {
	resetCliRunnerPrepareTestDeps,
	setCliRunnerPrepareTestDeps: (overrides) => {
		setCliRunnerPrepareTestDeps(overrides);
	}
};
function shouldRefreshAuthProfileForExecution(params) {
	if (!params.policy || !params.authProfileId || !params.authCredential) return false;
	if (params.authCredential.type === "oauth") return params.policy.oauthRefreshOwner === "core";
	return params.authCredential.type === "api_key" || params.authCredential.type === "token";
}
function describeCliAuthProfileResolutionFailure(profileId, failure) {
	switch (failure.kind) {
		case "resolved-as-other": return `selected auth profile "${profileId}" resolved as "${failure.resolvedProfileId}"`;
		case "native-login-missing": return `selected auth profile "${profileId}" reuses the host's Claude CLI login, but no reusable Claude CLI login is available`;
		case "native-login-identity-mismatch": return `selected auth profile "${profileId}" reuses the host's Claude CLI login, but the current Claude CLI login belongs to a different account`;
		case "unmaterialized": return `could not materialize selected auth profile "${profileId}"`;
	}
	return failure;
}
function buildCliAuthProfileResolutionError(params) {
	const loginCommand = buildOAuthRefreshFailureLoginCommand(params.provider, { profileId: params.profileId });
	const reason = describeCliAuthProfileResolutionFailure(params.profileId, params.failure);
	return new CliAuthProfilePreparationError({
		message: `CLI backend "${params.backendId}" ${reason}. Re-authenticate with: ${loginCommand}. OpenClaw did not start the run.`,
		profileId: params.profileId,
		provider: params.provider,
		agentDir: params.agentDir
	});
}
/** Builds the complete context required to execute a CLI-backed agent run. */
async function prepareCliRunContext(inputParams) {
	let params = inputParams.config ? inputParams : {
		...inputParams,
		config: getRuntimeConfig()
	};
	const runConfig = params.config;
	const sessionOwner = normalizeAgentId(parseAgentSessionKey(params.sessionKey)?.agentId || params.agentId?.trim() || "main");
	const workspaceConfig = hasAgentRosterProperty(runConfig) ? runConfig : {
		...runConfig,
		agents: {
			...runConfig.agents,
			entries: { [sessionOwner]: { default: true } }
		}
	};
	const started = Date.now();
	const executionMode = params.executionMode ?? "agent";
	const isSideQuestion = executionMode === "side-question";
	const isControlOperation = params.controlOperation !== void 0;
	const skipsTurnPreparation = isSideQuestion || isControlOperation;
	const admitPreparedParams = async (candidate) => {
		const admittedRunContext = await resolvePreparedRunAdmission({
			runId: candidate.runId,
			runtimeKind: "embedded",
			admittedRunContext: candidate.admittedRunContext,
			preparedRunAdmission: candidate.preparedRunAdmission
		});
		const { preparedRunAdmission: _preparedRunAdmission, ...rest } = candidate;
		return {
			...rest,
			agentId: workspaceResolution.agentId,
			admittedRunContext
		};
	};
	const runtimeChatType = params.chatType ?? params.sessionEntry?.chatType;
	const workspaceResolution = resolveRunWorkspaceDir({
		workspaceDir: params.workspaceDir,
		sessionKey: params.sessionKey,
		agentId: sessionOwner,
		config: workspaceConfig
	});
	const resolvedWorkspace = workspaceResolution.workspaceDir;
	const redactedSessionId = redactRunIdentifier(params.sessionId);
	const redactedSessionKey = redactRunIdentifier(params.sessionKey);
	const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
	if (workspaceResolution.usedFallback) cliBackendLog.warn(`[workspace-fallback] caller=runCliAgent reason=${workspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${workspaceResolution.agentId} workspace=${redactedWorkspace}`);
	const workspaceDir = resolvedWorkspace;
	const cwd = params.cwd ? resolveUserPath(params.cwd) : workspaceDir;
	const cwdHash = hashCliSessionText(cwd);
	const backendResolved = resolveCliBackendConfig(params.provider, params.config, { agentId: workspaceResolution.agentId });
	if (!backendResolved) throw new Error(`Unknown CLI backend: ${params.provider}`);
	const backendAuthPolicy = resolveBundledCliBackendAuthPolicy(backendResolved.id);
	const canEnforceExactToolAvailability = backendResolved.nativeToolMode === "selectable" && (backendResolved.toolAvailabilityEnforcement === "execution-args" && backendResolved.resolveExecutionArgs !== void 0 || backendResolved.toolAvailabilityEnforcement === "prepare-execution" && backendResolved.prepareExecution !== void 0);
	let runtimeToolsAllowPolicy;
	if (params.toolsAllow !== void 0) {
		if (params.cliToolAvailability !== void 0) throw new Error(`CLI backend ${backendResolved.id} received conflicting runtime tool policies`);
		if (params.toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*")) params = {
			...params,
			toolsAllow: void 0
		};
		else {
			runtimeToolsAllowPolicy = [...params.toolsAllow];
			const fallbackOpenClawTools = uniqueStrings(expandToolGroups(params.toolsAllow).map((toolName) => normalizeToolPolicyName(toolName)).filter(Boolean));
			if (fallbackOpenClawTools.includes("write") && !fallbackOpenClawTools.includes("apply_patch")) fallbackOpenClawTools.push("apply_patch");
			params = {
				...params,
				toolsAllow: void 0,
				cliToolAvailability: {
					native: [],
					openClaw: fallbackOpenClawTools
				}
			};
		}
	}
	if (params.disableTools === true && !isSideQuestion && canEnforceExactToolAvailability) {
		runtimeToolsAllowPolicy = void 0;
		params = {
			...params,
			toolsAllow: void 0,
			cliToolAvailability: {
				native: [],
				openClaw: []
			}
		};
	}
	const internalParams = params;
	const nodeClaudePlacement = detectNodeClaudePlacement({
		backendId: backendResolved.id,
		execHost: params.sessionEntry?.execHost,
		execNode: params.sessionEntry?.execNode
	});
	if (nodeClaudePlacement && params.cliToolAvailability) params = {
		...params,
		cliToolAvailability: {
			native: params.cliToolAvailability.native,
			openClaw: []
		}
	};
	if (params.cliToolAvailability !== void 0 && !canEnforceExactToolAvailability) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce this run's tool cap. Upgrade its plugin and retry; if current, ask its maintainer to add exact-cap support. OpenClaw did not start the run.`);
	const sideQuestionDisablesNativeTools = isSideQuestion && backendResolved.sideQuestionToolMode === "disabled";
	const requestedNoNativeTools = params.cliToolAvailability?.native.length === 0;
	if (params.disableTools === true && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !requestedNoNativeTools) && !sideQuestionDisablesNativeTools) throw new Error(`CLI backend ${backendResolved.id} cannot run with tools disabled because it exposes native tools`);
	const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: sessionOwner
	});
	const agentContextTokens = resolveAgentConfig(params.config ?? {}, sessionAgentId)?.contextTokens;
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
	let effectiveAuthProfileId = (params.authProfileId?.trim() || void 0) ?? backendResolved.defaultAuthProfileId?.trim() ?? void 0;
	let authStore;
	let authCredential;
	let resolvedProfileAuth;
	const loadScopedAuthStore = (options = {}) => loadAuthProfileStoreForRuntime(agentDir, {
		readOnly: options.readOnly ?? true,
		externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.config,
			provider: params.provider,
			...options.profileId ? { profileId: options.profileId } : {}
		})
	});
	if (effectiveAuthProfileId) {
		authStore = loadScopedAuthStore({ profileId: effectiveAuthProfileId });
		authCredential = authStore.profiles[effectiveAuthProfileId];
	} else if (backendResolved.authEpochMode === "profile-only" || backendResolved.prepareExecution && backendResolved.autoSelectAuthProfile !== false) {
		authStore = loadScopedAuthStore();
		effectiveAuthProfileId = resolveAuthProfileOrder({
			cfg: params.config,
			store: authStore,
			provider: params.provider
		})[0]?.trim() || void 0;
		if (effectiveAuthProfileId) authCredential = authStore.profiles[effectiveAuthProfileId];
	}
	const nativeClaudeCliCredential = backendAuthPolicy?.nativePassthroughProviderId !== void 0 && authCredential?.type === "oauth" && authCredential.provider === backendAuthPolicy.nativePassthroughProviderId ? authCredential : void 0;
	if (effectiveAuthProfileId && authStore && nativeClaudeCliCredential) {
		const authProfileId = effectiveAuthProfileId;
		const liveNativeLogin = prepareDeps.readExternalCliBootstrapCredential({
			store: authStore,
			profileId: authProfileId,
			credential: nativeClaudeCliCredential
		});
		if (!liveNativeLogin) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: nativeClaudeCliCredential.provider,
			agentDir,
			failure: { kind: "native-login-missing" }
		});
		if (!isSafeToUseExternalCliCredential(nativeClaudeCliCredential, liveNativeLogin)) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: nativeClaudeCliCredential.provider,
			agentDir,
			failure: { kind: "native-login-identity-mismatch" }
		});
		authCredential = void 0;
	} else if (effectiveAuthProfileId && shouldRefreshAuthProfileForExecution({
		policy: backendAuthPolicy,
		authProfileId: effectiveAuthProfileId,
		authCredential
	})) {
		const authProfileId = effectiveAuthProfileId;
		const writableAuthStore = loadScopedAuthStore({
			profileId: authProfileId,
			readOnly: false
		});
		const resolvedAuth = await prepareDeps.resolveApiKeyForProfile({
			cfg: params.config,
			store: writableAuthStore,
			profileId: authProfileId,
			agentDir,
			...backendAuthPolicy?.strictSelectedProfile ? { allowProfileFallback: false } : {}
		});
		if (!resolvedAuth && backendAuthPolicy?.strictSelectedProfile) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: writableAuthStore.profiles[authProfileId]?.provider ?? params.provider,
			agentDir,
			failure: { kind: "unmaterialized" }
		});
		if (resolvedAuth && backendAuthPolicy?.strictSelectedProfile && resolvedAuth.profileId !== authProfileId) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: writableAuthStore.profiles[authProfileId]?.provider ?? params.provider,
			agentDir,
			failure: {
				kind: "resolved-as-other",
				resolvedProfileId: resolvedAuth.profileId
			}
		});
		const resolvedAuthProfileId = resolvedAuth?.profileId ?? authProfileId;
		authStore = loadScopedAuthStore({ profileId: resolvedAuthProfileId });
		authCredential = resolvedAuth?.credential ?? authStore.profiles[resolvedAuthProfileId];
		if (backendAuthPolicy?.strictSelectedProfile && (!authCredential || authCredential.type === "oauth" && !hasUsableOAuthCredential(authCredential))) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: resolvedAuth?.provider ?? params.provider,
			agentDir,
			failure: { kind: "unmaterialized" }
		});
		if (resolvedAuth && authCredential) {
			effectiveAuthProfileId = resolvedAuthProfileId;
			resolvedProfileAuth = {
				apiKey: resolvedAuth.apiKey,
				profileId: resolvedAuthProfileId,
				source: `profile:${resolvedAuthProfileId}`,
				mode: resolvedAuth.profileType === "api_key" ? "api-key" : resolvedAuth.profileType
			};
			if (authCredential.type === "api_key") authCredential = {
				...authCredential,
				key: resolvedAuth.apiKey
			};
			else if (authCredential.type === "token") authCredential = {
				...authCredential,
				token: resolvedAuth.apiKey
			};
		}
	}
	const extraSystemPrompt = params.extraSystemPrompt?.trim() ?? "";
	const bindingFacts = params.cliSessionBindingFacts;
	const bindingExtraSystemPromptStatic = bindingFacts?.extraSystemPromptStatic ?? params.extraSystemPromptStatic;
	const baseExtraSystemPromptHash = bindingExtraSystemPromptStatic !== void 0 ? hashCliSessionText(bindingExtraSystemPromptStatic.trim() || void 0) : hashCliSessionText(extraSystemPrompt);
	const requireExplicitMessageTarget = params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey);
	const hasCliSessionBindingFacts = bindingFacts !== void 0;
	const bindingRequireExplicitMessageTarget = bindingFacts?.requireExplicitMessageTarget ?? requireExplicitMessageTarget;
	const bindingSourceReplyDeliveryMode = hasCliSessionBindingFacts ? bindingFacts.sourceReplyDeliveryMode : params.sourceReplyDeliveryMode;
	const messageToolPolicyHash = bindingSourceReplyDeliveryMode !== void 0 || (hasCliSessionBindingFacts ? bindingFacts.requireExplicitMessageTarget !== void 0 || bindingRequireExplicitMessageTarget : params.requireExplicitMessageTarget !== void 0 || bindingRequireExplicitMessageTarget) ? hashCliSessionText(JSON.stringify({
		sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
		requireExplicitMessageTarget: bindingRequireExplicitMessageTarget
	})) : void 0;
	const modelId = (params.model ?? "default").trim() || "default";
	const modelProvider = normalizeOptionalMcpContextValue(params.modelProvider) ?? normalizeOptionalMcpContextValue(params.provider) ?? params.provider;
	const normalizedModel = normalizeCliModel(modelId, backendResolved.config);
	const modelDisplay = `${params.provider}/${modelId}`;
	let openClawHistoryMessages;
	const loadOpenClawHistoryMessages = async () => {
		openClawHistoryMessages ??= await loadCliSessionHistoryMessages({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: sessionAgentId,
			config: params.config
		});
		return openClawHistoryMessages;
	};
	const promptBuildHookResult = await (async () => {
		if (skipsTurnPreparation) return;
		const hookRunner = getGlobalHookRunner();
		try {
			return await resolvePromptBuildHookResult({
				config: params.config ?? getRuntimeConfig(),
				prompt: params.prompt,
				messages: await loadOpenClawHistoryMessages(),
				hookCtx: {
					runId: params.runId,
					agentId: sessionAgentId,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					workspaceDir,
					modelProviderId: params.provider,
					modelId,
					trigger: params.trigger,
					...buildAgentHookContextChannelFields(params)
				},
				hookRunner,
				bootstrapContextRunKind: params.bootstrapContextRunKind
			});
		} catch (error) {
			cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
			return;
		}
	})();
	const promptBuildToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(promptBuildHookResult?.toolsAllow, { forceMessageTool: messageToolOwnsVisibleReply({ sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode }) });
	const promptBuildRestrictsTools = promptBuildToolsAllow !== void 0 && !promptBuildToolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*");
	const isClaudeCli = isClaudeCliBackendId(params.provider);
	const requestedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(modelId) : modelId;
	const normalizedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(normalizedModel) : normalizedModel;
	const contextModelIds = [requestedContextModelId, ...normalizedContextModelId !== requestedContextModelId ? [normalizedContextModelId] : []];
	const resolveContextModelTokens = (contextModelId, allowUnscopedModelLookup) => resolveContextTokensForModel({
		cfg: params.config,
		provider: params.provider,
		modelProvider: backendResolved.modelProvider,
		model: contextModelId,
		allowAsyncLoad: false,
		allowUnscopedModelLookup
	});
	let modelContextTokens;
	for (const contextModelId of contextModelIds) {
		const candidateContextTokens = resolveContextModelTokens(contextModelId, false);
		if (candidateContextTokens !== void 0) modelContextTokens = modelContextTokens === void 0 ? candidateContextTokens : Math.min(modelContextTokens, candidateContextTokens);
	}
	if (modelContextTokens === void 0) for (const contextModelId of contextModelIds.toReversed()) {
		modelContextTokens = resolveContextModelTokens(contextModelId, true);
		if (modelContextTokens !== void 0) break;
	}
	modelContextTokens ??= DEFAULT_CONTEXT_TOKENS;
	const resolvedContextWindowInfo = resolveContextWindowInfo({
		cfg: params.config,
		provider: params.provider,
		modelId,
		modelContextTokens,
		agentContextTokens,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const contextWindowInfo = resolvedContextWindowInfo.tokens > modelContextTokens ? {
		tokens: modelContextTokens,
		source: "model"
	} : resolvedContextWindowInfo;
	const autoReseedHistoryChars = isClaudeCli ? resolveAutoCliSessionReseedHistoryChars(contextWindowInfo.tokens) : void 0;
	const sessionLabel = params.sessionKey ?? params.sessionId;
	const { bootstrapFiles, contextFiles: resolvedContextFiles } = skipsTurnPreparation ? {
		bootstrapFiles: [],
		contextFiles: []
	} : await prepareDeps.resolveBootstrapContextForRun({
		workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		chatType: runtimeChatType,
		agentId: sessionAgentId,
		contextMode: params.bootstrapContextMode,
		runKind: params.bootstrapContextRunKind,
		warn: prepareDeps.makeBootstrapWarn({
			sessionLabel,
			workspaceDir,
			warn: (message) => cliBackendLog.warn(message)
		})
	});
	const canonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(params.config ?? {}, workspaceResolution.agentId));
	const selectedNativeToolsProvideFileAccess = params.cliToolAvailability === void 0 || params.cliToolAvailability.native.length > 0;
	const hasBootstrapFileAccess = (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable") && selectedNativeToolsProvideFileAccess && params.disableTools !== true;
	const bootstrapRouting = skipsTurnPreparation || !canTransportSystemPrompt(backendResolved.config) ? void 0 : await resolveWorkspaceBootstrapRouting({
		isWorkspaceBootstrapPending: prepareDeps.isWorkspaceBootstrapPending,
		bootstrapFiles,
		bootstrapFilesProvideAccess: false,
		bootstrapContextRunKind: params.bootstrapContextRunKind,
		trigger: params.trigger,
		sessionKey: params.sessionKey,
		isPrimaryRun: isPrimaryBootstrapRun(params.sessionKey),
		isCanonicalWorkspace: canonicalWorkspace === resolvedWorkspace,
		effectiveWorkspace: workspaceDir,
		resolvedWorkspace,
		hasBootstrapFileAccess
	});
	const bootstrapMode = bootstrapRouting?.bootstrapMode ?? "none";
	const includeBootstrapInSystemContext = bootstrapRouting?.includeBootstrapInSystemContext ?? true;
	const contextFiles = includeBootstrapInSystemContext ? resolvedContextFiles : resolvedContextFiles.filter((file) => !/(^|[\\/])BOOTSTRAP\.md$/iu.test(file.path.trim()));
	const bootstrapFilesForInjectionStats = includeBootstrapInSystemContext ? bootstrapFiles : bootstrapFiles.filter((file) => file.name !== DEFAULT_BOOTSTRAP_FILENAME);
	const { bootstrapAnalysis, bootstrapMaxChars, bootstrapPromptWarning, bootstrapPromptWarningMode, bootstrapTotalMaxChars } = buildBootstrapBudgetState({
		config: params.config,
		agentId: sessionAgentId,
		bootstrapFiles: bootstrapFilesForInjectionStats,
		injectedFiles: contextFiles,
		seenSignatures: params.bootstrapPromptWarningSignaturesSeen,
		previousSignature: params.bootstrapPromptWarningSignature
	});
	const systemAgentMcpConfig = internalParams.systemAgentTool ? buildSystemAgentToolsMcpServerConfig(internalParams.systemAgentTool) : void 0;
	const bundleMcpEnabled = !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig && backendResolved.bundleMcp && params.disableTools !== true;
	let mcpLoopbackRuntime = bundleMcpEnabled ? prepareDeps.getActiveMcpLoopbackRuntime() : void 0;
	if (bundleMcpEnabled && !mcpLoopbackRuntime) {
		try {
			await prepareDeps.ensureMcpLoopbackServer();
		} catch (error) {
			throw new Error(`Bundled MCP is enabled, but the OpenClaw MCP loopback server failed to start: ${String(error)}`, { cause: error });
		}
		mcpLoopbackRuntime = prepareDeps.getActiveMcpLoopbackRuntime();
	}
	if (bundleMcpEnabled && !mcpLoopbackRuntime) throw new Error("Bundled MCP is enabled, but the OpenClaw MCP loopback server did not publish a runtime after startup.");
	const mcpDeliveryCaptureEnabled = bundleMcpEnabled && Boolean(mcpLoopbackRuntime);
	const runtimeConfig = params.config ?? getRuntimeConfig();
	const shouldMaterializeRuntimePolicy = runtimeToolsAllowPolicy !== void 0 && !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig && params.disableTools !== true;
	const mcpContextBase = mcpLoopbackRuntime || shouldMaterializeRuntimePolicy ? buildCliMcpGrantContext({
		run: params,
		config: runtimeConfig,
		requireExplicitMessageTarget,
		agentId: sessionAgentId,
		modelProvider,
		modelId
	}) : void 0;
	const mcpToolAuthAgentDir = mcpContextBase ? resolveRuntimeAuthProfileAgentDir(agentDir) : void 0;
	const mcpToolAuth = mcpContextBase ? {
		...mcpToolAuthAgentDir ? { agentDir: mcpToolAuthAgentDir } : {},
		store: authStore ?? loadScopedAuthStore()
	} : void 0;
	const requestedLoopbackToolsAllow = runtimeToolsAllowPolicy ?? params.cliToolAvailability?.openClaw;
	const mcpProjectionContext = mcpContextBase && requestedLoopbackToolsAllow !== void 0 ? {
		...mcpContextBase,
		toolsAllow: [...requestedLoopbackToolsAllow]
	} : mcpContextBase;
	const resolveProjectedTools = runtimeToolsAllowPolicy !== void 0 ? prepareDeps.resolveMcpLoopbackPolicyTools : prepareDeps.resolveMcpLoopbackScopedTools;
	const hookFilteredProjectedTools = applyEmbeddedAttemptToolsAllow((bundleMcpEnabled || shouldMaterializeRuntimePolicy) && mcpProjectionContext ? resolveProjectedTools({
		cfg: runtimeConfig,
		...mcpProjectionContext,
		...mcpToolAuth ? { authProfileStore: mcpToolAuth.store } : {},
		...mcpToolAuth?.agentDir ? { authProfileStoreAgentDir: mcpToolAuth.agentDir } : {}
	}).tools : [], promptBuildToolsAllow);
	if (promptBuildRestrictsTools && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !canEnforceExactToolAvailability)) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce before_prompt_build tool restrictions. Use a backend with exact tool availability or remove the hook restriction. OpenClaw did not start the run.`);
	if (promptBuildRestrictsTools && params.cliToolAvailability === void 0) {
		if (backendResolved.nativeToolMode === "selectable") params = {
			...params,
			cliToolAvailability: {
				native: [],
				openClaw: hookFilteredProjectedTools.map((tool) => tool.name)
			}
		};
	}
	if (runtimeToolsAllowPolicy !== void 0 && shouldMaterializeRuntimePolicy) params = {
		...params,
		cliToolAvailability: {
			native: [],
			openClaw: hookFilteredProjectedTools.map((tool) => tool.name)
		}
	};
	if (params.cliToolAvailability && promptBuildToolsAllow !== void 0) {
		const filterToolNames = (names) => applyEmbeddedAttemptToolsAllow(names.map((name) => ({ name })), promptBuildToolsAllow).map((tool) => tool.name);
		params = {
			...params,
			cliToolAvailability: {
				native: filterToolNames(params.cliToolAvailability.native),
				openClaw: filterToolNames(params.cliToolAvailability.openClaw)
			}
		};
	}
	const projectedTools = params.cliToolAvailability ? applyEmbeddedAttemptToolsAllow(hookFilteredProjectedTools, params.cliToolAvailability.openClaw) : hookFilteredProjectedTools;
	const promptTools = bundleMcpEnabled ? projectedTools : [];
	const messageToolAvailable = promptTools.some((tool) => normalizeToolPolicyName(tool.name) === "message");
	const resultContentSourceByToolName = new Map(promptTools.flatMap((tool) => tool.resultContentSource ? [[tool.name, tool.resultContentSource]] : []));
	const restrictedLoopbackToolsAllow = params.cliToolAvailability?.openClaw ?? (promptBuildRestrictsTools ? projectedTools.map((tool) => tool.name) : void 0);
	const mcpGrantContext = mcpContextBase && restrictedLoopbackToolsAllow !== void 0 ? {
		...mcpContextBase,
		toolsAllow: [...restrictedLoopbackToolsAllow]
	} : mcpContextBase;
	const toolBoundExtraSystemPromptHash = params.cliToolAvailability ? hashCliSessionText(JSON.stringify([
		baseExtraSystemPromptHash ?? null,
		params.cliToolAvailability.native.toSorted(),
		params.cliToolAvailability.openClaw.toSorted()
	])) : baseExtraSystemPromptHash;
	const extraSystemPromptHash = bootstrapMode === "none" ? toolBoundExtraSystemPromptHash : hashCliSessionText(JSON.stringify([toolBoundExtraSystemPromptHash ?? null, bootstrapMode]));
	let cleanupPreparedResources;
	let preparedExecution;
	try {
		const mcpClientGrant = mcpLoopbackRuntime && mcpGrantContext ? prepareDeps.mintMcpLoopbackClientGrant({
			context: mcpGrantContext,
			runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
			admittedRunContext: params.admittedRunContext,
			...mcpToolAuth ? { toolAuth: mcpToolAuth } : {}
		}) : void 0;
		const bindMcpClientGrantAdmission = (admittedRunContext) => {
			if (mcpClientGrant && mcpLoopbackRuntime && !prepareDeps.bindMcpLoopbackClientGrantAdmission({
				token: mcpClientGrant.token,
				runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
				admittedRunContext
			})) throw new Error("CLI MCP client grant is no longer valid for this admitted run");
		};
		const mcpClientGrantCapture = mcpClientGrant && mcpLoopbackRuntime ? {
			activate: (captureKey) => {
				if (!prepareDeps.activateMcpLoopbackClientGrantCapture({
					token: mcpClientGrant.token,
					runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
					captureKey
				})) throw new Error("CLI MCP client grant is no longer valid for this Gateway runtime");
			},
			deactivate: (captureKey) => {
				prepareDeps.deactivateMcpLoopbackClientGrantCapture({
					token: mcpClientGrant.token,
					runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
					captureKey
				});
			}
		} : void 0;
		let mcpClientGrantRevoked = false;
		const cleanupMcpClientGrant = mcpClientGrant ? async () => {
			if (mcpClientGrantRevoked) return;
			mcpClientGrantRevoked = true;
			prepareDeps.revokeMcpLoopbackClientGrant(mcpClientGrant.token);
		} : void 0;
		cleanupPreparedResources = cleanupMcpClientGrant;
		const loopbackServerConfig = mcpLoopbackRuntime ? prepareDeps.createMcpLoopbackServerConfig(mcpLoopbackRuntime.port) : void 0;
		const preparedBackend = await prepareCliBundleMcpConfig({
			enabled: bundleMcpEnabled || systemAgentMcpConfig !== void 0,
			mode: backendResolved.bundleMcpMode,
			backend: backendResolved.config,
			workspaceDir,
			config: params.config,
			toolOverrides: params.toolOverrides,
			agentDir,
			...systemAgentMcpConfig ? { exclusiveConfig: systemAgentMcpConfig } : restrictedLoopbackToolsAllow && loopbackServerConfig ? { exclusiveConfig: loopbackServerConfig } : {},
			additionalConfig: restrictedLoopbackToolsAllow ? void 0 : loopbackServerConfig,
			env: mcpLoopbackRuntime && mcpClientGrant ? {
				OPENCLAW_MCP_TOKEN: mcpClientGrant.token,
				OPENCLAW_MCP_CLI_CAPTURE_KEY: ""
			} : void 0,
			warn: (message) => cliBackendLog.warn(message)
		});
		const cleanupPreparedBackend = preparedBackend.cleanup || cleanupMcpClientGrant ? async () => {
			try {
				await preparedBackend.cleanup?.();
			} finally {
				await cleanupMcpClientGrant?.();
			}
		} : void 0;
		cleanupPreparedResources = cleanupPreparedBackend;
		const prepareExecutionContext = {
			config: params.config,
			workspaceDir,
			agentDir,
			provider: params.provider,
			modelId,
			contextTokenBudget: contextWindowInfo.tokens,
			authProfileId: effectiveAuthProfileId,
			executionMode,
			toolAvailability: params.cliToolAvailability ? buildCliBackendToolAvailability(params.cliToolAvailability) : void 0,
			env: preparedBackend.env
		};
		const privatePrepareExecutionContext = params.isolatedCompletion ? {
			...prepareExecutionContext,
			isolatedCompletionCwd: cwd,
			isolatedCompletionModelId: normalizedModel,
			isolatedCompletionPrompt: params.prompt,
			isolatedCompletionSystemPrompt: params.extraSystemPrompt ?? ""
		} : prepareExecutionContext;
		try {
			preparedExecution = await backendResolved.prepareExecution?.(backendAuthPolicy ? {
				...privatePrepareExecutionContext,
				authCredential
			} : privatePrepareExecutionContext) ?? void 0;
		} catch (error) {
			if (error instanceof CliBackendAuthProfilePreparationError && effectiveAuthProfileId) throw new CliAuthProfilePreparationError({
				message: error.message,
				profileId: effectiveAuthProfileId,
				provider: authStore?.profiles[effectiveAuthProfileId]?.provider ?? params.provider,
				agentDir,
				cause: error
			});
			throw error;
		}
		const preparedBackendCleanup = cleanupPreparedBackend || preparedExecution?.cleanup ? async () => {
			try {
				await preparedExecution?.cleanup?.();
			} finally {
				await cleanupPreparedBackend?.();
			}
		} : void 0;
		cleanupPreparedResources = preparedBackendCleanup;
		if (params.isolatedCompletion && preparedExecution?.isolatedCompletionEnforced !== true) throw unsupportedIsolatedCompletionError(backendResolved.id);
		if (params.cliToolAvailability && backendResolved.toolAvailabilityEnforcement === "prepare-execution" && preparedExecution?.toolAvailabilityEnforced !== true) throw new Error(`CLI backend ${backendResolved.id} did not enforce exact per-run tool availability during execution preparation`);
		const skipLocalCredentialEpoch = shouldSkipLocalCliCredentialEpoch({
			authEpochMode: backendResolved.authEpochMode,
			authProfileId: effectiveAuthProfileId,
			authCredential,
			preparedExecution
		});
		const authEpoch = await resolveCliAuthEpoch({
			provider: params.provider,
			agentDir,
			authProfileId: effectiveAuthProfileId,
			skipLocalCredential: skipLocalCredentialEpoch
		});
		const authBindingFingerprint = params.onSuccessfulAuthBinding ? resolveCliAuthBindingFingerprint({
			provider: params.provider,
			config: params.config ?? getRuntimeConfig(),
			agentDir,
			...effectiveAuthProfileId ? { authProfileId: effectiveAuthProfileId } : {},
			...resolvedProfileAuth ? { resolvedAuth: resolvedProfileAuth } : {},
			...skipLocalCredentialEpoch ? { skipLocalCredential: true } : {}
		}) : void 0;
		const preparedBackendEnv = preparedExecution?.env && Object.keys(preparedExecution.env).length > 0 ? {
			...preparedBackend.env,
			...preparedExecution.env
		} : preparedBackend.env;
		const preparedBackendBeforeExecution = preparedBackend.beforeExecution || preparedExecution?.beforeExecution ? async () => {
			await preparedBackend.beforeExecution?.();
			await preparedExecution?.beforeExecution?.();
		} : void 0;
		const claudeSkillsPlugin = skipsTurnPreparation || nodeClaudePlacement ? {
			args: [],
			cleanup: async () => {}
		} : await prepareDeps.prepareClaudeCliSkillsPlugin({
			backendId: backendResolved.id,
			skillsSnapshot: params.skillsSnapshot
		});
		const preparedCleanup = preparedBackendCleanup || claudeSkillsPlugin.args.length > 0 ? async () => {
			try {
				await claudeSkillsPlugin.cleanup();
			} finally {
				await preparedBackendCleanup?.();
			}
		} : void 0;
		cleanupPreparedResources = preparedCleanup ?? preparedBackendCleanup;
		const preparedBackendClearEnv = [...preparedBackend.backend.clearEnv ?? [], ...preparedExecution?.clearEnv ?? []];
		const sideQuestionBackend = (() => {
			const { liveSession: _liveSession, ...backend } = preparedBackend.backend;
			return {
				...backend,
				sessionMode: "none"
			};
		})();
		const processPerTurnBackend = (() => {
			const { liveSession: _liveSession, ...backend } = preparedBackend.backend;
			return backend;
		})();
		const preparedBackendFinal = {
			...preparedBackend,
			backend: {
				...isSideQuestion ? sideQuestionBackend : params.disableCliLiveSession ? processPerTurnBackend : preparedBackend.backend,
				...preparedBackendClearEnv.length > 0 ? { clearEnv: uniqueStrings(preparedBackendClearEnv) } : {}
			},
			...preparedBackendEnv ? { env: preparedBackendEnv } : {},
			...preparedBackendBeforeExecution ? { beforeExecution: preparedBackendBeforeExecution } : {},
			...preparedExecution?.secretInput ? { secretInput: preparedExecution.secretInput } : {},
			...mcpClientGrantCapture ? { mcpClientGrantCapture } : {},
			...preparedCleanup ? { cleanup: preparedCleanup } : {}
		};
		const promptToolNamesHash = bundleMcpEnabled && mcpLoopbackRuntime ? hashCliSessionText(JSON.stringify(promptTools.map((tool) => tool.name).toSorted())) : void 0;
		const ignoreCliSessionCandidate = isSideQuestion || preparedBackendFinal.backend.sessionMode === "none";
		const controlOperationCliSessionId = isControlOperation ? params.cliSessionBinding?.sessionId.trim() || params.cliSessionId?.trim() : void 0;
		const reusableCliSessionCandidate = ignoreCliSessionCandidate ? { mode: "none" } : controlOperationCliSessionId ? {
			mode: "reuse",
			sessionId: controlOperationCliSessionId
		} : params.cliSessionBinding ? resolveCliSessionReuse({
			binding: params.cliSessionBinding,
			authProfileId: effectiveAuthProfileId,
			authEpoch,
			authEpochVersion: 7,
			extraSystemPromptHash,
			messageToolPolicyHash,
			promptToolNamesHash,
			cwdHash,
			mcpConfigHash: preparedBackendFinal.mcpConfigHash,
			mcpResumeHash: preparedBackendFinal.mcpResumeHash
		}) : params.cliSessionId ? {
			mode: "reuse",
			sessionId: params.cliSessionId
		} : { mode: "none" };
		const backendReusableCliSession = reusableCliSessionCandidate.mode === "reuse-with-drift" && !canTransportSystemPrompt(preparedBackendFinal.backend) ? {
			mode: "invalidate",
			invalidatedReason: "system-prompt"
		} : reusableCliSessionCandidate;
		const candidateClaudeCliSessionId = resolveReusableCliSessionId(backendReusableCliSession)?.trim() || void 0;
		const hasClaudeCliCandidate = !isControlOperation && !nodeClaudePlacement && candidateClaudeCliSessionId !== void 0 && isClaudeCliBackendId(params.provider);
		const claudeCliTranscriptMissing = hasClaudeCliCandidate && !await prepareDeps.claudeCliSessionTranscriptHasContent({
			sessionId: candidateClaudeCliSessionId,
			workspaceDir: cwd
		});
		const managedClaudeLiveSessionGeneration = claudeCliTranscriptMissing && backendResolved.id === "claude-cli" && "liveSession" in preparedBackendFinal.backend && preparedBackendFinal.backend.liveSession === "claude-stdio" && preparedBackendFinal.backend.output === "jsonl" && preparedBackendFinal.backend.input === "stdin" && prepareDeps.getClaudeGeneration({
			backendId: backendResolved.id,
			agentAccountId: params.agentAccountId,
			agentId: workspaceResolution.agentId,
			authProfileId: effectiveAuthProfileId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
		const hasManagedClaudeLiveSession = Boolean(managedClaudeLiveSessionGeneration);
		const claudeCliTranscriptOrphanedToolUse = hasClaudeCliCandidate && !claudeCliTranscriptMissing && await prepareDeps.claudeCliSessionTranscriptHasOrphanedToolUse({
			sessionId: candidateClaudeCliSessionId,
			workspaceDir: cwd
		});
		const claudeCliInvalidatedReason = claudeCliTranscriptMissing && !hasManagedClaudeLiveSession ? "missing-transcript" : claudeCliTranscriptOrphanedToolUse ? "orphaned-tool-use" : void 0;
		const reusableCliSession = claudeCliInvalidatedReason ? {
			mode: "invalidate",
			invalidatedReason: claudeCliInvalidatedReason
		} : backendReusableCliSession;
		const reusableCliSessionId = resolveReusableCliSessionId(reusableCliSession);
		const invalidatedReason = resolveCliSessionInvalidatedReason(reusableCliSession);
		if (invalidatedReason) cliBackendLog.info(`cli session reset: provider=${params.provider} reason=${invalidatedReason}`);
		const heartbeatPrompt = skipsTurnPreparation ? void 0 : resolveHeartbeatPromptForSystemPrompt({
			config: params.config,
			agentId: sessionAgentId,
			defaultAgentId
		});
		const openClawReferences = skipsTurnPreparation ? {
			docsPath: null,
			sourcePath: null
		} : await prepareDeps.resolveOpenClawReferencePaths({
			workspaceDir,
			argv1: process.argv[1],
			cwd,
			moduleUrl: import.meta.url
		});
		const systemPromptSkillsPrompt = skipsTurnPreparation || nodeClaudePlacement || claudeSkillsPlugin.args.length > 0 ? "" : await resolveCliSkillsPrompt({
			skillsSnapshot: params.skillsSnapshot,
			workspaceDir,
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey?.trim() || params.sessionId
		});
		const runtimeChannel = skipsTurnPreparation ? void 0 : normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
		const runtimeCapabilities = skipsTurnPreparation ? void 0 : collectRuntimeChannelCapabilities({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		});
		const builtSystemPrompt = isControlOperation ? "" : isSideQuestion ? extraSystemPrompt : buildCliAgentSystemPrompt({
			workspaceDir,
			cwd,
			config: params.config,
			defaultThinkLevel: params.thinkLevel,
			extraSystemPrompt,
			sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
			requireExplicitMessageTarget: bindingRequireExplicitMessageTarget,
			silentReplyPromptMode: params.silentReplyPromptMode,
			runtimeChannel,
			runtimeChatType,
			runtimeCapabilities,
			ownerNumbers: params.ownerNumbers,
			heartbeatPrompt,
			docsPath: openClawReferences.docsPath ?? void 0,
			sourcePath: openClawReferences.sourcePath ?? void 0,
			skillsPrompt: systemPromptSkillsPrompt,
			tools: promptTools,
			contextFiles,
			bootstrapMode,
			modelDisplay,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		let systemPrompt = !skipsTurnPreparation ? backendResolved.transformSystemPrompt?.({
			config: params.config,
			workspaceDir,
			provider: params.provider,
			modelId,
			modelDisplay,
			agentId: sessionAgentId,
			systemPrompt: builtSystemPrompt
		}) ?? builtSystemPrompt : builtSystemPrompt;
		const finalizedTranscriptPrompt = params.finalizePromptForResolvedTools && params.transcriptPrompt === void 0 ? params.prompt : params.transcriptPrompt;
		let preparedPrompt = isControlOperation ? params.prompt : params.finalizePromptForResolvedTools?.({
			prompt: params.prompt,
			messageToolAvailable
		}) ?? params.prompt;
		if (!skipsTurnPreparation) try {
			const hookResult = promptBuildHookResult;
			if (hookResult?.prependContext) preparedPrompt = `${hookResult.prependContext}\n\n${preparedPrompt}`;
			if (hookResult?.appendContext) preparedPrompt = `${preparedPrompt}\n\n${hookResult.appendContext}`;
			const hookSystemPrompt = hookResult?.systemPrompt?.trim();
			if (hookSystemPrompt) systemPrompt = hookSystemPrompt;
			systemPrompt = composeSystemPromptWithHookContext({
				baseSystemPrompt: systemPrompt,
				prependSystemContext: hookResult?.prependSystemContext,
				appendSystemContext: hookResult?.appendSystemContext
			}) ?? systemPrompt;
			const mediaTaskSystemPromptAddition = resolveAttemptMediaTaskSystemPromptAddition({
				sessionKey: params.sessionKey,
				agentId: sessionAgentId,
				trigger: params.trigger
			});
			if (mediaTaskSystemPromptAddition) systemPrompt = prependSystemPromptAddition({
				systemPrompt: ensureSystemPromptCacheBoundary(systemPrompt),
				systemPromptAddition: mediaTaskSystemPromptAddition
			});
		} catch (error) {
			cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
		}
		let historyPromptCurrentTurn = preparedPrompt;
		if (!skipsTurnPreparation) {
			const currentInboundContext = prependCliSessionDriftUserContext(params.currentInboundContext, reusableCliSession);
			const fullCurrentInboundPrompt = buildCurrentInboundPrompt({
				context: currentInboundContext,
				prompt: preparedPrompt
			});
			const runCurrentInboundPrompt = buildCurrentInboundPrompt({
				context: currentInboundContext,
				prompt: preparedPrompt,
				preferResumableText: params.currentInboundEventKind === "room_event" && Boolean(reusableCliSessionId)
			});
			historyPromptCurrentTurn = annotateInterSessionPromptText(fullCurrentInboundPrompt, params.inputProvenance);
			preparedPrompt = annotateInterSessionPromptText(runCurrentInboundPrompt, params.inputProvenance);
		}
		const allowRawTranscriptReseed = backendResolved.config.reseedFromRawTranscriptWhenUncompacted === true;
		const rawTranscriptReseedReason = reusableCliSessionId ? "session-expired" : invalidatedReason;
		const openClawHistoryPrompt = !skipsTurnPreparation && (!reusableCliSessionId || allowRawTranscriptReseed) ? buildCliSessionHistoryPrompt({
			messages: await loadCliSessionReseedMessages({
				sessionId: params.sessionId,
				sessionFile: params.sessionFile,
				sessionKey: params.sessionKey,
				agentId: sessionAgentId,
				config: params.config,
				allowRawTranscriptReseed,
				rawTranscriptReseedReason
			}),
			prompt: historyPromptCurrentTurn,
			maxHistoryChars: autoReseedHistoryChars
		}) : void 0;
		const systemPromptWithReplacements = skipsTurnPreparation ? systemPrompt : applyPluginTextReplacements(systemPrompt, backendResolved.textTransforms?.input);
		systemPrompt = skipsTurnPreparation ? systemPromptWithReplacements : appendModelIdentitySystemPrompt({
			systemPrompt: buildModelIdentityPromptLine(modelDisplay) && systemPromptWithReplacements.trim().length > 0 ? ensureSystemPromptCacheBoundary(systemPromptWithReplacements) : systemPromptWithReplacements,
			model: modelDisplay
		});
		const systemPromptReport = buildSystemPromptReport({
			source: "run",
			generatedAt: Date.now(),
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			provider: params.provider,
			model: modelId,
			workspaceDir,
			bootstrapMaxChars,
			bootstrapTotalMaxChars,
			bootstrapTruncation: buildBootstrapTruncationReportMeta({
				analysis: bootstrapAnalysis,
				warningMode: bootstrapPromptWarningMode,
				warning: bootstrapPromptWarning
			}),
			sandbox: {
				mode: "off",
				sandboxed: false
			},
			systemPrompt,
			bootstrapFiles: bootstrapFilesForInjectionStats,
			injectedFiles: contextFiles,
			skillsPrompt: systemPromptSkillsPrompt,
			tools: promptTools,
			currentTurn: {
				...params.currentInboundEventKind ? { kind: params.currentInboundEventKind } : {},
				promptChars: preparedPrompt.length,
				runtimeContextChars: 0
			}
		});
		const contextEngineConfig = params.config ?? getRuntimeConfig();
		if (skipsTurnPreparation) {
			const preparedParams = await admitPreparedParams({
				...params,
				config: contextEngineConfig,
				prompt: preparedPrompt,
				transcriptPrompt: finalizedTranscriptPrompt,
				...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
			});
			bindMcpClientGrantAdmission(preparedParams.admittedRunContext);
			return {
				params: preparedParams,
				effectiveAuthProfileId,
				...authStore ? { authProfileStore: authStore } : {},
				agentDir,
				started,
				workspaceDir,
				cwd,
				backendResolved,
				preparedBackend: preparedBackendFinal,
				reusableCliSession,
				hadSessionFile: false,
				contextEngineConfig,
				modelId,
				normalizedModel,
				contextWindowInfo,
				systemPrompt,
				systemPromptReport,
				claudeSkillsPluginArgs: claudeSkillsPlugin.args,
				bootstrapPromptWarningLines: bootstrapPromptWarning.lines,
				authEpoch,
				authBindingFingerprint,
				...skipLocalCredentialEpoch ? { authBindingSkipsLocalCredential: true } : {},
				authEpochVersion: 7,
				extraSystemPromptHash,
				messageToolPolicyHash,
				promptToolNamesHash,
				...resultContentSourceByToolName.size > 0 ? { resultContentSourceByToolName } : {},
				cwdHash,
				...mcpDeliveryCaptureEnabled ? { mcpDeliveryCapture: true } : {}
			};
		}
		ensureContextEnginesInitialized();
		const { sessionAgentId: contextEngineSessionAgentId } = resolveSessionAgentIds({
			sessionKey: params.sessionKey,
			config: contextEngineConfig,
			agentId: sessionAgentId
		});
		const contextEngineAgentDir = resolveAgentDir(contextEngineConfig, contextEngineSessionAgentId);
		const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({
			backendId: backendResolved.id,
			capabilities: backendResolved.contextEngineHostCapabilities
		});
		let resolvedContextEngine;
		if (params.contextEngineLogicalTurnLease) {
			selectContextEngineForTranscriptHost({
				lease: params.contextEngineLogicalTurnLease,
				host: contextEngineHostSupport,
				operation: "agent-run",
				recorder: params.userTurnTranscriptRecorder
			});
			await drainPendingContextEngineTurnsBeforeRun({
				admission: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
				isHeartbeat: isHeartbeatLifecycleRunKind(params.bootstrapContextRunKind),
				lease: params.contextEngineLogicalTurnLease,
				recorder: params.userTurnTranscriptRecorder,
				sessionTarget: params.sessionTarget
			});
			resolvedContextEngine = params.contextEngineLogicalTurnLease.begin().engine;
		} else resolvedContextEngine = await resolveContextEngine(contextEngineConfig, {
			agentDir: contextEngineAgentDir,
			workspaceDir
		});
		const contextEngine = resolvedContextEngine.info.id !== "legacy" ? resolvedContextEngine : void 0;
		if (contextEngine) assertContextEngineHostSupport({
			contextEngine,
			operation: "agent-run",
			host: contextEngineHostSupport
		});
		const hadSessionFile = await hasCliSessionTranscript({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: sessionAgentId,
			config: contextEngineConfig
		});
		const contextEngineTurnPrompt = params.transcriptPrompt ?? params.prompt;
		const preparedParams = await admitPreparedParams({
			...params,
			config: contextEngineConfig,
			prompt: preparedPrompt,
			transcriptPrompt: finalizedTranscriptPrompt,
			...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
		});
		bindMcpClientGrantAdmission(preparedParams.admittedRunContext);
		return {
			params: preparedParams,
			effectiveAuthProfileId,
			...authStore ? { authProfileStore: authStore } : {},
			agentDir,
			started,
			workspaceDir,
			cwd,
			backendResolved,
			preparedBackend: preparedBackendFinal,
			reusableCliSession,
			...managedClaudeLiveSessionGeneration ? { requiredClaudeLiveSessionGeneration: managedClaudeLiveSessionGeneration } : {},
			hadSessionFile,
			contextEngineConfig,
			contextEngine,
			contextEngineTurnPrompt,
			modelId,
			normalizedModel,
			contextWindowInfo,
			systemPrompt,
			systemPromptReport,
			claudeSkillsPluginArgs: claudeSkillsPlugin.args,
			bootstrapPromptWarningLines: bootstrapPromptWarning.lines,
			...openClawHistoryPrompt ? { openClawHistoryPrompt } : {},
			heartbeatPrompt,
			authEpoch,
			authBindingFingerprint,
			...skipLocalCredentialEpoch ? { authBindingSkipsLocalCredential: true } : {},
			authEpochVersion: 7,
			extraSystemPromptHash,
			messageToolPolicyHash,
			promptToolNamesHash,
			...resultContentSourceByToolName.size > 0 ? { resultContentSourceByToolName } : {},
			cwdHash,
			...mcpDeliveryCaptureEnabled ? { mcpDeliveryCapture: true } : {}
		};
	} catch (err) {
		try {
			await cleanupPreparedResources?.();
		} catch (cleanupErr) {
			cliBackendLog.warn(`cli backend cleanup after prepare failure failed: ${String(cleanupErr)}`);
		}
		throw err;
	}
}
//#endregion
export { prepareCliRunContext as t };
