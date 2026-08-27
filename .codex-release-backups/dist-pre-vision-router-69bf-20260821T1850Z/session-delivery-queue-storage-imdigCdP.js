import { n as computeBackoff } from "./src-BQ327IOM.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { a as getDeliveryQueueEntryStatus, c as loadDeliveryQueueEntry, l as moveDeliveryQueueEntryToFailed, m as upsertDeliveryQueueEntry, p as updateDeliveryQueueEntry, s as loadDeliveryQueueEntries, t as completeDeliveryQueueEntry } from "./delivery-queue-sqlite-BQG-Kk03.js";
//#region src/infra/session-delivery-queue-storage.ts
const SESSION_DELIVERY_QUEUE_NAME = "session";
function prepareClaimedSessionDelivery(params, initialAttemptLeaseMs, now = Date.now()) {
	return {
		...params,
		retainOnFailure: true,
		id: buildEntryId(params.idempotencyKey),
		enqueuedAt: now,
		retryCount: 0,
		availableAt: now + Math.max(0, initialAttemptLeaseMs)
	};
}
var SessionDeliveryDeferredError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SessionDeliveryDeferredError";
	}
};
/** Signals that retry budget was already persisted before a later transition failed. */
var SessionDeliveryRetryChargedError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "SessionDeliveryRetryChargedError";
	}
};
/** Signals that durable pre-delivery ownership could not be established. */
var SessionDeliveryAttemptStartError = class extends Error {
	constructor(..._args3) {
		super(..._args3);
		this.name = "SessionDeliveryAttemptStartError";
	}
};
/** Signals that delivery proved no external or transcript side effect committed. */
var SessionDeliverySafeRetryError = class extends Error {
	constructor(..._args4) {
		super(..._args4);
		this.name = "SessionDeliverySafeRetryError";
	}
};
/** Signals that recovery must settle this pending row as failed without replaying delivery. */
var SessionDeliveryDeadLetteredError = class extends Error {
	constructor(..._args5) {
		super(..._args5);
		this.name = "SessionDeliveryDeadLetteredError";
	}
};
function buildEntryId(idempotencyKey) {
	if (!idempotencyKey) return generateSecureUuid();
	return sha256Hex(idempotencyKey);
}
/** Enqueue a session delivery and return its durable id. */
async function enqueueSessionDelivery(params, stateDir) {
	const id = buildEntryId(params.idempotencyKey);
	const entry = {
		...params,
		...params.completionRetention === "permanent" ? { retainOnFailure: true } : {},
		id,
		enqueuedAt: Date.now(),
		retryCount: 0
	};
	upsertDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry,
		stateDir,
		insertOnly: true
	});
	return id;
}
/** Enqueue and lease the first attempt to one caller before recovery can see it as eligible. */
async function enqueueClaimedSessionDelivery(params, initialAttemptLeaseMs, stateDir) {
	const entry = prepareClaimedSessionDelivery(params, initialAttemptLeaseMs);
	const id = entry.id;
	const claimed = upsertDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry,
		stateDir,
		insertOnly: true
	});
	let status;
	try {
		status = claimed ? "pending" : getDeliveryQueueEntryStatus(SESSION_DELIVERY_QUEUE_NAME, id, stateDir);
	} catch {
		return {
			id,
			claimed,
			status: "unknown"
		};
	}
	return {
		id,
		claimed,
		status: status ?? "completed"
	};
}
/** Release the initial-attempt lease so runtime recovery can retry immediately. */
async function releaseSessionDeliveryClaim(id, stateDir) {
	updateDeliveryQueueEntry(SESSION_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => ({
		...entry,
		availableAt: Date.now()
	}));
}
/** Defer a currently owned delivery without consuming its retry budget. */
async function deferSessionDelivery(id, delayMs, stateDir) {
	updateDeliveryQueueEntry(SESSION_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => ({
		...entry,
		availableAt: Date.now() + Math.max(0, delayMs)
	}));
}
/** Advance only after a completed agent turn proves a fresh run is safe. */
async function advanceSessionDeliveryAgentRun(id, updates, stateDir) {
	updateDeliveryQueueEntry(SESSION_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => {
		const queued = entry;
		if (queued.kind !== "agentTurn") return queued;
		return {
			...queued,
			agentRunAttempt: (queued.agentRunAttempt ?? 0) + 1,
			deliveryStartedAt: void 0,
			...updates?.message ? { message: updates.message } : {},
			...updates?.expectedMediaUrls ? { expectedMediaUrls: updates.expectedMediaUrls } : {},
			...updates?.suppressTextDelivery === true ? { suppressTextDelivery: true } : {}
		};
	});
}
/** Mark an agent turn before it can commit transcript or channel side effects. */
async function markSessionDeliveryAttemptStarted(entry, stateDir) {
	try {
		if (!upsertDeliveryQueueEntry({
			queueName: "session",
			entry: {
				...entry,
				deliveryStartedAt: entry.deliveryStartedAt ?? Date.now()
			},
			stateDir,
			updatePendingOnly: true
		})) throw new Error(`Session delivery ${entry.id} is no longer pending`);
	} catch (error) {
		throw new SessionDeliveryAttemptStartError(`Session delivery ${entry.id} could not persist attempt ownership`, { cause: error });
	}
}
/** Signals that a delivered result still needs durable settlement finalization. */
var SessionDeliveryAcknowledgementFinalizeError = class extends Error {
	constructor(id, options) {
		super(`Session delivery ${id} still needs settlement finalization`, options);
		this.name = "SessionDeliveryAcknowledgementFinalizeError";
	}
};
/** Persist terminal delivery state while retaining settlement cleanup metadata. */
async function markSessionDeliverySettlement(entry, outcome, stateDir) {
	try {
		if (upsertDeliveryQueueEntry({
			queueName: "session",
			entry: {
				...entry,
				settlementOutcome: outcome,
				...outcome === "recovered" ? { acknowledgedAt: entry.acknowledgedAt ?? Date.now() } : {}
			},
			stateDir,
			updatePendingOnly: true
		})) return;
		if (getDeliveryQueueEntryStatus("session", entry.id, stateDir) === "completed") return;
		throw new Error(`Session delivery ${entry.id} is no longer pending`);
	} catch (error) {
		try {
			if (getDeliveryQueueEntryStatus("session", entry.id, stateDir) === "completed") return;
		} catch {}
		throw new SessionDeliveryAcknowledgementFinalizeError(entry.id, { cause: error });
	}
}
/** Replace a settled pending row with its completed idempotency tombstone. */
async function completeSessionDelivery(id, stateDir) {
	try {
		completeDeliveryQueueEntry(SESSION_DELIVERY_QUEUE_NAME, id, stateDir);
	} catch (error) {
		try {
			if (getDeliveryQueueEntryStatus("session", id, stateDir) === "completed") return;
		} catch {}
		throw new SessionDeliveryAcknowledgementFinalizeError(id, { cause: error });
	}
}
/** Record a failed delivery attempt and increment retry metadata. */
async function failSessionDelivery(id, error, stateDir, options) {
	updateDeliveryQueueEntry(SESSION_DELIVERY_QUEUE_NAME, id, stateDir, (entry) => {
		const queued = entry;
		const retryCount = queued.retryCount + 1;
		const now = Date.now();
		return {
			...queued,
			retryCount,
			...queued.kind === "agentTurn" ? { lastChargedAgentRunAttempt: queued.agentRunAttempt ?? 0 } : {},
			...options?.releaseAttemptOwnership === true ? { deliveryStartedAt: void 0 } : {},
			lastAttemptAt: now,
			...queued.kind === "agentTurn" && queued.owner?.kind === "subagent_completion" ? { availableAt: now + computeBackoff({
				initialMs: 15e3,
				factor: 2,
				maxMs: 5 * 6e4,
				jitter: .2
			}, retryCount) } : {},
			lastError: error
		};
	});
}
/** Load one pending session delivery by durable id. */
async function loadPendingSessionDelivery(id, stateDir) {
	return loadDeliveryQueueEntry(SESSION_DELIVERY_QUEUE_NAME, id, stateDir);
}
/** Load all pending session deliveries in retry order. */
async function loadPendingSessionDeliveries(stateDir) {
	return loadDeliveryQueueEntries(SESSION_DELIVERY_QUEUE_NAME, stateDir);
}
/** Move an exhausted session delivery out of the pending queue. */
async function moveSessionDeliveryToFailed(id, stateDir) {
	try {
		moveDeliveryQueueEntryToFailed(SESSION_DELIVERY_QUEUE_NAME, id, stateDir);
	} catch (error) {
		try {
			if (getDeliveryQueueEntryStatus("session", id, stateDir) === "failed") return;
		} catch {}
		throw error;
	}
}
//#endregion
export { markSessionDeliverySettlement as _, SessionDeliveryDeferredError as a, releaseSessionDeliveryClaim as b, advanceSessionDeliveryAgentRun as c, enqueueClaimedSessionDelivery as d, enqueueSessionDelivery as f, markSessionDeliveryAttemptStarted as g, loadPendingSessionDelivery as h, SessionDeliveryDeadLetteredError as i, completeSessionDelivery as l, loadPendingSessionDeliveries as m, SessionDeliveryAcknowledgementFinalizeError as n, SessionDeliveryRetryChargedError as o, failSessionDelivery as p, SessionDeliveryAttemptStartError as r, SessionDeliverySafeRetryError as s, SESSION_DELIVERY_QUEUE_NAME as t, deferSessionDelivery as u, moveSessionDeliveryToFailed as v, prepareClaimedSessionDelivery as y };
