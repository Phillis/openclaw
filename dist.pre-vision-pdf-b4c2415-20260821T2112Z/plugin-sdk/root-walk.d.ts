import { n as RootWalkOptions, t as RootWalkEntry } from "../root-walk-CF-XVT6a.js";

//#region src/infra/root-walk.d.ts
declare function walkRootDirectory(rootDir: string, relativePath: string, options: RootWalkOptions): AsyncGenerator<RootWalkEntry>;
//#endregion
export { type RootWalkEntry, type RootWalkOptions, walkRootDirectory };