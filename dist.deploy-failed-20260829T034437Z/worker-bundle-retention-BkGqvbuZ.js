import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
//#region src/gateway/worker-environments/worker-bundle-retention.ts
const TERMINAL_ENVIRONMENT_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"failed",
	"orphaned"
]);
const RECOVERY_BUNDLE_PLACEMENT_STATES = /* @__PURE__ */ new Set([
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling"
]);
function listRetainedWorkerBundleHashes(params) {
	return uniqueStrings([...params.environments.flatMap((record) => record.bootstrapReceipt && !TERMINAL_ENVIRONMENT_STATES.has(record.state) ? [record.bootstrapReceipt.bundleHash] : []), ...params.placements.flatMap((placement) => placement.workerBundleHash && RECOVERY_BUNDLE_PLACEMENT_STATES.has(placement.state) ? [placement.workerBundleHash] : [])]);
}
//#endregion
export { listRetainedWorkerBundleHashes as t };
