import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside, p as safeRealpathSync } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import "./boundary-path-DDLrDh1C.js";
import path from "node:path";
//#region src/skills/loading/symlink-targets.ts
function resolveAllowedSkillSymlinkTargetRealPaths(config) {
	return uniqueStrings((config?.skills?.load?.allowSymlinkTargets ?? []).map((dir) => normalizeOptionalString(dir) ?? "").filter(Boolean).map((dir) => safeRealpathSync(resolveUserPath(dir))).filter((dir) => Boolean(dir)));
}
function findContainingAllowedSkillSymlinkTarget(rootRealPaths, candidateRealPath) {
	const resolvedCandidate = path.resolve(candidateRealPath);
	for (const rootRealPath of rootRealPaths) {
		const resolvedRoot = path.resolve(rootRealPath);
		if (isPathInside(resolvedRoot, resolvedCandidate)) return resolvedRoot;
	}
	return null;
}
const tryRealpath = safeRealpathSync;
//#endregion
export { resolveAllowedSkillSymlinkTargetRealPaths as n, tryRealpath as r, findContainingAllowedSkillSymlinkTarget as t };
