import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
import { a as updateConfigMachineState, r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
//#region src/infra/push-web-store.ts
const WEB_PUSH_VAPID_STATE_KEY = "webPush.vapidKeys";
const DEFAULT_WEB_PUSH_VAPID_SUBJECT = "https://openclaw.ai";
const WEB_PUSH_MAX_ENDPOINT_LENGTH = 2048;
const WEB_PUSH_MAX_KEY_LENGTH = 512;
function createWebPushVapidKeyPair(publicKey, privateKey, subject) {
	return {
		publicKey,
		privateKey,
		subject
	};
}
function webPushStateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
function hashWebPushEndpoint(endpoint) {
	return sha256HexPrefixCore(endpoint, 32);
}
function isValidWebPushEndpoint(endpoint) {
	if (!endpoint || endpoint.length > WEB_PUSH_MAX_ENDPOINT_LENGTH) return false;
	try {
		return new URL(endpoint).protocol === "https:";
	} catch {
		return false;
	}
}
function isValidWebPushKey(key) {
	return typeof key === "string" && key.length > 0 && key.length <= WEB_PUSH_MAX_KEY_LENGTH;
}
function webPushSubscriptionFromRow(row) {
	return {
		subscriptionId: row.subscription_id,
		endpoint: row.endpoint,
		keys: {
			p256dh: row.p256dh,
			auth: row.auth
		},
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
function webPushSubscriptionToRow(params) {
	return {
		endpoint_hash: params.endpointHash,
		subscription_id: params.subscription.subscriptionId,
		endpoint: params.subscription.endpoint,
		p256dh: params.subscription.keys.p256dh,
		auth: params.subscription.keys.auth,
		created_at_ms: params.subscription.createdAtMs,
		updated_at_ms: params.subscription.updatedAtMs
	};
}
function webPushSubscriptionsEqual(left, right) {
	return left.subscriptionId === right.subscriptionId && left.endpoint === right.endpoint && left.keys.p256dh === right.keys.p256dh && left.keys.auth === right.keys.auth && left.createdAtMs === right.createdAtMs && left.updatedAtMs === right.updatedAtMs;
}
function listWebPushSubscriptions(stateDir) {
	const database = openOpenClawStateDatabase(webPushStateDatabaseOptions(stateDir));
	const stateDb = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, stateDb.selectFrom("web_push_subscriptions").selectAll().orderBy("created_at_ms", "asc").orderBy("subscription_id", "asc")).rows.map(webPushSubscriptionFromRow);
}
/** Reread the endpoint row inside the write transaction before creating or updating it. */
function upsertWebPushSubscription(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const existingRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", params.endpointHash));
		if (existingRow && existingRow.endpoint !== params.endpoint) throw new Error("web push endpoint hash collision");
		const subscription = {
			subscriptionId: existingRow?.subscription_id ?? params.candidateSubscriptionId,
			endpoint: params.endpoint,
			keys: { ...params.keys },
			createdAtMs: existingRow?.created_at_ms ?? params.nowMs,
			updatedAtMs: params.nowMs
		};
		const row = webPushSubscriptionToRow({
			endpointHash: params.endpointHash,
			subscription
		});
		executeSqliteQuerySync(db, stateDb.insertInto("web_push_subscriptions").values(row).onConflict((conflict) => conflict.column("endpoint_hash").doUpdateSet({
			subscription_id: row.subscription_id,
			endpoint: row.endpoint,
			p256dh: row.p256dh,
			auth: row.auth,
			updated_at_ms: row.updated_at_ms
		})));
		return subscription;
	}, webPushStateDatabaseOptions(params.stateDir));
}
function deleteWebPushSubscriptionByEndpoint(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("web_push_subscriptions").where("endpoint_hash", "=", params.endpointHash).where("endpoint", "=", params.endpoint));
		return Number(result.numAffectedRows ?? 0) > 0;
	}, webPushStateDatabaseOptions(params.stateDir));
}
/** Delete an expired send target only if no newer registration replaced it in flight. */
function deleteWebPushSubscriptionIfCurrent(params) {
	const subscription = params.subscription;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("web_push_subscriptions").where("endpoint_hash", "=", params.endpointHash).where("subscription_id", "=", subscription.subscriptionId).where("endpoint", "=", subscription.endpoint).where("p256dh", "=", subscription.keys.p256dh).where("auth", "=", subscription.keys.auth).where("updated_at_ms", "=", subscription.updatedAtMs));
		return Number(result.numAffectedRows ?? 0) > 0;
	}, webPushStateDatabaseOptions(params.stateDir));
}
function readPersistedVapidKeyPair(stateDir) {
	return readConfigMachineState("webPush.vapidKeys", webPushStateDatabaseOptions(stateDir)) ?? null;
}
/** First committed keypair wins so concurrent gateway bootstraps share one signing identity. */
function insertVapidKeyPairIfAbsent(params) {
	return updateConfigMachineState(WEB_PUSH_VAPID_STATE_KEY, (current) => current ?? params.candidate, webPushStateDatabaseOptions(params.stateDir));
}
//#endregion
export { deleteWebPushSubscriptionIfCurrent as a, isValidWebPushEndpoint as c, readPersistedVapidKeyPair as d, upsertWebPushSubscription as f, webPushSubscriptionsEqual as h, deleteWebPushSubscriptionByEndpoint as i, isValidWebPushKey as l, webPushSubscriptionToRow as m, WEB_PUSH_VAPID_STATE_KEY as n, hashWebPushEndpoint as o, webPushSubscriptionFromRow as p, createWebPushVapidKeyPair as r, insertVapidKeyPairIfAbsent as s, DEFAULT_WEB_PUSH_VAPID_SUBJECT as t, listWebPushSubscriptions as u };
