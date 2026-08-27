import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { t as normalizeWindowsArgv } from "./windows-argv-Dl7Refj1.js";
import { l as readConfigFileSnapshot, r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { r as theme } from "./theme-vjDs9tao.js";
import "./config-Dl8DJbzM.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as hasExplicitOptions } from "./command-options-Bv6UxUlT.js";
import { t as danger } from "./globals-CAwGc4B6.js";
import { l as formatUnsupportedChannelActionMessage } from "./error-format-BAHQH0iA.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { s as callGateway } from "./call-D4XcT41c.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CuLWfZ5w.js";
import { a as normalizeChannelId, i as listChannelPlugins } from "./registry-B3yYjPW1.js";
import "./plugins-cwOWOggC.js";
import "./message-channel-T4W5YOto.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-C-WC19Mc.js";
import { n as runCommandWithRuntime } from "./cli-utils-NPN0egNa.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-DQjHzbZN.js";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution--sS0e9si.js";
import { t as formatCliChannelOptions } from "./channel-options-dp4EyufK.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { Option } from "commander";
//#region src/cli/channel-auth.ts
function supportsChannelAuthMode(plugin, mode) {
	return mode === "login" ? Boolean(plugin.auth?.login) : Boolean(plugin.gateway?.logoutAccount);
}
function isConfiguredAuthPlugin(plugin, cfg) {
	const key = plugin.id;
	if (isBlockedObjectKey(key)) return false;
	const channelCfg = cfg.channels?.[key];
	if (channelCfg && typeof channelCfg === "object" && "enabled" in channelCfg && channelCfg.enabled === false) return false;
	for (const accountId of plugin.config.listAccountIds(cfg)) try {
		const account = plugin.config.resolveAccount(cfg, accountId);
		if (plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : account && typeof account === "object" ? account.enabled ?? true : true) return true;
	} catch {
		continue;
	}
	return false;
}
function resolveConfiguredAuthChannelInput(cfg, mode) {
	const configured = listChannelPlugins().filter((plugin) => supportsChannelAuthMode(plugin, mode)).filter((plugin) => isConfiguredAuthPlugin(plugin, cfg)).map((plugin) => plugin.id);
	if (configured.length === 1) return expectDefined(configured[0], "configured entry at 0");
	if (configured.length === 0) throw new Error(`No configured channel supports ${mode}. Run ${formatCliCommand("openclaw channels status")} to inspect channels or ${formatCliCommand("openclaw channels add --channel <channel>")} to add one.`);
	const safeIds = configured.map(sanitizeForLog);
	throw new Error(`Multiple configured channels support ${mode}: ${safeIds.join(", ")}. Choose one with --channel <channel>.`);
}
async function resolveChannelPluginForMode(opts, mode, cfg, runtime) {
	const channelInput = opts.channel?.trim() || resolveConfiguredAuthChannelInput(cfg, mode);
	const normalizedChannelId = normalizeChannelId(channelInput);
	const resolved = await resolveInstallableChannelPlugin({
		cfg,
		runtime,
		rawChannel: channelInput,
		...normalizedChannelId ? { channelId: normalizedChannelId } : {},
		allowInstall: true,
		supports: (candidate) => supportsChannelAuthMode(candidate, mode)
	});
	const channelId = resolved.channelId ?? normalizedChannelId;
	if (!channelId) throw new Error(`Unsupported channel "${channelInput}". Run ${formatCliCommand("openclaw channels list")} to see available channels.`);
	const plugin = resolved.plugin;
	if (!plugin || !supportsChannelAuthMode(plugin, mode)) throw new Error(formatUnsupportedChannelActionMessage({
		channel: channelId,
		action: mode,
		inspectCommand: "openclaw channels status --channel " + channelId
	}));
	return {
		cfg: resolved.cfg,
		configChanged: resolved.configChanged,
		channelInput,
		channelId,
		plugin
	};
}
function resolveAccountContext(plugin, opts, cfg) {
	return { accountId: normalizeOptionalString(opts.account) || resolveChannelDefaultAccountId({
		plugin,
		cfg
	}) };
}
function isChannelMissingFromGatewayRegistry(error) {
	const requestError = error;
	return requestError instanceof Error && requestError.name === "GatewayClientRequestError" && requestError.gatewayCode === "INVALID_REQUEST" && requestError.message === "invalid channels.start channel";
}
async function reconcileGatewayRuntimeAfterLocalLogin(params) {
	if (!params.plugin.gateway?.startAccount) return;
	if (params.cfg.gateway?.mode === "remote") {
		params.runtime.log(`Gateway is in remote mode; local login saved auth for ${params.channelId}/${params.accountId} but did not start the remote runtime.`);
		return;
	}
	try {
		await callGateway({
			config: params.cfg,
			method: "channels.start",
			params: {
				channel: params.channelId,
				accountId: params.accountId
			},
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			deviceIdentity: null
		});
	} catch (error) {
		if (isChannelMissingFromGatewayRegistry(error)) try {
			await callGateway({
				config: params.cfg,
				method: "gateway.restart.request",
				params: { reason: `channel login: load ${params.channelId}` },
				mode: GATEWAY_CLIENT_MODES.BACKEND,
				clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
				deviceIdentity: null
			});
			params.runtime.log(`Gateway restart requested to load ${params.channelId}; the channel will start after restart.`);
			return;
		} catch {}
		params.runtime.log(`Local login saved auth for ${params.channelId}/${params.accountId}, but the running gateway did not restart it: ${formatErrorMessage(error)}`);
	}
}
async function logoutViaGatewayRuntime(params) {
	try {
		await callGateway({
			config: params.cfg,
			method: "channels.logout",
			params: {
				channel: params.channelId,
				accountId: params.accountId
			},
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			deviceIdentity: null
		});
		return true;
	} catch (error) {
		if (params.cfg.gateway?.mode === "remote") throw error;
		params.runtime.log(`Local logout will clear auth for ${params.channelId}/${params.accountId}, but the running gateway did not stop it: ${formatErrorMessage(error)}`);
		return false;
	}
}
async function runChannelLogin(opts, runtime = defaultRuntime) {
	const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
	const autoEnabled = applyPluginAutoEnable({
		config: getRuntimeConfig(),
		env: process.env
	});
	const loadedCfg = autoEnabled.config;
	const resolvedChannel = await resolveChannelPluginForMode(opts, "login", loadedCfg, runtime);
	let cfg = resolvedChannel.cfg;
	const { configChanged, channelInput, plugin } = resolvedChannel;
	if (autoEnabled.changes.length > 0 || configChanged) cfg = (await commitConfigWithPendingPluginInstalls({
		nextConfig: cfg,
		baseHash: (await sourceSnapshotPromise)?.hash
	})).config;
	const login = plugin.auth?.login;
	if (!login) throw new Error(formatUnsupportedChannelActionMessage({
		channel: channelInput,
		action: "login",
		inspectCommand: "openclaw channels status --channel " + channelInput
	}));
	setVerbose(Boolean(opts.verbose));
	const { accountId } = resolveAccountContext(plugin, opts, cfg);
	await login({
		cfg,
		accountId,
		runtime,
		verbose: Boolean(opts.verbose),
		channelInput
	});
	await reconcileGatewayRuntimeAfterLocalLogin({
		cfg,
		plugin,
		channelId: plugin.id,
		accountId,
		runtime
	});
}
async function runChannelLogout(opts, runtime = defaultRuntime) {
	const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
	const autoEnabled = applyPluginAutoEnable({
		config: getRuntimeConfig(),
		env: process.env
	});
	const loadedCfg = autoEnabled.config;
	const resolvedChannel = await resolveChannelPluginForMode(opts, "logout", loadedCfg, runtime);
	let cfg = resolvedChannel.cfg;
	const { configChanged, channelInput, plugin } = resolvedChannel;
	if (autoEnabled.changes.length > 0 || configChanged) cfg = (await commitConfigWithPendingPluginInstalls({
		nextConfig: cfg,
		baseHash: (await sourceSnapshotPromise)?.hash
	})).config;
	const logoutAccount = plugin.gateway?.logoutAccount;
	if (!logoutAccount) throw new Error(formatUnsupportedChannelActionMessage({
		channel: channelInput,
		action: "logout",
		inspectCommand: "openclaw channels status --channel " + channelInput
	}));
	const { accountId } = resolveAccountContext(plugin, opts, cfg);
	if (await logoutViaGatewayRuntime({
		cfg,
		channelId: plugin.id,
		accountId,
		runtime
	})) return;
	const account = plugin.config.resolveAccount(cfg, accountId);
	await logoutAccount({
		cfg,
		accountId,
		account,
		runtime
	});
}
//#endregion
//#region src/cli/channels-cli-add-args.ts
const CHANNEL_ADD_SHARED_BOOLEAN_OPTIONS = /* @__PURE__ */ new Set(["--help", "-h"]);
const CHANNEL_ADD_SHARED_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	"--channel",
	"--account",
	"--name"
]);
const CHANNEL_ADD_SHARED_VALUE_OPTION_PREFIXES = [
	"--channel=",
	"--account=",
	"--name="
];
const channelSetupCliOptionsLoader = createLazyImportLoader(() => import("./cli-add-options-TWWWmgGv.js"));
function loadChannelSetupCliOptions() {
	return channelSetupCliOptionsLoader.load();
}
function getChannelSetupOptionSwitches(flags) {
	const option = new Option(flags);
	return [option.short, option.long].filter((flag) => Boolean(flag));
}
function resolveChannelSetupFlagArity(flags) {
	return /<[^>]+>|\[[^\]]+\]/u.test(flags) ? "value" : "boolean";
}
function buildChannelSetupFlagArityMap(options) {
	const arityBySwitch = /* @__PURE__ */ new Map();
	const addSwitch = (flag, arity) => {
		const existing = arityBySwitch.get(flag);
		arityBySwitch.set(flag, existing === void 0 || existing === arity ? arity : "conflict");
	};
	for (const option of options) {
		const arity = resolveChannelSetupFlagArity(option.flags);
		for (const flag of getChannelSetupOptionSwitches(option.flags)) addSwitch(flag, arity);
		if (option.negatedFlags) for (const flag of getChannelSetupOptionSwitches(option.negatedFlags)) addSwitch(flag, "boolean");
	}
	return arityBySwitch;
}
async function resolveChannelsAddChannelFromArgv(argv) {
	const normalizedArgv = normalizeWindowsArgv(argv);
	const addIndex = normalizedArgv.findIndex((arg, index) => arg === "add" && normalizedArgv[index - 1] === "channels");
	if (addIndex === -1) return;
	const args = normalizedArgv.slice(addIndex + 1);
	let explicitChannel;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		if (arg === "--channel") {
			explicitChannel = args[index + 1]?.trim() || explicitChannel;
			index += 1;
			continue;
		}
		if (arg.startsWith("--channel=")) explicitChannel = arg.slice(10).trim() || explicitChannel;
	}
	if (explicitChannel) return explicitChannel;
	let channelFlagArities;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		if (CHANNEL_ADD_SHARED_VALUE_OPTIONS.has(arg)) {
			index += 1;
			continue;
		}
		if (CHANNEL_ADD_SHARED_VALUE_OPTION_PREFIXES.some((prefix) => arg.startsWith(prefix))) continue;
		if (CHANNEL_ADD_SHARED_BOOLEAN_OPTIONS.has(arg)) continue;
		if (arg.startsWith("-")) {
			if (!channelFlagArities) {
				const { resolveChannelSetupCliOptionMetadata } = await loadChannelSetupCliOptions();
				const { optionCandidates } = resolveChannelSetupCliOptionMetadata(void 0, { includeAll: true });
				channelFlagArities = buildChannelSetupFlagArityMap(optionCandidates);
			}
			const equalsIndex = arg.indexOf("=");
			const optionSwitch = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
			const arity = channelFlagArities.get(optionSwitch);
			if (!arity || arity === "conflict") return;
			if (equalsIndex === -1 && arity === "value") index += 1;
			continue;
		}
		return arg;
	}
}
function resolveChannelsAddOptions(channelArg, opts, command) {
	const forwardedOpts = command ? Object.fromEntries(Object.entries(opts).filter(([key]) => command.getOptionValueSource(key) === "cli")) : opts;
	return {
		...forwardedOpts,
		channel: forwardedOpts.channel ?? channelArg
	};
}
//#endregion
//#region src/cli/channels-cli.ts
const optionNamesRemove = [
	"channel",
	"account",
	"delete"
];
const CHANNEL_ADD_SELECTION_OPTION_NAMES = /* @__PURE__ */ new Set(["channel"]);
const LEGACY_CHANNEL_SETUP_OPTIONS = [
	{
		flags: "--token <token>",
		description: "Channel token or credential payload"
	},
	{
		flags: "--token-file <path>",
		description: "Read channel token or credential payload from file"
	},
	{
		flags: "--secret <secret>",
		description: "Channel shared secret"
	},
	{
		flags: "--bot-token <token>",
		description: "Bot token"
	},
	{
		flags: "--app-token <token>",
		description: "App token"
	},
	{
		flags: "--password <password>",
		description: "Channel password or login secret"
	},
	{
		flags: "--cli-path <path>",
		description: "Channel CLI path"
	},
	{
		flags: "--url <url>",
		description: "Channel setup URL"
	},
	{
		flags: "--base-url <url>",
		description: "Channel base URL"
	},
	{
		flags: "--http-url <url>",
		description: "Channel HTTP service URL"
	},
	{
		flags: "--auth-dir <path>",
		description: "Channel auth directory override"
	},
	{
		flags: "--use-env",
		description: "Use env-backed credentials when supported",
		defaultValue: false
	}
];
const channelsCommandsLoader = createLazyImportLoader(() => import("./channels-nGFr8m76.js"));
function loadChannelsCommands() {
	return channelsCommandsLoader.load();
}
function runChannelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function runChannelsCommandWithDanger(action, label) {
	return runCommandWithRuntime(defaultRuntime, action, (err) => {
		defaultRuntime.error(danger(`${label}: ${String(err)}`));
		defaultRuntime.exit(1);
	});
}
function getOptionNames(command) {
	return command.options.map((option) => option.attributeName());
}
function addChannelSetupOption(command, option, seenFlags) {
	const optionSwitches = getChannelSetupOptionSwitches(option.flags);
	if (optionSwitches.some((flag) => seenFlags.has(flag))) return;
	optionSwitches.forEach((flag) => seenFlags.add(flag));
	if (option.defaultValue !== void 0) command.option(option.flags, option.description, option.defaultValue);
	else command.option(option.flags, option.description);
	if (option.negatedFlags) {
		const negatedSwitches = getChannelSetupOptionSwitches(option.negatedFlags);
		if (!negatedSwitches.some((flag) => seenFlags.has(flag))) {
			negatedSwitches.forEach((flag) => seenFlags.add(flag));
			command.option(option.negatedFlags, option.description);
		}
	}
}
function shouldRegisterChannelSetupOptions(argv = process.argv, options = {}) {
	if (options.includeSetupOptions) return true;
	const { commandPath } = resolveCliArgvInvocation(normalizeWindowsArgv(argv));
	return commandPath[0] === "channels" && commandPath[1] === "add";
}
async function addChannelSetupOptions(command, params = {}) {
	const { resolveChannelSetupCliOptionMetadata } = await loadChannelSetupCliOptions();
	const selected = params.channelId?.trim().toLowerCase();
	const { options, selectedChannel } = resolveChannelSetupCliOptionMetadata(selected, { includeAll: params.includeAll });
	const mode = selected ? selectedChannel?.setup ? "modern" : "legacy" : "none";
	const seenFlags = new Set(command.options.flatMap((option) => getChannelSetupOptionSwitches(option.flags)));
	for (const option of options) addChannelSetupOption(command, option, seenFlags);
	if (params.includeAll || mode === "legacy" && (selectedChannel === void 0 || selectedChannel.setup === void 0)) for (const option of LEGACY_CHANNEL_SETUP_OPTIONS) addChannelSetupOption(command, option, seenFlags);
	return mode;
}
async function registerChannelsCli(program, argv = process.argv, options = {}) {
	const channelNames = formatCliChannelOptions();
	const channels = program.command("channels").description("Manage connected chat channels and accounts").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw channels list", "List configured channels."],
		["openclaw channels list --all", "Show configured, bundled, and installable channels."],
		["openclaw channels add", "Open guided channel setup."],
		["openclaw channels status --probe", "Run channel status checks and probes."],
		["openclaw channels add --channel telegram --token <token>", "Add or update a channel account non-interactively."],
		["openclaw channels login --channel whatsapp", "Link a WhatsApp Web account."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/channels", "docs.openclaw.ai/cli/channels")}\n`);
	channels.command("list").description("List chat channels (configured by default; pass --all for installable catalog)").option("--all", "Include bundled and installable catalog channels", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsListCommand } = await import("./list-CAu3dDqK.js");
			await channelsListCommand(opts, defaultRuntime);
		});
	});
	channels.command("status").description("Show gateway channel status (use status --deep for local)").option("--channel <name>", `Only show one channel (${formatCliChannelOptions(["all"])})`).option("--probe", "Probe channel credentials", false).option("--timeout <ms>", "Timeout in ms", "10000").option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsStatusCommand } = await import("./status-BO340Rvj.js");
			await channelsStatusCommand(opts, defaultRuntime);
		});
	});
	channels.command("capabilities").description("Show provider capabilities (intents/scopes + supported features)").option("--channel <name>", `Channel (${formatCliChannelOptions(["all"])})`).option("--account <id>", "Account id (only with --channel)").option("--target <dest>", "Channel target for permission audit (Discord channel:<id>)").option("--timeout <ms>", "Timeout in ms", "10000").option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsCapabilitiesCommand } = await loadChannelsCommands();
			await channelsCapabilitiesCommand(opts, defaultRuntime);
		});
	});
	channels.command("resolve").description("Resolve channel/user names to IDs").argument("<entries...>", "Entries to resolve (names or ids)").option("--channel <name>", `Channel (${channelNames})`).option("--account <id>", "Account id (accountId)").addOption(new Option("--kind <kind>", "Target kind (auto|user|group|channel)").choices([
		"auto",
		"user",
		"group",
		"channel"
	]).default("auto")).option("--json", "Output JSON", false).action(async (entries, opts) => {
		await runChannelsCommand(async () => {
			const { channelsResolveCommand } = await loadChannelsCommands();
			await channelsResolveCommand({
				channel: opts.channel,
				account: opts.account,
				kind: opts.kind,
				json: Boolean(opts.json),
				entries: Array.isArray(entries) ? entries : [String(entries)]
			}, defaultRuntime);
		});
	});
	channels.command("logs").description("Show recent channel logs from the gateway log file").option("--channel <name>", `Channel (${formatCliChannelOptions(["all"])})`, "all").option("--lines <n>", "Number of lines (default: 200)", "200").option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsLogsCommand } = await loadChannelsCommands();
			await channelsLogsCommand(opts, defaultRuntime);
		});
	});
	const deadLetters = channels.command("dead-letters").description("Inspect and resubmit failed inbound channel events");
	deadLetters.command("list").description("List failed inbound events for one channel account").requiredOption("--channel <name>", "Channel id").option("--account <id>", "Account id", "default").option("--limit <n>", "Maximum entries", "100").option("--json", "Output JSON", false).action(async (opts) => {
		await runChannelsCommand(async () => {
			const { channelsDeadLettersListCommand } = await import("./dead-letters-BfXhW8wX.js");
			await channelsDeadLettersListCommand(opts, defaultRuntime);
		});
	});
	deadLetters.command("resubmit").description("Re-enqueue one failed inbound event").argument("<event-id>", "Ingress event id").requiredOption("--channel <name>", "Channel id").option("--account <id>", "Account id", "default").option("--json", "Output JSON", false).action(async (eventId, opts) => {
		await runChannelsCommand(async () => {
			const { channelsDeadLettersResubmitCommand } = await import("./dead-letters-BfXhW8wX.js");
			await channelsDeadLettersResubmitCommand(eventId, opts, defaultRuntime);
		});
	});
	applyParentDefaultHelpAction(deadLetters);
	const addCommand = channels.command("add").description("Add or update a channel account").argument("[channel]", "Channel id").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw channels add", "Open guided setup for available chat channels."],
		["openclaw channels add --channel telegram --token <token>", "Add or update Telegram non-interactively."],
		["openclaw channels list --all", "Find channel ids before using --channel."]
	])}\n`).option("--channel <name>", `Channel (${channelNames})`).option("--account <id>", "Account id (default when omitted)").option("--name <name>", "Display name for this account");
	let channelSetupOptionMode = "none";
	const selectedChannelId = await resolveChannelsAddChannelFromArgv(argv);
	if (shouldRegisterChannelSetupOptions(argv, options) && (selectedChannelId !== void 0 || options.includeSetupOptions)) channelSetupOptionMode = await addChannelSetupOptions(addCommand, {
		channelId: selectedChannelId,
		includeAll: options.includeSetupOptions
	});
	addCommand.action(async (channelArg, opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsAddCommand } = await loadChannelsCommands();
			const hasFlags = hasExplicitOptions(command, getOptionNames(command).filter((name) => !CHANNEL_ADD_SELECTION_OPTION_NAMES.has(name)));
			await channelsAddCommand(resolveChannelsAddOptions(channelArg, opts, channelSetupOptionMode === "modern" ? command : void 0), defaultRuntime, { hasFlags });
		});
	});
	channels.command("remove").description("Disable or delete a channel account").option("--channel <name>", `Channel (${channelNames})`).option("--account <id>", "Account id (default when omitted)").option("--delete", "Delete config entries (no prompt)", false).action(async (opts, command) => {
		await runChannelsCommand(async () => {
			const { channelsRemoveCommand } = await loadChannelsCommands();
			await channelsRemoveCommand(opts, defaultRuntime, { hasFlags: hasExplicitOptions(command, optionNamesRemove) });
		});
	});
	channels.command("login").description("Link a channel account (if supported)").option("--channel <channel>", "Channel alias (auto when only one is configured)").option("--account <id>", "Account id (accountId)").option("--verbose", "Verbose connection logs", false).action(async (opts) => {
		await runChannelsCommandWithDanger(async () => {
			await runChannelLogin({
				channel: opts.channel,
				account: opts.account,
				verbose: Boolean(opts.verbose)
			}, defaultRuntime);
		}, "Channel login failed");
	});
	channels.command("logout").description("Log out of a channel session (if supported)").option("--channel <channel>", "Channel alias (auto when only one is configured)").option("--account <id>", "Account id (accountId)").action(async (opts) => {
		await runChannelsCommandWithDanger(async () => {
			await runChannelLogout({
				channel: opts.channel,
				account: opts.account
			}, defaultRuntime);
		}, "Channel logout failed");
	});
	applyParentDefaultHelpAction(channels);
}
//#endregion
export { registerChannelsCli };
