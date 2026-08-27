import { a as asOptionalRecord, i as asOptionalObjectRecord } from "../../record-coerce-DItp3I4t.js";
import { r as root } from "../../fs-safe-CmrQUApq.js";
import { c as resolveUserPath } from "../../home-dir-BFvskzn8.js";
import { r as formatErrorMessage } from "../../errors-Ccx0R-_Z.js";
import { n as normalizeAgentId } from "../../agent-id-CeT3w4ap.js";
import { a as reclaimDefinitelyStaleFileLock } from "../../file-lock-DRVK2jTz.js";
import { c as MEMORY_INDEX_FTS_TABLE, i as MEMORY_INDEX_META_TABLE, o as MEMORY_INDEX_VECTOR_TABLE, r as MEMORY_EMBEDDING_CACHE_TABLE, s as MEMORY_INDEX_CHUNKS_TABLE, u as MEMORY_INDEX_SOURCES_TABLE } from "../../memory-schema-CJwA5QKm.js";
import "../../error-runtime-CmA1H4Zg.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import "../../routing-DM8631ts.js";
import "../../runtime-doctor-migrations-D-k1ye_X.js";
import { n as legacyStateFileExists, t as archiveLegacyStateSource } from "../../doctor-state-migration-fs-CfVap4xL.js";
import "../../memory-core-host-engine-fs-D8P-HmVn.js";
import "../../memory-core-host-engine-schema-Ddz9AW7J.js";
import { b as writeMemoryCoreWorkspaceEntries, d as SHORT_TERM_RECALL_NAMESPACE, i as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, l as SHORT_TERM_META_NAMESPACE, p as configureMemoryCoreDreamingState, r as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, t as DREAMING_DAILY_INGESTION_NAMESPACE, u as SHORT_TERM_PHASE_SIGNAL_NAMESPACE, x as writeMemoryCoreWorkspaceEntry, y as readMemoryCoreWorkspaceEntries } from "../../dreaming-state-B0qd2W7q.js";
import { D as normalizeShortTermRecallStore, n as normalizeShortTermPhaseSignalStore } from "../../short-term-promotion-store-BlKDyXAW.js";
import { i as normalizeSessionIngestionState, n as normalizeDailyIngestionState } from "../../dreaming-ingestion-state-C389BYCj.js";
import { n as createVectorIndexProviderDiagnostic } from "../../doctor-vector-index-provider-diagnostic-CtKorFX5.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto, { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region extensions/memory-core/src/migration/doctor-workspaces.ts
async function resolveConfiguredWorkspaces(config, env) {
	const { resolveMemoryDreamingWorkspaces } = await import("../../plugin-sdk/memory-core-host-status.js");
	return resolveMemoryDreamingWorkspaces(config, { env }).map((entry) => entry.workspaceDir);
}
//#endregion
//#region extensions/memory-core/src/migration/dreaming-state-comparison.ts
const LEGACY_SOURCE_ACKNOWLEDGEMENT_NAMESPACE = "legacy-dreaming-source-acknowledgements";
function targetNamespacesForSource(label) {
	if (label === "daily ingestion") return [DREAMING_DAILY_INGESTION_NAMESPACE];
	if (label === "session ingestion") return [DREAMING_SESSION_INGESTION_FILES_NAMESPACE, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE];
	return [label === "short-term recall" ? SHORT_TERM_RECALL_NAMESPACE : SHORT_TERM_PHASE_SIGNAL_NAMESPACE];
}
async function memoryCoreLegacyTargetHasRows(source) {
	return (await Promise.all(targetNamespacesForSource(source.label).map(async (namespace) => (await readMemoryCoreWorkspaceEntries({
		namespace,
		workspaceDir: source.workspaceDir
	})).length))).some((count) => count > 0);
}
async function memoryCoreLegacySourceMatchesCanonical(source, raw) {
	if (source.label === "daily ingestion") {
		const rows = await readMemoryCoreWorkspaceEntries({
			namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
			workspaceDir: source.workspaceDir
		});
		return isDeepStrictEqual(normalizeDailyIngestionState(raw), normalizeDailyIngestionState({
			version: 1,
			files: Object.fromEntries(rows.map((row) => [row.key, row.value]))
		}));
	}
	if (source.label === "session ingestion") {
		const [fileRows, seenRows] = await Promise.all([readMemoryCoreWorkspaceEntries({
			namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
			workspaceDir: source.workspaceDir
		}), readMemoryCoreWorkspaceEntries({
			namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
			workspaceDir: source.workspaceDir
		})]);
		const chunksByScope = /* @__PURE__ */ new Map();
		for (const row of seenRows) {
			const chunks = chunksByScope.get(row.value.scope) ?? [];
			chunks.push({
				index: row.value.index,
				hashes: row.value.hashes
			});
			chunksByScope.set(row.value.scope, chunks);
		}
		return isDeepStrictEqual(normalizeSessionIngestionState(raw), normalizeSessionIngestionState({
			version: 3,
			files: Object.fromEntries(fileRows.map((row) => [row.key, row.value])),
			seenMessages: Object.fromEntries([...chunksByScope].map(([scope, chunks]) => [scope, chunks.toSorted((left, right) => left.index - right.index).flatMap((row) => row.hashes)]))
		}));
	}
	const [entryRows, metaRows] = await Promise.all([readMemoryCoreWorkspaceEntries({
		namespace: source.label === "short-term recall" ? SHORT_TERM_RECALL_NAMESPACE : SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
		workspaceDir: source.workspaceDir
	}), readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir: source.workspaceDir
	})]);
	const metaKey = source.label === "short-term recall" ? "recall" : "phase";
	const updatedAt = metaRows.find((row) => row.key === metaKey)?.value.updatedAt;
	if (typeof updatedAt !== "string" || updatedAt.length === 0) return false;
	const canonicalRaw = {
		version: 1,
		updatedAt,
		entries: Object.fromEntries(entryRows.map((row) => [row.key, row.value]))
	};
	if (source.label === "short-term recall") {
		const canonical = normalizeShortTermRecallStore(canonicalRaw, updatedAt);
		const fallbackCandidates = /* @__PURE__ */ new Set([updatedAt]);
		for (const row of entryRows) {
			const value = asOptionalRecord(row.value);
			for (const key of ["firstRecalledAt", "lastRecalledAt"]) if (typeof value?.[key] === "string") fallbackCandidates.add(value[key]);
		}
		return [...fallbackCandidates].some((fallback) => isDeepStrictEqual(normalizeShortTermRecallStore(raw, fallback), canonical));
	}
	return isDeepStrictEqual(normalizeShortTermPhaseSignalStore(raw, updatedAt), normalizeShortTermPhaseSignalStore(canonicalRaw, updatedAt));
}
async function memoryCoreLegacySourceIsAcknowledged(source) {
	const contents = await fs$1.readFile(source.filePath);
	const sha256 = createHash("sha256").update(contents).digest("hex");
	const markerKey = `legacy-source:${source.label}`;
	if ((await readMemoryCoreWorkspaceEntries({
		namespace: LEGACY_SOURCE_ACKNOWLEDGEMENT_NAMESPACE,
		workspaceDir: source.workspaceDir
	})).find((row) => row.key === markerKey)?.value.sha256 === sha256) return true;
	let archiveNames = [];
	try {
		const archivePrefix = `${path.basename(source.filePath)}.migrated`;
		archiveNames = (await fs$1.readdir(path.dirname(source.filePath))).filter((name) => {
			if (name === archivePrefix) return true;
			const suffix = name.slice(archivePrefix.length + 1);
			const archiveIndex = Number(suffix);
			return name.startsWith(`${archivePrefix}.`) && Number.isSafeInteger(archiveIndex) && archiveIndex >= 2 && String(archiveIndex) === suffix;
		});
	} catch {}
	let matchesArchive = false;
	for (const archiveName of archiveNames) try {
		if (contents.equals(await fs$1.readFile(path.join(path.dirname(source.filePath), archiveName)))) {
			matchesArchive = true;
			break;
		}
	} catch {}
	if (!matchesArchive && !await memoryCoreLegacySourceMatchesCanonical(source, JSON.parse(contents.toString("utf8")))) return false;
	await writeMemoryCoreWorkspaceEntry({
		namespace: LEGACY_SOURCE_ACKNOWLEDGEMENT_NAMESPACE,
		workspaceDir: source.workspaceDir,
		key: markerKey,
		value: { sha256 }
	});
	return true;
}
const dreamingStateComparison = {
	targetHasRows: memoryCoreLegacyTargetHasRows,
	sourceIsAcknowledged: memoryCoreLegacySourceIsAcknowledged
};
//#endregion
//#region extensions/memory-core/src/migration/doctor-dreaming-state.ts
const LEGACY_DREAMING_STATE_DIR = path.join("memory", ".dreams");
async function readJsonFile(filePath) {
	return JSON.parse(await fs$1.readFile(filePath, "utf8"));
}
async function collectLegacySources(config, env) {
	const sources = [];
	for (const workspaceDir of await resolveConfiguredWorkspaces(config, env)) for (const candidate of [
		{
			label: "daily ingestion",
			fileName: "daily-ingestion.json"
		},
		{
			label: "session ingestion",
			fileName: "session-ingestion.json"
		},
		{
			label: "short-term recall",
			fileName: "short-term-recall.json"
		},
		{
			label: "phase signals",
			fileName: "phase-signals.json"
		}
	]) {
		const filePath = path.join(workspaceDir, LEGACY_DREAMING_STATE_DIR, candidate.fileName);
		if (await legacyStateFileExists(filePath)) sources.push({
			workspaceDir,
			label: candidate.label,
			filePath
		});
	}
	return sources;
}
async function migrateDailyIngestion(source) {
	const state = normalizeDailyIngestionState(await readJsonFile(source.filePath));
	await writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	});
	return Object.keys(state.files).length;
}
async function migrateSessionIngestion(source) {
	const state = normalizeSessionIngestionState(await readJsonFile(source.filePath));
	const seenEntries = Object.entries(state.seenMessages).flatMap(([scope, hashes]) => Array.from({ length: Math.ceil(hashes.length / 512) }, (_, index) => ({
		key: `${scope}:${index}`,
		value: {
			scope,
			index,
			hashes: hashes.slice(index * 512, (index + 1) * 512)
		}
	})));
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: seenEntries
	})]);
	return Object.keys(state.files).length + Object.keys(state.seenMessages).length;
}
async function migrateShortTermRecall(source) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const state = normalizeShortTermRecallStore(await readJsonFile(source.filePath), nowIso);
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_RECALL_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.entries).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir: source.workspaceDir,
		key: "recall",
		value: { updatedAt: state.updatedAt }
	})]);
	return Object.keys(state.entries).length;
}
async function migratePhaseSignals(source) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const state = normalizeShortTermPhaseSignalStore(await readJsonFile(source.filePath), nowIso);
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.entries).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir: source.workspaceDir,
		key: "phase",
		value: { updatedAt: state.updatedAt }
	})]);
	return Object.keys(state.entries).length;
}
async function migrateSource(source) {
	if (source.label === "daily ingestion") return await migrateDailyIngestion(source);
	if (source.label === "session ingestion") return await migrateSessionIngestion(source);
	if (source.label === "short-term recall") return await migrateShortTermRecall(source);
	return await migratePhaseSignals(source);
}
const dreamingStateMigration = {
	id: "memory-core-dreams-json-to-sqlite",
	label: "Memory Core dreaming state",
	async detectLegacyState(params) {
		configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
		const sources = await collectLegacySources(params.config, params.env);
		if (sources.length === 0) return null;
		return { preview: sources.map((source) => `- Memory Core ${source.label}: ${source.filePath} -> SQLite plugin state`) };
	},
	async migrateLegacyState(params) {
		configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
		const changes = [];
		const warnings = [];
		const notices = [];
		for (const source of await collectLegacySources(params.config, params.env)) {
			if (await dreamingStateComparison.targetHasRows(source)) {
				let sourceAcknowledged;
				try {
					sourceAcknowledged = await dreamingStateComparison.sourceIsAcknowledged(source);
				} catch (err) {
					warnings.push(`Skipped Memory Core ${source.label} import for ${source.workspaceDir} because the legacy source could not be compared: ${String(err)}`);
					continue;
				}
				if (sourceAcknowledged) {
					notices.push(`Retained acknowledged Memory Core ${source.label} legacy source for rollback: ${source.filePath}`);
					continue;
				}
				changes.push(`Resolved Memory Core ${source.label} legacy conflict by keeping canonical SQLite plugin state`);
				await archiveLegacyStateSource({
					filePath: source.filePath,
					label: `Memory Core ${source.label} conflicting legacy source`,
					changes,
					warnings
				});
				continue;
			}
			let imported;
			try {
				imported = await migrateSource(source);
			} catch (err) {
				warnings.push(`Skipped Memory Core ${source.label} import for ${source.workspaceDir} because the legacy source could not be imported: ${String(err)}`);
				continue;
			}
			changes.push(`Migrated Memory Core ${source.label} -> SQLite plugin state (${imported} row(s))`);
			await archiveLegacyStateSource({
				filePath: source.filePath,
				label: `Memory Core ${source.label}`,
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {}
		};
	}
};
//#endregion
//#region extensions/memory-core/src/migration/doctor-host-event-sources.ts
function normalizeMemoryHostWorkspaceKey(workspaceDir) {
	const resolved = path.resolve(workspaceDir).replace(/\\/g, "/");
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function memoryHostWorkspacePrefix(workspaceDir) {
	return crypto.createHash("sha256").update(normalizeMemoryHostWorkspaceKey(workspaceDir)).digest("hex").slice(0, 24);
}
async function collectLegacyMemoryHostEventSources(config, env) {
	const { resolveMemoryHostEventLogPath } = await import("../../plugin-sdk/memory-host-events.js");
	const sources = [];
	const seenWorkspaces = /* @__PURE__ */ new Set();
	for (const workspaceDir of await resolveConfiguredWorkspaces(config, env)) {
		let canonicalWorkspaceDir = path.resolve(workspaceDir);
		let filePath = resolveMemoryHostEventLogPath(canonicalWorkspaceDir);
		try {
			const workspaceRoot = await root(workspaceDir, {
				hardlinks: "reject",
				maxBytes: Number.MAX_SAFE_INTEGER,
				mkdir: false,
				symlinks: "reject"
			});
			canonicalWorkspaceDir = workspaceRoot.rootReal;
			if (seenWorkspaces.has(canonicalWorkspaceDir)) continue;
			seenWorkspaces.add(canonicalWorkspaceDir);
			filePath = resolveMemoryHostEventLogPath(canonicalWorkspaceDir);
			const relativePath = path.relative(canonicalWorkspaceDir, filePath);
			const directoryRelativePath = path.dirname(relativePath);
			if (!await workspaceRoot.exists(directoryRelativePath)) continue;
			if (!(await workspaceRoot.stat(directoryRelativePath)).isDirectory) continue;
			const baseName = path.basename(relativePath).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
			const archivePattern = new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
			const claimPattern = new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
			const entries = await fs$1.readdir(path.join(workspaceRoot.rootReal, directoryRelativePath));
			const candidates = [];
			for (const entry of entries) {
				if (entry === path.basename(relativePath)) {
					candidates.push({
						entry,
						storage: "active",
						generation: void 0
					});
					continue;
				}
				const claim = claimPattern.exec(entry);
				if (claim) {
					candidates.push({
						entry,
						storage: "claim",
						generation: BigInt(claim[1] ?? "1")
					});
					continue;
				}
				const archive = archivePattern.exec(entry);
				if (archive) candidates.push({
					entry,
					storage: "archive",
					generation: BigInt(archive[1] ?? "1")
				});
			}
			candidates.sort((left, right) => {
				if (left.generation === void 0) return 1;
				if (right.generation === void 0) return -1;
				return left.generation < right.generation ? -1 : left.generation > right.generation ? 1 : 0;
			});
			for (const candidate of candidates) {
				const candidateRelativePath = path.join(directoryRelativePath, candidate.entry);
				if (!(await workspaceRoot.stat(candidateRelativePath)).isFile) continue;
				const generationKey = (candidate.generation?.toString())?.padStart(20, "0");
				sources.push({
					kind: "ready",
					workspaceDir: canonicalWorkspaceDir,
					filePath: path.join(canonicalWorkspaceDir, candidateRelativePath),
					relativePath: candidateRelativePath,
					root: workspaceRoot,
					storage: candidate.storage,
					...candidate.storage === "active" ? {} : {
						archiveRelativePath: `${relativePath}.migrated${candidate.generation === 1n ? "" : `.${candidate.generation}`}`,
						generationKey
					}
				});
			}
		} catch (error) {
			const code = error.code;
			if (code === "ENOENT" || code === "ENOTDIR" || code === "not-found") continue;
			if (!seenWorkspaces.has(canonicalWorkspaceDir)) seenWorkspaces.add(canonicalWorkspaceDir);
			sources.push({
				kind: "rejected",
				workspaceDir: canonicalWorkspaceDir,
				filePath,
				reason: String(error)
			});
		}
	}
	return sources;
}
async function resolveMemoryHostEventArchivePath(source) {
	const { resolveMemoryHostEventLogPath } = await import("../../plugin-sdk/memory-host-events.js");
	const activeRelativePath = path.relative(source.workspaceDir, resolveMemoryHostEventLogPath(source.workspaceDir));
	const directoryPath = path.join(source.root.rootReal, path.dirname(activeRelativePath));
	const baseName = path.basename(activeRelativePath).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	const archivePattern = new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
	const claimPattern = new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
	let latestGeneration = 0n;
	for (const entry of await fs$1.readdir(directoryPath)) {
		const match = archivePattern.exec(entry) ?? claimPattern.exec(entry);
		if (!match) continue;
		const generation = BigInt(match[1] ?? "1");
		if (generation > latestGeneration) latestGeneration = generation;
	}
	const generation = latestGeneration + 1n;
	const generationText = generation.toString();
	if (generationText.length > 20) throw new RangeError("Memory Core host event archive generation is too large");
	const generationSuffix = generation === 1n ? "" : `.${generation}`;
	return {
		archiveRelativePath: `${activeRelativePath}.migrated${generationSuffix}`,
		claimRelativePath: path.join(path.dirname(activeRelativePath), `.${path.basename(activeRelativePath)}.doctor-importing${generationSuffix}`),
		generationKey: generationText.padStart(20, "0")
	};
}
//#endregion
//#region extensions/memory-core/src/migration/doctor-host-events.ts
const MEMORY_HOST_EVENTS_NAMESPACE = "memory-host.events";
const MEMORY_HOST_EVENT_CURSORS_NAMESPACE = "memory-host.event-cursors";
const MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS_NAMESPACE = "memory-host.event-migration-checkpoints";
const MAX_MEMORY_HOST_EVENTS = 1e4;
const MAX_MEMORY_HOST_EVENT_CURSORS = 1e3;
const MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS = 1e4;
const MAX_LEGACY_MEMORY_HOST_EVENT_VALUE_BYTES = 65536;
const LEGACY_MEMORY_HOST_SEQUENCE_BASE = Number.MIN_SAFE_INTEGER;
function memoryHostMigrationCheckpointKey(source) {
	if (!source.generationKey) throw new Error(`Missing Memory Core host event archive generation for ${source.filePath}`);
	return `${memoryHostWorkspacePrefix(source.workspaceDir)}:archive:${source.generationKey}`;
}
function memoryHostMigrationSnapshot(raw, recordCount, sequenceBase) {
	return {
		kind: "migration-checkpoint",
		contentHash: crypto.createHash("sha256").update(raw).digest("hex"),
		recordCount,
		sequenceBase,
		size: Buffer.byteLength(raw, "utf8")
	};
}
function isMemoryHostMigrationCheckpoint(value) {
	return value?.kind === "migration-checkpoint" && typeof value.contentHash === "string" && Number.isSafeInteger(value.recordCount) && value.recordCount >= 0 && Number.isSafeInteger(value.sequenceBase) && Number.isSafeInteger(value.size) && value.size >= 0;
}
async function memoryHostEventSourceNeedsMigration(params) {
	if (params.source.storage !== "archive") return true;
	const checkpoint = await params.context.openPluginStateKeyedStore({
		namespace: MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS_NAMESPACE,
		maxEntries: MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS,
		overflowPolicy: "reject-new"
	}).lookup(memoryHostMigrationCheckpointKey(params.source));
	if (!isMemoryHostMigrationCheckpoint(checkpoint)) return true;
	const raw = await params.source.root.readText(params.source.relativePath);
	return Buffer.byteLength(raw, "utf8") !== checkpoint.size || crypto.createHash("sha256").update(raw).digest("hex") !== checkpoint.contentHash;
}
async function finalizeLegacyMemoryHostEventSource(params) {
	if (params.source.storage === "archive") return true;
	const archivedRelativePath = params.source.archiveRelativePath;
	if (!archivedRelativePath) throw new Error(`Missing Memory Core host event archive path for ${params.source.filePath}`);
	try {
		await params.source.root.move(params.source.relativePath, archivedRelativePath);
		params.changes.push(`Archived Memory Core host events legacy source -> ${path.join(params.source.workspaceDir, archivedRelativePath)}`);
		return true;
	} catch (error) {
		params.warnings.push(`Failed archiving Memory Core host events legacy source: ${String(error)}`);
		return false;
	}
}
async function restoreClaimedMemoryHostEventSource(params) {
	try {
		if (!await params.source.root.exists(params.source.relativePath)) return;
		if (!await params.source.root.exists(params.activeRelativePath)) {
			await params.source.root.move(params.source.relativePath, params.activeRelativePath);
			return;
		}
		params.warnings.push(`Left claimed Memory Core host events at ${params.source.filePath} because an old writer recreated the active source`);
	} catch (error) {
		params.warnings.push(`Failed restoring claimed Memory Core host events ${params.source.filePath}: ${String(error)}`);
	}
}
async function migrateLegacyMemoryHostEventSource(params) {
	const { normalizeMemoryHostEventRecordForStorage, resolveMemoryHostEventLogPath } = await import("../../plugin-sdk/memory-host-events.js");
	const activeRelativePath = path.relative(params.source.workspaceDir, resolveMemoryHostEventLogPath(params.source.workspaceDir));
	let source = params.source;
	let restoreNewClaim = false;
	let claimFinalized = source.storage === "archive";
	if (source.storage === "active") {
		const generation = await resolveMemoryHostEventArchivePath(source);
		await source.root.move(source.relativePath, generation.claimRelativePath);
		source = {
			...source,
			filePath: path.join(source.workspaceDir, generation.claimRelativePath),
			relativePath: generation.claimRelativePath,
			storage: "claim",
			archiveRelativePath: generation.archiveRelativePath,
			generationKey: generation.generationKey
		};
		restoreNewClaim = true;
	}
	try {
		if (!source.generationKey) throw new Error(`Missing Memory Core host event generation for ${source.filePath}`);
		const warningStart = params.warnings.length;
		const raw = await source.root.readText(source.relativePath);
		const prefix = memoryHostWorkspacePrefix(source.workspaceDir);
		const records = [];
		for (const [lineIndex, line] of raw.split(/\r?\n/u).entries()) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			let event;
			try {
				event = JSON.parse(trimmed);
			} catch (error) {
				params.warnings.push(`Skipped malformed Memory Core host event at ${source.filePath}:${lineIndex + 1}: ${String(error)}`);
				continue;
			}
			const normalizedEvent = normalizeMemoryHostEventRecordForStorage(event);
			if (!normalizedEvent) {
				params.warnings.push(`Skipped invalid Memory Core host event at ${source.filePath}:${lineIndex + 1}`);
				continue;
			}
			const canonicalEvent = JSON.stringify(normalizedEvent);
			const parsedTimestamp = Date.parse(normalizedEvent.timestamp);
			const recordedAt = Number.isSafeInteger(parsedTimestamp) ? parsedTimestamp : 0;
			const ordinal = records.length;
			const digest = crypto.createHash("sha256").update(canonicalEvent).digest("hex");
			const value = {
				kind: "event",
				event: normalizedEvent,
				recordedAt,
				sequence: LEGACY_MEMORY_HOST_SEQUENCE_BASE + ordinal + 1
			};
			if (Buffer.byteLength(JSON.stringify(value), "utf8") > MAX_LEGACY_MEMORY_HOST_EVENT_VALUE_BYTES) {
				params.warnings.push(`Skipped oversized Memory Core host event at ${source.filePath}:${lineIndex + 1}`);
				continue;
			}
			records.push({
				digest,
				ordinal,
				value
			});
		}
		if (params.warnings.length > warningStart) {
			params.warnings.push("Left Memory Core host events legacy source in place because invalid rows still require repair");
			return "blocked";
		}
		const checkpointStore = params.context.openPluginStateKeyedStore({
			namespace: MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS,
			overflowPolicy: "reject-new"
		});
		const checkpointKey = memoryHostMigrationCheckpointKey(source);
		const checkpointValue = await checkpointStore.lookup(checkpointKey);
		const previousCheckpoint = isMemoryHostMigrationCheckpoint(checkpointValue) ? checkpointValue : void 0;
		if (source.storage === "archive" && previousCheckpoint) {
			const bytes = Buffer.from(raw, "utf8");
			const prefixHash = crypto.createHash("sha256").update(bytes.subarray(0, previousCheckpoint.size)).digest("hex");
			if (bytes.length < previousCheckpoint.size || prefixHash !== previousCheckpoint.contentHash || records.length < previousCheckpoint.recordCount) {
				params.warnings.push(`Skipped Memory Core host event recovery because ${source.filePath} changed other than by append; left the archive in place`);
				return "blocked";
			}
		}
		const firstCandidateOrdinal = source.storage === "archive" && previousCheckpoint ? previousCheckpoint.recordCount : 0;
		const candidateRecords = records.slice(firstCandidateOrdinal);
		const store = params.context.openPluginStateKeyedStore({
			namespace: MEMORY_HOST_EVENTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENTS
		});
		const existingEntries = await store.entries();
		const existingKeys = new Set(existingEntries.map((entry) => entry.key));
		const latestLegacySequence = existingEntries.reduce((latest, entry) => entry.value.sequence < 0 ? Math.max(latest, entry.value.sequence) : latest, LEGACY_MEMORY_HOST_SEQUENCE_BASE);
		const legacyKeyPrefix = `${prefix}:event:0:s:`;
		const existingByIdentity = new Map(existingEntries.flatMap((entry) => {
			if (!entry.key.startsWith(legacyKeyPrefix) || entry.value.sequence >= 0) return [];
			const parts = entry.key.split(":");
			return parts.length === 8 ? [[`${parts[5]}:${parts[6]}:${parts[7]}`, entry]] : [];
		}));
		const existingSourceBase = candidateRecords.flatMap((record) => {
			const identity = `${source.generationKey}:${record.ordinal.toString().padStart(16, "0")}:${record.digest}`;
			const existing = existingByIdentity.get(identity);
			return existing ? [existing.value.sequence - (record.ordinal + 1)] : [];
		})[0];
		const laterGenerationExists = existingEntries.some((entry) => {
			if (!entry.key.startsWith(legacyKeyPrefix) || entry.value.sequence >= 0) return false;
			const generationKey = entry.key.split(":")[5];
			return generationKey !== void 0 && generationKey > source.generationKey;
		});
		if (source.storage === "archive" && !previousCheckpoint && existingSourceBase === void 0 && laterGenerationExists) {
			params.warnings.push(`Skipped Memory Core host event recovery because ${source.filePath} has no durable checkpoint and later generations are already imported; left the archive in place`);
			return "blocked";
		}
		const sourceSequenceBase = previousCheckpoint?.sequenceBase ?? existingSourceBase ?? latestLegacySequence;
		let nextSequence = latestLegacySequence;
		const sequencedRecords = candidateRecords.map((record) => {
			const ordinalKey = record.ordinal.toString().padStart(16, "0");
			const identity = `${source.generationKey}:${ordinalKey}:${record.digest}`;
			const existing = existingByIdentity.get(identity);
			if (existing) return {
				...record,
				key: existing.key,
				value: {
					...record.value,
					sequence: existing.value.sequence
				}
			};
			const sequence = previousCheckpoint ? nextSequence += 1 : sourceSequenceBase + record.ordinal + 1;
			const sequenceKey = (sequence - LEGACY_MEMORY_HOST_SEQUENCE_BASE).toString().padStart(16, "0");
			return {
				...record,
				key: `${legacyKeyPrefix}${sequenceKey}:${identity}`,
				value: {
					...record.value,
					sequence
				}
			};
		});
		const sourceKeys = new Set(sequencedRecords.map((record) => record.key));
		if (sequencedRecords.some((record) => !Number.isSafeInteger(record.value.sequence) || record.value.sequence >= 0)) {
			params.warnings.push("Skipped Memory Core host event migration because legacy sequence capacity is exhausted; left legacy source in place");
			return "blocked";
		}
		const nativeCount = existingEntries.filter((entry) => entry.value.sequence >= 0).length;
		const legacyRetentionLimit = Math.max(0, MAX_MEMORY_HOST_EVENTS - nativeCount);
		const combinedLegacy = [...existingEntries.filter((entry) => entry.value.sequence < 0 && !sourceKeys.has(entry.key)).map((entry) => ({
			key: entry.key,
			sequence: entry.value.sequence
		})), ...sequencedRecords.map((record) => ({
			key: record.key,
			sequence: record.value.sequence
		}))].toSorted((left, right) => left.sequence - right.sequence || left.key.localeCompare(right.key));
		const desiredLegacyKeys = new Set(legacyRetentionLimit === 0 ? [] : combinedLegacy.slice(-legacyRetentionLimit).map((record) => record.key));
		let retainedRecords = sequencedRecords.filter((record) => desiredLegacyKeys.has(record.key));
		const capacity = params.context.getPluginStateCapacity?.();
		if (!capacity) {
			params.warnings.push("Skipped Memory Core host event migration because plugin-wide SQLite capacity is unavailable; left legacy source in place");
			return "blocked";
		}
		const pluginRemainingCapacity = Math.max(0, capacity.maxEntries - capacity.liveEntries);
		const cursorStore = params.context.openPluginStateKeyedStore({
			namespace: MEMORY_HOST_EVENT_CURSORS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENT_CURSORS
		});
		const cursorKey = `${prefix}:cursor`;
		const existingCursor = await cursorStore.lookup(cursorKey);
		const cursorCapacity = candidateRecords.length > 0 && existingCursor?.kind !== "cursor" ? 1 : 0;
		if (cursorCapacity > pluginRemainingCapacity) {
			params.warnings.push("Skipped Memory Core host event migration because SQLite plugin state has no room for its workspace cursor; left legacy source in place");
			return "blocked";
		}
		const checkpointCapacity = checkpointValue ? 0 : 1;
		if (checkpointCapacity > 0 && (await checkpointStore.entries()).length >= MAX_MEMORY_HOST_EVENT_MIGRATION_CHECKPOINTS) {
			params.warnings.push("Skipped Memory Core host event migration because durable raw-archive checkpoint capacity is exhausted; left legacy source in place");
			return "blocked";
		}
		if (cursorCapacity + checkpointCapacity > pluginRemainingCapacity) {
			params.warnings.push("Skipped Memory Core host event migration because SQLite plugin state has no room for its raw-archive checkpoint; left legacy source in place");
			return "blocked";
		}
		const importEntries = params.context.importPluginStateEntries;
		if (candidateRecords.length > 0 && !importEntries) {
			params.warnings.push("Skipped Memory Core host event migration because retention-aware SQLite import is unavailable; left legacy source in place");
			return "blocked";
		}
		let retainedKeys = new Set(retainedRecords.map((record) => record.key));
		let missing = retainedRecords.filter((record) => !existingKeys.has(record.key));
		let replaceableLegacyRows = existingEntries.filter((entry) => entry.value.sequence < 0 && !retainedKeys.has(entry.key)).length;
		const reservedCapacity = cursorCapacity + checkpointCapacity;
		const eventCapacity = pluginRemainingCapacity - reservedCapacity + replaceableLegacyRows;
		const retentionDeficit = Math.max(0, missing.length - eventCapacity);
		if (retentionDeficit > 0) {
			retainedRecords = retainedRecords.slice(Math.min(retentionDeficit, retainedRecords.length));
			retainedKeys = new Set(retainedRecords.map((record) => record.key));
			missing = retainedRecords.filter((record) => !existingKeys.has(record.key));
			replaceableLegacyRows = existingEntries.filter((entry) => entry.value.sequence < 0 && !retainedKeys.has(entry.key)).length;
		}
		const availableEventCapacity = pluginRemainingCapacity - reservedCapacity + replaceableLegacyRows;
		if (missing.length > availableEventCapacity) {
			params.warnings.push(`Skipped Memory Core host event migration because SQLite plugin state has room for ${availableEventCapacity} of ${missing.length} missing rows after reserving its cursor and raw-archive checkpoint; left legacy source in place`);
			return "blocked";
		}
		if (cursorCapacity > 0) {
			const lastSequence = existingEntries.reduce((maximum, entry) => Number.isSafeInteger(entry.value.sequence) ? Math.max(maximum, entry.value.sequence) : maximum, 0);
			await cursorStore.register(cursorKey, {
				kind: "cursor",
				lastSequence
			});
			if ((await cursorStore.lookup(cursorKey))?.kind !== "cursor") {
				params.warnings.push("Skipped Memory Core host event migration because its workspace cursor could not be verified; left legacy source in place");
				return "blocked";
			}
		}
		importEntries?.({
			namespace: MEMORY_HOST_EVENTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENTS
		}, missing.map((record) => ({
			key: record.key,
			value: record.value,
			createdAt: record.value.sequence
		})));
		const importedKeys = new Set((await store.entries()).map((entry) => entry.key));
		const missingKey = retainedRecords.find((record) => !importedKeys.has(record.key))?.key;
		if (missingKey) {
			params.warnings.push(`Skipped archiving Memory Core host events because SQLite verification missed ${missingKey}`);
			return "blocked";
		}
		if (source.storage === "archive") {
			if (missing.length > 0) params.changes.push(`Recovered ${missing.length} later Memory Core host event row(s) from ${source.filePath}`);
		} else {
			params.changes.push(records.length === 0 ? "Retired empty Memory Core host events legacy source" : `Migrated Memory Core host events -> SQLite plugin state (${missing.length} new row(s))`);
			claimFinalized = await finalizeLegacyMemoryHostEventSource({
				source,
				changes: params.changes,
				warnings: params.warnings
			});
			if (!claimFinalized) {
				params.changes.pop();
				return "blocked";
			}
		}
		const checkpoint = memoryHostMigrationSnapshot(raw, records.length, sourceSequenceBase);
		await checkpointStore.register(checkpointKey, checkpoint);
		const registeredCheckpoint = await checkpointStore.lookup(checkpointKey);
		if (!isMemoryHostMigrationCheckpoint(registeredCheckpoint) || registeredCheckpoint.contentHash !== checkpoint.contentHash || registeredCheckpoint.recordCount !== checkpoint.recordCount || registeredCheckpoint.sequenceBase !== checkpoint.sequenceBase || registeredCheckpoint.size !== checkpoint.size) {
			params.warnings.push(`Failed verifying Memory Core host event raw-archive checkpoint for ${source.filePath}`);
			return "blocked";
		}
		if (source.storage !== "archive" && await source.root.exists(activeRelativePath)) params.warnings.push("An old writer recreated the Memory Core host event source; rerun openclaw doctor --fix to import the retained rows");
		return "completed";
	} finally {
		if (restoreNewClaim && !claimFinalized) await restoreClaimedMemoryHostEventSource({
			source,
			activeRelativePath,
			warnings: params.warnings
		});
	}
}
const hostEventsStateMigration = {
	id: "memory-core-host-events-jsonl-to-sqlite",
	label: "Memory Core host events",
	doctorOnly: true,
	async detectLegacyState(params) {
		const sources = await collectLegacyMemoryHostEventSources(params.config, params.env);
		const pending = [];
		for (const source of sources) if (source.kind === "rejected" || await memoryHostEventSourceNeedsMigration({
			source,
			context: params.context
		})) pending.push(source);
		if (pending.length === 0) return null;
		return { preview: pending.map((source) => source.kind === "ready" ? `- Memory Core host events: ${source.filePath} -> SQLite plugin state (${MEMORY_HOST_EVENTS_NAMESPACE})` : `- Memory Core host events: ${source.filePath} requires safe-path repair (${source.reason})`) };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const blockedWorkspaces = /* @__PURE__ */ new Set();
		for (const source of await collectLegacyMemoryHostEventSources(params.config, params.env)) {
			if (blockedWorkspaces.has(source.workspaceDir)) continue;
			if (source.kind === "rejected") {
				warnings.push(`Skipped unsafe Memory Core host event source for ${source.workspaceDir}: ${source.reason}`);
				blockedWorkspaces.add(source.workspaceDir);
				continue;
			}
			if (!await memoryHostEventSourceNeedsMigration({
				source,
				context: params.context
			})) continue;
			if (await migrateLegacyMemoryHostEventSource({
				source,
				context: params.context,
				changes,
				warnings
			}) === "blocked") blockedWorkspaces.add(source.workspaceDir);
		}
		return {
			changes,
			warnings
		};
	}
};
//#endregion
//#region extensions/memory-core/src/migration/legacy-memory-sidecar-fts.ts
const LEGACY_MEMORY_FTS_MATCH_TABLE = "memory_core_legacy_fts_matches";
const CREATE_LEGACY_MEMORY_FTS_MATCH_TABLE_SQL = `
  CREATE TEMP TABLE ${LEGACY_MEMORY_FTS_MATCH_TABLE} (
    id TEXT PRIMARY KEY,
    exact INTEGER NOT NULL
  ) STRICT, WITHOUT ROWID;
`;
/** Build the statement that materializes canonical FTS rows matching legacy chunk ids. */
function buildLegacyMemoryFtsMatchSql(schema) {
	return `
    INSERT INTO temp.${LEGACY_MEMORY_FTS_MATCH_TABLE} (id, exact)
    SELECT canonical.id,
           MAX(CASE
             WHEN canonical.text IS legacy.text
              AND canonical.path IS legacy.path
              AND canonical.source IS legacy.source
              AND canonical.model IS legacy.model
              AND canonical.start_line IS legacy.start_line
              AND canonical.end_line IS legacy.end_line
             THEN 1 ELSE 0
           END)
    -- SQLite preserves CROSS JOIN order, keeping the unindexed FTS scan outer
    -- so both chunk tables use indexed id lookups instead of rescanning FTS.
    FROM main.${MEMORY_INDEX_FTS_TABLE} AS canonical
    CROSS JOIN ${schema}.chunks AS legacy
    CROSS JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk
    WHERE legacy.id = canonical.id
      AND chunk.id = legacy.id
    GROUP BY canonical.id;
  `;
}
/** Build the statement that copies legacy FTS rows absent from the canonical match table. */
function buildLegacyMemoryFtsCopySql(schema) {
	return `
    INSERT INTO main.${MEMORY_INDEX_FTS_TABLE} (
      text, id, path, source, model, start_line, end_line
    )
    SELECT legacy.text, legacy.id, legacy.path, legacy.source, legacy.model,
           legacy.start_line, legacy.end_line
    FROM ${schema}.chunks AS legacy
    JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
    WHERE NOT EXISTS (
      SELECT 1 FROM temp.${LEGACY_MEMORY_FTS_MATCH_TABLE} AS canonical
      WHERE canonical.id = legacy.id
    );
  `;
}
//#endregion
//#region extensions/memory-core/src/migration/doctor-memory-sidecar-import.ts
const LEGACY_MEMORY_SIDECAR_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const LEGACY_MEMORY_SIDECAR_SCHEMA = "legacy_memory_sidecar";
const LEGACY_MEMORY_VECTOR_TABLE = "chunks_vec";
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
const LEGACY_MEMORY_SOURCE_COLUMNS = [
	"path",
	"source",
	"hash",
	"mtime",
	"size"
];
const LEGACY_MEMORY_CHUNK_COLUMNS = [
	"id",
	"path",
	"source",
	"start_line",
	"end_line",
	"hash",
	"model",
	"text",
	"embedding",
	"updated_at"
];
const LEGACY_MEMORY_CACHE_COLUMNS = [
	"provider",
	"model",
	"provider_key",
	"hash",
	"embedding",
	"dims",
	"updated_at"
];
var LegacyMemoryDerivedRowsConflictError = class extends Error {
	constructor(tableName) {
		super(`legacy memory ${tableName} rows conflict with canonical memory index rows`);
		this.tableName = tableName;
	}
};
function tableExists(db, schema, tableName) {
	return Boolean(db.prepare(`SELECT 1 FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName));
}
function tableColumns(db, tableName, schema = "main") {
	const rows = db.prepare(`PRAGMA ${schema}.table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function tableHasColumns(db, tableName, expected, schema = "main", exact = false) {
	const columns = tableColumns(db, tableName, schema);
	return (!exact || columns.size === expected.length) && expected.every((column) => columns.has(column));
}
function hasLegacyMemoryIndexTables(db, schema = "main") {
	return tableHasColumns(db, "meta", ["key", "value"], schema, true) && tableHasColumns(db, "files", LEGACY_MEMORY_SOURCE_COLUMNS, schema, true) && tableHasColumns(db, "chunks", LEGACY_MEMORY_CHUNK_COLUMNS, schema, true);
}
function hasLegacyEmbeddingCacheTable(db, schema = "main") {
	return tableHasColumns(db, "embedding_cache", LEGACY_MEMORY_CACHE_COLUMNS, schema, true);
}
function hasLegacyVectorTable(db, schema = "main") {
	return tableHasColumns(db, LEGACY_MEMORY_VECTOR_TABLE, ["id", "embedding"], schema);
}
function tableRowCount(db, schema, tableName) {
	const row = db.prepare(`SELECT COUNT(*) AS count FROM ${schema}.${tableName}`).get();
	return Number(row?.count ?? 0);
}
function readLegacySidecarCounts(db, schema, options) {
	const vectorEntries = readLegacyVectorEntries(db, schema, !options.copyVectorRows);
	return {
		sources: tableRowCount(db, schema, "files"),
		chunks: tableRowCount(db, schema, "chunks"),
		cacheEntries: hasLegacyEmbeddingCacheTable(db, schema) ? tableRowCount(db, schema, "embedding_cache") : 0,
		vectorEntries
	};
}
function readLegacyVectorEntries(db, schema, tolerateInvalid) {
	if (!tableExists(db, schema, LEGACY_MEMORY_VECTOR_TABLE)) return 0;
	try {
		return hasLegacyVectorTable(db, schema) ? tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE) : void 0;
	} catch (error) {
		if (!tolerateInvalid) throw error;
		return;
	}
}
function assertLegacyDerivedRowsCopied(db, query, tableName) {
	const row = db.prepare(query).get();
	if (Number(row?.missing ?? 0) > 0) throw new LegacyMemoryDerivedRowsConflictError(tableName);
}
function assertLegacyVectorRowsReferenceChunks(db, schema) {
	const row = db.prepare(`SELECT COUNT(*) AS missing
       FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk
         WHERE chunk.id = legacy.id
       )`).get();
	if (Number(row?.missing ?? 0) > 0) throw new Error(`legacy memory ${LEGACY_MEMORY_VECTOR_TABLE} rows reference missing chunks`);
}
function readMemoryIndexMetaVectorDimensions(db, schema, tableName) {
	if (!tableExists(db, schema, tableName)) return;
	const meta = db.prepare(`SELECT value FROM ${schema}.${tableName} WHERE key = ?`).get(MEMORY_INDEX_META_KEY);
	if (typeof meta?.value !== "string") return;
	try {
		const parsed = JSON.parse(meta.value);
		const dimensions = Number(parsed.vectorDims);
		return Number.isSafeInteger(dimensions) && dimensions > 0 ? dimensions : void 0;
	} catch {}
}
function readVectorTableSqlDimensions(db, schema, tableName) {
	const row = db.prepare(`SELECT sql FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName);
	if (typeof row?.sql !== "string") return;
	const match = /embedding\s+FLOAT\[(\d+)\]/i.exec(row.sql);
	const dimensions = Number(match?.[1] ?? 0);
	return Number.isSafeInteger(dimensions) && dimensions > 0 ? dimensions : void 0;
}
function readLegacyVectorDimensions(db, schema) {
	const configuredDimensions = readMemoryIndexMetaVectorDimensions(db, schema, "meta") ?? readVectorTableSqlDimensions(db, schema, LEGACY_MEMORY_VECTOR_TABLE);
	if (configuredDimensions) return configuredDimensions;
	const row = db.prepare(`SELECT length(embedding) AS bytes FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} WHERE embedding IS NOT NULL LIMIT 1`).get();
	const bytes = Number(row?.bytes ?? 0);
	return Number.isSafeInteger(bytes) && bytes > 0 && bytes % Float32Array.BYTES_PER_ELEMENT === 0 ? bytes / Float32Array.BYTES_PER_ELEMENT : void 0;
}
function readCanonicalVectorDimensions(db) {
	return readVectorTableSqlDimensions(db, "main", "memory_index_chunks_vec") ?? readMemoryIndexMetaVectorDimensions(db, "main", "memory_index_meta");
}
function ensureCanonicalVectorTableForLegacyRows(db, schema) {
	if (!hasLegacyVectorTable(db, schema) || tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE) === 0) return;
	const dimensions = readLegacyVectorDimensions(db, schema);
	if (!dimensions) throw new Error("legacy memory chunks_vec rows require vector dimensions before import");
	if (tableExists(db, "main", "memory_index_chunks_vec")) {
		const canonicalDimensions = readCanonicalVectorDimensions(db);
		if (!canonicalDimensions) throw new Error("canonical memory chunks_vec table requires vector dimensions before legacy import");
		if (canonicalDimensions !== dimensions) throw new Error(`legacy memory chunks_vec dimensions ${dimensions} do not match canonical memory chunks_vec dimensions ${canonicalDimensions}`);
		return;
	}
	const canonicalMetaDimensions = readMemoryIndexMetaVectorDimensions(db, "main", MEMORY_INDEX_META_TABLE);
	if (canonicalMetaDimensions && canonicalMetaDimensions !== dimensions) throw new Error(`legacy memory chunks_vec dimensions ${dimensions} do not match canonical memory chunks_vec dimensions ${canonicalMetaDimensions}`);
	db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS main.${MEMORY_INDEX_VECTOR_TABLE} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
}
function copyLegacyMemoryVectorRows(db, schema) {
	if (!hasLegacyVectorTable(db, schema)) return;
	ensureCanonicalVectorTableForLegacyRows(db, schema);
	if (!tableExists(db, "main", "memory_index_chunks_vec")) return;
	assertLegacyVectorRowsReferenceChunks(db, schema);
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     JOIN main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical ON canonical.id = legacy.id
     WHERE canonical.embedding IS NOT legacy.embedding`, LEGACY_MEMORY_VECTOR_TABLE);
	db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_VECTOR_TABLE} (id, embedding)
    SELECT legacy.id, legacy.embedding
    FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
    JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
    WHERE NOT EXISTS (
      SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
      WHERE canonical.id = legacy.id
    );
  `);
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.embedding IS legacy.embedding
     )`, LEGACY_MEMORY_VECTOR_TABLE);
}
function copyLegacyMemoryFtsRows(db, schema) {
	if (!tableExists(db, "main", "memory_index_chunks_fts")) return;
	if (!db.prepare(`SELECT 1 FROM ${schema}.chunks LIMIT 1`).get()) return;
	db.exec(CREATE_LEGACY_MEMORY_FTS_MATCH_TABLE_SQL);
	try {
		db.exec(buildLegacyMemoryFtsMatchSql(schema));
		assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM temp.${LEGACY_MEMORY_FTS_MATCH_TABLE}
       WHERE exact = 0`, "fts");
		db.exec(buildLegacyMemoryFtsCopySql(schema));
	} finally {
		db.exec(`DROP TABLE temp.${LEGACY_MEMORY_FTS_MATCH_TABLE}`);
	}
}
function copyLegacyMemoryIndexRows(db, schema, options) {
	db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_META_TABLE} (key, value)
    SELECT key, value FROM ${schema}.meta;

    INSERT OR IGNORE INTO main.${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
    SELECT path, source, hash, mtime, size FROM ${schema}.files;

    INSERT OR IGNORE INTO main.${MEMORY_INDEX_CHUNKS_TABLE} (
      id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
    )
    SELECT id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
    FROM ${schema}.chunks;
  `);
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.meta AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_META_TABLE} AS canonical
       WHERE canonical.key = legacy.key AND canonical.value IS legacy.value
     )`, "meta");
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.files AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS canonical
       WHERE canonical.path = legacy.path
         AND canonical.source IS legacy.source
         AND canonical.hash IS legacy.hash
         AND canonical.mtime IS legacy.mtime
         AND canonical.size IS legacy.size
     )`, "files");
	assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
     FROM ${schema}.chunks AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.path IS legacy.path
         AND canonical.source IS legacy.source
         AND canonical.start_line IS legacy.start_line
         AND canonical.end_line IS legacy.end_line
         AND canonical.hash IS legacy.hash
         AND canonical.model IS legacy.model
         AND canonical.text IS legacy.text
         AND canonical.embedding IS legacy.embedding
         AND canonical.updated_at IS legacy.updated_at
     )`, "chunks");
	copyLegacyMemoryFtsRows(db, schema);
	if (options.copyVectorRows) copyLegacyMemoryVectorRows(db, schema);
	if (hasLegacyEmbeddingCacheTable(db, schema)) {
		db.exec(`
      CREATE TABLE IF NOT EXISTS main.${MEMORY_EMBEDDING_CACHE_TABLE} (
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        provider_key TEXT NOT NULL,
        hash TEXT NOT NULL,
        embedding TEXT NOT NULL,
        dims INTEGER,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (provider, model, provider_key, hash)
      ) STRICT;
      INSERT OR IGNORE INTO main.${MEMORY_EMBEDDING_CACHE_TABLE} (
        provider, model, provider_key, hash, embedding, dims, updated_at
      )
      SELECT provider, model, provider_key, hash, embedding, dims, updated_at
      FROM ${schema}.embedding_cache;
    `);
		assertLegacyDerivedRowsCopied(db, `SELECT COUNT(*) AS missing
       FROM ${schema}.embedding_cache AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_EMBEDDING_CACHE_TABLE} AS canonical
         WHERE canonical.provider = legacy.provider
           AND canonical.model = legacy.model
           AND canonical.provider_key = legacy.provider_key
           AND canonical.hash = legacy.hash
           AND canonical.dims IS legacy.dims
           AND CASE WHEN json_valid(canonical.embedding) AND json_valid(legacy.embedding) THEN json_type(canonical.embedding) = 'array' AND json_array_length(canonical.embedding) = canonical.dims AND json_type(legacy.embedding) = 'array' AND json_array_length(legacy.embedding) = legacy.dims ELSE 0 END
       )`, "embedding_cache");
	}
}
function importLegacyMemorySidecarIndex(params) {
	if (!params.legacySidecarDatabasePath || !fs.existsSync(params.legacySidecarDatabasePath)) return {
		imported: false,
		reason: "missing-sidecar",
		sources: 0,
		chunks: 0,
		cacheEntries: 0,
		vectorEntries: 0,
		vectorEntriesImported: true
	};
	params.db.prepare(`ATTACH DATABASE ? AS ${LEGACY_MEMORY_SIDECAR_SCHEMA}`).run(params.legacySidecarDatabasePath);
	try {
		if (!hasLegacyMemoryIndexTables(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA)) return {
			imported: false,
			reason: "legacy-schema-missing",
			sources: 0,
			chunks: 0,
			cacheEntries: 0,
			vectorEntries: 0,
			vectorEntriesImported: true
		};
		const counts = readLegacySidecarCounts(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA, { copyVectorRows: params.copyVectorRows });
		params.db.exec("SAVEPOINT import_legacy_sidecar_memory_index");
		try {
			copyLegacyMemoryIndexRows(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA, { copyVectorRows: params.copyVectorRows });
			params.db.exec("RELEASE import_legacy_sidecar_memory_index");
			return {
				imported: true,
				...counts,
				vectorEntriesImported: counts.vectorEntries === 0 || !params.requireVectorRows || params.copyVectorRows && counts.vectorEntries !== void 0
			};
		} catch (err) {
			params.db.exec("ROLLBACK TO import_legacy_sidecar_memory_index");
			params.db.exec("RELEASE import_legacy_sidecar_memory_index");
			throw err;
		}
	} finally {
		params.db.exec(`DETACH DATABASE ${LEGACY_MEMORY_SIDECAR_SCHEMA}`);
	}
}
//#endregion
//#region extensions/memory-core/src/migration/doctor-memory-sidecar.ts
function formatLegacyVectorRows(count) {
	return count === void 0 ? "legacy vector rows" : `${count} vector row(s)`;
}
function resolveConfiguredAgentIds(config) {
	const cfg = config;
	const entries = asOptionalObjectRecord(cfg.agents?.entries);
	const listedIds = Array.isArray(cfg.agents?.list) ? cfg.agents.list.flatMap((entry) => {
		const id = asOptionalObjectRecord(entry)?.id;
		return typeof id === "string" ? [id] : [];
	}) : [];
	const ids = new Set([...Object.keys(entries ?? {}), ...listedIds].map(normalizeAgentId));
	return ids.size > 0 ? [...ids] : [normalizeAgentId(void 0)];
}
function readAgentMemorySearch(config, agentId) {
	const agents = asOptionalObjectRecord(asOptionalObjectRecord(config)?.agents);
	const keyedEntries = asOptionalObjectRecord(agents?.entries);
	const keyedSearch = asOptionalObjectRecord(asOptionalObjectRecord(asOptionalObjectRecord(keyedEntries ? Object.entries(keyedEntries).find(([id]) => normalizeAgentId(id) === agentId)?.[1] : void 0)?.memory)?.search);
	if (keyedSearch) return keyedSearch;
	return asOptionalObjectRecord(asOptionalObjectRecord((Array.isArray(agents?.list) ? agents.list : []).map(asOptionalObjectRecord).find((candidate) => normalizeAgentId(typeof candidate?.id === "string" ? candidate.id : void 0) === agentId)?.memory)?.search);
}
function readMemorySearchLayers(config, agentId) {
	const cfg = asOptionalObjectRecord(config);
	return [
		readAgentMemorySearch(config, agentId),
		asOptionalObjectRecord(asOptionalObjectRecord(cfg?.memory)?.search),
		asOptionalObjectRecord(cfg?.memorySearch)
	].filter((value) => value !== void 0);
}
function readStoreLayers(config, agentId) {
	return readMemorySearchLayers(config, agentId).flatMap((search) => {
		const store = asOptionalObjectRecord(search.store);
		return store ? [store] : [];
	});
}
function firstDefined(layers, key) {
	return layers.find((layer) => layer[key] !== void 0)?.[key];
}
function readNestedStoreLayers(config, agentId, key) {
	return readStoreLayers(config, agentId).flatMap((store) => {
		const nested = asOptionalObjectRecord(store[key]);
		return nested ? [nested] : [];
	});
}
function readMemorySearchVectorExtensionPath(config, agentId) {
	const raw = firstDefined(readNestedStoreLayers(config, agentId, "vector"), "extensionPath");
	return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
function readMemorySearchVectorEnabled(config, agentId) {
	if (readMemorySearchProvider(config, agentId) === "none") return false;
	const raw = firstDefined(readNestedStoreLayers(config, agentId, "vector"), "enabled");
	return typeof raw === "boolean" ? raw : true;
}
function readMemorySearchProvider(config, agentId) {
	const raw = firstDefined(readMemorySearchLayers(config, agentId), "provider");
	return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
function readLegacyMemorySearchStorePaths(config, agentId) {
	return [...new Set(readStoreLayers(config, agentId).flatMap((store) => typeof store.path === "string" && store.path.trim() ? [store.path.trim()] : []))];
}
function readMemorySearchFtsTokenizer(config, agentId) {
	const raw = firstDefined(readNestedStoreLayers(config, agentId, "fts"), "tokenizer");
	return raw === "unicode61" || raw === "trigram" ? raw : void 0;
}
async function collectLegacyMemorySidecarSources(params) {
	const { resolveOpenClawAgentSqlitePath } = await import("../../plugin-sdk/sqlite-runtime.js");
	const agentIds = new Set(resolveConfiguredAgentIds(params.config));
	const legacyDir = path.join(params.stateDir, "memory");
	const retrySidecars = [];
	try {
		const entries = await fs$1.readdir(legacyDir, { withFileTypes: true });
		for (const entry of entries) if (entry.isFile() && entry.name.endsWith(".sqlite")) {
			const stem = entry.name.slice(0, -7);
			const retryIndex = stem.indexOf(".retry-");
			const rawAgentId = retryIndex === -1 ? stem : stem.slice(0, retryIndex);
			const agentId = normalizeAgentId(rawAgentId);
			if (retryIndex !== -1 && rawAgentId === agentId && agentIds.has(agentId)) retrySidecars.push({
				agentId,
				legacyPath: path.join(legacyDir, entry.name)
			});
		}
	} catch {}
	const migrationEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const sources = [];
	const seen = /* @__PURE__ */ new Set();
	async function addSource(agentId, legacyPath) {
		const normalizedPath = path.resolve(legacyPath);
		const key = `${agentId}\0${normalizedPath}`;
		if (seen.has(key) || !await legacyStateFileExists(normalizedPath)) return;
		seen.add(key);
		sources.push({
			agentId,
			legacyPath: normalizedPath,
			stateDir: params.stateDir,
			agentDatabasePath: resolveOpenClawAgentSqlitePath({
				agentId,
				env: migrationEnv
			})
		});
	}
	for (const agentId of agentIds) {
		for (const configuredPath of readLegacyMemorySearchStorePaths(params.config, agentId)) await addSource(agentId, resolveUserPath(configuredPath.replaceAll("{agentId}", agentId), migrationEnv));
		await addSource(agentId, path.join(legacyDir, `${agentId}.sqlite`));
	}
	for (const retrySidecar of retrySidecars) await addSource(retrySidecar.agentId, retrySidecar.legacyPath);
	return sources;
}
async function archiveLegacyMemorySidecar(params) {
	const existingSources = (await Promise.all(LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
		const filePath = `${params.source.legacyPath}${suffix}`;
		return await legacyStateFileExists(filePath) ? filePath : null;
	}))).filter((filePath) => filePath !== null);
	if (existingSources.length === 0) return;
	const existingArchives = (await Promise.all(existingSources.map(async (sourcePath) => {
		const archivedPath = `${sourcePath}.migrated`;
		return await legacyStateFileExists(archivedPath) ? archivedPath : null;
	}))).filter((filePath) => filePath !== null);
	if (existingArchives.length > 0) {
		params.warnings.push(`Left migrated Memory Core legacy memory index sidecar in place because ${existingArchives[0]} already exists`);
		return;
	}
	const renamed = [];
	for (const sourcePath of existingSources) {
		const archivedPath = `${sourcePath}.migrated`;
		try {
			await fs$1.rename(sourcePath, archivedPath);
			renamed.push({
				sourcePath,
				archivedPath
			});
		} catch (err) {
			for (const entry of renamed.toReversed()) try {
				if (await legacyStateFileExists(entry.archivedPath) && !await legacyStateFileExists(entry.sourcePath)) await fs$1.rename(entry.archivedPath, entry.sourcePath);
			} catch (rollbackErr) {
				params.warnings.push(`Failed restoring Memory Core legacy memory index sidecar ${entry.archivedPath}: ${String(rollbackErr)}`);
			}
			params.warnings.push(`Failed archiving Memory Core legacy memory index sidecar ${sourcePath}: ${String(err)}; restored ${renamed.length} already archived file(s)`);
			return;
		}
	}
	params.changes.push(`Archived Memory Core legacy memory index sidecar -> ${params.source.legacyPath}.migrated`);
}
async function preserveLegacyMemorySidecarRetryPath(params) {
	const retryPath = path.join(params.source.stateDir, "memory", `${params.source.agentId}.sqlite`);
	if (path.resolve(retryPath) === path.resolve(params.source.legacyPath)) return;
	const resolvedSourcePath = path.resolve(params.source.legacyPath);
	const sourceName = path.basename(resolvedSourcePath);
	if (path.dirname(resolvedSourcePath) === path.resolve(params.source.stateDir, "memory") && sourceName.startsWith(`${params.source.agentId}.retry-`) && sourceName.endsWith(".sqlite")) return;
	const targetBasePath = (await Promise.all(LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
		const targetPath = `${retryPath}${suffix}`;
		return await legacyStateFileExists(targetPath) ? targetPath : null;
	}))).filter((targetPath) => targetPath !== null).length === 0 ? retryPath : path.join(params.source.stateDir, "memory", `${params.source.agentId}.retry-${crypto.createHash("sha256").update(path.resolve(params.source.legacyPath)).digest("hex").slice(0, 12)}.sqlite`);
	if (await legacyStateFileExists(targetBasePath)) return;
	const existingSources = (await Promise.all(LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
		const sourcePath = `${params.source.legacyPath}${suffix}`;
		return await legacyStateFileExists(sourcePath) ? {
			sourcePath,
			targetPath: `${targetBasePath}${suffix}`
		} : null;
	}))).filter((entry) => entry !== null);
	if (existingSources.length === 0) return;
	await fs$1.mkdir(path.dirname(targetBasePath), { recursive: true });
	const copied = [];
	try {
		for (const entry of existingSources) {
			await fs$1.copyFile(entry.sourcePath, entry.targetPath, fs$1.constants.COPYFILE_EXCL);
			copied.push(entry.targetPath);
		}
	} catch (err) {
		for (const targetPath of copied) try {
			await fs$1.rm(targetPath, { force: true });
		} catch {}
		params.warnings.push(`Failed copying Memory Core legacy memory index sidecar retry path ${params.source.legacyPath} -> ${retryPath}: ${String(err)}`);
		return;
	}
	params.changes.push(`Copied Memory Core legacy memory index sidecar retry path -> ${targetBasePath}`);
}
/**
* List the sidecar files when every persisted byte is absent: the main file is
* zero bytes and no WAL/journal sidecar holds content. Returns null when any
* file carries bytes, because WAL frames alone can contain legacy rows.
*/
async function listEmptyLegacySidecarFiles(legacyPath) {
	const emptyFiles = [];
	for (const suffix of LEGACY_MEMORY_SIDECAR_SUFFIXES) {
		const candidate = `${legacyPath}${suffix}`;
		try {
			const stat = await fs$1.stat(candidate);
			if (!stat.isFile()) continue;
			if (stat.size > 0) return null;
			emptyFiles.push(candidate);
		} catch (err) {
			if (err.code !== "ENOENT") return null;
		}
	}
	return emptyFiles.length > 0 ? emptyFiles : null;
}
async function migrateLegacyMemorySidecarSource(params) {
	const { ensureMemoryIndexSchema, loadSqliteVecExtension } = await import("../../plugin-sdk/memory-core-host-engine-schema.js");
	const { ensureOpenClawAgentDatabaseSchema, openNodeSqliteDatabase } = await import("../../plugin-sdk/sqlite-runtime.js");
	const emptySidecarFiles = await listEmptyLegacySidecarFiles(params.source.legacyPath);
	if (emptySidecarFiles) {
		let removedAll = true;
		for (const emptyPath of emptySidecarFiles) try {
			await fs$1.rm(emptyPath, { force: true });
		} catch {
			removedAll = false;
		}
		if (removedAll) {
			params.changes.push(`Removed empty Memory Core legacy memory index sidecar placeholder: ${params.source.legacyPath}`);
			return { archiveReady: false };
		}
	}
	await fs$1.mkdir(path.dirname(params.source.agentDatabasePath), { recursive: true });
	const db = openNodeSqliteDatabase(params.source.agentDatabasePath, { allowExtension: true });
	try {
		const migrationEnv = {
			...params.env,
			OPENCLAW_STATE_DIR: params.source.stateDir
		};
		ensureOpenClawAgentDatabaseSchema(db, {
			agentId: params.source.agentId,
			env: migrationEnv,
			path: params.source.agentDatabasePath,
			register: true
		});
		const ftsTokenizer = readMemorySearchFtsTokenizer(params.config, params.source.agentId);
		ensureMemoryIndexSchema({
			db,
			cacheEnabled: true,
			ftsEnabled: true,
			ftsTokenizer
		});
		const vectorEnabled = readMemorySearchVectorEnabled(params.config, params.source.agentId);
		const vectorExtensionPath = vectorEnabled ? readMemorySearchVectorExtensionPath(params.config, params.source.agentId) : void 0;
		const loadedVector = vectorEnabled ? await loadSqliteVecExtension({
			db,
			extensionPath: vectorExtensionPath ? resolveUserPath(vectorExtensionPath, params.env) : void 0
		}) : {
			ok: false,
			error: "vector search is disabled"
		};
		let result;
		try {
			result = importLegacyMemorySidecarIndex({
				db,
				legacySidecarDatabasePath: params.source.legacyPath,
				copyVectorRows: vectorEnabled && loadedVector.ok,
				requireVectorRows: vectorEnabled
			});
		} catch (err) {
			if (err instanceof LegacyMemoryDerivedRowsConflictError) {
				params.changes.push(`Resolved Memory Core legacy memory index conflict for agent ${params.source.agentId} by keeping canonical per-agent SQLite rows`);
				return { archiveReady: true };
			}
			await preserveLegacyMemorySidecarRetryPath(params);
			params.warnings.push(`Skipped Memory Core legacy memory index import for agent ${params.source.agentId} because legacy rows could not be imported: ${String(err)}`);
			return { archiveReady: false };
		}
		if (result.reason === "legacy-schema-missing") {
			await preserveLegacyMemorySidecarRetryPath(params);
			params.warnings.push(`Skipped Memory Core legacy memory index import for agent ${params.source.agentId} because the sidecar schema is not a legacy memory index`);
			return { archiveReady: false };
		}
		if (!result.imported) {
			await preserveLegacyMemorySidecarRetryPath(params);
			return { archiveReady: false };
		}
		ensureMemoryIndexSchema({
			db,
			cacheEnabled: true,
			ftsEnabled: true,
			ftsTokenizer
		});
		params.changes.push(`Migrated Memory Core legacy memory index for agent ${params.source.agentId} -> per-agent SQLite (${result.sources} source(s), ${result.chunks} chunk(s), ${result.cacheEntries} cache row(s))`);
		if (!result.vectorEntriesImported) {
			await preserveLegacyMemorySidecarRetryPath(params);
			const vectorReason = loadedVector.ok ? "legacy vector table could not be validated" : loadedVector.error ?? "unknown sqlite-vec load error";
			params.warnings.push(`Left Memory Core legacy memory index sidecar in place for agent ${params.source.agentId} because ${formatLegacyVectorRows(result.vectorEntries)} still require sqlite-vec: ${vectorReason}`);
			return { archiveReady: false };
		}
		return { archiveReady: true };
	} finally {
		db.close();
	}
}
function groupLegacyMemorySidecarSourcesByPath(sources) {
	const groups = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const group = groups.get(source.legacyPath) ?? [];
		group.push(source);
		groups.set(source.legacyPath, group);
	}
	return [...groups.values()];
}
const memorySidecarStateMigration = {
	id: "memory-core-legacy-sidecar-index-to-agent-sqlite",
	label: "Memory Core legacy memory index sidecar",
	async detectLegacyState(params) {
		const sources = await collectLegacyMemorySidecarSources({
			config: params.config,
			env: params.env,
			stateDir: params.stateDir
		});
		if (sources.length === 0) return null;
		return { preview: sources.map((source) => `- Memory Core legacy memory index: ${source.legacyPath} -> ${source.agentDatabasePath}`) };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const groups = groupLegacyMemorySidecarSourcesByPath(await collectLegacyMemorySidecarSources({
			config: params.config,
			env: params.env,
			stateDir: params.stateDir
		}));
		for (const sources of groups) {
			let archiveReady = true;
			for (const source of sources) try {
				const result = await migrateLegacyMemorySidecarSource({
					source,
					config: params.config,
					env: params.env,
					changes,
					warnings
				});
				archiveReady &&= result.archiveReady;
			} catch (err) {
				archiveReady = false;
				await preserveLegacyMemorySidecarRetryPath({
					source,
					changes,
					warnings
				});
				warnings.push(`Skipped Memory Core legacy memory index import for agent ${source.agentId} because the sidecar could not be imported: ${String(err)}`);
			}
			if (archiveReady && sources[0]) await archiveLegacyMemorySidecar({
				source: sources[0],
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
};
const RETIRED_QMD_GLOBAL_LOCK_NAME = "embed.lock.lock";
const RETIRED_QMD_AGENT_LOCK_NAME = "qmd-write.lock.lock";
async function readDirectoryEntries(directoryPath) {
	try {
		return (await fs$1.readdir(directoryPath, { withFileTypes: true })).toSorted((left, right) => left.name.localeCompare(right.name));
	} catch {
		return [];
	}
}
async function collectRetiredQmdFileLocks(stateDir) {
	const stateEntries = await readDirectoryEntries(stateDir);
	const lockPaths = [];
	if (stateEntries.some((entry) => entry.name === "qmd" && entry.isDirectory())) {
		const qmdDir = path.join(stateDir, "qmd");
		if ((await readDirectoryEntries(qmdDir)).some((entry) => entry.name === RETIRED_QMD_GLOBAL_LOCK_NAME && entry.isFile())) lockPaths.push(path.join(qmdDir, RETIRED_QMD_GLOBAL_LOCK_NAME));
	}
	if (!stateEntries.some((entry) => entry.name === "agents" && entry.isDirectory())) return lockPaths;
	const agentsDir = path.join(stateDir, "agents");
	for (const entry of await readDirectoryEntries(agentsDir)) {
		if (!entry.isDirectory() || entry.name !== normalizeAgentId(entry.name)) continue;
		const agentDir = path.join(agentsDir, entry.name);
		if ((await readDirectoryEntries(agentDir)).some((agentEntry) => agentEntry.name === RETIRED_QMD_AGENT_LOCK_NAME && agentEntry.isFile())) lockPaths.push(path.join(agentDir, RETIRED_QMD_AGENT_LOCK_NAME));
	}
	return lockPaths;
}
async function collectRetiredQmdWorkspaceHomes(stateDir) {
	const agentsDir = path.join(stateDir, "agents");
	const homes = [];
	for (const entry of await readDirectoryEntries(agentsDir)) {
		if (!entry.isDirectory() || entry.name !== normalizeAgentId(entry.name)) continue;
		const agentDir = path.join(agentsDir, entry.name);
		if ((await readDirectoryEntries(agentDir)).some((candidate) => candidate.name === "qmd" && candidate.isDirectory())) homes.push(path.join(agentDir, "qmd"));
	}
	return homes;
}
const qmdWorkspaceStateMigration = {
	id: "memory-core-qmd-workspace-retired",
	label: "Memory Core retired QMD workspaces",
	doctorOnly: true,
	async detectLegacyState(params) {
		const homes = await collectRetiredQmdWorkspaceHomes(params.stateDir);
		if (homes.length === 0) return null;
		return { preview: homes.map((home) => `- Retired Memory Core QMD workspace: ${home} -> remove derived index, config, cache, and session-export artifacts`) };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		for (const home of await collectRetiredQmdWorkspaceHomes(params.stateDir)) try {
			await fs$1.rm(home, {
				recursive: true,
				force: true
			});
			changes.push(`Removed retired Memory Core QMD workspace: ${home}`);
		} catch (err) {
			warnings.push(`Failed removing retired Memory Core QMD workspace ${home}: ${String(err)}`);
		}
		return {
			changes,
			warnings
		};
	}
};
const qmdLocksStateMigration = {
	id: "memory-core-qmd-file-locks-to-sqlite-leases",
	label: "Memory Core retired QMD file locks",
	async detectLegacyState(params) {
		const lockPaths = await collectRetiredQmdFileLocks(params.stateDir);
		if (lockPaths.length === 0) return null;
		return { preview: lockPaths.map((lockPath) => `- Retired Memory Core QMD file lock: ${lockPath} -> remove only if definitely stale (coordination now uses SQLite leases)`) };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		for (const lockPath of await collectRetiredQmdFileLocks(params.stateDir)) try {
			const result = await reclaimDefinitelyStaleFileLock(lockPath);
			if (result === "removed") changes.push(`Removed retired Memory Core QMD file lock: ${lockPath}`);
			else if (result === "retained") warnings.push(`Retained retired Memory Core QMD file lock because its owner is live or ambiguous: ${lockPath}`);
		} catch (err) {
			warnings.push(`Failed removing retired Memory Core QMD file lock ${lockPath}: ${String(err)}`);
		}
		return {
			changes,
			warnings
		};
	}
};
//#endregion
//#region extensions/memory-core/src/migration/doctor-vector-index-provider.ts
const inspectConfiguredProvider = async (params) => {
	const [{ resolveAgentConfig }, foundation] = await Promise.all([import("../../plugin-sdk/agent-runtime.js"), import("../../plugin-sdk/memory-core-host-engine-foundation.js")]);
	let settings;
	try {
		settings = foundation.resolveMemorySearchConfig(params.config, params.agentId);
	} catch (error) {
		return {
			provider: params.config.memory?.search?.provider ?? "openai",
			reason: formatErrorMessage(error)
		};
	}
	if (!settings || settings.provider === "none") return null;
	const [embeddings, providerState] = await Promise.all([import("../../embeddings-MvTdWgzh.js"), import("../../manager-provider-state-C8CTXQBs.js")]);
	try {
		const configuredAgentDir = resolveAgentConfig(params.config, params.agentId)?.agentDir?.trim();
		const result = await embeddings.createEmbeddingProvider({
			config: params.config,
			agentDir: configuredAgentDir ? foundation.resolveUserPath(configuredAgentDir, params.env) : path.dirname(params.agentDatabasePath),
			...providerState.resolveMemoryPrimaryProviderRequest({ settings })
		});
		await result.provider?.close?.();
		return result.provider ? null : {
			provider: settings.provider,
			reason: result.providerUnavailableReason ?? "provider did not initialize"
		};
	} catch (error) {
		return {
			provider: settings.provider,
			reason: formatErrorMessage(error)
		};
	}
};
//#endregion
//#region extensions/memory-core/doctor-contract-api.ts
const stateMigrations = [
	hostEventsStateMigration,
	dreamingStateMigration,
	memorySidecarStateMigration,
	qmdWorkspaceStateMigration,
	qmdLocksStateMigration,
	createVectorIndexProviderDiagnostic(inspectConfiguredProvider)
];
//#endregion
export { stateMigrations };
