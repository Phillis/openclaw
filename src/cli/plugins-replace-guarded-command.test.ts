import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Command } from "commander";
import JSZip from "jszip";
import { afterEach, describe, expect, it } from "vitest";
import {
  GUARDED_REPLACE_FAILURE_CODE,
  GuardedReplaceError,
  copyGuardedArchiveToCustody,
  hashGuardedPluginPayload,
  installGuardedReplace,
  installGuardedReplaceReconcile,
} from "../infra/install-guarded-replace.js";
import {
  loadInstalledPluginIndexInstallRecords,
  writePersistedInstalledPluginIndexInstallRecords,
} from "../plugins/installed-plugin-index-records.js";
import { withPluginLifecycleLease } from "../plugins/plugin-lifecycle-lease.js";
import { closeOpenClawStateDatabaseForTest } from "../state/openclaw-state-db.js";
import { registerPluginsCli } from "./plugins-cli.js";

const tempDirs: string[] = [];

afterEach(async () => {
  closeOpenClawStateDatabaseForTest();
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

function sha256(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function payloadFiles(version: string, marker: string, withOpenClawPeer = false) {
  return {
    "package.json": JSON.stringify({
      name: "demo",
      version,
      type: "module",
      ...(withOpenClawPeer ? { peerDependencies: { openclaw: "*" } } : {}),
      openclaw: { extensions: ["./index.js"] },
    }),
    "openclaw.plugin.json": JSON.stringify({
      id: "demo",
      name: "Demo",
      configSchema: { type: "object", additionalProperties: false },
    }),
    "index.js": `export default ${JSON.stringify(marker)};\n`,
  };
}

async function writePayload(root: string, files: Record<string, string>): Promise<void> {
  await fs.mkdir(root, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    await fs.writeFile(path.join(root, name), content);
  }
}

async function writeArchive(filePath: string, files: Record<string, string>): Promise<string> {
  const zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    zip.file(name, content);
  }
  const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await fs.writeFile(filePath, content);
  return sha256(content);
}

async function createFixture(
  options: { candidateFiles?: Record<string, string>; withOpenClawPeer?: boolean } = {},
) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-guarded-replace-"));
  tempDirs.push(root);
  const configDir = path.join(root, "config");
  const extensionsDir = path.join(configDir, "extensions");
  const targetDir = path.join(extensionsDir, "demo");
  const stateDir = path.join(root, "state-dir");
  const receiptDir = path.join(root, "receipts");
  const predecessorFiles = payloadFiles("1.0.0", "predecessor", options.withOpenClawPeer);
  const candidateFiles =
    options.candidateFiles ?? payloadFiles("2.0.0", "candidate", options.withOpenClawPeer);
  await writePayload(targetDir, predecessorFiles);
  if (options.withOpenClawPeer) {
    await fs.mkdir(path.join(targetDir, "node_modules"));
    await fs.symlink(process.cwd(), path.join(targetDir, "node_modules", "openclaw"), "dir");
  }
  await fs.mkdir(receiptDir, { recursive: true });
  const candidateArchive = path.join(root, "candidate.zip");
  const rollbackArchive = path.join(root, "rollback.zip");
  const candidateSha256 = await writeArchive(candidateArchive, candidateFiles);
  const rollbackSha256 = await writeArchive(rollbackArchive, predecessorFiles);
  const predecessorSha256 = await hashGuardedPluginPayload(targetDir);
  const env = {
    ...process.env,
    OPENCLAW_CONFIG_DIR: configDir,
    OPENCLAW_STATE_DIR: stateDir,
    OPENCLAW_VERSION: "2026.8.4",
    VITEST: "true",
  };
  await writePersistedInstalledPluginIndexInstallRecords(
    {
      demo: {
        source: "archive",
        sourcePath: rollbackArchive,
        installPath: targetDir,
        version: "1.0.0",
        installedAt: "2026-08-04T00:00:00.000Z",
      },
      companion: {
        source: "path",
        sourcePath: root,
        installPath: root,
        version: "9.0.0",
      },
    },
    { stateDir, env, config: {} },
  );
  let id = 0;
  return {
    root,
    extensionsDir,
    targetDir,
    stateDir,
    env,
    candidateArchive,
    candidateSha256,
    rollbackArchive,
    rollbackSha256,
    predecessorSha256,
    receiptPath: path.join(receiptDir, "replace.json"),
    createId: () => `00000000-0000-7000-8000-${String(++id).padStart(12, "0")}`,
  };
}

function transactionParams(fixture: Awaited<ReturnType<typeof createFixture>>) {
  return {
    candidateArchive: fixture.candidateArchive,
    candidateSha256: fixture.candidateSha256,
    expectedPredecessorSha256: fixture.predecessorSha256,
    pluginId: "demo",
    receiptPath: fixture.receiptPath,
    rollbackArchive: fixture.rollbackArchive,
    rollbackSha256: fixture.rollbackSha256,
    config: {},
    extensionsDir: fixture.extensionsDir,
    stateDir: fixture.stateDir,
    env: fixture.env,
    now: () => 1_775_520_000_000,
    createId: fixture.createId,
  };
}

describe("plugins replace-guarded transaction", () => {
  it("copies the opened archive bytes even when the caller pathname is replaced", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-guarded-custody-"));
    tempDirs.push(root);
    const source = path.join(root, "candidate.zip");
    const displaced = path.join(root, "candidate-original.zip");
    const custodyDir = path.join(root, "custody");
    const custody = path.join(custodyDir, "candidate.zip");
    const trusted = Buffer.from("trusted archive bytes");
    const replacement = Buffer.from("replacement archive bytes");
    await fs.writeFile(source, trusted);
    await fs.mkdir(custodyDir, { mode: 0o700 });

    await copyGuardedArchiveToCustody({
      sourcePath: source,
      custodyPath: custody,
      expectedSha256: sha256(trusted),
      label: "candidate archive",
      afterSourceOpen: async () => {
        await fs.rename(source, displaced);
        await fs.writeFile(source, replacement);
      },
    });

    await expect(fs.readFile(custody)).resolves.toEqual(trusted);
    await expect(fs.readFile(source)).resolves.toEqual(replacement);
  });

  it("hashes payloads deterministically and detects byte changes", async () => {
    const fixture = await createFixture();
    const copy = path.join(fixture.root, "copy");
    await writePayload(copy, payloadFiles("1.0.0", "predecessor"));
    await expect(hashGuardedPluginPayload(copy)).resolves.toBe(fixture.predecessorSha256);
    await fs.writeFile(path.join(copy, "index.js"), "export default 'changed';\n");
    await expect(hashGuardedPluginPayload(copy)).resolves.not.toBe(fixture.predecessorSha256);
  });

  it("rejects relative payload symlinks that escape the payload root", async () => {
    const fixture = await createFixture();
    const linkPath = path.join(fixture.targetDir, "escape");
    await fs.symlink(path.relative(fixture.targetDir, fixture.root), linkPath, "dir");

    await expect(hashGuardedPluginPayload(fixture.targetDir)).rejects.toMatchObject({
      code: GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
    });
  });

  it("reserves identity, stages guards, swaps, and commits the archive index record", async () => {
    const fixture = await createFixture();
    const receipt = await installGuardedReplace(transactionParams(fixture));

    expect(receipt.outcome).toBe("SUCCESS");
    expect(receipt.stages.map((stage) => stage.name)).toEqual([
      "IDENTITY_VERIFIED",
      "RECEIPT_RESERVED",
      "LEASE_HELD",
      "STAGED",
      "GUARDS_RAN",
      "PREDECESSOR_CAPTURED",
      "SWAP_PUBLISHED",
      "STATE_FINALIZED",
      "RECEIPT_FINALIZED",
    ]);
    expect(receipt.guards.map((guard) => guard.outcome)).toEqual([
      "PASS",
      "PASS",
      "PASS",
      "PASS",
      "PASS",
    ]);
    expect(await fs.readFile(path.join(fixture.targetDir, "index.js"), "utf8")).toContain(
      "candidate",
    );
    const records = await loadInstalledPluginIndexInstallRecords({
      stateDir: fixture.stateDir,
      env: fixture.env,
    });
    expect(records.demo).toMatchObject({
      source: "archive",
      sourcePath: fixture.candidateArchive,
      installPath: receipt.canonicalTarget.realPath,
      version: "2.0.0",
    });
    expect(records.companion?.version).toBe("9.0.0");
    await expect(fs.access(receipt.transactionRoot)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("preserves durable success when execution stops immediately after lease release", async () => {
    const fixture = await createFixture();
    await expect(
      installGuardedReplace({
        ...transactionParams(fixture),
        fault: "after-lease-release",
      }),
    ).rejects.toMatchObject({ code: GUARDED_REPLACE_FAILURE_CODE.FAULT_INJECTED });

    const receipt = JSON.parse(await fs.readFile(fixture.receiptPath, "utf8")) as {
      status: string;
      outcome: string;
      stages: Array<{ name: string }>;
      transactionRoot: string;
    };
    expect(receipt.status).toBe("COMPLETED");
    expect(receipt.outcome).toBe("SUCCESS");
    expect(receipt.stages.at(-1)?.name).toBe("RECEIPT_FINALIZED");
    await expect(fs.access(receipt.transactionRoot)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await fs.readFile(path.join(fixture.targetDir, "index.js"), "utf8")).toContain(
      "candidate",
    );
    const records = await loadInstalledPluginIndexInstallRecords({
      stateDir: fixture.stateDir,
      env: fixture.env,
    });
    expect(records.demo?.version).toBe("2.0.0");
  });

  it("preserves durable success and recovery artifacts when post-finalization cleanup fails", async () => {
    const fixture = await createFixture();
    await expect(
      installGuardedReplace({
        ...transactionParams(fixture),
        fault: "cleanup-failure",
      }),
    ).rejects.toMatchObject({ code: GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED });

    const receipt = JSON.parse(await fs.readFile(fixture.receiptPath, "utf8")) as {
      status: string;
      outcome: string;
      transactionRoot: string;
    };
    expect(receipt.status).toBe("COMPLETED");
    expect(receipt.outcome).toBe("SUCCESS");
    await expect(fs.access(receipt.transactionRoot)).resolves.toBeUndefined();
    expect(await fs.readFile(path.join(fixture.targetDir, "index.js"), "utf8")).toContain(
      "candidate",
    );
    const records = await loadInstalledPluginIndexInstallRecords({
      stateDir: fixture.stateDir,
      env: fixture.env,
    });
    expect(records.demo?.version).toBe("2.0.0");

    const reconciled = await installGuardedReplaceReconcile({
      receiptPath: fixture.receiptPath,
      extensionsDir: fixture.extensionsDir,
      stateDir: fixture.stateDir,
      env: fixture.env,
      config: {},
    });
    expect(reconciled.outcome).toBe("SUCCESS");
    await expect(fs.access(receipt.transactionRoot)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("replaces an archive plugin with the standard openclaw host peer link", async () => {
    const fixture = await createFixture({ withOpenClawPeer: true });
    const receipt = await installGuardedReplace(transactionParams(fixture));

    expect(receipt.outcome).toBe("SUCCESS");
    const linkPath = path.join(fixture.targetDir, "node_modules", "openclaw");
    expect((await fs.lstat(linkPath)).isSymbolicLink()).toBe(true);
    expect(await fs.realpath(linkPath)).toBe(await fs.realpath(process.cwd()));
    await expect(hashGuardedPluginPayload(fixture.targetDir)).resolves.toBe(
      receipt.finalInstalledSha256,
    );
  });

  it.each([
    ["candidate", { candidateSha256: "0".repeat(64) }],
    ["predecessor", { expectedPredecessorSha256: "1".repeat(64) }],
    ["rollback", { rollbackSha256: "2".repeat(64) }],
  ])("fails closed before receipt reservation for a wrong %s identity", async (_name, change) => {
    const fixture = await createFixture();
    await expect(
      installGuardedReplace({ ...transactionParams(fixture), ...change }),
    ).rejects.toBeInstanceOf(GuardedReplaceError);
    await expect(fs.access(fixture.receiptPath)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await hashGuardedPluginPayload(fixture.targetDir)).toBe(fixture.predecessorSha256);
  });

  it("fails closed before receipt reservation when the rollback archive is missing", async () => {
    const fixture = await createFixture();
    await fs.rm(fixture.rollbackArchive);
    await expect(installGuardedReplace(transactionParams(fixture))).rejects.toBeInstanceOf(
      GuardedReplaceError,
    );
    await expect(fs.access(fixture.receiptPath)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("rolls back a staged manifest guard failure without publishing candidate bytes", async () => {
    const fixture = await createFixture({
      candidateFiles: {
        "package.json": JSON.stringify({ name: "demo", version: "2.0.0" }),
        "index.js": "export default 'secret-payload-value';\n",
      },
    });
    await expect(installGuardedReplace(transactionParams(fixture))).rejects.toMatchObject({
      code: GUARDED_REPLACE_FAILURE_CODE.GUARD_FAILED,
    });
    expect(await hashGuardedPluginPayload(fixture.targetDir)).toBe(fixture.predecessorSha256);
    const receiptText = await fs.readFile(fixture.receiptPath, "utf8");
    expect(receiptText).toContain('"outcome": "ROLLED_BACK"');
    expect(receiptText).not.toContain("secret-payload-value");
  });

  it("rejects a rollback archive whose verified bytes do not reconstruct the predecessor", async () => {
    const fixture = await createFixture();
    const rollbackSha256 = await writeArchive(
      fixture.rollbackArchive,
      payloadFiles("1.0.0", "unrelated rollback payload"),
    );

    await expect(
      installGuardedReplace({ ...transactionParams(fixture), rollbackSha256 }),
    ).rejects.toMatchObject({ code: GUARDED_REPLACE_FAILURE_CODE.IDENTITY_MISMATCH });

    expect(await hashGuardedPluginPayload(fixture.targetDir)).toBe(fixture.predecessorSha256);
    const records = await loadInstalledPluginIndexInstallRecords({
      stateDir: fixture.stateDir,
      env: fixture.env,
    });
    expect(records.demo?.version).toBe("1.0.0");
  });

  it("aborts without touching the target when another lifecycle mutation owns the lease", async () => {
    const fixture = await createFixture();
    const entered = deferred();
    const release = deferred();
    const holder = withPluginLifecycleLease(
      { env: fixture.env, leaseMs: 1_000, waitMs: 3_000 },
      async () => {
        entered.resolve();
        await release.promise;
      },
    );
    await entered.promise;
    try {
      await expect(installGuardedReplace(transactionParams(fixture))).rejects.toMatchObject({
        code: GUARDED_REPLACE_FAILURE_CODE.LEASE_UNAVAILABLE,
      });
      expect(await hashGuardedPluginPayload(fixture.targetDir)).toBe(fixture.predecessorSha256);
      const receipt = JSON.parse(await fs.readFile(fixture.receiptPath, "utf8")) as {
        outcome: string;
      };
      expect(receipt.outcome).toBe("ABORTED");
    } finally {
      release.resolve();
      await holder;
    }
  });
});

describe("plugins replace-guarded CLI boundary", () => {
  it.each(["--force", "--marketplace", "--link", "--pin", "--dangerously-force-unsafe-install"])(
    "rejects forbidden option %s",
    async (option) => {
      const program = new Command().exitOverride();
      registerPluginsCli(program);
      await expect(
        program.parseAsync(
          [
            "plugins",
            "replace-guarded",
            "candidate.zip",
            "--id",
            "demo",
            "--candidate-sha256",
            "0".repeat(64),
            "--expected-predecessor-sha256",
            "1".repeat(64),
            "--rollback-archive",
            "rollback.zip",
            "--rollback-sha256",
            "2".repeat(64),
            "--receipt",
            "receipt.json",
            option,
          ],
          { from: "user" },
        ),
      ).rejects.toMatchObject({ code: "commander.unknownOption" });
    },
  );
});
