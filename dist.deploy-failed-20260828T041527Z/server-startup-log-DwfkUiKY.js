import { c as normalizeSortedUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import "./agent-scope-DigoIwHb.js";
import { C as tryResolveLegacyCompatibilityAgentId, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { s as getResolvedLoggerSettings } from "./logger-ij8OHrrv.js";
import { i as legacyModelKey } from "./model-ref-shared-D4yx0hwT.js";
import { _ as resolveConfiguredModelRef, r as buildConfiguredModelCatalog } from "./model-selection-shared-DbjoXfPH.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import "./logging-aRZskxqi.js";
import { n as resolveThinkingDefault } from "./model-thinking-default-DduLSMYL.js";
import { s as formatFastModeValue } from "./fast-mode-CCX0YiYh.js";
import { t as resolveFastModeState } from "./fast-mode-Dd78Dxbu.js";
import { t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current-ilZuswNg.js";
import chalk from "chalk";
//#region src/gateway/server-startup-log.ts
/** Emit startup summary lines after Gateway bind and plugin loading complete. */
async function logGatewayStartup(params) {
	const { provider: agentProvider, model: agentModel } = resolveConfiguredModelRef({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const agentModelLog = formatAgentModelStartupLogLine({
		cfg: params.cfg,
		provider: agentProvider,
		model: agentModel
	});
	params.log.info(agentModelLog.message, { consoleMessage: agentModelLog.consoleMessage });
	const startupDurationMs = typeof params.startupStartedAt === "number" ? Date.now() - params.startupStartedAt : null;
	const startupDurationLabel = startupDurationMs == null ? null : `${(startupDurationMs / 1e3).toFixed(1)}s`;
	params.log.info(`http server listening (${formatReadyDetails(params.loadedPluginIds, startupDurationLabel)})`);
	params.log.info(`log file: ${getResolvedLoggerSettings().file}`);
	if (params.isNixMode) params.log.info("gateway: running in Nix mode (config managed externally)");
	for (const warning of await collectConfiguredChannelStartupWarnings({
		cfg: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		ambientEnvTriggers: params.ambientEnvTriggers,
		env: params.env,
		manifestRecords: params.manifestRecords
	})) params.log.warn(warning);
	const enabledDangerousFlags = collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(params.cfg) ?? (await import("./dangerous-config-flags-B7IydGfx.js")).collectEnabledInsecureOrDangerousFlags(params.cfg);
	if (enabledDangerousFlags.length > 0) {
		const warning = `security warning: dangerous config flags enabled: ${enabledDangerousFlags.join(", ")}. Run \`openclaw security audit\`.`;
		params.log.warn(warning);
	}
}
/** Format the startup model line from the model ref already selected by the caller. */
function formatAgentModelStartupLogLine(params) {
	const modelRef = `${params.provider}/${params.model}`;
	const modelDetails = formatAgentModelStartupDetails(params);
	return {
		message: `agent model: ${modelRef} (${modelDetails})`,
		consoleMessage: `agent model: ${chalk.whiteBright(modelRef)} (${modelDetails})`
	};
}
/** Normalize model thinking values that are useful in the compact startup log. */
function normalizeStartupThinkLevel(value) {
	return value === "off" || value === "minimal" || value === "low" || value === "medium" || value === "high" || value === "xhigh" || value === "adaptive" || value === "max" || value === "ultra" ? value : void 0;
}
/** Resolve explicit thinking overrides from agent defaults and per-model config. */
function resolveExplicitStartupThinking(params) {
	const models = params.cfg.agents?.defaults?.models;
	const canonicalKey = modelKey(params.provider, params.model);
	const legacyKey = legacyModelKey(params.provider, params.model);
	return normalizeStartupThinkLevel(params.defaultAgentThinking) ?? normalizeStartupThinkLevel(models?.[canonicalKey]?.params?.thinking) ?? normalizeStartupThinkLevel(legacyKey ? models?.[legacyKey]?.params?.thinking : void 0) ?? normalizeStartupThinkLevel(params.cfg.agents?.defaults?.thinkingDefault);
}
/** True when a configured catalog entry disables reasoning for the startup model. */
function isConfiguredReasoningDisabled(params) {
	return params.catalog.some((entry) => entry.provider === params.provider && entry.id === params.model && entry.reasoning === false);
}
/** Format model thinking and fast-mode details for the Gateway startup banner. */
function formatAgentModelStartupDetails(params) {
	const soleAgentId = tryResolveLegacyCompatibilityAgentId(params.cfg);
	const defaultAgentConfig = soleAgentId ? resolveAgentConfig(params.cfg, soleAgentId) : void 0;
	let thinking = resolveExplicitStartupThinking({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		defaultAgentThinking: defaultAgentConfig?.thinkingDefault
	});
	if (thinking === void 0) {
		const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
		if (isConfiguredReasoningDisabled({
			catalog: configuredCatalog,
			provider: params.provider,
			model: params.model
		})) thinking = "off";
		else {
			const resolvedThinking = resolveThinkingDefault({
				cfg: params.cfg,
				provider: params.provider,
				model: params.model,
				catalog: configuredCatalog
			});
			thinking = resolvedThinking === "off" ? "medium" : resolvedThinking;
		}
	}
	const fast = resolveFastModeState({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		agentId: soleAgentId
	});
	return `thinking=${thinking}, fast=${formatFastModeValue(fast.mode)}`;
}
async function collectConfiguredChannelStartupWarnings(params) {
	const [blockerModule, presencePolicyModule] = await Promise.all([import("./channel-plugin-blockers-9KU5G4um.js"), import("./channel-presence-policy-WvLeaH1e.js")]);
	const hits = blockerModule.scanConfiguredChannelPluginBlockers(params.cfg, params.env, params.activationSourceConfig, {
		manifestRecords: params.manifestRecords,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const blockerWarnings = blockerModule.collectConfiguredChannelPluginBlockerWarnings(hits).map((warning) => `configured channel warning: ${warning.replace(/^[-]\s*/u, "")}`);
	const missingOwnerWarnings = presencePolicyModule.resolveConfiguredChannelPresencePolicy({
		config: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		env: params.env,
		includePersistedAuthState: false,
		ambientEnvTriggers: params.ambientEnvTriggers,
		manifestRecords: params.manifestRecords
	}).filter((entry) => !entry.effective && entry.blockedReasons.includes("no-channel-owner")).map(formatConfiguredChannelMissingOwnerStartupWarning);
	const suppressedAmbientChannelIds = params.ambientEnvTriggers === "suppress" ? presencePolicyModule.listAmbientOnlyConfiguredChannelIds({
		config: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		env: params.env,
		includePersistedAuthState: false,
		manifestRecords: params.manifestRecords
	}) : [];
	return [
		...suppressedAmbientChannelIds.length > 0 ? [formatSuppressedAmbientChannelsStartupWarning(suppressedAmbientChannelIds)] : [],
		...blockerWarnings,
		...missingOwnerWarnings
	];
}
function formatSuppressedAmbientChannelsStartupWarning(channelIds) {
	const safeChannelIds = normalizeSortedUniqueStringEntries(channelIds).map((channelId) => sanitizeForLog(channelId));
	return `gateway suppressed ambient channel auto-configuration for ${safeChannelIds.length} ${safeChannelIds.length === 1 ? "channel" : "channels"}: ${safeChannelIds.join(", ")}. Configure channels.<id> (openclaw channels add <id>) to enable the channel, or pass --ambient-channels to allow ambient env credentials.`;
}
function formatConfiguredChannelMissingOwnerStartupWarning(entry) {
	return `configured channel warning: channels.${sanitizeForLog(entry.channelId)} is configured but no channel plugin is installed or loadable (${normalizeSortedUniqueStringEntries(entry.blockedReasons).join(", ")}). Run \`openclaw doctor --fix\` or install the channel plugin before relying on this channel.`;
}
/** Format plugin count/list and optional startup duration for the ready log line. */
function formatReadyDetails(loadedPluginIds, startupDurationLabel) {
	const pluginIds = normalizeSortedUniqueStringEntries(loadedPluginIds);
	const pluginSummary = pluginIds.length === 0 ? "0 plugins" : `${pluginIds.length} ${pluginIds.length === 1 ? "plugin" : "plugins"}: ${pluginIds.join(", ")}`;
	if (!startupDurationLabel) return pluginSummary;
	return pluginIds.length === 0 ? `${pluginSummary}, ${startupDurationLabel}` : `${pluginSummary}; ${startupDurationLabel}`;
}
//#endregion
export { logGatewayStartup };
