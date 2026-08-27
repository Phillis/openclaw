import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { _ as resolveGatewayPort } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-Chdn0e25.js";
import { d as readConfigFileSnapshotForWrite } from "./io-CeQckj5v.js";
import { r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-Cr5lTl_D.js";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-B_a4cpNH.js";
import { h as resolveFutureConfigActionBlock } from "./config-env-vars-BITg3hPR.js";
import { r as replaceConfigFile } from "./mutate-DOUWd6so.js";
import { y as isNonFatalSystemdInstallProbeError } from "./systemd-DPnIQILH.js";
import { i as resolveOpenClawWrapperPath, t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-C4pvyUF9.js";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-BwaBz4af.js";
import { r as isGatewayDaemonRuntime, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-CHOL1Kuf.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-B_nm9xnu.js";
import { h as resolveGatewayBindHost, o as isLoopbackHost, t as defaultGatewayBindMode } from "./net-BRYQcUG8.js";
import { n as resolveGatewayAuth } from "./auth-resolve-U982W6CT.js";
import "./auth-CCT61CRz.js";
import { a as readEmbeddedGatewayToken } from "./service-audit-DGp-yPw6.js";
import { a as resolveGatewayService } from "./service-BoInmOOR.js";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-BAHQH0iA.js";
import { n as createDaemonInstallActionContext, p as buildDaemonServiceSnapshot, r as failIfNixDaemonInstallMode, v as installDaemonServiceAndEmit } from "./shared-Cauz4p0y.js";
import { t as parsePort } from "./parse-port-BMBBPvn5.js";
//#region src/cli/daemon-cli/install.ts
function resolveGatewayInstallBindMode(cfg) {
	return cfg.gateway?.bind ?? defaultGatewayBindMode(cfg.gateway?.tailscale?.mode ?? "off");
}
function formatNoAuthNonLoopbackInstallBlock(params) {
	const auth = resolveGatewayAuth({
		authConfig: params.config.gateway?.auth,
		env: params.env,
		tailscaleMode: params.config.gateway?.tailscale?.mode ?? "off"
	});
	const bindCanExposeNetwork = params.bind === "tailnet" || !isLoopbackHost(params.bindHost);
	if (auth.mode !== "none" || !bindCanExposeNetwork) return;
	const hints = [`${params.bind === "tailnet" && isLoopbackHost(params.bindHost) ? `gateway.bind=tailnet currently resolves to ${params.bindHost} but can later resolve to a Tailnet interface` : `gateway.bind=${params.bind} resolves to ${params.bindHost}`}, but gateway.auth.mode=none disables Gateway auth.`];
	if (normalizeOptionalString(auth.token)) hints.push(`This config already has gateway.auth.token; run ${formatCliCommand("openclaw config set gateway.auth.mode token")} and then rerun ${formatCliCommand("openclaw gateway install --force")}.`);
	else if (normalizeOptionalString(auth.password)) hints.push(`This config already has gateway.auth.password; run ${formatCliCommand("openclaw config set gateway.auth.mode password")} and then rerun ${formatCliCommand("openclaw gateway install --force")}.`);
	else hints.push(`Configure token/password auth, use trusted-proxy auth, or set ${formatCliCommand("openclaw config set gateway.bind loopback")} before installing the managed service.`);
	return hints.join(" ");
}
/** Merge safe existing service environment into the current install invocation environment. */
function mergeInstallInvocationEnv(params) {
	const platform = params.platform ?? process.platform;
	const normalizeInstallEnvKey = (key) => platform === "win32" ? key.toUpperCase() : key;
	const currentEnv = {};
	for (const [rawKey, rawValue] of Object.entries(params.env)) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key || isDangerousHostEnvVarName(key)) continue;
		currentEnv[normalizeInstallEnvKey(key)] = rawValue;
	}
	if (!params.existingServiceEnv || Object.keys(params.existingServiceEnv).length === 0) return currentEnv;
	const preservedServiceEnv = {};
	for (const [rawKey, rawValue] of Object.entries(params.existingServiceEnv)) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		const upper = key.toUpperCase();
		if (upper === "OPENCLAW_WRAPPER") {
			const value = rawValue.trim();
			if (value) preservedServiceEnv[normalizeInstallEnvKey(OPENCLAW_WRAPPER_ENV_KEY)] = value;
			continue;
		}
		if (upper === "HOME" || upper === "PATH" || upper === "TMPDIR" || upper.startsWith("OPENCLAW_")) continue;
		if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key) && upper !== "NODE_EXTRA_CA_CERTS") continue;
		const value = rawValue.trim();
		if (!value) continue;
		preservedServiceEnv[normalizeInstallEnvKey(key)] = value;
	}
	return {
		...preservedServiceEnv,
		...currentEnv
	};
}
/** Install or refresh the managed Gateway service. */
async function runDaemonInstall(opts) {
	const { json, stdout, warnings, emit, fail } = createDaemonInstallActionContext(opts.json);
	if (failIfNixDaemonInstallMode(fail)) return;
	try {
		assertGatewayServiceMutationAllowed("install or rewrite the gateway service");
	} catch (error) {
		fail(`Gateway install blocked: ${String(error)}`);
		return;
	}
	let { snapshot: configSnapshot, writeOptions: configWriteOptions } = await readConfigFileSnapshotForWrite();
	const futureBlock = resolveFutureConfigActionBlock({
		action: "install or rewrite the gateway service",
		snapshot: configSnapshot
	});
	if (futureBlock) {
		fail(`Gateway install blocked: ${futureBlock.message}`, futureBlock.hints);
		return;
	}
	let cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
	const portOverride = parsePort(opts.port);
	if (opts.port !== void 0 && portOverride === null) {
		fail(formatInvalidPortOption("--port"));
		return;
	}
	const port = portOverride ?? resolveGatewayPort(cfg);
	if (!Number.isFinite(port) || port <= 0 || port > 65535) {
		fail(formatInvalidConfigPort("gateway.port"));
		return;
	}
	const runtimeRaw = opts.runtime ? opts.runtime : DEFAULT_GATEWAY_DAEMON_RUNTIME;
	if (!isGatewayDaemonRuntime(runtimeRaw)) {
		fail("Invalid --runtime (use \"node\"; Bun lacks the required node:sqlite API)");
		return;
	}
	let wrapperPath;
	if (opts.wrapper !== void 0) try {
		wrapperPath = await resolveOpenClawWrapperPath(opts.wrapper);
		if (!wrapperPath) {
			fail("Invalid --wrapper");
			return;
		}
	} catch (err) {
		fail(`Invalid --wrapper: ${String(err)}`);
		return;
	}
	if (configSnapshot.valid && cfg.gateway?.mode === void 0) {
		const baseConfig = configSnapshot.sourceConfig ?? configSnapshot.config;
		await replaceConfigFile({
			nextConfig: {
				...baseConfig,
				gateway: {
					...baseConfig.gateway,
					mode: "local"
				}
			},
			snapshot: configSnapshot,
			writeOptions: {
				baseSnapshot: configSnapshot,
				...configWriteOptions,
				skipRuntimeSnapshotRefresh: true
			},
			afterWrite: { mode: "auto" }
		});
		const refreshed = await readConfigFileSnapshotForWrite();
		configSnapshot = refreshed.snapshot;
		configWriteOptions = refreshed.writeOptions;
		cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
		const message = "No gateway.mode found. Set gateway.mode=local for managed gateway install.";
		if (json) warnings.push(message);
		else defaultRuntime.log(message);
	}
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (err) {
		if (isNonFatalSystemdInstallProbeError(err)) loaded = false;
		else {
			fail(`Gateway service check failed: ${String(err)}`);
			return;
		}
	}
	const existingServiceCommand = await service.readCommand(process.env).catch(() => null);
	const existingServiceEnv = existingServiceCommand?.environment;
	const installEnv = mergeInstallInvocationEnv({
		env: process.env,
		existingServiceEnv
	});
	if (!wrapperPath) try {
		wrapperPath = await resolveOpenClawWrapperPath(installEnv[OPENCLAW_WRAPPER_ENV_KEY]);
	} catch (err) {
		fail(`Invalid ${OPENCLAW_WRAPPER_ENV_KEY}: ${String(err)}`);
		return;
	}
	const installBind = resolveGatewayInstallBindMode(cfg);
	const noAuthNonLoopbackBlock = formatNoAuthNonLoopbackInstallBlock({
		bind: installBind,
		bindHost: await resolveGatewayBindHost(installBind, cfg.gateway?.customBindHost),
		config: cfg,
		env: installEnv
	});
	if (noAuthNonLoopbackBlock) {
		fail(`Gateway install blocked: ${noAuthNonLoopbackBlock}`);
		return;
	}
	if (loaded) {
		if (!opts.force) {
			const autoRefreshMessage = await getGatewayServiceAutoRefreshMessage({
				currentCommand: existingServiceCommand,
				env: process.env,
				installEnv,
				port,
				runtime: runtimeRaw,
				wrapperPath,
				existingEnvironment: existingServiceEnv,
				existingEnvironmentValueSources: existingServiceCommand?.environmentValueSources,
				config: cfg
			});
			if (autoRefreshMessage) if (json) warnings.push(autoRefreshMessage);
			else defaultRuntime.log(autoRefreshMessage);
			else {
				emit({
					ok: true,
					result: "already-installed",
					message: `Gateway service already ${service.loadedText}.`,
					service: buildDaemonServiceSnapshot(service, loaded)
				});
				if (!json) {
					defaultRuntime.log(`Gateway service already ${service.loadedText}.`);
					defaultRuntime.log(`Reinstall with: ${formatCliCommand("openclaw gateway install --force")}`);
				}
				return;
			}
		}
	}
	const tokenResolution = await resolveGatewayInstallToken({
		config: cfg,
		configSnapshot,
		configWriteOptions,
		env: installEnv,
		explicitToken: opts.token,
		autoGenerateWhenMissing: true,
		persistGeneratedToken: true
	});
	if (tokenResolution.unavailableReason) {
		fail(`Gateway install blocked: ${tokenResolution.unavailableReason}`);
		return;
	}
	for (const warning of tokenResolution.warnings) if (json) warnings.push(warning);
	else defaultRuntime.log(warning);
	const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
		env: installEnv,
		port,
		runtime: runtimeRaw,
		wrapperPath,
		existingEnvironment: existingServiceEnv,
		existingEnvironmentValueSources: existingServiceCommand?.environmentValueSources,
		warn: (message) => {
			if (json) warnings.push(message);
			else defaultRuntime.log(message);
		},
		config: cfg
	});
	const warn = (message) => {
		if (json) warnings.push(message);
		else defaultRuntime.log(message);
	};
	await installDaemonServiceAndEmit({
		serviceNoun: "Gateway",
		service,
		warnings,
		emit,
		fail,
		install: async () => {
			await service.install({
				env: installEnv,
				stdout,
				warn,
				programArguments,
				workingDirectory,
				environment,
				environmentValueSources
			});
		}
	});
}
async function getGatewayServiceAutoRefreshMessage(params) {
	try {
		const currentCommand = params.currentCommand;
		if (!currentCommand) return;
		const currentEmbeddedToken = readEmbeddedGatewayToken(currentCommand);
		if (currentEmbeddedToken) {
			if (currentEmbeddedToken !== normalizeOptionalString((await buildGatewayInstallPlan({
				env: params.installEnv,
				port: params.port,
				runtime: params.runtime,
				wrapperPath: params.wrapperPath,
				existingEnvironment: params.existingEnvironment,
				existingEnvironmentValueSources: params.existingEnvironmentValueSources,
				warn: () => void 0,
				config: params.config
			})).environment.OPENCLAW_GATEWAY_TOKEN)) return "Gateway service OPENCLAW_GATEWAY_TOKEN differs from the current install plan; refreshing the install.";
		}
		if (Boolean(params.wrapperPath || normalizeOptionalString(params.installEnv["OPENCLAW_WRAPPER"]))) {
			const plannedInstall = await buildGatewayInstallPlan({
				env: params.installEnv,
				port: params.port,
				runtime: params.runtime,
				wrapperPath: params.wrapperPath,
				existingEnvironment: params.existingEnvironment,
				existingEnvironmentValueSources: params.existingEnvironmentValueSources,
				warn: () => void 0,
				config: params.config
			});
			if (plannedInstall.programArguments.join("\0") !== currentCommand.programArguments.join("\0")) return "Gateway service command differs from the current wrapper install plan; refreshing the install.";
			if (normalizeOptionalString(plannedInstall.environment["OPENCLAW_WRAPPER"]) !== normalizeOptionalString(currentCommand.environment?.["OPENCLAW_WRAPPER"])) return `Gateway service ${OPENCLAW_WRAPPER_ENV_KEY} differs from the current wrapper install plan; refreshing the install.`;
		}
		const currentExecPath = currentCommand.programArguments[0]?.trim();
		if (!currentExecPath) return;
		const currentEnvironment = currentCommand.environment ?? {};
		const currentNodeExtraCaCerts = currentEnvironment.NODE_EXTRA_CA_CERTS?.trim();
		const expectedNodeExtraCaCerts = resolveNodeStartupTlsEnvironment({
			env: {
				...params.env,
				...currentEnvironment,
				NODE_EXTRA_CA_CERTS: void 0
			},
			execPath: currentExecPath,
			includeDarwinDefaults: false
		}).NODE_EXTRA_CA_CERTS;
		if (!expectedNodeExtraCaCerts) return;
		if (currentNodeExtraCaCerts !== expectedNodeExtraCaCerts) return "Gateway service is missing the nvm TLS CA bundle; refreshing the install.";
		return;
	} catch {
		return;
	}
}
//#endregion
export { runDaemonInstall as n, mergeInstallInvocationEnv as t };
