import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as formatCliJsonFailure } from "./failure-output-CdUzE2dC.js";
import { X as isDoctorMachineOutput } from "./argv-CCdO9MSu.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as hasExplicitOptions } from "./command-options-BDuSHeWG.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { n as setCommandJsonMode } from "./json-mode-BvX-XNl0.js";
//#region src/cli/program/register.maintenance.ts
const STATE_SQLITE_CONFLICTING_OPTION_NAMES = [
	"workspaceSuggestions",
	"yes",
	"repair",
	"fix",
	"force",
	"nonInteractive",
	"generateGatewayToken",
	"allowExec",
	"deep",
	"lint",
	"postUpgrade",
	"sessionSqlite",
	"sessionSqliteStore",
	"sessionSqliteAgent",
	"sessionSqliteAllAgents",
	"githubIssue",
	"severityMin",
	"all",
	"skip",
	"only"
];
function exitDoctorError(message, json) {
	if (json) defaultRuntime.writeJson(formatCliJsonFailure(message));
	else defaultRuntime.error(message);
	defaultRuntime.exit(2);
}
/** Register maintenance commands that inspect or mutate local OpenClaw state. */
function registerMaintenanceCommands(program) {
	setCommandJsonMode(program.command("doctor").description("Health checks + quick fixes for the gateway and channels").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/doctor", "docs.openclaw.ai/cli/doctor")}\n`).option("--no-workspace-suggestions", "Disable workspace memory system suggestions", true).option("--yes", "Accept defaults without prompting", false).option("--repair", "Apply recommended repairs without prompting", false).option("--fix", "Apply recommended repairs (alias for --repair)", false).option("--force", "Apply aggressive repairs (overwrites custom service config)", false).option("--non-interactive", "Run without prompts (safe migrations only)", false).option("--generate-gateway-token", "Generate and configure a gateway token", false).option("--allow-exec", "Allow doctor to execute exec SecretRefs while verifying configured secrets", false).option("--deep", "Scan system services for extra gateway installs", false).option("--lint", "Run read-only health checks and report findings", false).option("--post-upgrade", "Emit plugin-compat findings only (machine-readable with --json)", false).option("--session-sqlite <mode>", "Run session SQLite migration mode (dry-run|import|validate|inspect|compact|restore|recover)").option("--state-sqlite <mode>", "Run shared state SQLite maintenance mode (compact)").option("--session-sqlite-store <path>", "With --session-sqlite: inspect one session store").option("--session-sqlite-agent <id>", "With --session-sqlite: inspect one agent").option("--session-sqlite-all-agents", "With --session-sqlite: inspect configured and discovered agent stores", false).option("--github-issue", "With --session-sqlite recover: prepare and optionally create an openclaw/openclaw issue", false).option("--json", "Emit JSON; bare --json runs advisory read-only health checks", false).option("--severity-min <level>", "With --lint: drop findings below this severity (info|warning|error)").option("--all", "With --lint: run all registered checks, including opt-in checks", false).option("--skip <id>", "With --lint: skip a specific check id (repeatable)", (v, prev) => [...prev, v], []).option("--only <id>", "With --lint: run only the specified check id (repeatable)", (v, prev) => [...prev, v], []).action(async (opts, command) => {
		if (typeof opts.stateSqlite === "string" && hasExplicitOptions(command, STATE_SQLITE_CONFLICTING_OPTION_NAMES)) return exitDoctorError("doctor shared-state SQLite maintenance can only be combined with --json.", opts.json === true);
		if (hasSessionSqliteOnlyDoctorOptions(opts)) return exitDoctorError("doctor session SQLite options require --session-sqlite. Use `openclaw doctor --session-sqlite dry-run ...`.", opts.json === true || opts.lint === true && !process.stdout.isTTY);
		const jsonImpliesLint = opts.json === true && opts.lint !== true && opts.postUpgrade !== true && typeof opts.stateSqlite !== "string" && typeof opts.sessionSqlite !== "string";
		const lintMode = opts.lint === true ? "--lint" : jsonImpliesLint ? "--json" : void 0;
		const mutationOption = opts.repair === true || opts.fix === true || opts.force === true ? "--repair, --fix, or --force" : opts.yes === true ? "--yes" : opts.generateGatewayToken === true ? "--generate-gateway-token" : typeof opts.sessionSqlite === "string" ? `--session-sqlite ${opts.sessionSqlite}` : void 0;
		if (lintMode && mutationOption) return exitDoctorError(`doctor ${lintMode} runs read-only lint checks and cannot be combined with ${mutationOption}.`, opts.json === true || !process.stdout.isTTY);
		if (opts.lint !== true && hasLintOnlyDoctorOptions(opts)) return exitDoctorError("doctor lint options require --lint. Use `openclaw doctor --lint ...`.", opts.json === true);
		if (lintMode) {
			await runCommandWithRuntime(defaultRuntime, async () => {
				const { runDoctorLintCli } = await import("./doctor-lint-BVdzGvgT.js");
				const exitCode = await runDoctorLintCli(defaultRuntime, {
					json: Boolean(opts.json),
					severityMin: typeof opts.severityMin === "string" ? opts.severityMin : void 0,
					includeAllChecks: Boolean(opts.all),
					skipIds: Array.isArray(opts.skip) ? opts.skip : [],
					onlyIds: Array.isArray(opts.only) ? opts.only : [],
					allowExec: Boolean(opts.allowExec),
					deep: Boolean(opts.deep)
				});
				defaultRuntime.exit(jsonImpliesLint ? 0 : exitCode);
			}, (err) => exitDoctorError(formatErrorMessage(err), opts.json === true || !process.stdout.isTTY));
			return;
		}
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { doctorCommand } = await import("./doctor-B8ilCPP-.js");
			const stateSqlite = parseDoctorStateSqliteMode(opts.stateSqlite, opts.json === true);
			const sessionSqlite = parseDoctorSessionSqliteMode(opts.sessionSqlite, opts.json === true);
			await doctorCommand(defaultRuntime, {
				workspaceSuggestions: opts.workspaceSuggestions,
				yes: Boolean(opts.yes),
				repair: Boolean(opts.repair) || Boolean(opts.fix),
				force: Boolean(opts.force),
				nonInteractive: Boolean(opts.nonInteractive),
				generateGatewayToken: Boolean(opts.generateGatewayToken),
				allowExec: Boolean(opts.allowExec),
				deep: Boolean(opts.deep),
				postUpgrade: Boolean(opts.postUpgrade),
				...stateSqlite ? { stateSqlite } : {},
				...sessionSqlite ? { sessionSqlite } : {},
				...typeof opts.sessionSqliteStore === "string" ? { sessionSqliteStore: opts.sessionSqliteStore } : {},
				...typeof opts.sessionSqliteAgent === "string" ? { sessionSqliteAgent: opts.sessionSqliteAgent } : {},
				sessionSqliteAllAgents: Boolean(opts.sessionSqliteAllAgents),
				sessionSqliteGithubIssue: Boolean(opts.githubIssue),
				json: Boolean(opts.json)
			});
			defaultRuntime.exit(0);
		}, opts.json ? (err) => exitDoctorError(formatErrorMessage(err), true) : void 0);
	}), "output", isDoctorMachineOutput);
	program.command("triage").description("Collect sanitized diagnostics and prepare an agent debugging handoff").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/triage", "docs.openclaw.ai/cli/triage")}\n`).option("--json", "Output sanitized handoff paths, finding counts, and commands as JSON", false).option("--no-export", "Skip the sanitized diagnostics archive").option("--run", "Run one embedded agent turn after verifying model inference", false).action(async (opts) => {
		if (opts.json === true && opts.run === true) return exitDoctorError("triage --json cannot be combined with --run.", true);
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { triageCommand } = await import("./triage-BWB73DiV.js");
			await triageCommand(defaultRuntime, {
				json: opts.json === true,
				noExport: opts.export === false,
				run: opts.run === true
			});
		}, opts.json ? (err) => exitDoctorError(formatErrorMessage(err), true) : void 0);
	});
	program.command("dashboard").description("Open the Control UI with your current token").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/dashboard", "docs.openclaw.ai/cli/dashboard")}\n`).option("--no-open", "Print URL but do not launch a browser").option("--json", "Output dashboard connection details as JSON", false).option("--yes", "Start/install the gateway without prompting when needed", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { dashboardCommand } = await import("./dashboard-qErX_xfX.js");
			await dashboardCommand(defaultRuntime, {
				json: Boolean(opts.json),
				noOpen: opts.open === false,
				yes: Boolean(opts.yes)
			});
		});
	});
	program.command("reset").description("Reset local config/state (keeps the CLI installed)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/reset", "docs.openclaw.ai/cli/reset")}\n`).option("--scope <scope>", "config|config+creds+sessions|full (default: interactive prompt)").option("--yes", "Skip confirmation prompts", false).option("--non-interactive", "Disable prompts (requires --scope + --yes)", false).option("--dry-run", "Print actions without removing files", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { resetCommand } = await import("./reset-6Bd-hGqe.js");
			await resetCommand(defaultRuntime, {
				scope: opts.scope,
				yes: Boolean(opts.yes),
				nonInteractive: Boolean(opts.nonInteractive),
				dryRun: Boolean(opts.dryRun)
			});
		});
	});
	program.command("uninstall").description("Uninstall the gateway service + local data (CLI remains)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/uninstall", "docs.openclaw.ai/cli/uninstall")}\n`).option("--service", "Remove the gateway service", false).option("--state", "Remove state + config", false).option("--workspace", "Remove workspace dirs", false).option("--app", "Remove the macOS app", false).option("--all", "Remove service + state + workspace + app", false).option("--yes", "Skip confirmation prompts", false).option("--non-interactive", "Disable prompts (requires --yes)", false).option("--dry-run", "Print actions without removing files", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { uninstallCommand } = await import("./uninstall-BmqZWK8T.js");
			await uninstallCommand(defaultRuntime, {
				service: Boolean(opts.service),
				state: Boolean(opts.state),
				workspace: Boolean(opts.workspace),
				app: Boolean(opts.app),
				all: Boolean(opts.all),
				yes: Boolean(opts.yes),
				nonInteractive: Boolean(opts.nonInteractive),
				dryRun: Boolean(opts.dryRun)
			});
		});
	});
}
function hasLintOnlyDoctorOptions(opts) {
	return typeof opts.severityMin === "string" || opts.all === true || Array.isArray(opts.skip) && opts.skip.length > 0 || Array.isArray(opts.only) && opts.only.length > 0;
}
function hasSessionSqliteOnlyDoctorOptions(opts) {
	return typeof opts.sessionSqlite !== "string" && (typeof opts.sessionSqliteAgent === "string" || opts.githubIssue === true || opts.sessionSqliteAllAgents === true || typeof opts.sessionSqliteStore === "string");
}
function parseDoctorStateSqliteMode(value, json) {
	if (value === void 0 || value === "compact") return value;
	exitDoctorError("Invalid --state-sqlite mode. Use compact.", json);
	throw new Error("unreachable");
}
function parseDoctorSessionSqliteMode(value, json) {
	if (value === void 0 || value === "dry-run" || value === "import" || value === "validate" || value === "inspect" || value === "compact" || value === "restore" || value === "recover") return value;
	exitDoctorError("Invalid --session-sqlite mode. Use dry-run, import, validate, inspect, compact, restore, or recover.", json);
	throw new Error("unreachable");
}
//#endregion
export { registerMaintenanceCommands };
