import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import "./globals-DD_xHyf6.js";
import { n as runCommandWithRuntime } from "./cli-utils-Dg8R0Gwl.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
//#region src/cli/program/register.status-health-sessions.ts
function resolveVerbose(opts) {
	return Boolean(opts.verbose || opts.debug);
}
const SESSIONS_PARENT_OPTION_FLAGS = {
	json: "--json",
	verbose: "--verbose",
	store: "--store",
	agent: "--agent",
	allAgents: "--all-agents",
	active: "--active",
	limit: "--limit"
};
function rejectUnsupportedSessionsParentOptions(subcommand, parentOpts, unsupportedOptions, reason) {
	const unsupportedFlags = unsupportedOptions.filter((option) => {
		const value = parentOpts?.[option];
		return typeof value === "boolean" ? value : value !== void 0;
	}).map((option) => SESSIONS_PARENT_OPTION_FLAGS[option]);
	if (unsupportedFlags.length === 0) return false;
	const plural = unsupportedFlags.length > 1 ? "options" : "option";
	defaultRuntime.error(`\`sessions ${subcommand}\` does not support the parent \`sessions\` ${plural} ${unsupportedFlags.join(", ")}; ${reason}.`);
	defaultRuntime.exit(1);
	return true;
}
function createModuleLoader(load) {
	let promise;
	return () => promise ??= load();
}
const loadTasksCommands = createModuleLoader(() => import("./tasks-BHDC0LFg.js"));
const loadFlowsCommands = createModuleLoader(() => import("./flows-CgOHw0ge.js"));
function addSessionsListOptions(command) {
	return command.option("--json", "Output as JSON", false).option("--verbose", "Verbose logging", false).option("--store <path>", "Path to session store (default: resolved from config)").option("--agent <id>", "Agent id to inspect (default: configured default agent)").option("--all-agents", "Aggregate sessions across all configured agents", false).option("--active <minutes>", "Only show sessions updated within the past N minutes").option("--limit <count>", "Max sessions to show (default: 100; use \"all\" for full output)");
}
function addSessionsGatewayOptions(command) {
	return command.option("--agent <id>", "Agent id that owns the session (required for global keys)").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (password auth)").option("--timeout <ms>", "RPC timeout in milliseconds").option("--json", "Output JSON", false);
}
function mergeSessionsListOptions(opts, parentOpts) {
	return {
		json: Boolean(opts.json || parentOpts?.json),
		verbose: Boolean(opts.verbose || parentOpts?.verbose),
		store: opts.store ?? parentOpts?.store,
		agent: opts.agent ?? parentOpts?.agent,
		allAgents: Boolean(opts.allAgents || parentOpts?.allAgents),
		active: opts.active ?? parentOpts?.active,
		limit: opts.limit ?? parentOpts?.limit
	};
}
async function runSessionsListCli(opts) {
	setVerbose(Boolean(opts.verbose));
	const { sessionsCommand } = await import("./sessions-xO6L3AaJ.js");
	await sessionsCommand({
		json: Boolean(opts.json),
		store: opts.store,
		agent: opts.agent,
		allAgents: Boolean(opts.allAgents),
		active: opts.active,
		limit: opts.limit
	}, defaultRuntime);
}
function registerSessionsLifecycleCommand(sessionsCmd, operation) {
	const destructive = operation === "delete";
	const examples = destructive ? [
		["openclaw sessions delete \"agent:main:scratch-1\"", "Delete with confirmation."],
		["openclaw sessions delete \"agent:main:scratch-1\" \"agent:main:scratch-2\" --yes", "Delete several sessions non-interactively."],
		["openclaw sessions delete \"agent:work:scratch-1\" --agent work --dry-run", "Preview an agent-scoped delete."]
	] : [
		["openclaw sessions archive \"agent:main:scratch-1\"", "Archive one session."],
		["openclaw sessions archive \"agent:main:scratch-1\" \"agent:main:scratch-2\"", "Archive several sessions."],
		["openclaw sessions archive \"agent:work:scratch-1\" --agent work --dry-run", "Preview an agent-scoped archive."]
	];
	const command = sessionsCmd.command(`${operation} <keys...>`).description(destructive ? "Delete stored sessions and their live artifacts via the running gateway" : "Archive stored sessions via the running gateway").option(`--dry-run`, `Preview ${operation} actions without writing`, false);
	if (destructive) command.option("--yes", "Skip the destructive confirmation prompt", false);
	addSessionsGatewayOptions(command).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples(examples)}${destructive ? `\n\n${theme.muted("Deletion uses the Control UI lifecycle operation, including transcript archival and runtime cleanup.")}` : ""}`).action(async (keys, opts, actionCommand) => {
		const parentOpts = actionCommand.parent?.opts();
		if (rejectUnsupportedSessionsParentOptions(operation, parentOpts, [
			"store",
			"allAgents",
			"active",
			"limit",
			"verbose"
		], "the gateway resolves target stores from each key and --agent")) return;
		const timeoutMs = parseStrictPositiveInteger(opts.timeout);
		if (opts.timeout !== void 0 && timeoutMs === void 0) {
			defaultRuntime.error("--timeout must be a positive integer (milliseconds).");
			defaultRuntime.exit(1);
			return;
		}
		await runCommandWithRuntime(defaultRuntime, async () => {
			const lifecycleCommands = await import("./sessions-lifecycle-CelwvIWw.js");
			await (destructive ? lifecycleCommands.sessionsDeleteCommand : lifecycleCommands.sessionsArchiveCommand)({
				keys,
				agent: opts.agent ?? parentOpts?.agent,
				dryRun: Boolean(opts.dryRun),
				...destructive ? { yes: Boolean(opts.yes) } : {},
				timeout: timeoutMs !== void 0 ? String(timeoutMs) : void 0,
				url: opts.url,
				token: opts.token,
				password: opts.password,
				json: Boolean(opts.json || parentOpts?.json)
			}, defaultRuntime);
		});
	});
}
function parseTimeoutMs(timeout) {
	const parsed = parseStrictPositiveInteger(timeout);
	if (timeout !== void 0 && parsed === void 0) {
		defaultRuntime.error("--timeout must be a positive integer (milliseconds)");
		defaultRuntime.exit(1);
		return null;
	}
	return parsed;
}
function parseTasksAuditLimit(limit) {
	const parsed = parseStrictPositiveInteger(limit);
	if (limit !== void 0 && parsed === void 0) {
		defaultRuntime.error("--limit must be a positive integer, for example --limit 25.");
		defaultRuntime.exit(1);
		return null;
	}
	return parsed;
}
async function runWithVerboseAndTimeout(opts, action) {
	const verbose = resolveVerbose(opts);
	setVerbose(verbose);
	const timeoutMs = parseTimeoutMs(opts.timeout);
	if (timeoutMs === null) return;
	await runCommandWithRuntime(defaultRuntime, async () => {
		await action({
			verbose,
			timeoutMs
		});
	});
}
/** Register status/health plus persistent session/task inspection command groups. */
function registerStatusHealthSessionsCommands(program) {
	program.command("status").description("Show channel health and recent session recipients").option("--json", "Output JSON instead of text", false).option("--all", "Full diagnosis (read-only, pasteable)", false).option("--usage", "Show model provider usage/quota snapshots", false).option("--agent <id>", "Agent id for --usage auth scope").option("--deep", "Probe channels (WhatsApp Web + Telegram + Discord + Slack + Signal)", false).option("--timeout <ms>", "Probe timeout in milliseconds", "10000").option("--verbose", "Verbose logging", false).option("--debug", "Alias for --verbose", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw status", "Show channel health + session summary."],
		["openclaw status --all", "Full diagnosis (read-only)."],
		["openclaw status --json", "Machine-readable output."],
		["openclaw status --usage", "Show model provider usage/quota snapshots."],
		["openclaw status --deep", "Run channel probes (WA + Telegram + Discord + Slack + Signal)."],
		["openclaw status --deep --timeout 5000", "Tighten probe timeout."]
	])}`).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/status", "docs.openclaw.ai/cli/status")}\n`).action(async (opts) => {
		await runWithVerboseAndTimeout(opts, async ({ verbose, timeoutMs }) => {
			const { statusCommand } = await import("./status-BVOniLwR.js");
			await statusCommand({
				json: Boolean(opts.json),
				all: Boolean(opts.all),
				deep: Boolean(opts.deep),
				usage: Boolean(opts.usage),
				...opts.agent !== void 0 ? { agent: opts.agent } : {},
				timeoutMs,
				verbose
			}, defaultRuntime);
		});
	});
	program.command("health").description("Fetch health from the running gateway").option("--json", "Output JSON instead of text", false).option("--timeout <ms>", "Connection timeout in milliseconds", "10000").option("--verbose", "Verbose logging", false).option("--debug", "Alias for --verbose", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/health", "docs.openclaw.ai/cli/health")}\n`).action(async (opts) => {
		await runWithVerboseAndTimeout(opts, async ({ verbose, timeoutMs }) => {
			const { healthCommand } = await import("./health-CXiYk1gf.js");
			await healthCommand({
				json: Boolean(opts.json),
				timeoutMs,
				verbose
			}, defaultRuntime);
		});
	});
	const sessionsCmd = addSessionsListOptions(program.command("sessions").description("List stored conversation sessions")).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw sessions", "List all sessions."],
		["openclaw sessions --agent work", "List sessions for one agent."],
		["openclaw sessions --all-agents", "Aggregate sessions across agents."],
		["openclaw sessions --active 120", "Only last 2 hours."],
		["openclaw sessions --limit 25", "Show the newest 25 sessions."],
		["openclaw sessions --json", "Machine-readable output."],
		["openclaw sessions --store ./tmp/sessions.json", "Use a specific session store."]
	])}\n\n${theme.muted("Shows token usage per session when the agent reports it; set agents.defaults.contextTokens to cap the window and show %.")}`).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/sessions", "docs.openclaw.ai/cli/sessions")}\n`).action(async (opts) => {
		await runSessionsListCli(opts);
	});
	sessionsCmd.enablePositionalOptions();
	addSessionsListOptions(sessionsCmd.command("list").description("List stored conversation sessions")).action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		await runSessionsListCli(mergeSessionsListOptions(opts, parentOpts));
	});
	sessionsCmd.command("cleanup").description("Run session-store maintenance now").option("--store <path>", "Path to session store (default: resolved from config)").option("--agent <id>", "Agent id to maintain (default: configured default agent)").option("--all-agents", "Run maintenance across all configured agents", false).option("--dry-run", "Preview maintenance actions without writing", false).option("--enforce", "Apply maintenance even when configured mode is warn", false).option("--fix-missing", "Remove store entries whose transcript files are missing (bypasses age/count retention)", false).option("--fix-dm-scope", "Retire stale direct-DM session rows that no longer match session.dmScope=main", false).option("--active-key <key>", "Protect this session key from budget-eviction").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw sessions cleanup --dry-run", "Preview stale/cap cleanup."],
		["openclaw sessions cleanup --dry-run --fix-missing", "Also preview pruning entries with missing transcript files."],
		["openclaw sessions cleanup --dry-run --fix-dm-scope", "Preview stale direct-DM rows after returning dmScope to main."],
		["openclaw sessions cleanup --enforce", "Apply maintenance now."],
		["openclaw sessions cleanup --agent work --dry-run", "Preview one agent store."],
		["openclaw sessions cleanup --all-agents --dry-run", "Preview all agent stores."],
		["openclaw sessions cleanup --enforce --store ./tmp/sessions.json", "Use a specific store."]
	])}`).action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		if (rejectUnsupportedSessionsParentOptions("cleanup", parentOpts, [
			"active",
			"limit",
			"verbose"
		], "session-list filters cannot scope session maintenance")) return;
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { sessionsCleanupCommand } = await import("./sessions-cleanup-znXLrzsM.js");
			await sessionsCleanupCommand({
				store: opts.store ?? parentOpts?.store,
				agent: opts.agent ?? parentOpts?.agent,
				allAgents: Boolean(opts.allAgents || parentOpts?.allAgents),
				dryRun: Boolean(opts.dryRun),
				enforce: Boolean(opts.enforce),
				fixMissing: Boolean(opts.fixMissing),
				fixDmScope: Boolean(opts.fixDmScope),
				activeKey: opts.activeKey,
				json: Boolean(opts.json || parentOpts?.json)
			}, defaultRuntime);
		});
	});
	sessionsCmd.command("tail").description("Tail human-readable session trajectory progress").option("--session-key <key>", "Session key to tail (default: active sessions or latest)").option("--tail <count>", "Number of existing trajectory events to show", "80").option("--follow", "Continue following for new trajectory events", false).option("--store <path>", "Path to session store (default: resolved from config)").option("--agent <id>", "Agent id to inspect (default: configured default agent)").option("--all-agents", "Aggregate sessions across all configured agents", false).action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		if (rejectUnsupportedSessionsParentOptions("tail", parentOpts, [
			"json",
			"active",
			"limit",
			"verbose"
		], "trajectory tail emits human-readable progress and selects sessions separately")) return;
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { sessionsTailCommand } = await import("./sessions-tail-CzHfR8eD.js");
			await sessionsTailCommand({
				sessionKey: opts.sessionKey,
				store: opts.store ?? parentOpts?.store,
				agent: opts.agent ?? parentOpts?.agent,
				allAgents: Boolean(opts.allAgents || parentOpts?.allAgents),
				follow: Boolean(opts.follow),
				tail: opts.tail
			}, defaultRuntime);
		});
	});
	sessionsCmd.command("export-trajectory").description("Export a redacted trajectory bundle for a stored session").option("--session-key <key>", "Session key to export").option("--output <path>", "Output directory name inside .openclaw/trajectory-exports").option("--workspace <path>", "Workspace root for the export (default: current directory)").option("--store <path>", "Path to session store (default: resolved from config)").option("--agent <id>", "Agent id for resolving the default session store").option("--request-json-base64 <payload>", "Base64url-encoded export request").option("--json", "Output JSON", false).action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		if (rejectUnsupportedSessionsParentOptions("export-trajectory", parentOpts, [
			"allAgents",
			"active",
			"limit",
			"verbose"
		], "trajectory export targets one session and cannot apply session-list filters")) return;
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { exportTrajectoryCommand } = await import("./export-trajectory-DcibQO7p.js");
			await exportTrajectoryCommand({
				sessionKey: opts.sessionKey,
				output: opts.output,
				workspace: opts.workspace,
				store: opts.store ?? parentOpts?.store,
				agent: opts.agent ?? parentOpts?.agent,
				requestJsonBase64: opts.requestJsonBase64,
				json: Boolean(opts.json || parentOpts?.json)
			}, defaultRuntime);
		});
	});
	registerSessionsLifecycleCommand(sessionsCmd, "archive");
	registerSessionsLifecycleCommand(sessionsCmd, "delete");
	addSessionsGatewayOptions(sessionsCmd.command("compact <key>")).description("Compact a stored session transcript via the running gateway").option("--max-lines <count>", "Truncate to the last N transcript lines instead of LLM summarization").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw sessions compact \"agent:main:main\"", "LLM-summarize a session to reclaim context budget."],
		["openclaw sessions compact \"agent:main:main\" --max-lines 200", "Truncate to the last 200 transcript lines instead."],
		["openclaw sessions compact \"agent:work:main\" --agent work --json", "Target one agent's session and emit JSON."]
	])}\n\n${theme.muted("Backed by the sessions.compact gateway RPC; exits non-zero when compaction fails.")}`).action(async (key, opts, command) => {
		const parentOpts = command.parent?.opts();
		if (rejectUnsupportedSessionsParentOptions("compact", parentOpts, [
			"store",
			"allAgents",
			"active",
			"limit",
			"verbose"
		], "the gateway resolves the target store from <key> and --agent")) return;
		const maxLines = parseStrictPositiveInteger(opts.maxLines);
		if (opts.maxLines !== void 0 && maxLines === void 0) {
			defaultRuntime.error("--max-lines must be a positive integer.");
			defaultRuntime.exit(1);
			return;
		}
		const timeoutMs = parseStrictPositiveInteger(opts.timeout);
		if (opts.timeout !== void 0 && timeoutMs === void 0) {
			defaultRuntime.error("--timeout must be a positive integer (milliseconds).");
			defaultRuntime.exit(1);
			return;
		}
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { sessionsCompactCommand } = await import("./sessions-compact-DeEH7NYQ.js");
			await sessionsCompactCommand({
				key,
				agent: opts.agent ?? parentOpts?.agent,
				maxLines,
				timeout: timeoutMs !== void 0 ? String(timeoutMs) : void 0,
				url: opts.url,
				token: opts.token,
				password: opts.password,
				json: Boolean(opts.json || parentOpts?.json)
			}, defaultRuntime);
		});
	});
	const tasksCmd = program.command("tasks").description("Inspect durable background tasks and TaskFlow state").option("--json", "Output as JSON", false).option("--runtime <name>", "Filter by kind (subagent, acp, cron, cli)").option("--status <name>", "Filter by status (queued, running, succeeded, failed, timed_out, cancelled, lost)").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksListCommand } = await loadTasksCommands();
			await tasksListCommand({
				json: Boolean(opts.json),
				runtime: opts.runtime,
				status: opts.status
			}, defaultRuntime);
		});
	});
	tasksCmd.enablePositionalOptions();
	tasksCmd.command("list").description("List tracked background tasks").option("--json", "Output as JSON", false).option("--runtime <name>", "Filter by kind (subagent, acp, cron, cli)").option("--status <name>", "Filter by status (queued, running, succeeded, failed, timed_out, cancelled, lost)").action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksListCommand } = await loadTasksCommands();
			await tasksListCommand({
				json: Boolean(opts.json || parentOpts?.json),
				runtime: opts.runtime ?? parentOpts?.runtime,
				status: opts.status ?? parentOpts?.status
			}, defaultRuntime);
		});
	});
	tasksCmd.command("audit").description("Show stale or broken background tasks and TaskFlows").option("--json", "Output as JSON", false).option("--severity <level>", "Filter by severity (warn, error)").option("--code <name>", "Filter by finding code (stale_queued, stale_running, lost, delivery_failed, missing_cleanup, inconsistent_timestamps, restore_failed, stale_waiting, stale_blocked, cancel_stuck, missing_linked_tasks, blocked_task_missing)").option("--limit <n>", "Limit displayed findings").action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		const limit = parseTasksAuditLimit(opts.limit);
		if (limit === null) return;
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksAuditCommand } = await loadTasksCommands();
			await tasksAuditCommand({
				json: Boolean(opts.json || parentOpts?.json),
				severity: opts.severity,
				code: opts.code,
				limit
			}, defaultRuntime);
		});
	});
	tasksCmd.command("maintenance").description("Preview or apply tasks and TaskFlow maintenance").option("--json", "Output as JSON", false).option("--apply", "Apply reconciliation, cleanup stamping, and pruning", false).action(async (opts, command) => {
		const parentOpts = command.parent?.opts();
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksMaintenanceCommand } = await loadTasksCommands();
			await tasksMaintenanceCommand({
				json: Boolean(opts.json || parentOpts?.json),
				apply: Boolean(opts.apply)
			}, defaultRuntime);
		});
	});
	tasksCmd.command("show").description("Show one background task by task id, run id, or session key").argument("<lookup>", "Task id, run id, or session key").option("--json", "Output as JSON", false).action(async (lookup, opts, command) => {
		const parentOpts = command.parent?.opts();
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksShowCommand } = await loadTasksCommands();
			await tasksShowCommand({
				lookup,
				json: Boolean(opts.json || parentOpts?.json)
			}, defaultRuntime);
		});
	});
	tasksCmd.command("notify").description("Set task notify policy").argument("<lookup>", "Task id, run id, or session key").argument("<notify>", "Notify policy (done_only, state_changes, silent)").action(async (lookup, notify) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksNotifyCommand } = await loadTasksCommands();
			await tasksNotifyCommand({
				lookup,
				notify
			}, defaultRuntime);
		});
	});
	tasksCmd.command("cancel").description("Cancel a running background task").argument("<lookup>", "Task id, run id, or session key").action(async (lookup) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksCancelCommand } = await loadTasksCommands();
			await tasksCancelCommand({ lookup }, defaultRuntime);
		});
	});
	tasksCmd.command("retry <lookups...>").description("Retry delivery for up to 10 blocked subagent completions").action(async (lookups) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksRetryCommand } = await loadTasksCommands();
			await tasksRetryCommand({ lookups }, defaultRuntime);
		});
	});
	tasksCmd.command("dismiss <lookups...>").description("Dismiss delivery for up to 10 blocked subagent completions").action(async (lookups) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { tasksDismissCommand } = await loadTasksCommands();
			await tasksDismissCommand({ lookups }, defaultRuntime);
		});
	});
	const tasksFlowCmd = tasksCmd.command("flow").description("Inspect durable TaskFlow state under tasks");
	tasksFlowCmd.command("list").description("List tracked TaskFlows").option("--json", "Output as JSON", false).option("--status <name>", "Filter by status (queued, running, waiting, blocked, succeeded, failed, cancelled, lost)").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { flowsListCommand } = await loadFlowsCommands();
			await flowsListCommand({
				json: Boolean(opts.json),
				status: opts.status
			}, defaultRuntime);
		});
	});
	tasksFlowCmd.command("show").description("Show one TaskFlow by flow id or owner key").argument("<lookup>", "Flow id or owner key").option("--json", "Output as JSON", false).action(async (lookup, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { flowsShowCommand } = await loadFlowsCommands();
			await flowsShowCommand({
				lookup,
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
	tasksFlowCmd.command("cancel").description("Cancel a running TaskFlow").argument("<lookup>", "Flow id or owner key").action(async (lookup) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { flowsCancelCommand } = await loadFlowsCommands();
			await flowsCancelCommand({ lookup }, defaultRuntime);
		});
	});
}
//#endregion
export { registerStatusHealthSessionsCommands };
