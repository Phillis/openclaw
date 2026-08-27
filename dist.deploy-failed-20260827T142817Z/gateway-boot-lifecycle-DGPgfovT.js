import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { i as formatLegacyAgentMediaMigrationRequiredMessage, t as GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON } from "./openclaw-agent-db-migration-required-RkIFq1cn.js";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-boot-lifecycle.ts
const GATEWAY_BOOT_LOOP_UNCLEAN_THRESHOLD = 3;
const GATEWAY_BOOT_LOOP_WINDOW_MS = 5 * 6e4;
const GATEWAY_BOOT_LIFECYCLE_RETENTION_MS = 1440 * 6e4;
const GATEWAY_CRASH_LOOP_BREAKER_REASON = "gateway.crash_loop_breaker";
const GATEWAY_CRASH_LOOP_RECOVERED_REASON = "gateway.crash_loop_recovered";
/**
* The breaker only self-clears after the full window drains. Operator surfaces name the manual
* override command, not the internal RPC. Account hints carry accountId to avoid starting a
* different default account than the warning named.
*/
function formatGatewayCrashLoopManualChannelStartHint(target) {
	return `Start a channel manually with: openclaw gateway call channels.start --params '${target ? JSON.stringify({
		channel: target.channelId,
		...target.accountId ? { accountId: target.accountId } : {}
	}) : `{"channel":"<id>"}`}'`;
}
const gatewayLifecycleLog = createSubsystemLogger("gateway/lifecycle");
function buildGatewayCrashLoopBreakerDecision(params) {
	const windowMs = params.windowMs ?? GATEWAY_BOOT_LOOP_WINDOW_MS;
	const tripped = params.uncleanBoots >= GATEWAY_BOOT_LOOP_UNCLEAN_THRESHOLD;
	const hasUnrecoveredBreakerMarker = typeof params.latestBreakerStartedAtMs === "number" && (typeof params.latestRecoveryStartedAtMs !== "number" || params.latestRecoveryStartedAtMs < params.latestBreakerStartedAtMs);
	return {
		tripped,
		uncleanBoots: params.uncleanBoots,
		windowMs,
		shouldWriteStabilityBundle: tripped && !hasUnrecoveredBreakerMarker,
		recovered: !tripped && hasUnrecoveredBreakerMarker
	};
}
function inspectGatewayCrashLoopBreaker(env = process.env, nowMs = Date.now()) {
	try {
		const { db } = openOpenClawStateDatabase({ env });
		const kysely = getNodeSqliteKysely(db);
		const windowStartMs = nowMs - GATEWAY_BOOT_LOOP_WINDOW_MS;
		const uncleanRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select((eb) => eb.fn.countAll().as("count")).where((eb) => eb.or([eb.and([eb("completed_at_ms", "is", null), eb("started_at_ms", ">=", windowStartMs)]), eb.and([eb("outcome", "=", "startup_failed"), eb("completed_at_ms", ">=", windowStartMs)])])));
		const latestBreaker = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select("started_at_ms as startedAtMs").where("startup_reason", "=", GATEWAY_CRASH_LOOP_BREAKER_REASON).orderBy("started_at_ms", "desc").limit(1));
		const latestRecovery = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("gateway_boot_lifecycle").select("started_at_ms as startedAtMs").where("startup_reason", "=", GATEWAY_CRASH_LOOP_RECOVERED_REASON).orderBy("started_at_ms", "desc").limit(1));
		return buildGatewayCrashLoopBreakerDecision({
			uncleanBoots: uncleanRow?.count ?? 0,
			latestBreakerStartedAtMs: latestBreaker?.startedAtMs,
			latestRecoveryStartedAtMs: latestRecovery?.startedAtMs
		});
	} catch (err) {
		gatewayLifecycleLog.warn(`crash-loop breaker state unavailable; fail-open: ${String(err)}`);
		return buildGatewayCrashLoopBreakerDecision({ uncleanBoots: 0 });
	}
}
function recordGatewayBootStart(env = process.env, nowMs = Date.now(), reason) {
	const bootId = randomUUID();
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, kysely.deleteFrom("gateway_boot_lifecycle").where("started_at_ms", "<", nowMs - GATEWAY_BOOT_LIFECYCLE_RETENTION_MS));
			executeSqliteQuerySync(db, kysely.insertInto("gateway_boot_lifecycle").values({
				boot_id: bootId,
				pid: process.pid,
				started_at_ms: nowMs,
				completed_at_ms: null,
				outcome: null,
				startup_reason: reason ?? null,
				reason: null
			}));
		}, { env });
		return bootId;
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to persist gateway boot start; fail-open: ${String(err)}`);
		return;
	}
}
/**
* Split a stable safe-mode lifetime before channel autostart resumes. A fresh
* open row makes a process death during recovered channel startup count toward
* the next breaker decision instead of aging out with the original boot.
*/
function recordGatewayCrashLoopRecovery(bootId, env = process.env, nowMs = Date.now()) {
	const recoveredBootId = randomUUID();
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			if (bootId) executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({
				completed_at_ms: nowMs,
				outcome: "safe_mode_stable",
				reason: null
			}).where("boot_id", "=", bootId));
			executeSqliteQuerySync(db, kysely.insertInto("gateway_boot_lifecycle").values({
				boot_id: recoveredBootId,
				pid: process.pid,
				started_at_ms: nowMs,
				completed_at_ms: null,
				outcome: null,
				startup_reason: GATEWAY_CRASH_LOOP_RECOVERED_REASON,
				reason: null
			}));
		}, { env });
		return recoveredBootId;
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to persist gateway crash-loop recovery; fail-safe: ${String(err)}`);
		return;
	}
}
function completeGatewayBootLifecycle(bootId, completion, env = process.env, nowMs = Date.now()) {
	if (!bootId) return;
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("gateway_boot_lifecycle").set({
				completed_at_ms: nowMs,
				outcome: completion.outcome,
				...completion.startupReason ? { startup_reason: completion.startupReason } : {},
				reason: completion.reason ?? null
			}).where("boot_id", "=", bootId));
		}, { env });
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to persist gateway boot outcome; fail-open: ${String(err)}`);
	}
}
function repairGatewayAgentMediaMigrationStartupFailures(params) {
	if (params.databasePaths.length === 0) return 0;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getNodeSqliteKysely(db);
			const legacyMessages = [...new Set(params.databasePaths.flatMap((pathname) => Array.from({ length: 17 }, (_, schemaVersion) => {
				const message = formatLegacyAgentMediaMigrationRequiredMessage(pathname, schemaVersion);
				return [message, truncateUtf16Safe(message, 500)];
			}).flat()))];
			const result = executeSqliteQuerySync(db, kysely.updateTable("gateway_boot_lifecycle").set({ outcome: "startup_failure_repaired" }).where("outcome", "=", "startup_failed").where((eb) => eb.or([eb("startup_reason", "=", GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON), eb("reason", "in", legacyMessages)])));
			return Number(result.numAffectedRows ?? 0);
		}, { env: params.env ?? process.env });
	} catch (err) {
		gatewayLifecycleLog.warn(`failed to repair media-migration startup history; fail-open: ${String(err)}`);
		return 0;
	}
}
//#endregion
export { inspectGatewayCrashLoopBreaker as a, repairGatewayAgentMediaMigrationStartupFailures as c, formatGatewayCrashLoopManualChannelStartHint as i, GATEWAY_CRASH_LOOP_RECOVERED_REASON as n, recordGatewayBootStart as o, completeGatewayBootLifecycle as r, recordGatewayCrashLoopRecovery as s, GATEWAY_CRASH_LOOP_BREAKER_REASON as t };
