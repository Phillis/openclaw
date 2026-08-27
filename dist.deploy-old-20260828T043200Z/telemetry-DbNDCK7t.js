import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { y as resolveIsNixMode } from "./paths-BBSTUjD5.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.js";
import { Rn as string, Tn as object } from "./schemas-CZ9Toj_c.js";
import { t as isBuiltInModelProviderOverlayId } from "./model-provider-config-B3wTMsqG.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { l as resolveEffectivePluginActivationState, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { y as isPluginEnabledByDefaultForPlatform } from "./installed-plugin-index-B1BZ_yR8.js";
import { S as resolveOfficialExternalProviderPluginIds, _ as resolveOfficialExternalPluginId, a as getOfficialExternalPluginCatalogEntryForPackage, l as isOfficialExternalPluginId } from "./official-external-plugin-catalog-DwzC0Kl2.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-DRErrq38.js";
import { Mn as getNodeSqliteKysely, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { o as writeConfigMachineState, r as readConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
import { d as getActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
//#region src/plugins/plugin-public-identity.ts
/** True when a plugin identity is already public and safe to report. */
function isPubliclyKnownPluginId(plugin) {
	if (plugin.origin === "bundled" || plugin.trustedOfficialInstall === true) return true;
	if (!isOfficialExternalPluginId(plugin.id)) return false;
	const catalogEntry = getOfficialExternalPluginCatalogEntryForPackage(plugin.packageName);
	return catalogEntry !== void 0 && resolveOfficialExternalPluginId(catalogEntry) === plugin.id;
}
//#endregion
//#region src/plugins/plugin-runtime-inventory.ts
/** Lists loaded plugin identities, or configured manifest identities before runtime activation. */
function listEnabledPluginRecords(config) {
	const registry = getActivePluginRegistry();
	if (registry) return registry.plugins.filter((plugin) => plugin.enabled && plugin.status === "loaded" && (plugin.format === "bundle" || plugin.imported !== false));
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	return loadPluginManifestRegistryCore({ config }).plugins.filter((plugin) => resolveEffectivePluginActivationState({
		id: plugin.id,
		origin: plugin.origin,
		config: normalizedConfig,
		rootConfig: config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	}).enabled).map((plugin) => ({
		id: plugin.id,
		origin: plugin.origin,
		packageName: plugin.packageName,
		trustedOfficialInstall: plugin.trustedOfficialInstall,
		channelIds: plugin.channels
	}));
}
//#endregion
//#region src/infra/telemetry.ts
const DEFAULT_TELEMETRY_ENDPOINT = "https://telemetry.openclaw.ai/api/latest-version";
const TELEMETRY_STATE_KEY = "telemetry.updateCheck";
const TELEMETRY_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const TELEMETRY_FAILURE_BACKOFF_MS = 60 * 1e3;
const TELEMETRY_TIMEOUT_MS = 3e3;
const TELEMETRY_NOTE_MAX_LENGTH = 500;
const SAFE_FEATURE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;
const TelemetryResponseSchema = object({
	version: string().trim().min(1),
	note: string().optional()
});
let lastFailedAttempt;
let inFlightUpdate;
/**
* CI jobs are not installs. Left unchecked they outnumber operators by orders of
* magnitude and make version and platform counts meaningless, and someone else's
* pipeline should not report to us on every job either. A configured endpoint
* means the caller is deliberately exercising this path, so it still reports.
*/
function isAutomatedEnvironment() {
	if (process.env.OPENCLAW_TELEMETRY_ENDPOINT?.trim()) return false;
	return isTruthyEnvValue(process.env.CI);
}
function isUpdateCheckDisabled(config) {
	return config.update?.checkOnStart === false || isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE) || isAutomatedEnvironment() || resolveIsNixMode();
}
function isDoNotTrackEnabled() {
	const value = process.env.DO_NOT_TRACK?.trim().toLowerCase();
	return value === "1" || value === "true";
}
function countRecentSessions(nowMs) {
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db: database }) => {
			return executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("session_state_events").select((builder) => builder.fn.countAll().as("count")).where("kind", "=", "created").where("occurred_at", ">=", nowMs - TELEMETRY_CHECK_INTERVAL_MS))?.count ?? 0;
		}) ?? 0;
	} catch {
		return 0;
	}
}
function resolveTelemetryEndpoint() {
	return process.env.OPENCLAW_TELEMETRY_ENDPOINT?.trim() || DEFAULT_TELEMETRY_ENDPOINT;
}
function buildTelemetryUserAgent(surface) {
	return `openclaw/${VERSION} (${process.platform}; node/${process.versions.node}; ${process.arch}; ${surface})`;
}
function readTelemetryState() {
	try {
		const state = readConfigMachineState(TELEMETRY_STATE_KEY);
		return state && isRecord(state) ? state : {};
	} catch {
		return {};
	}
}
function resolveTelemetryStatus(config) {
	let reason;
	if (isAutomatedEnvironment()) reason = "automated-environment";
	else if (isUpdateCheckDisabled(config)) reason = "update-disabled";
	else if (isDoNotTrackEnabled()) reason = "do-not-track";
	else if (config.telemetry?.enabled === true) reason = "enabled";
	else if (config.telemetry?.enabled === false || config.telemetry?.consentedAt) reason = "config-disabled";
	else reason = "never-asked";
	const { lastPingAt } = readTelemetryState();
	return {
		enabled: reason === "enabled",
		reason,
		endpoint: resolveTelemetryEndpoint(),
		...lastPingAt === void 0 ? {} : { lastPingAt }
	};
}
function buildTelemetryPayload(config, options) {
	const enabledPlugins = listEnabledPluginRecords(config);
	const publicPlugins = enabledPlugins.filter(isPubliclyKnownPluginId);
	const publicChannelIds = new Set(publicPlugins.flatMap((plugin) => plugin.channelIds));
	const channels = Object.entries(config.channels ?? {}).filter(([channelId, channelConfig]) => SAFE_FEATURE_NAME.test(channelId) && !isChannelConfigMetadataKey(channelId) && isRecord(channelConfig) && channelConfig.enabled !== false && publicChannelIds.has(channelId)).map(([channelId]) => channelId).toSorted();
	const configuredProviders = [
		...Object.keys(config.models?.providers ?? {}),
		...Object.values(config.auth?.profiles ?? {}).map((profile) => profile.provider),
		...collectConfiguredModelRefs(config, { includeChannelModelOverrides: false }).flatMap(({ value }) => {
			const provider = parseModelCatalogRef(value)?.provider;
			return provider ? [provider] : [];
		})
	];
	const providerFamilies = [...new Set(configuredProviders)].filter((providerId) => SAFE_FEATURE_NAME.test(providerId) && (isBuiltInModelProviderOverlayId(providerId) || resolveOfficialExternalProviderPluginIds({ providerIds: /* @__PURE__ */ new Set([providerId]) }).length > 0)).toSorted();
	const plugins = [...new Set(publicPlugins.map((plugin) => plugin.id))].filter((pluginId) => SAFE_FEATURE_NAME.test(pluginId)).toSorted();
	return {
		schema: 1,
		version: VERSION,
		platform: `${process.platform}-${process.arch}`,
		node: process.versions.node,
		surface: options.surface,
		features: {
			channels,
			providerFamilies,
			plugins,
			pluginsEnabled: enabledPlugins.length,
			sessionsLast24h: countRecentSessions(Date.now())
		}
	};
}
async function checkTelemetryUpdate(config, options) {
	if (isUpdateCheckDisabled(config)) return null;
	const state = readTelemetryState();
	const cached = state.latestVersion ? {
		version: state.latestVersion,
		...state.note ? { note: state.note } : {}
	} : null;
	const nowMs = options.nowMs ?? Date.now();
	const endpoint = resolveTelemetryEndpoint();
	const stateDirectory = process.env.OPENCLAW_STATE_DIR;
	if (state.lastPingAt !== void 0 && nowMs >= state.lastPingAt && nowMs - state.lastPingAt < TELEMETRY_CHECK_INTERVAL_MS) return cached;
	if (!options.fetchImpl && (process.env.VITEST !== void 0 || false)) return cached;
	if (lastFailedAttempt?.endpoint === endpoint && lastFailedAttempt.stateDirectory === stateDirectory && nowMs >= lastFailedAttempt.at && nowMs - lastFailedAttempt.at < TELEMETRY_FAILURE_BACKOFF_MS) return cached;
	if (inFlightUpdate) return inFlightUpdate;
	const sendUpdateCheck = async () => {
		try {
			const featureStatsEnabled = config.telemetry?.enabled === true && !isDoNotTrackEnabled();
			const headers = { "User-Agent": buildTelemetryUserAgent(options.surface) };
			const init = {
				method: featureStatsEnabled ? "POST" : "GET",
				headers,
				signal: AbortSignal.timeout(TELEMETRY_TIMEOUT_MS)
			};
			if (featureStatsEnabled) {
				headers["Content-Type"] = "application/json";
				init.body = JSON.stringify(buildTelemetryPayload(config, { surface: options.surface }));
			}
			const response = await (options.fetchImpl ?? fetch)(endpoint, init);
			if (response.status !== 200) {
				lastFailedAttempt = {
					at: nowMs,
					endpoint,
					stateDirectory
				};
				return cached;
			}
			const parsed = TelemetryResponseSchema.safeParse(await response.json());
			if (!parsed.success) {
				lastFailedAttempt = {
					at: nowMs,
					endpoint,
					stateDirectory
				};
				return cached;
			}
			const note = parsed.data.note?.trim().slice(0, TELEMETRY_NOTE_MAX_LENGTH);
			const update = {
				version: parsed.data.version,
				...note ? { note } : {}
			};
			writeConfigMachineState(TELEMETRY_STATE_KEY, {
				lastPingAt: nowMs,
				latestVersion: update.version,
				...update.note ? { note: update.note } : {}
			});
			lastFailedAttempt = void 0;
			return update;
		} catch {
			lastFailedAttempt = {
				at: nowMs,
				endpoint,
				stateDirectory
			};
			return cached;
		}
	};
	inFlightUpdate = sendUpdateCheck();
	try {
		return await inFlightUpdate;
	} finally {
		inFlightUpdate = void 0;
	}
}
//#endregion
export { resolveTelemetryStatus as i, buildTelemetryUserAgent as n, checkTelemetryUpdate as r, buildTelemetryPayload as t };
