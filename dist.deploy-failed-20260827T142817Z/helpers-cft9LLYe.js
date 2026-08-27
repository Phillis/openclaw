import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import { t as appendRegularFile } from "./regular-file-CXw3t-8J.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./security-runtime-B0k67yNr.js";
import { t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET, u as markMigrationItemError } from "./migration-q6QzXKht.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/migrate-claude/helpers.ts
function resolveHomePath(input) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	return path.resolve(trimmed.replace(/^~(?=$|[\\/])/u, os.homedir()));
}
async function exists(filePath) {
	return await pathExists(filePath);
}
async function isDirectory(dirPath) {
	try {
		return (await fs.stat(dirPath)).isDirectory();
	} catch {
		return false;
	}
}
function sanitizeName(name) {
	return name.trim().toLowerCase().replaceAll(/[^a-z0-9._-]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
async function readText(filePath) {
	if (!filePath) return;
	try {
		return await fs.readFile(filePath, "utf8");
	} catch {
		return;
	}
}
async function readJsonObject(filePath) {
	const content = await readText(filePath);
	if (!content) return {};
	try {
		const parsed = JSON.parse(content);
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function childRecord(root, key) {
	const value = root?.[key];
	return isRecord(value) ? value : {};
}
async function appendItem(item) {
	if (!item.source || !item.target) return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
	try {
		const content = await fs.readFile(item.source, "utf8");
		const header = `\n\n<!-- Imported from Claude: ${typeof item.details?.sourceLabel === "string" ? item.details.sourceLabel : path.basename(item.source)} -->\n\n`;
		await fs.mkdir(path.dirname(item.target), { recursive: true });
		await appendRegularFile({
			filePath: item.target,
			content: `${header}${content.trimEnd()}\n`,
			rejectSymlinkParents: true
		});
		return {
			...item,
			status: "migrated"
		};
	} catch (err) {
		return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
	}
}
//#endregion
export { readJsonObject as a, sanitizeName as c, isDirectory as i, childRecord as n, readText as o, exists as r, resolveHomePath as s, appendItem as t };
