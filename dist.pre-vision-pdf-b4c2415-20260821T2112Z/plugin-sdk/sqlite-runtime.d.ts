import { t as SubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { a as SqliteWalMaintenance, n as OpenClawStateDatabaseOptions } from "../openclaw-state-db-contract-Cc1OsFbo.js";
import { DatabaseSync } from "node:sqlite";
import { Compilable, Kysely, QueryResult } from "kysely";

//#region src/infra/sqlite-transaction.d.ts
type SqliteTransactionOptions = {
  busyTimeoutMs?: number;
  databaseLabel?: string;
  logger?: Pick<SubsystemLogger, "warn">;
  operationLabel?: string;
  slowTransactionHoldMs?: number;
};
declare function runSqliteImmediateTransactionSync<T>(db: DatabaseSync, operation: () => T, options?: SqliteTransactionOptions): T;
//#endregion
//#region src/state/openclaw-agent-db-contract.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving and opening one agent database. */
type OpenClawAgentDatabaseOptions = OpenClawStateDatabaseOptions & {
  agentId: string;
};
//#endregion
//#region src/state/openclaw-agent-db-schema.d.ts
/** Initialize agent schema/ownership metadata on an independently managed connection. */
declare function ensureOpenClawAgentDatabaseSchema(db: DatabaseSync, options: OpenClawAgentDatabaseOptions & {
  register?: boolean;
}): void;
//#endregion
//#region src/state/openclaw-agent-db.paths.d.ts
/**
 * Path helpers for per-agent SQLite state.
 *
 * Agent databases live beside the shared state database root so each agent can
 * own private runtime tables while the shared registry can still discover them.
 */
/** Inputs for resolving one agent SQLite path or directory. */
type OpenClawAgentSqlitePathOptions = {
  agentId: string;
  env?: NodeJS.ProcessEnv;
  path?: string;
};
/** Resolve the SQLite file for one normalized agent id. */
declare function resolveOpenClawAgentSqlitePath(options: OpenClawAgentSqlitePathOptions): string;
//#endregion
//#region src/state/openclaw-agent-db.d.ts
/** Open or return a cached per-agent database after schema and owner validation. */
declare function openOpenClawAgentDatabase(options: OpenClawAgentDatabaseOptions): OpenClawAgentDatabase;
//#endregion
//#region src/state/openclaw-agent-standing-intents-schema.d.ts
/** Lazily add the canonical standing-intents tables on first feature use. */
declare function ensureOpenClawAgentStandingIntentsSchema(db: DatabaseSync): void;
//#endregion
//#region src/infra/kysely-sync.d.ts
declare function getNodeSqliteKysely<Database>(db: DatabaseSync): Kysely<Database>;
/** Compile and execute a Kysely query synchronously. */
declare function executeSqliteQuerySync<Row>(db: DatabaseSync, query: Compilable<Row>): QueryResult<Row>;
/** Execute a Kysely query synchronously and return its first row. */
declare function executeSqliteQueryTakeFirstSync<Row>(db: DatabaseSync, query: Compilable<Row>): Row | undefined;
//#endregion
//#region src/infra/node-sqlite.d.ts
type NodeSqliteDatabaseOptions = ConstructorParameters<typeof import("node:sqlite").DatabaseSync>[1];
/** Open node:sqlite through OpenClaw's runtime and filesystem-location boundary. */
declare function openNodeSqliteDatabase(location: string, options?: NodeSqliteDatabaseOptions): import("node:sqlite").DatabaseSync;
//#endregion
export { ensureOpenClawAgentDatabaseSchema, ensureOpenClawAgentStandingIntentsSchema, executeSqliteQuerySync, executeSqliteQueryTakeFirstSync, getNodeSqliteKysely, openNodeSqliteDatabase, openOpenClawAgentDatabase, resolveOpenClawAgentSqlitePath, runSqliteImmediateTransactionSync };