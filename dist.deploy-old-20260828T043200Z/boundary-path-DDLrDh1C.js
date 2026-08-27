import "./fs-safe-defaults-BPVQr7Lx.js";
import { p as safeRealpathSync } from "./path-D138yf8v.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/boundary-path.ts
/** Returns a canonical path when resolvable, otherwise an absolute lexical path. */
function resolveRealpathOrAbsolute(value) {
	return safeRealpathSync(value) ?? path.resolve(value);
}
function resolveIdentityPathViaExistingAncestorSync(targetPath) {
	const fallback = path.resolve(targetPath);
	const missingSegments = [];
	let cursor = fallback;
	while (true) try {
		return path.join(fs.realpathSync.native(cursor), ...missingSegments.toReversed());
	} catch {
		const parent = path.dirname(cursor);
		if (parent === cursor) return fallback;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
//#endregion
export { resolveRealpathOrAbsolute as n, resolveIdentityPathViaExistingAncestorSync as t };
