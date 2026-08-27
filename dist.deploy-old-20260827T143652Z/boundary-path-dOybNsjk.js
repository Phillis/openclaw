import "./fs-safe-defaults-BPVQr7Lx.js";
import { p as safeRealpathSync } from "./path-D138yf8v.js";
import path from "node:path";
//#region src/infra/boundary-path.ts
/** Returns a canonical path when resolvable, otherwise an absolute lexical path. */
function resolveRealpathOrAbsolute(value) {
	return safeRealpathSync(value) ?? path.resolve(value);
}
//#endregion
export { resolveRealpathOrAbsolute as t };
