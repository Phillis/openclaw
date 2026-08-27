import { createHash } from "node:crypto";
//#region src/shared/worker-bundle-hash.ts
const WORKER_BUNDLE_MANIFEST_VERSION = "openclaw-worker-bundle-v1";
const WORKER_BUNDLE_ENTRY_PATH = "worker.mjs";
const WORKER_BUNDLE_RSYNC_RECEIVER_PATH = "workspace-rsync-receiver.mjs";
function compareWorkerBundlePaths(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
/** Hashes the canonical worker manifest shared by Gateway bundles and node-local installs. */
function hashWorkerBundleManifest(entries) {
	const hash = createHash("sha256");
	hash.update(`${WORKER_BUNDLE_MANIFEST_VERSION}\0`);
	for (const entry of entries) hash.update(`${entry.path}\0${entry.mode.toString(8)}\0${entry.size}\0${entry.sha256}\0`);
	return hash.digest("hex");
}
//#endregion
export { hashWorkerBundleManifest as a, compareWorkerBundlePaths as i, WORKER_BUNDLE_MANIFEST_VERSION as n, WORKER_BUNDLE_RSYNC_RECEIVER_PATH as r, WORKER_BUNDLE_ENTRY_PATH as t };
