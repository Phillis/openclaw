import { o as SymlinkPolicy, s as ReadResult, t as HardlinkPolicy } from "../root-impl-DRDYcBUl.js";
import { n as FileIdentityStat, t as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-mAiu1cbv.js";
import { n as root, r as writeFileWithinRoot, t as readFileWithinRoot } from "../fs-safe-C0fyezJy.js";
import { Stats } from "node:fs";
//#region node_modules/@openclaw/fs-safe/dist/absolute-path.d.ts
declare function canonicalPathFromExistingAncestor(filePath: string): Promise<string>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/local-roots.d.ts
type LocalRootsReadResult = ReadResult & {
  root: string;
};
type LocalRootsInputOptions = {
  filePath: string;
  roots: readonly string[];
  label?: string;
};
type ReadLocalFileFromRootsOptions = LocalRootsInputOptions & {
  hardlinks?: HardlinkPolicy;
  maxBytes?: number;
  nonBlockingRead?: boolean;
  symlinks?: SymlinkPolicy;
};
declare function readLocalFileFromRoots(options: ReadLocalFileFromRootsOptions): Promise<LocalRootsReadResult | null>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/local-file-access.d.ts
declare function safeFileURLToPath(fileUrl: string, platform?: NodeJS.Platform): string;
declare function basenameFromMediaSource(source?: string): string | undefined;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path.d.ts
declare function isPathInside(root: string, target: string): boolean;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/directory-durability.d.ts
type DirectorySyncOutcome = {
  status: "synced";
} | {
  status: "unsupported";
  code?: string;
};
type DirectoryReceipt = {
  path: string;
  realPath: string;
  identity: Stats;
};
type DurableDirectoryReceipt = DirectoryReceipt & {
  parentSync: DirectorySyncOutcome | {
    status: "not-needed";
  };
};
type EnsureDurableDirectoryOptions = {
  directoryPath: string;
  label?: string;
  mode?: number;
  expectedExistingIdentity?: FileIdentityStat;
  create?: (directoryPath: string) => Promise<void>;
};
declare function syncDirectory(directory: string | DirectoryReceipt, options?: {
  label?: string;
}): Promise<DirectorySyncOutcome>;
declare function ensureDurableDirectory(options: EnsureDurableDirectoryOptions): Promise<DurableDirectoryReceipt>;
//#endregion
//#region src/infra/fs-safe-remove.d.ts
declare function removePathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  recursive?: boolean;
  force?: boolean;
}): Promise<void>;
//#endregion
//#region src/infra/path-guards.d.ts
/** Returns true only when target is a descendant of root, not root itself. */
declare function isPathStrictlyInside(root: string, target: string): boolean;
//#endregion
export { type DirectorySyncOutcome, basenameFromMediaSource, canonicalPathFromExistingAncestor, ensureDurableDirectory, isPathInside, isPathStrictlyInside, readFileWithinRoot, readLocalFileFromRoots, removePathWithinRoot, resolvePreferredOpenClawTmpDir, root, safeFileURLToPath, syncDirectory, writeFileWithinRoot };