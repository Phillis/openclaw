import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import "./fs-safe-X_oyl7Rx.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds } from "./agent-scope-config-CsnnOL14.js";
import { c as classifySessionKeyShape } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/path-case.ts
function swapAsciiCase(value) {
	return value.replace(/[A-Za-z]/g, (char) => {
		const lower = char.toLowerCase();
		return char === lower ? char.toUpperCase() : lower;
	});
}
function sameFsObject(a, b) {
	return a.dev === b.dev && a.ino === b.ino;
}
function probeDirectoryEntry(dir, name) {
	const swapped = swapAsciiCase(name);
	if (swapped === name) return;
	try {
		const names = fs.readdirSync(dir);
		if (names.includes(name) && names.includes(swapped)) return false;
		const original = fs.lstatSync(path.join(dir, name));
		try {
			return sameFsObject(original, fs.lstatSync(path.join(dir, swapped)));
		} catch (error) {
			const code = error.code;
			return code === "ENOENT" || code === "ENOTDIR" ? false : void 0;
		}
	} catch {
		return;
	}
}
function probeDirectoryContents(dir) {
	try {
		for (const name of fs.readdirSync(dir)) {
			const result = probeDirectoryEntry(dir, name);
			if (result !== void 0) return result;
		}
	} catch {
		return;
	}
}
function probeDirectoryWithTemporaryEntry(dir) {
	const name = `.openclaw-case-probe-${randomUUID()}`;
	const probePath = path.join(dir, name);
	let created = false;
	let result;
	try {
		fs.writeFileSync(probePath, "", {
			flag: "wx",
			mode: 384
		});
		created = true;
		result = probeDirectoryEntry(dir, name);
	} catch {
		result = void 0;
	}
	if (created) try {
		fs.unlinkSync(probePath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	return result;
}
function platformDefault() {
	return process.platform === "darwin" || process.platform === "win32";
}
function probeDirectory(dir) {
	return probeDirectoryContents(dir) ?? probeDirectoryWithTemporaryEntry(dir);
}
/** Resolves path-local case semantics, or undefined when the filesystem cannot be probed. */
function tryResolvePathCaseInsensitive(value) {
	const resolved = path.resolve(value);
	try {
		fs.lstatSync(resolved);
		const parent = path.dirname(resolved);
		return probeDirectoryEntry(parent, path.basename(resolved)) ?? probeDirectory(parent);
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return;
	}
	let candidate = path.dirname(resolved);
	for (;;) {
		let isDirectory = false;
		try {
			isDirectory = fs.statSync(candidate).isDirectory();
		} catch {}
		if (isDirectory) try {
			return probeDirectory(candidate);
		} catch {
			return;
		}
		const parent = path.dirname(candidate);
		if (parent === candidate) return;
		candidate = parent;
	}
}
/** Returns whether the target path's filesystem matches names case-insensitively. */
function isPathCaseInsensitive(value) {
	return tryResolvePathCaseInsensitive(value) ?? platformDefault();
}
//#endregion
//#region src/config/sessions/session-store-config.ts
const MAX_SYMLINK_HOPS = 64;
function splitPathSegments(value) {
	return value.split(path.sep).filter(Boolean);
}
function resolveMissingStorePathIdentity(pathname) {
	const absolutePath = path.resolve(pathname);
	let resolvedPath = path.parse(absolutePath).root;
	const remaining = splitPathSegments(absolutePath.slice(resolvedPath.length));
	const visitedLinks = /* @__PURE__ */ new Set();
	let symlinkHops = 0;
	while (remaining.length > 0) {
		const segment = remaining.shift();
		if (!segment || segment === ".") continue;
		if (segment === "..") {
			resolvedPath = path.dirname(resolvedPath);
			continue;
		}
		const candidate = path.join(resolvedPath, segment);
		let stat;
		try {
			stat = fs.lstatSync(candidate);
		} catch (error) {
			if (error.code !== "ENOENT") return;
			try {
				const canonicalAncestor = fs.realpathSync.native(resolvedPath);
				return path.resolve(canonicalAncestor, segment, ...remaining);
			} catch {
				return;
			}
		}
		if (!stat.isSymbolicLink()) {
			resolvedPath = candidate;
			continue;
		}
		const resolutionState = `${candidate}\0${remaining.join(path.sep)}`;
		if (symlinkHops >= MAX_SYMLINK_HOPS || visitedLinks.has(resolutionState)) return;
		visitedLinks.add(resolutionState);
		symlinkHops += 1;
		let target;
		try {
			target = fs.readlinkSync(candidate);
		} catch {
			return;
		}
		if (path.isAbsolute(target)) {
			resolvedPath = path.parse(target).root;
			remaining.unshift(...splitPathSegments(target.slice(resolvedPath.length)));
		} else remaining.unshift(...splitPathSegments(target));
	}
	try {
		return fs.realpathSync.native(resolvedPath);
	} catch {
		return;
	}
}
function isPerAgentSessionStoreConfig(storeConfig) {
	return !storeConfig?.trim() || storeConfig.includes("{agentId}");
}
function isSameFixedSessionStoreConfig(source, target, env) {
	if (isPerAgentSessionStoreConfig(source) || isPerAgentSessionStoreConfig(target)) return false;
	const sourcePath = path.resolve(resolveSessionStorePathCore(source, { env }));
	const targetPath = path.resolve(resolveSessionStorePathCore(target, { env }));
	if (sourcePath === targetPath) return true;
	try {
		return sameFileIdentity(fs.statSync(sourcePath, { bigint: true }), fs.statSync(targetPath, { bigint: true }));
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return true;
	}
	const sourceIdentity = resolveMissingStorePathIdentity(sourcePath);
	const targetIdentity = resolveMissingStorePathIdentity(targetPath);
	if (!sourceIdentity || !targetIdentity) return true;
	if (sourceIdentity === targetIdentity) return true;
	if (sourceIdentity.toLowerCase() !== targetIdentity.toLowerCase()) return false;
	const sourceCaseInsensitive = tryResolvePathCaseInsensitive(sourceIdentity);
	const targetCaseInsensitive = tryResolvePathCaseInsensitive(targetIdentity);
	if (sourceCaseInsensitive === false || targetCaseInsensitive === false) return false;
	return true;
}
//#endregion
//#region src/config/sessions/session-store-owner.ts
/** Preserves a retired fixed-store owner as an explicit unavailable state. */
function resolvePersistedSessionStoreOwner(config) {
	if (isPerAgentSessionStoreConfig(config.session?.store)) return { kind: "none" };
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	if (!persistedAgentId) return { kind: "none" };
	const agentId = normalizeAgentId(persistedAgentId);
	return listAgentIds(config).some((configuredAgentId) => normalizeAgentId(configuredAgentId) === agentId) ? {
		kind: "configured",
		agentId
	} : {
		kind: "retired",
		agentId
	};
}
/** Applies fixed-store ownership only to keys without an agent-qualified namespace. */
function resolvePersistedSessionStoreOwnerForKey(config, sessionKey) {
	return classifySessionKeyShape(sessionKey) === "legacy_or_alias" ? resolvePersistedSessionStoreOwner(config) : { kind: "none" };
}
/** Applies fixed-store ownership only when the concrete write target is that configured store. */
function resolvePersistedSessionStoreOwnerForTarget(params) {
	const owner = resolvePersistedSessionStoreOwnerForKey(params.config, params.sessionKey);
	if (owner.kind === "none" || !params.storePath) return owner;
	return isSameFixedSessionStoreConfig(params.config.session?.store, params.storePath, params.env ?? process.env) ? owner : { kind: "none" };
}
//#endregion
export { isSameFixedSessionStoreConfig as a, isPerAgentSessionStoreConfig as i, resolvePersistedSessionStoreOwnerForKey as n, isPathCaseInsensitive as o, resolvePersistedSessionStoreOwnerForTarget as r, resolvePersistedSessionStoreOwner as t };
