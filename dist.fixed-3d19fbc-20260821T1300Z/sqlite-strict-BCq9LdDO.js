import { a as toStringifiedError } from "./error-coercion-DisD0JTb.js";
import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import "./fs-safe-X_oyl7Rx.js";
import { s as isSqliteCorruptionError, t as openNodeSqliteDatabase, u as runSqliteImmediateTransactionSync } from "./node-sqlite-B9zMic_z.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
//#region src/infra/sqlite-file-generation.ts
const SQLITE_GENERATION_HASH_BUFFER_BYTES = 1024 * 1024;
function assertRegularFile(stat) {
	if (!stat.isFile()) throw new Error("SQLite generation target must be a regular file");
}
function sameFileState(left, right) {
	return sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
function hashFileDescriptor(fd) {
	const hash = createHash("sha256");
	const buffer = Buffer.allocUnsafe(SQLITE_GENERATION_HASH_BUFFER_BYTES);
	let position = 0;
	while (true) {
		const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, position);
		if (bytesRead === 0) break;
		hash.update(buffer.subarray(0, bytesRead));
		position += bytesRead;
	}
	return hash.digest("hex");
}
function fingerprintFile(pathname) {
	const fd = fs.openSync(pathname, "r");
	try {
		const before = fs.fstatSync(fd, { bigint: true });
		assertRegularFile(before);
		const sha256 = hashFileDescriptor(fd);
		const after = fs.fstatSync(fd, { bigint: true });
		const current = fs.statSync(pathname, { bigint: true });
		if (!sameFileState(before, after) || !sameFileState(after, current)) throw new Error(`SQLite generation target changed while hashing: ${pathname}`);
		return {
			birthtimeNs: after.birthtimeNs,
			ctimeNs: after.ctimeNs,
			dev: after.dev,
			ino: after.ino,
			mtimeNs: after.mtimeNs,
			sha256,
			size: after.size
		};
	} finally {
		fs.closeSync(fd);
	}
}
function readOptionalFile(pathname) {
	try {
		return fingerprintFile(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readGeneration(pathname) {
	const database = fingerprintFile(pathname);
	const journal = readOptionalFile(`${pathname}-journal`);
	const wal = readOptionalFile(`${pathname}-wal`);
	return {
		database,
		...journal ? { journal } : {},
		...wal ? { wal } : {}
	};
}
function readStableSqliteFileGeneration(pathname) {
	const first = readGeneration(pathname);
	const second = readGeneration(pathname);
	if (!sameSqliteFileGeneration(first, second)) throw new Error(`SQLite file generation changed while reading: ${pathname}`);
	return second;
}
function sameFileFingerprint(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.mtimeNs === right.mtimeNs && left.sha256 === right.sha256 && left.size === right.size;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal, right.wal);
}
function serializeFileFingerprint(fingerprint) {
	return {
		birthtimeNs: fingerprint.birthtimeNs.toString(),
		ctimeNs: fingerprint.ctimeNs.toString(),
		dev: fingerprint.dev.toString(),
		ino: fingerprint.ino.toString(),
		mtimeNs: fingerprint.mtimeNs.toString(),
		sha256: fingerprint.sha256,
		size: fingerprint.size.toString()
	};
}
function serializeSqliteFileGeneration(generation) {
	return JSON.stringify({
		database: serializeFileFingerprint(generation.database),
		...generation.journal ? { journal: serializeFileFingerprint(generation.journal) } : {},
		...generation.wal ? { wal: serializeFileFingerprint(generation.wal) } : {}
	});
}
function parseFileFingerprint(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SQLite file fingerprint must be an object");
	const fingerprint = value;
	for (const field of [
		"birthtimeNs",
		"ctimeNs",
		"dev",
		"ino",
		"mtimeNs",
		"size"
	]) if (typeof fingerprint[field] !== "string" || !/^-?\d+$/u.test(fingerprint[field])) throw new Error(`SQLite file fingerprint ${field} is invalid`);
	if (typeof fingerprint.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(fingerprint.sha256)) throw new Error("SQLite file fingerprint sha256 is invalid");
	return {
		birthtimeNs: BigInt(fingerprint.birthtimeNs),
		ctimeNs: BigInt(fingerprint.ctimeNs),
		dev: BigInt(fingerprint.dev),
		ino: BigInt(fingerprint.ino),
		mtimeNs: BigInt(fingerprint.mtimeNs),
		sha256: fingerprint.sha256,
		size: BigInt(fingerprint.size)
	};
}
function parseSqliteFileGeneration(serialized) {
	const value = JSON.parse(serialized);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SQLite file generation must be an object");
	const generation = value;
	return {
		database: parseFileFingerprint(generation.database),
		...generation.journal === void 0 ? {} : { journal: parseFileFingerprint(generation.journal) },
		...generation.wal === void 0 ? {} : { wal: parseFileFingerprint(generation.wal) }
	};
}
//#endregion
//#region src/infra/sqlite-integrity.ts
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
/** Return whether a named integrity failure proves persistent database damage. */
function isTerminalSqliteIntegrityError(error) {
	if (error.name !== "SqliteIntegrityError") return false;
	if (!error.cause) return true;
	return isSqliteCorruptionError(error.cause);
}
/** Require structural, table/index, and referential consistency before trusting a database. */
function assertSqliteIntegrity(database, databaseLabel) {
	const integrityCheck = runSqliteCheck(database, databaseLabel, "integrity_check");
	runSqliteForeignKeyCheck(database, databaseLabel);
	return { integrityCheck };
}
/**
* Cheap synchronous open-time screen for structural damage.
*
* quick_check verifies page-level formatting, freelist integrity, missing
* pages, and misformatted records — the failure modes that justify refusing
* to open a file at all. It intentionally skips UNIQUE and row-vs-index
* content checks; those belong to {@link assertSqliteIntegrity} (migrations,
* repairs, doctor/backup/snapshot, explicit maintenance, readonly opens) and
* the background integrity verifier
* (`src/state/openclaw-database-verify.ts`, initial delay + daily cadence).
*
* Foreign-key check is also run: cheap relative to integrity_check and
* catches real referential corruption that would otherwise surface later as
* foreign-key violation errors during writes.
*/
function assertSqlitePhysicalScreen(database, databaseLabel) {
	const integrityCheck = runSqliteCheck(database, databaseLabel, "quick_check");
	runSqliteForeignKeyCheck(database, databaseLabel);
	return { integrityCheck };
}
/** Run integrity checks and preserve whether a failure proves persistent damage. */
function confirmSqliteIntegrity(database, databaseLabel) {
	try {
		assertSqliteIntegrity(database, databaseLabel);
		return { status: "healthy" };
	} catch (error) {
		return failedSqliteIntegrityConfirmation(error);
	}
}
/** Reconfirm an advisory failure against the database currently at a closed path. */
function confirmSqliteFileIntegrity(pathname, databaseLabel) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let initial;
		try {
			initial = readStableSqliteFileGeneration(pathname);
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let database;
		try {
			database = openNodeSqliteDatabase(pathname, { readOnly: true });
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let opened;
		try {
			opened = readStableSqliteFileGeneration(pathname);
		} catch {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		if (!sameSqliteFileGeneration(initial, opened)) {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		let confirmation = confirmSqliteIntegrity(database, databaseLabel);
		const closeError = closeSqliteDatabase(database);
		if (closeError && confirmation.status === "healthy") confirmation = failedSqliteIntegrityConfirmation(closeError);
		let final;
		try {
			final = readStableSqliteFileGeneration(pathname);
		} catch {
			continue;
		}
		if (!sameSqliteFileGeneration(opened, final)) continue;
		return bindSqliteIntegrityConfirmation(confirmation, final);
	}
	return unboundSqliteIntegrityFailure(/* @__PURE__ */ new Error(`SQLite file generation did not stabilize during confirmation: ${pathname}`));
}
function bindSqliteIntegrityConfirmation(confirmation, generation) {
	if (confirmation.status === "healthy") return {
		status: "healthy",
		generation
	};
	if (confirmation.terminal) return {
		...confirmation,
		generation,
		terminal: true
	};
	return {
		...confirmation,
		terminal: false
	};
}
function failedSqliteIntegrityConfirmation(error) {
	const normalized = toStringifiedError(error);
	return {
		status: "failed",
		error: normalized,
		terminal: isTerminalSqliteIntegrityError(normalized)
	};
}
function unboundSqliteIntegrityFailure(error) {
	return {
		status: "failed",
		error: toStringifiedError(error),
		terminal: false
	};
}
function closeSqliteDatabase(database) {
	try {
		database.close();
		return;
	} catch (error) {
		return toStringifiedError(error);
	}
}
/** Require table and associated index consistency before trusting indexed reads. */
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
	runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
	let rows;
	try {
		rows = database.prepare(`PRAGMA ${pragma}${argument};`).all();
	} catch (error) {
		throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	const results = rows.map((row) => row[pragma] ?? Object.values(row)[0]);
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
	let violationCount = 0;
	const violations = [];
	try {
		const statement = database.prepare("PRAGMA foreign_key_check;");
		statement.setReadBigInts(true);
		for (const violation of statement.iterate()) {
			violationCount += 1;
			retainSortedForeignKeyViolation(violations, violation);
		}
	} catch (error) {
		throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function createSqliteIntegrityError(message, cause) {
	const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
	error.name = "SqliteIntegrityError";
	return error;
}
function retainSortedForeignKeyViolation(retained, violation) {
	retained.push(violation);
	retained.sort(compareSqliteForeignKeyViolations);
	if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) retained.pop();
}
function compareSqliteForeignKeyViolations(left, right) {
	const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
	if (tableOrder !== 0) return tableOrder;
	if (left.rowid === null || right.rowid === null) {
		if (left.rowid !== right.rowid) return left.rowid === null ? -1 : 1;
	} else if (left.rowid !== right.rowid) return left.rowid < right.rowid ? -1 : 1;
	const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
	if (parentOrder !== 0) return parentOrder;
	if (left.fkid === right.fkid) return 0;
	return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
	const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
	return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
//#endregion
//#region src/infra/sqlite-strict.ts
const DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS = 5e3;
const STRICT_MIGRATION_TABLE_PREFIX = "__openclaw_strict_migration_";
const SQLITE_ROWID_ALIASES = [
	"_rowid_",
	"rowid",
	"oid"
];
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function readMainTableList(db) {
	return db.prepare("PRAGMA table_list").all().filter((row) => row.schema === "main" && typeof row.name === "string" && !row.name.startsWith("sqlite_"));
}
function readTableColumns(db, tableName) {
	return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
	return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
		if (typeof row.name !== "string" || row.name.length === 0) throw new Error(`SQLite table ${tableName} has an invalid column name`);
		return row.name;
	});
}
function readTableRowidModel(db, tableName, tableRow) {
	if (Number(tableRow.wr ?? 0) === 1) return {
		alias: null,
		storage: "without-rowid"
	};
	const columns = readTableColumns(db, tableName);
	const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
	const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
	const primaryKeyType = primaryKeyColumns[0]?.type;
	if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) return {
		alias: null,
		storage: "integer-primary-key"
	};
	const declaredNames = new Set(columns.flatMap((column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []));
	const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
	if (!alias) throw new Error(`SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`);
	return {
		alias,
		storage: "implicit"
	};
}
function readCanonicalStrictTables(schemaSql) {
	const canonical = openNodeSqliteDatabase(":memory:");
	try {
		canonical.exec(schemaSql);
		const tables = readMainTableList(canonical).filter((row) => row.type === "table");
		const nonStrict = tables.flatMap((row) => Number(row.strict ?? 0) === 1 || typeof row.name !== "string" ? [] : [row.name]);
		if (nonStrict.length > 0) throw new Error(`Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`);
		return tables.map((row) => {
			if (typeof row.name !== "string") throw new Error("Canonical SQLite schema contains an unnamed table");
			const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
			if (typeof schemaRow?.sql !== "string") throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
			const rowidModel = readTableRowidModel(canonical, row.name, row);
			return {
				columns: readVisibleColumns(canonical, row.name),
				createSql: schemaRow.sql,
				name: row.name,
				rowidAlias: rowidModel.alias,
				rowidStorage: rowidModel.storage,
				usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
			};
		}).toSorted((left, right) => left.name.localeCompare(right.name));
	} finally {
		canonical.close();
	}
}
function rewriteCreateTableName(createSql, replacementName) {
	const openingParen = createSql.indexOf("(");
	if (openingParen === -1) throw new Error("Canonical SQLite table CREATE statement has no column list");
	return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
	return db.prepare("SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')").all().flatMap((row) => {
		if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) return [];
		return [{
			name: row.name,
			sql: row.sql,
			type: row.type
		}];
	}).toSorted((left, right) => {
		const typeOrder = {
			view: 0,
			index: 1,
			trigger: 2
		};
		return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
	});
}
function readAutoincrementHighWater(db, tableName) {
	if (!db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'").get()) return null;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
	if (row === void 0) return null;
	const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
	if (!normalized) throw new Error(`SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`);
	return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
	if (previousHighWater === null) return;
	const currentHighWater = readAutoincrementHighWater(db, tableName);
	const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(tableName, restored);
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
	const current = new Set(currentColumns);
	const canonical = new Set(canonicalColumns);
	const missing = canonicalColumns.filter((column) => !current.has(column));
	const extra = currentColumns.filter((column) => !canonical.has(column));
	if (missing.length === 0 && extra.length === 0) return;
	const details = [missing.length > 0 ? `missing ${missing.join(", ")}` : "", extra.length > 0 ? `extra ${extra.join(", ")}` : ""].filter(Boolean).join("; ");
	throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
	const row = db.prepare("PRAGMA foreign_keys").get();
	return Number(row?.foreign_keys ?? 0) === 1;
}
/**
* Rebuild canonical non-STRICT tables inside the caller's transaction.
* Foreign-key enforcement must be disabled before BEGIN; integrity is checked
* before this function returns so any bad row or relationship rolls back.
*/
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
	if (!db.isTransaction) throw new Error("SQLite STRICT schema migration requires an active transaction");
	const canonicalTables = readCanonicalStrictTables(schemaSql);
	db.exec(schemaSql);
	const currentTableRows = new Map(readMainTableList(db).filter((row) => row.type === "table" && typeof row.name === "string").map((row) => [row.name, row]));
	const tablesToMigrate = canonicalTables.filter((table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1);
	if (tablesToMigrate.length === 0) return { migratedTables: [] };
	if (readForeignKeysEnabled(db)) throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
	const preservedObjects = readPreservedSchemaObjects(db, new Set(tablesToMigrate.map((table) => table.name)));
	for (const object of preservedObjects) if (object.type === "trigger") db.exec(`DROP TRIGGER ${quoteSqliteIdentifier(object.name)};`);
	for (const object of preservedObjects) if (object.type === "view") db.exec(`DROP VIEW ${quoteSqliteIdentifier(object.name)};`);
	for (const [index, table] of tablesToMigrate.entries()) {
		const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
		if (currentTableRows.has(migrationTable)) throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
		const currentColumns = readVisibleColumns(db, table.name);
		assertMatchingColumns(table.name, currentColumns, table.columns);
		const currentTableRow = currentTableRows.get(table.name);
		if (!currentTableRow) throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
		const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
		if (currentRowidModel.storage !== table.rowidStorage) throw new Error(`SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`);
		const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
		db.exec(rewriteCreateTableName(table.createSql, migrationTable));
		const columns = table.columns.map(quoteSqliteIdentifier);
		if (table.rowidAlias) columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
		const copyColumns = columns.join(", ");
		try {
			db.exec(`INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`);
		} catch (error) {
			throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
		}
		db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
		db.exec(`ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`);
		restoreAutoincrementHighWater(db, table.name, previousHighWater);
	}
	db.exec(schemaSql);
	const findObject = db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1");
	for (const object of preservedObjects) if (!findObject.get(object.type, object.name)) db.exec(object.sql);
	assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
	return { migratedTables: tablesToMigrate.map((table) => table.name) };
}
/** Atomically upgrade OpenClaw-owned tables described by a canonical STRICT schema. */
function migrateSqliteSchemaToStrict(db, schemaSql, options = {}) {
	if (db.isTransaction) throw new Error("SQLite STRICT schema migration cannot start inside a transaction");
	const foreignKeysWereEnabled = readForeignKeysEnabled(db);
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options), {
			busyTimeoutMs: options.busyTimeoutMs ?? DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS,
			databaseLabel: options.databaseLabel,
			operationLabel: "sqlite.strict-schema-migration"
		});
	} finally {
		if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = ON;");
	}
}
//#endregion
export { assertSqliteTableIntegrity as a, parseSqliteFileGeneration as c, serializeSqliteFileGeneration as d, assertSqlitePhysicalScreen as i, readStableSqliteFileGeneration as l, migrateSqliteSchemaToStrictInTransaction as n, confirmSqliteFileIntegrity as o, assertSqliteIntegrity as r, isTerminalSqliteIntegrityError as s, migrateSqliteSchemaToStrict as t, sameSqliteFileGeneration as u };
