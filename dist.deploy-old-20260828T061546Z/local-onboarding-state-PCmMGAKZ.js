import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { a as updateConfigMachineState, r as readConfigMachineState } from "./config-machine-state-DjliVw3j.js";
import path from "node:path";
//#region src/state/local-onboarding-state.ts
function stateKey(configPath) {
	return `onboarding.local.${sha256Hex(path.resolve(configPath))}`;
}
function normalizeState(value, configPath) {
	if (!isRecord(value) || value.version !== 1 || value.status !== "pending" && value.status !== "completed" || typeof value.runId !== "string" || !value.runId || value.configPath !== path.resolve(configPath) || typeof value.workspace !== "string" || !value.workspace || typeof value.securityAcknowledgedAt !== "string" || !value.securityAcknowledgedAt.trim() || typeof value.startedAtMs !== "number" || !Number.isFinite(value.startedAtMs) || value.status === "completed" && (typeof value.completedAtMs !== "number" || !Number.isFinite(value.completedAtMs))) return;
	return value;
}
function readLocalOnboardingState(configPath, database = {}) {
	return normalizeState(readConfigMachineState(stateKey(configPath), database), configPath);
}
/** A replaced config at the same path must never inherit another installation's receipt. */
function readLocalOnboardingStateForConfig(configPath, config, database = {}) {
	const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt?.trim();
	if (!securityAcknowledgedAt) return;
	const state = readLocalOnboardingState(configPath, database);
	return state?.securityAcknowledgedAt === securityAcknowledgedAt ? state : void 0;
}
/** Begin exactly at inference's commit boundary so failed probes create no recovery state. */
function beginLocalOnboarding(params) {
	const securityAcknowledgedAt = params.securityAcknowledgedAt.trim();
	if (!securityAcknowledgedAt) throw new Error("Local onboarding requires its persisted security acknowledgement.");
	const pending = {
		version: 1,
		status: "pending",
		runId: params.runId,
		configPath: path.resolve(params.configPath),
		workspace: path.resolve(params.workspace),
		securityAcknowledgedAt,
		startedAtMs: params.nowMs ?? Date.now()
	};
	return updateConfigMachineState(stateKey(params.configPath), (value) => {
		const current = normalizeState(value, params.configPath);
		if (current && (!params.replace || current.runId !== params.expectedRunId)) return current;
		return pending;
	}, params.database);
}
/** Complete only the owning run; a stale operation cannot close its replacement. */
function completeLocalOnboarding(params) {
	const current = readLocalOnboardingState(params.configPath, params.database);
	if (current?.runId !== params.runId) return false;
	if (current.status === "completed") return true;
	let completed = false;
	updateConfigMachineState(stateKey(params.configPath), (value) => {
		const latest = normalizeState(value, params.configPath);
		if (!latest) throw new Error("Local onboarding state became invalid before completion.");
		if (latest.runId !== params.runId) return latest;
		completed = true;
		return latest.status === "completed" ? latest : {
			...latest,
			status: "completed",
			completedAtMs: params.nowMs ?? Date.now()
		};
	}, params.database);
	return completed;
}
//#endregion
export { readLocalOnboardingStateForConfig as i, completeLocalOnboarding as n, readLocalOnboardingState as r, beginLocalOnboarding as t };
