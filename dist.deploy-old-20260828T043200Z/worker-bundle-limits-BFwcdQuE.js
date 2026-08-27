//#region src/shared/worker-bundle-limits.ts
const MAX_WORKER_BUNDLE_ARCHIVE_BYTES = 512 * 1024 * 1024;
const DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS = {
	maxEntries: 25e4,
	maxExpandedBytes: 2 * 1024 * 1024 * 1024
};
//#endregion
export { MAX_WORKER_BUNDLE_ARCHIVE_BYTES as n, DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS as t };
