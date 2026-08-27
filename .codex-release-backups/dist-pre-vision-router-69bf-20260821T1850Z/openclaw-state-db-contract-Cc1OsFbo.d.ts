import { DatabaseSync } from "node:sqlite";

//#region src/infra/sqlite-wal.d.ts
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
type SqliteWalMaintenance = {
  checkpoint: () => boolean;
  close: (options?: {
    checkpointMode?: SqliteWalCheckpointMode;
  }) => boolean;
};
/** Options controlling WAL autocheckpoint and periodic checkpoint behavior. */
type SqliteWalMaintenanceOptions = {
  autoCheckpointPages?: number;
  busyTimeoutMs?: number;
  checkpointIntervalMs?: number;
  checkpointMode?: SqliteWalCheckpointMode;
  databaseLabel?: string;
  databasePath?: string;
  onCheckpointError?: (error: unknown) => void;
};
type SqliteConnectionPragmaOptions = SqliteWalMaintenanceOptions & {
  foreignKeys?: boolean;
  synchronous?: "NORMAL";
};
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
declare function configureSqliteConnectionPragmas(db: DatabaseSync, options?: SqliteConnectionPragmaOptions): SqliteWalMaintenance;
//#endregion
//#region src/state/openclaw-state-db-contract.d.ts
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
type OpenClawStateDatabase = {
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
  database?: OpenClawStateDatabase;
  readOnly?: boolean;
};
type OpenClawStateDatabaseSchemaMigration = {
  kind: "agent-databases-composite-primary-key" | "audit-events-v2" | "commitments-retirement-v7" | "worker-placement-execution-mode-v8" | "operator-approvals-system-agent" | "session-watch-cursor-provenance-v4" | "strict-tables-v3";
  path: string;
};
//#endregion
export { SqliteWalMaintenance as a, SqliteConnectionPragmaOptions as i, OpenClawStateDatabaseOptions as n, SqliteWalMaintenanceOptions as o, OpenClawStateDatabaseSchemaMigration as r, configureSqliteConnectionPragmas as s, OpenClawStateDatabase as t };