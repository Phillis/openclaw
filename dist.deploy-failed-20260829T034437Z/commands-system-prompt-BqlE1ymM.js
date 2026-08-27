import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Du1KAbLA.js";
import { s as listRegisteredPluginAgentPromptGuidance } from "./command-registration-BnBmJsy8.js";
import "./model-selection-DHDS-v4K.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Jg1T3gN6.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DYnHXuqN.js";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn } from "./bootstrap-files-DFqvwZvt.js";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-C2Ss9aIo.js";
import { a as resolveEmbeddedRunSkillEntries, i as resolveSandboxSkillRuntimeInputs, n as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-CMx-PlBQ.js";
import { t as ensureSandboxWorkspaceForSession } from "./context-kK2b0dAi.js";
import "./sandbox-BUq3Yn9r.js";
import { o as resolveAgentPromptSurfaceForSessionKey, r as buildConfiguredAgentSystemPrompt, t as buildSystemPromptParams } from "./system-prompt-params-Jl5q1r24.js";
import { t as createOpenClawCodingTools } from "./agent-tools-yjKtLF9x.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-LNnaxz9o.js";
import { n as resolveEmbeddedFullAccessState } from "./sandbox-info-DOFVDZGU.js";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-D0wgiqgu.js";
import { t as getRemoteSkillEligibility } from "./remote-8jZL04gz.js";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-YllFgfu6.js";
//#region src/auto-reply/reply/commands-system-prompt.ts
const log = createSubsystemLogger("auto-reply/commands-system-prompt");
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
				skillsAnchorWorkspace: sandboxWorkspace.workspaceDir
			});
			const { shouldLoadSkillEntries, skillEntries, preserveEntryOrder } = resolveEmbeddedRunSkillEntries({
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
				eligibility: skillsEligibility,
				preserveEntryOrder
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
		agentId: sessionAgentId,
		warn: makeBootstrapWarn({
			sessionLabel: params.sessionKey,
			workspaceDir,
			warn: (message) => log.warn(message)
		})
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
