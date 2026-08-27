import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-Doha8xVC.js";
import { d as getActivePluginRegistry } from "./runtime-LV4GwzTm.js";
import { l as toPublicPluginVerificationDiagnostic, o as listActiveDegradedPlugins, r as degradedPluginMatchesRoot } from "./runtime-degraded-state-D2KYvUdx.js";
import { r as resolveHeartbeatSummaryForAgent } from "./heartbeat-summary-CdqV4krQ.js";
import { a as resolvePreferredAccountId, t as buildChannelAccountBindings } from "./bindings-Cl4ei12g.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-C-WC19Mc.js";
import { s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-BE7s6a11.js";
import { i as resolveChannelAccountEnabled, r as resolveChannelAccountConfigured } from "./account-summary-Cw5GZp7s.js";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-CI-2_YTh.js";
import { t as inspectChannelAccount } from "./account-inspection-DwpxGLU3.js";
import { t as buildChannelAccountSnapshotFromAccount } from "./status-DUvzF9wU.js";
import { i as resolveChannelHealthState, n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-gOWYUpIm.js";
import { n as buildContextEngineHealthSummary, t as buildDeliveryQueueHealthSummary } from "./delivery-queue-CXs1l4x3.js";
//#region src/gateway/health/account-context.ts
const PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR = "imsg cannot access ~/Library/Messages/chat.db. Grant Full Disk Access to the Gateway/launcher process and restart Gateway.";
const redactIMessageProbeErrorMessage = (message) => {
	const trimmed = message.trim();
	if (!trimmed) return "";
	return trimmed.replaceAll(/\/Users\/[^/\s]+\/Library\/Messages\/chat\.db/g, "~/Library/Messages/chat.db");
};
function buildNonSensitiveProbeFailure(channelId, probe) {
	const record = asNullableRecord(probe);
	if (channelId !== "imessage" || !record || record.ok !== false) return;
	if (typeof record.error !== "string") return;
	const error = redactIMessageProbeErrorMessage(record.error);
	if (!/\bimsg\b/i.test(error) || !error.includes("~/Library/Messages/chat.db") || !/\bFull Disk Access\b/i.test(error)) return;
	return {
		ok: false,
		error: PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR
	};
}
function readBooleanField(value, key) {
	const record = asNullableRecord(value);
	if (!record) return;
	return typeof record[key] === "boolean" ? record[key] : void 0;
}
const hasAccountValue = (account) => account !== null && account !== void 0;
function resolveProbeAccountEnabled(params) {
	const fallback = readBooleanField(params.account, "enabled") ?? true;
	try {
		return resolveChannelAccountEnabled({
			plugin: params.plugin,
			account: params.account,
			cfg: params.cfg
		});
	} catch (error) {
		params.diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to evaluate enabled state (${formatErrorMessage(error)}).`);
		return fallback;
	}
}
async function resolveProbeAccountConfigured(params) {
	const fallback = readBooleanField(params.account, "configured") ?? true;
	try {
		return await resolveChannelAccountConfigured({
			plugin: params.plugin,
			account: params.account,
			cfg: params.cfg,
			readAccountConfiguredField: true
		});
	} catch (error) {
		params.diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to evaluate configured state (${formatErrorMessage(error)}).`);
		return fallback;
	}
}
async function resolveHealthAccountContext(params) {
	const diagnostics = [];
	let account;
	try {
		account = params.plugin.config.resolveAccount(params.cfg, params.accountId);
	} catch (error) {
		diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to resolve account (${formatErrorMessage(error)}).`);
	}
	let inspectedAccount;
	try {
		inspectedAccount = await inspectChannelAccount(params);
	} catch (error) {
		diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to inspect account (${formatErrorMessage(error)}).`);
	}
	const probeAccount = hasAccountValue(account) ? account : inspectedAccount;
	if (!hasAccountValue(probeAccount)) return {
		probeAccount: {},
		snapshotAccount: {},
		enabled: false,
		configured: false,
		diagnostics
	};
	return {
		probeAccount,
		snapshotAccount: hasAccountValue(inspectedAccount) ? inspectedAccount : probeAccount,
		enabled: resolveProbeAccountEnabled({
			plugin: params.plugin,
			cfg: params.cfg,
			accountId: params.accountId,
			account: probeAccount,
			diagnostics
		}),
		configured: await resolveProbeAccountConfigured({
			plugin: params.plugin,
			cfg: params.cfg,
			accountId: params.accountId,
			account: probeAccount,
			diagnostics
		}),
		diagnostics
	};
}
//#endregion
//#region src/gateway/health/collector.ts
const DEFAULT_HEALTH_TIMEOUT_MS = 1e4;
const healthLog = createSubsystemLogger("health");
const debugHealth = (cfg, message, meta) => {
	if (isDiagnosticFlagEnabled("health", cfg)) healthLog.info(message, meta);
};
const resolveHeartbeatSummary = (cfg, agentId) => resolveHeartbeatSummaryForAgent(cfg, agentId);
function resolveHealthAgentOrder(cfg) {
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const entries = listAgentEntries(cfg);
	const seen = /* @__PURE__ */ new Set();
	const ordered = [];
	for (const entry of entries) {
		if (!entry || typeof entry !== "object") continue;
		if (typeof entry.id !== "string" || !entry.id.trim()) continue;
		const id = normalizeAgentId(entry.id);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		ordered.push({
			id,
			name: typeof entry.name === "string" ? entry.name : void 0
		});
	}
	if (defaultAgentId && !seen.has(defaultAgentId)) ordered.unshift({ id: defaultAgentId });
	if (ordered.length === 0 && defaultAgentId) ordered.push({ id: defaultAgentId });
	return {
		defaultAgentId,
		ordered
	};
}
async function buildHealthSessionSummary(storePath, agentId) {
	const { listSessionEntriesReadOnly } = await import("./session-accessor-DwuUem4A.js");
	const { isTransientSqliteError } = await import("./unhandled-rejections-BZPyxEhW.js");
	let listed;
	try {
		listed = listSessionEntriesReadOnly({
			...agentId ? { agentId } : {},
			storePath
		});
	} catch (error) {
		if (!isTransientSqliteError(error)) throw error;
		listed = [];
	}
	const sessions = listed.filter(({ sessionKey }) => sessionKey !== "global" && sessionKey !== "unknown").map(({ sessionKey, entry }) => ({
		key: sessionKey,
		updatedAt: entry?.updatedAt ?? 0
	})).toSorted((a, b) => b.updatedAt - a.updatedAt);
	const recent = sessions.slice(0, 5).map((session) => ({
		key: session.key,
		updatedAt: session.updatedAt || null,
		age: session.updatedAt ? Date.now() - session.updatedAt : null
	}));
	return {
		path: storePath,
		count: sessions.length,
		recent
	};
}
function buildPluginHealthSummary() {
	const registry = getActivePluginRegistry();
	const degradedPlugins = listActiveDegradedPlugins();
	const unavailable = degradedPlugins.map(({ pluginId, state, diagnostic }) => ({
		id: pluginId,
		state,
		diagnostic: toPublicPluginVerificationDiagnostic(diagnostic)
	})).toSorted((left, right) => left.id.localeCompare(right.id));
	const loaded = (registry?.plugins ?? []).filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	const errors = (registry?.plugins ?? []).filter((plugin) => plugin.status === "error" && !degradedPlugins.some((degraded) => plugin.id === degraded.pluginId && plugin.failurePhase === "validation" && plugin.activationReason === `configured-unavailable: ${degraded.diagnostic.reason}` && Boolean(plugin.rootDir) && degradedPluginMatchesRoot(degraded, plugin.rootDir ?? ""))).map((plugin) => {
		const error = {
			id: plugin.id,
			origin: plugin.origin,
			activated: plugin.activated === true,
			error: plugin.error ?? "unknown plugin load error"
		};
		if (plugin.activationSource) error.activationSource = plugin.activationSource;
		if (plugin.activationReason) error.activationReason = plugin.activationReason;
		if (plugin.failurePhase) error.failurePhase = plugin.failurePhase;
		return error;
	}).toSorted((left, right) => left.id.localeCompare(right.id));
	if (loaded.length === 0 && errors.length === 0 && unavailable.length === 0) return;
	return {
		loaded,
		errors,
		unavailable
	};
}
/** Collects the gateway-owned health snapshot for an explicit trust audience. */
async function collectGatewayHealthSnapshot(params) {
	const cfg = await readRuntimeHealthConfig();
	const { defaultAgentId, ordered } = resolveHealthAgentOrder(cfg);
	const channelBindings = buildChannelAccountBindings(cfg);
	const sessionCache = /* @__PURE__ */ new Map();
	const agents = [];
	for (const entry of ordered) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: entry.id });
		const sessionCacheKey = `${storePath}\0${entry.id}`;
		const sessions = sessionCache.get(sessionCacheKey) ?? await buildHealthSessionSummary(storePath, entry.id);
		sessionCache.set(sessionCacheKey, sessions);
		agents.push({
			agentId: entry.id,
			name: entry.name,
			isDefault: entry.id === defaultAgentId,
			heartbeat: resolveHeartbeatSummary(cfg, entry.id),
			sessions
		});
	}
	const summaryAgent = agents.find((agent) => agent.isDefault) ?? agents[0];
	const configuredHeartbeatAgentId = normalizeOptionalString(cfg.agents?.defaults?.heartbeat?.agentId);
	const heartbeatSummaryAgent = (configuredHeartbeatAgentId ? agents.find((agent) => agent.agentId === normalizeAgentId(configuredHeartbeatAgentId)) : void 0) ?? agents.find((agent) => agent.heartbeat.enabled) ?? summaryAgent;
	const heartbeatSeconds = heartbeatSummaryAgent?.heartbeat.everyMs ? Math.round(heartbeatSummaryAgent.heartbeat.everyMs / 1e3) : 0;
	const sessions = summaryAgent?.sessions ?? await buildHealthSessionSummary(resolveSessionStorePathCore(cfg.session?.store, { agentId: summaryAgent?.agentId }), summaryAgent?.agentId);
	const start = Date.now();
	const cappedTimeout = resolveTimerTimeoutMs(params.timeoutMs, DEFAULT_HEALTH_TIMEOUT_MS, 50);
	const includeSensitive = params.audience === "admin";
	const channels = {};
	const plugins = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: false });
	const channelOrder = plugins.map((plugin) => plugin.id);
	const channelLabels = {};
	for (const plugin of plugins) {
		channelLabels[plugin.id] = plugin.meta.label ?? plugin.id;
		const accountIds = plugin.config.listAccountIds(cfg);
		const defaultAccountId = resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds
		});
		const boundAccounts = defaultAgentId ? channelBindings.get(plugin.id)?.get(defaultAgentId) ?? [] : [];
		const preferredAccountId = resolvePreferredAccountId({
			accountIds,
			defaultAccountId,
			boundAccounts
		});
		const boundAccountIdsAll = Array.from(new Set(Array.from(channelBindings.get(plugin.id)?.values() ?? []).flat()));
		const accountIdsToProbe = Array.from(new Set([
			preferredAccountId,
			defaultAccountId,
			...accountIds,
			...boundAccountIdsAll
		].filter((value) => value && value.trim())));
		debugHealth(cfg, "channel", {
			id: plugin.id,
			accountIds,
			defaultAccountId,
			boundAccounts,
			preferredAccountId,
			accountIdsToProbe
		});
		const accountSummaries = {};
		for (const accountId of accountIdsToProbe) {
			const { probeAccount, snapshotAccount, enabled, configured, diagnostics } = await resolveHealthAccountContext({
				plugin,
				cfg,
				accountId
			});
			if (diagnostics.length > 0) debugHealth(cfg, "account.diagnostics", {
				channel: plugin.id,
				accountId,
				diagnostics
			});
			let probe;
			let lastProbeAt = null;
			if (enabled && configured && params.probe && plugin.status?.probeAccount) try {
				probe = await plugin.status.probeAccount({
					account: probeAccount,
					timeoutMs: cappedTimeout,
					cfg
				});
				lastProbeAt = Date.now();
			} catch (error) {
				probe = {
					ok: false,
					error: formatErrorMessage(error)
				};
				lastProbeAt = Date.now();
			}
			const probeRecord = probe && typeof probe === "object" ? probe : null;
			const bot = probeRecord && typeof probeRecord.bot === "object" ? probeRecord.bot : null;
			if (bot?.username) debugHealth(cfg, "probe.bot", {
				channel: plugin.id,
				accountId,
				username: bot.username
			});
			const runtimeSnapshot = params.runtimeSnapshot?.channelAccounts[plugin.id]?.[accountId] ?? (accountId === defaultAccountId ? params.runtimeSnapshot?.channels[plugin.id] : void 0);
			const nonSensitiveProbeFailure = buildNonSensitiveProbeFailure(plugin.id, probe);
			const snapshot = await buildChannelAccountSnapshotFromAccount({
				plugin,
				cfg,
				accountId,
				account: snapshotAccount,
				runtime: runtimeSnapshot,
				probe: includeSensitive ? probe : nonSensitiveProbeFailure,
				enabledFallback: enabled,
				configuredFallback: configured
			});
			if (lastProbeAt) snapshot.lastProbeAt = lastProbeAt;
			const healthState = resolveChannelHealthState(snapshot, {
				channelId: plugin.id,
				now: Date.now(),
				staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
				channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS
			});
			if (healthState !== void 0) snapshot.healthState = healthState;
			const summary = plugin.status?.buildChannelSummary ? await plugin.status.buildChannelSummary({
				account: probeAccount,
				cfg,
				defaultAccountId: accountId,
				snapshot
			}) : void 0;
			const record = redactChannelStatusSummaryBaseUrl(summary && typeof summary === "object" ? {
				...snapshot,
				...summary
			} : {
				...snapshot,
				accountId,
				configured
			});
			if (record.configured === void 0) record.configured = configured;
			if (includeSensitive && record.probe === void 0 && probe !== void 0) record.probe = probe;
			if (!includeSensitive) {
				const safeProbeFailure = buildNonSensitiveProbeFailure(plugin.id, record.probe) ?? nonSensitiveProbeFailure;
				if (safeProbeFailure) record.probe = safeProbeFailure;
				else delete record.probe;
			}
			if (record.lastProbeAt === void 0 && lastProbeAt) record.lastProbeAt = lastProbeAt;
			record.accountId = accountId;
			accountSummaries[accountId] = record;
		}
		const fallbackSummary = accountSummaries[preferredAccountId] ?? accountSummaries[defaultAccountId] ?? accountSummaries[accountIdsToProbe[0] ?? preferredAccountId] ?? accountSummaries[expectDefined(Object.keys(accountSummaries)[0], "object.keys(account summaries) entry at 0")];
		if (fallbackSummary) channels[plugin.id] = {
			...fallbackSummary,
			accounts: accountSummaries
		};
	}
	const pluginHealth = buildPluginHealthSummary();
	const contextEngineHealth = buildContextEngineHealthSummary();
	const deliveryQueueHealth = buildDeliveryQueueHealthSummary();
	return {
		ok: true,
		ts: Date.now(),
		durationMs: Date.now() - start,
		...params.eventLoop ? { eventLoop: params.eventLoop } : {},
		...pluginHealth ? { plugins: pluginHealth } : {},
		...contextEngineHealth ? { contextEngines: contextEngineHealth } : {},
		...deliveryQueueHealth ? { deliveryQueues: deliveryQueueHealth } : {},
		...params.configReloadHotReloadStatus ? { configReload: { hotReloadStatus: params.configReloadHotReloadStatus } } : {},
		channels,
		channelOrder,
		channelLabels,
		heartbeatSeconds,
		...defaultAgentId ? { defaultAgentId } : {},
		agents,
		sessions: {
			path: sessions.path,
			count: sessions.count,
			recent: sessions.recent
		}
	};
}
async function readRuntimeHealthConfig() {
	const { getRuntimeConfig } = await import("./config/config.js");
	return getRuntimeConfig();
}
//#endregion
export { resolveHealthAccountContext as i, collectGatewayHealthSnapshot as n, resolveHealthAgentOrder as r, buildHealthSessionSummary as t };
