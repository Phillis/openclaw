import { i as isNotFoundPathError } from "./path-D138yf8v.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region node_modules/@openclaw/fs-safe/dist/root-path-existing.js
function isFilesystemRoot(candidate) {
	return path.parse(candidate).root === candidate;
}
async function pathExists(targetPath) {
	try {
		await fs$1.lstat(targetPath);
		return true;
	} catch (error) {
		if (isNotFoundPathError(error)) return false;
		throw error;
	}
}
async function resolvePathViaExistingAncestor(targetPath) {
	const normalized = path.resolve(targetPath);
	let cursor = normalized;
	const missingSuffix = [];
	while (!isFilesystemRoot(cursor) && !await pathExists(cursor)) {
		missingSuffix.unshift(path.basename(cursor));
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	if (!await pathExists(cursor)) return normalized;
	try {
		const resolvedAncestor = path.resolve(await fs$1.realpath(cursor));
		return missingSuffix.length === 0 ? resolvedAncestor : path.resolve(resolvedAncestor, ...missingSuffix);
	} catch {
		return normalized;
	}
}
function resolvePathViaExistingAncestorSync(targetPath) {
	const normalized = path.resolve(targetPath);
	let cursor = normalized;
	const missingSuffix = [];
	while (!isFilesystemRoot(cursor) && !fs.existsSync(cursor)) {
		missingSuffix.unshift(path.basename(cursor));
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	if (!fs.existsSync(cursor)) return normalized;
	try {
		const resolvedAncestor = path.resolve(fs.realpathSync(cursor));
		return missingSuffix.length === 0 ? resolvedAncestor : path.resolve(resolvedAncestor, ...missingSuffix);
	} catch {
		return normalized;
	}
}
//#endregion
export { resolvePathViaExistingAncestorSync as n, resolvePathViaExistingAncestor as t };
