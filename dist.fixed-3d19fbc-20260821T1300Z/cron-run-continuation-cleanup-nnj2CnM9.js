import { l as parseCronRunScopeSuffix } from "./session-key-utils-D8x_bjrd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import "./config-CfeGo4K4.js";
import { Qt as loadSessionEntry } from "./session-accessor-CIiPoGwM.js";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BFaW8ajj.js";
import { s as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-DsWf7lJY.js";
import { m as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-imdigCdP.js";
//#region src/tasks/cron-run-continuation-cleanup.ts
/** Removes an idle exact-run continuation through the session lifecycle owner. */
function canRemoveCronRunContinuation(marker) {
	if (!marker || marker.basePersisted !== true) return false;
	if (marker.phase === "ready") return !marker.ownerRunId;
	if (marker.phase !== "continuing" || !marker.ownerRunId) return false;
	const ownerLifecycleGeneration = marker.ownerLifecycleGeneration?.trim();
	return Boolean(ownerLifecycleGeneration && ownerLifecycleGeneration !== getAgentEventLifecycleGeneration());
}
async function removeCronRunContinuationSessionIfIdle(sessionKey, settledDeliveryId) {
	if (!parseCronRunScopeSuffix(sessionKey).runId || hasPendingGeneratedMediaTaskForSessionKey(sessionKey)) return;
	if ((await loadPendingSessionDeliveries()).some((entry) => entry.sessionKey === sessionKey && entry.id !== settledDeliveryId && entry.settlementOutcome === void 0 && entry.acknowledgedAt === void 0)) return;
	const agentId = resolveAgentIdFromSessionKey(sessionKey);
	const storePath = resolveSessionStorePathCore(getRuntimeConfig().session?.store, { agentId });
	const entry = loadSessionEntry({
		agentId,
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const marker = entry?.cronRunContinuation;
	if (!entry || !canRemoveCronRunContinuation(marker)) return;
	await deleteSessionEntryLifecycle({
		agentId,
		archiveTranscript: false,
		expectedEntry: entry,
		expectedLifecycleRevision: entry.lifecycleRevision,
		expectedSessionId: entry.sessionId,
		expectedUpdatedAt: entry.updatedAt,
		requireWriteSuccess: true,
		storePath,
		target: {
			canonicalKey: sessionKey,
			storeKeys: [sessionKey]
		}
	});
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
