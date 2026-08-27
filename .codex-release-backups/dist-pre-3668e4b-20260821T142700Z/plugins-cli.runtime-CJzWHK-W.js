import { c as tracePluginLifecyclePhaseAsync } from "./discovery-BLo8sY07.js";
import { p as shortenHomeInString } from "./utils-D9gvQMP6.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { l as readConfigFileSnapshot, r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-DXKu_9VY.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as formatConfigIssueLines } from "./issue-format-wyiFLwqS.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-DFUnyZ_3.js";
import { r as replaceConfigFile } from "./mutate-B2SI65Vd.js";
import "./config-CfeGo4K4.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { a as formatMissingPluginMessage } from "./error-format-BAHQH0iA.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-say_7LA7.js";
import { a as resolveConfiguredRuntimePluginInstallCandidate, i as collectConfiguredRuntimePluginIds } from "./configured-runtime-plugin-installs-ES_ABE-w.js";
//#region src/cli/plugins-cli.runtime.ts
function createModuleLoader(load) {
	let promise;
	return () => promise ??= load();
}
const loadPluginsConfigState = createModuleLoader(() => import("./config-state-kupFMnjm.js"));
const loadPluginsStatus = createModuleLoader(() => import("./status-C-nzRdZH.js"));
const loadPluginSlotSelection = createModuleLoader(() => import("./slot-selection-qRRAAcWa.js"));
const loadPluginsCommandHelpers = createModuleLoader(() => import("./plugins-command-helpers-AP8V6Ww9.js"));
const loadPluginsRegistryRefresh = createModuleLoader(() => import("./registry-refresh-BhS9qvzq.js"));
function countEnabledPlugins(plugins) {
	return plugins.filter((plugin) => plugin.enabled).length;
}
function formatRegistryState(state) {
	return state === "fresh" ? theme.success(state) : theme.warn(state);
}
function reportMissingPlugin(id) {
	defaultRuntime.error(formatMissingPluginMessage({
		id,
		includeSearch: true
	}));
	return defaultRuntime.exit(1);
}
function isConfigSelectedShadowDiagnostic(entry) {
	return entry.level === "warn" && typeof entry.message === "string" && entry.message.includes("duplicate plugin id resolved by explicit config-selected plugin");
}
function isErroredConfigSelectedShadowDiagnostic(params) {
	if (!params.entry.pluginId || !isConfigSelectedShadowDiagnostic(params.entry)) return false;
	return params.plugins.some((plugin) => plugin.id === params.entry.pluginId && plugin.origin === "config" && plugin.status === "error");
}
function formatConfiguredRuntimePluginInstallSpec(params) {
	const clawhubSpec = params.clawhubSpec?.trim();
	const npmSpec = params.npmSpec?.trim();
	if (clawhubSpec && params.defaultChoice !== "npm") return clawhubSpec;
	return npmSpec ?? clawhubSpec ?? params.pluginId;
}
function pluginIdListIncludes(list, pluginId) {
	return Array.isArray(list) && list.some((entry) => entry.trim() === pluginId);
}
function formatBlockedRuntimePluginGuidance(params) {
	const pluginId = params.pluginId;
	const alternative = pluginId === "acpx" ? "disable ACP/acpx in acp config" : "change the runtime policy to \"openclaw\"";
	if (params.cfg.plugins?.enabled === false) return `Enable plugin loading and the "${pluginId}" plugin, or ${alternative}.`;
	if (pluginIdListIncludes(params.cfg.plugins?.deny, pluginId)) return `Remove "${pluginId}" from plugins.deny and enable the "${pluginId}" plugin, or ${alternative}.`;
	if (params.cfg.plugins?.entries?.[pluginId]?.enabled === false) return `Set plugins.entries.${pluginId}.enabled=true or remove that disabled entry, or ${alternative}.`;
}
function formatDisabledRuntimePluginGuidance(params) {
	const allow = params.cfg.plugins?.allow;
	const alternative = params.pluginId === "acpx" ? "disable ACP/acpx in acp config" : "change the runtime policy to \"openclaw\"";
	if (Array.isArray(allow) && allow.length > 0 && !allow.includes(params.pluginId)) return `Add "${params.pluginId}" to plugins.allow and enable the plugin, or ${alternative}.`;
	return `Enable the "${params.pluginId}" plugin, or ${alternative}.`;
}
function collectConfiguredRuntimePluginWarnings(params) {
	const enabledPluginIds = new Set(params.plugins.filter((plugin) => plugin.enabled !== false && plugin.status !== "disabled").map((plugin) => plugin.id));
	return collectConfiguredRuntimePluginIds(params.cfg, { includeImplicitRuntimePreferences: false }).flatMap((runtimeId) => {
		const candidate = resolveConfiguredRuntimePluginInstallCandidate(runtimeId);
		if (!candidate || enabledPluginIds.has(runtimeId)) return [];
		const disabledPluginRecord = params.plugins.find((plugin) => plugin.id === runtimeId);
		const blockedGuidance = formatBlockedRuntimePluginGuidance({
			cfg: params.cfg,
			pluginId: runtimeId
		});
		if (blockedGuidance) return [`- Configured runtime "${runtimeId}" requires the ${candidate.label} plugin, but "${runtimeId}" is blocked by plugin configuration. ${blockedGuidance}`];
		if (disabledPluginRecord) return [`- Configured runtime "${runtimeId}" requires the ${candidate.label} plugin, but "${runtimeId}" is disabled. ${formatDisabledRuntimePluginGuidance({
			cfg: params.cfg,
			pluginId: runtimeId
		})}`];
		const installSpec = formatConfiguredRuntimePluginInstallSpec(candidate);
		return [`- Configured runtime "${runtimeId}" requires the ${candidate.label} plugin, but no enabled "${runtimeId}" plugin was found. Run "openclaw doctor --fix" to install ${installSpec}, or install it manually with "openclaw plugins install ${installSpec}".`];
	});
}
/** Enable a plugin in config and refresh the registry snapshot for the changed policy. */
async function runPluginsEnableCommand(idInput) {
	assertConfigWriteAllowedInCurrentMode();
	return await withPluginLifecycleLease({}, async () => await runPluginsEnableCommandUnlocked(idInput));
}
async function runPluginsEnableCommandUnlocked(idInput) {
	let id = idInput;
	assertConfigWriteAllowedInCurrentMode();
	const { enableExplicitlySelectedPluginInConfig } = await import("./enable-BRA1JhZT.js");
	const { normalizePluginId } = await loadPluginsConfigState();
	const { buildPluginRegistrySnapshotReport } = await loadPluginsStatus();
	const snapshot = await readConfigFileSnapshot();
	const cfg = snapshot.sourceConfig ?? snapshot.config;
	const report = buildPluginRegistrySnapshotReport({ config: cfg });
	id = normalizePluginId(id);
	if (!report.plugins.some((plugin) => plugin.id === id)) return reportMissingPlugin(id);
	const enableResult = enableExplicitlySelectedPluginInConfig(cfg, id, { updateChannelConfig: false });
	if (!enableResult.enabled) {
		defaultRuntime.error(`Plugin "${id}" could not be enabled (${enableResult.reason ?? "unknown reason"}).`);
		return defaultRuntime.exit(1);
	}
	const { applySlotSelectionForPlugin } = await loadPluginSlotSelection();
	const { logSlotWarnings } = await loadPluginsCommandHelpers();
	const { refreshPluginRegistryAfterConfigMutation } = await loadPluginsRegistryRefresh();
	let next = enableResult.config;
	const slotResult = applySlotSelectionForPlugin(next, id);
	next = slotResult.config;
	await replaceConfigFile({
		nextConfig: next,
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
		writeOptions: { explicitSetPaths: [[
			"plugins",
			"entries",
			enableResult.pluginId
		]] }
	});
	await refreshPluginRegistryAfterConfigMutation({
		config: next,
		reason: "policy-changed",
		invalidateRuntimeCache: false,
		policyPluginIds: [enableResult.pluginId],
		logger: { warn: (message) => defaultRuntime.log(theme.warn(message)) }
	});
	logSlotWarnings(slotResult.warnings);
	defaultRuntime.log(`Enabled plugin "${id}". Restart the gateway to apply.`);
}
/** Disable a plugin in config and refresh the registry snapshot for the changed policy. */
async function runPluginsDisableCommand(idInput) {
	assertConfigWriteAllowedInCurrentMode();
	return await withPluginLifecycleLease({}, async () => await runPluginsDisableCommandUnlocked(idInput));
}
async function runPluginsDisableCommandUnlocked(idInput) {
	let id = idInput;
	assertConfigWriteAllowedInCurrentMode();
	const { normalizePluginId } = await loadPluginsConfigState();
	const { buildPluginRegistrySnapshotReport } = await loadPluginsStatus();
	const { setPluginEnabledInConfig } = await import("./plugins-config-CLHTysm7.js");
	const { refreshPluginRegistryAfterConfigMutation } = await loadPluginsRegistryRefresh();
	const snapshot = await readConfigFileSnapshot();
	const cfg = snapshot.sourceConfig ?? snapshot.config;
	const report = buildPluginRegistrySnapshotReport({ config: cfg });
	id = normalizePluginId(id);
	if (!report.plugins.some((plugin) => plugin.id === id)) return reportMissingPlugin(id);
	const next = setPluginEnabledInConfig(cfg, id, false, { updateChannelConfig: false });
	await replaceConfigFile({
		nextConfig: next,
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
		writeOptions: { explicitSetPaths: [[
			"plugins",
			"entries",
			id
		]] }
	});
	await refreshPluginRegistryAfterConfigMutation({
		config: next,
		reason: "policy-changed",
		invalidateRuntimeCache: false,
		policyPluginIds: [id],
		logger: { warn: (message) => defaultRuntime.log(theme.warn(message)) }
	});
	defaultRuntime.log(`Disabled plugin "${id}". Restart the gateway to apply.`);
}
async function runPluginsInstallAction(raw, opts) {
	await tracePluginLifecyclePhaseAsync("install command", async () => {
		const { runPluginInstallCommand } = await import("./plugins-install-command-C38gN8Dx.js");
		await runPluginInstallCommand({
			raw,
			opts,
			allowInstallPolicyWarningPrompt: true,
			invalidateRuntimeCache: false
		});
	}, { command: "install" });
}
/** Inspect or refresh the persisted plugin registry index. */
async function runPluginsRegistryCommand(opts) {
	const { inspectPluginRegistry, refreshPluginRegistry } = await import("./plugin-registry-NIx3PG_L.js");
	if (opts.refresh) return await withPluginLifecycleLease({}, async () => {
		const index = await refreshPluginRegistry({
			config: getRuntimeConfig(),
			reason: "manual"
		});
		if (opts.json) {
			defaultRuntime.writeJson({
				refreshed: true,
				registry: index
			});
			return;
		}
		const total = index.plugins.length;
		const enabled = countEnabledPlugins(index.plugins);
		defaultRuntime.log(`Plugin registry refreshed: ${enabled}/${total} enabled plugins indexed.`);
	});
	const inspection = await inspectPluginRegistry({ config: getRuntimeConfig() });
	if (opts.json) {
		defaultRuntime.writeJson({
			state: inspection.state,
			refreshReasons: inspection.refreshReasons,
			persisted: inspection.persisted,
			current: inspection.current
		});
		return;
	}
	const currentTotal = inspection.current.plugins.length;
	const currentEnabled = countEnabledPlugins(inspection.current.plugins);
	const persistedTotal = inspection.persisted?.plugins.length ?? 0;
	const persistedEnabled = inspection.persisted ? countEnabledPlugins(inspection.persisted.plugins) : 0;
	const lines = [
		`${theme.muted("State:")} ${formatRegistryState(inspection.state)}`,
		`${theme.muted("Current:")} ${currentEnabled}/${currentTotal} enabled plugins`,
		`${theme.muted("Persisted:")} ${persistedEnabled}/${persistedTotal} enabled plugins`
	];
	if (inspection.refreshReasons.length > 0) {
		lines.push(`${theme.muted("Refresh reasons:")} ${inspection.refreshReasons.join(", ")}`);
		lines.push(`${theme.muted("Repair:")} ${theme.command("openclaw plugins registry --refresh")}`);
	}
	defaultRuntime.log(lines.join("\n"));
}
/** Print plugin install-tree, compatibility, and plugin-owned config diagnostics. */
async function runPluginsDoctorCommand(opts = {}) {
	const { buildPluginCompatibilityNotices, buildPluginDiagnosticsReport, formatPluginCompatibilityNotice } = await loadPluginsStatus();
	const { collectStalePluginConfigWarnings, isStalePluginAutoRepairBlocked, scanStalePluginConfig } = await import("./stale-plugin-config-CMq1BmUA.js");
	const cfg = getRuntimeConfig();
	const configSnapshot = await readConfigFileSnapshot().catch(() => null);
	const sourceCfg = configSnapshot?.sourceConfig ?? configSnapshot?.config ?? cfg;
	const report = buildPluginDiagnosticsReport({
		config: cfg,
		effectiveOnly: true
	});
	const errors = report.plugins.filter((p) => p.status === "error");
	const diags = report.diagnostics.filter((entry) => !isConfigSelectedShadowDiagnostic(entry));
	const shadowed = report.diagnostics.filter((entry) => isErroredConfigSelectedShadowDiagnostic({
		entry,
		plugins: report.plugins
	}));
	const compatibility = buildPluginCompatibilityNotices({ report });
	const pluginConfigWarnings = /* @__PURE__ */ new Set([
		...formatConfigIssueLines((configSnapshot?.warnings ?? []).filter(({ path }) => path === "plugins" || path.startsWith("plugins."))),
		...collectStalePluginConfigWarnings({
			hits: scanStalePluginConfig(sourceCfg, process.env),
			doctorFixCommand: "openclaw doctor --fix",
			autoRepairBlocked: isStalePluginAutoRepairBlocked(sourceCfg, process.env)
		}),
		...collectConfiguredRuntimePluginWarnings({
			cfg: sourceCfg,
			plugins: report.plugins
		})
	]);
	const hasInstallTreeIssues = errors.length > 0 || diags.length > 0 || shadowed.length > 0 || compatibility.length > 0;
	if (opts.json) {
		defaultRuntime.writeJson({
			ok: !hasInstallTreeIssues && pluginConfigWarnings.size === 0,
			pluginErrors: errors.map((entry) => ({
				id: entry.id,
				...entry.failurePhase ? { failurePhase: entry.failurePhase } : {},
				error: shortenHomeInString(entry.error ?? "failed to load"),
				source: shortenHomeInString(entry.source)
			})),
			diagnostics: diags.map((entry) => ({
				level: entry.level,
				...entry.pluginId ? { pluginId: entry.pluginId } : {},
				message: shortenHomeInString(entry.message),
				...entry.source ? { source: shortenHomeInString(entry.source) } : {}
			})),
			sourceShadowing: shadowed.map((entry) => {
				const active = report.plugins.find((plugin) => plugin.id === entry.pluginId);
				return {
					...entry.pluginId ? { pluginId: entry.pluginId } : {},
					message: shortenHomeInString(entry.message),
					...active ? { active: {
						source: shortenHomeInString(active.source),
						origin: active.origin,
						status: active.status,
						...active.error ? { error: shortenHomeInString(active.error) } : {}
					} } : {},
					...entry.source ? { shadowedSource: shortenHomeInString(entry.source) } : {},
					repair: [
						`openclaw plugins inspect ${entry.pluginId ?? "<plugin-id>"}`,
						"edit or remove the config-selected plugin source",
						"openclaw plugins registry --refresh",
						"openclaw gateway restart --force"
					]
				};
			}),
			compatibility: compatibility.map((notice) => ({
				...notice,
				message: shortenHomeInString(notice.message)
			})),
			configurationWarnings: Array.from(pluginConfigWarnings, shortenHomeInString)
		});
		return;
	}
	if (!hasInstallTreeIssues && pluginConfigWarnings.size === 0) {
		defaultRuntime.log("Plugin discovery, module loading, compatibility, and configuration checks passed. Run \"openclaw health\" to check the running Gateway, including runtime quarantines and fallbacks.");
		return;
	}
	const lines = [];
	if (errors.length > 0) {
		lines.push(theme.error("Plugin errors:"));
		for (const entry of errors) {
			const phase = entry.failurePhase ? ` [${entry.failurePhase}]` : "";
			lines.push(`- ${entry.id}${phase}: ${entry.error ?? "failed to load"} (${entry.source})`);
		}
	}
	if (diags.length > 0) {
		if (lines.length > 0) lines.push("");
		lines.push(theme.warn("Diagnostics:"));
		for (const diag of diags) {
			const target = diag.pluginId ? `${diag.pluginId}: ` : "";
			lines.push(`- ${target}${diag.message}`);
		}
	}
	if (shadowed.length > 0) {
		if (lines.length > 0) lines.push("");
		lines.push(theme.warn("Plugin source shadowing:"));
		for (const diag of shadowed) {
			const active = report.plugins.find((plugin) => plugin.id === diag.pluginId);
			const target = diag.pluginId ? `${diag.pluginId}: ` : "";
			lines.push(`- ${target}${diag.message}`);
			if (active) {
				lines.push(`  active: ${shortenHomeInString(active.source)} (${active.origin})`);
				if (active.status === "error") lines.push(`  active status: error${active.error ? `: ${active.error}` : ""}`);
			}
			if (diag.source) lines.push(`  shadowed: ${shortenHomeInString(diag.source)}`);
			lines.push("  repair:");
			lines.push("    openclaw plugins inspect " + (diag.pluginId ?? "<plugin-id>"));
			lines.push("    edit or remove the config-selected plugin source");
			lines.push("    openclaw plugins registry --refresh");
			lines.push("    openclaw gateway restart --force");
		}
	}
	if (compatibility.length > 0) {
		if (lines.length > 0) lines.push("");
		lines.push(theme.warn("Compatibility:"));
		for (const notice of compatibility) {
			const marker = notice.severity === "warn" ? theme.warn("warn") : theme.muted("info");
			lines.push(`- ${formatPluginCompatibilityNotice(notice)} [${marker}]`);
		}
	}
	if (pluginConfigWarnings.size > 0) {
		if (lines.length > 0) lines.push("");
		lines.push(theme.warn("Plugin configuration:"));
		lines.push(...pluginConfigWarnings);
	}
	if (!hasInstallTreeIssues && pluginConfigWarnings.size > 0) {
		if (lines.length > 0) lines.push("");
		lines.push("No plugin install-tree issues detected; configuration warnings remain.");
	}
	const docs = formatDocsLink("/plugin", "docs.openclaw.ai/plugin");
	lines.push("");
	lines.push(`${theme.muted("Docs:")} ${docs}`);
	defaultRuntime.log(lines.join("\n"));
}
function classifyMarketplaceFeedFallback(error) {
	const text = error?.toLowerCase();
	if (!text) return;
	return [
		[/offline mode/u, "offline"],
		[/checksum mismatch/u, "checksum_mismatch"],
		[/schema/u, "schema"],
		[/http\s+304/u, "not_modified"],
		[/http\s+\d{3}/u, "http_error"],
		[/timed out|timeout/u, "timeout"]
	].find(([pattern]) => pattern.test(text))?.[1] ?? "error";
}
function emitMarketplaceFeedTelemetry(params) {
	const attributes = {
		command: params.command,
		entries: params.entryCount ?? params.payload.entries,
		source: params.payload.source
	};
	if (params.opts.feedProfile?.trim()) attributes.feedProfileProvided = true;
	if (params.opts.feedUrl?.trim()) attributes.feedUrlOverride = true;
	if (params.opts.offline === true) attributes.offline = true;
	if (params.opts.expectedSha256?.trim()) attributes.expectedSha256Provided = true;
	if (params.payload.feed) {
		attributes.feedIdPresent = true;
		attributes.feedSequence = params.payload.feed.sequence;
	}
	if (params.payload.metadata) {
		attributes.httpStatus = params.payload.metadata.status;
		if (params.payload.metadata.checksum) attributes.payloadChecksumPresent = true;
		attributes.hasEtag = Boolean(params.payload.metadata.etag);
		attributes.hasLastModified = Boolean(params.payload.metadata.lastModified);
	}
	if (params.payload.snapshot) attributes.snapshotUsed = true;
	if (params.payload.trust) {
		attributes.feedTrustVerified = true;
		attributes.feedTrustMode = params.payload.trust.mode;
		attributes.feedTrustSignatureCount = params.payload.trust.signatureCount;
		attributes.feedTrustThreshold = params.payload.trust.threshold;
	}
	const fallbackCategory = classifyMarketplaceFeedFallback(params.payload.error);
	if (fallbackCategory) attributes.fallbackCategory = fallbackCategory;
	if (params.failedPinnedRefresh === true) attributes.pinnedRefreshFailed = true;
	emitDiagnosticsTimelineEvent({
		type: "mark",
		name: `plugins.marketplace.feed.${params.command}`,
		phase: "plugin-marketplace",
		attributes
	}, { config: params.config });
}
function buildMarketplaceRefreshPayload(result) {
	const payload = {
		source: result.source,
		entries: result.entries.length,
		...result.metadata ? { metadata: result.metadata } : {}
	};
	if (result.source === "hosted" || result.source === "hosted-snapshot") {
		payload.feed = {
			id: result.feed.id,
			generatedAt: result.feed.generatedAt,
			sequence: result.feed.sequence
		};
		if (result.trust) payload.trust = {
			mode: result.trust.mode,
			signedBy: result.trust.signedBy,
			signatureCount: result.trust.signatureCount,
			threshold: result.trust.threshold,
			verifiedAt: result.trust.verifiedAt
		};
	}
	if (result.source === "hosted-snapshot") {
		payload.snapshot = { savedAt: result.snapshot.savedAt };
		payload.error = result.error;
	}
	if (result.source === "bundled-fallback") payload.error = result.error;
	return payload;
}
function redactMarketplaceFeedUrl(value) {
	try {
		const url = new URL(value);
		url.username = "";
		url.password = "";
		url.search = "";
		url.hash = "";
		return url.href;
	} catch {
		return value;
	}
}
function redactMarketplaceOutputText(value, rawUrls) {
	let redacted = value;
	for (const rawUrl of rawUrls) {
		if (!rawUrl) continue;
		redacted = redacted.replaceAll(rawUrl, () => redactMarketplaceFeedUrl(rawUrl));
	}
	return redacted;
}
function sanitizeMarketplaceRefreshPayload(payload, params) {
	const rawMetadataUrl = payload.metadata?.url;
	const sanitized = {
		...payload,
		...payload.metadata ? { metadata: {
			...payload.metadata,
			url: redactMarketplaceFeedUrl(payload.metadata.url)
		} } : {}
	};
	if (payload.error) sanitized.error = redactMarketplaceOutputText(payload.error, [params?.feedUrl, rawMetadataUrl]);
	return sanitized;
}
function formatMarketplaceEntryInstall(entry) {
	if (entry.install?.defaultChoice === "npm") return entry.install.npmSpec ?? entry.install.clawhubSpec ?? entry.install.localPath;
	return entry.install?.clawhubSpec ?? entry.install?.npmSpec ?? entry.install?.localPath;
}
function formatMarketplaceEntryLine(entry) {
	const id = entry.id ?? entry.name ?? entry.label;
	const install = formatMarketplaceEntryInstall(entry);
	const suffix = install ? " " + theme.muted(install) : "";
	const label = entry.label !== id ? " " + theme.muted(entry.label) : "";
	return theme.command(id) + label + suffix;
}
function formatMarketplaceRefreshSource(source) {
	if (source === "hosted") return theme.success("hosted");
	if (source === "hosted-snapshot") return theme.warn("hosted snapshot");
	return theme.warn("bundled fallback");
}
function formatMarketplaceFeedTrust(trust) {
	return `${trust.mode} by ${trust.signedBy} (${trust.signatureCount}/${trust.threshold}) verified ${trust.verifiedAt}`;
}
function formatMarketplaceFeedLines(payload, options = {}) {
	const lines = [`${theme.muted("Source:")} ${formatMarketplaceRefreshSource(payload.source)}`, `${theme.muted("Entries:")} ${payload.entries}`];
	if (payload.feed) lines.push(`${theme.muted("Feed:")} ${payload.feed.id} ${theme.muted(`sequence ${payload.feed.sequence}`)}`);
	if (payload.metadata?.url) lines.push(`${theme.muted("URL:")} ${payload.metadata.url}`);
	if (options.includeChecksum && payload.metadata?.checksum) lines.push(`${theme.muted("SHA-256:")} ${payload.metadata.checksum}`);
	if (payload.snapshot?.savedAt) lines.push(`${theme.muted("Snapshot:")} ${payload.snapshot.savedAt}`);
	if (payload.trust) lines.push(`${theme.muted("Trust:")} ${formatMarketplaceFeedTrust(payload.trust)}`);
	if (payload.error) lines.push(`${theme.muted("Fallback reason:")} ${payload.error}`);
	return lines;
}
function shouldFailPinnedMarketplaceRefresh(params) {
	return Boolean(params.expectedSha256?.trim()) && params.source !== "hosted";
}
function normalizeMarketplaceExpectedSha256(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (/^[0-9a-f]{64}$/iu.test(trimmed)) return `sha256:${trimmed.toLowerCase()}`;
	const prefixed = /^sha256:([0-9a-f]{64})$/iu.exec(trimmed);
	if (prefixed?.[1]) return `sha256:${prefixed[1].toLowerCase()}`;
	return trimmed;
}
function formatPinnedMarketplaceRefreshFailure(payload) {
	return `Pinned marketplace feed refresh did not accept a fresh hosted payload (source: ${payload.source}).`;
}
const MARKETPLACE_GATEWAY_RESTART_GUIDANCE = "The running Gateway could not refresh its marketplace catalog. Run \"openclaw gateway restart\" to apply the current catalog state.";
/** List entries from the configured OpenClaw marketplace feed. */
async function runPluginMarketplaceEntriesCommand(opts) {
	const catalog = await import("./official-external-plugin-catalog-Dl_X0UD8.js");
	const cfg = getRuntimeConfig();
	const result = await catalog.loadConfiguredHostedOfficialExternalPluginCatalogEntries({
		...opts.feedProfile ? { feedProfile: opts.feedProfile } : {},
		...opts.feedUrl ? { feedUrl: opts.feedUrl } : {},
		...opts.offline ? { offline: true } : {}
	});
	const summary = sanitizeMarketplaceRefreshPayload(buildMarketplaceRefreshPayload(result), { feedUrl: opts.feedUrl });
	const entries = result.entries.map((entry) => {
		const id = catalog.resolveOfficialExternalPluginId(entry);
		const install = catalog.resolveOfficialExternalPluginInstall(entry) ?? void 0;
		const payload = { label: catalog.resolveOfficialExternalPluginLabel(entry) };
		if (id) payload.id = id;
		if (entry.kind) payload.kind = entry.kind;
		if (entry.name) payload.name = entry.name;
		if (entry.version) payload.version = entry.version;
		if (install) payload.install = install;
		return payload;
	});
	emitMarketplaceFeedTelemetry({
		command: "entries",
		entryCount: entries.length,
		opts,
		config: cfg,
		payload: summary
	});
	if (opts.json) {
		defaultRuntime.writeJson({
			...summary,
			entries,
			entryCount: entries.length
		});
		return;
	}
	const lines = formatMarketplaceFeedLines(summary);
	if (entries.length > 0) {
		lines.push("");
		lines.push(...entries.map(formatMarketplaceEntryLine));
	}
	defaultRuntime.log(lines.join("\n"));
}
/** Refresh the configured OpenClaw marketplace feed snapshot. */
async function runPluginMarketplaceRefreshCommand(opts) {
	const { loadConfiguredHostedOfficialExternalPluginCatalogEntries } = await import("./official-external-plugin-catalog-Dl_X0UD8.js");
	const cfg = getRuntimeConfig();
	const expectedSha256 = normalizeMarketplaceExpectedSha256(opts.expectedSha256);
	const result = await loadConfiguredHostedOfficialExternalPluginCatalogEntries({
		...opts.feedProfile ? { feedProfile: opts.feedProfile } : {},
		...opts.feedUrl ? { feedUrl: opts.feedUrl } : {},
		...expectedSha256 ? { expectedSha256 } : {},
		requireSnapshotWrite: true
	});
	const { clearManagedPluginOfficialCatalogCache } = await import("./management-service-BDqb6gQ-.js");
	clearManagedPluginOfficialCatalogCache();
	let gatewayRefreshed = true;
	if (result.source !== "bundled-fallback") {
		const { notifyGatewayPluginMetadataChanged } = await import("./plugins-update-gateway-signal-CeoTbxgP.js");
		gatewayRefreshed = await notifyGatewayPluginMetadataChanged(cfg);
	}
	const payload = sanitizeMarketplaceRefreshPayload(buildMarketplaceRefreshPayload(result), { feedUrl: opts.feedUrl });
	const failedPinnedRefresh = shouldFailPinnedMarketplaceRefresh({
		expectedSha256,
		source: payload.source
	});
	emitMarketplaceFeedTelemetry({
		command: "refresh",
		failedPinnedRefresh,
		opts,
		config: cfg,
		payload
	});
	if (opts.json) {
		defaultRuntime.writeJson(payload);
		if (!gatewayRefreshed) defaultRuntime.error(MARKETPLACE_GATEWAY_RESTART_GUIDANCE);
		if (failedPinnedRefresh) {
			defaultRuntime.error(formatPinnedMarketplaceRefreshFailure(payload));
			return defaultRuntime.exit(1);
		}
		return;
	}
	const lines = formatMarketplaceFeedLines(payload, { includeChecksum: true });
	if (!gatewayRefreshed) lines.push("", theme.warn(MARKETPLACE_GATEWAY_RESTART_GUIDANCE));
	defaultRuntime.log(lines.join("\n"));
	if (failedPinnedRefresh) {
		defaultRuntime.error(formatPinnedMarketplaceRefreshFailure(payload));
		return defaultRuntime.exit(1);
	}
}
/** List plugins from a configured marketplace manifest. */
async function runPluginMarketplaceListCommand(source, opts) {
	const { listMarketplacePlugins } = await import("./marketplace-Csy9-1v4.js");
	const { createPluginInstallLogger, quietPluginJsonLogger } = await loadPluginsCommandHelpers();
	const result = await listMarketplacePlugins({
		marketplace: source,
		logger: opts.json ? quietPluginJsonLogger : createPluginInstallLogger()
	});
	if (!result.ok) {
		defaultRuntime.error(result.error);
		return defaultRuntime.exit(1);
	}
	if (opts.json) {
		defaultRuntime.writeJson({
			source: result.sourceLabel,
			name: result.manifest.name,
			version: result.manifest.version,
			plugins: result.manifest.plugins
		});
		return;
	}
	if (result.manifest.plugins.length === 0) {
		defaultRuntime.log(`No plugins found in marketplace ${result.sourceLabel}.`);
		return;
	}
	defaultRuntime.log(`${theme.heading("Marketplace")} ${theme.muted(result.manifest.name ?? result.sourceLabel)}`);
	for (const plugin of result.manifest.plugins) {
		const suffix = plugin.version ? theme.muted(` v${plugin.version}`) : "";
		const desc = plugin.description ? ` - ${theme.muted(plugin.description)}` : "";
		defaultRuntime.log(`${theme.command(plugin.name)}${suffix}${desc}`);
	}
}
//#endregion
export { runPluginMarketplaceEntriesCommand, runPluginMarketplaceListCommand, runPluginMarketplaceRefreshCommand, runPluginsDisableCommand, runPluginsDoctorCommand, runPluginsEnableCommand, runPluginsInstallAction, runPluginsRegistryCommand };
