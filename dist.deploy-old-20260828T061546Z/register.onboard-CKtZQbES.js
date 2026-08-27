import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as listExplicitOptionFlagsExcept } from "./command-options-BDuSHeWG.js";
import { t as parseGatewayPortOption } from "./gateway-port-option-0NYr1eQR.js";
import { i as resolveProviderOnboardAuthFlags } from "./provider-auth-choices-DZw3W3ra.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-qs_3-EHk.js";
import { t as CORE_ONBOARD_AUTH_FLAGS } from "./onboard-core-auth-flags-DYp3a9_x.js";
import { t as rejectOnboardingOption } from "./onboard-options-BiFqtCCq.js";
import { Option } from "commander";
//#region src/cli/program/register.onboard.ts
function resolveInstallDaemonFlag(command) {
	if (command.getOptionValueSource("skipDaemon") === "cli") return false;
	if (command.getOptionValueSource("installDaemon") === "cli") return Boolean(command.getOptionValue("installDaemon"));
}
const MODERN_ONBOARD_OPTION_KEYS = /* @__PURE__ */ new Set([
	"modern",
	"workspace",
	"agentName",
	"acceptRisk",
	"nonInteractive",
	"json"
]);
function validateRecommendationParentOptions(command, runtime, json = false) {
	const unsupported = listExplicitOptionFlagsExcept(command, json ? RECOMMENDATION_READ_PARENT_OPTIONS : NO_RECOMMENDATION_PARENT_OPTIONS);
	if (unsupported.length === 0) return true;
	return rejectOnboardingOption({ json }, runtime, `This recommendations command does not support parent option(s): ${unsupported.join(", ")}.`);
}
const AUTH_CHOICE_HELP = formatAuthChoiceChoicesForCli({ includeSkip: true });
const RECOMMENDATION_READ_PARENT_OPTIONS = /* @__PURE__ */ new Set(["json"]);
const NO_RECOMMENDATION_PARENT_OPTIONS = /* @__PURE__ */ new Set();
function extractCliFlags(cliOption) {
	return cliOption.split(/[ ,|]+/).filter((part) => part.startsWith("-")).map((part) => {
		const equalsIndex = part.indexOf("=");
		return equalsIndex === -1 ? part : part.slice(0, equalsIndex);
	});
}
function resolveOnboardAuthFlags() {
	const seenCliFlags = /* @__PURE__ */ new Set();
	const flags = [];
	for (const flag of [...CORE_ONBOARD_AUTH_FLAGS, ...resolveProviderOnboardAuthFlags()]) {
		const cliFlags = extractCliFlags(flag.cliOption);
		if (cliFlags.some((cliFlag) => seenCliFlags.has(cliFlag))) continue;
		for (const cliFlag of cliFlags) seenCliFlags.add(cliFlag);
		flags.push(flag);
	}
	return flags;
}
const ONBOARD_AUTH_FLAGS = resolveOnboardAuthFlags();
function pickOnboardProviderAuthOptionValues(opts) {
	return Object.fromEntries(ONBOARD_AUTH_FLAGS.map((flag) => [flag.optionKey, opts[flag.optionKey]]));
}
function registerOnboardAuthOptions(command) {
	command.option("--auth-choice <choice>", `Auth: ${AUTH_CHOICE_HELP}`).option("--token-provider <id>", "Token provider id (non-interactive; used with --auth-choice token)").option("--token <token>", "Token value (non-interactive; used with --auth-choice token)").option("--token-profile-id <id>", "Auth profile id (non-interactive; default: <provider>:manual)").option("--token-expires-in <duration>", "Optional token expiry duration (e.g. 365d, 12h)").option("--secret-input-mode <mode>", "Credential persistence mode: plaintext|ref (default: plaintext)").option("--cloudflare-ai-gateway-account-id <id>", "Cloudflare Account ID").option("--cloudflare-ai-gateway-gateway-id <id>", "Cloudflare AI Gateway ID");
	for (const providerFlag of ONBOARD_AUTH_FLAGS) command.option(providerFlag.cliOption, providerFlag.description);
	return command.option("--custom-base-url <url>", "Custom provider base URL").option("--custom-api-key <key>", "Custom provider API key (optional)").option("--custom-model-id <id>", "Custom provider model ID").option("--custom-provider-id <id>", "Custom provider ID (optional; auto-derived by default)").option("--custom-compatibility <mode>", "Custom provider API compatibility: openai|openai-responses|anthropic (default: openai)").option("--custom-image-input", "Mark the custom provider model as image-capable").option("--custom-text-input", "Mark the custom provider model as text-only");
}
function registerOnboardGatewayOptions(command) {
	return command.option("--gateway-port <port>", "Gateway port").option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom").option("--gateway-auth <mode>", "Gateway auth: token|password").option("--gateway-token <token>", "Gateway token (token auth)").option("--gateway-token-ref-env <name>", "Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)").option("--gateway-password <password>", "Gateway password (password auth)");
}
function registerOnboardRemoteOptions(command) {
	return command.option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").option("--remote-password <password>", "Remote Gateway password (optional)");
}
function registerOnboardRuntimeOptions(command, variant) {
	return command.option("--tailscale <mode>", "Tailscale: off|serve|funnel").addOption(new Option("--tailscale-reset-on-exit").hideHelp()).addOption(new Option("--no-tailscale-reset-on-exit").hideHelp()).option("--install-daemon", "Install gateway service").option("--no-install-daemon", "Skip gateway service install").option("--skip-daemon", "Skip gateway service install").option("--daemon-runtime <runtime>", "Daemon runtime: node|bun (default: node)").option("--skip-channels", "Skip channel setup").option("--skip-skills", "Skip skills setup").option("--skip-bootstrap", "Skip creating default agent workspace files").option("--skip-search", "Skip search provider setup").option("--skip-health", "Skip health check").option("--skip-ui", variant === "setup" ? "Skip Control UI/TUI launch" : "Skip Control UI/TUI prompts").option("--suppress-gateway-token-output", "Disable the guided Control UI handoff").option("--skip-hooks", variant === "setup" ? "Accepted for onboard compatibility; hooks setup is skipped" : "Skip hook setup").option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun").option("--import-from <provider>", "Migration provider to run during onboarding").option("--import-source <path>", "Source agent home for --import-from").option("--import-secrets", "Import supported secrets during onboarding migration", false);
}
function pickOnboardAuthOptionValues(opts) {
	const customTextInput = opts.customTextInput === true;
	return {
		authChoice: opts.authChoice,
		tokenProvider: opts.tokenProvider,
		token: opts.token,
		tokenProfileId: opts.tokenProfileId,
		tokenExpiresIn: opts.tokenExpiresIn,
		secretInputMode: opts.secretInputMode,
		...pickOnboardProviderAuthOptionValues(opts),
		cloudflareAiGatewayAccountId: opts.cloudflareAiGatewayAccountId,
		cloudflareAiGatewayGatewayId: opts.cloudflareAiGatewayGatewayId,
		customBaseUrl: opts.customBaseUrl,
		customApiKey: opts.customApiKey,
		customModelId: opts.customModelId,
		customProviderId: opts.customProviderId,
		customCompatibility: opts.customCompatibility,
		customImageInput: customTextInput ? false : opts.customImageInput === true ? true : void 0
	};
}
function resolveOnboardCommandOptions(opts, command, runtime) {
	if (opts.customImageInput === true && opts.customTextInput === true) return rejectOnboardingOption({ json: opts.json === true }, runtime, "Use either --custom-image-input or --custom-text-input, not both.");
	return {
		workspace: readStringValue(opts.workspace),
		agentName: readStringValue(opts.agentName),
		nonInteractive: Boolean(opts.nonInteractive),
		acceptRisk: Boolean(opts.acceptRisk),
		classic: Boolean(opts.classic),
		tui: Boolean(opts.tui),
		flow: opts.flow,
		mode: opts.mode,
		...pickOnboardAuthOptionValues(opts),
		gatewayPort: parseGatewayPortOption(opts.gatewayPort, "--gateway-port"),
		gatewayBind: opts.gatewayBind,
		gatewayAuth: opts.gatewayAuth,
		gatewayToken: readStringValue(opts.gatewayToken),
		gatewayTokenRefEnv: readStringValue(opts.gatewayTokenRefEnv),
		gatewayPassword: readStringValue(opts.gatewayPassword),
		remoteUrl: readStringValue(opts.remoteUrl),
		remoteToken: readStringValue(opts.remoteToken),
		remotePassword: readStringValue(opts.remotePassword),
		tailscale: opts.tailscale,
		reset: Boolean(opts.reset),
		resetScope: opts.resetScope,
		installDaemon: resolveInstallDaemonFlag(command),
		daemonRuntime: opts.daemonRuntime,
		skipChannels: Boolean(opts.skipChannels),
		skipSkills: Boolean(opts.skipSkills),
		skipBootstrap: Boolean(opts.skipBootstrap),
		skipSearch: Boolean(opts.skipSearch),
		skipHealth: Boolean(opts.skipHealth),
		skipUi: Boolean(opts.skipUi),
		suppressGatewayTokenOutput: Boolean(opts.suppressGatewayTokenOutput),
		skipHooks: Boolean(opts.skipHooks),
		nodeManager: opts.nodeManager,
		importFrom: readStringValue(opts.importFrom),
		importSource: readStringValue(opts.importSource),
		importSecrets: Boolean(opts.importSecrets),
		json: Boolean(opts.json)
	};
}
function registerOnboardCommand(program) {
	const command = program.command("onboard").description("Guided setup for auth, models, Gateway, workspace, channels, and skills").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/onboard", "docs.openclaw.ai/cli/onboard")}\n`).option("--workspace <dir>", "Workspace proposal for guided setup; persisted by classic/non-interactive setup").option("--agent-name <name>", "Name for the first agent (default: main)").option("--reset", "Reset config + credentials + sessions before running onboard (workspace only with --reset-scope full)").option("--reset-scope <scope>", "Reset scope: config|config+creds+sessions|full").option("--non-interactive", "Run without prompts", false).option("--modern", "Open inference-gated OpenClaw (kept for compatibility)", false).option("--classic", "Use the classic multi-step setup wizard", false).option("--tui", "Use the terminal hatch instead of the browser handoff", false).option("--accept-risk", "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)", false).option("--flow <flow>", "Onboard flow: quickstart|advanced|manual|import").option("--mode <mode>", "Onboard mode: local|remote");
	registerOnboardAuthOptions(command);
	registerOnboardGatewayOptions(command);
	registerOnboardRemoteOptions(command);
	registerOnboardRuntimeOptions(command, "onboard");
	command.option("--json", "Output JSON summary", false);
	const recommendations = command.command("recommendations").description("Read the app recommendations stored during onboarding").option("--json", "Output stored recommendation matches as JSON", false).action(async (opts, recommendationsCommand) => {
		const { defaultRuntime } = await import("./runtime-BO0y5md7.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const json = Boolean(opts.json || recommendationsCommand.parent?.opts().json);
			if (!validateRecommendationParentOptions(command, defaultRuntime, json)) return;
			const { onboardRecommendationsCommand } = await import("./onboard-recommendations-Bl5HVEQE.js");
			onboardRecommendationsCommand({ json }, defaultRuntime);
		});
	});
	recommendations.command("acknowledge").description("Mark the stored onboarding recommendation offer as answered").option("--retry <id...>", "Leave failed recommendation IDs pending for a later run").action(async (opts) => {
		const { defaultRuntime } = await import("./runtime-BO0y5md7.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			if (!validateRecommendationParentOptions(command, defaultRuntime) || !validateRecommendationParentOptions(recommendations, defaultRuntime)) return;
			const { acknowledgeOnboardRecommendationsCommand } = await import("./onboard-recommendations-Bl5HVEQE.js");
			acknowledgeOnboardRecommendationsCommand({ retry: opts.retry }, defaultRuntime);
		});
	});
	recommendations.command("refresh").description("Clear stored app recommendations so the next onboarding run rescans").action(async () => {
		const { defaultRuntime } = await import("./runtime-BO0y5md7.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			if (!validateRecommendationParentOptions(command, defaultRuntime) || !validateRecommendationParentOptions(recommendations, defaultRuntime)) return;
			const { refreshOnboardRecommendationsCommand } = await import("./onboard-recommendations-Bl5HVEQE.js");
			refreshOnboardRecommendationsCommand(defaultRuntime);
		});
	});
	command.action(async (opts, commandRuntime) => {
		const { defaultRuntime } = await import("./runtime-BO0y5md7.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const rejectOption = (message) => rejectOnboardingOption({ json: Boolean(opts.json) }, defaultRuntime, message);
			if (opts.modern) {
				const unsupportedOptions = listExplicitOptionFlagsExcept(commandRuntime, MODERN_ONBOARD_OPTION_KEYS);
				if (unsupportedOptions.length > 0) {
					rejectOption([`--modern cannot be combined with: ${unsupportedOptions.join(", ")}.`, "Run those setup options without --modern, or remove them to open OpenClaw."].join("\n"));
					return;
				}
				if (opts.nonInteractive && opts.acceptRisk !== true) {
					rejectOption([
						"Non-interactive setup requires explicit risk acknowledgement.",
						"Read: https://docs.openclaw.ai/security",
						`Re-run with: ${formatCliCommand("openclaw onboard --modern --non-interactive --accept-risk ...")}`
					].join("\n"));
					return;
				}
				const { runSystemAgentWithInference } = await import("./system-agent-with-inference-D8fcTvOy.js");
				await runSystemAgentWithInference({
					yes: false,
					json: Boolean(opts.json),
					interactive: !opts.nonInteractive,
					welcomeVariant: "onboarding",
					...opts.workspace ? { setupWorkspace: opts.workspace } : {},
					...opts.agentName ? { setupAgentName: opts.agentName } : {}
				}, defaultRuntime, {
					...opts.workspace ? { workspace: opts.workspace } : {},
					...opts.agentName ? { agentName: opts.agentName } : {},
					...opts.acceptRisk ? { acceptRisk: true } : {}
				});
				return;
			}
			const onboardingOptions = resolveOnboardCommandOptions(opts, commandRuntime, defaultRuntime);
			if (!onboardingOptions) return;
			const { setupWizardCommand } = await import("./onboard-C8S4z1qv.js");
			await setupWizardCommand(onboardingOptions, defaultRuntime);
		});
	});
}
//#endregion
export { registerOnboardRuntimeOptions as a, registerOnboardRemoteOptions as i, registerOnboardCommand as n, resolveOnboardCommandOptions as o, registerOnboardGatewayOptions as r, registerOnboardAuthOptions as t };
