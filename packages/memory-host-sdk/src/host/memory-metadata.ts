// Shared memory metadata helpers for scope, lifecycle, and feedback state.
import type { DatabaseSync } from "node:sqlite";
import type { MemorySource } from "./types.js";

export const MEMORY_SCOPE_VALUES = [
  "agent",
  "workspace",
  "project",
  "thread",
  "shared",
  "ephemeral",
] as const;

export type MemoryScope = (typeof MEMORY_SCOPE_VALUES)[number];

export const MEMORY_LIFECYCLE_VALUES = ["active", "stale", "superseded", "tombstoned"] as const;

export type MemoryLifecycle = (typeof MEMORY_LIFECYCLE_VALUES)[number];

export const MEMORY_FEEDBACK_VALUES = [
  "useful",
  "wrong",
  "stale",
  "duplicate",
  "too_private",
  "wrong_scope",
] as const;

export type MemoryFeedbackKind = (typeof MEMORY_FEEDBACK_VALUES)[number];

export const DEFAULT_MEMORY_SCOPE: MemoryScope = "workspace";
export const DEFAULT_MEMORY_LIFECYCLE: MemoryLifecycle = "active";

export function normalizeMemoryScope(value: unknown): MemoryScope | undefined {
  return MEMORY_SCOPE_VALUES.find((entry) => entry === value);
}

export function normalizeMemoryScopes(values: readonly unknown[] | undefined): MemoryScope[] {
  if (!values?.length) {
    return [];
  }
  const seen = new Set<MemoryScope>();
  for (const value of values) {
    const normalized = normalizeMemoryScope(value);
    if (normalized) {
      seen.add(normalized);
    }
  }
  return [...seen];
}

export function normalizeMemoryLifecycle(value: unknown): MemoryLifecycle | undefined {
  return MEMORY_LIFECYCLE_VALUES.find((entry) => entry === value);
}

export function normalizeMemoryFeedbackKind(value: unknown): MemoryFeedbackKind | undefined {
  return MEMORY_FEEDBACK_VALUES.find((entry) => entry === value);
}

export function deriveMemoryScope(params: { source: MemorySource; path: string }): MemoryScope {
  if (params.source === "sessions") {
    return "thread";
  }
  const normalized = params.path.trim().replace(/\\/g, "/").toLowerCase();
  if (normalized === "dreams.md" || normalized.endsWith("/dreams.md")) {
    return "agent";
  }
  if (/(^|\/)(shared|team|handoff|baseline)(\/|\.|-|$)/u.test(normalized)) {
    return "shared";
  }
  if (/(^|\/)(ephemeral|scratch|tmp|temp)(\/|\.|-|$)/u.test(normalized)) {
    return "ephemeral";
  }
  if (/(^|\/)(projects?|repos?)(\/|\.|-|$)/u.test(normalized)) {
    return "project";
  }
  return DEFAULT_MEMORY_SCOPE;
}

export function buildMemoryLifecycleWhereClause(alias = ""): string {
  const prefix = alias ? `${alias}.` : "";
  return (
    ` AND COALESCE(${prefix}lifecycle, '${DEFAULT_MEMORY_LIFECYCLE}') = '${DEFAULT_MEMORY_LIFECYCLE}'` +
    ` AND (${prefix}valid_from IS NULL OR ${prefix}valid_from <= unixepoch() * 1000)` +
    ` AND (${prefix}valid_until IS NULL OR ${prefix}valid_until > unixepoch() * 1000)`
  );
}

export function buildMemoryScopeFilterClause(
  scopes: readonly MemoryScope[] | undefined,
  alias = "",
): { sql: string; params: MemoryScope[] } {
  if (!scopes?.length) {
    return { sql: "", params: [] };
  }
  const prefix = alias ? `${alias}.` : "";
  return {
    sql: ` AND COALESCE(${prefix}scope, '${DEFAULT_MEMORY_SCOPE}') IN (${scopes.map(() => "?").join(", ")})`,
    params: [...scopes],
  };
}

type ColumnSpec = {
  name: string;
  definition: string;
};

const SOURCE_METADATA_COLUMNS: ColumnSpec[] = [
  { name: "scope", definition: `TEXT NOT NULL DEFAULT '${DEFAULT_MEMORY_SCOPE}'` },
  { name: "lifecycle", definition: `TEXT NOT NULL DEFAULT '${DEFAULT_MEMORY_LIFECYCLE}'` },
  { name: "valid_from", definition: "INTEGER" },
  { name: "valid_until", definition: "INTEGER" },
  { name: "bundle_hash", definition: "TEXT" },
];

const CHUNK_METADATA_COLUMNS: ColumnSpec[] = [
  ...SOURCE_METADATA_COLUMNS,
  { name: "confidence", definition: "REAL NOT NULL DEFAULT 1.0" },
  { name: "supersedes", definition: "TEXT" },
  { name: "superseded_by", definition: "TEXT" },
  { name: "feedback_score", definition: "REAL NOT NULL DEFAULT 0" },
  { name: "feedback_count", definition: "INTEGER NOT NULL DEFAULT 0" },
  { name: "last_feedback_at", definition: "INTEGER" },
  { name: "last_feedback_kind", definition: "TEXT" },
];

function listTableColumns(db: DatabaseSync, tableName: string): Set<string> {
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name?: unknown }>;
  return new Set(rows.flatMap((row) => (typeof row.name === "string" ? [row.name] : [])));
}

function ensureColumns(db: DatabaseSync, tableName: string, specs: readonly ColumnSpec[]): void {
  const columns = listTableColumns(db, tableName);
  for (const spec of specs) {
    if (columns.has(spec.name)) {
      continue;
    }
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${spec.name} ${spec.definition}`);
  }
}

export function ensureMemoryMetadataColumns(params: {
  db: DatabaseSync;
  sourcesTable: string;
  chunksTable: string;
}): void {
  ensureColumns(params.db, params.sourcesTable, SOURCE_METADATA_COLUMNS);
  ensureColumns(params.db, params.chunksTable, CHUNK_METADATA_COLUMNS);
}
