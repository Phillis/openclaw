import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as ExpectedCliError } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { n as getRuntimeConfig, s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { i as normalizeChatChannelId, n as CHAT_CHANNEL_ORDER } from "./ids-Cgp0iV_A.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-BBST5Lo5.js";
import "./plugin-registry-DS2siXub.js";
import { r as theme } from "./theme-vjDs9tao.js";
import "./registry-DbgR8dhg.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { t as danger } from "./globals-GZNLg1ns.js";
import { c as formatUnknownChannelMessage, l as formatUnsupportedChannelActionMessage } from "./error-format-HTpcnFye.js";
import { o as callGateway } from "./call-Bwn2P4nz.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import "./message-channel-BZwx7FCw.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-BhPKqfrV.js";
import { r as createMessageActionDiscoveryContext, u as resolveMessageActionDiscoveryForPlugin } from "./message-action-discovery-BKb237RL.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-BRB1TsMb.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-cxjR1aAq.js";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-Bc9PIZgv.js";
import { s as getChannelsCommandSecretTargetIds } from "./command-secret-targets-DLC-aqND.js";
import { t as createClackPrompter } from "./clack-prompter-DghMKpQq.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BwV39-oy.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-DHzKSPNn.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DHP7AXSk.js";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-BVpkiG83.js";
import { n as readConfiguredParsedLogTail } from "./log-tail-BfEjNefQ.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-BZK80QZW.js";
import { i as prepareChannelAccountRemoval, n as channelLabel, r as applyPreparedChannelAccountRemoval, t as channelsAddCommand } from "./add-CurjyIlI.js";
import { c as requireValidChannelConfig, l as shouldUseWizard, s as formatChannelAccountLabel } from "./shared-CT2ea0M7.js";
import { t as channelsListCommand } from "./list-DaZV5YHJ.js";
import { t as channelsStatusCommand } from "./status-DFp4thcL.js";
//#region src/commands/channels/plugin-config-persistence.ts
async function persistResolvedChannelPluginConfig(params) {
	if (!params.resolved.configChanged) return params.resolved.cfg;
	const cfg = params.resolved.cfg;
	if (Boolean(cfg.plugins?.installs && Object.keys(cfg.plugins.installs).length > 0)) {
		const committed = await commitConfigWithPendingPluginInstalls({
			nextConfig: cfg,
			baseHash: params.baseHash
		});
		await refreshPluginRegistryAfterConfigMutation({
			config: committed.config,
			reason: "source-changed",
			installRecords: committed.installRecords,
			logger: { warn: (message) => params.runtime.log(message) }
		});
		return committed.config;
	}
	await replaceConfigFile({
		nextConfig: cfg,
		baseHash: params.baseHash
	});
	if (params.resolved.pluginInstalled) await refreshPluginRegistryAfterConfigMutation({
		config: cfg,
		reason: "source-changed",
		logger: { warn: (message) => params.runtime.log(message) }
	});
	return cfg;
}
//#endregion
//#region src/commands/channels/capabilities.ts
const CHANNEL_CAPABILITIES_TIMEOUT_MAX_MS = 3e4;
function resolveChannelCapabilitiesTimeoutMs(timeoutMs) {
	return Math.min(timeoutMs, CHANNEL_CAPABILITIES_TIMEOUT_MAX_MS);
}
async function raceChannelCapabilitiesStep(params) {
	let timeout;
	const timeoutPromise = new Promise((resolve) => {
		timeout = setTimeout(() => resolve({ kind: "timeout" }), params.timeoutMs);
		timeout.unref?.();
	});
	const resultPromise = Promise.resolve().then(params.run).then((value) => ({
		kind: "value",
		value
	}), (error) => ({
		kind: "error",
		error
	}));
	const result = await Promise.race([resultPromise, timeoutPromise]);
	if (timeout) clearTimeout(timeout);
	return result;
}
async function runChannelCapabilitiesProbe(params) {
	const result = await raceChannelCapabilitiesStep(params);
	switch (result.kind) {
		case "value": return result.value;
		case "timeout": return {
			ok: false,
			timedOut: true,
			error: `probe timed out after ${params.timeoutMs}ms`
		};
		case "error": return {
			ok: false,
			error: formatErrorMessage(result.error)
		};
	}
}
async function runChannelCapabilitiesDiagnostics(params) {
	const result = await raceChannelCapabilitiesStep(params);
	switch (result.kind) {
		case "value": return result.value;
		case "timeout": return {
			lines: [{
				text: `Diagnostics: timed out after ${params.timeoutMs}ms`,
				tone: "error"
			}],
			details: { timedOut: true }
		};
		case "error": return { lines: [{
			text: `Diagnostics: failed (${formatErrorMessage(result.error)})`,
			tone: "error"
		}] };
	}
}
function formatSupport(capabilities) {
	if (!capabilities) return "unknown";
	const bits = [];
	if (capabilities.chatTypes?.length) bits.push(`chatTypes=${capabilities.chatTypes.join(",")}`);
	if (capabilities.polls) bits.push("polls");
	if (capabilities.reactions) bits.push("reactions");
	if (capabilities.edit) bits.push("edit");
	if (capabilities.unsend) bits.push("unsend");
	if (capabilities.reply) bits.push("reply");
	if (capabilities.effects) bits.push("effects");
	if (capabilities.groupManagement) bits.push("groupManagement");
	if (capabilities.threads) bits.push("threads");
	if (capabilities.media) bits.push("media");
	if (capabilities.nativeCommands) bits.push("nativeCommands");
	if (capabilities.blockStreaming) bits.push("blockStreaming");
	return bits.length ? bits.join(" ") : "none";
}
function formatGenericProbeLines(probe) {
	if (!probe || typeof probe !== "object") return [];
	const probeObj = probe;
	const ok = typeof probeObj.ok === "boolean" ? probeObj.ok : void 0;
	if (ok === true) return [{ text: "Probe: ok" }];
	if (ok === false) return [{
		text: `Probe: failed${typeof probeObj.error === "string" && probeObj.error ? ` (${probeObj.error})` : ""}`,
		tone: "error"
	}];
	return [];
}
function renderDisplayLine(line) {
	switch (line.tone) {
		case "muted": return theme.muted(line.text);
		case "success": return theme.success(line.text);
		case "warn": return theme.warn(line.text);
		case "error": return theme.error(line.text);
		default: return line.text;
	}
}
async function resolveChannelReports(params) {
	const { plugin, cfg, timeoutMs } = params;
	const accountIds = params.accountOverride ? [params.accountOverride] : (() => {
		const ids = plugin.config.listAccountIds(cfg);
		return ids.length > 0 ? ids : [resolveChannelDefaultAccountId({
			plugin,
			cfg,
			accountIds: ids
		})];
	})();
	const reports = [];
	for (const accountId of accountIds) {
		const resolvedAccount = plugin.config.resolveAccount(cfg, accountId);
		const configured = plugin.config.isConfigured ? await plugin.config.isConfigured(resolvedAccount, cfg) : Boolean(resolvedAccount);
		const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(resolvedAccount, cfg) : resolvedAccount.enabled !== false;
		let probe;
		if (configured && enabled && plugin.status?.probeAccount) probe = await runChannelCapabilitiesProbe({
			timeoutMs,
			run: () => plugin.status?.probeAccount?.({
				account: resolvedAccount,
				timeoutMs,
				cfg
			})
		});
		const diagnostics = configured && enabled && plugin.status?.buildCapabilitiesDiagnostics ? await runChannelCapabilitiesDiagnostics({
			timeoutMs,
			run: () => plugin.status?.buildCapabilitiesDiagnostics?.({
				account: resolvedAccount,
				timeoutMs,
				cfg,
				probe,
				target: params.target
			})
		}) : void 0;
		const discoveredActions = resolveMessageActionDiscoveryForPlugin({
			pluginId: plugin.id,
			actions: plugin.actions,
			context: createMessageActionDiscoveryContext({
				cfg,
				accountId
			}),
			includeActions: true
		}).actions;
		const actions = Array.from(/* @__PURE__ */ new Set([
			"send",
			"broadcast",
			...discoveredActions.map((action) => action)
		]));
		reports.push({
			plugin,
			channel: plugin.id,
			accountId,
			accountName: typeof resolvedAccount.name === "string" ? normalizeOptionalString(resolvedAccount.name) : void 0,
			configured,
			enabled,
			support: plugin.capabilities,
			probe,
			actions,
			diagnostics
		});
	}
	return reports;
}
/** Print or serialize configured channel capabilities, actions, and optional health probe details. */
async function channelsCapabilitiesCommand(opts, runtime = defaultRuntime) {
	const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
	const loadedCfg = await requireValidChannelConfig(runtime);
	if (!loadedCfg) return;
	let cfg = loadedCfg;
	const timeoutMs = resolveChannelCapabilitiesTimeoutMs(parseTimeoutMsWithFallback(opts.timeout, 1e4));
	const rawChannel = normalizeLowercaseStringOrEmpty(opts.channel);
	const rawTarget = normalizeOptionalString(opts.target) ?? "";
	if ((!rawChannel || rawChannel === "all") && (opts.account || rawTarget)) {
		const message = `${opts.account ? "--account" : "--target"} requires a specific --channel. Run ${formatCliCommand("openclaw channels list")} to choose one.`;
		throw new ExpectedCliError({
			message,
			humanOutput: danger(message),
			machineOutput: message
		});
	}
	const plugins = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: true });
	const selected = !rawChannel || rawChannel === "all" ? plugins : await (async () => {
		const resolved = await resolveInstallableChannelPlugin({
			cfg,
			runtime,
			rawChannel,
			allowInstall: true
		});
		if (resolved.configChanged) cfg = await persistResolvedChannelPluginConfig({
			resolved,
			baseHash: (await sourceSnapshotPromise)?.hash,
			runtime
		});
		return resolved.plugin ? [resolved.plugin] : null;
	})();
	if (!selected || selected.length === 0) {
		if (!rawChannel || rawChannel === "all") {
			if (opts.json) {
				writeRuntimeJson(runtime, { channels: [] });
				return;
			}
			runtime.log(theme.muted(`No configured channel capabilities found. Run ${formatCliCommand("openclaw channels list --all")} to see available channels.`));
			return;
		}
		const message = formatUnknownChannelMessage({ channel: rawChannel });
		throw new ExpectedCliError({
			message,
			humanOutput: danger(message),
			machineOutput: message
		});
	}
	const reports = [];
	for (const plugin of selected) {
		const accountOverride = normalizeOptionalString(opts.account);
		reports.push(...await resolveChannelReports({
			plugin,
			cfg,
			timeoutMs,
			accountOverride,
			target: rawTarget || void 0
		}));
	}
	if (opts.json) {
		writeRuntimeJson(runtime, { channels: reports });
		return;
	}
	const lines = [];
	for (const report of reports) {
		const label = formatChannelAccountLabel({
			channel: report.channel,
			accountId: report.accountId,
			name: report.accountName,
			channelLabel: report.plugin.meta.label ?? report.channel,
			channelStyle: theme.accent,
			accountStyle: theme.heading
		});
		lines.push(theme.heading(label));
		lines.push(`Support: ${formatSupport(report.support)}`);
		if (report.actions && report.actions.length > 0) lines.push(`Actions: ${report.actions.join(", ")}`);
		if (report.configured === false || report.enabled === false) {
			const configuredLabel = report.configured === false ? "not configured" : "configured";
			const enabledLabel = report.enabled === false ? "disabled" : "enabled";
			lines.push(`Status: ${configuredLabel}, ${enabledLabel}`);
		}
		const formattedProbeLines = report.plugin.status?.formatCapabilitiesProbe?.({ probe: report.probe });
		const probeLines = formattedProbeLines?.length ? formattedProbeLines : formatGenericProbeLines(report.probe);
		if (probeLines.length > 0) lines.push(...probeLines.map(renderDisplayLine));
		else if (report.configured && report.enabled) lines.push(theme.muted("Probe: unavailable"));
		if (report.diagnostics?.lines?.length) lines.push(...report.diagnostics.lines.map(renderDisplayLine));
		lines.push("");
	}
	runtime.log(lines.join("\n").trimEnd());
}
//#endregion
//#region src/commands/channels/logs.ts
const DEFAULT_LIMIT = 200;
const MAX_BYTES = 1e6;
function listManifestChannels() {
	return loadPluginManifestRegistryForPluginRegistry({
		includeDisabled: true,
		env: process.env
	}).plugins.flatMap((plugin) => plugin.channels.flatMap((rawChannel) => {
		const id = normalizeLowercaseStringOrEmpty(rawChannel);
		return id ? [{
			id,
			pluginId: plugin.id
		}] : [];
	}));
}
function parseChannelFilter(raw) {
	if (raw === void 0) return {
		channel: "all",
		pluginIds: /* @__PURE__ */ new Set()
	};
	const trimmed = normalizeLowercaseStringOrEmpty(raw);
	if (trimmed === "all") return {
		channel: "all",
		pluginIds: /* @__PURE__ */ new Set()
	};
	const manifestChannels = listManifestChannels();
	const bundled = normalizeChatChannelId(trimmed);
	const channel = bundled ?? trimmed;
	const pluginIds = new Set(manifestChannels.filter((entry) => entry.id === channel).map((entry) => entry.pluginId));
	if (bundled || pluginIds.size > 0) return {
		channel,
		pluginIds
	};
	const manifestIds = [...new Set(manifestChannels.map((entry) => entry.id))].toSorted();
	const validChannels = ["all", .../* @__PURE__ */ new Set([...CHAT_CHANNEL_ORDER, ...manifestIds])];
	throw new Error(`Unknown channel ${JSON.stringify(raw)}. Valid channels: ${validChannels.join(", ")}`);
}
function matchesChannelContext(value, channel) {
	const path = `gateway/channels/${channel}`;
	return value === channel || value === path || value?.startsWith(`${path}/`) === true;
}
function matchesChannel(line, filter) {
	const { channel } = filter;
	if (channel === "all") return true;
	return matchesChannelContext(line.subsystem, channel) || matchesChannelContext(line.module, channel) || line.plugin !== void 0 && filter.pluginIds.has(line.plugin);
}
function parseLinesOption(value) {
	if (value === void 0 || value === null || value === "") return DEFAULT_LIMIT;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error("--lines must be a positive integer.");
	return parsed;
}
/** Print or serialize recent log lines matching one channel subsystem/module. */
async function channelsLogsCommand(opts, runtime = defaultRuntime) {
	const filter = parseChannelFilter(opts.channel);
	const { channel } = filter;
	const tail = await readConfiguredParsedLogTail({
		limit: parseLinesOption(opts.lines),
		maxBytes: MAX_BYTES,
		filter: (line) => matchesChannel(line, filter)
	});
	const { lines, truncated } = tail;
	if (opts.json) {
		writeRuntimeJson(runtime, {
			file: tail.file,
			channel,
			truncated,
			lines
		});
		return;
	}
	runtime.log(theme.info(`Log file: ${tail.file}`));
	if (channel !== "all") runtime.log(theme.info(`Channel: ${channel}`));
	if (truncated) runtime.log(theme.warn("Log tail truncated; earlier entries were omitted."));
	if (lines.length === 0) {
		runtime.log(theme.muted("No matching log lines."));
		return;
	}
	for (const line of lines) {
		const ts = line.time ? `${line.time} ` : "";
		const level = line.level ? `${normalizeLowercaseStringOrEmpty(line.level)} ` : "";
		runtime.log(`${ts}${level}${line.message}`.trim());
	}
}
//#endregion
//#region src/commands/channels/remove.ts
function listAccountIds(cfg, channel, pluginInput) {
	let plugin = pluginInput;
	plugin ??= getChannelPlugin(channel);
	if (!plugin) return [];
	return plugin.config.listAccountIds(cfg);
}
async function stopGatewayRuntimeBeforeRemove(params) {
	if (!params.shouldStopRuntime) return;
	try {
		await callGateway({
			config: params.cfg,
			method: "channels.stop",
			params: {
				channel: params.channel,
				accountId: params.accountId
			},
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			deviceIdentity: null
		});
	} catch (error) {
		params.runtime.log(`Could not stop running ${channelLabel(params.channel)} account "${params.accountId}" before removing it: ${formatErrorMessage(error)}`);
	}
}
/** Disable or delete a channel account, stopping gateway runtime state before mutation. */
async function channelsRemoveCommand(opts, runtime = defaultRuntime, params) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const baseHash = configSnapshot.hash;
	let cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
	const useWizard = shouldUseWizard(params);
	const prompter = useWizard ? createClackPrompter() : null;
	const rawChannel = normalizeOptionalString(opts.channel) ?? "";
	let lookupChannel = rawChannel;
	let channel = normalizeChannelId(rawChannel);
	let accountId = normalizeAccountId(opts.account);
	const deleteConfig = Boolean(opts.delete);
	if (useWizard && prompter) {
		await prompter.intro("Remove channel account");
		const readOnlyPlugins = listReadOnlyChannelPluginsForConfig(cfg, { includeSetupFallbackPlugins: true });
		const selectedChannel = await prompter.select({
			message: "Channel",
			options: readOnlyPlugins.map((plugin) => ({
				value: plugin.id,
				label: plugin.meta.label
			}))
		});
		channel = selectedChannel;
		lookupChannel = selectedChannel;
		accountId = await (async () => {
			const readOnlyPlugin = readOnlyPlugins.find((plugin) => plugin.id === selectedChannel);
			const ids = listAccountIds(cfg, selectedChannel, readOnlyPlugin);
			return normalizeAccountId(await prompter.select({
				message: "Account",
				options: ids.map((id) => ({
					value: id,
					label: id === "default" ? "default (primary)" : id
				})),
				initialValue: ids[0] ?? "default"
			}));
		})();
		if (!await prompter.confirm({
			message: `Disable ${channelLabel(selectedChannel)} account "${accountId}"? (keeps config)`,
			initialValue: true
		})) {
			await prompter.outro("Cancelled.");
			return;
		}
	} else {
		if (!rawChannel) {
			runtime.error(`Missing channel. Use ${formatCliCommand("openclaw channels remove --channel <name>")} or run ${formatCliCommand("openclaw channels status")} to inspect configured channels.`);
			runtime.exit(1);
			return;
		}
		if (!deleteConfig) {
			const confirm = createClackPrompter();
			const channelPromptLabel = channel ? channelLabel(channel) : rawChannel;
			if (!await confirm.confirm({
				message: `Disable ${channelPromptLabel} account "${accountId}"? (keeps config)`,
				initialValue: true
			})) return;
		}
	}
	const resolvedPluginState = Boolean(lookupChannel || channel) ? await (async () => {
		const { resolveInstallableChannelPlugin } = await import("./channel-plugin-resolution-DBcGqeaF.js");
		return await resolveInstallableChannelPlugin({
			cfg,
			runtime,
			rawChannel: lookupChannel,
			allowInstall: false
		});
	})() : null;
	if (resolvedPluginState?.configChanged) cfg = resolvedPluginState.cfg;
	const resolvedChannel = resolvedPluginState?.channelId ?? channel;
	if (!resolvedChannel) {
		runtime.error(formatUnknownChannelMessage({ channel: rawChannel }));
		runtime.exit(1);
		return;
	}
	channel = resolvedChannel;
	const plugin = resolvedPluginState?.plugin ?? getChannelPlugin(resolvedChannel);
	if (!plugin) {
		if (resolvedPluginState?.catalogEntry) {
			runtime.error(`Channel plugin "${resolvedPluginState.catalogEntry.id}" is not installed. Run ${formatCliCommand(`openclaw channels add --channel ${resolvedPluginState.catalogEntry.id}`)} first.`);
			runtime.exit(1);
			return;
		}
		runtime.error(formatUnknownChannelMessage({ channel: resolvedChannel }));
		runtime.exit(1);
		return;
	}
	const resolvedChannelId = resolvedChannel;
	const preparedRemoval = prepareChannelAccountRemoval({
		plugin,
		accountId,
		action: deleteConfig ? "delete" : "disable"
	});
	await stopGatewayRuntimeBeforeRemove({
		cfg,
		channel: resolvedChannelId,
		accountId: preparedRemoval.accountKey,
		shouldStopRuntime: preparedRemoval.shouldStopRuntime,
		runtime
	});
	const removal = await applyPreparedChannelAccountRemoval({
		cfg,
		prepared: preparedRemoval,
		runtime
	});
	if (!removal.ok) {
		runtime.error(removal.error.action === "delete" ? `${formatUnsupportedChannelActionMessage({
			channel,
			action: "delete"
		})} Use ${formatCliCommand("openclaw channels remove --channel " + channel)} to disable it without deleting config.` : `${formatUnsupportedChannelActionMessage({
			channel,
			action: "disable"
		})} Use ${formatCliCommand("openclaw channels remove --channel " + channel + " --delete")} only if you want to remove config.`);
		runtime.exit(1);
		return;
	}
	let next = removal.value.nextConfig;
	if (Boolean(next.plugins?.installs && Object.keys(next.plugins.installs).length > 0)) {
		const committed = await commitConfigWithPendingPluginInstalls({
			nextConfig: next,
			...baseHash !== void 0 ? { baseHash } : {}
		});
		next = committed.config;
		await refreshPluginRegistryAfterConfigMutation({
			config: next,
			reason: "source-changed",
			installRecords: committed.installRecords,
			logger: { warn: (message) => runtime.log(message) }
		});
	} else {
		await replaceConfigFile({
			nextConfig: next,
			...baseHash !== void 0 ? { baseHash } : {}
		});
		if (resolvedPluginState?.pluginInstalled) await refreshPluginRegistryAfterConfigMutation({
			config: next,
			reason: "source-changed",
			logger: { warn: (message) => runtime.log(message) }
		});
	}
	if (useWizard && prompter) await prompter.outro(deleteConfig ? `Deleted ${channelLabel(resolvedChannelId)} account "${preparedRemoval.accountKey}".` : `Disabled ${channelLabel(resolvedChannelId)} account "${preparedRemoval.accountKey}".`);
	else runtime.log(deleteConfig ? `Deleted ${channelLabel(resolvedChannelId)} account "${preparedRemoval.accountKey}".` : `Disabled ${channelLabel(resolvedChannelId)} account "${preparedRemoval.accountKey}".`);
}
//#endregion
//#region src/commands/channels/resolve.ts
function resolvePreferredKind(kind) {
	if (!kind || kind === "auto") return;
	if (kind === "user") return "user";
	return "group";
}
function detectAutoKind(input) {
	const trimmed = input.trim();
	if (!trimmed) return "group";
	if (trimmed.startsWith("@")) return "user";
	if (/^<@!?/.test(trimmed)) return "user";
	if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "user";
	if (/^user:/i.test(trimmed)) return "user";
	return "group";
}
function detectAutoKindForPlugin(input, plugin) {
	const generic = detectAutoKind(input);
	if (generic === "user" || !plugin) return generic;
	const lowered = normalizeLowercaseStringOrEmpty(input.trim());
	const prefixes = [plugin.id, ...plugin.meta?.aliases ?? []].map((entry) => normalizeOptionalLowercaseString(entry)).filter((entry) => Boolean(entry));
	for (const prefix of prefixes) {
		if (!lowered.startsWith(`${prefix}:`)) continue;
		const remainder = lowered.slice(prefix.length + 1);
		if (remainder.startsWith("group:") || remainder.startsWith("channel:") || remainder.startsWith("room:") || remainder.startsWith("conversation:") || remainder.startsWith("spaces/") || remainder.startsWith("channels/")) return "group";
		return "user";
	}
	return generic;
}
function formatResolveResult(result) {
	if (!result.resolved || !result.id) return `${result.input} -> unresolved`;
	const name = result.name ? ` (${result.name})` : "";
	const note = result.note ? ` [${result.note}]` : "";
	return `${result.input} -> ${result.id}${name}${note}`;
}
/** Resolve user/group/channel labels into plugin-specific stable target ids. */
async function channelsResolveCommand(opts, runtime) {
	const entries = normalizeStringEntries(opts.entries);
	if (entries.length === 0) throw new Error(`At least one entry is required. Example: ${formatCliCommand("openclaw channels resolve --channel discord <name-or-id>")}.`);
	const loadedRaw = getRuntimeConfig();
	const requestedAgent = opts.agent?.trim();
	if (opts.agent !== void 0 && !requestedAgent) throw new Error("--agent must not be blank");
	const agentId = requestedAgent ? resolveConfiguredAgentId(loadedRaw, requestedAgent) : void 0;
	const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
	let { effectiveConfig: cfg } = await resolveCommandConfigWithSecrets({
		config: loadedRaw,
		commandName: "channels resolve",
		targetIds: getChannelsCommandSecretTargetIds(),
		agentId,
		mode: "read_only_operational",
		runtime,
		autoEnable: true
	});
	const explicitChannel = opts.channel?.trim();
	const resolvedExplicit = explicitChannel ? await resolveInstallableChannelPlugin({
		cfg,
		runtime,
		agentId,
		rawChannel: explicitChannel,
		allowInstall: false,
		supports: (plugin) => Boolean(plugin.resolver?.resolveTargets)
	}) : null;
	if (explicitChannel && resolvedExplicit?.catalogEntry && !resolvedExplicit.plugin) throw new Error(`Channel plugin "${resolvedExplicit.catalogEntry.id}" is not installed. Run ${formatCliCommand(`openclaw channels add --channel ${resolvedExplicit.catalogEntry.id}`)} first.`);
	if (resolvedExplicit?.configChanged) cfg = await persistResolvedChannelPluginConfig({
		resolved: resolvedExplicit,
		baseHash: (await sourceSnapshotPromise)?.hash,
		runtime
	});
	const selection = explicitChannel ? {
		channel: resolvedExplicit?.channelId,
		plugin: resolvedExplicit?.plugin
	} : await resolveMessageChannelSelection({
		cfg,
		channel: opts.channel ?? null,
		agentId
	});
	const plugin = selection.plugin;
	if (!plugin?.resolver?.resolveTargets) {
		const channelText = selection.channel ?? explicitChannel ?? "";
		throw new Error(formatUnsupportedChannelActionMessage({
			channel: channelText,
			action: "resolve"
		}));
	}
	const preferredKind = resolvePreferredKind(opts.kind);
	let results;
	if (preferredKind) results = (await plugin.resolver.resolveTargets({
		cfg,
		accountId: opts.account ?? null,
		inputs: entries,
		kind: preferredKind,
		runtime
	})).map((entry) => ({
		input: entry.input,
		resolved: entry.resolved,
		id: entry.id,
		name: entry.name,
		note: entry.note
	}));
	else {
		const byKind = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const kind = detectAutoKindForPlugin(entry, plugin);
			byKind.set(kind, [...byKind.get(kind) ?? [], entry]);
		}
		const resolved = [];
		for (const [kind, inputs] of byKind.entries()) {
			const batch = await plugin.resolver.resolveTargets({
				cfg,
				accountId: opts.account ?? null,
				inputs,
				kind,
				runtime
			});
			resolved.push(...batch);
		}
		const byInput = new Map(resolved.map((entry) => [entry.input, entry]));
		results = entries.map((input) => {
			const entry = byInput.get(input);
			return {
				input,
				resolved: entry?.resolved ?? false,
				id: entry?.id,
				name: entry?.name,
				note: entry?.note
			};
		});
	}
	if (opts.json) {
		writeRuntimeJson(runtime, results);
		return;
	}
	for (const result of results) if (result.resolved && result.id) runtime.log(formatResolveResult(result));
	else runtime.error(danger(`${result.input} -> unresolved${result.error ? ` (${result.error})` : result.note ? ` (${result.note})` : ""}`));
}
//#endregion
export { channelsAddCommand, channelsCapabilitiesCommand, channelsListCommand, channelsLogsCommand, channelsRemoveCommand, channelsResolveCommand, channelsStatusCommand };
