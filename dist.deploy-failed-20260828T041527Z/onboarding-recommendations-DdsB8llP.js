import { i as resolveWorkspaceStateIdentity } from "./workspace-state-identity-CMp50RGy.js";
import { Et as array, Rn as string, Tn as object, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { a as sha256Hex } from "./crypto-digest-IGAbV2KW.js";
import { a as updateConfigMachineState, r as readConfigMachineState, t as deleteConfigMachineState } from "./config-machine-state-DjliVw3j.js";
const OnboardingRecommendationMatchesSchema = array(object({
	appLabel: string(),
	candidateId: string(),
	tier: _enum(["recommended", "optional"]),
	reason: string(),
	candidate: object({
		id: string(),
		displayName: string(),
		summary: string(),
		source: _enum([
			"official-plugin",
			"official-channel",
			"official-provider",
			"clawhub-skill"
		]),
		downloads: number().optional()
	})
}));
function canonicalInventory(inventory) {
	return inventory.map((app) => ({
		label: app.label,
		...app.bundleId ? { bundleId: app.bundleId } : {}
	})).toSorted((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" }) || (left.bundleId ?? "").localeCompare(right.bundleId ?? ""));
}
function hashOnboardingRecommendationInventory(inventory) {
	return sha256Hex(JSON.stringify(canonicalInventory(inventory)));
}
function readOnboardingRecommendations(configKey, options = {}) {
	const record = readConfigMachineState(configKey, options);
	return record ? {
		...record,
		matches: OnboardingRecommendationMatchesSchema.parse(record.matches)
	} : null;
}
function matchesExpectedOnboardingRecommendations(current, expected) {
	return current.inventoryHash === expected.inventoryHash && JSON.stringify(current.matches) === JSON.stringify(expected.matches) && current.offeredAt === expected.offeredAt && current.acceptedAt === expected.acceptedAt && current.updatedAt === expected.updatedAt;
}
function writeOnboardingRecommendationsOffer(configKey, params, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	const inventoryHash = hashOnboardingRecommendationInventory(params.inventory);
	const matches = OnboardingRecommendationMatchesSchema.parse(params.matches);
	const acceptedAt = params.answered ? nowMs : null;
	return updateConfigMachineState(configKey, (existing) => {
		if (typeof existing?.acceptedAt === "number") return existing;
		return {
			inventoryHash,
			matches,
			offeredAt: nowMs,
			acceptedAt,
			updatedAt: nowMs
		};
	}, databaseOptions);
}
function acknowledgeOnboardingRecommendations(configKey, params = {}, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	let acknowledged = null;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing) return;
		if (params.expected && !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		acknowledged = typeof existing.acceptedAt === "number" ? existing : {
			...existing,
			acceptedAt: nowMs,
			updatedAt: nowMs
		};
		return acknowledged;
	}, databaseOptions);
	return acknowledged;
}
function updatePendingOnboardingRecommendations(configKey, params, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	const matches = OnboardingRecommendationMatchesSchema.parse(params.matches);
	let updated = null;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing || typeof existing.acceptedAt === "number" || !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		updated = {
			...existing,
			matches,
			updatedAt: nowMs
		};
		return updated;
	}, databaseOptions);
	return updated;
}
function clearPendingOnboardingRecommendations(configKey, params, databaseOptions = {}) {
	let cleared = false;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing || existing.acceptedAt !== null || !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		cleared = true;
	}, databaseOptions);
	return cleared;
}
function clearOnboardingRecommendations(configKey, databaseOptions = {}) {
	return deleteConfigMachineState(configKey, databaseOptions);
}
function createOnboardingRecommendationsStore(params) {
	const configKey = `onboarding.recommendations.${resolveWorkspaceStateIdentity(params.workspaceDir).workspaceKey}`;
	const database = params.database ?? {};
	return {
		read: () => readOnboardingRecommendations(configKey, database),
		writeOffer: (offer) => writeOnboardingRecommendationsOffer(configKey, offer, database),
		acknowledge: (options) => acknowledgeOnboardingRecommendations(configKey, options, database),
		updatePending: (options) => updatePendingOnboardingRecommendations(configKey, options, database),
		clearPending: (options) => clearPendingOnboardingRecommendations(configKey, options, database),
		clear: () => clearOnboardingRecommendations(configKey, database)
	};
}
//#endregion
export { createOnboardingRecommendationsStore as t };
