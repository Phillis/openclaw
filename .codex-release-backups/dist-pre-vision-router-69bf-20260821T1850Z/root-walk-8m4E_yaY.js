import "./fs-safe-defaults-DOtRnikw.js";
import { i as root } from "./root-impl-DNOINk8h.js";
//#region src/infra/root-walk.ts
async function* walkRootDirectory(rootDir, relativePath, options) {
	yield* (await root(rootDir)).walk(relativePath, options);
}
//#endregion
export { walkRootDirectory as t };
