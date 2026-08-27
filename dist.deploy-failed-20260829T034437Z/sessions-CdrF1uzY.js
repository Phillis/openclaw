import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { p as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { c as parseAgentSessionKey, f as parseThreadSessionSuffix, p as requiresFoldedSessionKeyAliasProof, u as parseRawSessionConversationRef } from "./session-key-utils-Di3FvABa.js";
import "./artifacts-FzMa6c2e.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { i as normalizeChatChannelId } from "./ids-Cgp0iV_A.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import "./registry-DbgR8dhg.js";
import "./main-session-CPkeRwvL.js";
import { n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { g as openOpenClawAgentDatabase, y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CM8nAOgX.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-CRlF3oxo.js";
import { m as patchSessionEntryCore, p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-CL5HFEAI.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-azPdmUls.js";
import "./session-lifecycle-admission-1qqb7Ac0.js";
import "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { a as normalizeStoreSessionKey, i as isConfirmedLowercasedLegacyAlias, n as foldedSessionKeyAliasCandidates, r as hasMismatchedCaseSensitiveDeliveryProof } from "./store-entry-CwpzgKGD.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CVc2mOCy.js";
import { c as resolveSqliteScope, m as toDatabaseOptions } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import { d as collectActiveSessionWorkAdmissionKeys, o as resolveFreshSessionTotalTokens } from "./types-BEJRKmOU.js";
import { p as pruneStaleEntries } from "./disk-budget-DJbD0obL.js";
import { It as listSessionEntriesCore, Lt as openSessionEntryReadView, kt as applySessionEntryLifecycleMutation } from "./session-accessor-B-FKZX9M.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-Bo3OPXck.js";
import "./combined-store-gateway-DCSDDfZL.js";
import { d as recordSessionGoalChanged } from "./session-state-events-BkuyPMaw.js";
import "./main-session.runtime.js";
import { n as SessionWorkStartInvalidatedError } from "./lifecycle-DzPMUp4j.js";
import { i as resolveLoadedSessionThreadInfo } from "./reset-ClywUmJm.js";
import "./session-key-DoXtATwZ.js";
import "./transcript-DIvtCZB2.js";
import { a as tryLoadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-brsAGrxF.js";
import "./cleanup-service-A4G1gsQQ.js";
import fs from "node:fs";
import crypto, { randomUUID } from "node:crypto";
//#region src/utils/token-format.ts
/** Formats a token count for compact human-facing status text. */
function formatTokenCount(value) {
	if (value === void 0 || !Number.isFinite(value)) return "0";
	const safe = Math.max(0, value);
	if (safe >= 1e6) return `${(safe / 1e6).toFixed(1)}m`;
	if (safe >= 1e3) {
		const precision = safe >= 1e4 ? 0 : 1;
		const formattedThousands = (safe / 1e3).toFixed(precision);
		if (Number(formattedThousands) >= 1e3) return `${(safe / 1e6).toFixed(1)}m`;
		return `${formattedThousands}k`;
	}
	return String(Math.round(safe));
}
//#endregion
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
function readSessionMembers(scope, fallback, operation) {
	const result = withOpenClawAgentDatabaseReadOnly(operation, resolveDatabaseOptions$1(scope), { throwOnMissingTable: true });
	return result.found ? result.value : fallback;
}
function listSessionMembers(scope) {
	return readSessionMembers(scope, [], (database) => {
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
	});
}
function listSessionMembershipKeys(scope, sessionKeys, identityId) {
	const normalizedIdentityId = identityId.trim();
	const normalizedSessionKeys = [...new Set(sessionKeys.map((key) => key.trim()).filter(Boolean))];
	if (!normalizedIdentityId || normalizedSessionKeys.length === 0) return /* @__PURE__ */ new Set();
	return readSessionMembers(scope, /* @__PURE__ */ new Set(), (database) => {
		const db = getSessionMemberKysely(database);
		const memberships = /* @__PURE__ */ new Set();
		for (let offset = 0; offset < normalizedSessionKeys.length; offset += SESSION_MEMBERSHIP_QUERY_CHUNK_SIZE) {
			const chunk = normalizedSessionKeys.slice(offset, offset + SESSION_MEMBERSHIP_QUERY_CHUNK_SIZE);
			const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_members").select("session_key").where("identity_id", "=", normalizedIdentityId).where("session_key", "in", chunk)).rows;
			for (const row of rows) memberships.add(row.session_key);
		}
		return memberships;
	});
}
function isSessionMember(scope, identityId) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return false;
	return readSessionMembers(scope, false, (database) => {
		const db = getSessionMemberKysely(database);
		return Boolean(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_members").select("identity_id").where("session_key", "=", resolveSqliteScope(scope).sessionKey).where("identity_id", "=", normalizedIdentityId)));
	});
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
//#region src/config/sessions/delivery-info.ts
function hasRoutableDeliveryContext(context) {
	return Boolean(context?.channel && context?.to);
}
/**
* Extracts the routable delivery context and thread id for a persisted session key.
*
* Thread/topic keys first try their exact store entry, then fall back to the base session when
* the thread entry has no delivery route of its own.
*/
function extractDeliveryInfo(sessionKey, options) {
	const { baseSessionKey, threadId } = parseSessionThreadInfo(sessionKey);
	if (!sessionKey || !baseSessionKey) return {
		deliveryContext: void 0,
		threadId
	};
	let deliveryContext;
	try {
		const lookup = loadDeliverySessionEntry({
			cfg: options?.cfg ?? getRuntimeConfig(),
			sessionKey,
			baseSessionKey
		});
		let entry = lookup.entry;
		let storedDeliveryContext = deliveryContextFromSession(entry);
		if (!hasRoutableDeliveryContext(storedDeliveryContext) && baseSessionKey !== sessionKey) {
			entry = lookup.baseEntry;
			storedDeliveryContext = deliveryContextFromSession(entry);
		}
		if (hasRoutableDeliveryContext(storedDeliveryContext)) deliveryContext = {
			channel: storedDeliveryContext.channel,
			to: storedDeliveryContext.to,
			accountId: storedDeliveryContext.accountId,
			threadId: storedDeliveryContext.threadId
		};
	} catch {}
	return {
		deliveryContext,
		threadId
	};
}
function resolveDeliveryStorePaths(cfg, agentId) {
	const paths = /* @__PURE__ */ new Set();
	paths.add(resolveSessionStorePathCore(cfg.session?.store, { agentId }));
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg)) if (target.agentId === agentId) paths.add(target.storePath);
	return [...paths];
}
function findSessionEntryInStore(store, keys) {
	let normalizedIndex;
	let bestEntry;
	let bestUpdatedAt = 0;
	let bestRoutable = false;
	let bestExact = false;
	const acceptCandidate = (entry, isExact = false) => {
		if (!entry) return;
		const candidateRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(entry));
		const candidateUpdatedAt = entry.updatedAt ?? 0;
		if (!bestEntry || candidateRoutable && !bestRoutable || candidateRoutable === bestRoutable && isExact && !bestExact || candidateRoutable === bestRoutable && isExact === bestExact && candidateUpdatedAt > bestUpdatedAt) {
			bestEntry = entry;
			bestUpdatedAt = candidateUpdatedAt;
			bestRoutable = candidateRoutable;
			bestExact = isExact;
		}
	};
	for (const key of keys) {
		const trimmed = key.trim();
		const normalized = normalizeStoreSessionKey(key);
		const foldedLegacyKeys = foldedSessionKeyAliasCandidates(normalized);
		const exactKeyWins = requiresFoldedSessionKeyAliasProof(normalized);
		let foundRoutableCandidate = false;
		const exactEntry = store.get(normalized);
		if (exactEntry && !hasMismatchedCaseSensitiveDeliveryProof(exactEntry, normalized)) {
			foundRoutableCandidate ||= hasRoutableDeliveryContext(deliveryContextFromSession(exactEntry));
			acceptCandidate(exactEntry, exactKeyWins);
		}
		for (const foldedLegacyKey of foldedLegacyKeys) {
			const foldedLegacyEntry = store.get(foldedLegacyKey);
			if (!foldedLegacyEntry || !isConfirmedLowercasedLegacyAlias(foldedLegacyEntry, normalized)) continue;
			foundRoutableCandidate ||= hasRoutableDeliveryContext(deliveryContextFromSession(foldedLegacyEntry));
			acceptCandidate(foldedLegacyEntry);
		}
		const trimmedEntry = trimmed !== normalized ? store.get(trimmed) : void 0;
		if (trimmedEntry && !hasMismatchedCaseSensitiveDeliveryProof(trimmedEntry, normalized)) {
			foundRoutableCandidate ||= hasRoutableDeliveryContext(deliveryContextFromSession(trimmedEntry));
			acceptCandidate(trimmedEntry);
		}
		if (trimmed !== normalized || !foundRoutableCandidate) {
			normalizedIndex ??= buildFreshestSessionEntryIndex(store);
			const freshest = normalizedIndex.get(normalized);
			if (!hasMismatchedCaseSensitiveDeliveryProof(freshest, normalized)) acceptCandidate(freshest);
			for (const foldedLegacyKey of foldedLegacyKeys) {
				const foldedFreshest = normalizedIndex.get(foldedLegacyKey);
				if (isConfirmedLowercasedLegacyAlias(foldedFreshest, normalized)) acceptCandidate(foldedFreshest);
			}
		}
	}
	return bestEntry;
}
function buildFreshestSessionEntryIndex(store) {
	const index = /* @__PURE__ */ new Map();
	for (const { sessionKey: key, entry } of store.entries()) {
		if (!entry) continue;
		const normalized = normalizeStoreSessionKey(key);
		const existing = index.get(normalized);
		const entryRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(entry));
		const existingRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(existing));
		if (!existing || entryRoutable && !existingRoutable || entryRoutable === existingRoutable && (entry.updatedAt ?? 0) > (existing.updatedAt ?? 0)) index.set(normalized, entry);
		const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalized);
		if (foldedLegacyKey === normalized || requiresFoldedSessionKeyAliasProof(normalized)) continue;
		const foldedExisting = index.get(foldedLegacyKey);
		const foldedExistingRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(foldedExisting));
		if (!foldedExisting || entryRoutable && !foldedExistingRoutable || entryRoutable === foldedExistingRoutable && (entry.updatedAt ?? 0) > (foldedExisting.updatedAt ?? 0)) index.set(foldedLegacyKey, entry);
	}
	return index;
}
function loadDeliverySessionEntry(params) {
	const canonicalKey = resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	});
	const canonicalBaseKey = resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: params.baseSessionKey
	});
	const agentId = resolveSessionStoreAgentId(params.cfg, canonicalKey);
	const sessionKeys = [params.sessionKey, canonicalKey];
	const baseKeys = [params.baseSessionKey, canonicalBaseKey];
	let fallback;
	for (const storePath of resolveDeliveryStorePaths(params.cfg, agentId)) {
		const store = openSessionEntryReadView({ storePath });
		const entry = findSessionEntryInStore(store, sessionKeys);
		const baseEntry = findSessionEntryInStore(store, baseKeys);
		if (!entry && !baseEntry) continue;
		fallback ??= {
			entry,
			baseEntry
		};
		if (hasRoutableDeliveryContext(deliveryContextFromSession(entry)) || hasRoutableDeliveryContext(deliveryContextFromSession(baseEntry))) return {
			entry,
			baseEntry
		};
	}
	return fallback ?? {
		entry: void 0,
		baseEntry: void 0
	};
}
//#endregion
export { getSessionGoal as C, formatTokenCount as D, updateSessionGoalStatus as E, formatSessionGoalStatus as S, updateSessionGoalObjective as T, removeSessionMember as _, resolveSessionConversationRef as a, clearSessionGoal as b, addSessionSuggestion as c, listSessionSuggestions as d, releaseSessionSuggestionDispatch as f, listSessionMembershipKeys as g, listSessionMembers as h, resolveSessionConversation as i, claimSessionSuggestionDispatch as l, isSessionMember as m, parseSessionThreadInfo as n, resolveSessionParentSessionKey as o, addSessionMember as p, parseSessionThreadInfoFast as r, SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS as s, extractDeliveryInfo as t, finalizeSessionSuggestionClaim as u, runSessionRegistryMaintenanceForStore as v, resolveSessionGoalDisplayState as w, createSessionGoal as x, MODEL_UPDATABLE_SESSION_GOAL_STATUSES as y };
