import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./config-Dl8DJbzM.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import "./sessions-BIUamgQ4.js";
import { t as SessionManager } from "./session-manager-Clz4xunQ.js";
import { s as prepareSystemAgentRunAdmission } from "./admitted-run-context-BxSN0sUe.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { n as applySkillProposal } from "./service-DLIuaV-6.js";
import { i as selectCurrentSkillTurnMessages, n as countSkillModelIterations, r as formatSkillExperienceReviewTranscript, t as buildSkillExperienceReviewPrompt } from "./experience-review-prompt-BANy7frp.js";
import { randomUUID } from "node:crypto";
//#region src/skills/workshop/auto-apply.ts
const log$1 = createSubsystemLogger("skills/workshop");
const defaultDeps = { apply: applySkillProposal };
/** Applies one capture through the normal Workshop service without retrying failures. */
async function autoApplySkillProposal(params, deps = defaultDeps) {
	try {
		const applied = await deps.apply({
			workspaceDir: params.workspaceDir,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.config ? { config: params.config } : {},
			...params.env ? { env: params.env } : {},
			proposalId: params.proposalId,
			reason: "Autonomous self-learning capture"
		});
		log$1.info(`auto-applied skill ${params.skillName} from proposal ${params.proposalId}`);
		return applied;
	} catch (error) {
		log$1.warn(`auto-apply left skill ${params.skillName} proposal ${params.proposalId} unapplied: ${String(error)}`);
		return;
	}
}
//#endregion
//#region src/skills/workshop/experience-review.ts
const EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS = 10;
const EXPERIENCE_REVIEW_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_RETRY_IDLE_MS = 3e4;
const EXPERIENCE_REVIEW_TIMEOUT_MS = 12e4;
const EXPERIENCE_REVIEW_MAX_PENDING = 32;
const EXPERIENCE_REVIEW_MAX_SHALLOW_SESSIONS = 256;
const EXPERIENCE_REVIEW_SESSION_SEGMENT = "skill-workshop-review";
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
	EXPERIENCE_REVIEW_SESSION_SEGMENT
]);
const log = createSubsystemLogger("skills/workshop");
function mergeRunSkillUsage(...groups) {
	const merged = /* @__PURE__ */ new Map();
	for (const group of groups) for (const usage of group ?? []) merged.set(`${usage.source}\u0000${usage.name}\u0000${usage.activation}`, usage);
	return [...merged.values()];
}
function isAuthProfileMigrationRequiredError(error) {
	return typeof error === "object" && error !== null && error.code === "AUTH_PROFILE_MIGRATION_REQUIRED";
}
function isEligibleContext(ctx) {
	if (ctx.compacted === true || ctx.skillWorkshopAvailable !== true || !ctx.modelProviderId?.trim() || !ctx.modelId?.trim()) return false;
	const trigger = ctx.trigger?.trim().toLowerCase();
	if (trigger && EXPERIENCE_REVIEW_BLOCKED_TRIGGERS.has(trigger)) return false;
	const sessionKey = ctx.sessionKey?.trim().toLowerCase();
	if (!sessionKey || sessionKey.includes("active-memory")) return false;
	return !sessionKey.split(":").some((segment) => EXPERIENCE_REVIEW_BLOCKED_SESSION_SEGMENTS.has(segment));
}
async function prepareSkillExperienceReviewCandidate(candidate, config) {
	if (resolveSkillWorkshopConfig(config).autonomous.mode === "off") return;
	const { resolveConversationCapabilityProfile } = await import("./agents/conversation-capability-profile.js");
	const { resolveSandboxRuntimeStatus } = await import("./sandbox-DJdU3zYn.js");
	const { isToolAllowedByPolicies } = await import("./tool-policy-match-CLtKK0BR.js");
	const { mergeAlsoAllowPolicy } = await import("./tool-policy-RmGpSQ4D.js");
	const sessionKey = candidate.ctx.sessionKey;
	if (!sessionKey || resolveSandboxRuntimeStatus({
		cfg: config,
		sessionKey
	}).sandboxed) return;
	const capabilityProfile = resolveConversationCapabilityProfile({
		config,
		sessionKey,
		sandboxSessionKey: sessionKey,
		agentId: candidate.ctx.agentId,
		agentAccountId: candidate.ctx.agentAccountId,
		messageProvider: candidate.ctx.messageProvider,
		messageChannel: candidate.ctx.messageChannel,
		chatType: candidate.ctx.chatType,
		groupId: candidate.ctx.groupId,
		groupChannel: candidate.ctx.groupChannel,
		groupSpace: candidate.ctx.groupSpace,
		memberRoleIds: candidate.ctx.memberRoleIds,
		spawnedBy: candidate.ctx.spawnedBy,
		senderId: candidate.ctx.senderId,
		senderName: candidate.ctx.senderName,
		senderUsername: candidate.ctx.senderUsername,
		senderE164: candidate.ctx.senderE164,
		senderIsOwner: candidate.ctx.senderIsOwner,
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
	const shallowBySession = /* @__PURE__ */ new Map();
	let reviewInFlight = false;
	const setTimer = deps.setTimer ?? ((callback, delayMs) => setTimeout(callback, delayMs));
	const clearTimer = deps.clearTimer ?? clearTimeout;
	const arm = (sessionKey, pending, delayMs) => {
		if (pending.timer) clearTimer(pending.timer);
		const generation = ++pending.generation;
		const timer = setTimer(() => {
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
				if (isAuthProfileMigrationRequiredError(error)) {
					if (pendingBySession.get(sessionKey) === pending && pending.generation === generation) pendingBySession.delete(sessionKey);
					return;
				}
				if (pendingBySession.get(sessionKey) === pending && pending.generation === generation) arm(sessionKey, pending, EXPERIENCE_REVIEW_RETRY_IDLE_MS);
			});
		}, delayMs);
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
				shallowBySession.delete(sessionKey);
				return;
			}
			if (existing) arm(sessionKey, existing, EXPERIENCE_REVIEW_IDLE_MS);
			if (errored) {
				shallowBySession.delete(sessionKey);
				log.debug(`experience review skipped: reason=errored-completion session=${sessionKey}`);
				return;
			}
			if (resolveSkillWorkshopConfig(params.config).autonomous.mode === "off") return;
			if (!isEligibleContext(params.ctx)) {
				log.debug(`experience review skipped: reason=ineligible-context session=${sessionKey}`);
				return;
			}
			const workspaceDir = params.ctx.workspaceDir?.trim();
			if (!workspaceDir) {
				log.debug(`experience review skipped: reason=missing-workspace session=${sessionKey}`);
				return;
			}
			const turnMessages = selectCurrentSkillTurnMessages(params.event.messages);
			const reportedModelIterations = params.ctx.modelIterations;
			const modelIterations = reportedModelIterations === void 0 ? countSkillModelIterations(turnMessages) : Number.isSafeInteger(reportedModelIterations) && reportedModelIterations >= 0 ? reportedModelIterations : 0;
			let reviewIterations = modelIterations;
			let reviewMessages = turnMessages;
			let reviewAborted = !params.event.success;
			let reviewUsedSkills = mergeRunSkillUsage(existing && existing.candidate.ctx.runId === params.ctx.runId ? existing.candidate.usedSkills : void 0, params.usedSkills);
			if (modelIterations >= EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS) shallowBySession.delete(sessionKey);
			else {
				if (modelIterations < 1) {
					log.debug(`experience review skipped: reason=no-model-iterations session=${sessionKey}`);
					return;
				}
				const senderIdentity = [
					params.ctx.senderId ?? "",
					params.ctx.senderUsername ?? "",
					params.ctx.senderName ?? "",
					params.ctx.senderE164 ?? ""
				];
				if (params.ctx.chatType === "group" && senderIdentity.every((field) => !field)) {
					log.debug(`experience review skipped: reason=ambiguous-group-sender session=${sessionKey}`);
					return;
				}
				const senderScope = JSON.stringify([
					...senderIdentity,
					params.ctx.modelProviderId ?? "",
					params.ctx.modelId ?? "",
					params.ctx.authProfileId ?? ""
				]);
				let accumulator = shallowBySession.get(sessionKey);
				if (accumulator && accumulator.senderScope !== senderScope) {
					accumulator = void 0;
					shallowBySession.delete(sessionKey);
				}
				if (!accumulator) {
					if (shallowBySession.size >= EXPERIENCE_REVIEW_MAX_SHALLOW_SESSIONS) {
						const oldestKey = shallowBySession.keys().next().value;
						if (oldestKey !== void 0) shallowBySession.delete(oldestKey);
					}
					accumulator = {
						senderScope,
						iterations: 0,
						messages: [],
						usedSkills: [],
						aborted: false
					};
					shallowBySession.set(sessionKey, accumulator);
				}
				const runId = params.ctx.runId?.trim();
				if (runId && accumulator.lastRunId === runId) {
					log.debug(`experience review skipped: reason=duplicate-run-report session=${sessionKey}`);
					return;
				}
				accumulator.lastRunId = runId;
				accumulator.iterations += modelIterations;
				accumulator.aborted = accumulator.aborted || !params.event.success;
				accumulator.usedSkills = mergeRunSkillUsage(accumulator.usedSkills, params.usedSkills);
				accumulator.messages = [...accumulator.messages, ...turnMessages].slice(-40);
				if (accumulator.iterations < EXPERIENCE_REVIEW_MIN_MODEL_ITERATIONS) {
					log.debug(`experience review deferred: reason=below-depth-bar iterations=${modelIterations} accumulated=${accumulator.iterations} session=${sessionKey}`);
					return;
				}
				shallowBySession.delete(sessionKey);
				reviewIterations = accumulator.iterations;
				reviewMessages = accumulator.messages;
				reviewAborted = accumulator.aborted;
				reviewUsedSkills = accumulator.usedSkills;
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
						authProfileId: params.ctx.authProfileId,
						skillWorkshopAvailable: params.ctx.skillWorkshopAvailable,
						compacted: params.ctx.compacted,
						trigger: params.ctx.trigger,
						messageChannel: params.ctx.messageChannel,
						messageProvider: params.ctx.messageProvider,
						chatType: params.ctx.chatType,
						agentAccountId: params.ctx.agentAccountId,
						groupId: params.ctx.groupId,
						groupChannel: params.ctx.groupChannel,
						groupSpace: params.ctx.groupSpace,
						memberRoleIds: params.ctx.memberRoleIds ? [...params.ctx.memberRoleIds] : void 0,
						spawnedBy: params.ctx.spawnedBy,
						senderId: params.ctx.senderId,
						senderName: params.ctx.senderName,
						senderUsername: params.ctx.senderUsername,
						senderE164: params.ctx.senderE164,
						senderIsOwner: params.ctx.senderIsOwner
					},
					...params.config ? { config: params.config } : {},
					transcript: formatSkillExperienceReviewTranscript(reviewMessages),
					modelIterations: reviewIterations,
					usedSkills: reviewUsedSkills,
					turnAborted: reviewAborted
				};
				const pending = existing ?? {
					candidate,
					generation: 0
				};
				pending.candidate = candidate;
				pendingBySession.set(sessionKey, pending);
				arm(sessionKey, pending, EXPERIENCE_REVIEW_IDLE_MS);
				log.debug(`experience review scheduled: session=${sessionKey} iterations=${reviewIterations} aborted=${reviewAborted}`);
			}
		},
		clear() {
			for (const pending of pendingBySession.values()) if (pending.timer) clearTimer(pending.timer);
			pendingBySession.clear();
			shallowBySession.clear();
		}
	};
}
async function runSkillExperienceReview(candidate, deps = {}) {
	await runWithGatewayIndependentRootWorkAdmission(() => runSkillExperienceReviewInner(candidate, deps));
}
async function runSkillExperienceReviewInner(candidate, deps) {
	const workspaceDir = candidate.ctx.workspaceDir;
	const sessionKey = candidate.ctx.sessionKey;
	const modelProviderId = candidate.ctx.modelProviderId?.trim();
	const modelId = candidate.ctx.modelId?.trim();
	if (!workspaceDir || !sessionKey || !modelProviderId || !modelId) return;
	const sessionId = randomUUID();
	const runId = `skill-workshop-review:${randomUUID()}`;
	const config = candidate.config ?? getRuntimeConfig();
	const proposalMutationBudget = {
		remaining: 1,
		readSkillHashes: /* @__PURE__ */ new Map()
	};
	const reviewSessionKey = `agent:${candidate.ctx.agentId ?? "main"}:${EXPERIENCE_REVIEW_SESSION_SEGMENT}:incognito-${sessionId}`;
	const { listWritableWorkspaceSkillSummaries } = await import("./workspace-skill-read-CGLcB9sO.js");
	const existingSkills = listWritableWorkspaceSkillSummaries(workspaceDir, {
		config,
		agentId: candidate.ctx.agentId
	}).map((skill) => skill.description ? {
		name: skill.name,
		description: skill.description
	} : { name: skill.name });
	const { runEmbeddedAgent } = await import("./embedded-agent-DQGrbvPv.js");
	const preparedRunAdmission = prepareSystemAgentRunAdmission(config, runId, candidate.ctx.agentId ?? "main", "skill-workshop.experience");
	try {
		await runEmbeddedAgent({
			preparedRunAdmission,
			sessionId,
			sessionKey: reviewSessionKey,
			sandboxSessionKey: sessionKey,
			sessionManager: SessionManager.inMemory(workspaceDir),
			...candidate.ctx.agentId ? { agentId: candidate.ctx.agentId } : {},
			trigger: "manual",
			lane: "skill-workshop-review",
			messageChannel: candidate.ctx.messageChannel ?? void 0,
			messageProvider: candidate.ctx.messageProvider ?? void 0,
			...candidate.ctx.chatType ? { chatType: candidate.ctx.chatType } : {},
			...candidate.ctx.agentAccountId ? { agentAccountId: candidate.ctx.agentAccountId } : {},
			groupId: candidate.ctx.groupId,
			groupChannel: candidate.ctx.groupChannel,
			groupSpace: candidate.ctx.groupSpace,
			memberRoleIds: candidate.ctx.memberRoleIds ? [...candidate.ctx.memberRoleIds] : void 0,
			spawnedBy: candidate.ctx.spawnedBy,
			senderId: candidate.ctx.senderId,
			senderName: candidate.ctx.senderName,
			senderUsername: candidate.ctx.senderUsername,
			senderE164: candidate.ctx.senderE164,
			senderIsOwner: candidate.ctx.senderIsOwner,
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
			toolsAllow: ["skill_workshop"],
			disableMessageTool: true,
			disableTrajectory: true,
			skillWorkshopProposalOnly: true,
			skillWorkshopUpdateProposals: true,
			skillWorkshopAutonomousCapture: true,
			skillWorkshopProposalMutationBudget: proposalMutationBudget,
			skillWorkshopOrigin: {
				...candidate.ctx.agentId ? { agentId: candidate.ctx.agentId } : {},
				sessionKey,
				...candidate.ctx.runId ? { runId: candidate.ctx.runId } : {}
			},
			cleanupBundleMcpOnRunEnd: true,
			bootstrapContextMode: "lightweight",
			skillsSnapshot: {
				prompt: "",
				skills: []
			},
			verboseLevel: "off",
			reasoningLevel: "off",
			suppressToolErrorWarnings: true
		});
	} finally {
		preparedRunAdmission.close();
	}
	const currentConfig = deps.getCurrentConfig ? await deps.getCurrentConfig() : (await import("./config/config.js")).getRuntimeConfig();
	if (resolveSkillWorkshopConfig(currentConfig).autonomous.mode !== "auto") return;
	const proposalIds = [...proposalMutationBudget.mutatedProposalIds ?? []];
	if (proposalIds.length === 0) return;
	const { inspectSkillProposal } = await import("./service-BbSHaPTz.js");
	for (const proposalId of proposalIds) {
		const proposal = await inspectSkillProposal(proposalId, {
			workspaceDir,
			...candidate.ctx.agentId ? { agentId: candidate.ctx.agentId } : {}
		});
		if (!proposal || proposal.record.status !== "pending" || proposal.record.autonomousCapture !== true) continue;
		await autoApplySkillProposal({
			workspaceDir,
			...candidate.ctx.agentId ? { agentId: candidate.ctx.agentId } : {},
			config: currentConfig,
			proposalId,
			skillName: proposal.record.target.skillName
		});
	}
}
//#endregion
//#region src/skills/workshop/experience-review-default.ts
const defaultScheduler = createSkillExperienceReviewScheduler({
	isSystemActive: async () => {
		const [{ getActiveEmbeddedRunCount }, { getActiveReplyRunCount }] = await Promise.all([import("./runs-CxFrtfwq.js"), import("./reply-run-registry-CGKXeHq9.js")]);
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
