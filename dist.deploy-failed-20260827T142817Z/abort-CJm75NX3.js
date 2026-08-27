import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { a as isSubagentSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { G as resolveSessionAbortTarget, Qt as loadSessionEntry, W as markSessionAbortTarget } from "./session-accessor-CVnxp3UM.js";
import { t as getAcpSessionManager } from "./manager-BjA1b1Vp.js";
import { i as setAbortMemory, n as isAbortRequestText } from "./abort-primitives-B6I7wGLB.js";
import { p as replyRunRegistry } from "./reply-run-registry-CeOg3aTN.js";
import { m as resolveActiveEmbeddedRunSessionId } from "./run-state-BxqT1sw2.js";
import { n as abortEmbeddedAgentRun } from "./runs-DdjJNEQM.js";
import "./sessions-B_ifzq5W.js";
import { m as listSubagentRunsForController, s as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-read-XIK3os_w.js";
import { i as resolveConversationBindingContextFromMessage } from "./conversation-binding-input-C8z3qpDj.js";
import { l as resolveInternalSessionKey, u as resolveMainSessionAlias } from "./sessions-helpers-Clt3G0tu.js";
import { n as killControlledSubagentRun } from "./subagent-control-ChNTtKmT.js";
import { t as clearSessionQueues } from "./cleanup-DE6pMbKq.js";
import "./queue-Fl99cnBb.js";
import { a as stripMentions, o as stripStructuralPrefixes } from "./mentions-s5oG2OK5.js";
import { t as resolveCommandAuthorization } from "./command-auth-DR4tXHFH.js";
import { a as shouldPersistAbortCutoff, i as resolveAbortCutoffFromContext } from "./abort-cutoff-BxM8jmK3.js";
import { t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-DFOtC9m3.js";
//#region src/auto-reply/reply/abort.ts
const defaultAbortDeps = {
	getAcpSessionManager,
	abortEmbeddedAgentRun,
	resolveActiveEmbeddedRunSessionId,
	markSessionAbortTarget,
	resolveSessionAbortTarget,
	getLatestSubagentRunByChildSessionKey,
	listSubagentRunsForController,
	killControlledSubagentRun
};
const abortDeps = { ...defaultAbortDeps };
const abortTestApi = {
	setDepsForTests(deps) {
		abortDeps.getAcpSessionManager = deps?.getAcpSessionManager ?? defaultAbortDeps.getAcpSessionManager;
		abortDeps.abortEmbeddedAgentRun = deps?.abortEmbeddedAgentRun ?? defaultAbortDeps.abortEmbeddedAgentRun;
		abortDeps.resolveActiveEmbeddedRunSessionId = deps?.resolveActiveEmbeddedRunSessionId ?? defaultAbortDeps.resolveActiveEmbeddedRunSessionId;
		abortDeps.markSessionAbortTarget = deps?.markSessionAbortTarget ?? defaultAbortDeps.markSessionAbortTarget;
		abortDeps.resolveSessionAbortTarget = deps?.resolveSessionAbortTarget ?? defaultAbortDeps.resolveSessionAbortTarget;
		abortDeps.getLatestSubagentRunByChildSessionKey = deps?.getLatestSubagentRunByChildSessionKey ?? defaultAbortDeps.getLatestSubagentRunByChildSessionKey;
		abortDeps.listSubagentRunsForController = deps?.listSubagentRunsForController ?? defaultAbortDeps.listSubagentRunsForController;
		abortDeps.killControlledSubagentRun = deps?.killControlledSubagentRun ?? defaultAbortDeps.killControlledSubagentRun;
	},
	resetDepsForTests() {
		abortDeps.getAcpSessionManager = defaultAbortDeps.getAcpSessionManager;
		abortDeps.abortEmbeddedAgentRun = defaultAbortDeps.abortEmbeddedAgentRun;
		abortDeps.resolveActiveEmbeddedRunSessionId = defaultAbortDeps.resolveActiveEmbeddedRunSessionId;
		abortDeps.markSessionAbortTarget = defaultAbortDeps.markSessionAbortTarget;
		abortDeps.resolveSessionAbortTarget = defaultAbortDeps.resolveSessionAbortTarget;
		abortDeps.getLatestSubagentRunByChildSessionKey = defaultAbortDeps.getLatestSubagentRunByChildSessionKey;
		abortDeps.listSubagentRunsForController = defaultAbortDeps.listSubagentRunsForController;
		abortDeps.killControlledSubagentRun = defaultAbortDeps.killControlledSubagentRun;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.abortTestApi")] = abortTestApi;
function abortSessionRunTargetWithOutcome(params) {
	const sessionIds = /* @__PURE__ */ new Set();
	const key = normalizeOptionalString(params.key);
	let active = key ? replyRunRegistry.isActive(key) : false;
	if (key) {
		const activeSessionId = abortDeps.resolveActiveEmbeddedRunSessionId(key);
		if (activeSessionId) {
			active = true;
			sessionIds.add(activeSessionId);
		}
	}
	const explicitSessionId = normalizeOptionalString(params.sessionId);
	if (explicitSessionId) sessionIds.add(explicitSessionId);
	let aborted = key ? replyRunRegistry.abort(key) : false;
	for (const sessionId of sessionIds) aborted = abortDeps.abortEmbeddedAgentRun(sessionId) || aborted;
	return {
		active,
		aborted
	};
}
function formatAbortReplyText(stoppedSubagents, rejectionReason, failedSubagents) {
	const failureSuffix = typeof failedSubagents === "number" && failedSubagents > 0 ? ` ${failedSubagents === 1 ? "One sub-agent could not be stopped" : `${failedSubagents} sub-agents could not be stopped`}. Retry /stop.` : "";
	if (rejectionReason === "finalizing") {
		const base = "Agent reply is already finalizing and can no longer be aborted.";
		if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) return `${base}${failureSuffix}`;
		return `${base} Stopped ${stoppedSubagents} ${stoppedSubagents === 1 ? "sub-agent" : "sub-agents"}.${failureSuffix}`;
	}
	if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) return `⚙️ Agent was aborted.${failureSuffix}`;
	return `⚙️ Agent was aborted. Stopped ${stoppedSubagents} ${stoppedSubagents === 1 ? "sub-agent" : "sub-agents"}.${failureSuffix}`;
}
function resolveStoredSessionId(params) {
	const agentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	try {
		return loadSessionEntry({
			agentId,
			clone: false,
			sessionKey: params.sessionKey,
			storePath
		})?.sessionId;
	} catch {
		return;
	}
}
function resolveBoundAcpAbortTargetSessionKey(params) {
	const bindingContext = resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx
	});
	if (!bindingContext) return;
	return resolveEffectiveResetTargetSessionKey({
		cfg: params.cfg,
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		parentConversationId: bindingContext.parentConversationId,
		activeSessionKey: params.activeSessionKey,
		skipConfiguredFallbackWhenActiveSessionNonAcp: false,
		fallbackToActiveAcpWhenUnbound: false
	});
}
function normalizeRequesterSessionKey(cfg, key) {
	const cleaned = normalizeOptionalString(key);
	if (!cleaned) return;
	const { mainKey, alias } = resolveMainSessionAlias(cfg);
	return resolveInternalSessionKey({
		key: cleaned,
		alias,
		mainKey
	});
}
async function stopSubagentsForRequester(params) {
	const requesterKey = normalizeRequesterSessionKey(params.cfg, params.requesterSessionKey);
	if (!requesterKey) return {
		stopped: 0,
		failed: 0
	};
	const dedupedRunsByChildKey = /* @__PURE__ */ new Map();
	for (const run of abortDeps.listSubagentRunsForController(requesterKey)) {
		const childKey = normalizeOptionalString(run.childSessionKey);
		if (!childKey) continue;
		const latest = abortDeps.getLatestSubagentRunByChildSessionKey(childKey);
		if (!latest) {
			const existing = dedupedRunsByChildKey.get(childKey);
			if (!existing || run.createdAt >= existing.createdAt) dedupedRunsByChildKey.set(childKey, run);
			continue;
		}
		const latestControllerSessionKey = normalizeOptionalString(latest?.controllerSessionKey) ?? normalizeOptionalString(latest?.requesterSessionKey);
		if (latest.runId !== run.runId || latest.generation !== run.generation || latest.createdAt !== run.createdAt || latestControllerSessionKey !== requesterKey) continue;
		const existing = dedupedRunsByChildKey.get(childKey);
		if (!existing || run.createdAt >= existing.createdAt) dedupedRunsByChildKey.set(childKey, latest);
	}
	const runs = Array.from(dedupedRunsByChildKey.values());
	if (runs.length === 0) return {
		stopped: 0,
		failed: 0
	};
	let stopped = 0;
	let failed = 0;
	for (const run of runs) {
		if (!normalizeOptionalString(run.childSessionKey)) continue;
		const result = await abortDeps.killControlledSubagentRun({
			cfg: params.cfg,
			controller: {
				controllerSessionKey: requesterKey,
				callerSessionKey: requesterKey,
				callerIsSubagent: isSubagentSessionKey(requesterKey),
				controlScope: "children"
			},
			entry: run,
			suppressTaskDelivery: true
		});
		if (result.status === "ok" || result.status === "error") {
			const killed = "killed" in result && result.killed ? 1 : 0;
			const cascadeKilled = "cascadeKilled" in result ? result.cascadeKilled : 0;
			stopped += killed + cascadeKilled;
			if (result.status === "error") {
				failed += 1;
				logVerbose(`abort: failed to kill subagent ${run.runId}: ${result.error}`);
			}
		}
	}
	if (stopped > 0) logVerbose(`abort: stopped ${stopped} subagent run(s) for ${requesterKey}`);
	return {
		stopped,
		failed
	};
}
async function tryFastAbortFromMessage(params) {
	const { ctx, cfg } = params;
	const commandSessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.ParentSessionKey);
	const targetKey = normalizeOptionalString(ctx.CommandTargetSessionKey) ?? commandSessionKey;
	const raw = stripStructuralPrefixes(ctx.commandText);
	if (!isAbortRequestText(normalizeOptionalLowercaseString(ctx.ChatType) === "group" ? stripMentions(raw, ctx, cfg, resolveSessionAgentId({
		sessionKey: targetKey ?? ctx.SessionKey ?? "",
		config: cfg
	})) : raw)) return {
		handled: false,
		aborted: false
	};
	const commandAuthorized = ctx.CommandAuthorized;
	const auth = resolveCommandAuthorization({
		ctx,
		cfg,
		commandAuthorized
	});
	if (!auth.isAuthorizedSender) return {
		handled: false,
		aborted: false
	};
	const agentId = resolveSessionAgentId({
		sessionKey: targetKey ?? ctx.SessionKey ?? "",
		config: cfg
	});
	const abortKey = targetKey ?? auth.from ?? auth.to;
	const requesterSessionKey = targetKey ?? ctx.SessionKey ?? abortKey;
	if (targetKey) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const abortCutoffForTarget = (target) => shouldPersistAbortCutoff({
			commandSessionKey,
			targetSessionKey: target.sessionKey
		}) ? resolveAbortCutoffFromContext(ctx) : void 0;
		let resolvedAbortTarget = null;
		try {
			resolvedAbortTarget = abortDeps.resolveSessionAbortTarget({
				agentId,
				sessionKey: targetKey,
				storePath
			});
		} catch (error) {
			logVerbose(`abort: failed to resolve abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
		}
		const resolvedTargetKey = resolvedAbortTarget?.sessionKey ?? targetKey;
		const conversationBoundAcpTargetKey = commandSessionKey ? resolveBoundAcpAbortTargetSessionKey({
			ctx,
			cfg,
			activeSessionKey: commandSessionKey
		}) : void 0;
		const boundAcpTargetKey = !isAcpSessionKey(resolvedTargetKey) ? conversationBoundAcpTargetKey : void 0;
		const abortTargetKeys = [resolvedTargetKey];
		if (boundAcpTargetKey && boundAcpTargetKey !== resolvedTargetKey) abortTargetKeys.push(boundAcpTargetKey);
		const acpManager = abortDeps.getAcpSessionManager();
		for (const acpTargetKey of abortTargetKeys.filter(isAcpSessionKey)) {
			if (acpManager.resolveSession({
				cfg,
				sessionKey: acpTargetKey
			}).kind === "none") continue;
			try {
				await acpManager.cancelSession({
					cfg,
					sessionKey: acpTargetKey,
					reason: "fast-abort"
				});
			} catch (error) {
				logVerbose(`abort: ACP cancel failed for ${acpTargetKey}: ${formatErrorMessage(error)}`);
			}
		}
		const sourceAbortKey = commandSessionKey && !abortTargetKeys.includes(commandSessionKey) && conversationBoundAcpTargetKey && abortTargetKeys.includes(conversationBoundAcpTargetKey) ? commandSessionKey : void 0;
		const sessionIdsByKey = new Map(abortTargetKeys.map((abortTargetKey) => [abortTargetKey, replyRunRegistry.resolveSessionId(abortTargetKey) ?? (abortTargetKey === resolvedTargetKey ? resolvedAbortTarget?.sessionId : resolveStoredSessionId({
			cfg,
			sessionKey: abortTargetKey
		}))]));
		let aborted = false;
		let activeAbortRejected = false;
		for (const abortTargetKey of abortTargetKeys) {
			const outcome = abortSessionRunTargetWithOutcome({
				key: abortTargetKey,
				sessionId: sessionIdsByKey.get(abortTargetKey)
			});
			activeAbortRejected ||= outcome.active && !outcome.aborted;
			aborted = outcome.aborted || aborted;
		}
		const sourceSessionId = sourceAbortKey ? replyRunRegistry.resolveSessionId(sourceAbortKey) ?? resolveStoredSessionId({
			cfg,
			sessionKey: sourceAbortKey
		}) : void 0;
		if (sourceAbortKey) {
			const outcome = abortSessionRunTargetWithOutcome({
				key: sourceAbortKey,
				sessionId: sourceSessionId
			});
			activeAbortRejected ||= outcome.active && !outcome.aborted;
			aborted = outcome.aborted || aborted;
		}
		const cleared = clearSessionQueues(abortTargetKeys.flatMap((abortTargetKey) => [abortTargetKey, sessionIdsByKey.get(abortTargetKey)]).concat(sourceAbortKey, sourceSessionId));
		if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`abort: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
		const { stopped, failed } = await stopSubagentsForRequester({
			cfg,
			requesterSessionKey
		});
		if (activeAbortRejected && !aborted) return {
			handled: true,
			aborted: false,
			rejectionReason: "finalizing",
			stoppedSubagents: stopped,
			failedSubagents: failed
		};
		let persistedAbortTarget = null;
		try {
			persistedAbortTarget = await abortDeps.markSessionAbortTarget({
				scope: {
					agentId,
					sessionKey: targetKey,
					storePath
				},
				resolveAbortCutoff: abortCutoffForTarget
			});
		} catch (error) {
			logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
		}
		if (persistedAbortTarget?.persisted === false) logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${persistedAbortTarget.persistenceError ?? "unknown error"}`);
		const abortMemoryKey = persistedAbortTarget?.sessionKey ?? resolvedAbortTarget?.sessionKey ?? abortKey;
		const hasAbortTargetEntry = Boolean(persistedAbortTarget?.entry ?? resolvedAbortTarget?.entry);
		if (persistedAbortTarget?.persisted !== true && abortMemoryKey && !hasAbortTargetEntry) setAbortMemory(abortMemoryKey, true);
		return {
			handled: true,
			aborted,
			stoppedSubagents: stopped,
			failedSubagents: failed
		};
	}
	if (abortKey) setAbortMemory(abortKey, true);
	const { stopped, failed } = await stopSubagentsForRequester({
		cfg,
		requesterSessionKey
	});
	return {
		handled: true,
		aborted: false,
		stoppedSubagents: stopped,
		failedSubagents: failed
	};
}
//#endregion
export { tryFastAbortFromMessage as i, formatAbortReplyText as n, stopSubagentsForRequester as r, abortSessionRunTargetWithOutcome as t };
