import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig, s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as danger } from "./globals-GZNLg1ns.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-59wfJI6V.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-BRB1TsMb.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-cxjR1aAq.js";
import { r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-Bcnfo7BA.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { i as nullChannelDirectorySelf } from "./directory-adapters-CwR372GJ.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BwV39-oy.js";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-BVpkiG83.js";
//#region src/cli/directory-cli.ts
function parseLimit(value) {
	if (value === void 0 || value === null || value === "") return null;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error("--limit must be a positive integer.");
	return parsed;
}
function buildRows(entries) {
	return entries.map((entry) => ({
		ID: entry.id,
		Name: normalizeOptionalString(entry.name) ?? ""
	}));
}
function formatDirectoryScope(channelId, accountId) {
	return `channel ${JSON.stringify(sanitizeTerminalText(channelId))}, account ${JSON.stringify(sanitizeTerminalText(accountId))}`;
}
function printDirectoryList(params) {
	if (params.entries.length === 0) {
		defaultRuntime.log(theme.muted(params.emptyMessage));
		return;
	}
	const tableWidth = getTerminalTableWidth();
	defaultRuntime.log(`${theme.heading(params.title)} ${theme.muted(`(${params.entries.length})`)}`);
	defaultRuntime.log(renderTerminalSafeTable({
		width: tableWidth,
		columns: [{
			key: "ID",
			header: "ID",
			minWidth: 16,
			flex: true
		}, {
			key: "Name",
			header: "Name",
			minWidth: 18,
			flex: true
		}],
		rows: buildRows(params.entries)
	}).trimEnd());
}
/** Register directory lookup commands and shared channel/account resolution. */
function registerDirectoryCli(program) {
	const directory = program.command("directory").description("Lookup contact and group IDs (self, peers, groups) for supported chat channels").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw directory self --channel slack", "Show the connected account identity."],
		["openclaw directory peers list --channel slack --query \"alice\"", "Search contact/user IDs by name."],
		["openclaw directory groups list --channel discord", "List available groups/channels."],
		["openclaw directory groups members --channel discord --group-id <id>", "List members for a specific group."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/directory", "docs.openclaw.ai/cli/directory")}\n`).action(() => {
		directory.help({ error: true });
	});
	const withChannel = (cmd) => cmd.option("--channel <name>", "Channel (auto when only one is configured)").option("--account <id>", "Account id (accountId)").option("--json", "Output JSON", false);
	const resolve = async (opts) => {
		const sourceSnapshotPromise = readConfigFileSnapshot().catch(() => null);
		const autoEnabled = applyPluginAutoEnable({
			config: getRuntimeConfig(),
			env: process.env
		});
		let cfg = autoEnabled.config;
		const explicitChannel = opts.channel?.trim();
		const resolvedExplicit = explicitChannel ? await resolveInstallableChannelPlugin({
			cfg,
			runtime: defaultRuntime,
			rawChannel: explicitChannel,
			allowInstall: true,
			preferRegisteredPlugin: true,
			supports: (plugin) => Boolean(plugin.directory)
		}) : null;
		if (resolvedExplicit?.configChanged) {
			cfg = resolvedExplicit.cfg;
			cfg = (await commitConfigWithPendingPluginInstalls({
				nextConfig: cfg,
				baseHash: (await sourceSnapshotPromise)?.hash
			})).config;
		} else if (autoEnabled.changes.length > 0) await replaceConfigFile({
			nextConfig: cfg,
			baseHash: (await sourceSnapshotPromise)?.hash
		});
		const selection = explicitChannel ? {
			channel: resolvedExplicit?.channelId,
			plugin: resolvedExplicit?.plugin
		} : await resolveMessageChannelSelection({
			cfg,
			channel: opts.channel ?? null
		});
		const selectedChannelId = selection.channel;
		const plugin = selection.plugin;
		if (!plugin) throw new Error(`Unsupported channel: ${String(selectedChannelId)}`);
		const channelId = selectedChannelId ?? plugin.id;
		const accountId = normalizeOptionalString(opts.account) || resolveChannelDefaultAccountId({
			plugin,
			cfg
		});
		return {
			cfg,
			channelId,
			accountId,
			plugin
		};
	};
	const runDirectoryList = async (params) => {
		const limit = parseLimit(params.opts.limit);
		const { cfg, channelId, accountId, plugin } = await resolve({
			channel: params.opts.channel,
			account: params.opts.account
		});
		const fn = params.action === "listPeers" ? plugin.directory?.listPeersLive ?? plugin.directory?.listPeers : plugin.directory?.listGroupsLive ?? plugin.directory?.listGroups;
		if (!fn) throw new Error(`Channel ${channelId} does not support directory ${params.unsupported}`);
		const result = await fn({
			cfg,
			accountId,
			query: params.opts.query ?? null,
			limit,
			runtime: defaultRuntime
		});
		if (params.opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		printDirectoryList({
			title: params.title,
			emptyMessage: `${params.emptyMessage} for ${formatDirectoryScope(channelId, accountId)}.`,
			entries: result
		});
	};
	const runDirectoryAction = async (opts, action) => {
		try {
			await action();
		} catch (err) {
			if (opts.json) throw err;
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	};
	withChannel(directory.command("self").description("Show the current account user")).action((opts) => runDirectoryAction(opts, async () => {
		const { cfg, channelId, accountId, plugin } = await resolve({
			channel: opts.channel,
			account: opts.account
		});
		const fn = plugin.directory?.self;
		if (!fn) throw new Error(`Channel ${channelId} does not support directory self`);
		const result = await fn({
			cfg,
			accountId,
			runtime: defaultRuntime
		});
		if (!result) {
			const unsupported = fn === nullChannelDirectorySelf;
			if (opts.json) defaultRuntime.writeJson({
				status: "unavailable",
				channel: channelId,
				accountId,
				reason: unsupported ? "self-identity-unsupported" : "plugin-returned-no-self-identity"
			});
			else defaultRuntime.log(theme.muted(unsupported ? `Channel ${JSON.stringify(sanitizeTerminalText(channelId))} does not expose a self identity.` : `No self identity was returned for ${formatDirectoryScope(channelId, accountId)}. Verify the account is configured and authenticated, then retry.`));
			return;
		}
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const tableWidth = getTerminalTableWidth();
		defaultRuntime.log(theme.heading("Self"));
		defaultRuntime.log(renderTerminalSafeTable({
			width: tableWidth,
			columns: [{
				key: "ID",
				header: "ID",
				minWidth: 16,
				flex: true
			}, {
				key: "Name",
				header: "Name",
				minWidth: 18,
				flex: true
			}],
			rows: buildRows([result])
		}).trimEnd());
	}));
	withChannel(directory.command("peers").description("Peer directory (contacts/users)").command("list").description("List peers")).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, async () => {
		await runDirectoryList({
			opts,
			action: "listPeers",
			unsupported: "peers",
			title: "Peers",
			emptyMessage: "No peers found"
		});
	}));
	const groups = directory.command("groups").description("Group directory");
	withChannel(groups.command("list").description("List groups")).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, async () => {
		await runDirectoryList({
			opts,
			action: "listGroups",
			unsupported: "groups",
			title: "Groups",
			emptyMessage: "No groups found"
		});
	}));
	withChannel(groups.command("members").description("List group members").requiredOption("--group-id <id>", "Group id")).option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, async () => {
		const limit = parseLimit(opts.limit);
		const { cfg, channelId, accountId, plugin } = await resolve({
			channel: opts.channel,
			account: opts.account
		});
		const fn = plugin.directory?.listGroupMembers;
		if (!fn) throw new Error(`Channel ${channelId} does not support group members listing`);
		const groupId = normalizeStringifiedOptionalString(opts.groupId) ?? "";
		if (!groupId) throw new Error("Missing --group-id");
		const result = await fn({
			cfg,
			accountId,
			groupId,
			limit,
			runtime: defaultRuntime
		});
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		printDirectoryList({
			title: "Group Members",
			emptyMessage: `No group members found for group ${JSON.stringify(sanitizeTerminalText(groupId))}, ${formatDirectoryScope(channelId, accountId)}.`,
			entries: result
		});
	}));
}
//#endregion
export { registerDirectoryCli };
