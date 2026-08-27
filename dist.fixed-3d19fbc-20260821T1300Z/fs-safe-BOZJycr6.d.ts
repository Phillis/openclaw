import { i as RootDefaults, r as Root$1, s as ReadResult } from "./root-impl-DkFIl388.js";

//#region src/infra/fs-safe.d.ts
type Root = Omit<Root$1, "walk">;
declare function root(rootDir: string, defaults?: RootDefaults): Promise<Root>;
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
export { root as n, writeFileWithinRoot as r, readFileWithinRoot as t };