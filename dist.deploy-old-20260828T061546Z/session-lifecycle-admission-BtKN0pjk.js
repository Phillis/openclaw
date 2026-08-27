import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as normalizeHyphenSlug } from "./string-normalization-e_fvmxMf.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, i as isCronSessionKey, s as normalizeSessionPeerId } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { I as ensureLoopGovernorTurnCountsSchema, Nn as getNodeSqliteKysely, d as openOpenClawStateDatabase, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { i as listChannelPlugins } from "./registry-CZjiz1Jg.js";
import { p as listDeliverableMessageChannels } from "./message-channel-BZwx7FCw.js";
import { _ as runQueuedStoreWrite, l as WRITER_QUEUES } from "./store-entry-BN3xGmHe.js";
import { l as isGatewaySubordinateWorkAdmissionClosed, t as GatewayDrainingError } from "./gateway-work-admission-CTDt7IQ1.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/group.ts
const getGroupSurfaces = () => /* @__PURE__ */ new Set([...listDeliverableMessageChannels(), "webchat"]);
function resolveLegacyGroupSessionKey(ctx) {
	for (const plugin of listChannelPlugins()) {
		const resolved = plugin.messaging?.resolveLegacyGroupSessionKey?.(ctx);
		if (resolved) return resolved;
	}
	return null;
}
function normalizeGroupLabel(raw) {
	return normalizeHyphenSlug(raw);
}
function joinOpaqueTail(parts, start) {
	return normalizeOptionalString(parts[start]) ? parts.slice(start).join(":") : null;
}
function resolveOriginatingGroupTargetId(params) {
	const target = normalizeOptionalString(params.ctx.OriginatingTo ?? params.ctx.To) ?? "";
	if (!target) return null;
	const parts = target.split(":");
	if (parts.length < 2) return null;
	const head = normalizeLowercaseStringOrEmpty(parts[0]);
	const second = normalizeOptionalLowercaseString(parts[1]);
	if ((second === "group" || second === "channel") && (head === params.provider || getGroupSurfaces().has(head))) return joinOpaqueTail(parts, 2);
	if (head === params.provider || head === "chat" || head === "room" || head === "group") return joinOpaqueTail(parts, 1);
	if (head === "channel") return joinOpaqueTail(parts, 1);
	return null;
}
function shortenGroupId(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	if (!trimmed) return "";
	if (trimmed.length <= 14) return trimmed;
	return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}
/**
* Builds a human-readable group/channel title from stored chat metadata.
* Prefers the native channel name (#general) or the chat subject verbatim;
* returns undefined when only opaque route ids are available so callers can
* fall back to the compact token form below.
*/
function buildGroupDisplayTitle(params) {
	const subject = normalizeOptionalString(params.subject);
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const space = normalizeOptionalString(params.space);
	if (groupChannel) {
		const channelLabel = groupChannel.startsWith("#") ? groupChannel : `#${groupChannel}`;
		return space ? `${space} ${channelLabel}` : channelLabel;
	}
	return subject ?? space ?? void 0;
}
/** Builds a compact display label for group sessions from channel metadata or ids. */
function buildGroupDisplayName(params) {
	const providerKey = normalizeOptionalLowercaseString(params.provider) ?? "group";
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const space = normalizeOptionalString(params.space);
	const subject = normalizeOptionalString(params.subject);
	const detail = (groupChannel && space ? `${space}${groupChannel.startsWith("#") ? "" : "#"}${groupChannel}` : groupChannel || subject || space || "") || "";
	const fallbackId = normalizeOptionalString(params.id) ?? params.key;
	const rawLabel = detail || fallbackId;
	let token = normalizeGroupLabel(rawLabel);
	if (!token) token = normalizeGroupLabel(shortenGroupId(rawLabel));
	if (!params.groupChannel && token.startsWith("#")) token = token.replace(/^#+/, "");
	if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#")) token = `g-${token}`;
	return token ? `${providerKey}:${token}` : providerKey;
}
/**
* Resolves channel/group chat context into the persisted group session key.
*
* Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
* fallback for older channel surfaces that cannot yet express the generic route shape.
*/
function resolveGroupSessionKey(ctx) {
	const from = normalizeOptionalString(ctx.From) ?? "";
	const chatType = normalizeOptionalLowercaseString(ctx.ChatType);
	const normalizedChatType = chatType === "channel" ? "channel" : chatType === "group" ? "group" : void 0;
	const legacyResolution = resolveLegacyGroupSessionKey(ctx);
	if (!(normalizedChatType === "group" || normalizedChatType === "channel" || from.includes(":group:") || from.includes(":channel:") || legacyResolution !== null)) return null;
	const providerHint = normalizeOptionalLowercaseString(ctx.Provider);
	const parts = from.split(":");
	const head = normalizeLowercaseStringOrEmpty(parts[0]);
	const headIsSurface = head ? getGroupSurfaces().has(head) : false;
	if (!headIsSurface && !providerHint && legacyResolution) return legacyResolution;
	const provider = headIsSurface ? head : providerHint ?? legacyResolution?.channel;
	if (!provider) return null;
	const second = normalizeOptionalLowercaseString(parts[1]);
	const secondIsKind = second === "group" || second === "channel";
	const kind = secondIsKind ? second : from.includes(":channel:") || normalizedChatType === "channel" ? "channel" : "group";
	const originatingGroupTargetId = !secondIsKind && normalizedChatType ? resolveOriginatingGroupTargetId({
		ctx,
		provider
	}) : null;
	const id = originatingGroupTargetId ? originatingGroupTargetId : headIsSurface ? secondIsKind ? joinOpaqueTail(parts, 2) : joinOpaqueTail(parts, 1) : from;
	if (!id) return null;
	const finalId = normalizeSessionPeerId({
		channel: provider,
		peerKind: kind,
		peerId: id
	});
	if (!finalId) return null;
	return {
		key: `${provider}:${kind}:${finalId}`,
		channel: provider,
		id: finalId,
		chatType: kind === "channel" ? "channel" : "group"
	};
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
const log = createSubsystemLogger("loop-governor");
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
			log.warn("[loop-governor] breach", {
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
		log.warn(`[loop-governor] state persist failure for ${normalizedAgent}: ${String(error)}`);
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
		log.warn(`[loop-governor] failed to enqueue breach alert: ${String(error)}`);
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
function isSessionWorkAdmissionTargetActive(params) {
	const identities = normalizeSessionIdentities(params.scope, [params.sessionKey, params.sessionId]);
	return identities.some((identity) => Array.from(ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []).some((admission) => admission.identities.size === 1 || identities.every((target) => admission.identities.has(target))));
}
/** Whether another admitted turn currently owns any of these session identities. */
function isCompetingSessionWorkAdmissionActive(scope, identities) {
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	return normalizeSessionIdentities(scope, identities).some((identity) => Array.from(ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? [], (admission) => !currentAdmissions?.has(admission)).some(Boolean));
}
/** Completion of the currently active turns that own a session. */
function getSessionWorkAdmissionRelease(params) {
	const matchingAdmissions = /* @__PURE__ */ new Set();
	for (const identity of normalizeSessionIdentities(params.scope, params.identities)) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) matchingAdmissions.add(admission);
	if (matchingAdmissions.size === 0) return;
	return Promise.all(Array.from(matchingAdmissions, (admission) => admission.released)).then(() => void 0);
}
/** Active session identities grouped by their authoritative store/lifecycle scope. */
function collectActiveSessionWorkAdmissions() {
	const targets = /* @__PURE__ */ new Map();
	for (const [normalizedIdentity, admissions] of ACTIVE_SESSION_WORK_ADMISSIONS) {
		if (admissions.size === 0) continue;
		const decoded = decodeSessionIdentity(normalizedIdentity);
		if (!decoded) continue;
		const identities = targets.get(decoded.scope) ?? /* @__PURE__ */ new Set();
		identities.add(decoded.identity);
		targets.set(decoded.scope, identities);
	}
	return targets;
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
function startSessionWorkAdmissionInterruption(params) {
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
	return { released: Promise.all(Array.from(admissions, (admission) => admission.released)).then(() => void 0) };
}
async function interruptSessionWorkAdmissions(params) {
	const { released } = startSessionWorkAdmissionInterruption(params);
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
export { runExclusiveSessionStoreWrite as _, getActiveSessionWorkAdmissionCount as a, resolveGroupSessionKey as b, interruptSessionWorkAdmissions as c, isSessionWorkAdmissionActive as d, isSessionWorkAdmissionTargetActive as f, consumeSessionWorkAdmissionHandoff as g, cancelSessionWorkAdmissionHandoff as h, getActiveSessionLifecycleMutationCount as i, isCompetingSessionWorkAdmissionActive as l, startSessionWorkAdmissionInterruption as m, beginSessionWorkAdmission as n, getSessionWorkAdmissionRelease as o, runExclusiveSessionLifecycleMutation as p, collectActiveSessionWorkAdmissions as r, hasOnlySessionLifecycleMutationKindActive as s, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS as t, isSessionLifecycleMutationActive as u, buildGroupDisplayName as v, buildGroupDisplayTitle as y };
