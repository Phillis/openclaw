import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { i as resolveProviderOnboardAuthFlags } from "./provider-auth-choices-Cf_X4oEk.js";
import { n as runCommandWithRuntime } from "./cli-utils-Dg8R0Gwl.js";
import { t as parseGatewayPortOption } from "./gateway-port-option-BeopxFEo.js";
import { r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-CgFBBcQc.js";
import { t as CORE_ONBOARD_AUTH_FLAGS } from "./onboard-core-auth-flags-DYp3a9_x.js";
//#region src/cli/program/register.onboard.ts
function resolveInstallDaemonFlag(command) {
	if (command.getOptionValueSource("skipDaemon") === "cli") return false;
	if (command.getOptionValueSource("installDaemon") === "cli") return Boolean(command.getOptionValue("installDaemon"));
}
function resolveTailscaleResetOnExitFlag(command) {
	if (command.getOptionValueSource("tailscaleResetOnExit") !== "cli") return;
	return Boolean(command.getOptionValue("tailscaleResetOnExit"));
}
const MODERN_ONBOARD_OPTION_KEYS = /* @__PURE__ */ new Set([
	"modern",
	"workspace",
	"agentName",
	"acceptRisk",
	"nonInteractive",
	"json"
]);
function listUnsupportedModernOptions(command) {
	const optionsByKey = /* @__PURE__ */ new Map();
	for (const option of command.options) {
		const key = option.attributeName();
		if (MODERN_ONBOARD_OPTION_KEYS.has(key) || command.getOptionValueSource(key) !== "cli") continue;
		const existing = optionsByKey.get(key);
		const valueIsNegated = command.getOptionValue(key) === false;
		if (!existing || option.negate === valueIsNegated) optionsByKey.set(key, option);
	}
	return [...optionsByKey.values()].map((option) => option.long ?? option.short ?? option.flags).toSorted();
}
const AUTH_CHOICE_HELP = formatAuthChoiceChoicesForCli({
	includeLegacyAliases: true,
	includeSkip: true
});
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
	command.option("--auth-choice <choice>", `Auth: ${AUTH_CHOICE_HELP}`).option("--token-provider <id>", "Token provider id (non-interactive; used with --auth-choice token)").option("--token <token>", "Token value (non-interactive; used with --auth-choice token)").option("--token-profile-id <id>", "Auth profile id (non-interactive; default: <provider>:manual)").option("--token-expires-in <duration>", "Optional token expiry duration (e.g. 365d, 12h)").option("--secret-input-mode <mode>", "API key persistence mode: plaintext|ref (default: plaintext)").option("--cloudflare-ai-gateway-account-id <id>", "Cloudflare Account ID").option("--cloudflare-ai-gateway-gateway-id <id>", "Cloudflare AI Gateway ID");
	for (const providerFlag of ONBOARD_AUTH_FLAGS) command.option(providerFlag.cliOption, providerFlag.description);
	return command.option("--custom-base-url <url>", "Custom provider base URL").option("--custom-api-key <key>", "Custom provider API key (optional)").option("--custom-model-id <id>", "Custom provider model ID").option("--custom-provider-id <id>", "Custom provider ID (optional; auto-derived by default)").option("--custom-compatibility <mode>", "Custom provider API compatibility: openai|openai-responses|anthropic (default: openai)").option("--custom-image-input", "Mark the custom provider model as image-capable").option("--custom-text-input", "Mark the custom provider model as text-only");
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
function validateOnboardAuthOptionValues(opts, runtime) {
	if (opts.customImageInput === true && opts.customTextInput === true) {
		runtime.error("Use either --custom-image-input or --custom-text-input, not both.");
		runtime.exit(1);
		return false;
	}
	return true;
}
function registerOnboardCommand(program) {
	const command = program.command("onboard").description("Guided setup for auth, models, Gateway, workspace, channels, and skills").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/onboard", "docs.openclaw.ai/cli/onboard")}\n`).option("--workspace <dir>", "Workspace proposal for guided setup; persisted by classic/non-interactive setup").option("--agent-name <name>", "Name for the first agent (default: main)").option("--reset", "Reset config + credentials + sessions before running onboard (workspace only with --reset-scope full)").option("--reset-scope <scope>", "Reset scope: config|config+creds+sessions|full").option("--non-interactive", "Run without prompts", false).option("--modern", "Open inference-gated OpenClaw (kept for compatibility)", false).option("--classic", "Use the classic multi-step setup wizard", false).option("--tui", "Use the terminal hatch instead of the browser handoff", false).option("--accept-risk", "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)", false).option("--flow <flow>", "Onboard flow: quickstart|advanced|manual|import").option("--mode <mode>", "Onboard mode: local|remote");
	registerOnboardAuthOptions(command);
	command.option("--gateway-port <port>", "Gateway port").option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom").option("--gateway-auth <mode>", "Gateway auth: token|password").option("--gateway-token <token>", "Gateway token (token auth)").option("--gateway-token-ref-env <name>", "Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)").option("--gateway-password <password>", "Gateway password (password auth)").option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").option("--tailscale <mode>", "Tailscale: off|serve|funnel").option("--tailscale-reset-on-exit", "Reset tailscale serve/funnel on exit").option("--no-tailscale-reset-on-exit", "Keep tailscale serve/funnel after exit").option("--install-daemon", "Install gateway service").option("--no-install-daemon", "Skip gateway service install").option("--skip-daemon", "Skip gateway service install").option("--daemon-runtime <runtime>", "Daemon runtime: node").option("--skip-channels", "Skip channel setup").option("--skip-skills", "Skip skills setup").option("--skip-bootstrap", "Skip creating default agent workspace files").option("--skip-search", "Skip search provider setup").option("--skip-health", "Skip health check").option("--skip-ui", "Skip Control UI/TUI prompts").option("--suppress-gateway-token-output", "Suppress token-bearing Gateway/UI output").option("--skip-hooks", "Skip hook setup").option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun").option("--import-from <provider>", "Migration provider to run during onboarding").option("--import-source <path>", "Source agent home for --import-from").option("--import-secrets", "Import supported secrets during onboarding migration", false).option("--json", "Output JSON summary", false);
	const recommendations = command.command("recommendations").description("Read the app recommendations stored during onboarding").option("--json", "Output stored recommendation matches as JSON", false).action(async (opts, recommendationsCommand) => {
		const { defaultRuntime } = await import("./runtime-Dn74rUMz.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { onboardRecommendationsCommand } = await import("./onboard-recommendations-Czpe3fXG.js");
			onboardRecommendationsCommand({ json: Boolean(opts.json || recommendationsCommand.parent?.opts().json) }, defaultRuntime);
		});
	});
	recommendations.command("acknowledge").description("Mark the stored onboarding recommendation offer as answered").option("--retry <id...>", "Leave failed recommendation IDs pending for a later run").action(async (opts) => {
		const { defaultRuntime } = await import("./runtime-Dn74rUMz.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { acknowledgeOnboardRecommendationsCommand } = await import("./onboard-recommendations-Czpe3fXG.js");
			acknowledgeOnboardRecommendationsCommand({ retry: opts.retry }, defaultRuntime);
		});
	});
	recommendations.command("refresh").description("Clear stored app recommendations so the next onboarding run rescans").action(async () => {
		const { defaultRuntime } = await import("./runtime-Dn74rUMz.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { refreshOnboardRecommendationsCommand } = await import("./onboard-recommendations-Czpe3fXG.js");
			refreshOnboardRecommendationsCommand(defaultRuntime);
		});
	});
	command.action(async (opts, commandRuntime) => {
		const { defaultRuntime } = await import("./runtime-Dn74rUMz.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			if (opts.modern) {
				const unsupportedOptions = listUnsupportedModernOptions(commandRuntime);
				if (unsupportedOptions.length > 0) {
					defaultRuntime.error([`--modern cannot be combined with: ${unsupportedOptions.join(", ")}.`, "Run those setup options without --modern, or remove them to open OpenClaw."].join("\n"));
					defaultRuntime.exit(1);
					return;
				}
				if (opts.nonInteractive && opts.acceptRisk !== true) {
					defaultRuntime.error([
						"Non-interactive setup requires explicit risk acknowledgement.",
						"Read: https://docs.openclaw.ai/security",
						`Re-run with: ${formatCliCommand("openclaw onboard --modern --non-interactive --accept-risk ...")}`
					].join("\n"));
					defaultRuntime.exit(1);
					return;
				}
				const { runSystemAgentWithInference } = await import("./system-agent-with-inference-CXLjUxx3.js");
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
			if (!validateOnboardAuthOptionValues(opts, defaultRuntime)) return;
			const installDaemon = resolveInstallDaemonFlag(commandRuntime);
			const tailscaleResetOnExit = resolveTailscaleResetOnExitFlag(commandRuntime);
			const gatewayPort = parseGatewayPortOption(opts.gatewayPort, "--gateway-port");
			const { setupWizardCommand } = await import("./onboard-CP3i4BqT.js");
			await setupWizardCommand({
				workspace: opts.workspace,
				agentName: opts.agentName,
				nonInteractive: Boolean(opts.nonInteractive),
				acceptRisk: Boolean(opts.acceptRisk),
				classic: Boolean(opts.classic),
				tui: Boolean(opts.tui),
				flow: opts.flow,
				mode: opts.mode,
				...pickOnboardAuthOptionValues(opts),
				gatewayPort,
				gatewayBind: opts.gatewayBind,
				gatewayAuth: opts.gatewayAuth,
				gatewayToken: opts.gatewayToken,
				gatewayTokenRefEnv: opts.gatewayTokenRefEnv,
				gatewayPassword: opts.gatewayPassword,
				remoteUrl: opts.remoteUrl,
				remoteToken: opts.remoteToken,
				tailscale: opts.tailscale,
				tailscaleResetOnExit,
				reset: Boolean(opts.reset),
				resetScope: opts.resetScope,
				installDaemon,
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
				importFrom: opts.importFrom,
				importSource: opts.importSource,
				importSecrets: Boolean(opts.importSecrets),
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
}
//#endregion
export { resolveTailscaleResetOnExitFlag as a, resolveInstallDaemonFlag as i, registerOnboardAuthOptions as n, validateOnboardAuthOptionValues as o, registerOnboardCommand as r, pickOnboardAuthOptionValues as t };
