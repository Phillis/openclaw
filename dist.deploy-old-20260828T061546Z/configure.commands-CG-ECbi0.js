import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { d as isSecretRef, p as isValidEnvSecretRefId } from "./types.secrets-Bre8L6Ts.js";
import { _ as resolveGatewayPort, t as CONFIG_PATH } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as defaultRuntime, t as ExitError } from "./runtime-LRpY2Icg.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { _ as resolveMutableAgentEntry } from "./agent-scope-config-CUBiGmG3.js";
import { l as readConfigFileSnapshotForWrite, n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { u as resolveDefaultSecretProviderAlias } from "./ref-contract-BHWY70rN.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { o as resolvePluginContributionOwners } from "./plugin-registry-contributions-JopjOY3b.js";
import "./plugin-registry-BcpcjwxL.js";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-CL_-T11Y.js";
import { s as listChatChannels } from "./registry-DbgR8dhg.js";
import "./config-B_0xOnKq.js";
import { b as isNonFatalSystemdInstallProbeError } from "./systemd-scope-Dt6qzIxA.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-DoMAs6SE.js";
import { n as GATEWAY_DAEMON_RUNTIME_OPTIONS, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-DMPJy4HP.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-Cl4U8JRV.js";
import { n as findTailscaleBinary } from "./tailscale-wMoHhrdJ.js";
import { t as randomToken } from "./random-token-B1woZa_H.js";
import "./systemd-fY9j-7P4.js";
import { o as resolveGatewayService, t as describeGatewayServiceRestart } from "./service-BYLPjc81.js";
import { o as formatPortRangeHint } from "./error-format-HTpcnFye.js";
import { t as parsePort } from "./parse-port-Dw2bUWKg.js";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.js";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-Cmw7Ozpm.js";
import { r as resolveLocalControlUiProbeLinks, t as resolveAdvertisedControlUiLinks } from "./control-ui-links-CTWv3QrL.js";
import { t as formatWindowsGatewayFirewallGuidance } from "./windows-gateway-firewall-diagnostics-CIVeX3cL.js";
import { r as ensureAuthProfileStore } from "./store-C6iqqcJy.js";
import "./auth-profiles-wr_j3m1O.js";
import { t as describeCodexNativeWebSearch } from "./codex-native-web-search.shared-fr3fqH85.js";
import { r as withProgress } from "./progress-3-oJv0bD.js";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.js";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.js";
import { a as guardCancel, d as summarizeExistingConfig, f as validateGatewayPasswordInput, n as applyWizardMetadata, p as waitForGatewayReachable, s as normalizeGatewayTokenInput, t as DEFAULT_WORKSPACE, u as probeGatewayReachable } from "./onboard-helpers-DsV_5p6H.js";
import { c as resolveSystemAgentOnboardingTarget, n as applyOnboardingPrimaryModel, o as resolveOnboardingAgentTarget, r as ensureOnboardingAgentWorkspace, t as applyAgentModelDefaults } from "./onboard-agent-target-CwN0HHjK.js";
import { t as note } from "./note-YH_0kY-3.js";
import { t as createClackPrompter } from "./clack-prompter-DghMKpQq.js";
import { r as logConfigUpdated } from "./logging-BcwtF00P.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-BfqdA5hk.js";
import { a as outro, c as select, i as intro, l as text, n as CONFIGURE_WIZARD_SECTIONS, o as parseConfigureWizardSections, r as confirm, s as password, t as CONFIGURE_SECTION_OPTIONS } from "./configure.shared-D77XM94J.js";
import { i as setupChannels, n as createChannelSetupTransaction } from "./onboard-channels-DywrTusi.js";
import { n as promptAuthChoiceGrouped } from "./auth-choice-prompt-B81aWCET.js";
import { i as applyAuthChoice } from "./auth-choice-DN7gnvst.js";
import { t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-BkJydP0v.js";
import { c as writeWizardConfigFile } from "./setup.shared-C1C_TtR8.js";
import { t as ensureSystemdUserLingerInteractive } from "./systemd-linger-DrYCwnZS.js";
import { n as loadStaticManifestCatalogRowsForList } from "./list.manifest-catalog-Cj-et3gB.js";
import { i as promptModelAllowlist, n as applyModelFallbacksFromSelection, r as promptDefaultModel, t as applyModelAllowlist } from "./model-picker-CA-skiWR.js";
import { t as promptCustomApiConfig } from "./onboard-custom-DGovjgio.js";
import { t as validateDottedDecimalIPv4Input } from "./ipv4-BQKRfag7.js";
import { i as maybeAddTailnetOriginToControlUiAllowedOrigins, n as TAILSCALE_EXPOSURE_OPTIONS, r as TAILSCALE_MISSING_BIN_NOTE_LINES, t as TAILSCALE_DOCS_LINES } from "./gateway-config-prompts.shared-B3NjWPSs.js";
import { r as formatHealthCheckFailure } from "./health-format-C81CzRYf.js";
import { o as healthCommandNonExiting } from "./health-WUQefFcG.js";
import { t as promptRemoteGatewayConfig } from "./onboard-remote-CFYQy_AA.js";
import { t as setupSkills } from "./onboard-skills-Cs1jFX3T.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/configure.channels.ts
const RESERVED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
const DONE_VALUE = { kind: "done" };
function listConfiguredChannelRemovalChoices(cfg) {
	const channels = cfg.channels;
	if (!channels) return [];
	const labelsById = new Map(listChatChannels().map((meta) => [meta.id, formatChannelRemovalLabel(meta.label, meta.id)]));
	return Object.keys(channels).filter((id) => !RESERVED_CHANNEL_CONFIG_KEYS.has(id)).filter((id) => !isBlockedObjectKey(id)).map((id) => ({
		id,
		label: labelsById.get(id) ?? formatUnknownChannelRemovalLabel(id)
	})).toSorted(compareChannelRemovalChoices);
}
function formatChannelRemovalLabel(label, fallback) {
	return sanitizeTerminalText(label) || formatUnknownChannelRemovalLabel(fallback);
}
function formatUnknownChannelRemovalLabel(id) {
	return sanitizeTerminalText(id) || "<invalid channel key>";
}
function compareChannelRemovalChoices(left, right) {
	return left.label.localeCompare(right.label, void 0, {
		numeric: true,
		sensitivity: "base"
	}) || left.id.localeCompare(right.id, void 0, {
		numeric: true,
		sensitivity: "base"
	});
}
/** Prompt for configured channel sections to remove from openclaw.json. */
async function removeChannelConfigWizard(cfg, runtime) {
	const next = { ...cfg };
	while (true) {
		const configured = listConfiguredChannelRemovalChoices(next);
		if (configured.length === 0) {
			note(["No channel config found in openclaw.json.", `Tip: \`${formatCliCommand("openclaw channels status")}\` shows what is configured and enabled.`].join("\n"), "Remove channel");
			return next;
		}
		const channelOptions = configured.map((meta) => ({
			value: {
				kind: "channel",
				id: meta.id
			},
			label: meta.label,
			hint: "Deletes tokens + settings from config (credentials stay on disk)"
		}));
		const doneOption = {
			value: DONE_VALUE,
			label: "Done"
		};
		const choice = guardCancel(await select({
			message: "Remove which channel config?",
			options: [...channelOptions, doneOption]
		}), runtime, 1);
		if (choice.kind === "done") return next;
		const channel = choice.id;
		const label = configured.find((entry) => entry.id === channel)?.label ?? channel;
		if (!guardCancel(await confirm({
			message: `Delete ${label} configuration from ${shortenHomePath(CONFIG_PATH)}?`,
			initialValue: false
		}), runtime, 1)) continue;
		const nextChannels = { ...next.channels };
		delete nextChannels[channel];
		if (Object.keys(nextChannels).length) next.channels = nextChannels;
		else delete next.channels;
		note([`${label} selected for removal from config.`, "Note: credentials/sessions on disk are unchanged."].join("\n"), "Channel removal");
	}
}
//#endregion
//#region src/commands/configure.daemon.ts
/** Prompt to install, reinstall, restart, or skip the local Gateway service. */
async function maybeInstallDaemon(params) {
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (error) {
		if (!isNonFatalSystemdInstallProbeError(error)) throw error;
		loaded = false;
	}
	let shouldCheckLinger = false;
	let shouldInstall = true;
	let daemonRuntime = params.daemonRuntime ?? "node";
	if (loaded) {
		const action = guardCancel(await select({
			message: "Gateway service already installed",
			options: [
				{
					value: "restart",
					label: "Restart"
				},
				{
					value: "reinstall",
					label: "Reinstall"
				},
				{
					value: "skip",
					label: "Skip"
				}
			]
		}), params.runtime, 1);
		if (action === "restart") {
			await withProgress({
				label: "Gateway service",
				indeterminate: true,
				delayMs: 0
			}, async (progress) => {
				progress.setLabel("Restarting Gateway service…");
				const restartResult = await service.restart({
					env: process.env,
					stdout: process.stdout
				});
				progress.setLabel(describeGatewayServiceRestart("Gateway", restartResult).progressMessage);
			});
			shouldCheckLinger = true;
			shouldInstall = false;
		}
		if (action === "skip") return "skipped";
	}
	if (shouldInstall) {
		let installError = null;
		if (!params.daemonRuntime) if (GATEWAY_DAEMON_RUNTIME_OPTIONS.length === 1) daemonRuntime = GATEWAY_DAEMON_RUNTIME_OPTIONS[0]?.value ?? "node";
		else daemonRuntime = guardCancel(await select({
			message: "Gateway service runtime",
			options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
			initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME
		}), params.runtime, 1);
		await withProgress({
			label: "Gateway service",
			indeterminate: true,
			delayMs: 0
		}, async (progress) => {
			progress.setLabel("Preparing Gateway service…");
			const cfg = getRuntimeConfig();
			const tokenResolution = await resolveGatewayInstallToken({
				config: cfg,
				env: process.env
			});
			for (const warning of tokenResolution.warnings) note(warning, "Gateway");
			if (tokenResolution.unavailableReason) {
				installError = [
					"Gateway install blocked:",
					tokenResolution.unavailableReason,
					"Fix gateway auth config/token input and rerun configure."
				].join(" ");
				progress.setLabel("Gateway service install blocked.");
				return;
			}
			const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
				env: process.env,
				port: params.port,
				runtime: daemonRuntime,
				warn: (message, title) => note(message, title),
				config: cfg
			});
			progress.setLabel("Installing Gateway service…");
			try {
				await service.install({
					env: process.env,
					stdout: process.stdout,
					programArguments,
					workingDirectory,
					environment,
					environmentValueSources
				});
				progress.setLabel("Gateway service installed.");
			} catch (err) {
				installError = formatErrorMessage(err);
				progress.setLabel("Gateway service install failed.");
			}
		});
		if (installError) {
			note("Gateway service install failed: ".concat(installError), "Gateway");
			note(gatewayInstallErrorHint(), "Gateway");
			return "failed";
		}
		shouldCheckLinger = true;
	}
	if (shouldCheckLinger) await ensureSystemdUserLingerInteractive({
		runtime: params.runtime,
		prompter: {
			confirm: async (p) => guardCancel(await confirm(p), params.runtime, 1),
			note
		},
		reason: "Linux installs use a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
		requireConfirm: true
	});
	return "succeeded";
}
//#endregion
//#region src/commands/configure.gateway-auth.ts
/** Reject undefined, empty, and common JS string-coercion artifacts for token auth. */
function sanitizeTokenValue(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed || trimmed === "undefined" || trimmed === "null") return;
	return trimmed;
}
async function resolveProviderChoiceModelPrompt(params) {
	const { resolvePluginProviders, resolveProviderPluginChoice } = await import("./provider-auth-choice.runtime.js");
	const resolved = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			mode: "setup"
		}),
		choice: params.authChoice
	});
	const wizard = resolved?.provider.wizard?.setup;
	if (!wizard) return resolved?.provider.id ? { provider: resolved.provider.id } : void 0;
	return {
		provider: resolved.provider.id,
		...wizard.modelAllowlist,
		...wizard.modelSelection?.promptWhenAuthChoiceProvided === true ? { loadCatalog: true } : {}
	};
}
function hasConfiguredProviderModels(cfg, provider) {
	if (!provider) return false;
	if ((cfg.models?.providers?.[provider]?.models?.length ?? 0) > 0) return true;
	const providerPrefix = `${provider}/`;
	return Object.keys(cfg.agents?.defaults?.models ?? {}).some((key) => key.trim().startsWith(providerPrefix));
}
function hasStaticManifestCatalogRows(cfg, provider) {
	if (!provider) return false;
	return loadStaticManifestCatalogRowsForList({
		cfg,
		providerFilter: provider
	}).length > 0;
}
function listConfiguredModelProviders(cfg) {
	return Object.entries(cfg.models?.providers ?? {}).filter(([, provider]) => (provider.models?.length ?? 0) > 0).map(([provider]) => provider);
}
function resolveSingleConfiguredProvider(cfg) {
	const configuredProviders = listConfiguredModelProviders(cfg);
	return configuredProviders.length === 1 ? configuredProviders[0] : void 0;
}
function resolveProviderFromModelRef(model) {
	const trimmed = model?.trim();
	const slashIndex = trimmed?.indexOf("/") ?? -1;
	return slashIndex > 0 ? trimmed?.slice(0, slashIndex) : void 0;
}
function resolveCanonicalOpenAISelectionForLegacyCodexPrimary(cfg, target, selectedModels) {
	const currentModel = resolveMutableAgentEntry(cfg, target.agentId)?.model ?? cfg.agents?.defaults?.model;
	const primary = typeof currentModel === "string" ? currentModel.trim() : currentModel && typeof currentModel === "object" && typeof currentModel.primary === "string" ? currentModel.primary.trim() : void 0;
	const modelId = primary?.startsWith("codex/") ? primary.slice(6).trim() : "";
	if (!modelId) return;
	const canonical = `openai/${modelId}`;
	return selectedModels.find((model) => model.trim() === canonical);
}
function resolveConfiguredProviderFromAuthChange(params) {
	if (hasConfiguredProviderModels(params.after, params.preferredProvider)) return params.preferredProvider;
	const beforeProviders = params.before.models?.providers ?? {};
	const configuredProviders = listConfiguredModelProviders(params.after);
	const changedProviders = configuredProviders.filter((provider) => {
		const beforeCount = beforeProviders[provider]?.models?.length ?? 0;
		return (params.after.models?.providers?.[provider]?.models?.length ?? 0) > beforeCount;
	});
	if (changedProviders.length === 1) return changedProviders[0];
	return params.preferredProvider ?? (configuredProviders.length === 1 ? configuredProviders[0] : void 0);
}
/** Build gateway auth config, preserving Tailscale allowance and generating missing tokens. */
function buildGatewayAuthConfig(params) {
	const allowTailscale = params.existing?.allowTailscale;
	const base = {};
	if (typeof allowTailscale === "boolean") base.allowTailscale = allowTailscale;
	if (params.mode === "token") {
		if (isSecretRef(params.token)) return {
			...base,
			mode: "token",
			token: params.token
		};
		const token = sanitizeTokenValue(params.token) ?? randomToken();
		return {
			...base,
			mode: "token",
			token
		};
	}
	if (params.mode === "password") {
		const password = params.password?.trim();
		return {
			...base,
			mode: "password",
			...password && { password }
		};
	}
	if (params.mode === "trusted-proxy") {
		if (!params.trustedProxy) throw new Error(`trustedProxy config is required when mode is trusted-proxy. Run ${formatCliCommand("openclaw configure --section gateway")} to configure Gateway auth interactively.`);
		return {
			...base,
			mode: "trusted-proxy",
			trustedProxy: params.trustedProxy
		};
	}
	return base;
}
/** Prompt for model provider credentials and explicit default model policy settings. */
async function promptAuthConfig(cfg, runtime, prompter, target = resolveOnboardingAgentTarget(cfg)) {
	let next = cfg;
	let authChoice = "skip";
	let preferredProvider;
	while (true) {
		authChoice = await promptAuthChoiceGrouped({
			prompter,
			store: ensureAuthProfileStore(target.agentDir, { allowKeychainPrompt: false }),
			includeSkip: true,
			config: next
		});
		preferredProvider = authChoice === "skip" ? void 0 : await resolvePreferredProviderForAuthChoice({
			choice: authChoice,
			config: next
		});
		if (authChoice === "custom-api-key") {
			next = (await promptCustomApiConfig({
				prompter,
				runtime,
				config: next,
				target,
				setAsPrimary: !resolveAgentEffectiveModelPrimary(next, target.agentId)
			})).config;
			break;
		}
		if (authChoice === "skip") {
			const modelSelection = await promptDefaultModel({
				config: next,
				prompter,
				allowKeep: true,
				ignoreAllowlist: true,
				includeProviderPluginSetups: false,
				loadCatalog: true,
				browseCatalogOnDemand: true,
				preferredProvider,
				agentId: target.agentId,
				agentDir: target.agentDir,
				workspaceDir: target.workspaceDir,
				runtime
			});
			if (modelSelection.config) next = modelSelection.config;
			if (modelSelection.model) {
				next = applyOnboardingPrimaryModel(next, target, modelSelection.model);
				preferredProvider = resolveProviderFromModelRef(modelSelection.model) ?? preferredProvider;
			}
			break;
		}
		const beforeAuthConfig = next;
		const applied = await applyAuthChoice({
			authChoice,
			config: next,
			prompter,
			runtime,
			agentId: target.agentId,
			agentDir: target.agentDir,
			setDefaultModel: false,
			preserveExistingDefaultModel: true
		});
		next = applied.config;
		if (applied.agentModelOverride) {
			const targeted = applyOnboardingPrimaryModel(next, target, applied.agentModelOverride);
			next = {
				...targeted,
				agents: {
					...targeted.agents,
					...beforeAuthConfig.agents?.defaults === void 0 ? { defaults: void 0 } : { defaults: beforeAuthConfig.agents.defaults }
				}
			};
		}
		preferredProvider = resolveConfiguredProviderFromAuthChange({
			before: beforeAuthConfig,
			after: next,
			preferredProvider
		});
		if (applied.retrySelection) continue;
		break;
	}
	if (authChoice !== "custom-api-key") {
		const modelPrompt = await resolveProviderChoiceModelPrompt({
			authChoice,
			config: next,
			workspaceDir: target.workspaceDir,
			env: process.env
		});
		const promptProvider = modelPrompt?.provider ?? preferredProvider ?? resolveSingleConfiguredProvider(next);
		const hasPromptProviderConfiguredModels = hasConfiguredProviderModels(next, promptProvider);
		const hasPromptProviderStaticManifestRows = hasStaticManifestCatalogRows(next, promptProvider);
		const shouldLoadModelCatalog = modelPrompt?.loadCatalog ?? (hasPromptProviderConfiguredModels || hasPromptProviderStaticManifestRows);
		const useProviderScopedCatalog = Boolean(promptProvider && shouldLoadModelCatalog && (modelPrompt?.loadCatalog === true || hasPromptProviderConfiguredModels));
		const allowlistSelection = await promptModelAllowlist({
			config: next,
			prompter,
			agentId: target.agentId,
			agentDir: target.agentDir,
			workspaceDir: target.workspaceDir,
			env: process.env,
			allowedKeys: modelPrompt?.allowedKeys,
			initialSelections: modelPrompt?.initialSelections,
			message: modelPrompt?.message,
			preferredProvider: promptProvider,
			providerScopedCatalog: useProviderScopedCatalog,
			loadCatalog: shouldLoadModelCatalog
		});
		if (allowlistSelection.models) {
			const selectedModels = allowlistSelection.models;
			const canonicalPrimary = resolveCanonicalOpenAISelectionForLegacyCodexPrimary(next, target, selectedModels);
			if (canonicalPrimary) next = applyOnboardingPrimaryModel(next, target, canonicalPrimary);
			next = applyAgentModelDefaults(next, target, (projected) => applyModelAllowlist(applyModelFallbacksFromSelection(projected, selectedModels, { scopeKeys: allowlistSelection.scopeKeys }), selectedModels, { scopeKeys: allowlistSelection.scopeKeys }));
		}
	}
	return next;
}
//#endregion
//#region src/commands/configure.gateway.ts
function validateGatewayPortInput$1(value) {
	if (parsePort(value) === null) return formatPortRangeHint();
}
/** Prompt for local Gateway network/auth settings and return config plus call token. */
async function promptGatewayConfig(cfg, runtime) {
	const port = parsePort(guardCancel(await text({
		message: "Gateway port",
		initialValue: String(resolveGatewayPort(cfg)),
		validate: validateGatewayPortInput$1
	}), runtime, 1)) ?? resolveGatewayPort(cfg);
	let bind = guardCancel(await select({
		message: "Gateway bind mode",
		options: [
			{
				value: "loopback",
				label: "Loopback (Local only)",
				hint: "Bind to 127.0.0.1 - secure, local-only access"
			},
			{
				value: "tailnet",
				label: "Tailnet (Tailscale IP)",
				hint: "Bind to your Tailscale IP plus local loopback"
			},
			{
				value: "auto",
				label: "Auto (Loopback → LAN)",
				hint: "Prefer loopback; fall back to all interfaces if unavailable"
			},
			{
				value: "lan",
				label: "LAN (All interfaces)",
				hint: "Bind to 0.0.0.0 - accessible from anywhere on your network"
			},
			{
				value: "custom",
				label: "Custom IP",
				hint: "Specific IPv4s also bind 127.0.0.1"
			}
		]
	}), runtime, 1);
	let customBindHost;
	if (bind === "custom") customBindHost = readStringValue(guardCancel(await text({
		message: "Custom IP address",
		placeholder: "192.168.1.100",
		validate: validateDottedDecimalIPv4Input
	}), runtime, 1));
	let authMode = guardCancel(await select({
		message: "Gateway access protection",
		options: [
			{
				value: "token",
				label: "Token (recommended)",
				hint: "Recommended default"
			},
			{
				value: "password",
				label: "Password"
			},
			{
				value: "trusted-proxy",
				label: "Trusted Proxy",
				hint: "Behind reverse proxy (Pomerium, Caddy, Traefik, etc.)"
			}
		],
		initialValue: "token"
	}), runtime, 1);
	let tailscaleMode = guardCancel(await select({
		message: "Tailscale exposure",
		options: [...TAILSCALE_EXPOSURE_OPTIONS]
	}), runtime, 1);
	let tailscaleBin = null;
	if (tailscaleMode !== "off") {
		tailscaleBin = await findTailscaleBinary();
		if (!tailscaleBin) note(TAILSCALE_MISSING_BIN_NOTE_LINES.join("\n"), "Tailscale Warning");
	}
	if (tailscaleMode !== "off") note(TAILSCALE_DOCS_LINES.join("\n"), "Tailscale");
	if (tailscaleMode !== "off" && bind !== "loopback") {
		note("Tailscale requires bind=loopback. Adjusting bind to loopback.", "Note");
		bind = "loopback";
	}
	if (tailscaleMode === "funnel" && authMode !== "password") {
		note("Tailscale funnel requires password auth.", "Note");
		authMode = "password";
	}
	if (authMode === "trusted-proxy" && tailscaleMode !== "off") {
		note("Trusted proxy auth is incompatible with Tailscale serve/funnel. Disabling Tailscale.", "Note");
		tailscaleMode = "off";
	}
	let gatewayToken;
	let gatewayTokenForCalls;
	let gatewayPassword;
	let trustedProxyConfig;
	let trustedProxies;
	let next = cfg;
	if (authMode === "token") if (guardCancel(await select({
		message: "Gateway token source",
		options: [{
			value: "plaintext",
			label: "Generate/store plaintext token",
			hint: "Default"
		}, {
			value: "ref",
			label: "Use SecretRef",
			hint: "Store an env-backed reference instead of plaintext"
		}],
		initialValue: "plaintext"
	}), runtime, 1) === "ref") {
		const envVarName = normalizeOptionalString(guardCancel(await text({
			message: "Gateway token env var",
			initialValue: "OPENCLAW_GATEWAY_TOKEN",
			placeholder: "OPENCLAW_GATEWAY_TOKEN",
			validate: (value) => {
				const candidate = normalizeOptionalString(value) ?? "";
				if (!isValidEnvSecretRefId(candidate)) return "Use an env var name like OPENCLAW_GATEWAY_TOKEN.";
				if (!process.env[candidate]?.trim()) return `Environment variable "${candidate}" is missing or empty in this session.`;
			}
		}), runtime, 1)) ?? "";
		gatewayToken = {
			source: "env",
			provider: resolveDefaultSecretProviderAlias(cfg, "env", { preferFirstProviderForSource: true }),
			id: envVarName
		};
		note(`Validated ${envVarName}. OpenClaw will store a token SecretRef.`, "Gateway token");
	} else {
		gatewayTokenForCalls = normalizeGatewayTokenInput(guardCancel(await password({ message: "Gateway token (blank to generate)" }), runtime, 1)) || randomToken();
		gatewayToken = gatewayTokenForCalls;
	}
	if (authMode === "password") gatewayPassword = normalizeOptionalString(guardCancel(await password({
		message: "Gateway password",
		validate: validateGatewayPasswordInput
	}), runtime, 1)) ?? "";
	if (authMode === "trusted-proxy") {
		note([
			"Trusted proxy mode: OpenClaw trusts user identity from a reverse proxy.",
			"The proxy must authenticate users and pass identity via headers.",
			"Only requests from specified proxy IPs will be trusted.",
			"",
			"Common use cases: Pomerium, Caddy + OAuth, Traefik + forward auth",
			"Docs: https://docs.openclaw.ai/gateway/trusted-proxy-auth"
		].join("\n"), "Trusted Proxy Auth");
		const userHeader = guardCancel(await text({
			message: "Header containing user identity",
			placeholder: "x-forwarded-user",
			initialValue: "x-forwarded-user",
			validate: (value) => value?.trim() ? void 0 : "User header is required"
		}), runtime, 1);
		const requiredHeadersRaw = guardCancel(await text({
			message: "Required headers (comma-separated, optional)",
			placeholder: "x-forwarded-proto,x-forwarded-host"
		}), runtime, 1);
		const requiredHeaders = requiredHeadersRaw ? normalizeStringEntries(requiredHeadersRaw.split(",")) : [];
		const allowUsersRaw = guardCancel(await text({
			message: "Allowed users (comma-separated, blank = all authenticated users)",
			placeholder: "nick@example.com,admin@company.com"
		}), runtime, 1);
		const allowUsers = allowUsersRaw ? normalizeStringEntries(allowUsersRaw.split(",")) : [];
		trustedProxies = normalizeStringEntries(guardCancel(await text({
			message: "Trusted proxy IPs (comma-separated)",
			placeholder: "10.0.1.10,192.168.1.5",
			validate: (value) => {
				if (!normalizeOptionalString(value)) return "At least one trusted proxy IP is required";
			}
		}), runtime, 1).split(","));
		trustedProxyConfig = {
			userHeader: normalizeOptionalString(userHeader) ?? "",
			requiredHeaders: requiredHeaders.length > 0 ? requiredHeaders : void 0,
			allowUsers: allowUsers.length > 0 ? allowUsers : void 0
		};
	}
	const authConfig = buildGatewayAuthConfig({
		existing: next.gateway?.auth,
		mode: authMode,
		token: gatewayToken,
		password: gatewayPassword,
		trustedProxy: trustedProxyConfig
	});
	next = {
		...next,
		gateway: {
			...next.gateway,
			mode: "local",
			port,
			bind,
			auth: authConfig,
			...customBindHost && { customBindHost },
			...trustedProxies && { trustedProxies },
			tailscale: {
				...next.gateway?.tailscale,
				mode: tailscaleMode
			}
		}
	};
	next = await maybeAddTailnetOriginToControlUiAllowedOrigins({
		config: next,
		tailscaleMode,
		tailscaleBin
	});
	return {
		config: next,
		port,
		token: gatewayTokenForCalls
	};
}
//#endregion
//#region src/commands/configure.wizard.ts
const GATEWAY_HINT_PROBE_TIMEOUT_MS = 300;
const setupPluginConfigModuleLoader = createLazyImportLoader(() => import("./setup.plugin-config-DjDP83Sa.js"));
function validateGatewayPortInput(value) {
	if (parsePort(value) === null) return formatPortRangeHint();
}
function loadSetupPluginConfigModule() {
	return setupPluginConfigModuleLoader.load();
}
async function runGatewayHealthCheck(params) {
	const localLinks = resolveLocalControlUiProbeLinks({
		bind: params.cfg.gateway?.bind ?? "loopback",
		port: params.port,
		customBindHost: params.cfg.gateway?.customBindHost,
		basePath: void 0,
		tlsEnabled: params.cfg.gateway?.tls?.enabled === true
	});
	const remoteUrl = params.cfg.gateway?.remote?.url?.trim();
	const remoteWsUrl = params.cfg.gateway?.mode === "remote" ? remoteUrl : void 0;
	const probeMode = remoteWsUrl ? "remote" : "local";
	const wsUrl = remoteWsUrl ?? localLinks.wsUrl;
	let token;
	let password;
	if (probeMode === "remote") {
		const remoteProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: params.cfg,
			env: process.env,
			mode: "remote"
		});
		if (remoteProbeAuth.warning) {
			const hasResolvedRemoteAuth = Boolean(remoteProbeAuth.auth.token || remoteProbeAuth.auth.password);
			note([
				"Could not resolve remote gateway SecretRef for health check.",
				remoteProbeAuth.warning,
				...hasResolvedRemoteAuth ? ["Continuing with the other configured remote credential."] : ["Health check skipped to avoid falling back to ambient credentials.", `Fix the SecretRef, then run \`${formatCliCommand("openclaw health")}\` again.`]
			].join("\n"), "Gateway auth");
			if (!hasResolvedRemoteAuth) return "skipped";
		}
		({token, password} = remoteProbeAuth.auth);
	} else {
		const localProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: params.cfg,
			env: process.env,
			mode: "local",
			localPrecedence: "env-first"
		});
		if (localProbeAuth.warning) {
			note([
				"Could not resolve local gateway SecretRef for health check.",
				localProbeAuth.warning,
				"Health check skipped to avoid falling back to ambient credentials.",
				`Fix the SecretRef, then run \`${formatCliCommand("openclaw health")}\` again.`
			].join("\n"), "Gateway auth");
			return "skipped";
		}
		({token, password} = localProbeAuth.auth);
	}
	try {
		const gatewayProbe = await waitForGatewayReachable({
			url: wsUrl,
			token,
			password,
			...params.daemonSetupOutcome === "succeeded" ? resolveGatewayStartupTiming() : { deadlineMs: 15e3 }
		});
		if (!gatewayProbe.ok) throw new Error(gatewayProbe.detail ?? `gateway did not become reachable at ${wsUrl}`);
		await healthCommandNonExiting({
			json: false,
			timeoutMs: 1e4,
			config: params.cfg,
			token,
			password,
			...probeMode === "local" ? { localPortOverride: params.port } : { ignoreEnvUrlOverride: true }
		}, params.runtime);
	} catch (err) {
		if (!(err instanceof ExitError)) params.runtime.error(formatHealthCheckFailure(err));
		note([
			"Docs:",
			"https://docs.openclaw.ai/gateway/health",
			"https://docs.openclaw.ai/gateway/troubleshooting"
		].join("\n"), "Health check help");
		return "failed";
	}
	return "succeeded";
}
async function promptConfigureSection(runtime, hasSelection) {
	return guardCancel(await select({
		message: "What do you want to configure?",
		options: [...CONFIGURE_SECTION_OPTIONS, {
			value: "__continue",
			label: hasSelection ? "Done" : "Skip for now"
		}],
		initialValue: CONFIGURE_SECTION_OPTIONS[0]?.value
	}), runtime, 1);
}
async function promptChannelMode(runtime) {
	return guardCancel(await select({
		message: "Channel setup",
		options: [{
			value: "configure",
			label: "Add or update channels",
			hint: "Configure accounts and disable unselected accounts"
		}, {
			value: "remove",
			label: "Remove channel config",
			hint: "Delete channel tokens/settings from openclaw.json"
		}],
		initialValue: "configure"
	}), runtime, 1);
}
async function promptWebToolsConfig(nextConfig, runtime, prompter) {
	const existingSearch = nextConfig.tools?.web?.search;
	const existingFetch = nextConfig.tools?.web?.fetch;
	const { isCodexNativeWebSearchRelevant } = await import("./codex-native-web-search-KyKgWQKP.js");
	const hasManagedSearchProviders = resolvePluginContributionOwners({
		config: nextConfig,
		contribution: "contracts",
		matches: "webSearchProviders"
	}).length > 0;
	note([
		"Web search lets your agent look things up online using the `web_search` tool.",
		"Codex-capable models can use native Codex web search.",
		"Other models use a separate web search provider, which you can configure here.",
		"Docs: https://docs.openclaw.ai/tools/web"
	].join("\n"), "Web search");
	const enableSearch = guardCancel(await confirm({
		message: "Enable the web_search tool?",
		initialValue: existingSearch?.enabled ?? hasManagedSearchProviders
	}), runtime, 1);
	let nextSearch = {
		...existingSearch,
		enabled: enableSearch
	};
	let workingConfig = nextConfig;
	if (enableSearch) {
		const codexRelevant = isCodexNativeWebSearchRelevant({ config: nextConfig });
		let configureManagedProvider = true;
		if (codexRelevant) {
			note([
				"Codex-capable models can use native Codex web search instead of a separate provider.",
				"Other models need a separate web search provider.",
				"If you do not choose one, OpenClaw can select a provider from available credentials; otherwise other models may not have web search.",
				...describeCodexNativeWebSearch(nextConfig) ? [describeCodexNativeWebSearch(nextConfig)] : []
			].join("\n"), "Codex native search");
			if (guardCancel(await confirm({
				message: "Enable native Codex web search for Codex-capable models?",
				initialValue: existingSearch?.openaiCodex?.enabled === true
			}), runtime, 1)) {
				const codexMode = guardCancel(await select({
					message: "Native Codex web search mode",
					options: [{
						value: "cached",
						label: "cached (recommended)",
						hint: "Uses cached web content"
					}, {
						value: "live",
						label: "live",
						hint: "Allows live external web access"
					}],
					initialValue: existingSearch?.openaiCodex?.mode ?? "cached"
				}), runtime, 1);
				nextSearch = {
					...nextSearch,
					openaiCodex: {
						...existingSearch?.openaiCodex,
						enabled: true,
						mode: codexMode
					}
				};
				configureManagedProvider = guardCancel(await confirm({
					message: existingSearch?.provider ? `Change the separate web search provider (currently ${existingSearch.provider})?` : "Also configure a separate web search provider for other models?",
					initialValue: Boolean(existingSearch?.provider)
				}), runtime, 1);
			} else nextSearch = {
				...nextSearch,
				openaiCodex: {
					...existingSearch?.openaiCodex,
					enabled: false
				}
			};
		}
		if (configureManagedProvider) {
			const { resolveSearchProviderOptions, runSearchSetupFlow } = await import("./search-setup-CRmju6UE.js");
			if (resolveSearchProviderOptions(nextConfig).length === 0) {
				note([
					"No web search providers are currently available under this plugin policy.",
					"Enable plugins or remove deny rules, then rerun configure.",
					"Docs: https://docs.openclaw.ai/tools/web"
				].join("\n"), "Web search");
				if (nextSearch.openaiCodex?.enabled !== true) nextSearch = {
					...existingSearch,
					enabled: false
				};
			} else {
				workingConfig = (await runSearchSetupFlow(workingConfig, runtime, prompter, { preserveDisabledSearchState: false })).config;
				const selectedSearch = workingConfig.tools?.web?.search;
				nextSearch = {
					...selectedSearch,
					enabled: selectedSearch?.enabled ?? (selectedSearch?.provider ? true : existingSearch?.enabled),
					openaiCodex: {
						...existingSearch?.openaiCodex,
						...nextSearch.openaiCodex
					}
				};
			}
		}
	}
	note(["`web_fetch` is a separate tool for reading a specific URL.", "It does not require an API key and works independently of web search providers, including Codex."].join("\n"), "Web fetch");
	const enableFetch = guardCancel(await confirm({
		message: "Enable the web_fetch tool?",
		initialValue: existingFetch?.enabled ?? true
	}), runtime, 1);
	const nextFetch = {
		...workingConfig.tools?.web?.fetch,
		enabled: enableFetch
	};
	return {
		...workingConfig,
		tools: {
			...workingConfig.tools,
			web: {
				...workingConfig.tools?.web,
				search: nextSearch,
				fetch: nextFetch
			}
		}
	};
}
/** Run the configure/update wizard, optionally limited to selected sections. */
async function runConfigureWizard(opts, runtime = defaultRuntime) {
	try {
		intro(opts.command === "update" ? "OpenClaw update wizard" : "OpenClaw configure");
		const prompter = createClackPrompter();
		const prepared = await readConfigFileSnapshotForWrite();
		const snapshot = prepared.snapshot;
		const configWriteOwnership = {
			...prepared.writeOptions.assertConfigPathForWrite ? { assertConfigPathForWrite: prepared.writeOptions.assertConfigPathForWrite } : {},
			expectedConfigPath: prepared.writeOptions.expectedConfigPath,
			ownedConfigPathForWrite: prepared.writeOptions.ownedConfigPathForWrite
		};
		const currentBaseHash = snapshot.hash;
		const baseConfig = snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
		if (snapshot.exists) {
			const title = snapshot.valid ? "Existing config detected" : "Invalid config";
			note(summarizeExistingConfig(baseConfig), title);
			if (!snapshot.valid && snapshot.issues.length > 0) note([
				...snapshot.issues.map((iss) => `- ${iss.path}: ${iss.message}`),
				"",
				"Docs: https://docs.openclaw.ai/gateway/configuration"
			].join("\n"), "Config issues");
			if (!snapshot.valid) {
				outro(`Config invalid. Run \`${formatCliCommand("openclaw doctor")}\` to repair it, then re-run configure.`);
				runtime.exit(1);
				return;
			}
		}
		const selectedSections = opts.sections;
		const shouldPromptGatewayRunMode = !selectedSections || selectedSections.includes("gateway") || selectedSections.includes("daemon") || selectedSections.includes("health");
		const promptGatewayRunMode = async () => {
			const localUrl = `ws://127.0.0.1:${resolveGatewayPort(baseConfig)}`;
			const remoteUrl = normalizeOptionalString(baseConfig.gateway?.remote?.url) ?? "";
			const localProbePromise = (async () => {
				const localProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
					cfg: baseConfig,
					env: process.env,
					mode: "local",
					localPrecedence: "env-first"
				});
				if (localProbeAuth.warning) return {
					ok: false,
					authUnavailable: true
				};
				return probeGatewayReachable({
					url: localUrl,
					token: localProbeAuth.auth.token,
					password: localProbeAuth.auth.password,
					timeoutMs: GATEWAY_HINT_PROBE_TIMEOUT_MS
				});
			})();
			const remoteProbePromise = remoteUrl ? (async () => {
				const remoteProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
					cfg: baseConfig,
					env: process.env,
					mode: "remote"
				});
				return probeGatewayReachable({
					url: remoteUrl,
					...baseConfig.gateway?.remote?.edgeAuth ? { config: baseConfig } : {},
					token: remoteProbeAuth.auth.token,
					...remoteProbeAuth.auth.password ? { password: remoteProbeAuth.auth.password } : {},
					timeoutMs: GATEWAY_HINT_PROBE_TIMEOUT_MS
				});
			})() : Promise.resolve(null);
			const [localProbe, remoteProbe] = await Promise.all([localProbePromise, remoteProbePromise]);
			return guardCancel(await select({
				message: "Where will the Gateway run?",
				options: [{
					value: "local",
					label: "Local (this machine)",
					hint: localProbe.ok ? `Gateway reachable (${localUrl})` : "authUnavailable" in localProbe ? `Gateway auth unavailable; probe skipped (${localUrl})` : `No gateway detected (${localUrl})`
				}, {
					value: "remote",
					label: "Remote (info-only)",
					hint: !remoteUrl ? "No remote URL configured yet" : remoteProbe?.ok ? `Gateway reachable (${remoteUrl})` : `Configured but unreachable (${remoteUrl})`
				}]
			}), runtime, 1);
		};
		const mode = shouldPromptGatewayRunMode ? await promptGatewayRunMode() : "local";
		const metadataMode = shouldPromptGatewayRunMode || baseConfig.gateway?.mode !== "remote" ? mode : "remote";
		const shouldSkipGatewaySummary = !shouldPromptGatewayRunMode;
		if (shouldPromptGatewayRunMode && mode === "remote") {
			let remoteConfig = await promptRemoteGatewayConfig(baseConfig, prompter);
			remoteConfig = applyWizardMetadata(remoteConfig, {
				command: opts.command,
				mode: metadataMode
			});
			remoteConfig = (await commitConfigWithPendingPluginInstalls({
				nextConfig: remoteConfig,
				...currentBaseHash !== void 0 ? { baseHash: currentBaseHash } : {},
				writeOptions: configWriteOwnership
			})).config;
			logConfigUpdated(runtime);
			if (selectedSections?.includes("health")) {
				const healthCheckOutcome = await runGatewayHealthCheck({
					cfg: remoteConfig,
					runtime,
					port: resolveGatewayPort(remoteConfig)
				});
				outro(healthCheckOutcome === "succeeded" ? "Remote gateway configured and health check completed." : healthCheckOutcome === "failed" ? "Remote gateway configured, but health check failed." : "Remote gateway configured; health check skipped.");
			} else outro("Remote gateway configured.");
			return;
		}
		let nextConfig = { ...baseConfig };
		let mergeBaseConfig = structuredClone(baseConfig);
		let hasPendingConfig = shouldPromptGatewayRunMode && nextConfig.gateway?.mode !== "local";
		if (hasPendingConfig) nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				mode: "local"
			}
		};
		const resolveSetupTarget = () => nextConfig.agents?.ownership === "explicit" ? resolveSystemAgentOnboardingTarget(nextConfig) : resolveOnboardingAgentTarget(inheritLegacyDefaultAgentId(baseConfig, nextConfig));
		let workspaceDir = resolveSetupTarget().workspaceDir;
		let gatewayPort = resolveGatewayPort(baseConfig);
		let didPersistConfig = false;
		let daemonSetupOutcome;
		let healthCheckOutcome;
		const channelSetup = createChannelSetupTransaction({ runtime });
		const persistPendingConfig = async () => {
			if (!hasPendingConfig) return;
			nextConfig = applyWizardMetadata(nextConfig, {
				command: opts.command,
				mode: metadataMode
			});
			nextConfig = await channelSetup.commit(nextConfig, async (configToCommit) => {
				const committedConfig = await writeWizardConfigFile(configToCommit, {
					mergeBase: mergeBaseConfig,
					writeOptions: configWriteOwnership
				});
				mergeBaseConfig = structuredClone(committedConfig);
				return committedConfig;
			});
			hasPendingConfig = false;
			didPersistConfig = true;
			logConfigUpdated(runtime);
		};
		const configureWorkspace = async () => {
			workspaceDir = resolveUserPath(normalizeOptionalString(guardCancel(await text({
				message: "Workspace directory",
				initialValue: workspaceDir
			}), runtime, 1) ?? "") || DEFAULT_WORKSPACE);
			if (!snapshot.exists) {
				const indicators = [
					"MEMORY.md",
					"memory",
					".git"
				].map((name) => path.join(workspaceDir, name));
				if ((await Promise.all(indicators.map(async (candidate) => {
					try {
						await fs.access(candidate);
						return true;
					} catch {
						return false;
					}
				}))).some(Boolean)) note([`Existing workspace detected at ${workspaceDir}`, "Existing files are preserved. Missing templates may be created, never overwritten."].join("\n"), "Existing workspace");
			}
			const target = resolveSetupTarget();
			const authoredEntryKey = Object.keys(nextConfig.agents?.entries ?? {}).find((key) => normalizeAgentId(key) === target.agentId);
			const targetEntry = authoredEntryKey ? nextConfig.agents?.entries?.[authoredEntryKey] : void 0;
			nextConfig = targetEntry?.workspace !== void 0 || nextConfig.agents?.ownership === "explicit" && targetEntry !== void 0 ? {
				...nextConfig,
				agents: {
					...nextConfig.agents,
					entries: {
						...nextConfig.agents?.entries,
						[authoredEntryKey ?? target.agentId]: {
							...targetEntry,
							workspace: workspaceDir
						}
					}
				}
			} : {
				...nextConfig,
				agents: {
					...nextConfig.agents,
					defaults: {
						...nextConfig.agents?.defaults,
						workspace: workspaceDir
					}
				}
			};
		};
		const provisionWorkspace = async () => {
			await ensureOnboardingAgentWorkspace(resolveSetupTarget(), runtime, {
				skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
				skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
			});
		};
		const configureChannelsSection = async () => {
			if (await promptChannelMode(runtime) === "configure") nextConfig = await setupChannels(nextConfig, runtime, prompter, {
				allowDisable: true,
				allowIMessageInstall: true,
				allowSignalInstall: true,
				deferStatusUntilSelection: true,
				skipConfirm: true,
				skipStatusNote: true,
				onPostWriteHook: channelSetup.onPostWriteHook
			});
			else nextConfig = await removeChannelConfigWizard(nextConfig, runtime);
		};
		const promptDaemonPort = async () => {
			gatewayPort = parsePort(guardCancel(await text({
				message: "Gateway port for service install",
				initialValue: String(gatewayPort),
				validate: validateGatewayPortInput
			}), runtime, 1)) ?? gatewayPort;
		};
		let didConfigureGateway = false;
		const sectionActions = {
			workspace: async () => {
				await configureWorkspace();
				await provisionWorkspace();
			},
			model: async () => {
				nextConfig = await promptAuthConfig(nextConfig, runtime, prompter, resolveSetupTarget());
			},
			web: async () => {
				nextConfig = await promptWebToolsConfig(nextConfig, runtime, prompter);
			},
			gateway: async () => {
				const gateway = await promptGatewayConfig(nextConfig, runtime);
				nextConfig = gateway.config;
				gatewayPort = gateway.port;
				didConfigureGateway = true;
			},
			channels: configureChannelsSection,
			plugins: async () => {
				const { configurePluginConfig } = await loadSetupPluginConfigModule();
				nextConfig = await configurePluginConfig({
					config: nextConfig,
					prompter,
					workspaceDir: resolveSetupTarget().workspaceDir
				});
			},
			skills: async () => {
				nextConfig = await setupSkills(nextConfig, resolveSetupTarget().workspaceDir, runtime, prompter);
			},
			daemon: async () => {
				if (!didConfigureGateway) await promptDaemonPort();
				daemonSetupOutcome = await maybeInstallDaemon({
					runtime,
					port: gatewayPort
				});
			},
			health: async () => {
				healthCheckOutcome = await runGatewayHealthCheck({
					cfg: nextConfig,
					runtime,
					port: gatewayPort,
					daemonSetupOutcome
				});
			}
		};
		if (selectedSections) {
			if (selectedSections.length === 0) {
				outro("No configuration changes selected.");
				return;
			}
			for (const section of [
				"workspace",
				"model",
				"web",
				"gateway",
				"channels",
				"plugins",
				"skills"
			]) if (selectedSections.includes(section)) {
				await sectionActions[section]();
				hasPendingConfig = true;
			}
			await persistPendingConfig();
			for (const section of ["daemon", "health"]) if (selectedSections.includes(section)) await sectionActions[section]();
		} else {
			let ranSection = false;
			while (true) {
				const choice = await promptConfigureSection(runtime, ranSection);
				if (choice === "__continue") break;
				ranSection = true;
				if (choice === "daemon" || choice === "health") await persistPendingConfig();
				await sectionActions[choice]();
				if (choice !== "daemon" && choice !== "health") {
					hasPendingConfig = true;
					await persistPendingConfig();
				}
			}
			if (!ranSection) {
				if (hasPendingConfig) {
					await persistPendingConfig();
					outro("Gateway mode set to local.");
					return;
				}
				outro("No configuration changes selected.");
				return;
			}
		}
		const failedSideEffects = [...daemonSetupOutcome === "failed" ? ["daemon setup"] : [], ...healthCheckOutcome === "failed" ? ["health check"] : []];
		let completionMessage = didPersistConfig ? "Configuration updated." : "No configuration changes selected.";
		if (failedSideEffects.length > 0) completionMessage = `${didPersistConfig ? "Configuration updated" : "Configuration unchanged"}, but ${failedSideEffects.join(" and ")} failed.`;
		else if (!didPersistConfig && healthCheckOutcome) completionMessage = `Health check ${healthCheckOutcome === "succeeded" ? "completed" : "skipped"}.`;
		else if (!didPersistConfig && daemonSetupOutcome) completionMessage = `Daemon setup ${daemonSetupOutcome === "succeeded" ? "completed" : "skipped"}.`;
		if (shouldSkipGatewaySummary) {
			const remoteUrl = normalizeOptionalString(nextConfig.gateway?.remote?.url);
			if (remoteUrl) note([
				"Remote Gateway:",
				remoteUrl,
				"Docs: https://docs.openclaw.ai/gateway/remote"
			].join("\n"), "Gateway");
			outro(completionMessage);
			return;
		}
		const bind = nextConfig.gateway?.bind ?? "loopback";
		const displayLinks = await resolveAdvertisedControlUiLinks({
			bind,
			port: gatewayPort,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: nextConfig.gateway?.controlUi?.basePath,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const probeLinks = resolveLocalControlUiProbeLinks({
			bind,
			port: gatewayPort,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: nextConfig.gateway?.controlUi?.basePath,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const probeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: nextConfig,
			env: process.env,
			mode: "local",
			localPrecedence: "env-first"
		});
		const probe = daemonSetupOutcome === "succeeded" ? waitForGatewayReachable : probeGatewayReachable;
		let gatewayProbe = probeAuth.warning ? {
			ok: false,
			detail: "auth unavailable; probe skipped"
		} : await probe({
			...daemonSetupOutcome === "succeeded" ? resolveGatewayStartupTiming() : {},
			url: probeLinks.wsUrl,
			token: probeAuth.auth.token,
			password: probeAuth.auth.password
		});
		if (!gatewayProbe.ok && !probeAuth.warning && baseConfig.gateway?.auth?.password) {
			const oldProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
				cfg: baseConfig,
				env: process.env,
				mode: "local",
				localPrecedence: "env-first"
			});
			if (!oldProbeAuth.warning && oldProbeAuth.auth.password && probeAuth.auth.password !== oldProbeAuth.auth.password) gatewayProbe = await probeGatewayReachable({
				url: probeLinks.wsUrl,
				token: probeAuth.auth.token,
				password: oldProbeAuth.auth.password
			});
		}
		const gatewayStatusLine = probeAuth.warning ? "Gateway: auth unavailable (probe skipped)" : gatewayProbe.ok ? "Gateway: reachable" : `Gateway: not detected${gatewayProbe.detail ? ` (${gatewayProbe.detail})` : ""}`;
		const windowsFirewallLines = formatWindowsGatewayFirewallGuidance({ bind });
		note([
			`Web UI: ${displayLinks.httpUrl}`,
			`Gateway WS: ${displayLinks.wsUrl}`,
			gatewayStatusLine,
			...windowsFirewallLines,
			"Docs: https://docs.openclaw.ai/web/control-ui"
		].join("\n"), "Control UI");
		outro(completionMessage);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
//#endregion
//#region src/commands/configure.commands.ts
/**
* Non-interactive config subcommands surfaced when the wizard cannot run.
* Mirrors the real `openclaw config <sub>` surface so the message only ever
* points users at commands that exist (see `src/cli/config-cli.ts`).
*/
const CONFIGURE_NON_TTY_HINT = [
	"Interactive configuration requires an interactive terminal (TTY).",
	"For non-interactive setup, use these subcommands instead:",
	`  ${formatCliCommand("openclaw config set <path> <value>")}  write a config entry`,
	`  ${formatCliCommand("openclaw config get <path>")}          read a config entry`,
	`  ${formatCliCommand("openclaw config patch")}              apply a JSON patch`,
	`  ${formatCliCommand("openclaw config validate")}           validate configuration`
].join("\n");
/**
* Refuses to launch the interactive wizard without a TTY.
*
* `interactive` lets callers/tests override the detected terminal state
* (mirrors the `params.interactive ?? process.stdin.isTTY` pattern used by
* `src/commands/gateway-readiness.ts`), so the fail-closed path is exercisable
* without mutating the global `process` streams. Both stdin and stdout must be
* TTYs: the wizard reads from stdin and renders prompts to stdout, so either
* being piped means it cannot run correctly.
*
* Returns true when the wizard may proceed.
*/
function assertInteractiveConfigureTerminal(runtime, interactive) {
	if (interactive ?? isTerminalInteractive()) return true;
	runtime.error(CONFIGURE_NON_TTY_HINT);
	runtime.exit(1);
	return false;
}
async function configureCommand(runtime = defaultRuntime) {
	await runConfigureWizard({ command: "configure" }, runtime);
}
async function configureCommandWithSections(sections, runtime = defaultRuntime) {
	await runConfigureWizard({
		command: "configure",
		sections
	}, runtime);
}
/** Parse `--section` input and run the requested configure wizard sections. */
async function configureCommandFromSectionsArg(rawSections, runtime = defaultRuntime, options) {
	const { sections, invalid } = parseConfigureWizardSections(rawSections);
	if (invalid.length > 0) {
		runtime.error(`Invalid --section: ${invalid.map((section) => section || "\"\"").join(", ")}. Expected one of: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}. Run ${formatCliCommand("openclaw configure")} without --section to use the full wizard.`);
		runtime.exit(1);
		return;
	}
	if (!assertInteractiveConfigureTerminal(runtime, options?.interactive)) return;
	if (sections.length === 0) {
		await configureCommand(runtime);
		return;
	}
	await configureCommandWithSections(sections, runtime);
}
//#endregion
export { configureCommandFromSectionsArg as t };
