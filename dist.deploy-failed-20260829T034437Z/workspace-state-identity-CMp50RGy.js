import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/workspace-state-identity.ts
const MAX_WORKSPACE_IDENTITY_SYMLINKS = 40;
function normalizeWorkspaceIdentityPath(value) {
	const normalized = path.normalize(value).normalize("NFC");
	return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function canonicalizeWorkspacePath(workspaceDir, normalizePath) {
	const fallback = normalizePath(path.resolve(resolveUserPath(workspaceDir)));
	let candidate = fallback;
	const followedSymlinks = /* @__PURE__ */ new Set();
	for (let redirectCount = 0; redirectCount < MAX_WORKSPACE_IDENTITY_SYMLINKS; redirectCount += 1) {
		const missingSegments = [];
		let current = candidate;
		while (true) {
			try {
				return normalizePath(path.join(fs.realpathSync.native(current), ...missingSegments.toReversed()));
			} catch {}
			try {
				if (fs.lstatSync(current).isSymbolicLink()) {
					const normalizedLink = normalizePath(current);
					if (followedSymlinks.has(normalizedLink)) return fallback;
					followedSymlinks.add(normalizedLink);
					candidate = path.resolve(path.dirname(current), fs.readlinkSync(current), ...missingSegments.toReversed());
					break;
				}
			} catch {}
			const parent = path.dirname(current);
			if (parent === current) return fallback;
			missingSegments.push(path.basename(current));
			current = parent;
		}
	}
	return fallback;
}
function resolveCanonicalWorkspacePath(workspaceDir) {
	return canonicalizeWorkspacePath(workspaceDir, path.normalize);
}
function createWorkspaceStateIdentity(workspacePath) {
	return {
		workspacePath,
		workspaceKey: createHash("sha256").update(workspacePath).digest("hex")
	};
}
function resolveWorkspaceStateAliases(workspaceDir) {
	const lexicalPath = normalizeWorkspaceIdentityPath(path.resolve(resolveUserPath(workspaceDir)));
	const canonicalPath = canonicalizeWorkspacePath(workspaceDir, normalizeWorkspaceIdentityPath);
	return [.../* @__PURE__ */ new Set([lexicalPath, canonicalPath])].map(createWorkspaceStateIdentity);
}
function resolveWorkspaceStateIdentity(workspaceDir) {
	return createWorkspaceStateIdentity(canonicalizeWorkspacePath(workspaceDir, normalizeWorkspaceIdentityPath));
}
//#endregion
export { resolveWorkspaceStateIdentity as i, resolveCanonicalWorkspacePath as n, resolveWorkspaceStateAliases as r, createWorkspaceStateIdentity as t };
