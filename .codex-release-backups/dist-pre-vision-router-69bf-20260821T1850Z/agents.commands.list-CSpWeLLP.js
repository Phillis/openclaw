import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { m as shortenHomePath } from "./utils-D9gvQMP6.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
import { n as isChannelVisibleInConfiguredLists } from "./channel-meta-Db2pD5EX.js";
import { s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-CdpkZk_Q.js";
import { a as normalizeChannelId } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import "./channel-plugin-ids-PXSMuTP5.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
import { n as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-OjzK9GPy.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-C-WC19Mc.js";
import { n as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-BE7s6a11.js";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-CI-2_YTh.js";
import { i as resolveChannelAccountState, n as projectChannelAccountDisplayState, r as resolveChannelAccountLinked } from "./account-state-Bav3alE5.js";
import { t as describeBinding } from "./agents.binding-format-C3S9Mq5U.js";
import "./agents.bindings-1PK731SW.js";
import { n as buildAgentSummaries } from "./agents.config-BgVfIBCV.js";
import { t as requireValidConfig } from "./config-validation-RWiVWlp1.js";
//#region src/commands/agents.providers.ts
function providerAccountKey(provider, accountId) {
	return `${provider}:${accountId ?? "default"}`;
}
function resolveProviderChannelId(params) {
	const resolved = normalizeChannelId(params.rawChannelId);
	if (resolved) return resolved;
	const fallback = normalizeOptionalLowercaseString(params.rawChannelId);
	if (!fallback) return null;
	return params.metadataByProvider.has(fallback) ? fallback : null;
}
/** Build stable provider labels/default accounts without resolving live account state. */
function buildProviderSummaryMetadataIndex(cfg) {
	const metadata = new Map(listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: false }).map((plugin) => [plugin.id, {
		label: plugin.meta.label,
		defaultAccountId: resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds: plugin.config.listAccountIds(cfg)
		}),
		visibleInConfiguredLists: isChannelVisibleInConfiguredLists(plugin.meta)
	}]));
	const missingHints = resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: listExplicitConfiguredChannelIdsForConfig(cfg).filter((channelId) => !metadata.has(channelId))
	});
	for (const hint of missingHints) metadata.set(hint.channelId, {
		label: hint.label,
		defaultAccountId: DEFAULT_ACCOUNT_ID,
		visibleInConfiguredLists: true,
		repairHint: hint.repairHint
	});
	return metadata;
}
function isUnresolvedSecretRefResolutionError(error) {
	return error instanceof Error && typeof error.message === "string" && /unresolved SecretRef/i.test(error.message);
}
function formatChannelAccountLabel(params) {
	return `${params.providerLabel ?? params.provider} ${params.name?.trim() ? `${params.accountId} (${params.name.trim()})` : params.accountId}`;
}
function formatProviderState(entry) {
	const parts = [entry.state];
	if (entry.enabled === false && entry.state !== "disabled") parts.push("disabled");
	return parts.join(", ");
}
async function resolveReadOnlyAccount(params) {
	if (params.plugin.config.inspectAccount) return await Promise.resolve(params.plugin.config.inspectAccount(params.cfg, params.accountId));
	return params.plugin.config.resolveAccount(params.cfg, params.accountId);
}
/** Inspect configured provider accounts and classify their display state. */
async function buildProviderStatusIndex(cfg) {
	const map = /* @__PURE__ */ new Map();
	for (const plugin of listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: false })) {
		const accountIds = plugin.config.listAccountIds(cfg);
		for (const accountId of accountIds) {
			let account;
			try {
				account = await resolveReadOnlyAccount({
					plugin,
					cfg,
					accountId
				});
			} catch (error) {
				if (!isUnresolvedSecretRefResolutionError(error)) throw error;
				map.set(providerAccountKey(plugin.id, accountId), {
					provider: plugin.id,
					providerLabel: plugin.meta.label,
					accountId,
					state: "configured unavailable",
					configured: true,
					visibleInConfiguredLists: isChannelVisibleInConfiguredLists(plugin.meta)
				});
				continue;
			}
			if (!account) continue;
			const snapshot = plugin.config.describeAccount?.(account, cfg);
			const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : typeof snapshot?.enabled === "boolean" ? snapshot.enabled : account.enabled;
			const configured = plugin.config.isConfigured ? await plugin.config.isConfigured(account, cfg) : snapshot?.configured;
			const resolvedEnabled = typeof enabled === "boolean" ? enabled : true;
			const resolvedConfigured = typeof configured === "boolean" ? configured : true;
			const inspectedConfigured = account.configured;
			const configuredIntent = typeof inspectedConfigured === "boolean" ? inspectedConfigured : snapshot?.configured === true;
			const configuredUnavailable = !resolvedConfigured && configuredIntent && (hasConfiguredUnavailableCredentialStatus(snapshot) || hasConfiguredUnavailableCredentialStatus(account));
			const linked = resolveChannelAccountLinked(resolvedConfigured && plugin.config.isLinked ? await plugin.config.isLinked(account, cfg) : void 0, snapshot?.linked);
			const fallbackState = plugin.status?.resolveAccountState?.({
				account,
				cfg,
				configured: resolvedConfigured,
				enabled: resolvedEnabled
			});
			const state = configuredUnavailable ? "configured unavailable" : projectChannelAccountDisplayState(resolveChannelAccountState({
				enabled: resolvedEnabled,
				configured: resolvedConfigured,
				linked
			}), fallbackState);
			const name = snapshot?.name ?? account.name;
			map.set(providerAccountKey(plugin.id, accountId), {
				provider: plugin.id,
				providerLabel: plugin.meta.label,
				accountId,
				name,
				state,
				enabled,
				configured: configuredUnavailable || configured,
				visibleInConfiguredLists: isChannelVisibleInConfiguredLists(plugin.meta)
			});
		}
	}
	return map;
}
function resolveDefaultAccountId(provider, metadataByProvider) {
	return metadataByProvider.get(provider)?.defaultAccountId ?? "default";
}
function shouldShowProviderEntry(params) {
	if ((params.entry.visibleInConfiguredLists ?? params.metadataByProvider.get(params.entry.provider)?.visibleInConfiguredLists) === false) {
		const providerConfig = params.cfg[params.entry.provider];
		return Boolean(params.entry.configured) || Boolean(providerConfig);
	}
	return Boolean(params.entry.configured);
}
function formatProviderEntry(entry) {
	return `${formatChannelAccountLabel({
		provider: entry.provider,
		providerLabel: entry.providerLabel,
		accountId: entry.accountId,
		name: entry.name
	})}: ${formatProviderState(entry)}`;
}
function formatMissingProviderEntry(params) {
	const label = formatChannelAccountLabel({
		provider: params.provider,
		providerLabel: params.metadata?.label,
		accountId: params.accountId
	});
	if (params.metadata?.repairHint) return `${label}: missing plugin - ${params.metadata.repairHint}`;
	return `${label}: unknown`;
}
/** Render the provider/account routes implied by an agent's route bindings. */
function summarizeBindings(cfg, bindings, metadataByProvider = buildProviderSummaryMetadataIndex(cfg)) {
	if (bindings.length === 0) return [];
	const seen = /* @__PURE__ */ new Map();
	for (const binding of bindings) {
		const channel = resolveProviderChannelId({
			rawChannelId: binding.match.channel,
			metadataByProvider
		});
		if (!channel) continue;
		const accountId = binding.match.accountId ?? resolveDefaultAccountId(channel, metadataByProvider);
		const key = providerAccountKey(channel, accountId);
		if (!seen.has(key)) {
			const label = formatChannelAccountLabel({
				provider: channel,
				providerLabel: metadataByProvider.get(channel)?.label,
				accountId
			});
			seen.set(key, label);
		}
	}
	return [...seen.values()];
}
/** Render provider status lines relevant to a specific agent summary. */
function listProvidersForAgent(params) {
	const allProviderEntries = [...params.providerStatus.values()];
	const providerLines = [];
	const metadataByProvider = params.providerMetadata ?? buildProviderSummaryMetadataIndex(params.cfg);
	if (params.bindings.length > 0) {
		const seen = /* @__PURE__ */ new Set();
		for (const binding of params.bindings) {
			const channel = resolveProviderChannelId({
				rawChannelId: binding.match.channel,
				metadataByProvider
			});
			if (!channel) continue;
			const accountId = binding.match.accountId ?? resolveDefaultAccountId(channel, metadataByProvider);
			const key = providerAccountKey(channel, accountId);
			if (seen.has(key)) continue;
			seen.add(key);
			const status = params.providerStatus.get(key);
			if (status) providerLines.push(formatProviderEntry(status));
			else providerLines.push(formatMissingProviderEntry({
				provider: channel,
				accountId,
				metadata: metadataByProvider.get(channel)
			}));
		}
		return providerLines;
	}
	if (params.summaryIsDefault) {
		const seenProviders = /* @__PURE__ */ new Set();
		for (const entry of allProviderEntries) if (shouldShowProviderEntry({
			entry,
			cfg: params.cfg,
			metadataByProvider
		})) {
			providerLines.push(formatProviderEntry(entry));
			seenProviders.add(entry.provider);
		}
		for (const [provider, metadata] of metadataByProvider.entries()) {
			if (!metadata.repairHint || seenProviders.has(provider)) continue;
			providerLines.push(formatMissingProviderEntry({
				provider,
				accountId: metadata.defaultAccountId,
				metadata
			}));
		}
	}
	return providerLines;
}
//#endregion
//#region src/commands/agents.commands.list.ts
function formatSummary(summary) {
	const safe = sanitizeTerminalText;
	const defaultTag = summary.isDefault ? " (default)" : "";
	const header = summary.name && summary.name !== summary.id ? `${safe(summary.id)}${defaultTag} (${safe(summary.name)})` : `${safe(summary.id)}${defaultTag}`;
	const identityParts = [];
	if (summary.identityEmoji) identityParts.push(safe(summary.identityEmoji));
	if (summary.identityName) identityParts.push(safe(summary.identityName));
	const identityLine = identityParts.length > 0 ? identityParts.join(" ") : null;
	const identitySource = summary.identitySource === "identity" ? "IDENTITY.md" : summary.identitySource === "config" ? "config" : null;
	const lines = [`- ${header}`];
	if (identityLine) lines.push(`  Identity: ${identityLine}${identitySource ? ` (${identitySource})` : ""}`);
	lines.push(`  Workspace: ${safe(shortenHomePath(summary.workspace))}`);
	lines.push(`  Agent dir: ${safe(shortenHomePath(summary.agentDir))}`);
	if (summary.model) lines.push(`  Model: ${safe(summary.model)}`);
	lines.push(`  Routing rules: ${summary.bindings}`);
	if (summary.routes?.length) lines.push(`  Routing: ${summary.routes.map(safe).join(", ")}`);
	if (summary.providers?.length) {
		lines.push("  Providers:");
		for (const provider of summary.providers) lines.push(`    - ${safe(provider)}`);
	}
	if (summary.bindingDetails?.length) {
		lines.push("  Routing rules:");
		for (const binding of summary.bindingDetails) lines.push(`    - ${safe(binding)}`);
	}
	return lines.join("\n");
}
/** Print configured agent summaries with optional binding/provider detail enrichment. */
async function agentsListCommand(opts, runtime = defaultRuntime) {
	const cfg = await requireValidConfig(runtime);
	if (!cfg) return;
	const summaries = buildAgentSummaries(cfg);
	const bindingMap = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) {
		const agentId = normalizeAgentId(binding.agentId);
		const list = bindingMap.get(agentId) ?? [];
		list.push(binding);
		bindingMap.set(agentId, list);
	}
	if (opts.bindings) for (const summary of summaries) {
		const bindings = bindingMap.get(summary.id) ?? [];
		if (bindings.length > 0) summary.bindingDetails = bindings.map((binding) => describeBinding(binding));
	}
	const includeProviderDetails = !opts.json || opts.bindings === true;
	const providerStatus = includeProviderDetails ? await buildProviderStatusIndex(cfg) : null;
	const providerMetadata = includeProviderDetails ? buildProviderSummaryMetadataIndex(cfg) : null;
	for (const summary of summaries) {
		const bindings = bindingMap.get(summary.id) ?? [];
		if (includeProviderDetails && providerStatus && providerMetadata) {
			const routes = summarizeBindings(cfg, bindings, providerMetadata);
			if (routes.length > 0) summary.routes = routes;
			else if (summary.isDefault) summary.routes = ["default (no explicit rules)"];
			const providerLines = listProvidersForAgent({
				summaryIsDefault: summary.isDefault,
				cfg,
				bindings,
				providerStatus,
				providerMetadata
			});
			if (providerLines.length > 0) summary.providers = providerLines;
		}
	}
	if (opts.json) {
		writeRuntimeJson(runtime, summaries);
		return;
	}
	const lines = ["Agents:", ...summaries.map(formatSummary)];
	lines.push("Routing rules map channel/account/peer to an agent. Use --bindings for full rules.");
	lines.push(`Channel status reflects local config/creds. For live health: ${formatCliCommand("openclaw channels status --probe")}.`);
	runtime.log(lines.join("\n"));
}
//#endregion
export { agentsListCommand };
