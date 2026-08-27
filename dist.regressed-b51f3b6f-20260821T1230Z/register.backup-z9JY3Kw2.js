import { t as sameFileIdentity } from "./file-identity-BDCAnrmX.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { n as canonicalPathFromExistingAncestor } from "./absolute-path-BseY-yOe.js";
import { r as root, t as ensureAbsoluteDirectory } from "./fs-safe-C9N8pCh1.js";
import { d as pinDirectory, f as syncDirectory, u as ensureDurableDirectory } from "./pinned-write-BZU6lFjb.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-Db0rqw_J.js";
import { Et as array, Rn as string, Tn as object, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import { o as readSqliteUserVersion, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { Dt as getOpenClawStateRuntimeSchema, Sn as applyPrivateModeSync, cn as createPrivateSqliteTempDirectory, dn as buildPowerShellFailureCause, ln as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS, sn as createPrivateSqliteDirectory, un as buildEncodedPowerShellArgs, xt as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-DlCMR4eQ.js";
import { r as assertSqliteIntegrity } from "./sqlite-strict-BaSF4bDz.js";
import { t as resolveSystemBin } from "./resolve-system-bin-ClCg60C2.js";
import { r as theme } from "./theme-vjDs9tao.js";
import "./config-Dl8DJbzM.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { n as runExec } from "./exec-BL80Wdzl.js";
import { i as syncDirectoryIfSupported, n as publishFileNoClobber, r as requireDirectorySync, s as sha256File, t as getPublishFileExclusiveFailureDetails } from "./directory-durability-C8NmNClX.js";
import "./openclaw-agent-db-lxLIE6rA.js";
import { A as resolveOpenClawAgentSqlitePath, E as listOpenClawRegisteredAgentDatabases, b as OPENCLAW_AGENT_SCHEMA_SQL, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { n as isPathWithin } from "./cleanup-utils-CAt2PsMZ.js";
import { i as requireGitCommandBuffer, n as executeGitCommand, r as requireGitCommand } from "./git-exec-CI8c1NB4.js";
import { t as loadSqliteVecExtension } from "./sqlite-vec-N_jC-q4Z.js";
import "./engine-storage-C96gWSb3.js";
import { i as isImplicitLocalGatewayTargetFromCli, n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-CWthRV-m.js";
import { n as runCommandWithRuntime } from "./cli-utils-NPN0egNa.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { a as publishVerifiedSqliteFile, i as createVerifiedSqliteSnapshot, n as sanitizeOpenClawGlobalStateSnapshot, r as sanitizeOpenClawStateLeaseRows, t as backupCreateCommand } from "./backup-BlchJTMo.js";
import { r as recordBackupRunOutcome } from "./backup-run-records-2DJiexcX.js";
import { a as BACKUP_MAX_DECOMPRESSION_RATIO, l as canonicalizePathForContainment } from "./backup-archive-path-policy-BnkI5U5X.js";
import { r as verifyBackupArchive, t as backupVerifyCommand } from "./backup-verify-_OngtRsB.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import * as tar from "tar";
//#region src/state/secret-state-tables.ts
/** Redaction policy surface: Git snapshots may omit these credential-bearing tables. */
const STATE_SECRET_TABLE_NAMES = [
	"audit_identity_keys",
	"auth_profile_state",
	"auth_profile_stores",
	"apns_registrations",
	"channel_ingress_events",
	"channel_pairing_requests",
	"clawhub_promotion_claims",
	"device_auth_tokens",
	"device_bootstrap_tokens",
	"device_identities",
	"device_pairing_join_codes",
	"device_pairing_paired",
	"gateway_origin_device_tokens",
	"mcp_oauth_pending_authorizations",
	"mcp_oauth_stores",
	"native_hook_relay_bridges",
	"node_host_config",
	"secret_store_entries",
	"web_push_subscriptions",
	"web_push_vapid_keys",
	"worker_environment_credentials"
];
/** Redaction policy surface for credential-bearing per-agent database tables. */
const AGENT_SECRET_TABLE_NAMES = [
	"auth_profile_state",
	"auth_profile_store",
	"session_suggestions"
];
//#endregion
//#region src/snapshot/snapshot-provider.ts
const SNAPSHOT_MANIFEST_FILENAME = "manifest.json";
const SNAPSHOT_SQLITE_FILENAME = "database.sqlite";
//#endregion
//#region src/snapshot/manifest.ts
const MAX_MANIFEST_BYTES = 1024 * 1024;
const MAX_SQLITE_USER_VERSION = 2147483647;
const MIN_SQLITE_USER_VERSION = -2147483648;
const SNAPSHOT_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
function containsAsciiControlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 31 || code === 127) return true;
	}
	return false;
}
async function hashSnapshotArtifact(snapshotDir) {
	const opened = await (await root(snapshotDir)).open(SNAPSHOT_SQLITE_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	try {
		return {
			...await hashFileHandle(opened.handle),
			stat: opened.stat
		};
	} finally {
		await opened.handle.close();
	}
}
async function copySnapshotArtifact(snapshotDir, targetPath) {
	const source = await (await root(snapshotDir)).open(SNAPSHOT_SQLITE_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	let target;
	let targetIdentity;
	try {
		target = await fs$1.open(targetPath, "wx+", 384);
		targetIdentity = await target.stat();
		const digest = await hashFileHandle(source.handle, target);
		await target.sync();
		const finalIdentity = await target.stat();
		const currentIdentity = await fs$1.lstat(targetPath);
		if (!sameFileIdentity(targetIdentity, finalIdentity) || !sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`Snapshot restore staging file changed during copy: ${targetPath}`);
		return {
			...digest,
			stat: finalIdentity
		};
	} catch (error) {
		await target?.close().catch(() => void 0);
		target = void 0;
		if (targetIdentity) {
			const currentIdentity = await fs$1.lstat(targetPath).catch(() => void 0);
			if (currentIdentity && sameFileIdentity(targetIdentity, currentIdentity)) await fs$1.unlink(targetPath).catch(() => void 0);
		}
		throw error;
	} finally {
		await target?.close().catch(() => void 0);
		await source.handle.close().catch(() => void 0);
	}
}
async function hashFileHandle(source, target) {
	const initialStat = await source.stat({ bigint: true });
	let sizeBytes = 0;
	if (target) {
		const buffer = Buffer.allocUnsafe(1024 * 1024);
		while (true) {
			const { bytesRead } = await source.read(buffer, 0, buffer.length, sizeBytes);
			if (bytesRead === 0) break;
			let bytesWritten = 0;
			while (bytesWritten < bytesRead) {
				const result = await target.write(buffer, bytesWritten, bytesRead - bytesWritten, sizeBytes + bytesWritten);
				if (result.bytesWritten === 0) throw new Error("Snapshot restore staging copy made no progress.");
				bytesWritten += result.bytesWritten;
			}
			sizeBytes += bytesRead;
		}
	}
	const hashed = await sha256File(target ?? source);
	if (!sameMutationFingerprint(initialStat, await source.stat({ bigint: true })) || target && sizeBytes !== hashed.bytes) throw new Error("Snapshot artifact changed while being read.");
	return {
		sha256: hashed.digest,
		sizeBytes: hashed.bytes
	};
}
function sameMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
async function writeSnapshotManifest(snapshotDir, manifest) {
	const manifestPath = path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME);
	const handle = await fs$1.open(manifestPath, "wx+", 384);
	try {
		await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`, "utf8");
		await handle.sync();
	} finally {
		await handle.close();
	}
}
async function readSnapshotManifest(snapshotDir, expectedSnapshotId = path.basename(snapshotDir)) {
	const snapshotRoot = await root(snapshotDir);
	const manifestPath = path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME);
	const result = await snapshotRoot.read(SNAPSHOT_MANIFEST_FILENAME, {
		hardlinks: "reject",
		maxBytes: MAX_MANIFEST_BYTES,
		symlinks: "reject"
	});
	let parsed;
	try {
		parsed = JSON.parse(result.buffer.toString("utf8"));
	} catch (error) {
		throw new Error(`Snapshot manifest is not valid JSON: ${manifestPath}`, { cause: error });
	}
	return parseSnapshotManifest(parsed, manifestPath, expectedSnapshotId);
}
function parseSnapshotManifest(value, manifestPath, expectedSnapshotId) {
	const record = requireRecord(value, "manifest", manifestPath);
	requireExactKeys(record, [
		"schemaVersion",
		"snapshotId",
		"createdAt",
		"database",
		"artifact"
	]);
	if (record.schemaVersion !== 1) throw new Error(`Unsupported snapshot manifest schemaVersion ${String(record.schemaVersion)}: ${manifestPath}`);
	const snapshotId = requireSnapshotId(record.snapshotId, manifestPath);
	if (snapshotId !== expectedSnapshotId) throw new Error(`Snapshot manifest id ${snapshotId} does not match directory ${expectedSnapshotId}: ${manifestPath}`);
	const createdAt = requireCanonicalTimestamp(record.createdAt, manifestPath);
	const database = parseSnapshotDatabase(record.database, manifestPath);
	const artifactRecord = requireRecord(record.artifact, "artifact", manifestPath);
	requireExactKeys(artifactRecord, [
		"path",
		"sha256",
		"sizeBytes"
	]);
	if (artifactRecord.path !== "database.sqlite") throw new Error(`Snapshot manifest artifact.path must be ${SNAPSHOT_SQLITE_FILENAME}: ${manifestPath}`);
	if (typeof artifactRecord.sha256 !== "string" || !SHA256_PATTERN.test(artifactRecord.sha256)) throw new Error(`Snapshot manifest artifact.sha256 is invalid: ${manifestPath}`);
	if (!Number.isSafeInteger(artifactRecord.sizeBytes) || Number(artifactRecord.sizeBytes) <= 0) throw new Error(`Snapshot manifest artifact.sizeBytes is invalid: ${manifestPath}`);
	return {
		schemaVersion: 1,
		snapshotId,
		createdAt,
		database,
		artifact: {
			path: SNAPSHOT_SQLITE_FILENAME,
			sha256: artifactRecord.sha256,
			sizeBytes: Number(artifactRecord.sizeBytes)
		}
	};
}
function parseSnapshotDatabase(value, manifestPath) {
	const database = requireRecord(value, "database", manifestPath);
	const role = database.role;
	const basename = requireSafeText(database.basename, "database.basename", manifestPath, 255);
	if (path.basename(basename) !== basename || basename === "." || basename === "..") throw new Error(`Snapshot manifest database.basename is invalid: ${manifestPath}`);
	const userVersion = requireSqliteUserVersion(database.userVersion, manifestPath);
	if (role === "global") {
		requireExactKeys(database, [
			"role",
			"basename",
			"userVersion"
		]);
		return {
			role,
			basename,
			userVersion
		};
	}
	if (role === "agent") {
		requireExactKeys(database, [
			"role",
			"agentId",
			"basename",
			"userVersion"
		]);
		const agentId = requireSafeText(database.agentId, "database.agentId", manifestPath, 64);
		if (!isValidAgentId(agentId) || normalizeAgentId(agentId) !== agentId) throw new Error(`Snapshot manifest database.agentId is invalid: ${manifestPath}`);
		return {
			role,
			agentId,
			basename,
			userVersion
		};
	}
	if (role === "generic") {
		requireExactKeys(database, [
			"role",
			"id",
			"basename",
			"userVersion"
		]);
		return {
			role,
			id: requireSafeText(database.id, "database.id", manifestPath, 256),
			basename,
			userVersion
		};
	}
	throw new Error(`Snapshot manifest database.role is invalid: ${manifestPath}`);
}
function requireRecord(value, field, manifestPath) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Snapshot manifest ${field} must be an object: ${manifestPath}`);
	return value;
}
function requireExactKeys(record, expectedKeys) {
	const actual = Object.keys(record).toSorted();
	const expected = [...expectedKeys].toSorted();
	if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new Error(`Snapshot manifest fields must be exactly ${expectedKeys.join(", ")}; got ${actual.join(", ")}`);
}
function requireSnapshotId(value, manifestPath) {
	if (typeof value !== "string" || !SNAPSHOT_ID_PATTERN.test(value)) throw new Error(`Snapshot manifest snapshotId is invalid: ${manifestPath}`);
	return value;
}
function requireCanonicalTimestamp(value, manifestPath) {
	if (typeof value !== "string") throw new Error(`Snapshot manifest createdAt is invalid: ${manifestPath}`);
	const parsed = new Date(value);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) throw new Error(`Snapshot manifest createdAt is not canonical ISO 8601: ${manifestPath}`);
	return value;
}
function requireSafeText(value, field, manifestPath, maxLength) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxLength || value.trim() !== value || containsAsciiControlCharacter(value)) throw new Error(`Snapshot manifest ${field} is invalid: ${manifestPath}`);
	return value;
}
function requireSqliteUserVersion(value, manifestPath) {
	if (!Number.isSafeInteger(value) || Number(value) < MIN_SQLITE_USER_VERSION || Number(value) > MAX_SQLITE_USER_VERSION) throw new Error(`Snapshot manifest database.userVersion is invalid: ${manifestPath}`);
	return Number(value);
}
//#endregion
//#region src/snapshot/openclaw-snapshot-copy.ts
function normalizeSnapshotIdentity(identity) {
	if (identity.role === "global") return identity;
	if (identity.role === "agent") {
		const agentId = normalizeAgentId(identity.agentId);
		if (!isValidAgentId(identity.agentId) || agentId !== identity.agentId) throw new Error(`SQLite snapshot agent id must be canonical: ${identity.agentId}`);
		return {
			role: "agent",
			agentId
		};
	}
	const id = identity.id.trim();
	if (!id || id !== identity.id || id.length > 256 || containsAsciiControlCharacter(id)) throw new Error("SQLite snapshot generic database id is invalid.");
	return {
		role: "generic",
		id
	};
}
function buildSnapshotValidator(identity) {
	if (identity.role === "global") return (database, pathname) => assertOpenClawStateDatabaseForMaintenance(database, { pathname });
	if (identity.role === "agent") return (database, pathname) => assertOpenClawAgentDatabaseForMaintenance(database, {
		agentId: identity.agentId,
		pathname
	});
	return () => void 0;
}
/** Produce the canonical sanitized, compact, verified copy used by every snapshot provider. */
async function createOpenClawSnapshotCopy(params) {
	const identity = normalizeSnapshotIdentity(params.database.identity);
	return {
		identity,
		...await createVerifiedSqliteSnapshot({
			sourcePath: params.database.path,
			targetPath: params.targetPath,
			requireNonEmptySource: identity.role !== "generic",
			transform: identity.role === "global" ? sanitizeOpenClawGlobalStateSnapshot : identity.role === "agent" ? sanitizeOpenClawStateLeaseRows : void 0,
			validate: buildSnapshotValidator(identity)
		})
	};
}
//#endregion
//#region src/snapshot/git-backup-codec.ts
const GIT_BACKUP_MANIFEST = "manifest.json";
const GIT_BACKUP_SCHEMA = "schema.sql";
const GIT_BACKUP_TABLES = "tables";
const SQLITE_SIDECAR_SUFFIXES$1 = [
	"-wal",
	"-shm",
	"-journal"
];
const SAFE_TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const GIT_BACKUP_PROJECTION_TABLES = ["backup_runs", "session_transcript_index_state"];
function quoteIdentifier(value) {
	return `"${value.replaceAll("\"", "\"\"")}"`;
}
function requireSafeTableName(value) {
	if (!SAFE_TABLE_NAME.test(value)) throw new Error(`Git backup table name is not filesystem-safe: ${value}`);
	return value;
}
function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}
function normalizeIdentity(identity) {
	if (identity.role === "global") return identity;
	const agentId = normalizeAgentId(identity.agentId);
	if (agentId !== identity.agentId) throw new Error(`Git backup agent id must be canonical: ${identity.agentId}`);
	return {
		role: "agent",
		agentId
	};
}
function gitBackupScopePath(identity) {
	const normalized = normalizeIdentity(identity);
	return normalized.role === "global" ? "global" : path.join("agents", normalized.agentId);
}
function readSchemaEntries(database) {
	return database.prepare(`SELECT type, name, tbl_name AS tableName, sql
         FROM sqlite_master
        WHERE type IN ('table', 'index', 'trigger')
          AND name NOT LIKE 'sqlite_%'
          AND sql IS NOT NULL
        ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 ELSE 2 END, name`).all().map((row) => row);
}
function virtualTableNames(entries) {
	return entries.filter((entry) => /^\s*CREATE\s+VIRTUAL\s+TABLE\b/iu.test(entry.sql)).map((entry) => entry.name);
}
function isVirtualShadow(name, virtualTables) {
	return virtualTables.some((virtualTable) => name === virtualTable || name.startsWith(`${virtualTable}_`));
}
function readTableColumns(database, table) {
	return database.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all().map((row) => {
		const value = row;
		if (typeof value.name !== "string" || typeof value.pk !== "number") throw new Error(`Unable to read columns for Git backup table ${table}.`);
		return {
			name: value.name,
			pk: value.pk
		};
	});
}
function encodeSqliteValue(value) {
	if (value === null || typeof value === "string") return value;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new Error("Git backup cannot encode a non-finite SQLite REAL value.");
		return value;
	}
	if (typeof value === "bigint") return value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER ? Number(value) : { $int: value.toString() };
	if (value instanceof Uint8Array) return { $hex: Buffer.from(value).toString("hex") };
	throw new Error(`Git backup cannot encode SQLite value type ${typeof value}.`);
}
function serializeTable(database, table) {
	const columns = readTableColumns(database, table);
	if (columns.length === 0) throw new Error(`Git backup table has no readable columns: ${table}`);
	const primaryKey = columns.filter((column) => column.pk > 0).toSorted((left, right) => left.pk - right.pk).map((column) => quoteIdentifier(column.name));
	const orderBy = primaryKey.length > 0 ? primaryKey.join(", ") : "rowid";
	const statement = database.prepare(`SELECT ${columns.map((column) => quoteIdentifier(column.name)).join(", ")}
       FROM ${quoteIdentifier(table)} ORDER BY ${orderBy}`);
	statement.setReadBigInts(true);
	const lines = [];
	for (const rawRow of statement.iterate()) {
		const source = rawRow;
		const encoded = {};
		for (const column of columns) encoded[column.name] = encodeSqliteValue(source[column.name]);
		lines.push(JSON.stringify(encoded));
	}
	return {
		content: lines.length > 0 ? `${lines.join("\n")}\n` : "",
		rows: lines.length
	};
}
function schemaText(entries, userVersion) {
	return `${entries.map((entry) => entry.sql.trimEnd().endsWith(";") ? entry.sql : `${entry.sql};`).join("\n\n")}\n-- PRAGMA user_version = ${userVersion}\n`;
}
function redactedSecretTables(identity, excludeSecrets) {
	if (!excludeSecrets) return /* @__PURE__ */ new Set();
	return new Set(identity.role === "global" ? STATE_SECRET_TABLE_NAMES : AGENT_SECRET_TABLE_NAMES);
}
/** Dump one verified SQLite copy into the deterministic Git repository layout. */
async function dumpGitBackupDatabase(params) {
	const identity = normalizeIdentity(params.identity);
	const database = openNodeSqliteDatabase(params.snapshotPath, { readOnly: true });
	try {
		const entries = readSchemaEntries(database);
		const virtualTables = virtualTableNames(entries);
		const redacted = redactedSecretTables(identity, params.excludeSecrets === true);
		const existingTables = new Set(entries.filter((entry) => entry.type === "table").map((entry) => entry.name));
		const excludedTables = [...redacted].filter((table) => existingTables.has(table)).toSorted();
		const excluded = /* @__PURE__ */ new Set([...excludedTables, ...GIT_BACKUP_PROJECTION_TABLES]);
		const includedSchema = entries.filter((entry) => !excluded.has(entry.name) && !excluded.has(entry.tableName));
		const dataTables = entries.filter((entry) => entry.type === "table" && !isVirtualShadow(entry.name, virtualTables) && !excluded.has(entry.name)).map((entry) => requireSafeTableName(entry.name)).toSorted();
		const userVersionRow = database.prepare("PRAGMA user_version").get();
		if (typeof userVersionRow.user_version !== "number") throw new Error("Unable to read SQLite user_version for Git backup.");
		await fs$1.rm(params.outputPath, {
			recursive: true,
			force: true
		});
		const tablesPath = path.join(params.outputPath, GIT_BACKUP_TABLES);
		await fs$1.mkdir(tablesPath, {
			recursive: true,
			mode: 448
		});
		const tables = {};
		for (const table of dataTables) {
			const serialized = serializeTable(database, table);
			await fs$1.writeFile(path.join(tablesPath, `${table}.jsonl`), serialized.content, {
				encoding: "utf8",
				mode: 384
			});
			tables[table] = {
				rows: serialized.rows,
				sha256: sha256(serialized.content)
			};
		}
		const manifest = {
			schemaVersion: 1,
			identity,
			userVersion: userVersionRow.user_version,
			excludedTables,
			tables
		};
		await fs$1.writeFile(path.join(params.outputPath, GIT_BACKUP_SCHEMA), schemaText(includedSchema, manifest.userVersion), {
			encoding: "utf8",
			mode: 384
		});
		await fs$1.writeFile(path.join(params.outputPath, GIT_BACKUP_MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`, {
			encoding: "utf8",
			mode: 384
		});
		return manifest;
	} finally {
		database.close();
	}
}
function parseGitBackupManifest(value, source) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error(`Git backup manifest is invalid JSON: ${source}`, { cause: error });
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`Git backup manifest is invalid: ${source}`);
	const manifest = parsed;
	if (manifest.schemaVersion !== 1 || !manifest.identity || manifest.identity.role !== "global" && manifest.identity.role !== "agent" || !Number.isSafeInteger(manifest.userVersion) || !Array.isArray(manifest.excludedTables) || !manifest.tables || typeof manifest.tables !== "object") throw new Error(`Git backup manifest has unsupported fields: ${source}`);
	const validated = manifest;
	normalizeIdentity(validated.identity);
	for (const [table, entry] of Object.entries(validated.tables)) {
		requireSafeTableName(table);
		if (!Number.isSafeInteger(entry.rows) || entry.rows < 0 || !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error(`Git backup manifest has an invalid table entry: ${table}`);
	}
	return validated;
}
function splitSchemaStatements(schema) {
	const statements = [];
	let start = 0;
	let quote;
	let lineComment = false;
	let blockComment = false;
	for (let index = 0; index < schema.length; index += 1) {
		const character = schema[index];
		const next = schema[index + 1];
		if (lineComment) {
			if (character === "\n") lineComment = false;
			continue;
		}
		if (blockComment) {
			if (character === "*" && next === "/") {
				blockComment = false;
				index += 1;
			}
			continue;
		}
		if (quote) {
			if (quote === "]" && character === "]" || quote !== "]" && character === quote) if (quote !== "]" && next === quote) index += 1;
			else quote = void 0;
			continue;
		}
		if (character === "-" && next === "-") {
			lineComment = true;
			index += 1;
			continue;
		}
		if (character === "/" && next === "*") {
			blockComment = true;
			index += 1;
			continue;
		}
		if (character === "'" || character === "\"" || character === "`") {
			quote = character;
			continue;
		}
		if (character === "[") {
			quote = "]";
			continue;
		}
		if (character !== ";") continue;
		const candidate = schema.slice(start, index + 1).trim();
		if (/^CREATE\s+TRIGGER\b/iu.test(candidate) && !/\bEND\s*;$/iu.test(candidate)) continue;
		if (candidate && !candidate.startsWith("-- PRAGMA user_version")) statements.push(candidate);
		start = index + 1;
	}
	return statements;
}
function unquoteSqlIdentifier(value) {
	if (value.startsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
	if (value.startsWith("\"")) return value.slice(1, -1).replaceAll("\"\"", "\"");
	if (value.startsWith("`")) return value.slice(1, -1).replaceAll("``", "`");
	if (value.startsWith("[")) return value.slice(1, -1);
	return value;
}
function schemaObjectName(statement, kind) {
	const match = new RegExp(`^${kind === "virtual" ? "CREATE\\s+VIRTUAL\\s+TABLE" : "CREATE\\s+TABLE"}\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?('(?:[^']|'')*'|"(?:[^"]|"")*"|\\[[^\\]]+\\]|\`(?:[^\`]|\`\`)*\`|[^\\s(]+)`, "iu").exec(statement);
	return match?.[1] ? unquoteSqlIdentifier(match[1]) : void 0;
}
function decodeSqliteValue(value) {
	if (value === null || typeof value === "string" || typeof value === "number") return value;
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Git backup row contains an invalid encoded value.");
	const record = value;
	if (Object.keys(record).length === 1 && typeof record.$int === "string") return BigInt(record.$int);
	if (Object.keys(record).length === 1 && typeof record.$hex === "string" && /^(?:[a-f0-9]{2})*$/u.test(record.$hex)) return Buffer.from(record.$hex, "hex");
	throw new Error("Git backup row contains an invalid encoded object.");
}
async function assertFreshRestoreTarget(targetPath) {
	for (const candidate of [targetPath, ...SQLITE_SIDECAR_SUFFIXES$1.map((suffix) => `${targetPath}${suffix}`)]) {
		try {
			await fs$1.lstat(candidate);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		throw new Error(`Fresh SQLite restore path already exists: ${candidate}`);
	}
}
function assertNoSqliteSidecarsSync$1(targetPath) {
	for (const suffix of SQLITE_SIDECAR_SUFFIXES$1) {
		const sidecarPath = `${targetPath}${suffix}`;
		try {
			fs.lstatSync(sidecarPath);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		throw new Error(`Fresh SQLite restore path already exists: ${sidecarPath}`);
	}
}
function convergeRestoredSchema(database, identity) {
	database.exec(identity.role === "global" ? getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }) : OPENCLAW_AGENT_SCHEMA_SQL);
}
function validateRestoredOwner(database, databasePath, identity) {
	assertSqliteIntegrity(database, databasePath);
	if (database.prepare("PRAGMA foreign_key_check").all().length > 0) throw new Error(`SQLite foreign_key_check failed for restored Git backup: ${databasePath}`);
	buildSnapshotValidator(identity)(database, databasePath);
}
function loadTable(database, table, content) {
	const columns = readTableColumns(database, table);
	const statement = database.prepare(`INSERT INTO ${quoteIdentifier(table)} (${columns.map((column) => quoteIdentifier(column.name)).join(", ")})
     VALUES (${columns.map(() => "?").join(", ")})`);
	let rows = 0;
	for (const line of content.split("\n")) {
		if (!line) continue;
		const parsed = JSON.parse(line);
		statement.run(...columns.map((column) => decodeSqliteValue(parsed[column.name])));
		rows += 1;
	}
	return rows;
}
/** Restore one materialized Git snapshot scope into a fresh SQLite file. */
async function restoreGitBackupDirectory(params) {
	const targetPath = path.resolve(params.targetPath);
	await assertFreshRestoreTarget(targetPath);
	const manifest = parseGitBackupManifest(await fs$1.readFile(path.join(params.sourcePath, GIT_BACKUP_MANIFEST), "utf8"), params.sourcePath);
	const restoreIdentity = normalizeIdentity(params.expectedIdentity ?? manifest.identity);
	if (params.expectedIdentity && JSON.stringify(normalizeIdentity(manifest.identity)) !== JSON.stringify(restoreIdentity)) throw new Error("Git backup manifest database identity does not match the requested scope.");
	const statements = splitSchemaStatements(await fs$1.readFile(path.join(params.sourcePath, GIT_BACKUP_SCHEMA), "utf8"));
	const virtual = statements.filter((statement) => /^CREATE\s+VIRTUAL\s+TABLE\b/iu.test(statement));
	const triggers = statements.filter((statement) => /^CREATE\s+TRIGGER\b/iu.test(statement));
	const virtualNames = virtual.map((statement) => schemaObjectName(statement, "virtual")).filter((value) => Boolean(value));
	const plainTables = statements.filter((statement) => {
		if (!/^CREATE\s+TABLE\b/iu.test(statement)) return false;
		const name = schemaObjectName(statement, "table");
		return !name || !isVirtualShadow(name, virtualNames);
	});
	const indexes = statements.filter((statement) => /^CREATE\s+(?:UNIQUE\s+)?INDEX\b/iu.test(statement));
	const targetDirectory = path.dirname(targetPath);
	await fs$1.mkdir(targetDirectory, {
		recursive: true,
		mode: 448
	});
	const stagingDirectory = await createPrivateSqliteTempDirectory(targetDirectory, ".git-backup-restore-");
	applyPrivateModeSync(stagingDirectory, 448);
	const stagedPath = path.join(stagingDirectory, SNAPSHOT_SQLITE_FILENAME);
	await (await fs$1.open(stagedPath, "wx", 384)).close();
	const database = openNodeSqliteDatabase(stagedPath);
	try {
		database.exec("PRAGMA foreign_keys = OFF; PRAGMA journal_mode = DELETE;");
		for (const statement of [...plainTables, ...indexes]) database.exec(statement);
		database.exec("BEGIN IMMEDIATE;");
		try {
			for (const [table, expected] of Object.entries(manifest.tables)) {
				requireSafeTableName(table);
				const content = await fs$1.readFile(path.join(params.sourcePath, GIT_BACKUP_TABLES, `${table}.jsonl`), "utf8");
				if (sha256(content) !== expected.sha256) throw new Error(`Git backup table hash mismatch: ${table}`);
				if (loadTable(database, table, content) !== expected.rows) throw new Error(`Git backup table row count mismatch: ${table}`);
			}
			database.exec("COMMIT;");
		} catch (error) {
			database.exec("ROLLBACK;");
			throw error;
		}
		for (const statement of virtual) {
			if (/\bUSING\s+vec0\b/iu.test(statement)) continue;
			database.exec(statement);
		}
		for (const statement of triggers) database.exec(statement);
		for (const statement of virtual) {
			const name = schemaObjectName(statement, "virtual");
			if (name && /\bUSING\s+fts5\b/iu.test(statement) && /\bcontent\s*=/iu.test(statement)) database.prepare(`INSERT INTO ${quoteIdentifier(name)} (${quoteIdentifier(name)}) VALUES ('rebuild')`).run();
		}
		database.exec(`PRAGMA user_version = ${manifest.userVersion};`);
		convergeRestoredSchema(database, restoreIdentity);
		validateRestoredOwner(database, stagedPath, restoreIdentity);
		const tables = Object.entries(manifest.tables).map(([table, expected]) => {
			const actual = serializeTable(database, table);
			const actualSha256 = sha256(actual.content);
			return {
				table,
				rows: actual.rows,
				sha256: actualSha256,
				ok: actual.rows === expected.rows && actualSha256 === expected.sha256
			};
		});
		if (tables.some((table) => !table.ok)) throw new Error(`Restored Git backup does not match its table manifest: ${stagedPath}`);
		database.close();
		applyPrivateModeSync(stagedPath, 384);
		const artifact = await hashSnapshotArtifact(stagingDirectory);
		await publishVerifiedSqliteFile({
			sourceIdentity: artifact.stat,
			sourcePath: stagedPath,
			targetPath,
			expectedContent: artifact,
			requireAtomicPublication: true,
			beforePublish: async () => await assertFreshRestoreTarget(targetPath),
			validatePublished: async (publishedPath) => {
				const published = openNodeSqliteDatabase(publishedPath, { readOnly: true });
				try {
					validateRestoredOwner(published, publishedPath, restoreIdentity);
				} finally {
					published.close();
				}
			},
			afterPublish: (guard) => {
				guard.assertTargetMatchesExpectedContent(() => assertNoSqliteSidecarsSync$1(targetPath));
			}
		});
		return {
			manifest,
			targetPath,
			tables,
			excludedTables: manifest.excludedTables
		};
	} catch (error) {
		if (database.isOpen) database.close();
		throw error;
	} finally {
		await fs$1.rm(stagingDirectory, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
//#endregion
//#region src/snapshot/local-repository.ts
const SNAPSHOT_DIRECTORY_MODE = 448;
const SNAPSHOT_FILE_MODE = 384;
const SNAPSHOT_PENDING_FILENAME = ".pending";
const SQLITE_SIDECAR_SUFFIXES = [
	"-wal",
	"-shm",
	"-journal"
];
const SNAPSHOT_ARTIFACT_ENTRIES = /* @__PURE__ */ new Set([
	SNAPSHOT_MANIFEST_FILENAME,
	SNAPSHOT_PENDING_FILENAME,
	SNAPSHOT_SQLITE_FILENAME
]);
const RESTORE_STAGING_ENTRIES = /* @__PURE__ */ new Set([SNAPSHOT_SQLITE_FILENAME]);
const VALIDATION_STAGING_ENTRIES = /* @__PURE__ */ new Set([SNAPSHOT_SQLITE_FILENAME, ...SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${SNAPSHOT_SQLITE_FILENAME}${suffix}`)]);
const MACOS_REPLACEMENT_ACL_PERMISSIONS = /* @__PURE__ */ new Set([
	"add_file",
	"add_subdirectory",
	"chown",
	"delete",
	"delete_child",
	"writesecurity"
]);
const WINDOWS_STAGING_ACCESS_RIGHTS = /* @__PURE__ */ new Set([
	"F",
	"M",
	"RX",
	"R",
	"W",
	"D",
	"DE",
	"RC",
	"WDAC",
	"WO",
	"AS",
	"MA",
	"GR",
	"GW",
	"GE",
	"GA",
	"RD",
	"WD",
	"AD",
	"REA",
	"WEA",
	"X",
	"DC",
	"RA",
	"WA",
	"UNKNOWN"
]);
const WINDOWS_STAGING_REPLACEMENT_RIGHTS = /* @__PURE__ */ new Set([
	"F",
	"M",
	"D",
	"DE",
	"WDAC",
	"WO",
	"MA",
	"GA",
	"DC",
	"UNKNOWN"
]);
const WINDOWS_TRUSTED_OWNER_SIDS = /* @__PURE__ */ new Set([
	"S-1-5-18",
	"S-1-5-32-544",
	"S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464"
]);
const WINDOWS_TRUSTED_ACCESS_SIDS = /* @__PURE__ */ new Set([...WINDOWS_TRUSTED_OWNER_SIDS, "S-1-3-0"]);
const WINDOWS_ACL_METADATA_MAX_BUFFER = 16 * 1024 * 1024;
const WINDOWS_SID_SCHEMA = string().regex(/^S-\d+-\d+(?:-\d+)+$/iu).transform((value) => value.toUpperCase());
const WINDOWS_ACCESS_ENTRY_SCHEMA = object({
	principal: string().min(1).transform((value) => value.toUpperCase()),
	accessType: _enum(["Allow", "Deny"]),
	rightsMask: number().int().nonnegative().max(4294967295),
	inheritanceFlags: string(),
	propagationFlags: string()
}).strict();
const WINDOWS_PATH_SECURITY_SCHEMA = object({
	currentUserSid: WINDOWS_SID_SCHEMA,
	paths: array(object({
		path: string().min(1),
		ownerSid: WINDOWS_SID_SCHEMA,
		entries: array(WINDOWS_ACCESS_ENTRY_SCHEMA).min(1)
	}).strict()).min(1)
}).strict();
const WINDOWS_FILE_RIGHTS = [
	[1, "RD"],
	[2, "WD"],
	[4, "AD"],
	[8, "REA"],
	[16, "WEA"],
	[32, "X"],
	[64, "DC"],
	[128, "RA"],
	[256, "WA"],
	[65536, "D"],
	[131072, "RC"],
	[262144, "WDAC"],
	[524288, "WO"],
	[1048576, "S"],
	[33554432, "MA"],
	[268435456, "GA"],
	[536870912, "GE"],
	[1073741824, "GW"],
	[2147483648, "GR"]
];
const WINDOWS_KNOWN_FILE_RIGHTS_MASK = WINDOWS_FILE_RIGHTS.reduce((mask, [right]) => mask | right, 0);
const WINDOWS_READ_RIGHTS_MASK = -1342046039;
const WINDOWS_WRITE_RIGHTS_MASK = 1343029590;
let macosTrustedAclPrincipalsPromise;
function createLocalSqliteSnapshotProvider(options) {
	return new LocalSqliteSnapshotProvider(options);
}
var LocalSqliteSnapshotProvider = class {
	#allowedDatabaseRoles;
	#repositoryPath;
	#validationRootPath;
	#now;
	constructor(options) {
		this.#allowedDatabaseRoles = options.allowedDatabaseRoles;
		this.#repositoryPath = path.resolve(options.repositoryPath);
		this.#validationRootPath = path.resolve(options.validationRootPath ?? path.dirname(this.#repositoryPath));
		this.#now = options.now ?? (() => /* @__PURE__ */ new Date());
	}
	async create(database) {
		const repositoryReceipt = await ensurePrivateDirectory(this.#repositoryPath, "SQLite snapshot repository");
		const repositoryIdentity = repositoryReceipt.identity;
		const trustedRepositoryPath = await assertTrustedStagingRoot(repositoryIdentity, this.#repositoryPath);
		const sourcePath = path.resolve(database.path);
		const identity = normalizeSnapshotIdentity(database.identity);
		const now = this.#now();
		if (!Number.isFinite(now.getTime())) throw new Error("SQLite snapshot timestamp is invalid.");
		const snapshotId = buildSnapshotId(now);
		const snapshotRefPath = path.join(this.#repositoryPath, snapshotId);
		const snapshotDir = path.join(trustedRepositoryPath, snapshotId);
		const stagingDir = path.join(trustedRepositoryPath, `.tmp-${randomUUID()}`);
		const artifactPath = path.join(stagingDir, SNAPSHOT_SQLITE_FILENAME);
		await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
		await createPrivateSqliteDirectory(stagingDir);
		let stagingIdentity;
		let publishedDirectory;
		let publishedIdentity;
		const publishedEntries = /* @__PURE__ */ new Map();
		let snapshotDirectoryCreated = false;
		try {
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			stagingIdentity = await fs$1.lstat(stagingDir);
			applyPrivateModeSync(stagingDir, SNAPSHOT_DIRECTORY_MODE);
			await assertPrivateStagingDirectory(stagingIdentity, stagingDir);
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			const result = await createOpenClawSnapshotCopy({
				database: {
					path: sourcePath,
					identity
				},
				targetPath: artifactPath
			});
			applyPrivateModeSync(artifactPath, SNAPSHOT_FILE_MODE);
			const artifact = await hashSnapshotArtifact(stagingDir);
			const manifest = {
				schemaVersion: 1,
				snapshotId,
				createdAt: now.toISOString(),
				database: buildDatabaseManifest(identity, sourcePath, result.userVersion),
				artifact: {
					path: SNAPSHOT_SQLITE_FILENAME,
					sha256: artifact.sha256,
					sizeBytes: artifact.sizeBytes
				}
			};
			await writeSnapshotManifest(stagingDir, manifest);
			applyPrivateModeSync(path.join(stagingDir, SNAPSHOT_MANIFEST_FILENAME), SNAPSHOT_FILE_MODE);
			await readSnapshotManifest(stagingDir, snapshotId);
			await syncDirectoryIfSupported(stagingDir);
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			try {
				await createPrivateSqliteDirectory(snapshotDir);
				snapshotDirectoryCreated = true;
			} catch (error) {
				if (error.code === "EEXIST") throw new Error(`SQLite snapshot directory already exists: ${snapshotDir}`, { cause: error });
				throw error;
			}
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			publishedDirectory = await pinDirectory(snapshotDir, { label: "SQLite snapshot directory" });
			publishedIdentity = publishedDirectory.receipt.identity;
			applyPrivateModeSync(snapshotDir, SNAPSHOT_DIRECTORY_MODE);
			await assertPrivateStagingDirectory(publishedIdentity, snapshotDir);
			await publishedDirectory.assertCurrent();
			const pendingPath = path.join(snapshotDir, SNAPSHOT_PENDING_FILENAME);
			const pendingHandle = await fs$1.open(pendingPath, "wx+", SNAPSHOT_FILE_MODE);
			try {
				publishedEntries.set(SNAPSHOT_PENDING_FILENAME, await pendingHandle.stat());
				await pendingHandle.sync();
			} finally {
				await pendingHandle.close();
			}
			await publishedDirectory.assertCurrent();
			requireDirectorySync(await publishedDirectory.sync(), "SQLite snapshot directory");
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			requireDirectorySync(await syncDirectory(repositoryReceipt), "SQLite snapshot repository");
			await publishedDirectory.assertCurrent();
			await publishSnapshotEntryNoOverwrite(path.join(stagingDir, SNAPSHOT_SQLITE_FILENAME), path.join(snapshotDir, SNAPSHOT_SQLITE_FILENAME), SNAPSHOT_SQLITE_FILENAME, publishedEntries);
			await publishedDirectory.assertCurrent();
			await publishSnapshotEntryNoOverwrite(path.join(stagingDir, SNAPSHOT_MANIFEST_FILENAME), path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME), SNAPSHOT_MANIFEST_FILENAME, publishedEntries);
			await publishedDirectory.assertCurrent();
			requireDirectorySync(await publishedDirectory.sync(), "SQLite snapshot directory");
			await assertPendingSnapshotContents(snapshotDir);
			const publishedManifest = await readSnapshotManifest(snapshotDir, snapshotId);
			if (!isDeepStrictEqual(publishedManifest, manifest)) throw new Error(`SQLite snapshot manifest changed during publication: ${snapshotDir}`);
			const publishedArtifact = await hashSnapshotArtifact(snapshotDir);
			const publishedArtifactPath = path.join(snapshotDir, SNAPSHOT_SQLITE_FILENAME);
			assertArtifactMatchesManifest(publishedArtifactPath, publishedArtifact, publishedManifest);
			await verifySnapshotDatabaseFile(publishedArtifactPath, publishedArtifact.stat, publishedManifest, trustedRepositoryPath);
			const expectedPendingIdentity = publishedEntries.get(SNAPSHOT_PENDING_FILENAME);
			const currentPendingIdentity = fs.lstatSync(pendingPath);
			if (!expectedPendingIdentity || !sameFileIdentity(expectedPendingIdentity, currentPendingIdentity)) throw new Error(`SQLite snapshot pending marker changed: ${pendingPath}`);
			await publishedDirectory.assertCurrent();
			fs.unlinkSync(pendingPath);
			requireDirectorySync(await publishedDirectory.sync(), "SQLite snapshot directory");
			await publishedDirectory.assertCurrent();
			const committedManifest = await readSnapshotManifest(snapshotDir, snapshotId);
			if (!isDeepStrictEqual(committedManifest, manifest)) throw new Error(`SQLite snapshot manifest changed after commit: ${snapshotDir}`);
			const committedArtifact = await hashSnapshotArtifact(snapshotDir);
			assertArtifactMatchesManifest(path.join(snapshotDir, SNAPSHOT_SQLITE_FILENAME), committedArtifact, committedManifest);
			await assertExactSnapshotContents(snapshotDir);
			await publishedDirectory.assertCurrent();
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			publishedEntries.delete(SNAPSHOT_PENDING_FILENAME);
			await publishedDirectory.close();
			publishedDirectory = void 0;
			return {
				ref: { path: snapshotRefPath },
				manifest
			};
		} catch (error) {
			await publishedDirectory?.close().catch(() => void 0);
			publishedDirectory = void 0;
			if (snapshotDirectoryCreated) publishedIdentity ??= await fs$1.lstat(snapshotDir).catch(() => void 0);
			if (publishedIdentity) {
				if (await removePublishedSnapshotDirectoryIfOwned(snapshotDir, publishedIdentity, publishedEntries)) await syncDirectoryIfSupported(trustedRepositoryPath);
			}
			throw error;
		} finally {
			if (stagingIdentity ? await removePrivateDirectoryIfOwned(stagingDir, stagingIdentity, SNAPSHOT_ARTIFACT_ENTRIES).catch(() => false) : await fs$1.rmdir(stagingDir).then(() => true).catch(() => false)) await syncDirectoryIfSupported(trustedRepositoryPath).catch(() => void 0);
		}
	}
	async verify(snapshot) {
		const snapshotDir = await this.#resolveSnapshotDirectory(snapshot);
		const manifest = await readVerifiedSnapshotManifest(snapshotDir);
		assertAllowedDatabaseRole(manifest, this.#allowedDatabaseRoles);
		const artifact = await hashSnapshotArtifact(snapshotDir);
		const artifactPath = path.join(snapshotDir, SNAPSHOT_SQLITE_FILENAME);
		assertArtifactMatchesManifest(artifactPath, artifact, manifest);
		await verifySnapshotDatabaseFile(artifactPath, artifact.stat, manifest, this.#validationRootPath);
		await assertExactSnapshotContents(snapshotDir);
		return {
			ok: true,
			manifest
		};
	}
	async restoreFresh(snapshot, targetPath) {
		const snapshotDir = await this.#resolveSnapshotDirectory(snapshot);
		const manifest = await readVerifiedSnapshotManifest(snapshotDir);
		assertAllowedDatabaseRole(manifest, this.#allowedDatabaseRoles);
		const resolvedTargetPath = path.resolve(targetPath);
		await assertFreshRestorePathsAbsent(resolvedTargetPath);
		const canonicalRepositoryPath = await fs$1.realpath(this.#repositoryPath);
		const canonicalRestoreParentPath = await canonicalPathFromExistingAncestor(path.dirname(resolvedTargetPath));
		const canonicalTargetPath = path.join(canonicalRestoreParentPath, path.basename(resolvedTargetPath));
		if (isPathInside(canonicalRepositoryPath, canonicalTargetPath)) throw new Error(`SQLite restore target must be outside snapshot repository ${this.#repositoryPath}: ${resolvedTargetPath}`);
		const restoreParentPath = path.dirname(canonicalTargetPath);
		const restoreParentReceipt = await ensureRestoreParentDirectory(restoreParentPath);
		const trustedRestoreParentPath = await fs$1.realpath(restoreParentPath);
		const trustedTargetPath = path.join(trustedRestoreParentPath, path.basename(resolvedTargetPath));
		if (!isPathInside(canonicalTargetPath, trustedTargetPath) || !isPathInside(trustedTargetPath, canonicalTargetPath)) throw new Error(`SQLite restore target changed while creating its parent: ${resolvedTargetPath}`);
		if (isPathInside(canonicalRepositoryPath, trustedTargetPath)) throw new Error(`SQLite restore target must be outside snapshot repository ${this.#repositoryPath}: ${resolvedTargetPath}`);
		const restoreParentIdentity = await fs$1.lstat(trustedRestoreParentPath);
		if (!sameFileIdentity(restoreParentReceipt.identity, restoreParentIdentity)) throw new Error(`SQLite restore parent changed after durable creation: ${trustedRestoreParentPath}`);
		await assertFreshRestorePathsAbsent(trustedTargetPath);
		return await withPrivateSqliteStagingDirectory({
			rootPath: trustedRestoreParentPath,
			expectedRootIdentity: restoreParentIdentity,
			prefix: ".tmp-restore-",
			allowedEntries: RESTORE_STAGING_ENTRIES,
			operation: async (stagingDir, stagingIdentity) => {
				const stagedSourcePath = path.join(stagingDir, SNAPSHOT_SQLITE_FILENAME);
				const stagedArtifact = await copySnapshotArtifact(snapshotDir, stagedSourcePath);
				await assertDirectoryIdentity(stagingDir, stagingIdentity);
				assertArtifactMatchesManifest(stagedSourcePath, stagedArtifact, manifest);
				await assertExactSnapshotContents(snapshotDir);
				await verifySnapshotDatabaseFile(stagedSourcePath, stagedArtifact.stat, manifest, trustedRestoreParentPath);
				await publishVerifiedSqliteFile({
					sourceIdentity: stagedArtifact.stat,
					sourcePath: stagedSourcePath,
					targetPath: trustedTargetPath,
					expectedContent: manifest.artifact,
					requireAtomicPublication: true,
					beforePublish: async () => {
						await assertDirectoryIdentity(trustedRestoreParentPath, restoreParentIdentity);
						await assertFreshRestorePathsAbsent(trustedTargetPath);
					},
					afterPublish: (guard) => {
						guard.assertTargetMatchesExpectedContent(() => {
							assertDirectoryIdentitySync(trustedRestoreParentPath, restoreParentIdentity);
							assertNoSqliteSidecarsSync(trustedTargetPath);
						});
					}
				});
				return {
					ok: true,
					manifest
				};
			}
		});
	}
	async list() {
		const repositoryStat = await lstatIfExists(this.#repositoryPath);
		if (!repositoryStat) return [];
		assertDirectory(repositoryStat, this.#repositoryPath, "SQLite snapshot repository");
		const entries = await fs$1.readdir(this.#repositoryPath, { withFileTypes: true });
		const snapshots = [];
		for (const entry of entries) {
			if (entry.name.startsWith(".tmp-")) {
				if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`SQLite snapshot repository contains unsafe staging entry: ${path.join(this.#repositoryPath, entry.name)}`);
				continue;
			}
			if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`SQLite snapshot repository contains unexpected entry: ${path.join(this.#repositoryPath, entry.name)}`);
			const snapshotPath = path.join(this.#repositoryPath, entry.name);
			const snapshotState = await classifySnapshotDirectory(snapshotPath);
			if (snapshotState === "incomplete") continue;
			const manifest = snapshotState === "complete-pending" ? await recoverCompletePendingSnapshot({
				allowedDatabaseRoles: this.#allowedDatabaseRoles,
				repositoryIdentity: repositoryStat,
				repositoryPath: this.#repositoryPath,
				snapshotPath,
				validationRootPath: this.#validationRootPath
			}) : await readVerifiedSnapshotManifest(snapshotPath);
			assertAllowedDatabaseRole(manifest, this.#allowedDatabaseRoles);
			snapshots.push({
				ref: { path: snapshotPath },
				manifest
			});
		}
		return snapshots.toSorted((left, right) => right.manifest.createdAt.localeCompare(left.manifest.createdAt) || right.manifest.snapshotId.localeCompare(left.manifest.snapshotId));
	}
	async #resolveSnapshotDirectory(snapshot) {
		const snapshotDir = path.resolve(snapshot.path);
		if (path.dirname(snapshotDir) !== this.#repositoryPath) throw new Error(`SQLite snapshot must be an immediate child of repository ${this.#repositoryPath}: ${snapshotDir}`);
		const repositoryStat = await fs$1.lstat(this.#repositoryPath);
		assertDirectory(repositoryStat, this.#repositoryPath, "SQLite snapshot repository");
		assertDirectory(await fs$1.lstat(snapshotDir), snapshotDir, "SQLite snapshot");
		if (await lstatIfExists(path.join(snapshotDir, SNAPSHOT_PENDING_FILENAME))) {
			if (await classifySnapshotDirectory(snapshotDir) === "complete-pending") await recoverCompletePendingSnapshot({
				allowedDatabaseRoles: this.#allowedDatabaseRoles,
				repositoryIdentity: repositoryStat,
				repositoryPath: this.#repositoryPath,
				snapshotPath: snapshotDir,
				validationRootPath: this.#validationRootPath
			});
		}
		return snapshotDir;
	}
};
async function readVerifiedSnapshotManifest(snapshotDir) {
	await assertExactSnapshotContents(snapshotDir);
	return await readSnapshotManifest(snapshotDir);
}
function assertArtifactMatchesManifest(artifactPath, artifact, manifest) {
	if (artifact.sizeBytes !== manifest.artifact.sizeBytes) throw new Error(`Snapshot artifact size mismatch for ${artifactPath}: expected ${manifest.artifact.sizeBytes}, got ${artifact.sizeBytes}`);
	if (artifact.sha256 !== manifest.artifact.sha256) throw new Error(`Snapshot artifact hash mismatch for ${artifactPath}: expected ${manifest.artifact.sha256}, got ${artifact.sha256}`);
}
function assertAllowedDatabaseRole(manifest, allowedRoles) {
	if (!allowedRoles || allowedRoles.includes(manifest.database.role)) return;
	throw new Error(`SQLite snapshot database role ${manifest.database.role} is not allowed for this operation.`);
}
async function verifySnapshotDatabaseFile(artifactPath, expectedIdentity, manifest, validationRootPath) {
	const beforeOpen = await fs$1.lstat(artifactPath);
	if (beforeOpen.isSymbolicLink() || !beforeOpen.isFile() || beforeOpen.nlink > 1 || !sameFileIdentity(expectedIdentity, beforeOpen)) throw new Error(`Snapshot artifact changed before SQLite verification: ${artifactPath}`);
	const validationRootIdentity = await fs$1.lstat(validationRootPath);
	assertDirectory(validationRootIdentity, validationRootPath, "SQLite validation root");
	await withPrivateSqliteStagingDirectory({
		rootPath: validationRootPath,
		expectedRootIdentity: validationRootIdentity,
		prefix: ".tmp-verify-",
		allowedEntries: VALIDATION_STAGING_ENTRIES,
		operation: async (validationDir) => {
			const validationPath = path.join(validationDir, SNAPSHOT_SQLITE_FILENAME);
			const validationArtifact = await copySnapshotArtifact(path.dirname(artifactPath), validationPath);
			assertArtifactMatchesManifest(validationPath, validationArtifact, manifest);
			const database = openNodeSqliteDatabase(validationPath, {
				allowExtension: true,
				readOnly: true
			});
			try {
				database.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
				await loadSqliteVecExtension({ db: database });
				assertSqliteIntegrity(database, artifactPath);
				buildManifestDatabaseValidator(manifest.database)(database, artifactPath);
			} finally {
				database.close();
			}
			const validatedArtifact = await hashSnapshotArtifact(validationDir);
			if (!sameFileIdentity(validationArtifact.stat, validatedArtifact.stat)) throw new Error(`Snapshot validation copy changed: ${validationPath}`);
			assertArtifactMatchesManifest(validationPath, validatedArtifact, manifest);
		}
	});
	const afterOpen = await fs$1.lstat(artifactPath);
	if (afterOpen.isSymbolicLink() || !afterOpen.isFile() || afterOpen.nlink > 1 || !sameFileIdentity(expectedIdentity, afterOpen)) throw new Error(`Snapshot artifact changed during SQLite verification: ${artifactPath}`);
	const verifiedArtifact = await hashSnapshotArtifact(path.dirname(artifactPath));
	if (!sameFileIdentity(expectedIdentity, verifiedArtifact.stat)) throw new Error(`Snapshot artifact changed after SQLite verification: ${artifactPath}`);
	assertArtifactMatchesManifest(artifactPath, verifiedArtifact, manifest);
}
function buildDatabaseManifest(identity, sourcePath, userVersion) {
	const basename = path.basename(sourcePath);
	if (identity.role === "global") return {
		role: "global",
		basename,
		userVersion
	};
	if (identity.role === "agent") return {
		role: "agent",
		agentId: identity.agentId,
		basename,
		userVersion
	};
	return {
		role: "generic",
		id: identity.id,
		basename,
		userVersion
	};
}
function buildManifestDatabaseValidator(manifest) {
	const validateOwner = buildSnapshotValidator(manifest);
	return (database, pathname) => {
		validateOwner(database, pathname);
		const userVersion = readSqliteUserVersion(database);
		if (userVersion !== manifest.userVersion) throw new Error(`Snapshot database user_version mismatch for ${pathname}: expected ${manifest.userVersion}, got ${userVersion}`);
	};
}
function buildSnapshotId(now) {
	return `${now.toISOString().replaceAll(/[:.]/g, "-")}-${randomUUID()}`;
}
async function ensurePrivateDirectory(directoryPath, scopeLabel) {
	let expectedExistingIdentity;
	if (process.platform !== "win32") try {
		const existingIdentity = await fs$1.lstat(directoryPath);
		assertDirectory(existingIdentity, directoryPath, scopeLabel);
		await assertTrustedStagingRoot(existingIdentity, directoryPath, { allowModeRepair: true });
		applyPrivateModeSync(directoryPath, SNAPSHOT_DIRECTORY_MODE);
		const repairedIdentity = await fs$1.lstat(directoryPath);
		if (!sameFileIdentity(existingIdentity, repairedIdentity)) throw new Error(`${scopeLabel} changed during private mode repair: ${directoryPath}`);
		expectedExistingIdentity = repairedIdentity;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	const receipt = await ensureDurableDirectory({
		directoryPath,
		label: scopeLabel,
		expectedExistingIdentity,
		create: async (targetPath) => {
			if (process.platform === "win32") {
				const parentResult = await ensureAbsoluteDirectory(path.dirname(targetPath), {
					mode: SNAPSHOT_DIRECTORY_MODE,
					scopeLabel
				});
				if (!parentResult.ok) throw parentResult.error;
				try {
					await createPrivateSqliteDirectory(targetPath);
					return;
				} catch (error) {
					if (error.code !== "EEXIST") throw error;
				}
			}
			const result = await ensureAbsoluteDirectory(targetPath, {
				mode: SNAPSHOT_DIRECTORY_MODE,
				scopeLabel
			});
			if (!result.ok) throw result.error;
			applyPrivateModeSync(result.path, SNAPSHOT_DIRECTORY_MODE);
		}
	});
	requireDirectorySync(receipt.parentSync, scopeLabel);
	return receipt;
}
async function ensureRestoreParentDirectory(directoryPath) {
	const receipt = await ensureDurableDirectory({
		directoryPath,
		label: "SQLite restore target",
		create: async (targetPath) => {
			const result = await ensureAbsoluteDirectory(targetPath, {
				mode: SNAPSHOT_DIRECTORY_MODE,
				scopeLabel: "SQLite restore target"
			});
			if (!result.ok) throw result.error;
		}
	});
	requireDirectorySync(receipt.parentSync, "SQLite restore target");
	return receipt;
}
function assertDirectory(stat, pathname, label) {
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`${label} must be a real directory: ${pathname}`);
}
async function assertDirectoryIdentity(directoryPath, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(directoryPath);
	assertDirectory(currentIdentity, directoryPath, "SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`SQLite staging directory changed during operation: ${directoryPath}`);
}
function assertDirectoryIdentitySync(directoryPath, expectedIdentity) {
	const currentIdentity = fs.lstatSync(directoryPath);
	assertDirectory(currentIdentity, directoryPath, "SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`SQLite staging directory changed during operation: ${directoryPath}`);
}
async function publishSnapshotEntryNoOverwrite(sourcePath, targetPath, entryName, publishedEntries) {
	let publication;
	try {
		publication = await publishFileNoClobber(sourcePath, targetPath, {
			strategy: "link-or-copy",
			moveSource: true,
			durability: "fail-closed"
		});
	} catch (error) {
		const details = getPublishFileExclusiveFailureDetails(error);
		if (details?.targetCreated && details.cleanup !== "removed") {
			const [currentSource, currentTarget] = await Promise.all([fs$1.lstat(sourcePath).catch(() => void 0), fs$1.lstat(targetPath).catch(() => void 0)]);
			const matchesReceipt = details.targetIdentity && currentTarget && sameFileIdentity(details.targetIdentity, currentTarget);
			const matchesSource = currentSource && currentTarget && sameFileIdentity(currentSource, currentTarget);
			if (currentTarget && (matchesReceipt || matchesSource)) publishedEntries.set(entryName, currentTarget);
		}
		throw error;
	}
	const expectedTargetIdentity = publication.identity;
	publishedEntries.set(entryName, expectedTargetIdentity);
	const initialTargetIdentity = await fs$1.lstat(targetPath);
	if (!sameFileIdentity(expectedTargetIdentity, initialTargetIdentity)) throw new Error(`SQLite snapshot entry changed during publication: ${targetPath}`);
	const finalTargetIdentity = await fs$1.lstat(targetPath);
	if (!sameFileIdentity(initialTargetIdentity, finalTargetIdentity)) throw new Error(`SQLite snapshot entry changed after publication: ${targetPath}`);
	publishedEntries.set(entryName, finalTargetIdentity);
}
async function assertExactSnapshotContents(snapshotDir) {
	await assertSnapshotContents(snapshotDir, /* @__PURE__ */ new Set([SNAPSHOT_MANIFEST_FILENAME, SNAPSHOT_SQLITE_FILENAME]));
}
async function assertPendingSnapshotContents(snapshotDir) {
	await assertSnapshotContents(snapshotDir, /* @__PURE__ */ new Set([
		SNAPSHOT_MANIFEST_FILENAME,
		SNAPSHOT_PENDING_FILENAME,
		SNAPSHOT_SQLITE_FILENAME
	]));
}
async function assertSnapshotContents(snapshotDir, expected) {
	const entries = await fs$1.readdir(snapshotDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!expected.delete(entry.name)) throw new Error(`SQLite snapshot contains unexpected entry: ${path.join(snapshotDir, entry.name)}`);
		if (entry.isSymbolicLink() || !entry.isFile()) throw new Error(`SQLite snapshot entry must be a regular file: ${path.join(snapshotDir, entry.name)}`);
		if ((await fs$1.lstat(path.join(snapshotDir, entry.name))).nlink > 1) throw new Error(`SQLite snapshot entry must not be hardlinked: ${path.join(snapshotDir, entry.name)}`);
	}
	if (expected.size > 0) throw new Error(`SQLite snapshot is missing ${[...expected].join(", ")}: ${snapshotDir}`);
}
async function classifySnapshotDirectory(snapshotDir) {
	const entries = await fs$1.readdir(snapshotDir, { withFileTypes: true });
	const knownEntries = /* @__PURE__ */ new Set([
		SNAPSHOT_MANIFEST_FILENAME,
		SNAPSHOT_PENDING_FILENAME,
		SNAPSHOT_SQLITE_FILENAME
	]);
	for (const entry of entries) if (!knownEntries.has(entry.name) || entry.isSymbolicLink() || !entry.isFile()) throw new Error(`SQLite snapshot contains unexpected incomplete entry: ${path.join(snapshotDir, entry.name)}`);
	const names = new Set(entries.map((entry) => entry.name));
	if (names.size === 0) return "incomplete";
	if (!names.has(SNAPSHOT_PENDING_FILENAME)) return "committed";
	return names.has("manifest.json") && names.has("database.sqlite") ? "complete-pending" : "incomplete";
}
async function recoverCompletePendingSnapshot(params) {
	const trustedRepositoryPath = await assertTrustedStagingRoot(params.repositoryIdentity, params.repositoryPath);
	await assertDirectoryIdentity(trustedRepositoryPath, params.repositoryIdentity);
	const snapshotDirectory = await pinDirectory(params.snapshotPath, { label: "SQLite pending snapshot directory" });
	try {
		const snapshotIdentity = snapshotDirectory.receipt.identity;
		await assertPrivateStagingDirectory(snapshotIdentity, params.snapshotPath);
		await snapshotDirectory.assertCurrent();
		if (await classifySnapshotDirectory(params.snapshotPath) === "incomplete") throw new Error(`SQLite snapshot is incomplete: ${params.snapshotPath}`);
		const manifest = await readSnapshotManifest(params.snapshotPath);
		assertAllowedDatabaseRole(manifest, params.allowedDatabaseRoles);
		const artifact = await hashSnapshotArtifact(params.snapshotPath);
		const artifactPath = path.join(params.snapshotPath, SNAPSHOT_SQLITE_FILENAME);
		assertArtifactMatchesManifest(artifactPath, artifact, manifest);
		await verifySnapshotDatabaseFile(artifactPath, artifact.stat, manifest, params.validationRootPath);
		requireDirectorySync(await snapshotDirectory.sync(), "SQLite pending snapshot directory");
		const pendingPath = path.join(params.snapshotPath, SNAPSHOT_PENDING_FILENAME);
		const pendingIdentity = lstatIfExistsSync(pendingPath);
		if (pendingIdentity) {
			if (pendingIdentity.isSymbolicLink() || !pendingIdentity.isFile() || pendingIdentity.nlink > 1) throw new Error(`SQLite snapshot pending marker is unsafe: ${pendingPath}`);
			await snapshotDirectory.assertCurrent();
			const currentPendingIdentity = lstatIfExistsSync(pendingPath);
			if (currentPendingIdentity) {
				if (!sameFileIdentity(pendingIdentity, currentPendingIdentity)) throw new Error(`SQLite snapshot pending marker changed: ${pendingPath}`);
				try {
					fs.unlinkSync(pendingPath);
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
				}
			}
		}
		requireDirectorySync(await snapshotDirectory.sync(), "SQLite pending snapshot directory");
		await snapshotDirectory.assertCurrent();
		const committedManifest = await readVerifiedSnapshotManifest(params.snapshotPath);
		if (!isDeepStrictEqual(committedManifest, manifest)) throw new Error(`SQLite snapshot manifest changed during recovery: ${params.snapshotPath}`);
		assertArtifactMatchesManifest(artifactPath, await hashSnapshotArtifact(params.snapshotPath), committedManifest);
		await assertDirectoryIdentity(trustedRepositoryPath, params.repositoryIdentity);
		return committedManifest;
	} finally {
		await snapshotDirectory.close().catch(() => void 0);
	}
}
async function assertFreshRestorePathsAbsent(databasePath) {
	for (const candidate of [databasePath, ...SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${databasePath}${suffix}`)]) if (await lstatIfExists(candidate)) throw new Error(`Fresh SQLite restore path already exists: ${candidate}`);
}
function assertNoSqliteSidecarsSync(databasePath) {
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) {
		const sidecarPath = `${databasePath}${suffix}`;
		try {
			fs.lstatSync(sidecarPath);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		throw new Error(`Restored SQLite database has unexpected sidecar: ${sidecarPath}`);
	}
}
async function lstatIfExists(pathname) {
	try {
		return await fs$1.lstat(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function lstatIfExistsSync(pathname) {
	try {
		return fs.lstatSync(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function removePrivateDirectoryIfOwned(directoryPath, expectedIdentity, allowedEntries) {
	const currentIdentity = await lstatIfExists(directoryPath);
	if (!currentIdentity) return false;
	if (currentIdentity.isSymbolicLink() || !currentIdentity.isDirectory() || !sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`Private SQLite staging directory changed before cleanup: ${directoryPath}`);
	const entries = await fs$1.readdir(directoryPath, { withFileTypes: true });
	const verifiedPaths = [];
	for (const entry of entries) {
		const entryPath = path.join(directoryPath, entry.name);
		if (!allowedEntries.has(entry.name) || entry.isSymbolicLink() || !entry.isFile()) throw new Error(`Private SQLite staging directory has unexpected entry: ${entryPath}`);
		if ((await fs$1.lstat(entryPath)).nlink > 1) throw new Error(`Private SQLite staging file must not be hardlinked: ${entryPath}`);
		verifiedPaths.push(entryPath);
	}
	await Promise.all(verifiedPaths.map(async (entryPath) => await fs$1.unlink(entryPath)));
	await fs$1.rmdir(directoryPath);
	return true;
}
async function withPrivateSqliteStagingDirectory(options) {
	const trustedRootPath = await assertTrustedStagingRoot(options.expectedRootIdentity, options.rootPath);
	await assertDirectoryIdentity(trustedRootPath, options.expectedRootIdentity);
	const directoryPath = await createPrivateSqliteTempDirectory(trustedRootPath, options.prefix);
	const directoryIdentity = await fs$1.lstat(directoryPath);
	let outcome;
	try {
		applyPrivateModeSync(directoryPath, SNAPSHOT_DIRECTORY_MODE);
		await assertPrivateStagingDirectory(directoryIdentity, directoryPath);
		await assertDirectoryIdentity(trustedRootPath, options.expectedRootIdentity);
		outcome = {
			ok: true,
			value: await options.operation(directoryPath, directoryIdentity)
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	let cleanupOutcome;
	try {
		if (!await removePrivateDirectoryIfOwned(directoryPath, directoryIdentity, options.allowedEntries)) throw new Error(`Private SQLite staging directory disappeared: ${directoryPath}`);
		cleanupOutcome = { ok: true };
	} catch (error) {
		cleanupOutcome = {
			ok: false,
			error
		};
	}
	if (!cleanupOutcome.ok) {
		if (!outcome.ok) throw new AggregateError([outcome.error, cleanupOutcome.error], `SQLite staging operation and cleanup both failed: ${directoryPath}`);
		throw new Error(`Failed to clean private SQLite staging directory: ${directoryPath}`, { cause: cleanupOutcome.error });
	}
	requireDirectorySync(await syncDirectory({
		path: trustedRootPath,
		realPath: trustedRootPath,
		identity: options.expectedRootIdentity
	}), "Private SQLite staging root");
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
async function assertTrustedStagingRoot(expectedIdentity, rootPath, options = {}) {
	const resolvedRootPath = path.resolve(rootPath);
	const trustedRootPath = await fs$1.realpath(resolvedRootPath);
	const rootIdentity = await fs$1.lstat(trustedRootPath);
	assertDirectory(rootIdentity, trustedRootPath, "Private SQLite staging root");
	if (!sameFileIdentity(rootIdentity, expectedIdentity)) throw new Error(`Private SQLite staging root changed during operation: ${resolvedRootPath}`);
	if (process.platform === "win32") {
		await assertTrustedWindowsStagingPath(trustedRootPath);
		return trustedRootPath;
	}
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	const unsafeMode = (rootIdentity.mode & 18) !== 0;
	if (uid === void 0 || rootIdentity.uid !== uid || unsafeMode && options.allowModeRepair !== true) throw new Error(`Private SQLite staging root must be owned by the current user and not writable by other users: ${resolvedRootPath}`);
	if (process.platform === "darwin") await assertTrustedMacosAcl(trustedRootPath, options.allowModeRepair !== true);
	await assertTrustedPosixStagingAncestors(trustedRootPath, rootIdentity, uid);
	return trustedRootPath;
}
/** Create or strictly admit a Git repository through the local snapshot root trust policy. */
async function ensurePrivateSnapshotRepositoryRoot(rootPath) {
	try {
		return await assertTrustedStagingRoot(await fs$1.lstat(rootPath), rootPath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	return await assertTrustedStagingRoot((await ensurePrivateDirectory(rootPath, "Git backup repository")).identity, rootPath);
}
async function assertPrivateStagingDirectory(expectedIdentity, directoryPath) {
	const currentIdentity = await fs$1.lstat(directoryPath);
	assertDirectory(currentIdentity, directoryPath, "Private SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`Private SQLite staging directory changed during operation: ${directoryPath}`);
	if (process.platform === "win32") return;
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid === void 0 || currentIdentity.uid !== uid || (currentIdentity.mode & 63) !== 0) throw new Error(`Private SQLite staging directory permissions are unsafe: ${directoryPath}`);
	if (process.platform === "darwin") await assertTrustedMacosAcl(directoryPath, true);
}
async function assertTrustedPosixStagingAncestors(rootPath, rootIdentity, uid) {
	let childIdentity = rootIdentity;
	let currentPath = path.dirname(rootPath);
	while (currentPath !== rootPath) {
		const currentIdentity = await fs$1.lstat(currentPath);
		assertDirectory(currentIdentity, currentPath, "SQLite staging ancestor");
		const writableByOtherUsers = (currentIdentity.mode & 18) !== 0;
		const ownerCanReplaceChild = currentIdentity.uid !== uid && currentIdentity.uid !== 0;
		const stickyOwnerIsTrusted = currentIdentity.uid === uid || currentIdentity.uid === 0;
		const stickyProtectsChild = (currentIdentity.mode & 512) !== 0 && stickyOwnerIsTrusted && childIdentity.uid === uid;
		if (ownerCanReplaceChild || writableByOtherUsers && !stickyProtectsChild) throw new Error(`SQLite staging ancestor must not allow another user to replace its child: ${currentPath}`);
		if (process.platform === "darwin") await assertTrustedMacosAcl(currentPath, false);
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) return;
		childIdentity = currentIdentity;
		currentPath = parentPath;
	}
}
function parseMacosAclEntries(output, pathname) {
	const lines = output.split(/\r?\n/u);
	const header = lines.shift();
	if (!header) throw new Error(`Unable to inspect macOS ACL for SQLite staging: ${pathname}`);
	const entries = [];
	for (const line of lines) {
		if (!/^\s*\d+:\s/u.test(line)) continue;
		const match = line.match(/^\s*\d+:\s+(.+?)\s+(?:inherited\s+)?(allow|deny)\s+([a-z_,]+)\s*$/u);
		if (!match) throw new Error(`Unable to parse macOS ACL for SQLite staging: ${pathname}`);
		const [, principal, effect, permissions] = match;
		if (!principal || !permissions || effect !== "allow" && effect !== "deny") throw new Error(`Unable to parse macOS ACL for SQLite staging: ${pathname}`);
		entries.push({
			principal: normalizeAclPrincipal(principal),
			effect,
			permissions: new Set(permissions.split(","))
		});
	}
	if (/^[^\s]{10}\+/u.test(header) && entries.length === 0) throw new Error(`Unable to parse macOS ACL for SQLite staging: ${pathname}`);
	return entries;
}
function normalizeAclPrincipal(principal) {
	return principal.trim().toLowerCase();
}
async function resolveTrustedMacosAclPrincipals() {
	macosTrustedAclPrincipalsPromise ??= (async () => {
		const dsmemberutil = resolveSystemBin("dsmemberutil");
		if (!dsmemberutil) throw new Error("Unable to resolve dsmemberutil for macOS ACL verification.");
		const currentUsername = os.userInfo().username;
		const usernames = /* @__PURE__ */ new Set([currentUsername, "root"]);
		const trusted = /* @__PURE__ */ new Set();
		for (const username of usernames) {
			const { stdout } = await runExec(dsmemberutil, [
				"getuuid",
				"-U",
				username
			], {
				timeoutMs: 5e3,
				maxBuffer: 64 * 1024
			});
			const uuid = stdout.trim();
			if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/iu.test(uuid)) throw new Error(`Unable to resolve trusted macOS ACL principal for ${username}.`);
			trusted.add(normalizeAclPrincipal(uuid));
			trusted.add(normalizeAclPrincipal(username));
			trusted.add(normalizeAclPrincipal(`user:${username}`));
		}
		return trusted;
	})();
	return await macosTrustedAclPrincipalsPromise;
}
async function assertTrustedMacosAcl(pathname, requirePrivate) {
	const ls = resolveSystemBin("ls");
	if (!ls) throw new Error(`Unable to verify macOS ACL for SQLite staging: ${pathname}`);
	let entries;
	try {
		const [result, trustedPrincipals] = await Promise.all([runExec(ls, [
			"-lden",
			"--",
			pathname
		], {
			timeoutMs: 5e3,
			maxBuffer: 1024 * 1024
		}), resolveTrustedMacosAclPrincipals()]);
		entries = parseMacosAclEntries(result.stdout, pathname).filter((entry) => !trustedPrincipals.has(entry.principal));
	} catch (error) {
		throw new Error(`Unable to verify macOS ACL for SQLite staging: ${pathname}`, { cause: error });
	}
	if (entries.find((entry) => entry.effect === "allow" && (requirePrivate || [...entry.permissions].some((permission) => MACOS_REPLACEMENT_ACL_PERMISSIONS.has(permission))))) throw new Error(`macOS ACL permits untrusted SQLite staging access: ${pathname}`);
}
async function assertTrustedWindowsStagingPath(rootPath) {
	const paths = [rootPath];
	let currentPath = path.dirname(rootPath);
	while (currentPath !== rootPath) {
		paths.push(currentPath);
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) break;
		currentPath = parentPath;
	}
	let security;
	try {
		security = await inspectWindowsPathSecurity(paths);
	} catch (error) {
		throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${rootPath}`, { cause: error });
	}
	if (security.paths.length !== paths.length) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${rootPath}`);
	for (const [index, pathname] of paths.entries()) {
		const pathSecurity = security.paths[index];
		if (!pathSecurity || path.resolve(pathSecurity.path) !== path.resolve(pathname)) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${pathname}`);
		assertTrustedWindowsAcl(pathname, index === 0, security.currentUserSid, pathSecurity);
	}
}
function assertTrustedWindowsAcl(pathname, requirePrivate, currentUserSid, security) {
	if (security.ownerSid !== currentUserSid && !WINDOWS_TRUSTED_OWNER_SIDS.has(security.ownerSid)) throw new Error(`Windows staging path is owned by an untrusted principal: ${pathname}`);
	const allowedEntries = security.entries.filter((entry) => entry.accessType === "Allow");
	if (allowedEntries.length === 0) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${pathname}`);
	if (allowedEntries.filter((entry) => entry.principal !== currentUserSid && !WINDOWS_TRUSTED_ACCESS_SIDS.has(entry.principal)).map(windowsSecurityEntryToAclEntry).filter((entry) => windowsAclEntryPermitsUnsafeStagingAccess(entry, requirePrivate)).length > 0) throw new Error(`Windows ACL permits untrusted SQLite staging access: ${pathname}`);
}
function windowsSecurityEntryToAclEntry(entry) {
	const rights = WINDOWS_FILE_RIGHTS.filter(([right]) => (entry.rightsMask & right) !== 0).map(([, name]) => name);
	if ((entry.rightsMask & ~WINDOWS_KNOWN_FILE_RIGHTS_MASK) !== 0) rights.push("UNKNOWN");
	const inheritanceFlags = new Set(entry.inheritanceFlags.split(",").map((flag) => flag.trim()));
	const propagationFlags = new Set(entry.propagationFlags.split(",").map((flag) => flag.trim()));
	const rawFlags = [
		inheritanceFlags.has("ObjectInherit") ? "(OI)" : "",
		inheritanceFlags.has("ContainerInherit") ? "(CI)" : "",
		propagationFlags.has("NoPropagateInherit") ? "(NP)" : "",
		propagationFlags.has("InheritOnly") ? "(IO)" : ""
	].join("");
	return {
		principal: entry.principal,
		rights,
		rawRights: `${rawFlags}(${rights.join(",")})`,
		canRead: (entry.rightsMask & WINDOWS_READ_RIGHTS_MASK) !== 0,
		canWrite: (entry.rightsMask & WINDOWS_WRITE_RIGHTS_MASK) !== 0
	};
}
function windowsAclEntryPermitsUnsafeStagingAccess(entry, requirePrivate) {
	if (!requirePrivate && /\(IO\)/iu.test(entry.rawRights)) return false;
	const rights = entry.rights.map((right) => right.toUpperCase());
	const unsafeRights = requirePrivate ? WINDOWS_STAGING_ACCESS_RIGHTS : WINDOWS_STAGING_REPLACEMENT_RIGHTS;
	return requirePrivate && (entry.canWrite || entry.canRead) || rights.some((right) => unsafeRights.has(right));
}
async function inspectWindowsPathSecurity(pathnames) {
	const stdout = await runEncodedWindowsPowerShell([
		"$ErrorActionPreference = 'Stop'",
		`$paths = ConvertFrom-Json ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(JSON.stringify(pathnames), "utf8").toString("base64")}')))`,
		"$pathSecurity = @($paths | ForEach-Object { $path = [string]$_; $acl = Get-Acl -LiteralPath $path; $entries = @($acl.Access | ForEach-Object { $identity = $_.IdentityReference; try { $principal = $identity.Translate([System.Security.Principal.SecurityIdentifier]).Value } catch { $principal = [string]$identity.Value }; $rightsMask = ([int64][int32]$_.FileSystemRights) -band 0xffffffffL; [pscustomobject]@{ principal = $principal; accessType = [string]$_.AccessControlType; rightsMask = $rightsMask; inheritanceFlags = [string]$_.InheritanceFlags; propagationFlags = [string]$_.PropagationFlags } }); [pscustomobject]@{ path = $path; ownerSid = $acl.GetOwner([System.Security.Principal.SecurityIdentifier]).Value; entries = $entries } })",
		"$payload = [pscustomobject]@{ currentUserSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value; paths = $pathSecurity }",
		"$json = ConvertTo-Json -InputObject $payload -Compress -Depth 4",
		"[Console]::Out.Write([Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json)))"
	].join("; "), WINDOWS_ACL_METADATA_MAX_BUFFER);
	let parsed;
	try {
		parsed = JSON.parse(Buffer.from(stdout.trim(), "base64").toString("utf8"));
	} catch (error) {
		throw new Error("Unable to parse Windows ACL metadata.", { cause: error });
	}
	const result = WINDOWS_PATH_SECURITY_SCHEMA.safeParse(parsed);
	if (!result.success) throw new Error("Invalid Windows ACL metadata.", { cause: result.error });
	return result.data;
}
async function runEncodedWindowsPowerShell(command, maxBuffer) {
	const powershell = resolveSystemBin("powershell");
	if (!powershell) throw new Error("Unable to resolve PowerShell for Windows SQLite path security.");
	try {
		const { stdout } = await runExec(powershell, buildEncodedPowerShellArgs(command), {
			timeoutMs: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS,
			maxBuffer
		});
		return stdout;
	} catch (error) {
		throw buildPowerShellFailureCause(error);
	}
}
async function removePublishedSnapshotDirectoryIfOwned(directoryPath, expectedIdentity, publishedEntries) {
	const currentIdentity = await lstatIfExists(directoryPath);
	if (!currentIdentity || currentIdentity.isSymbolicLink() || !currentIdentity.isDirectory() || !sameFileIdentity(currentIdentity, expectedIdentity)) return false;
	const entries = await fs$1.readdir(directoryPath, { withFileTypes: true });
	for (const entry of entries) {
		const expectedEntryIdentity = publishedEntries.get(entry.name);
		if (!expectedEntryIdentity || entry.isSymbolicLink() || !entry.isFile()) continue;
		const entryPath = path.join(directoryPath, entry.name);
		if (sameFileIdentity(await fs$1.lstat(entryPath), expectedEntryIdentity)) await fs$1.unlink(entryPath);
	}
	if ((await fs$1.readdir(directoryPath)).length > 0) return false;
	await fs$1.rmdir(directoryPath);
	return true;
}
//#endregion
//#region src/snapshot/git-backup.ts
const GIT_BACKUP_MATERIALIZE_MAX_BYTES = 1024 * 1024 * 1024;
const GIT_BACKUP_DIAGNOSTIC_MAX_LENGTH = 500;
const GIT_BACKUP_NON_BACKUP_HISTORY_WARNING = "repository history contains non-backup commits; use a dedicated backup repository";
function sanitizeGitBackupDiagnostic(value) {
	return value.replace(/:\/\/[^@\s]+@/gu, "://***@").slice(0, GIT_BACKUP_DIAGNOSTIC_MAX_LENGTH);
}
async function assertGitRepository(repositoryPath, env) {
	const topLevel = await requireGitCommand(repositoryPath, ["rev-parse", "--show-toplevel"], { env });
	const [canonicalTopLevel, canonicalRepository] = await Promise.all([fs$1.realpath(topLevel), fs$1.realpath(repositoryPath)]);
	if (canonicalTopLevel !== canonicalRepository) throw new Error(`Backup repository must be the Git worktree root: ${repositoryPath}`);
}
/** Initialize or adopt an operator-owned Git backup repository. */
async function initializeGitBackupRepository(params) {
	const repositoryPath = path.resolve(params.repositoryPath);
	const stateDir = path.resolve(params.stateDir);
	const [canonicalRepositoryPath, canonicalStateDir] = await Promise.all([canonicalPathFromExistingAncestor(repositoryPath), canonicalPathFromExistingAncestor(stateDir)]);
	if (isPathInside(canonicalStateDir, canonicalRepositoryPath) || isPathInside(canonicalRepositoryPath, canonicalStateDir)) throw new Error(`Git backup repository must be outside the OpenClaw state directory: ${stateDir}`);
	try {
		await ensurePrivateSnapshotRepositoryRoot(repositoryPath);
	} catch (error) {
		throw new Error(`Git backup repository must be owned by the current user and not writable by other users: ${repositoryPath}. Fix its ownership and run chmod 700 ${repositoryPath}.`, { cause: error });
	}
	if ((await executeGitCommand(repositoryPath, ["rev-parse", "--show-toplevel"], { env: params.gitEnv })).code !== 0) await requireGitCommand(repositoryPath, ["init"], { env: params.gitEnv });
	await assertGitRepository(repositoryPath, params.gitEnv);
	const remote = params.remote?.trim();
	if (remote) {
		const existing = await executeGitCommand(repositoryPath, [
			"remote",
			"get-url",
			"origin"
		], { env: params.gitEnv });
		if (existing.code === 0 && existing.stdout.trim() !== remote) throw new Error(`Git backup repository already has a different origin: ${sanitizeGitBackupDiagnostic(existing.stdout.trim())}`);
		if (existing.code !== 0) await requireGitCommand(repositoryPath, [
			"remote",
			"add",
			"origin",
			remote
		], { env: params.gitEnv });
	}
	return { repositoryPath };
}
async function isBackupOwnedScope(scopePath) {
	const identity = await fs$1.lstat(scopePath).catch((error) => error.code === "ENOENT" ? void 0 : null);
	if (identity === void 0) return true;
	if (!identity?.isDirectory()) return false;
	try {
		if ((await fs$1.readdir(scopePath)).length === 0) return true;
		parseGitBackupManifest(await fs$1.readFile(path.join(scopePath, GIT_BACKUP_MANIFEST), "utf8"), scopePath);
		return true;
	} catch {
		return false;
	}
}
async function assertBackupOwnedScope(scopePath) {
	if (!await isBackupOwnedScope(scopePath)) throw new Error(`Refusing to replace non-backup-owned path ${scopePath}; the repository must be dedicated to OpenClaw backups.`);
}
async function removeStaleAgentScopes(repositoryPath) {
	const agentsPath = path.join(repositoryPath, "agents");
	let entries;
	try {
		entries = await fs$1.readdir(agentsPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const scopes = entries.map((entry) => path.join(agentsPath, entry));
	await Promise.all(scopes.map(async (scope) => await assertBackupOwnedScope(scope)));
	await Promise.all(scopes.map(async (scope) => await fs$1.rm(scope, { recursive: true })));
}
async function copyStagedScope(stagingRoot, repositoryPath, identity) {
	const relative = gitBackupScopePath(identity);
	const source = path.join(stagingRoot, relative);
	const target = path.join(repositoryPath, relative);
	await assertBackupOwnedScope(target);
	await fs$1.rm(target, {
		recursive: true,
		force: true
	});
	await fs$1.mkdir(path.dirname(target), {
		recursive: true,
		mode: 448
	});
	await fs$1.cp(source, target, {
		recursive: true,
		force: false
	});
}
async function commitGitBackup(params) {
	const email = await executeGitCommand(params.repositoryPath, [
		"config",
		"--get",
		"user.email"
	], { env: params.env });
	const identityArgs = email.code === 0 && email.stdout.trim() ? [] : [
		"-c",
		"user.name=OpenClaw",
		"-c",
		"user.email=backup@openclaw.local"
	];
	await requireGitCommand(params.repositoryPath, [
		...identityArgs,
		"commit",
		"-m",
		params.message,
		"--",
		...params.scopes
	], { env: params.env });
	return await requireGitCommand(params.repositoryPath, ["rev-parse", "HEAD"], { env: params.env });
}
/** Snapshot selected databases, update the deterministic tree, and commit one Git revision. */
async function createGitBackup(params) {
	const repositoryPath = path.resolve(params.repositoryPath);
	await initializeGitBackupRepository({
		repositoryPath,
		stateDir: params.stateDir,
		gitEnv: params.gitEnv
	});
	const stagingRoot = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-git-backup-"));
	await fs$1.chmod(stagingRoot, 448);
	const manifests = [];
	try {
		for (const database of params.databases) {
			const outputPath = path.join(stagingRoot, gitBackupScopePath(database.identity));
			await fs$1.mkdir(path.dirname(outputPath), {
				recursive: true,
				mode: 448
			});
			const copyPath = path.join(stagingRoot, `${database.identity.role}-${manifests.length}.sqlite`);
			await createOpenClawSnapshotCopy({
				database,
				targetPath: copyPath
			});
			manifests.push(await dumpGitBackupDatabase({
				snapshotPath: copyPath,
				outputPath,
				identity: database.identity,
				excludeSecrets: params.excludeSecrets
			}));
			await fs$1.rm(copyPath, { force: true });
		}
		if (params.all) await removeStaleAgentScopes(repositoryPath);
		for (const database of params.databases) await copyStagedScope(stagingRoot, repositoryPath, database.identity);
	} finally {
		await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
	await Promise.all(["global", "agents"].map(async (scope) => fs$1.mkdir(path.join(repositoryPath, scope), {
		recursive: true,
		mode: 448
	})));
	await requireGitCommand(repositoryPath, [
		"add",
		"-A",
		"--",
		"global",
		"agents"
	], { env: params.gitEnv });
	const changed = await requireGitCommand(repositoryPath, [
		"status",
		"--porcelain",
		"--",
		"global",
		"agents"
	], { env: params.gitEnv });
	let commit;
	if (changed) {
		const now = params.now ?? /* @__PURE__ */ new Date();
		if (!Number.isFinite(now.getTime())) throw new Error("Git backup timestamp is invalid.");
		const stagedBackupPaths = await requireGitCommand(repositoryPath, [
			"diff",
			"--cached",
			"--name-only",
			"--",
			"global",
			"agents"
		], { env: params.gitEnv });
		const commitScopes = ["global", "agents"].filter((scope) => stagedBackupPaths.split("\n").some((entry) => entry.startsWith(`${scope}/`)));
		commit = await commitGitBackup({
			repositoryPath,
			message: `openclaw backup ${now.toISOString()}`,
			scopes: commitScopes,
			env: params.gitEnv
		});
	}
	let pushed = false;
	let pushWarning;
	if (params.push) if (await requireGitCommand(repositoryPath, [
		"rev-list",
		"HEAD",
		"--invert-grep",
		"--grep=^openclaw backup ",
		"--count"
	], { env: params.gitEnv }) !== "0") pushWarning = GIT_BACKUP_NON_BACKUP_HISTORY_WARNING;
	else {
		const pushedResult = await executeGitCommand(repositoryPath, [
			"push",
			"-u",
			"origin",
			"HEAD"
		], { env: params.gitEnv });
		if (pushedResult.code === 0) pushed = true;
		else pushWarning = sanitizeGitBackupDiagnostic((pushedResult.stderr || pushedResult.stdout).trim() || "git push failed");
	}
	return {
		repositoryPath,
		...commit ? { commit } : {},
		noChanges: !changed,
		pushed,
		...pushWarning ? { pushWarning } : {},
		manifests
	};
}
async function resolveGitCommit(repositoryPath, ref) {
	return await requireGitCommand(repositoryPath, [
		"rev-parse",
		"--verify",
		`${ref?.trim() || "HEAD"}^{commit}`
	]);
}
/** Materialize one database scope from a Git ref into a private temporary directory. */
async function materializeGitBackupRef(params) {
	const repositoryPath = path.resolve(params.repositoryPath);
	await assertGitRepository(repositoryPath);
	const commit = await resolveGitCommit(repositoryPath, params.ref);
	const scope = gitBackupScopePath(params.identity).split(path.sep).join("/");
	const files = (await requireGitCommand(repositoryPath, [
		"ls-tree",
		"-r",
		"--name-only",
		commit,
		"--",
		scope
	])).split("\n").filter(Boolean);
	if ([.../* @__PURE__ */ new Set([`${scope}/manifest.json`, `${scope}/schema.sql`])].some((entry) => !files.includes(entry))) throw new Error(`Git backup ref ${commit} does not contain ${scope}.`);
	const root = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-git-restore-"));
	await fs$1.chmod(root, 448);
	const outputPath = path.join(root, scope);
	try {
		for (const file of files) {
			if (file !== `${scope}/manifest.json` && file !== `${scope}/schema.sql` && !file.startsWith(`${scope}/tables/`)) throw new Error(`Git backup ref contains an unexpected file: ${file}`);
			const relative = file.slice(scope.length + 1);
			const destination = path.join(outputPath, relative);
			await fs$1.mkdir(path.dirname(destination), {
				recursive: true,
				mode: 448
			});
			await fs$1.writeFile(destination, await requireGitCommandBuffer(repositoryPath, ["show", `${commit}:${file}`], { maxOutputBytes: GIT_BACKUP_MATERIALIZE_MAX_BYTES }), { mode: 384 });
		}
		return {
			commit,
			path: outputPath,
			cleanup: async () => await fs$1.rm(root, {
				recursive: true,
				force: true
			})
		};
	} catch (error) {
		await fs$1.rm(root, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		throw error;
	}
}
/** Restore one database from a Git ref to a caller-selected fresh path. */
async function restoreGitBackupRef(params) {
	const materialized = await materializeGitBackupRef(params);
	try {
		return {
			...await restoreGitBackupDirectory({
				sourcePath: materialized.path,
				targetPath: params.targetPath,
				expectedIdentity: params.identity
			}),
			commit: materialized.commit
		};
	} finally {
		await materialized.cleanup();
	}
}
/** Verify a Git snapshot by restoring it privately and comparing every table digest. */
async function verifyGitBackupRef(params) {
	const scratch = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-git-verify-"));
	await fs$1.chmod(scratch, 448);
	try {
		return await restoreGitBackupRef({
			...params,
			targetPath: path.join(scratch, "database.sqlite")
		});
	} finally {
		await fs$1.rm(scratch, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
/** Return bounded Git backup log entries for CLI rendering. */
async function readGitBackupLog(params) {
	await assertGitRepository(params.repositoryPath);
	const result = await executeGitCommand(params.repositoryPath, [
		"log",
		`--max-count=${params.limit}`,
		"--pretty=format:%H%x09%cI%x09%s"
	]);
	if (result.code !== 0) {
		if (result.stderr.includes("does not have any commits yet")) return [];
		throw new Error((result.stderr || result.stdout).trim());
	}
	return result.stdout.split("\n").filter(Boolean).map((line) => {
		const [commit = "", date = "", ...message] = line.split("	");
		return {
			commit,
			date,
			message: message.join("	")
		};
	});
}
//#endregion
//#region src/commands/backup-git.ts
const GIT_BACKUP_PUSH_CREDENTIAL_WARNING = "Warning: pushed backup history contains credential material; keep the Git remote private.";
function resolveRequiredPath$1(value, label) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error(`Missing required ${label} value.`);
	return path.resolve(resolveUserPath(trimmed));
}
async function resolveCreateDatabases(runtime, options) {
	const agents = [...new Set((options.agents ?? []).map((agent) => normalizeAgentId(agent)))];
	const explicit = options.global === true || agents.length > 0;
	if (options.all && explicit) throw new Error("Use --all by itself, or select --global and --agent scopes explicitly.");
	if (!options.all && !explicit) throw new Error("Choose at least one Git backup scope: --all, --global, or --agent <id>.");
	const databases = [];
	if (options.all || options.global) databases.push({
		path: await fs$1.realpath(resolveOpenClawStateSqlitePath()),
		identity: { role: "global" }
	});
	const allAgentIds = options.all ? [...new Set(listOpenClawRegisteredAgentDatabases().map((entry) => entry.agentId))].toSorted() : agents;
	for (const agentId of allAgentIds) {
		const canonicalPath = resolveOpenClawAgentSqlitePath({ agentId });
		let resolvedPath;
		try {
			resolvedPath = await fs$1.realpath(canonicalPath);
		} catch (error) {
			if (options.all && error.code === "ENOENT") {
				runtime.error(`Warning: skipping agent ${agentId}: no database at ${canonicalPath}`);
				continue;
			}
			throw error;
		}
		databases.push({
			path: resolvedPath,
			identity: {
				role: "agent",
				agentId
			}
		});
	}
	if (databases.length === 0) throw new Error("No Git backup databases were found for the selected scope.");
	return databases;
}
function resolveOneIdentity(options) {
	const agent = options.agent?.trim();
	if (options.global === true && agent) throw new Error("Choose exactly one Git backup scope: --global or --agent <id>.");
	if (options.global !== true && !agent) throw new Error("Choose a Git backup scope: --global or --agent <id>.");
	return options.global === true ? { role: "global" } : {
		role: "agent",
		agentId: normalizeAgentId(agent)
	};
}
function recordGitOutcomeBestEffort(runtime, params) {
	try {
		recordBackupRunOutcome({
			kind: "git",
			archivePath: params.repositoryPath,
			status: params.status,
			target: params.target,
			error: params.error,
			pushFailed: params.pushFailed
		});
	} catch (error) {
		runtime.error(`Warning: the Git backup outcome could not be recorded: ${formatErrorMessage(error)}`);
	}
}
async function backupGitInitCommand(runtime, options) {
	const result = await initializeGitBackupRepository({
		repositoryPath: resolveRequiredPath$1(options.repository, "--repository"),
		stateDir: resolveStateDir(),
		remote: options.remote
	});
	if (options.json) writeRuntimeJson(runtime, result);
	else runtime.log(`Git backup repository ready: ${shortenHomePath(result.repositoryPath)}`);
	return result;
}
async function backupGitCreateCommand(runtime, options) {
	const repositoryPath = resolveRequiredPath$1(options.repository, "--repository");
	if (options.push && !options.excludeSecrets) runtime.error(GIT_BACKUP_PUSH_CREDENTIAL_WARNING);
	try {
		const result = await createGitBackup({
			repositoryPath,
			stateDir: resolveStateDir(),
			databases: await resolveCreateDatabases(runtime, options),
			all: options.all,
			excludeSecrets: options.excludeSecrets,
			push: options.push
		});
		recordGitOutcomeBestEffort(runtime, {
			repositoryPath,
			status: "ok",
			target: result.commit,
			error: result.pushWarning,
			...result.pushWarning ? { pushFailed: true } : {}
		});
		if (options.json) writeRuntimeJson(runtime, result);
		else if (result.noChanges) runtime.log(`Git backup: no changes (${shortenHomePath(repositoryPath)})`);
		else runtime.log(`Git backup committed: ${result.commit}`);
		if (result.pushWarning) runtime.error(`Warning: Git backup committed, but push failed: ${result.pushWarning}`);
		return result;
	} catch (error) {
		recordGitOutcomeBestEffort(runtime, {
			repositoryPath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
async function backupGitLogCommand(runtime, options) {
	const repositoryPath = resolveRequiredPath$1(options.repository, "--repository");
	const limit = options.limit ?? 20;
	if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("--limit must be a positive integer.");
	const entries = await readGitBackupLog({
		repositoryPath,
		limit
	});
	if (options.json) writeRuntimeJson(runtime, {
		repositoryPath,
		entries
	});
	else if (entries.length === 0) runtime.log(`No Git backup commits in ${shortenHomePath(repositoryPath)}.`);
	else runtime.log(entries.map((entry) => `${entry.commit}\t${entry.date}\t${entry.message}`).join("\n"));
	return entries;
}
async function backupGitVerifyCommand(runtime, options) {
	const result = await verifyGitBackupRef({
		repositoryPath: resolveRequiredPath$1(options.repository, "--repository"),
		identity: resolveOneIdentity(options),
		ref: options.ref
	});
	if (options.json) writeRuntimeJson(runtime, result);
	else {
		for (const table of result.tables) runtime.log(`${table.ok ? "ok" : "failed"}\t${table.table}\t${table.rows}\t${table.sha256}`);
		runtime.log(`Git backup verified: ${result.commit}`);
	}
	return result;
}
async function backupGitRestoreCommand(runtime, options) {
	const result = await restoreGitBackupRef({
		repositoryPath: resolveRequiredPath$1(options.repository, "--repository"),
		identity: resolveOneIdentity(options),
		ref: options.ref,
		targetPath: resolveRequiredPath$1(options.target, "--target")
	});
	if (options.json) writeRuntimeJson(runtime, result);
	else {
		runtime.log(`Git backup restored: ${shortenHomePath(result.targetPath)} (${result.commit})`);
		if (result.excludedTables.length > 0) runtime.error(`Warning: this redacted backup omits tables: ${result.excludedTables.join(", ")}`);
	}
	return result;
}
//#endregion
//#region src/commands/backup-restore.ts
const BACKUP_RESTORE_WARNINGS = [
	"Restoring an archive is time travel: every restored state surface rolls back to the archive timestamp.",
	"Messaging-channel credentials with ratchet state, especially WhatsApp, may desynchronize after rollback and require relinking.",
	"Approvals and delivery/dedupe state also roll back; review pending approvals before resuming the Gateway.",
	"Plugin node_modules are not archived; after activation, run `openclaw plugins update <id>` or reinstall with `openclaw plugins install <spec> --force`.",
	"Generated plugin-skills links are not archived; after activation, run `openclaw skills list` or start an agent session to rebuild them."
];
function resolveRequiredTarget(value) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error("Missing required --target value.");
	return path.resolve(resolveUserPath(trimmed));
}
async function assertTargetOutsideLiveState(targetPath) {
	const [canonicalTarget, canonicalStateDir] = await Promise.all([canonicalizePathForContainment(targetPath), canonicalizePathForContainment(resolveStateDir())]);
	if (isPathWithin(canonicalTarget, canonicalStateDir)) throw new Error(`Backup restore target must be outside the live OpenClaw state directory: ${targetPath}`);
}
async function prepareRestoreTarget(targetPath) {
	try {
		if (!(await fs$1.lstat(targetPath)).isDirectory()) throw new Error(`Backup restore target must be a directory: ${targetPath}`);
		if ((await fs$1.readdir(targetPath)).length > 0) throw new Error(`Backup restore target directory must be empty: ${targetPath}`);
		return { created: false };
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	await fs$1.mkdir(targetPath, {
		recursive: true,
		mode: 448
	});
	return { created: true };
}
async function cleanupFailedRestore(targetPath, created) {
	if (created) {
		await fs$1.rm(targetPath, {
			recursive: true,
			force: true
		});
		return;
	}
	for (const entry of await fs$1.readdir(targetPath)) await fs$1.rm(path.join(targetPath, entry), {
		recursive: true,
		force: true
	});
}
async function extractBackupArchive(archivePath, targetPath) {
	let extractionError;
	await tar.x({
		file: archivePath,
		gzip: true,
		maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
		cwd: targetPath,
		strict: false,
		preserveOwner: false,
		onwarn: (code, message, data) => {
			extractionError ??= data instanceof Error ? data : Object.assign(/* @__PURE__ */ new Error(`${code}: ${message}`), data);
		}
	});
	if (extractionError) throw extractionError;
}
function formatRestoreResult(result) {
	return [
		`Backup archive restored to staging: ${shortenHomePath(result.targetPath)}`,
		`Verified archive: ${shortenHomePath(result.archivePath)}`,
		`Archive root: ${result.archiveRoot}`,
		`Archive entries restored: ${result.entryCount}`,
		"",
		"Rollback warnings:",
		...result.warnings.map((warning) => `- ${warning}`),
		"",
		"Activation is explicit: stop the Gateway, move the restored asset tree into place or point OPENCLAW_STATE_DIR at the restored state asset, then run `openclaw doctor`."
	].join("\n");
}
/** Verify first, then extract a whole backup archive into a fresh staging directory. */
async function backupRestoreCommand(runtime, options) {
	const targetPath = resolveRequiredTarget(options.target);
	await assertTargetOutsideLiveState(targetPath);
	const verified = await verifyBackupArchive(options.archive);
	const target = await prepareRestoreTarget(targetPath);
	let extractionError;
	let extractionFailed = false;
	try {
		await extractBackupArchive(verified.archivePath, targetPath);
	} catch (caughtExtractionError) {
		extractionError = caughtExtractionError;
		extractionFailed = true;
	}
	if (extractionFailed) {
		let cleanupError;
		let cleanupFailed = false;
		try {
			await cleanupFailedRestore(targetPath, target.created);
		} catch (caughtCleanupError) {
			cleanupError = caughtCleanupError;
			cleanupFailed = true;
		}
		if (cleanupFailed) throw new AggregateError([extractionError, cleanupError], `Backup restore failed and the incomplete target could not be cleaned: ${targetPath}. Cleanup error: ${formatErrorMessage(cleanupError)}`, { cause: extractionError });
		throw new Error(`Backup restore failed; the incomplete target was cleaned: ${targetPath}`, { cause: extractionError });
	}
	const result = {
		...verified,
		targetPath,
		warnings: [...BACKUP_RESTORE_WARNINGS]
	};
	if (options.json) writeRuntimeJson(runtime, result);
	else runtime.log(formatRestoreResult(result));
	return result;
}
//#endregion
//#region src/commands/backup-schedule.ts
const BACKUP_CRON_JOB_NAME = "openclaw-backup-scheduled";
const LOCAL_GATEWAY_REQUIRED_ERROR = "backup enable manages backups on the Gateway host and currently requires a local Gateway. Create the cron job manually with openclaw cron add for remote Gateways.";
/**
* Unattended pushed schedules make credential retention durable in remote
* history, so they redact by default; --include-secrets is the explicit
* full-fidelity override. Local (non-push) schedules keep full fidelity for
* complete restores.
*/
function resolveScheduledRedaction(options) {
	if (options.excludeSecrets && options.includeSecrets) throw new Error("Use either --exclude-secrets or --include-secrets, not both.");
	if (!options.push) return options.excludeSecrets === true;
	return options.includeSecrets !== true;
}
function resolveRepository(value) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error("Missing required --repository value.");
	return path.resolve(resolveUserPath(trimmed));
}
function buildScheduledArgv(options, repositoryPath, redactSecrets) {
	const agent = options.agent?.trim();
	if (options.globalOnly && agent) throw new Error("Use either --global-only or --agent <id>, not both.");
	return [
		"openclaw",
		"backup",
		"git",
		"create",
		"--repository",
		repositoryPath,
		...options.globalOnly ? ["--global"] : agent ? ["--agent", normalizeAgentId(agent)] : ["--all"],
		...options.push ? ["--push"] : [],
		...redactSecrets ? ["--exclude-secrets"] : []
	];
}
async function findScheduledBackup(options) {
	return (await callGatewayFromCli("cron.list", options, {
		includeDisabled: true,
		query: BACKUP_CRON_JOB_NAME,
		limit: 200,
		offset: 0
	})).jobs?.find((job) => job.declarationKey === BACKUP_CRON_JOB_NAME);
}
async function assertLocalGatewayScheduleTarget(options) {
	if (!await isImplicitLocalGatewayTargetFromCli(options)) throw new Error(LOCAL_GATEWAY_REQUIRED_ERROR);
}
async function backupEnableCommand(runtime, options) {
	await assertLocalGatewayScheduleTarget(options);
	const repositoryPath = resolveRepository(options.repository);
	const every = options.every?.trim() || "24h";
	const everyMs = parseDurationMs(every, { defaultUnit: "ms" });
	if (!Number.isSafeInteger(everyMs) || everyMs <= 0) throw new Error("--every must be a positive duration such as 6h or 24h.");
	const redactSecrets = resolveScheduledRedaction(options);
	const spec = {
		declarationKey: BACKUP_CRON_JOB_NAME,
		name: BACKUP_CRON_JOB_NAME,
		enabled: true,
		schedule: {
			kind: "every",
			everyMs
		},
		sessionTarget: "isolated",
		wakeMode: "now",
		payload: {
			kind: "command",
			argv: buildScheduledArgv(options, repositoryPath, redactSecrets)
		},
		delivery: { mode: "none" }
	};
	if (options.push) {
		if ((await executeGitCommand(repositoryPath, [
			"remote",
			"get-url",
			"origin"
		])).code !== 0) throw new Error(`--push requires an origin remote. Run: openclaw backup git init --repository ${shortenHomePath(repositoryPath)} --remote <url>`);
		if (!redactSecrets) runtime.error(GIT_BACKUP_PUSH_CREDENTIAL_WARNING);
	}
	const result = await callGatewayFromCli("cron.add", options, spec);
	const id = result.job?.id;
	if (!id) throw new Error("cron.add returned no scheduled backup job id.");
	const updated = result.created === false;
	runtime.log(`Scheduled Git backups ${updated ? "updated" : "enabled"}: every ${every} to ${shortenHomePath(repositoryPath)}`);
	return {
		id,
		updated
	};
}
async function backupDisableCommand(runtime, options) {
	await assertLocalGatewayScheduleTarget(options);
	const existing = await findScheduledBackup(options);
	if (!existing) {
		runtime.log("Scheduled Git backups are already disabled.");
		return { removed: false };
	}
	await callGatewayFromCli("cron.remove", options, { id: existing.id });
	runtime.log("Scheduled Git backups disabled.");
	return { removed: true };
}
//#endregion
//#region src/commands/backup-sqlite.ts
const OPENCLAW_SNAPSHOT_READ_OPTIONS = { allowedDatabaseRoles: ["global", "agent"] };
async function backupSqliteCreateCommand(runtime, options) {
	const repositoryPath = resolveRequiredPath(options.repository, "--repository");
	try {
		const database = await resolveSnapshotDatabase(options);
		const result = await createLocalSqliteSnapshotProvider({ repositoryPath }).create(database);
		const report = {
			ok: true,
			snapshotPath: result.ref.path,
			manifest: result.manifest
		};
		recordSqliteOutcomeBestEffort(runtime, {
			archivePath: report.snapshotPath,
			status: "ok"
		});
		writeCreateResult(runtime, options, report);
		return report;
	} catch (error) {
		recordSqliteOutcomeBestEffort(runtime, {
			archivePath: repositoryPath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
function recordSqliteOutcomeBestEffort(runtime, params) {
	try {
		recordBackupRunOutcome({
			kind: "sqlite-snapshot",
			...params
		});
	} catch (error) {
		runtime.error(`Warning: backup completed, but its run record could not be written: ${formatErrorMessage(error)}`);
	}
}
async function backupSqliteListCommand(runtime, options) {
	const repositoryPath = resolveRequiredPath(options.repository, "--repository");
	const report = {
		ok: true,
		repositoryPath,
		snapshots: await createLocalSqliteSnapshotProvider({
			repositoryPath,
			...OPENCLAW_SNAPSHOT_READ_OPTIONS
		}).list()
	};
	writeListResult(runtime, options, report);
	return report;
}
async function backupSqliteVerifyCommand(runtime, snapshot, options) {
	const resolved = resolveSnapshot(snapshot, options.scratch);
	const verified = await resolved.provider.verify(resolved.ref);
	const report = {
		ok: true,
		snapshotPath: resolved.ref.path,
		manifest: verified.manifest
	};
	writeVerifyResult(runtime, options, report);
	return report;
}
async function backupSqliteRestoreCommand(runtime, snapshot, options) {
	const resolved = resolveSnapshot(snapshot);
	const targetPath = resolveRequiredPath(options.target, "--target");
	const restored = await resolved.provider.restoreFresh(resolved.ref, targetPath);
	const report = {
		ok: true,
		snapshotPath: resolved.ref.path,
		targetPath,
		manifest: restored.manifest
	};
	writeRestoreResult(runtime, options, report);
	return report;
}
async function resolveSnapshotDatabase(options) {
	const rawAgentId = options.agent?.trim();
	if (options.global === true && rawAgentId) throw new Error("Choose exactly one SQLite snapshot source: --global or --agent <id>.");
	if (options.global !== true && !rawAgentId) throw new Error("Choose a SQLite snapshot source: --global or --agent <id>.");
	if (options.global === true) return {
		path: await fs$1.realpath(resolveOpenClawStateSqlitePath()),
		identity: { role: "global" }
	};
	const agentId = normalizeAgentId(rawAgentId);
	return {
		path: await fs$1.realpath(resolveOpenClawAgentSqlitePath({ agentId })),
		identity: {
			role: "agent",
			agentId
		}
	};
}
function resolveSnapshot(snapshot, scratch) {
	const snapshotPath = resolveRequiredPath(snapshot, "<snapshot>");
	const repositoryPath = path.dirname(snapshotPath);
	return {
		provider: createLocalSqliteSnapshotProvider({
			repositoryPath,
			validationRootPath: scratch ? resolveRequiredPath(scratch, "--scratch") : path.dirname(repositoryPath),
			...OPENCLAW_SNAPSHOT_READ_OPTIONS
		}),
		ref: { path: snapshotPath }
	};
}
function resolveRequiredPath(value, label) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error(`Missing required ${label} value.`);
	return path.resolve(resolveUserPath(trimmed));
}
function formatDatabaseIdentity(database) {
	if (database.role === "global") return "global";
	if (database.role === "agent") return `agent:${database.agentId}`;
	return database.id;
}
function writeCreateResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log([
		`SQLite snapshot created: ${shortenHomePath(report.snapshotPath)}`,
		`Database: ${formatDatabaseIdentity(report.manifest.database)}`,
		`Size: ${report.manifest.artifact.sizeBytes} bytes`
	].join("\n"));
}
function writeListResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	if (report.snapshots.length === 0) {
		runtime.log(`No SQLite snapshots in ${shortenHomePath(report.repositoryPath)}.`);
		return;
	}
	runtime.log(report.snapshots.map((snapshot) => `${snapshot.manifest.createdAt}  ${formatDatabaseIdentity(snapshot.manifest.database)}  ${snapshot.manifest.artifact.sizeBytes} bytes  ${shortenHomePath(snapshot.ref.path)}`).join("\n"));
}
function writeVerifyResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log(`SQLite snapshot verified: ${shortenHomePath(report.snapshotPath)} (${formatDatabaseIdentity(report.manifest.database)})`);
}
function writeRestoreResult(runtime, options, report) {
	if (options.json) {
		writeRuntimeJson(runtime, report);
		return;
	}
	runtime.log(`SQLite snapshot restored: ${shortenHomePath(report.targetPath)} (${formatDatabaseIdentity(report.manifest.database)})`);
}
//#endregion
//#region src/cli/program/register.backup.ts
/** Register backup create/verify subcommands. */
function registerBackupCommand(program) {
	const backup = program.command("backup").description("Create, verify, and restore backup archives and SQLite snapshots").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/backup", "docs.openclaw.ai/cli/backup")}\n`);
	backup.command("create").description("Write a backup archive for config, credentials, sessions, and workspaces").option("--output <path>", "Archive path or destination directory").option("--json", "Output JSON", false).option("--dry-run", "Print the backup plan without writing the archive", false).option("--verify", "Verify the archive after writing it", false).option("--only-config", "Back up only the active JSON config file", false).option("--no-include-workspace", "Exclude workspace directories from the backup").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw backup create", "Create a timestamped backup in the current directory."],
		["openclaw backup create --output ~/Backups", "Write the archive into an existing backup directory."],
		["openclaw backup create --dry-run --json", "Preview the archive plan without writing any files."],
		["openclaw backup create --verify", "Create the archive and immediately validate its manifest and payload layout."],
		["openclaw backup create --no-include-workspace", "Back up state/config without agent workspace files."],
		["openclaw backup create --only-config", "Back up only the active JSON config file."]
	])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupCreateCommand(defaultRuntime, {
				output: opts.output,
				json: Boolean(opts.json),
				dryRun: Boolean(opts.dryRun),
				verify: Boolean(opts.verify),
				onlyConfig: Boolean(opts.onlyConfig),
				includeWorkspace: opts.includeWorkspace
			});
		});
	});
	backup.command("verify <archive>").description("Validate a backup archive and its embedded manifest").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup verify ./2026-03-09T08-00-00.000+08-00-openclaw-backup.tar.gz", "Check that the archive structure and manifest are intact."], ["openclaw backup verify ~/Backups/latest.tar.gz --json", "Emit machine-readable verification output."]])}`).action(async (archive, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupVerifyCommand(defaultRuntime, {
				archive,
				json: Boolean(opts.json)
			});
		});
	});
	backup.command("restore <archive>").description("Restore a verified backup archive to a fresh staging directory").requiredOption("--target <dir>", "Fresh target directory; non-empty directories are refused").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup restore ~/Backups/latest.tar.gz --target ./restored-openclaw", "Verify, then extract the whole archive into a fresh staging directory."], ["openclaw backup restore ~/Backups/latest.tar.gz --target ./restored-openclaw --json", "Emit machine-readable restore details and rollback warnings."]])}`).action(async (archive, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupRestoreCommand(defaultRuntime, {
				archive,
				target: opts.target,
				json: Boolean(opts.json)
			});
		});
	});
	registerBackupSqliteCommands(backup);
	registerBackupGitCommands(backup);
	registerBackupScheduleCommands(backup);
}
function collectAgent(value, previous) {
	return [...previous, value];
}
function registerBackupScheduleCommands(backup) {
	addGatewayClientOptions(backup.command("enable").description("Provision a Gateway automation for scheduled Git backups").requiredOption("--repository <path>", "Git backup repository directory").option("--every <duration>", "Backup interval", "24h").option("--push", "Push the current branch to origin after each backup", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--include-secrets", "Keep credential-bearing tables in pushed scheduled backups", false).option("--global-only", "Back up only the shared state database", false).option("--agent <id>", "Back up only one agent database").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupEnableCommand(defaultRuntime, opts);
		});
	}));
	addGatewayClientOptions(backup.command("disable").description("Remove the scheduled Git backup automation").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupDisableCommand(defaultRuntime, opts);
		});
	}));
}
function registerBackupGitCommands(backup) {
	const git = backup.command("git").description("Create and restore deterministic versioned SQLite dumps in Git").action(() => {
		git.outputHelp();
		process.exitCode = 1;
	});
	git.command("init").description("Initialize or adopt an operator-owned Git backup repository").requiredOption("--repository <path>", "Git backup repository directory").option("--remote <url>", "Add the remote as origin").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupGitInitCommand(defaultRuntime, opts);
		});
	});
	git.command("create").description("Dump selected OpenClaw databases and commit one Git revision").requiredOption("--repository <path>", "Git backup repository directory").option("--all", "Back up the shared database and every registered agent database", false).option("--global", "Back up the shared OpenClaw state database", false).option("--agent <id>", "Back up an agent database (repeatable)", collectAgent, []).option("--push", "Push the current branch to origin", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupGitCreateCommand(defaultRuntime, {
				repository: opts.repository,
				all: Boolean(opts.all),
				global: Boolean(opts.global),
				agents: opts.agent,
				push: Boolean(opts.push),
				excludeSecrets: Boolean(opts.excludeSecrets),
				json: Boolean(opts.json)
			});
		});
	});
	git.command("log").description("Show Git backup commits").requiredOption("--repository <path>", "Git backup repository directory").option("--limit <n>", "Maximum commits to show", (value) => Number.parseInt(value, 10), 20).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupGitLogCommand(defaultRuntime, opts);
		});
	});
	git.command("verify").description("Restore and verify one database snapshot from a Git ref").requiredOption("--repository <path>", "Git backup repository directory").option("--ref <commit>", "Commit or ref to verify", "HEAD").option("--global", "Verify the shared state database", false).option("--agent <id>", "Verify one agent database").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupGitVerifyCommand(defaultRuntime, opts);
		});
	});
	git.command("restore").description("Restore one database snapshot from a Git ref to a fresh SQLite file").requiredOption("--repository <path>", "Git backup repository directory").requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused").option("--ref <commit>", "Commit or ref to restore", "HEAD").option("--global", "Restore the shared state database", false).option("--agent <id>", "Restore one agent database").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupGitRestoreCommand(defaultRuntime, opts);
		});
	});
}
function registerBackupSqliteCommands(backup) {
	const sqlite = backup.command("sqlite").description("Create, list, verify, and restore SQLite snapshots").action(() => {
		sqlite.outputHelp();
		process.exitCode = 1;
	});
	sqlite.command("create").description("Create a compact, verified snapshot of an OpenClaw SQLite database").option("--global", "Snapshot the shared OpenClaw state database", false).option("--agent <id>", "Snapshot one per-agent OpenClaw database").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup sqlite create --global --repository ~/Backups/openclaw-sqlite", "Snapshot the shared state database."], ["openclaw backup sqlite create --agent main --repository ~/Backups/openclaw-sqlite", "Snapshot the main agent database."]])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupSqliteCreateCommand(defaultRuntime, {
				global: Boolean(opts.global),
				agent: opts.agent,
				repository: opts.repository,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("list").description("List committed snapshots in a repository").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupSqliteListCommand(defaultRuntime, {
				repository: opts.repository,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("verify <snapshot>").description("Verify a snapshot manifest, artifact hash, SQLite integrity, and database owner").option("--scratch <path>", "Existing private directory for verification copies").option("--json", "Output JSON", false).action(async (snapshot, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupSqliteVerifyCommand(defaultRuntime, snapshot, {
				scratch: opts.scratch,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("restore <snapshot>").description("Restore a verified snapshot to a new SQLite database path").requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused").option("--json", "Output JSON", false).action(async (snapshot, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await backupSqliteRestoreCommand(defaultRuntime, snapshot, {
				target: opts.target,
				json: Boolean(opts.json)
			});
		});
	});
}
//#endregion
export { registerBackupCommand };
