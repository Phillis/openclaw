import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure, s as rethrowExpectedCliError, t as ExpectedCliError } from "./failure-output-CdUzE2dC.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { t as requestExitAfterOneShotOutput } from "./one-shot-exit-CvLNCpcm.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig, s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { n as loadGatewayStartupPluginPlanWithMetadata } from "./gateway-startup-plugin-ids-Dtzhwc1j.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { i as canFallbackToImplicitLocalGateway } from "./gateway-rpc-4LDXqcsd.js";
import "./channel-plugin-ids-BdzaxZ-5.js";
import { t as summarizeStringEntries } from "./string-sample-BYGbtG9S.js";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji-D9x7wue_.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-Bcnfo7BA.js";
import { t as resolveOptionFromCommand } from "./cli-utils-DKdcuZ9M.js";
import { o as resolveHookEntries } from "./config-lcKXe5Oi.js";
import { a as buildPluginDiagnosticsReport } from "./status-DoE4_lNj.js";
import { t as runPluginInstallCommand } from "./plugins-install-command-Dpbs7BNy.js";
import { t as loadWorkspaceHookEntries } from "./workspace-Cc9UBSPp.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-lrMZaDtO.js";
import { t as runNativeHookRelayCli } from "./native-hook-relay-cli-aWmGXhDZ.js";
import { t as runPluginUpdateCommand } from "./plugins-update-command-D6JOwjM4.js";
//#region src/cli/hooks-cli.format.ts
function formatHookStatus(hook) {
	if (hook.loadable) return theme.success("✓ ready");
	if (!hook.enabledByConfig) return theme.warn(decorativePrefix("⏸", "disabled"));
	return theme.error(`✗ ${formatHookBlockedStatusReason(hook)}`);
}
function formatHookBlockedStatusReason(hook) {
	return hook.blockedReason && hook.blockedReason !== "missing requirements" ? hook.blockedReason : "missing";
}
function formatHookInfoBlockedStatusReason(hook) {
	const reason = hook.blockedReason && hook.blockedReason !== "missing requirements" ? hook.blockedReason : "missing requirements";
	return reason ? `${reason[0]?.toUpperCase() ?? ""}${reason.slice(1)}` : reason;
}
function formatHookName(hook) {
	const emoji = hook.emoji ?? decorativeEmoji("🔗");
	const name = theme.command(hook.name);
	return emoji ? `${emoji} ${name}` : name;
}
function formatHookSource(hook) {
	if (!hook.managedByPlugin) return hook.source;
	return `plugin:${hook.pluginId ?? "unknown"}`;
}
function formatHookMissingSummary(hook, itemLimit) {
	const formatEntries = (entries) => itemLimit === void 0 ? entries.join(", ") : summarizeStringEntries({
		entries,
		limit: itemLimit
	});
	const missing = [];
	if (hook.enabledByConfig && hook.blockedReason && hook.blockedReason !== "missing requirements") missing.push(hook.blockedReason);
	if (hook.missing.bins.length > 0) missing.push(`bins: ${formatEntries(hook.missing.bins)}`);
	if (hook.missing.anyBins.length > 0) missing.push(`anyBins: ${formatEntries(hook.missing.anyBins)}`);
	if (hook.missing.env.length > 0) missing.push(`env: ${formatEntries(hook.missing.env)}`);
	if (hook.missing.config.length > 0) missing.push(`config: ${formatEntries(hook.missing.config)}`);
	if (hook.missing.os.length > 0) missing.push(`os: ${formatEntries(hook.missing.os)}`);
	return missing.join("; ");
}
/**
* Format the hooks list output
*/
function formatHooksList(report, opts) {
	const hooks = opts.eligible ? report.hooks.filter((h) => h.loadable) : report.hooks;
	if (opts.json) {
		const jsonReport = {
			workspaceDir: report.workspaceDir,
			managedHooksDir: report.managedHooksDir,
			hooks: hooks.map((h) => ({
				name: h.name,
				description: h.description,
				emoji: h.emoji,
				eligible: h.loadable,
				disabled: !h.enabledByConfig,
				enabledByConfig: h.enabledByConfig,
				requirementsSatisfied: h.requirementsSatisfied,
				loadable: h.loadable,
				blockedReason: h.blockedReason,
				source: h.source,
				pluginId: h.pluginId,
				events: h.events,
				unknownEvents: h.unknownEvents,
				homepage: h.homepage,
				missing: h.missing,
				managedByPlugin: h.managedByPlugin
			}))
		};
		return JSON.stringify(jsonReport, null, 2);
	}
	if (hooks.length === 0) return opts.eligible ? `No eligible hooks found. Run \`${formatCliCommand("openclaw hooks list")}\` to see all hooks.` : "No hooks found.";
	const eligible = hooks.filter((h) => h.loadable);
	const tableWidth = getTerminalTableWidth();
	const rows = hooks.map((hook) => {
		const missing = formatHookMissingSummary(hook);
		return {
			Status: formatHookStatus(hook),
			Hook: formatHookName(hook),
			Description: theme.muted(hook.description),
			Source: formatHookSource(hook),
			Missing: missing ? theme.warn(missing) : ""
		};
	});
	const columns = [
		{
			key: "Status",
			header: "Status",
			minWidth: 10
		},
		{
			key: "Hook",
			header: "Hook",
			minWidth: 18,
			flex: true
		},
		{
			key: "Description",
			header: "Description",
			minWidth: 24,
			flex: true
		},
		{
			key: "Source",
			header: "Source",
			minWidth: 12,
			flex: true
		}
	];
	if (opts.verbose) columns.push({
		key: "Missing",
		header: "Missing",
		minWidth: 18,
		flex: true
	});
	const lines = [];
	lines.push(`${theme.heading("Hooks")} ${theme.muted(`(${eligible.length}/${hooks.length} ready)`)}`);
	lines.push(renderTable({
		width: tableWidth,
		columns,
		rows
	}).trimEnd());
	return lines.join("\n");
}
/**
* Format detailed info for a single hook
*/
function formatHookInfo(hook, hookName, opts) {
	if (!hook) {
		if (opts.json) {
			const failure = formatCliJsonFailure(`Hook "${hookName}" not found.`);
			return JSON.stringify({
				...failure,
				hook: hookName
			}, null, 2);
		}
		return `Hook "${hookName}" not found. Run \`${formatCliCommand("openclaw hooks list")}\` to see available hooks.`;
	}
	if (opts.json) return JSON.stringify({
		...hook,
		eligible: hook.loadable,
		disabled: !hook.enabledByConfig
	}, null, 2);
	const lines = [];
	const emoji = hook.emoji ?? decorativeEmoji("🔗");
	const status = hook.loadable ? theme.success("✓ Ready") : !hook.enabledByConfig ? theme.warn(decorativePrefix("⏸", "Disabled")) : theme.error(`✗ ${formatHookInfoBlockedStatusReason(hook)}`);
	lines.push(`${emoji ? `${emoji} ` : ""}${theme.heading(hook.name)} ${status}`);
	lines.push("");
	lines.push(hook.description);
	lines.push("");
	lines.push(theme.heading("Details:"));
	if (hook.managedByPlugin) lines.push(`${theme.muted("  Source:")} ${hook.source} (${hook.pluginId ?? "unknown"})`);
	else lines.push(`${theme.muted("  Source:")} ${hook.source}`);
	lines.push(`${theme.muted("  Path:")} ${shortenHomePath(hook.filePath)}`);
	lines.push(`${theme.muted("  Handler:")} ${shortenHomePath(hook.handlerPath)}`);
	if (hook.homepage) lines.push(`${theme.muted("  Homepage:")} ${hook.homepage}`);
	if (hook.events.length > 0) lines.push(`${theme.muted("  Events:")} ${hook.events.join(", ")}`);
	if (hook.unknownEvents.length > 0) lines.push(theme.warn(`  ⚠ Event${hook.unknownEvents.length === 1 ? "" : "s"} not emitted by core (likely typo): ${hook.unknownEvents.join(", ")}`));
	if (hook.managedByPlugin) lines.push(theme.muted("  Managed by plugin; enable/disable via hooks CLI not available."));
	if (hook.blockedReason) lines.push(`${theme.muted("  Blocked reason:")} ${hook.blockedReason}`);
	if (hook.requirements.bins.length > 0 || hook.requirements.anyBins.length > 0 || hook.requirements.env.length > 0 || hook.requirements.config.length > 0 || hook.requirements.os.length > 0) {
		lines.push("");
		lines.push(theme.heading("Requirements:"));
		if (hook.requirements.bins.length > 0) {
			const binsStatus = hook.requirements.bins.map((bin) => {
				return hook.missing.bins.includes(bin) ? theme.error(`✗ ${bin}`) : theme.success(`✓ ${bin}`);
			});
			lines.push(`${theme.muted("  Binaries:")} ${binsStatus.join(", ")}`);
		}
		if (hook.requirements.anyBins.length > 0) {
			const anyBinsStatus = hook.missing.anyBins.length > 0 ? theme.error(`✗ (any of: ${hook.requirements.anyBins.join(", ")})`) : theme.success(`✓ (any of: ${hook.requirements.anyBins.join(", ")})`);
			lines.push(`${theme.muted("  Any binary:")} ${anyBinsStatus}`);
		}
		if (hook.requirements.env.length > 0) {
			const envStatus = hook.requirements.env.map((env) => {
				return hook.missing.env.includes(env) ? theme.error(`✗ ${env}`) : theme.success(`✓ ${env}`);
			});
			lines.push(`${theme.muted("  Environment:")} ${envStatus.join(", ")}`);
		}
		if (hook.requirements.config.length > 0) {
			const configStatus = hook.configChecks.map((check) => {
				return check.satisfied ? theme.success(`✓ ${check.path}`) : theme.error(`✗ ${check.path}`);
			});
			lines.push(`${theme.muted("  Config:")} ${configStatus.join(", ")}`);
		}
		if (hook.requirements.os.length > 0) {
			const osStatus = hook.missing.os.length > 0 ? theme.error(`✗ (${hook.requirements.os.join(", ")})`) : theme.success(`✓ (${hook.requirements.os.join(", ")})`);
			lines.push(`${theme.muted("  OS:")} ${osStatus}`);
		}
	}
	return lines.join("\n");
}
/**
* Format check output
*/
function formatHooksCheck(report, opts) {
	if (opts.json) {
		const eligible = report.hooks.filter((h) => h.loadable);
		const notEligible = report.hooks.filter((h) => !h.loadable);
		return JSON.stringify({
			total: report.hooks.length,
			eligible: eligible.length,
			notEligible: notEligible.length,
			hooks: {
				eligible: eligible.map((h) => h.name),
				notEligible: notEligible.map((h) => ({
					name: h.name,
					blockedReason: h.blockedReason,
					missing: h.missing
				}))
			}
		}, null, 2);
	}
	const eligible = report.hooks.filter((h) => h.loadable);
	const notEligible = report.hooks.filter((h) => !h.loadable);
	const lines = [];
	lines.push(theme.heading("Hooks Status"));
	lines.push("");
	lines.push(`${theme.muted("Total hooks:")} ${report.hooks.length}`);
	lines.push(`${theme.success("Ready:")} ${eligible.length}`);
	lines.push(`${theme.warn("Not ready:")} ${notEligible.length}`);
	if (notEligible.length > 0) {
		lines.push("");
		lines.push(theme.heading("Hooks not ready:"));
		for (const hook of notEligible) {
			const reasons = [];
			if (hook.blockedReason && hook.blockedReason !== "missing requirements") reasons.push(hook.blockedReason);
			if (hook.missing.bins.length > 0) reasons.push(`bins: ${hook.missing.bins.join(", ")}`);
			if (hook.missing.anyBins.length > 0) reasons.push(`anyBins: ${hook.missing.anyBins.join(", ")}`);
			if (hook.missing.env.length > 0) reasons.push(`env: ${hook.missing.env.join(", ")}`);
			if (hook.missing.config.length > 0) reasons.push(`config: ${hook.missing.config.join(", ")}`);
			if (hook.missing.os.length > 0) reasons.push(`os: ${hook.missing.os.join(", ")}`);
			const emoji = hook.emoji ?? decorativeEmoji("🔗");
			lines.push(`  ${emoji ? `${emoji} ` : ""}${hook.name} - ${reasons.join("; ")}`);
		}
	}
	return lines.join("\n");
}
//#endregion
//#region src/cli/hooks-cli.ts
const GATEWAY_HOOKS_STATUS_TIMEOUT_MS = 1500;
function resolveHooksReportTarget(config, rawAgentId) {
	const requested = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const requestedAgentId = requested ? normalizeAgentId(requested) : void 0;
	if (requestedAgentId) resolveConfiguredAgentId(config, requestedAgentId);
	const agentId = requestedAgentId ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveDefaultAgentId(config, {
		surface: "hooks status reporting",
		hint: "Pass --agent <id> to select a configured agent."
	});
	return {
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
function buildHooksReport(config, target) {
	const workspaceDir = target.workspaceDir;
	const workspaceEntries = loadWorkspaceHookEntries(workspaceDir, { config });
	const startup = loadGatewayStartupPluginPlanWithMetadata({
		config,
		workspaceDir,
		env: process.env
	});
	return buildWorkspaceHookStatus(workspaceDir, {
		config,
		entries: resolveHookEntries([...buildPluginDiagnosticsReport({
			config,
			workspaceDir,
			onlyPluginIds: startup.plan.pluginIds,
			metadataSnapshot: startup.metadataSnapshot
		}).hooks.map((hook) => hook.entry), ...workspaceEntries])
	});
}
async function loadHooksReport(agentId) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const target = resolveHooksReportTarget(config, agentId);
	const { callGateway } = await import("./call-Dplee5Oc.js");
	try {
		return await callGateway({
			config,
			method: "hooks.status",
			params: { agentId: target.agentId },
			timeoutMs: GATEWAY_HOOKS_STATUS_TIMEOUT_MS,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			mode: GATEWAY_CLIENT_MODES.CLI
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config,
			error,
			legacyMethod: "hooks.status",
			legacyAgentId: true
		})) throw error;
		return buildHooksReport(config, target);
	}
}
function resolveHooksAgentOption(command) {
	return resolveOptionFromCommand(command, "agent");
}
function resolveHookSelection(report, hookName) {
	const nameMatches = report.hooks.filter((hook) => hook.name === hookName);
	const matches = nameMatches.length > 0 ? nameMatches : report.hooks.filter((hook) => hook.hookKey === hookName);
	if (matches.length > 1) {
		const candidates = summarizeStringEntries({
			entries: matches.map((hook) => `${hook.name} (${hook.hookKey})`),
			limit: 5
		});
		throw new Error(`Hook "${hookName}" is ambiguous; matches: ${candidates}. Use a unique hook name or hook key.`);
	}
	return matches[0];
}
function writeHooksOutput(value, json) {
	if (json) {
		defaultRuntime.writeStdout(value);
		return;
	}
	defaultRuntime.log(value);
}
async function runOneShotHooksCliAction(action, failureOwner = "command") {
	const result = await action().catch((err) => {
		rethrowExpectedCliError(err);
		const message = formatErrorMessage(err);
		const humanOutput = `${theme.error("Error:")} ${message}`;
		if (failureOwner === "root") throw new ExpectedCliError({
			message,
			humanOutput,
			machineOutput: message
		});
		defaultRuntime.error(humanOutput);
		defaultRuntime.exit(1);
		throw new Error("unreachable");
	});
	requestExitAfterOneShotOutput(defaultRuntime, typeof result === "number" ? result : 0);
}
async function setHookEnabled(hookName, enabled, agentId) {
	const snapshot = await readConfigFileSnapshot();
	const config = snapshot.sourceConfig ?? snapshot.config;
	const hook = resolveHookSelection(buildHooksReport(config, resolveHooksReportTarget(config, agentId)), hookName);
	if (!hook) throw new Error(`Hook "${hookName}" not found. Run \`${formatCliCommand("openclaw hooks list")}\` to see available hooks.`);
	if (hook.managedByPlugin) throw new Error(`Hook "${hookName}" is managed by plugin "${hook.pluginId ?? "unknown"}" and cannot be enabled/disabled.`);
	if (enabled && !hook.requirementsSatisfied) {
		const missing = formatHookMissingSummary(hook, 3);
		const installHint = hook.install.length ? ` Install options: ${summarizeStringEntries({
			entries: hook.install.map((option) => option.label),
			limit: 3
		})}.` : "";
		throw new Error(`Hook "${hookName}" is not eligible; missing ${missing}.${installHint} Run \`${formatCliCommand(`openclaw hooks info ${hookName}`)}\` for details.`);
	}
	const entries = { ...config.hooks?.internal?.entries };
	entries[hook.hookKey] = {
		...entries[hook.hookKey],
		enabled
	};
	await replaceConfigFile({
		nextConfig: {
			...config,
			hooks: {
				...config.hooks,
				internal: {
					...config.hooks?.internal,
					...enabled ? { enabled: true } : {},
					entries
				}
			}
		},
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {}
	});
	const prefix = enabled ? `${theme.success("✓")} Enabled hook:` : theme.warn(decorativePrefix("⏸", "Disabled hook:"));
	const name = hook.emoji ? `${hook.emoji} ${theme.command(hook.name)}` : decorativePrefix("🔗", theme.command(hook.name));
	defaultRuntime.log(`${prefix} ${name}`);
}
function registerHooksCli(program) {
	const hooks = program.command("hooks").description("Manage internal agent hooks").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/hooks", "docs.openclaw.ai/cli/hooks")}\n`);
	const hasJsonOutput = (opts) => Boolean(opts?.json || hooks.opts().json);
	hooks.hook("preAction", (_thisCommand, actionCommand) => {
		const parentAgent = hooks.opts().agent;
		if (parentAgent !== void 0 && !parentAgent.trim()) throw new Error("--agent must not be blank");
		if (parentAgent && actionCommand !== hooks && !(/* @__PURE__ */ new Set([
			"list",
			"info",
			"check",
			"enable",
			"disable"
		])).has(actionCommand.name())) throw new Error(`openclaw hooks ${actionCommand.name()} does not support --agent; the option only selects an owner for read-only hook reports.`);
	});
	hooks.command("list").description("List all hooks").option("--agent <id>", "Agent id to inspect").option("--eligible", "Show only eligible hooks", false).option("--json", "Output as JSON", false).option("-v, --verbose", "Show more details including missing requirements", false).action(async (opts, command) => runOneShotHooksCliAction(async () => {
		const report = await loadHooksReport(resolveHooksAgentOption(command));
		const json = hasJsonOutput(opts);
		writeHooksOutput(formatHooksList(report, {
			...opts,
			json
		}), json);
	}, "root"));
	hooks.command("info <name>").description("Show detailed information about a hook").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).action(async (name, opts, command) => runOneShotHooksCliAction(async () => {
		const report = await loadHooksReport(resolveHooksAgentOption(command));
		const json = hasJsonOutput(opts);
		const hook = resolveHookSelection(report, name);
		writeHooksOutput(formatHookInfo(hook, name, {
			...opts,
			json
		}), json);
		return hook ? 0 : 1;
	}, "root"));
	hooks.command("check").description("Check hooks eligibility status").option("--agent <id>", "Agent id to inspect").option("--json", "Output as JSON", false).action(async (opts, command) => runOneShotHooksCliAction(async () => {
		const report = await loadHooksReport(resolveHooksAgentOption(command));
		const json = hasJsonOutput(opts);
		writeHooksOutput(formatHooksCheck(report, {
			...opts,
			json
		}), json);
	}, "root"));
	hooks.command("enable <name>").description("Enable a hook").option("--agent <id>", "Agent id whose workspace to inspect").action(async (name, _opts, command) => runOneShotHooksCliAction(async () => {
		await setHookEnabled(name, true, resolveHooksAgentOption(command));
	}));
	hooks.command("disable <name>").description("Disable a hook").option("--agent <id>", "Agent id whose workspace to inspect").action(async (name, _opts, command) => runOneShotHooksCliAction(async () => {
		await setHookEnabled(name, false, resolveHooksAgentOption(command));
	}));
	hooks.command("relay", { hidden: true }).description("Internal native harness hook relay").requiredOption("--provider <provider>", "Native harness provider").requiredOption("--relay-id <id>", "Native hook relay id").option("--state-db <path>", "Shared state database path").option("--generation <generation>", "Native hook relay registration generation").requiredOption("--event <event>", "Native hook event").option("--pre-tool-use-unavailable <mode>", "PreToolUse fallback mode when the originating relay is unavailable").option("--timeout <ms>", "Gateway timeout in ms", "5000").action(async (opts) => runOneShotHooksCliAction(() => runNativeHookRelayCli(opts)));
	hooks.command("install").description("Deprecated: install a hook pack via `openclaw plugins install`").argument("<path-or-spec>", "Path to a hook pack or npm package spec").option("-l, --link", "Link a local path instead of copying", false).option("--pin", "Record npm installs as exact resolved <name>@<version>", false).option("--force", "Confirm non-ClawHub sources and overwrite an existing hook pack", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (raw, opts) => {
		defaultRuntime.log(theme.warn("`openclaw hooks install` is deprecated; use `openclaw plugins install`."));
		await runPluginInstallCommand({
			raw,
			opts,
			allowInstallPolicyWarningPrompt: true,
			invalidateRuntimeCache: false
		});
	});
	hooks.command("update").description("Deprecated: update hook packs via `openclaw plugins update`").argument("[id]", "Hook pack id (omit with --all)").option("--all", "Update all tracked hooks", false).option("--dry-run", "Show what would change without writing", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (id, opts) => {
		defaultRuntime.log(theme.warn("`openclaw hooks update` is deprecated; use `openclaw plugins update`."));
		await runPluginUpdateCommand({
			id,
			opts
		});
	});
	hooks.action(async (opts, command) => runOneShotHooksCliAction(async () => {
		const report = await loadHooksReport(resolveHooksAgentOption(command));
		const json = hasJsonOutput(opts);
		writeHooksOutput(formatHooksList(report, {
			...opts,
			json
		}), json);
	}, "root"));
}
//#endregion
export { registerHooksCli };
