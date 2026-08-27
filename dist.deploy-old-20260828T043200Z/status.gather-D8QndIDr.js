import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { v as resolveSecretInputRef } from "./types.secrets-Bre8L6Ts.js";
import { _ as resolveGatewayPort, a as isDefaultInstallIdentity, f as resolveConfigPath, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { S as createConfigIO } from "./io-DlN5njvP.js";
import { _ as resolveConfiguredLogFilePath } from "./logger-ij8OHrrv.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { o as loadInstalledPluginIndexInstallRecords } from "./manifest-registry-DRErrq38.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0L8fX98.js";
import "./config-B2bSneS2.js";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-0NYr1eQR.js";
import { n as inspectGatewayHeapLimit } from "./gateway-heap-BfwKOqCU.js";
import { r as trimToUndefined } from "./credential-planner-Cyn3ajET.js";
import "./credentials-CNWVqkD0.js";
import { _ as resolveGatewayRequiredListenHosts } from "./net-DeK7gO-9.js";
import { r as formatPortDiagnostics } from "./ports-format-FOKK5FaA.js";
import { n as inspectPortUsage, r as inspectPortUsages, t as inspectPortConnections } from "./ports-inspect-8eZVwL-B.js";
import { a as readGatewayServiceState, o as resolveGatewayService } from "./service-BR9ZQQM7.js";
import { c as pickProbeHostForBind, o as normalizeListenerAddress, s as parsePortFromArgs } from "./shared-AtIdcOsw.js";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-BknYMhkx.js";
import { a as readGatewaySecretInputValue, t as ALL_GATEWAY_SECRET_INPUT_PATHS } from "./secret-input-paths-wYRYhPRC.js";
import { t as gatewaySecretInputPathCanWin } from "./credentials-secret-inputs-B7OzED4v.js";
import { a as resolveGatewayProbeCredentialConfig } from "./probe-auth-26arg1n8.js";
import { n as readLastGatewayErrorLine } from "./diagnostics-BAKcur8h.js";
import { r as resolveBestEffortGatewayBindHostForDisplay, t as inspectBestEffortPrimaryTailnetIPv4 } from "./network-discovery-display-Bxq0kvzv.js";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links-CTWv3QrL.js";
import { r as readGatewayRestartHandoffSync } from "./restart-handoff-Cn-vtimu.js";
import { n as inspectWindowsGatewayFirewall } from "./windows-gateway-firewall-diagnostics-CIVeX3cL.js";
import { t as detectPluginVersionDrift } from "./plugin-version-drift-C9F8aanV.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-BhPKqfrV.js";
import fs from "node:fs/promises";
import JSON5 from "json5";
//#region src/cli/daemon-cli/status.gather.ts
const gatewayProbeAuthModuleLoader = createLazyImportLoader(() => import("./probe-auth-CYikvUNY.js"));
const daemonInspectModuleLoader = createLazyImportLoader(() => import("./inspect-V8ssOQjn.js"));
const launchdModuleLoader = createLazyImportLoader(() => import("./launchd-B1zWqbhb.js"));
const serviceAuditModuleLoader = createLazyImportLoader(() => import("./service-audit-Ds1FrKCU.js"));
const gatewayTlsModuleLoader = createLazyImportLoader(() => import("./gateway-BWx_elNL.js"));
const daemonProbeModuleLoader = createLazyImportLoader(() => import("./probe-M6ih8Rn7.js"));
const restartHealthModuleLoader = createLazyImportLoader(() => import("./restart-health-Cf_Oqv0q.js"));
function loadGatewayProbeAuthModule() {
	return gatewayProbeAuthModuleLoader.load();
}
function loadDaemonInspectModule() {
	return daemonInspectModuleLoader.load();
}
function loadLaunchdModule() {
	return launchdModuleLoader.load();
}
function loadServiceAuditModule() {
	return serviceAuditModuleLoader.load();
}
function loadGatewayTlsModule() {
	return gatewayTlsModuleLoader.load();
}
function loadDaemonProbeModule() {
	return daemonProbeModuleLoader.load();
}
function loadRestartHealthModule() {
	return restartHealthModuleLoader.load();
}
function resolveSnapshotRuntimeConfig(snapshot) {
	if (!snapshot?.valid || !snapshot.runtimeConfig) return null;
	return snapshot.runtimeConfig;
}
function coerceStatusConfig(value) {
	return asNonArrayRecord(value);
}
function hasOwnKey(value, key) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.hasOwn(value, key));
}
function needsFullStatusConfigRead(raw, parsed) {
	return raw.includes("$include") || raw.includes("${") || hasOwnKey(parsed, "env");
}
async function readFastStatusConfig(configPath) {
	let raw;
	try {
		raw = await fs.readFile(configPath, "utf8");
	} catch {
		return null;
	}
	let parsed;
	try {
		parsed = JSON5.parse(raw);
	} catch (err) {
		return {
			summary: {
				path: configPath,
				exists: true,
				valid: false,
				issues: [{
					path: "",
					message: `JSON5 parse failed: ${String(err)}`
				}]
			},
			cfg: {},
			mode: "fast"
		};
	}
	if (needsFullStatusConfigRead(raw, parsed)) return null;
	const cfg = coerceStatusConfig(parsed);
	return {
		summary: {
			path: configPath,
			exists: true,
			valid: true,
			controlUi: cfg.gateway?.controlUi
		},
		cfg,
		mode: "fast"
	};
}
async function readFullStatusConfig(params) {
	const io = createConfigIO({
		env: params.env,
		configPath: params.configPath,
		observe: false,
		pluginValidation: params.pluginValidation ?? "skip",
		logger: {
			error: () => {},
			warn: () => {}
		}
	});
	const snapshot = await io.readConfigFileSnapshot().catch(() => null);
	const cfg = resolveSnapshotRuntimeConfig(snapshot) ?? io.loadConfig();
	return {
		summary: {
			path: snapshot?.path ?? params.configPath,
			exists: snapshot?.exists ?? false,
			valid: snapshot?.valid ?? true,
			...snapshot?.issues?.length ? { issues: snapshot.issues } : {},
			...snapshot?.warnings?.length ? { warnings: snapshot.warnings } : {},
			controlUi: cfg.gateway?.controlUi
		},
		cfg,
		mode: "full"
	};
}
async function readStatusConfig(params) {
	return (params.deep ? null : await readFastStatusConfig(params.configPath)) ?? await readFullStatusConfig({
		env: params.env,
		configPath: params.configPath,
		pluginValidation: params.deep ? "full" : "skip"
	});
}
function appendProbeNote(existing, extra) {
	const values = [existing, extra].filter((value) => Boolean(value?.trim()));
	if (values.length === 0) return;
	return uniqueStrings(values).join(" ");
}
function shouldReportPortUsage(status, rpcOk) {
	if (status === void 0 || status === "free") return false;
	if (rpcOk === true) return false;
	return true;
}
function resolveCliStatusSummary(argv = process.argv) {
	const entrypoint = argv[1]?.trim();
	return {
		version: VERSION,
		...entrypoint ? { entrypoint } : {}
	};
}
async function loadDaemonConfigContext(serviceEnv, opts = {}) {
	const mergedDaemonEnv = {
		...process.env,
		...serviceEnv ?? void 0
	};
	const cliConfigPath = resolveConfigPath(process.env, resolveStateDir(process.env));
	const daemonConfigPath = resolveConfigPath(mergedDaemonEnv, resolveStateDir(mergedDaemonEnv));
	const sameConfigPath = cliConfigPath === daemonConfigPath;
	const cliConfigRead = await readStatusConfig({
		env: process.env,
		configPath: cliConfigPath,
		deep: opts.deep
	});
	const daemonConfigRead = sameConfigPath && (cliConfigRead.mode === "fast" || !serviceEnv) ? cliConfigRead : await readStatusConfig({
		env: mergedDaemonEnv,
		configPath: daemonConfigPath,
		deep: opts.deep
	});
	return {
		mergedDaemonEnv,
		cliCfg: cliConfigRead.cfg,
		daemonCfg: daemonConfigRead.cfg,
		cliConfigSummary: cliConfigRead.summary,
		daemonConfigSummary: daemonConfigRead.summary,
		configMismatch: cliConfigRead.summary.path !== daemonConfigRead.summary.path
	};
}
async function resolveGatewayStatusSummary(params) {
	const portFromArgs = parsePortFromArgs(params.commandProgramArguments);
	const daemonPort = params.localPortOverride ?? portFromArgs ?? resolveGatewayPort(params.daemonCfg, params.mergedDaemonEnv);
	const portSource = params.localPortOverride !== void 0 ? "cli" : portFromArgs ? "service args" : "env/config";
	const bindMode = params.daemonCfg.gateway?.bind ?? "loopback";
	const customBindHost = params.daemonCfg.gateway?.customBindHost;
	const { bindHost, warning: bindHostWarning } = await resolveBestEffortGatewayBindHostForDisplay({
		bindMode,
		customBindHost,
		warningPrefix: "Status is using fallback network details because interface discovery failed"
	});
	const { tailnetIPv4, warning: tailnetWarning } = inspectBestEffortPrimaryTailnetIPv4({ warningPrefix: "Status could not inspect tailnet addresses" });
	const probeHost = params.localPortOverride !== void 0 ? "127.0.0.1" : pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost);
	const probeUrlOverride = trimToUndefined(params.rpcUrlOverride) ?? null;
	const tlsEnabled = params.daemonCfg.gateway?.tls?.enabled === true;
	const probeUrl = probeUrlOverride ?? `${tlsEnabled ? "wss" : "ws"}://${probeHost}:${daemonPort}`;
	const diagnosticProbeUrl = projectGatewayUrlForDiagnostics(probeUrl);
	const controlUiLinks = params.daemonCfg.gateway?.controlUi?.enabled === false ? void 0 : await resolveAdvertisedControlUiLinks({
		port: daemonPort,
		bind: bindMode,
		customBindHost,
		basePath: params.daemonCfg.gateway?.controlUi?.basePath,
		tlsEnabled
	});
	let probeNote = !probeUrlOverride && bindMode === "lan" ? `bind=lan listens on 0.0.0.0 (all interfaces); probing via ${probeHost}.` : !probeUrlOverride && bindMode === "loopback" ? "Loopback-only gateway; only local clients can connect." : void 0;
	probeNote = appendProbeNote(probeNote, bindHostWarning);
	probeNote = appendProbeNote(probeNote, tailnetWarning);
	return {
		gateway: {
			bindMode,
			bindHost,
			customBindHost,
			...tlsEnabled ? { tlsEnabled } : {},
			port: daemonPort,
			portSource,
			probeUrl: diagnosticProbeUrl,
			...controlUiLinks ? { controlUiLinks } : {},
			...probeNote ? { probeNote } : {}
		},
		daemonPort,
		cliPort: resolveGatewayPort(params.cliCfg, process.env),
		probeUrl,
		probeUrlOverride
	};
}
function toPortStatusSummary(diagnostics) {
	if (!diagnostics) return;
	return {
		port: diagnostics.port,
		status: diagnostics.status,
		listeners: diagnostics.listeners,
		hints: diagnostics.hints
	};
}
async function inspectDaemonPortStatuses(params) {
	const daemonProbeHosts = resolveGatewayRequiredListenHosts(params.daemonBindHost);
	if (params.cliPort === params.daemonPort) return {
		portStatus: toPortStatusSummary(await inspectPortUsage(params.daemonPort, { probeHosts: daemonProbeHosts }).catch(() => null)),
		portCliStatus: void 0
	};
	const portDiagnosticsByPort = await inspectPortUsages([params.daemonPort, params.cliPort], { probeHostsByPort: /* @__PURE__ */ new Map([[params.daemonPort, daemonProbeHosts]]) }).catch(() => /* @__PURE__ */ new Map());
	return {
		portStatus: toPortStatusSummary(portDiagnosticsByPort.get(params.daemonPort) ?? null),
		portCliStatus: toPortStatusSummary(portDiagnosticsByPort.get(params.cliPort) ?? null)
	};
}
async function inspectEstablishedGatewayClients(params) {
	if (params.deep !== true || params.gatewayMode === "remote") return;
	const result = await inspectPortConnections(params.daemonPort).catch(() => null);
	const establishedClients = result?.connections.filter((connection) => connection.direction !== "server");
	if (!result || !establishedClients || establishedClients.length === 0) return;
	return {
		port: result.port,
		established: establishedClients
	};
}
function hasActiveGatewayExecProbeCredential(params) {
	const cfg = resolveGatewayProbeCredentialConfig({
		cfg: params.cfg,
		mode: params.mode
	});
	return ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
		if (!gatewaySecretInputPathCanWin({
			config: cfg,
			env: params.env,
			explicitAuth: params.explicitAuth,
			modeOverride: params.mode,
			path,
			remoteTokenFallback: "remote-only",
			remotePasswordFallback: "remote-only"
		})) return false;
		return resolveSecretInputRef({
			value: readGatewaySecretInputValue(cfg, path),
			defaults: cfg.secrets?.defaults
		}).ref?.source === "exec";
	});
}
async function gatherDaemonStatus(opts) {
	const localPortOverride = resolveGatewayLocalPortOverride(opts.rpc);
	const timeoutMs = parseTimeoutMsWithFallback(opts.rpc.timeout, 1e4, { invalidType: "error" });
	const service = resolveGatewayService();
	const { command, env: serviceEnv, loadState, runtime } = await readGatewayServiceState(service, {
		env: process.env,
		timeoutMs
	});
	const loaded = loadState.status === "loaded";
	const useNativeServiceTargetContext = localPortOverride === void 0 && isDefaultInstallIdentity(process.env) && !isGatewayExternallySupervised(process.env);
	const targetServiceCommand = useNativeServiceTargetContext ? command : null;
	const restartHandoff = opts.deep ? readGatewayRestartHandoffSync(serviceEnv) : null;
	const configAudit = command ? await loadServiceAuditModule().then(({ auditGatewayServiceConfig }) => auditGatewayServiceConfig({
		env: process.env,
		command,
		timeoutMs
	})) : {
		ok: true,
		issues: []
	};
	const { mergedDaemonEnv, cliCfg, daemonCfg, cliConfigSummary, daemonConfigSummary, configMismatch } = await loadDaemonConfigContext(targetServiceCommand?.environment, { deep: opts.deep });
	const { gateway, daemonPort, cliPort, probeUrl, probeUrlOverride } = await resolveGatewayStatusSummary({
		cliCfg,
		daemonCfg,
		mergedDaemonEnv,
		commandProgramArguments: targetServiceCommand?.programArguments,
		rpcUrlOverride: opts.rpc.url,
		localPortOverride
	});
	const probeMode = localPortOverride === void 0 && daemonCfg.gateway?.mode === "remote" ? "remote" : "local";
	const serviceTargetsProbe = useNativeServiceTargetContext && !probeUrlOverride;
	const shouldInspectLocalGateway = probeMode === "local" && !probeUrlOverride;
	const windowsFirewall = opts.deep === true && shouldInspectLocalGateway ? await inspectWindowsGatewayFirewall({
		bind: gateway.bindMode,
		mode: "quick",
		port: daemonPort,
		platform: process.platform
	}) : void 0;
	const { portStatus, portCliStatus } = await inspectDaemonPortStatuses({
		daemonPort,
		cliPort,
		daemonBindHost: gateway.bindHost
	});
	const establishedClients = await inspectEstablishedGatewayClients({
		daemonPort,
		deep: opts.deep,
		gatewayMode: probeMode
	});
	const extraServices = opts.deep ? await loadDaemonInspectModule().then(({ findExtraGatewayServices }) => findExtraGatewayServices(process.env, { deep: true })).catch(() => []) : [];
	const staleUpdateLaunchdJobs = opts.deep && process.platform === "darwin" ? await loadLaunchdModule().then(({ findStaleOpenClawUpdateLaunchdJobs }) => findStaleOpenClawUpdateLaunchdJobs(serviceEnv)).catch(() => []) : [];
	const tlsEnabled = daemonCfg.gateway?.tls?.enabled === true;
	const shouldUseLocalTlsRuntime = opts.probe && !probeUrlOverride && tlsEnabled;
	const tlsRuntime = shouldUseLocalTlsRuntime ? await loadGatewayTlsModule().then(({ loadGatewayTlsRuntime }) => loadGatewayTlsRuntime(daemonCfg.gateway?.tls)) : void 0;
	let daemonProbeAuth;
	let rpcAuthWarning;
	let allowRpcConfigCredentials = true;
	let skippedProbeAuthForDisabledExecSecretRef = false;
	if (opts.probe) {
		const explicitAuth = {
			token: opts.rpc.token,
			password: opts.rpc.password
		};
		if (opts.allowExecSecretRefs !== false || !hasActiveGatewayExecProbeCredential({
			cfg: daemonCfg,
			env: mergedDaemonEnv,
			explicitAuth,
			mode: probeMode
		})) {
			const probeAuthResolution = await loadGatewayProbeAuthModule().then(({ resolveGatewayProbeAuthSafeWithSecretInputs }) => resolveGatewayProbeAuthSafeWithSecretInputs({
				cfg: daemonCfg,
				mode: probeMode,
				env: mergedDaemonEnv,
				explicitAuth
			}));
			daemonProbeAuth = probeAuthResolution.auth;
			rpcAuthWarning = probeAuthResolution.warning;
		} else {
			allowRpcConfigCredentials = false;
			skippedProbeAuthForDisabledExecSecretRef = true;
			rpcAuthWarning = "Gateway probe auth skipped because gateway credentials use an exec SecretRef and exec SecretRefs are disabled for this status request.";
		}
	}
	const rpc = opts.probe ? await loadDaemonProbeModule().then(({ probeGatewayStatus }) => probeGatewayStatus({
		url: probeUrl,
		localPortOverride,
		token: daemonProbeAuth?.token,
		password: daemonProbeAuth?.password,
		config: daemonCfg,
		tlsFingerprint: shouldUseLocalTlsRuntime && tlsRuntime?.enabled ? tlsRuntime.fingerprintSha256 : void 0,
		timeoutMs,
		json: opts.rpc.json,
		requireRpc: opts.requireRpc,
		allowRpcConfigCredentials,
		configPath: daemonConfigSummary.path
	})) : void 0;
	if (rpc?.ok && !skippedProbeAuthForDisabledExecSecretRef) rpcAuthWarning = void 0;
	const health = opts.probe && serviceTargetsProbe && loaded && rpc?.ok !== true ? await loadRestartHealthModule().then(({ inspectGatewayRestart }) => inspectGatewayRestart({
		service,
		port: daemonPort,
		env: serviceEnv,
		probeHosts: resolveGatewayRequiredListenHosts(gateway.bindHost)
	})).catch(() => void 0) : void 0;
	const gatewayVersion = opts.probe ? (rpc && "server" in rpc ? rpc.server?.version : void 0) ?? (rpc && "version" in rpc ? rpc.version : void 0) ?? null : void 0;
	let lastError;
	if (shouldInspectLocalGateway && loaded && runtime?.status === "running" && portStatus && (portStatus.status !== "busy" || rpc?.ok === false)) lastError = await readLastGatewayErrorLine(mergedDaemonEnv, { requirePatternMatch: portStatus.status === "busy" }) ?? void 0;
	let pluginVersionDrift;
	if (shouldInspectLocalGateway) try {
		const installRecords = await loadInstalledPluginIndexInstallRecords({ env: mergedDaemonEnv });
		pluginVersionDrift = detectPluginVersionDrift({
			gatewayVersion: gatewayVersion ?? VERSION,
			installRecords,
			config: daemonCfg
		});
	} catch {
		pluginVersionDrift = void 0;
	}
	const hostDesktop = await (await import("./host-source-BRwvqaCU.js")).inspectHostDesktop({ config: daemonCfg.desktop?.host });
	return {
		cli: resolveCliStatusSummary(),
		logFile: resolveConfiguredLogFilePath(cliCfg),
		service: {
			label: service.label,
			loaded: loadState.status === "unknown" ? null : loaded,
			loadState,
			loadedText: service.loadedText,
			notLoadedText: service.notLoadedText,
			targetRole: serviceTargetsProbe ? "target" : "diagnostic-only",
			command,
			runtime,
			configAudit,
			...command ? { gatewayHeap: inspectGatewayHeapLimit(command.environment?.NODE_OPTIONS) } : {},
			...restartHandoff ? { restartHandoff } : {},
			...staleUpdateLaunchdJobs.length > 0 ? { staleUpdateLaunchdJobs } : {}
		},
		config: {
			cli: cliConfigSummary,
			daemon: daemonConfigSummary,
			...configMismatch ? { mismatch: true } : {}
		},
		gateway: {
			...gateway,
			...windowsFirewall?.applies ? { windowsFirewall } : {},
			...opts.probe ? { version: gatewayVersion } : {}
		},
		hostDesktop: hostDesktop.status,
		port: portStatus,
		...portCliStatus ? { portCli: portCliStatus } : {},
		...establishedClients ? { connections: establishedClients } : {},
		lastError,
		...rpc ? { rpc: {
			...rpc,
			url: gateway.probeUrl,
			...rpcAuthWarning ? { authWarning: rpcAuthWarning } : {}
		} } : {},
		...health ? { health: {
			healthy: health.healthy,
			staleGatewayPids: health.staleGatewayPids
		} } : {},
		extraServices,
		...pluginVersionDrift ? { pluginVersionDrift } : {}
	};
}
function renderPortDiagnosticsForCli(status, rpcOk) {
	if (!status.port || !shouldReportPortUsage(status.port.status, rpcOk)) return [];
	return formatPortDiagnostics({
		port: status.port.port,
		status: status.port.status,
		listeners: status.port.listeners,
		hints: status.port.hints
	});
}
function resolvePortListeningAddresses(status) {
	return Array.from(new Set(status.port?.listeners?.map((l) => l.address ? normalizeListenerAddress(l.address) : "").filter((v) => Boolean(v)) ?? []));
}
//#endregion
export { renderPortDiagnosticsForCli as n, resolvePortListeningAddresses as r, gatherDaemonStatus as t };
