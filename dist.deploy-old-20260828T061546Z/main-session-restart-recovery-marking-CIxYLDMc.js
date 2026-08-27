import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-CcZImb5w.js";
import { f as listAgentRunsForSession } from "./agent-run-registry-t4kvUyNQ.js";
import { f as isSessionWorkAdmissionTargetActive, r as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-BtKN0pjk.js";
import { At as applySessionEntryReplacements } from "./session-accessor-fcDZuc2H.js";
import { o as resolveAllAgentSessionStoreTargetsSync, u as resolveAgentSessionDirs } from "./targets-CSCF74bk.js";
import "./sessions-BI8dPUCI.js";
import { h as listActiveEmbeddedRunSessionKeys, m as listActiveEmbeddedRunSessionIds } from "./run-state-CmAt4u6E.js";
import { a as normalizeMainSessionRecoveryRunFences, d as normalizeFiniteTimestamp, f as normalizeStringSet, l as hasCurrentProcessOwner, n as isMainRestartRecoveryAggregateTerminalOnly, o as transitionMainSessionRecovery, p as resolveRestartRecoveryStorePaths, r as isMainRestartRecoveryCandidate, u as mainSessionRecoveryLog } from "./main-session-recovery-state-DagFkxEX.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery/main-session-restart-recovery-marking.ts
async function markRecoveryStore(params) {
	return await applySessionEntryReplacements({
		storePath: params.storePath,
		statuses: params.statuses,
		requireWriteSuccess: true,
		update: (entries) => {
			const replacements = [];
			const counts = {
				marked: 0,
				skipped: 0
			};
			for (const { sessionKey, entry } of entries) {
				const plan = params.plan(entry, sessionKey);
				if (!plan) continue;
				if (!isMainRestartRecoveryCandidate(entry, sessionKey)) {
					counts.skipped++;
					continue;
				}
				if (plan.action === "retire_terminal") {
					transitionMainSessionRecovery(entry, {
						kind: "observe",
						cycleId: randomUUID(),
						lifecycleGeneration: getAgentEventLifecycleGeneration(),
						sessionKey
					});
					replacements.push({
						sessionKey,
						entry
					});
					counts.skipped++;
					continue;
				}
				if (plan.replaceRuns) entry.restartRecoveryRuns = plan.runs;
				if (plan.forceRestartSafeTools) entry.restartRecoveryForceSafeTools = true;
				transitionMainSessionRecovery(entry, {
					kind: "mark_interrupted",
					cycleId: randomUUID(),
					now: Date.now(),
					...plan
				});
				replacements.push({
					sessionKey,
					entry
				});
				counts.marked++;
			}
			return {
				result: counts,
				replacements
			};
		}
	});
}
async function markRestartAbortedMainSessions(params) {
	const activeRuns = [...params.activeRuns];
	const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
	const result = {
		marked: 0,
		skipped: 0
	};
	const activeAdmissions = collectActiveSessionWorkAdmissions();
	if (activeRuns.length === 0 && activeAdmissions.size === 0) return result;
	const storePaths = /* @__PURE__ */ new Set();
	const env = params.stateDir === void 0 ? process.env : {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const stateDir = resolveStateDir(env);
	const configs = [params.cfg, ...params.additionalCfgs ?? []].filter((cfg) => Boolean(cfg));
	for (const cfg of configs) try {
		for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) storePaths.add(path.resolve(target.storePath));
	} catch (err) {
		mainSessionRecoveryLog.warn(`failed to resolve configured session stores for restart marker: ${String(err)}`);
	}
	for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) storePaths.add(path.join(sessionsDir, "sessions.json"));
	for (const storePath of activeAdmissions.keys()) storePaths.add(storePath);
	for (const storePath of storePaths) {
		const storeResult = await markRecoveryStore({
			storePath,
			plan: (entry, sessionKey) => {
				const matchingActiveRuns = activeRuns.filter((run) => run.sessionKey === sessionKey && run.sessionId === entry.sessionId && (entry.status === "running" || run.observedAt === void 0 || normalizeFiniteTimestamp(entry.updatedAt) === void 0 || entry.updatedAt < run.observedAt && run.lifecycleGeneration !== currentLifecycleGeneration) && params.isActiveRun?.(run) !== false);
				const matchedActiveAdmission = isSessionWorkAdmissionTargetActive({
					scope: storePath,
					sessionKey,
					sessionId: entry.sessionId
				});
				if (matchingActiveRuns.length === 0 && !matchedActiveAdmission) return;
				const wasRunning = entry.status === "running";
				const runs = normalizeMainSessionRecoveryRunFences([
					...(entry.restartRecoveryRuns ?? []).filter((run) => run.lifecycleGeneration === currentLifecycleGeneration),
					...listAgentRunsForSession({
						sessionKey,
						sessionId: entry.sessionId
					}),
					...matchingActiveRuns.map(({ runId, lifecycleGeneration }) => ({
						runId,
						lifecycleGeneration
					}))
				]);
				return {
					action: "mark",
					forceRestartSafeTools: matchedActiveAdmission,
					replaceRuns: true,
					resetRuntime: !wasRunning,
					runs
				};
			}
		});
		result.marked += storeResult.marked;
		result.skipped += storeResult.skipped;
	}
	if (result.marked > 0) mainSessionRecoveryLog.warn(`marked ${result.marked} interrupted main session(s) for restart recovery${params.reason ? ` (${params.reason})` : ""}`);
	return result;
}
async function markStartupOrphanedMainSessionsForRecovery(params) {
	const result = {
		marked: 0,
		skipped: 0
	};
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const updatedBeforeMs = normalizeFiniteTimestamp(params.updatedBeforeMs);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	const storePaths = (await resolveRestartRecoveryStorePaths(params)).filter((storePath) => !params.startupCheckedStorePaths?.has(storePath));
	for (const storePath of storePaths) {
		const storeResult = await markRecoveryStore({
			storePath,
			statuses: ["running"],
			plan: (entry, sessionKey) => {
				if (entry.status !== "running" || entry.abortedLastRun === true) return;
				const updatedAt = normalizeFiniteTimestamp(entry.updatedAt);
				if (updatedBeforeMs !== void 0 && updatedAt !== void 0 && updatedAt > updatedBeforeMs) return;
				if (hasCurrentProcessOwner({
					activeSessionIds: resolveActiveSessionIds(),
					activeSessionKeys: resolveActiveSessionKeys(),
					entry,
					sessionKey
				})) return;
				return isMainRestartRecoveryAggregateTerminalOnly(entry) ? { action: "retire_terminal" } : { action: "mark" };
			}
		});
		result.marked += storeResult.marked;
		result.skipped += storeResult.skipped;
	}
	storePaths.forEach((storePath) => params.startupCheckedStorePaths?.add(storePath));
	if (result.marked > 0) mainSessionRecoveryLog.warn(`marked ${result.marked} startup-orphaned main session(s) for restart recovery`);
	return result;
}
//#endregion
export { markStartupOrphanedMainSessionsForRecovery as n, markRestartAbortedMainSessions as t };
