import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as hasExplicitOptions } from "./command-options-Bv6UxUlT.js";
import { t as isUnconfiguredConfigSource } from "./fresh-install-config-DhP5LyQI.js";
import { n as runCommandWithRuntime } from "./cli-utils-Dg8R0Gwl.js";
import { t as parseGatewayPortOption } from "./gateway-port-option-BeopxFEo.js";
import { a as resolveTailscaleResetOnExitFlag, i as resolveInstallDaemonFlag, n as registerOnboardAuthOptions, o as validateOnboardAuthOptionValues, t as pickOnboardAuthOptionValues } from "./register.onboard-DKPXeghD.js";
//#region src/cli/program/register.setup.ts
const SYSTEM_AGENT_OPTION_NAMES = /* @__PURE__ */ new Set([
	"message",
	"yes",
	"json"
]);
const BASELINE_OPTION_NAMES = /* @__PURE__ */ new Set([
	"baseline",
	"workspace",
	"json"
]);
function resolveSetupCommandRoute(input) {
	if (input.hasOnboardingFlag) return "onboarding";
	if (input.hasSystemAgentRequest) return "system-agent";
	if (input.configured && (input.interactive || input.json)) return "system-agent";
	return "onboarding";
}
function hasExplicitOnboardingOption(command) {
	return command.options.some((option) => {
		const name = option.attributeName();
		return !SYSTEM_AGENT_OPTION_NAMES.has(name) && command.getOptionValueSource(name) === "cli";
	});
}
function listUnsupportedBaselineOptions(command) {
	const optionsByName = /* @__PURE__ */ new Map();
	for (const option of command.options) {
		const name = option.attributeName();
		if (BASELINE_OPTION_NAMES.has(name) || command.getOptionValueSource(name) !== "cli") continue;
		const existing = optionsByName.get(name);
		const valueIsNegated = command.getOptionValue(name) === false;
		if (!existing || option.negate === valueIsNegated) optionsByName.set(name, option);
	}
	return [...optionsByName.values()].map((option) => option.long ?? option.short ?? option.flags).toSorted();
}
async function isConfiguredInstance() {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.exists) return false;
	if (!snapshot.valid || snapshot.sourceConfig.gateway?.mode === "remote") return true;
	if (isUnconfiguredConfigSource(snapshot.sourceConfig)) return false;
	const { readLocalOnboardingStateForConfig } = await import("./local-onboarding-state-MF0R7TfF.js");
	return readLocalOnboardingStateForConfig(snapshot.path, snapshot.sourceConfig)?.status !== "pending";
}
async function runSystemAgentEntry(options, runtime) {
	const { runSystemAgentWithInference } = await import("./system-agent-with-inference-CXLjUxx3.js");
	await runSystemAgentWithInference({
		message: readStringValue(options.message),
		yes: Boolean(options.yes),
		json: Boolean(options.json)
	}, runtime);
}
async function runOnboardingEntry(options, commandRuntime, runtime) {
	if (options.baseline) {
		const unsupportedOptions = listUnsupportedBaselineOptions(commandRuntime);
		if (unsupportedOptions.length > 0) {
			runtime.error(`--baseline cannot be combined with: ${unsupportedOptions.join(", ")}.`);
			runtime.exit(1);
			return;
		}
		const { setupCommand } = await import("./setup-DLSIpwWd.js");
		await setupCommand({
			workspace: readStringValue(options.workspace),
			json: Boolean(options.json)
		}, runtime);
		return;
	}
	if (!validateOnboardAuthOptionValues(options, runtime)) return;
	const installDaemon = resolveInstallDaemonFlag(commandRuntime);
	const tailscaleResetOnExit = resolveTailscaleResetOnExitFlag(commandRuntime);
	const gatewayPort = parseGatewayPortOption(options.gatewayPort, "--gateway-port");
	const { setupWizardCommand } = await import("./onboard-CP3i4BqT.js");
	await setupWizardCommand({
		workspace: readStringValue(options.workspace),
		nonInteractive: Boolean(options.nonInteractive),
		acceptRisk: Boolean(options.acceptRisk),
		classic: Boolean(options.classic),
		tui: Boolean(options.tui),
		flow: options.flow,
		mode: options.mode,
		...pickOnboardAuthOptionValues(options),
		reset: Boolean(options.reset),
		resetScope: options.resetScope,
		gatewayPort,
		gatewayBind: options.gatewayBind,
		gatewayAuth: options.gatewayAuth,
		gatewayToken: readStringValue(options.gatewayToken),
		gatewayTokenRefEnv: readStringValue(options.gatewayTokenRefEnv),
		gatewayPassword: readStringValue(options.gatewayPassword),
		tailscale: options.tailscale,
		tailscaleResetOnExit,
		installDaemon,
		daemonRuntime: options.daemonRuntime,
		skipChannels: Boolean(options.skipChannels),
		skipSkills: Boolean(options.skipSkills),
		skipBootstrap: Boolean(options.skipBootstrap),
		skipSearch: Boolean(options.skipSearch),
		skipHealth: Boolean(options.skipHealth),
		skipUi: Boolean(options.skipUi),
		suppressGatewayTokenOutput: Boolean(options.suppressGatewayTokenOutput),
		skipHooks: Boolean(options.skipHooks),
		nodeManager: options.nodeManager,
		importFrom: readStringValue(options.importFrom),
		importSource: readStringValue(options.importSource),
		importSecrets: Boolean(options.importSecrets),
		remoteUrl: readStringValue(options.remoteUrl),
		remoteToken: readStringValue(options.remoteToken),
		json: Boolean(options.json)
	}, runtime);
}
function addSystemAgentOptions(command) {
	return command.option("-m, --message <text>", "Run one OpenClaw request").option("--yes", "Approve persistent config writes for one --message request", false).option("--json", "Output system overview or onboarding summary as JSON", false);
}
/** Register the canonical `setup` command and its hidden retired-name alias. */
function registerSetupCommand(program) {
	const command = program.command("setup").description("Chat with OpenClaw; onboard when setup is incomplete").addHelpText("after", () => `\n${theme.heading("Examples:")}\n  ${theme.command("openclaw setup")}\n    ${theme.muted("Chat with OpenClaw, or onboard when setup is incomplete.")}\n  ${theme.command("openclaw setup -m \"status\"")}\n    ${theme.muted("Run one system-agent request.")}\n  ${theme.command("openclaw setup --wizard")}\n    ${theme.muted("Run full onboarding.")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`).option("--workspace <dir>", "Workspace proposal for guided setup; persisted by baseline/classic/non-interactive setup").option("--wizard", "Run interactive onboarding", false).option("--baseline", "Create baseline config/workspace/session folders without onboarding", false).option("--reset", "Reset config + credentials + sessions before running onboarding (workspace only with --reset-scope full)").option("--reset-scope <scope>", "Reset scope: config|config+creds+sessions|full").option("--non-interactive", "Run onboarding without prompts", false).option("--classic", "Use the classic multi-step setup wizard", false).option("--tui", "Use the terminal hatch instead of the browser handoff", false).option("--accept-risk", "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)", false).option("--flow <flow>", "Onboard flow: quickstart|advanced|manual|import").option("--mode <mode>", "Onboard mode: local|remote");
	registerOnboardAuthOptions(command);
	command.option("--gateway-port <port>", "Gateway port").option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom").option("--gateway-auth <mode>", "Gateway auth: token|password").option("--gateway-token <token>", "Gateway token (token auth)").option("--gateway-token-ref-env <name>", "Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)").option("--gateway-password <password>", "Gateway password (password auth)").option("--tailscale <mode>", "Tailscale: off|serve|funnel").option("--tailscale-reset-on-exit", "Reset tailscale serve/funnel on exit").option("--no-tailscale-reset-on-exit", "Keep tailscale serve/funnel after exit").option("--install-daemon", "Install gateway service").option("--no-install-daemon", "Skip gateway service install").option("--skip-daemon", "Skip gateway service install").option("--daemon-runtime <runtime>", "Daemon runtime: node").option("--skip-channels", "Skip channel setup").option("--skip-skills", "Skip skills setup").option("--skip-bootstrap", "Skip creating default agent workspace files").option("--skip-search", "Skip search provider setup").option("--skip-health", "Skip health check").option("--skip-ui", "Skip Control UI/TUI launch").option("--suppress-gateway-token-output", "Suppress token-bearing Gateway/UI output").option("--skip-hooks", "Accepted for onboard compatibility; hooks setup is skipped").option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun").option("--import-from <provider>", "Migration provider to run during onboarding").option("--import-source <path>", "Source agent home for --import-from").option("--import-secrets", "Import supported secrets during onboarding migration", false).option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)");
	addSystemAgentOptions(command).action(async (rawOptions, commandRuntime) => {
		const { defaultRuntime } = await import("./runtime-Dn74rUMz.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const options = rawOptions;
			const hasOnboardingFlag = hasExplicitOnboardingOption(commandRuntime);
			const hasSystemAgentRequest = hasExplicitOptions(commandRuntime, ["message", "yes"]);
			if (resolveSetupCommandRoute({
				hasOnboardingFlag,
				hasSystemAgentRequest,
				configured: hasOnboardingFlag || hasSystemAgentRequest ? false : await isConfiguredInstance(),
				interactive: process.stdin.isTTY && process.stdout.isTTY,
				json: Boolean(options.json)
			}) === "system-agent") {
				await runSystemAgentEntry(options, defaultRuntime);
				return;
			}
			await runOnboardingEntry(options, commandRuntime, defaultRuntime);
		});
	});
	addSystemAgentOptions(program.command("crestodian", { hidden: true }).description("Deprecated: use openclaw setup")).action(async (options) => {
		const { defaultRuntime } = await import("./runtime-Dn74rUMz.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			await runSystemAgentEntry(options, defaultRuntime);
		});
	});
}
//#endregion
export { registerSetupCommand, resolveSetupCommandRoute };
