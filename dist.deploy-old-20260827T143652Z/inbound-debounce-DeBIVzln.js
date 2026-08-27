import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { M as resolveNonNegativeIntegerOption, N as resolveOptionalIntegerOption } from "./number-coercion-oCkfUEEq.js";
import "./errors-CSNUPl5U.js";
//#region src/auto-reply/inbound-debounce.ts
const resolveMs = (value) => resolveOptionalIntegerOption(value, { min: 0 });
const resolveChannelOverride = (params) => {
	if (!params.byChannel) return;
	return resolveMs(params.byChannel[params.channel]);
};
/** Resolve effective inbound debounce milliseconds from explicit, channel, and global config. */
function resolveInboundDebounceMs(params) {
	const inbound = params.cfg.messages?.inbound;
	const override = resolveMs(params.overrideMs);
	const byChannel = resolveChannelOverride({
		byChannel: inbound?.byChannel,
		channel: params.channel
	});
	const base = resolveMs(inbound?.debounceMs);
	return override ?? byChannel ?? base ?? 0;
}
/**
* Start one flush and bind its admission signal to the turn lifecycle.
* Completion also releases admission for gated work that never enters a session lane.
*/
function createInboundDebounceFlush(params) {
	let resolveAdmission;
	let admitted = false;
	const admission = new Promise((resolve) => {
		resolveAdmission = resolve;
	});
	const markAdmitted = () => {
		if (admitted) return;
		admitted = true;
		resolveAdmission();
	};
	const source = params.lifecycle;
	const lifecycle = {
		abortSignal: source?.abortSignal ?? new AbortController().signal,
		onAdopted: async () => {
			await source?.onAdopted?.();
			markAdmitted();
		},
		onDeferred: () => {
			const accepted = source?.onDeferred?.();
			if (accepted !== false) markAdmitted();
			return accepted;
		},
		onAdoptionFinalizing: () => source?.onAdoptionFinalizing?.(),
		onFailed: source?.onFailed ? async (error) => {
			try {
				await source.onFailed?.(error);
			} finally {
				markAdmitted();
			}
		} : void 0,
		onAbandoned: async () => {
			await source?.onAbandoned?.();
		}
	};
	let completion;
	try {
		completion = params.dispatch(lifecycle);
	} catch (error) {
		completion = Promise.reject(toErrorObject(error, "Inbound debounce dispatch failed"));
	}
	completion = completion.then(markAdmitted).catch(async (error) => {
		if (!admitted && lifecycle.onFailed) await Promise.allSettled([lifecycle.onFailed(error)]);
		markAdmitted();
		throw error;
	});
	return {
		admission,
		completion
	};
}
const DEFAULT_MAX_TRACKED_KEYS = 2048;
const MAX_DEBOUNCE_WINDOW_MULTIPLIER = 5;
/** Create a keyed debouncer with flush/cancel controls and same-key serialization. */
function createInboundDebouncer(params) {
	const buffers = /* @__PURE__ */ new Map();
	const keyChains = /* @__PURE__ */ new Map();
	const keyGenerations = /* @__PURE__ */ new Map();
	const activeCompletions = /* @__PURE__ */ new Set();
	const defaultDebounceMs = resolveNonNegativeIntegerOption(params.debounceMs, 0);
	const maxTrackedKeys = Math.max(1, Math.trunc(params.maxTrackedKeys ?? DEFAULT_MAX_TRACKED_KEYS));
	const resolveDebounceMs = (item) => {
		const resolved = params.resolveDebounceMs?.(item);
		return resolveNonNegativeIntegerOption(resolved, defaultDebounceMs);
	};
	const reportFlushError = (err, items) => {
		try {
			params.onError?.(err, items);
		} catch {}
	};
	const runFlush = async (items) => {
		let flush;
		try {
			flush = params.onFlush(items, createInboundDebounceFlush);
		} catch (err) {
			reportFlushError(err, items);
			return;
		}
		let reported = false;
		const reportOnce = (err) => {
			if (reported) return;
			reported = true;
			reportFlushError(err, items);
		};
		const admission = flush.admission.catch(reportOnce);
		const completion = flush.completion.catch(reportOnce);
		activeCompletions.add(completion);
		const cleanup = () => activeCompletions.delete(completion);
		completion.then(cleanup, cleanup);
		await Promise.race([admission, completion]);
	};
	const cancelItems = (items) => {
		try {
			params.onCancel?.(items);
		} catch {}
	};
	const resolveKeyGeneration = (key) => keyGenerations.get(key) ?? 0;
	const runQueuedFlush = async (key, generation, items) => {
		if (resolveKeyGeneration(key) !== generation) {
			cancelItems(items);
			return;
		}
		await runFlush(items);
	};
	const enqueueKeyTask = (key, task) => {
		const next = (keyChains.get(key) ?? Promise.resolve()).catch(() => void 0).then(task);
		const settled = next.catch(() => void 0);
		keyChains.set(key, settled);
		const cleanup = () => {
			if (keyChains.get(key) === settled) {
				keyChains.delete(key);
				if (!buffers.has(key)) keyGenerations.delete(key);
			}
		};
		settled.then(cleanup, cleanup);
		return next;
	};
	const runKeyTaskNow = (key, task) => {
		let resolveSettled;
		const settled = new Promise((resolve) => {
			resolveSettled = resolve;
		});
		keyChains.set(key, settled);
		const cleanup = () => {
			resolveSettled();
			if (keyChains.get(key) === settled) {
				keyChains.delete(key);
				if (!buffers.has(key)) keyGenerations.delete(key);
			}
		};
		let next;
		try {
			next = task();
		} catch (err) {
			cleanup();
			throw err;
		}
		next.then(cleanup, cleanup);
		return next;
	};
	const enqueueReservedKeyTask = (key, task) => {
		let readyReleased = false;
		let releaseReady;
		const ready = new Promise((resolve) => {
			releaseReady = resolve;
		});
		return {
			task: enqueueKeyTask(key, async () => {
				await ready;
				await task();
			}),
			release: () => {
				if (readyReleased) return;
				readyReleased = true;
				releaseReady();
			}
		};
	};
	const releaseBuffer = (buffer) => {
		if (buffer.readyReleased) return;
		buffer.readyReleased = true;
		buffer.releaseReady();
	};
	const flushBuffer = async (key, buffer) => {
		if (buffers.get(key) === buffer) buffers.delete(key);
		if (buffer.timeout) {
			clearTimeout(buffer.timeout);
			buffer.timeout = null;
		}
		releaseBuffer(buffer);
		await buffer.task;
	};
	const flushKey = async (key) => {
		const buffer = buffers.get(key);
		if (!buffer) return;
		await flushBuffer(key, buffer);
	};
	const cancelKey = (key) => {
		const buffer = buffers.get(key);
		if (!buffer && !keyChains.has(key)) return false;
		keyGenerations.set(key, resolveKeyGeneration(key) + 1);
		if (!buffer) return true;
		if (buffers.get(key) === buffer) buffers.delete(key);
		if (buffer.timeout) {
			clearTimeout(buffer.timeout);
			buffer.timeout = null;
		}
		const canceledItems = buffer.items;
		buffer.items = [];
		cancelItems(canceledItems);
		releaseBuffer(buffer);
		return true;
	};
	const scheduleFlush = (key, buffer) => {
		if (buffer.timeout) clearTimeout(buffer.timeout);
		const delayMs = Math.min(buffer.debounceMs, Math.max(0, buffer.flushDeadlineMs - performance.now()));
		buffer.timeout = setTimeout(() => {
			flushBuffer(key, buffer);
		}, delayMs);
		buffer.timeout.unref?.();
	};
	const canTrackKey = (key) => {
		if (buffers.has(key) || keyChains.has(key)) return true;
		return (/* @__PURE__ */ new Set([...buffers.keys(), ...keyChains.keys()])).size < maxTrackedKeys;
	};
	const enqueue = async (item) => {
		const key = params.buildKey(item);
		const debounceMs = resolveDebounceMs(item);
		if (!(debounceMs > 0 && (params.shouldDebounce?.(item) ?? true)) || !key) {
			if (key) {
				if (buffers.has(key)) {
					const generation = resolveKeyGeneration(key);
					const reservedTask = enqueueReservedKeyTask(key, async () => {
						await runQueuedFlush(key, generation, [item]);
					});
					try {
						await flushKey(key);
					} finally {
						reservedTask.release();
					}
					await reservedTask.task;
					return;
				}
				if (keyChains.has(key)) {
					const generation = resolveKeyGeneration(key);
					await enqueueKeyTask(key, async () => {
						await runQueuedFlush(key, generation, [item]);
					});
					return;
				}
				if (params.serializeImmediate) {
					await runKeyTaskNow(key, async () => {
						await runFlush([item]);
					});
					return;
				}
				await runFlush([item]);
			} else await runFlush([item]);
			return;
		}
		const existing = buffers.get(key);
		if (existing) {
			existing.items.push(item);
			existing.debounceMs = debounceMs;
			scheduleFlush(key, existing);
			return;
		}
		if (!canTrackKey(key)) {
			const generation = resolveKeyGeneration(key);
			await enqueueKeyTask(key, async () => {
				await runQueuedFlush(key, generation, [item]);
			});
			return;
		}
		const generation = resolveKeyGeneration(key);
		const reservedTask = enqueueReservedKeyTask(key, async () => {
			if (buffer.items.length === 0) return;
			const items = buffer.items;
			if (resolveKeyGeneration(key) !== generation) buffer.items = [];
			await runQueuedFlush(key, generation, items);
		});
		const buffer = {
			items: [item],
			timeout: null,
			debounceMs,
			flushDeadlineMs: performance.now() + debounceMs * MAX_DEBOUNCE_WINDOW_MULTIPLIER,
			releaseReady: reservedTask.release,
			readyReleased: false,
			task: reservedTask.task
		};
		buffers.set(key, buffer);
		scheduleFlush(key, buffer);
	};
	const drain = async () => {
		while (keyChains.size > 0 || activeCompletions.size > 0) await Promise.all([...keyChains.values(), ...activeCompletions]);
	};
	return {
		enqueue,
		flushKey,
		cancelKey,
		drain
	};
}
//#endregion
export { resolveInboundDebounceMs as n, createInboundDebouncer as t };
