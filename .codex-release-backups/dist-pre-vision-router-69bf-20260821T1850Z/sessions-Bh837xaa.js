import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import "./artifacts-Cg2BoGvO.js";
import "./paths-CfFmgJmW.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { g as openOpenClawAgentDatabase, v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-C8vnaZ56.js";
import "./main-session-Dth0X5B9.js";
import { $t as loadSessionEntryReadOnly, Dt as applySessionEntryLifecycleMutation, Pt as listSessionEntriesCore, en as patchSessionEntryCore } from "./session-accessor-CIiPoGwM.js";
import "./store-entry-shape-CnAfxmHQ.js";
import "./targets-CdQ3kEkv.js";
import "./store-entry-BB6W2GxL.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BhHIMU5g.js";
import { p as toDatabaseOptions, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-kLvPv-zX.js";
import { T as pruneStaleEntries } from "./agent-harness-session-key-BpWapmwX.js";
import { g as resolveFreshSessionTotalTokens, x as collectActiveSessionWorkAdmissionKeys } from "./restart-recovery-state-YPGO30LK.js";
import "./delivery-info-D3wyNvfQ.js";
import { d as recordSessionGoalChanged } from "./session-state-events-DTKQ6kKc.js";
import "./combined-store-gateway-BgoNjNGZ.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./main-session.runtime.js";
import { n as SessionWorkStartInvalidatedError } from "./lifecycle-4IbI4BFl.js";
import "./reset-1TbI4IQQ.js";
import "./session-key-DrPL3_t2.js";
import "./transcript-DOeEf3qR.js";
import "./cleanup-service-DQZHCuYD.js";
import crypto, { randomUUID } from "node:crypto";
import fs from "node:fs";
//#region src/config/sessions/goals.ts
const MODEL_UPDATABLE_SESSION_GOAL_STATUSES = ["complete", "blocked"];
const TERMINAL_GOAL_STATUSES = /* @__PURE__ */ new Set(["complete"]);
function nowMs(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
}
function normalizeTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
function resolveEntryFreshTotalTokens(entry) {
	return normalizeTokenCount(resolveFreshSessionTotalTokens(entry));
}
function resolveEntryGoalStartTokens(entry) {
	return resolveEntryFreshTotalTokens(entry) ?? 0;
}
function normalizeTokenBudget(value) {
	const normalized = normalizeTokenCount(value);
	return normalized && normalized > 0 ? normalized : void 0;
}
function cloneGoal(goal) {
	return { ...goal };
}
function recordGoalChange(options, entry, summary) {
	recordSessionGoalChanged({
		sessionKey: options.sessionKey,
		entry,
		actor: options.actor,
		agentId: options.agentId,
		summary
	});
}
function resolveSessionGoalDisplayState(entry, now, options) {
	return accountGoalUsage(entry, nowMs(now), options);
}
function accountGoalUsage(entry, now, options) {
	const goal = entry.goal;
	if (!goal) return;
	const totalTokens = resolveEntryFreshTotalTokens(entry);
	const hasFreshStart = goal.tokenStartFresh !== false;
	const shouldHoldStaleStart = !hasFreshStart && options?.adoptFreshBaseline === false;
	const shouldAdoptFreshStart = !shouldHoldStaleStart && totalTokens !== void 0 && !hasFreshStart;
	const tokenStart = shouldAdoptFreshStart ? totalTokens : normalizeTokenCount(goal.tokenStart) ?? totalTokens ?? 0;
	const tokensUsed = totalTokens === void 0 || shouldAdoptFreshStart || shouldHoldStaleStart ? goal.tokensUsed : Math.max(goal.tokensUsed, Math.max(0, totalTokens - tokenStart));
	const next = {
		...goal,
		tokenStart,
		tokenStartFresh: hasFreshStart || shouldAdoptFreshStart,
		tokensUsed
	};
	if (next.status === "active" && next.tokenBudget !== void 0 && tokensUsed >= next.tokenBudget) {
		next.status = "budget_limited";
		next.budgetLimitedAt = now;
		next.updatedAt = now;
	}
	return next;
}
function goalsEqual(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function formatSessionGoalStatus(goal) {
	if (!goal) return "No goal for this session.\nStart one with /goal start <objective>.";
	const budget = goal.tokenBudget === void 0 ? "" : `\nToken budget: ${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
	const note = goal.lastStatusNote ? `\nNote: ${goal.lastStatusNote}` : "";
	const commands = resolveGoalCommandHint(goal.status);
	return [
		"Goal",
		`Status: ${goal.status}`,
		`Objective: ${goal.objective}`,
		`Tokens used: ${formatTokenCount(goal.tokensUsed)}`,
		...budget ? [budget.slice(1)] : [],
		...note ? [note.slice(1)] : [],
		"",
		`Commands: ${commands}`
	].join("\n");
}
function resolveGoalCommandHint(status) {
	switch (status) {
		case "active": return "/goal edit <objective>, /goal pause, /goal complete, /goal clear";
		case "paused":
		case "blocked":
		case "usage_limited":
		case "budget_limited": return "/goal resume, /goal edit <objective>, /goal clear";
		case "complete": return "/goal clear";
	}
	return "/goal";
}
async function getSessionGoal(options) {
	const now = nowMs(options.now);
	if (options.persist === false) {
		const entry = loadSessionEntryReadOnly({
			sessionKey: options.sessionKey,
			storePath: options.storePath
		}) ?? options.fallbackEntry;
		const projected = entry ? resolveSessionGoalDisplayState(entry, now, { adoptFreshBaseline: false }) : void 0;
		return projected ? {
			status: "found",
			goal: projected
		} : { status: "missing" };
	}
	let goal;
	if (!await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		const accounted = accountGoalUsage(entry, now);
		goal = accounted ? cloneGoal(accounted) : void 0;
		if (!accounted || goalsEqual(accounted, entry.goal)) return null;
		return { goal: accounted };
	}, { fallbackEntry: options.fallbackEntry }) || !goal) return { status: "missing" };
	return {
		status: "found",
		goal
	};
}
async function createSessionGoal(options) {
	const objective = options.objective.trim();
	if (!objective) throw new Error("objective required");
	const now = nowMs(options.now);
	let created;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		if (entry.goal) throw new Error("goal already exists");
		const tokenBudget = normalizeTokenBudget(options.tokenBudget);
		const tokenStartFresh = resolveEntryFreshTotalTokens(entry) !== void 0;
		created = {
			schemaVersion: 1,
			id: crypto.randomUUID(),
			objective,
			status: "active",
			createdAt: now,
			updatedAt: now,
			tokenStart: resolveEntryGoalStartTokens(entry),
			tokenStartFresh,
			tokensUsed: 0,
			...tokenBudget ? { tokenBudget } : {},
			continuationTurns: 0
		};
		return { goal: created };
	}, { fallbackEntry: options.fallbackEntry });
	if (!result || !created) throw new Error("session not found");
	recordGoalChange(options, result, "goal created");
	return cloneGoal(created);
}
async function updateSessionGoalStatus(options) {
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		const accounted = accountGoalUsage(entry, now);
		if (!accounted) throw new Error("goal not found");
		if (TERMINAL_GOAL_STATUSES.has(accounted.status) && accounted.status !== options.status) throw new Error(`goal is already ${accounted.status}`);
		const resetsBudgetWindow = options.status === "active" && (accounted.status === "budget_limited" || accounted.status === "usage_limited" || accounted.tokenBudget !== void 0 && accounted.tokensUsed >= accounted.tokenBudget);
		const freshTokenStart = resetsBudgetWindow ? resolveEntryFreshTotalTokens(entry) : void 0;
		const next = {
			...accounted,
			status: options.status,
			updatedAt: now,
			...options.note ? { lastStatusNote: options.note } : {},
			...options.status === "paused" ? { pausedAt: now } : {},
			...options.status === "blocked" ? { blockedAt: now } : {},
			...options.status === "complete" ? { completedAt: now } : {}
		};
		if (resetsBudgetWindow) {
			next.tokenStart = freshTokenStart ?? 0;
			next.tokenStartFresh = freshTokenStart !== void 0;
			next.tokensUsed = 0;
			delete next.budgetLimitedAt;
			delete next.usageLimitedAt;
		}
		if (next.status === "active" && next.tokenBudget !== void 0 && next.tokensUsed >= next.tokenBudget) {
			next.status = "budget_limited";
			next.budgetLimitedAt = now;
		}
		updated = next;
		return { goal: updated };
	});
	if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	recordGoalChange(options, result, `goal status changed to ${updated.status}`);
	return cloneGoal(updated);
}
async function updateSessionGoalObjective(options) {
	const objective = options.objective.trim();
	if (!objective) throw new Error("objective required");
	const now = nowMs(options.now);
	let updated;
	let foundSession = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		foundSession = true;
		const accounted = accountGoalUsage(entry, now);
		if (!accounted) throw new Error("goal not found");
		if (TERMINAL_GOAL_STATUSES.has(accounted.status)) throw new Error(`goal is already ${accounted.status}`);
		updated = {
			...accounted,
			objective,
			updatedAt: now
		};
		return { goal: updated };
	});
	if (!result || !updated) throw new Error(foundSession ? "goal not found" : "session not found");
	recordGoalChange(options, result, "goal objective changed");
	return cloneGoal(updated);
}
async function clearSessionGoal(options) {
	let removed = false;
	const result = await patchSessionEntryCore({
		sessionKey: options.sessionKey,
		storePath: options.storePath
	}, (entry) => {
		if (!entry.goal) return null;
		removed = true;
		return { goal: void 0 };
	});
	if (result && removed) recordGoalChange(options, result, "goal cleared");
	return Boolean(result && removed);
}
//#endregion
//#region src/config/sessions/session-registry-maintenance.ts
function parseCronRunSessionJobId(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return;
	return /^cron:([^:]+):run:[^:]+(?:$|:)/u.exec(parsed.rest)?.[1];
}
function buildSessionRegistryPreserveKeys(params) {
	const preserveKeys = collectActiveSessionWorkAdmissionKeys({
		storePath: params.storePath,
		store: params.store
	}) ?? /* @__PURE__ */ new Set();
	let preservedRunning = 0;
	for (const key of Object.keys(params.store)) {
		const jobId = parseCronRunSessionJobId(key);
		if (!jobId) {
			preserveKeys.add(key);
			continue;
		}
		if (params.runningCronJobIds.has(jobId)) {
			preserveKeys.add(key);
			preservedRunning += 1;
		}
	}
	return {
		preserveKeys,
		preservedRunning
	};
}
function pruneSessionRegistryStore(params) {
	const { preserveKeys, preservedRunning } = buildSessionRegistryPreserveKeys({
		runningCronJobIds: params.runningCronJobIds,
		storePath: params.storePath,
		store: params.store
	});
	const pruned = pruneStaleEntries(params.store, params.retentionMs, {
		log: false,
		onPruned: params.removals ? ({ key, entry }) => {
			params.removals?.push({
				sessionKey: key,
				expectedEntry: entry,
				archiveRemovedTranscript: true
			});
		} : void 0,
		preserveKeys
	});
	return {
		afterCount: Object.keys(params.store).length,
		preservedRunning,
		pruned
	};
}
/**
* Runs task session-registry maintenance for one resolved agent store.
* Preview prunes a clone; apply uses one store-sized write transaction and
* skips generic session maintenance so non-cron rows stay outside this sweep.
*/
async function runSessionRegistryMaintenanceForStore(params) {
	const sqliteTarget = resolveSqliteTargetFromSessionStorePath(params.storePath);
	if (sqliteTarget.path && !fs.existsSync(sqliteTarget.path)) return {
		beforeCount: 0,
		afterCount: 0,
		preservedRunning: 0,
		pruned: 0
	};
	const beforeStore = Object.fromEntries(listSessionEntriesCore({ storePath: params.storePath }).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const beforeCount = Object.keys(beforeStore).length;
	if (!params.apply) {
		const previewStore = structuredClone(beforeStore);
		return {
			beforeCount,
			...pruneSessionRegistryStore({
				retentionMs: params.retentionMs,
				runningCronJobIds: params.runningCronJobIds,
				storePath: params.storePath,
				store: previewStore
			})
		};
	}
	const applyStore = structuredClone(beforeStore);
	const removals = [];
	const applied = pruneSessionRegistryStore({
		retentionMs: params.retentionMs,
		removals,
		runningCronJobIds: params.runningCronJobIds,
		storePath: params.storePath,
		store: applyStore
	});
	if (removals.length > 0) {
		const mutation = await applySessionEntryLifecycleMutation({
			storePath: params.storePath,
			removals,
			skipMaintenance: true
		});
		return {
			afterCount: mutation.afterCount,
			beforeCount,
			preservedRunning: applied.preservedRunning,
			pruned: mutation.removedEntries
		};
	}
	return {
		beforeCount,
		...applied
	};
}
//#endregion
//#region src/config/sessions/session-sharing-store.ts
const SESSION_MEMBERSHIP_QUERY_CHUNK_SIZE = 400;
function resolveDatabaseOptions$1(scope) {
	return toDatabaseOptions(resolveSqliteScope(scope));
}
function getSessionMemberKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function listSessionMembers(scope) {
	const database = openOpenClawAgentDatabase(resolveDatabaseOptions$1(scope));
	const db = getSessionMemberKysely(database);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_members").select([
		"identity_id",
		"added_by",
		"added_at"
	]).where("session_key", "=", resolveSqliteScope(scope).sessionKey).orderBy("identity_id")).rows.map((row) => ({
		identityId: row.identity_id,
		addedBy: row.added_by,
		addedAt: row.added_at
	}));
}
function listSessionMembershipKeys(scope, sessionKeys, identityId) {
	const normalizedIdentityId = identityId.trim();
	const normalizedSessionKeys = [...new Set(sessionKeys.map((key) => key.trim()).filter(Boolean))];
	if (!normalizedIdentityId || normalizedSessionKeys.length === 0) return /* @__PURE__ */ new Set();
	const database = openOpenClawAgentDatabase(resolveDatabaseOptions$1(scope));
	const db = getSessionMemberKysely(database);
	const memberships = /* @__PURE__ */ new Set();
	for (let offset = 0; offset < normalizedSessionKeys.length; offset += SESSION_MEMBERSHIP_QUERY_CHUNK_SIZE) {
		const chunk = normalizedSessionKeys.slice(offset, offset + SESSION_MEMBERSHIP_QUERY_CHUNK_SIZE);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_members").select("session_key").where("identity_id", "=", normalizedIdentityId).where("session_key", "in", chunk)).rows;
		for (const row of rows) memberships.add(row.session_key);
	}
	return memberships;
}
function isSessionMember(scope, identityId) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return false;
	const database = openOpenClawAgentDatabase(resolveDatabaseOptions$1(scope));
	const db = getSessionMemberKysely(database);
	return Boolean(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_members").select("identity_id").where("session_key", "=", resolveSqliteScope(scope).sessionKey).where("identity_id", "=", normalizedIdentityId)));
}
function assertAuthorizedSessionInstance(database, sessionKey, expectedSessionId) {
	const row = database.db.prepare("SELECT current_session_id, entry_json FROM session_nodes WHERE session_key = ?").get(sessionKey);
	let entrySessionId;
	try {
		const entry = row?.entry_json ? JSON.parse(row.entry_json) : void 0;
		const candidate = entry && typeof entry === "object" && !Array.isArray(entry) ? entry.sessionId : void 0;
		entrySessionId = typeof candidate === "string" ? candidate : void 0;
	} catch {
		entrySessionId = void 0;
	}
	if (!row || entrySessionId === void 0 || row.current_session_id !== entrySessionId || expectedSessionId !== void 0 && entrySessionId !== expectedSessionId) throw new Error("session changed before sharing mutation");
}
function addSessionMember(scope, params) {
	const identityId = params.identityId.trim();
	const addedBy = params.addedBy.trim();
	if (!identityId || !addedBy) throw new Error("session member identity and actor are required");
	const options = resolveDatabaseOptions$1(scope);
	const addedAt = params.addedAt ?? Date.now();
	const inserted = runOpenClawAgentWriteTransaction((database) => {
		assertAuthorizedSessionInstance(database, resolveSqliteScope(scope).sessionKey, params.expectedSessionId);
		const db = getSessionMemberKysely(database);
		return (executeSqliteQuerySync(database.db, db.insertInto("session_members").values({
			session_key: resolveSqliteScope(scope).sessionKey,
			identity_id: identityId,
			added_by: addedBy,
			added_at: addedAt
		}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing())).numAffectedRows ?? 0n) > 0n;
	}, options);
	return {
		member: {
			identityId,
			addedBy,
			addedAt
		},
		inserted
	};
}
function removeSessionMember(scope, identityId, expected, expectedSessionId) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return null;
	return runOpenClawAgentWriteTransaction((database) => {
		assertAuthorizedSessionInstance(database, resolveSqliteScope(scope).sessionKey, expectedSessionId);
		const db = getSessionMemberKysely(database);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_members").select([
			"identity_id",
			"added_by",
			"added_at"
		]).where("session_key", "=", resolveSqliteScope(scope).sessionKey).where("identity_id", "=", normalizedIdentityId));
		if (!row || expected && (row.added_by !== expected.addedBy || row.added_at !== expected.addedAt)) return null;
		executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", resolveSqliteScope(scope).sessionKey).where("identity_id", "=", normalizedIdentityId));
		return {
			identityId: row.identity_id,
			addedBy: row.added_by,
			addedAt: row.added_at
		};
	}, resolveDatabaseOptions$1(scope));
}
//#endregion
//#region src/config/sessions/session-suggestion-store.ts
const MAX_PENDING_SESSION_SUGGESTIONS_PER_AUTHOR = 20;
const MAX_PENDING_SESSION_SUGGESTIONS_PER_SESSION = 100;
const MAX_RETAINED_RESOLVED_SESSION_SUGGESTIONS = 200;
const SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS = 3e4;
function resolveDatabaseOptions(scope) {
	return toDatabaseOptions(resolveSqliteScope(scope));
}
function suggestionDb(database) {
	return getNodeSqliteKysely(database.db);
}
function toSuggestion(row) {
	return {
		id: row.id,
		authorId: row.author_id,
		...row.author_label ? { authorLabel: row.author_label } : {},
		text: row.text,
		createdAt: row.created_at,
		state: row.state
	};
}
function assertSessionInstance(database, sessionKey, expectedSessionId) {
	if (expectedSessionId === void 0) return;
	const row = database.db.prepare("SELECT current_session_id, entry_json FROM session_nodes WHERE session_key = ?").get(sessionKey);
	let entrySessionId;
	try {
		const entry = row?.entry_json ? JSON.parse(row.entry_json) : void 0;
		const candidate = entry && typeof entry === "object" && !Array.isArray(entry) ? entry.sessionId : void 0;
		entrySessionId = typeof candidate === "string" ? candidate : void 0;
	} catch {
		entrySessionId = void 0;
	}
	if (!row || entrySessionId === void 0 || row.current_session_id !== entrySessionId || entrySessionId !== expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
}
function pruneResolvedSessionSuggestions(database, sessionKey) {
	const db = suggestionDb(database);
	const resolvedRows = executeSqliteQuerySync(database.db, db.selectFrom("session_suggestions").select("id").where("session_key", "=", sessionKey).where("state", "!=", "pending").orderBy("created_at", "desc").orderBy("id", "desc")).rows.slice(MAX_RETAINED_RESOLVED_SESSION_SUGGESTIONS);
	if (resolvedRows.length === 0) return;
	executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("id", "in", resolvedRows.map((row) => row.id)));
}
function addSessionSuggestion(scope, params) {
	const authorId = params.authorId.trim();
	const authorLabel = params.authorLabel?.trim() || void 0;
	const text = params.text;
	if (!authorId || !text.trim()) throw new Error("suggestion author and text are required");
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	const suggestion = {
		id: params.id ?? randomUUID(),
		authorId,
		...authorLabel ? { authorLabel } : {},
		text,
		createdAt: params.createdAt ?? Date.now(),
		state: "pending"
	};
	runOpenClawAgentWriteTransaction((database) => {
		assertSessionInstance(database, sessionKey, params.expectedSessionId);
		const db = suggestionDb(database);
		pruneResolvedSessionSuggestions(database, sessionKey);
		const pendingRows = executeSqliteQuerySync(database.db, db.selectFrom("session_suggestions").select("author_id").where("session_key", "=", sessionKey).where("state", "=", "pending")).rows;
		if (pendingRows.length >= MAX_PENDING_SESSION_SUGGESTIONS_PER_SESSION) throw new Error("session pending suggestion limit reached");
		if (pendingRows.filter((row) => row.author_id === suggestion.authorId).length >= MAX_PENDING_SESSION_SUGGESTIONS_PER_AUTHOR) throw new Error("author pending suggestion limit reached");
		executeSqliteQuerySync(database.db, db.insertInto("session_suggestions").values({
			id: suggestion.id,
			session_key: sessionKey,
			author_id: suggestion.authorId,
			author_label: suggestion.authorLabel ?? null,
			text: suggestion.text,
			created_at: suggestion.createdAt,
			state: suggestion.state,
			dispatch_token: null,
			dispatch_started_at: null,
			dispatch_resolution: null
		}));
	}, options);
	return suggestion;
}
function listSessionSuggestions(scope, params = {}) {
	const database = openOpenClawAgentDatabase(resolveDatabaseOptions(scope));
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	let query = suggestionDb(database).selectFrom("session_suggestions").select([
		"id",
		"author_id",
		"author_label",
		"text",
		"created_at",
		"state"
	]).where("session_key", "=", sessionKey);
	if (params.authorId?.trim()) query = query.where("author_id", "=", params.authorId.trim());
	if (params.pendingOnly) query = query.where("state", "=", "pending");
	return executeSqliteQuerySync(database.db, query.orderBy("created_at", "asc").orderBy("id", "asc")).rows.map(toSuggestion);
}
function claimSessionSuggestionDispatch(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => {
		assertSessionInstance(database, sessionKey, params.expectedSessionId);
		const db = suggestionDb(database);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_suggestions").select([
			"id",
			"author_id",
			"author_label",
			"text",
			"created_at",
			"state",
			"dispatch_token",
			"dispatch_started_at",
			"dispatch_resolution"
		]).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending"));
		if (!row) return null;
		const now = params.now ?? Date.now();
		const claimTtlMs = params.claimTtlMs ?? 3e4;
		if (row.dispatch_token && row.dispatch_started_at !== null && now - row.dispatch_started_at < claimTtlMs) return { kind: "busy" };
		if (row.dispatch_resolution && row.dispatch_resolution !== params.resolution) return {
			kind: "mismatch",
			resolution: row.dispatch_resolution
		};
		const token = randomUUID();
		executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({
			dispatch_token: token,
			dispatch_started_at: now,
			dispatch_resolution: params.resolution
		}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending"));
		return {
			kind: "claimed",
			suggestion: toSuggestion(row),
			token
		};
	}, options);
}
function releaseSessionSuggestionDispatch(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => {
		assertSessionInstance(database, sessionKey, params.expectedSessionId);
		return (executeSqliteQuerySync(database.db, suggestionDb(database).updateTable("session_suggestions").set({
			dispatch_token: null,
			dispatch_started_at: null,
			dispatch_resolution: null
		}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) > 0n;
	}, options);
}
function finalizeSessionSuggestionClaim(scope, params) {
	const options = resolveDatabaseOptions(scope);
	const sessionKey = resolveSqliteScope(scope).sessionKey;
	return runOpenClawAgentWriteTransaction((database) => {
		assertSessionInstance(database, sessionKey, params.expectedSessionId);
		const db = suggestionDb(database);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_suggestions").select([
			"id",
			"author_id",
			"author_label",
			"text",
			"created_at",
			"state"
		]).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token));
		if (!row) return null;
		if ((executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({
			state: params.state,
			dispatch_token: null,
			dispatch_started_at: null,
			dispatch_resolution: null
		}).where("session_key", "=", sessionKey).where("id", "=", params.id).where("state", "=", "pending").where("dispatch_token", "=", params.token)).numAffectedRows ?? 0n) === 0n) return null;
		pruneResolvedSessionSuggestions(database, sessionKey);
		return {
			...toSuggestion(row),
			state: params.state
		};
	}, options);
}
//#endregion
export { getSessionGoal as _, listSessionSuggestions as a, updateSessionGoalStatus as b, isSessionMember as c, removeSessionMember as d, runSessionRegistryMaintenanceForStore as f, formatSessionGoalStatus as g, createSessionGoal as h, finalizeSessionSuggestionClaim as i, listSessionMembers as l, clearSessionGoal as m, addSessionSuggestion as n, releaseSessionSuggestionDispatch as o, MODEL_UPDATABLE_SESSION_GOAL_STATUSES as p, claimSessionSuggestionDispatch as r, addSessionMember as s, SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS as t, listSessionMembershipKeys as u, resolveSessionGoalDisplayState as v, updateSessionGoalObjective as y };
