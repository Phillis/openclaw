import { a as isPathInside } from "./path-D138yf8v.js";
import "./file-access-runtime-DRZWsOJC.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-scan.ts
const MAX_CATALOG_JSON_CACHE_ENTRIES = 4e3;
const CLAUDE_CATALOG_IO_CONCURRENCY = 32;
const catalogJsonCache = /* @__PURE__ */ new Map();
async function mapConcurrent(values, limit, mapper) {
	const results = [];
	results.length = values.length;
	let nextIndex = 0;
	const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
		while (nextIndex < values.length) {
			const index = nextIndex++;
			results[index] = await mapper(values[index]);
		}
	});
	await Promise.all(workers);
	return results;
}
function setBoundedCache(cache, key, value, maxEntries) {
	cache.delete(key);
	cache.set(key, value);
	while (cache.size > maxEntries) {
		const oldest = cache.keys().next();
		if (oldest.done) break;
		cache.delete(oldest.value);
	}
}
async function safeSessionFile(root, resolvedRoot, candidate, sessionId) {
	if (!isPathInside(root, candidate) || path.basename(candidate) !== `${sessionId}.jsonl`) return;
	try {
		const resolvedCandidate = await fs.realpath(candidate);
		if (!isPathInside(resolvedRoot, resolvedCandidate)) return;
		const stat = await fs.stat(resolvedCandidate);
		return stat.isFile() ? {
			filePath: resolvedCandidate,
			stat
		} : void 0;
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw new Error("Claude session file validation failed", { cause: error });
	}
}
function safeSessionFileForScan(context, candidate, sessionId) {
	if (!context.resolvedRoot) return Promise.resolve(void 0);
	const key = `${sessionId}\0${path.resolve(candidate)}`;
	let pending = context.safeFiles.get(key);
	if (!pending) {
		pending = safeSessionFile(context.root, context.resolvedRoot, candidate, sessionId).catch(() => {
			context.complete = false;
			if (context.safeFiles.get(key) === pending) context.safeFiles.delete(key);
		});
		context.safeFiles.set(key, pending);
	}
	return pending;
}
async function readJsonFile(filePath, options = {}) {
	const stat = await fs.stat(filePath).catch(() => {
		options.onIoFailure?.();
	});
	if (!stat?.isFile()) {
		catalogJsonCache.delete(filePath);
		return;
	}
	const cached = catalogJsonCache.get(filePath);
	if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
		setBoundedCache(catalogJsonCache, filePath, cached, MAX_CATALOG_JSON_CACHE_ENTRIES);
		return cached.value;
	}
	let content;
	try {
		content = await fs.readFile(filePath, "utf8");
	} catch {
		options.onIoFailure?.();
		return;
	}
	try {
		const value = JSON.parse(content);
		setBoundedCache(catalogJsonCache, filePath, {
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			value
		}, MAX_CATALOG_JSON_CACHE_ENTRIES);
		return value;
	} catch {
		return;
	}
}
async function childDirectories(root) {
	try {
		return (await fs.readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
	} catch {
		return [];
	}
}
function projectsDir(homeDir, configDir) {
	return path.join(configDir ?? path.join(homeDir, ".claude"), "projects");
}
async function readProjectsTreeSnapshot(root) {
	let entries;
	try {
		entries = await fs.readdir(root, { withFileTypes: true });
	} catch {
		return {
			root,
			projectDirectories: [],
			treeStamp: "unavailable"
		};
	}
	const directoryEntries = entries.filter((entry) => entry.isDirectory());
	const [resolvedRoot, directories] = await Promise.all([fs.realpath(root).catch(() => void 0), mapConcurrent(directoryEntries, 32, async (entry) => {
		const directory = path.join(root, entry.name);
		const [stat, children] = await Promise.all([fs.stat(directory).catch(() => void 0), fs.readdir(directory, { withFileTypes: true }).catch(() => void 0)]);
		return {
			entry,
			directory,
			stat,
			children
		};
	})]);
	const childSignatures = await mapConcurrent(directories.flatMap(({ directory, children }, directoryIndex) => (children ?? []).map((child) => ({
		directoryIndex,
		directory,
		child
	}))), 32, async ({ directoryIndex, directory, child }) => {
		const childStat = await fs.stat(path.join(directory, child.name)).catch(() => void 0);
		return {
			directoryIndex,
			signature: childStat?.isFile() ? [
				child.name,
				childStat.mtimeMs,
				childStat.size,
				childStat.ino
			] : void 0
		};
	});
	const signaturesByDirectory = Array.from({ length: directories.length }, () => []);
	for (const { directoryIndex, signature } of childSignatures) if (signature) signaturesByDirectory[directoryIndex]?.push(signature);
	const directorySnapshots = directories.map(({ entry, directory, stat, children }, index) => {
		const fileSignatures = signaturesByDirectory[index] ?? [];
		const maxChildMtime = fileSignatures.reduce((maximum, [, mtime]) => Math.max(maximum ?? mtime, mtime), null);
		return {
			directory,
			childNames: children?.map((child) => child.name) ?? [],
			stamp: [
				entry.name,
				stat?.isDirectory() === true ? stat.mtimeMs : null,
				children?.map((child) => child.name) ?? null,
				maxChildMtime ?? null,
				fileSignatures
			]
		};
	});
	return {
		root,
		...resolvedRoot ? { resolvedRoot } : {},
		projectDirectories: directorySnapshots.map(({ directory, childNames }) => ({
			directory,
			childNames
		})),
		treeStamp: JSON.stringify([resolvedRoot ?? null, directorySnapshots.map(({ stamp }) => stamp)])
	};
}
async function desktopSessionStoreAvailable(homeDir) {
	return (await fs.stat(desktopSessionsDir(homeDir)).catch(() => void 0))?.isDirectory() === true;
}
function desktopSessionsDir(homeDir) {
	return path.join(homeDir, "Library", "Application Support", "Claude", "claude-code-sessions");
}
function currentHomeDir(env = process.env) {
	return env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
}
function configuredClaudeConfigDir(env = process.env) {
	const configured = env.CLAUDE_CONFIG_DIR?.trim();
	return configured ? path.resolve(configured) : void 0;
}
function gatewayClaudeScanOptions(allowProcessHomeFallback) {
	const configDir = configuredClaudeConfigDir();
	return {
		...configDir ? { configDir } : {},
		includeDesktop: allowProcessHomeFallback !== false
	};
}
//#endregion
export { desktopSessionStoreAvailable as a, mapConcurrent as c, readProjectsTreeSnapshot as d, safeSessionFileForScan as f, currentHomeDir as i, projectsDir as l, childDirectories as n, desktopSessionsDir as o, setBoundedCache as p, configuredClaudeConfigDir as r, gatewayClaudeScanOptions as s, CLAUDE_CATALOG_IO_CONCURRENCY as t, readJsonFile as u };
