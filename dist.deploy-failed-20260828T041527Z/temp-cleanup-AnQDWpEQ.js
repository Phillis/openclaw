import { n as sameFileIdentityForCleanup } from "./file-identity-CaVBmM56.js";
import fs from "node:fs";
//#region node_modules/@openclaw/fs-safe/dist/temp-cleanup.js
const tempCleanupEntries = /* @__PURE__ */ new Map();
let cleanupRegistered = false;
function pathStillMatchesReceipt(entry) {
	if (!entry.identity) return false;
	try {
		return sameFileIdentityForCleanup(fs.lstatSync(entry.path, { bigint: true }), entry.identity);
	} catch (error) {
		return error.code === "ENOENT";
	}
}
function cleanupRegisteredTempPathsSync() {
	for (const entry of tempCleanupEntries.values()) try {
		if (pathStillMatchesReceipt(entry)) fs.rmSync(entry.path, {
			force: true,
			recursive: entry.recursive
		});
	} catch {}
	tempCleanupEntries.clear();
}
function registerTempPathForExit(tempPath, options) {
	if (!cleanupRegistered) {
		cleanupRegistered = true;
		process.once("exit", cleanupRegisteredTempPathsSync);
	}
	const entry = {
		path: tempPath,
		recursive: options?.recursive === true,
		identity: options?.identity
	};
	if (!entry.identity) try {
		entry.identity = fs.lstatSync(tempPath, { bigint: true });
	} catch {}
	tempCleanupEntries.set(tempPath, entry);
	const unregister = (() => {
		tempCleanupEntries.delete(tempPath);
	});
	unregister.setIdentity = (identity) => {
		entry.identity = identity;
	};
	return unregister;
}
//#endregion
export { registerTempPathForExit as t };
