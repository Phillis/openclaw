import { Dt as PluginRuntime } from "./types-BJ8oTDFw.js";
import { DatabaseSync } from "node:sqlite";

//#region src/infra/sqlite-strict.d.ts
type SqliteStrictMigrationOptions = {
  busyTimeoutMs?: number;
  databaseLabel?: string;
};
type SqliteStrictMigrationResult = {
  migratedTables: string[];
};
/** Atomically upgrade OpenClaw-owned tables described by a canonical STRICT schema. */
declare function migrateSqliteSchemaToStrict(db: DatabaseSync, schemaSql: string, options?: SqliteStrictMigrationOptions): SqliteStrictMigrationResult;
//#endregion
//#region src/plugin-sdk/plugin-state-runtime.d.ts
declare function createPluginStateErrorReporter(getRuntime: () => Pick<PluginRuntime, "logging"> | null | undefined, plugin: string, feature: string, message: string, formatError?: (error: unknown) => Record<string, unknown>): (error: unknown) => void;
//#endregion
export { migrateSqliteSchemaToStrict as i, SqliteStrictMigrationOptions as n, SqliteStrictMigrationResult as r, createPluginStateErrorReporter as t };