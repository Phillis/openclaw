import { l as parseCronRunScopeSuffix } from "./session-key-utils-Di3FvABa.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-CcZImb5w.js";
import "./config-B_0xOnKq.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import "./session-accessor-fcDZuc2H.js";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-wZ-pJlbP.js";
import { o as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-BpeKxCiz.js";
import { m as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-Ewx4waqo.js";
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
