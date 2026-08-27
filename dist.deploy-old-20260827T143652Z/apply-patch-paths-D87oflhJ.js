import { i as resolveSandboxInputPath } from "./sandbox-paths-BihmZ4cR.js";
import path from "node:path";
//#region src/agents/apply-patch-targets.ts
const ADD_FILE_MARKER = "*** Add File: ";
const DELETE_FILE_MARKER = "*** Delete File: ";
const UPDATE_FILE_MARKER = "*** Update File: ";
const MOVE_TO_MARKER = "*** Move to: ";
function readPatchText(input) {
	if (typeof input === "string") return input;
	if (input && typeof input === "object" && "input" in input) {
		const candidate = input.input;
		return typeof candidate === "string" ? candidate : void 0;
	}
}
function normalizeMarkerHeaderLine(line) {
	if (line === void 0) return;
	const startTrimmed = line.trimStart();
	return startTrimmed.startsWith("***") ? startTrimmed.trimEnd() : void 0;
}
function readMarkerPath(line, marker) {
	const candidate = normalizeMarkerHeaderLine(line);
	return candidate?.startsWith(marker) ? candidate.slice(marker.length) : void 0;
}
/** Walk the executor-compatible envelope grammar without resolving its paths. */
function extractApplyPatchTargets(input) {
	const text = readPatchText(input);
	if (!text) return [];
	const lines = text.split(/\r?\n/);
	const targets = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines.at(index);
		const addPath = readMarkerPath(line, ADD_FILE_MARKER);
		if (addPath !== void 0) {
			targets.push({
				kind: "add",
				path: addPath
			});
			while (index + 1 < lines.length && lines.at(index + 1)?.startsWith("+")) index += 1;
			continue;
		}
		const deletePath = readMarkerPath(line, DELETE_FILE_MARKER);
		if (deletePath !== void 0) {
			targets.push({
				kind: "delete",
				path: deletePath
			});
			continue;
		}
		const updatePath = readMarkerPath(line, UPDATE_FILE_MARKER);
		if (updatePath === void 0) continue;
		targets.push({
			kind: "update",
			path: updatePath
		});
		let lookahead = index + 1;
		while (lookahead < lines.length && lines.at(lookahead)?.trim() === "") lookahead += 1;
		const movePath = readMarkerPath(lines.at(lookahead), MOVE_TO_MARKER);
		if (movePath !== void 0) {
			targets.push({
				kind: "move",
				path: movePath
			});
			lookahead += 1;
		}
		while (lookahead < lines.length) {
			const lookaheadLine = lines.at(lookahead);
			if (lookaheadLine === void 0 || lookaheadLine.startsWith("***")) break;
			lookahead += 1;
		}
		index = lookahead - 1;
	}
	return targets;
}
//#endregion
//#region src/agents/apply-patch-paths.ts
/**
* Path extraction for the apply_patch envelope grammar.
* Used by pre-execution policy hooks that only need destination paths, not the
* full strict patch parser.
*/
function normalizePatchPath(raw, options = {}) {
	if (raw.length === 0) return;
	const cwd = options.cwd ?? options.sandbox?.root ?? process.cwd();
	try {
		const resolved = options.sandbox ? options.sandbox.bridge.resolvePath({
			filePath: raw,
			cwd
		}) : void 0;
		const normalized = path.normalize(resolved ? resolved.hostPath ?? resolved.containerPath : resolveSandboxInputPath(raw, cwd));
		return normalized && normalized !== "." ? normalized : void 0;
	} catch {
		return;
	}
}
function pushPath(target, seen, raw, options) {
	const normalized = normalizePatchPath(raw, options);
	if (!normalized) return;
	if (seen.has(normalized)) return;
	seen.add(normalized);
	target.push(normalized);
}
/**
* Walk an apply_patch envelope and return every destination path found, in
* the order they appear. Duplicates are de-duplicated (the same file may be
* referenced multiple times within a single envelope). Returns `[]` for any
* input that is not a recognised envelope.
*/
function extractApplyPatchTargetPaths(input, options = {}) {
	const paths = [];
	const seen = /* @__PURE__ */ new Set();
	for (const target of extractApplyPatchTargets(input)) pushPath(paths, seen, target.path, options);
	return paths;
}
//#endregion
export { extractApplyPatchTargets as n, extractApplyPatchTargetPaths as t };
