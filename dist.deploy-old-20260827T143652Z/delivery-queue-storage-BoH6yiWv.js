import { u as runSqliteImmediateTransactionSync } from "./node-sqlite-sCL6pEgr.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, z as inferDeliveryQueueFailureRetention } from "./openclaw-state-db-DlCMR4eQ.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { l as summarizeOutboundPayloadForTransport } from "./payloads-YIMlWZ2P.js";
import { c as loadDeliveryQueueEntry, d as reserveDeliveryQueueEntryAttempt, f as terminalizePendingDeliveryQueueEntry, l as moveDeliveryQueueEntryToFailed, m as upsertDeliveryQueueEntry, o as getDeliveryQueueEntryStatuses, p as updateDeliveryQueueEntry, r as deleteDeliveryQueueEntry, s as loadDeliveryQueueEntries, t as completeDeliveryQueueEntry } from "./delivery-queue-sqlite-CW1nsWu_.js";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME, i as OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME, n as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, o as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, r as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, t as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME } from "./delivery-queue-media-staging-AlIF7J3C.js";
import { r as releaseSpoolArtifacts, t as collectEntrySpoolPaths } from "./delivery-queue-media-spool-DTLZQiFi.js";
import { randomUUID } from "node:crypto";
/** Captures already-owned content without invoking modifying policy. */
function createUnmodifiedPreparedOutboundBatch(payloads) {
	return {
		schemaVersion: 1,
		sourcePayloadCount: payloads.length,
		entries: payloads.map((payload, sourceIndex) => ({
			sourceIndex,
			status: "accepted",
			payload,
			replyHookChanged: false,
			messageHookChanged: false,
			preparedMediaCount: summarizeOutboundPayloadForTransport(payload).mediaUrls.length
		}))
	};
}
/** Retains terminal legacy cardinality without copying unavailable pre-policy content. */
function createUnavailablePreparedOutboundBatch(sourcePayloadCount) {
	return {
		schemaVersion: 1,
		sourcePayloadCount,
		entries: []
	};
}
function acceptedPreparedOutboundEntries(batch) {
	return batch.entries.filter((entry) => entry.status === "accepted");
}
function preparedOutboundSuppressionOutcomes(batch) {
	return batch.entries.flatMap((entry) => entry.status === "suppressed" ? [{
		index: entry.sourceIndex,
		status: "suppressed",
		reason: entry.reason,
		...entry.hookEffect ? { hookEffect: entry.hookEffect } : {}
	}] : []);
}
/** Removes process-local hook details before a prepared batch enters durable custody. */
function projectPreparedOutboundBatchForStorage(batch) {
	return {
		...batch,
		entries: batch.entries.map((entry) => {
			if (entry.status !== "suppressed" || !entry.hookEffect) return entry;
			const { hookEffect: _hookEffect, ...stored } = entry;
			return stored;
		})
	};
}
function mapPreparedOutboundAcceptedPayloads(batch, payloads) {
	let acceptedIndex = 0;
	const mapped = {
		...batch,
		entries: batch.entries.map((entry) => {
			if (entry.status !== "accepted") return entry;
			const payload = payloads[acceptedIndex++];
			if (!payload) throw new Error("Prepared outbound payload map lost an accepted entry");
			return {
				...entry,
				payload
			};
		})
	};
	if (acceptedIndex !== payloads.length) throw new Error("Prepared outbound payload map received an extra payload");
	return mapped;
}
//#endregion
//#region src/infra/delivery-queue-sqlite-claim.ts
const PLATFORM_SEND_OWNER_LEASE_MS = 3e4;
/** Creates the owner published atomically with an immediate live delivery. */
function createInitialDeliveryProducerClaim(now = Date.now()) {
	return {
		requiresProducerClaim: true,
		availableAt: now + PLATFORM_SEND_OWNER_LEASE_MS,
		producerClaimId: generateSecureUuid(),
		recoveryState: "producer_claimed"
	};
}
/** Runs an existing queue mutation only while its exact platform owner survives. */
function transitionOwnedDeliveryQueueEntry(params, transition) {
	return runSqliteImmediateTransactionSync(openOpenClawStateDatabase({ env: params.stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : process.env }).db, () => {
		const entry = loadDeliveryQueueEntry(params.queueName, params.id, params.stateDir);
		if (!entry) return false;
		if (params.platformSendAttemptId === null ? entry.platformSendAttemptId !== void 0 || entry.producerClaimId !== void 0 : entry.platformSendAttemptId !== params.platformSendAttemptId && entry.producerClaimId !== params.platformSendAttemptId) return false;
		transition(entry);
		return true;
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: `mutate owned ${params.queueName} delivery platform send`
	});
}
function transitionDeliveryQueueEntryPlatformSend(params, operation, transition) {
	return runSqliteImmediateTransactionSync(openOpenClawStateDatabase({ env: params.stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : process.env }).db, () => {
		const current = loadDeliveryQueueEntry(params.queueName, params.id, params.stateDir);
		if (!current) return false;
		if (current.platformSendStartedAt !== void 0 && (operation === "promote" || operation === "claim" && (current.platformSendStartedAt !== params.reconciledPlatformSendStartedAt || current.platformSendAttemptId !== params.reconciledPlatformSendAttemptId || typeof current.platformSendAttemptId !== "string"))) return false;
		const updated = transition(current, Date.now());
		return updated ? upsertDeliveryQueueEntry({
			queueName: params.queueName,
			entry: updated,
			stateDir: params.stateDir,
			updatePendingOnly: true
		}) : false;
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: `${operation} ${params.queueName} delivery platform send`
	});
}
/** Claim a recoverable producer lease before any provider invocation. */
function claimDeliveryQueueEntryPlatformSend(params) {
	const claimId = generateSecureUuid();
	return transitionDeliveryQueueEntryPlatformSend(params, "claim", (entry, now) => {
		const reconciledNotSent = entry.recoveryState === "send_attempt_started" && typeof params.reconciledPlatformSendStartedAt === "number" && entry.platformSendStartedAt === params.reconciledPlatformSendStartedAt && typeof params.reconciledPlatformSendAttemptId === "string" && entry.platformSendAttemptId === params.reconciledPlatformSendAttemptId;
		if (entry.recoveryState && !reconciledNotSent && (entry.recoveryState !== "producer_claimed" || typeof entry.availableAt !== "number" || entry.availableAt > now)) return;
		return {
			...entry,
			...params.requiresProducerClaim === true ? { requiresProducerClaim: true } : {},
			availableAt: now + 3e4,
			producerClaimId: claimId,
			platformSendAttemptId: void 0,
			platformSendStartedAt: void 0,
			recoveryState: "producer_claimed"
		};
	}) ? claimId : void 0;
}
/** Renew only the exact unexpired producer that already owns the row. */
function renewDeliveryQueueEntryPlatformSendLease(params) {
	return runSqliteImmediateTransactionSync(openOpenClawStateDatabase({ env: params.stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : process.env }).db, () => {
		const entry = loadDeliveryQueueEntry(params.queueName, params.id, params.stateDir);
		const now = Date.now();
		const exactOwner = entry?.recoveryState === "producer_claimed" ? entry.producerClaimId === params.claimId : (entry?.recoveryState === "send_attempt_started" || entry?.recoveryState === "unknown_after_send") && entry.platformSendAttemptId === params.claimId;
		if (!entry || entry.requiresProducerClaim !== true || !exactOwner || typeof entry.availableAt !== "number" || entry.availableAt <= now) return;
		const expiresAt = now + PLATFORM_SEND_OWNER_LEASE_MS;
		return upsertDeliveryQueueEntry({
			queueName: params.queueName,
			entry: {
				...entry,
				availableAt: expiresAt
			},
			stateDir: params.stateDir,
			updatePendingOnly: true
		}) ? expiresAt : void 0;
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: `renew ${params.queueName} delivery platform send`
	});
}
/** Atomically fence the exact unexpired owner at the real provider boundary. */
function promoteDeliveryQueueEntryPlatformSend(params) {
	return transitionDeliveryQueueEntryPlatformSend(params, "promote", (entry, now) => entry.recoveryState === "producer_claimed" && entry.producerClaimId === params.claimId && typeof entry.availableAt === "number" && entry.availableAt > now ? {
		...entry,
		availableAt: entry.requiresProducerClaim === true ? now + PLATFORM_SEND_OWNER_LEASE_MS : void 0,
		producerClaimId: void 0,
		platformSendAttemptId: params.claimId,
		platformSendStartedAt: now,
		...params.route && "replyToId" in params.route ? { effectiveReplyToId: params.route.replyToId ?? null } : {},
		recoveryState: "send_attempt_started"
	} : void 0);
}
/** Atomically authorize dispatch, promoting a producer claim into the active attempt. */
function dispatchDeliveryQueueEntryPlatformSend(params) {
	return transitionDeliveryQueueEntryPlatformSend(params, "dispatch", (entry, now) => {
		const producerOwned = entry.recoveryState === "producer_claimed" && entry.producerClaimId === params.claimId && typeof entry.availableAt === "number" && entry.availableAt > now;
		const attemptOwned = (entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send") && entry.platformSendAttemptId === params.claimId && (entry.requiresProducerClaim !== true || typeof entry.availableAt === "number" && entry.availableAt > now);
		if (!producerOwned && !attemptOwned) return;
		return {
			...entry,
			availableAt: entry.requiresProducerClaim === true ? producerOwned ? now + PLATFORM_SEND_OWNER_LEASE_MS : entry.availableAt : void 0,
			producerClaimId: void 0,
			platformSendAttemptId: params.claimId,
			platformSendStartedAt: now,
			...params.route && "replyToId" in params.route ? { effectiveReplyToId: params.route.replyToId ?? null } : {},
			recoveryState: entry.recoveryState === "unknown_after_send" ? "unknown_after_send" : "send_attempt_started"
		};
	});
}
//#endregion
//#region src/infra/delivery-queue-sqlite-namespace.ts
function openStateDatabase(stateDir) {
	return openOpenClawStateDatabase({ env: stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} : process.env });
}
/** Atomically publishes one staged owner only when retired namespaces do not own its id. */
function commitStagedDeliveryQueueEntryOnceAcrossNamespaces(params) {
	const database = openStateDatabase(params.stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return runSqliteImmediateTransactionSync(database.db, () => {
		if (!executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select("id").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending"))) return "missing";
		if (getDeliveryQueueEntryStatuses([params.queueName, ...params.conflictQueueNames], params.entry.id, params.stateDir).size > 0) return "existing";
		if (!upsertDeliveryQueueEntry({
			queueName: params.queueName,
			entry: params.entry,
			stateDir: params.stateDir,
			insertOnly: true
		})) return "existing";
		if (executeSqliteQuerySync(database.db, queueDb.deleteFrom("delivery_queue_entries").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending")).numAffectedRows !== 1n) throw new Error(`Delivery queue staging row changed during commit: ${params.stagingQueueName}/${params.stagingId}`);
		return "created";
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "commit staged stable delivery queue owner"
	});
}
/** Inserts one stable owner only when no current or retired namespace owns its id. */
function upsertDeliveryQueueEntryOnceAcrossNamespaces(params) {
	return runSqliteImmediateTransactionSync(openStateDatabase(params.stateDir).db, () => {
		if (getDeliveryQueueEntryStatuses([params.queueName, ...params.conflictQueueNames], params.entry.id, params.stateDir).size > 0) return false;
		return upsertDeliveryQueueEntry({
			queueName: params.queueName,
			entry: params.entry,
			stateDir: params.stateDir,
			insertOnly: true
		});
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "insert stable delivery queue owner"
	});
}
/** Replaces a pending entry only while its authoritative serialized value is unchanged. */
function replacePendingDeliveryQueueEntry(params) {
	if (params.expectedEntry.id !== params.replacementEntry.id) throw new Error(`Delivery queue replacement id mismatch: ${params.expectedEntry.id} != ${params.replacementEntry.id}`);
	const database = openStateDatabase(params.stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return runSqliteImmediateTransactionSync(database.db, () => {
		const source = executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select(["entry_json", "status"]).where("queue_name", "=", params.queueName).where("id", "=", params.expectedEntry.id));
		if (!source || source.status !== "pending" || source.entry_json !== JSON.stringify(params.expectedEntry)) return false;
		return upsertDeliveryQueueEntry({
			queueName: params.queueName,
			entry: params.replacementEntry,
			stateDir: params.stateDir,
			updatePendingOnly: true
		});
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "replace pending delivery queue entry"
	});
}
/** Completes a pending entry only while its authoritative serialized value is unchanged. */
function completePendingDeliveryQueueEntry(params) {
	const database = openStateDatabase(params.stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return runSqliteImmediateTransactionSync(database.db, () => {
		const source = executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select(["entry_json", "status"]).where("queue_name", "=", params.queueName).where("id", "=", params.expectedEntry.id));
		if (!source || source.status !== "pending" || source.entry_json !== JSON.stringify(params.expectedEntry)) return false;
		completeDeliveryQueueEntry(params.queueName, params.expectedEntry.id, params.stateDir);
		return true;
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "complete pending delivery queue entry"
	});
}
/**
* Commits an asynchronously prepared replacement only if the authoritative
* source row is unchanged, then removes or terminally fences the old owner.
*/
function movePendingDeliveryQueueEntryNamespace(params) {
	const database = openStateDatabase(params.stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return runSqliteImmediateTransactionSync(database.db, () => {
		const source = executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select(["entry_json", "status"]).where("queue_name", "=", params.sourceQueueName).where("id", "=", params.expectedSourceEntry.id));
		if (!source || source.status !== "pending" || source.entry_json !== JSON.stringify(params.expectedSourceEntry)) return "source-changed";
		if (getDeliveryQueueEntryStatuses([params.destinationQueueName, ...params.conflictQueueNames ?? []], params.destinationEntry.id, params.stateDir).size > 0) return "destination-exists";
		if (params.stagingId && params.stagingQueueName) {
			if (!executeSqliteQueryTakeFirstSync(database.db, queueDb.selectFrom("delivery_queue_entries").select("id").where("queue_name", "=", params.stagingQueueName).where("id", "=", params.stagingId).where("status", "=", "pending"))) return "staging-missing";
		}
		if (!upsertDeliveryQueueEntry({
			queueName: params.destinationQueueName,
			entry: params.destinationEntry,
			stateDir: params.stateDir,
			insertOnly: true
		})) return "destination-exists";
		if (params.retainSourceCompletionFence) completeDeliveryQueueEntry(params.sourceQueueName, params.expectedSourceEntry.id, params.stateDir);
		else deleteDeliveryQueueEntry(params.sourceQueueName, params.expectedSourceEntry.id, params.stateDir);
		if (params.stagingId && params.stagingQueueName) deleteDeliveryQueueEntry(params.stagingQueueName, params.stagingId, params.stateDir);
		return "moved";
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "migrate delivery queue namespace"
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-platform-lease.ts
/** Atomically transfer a stable pending producer intent to one platform sender. */
async function claimDeliveryPlatformSendAttempt(id, stateDir, reconciledPlatformSendStartedAt, reconciledPlatformSendAttemptId) {
	return claimDeliveryQueueEntryPlatformSend({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id,
		stateDir,
		...reconciledPlatformSendStartedAt !== void 0 ? { reconciledPlatformSendStartedAt } : {},
		...reconciledPlatformSendAttemptId !== void 0 ? { reconciledPlatformSendAttemptId } : {}
	});
}
/** Claim and atomically upgrade a live reusable producer to renewable ownership. */
async function claimReusableDeliveryPlatformSendAttempt(id, stateDir) {
	return claimDeliveryQueueEntryPlatformSend({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id,
		stateDir,
		requiresProducerClaim: true
	});
}
/** Extend the exact active producer lease without changing ownership. */
async function renewDeliveryPlatformSendLease(id, stateDir, claimId) {
	return renewDeliveryQueueEntryPlatformSendLease({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id,
		stateDir,
		claimId
	});
}
/** Promote or refresh the exact live owner at recipient-visible dispatch. */
function markOwnedDeliveryPlatformSendDispatched(id, stateDir, route, claimId) {
	if (!dispatchDeliveryQueueEntryPlatformSend({
		queueName: "outbound-prepared-v1",
		id,
		stateDir,
		route,
		claimId
	})) throw new Error(`Delivery platform claim was lost: ${id}`);
}
//#endregion
//#region src/infra/outbound/delivery-queue-preparation.ts
const STABLE_PREPARATION_LEASE_MS = 5 * 6e4;
const STABLE_PREPARATION_LEASE_RENEW_MS = 3e4;
var StableDeliveryPreparationLostError = class extends Error {
	constructor(id) {
		super(`Stable outbound preparation ownership was lost: ${id}`);
		this.name = "StableDeliveryPreparationLostError";
	}
};
const STABLE_PREPARATION_CONFLICT_QUEUES = [
	OUTBOUND_DELIVERY_QUEUE_NAME,
	OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
	OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
	LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
];
function createStablePreparation(id, ownerId, now = Date.now()) {
	return {
		id,
		enqueuedAt: now,
		retryCount: 0,
		attemptCount: 0,
		retainOnFailure: true,
		preparationState: "claimed",
		preparationOwnerId: ownerId,
		preparationLeaseExpiresAt: now + STABLE_PREPARATION_LEASE_MS
	};
}
function failStablePreparation(entry, stateDir) {
	terminalizePendingDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		id: entry.id,
		entry,
		stateDir
	});
}
function claimStablePreparation(id, stateDir) {
	const ownerId = randomUUID();
	const proposed = createStablePreparation(id, ownerId);
	if (upsertDeliveryQueueEntryOnceAcrossNamespaces({
		queueName: "outbound-preparing-v1",
		conflictQueueNames: STABLE_PREPARATION_CONFLICT_QUEUES,
		entry: proposed,
		stateDir
	})) return {
		status: "claimed",
		entry: proposed
	};
	const current = loadDeliveryQueueEntry(OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME, id, stateDir);
	if (!current) return { status: "existing" };
	if ((current.preparationLeaseExpiresAt ?? 0) > Date.now()) return { status: "existing" };
	if (current.preparationState !== "claimed") {
		failStablePreparation(current, stateDir);
		return { status: "existing" };
	}
	const reclaimed = createStablePreparation(id, ownerId);
	return replacePendingDeliveryQueueEntry({
		queueName: "outbound-preparing-v1",
		expectedEntry: current,
		replacementEntry: reclaimed,
		stateDir
	}) ? {
		status: "claimed",
		entry: reclaimed
	} : { status: "existing" };
}
async function withStableDeliveryPreparation(params) {
	const claim = claimStablePreparation(params.id, params.stateDir);
	if (claim.status === "existing") return claim;
	let entry = claim.entry;
	let leaseLost = false;
	let published = false;
	const replaceEntry = (next) => {
		if (leaseLost || !replacePendingDeliveryQueueEntry({
			queueName: "outbound-preparing-v1",
			expectedEntry: entry,
			replacementEntry: next,
			stateDir: params.stateDir
		})) {
			leaseLost = true;
			throw new StableDeliveryPreparationLostError(params.id);
		}
		entry = next;
	};
	const renewLease = () => {
		try {
			replaceEntry({
				...entry,
				preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
			});
		} catch {
			leaseLost = true;
		}
	};
	const leaseTimer = setInterval(renewLease, STABLE_PREPARATION_LEASE_RENEW_MS);
	leaseTimer.unref();
	const owner = {
		current: () => entry,
		beforeFirstModifier: () => {
			replaceEntry({
				...entry,
				preparationState: "modifiers_started",
				preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
			});
		},
		markPrepared: () => {
			replaceEntry({
				...entry,
				preparationState: "prepared",
				preparationLeaseExpiresAt: Date.now() + STABLE_PREPARATION_LEASE_MS
			});
		},
		markPublished: () => {
			published = true;
		}
	};
	try {
		const value = await params.run(owner);
		if (!published && !completePendingDeliveryQueueEntry({
			queueName: "outbound-preparing-v1",
			expectedEntry: entry,
			stateDir: params.stateDir
		})) throw new Error(`Stable outbound preparation could not be settled: ${params.id}`);
		return {
			status: "claimed",
			value
		};
	} catch (error) {
		if (!published && !leaseLost) if (entry.preparationState === "claimed") {
			const released = {
				...entry,
				preparationOwnerId: void 0,
				preparationLeaseExpiresAt: 0
			};
			replacePendingDeliveryQueueEntry({
				queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
				expectedEntry: entry,
				replacementEntry: released,
				stateDir: params.stateDir
			});
		} else failStablePreparation(entry, params.stateDir);
		throw error;
	} finally {
		clearInterval(leaseTimer);
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-storage.ts
const queuedDeliveryPayloads = (entry) => acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload);
const OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS = [
	{
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		namespace: "prepared",
		retired: false
	},
	{
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		namespace: "preparing",
		retired: true
	},
	{
		queueName: OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
		namespace: "migration",
		retired: true
	},
	{
		queueName: OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		namespace: "legacy-preparing",
		retired: true
	},
	{
		queueName: LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
		namespace: "legacy",
		retired: true
	}
];
function findDeliveryIntentOwner(id, stateDir) {
	const statuses = getDeliveryQueueEntryStatuses(OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS.map(({ queueName }) => queueName), id, stateDir);
	for (const descriptor of OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS) {
		const status = statuses.get(descriptor.queueName);
		if (status) return {
			...descriptor,
			status
		};
	}
	return null;
}
function preparedBatchFromLowLevelInput(params) {
	if (params.preparedBatch) return params.preparedBatch;
	if (!params.payloads) throw new Error("Delivery queue entry requires a prepared payload batch");
	return createUnmodifiedPreparedOutboundBatch(params.payloads);
}
function createQueuedDelivery(params, id, retainOnFailure) {
	return {
		id,
		enqueuedAt: Date.now(),
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		queuePolicy: params.queuePolicy,
		requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
		...params.initialProducerClaim ?? (params.requiresProducerClaim === true ? { requiresProducerClaim: true } : {}),
		preparedBatch: projectPreparedOutboundBatchForStorage(preparedBatchFromLowLevelInput(params)),
		renderedBatchPlan: params.renderedBatchPlan,
		threadId: params.threadId,
		replyToId: params.replyToId,
		replyToMode: params.replyToMode,
		formatting: params.formatting,
		identity: params.identity,
		bestEffort: params.bestEffort,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		mirror: params.mirror,
		session: params.session,
		gatewayClientScopes: params.gatewayClientScopes,
		preparedMessageId: params.preparedMessageId,
		deliveryCompletion: params.deliveryCompletion,
		completionRetention: params.completionRetention,
		...retainOnFailure ? { retainOnFailure: true } : {},
		legacyUnknownSendReconciliation: params.legacyUnknownSendReconciliation,
		legacyPreparedContentUnavailable: params.legacyPreparedContentUnavailable,
		maxRetries: params.maxRetries,
		retryCount: 0,
		attemptCount: 0
	};
}
/** Persist a delivery entry before attempting send. Returns the entry ID. */
async function enqueueDelivery(params, stateDir, mediaStageId) {
	const id = generateSecureUuid();
	const entry = createQueuedDelivery(params, id, params.deliveryCompletion !== void 0 || params.completionRetention !== void 0);
	if (mediaStageId) {
		const result = commitStagedDeliveryQueueEntryOnceAcrossNamespaces({
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			entry,
			stagingId: mediaStageId,
			stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
			conflictQueueNames: [],
			stateDir
		});
		if (result === "missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
		if (result === "existing") throw new Error(`Delivery queue entry already exists: ${OUTBOUND_DELIVERY_QUEUE_NAME}/${id}`);
	} else upsertDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		entry,
		stateDir
	});
	return id;
}
/** Inserts one stable queue id without replacing prior pending or completed ownership. */
async function enqueueDeliveryOnce(params, id, stateDir, mediaStageId) {
	const normalizedId = id.trim();
	if (!normalizedId) throw new Error("Stable delivery queue id is required");
	const entry = createQueuedDelivery(params, normalizedId, true);
	return {
		id: normalizedId,
		created: mediaStageId ? (() => {
			const result = commitStagedDeliveryQueueEntryOnceAcrossNamespaces({
				queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
				entry,
				stagingId: mediaStageId,
				stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
				conflictQueueNames: [
					OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
					OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
					OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
					LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
				],
				stateDir
			});
			if (result === "missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
			return result === "created";
		})() : upsertDeliveryQueueEntryOnceAcrossNamespaces({
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			conflictQueueNames: [
				OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
				OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
				OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
				LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
			],
			entry,
			stateDir
		})
	};
}
/** Atomically replaces a payload-free stable preparation owner with prepared custody. */
async function enqueuePreparedDeliveryOnce(params, id, preparation, stateDir, mediaStageId) {
	const normalizedId = id.trim();
	if (!normalizedId || normalizedId !== preparation.id) throw new Error("Stable delivery preparation id is invalid");
	const entry = createQueuedDelivery(params, normalizedId, true);
	const result = movePendingDeliveryQueueEntryNamespace({
		sourceQueueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		destinationQueueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		conflictQueueNames: [
			OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
			OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
			LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
		],
		expectedSourceEntry: preparation,
		destinationEntry: entry,
		...mediaStageId ? {
			stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
			stagingId: mediaStageId
		} : {},
		stateDir
	});
	if (result === "staging-missing") throw new Error(`Delivery queue media stage expired before enqueue: ${mediaStageId}`);
	if (result !== "moved") throw new StableDeliveryPreparationLostError(normalizedId);
	return {
		id: normalizedId,
		created: true
	};
}
const lostPlatformClaim = (id) => /* @__PURE__ */ new Error(`Delivery platform claim was lost: ${id}`);
/** Remove a successfully delivered entry, or retain its producer-owned receipt. */
async function ackDelivery(id, stateDir, options) {
	let spoolPaths = [];
	const settle = (current) => {
		spoolPaths = current ? collectEntrySpoolPaths(queuedDeliveryPayloads(current), stateDir) : [];
		if (current?.completionRetention && options?.suppressCompletionReceipt !== true) completeDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
		else deleteDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	};
	if (options && "expectedPlatformSendAttemptId" in options) {
		if (!transitionOwnedDeliveryQueueEntry({
			queueName: "outbound-prepared-v1",
			id,
			stateDir,
			platformSendAttemptId: options.expectedPlatformSendAttemptId ?? null
		}, (entry) => settle(entry))) throw lostPlatformClaim(id);
	} else settle(loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir));
	if (!options?.retainSpoolArtifacts) await releaseSpoolArtifacts(spoolPaths, stateDir);
}
/** Update a queue entry after a failed delivery attempt. */
async function failDelivery(id, error, stateDir, expectedPlatformSendAttemptId) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		availableAt: void 0,
		producerClaimId: void 0,
		recoveryState: entry.recoveryState === "producer_claimed" ? void 0 : entry.recoveryState
	}), expectedPlatformSendAttemptId);
}
/** Record a failed attempt whose retry provably cannot duplicate a recipient-visible send. */
async function failDeliveryBeforePlatformSend(id, error, stateDir, expectedPlatformSendAttemptId) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendAttemptId: void 0,
		platformSendStartedAt: void 0,
		recoveryState: void 0
	}), expectedPlatformSendAttemptId);
}
/** Record a failed attempt without losing evidence that platform delivery may have completed. */
async function failDeliveryAfterPlatformSend(id, error, stateDir, expectedPlatformSendAttemptId) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		retryCount: entry.retryCount + 1,
		lastAttemptAt: Date.now(),
		lastError: error,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		recoveryState: "unknown_after_send"
	}), expectedPlatformSendAttemptId);
}
/** Reserve one durable delivery call before invoking the provider path. */
async function reserveDeliveryAttempt(id, maxAttempts, stateDir, expectedPlatformSendAttemptId) {
	return reserveDeliveryQueueEntryAttempt({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id,
		maxAttempts,
		stateDir,
		...expectedPlatformSendAttemptId ? { expectedPlatformSendAttemptId } : {}
	});
}
function updateQueuedDelivery(id, stateDir, update, expectedPlatformSendAttemptId) {
	if (expectedPlatformSendAttemptId !== void 0) {
		if (!transitionOwnedDeliveryQueueEntry({
			queueName: "outbound-prepared-v1",
			id,
			stateDir,
			platformSendAttemptId: expectedPlatformSendAttemptId
		}, () => {
			updateDeliveryQueueEntry("outbound-prepared-v1", id, stateDir, (entry) => update(entry));
		})) throw lostPlatformClaim(id);
		return;
	}
	updateDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => update(entry));
}
async function markDeliveryPlatformSendAttemptStarted(id, stateDir, route, producerClaimId) {
	if (producerClaimId) {
		if (!promoteDeliveryQueueEntryPlatformSend({
			queueName: "outbound-prepared-v1",
			id,
			claimId: producerClaimId,
			stateDir,
			route
		})) throw new Error(`Delivery platform claim was lost: ${id}`);
		return;
	}
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		...route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {},
		recoveryState: "send_attempt_started"
	}));
}
/** Refresh the attempt timestamp before recipient-visible or finalizing platform I/O. */
async function markDeliveryPlatformSendDispatched(id, stateDir, route, expectedPlatformSendAttemptId) {
	if (typeof expectedPlatformSendAttemptId === "string") {
		markOwnedDeliveryPlatformSendDispatched(id, stateDir, route, expectedPlatformSendAttemptId);
		return;
	}
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		availableAt: void 0,
		producerClaimId: void 0,
		platformSendStartedAt: Date.now(),
		...route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {},
		recoveryState: entry.recoveryState === "unknown_after_send" ? entry.recoveryState : "send_attempt_started"
	}), expectedPlatformSendAttemptId);
}
async function markDeliveryPlatformOutcomeUnknown(id, stateDir, expectedPlatformSendAttemptId) {
	updateQueuedDelivery(id, stateDir, (entry) => ({
		...entry,
		availableAt: expectedPlatformSendAttemptId && entry.requiresProducerClaim === true && entry.platformSendAttemptId === expectedPlatformSendAttemptId ? entry.availableAt : void 0,
		producerClaimId: void 0,
		platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
		recoveryState: "unknown_after_send"
	}), expectedPlatformSendAttemptId);
}
/** Load a single pending delivery entry by ID from the queue directory. */
const loadPendingDelivery = async (id, stateDir) => loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
/** Load all pending delivery entries from the queue. */
async function loadPendingDeliveries(stateDir) {
	return loadDeliveryQueueEntries(OUTBOUND_DELIVERY_QUEUE_NAME, stateDir);
}
/** One-time migration inventory; normal recovery never reads the legacy namespace. */
function loadLegacyPendingDeliveries(stateDir) {
	return loadDeliveryQueueEntries(LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, stateDir);
}
/** Prepared legacy rows awaiting media staging and canonical publication. */
function loadPendingDeliveryMigrations(stateDir) {
	return loadDeliveryQueueEntries(OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, stateDir);
}
/** Claimed pre-D4 rows whose modifying policy has not safely published yet. */
function loadPendingLegacyDeliveryPreparations(stateDir) {
	return loadDeliveryQueueEntries(OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, stateDir);
}
/** Move a queue entry out of the pending retry set. */
async function moveToFailed(id, stateDir, expectedPlatformSendAttemptId) {
	let spoolPaths;
	if (expectedPlatformSendAttemptId !== void 0) {
		spoolPaths = [];
		if (!transitionOwnedDeliveryQueueEntry({
			queueName: "outbound-prepared-v1",
			id,
			stateDir,
			platformSendAttemptId: expectedPlatformSendAttemptId
		}, (entry) => {
			spoolPaths = collectEntrySpoolPaths(queuedDeliveryPayloads(entry), stateDir);
			moveDeliveryQueueEntryToFailed("outbound-prepared-v1", id, stateDir);
		})) throw lostPlatformClaim(id);
	} else {
		const entry = await loadPendingDelivery(id, stateDir);
		if (!entry) throw new Error(`No pending outbound delivery queue entry ${id}`);
		spoolPaths = collectEntrySpoolPaths(queuedDeliveryPayloads(entry), stateDir);
		moveDeliveryQueueEntryToFailed(OUTBOUND_DELIVERY_QUEUE_NAME, id, stateDir);
	}
	return spoolPaths;
}
/** Conditionally dead-letter a freshly re-read pending entry without a claimed state. */
async function failPendingDelivery(params, stateDir) {
	let terminalized = { status: "not_pending" };
	const attemptId = inferDeliveryQueueFailureRetention(params.entry, params.id, "outbound-prepared-v1") !== void 0 ? params.entry.platformSendAttemptId ?? params.entry.producerClaimId ?? null : void 0;
	if (attemptId !== void 0) transitionOwnedDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: params.id,
		stateDir,
		platformSendAttemptId: attemptId
	}, () => {
		terminalized = terminalizePendingDeliveryQueueEntry({
			queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
			id: params.id,
			entry: params.entry,
			stateDir
		});
	});
	else terminalized = terminalizePendingDeliveryQueueEntry({
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		id: params.id,
		entry: params.entry,
		stateDir
	});
	if (terminalized.status === "terminalized") {
		if (params.retainSpoolArtifacts !== true) await releaseSpoolArtifacts(collectEntrySpoolPaths(queuedDeliveryPayloads(params.entry), stateDir), stateDir);
		return { status: "failed" };
	}
	return { status: "not_pending" };
}
//#endregion
export { createUnavailablePreparedOutboundBatch as A, claimReusableDeliveryPlatformSendAttempt as C, PLATFORM_SEND_OWNER_LEASE_MS as D, replacePendingDeliveryQueueEntry as E, preparedOutboundSuppressionOutcomes as M, projectPreparedOutboundBatchForStorage as N, createInitialDeliveryProducerClaim as O, claimDeliveryPlatformSendAttempt as S, movePendingDeliveryQueueEntryNamespace as T, markDeliveryPlatformSendDispatched as _, failDelivery as a, StableDeliveryPreparationLostError as b, failPendingDelivery as c, loadPendingDeliveries as d, loadPendingDelivery as f, markDeliveryPlatformSendAttemptStarted as g, markDeliveryPlatformOutcomeUnknown as h, enqueuePreparedDeliveryOnce as i, mapPreparedOutboundAcceptedPayloads as j, acceptedPreparedOutboundEntries as k, findDeliveryIntentOwner as l, loadPendingLegacyDeliveryPreparations as m, enqueueDelivery as n, failDeliveryAfterPlatformSend as o, loadPendingDeliveryMigrations as p, enqueueDeliveryOnce as r, failDeliveryBeforePlatformSend as s, ackDelivery as t, loadLegacyPendingDeliveries as u, moveToFailed as v, renewDeliveryPlatformSendLease as w, withStableDeliveryPreparation as x, reserveDeliveryAttempt as y };
