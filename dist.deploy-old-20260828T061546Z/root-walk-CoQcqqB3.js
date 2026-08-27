import "./fs-safe-defaults-BPVQr7Lx.js";
import { i as root } from "./root-impl-BbMR4leC.js";
//#region src/infra/root-walk.ts
async function* walkRootDirectory(rootDir, relativePath, options) {
	yield* (await root(rootDir)).walk(relativePath, options);
}
//#endregion
export { walkRootDirectory as t };
