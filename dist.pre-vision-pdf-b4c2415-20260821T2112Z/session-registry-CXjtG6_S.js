import { randomUUID } from "node:crypto";
//#region src/gateway/desktop/session-registry.ts
const DEFAULT_LINGER_MS = 6e4;
const MAX_OBSERVERS = 8;
var DesktopSessionStaleOwnerError = class extends Error {
	constructor() {
		super("Desktop session owner epoch is stale");
		this.name = "DesktopSessionStaleOwnerError";
	}
};
var DesktopSessionStoppedError = class extends Error {
	constructor() {
		super("Desktop session stopped before connecting");
		this.name = "DesktopSessionStoppedError";
	}
};
/** Owns per-source desktop sessions and their connected observer lifetimes. */
function createDesktopSessionRegistry(deps = {}) {
	const lingerMs = deps.lingerMs ?? DEFAULT_LINGER_MS;
	const entries = /* @__PURE__ */ new Map();
	const claimedOwnerEpochs = /* @__PURE__ */ new Map();
	const claimOwnerEpoch = (sourceKey, ownerEpoch) => {
		const claimedEpoch = claimedOwnerEpochs.get(sourceKey);
		if (claimedEpoch !== void 0 && ownerEpoch < claimedEpoch) throw new DesktopSessionStaleOwnerError();
		if (claimedEpoch === void 0 || ownerEpoch > claimedEpoch) {
			claimedOwnerEpochs.set(sourceKey, ownerEpoch);
			return true;
		}
		return false;
	};
	const isCurrent = (entry) => entries.get(entry.sourceKey) === entry && !entry.stopped;
	const closeObserver = (observer, code, reason) => {
		try {
			observer.close(code, reason);
		} catch {}
	};
	const stopEntry = (entry) => {
		if (entry.stopPromise) return entry.stopPromise;
		entry.stopPromise = (async () => {
			entry.stopped = true;
			if (entries.get(entry.sourceKey) === entry) entries.delete(entry.sourceKey);
			clearTimeout(entry.lingerTimer);
			entry.lingerTimer = void 0;
			for (const observer of entry.observers) {
				observer.released = true;
				closeObserver(observer, 1012, "desktop tunnel closed");
			}
			entry.observers.clear();
			entry.controller = void 0;
			for (const pending of entry.pendingStreams.values()) {
				pending.reservation.release();
				pending.stream.destroy();
			}
			entry.pendingStreams.clear();
			entry.observerReservations.clear();
			if (!entry.readySettled) {
				entry.readySettled = true;
				entry.rejectReady(new DesktopSessionStoppedError());
			}
			await entry.teardown?.().catch(() => void 0);
			await entry.initialization?.catch(() => void 0);
			await entry.teardown?.().catch(() => void 0);
		})();
		return entry.stopPromise;
	};
	const scheduleLinger = (entry) => {
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = setTimeout(() => void stopEntry(entry), lingerMs);
		entry.lingerTimer.unref?.();
	};
	async function startSession(request) {
		claimOwnerEpoch(request.sourceKey, request.ownerEpoch);
		const current = entries.get(request.sourceKey);
		if (current) {
			if (request.ownerEpoch < current.ownerEpoch) throw new DesktopSessionStaleOwnerError();
			if (request.ownerEpoch === current.ownerEpoch) return await current.ready;
		}
		let resolveReady;
		let rejectReady;
		const ready = new Promise((resolve, reject) => {
			resolveReady = resolve;
			rejectReady = reject;
		});
		ready.catch(() => void 0);
		const entry = {
			sourceKey: request.sourceKey,
			ownerEpoch: request.ownerEpoch,
			ready,
			resolveReady,
			rejectReady,
			readySettled: false,
			observers: /* @__PURE__ */ new Set(),
			observerReservations: /* @__PURE__ */ new Set(),
			pendingStreams: /* @__PURE__ */ new Map(),
			stopped: false,
			start: request.start,
			...request.teardown ? { teardown: request.teardown } : {}
		};
		entries.set(request.sourceKey, entry);
		entry.initialization = (async () => {
			if (current) await stopEntry(current);
			if (!isCurrent(entry)) return;
			const result = await entry.start(() => isCurrent(entry));
			if (!isCurrent(entry)) return;
			entry.readySettled = true;
			entry.resolveReady(result);
		})();
		entry.initialization.catch((error) => {
			if (!entry.readySettled) {
				entry.readySettled = true;
				entry.rejectReady(error instanceof Error ? error : /* @__PURE__ */ new Error("Desktop session failed"));
			}
			stopEntry(entry);
		});
		return await ready;
	}
	async function acquire(request) {
		const result = await startSession(request);
		if (!result) throw new Error("Desktop session attachment is unavailable");
		return result;
	}
	async function activate(request) {
		await startSession({
			...request,
			start: async () => void 0
		});
		const entry = entries.get(request.sourceKey);
		if (entry?.ownerEpoch === request.ownerEpoch && entry.observers.size === 0 && entry.observerReservations.size === 0) scheduleLinger(entry);
	}
	function attachObserver(sourceKey, observer) {
		const entry = entries.get(sourceKey);
		if (!entry || !entry.readySettled || entry.stopped || entry.observers.size + entry.observerReservations.size >= MAX_OBSERVERS) return;
		if (observer.ownerEpoch !== entry.ownerEpoch) return;
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = void 0;
		if (observer.control && entry.controller) {
			const previous = entry.controller;
			previous.released = true;
			entry.observers.delete(previous);
			entry.controller = void 0;
			closeObserver(previous, 4e3, "control-taken");
		}
		const attached = {
			...observer,
			released: false
		};
		entry.observers.add(attached);
		if (attached.control) entry.controller = attached;
		return { release() {
			if (attached.released) return;
			attached.released = true;
			entry.observers.delete(attached);
			if (entry.controller === attached) entry.controller = void 0;
			if (entry.observers.size === 0 && entry.observerReservations.size === 0 && isCurrent(entry)) scheduleLinger(entry);
		} };
	}
	function reserveObserver(sourceKey, ownerEpoch) {
		const entry = entries.get(sourceKey);
		if (!entry || entry.stopped || entry.ownerEpoch !== ownerEpoch || entry.observers.size + entry.observerReservations.size >= MAX_OBSERVERS) return;
		const reservationId = Symbol("desktop-observer");
		entry.observerReservations.add(reservationId);
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = void 0;
		let released = false;
		return {
			sourceKey,
			ownerEpoch,
			release() {
				if (released) return;
				released = true;
				entry.observerReservations.delete(reservationId);
				if (entry.observers.size === 0 && entry.observerReservations.size === 0 && isCurrent(entry)) scheduleLinger(entry);
			}
		};
	}
	function publishStream(params) {
		const entry = entries.get(params.sourceKey);
		if (!entry || entry.stopped || entry.ownerEpoch !== params.ownerEpoch || params.reservation.sourceKey !== params.sourceKey || params.reservation.ownerEpoch !== params.ownerEpoch) {
			params.reservation.release();
			params.stream.destroy();
			return;
		}
		if (params.stream.destroyed || params.stream.readableEnded || params.stream.writableEnded) {
			params.reservation.release();
			params.stream.destroy();
			return;
		}
		const streamId = randomUUID();
		const pending = {
			stream: params.stream,
			reservation: params.reservation
		};
		entry.pendingStreams.set(streamId, pending);
		params.stream.once("close", () => {
			if (entry.pendingStreams.get(streamId) === pending) {
				entry.pendingStreams.delete(streamId);
				params.reservation.release();
			}
		});
		return {
			kind: "stream",
			streamId
		};
	}
	function claimStream(attachment) {
		for (const entry of entries.values()) {
			const pending = entry.pendingStreams.get(attachment.streamId);
			if (!pending) continue;
			entry.pendingStreams.delete(attachment.streamId);
			pending.reservation.release();
			const stream = pending.stream;
			if (stream.destroyed || stream.readableEnded || stream.writableEnded) {
				stream.destroy();
				return;
			}
			return stream;
		}
	}
	function hasPendingStream(attachment) {
		for (const entry of entries.values()) if (entry.pendingStreams.has(attachment.streamId)) return true;
		return false;
	}
	async function stop(sourceKey, ownerEpoch) {
		const entry = entries.get(sourceKey);
		if (entry && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch)) await stopEntry(entry);
	}
	/**
	* Retires only owners strictly older than the claimant. An equal epoch shares the
	* session, so fencing must not tear down a peer that claimed the same generation.
	*/
	async function stopSuperseded(sourceKey, ownerEpoch) {
		const entry = entries.get(sourceKey);
		if (entry && entry.ownerEpoch < ownerEpoch) await stopEntry(entry);
	}
	async function stopAll() {
		await Promise.all([...entries.values()].map(stopEntry));
	}
	return {
		acquire,
		activate,
		attachObserver,
		publishStream,
		claimStream,
		hasPendingStream,
		reserveObserver,
		claimOwnerEpoch,
		isOwnerEpochCurrent: (sourceKey, ownerEpoch) => claimedOwnerEpochs.get(sourceKey) === ownerEpoch,
		stop,
		stopSuperseded,
		stopAll
	};
}
//#endregion
export { DesktopSessionStoppedError as n, createDesktopSessionRegistry as r, DesktopSessionStaleOwnerError as t };
