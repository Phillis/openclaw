import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger, f as asSafeIntegerInRange, s as asFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import "./fs-safe-X_oyl7Rx.js";
import { n as resolvePathViaExistingAncestorSync } from "./root-path-existing-rEeDyvjI.js";
import "./boundary-path-BPbNzRAg.js";
import { g as resolveGatewayLockDir } from "./paths-CqeDjSA4.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { a as resolveSqliteFilesystemPath, f as clearNodeSqliteKyselyCacheForDatabase, n as requireNodeSqlite, o as tryAcquireExclusiveSqliteCoordinator, s as isSqliteCorruptionError, t as openNodeSqliteDatabase, u as runSqliteImmediateTransactionSync } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, c as FIRST_USE_STATE_TABLES, d as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, i as createNewerSqliteSchemaVersionError, l as LAZY_ADDITIVE_STATE_INDEXES, m as enableNodeSqliteKyselyStatementCache, n as resolveOpenClawStateSqliteDir, o as readSqliteUserVersion, r as resolveOpenClawStateSqlitePath, s as FIRST_USE_STATE_INDEXES, t as resolveOpenClawStateDirForDatabasePath, u as LAZY_ADDITIVE_STATE_TABLES, y as registerNodeSqliteKyselyQueryErrorHandler } from "./openclaw-state-db.paths-gKE3myqW.js";
import { a as assertSqliteTableIntegrity, c as parseSqliteFileGeneration, d as serializeSqliteFileGeneration, i as assertSqlitePhysicalScreen, l as readStableSqliteFileGeneration, n as migrateSqliteSchemaToStrictInTransaction, o as confirmSqliteFileIntegrity, r as assertSqliteIntegrity, s as isTerminalSqliteIntegrityError, u as sameSqliteFileGeneration } from "./sqlite-strict-BCq9LdDO.js";
import { t as resolveSystemBin } from "./resolve-system-bin-ClCg60C2.js";
import { n as decodeWindowsOutputBuffer } from "./windows-encoding-zzUQjdb4.js";
import { n as configureSqlitePreSchemaPragmas, t as configureSqliteConnectionPragmas } from "./sqlite-wal-JFv1PzVq.js";
import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.js";
import { t as createDedupeCache } from "./dedupe-C5V_sRWr.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-E3ku7Huk.js";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "./message-tool-delivery-hints-8OSBEg_c.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText, t as HEARTBEAT_TOKEN } from "./tokens-CMI0yx54.js";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-PR8Utwzg.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-Cr5lTl_D.js";
import { createHash, randomUUID } from "node:crypto";
import fs, { chmodSync, existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFile, execFileSync } from "node:child_process";
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code === "EROFS") return hasRestrictivePermissions(target);
	if (code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/sqlite-coordinator.ts
var SqliteCoordinatorError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
};
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
function runWithSqliteCoordinator(coordinator, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (result && typeof result.then === "function") throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and coordinator release both failed`, operationError);
		throw operationError;
	}
	try {
		coordinator.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its coordinator failed`, releaseError);
	}
	return result;
}
function ensurePrivateSqliteCoordinatorDirectory(directoryPath, coordinatorLabel) {
	try {
		fs.mkdirSync(directoryPath, {
			mode: 448,
			recursive: true
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	const stats = fs.lstatSync(directoryPath);
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new SqliteCoordinatorError(`${coordinatorLabel} directory must be a real directory`);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new SqliteCoordinatorError(`${coordinatorLabel} directory belongs to another user`);
	if (process.platform !== "win32") {
		applyPrivateModeSync(directoryPath, 448);
		const secured = fs.lstatSync(directoryPath);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new SqliteCoordinatorError(`${coordinatorLabel} directory permissions are not private`);
	}
}
//#endregion
//#region src/infra/sqlite-schema-issues.ts
function defaultIssueMessage(code, objectName) {
	const tableName = objectName.split(".", 1)[0];
	switch (code) {
		case "missing-table": return `missing table ${objectName}`;
		case "missing-column":
		case "unexpected-column":
		case "column-definition-drift": return `column definitions differ for ${tableName}`;
		case "table-constraint-drift": return `table constraints differ for ${objectName}`;
		case "table-definition-drift": return `table definition differs for ${objectName}`;
		case "missing-or-drifted-index": return `missing or drifted index ${objectName}`;
		case "unexpected-unique-index": return `unexpected unique index ${objectName}`;
		case "missing-or-drifted-trigger": return `missing or drifted trigger ${objectName}`;
		case "unexpected-trigger": return `unexpected trigger ${objectName}`;
		case "virtual-table-definition-drift": return `virtual table definition differs for ${objectName}`;
		case "table-options-drift": return `table options differ for ${objectName}`;
	}
	throw new Error("Unsupported SQLite schema issue code", { cause: code });
}
function createSqliteSchemaIssue(code, objectName, message) {
	return {
		code,
		objectName,
		message: message ?? defaultIssueMessage(code, objectName)
	};
}
function legacySqliteSchemaIssueMessages(issues) {
	const isColumnIssue = (issue) => issue.code === "column-definition-drift" || issue.code === "missing-column" || issue.code === "unexpected-column";
	const columnIssueTables = new Set(issues.filter(isColumnIssue).map((issue) => issue.objectName.split(".", 1)[0]));
	return [...new Set(issues.filter((issue) => issue.code !== "table-constraint-drift" || !columnIssueTables.has(issue.objectName)).map((issue) => issue.message))];
}
function throwSqliteSchemaMismatches(databaseLabel, mismatches) {
	const shown = mismatches.slice(0, 8);
	if (mismatches.length > shown.length) shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
	throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}`);
}
//#endregion
//#region src/infra/sqlite-schema-sql.ts
const TABLE_CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
	"CHECK",
	"FOREIGN",
	"PRIMARY",
	"UNIQUE"
]);
function readTableConstraintKeyword(sql, first) {
	let token = first;
	if (token.keyword === "CONSTRAINT") {
		const name = readSqlToken(sql, token.end);
		token = name ? readSqlToken(sql, name.end) : null;
	}
	return token?.keyword && TABLE_CONSTRAINT_KEYWORDS.has(token.keyword) ? token.keyword : null;
}
function readSqlToken(sql, start) {
	let index = start;
	while (index < sql.length && /\s/u.test(sql[index] ?? "")) index += 1;
	const char = sql[index];
	if (!char) return null;
	if (char === "\"" || char === "`") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	if (char === "[") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	let end = index;
	while (end < sql.length && !/[\s(,]/u.test(sql[end] ?? "")) end += 1;
	const raw = sql.slice(index, end);
	return {
		end,
		keyword: raw.toUpperCase(),
		raw
	};
}
function normalizeSqlIdentifier(identifier) {
	if (identifier.startsWith("\"") && identifier.endsWith("\"")) return identifier.slice(1, -1).replaceAll("\"\"", "\"").toLowerCase();
	if (identifier.startsWith("`") && identifier.endsWith("`")) return identifier.slice(1, -1).replaceAll("``", "`").toLowerCase();
	if (identifier.startsWith("[") && identifier.endsWith("]")) return identifier.slice(1, -1).toLowerCase();
	return identifier.toLowerCase();
}
function normalizeSchemaSql(sql) {
	if (sql === null) return null;
	return normalizeSqlWhitespace(sql).replace(/;\s*$/u, "").trim().replace(/^(CREATE TABLE) IF NOT EXISTS /iu, "$1 ").replace(/^(CREATE VIRTUAL TABLE) IF NOT EXISTS /iu, "$1 ").replace(/^(CREATE UNIQUE INDEX) IF NOT EXISTS /iu, "$1 ").replace(/^(CREATE INDEX) IF NOT EXISTS /iu, "$1 ").replace(/^(CREATE TRIGGER) IF NOT EXISTS /iu, "$1 ");
}
function splitSqlList(sql) {
	const items = [];
	let depth = 0;
	let start = 0;
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") depth -= 1;
		else if (char === "," && depth === 0) {
			items.push(sql.slice(start, index));
			start = index + 1;
		}
		index += 1;
	}
	items.push(sql.slice(start));
	return items;
}
function findSqlCharacter(sql, character) {
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		if (sql[index] === character) return index;
		index += 1;
	}
	return -1;
}
function findSqlClosingParenthesis(sql, open) {
	let depth = 0;
	let index = open;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") {
			depth -= 1;
			if (depth === 0) return index;
		}
		index += 1;
	}
	throw new Error("SQLite schema contains an unterminated table definition.");
}
function normalizeSqlWhitespace(sql) {
	let normalized = "";
	let pendingSpace = false;
	let index = 0;
	while (index < sql.length) {
		const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
		if (quoted !== index) {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += sql.slice(index, quoted);
			pendingSpace = false;
			index = quoted;
			continue;
		}
		const comment = skipSqlComment(sql, index);
		if (comment !== index) {
			pendingSpace = true;
			index = comment;
			continue;
		}
		const char = sql[index] ?? "";
		if (/\s/u.test(char)) pendingSpace = true;
		else {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += char;
			pendingSpace = false;
		}
		index += 1;
	}
	return normalized.trim();
}
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function skipSqlQuotedOrComment(sql, index) {
	const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
	return quoted !== index ? quoted : skipSqlComment(sql, index);
}
function skipSqlQuoted(sql, index, quote) {
	if (quote !== "'" && quote !== "\"" && quote !== "`" && quote !== "[") return index;
	const closingQuote = quote === "[" ? "]" : quote;
	let cursor = index + 1;
	while (cursor < sql.length) {
		if (sql[cursor] !== closingQuote) {
			cursor += 1;
			continue;
		}
		if (quote !== "[" && sql[cursor + 1] === closingQuote) {
			cursor += 2;
			continue;
		}
		return cursor + 1;
	}
	return sql.length;
}
function skipSqlComment(sql, index) {
	if (sql.startsWith("--", index)) {
		const newline = sql.indexOf("\n", index + 2);
		return newline === -1 ? sql.length : newline + 1;
	}
	if (sql.startsWith("/*", index)) {
		const close = sql.indexOf("*/", index + 2);
		return close === -1 ? sql.length : close + 2;
	}
	return index;
}
//#endregion
//#region src/infra/sqlite-schema-contract.ts
const schemaContractCache = /* @__PURE__ */ new Map();
/**
* Require every object from one committed schema while allowing unrelated
* tables and indexes that do not replace a canonical object.
*/
function assertSqliteSchemaContains(database, databaseLabel, schemaSql, compatibility = {}) {
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility);
	if (issues.length > 0) throwSqliteSchemaMismatches(databaseLabel, legacySqliteSchemaIssueMessages(issues));
}
/** Collect stable, machine-readable differences from one committed schema. */
function collectSqliteSchemaIssues(database, schemaSql, compatibility = {}) {
	const expected = getSqliteSchemaContract(schemaSql);
	const allowedMissingTables = new Set(compatibility.allowedMissingTables ?? []);
	const allowedMissingIndexes = new Set(compatibility.allowedMissingIndexes ?? []);
	const issues = [];
	const add = (code, objectName, message) => {
		issues.push(createSqliteSchemaIssue(code, objectName, message));
	};
	for (const [tableName, expectedTable] of expected) {
		const actualTable = collectSqliteTableContract(database, tableName);
		if (!actualTable) {
			if (allowedMissingTables.has(tableName)) continue;
			add("missing-table", tableName);
			continue;
		}
		issues.push(...compareTableDefinitions(tableName, actualTable.definition, expectedTable.definition, compatibility, !allowedMissingTables.has(tableName)));
		for (const expectedIndex of expectedTable.indexes) if (!actualTable.indexes.some((actualIndex) => isEqual$1(actualIndex, expectedIndex))) {
			const objectName = expectedIndex.name ?? tableName;
			const namedIndexPresent = expectedIndex.name ? actualTable.indexes.some((actualIndex) => actualIndex.name === expectedIndex.name) : false;
			if (expectedIndex.name && allowedMissingIndexes.has(expectedIndex.name) && !namedIndexPresent) continue;
			add("missing-or-drifted-index", objectName, `missing or drifted index ${expectedIndex.name ?? `on ${tableName}`}`);
		}
		for (const actualIndex of actualTable.indexes) if (actualIndex.unique === 1 && !expectedTable.indexes.some((expectedIndex) => isEqual$1(actualIndex, expectedIndex))) add("unexpected-unique-index", actualIndex.name ?? tableName, `unexpected unique index ${actualIndex.name ?? `on ${tableName}`}`);
		const optionalCanonicalTriggerGroups = collectOptionalCanonicalTriggerGroups(database, compatibility, tableName);
		const optionalCanonicalTriggers = optionalCanonicalTriggerGroups.flatMap((group) => group.triggers);
		const allowedMissingCanonicalTriggers = optionalCanonicalTriggerGroups.filter((group) => group.optional).flatMap((group) => group.triggers);
		for (const expectedTrigger of expectedTable.triggers) {
			if (allowedMissingCanonicalTriggers.some((canonicalTrigger) => canonicalTrigger.name === expectedTrigger.name)) continue;
			if (!actualTable.triggers.some((actualTrigger) => isEqual$1(actualTrigger, expectedTrigger))) add("missing-or-drifted-trigger", expectedTrigger.name);
		}
		for (const triggerGroup of optionalCanonicalTriggerGroups) {
			const isPresent = actualTable.triggers.some((actualTrigger) => triggerGroup.triggers.some((canonicalTrigger) => actualTrigger.name === canonicalTrigger.name));
			if (triggerGroup.optional && !isPresent) continue;
			for (const canonicalTrigger of triggerGroup.triggers) if (!actualTable.triggers.some((actualTrigger) => isEqual$1(actualTrigger, canonicalTrigger))) add("missing-or-drifted-trigger", canonicalTrigger.name);
		}
		for (const actualTrigger of actualTable.triggers) if (!expectedTable.triggers.some((expectedTrigger) => isEqual$1(actualTrigger, expectedTrigger)) && !optionalCanonicalTriggers.some((canonicalTrigger) => isEqual$1(actualTrigger, canonicalTrigger))) add("unexpected-trigger", actualTrigger.name);
		if (actualTable.virtualTableSql !== expectedTable.virtualTableSql) add("virtual-table-definition-drift", tableName);
		if (actualTable.strict !== expectedTable.strict || actualTable.withoutRowid !== expectedTable.withoutRowid) add("table-options-drift", tableName);
	}
	return issues;
}
/** Require stable canonical tables before a version-specific additive migration. */
function assertSqliteSchemaTablesPresent(database, databaseLabel, schemaSql, options = {}) {
	const allowedMissingTables = new Set(options.allowedMissingTables ?? []);
	const missingTables = getCanonicalSqliteTableNames(schemaSql).filter((tableName) => !allowedMissingTables.has(tableName)).filter((tableName) => !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(tableName)).map((tableName) => `missing table ${tableName}`);
	if (missingTables.length > 0) throwSqliteSchemaMismatches(databaseLabel, missingTables);
}
/** Return every explicit named index owned by one committed schema. */
function getCanonicalSqliteNamedIndexContracts(schemaSql) {
	const schema = getSqliteSchemaContract(schemaSql);
	const indexes = [];
	for (const [tableName, table] of schema) for (const fingerprint of table.indexes) {
		if (fingerprint.name === null || fingerprint.sql === null || fingerprint.origin !== "c") continue;
		indexes.push({
			definition: readCanonicalIndexDefinition(fingerprint),
			fingerprint,
			name: fingerprint.name,
			tableName,
			unique: fingerprint.unique === 1
		});
	}
	return indexes;
}
/** Return every table owned by one committed schema. */
function getCanonicalSqliteTableNames(schemaSql) {
	return [...getSqliteSchemaContract(schemaSql).keys()];
}
/** Inspect one explicit main-schema index using the canonical schema fingerprint shape. */
function collectSqliteNamedIndexContract(database, indexName) {
	const row = database.prepare("SELECT name, sql, tbl_name FROM main.sqlite_schema WHERE type = 'index' AND name = ?").get(indexName);
	if (!row || typeof row.tbl_name !== "string") return;
	const index = database.prepare(`PRAGMA main.index_list(${quoteSqliteIdentifier(row.tbl_name)})`).all()?.find((candidate) => candidate.name === indexName);
	return index ? collectSqliteIndexContract(database, index) : void 0;
}
function collectOptionalCanonicalTriggerGroups(database, compatibility, tableName) {
	return (compatibility.optionalCanonicalTriggerGroups ?? []).filter((group) => group.tableName === tableName).map((group) => ({
		optional: !group.optionalWhenTableMissing || !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(group.optionalWhenTableMissing),
		triggers: group.triggers.map((trigger) => ({
			name: trigger.name,
			sql: normalizeOptionalCanonicalTriggerSql(trigger.sql)
		}))
	}));
}
function normalizeOptionalCanonicalTriggerSql(sql) {
	return normalizeSchemaSql(sql)?.replace(/^(CREATE TRIGGER) main\./iu, "$1 ") ?? null;
}
function getSqliteSchemaContract(schemaSql) {
	let expected = schemaContractCache.get(schemaSql);
	if (!expected) {
		expected = buildSqliteSchemaContract(schemaSql);
		schemaContractCache.set(schemaSql, expected);
	}
	return expected;
}
function buildSqliteSchemaContract(schemaSql) {
	const database = openNodeSqliteDatabase(":memory:");
	try {
		database.exec(schemaSql);
		const rows = database.prepare(`
          SELECT name
          FROM sqlite_schema
          WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `).all();
		return new Map(rows.map((row) => {
			const contract = collectSqliteTableContract(database, row.name);
			if (!contract) throw new Error(`Could not collect generated SQLite schema table ${row.name}.`);
			return [row.name, contract];
		}));
	} finally {
		database.close();
	}
}
function readCanonicalIndexDefinition(index) {
	if (index.name === null || index.sql === null) throw new Error("Canonical SQLite named index is missing its schema definition.");
	const prefix = (index.unique === 1 ? /^CREATE\s+UNIQUE\s+INDEX\s+/iu : /^CREATE\s+INDEX\s+/iu).exec(index.sql);
	if (!prefix) throw new Error(`Canonical SQLite index ${index.name} has an unreadable definition.`);
	const name = readSqlToken(index.sql, prefix[0].length);
	if (!name || normalizeSqlIdentifier(name.raw) !== index.name.toLowerCase()) throw new Error(`Canonical SQLite index ${index.name} has an unexpected schema name.`);
	const definition = index.sql.slice(name.end).trim();
	if (!/^ON\s+/iu.test(definition)) throw new Error(`Canonical SQLite index ${index.name} has an unreadable target.`);
	return definition;
}
function collectSqliteTableContract(database, tableName) {
	const table = database.prepare("SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(tableName);
	if (!table) return;
	const quotedTable = quoteSqliteIdentifier(tableName);
	const tableList = database.prepare("PRAGMA table_list").all().find((entry) => entry.name === tableName);
	if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
	const indexes = database.prepare(`PRAGMA index_list(${quotedTable})`).all().map((index) => collectSqliteIndexContract(database, index)).toSorted(compareJson);
	const triggers = database.prepare(`
          SELECT name, sql
          FROM sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `).all(tableName).map((trigger) => ({
		name: trigger.name,
		sql: normalizeSchemaSql(trigger.sql)
	}));
	const normalizedTableSql = normalizeSchemaSql(table.sql);
	const isVirtualTable = normalizedTableSql !== null && /^CREATE VIRTUAL TABLE /iu.test(normalizedTableSql);
	return {
		definition: isVirtualTable ? null : parseTableDefinition(table.sql, tableName),
		indexes,
		strict: tableList.strict,
		triggers,
		virtualTableSql: isVirtualTable ? normalizedTableSql : null,
		withoutRowid: tableList.wr
	};
}
function compareTableDefinitions(tableName, actual, expected, compatibility, allowCompatibleAdditiveColumns) {
	const issues = [];
	const add = (code, objectName) => {
		issues.push(createSqliteSchemaIssue(code, objectName));
	};
	if (!actual || !expected) {
		if (actual !== expected) add("table-definition-drift", tableName);
		return issues;
	}
	const allowedMissingColumns = new Set(compatibility.allowedMissingColumns ?? []);
	for (const [columnName, definition] of actual.columns) if (!expected.columns.has(columnName)) {
		if (allowCompatibleAdditiveColumns && compatibility.allowCompatibleAdditiveColumns && isCompatibleAdditiveColumnDefinition(definition)) continue;
		add("unexpected-column", `${tableName}.${columnName}`);
	}
	for (const [columnName, expectedDefinition] of expected.columns) {
		const objectName = `${tableName}.${columnName}`;
		const actualDefinition = actual.columns.get(columnName);
		if (actualDefinition === void 0) {
			if (!allowedMissingColumns.has(objectName)) add("missing-column", objectName);
			continue;
		}
		if (actualDefinition === expectedDefinition) continue;
		if (!(compatibility.allowedColumnDefinitions?.[objectName] ?? []).some((definition) => normalizeSqlWhitespace(definition) === actualDefinition)) add("column-definition-drift", objectName);
	}
	if (!isEqual$1(actual.constraints, expected.constraints)) add("table-constraint-drift", tableName);
	return issues;
}
const SQLITE_STRICT_DATATYPES = /* @__PURE__ */ new Set([
	"ANY",
	"BLOB",
	"INT",
	"INTEGER",
	"REAL",
	"TEXT"
]);
function isCompatibleAdditiveColumnDefinition(definition) {
	const name = readSqlToken(definition, 0);
	const type = name ? readSqlToken(definition, name.end) : null;
	return Boolean(type?.keyword && SQLITE_STRICT_DATATYPES.has(type.keyword) && definition.slice(type.end).trim().length === 0);
}
function parseTableDefinition(sql, tableName) {
	if (sql === null) throw new Error(`Could not inspect SQLite table definition for ${tableName}.`);
	const open = findSqlCharacter(sql, "(");
	if (open === -1) throw new Error(`SQLite table ${tableName} has no column definition.`);
	const close = findSqlClosingParenthesis(sql, open);
	const columns = /* @__PURE__ */ new Map();
	const constraints = [];
	for (const rawDefinition of splitSqlList(sql.slice(open + 1, close))) {
		const definition = normalizeSqlWhitespace(rawDefinition);
		if (!definition) continue;
		const token = readSqlToken(definition, 0);
		if (!token) throw new Error(`SQLite table ${tableName} contains an unreadable definition.`);
		if (readTableConstraintKeyword(definition, token)) {
			constraints.push(definition);
			continue;
		}
		const columnName = normalizeSqlIdentifier(token.raw);
		if (columns.has(columnName)) throw new Error(`SQLite table ${tableName} contains duplicate column ${columnName}.`);
		columns.set(columnName, definition);
	}
	return {
		columns: new Map([...columns].toSorted(([left], [right]) => left.localeCompare(right))),
		constraints: constraints.toSorted()
	};
}
function collectSqliteIndexContract(database, index) {
	const row = database.prepare("SELECT sql FROM sqlite_schema WHERE type = 'index' AND name = ?").get(index.name);
	const terms = database.prepare(`PRAGMA index_xinfo(${quoteSqliteIdentifier(index.name)})`).all().map(({ cid, coll, desc, key, name, seqno }) => ({
		coll,
		desc,
		key,
		kind: sqliteIndexTermKind(cid),
		name,
		seqno
	}));
	return {
		name: index.name.startsWith("sqlite_autoindex_") ? null : index.name,
		origin: index.origin,
		partial: index.partial,
		sql: normalizeSchemaSql(typeof row?.sql === "string" ? row.sql : null),
		terms,
		unique: index.unique
	};
}
function sqliteIndexTermKind(cid) {
	return cid === -2 ? "expression" : cid === -1 ? "rowid" : "column";
}
function isEqual$1(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
function compareJson(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
//#endregion
//#region src/infra/sqlite-index-schema.ts
const SQLITE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
/**
* Verify the whole file once, then use table scans only to locate repairable
* index damage. Healthy opens must not multiply integrity work by table count.
*/
function verifyAndRepairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	const screen = options.screen ?? "physical-screen";
	let integrityFailure;
	try {
		if (screen === "full") assertSqliteIntegrity(db, databaseLabel);
		else assertSqlitePhysicalScreen(db, databaseLabel);
	} catch (error) {
		if (!(error instanceof Error) || !isTerminalSqliteIntegrityError(error)) throw error;
		integrityFailure = error;
	}
	const repairedIndexes = repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, {
		...options,
		verifyPhysicalIntegrity: integrityFailure !== void 0
	});
	if (integrityFailure && repairedIndexes.length === 0) throw integrityFailure;
	return repairedIndexes;
}
/**
* Restore every named index when SQLite's IF NOT EXISTS semantics preserve a
* same-name definition or b-tree that no longer matches the committed schema.
*/
function repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	const indexes = getCanonicalSqliteNamedIndexContracts(schemaSql);
	const indexesByTable = /* @__PURE__ */ new Map();
	const integrityFailuresByTable = /* @__PURE__ */ new Map();
	const repairIndexes = /* @__PURE__ */ new Set();
	for (const index of indexes) {
		assertSqliteIdentifier(index.name);
		assertSqliteIdentifier(index.tableName);
		if (!db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ?").get(index.tableName)) continue;
		const tableIndexes = indexesByTable.get(index.tableName) ?? [];
		tableIndexes.push(index);
		indexesByTable.set(index.tableName, tableIndexes);
		if (!isEqual(collectSqliteNamedIndexContract(db, index.name), index.fingerprint)) repairIndexes.add(index);
	}
	assertNoUnexpectedUniqueIndexes(db, databaseLabel, schemaSql, indexesByTable);
	if (options.verifyPhysicalIntegrity !== false) for (const [tableName, tableIndexes] of indexesByTable) try {
		assertSqliteTableIntegrity(db, databaseLabel, tableName);
	} catch (error) {
		if (error instanceof Error) integrityFailuresByTable.set(tableName, error);
		for (const index of tableIndexes) repairIndexes.add(index);
	}
	if (repairIndexes.size === 0) return [];
	const savepoint = "repair_canonical_indexes";
	let activeIndex;
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		for (const index of repairIndexes) {
			activeIndex = index;
			const probeName = findUnusedProbeIndexName(db, index.name);
			try {
				db.exec(createIndexSql(index, probeName, true));
			} catch (error) {
				if (options.allowMissingColumns && isMissingColumnError(error)) {
					repairIndexes.delete(index);
					continue;
				}
				throw error;
			}
			db.exec(`DROP INDEX IF EXISTS main.${index.name};`);
			db.exec(createIndexSql(index, index.name, true));
			db.exec(`DROP INDEX main.${probeName};`);
		}
		if (repairIndexes.size === 0) {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
			return [];
		}
		for (const tableName of indexesByTable.keys()) assertSqliteTableIntegrity(db, databaseLabel, tableName);
		assertSqliteIntegrity(db, databaseLabel);
		options.validateAfterRepair?.();
		db.exec(`RELEASE SAVEPOINT ${savepoint};`);
	} catch (error) {
		try {
			db.exec(`ROLLBACK TO SAVEPOINT ${savepoint};`);
		} finally {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
		}
		if (error instanceof Error && isTerminalSqliteIntegrityError(error)) throw error;
		const tableIntegrityFailure = activeIndex ? integrityFailuresByTable.get(activeIndex.tableName) : void 0;
		if (tableIntegrityFailure && isTerminalSqliteIntegrityError(tableIntegrityFailure)) throw tableIntegrityFailure;
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`SQLite canonical index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`, { cause: error });
	}
	return [...repairIndexes].map((index) => index.name).toSorted();
}
function assertNoUnexpectedUniqueIndexes(db, databaseLabel, schemaSql, indexesByTable) {
	for (const tableName of getCanonicalSqliteTableNames(schemaSql)) {
		assertSqliteIdentifier(tableName);
		if (!db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ?").get(tableName)) continue;
		const canonicalIndexNames = new Set((indexesByTable.get(tableName) ?? []).map((index) => index.name));
		const unexpected = db.prepare(`PRAGMA main.index_list(${tableName})`).all().find((index) => index.unique === 1 && index.origin === "c" && !canonicalIndexNames.has(index.name));
		if (unexpected) throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: unexpected unique index ${unexpected.name}`);
	}
}
function createIndexSql(index, name, qualifyMain) {
	assertSqliteIdentifier(name);
	return `${index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX"} ${qualifyMain ? `main.${name}` : name} ${index.definition};`;
}
function findUnusedProbeIndexName(db, canonicalName) {
	const prefix = `openclaw_probe_${canonicalName}`;
	for (let suffix = 0; suffix < 100; suffix += 1) {
		const candidate = suffix === 0 ? prefix : `${prefix}_${suffix}`;
		if (!db.prepare("SELECT 1 AS found FROM main.sqlite_schema WHERE name = ?").get(candidate)) return candidate;
	}
	throw new Error(`could not allocate a probe index name for ${canonicalName}`);
}
function assertSqliteIdentifier(identifier) {
	if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) throw new Error(`invalid SQLite identifier: ${identifier}`);
}
function isMissingColumnError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /^no such column:/iu.test(error.message);
}
function isEqual(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
//#endregion
//#region src/infra/windows-powershell-spawn.ts
const WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS = 6e4;
function sanitizePowerShellOutputText(text) {
	return truncateUtf16Safe(text.split(/\r?\n/u).filter((line) => !line.toLowerCase().includes("encodedcommand")).join("\n").trim(), 1e3);
}
function buildPowerShellFailureCause(error) {
	const failure = error && typeof error === "object" ? error : {};
	const status = [
		typeof failure.status === "number" ? `status=${failure.status}` : "",
		typeof failure.code === "number" ? `exit=${failure.code}` : typeof failure.code === "string" ? `code=${failure.code}` : "",
		typeof failure.killed === "boolean" ? `killed=${failure.killed}` : "",
		typeof failure.signal === "string" ? `signal=${failure.signal}` : ""
	].filter(Boolean);
	const stderr = typeof failure.stderr === "string" ? sanitizePowerShellOutputText(failure.stderr) : "";
	const stdout = typeof failure.stdout === "string" ? sanitizePowerShellOutputText(failure.stdout) : "";
	const detail = stderr ? `stderr: ${stderr}` : stdout ? `stdout: ${stdout}` : "";
	return /* @__PURE__ */ new Error(`PowerShell failed${status.length ? ` (${status.join(", ")})` : ""}${detail ? `; ${detail}` : ""}`);
}
function buildEncodedPowerShellArgs(command) {
	return [
		"-NoLogo",
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		Buffer.from(command, "utf16le").toString("base64")
	];
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
const SQLITE_DIRECTORY_MODE = 448;
const WINDOWS_DIRECTORY_EXISTS_MARKER = "OPENCLAW_SQLITE_DIRECTORY_EXISTS";
const WINDOWS_PRIVATE_DIRECTORY_NATIVE_SOURCE = `
using System;
using System.Runtime.InteropServices;

public static class OpenClawPrivateDirectory
{
    [StructLayout(LayoutKind.Sequential)]
    private struct SecurityAttributes
    {
        public int Length;
        public IntPtr SecurityDescriptor;
        public int InheritHandle;
    }

    [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool ConvertStringSecurityDescriptorToSecurityDescriptorW(
        string securityDescriptor,
        uint revision,
        out IntPtr convertedSecurityDescriptor,
        out uint convertedSecurityDescriptorSize);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CreateDirectoryW(
        string path,
        ref SecurityAttributes securityAttributes);

    [DllImport("kernel32.dll")]
    private static extern IntPtr LocalFree(IntPtr memory);

    public static int Create(string path, string securityDescriptor)
    {
        IntPtr descriptor;
        uint descriptorSize;
        if (!ConvertStringSecurityDescriptorToSecurityDescriptorW(
                securityDescriptor,
                1,
                out descriptor,
                out descriptorSize))
        {
            return Marshal.GetLastWin32Error();
        }

        try
        {
            var attributes = new SecurityAttributes
            {
                Length = Marshal.SizeOf(typeof(SecurityAttributes)),
                SecurityDescriptor = descriptor,
                InheritHandle = 0,
            };
            return CreateDirectoryW(path, ref attributes) ? 0 : Marshal.GetLastWin32Error();
        }
        finally
        {
            LocalFree(descriptor);
        }
    }
}
`;
function failureText(value) {
	return sanitizePowerShellOutputText(Buffer.isBuffer(value) ? decodeWindowsOutputBuffer({ buffer: value }) : typeof value === "string" ? value : "");
}
function privateDirectoryError(directoryPath, error, stdout, stderr) {
	const failure = error && typeof error === "object" ? error : {};
	if ([
		error,
		stderr,
		stdout,
		failure.stderr,
		failure.stdout
	].some((value) => String(value).includes(WINDOWS_DIRECTORY_EXISTS_MARKER))) {
		const existsError = /* @__PURE__ */ new Error(`Private SQLite directory already exists: ${directoryPath}`);
		existsError.code = "EEXIST";
		return existsError;
	}
	const cause = buildPowerShellFailureCause({
		status: failure.status,
		code: failure.code,
		killed: failure.killed,
		signal: failure.signal,
		stderr: failureText(stderr) || failureText(failure.stderr),
		stdout: failureText(stdout) || failureText(failure.stdout)
	});
	return new Error(`Unable to create private Windows SQLite directory: ${directoryPath}`, { cause });
}
function runPrivateDirectoryPowerShell(directoryPath, powershell, args) {
	return new Promise((resolve, reject) => {
		execFile(powershell, args, {
			encoding: "buffer",
			maxBuffer: 64 * 1024,
			timeout: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS,
			windowsHide: true
		}, (error, stdout, stderr) => {
			if (error) {
				reject(privateDirectoryError(directoryPath, error, stdout, stderr));
				return;
			}
			resolve();
		});
	});
}
function resolvePrivateDirectoryPowerShell(directoryPath) {
	const nativeDirectoryPath = path.toNamespacedPath(path.resolve(directoryPath));
	const encodedPath = Buffer.from(nativeDirectoryPath, "utf8").toString("base64");
	const encodedNativeSource = Buffer.from(WINDOWS_PRIVATE_DIRECTORY_NATIVE_SOURCE, "utf8").toString("base64");
	const command = [
		"$ErrorActionPreference = 'Stop'",
		`$path = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedPath}'))`,
		`$nativeSource = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedNativeSource}'))`,
		"Add-Type -TypeDefinition $nativeSource -Language CSharp",
		"$current = [System.Security.Principal.WindowsIdentity]::GetCurrent().User",
		"$security = New-Object System.Security.AccessControl.DirectorySecurity",
		"$security.SetAccessRuleProtection($true, $false)",
		"$security.SetOwner($current)",
		"$inheritance = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit",
		"$propagation = [System.Security.AccessControl.PropagationFlags]::None",
		"foreach ($sidValue in @($current.Value, 'S-1-5-18', 'S-1-5-32-544')) { $sid = New-Object System.Security.Principal.SecurityIdentifier($sidValue); $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, $inheritance, $propagation, [System.Security.AccessControl.AccessControlType]::Allow); [void]$security.AddAccessRule($rule) }",
		"$sections = [System.Security.AccessControl.AccessControlSections]::Owner -bor [System.Security.AccessControl.AccessControlSections]::Access",
		"$sddl = $security.GetSecurityDescriptorSddlForm($sections)",
		"$errorCode = [OpenClawPrivateDirectory]::Create($path, $sddl)",
		`if ($errorCode -eq 80 -or $errorCode -eq 183) { throw '${WINDOWS_DIRECTORY_EXISTS_MARKER}' }`,
		"if ($errorCode -ne 0) { $exception = New-Object System.ComponentModel.Win32Exception($errorCode); throw $exception }"
	].join("; ");
	const powershell = resolveSystemBin("powershell");
	if (!powershell) throw new Error("Unable to resolve PowerShell for private Windows SQLite staging.");
	return {
		powershell,
		args: buildEncodedPowerShellArgs(command)
	};
}
async function createPrivateSqliteDirectory(directoryPath) {
	if (process.platform !== "win32") {
		await fs$1.mkdir(directoryPath, { mode: SQLITE_DIRECTORY_MODE });
		return;
	}
	const { args, powershell } = resolvePrivateDirectoryPowerShell(directoryPath);
	await runPrivateDirectoryPowerShell(directoryPath, powershell, args);
}
function createPrivateSqliteDirectorySync(directoryPath) {
	if (process.platform !== "win32") {
		fs.mkdirSync(directoryPath, { mode: SQLITE_DIRECTORY_MODE });
		return;
	}
	const { args, powershell } = resolvePrivateDirectoryPowerShell(directoryPath);
	try {
		execFileSync(powershell, args, {
			maxBuffer: 64 * 1024,
			timeout: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS,
			windowsHide: true
		});
	} catch (error) {
		throw privateDirectoryError(directoryPath, error);
	}
}
async function createPrivateSqliteTempDirectory(rootPath, prefix) {
	if (process.platform !== "win32") return await fs$1.mkdtemp(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	await createPrivateSqliteDirectory(directoryPath);
	return directoryPath;
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") return fs.mkdtempSync(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateSqliteDirectorySync(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
const MAX_SNAPSHOT_ATTEMPTS = 10;
const COPY_BUFFER_BYTES = 1024 * 1024;
const SQLITE_HEADER_BYTES = 20;
const SQLITE_READONLY_RESULT_CODE = 8;
const SQLITE_RESULT_CODE_MASK = 255;
const SQLITE_JOURNAL_MAGIC = Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
const pendingTempDirectoryCleanup = /* @__PURE__ */ new Set();
let cleanupExitHandlerInstalled = false;
var SqliteSourceChangedError = class extends Error {};
function statIfPresent(pathname) {
	try {
		return fs.statSync(pathname, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSourceSidecars(pathname) {
	return {
		journal: Boolean(statIfPresent(`${pathname}-journal`)),
		shm: Boolean(statIfPresent(`${pathname}-shm`)),
		wal: Boolean(statIfPresent(`${pathname}-wal`))
	};
}
function sameSidecars(left, right) {
	return left.journal === right.journal && left.shm === right.shm && left.wal === right.wal;
}
function openPinnedFile(pathname) {
	let descriptor;
	try {
		descriptor = fs.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs.fstatSync(descriptor, { bigint: true });
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fs.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname) {
	const source = openPinnedFile(pathname);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fs.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fs.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fs.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity(file.identity, opened) || !sameFileIdentity(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copyPinnedFile(source, targetPath) {
	let target;
	try {
		target = fs.openSync(targetPath, "wx", 384);
		const buffer = Buffer.allocUnsafe(COPY_BUFFER_BYTES);
		let offset = 0;
		while (true) {
			const bytesRead = fs.readSync(source.descriptor, buffer, 0, buffer.length, offset);
			if (bytesRead === 0) break;
			let bytesWritten = 0;
			while (bytesWritten < bytesRead) {
				const count = fs.writeSync(target, buffer, bytesWritten, bytesRead - bytesWritten, offset + bytesWritten);
				if (count === 0) throw new Error(`SQLite read-only snapshot copy made no progress: ${targetPath}`);
				bytesWritten += count;
			}
			offset += bytesRead;
		}
		fs.fsyncSync(target);
		assertPinnedIdentityUnchanged(source);
	} finally {
		if (target !== void 0) fs.closeSync(target);
	}
}
function copySourceFile(sourcePath, targetPath) {
	const source = openPinnedFile(sourcePath);
	try {
		copyPinnedFile(source, targetPath);
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function filesEqual(leftPath, rightPath) {
	const leftStat = fs.statSync(leftPath, { bigint: true });
	const rightStat = fs.statSync(rightPath, { bigint: true });
	if (!leftStat.isFile() || !rightStat.isFile() || leftStat.size !== rightStat.size) return false;
	const left = fs.openSync(leftPath, "r");
	const right = fs.openSync(rightPath, "r");
	try {
		const leftBuffer = Buffer.allocUnsafe(COPY_BUFFER_BYTES);
		const rightBuffer = Buffer.allocUnsafe(COPY_BUFFER_BYTES);
		let offset = 0;
		while (BigInt(offset) < leftStat.size) {
			const length = Math.min(COPY_BUFFER_BYTES, Number(leftStat.size - BigInt(offset)));
			const leftBytes = fs.readSync(left, leftBuffer, 0, length, offset);
			const rightBytes = fs.readSync(right, rightBuffer, 0, length, offset);
			if (leftBytes !== rightBytes || leftBytes !== length || !leftBuffer.subarray(0, leftBytes).equals(rightBuffer.subarray(0, rightBytes))) return false;
			offset += leftBytes;
		}
		return true;
	} finally {
		fs.closeSync(right);
		fs.closeSync(left);
	}
}
function assertExpectedSidecars(pathname, expected) {
	if (!sameSidecars(readSourceSidecars(pathname), expected)) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function replaceFile(sourcePath, targetPath) {
	fs.rmSync(targetPath, { force: true });
	fs.renameSync(sourcePath, targetPath);
}
function isSqliteReadOnlyError(error) {
	let current = error;
	for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
		const details = current;
		if (typeof details.errcode === "number" && (details.errcode & SQLITE_RESULT_CODE_MASK) === SQLITE_READONLY_RESULT_CODE) return true;
		current = details.cause;
	}
	return false;
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fs.openSync(journalPath, "r");
	try {
		const size = fs.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fs.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fs.closeSync(descriptor);
	}
}
function removeTempDirectory(tempDir) {
	try {
		fs.rmSync(tempDir, {
			force: true,
			maxRetries: 3,
			recursive: true,
			retryDelay: 20
		});
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch {
		pendingTempDirectoryCleanup.add(tempDir);
		if (!cleanupExitHandlerInstalled) {
			cleanupExitHandlerInstalled = true;
			process.once("exit", () => {
				for (const pendingDir of pendingTempDirectoryCleanup) try {
					fs.rmSync(pendingDir, {
						force: true,
						recursive: true
					});
				} catch {}
			});
		}
		return false;
	}
}
function recoverPrivateRollbackCopy(snapshotPath) {
	if (rollbackJournalReferencesSuperJournal(`${snapshotPath}-journal`)) throw new Error(`SQLite hot rollback journal references a super-journal and cannot be recovered privately: ${snapshotPath}`);
	const snapshot = openNodeSqliteDatabase(snapshotPath);
	try {
		snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
		snapshot.prepare("PRAGMA schema_version;").get();
	} finally {
		snapshot.close();
	}
	fs.rmSync(`${snapshotPath}-journal`, { force: true });
	const descriptor = fs.openSync(snapshotPath, "r+");
	try {
		fs.fsyncSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
function createStableReadOnlyCopyInTempDirectory(pathname, journalMode, tempDir) {
	const snapshotPath = path.join(tempDir, "database.sqlite");
	const firstPath = path.join(tempDir, "first");
	const secondPath = path.join(tempDir, "second");
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		if (sidecars.journal && sidecars.wal) throw new SqliteSourceChangedError(`SQLite journal modes overlapped: ${pathname}`);
		const sidecarSuffix = sidecars.journal ? "-journal" : sidecars.wal ? "-wal" : void 0;
		if (sidecarSuffix) {
			copySourceFile(`${pathname}${sidecarSuffix}`, firstPath);
			copySourceFile(pathname, snapshotPath);
			copySourceFile(`${pathname}${sidecarSuffix}`, secondPath);
			assertExpectedSidecars(pathname, sidecars);
			if (!filesEqual(firstPath, secondPath)) throw new SqliteSourceChangedError(`SQLite ${sidecarSuffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			replaceFile(secondPath, `${snapshotPath}${sidecarSuffix}`);
		} else {
			copySourceFile(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			copySourceFile(pathname, secondPath);
			assertExpectedSidecars(pathname, sidecars);
			if (!filesEqual(firstPath, secondPath)) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			replaceFile(secondPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		fs.rmSync(firstPath, { force: true });
		if (sidecars.journal) recoverPrivateRollbackCopy(snapshotPath);
		let active = true;
		return {
			location: snapshotPath,
			cleanup: () => {
				if (!active) return true;
				const removed = removeTempDirectory(tempDir);
				if (removed) active = false;
				return removed;
			}
		};
	} catch (error) {
		removeTempDirectory(tempDir);
		throw error;
	}
}
async function createStableReadOnlyCopy(pathname, journalMode) {
	return createStableReadOnlyCopyInTempDirectory(pathname, journalMode, await createPrivateSqliteTempDirectory(resolvePreferredOpenClawTmpDir(), `openclaw-sqlite-readonly-${process.pid}-`));
}
function createStableReadOnlyCopySync(pathname, journalMode) {
	return createStableReadOnlyCopyInTempDirectory(pathname, journalMode, createPrivateSqliteTempDirectorySync(resolvePreferredOpenClawTmpDir(), `openclaw-sqlite-readonly-${process.pid}-`));
}
async function createOnlineReadOnlyBackup(pathname) {
	const tempDir = await createPrivateSqliteTempDirectory(resolvePreferredOpenClawTmpDir(), `openclaw-sqlite-readonly-${process.pid}-`);
	const snapshotPath = path.join(tempDir, "database.sqlite");
	const sqlite = requireNodeSqlite();
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		const source = openNodeSqliteDatabase(pathname, { readOnly: true });
		try {
			source.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF; BEGIN;");
			source.prepare("PRAGMA schema_version;").get();
			await sqlite.backup(source, resolveSqliteFilesystemPath(snapshotPath));
			source.exec("ROLLBACK;");
		} finally {
			if (source.isOpen) source.close();
		}
		const snapshot = openNodeSqliteDatabase(snapshotPath);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
		} finally {
			snapshot.close();
		}
		const descriptor = fs.openSync(snapshotPath, "r+");
		try {
			fs.fsyncSync(descriptor);
		} finally {
			fs.closeSync(descriptor);
		}
		let active = true;
		return {
			location: snapshotPath,
			cleanup: () => {
				if (!active) return true;
				const removed = removeTempDirectory(tempDir);
				if (removed) active = false;
				return removed;
			}
		};
	} catch (error) {
		removeTempDirectory(tempDir);
		throw error;
	}
}
/**
* Active rollback and WAL state use SQLite's locking and backup protocol.
* Crash residue that cannot be opened read-only is copied and recovered
* privately so inspection never mutates coordination files beside the source.
*/
async function prepareSqliteReadOnlyLocation(pathname) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < MAX_SNAPSHOT_ATTEMPTS; attempt += 1) {
		let journalMode;
		try {
			journalMode = readSourceJournalMode(canonicalPath);
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			continue;
		}
		const sidecars = readSourceSidecars(canonicalPath);
		if (journalMode !== "wal" || sidecars.wal && sidecars.shm) try {
			return await createOnlineReadOnlyBackup(canonicalPath);
		} catch (error) {
			let currentMode;
			try {
				currentMode = readSourceJournalMode(canonicalPath);
			} catch (inspectionError) {
				if (!(inspectionError instanceof SqliteSourceChangedError)) throw inspectionError;
				lastChange = inspectionError;
				continue;
			}
			const currentSidecars = readSourceSidecars(canonicalPath);
			if (currentMode === "rollback" && currentSidecars.journal) {
				if (!isSqliteReadOnlyError(error)) throw error;
				try {
					return await createStableReadOnlyCopy(canonicalPath, "rollback");
				} catch (copyError) {
					if (!(copyError instanceof SqliteSourceChangedError)) throw copyError;
					lastChange = copyError;
					continue;
				}
			}
			if (currentMode !== "wal" || currentSidecars.wal && currentSidecars.shm) throw error;
			lastChange = error instanceof Error ? error : new Error(String(error));
			continue;
		}
		try {
			return await createStableReadOnlyCopy(canonicalPath, "wal");
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
		}
	}
	throw new Error(`SQLite source did not stabilize for read-only inspection: ${canonicalPath}`, { cause: lastChange });
}
/** Synchronously prepares a stable private family for lock-free public inspection. */
function prepareSqliteReadOnlyLocationSync(pathname) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < MAX_SNAPSHOT_ATTEMPTS; attempt += 1) {
		let journalMode;
		try {
			journalMode = readSourceJournalMode(canonicalPath);
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			continue;
		}
		if (journalMode === "unknown") {
			lastChange = new SqliteSourceChangedError(`SQLite journal mode is unavailable while copying: ${canonicalPath}`);
			continue;
		}
		try {
			return createStableReadOnlyCopySync(canonicalPath, journalMode);
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
		}
	}
	throw new Error(`SQLite source did not stabilize for read-only inspection: ${canonicalPath}`, { cause: lastChange });
}
async function prepareSqliteSnapshotSource(pathname) {
	const canonicalPath = fs.realpathSync.native(pathname);
	const journalPath = `${canonicalPath}-journal`;
	let journal;
	try {
		journal = fs.lstatSync(journalPath, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	if (!journal.isFile()) throw new Error(`SQLite rollback journal must be a regular file: ${journalPath}`);
	return await prepareSqliteReadOnlyLocation(canonicalPath);
}
async function withSqliteSnapshotSource(pathname, operation) {
	let prepared = await prepareSqliteSnapshotSource(pathname);
	try {
		try {
			return await operation(prepared?.location ?? pathname);
		} catch (error) {
			if (prepared) throw error;
			prepared = await prepareSqliteSnapshotSource(pathname);
			if (!prepared) throw error;
			return await operation(prepared.location);
		}
	} finally {
		prepared?.cleanup();
	}
}
//#endregion
//#region src/cron/execution-error-constants.ts
/** Stable cron execution error text shared by runtime and ledger codecs. */
const CRON_JOB_EXECUTION_TIMEOUT_ERROR = "cron: job execution timed out";
const CRON_SETUP_TIMEOUT_ERROR = "cron: isolated agent setup timed out before runner start";
const CRON_PRE_EXECUTION_TIMEOUT_ERROR = "cron: isolated agent run stalled before execution start";
const CRON_TIMEOUT_ERROR_PREFIXES = [
	CRON_JOB_EXECUTION_TIMEOUT_ERROR,
	CRON_SETUP_TIMEOUT_ERROR,
	CRON_PRE_EXECUTION_TIMEOUT_ERROR
];
/** Recognizes watchdog timeouts without loading agent or execution-phase runtime. */
function isCronTimeoutErrorText(error) {
	return typeof error === "string" && CRON_TIMEOUT_ERROR_PREFIXES.some((prefix) => error === prefix || error.startsWith(`${prefix} `));
}
//#endregion
//#region src/cron/run-diagnostics-normalize.ts
/** Dependency-light normalization helpers for stored cron run diagnostics. */
const MAX_ENTRIES = 10;
const MAX_ENTRY_CHARS = 1e3;
const MAX_SUMMARY_CHARS = 2e3;
function normalizeSeverity(value) {
	return value === "info" || value === "warn" || value === "error" ? value : "error";
}
function normalizeSource(value) {
	switch (value) {
		case "cron-preflight":
		case "cron-setup":
		case "model-preflight":
		case "agent-run":
		case "tool":
		case "exec":
		case "delivery": return value;
		default: return "agent-run";
	}
}
function normalizeTimestamp$1(value, nowMs) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : nowMs();
}
function formatUnknownError(error) {
	if (error instanceof Error) return error.message || error.name;
	return String(error);
}
function normalizeDiagnosticToolName(value) {
	if (typeof value !== "string") return;
	return normalizeOptionalString(value);
}
function normalizeExitCode(value) {
	return asFiniteNumber(value) ?? (value === null ? null : void 0);
}
function tailText(value, maxChars) {
	if (value.length <= maxChars) return value;
	return sliceUtf16Safe(value, -maxChars);
}
function normalizeDiagnosticMessage(value, redactText) {
	if (typeof value !== "string") return {};
	const normalized = normalizeOptionalString(value);
	if (!normalized) return {};
	const redacted = redactText(normalized);
	if (redacted.length <= MAX_ENTRY_CHARS) return { message: redacted };
	return {
		message: `${truncateUtf16Safe(redacted, MAX_ENTRY_CHARS - 1)}…`,
		truncated: true
	};
}
function normalizeCronRunDiagnosticSummary(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized.length <= MAX_SUMMARY_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, MAX_SUMMARY_CHARS - 1)}…`;
}
/** Normalizes stored cron diagnostic payloads into bounded entries. */
function normalizeCronRunDiagnosticsCore(value, opts) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const nowMs = opts?.nowMs ?? Date.now;
	const redactText = opts?.redactText ?? ((text) => text);
	const entriesRaw = Array.isArray(record.entries) ? record.entries : [];
	const entries = [];
	for (const item of entriesRaw) {
		if (!item || typeof item !== "object") continue;
		const entry = item;
		const normalized = normalizeDiagnosticMessage(entry.message, redactText);
		if (!normalized.message) continue;
		entries.push({
			ts: normalizeTimestamp$1(entry.ts, nowMs),
			source: normalizeSource(entry.source),
			severity: normalizeSeverity(entry.severity),
			message: normalized.message,
			...typeof entry.toolName === "string" && entry.toolName.trim() ? { toolName: entry.toolName.trim() } : {},
			...typeof entry.exitCode === "number" && Number.isFinite(entry.exitCode) ? { exitCode: entry.exitCode } : entry.exitCode === null ? { exitCode: null } : {},
			...entry.truncated === true || normalized.truncated ? { truncated: true } : {}
		});
		if (entries.length > MAX_ENTRIES) entries.shift();
	}
	const summary = normalizeCronRunDiagnosticSummary(typeof record.summary === "string" ? redactText(record.summary) : void 0);
	if (entries.length === 0 && !summary) return;
	return {
		...summary ? { summary } : {},
		entries
	};
}
//#endregion
//#region src/cron/task-run-detail.ts
/** Read-side cron codec between task-ledger detail and the stable run-history wire shape.
* Deliberately free of agent/runtime imports so history reads stay dependency-light;
* the event->entry write codec lives in task-run-event-codec.ts. */
const CRON_TASK_DETAIL_KIND = "cron-run";
const CRON_FAILOVER_REASONS = new Set(FAILOVER_REASONS);
function toJsonValue(value) {
	const serialized = JSON.stringify(value);
	return serialized === void 0 ? void 0 : JSON.parse(serialized);
}
function isJsonObject(value) {
	return isRecord(value);
}
function normalizeTimestamp(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: MAX_DATE_TIMESTAMP_MS
	});
}
function isCronRunStatus(value) {
	return value === "ok" || value === "error" || value === "skipped";
}
function isCronDeliveryStatus(value) {
	return [
		"delivered",
		"not-delivered",
		"unknown",
		"not-requested"
	].includes(value);
}
function normalizeUsage(value) {
	if (!isJsonObject(value)) return;
	const usage = {
		input_tokens: asSafeIntegerInRange(value.input_tokens, { min: 0 }),
		output_tokens: asSafeIntegerInRange(value.output_tokens, { min: 0 }),
		total_tokens: asSafeIntegerInRange(value.total_tokens, { min: 0 }),
		cache_read_tokens: asSafeIntegerInRange(value.cache_read_tokens, { min: 0 }),
		cache_write_tokens: asSafeIntegerInRange(value.cache_write_tokens, { min: 0 })
	};
	return Object.values(usage).some((tokenCount) => tokenCount !== void 0) ? usage : void 0;
}
function normalizeCronRunLogErrorReason(value) {
	return typeof value === "string" && CRON_FAILOVER_REASONS.has(value) ? value : void 0;
}
/** Parses stored or migrated cron history while preserving the stable wire shape. */
function parseCronRunLogEntryObject(obj, opts) {
	const jobId = normalizeOptionalString(opts?.jobId);
	if (!obj || typeof obj !== "object") return null;
	const entryObj = obj;
	if (entryObj.action !== "finished") return null;
	if (typeof entryObj.jobId !== "string" || entryObj.jobId.trim().length === 0) return null;
	const ts = normalizeTimestamp(entryObj.ts);
	if (ts === void 0) return null;
	if (jobId && entryObj.jobId !== jobId) return null;
	const normalizedError = typeof entryObj.error === "string" ? entryObj.error : void 0;
	const normalizedProvider = typeof entryObj.provider === "string" && entryObj.provider.trim() ? entryObj.provider : void 0;
	const entry = {
		ts,
		jobId: entryObj.jobId,
		action: "finished",
		status: isCronRunStatus(entryObj.status) ? entryObj.status : void 0,
		error: normalizedError,
		errorReason: normalizeCronRunLogErrorReason(entryObj.errorReason) ?? void 0,
		summary: typeof entryObj.summary === "string" ? entryObj.summary : void 0,
		runId: typeof entryObj.runId === "string" && entryObj.runId.trim() ? entryObj.runId : void 0,
		diagnostics: normalizeCronRunDiagnosticsCore(entryObj.diagnostics),
		runAtMs: normalizeTimestamp(entryObj.runAtMs),
		durationMs: asSafeIntegerInRange(entryObj.durationMs, { min: 0 }),
		nextRunAtMs: normalizeTimestamp(entryObj.nextRunAtMs),
		triggerFired: entryObj.triggerFired === true ? true : void 0,
		model: typeof entryObj.model === "string" && entryObj.model.trim() ? entryObj.model : void 0,
		provider: normalizedProvider,
		usage: normalizeUsage(entryObj.usage)
	};
	if (typeof entryObj.delivered === "boolean") entry.delivered = entryObj.delivered;
	if (isCronDeliveryStatus(entryObj.deliveryStatus)) entry.deliveryStatus = entryObj.deliveryStatus;
	if (typeof entryObj.deliveryError === "string") entry.deliveryError = entryObj.deliveryError;
	if (entryObj.failureNotificationDelivery && typeof entryObj.failureNotificationDelivery === "object") {
		const failureNotificationDelivery = entryObj.failureNotificationDelivery;
		if (isCronDeliveryStatus(failureNotificationDelivery.status)) entry.failureNotificationDelivery = {
			status: failureNotificationDelivery.status,
			...typeof failureNotificationDelivery.delivered === "boolean" ? { delivered: failureNotificationDelivery.delivered } : {},
			...typeof failureNotificationDelivery.error === "string" ? { error: failureNotificationDelivery.error } : {}
		};
	}
	if (isJsonObject(entryObj.delivery)) entry.delivery = entryObj.delivery;
	if (typeof entryObj.sessionId === "string" && entryObj.sessionId.trim()) entry.sessionId = entryObj.sessionId;
	if (typeof entryObj.sessionKey === "string" && entryObj.sessionKey.trim()) entry.sessionKey = entryObj.sessionKey;
	return entry;
}
/** Encodes cron-only outcome fields; generic lifecycle fields stay on TaskRecord. */
function cronRunLogEntryToTaskDetail(entry, options) {
	return toJsonValue({
		kind: CRON_TASK_DETAIL_KIND,
		status: entry.status,
		storeKey: options.storeKey,
		errorReason: entry.errorReason,
		diagnostics: entry.diagnostics,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus,
		deliveryError: entry.deliveryError,
		failureNotificationDelivery: entry.failureNotificationDelivery,
		delivery: entry.delivery,
		sessionId: entry.sessionId,
		runId: entry.runId,
		runAtMs: entry.runAtMs,
		durationMs: entry.durationMs,
		nextRunAtMs: entry.nextRunAtMs,
		triggerFired: entry.triggerFired,
		triggerStateChanged: options.triggerEval?.fired === true ? options.triggerEval.stateChanged : void 0,
		triggerState: options.triggerEval?.fired === true && options.triggerEval.stateChanged ? options.triggerEval.state : void 0,
		scriptStateChanged: options.scriptResult?.scriptStateChanged === true ? true : void 0,
		scriptState: options.scriptResult?.scriptStateChanged === true ? options.scriptResult.scriptState : void 0,
		model: entry.model,
		provider: entry.provider,
		usage: entry.usage
	}) ?? { kind: CRON_TASK_DETAIL_KIND };
}
/** Stores quiet-trigger recovery facts without creating a run-history detail row. */
function cronQuietTriggerTaskDetail(storeKey, triggerEval) {
	return toJsonValue({
		storeKey,
		triggerFired: false,
		triggerStateChanged: triggerEval.stateChanged,
		...triggerEval.stateChanged ? { triggerState: triggerEval.state } : {}
	}) ?? {
		storeKey,
		triggerFired: false,
		triggerStateChanged: false
	};
}
/** Returns the cron store partition recorded on a task row. */
function cronTaskRecordStoreKey(task) {
	return isJsonObject(task.detail) && typeof task.detail.storeKey === "string" ? task.detail.storeKey : void 0;
}
/** Keeps history projection, recovery, and retention on one task-row timestamp. */
function resolveCronTaskRecordTimestamp(task) {
	return task.endedAt ?? task.lastEventAt ?? task.createdAt;
}
/** Reads internal trigger recovery data without adding it to run-history responses. */
function cronTaskRecordToTriggerEval(task) {
	if (!isJsonObject(task.detail) || typeof task.detail.triggerFired !== "boolean") return;
	return {
		fired: task.detail.triggerFired,
		stateChanged: task.detail.triggerStateChanged === true,
		...task.detail.triggerStateChanged === true && "triggerState" in task.detail ? { state: task.detail.triggerState } : {}
	};
}
/** Reads internal payload-script recovery data without exposing it in run history. */
function cronTaskRecordToScriptRunResult(task) {
	if (!isJsonObject(task.detail) || task.detail.scriptStateChanged !== true) return;
	return {
		scriptStateChanged: true,
		...Object.hasOwn(task.detail, "scriptState") ? { scriptState: task.detail.scriptState } : {}
	};
}
/** Maps the cron outcome vocabulary onto generic task terminal states. */
function cronRunStatusToTaskStatus(entry) {
	if (entry.status === "ok") return "succeeded";
	return entry.status === "error" && isCronTimeoutErrorText(entry.error) ? "timed_out" : "failed";
}
/** Reconstructs the unchanged CronRunLogEntry wire shape from a cron task row. */
function cronTaskRecordToRunLogEntry(task) {
	if (task.runtime !== "cron" || !task.sourceId || !isJsonObject(task.detail)) return null;
	if (task.detail.kind !== CRON_TASK_DETAIL_KIND) return null;
	const wireDetail = { ...task.detail };
	delete wireDetail.storeKey;
	const entry = parseCronRunLogEntryObject({
		...wireDetail,
		ts: resolveCronTaskRecordTimestamp(task),
		jobId: task.sourceId,
		action: "finished",
		status: isCronRunStatus(task.detail.status) ? task.detail.status : void 0,
		error: task.error,
		summary: task.terminalSummary,
		sessionKey: task.childSessionKey,
		runId: typeof task.detail.runId === "string" ? task.detail.runId : void 0
	}, { jobId: task.sourceId });
	if (!entry) return null;
	return {
		...entry,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus,
		deliveryError: entry.deliveryError,
		sessionId: entry.sessionId,
		sessionKey: entry.sessionKey
	};
}
//#endregion
//#region src/infra/sqlite-number.ts
const MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
/** Converts a SQLite number or safely representable bigint column into a JavaScript number. */
function normalizeSqliteNumber(value) {
	if (typeof value === "bigint") {
		if (value > MAX_SAFE_INTEGER_BIGINT || value < -MAX_SAFE_INTEGER_BIGINT) return;
		return Number(value);
	}
	return typeof value === "number" ? value : void 0;
}
//#endregion
//#region src/infra/state-migrations.cron-run-logs.ts
const CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
const CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function tableExists$1(db, name) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").get(name));
}
function parseDetail(raw) {
	return raw ? safeParseJsonRecord(raw) : void 0;
}
function collectMirroredTasks(db) {
	const rows = db.prepare(`SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`).all();
	const bySource = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const detail = parseDetail(row.detail_json);
		if (!row.source_id || detail?.kind !== "cron-run") continue;
		const identities = bySource.get(row.source_id) ?? [];
		identities.push({
			endedAt: normalizeSqliteNumber(row.ended_at) ?? null,
			...typeof detail.runId === "string" && detail.runId ? { runId: detail.runId } : {}
		});
		bySource.set(row.source_id, identities);
	}
	return bySource;
}
function hasMirroredIdentity(identities, runId, endedAt) {
	return identities.some((identity) => runId && identity.runId ? identity.runId === runId : identity.endedAt === endedAt);
}
function integerToBoolean(value) {
	return value === null || value === void 0 ? void 0 : Number(value) !== 0;
}
/** Legacy rows trust write-time errorReason and diagnostic redaction without recomputation. */
function parseLegacyRow(row) {
	let rawEntry;
	try {
		rawEntry = JSON.parse(row.entry_json ?? "");
	} catch {
		return null;
	}
	const parsed = parseCronRunLogEntryObject(rawEntry, { jobId: row.job_id });
	if (!parsed) return null;
	return {
		...parsed,
		ts: normalizeSqliteNumber(row.ts) ?? parsed.ts,
		jobId: row.job_id,
		status: row.status ?? parsed.status,
		error: row.error ?? parsed.error,
		summary: row.summary ?? parsed.summary,
		delivered: integerToBoolean(row.delivered) ?? parsed.delivered,
		deliveryStatus: row.delivery_status ?? parsed.deliveryStatus,
		deliveryError: row.delivery_error ?? parsed.deliveryError,
		sessionId: row.session_id ?? parsed.sessionId,
		sessionKey: row.session_key ?? parsed.sessionKey,
		runId: row.run_id ?? parsed.runId,
		runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
		durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
		nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
		model: row.model ?? parsed.model,
		provider: row.provider ?? parsed.provider
	};
}
function ordinalKey(jobId, ts) {
	return `${jobId}\0${ts}`;
}
/** Runs inside the state schema transaction and removes the retired table after import. */
function migrateLegacyCronRunLogsToTaskRuns(db) {
	if (!tableExists$1(db, "cron_run_logs")) return {
		imported: 0,
		alreadyMirrored: 0,
		malformed: 0,
		skipped: true
	};
	const mirrored = collectMirroredTasks(db);
	const ordinals = /* @__PURE__ */ new Map();
	const insert = db.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `);
	let imported = 0;
	let alreadyMirrored = 0;
	let malformed = 0;
	let offset = 0;
	while (true) {
		const rows = db.prepare(`SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`).all(CRON_RUN_LOG_IMPORT_BATCH_SIZE, offset);
		if (rows.length === 0) break;
		offset += rows.length;
		for (const row of rows) {
			const entry = parseLegacyRow(row);
			if (!entry) {
				malformed++;
				continue;
			}
			const key = ordinalKey(entry.jobId, entry.ts);
			const ordinal = (ordinals.get(key) ?? 0) + 1;
			ordinals.set(key, ordinal);
			if (hasMirroredIdentity(mirrored.get(entry.jobId) ?? [], entry.runId, entry.ts)) {
				alreadyMirrored++;
				continue;
			}
			const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
			const status = cronRunStatusToTaskStatus(entry);
			insert.run({
				task_id: taskId,
				source_id: entry.jobId,
				child_session_key: entry.sessionKey ?? null,
				run_id: taskId,
				task: entry.jobId,
				status,
				created_at: entry.runAtMs ?? entry.ts,
				started_at: entry.runAtMs ?? null,
				ended_at: entry.ts,
				error: entry.error ?? null,
				terminal_summary: entry.summary ?? null,
				terminal_outcome: status === "succeeded" ? "succeeded" : null,
				detail_json: JSON.stringify(cronRunLogEntryToTaskDetail(entry, { storeKey: row.store_key }))
			});
			imported++;
		}
	}
	db.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);
	const result = {
		imported,
		alreadyMirrored,
		malformed,
		skipped: false
	};
	const now = Date.now();
	db.prepare(`INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`).run(CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID, now, now, JSON.stringify(result));
	return result;
}
//#endregion
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const OPENCLAW_QUARANTINE_DIR_MODE = 448;
const OPENCLAW_QUARANTINE_FILE_MODE = 384;
function resolveQuarantineStorePath(env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
function ensureQuarantineStoreDirectory(storePath) {
	const dir = path.dirname(storePath);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_QUARANTINE_DIR_MODE
	});
	applyPrivateModeSync(dir, OPENCLAW_QUARANTINE_DIR_MODE);
}
function configureQuarantineWriter(database, storePath) {
	database.exec(`
    PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion === OPENCLAW_QUARANTINE_SCHEMA_VERSION) return;
	if (userVersion === 1) {
		database.exec(`
      BEGIN IMMEDIATE;
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
      COMMIT;
    `);
		return;
	}
	database.exec(`
    BEGIN IMMEDIATE;
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    COMMIT;
  `);
}
function readQuarantineSchemaVersion(database, storePath) {
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	return userVersion;
}
function withQuarantineWriter(env, operation) {
	const storePath = resolveQuarantineStorePath(env);
	const existed = existsSync(storePath);
	ensureQuarantineStoreDirectory(storePath);
	const database = openNodeSqliteDatabase(storePath);
	let completed = false;
	try {
		if (!existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
		configureQuarantineWriter(database, storePath);
		const result = operation(database);
		completed = true;
		return result;
	} finally {
		database.close();
		if (completed || !existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
	}
}
/** Read one authoritative quarantine decision without creating the store. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	if (!existsSync(storePath)) return;
	const database = openNodeSqliteDatabase(storePath);
	try {
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
		const userVersion = readQuarantineSchemaVersion(database, storePath);
		if (userVersion === 0) return;
		if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
		const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
		const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
		if (!row) return;
		if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || row.verified_generation !== void 0 && row.verified_generation !== null && typeof row.verified_generation !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		if (typeof row.verified_generation === "string") {
			let verifiedGeneration;
			try {
				verifiedGeneration = parseSqliteFileGeneration(row.verified_generation);
			} catch {
				throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
			}
			try {
				const currentGeneration = readStableSqliteFileGeneration(path.resolve(pathname));
				if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
			} catch {
				return;
			}
		}
		return {
			kind: row.kind,
			quarantinedAt: row.quarantined_at,
			reason: row.reason
		};
	} finally {
		database.close();
	}
}
/** Persist one authoritative quarantine decision. */
function recordOpenClawDatabaseQuarantine(options) {
	const serializedGeneration = options.generation ? serializeSqliteFileGeneration(options.generation) : null;
	try {
		return withQuarantineWriter(options.env ?? process.env, (database) => {
			database.exec("BEGIN IMMEDIATE;");
			try {
				database.prepare(`
              INSERT INTO quarantined_databases (
                path, kind, reason, quarantined_at, writer_app_version, verified_generation
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(path) DO UPDATE SET
                kind = excluded.kind,
                reason = excluded.reason,
                quarantined_at = excluded.quarantined_at,
                writer_app_version = excluded.writer_app_version,
                verified_generation = excluded.verified_generation
            `).run(path.resolve(options.path), options.kind, options.reason, Date.now(), VERSION, serializedGeneration);
				database.exec("COMMIT;");
				return true;
			} catch (error) {
				database.exec("ROLLBACK;");
				throw error;
			}
		});
	} catch {
		return false;
	}
}
/** Clear one authoritative quarantine decision. */
function clearOpenClawDatabaseQuarantine(pathname, options = {}) {
	const env = options.env ?? process.env;
	if (!existsSync(resolveQuarantineStorePath(env))) return true;
	try {
		return withQuarantineWriter(env, (database) => {
			database.exec("BEGIN IMMEDIATE;");
			try {
				database.prepare("DELETE FROM quarantined_databases WHERE path = ?").run(path.resolve(pathname));
				database.exec("COMMIT;");
				return true;
			} catch (error) {
				database.exec("ROLLBACK;");
				throw error;
			}
		});
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/openclaw-state-db-schema-helpers.ts
function tableHasColumn(db, tableName, columnName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().some((row) => row.name === columnName);
}
function tablePrimaryKeyColumns(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
	return db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
	const columnName = columnSql.trim().split(/\s+/, 1)[0];
	if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName)) return false;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
	return true;
}
//#endregion
//#region src/state/openclaw-state-db-audit-migration.ts
const AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
const AUDIT_EVENT_LEGACY_COLUMNS = [
	"sequence",
	"event_id",
	"source_id",
	"source_sequence",
	"occurred_at",
	"kind",
	"action",
	"status",
	"error_code",
	"actor_type",
	"actor_id",
	"agent_id",
	"session_key",
	"session_id",
	"run_id",
	"tool_call_id",
	"tool_name"
];
const AUDIT_EVENT_V2_COLUMNS = [
	"sequence",
	"event_id",
	"source_id",
	"schema_version",
	"source_sequence",
	"occurred_at",
	"kind",
	"action",
	"status",
	"error_code",
	"actor_type",
	"actor_id",
	"agent_id",
	"session_key",
	"session_id",
	"run_id",
	"tool_call_id",
	"tool_name",
	"direction",
	"channel",
	"conversation_kind",
	"message_outcome",
	"reason_code",
	"delivery_kind",
	"failure_stage",
	"duration_ms",
	"result_count",
	"account_ref",
	"conversation_ref",
	"message_ref",
	"target_ref"
];
function tableColumnInfo(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all();
}
function tableHasExactColumns(db, tableName, expected) {
	const names = tableColumnInfo(db, tableName).map((column) => column.name);
	return names.length === expected.length && names.every((name, index) => name === expected[index]);
}
function tableHasRequiredColumns(db, tableName, required) {
	const columns = new Map(tableColumnInfo(db, tableName).map((column) => [column.name, column]));
	return required.every((name) => Number(columns.get(name)?.notnull ?? 0) === 1);
}
function tableSql$1(db, tableName) {
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function tableHasUniqueColumn(db, tableName, columnName) {
	return db.prepare(`PRAGMA index_list(${tableName})`).all().some((index) => {
		if (Number(index.unique ?? 0) !== 1 || typeof index.name !== "string") return false;
		const escaped = index.name.replaceAll("'", "''");
		const columns = db.prepare(`PRAGMA index_info('${escaped}')`).all();
		return columns.length === 1 && columns[0]?.name === columnName;
	});
}
function hasCanonicalAuditEventTable(db, expectedColumns, requiredColumns) {
	const sql = tableSql$1(db, "audit_events")?.toLowerCase();
	return tableHasExactColumns(db, "audit_events", expectedColumns) && tablePrimaryKeyColumns(db, "audit_events").join(",") === "sequence" && tableHasRequiredColumns(db, "audit_events", requiredColumns) && typeof sql === "string" && /\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(sql) && tableHasUniqueColumn(db, "audit_events", "event_id") && tableHasUniqueColumn(db, "audit_events", "source_id");
}
function hasCanonicalAuditIdentityKeyTable(db) {
	if (!tableExists(db, "audit_identity_keys")) return false;
	const sql = tableSql$1(db, "audit_identity_keys")?.toLowerCase();
	return tableHasExactColumns(db, "audit_identity_keys", [
		"id",
		"key_id",
		"key",
		"created_at"
	]) && tablePrimaryKeyColumns(db, "audit_identity_keys").join(",") === "id" && tableHasRequiredColumns(db, "audit_identity_keys", [
		"id",
		"key_id",
		"key",
		"created_at"
	]) && typeof sql === "string" && /\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(sql);
}
function hasCanonicalAuditEventsSchema(db) {
	if (!tableExists(db, "audit_events")) return readSqliteUserVersion(db) < AUDIT_EVENT_STATE_SCHEMA_VERSION && !tableExists(db, "audit_identity_keys");
	return hasCanonicalAuditEventTable(db, AUDIT_EVENT_V2_COLUMNS, [
		"event_id",
		"source_id",
		"schema_version",
		"source_sequence",
		"occurred_at",
		"kind",
		"action",
		"status",
		"actor_type",
		"actor_id"
	]) && hasCanonicalAuditIdentityKeyTable(db);
}
function canRepairLegacyAuditEventsSchema(db) {
	if (!tableExists(db, "audit_events") || tableExists(db, "audit_events_migration_new") || tableHasColumn(db, "audit_events", "schema_version")) return false;
	return (!tableExists(db, "audit_identity_keys") || hasCanonicalAuditIdentityKeyTable(db)) && hasCanonicalAuditEventTable(db, AUDIT_EVENT_LEGACY_COLUMNS, [
		"event_id",
		"source_id",
		"source_sequence",
		"occurred_at",
		"kind",
		"action",
		"status",
		"actor_type",
		"actor_id",
		"agent_id",
		"run_id"
	]);
}
function readAuditEventSequenceHighWater(db) {
	if (!tableExists(db, "sqlite_sequence")) return;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = 'audit_events'").get();
	if (row === void 0) return;
	if (typeof row.seq !== "string" || !/^\d+$/.test(row.seq)) throw new Error("audit event sequence high-water mark is invalid");
	const sequence = BigInt(row.seq);
	if (sequence > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("audit event sequence high-water mark exceeds the supported integer range");
	return Number(sequence);
}
function restoreAuditEventSequenceHighWater(db, sequence) {
	if (sequence === void 0) return;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = 'audit_events'").run();
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES ('audit_events', ?)").run(sequence);
}
function repairAuditEventsSchema(db) {
	if (hasCanonicalAuditEventsSchema(db) || !canRepairLegacyAuditEventsSchema(db)) return false;
	const sequenceHighWater = readAuditEventSequenceHighWater(db);
	db.exec(`
    CREATE TABLE audit_events_migration_new (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      source_id TEXT NOT NULL UNIQUE,
      schema_version INTEGER NOT NULL DEFAULT 1,
      source_sequence INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      error_code TEXT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      session_id TEXT,
      run_id TEXT,
      tool_call_id TEXT,
      tool_name TEXT,
      direction TEXT,
      channel TEXT,
      conversation_kind TEXT,
      message_outcome TEXT,
      reason_code TEXT,
      delivery_kind TEXT,
      failure_stage TEXT,
      duration_ms INTEGER,
      result_count INTEGER,
      account_ref TEXT,
      conversation_ref TEXT,
      message_ref TEXT,
      target_ref TEXT
    );
    INSERT INTO audit_events_migration_new (
      sequence,
      event_id,
      source_id,
      schema_version,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    )
    SELECT
      sequence,
      event_id,
      source_id,
      1,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    FROM audit_events;
    DROP TABLE audit_events;
    ALTER TABLE audit_events_migration_new RENAME TO audit_events;
    CREATE INDEX idx_audit_events_time
      ON audit_events(occurred_at DESC, sequence DESC);
    CREATE INDEX idx_audit_events_agent_sequence
      ON audit_events(agent_id, sequence DESC);
    CREATE INDEX idx_audit_events_session_sequence
      ON audit_events(session_key, sequence DESC);
    CREATE INDEX idx_audit_events_run_sequence
      ON audit_events(run_id, sequence DESC);
    CREATE INDEX idx_audit_events_kind_sequence
      ON audit_events(kind, sequence DESC);
    CREATE INDEX idx_audit_events_status_sequence
      ON audit_events(status, sequence DESC);
    CREATE INDEX idx_audit_events_channel_sequence
      ON audit_events(channel, sequence DESC);
    CREATE INDEX idx_audit_events_direction_sequence
      ON audit_events(direction, sequence DESC);
    CREATE TABLE IF NOT EXISTS audit_identity_keys (
      id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
      key_id TEXT NOT NULL,
      key BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
	restoreAuditEventSequenceHighWater(db, sequenceHighWater);
	return true;
}
//#endregion
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readStableSqliteFileGeneration(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath);
			if (generation && !generationMatchesPath(resolvedPath, generation)) {
				failures.delete(resolvedPath);
				return false;
			}
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: () => {
			failures.clear();
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-additive-columns.ts
const CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS = [
	{
		columnName: "bootstrap_content_digest",
		dataType: "TEXT",
		tableName: "claw_installs"
	},
	{
		columnName: "bootstrap_source_path",
		dataType: "TEXT",
		tableName: "claw_installs"
	},
	{
		columnName: "desktop_json",
		dataType: "TEXT",
		tableName: "worker_environments"
	},
	{
		columnName: "bootstrap_install_kind",
		dataType: "TEXT",
		tableName: "worker_environments"
	},
	{
		columnName: "extension_adapter_identity",
		dataType: "TEXT",
		tableName: "claw_package_refs"
	},
	{
		columnName: "extension_detected_format",
		dataType: "TEXT",
		tableName: "claw_package_refs"
	},
	{
		columnName: "extension_format",
		dataType: "TEXT",
		tableName: "claw_package_refs"
	},
	{
		columnName: "extension_id",
		dataType: "TEXT",
		tableName: "claw_package_refs"
	},
	{
		columnName: "extension_mapped_json",
		dataType: "TEXT",
		tableName: "claw_package_refs"
	},
	{
		columnName: "extension_unavailable_json",
		dataType: "TEXT",
		tableName: "claw_package_refs"
	},
	{
		columnName: "shared_host",
		dataType: "INTEGER",
		tableName: "worker_environments"
	},
	{
		columnName: "terminal_reason",
		dataType: "TEXT",
		tableName: "worker_session_placements"
	},
	{
		columnName: "terminal_at_ms",
		dataType: "INTEGER",
		tableName: "worker_session_placements"
	},
	{
		columnName: "run_end_cleanup_json",
		dataType: "TEXT",
		tableName: "worktrees"
	},
	{
		columnName: "setup_id",
		dataType: "TEXT",
		tableName: "device_bootstrap_tokens"
	},
	{
		columnName: "workspace_dir",
		dataType: "TEXT",
		tableName: "installed_plugin_index"
	},
	{
		columnName: "allowed_hosts",
		dataType: "TEXT",
		tableName: "secret_store_entries"
	}
];
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS = CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.filter(({ columnName, tableName }) => tableName !== "device_bootstrap_tokens" || columnName !== "setup_id");
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS = CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.filter(({ columnName, tableName }) => tableName === "device_bootstrap_tokens" && columnName === "setup_id");
//#endregion
//#region src/state/openclaw-state-schema.ts
const OPENCLAW_STATE_SCHEMA_SQL = "CREATE TABLE IF NOT EXISTS auth_profile_stores (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS auth_profile_state (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  state_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_stores (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  format_version INTEGER NOT NULL CHECK (format_version = 1),\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (\n  state TEXT NOT NULL PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  create_time INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS diagnostic_events (\n  scope TEXT NOT NULL,\n  event_key TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  sequence INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (scope, event_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence\n  ON diagnostic_events(scope, sequence, event_key);\n\nCREATE TABLE IF NOT EXISTS skill_usage (\n  skill_file TEXT NOT NULL PRIMARY KEY,\n  skill_key TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  skill_source TEXT NOT NULL,\n  first_used_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER NOT NULL,\n  use_count INTEGER NOT NULL,\n  last_agent_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_usage_key\n  ON skill_usage(skill_key, skill_file);\n\nCREATE TABLE IF NOT EXISTS skill_lifecycle (\n  skill_file TEXT NOT NULL PRIMARY KEY,\n  skill_key TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('active', 'stale', 'archived')),\n  pinned INTEGER NOT NULL DEFAULT 0,\n  state_changed_at_ms INTEGER NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  archived_reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_lifecycle_key\n  ON skill_lifecycle(skill_key, skill_file);\n\nCREATE INDEX IF NOT EXISTS idx_skill_lifecycle_state\n  ON skill_lifecycle(state, skill_file);\n\nCREATE TABLE IF NOT EXISTS skill_curator_state (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  last_attempt_at_ms INTEGER NOT NULL,\n  last_success_at_ms INTEGER,\n  last_error TEXT,\n  last_result_json TEXT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposals (\n  proposal_id TEXT NOT NULL PRIMARY KEY,\n  record_json TEXT NOT NULL,\n  owner_agent_id TEXT,\n  workspace_dir TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL,\n  draft_hash TEXT NOT NULL,\n  origin_agent_id TEXT,\n  origin_session_key TEXT,\n  origin_run_id TEXT,\n  origin_message_id TEXT,\n  applied_at TEXT,\n  rejected_at TEXT,\n  quarantined_at TEXT,\n  stale_at TEXT,\n  status_reason TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposal_origin_runs (\n  proposal_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  position INTEGER NOT NULL,\n  mutation_count INTEGER NOT NULL CHECK (mutation_count > 0),\n  PRIMARY KEY (proposal_id, run_id),\n  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposal_rollbacks (\n  proposal_id TEXT NOT NULL PRIMARY KEY,\n  written_at TEXT NOT NULL,\n  target_skill_file TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('create', 'update')),\n  previous_content_hash TEXT,\n  previous_content TEXT,\n  support_files_json TEXT,\n  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposal_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  proposal_id TEXT NOT NULL,\n  proposed_version TEXT NOT NULL,\n  revision_hash TEXT NOT NULL,\n  event_type TEXT NOT NULL CHECK (event_type IN (\n    'created',\n    'revised',\n    'evaluation_completed',\n    'applied',\n    'rejected',\n    'quarantined',\n    'stale'\n  )),\n  occurred_at TEXT NOT NULL,\n  actor_json TEXT NOT NULL,\n  correlation_id TEXT,\n  payload_json TEXT,\n  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS audit_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  source_id TEXT NOT NULL UNIQUE,\n  schema_version INTEGER NOT NULL DEFAULT 1,\n  source_sequence INTEGER NOT NULL,\n  occurred_at INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  action TEXT NOT NULL,\n  status TEXT NOT NULL,\n  error_code TEXT,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  agent_id TEXT,\n  session_key TEXT,\n  session_id TEXT,\n  run_id TEXT,\n  tool_call_id TEXT,\n  tool_name TEXT,\n  direction TEXT,\n  channel TEXT,\n  conversation_kind TEXT,\n  message_outcome TEXT,\n  reason_code TEXT,\n  delivery_kind TEXT,\n  failure_stage TEXT,\n  duration_ms INTEGER,\n  result_count INTEGER,\n  account_ref TEXT,\n  conversation_ref TEXT,\n  message_ref TEXT,\n  target_ref TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_time\n  ON audit_events(occurred_at DESC, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence\n  ON audit_events(agent_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence\n  ON audit_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence\n  ON audit_events(run_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence\n  ON audit_events(kind, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence\n  ON audit_events(status, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence\n  ON audit_events(channel, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence\n  ON audit_events(direction, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS audit_identity_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  key_id TEXT NOT NULL,\n  key BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS execution_identity_contexts (\n  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  created_at INTEGER NOT NULL CHECK (created_at >= 0),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),\n  context_json TEXT NOT NULL CHECK (length(context_json) > 0),\n  UNIQUE (created_at, context_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx\n  ON execution_identity_contexts (run_id, created_at, execution_id);\n\nCREATE TABLE IF NOT EXISTS execution_decision_facts (\n  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),\n  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),\n  decision_outcome TEXT NOT NULL CHECK (\n    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')\n  ),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),\n  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),\n  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),\n  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),\n  UNIQUE (occurred_at, receipt_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx\n  ON execution_decision_facts (context_id, occurred_at, receipt_id);\nCREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx\n  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n\nCREATE TABLE IF NOT EXISTS session_state_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  dedupe_key TEXT UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT,\n  agent_id TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT,\n  run_id TEXT,\n  occurred_at INTEGER NOT NULL,\n  summary TEXT NOT NULL,\n  payload_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence\n  ON session_state_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_time\n  ON session_state_events(occurred_at DESC, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS session_state_heads (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  last_sequence INTEGER NOT NULL,\n  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\n-- Notifiable watcher identity is the bare session key, matching the process-local\n-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake\n-- watches from ambient queue-only group watches. Other bare keys\n-- (session.scope=\"global\") are ambiguous across agents and excluded until watcher\n-- identity is agent-scoped end-to-end.\nCREATE TABLE IF NOT EXISTS session_watch_cursors (\n  watcher_session_key TEXT NOT NULL,\n  target_session_key TEXT NOT NULL,\n  last_seen_sequence INTEGER NOT NULL DEFAULT 0,\n  notified_sequence INTEGER NOT NULL DEFAULT 0,\n  material_sequence INTEGER NOT NULL DEFAULT 0,\n  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (watcher_session_key, target_session_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target\n  ON session_watch_cursors(target_session_key);\n\nCREATE TABLE IF NOT EXISTS session_upstream_links (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  catalog_id TEXT NOT NULL,\n  host_id TEXT NOT NULL,\n  thread_id TEXT NOT NULL,\n  upstream_kind TEXT NOT NULL,\n  upstream_ref_json TEXT,\n  last_marker_json TEXT,\n  last_scanned_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  -- (session_key, agent_id) composite identity: under session.scope=\"global\" agents\n  -- share bare keys; a key-only row would let one agent overwrite another's upstream.\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id\n  ON session_upstream_links(catalog_id);\n\nCREATE TABLE IF NOT EXISTS diagnostic_stability_bundles (\n  bundle_key TEXT NOT NULL PRIMARY KEY,\n  reason TEXT NOT NULL,\n  generated_at TEXT NOT NULL,\n  bundle_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_diagnostic_stability_bundles_created\n  ON diagnostic_stability_bundles(created_at DESC, bundle_key);\n\nCREATE TABLE IF NOT EXISTS state_leases (\n  scope TEXT NOT NULL,\n  lease_key TEXT NOT NULL,\n  owner TEXT NOT NULL,\n  expires_at INTEGER,\n  heartbeat_at INTEGER,\n  payload_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, lease_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_expiry\n  ON state_leases(expires_at, scope, lease_key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_owner\n  ON state_leases(owner, updated_at DESC);\n\nCREATE TABLE IF NOT EXISTS exec_approvals_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  raw_json TEXT NOT NULL,\n  socket_path TEXT,\n  has_socket_token INTEGER NOT NULL,\n  default_security TEXT,\n  default_ask TEXT,\n  default_ask_fallback TEXT,\n  auto_allow_skills INTEGER,\n  agent_count INTEGER NOT NULL,\n  allowlist_count INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approvals (\n  approval_id TEXT NOT NULL PRIMARY KEY CHECK (\n    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')\n  ),\n  resolution_ref TEXT NOT NULL CHECK (\n    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'\n  ),\n  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),\n  presentation_json TEXT NOT NULL,\n  requested_by_device_id TEXT,\n  requested_by_client_id TEXT,\n  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,\n  reviewer_device_ids_json TEXT NOT NULL,\n  source_agent_id TEXT,\n  source_session_key TEXT,\n  source_session_id TEXT,\n  source_run_id TEXT,\n  source_tool_call_id TEXT,\n  source_tool_name TEXT,\n  audience_session_keys_json TEXT NOT NULL,\n  runtime_epoch TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),\n  terminal_reason TEXT CHECK (\n    terminal_reason IN (\n      'user',\n      'timeout',\n      'malformed-verdict',\n      'no-route',\n      'run-aborted',\n      'gateway-restart',\n      'storage-corrupt'\n    )\n  ),\n  resolved_at_ms INTEGER,\n  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),\n  resolver_id TEXT,\n  consumed_at_ms INTEGER,\n  consumed_by TEXT,\n  CHECK (expires_at_ms >= created_at_ms),\n  CHECK (updated_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),\n  CHECK (requested_by_device_token_auth IN (0, 1)),\n  CHECK (\n    (\n      status = 'pending'\n      AND decision IS NULL\n      AND terminal_reason IS NULL\n      AND resolved_at_ms IS NULL\n      AND resolver_kind IS NULL\n      AND resolver_id IS NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'allowed'\n      AND decision IN ('allow-once', 'allow-always')\n      AND terminal_reason = 'user'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n    )\n    OR (\n      status = 'denied'\n      AND decision = 'deny'\n      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'expired'\n      AND decision = 'deny'\n      AND terminal_reason = 'timeout'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'cancelled'\n      AND decision = 'deny'\n      AND terminal_reason IN ('run-aborted', 'gateway-restart')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n  ),\n  CHECK (\n    (consumed_at_ms IS NULL AND consumed_by IS NULL)\n    OR (\n      status = 'allowed'\n      AND decision = 'allow-once'\n      AND consumed_at_ms IS NOT NULL\n      AND consumed_by IS NOT NULL\n    )\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry\n  ON operator_approvals(status, expires_at_ms, approval_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref\n  ON operator_approvals(resolution_ref);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created\n  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_run_resolved\n  ON operator_approvals(source_run_id, resolved_at_ms, approval_id)\n  WHERE source_run_id IS NOT NULL AND resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved\n  ON operator_approvals(resolved_at_ms, approval_id)\n  WHERE resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending\n  ON operator_approvals(runtime_epoch, approval_id)\n  WHERE status = 'pending';\n\nCREATE TABLE IF NOT EXISTS operator_approval_execution_identities (\n  approval_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  source_context_id TEXT NOT NULL CHECK (\n    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)\n  ),\n  source_execution_id TEXT NOT NULL CHECK (\n    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)\n  )\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_machine_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  value_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_pending (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  remote_ip TEXT,\n  silent INTEGER,\n  is_repair INTEGER,\n  ts INTEGER NOT NULL,\n  refreshed_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device\n  ON device_pairing_pending(device_id, ts DESC);\n\nCREATE TABLE IF NOT EXISTS device_pairing_paired (\n  device_id TEXT NOT NULL PRIMARY KEY,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  operator_label TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  approved_scopes_json TEXT,\n  remote_ip TEXT,\n  tokens_json TEXT,\n  approved_via TEXT,\n  node_surface_json TEXT,\n  pending_node_surface_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  approved_at_ms INTEGER NOT NULL,\n  last_seen_at_ms INTEGER,\n  last_seen_reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved\n  ON device_pairing_paired(approved_at_ms DESC, device_id);\n\nCREATE TABLE IF NOT EXISTS device_bootstrap_tokens (\n  token_key TEXT NOT NULL PRIMARY KEY,\n  token TEXT NOT NULL,\n  setup_id TEXT,\n  ts INTEGER NOT NULL,\n  device_id TEXT,\n  public_key TEXT,\n  profile_json TEXT,\n  redeemed_profile_json TEXT,\n  pending_profile_json TEXT,\n  issued_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts\n  ON device_bootstrap_tokens(ts);\n\n-- Terminal outcome of a redeemed setup credential. The bootstrap row is deleted\n-- on redemption, so this is the only durable proof a setup code succeeded; the\n-- presenting client reconciles it when the completion broadcast is missed.\n-- Non-secret only: never the bootstrap token or anything derived from it.\n-- Bounded by retention to a handful of live rows, so the primary key is the\n-- only access path worth having.\nCREATE TABLE IF NOT EXISTS device_pair_setup_completions (\n  setup_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  device_name TEXT,\n  access TEXT NOT NULL,\n  completed_at_ms INTEGER NOT NULL,\n  delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),\n  retain_until_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_join_codes (\n  shortcode TEXT,\n  payload_json TEXT,\n  created_at_ms INTEGER,\n  expires_at_ms INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_identities (\n  identity_key TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key_pem TEXT NOT NULL,\n  private_key_pem TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_identities_device\n  ON device_identities(device_id, updated_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS device_auth_tokens (\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (device_id, role)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated\n  ON device_auth_tokens(updated_at_ms DESC, device_id, role);\n\nCREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (\n  gateway_scope TEXT NOT NULL,\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (gateway_scope, device_id, role)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS android_notification_recent_packages (\n  package_name TEXT NOT NULL PRIMARY KEY,\n  sort_order INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_android_notification_recent_packages_order\n  ON android_notification_recent_packages(sort_order, package_name);\n\nCREATE TABLE IF NOT EXISTS macos_port_guardian_records (\n  pid INTEGER NOT NULL PRIMARY KEY,\n  port INTEGER NOT NULL,\n  command TEXT NOT NULL,\n  mode TEXT NOT NULL,\n  timestamp REAL NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port\n  ON macos_port_guardian_records(port, timestamp DESC);\n\nCREATE TABLE IF NOT EXISTS onboarding_recommendations (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  inventory_hash TEXT NOT NULL,\n  matches_json TEXT NOT NULL,\n  offered_at_ms INTEGER NOT NULL,\n  accepted_at_ms INTEGER,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS workspace_setup_state (\n  workspace_key TEXT NOT NULL PRIMARY KEY,\n  workspace_path TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  bootstrap_seeded_at TEXT,\n  setup_completed_at TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path\n  ON workspace_setup_state(workspace_path);\n\nCREATE TABLE IF NOT EXISTS workspace_path_aliases (\n  alias_key TEXT NOT NULL PRIMARY KEY,\n  alias_path TEXT NOT NULL,\n  workspace_key TEXT NOT NULL,\n  workspace_path TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace\n  ON workspace_path_aliases(workspace_key);\n\nCREATE TABLE IF NOT EXISTS workspace_attestations (\n  workspace_key TEXT NOT NULL PRIMARY KEY,\n  attested_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_attestations_attested\n  ON workspace_attestations(attested_at_ms DESC, workspace_key);\n\nCREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (\n  workspace_key TEXT NOT NULL,\n  filename TEXT NOT NULL,\n  sha256 TEXT NOT NULL,\n  PRIMARY KEY (workspace_key, filename),\n  FOREIGN KEY (workspace_key) REFERENCES workspace_attestations(workspace_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS native_hook_relay_bridges (\n  relay_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  hostname TEXT NOT NULL,\n  port INTEGER NOT NULL,\n  token TEXT NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires\n  ON native_hook_relay_bridges(expires_at_ms, relay_id);\n\nCREATE TABLE IF NOT EXISTS model_capability_cache (\n  provider_id TEXT NOT NULL,\n  model_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  input_text INTEGER NOT NULL,\n  input_image INTEGER NOT NULL,\n  reasoning INTEGER NOT NULL,\n  supports_tools INTEGER,\n  context_window INTEGER NOT NULL,\n  max_tokens INTEGER NOT NULL,\n  cost_input REAL NOT NULL,\n  cost_output REAL NOT NULL,\n  cost_cache_read REAL NOT NULL,\n  cost_cache_write REAL NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (provider_id, model_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_model_capability_cache_provider_updated\n  ON model_capability_cache(provider_id, updated_at_ms DESC, model_id);\n\nCREATE TABLE IF NOT EXISTS agent_model_catalogs (\n  catalog_key TEXT NOT NULL PRIMARY KEY,\n  agent_dir TEXT NOT NULL,\n  raw_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_model_catalogs_agent_dir\n  ON agent_model_catalogs(agent_dir, updated_at DESC);\n\nCREATE TABLE IF NOT EXISTS managed_outgoing_image_records (\n  attachment_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  agent_id TEXT,\n  message_id TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT,\n  retention_class TEXT,\n  alt TEXT NOT NULL,\n  original_media_root TEXT NOT NULL,\n  original_media_id TEXT NOT NULL,\n  original_media_subdir TEXT NOT NULL,\n  original_content_type TEXT NOT NULL,\n  original_width INTEGER,\n  original_height INTEGER,\n  original_size_bytes INTEGER,\n  original_filename TEXT,\n  record_json TEXT NOT NULL,\n  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session\n  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message\n  ON managed_outgoing_image_records(session_key, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session\n  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message\n  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS channel_pairing_requests (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  request_id TEXT NOT NULL,\n  code TEXT NOT NULL,\n  created_at TEXT NOT NULL,\n  last_seen_at TEXT NOT NULL,\n  meta_json TEXT,\n  PRIMARY KEY (channel_key, account_id, request_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code\n  ON channel_pairing_requests(channel_key, code);\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created\n  ON channel_pairing_requests(channel_key, created_at, request_id);\n\nCREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  entry TEXT NOT NULL,\n  sort_order INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (channel_key, account_id, entry)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account\n  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);\n\nCREATE TABLE IF NOT EXISTS web_push_subscriptions (\n  endpoint_hash TEXT NOT NULL PRIMARY KEY,\n  subscription_id TEXT NOT NULL UNIQUE,\n  endpoint TEXT NOT NULL,\n  p256dh TEXT NOT NULL,\n  auth TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated\n  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);\n\nCREATE TABLE IF NOT EXISTS web_push_vapid_keys (\n  key_id TEXT NOT NULL PRIMARY KEY,\n  public_key TEXT NOT NULL,\n  private_key TEXT NOT NULL,\n  subject TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS apns_registrations (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  transport TEXT NOT NULL,\n  token TEXT,\n  relay_handle TEXT,\n  send_grant TEXT,\n  installation_id TEXT,\n  relay_origin TEXT,\n  topic TEXT NOT NULL,\n  environment TEXT NOT NULL,\n  distribution TEXT,\n  token_debug_suffix TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_apns_registrations_updated\n  ON apns_registrations(updated_at_ms DESC, node_id);\n\nCREATE TABLE IF NOT EXISTS apns_registration_tombstones (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  deleted_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_host_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  node_id TEXT NOT NULL,\n  token TEXT,\n  display_name TEXT,\n  gateway_host TEXT,\n  gateway_port INTEGER,\n  gateway_tls INTEGER,\n  gateway_tls_fingerprint TEXT,\n  gateway_context_path TEXT,\n  installed_apps_sharing INTEGER NOT NULL DEFAULT 0,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- Node-host-owned launch journal. The descriptor and its credential remain\n-- process memory only; this table records bounded supervision facts.\nCREATE TABLE IF NOT EXISTS node_worker_launches (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(launch_id) BETWEEN 1 AND 256 AND instr(launch_id, char(0)) = 0),\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  gateway_namespace TEXT NOT NULL\n    CHECK (\n      length(gateway_namespace) BETWEEN 1 AND 128\n      AND gateway_namespace NOT GLOB '*[^A-Za-z0-9._-]*'\n      AND gateway_namespace GLOB '[A-Za-z0-9]*'\n    ),\n  environment_id TEXT NOT NULL\n    CHECK (length(environment_id) BETWEEN 1 AND 256 AND instr(environment_id, char(0)) = 0),\n  session_id TEXT NOT NULL\n    CHECK (length(session_id) BETWEEN 1 AND 256 AND instr(session_id, char(0)) = 0),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  placement_generation INTEGER NOT NULL\n    CHECK (placement_generation BETWEEN 0 AND 9007199254740991),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  supervisor_pid INTEGER NOT NULL CHECK (supervisor_pid BETWEEN 1 AND 2147483647),\n  supervisor_start_time INTEGER NOT NULL\n    CHECK (supervisor_start_time BETWEEN 0 AND 9007199254740991),\n  worker_pid INTEGER CHECK (worker_pid IS NULL OR worker_pid BETWEEN 1 AND 2147483647),\n  worker_start_time INTEGER CHECK (\n    worker_start_time IS NULL OR worker_start_time BETWEEN 0 AND 9007199254740991\n  ),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK ((worker_pid IS NULL) = (worker_start_time IS NULL)),\n  CHECK (\n    (state = 'pending'\n      AND worker_pid IS NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'running'\n      AND worker_pid IS NOT NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_launches_terminal_completed\n  ON node_worker_launches(completed_at_ms, launch_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS voicewake_triggers (\n  config_key TEXT NOT NULL,\n  position INTEGER NOT NULL,\n  trigger TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (config_key, position)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_voicewake_triggers_trigger\n  ON voicewake_triggers(config_key, trigger);\n\nCREATE TABLE IF NOT EXISTS voicewake_routing_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  default_target_mode TEXT NOT NULL,\n  default_target_agent_id TEXT,\n  default_target_session_key TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS voicewake_routing_routes (\n  config_key TEXT NOT NULL,\n  position INTEGER NOT NULL,\n  trigger TEXT NOT NULL,\n  target_mode TEXT NOT NULL,\n  target_agent_id TEXT,\n  target_session_key TEXT,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (config_key, position),\n  FOREIGN KEY (config_key) REFERENCES voicewake_routing_config(config_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_voicewake_routing_routes_trigger\n  ON voicewake_routing_routes(config_key, trigger);\n\nCREATE TABLE IF NOT EXISTS update_check_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  last_checked_at TEXT,\n  last_notified_version TEXT,\n  last_notified_tag TEXT,\n  last_available_version TEXT,\n  last_available_tag TEXT,\n  auto_install_id TEXT,\n  auto_first_seen_version TEXT,\n  auto_first_seen_tag TEXT,\n  auto_first_seen_at TEXT,\n  auto_last_attempt_version TEXT,\n  auto_last_attempt_at TEXT,\n  auto_last_success_version TEXT,\n  auto_last_success_at TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_health_entries (\n  config_path TEXT NOT NULL PRIMARY KEY,\n  last_known_good_json TEXT,\n  last_promoted_good_json TEXT,\n  last_observed_suspicious_signature TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS clawhub_promotions_feed_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  etag TEXT,\n  payload_json TEXT,\n  feed_sequence INTEGER,\n  last_checked_at_ms INTEGER,\n  notified_slugs_json TEXT NOT NULL DEFAULT '[]',\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS clawhub_promotion_claims (\n  slug TEXT NOT NULL PRIMARY KEY,\n  provider TEXT,\n  model_keys_json TEXT NOT NULL,\n  ends_at_ms INTEGER NOT NULL,\n  claimed_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS installed_plugin_index (\n  index_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  host_contract_version TEXT NOT NULL,\n  compat_registry_version TEXT NOT NULL,\n  migration_version INTEGER NOT NULL,\n  policy_hash TEXT NOT NULL,\n  generated_at_ms INTEGER NOT NULL,\n  workspace_dir TEXT,\n  refresh_reason TEXT,\n  install_records_json TEXT NOT NULL,\n  plugins_json TEXT NOT NULL,\n  diagnostics_json TEXT NOT NULL,\n  warning TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_installed_plugin_index_generated\n  ON installed_plugin_index(generated_at_ms DESC, index_key);\n\nCREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (\n  feed_url TEXT NOT NULL PRIMARY KEY,\n  body TEXT NOT NULL,\n  status INTEGER NOT NULL,\n  etag TEXT,\n  last_modified TEXT,\n  checksum TEXT NOT NULL,\n  saved_at TEXT NOT NULL,\n  trust_mode TEXT,\n  trust_key_id TEXT,\n  trust_signature_count INTEGER,\n  trust_threshold INTEGER,\n  trust_verified_at TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated\n  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_sentinel (\n  sentinel_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  session_key TEXT,\n  thread_id TEXT,\n  delivery_channel TEXT,\n  delivery_to TEXT,\n  delivery_account_id TEXT,\n  message TEXT,\n  continuation_json TEXT,\n  doctor_hint TEXT,\n  stats_json TEXT,\n  payload_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts\n  ON gateway_restart_sentinel(ts DESC, sentinel_key);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_intent (\n  intent_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  reason TEXT,\n  force INTEGER,\n  wait_ms INTEGER,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS gateway_restart_handoff (\n  handoff_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  intent_id TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  process_instance_id TEXT,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  reason TEXT,\n  restart_trace_started_at INTEGER,\n  restart_trace_last_at INTEGER,\n  source TEXT NOT NULL,\n  restart_kind TEXT NOT NULL,\n  supervisor_mode TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry\n  ON gateway_restart_handoff(expires_at, pid);\n\nCREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (\n  boot_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  started_at_ms INTEGER NOT NULL,\n  completed_at_ms INTEGER,\n  outcome TEXT,\n  startup_reason TEXT,\n  reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started\n  ON gateway_boot_lifecycle(started_at_ms);\n\nCREATE TABLE IF NOT EXISTS acp_sessions (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT,\n  backend TEXT NOT NULL,\n  agent TEXT NOT NULL,\n  runtime_session_name TEXT NOT NULL,\n  identity_json TEXT,\n  mode TEXT NOT NULL,\n  runtime_options_json TEXT,\n  cwd TEXT,\n  state TEXT NOT NULL,\n  last_activity_at INTEGER NOT NULL,\n  last_error TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity\n  ON acp_sessions(state, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity\n  ON acp_sessions(agent, last_activity_at DESC, session_key);\n\nCREATE TABLE IF NOT EXISTS acp_replay_sessions (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  cwd TEXT NOT NULL,\n  complete INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  next_seq INTEGER NOT NULL,\n  -- Running estimate of this session's ledger footprint (row overhead plus\n  -- all event rows), maintained at insert/trim so budget checks never scan\n  -- acp_replay_events (#100622).\n  estimated_bytes INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated\n  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated\n  ON acp_replay_sessions(updated_at DESC, session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  at INTEGER NOT NULL,\n  session_key TEXT NOT NULL,\n  run_id TEXT,\n  update_json TEXT NOT NULL,\n  estimated_bytes INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq\n  ON acp_replay_events(session_id, seq);\n\nCREATE TABLE IF NOT EXISTS agent_databases (\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  size_bytes INTEGER,\n  PRIMARY KEY (agent_id, path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_deletion_journal (\n  agent_id TEXT PRIMARY KEY,\n  operation_id TEXT NOT NULL DEFAULT '',\n  agent_dir TEXT NOT NULL,\n  workspace_dir TEXT NOT NULL,\n  sessions_dir TEXT NOT NULL,\n  database_paths_json TEXT NOT NULL DEFAULT '[]',\n  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',\n  created_at INTEGER NOT NULL,\n  cleanup_completed INTEGER NOT NULL DEFAULT 0,\n  delete_files INTEGER NOT NULL DEFAULT 1\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_database_leases (\n  lease_id TEXT PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  opened_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS plugin_state_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_expiry\n  ON plugin_state_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_listing\n  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key);\n\nCREATE TABLE IF NOT EXISTS channel_ingress_events (\n  queue_name TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  channel_id TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  lane_key TEXT,\n  payload_json TEXT NOT NULL,\n  metadata_json TEXT,\n  received_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  claim_token TEXT,\n  claim_owner TEXT,\n  claimed_at INTEGER,\n  attempts INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  failed_reason TEXT,\n  failed_at INTEGER,\n  completed_at INTEGER,\n  completed_metadata_json TEXT,\n  PRIMARY KEY (queue_name, event_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_pending\n  ON channel_ingress_events(queue_name, status, received_at, event_id);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_claims\n  ON channel_ingress_events(queue_name, status, claimed_at);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_lane\n  ON channel_ingress_events(queue_name, status, lane_key);\n\nCREATE TABLE IF NOT EXISTS plugin_blob_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  metadata_json TEXT NOT NULL,\n  blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry\n  ON plugin_blob_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_listing\n  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);\n\nCREATE TABLE IF NOT EXISTS media_blobs (\n  subdir TEXT NOT NULL,\n  id TEXT NOT NULL,\n  content_type TEXT,\n  size_bytes INTEGER NOT NULL,\n  blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (subdir, id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_media_blobs_created\n  ON media_blobs(created_at);\n\nCREATE TABLE IF NOT EXISTS skill_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  force INTEGER NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT,\n  actual_sha256 TEXT,\n  received_bytes INTEGER NOT NULL,\n  archive_blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  committed INTEGER NOT NULL,\n  committed_at INTEGER,\n  idempotency_key_hash TEXT UNIQUE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry\n  ON skill_uploads(expires_at);\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency\n  ON skill_uploads(idempotency_key_hash)\n  WHERE idempotency_key_hash IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS skill_upload_chunks (\n  upload_id TEXT NOT NULL,\n  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),\n  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),\n  chunk_blob BLOB NOT NULL,\n  PRIMARY KEY (upload_id, byte_offset),\n  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,\n  CHECK (length(chunk_blob) = size_bytes)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_sessions (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  ended_at INTEGER,\n  mode TEXT NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  proxy_url TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_blobs (\n  blob_id TEXT NOT NULL PRIMARY KEY,\n  content_type TEXT,\n  encoding TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  data BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_events (\n  id INTEGER NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  protocol TEXT NOT NULL,\n  direction TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  flow_id TEXT NOT NULL,\n  method TEXT,\n  host TEXT,\n  path TEXT,\n  status INTEGER,\n  close_code INTEGER,\n  content_type TEXT,\n  headers_json TEXT,\n  data_text TEXT,\n  data_blob_id TEXT,\n  data_sha256 TEXT,\n  error_text TEXT,\n  meta_json TEXT,\n  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,\n  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS capture_events_session_ts_idx\n  ON capture_events(session_id, ts);\n\nCREATE INDEX IF NOT EXISTS capture_events_flow_idx\n  ON capture_events(flow_id, ts);\n\nCREATE TABLE IF NOT EXISTS sandbox_registry_entries (\n  registry_kind TEXT NOT NULL,\n  container_name TEXT NOT NULL,\n  session_key TEXT,\n  backend_id TEXT,\n  runtime_label TEXT,\n  image TEXT,\n  created_at_ms INTEGER,\n  last_used_at_ms INTEGER,\n  config_label_kind TEXT,\n  config_hash TEXT,\n  cdp_port INTEGER,\n  no_vnc_port INTEGER,\n  entry_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (registry_kind, container_name)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated\n  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_session\n  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used\n  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)\n  WHERE last_used_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS cron_jobs (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  declaration_key TEXT,\n  display_name TEXT,\n  owner_agent_id TEXT,\n  owner_session_key TEXT,\n  name TEXT NOT NULL,\n  description TEXT,\n  enabled INTEGER NOT NULL,\n  delete_after_run INTEGER,\n  created_at_ms INTEGER NOT NULL,\n  agent_id TEXT,\n  session_key TEXT,\n  schedule_kind TEXT NOT NULL,\n  schedule_expr TEXT,\n  schedule_tz TEXT,\n  every_ms INTEGER,\n  anchor_ms INTEGER,\n  at TEXT,\n  stagger_ms INTEGER,\n  session_target TEXT NOT NULL,\n  wake_mode TEXT NOT NULL,\n  trigger_script TEXT,\n  trigger_once INTEGER,\n  payload_kind TEXT NOT NULL,\n  payload_message TEXT,\n  payload_model TEXT,\n  payload_fallbacks_json TEXT,\n  payload_thinking TEXT,\n  payload_timeout_seconds INTEGER,\n  payload_allow_unsafe_external_content INTEGER,\n  payload_external_content_source_json TEXT,\n  payload_light_context INTEGER,\n  payload_tools_allow_json TEXT,\n  payload_tools_allow_is_default INTEGER,\n  delivery_mode TEXT,\n  delivery_channel TEXT,\n  delivery_to TEXT,\n  delivery_thread_id TEXT,\n  delivery_thread_id_type TEXT,\n  delivery_account_id TEXT,\n  delivery_best_effort INTEGER,\n  delivery_completion_mode TEXT,\n  delivery_completion_to TEXT,\n  failure_delivery_mode TEXT,\n  failure_delivery_channel TEXT,\n  failure_delivery_to TEXT,\n  failure_delivery_account_id TEXT,\n  failure_alert_disabled INTEGER,\n  failure_alert_after INTEGER,\n  failure_alert_channel TEXT,\n  failure_alert_to TEXT,\n  failure_alert_cooldown_ms INTEGER,\n  failure_alert_include_skipped INTEGER,\n  failure_alert_mode TEXT,\n  failure_alert_account_id TEXT,\n  next_run_at_ms INTEGER,\n  running_at_ms INTEGER,\n  last_run_at_ms INTEGER,\n  last_run_status TEXT,\n  last_error TEXT,\n  last_duration_ms INTEGER,\n  consecutive_errors INTEGER,\n  consecutive_skipped INTEGER,\n  schedule_error_count INTEGER,\n  last_delivery_status TEXT,\n  last_delivery_error TEXT,\n  last_delivered INTEGER,\n  last_failure_alert_at_ms INTEGER,\n  job_json TEXT NOT NULL,\n  state_json TEXT NOT NULL DEFAULT '{}',\n  runtime_updated_at_ms INTEGER,\n  schedule_identity TEXT,\n  sort_order INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS cron_store_epochs (\n  store_key TEXT PRIMARY KEY,\n  store_epoch INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_store_updated\n  ON cron_jobs(store_key, sort_order ASC, updated_at DESC, job_id);\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order\n  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled_next_run\n  ON cron_jobs(store_key, enabled, next_run_at_ms, job_id)\n  WHERE next_run_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_agent_session\n  ON cron_jobs(agent_id, session_key, updated_at DESC, job_id)\n  WHERE agent_id IS NOT NULL OR session_key IS NOT NULL;\n\n-- One owner-native receipt is also the durable execution fence. Receipts\n-- survive job deletion so operators can distinguish a run from log inference.\nCREATE TABLE IF NOT EXISTS cron_run_receipts (\n  receipt_id TEXT PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  config_revision TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  request_run_id TEXT,\n  status TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  started_at_ms INTEGER NOT NULL,\n  finished_at_ms INTEGER,\n  error_text TEXT,\n  CHECK (status IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded')),\n  CHECK (\n    (status = 'running' AND finished_at_ms IS NULL)\n    OR\n    (status != 'running' AND finished_at_ms IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_cron_run_receipts_active_job\n  ON cron_run_receipts(store_key, job_id)\n  WHERE status = 'running';\n\nCREATE INDEX IF NOT EXISTS idx_cron_run_receipts_job_history\n  ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);\n\n-- Runtime-private authority is independent of job_json so downgraded writers\n-- can rewrite recognized job config without erasing or silently widening it.\nCREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  authority_json TEXT,\n  authority_input_fingerprint TEXT,\n  recovery_required INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  FOREIGN KEY (store_key, job_id)\n    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,\n  CHECK (recovery_required IN (0, 1)),\n  CHECK (\n    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)\n    OR\n    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)\n  )\n) STRICT;\n\n-- Scratch is separate from cron_jobs so scheduler state writes and downgraded\n-- full-row replacement preserve it. New builds prune rows explicitly on job removal.\n-- content NULL is a tombstone: it keeps the revision lineage monotonic across\n-- unset/recreate so stale compare-and-swap writes cannot resurrect old content.\nCREATE TABLE IF NOT EXISTS cron_job_scratch (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  content TEXT,\n  revision INTEGER NOT NULL,\n  source_sha256 TEXT,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  CHECK (revision >= 1),\n  CHECK (content IS NULL OR length(CAST(content AS BLOB)) <= 262144)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_job_scratch_store_updated\n  ON cron_job_scratch(store_key, updated_at_ms DESC, job_id);\n\nCREATE TABLE IF NOT EXISTS command_log_entries (\n  id TEXT NOT NULL PRIMARY KEY,\n  timestamp_ms INTEGER NOT NULL,\n  action TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  sender_id TEXT NOT NULL,\n  source TEXT NOT NULL,\n  entry_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_command_log_entries_timestamp\n  ON command_log_entries(timestamp_ms DESC, id);\n\nCREATE INDEX IF NOT EXISTS idx_command_log_entries_session\n  ON command_log_entries(session_key, timestamp_ms DESC, id);\n\nCREATE TABLE IF NOT EXISTS delivery_queue_entries (\n  queue_name TEXT NOT NULL,\n  id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  entry_kind TEXT,\n  session_key TEXT,\n  channel TEXT,\n  target TEXT,\n  account_id TEXT,\n  retry_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  recovery_state TEXT,\n  platform_send_started_at INTEGER,\n  entry_json TEXT NOT NULL,\n  enqueued_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  failed_at INTEGER,\n  PRIMARY KEY (queue_name, id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_pending\n  ON delivery_queue_entries(queue_name, status, enqueued_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_failed\n  ON delivery_queue_entries(queue_name, status, failed_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_session\n  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_target\n  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)\n  WHERE channel IS NOT NULL AND target IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS task_runs (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  runtime TEXT NOT NULL,\n  task_kind TEXT,\n  source_id TEXT,\n  requester_session_key TEXT,\n  owner_key TEXT NOT NULL,\n  scope_kind TEXT NOT NULL,\n  child_session_key TEXT,\n  parent_flow_id TEXT,\n  parent_task_id TEXT,\n  agent_id TEXT,\n  requester_agent_id TEXT,\n  run_id TEXT,\n  label TEXT,\n  task TEXT NOT NULL,\n  status TEXT NOT NULL,\n  delivery_status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  started_at INTEGER,\n  ended_at INTEGER,\n  last_event_at INTEGER,\n  cleanup_after INTEGER,\n  tool_use_count INTEGER,\n  last_tool_name TEXT,\n  error TEXT,\n  progress_summary TEXT,\n  terminal_summary TEXT,\n  terminal_outcome TEXT,\n  detail_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);\nCREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);\nCREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended\n  ON task_runs(runtime, source_id, ended_at, created_at, task_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended\n  ON task_runs(runtime, ended_at, created_at, task_id);\n\nCREATE TABLE IF NOT EXISTS subagent_runs (\n  run_id TEXT NOT NULL PRIMARY KEY,\n  child_session_key TEXT NOT NULL,\n  controller_session_key TEXT,\n  requester_session_key TEXT NOT NULL,\n  requester_display_key TEXT NOT NULL,\n  requester_origin_json TEXT,\n  task TEXT NOT NULL,\n  task_name TEXT,\n  cleanup TEXT NOT NULL,\n  label TEXT,\n  model TEXT,\n  agent_dir TEXT,\n  workspace_dir TEXT,\n  run_timeout_seconds INTEGER,\n  spawn_mode TEXT,\n  created_at INTEGER NOT NULL,\n  started_at INTEGER,\n  session_started_at INTEGER,\n  accumulated_runtime_ms INTEGER,\n  ended_at INTEGER,\n  outcome_json TEXT,\n  archive_at_ms INTEGER,\n  cleanup_completed_at INTEGER,\n  cleanup_handled INTEGER,\n  suppress_announce_reason TEXT,\n  expects_completion_message INTEGER,\n  announce_retry_count INTEGER,\n  last_announce_retry_at INTEGER,\n  last_announce_delivery_error TEXT,\n  ended_reason TEXT,\n  pause_reason TEXT,\n  wake_on_descendant_settle INTEGER,\n  requester_settle_wake_status TEXT,\n  requester_settle_wake_attempt_count INTEGER,\n  requester_settle_wake_replay_count INTEGER,\n  requester_settle_wake_next_attempt_at INTEGER,\n  requester_settle_wake_batch_run_ids_json TEXT,\n  requester_settle_wake_last_error TEXT,\n  requester_settle_wake_retire_after INTEGER,\n  frozen_result_text TEXT,\n  frozen_result_captured_at INTEGER,\n  fallback_frozen_result_text TEXT,\n  fallback_frozen_result_captured_at INTEGER,\n  ended_hook_emitted_at INTEGER,\n  pending_final_delivery INTEGER,\n  pending_final_delivery_created_at INTEGER,\n  pending_final_delivery_last_attempt_at INTEGER,\n  pending_final_delivery_attempt_count INTEGER,\n  pending_final_delivery_last_error TEXT,\n  pending_final_delivery_payload_json TEXT,\n  completion_announced_at INTEGER,\n  swarm_group_id TEXT,\n  swarm_collector INTEGER,\n  swarm_output_schema_json TEXT,\n  swarm_completion_status TEXT,\n  swarm_structured_json TEXT,\n  swarm_schema_error TEXT,\n  swarm_usage_json TEXT,\n  payload_json TEXT NOT NULL DEFAULT '{}'\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key\n  ON subagent_runs(child_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key\n  ON subagent_runs(requester_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key\n  ON subagent_runs(controller_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_archive_at\n  ON subagent_runs(archive_at_ms, cleanup_handled, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_ended_cleanup\n  ON subagent_runs(ended_at, cleanup_handled, run_id);\n\nCREATE TABLE IF NOT EXISTS current_conversation_bindings (\n  binding_key TEXT NOT NULL PRIMARY KEY,\n  binding_id TEXT NOT NULL,\n  target_agent_id TEXT NOT NULL,\n  target_session_id TEXT,\n  target_session_key TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  conversation_kind TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  conversation_id TEXT NOT NULL,\n  target_kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  bound_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  metadata_json TEXT,\n  record_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target\n  ON current_conversation_bindings(target_agent_id, target_session_key, updated_at DESC, binding_key);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation\n  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires\n  ON current_conversation_bindings(expires_at, binding_key);\n\nCREATE TABLE IF NOT EXISTS plugin_binding_approvals (\n  plugin_root TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  plugin_id TEXT NOT NULL,\n  plugin_name TEXT,\n  approved_at INTEGER NOT NULL,\n  PRIMARY KEY (plugin_root, channel, account_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin\n  ON plugin_binding_approvals(plugin_id, approved_at DESC);\n\nCREATE TABLE IF NOT EXISTS tui_last_sessions (\n  scope_key TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_tui_last_sessions_session_key\n  ON tui_last_sessions(session_key, updated_at DESC, scope_key);\n\nCREATE TABLE IF NOT EXISTS task_delivery_state (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  requester_origin_json TEXT,\n  last_notified_event_at INTEGER,\n  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS flow_runs (\n  flow_id TEXT NOT NULL PRIMARY KEY,\n  shape TEXT,\n  sync_mode TEXT NOT NULL DEFAULT 'managed',\n  owner_key TEXT NOT NULL,\n  requester_origin_json TEXT,\n  controller_id TEXT,\n  revision INTEGER NOT NULL DEFAULT 0,\n  status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  goal TEXT NOT NULL,\n  current_step TEXT,\n  blocked_task_id TEXT,\n  blocked_summary TEXT,\n  state_json TEXT,\n  wait_json TEXT,\n  cancel_requested_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  ended_at INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);\n\n-- Durable meeting-capture sessions are gateway-global rather than agent-session\n-- transcripts. JSON/JSONL files are doctor import inputs or explicit CLI exports.\nCREATE TABLE IF NOT EXISTS meeting_transcript_sessions (\n  session_id TEXT NOT NULL,\n  started_at TEXT NOT NULL,\n  selector TEXT NOT NULL UNIQUE,\n  export_key TEXT NOT NULL,\n  session_slug TEXT NOT NULL,\n  provider_id TEXT NOT NULL,\n  title TEXT,\n  source_json TEXT NOT NULL,\n  stopped_at TEXT,\n  metadata_json TEXT,\n  export_manifest_json TEXT NOT NULL DEFAULT '{}',\n  export_pending_json TEXT NOT NULL DEFAULT '[]',\n  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, started_at)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started\n  ON meeting_transcript_sessions(started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id\n  ON meeting_transcript_sessions(session_id, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug\n  ON meeting_transcript_sessions(session_slug, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key\n  ON meeting_transcript_sessions(export_key);\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_utterances (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  sequence INTEGER NOT NULL CHECK (sequence >= 0),\n  utterance_id TEXT,\n  started_at TEXT,\n  ended_at TEXT,\n  speaker_id TEXT,\n  speaker_label TEXT,\n  text TEXT NOT NULL,\n  final INTEGER CHECK (final IN (0, 1)),\n  metadata_json TEXT,\n  PRIMARY KEY (session_id, session_started_at, sequence),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_summaries (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  generated_at TEXT,\n  summary_json TEXT,\n  markdown TEXT,\n  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),\n  PRIMARY KEY (session_id, session_started_at),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE,\n  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS migration_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  finished_at INTEGER,\n  status TEXT NOT NULL,\n  report_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_runs_started\n  ON migration_runs(started_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS migration_sources (\n  source_key TEXT NOT NULL PRIMARY KEY,\n  migration_kind TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  target_table TEXT NOT NULL,\n  source_sha256 TEXT,\n  source_size_bytes INTEGER,\n  source_record_count INTEGER,\n  last_run_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  imported_at INTEGER NOT NULL,\n  removed_source INTEGER NOT NULL DEFAULT 0,\n  report_json TEXT NOT NULL,\n  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_path\n  ON migration_sources(source_path, migration_kind, target_table);\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_run\n  ON migration_sources(last_run_id, source_path);\n\nCREATE TABLE IF NOT EXISTS backup_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  created_at INTEGER NOT NULL,\n  archive_path TEXT NOT NULL,\n  status TEXT NOT NULL,\n  manifest_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_backup_runs_created\n  ON backup_runs(created_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS worktrees (\n  id TEXT NOT NULL PRIMARY KEY,\n  repo_fingerprint TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  branch TEXT NOT NULL,\n  base_ref TEXT NOT NULL,\n  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),\n  owner_id TEXT,\n  snapshot_ref TEXT,\n  provisioned_paths_json TEXT,\n  created_at INTEGER NOT NULL,\n  last_active_at INTEGER NOT NULL,\n  removed_at INTEGER,\n  run_end_cleanup_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint\n  ON worktrees(repo_fingerprint);\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_removed_at\n  ON worktrees(removed_at);\n\nCREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (\n  worktree_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),\n  data BLOB NOT NULL,\n  PRIMARY KEY (worktree_id, path, chunk_index)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS projects (\n  id TEXT NOT NULL PRIMARY KEY,\n  display_name TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  origin_url TEXT,\n  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),\n  created_at_ms INT NOT NULL,\n  updated_at_ms INT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_preferences (\n  profile_id TEXT NOT NULL,\n  pref_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  updated_at_ms INT NOT NULL,\n  PRIMARY KEY (profile_id, pref_key)\n) STRICT;\n\n-- Gateway-owned custom session group catalog (names + display order).\n-- Membership stays on each session entry's category field; this table only\n-- owns which groups exist and how operator UIs order them.\nCREATE TABLE IF NOT EXISTS session_groups (\n  name TEXT NOT NULL PRIMARY KEY,\n  position INTEGER NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\n-- Gateway-owned sidebar section layout. IDs are ungrouped, groups, work, or\n-- category:<name>; pinned sessions are ordered separately and never stored.\nCREATE TABLE IF NOT EXISTS sidebar_sections (\n  section_id TEXT NOT NULL PRIMARY KEY,\n  position INTEGER NOT NULL\n) STRICT;\n\n-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution\n-- stays in plugins; this table records only core reconciliation facts.\nCREATE TABLE IF NOT EXISTS worker_environments (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  provider_id TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  profile_snapshot_json TEXT NOT NULL,\n  provision_operation_id TEXT NOT NULL UNIQUE,\n  lease_id TEXT,\n  ssh_host TEXT,\n  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),\n  ssh_user TEXT,\n  ssh_host_key TEXT,\n  ssh_key_ref_json TEXT,\n  desktop_json TEXT,\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'requested',\n      'provisioning',\n      'bootstrapping',\n      'ready',\n      'attached',\n      'idle',\n      'draining',\n      'destroying',\n      'destroyed',\n      'failed',\n      'orphaned'\n    )\n  ),\n  bootstrap_bundle_hash TEXT,\n  bootstrap_openclaw_version TEXT,\n  bootstrap_protocol_features_json TEXT,\n  bootstrap_install_kind TEXT,\n  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),\n  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),\n  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  idle_since_at_ms INTEGER,\n  destroy_requested_at_ms INTEGER,\n  last_error TEXT,\n  shared_host INTEGER\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease\n  ON worker_environments(provider_id, lease_id)\n  WHERE lease_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_worker_environments_terminal_changed\n  ON worker_environments(state_changed_at_ms, environment_id);\n\n-- Provider-advertised fallback ports preserve stable retry order separately\n-- from the downgrade-sensitive canonical worker environment row.\nCREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (\n  environment_id TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),\n  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),\n  PRIMARY KEY (environment_id, position),\n  UNIQUE (environment_id, port),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- Session placement lives in the shared state database so local admission,\n-- worker admission, and environment attachment use one durable authority.\nCREATE TABLE IF NOT EXISTS worker_session_placements (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  execution_mode TEXT CHECK (execution_mode IN ('worker-turn', 'remote-exec')),\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'local',\n      'requested',\n      'provisioning',\n      'syncing',\n      'starting',\n      'active',\n      'draining',\n      'reconciling',\n      'reclaimed',\n      'failed'\n    )\n  ),\n  environment_id TEXT,\n  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),\n  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),\n  workspace_base_manifest_ref TEXT,\n  remote_workspace_dir TEXT,\n  worker_bundle_hash TEXT,\n  last_transcript_ack_cursor INTEGER CHECK (\n    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0\n  ),\n  last_live_event_ack_cursor INTEGER CHECK (\n    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0\n  ),\n  recovery_error TEXT,\n  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),\n  turn_claim_id TEXT,\n  turn_claim_run_id TEXT,\n  turn_claim_generation INTEGER CHECK (\n    turn_claim_generation IS NULL OR turn_claim_generation >= 0\n  ),\n  turn_claim_owner_epoch INTEGER CHECK (\n    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1\n  ),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  terminal_reason TEXT,\n  terminal_at_ms INTEGER,\n  CHECK (\n    (state IN ('local', 'requested')\n      AND environment_id IS NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'provisioning'\n      AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'syncing'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'starting'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IN ('active', 'draining', 'reconciling')\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)\n    OR\n    (state IS 'reclaimed'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL\n      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (state IS 'failed' AND recovery_error IS NOT NULL)\n  ),\n  CHECK (\n    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NOT NULL)\n  ),\n  CHECK (\n    turn_claim_owner IS NULL\n    OR\n    (turn_claim_owner IS 'local' AND (\n      state IN ('local', 'requested', 'failed')\n      OR (state IN ('active', 'draining') AND execution_mode IS 'remote-exec')\n    ))\n    OR\n    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')\n      AND (execution_mode IS NULL OR execution_mode IS 'worker-turn')\n      AND turn_claim_owner_epoch IS active_owner_epoch)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key\n  ON worker_session_placements(agent_id, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile\n  ON worker_session_placements(updated_at_ms, session_id);\n\n-- Worker-visible session RPC authority is persisted against the exact turn\n-- claim. The launch descriptor is informative only; Gateway dispatch always\n-- revalidates this record and the live placement claim before executing.\nCREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  tool_names_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Tool-call ids are idempotency keys only within one exact source turn claim.\n-- A running operation from another Gateway instance is ambiguous and is never\n-- replayed. A persisted random seed separates durable downstream identities\n-- from Gateway authentication keys and survives ordinary process restarts.\nCREATE TABLE IF NOT EXISTS worker_session_tool_operations (\n  source_session_id TEXT NOT NULL,\n  source_claim_id TEXT NOT NULL,\n  tool_call_id TEXT NOT NULL,\n  tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),\n  request_digest TEXT NOT NULL,\n  operation_seed TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),\n  child_session_key TEXT,\n  result_json TEXT,\n  gateway_instance_id TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),\n  FOREIGN KEY (source_session_id)\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- A reconciliation journal is written before managed-worktree mutation. The\n-- bounded Git base snapshot repairs any subset left by an interrupted apply.\nCREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  base_manifest_ref TEXT NOT NULL,\n  current_manifest_ref TEXT NOT NULL,\n  plan_json TEXT NOT NULL,\n  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- A completed remote turn is fenced from stale-claim teardown until its\n-- workspace result is durably reconciled into the managed worktree.\nCREATE TABLE IF NOT EXISTS worker_workspace_pending_results (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  gateway_instance_id TEXT NOT NULL,\n  recovery_requested_at_ms INTEGER,\n  workspace_accepted_at_ms INTEGER,\n  staged_result_ref TEXT,\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- One active, opaque admission credential per worker environment. Plaintext\n-- may be retried until delivery acknowledgement but never enters durable state.\nCREATE TABLE IF NOT EXISTS worker_environment_credentials (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  credential_hash TEXT NOT NULL UNIQUE,\n  bundle_hash TEXT NOT NULL,\n  session_id TEXT,\n  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),\n  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),\n  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- One durable sequence cursor per attached session owner epoch. The environment\n-- binding prevents independent workers with coincident epochs from sharing replay state.\nCREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  environment_id TEXT NOT NULL,\n  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch)\n) STRICT;\n\n-- Pending rows preserve a claimed request across gateway restarts. Terminal rows\n-- cache the exact result returned for deterministic at-least-once replay.\nCREATE TABLE IF NOT EXISTS worker_transcript_commits (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  seq INTEGER NOT NULL CHECK (seq >= 1),\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  result_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, seq),\n  FOREIGN KEY (session_id, run_epoch)\n    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)\n    ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND result_json IS NULL) OR\n    (state = 'terminal' AND result_json IS NOT NULL)\n  )\n) STRICT;\n\n-- Pending rows preserve a claimed inference turn across gateway restarts.\n-- Terminal rows cache the exact outcome returned for deterministic replay.\nCREATE TABLE IF NOT EXISTS worker_inference_turns (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  run_id TEXT NOT NULL,\n  turn_id TEXT NOT NULL,\n  environment_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  terminal_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND terminal_json IS NULL) OR\n    (state = 'terminal' AND terminal_json IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run\n  ON worker_inference_turns(session_id, run_epoch, run_id)\n  WHERE state = 'pending';\n\nCREATE TABLE IF NOT EXISTS fleet_cells (\n  tenant_id TEXT NOT NULL PRIMARY KEY,\n  created_at_ms INTEGER NOT NULL,\n  image TEXT NOT NULL,\n  runtime TEXT NOT NULL,\n  host_port INTEGER NOT NULL,\n  container_name TEXT NOT NULL,\n  data_dir TEXT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_installs (\n  agent_id TEXT NOT NULL PRIMARY KEY,\n  schema_version TEXT NOT NULL,\n  source_kind TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  claw_version TEXT NOT NULL,\n  package_root TEXT NOT NULL,\n  manifest_path TEXT NOT NULL,\n  integrity_kind TEXT NOT NULL,\n  integrity TEXT NOT NULL,\n  source_byte_length INTEGER NOT NULL,\n  manifest_schema_version INTEGER NOT NULL,\n  plan_integrity TEXT NOT NULL,\n  workspace TEXT NOT NULL UNIQUE,\n  agent_config_digest TEXT NOT NULL,\n  agent_owned_paths_json TEXT NOT NULL,\n  bootstrap_source_path TEXT,\n  bootstrap_content_digest TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial')\n  ),\n  added_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_workspace_files (\n  agent_id TEXT NOT NULL,\n  target_path TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  workspace TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  content_digest TEXT NOT NULL,\n  status TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, target_path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_package_refs (\n  agent_id TEXT NOT NULL,\n  package_kind TEXT NOT NULL,\n  package_source TEXT NOT NULL,\n  package_ref TEXT NOT NULL,\n  package_version TEXT NOT NULL,\n  package_integrity TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  package_status TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL CHECK (independent_owner IN (0, 1)),\n  extension_id TEXT,\n  extension_format TEXT,\n  extension_detected_format TEXT,\n  extension_mapped_json TEXT,\n  extension_unavailable_json TEXT,\n  extension_adapter_identity TEXT,\n  installed_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, package_kind, package_source, package_ref, package_version)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_cron_refs (\n  agent_id TEXT NOT NULL,\n  manifest_id TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  declaration_key TEXT NOT NULL UNIQUE,\n  scheduler_job_id TEXT UNIQUE,\n  status TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, manifest_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_mcp_server_refs (\n  agent_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  config_digest TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL DEFAULT 0 CHECK (independent_owner IN (0, 1)),\n  status TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, name)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS outbound_media_provenance (\n  realpath TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS model_catalog_remote (\n  id INTEGER PRIMARY KEY CHECK (id = 1),\n  bundle_json TEXT NOT NULL,\n  generated_at INTEGER NOT NULL,\n  min_version TEXT,\n  source_url TEXT NOT NULL,\n  etag TEXT,\n  last_modified TEXT,\n  checked_at INTEGER NOT NULL\n) STRICT;\n\n-- scope_id is non-null because SQLite treats NULLs as distinct in unique indexes/PKs,\n-- which would allow duplicate team rows. This PK also avoids a rebuild for identity scope.\nCREATE TABLE IF NOT EXISTS secret_store_entries (\n  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('team', 'identity')),\n  scope_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  value TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('secret', 'env')),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  updated_by TEXT,\n  deleted_at_ms INTEGER,\n  allowed_hosts TEXT,\n  CHECK ((scope_kind = 'team' AND scope_id = '') OR (scope_kind = 'identity' AND length(scope_id) > 0)),\n  PRIMARY KEY (scope_kind, scope_id, name)\n) STRICT;\nCREATE INDEX IF NOT EXISTS secret_store_entries_live_idx\n  ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;\n";
//#endregion
//#region src/state/openclaw-state-schema-compatibility.ts
const CLAW_LAZY_ADDITIVE_STATE_COLUMNS = CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS = CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET = new Set(CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`));
const CLAW_STARTUP_ADDITIVE_STATE_TABLES = ["worker_session_tool_operations", "worker_turn_tool_authorities"];
const CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET = new Set(CLAW_STARTUP_ADDITIVE_STATE_TABLES);
const CLAW_READONLY_OPTIONAL_STATE_INDEXES = ["idx_operator_approvals_source_run_resolved"];
let openClawStateCanonicalNamedIndexSet;
function getOpenClawStateCanonicalNamedIndexSet() {
	openClawStateCanonicalNamedIndexSet ??= new Set(getCanonicalSqliteNamedIndexContracts(OPENCLAW_STATE_SCHEMA_SQL).map((index) => index.name));
	return openClawStateCanonicalNamedIndexSet;
}
/** Project canonical SQL to the tables the shared runtime may create during this open. */
function getOpenClawStateRuntimeSchema(options) {
	let schema = OPENCLAW_STATE_SCHEMA_SQL;
	const omittedTables = options.includeVersionLazyAdditiveTables ? FIRST_USE_STATE_TABLES : LAZY_ADDITIVE_STATE_TABLES;
	const omittedIndexes = options.includeVersionLazyAdditiveTables ? FIRST_USE_STATE_INDEXES : LAZY_ADDITIVE_STATE_INDEXES;
	for (const tableName of omittedTables) {
		const start = schema.indexOf(`CREATE TABLE IF NOT EXISTS ${tableName} (`);
		const end = start >= 0 ? schema.indexOf("\n) STRICT;", start) : -1;
		if (start < 0 || end < 0) throw new Error(`lazy additive state schema block is missing for ${tableName}`);
		schema = `${schema.slice(0, start)}${schema.slice(end + 10)}`;
	}
	for (const indexName of omittedIndexes) {
		const plainStart = schema.indexOf(`CREATE INDEX IF NOT EXISTS ${indexName}`);
		const uniqueStart = schema.indexOf(`CREATE UNIQUE INDEX IF NOT EXISTS ${indexName}`);
		const start = plainStart >= 0 ? plainStart : uniqueStart;
		const end = start >= 0 ? schema.indexOf(";", start) : -1;
		if (start < 0 || end < 0) throw new Error(`lazy additive state schema index is missing for ${indexName}`);
		schema = `${schema.slice(0, start)}${schema.slice(end + 1)}`;
	}
	return schema;
}
const STATE_PERSISTENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingColumns: CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS,
	allowedColumnDefinitions: {
		"diagnostic_events.sequence": ["sequence INTEGER NOT NULL DEFAULT 0"],
		"claw_package_refs.package_integrity": ["package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'"],
		"claw_package_refs.updated_at_ms": ["updated_at_ms INTEGER NOT NULL DEFAULT 0"],
		"cron_jobs.created_at_ms": ["created_at_ms INTEGER NOT NULL DEFAULT 0"],
		"cron_jobs.enabled": ["enabled INTEGER NOT NULL DEFAULT 1"],
		"cron_jobs.name": ["name TEXT NOT NULL DEFAULT ''"],
		"cron_jobs.payload_kind": ["payload_kind TEXT NOT NULL DEFAULT 'message'"],
		"cron_jobs.schedule_kind": ["schedule_kind TEXT NOT NULL DEFAULT 'manual'"],
		"cron_jobs.session_target": ["session_target TEXT NOT NULL DEFAULT 'main'"],
		"cron_jobs.wake_mode": ["wake_mode TEXT NOT NULL DEFAULT 'auto'"],
		"current_conversation_bindings.conversation_kind": ["conversation_kind TEXT NOT NULL DEFAULT 'channel'"],
		"current_conversation_bindings.target_agent_id": ["target_agent_id TEXT NOT NULL DEFAULT 'main'"],
		"operator_approvals.resolution_ref": ["resolution_ref TEXT"],
		"worker_environments.desktop_json": ["desktop_json TEXT"],
		"worker_environments.bootstrap_install_kind": ["bootstrap_install_kind TEXT"],
		"worker_environments.shared_host": ["shared_host INTEGER CHECK (shared_host IN (0, 1))"],
		"worker_session_placements.terminal_reason": ["terminal_reason TEXT"],
		"worker_session_placements.terminal_at_ms": ["terminal_at_ms INTEGER"]
	}
};
const OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY = {
	...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,
	allowedMissingTables: [...LAZY_ADDITIVE_STATE_TABLES, ...CLAW_STARTUP_ADDITIVE_STATE_TABLES],
	allowedMissingIndexes: CLAW_READONLY_OPTIONAL_STATE_INDEXES,
	allowedMissingColumns: CLAW_LAZY_ADDITIVE_STATE_COLUMNS
};
/** Identify schema differences that the writable shared-state cold open repairs. */
function isOpenClawStateStartupRepairableSchemaIssue(issue) {
	if (issue.code === "missing-table") return CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET.has(issue.objectName);
	if (issue.code === "missing-column") return CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET.has(issue.objectName);
	return issue.code === "missing-or-drifted-index" && getOpenClawStateCanonicalNamedIndexSet().has(issue.objectName);
}
//#endregion
//#region src/state/openclaw-state-db-maintenance.ts
const STATE_V6_ADDITIVE_TABLES = [
	...LAZY_ADDITIVE_STATE_TABLES,
	"worker_session_tool_operations",
	"worker_turn_tool_authorities"
];
const STATE_MIGRATION_ALLOWED_MISSING_TABLES = {
	5: [
		"agent_database_leases",
		"agent_deletion_journal",
		"claw_cron_refs",
		"claw_installs",
		"claw_mcp_server_refs",
		"claw_package_refs",
		"claw_workspace_files",
		"config_machine_state",
		"cron_job_scratch",
		"meeting_transcript_sessions",
		"meeting_transcript_summaries",
		"meeting_transcript_utterances",
		"outbound_media_provenance",
		"worker_environment_credentials",
		"worker_transcript_commit_heads",
		"worker_transcript_commits",
		...STATE_V6_ADDITIVE_TABLES
	],
	6: STATE_V6_ADDITIVE_TABLES,
	7: STATE_V6_ADDITIVE_TABLES
};
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
function createOpenClawDatabaseVerificationError(kind, pathname, storedError) {
	const error = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	error.name = "SqliteIntegrityError";
	return error;
}
function assertSupportedSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > 8) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, userVersion, 8);
}
/** Require canonical shared-state ownership without requiring the latest schema. */
function assertOpenClawStateDatabaseOwner(database, options) {
	const metadata = database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_meta' LIMIT 1").get() ? database.prepare("SELECT role FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get() : void 0;
	if (metadata?.role !== "global") {
		const role = typeof metadata?.role === "string" ? metadata.role : "missing";
		throw new Error(`OpenClaw state database ${options.pathname} has schema role ${role}; expected global.`);
	}
}
/** Require the canonical shared-state owner and schema before offline file maintenance. */
function assertOpenClawStateDatabaseForMaintenance(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (userVersion > 8) throw createNewerSqliteSchemaVersionError("OpenClaw state database", options.pathname, userVersion, 8);
	if (userVersion !== 8) throw new Error(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	assertOpenClawStateDatabaseOwner(database, options);
	const metadata = database.prepare("SELECT schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
	if (metadata?.schema_version !== 8) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new Error(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match 8; run openclaw doctor --fix before compacting it.`);
	}
	assertSqliteSchemaContains(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY);
}
function assertOpenClawStateDatabaseVersionForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (userVersion !== options.version) throw new Error(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; expected ${options.version} before migrating it.`);
	assertOpenClawStateDatabaseOwner(database, options);
	const metadata = database.prepare("SELECT schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
	if (metadata?.schema_version !== options.version) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new Error(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${options.version}; repair the ownership metadata before migrating it.`);
	}
	assertSqliteSchemaTablesPresent(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: STATE_MIGRATION_ALLOWED_MISSING_TABLES[options.version] });
}
/** Require every stable v5 table before the v6 additive migration can run. */
function assertOpenClawStateDatabaseV5ForMigration(database, options) {
	assertOpenClawStateDatabaseVersionForMigration(database, {
		...options,
		version: 5
	});
}
/** Require every stable v6 table before the v7 retirement migration can run. */
function assertOpenClawStateDatabaseV6ForMigration(database, options) {
	assertOpenClawStateDatabaseVersionForMigration(database, {
		...options,
		version: 6
	});
}
/** Require every stable v7 table before the v8 placement migration can run. */
function assertOpenClawStateDatabaseV7ForMigration(database, options) {
	assertOpenClawStateDatabaseVersionForMigration(database, {
		...options,
		version: 7
	});
}
function resolveDatabasePath(options = {}) {
	return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
//#endregion
//#region src/state/openclaw-state-db-cache.ts
const cachedDatabases = /* @__PURE__ */ new Map();
const databaseLifecycleListeners = /* @__PURE__ */ new Set();
function notifyOpenClawStateDatabaseLifecycle(event) {
	for (const listener of databaseLifecycleListeners) listener(event);
}
function registerOpenClawStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database
	});
	return () => databaseLifecycleListeners.delete(listener);
}
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeOpenClawStateDatabaseHandle(database) {
	let caught = false;
	const errors = [];
	try {
		database.walMaintenance.close();
	} catch (error) {
		caught = true;
		errors.push(error);
	}
	clearNodeSqliteKyselyCacheForDatabase(database.db);
	try {
		if (database.db.isOpen) database.db.close();
	} catch (error) {
		caught = true;
		errors.push(error);
	}
	return {
		caught,
		errors
	};
}
function evictCachedOpenClawStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return false;
	cachedDatabases.delete(database.path);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "closed",
		path: database.path
	});
	closeOpenClawStateDatabaseHandle(database);
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictOpenClawStateDatabaseAfterCorruption$1(database, error) {
	return isSqliteCorruptionError(error) && evictCachedOpenClawStateDatabase(database);
}
const terminalOpenLatch = createSqliteTerminalOpenLatch({ closeByPath: (pathname) => {
	const cached = cachedDatabases.get(pathname);
	if (cached) evictCachedOpenClawStateDatabase(cached);
} });
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishOpenClawStateDatabase(database) {
	const { db, path: pathname } = database;
	cachedDatabases.set(pathname, database);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "opened",
		database
	});
	registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedOpenClawStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedOpenClawStateDatabase(pathname) {
	return cachedDatabases.get(path.resolve(pathname));
}
function getOpenClawStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedOpenClawStateDatabase(pathname);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedOpenClawStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	database.walMaintenance.close();
	clearNodeSqliteKyselyCacheForDatabase(database.db);
	cachedDatabases.delete(database.path);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "closed",
		path: database.path
	});
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawStateDatabaseOpenFailure$1(pathname, error, generation) {
	return terminalOpenLatch.record(pathname, error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearOpenClawStateDatabaseOpenFailure$1(pathname) {
	terminalOpenLatch.clear(pathname);
}
/** Reject shared-state access after a process-local terminal failure. */
function assertOpenClawStateDatabaseOpenAllowed(pathname) {
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
}
function recordOpenClawStateDatabaseLifecycleOpenError(pathname, error) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "open-error",
		path: path.resolve(pathname),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env) {
	assertOpenClawStateDatabaseOpenAllowed(pathname);
	let quarantineFailure;
	try {
		const quarantine = readOpenClawDatabaseQuarantine(pathname, { env });
		if (quarantine) quarantineFailure = createOpenClawDatabaseVerificationError("state", pathname, quarantine.reason);
	} catch {}
	if (quarantineFailure) throw quarantineFailure;
}
/** Close one cached shared state database handle by exact pathname. */
function closeOpenClawStateDatabaseByPath$1(pathname) {
	const resolvedPath = path.resolve(pathname);
	const database = cachedDatabases.get(resolvedPath);
	if (!database) return false;
	database.walMaintenance.close();
	if (database.db.isOpen) database.db.close();
	cachedDatabases.delete(resolvedPath);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "closed",
		path: resolvedPath
	});
	return true;
}
/** Close all cached shared state database handles. */
function closeOpenClawStateDatabase$1() {
	for (const database of cachedDatabases.values()) {
		database.walMaintenance.close();
		if (database.db.isOpen) database.db.close();
		notifyOpenClawStateDatabaseLifecycle({
			kind: "closed",
			path: database.path
		});
	}
	cachedDatabases.clear();
}
/** Test whether any cached shared state database handle is still open. */
function isOpenClawStateDatabaseOpen$1() {
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/** Close shared state handles and clear terminal failure latches for test isolation. */
function closeOpenClawStateDatabaseForTest$1() {
	closeOpenClawStateDatabase$1();
	terminalOpenLatch.clearAll();
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const openClawStateDatabaseCache = {
	assertOpenClawStateDatabaseFreshOpenAllowedAtPath,
	assertOpenClawStateDatabaseOpenAllowed,
	clearOpenClawStateDatabaseOpenFailure: clearOpenClawStateDatabaseOpenFailure$1,
	closeOpenClawStateDatabase: closeOpenClawStateDatabase$1,
	closeOpenClawStateDatabaseByPath: closeOpenClawStateDatabaseByPath$1,
	closeOpenClawStateDatabaseForTest: closeOpenClawStateDatabaseForTest$1,
	closeOpenClawStateDatabaseHandle,
	closeStaleCachedOpenClawStateDatabase,
	evictCachedOpenClawStateDatabase,
	evictOpenClawStateDatabaseAfterCorruption: evictOpenClawStateDatabaseAfterCorruption$1,
	getCachedOpenClawStateDatabase,
	getOpenClawStateDatabaseIfOpenAtPath,
	isOpenClawStateDatabaseOpen: isOpenClawStateDatabaseOpen$1,
	publishOpenClawStateDatabase,
	recordOpenClawStateDatabaseOpenFailure: recordOpenClawStateDatabaseOpenFailure$1,
	recordOpenClawStateDatabaseLifecycleOpenError
};
//#endregion
//#region src/state/openclaw-state-db-operator-approval-migration.ts
const COLUMNS = [
	"approval_id",
	"resolution_ref",
	"kind",
	"status",
	"presentation_json",
	"requested_by_device_id",
	"requested_by_client_id",
	"requested_by_device_token_auth",
	"reviewer_device_ids_json",
	"source_agent_id",
	"source_session_key",
	"source_session_id",
	"source_run_id",
	"source_tool_call_id",
	"source_tool_name",
	"audience_session_keys_json",
	"runtime_epoch",
	"created_at_ms",
	"expires_at_ms",
	"updated_at_ms",
	"decision",
	"terminal_reason",
	"resolved_at_ms",
	"resolver_kind",
	"resolver_id",
	"consumed_at_ms",
	"consumed_by"
];
function tableSql(db) {
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'").get();
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function hasCanonicalOperatorApprovalKinds(db) {
	if (!tableExists(db, "operator_approvals")) return true;
	return /kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql(db)?.toLowerCase() ?? "");
}
function assertCanonicalOperatorApprovalKinds(db, pathname) {
	if (!hasCanonicalOperatorApprovalKinds(db)) throw new Error(`OpenClaw state database ${pathname} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`);
}
function isCanonicalOperatorApprovalKind(value) {
	return value === "exec" || value === "plugin" || value === "system-agent";
}
function detectOperatorApprovalSchemaMigration(db, path) {
	return hasCanonicalOperatorApprovalKinds(db) ? [] : [{
		kind: "operator-approvals-system-agent",
		path
	}];
}
function normalizeDdl(sql) {
	return sql.replace(/\s+/g, " ").trim().replace(/;$/, "");
}
function canonicalOperatorApprovalCreateSql() {
	const marker = "CREATE TABLE IF NOT EXISTS operator_approvals (";
	const tableTerminator = "\n) STRICT;";
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(marker);
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf(`${tableTerminator}\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry`, start);
	if (start < 0 || end < 0) throw new Error("canonical operator approval schema is unavailable");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10);
}
function alterAppendedResolutionRefCreateSql(sql) {
	const resolutionRefStart = sql.indexOf("\n  resolution_ref ");
	const followingColumnStart = sql.indexOf("\n  kind ", resolutionRefStart);
	const tailColumn = "\n  consumed_by TEXT,";
	const tailColumnStart = sql.indexOf(tailColumn, followingColumnStart);
	if (resolutionRefStart < 0 || followingColumnStart < 0 || tailColumnStart < 0) throw new Error("canonical operator approval resolution reference schema is unavailable");
	return (sql.slice(0, resolutionRefStart) + sql.slice(followingColumnStart)).replace(tailColumn, `${tailColumn} resolution_ref TEXT,`);
}
function hasExactLegacyOperatorApprovalSchema(db) {
	const live = tableSql(db);
	if (!live) return false;
	const exactStrictLegacy = canonicalOperatorApprovalCreateSql().replace("CREATE TABLE IF NOT EXISTS operator_approvals (", "CREATE TABLE operator_approvals (").replace(/'exec',\s*'plugin',\s*'system-agent'/, "'exec', 'plugin'");
	const normalizedLive = normalizeDdl(live);
	return [exactStrictLegacy, alterAppendedResolutionRefCreateSql(exactStrictLegacy)].some((strictLegacy) => [strictLegacy, strictLegacy.replace(/\) STRICT;$/u, ");")].map(normalizeDdl).includes(normalizedLive));
}
function canonicalCreateSql() {
	return canonicalOperatorApprovalCreateSql().replace("CREATE TABLE IF NOT EXISTS operator_approvals (", "CREATE TABLE operator_approvals_migration_new (");
}
function operatorApprovalIndexSql() {
	const statements = OPENCLAW_STATE_SCHEMA_SQL.split(";").map((statement) => statement.trim()).filter((statement) => /^CREATE (?:UNIQUE )?INDEX IF NOT EXISTS idx_operator_approvals_/.test(statement));
	if (statements.length === 0) throw new Error("canonical operator approval index schema is unavailable");
	return `${statements.join(";\n")};`;
}
function repairOperatorApprovalKinds(db) {
	if (hasCanonicalOperatorApprovalKinds(db) || tableExists(db, "operator_approvals_migration_new") || !hasExactLegacyOperatorApprovalSchema(db)) return false;
	const columns = COLUMNS.join(", ");
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(canonicalCreateSql());
		db.exec(`
      INSERT INTO operator_approvals_migration_new (${columns})
      SELECT ${columns} FROM operator_approvals
      WHERE typeof(resolution_ref) = 'text'
        AND length(resolution_ref) = 43
        AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*';
      DROP TABLE operator_approvals;
      ALTER TABLE operator_approvals_migration_new RENAME TO operator_approvals;
    `);
		db.exec(operatorApprovalIndexSql());
	});
	return true;
}
function repairOperatorApprovalSchema(db) {
	return repairOperatorApprovalKinds(db) ? ["Migrated shared state operator approvals → OpenClaw system changes"] : [];
}
//#endregion
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const SQLITE_WAL_HEADER_BYTES = 32;
const SQLITE_SIDECAR_HASH_BUFFER_BYTES = 1024 * 1024;
const sqliteFilesLog = createSubsystemLogger("state/sqlite");
var SqliteOrphanedSidecarsError = class extends Error {
	constructor(pathname, sidecarPaths, cause) {
		super(`SQLite database is missing at ${pathname}, and orphaned sidecars could not be copied: ${sidecarPaths.join(", ")}. Refusing to open because SQLite could delete orphan WAL or journal state. Preserve the sidecar bytes, restore the main database, and pair it with the matching sidecar before retrying.`, { cause });
		this.name = "SqliteOrphanedSidecarsError";
	}
};
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
	return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
function sha256FileSync(pathname) {
	const descriptor = fs.openSync(pathname, "r");
	const digest = createHash("sha256");
	const buffer = Buffer.allocUnsafe(SQLITE_SIDECAR_HASH_BUFFER_BYTES);
	try {
		while (true) {
			const bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, null);
			if (bytesRead === 0) return digest.digest("hex");
			digest.update(buffer.subarray(0, bytesRead));
		}
	} finally {
		fs.closeSync(descriptor);
	}
}
function findMatchingOrphanedSidecarCopy(sourcePath, sourceSize) {
	const directory = path.dirname(sourcePath);
	const prefix = `${path.basename(sourcePath)}.orphaned-`;
	const candidates = fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(prefix)).map((entry) => path.join(directory, entry.name)).filter((candidate) => fs.statSync(candidate).size === sourceSize);
	if (candidates.length === 0) return;
	const sourceHash = sha256FileSync(sourcePath);
	for (const candidate of candidates) if (sha256FileSync(candidate) === sourceHash) return candidate;
}
function copyOrphanedSidecar(sourcePath, epochMs) {
	const basePath = `${sourcePath}.orphaned-${epochMs}`;
	for (let suffix = 0;; suffix += 1) {
		const candidate = suffix === 0 ? basePath : `${basePath}-${suffix}`;
		try {
			fs.copyFileSync(sourcePath, candidate, fs.constants.COPYFILE_EXCL);
			return candidate;
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
		}
	}
}
/** Preserve durable orphan sidecars before SQLite creates a replacement main database. */
function quarantineOrphanedSqliteSidecars(pathname) {
	if (fs.existsSync(pathname)) return;
	const sidecars = [{
		path: `${pathname}-wal`,
		minimumBytes: SQLITE_WAL_HEADER_BYTES
	}, {
		path: `${pathname}-journal`,
		minimumBytes: 0
	}].flatMap((sidecar) => {
		const stat = fs.statSync(sidecar.path, { throwIfNoEntry: false });
		return stat?.isFile() === true && stat.size > sidecar.minimumBytes ? [{
			path: sidecar.path,
			size: stat.size
		}] : [];
	});
	if (sidecars.length === 0) return;
	const epochMs = Date.now();
	const copied = [];
	try {
		for (const sidecar of sidecars) {
			if (findMatchingOrphanedSidecarCopy(sidecar.path, sidecar.size)) continue;
			const quarantinePath = copyOrphanedSidecar(sidecar.path, epochMs);
			copied.push({
				quarantinePath,
				sourcePath: sidecar.path
			});
		}
	} catch (error) {
		throw new SqliteOrphanedSidecarsError(pathname, sidecars.map((sidecar) => sidecar.path), error);
	}
	if (copied.length === 0) return;
	const copies = copied.map(({ sourcePath, quarantinePath }) => `${sourcePath} -> ${quarantinePath}`);
	sqliteFilesLog.warn(`SQLite database is missing at ${pathname}; copied orphaned sidecars: ${copies.join(", ")}. Committed frames could not be applied because the main database is missing. The bytes are preserved. Recovery requires restoring the main database and pairing it with the quarantined file.`, {
		databasePath: pathname,
		copiedSidecars: copied
	});
}
//#endregion
//#region src/state/openclaw-state-db-permissions.ts
const OPENCLAW_STATE_DIR_MODE = 448;
const OPENCLAW_STATE_FILE_MODE = 384;
const stateDbLog$1 = createSubsystemLogger("state/db");
/** Targets already warned about, so chmod-less filesystems warn once per path. */
const chmodWarnedTargets = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function bestEffortChmodSync(target, mode) {
	const result = applyPrivateModeSync(target, mode);
	if (result.applied || chmodWarnedTargets.check(target)) return;
	stateDbLog$1.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env) {
	const dir = path.dirname(pathname);
	const defaultDir = resolveOpenClawStateSqliteDir(env);
	const isDefaultStateDatabase = path.resolve(pathname) === path.resolve(resolveOpenClawStateSqlitePath(env));
	if (isDefaultStateDatabase && dir !== defaultDir) throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_STATE_DIR_MODE
	});
	if (isDefaultStateDatabase || !dirExisted) bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) if (existsSync(candidate)) bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
}
//#endregion
//#region src/shared/chat-envelope.ts
const ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
const ENVELOPE_CHANNELS = [
	"WebChat",
	"WhatsApp",
	"Telegram",
	"Signal",
	"Slack",
	"Discord",
	"Google Chat",
	"iMessage",
	"Teams",
	"Matrix",
	"Zalo",
	"Zalo Personal",
	"iMessage"
];
const MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
function looksLikeEnvelopeHeader(header) {
	if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) return true;
	if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) return true;
	return ENVELOPE_CHANNELS.some((label) => header.startsWith(`${label} `));
}
/** Removes recognized channel/timestamp prefixes while preserving user-authored bracket text. */
function stripEnvelope(text) {
	const match = text.match(ENVELOPE_PREFIX);
	if (!match) return text;
	if (!looksLikeEnvelopeHeader(match[1] ?? "")) return text;
	return text.slice(match[0].length);
}
/** Removes standalone message-id hint lines without touching inline user mentions. */
function stripMessageIdHints(text) {
	if (!/\[message_id:/i.test(text)) return text;
	const lines = text.split(/\r?\n/);
	const filtered = lines.filter((line) => !MESSAGE_ID_LINE.test(line));
	return filtered.length === lines.length ? text : filtered.join("\n");
}
//#endregion
//#region src/auto-reply/reply/inbound-context-marker.ts
/**
* Provenance marker appended to every OpenClaw-injected inbound context header
* (see `buildInboundUserContextPrefix`). Strippers key on this marker rather
* than on label text so detection is label-agnostic and never collides with
* user-typed headings. Fixed (not per-turn random): strippers run on stored
* text with no out-of-band value, and forging it only strips the forger's own
* text — no trust boundary depends on it.
*
* Duplicated (never imported) in:
*   - extensions/memory-lancedb/memory-capture-sanitization.ts (extension boundary
*     forbids core imports)
*   - apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatMarkdownPreprocessor.swift, which spells the
*     same two code points as `\u{27E6}`/`\u{27E7}` escapes
* Keep every copy equal to this value; a drifted copy silently stops stripping.
*/
const INBOUND_CONTEXT_MARKER = "⟦openclaw:ctx⟧";
/** Appends the provenance marker to a context header label. */
function markInboundContextLabel(label) {
	return `${label} ${INBOUND_CONTEXT_MARKER}`;
}
//#endregion
//#region src/auto-reply/reply/strip-inbound-meta.ts
/**
* Strips OpenClaw-injected inbound metadata blocks from a user-role message
* text before it is displayed in any UI surface (TUI, webchat, macOS app) or
* replayed as historical context to the model.
*
* Background: `buildInboundUserContextPrefix` in `inbound-meta.ts` prepends
* structured metadata blocks (Conversation info, Sender info, reply context,
* etc.) directly to the stored user message content so the LLM can access
* them. These blocks are current-turn AI-facing context only and must never
* surface in user-visible chat history or accumulate in historical prompt
* replay.
*
* Also strips the timestamp prefix injected by `injectTimestamp` so UI surfaces
* do not show AI-facing envelope metadata as user text.
*
* Detection: every OpenClaw-injected context header is stamped with a fixed
* provenance marker `⟦openclaw:ctx⟧`. Strippers key on this marker rather than
* on label text, making detection label-agnostic (arbitrary structured labels
* are supported) and collision-free (user text never carries the marker). This
* fixes both label collision risks (e.g., `Sender:` in natural prose) and the
* structured-context over-strip (arbitrary plugin labels are now recognized).
*/
const LEADING_TIMESTAMP_PREFIX_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
const CHANNEL_CONTEXT_HEADER = `Context: ${INBOUND_CONTEXT_MARKER}`;
const ACTIVE_MEMORY_CONTEXT_HEADER = "Context:";
const ACTIVE_MEMORY_OPEN_TAG = "<active_memory_plugin>";
const ACTIVE_MEMORY_CLOSE_TAG = "</active_memory_plugin>";
function isInboundContextHeaderLine(line) {
	const t = line.trim();
	return t.length > 14 && t.endsWith("⟦openclaw:ctx⟧");
}
const SENTINEL_SUBSTRING_ALTERNATIVES = [INBOUND_CONTEXT_MARKER, ...MESSAGE_TOOL_DELIVERY_HINTS].map((sentinel) => sentinel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
const ACTIVE_MEMORY_HEADER_ESCAPED = ACTIVE_MEMORY_CONTEXT_HEADER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SENTINEL_FAST_RE = new RegExp(`${SENTINEL_SUBSTRING_ALTERNATIVES}|^[ \t]*${ACTIVE_MEMORY_HEADER_ESCAPED}[ \t]*$`, "m");
/** Fast check for whether text contains any inbound metadata sentinel. */
function hasInboundMetadataSentinel(text) {
	return Boolean(text && SENTINEL_FAST_RE.test(text));
}
function isMessageToolDeliveryHintLine(line) {
	const trimmed = line.trim();
	return MESSAGE_TOOL_DELIVERY_HINTS.some((hint) => hint === trimmed);
}
function skipChatWindowContextBlock(lines, index) {
	let next = index + 1;
	while (next < lines.length && lines[next]?.trim() !== "") next++;
	while (next < lines.length && lines[next]?.trim() === "") next++;
	return next;
}
function restoreNeutralizedMarkdownFences(value) {
	if (typeof value === "string") return value.replaceAll("`​``", "```");
	if (Array.isArray(value)) return value.map((entry) => restoreNeutralizedMarkdownFences(entry));
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, restoreNeutralizedMarkdownFences(entry)]));
}
function parseJsonObjectRecord(jsonText) {
	return safeParseJsonRecord(jsonText) ?? null;
}
function parseInboundMetaBlock(lines, sentinelBase) {
	const markedSentinel = `${sentinelBase} ${INBOUND_CONTEXT_MARKER}`;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i]?.trim() !== markedSentinel) continue;
		if (lines[i + 1]?.trim() !== "```json") return null;
		let end = i + 2;
		while (end < lines.length && lines[end]?.trim() !== "```") end += 1;
		if (end >= lines.length) return null;
		const jsonText = lines.slice(i + 2, end).join("\n").trim();
		if (!jsonText) return null;
		const parsed = parseJsonObjectRecord(jsonText);
		return parsed ? restoreNeutralizedMarkdownFences(parsed) : null;
	}
	return null;
}
function firstNonEmptyString(...values) {
	for (const value of values) {
		if (typeof value !== "string") continue;
		const trimmed = value.trim();
		if (trimmed) return trimmed;
	}
	return null;
}
function shouldStripTrailingContextBlock(lines, index) {
	return lines[index]?.trim() === CHANNEL_CONTEXT_HEADER;
}
function stripTrailingContextBlockSuffix(lines) {
	for (let i = 0; i < lines.length; i++) {
		if (!shouldStripTrailingContextBlock(lines, i)) continue;
		let end = i;
		while (end > 0 && lines[end - 1]?.trim() === "") end -= 1;
		return lines.slice(0, end);
	}
	return lines;
}
function stripActiveMemoryPromptPrefixBlocks(lines) {
	const result = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines.at(index);
		if (line === void 0) break;
		if (line.trim() === ACTIVE_MEMORY_CONTEXT_HEADER && lines[index + 1]?.trim() === ACTIVE_MEMORY_OPEN_TAG) {
			let closeIndex = -1;
			for (let probe = index + 2; probe < lines.length; probe += 1) if (lines[probe]?.trim() === ACTIVE_MEMORY_CLOSE_TAG) {
				closeIndex = probe;
				break;
			}
			if (closeIndex !== -1) {
				index = closeIndex;
				while (index + 1 < lines.length && lines[index + 1]?.trim() === "") index += 1;
				continue;
			}
		}
		result.push(line);
	}
	return result;
}
/**
* Remove all injected inbound metadata prefix blocks from `text`.
*
* Each block has the shape:
*
* ```
* <header-with-marker>
* ```json
* { … }
* ```
* ```
*
* Returns the original string reference unchanged when no metadata is present
* (fast path — zero allocation).
*/
/** Strips all injected inbound metadata blocks from user-visible text. */
function stripInboundMetadata(text) {
	if (!text) return text;
	const withoutTimestamp = text.replace(LEADING_TIMESTAMP_PREFIX_RE, "");
	if (!SENTINEL_FAST_RE.test(withoutTimestamp)) return withoutTimestamp;
	const strippedLeadingPrefixLines = stripActiveMemoryPromptPrefixBlocks(withoutTimestamp.split("\n"));
	const result = [];
	let inMetaBlock = false;
	let inFencedJson = false;
	for (let i = 0; i < strippedLeadingPrefixLines.length; i++) {
		const line = strippedLeadingPrefixLines.at(i);
		if (line === void 0) break;
		if (!inMetaBlock && shouldStripTrailingContextBlock(strippedLeadingPrefixLines, i)) break;
		if (!inMetaBlock && isMessageToolDeliveryHintLine(line)) continue;
		if (!inMetaBlock && isInboundContextHeaderLine(line)) {
			if (strippedLeadingPrefixLines[i + 1]?.trim() !== "```json") {
				i = skipChatWindowContextBlock(strippedLeadingPrefixLines, i) - 1;
				continue;
			}
			inMetaBlock = true;
			inFencedJson = false;
			continue;
		}
		if (inMetaBlock) {
			if (!inFencedJson && line.trim() === "```json") {
				inFencedJson = true;
				continue;
			}
			if (inFencedJson) {
				if (line.trim() === "```") {
					inMetaBlock = false;
					inFencedJson = false;
				}
				continue;
			}
			if (line.trim() === "") continue;
			inMetaBlock = false;
		}
		result.push(line);
	}
	return result.join("\n").replace(/^\n+/, "").replace(/\n+$/, "").replace(LEADING_TIMESTAMP_PREFIX_RE, "");
}
/** Strips only leading inbound metadata blocks while preserving later user text. */
function stripLeadingInboundMetadata(text) {
	if (!text || !SENTINEL_FAST_RE.test(text)) return text;
	const lines = stripActiveMemoryPromptPrefixBlocks(text.split("\n"));
	let index = 0;
	while (lines.at(index) === "") index++;
	const firstLine = lines.at(index);
	if (firstLine === void 0) return "";
	const strippedDeliveryHint = isMessageToolDeliveryHintLine(firstLine);
	while (true) {
		const line = lines.at(index);
		if (line === void 0 || !isMessageToolDeliveryHintLine(line)) break;
		index++;
		while (lines.at(index) === "") index++;
	}
	const firstContentLine = lines.at(index);
	if (firstContentLine === void 0) return "";
	if (!isInboundContextHeaderLine(firstContentLine)) return stripTrailingContextBlockSuffix(strippedDeliveryHint ? lines.slice(index) : lines).join("\n");
	while (index < lines.length) {
		const line = lines.at(index);
		if (line === void 0) break;
		if (!isInboundContextHeaderLine(line)) break;
		if (lines[index + 1]?.trim() !== "```json") {
			index = skipChatWindowContextBlock(lines, index);
			continue;
		}
		index++;
		if (lines.at(index)?.trim() === "```json") {
			index++;
			while (index < lines.length && lines.at(index)?.trim() !== "```") index++;
			if (lines.at(index)?.trim() === "```") index++;
		} else return text;
		while (lines.at(index)?.trim() === "") index++;
	}
	return stripTrailingContextBlockSuffix(lines.slice(index)).join("\n");
}
/** Extracts the sender label from injected inbound metadata when present. */
function extractInboundSenderLabel(text) {
	if (!text || !SENTINEL_FAST_RE.test(text)) return null;
	const lines = text.split("\n");
	const senderInfo = parseInboundMetaBlock(lines, "Sender:");
	const conversationSender = parseInboundMetaBlock(lines, "Conversation info:")?.sender;
	const conversationSenderFields = conversationSender && typeof conversationSender === "object" && !Array.isArray(conversationSender) ? [
		conversationSender["name"],
		conversationSender["username"],
		conversationSender["e164"],
		conversationSender["id"]
	] : [conversationSender];
	return firstNonEmptyString(senderInfo?.label, senderInfo?.name, senderInfo?.username, senderInfo?.e164, senderInfo?.id, ...conversationSenderFields);
}
//#endregion
//#region src/auto-reply/reply/display-text-sanitize.ts
/** Removes internal runtime metadata before showing text to users. */
function stripInternalMetadataForDisplay(text) {
	return stripInboundMetadata(stripInternalRuntimeContext(text));
}
/** Removes user-envelope and message-id hints from display text. */
function stripUserEnvelopeForDisplay(text) {
	return stripMessageIdHints(stripEnvelope(stripInternalMetadataForDisplay(text)));
}
//#endregion
//#region src/agents/agent-run-terminal-reply.ts
const AGENT_RUN_TERMINAL_REPLY_MAX_CHARS = 4096;
function isMessageToolNotCalledTerminalReply(reply) {
	return reply?.disposition === "empty" && reply.code === "message-tool-not-called";
}
/** Sanitizes and caps producer-owned text before it enters lifecycle or durable state. */
function sanitizeAgentRunTerminalReplyText(text) {
	const sanitized = stripInternalMetadataForDisplay(text).trim();
	if (sanitized.length <= AGENT_RUN_TERMINAL_REPLY_MAX_CHARS) return sanitized;
	return `${truncateUtf16Safe(sanitized, AGENT_RUN_TERMINAL_REPLY_MAX_CHARS - 1).trimEnd()}…`;
}
/** Builds the authoritative terminal reply fact while raw assistant text is still available. */
function buildAgentRunTerminalReplySnapshot(params) {
	if (params.terminalReplyKind === "silent-empty" || isSilentReplyText(params.rawText, "NO_REPLY")) return { disposition: "silent" };
	const text = sanitizeAgentRunTerminalReplyText(params.visibleText ?? "");
	return text ? {
		disposition: "visible",
		text
	} : { disposition: "empty" };
}
/** Normalizes lifecycle/RPC evidence without allowing raw or unbounded text through. */
function normalizeAgentRunTerminalReplySnapshot(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const disposition = value.disposition;
	if (disposition === "silent") return { disposition };
	if (disposition === "empty") {
		if (value.code === "message-tool-not-called") return {
			disposition,
			code: "message-tool-not-called"
		};
		return { disposition };
	}
	if (disposition !== "visible") return;
	const rawText = value.text;
	if (typeof rawText !== "string") return;
	const text = sanitizeAgentRunTerminalReplyText(rawText);
	return text ? {
		disposition: "visible",
		text
	} : { disposition: "empty" };
}
/** Reply evidence merges independently from sticky timeout/cancellation precedence. */
function mergeAgentRunTerminalReplySnapshot(existing, incoming) {
	if (!incoming) return existing;
	if (!existing) return incoming;
	if (isMessageToolNotCalledTerminalReply(existing)) return existing;
	if (isMessageToolNotCalledTerminalReply(incoming)) return incoming;
	if (existing.disposition === "empty") return incoming;
	return incoming.disposition === "empty" ? existing : incoming;
}
//#endregion
//#region src/agents/tools/sessions-send-tokens.ts
/**
* sessions_send sentinel tokens.
*
* Defines non-deliverable reply markers used by sessions_send and subagent completion delivery.
*/
/** Suppresses a subagent completion announcement. */
const ANNOUNCE_SKIP_TOKEN = "ANNOUNCE_SKIP";
/** Suppresses a direct reply delivery. */
const REPLY_SKIP_TOKEN = "REPLY_SKIP";
const NON_DELIVERABLE_REPLY_TOKENS = [
	ANNOUNCE_SKIP_TOKEN,
	REPLY_SKIP_TOKEN,
	SILENT_REPLY_TOKEN,
	HEARTBEAT_TOKEN
];
/** Returns true when text is exactly the announce-skip sentinel. */
function isAnnounceSkip(text) {
	return (text ?? "").trim() === ANNOUNCE_SKIP_TOKEN;
}
/** Returns true when text is exactly the reply-skip sentinel. */
function isReplySkip(text) {
	return (text ?? "").trim() === REPLY_SKIP_TOKEN;
}
/** Returns true when text is any non-deliverable sessions reply sentinel. */
function isNonDeliverableSessionsReply(text) {
	return NON_DELIVERABLE_REPLY_TOKENS.some((token) => isSilentReplyText(text, token));
}
/** Selects a deliverable reply while allowing NO_REPLY to use captured fallback output. */
function selectDeliverableSessionsReply(primary, fallback) {
	const primaryReply = primary?.trim();
	if (primaryReply && !isNonDeliverableSessionsReply(primaryReply)) return primaryReply;
	if (primaryReply && !isSilentReplyText(primaryReply, "NO_REPLY")) return;
	const fallbackReply = fallback?.trim();
	return fallbackReply && !isNonDeliverableSessionsReply(fallbackReply) ? fallbackReply : void 0;
}
//#endregion
//#region src/infra/delivery-queue-sqlite-bound.ts
const COMPLETED_TOMBSTONE_RETENTION_MS = 720 * 60 * 6e4;
const BOUNDED_DELIVERY_RECEIPTS_SQL = `
  SELECT * FROM (
    SELECT rowid receipt_rowid, queue_name, id, enqueued_at,
      json_extract(entry_json, '$.completionRetention.idPrefix') id_prefix,
      json_extract(entry_json, '$.completionRetention.maxAgeMs') max_age_ms,
      json_extract(entry_json, '$.completionRetention.maxEntries') max_entries
    FROM delivery_queue_entries WHERE status IN ('completed', 'failed')
      AND recovery_state = 'completed_bounded' AND json_valid(entry_json)
       AND json_type(entry_json, '$.completionRetention') = 'object'
  )
  WHERE typeof(id_prefix) = 'text' AND id_prefix <> ''
    AND substr(id, 1, length(id_prefix)) = id_prefix
    AND typeof(max_age_ms) = 'integer' AND max_age_ms BETWEEN 1 AND 9007199254740991
    AND typeof(max_entries) = 'integer' AND max_entries BETWEEN 1 AND 9007199254740991`;
const deliveryQueueRowColumns = [
	"id",
	"entry_json",
	"enqueued_at",
	"retry_count",
	"last_attempt_at",
	"last_error",
	"platform_send_started_at",
	"recovery_state"
];
/** Prunes bounded receipts globally or for one exact producer namespace. */
function pruneDeliveryQueueTombstones(db, now, prefix) {
	db.prepare(`WITH policies AS (
      ${BOUNDED_DELIVERY_RECEIPTS_SQL}
      AND (@queueName IS NULL OR (queue_name = @queueName AND id_prefix = @idPrefix))
    ), ranked AS (
      SELECT *, row_number() OVER (PARTITION BY queue_name, id_prefix
        ORDER BY enqueued_at DESC, id DESC) retention_rank FROM policies
    ) DELETE FROM delivery_queue_entries WHERE rowid IN (
      SELECT receipt_rowid FROM ranked
      WHERE enqueued_at < @now - max_age_ms OR retention_rank > max_entries
    )`).run({
		now,
		queueName: prefix?.queueName ?? null,
		idPrefix: prefix?.idPrefix ?? null
	});
	if (!prefix) pruneOrdinaryDeliveryReceipts(db, now);
}
/** Cheap maintenance cleanup: age predicates only, with no window sort. */
function pruneDeliveryQueueTombstoneAges(db, now) {
	db.prepare(`DELETE FROM delivery_queue_entries WHERE rowid IN (
    SELECT receipt_rowid FROM (${BOUNDED_DELIVERY_RECEIPTS_SQL})
    WHERE enqueued_at < @now - max_age_ms)`).run({ now });
	pruneOrdinaryDeliveryReceipts(db, now);
}
/** CAS-compacts one exact pending row, or deletes it when no fence is authored. */
function terminalizeBoundDeliveryQueueEntry(db, queueName, id, expectedJson, failedEntry, now) {
	if (!failedEntry) return db.prepare(`DELETE FROM delivery_queue_entries
          WHERE queue_name = ? AND id = ? AND status = 'pending' AND entry_json = ?`).run(queueName, id, expectedJson).changes === 1;
	return db.prepare(`UPDATE delivery_queue_entries SET status = 'failed', entry_kind = NULL,
        session_key = NULL, channel = NULL, target = NULL, account_id = NULL,
        last_attempt_at = NULL, last_error = NULL, platform_send_started_at = NULL,
        recovery_state = ?, entry_json = ?, enqueued_at = ?, updated_at = ?, failed_at = ?
      WHERE queue_name = ? AND id = ? AND status = 'pending' AND entry_json = ?`).run(failedEntry.recoveryState ?? null, JSON.stringify(failedEntry), now, now, now, queueName, id, expectedJson).changes === 1;
}
function pruneOrdinaryDeliveryReceipts(db, now) {
	db.prepare(`DELETE FROM delivery_queue_entries WHERE status = 'completed'
    AND enqueued_at < ? AND (recovery_state IS NULL OR recovery_state NOT IN (
      'completed_permanent', 'completed_bounded'
    ))`).run(now - COMPLETED_TOMBSTONE_RETENTION_MS);
}
function inflateDeliveryQueueRow(row) {
	let parsed;
	try {
		parsed = JSON.parse(row.entry_json);
	} catch {
		return null;
	}
	return {
		...parsed,
		id: row.id,
		enqueuedAt: Number(row.enqueued_at),
		retryCount: Number(row.retry_count),
		...row.last_attempt_at == null ? {} : { lastAttemptAt: Number(row.last_attempt_at) },
		...row.last_error == null ? {} : { lastError: row.last_error },
		...row.platform_send_started_at == null ? {} : { platformSendStartedAt: Number(row.platform_send_started_at) },
		...row.recovery_state == null ? {} : { recoveryState: row.recovery_state }
	};
}
function deliveryQueueMetadata(queueName, entry) {
	const item = entry;
	return {
		entryKind: item.kind ?? queueName,
		sessionKey: item.sessionKey ?? item.session?.key,
		channel: item.channel ?? item.route?.channel ?? item.deliveryContext?.channel,
		target: item.to ?? item.route?.to ?? item.deliveryContext?.to,
		accountId: item.accountId ?? item.route?.accountId ?? item.deliveryContext?.accountId
	};
}
/** Canonically serializes a queue row before a transaction acquires the write lock. */
function bindDeliveryQueueEntry(params, now = Date.now()) {
	const status = params.status ?? "pending";
	const meta = params.metadata ?? deliveryQueueMetadata(params.queueName, params.entry);
	return {
		insertOnly: params.insertOnly === true,
		updatePendingOnly: params.updatePendingOnly === true,
		completeExisting: params.completeExisting === true,
		row: {
			queue_name: params.queueName,
			id: params.entry.id,
			status,
			entry_kind: meta.entryKind ?? null,
			session_key: meta.sessionKey ?? null,
			channel: meta.channel ?? null,
			target: meta.target ?? null,
			account_id: meta.accountId ?? null,
			retry_count: params.entry.retryCount,
			last_attempt_at: params.entry.lastAttemptAt ?? null,
			last_error: params.entry.lastError ?? null,
			recovery_state: params.entry.recoveryState ?? null,
			platform_send_started_at: params.entry.platformSendStartedAt ?? null,
			entry_json: JSON.stringify(params.entry),
			enqueued_at: params.entry.enqueuedAt,
			updated_at: now,
			failed_at: status === "failed" ? now : null
		}
	};
}
/** Mutates only the exact supplied shared-state handle; never opens or hardens a file. */
function upsertBoundDeliveryQueueEntryInDatabase(bound, database) {
	const insert = getNodeSqliteKysely(database.db).insertInto("delivery_queue_entries").values(bound.row);
	const query = bound.insertOnly ? insert.onConflict((conflict) => conflict.columns(["queue_name", "id"]).doNothing()) : insert.onConflict((conflict) => {
		const update = conflict.columns(["queue_name", "id"]).doUpdateSet({
			status: (eb) => eb.ref("excluded.status"),
			entry_kind: (eb) => eb.ref("excluded.entry_kind"),
			session_key: (eb) => eb.ref("excluded.session_key"),
			channel: (eb) => eb.ref("excluded.channel"),
			target: (eb) => eb.ref("excluded.target"),
			account_id: (eb) => eb.ref("excluded.account_id"),
			retry_count: (eb) => eb.ref("excluded.retry_count"),
			last_attempt_at: (eb) => eb.ref("excluded.last_attempt_at"),
			last_error: (eb) => eb.ref("excluded.last_error"),
			recovery_state: (eb) => eb.ref("excluded.recovery_state"),
			platform_send_started_at: (eb) => eb.ref("excluded.platform_send_started_at"),
			entry_json: (eb) => eb.ref("excluded.entry_json"),
			enqueued_at: (eb) => eb.ref("excluded.enqueued_at"),
			updated_at: (eb) => eb.ref("excluded.updated_at"),
			failed_at: (eb) => eb.ref("excluded.failed_at")
		});
		if (bound.updatePendingOnly) return update.where("delivery_queue_entries.status", "=", "pending");
		return bound.completeExisting ? update.where("delivery_queue_entries.status", "in", ["pending", "failed"]) : update;
	});
	return executeSqliteQuerySync(database.db, query).numAffectedRows === 1n;
}
/** Reads one row from the exact supplied handle for cross-owner invariant validation. */
function loadDeliveryQueueEntryInDatabase(database, queueName, id, pendingOnly = false) {
	let query = getNodeSqliteKysely(database.db).selectFrom("delivery_queue_entries").select(deliveryQueueRowColumns).where("queue_name", "=", queueName).where("id", "=", id);
	if (pendingOnly) query = query.where("status", "=", "pending");
	const row = executeSqliteQueryTakeFirstSync(database.db, query);
	return row ? inflateDeliveryQueueRow(row) : null;
}
//#endregion
//#region src/infra/delivery-queue-sqlite.types.ts
/** Parse only the shipped completion-retention shape for one exact producer ID. */
function parseDeliveryQueueCompletionRetention(value, id) {
	if (value === "permanent") return value;
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const retention = value;
	const idPrefix = typeof retention.idPrefix === "string" ? retention.idPrefix : "";
	const maxAgeMs = asPositiveSafeInteger(retention.maxAgeMs);
	const maxEntries = asPositiveSafeInteger(retention.maxEntries);
	if (!idPrefix || !id.startsWith(idPrefix) || maxAgeMs === void 0 || maxEntries === void 0) return;
	return {
		idPrefix,
		maxAgeMs,
		maxEntries
	};
}
const finite = (value) => typeof value === "number" && Number.isFinite(value);
/** Recover only authored or shipped producer ownership from a failed entry. */
function inferDeliveryQueueFailureRetention(entry, id, queueName, legacyAmbiguousSendEvidence = false) {
	const explicit = parseDeliveryQueueCompletionRetention(entry.completionRetention, id) ?? parseDeliveryQueueCompletionRetention(entry.failureRetention, id);
	if (explicit) return explicit;
	const fence = asNullableRecord(asNullableRecord(entry.terminalPolicy)?.fence);
	if (fence?.kind === "none") return;
	const fenced = fence?.kind === "permanent" ? "permanent" : parseDeliveryQueueCompletionRetention(fence, id);
	if (fenced) return fenced;
	const durable = queueName === "outbound-preparing-v1" || queueName === "outbound-legacy-preparing-v1" || queueName === "outbound-prepared-migration-v1" || entry.retainOnFailure === true || asNullableRecord(entry.deliveryCompletion) !== null || queueName === "session" && finite(entry.availableAt);
	const ambiguous = legacyAmbiguousSendEvidence && (typeof entry.platformSendAttemptId === "string" && entry.platformSendAttemptId.length > 0 || finite(entry.platformSendStartedAt) || entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send" || queueName === "session" && (finite(entry.deliveryStartedAt) || typeof entry.settlementOutcome === "string" && entry.settlementOutcome.length > 0 || finite(entry.acknowledgedAt)));
	return durable || ambiguous ? "permanent" : void 0;
}
/** Strip a terminal queue row to the producer policy needed for admission. */
function projectDeliveryQueueTerminalEntry(entry, terminalAt, terminal, completionRetention) {
	const retryCount = Number.isSafeInteger(entry.retryCount) && entry.retryCount >= 0 ? entry.retryCount : 0;
	const recoveryState = completionRetention === "permanent" ? "completed_permanent" : completionRetention ? "completed_bounded" : void 0;
	return {
		id: entry.id,
		enqueuedAt: terminalAt,
		retryCount,
		...terminal === "completed" ? { acknowledgedAt: terminalAt } : { failedAt: terminalAt },
		...completionRetention ? { completionRetention } : {},
		...recoveryState ? { recoveryState } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-delivery-queue-backfill.ts
function nonNegativeSafeInteger(value) {
	const number = typeof value === "bigint" ? Number(value) : value;
	return typeof number === "number" && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
}
const inferLegacyRetention = (entry, id, queue) => inferDeliveryQueueFailureRetention(entry ?? {}, id, queue, true);
/** Compact every preexisting failed row without inferring replay or owner policy. */
function compactLegacyDeliveryQueueFailures(db) {
	const migrationNow = Date.now();
	const retainPending = db.prepare(`UPDATE delivery_queue_entries SET entry_json = ?
      WHERE queue_name = ? AND id = ? AND status = 'pending' AND entry_json = ?`);
	const select = db.prepare(`SELECT queue_name, id, status, retry_count, entry_json, updated_at, failed_at
       FROM delivery_queue_entries WHERE status IN ('pending', 'failed')`);
	select.setReadBigInts(true);
	const rows = select.all();
	const remove = db.prepare(`DELETE FROM delivery_queue_entries WHERE queue_name = ? AND id = ? AND status = 'failed'`);
	const compact = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = NULL, session_key = NULL, channel = NULL, target = NULL,
            account_id = NULL, retry_count = @retryCount, last_attempt_at = NULL,
            last_error = NULL, platform_send_started_at = NULL, entry_json = @entryJson,
            enqueued_at = @failedAt, failed_at = @failedAt, recovery_state = @recoveryState
      WHERE queue_name = @queueName AND id = @id AND status = 'failed'`);
	for (const row of rows) {
		const parsedEntry = safeParseJsonRecord(String(row.entry_json));
		const queueName = String(row.queue_name);
		const id = String(row.id);
		if (row.status === "pending") {
			if (parsedEntry?.retainOnFailure !== true && inferLegacyRetention(parsedEntry, id, queueName)) retainPending.run(JSON.stringify({
				...parsedEntry,
				retainOnFailure: true
			}), queueName, id, String(row.entry_json));
			continue;
		}
		const failedAt = nonNegativeSafeInteger(row.failed_at) ?? nonNegativeSafeInteger(row.updated_at) ?? migrationNow;
		const entry = parsedEntry ?? {};
		const retryCount = Math.max(nonNegativeSafeInteger(row.retry_count) ?? 0, nonNegativeSafeInteger(entry.retryCount) ?? 0);
		const retention = parsedEntry ? inferLegacyRetention(entry, id, queueName) : "permanent";
		if (!retention) {
			remove.run(queueName, id);
			continue;
		}
		const failedEntry = projectDeliveryQueueTerminalEntry({
			id,
			retryCount
		}, failedAt, "failed", retention);
		compact.run({
			retryCount,
			entryJson: JSON.stringify(failedEntry),
			failedAt,
			recoveryState: failedEntry.recoveryState ?? null,
			queueName,
			id
		});
	}
	pruneDeliveryQueueTombstones(db, migrationNow);
}
//#endregion
//#region src/state/openclaw-state-db-legacy-backfills.ts
function ensureOperatorApprovalResolutionRefs(db) {
	if (!tableExists(db, "operator_approvals")) return;
	runSqliteImmediateTransactionSync(db, () => {
		ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
		const rows = db.prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals").all();
		const update = db.prepare("UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?");
		for (const row of rows) {
			if (typeof row.approval_id !== "string" || !isCanonicalOperatorApprovalKind(row.kind)) throw new Error("operator approval row cannot be assigned a transport reference");
			const resolutionRef = buildApprovalResolutionRef({
				approvalId: row.approval_id,
				approvalKind: row.kind
			});
			if (row.resolution_ref !== resolutionRef) update.run(resolutionRef, row.approval_id);
		}
		if (db.prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`).get()) throw new Error("operator approval ids conflict with durable transport references");
		db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
	});
}
function repairLegacyTaskAgentAttribution(db) {
	if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "requester_agent_id")) return;
	db.exec(`
    UPDATE task_runs
    SET
      requester_agent_id = CASE
        WHEN owner_key GLOB 'agent:*:*' THEN substr(
          owner_key,
          7,
          instr(substr(owner_key, 7), ':') - 1
        )
        WHEN requester_session_key GLOB 'agent:*:*' THEN substr(
          requester_session_key,
          7,
          instr(substr(requester_session_key, 7), ':') - 1
        )
        WHEN agent_id <> substr(
          child_session_key,
          7,
          instr(substr(child_session_key, 7), ':') - 1
        ) THEN agent_id
        ELSE NULL
      END,
      agent_id = substr(
        child_session_key,
        7,
        instr(substr(child_session_key, 7), ':') - 1
      )
    WHERE requester_agent_id IS NULL
      AND runtime IN ('subagent', 'acp')
      AND child_session_key GLOB 'agent:*:*'
      AND instr(substr(child_session_key, 7), ':') > 1
      AND (
        owner_key GLOB 'agent:*:*'
        OR requester_session_key GLOB 'agent:*:*'
        OR (
          agent_id IS NOT NULL
          AND agent_id <> substr(
            child_session_key,
            7,
            instr(substr(child_session_key, 7), ':') - 1
          )
        )
      );
  `);
}
function repairLegacyTaskDeliveryStatuses(db) {
	if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "delivery_status")) return;
	db.exec(`
    UPDATE task_runs
    SET delivery_status = 'not_applicable'
    WHERE delivery_status = 'not-requested';
  `);
}
function nullableTextValue(record, key) {
	if (!record || !Object.hasOwn(record, key)) return;
	const value = record[key];
	return typeof value === "string" || value === null ? value : void 0;
}
function selectLegacyRetainedTaskResult(completion, primary, fallback) {
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(completion.terminalReply);
	if (terminalReply) return terminalReply.disposition === "visible" ? terminalReply.text : null;
	return selectDeliverableSessionsReply(primary, fallback) ?? null;
}
/** Promote shipped retained results before runtime hydrates canonical subagent/task state. */
function repairLegacySubagentRetainedResults(db) {
	if (!tableExists(db, "subagent_runs") || !tableHasColumn(db, "subagent_runs", "pending_final_delivery_payload_json") || !tableHasColumn(db, "subagent_runs", "frozen_result_text") || !tableHasColumn(db, "subagent_runs", "fallback_frozen_result_text")) return;
	const repair = () => {
		const rows = db.prepare(`SELECT run_id, payload_json, pending_final_delivery_payload_json,
                frozen_result_text, fallback_frozen_result_text
           FROM subagent_runs`).all();
		const updateRun = db.prepare(`UPDATE subagent_runs
          SET payload_json = ?,
              pending_final_delivery_payload_json = ?,
              frozen_result_text = ?,
              fallback_frozen_result_text = ?
        WHERE run_id = ?`);
		const updateTask = tableExists(db, "task_runs") && tableHasColumn(db, "task_runs", "progress_summary") ? db.prepare(`UPDATE task_runs
              SET progress_summary = ?
            WHERE runtime = 'subagent'
              AND run_id = ?
              AND (progress_summary IS NULL
                OR trim(progress_summary) = ''
                OR (? IS NOT NULL AND trim(progress_summary) = ?))`) : void 0;
		for (const row of rows) {
			const payload = parseJsonRecord(row.payload_json);
			const completion = payload ? recordField(payload, "completion") : null;
			if (!payload || !completion) continue;
			const delivery = recordField(payload, "delivery");
			const deliveryPayload = delivery ? recordField(delivery, "payload") : null;
			const pendingPayload = row.pending_final_delivery_payload_json ? parseJsonRecord(row.pending_final_delivery_payload_json) : null;
			if (!Boolean(deliveryPayload && (Object.hasOwn(deliveryPayload, "frozenResultText") || Object.hasOwn(deliveryPayload, "fallbackFrozenResultText")) || pendingPayload && (Object.hasOwn(pendingPayload, "frozenResultText") || Object.hasOwn(pendingPayload, "fallbackFrozenResultText")))) continue;
			const legacyPrimary = nullableTextValue(deliveryPayload, "frozenResultText") ?? nullableTextValue(pendingPayload, "frozenResultText");
			const legacyFallback = nullableTextValue(deliveryPayload, "fallbackFrozenResultText") ?? nullableTextValue(pendingPayload, "fallbackFrozenResultText");
			if (nullableTextValue(completion, "resultText") == null && legacyPrimary !== void 0) completion.resultText = legacyPrimary;
			if (nullableTextValue(completion, "fallbackResultText") == null && legacyFallback !== void 0) completion.fallbackResultText = legacyFallback;
			delete deliveryPayload?.frozenResultText;
			delete deliveryPayload?.fallbackFrozenResultText;
			delete pendingPayload?.frozenResultText;
			delete pendingPayload?.fallbackFrozenResultText;
			const primary = nullableTextValue(completion, "resultText");
			const fallback = nullableTextValue(completion, "fallbackResultText");
			updateRun.run(JSON.stringify(payload), pendingPayload ? JSON.stringify(pendingPayload) : row.pending_final_delivery_payload_json, typeof primary === "string" ? primary : null, typeof fallback === "string" ? fallback : null, row.run_id);
			const taskRunId = textField(payload, "taskRunId") ?? row.run_id;
			const terminalReply = normalizeAgentRunTerminalReplySnapshot(completion.terminalReply);
			const taskResult = selectLegacyRetainedTaskResult(completion, primary, fallback);
			if (updateTask && (taskResult || terminalReply)) {
				const retainedPrimary = primary?.trim() || null;
				updateTask.run(taskResult, taskRunId, retainedPrimary, retainedPrimary);
			}
		}
	};
	if (db.isTransaction) {
		repair();
		return;
	}
	runSqliteImmediateTransactionSync(db, repair);
}
/** Canonicalize shipped subagent rows whose pause/kill owner only wrote root terminal fields. */
function repairLegacySubagentExecutionPayloads(db) {
	if (!tableExists(db, "subagent_runs")) return;
	db.exec(`
    UPDATE subagent_runs
    SET payload_json = json_remove(
      CASE
        WHEN json_extract(payload_json, '$.pauseReason') = 'sessions_yield'
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
        THEN json_remove(json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt')
        ), '$.execution.outcome')
        WHEN (json_type(payload_json, '$.killReconciliation') = 'object'
          OR json_extract(payload_json, '$.endedReason') = 'subagent-killed')
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
          AND json_type(payload_json, '$.outcome') = 'object'
        THEN json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt'),
          '$.execution.outcome', json_extract(payload_json, '$.outcome')
        )
        ELSE payload_json
      END,
      '$.startedAt', '$.endedAt', '$.outcome'
    )
    WHERE json_valid(payload_json)
      AND (json_type(payload_json, '$.startedAt') IS NOT NULL
        OR json_type(payload_json, '$.endedAt') IS NOT NULL
        OR json_type(payload_json, '$.outcome') IS NOT NULL);
  `);
}
/** Canonicalize the shipped suspension reason before runtime hydrates subagent state. */
function repairLegacySubagentSuspensionReasons(db) {
	if (!tableExists(db, "subagent_runs")) return;
	db.exec(`
    UPDATE subagent_runs
    SET payload_json = json_set(payload_json, '$.delivery.suspendedReason', 'permanent_failure')
    WHERE json_valid(payload_json)
      AND json_extract(payload_json, '$.delivery.suspendedReason') = 'retry-limit';
  `);
}
function backfillAcpReplayEstimatedBytes(db) {
	if (!tableExists(db, "acp_replay_events") || !tableHasColumn(db, "acp_replay_events", "estimated_bytes")) return;
	const pendingEvent = db.prepare("SELECT 1 FROM acp_replay_events WHERE estimated_bytes = 0 LIMIT 1").get();
	const pendingSession = db.prepare("SELECT 1 FROM acp_replay_sessions WHERE estimated_bytes = 0 LIMIT 1").get();
	if (!pendingEvent && !pendingSession) return;
	db.exec(`
    UPDATE acp_replay_events
       SET estimated_bytes = length(session_id) + length(session_key) + length(update_json)
             + COALESCE(length(run_id), 0) + 32
     WHERE estimated_bytes = 0;
    UPDATE acp_replay_sessions
       SET estimated_bytes = length(session_id) + length(session_key) + length(cwd) + 32
             + COALESCE((SELECT SUM(e.estimated_bytes) FROM acp_replay_events e
                          WHERE e.session_id = acp_replay_sessions.session_id), 0)
     WHERE estimated_bytes = 0;
  `);
}
function backfillCronRunLogEntryJson(db) {
	if (!tableExists(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) return;
	const rows = db.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);
	for (const row of rows) update.run(JSON.stringify({
		ts: Number(row.ts),
		jobId: row.job_id,
		action: "finished"
	}), row.store_key, row.job_id, row.seq);
}
function parseJsonRecord(value) {
	return safeParseJsonRecord(value) ?? null;
}
function textField(record, key) {
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : null;
}
function numberField(record, key) {
	return asFiniteNumber(record[key]) ?? null;
}
function recordField(record, key) {
	return asNullableRecord(record[key]);
}
function jsonField(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function cronSessionTargetField(record) {
	const value = textField(record, "sessionTarget");
	if (!value) return null;
	return value === "main" || value === "isolated" || value === "current" || value.startsWith("session:") ? value : null;
}
function cronWakeModeField(record) {
	const value = textField(record, "wakeMode");
	return value === "now" || value === "next-heartbeat" ? value : null;
}
function booleanField(record, key) {
	const value = record[key];
	return typeof value === "boolean" ? value ? 1 : 0 : null;
}
function failureDestinationField(record, key) {
	if (!record || !Object.hasOwn(record, key)) return null;
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : "";
}
function migrateLegacyCronDeliveryThreadIds(db) {
	const rows = db.prepare(`SELECT store_key, job_id, job_json, delivery_thread_id
         FROM cron_jobs
        WHERE delivery_thread_id_type IS NULL`).all();
	const update = db.prepare(`UPDATE cron_jobs
        SET delivery_thread_id = ?, delivery_thread_id_type = ?
      WHERE store_key = ? AND job_id = ? AND delivery_thread_id_type IS NULL`);
	for (const row of rows) {
		const job = parseJsonRecord(row.job_json);
		const typed = (job ? recordField(job, "delivery") : null)?.threadId;
		if (row.delivery_thread_id === null) {
			if (typeof typed === "number" && Number.isFinite(typed)) update.run(String(typed), "number", row.store_key, row.job_id);
			continue;
		}
		const type = typeof typed === "number" && Number.isFinite(typed) && String(typed) === row.delivery_thread_id ? "number" : "string";
		update.run(row.delivery_thread_id, type, row.store_key, row.job_id);
	}
}
function backfillCronJobsFromJobJson(db) {
	if (!tableExists(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "schedule_kind") || !tableHasColumn(db, "cron_jobs", "payload_kind")) return;
	const rows = db.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE schedule_kind = 'manual'
           OR payload_kind = 'message'
           OR name = ''`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            delete_after_run = ?,
            created_at_ms = ?,
            agent_id = ?,
            session_key = ?,
            schedule_kind = ?,
            schedule_expr = ?,
            schedule_tz = ?,
            every_ms = ?,
            anchor_ms = ?,
            at = ?,
            stagger_ms = ?,
            session_target = ?,
            wake_mode = ?,
            payload_kind = ?,
            payload_message = ?,
            payload_model = ?,
            payload_fallbacks_json = ?,
            payload_thinking = ?,
            payload_timeout_seconds = ?,
            payload_allow_unsafe_external_content = ?,
            payload_external_content_source_json = ?,
            payload_light_context = ?,
            payload_tools_allow_json = ?,
            delivery_mode = ?,
            delivery_channel = ?,
            delivery_to = ?,
            delivery_thread_id = ?,
            delivery_account_id = ?,
            delivery_best_effort = ?,
            delivery_completion_mode = ?,
            delivery_completion_to = ?,
            failure_delivery_mode = ?,
            failure_delivery_channel = ?,
            failure_delivery_to = ?,
            failure_delivery_account_id = ?,
            failure_alert_disabled = ?,
            failure_alert_after = ?,
            failure_alert_channel = ?,
            failure_alert_to = ?,
            failure_alert_cooldown_ms = ?,
            failure_alert_include_skipped = ?,
            failure_alert_mode = ?,
            failure_alert_account_id = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);
	for (const row of rows) {
		const job = parseJsonRecord(row.job_json);
		if (!job) continue;
		const schedule = recordField(job, "schedule");
		const payload = recordField(job, "payload");
		const scheduleKind = textField(schedule ?? {}, "kind");
		const payloadKind = textField(payload ?? {}, "kind");
		const isAt = scheduleKind === "at" && textField(schedule ?? {}, "at");
		const isEvery = scheduleKind === "every" && numberField(schedule ?? {}, "everyMs") != null;
		const isCron = scheduleKind === "cron" && textField(schedule ?? {}, "expr");
		const isSystemEvent = payloadKind === "systemEvent" && textField(payload ?? {}, "text");
		const isAgentTurn = payloadKind === "agentTurn" && textField(payload ?? {}, "message");
		if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) continue;
		const fallbackTime = Number(row.updated_at) || 0;
		const delivery = recordField(job, "delivery");
		const completionDestination = delivery ? recordField(delivery, "completionDestination") : null;
		const failureDestination = delivery ? recordField(delivery, "failureDestination") : null;
		const failureAlertValue = job.failureAlert;
		const failureAlert = failureAlertValue && typeof failureAlertValue === "object" && !Array.isArray(failureAlertValue) ? failureAlertValue : null;
		update.run(textField(job, "name") ?? row.job_id, job.enabled === false ? 0 : 1, booleanField(job, "deleteAfterRun"), numberField(job, "createdAtMs") ?? fallbackTime, textField(job, "agentId"), textField(job, "sessionKey"), scheduleKind, isCron ? textField(schedule, "expr") : null, isCron ? textField(schedule, "tz") : null, isEvery ? numberField(schedule, "everyMs") : null, isEvery ? numberField(schedule, "anchorMs") : null, isAt ? textField(schedule, "at") : null, isCron ? numberField(schedule, "staggerMs") : null, cronSessionTargetField(job) ?? (payloadKind === "agentTurn" ? "isolated" : "main"), cronWakeModeField(job) ?? "now", payloadKind, isSystemEvent ? textField(payload, "text") : textField(payload, "message"), isAgentTurn ? textField(payload, "model") : null, isAgentTurn ? jsonField(payload.fallbacks) : null, isAgentTurn ? textField(payload, "thinking") : null, isAgentTurn ? numberField(payload, "timeoutSeconds") : null, isAgentTurn && typeof payload.allowUnsafeExternalContent === "boolean" ? payload.allowUnsafeExternalContent ? 1 : 0 : null, isAgentTurn ? jsonField(payload.externalContentSource) : null, isAgentTurn && typeof payload.lightContext === "boolean" ? payload.lightContext ? 1 : 0 : null, isAgentTurn ? jsonField(payload.toolsAllow) : null, delivery ? textField(delivery, "mode") : null, delivery ? textField(delivery, "channel") : null, delivery ? textField(delivery, "to") : null, delivery ? textField(delivery, "threadId") : null, delivery ? textField(delivery, "accountId") : null, delivery && typeof delivery.bestEffort === "boolean" ? delivery.bestEffort ? 1 : 0 : null, completionDestination ? textField(completionDestination, "mode") : null, completionDestination ? textField(completionDestination, "to") : null, failureDestinationField(failureDestination, "mode"), failureDestinationField(failureDestination, "channel"), failureDestinationField(failureDestination, "to"), failureDestinationField(failureDestination, "accountId"), failureAlertValue === false ? 1 : failureAlert ? 0 : null, failureAlert ? numberField(failureAlert, "after") : null, failureAlert ? textField(failureAlert, "channel") : null, failureAlert ? textField(failureAlert, "to") : null, failureAlert ? numberField(failureAlert, "cooldownMs") : null, failureAlert && typeof failureAlert.includeSkipped === "boolean" ? failureAlert.includeSkipped ? 1 : 0 : null, failureAlert ? textField(failureAlert, "mode") : null, failureAlert ? textField(failureAlert, "accountId") : null, numberField(job, "updatedAtMs") ?? fallbackTime, row.store_key, row.job_id);
	}
}
function metadataStringField(record, key) {
	return textField(record, key);
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
	if (!tableExists(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) return;
	compactLegacyDeliveryQueueFailures(db);
	const rows = db.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status = 'pending'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);
	for (const row of rows) {
		const entry = parseJsonRecord(row.entry_json);
		if (!entry) continue;
		const session = recordField(entry, "session");
		const route = recordField(entry, "route");
		const deliveryContext = recordField(entry, "deliveryContext");
		update.run(metadataStringField(entry, "kind"), metadataStringField(entry, "sessionKey") ?? (session ? metadataStringField(session, "key") : null), metadataStringField(entry, "channel") ?? (route ? metadataStringField(route, "channel") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "channel") : null), metadataStringField(entry, "to") ?? (route ? metadataStringField(route, "to") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "to") : null), metadataStringField(entry, "accountId") ?? (route ? metadataStringField(route, "accountId") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "accountId") : null), asSafeIntegerInRange(entry.retryCount, { min: 0 }) ?? 0, asSafeIntegerInRange(entry.lastAttemptAt, { min: 0 }) ?? null, metadataStringField(entry, "lastError"), metadataStringField(entry, "recoveryState"), asSafeIntegerInRange(entry.platformSendStartedAt, { min: 0 }) ?? null, row.queue_name, row.id);
	}
}
//#endregion
//#region src/state/openclaw-state-db-schema-additive.ts
const SECRET_STORE_SCHEMA_START = "CREATE TABLE IF NOT EXISTS secret_store_entries (";
const SECRET_STORE_SCHEMA_END = "ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;";
const MCP_OAUTH_PENDING_SCHEMA_START = "CREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (";
const MCP_OAUTH_PENDING_SCHEMA_END = "\n) STRICT;";
const DEVICE_PAIRING_JOIN_CODE_SCHEMA_START = "CREATE TABLE IF NOT EXISTS device_pairing_join_codes (";
const DEVICE_PAIRING_JOIN_CODE_SCHEMA_END = "\n) STRICT;";
function secretStoreSchemaSql() {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(SECRET_STORE_SCHEMA_START);
	const endMarkerStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf(SECRET_STORE_SCHEMA_END, start);
	if (!(start >= 0 && endMarkerStart >= start)) throw new Error("OpenClaw secret store schema marker is missing.");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, endMarkerStart + 81);
}
/** Lazily install the additive secret store table and index on first write. */
function ensureSecretStoreSchema(database) {
	database.exec(secretStoreSchemaSql());
	ensureColumn(database, "secret_store_entries", "allowed_hosts TEXT");
}
/** Lazily install durable MCP OAuth callback correlation on first feature use. */
function ensureMcpOAuthPendingSchema(database) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(MCP_OAUTH_PENDING_SCHEMA_START);
	const endMarkerStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf(MCP_OAUTH_PENDING_SCHEMA_END, start);
	if (start < 0 || endMarkerStart < start) throw new Error("OpenClaw MCP OAuth pending schema marker is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, endMarkerStart + 10));
}
/** Lazily install the additive device join-code table on first mint or redemption. */
function ensureDevicePairingJoinCodeSchema(database) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(DEVICE_PAIRING_JOIN_CODE_SCHEMA_START);
	const endMarkerStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf(DEVICE_PAIRING_JOIN_CODE_SCHEMA_END, start);
	if (start < 0 || endMarkerStart < start) throw new Error("OpenClaw device pairing join-code schema marker is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, endMarkerStart + 10));
}
function ensureAgentDeletionJournalSchema(database) {
	database.exec(`
    CREATE TABLE IF NOT EXISTS agent_deletion_journal (
      agent_id TEXT PRIMARY KEY,
      operation_id TEXT NOT NULL DEFAULT '',
      agent_dir TEXT NOT NULL,
      workspace_dir TEXT NOT NULL,
      sessions_dir TEXT NOT NULL,
      database_paths_json TEXT NOT NULL DEFAULT '[]',
      cleanup_paths_json TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      cleanup_completed INTEGER NOT NULL DEFAULT 0,
      delete_files INTEGER NOT NULL DEFAULT 1
    ) STRICT
  `);
}
function ensureAgentDatabaseLeaseSchema(database) {
	ensureAgentDeletionJournalSchema(database);
	database.exec(`
    CREATE TABLE IF NOT EXISTS agent_database_leases (
      lease_id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      path TEXT NOT NULL,
      owner_pid INTEGER NOT NULL,
      owner_start_time INTEGER,
      opened_at INTEGER NOT NULL
    ) STRICT
  `);
}
/**
* Same-version additive table, registered in LAZY_ADDITIVE_STATE_TABLES so
* existing v6 databases stay valid without it. Mirrors the canonical schema;
* a downgraded reader simply loses setup-completion reconciliation.
*/
function ensureDevicePairSetupCompletionSchema(database) {
	database.exec(`
    CREATE TABLE IF NOT EXISTS device_pair_setup_completions (
      setup_id TEXT NOT NULL PRIMARY KEY,
      device_id TEXT NOT NULL,
      device_name TEXT,
      access TEXT NOT NULL,
      completed_at_ms INTEGER NOT NULL,
      delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),
      retain_until_ms INTEGER NOT NULL
    ) STRICT
  `);
}
/** Lazily add setup correlation only when setup pairing first writes or consumes a token. */
function ensureDevicePairSetupBootstrapSchema(database) {
	ensureColumn(database, "device_bootstrap_tokens", "setup_id TEXT");
}
function resolveLegacyManagedImageRoot(recordJson) {
	if (typeof recordJson !== "string") return null;
	let record;
	try {
		record = JSON.parse(recordJson);
	} catch {
		return null;
	}
	if (!isRecord(record) || !isRecord(record.original)) return null;
	const mediaRoot = record.original.mediaRoot;
	if (typeof mediaRoot === "string" && mediaRoot.trim()) return path.resolve(mediaRoot);
	const originalPath = record.original.path;
	if (typeof originalPath !== "string" || !originalPath.trim()) return null;
	const resolvedOriginalPath = path.resolve(originalPath);
	return path.dirname(path.dirname(path.dirname(resolvedOriginalPath)));
}
function backfillLegacyManagedImageRoots(db) {
	const rows = db.prepare("SELECT attachment_id, record_json FROM managed_outgoing_image_records").all();
	const updateRoot = db.prepare("UPDATE managed_outgoing_image_records SET original_media_root = ? WHERE attachment_id = ?");
	const deleteRecord = db.prepare("DELETE FROM managed_outgoing_image_records WHERE attachment_id = ?");
	for (const row of rows) {
		const mediaRoot = resolveLegacyManagedImageRoot(row.record_json);
		if (mediaRoot) updateRoot.run(mediaRoot, row.attachment_id);
		else deleteRecord.run(row.attachment_id);
	}
}
function ensureWorkerSessionToolStateSchema(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (
      session_id TEXT NOT NULL PRIMARY KEY,
      environment_id TEXT NOT NULL,
      owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),
      placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),
      claim_id TEXT NOT NULL,
      run_id TEXT NOT NULL,
      tool_names_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
    ) STRICT;

    CREATE TABLE IF NOT EXISTS worker_session_tool_operations (
      source_session_id TEXT NOT NULL,
      source_claim_id TEXT NOT NULL,
      tool_call_id TEXT NOT NULL,
      tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),
      request_digest TEXT NOT NULL,
      operation_seed TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),
      child_session_key TEXT,
      result_json TEXT,
      gateway_instance_id TEXT NOT NULL,
      created_at_ms INTEGER NOT NULL,
      updated_at_ms INTEGER NOT NULL,
      PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),
      FOREIGN KEY (source_session_id)
        REFERENCES worker_session_placements(session_id) ON DELETE CASCADE
    ) STRICT;
  `);
}
function ensureAdditiveStateColumns(db) {
	ensureWorkerSessionToolStateSchema(db);
	for (const { columnName, dataType, tableName } of CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
	if (ensureColumn(db, "claw_package_refs", "updated_at_ms INTEGER NOT NULL DEFAULT 0")) db.exec("UPDATE claw_package_refs SET updated_at_ms = installed_at_ms;");
	ensureColumn(db, "claw_package_refs", "package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'");
	if (ensureColumn(db, "diagnostic_events", "sequence INTEGER NOT NULL DEFAULT 0")) db.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `);
	db.exec("DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;");
	ensureColumn(db, "worktrees", "provisioned_paths_json TEXT");
	ensureColumn(db, "node_host_config", "gateway_context_path TEXT");
	ensureColumn(db, "node_host_config", "installed_apps_sharing INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "apns_registrations", "relay_origin TEXT");
	ensureColumn(db, "device_pairing_pending", "refreshed_at_ms INTEGER");
	ensureColumn(db, "device_pairing_pending", "browser_origin TEXT");
	ensureColumn(db, "device_pairing_paired", "approved_via TEXT");
	ensureColumn(db, "device_pairing_paired", "browser_origin TEXT");
	ensureColumn(db, "device_pairing_paired", "operator_label TEXT");
	ensureColumn(db, "device_pairing_paired", "node_surface_json TEXT");
	ensureColumn(db, "device_pairing_paired", "pending_node_surface_json TEXT");
	ensureColumn(db, "cron_run_logs", "status TEXT");
	ensureColumn(db, "cron_run_logs", "error TEXT");
	ensureColumn(db, "cron_run_logs", "summary TEXT");
	ensureColumn(db, "cron_run_logs", "diagnostics_summary TEXT");
	ensureColumn(db, "cron_run_logs", "delivery_status TEXT");
	ensureColumn(db, "cron_run_logs", "delivery_error TEXT");
	ensureColumn(db, "cron_run_logs", "delivered INTEGER");
	ensureColumn(db, "cron_run_logs", "session_id TEXT");
	ensureColumn(db, "cron_run_logs", "session_key TEXT");
	ensureColumn(db, "cron_run_logs", "run_id TEXT");
	ensureColumn(db, "cron_run_logs", "run_at_ms INTEGER");
	ensureColumn(db, "cron_run_logs", "duration_ms INTEGER");
	ensureColumn(db, "cron_run_logs", "next_run_at_ms INTEGER");
	ensureColumn(db, "cron_run_logs", "model TEXT");
	ensureColumn(db, "cron_run_logs", "provider TEXT");
	ensureColumn(db, "cron_run_logs", "total_tokens INTEGER");
	ensureColumn(db, "cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'");
	ensureColumn(db, "cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0");
	backfillCronRunLogEntryJson(db);
	ensureColumn(db, "acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
	backfillAcpReplayEstimatedBytes(db);
	ensureColumn(db, "cron_jobs", "description TEXT");
	ensureColumn(db, "cron_jobs", "declaration_key TEXT");
	ensureColumn(db, "cron_jobs", "display_name TEXT");
	ensureColumn(db, "cron_jobs", "owner_agent_id TEXT");
	ensureColumn(db, "cron_jobs", "owner_session_key TEXT");
	ensureColumn(db, "cron_jobs", "name TEXT NOT NULL DEFAULT ''");
	ensureColumn(db, "cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1");
	ensureColumn(db, "cron_jobs", "delete_after_run INTEGER");
	ensureColumn(db, "cron_jobs", "created_at_ms INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "cron_jobs", "agent_id TEXT");
	ensureColumn(db, "cron_jobs", "session_key TEXT");
	ensureColumn(db, "cron_jobs", "schedule_kind TEXT NOT NULL DEFAULT 'manual'");
	ensureColumn(db, "cron_jobs", "schedule_expr TEXT");
	ensureColumn(db, "cron_jobs", "schedule_tz TEXT");
	ensureColumn(db, "cron_jobs", "every_ms INTEGER");
	ensureColumn(db, "cron_jobs", "anchor_ms INTEGER");
	ensureColumn(db, "cron_jobs", "at TEXT");
	ensureColumn(db, "cron_jobs", "stagger_ms INTEGER");
	ensureColumn(db, "cron_jobs", "session_target TEXT NOT NULL DEFAULT 'main'");
	ensureColumn(db, "cron_jobs", "wake_mode TEXT NOT NULL DEFAULT 'auto'");
	ensureColumn(db, "cron_jobs", "trigger_script TEXT");
	ensureColumn(db, "cron_jobs", "trigger_once INTEGER");
	ensureColumn(db, "cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'");
	ensureColumn(db, "cron_jobs", "payload_message TEXT");
	ensureColumn(db, "cron_jobs", "payload_model TEXT");
	ensureColumn(db, "cron_jobs", "payload_fallbacks_json TEXT");
	ensureColumn(db, "cron_jobs", "payload_thinking TEXT");
	ensureColumn(db, "cron_jobs", "payload_timeout_seconds INTEGER");
	ensureColumn(db, "cron_jobs", "payload_allow_unsafe_external_content INTEGER");
	ensureColumn(db, "cron_jobs", "payload_external_content_source_json TEXT");
	ensureColumn(db, "cron_jobs", "payload_light_context INTEGER");
	ensureColumn(db, "cron_jobs", "payload_tools_allow_json TEXT");
	ensureColumn(db, "cron_jobs", "payload_tools_allow_is_default INTEGER");
	ensureColumn(db, "cron_jobs", "delivery_mode TEXT");
	ensureColumn(db, "cron_jobs", "delivery_channel TEXT");
	ensureColumn(db, "cron_jobs", "delivery_to TEXT");
	ensureColumn(db, "cron_jobs", "delivery_thread_id TEXT");
	ensureColumn(db, "cron_jobs", "delivery_account_id TEXT");
	ensureColumn(db, "cron_jobs", "delivery_best_effort INTEGER");
	ensureColumn(db, "cron_jobs", "delivery_completion_mode TEXT");
	ensureColumn(db, "cron_jobs", "delivery_completion_to TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_mode TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_channel TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_to TEXT");
	ensureColumn(db, "cron_jobs", "failure_delivery_account_id TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_disabled INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_after INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_channel TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_to TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_cooldown_ms INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_include_skipped INTEGER");
	ensureColumn(db, "cron_jobs", "failure_alert_mode TEXT");
	ensureColumn(db, "cron_jobs", "failure_alert_account_id TEXT");
	ensureColumn(db, "cron_jobs", "next_run_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "running_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "last_run_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "last_run_status TEXT");
	ensureColumn(db, "cron_jobs", "last_error TEXT");
	ensureColumn(db, "cron_jobs", "last_duration_ms INTEGER");
	ensureColumn(db, "cron_jobs", "consecutive_errors INTEGER");
	ensureColumn(db, "cron_jobs", "consecutive_skipped INTEGER");
	ensureColumn(db, "cron_jobs", "schedule_error_count INTEGER");
	ensureColumn(db, "cron_jobs", "last_delivery_status TEXT");
	ensureColumn(db, "cron_jobs", "last_delivery_error TEXT");
	ensureColumn(db, "cron_jobs", "last_delivered INTEGER");
	ensureColumn(db, "cron_jobs", "last_failure_alert_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'");
	ensureColumn(db, "cron_jobs", "runtime_updated_at_ms INTEGER");
	ensureColumn(db, "cron_jobs", "schedule_identity TEXT");
	ensureColumn(db, "cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0");
	backfillCronJobsFromJobJson(db);
	if (ensureColumn(db, "cron_jobs", "delivery_thread_id_type TEXT")) migrateLegacyCronDeliveryThreadIds(db);
	ensureColumn(db, "sandbox_registry_entries", "session_key TEXT");
	ensureColumn(db, "sandbox_registry_entries", "backend_id TEXT");
	ensureColumn(db, "sandbox_registry_entries", "runtime_label TEXT");
	ensureColumn(db, "sandbox_registry_entries", "image TEXT");
	ensureColumn(db, "sandbox_registry_entries", "created_at_ms INTEGER");
	ensureColumn(db, "sandbox_registry_entries", "last_used_at_ms INTEGER");
	ensureColumn(db, "sandbox_registry_entries", "config_label_kind TEXT");
	ensureColumn(db, "sandbox_registry_entries", "config_hash TEXT");
	ensureColumn(db, "sandbox_registry_entries", "cdp_port INTEGER");
	ensureColumn(db, "sandbox_registry_entries", "no_vnc_port INTEGER");
	ensureColumn(db, "delivery_queue_entries", "entry_kind TEXT");
	ensureColumn(db, "delivery_queue_entries", "session_key TEXT");
	ensureColumn(db, "delivery_queue_entries", "channel TEXT");
	ensureColumn(db, "delivery_queue_entries", "target TEXT");
	ensureColumn(db, "delivery_queue_entries", "account_id TEXT");
	ensureColumn(db, "delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0");
	ensureColumn(db, "delivery_queue_entries", "last_attempt_at INTEGER");
	ensureColumn(db, "delivery_queue_entries", "last_error TEXT");
	ensureColumn(db, "delivery_queue_entries", "recovery_state TEXT");
	ensureColumn(db, "delivery_queue_entries", "platform_send_started_at INTEGER");
	backfillDeliveryQueueEntriesFromEntryJson(db);
	if (ensureColumn(db, "managed_outgoing_image_records", "original_media_root TEXT NOT NULL DEFAULT ''")) backfillLegacyManagedImageRoots(db);
	ensureColumn(db, "managed_outgoing_image_records", "agent_id TEXT");
	ensureColumn(db, "managed_outgoing_image_records", "cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))");
	ensureColumn(db, "current_conversation_bindings", "target_agent_id TEXT NOT NULL DEFAULT 'main'");
	ensureColumn(db, "current_conversation_bindings", "target_session_id TEXT");
	ensureColumn(db, "current_conversation_bindings", "conversation_kind TEXT NOT NULL DEFAULT 'channel'");
	ensureColumn(db, "device_bootstrap_tokens", "pending_profile_json TEXT");
	ensureColumn(db, "gateway_restart_handoff", "restart_trace_started_at INTEGER");
	ensureColumn(db, "gateway_restart_handoff", "restart_trace_last_at INTEGER");
	ensureColumn(db, "gateway_restart_intent", "reason TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
	ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
	ensureColumn(db, "gateway_boot_lifecycle", "startup_reason TEXT");
	ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_mode TEXT");
	ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_key_id TEXT");
	ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER");
	ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_threshold INTEGER");
	ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_verified_at TEXT");
	if (ensureColumn(db, "task_runs", "requester_agent_id TEXT")) repairLegacyTaskAgentAttribution(db);
	repairLegacyTaskDeliveryStatuses(db);
	ensureColumn(db, "task_runs", "tool_use_count INTEGER");
	ensureColumn(db, "task_runs", "last_tool_name TEXT");
	ensureColumn(db, "task_runs", "detail_json TEXT");
	ensureColumn(db, "subagent_runs", "task_name TEXT");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_status TEXT");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_attempt_count INTEGER");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_replay_count INTEGER");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_next_attempt_at INTEGER");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_batch_run_ids_json TEXT");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_last_error TEXT");
	ensureColumn(db, "subagent_runs", "requester_settle_wake_retire_after INTEGER");
	ensureColumn(db, "subagent_runs", "swarm_group_id TEXT");
	ensureColumn(db, "subagent_runs", "swarm_collector INTEGER");
	ensureColumn(db, "subagent_runs", "swarm_output_schema_json TEXT");
	ensureColumn(db, "subagent_runs", "swarm_completion_status TEXT");
	ensureColumn(db, "subagent_runs", "swarm_structured_json TEXT");
	ensureColumn(db, "subagent_runs", "swarm_schema_error TEXT");
	ensureColumn(db, "subagent_runs", "swarm_usage_json TEXT");
	repairLegacySubagentSuspensionReasons(db);
	repairLegacySubagentExecutionPayloads(db);
	repairLegacySubagentRetainedResults(db);
	ensureColumn(db, "worker_environments", "bootstrap_bundle_hash TEXT");
	ensureColumn(db, "worker_environments", "bootstrap_openclaw_version TEXT");
	ensureColumn(db, "worker_environments", "bootstrap_protocol_features_json TEXT");
	ensureColumn(db, "worker_environments", "bootstrap_install_kind TEXT");
	ensureColumn(db, "worker_environments", "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)");
	ensureColumn(db, "worker_environments", "ssh_host_key TEXT");
	ensureColumn(db, "worker_workspace_pending_results", "staged_result_ref TEXT");
	ensureColumn(db, "worker_environments", "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))");
	ensureOperatorApprovalResolutionRefs(db);
}
//#endregion
//#region src/state/openclaw-state-db-schema-migration-required.ts
const GATEWAY_STATE_SCHEMA_MIGRATION_REQUIRED_REASON = "gateway.state_schema_migration_required";
var OpenClawStateDatabaseSchemaMigrationRequiredError = class extends Error {
	constructor(kind, pathname) {
		super(`OpenClaw state database schema migration required (${kind}) at ${pathname}; run openclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.code = GATEWAY_STATE_SCHEMA_MIGRATION_REQUIRED_REASON;
		this.name = "OpenClawStateDatabaseSchemaMigrationRequiredError";
	}
};
const STATE_SCHEMA_MIGRATION_REQUIRED_MESSAGE = /^OpenClaw state database schema migration required \((agent-databases-composite-primary-key|audit-events-v2)\) at (.+); run openclaw doctor --fix to migrate it\.$/u;
function parseStateSchemaMigrationRequiredMessage(message) {
	if (typeof message !== "string") return;
	const match = STATE_SCHEMA_MIGRATION_REQUIRED_MESSAGE.exec(message);
	const kind = match?.[1];
	const pathname = match?.[2];
	if (!kind || !pathname) return;
	return new OpenClawStateDatabaseSchemaMigrationRequiredError(kind, pathname);
}
function findOpenClawStateDatabaseSchemaMigrationRequiredError(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		if (current instanceof OpenClawStateDatabaseSchemaMigrationRequiredError) return current;
		const errorLike = current;
		const parsed = parseStateSchemaMigrationRequiredMessage(errorLike.message);
		if (parsed) return parsed;
		seen.add(current);
		current = errorLike.cause;
	}
}
//#endregion
//#region src/state/session-watch-cursor-provenance.ts
const SESSION_WATCH_PROVENANCE_EXPLICIT = "explicit";
const SESSION_WATCH_PROVENANCE_AMBIENT_GROUP = "ambient-group";
//#endregion
//#region src/state/openclaw-state-db-session-watch-migration.ts
const SESSION_WATCH_PROVENANCE_SCHEMA_VERSION = 4;
const LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX = "ambient-group-watch:";
const SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
function getSessionWatchCursorKysely(db) {
	return getNodeSqliteKysely(db);
}
function hasLegacyAmbientWatchSentinels(db) {
	if (!tableExists(db, "session_watch_cursors")) return false;
	return executeSqliteQueryTakeFirstSync(db, getSessionWatchCursorKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`).limit(1)) !== void 0;
}
function needsSessionWatchCursorProvenanceMigration(db, userVersion) {
	if (!tableExists(db, "session_watch_cursors")) return false;
	return userVersion < SESSION_WATCH_PROVENANCE_SCHEMA_VERSION || !tableHasColumn(db, "session_watch_cursors", "provenance") || hasLegacyAmbientWatchSentinels(db);
}
function decodeLegacyAmbientWatchMarkerKey(markerKey) {
	const encoded = markerKey.slice(20);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function migrateSessionWatchCursorProvenance(db) {
	if (!tableExists(db, "session_watch_cursors")) return {
		addedColumn: false,
		migratedAmbientWatches: 0,
		removedLegacySentinels: 0
	};
	const addedColumn = ensureColumn(db, "session_watch_cursors", SESSION_WATCH_PROVENANCE_COLUMN_SQL);
	const kysely = getSessionWatchCursorKysely(db);
	const legacyMarkers = executeSqliteQuerySync(db, kysely.selectFrom("session_watch_cursors").select([
		"watcher_session_key",
		"target_session_key",
		"updated_at"
	]).where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`)).rows;
	let migratedAmbientWatches = 0;
	for (const marker of legacyMarkers) {
		const watcherSessionKey = decodeLegacyAmbientWatchMarkerKey(marker.watcher_session_key);
		if (watcherSessionKey) {
			const watch = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_watch_cursors").select("updated_at").where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key));
			if (watch) {
				const promoted = executeSqliteQuerySync(db, kysely.updateTable("session_watch_cursors").set({
					provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP,
					updated_at: Math.max(watch.updated_at, marker.updated_at)
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key));
				migratedAmbientWatches += Number(promoted.numAffectedRows ?? 0n);
			}
		}
		executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("watcher_session_key", "=", marker.watcher_session_key).where("target_session_key", "=", marker.target_session_key));
	}
	return {
		addedColumn,
		migratedAmbientWatches,
		removedLegacySentinels: legacyMarkers.length
	};
}
//#endregion
//#region src/state/openclaw-state-db-schema-repair.ts
function dropLegacyStateTables(db) {
	const transientHistoryTable = ["database", "verifications"].join("_");
	db.exec(`DROP TABLE IF EXISTS ${transientHistoryTable};`);
	db.exec("DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;");
}
const RETIRED_COMMITMENTS_SCHEMA_SQL = `
CREATE TABLE commitments (
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
) STRICT;
CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);
CREATE INDEX idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);
CREATE INDEX idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);
`;
const SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL = `
CREATE TABLE commitments (
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
);
CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);
`;
const RETIRED_COMMITMENTS_INDEX_FINGERPRINTS = new Map(getCanonicalSqliteNamedIndexContracts(RETIRED_COMMITMENTS_SCHEMA_SQL).map(({ fingerprint, name }) => [name, JSON.stringify(fingerprint)]));
const RETIRED_COMMITMENTS_SCHEMA_COMPATIBILITY = {
	allowedColumnDefinitions: {
		"commitments.attempts": ["attempts INTEGER NOT NULL DEFAULT 0"],
		"commitments.confidence": ["confidence REAL NOT NULL DEFAULT 0"],
		"commitments.created_at_ms": ["created_at_ms INTEGER NOT NULL DEFAULT 0"],
		"commitments.dedupe_key": ["dedupe_key TEXT NOT NULL DEFAULT ''"],
		"commitments.due_timezone": ["due_timezone TEXT NOT NULL DEFAULT 'UTC'"],
		"commitments.kind": ["kind TEXT NOT NULL DEFAULT 'followup'"],
		"commitments.reason": ["reason TEXT NOT NULL DEFAULT ''"],
		"commitments.sensitivity": ["sensitivity TEXT NOT NULL DEFAULT 'normal'"],
		"commitments.source": ["source TEXT NOT NULL DEFAULT 'unknown'"],
		"commitments.suggested_text": ["suggested_text TEXT NOT NULL DEFAULT ''"]
	},
	allowedMissingColumns: [
		"commitments.account_id",
		"commitments.recipient_id",
		"commitments.thread_id",
		"commitments.sender_id",
		"commitments.kind",
		"commitments.sensitivity",
		"commitments.source",
		"commitments.reason",
		"commitments.suggested_text",
		"commitments.dedupe_key",
		"commitments.confidence",
		"commitments.due_timezone",
		"commitments.source_message_id",
		"commitments.source_run_id",
		"commitments.created_at_ms",
		"commitments.attempts",
		"commitments.last_attempt_at_ms",
		"commitments.sent_at_ms",
		"commitments.dismissed_at_ms",
		"commitments.snoozed_until_ms",
		"commitments.expired_at_ms"
	],
	allowedMissingIndexes: [...RETIRED_COMMITMENTS_INDEX_FINGERPRINTS.keys()]
};
function hasSupportedRetiredCommitmentsSchema(db, schemaSql, compatibility) {
	if (collectSqliteSchemaIssues(db, schemaSql, compatibility).length > 0) return false;
	return db.prepare(`SELECT type, name
           FROM sqlite_schema
          WHERE type IN ('index', 'trigger')
            AND tbl_name = 'commitments'
            AND sql IS NOT NULL
          ORDER BY type, name`).all().every((object) => object.type === "index" && JSON.stringify(collectSqliteNamedIndexContract(db, object.name)) === RETIRED_COMMITMENTS_INDEX_FINGERPRINTS.get(object.name));
}
function assertRecognizedRetiredCommitmentsSchema(db) {
	if (hasRecognizedRetiredCommitmentsSchema(db)) return;
	assertSqliteSchemaContains(db, "retired OpenClaw commitments schema", RETIRED_COMMITMENTS_SCHEMA_SQL, RETIRED_COMMITMENTS_SCHEMA_COMPATIBILITY);
	throw new Error("Retired OpenClaw commitments schema has unsupported additional indexes; refusing destructive migration.");
}
function hasRecognizedRetiredCommitmentsSchema(db) {
	return hasSupportedRetiredCommitmentsSchema(db, RETIRED_COMMITMENTS_SCHEMA_SQL, RETIRED_COMMITMENTS_SCHEMA_COMPATIBILITY) || hasSupportedRetiredCommitmentsSchema(db, SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL, RETIRED_COMMITMENTS_SCHEMA_COMPATIBILITY);
}
function assertNoRetiredCommitmentsForeignKeys(db) {
	const tables = db.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND name <> 'commitments'
        ORDER BY name`).all();
	for (const table of tables) if (db.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(table.name)})`).all().some((foreignKey) => typeof foreignKey.table === "string" && foreignKey.table.toLowerCase() === "commitments")) throw new Error(`Retired OpenClaw commitments schema is referenced by table ${table.name}; refusing destructive migration.`);
}
function collectRetainedSchemaSql(db) {
	return new Map(db.prepare(`SELECT type, name, sql
             FROM sqlite_schema
            WHERE type IN ('trigger', 'view')
              AND tbl_name <> 'commitments'
              AND sql IS NOT NULL
            ORDER BY type, name`).all().map((object) => [`${object.type}:${object.name}`, object.sql]));
}
function assertNoRetiredCommitmentsSchemaDependencies(db) {
	const probeTable = "__openclaw_retired_commitments_probe";
	if (tableExists(db, probeTable)) throw new Error(`OpenClaw state database already contains ${probeTable}; refusing destructive migration.`);
	const before = collectRetainedSchemaSql(db);
	const savepoint = "openclaw_probe_commitments_dependencies";
	db.exec(`SAVEPOINT ${savepoint};`);
	let changedObject;
	try {
		db.exec(`ALTER TABLE commitments RENAME TO ${quoteSqliteIdentifier(probeTable)};`);
		const after = collectRetainedSchemaSql(db);
		changedObject = [...before].find(([object, sql]) => after.get(object) !== sql)?.[0];
	} catch (error) {
		db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
		throw new Error("Could not prove retained SQLite views and triggers independent of commitments; refusing destructive migration.", { cause: error });
	}
	db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
	if (changedObject) {
		const [type, name] = changedObject.split(":", 2);
		throw new Error(`Retired OpenClaw commitments schema is referenced by ${type} ${name}; refusing destructive migration.`);
	}
}
function assertVirtualTablesUsable(db, phase) {
	const virtualTables = db.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND lower(sql) LIKE 'create virtual table%'
        ORDER BY name`).all();
	for (const table of virtualTables) try {
		db.prepare(`SELECT * FROM ${quoteSqliteIdentifier(table.name)} LIMIT 1`).all();
	} catch (error) {
		throw new Error(`SQLite virtual table ${table.name} is unusable ${phase} commitments retirement.`, { cause: error });
	}
}
function migrateRetiredCommitmentsSchema(db, previousVersion) {
	if (previousVersion >= 7) return false;
	if (!tableExists(db, "commitments")) return false;
	assertRecognizedRetiredCommitmentsSchema(db);
	assertNoRetiredCommitmentsForeignKeys(db);
	assertNoRetiredCommitmentsSchemaDependencies(db);
	assertVirtualTablesUsable(db, "before");
	const savepoint = "openclaw_retire_commitments_v7";
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		db.exec("DROP TABLE commitments;");
		assertVirtualTablesUsable(db, "after");
		db.exec(`RELEASE ${savepoint};`);
		return true;
	} catch (error) {
		db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
		throw error;
	}
}
function migrateWorkerPlacementExecutionModeSchema(db, previousVersion) {
	if (previousVersion >= 8 || !tableExists(db, "worker_session_placements")) return false;
	for (const definition of [
		"execution_mode TEXT",
		"terminal_reason TEXT",
		"terminal_at_ms INTEGER"
	]) {
		const column = definition.split(" ", 1)[0];
		if (!tableHasColumn(db, "worker_session_placements", column)) db.exec(`ALTER TABLE worker_session_placements ADD COLUMN ${definition};`);
	}
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS worker_session_placements (");
	const end = start >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start) : -1;
	if (start < 0 || end < 0) throw new Error("Canonical worker placement schema block is missing");
	const placementSchema = OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10);
	const canonical = openNodeSqliteDatabase(":memory:");
	let canonicalColumns;
	try {
		canonical.exec(placementSchema);
		canonicalColumns = canonical.prepare("PRAGMA table_xinfo(worker_session_placements)").all().filter((column) => column.hidden === 0).map((column) => column.name);
	} finally {
		canonical.close();
	}
	const currentColumns = db.prepare("PRAGMA table_xinfo(worker_session_placements)").all().filter((column) => column.hidden === 0).map((column) => column.name);
	const expected = new Set(canonicalColumns);
	if (currentColumns.length !== canonicalColumns.length || currentColumns.some((column) => !expected.has(column))) throw new Error("OpenClaw v7 worker placement columns are not canonical");
	if (db.prepare(`SELECT type, name
         FROM sqlite_schema
        WHERE tbl_name = 'worker_session_placements'
          AND type IN ('index', 'trigger')
          AND sql IS NOT NULL
          AND name NOT IN (
            'idx_worker_session_placements_session_key',
            'idx_worker_session_placements_reconcile'
          )`).all().length > 0) throw new Error("OpenClaw v7 worker placement schema has unsupported attached objects");
	const migrationTable = "worker_session_placements_migration_v8";
	if (tableExists(db, migrationTable)) throw new Error(`OpenClaw worker placement migration table already exists: ${migrationTable}`);
	const migrationSchema = placementSchema.replace("CREATE TABLE IF NOT EXISTS worker_session_placements", `CREATE TABLE ${migrationTable}`);
	const columns = canonicalColumns.map(quoteSqliteIdentifier).join(", ");
	db.exec(migrationSchema);
	db.exec(`INSERT INTO ${migrationTable} (${columns}) SELECT ${columns} FROM worker_session_placements;`);
	db.exec("DROP TABLE worker_session_placements;");
	db.exec(`ALTER TABLE ${migrationTable} RENAME TO worker_session_placements;`);
	return true;
}
function hasCanonicalAgentDatabasesPrimaryKey(db) {
	if (!tableExists(db, "agent_databases")) return true;
	const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
	return primaryKey.length === 2 && primaryKey[0] === "agent_id" && primaryKey[1] === "path";
}
function canRepairAgentDatabasesPrimaryKey(db) {
	if (!tableExists(db, "agent_databases")) return false;
	return [
		"agent_id",
		"path",
		"schema_version",
		"last_seen_at",
		"size_bytes"
	].every((column) => tableHasColumn(db, "agent_databases", column));
}
function repairAgentDatabasesCompositePrimaryKey(db) {
	if (hasCanonicalAgentDatabasesPrimaryKey(db) || !canRepairAgentDatabasesPrimaryKey(db)) return false;
	db.exec(`
    DROP TABLE IF EXISTS agent_databases_migration_new;
    CREATE TABLE agent_databases_migration_new (
      agent_id TEXT NOT NULL,
      path TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      size_bytes INTEGER,
      PRIMARY KEY (agent_id, path)
    );
    INSERT OR REPLACE INTO agent_databases_migration_new (
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    )
    SELECT
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    FROM agent_databases
    WHERE agent_id IS NOT NULL AND path IS NOT NULL;
    DROP TABLE agent_databases;
    ALTER TABLE agent_databases_migration_new RENAME TO agent_databases;
  `);
	return true;
}
function repairLegacyGatewayRestartHandoffsForStrictMigration(db) {
	if (!tableExists(db, "gateway_restart_handoff")) return;
	db.prepare("DELETE FROM gateway_restart_handoff WHERE expires_at <= ?").run(Date.now());
	db.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `);
}
function markCurrentStateSchemaVersion(db, options = {}) {
	if (!tableExists(db, "audit_events")) return;
	db.exec(`PRAGMA user_version = 8;`);
	if (tableExists(db, "schema_meta") && [
		"meta_key",
		"schema_version",
		"updated_at"
	].every((column) => tableHasColumn(db, "schema_meta", column))) {
		const now = Date.now();
		if (options.createMetadataIfMissing) {
			db.prepare(`INSERT INTO schema_meta (
           meta_key, role, schema_version, agent_id, app_version, created_at, updated_at
         ) VALUES ('primary', 'global', ?, NULL, NULL, ?, ?)
         ON CONFLICT(meta_key) DO UPDATE SET
           schema_version = excluded.schema_version,
           updated_at = excluded.updated_at`).run(8, now, now);
			return;
		}
		db.prepare("UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary'").run(8, now);
	}
}
function assertCanonicalStateSchemaShape(db, pathname) {
	assertCanonicalOperatorApprovalKinds(db, pathname);
	if (!hasCanonicalAgentDatabasesPrimaryKey(db)) {
		if (canRepairAgentDatabasesPrimaryKey(db)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("agent-databases-composite-primary-key", pathname);
		throw new Error(`OpenClaw state database ${pathname} has a noncanonical agent database registry schema that cannot be repaired automatically; restore the canonical agent_databases shape before retrying.`);
	}
	if (!hasCanonicalAuditEventsSchema(db)) {
		if (canRepairLegacyAuditEventsSchema(db)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("audit-events-v2", pathname);
		throw new Error(`OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`);
	}
}
function detectOpenClawStateDatabaseSchemaMigrations(options = {}) {
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return [];
	const db = openNodeSqliteDatabase(pathname, { readOnly: true });
	try {
		return detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname);
	} finally {
		db.close();
	}
}
/**
* Detect migrations against a caller-owned handle.
*
* Registry discovery runs this per lookup while already holding a state
* connection; opening a second one there made reads scale with row count.
*/
function detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname) {
	const migrations = [];
	const userVersion = readSqliteUserVersion(db);
	if (userVersion < 8 && tableExists(db, "commitments") && hasRecognizedRetiredCommitmentsSchema(db)) migrations.push({
		kind: "commitments-retirement-v7",
		path: pathname
	});
	if (userVersion === 7 && tableExists(db, "worker_session_placements")) migrations.push({
		kind: "worker-placement-execution-mode-v8",
		path: pathname
	});
	if (!hasCanonicalAgentDatabasesPrimaryKey(db)) migrations.push({
		kind: "agent-databases-composite-primary-key",
		path: pathname
	});
	if (!hasCanonicalAuditEventsSchema(db)) migrations.push({
		kind: "audit-events-v2",
		path: pathname
	});
	if (tableExists(db, "audit_events") && userVersion < 3) migrations.push({
		kind: "strict-tables-v3",
		path: pathname
	});
	if (needsSessionWatchCursorProvenanceMigration(db, userVersion)) migrations.push({
		kind: "session-watch-cursor-provenance-v4",
		path: pathname
	});
	migrations.push(...detectOperatorApprovalSchemaMigration(db, pathname));
	return migrations;
}
//#endregion
//#region src/state/openclaw-state-ownership.ts
const STATE_SUPERVISION_KEY = "gateway.supervision";
const MAX_OWNERSHIP_TIMESTAMP_MS = 864e13;
const MANAGER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
var OpenClawStateOwnershipError = class extends Error {};
var OpenClawStateOwnershipMetadataError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, message) {
		super(`OpenClaw shared state ownership metadata is invalid at ${databasePath}: ${message}. Repair it with OPENCLAW_SUPERVISOR_MODE=external openclaw database ownership claim --manager <manager-id>.`);
		this.databasePath = databasePath;
		this.name = "OpenClawStateOwnershipMetadataError";
	}
};
var OpenClawStateExternalOwnershipError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, managerId) {
		super(`OpenClaw shared state database ${databasePath} is externally supervised by ${managerId}. Use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external for writable operations.`);
		this.databasePath = databasePath;
		this.managerId = managerId;
		this.name = "OpenClawStateExternalOwnershipError";
	}
};
function normalizeOpenClawStateManagerId(managerId) {
	const normalized = managerId.trim();
	if (!MANAGER_ID_PATTERN.test(normalized)) throw new Error("External state ownership manager id must be a 1-128 character ASCII identifier.");
	return normalized;
}
function parseExternalOwnership(valueJson, databasePath) {
	let value;
	try {
		value = JSON.parse(valueJson);
	} catch {
		throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not valid JSON");
	}
	const record = isRecord(value) ? value : void 0;
	const keys = record ? Object.keys(record).toSorted().join(",") : "";
	const managerId = record?.managerId;
	const claimedAt = record?.claimedAt;
	if (keys !== "claimedAt,managerId,mode,version" || record?.version !== 1 || record?.mode !== "external" || typeof managerId !== "string" || !MANAGER_ID_PATTERN.test(managerId) || typeof claimedAt !== "number" || !Number.isSafeInteger(claimedAt) || claimedAt < 0 || claimedAt > MAX_OWNERSHIP_TIMESTAMP_MS) throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value does not match the version 1 external ownership contract");
	return {
		version: 1,
		mode: "external",
		managerId,
		claimedAt
	};
}
/** Inspect the reserved ownership row without entering the shared-state lifecycle. */
function inspectOpenClawStateOwnershipFromDatabase(database, databasePath) {
	if (!tableExists(database, "config_machine_state")) return null;
	const row = database.prepare("SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1").get(STATE_SUPERVISION_KEY);
	if (!row) return null;
	if (typeof row.value_json !== "string") throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not text");
	return parseExternalOwnership(row.value_json, databasePath);
}
function inspectOwnershipThroughConnection(location, databasePath) {
	const database = openNodeSqliteDatabase(location, { readOnly: true });
	try {
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;`);
		return inspectOpenClawStateOwnershipFromDatabase(database, databasePath);
	} finally {
		database.close();
	}
}
function inspectJournalAwarePublicOwnership(databasePath) {
	const prepared = prepareSqliteReadOnlyLocationSync(databasePath);
	try {
		return inspectOwnershipThroughConnection(prepared.location, databasePath);
	} finally {
		prepared.cleanup();
	}
}
function inspectOpenClawStateOwnershipAtPathWhileCoordinatorHeld(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	if (!existsSync(resolvedPath)) return null;
	const database = openNodeSqliteDatabase(resolvedPath);
	try {
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; PRAGMA trusted_schema = OFF;`);
		return inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
	} finally {
		database.close();
	}
}
function resolveOpenClawStateOwnershipCoordinatorPath(databasePath) {
	const canonicalDatabasePath = resolvePathViaExistingAncestorSync(databasePath);
	const stateDir = resolveOpenClawStateDirForDatabasePath(canonicalDatabasePath);
	return path.join(resolveGatewayLockDir(stateDir), `state-ownership.${sha256HexPrefixCore(canonicalDatabasePath, 8)}.lock.sqlite`);
}
function acquireOpenClawStateOwnershipCoordinator(databasePath) {
	const coordinatorPath = resolveOpenClawStateOwnershipCoordinatorPath(databasePath);
	ensurePrivateSqliteCoordinatorDirectory(path.dirname(coordinatorPath), "state ownership coordinator");
	const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
	if (!coordinator) throw new SqliteCoordinatorError("another OpenClaw process is changing shared state ownership");
	return coordinator;
}
function runWithOpenClawStateOwnershipCoordinator(databasePath, operationLabel, operation) {
	return runWithSqliteCoordinator(acquireOpenClawStateOwnershipCoordinator(databasePath), operationLabel, operation);
}
/** Inspect one resolved state database path without mutating its state tree. */
function inspectOpenClawStateOwnershipAtPath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	if (!existsSync(resolvedPath)) return null;
	return inspectJournalAwarePublicOwnership(resolvedPath);
}
function assertOwnershipAllowsWrite(status, databasePath, env) {
	if (status && !isGatewayExternallySupervised(env)) throw new OpenClawStateExternalOwnershipError(databasePath, status.managerId);
}
/** Fence and hold one path-based mutation until its main-file preamble is complete. */
function acquireOpenClawStateWriteAccess(options) {
	const resolvedPath = path.resolve(options.databasePath);
	const access = acquireOpenClawStateOwnershipCoordinator(resolvedPath);
	try {
		quarantineOrphanedSqliteSidecars(resolvedPath);
		assertOwnershipAllowsWrite(inspectOpenClawStateOwnershipAtPathWhileCoordinatorHeld(resolvedPath), resolvedPath, options.env ?? process.env);
		return access;
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			access.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], "state ownership inspection and coordinator release both failed", operationError);
		throw operationError;
	}
}
function runWithOpenClawStateWriteAccess(options, operationLabel, operation) {
	return runWithSqliteCoordinator(acquireOpenClawStateWriteAccess(options), operationLabel, operation);
}
/** Check path-based write admission without retaining the coordinator past this call. */
async function assertOpenClawStateWriteAllowedAtPath(options) {
	const databasePath = path.resolve(options.databasePath);
	quarantineOrphanedSqliteSidecars(databasePath);
	if (!existsSync(databasePath)) return;
	const env = options.env ?? process.env;
	if (isGatewayExternallySupervised(env)) {
		runWithOpenClawStateWriteAccess({
			...options,
			databasePath
		}, "shared state write admission", () => void 0);
		return;
	}
	const prepared = await prepareSqliteReadOnlyLocation(databasePath);
	try {
		assertOwnershipAllowsWrite(inspectOwnershipThroughConnection(prepared.location, databasePath), databasePath, env);
	} finally {
		prepared.cleanup();
	}
}
/** Fence shared-state writes once an external manager has claimed ownership. */
function assertOpenClawStateWriteAllowed(options) {
	const resolvedPath = path.resolve(options.databasePath);
	assertOwnershipAllowsWrite(inspectOpenClawStateOwnershipFromDatabase(options.database, resolvedPath), resolvedPath, options.env ?? process.env);
}
//#endregion
//#region src/state/openclaw-state-db-startup-checkpoint.ts
function ensureStartupMigrationCheckpointSchema(db, pathname, env) {
	runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: pathname,
			env
		});
		assertSupportedSchemaVersion(db, pathname);
		db.exec(`
        CREATE TABLE IF NOT EXISTS schema_meta (
          meta_key TEXT NOT NULL PRIMARY KEY,
          role TEXT NOT NULL,
          schema_version INTEGER NOT NULL,
          agent_id TEXT,
          app_version TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS state_leases (
          scope TEXT NOT NULL,
          lease_key TEXT NOT NULL,
          owner TEXT NOT NULL,
          expires_at INTEGER,
          heartbeat_at INTEGER,
          payload_json TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (scope, lease_key)
        );
        CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
          ON state_leases(expires_at, scope, lease_key)
          WHERE expires_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_state_leases_owner
          ON state_leases(owner, updated_at DESC);
      `);
		ensureColumn(db, "schema_meta", "app_version TEXT");
	}, {
		busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
		databaseLabel: pathname,
		operationLabel: "state.schema.ensure-startup-checkpoint"
	});
}
function withOpenClawStateStartupMigrationCheckpointDatabase(callback, options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env
	}, "startup migration checkpoint database operation", () => {
		ensureOpenClawStatePermissions(pathname, env);
		const db = openNodeSqliteDatabase(pathname);
		try {
			configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			assertSqliteIntegrity(db, pathname);
			ensureStartupMigrationCheckpointSchema(db, pathname, env);
			return callback(db);
		} finally {
			db.close();
			ensureOpenClawStatePermissions(pathname, env);
		}
	});
}
//#endregion
//#region src/state/openclaw-state-db.ts
const STATE_MIGRATION_ASSERTIONS = {
	5: assertOpenClawStateDatabaseV5ForMigration,
	6: assertOpenClawStateDatabaseV6ForMigration,
	7: assertOpenClawStateDatabaseV7ForMigration
};
/** Reconfirm an advisory worker failure on the live owner connection. */
function confirmOpenClawStateDatabaseIntegrity(pathname) {
	const resolvedPath = path.resolve(pathname);
	closeOpenClawStateDatabaseByPath(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawStateDatabaseOpenFailure(pathname, error, generation) {
	return openClawStateDatabaseCache.recordOpenClawStateDatabaseOpenFailure(pathname, error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearOpenClawStateDatabaseOpenFailure(pathname) {
	openClawStateDatabaseCache.clearOpenClawStateDatabaseOpenFailure(pathname);
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowed(options = {}) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(resolveDatabasePath(options), env);
}
const stateDbLog = createSubsystemLogger("state/db");
function executeCanonicalStateSchema(database, options) {
	database.exec(getOpenClawStateRuntimeSchema(options));
}
function repairOpenClawStateDatabaseSchemaWithWriteAccess(pathname, env) {
	ensureOpenClawStatePermissions(pathname, env);
	const db = openNodeSqliteDatabase(pathname);
	const rebuiltIndexNames = /* @__PURE__ */ new Set();
	let ownershipRefused = false;
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedSchemaVersion(db, pathname);
		db.exec("PRAGMA foreign_keys = OFF;");
		const changes = runSqliteImmediateTransactionSync(db, () => {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			const applied = [];
			const previousVersion = readSqliteUserVersion(db);
			if (previousVersion === 8) {
				for (const name of repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowMissingColumns: true })) rebuiltIndexNames.add(name);
				assertSqliteSchemaTablesPresent(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: LAZY_ADDITIVE_STATE_TABLES });
			} else if (previousVersion === 5 || previousVersion === 6 || previousVersion === 7) STATE_MIGRATION_ASSERTIONS[previousVersion](db, { pathname });
			if (rebuiltIndexNames.size === 0) assertSqliteIntegrity(db, pathname);
			dropLegacyStateTables(db);
			if (migrateRetiredCommitmentsSchema(db, previousVersion)) applied.push("Retired shared state commitments table and indexes");
			if (migrateWorkerPlacementExecutionModeSchema(db, previousVersion)) applied.push("Migrated cloud worker placements to execution modes");
			if (repairAgentDatabasesCompositePrimaryKey(db)) applied.push(`Migrated shared state agent database registry primary key → agent_id,path`);
			if (repairAuditEventsSchema(db)) applied.push(`Migrated shared state audit event ledger → versioned message lifecycle schema`);
			applied.push(...repairOperatorApprovalSchema(db));
			const needsSessionWatchMigration = needsSessionWatchCursorProvenanceMigration(db, previousVersion);
			const sessionWatchResult = migrateSessionWatchCursorProvenance(db);
			if (needsSessionWatchMigration) applied.push(`Migrated shared state session watch cursors → provenance column (${sessionWatchResult.migratedAmbientWatches} ambient, ${sessionWatchResult.removedLegacySentinels} sentinels removed)`);
			assertCanonicalStateSchemaShape(db, pathname);
			if (tableExists(db, "audit_events")) {
				ensureAdditiveStateColumns(db);
				executeCanonicalStateSchema(db, { includeVersionLazyAdditiveTables: previousVersion !== 8 });
				if (previousVersion < 3) repairLegacyGatewayRestartHandoffsForStrictMigration(db);
				const strictMigration = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: previousVersion !== 8 }), { databaseLabel: pathname });
				if (strictMigration.migratedTables.length > 0) applied.push(`Migrated shared state tables to SQLite STRICT typing (${strictMigration.migratedTables.length})`);
				for (const name of repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false })) rebuiltIndexNames.add(name);
			}
			markCurrentStateSchemaVersion(db, { createMetadataIfMissing: previousVersion < 8 });
			if (readSqliteUserVersion(db) === 8) assertCurrentStateRuntimeSchema(db, pathname);
			if (rebuiltIndexNames.size > 0) applied.push(`Rebuilt canonical shared-state SQLite indexes (${rebuiltIndexNames.size})`);
			return applied;
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: pathname,
			operationLabel: "state.schema.repair"
		});
		const quarantineCleared = clearOpenClawDatabaseQuarantine(pathname, { env });
		clearOpenClawStateDatabaseOpenFailure(pathname);
		return {
			changes,
			warnings: quarantineCleared ? [] : [`Persisted quarantine record for ${pathname} could not be cleared; rerun openclaw doctor --fix so the repaired database is not refused again.`]
		};
	} catch (err) {
		if (err instanceof OpenClawStateOwnershipError) {
			ownershipRefused = true;
			throw err;
		}
		return {
			changes: [],
			warnings: [`Failed migrating shared state database schema at ${pathname}: ${String(err).replace(/has a legacy ([a-z ]+) schema; run openclaw doctor --fix to migrate it\./u, "has a legacy $1 schema; automatic repair refused the unrecognized schema shape.")}`]
		};
	} finally {
		if (db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
		if (!ownershipRefused) ensureOpenClawStatePermissions(pathname, env);
	}
}
function repairOpenClawStateDatabaseSchema(options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env
	}, "state schema repair", () => repairOpenClawStateDatabaseSchemaWithWriteAccess(pathname, env));
}
function needsOpenClawStateDatabaseSchemaRepair(pathname) {
	let database;
	try {
		database = openNodeSqliteDatabase(pathname, { readOnly: true });
		assertSupportedSchemaVersion(database, pathname);
		const needsRepair = readSqliteUserVersion(database) !== 8 || detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(database, pathname).length > 0;
		if (!needsRepair) assertCurrentStateRuntimeSchema(database, pathname);
		return needsRepair;
	} catch {
		return true;
	} finally {
		database?.close();
	}
}
/** Skip the exclusive doctor repair when automatic migration sees a canonical current schema. */
function repairOpenClawStateDatabaseSchemaIfNeeded(options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env
	}, "state schema repair preflight/repair", () => needsOpenClawStateDatabaseSchemaRepair(pathname) ? repairOpenClawStateDatabaseSchemaWithWriteAccess(pathname, env) : {
		changes: [],
		warnings: []
	});
}
function ensureSchema(db, pathname, env) {
	const now = Date.now();
	const kysely = getNodeSqliteKysely(db);
	db.exec("PRAGMA foreign_keys = OFF;");
	try {
		runSqliteImmediateTransactionSync(db, () => {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			assertSupportedSchemaVersion(db, pathname);
			const previousVersion = readSqliteUserVersion(db);
			if (previousVersion === 8) {
				verifyAndRepairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, {
					allowMissingColumns: true,
					validateAfterRepair: () => assertCurrentStateRuntimeSchema(db, pathname)
				});
				ensureAdditiveStateColumns(db);
				assertCurrentStateRuntimeSchema(db, pathname);
			} else if (previousVersion === 5 || previousVersion === 6 || previousVersion === 7) STATE_MIGRATION_ASSERTIONS[previousVersion](db, { pathname });
			dropLegacyStateTables(db);
			migrateRetiredCommitmentsSchema(db, previousVersion);
			migrateWorkerPlacementExecutionModeSchema(db, previousVersion);
			ensureAdditiveStateColumns(db);
			migrateSessionWatchCursorProvenance(db);
			assertCanonicalStateSchemaShape(db, pathname);
			executeCanonicalStateSchema(db, { includeVersionLazyAdditiveTables: previousVersion !== 8 });
			migrateLegacyCronRunLogsToTaskRuns(db);
			if (previousVersion < 3) {
				repairLegacyGatewayRestartHandoffsForStrictMigration(db);
				migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: previousVersion !== 8 }), { databaseLabel: pathname });
			}
			repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false });
			db.exec(`PRAGMA user_version = 8;`);
			executeSqliteQuerySync(db, kysely.insertInto("schema_meta").values({
				meta_key: "primary",
				role: "global",
				schema_version: 8,
				agent_id: null,
				app_version: VERSION,
				created_at: now,
				updated_at: now
			}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
				role: "global",
				schema_version: 8,
				agent_id: null,
				app_version: VERSION,
				updated_at: now
			}).where((eb) => eb.or([
				eb("schema_meta.schema_version", "!=", 8),
				eb("schema_meta.app_version", "!=", VERSION),
				eb("schema_meta.role", "!=", "global")
			]))));
			assertOpenClawStateDatabaseForMaintenance(db, { pathname });
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: pathname,
			operationLabel: "state.schema.ensure"
		});
	} finally {
		db.exec("PRAGMA foreign_keys = ON;");
	}
}
/** Open existing shared state without creating, migrating, chmodding, or configuring it. */
async function openExistingOpenClawStateDatabaseReadOnly(options = {}) {
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return;
	assertOpenClawStateDatabaseFreshOpenAllowed(options);
	const prepared = await prepareSqliteReadOnlyLocation(pathname);
	let db;
	try {
		db = openNodeSqliteDatabase(prepared.location, { readOnly: true });
	} catch (error) {
		prepared.cleanup();
		throw error;
	}
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedSchemaVersion(db, pathname);
		assertSqliteIntegrity(db, pathname);
		if (readSqliteUserVersion(db) === 8) assertOpenClawStateDatabaseForMaintenance(db, { pathname });
	} catch (error) {
		try {
			clearNodeSqliteKyselyCacheForDatabase(db);
			db.close();
		} catch {}
		prepared.cleanup();
		throw error;
	}
	let cleanupComplete = false;
	return {
		db,
		path: pathname,
		walMaintenance: {
			checkpoint: () => false,
			close: () => {
				const wasOpen = db.isOpen;
				if (!wasOpen && cleanupComplete) return false;
				try {
					if (wasOpen) {
						clearNodeSqliteKyselyCacheForDatabase(db);
						db.close();
					}
				} finally {
					cleanupComplete = prepared.cleanup();
				}
				return cleanupComplete;
			}
		}
	};
}
function assertCurrentStateRuntimeSchema(database, pathname) {
	assertCanonicalStateSchemaShape(database, pathname);
	assertOpenClawStateDatabaseForMaintenance(database, { pathname });
}
function assertStateDatabaseIntegrityBeforeMutation(database, pathname) {
	database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
	const userVersion = readSqliteUserVersion(database);
	const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
	if (userVersion === 0 && hasApplicationSchema || userVersion > 0 && userVersion < 8) stateDbLog.info("state database schema migration pending; verifying integrity first", {
		fromVersion: userVersion,
		path: pathname,
		toVersion: 8
	});
	if (userVersion !== 8) assertSqliteIntegrity(database, pathname);
}
function openUnpublishedOpenClawStateDatabase(pathname, env) {
	ensureOpenClawStatePermissions(pathname, env);
	const db = openNodeSqliteDatabase(pathname);
	enableNodeSqliteKyselyStatementCache(db);
	const walMaintenance = (() => {
		let maintenance;
		try {
			db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSupportedSchemaVersion(db, pathname);
			assertStateDatabaseIntegrityBeforeMutation(db, pathname);
			configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			maintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: "openclaw-state",
				databasePath: pathname,
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			ensureSchema(db, pathname, env);
			return maintenance;
		} catch (err) {
			maintenance?.close();
			db.close();
			if (err instanceof Error && (err.name === "SqliteSchemaVersionError" || isTerminalSqliteIntegrityError(err))) recordOpenClawStateDatabaseOpenFailure(pathname, err);
			throw err;
		}
	})();
	ensureOpenClawStatePermissions(pathname, env);
	return {
		db,
		path: pathname,
		walMaintenance
	};
}
/** Open or return a cached shared state database after schema and migration checks. */
function openOpenClawStateDatabase(options = {}) {
	const env = options.env ?? process.env;
	if (options.database) {
		assertOpenClawStateWriteAllowed({
			database: options.database.db,
			databasePath: options.database.path,
			env
		});
		return options.database;
	}
	const pathname = resolveDatabasePath(options);
	try {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
	} catch (error) {
		openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		throw error;
	}
	const cached = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (cached?.db.isOpen) {
		assertOpenClawStateWriteAllowed({
			database: cached.db,
			databasePath: pathname,
			env
		});
		return cached;
	}
	try {
		assertOpenClawStateDatabaseFreshOpenAllowed(options);
	} catch (error) {
		openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		throw error;
	}
	let unpublished;
	try {
		unpublished = runWithOpenClawStateWriteAccess({
			databasePath: pathname,
			env
		}, "fresh state database open", () => {
			if (cached) openClawStateDatabaseCache.closeStaleCachedOpenClawStateDatabase(cached);
			return unpublished = openUnpublishedOpenClawStateDatabase(pathname, env);
		});
	} catch (error) {
		openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		if (!unpublished) throw error;
		const cleanup = openClawStateDatabaseCache.closeOpenClawStateDatabaseHandle(unpublished);
		if (cleanup.caught) throw createSqliteLifecycleAggregateError([error, ...cleanup.errors], `Fresh OpenClaw state database open failed releasing access and closing its unpublished handle for ${pathname}.`, error);
		throw error;
	}
	return openClawStateDatabaseCache.publishOpenClawStateDatabase(unpublished);
}
/** Run a synchronous immediate transaction against the shared state database. */
function runOpenClawStateWriteTransaction(operation, options = {}, transactionOptions = {}) {
	const cachedBeforeOpen = options.database ?? getOpenClawStateDatabaseIfOpen(options);
	let database;
	try {
		database = openOpenClawStateDatabase(options);
	} catch (error) {
		if (cachedBeforeOpen && isSqliteCorruptionError(error)) openClawStateDatabaseCache.evictCachedOpenClawStateDatabase(cachedBeforeOpen);
		throw error;
	}
	let result;
	try {
		result = runSqliteImmediateTransactionSync(database.db, () => {
			assertOpenClawStateWriteAllowed({
				database: database.db,
				databasePath: database.path,
				env: options.env ?? process.env
			});
			return operation(database);
		}, {
			busyTimeoutMs: transactionOptions.busyTimeoutMs ?? 5e3,
			databaseLabel: database.path,
			...transactionOptions,
			operationLabel: transactionOptions.operationLabel ?? "state.write"
		});
	} catch (error) {
		if (isSqliteCorruptionError(error)) openClawStateDatabaseCache.evictCachedOpenClawStateDatabase(database);
		throw error;
	}
	try {
		ensureOpenClawStatePermissions(database.path, options.env ?? process.env);
	} catch {}
	return result;
}
/**
* Return a shared state handle this process already holds open, if any.
*
* Read-only callers use this to avoid opening a connection per call; it never
* creates, repairs, or registers a handle.
*/
function getOpenClawStateDatabaseIfOpen(options = {}) {
	return openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(resolveDatabasePath(options));
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictOpenClawStateDatabaseAfterCorruption(database, error) {
	return openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(database, error);
}
/** Close one cached shared state database handle by exact pathname. */
function closeOpenClawStateDatabaseByPath(pathname) {
	return openClawStateDatabaseCache.closeOpenClawStateDatabaseByPath(pathname);
}
/** Close all cached shared state database handles. */
function closeOpenClawStateDatabase() {
	openClawStateDatabaseCache.closeOpenClawStateDatabase();
}
/** Test whether any cached shared state database handle is still open. */
function isOpenClawStateDatabaseOpen() {
	return openClawStateDatabaseCache.isOpenClawStateDatabaseOpen();
}
/** Close shared state handles and clear terminal failure latches for test isolation. */
function closeOpenClawStateDatabaseForTest() {
	openClawStateDatabaseCache.closeOpenClawStateDatabaseForTest();
}
//#endregion
export { isAnnounceSkip as $, normalizeExitCode as $t, SESSION_WATCH_PROVENANCE_EXPLICIT as A, createSqliteTerminalOpenLatch as At, parseDeliveryQueueCompletionRetention as B, cronRunStatusToTaskStatus as Bt, inspectOpenClawStateOwnershipFromDatabase as C, createOpenClawDatabaseVerificationError as Ct, detectOpenClawStateDatabaseSchemaMigrations as D, getOpenClawStateRuntimeSchema as Dt, runWithOpenClawStateWriteAccess as E, STATE_PERSISTENT_SCHEMA_COMPATIBILITY as Et, ensureDevicePairSetupCompletionSchema as F, recordOpenClawDatabaseQuarantine as Ft, inflateDeliveryQueueRow as G, isCronDeliveryStatus as Gt, bindDeliveryQueueEntry as H, cronTaskRecordToRunLogEntry as Ht, ensureDevicePairingJoinCodeSchema as I, migrateLegacyCronRunLogsToTaskRuns as It, pruneDeliveryQueueTombstones as J, resolveCronTaskRecordTimestamp as Jt, loadDeliveryQueueEntryInDatabase as K, isCronRunStatus as Kt, ensureMcpOAuthPendingSchema as L, normalizeSqliteNumber as Lt, ensureAgentDatabaseLeaseSchema as M, tableHasColumn as Mt, ensureAgentDeletionJournalSchema as N, clearOpenClawDatabaseQuarantine as Nt, detectOpenClawStateDatabaseSchemaMigrationsFromDatabase as O, isOpenClawStateStartupRepairableSchemaIssue as Ot, ensureDevicePairSetupBootstrapSchema as P, readOpenClawDatabaseQuarantine as Pt, REPLY_SKIP_TOKEN as Q, normalizeDiagnosticToolName as Qt, ensureSecretStoreSchema as R, cronQuietTriggerTaskDetail as Rt, inspectOpenClawStateOwnershipAtPath as S, applyPrivateModeSync as Sn, assertOpenClawStateDatabaseOwner as St, runWithOpenClawStateOwnershipCoordinator as T, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY as Tt, deliveryQueueMetadata as U, cronTaskRecordToScriptRunResult as Ut, projectDeliveryQueueTerminalEntry as V, cronTaskRecordStoreKey as Vt, deliveryQueueRowColumns as W, cronTaskRecordToTriggerEval as Wt, upsertBoundDeliveryQueueEntryInDatabase as X, normalizeCronRunDiagnosticSummary as Xt, terminalizeBoundDeliveryQueueEntry as Y, formatUnknownError as Yt, ANNOUNCE_SKIP_TOKEN as Z, normalizeCronRunDiagnosticsCore as Zt, OpenClawStateOwnershipError as _, getCanonicalSqliteNamedIndexContracts as _n, ensureOpenClawStatePermissions as _t, closeOpenClawStateDatabaseForTest as a, prepareSqliteReadOnlyLocation as an, normalizeAgentRunTerminalReplySnapshot as at, assertOpenClawStateWriteAllowed as b, createSqliteLifecycleAggregateError as bn, registerOpenClawStateDatabaseLifecycleListener as bt, getOpenClawStateDatabaseIfOpen as c, createPrivateSqliteTempDirectory as cn, stripUserEnvelopeForDisplay as ct, openOpenClawStateDatabase as d, buildPowerShellFailureCause as dn, stripInboundMetadata as dt, tailText as en, isNonDeliverableSessionsReply as et, recordOpenClawStateDatabaseOpenFailure as f, repairCanonicalSqliteIndexes as fn, stripLeadingInboundMetadata as ft, withOpenClawStateStartupMigrationCheckpointDatabase as g, collectSqliteSchemaIssues as gn, stripMessageIdHints as gt, runOpenClawStateWriteTransaction as h, assertSqliteSchemaTablesPresent as hn, stripEnvelope as ht, closeOpenClawStateDatabaseByPath as i, isCronTimeoutErrorText as in, mergeAgentRunTerminalReplySnapshot as it, findOpenClawStateDatabaseSchemaMigrationRequiredError as j, tableExists as jt, SESSION_WATCH_PROVENANCE_AMBIENT_GROUP as k, OPENCLAW_STATE_SCHEMA_SQL as kt, isOpenClawStateDatabaseOpen as l, WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS as ln, extractInboundSenderLabel as lt, repairOpenClawStateDatabaseSchemaIfNeeded as m, assertSqliteSchemaContains as mn, markInboundContextLabel as mt, clearOpenClawStateDatabaseOpenFailure as n, CRON_PRE_EXECUTION_TIMEOUT_ERROR as nn, selectDeliverableSessionsReply as nt, confirmOpenClawStateDatabaseIntegrity as o, withSqliteSnapshotSource as on, sanitizeAgentRunTerminalReplyText as ot, repairOpenClawStateDatabaseSchema as p, verifyAndRepairCanonicalSqliteIndexes as pn, INBOUND_CONTEXT_MARKER as pt, pruneDeliveryQueueTombstoneAges as q, parseCronRunLogEntryObject as qt, closeOpenClawStateDatabase as r, CRON_SETUP_TIMEOUT_ERROR as rn, buildAgentRunTerminalReplySnapshot as rt, evictOpenClawStateDatabaseAfterCorruption as s, createPrivateSqliteDirectory as sn, stripInternalMetadataForDisplay as st, assertOpenClawStateDatabaseFreshOpenAllowed as t, CRON_JOB_EXECUTION_TIMEOUT_ERROR as tn, isReplySkip as tt, openExistingOpenClawStateDatabaseReadOnly as u, buildEncodedPowerShellArgs as un, hasInboundMetadataSentinel as ut, OpenClawStateOwnershipMetadataError as v, getCanonicalSqliteTableNames as vn, quarantineOrphanedSqliteSidecars as vt, normalizeOpenClawStateManagerId as w, resolveDatabasePath as wt, assertOpenClawStateWriteAllowedAtPath as x, ensurePrivateSqliteCoordinatorDirectory as xn, assertOpenClawStateDatabaseForMaintenance as xt, STATE_SUPERVISION_KEY as y, SqliteCoordinatorError as yn, resolveSqliteDatabaseFilePaths as yt, inferDeliveryQueueFailureRetention as z, cronRunLogEntryToTaskDetail as zt };
