import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { p as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, f as parseThreadSessionSuffix, i as isCronSessionKey, n as isAcpSessionKey, u as parseRawSessionConversationRef } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { a as isPrimarySessionTranscriptFileName, c as isSessionStoreTempArtifactName, i as isMigrationArchiveArtifactName, l as isTrajectorySessionArtifactName, o as isRetainedSessionTranscriptArchiveName, r as isCompactionCheckpointTranscriptFileName, s as isSessionArchiveArtifactName, t as SESSION_STORE_TEMP_STALE_MS } from "./artifacts-Cg2BoGvO.js";
import { i as resolveSessionFilePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as writeTextAtomic } from "./json-files-C6dF5uZO.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { i as normalizeChatChannelId } from "./ids-BDKYF0d6.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { L as ensureLoopGovernorTurnCountsSchema, d as openOpenClawStateDatabase } from "./openclaw-state-db-CXrhNigN.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import "./registry-BYAHQp83.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-BwPPBT4p.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Dp7mvsA3.js";
import { u as parseByteSize } from "./zod-schema-YA3pcCEJ.js";
import "./config-CW-q_d35.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { s as isGatewaySubordinateWorkAdmissionClosed, t as GatewayDrainingError } from "./gateway-work-admission-QDz202p9.js";
import { d as sessionDeliveryOrigin } from "./delivery-context.shared-D-qPZITK.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-CWrpiLCs.js";
import { c as clearStoreWriterQueuesForTest, l as runQueuedStoreWrite } from "./store-entry-BgSA4iwU.js";
import { n as listDurableSqliteTargetPathsForSessionStorePath } from "./session-sqlite-target-CgxvSLWw.js";
import { a as enqueueSystemEvent } from "./system-events-B0eLVp5j.js";
import { a as tryLoadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-CUuLg79-.js";
import { a as resolveTrajectoryFilePath, o as resolveTrajectoryPointerFilePath } from "./paths-Dlm8qCpR.js";
import crypto, { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
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
		const prompt = entry.skillsSnapshot?.prompt;
		if (!prompt || !shouldStorePromptAsBlob(prompt)) continue;
		const promptRef = buildPromptRef(prompt);
		promptBlobs.set(promptRef.hash, {
			ref: promptRef,
			path: resolveSessionSkillPromptBlobPath(params.storePath, promptRef.hash),
			prompt
		});
		if (persisted === params.store) persisted = { ...params.store };
		persisted[key] = stripPromptForPersistence(entry, promptRef);
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
/** Clears legacy session writer queues and prompt-blob caches for tests. */
function clearSessionStoreCacheForTest() {
	clearSessionSkillPromptRefCache();
	clearStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
}
//#endregion
//#region src/config/sessions/store-writer.ts
async function runExclusiveSessionStoreWrite(storePath, fn, opts = {}) {
	return await runQueuedStoreWrite({
		queues: WRITER_QUEUES,
		storePath,
		label: "runExclusiveSessionStoreWrite",
		fn,
		reentrant: opts.reentrant
	});
}
//#endregion
//#region src/sessions/loop-governor.ts
const log$1 = createSubsystemLogger("loop-governor");
const HOUR_MS = 36e5;
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
/** Typed rejection surfaced to the supervisor loop on a budget breach. */
var LoopGovernorBudgetExceededError = class extends Error {
	constructor(agentId, hourBucket, count, maxTurnsPerHour) {
		super(`[loop-governor] agent "${agentId}" exceeded non-interactive turn budget ${maxTurnsPerHour}/hour (hour ${hourBucket}, count ${count}); parked.`);
		this.agentId = agentId;
		this.hourBucket = hourBucket;
		this.count = count;
		this.maxTurnsPerHour = maxTurnsPerHour;
		this.code = "LOOP_GOVERNOR_BUDGET_EXCEEDED";
		this.name = "LoopGovernorBudgetExceededError";
	}
};
/** Resolve the active loop-governor policy from the runtime config, or null when off. */
function resolveLoopGovernorPolicy(cfg) {
	const lb = cfg?.agents?.loopGovernor;
	if (!lb || !Array.isArray(lb.agents) || lb.agents.length === 0) return null;
	const agents = /* @__PURE__ */ new Set();
	for (const id of lb.agents) {
		const normalized = normalizeOptionalString(id)?.toLowerCase();
		if (normalized) agents.add(normalized);
	}
	if (agents.size === 0) return null;
	return {
		agents,
		maxTurnsPerHour: lb.maxTurnsPerHour,
		alertChannel: lb.alertChannel
	};
}
/** UTC-hour bucket for a timestamp, so counts reset at each UTC hour boundary. */
function loopGovernorHourBucket(nowMs) {
	return Math.floor(nowMs / HOUR_MS);
}
/** True when a session key is classified non-interactive (cron:/subagent:/incognito:). */
function isNonInteractiveSessionKey(sessionKey) {
	return isCronSessionKey(sessionKey) || isSubagentSessionKey(sessionKey) || isIncognitoSessionKey(sessionKey);
}
/** Agent id from an agent-scoped session key, if any. */
function agentIdFromSessionKey(sessionKey) {
	return parseAgentSessionKey(sessionKey)?.agentId;
}
function ensureSchema(options) {
	const state = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(state.db)) return;
	ensureLoopGovernorTurnCountsSchema(state.db);
	ensuredDatabases.add(state.db);
}
function readTurnCount(db, agentId, hourBucket) {
	const row = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("loop_governor_turn_counts").select(["turn_count", "alerted"]).where("agent_id", "=", agentId).where("hour_bucket", "=", hourBucket)).rows[0];
	return row ? {
		count: Number(row.turn_count),
		alerted: Number(row.alerted)
	} : {
		count: 0,
		alerted: 0
	};
}
function upsertTurnCount(db, agentId, hourBucket, turnCount, alerted, nowMs) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("loop_governor_turn_counts").values({
		agent_id: agentId,
		hour_bucket: hourBucket,
		turn_count: turnCount,
		alerted,
		updated_at_ms: nowMs
	}).onConflict((conflict) => conflict.columns(["agent_id", "hour_bucket"]).doUpdateSet({
		turn_count: turnCount,
		alerted,
		updated_at_ms: nowMs
	})));
}
/**
* Enforce the per-agent hourly non-interactive budget for one admission and
* record the turn. Returns true when the admission may proceed; throws
* LoopGovernorBudgetExceededError to park it. Interactive and non-governed
* admissions always return true. Fail-open: a state read/write error logs and
* admits rather than hanging a supervisor loop.
*/
function checkLoopGovernorAdmission(params) {
	const nowMs = params.nowMs ?? Date.now();
	const policy = resolveLoopGovernorPolicy(params.cfg !== void 0 ? params.cfg : getRuntimeConfigSnapshot());
	if (!policy) return true;
	const agentId = agentIdFromSessionKey(params.sessionKey);
	if (!agentId || !policy.agents.has(agentId.toLowerCase())) return true;
	if (!isNonInteractiveSessionKey(params.sessionKey)) return true;
	const normalizedAgent = agentId.toLowerCase();
	const hourBucket = loopGovernorHourBucket(nowMs);
	const sessionKey = normalizeOptionalString(params.sessionKey) ?? void 0;
	const onAlert = params.onAlert ?? ((text, policy) => deliverLoopGovernorAlert(text, policy, { sessionKey }));
	try {
		ensureSchema(params.stateOptions ?? {});
		const state = openOpenClawStateDatabase(params.stateOptions ?? {});
		const { count, alerted } = readTurnCount(state.db, normalizedAgent, hourBucket);
		if (count >= policy.maxTurnsPerHour) {
			if (alerted === 0) onAlert(`[loop-governor] agent "${agentId}" reached ${policy.maxTurnsPerHour} non-interactive turns this UTC hour (${hourBucket}); further non-interactive runs parked until the next hour.`, policy);
			log$1.warn("[loop-governor] breach", {
				agentId: normalizedAgent,
				hourBucket,
				turnCount: count,
				maxTurnsPerHour: policy.maxTurnsPerHour,
				sessionKey
			});
			upsertTurnCount(state.db, normalizedAgent, hourBucket, count, 1, nowMs);
			throw new LoopGovernorBudgetExceededError(normalizedAgent, hourBucket, count, policy.maxTurnsPerHour);
		}
		upsertTurnCount(state.db, normalizedAgent, hourBucket, count + 1, alerted, nowMs);
		return true;
	} catch (error) {
		if (error instanceof LoopGovernorBudgetExceededError) throw error;
		log$1.warn(`[loop-governor] state persist failure for ${normalizedAgent}: ${String(error)}`);
		return true;
	}
}
/** Default alert delivery through the existing system-event notification path. */
function deliverLoopGovernorAlert(text, _policy, params) {
	const { sessionKey } = params;
	if (!sessionKey) return;
	try {
		enqueueSystemEvent(text, { sessionKey });
	} catch (error) {
		log$1.warn(`[loop-governor] failed to enqueue breach alert: ${String(error)}`);
	}
}
//#endregion
//#region src/sessions/session-lifecycle-identity.ts
function normalizeSessionIdentities(scope, identities) {
	const normalizedScope = scope.trim();
	if (!normalizedScope) throw new Error("session lifecycle scope is required");
	return Array.from(new Set(Array.from(identities, (identity) => identity?.trim()).filter((identity) => Boolean(identity)))).map((identity) => JSON.stringify([normalizedScope, identity])).toSorted();
}
function decodeSessionIdentity(normalizedIdentity) {
	try {
		const decoded = JSON.parse(normalizedIdentity);
		if (!Array.isArray(decoded) || decoded.length !== 2 || typeof decoded[0] !== "string" || typeof decoded[1] !== "string") return;
		return {
			scope: decoded[0],
			identity: decoded[1]
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/sessions/session-work-admission-handoff.ts
const SESSION_WORK_ADMISSION_HANDOFFS = resolveGlobalSingleton(Symbol.for("openclaw.sessionWorkAdmissionHandoffs"), () => /* @__PURE__ */ new Map());
function createSessionWorkAdmissionHandoff(admission, lease) {
	const handoffId = randomUUID();
	admission.handoffIds.add(handoffId);
	SESSION_WORK_ADMISSION_HANDOFFS.set(handoffId, {
		admission,
		lease
	});
	return handoffId;
}
function clearSessionWorkAdmissionHandoffs(admission) {
	for (const handoffId of admission.handoffIds) SESSION_WORK_ADMISSION_HANDOFFS.delete(handoffId);
	admission.handoffIds.clear();
}
/**
* Atomically adopts a previously admitted work lease across an in-process RPC.
* The opaque token is single-use; requested identities must be covered by the lease.
*/
function consumeSessionWorkAdmissionHandoff(params) {
	const handoffId = params.handoffId.trim();
	if (!handoffId) return;
	const handoff = SESSION_WORK_ADMISSION_HANDOFFS.get(handoffId);
	if (!handoff) return;
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	if (identities.length === 0 || identities.some((identity) => !handoff.admission.identities.has(identity))) return;
	SESSION_WORK_ADMISSION_HANDOFFS.delete(handoffId);
	handoff.admission.handoffIds.delete(handoffId);
	handoff.admission.interrupt = params.onInterrupt;
	if (handoff.admission.interrupted) params.onInterrupt?.();
	return handoff.lease;
}
/** Releases a handoff that was never consumed; the adopter owns consumed leases. */
function cancelSessionWorkAdmissionHandoff(handoffId) {
	const normalizedHandoffId = handoffId.trim();
	const handoff = SESSION_WORK_ADMISSION_HANDOFFS.get(normalizedHandoffId);
	if (!handoff) return false;
	SESSION_WORK_ADMISSION_HANDOFFS.delete(normalizedHandoffId);
	handoff.admission.handoffIds.delete(normalizedHandoffId);
	handoff.lease.release();
	return true;
}
//#endregion
//#region src/sessions/session-lifecycle-admission.ts
const SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS = 15e3;
/** Pick the first agent-scoped session key from the admission identities, if any. */
function pickAgentSessionKey(identities) {
	for (const identity of identities) {
		const raw = decodeSessionIdentity(identity)?.identity ?? identity;
		if (raw && agentIdFromSessionKey(raw)) return raw;
	}
}
const SESSION_LIFECYCLE_ADMISSION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.sessionLifecycleAdmissionState"), () => ({
	lifecycleQueues: /* @__PURE__ */ new Map(),
	mutationQueues: /* @__PURE__ */ new Map(),
	activeAdmissions: /* @__PURE__ */ new Map(),
	activeMutations: /* @__PURE__ */ new Map(),
	activeMutationRuns: /* @__PURE__ */ new Set(),
	activeMutationKinds: /* @__PURE__ */ new Map(),
	idleWaiters: /* @__PURE__ */ new Map(),
	currentAdmissions: new AsyncLocalStorage()
}));
const { lifecycleQueues: SESSION_LIFECYCLE_QUEUES, mutationQueues: SESSION_LIFECYCLE_MUTATION_QUEUES, activeAdmissions: ACTIVE_SESSION_WORK_ADMISSIONS, activeMutations: ACTIVE_SESSION_LIFECYCLE_MUTATIONS, activeMutationKinds: ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS, idleWaiters: SESSION_LIFECYCLE_IDLE_WAITERS, currentAdmissions: CURRENT_SESSION_WORK_ADMISSIONS } = SESSION_LIFECYCLE_ADMISSION_STATE;
const ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS = SESSION_LIFECYCLE_ADMISSION_STATE.activeMutationRuns ??= /* @__PURE__ */ new Set();
async function runWithSessionIdentityLocks(identities, index, run, kind = "lifecycle") {
	const identity = identities[index];
	if (!identity) return await run();
	return await runQueuedStoreWrite({
		queues: kind === "mutation" ? SESSION_LIFECYCLE_MUTATION_QUEUES : SESSION_LIFECYCLE_QUEUES,
		storePath: identity,
		label: kind === "mutation" ? "runExclusiveSessionLifecycleMutation" : "runExclusiveSessionLifecycle",
		reentrant: true,
		fn: async () => await runWithSessionIdentityLocks(identities, index + 1, run, kind)
	});
}
function hasActiveSessionLifecycleMutation(identities) {
	return identities.some((identity) => (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0) > 0);
}
function hasOnlyActiveSessionLifecycleMutationKind(identities, kind) {
	let foundActiveMutation = false;
	for (const identity of identities) {
		const activeCount = ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0;
		if (activeCount === 0) continue;
		foundActiveMutation = true;
		if ((ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity)?.get(kind) ?? 0) !== activeCount) return false;
	}
	return foundActiveMutation;
}
async function waitForNormalizedSessionLifecycleMutationIdle(identities, signal) {
	const activeIdentities = identities.filter((identity) => (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0) > 0);
	if (activeIdentities.length === 0) return;
	signal?.throwIfAborted();
	const idle = Promise.all(activeIdentities.map((identity) => new Promise((resolve) => {
		const waiters = SESSION_LIFECYCLE_IDLE_WAITERS.get(identity) ?? /* @__PURE__ */ new Set();
		waiters.add(resolve);
		SESSION_LIFECYCLE_IDLE_WAITERS.set(identity, waiters);
	})));
	if (!signal) {
		await idle;
		return;
	}
	let rejectAborted = () => {};
	const aborted = new Promise((_, reject) => {
		rejectAborted = () => reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("session work admission aborted"));
		signal.addEventListener("abort", rejectAborted, { once: true });
	});
	try {
		await Promise.race([idle, aborted]);
	} finally {
		signal.removeEventListener("abort", rejectAborted);
	}
}
async function runExclusiveSessionLifecycle(params) {
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	while (true) {
		params.signal?.throwIfAborted();
		if (hasActiveSessionLifecycleMutation(identities)) {
			await waitForNormalizedSessionLifecycleMutationIdle(identities, params.signal);
			continue;
		}
		const attempt = await runWithSessionIdentityLocks(identities, 0, async () => {
			params.signal?.throwIfAborted();
			if (hasActiveSessionLifecycleMutation(identities)) return { blocked: true };
			return {
				blocked: false,
				value: await params.run()
			};
		});
		if (!attempt.blocked) return attempt.value;
		await waitForNormalizedSessionLifecycleMutationIdle(identities, params.signal);
	}
}
async function runExclusiveSessionLifecycleMutation(params) {
	const identities = "targets" in params ? Array.from(new Set(Array.from(params.targets, (target) => normalizeSessionIdentities(target.scope, target.identities)).flat())).toSorted() : normalizeSessionIdentities(params.scope, params.identities);
	const signal = params.signal;
	signal?.throwIfAborted();
	const callerAdmissions = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
	const mutationRun = {};
	let mutationActivated = false;
	let removeAbortListener = () => {};
	const mutation = runWithSessionIdentityLocks(identities, 0, async () => await CURRENT_SESSION_WORK_ADMISSIONS.run(callerAdmissions, async () => {
		await runWithSessionIdentityLocks(identities, 0, async () => {
			signal?.throwIfAborted();
			mutationActivated = true;
			removeAbortListener();
			ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.add(mutationRun);
			for (const identity of identities) {
				ACTIVE_SESSION_LIFECYCLE_MUTATIONS.set(identity, (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0) + 1);
				if (params.kind) {
					const kinds = ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity) ?? /* @__PURE__ */ new Map();
					kinds.set(params.kind, (kinds.get(params.kind) ?? 0) + 1);
					ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.set(identity, kinds);
				}
			}
		});
		try {
			await params.prepare?.();
			return await runWithSessionIdentityLocks(identities, 0, params.run);
		} finally {
			try {
				await params.finalize?.();
			} finally {
				await runWithSessionIdentityLocks(identities, 0, async () => {
					for (const identity of identities) {
						if (params.kind) {
							const kinds = ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity);
							const remainingKindCount = (kinds?.get(params.kind) ?? 1) - 1;
							if (remainingKindCount > 0) kinds?.set(params.kind, remainingKindCount);
							else {
								kinds?.delete(params.kind);
								if (kinds?.size === 0) ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.delete(identity);
							}
						}
						const remaining = (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 1) - 1;
						if (remaining > 0) {
							ACTIVE_SESSION_LIFECYCLE_MUTATIONS.set(identity, remaining);
							continue;
						}
						ACTIVE_SESSION_LIFECYCLE_MUTATIONS.delete(identity);
						const waiters = SESSION_LIFECYCLE_IDLE_WAITERS.get(identity);
						SESSION_LIFECYCLE_IDLE_WAITERS.delete(identity);
						for (const resolve of waiters ?? []) resolve();
					}
					ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.delete(mutationRun);
				});
			}
		}
	}), "mutation");
	if (!signal) return await mutation;
	if (mutationActivated) return await mutation;
	const aborted = new Promise((_, reject) => {
		const onAbort = () => {
			if (mutationActivated) return;
			try {
				signal.throwIfAborted();
			} catch (error) {
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		};
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
	try {
		return await Promise.race([mutation, aborted]);
	} finally {
		removeAbortListener();
	}
}
function isSessionLifecycleMutationActive(scope, identities) {
	return hasActiveSessionLifecycleMutation(normalizeSessionIdentities(scope, identities));
}
function hasOnlySessionLifecycleMutationKindActive(scope, identities, kind) {
	return hasOnlyActiveSessionLifecycleMutationKind(normalizeSessionIdentities(scope, identities), kind);
}
function isSessionWorkAdmissionActive(scope, identities) {
	return normalizeSessionIdentities(scope, identities).some((identity) => (ACTIVE_SESSION_WORK_ADMISSIONS.get(identity)?.size ?? 0) > 0);
}
/** Whether another admitted turn currently owns any of these session identities. */
function isCompetingSessionWorkAdmissionActive(scope, identities) {
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	return normalizeSessionIdentities(scope, identities).some((identity) => Array.from(ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? [], (admission) => !currentAdmissions?.has(admission)).some(Boolean));
}
function resolveSessionWorkAdmissionRelease(params, ownedAdmissions) {
	const matchingAdmissions = /* @__PURE__ */ new Set();
	for (const identity of normalizeSessionIdentities(params.scope, params.identities)) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) if (!ownedAdmissions || ownedAdmissions.has(admission)) matchingAdmissions.add(admission);
	if (matchingAdmissions.size === 0) return;
	return Promise.all(Array.from(matchingAdmissions, (admission) => admission.released)).then(() => void 0);
}
/** Completion of this caller's admitted turn for the requested session identities. */
function getCurrentSessionWorkAdmissionRelease(params) {
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	if (!currentAdmissions?.size) return;
	return resolveSessionWorkAdmissionRelease(params, currentAdmissions);
}
/** Completion of the currently active turns that own a session. */
function getSessionWorkAdmissionRelease(params) {
	return resolveSessionWorkAdmissionRelease(params);
}
/** Active session identities for one store/lifecycle scope. */
function collectActiveSessionWorkAdmissionIdentities(scope) {
	const normalizedScope = scope.trim();
	if (!normalizedScope) throw new Error("session lifecycle scope is required");
	const identities = /* @__PURE__ */ new Set();
	for (const [normalizedIdentity, admissions] of ACTIVE_SESSION_WORK_ADMISSIONS) {
		if (admissions.size === 0) continue;
		const decoded = decodeSessionIdentity(normalizedIdentity);
		if (decoded?.scope === normalizedScope) identities.add(decoded.identity);
	}
	return identities;
}
/** Unique admitted turns; one lease can be indexed under several identities. */
function getActiveSessionWorkAdmissionCount() {
	const admissions = /* @__PURE__ */ new Set();
	for (const active of ACTIVE_SESSION_WORK_ADMISSIONS.values()) for (const admission of active) admissions.add(admission);
	return admissions.size;
}
/** Unique active lifecycle mutations; one run can be indexed under several identities. */
function getActiveSessionLifecycleMutationCount() {
	if (ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.size > 0) return ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.size;
	return ACTIVE_SESSION_LIFECYCLE_MUTATIONS.size > 0 ? 1 : 0;
}
async function beginSessionWorkAdmission(params) {
	if (isGatewaySubordinateWorkAdmissionClosed()) throw new GatewayDrainingError();
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	return await runExclusiveSessionLifecycle({
		scope: params.scope,
		identities: params.identities,
		signal: params.signal,
		run: async () => {
			await params.assertAllowed();
			if (isGatewaySubordinateWorkAdmissionClosed()) throw new GatewayDrainingError();
			const currentTurnAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
			if (!currentTurnAdmissions || currentTurnAdmissions.size === 0) checkLoopGovernorAdmission({ sessionKey: pickAgentSessionKey(identities) });
			let resolveReleased = () => {};
			const admission = {
				handoffIds: /* @__PURE__ */ new Set(),
				identities: new Set(identities),
				interrupt: params.onInterrupt,
				interrupted: false,
				released: new Promise((resolve) => {
					resolveReleased = resolve;
				})
			};
			for (const identity of identities) {
				const active = ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? /* @__PURE__ */ new Set();
				active.add(admission);
				ACTIVE_SESSION_WORK_ADMISSIONS.set(identity, active);
			}
			let released = false;
			const release = () => {
				if (released) return;
				released = true;
				for (const identity of identities) {
					const active = ACTIVE_SESSION_WORK_ADMISSIONS.get(identity);
					active?.delete(admission);
					if (!active?.size) ACTIVE_SESSION_WORK_ADMISSIONS.delete(identity);
				}
				clearSessionWorkAdmissionHandoffs(admission);
				resolveReleased();
			};
			const lease = {
				createHandoff: () => {
					if (released) throw new Error("cannot hand off a released session work admission");
					return createSessionWorkAdmissionHandoff(admission, lease);
				},
				release,
				released: admission.released,
				run: async (run) => {
					const current = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
					current.add(admission);
					return await CURRENT_SESSION_WORK_ADMISSIONS.run(current, run);
				}
			};
			const signal = params.signal;
			let writerBarrierStarted = false;
			let removeAbortListener = () => {};
			try {
				const queuedAbort = signal ? new Promise((_, reject) => {
					const onAbort = () => {
						if (writerBarrierStarted) return;
						reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("session work admission aborted"));
					};
					removeAbortListener = () => signal.removeEventListener("abort", onAbort);
					signal.addEventListener("abort", onAbort, { once: true });
					if (signal.aborted) onAbort();
				}) : void 0;
				const writerBarrier = runExclusiveSessionStoreWrite(params.scope, async () => {
					writerBarrierStarted = true;
					params.signal?.throwIfAborted();
					await (params.revalidateAllowed ?? params.assertAllowed)();
				}, { reentrant: true });
				await (queuedAbort ? Promise.race([writerBarrier, queuedAbort]) : writerBarrier);
				return lease;
			} catch (error) {
				release();
				throw error;
			} finally {
				removeAbortListener();
			}
		}
	});
}
async function interruptSessionWorkAdmissions(params) {
	const admissions = /* @__PURE__ */ new Set();
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	for (const identity of normalizeSessionIdentities(params.scope, params.identities)) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) {
		if (currentAdmissions?.has(admission)) continue;
		admissions.add(admission);
	}
	for (const admission of admissions) {
		admission.interrupted = true;
		admission.interrupt?.();
	}
	const released = Promise.all(Array.from(admissions, (admission) => admission.released));
	if (params.timeoutMs === void 0) {
		await released;
		return true;
	}
	const timeoutMs = params.timeoutMs;
	let timer;
	try {
		return await Promise.race([released.then(() => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), Math.max(0, timeoutMs));
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionLifecycleAdmissionTestApi")] = { runExclusiveSessionLifecycle };
//#endregion
//#region src/channels/plugins/session-conversation.ts
/**
* Session conversation key helpers.
*
* Resolves threaded channel session keys through plugin hooks and generic parsing.
*/
const SESSION_KEY_API_ARTIFACT_BASENAME = "session-key-api.js";
function normalizeResolvedChannel(channel) {
	return normalizeChannelId(channel) ?? normalizeChatChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? "";
}
function getMessagingAdapter(channel) {
	const normalizedChannel = normalizeResolvedChannel(channel);
	try {
		return getLoadedChannelPlugin(normalizedChannel)?.messaging;
	} catch {
		return;
	}
}
function buildGenericConversationResolution(rawId) {
	const trimmed = rawId.trim();
	if (!trimmed) return null;
	const parsed = parseThreadSessionSuffix(trimmed);
	const id = (parsed.baseSessionKey ?? trimmed).trim();
	if (!id) return null;
	return {
		id,
		threadId: parsed.threadId,
		baseConversationId: id,
		parentConversationCandidates: normalizeUniqueSingleOrTrimmedStringList(parsed.threadId ? [parsed.baseSessionKey] : [])
	};
}
function normalizeSessionConversationResolution(resolved) {
	if (!resolved?.id?.trim()) return null;
	return {
		id: resolved.id.trim(),
		threadId: normalizeOptionalString(resolved.threadId),
		baseConversationId: normalizeOptionalString(resolved.baseConversationId) ?? normalizeUniqueSingleOrTrimmedStringList(resolved.parentConversationCandidates ?? []).at(-1) ?? resolved.id.trim(),
		parentConversationCandidates: normalizeUniqueSingleOrTrimmedStringList(resolved.parentConversationCandidates ?? []),
		hasExplicitParentConversationCandidates: Object.hasOwn(resolved, "parentConversationCandidates")
	};
}
function resolveBundledSessionConversationFallback(params) {
	if (isBundledSessionConversationFallbackDisabled(params.channel)) return null;
	const dirName = normalizeResolvedChannel(params.channel);
	let loaded;
	try {
		loaded = tryLoadActivatedBundledPluginPublicSurfaceModuleSync({
			dirName,
			artifactBasename: SESSION_KEY_API_ARTIFACT_BASENAME
		});
	} catch {
		return null;
	}
	const resolveSessionConversationLocal = loaded?.resolveSessionConversation;
	if (typeof resolveSessionConversationLocal !== "function") return null;
	return normalizeSessionConversationResolution(resolveSessionConversationLocal({
		kind: params.kind,
		rawId: params.rawId
	}));
}
function isBundledSessionConversationFallbackDisabled(channel) {
	const snapshot = getRuntimeConfigSnapshot();
	if (!snapshot?.plugins) return false;
	if (snapshot.plugins.enabled === false) return true;
	const entry = snapshot.plugins.entries?.[normalizeResolvedChannel(channel)];
	return Boolean(entry) && typeof entry === "object" && entry.enabled === false;
}
function shouldProbeBundledSessionConversationFallback(rawId) {
	return rawId.includes(":");
}
function resolveSessionConversationResolution(params) {
	const rawId = params.rawId.trim();
	if (!rawId) return null;
	const messaging = getMessagingAdapter(params.channel);
	const pluginResolved = normalizeSessionConversationResolution(messaging?.resolveSessionConversation?.({
		kind: params.kind,
		rawId
	}));
	const shouldTryBundledFallback = params.bundledFallback !== false && !messaging && shouldProbeBundledSessionConversationFallback(rawId);
	const resolved = pluginResolved ?? (shouldTryBundledFallback ? resolveBundledSessionConversationFallback({
		channel: params.channel,
		kind: params.kind,
		rawId
	}) : null) ?? buildGenericConversationResolution(rawId);
	if (!resolved) return null;
	const parentConversationCandidates = normalizeUniqueSingleOrTrimmedStringList(pluginResolved?.hasExplicitParentConversationCandidates ? resolved.parentConversationCandidates : messaging?.resolveParentConversationCandidates?.({
		kind: params.kind,
		rawId
	}) ?? resolved.parentConversationCandidates);
	const baseConversationId = parentConversationCandidates.at(-1) ?? resolved.baseConversationId ?? resolved.id;
	return {
		...resolved,
		baseConversationId,
		parentConversationCandidates
	};
}
/**
* Resolves one raw channel conversation id into base/thread conversation metadata.
*/
function resolveSessionConversation(params) {
	return resolveSessionConversationResolution(params);
}
function buildBaseSessionKey(raw, id) {
	return `${raw.prefix}:${id}`;
}
function resolveSessionConversationRef(sessionKey, opts = {}) {
	const raw = parseRawSessionConversationRef(sessionKey);
	if (!raw) return null;
	const resolved = resolveSessionConversation({
		...raw,
		bundledFallback: opts.bundledFallback
	});
	if (!resolved) return null;
	return {
		channel: normalizeResolvedChannel(raw.channel),
		kind: raw.kind,
		rawId: raw.rawId,
		id: resolved.id,
		threadId: resolved.threadId,
		baseSessionKey: buildBaseSessionKey(raw, resolved.id),
		baseConversationId: resolved.baseConversationId,
		parentConversationCandidates: resolved.parentConversationCandidates
	};
}
/**
* Resolves thread suffix metadata from a session key, using channel hooks when available.
*/
function resolveSessionThreadInfo(sessionKey, opts = {}) {
	const resolved = resolveSessionConversationRef(sessionKey, opts);
	if (!resolved) return parseThreadSessionSuffix(sessionKey);
	return {
		baseSessionKey: resolved.threadId ? resolved.baseSessionKey : normalizeOptionalString(sessionKey),
		threadId: resolved.threadId
	};
}
/**
* Resolves the parent session key for a threaded child session.
*/
function resolveSessionParentSessionKey(sessionKey) {
	const { baseSessionKey, threadId } = resolveSessionThreadInfo(sessionKey);
	if (!threadId) return null;
	return baseSessionKey ?? null;
}
//#endregion
//#region src/channels/plugins/session-thread-info-loaded.ts
/**
* Loaded-plugin session thread info resolver.
*
* Uses only already loaded channel hooks to resolve thread suffix metadata on hot paths.
*/
function resolveLoadedSessionConversationThreadInfo(sessionKey) {
	const raw = parseRawSessionConversationRef(sessionKey);
	if (!raw) return null;
	const rawId = raw.rawId.trim();
	if (!rawId) return null;
	const resolved = (getLoadedChannelPluginForRead(raw.channel)?.messaging)?.resolveSessionConversation?.({
		kind: raw.kind,
		rawId
	});
	if (!resolved?.id?.trim()) return null;
	const id = resolved.id.trim();
	const threadId = normalizeOptionalString(resolved.threadId);
	return {
		baseSessionKey: threadId ? `${raw.prefix}:${id}` : normalizeOptionalString(sessionKey),
		threadId
	};
}
/**
* Resolves thread suffix metadata using loaded plugin hooks or generic parsing.
*/
function resolveLoadedSessionThreadInfo(sessionKey) {
	return resolveLoadedSessionConversationThreadInfo(sessionKey) ?? parseThreadSessionSuffix(sessionKey);
}
//#endregion
//#region src/config/sessions/thread-info.ts
/**
* Extract deliveryContext and threadId from a sessionKey.
* Supports generic :thread: suffixes plus plugin-owned thread/session grammars.
*/
function parseSessionThreadInfo(sessionKey) {
	return resolveSessionThreadInfo(sessionKey);
}
function parseSessionThreadInfoFast(sessionKey) {
	return resolveLoadedSessionThreadInfo(sessionKey);
}
//#endregion
//#region src/config/sessions/store-maintenance.ts
const log = createSubsystemLogger("sessions/store");
const DEFAULT_SESSION_PRUNE_AFTER_MS = 720 * 60 * 60 * 1e3;
const DEFAULT_MODEL_RUN_PRUNE_AFTER_MS = 1440 * 60 * 1e3;
const DEFAULT_SESSION_MAX_ENTRIES = 500;
const DEFAULT_SESSION_MAINTENANCE_MODE = "enforce";
const DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO = .8;
const DEFAULT_SESSION_MAX_DISK_BYTES = 10 * 1024 * 1024 * 1024;
const STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES = 49;
const MIN_BATCHED_ENTRY_MAINTENANCE_SLACK = 25;
const BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO = .1;
function resolvePruneAfterMs(maintenance) {
	const raw = maintenance?.pruneAfter;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return DEFAULT_SESSION_PRUNE_AFTER_MS;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return DEFAULT_SESSION_PRUNE_AFTER_MS;
	}
}
function resolveResetArchiveRetentionMs(maintenance) {
	const raw = maintenance?.resetArchiveRetention;
	if (raw === false) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return null;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return null;
	}
}
function resolveMaxDiskBytes(maintenance) {
	const raw = maintenance?.maxDiskBytes;
	if (raw === false) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return DEFAULT_SESSION_MAX_DISK_BYTES;
	try {
		const bytes = parseByteSize(normalized, { defaultUnit: "b" });
		if (bytes <= 0) return null;
		return bytes;
	} catch {
		return null;
	}
}
function resolveHighWaterBytes(maintenance, maxDiskBytes) {
	if (maxDiskBytes == null) return null;
	const defaultHighWaterBytes = Math.max(1, Math.min(maxDiskBytes, Math.floor(maxDiskBytes * DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO)));
	const raw = maintenance?.highWaterBytes;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return defaultHighWaterBytes;
	try {
		const parsed = parseByteSize(normalized, { defaultUnit: "b" });
		return parsed > 0 ? Math.min(parsed, maxDiskBytes) : defaultHighWaterBytes;
	} catch {
		return defaultHighWaterBytes;
	}
}
/**
* Resolve maintenance settings from openclaw.json (`session.maintenance`).
* Falls back to built-in defaults when config is missing or unset.
*/
function resolveMaintenanceConfigFromInput(maintenance) {
	const pruneAfterMs = resolvePruneAfterMs(maintenance);
	const maxDiskBytes = resolveMaxDiskBytes(maintenance);
	return {
		mode: maintenance?.mode ?? DEFAULT_SESSION_MAINTENANCE_MODE,
		pruneAfterMs,
		maxEntries: maintenance?.maxEntries ?? DEFAULT_SESSION_MAX_ENTRIES,
		modelRunPruneAfterMs: DEFAULT_MODEL_RUN_PRUNE_AFTER_MS,
		resetArchiveRetentionMs: resolveResetArchiveRetentionMs(maintenance),
		maxDiskBytes,
		highWaterBytes: resolveHighWaterBytes(maintenance, maxDiskBytes)
	};
}
function normalizeResolvedMaintenanceConfigInput(maintenance) {
	return {
		...maintenance,
		modelRunPruneAfterMs: maintenance.modelRunPruneAfterMs ?? DEFAULT_MODEL_RUN_PRUNE_AFTER_MS
	};
}
function resolveSessionEntryMaintenanceHighWater(maxEntries) {
	if (!Number.isSafeInteger(maxEntries) || maxEntries <= 0) return 1;
	if (maxEntries <= STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES) return maxEntries + 1;
	return maxEntries + Math.max(MIN_BATCHED_ENTRY_MAINTENANCE_SLACK, Math.ceil(maxEntries * BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO));
}
function shouldRunSessionEntryMaintenance(params) {
	if (params.force) return true;
	return params.entryCount >= resolveSessionEntryMaintenanceHighWater(params.maxEntries);
}
function shouldRunModelRunPrune(params) {
	if (params.force) return params.entryCount > params.maintenance.maxEntries;
	return shouldRunSessionEntryMaintenance({
		entryCount: params.entryCount,
		maxEntries: params.maintenance.maxEntries
	});
}
function isGatewayModelRunSessionKey(sessionKey) {
	const match = /^agent:([^:\s]+):explicit:model-run-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.exec(sessionKey);
	if (!match) return false;
	const agentId = match[1];
	if (!agentId || /\s/.test(agentId)) return false;
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || parsed.agentId !== agentId.toLowerCase()) return false;
	const rest = normalizeLowercaseStringOrEmpty(parsed.rest);
	return /^explicit:model-run-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(rest);
}
/**
* Remove entries whose `updatedAt` is older than the configured threshold.
* Entries without `updatedAt` are kept (cannot determine staleness).
* Mutates `store` in-place.
*/
function pruneStaleEntries(store, overrideMaxAgeMs, opts = {}) {
	const maxAgeMs = overrideMaxAgeMs ?? resolveMaintenanceConfigFromInput().pruneAfterMs;
	const cutoffMs = Date.now() - maxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			preserveKeys: opts.preserveKeys
		})) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			opts.onPruned?.({
				key,
				entry
			});
			delete store[key];
			pruned++;
		}
	}
	if (pruned > 0 && opts.log !== false) log.info("pruned stale session entries", {
		pruned,
		maxAgeMs
	});
	return pruned;
}
/**
* Remove stale one-shot gateway model-run probe sessions before normal retention/capping.
* Existing polluted stores may not carry modelRun metadata, so this intentionally keys off the
* strict explicit model-run UUID session shape created by the gateway probe CLI path.
*/
function pruneStaleModelRunEntries(store, overrideMaxAgeMs, opts = {}) {
	if (overrideMaxAgeMs == null) return 0;
	const cutoffMs = Date.now() - overrideMaxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			preserveKeys: opts.preserveKeys
		})) continue;
		if (!isGatewayModelRunSessionKey(key)) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			opts.onPruned?.({
				key,
				entry
			});
			delete store[key];
			pruned++;
		}
	}
	if (pruned > 0 && opts.log !== false) log.info("pruned stale gateway model-run session entries", {
		pruned,
		maxAgeMs: overrideMaxAgeMs
	});
	return pruned;
}
const DEFAULT_QUOTA_SUSPENSION_TTL_MS = 1800 * 1e3;
const QUOTA_SUSPENSION_CLEANUP_FACTOR = 2;
/**
* Resolves the TTL maintenance patch for one session entry without reading or
* mutating the whole store. Attempt hot paths use this before entry-scoped
* accessor writes so unrelated sessions stay out of the request path.
*/
function resolveQuotaSuspensionEntryMaintenance(params) {
	const suspension = params.entry.quotaSuspension;
	if (!suspension) return {
		patch: null,
		cleared: false
	};
	const ttlMs = params.ttlMs ?? DEFAULT_QUOTA_SUSPENSION_TTL_MS;
	const cleanupAfterResumeMs = ttlMs * (QUOTA_SUSPENSION_CLEANUP_FACTOR - 1);
	const resumeAtMs = suspension.expectedResumeBy ?? suspension.suspendedAt + ttlMs;
	const cleanupAtMs = resumeAtMs + cleanupAfterResumeMs;
	if (params.now >= cleanupAtMs) return {
		patch: { quotaSuspension: void 0 },
		cleared: true
	};
	if (suspension.state === "suspended" && params.now >= resumeAtMs) return {
		patch: { quotaSuspension: {
			...suspension,
			state: "resuming"
		} },
		cleared: false
	};
	return {
		patch: null,
		cleared: false
	};
}
function getEntryUpdatedAt$1(entry) {
	return entry?.updatedAt ?? Number.NEGATIVE_INFINITY;
}
function isSyntheticSessionMaintenanceKey(sessionKey) {
	const rest = normalizeLowercaseStringOrEmpty(parseAgentSessionKey(sessionKey)?.rest ?? sessionKey);
	return isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey) || isCronSessionKey(sessionKey) || rest.startsWith("acp-bridge:") || rest.startsWith("hook:") || rest.startsWith("node:") || rest === "heartbeat" || rest.endsWith(":heartbeat") || rest.includes(":heartbeat:");
}
function isTelegramTopicSessionKey(sessionKey) {
	const rest = normalizeLowercaseStringOrEmpty(parseAgentSessionKey(sessionKey)?.rest ?? sessionKey);
	return /^telegram:(?:group|channel|direct|dm):.+:topic:[^:]+$/.test(rest);
}
function isExternalGroupOrChannelSessionKey(sessionKey) {
	const rest = normalizeLowercaseStringOrEmpty(parseAgentSessionKey(sessionKey)?.rest ?? sessionKey);
	return /^[^:]+:(?:group|channel):.+$/.test(rest);
}
function isPrimarySessionMaintenanceKey(sessionKey) {
	if (normalizeLowercaseStringOrEmpty(sessionKey) === "global") return true;
	return parseAgentSessionKey(sessionKey)?.rest === "main";
}
function isProtectedSessionMaintenanceEntry(sessionKey, entry) {
	if (isSyntheticSessionMaintenanceKey(sessionKey)) return false;
	if (isPrimarySessionMaintenanceKey(sessionKey)) return true;
	if (parseSessionThreadInfoFast(sessionKey).threadId) return true;
	if (isTelegramTopicSessionKey(sessionKey)) return true;
	if (isExternalGroupOrChannelSessionKey(sessionKey)) return true;
	const chatType = normalizeLowercaseStringOrEmpty(entry?.chatType ?? sessionDeliveryOrigin(entry)?.chatType);
	return chatType === "group" || chatType === "channel" || chatType === "thread";
}
function shouldPreserveMaintenanceEntry(params) {
	if (params.entry?.archivedAt !== void 0 || params.entry?.pinnedAt !== void 0) return true;
	return params.entry?.modelSelectionLocked === true || params.preserveKeys?.has(params.key) === true || isProtectedSessionMaintenanceEntry(params.key, params.entry);
}
function selectSessionEntryCapVictims(store, maxEntries, preserveKeys) {
	const keys = Object.keys(store);
	const overflow = keys.length - Math.max(0, maxEntries);
	if (overflow <= 0) return [];
	const eligibleKeys = keys.filter((key) => !shouldPreserveMaintenanceEntry({
		key,
		entry: store[key],
		preserveKeys
	}));
	const victimCount = Math.min(overflow, eligibleKeys.length);
	if (victimCount === 0) return [];
	return eligibleKeys.toSorted((a, b) => getEntryUpdatedAt$1(store[b]) - getEntryUpdatedAt$1(store[a])).slice(-victimCount);
}
function getActiveSessionMaintenanceWarning(params) {
	const activeSessionKey = params.activeSessionKey.trim();
	if (!activeSessionKey) return null;
	const activeEntry = params.store[activeSessionKey];
	if (!activeEntry) return null;
	if (shouldPreserveMaintenanceEntry({
		key: activeSessionKey,
		entry: activeEntry,
		preserveKeys: params.preserveKeys
	})) return null;
	const cutoffMs = (params.nowMs ?? Date.now()) - params.pruneAfterMs;
	const wouldPrune = activeEntry.updatedAt != null ? activeEntry.updatedAt < cutoffMs : false;
	const keys = Object.keys(params.store);
	const wouldCap = selectSessionEntryCapVictims(params.store, params.maxEntries, params.preserveKeys).includes(activeSessionKey);
	if (!wouldPrune && !wouldCap) return null;
	return {
		activeSessionKey,
		activeUpdatedAt: activeEntry.updatedAt,
		totalEntries: keys.length,
		pruneAfterMs: params.pruneAfterMs,
		maxEntries: params.maxEntries,
		wouldPrune,
		wouldCap
	};
}
/**
* Cap the total store to N entries by removing the oldest eviction-eligible rows.
* Protected rows count toward the cap but are never removed, so a store whose protected rows
* alone exceed the cap remains above it until protection is released or rows are deleted.
* Mutates `store` in-place.
*/
function capEntryCount(store, maxEntries, opts = {}) {
	const toRemove = selectSessionEntryCapVictims(store, maxEntries, opts.preserveKeys);
	if (toRemove.length === 0) return 0;
	for (const key of toRemove) {
		const entry = store[key];
		if (entry) opts.onCapped?.({
			key,
			entry
		});
		delete store[key];
	}
	if (opts.log !== false) log.info("capped session entry count", {
		removed: toRemove.length,
		maxEntries
	});
	return toRemove.length;
}
//#endregion
//#region src/config/sessions/store-maintenance-runtime.ts
function resolveMaintenanceConfig() {
	let maintenance;
	try {
		maintenance = getRuntimeConfig().session?.maintenance;
	} catch {}
	return resolveMaintenanceConfigFromInput(maintenance);
}
//#endregion
//#region src/config/sessions/disk-budget.ts
const NOOP_LOGGER = {
	warn: () => {},
	info: () => {}
};
function canonicalizePathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	try {
		return fs.realpathSync(resolved);
	} catch {
		return resolved;
	}
}
function measureStoreBytes(store) {
	return Buffer.byteLength(JSON.stringify(store, null, 2), "utf-8");
}
function measureStoreEntryChunkBytes(key, entry) {
	const singleEntryStore = JSON.stringify({ [key]: entry }, null, 2);
	if (!singleEntryStore.startsWith("{\n") || !singleEntryStore.endsWith("\n}")) return measureStoreBytes({ [key]: entry }) - 4;
	const chunk = singleEntryStore.slice(2, -2);
	return Buffer.byteLength(chunk, "utf-8");
}
function buildStoreEntryChunkSizeMap(store) {
	const out = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) out.set(key, measureStoreEntryChunkBytes(key, entry));
	return out;
}
function resolveProjectedPromptBlobHash(entry) {
	const ref = entry?.skillsSnapshot?.promptRef;
	return ref?.algorithm === "sha256" && typeof ref.hash === "string" ? ref.hash : void 0;
}
function buildProjectedPromptBlobRefCounts(store) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of Object.values(store)) {
		const hash = resolveProjectedPromptBlobHash(entry);
		if (!hash) continue;
		counts.set(hash, (counts.get(hash) ?? 0) + 1);
	}
	return counts;
}
function getEntryUpdatedAt(entry) {
	if (!entry) return 0;
	const updatedAt = entry.updatedAt;
	return Number.isFinite(updatedAt) ? updatedAt : 0;
}
function buildSessionIdRefCounts(store) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of Object.values(store)) {
		const sessionId = entry?.sessionId;
		if (!sessionId) continue;
		counts.set(sessionId, (counts.get(sessionId) ?? 0) + 1);
	}
	return counts;
}
function resolveSessionTranscriptPathForEntry(params) {
	if (!params.entry.sessionId) return null;
	try {
		const resolved = resolveSessionFilePathCore(params.entry.sessionId, params.entry, { sessionsDir: params.sessionsDir });
		const resolvedSessionsDir = canonicalizePathForComparison(params.sessionsDir);
		const resolvedPath = canonicalizePathForComparison(resolved);
		const relative = path.relative(resolvedSessionsDir, resolvedPath);
		if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;
		return resolvedPath;
	} catch {
		return null;
	}
}
function resolveSessionArtifactPathsForEntry(params) {
	const transcriptPath = resolveSessionTranscriptPathForEntry(params);
	if (!transcriptPath) return [];
	const paths = [transcriptPath];
	if (params.entry.sessionId) {
		paths.push(resolveTrajectoryPointerFilePath(transcriptPath));
		paths.push(resolveTrajectoryFilePath({
			env: {},
			sessionFile: transcriptPath,
			sessionId: params.entry.sessionId
		}));
	}
	return paths;
}
function resolveSessionArtifactCanonicalPathsForEntry(params) {
	return resolveSessionArtifactPathsForEntry(params).map(canonicalizePathForComparison);
}
function resolveReferencedSessionArtifactPaths(params) {
	const referenced = /* @__PURE__ */ new Set();
	const resolvedSessionsDir = canonicalizePathForComparison(params.sessionsDir);
	for (const entry of Object.values(params.store)) {
		for (const resolved of resolveSessionArtifactCanonicalPathsForEntry({
			sessionsDir: params.sessionsDir,
			entry
		})) referenced.add(resolved);
		for (const checkpoint of entry.compactionCheckpoints ?? []) {
			const checkpointFiles = [checkpoint.preCompaction.sessionFile?.trim(), checkpoint.postCompaction.sessionFile?.trim()].filter((filePath) => Boolean(filePath));
			for (const checkpointFile of checkpointFiles) {
				const resolvedCheckpointPath = canonicalizePathForComparison(checkpointFile);
				const relative = path.relative(resolvedSessionsDir, resolvedCheckpointPath);
				if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) referenced.add(resolvedCheckpointPath);
			}
		}
	}
	return referenced;
}
const SESSIONS_DIR_STAT_CONCURRENCY = 8;
async function readSessionsDirFiles(sessionsDir) {
	const { results } = await runTasksWithConcurrency({
		tasks: (await fs.promises.readdir(sessionsDir, { withFileTypes: true }).catch(() => [])).filter((dirent) => dirent.isFile() && !isMigrationArchiveArtifactName(dirent.name)).map((dirent) => async () => {
			const filePath = path.join(sessionsDir, dirent.name);
			const stat = await fs.promises.stat(filePath).catch(() => null);
			if (!stat?.isFile()) return null;
			return {
				path: filePath,
				canonicalPath: canonicalizePathForComparison(filePath),
				name: dirent.name,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			};
		}),
		limit: SESSIONS_DIR_STAT_CONCURRENCY
	});
	return results.filter((file) => Boolean(file));
}
async function readSqliteDatabaseFiles(storePath) {
	const files = [];
	for (const databasePath of listDurableSqliteTargetPathsForSessionStorePath(storePath)) for (const filePath of [databasePath, `${databasePath}-wal`]) {
		const stat = await fs.promises.stat(filePath).catch(() => null);
		if (!stat?.isFile()) continue;
		files.push({
			path: filePath,
			canonicalPath: canonicalizePathForComparison(filePath),
			name: path.basename(filePath),
			size: stat.size,
			mtimeMs: stat.mtimeMs
		});
	}
	return files;
}
/** Measures current physical session artifacts plus the agent SQLite main file and WAL. */
async function measureSessionPhysicalDiskUsage(storePath) {
	const sessionsDirFiles = await readSessionsDirFiles(path.dirname(storePath));
	const promptBlobFiles = await readSessionPromptBlobFiles(path.dirname(storePath));
	const databaseFiles = await readSqliteDatabaseFiles(storePath);
	const databaseMainPaths = new Set(databaseFiles.filter((file) => !file.path.endsWith("-wal")).map((file) => file.canonicalPath));
	const databaseWalPaths = new Set(databaseFiles.filter((file) => file.path.endsWith("-wal")).map((file) => file.canonicalPath));
	const uniqueFiles = /* @__PURE__ */ new Map();
	for (const file of [
		...sessionsDirFiles,
		...promptBlobFiles,
		...databaseFiles
	]) uniqueFiles.set(file.canonicalPath, file);
	const databaseMainBytes = [...databaseMainPaths].reduce((sum, databasePath) => sum + (uniqueFiles.get(databasePath)?.size ?? 0), 0);
	const databaseWalBytes = [...databaseWalPaths].reduce((sum, databasePath) => sum + (uniqueFiles.get(databasePath)?.size ?? 0), 0);
	const totalBytes = [...uniqueFiles.values()].reduce((sum, file) => sum + file.size, 0);
	return {
		databaseMainBytes,
		databaseWalBytes,
		sessionFilesBytes: totalBytes - databaseMainBytes - databaseWalBytes,
		totalBytes
	};
}
async function hasRetainedSessionTranscriptArchives(storePath) {
	return (await readSessionsDirFiles(path.dirname(storePath))).some((file) => isRetainedSessionTranscriptArchiveName(file.name));
}
/** Removes oldest retained reset/delete archives, remeasuring physical usage after each file. */
async function pruneSessionTranscriptArchivesToHighWater(params) {
	const files = (await readSessionsDirFiles(path.dirname(params.storePath))).filter((file) => isRetainedSessionTranscriptArchiveName(file.name)).toSorted((left, right) => left.mtimeMs - right.mtimeMs);
	let usage = await measureSessionPhysicalDiskUsage(params.storePath);
	let removedFiles = 0;
	for (const file of files) {
		if (usage.totalBytes <= params.highWaterBytes) break;
		if (await removeFileIfExists(file.path) <= 0) continue;
		removedFiles += 1;
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
	}
	return {
		removedFiles,
		usage
	};
}
async function readSessionPromptBlobFiles(sessionsDir) {
	const root = path.join(sessionsDir, "skills-prompts", "sha256");
	const prefixEntries = await fs.promises.readdir(root, { withFileTypes: true }).catch(() => []);
	const files = [];
	for (const prefixEntry of prefixEntries) {
		if (!prefixEntry.isDirectory() || !/^[a-f0-9]{2}$/u.test(prefixEntry.name)) continue;
		const prefixDir = path.join(root, prefixEntry.name);
		const blobEntries = await fs.promises.readdir(prefixDir, { withFileTypes: true }).catch(() => []);
		for (const blobEntry of blobEntries) {
			if (!blobEntry.isFile() || !/^[a-f0-9]{64}\.txt$/u.test(blobEntry.name) && !isSessionPromptBlobTempArtifactName(blobEntry.name)) continue;
			const filePath = path.join(prefixDir, blobEntry.name);
			const stat = await fs.promises.stat(filePath).catch(() => null);
			if (!stat?.isFile()) continue;
			files.push({
				path: filePath,
				canonicalPath: canonicalizePathForComparison(filePath),
				name: blobEntry.name,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			});
		}
	}
	return files;
}
function resolvePromptBlobFileHash(file) {
	return /^[a-f0-9]{64}\.txt$/u.test(file.name) ? file.name.slice(0, -4) : void 0;
}
function isSessionPromptBlobTempArtifactName(name) {
	return /^[a-f0-9]{64}\.txt\.(?:\d+\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u.test(name);
}
function isUnreferencedSessionArtifactFile(file, referencedPaths) {
	if (referencedPaths.has(file.canonicalPath)) return false;
	return isCompactionCheckpointTranscriptFileName(file.name) || isTrajectorySessionArtifactName(file.name) || isPrimarySessionTranscriptFileName(file.name);
}
const SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS = SESSION_STORE_TEMP_STALE_MS;
function isUnreferencedPromptBlobFileRemovable(file, projectedPromptBlobRefCounts, cutoffMs) {
	if (file.mtimeMs > cutoffMs) return false;
	const hash = resolvePromptBlobFileHash(file);
	return hash ? !projectedPromptBlobRefCounts.has(hash) : false;
}
function isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs, tempCutoffMs) {
	if (isSessionPromptBlobTempArtifactName(file.name)) return file.mtimeMs <= tempCutoffMs;
	return isUnreferencedPromptBlobFileRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs);
}
function isDiskBudgetRemovableSessionFile(file, referencedPaths, tempStaleCutoffMs, storeBasename) {
	if (isSessionStoreTempArtifactName(file.name, storeBasename)) return file.mtimeMs <= tempStaleCutoffMs;
	return isSessionArchiveArtifactName(file.name) || isUnreferencedSessionArtifactFile(file, referencedPaths);
}
async function removeFileIfExists(filePath) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) return 0;
	await fs.promises.rm(filePath, { force: true }).catch(() => void 0);
	return stat.size;
}
async function removeFileForBudget(params) {
	const resolvedPath = path.resolve(params.filePath);
	const canonicalPath = params.canonicalPath ?? canonicalizePathForComparison(resolvedPath);
	if (params.dryRun) {
		if (params.simulatedRemovedPaths.has(canonicalPath)) return 0;
		const size = params.fileSizesByPath.get(canonicalPath) ?? 0;
		if (size <= 0) return 0;
		params.simulatedRemovedPaths.add(canonicalPath);
		params.onRemovedPath?.(canonicalPath);
		return size;
	}
	const size = await removeFileIfExists(resolvedPath);
	if (size > 0) params.onRemovedPath?.(canonicalPath);
	return size;
}
async function removePromptBlobFileForBudget(params) {
	let file = params.file;
	if (!params.dryRun) {
		const stat = await fs.promises.stat(file.path).catch(() => null);
		if (!stat?.isFile()) return 0;
		file = {
			...file,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	}
	if (!isPromptBlobArtifactRemovable(file, params.projectedPromptBlobRefCounts, params.promptBlobCutoffMs, params.tempCutoffMs)) return 0;
	return await removeFileForBudget({
		filePath: file.path,
		canonicalPath: file.canonicalPath,
		dryRun: params.dryRun,
		fileSizesByPath: params.fileSizesByPath,
		simulatedRemovedPaths: params.simulatedRemovedPaths,
		onRemovedPath: params.onRemovedPath
	});
}
async function pruneUnreferencedSessionArtifacts(params) {
	const olderThanMs = Number.isFinite(params.olderThanMs) && params.olderThanMs > 0 ? params.olderThanMs : 0;
	const sessionsDir = path.dirname(params.storePath);
	const files = await readSessionsDirFiles(sessionsDir);
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const fileSizesByPath = new Map([...files, ...promptBlobFiles].map((file) => [file.canonicalPath, file.size]));
	const simulatedRemovedPaths = /* @__PURE__ */ new Set();
	const referencedPaths = resolveReferencedSessionArtifactPaths({
		sessionsDir,
		store: params.store
	});
	const projectedPromptBlobRefCounts = buildProjectedPromptBlobRefCounts(projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: params.store
	}).store);
	const cutoffMs = Date.now() - olderThanMs;
	const tempCutoffMs = Date.now() - SESSION_STORE_TEMP_STALE_MS;
	const promptBlobCutoffMs = Date.now() - Math.max(olderThanMs, SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS);
	const storeBasename = path.basename(params.storePath);
	const removableStoreFiles = files.filter((file) => {
		if (params.excludeCanonicalPaths?.has(file.canonicalPath)) return false;
		if (isSessionStoreTempArtifactName(file.name, storeBasename)) return file.mtimeMs <= tempCutoffMs;
		return file.mtimeMs <= cutoffMs && isUnreferencedSessionArtifactFile(file, referencedPaths);
	});
	const removablePromptBlobFiles = promptBlobFiles.filter((file) => {
		if (params.excludeCanonicalPaths?.has(file.canonicalPath)) return false;
		return isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs, tempCutoffMs);
	});
	const removableFiles = [...removableStoreFiles.map((file) => ({
		kind: "store",
		file
	})), ...removablePromptBlobFiles.map((file) => ({
		kind: "promptBlob",
		file
	}))].filter((file) => {
		return !params.excludeCanonicalPaths?.has(file.file.canonicalPath);
	}).toSorted((a, b) => a.file.mtimeMs - b.file.mtimeMs);
	let removedFiles = 0;
	let freedBytes = 0;
	const dryRun = params.dryRun === true;
	for (const item of removableFiles) {
		const deletedBytes = item.kind === "promptBlob" ? await removePromptBlobFileForBudget({
			file: item.file,
			projectedPromptBlobRefCounts,
			promptBlobCutoffMs,
			tempCutoffMs,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths
		}) : await removeFileForBudget({
			filePath: item.file.path,
			canonicalPath: item.file.canonicalPath,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths
		});
		if (deletedBytes <= 0) continue;
		removedFiles += 1;
		freedBytes += deletedBytes;
	}
	return {
		scannedFiles: files.length + promptBlobFiles.length,
		removedFiles,
		freedBytes,
		olderThanMs
	};
}
async function enforceSessionDiskBudget(params) {
	const maxBytes = params.maintenance.maxDiskBytes;
	const highWaterBytes = params.maintenance.highWaterBytes;
	if (maxBytes == null || highWaterBytes == null) return null;
	const log = params.log ?? NOOP_LOGGER;
	const dryRun = params.dryRun === true;
	const sessionsDir = path.dirname(params.storePath);
	const files = await readSessionsDirFiles(sessionsDir);
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const fileSizesByPath = new Map([...files, ...promptBlobFiles].map((file) => [file.canonicalPath, file.size]));
	const simulatedRemovedPaths = /* @__PURE__ */ new Set();
	const resolvedStorePath = canonicalizePathForComparison(params.storePath);
	const storeFile = files.find((file) => file.canonicalPath === resolvedStorePath);
	const projectedPersistence = projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: params.store
	});
	const projectedStore = projectedPersistence.store;
	let projectedStoreBytes = measureStoreBytes(projectedStore);
	const projectedPromptBlobBytesByHash = /* @__PURE__ */ new Map();
	const existingPromptBlobFilesByHash = /* @__PURE__ */ new Map();
	for (const file of promptBlobFiles) {
		const hash = resolvePromptBlobFileHash(file);
		if (hash) existingPromptBlobFilesByHash.set(hash, file);
	}
	for (const [hash, blob] of projectedPersistence.promptBlobs) if (!existingPromptBlobFilesByHash.has(hash)) projectedPromptBlobBytesByHash.set(hash, blob.ref.bytes);
	const projectedPromptBlobRefCounts = buildProjectedPromptBlobRefCounts(projectedStore);
	const projectedPromptBlobBytes = [...projectedPromptBlobBytesByHash.values()].reduce((sum, bytes) => sum + bytes, 0);
	let total = [...files, ...promptBlobFiles].reduce((sum, file) => sum + file.size, 0) - (storeFile?.size ?? 0) + projectedStoreBytes + projectedPromptBlobBytes;
	const totalBefore = total;
	if (total <= maxBytes) return {
		totalBytesBefore: totalBefore,
		totalBytesAfter: total,
		removedFiles: 0,
		removedEntries: 0,
		freedBytes: 0,
		maxBytes,
		highWaterBytes,
		overBudget: false
	};
	if (params.warnOnly) {
		log.warn("session disk budget exceeded (warn-only mode)", {
			sessionsDir,
			totalBytes: total,
			maxBytes,
			highWaterBytes
		});
		return {
			totalBytesBefore: totalBefore,
			totalBytesAfter: total,
			removedFiles: 0,
			removedEntries: 0,
			freedBytes: 0,
			maxBytes,
			highWaterBytes,
			overBudget: true
		};
	}
	let removedFiles = 0;
	let removedEntries = 0;
	let freedBytes = 0;
	const commitEvictedIndex = params.commitEvictedIndex;
	const referencedPaths = resolveReferencedSessionArtifactPaths({
		sessionsDir,
		store: params.store
	});
	const tempStaleCutoffMs = Date.now() - SESSION_STORE_TEMP_STALE_MS;
	const promptBlobOrphanCutoffMs = Date.now() - SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS;
	const storeBasename = path.basename(params.storePath);
	const unreferencedPromptBlobQueue = promptBlobFiles.filter((file) => {
		return isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobOrphanCutoffMs, tempStaleCutoffMs);
	}).toSorted((a, b) => a.mtimeMs - b.mtimeMs);
	for (const file of unreferencedPromptBlobQueue) {
		if (total <= highWaterBytes) break;
		const deletedBytes = await removePromptBlobFileForBudget({
			file,
			projectedPromptBlobRefCounts,
			promptBlobCutoffMs: promptBlobOrphanCutoffMs,
			tempCutoffMs: tempStaleCutoffMs,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths,
			onRemovedPath: params.onRemoveFile
		});
		if (deletedBytes <= 0) continue;
		total -= deletedBytes;
		freedBytes += deletedBytes;
		removedFiles += 1;
	}
	const removableFileQueue = files.filter((file) => isDiskBudgetRemovableSessionFile(file, referencedPaths, tempStaleCutoffMs, storeBasename)).toSorted((a, b) => a.mtimeMs - b.mtimeMs);
	for (const file of removableFileQueue) {
		if (total <= highWaterBytes) break;
		const deletedBytes = await removeFileForBudget({
			filePath: file.path,
			canonicalPath: file.canonicalPath,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths,
			onRemovedPath: params.onRemoveFile
		});
		if (deletedBytes <= 0) continue;
		total -= deletedBytes;
		freedBytes += deletedBytes;
		removedFiles += 1;
	}
	const deferredEvictedArtifactPaths = [];
	const planEvictedArtifactRemoval = (rawPath, canonicalPathHint) => {
		if (!dryRun && !commitEvictedIndex) return 0;
		const resolvedPath = path.resolve(rawPath);
		const canonicalPath = canonicalPathHint ?? canonicalizePathForComparison(resolvedPath);
		if (simulatedRemovedPaths.has(canonicalPath)) return 0;
		const size = fileSizesByPath.get(canonicalPath) ?? 0;
		if (size <= 0) return 0;
		simulatedRemovedPaths.add(canonicalPath);
		deferredEvictedArtifactPaths.push(resolvedPath);
		return size;
	};
	if (total > highWaterBytes) {
		const activeSessionKey = normalizeOptionalLowercaseString(params.activeSessionKey);
		const sessionIdRefCounts = buildSessionIdRefCounts(params.store);
		const entryChunkBytesByKey = buildStoreEntryChunkSizeMap(projectedStore);
		const keys = Object.keys(params.store).toSorted((a, b) => {
			return getEntryUpdatedAt(params.store[a]) - getEntryUpdatedAt(params.store[b]);
		});
		for (const key of keys) {
			if (total <= highWaterBytes) break;
			if (activeSessionKey && normalizeLowercaseStringOrEmpty(key) === activeSessionKey) continue;
			const entry = params.store[key];
			if (!entry) continue;
			if (shouldPreserveMaintenanceEntry({
				key,
				entry,
				preserveKeys: params.preserveKeys
			})) continue;
			const previousProjectedBytes = projectedStoreBytes;
			const projectedEntry = projectedStore[key];
			const promptBlobHash = resolveProjectedPromptBlobHash(projectedEntry);
			delete params.store[key];
			delete projectedStore[key];
			const chunkBytes = entryChunkBytesByKey.get(key);
			entryChunkBytesByKey.delete(key);
			if (typeof chunkBytes === "number" && Number.isFinite(chunkBytes) && chunkBytes >= 0) projectedStoreBytes = Math.max(2, projectedStoreBytes - (chunkBytes + 2));
			else projectedStoreBytes = measureStoreBytes(projectedStore);
			total += projectedStoreBytes - previousProjectedBytes;
			if (promptBlobHash) {
				const nextRefCount = (projectedPromptBlobRefCounts.get(promptBlobHash) ?? 1) - 1;
				if (nextRefCount > 0) projectedPromptBlobRefCounts.set(promptBlobHash, nextRefCount);
				else {
					projectedPromptBlobRefCounts.delete(promptBlobHash);
					const virtualBlobBytes = projectedPromptBlobBytesByHash.get(promptBlobHash) ?? 0;
					if (virtualBlobBytes > 0) total -= virtualBlobBytes;
					else {
						const blobFile = existingPromptBlobFilesByHash.get(promptBlobHash);
						if (blobFile && isPromptBlobArtifactRemovable(blobFile, projectedPromptBlobRefCounts, promptBlobOrphanCutoffMs, tempStaleCutoffMs)) {
							const plannedBytes = planEvictedArtifactRemoval(blobFile.path, blobFile.canonicalPath);
							if (plannedBytes > 0) {
								total -= plannedBytes;
								if (dryRun) {
									freedBytes += plannedBytes;
									removedFiles += 1;
								}
							}
						}
					}
				}
			}
			removedEntries += 1;
			const sessionId = entry.sessionId;
			if (!sessionId) continue;
			const nextRefCount = (sessionIdRefCounts.get(sessionId) ?? 1) - 1;
			if (nextRefCount > 0) {
				sessionIdRefCounts.set(sessionId, nextRefCount);
				continue;
			}
			sessionIdRefCounts.delete(sessionId);
			for (const artifactPath of resolveSessionArtifactPathsForEntry({
				sessionsDir,
				entry
			})) {
				const plannedBytes = planEvictedArtifactRemoval(artifactPath);
				if (plannedBytes <= 0) continue;
				total -= plannedBytes;
				if (dryRun) {
					freedBytes += plannedBytes;
					removedFiles += 1;
				}
			}
		}
	}
	if (!dryRun && commitEvictedIndex && deferredEvictedArtifactPaths.length > 0) {
		await commitEvictedIndex();
		for (const filePath of deferredEvictedArtifactPaths) {
			const deletedBytes = await removeFileForBudget({
				filePath,
				dryRun: false,
				fileSizesByPath,
				simulatedRemovedPaths,
				onRemovedPath: params.onRemoveFile
			});
			if (deletedBytes <= 0) continue;
			freedBytes += deletedBytes;
			removedFiles += 1;
		}
	}
	if (!dryRun) {
		if (total > highWaterBytes) log.warn("session disk budget still above high-water target after cleanup", {
			sessionsDir,
			totalBytes: total,
			maxBytes,
			highWaterBytes,
			removedFiles,
			removedEntries
		});
		else if (removedFiles > 0 || removedEntries > 0) log.info("applied session disk budget cleanup", {
			sessionsDir,
			totalBytesBefore: totalBefore,
			totalBytesAfter: total,
			maxBytes,
			highWaterBytes,
			removedFiles,
			removedEntries
		});
	}
	return {
		totalBytesBefore: totalBefore,
		totalBytesAfter: total,
		removedFiles,
		removedEntries,
		freedBytes,
		maxBytes,
		highWaterBytes,
		overBudget: true
	};
}
//#endregion
//#region src/sessions/agent-harness-session-key.ts
const AGENT_HARNESS_SESSION_KEY_PREFIX = "harness:";
const AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE = "Session key namespace is reserved for agent harness-owned sessions.";
const AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE = "Agent harness-owned session identity is locked and cannot be replaced or shared.";
const AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE = "Agent harness-owned sessions cannot be used for one-shot model runs.";
const MODEL_SELECTION_LOCK_REMOVAL_MESSAGE = "Model-selection-locked sessions cannot be removed, unlocked, or reassigned.";
function resolveAgentHarnessSessionKeyRest(sessionKey) {
	const trimmed = sessionKey.trim().toLowerCase();
	return parseAgentSessionKey(trimmed)?.rest ?? trimmed;
}
function resolveAgentHarnessSessionKeyOwner(sessionKey) {
	const rest = resolveAgentHarnessSessionKeyRest(sessionKey);
	if (!rest.startsWith(AGENT_HARNESS_SESSION_KEY_PREFIX)) return;
	const ownerSegment = rest.slice(8).split(":", 1)[0];
	return normalizeOptionalAgentRuntimeId(ownerSegment);
}
/** Agent harnesses own this namespace; public session APIs must not create rows in it. */
function isAgentHarnessSessionKey(sessionKey) {
	return resolveAgentHarnessSessionKeyRest(sessionKey).startsWith(AGENT_HARNESS_SESSION_KEY_PREFIX);
}
function resolveMissingAgentHarnessSessionError(sessionKey, entry) {
	return entry === void 0 && isAgentHarnessSessionKey(sessionKey) ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : void 0;
}
/** Missing reserved keys fail closed; pre-feature unlocked collisions stay ordinary. */
function resolveAgentHarnessSessionContextError(sessionKey, entry) {
	if (!isAgentHarnessSessionKey(sessionKey)) return;
	return entry ? resolveAgentHarnessSessionStoreEntryError(sessionKey, entry) : AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE;
}
/** Trusted creation must bind the namespace owner to the persisted harness owner. */
function isAgentHarnessSessionKeyOwnedBy(sessionKey, agentHarnessId) {
	const normalizedHarnessId = normalizeOptionalAgentRuntimeId(agentHarnessId);
	return Boolean(normalizedHarnessId && normalizedHarnessId === resolveAgentHarnessSessionKeyOwner(sessionKey));
}
function sessionLockOwnerMatches(previous, next) {
	const previousOwner = normalizeOptionalString(previous.agentHarnessId)?.toLowerCase();
	const nextOwner = normalizeOptionalString(next.agentHarnessId)?.toLowerCase();
	return previousOwner === nextOwner && normalizeOptionalAgentRuntimeId(previousOwner) === normalizeOptionalAgentRuntimeId(nextOwner);
}
function hasEquivalentRelocatedLockedEntry(params) {
	if (isAgentHarnessSessionKey(params.previousKey)) return false;
	const sessionId = normalizeOptionalString(params.previousEntry.sessionId);
	if (!sessionId) return false;
	return Object.entries(params.store).some(([sessionKey, entry]) => sessionKey !== params.previousKey && entry.modelSelectionLocked === true && entry.sessionId === sessionId && sessionLockOwnerMatches(params.previousEntry, entry));
}
/** Preserves durable harness ownership across whole-store compatibility projections. */
function resolveAgentHarnessSessionStoreTransitionError(params) {
	for (const [sessionKey, previousEntry] of params.before ?? []) {
		const nextEntry = params.store[sessionKey];
		if (nextEntry?.modelSelectionLocked === true && sessionLockOwnerMatches(previousEntry, nextEntry)) {
			if (nextEntry.sessionId !== previousEntry.sessionId) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
			continue;
		}
		const allowedRemoval = params.allowedRemovals?.get(sessionKey);
		if (nextEntry === void 0 && allowedRemoval !== void 0 && JSON.stringify(previousEntry) === JSON.stringify(allowedRemoval)) continue;
		if (nextEntry === void 0 && hasEquivalentRelocatedLockedEntry({
			previousKey: sessionKey,
			previousEntry,
			store: params.store
		})) continue;
		return MODEL_SELECTION_LOCK_REMOVAL_MESSAGE;
	}
}
/** True when a reserved-looking row carries the durable harness lock added with this feature. */
function isAgentHarnessSessionStoreEntryProtected(sessionKey, entry) {
	return isAgentHarnessSessionKey(sessionKey) && entry.modelSelectionLocked === true;
}
/** Validates durable harness locks and prevents transcript identity aliases. */
function resolveAgentHarnessSessionStoreError(store) {
	const lockedSessionIds = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of Object.entries(store)) {
		const entryError = resolveAgentHarnessSessionStoreEntryError(sessionKey, entry);
		if (entryError) return entryError;
		if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) continue;
		const sessionId = normalizeOptionalString(entry.sessionId);
		if (!sessionId || lockedSessionIds.has(sessionId)) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
		lockedSessionIds.set(sessionId, sessionKey);
	}
	for (const [sessionKey, entry] of Object.entries(store)) {
		const sessionId = normalizeOptionalString(entry.sessionId);
		const lockedOwner = sessionId ? lockedSessionIds.get(sessionId) : void 0;
		if (lockedOwner && lockedOwner !== sessionKey) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
	}
}
/** Rejects caller-selected transcript identities that would rotate a durable harness lock. */
function resolveAgentHarnessSessionIdMismatchError(entry, requestedSessionId) {
	if (!entry || entry.modelSelectionLocked !== true || !normalizeOptionalAgentRuntimeId(entry.agentHarnessId)) return;
	const requested = normalizeOptionalString(requestedSessionId);
	if (!requested) return;
	return requested === normalizeOptionalString(entry.sessionId) ? void 0 : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
}
/** Locked rows require durable identity; reserved rows must also match the key owner. */
function resolveAgentHarnessSessionStoreEntryError(sessionKey, entry) {
	if (entry.modelSelectionLocked !== true) return;
	const rawHarnessId = normalizeOptionalString(entry.agentHarnessId)?.toLowerCase();
	const hasCanonicalHarnessOwner = Boolean(rawHarnessId) && rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId);
	if (!normalizeOptionalString(entry.sessionId) && (isAgentHarnessSessionKey(sessionKey) || entry.agentHarnessId !== void 0)) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
	if (isAgentHarnessSessionKey(sessionKey)) return hasCanonicalHarnessOwner && isAgentHarnessSessionKeyOwnedBy(sessionKey, entry.agentHarnessId) ? void 0 : AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE;
	if (entry.agentHarnessId === void 0) return;
	if (!hasCanonicalHarnessOwner) return AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
}
/** True for any valid durable harness lock, including supported ordinary-key rows. */
function isValidAgentHarnessSessionStoreEntry(sessionKey, entry) {
	return entry.modelSelectionLocked === true && (isAgentHarnessSessionKey(sessionKey) || normalizeOptionalAgentRuntimeId(entry.agentHarnessId) !== void 0) && resolveAgentHarnessSessionStoreEntryError(sessionKey, entry) === void 0;
}
//#endregion
export { runExclusiveSessionStoreWrite as $, shouldRunModelRunPrune as A, collectActiveSessionWorkAdmissionIdentities as B, getActiveSessionMaintenanceWarning as C, resolveMaintenanceConfigFromInput as D, pruneStaleModelRunEntries as E, resolveSessionConversation as F, hasOnlySessionLifecycleMutationKindActive as G, getActiveSessionWorkAdmissionCount as H, resolveSessionConversationRef as I, isSessionLifecycleMutationActive as J, interruptSessionWorkAdmissions as K, resolveSessionParentSessionKey as L, parseSessionThreadInfo as M, parseSessionThreadInfoFast as N, resolveQuotaSuspensionEntryMaintenance as O, resolveLoadedSessionThreadInfo as P, consumeSessionWorkAdmissionHandoff as Q, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS as R, capEntryCount as S, pruneStaleEntries as T, getCurrentSessionWorkAdmissionRelease as U, getActiveSessionLifecycleMutationCount as V, getSessionWorkAdmissionRelease as W, runExclusiveSessionLifecycleMutation as X, isSessionWorkAdmissionActive as Y, cancelSessionWorkAdmissionHandoff as Z, measureSessionPhysicalDiskUsage as _, isAgentHarnessSessionKey as a, resolveSessionArtifactCanonicalPathsForEntry as b, isValidAgentHarnessSessionStoreEntry as c, resolveAgentHarnessSessionStoreEntryError as d, clearSessionStoreCacheForTest as et, resolveAgentHarnessSessionStoreError as f, hasRetainedSessionTranscriptArchives as g, enforceSessionDiskBudget as h, MODEL_SELECTION_LOCK_REMOVAL_MESSAGE as i, shouldRunSessionEntryMaintenance as j, shouldPreserveMaintenanceEntry as k, resolveAgentHarnessSessionContextError as l, resolveMissingAgentHarnessSessionError as m, AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE as n, hydrateSessionStoreSkillPromptRefs as nt, isAgentHarnessSessionKeyOwnedBy as o, resolveAgentHarnessSessionStoreTransitionError as p, isCompetingSessionWorkAdmissionActive as q, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE as r, projectSessionStoreForPersistence as rt, isAgentHarnessSessionStoreEntryProtected as s, AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE as t, ensureSessionStorePromptBlobsForPersistence as tt, resolveAgentHarnessSessionIdMismatchError as u, pruneSessionTranscriptArchivesToHighWater as v, normalizeResolvedMaintenanceConfigInput as w, resolveMaintenanceConfig as x, pruneUnreferencedSessionArtifacts as y, beginSessionWorkAdmission as z };
