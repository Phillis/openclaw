import { n as OpenClawStateDatabaseOptions } from "./openclaw-state-db-contract-BPw6fYCC.js";
//#region src/infra/sqlite-audit-record-store.d.ts
type SqliteAuditRecordEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
};
type SequencedSqliteAuditRecordEntry<T> = SqliteAuditRecordEntry<T> & {
  sequence: number;
};
/** Opens one bounded audit-record scope in the shared state database. */
declare function createSqliteAuditRecordStore<T>(options: OpenClawStateDatabaseOptions & {
  scope: string;
  maxEntries: number;
}): {
  register(key: string, value: T, createdAt?: number): void;
  upsert(key: string, value: T, createdAt?: number): void;
  delete(key: string): void;
  compareAndSet(key: string, expectedValue: T | null, value: T | null, createdAt?: number): boolean;
  registerLegacyMany(records: readonly SqliteAuditRecordEntry<T>[]): void;
  size(): number;
  entries(): SqliteAuditRecordEntry<T>[];
  latest(params: {
    limit: number;
    beforeSequence?: number;
  }): SequencedSqliteAuditRecordEntry<T>[];
};
//#endregion
export { createSqliteAuditRecordStore as n, SequencedSqliteAuditRecordEntry as t };