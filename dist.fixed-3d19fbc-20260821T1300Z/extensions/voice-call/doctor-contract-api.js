import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.js";
import { n as normalizeAgentId } from "../../agent-id-Db0rqw_J.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import "../../routing-CERGQFBr.js";
import "../../runtime-doctor-migrations-BkKB39tt.js";
import { t as archiveLegacyStateSource } from "../../doctor-state-migration-fs-CfVap4xL.js";
import { a as CALL_RECORD_EVENT_META_MAX_ENTRIES, c as buildVoiceCallLegacyJsonlEventKey, f as parseVoiceCallRecordLine, h as resolveVoiceCallLegacyCallLogPath, i as CALL_RECORD_EVENT_CHUNKS_NAMESPACE, m as prepareVoiceCallRecordForStorage, n as CALL_RECORD_CHUNK_MAX_ENTRIES, o as MAX_CALL_RECORD_EVENTS, r as CALL_RECORD_EVENTS_NAMESPACE, s as RAW_CALL_RECORD_CHUNK_BYTES, t as resolveDefaultVoiceCallStoreDir } from "../../store-path-B_vXlrzb.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/voice-call/doctor-contract-api.ts
/** Resolve home from doctor env with OS fallback. */
function resolveHome(env) {
	return env.HOME?.trim() || os.homedir();
}
/** Resolve config paths, including "~", against the doctor env home. */
function resolveUserPath(input, env) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, resolveHome(env)));
	return path.resolve(trimmed);
}
/** Read the configured voice-call store path from either package id. */
function getVoiceCallConfigStore(config) {
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const rawConfig = config.plugins?.entries?.[pluginId]?.config;
		if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) continue;
		const store = rawConfig.store;
		if (typeof store === "string" && store.trim()) return store.trim();
	}
	return "";
}
/** Return Voice Call agents whose templated core session stores need migration. */
function resolveSessionStoreAgentIds(params) {
	const agentIds = /* @__PURE__ */ new Set();
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const entry = params.cfg.plugins?.entries?.[pluginId];
		if (!entry) continue;
		const config = entry.config === void 0 ? {} : asOptionalRecord(entry.config);
		if (!config) continue;
		agentIds.add(normalizeAgentId(typeof config.agentId === "string" ? config.agentId : void 0));
		const numbers = asOptionalRecord(config.numbers);
		for (const route of Object.values(numbers ?? {})) {
			const agentId = asOptionalRecord(route)?.agentId;
			if (typeof agentId === "string") agentIds.add(normalizeAgentId(agentId));
		}
	}
	return [...agentIds].toSorted();
}
/** Resolve the voice-call store path used by legacy and plugin-state call records. */
function resolveVoiceCallStorePath(params) {
	const configuredStore = getVoiceCallConfigStore(params.config);
	if (configuredStore) return resolveUserPath(configuredStore, params.env);
	return resolveDefaultVoiceCallStoreDir(params.env);
}
function resolveVoiceCallStateDatabaseEnv(params) {
	return {
		...params.env,
		OPENCLAW_STATE_DIR: resolveVoiceCallStorePath(params)
	};
}
function describeVoiceCallSchemaMigration(migration) {
	switch (migration.kind) {
		case "agent-databases-composite-primary-key": return "agent database registry primary key -> agent_id,path";
		case "audit-events-v2": return "audit event ledger -> versioned message lifecycle schema";
		case "commitments-retirement-v7": return "retired commitments storage -> removed table and indexes";
		case "worker-placement-execution-mode-v8": return "cloud worker placements -> execution-mode claims";
		case "operator-approvals-system-agent": return "operator approvals -> OpenClaw system changes";
		case "session-watch-cursor-provenance-v4": return "session watch cursors -> provenance column";
		case "strict-tables-v3": return "tables -> SQLite STRICT typing";
	}
	return migration.kind;
}
/** Return true when a path exists and is a file. */
/** Build the plugin state key for one migrated event chunk. */
function buildChunkKey(eventKey, index) {
	return `${eventKey}:chunk:${String(index).padStart(4, "0")}`;
}
/** Chunk a prepared call record into bounded plugin state rows. */
function prepareChunks(call) {
	const serialized = JSON.stringify(prepareVoiceCallRecordForStorage(call));
	const buffer = Buffer.from(serialized, "utf8");
	const chunkCount = Math.max(1, Math.ceil(buffer.byteLength / RAW_CALL_RECORD_CHUNK_BYTES));
	if (chunkCount > 48) throw new Error(`voice-call record exceeds SQLite chunk limit (${chunkCount}/48)`);
	const chunks = [];
	for (let index = 0; index < chunkCount; index += 1) {
		const chunk = buffer.subarray(index * RAW_CALL_RECORD_CHUNK_BYTES, (index + 1) * RAW_CALL_RECORD_CHUNK_BYTES);
		chunks.push({
			index,
			dataBase64: chunk.toString("base64")
		});
	}
	return {
		chunks,
		meta: {
			chunkCount,
			byteLength: buffer.byteLength
		}
	};
}
/** Read and prepare legacy JSONL call records, collecting line-level warnings. */
async function readLegacyCallRecords(filePath) {
	let content;
	try {
		content = await fs.readFile(filePath, "utf8");
	} catch {
		return {
			entries: [],
			warnings: []
		};
	}
	const entries = [];
	const warnings = [];
	let index = 0;
	for (const line of content.split("\n")) {
		const parsed = parseVoiceCallRecordLine(line, index);
		if (!parsed) {
			if (line.trim()) warnings.push(`Skipped malformed Voice Call call-log line ${index + 1}`);
			index += 1;
			continue;
		}
		try {
			const prepared = prepareChunks(parsed.call);
			entries.push({
				eventKey: buildVoiceCallLegacyJsonlEventKey(line, index),
				lineNumber: index + 1,
				chunks: prepared.chunks,
				meta: {
					...prepared.meta,
					persistedAt: parsed.persistedAt,
					sequence: parsed.sequence
				}
			});
		} catch (err) {
			warnings.push(`Skipped Voice Call call-log line ${index + 1}: ${String(err)}`);
		}
		index += 1;
	}
	return {
		entries,
		warnings
	};
}
/** Archive the legacy JSONL source after a complete migration. */
/** Select newest missing records that fit remaining plugin state capacity. */
async function selectEntriesForImport(params) {
	const existingEventKeys = new Set((await params.eventStore.entries()).map((entry) => entry.key));
	const missingEntries = params.entries.filter((entry) => !existingEventKeys.has(entry.eventKey));
	const existingChunks = await params.chunkStore.entries();
	let eventRoom = Math.max(0, MAX_CALL_RECORD_EVENTS - existingEventKeys.size);
	let chunkRoom = Math.max(0, CALL_RECORD_CHUNK_MAX_ENTRIES - existingChunks.length);
	const selected = [];
	let pruned = 0;
	for (const entry of missingEntries.toReversed()) {
		if (eventRoom <= 0 || entry.chunks.length > chunkRoom) {
			pruned++;
			continue;
		}
		selected.push(entry);
		eventRoom--;
		chunkRoom -= entry.chunks.length;
	}
	if (pruned > 0) params.warnings.push(`Pruned ${pruned} older Voice Call call-log ${pruned === 1 ? "record" : "records"} during migration because plugin state keeps the newest ${MAX_CALL_RECORD_EVENTS} records`);
	return {
		existingEventKeys,
		entries: selected.toReversed()
	};
}
/** Import prepared legacy call records into plugin state. */
async function importLegacyCallRecords(params) {
	const selected = await selectEntriesForImport(params);
	let imported = 0;
	for (const entry of selected.entries) {
		if (selected.existingEventKeys.has(entry.eventKey)) continue;
		try {
			for (const chunk of entry.chunks) await params.chunkStore.register(buildChunkKey(entry.eventKey, chunk.index), chunk);
			await params.eventStore.register(entry.eventKey, entry.meta);
			selected.existingEventKeys.add(entry.eventKey);
			imported++;
		} catch (err) {
			params.warnings.push(`Failed migrating Voice Call call-log line ${entry.lineNumber}: ${String(err)}`);
		}
	}
	return imported;
}
/** Doctor migrations owned by the voice-call plugin. */
const stateMigrations = [{
	id: "voice-call-calls-jsonl-to-plugin-state",
	label: "Voice Call call log",
	async detectLegacyState(params) {
		const { detectOpenClawStateDatabaseSchemaMigrations } = await import("../../plugin-sdk/doctor-repair-runtime.js");
		const { entries } = await readLegacyCallRecords(resolveVoiceCallLegacyCallLogPath(resolveVoiceCallStorePath(params)));
		const schemaMigrations = detectOpenClawStateDatabaseSchemaMigrations({ env: resolveVoiceCallStateDatabaseEnv(params) });
		if (entries.length === 0 && schemaMigrations.length === 0) return null;
		return { preview: [...schemaMigrations.map((migration) => `- Voice Call SQLite schema: ${describeVoiceCallSchemaMigration(migration)}`), ...entries.length > 0 ? [`- Voice Call call log: ${entries.length} ${entries.length === 1 ? "record" : "records"} -> plugin state (${CALL_RECORD_EVENTS_NAMESPACE})`] : []] };
	},
	async migrateLegacyState(params) {
		const { detectOpenClawStateDatabaseSchemaMigrations, repairOpenClawStateDatabaseSchema } = await import("../../plugin-sdk/doctor-repair-runtime.js");
		const changes = [];
		const warnings = [];
		const filePath = resolveVoiceCallLegacyCallLogPath(resolveVoiceCallStorePath(params));
		const { entries, warnings: readWarnings } = await readLegacyCallRecords(filePath);
		warnings.push(...readWarnings);
		const stateDatabaseEnv = resolveVoiceCallStateDatabaseEnv(params);
		if (detectOpenClawStateDatabaseSchemaMigrations({ env: stateDatabaseEnv }).length > 0) {
			const repaired = repairOpenClawStateDatabaseSchema({ env: stateDatabaseEnv });
			warnings.push(...repaired.warnings);
			if (repaired.warnings.length > 0) return {
				changes,
				warnings
			};
			changes.push(...repaired.changes.map((change) => change.replace(/^Migrated shared state /, "Migrated Voice Call SQLite ").replaceAll("→", "->")));
		}
		if (entries.length === 0) return {
			changes,
			warnings
		};
		const env = stateDatabaseEnv;
		const imported = await importLegacyCallRecords({
			entries,
			eventStore: params.context.openPluginStateKeyedStore({
				namespace: CALL_RECORD_EVENTS_NAMESPACE,
				maxEntries: CALL_RECORD_EVENT_META_MAX_ENTRIES,
				env
			}),
			chunkStore: params.context.openPluginStateKeyedStore({
				namespace: CALL_RECORD_EVENT_CHUNKS_NAMESPACE,
				maxEntries: CALL_RECORD_CHUNK_MAX_ENTRIES,
				env
			}),
			warnings
		});
		if (imported > 0) changes.push(`Migrated ${imported} Voice Call call-log ${imported === 1 ? "record" : "records"} -> plugin state`);
		if (warnings.some((warning) => warning.startsWith("Failed migrating Voice Call") || warning.startsWith("Skipped malformed Voice Call call-log line") || warning.startsWith("Skipped Voice Call call-log line") || warning.startsWith("Skipped Voice Call call-log migration"))) {
			warnings.push("Left Voice Call call-log source in place because migration was incomplete");
			return {
				changes,
				warnings
			};
		}
		await archiveLegacyStateSource({
			filePath,
			label: "Voice Call call-log",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { resolveSessionStoreAgentIds, stateMigrations };
