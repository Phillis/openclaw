import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { d as asPositiveSafeInteger } from "./number-coercion-oCkfUEEq.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
//#region src/infra/restart-intent.ts
const GATEWAY_RESTART_INTENT_KEY = "gateway-restart";
const GATEWAY_RESTART_INTENT_TTL_MS = 6e4;
const restartLog = createSubsystemLogger("restart");
function normalizeRestartIntentPid(pid) {
	return asPositiveSafeInteger(pid) ?? null;
}
function normalizeRestartIntentReason(reason) {
	const normalized = reason?.trim();
	return normalized ? truncateUtf16Safe(normalized, 200) : void 0;
}
function writeGatewayRestartIntentSync(opts) {
	const targetPid = normalizeRestartIntentPid(opts.targetPid);
	if (targetPid === null) return false;
	const env = opts.env ?? process.env;
	try {
		const reason = normalizeRestartIntentReason(opts.reason ?? opts.intent?.reason);
		const waitMs = typeof opts.intent?.waitMs === "number" && Number.isFinite(opts.intent.waitMs) && opts.intent.waitMs >= 0 ? Math.floor(opts.intent.waitMs) : null;
		const createdAt = Date.now();
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("gateway_restart_intent").values({
				intent_key: GATEWAY_RESTART_INTENT_KEY,
				kind: "gateway-restart",
				pid: targetPid,
				created_at: createdAt,
				reason: reason ?? null,
				force: opts.intent?.force ? 1 : null,
				wait_ms: waitMs,
				updated_at_ms: createdAt
			}).onConflict((conflict) => conflict.column("intent_key").doUpdateSet({
				kind: (eb) => eb.ref("excluded.kind"),
				pid: (eb) => eb.ref("excluded.pid"),
				created_at: (eb) => eb.ref("excluded.created_at"),
				reason: (eb) => eb.ref("excluded.reason"),
				force: (eb) => eb.ref("excluded.force"),
				wait_ms: (eb) => eb.ref("excluded.wait_ms"),
				updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms")
			})));
		}, { env });
		return true;
	} catch (err) {
		restartLog.warn(`failed to write gateway restart intent: ${String(err)}`);
		return false;
	}
}
function clearGatewayRestartIntentSync(env = process.env) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("gateway_restart_intent").where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY));
		}, { env });
	} catch {}
}
function readGatewayRestartIntentPayloadSync(env) {
	try {
		const { db } = openOpenClawStateDatabase({ env });
		const parsed = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_restart_intent").select([
			"kind",
			"pid",
			"created_at",
			"reason",
			"force",
			"wait_ms"
		]).where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY));
		if (parsed?.kind === "gateway-restart" && typeof parsed.pid === "number" && Number.isFinite(parsed.pid) && typeof parsed.created_at === "number" && Number.isFinite(parsed.created_at) && (parsed.reason === null || typeof parsed.reason === "string") && (parsed.force === null || typeof parsed.force === "number" && Number.isFinite(parsed.force)) && (parsed.wait_ms === null || typeof parsed.wait_ms === "number" && Number.isFinite(parsed.wait_ms) && parsed.wait_ms >= 0)) {
			const reason = normalizeRestartIntentReason(parsed.reason ?? void 0);
			return {
				kind: "gateway-restart",
				pid: parsed.pid,
				createdAt: parsed.created_at,
				...reason ? { reason } : {},
				...parsed.force ? { force: true } : {},
				...typeof parsed.wait_ms === "number" ? { waitMs: Math.floor(parsed.wait_ms) } : {}
			};
		}
	} catch {
		return null;
	}
	return null;
}
function consumeGatewayRestartIntentPayloadSync(env = process.env, now = Date.now()) {
	const payload = readGatewayRestartIntentPayloadSync(env);
	clearGatewayRestartIntentSync(env);
	if (!payload) return null;
	if (payload.pid !== process.pid) return null;
	const ageMs = now - payload.createdAt;
	if (ageMs < 0 || ageMs > GATEWAY_RESTART_INTENT_TTL_MS) return null;
	return {
		...payload.reason ? { reason: payload.reason } : {},
		...payload.force ? { force: true } : {},
		...typeof payload.waitMs === "number" ? { waitMs: payload.waitMs } : {}
	};
}
function consumeGatewayRestartIntentSync(env = process.env, now = Date.now()) {
	return consumeGatewayRestartIntentPayloadSync(env, now) !== null;
}
//#endregion
export { writeGatewayRestartIntentSync as a, normalizeRestartIntentReason as i, consumeGatewayRestartIntentPayloadSync as n, consumeGatewayRestartIntentSync as r, clearGatewayRestartIntentSync as t };
