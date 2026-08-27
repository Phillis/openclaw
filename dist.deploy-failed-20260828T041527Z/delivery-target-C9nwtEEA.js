import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-Dbglb2uR.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-azPdmUls.js";
import "./session-accessor-fcDZuc2H.js";
import { r as stripTargetProviderPrefix } from "./channel-target-prefix-ByHwV3qn.js";
import { t as resolveSessionDeliveryTarget } from "./targets-session-DKfWn83k.js";
import { r as isReservedTargetLiteralError } from "./target-errors-CmkAS9Ko.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BcM5GBXo.js";
import { n as resolveCronStoredDeliveryContext } from "./delivery-context-BTIO8GUN.js";
import { t as resolveOutboundTargetWithPlugin } from "./targets-resolve-shared-DQEDRdvi.js";
//#region src/infra/outbound/targets-loaded.ts
/** Resolves targets through an already-loaded channel plugin without bootstrap discovery. */
function tryResolveLoadedOutboundTarget(params) {
	return resolveOutboundTargetWithPlugin({
		plugin: getLoadedChannelPluginForRead(params.channel),
		target: params
	});
}
//#endregion
//#region src/cron/isolated-agent/delivery-target.ts
/** Resolves isolated cron delivery requests into concrete outbound targets. */
const targetsRuntimeLoader = createLazyImportLoader(() => import("./targets.runtime.js"));
async function resolveOutboundTargetWithRuntime(params) {
	try {
		const loaded = tryResolveLoadedOutboundTarget(params);
		if (loaded) return loaded;
		const { resolveOutboundTarget } = await targetsRuntimeLoader.load();
		return resolveOutboundTarget({
			...params,
			allowBootstrap: true
		});
	} catch (err) {
		return {
			ok: false,
			error: /* @__PURE__ */ new Error(`Invalid delivery target: ${formatErrorMessage(err)}`)
		};
	}
}
const channelSelectionRuntimeLoader = createLazyImportLoader(() => import("./channel-selection.runtime.js"));
const deliveryTargetRuntimeLoader = createLazyImportLoader(() => import("./delivery-target.runtime.js"));
function isNonEmptyThreadId(value) {
	return value != null && value !== "";
}
function routesSharePeer(left, right) {
	return Boolean(left && right && left.baseSessionKey === right.baseSessionKey && left.peer.kind === right.peer.kind && left.peer.id === right.peer.id);
}
function shouldCarrySessionThread(params) {
	if (!isNonEmptyThreadId(params.resolved.threadId)) return false;
	if (!params.explicitTo) return params.resolved.channel === params.resolved.lastChannel && params.resolved.to === params.resolved.lastTo;
	return routesSharePeer(params.route, params.lastRoute);
}
function stripSelectedProviderPrefix(params) {
	const trimmed = params.to?.trim();
	if (!trimmed) return;
	return stripTargetProviderPrefix(trimmed, params.channel).trim() || void 0;
}
function shouldStripResolvedTargetProviderPrefix(target) {
	return target.resolutionSource === "normalized";
}
/** Resolves cron delivery config into a concrete channel target and optional thread/account. */
async function resolveDeliveryTarget(cfg, agentId, jobPayload, options) {
	const requestedChannel = typeof jobPayload.channel === "string" ? jobPayload.channel : "last";
	const explicitTo = typeof jobPayload.to === "string" ? jobPayload.to : void 0;
	const allowMismatchedLastTo = requestedChannel === "last";
	const deliveryTargetRuntime = await deliveryTargetRuntimeLoader.load();
	const sessionCfg = cfg.session;
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	const storePath = resolveSessionStorePathCore(sessionCfg?.store, { agentId });
	const rawSessionKey = jobPayload.sessionKey?.trim();
	const threadSessionKey = rawSessionKey ? resolveCronAgentSessionKey({
		sessionKey: rawSessionKey,
		agentId,
		mainKey: cfg.session?.mainKey,
		cfg
	}) : void 0;
	const storedDeliveryContext = resolveCronStoredDeliveryContext({
		cfg,
		sessionKey: threadSessionKey
	});
	const storedDeliveryEntry = storedDeliveryContext ? {
		sessionId: threadSessionKey ?? mainSessionKey,
		updatedAt: 0,
		delivery: normalizeSessionDeliveryState({ context: storedDeliveryContext })
	} : void 0;
	const threadEntry = threadSessionKey ? loadSessionEntryReadOnly({
		agentId,
		sessionKey: threadSessionKey,
		storePath
	}) : void 0;
	const mainEntry = loadSessionEntryReadOnly({
		agentId,
		sessionKey: mainSessionKey,
		storePath
	});
	const main = storedDeliveryEntry ?? threadEntry ?? mainEntry;
	const usedSharedMainFallback = mainEntry !== void 0 && main === mainEntry;
	const preliminary = resolveSessionDeliveryTarget({
		entry: main,
		requestedChannel,
		explicitTo,
		explicitThreadId: jobPayload.threadId,
		allowMismatchedLastTo
	});
	let fallbackChannel;
	let channelResolutionError;
	if (!preliminary.channel) if (preliminary.lastChannel) fallbackChannel = preliminary.lastChannel;
	else try {
		const { resolveMessageChannelSelection } = await channelSelectionRuntimeLoader.load();
		fallbackChannel = (await resolveMessageChannelSelection({ cfg })).channel;
	} catch (err) {
		const detail = formatErrorMessage(err);
		channelResolutionError = /* @__PURE__ */ new Error(`${detail} Set delivery.channel explicitly or use a main session with a previous channel.`);
	}
	const resolved = fallbackChannel ? resolveSessionDeliveryTarget({
		entry: main,
		requestedChannel,
		explicitTo,
		explicitThreadId: jobPayload.threadId,
		fallbackChannel,
		allowMismatchedLastTo,
		mode: preliminary.mode
	}) : preliminary;
	const channel = resolved.channel ?? fallbackChannel;
	const mode = resolved.mode;
	let toCandidate = resolved.to;
	let accountId = (typeof jobPayload.accountId === "string" ? jobPayload.accountId.trim() || void 0 : void 0) ?? resolved.accountId;
	if (!accountId && channel) accountId = deliveryTargetRuntime.resolveFirstBoundAccountId({
		cfg,
		channelId: channel,
		agentId
	});
	if (!channel) return {
		ok: false,
		channel: void 0,
		to: void 0,
		accountId,
		threadId: void 0,
		mode,
		error: channelResolutionError ?? /* @__PURE__ */ new Error("Channel is required when delivery.channel=last has no previous channel.")
	};
	const explicitThreadId = isNonEmptyThreadId(jobPayload.threadId) ? jobPayload.threadId : void 0;
	let effectiveAllowFrom;
	if (mode === "implicit") {
		const { getLoadedChannelPluginForRead, mapAllowFromEntries } = deliveryTargetRuntime;
		const channelPlugin = getLoadedChannelPluginForRead(channel);
		const resolvedAccountId = normalizeAccountId(accountId);
		const configuredAllowFromRaw = channelPlugin?.config.resolveAllowFrom?.({
			cfg,
			accountId: resolvedAccountId
		});
		const allowFromOverride = uniqueStrings(configuredAllowFromRaw ? mapAllowFromEntries(configuredAllowFromRaw) : []);
		effectiveAllowFrom = allowFromOverride;
		if (toCandidate && allowFromOverride.length > 0) {
			if (!(await resolveOutboundTargetWithRuntime({
				channel,
				to: toCandidate,
				cfg,
				accountId,
				mode,
				allowFrom: effectiveAllowFrom
			})).ok) toCandidate = allowFromOverride[0];
		}
	}
	if (!rawSessionKey && mode === "implicit" && !explicitTo && usedSharedMainFallback && toCandidate != null && toCandidate === resolved.lastTo) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: /* @__PURE__ */ new Error("Refusing implicit isolated cron delivery: the target would be inherited from the shared agent-main session bucket's last recipient, which is ambiguous across conversations and can deliver to the wrong room (and replay there after a restart). Set delivery.channel and delivery.to explicitly, or run the cron from a session that carries its own delivery context.")
	};
	const preResolvedRouteTargetCandidate = toCandidate;
	const docked = await resolveOutboundTargetWithRuntime({
		channel,
		to: toCandidate,
		cfg,
		accountId,
		mode,
		allowFrom: effectiveAllowFrom
	});
	if (!docked.ok) {
		if (!toCandidate || !isReservedTargetLiteralError(docked.error)) return {
			ok: false,
			channel,
			to: void 0,
			accountId,
			threadId: explicitThreadId,
			mode,
			error: docked.error
		};
	} else toCandidate = docked.to;
	const targetResolution = await deliveryTargetRuntime.resolveChannelTargetForDelivery({
		cfg,
		channel,
		agentId,
		input: toCandidate,
		accountId
	});
	if (!targetResolution.ok) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: targetResolution.error
	};
	const resolvedTarget = targetResolution.target;
	const routeTargetCandidate = resolvedTarget.source === "directory" ? resolvedTarget.to : preResolvedRouteTargetCandidate ?? toCandidate;
	const selectedTarget = shouldStripResolvedTargetProviderPrefix(resolvedTarget) ? stripSelectedProviderPrefix({
		channel,
		to: resolvedTarget.to
	}) : resolvedTarget.to.trim();
	if (!selectedTarget) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: /* @__PURE__ */ new Error("Target is required")
	};
	toCandidate = selectedTarget;
	const route = await (async () => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				accountId,
				target: routeTargetCandidate,
				resolvedTarget,
				threadId: explicitThreadId,
				currentSessionKey: threadSessionKey ?? mainSessionKey
			});
		} catch {
			return null;
		}
	})();
	const routeCanCanonicalizeTarget = deliveryTargetRuntime.channelCanResolveOutboundSessionRoute({
		cfg,
		channel,
		agentId
	});
	const routeShouldCanonicalizeTarget = route && (route.threadId !== void 0 || route.to !== routeTargetCandidate);
	if (route && routeCanCanonicalizeTarget && routeShouldCanonicalizeTarget) {
		const routeTo = stripSelectedProviderPrefix({
			channel,
			to: route.to
		});
		if (!routeTo) return {
			ok: false,
			channel,
			to: void 0,
			accountId,
			threadId: explicitThreadId,
			mode,
			error: /* @__PURE__ */ new Error("Target is required")
		};
		toCandidate = routeTo;
	}
	const lastTo = resolved.lastTo;
	const lastRoute = lastTo && resolved.lastChannel === channel ? await (async () => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				accountId: resolved.lastAccountId ?? accountId,
				target: lastTo,
				threadId: resolved.lastThreadId,
				currentSessionKey: threadSessionKey ?? mainSessionKey
			});
		} catch {
			return null;
		}
	})() : null;
	const canUseSessionThread = options?.inheritSessionThread !== false && shouldCarrySessionThread({
		resolved,
		explicitTo,
		route,
		lastRoute
	});
	const threadId = explicitThreadId ?? route?.threadId ?? (canUseSessionThread ? resolved.threadId : void 0);
	return {
		ok: true,
		channel,
		to: toCandidate,
		accountId,
		threadId,
		mode
	};
}
//#endregion
export { resolveDeliveryTarget as t };
