import { f as asSafeIntegerInRange } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { c as serializePluginInstallRecordMap, i as getPluginInstallRecordMapEntry, l as setPluginInstallRecordMapEntry, n as copyPluginInstallRecordMap, r as createPluginInstallRecordMap, s as parsePluginInstallRecordMap } from "./plugin-install-record-map-CWFLMnp7.js";
import "./installed-plugin-index-uuE4SyLf.js";
import { a as inspectPersistedInstalledPluginIndexInstallRecordsSync, c as resolveLegacyInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-CDDyVBh4.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { U as deliveryQueueMetadata, V as projectDeliveryQueueTerminalEntry, h as runOpenClawStateWriteTransaction, z as inferDeliveryQueueFailureRetention } from "./openclaw-state-db-BciZ4rHE.js";
import { i as readPersistedInstalledPluginIndexSync, n as parseInstalledPluginIndex, u as writePersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-DCxz0axS.js";
import { _ as resolveMaxPluginStateEntriesPerPlugin, a as registerMigratedPluginStateEntry, m as countPluginStateLiveEntries, n as createPluginStateKeyedStore } from "./plugin-state-store-CzLOWNPC.js";
import { o as safeReadDir, r as migrationFileExists, t as ensureMigrationDir } from "./state-migrations.fs-FfwaJiB8.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/state-migrations.task-sidecar-rows.ts
function normalizeLegacySqliteInteger(value) {
	if (typeof value === "bigint") return Number(value);
	return value;
}
function listSqliteColumns(db, table) {
	const rows = db.prepare(`PRAGMA table_info(${table})`).all();
	return new Set(rows.flatMap((row) => row.name ? [row.name] : []));
}
function pickLegacyColumn(columns, name, fallbackSql = "NULL") {
	return columns.has(name) ? name : `${fallbackSql} AS ${name}`;
}
function legacyBindValue(value) {
	if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "bigint" || value instanceof Uint8Array) return value ?? null;
	return JSON.stringify(value);
}
function legacyStringValue(value) {
	return typeof value === "string" ? value : "";
}
function normalizeLegacyTaskRow(row) {
	const runtime = legacyStringValue(row.runtime);
	const sourceId = typeof row.source_id === "string" ? row.source_id : "";
	const taskId = legacyStringValue(row.task_id);
	const ownerRaw = typeof row.owner_key === "string" ? row.owner_key.trim() : "";
	const requesterRaw = typeof row.requester_session_key === "string" ? row.requester_session_key.trim() : "";
	const ownerKey = ownerRaw || requesterRaw || `system:${runtime}:${sourceId || taskId}`;
	const scopeKind = (typeof row.scope_kind === "string" ? row.scope_kind : "") === "system" || ownerKey.startsWith("system:") ? "system" : "session";
	const childSessionKey = typeof row.child_session_key === "string" ? row.child_session_key.trim() : "";
	const persistedAgentId = typeof row.agent_id === "string" ? row.agent_id.trim() : "";
	const isSpawnRuntime = runtime === "subagent" || runtime === "acp";
	const childAgentId = isSpawnRuntime ? parseAgentSessionKey(childSessionKey)?.agentId : void 0;
	const requesterAgentId = (typeof row.requester_agent_id === "string" ? row.requester_agent_id.trim() : "") || (isSpawnRuntime ? parseAgentSessionKey(ownerKey)?.agentId ?? parseAgentSessionKey(requesterRaw)?.agentId ?? (childAgentId && persistedAgentId !== childAgentId ? persistedAgentId : "") : "");
	const executorAgentId = requesterAgentId ? childAgentId || persistedAgentId : persistedAgentId;
	const deliveryStatus = row.delivery_status === "not-requested" ? "not_applicable" : row.delivery_status;
	return {
		task_id: taskId,
		runtime,
		task_kind: legacyBindValue(row.task_kind),
		source_id: legacyBindValue(row.source_id),
		requester_session_key: scopeKind === "system" ? "" : requesterRaw || ownerKey,
		owner_key: ownerKey,
		scope_kind: scopeKind,
		child_session_key: childSessionKey || null,
		parent_flow_id: legacyBindValue(row.parent_flow_id),
		parent_task_id: legacyBindValue(row.parent_task_id),
		agent_id: executorAgentId || null,
		requester_agent_id: requesterAgentId || null,
		run_id: legacyBindValue(row.run_id),
		label: legacyBindValue(row.label),
		task: legacyBindValue(row.task ?? ""),
		status: legacyBindValue(row.status ?? ""),
		delivery_status: legacyBindValue(deliveryStatus ?? ""),
		notify_policy: legacyBindValue(row.notify_policy ?? ""),
		created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
		started_at: normalizeLegacySqliteInteger(row.started_at),
		ended_at: normalizeLegacySqliteInteger(row.ended_at),
		last_event_at: normalizeLegacySqliteInteger(row.last_event_at),
		cleanup_after: normalizeLegacySqliteInteger(row.cleanup_after),
		error: legacyBindValue(row.error),
		progress_summary: legacyBindValue(row.progress_summary),
		terminal_summary: legacyBindValue(row.terminal_summary),
		terminal_outcome: legacyBindValue(row.terminal_outcome),
		detail_json: legacyBindValue(row.detail_json)
	};
}
function readLegacyTaskRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		const columns = listSqliteColumns(db, "task_runs");
		if (columns.size === 0) return [];
		const selectColumns = [
			"task_id",
			"runtime",
			pickLegacyColumn(columns, "task_kind"),
			pickLegacyColumn(columns, "source_id"),
			pickLegacyColumn(columns, "requester_session_key"),
			pickLegacyColumn(columns, "owner_key"),
			pickLegacyColumn(columns, "scope_kind"),
			pickLegacyColumn(columns, "child_session_key"),
			pickLegacyColumn(columns, "parent_flow_id"),
			pickLegacyColumn(columns, "parent_task_id"),
			pickLegacyColumn(columns, "agent_id"),
			pickLegacyColumn(columns, "requester_agent_id"),
			pickLegacyColumn(columns, "run_id"),
			pickLegacyColumn(columns, "label"),
			"task",
			"status",
			"delivery_status",
			"notify_policy",
			"created_at",
			pickLegacyColumn(columns, "started_at"),
			pickLegacyColumn(columns, "ended_at"),
			pickLegacyColumn(columns, "last_event_at"),
			pickLegacyColumn(columns, "cleanup_after"),
			pickLegacyColumn(columns, "error"),
			pickLegacyColumn(columns, "progress_summary"),
			pickLegacyColumn(columns, "terminal_summary"),
			pickLegacyColumn(columns, "terminal_outcome"),
			pickLegacyColumn(columns, "detail_json")
		];
		return db.prepare(`SELECT ${selectColumns.join(", ")} FROM task_runs ORDER BY created_at ASC, task_id ASC`).all().map((row) => normalizeLegacyTaskRow(row));
	} finally {
		db.close();
	}
}
function readLegacyTaskDeliveryRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		if (listSqliteColumns(db, "task_delivery_state").size === 0) return [];
		return db.prepare(`SELECT task_id, requester_origin_json, last_notified_event_at FROM task_delivery_state ORDER BY task_id ASC`).all();
	} finally {
		db.close();
	}
}
function insertTaskRunRowSql(db, row) {
	db.prepare(`
      INSERT INTO task_runs (
        task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
        child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
        label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
        last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
        detail_json
      ) VALUES (
        @task_id, @runtime, @task_kind, @source_id, @requester_session_key, @owner_key,
        @scope_kind, @child_session_key, @parent_flow_id, @parent_task_id, @agent_id,
        @requester_agent_id, @run_id, @label, @task, @status, @delivery_status, @notify_policy,
        @created_at, @started_at, @ended_at, @last_event_at, @cleanup_after, @error,
        @progress_summary, @terminal_summary, @terminal_outcome, @detail_json
      )
    `).run(row);
}
function insertTaskDeliveryRowSql(db, row) {
	db.prepare(`
      INSERT INTO task_delivery_state (
        task_id, requester_origin_json, last_notified_event_at
      ) VALUES (
        @task_id, @requester_origin_json, @last_notified_event_at
      )
    `).run(row);
}
//#endregion
//#region src/infra/state-migrations.storage.ts
const PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES = [
	"",
	"-shm",
	"-wal",
	"-journal"
];
const TASK_STATE_SQLITE_SIDECAR_SUFFIXES = PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES;
const LEGACY_DELIVERY_QUEUE_DIRS = [{
	label: "outbound delivery queue",
	queueName: "outbound",
	dirName: "delivery-queue"
}, {
	label: "session delivery queue",
	queueName: "session",
	dirName: "session-delivery-queue"
}];
var LegacyTaskStateSidecarConflictError = class extends Error {
	constructor(conflictedKeys) {
		super("legacy task-state sidecar conflicts with shared state");
		this.conflictedKeys = conflictedKeys;
	}
};
function resolveLegacyPluginStateSidecarPath(stateDir) {
	return path.join(stateDir, "plugin-state", "state.sqlite");
}
function resolveLegacyTaskRunsSidecarPath(stateDir) {
	return path.join(stateDir, "tasks", "runs.sqlite");
}
function resolveLegacyFlowRunsSidecarPath(stateDir) {
	return path.join(stateDir, "flows", "registry.sqlite");
}
function readLegacyPluginStateSidecarRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		return db.prepare(`
          SELECT plugin_id, namespace, entry_key, value_json, created_at, expires_at
          FROM plugin_state_entries
          ORDER BY plugin_id ASC, namespace ASC, entry_key ASC
        `).all();
	} finally {
		db.close();
	}
}
function legacyPluginStateRowsMatch(existing, legacy) {
	return existing.value_json === legacy.value_json && normalizeLegacySqliteInteger(existing.created_at) === normalizeLegacySqliteInteger(legacy.created_at) && normalizeLegacySqliteInteger(existing.expires_at) === normalizeLegacySqliteInteger(legacy.expires_at);
}
function isLegacyPluginStateRowExpired(row, now) {
	const expiresAt = normalizeLegacySqliteInteger(row.expires_at);
	return expiresAt !== null && expiresAt <= now;
}
function hasPendingSqliteSidecarArchive(sourcePath, suffixes) {
	return !migrationFileExists(sourcePath) && migrationFileExists(`${sourcePath}.migrated`) && suffixes.some((suffix) => suffix !== "" && migrationFileExists(`${sourcePath}${suffix}`));
}
function firstFreeArchivePath(sourcePath) {
	for (let index = 2;; index++) {
		const candidate = `${sourcePath}.migrated.${index}`;
		if (!fs.existsSync(candidate)) return candidate;
	}
}
function archiveLegacyFileSource(params) {
	const archivedPath = `${params.sourcePath}.migrated`;
	try {
		if (migrationFileExists(archivedPath)) {
			if (fs.readFileSync(params.sourcePath).equals(fs.readFileSync(archivedPath))) {
				fs.rmSync(params.sourcePath, { force: true });
				return {
					sourcePath: params.sourcePath,
					targetPath: archivedPath,
					action: "removed"
				};
			}
			const nextArchivePath = firstFreeArchivePath(params.sourcePath);
			fs.renameSync(params.sourcePath, nextArchivePath);
			return {
				sourcePath: params.sourcePath,
				targetPath: nextArchivePath,
				action: "archived"
			};
		}
		fs.renameSync(params.sourcePath, archivedPath);
		return {
			sourcePath: params.sourcePath,
			targetPath: archivedPath,
			action: "archived"
		};
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label} ${params.sourcePath}: ${String(err)}`);
		return null;
	}
}
function recordArchiveCollisionResolutions(changes, label, resolutions) {
	for (const resolution of resolutions) changes.push(resolution.action === "removed" ? `Removed already-archived ${label} legacy source ${resolution.sourcePath}` : `Archived ${label} legacy source → ${resolution.targetPath}`);
}
function archiveLegacySqliteSidecar(params) {
	const existingSources = PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${params.sourcePath}${suffix}`).filter(migrationFileExists);
	if (existingSources.length === 0) return;
	const resolutions = [];
	for (const sourcePath of existingSources) {
		const resolution = archiveLegacyFileSource({
			sourcePath,
			label: `${params.label} sidecar`,
			warnings: params.warnings
		});
		if (!resolution) return;
		resolutions.push(resolution);
	}
	if (resolutions.every((resolution) => resolution.action === "archived" && resolution.targetPath === `${resolution.sourcePath}.migrated`)) params.changes.push(`Archived ${params.label} sidecar legacy source → ${params.sourcePath}.migrated`);
	else recordArchiveCollisionResolutions(params.changes, `${params.label} sidecar`, resolutions);
}
function archiveLegacyPluginStateSidecar(params) {
	archiveLegacySqliteSidecar({
		...params,
		label: "plugin-state"
	});
}
function readLegacyInstalledPluginIndex(sourcePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		const current = parseInstalledPluginIndex(parsed);
		if (current) return current;
		const topLevelInstallRecords = readLegacyTopLevelInstallRecords(parsed);
		const installRecords = topLevelInstallRecords === void 0 ? readLegacyEmbeddedInstallRecords(parsed) : topLevelInstallRecords;
		if (!installRecords) return null;
		return parseInstalledPluginIndex({
			version: 1,
			hostContractVersion: "legacy",
			compatRegistryVersion: "legacy",
			migrationVersion: 1,
			policyHash: "legacy",
			generatedAtMs: 0,
			installRecords,
			plugins: [],
			diagnostics: []
		});
	} catch {
		return null;
	}
}
function readLegacyTopLevelInstallRecords(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const legacy = parsed;
	const key = Object.hasOwn(legacy, "installRecords") ? "installRecords" : Object.hasOwn(legacy, "records") ? "records" : void 0;
	return key ? parsePluginInstallRecordMap(legacy[key]) : void 0;
}
function readLegacyEmbeddedInstallRecords(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const plugins = parsed.plugins;
	if (!Array.isArray(plugins)) return null;
	const records = createPluginInstallRecordMap();
	let found = false;
	for (const plugin of plugins) {
		if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) return null;
		if (!Object.hasOwn(plugin, "installRecord")) continue;
		const pluginId = plugin.pluginId;
		const installRecord = plugin.installRecord;
		if (typeof pluginId !== "string" || !pluginId.trim()) return null;
		setPluginInstallRecordMapEntry(records, pluginId, installRecord);
		found = true;
	}
	return found ? parsePluginInstallRecordMap(records) : null;
}
function legacyInstalledPluginIndexMatches(current, legacy) {
	return serializePluginInstallRecordMap(current.installRecords) === serializePluginInstallRecordMap(legacy.installRecords) && JSON.stringify(current.plugins) === JSON.stringify(legacy.plugins) && JSON.stringify(current.diagnostics) === JSON.stringify(legacy.diagnostics);
}
function readInstallRecordField(record, key) {
	return record[key];
}
function readInstallRecordStringField(record, key) {
	const value = readInstallRecordField(record, key);
	return typeof value === "string" ? value : void 0;
}
function legacyInstallRecordHasCurrentResolvedIdentity(params) {
	const { currentRecord, legacyRecord } = params;
	const currentResolvedSpec = readInstallRecordStringField(currentRecord, "resolvedSpec");
	const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
	if (legacySpec) return currentResolvedSpec === legacySpec;
	const legacyResolvedSpec = readInstallRecordStringField(legacyRecord, "resolvedSpec");
	return Boolean(legacyResolvedSpec && currentResolvedSpec === legacyResolvedSpec);
}
function readAuthoritativeCurrentNpmIdentity(record) {
	const resolvedName = readInstallRecordStringField(record, "resolvedName");
	const resolvedVersion = readInstallRecordStringField(record, "resolvedVersion");
	if (resolvedName && resolvedVersion) return {
		name: resolvedName,
		version: resolvedVersion
	};
	const resolvedSpec = readInstallRecordStringField(record, "resolvedSpec");
	const parsed = resolvedSpec ? parseRegistryNpmSpec(resolvedSpec) : null;
	if (parsed?.selectorKind === "exact-version" && parsed.selector) return {
		name: parsed.name,
		version: parsed.selector
	};
	return null;
}
function legacyNpmInstallRecordSupersededByCurrent(params) {
	const { currentRecord, legacyRecord } = params;
	if (currentRecord.source !== "npm" || legacyRecord.source !== "npm") return false;
	const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
	const legacyParsedSpec = legacySpec ? parseRegistryNpmSpec(legacySpec) : null;
	if (legacyParsedSpec?.selectorKind !== "exact-version") return false;
	const currentIdentity = readAuthoritativeCurrentNpmIdentity(currentRecord);
	return Boolean(currentIdentity && legacyParsedSpec.selector && currentIdentity.name === legacyParsedSpec.name && currentIdentity.version === legacyParsedSpec.selector);
}
function legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord) {
	if (currentRecord.source !== legacyRecord.source) return false;
	if (legacyNpmInstallRecordSupersededByCurrent({
		currentRecord,
		legacyRecord
	})) return true;
	for (const key of Object.keys(legacyRecord).toSorted()) {
		const currentValue = readInstallRecordField(currentRecord, key);
		if (currentValue === readInstallRecordField(legacyRecord, key)) continue;
		if (key === "spec" && legacyInstallRecordHasCurrentResolvedIdentity({
			currentRecord,
			legacyRecord
		})) continue;
		if ((key === "resolvedAt" || key === "installedAt") && typeof currentValue === "string") continue;
		return false;
	}
	return true;
}
function mergeLegacyInstalledPluginIndexRecords(current, legacy) {
	const installRecords = copyPluginInstallRecordMap(current.installRecords);
	const conflicts = [];
	let addedCount = 0;
	for (const [pluginId, legacyRecord] of Object.entries(legacy.installRecords)) {
		const currentRecord = getPluginInstallRecordMapEntry(installRecords, pluginId);
		if (!currentRecord) {
			setPluginInstallRecordMapEntry(installRecords, pluginId, legacyRecord);
			addedCount += 1;
			continue;
		}
		if (!legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord)) conflicts.push(pluginId);
	}
	return {
		merged: {
			...current,
			installRecords
		},
		addedCount,
		conflicts
	};
}
function archiveLegacyInstalledPluginIndex(params) {
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: "plugin install index",
		warnings: params.warnings
	});
	if (!resolution) return;
	params.changes.push(resolution.action === "removed" ? `Removed already-archived plugin install index legacy source ${params.sourcePath}` : `Archived plugin install index legacy source → ${resolution.targetPath}`);
}
function hardenLegacyImportSource(params) {
	try {
		fs.chmodSync(params.sourcePath, 384);
		return true;
	} catch (err) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(err)}`);
		return false;
	}
}
function archiveLegacyImportSource(params) {
	if (!hardenLegacyImportSource(params)) return;
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: `${params.label} legacy source`,
		warnings: params.warnings
	});
	if (!resolution) return;
	if (resolution.action === "archived") try {
		fs.chmodSync(resolution.targetPath, 384);
	} catch (err) {
		params.warnings.push(`Failed securing archived ${params.label} legacy source: ${String(err)}`);
	}
	params.changes.push(resolution.action === "removed" ? `Removed already-archived ${params.label} legacy source ${params.sourcePath}` : `Archived ${params.label} legacy source → ${resolution.targetPath}`);
}
function legacyKeyValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return `${value}`;
	return "";
}
function normalizeLegacyFlowRow(row) {
	const syncMode = row.sync_mode === "task_mirrored" || row.shape === "single_task" ? "task_mirrored" : "managed";
	const ownerKey = typeof row.owner_key === "string" && row.owner_key.trim() ? row.owner_key.trim() : typeof row.owner_session_key === "string" ? row.owner_session_key.trim() : "";
	const controllerId = syncMode === "managed" ? typeof row.controller_id === "string" && row.controller_id.trim() ? row.controller_id.trim() : "core/legacy-restored" : null;
	return {
		flow_id: legacyBindValue(row.flow_id ?? ""),
		shape: legacyBindValue(row.shape),
		sync_mode: syncMode,
		owner_key: ownerKey,
		requester_origin_json: legacyBindValue(row.requester_origin_json),
		controller_id: controllerId,
		revision: normalizeLegacySqliteInteger(row.revision) ?? 0,
		status: legacyBindValue(row.status ?? ""),
		notify_policy: legacyBindValue(row.notify_policy ?? ""),
		goal: legacyBindValue(row.goal ?? ""),
		current_step: legacyBindValue(row.current_step),
		blocked_task_id: legacyBindValue(row.blocked_task_id),
		blocked_summary: legacyBindValue(row.blocked_summary),
		state_json: legacyBindValue(row.state_json),
		wait_json: legacyBindValue(row.wait_json),
		cancel_requested_at: normalizeLegacySqliteInteger(row.cancel_requested_at),
		created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
		updated_at: normalizeLegacySqliteInteger(row.updated_at) ?? 0,
		ended_at: normalizeLegacySqliteInteger(row.ended_at)
	};
}
function legacyRowsMatch(existing, incoming, columns) {
	return columns.every((column) => normalizeLegacySqliteInteger(existing[column]) === normalizeLegacySqliteInteger(incoming[column]));
}
function readLegacyFlowRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		const columns = listSqliteColumns(db, "flow_runs");
		if (columns.size === 0) return [];
		const selectColumns = [
			"flow_id",
			pickLegacyColumn(columns, "shape"),
			pickLegacyColumn(columns, "sync_mode"),
			pickLegacyColumn(columns, "owner_key"),
			pickLegacyColumn(columns, "owner_session_key"),
			pickLegacyColumn(columns, "requester_origin_json"),
			pickLegacyColumn(columns, "controller_id"),
			pickLegacyColumn(columns, "revision", "0"),
			"status",
			"notify_policy",
			"goal",
			pickLegacyColumn(columns, "current_step"),
			pickLegacyColumn(columns, "blocked_task_id"),
			pickLegacyColumn(columns, "blocked_summary"),
			pickLegacyColumn(columns, "state_json"),
			pickLegacyColumn(columns, "wait_json"),
			pickLegacyColumn(columns, "cancel_requested_at"),
			"created_at",
			"updated_at",
			pickLegacyColumn(columns, "ended_at")
		];
		return db.prepare(`SELECT ${selectColumns.join(", ")} FROM flow_runs ORDER BY created_at ASC, flow_id ASC`).all().map((row) => normalizeLegacyFlowRow(row));
	} finally {
		db.close();
	}
}
function insertFlowRunRowSql(db, row) {
	db.prepare(`
      INSERT INTO flow_runs (
        flow_id, shape, sync_mode, owner_key, requester_origin_json, controller_id, revision,
        status, notify_policy, goal, current_step, blocked_task_id, blocked_summary, state_json,
        wait_json, cancel_requested_at, created_at, updated_at, ended_at
      ) VALUES (
        @flow_id, @shape, @sync_mode, @owner_key, @requester_origin_json, @controller_id,
        @revision, @status, @notify_policy, @goal, @current_step, @blocked_task_id,
        @blocked_summary, @state_json, @wait_json, @cancel_requested_at, @created_at,
        @updated_at, @ended_at
      )
    `).run(row);
}
async function migrateLegacyTaskRunsSidecar(params) {
	const sourcePath = resolveLegacyTaskRunsSidecarPath(params.stateDir);
	if (!migrationFileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacySqliteSidecar({
			sourcePath,
			label: "task registry",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let taskRows;
	let deliveryRows;
	try {
		taskRows = readLegacyTaskRows(sourcePath);
		deliveryRows = readLegacyTaskDeliveryRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading task registry sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflicts = [];
		let importedTasks = 0;
		let importedDeliveryStates = 0;
		let skippedOrphanDeliveryStates = 0;
		runOpenClawStateWriteTransaction(({ db }) => {
			const taskColumns = [
				"runtime",
				"task_kind",
				"source_id",
				"requester_session_key",
				"owner_key",
				"scope_kind",
				"child_session_key",
				"parent_flow_id",
				"parent_task_id",
				"agent_id",
				"requester_agent_id",
				"run_id",
				"label",
				"task",
				"status",
				"delivery_status",
				"notify_policy",
				"created_at",
				"started_at",
				"ended_at",
				"last_event_at",
				"cleanup_after",
				"error",
				"progress_summary",
				"terminal_summary",
				"terminal_outcome",
				"detail_json"
			];
			for (const row of taskRows) {
				const taskId = legacyKeyValue(expectDefined(row.task_id, "task migration row key"));
				const existing = db.prepare(`SELECT ${taskColumns.join(", ")} FROM task_runs WHERE task_id = ?`).get(taskId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, taskColumns)) conflicts.push(taskId);
					continue;
				}
				insertTaskRunRowSql(db, row);
				importedTasks++;
			}
			const deliveryColumns = ["requester_origin_json", "last_notified_event_at"];
			for (const row of deliveryRows) {
				const taskId = legacyKeyValue(expectDefined(row.task_id, "delivery migration row key"));
				const existing = db.prepare(`SELECT requester_origin_json, last_notified_event_at FROM task_delivery_state WHERE task_id = ?`).get(taskId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, deliveryColumns)) conflicts.push(`${taskId}/delivery`);
					continue;
				}
				if (!db.prepare("SELECT 1 FROM task_runs WHERE task_id = ?").get(taskId)) {
					skippedOrphanDeliveryStates++;
					continue;
				}
				insertTaskDeliveryRowSql(db, row);
				importedDeliveryStates++;
			}
			if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (importedTasks > 0) changes.push(`Migrated ${importedTasks} task registry sidecar ${importedTasks === 1 ? "row" : "rows"} → shared SQLite state`);
		if (importedDeliveryStates > 0) changes.push(`Migrated ${importedDeliveryStates} task delivery sidecar ${importedDeliveryStates === 1 ? "row" : "rows"} → shared SQLite state`);
		if (skippedOrphanDeliveryStates > 0) warnings.push(`Skipped ${skippedOrphanDeliveryStates} orphan task delivery sidecar ${skippedOrphanDeliveryStates === 1 ? "row" : "rows"} with no task run`);
	} catch (err) {
		if (err instanceof LegacyTaskStateSidecarConflictError) return {
			changes,
			warnings: [`Left task registry sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`]
		};
		return {
			changes,
			warnings: [`Failed migrating task registry sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacySqliteSidecar({
		sourcePath,
		label: "task registry",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyFlowRunsSidecar(params) {
	const sourcePath = resolveLegacyFlowRunsSidecarPath(params.stateDir);
	if (!migrationFileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacySqliteSidecar({
			sourcePath,
			label: "task flow",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let rows;
	try {
		rows = readLegacyFlowRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading task flow sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflicts = [];
		let imported = 0;
		runOpenClawStateWriteTransaction(({ db }) => {
			const columns = [
				"shape",
				"sync_mode",
				"owner_key",
				"requester_origin_json",
				"controller_id",
				"revision",
				"status",
				"notify_policy",
				"goal",
				"current_step",
				"blocked_task_id",
				"blocked_summary",
				"state_json",
				"wait_json",
				"cancel_requested_at",
				"created_at",
				"updated_at",
				"ended_at"
			];
			for (const row of rows) {
				const flowId = legacyKeyValue(expectDefined(row.flow_id, "flow migration row key"));
				const existing = db.prepare(`SELECT ${columns.join(", ")} FROM flow_runs WHERE flow_id = ?`).get(flowId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, columns)) conflicts.push(flowId);
					continue;
				}
				insertFlowRunRowSql(db, row);
				imported++;
			}
			if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (imported > 0) changes.push(`Migrated ${imported} task flow sidecar ${imported === 1 ? "row" : "rows"} → shared SQLite state`);
	} catch (err) {
		if (err instanceof LegacyTaskStateSidecarConflictError) return {
			changes,
			warnings: [`Left task flow sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`]
		};
		return {
			changes,
			warnings: [`Failed migrating task flow sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacySqliteSidecar({
		sourcePath,
		label: "task flow",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyTaskStateSidecars(params) {
	const taskRuns = await migrateLegacyTaskRunsSidecar(params);
	const flowRuns = await migrateLegacyFlowRunsSidecar(params);
	return {
		changes: [...taskRuns.changes, ...flowRuns.changes],
		warnings: [...taskRuns.warnings, ...flowRuns.warnings]
	};
}
function resolveLegacyDeliveryQueuePath(stateDir, dirName) {
	return path.join(stateDir, dirName);
}
function listLegacyDeliveryQueueFiles(queueDir) {
	const pending = safeReadDir(queueDir).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => ({
		sourcePath: path.join(queueDir, entry.name),
		status: "pending"
	}));
	const failedDir = path.join(queueDir, "failed");
	const failed = safeReadDir(failedDir).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => ({
		sourcePath: path.join(failedDir, entry.name),
		status: "failed"
	}));
	return [...pending, ...failed];
}
function listLegacyDeliveryQueueDeliveredMarkers(queueDir) {
	return safeReadDir(queueDir).filter((entry) => entry.isFile() && entry.name.endsWith(".delivered")).map((entry) => path.join(queueDir, entry.name));
}
function readLegacyDeliveryQueueEntry(sourcePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function buildLegacyDeliveryQueueRow(params) {
	const originalEnqueuedAt = asSafeIntegerInRange(params.entry.enqueuedAt, { min: 0 }) ?? params.now;
	const retryCount = asSafeIntegerInRange(params.entry.retryCount, { min: 0 }) ?? 0;
	const lastAttemptAt = asSafeIntegerInRange(params.entry.lastAttemptAt, { min: 0 });
	const platformSendStartedAt = asSafeIntegerInRange(params.entry.platformSendStartedAt, { min: 0 });
	const failed = params.status === "failed";
	const retention = failed ? inferDeliveryQueueFailureRetention(params.entry, params.id, params.queueName) : void 0;
	if (failed && !retention) return null;
	const failedAt = failed ? asSafeIntegerInRange(params.entry.failedAt, { min: 0 }) ?? lastAttemptAt ?? originalEnqueuedAt : null;
	const enqueuedAt = failedAt ?? originalEnqueuedAt;
	const meta = failed ? void 0 : deliveryQueueMetadata(params.queueName, params.entry);
	const retainedEntry = {
		...params.entry,
		id: params.id,
		enqueuedAt,
		retryCount
	};
	if (lastAttemptAt === void 0) delete retainedEntry.lastAttemptAt;
	else retainedEntry.lastAttemptAt = lastAttemptAt;
	if (platformSendStartedAt === void 0) delete retainedEntry.platformSendStartedAt;
	else retainedEntry.platformSendStartedAt = platformSendStartedAt;
	const failedEntry = failed ? projectDeliveryQueueTerminalEntry({
		id: params.id,
		retryCount
	}, enqueuedAt, "failed", retention) : void 0;
	return {
		queue_name: params.queueName,
		id: params.id,
		status: params.status,
		entry_kind: meta?.entryKind ?? null,
		session_key: meta?.sessionKey ?? null,
		channel: meta?.channel ?? null,
		target: meta?.target ?? null,
		account_id: meta?.accountId ?? null,
		retry_count: retryCount,
		last_attempt_at: !failed ? lastAttemptAt ?? null : null,
		last_error: !failed && typeof params.entry.lastError === "string" ? params.entry.lastError : null,
		recovery_state: failed ? failedEntry?.recoveryState ?? null : typeof params.entry.recoveryState === "string" ? params.entry.recoveryState : null,
		platform_send_started_at: !failed ? platformSendStartedAt ?? null : null,
		entry_json: JSON.stringify(failedEntry ?? retainedEntry),
		enqueued_at: enqueuedAt,
		updated_at: params.now,
		failed_at: failedAt
	};
}
function legacyDeliveryQueueRowsMatch(existing, incoming) {
	return [
		"status",
		"entry_kind",
		"session_key",
		"channel",
		"target",
		"account_id",
		"retry_count",
		"last_attempt_at",
		"last_error",
		"recovery_state",
		"platform_send_started_at",
		"entry_json",
		"enqueued_at",
		"failed_at"
	].every((column) => {
		const left = existing[column];
		const right = incoming[column];
		if (typeof left === "bigint" || typeof right === "bigint") return normalizeLegacySqliteInteger(left) === normalizeLegacySqliteInteger(right);
		return left === right;
	});
}
function removeLegacyDeliveryQueueDir(params) {
	try {
		fs.rmSync(params.queueDir, { recursive: true });
		params.changes.push(`Removed ${params.label} legacy source ${params.queueDir}`);
	} catch (err) {
		params.warnings.push(`Failed removing ${params.label} ${params.queueDir}: ${String(err)}`);
	}
}
function removeLegacyDeliveryQueueMarkers(markerPaths, label, warnings) {
	let removed = 0;
	for (const markerPath of markerPaths) try {
		fs.rmSync(markerPath, { force: true });
		removed++;
	} catch (err) {
		warnings.push(`Failed removing ${label} marker ${markerPath}: ${String(err)}`);
		return null;
	}
	return removed;
}
async function migrateLegacyDeliveryQueues(params) {
	const changes = [];
	const warnings = [];
	for (const queue of LEGACY_DELIVERY_QUEUE_DIRS) {
		const queueDir = resolveLegacyDeliveryQueuePath(params.stateDir, queue.dirName);
		const files = listLegacyDeliveryQueueFiles(queueDir);
		const markerPaths = listLegacyDeliveryQueueDeliveredMarkers(queueDir);
		if (files.length === 0 && markerPaths.length === 0) continue;
		let imported = 0;
		let skipped = 0;
		const conflicts = [];
		try {
			runOpenClawStateWriteTransaction(({ db }) => {
				const insert = db.prepare(`
            INSERT INTO delivery_queue_entries (
              queue_name, id, status, entry_kind, session_key, channel, target, account_id,
              retry_count, last_attempt_at, last_error, recovery_state,
              platform_send_started_at, entry_json, enqueued_at, updated_at, failed_at
            ) VALUES (
              @queue_name, @id, @status, @entry_kind, @session_key, @channel, @target,
              @account_id, @retry_count, @last_attempt_at, @last_error, @recovery_state,
              @platform_send_started_at, @entry_json, @enqueued_at, @updated_at, @failed_at
            )
          `);
				const now = Date.now();
				for (const file of files) {
					const entry = readLegacyDeliveryQueueEntry(file.sourcePath);
					const id = typeof entry?.id === "string" ? entry.id : path.basename(file.sourcePath, ".json");
					if (!entry || !id) {
						skipped++;
						continue;
					}
					const row = buildLegacyDeliveryQueueRow({
						queueName: queue.queueName,
						id,
						status: file.status,
						entry,
						now
					});
					if (!row) continue;
					const existing = db.prepare(`
                SELECT status, entry_kind, session_key, channel, target, account_id,
                       retry_count, last_attempt_at, last_error, recovery_state,
                       platform_send_started_at, entry_json, enqueued_at, failed_at
                  FROM delivery_queue_entries
                 WHERE queue_name = ? AND id = ?
              `).get(queue.queueName, id);
					if (existing) {
						if (!legacyDeliveryQueueRowsMatch(existing, row)) conflicts.push(id);
						continue;
					}
					insert.run(row);
					imported++;
				}
			}, { env: {
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			} });
		} catch (err) {
			warnings.push(`Failed migrating ${queue.label} ${queueDir}: ${String(err)}`);
			continue;
		}
		const removedMarkers = removeLegacyDeliveryQueueMarkers(markerPaths, queue.label, warnings);
		if (removedMarkers === null) continue;
		if (removedMarkers > 0) changes.push(`Removed ${removedMarkers} ${queue.label} delivered ${removedMarkers === 1 ? "marker" : "markers"}`);
		if (imported > 0) changes.push(`Migrated ${imported} ${queue.label} ${imported === 1 ? "entry" : "entries"} → shared SQLite state`);
		if (skipped > 0) {
			warnings.push(`Skipped ${skipped} malformed ${queue.label} ${skipped === 1 ? "entry" : "entries"}`);
			warnings.push(`Left ${queue.label} in place because malformed entries need manual cleanup`);
			continue;
		}
		if (conflicts.length > 0) {
			warnings.push(`Left ${queue.label} in place because ${conflicts.length} ${conflicts.length === 1 ? "entry" : "entries"} already existed in shared state: ${conflicts[0]}`);
			continue;
		}
		removeLegacyDeliveryQueueDir({
			queueDir,
			label: queue.label,
			changes,
			warnings
		});
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.plugin-state.ts
async function migrateLegacyPluginStateSidecar(params) {
	const sourcePath = resolveLegacyPluginStateSidecarPath(params.stateDir);
	if (!migrationFileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacyPluginStateSidecar({
			sourcePath,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let rows;
	try {
		rows = readLegacyPluginStateSidecarRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading plugin-state sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflictedKeys = [];
		const rowsToInsert = [];
		let imported = 0;
		let skippedExpired = 0;
		const now = Date.now();
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const row of rows) {
				executeSqliteQuerySync(db, stateDb.deleteFrom("plugin_state_entries").where("plugin_id", "=", row.plugin_id).where("namespace", "=", row.namespace).where("entry_key", "=", row.entry_key).where("expires_at", "is not", null).where("expires_at", "<=", now));
				const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("plugin_state_entries").select([
					"value_json",
					"created_at",
					"expires_at"
				]).where("plugin_id", "=", row.plugin_id).where("namespace", "=", row.namespace).where("entry_key", "=", row.entry_key));
				const legacyExpired = isLegacyPluginStateRowExpired(row, now);
				if (existing) {
					if (!legacyPluginStateRowsMatch(existing, row)) if ((normalizeLegacySqliteInteger(existing.created_at) ?? 0) > (normalizeLegacySqliteInteger(row.created_at) ?? 0)) {} else if (legacyExpired) skippedExpired += 1;
					else conflictedKeys.push(`${row.plugin_id}/${row.namespace}/${row.entry_key}`);
					continue;
				}
				if (legacyExpired) {
					skippedExpired += 1;
					continue;
				}
				rowsToInsert.push(row);
			}
			for (const row of rowsToInsert) {
				executeSqliteQuerySync(db, stateDb.insertInto("plugin_state_entries").values({
					plugin_id: row.plugin_id,
					namespace: row.namespace,
					entry_key: row.entry_key,
					value_json: row.value_json,
					created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
					expires_at: normalizeLegacySqliteInteger(row.expires_at)
				}).onConflict((conflict) => conflict.columns([
					"plugin_id",
					"namespace",
					"entry_key"
				]).doNothing()));
				imported += 1;
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (imported > 0) changes.push(`Migrated ${imported} plugin-state sidecar ${imported === 1 ? "entry" : "entries"} → shared SQLite state`);
		if (conflictedKeys.length > 0) return {
			changes,
			warnings: [`Left plugin-state sidecar in place because ${conflictedKeys.length} ${conflictedKeys.length === 1 ? "row differs" : "rows differ"} from shared state without a newer canonical timestamp. First key: ${conflictedKeys[0]}`]
		};
		if (skippedExpired > 0) changes.push(`Dropped ${skippedExpired} expired plugin-state sidecar ${skippedExpired === 1 ? "entry" : "entries"}`);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed migrating plugin-state sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyPluginStateSidecar({
		sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyInstalledPluginIndex(params) {
	const sourcePath = resolveLegacyInstalledPluginIndexStorePath({ stateDir: params.stateDir });
	if (!migrationFileExists(sourcePath)) return {
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	if (inspectPersistedInstalledPluginIndexInstallRecordsSync({ stateDir: params.stateDir }).status === "invalid") return {
		changes,
		warnings: [`Left plugin install index in place because persisted install records in ${params.stateDir} are invalid`]
	};
	const legacy = readLegacyInstalledPluginIndex(sourcePath);
	if (!legacy) return {
		changes,
		warnings: [`Left plugin install index in place because ${sourcePath} is invalid`]
	};
	const storeOptions = { stateDir: params.stateDir };
	const current = readPersistedInstalledPluginIndexSync(storeOptions);
	if (current && !legacyInstalledPluginIndexMatches(current, legacy)) {
		const merged = mergeLegacyInstalledPluginIndexRecords(current, legacy);
		if (merged.addedCount > 0) try {
			writePersistedInstalledPluginIndexSync(merged.merged, storeOptions);
			changes.push(`Merged ${merged.addedCount} legacy plugin install ${merged.addedCount === 1 ? "record" : "records"} → shared SQLite state`);
		} catch (err) {
			return {
				changes,
				warnings: [`Failed merging plugin install index ${sourcePath}: ${String(err)}`]
			};
		}
		if (merged.conflicts.length > 0) {
			archiveLegacyInstalledPluginIndex({
				sourcePath,
				changes,
				warnings
			});
			return {
				changes,
				warnings,
				notices: [`Kept canonical shared SQLite plugin install metadata despite differing legacy records for: ${merged.conflicts.join(", ")}`]
			};
		}
	}
	if (!current) try {
		writePersistedInstalledPluginIndexSync(legacy, storeOptions);
		const recordCount = Object.keys(legacy.installRecords).length;
		changes.push(`Migrated plugin install index ${recordCount} ${recordCount === 1 ? "record" : "records"} → shared SQLite state`);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed migrating plugin install index ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacyInstalledPluginIndex({
		sourcePath,
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
function preflightLegacyInstalledPluginIndexMigration(params) {
	if (inspectPersistedInstalledPluginIndexInstallRecordsSync(params).status === "invalid") return `State dir migration skipped because persisted plugin install records in ${params.stateDir} are invalid`;
	const sourcePath = resolveLegacyInstalledPluginIndexStorePath(params);
	if (migrationFileExists(sourcePath) && !readLegacyInstalledPluginIndex(sourcePath)) return `State dir migration skipped because plugin install index ${sourcePath} is invalid`;
	return null;
}
function resolvePluginStateImportTargetKey(scopeKey, key) {
	return scopeKey ? `${scopeKey}:${key}` : key;
}
function findMissingKey(expected, actual) {
	for (const key of expected) if (!actual.has(key)) return key;
}
function compareImportEntriesNewestFirst(a, b) {
	if (a.timestamp !== void 0 && b.timestamp !== void 0) return b.timestamp - a.timestamp;
	if (a.ttlMs !== void 0 && b.ttlMs !== void 0) return b.ttlMs - a.ttlMs;
	return 0;
}
async function withPluginStateImportEnv(plan, run) {
	if (!plan.stateDir) return await run();
	const previous = process.env.OPENCLAW_STATE_DIR;
	process.env.OPENCLAW_STATE_DIR = plan.stateDir;
	try {
		return await run();
	} finally {
		if (previous === void 0) delete process.env.OPENCLAW_STATE_DIR;
		else process.env.OPENCLAW_STATE_DIR = previous;
	}
}
async function runLegacyMigrationPlans(plans) {
	const changes = [];
	const warnings = [];
	for (const plan of plans) {
		if (plan.kind === "plugin-state-import") {
			await withPluginStateImportEnv(plan, async () => {
				let storeEntries;
				let pluginEntryCount;
				const store = createPluginStateKeyedStore(plan.pluginId, {
					namespace: plan.namespace,
					maxEntries: plan.maxEntries,
					...plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {}
				});
				try {
					storeEntries = await store.entries();
					pluginEntryCount = countPluginStateLiveEntries(plan.pluginId);
				} catch (err) {
					warnings.push(`Failed reading ${plan.label} plugin state before migration: ${String(err)}`);
					return;
				}
				const existingKeys = new Set(storeEntries.map(({ key }) => key));
				const existingValuesByKey = new Map(storeEntries.map(({ key, value }) => [key, value]));
				const existingCreatedAtByKey = new Map(storeEntries.map(({ key, createdAt }) => [key, createdAt]));
				const expectedKeys = new Set(existingKeys);
				const namespaceRemainingCapacity = Math.max(0, plan.maxEntries - storeEntries.length);
				let entries;
				try {
					entries = await plan.readEntries();
				} catch (err) {
					warnings.push(`Failed reading ${plan.label} legacy source: ${String(err)}`);
					return;
				}
				const replacementEntries = [];
				let newEntries = [];
				const failedTargetKeys = /* @__PURE__ */ new Set();
				for (const entry of entries) {
					const targetKey = resolvePluginStateImportTargetKey(plan.scopeKey, entry.key);
					const existingValue = existingValuesByKey.get(targetKey);
					if (existingKeys.has(targetKey)) {
						if (existingValue !== void 0 && await plan.shouldReplaceExistingEntry?.({
							key: entry.key,
							existingValue,
							incomingValue: entry.value
						})) replacementEntries.push({
							...entry,
							targetKey,
							existedBefore: true
						});
						continue;
					}
					newEntries.push({
						...entry,
						targetKey,
						existedBefore: false
					});
				}
				const missingEntryCount = newEntries.length;
				const pluginRemainingCapacity = Math.max(0, resolveMaxPluginStateEntriesPerPlugin() - pluginEntryCount);
				const importBudget = Math.min(namespaceRemainingCapacity, pluginRemainingCapacity);
				if (missingEntryCount > importBudget) {
					newEntries = newEntries.toSorted(compareImportEntriesNewestFirst).slice(0, importBudget);
					const constraint = namespaceRemainingCapacity <= pluginRemainingCapacity ? `plugin state namespace ${plan.namespace} has room for ${namespaceRemainingCapacity}` : `plugin state has room for ${pluginRemainingCapacity}`;
					warnings.push(newEntries.length > 0 ? `Partially migrating ${plan.label} because ${constraint} of ${missingEntryCount} missing entries; importing the newest ${newEntries.length} and deferring the rest in the legacy source` : `Deferring ${plan.label} migration because ${constraint} of ${missingEntryCount} missing entries; left legacy source in place to retry when capacity frees`);
				}
				const registerPreservingCreatedAt = async (params) => {
					if (params.createdAtMs === void 0 || !Number.isFinite(params.createdAtMs) || params.createdAtMs < 0) {
						await store.register(params.key, params.value, params.ttlMs != null ? { ttlMs: params.ttlMs } : void 0);
						return;
					}
					registerMigratedPluginStateEntry({
						pluginId: plan.pluginId,
						namespace: plan.namespace,
						maxEntries: plan.maxEntries,
						...plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {},
						key: params.key,
						value: params.value,
						...params.ttlMs != null ? { ttlMs: params.ttlMs } : {},
						createdAtMs: params.createdAtMs
					});
				};
				const restoreExistingEntry = async (key) => {
					await registerPreservingCreatedAt({
						key,
						value: existingValuesByKey.get(key),
						createdAtMs: existingCreatedAtByKey.get(key)
					});
				};
				let imported = 0;
				const changedKeys = /* @__PURE__ */ new Set();
				for (const entry of [...replacementEntries, ...newEntries]) try {
					await registerPreservingCreatedAt({
						key: entry.targetKey,
						value: entry.value,
						...entry.ttlMs != null ? { ttlMs: entry.ttlMs } : {},
						...entry.timestamp !== void 0 ? { createdAtMs: entry.timestamp } : {}
					});
					const nextExpectedKeys = new Set(expectedKeys);
					nextExpectedKeys.add(entry.targetKey);
					const missingKey = findMissingKey(nextExpectedKeys, new Set((await store.entries()).map(({ key }) => key)));
					if (missingKey) {
						if (existingValuesByKey.has(entry.targetKey)) await restoreExistingEntry(entry.targetKey);
						else await store.delete(entry.targetKey);
						if (changedKeys.has(missingKey)) {
							changedKeys.delete(missingKey);
							expectedKeys.delete(missingKey);
							existingKeys.delete(missingKey);
							imported = Math.max(0, imported - 1);
						} else if (existingValuesByKey.has(missingKey)) try {
							await restoreExistingEntry(missingKey);
						} catch (restoreErr) {
							warnings.push(`Failed restoring ${plan.label} entry ${missingKey} after cap eviction: ${String(restoreErr)}`);
						}
						warnings.push(`Paused migrating ${plan.label} because plugin state cap evicted ${missingKey}; imported ${imported} of ${missingEntryCount} missing entries and deferred the rest in the legacy source`);
						break;
					}
					expectedKeys.add(entry.targetKey);
					existingKeys.add(entry.targetKey);
					changedKeys.add(entry.targetKey);
					imported++;
				} catch (err) {
					failedTargetKeys.add(entry.targetKey);
					warnings.push(`Failed migrating ${plan.label} entry ${entry.key}: ${String(err)}`);
				}
				if (imported > 0) changes.push(`Migrated ${imported} ${plan.label} ${imported === 1 ? "entry" : "entries"} → plugin state`);
				let cleanupKeys = existingKeys;
				if (plan.cleanupSource === "rename") cleanupKeys = expectedKeys;
				const allEntriesCovered = entries.length === 0 && plan.cleanupWhenEmpty === true || entries.length > 0 && entries.every(({ key }) => cleanupKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)) && !failedTargetKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)));
				if (allEntriesCovered && plan.cleanupSource === "rename" && migrationFileExists(plan.sourcePath)) archiveLegacyImportSource({
					sourcePath: plan.sourcePath,
					label: plan.label,
					changes,
					warnings
				});
				if (allEntriesCovered && plan.cleanupSource === "remove" && migrationFileExists(plan.sourcePath)) try {
					fs.unlinkSync(plan.sourcePath);
					changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
				} catch (err) {
					warnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
				}
				if (allEntriesCovered && plan.removeSource) try {
					await plan.removeSource();
					changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
				} catch (err) {
					warnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
				}
			});
			continue;
		}
		if (migrationFileExists(plan.targetPath)) continue;
		try {
			ensureMigrationDir(path.dirname(plan.targetPath));
			if (plan.kind === "move") {
				fs.renameSync(plan.sourcePath, plan.targetPath);
				changes.push(`Moved ${plan.label} → ${plan.targetPath}`);
			} else {
				fs.copyFileSync(plan.sourcePath, plan.targetPath);
				changes.push(`Copied ${plan.label} → ${plan.targetPath}`);
			}
		} catch (err) {
			warnings.push(`Failed migrating ${plan.label} (${plan.sourcePath}): ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
export { PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES as a, hasPendingSqliteSidecarArchive as c, migrateLegacyDeliveryQueues as d, migrateLegacyTaskStateSidecars as f, resolveLegacyTaskRunsSidecarPath as g, resolveLegacyPluginStateSidecarPath as h, runLegacyMigrationPlans as i, listLegacyDeliveryQueueDeliveredMarkers as l, resolveLegacyFlowRunsSidecarPath as m, migrateLegacyPluginStateSidecar as n, TASK_STATE_SQLITE_SIDECAR_SUFFIXES as o, resolveLegacyDeliveryQueuePath as p, preflightLegacyInstalledPluginIndexMigration as r, archiveLegacyImportSource as s, migrateLegacyInstalledPluginIndex as t, listLegacyDeliveryQueueFiles as u };
