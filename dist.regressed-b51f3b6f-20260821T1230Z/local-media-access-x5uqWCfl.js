import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { r as readFileHandleBounded } from "./bounded-read-pTKvsUkY.js";
import { a as assertNoWindowsNetworkPath } from "./read-open-flags-DGgM-BoE.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./fs-safe-C9N8pCh1.js";
import { n as openLocalFileSafely } from "./root-impl-YIsYOvqy.js";
import "./path-guards-fBZukd5S.js";
import "./local-file-access-C2hsuc07.js";
import { o as resolveInboundMediaReference, t as MediaReferenceError } from "./media-reference-BeABx1cr.js";
import { a as resolveInboundPathRoot } from "./inbound-path-policy-DQ5Rksw7.js";
import { i as getDefaultMediaLocalRoots } from "./local-roots-Beya70q2.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/media/local-media-access.ts
/** Error raised when a local media path escapes the configured allowlist. */
var LocalMediaAccessError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "LocalMediaAccessError";
	}
};
/** Returns the default root allowlist for local media reads. */
function getDefaultLocalRootsCore() {
	return getDefaultMediaLocalRoots();
}
async function resolveCanonicalBoundaryPath(root) {
	const resolved = path.resolve(root);
	try {
		return await fs.realpath(resolved);
	} catch {
		return resolved;
	}
}
/** Resolves an allowlist once for callers that validate several media paths. */
async function resolveLocalMediaRoots(localRoots) {
	const roots = localRoots ?? getDefaultLocalRootsCore();
	return await Promise.all(roots.map(async (root) => {
		const resolvedRoot = await resolveCanonicalBoundaryPath(root);
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		return resolvedRoot;
	}));
}
async function resolveLocalMediaPathForContainment(mediaPath) {
	try {
		return await fs.realpath(mediaPath);
	} catch {
		try {
			return path.join(await fs.realpath(path.dirname(mediaPath)), path.basename(mediaPath));
		} catch {
			return path.resolve(mediaPath);
		}
	}
}
async function resolveLocalMediaBoundary(mediaPath, localRoots, managedReferenceErrors, options) {
	if (localRoots === "any") return {
		rejectHardlinks: false,
		roots: "any"
	};
	let inboundReference;
	try {
		inboundReference = await resolveInboundMediaReference(mediaPath);
	} catch (err) {
		if (managedReferenceErrors === "reject" && err instanceof MediaReferenceError) throw new LocalMediaAccessError(err.code, err.message, { cause: err });
		if (!(err instanceof MediaReferenceError)) throw err;
	}
	if (inboundReference) return {
		rejectHardlinks: true,
		roots: await resolveLocalMediaRoots([path.dirname(inboundReference.physicalPath)])
	};
	try {
		assertNoWindowsNetworkPath(mediaPath, "Local media path");
	} catch (err) {
		throw new LocalMediaAccessError("network-path-not-allowed", err.message, { cause: err });
	}
	const matchedInboundRoot = options?.inboundRoots?.length ? resolveInboundPathRoot({
		filePath: mediaPath,
		roots: options.inboundRoots
	}) : void 0;
	if (matchedInboundRoot) {
		const resolvedAnchor = await resolveCanonicalBoundaryPath(matchedInboundRoot.anchorRoot);
		const resolvedRoot = await resolveCanonicalBoundaryPath(matchedInboundRoot.matchedRoot);
		if (!isPathInside(resolvedAnchor, resolvedRoot)) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
		return {
			rejectHardlinks: true,
			roots: [resolvedRoot]
		};
	}
	const roots = localRoots ?? getDefaultLocalRootsCore();
	const resolved = await resolveLocalMediaPathForContainment(mediaPath);
	if (localRoots === void 0) {
		const workspaceRoot = roots.find((root) => path.basename(root) === "workspace");
		if (workspaceRoot) {
			const stateDir = path.dirname(workspaceRoot);
			const rel = path.relative(stateDir, resolved);
			if (rel && isPathInside(stateDir, resolved)) {
				if ((rel.split(path.sep)[0] ?? "").startsWith("workspace-")) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
			}
		}
	}
	const resolvedRoots = options?.resolvedRoots ?? await options?.resolveRoots?.() ?? await resolveLocalMediaRoots(roots);
	for (const [index, resolvedRoot] of resolvedRoots.entries()) {
		const root = roots[index] ?? resolvedRoot;
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		if (isPathInside(resolvedRoot, resolved)) return {
			rejectHardlinks: false,
			roots: resolvedRoots
		};
	}
	throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
}
/** Verifies that a local media path is managed inbound media or lives under allowed roots. */
async function assertLocalMediaAllowed(mediaPath, localRoots, options) {
	await resolveLocalMediaBoundary(mediaPath, localRoots, "ignore", options);
}
/** Opens, revalidates, and bounded-reads local media against one frozen root boundary. */
async function readLocalMediaFile(mediaPath, localRoots, options) {
	const boundary = await resolveLocalMediaBoundary(mediaPath, localRoots, "reject", options);
	const opened = await openLocalFileSafely({ filePath: mediaPath });
	try {
		if (boundary.roots !== "any" && !boundary.roots.some((resolvedRoot) => isPathInside(resolvedRoot, opened.realPath))) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
		if (boundary.rejectHardlinks && opened.stat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
		if (opened.stat.size > options.maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${options.maxBytes} bytes (got ${opened.stat.size})`);
		return await readFileHandleBounded(opened.handle, options.maxBytes);
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
//#endregion
export { resolveLocalMediaRoots as a, readLocalMediaFile as i, assertLocalMediaAllowed as n, getDefaultLocalRootsCore as r, LocalMediaAccessError as t };
