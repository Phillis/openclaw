import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import "./server-constants-DKuFNbQH.js";
import { t as formatForLog } from "./ws-log-ByzETCsI.js";
import { n as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-CXs1l4x3.js";
import { t as getStatusSummary } from "./summary-AXJmopc_.js";
import "./server-utils-DSzqMhGv.js";
//#region src/gateway/server-methods/health.ts
const ADMIN_SCOPE = "operator.admin";
const requestRefreshStartedAt = /* @__PURE__ */ new WeakMap();
function shouldScheduleRequestRefresh(refresh, now) {
	const startedAt = requestRefreshStartedAt.get(refresh);
	if (startedAt !== void 0 && now - startedAt < 6e4) return false;
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
	return false;
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
	return false;
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
			cachedDiffersFromRuntime = false;
		}
		if (!wantsProbe && cached && !cachedDiffersFromRuntime && now - cached.ts < 6e4) {
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
		respond(true, status, void 0);
	}
};
//#endregion
export { healthHandlers as t };
