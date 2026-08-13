// Contract tests for writeMemoryCoreWorkspaceEntries skip-unchanged behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type {
  OpenKeyedStoreOptions,
  PluginStateKeyedStore,
} from "openclaw/plugin-sdk/plugin-state-runtime";
import { createPluginStateKeyedStoreForTests } from "openclaw/plugin-sdk/plugin-state-test-runtime";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { runDreamingSweepPhases } from "./dreaming-phases.js";
import {
  configureMemoryCoreDreamingState,
  DREAMING_DAILY_INGESTION_NAMESPACE,
  DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
  DREAMING_WORKSPACE_STATE_MAX_ENTRIES,
  readMemoryCoreWorkspaceEntries,
  writeMemoryCoreWorkspaceEntries,
} from "./dreaming-state.js";
import { resetMemoryCoreDreamingStateForTests } from "./test-helpers.js";

const MEMORY_CORE_PLUGIN_ID = "memory-core";
const tempDirs: string[] = [];

type WriteCounts = {
  register: number;
  delete: number;
};

let writeCounts: WriteCounts = { register: 0, delete: 0 };
const writeCountsByNamespace = new Map<string, WriteCounts>();

function resetWriteCounts(): void {
  writeCounts = { register: 0, delete: 0 };
  writeCountsByNamespace.clear();
}

function incrementNamespaceWriteCount(namespace: string, operation: keyof WriteCounts): void {
  const counts = writeCountsByNamespace.get(namespace) ?? { register: 0, delete: 0 };
  counts[operation] += 1;
  writeCountsByNamespace.set(namespace, counts);
}

function namespaceWriteCounts(namespace: string): WriteCounts {
  return writeCountsByNamespace.get(namespace) ?? { register: 0, delete: 0 };
}

function wrapStoreWithWriteCounts<T>(
  store: PluginStateKeyedStore<T>,
  namespace: string,
): PluginStateKeyedStore<T> {
  return {
    ...store,
    register: async (key, value, opts) => {
      writeCounts.register += 1;
      incrementNamespaceWriteCount(namespace, "register");
      await store.register(key, value, opts);
    },
    delete: async (key) => {
      writeCounts.delete += 1;
      incrementNamespaceWriteCount(namespace, "delete");
      return store.delete(key);
    },
  };
}

function configureCountedDreamingState(params?: {
  maxEntriesByNamespace?: Readonly<Record<string, number>>;
}): void {
  configureMemoryCoreDreamingState(<T>(options: OpenKeyedStoreOptions) =>
    wrapStoreWithWriteCounts(
      createPluginStateKeyedStoreForTests<T>(MEMORY_CORE_PLUGIN_ID, {
        ...options,
        // Capacity tests override maxEntries for a dedicated namespace so
        // eviction can be proven without writing the production 50_000-row
        // cap or reopening production namespaces with a conflicting limit.
        maxEntries: params?.maxEntriesByNamespace?.[options.namespace] ?? options.maxEntries,
        env: process.env,
      }),
      options.namespace,
    ),
  );
}

beforeAll(() => {
  configureCountedDreamingState();
});

afterAll(() => {
  resetMemoryCoreDreamingStateForTests();
});

afterEach(async () => {
  resetWriteCounts();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }
});

async function createWorkspace(): Promise<string> {
  const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "dreaming-state-write-"));
  tempDirs.push(workspaceDir);
  return workspaceDir;
}

describe("writeMemoryCoreWorkspaceEntries", () => {
  it("writes N rows on the first pass and zero writes on an identical second pass", async () => {
    const workspaceDir = await createWorkspace();
    const entries = [
      { key: "a.txt", value: { path: "a.txt", mtime: 1 } },
      { key: "b.txt", value: { path: "b.txt", mtime: 2 } },
      { key: "c.txt", value: { path: "c.txt", mtime: 3 } },
    ];

    resetWriteCounts();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries,
    });
    expect(writeCounts.register).toBe(3);
    expect(writeCounts.delete).toBe(0);

    resetWriteCounts();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries,
    });
    expect(writeCounts.register).toBe(0);
    expect(writeCounts.delete).toBe(0);

    const stored = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
    });
    expect(stored).toEqual(expect.arrayContaining(entries));
    expect(stored).toHaveLength(3);
  });

  it("registers only the changed row when one value updates", async () => {
    const workspaceDir = await createWorkspace();
    const initial = [
      { key: "a.txt", value: { path: "a.txt", mtime: 1 } },
      { key: "b.txt", value: { path: "b.txt", mtime: 2 } },
    ];
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: initial,
    });

    resetWriteCounts();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: [
        { key: "a.txt", value: { path: "a.txt", mtime: 1 } },
        { key: "b.txt", value: { path: "b.txt", mtime: 99 } },
      ],
    });
    expect(writeCounts.register).toBe(1);
    expect(writeCounts.delete).toBe(0);

    const stored = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
    });
    expect(stored.find((row) => row.key === "b.txt")?.value).toEqual({
      path: "b.txt",
      mtime: 99,
    });
  });

  it("deletes only rows absent from the desired set", async () => {
    const workspaceDir = await createWorkspace();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: [
        { key: "keep.txt", value: { path: "keep.txt", mtime: 1 } },
        { key: "drop.txt", value: { path: "drop.txt", mtime: 2 } },
      ],
    });

    resetWriteCounts();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: [{ key: "keep.txt", value: { path: "keep.txt", mtime: 1 } }],
    });
    expect(writeCounts.register).toBe(0);
    expect(writeCounts.delete).toBe(1);

    const stored = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
    });
    expect(stored).toEqual([{ key: "keep.txt", value: { path: "keep.txt", mtime: 1 } }]);
  });

  it("collapses duplicate keys while preserving the final last-write-wins value", async () => {
    const workspaceDir = await createWorkspace();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: [{ key: "same.txt", value: { path: "same.txt", mtime: 1 } }],
    });

    resetWriteCounts();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: [
        { key: "same.txt", value: { path: "same.txt", mtime: 2 } },
        { key: "same.txt", value: { path: "same.txt", mtime: 1 } },
      ],
    });
    expect(writeCounts.register).toBe(0);

    const stored = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
    });
    expect(stored).toEqual([{ key: "same.txt", value: { path: "same.txt", mtime: 1 } }]);
  });

  it("does not rewrite rows belonging to a different workspace", async () => {
    const workspaceA = await createWorkspace();
    const workspaceB = await createWorkspace();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir: workspaceA,
      entries: [{ key: "a.txt", value: { path: "a.txt", mtime: 1 } }],
    });
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir: workspaceB,
      entries: [{ key: "b.txt", value: { path: "b.txt", mtime: 2 } }],
    });

    resetWriteCounts();
    await writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir: workspaceA,
      entries: [{ key: "a.txt", value: { path: "a.txt", mtime: 1 } }],
    });
    expect(writeCounts.register).toBe(0);
    expect(writeCounts.delete).toBe(0);

    const storedB = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir: workspaceB,
    });
    expect(storedB).toEqual([{ key: "b.txt", value: { path: "b.txt", mtime: 2 } }]);
  });

  it("restores a desired row that capacity eviction removed after an equal skip", async () => {
    // Fill the namespace, keep two equal desired rows, replace the third with a
    // new key. Registering the new key can evict the oldest equal desired row
    // that the first pass already skipped; post-write reconcile must restore it
    // so the final stored set matches the full desired set (size <= capacity).
    const capacity = 3;
    const capacityNamespace = "dreaming-workspace-capacity-reconcile";
    configureCountedDreamingState({
      maxEntriesByNamespace: { [capacityNamespace]: capacity },
    });
    vi.useFakeTimers();
    try {
      const workspaceDir = await createWorkspace();
      const oldest = { key: "oldest.txt", value: { path: "oldest.txt", mtime: 1 } };
      const mid = { key: "mid.txt", value: { path: "mid.txt", mtime: 2 } };
      const newest = { key: "newest.txt", value: { path: "newest.txt", mtime: 3 } };
      const incoming = { key: "incoming.txt", value: { path: "incoming.txt", mtime: 4 } };

      vi.setSystemTime(1_000);
      await writeMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
        entries: [oldest],
      });
      vi.setSystemTime(2_000);
      await writeMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
        entries: [oldest, mid],
      });
      vi.setSystemTime(3_000);
      await writeMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
        entries: [oldest, mid, newest],
      });

      resetWriteCounts();
      vi.setSystemTime(5_000);
      // Desired set still fits capacity: drop newest, add incoming, keep equals.
      // Without reconcile, register(incoming) evicts oldest after it was skipped.
      await writeMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
        entries: [oldest, mid, incoming],
      });

      const stored = await readMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
      });
      expect(stored).toHaveLength(capacity);
      expect(stored.map((row) => row.key).toSorted()).toEqual(
        ["incoming.txt", "mid.txt", "oldest.txt"].toSorted(),
      );
      expect(stored.find((row) => row.key === "oldest.txt")?.value).toEqual(oldest.value);
      // Exact: 1 register for incoming (Pass 2) + 1 register for oldest (reconcile
      // restores it after Pass 2's eviction). Only newest is absent from desired
      // and still in the store, so exactly 1 delete.
      expect(writeCounts.register).toBe(2);
      expect(writeCounts.delete).toBe(1);
    } finally {
      vi.useRealTimers();
      configureCountedDreamingState();
    }
  });

  it("throws RangeError and leaves the store untouched when desired exceeds the namespace cap", async () => {
    // The pre-mutation capacity guard must reject batches larger than
    // DREAMING_WORKSPACE_STATE_MAX_ENTRIES before any register or delete runs,
    // so callers see the failure as a clear RangeError instead of a silently
    // truncated namespace. Construction alone is enough; no mutations should
    // occur because the guard fires after desiredByStateKey is built but
    // before the register/delete phases.
    const overCapacity = DREAMING_WORKSPACE_STATE_MAX_ENTRIES + 1;
    const workspaceDir = await createWorkspace();
    const overCapacityEntries = Array.from({ length: overCapacity }, (_, index) => ({
      key: `file-${index}.txt`,
      value: { path: `file-${index}.txt`, mtime: index },
    }));

    resetWriteCounts();
    await expect(
      writeMemoryCoreWorkspaceEntries({
        namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
        workspaceDir,
        entries: overCapacityEntries,
      }),
    ).rejects.toThrow(RangeError);
    expect(writeCounts.register).toBe(0);
    expect(writeCounts.delete).toBe(0);

    const stored = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
    });
    expect(stored).toEqual([]);
  });

  it("throws when reconcile exhausts bounded rounds with desired rows still missing", async () => {
    // Force non-convergence via the injected effective capacity: a namespace
    // with capacity 2 cannot hold 4 distinct rows. The pre-validation guard
    // compares against the production 50_000 cap so 4 rows pass it, but the
    // bounded reconcile cannot fit them inside capacity 2 and must throw.
    const capacity = 2;
    const convergenceNamespace = "dreaming-workspace-non-convergence";
    configureCountedDreamingState({
      maxEntriesByNamespace: { [convergenceNamespace]: capacity },
    });
    vi.useFakeTimers();
    try {
      const workspaceDir = await createWorkspace();
      const entries = [
        { key: "row-a.txt", value: { path: "row-a.txt", mtime: 1 } },
        { key: "row-b.txt", value: { path: "row-b.txt", mtime: 2 } },
        { key: "row-c.txt", value: { path: "row-c.txt", mtime: 3 } },
        { key: "row-d.txt", value: { path: "row-d.txt", mtime: 4 } },
      ];

      resetWriteCounts();
      vi.setSystemTime(1_000);
      await expect(
        writeMemoryCoreWorkspaceEntries({
          namespace: convergenceNamespace,
          workspaceDir,
          entries,
        }),
      ).rejects.toThrow(/reconcile failed to converge/);
    } finally {
      vi.useRealTimers();
      configureCountedDreamingState();
    }
  });

  it("preserves duplicate last-write-wins under capacity eviction", async () => {
    // Capacity = 4 with 4 rows seeded. The new batch drops stableA from
    // desired and adds newE (with duplicates of the remaining stable rows
    // and the new key). stableB first carries an intermediate value and then
    // returns to its stored value, proving that the final duplicate wins.
    // Registering newE pushes the namespace over capacity,
    // so the keyed store evicts one of the equal-age stable rows by the
    // entry_key tiebreaker. For these literal keys stableC has the smallest
    // SHA-256 entry-key suffix and is the deterministic eviction victim.
    // The delete phase still attempts to remove absent stableA, and
    // reconcile restores the desired row that capacity evicted. Only newE
    // needs an initial register; collapsed duplicates do not manufacture
    // transient SQLite writes.
    const capacity = 4;
    const capacityNamespace = "dreaming-workspace-duplicate-capacity";
    configureCountedDreamingState({
      maxEntriesByNamespace: { [capacityNamespace]: capacity },
    });
    vi.useFakeTimers();
    try {
      const workspaceDir = await createWorkspace();
      const stableA = { key: "stable-a.txt", value: { path: "stable-a.txt", mtime: 1 } };
      const stableB = { key: "stable-b.txt", value: { path: "stable-b.txt", mtime: 2 } };
      const stableC = { key: "stable-c.txt", value: { path: "stable-c.txt", mtime: 3 } };
      const stableD = { key: "stable-d.txt", value: { path: "stable-d.txt", mtime: 4 } };
      const newE = { key: "new-e.txt", value: { path: "new-e.txt", mtime: 5 } };

      vi.setSystemTime(1_000);
      await writeMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
        entries: [stableA, stableB, stableC, stableD],
      });

      resetWriteCounts();
      vi.setSystemTime(2_000);
      await writeMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
        entries: [
          { ...stableB, value: { ...stableB.value, mtime: 99 } },
          stableB,
          stableC,
          stableC,
          stableD,
          stableD,
          newE,
          newE,
          newE,
        ],
      });

      // Exactly two registers and one delete: newE initially, plus one
      // re-register of the desired row that capacity eviction dropped (the
      // reconcile restores it). stableA is absent from desired and gets
      // removed after the capacity insertion evicts stableC. All duplicate
      // keys collapse to their final WorkspaceValue without transient writes.
      expect(writeCounts.register).toBe(2);
      expect(writeCounts.delete).toBe(1);

      const stored = await readMemoryCoreWorkspaceEntries({
        namespace: capacityNamespace,
        workspaceDir,
      });
      expect(stored).toHaveLength(capacity);
      expect(stored.map((row) => row.key).toSorted()).toEqual(
        ["new-e.txt", "stable-b.txt", "stable-c.txt", "stable-d.txt"].toSorted(),
      );
      expect(stored.find((row) => row.key === "stable-b.txt")?.value).toEqual(stableB.value);
      expect(stored.find((row) => row.key === "stable-c.txt")?.value).toEqual(stableC.value);
      expect(stored.find((row) => row.key === "stable-d.txt")?.value).toEqual(stableD.value);
      expect(stored.find((row) => row.key === "new-e.txt")?.value).toEqual(newE.value);
      expect(stored.find((row) => row.key === "stable-a.txt")).toBeUndefined();
    } finally {
      vi.useRealTimers();
      configureCountedDreamingState();
    }
  });

  it("writes only new daily state through the production light Dreaming sweep", async () => {
    const workspaceDir = await createWorkspace();
    const memoryDir = path.join(workspaceDir, "memory");
    await fs.mkdir(memoryDir, { recursive: true });
    await fs.writeFile(path.join(memoryDir, "2026-04-04.md"), "Alpha memory.\n", "utf-8");
    await fs.writeFile(path.join(memoryDir, "2026-04-05.md"), "Beta memory.\n", "utf-8");
    const pluginConfig = {
      dreaming: {
        enabled: true,
        timezone: "UTC",
        storage: { mode: "separate", separateReports: false },
        phases: {
          light: { enabled: true, limit: 20, lookbackDays: 7 },
          rem: { enabled: false, limit: 0, lookbackDays: 7 },
        },
      },
    };
    const runSweep = () =>
      runDreamingSweepPhases({
        workspaceDir,
        pluginConfig,
        logger: { info: () => {}, warn: () => {}, error: () => {} },
        nowMs: Date.parse("2026-04-05T10:05:00.000Z"),
      });

    resetWriteCounts();
    await runSweep();
    expect(namespaceWriteCounts(DREAMING_DAILY_INGESTION_NAMESPACE)).toEqual({
      register: 2,
      delete: 0,
    });

    await fs.writeFile(path.join(memoryDir, "2026-04-03.md"), "Gamma memory.\n", "utf-8");
    resetWriteCounts();
    await runSweep();
    expect(namespaceWriteCounts(DREAMING_DAILY_INGESTION_NAMESPACE)).toEqual({
      register: 1,
      delete: 0,
    });

    const stored = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
      workspaceDir,
    });
    expect(stored).toHaveLength(3);
  });
});
