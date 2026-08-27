import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Ba as validateWebPushTestParams, Ha as validateWebPushVapidPublicKeyParams, Rn as validatePushTestParams, Va as validateWebPushUnsubscribeParams, za as validateWebPushSubscribeParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { i as respondUnavailableOnThrow, t as respondInvalidParams } from "./nodes.helpers-CkPbEFOM.js";
import { c as loadApnsRegistration, g as resolveApnsRelayConfigFromEnv, i as clearApnsRegistrationIfCurrent, u as normalizeApnsEnvironment } from "./push-apns-store-BZ2NS8-f.js";
import { a as deleteWebPushSubscriptionIfCurrent, c as isValidWebPushEndpoint, d as readPersistedVapidKeyPair, f as upsertWebPushSubscription, i as deleteWebPushSubscriptionByEndpoint, l as isValidWebPushKey, o as hashWebPushEndpoint, r as createWebPushVapidKeyPair, s as insertVapidKeyPairIfAbsent, u as listWebPushSubscriptions } from "./push-web-store-D5iyml6w.js";
import { c as resolveApnsAuthConfigFromEnv, s as shouldClearStoredApnsRegistration, t as sendApnsAlert } from "./push-apns-DAt0Ha7N.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/push-web.ts
const LEGACY_WEB_PUSH_PATHS = ["push/web-push-subscriptions.json", "push/vapid-keys.json"];
const loadWebPushRuntime = createLazyRuntimeModule(() => import("web-push").then((mod) => mod.default ?? mod));
function legacyWebPushPathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function assertLegacyWebPushMigrationComplete(baseDir) {
	const stateDir = baseDir ?? resolveStateDir();
	if (LEGACY_WEB_PUSH_PATHS.find((relativePath) => {
		const sourcePath = path.join(stateDir, relativePath);
		return legacyWebPushPathMayExist(sourcePath) || legacyWebPushPathMayExist(`${sourcePath}.doctor-importing`);
	})) throw new Error(`legacy Web Push state requires migration; run \`openclaw doctor --fix\` before using Web Push`);
}
async function resolveVapidKeys(baseDir) {
	assertLegacyWebPushMigrationComplete(baseDir);
	const envPublic = resolveVapidPublicKeyFromEnv();
	const envPrivate = resolveVapidPrivateKeyFromEnv();
	if (envPublic && envPrivate) return {
		publicKey: envPublic,
		privateKey: envPrivate,
		subject: resolveVapidSubjectFromEnv()
	};
	const existing = readPersistedVapidKeyPair(baseDir);
	if (existing) return {
		...existing,
		subject: resolveVapidSubjectFromEnv()
	};
	const keys = (await loadWebPushRuntime()).generateVAPIDKeys();
	return {
		...insertVapidKeyPairIfAbsent({
			candidate: createWebPushVapidKeyPair(keys.publicKey, keys.privateKey, resolveVapidSubjectFromEnv()),
			nowMs: Date.now(),
			stateDir: baseDir
		}),
		subject: resolveVapidSubjectFromEnv()
	};
}
function resolveVapidSubjectFromEnv() {
	return normalizeOptionalString(process.env.OPENCLAW_VAPID_SUBJECT) ?? "https://openclaw.ai";
}
function resolveVapidPublicKeyFromEnv() {
	return normalizeOptionalString(process.env.OPENCLAW_VAPID_PUBLIC_KEY);
}
function resolveVapidPrivateKeyFromEnv() {
	return normalizeOptionalString(process.env.OPENCLAW_VAPID_PRIVATE_KEY);
}
async function registerWebPushSubscription(params) {
	const { endpoint, keys, baseDir } = params;
	if (!isValidWebPushEndpoint(endpoint)) throw new Error("invalid push subscription endpoint: must be an HTTPS URL under 2048 chars");
	if (!isValidWebPushKey(keys.p256dh) || !isValidWebPushKey(keys.auth)) throw new Error("invalid push subscription keys: must be non-empty strings under 512 chars");
	assertLegacyWebPushMigrationComplete(baseDir);
	return upsertWebPushSubscription({
		endpointHash: hashWebPushEndpoint(endpoint),
		endpoint,
		keys: {
			p256dh: keys.p256dh,
			auth: keys.auth
		},
		candidateSubscriptionId: randomUUID(),
		nowMs: Date.now(),
		stateDir: baseDir
	});
}
async function clearWebPushSubscriptionByEndpoint(endpoint, baseDir) {
	assertLegacyWebPushMigrationComplete(baseDir);
	return deleteWebPushSubscriptionByEndpoint({
		endpointHash: hashWebPushEndpoint(endpoint),
		endpoint,
		stateDir: baseDir
	});
}
function applyVapidDetails(webPush, keys) {
	webPush.setVapidDetails(keys.subject, keys.publicKey, keys.privateKey);
}
async function sendPreparedWebPushNotification(webPush, subscription, payload) {
	const pushSubscription = {
		endpoint: subscription.endpoint,
		keys: {
			p256dh: subscription.keys.p256dh,
			auth: subscription.keys.auth
		}
	};
	try {
		const result = await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
		return {
			ok: true,
			subscriptionId: subscription.subscriptionId,
			statusCode: result.statusCode
		};
	} catch (err) {
		const statusCode = typeof err === "object" && err !== null && "statusCode" in err ? err.statusCode : void 0;
		const message = typeof err === "object" && err !== null && "message" in err ? err.message : "unknown error";
		return {
			ok: false,
			subscriptionId: subscription.subscriptionId,
			statusCode,
			error: message
		};
	}
}
async function broadcastWebPush(payload, baseDir) {
	assertLegacyWebPushMigrationComplete(baseDir);
	const subscriptions = listWebPushSubscriptions(baseDir);
	if (subscriptions.length === 0) return [];
	const vapidKeys = await resolveVapidKeys(baseDir);
	const webPush = await loadWebPushRuntime();
	applyVapidDetails(webPush, vapidKeys);
	const mapped = (await Promise.allSettled(subscriptions.map((sub) => sendPreparedWebPushNotification(webPush, sub, payload)))).map((r, i) => r.status === "fulfilled" ? r.value : {
		ok: false,
		subscriptionId: expectDefined(subscriptions[i], "subscriptions entry at i").subscriptionId,
		error: r.reason instanceof Error ? r.reason.message : "unknown error"
	});
	const expiredSubscriptions = mapped.map((result, i) => ({
		result,
		sub: subscriptions[i]
	})).filter(({ result }) => !result.ok && (result.statusCode === 410 || result.statusCode === 404)).map(({ sub }) => expectDefined(sub, "push web sub"));
	for (const subscription of expiredSubscriptions) try {
		assertLegacyWebPushMigrationComplete(baseDir);
		deleteWebPushSubscriptionIfCurrent({
			endpointHash: hashWebPushEndpoint(subscription.endpoint),
			subscription,
			stateDir: baseDir
		});
	} catch {}
	return mapped;
}
//#endregion
//#region src/gateway/server-methods/push.ts
const pushHandlers = {
	"push.test": async ({ params, respond, context }) => {
		if (!validatePushTestParams(params)) {
			respondInvalidParams({
				respond,
				method: "push.test",
				validator: validatePushTestParams
			});
			return;
		}
		const nodeId = normalizeStringifiedOptionalString(params.nodeId) ?? "";
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		const title = normalizeOptionalString(params.title) ?? "OpenClaw";
		const body = normalizeOptionalString(params.body) ?? `Push test for node ${nodeId}`;
		await respondUnavailableOnThrow(respond, async () => {
			const registration = await loadApnsRegistration(nodeId);
			if (!registration) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node ${nodeId} has no APNs registration (connect iOS node first)`));
				return;
			}
			const overrideEnvironment = normalizeApnsEnvironment(params.environment);
			const result = registration.transport === "direct" ? await (async () => {
				const auth = await resolveApnsAuthConfigFromEnv(process.env);
				if (!auth.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, auth.error));
					return null;
				}
				return await sendApnsAlert({
					registration: {
						...registration,
						environment: overrideEnvironment ?? registration.environment
					},
					nodeId,
					title,
					body,
					auth: auth.value
				});
			})() : await (async () => {
				const relay = resolveApnsRelayConfigFromEnv(process.env, context.getRuntimeConfig().gateway, { registrationRelayOrigin: registration.relayOrigin });
				if (!relay.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, relay.error));
					return null;
				}
				return await sendApnsAlert({
					registration,
					nodeId,
					title,
					body,
					relayConfig: relay.value
				});
			})();
			if (!result) return;
			if (shouldClearStoredApnsRegistration({
				registration,
				result,
				overrideEnvironment
			})) await clearApnsRegistrationIfCurrent({
				nodeId,
				registration
			});
			respond(true, result, void 0);
		});
	},
	"push.web.vapidPublicKey": async ({ params, respond }) => {
		if (!validateWebPushVapidPublicKeyParams(params)) {
			respondInvalidParams({
				respond,
				method: "push.web.vapidPublicKey",
				validator: validateWebPushVapidPublicKeyParams
			});
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { vapidPublicKey: (await resolveVapidKeys()).publicKey }, void 0);
		});
	},
	"push.web.subscribe": async ({ params, respond }) => {
		if (!validateWebPushSubscribeParams(params)) {
			respondInvalidParams({
				respond,
				method: "push.web.subscribe",
				validator: validateWebPushSubscribeParams
			});
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { subscriptionId: (await registerWebPushSubscription({
				endpoint: params.endpoint,
				keys: params.keys
			})).subscriptionId }, void 0);
		});
	},
	"push.web.unsubscribe": async ({ params, respond }) => {
		if (!validateWebPushUnsubscribeParams(params)) {
			respondInvalidParams({
				respond,
				method: "push.web.unsubscribe",
				validator: validateWebPushUnsubscribeParams
			});
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { removed: await clearWebPushSubscriptionByEndpoint(params.endpoint) }, void 0);
		});
	},
	"push.web.test": async ({ params, respond }) => {
		if (!validateWebPushTestParams(params)) {
			respondInvalidParams({
				respond,
				method: "push.web.test",
				validator: validateWebPushTestParams
			});
			return;
		}
		const title = normalizeOptionalString(params.title) ?? "OpenClaw";
		const body = normalizeOptionalString(params.body) ?? "Web push test notification";
		await respondUnavailableOnThrow(respond, async () => {
			const results = await broadcastWebPush({
				title,
				body
			});
			if (results.length === 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "no web push subscriptions registered"));
				return;
			}
			if (!results.some((result) => result.ok)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "all web push deliveries failed", { details: { results } }));
				return;
			}
			respond(true, { results }, void 0);
		});
	}
};
//#endregion
export { pushHandlers };
