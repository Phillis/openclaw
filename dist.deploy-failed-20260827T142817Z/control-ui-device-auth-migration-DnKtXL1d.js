import { i as writeConfigMachineState, n as readConfigMachineState, r as updateConfigMachineState, t as importConfigMachineState } from "./config-machine-state-Da8Lk82e.js";
import { t as compareOpenClawVersions } from "./version-CG_bbh3U.js";
//#region src/state/control-ui-device-auth-migration.ts
const CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY = "gateway.controlUi.deviceAuthMigration";
const DEVICE_AUTH_MIGRATION_CUTOVER_VERSION = "2026.7.2";
function isFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
function normalizeState(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const candidate = value;
	if (candidate.version !== 1 || !isFiniteTimestamp(candidate.detectedAtMs)) return;
	if (candidate.status === "pending") {
		const claimedDeviceId = typeof candidate.claimedDeviceId === "string" && candidate.claimedDeviceId.trim() ? candidate.claimedDeviceId.trim() : void 0;
		const claimedAtMs = isFiniteTimestamp(candidate.claimedAtMs) ? candidate.claimedAtMs : void 0;
		return {
			version: 1,
			status: "pending",
			detectedAtMs: candidate.detectedAtMs,
			...claimedDeviceId && claimedAtMs !== void 0 ? {
				claimedDeviceId,
				claimedAtMs
			} : {}
		};
	}
	if (candidate.status === "completed" && isFiniteTimestamp(candidate.completedAtMs) && typeof candidate.deviceId === "string" && candidate.deviceId.trim()) return {
		version: 1,
		status: "completed",
		detectedAtMs: candidate.detectedAtMs,
		completedAtMs: candidate.completedAtMs,
		deviceId: candidate.deviceId.trim()
	};
}
function isLegacyControlUiDeviceAuthMigrationInput(params) {
	return params.disabledDeviceAuth && (typeof params.lastTouchedVersion !== "string" || compareOpenClawVersions(params.lastTouchedVersion, DEVICE_AUTH_MIGRATION_CUTOVER_VERSION) === -1);
}
function readControlUiDeviceAuthMigrationState(options = {}) {
	return normalizeState(readConfigMachineState(CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY, options));
}
/**
* Capture the shipped break-glass flag before Doctor removes it. Import semantics
* preserve a completed receipt so stale config cannot reopen migration access.
*/
function importPendingControlUiDeviceAuthMigration(options = {}) {
	const pending = {
		version: 1,
		status: "pending",
		detectedAtMs: Date.now()
	};
	importConfigMachineState([[CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY, pending]], options);
	return readControlUiDeviceAuthMigrationState(options) ?? pending;
}
function completeControlUiDeviceAuthMigration(deviceId, options = {}) {
	const normalizedDeviceId = deviceId.trim();
	if (!normalizedDeviceId) throw new Error("device auth migration completion requires a device id");
	const completed = {
		version: 1,
		status: "completed",
		detectedAtMs: readControlUiDeviceAuthMigrationState(options)?.detectedAtMs ?? Date.now(),
		completedAtMs: Date.now(),
		deviceId: normalizedDeviceId
	};
	writeConfigMachineState(CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY, completed, options);
	return completed;
}
function recoverControlUiDeviceAuthMigrationClaim(options = {}) {
	const initial = readControlUiDeviceAuthMigrationState(options);
	if (initial?.status !== "pending" || !initial.claimedDeviceId) return initial;
	return updateConfigMachineState(CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY, (raw) => {
		const current = normalizeState(raw) ?? initial;
		if (current?.status !== "pending" || !current.claimedDeviceId) return current;
		return {
			version: 1,
			status: "pending",
			detectedAtMs: current.detectedAtMs
		};
	}, options);
}
function claimControlUiDeviceAuthMigration(deviceId, options = {}) {
	const normalizedDeviceId = deviceId.trim();
	if (!normalizedDeviceId) return false;
	const initial = readControlUiDeviceAuthMigrationState(options);
	if (initial?.status !== "pending" || initial.claimedDeviceId) return false;
	let claimed = false;
	updateConfigMachineState(CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY, (raw) => {
		const current = normalizeState(raw) ?? initial;
		if (current?.status !== "pending" || current.claimedDeviceId) return current;
		claimed = true;
		return {
			...current,
			claimedDeviceId: normalizedDeviceId,
			claimedAtMs: Date.now()
		};
	}, options);
	return claimed;
}
function releaseControlUiDeviceAuthMigrationClaim(deviceId, options = {}) {
	const normalizedDeviceId = deviceId.trim();
	const initial = readControlUiDeviceAuthMigrationState(options);
	if (initial?.status !== "pending" || initial.claimedDeviceId !== normalizedDeviceId) return;
	updateConfigMachineState(CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY, (raw) => {
		const current = normalizeState(raw) ?? initial;
		if (current?.status !== "pending" || current.claimedDeviceId !== normalizedDeviceId) return current;
		return {
			version: 1,
			status: "pending",
			detectedAtMs: current.detectedAtMs
		};
	}, options);
}
//#endregion
export { isLegacyControlUiDeviceAuthMigrationInput as a, releaseControlUiDeviceAuthMigrationClaim as c, importPendingControlUiDeviceAuthMigration as i, claimControlUiDeviceAuthMigration as n, readControlUiDeviceAuthMigrationState as o, completeControlUiDeviceAuthMigration as r, recoverControlUiDeviceAuthMigrationClaim as s, CONTROL_UI_DEVICE_AUTH_MIGRATION_STATE_KEY as t };
