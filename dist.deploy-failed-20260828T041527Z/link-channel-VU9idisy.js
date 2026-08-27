import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-cxjR1aAq.js";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-CpByRcwr.js";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-BMxa0KO1.js";
//#region src/channels/account-context.ts
function getBooleanField(value, key) {
	const record = isRecord(value) ? value : null;
	if (!record) return;
	return typeof record[key] === "boolean" ? record[key] : void 0;
}
function formatContextDiagnostic(params) {
	return `${params.commandName ? `${params.commandName}: ` : ""}channels.${params.pluginId}.accounts.${params.accountId}: ${params.message}`;
}
/** Resolve default channel account state for commands that need enabled/configured checks. */
async function resolveDefaultChannelAccountContext(plugin, cfg, options) {
	const mode = options?.mode ?? "strict";
	const accountIds = plugin.config.listAccountIds(cfg);
	const defaultAccountId = resolveChannelDefaultAccountId({
		plugin,
		cfg,
		accountIds
	});
	if (mode === "strict") {
		const account = plugin.config.resolveAccount(cfg, defaultAccountId);
		return {
			accountIds,
			defaultAccountId,
			account,
			enabled: plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : true,
			configured: plugin.config.isConfigured ? await plugin.config.isConfigured(account, cfg) : true,
			diagnostics: [],
			degraded: false
		};
	}
	const diagnostics = [];
	let degraded = false;
	let account = plugin.config.inspectAccount?.(cfg, defaultAccountId) ?? await inspectReadOnlyChannelAccount({
		channelId: plugin.id,
		cfg,
		accountId: defaultAccountId
	});
	if (!account) try {
		account = plugin.config.resolveAccount(cfg, defaultAccountId);
	} catch (error) {
		degraded = true;
		diagnostics.push(formatContextDiagnostic({
			commandName: options?.commandName,
			pluginId: plugin.id,
			accountId: defaultAccountId,
			message: `failed to resolve account (${formatErrorMessage(error)}); skipping read-only checks.`
		}));
		return {
			accountIds,
			defaultAccountId,
			account: {},
			enabled: false,
			configured: false,
			diagnostics,
			degraded
		};
	}
	else degraded = true;
	const inspectEnabled = getBooleanField(account, "enabled");
	let enabled = inspectEnabled ?? true;
	if (inspectEnabled === void 0 && plugin.config.isEnabled) try {
		enabled = plugin.config.isEnabled(account, cfg);
	} catch (error) {
		degraded = true;
		enabled = false;
		diagnostics.push(formatContextDiagnostic({
			commandName: options?.commandName,
			pluginId: plugin.id,
			accountId: defaultAccountId,
			message: `failed to evaluate enabled state (${formatErrorMessage(error)}); treating as disabled.`
		}));
	}
	const inspectConfigured = getBooleanField(account, "configured");
	let configured = inspectConfigured ?? true;
	if (inspectConfigured === void 0 && plugin.config.isConfigured) try {
		configured = await plugin.config.isConfigured(account, cfg);
	} catch (error) {
		degraded = true;
		configured = false;
		diagnostics.push(formatContextDiagnostic({
			commandName: options?.commandName,
			pluginId: plugin.id,
			accountId: defaultAccountId,
			message: `failed to evaluate configured state (${formatErrorMessage(error)}); treating as unconfigured.`
		}));
	}
	return {
		accountIds,
		defaultAccountId,
		account,
		enabled,
		configured,
		diagnostics,
		degraded
	};
}
//#endregion
//#region src/status/link-channel.ts
/** Returns link status for the first configured read-only channel that exposes linked state. */
async function resolveLinkChannelContext(cfg, options = {}) {
	const sourceConfig = options.sourceConfig ?? cfg;
	for (const plugin of listReadOnlyChannelPluginsForConfig(cfg, {
		activationSourceConfig: sourceConfig,
		includeSetupFallbackPlugins: false
	})) {
		const { defaultAccountId, account, enabled, configured } = await resolveDefaultChannelAccountContext(plugin, cfg, {
			mode: "read_only",
			commandName: "status"
		});
		const snapshot = plugin.config.describeAccount ? plugin.config.describeAccount(account, cfg) : {
			accountId: defaultAccountId,
			enabled,
			configured
		};
		const summaryRecord = plugin.status?.buildChannelSummary ? await plugin.status.buildChannelSummary({
			account,
			cfg,
			defaultAccountId,
			snapshot
		}) : void 0;
		const linked = summaryRecord && typeof summaryRecord.linked === "boolean" ? summaryRecord.linked : null;
		if (linked === null) continue;
		return {
			linked,
			authAgeMs: summaryRecord && typeof summaryRecord.authAgeMs === "number" ? summaryRecord.authAgeMs : null,
			account,
			accountId: defaultAccountId,
			plugin
		};
	}
	return null;
}
//#endregion
export { resolveLinkChannelContext };
