import { N as resolveOptionalIntegerOption } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as writeExternalFileWithinRoot, t as ensureAbsoluteDirectory } from "./fs-safe-C9N8pCh1.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, v as iterateSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { a as sha256Hex, i as sha256File } from "./crypto-digest-PR8Utwzg.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-CeJDDzqq.js";
import { t as removePathWithinRoot } from "./fs-safe-remove-DW6J9gUb.js";
import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/transcripts/sqlite-schema.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const MEETING_TRANSCRIPTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS meeting_transcript_sessions (
  session_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  selector TEXT NOT NULL UNIQUE,
  export_key TEXT NOT NULL,
  session_slug TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  title TEXT,
  source_json TEXT NOT NULL,
  stopped_at TEXT,
  metadata_json TEXT,
  export_manifest_json TEXT NOT NULL DEFAULT '{}',
  export_pending_json TEXT NOT NULL DEFAULT '[]',
  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, started_at)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started
  ON meeting_transcript_sessions(started_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id
  ON meeting_transcript_sessions(session_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug
  ON meeting_transcript_sessions(session_slug, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key
  ON meeting_transcript_sessions(export_key);

CREATE TABLE IF NOT EXISTS meeting_transcript_utterances (
  session_id TEXT NOT NULL,
  session_started_at TEXT NOT NULL,
  sequence INTEGER NOT NULL CHECK (sequence >= 0),
  utterance_id TEXT,
  started_at TEXT,
  ended_at TEXT,
  speaker_id TEXT,
  speaker_label TEXT,
  text TEXT NOT NULL,
  final INTEGER CHECK (final IN (0, 1)),
  metadata_json TEXT,
  PRIMARY KEY (session_id, session_started_at, sequence),
  FOREIGN KEY (session_id, session_started_at)
    REFERENCES meeting_transcript_sessions(session_id, started_at)
    ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS meeting_transcript_summaries (
  session_id TEXT NOT NULL,
  session_started_at TEXT NOT NULL,
  generated_at TEXT,
  summary_json TEXT,
  markdown TEXT,
  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),
  PRIMARY KEY (session_id, session_started_at),
  FOREIGN KEY (session_id, session_started_at)
    REFERENCES meeting_transcript_sessions(session_id, started_at)
    ON DELETE CASCADE,
  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)
) STRICT;
`;
function ensureMeetingTranscriptsSchema(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => db.exec(MEETING_TRANSCRIPTS_SCHEMA_SQL), options, { operationLabel: "meeting-transcripts.schema.ensure" });
	ensuredDatabases.add(database.db);
}
//#endregion
//#region src/transcripts/store-artifacts.ts
const TRANSCRIPT_EXPORT_FILE_NAMES = /* @__PURE__ */ new Set([
	"metadata.json",
	"summary.json",
	"summary.md",
	"transcript.jsonl"
]);
function safeTranscriptPathSegment(value) {
	const segment = value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
	if (segment === ".") return "%2E";
	if (segment === "..") return "%2E%2E";
	if (!segment) return "session";
	if (segment.endsWith(".") || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu.test(segment)) return Buffer.from(segment, "utf8").toString("hex").match(/.{2}/gu).map((byte) => `%${byte.toUpperCase()}`).join("");
	return segment;
}
function legacyTranscriptPathSegment(value) {
	return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "session";
}
function dateSegment(value) {
	return value?.match(/^(\d{4}-\d{2}-\d{2})T/)?.[1] ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function transcriptSessionSelector(session) {
	return `${dateSegment(session.startedAt)}/${safeTranscriptPathSegment(session.sessionId)}`;
}
function legacyTranscriptSessionSelector(session) {
	const date = dateSegment(session.startedAt);
	const segment = legacyTranscriptPathSegment(session.sessionId);
	if (segment === ".") return date;
	if (segment === "..") return ".";
	return `${date}/${segment}`;
}
function transcriptSessionExportKey(session) {
	return transcriptSessionSelector(session).toLowerCase();
}
function normalizeExportText(value) {
	return value.endsWith("\n") ? value : `${value}\n`;
}
async function writeTranscriptArtifact(rootDir, fileName, content) {
	await writeExternalFileWithinRoot({
		rootDir,
		path: fileName,
		write: async (tempPath) => await fs$1.writeFile(tempPath, content, { mode: 384 })
	});
	return sha256Hex(content);
}
async function removeTranscriptArtifact(rootDir, fileName) {
	await removePathWithinRoot({
		rootDir,
		relativePath: fileName,
		force: true
	});
}
async function isCaseSensitiveDirectory(directory) {
	const probeName = `.openclaw-case-probe-${randomUUID().toLowerCase()}`;
	const probePath = path.join(directory, probeName);
	const alternatePath = path.join(directory, probeName.toUpperCase());
	await (await fs$1.open(probePath, "wx", 384)).close();
	try {
		try {
			await fs$1.access(alternatePath);
			return false;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
			throw error;
		}
	} finally {
		await fs$1.rm(probePath, { force: true });
	}
}
//#endregion
//#region src/transcripts/store-sqlite.ts
function meetingTranscriptDb(db) {
	return getNodeSqliteKysely(db);
}
function meetingTranscriptSessionQuery(database, session) {
	return meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt);
}
function meetingTranscriptUtteranceQuery(database, session) {
	return meetingTranscriptDb(database).selectFrom("meeting_transcript_utterances").where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt);
}
function hasExactMeetingTranscriptUtterance(params) {
	const rows = executeSqliteQuerySync(params.database, meetingTranscriptUtteranceQuery(params.database, params.session).selectAll().where("utterance_id", "=", params.utterance.id)).rows;
	const utterance = params.utterance;
	return rows.some((row) => row.started_at === (utterance.startedAt ?? null) && row.ended_at === (utterance.endedAt ?? null) && row.speaker_id === (utterance.speaker?.id ?? null) && row.speaker_label === (utterance.speaker?.label ?? null) && row.text === utterance.text && row.final === (utterance.final === void 0 ? null : utterance.final ? 1 : 0) && row.metadata_json === params.metadataJson);
}
function appendMeetingTranscriptUtterance(params) {
	const { database, session, utterance } = params;
	const db = meetingTranscriptDb(database);
	if (utterance.id && hasExactMeetingTranscriptUtterance({
		database,
		metadataJson: params.metadataJson,
		session,
		utterance: {
			...utterance,
			id: utterance.id
		}
	})) return;
	const stored = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select("next_utterance_seq"));
	if (!stored) throw new Error(`transcripts session not found: ${session.sessionId}`);
	const sequence = stored.next_utterance_seq;
	executeSqliteQuerySync(database, db.insertInto("meeting_transcript_utterances").values({
		session_id: session.sessionId,
		session_started_at: session.startedAt,
		sequence,
		utterance_id: utterance.id ?? null,
		started_at: utterance.startedAt ?? null,
		ended_at: utterance.endedAt ?? null,
		speaker_id: utterance.speaker?.id ?? null,
		speaker_label: utterance.speaker?.label ?? null,
		text: utterance.text,
		final: utterance.final === void 0 ? null : utterance.final ? 1 : 0,
		metadata_json: params.metadataJson
	}));
	executeSqliteQuerySync(database, db.updateTable("meeting_transcript_sessions").set({
		next_utterance_seq: sequence + 1,
		updated_at_ms: params.now
	}).where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt));
}
function parseOptionalJsonRecord(value) {
	if (!value) return;
	return asOptionalRecord(JSON.parse(value));
}
function sessionFromRow(row) {
	const source = parseOptionalJsonRecord(row.source_json);
	const metadata = parseOptionalJsonRecord(row.metadata_json);
	if (!source || typeof source.providerId !== "string") throw new Error(`invalid meeting transcript source for ${row.session_id}`);
	return {
		sessionId: row.session_id,
		source,
		startedAt: row.started_at,
		...row.title !== null ? { title: row.title } : {},
		...row.stopped_at !== null ? { stoppedAt: row.stopped_at } : {},
		...metadata ? { metadata } : {}
	};
}
function utteranceFromRow(row) {
	const speaker = row.speaker_label !== null ? {
		label: row.speaker_label,
		...row.speaker_id !== null ? { id: row.speaker_id } : {}
	} : void 0;
	const metadata = parseOptionalJsonRecord(row.metadata_json);
	return {
		sessionId: row.session_id,
		text: row.text,
		...row.utterance_id !== null ? { id: row.utterance_id } : {},
		...row.started_at !== null ? { startedAt: row.started_at } : {},
		...row.ended_at !== null ? { endedAt: row.ended_at } : {},
		...speaker ? { speaker } : {},
		...row.final === null ? {} : { final: row.final === 1 },
		...metadata ? { metadata } : {}
	};
}
function summaryFromRow(row) {
	return row.summary_json ? JSON.parse(row.summary_json) : void 0;
}
//#endregion
//#region src/transcripts/store-export-jsonl.ts
const TRANSCRIPT_EXPORT_ROW_BATCH_SIZE = 64;
async function writeTranscriptJsonlArtifact(params) {
	ensureMeetingTranscriptsSchema(params.databaseOptions);
	const database = openOpenClawStateDatabase(params.databaseOptions);
	const sequenceHead = executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptSessionQuery(database.db, params.session).select("next_utterance_seq"))?.next_utterance_seq;
	if (sequenceHead === void 0) throw new Error(`transcripts session not found: ${params.session.sessionId}`);
	const digest = createHash("sha256");
	await writeExternalFileWithinRoot({
		rootDir: params.sessionDir,
		path: "transcript.jsonl",
		write: async (tempPath) => {
			const handle = await fs$1.open(tempPath, "w", 384);
			try {
				let nextSequence = 0;
				while (nextSequence < sequenceHead) {
					const rows = executeSqliteQuerySync(database.db, meetingTranscriptUtteranceQuery(database.db, params.session).selectAll().where("sequence", ">=", nextSequence).where("sequence", "<", sequenceHead).orderBy("sequence", "asc").limit(TRANSCRIPT_EXPORT_ROW_BATCH_SIZE)).rows;
					if (rows.length === 0) break;
					nextSequence = rows.at(-1).sequence + 1;
					const lines = rows.map((row) => `${JSON.stringify(utteranceFromRow(row))}\n`);
					for (const line of lines) {
						await handle.writeFile(line);
						digest.update(line);
					}
				}
			} finally {
				await handle.close();
			}
		}
	});
	return digest.digest("hex");
}
//#endregion
//#region src/transcripts/store-export-ownership.ts
function database(options) {
	ensureMeetingTranscriptsSchema(options);
	return openOpenClawStateDatabase(options);
}
async function transcriptArtifactsMatchOwner(sessionDir, artifacts, owner) {
	const manifest = JSON.parse(owner.export_manifest_json);
	const pending = new Set(JSON.parse(owner.export_pending_json));
	for (const { entry, canonicalName } of artifacts) {
		const artifactPath = path.join(sessionDir, entry.name);
		const stat = await fs$1.lstat(artifactPath);
		const expectedHash = manifest[canonicalName];
		if (stat.isSymbolicLink() || !stat.isFile() || pending.has(canonicalName) || !expectedHash || await sha256File(artifactPath) !== expectedHash) return false;
	}
	return artifacts.length > 0;
}
async function assertTranscriptExportPathAvailable(params) {
	const stateDatabase = database(params.databaseOptions);
	const collisions = executeSqliteQuerySync(stateDatabase.db, meetingTranscriptDb(stateDatabase.db).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"selector",
		"export_pending_json"
	]).where("export_key", "=", transcriptSessionExportKey(params.session)).orderBy("selector", "asc")).rows;
	if (collisions.length <= 1) return;
	const ensured = await ensureAbsoluteDirectory(params.exportRootDir, {
		mode: 448,
		scopeLabel: "transcript export root"
	});
	if (!ensured.ok) throw ensured.error;
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return;
	let ownerSelector;
	try {
		const metadata = JSON.parse(await fs$1.readFile(path.join(params.exportRootDir, collisions[0].selector, "metadata.json"), "utf8"));
		ownerSelector = collisions.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt)?.selector;
	} catch (error) {
		if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
			if (!(error instanceof SyntaxError)) throw error;
		}
	}
	if (!ownerSelector) {
		const pendingOwners = collisions.filter((row) => JSON.parse(row.export_pending_json).includes("metadata.json"));
		if (pendingOwners.length === 1) ownerSelector = pendingOwners[0]?.selector;
	}
	ownerSelector ??= transcriptSessionSelector(params.session);
	if (ownerSelector !== transcriptSessionSelector(params.session)) throw new Error(`transcript export path collides case-insensitively with another session: ${path.join(params.exportRootDir, transcriptSessionSelector(params.session))}`);
}
async function hasAliasedCanonicalTranscriptExportPathOwner(params) {
	const stateDatabase = database(params.databaseOptions);
	const owners = executeSqliteQuerySync(stateDatabase.db, meetingTranscriptDb(stateDatabase.db).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"export_manifest_json",
		"export_pending_json"
	]).where("export_key", "=", transcriptSessionExportKey(params.session)).orderBy("selector", "asc")).rows;
	if (owners.length === 0) return false;
	try {
		await fs$1.access(params.exportRootDir);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return false;
		throw error;
	}
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return false;
	const sessionDir = path.join(params.exportRootDir, transcriptSessionSelector(params.session));
	let entries;
	try {
		entries = await fs$1.readdir(sessionDir, { withFileTypes: true });
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
		throw error;
	}
	const artifactCaseSensitive = await isCaseSensitiveDirectory(sessionDir);
	const artifacts = entries.flatMap((entry) => {
		const canonicalName = artifactCaseSensitive ? entry.name : entry.name.toLowerCase();
		return TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName) ? [{
			entry,
			canonicalName
		}] : [];
	});
	if (artifacts.length === 0) return true;
	let owner;
	const metadataArtifact = artifacts.find(({ canonicalName }) => canonicalName === "metadata.json");
	if (metadataArtifact) {
		const metadataPath = path.join(sessionDir, metadataArtifact.entry.name);
		const metadataStat = await fs$1.lstat(metadataPath);
		if (metadataStat.isSymbolicLink() || !metadataStat.isFile()) return false;
		let handle;
		try {
			handle = await fs$1.open(metadataPath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
			const metadata = JSON.parse(await handle.readFile("utf8"));
			owner = owners.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt);
		} catch {
			return false;
		} finally {
			await handle?.close();
		}
	}
	if (!owner && !metadataArtifact) {
		const manifestMatches = [];
		for (const candidate of owners) if (await transcriptArtifactsMatchOwner(sessionDir, artifacts, candidate)) manifestMatches.push(candidate);
		owner = manifestMatches.length === 1 ? manifestMatches[0] : void 0;
	}
	return owner !== void 0 && await transcriptArtifactsMatchOwner(sessionDir, artifacts, owner);
}
//#endregion
//#region src/transcripts/summary.ts
const ACTION_PATTERNS = /\b(todo|action|follow up|follow-up|assign|owner|next step|ship|fix|send|schedule)\b/i;
const DECISION_PATTERNS = /\b(decided|decision|we will|we'll|agreed|approved|go with|ship it)\b/i;
const RISK_PATTERNS = /\b(risk|blocked|blocker|concern|issue|problem|unknown|deadline|privacy|security)\b/i;
function firstSentences(utterances, limit) {
	return normalizeStringEntries((normalizeStringEntries(utterances.map((utterance) => utterance.text)).join(" ").match(/[^.!?]+[.!?]?/g) ?? []).slice(0, limit)).join(" ");
}
function collectMatches(utterances, pattern) {
	return utterances.filter((utterance) => pattern.test(utterance.text)).map(formatSpeakerLine).filter(Boolean).slice(0, 12);
}
function sanitizeUtterance(utterance) {
	const sanitized = {
		...utterance,
		text: sanitizeTerminalText(utterance.text)
	};
	if (utterance.speaker) sanitized.speaker = {
		...utterance.speaker,
		label: sanitizeTerminalText(utterance.speaker.label)
	};
	return sanitized;
}
function formatSpeakerLine(utterance) {
	const text = utterance.text.trim();
	if (!text) return "";
	const speaker = utterance.speaker?.label?.trim();
	return speaker ? `${speaker}: ${text}` : text;
}
function formatTranscript(utterances) {
	return utterances.map(formatSpeakerLine).filter(Boolean);
}
/** Build a deterministic summary from transcript utterances. */
function summarizeTranscripts(params) {
	const title = sanitizeTerminalText(params.session.title ?? "").trim() || "Transcripts";
	const utterances = params.utterances.map(sanitizeUtterance);
	const overview = firstSentences(utterances, 4) || "No transcript captured yet.";
	return {
		sessionId: params.session.sessionId,
		title,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		overview,
		transcript: formatTranscript(utterances),
		decisions: collectMatches(utterances, DECISION_PATTERNS),
		actionItems: collectMatches(utterances, ACTION_PATTERNS),
		risks: collectMatches(utterances, RISK_PATTERNS),
		utteranceCount: params.utterances.length
	};
}
function renderList(items) {
	return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None captured";
}
/** Render a transcript summary as markdown for local artifacts. */
function renderTranscriptsMarkdown(summary) {
	return [
		`# ${summary.title}`,
		"",
		`Generated: ${summary.generatedAt}`,
		`Session: ${sanitizeTerminalText(summary.sessionId)}`,
		"",
		"## Overview",
		summary.overview,
		"",
		"## Transcript",
		renderList(summary.transcript),
		"",
		"## Decisions",
		renderList(summary.decisions),
		"",
		"## Action Items",
		renderList(summary.actionItems),
		"",
		"## Risks",
		renderList(summary.risks),
		"",
		`Transcript utterances: ${summary.utteranceCount}`
	].join("\n");
}
//#endregion
//#region src/transcripts/store.ts
/** Canonical meeting-capture transcript store. Files are explicit exports only. */
var TranscriptsStore = class {
	constructor(exportRootDir, databaseOptions = {}) {
		this.exportRootDir = exportRootDir;
		this.databaseOptions = databaseOptions;
	}
	database() {
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		return openOpenClawStateDatabase(this.databaseOptions);
	}
	transaction(operationLabel, operation) {
		runOpenClawStateWriteTransaction(operation, this.databaseOptions, { operationLabel });
	}
	sessionDir(session) {
		return path.join(this.exportRootDir, transcriptSessionSelector(session));
	}
	entryFromRow(row, hasSummary) {
		const session = sessionFromRow(row);
		const sessionDir = this.sessionDir(session);
		return {
			session,
			sessionDir,
			selector: row.selector,
			summaryPath: path.join(sessionDir, "summary.md"),
			hasSummary
		};
	}
	readSummaryKeys(database) {
		const rows = executeSqliteQuerySync(database.db, meetingTranscriptDb(database.db).selectFrom("meeting_transcript_summaries").select(["session_id", "session_started_at"])).rows;
		return new Set(rows.map((row) => `${row.session_id}\0${row.session_started_at}`));
	}
	hasSummary(database, row) {
		return Boolean(executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptDb(database.db).selectFrom("meeting_transcript_summaries").select("session_id").where("session_id", "=", row.session_id).where("session_started_at", "=", row.started_at).limit(1)));
	}
	readExportOwnership(session) {
		const database = this.database();
		const row = executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptSessionQuery(database.db, session).select(["export_manifest_json", "export_pending_json"]));
		return row ? {
			manifest: JSON.parse(row.export_manifest_json),
			pending: new Set(JSON.parse(row.export_pending_json))
		} : {
			manifest: {},
			pending: /* @__PURE__ */ new Set()
		};
	}
	readSessionByIdentity(session) {
		const database = this.database();
		const row = executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptSessionQuery(database.db, session).selectAll());
		return row ? sessionFromRow(row) : void 0;
	}
	transcriptRows(session) {
		const database = this.database();
		return {
			database,
			query: meetingTranscriptUtteranceQuery(database.db, session).selectAll().orderBy("sequence", "asc")
		};
	}
	transcriptJsonlDigest(session) {
		const { database, query } = this.transcriptRows(session);
		const digest = createHash("sha256");
		for (const row of iterateSqliteQuerySync(database.db, query)) digest.update(`${JSON.stringify(utteranceFromRow(row))}\n`);
		return digest.digest("hex");
	}
	async expectedExportHashes(session) {
		const storedSession = this.readSessionByIdentity(session);
		if (!storedSession) return {};
		const hashes = {
			"metadata.json": sha256Hex(`${JSON.stringify(storedSession, null, 2)}\n`),
			"transcript.jsonl": this.transcriptJsonlDigest(storedSession)
		};
		const summary = await this.readSummary(storedSession);
		if (summary.summary) hashes["summary.json"] = sha256Hex(`${JSON.stringify(summary.summary, null, 2)}\n`);
		if (summary.markdown !== void 0) hashes["summary.md"] = sha256Hex(normalizeExportText(summary.markdown));
		return hashes;
	}
	updateExportState(session, operationLabel, update) {
		this.transaction(operationLabel, ({ db: database }) => {
			const stored = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select(["export_manifest_json", "export_pending_json"]));
			executeSqliteQuerySync(database, meetingTranscriptDb(database).updateTable("meeting_transcript_sessions").set(update(stored)).where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt));
		});
	}
	updateExportManifest(session, exportedHashes, removedExports = /* @__PURE__ */ new Set()) {
		this.updateExportState(session, "meeting-transcripts.export.record", (stored) => {
			const manifest = stored ? JSON.parse(stored.export_manifest_json) : {};
			const pending = new Set(stored ? JSON.parse(stored.export_pending_json) : []);
			for (const fileName of removedExports) delete manifest[fileName];
			for (const fileName of [...Object.keys(exportedHashes), ...removedExports]) pending.delete(fileName);
			return {
				export_manifest_json: JSON.stringify({
					...manifest,
					...exportedHashes
				}),
				export_pending_json: JSON.stringify([...pending].toSorted())
			};
		});
	}
	markPendingExports(session, fileNames) {
		this.updateExportState(session, "meeting-transcripts.export.pending", (stored) => {
			if (!stored) throw new Error(`transcripts session not found: ${session.sessionId}`);
			const pending = new Set(JSON.parse(stored.export_pending_json));
			for (const fileName of fileNames) pending.add(fileName);
			return { export_pending_json: JSON.stringify([...pending].toSorted()) };
		});
	}
	async assertExportDestinationOwned(session, sessionDir = this.sessionDir(session)) {
		let entries;
		try {
			entries = await fs$1.readdir(sessionDir, { withFileTypes: true });
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
			throw error;
		}
		const ownership = this.readExportOwnership(session);
		const caseSensitive = await isCaseSensitiveDirectory(sessionDir);
		let expectedHashes;
		const repairedHashes = {};
		for (const entry of entries) {
			const canonicalName = caseSensitive ? entry.name : entry.name.toLowerCase();
			if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName)) continue;
			const filePath = path.join(sessionDir, entry.name);
			const stat = await fs$1.lstat(filePath);
			if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run openclaw doctor --fix`);
			const actualHash = await sha256File(filePath);
			if (ownership.manifest[canonicalName] === actualHash || ownership.pending.has(canonicalName)) continue;
			expectedHashes ??= await this.expectedExportHashes(session);
			if (expectedHashes[canonicalName] !== actualHash) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run openclaw doctor --fix`);
			repairedHashes[canonicalName] = actualHash;
		}
		if (Object.keys(repairedHashes).length > 0) this.updateExportManifest(session, repairedHashes);
	}
	async listSessionEntries() {
		const database = this.database();
		const rows = executeSqliteQuerySync(database.db, meetingTranscriptDb(database.db).selectFrom("meeting_transcript_sessions").selectAll().orderBy("started_at", "desc").orderBy("session_id", "asc")).rows;
		const summaryKeys = this.readSummaryKeys(database);
		return rows.map((row) => this.entryFromRow(row, summaryKeys.has(`${row.session_id}\0${row.started_at}`)));
	}
	async writeSession(session) {
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		if (!this.readSessionByIdentity(session) && !await hasAliasedCanonicalTranscriptExportPathOwner({
			session,
			exportRootDir: this.exportRootDir,
			databaseOptions: this.databaseOptions
		})) {
			await this.assertExportDestinationOwned(session);
			const legacySessionDir = path.join(this.exportRootDir, legacyTranscriptSessionSelector(session));
			const legacyOwner = await this.readSession(legacyTranscriptSessionSelector(session));
			const legacyPathIsCanonical = legacyOwner !== void 0 && path.resolve(this.sessionDir(legacyOwner)) === path.resolve(legacySessionDir);
			if (path.resolve(legacySessionDir) !== path.resolve(this.sessionDir(session)) && !legacyPathIsCanonical) await this.assertExportDestinationOwned(session, legacySessionDir);
		}
		const sessionValues = {
			selector: transcriptSessionSelector(session),
			export_key: transcriptSessionExportKey(session),
			session_slug: safeTranscriptPathSegment(session.sessionId),
			provider_id: session.source.providerId,
			title: session.title ?? null,
			source_json: JSON.stringify(session.source),
			stopped_at: session.stoppedAt ?? null,
			metadata_json: session.metadata ? JSON.stringify(session.metadata) : null
		};
		const now = Date.now();
		this.transaction("meeting-transcripts.session.write", ({ db: database }) => {
			executeSqliteQuerySync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_sessions").values({
				session_id: session.sessionId,
				started_at: session.startedAt,
				...sessionValues,
				export_manifest_json: "{}",
				export_pending_json: "[]",
				next_utterance_seq: 0,
				created_at_ms: now,
				updated_at_ms: now
			}).onConflict((conflict) => conflict.columns(["session_id", "started_at"]).doUpdateSet({
				...sessionValues,
				updated_at_ms: now
			})));
		});
	}
	async readSession(sessionSelector) {
		return (await this.readSessionEntry(sessionSelector))?.session;
	}
	async readSessionEntry(sessionSelector) {
		const database = this.database();
		const db = meetingTranscriptDb(database.db);
		const qualified = /^\d{4}-\d{2}-\d{2}\//u.test(sessionSelector);
		const matchingRows = (column) => {
			let query = db.selectFrom("meeting_transcript_sessions").selectAll().where(column, "=", sessionSelector);
			if (column !== "selector") query = query.orderBy("started_at", "desc").limit(2);
			return executeSqliteQuerySync(database.db, query).rows;
		};
		const exactRows = matchingRows(qualified ? "selector" : "session_id");
		const slugRows = qualified ? [] : matchingRows("session_slug");
		const rows = [...new Map([...exactRows, ...slugRows].map((row) => [`${row.session_id}\0${row.started_at}`, row])).values()];
		if (rows.length > 1) throw new Error(`multiple transcripts sessions match ${sessionSelector}; use one of: ${rows.map((row) => row.selector).join(", ")}`);
		const row = rows[0];
		if (!row) return;
		return this.entryFromRow(row, this.hasSummary(database, row));
	}
	async appendUtteranceForSession(session, utterance) {
		const metadataJson = utterance.metadata ? JSON.stringify(utterance.metadata) : null;
		const now = Date.now();
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		this.transaction("meeting-transcripts.utterance.append", ({ db: database }) => appendMeetingTranscriptUtterance({
			database,
			metadataJson,
			now,
			session,
			utterance
		}));
	}
	async readUtterancesForSession(session, options = {}) {
		const database = this.database();
		const maxUtterances = resolveOptionalIntegerOption(options.maxUtterances, { min: 1 });
		const query = meetingTranscriptUtteranceQuery(database.db, session).selectAll();
		if (maxUtterances === void 0) return executeSqliteQuerySync(database.db, query.orderBy("sequence", "asc")).rows.map(utteranceFromRow);
		return executeSqliteQuerySync(database.db, query.orderBy("sequence", "desc").limit(maxUtterances)).rows.toReversed().map(utteranceFromRow);
	}
	async updateStopped(sessionSelector, stoppedAt) {
		const entry = await this.readSessionEntry(sessionSelector);
		if (!entry) return;
		await this.writeSession({
			...entry.session,
			stoppedAt
		});
	}
	async writeSummary(summary, session) {
		const resolved = session ?? await this.readSession(summary.sessionId);
		if (!resolved) throw new Error(`transcripts session not found: ${summary.sessionId}`);
		const summaryJson = JSON.stringify(summary);
		const markdown = renderTranscriptsMarkdown(summary);
		const summaryValues = {
			generated_at: summary.generatedAt,
			summary_json: summaryJson,
			markdown,
			utterance_count: summary.utteranceCount
		};
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		this.transaction("meeting-transcripts.summary.write", ({ db: database }) => {
			executeSqliteQuerySync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_summaries").values({
				session_id: resolved.sessionId,
				session_started_at: resolved.startedAt,
				...summaryValues
			}).onConflict((conflict) => conflict.columns(["session_id", "session_started_at"]).doUpdateSet(summaryValues)));
		});
		return path.join(this.sessionDir(resolved), "summary.md");
	}
	async readSummary(session) {
		const database = this.database();
		const row = executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptDb(database.db).selectFrom("meeting_transcript_summaries").selectAll().where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt));
		if (!row) return {};
		const summary = summaryFromRow(row);
		return {
			...summary ? { summary } : {},
			...row.markdown !== null ? { markdown: row.markdown } : {}
		};
	}
	async materializeSessionArtifacts(sessionOrSelector, kind) {
		const session = typeof sessionOrSelector === "string" ? await this.readSession(sessionOrSelector) : this.readSessionByIdentity(sessionOrSelector);
		if (!session) {
			const selector = typeof sessionOrSelector === "string" ? sessionOrSelector : sessionOrSelector.sessionId;
			throw new Error(`transcripts session not found: ${selector}`);
		}
		return await withOpenClawStateLease({
			scope: "meeting-transcript.export",
			key: transcriptSessionExportKey(session),
			database: {
				scope: "shared",
				options: this.databaseOptions
			},
			leaseMs: 6e4,
			waitMs: 1e4,
			leaseLabel: "meeting transcript export lease",
			operationLabel: "meeting-transcripts.export.lease"
		}, async () => await this.materializeSessionArtifactsOwned(session, kind));
	}
	async materializeSessionArtifactsOwned(session, kind) {
		const sessionDir = this.sessionDir(session);
		const includeTranscript = kind === "all" || kind === "transcript";
		const includeSummary = kind === "all" || kind === "summary";
		const storedSummary = includeSummary ? await this.readSummary(session) : {};
		const exportedHashes = {};
		const removedExports = /* @__PURE__ */ new Set();
		await assertTranscriptExportPathAvailable({
			session,
			exportRootDir: this.exportRootDir,
			databaseOptions: this.databaseOptions
		});
		await this.assertExportDestinationOwned(session);
		const pendingFiles = [
			"metadata.json",
			...includeTranscript ? ["transcript.jsonl"] : [],
			...includeSummary ? ["summary.json", "summary.md"] : []
		];
		this.markPendingExports(session, pendingFiles);
		const ensured = await ensureAbsoluteDirectory(sessionDir, {
			mode: 448,
			scopeLabel: "transcript export directory"
		});
		if (!ensured.ok) throw ensured.error;
		exportedHashes["metadata.json"] = await writeTranscriptArtifact(sessionDir, "metadata.json", `${JSON.stringify(session, null, 2)}\n`);
		if (includeTranscript) exportedHashes["transcript.jsonl"] = await writeTranscriptJsonlArtifact({
			sessionDir,
			session,
			databaseOptions: this.databaseOptions
		});
		if (includeSummary) {
			if (storedSummary.summary) exportedHashes["summary.json"] = await writeTranscriptArtifact(sessionDir, "summary.json", `${JSON.stringify(storedSummary.summary, null, 2)}\n`);
			else {
				await removeTranscriptArtifact(sessionDir, "summary.json");
				removedExports.add("summary.json");
			}
			if (storedSummary.markdown !== void 0) exportedHashes["summary.md"] = await writeTranscriptArtifact(sessionDir, "summary.md", normalizeExportText(storedSummary.markdown));
			else {
				await removeTranscriptArtifact(sessionDir, "summary.md");
				removedExports.add("summary.md");
			}
		}
		this.updateExportManifest(session, exportedHashes, removedExports);
		return {
			sessionDir,
			metadataPath: path.join(sessionDir, "metadata.json"),
			transcriptPath: path.join(sessionDir, "transcript.jsonl"),
			summaryJsonPath: path.join(sessionDir, "summary.json"),
			summaryPath: path.join(sessionDir, "summary.md"),
			hasSummary: storedSummary.summary !== void 0 || storedSummary.markdown !== void 0
		};
	}
};
//#endregion
export { transcriptSessionExportKey as a, safeTranscriptPathSegment as i, renderTranscriptsMarkdown as n, transcriptSessionSelector as o, summarizeTranscripts as r, ensureMeetingTranscriptsSchema as s, TranscriptsStore as t };
