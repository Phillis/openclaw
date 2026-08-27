import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import "./server-constants-DKuFNbQH.js";
import { t as formatForLog } from "./ws-log-CjO1AAG7.js";
import { n as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-BTqD8kB1.js";
import { t as getStatusSummary } from "./summary-D4gEnOC6.js";
import "./server-utils-BNa02-IQ.js";
//#region src/gateway/server-methods/health.ts
const ADMIN_SCOPE = "operator.admin";
const requestRefreshStartedAt = /* @__PURE__ */ new WeakMap();
function shouldScheduleRequestRefresh(refresh, now) {
	const startedAt = requestRefreshStartedAt.get(refresh);
	if (startedAt !== void 0 && !isFutureDateTimestampMs(startedAt, { nowMs: now }) && now - startedAt < 6e4) return false;
	requestRefreshStartedAt.set(refresh, now);
	return true;
}
function cachedLifecycleDiffersFromRuntime(params) {
	for (const key of [
		"running",
		"connected",
		"lifecycle"
	]) {
		const runtimeValue = params.runtimeSnapshot[key];
		if (runtimeValue !== void 0 && params.cachedAccount?.[key] !== runtimeValue) return true;
	}
	return params.cachedAccount === void 0;
}
/** Checks whether cached channel health is stale against the live runtime snapshot. */
function cachedHealthDiffersFromRuntime(cached, runtime) {
	for (const [channelId, runtimeSnapshot] of Object.entries(runtime.channels)) {
		if (!runtimeSnapshot) continue;
		const cachedChannel = cached.channels[channelId];
		if (cachedLifecycleDiffersFromRuntime({
			cachedAccount: cachedChannel,
			runtimeSnapshot
		})) return true;
	}
	for (const [channelId, accounts] of Object.entries(runtime.channelAccounts)) {
		if (!accounts) continue;
		const cachedAccounts = cached.channels[channelId]?.accounts;
		if (Object.keys(cachedAccounts ?? {}).some((accountId) => !Object.hasOwn(accounts, accountId))) return true;
		for (const [accountId, runtimeSnapshot] of Object.entries(accounts)) {
			if (!runtimeSnapshot) continue;
			if (cachedLifecycleDiffersFromRuntime({
				cachedAccount: cachedAccounts?.[accountId],
				runtimeSnapshot
			})) return true;
		}
	}
	return Object.keys(cached.channels).some((channelId) => !Object.hasOwn(runtime.channels, channelId) && !Object.hasOwn(runtime.channelAccounts, channelId));
}
/** Merges cheap live runtime facts into a cached health summary before responding. */
function mergeCachedHealthRuntimeState(params) {
	const { contextEngines: _cachedContextEngines, deliveryQueues: _cachedDeliveryQueues, ...cached } = params.cached;
	const deliveryQueues = buildDeliveryQueueHealthSummary(_cachedDeliveryQueues?.ingressPressure ?? []);
	const contextEngines = buildContextEngineHealthSummary();
	return {
		...cached,
		...params.eventLoop ? { eventLoop: params.eventLoop } : {},
		...contextEngines ? { contextEngines } : {},
		...deliveryQueues ? { deliveryQueues } : {},
		...params.configReloadHotReloadStatus ? { configReload: { hotReloadStatus: params.configReloadHotReloadStatus } } : {}
	};
}
/** Gateway handlers for health snapshots and status summaries. */
const healthHandlers = {
	health: async ({ respond, context, params, client }) => {
		const { getHealthCache, refreshHealthSnapshot, logHealth } = context;
		const wantsProbe = params?.probe === true;
		const includeSensitive = (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
		const now = Date.now();
		const cached = getHealthCache();
		let cachedDiffersFromRuntime = false;
		if (!wantsProbe && cached) try {
			cachedDiffersFromRuntime = cachedHealthDiffersFromRuntime(cached, context.getRuntimeSnapshot());
		} catch {
			cachedDiffersFromRuntime = true;
		}
		if (!wantsProbe && cached && !cachedDiffersFromRuntime && !isFutureDateTimestampMs(cached.ts, { nowMs: now }) && now - cached.ts < 6e4) {
			respond(true, mergeCachedHealthRuntimeState({
				cached,
				eventLoop: context.getEventLoopHealth?.(),
				configReloadHotReloadStatus: context.getConfigReloaderHotReloadStatus?.()
			}), void 0, { cached: true });
			if (shouldScheduleRequestRefresh(refreshHealthSnapshot, now)) refreshHealthSnapshot({
				probe: false,
				includeSensitive
			}).catch((err) => logHealth.error(`background health refresh failed: ${formatErrorMessage(err)}`));
			return;
		}
		try {
			respond(true, await refreshHealthSnapshot({
				probe: wantsProbe,
				includeSensitive
			}), void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	status: async ({ respond, client, params, context }) => {
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		const hostDesktopStatus = await context.hostDesktopService?.status();
		const status = await getStatusSummary({
			includeSensitive: scopes.includes(ADMIN_SCOPE),
			includeChannelSummary: params.includeChannelSummary !== false,
			...hostDesktopStatus ? { hostDesktopStatus } : {}
		});
		if (context.getEventLoopHealth) status.eventLoop = context.getEventLoopHealth();
		const memory = process.memoryUsage();
		status.processMemory = {
			rssBytes: memory.rss,
			heapUsedBytes: memory.heapUsed,
			heapTotalBytes: memory.heapTotal
		};
		respond(true, status, void 0);
	}
};
//#endregion
export { healthHandlers as t };
