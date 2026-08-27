import { g as resolveSessionAgentIds } from "./agent-scope-BizOtGGz.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import { s as listRegisteredPluginAgentPromptGuidance } from "./command-registration-df_ISQhO.js";
import "./model-selection-Dg63KcCa.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DwfYu5UM.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-B4_z8STG.js";
import { a as resolveBootstrapContextForRun } from "./bootstrap-files-DQdZlI4U.js";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-T79q0Len.js";
import { i as resolveEmbeddedRunSkillEntries, r as resolveSandboxSkillRuntimeInputs, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-DLLM_u-l.js";
import { t as ensureSandboxWorkspaceForSession } from "./context-BIHB56yZ.js";
import "./sandbox-DncyGHry.js";
import { o as resolveAgentPromptSurfaceForSessionKey, r as buildConfiguredAgentSystemPrompt, t as buildSystemPromptParams } from "./system-prompt-params-BHFU-PU8.js";
import { t as createOpenClawCodingTools } from "./agent-tools-BeDms87H.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-Gq_oJjpM.js";
import { n as resolveEmbeddedFullAccessState } from "./sandbox-info-UTvcrCq6.js";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-Bwb6VI0I.js";
import { t as getRemoteSkillEligibility } from "./remote-RL6whgVY.js";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-D2gy4xF5.js";
//#region src/auto-reply/reply/commands-system-prompt.ts
function resolveCommandSkillsEligibility(params) {
	try {
		const nodeSkills = resolveNodeExecEligibility({
			cfg: params.config,
			sessionEntry: params.sessionEntry,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
		return {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		};
	} catch {
		try {
			return {
				nodeSkills: { canExec: false },
				remote: getRemoteSkillEligibility({ advertiseExecNode: false })
			};
		} catch {
			return { nodeSkills: { canExec: false } };
		}
	}
}
async function resolveCommandSkillsPrompt(params) {
	if (params.sandboxed) try {
		const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
			config: params.config,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		});
		if (!sandboxWorkspace) return "";
		if (sandboxWorkspace.containerWorkdir) {
			const { skillsEligibility, skillsPromptWorkspaceDir, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir, workspaceOnly } = resolveSandboxSkillRuntimeInputs({
				sandbox: {
					enabled: true,
					containerWorkdir: sandboxWorkspace.containerWorkdir,
					...sandboxWorkspace.skillsEligibility ? { skillsEligibility: sandboxWorkspace.skillsEligibility } : {},
					...sandboxWorkspace.skillsWorkspaceDir ? { skillsWorkspaceDir: sandboxWorkspace.skillsWorkspaceDir } : {},
					...sandboxWorkspace.workspaceAccess ? { workspaceAccess: sandboxWorkspace.workspaceAccess } : {}
				},
				effectiveWorkspace: sandboxWorkspace.workspaceDir
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
				config: params.config,
				workspaceDir: skillsPromptWorkspaceDir,
				agentId: params.agentId,
				eligibility: skillsEligibility
			});
		}
	} catch {
		return "";
	}
	try {
		return resolveReusableWorkspaceSkillSnapshot({
			workspaceDir: params.workspaceDir,
			config: params.config,
			agentId: params.agentId,
			eligibility: params.eligibility,
			watch: false
		}).snapshot.prompt ?? "";
	} catch {
		return "";
	}
}
async function resolveCommandsSystemPromptBundle(params) {
	const workspaceDir = params.workspaceDir;
	const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.cfg,
		agentId: params.agentId
	});
	const { bootstrapFiles, contextFiles: injectedFiles } = await resolveBootstrapContextForRun({
		workspaceDir,
		config: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: targetSessionEntry?.sessionId,
		chatType: targetSessionEntry?.chatType,
		agentId: sessionAgentId
	});
	const toolPolicySessionKey = resolveRuntimePolicySessionKey({
		agentId: sessionAgentId,
		cfg: params.cfg,
		ctx: params.ctx,
		sessionKey: params.sessionKey
	});
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: toolPolicySessionKey
	});
	const skillsEligibility = resolveCommandSkillsEligibility({
		agentId: sessionAgentId,
		config: params.cfg,
		sessionEntry: targetSessionEntry,
		sessionKey: params.sessionKey
	});
	const skillsPrompt = await resolveCommandSkillsPrompt({
		agentId: sessionAgentId,
		config: params.cfg,
		eligibility: skillsEligibility,
		sandboxed: sandboxRuntime.sandboxed,
		sessionKey: toolPolicySessionKey,
		workspaceDir
	});
	const tools = (() => {
		try {
			return createOpenClawCodingTools({
				config: params.cfg,
				agentId: sessionAgentId,
				workspaceDir,
				sessionKey: toolPolicySessionKey,
				allowGatewaySubagentBinding: true,
				messageProvider: params.command.channel,
				groupId: targetSessionEntry?.groupId ?? void 0,
				groupChannel: targetSessionEntry?.groupChannel ?? void 0,
				groupSpace: targetSessionEntry?.space ?? void 0,
				spawnedBy: targetSessionEntry?.spawnedBy ?? void 0,
				senderId: params.command.senderId,
				senderName: params.ctx.SenderName,
				senderUsername: params.ctx.SenderUsername,
				senderE164: params.ctx.SenderE164,
				modelProvider: params.provider,
				modelId: params.model
			});
		} catch {
			return [];
		}
	})();
	const toolNames = tools.map((t) => t.name);
	const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
	const defaultModelRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: sessionAgentId
	});
	const defaultModelLabel = `${defaultModelRef.provider}/${defaultModelRef.model}`;
	const { runtimeInfo, userTimezone, userDate } = buildSystemPromptParams({
		config: params.cfg,
		agentId: sessionAgentId,
		workspaceDir,
		cwd: process.cwd(),
		runtime: {
			sessionKey: params.sessionKey,
			sessionId: targetSessionEntry?.sessionId,
			host: "unknown",
			os: "unknown",
			arch: "unknown",
			node: process.version,
			model: `${params.provider}/${params.model}`,
			defaultModel: defaultModelLabel
		}
	});
	const fullAccessState = resolveEmbeddedFullAccessState({ execElevated: {
		enabled: params.elevated.enabled,
		allowed: params.elevated.allowed,
		defaultLevel: params.resolvedElevatedLevel ?? "off"
	} });
	const sandboxInfo = sandboxRuntime.sandboxed ? {
		enabled: true,
		workspaceDir,
		workspaceAccess: "rw",
		elevated: {
			allowed: params.elevated.allowed,
			defaultLevel: params.resolvedElevatedLevel ?? "off",
			fullAccessAvailable: fullAccessState.available,
			...fullAccessState.blockedReason ? { fullAccessBlockedReason: fullAccessState.blockedReason } : {}
		}
	} : { enabled: false };
	return {
		systemPrompt: buildConfiguredAgentSystemPrompt({
			config: params.cfg,
			agentId: sessionAgentId,
			workspaceDir,
			defaultThinkLevel: params.resolvedThinkLevel,
			reasoningLevel: params.resolvedReasoningLevel,
			extraSystemPrompt: void 0,
			ownerNumbers: void 0,
			reasoningTagHint: false,
			toolNames,
			userTimezone,
			userDate,
			contextFiles: injectedFiles,
			skillsPrompt,
			heartbeatPrompt: void 0,
			acpEnabled: isAcpRuntimeSpawnAvailable({
				config: params.cfg,
				sandboxed: sandboxRuntime.sandboxed
			}),
			promptSurface,
			nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({ surface: promptSurface }),
			runtimeInfo,
			sandboxInfo
		}),
		tools,
		skillsPrompt,
		bootstrapFiles,
		injectedFiles,
		sandboxRuntime
	};
}
//#endregion
export { resolveCommandsSystemPromptBundle as t };
