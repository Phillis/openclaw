import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { _ as resolveGatewayPort, o as isDefaultStateDir, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { Q as ConfigMutationConflictError, l as readConfigFileSnapshot } from "./io-CeQckj5v.js";
import { p as isValidEnvSecretRefId, v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BDz7f4XS.js";
import { t as assertSupportedRuntime } from "./runtime-guard-CBEVEZk3.js";
import { r as replaceConfigFile } from "./mutate-DOUWd6so.js";
import "./config-Dl8DJbzM.js";
import { r as isGatewayDaemonRuntime } from "./daemon-runtime-CHOL1Kuf.js";
import { n as resolveConfiguredSecretInputWithFallback } from "./resolve-configured-secret-input-string-NhsX8URR.js";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-BVFWEg2L.js";
import { t as randomToken } from "./random-token-B1woZa_H.js";
import { r as formatInvalidPortOption } from "./error-format-BAHQH0iA.js";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-DfRqI0QP.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-_X1FPu-e.js";
import { h as waitForGatewayReachable, l as normalizeGatewayTokenInput, n as applyWizardMetadata, s as handleReset, t as DEFAULT_WORKSPACE } from "./onboard-helpers-CO-dBdb1.js";
import { n as ensureOnboardingAgentWorkspace, r as resolveOnboardingAgentTarget } from "./onboard-agent-target-CMWQlqye.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { i as resolveProviderMatch } from "./provider-auth-choice-helpers-C9CHozK8.js";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-Fc8DRSVR.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-CeJDDzqq.js";
import { o as normalizeTokenProviderInput } from "./provider-auth-input-CWTavMIA.js";
import { r as logConfigUpdated } from "./logging-CVOiRigR.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-wbp6QsX_.js";
import { r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-DKvqcps4.js";
import { i as resolveDeprecatedAuthChoiceReplacement, n as isDeprecatedAuthChoice, r as normalizeLegacyOnboardAuthChoice, t as formatDeprecatedNonInteractiveAuthChoiceError } from "./auth-choice-legacy-BMDRagbU.js";
import { t as resolvePluginProviders } from "./provider-auth-choice.runtime-CB5vbyzK.js";
import { c as parseNonInteractiveCustomApiFlags, d as resolveCustomProviderId, n as applyCustomApiConfig, t as CustomApiError } from "./onboard-custom-config-Cyqa2YWn.js";
import { n as validateGatewayWebSocketUrl } from "./onboard-remote-C3u2K1Oi.js";
import { n as isOnboardFlow, t as isNodeManagerChoice } from "./onboard-types-Du2Y9b-2.js";
import { n as applySkipBootstrapConfig, r as resolveOnboardingWorkspaceConflict, t as applyLocalSetupWorkspaceConfig } from "./onboard-config-DU6S3CQE.js";
import { t as runGuidedOnboarding } from "./onboard-guided-Dr1VFIaK.js";
import { t as hasInteractiveOnboardingTty } from "./onboard-interactive-runner-DCjqfU2_.js";
import { t as enableDefaultOnboardingInternalHooks } from "./onboard-hooks-Ca9woCpp.js";
import { u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-DhN9_LNX.js";
import { n as runInteractiveSetup } from "./onboard-interactive-B_NvE2Nr.js";
import { t as inferAuthChoiceFromFlags } from "./auth-choice-inference-BqyvYKPE.js";
import { n as resolveNonInteractiveApiKey, t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-BLRj4VN7.js";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/onboard-non-interactive/config-write.ts
/** Commits a non-interactive onboard config update with pending plugin records handled first. */
async function commitNonInteractiveOnboardConfig(params) {
	const { writeWizardConfigFile } = await import("./setup.shared-BaXgZkEJ.js");
	return await writeWizardConfigFile(params.nextConfig, {
		allowConfigSizeDrop: params.reset === true,
		...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {}
	});
}
//#endregion
//#region src/commands/onboard-non-interactive/local/gateway-config.ts
/**
* Gateway config mutation for local non-interactive onboarding.
*
* This module owns port/bind/auth validation and existing-setting preservation
* before the final config write happens.
*/
/** Applies gateway CLI options to the pending config and returns normalized runtime settings. */
function applyNonInteractiveGatewayConfig(params) {
	const { opts, runtime } = params;
	const gatewayPort = opts.gatewayPort;
	if (gatewayPort !== void 0 && (!Number.isFinite(gatewayPort) || gatewayPort <= 0 || gatewayPort > 65535)) {
		runtime.error(formatInvalidPortOption("--gateway-port"));
		runtime.exit(1);
		return null;
	}
	const existingGateway = params.nextConfig.gateway;
	const port = gatewayPort ?? params.defaultPort;
	let bind = opts.gatewayBind ?? existingGateway?.bind ?? "loopback";
	const explicitAuthMode = opts.gatewayAuth;
	if (explicitAuthMode !== void 0 && explicitAuthMode !== "token" && explicitAuthMode !== "password") {
		runtime.error("Invalid --gateway-auth. Use \"token\" or \"password\".");
		runtime.exit(1);
		return null;
	}
	const hasExplicitTokenAuthInput = opts.gatewayToken !== void 0 || opts.gatewayTokenRefEnv !== void 0;
	let authMode = explicitAuthMode ?? (hasExplicitTokenAuthInput ? "token" : existingGateway?.auth?.mode) ?? "token";
	const tailscaleMode = opts.tailscale ?? existingGateway?.tailscale?.mode ?? "off";
	const tailscaleResetOnExit = opts.tailscaleResetOnExit ?? existingGateway?.tailscale?.resetOnExit ?? false;
	if ((opts.gatewayBind !== void 0 || opts.tailscale !== void 0) && tailscaleMode !== "off" && bind !== "loopback") bind = "loopback";
	const changesAuthOrTailscale = explicitAuthMode !== void 0 || hasExplicitTokenAuthInput || opts.tailscale !== void 0;
	if (changesAuthOrTailscale && tailscaleMode === "serve" && authMode === "none") authMode = "token";
	if (changesAuthOrTailscale && tailscaleMode === "funnel" && authMode !== "password") authMode = "password";
	let nextConfig = params.nextConfig;
	const explicitGatewayToken = normalizeGatewayTokenInput(opts.gatewayToken);
	const envGatewayToken = normalizeGatewayTokenInput(process.env.OPENCLAW_GATEWAY_TOKEN);
	const existingTokenInput = nextConfig.gateway?.auth?.token;
	const existingTokenRef = resolveSecretInputRef({
		value: existingTokenInput,
		defaults: nextConfig.secrets?.defaults
	}).ref;
	const existingPlaintextToken = normalizeGatewayTokenInput(existingTokenInput);
	let gatewayToken = explicitGatewayToken || existingPlaintextToken || envGatewayToken || void 0;
	const gatewayTokenRefEnv = normalizeOptionalString(opts.gatewayTokenRefEnv ?? "") ?? "";
	if (authMode === "token") if (gatewayTokenRefEnv) {
		if (!isValidEnvSecretRefId(gatewayTokenRefEnv)) {
			runtime.error("Invalid --gateway-token-ref-env. Use an environment variable name like OPENCLAW_GATEWAY_TOKEN.");
			runtime.exit(1);
			return null;
		}
		if (explicitGatewayToken) {
			runtime.error("Use either --gateway-token or --gateway-token-ref-env, not both. Prefer --gateway-token-ref-env to avoid writing plaintext tokens.");
			runtime.exit(1);
			return null;
		}
		if (!process.env[gatewayTokenRefEnv]?.trim()) {
			runtime.error(`Environment variable "${gatewayTokenRefEnv}" is missing or empty. Export it first, then rerun ${formatCliCommand("openclaw onboard --non-interactive")}.`);
			runtime.exit(1);
			return null;
		}
		nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "token",
					token: {
						source: "env",
						provider: resolveDefaultSecretProviderAlias(nextConfig, "env", { preferFirstProviderForSource: true }),
						id: gatewayTokenRefEnv
					}
				}
			}
		};
	} else if (!explicitGatewayToken && existingTokenRef) nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			auth: {
				...nextConfig.gateway?.auth,
				mode: "token"
			}
		}
	};
	else {
		if (!gatewayToken) gatewayToken = randomToken();
		nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "token",
					token: gatewayToken
				}
			}
		};
	}
	if (authMode === "password") {
		const input = opts.gatewayPassword;
		const password = input === void 0 ? nextConfig.gateway?.auth?.password ?? normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD) : normalizeOptionalString(input);
		if (!password) {
			runtime.error("Missing --gateway-password for password auth. Pass --gateway-password or use --gateway-auth token.");
			runtime.exit(1);
			return null;
		}
		nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "password",
					...input !== void 0 ? { password } : {}
				}
			}
		};
	}
	nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			port,
			bind,
			tailscale: {
				...nextConfig.gateway?.tailscale,
				mode: tailscaleMode,
				resetOnExit: tailscaleResetOnExit
			}
		}
	};
	return {
		nextConfig,
		port,
		bind,
		authMode,
		tailscaleMode,
		tailscaleResetOnExit
	};
}
//#endregion
//#region src/commands/onboard-non-interactive/local/output.ts
/**
* Output helpers for non-interactive onboarding.
*
* JSON success/failure payloads and human-readable gateway health diagnostics
* are kept here so local and remote setup report failures consistently.
*/
/** Emits the JSON success payload for non-interactive onboarding when requested. */
function logNonInteractiveOnboardingJson(params) {
	if (!params.opts.json) return;
	writeRuntimeJson(params.runtime, {
		ok: true,
		mode: params.mode,
		workspace: params.workspaceDir,
		authChoice: params.authChoice,
		gateway: params.gateway,
		installDaemon: Boolean(params.installDaemon),
		daemonInstall: params.daemonInstall,
		daemonRuntime: params.daemonRuntime,
		skipSkills: Boolean(params.skipSkills),
		skipHealth: Boolean(params.skipHealth)
	});
}
function formatGatewayRuntimeSummary(diagnostics) {
	const service = diagnostics?.service;
	if (!service?.runtimeStatus) return;
	const parts = [service.runtimeStatus];
	if (typeof service.pid === "number") parts.push(`pid ${service.pid}`);
	if (service.state) parts.push(`state ${service.state}`);
	if (typeof service.lastExitStatus === "number") parts.push(`last exit ${service.lastExitStatus}`);
	if (service.lastExitReason) parts.push(`reason ${service.lastExitReason}`);
	return parts.join(", ");
}
function hasConnectionRefusedDetail(detail) {
	return /\b(?:econnrefused|connection refused|connect refused)\b/i.test(detail);
}
function classifyGatewayHealthFailure(params) {
	const detail = params.detail ?? "";
	const lastGatewayError = params.diagnostics?.lastGatewayError ?? "";
	const combined = `${detail}\n${lastGatewayError}`;
	if (/\b(?:unauthorized|forbidden|invalid token|invalid password|auth mismatch)\b/i.test(combined)) return "auth-mismatch";
	if (/\b(?:runtime[- ]deps?|runtime dependencies|cannot find module|sqlite-vec|loadextension)\b/i.test(combined)) return "module-missing";
	if (params.diagnostics?.service?.loaded === false && hasConnectionRefusedDetail(detail)) return "service-missing";
	const runtimeStatus = params.diagnostics?.service?.runtimeStatus;
	if (runtimeStatus && runtimeStatus !== "running" && runtimeStatus !== "active" && hasConnectionRefusedDetail(detail)) return "service-stopped";
	if (lastGatewayError.trim()) return "startup-blocked";
	if (hasConnectionRefusedDetail(detail)) return "not-listening";
}
function recoveryHintForGatewayHealthFailure(classification) {
	switch (classification) {
		case "auth-mismatch": return "Fix: run `openclaw doctor --fix`.";
		case "module-missing": return "Fix: run `openclaw doctor --fix`.";
		case "service-missing": return "Fix: run `openclaw gateway install --force`.";
		case "service-stopped": return "Fix: run `openclaw gateway restart`.";
		case "startup-blocked": return "Fix: run `openclaw gateway status --deep`.";
		case "not-listening": return "Fix: start `openclaw gateway run`, or run `openclaw gateway restart` for a managed gateway.";
		default: return;
	}
}
/** Emits JSON or human-readable failure output for non-interactive onboarding. */
function logNonInteractiveOnboardingFailure(params) {
	const classification = classifyGatewayHealthFailure({
		detail: params.detail,
		diagnostics: params.diagnostics
	});
	const recoveryHint = recoveryHintForGatewayHealthFailure(classification);
	const hints = [...recoveryHint ? [recoveryHint] : [], ...params.hints?.filter(Boolean) ?? []];
	const gatewayRuntime = formatGatewayRuntimeSummary(params.diagnostics);
	if (params.opts.json) {
		writeRuntimeJson(params.runtime, {
			ok: false,
			mode: params.mode,
			phase: params.phase,
			message: params.message,
			classification,
			detail: params.detail,
			gateway: params.gateway,
			installDaemon: Boolean(params.installDaemon),
			daemonInstall: params.daemonInstall,
			daemonRuntime: params.daemonRuntime,
			diagnostics: params.diagnostics,
			hints: hints.length > 0 ? hints : void 0
		});
		return;
	}
	const lines = [
		params.message,
		classification ? `Classification: ${classification}` : void 0,
		params.detail ? `Last probe: ${params.detail}` : void 0,
		params.diagnostics?.service ? `Service: ${params.diagnostics.service.label} (${params.diagnostics.service.loaded ? params.diagnostics.service.loadedText : "not loaded"})` : void 0,
		gatewayRuntime ? `Runtime: ${gatewayRuntime}` : void 0,
		params.diagnostics?.lastGatewayError ? `Last gateway error: ${params.diagnostics.lastGatewayError}` : void 0,
		params.diagnostics?.inspectError ? `Diagnostics warning: ${params.diagnostics.inspectError}` : void 0,
		hints.length > 0 ? hints.join("\n") : void 0
	].filter(Boolean).join("\n");
	if (params.informational) params.runtime.log(lines);
	else params.runtime.error(lines);
}
//#endregion
//#region src/commands/onboard-non-interactive/local/skills-config.ts
/** Applies the non-interactive skills install options to the pending config. */
function applyNonInteractiveSkillsConfig(params) {
	const { nextConfig, opts, runtime } = params;
	if (opts.skipSkills) return nextConfig;
	const nodeManager = opts.nodeManager ?? "npm";
	if (![
		"npm",
		"pnpm",
		"bun"
	].includes(nodeManager)) {
		runtime.error("Invalid --node-manager. Use \"npm\", \"pnpm\", or \"bun\".");
		runtime.exit(1);
		return nextConfig;
	}
	return {
		...nextConfig,
		skills: {
			...nextConfig.skills,
			install: {
				...nextConfig.skills?.install,
				nodeManager
			}
		}
	};
}
//#endregion
//#region src/commands/onboard-non-interactive/local/workspace.ts
/**
* Workspace resolution for local non-interactive onboarding.
*
* CLI input wins, then existing config, then the computed default workspace,
* and the final value is expanded through the normal user-path resolver.
*/
/** Resolves the workspace directory used by local non-interactive setup. */
function resolveNonInteractiveWorkspaceDir(params) {
	const env = params.env ?? process.env;
	const requestedWorkspace = params.opts.workspace?.trim() || void 0;
	const configuredWorkspace = params.baseConfig.agents?.defaults?.workspace?.trim() || void 0;
	const workspaceOverride = env.OPENCLAW_WORKSPACE_DIR?.trim() || void 0;
	const implicitWorkspaceDir = isDefaultStateDir(env) ? params.defaultWorkspaceDir : path.join(resolveStateDir(env), "workspace");
	return resolveUserPath((requestedWorkspace ?? configuredWorkspace ?? workspaceOverride ?? implicitWorkspaceDir).trim(), env);
}
//#endregion
//#region src/commands/onboard-non-interactive/local.ts
/**
* Local non-interactive onboarding orchestration.
*
* This entrypoint applies config changes, optionally installs the gateway
* daemon, verifies health, and emits machine-readable setup output.
*/
const INSTALL_DAEMON_HEALTH_DEADLINE_MS = 45e3;
const ATTACH_EXISTING_GATEWAY_HEALTH_DEADLINE_MS = 15e3;
const INSTALL_DAEMON_HEALTH_PROBE_TIMEOUT_MS = 1e4;
const WINDOWS_INSTALL_DAEMON_HEALTH_DEADLINE_MS = 9e4;
const WINDOWS_INSTALL_DAEMON_HEALTH_PROBE_TIMEOUT_MS = 15e3;
const INSTALL_DAEMON_HEALTH_COMMAND_TIMEOUT_MS = 1e4;
const WINDOWS_INSTALL_DAEMON_HEALTH_COMMAND_TIMEOUT_MS = 9e4;
/** Returns platform-specific health timing for managed daemon installs. */
function resolveInstallDaemonGatewayHealthTiming(platform = process.platform) {
	if (platform === "win32") return {
		deadlineMs: WINDOWS_INSTALL_DAEMON_HEALTH_DEADLINE_MS,
		probeTimeoutMs: WINDOWS_INSTALL_DAEMON_HEALTH_PROBE_TIMEOUT_MS,
		healthCommandTimeoutMs: WINDOWS_INSTALL_DAEMON_HEALTH_COMMAND_TIMEOUT_MS
	};
	return {
		deadlineMs: INSTALL_DAEMON_HEALTH_DEADLINE_MS,
		probeTimeoutMs: INSTALL_DAEMON_HEALTH_PROBE_TIMEOUT_MS,
		healthCommandTimeoutMs: INSTALL_DAEMON_HEALTH_COMMAND_TIMEOUT_MS
	};
}
async function collectGatewayHealthFailureDiagnostics() {
	const diagnostics = {};
	try {
		const { resolveGatewayService } = await import("./service-D1osYpUO.js");
		const service = resolveGatewayService();
		const env = process.env;
		const [loaded, runtime] = await Promise.all([service.isLoaded({ env }).catch(() => false), service.readRuntime(env).catch(() => void 0)]);
		diagnostics.service = {
			label: service.label,
			loaded,
			loadedText: service.loadedText,
			runtimeStatus: runtime?.status,
			state: runtime?.state,
			pid: runtime?.pid,
			lastExitStatus: runtime?.lastExitStatus,
			lastExitReason: runtime?.lastExitReason
		};
	} catch (err) {
		diagnostics.inspectError = `service diagnostics failed: ${String(err)}`;
	}
	try {
		const { readLastGatewayErrorLine } = await import("./diagnostics-BgCohGwQ.js");
		diagnostics.lastGatewayError = await readLastGatewayErrorLine(process.env) ?? void 0;
	} catch (err) {
		diagnostics.inspectError = diagnostics.inspectError ? `${diagnostics.inspectError}; log diagnostics failed: ${String(err)}` : `log diagnostics failed: ${String(err)}`;
	}
	return diagnostics.service || diagnostics.lastGatewayError || diagnostics.inspectError ? diagnostics : void 0;
}
/** Resolves the auth material used by the post-setup gateway health probe. */
async function resolveGatewayHealthProbeToken(nextConfig) {
	if (nextConfig.gateway?.auth?.mode === "password") {
		const resolved = await resolveConfiguredSecretInputWithFallback({
			config: nextConfig,
			env: process.env,
			value: nextConfig.gateway.auth.password,
			path: "gateway.auth.password",
			unresolvedReasonStyle: "detailed",
			readFallback: () => process.env.OPENCLAW_GATEWAY_PASSWORD
		});
		return {
			password: resolved.value,
			unresolvedRefReason: resolved.unresolvedRefReason
		};
	}
	const resolved = await resolveGatewayAuthToken({
		cfg: nextConfig,
		env: process.env,
		envFallback: "no-secret-ref",
		unresolvedReasonStyle: "detailed"
	});
	const probeAuth = {};
	if (resolved.token) probeAuth.token = resolved.token;
	if (resolved.unresolvedRefReason) probeAuth.unresolvedRefReason = resolved.unresolvedRefReason;
	return probeAuth;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.onboardNonInteractiveLocalTestApi")] = {
	resolveGatewayHealthProbeToken,
	resolveInstallDaemonGatewayHealthTiming
};
function formatGatewayHealthFailureDetail(params) {
	return [params.probeDetail, params.unresolvedRefReason].filter(Boolean).join("\n") || void 0;
}
/** Runs local non-interactive setup from config mutation through health verification. */
async function runNonInteractiveLocalSetup(params) {
	const { opts, runtime, baseConfig, baseHash } = params;
	const mode = "local";
	const selectedAgentId = resolveOnboardingAgentTarget(baseConfig).agentId;
	const requestedWorkspaceDir = resolveNonInteractiveWorkspaceDir({
		opts,
		baseConfig,
		defaultWorkspaceDir: DEFAULT_WORKSPACE
	});
	const workspaceConflict = resolveOnboardingWorkspaceConflict(baseConfig, requestedWorkspaceDir);
	const workspaceDir = workspaceConflict?.currentWorkspaceDir ?? requestedWorkspaceDir;
	if (workspaceConflict) runtime.error([
		"Warning: existing agents keep their current workspace during non-interactive onboarding.",
		`Current workspace: ${workspaceConflict.currentWorkspaceDir}`,
		`Requested workspace: ${workspaceConflict.requestedWorkspaceDir}`,
		`Run \`${formatCliCommand("openclaw onboard --classic")}\` to confirm moving the existing agent fleet.`
	].join("\n"));
	let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, requestedWorkspaceDir);
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	const authTarget = resolveOnboardingAgentTarget(nextConfig, selectedAgentId);
	const inferredAuthChoice = opts.authChoice ? void 0 : (await import("./auth-choice-inference-BEY1Lh9u.js")).inferAuthChoiceFromFlags(opts, {
		config: nextConfig,
		workspaceDir: authTarget.workspaceDir,
		env: process.env
	});
	if (!opts.authChoice && inferredAuthChoice && inferredAuthChoice.matches.length > 1) {
		runtime.error([
			"Multiple API key flags were provided for non-interactive setup.",
			"Use a single provider flag or pass --auth-choice explicitly.",
			`Flags: ${inferredAuthChoice.matches.map((match) => match.label).join(", ")}`
		].join("\n"));
		runtime.exit(1);
		return;
	}
	const authChoice = opts.authChoice ?? inferredAuthChoice?.choice ?? "skip";
	const gatewayResult = applyNonInteractiveGatewayConfig({
		nextConfig,
		opts,
		runtime,
		defaultPort: resolveGatewayPort(baseConfig)
	});
	if (!gatewayResult) return;
	nextConfig = gatewayResult.nextConfig;
	nextConfig = applyNonInteractiveSkillsConfig({
		nextConfig,
		opts,
		runtime
	});
	if (authChoice !== "skip") {
		const { applyNonInteractiveAuthChoice } = await import("./auth-choice-BeSussJo.js");
		const nextConfigAfterAuth = await applyNonInteractiveAuthChoice({
			nextConfig,
			authChoice,
			opts,
			runtime,
			baseConfig,
			target: authTarget
		});
		if (!nextConfigAfterAuth) return;
		nextConfig = nextConfigAfterAuth;
	}
	if (!opts.skipHooks) nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
	const { ensureOnboardingAgent } = await import("./onboard-agent-DylSVAgq.js");
	const created = await ensureOnboardingAgent({
		config: nextConfig,
		workspace: workspaceDir,
		baseConfig,
		firstAgent: { name: opts.agentName ?? "main" }
	});
	for (const warning of created.sessionMigrationWarnings ?? []) runtime.log(`Warning: ${warning}`);
	nextConfig = applyLocalSetupWorkspaceConfig(created.config, requestedWorkspaceDir);
	const effectiveBaseHash = created.configHash ?? baseHash;
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	nextConfig = applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	nextConfig = await commitNonInteractiveOnboardConfig({
		nextConfig,
		baseHash: effectiveBaseHash,
		reset: opts.reset
	});
	logConfigUpdated(runtime);
	const finalTarget = resolveOnboardingAgentTarget(nextConfig, selectedAgentId);
	await ensureOnboardingAgentWorkspace(finalTarget, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
	});
	const daemonRuntimeRaw = opts.daemonRuntime ?? "node";
	let daemonInstallStatus;
	let gatewayNotRunning = false;
	if (opts.installDaemon) {
		const { installGatewayDaemonNonInteractive } = await import("./daemon-install-B6197FLe.js");
		const daemonInstall = await installGatewayDaemonNonInteractive({
			nextConfig,
			opts,
			runtime,
			port: gatewayResult.port
		});
		daemonInstallStatus = daemonInstall.installed ? {
			requested: true,
			installed: true
		} : {
			requested: true,
			installed: false,
			skippedReason: daemonInstall.skippedReason
		};
		if (!daemonInstall.installed && !opts.skipHealth) {
			logNonInteractiveOnboardingFailure({
				opts,
				runtime,
				mode,
				phase: "daemon-install",
				message: daemonInstall.skippedReason === "systemd-user-unavailable" ? "Gateway service install is unavailable because systemd user services are not reachable in this Linux session." : "Gateway service install did not complete successfully.",
				installDaemon: true,
				daemonInstall: {
					requested: true,
					installed: false,
					skippedReason: daemonInstall.skippedReason
				},
				daemonRuntime: daemonRuntimeRaw,
				hints: daemonInstall.skippedReason === "systemd-user-unavailable" ? ["Fix: rerun without `--install-daemon` for one-shot setup, or enable a working user-systemd session and retry.", "If your auth profile uses env-backed refs, keep those env vars set in the shell that runs `openclaw gateway run` or `openclaw agent --local`."] : [`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for more detail.`]
			});
			runtime.exit(1);
			return;
		}
	}
	if (!opts.skipHealth) {
		const { healthCommand } = await import("./health-LFnaJ4Jn.js");
		const links = resolveLocalControlUiProbeLinks({
			bind: gatewayResult.bind,
			port: gatewayResult.port,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: void 0,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const installDaemonGatewayHealthTiming = resolveInstallDaemonGatewayHealthTiming();
		const probeAuth = await resolveGatewayHealthProbeToken(nextConfig);
		const probe = await waitForGatewayReachable({
			url: links.wsUrl,
			token: probeAuth.token,
			password: probeAuth.password,
			deadlineMs: opts.installDaemon ? installDaemonGatewayHealthTiming.deadlineMs : ATTACH_EXISTING_GATEWAY_HEALTH_DEADLINE_MS,
			probeTimeoutMs: opts.installDaemon ? installDaemonGatewayHealthTiming.probeTimeoutMs : void 0
		});
		if (!probe.ok) {
			const detail = formatGatewayHealthFailureDetail({
				probeDetail: probe.detail,
				unresolvedRefReason: probeAuth.unresolvedRefReason
			});
			const diagnostics = opts.installDaemon ? await collectGatewayHealthFailureDiagnostics() : void 0;
			const explicitlySkippedAbsentGateway = opts.installDaemon === false && classifyGatewayHealthFailure({
				detail,
				diagnostics
			}) === "not-listening";
			if (explicitlySkippedAbsentGateway && !opts.json) runtime.log("Setup complete; gateway was not installed or started because daemon installation was explicitly skipped.");
			if (!explicitlySkippedAbsentGateway || !opts.json) logNonInteractiveOnboardingFailure({
				opts,
				runtime,
				mode,
				phase: "gateway-health",
				message: `Gateway did not become reachable at ${links.wsUrl}.`,
				detail,
				gateway: {
					wsUrl: links.wsUrl,
					httpUrl: links.httpUrl
				},
				installDaemon: Boolean(opts.installDaemon),
				daemonInstall: daemonInstallStatus,
				daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : void 0,
				diagnostics,
				hints: !opts.installDaemon ? [
					"Non-interactive local setup only waits for an already-running gateway unless you pass `--install-daemon` to `openclaw onboard`.",
					`Fix: start \`${formatCliCommand("openclaw gateway run")}\`, re-run \`${formatCliCommand("openclaw onboard --install-daemon")}\`, or use \`${formatCliCommand("openclaw onboard --skip-health")}\`.`,
					process.platform === "win32" ? "Native Windows managed gateway install tries Scheduled Tasks first and falls back to a per-user Startup-folder login item when task creation is denied." : void 0
				].filter((value) => Boolean(value)) : [`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for more detail.`],
				informational: explicitlySkippedAbsentGateway
			});
			if (!explicitlySkippedAbsentGateway) {
				runtime.exit(1);
				return;
			}
			gatewayNotRunning = true;
		} else await healthCommand({
			json: false,
			timeoutMs: opts.installDaemon ? installDaemonGatewayHealthTiming.healthCommandTimeoutMs : 1e4,
			config: nextConfig,
			token: probeAuth.token,
			password: probeAuth.password
		}, runtime);
	}
	logNonInteractiveOnboardingJson({
		opts,
		runtime,
		mode,
		workspaceDir: finalTarget.workspaceDir,
		authChoice,
		gateway: {
			port: gatewayResult.port,
			bind: gatewayResult.bind,
			authMode: gatewayResult.authMode,
			tailscaleMode: gatewayResult.tailscaleMode,
			...gatewayNotRunning ? { reachable: false } : {}
		},
		installDaemon: Boolean(opts.installDaemon),
		daemonInstall: daemonInstallStatus,
		daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : void 0,
		skipSkills: Boolean(opts.skipSkills),
		skipHealth: Boolean(opts.skipHealth)
	});
	if (!opts.json) runtime.log(`Tip: run \`${formatCliCommand("openclaw configure --section web")}\` to store your Brave API key for web_search. Docs: https://docs.openclaw.ai/tools/web`);
}
//#endregion
//#region src/commands/onboard-non-interactive/remote.ts
/**
* Remote non-interactive onboarding orchestration.
*
* It writes gateway.remote config without local gateway setup, preserving the
* same config commit path as local onboarding.
*/
/** Runs non-interactive setup for clients that connect to an existing remote gateway. */
async function runNonInteractiveRemoteSetup(params) {
	const { opts, runtime, baseConfig, baseHash } = params;
	const mode = "remote";
	const remoteUrl = normalizeOptionalString(opts.remoteUrl);
	if (!remoteUrl) {
		runtime.error(`Missing --remote-url for remote mode. Example: ${formatCliCommand("openclaw onboard --non-interactive --mode remote --remote-url ws://127.0.0.1:3000")}.`);
		runtime.exit(1);
		return;
	}
	const remoteToken = normalizeOptionalString(opts.remoteToken);
	if (opts.remoteToken !== void 0 && !remoteToken) {
		runtime.error("Invalid --remote-token: value cannot be empty.");
		runtime.exit(1);
		return;
	}
	const existingRemote = baseConfig.gateway?.remote;
	const preservedRemote = normalizeOptionalString(existingRemote?.url) !== remoteUrl ? {} : { ...existingRemote };
	if (remoteToken) delete preservedRemote.password;
	let nextConfig = {
		...baseConfig,
		gateway: {
			...baseConfig.gateway,
			mode: "remote",
			remote: {
				...preservedRemote,
				url: remoteUrl,
				...remoteToken ? { token: remoteToken } : {}
			}
		}
	};
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	if (!opts.skipHooks) nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
	nextConfig = applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	await commitNonInteractiveOnboardConfig({
		nextConfig,
		baseHash,
		reset: opts.reset
	});
	logConfigUpdated(runtime);
	const payload = {
		mode,
		remoteUrl,
		auth: nextConfig.gateway?.remote?.token ? "token" : nextConfig.gateway?.remote?.password ? ["pass", "word"].join("") : "none"
	};
	if (opts.json) writeRuntimeJson(runtime, payload);
	else {
		runtime.log(`Remote gateway: ${remoteUrl}`);
		runtime.log(`Auth: ${payload.auth}`);
		runtime.log(`Tip: run \`${formatCliCommand("openclaw configure --section web")}\` to store your Brave API key for web_search. Docs: https://docs.openclaw.ai/tools/web`);
	}
}
//#endregion
//#region src/commands/onboard-non-interactive.ts
/**
* Non-interactive onboarding command dispatcher.
*
* This module validates the existing config snapshot, routes local/remote
* setup, and handles explicit migration imports without interactive prompts.
*/
function isMigrationImport(opts) {
	return Boolean(opts.importFrom || opts.importSource || opts.importSecrets || opts.flow === "import");
}
/** Runs a setup migration import with non-interactive prompt failures. */
async function runNonInteractiveMigrationImport(params) {
	const providerId = params.opts.importFrom?.trim();
	if (!providerId) {
		params.runtime.error(`--import-from is required for non-interactive migration import. Run ${formatCliCommand("openclaw migrate list")} to choose a provider.`);
		params.runtime.exit(1);
		return;
	}
	const { detectSetupMigrationSources, runSetupMigrationImport } = await import("./setup.migration-import-sC3t-htf.js");
	const detections = await detectSetupMigrationSources({
		config: params.baseConfig,
		runtime: params.runtime
	});
	await (await runSetupMigrationImport({
		opts: {
			...params.opts,
			importFrom: providerId,
			nonInteractive: true
		},
		baseConfig: params.baseConfig,
		detections,
		prompter: createNonInteractiveLoggingPrompter(params.runtime, (message) => `Non-interactive migration import needs explicit flags before prompting: ${message}`),
		runtime: params.runtime,
		async readConfigFile() {
			const snapshot = await readConfigFileSnapshot();
			if (!snapshot.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor`.");
			return snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
		},
		async commitConfigFile(config, expectedConfig) {
			const latest = await readConfigFileSnapshot();
			if (!latest.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor`.");
			if (!isDeepStrictEqual(latest.exists ? latest.sourceConfig ?? latest.config : {}, expectedConfig)) throw new ConfigMutationConflictError("config changed during migration promotion", { currentHash: latest.hash ?? null });
			const committed = await replaceConfigFile({
				nextConfig: config,
				snapshot: latest,
				...latest.hash !== void 0 ? { baseHash: latest.hash } : {},
				writeOptions: { allowConfigSizeDrop: true }
			});
			logConfigUpdated(params.runtime);
			return committed.nextConfig;
		}
	})).acknowledgePromotion?.();
}
async function runNonInteractiveSetupExclusive(opts, runtime) {
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		runtime.error(`Config invalid. Run \`${formatCliCommand("openclaw doctor")}\` to repair it, then re-run setup.`);
		runtime.exit(1);
		return;
	}
	const baseConfig = snapshot.valid ? snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {} : {};
	const mode = opts.mode ?? "local";
	if (mode !== "local" && mode !== "remote") {
		runtime.error(`Invalid --mode "${String(mode)}". Use "local" or "remote", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
		runtime.exit(1);
		return;
	}
	if (isMigrationImport(opts)) {
		await runNonInteractiveMigrationImport({
			opts,
			runtime,
			baseConfig
		});
		return;
	}
	if (mode === "remote") {
		await runNonInteractiveRemoteSetup({
			opts,
			runtime,
			baseConfig,
			baseHash: snapshot.hash
		});
		return;
	}
	await runNonInteractiveLocalSetup({
		opts,
		runtime,
		baseConfig,
		baseHash: snapshot.hash
	});
}
/** Runs non-interactive onboarding in local, remote, or migration-import mode. */
async function runNonInteractiveSetup(opts, runtime = defaultRuntime) {
	await withSetupMigrationTargetLock(resolveStateDir(), async () => {
		if (isMigrationImport(opts)) {
			await runNonInteractiveSetupExclusive(opts, runtime);
			return;
		}
		await withOpenClawStateLease({
			scope: "core:onboarding",
			key: "global",
			database: { scope: "shared" },
			leaseMs: 5 * 6e4,
			waitMs: 10 * 6e4,
			leaseLabel: "non-interactive onboarding lease",
			operationLabel: "onboarding.non-interactive.lease"
		}, async () => await withPluginLifecycleLease({}, async () => runNonInteractiveSetupExclusive(opts, runtime)));
	});
}
//#endregion
//#region src/commands/onboard.ts
/**
* Top-level `openclaw onboard` command entrypoint.
*
* It validates global setup flags, performs optional reset handling, and then
* routes to interactive or non-interactive onboarding.
*/
const VALID_RESET_SCOPES = /* @__PURE__ */ new Set([
	"config",
	"config+creds+sessions",
	"full"
]);
const BUILT_IN_AUTH_CHOICES = [
	"setup-token",
	"token",
	"apiKey",
	"custom-api-key",
	"skip"
];
function rejectOption(runtime, message) {
	runtime.error(message);
	runtime.exit(1);
	return false;
}
function validatePreflightOptions(opts, runtime) {
	if (opts.mode !== void 0 && opts.mode !== "local" && opts.mode !== "remote") return rejectOption(runtime, `Invalid --mode "${String(opts.mode)}". Use "local" or "remote", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
	const remoteOnlyFlags = [opts.remoteUrl !== void 0 ? "--remote-url" : void 0, opts.remoteToken !== void 0 ? "--remote-token" : void 0].filter((flag) => flag !== void 0);
	if (opts.nonInteractive && (opts.mode ?? "local") === "local" && remoteOnlyFlags.length > 0) return rejectOption(runtime, `${remoteOnlyFlags.join(" and ")} ${remoteOnlyFlags.length === 1 ? "requires" : "require"} --mode remote in non-interactive setup.`);
	const choiceValidations = [
		[
			"--gateway-bind",
			opts.gatewayBind,
			[
				"loopback",
				"tailnet",
				"lan",
				"auto",
				"custom"
			]
		],
		[
			"--gateway-auth",
			opts.gatewayAuth,
			["token", "password"]
		],
		[
			"--tailscale",
			opts.tailscale,
			[
				"off",
				"serve",
				"funnel"
			]
		],
		[
			"--custom-compatibility",
			opts.customCompatibility,
			[
				"openai",
				"openai-responses",
				"anthropic"
			]
		]
	];
	for (const [flag, value, allowed] of choiceValidations) if (value !== void 0 && !allowed.includes(value)) return rejectOption(runtime, `Invalid ${flag} ${JSON.stringify(value)}. Use ${allowed.map((choice) => JSON.stringify(choice)).join(", ")}.`);
	if (opts.flow !== void 0 && !isOnboardFlow(opts.flow)) return rejectOption(runtime, "Invalid --flow. Use \"quickstart\", \"advanced\", \"manual\", or \"import\".");
	if (opts.daemonRuntime !== void 0 && !isGatewayDaemonRuntime(opts.daemonRuntime)) return rejectOption(runtime, "Invalid --daemon-runtime. Use \"node\".");
	if (opts.nodeManager !== void 0 && !isNodeManagerChoice(opts.nodeManager)) return rejectOption(runtime, "Invalid --node-manager. Use \"npm\", \"pnpm\", or \"bun\".");
	if (opts.gatewayPort !== void 0 && (!Number.isFinite(opts.gatewayPort) || opts.gatewayPort <= 0 || opts.gatewayPort > 65535)) return rejectOption(runtime, formatInvalidPortOption("--gateway-port"));
	if (opts.gatewayTokenRefEnv !== void 0) {
		const gatewayTokenRefEnv = opts.gatewayTokenRefEnv.trim();
		if (!isValidEnvSecretRefId(gatewayTokenRefEnv)) return rejectOption(runtime, "Invalid --gateway-token-ref-env. Use an environment variable name like OPENCLAW_GATEWAY_TOKEN.");
		if (opts.gatewayToken !== void 0) return rejectOption(runtime, "Use either --gateway-token or --gateway-token-ref-env, not both. Prefer --gateway-token-ref-env to avoid writing plaintext tokens.");
		if (!process.env[gatewayTokenRefEnv]?.trim()) return rejectOption(runtime, `Environment variable "${gatewayTokenRefEnv}" is missing or empty. Export it first, then rerun ${formatCliCommand("openclaw onboard")}.`);
	}
	if (opts.nonInteractive && opts.mode === "remote" && !opts.remoteUrl?.trim()) return rejectOption(runtime, `Missing --remote-url for remote mode. Example: ${formatCliCommand("openclaw onboard --non-interactive --mode remote --remote-url ws://127.0.0.1:3000")}.`);
	if (opts.nonInteractive && opts.mode === "remote" && opts.remoteUrl?.trim()) {
		const remoteUrlError = validateGatewayWebSocketUrl(opts.remoteUrl);
		if (remoteUrlError) return rejectOption(runtime, remoteUrlError);
	}
	if (opts.nonInteractive && (opts.flow === "import" || opts.importSource || opts.importSecrets) && !opts.importFrom?.trim()) return rejectOption(runtime, `--import-from is required for non-interactive migration import. Run ${formatCliCommand("openclaw migrate list")} to choose a provider.`);
	return true;
}
async function validateResetAuthChoice(params) {
	const inferredAuthChoice = params.opts.authChoice || !params.opts.nonInteractive ? void 0 : inferAuthChoiceFromFlags(params.opts, {
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env
	});
	if (inferredAuthChoice && inferredAuthChoice.matches.length > 1) return rejectOption(params.runtime, [
		"Multiple API key flags were provided for non-interactive setup.",
		"Use a single provider flag or pass --auth-choice explicitly.",
		`Flags: ${inferredAuthChoice.matches.map((match) => match.label).join(", ")}`
	].join("\n"));
	const authChoice = params.opts.authChoice ?? inferredAuthChoice?.choice;
	if (!authChoice) return true;
	if (!(/* @__PURE__ */ new Set([...BUILT_IN_AUTH_CHOICES, ...formatAuthChoiceChoicesForCli({
		includeLegacyAliases: true,
		includeSkip: true,
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env
	}).split("|")])).has(authChoice)) return rejectOption(params.runtime, `Auth choice "${authChoice}" was not matched to a provider setup flow. Run ${formatCliCommand("openclaw onboard")} to choose interactively.`);
	const providerAuthChoices = [...resolveManifestProviderAuthChoices({
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	}), ...resolveProviderInstallCatalogEntries({
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	})];
	const isGenericProviderChoice = authChoice === "token" || authChoice === "setup-token" || authChoice === "apiKey";
	const normalizedTokenProvider = normalizeTokenProviderInput(params.opts.tokenProvider);
	const inferredOptionKey = inferredAuthChoice?.matches[0]?.optionKey;
	const providerAuthChoice = isGenericProviderChoice ? providerAuthChoices.find((choice) => {
		const providerMatches = normalizedTokenProvider ? normalizeTokenProviderInput(choice.providerId) === normalizedTokenProvider || choice.providerAliases?.some((alias) => normalizeTokenProviderInput(alias) === normalizedTokenProvider) : inferredOptionKey !== void 0 && choice.optionKey === inferredOptionKey;
		const methodId = choice.methodId.toLowerCase();
		const supportsAuthKind = authChoice === "apiKey" ? methodId.includes("api") && methodId.includes("key") : authChoice === "setup-token" ? methodId === "setup-token" : methodId.includes("token");
		return providerMatches && supportsAuthKind;
	}) : providerAuthChoices.find((choice) => choice.choiceId === authChoice);
	if (params.opts.nonInteractive && isGenericProviderChoice && !normalizedTokenProvider && !inferredOptionKey) return rejectOption(params.runtime, `Auth choice "${authChoice}" requires --token-provider in non-interactive setup.`);
	if (params.opts.nonInteractive && (authChoice === "token" || authChoice === "setup-token") && !params.opts.token?.trim()) return rejectOption(params.runtime, `Auth choice "${authChoice}" requires --token in non-interactive setup.`);
	if (params.opts.nonInteractive && isGenericProviderChoice && !providerAuthChoice) return rejectOption(params.runtime, `Auth choice "${authChoice}" was not matched to provider "${params.opts.tokenProvider?.trim()}".`);
	if (params.opts.nonInteractive && authChoice === "custom-api-key") try {
		const custom = parseNonInteractiveCustomApiFlags({
			baseUrl: params.opts.customBaseUrl,
			modelId: params.opts.customModelId,
			compatibility: params.opts.customCompatibility,
			apiKey: void 0,
			providerId: params.opts.customProviderId,
			supportsImageInput: params.opts.customImageInput
		});
		const customProviderId = resolveCustomProviderId({
			config: params.baseConfig,
			baseUrl: custom.baseUrl,
			providerId: custom.providerId
		}).providerId;
		const customCredential = await resolveNonInteractiveApiKey({
			provider: customProviderId,
			cfg: params.baseConfig,
			flagValue: params.opts.customApiKey,
			flagName: "--custom-api-key",
			envVar: "CUSTOM_API_KEY",
			runtime: params.runtime,
			allowProfile: params.resetScope === "config",
			required: false,
			secretInputMode: params.opts.secretInputMode
		});
		if (params.opts.customApiKey?.trim() && !customCredential) return false;
		applyCustomApiConfig({
			config: params.baseConfig,
			baseUrl: custom.baseUrl,
			modelId: custom.modelId,
			compatibility: custom.compatibility,
			apiKey: void 0,
			providerId: custom.providerId,
			supportsImageInput: custom.supportsImageInput
		});
	} catch (error) {
		const message = error instanceof CustomApiError && (error.code === "missing_required" || error.code === "invalid_compatibility") ? error.message : `Invalid custom provider config: ${formatErrorMessage(error)}`;
		return rejectOption(params.runtime, message);
	}
	if (params.opts.nonInteractive && authChoice !== "custom-api-key" && authChoice !== "skip") {
		const runtimeMethod = (providerAuthChoice ? resolveProviderMatch(resolvePluginProviders({
			config: params.baseConfig,
			workspaceDir: params.workspaceDir,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false,
			providerRefs: [providerAuthChoice.providerId],
			activate: true
		}), providerAuthChoice.providerId) : null)?.auth.find((method) => method.id === providerAuthChoice?.methodId || method.wizard?.choiceId === providerAuthChoice?.choiceId);
		if (!runtimeMethod?.runNonInteractive || !runtimeMethod.validateNonInteractive) {
			const reason = !runtimeMethod ? "provider unavailable" : !runtimeMethod.runNonInteractive ? "non-interactive setup unsupported" : "reset validation unavailable";
			return rejectOption(params.runtime, `Auth choice "${authChoice}" cannot be safely preflighted with --reset (${reason}). Choose a provider method that supports non-interactive reset validation, or run setup without --reset.`);
		}
		if (!await runtimeMethod.validateNonInteractive({
			authChoice,
			config: params.baseConfig,
			baseConfig: params.baseConfig,
			opts: params.opts,
			runtime: params.runtime,
			workspaceDir: params.workspaceDir,
			resolveApiKey: async (input) => await resolveNonInteractiveApiKey({
				...input,
				cfg: params.baseConfig,
				runtime: params.runtime,
				allowProfile: input.allowProfile === false ? false : params.resetScope === "config",
				secretInputMode: params.opts.secretInputMode
			})
		})) return false;
	}
	return true;
}
function validateResetMigrationImport(params) {
	if (!params.opts.importFrom && !params.opts.importSource && !params.opts.importSecrets && params.opts.flow !== "import") return true;
	return rejectOption(params.runtime, "Migration import cannot be combined with --reset because provider input must be planned before any state is removed. Run the import without --reset.");
}
function validateResetNonInteractiveGateway(params) {
	if (!params.opts.nonInteractive || (params.opts.mode ?? "local") === "remote") return true;
	return Boolean(applyNonInteractiveGatewayConfig({
		nextConfig: params.baseConfig,
		opts: params.opts,
		runtime: params.runtime,
		defaultPort: resolveGatewayPort(params.baseConfig)
	}));
}
/**
* Interactive onboarding defaults to guided setup. Any explicit
* setup flag beyond this allowlist keeps the classic wizard — those flags are
* a public automation contract and guided setup does not honor them.
* Most false booleans mean "not passed" because the command layer normalizes
* them with Boolean(). False-valued explicit choices preserve undefined when
* omitted, so daemon, Tailscale-reset, and custom-model input overrides are
* special-cased. `--modern` never reaches this dispatch; the command layer
* routes it through the inference-gated OpenClaw.
*/
const GUIDED_SAFE_ONBOARD_KEYS = /* @__PURE__ */ new Set([
	"workspace",
	"acceptRisk",
	"reset",
	"resetScope",
	"nonInteractive",
	"classic",
	"tui",
	"skipUi"
]);
function wantsClassicInteractiveSetup(opts) {
	if (opts.classic === true) return true;
	if (opts.installDaemon !== void 0 || opts.tailscaleResetOnExit !== void 0 || opts.customImageInput !== void 0) return true;
	for (const [key, value] of Object.entries(opts)) {
		if (GUIDED_SAFE_ONBOARD_KEYS.has(key) || key === "installDaemon") continue;
		if (value === void 0 || value === false) continue;
		return true;
	}
	return false;
}
/** Runs the onboard command after normalizing legacy flags and setup mode. */
async function setupWizardCommand(opts, runtime = defaultRuntime) {
	assertSupportedRuntime(runtime);
	const originalAuthChoice = opts.authChoice;
	const normalizedAuthChoice = normalizeLegacyOnboardAuthChoice(originalAuthChoice, { env: process.env });
	if (opts.nonInteractive && isDeprecatedAuthChoice(originalAuthChoice, { env: process.env })) {
		runtime.error(formatDeprecatedNonInteractiveAuthChoiceError(originalAuthChoice, { env: process.env }));
		runtime.exit(1);
		return;
	}
	if (isDeprecatedAuthChoice(originalAuthChoice, { env: process.env })) runtime.log(resolveDeprecatedAuthChoiceReplacement(originalAuthChoice, { env: process.env }).message);
	const flow = opts.flow === "manual" ? "advanced" : opts.flow;
	const normalizedOpts = normalizedAuthChoice === opts.authChoice && flow === opts.flow ? opts : {
		...opts,
		authChoice: normalizedAuthChoice,
		flow
	};
	if (normalizedOpts.agentName !== void 0) {
		const { validateFirstOnboardingAgentName } = await import("./onboard-agent-DylSVAgq.js");
		const error = validateFirstOnboardingAgentName(normalizedOpts.agentName);
		if (error) {
			runtime.error(`Invalid --agent-name: ${error}`);
			runtime.exit(1);
			return;
		}
	}
	if (!validatePreflightOptions(normalizedOpts, runtime)) return;
	if (normalizedOpts.classic && normalizedOpts.nonInteractive) {
		runtime.error("--classic cannot be combined with --non-interactive. Remove --non-interactive to open the classic wizard, or remove --classic for automated setup.");
		runtime.exit(1);
		return;
	}
	if (normalizedOpts.tui && normalizedOpts.nonInteractive) {
		runtime.error("--tui cannot be combined with --non-interactive. Remove --tui for automation, or remove --non-interactive to open the terminal hatch.");
		runtime.exit(1);
		return;
	}
	if (normalizedOpts.secretInputMode && normalizedOpts.secretInputMode !== "plaintext" && normalizedOpts.secretInputMode !== "ref") {
		runtime.error(`Invalid --secret-input-mode. Use "plaintext" or "ref", or run ${formatCliCommand("openclaw onboard")} for the interactive setup.`);
		runtime.exit(1);
		return;
	}
	if (normalizedOpts.resetScope && !VALID_RESET_SCOPES.has(normalizedOpts.resetScope)) {
		runtime.error(`Invalid --reset-scope. Use "config", "config+creds+sessions", or "full". Run ${formatCliCommand("openclaw onboard --reset --reset-scope config")} for a config-only reset.`);
		runtime.exit(1);
		return;
	}
	if (normalizedOpts.resetScope && !normalizedOpts.reset) {
		runtime.error(`--reset-scope requires --reset. Re-run with ${formatCliCommand(`openclaw onboard --reset --reset-scope ${normalizedOpts.resetScope}`)}.`);
		runtime.exit(1);
		return;
	}
	if (normalizedOpts.nonInteractive && normalizedOpts.acceptRisk !== true) {
		runtime.error([
			"Non-interactive setup requires explicit risk acknowledgement.",
			"Read: https://docs.openclaw.ai/security",
			`Re-run with: ${formatCliCommand("openclaw onboard --non-interactive --accept-risk ...")}`
		].join("\n"));
		runtime.exit(1);
		return;
	}
	if (!normalizedOpts.nonInteractive && !hasInteractiveOnboardingTty()) {
		runtime.error(t("wizard.guided.ttyRequired"));
		runtime.exit(1);
		return;
	}
	if (process.platform === "win32") runtime.log([
		"Windows detected - OpenClaw runs great on WSL2!",
		"Native Windows might be trickier.",
		"Quick setup: wsl --install (one command, one reboot)",
		"Guide: https://docs.openclaw.ai/windows"
	].join("\n"));
	const runSetup = normalizedOpts.nonInteractive ? runNonInteractiveSetup : wantsClassicInteractiveSetup(normalizedOpts) ? runInteractiveSetup : runGuidedOnboarding;
	const runSetupAfterOptionalReset = async () => {
		if (normalizedOpts.reset) {
			const snapshot = await readConfigFileSnapshot();
			const baseConfig = snapshot.sourceConfig ?? (snapshot.valid ? snapshot.config : {});
			const resetScope = normalizedOpts.resetScope ?? "config+creds+sessions";
			const setupBaseConfig = {};
			const setupWorkspaceDir = resolveUserPath(normalizedOpts.workspace ?? DEFAULT_WORKSPACE);
			const configuredWorkspace = normalizedOpts.workspace ?? baseConfig.agents?.defaults?.workspace;
			if (resetScope === "full" && normalizedOpts.workspace === void 0 && snapshot.exists && !snapshot.valid && snapshot.readError !== void 0) {
				rejectOption(runtime, "Cannot determine the configured workspace from an unreadable config. Pass --workspace with the workspace to remove, or use a narrower --reset-scope.");
				return;
			}
			if (resetScope === "full" && configuredWorkspace !== void 0 && (typeof configuredWorkspace !== "string" || !configuredWorkspace.trim())) {
				rejectOption(runtime, "Configured workspace is invalid. Pass --workspace with the workspace to remove, or use a narrower --reset-scope.");
				return;
			}
			const workspaceDir = resolveUserPath(typeof configuredWorkspace === "string" && configuredWorkspace.trim() ? configuredWorkspace : DEFAULT_WORKSPACE);
			if (!await validateResetAuthChoice({
				opts: normalizedOpts,
				runtime,
				baseConfig: setupBaseConfig,
				workspaceDir: setupWorkspaceDir,
				resetScope
			})) return;
			if (!validateResetNonInteractiveGateway({
				opts: normalizedOpts,
				runtime,
				baseConfig: setupBaseConfig
			})) return;
			if (!validateResetMigrationImport({
				opts: normalizedOpts,
				runtime
			})) return;
			await handleReset(resetScope, workspaceDir, runtime);
		}
		await runSetup(normalizedOpts, runtime);
	};
	await withSetupMigrationTargetLock(resolveStateDir(), runSetupAfterOptionalReset);
}
//#endregion
export { setupWizardCommand };
