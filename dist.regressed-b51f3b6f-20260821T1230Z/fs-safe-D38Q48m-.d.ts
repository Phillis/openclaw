import { i as RootDefaults, l as ReadResult, r as Root$1 } from "./root-impl-C4RbsRZF.js";
import fs from "node:fs";

//#region node_modules/@openclaw/fs-safe/dist/path.d.ts
declare function isPathInside(root: string, target: string): boolean;
//#endregion
//#region src/infra/fs-safe.d.ts
type Root = Omit<Root$1, "walk">;
declare function root(rootDir: string, defaults?: RootDefaults): Promise<Root>;
type ExternalFileWriteOptions = {
  rootDir: string;
  path: string;
  write: (tempPath: string) => Promise<void>;
  fallbackFileName?: string;
  tempPrefix?: string;
};
type ExternalFileWriteResult = {
  path: string;
};
declare function ensureAbsoluteDirectory(dirPath: string, options?: {
  scopeLabel?: string;
  mode?: number;
}): Promise<{
  ok: true;
  path: string;
} | {
  ok: false;
  error: Error;
}>;
declare function writeExternalFileWithinRoot(options: ExternalFileWriteOptions): Promise<ExternalFileWriteResult>;
/** @deprecated Use root(rootDir).read(relativePath, options). */
declare function readFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  rejectHardlinks?: boolean;
  nonBlockingRead?: boolean;
  allowSymlinkTargetWithinRoot?: boolean;
  maxBytes?: number;
}): Promise<ReadResult>;
/** @deprecated Use root(rootDir).write(relativePath, data, options). */
declare function writeFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mkdir?: boolean;
}): Promise<void>;
//#endregion
export { readFileWithinRoot as a, writeFileWithinRoot as c, ensureAbsoluteDirectory as i, isPathInside as l, ExternalFileWriteResult as n, root as o, Root as r, writeExternalFileWithinRoot as s, ExternalFileWriteOptions as t };