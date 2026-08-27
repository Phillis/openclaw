import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { Nn as getNodeSqliteKysely, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { h as clearNodeSqliteKyselyCacheForDatabase, t as openNodeSqliteDatabase, u as runSqliteImmediateTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Fn as validateProgressCardGetParams, In as validateProgressCardPutParams } from "./src-4dv5TpeQ.js";
import { r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { g as openOpenClawAgentDatabase, y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-BEQsKM0c.js";
import { y as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C-yaBHT4.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { n as normalizeProgressCardInput, t as ProgressCardInputError } from "./progress-card-input-CkXG__j_.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { n as resolveGatewaySessionDatabase } from "./board-store-BK3Pp_I8.js";
import { p as sessionObserverScopeKey } from "./session-observer-model-CHUEX8KS.js";
import fs from "node:fs";
//#region src/session-cards/progress-card-store.ts
function withProgressCardDatabase(input, readOnly, operation) {
	if (typeof input !== "string") return operation(input, "openclaw-agent.sqlite");
	const db = openNodeSqliteDatabase(input, { readOnly });
	try {
		if (!readOnly) db.exec("PRAGMA foreign_keys = ON;");
		return operation(db, input);
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
function progressCardTablePresent(db) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'session_progress_cards'").get());
}
function selectProgressCard(db, sessionKey) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("session_progress_cards").select([
		"session_key",
		"markdown",
		"steps_json",
		"revision",
		"created_at",
		"updated_at"
	]).where("session_key", "=", sessionKey).limit(1)).rows[0] ?? null;
}
function rowToProgressCard(row) {
	const steps = row.steps_json ? readStoredSteps(row.steps_json) : void 0;
	if (!row.markdown && !steps?.length) return null;
	return {
		sessionKey: row.session_key,
		revision: row.revision,
		updatedAt: row.updated_at,
		...row.markdown ? { markdown: row.markdown } : {},
		...steps && steps.length > 0 ? { steps } : {}
	};
}
function readStoredSteps(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed)) throw new Error("stored progress-card steps are not an array");
	return parsed.map((entry, index) => {
		const record = asOptionalObjectRecord(entry);
		if (!record) throw new Error(`stored progress-card step ${index} is invalid`);
		const { step, status } = record;
		if (typeof step !== "string" || status !== "pending" && status !== "in_progress" && status !== "completed") throw new Error(`stored progress-card step ${index} is invalid`);
		return {
			step,
			status
		};
	});
}
function readSessionProgressCard(dbPathOrDb, sessionKey) {
	if (typeof dbPathOrDb === "string" && !fs.existsSync(dbPathOrDb)) return null;
	return withProgressCardDatabase(dbPathOrDb, true, (db) => {
		if (!progressCardTablePresent(db)) return null;
		const row = selectProgressCard(db, sessionKey);
		return row ? rowToProgressCard(row) : null;
	});
}
function writeSessionProgressCard(dbPathOrDb, sessionKey, input) {
	return withProgressCardDatabase(dbPathOrDb, false, (db, label) => {
		const write = () => {
			ensureOpenClawAgentProgressCardSchemaInTransaction(db);
			const kysely = getNodeSqliteKysely(db);
			const markdown = input.markdown?.trim() ? input.markdown : void 0;
			const steps = input.steps && input.steps.length > 0 ? input.steps : void 0;
			if (!markdown && !steps) {
				const previous = selectProgressCard(db, sessionKey);
				if (input.expectedRevision !== void 0) {
					const current = previous ? rowToProgressCard(previous) : null;
					if (!previous || previous.revision !== input.expectedRevision || !current?.steps?.length || current.steps.some((step) => step.status !== "completed")) return { card: current };
				}
				if (previous) executeSqliteQuerySync(db, kysely.updateTable("session_progress_cards").set({
					markdown: null,
					steps_json: null,
					revision: previous.revision + 1,
					updated_at: Date.now()
				}).where("session_key", "=", sessionKey));
				return { cleared: true };
			}
			const previous = selectProgressCard(db, sessionKey);
			const now = Date.now();
			const revision = (previous?.revision ?? 0) + 1;
			const stepsJson = steps ? JSON.stringify(steps) : null;
			executeSqliteQuerySync(db, kysely.insertInto("session_progress_cards").values({
				session_key: sessionKey,
				markdown: markdown ?? null,
				steps_json: stepsJson,
				revision,
				created_at: previous?.created_at ?? now,
				updated_at: now
			}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
				markdown: markdown ?? null,
				steps_json: stepsJson,
				revision,
				updated_at: now
			})));
			return { card: {
				sessionKey,
				revision,
				updatedAt: now,
				...markdown ? { markdown } : {},
				...steps ? { steps } : {}
			} };
		};
		return db.isTransaction ? write() : runSqliteImmediateTransactionSync(db, write, {
			databaseLabel: label,
			operationLabel: "progress-card.write"
		});
	});
}
//#endregion
//#region src/gateway/progress-card-store.ts
const progressCardStore = {
	get(sessionKey) {
		const resolved = resolveGatewaySessionDatabase(sessionKey);
		const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionProgressCard(database.db, resolved.sessionKey), {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {}
		});
		return result.found ? result.value : null;
	},
	put(sessionKey, input) {
		const resolved = resolveGatewaySessionDatabase(sessionKey);
		const database = openOpenClawAgentDatabase({
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {}
		});
		const result = runOpenClawAgentWriteTransaction((transactionDatabase) => writeSessionProgressCard(transactionDatabase.db, resolved.sessionKey, input), {
			agentId: resolved.agentId,
			path: database.path
		}, { operationLabel: "progress-card.put" });
		return "card" in result ? result : { card: null };
	}
};
//#endregion
//#region src/gateway/server-methods/progress-card.ts
function resolveProgressCardSessionKey(sessionKey, context, respond) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, sessionKey, void 0);
	if (!requested.ok) {
		respond(false, void 0, requested.error);
		return;
	}
	return sessionObserverScopeKey(resolveSessionStoreKey({
		cfg,
		sessionKey,
		storeAgentId: requested.agentId
	}), requested.agentId);
}
function createProgressCardHandlers(store = progressCardStore) {
	return {
		"progressCard.get": ({ params, respond, context }) => {
			if (!assertValidParams(params, validateProgressCardGetParams, "progressCard.get", respond)) return;
			const sessionKey = resolveProgressCardSessionKey(params.sessionKey, context, respond);
			if (!sessionKey) return;
			try {
				respond(true, { card: store.get(sessionKey) }, void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"progressCard.put": ({ params, respond, context }) => {
			if (!assertValidParams(params, validateProgressCardPutParams, "progressCard.put", respond)) return;
			let input;
			try {
				input = normalizeProgressCardInput({
					markdown: params.markdown,
					plan: params.plan
				});
			} catch (error) {
				if (!(error instanceof ProgressCardInputError)) throw error;
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			if (params.expectedRevision !== void 0 && (input.markdown || input.steps?.length)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "expectedRevision is only valid when clearing a card"));
				return;
			}
			const sessionKey = resolveProgressCardSessionKey(params.sessionKey, context, respond);
			if (!sessionKey) return;
			try {
				const result = store.put(sessionKey, {
					...input,
					expectedRevision: params.expectedRevision
				});
				if (params.expectedRevision === void 0 || result.card === null) context.broadcast("progressCard.changed", {
					sessionKey,
					revision: result.card?.revision ?? null
				});
				respond(true, result, void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		}
	};
}
const progressCardHandlers = createProgressCardHandlers();
//#endregion
export { progressCardHandlers };
