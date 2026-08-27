import { Et as array, Rn as string, Tn as object, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { h as runOpenClawStateWriteTransaction, jt as tableExists } from "./openclaw-state-db-DlCMR4eQ.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BixM8L1u.js";
import { d as resolveWorkspaceStateIdentity } from "./workspace-state-store-jYrit6Rg.js";
import { existsSync } from "node:fs";
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
	if (!existsSync(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env))) return null;
	return withOpenClawStateDatabaseReadOnly(({ db: database }) => {
		if (!tableExists(database, "onboarding_recommendations")) return null;
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("onboarding_recommendations").select([
			"inventory_hash",
			"matches_json",
			"offered_at_ms",
			"accepted_at_ms",
			"updated_at_ms"
		]).where("config_key", "=", configKey));
		if (!row) return null;
		return {
			inventoryHash: row.inventory_hash,
			matches: OnboardingRecommendationMatchesSchema.parse(JSON.parse(row.matches_json)),
			offeredAt: row.offered_at_ms,
			acceptedAt: row.accepted_at_ms,
			updatedAt: row.updated_at_ms
		};
	}, options);
}
function writeOnboardingRecommendationsOffer(configKey, params, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	const inventoryHash = hashOnboardingRecommendationInventory(params.inventory);
	const matches = OnboardingRecommendationMatchesSchema.parse(params.matches);
	const acceptedAt = params.answered ? nowMs : null;
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("onboarding_recommendations").select([
			"inventory_hash",
			"matches_json",
			"offered_at_ms",
			"accepted_at_ms",
			"updated_at_ms"
		]).where("config_key", "=", configKey));
		if (typeof existing?.accepted_at_ms === "number") return {
			inventoryHash: existing.inventory_hash,
			matches: OnboardingRecommendationMatchesSchema.parse(JSON.parse(existing.matches_json)),
			offeredAt: existing.offered_at_ms,
			acceptedAt: existing.accepted_at_ms,
			updatedAt: existing.updated_at_ms
		};
		executeSqliteQuerySync(database.db, db.insertInto("onboarding_recommendations").values({
			config_key: configKey,
			inventory_hash: inventoryHash,
			matches_json: JSON.stringify(matches),
			offered_at_ms: nowMs,
			accepted_at_ms: acceptedAt,
			updated_at_ms: nowMs
		}).onConflict((conflict) => conflict.column("config_key").doUpdateSet({
			inventory_hash: inventoryHash,
			matches_json: JSON.stringify(matches),
			offered_at_ms: nowMs,
			accepted_at_ms: acceptedAt,
			updated_at_ms: nowMs
		})));
		return {
			inventoryHash,
			matches,
			offeredAt: nowMs,
			acceptedAt,
			updatedAt: nowMs
		};
	}, databaseOptions, { operationLabel: "onboarding.recommendations.write" });
}
function acknowledgeOnboardingRecommendations(configKey, params = {}, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("onboarding_recommendations").select([
			"inventory_hash",
			"matches_json",
			"offered_at_ms",
			"accepted_at_ms",
			"updated_at_ms"
		]).where("config_key", "=", configKey));
		if (!existing) return null;
		if (params.expected && (existing.inventory_hash !== params.expected.inventoryHash || existing.matches_json !== JSON.stringify(params.expected.matches) || existing.offered_at_ms !== params.expected.offeredAt || existing.accepted_at_ms !== params.expected.acceptedAt || existing.updated_at_ms !== params.expected.updatedAt)) return null;
		if (typeof existing.accepted_at_ms !== "number") {
			let update = db.updateTable("onboarding_recommendations").set({
				accepted_at_ms: nowMs,
				updated_at_ms: nowMs
			}).where("config_key", "=", configKey);
			if (params.expected) update = update.where("inventory_hash", "=", params.expected.inventoryHash).where("matches_json", "=", JSON.stringify(params.expected.matches)).where("offered_at_ms", "=", params.expected.offeredAt).where("accepted_at_ms", "is", params.expected.acceptedAt).where("updated_at_ms", "=", params.expected.updatedAt);
			if ((executeSqliteQuerySync(database.db, update).numAffectedRows ?? 0n) === 0n) return null;
		}
		const acceptedAt = existing.accepted_at_ms ?? nowMs;
		return {
			inventoryHash: existing.inventory_hash,
			matches: OnboardingRecommendationMatchesSchema.parse(JSON.parse(existing.matches_json)),
			offeredAt: existing.offered_at_ms,
			acceptedAt,
			updatedAt: existing.accepted_at_ms == null ? nowMs : existing.updated_at_ms
		};
	}, databaseOptions, { operationLabel: "onboarding.recommendations.acknowledge" });
}
function updatePendingOnboardingRecommendations(configKey, params, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	const matches = OnboardingRecommendationMatchesSchema.parse(params.matches);
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("onboarding_recommendations").select([
			"inventory_hash",
			"matches_json",
			"offered_at_ms",
			"accepted_at_ms",
			"updated_at_ms"
		]).where("config_key", "=", configKey));
		if (!existing || typeof existing.accepted_at_ms === "number" || existing.inventory_hash !== params.expected.inventoryHash || existing.matches_json !== JSON.stringify(params.expected.matches) || existing.offered_at_ms !== params.expected.offeredAt || existing.accepted_at_ms !== params.expected.acceptedAt || existing.updated_at_ms !== params.expected.updatedAt) return null;
		if ((executeSqliteQuerySync(database.db, db.updateTable("onboarding_recommendations").set({
			matches_json: JSON.stringify(matches),
			updated_at_ms: nowMs
		}).where("config_key", "=", configKey).where("accepted_at_ms", "is", null).where("inventory_hash", "=", params.expected.inventoryHash).where("matches_json", "=", JSON.stringify(params.expected.matches)).where("offered_at_ms", "=", params.expected.offeredAt).where("updated_at_ms", "=", params.expected.updatedAt)).numAffectedRows ?? 0n) === 0n) return null;
		return {
			inventoryHash: existing.inventory_hash,
			matches,
			offeredAt: existing.offered_at_ms,
			acceptedAt: null,
			updatedAt: nowMs
		};
	}, databaseOptions, { operationLabel: "onboarding.recommendations.update-pending" });
}
function clearPendingOnboardingRecommendations(configKey, params, databaseOptions = {}) {
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		return (executeSqliteQuerySync(database.db, db.deleteFrom("onboarding_recommendations").where("config_key", "=", configKey).where("accepted_at_ms", "is", null).where("inventory_hash", "=", params.expected.inventoryHash).where("matches_json", "=", JSON.stringify(params.expected.matches)).where("offered_at_ms", "=", params.expected.offeredAt).where("updated_at_ms", "=", params.expected.updatedAt)).numAffectedRows ?? 0n) > 0n;
	}, databaseOptions, { operationLabel: "onboarding.recommendations.clear-pending" });
}
function clearOnboardingRecommendations(configKey, databaseOptions = {}) {
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		return (executeSqliteQuerySync(database.db, db.deleteFrom("onboarding_recommendations").where("config_key", "=", configKey)).numAffectedRows ?? 0n) > 0n;
	}, databaseOptions, { operationLabel: "onboarding.recommendations.clear" });
}
function createOnboardingRecommendationsStore(params) {
	const configKey = resolveWorkspaceStateIdentity(params.workspaceDir).workspaceKey;
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
