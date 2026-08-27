import { n as RootWalkOptions, t as RootWalkEntry } from "../root-walk-BEUkiTAa.js";

//#region src/infra/root-walk.d.ts
declare function walkRootDirectory(rootDir: string, relativePath: string, options: RootWalkOptions): AsyncGenerator<RootWalkEntry>;
//#endregion
export { type RootWalkEntry, type RootWalkOptions, walkRootDirectory };