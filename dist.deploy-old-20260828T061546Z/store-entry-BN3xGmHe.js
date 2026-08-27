import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { c as parseAgentSessionKey, f as parseThreadSessionSuffix, o as normalizeSessionKeyPreservingOpaquePeerIds, p as requiresFoldedSessionKeyAliasProof } from "./session-key-utils-Di3FvABa.js";
import { u as validateSessionId } from "./paths-DVAvlIOc.js";
import { t as writeTextAtomic } from "./json-files-E5e5TtK3.js";
import { S as normalizeConversationPeerId } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { d as sessionDeliveryOrigin, n as deliveryContextFromSession } from "./delivery-context.shared-azPdmUls.js";
import { r as normalizeSessionIconValue } from "./session-agent-status-Cz4bCpx5.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/shared/store-writer-queue.ts
const activeStoreWriters = resolveGlobalSingleton(Symbol.for("openclaw.activeStoreWriters"), () => new AsyncLocalStorage());
function isActiveStoreWriter(queues, storePath) {
	let active = activeStoreWriters.getStore();
	while (active) {
		if (active.active && active.queues === queues && active.storePath === storePath) return true;
		active = active.parent;
	}
	return false;
}
async function runActiveStoreWriter(queues, storePath, fn) {
	const writer = {
		active: true,
		parent: activeStoreWriters.getStore(),
		queues,
		storePath
	};
	try {
		return await activeStoreWriters.run(writer, fn);
	} finally {
		writer.active = false;
	}
}
function getOrCreateStoreWriterQueue(queues, storePath) {
	const existing = queues.get(storePath);
	if (existing) return existing;
	const created = {
		running: false,
		pending: [],
		drainPromise: null
	};
	queues.set(storePath, created);
	return created;
}
async function drainStoreWriterQueue(queues, storePath) {
	const queue = queues.get(storePath);
	if (!queue) return;
	if (queue.drainPromise) {
		await queue.drainPromise;
		return;
	}
	queue.running = true;
	queue.drainPromise = (async () => {
		try {
			while (queue.pending.length > 0) {
				const task = queue.pending.shift();
				if (!task) continue;
				let result;
				let failed;
				let hasFailure = false;
				try {
					result = await task.fn();
				} catch (err) {
					hasFailure = true;
					failed = err;
				}
				if (hasFailure) {
					task.reject(failed);
					continue;
				}
				task.resolve(result);
			}
		} finally {
			queue.running = false;
			queue.drainPromise = null;
			if (queue.pending.length === 0) queues.delete(storePath);
			else queueMicrotask(() => {
				drainStoreWriterQueue(queues, storePath);
			});
		}
	})();
	await queue.drainPromise;
}
/** Runs one store write after prior writes for the same store path have finished. */
async function runQueuedStoreWrite(params) {
	if (!params.storePath || typeof params.storePath !== "string") throw new Error(`${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`);
	if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath)) return await params.fn();
	const queue = getOrCreateStoreWriterQueue(params.queues, params.storePath);
	return await new Promise((resolve, reject) => {
		const task = {
			fn: async () => await runActiveStoreWriter(params.queues, params.storePath, params.fn),
			resolve: (value) => resolve(value),
			reject
		};
		queue.pending.push(task);
		drainStoreWriterQueue(params.queues, params.storePath);
	});
}
/** Rejects pending queued writes and clears queue state for test cleanup. */
function clearStoreWriterQueuesForTest(queues, message) {
	for (const queue of queues.values()) for (const task of queue.pending) task.reject(new Error(message));
	queues.clear();
}
//#endregion
//#region src/config/sessions/store-entry-shape.ts
function isSafeSessionId(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 255 || trimmed !== trimmed.normalize("NFC")) return false;
	if (trimmed.includes("/") || trimmed.includes("\\") || trimmed === "." || trimmed === "..") return false;
	return /^[\p{L}\p{N}][\p{L}\p{N}\p{M}._:@-]*$/u.test(trimmed);
}
function normalizeTranscriptSessionId(value) {
	try {
		return validateSessionId(value);
	} catch {
		return;
	}
}
function normalizeOptionalTimestamp(value) {
	return value === void 0 ? void 0 : typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}
/** Removes retired runtime locator fields before a session entry is persisted or returned. */
function projectCanonicalSessionEntryShape(value) {
	const { sessionFile: _retiredSessionFile, transcriptPath: _retiredTranscriptPath, pendingFinalDeliveryCreatedAt, pendingFinalDeliveryLastAttemptAt: _pendingFinalDeliveryLastAttemptAt, pendingFinalDeliveryAttemptCount: _pendingFinalDeliveryAttemptCount, pendingFinalDeliveryLastError: _pendingFinalDeliveryLastError, pendingFinalDeliveryText, pendingFinalDeliveryContext, pendingFinalDeliveryIntentId, fallbackNoticeSelectedModel, fallbackNoticeActiveModel, fallbackNoticeReason, memoryFlushAt: _memoryFlushAt, memoryFlushCompactionCount, memoryFlushContextHash: _memoryFlushContextHash, memoryFlushFailureCount, memoryFlushLastFailedAt: _memoryFlushLastFailedAt, memoryFlushLastFailureError: _memoryFlushLastFailureError, owner: _projectedOwner, participants: _projectedParticipants, participantCount: _projectedParticipantCount, ...canonicalValue } = value;
	const icon = typeof canonicalValue.icon === "string" ? normalizeSessionIconValue(canonicalValue.icon) : null;
	if (icon) canonicalValue.icon = icon;
	else delete canonicalValue.icon;
	const legacyPendingText = normalizeOptionalString(pendingFinalDeliveryText);
	const legacySelectedModel = normalizeOptionalString(fallbackNoticeSelectedModel);
	const legacyActiveModel = normalizeOptionalString(fallbackNoticeActiveModel);
	const legacyFlushCompactionCount = normalizeCount(memoryFlushCompactionCount);
	const legacyFlushFailureCount = normalizeCount(memoryFlushFailureCount);
	const intentId = normalizeOptionalString(pendingFinalDeliveryIntentId);
	const pendingFinalDelivery = normalizePendingFinalDelivery(canonicalValue.pendingFinalDelivery) ?? (legacyPendingText || value.pendingFinalDelivery === true ? {
		...legacyPendingText ? {
			kind: "replayable",
			text: legacyPendingText
		} : { kind: "transport-only" },
		createdAt: normalizeOptionalTimestamp(pendingFinalDeliveryCreatedAt) ?? normalizeOptionalTimestamp(value.updatedAt) ?? 0,
		...isRecord(pendingFinalDeliveryContext) ? { context: pendingFinalDeliveryContext } : {},
		...intentId ? { intentId } : {}
	} : void 0);
	if (pendingFinalDelivery) canonicalValue.pendingFinalDelivery = pendingFinalDelivery;
	else delete canonicalValue.pendingFinalDelivery;
	const pendingDeliveryNotice = normalizePendingDeliveryNotice(canonicalValue.pendingDeliveryNotice);
	if (pendingDeliveryNotice) canonicalValue.pendingDeliveryNotice = pendingDeliveryNotice;
	else delete canonicalValue.pendingDeliveryNotice;
	const pendingTranscriptRepair = normalizePendingTranscriptRepair(canonicalValue.pendingTranscriptRepair);
	if (pendingTranscriptRepair) canonicalValue.pendingTranscriptRepair = pendingTranscriptRepair;
	else delete canonicalValue.pendingTranscriptRepair;
	const reason = normalizeOptionalString(fallbackNoticeReason);
	const fallbackNotice = normalizeFallbackNotice(canonicalValue.fallbackNotice) ?? (legacySelectedModel && legacyActiveModel ? {
		kind: "active",
		selectedModel: legacySelectedModel,
		activeModel: legacyActiveModel,
		...reason ? { reason } : {}
	} : void 0);
	if (fallbackNotice) canonicalValue.fallbackNotice = fallbackNotice;
	else delete canonicalValue.fallbackNotice;
	const memoryFlush = normalizeMemoryFlush(canonicalValue.memoryFlush) ?? (legacyFlushFailureCount && legacyFlushFailureCount > 0 ? {
		kind: "failed",
		...legacyFlushCompactionCount !== void 0 ? { compactionCount: legacyFlushCompactionCount } : {},
		failureCount: legacyFlushFailureCount
	} : legacyFlushCompactionCount !== void 0 ? {
		kind: "succeeded",
		compactionCount: legacyFlushCompactionCount
	} : void 0);
	if (memoryFlush) canonicalValue.memoryFlush = memoryFlush;
	else delete canonicalValue.memoryFlush;
	return canonicalValue;
}
/** Removes the runtime-only skill catalog without mutating the live session snapshot. */
function stripRuntimeOnlySessionSkillsFields(entry) {
	const snapshot = entry.skillsSnapshot;
	if (snapshot?.resolvedSkills === void 0) return entry;
	const { resolvedSkills: _drop, ...skillsSnapshot } = snapshot;
	return {
		...entry,
		skillsSnapshot
	};
}
function normalizePendingFinalDelivery(value) {
	if (!isRecord(value)) return;
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	if (createdAt === void 0) return;
	const intentId = normalizeOptionalString(value.intentId);
	const deliveries = normalizePendingFinalDeliveries(value.deliveries);
	const base = {
		createdAt,
		...isRecord(value.context) ? { context: value.context } : {},
		...intentId ? { intentId } : {},
		...deliveries ? { deliveries } : {}
	};
	if (value.kind === "transport-only") return {
		kind: "transport-only",
		...base
	};
	const text = normalizeOptionalString(value.text);
	return value.kind === "replayable" && text ? {
		kind: "replayable",
		text,
		...base
	} : void 0;
}
function normalizePendingFinalDeliveries(value) {
	if (!Array.isArray(value)) return;
	const deliveries = value.flatMap((item) => {
		const id = isRecord(item) ? normalizeOptionalString(item.id) : void 0;
		const state = isRecord(item) ? item.state : void 0;
		return id && (state === "prepared" || state === "queued" || state === "delivered" || state === "suppressed" || state === "unknown") ? [{
			id,
			state
		}] : [];
	});
	return deliveries.length > 0 ? deliveries : void 0;
}
function normalizePendingDeliveryNotice(value) {
	if (!isRecord(value) || !isRecord(value.context)) return;
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	const intentId = normalizeOptionalString(value.intentId);
	return createdAt !== void 0 && intentId && (value.state === "owed" || value.state === "unresolved") ? {
		createdAt,
		context: value.context,
		intentId,
		state: value.state
	} : void 0;
}
function normalizePendingTranscriptRepair(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	const normalized = [];
	for (const item of value) {
		const record = normalizePendingTranscriptRepairRecord(item);
		if (record) normalized.push(record);
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizePendingTranscriptRepairRecord(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id);
	const text = normalizeOptionalString(value.text);
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	if (!id || !text || createdAt === void 0) return;
	const provider = normalizeOptionalString(value.provider);
	const model = normalizeOptionalString(value.model);
	return {
		id,
		text,
		...provider ? { provider } : {},
		...model ? { model } : {},
		createdAt
	};
}
function normalizeFallbackNotice(value) {
	if (!isRecord(value) || value.kind !== "active") return;
	const selectedModel = normalizeOptionalString(value.selectedModel);
	const activeModel = normalizeOptionalString(value.activeModel);
	const reason = normalizeOptionalString(value.reason);
	return selectedModel && activeModel ? {
		kind: "active",
		selectedModel,
		activeModel,
		...reason ? { reason } : {}
	} : void 0;
}
function normalizeMemoryFlush(value) {
	if (!isRecord(value)) return;
	const compactionCount = normalizeCount(value.compactionCount);
	if (value.kind === "succeeded" && compactionCount !== void 0) return {
		kind: "succeeded",
		compactionCount
	};
	const failureCount = normalizeCount(value.failureCount);
	if (value.kind !== "failed" || !failureCount) return;
	return {
		kind: "failed",
		...compactionCount !== void 0 ? { compactionCount } : {},
		failureCount
	};
}
function normalizeCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
/** Normalizes persisted session store entries before they reach runtime callers. */
function normalizePersistedSessionEntryShape(value, options = {}) {
	if (!isRecord(value)) return;
	const modelSelectionLocked = value.modelSelectionLocked === true;
	let next = projectCanonicalSessionEntryShape(value);
	if (value.sessionId !== void 0) {
		if (!isSafeSessionId(value.sessionId)) return;
		const sessionId = value.sessionId.trim();
		const legacySessionFile = value.sessionFile;
		if (!modelSelectionLocked && options.sessionKey !== void 0 && parseAgentSessionKey(options.sessionKey) !== null && sessionId === options.sessionKey && (value.initializationPending === true || typeof legacySessionFile !== "string" || !legacySessionFile.trim())) {
			const { sessionId: _legacyPendingSessionId, ...pendingEntry } = next;
			next = {
				...pendingEntry,
				initializationPending: true
			};
		} else {
			if (modelSelectionLocked && sessionId !== value.sessionId) return;
			if (!normalizeTranscriptSessionId(sessionId)) return;
			if (sessionId !== value.sessionId) next = {
				...next,
				sessionId
			};
		}
	}
	const updatedAt = normalizeOptionalTimestamp(value.updatedAt);
	if (updatedAt !== value.updatedAt) next.updatedAt = updatedAt ?? 0;
	return next;
}
//#endregion
//#region src/config/sessions/skill-prompt-blobs.ts
const PROMPT_BLOB_DIR = "skills-prompts";
const PROMPT_BLOB_ALGORITHM = "sha256";
const PROMPT_BLOB_VERSION = 1;
const MIN_PROMPT_BLOB_CHARS = 512;
const MAX_PROMPT_BLOB_BYTES = 512 * 1024;
const PROMPT_REF_CACHE_MAX_ENTRIES = 256;
const VALID_PROMPT_BLOB_CACHE_MAX_ENTRIES = 256;
const promptRefCache = /* @__PURE__ */ new Map();
const validPromptBlobCache = /* @__PURE__ */ new Map();
function hashPrompt(prompt) {
	return crypto.createHash(PROMPT_BLOB_ALGORITHM).update(prompt).digest("hex");
}
function clearSessionSkillPromptRefCache() {
	promptRefCache.clear();
	validPromptBlobCache.clear();
}
function isSha256Hex(value) {
	return /^[a-f0-9]{64}$/u.test(value);
}
function resolveSessionSkillPromptBlobPath(storePath, hash) {
	if (!isSha256Hex(hash)) return null;
	return path.join(path.dirname(path.resolve(storePath)), PROMPT_BLOB_DIR, PROMPT_BLOB_ALGORITHM, hash.slice(0, 2), `${hash}.txt`);
}
function buildPromptRef(prompt) {
	const cached = promptRefCache.get(prompt);
	if (cached) return cached;
	const ref = {
		version: PROMPT_BLOB_VERSION,
		algorithm: PROMPT_BLOB_ALGORITHM,
		hash: hashPrompt(prompt),
		bytes: Buffer.byteLength(prompt, "utf8")
	};
	promptRefCache.set(prompt, ref);
	pruneMapToMaxSize(promptRefCache, PROMPT_REF_CACHE_MAX_ENTRIES);
	return ref;
}
function shouldStorePromptAsBlob(prompt) {
	const bytes = Buffer.byteLength(prompt, "utf8");
	return prompt.length >= MIN_PROMPT_BLOB_CHARS && bytes <= MAX_PROMPT_BLOB_BYTES;
}
function rememberValidPromptBlob(blobPath, stat, prompt) {
	validPromptBlobCache.set(blobPath, {
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		prompt
	});
	pruneMapToMaxSize(validPromptBlobCache, VALID_PROMPT_BLOB_CACHE_MAX_ENTRIES);
}
function readValidPromptBlob(storePath, ref) {
	if (ref.version !== PROMPT_BLOB_VERSION || ref.algorithm !== PROMPT_BLOB_ALGORITHM || !isSha256Hex(ref.hash) || typeof ref.bytes !== "number" || !Number.isFinite(ref.bytes) || ref.bytes < 0 || ref.bytes > MAX_PROMPT_BLOB_BYTES) return null;
	const blobPath = resolveSessionSkillPromptBlobPath(storePath, ref.hash);
	if (!blobPath) return null;
	try {
		const stat = fs.statSync(blobPath);
		if (!stat.isFile() || stat.size !== ref.bytes) {
			validPromptBlobCache.delete(blobPath);
			return null;
		}
		const cached = validPromptBlobCache.get(blobPath);
		if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached.prompt;
		const prompt = fs.readFileSync(blobPath, "utf8");
		if (hashPrompt(prompt) !== ref.hash || Buffer.byteLength(prompt, "utf8") !== ref.bytes) {
			validPromptBlobCache.delete(blobPath);
			return null;
		}
		rememberValidPromptBlob(blobPath, stat, prompt);
		return prompt;
	} catch {
		validPromptBlobCache.delete(blobPath);
		return null;
	}
}
async function ensurePromptBlob(storePath, prompt) {
	const ref = buildPromptRef(prompt);
	const blobPath = resolveSessionSkillPromptBlobPath(storePath, ref.hash);
	if (!blobPath) return ref;
	if (readValidPromptBlob(storePath, ref) === prompt) try {
		const now = /* @__PURE__ */ new Date();
		await fs.promises.utimes(blobPath, now, now);
		rememberValidPromptBlob(blobPath, await fs.promises.stat(blobPath), prompt);
		return ref;
	} catch {}
	await fs.promises.mkdir(path.dirname(blobPath), { recursive: true });
	await writeTextAtomic(blobPath, prompt, {
		durable: false,
		mode: 384,
		tempPrefix: path.basename(blobPath)
	});
	rememberValidPromptBlob(blobPath, await fs.promises.stat(blobPath), prompt);
	return ref;
}
function stripPromptForPersistence(entry, ref) {
	const { prompt: _prompt, ...snapshot } = entry.skillsSnapshot;
	return {
		...entry,
		skillsSnapshot: {
			...snapshot,
			promptRef: ref
		}
	};
}
function projectSessionStoreForPersistence(params) {
	let persisted = params.store;
	let changed = false;
	const promptBlobs = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(params.store)) {
		let projectedEntry = stripRuntimeOnlySessionSkillsFields(entry);
		const prompt = projectedEntry.skillsSnapshot?.prompt;
		if (prompt && shouldStorePromptAsBlob(prompt)) {
			const promptRef = buildPromptRef(prompt);
			promptBlobs.set(promptRef.hash, {
				ref: promptRef,
				path: resolveSessionSkillPromptBlobPath(params.storePath, promptRef.hash),
				prompt
			});
			projectedEntry = stripPromptForPersistence(projectedEntry, promptRef);
		}
		if (projectedEntry === entry) continue;
		if (persisted === params.store) persisted = { ...params.store };
		persisted[key] = projectedEntry;
		changed = true;
	}
	return {
		store: persisted,
		changed,
		promptBlobs
	};
}
async function ensureSessionStorePromptBlobsForPersistence(params) {
	for (const blob of params.promptBlobs) await ensurePromptBlob(params.storePath, blob.prompt);
}
function parsePromptRef(value) {
	if (!value || typeof value !== "object") return null;
	const ref = value;
	return ref.version === PROMPT_BLOB_VERSION && ref.algorithm === PROMPT_BLOB_ALGORITHM && typeof ref.hash === "string" && typeof ref.bytes === "number" ? {
		version: ref.version,
		algorithm: ref.algorithm,
		hash: ref.hash,
		bytes: ref.bytes
	} : null;
}
function hydrateSessionStoreSkillPromptRefs(params) {
	let changed = false;
	for (const [key, value] of Object.entries(params.store)) {
		if (!value || typeof value !== "object" || Array.isArray(value)) continue;
		const entry = value;
		const snapshot = entry.skillsSnapshot;
		if (!snapshot || typeof snapshot.prompt === "string") continue;
		const promptRef = parsePromptRef(snapshot.promptRef);
		const prompt = promptRef ? readValidPromptBlob(params.storePath, promptRef) : null;
		if (!prompt) {
			const nextEntry = { ...entry };
			delete nextEntry.skillsSnapshot;
			params.store[key] = nextEntry;
			changed = true;
			continue;
		}
		const { promptRef: _promptRef, ...rest } = snapshot;
		params.store[key] = {
			...entry,
			skillsSnapshot: {
				...rest,
				prompt
			}
		};
		changed = true;
	}
	return changed;
}
//#endregion
//#region src/config/sessions/store-writer-state.ts
const WRITER_QUEUES = /* @__PURE__ */ new Map();
const SQLITE_SESSION_WRITER_QUEUES = /* @__PURE__ */ new Map();
/** Clears session writer queues and prompt-blob caches for tests. */
function clearSessionStoreCacheForTest() {
	clearSessionSkillPromptRefCache();
	clearStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
	clearStoreWriterQueuesForTest(SQLITE_SESSION_WRITER_QUEUES, "SQLite session store queue cleared for test");
}
//#endregion
//#region src/config/sessions/store-entry.ts
function normalizeStoreSessionKey(sessionKey) {
	return normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
}
function foldedSessionKeyAliasCandidates(normalizedKey) {
	const aliases = /* @__PURE__ */ new Set();
	const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalizedKey);
	if (foldedLegacyKey !== normalizedKey) aliases.add(foldedLegacyKey);
	if (requiresFoldedSessionKeyAliasProof(normalizedKey)) {
		const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
		const foldedBaseKey = normalizeLowercaseStringOrEmpty(baseSessionKey);
		if (baseSessionKey && threadId && foldedBaseKey !== baseSessionKey) aliases.add(`${foldedBaseKey}:thread:${threadId}`);
	}
	return [...aliases];
}
/** The case-sensitive room/peer target an entry actually delivers to. Delivery
*  metadata preserves the real opaque id even when the session KEY was lowercased
*  by the bug, so it distinguishes a lowercased artifact from a distinct room. */
function normalizeEntryTarget(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	const sigilIndexes = ["!", "#"].map((sigil) => trimmed.indexOf(sigil)).filter((index) => index >= 0);
	if (sigilIndexes.length === 0) return trimmed;
	return trimmed.slice(Math.min(...sigilIndexes));
}
function entryDeliveryTargets(entry) {
	const context = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	return [
		context?.to,
		origin?.nativeChannelId,
		origin?.to,
		entry?.groupId
	].map(normalizeEntryTarget).filter(Boolean);
}
function normalizeEntryThreadId(value) {
	if (value == null) return "";
	if (typeof value !== "string" && typeof value !== "number") return "";
	return String(value).trim();
}
function entryThreadId(entry) {
	return normalizeEntryThreadId(deliveryContextFromSession(entry)?.threadId);
}
/** Tail-preserved keys like Matrix rooms need delivery-target proof before a
*  folded key is treated as a legacy alias. Segment-preserved legacy keys
*  (Signal groups) keep their old permissive lowercase fallback. */
function isConfirmedLowercasedLegacyAlias(entry, normalizedKey) {
	if (!entry) return false;
	if (!requiresFoldedSessionKeyAliasProof(normalizedKey)) return true;
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
	const normalizedBaseKey = baseSessionKey ?? normalizedKey;
	if (!entryDeliveryTargets(entry).some((target) => normalizedBaseKey.includes(target))) return false;
	if (!threadId) return true;
	return entryThreadId(entry) === threadId;
}
function hasMismatchedCaseSensitiveDeliveryProof(entry, normalizedKey) {
	if (!entry || !requiresFoldedSessionKeyAliasProof(normalizedKey)) return false;
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
	const normalizedBaseKey = baseSessionKey ?? normalizedKey;
	const targets = entryDeliveryTargets(entry);
	if (targets.length > 0 && !targets.some((target) => normalizedBaseKey.includes(target))) return true;
	const storedThreadId = entryThreadId(entry);
	return Boolean(threadId && storedThreadId && storedThreadId !== threadId);
}
/** Restores an opaque case-sensitive peer only when the row's delivery target proves it. */
function resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) {
	const normalizedKey = normalizeStoreSessionKey(sessionKey);
	const delivery = deliveryContextFromSession(entry);
	const channel = delivery?.channel?.trim().toLowerCase();
	const peerId = channel && delivery?.to ? normalizeConversationPeerId(channel, delivery.to) : void 0;
	if (!channel || !peerId) return normalizedKey;
	const parsedThread = parseThreadSessionSuffix(normalizedKey);
	const baseSessionKey = parsedThread.baseSessionKey ?? normalizedKey;
	const foldedBase = baseSessionKey.toLowerCase();
	let peerStart = -1;
	for (const peerKind of ["channel", "group"]) {
		const marker = `${channel}:${peerKind}:`;
		const nestedMarkerIndex = foldedBase.lastIndexOf(`:${marker}`);
		const markerIndex = foldedBase.startsWith(marker) ? 0 : nestedMarkerIndex >= 0 ? nestedMarkerIndex + 1 : -1;
		if (markerIndex >= 0) peerStart = Math.max(peerStart, markerIndex + marker.length);
	}
	if (peerStart < 0) return normalizedKey;
	if (baseSessionKey.slice(peerStart).toLowerCase() !== peerId.toLowerCase()) return normalizedKey;
	const threadId = parsedThread.threadId ? String(delivery?.threadId ?? parsedThread.threadId).trim() : void 0;
	const candidate = normalizeStoreSessionKey(`${baseSessionKey.slice(0, peerStart)}${peerId}${threadId ? `:thread:${threadId}` : ""}`);
	return candidate !== normalizedKey && foldedSessionKeyAliasCandidates(candidate).includes(normalizedKey) && isConfirmedLowercasedLegacyAlias(entry, candidate) ? candidate : normalizedKey;
}
function collectSessionEntryLookupKeys(_database, sessionKey) {
	const trimmedKey = sessionKey.trim();
	return trimmedKey ? [.../* @__PURE__ */ new Set([trimmedKey, ...foldedSessionKeyAliasCandidates(normalizeStoreSessionKey(trimmedKey))])] : [];
}
function resolveSessionEntryCandidates(params) {
	const trimmedKey = params.sessionKey.trim();
	const normalizedKey = normalizeStoreSessionKey(trimmedKey);
	const foldedLegacyKeys = foldedSessionKeyAliasCandidates(normalizedKey);
	const entries = new Map(params.entries.map((candidate) => [candidate.sessionKey, candidate]));
	const legacyKeySet = /* @__PURE__ */ new Set();
	const trimmedCandidate = entries.get(trimmedKey);
	if (trimmedKey !== normalizedKey && trimmedCandidate && !hasMismatchedCaseSensitiveDeliveryProof(trimmedCandidate.entry, normalizedKey)) legacyKeySet.add(trimmedKey);
	let foldedLegacyEntry;
	let foldedLegacyUpdatedAt = 0;
	for (const foldedLegacyKey of foldedLegacyKeys) {
		const candidate = entries.get(foldedLegacyKey);
		if (!candidate || !isConfirmedLowercasedLegacyAlias(candidate.entry, normalizedKey)) continue;
		legacyKeySet.add(foldedLegacyKey);
		const updatedAt = candidate.entry.updatedAt ?? 0;
		if (!foldedLegacyEntry || updatedAt > foldedLegacyUpdatedAt) {
			foldedLegacyEntry = candidate;
			foldedLegacyUpdatedAt = updatedAt;
		}
	}
	const exactEntry = entries.get(normalizedKey);
	const usableExactEntry = hasMismatchedCaseSensitiveDeliveryProof(exactEntry?.entry, normalizedKey) ? void 0 : exactEntry;
	const exactKeyWins = requiresFoldedSessionKeyAliasProof(normalizedKey);
	const fallbackLegacyEntry = legacyKeySet.size > 0 && !hasMismatchedCaseSensitiveDeliveryProof(trimmedCandidate?.entry, normalizedKey) ? trimmedCandidate : void 0;
	let existing = exactKeyWins ? usableExactEntry ?? foldedLegacyEntry ?? fallbackLegacyEntry : void 0;
	let existingUpdatedAt = existing?.entry.updatedAt ?? 0;
	if (!exactKeyWins) for (const candidate of [
		usableExactEntry,
		foldedLegacyEntry,
		fallbackLegacyEntry
	]) {
		const candidateUpdatedAt = candidate?.entry.updatedAt ?? 0;
		if (candidate && (!existing || candidateUpdatedAt > existingUpdatedAt)) {
			existing = candidate;
			existingUpdatedAt = candidateUpdatedAt;
		}
	}
	for (const [candidateKey, candidate] of entries) {
		if (candidateKey === normalizedKey) continue;
		if (normalizeStoreSessionKey(candidateKey) !== normalizedKey) continue;
		if (hasMismatchedCaseSensitiveDeliveryProof(candidate.entry, normalizedKey)) continue;
		legacyKeySet.add(candidateKey);
		const candidateUpdatedAt = candidate.entry.updatedAt ?? 0;
		if (!existing || candidateUpdatedAt > existingUpdatedAt) {
			existing = candidate;
			existingUpdatedAt = candidateUpdatedAt;
		}
	}
	return {
		normalizedKey,
		existing,
		legacyKeys: [...legacyKeySet]
	};
}
function resolveSessionStoreEntryCore(params) {
	const resolved = resolveSessionEntryCandidates({
		entries: Object.entries(params.store).map(([sessionKey, entry]) => ({
			entry,
			sessionKey
		})),
		sessionKey: params.sessionKey
	});
	return {
		normalizedKey: resolved.normalizedKey,
		existing: resolved.existing?.entry,
		legacyKeys: resolved.legacyKeys
	};
}
//#endregion
export { runQueuedStoreWrite as _, normalizeStoreSessionKey as a, SQLITE_SESSION_WRITER_QUEUES as c, ensureSessionStorePromptBlobsForPersistence as d, hydrateSessionStoreSkillPromptRefs as f, stripRuntimeOnlySessionSkillsFields as g, projectCanonicalSessionEntryShape as h, isConfirmedLowercasedLegacyAlias as i, WRITER_QUEUES as l, normalizePersistedSessionEntryShape as m, foldedSessionKeyAliasCandidates as n, resolveDeliveryProvenCanonicalSessionKey as o, projectSessionStoreForPersistence as p, hasMismatchedCaseSensitiveDeliveryProof as r, resolveSessionStoreEntryCore as s, collectSessionEntryLookupKeys as t, clearSessionStoreCacheForTest as u };
