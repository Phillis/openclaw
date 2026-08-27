import { E as isMissingPathError } from "./redact-DP7p9QfH.js";
import "./fs-safe-defaults-DOtRnikw.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { i as root } from "./root-impl-DNOINk8h.js";
import "./errors-CqPTYU6G.js";
import path from "node:path";
//#region src/infra/fs-safe-remove.ts
async function listDirectoryEntries(root, relativePath) {
	return await root.list(relativePath, { withFileTypes: true });
}
function compareDirectoryEntryNames(left, right) {
	if (left.name === right.name) return 0;
	return left.name < right.name ? -1 : 1;
}
function isNotFoundError(error) {
	return isMissingPathError(error) || isMissingPathError(findPathAliasFilesystemCause(error));
}
function findPathAliasFilesystemCause(error) {
	if (error?.code !== "path-alias") return;
	const cause = error.cause;
	const causeCode = cause?.code;
	return typeof causeCode === "string" && /^E[A-Z0-9_]+$/u.test(causeCode) ? cause : void 0;
}
function relativeParentPath(relativePath) {
	const parentPath = path.dirname(relativePath);
	return parentPath === "." ? "" : parentPath;
}
function joinRootRelativePath(parentRelativePath, childName) {
	return parentRelativePath.length === 0 ? childName : path.join(parentRelativePath, childName);
}
async function findDirectoryEntry(root, relativePath) {
	const targetName = path.basename(relativePath);
	if (targetName.length === 0 || targetName === ".") return;
	return (await listDirectoryEntries(root, relativeParentPath(relativePath))).find((entry) => entry.name === targetName);
}
async function removeRootRelativePath(root, relativePath, suppressNotFound) {
	try {
		await root.remove(relativePath);
	} catch (error) {
		if (isNotFoundError(error)) {
			if (suppressNotFound) return;
			throw new FsSafeError("not-found", "file not found", { cause: error instanceof Error ? error : void 0 });
		}
		const filesystemCause = findPathAliasFilesystemCause(error);
		if (filesystemCause) throw filesystemCause;
		throw error;
	}
}
function assertNotSymbolicLink(relativePath, entry) {
	if (!entry.isSymbolicLink) return;
	throw new FsSafeError("symlink", `symlink not allowed: ${relativePath}`);
}
async function removeDirectoryEntry(root, relativePath, suppressNotFound) {
	const entry = await findDirectoryEntry(root, relativePath).catch((error) => {
		if (suppressNotFound && isNotFoundError(error)) return;
		throw error;
	});
	if (!entry) {
		await removeRootRelativePath(root, relativePath, suppressNotFound);
		return;
	}
	assertNotSymbolicLink(relativePath, entry);
	if (entry.isDirectory) {
		const children = (await listDirectoryEntries(root, relativePath).catch((error) => {
			if (suppressNotFound && isNotFoundError(error)) return;
			throw error;
		}))?.toSorted(compareDirectoryEntryNames);
		if (!children) {
			await removeRootRelativePath(root, relativePath, suppressNotFound);
			return;
		}
		for (const child of children) await removeDirectoryEntry(root, joinRootRelativePath(relativePath, child.name), suppressNotFound);
	}
	await removeRootRelativePath(root, relativePath, suppressNotFound);
}
async function removePathWithinRoot(params) {
	const root$1 = await root(params.rootDir);
	const suppressNotFound = params.force !== false;
	const recursive = params.recursive === true;
	const entry = await findDirectoryEntry(root$1, params.relativePath).catch((error) => {
		if (suppressNotFound && isNotFoundError(error)) return;
		throw error;
	});
	if (!entry) {
		await removeRootRelativePath(root$1, params.relativePath, suppressNotFound);
		return;
	}
	if (!recursive || !entry.isDirectory) {
		assertNotSymbolicLink(params.relativePath, entry);
		await removeRootRelativePath(root$1, params.relativePath, suppressNotFound);
		return;
	}
	await removeDirectoryEntry(root$1, params.relativePath, suppressNotFound);
}
//#endregion
export { removePathWithinRoot as t };
