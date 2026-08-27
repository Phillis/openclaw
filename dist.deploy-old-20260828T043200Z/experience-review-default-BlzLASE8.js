import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { h as registerAgentRunContext, i as clearAgentRunContext } from "./agent-run-registry-t4kvUyNQ.js";
import "./config-B2bSneS2.js";
import { _ as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CTDt7IQ1.js";
import "./sessions-PHTfe5gZ.js";
import { t as SessionManager } from "./session-manager-NHyzKWb5.js";
import { r as runOutsidePreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-o4umnoSw.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { o as prepareSystemAgentRunAdmission } from "./admitted-run-context-KQIZywud.js";
import { i as runWithCronCreatorAuthorityCapability, r as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-hXifa_42.js";
import { n as getCanonicalSkillWorkspace, t as applyAutonomousSkillProposal } from "./autonomous-apply-ByotIeJv.js";
import { a as recordSkillExperienceReviewOutcome } from "./collection-review-state-B1qe-PAk.js";
import { n as resolveAgentRunSessionTarget } from "./run-session-target-BKjjwJy1.js";
import { n as countSkillModelIterations, r as selectCurrentSkillTurnMessages, t as buildSkillExperienceReviewPrompt } from "./experience-review-prompt-vtt3_1Uv.js";
import { randomUUID } from "node:crypto";
//#region src/skills/workshop/experience-review.ts
const EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS = 10;
const EXPERIENCE_REVIEW_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_RETRY_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_TIMEOUT_MS = 12e4;
const EXPERIENCE_REVIEW_MAX_PENDING = 32;
const EXPERIENCE_REVIEW_BLOCKED_TRIGGERS = /* @__PURE__ */ new Set([
	"cron",
	"heartbeat",
	"memory",
	"overflow"
]);
const EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS = /* @__PURE__ */ new Set([
	"cron",
	"hook",
	"subagent",
	"skill-workshop-review"
]);
const log = createSubsystemLogger("skills/workshop");
function isEligibleContext(ctx) {
	if (ctx.compacted === true || ctx.skillWorkshopAvailable !== true || !ctx.modelProviderId?.trim() || !ctx.modelId?.trim()) return false;
	const trigger = ctx.foregroundPromptContext.trigger?.trim().toLowerCase();
	if (trigger && EXPERIENCE_REVIEW_BLOCKED_TRIGGERS.has(trigger)) return false;
	const sessionKey = ctx.sessionKey?.trim().toLowerCase();
	if (!sessionKey || sessionKey.includes("active-memory")) return false;
	return !sessionKey.split(":").some((segment) => EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS.has(segment));
}
async function prepareSkillExperienceReviewCandidate(candidate, config) {
	if (resolveSkillWorkshopConfig(config).autonomous.mode === "off") return;
	const { resolveConversationCapabilityProfile } = await import("./agents/conversation-capability-profile.js");
	const { resolveSandboxRuntimeStatus } = await import("./sandbox-BaVplvRT.js");
	const { isToolAllowedByPolicies } = await import("./tool-policy-match-Bd97if7I.js");
	const { mergeAlsoAllowPolicy } = await import("./tool-policy-BV0sQF0Y.js");
	const foreground = candidate.ctx.foregroundPromptContext;
	const sessionKey = candidate.ctx.sessionKey;
	if (!sessionKey || resolveSandboxRuntimeStatus({
		cfg: config,
		sessionKey
	}).sandboxed) return;
	const capabilityProfile = resolveConversationCapabilityProfile({
		config,
		sessionKey,
		sandboxSessionKey: sessionKey,
		agentId: foreground.agentId,
		agentAccountId: foreground.agentAccountId,
		messageProvider: foreground.messageProvider,
		messageChannel: foreground.messageChannel,
		chatType: foreground.chatType,
		groupId: foreground.groupId,
		groupChannel: foreground.groupChannel,
		groupSpace: foreground.groupSpace,
		memberRoleIds: foreground.memberRoleIds,
		spawnedBy: foreground.spawnedBy,
		senderId: foreground.senderId,
		senderName: foreground.senderName,
		senderUsername: foreground.senderUsername,
		senderE164: foreground.senderE164,
		senderIsOwner: foreground.senderIsOwner,
		modelProvider: candidate.ctx.modelProviderId,
		modelId: candidate.ctx.modelId,
		workspaceDir: candidate.ctx.workspaceDir
	});
	if (!isToolAllowedByPolicies("skill_workshop", [
		mergeAlsoAllowPolicy(capabilityProfile.policy.profilePolicy, capabilityProfile.policy.profileAlsoAllow),
		mergeAlsoAllowPolicy(capabilityProfile.policy.providerProfilePolicy, capabilityProfile.policy.providerProfileAlsoAllow),
		capabilityProfile.policy.globalPolicy,
		capabilityProfile.policy.globalProviderPolicy,
		capabilityProfile.policy.agentPolicy,
		capabilityProfile.policy.agentProviderPolicy,
		capabilityProfile.policy.groupPolicy,
		capabilityProfile.policy.senderPolicy,
		capabilityProfile.policy.subagentPolicy,
		capabilityProfile.policy.inheritedToolPolicy
	])) return;
	return {
		...candidate,
		config
	};
}
function createSkillExperienceReviewScheduler(deps) {
	const pendingBySession = /* @__PURE__ */ new Map();
	let reviewInFlight = false;
	const setTimer = deps.setTimer ?? ((callback, delayMs) => setTimeout(callback, delayMs));
	const clearTimer = deps.clearTimer ?? clearTimeout;
	const arm = (sessionKey, pending, delayMs) => {
		if (pending.timer) clearTimer(pending.timer);
		const generation = ++pending.generation;
		const timerCallback = () => {
			if (pendingBySession.get(sessionKey) !== pending || pending.generation !== generation) return;
			pending.timer = void 0;
			Promise.resolve(deps.isSystemActive()).then(async (active) => {
				if (pendingBySession.get(sessionKey) !== pending || pending.generation !== generation) return;
				if (active) {
					arm(sessionKey, pending, EXPERIENCE_REVIEW_RETRY_IDLE_MS);
					return;
				}
				if (reviewInFlight) {
					arm(sessionKey, pending, EXPERIENCE_REVIEW_RETRY_IDLE_MS);
					return;
				}
				reviewInFlight = true;
				try {
					const candidate = deps.prepareReview ? await deps.prepareReview(pending.candidate) : pending.candidate;
					if (!candidate) {
						pendingBySession.delete(sessionKey);
						return;
					}
					if (pendingBySession.get(sessionKey) !== pending || pending.generation !== generation) return;
					await deps.runReview(candidate);
					if (pendingBySession.get(sessionKey) === pending && pending.generation === generation) pendingBySession.delete(sessionKey);
				} finally {
					reviewInFlight = false;
				}
			}).catch((error) => {
				log.warn(`skill experience review failed: ${String(error)}`);
				if (pendingBySession.get(sessionKey) === pending && pending.generation === generation) pendingBySession.delete(sessionKey);
			});
		};
		const timer = runOutsidePreparedModelRuntimePluginGenerationScope(() => setTimer(timerCallback, delayMs));
		pending.timer = timer;
		timer.unref?.();
	};
	return {
		schedule(params) {
			const sessionKey = params.ctx.sessionKey?.trim();
			if (!sessionKey) return;
			const existing = pendingBySession.get(sessionKey);
			const errored = typeof params.event.error === "string" && params.event.error.trim() !== "";
			if (existing && errored && params.ctx.runId?.trim() && params.ctx.runId === existing.candidate.ctx.runId) {
				if (existing.timer) clearTimer(existing.timer);
				pendingBySession.delete(sessionKey);
				return;
			}
			if (existing) arm(sessionKey, existing, EXPERIENCE_REVIEW_IDLE_MS);
			if (errored) {
				log.debug(`experience review skipped: reason=errored-completion session=${sessionKey}`);
				return;
			}
			if (resolveSkillWorkshopConfig(params.config).autonomous.mode === "off") return;
			if (!isEligibleContext(params.ctx)) {
				log.debug(`experience review skipped: reason=ineligible-context session=${sessionKey}`);
				return;
			}
			const workspaceDir = getCanonicalSkillWorkspace() ?? params.ctx.workspaceDir?.trim();
			if (!workspaceDir) {
				log.debug(`experience review skipped: reason=missing-workspace session=${sessionKey}`);
				return;
			}
			const turnMessages = selectCurrentSkillTurnMessages(params.event.messages);
			const reportedModelIterations = params.ctx.modelIterations;
			const modelIterations = reportedModelIterations === void 0 ? countSkillModelIterations(turnMessages) : Number.isSafeInteger(reportedModelIterations) && reportedModelIterations >= 0 ? reportedModelIterations : 0;
			if (modelIterations < EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS) {
				log.debug(`experience review skipped: reason=below-depth-bar iterations=${modelIterations} session=${sessionKey}`);
				return;
			}
			{
				if (!existing && pendingBySession.size >= EXPERIENCE_REVIEW_MAX_PENDING) {
					const oldest = pendingBySession.entries().next().value;
					if (oldest) {
						if (oldest[1].timer) clearTimer(oldest[1].timer);
						pendingBySession.delete(oldest[0]);
					}
				}
				const candidate = {
					ctx: {
						agentId: params.ctx.agentId,
						runId: params.ctx.runId,
						sessionKey,
						sessionId: params.ctx.sessionId,
						workspaceDir,
						modelProviderId: params.ctx.modelProviderId,
						modelId: params.ctx.modelId,
						modelContextWindowTokens: params.ctx.modelContextWindowTokens,
						authProfileId: params.ctx.authProfileId,
						skillWorkshopAvailable: params.ctx.skillWorkshopAvailable,
						compacted: params.ctx.compacted,
						foregroundPromptContext: params.ctx.foregroundPromptContext
					},
					...params.config ? { config: params.config } : {},
					usedSkills: params.usedSkills ? [...params.usedSkills] : void 0,
					turnAborted: !params.event.success
				};
				const pending = existing ?? {
					candidate,
					generation: 0
				};
				pending.candidate = candidate;
				pendingBySession.set(sessionKey, pending);
				arm(sessionKey, pending, EXPERIENCE_REVIEW_IDLE_MS);
				log.debug(`experience review scheduled: session=${sessionKey} iterations=${modelIterations} aborted=${!params.event.success}`);
			}
		},
		clear() {
			for (const pending of pendingBySession.values()) if (pending.timer) clearTimer(pending.timer);
			pendingBySession.clear();
		}
	};
}
async function runSkillExperienceReview(candidate, deps = {}) {
	await runWithGatewayIndependentRootWorkAdmission(() => runSkillExperienceReviewInner(candidate, deps));
}
async function runSkillExperienceReviewInner(candidate, deps) {
	const foregroundPromptContext = candidate.ctx.foregroundPromptContext;
	const workspaceDir = getCanonicalSkillWorkspace() ?? candidate.ctx.workspaceDir;
	const sessionKey = candidate.ctx.sessionKey;
	const sessionId = candidate.ctx.sessionId;
	const modelProviderId = candidate.ctx.modelProviderId?.trim();
	const modelId = candidate.ctx.modelId?.trim();
	if (!workspaceDir || !sessionKey || !sessionId || !modelProviderId || !modelId) return;
	const runId = `skill-workshop-review:${randomUUID()}`;
	const origin = foregroundPromptContext.cronCreatorCallerOrigin;
	const capability = origin ? createCronCreatorAuthorityCapability(runId, origin) : void 0;
	const config = candidate.config ?? getRuntimeConfig();
	const proposalMutationBudget = {
		remaining: 1,
		readSkillHashes: /* @__PURE__ */ new Map()
	};
	const sessionTarget = await resolveAgentRunSessionTarget({
		agentId: foregroundPromptContext.agentId,
		config,
		sessionId,
		sessionKey,
		missingSessionKey: "resolve-existing"
	});
	const foregroundSession = SessionManager.open(sessionTarget, workspaceDir);
	const detachedSession = SessionManager.fromEntries(foregroundSession.getEntries(), workspaceDir);
	const { listWritableWorkspaceSkillSummaries } = await import("./workspace-skill-read-C0wIu8jW.js");
	const existingSkills = listWritableWorkspaceSkillSummaries(workspaceDir, {
		config,
		agentId: foregroundPromptContext.agentId
	});
	const { runEmbeddedAgent } = await import("./embedded-agent-DjHmTlnD.js");
	const preparedRunAdmission = prepareSystemAgentRunAdmission(config, runId, foregroundPromptContext.agentId, "skill-workshop.experience");
	const attemptedAtMs = Date.now();
	let outcome;
	let proposalId;
	let usage;
	registerAgentRunContext(runId, {
		agentId: foregroundPromptContext.agentId,
		sessionId,
		sessionKey,
		isControlUiVisible: false,
		projectSessionActive: false,
		projectSessionLifecycle: false,
		projectSessionMessages: false
	});
	try {
		let embeddedResult;
		try {
			const run = () => runEmbeddedAgent({
				...foregroundPromptContext,
				preparedRunAdmission,
				sessionId,
				sessionKey,
				sessionTarget,
				sessionManager: detachedSession,
				sessionPersistence: "detached",
				lane: "skill-workshop-review",
				agentHarnessId: "openclaw",
				agentHarnessRuntimeOverride: "openclaw",
				workspaceDir,
				config,
				prompt: buildSkillExperienceReviewPrompt({
					...candidate,
					existingSkills
				}),
				provider: modelProviderId,
				model: modelId,
				modelSelectionLocked: true,
				modelFallbacksOverride: [],
				...candidate.ctx.authProfileId ? {
					authProfileId: candidate.ctx.authProfileId,
					authProfileIdSource: "user"
				} : {},
				timeoutMs: EXPERIENCE_REVIEW_TIMEOUT_MS,
				runId,
				silentExpected: true,
				allowEmptyAssistantReplyAsSilent: true,
				terminalReplyExpectation: "optional",
				toolExecutionAllow: ["skill_workshop"],
				disableTrajectory: true,
				skillWorkshopProposalOnly: true,
				skillWorkshopUpdateProposals: true,
				skillWorkshopAutonomousCapture: true,
				skillWorkshopProposalMutationBudget: proposalMutationBudget,
				skillWorkshopOrigin: {
					agentId: foregroundPromptContext.agentId,
					sessionKey,
					...candidate.ctx.runId ? { runId: candidate.ctx.runId } : {}
				},
				verboseLevel: "off",
				suppressToolErrorWarnings: true,
				...capability ? { cronCreatorAuthorityCapability: capability } : {}
			});
			embeddedResult = capability ? await runWithCronCreatorAuthorityCapability(capability, run) : await run();
		} finally {
			preparedRunAdmission.close();
		}
		const proposalIds = [...proposalMutationBudget.mutatedProposalIds ?? []];
		proposalId = proposalIds[0];
		outcome = proposalIds.length === 0 ? "nothing" : "proposed";
		const currentConfig = deps.getCurrentConfig ? await deps.getCurrentConfig() : (await import("./config/config.js")).getRuntimeConfig();
		if (resolveSkillWorkshopConfig(currentConfig).autonomous.mode === "auto") {
			const { inspectSkillProposal } = await import("./service-GCbfj1EL.js");
			for (const mutatedProposalId of proposalIds) {
				const proposal = await inspectSkillProposal(mutatedProposalId, {
					workspaceDir,
					agentId: foregroundPromptContext.agentId
				});
				if (!proposal || proposal.record.status !== "pending" || proposal.record.autonomousCapture !== true) continue;
				if ((await applyAutonomousSkillProposal({
					workspaceDir,
					agentId: foregroundPromptContext.agentId,
					config: currentConfig,
					proposal,
					reason: "Autonomous self-learning capture"
				})).status === "applied") outcome = "applied";
			}
		}
		const agentUsage = embeddedResult.meta?.agentMeta?.usage;
		usage = agentUsage ? {
			inputTokens: (agentUsage.input ?? 0) + (agentUsage.cacheRead ?? 0) + (agentUsage.cacheWrite ?? 0),
			cachedInputTokens: agentUsage.cacheRead ?? 0,
			outputTokens: agentUsage.output ?? 0
		} : void 0;
	} catch (error) {
		recordSkillExperienceReviewOutcome(workspaceDir, {
			attemptedAtMs,
			outcome: "failed",
			error: String(error).slice(0, 300)
		});
		throw error;
	} finally {
		clearAgentRunContext(runId);
	}
	recordSkillExperienceReviewOutcome(workspaceDir, {
		attemptedAtMs,
		outcome,
		...proposalId ? { proposalId } : {},
		...usage ? { usage } : {}
	});
}
//#endregion
//#region src/skills/workshop/experience-review-default.ts
const defaultScheduler = createSkillExperienceReviewScheduler({
	isSystemActive: async () => {
		const [{ getActiveEmbeddedRunCount }, { getActiveReplyRunCount }] = await Promise.all([import("./runs-BE3DiJ2P.js"), import("./reply-run-registry-CdZEpf8T.js")]);
		return getActiveEmbeddedRunCount() > 0 || getActiveReplyRunCount() > 0;
	},
	prepareReview: async (candidate) => {
		const { getRuntimeConfig } = await import("./config/config.js");
		return prepareSkillExperienceReviewCandidate(candidate, getRuntimeConfig());
	},
	runReview: runSkillExperienceReview
});
/** Queues a conservative, post-run learning review after the agent system becomes idle. */
function scheduleSkillExperienceReview(params) {
	defaultScheduler.schedule(params);
}
//#endregion
export { scheduleSkillExperienceReview };
