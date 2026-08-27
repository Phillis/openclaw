import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { a as listAgentIds } from "./agent-scope-config-BdXMWufB.js";
import { i as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-DW5Tr4Iu.js";
import { i as getActiveGatewayRootWorkCount, m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { v as sweepSessionStateWatchNotices } from "./session-state-events-C74I5OQg.js";
import { s as hasRestartSentinel } from "./restart-sentinel-CWrwiMK_.js";
import { r as loadGetReplyFromConfigRuntime } from "./dispatch-from-config.runtime.js";
import { i as projectUpdateAvailable, n as GATEWAY_EVENT_UPDATE_AVAILABLE, r as canReadDetailedUpdateMetadata } from "./events-TB-ePJT1.js";
import { t as scheduleGatewayIdleTask } from "./server-idle-task-Cr84w9sq.js";
import { n as measureStartup } from "./server-startup-trace-DA1KytiF.js";
import { t as hasConfiguredInternalHooks } from "./configured-CJ77YH3f.js";
import { Worker } from "node:worker_threads";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/gateway/server-startup-context-cache-prewarm.ts
const CONTEXT_CACHE_PREWARM_START_DELAY_MS = 5e3;
const CONTEXT_CACHE_PREWARM_RETRY_DELAY_MS = 250;
function scheduleContextCachePrewarm(params) {
	let stopped = false;
	const warm = async () => {
		if (stopped) return;
		const { prewarmContextWindowCacheAfterReady } = await import("./context-B5FJGZHO.js");
		if (!stopped) await prewarmContextWindowCacheAfterReady({
			config: params.getConfig(),
			isCancelled: () => stopped
		});
	};
	const idleTask = scheduleGatewayIdleTask({
		delayMs: CONTEXT_CACHE_PREWARM_START_DELAY_MS,
		retryDelayMs: CONTEXT_CACHE_PREWARM_RETRY_DELAY_MS,
		isClosing: () => stopped,
		isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
		run: () => params.startupTrace ? params.startupTrace.measure("post-ready.context-window-cache", warm) : warm(),
		log: params.log,
		errorMessage: "post-ready.context-window-cache failed after gateway ready"
	});
	return { stop: () => {
		stopped = true;
		idleTask.stop();
	} };
}
//#endregion
//#region src/gateway/server-startup-handler-prewarm.ts
const SIDEBAR_SESSION_LIST_LIMIT = 60;
const SIDEBAR_PREWARM_MAX_SESSION_ENTRIES = 2e3;
const GATEWAY_HANDLER_PREWARM_RETRY_DELAY_MS = 250;
async function prewarmGatewaySessionListData(cfg, agentId) {
	const [{ loadCombinedSessionStoreForGatewayCore }, { listSessionsFromStoreAsync }] = await Promise.all([import("./combined-store-gateway-fblIiZ4W.js"), import("./session-utils-list-DsOrx7aU.js")]);
	const { durableStorePath, storePath, store } = loadCombinedSessionStoreForGatewayCore(cfg, {
		agentId,
		projection: "list"
	});
	await listSessionsFromStoreAsync({
		cfg,
		durableStorePath,
		storePath,
		store,
		opts: {
			agentId,
			configuredAgentsOnly: true,
			includeDerivedTitles: true,
			includeGlobal: true,
			includeUnknown: true,
			limit: SIDEBAR_SESSION_LIST_LIMIT
		}
	});
}
function dashboardDataPrewarmItems(cfg, log) {
	const agentIds = listAgentIds(cfg);
	let sessionDataPrewarmChecked = false;
	let sessionDataPrewarmAllowed = false;
	const shouldPrewarmSessionData = async () => {
		if (sessionDataPrewarmChecked) return sessionDataPrewarmAllowed;
		sessionDataPrewarmChecked = true;
		const { canPrewarmCombinedSessionStoresForGateway } = await import("./combined-store-gateway-fblIiZ4W.js");
		sessionDataPrewarmAllowed = canPrewarmCombinedSessionStoresForGateway(cfg, {
			agentIds,
			maxRows: SIDEBAR_PREWARM_MAX_SESSION_ENTRIES
		});
		if (!sessionDataPrewarmAllowed) log.info?.(`skipping optional dashboard session prewarm: combined stores exceed ${SIDEBAR_PREWARM_MAX_SESSION_ENTRIES} rows`);
		return sessionDataPrewarmAllowed;
	};
	return [...agentIds.map((agentId) => ({
		name: `sessions.${agentId}`,
		load: async () => {
			if (!await shouldPrewarmSessionData()) return;
			await prewarmGatewaySessionListData(cfg, agentId);
		}
	})), {
		name: "plugins",
		load: async () => {
			const { listManagedPlugins } = await import("./management-service-BX6kMSg1.js");
			await listManagedPlugins({ config: cfg });
		}
	}];
}
function scheduleGatewayHandlerPrewarm(params) {
	const items = params.items ?? dashboardDataPrewarmItems(params.cfgAtStart, params.log);
	let stopped = false;
	let nextIndex = 0;
	let currentItemName = "unknown";
	let idleTask;
	const scheduleNext = () => {
		if (stopped || nextIndex >= items.length) return;
		(async () => {
			await params.waitForPostReadyWork?.();
			if (stopped) return;
			const item = items[nextIndex++];
			if (!item) return;
			currentItemName = item.name;
			const load = () => item.load();
			idleTask = scheduleGatewayIdleTask({
				delayMs: 0,
				retryDelayMs: GATEWAY_HANDLER_PREWARM_RETRY_DELAY_MS,
				isClosing: () => stopped,
				isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
				run: async () => {
					try {
						await (params.startupTrace ? params.startupTrace.measure(`post-ready.gateway-data.${item.name}`, load) : load());
					} finally {
						idleTask = void 0;
						scheduleNext();
					}
				},
				log: params.log,
				errorMessage: `post-ready gateway data prewarm failed for ${item.name}`
			});
		})().catch((err) => {
			params.log.warn(`post-ready gateway data prewarm failed for ${currentItemName}: ${String(err)}`);
			scheduleNext();
		});
	};
	scheduleNext();
	return { stop: () => {
		stopped = true;
		idleTask?.stop();
		idleTask = void 0;
	} };
}
//#endregion
//#region src/gateway/server-startup-outcomes.ts
const GATEWAY_STARTUP_SUBSYSTEMS = [
	"internal-hooks",
	"internal-startup-hook",
	"gateway-start-hooks",
	"gmail-watcher",
	"gmail-model"
];
function skipped(subsystem, reason) {
	return {
		subsystem,
		status: "skipped",
		reason
	};
}
function resolveOutcomePlan(params) {
	const internalHooks = params.cfg.hooks?.internal?.enabled === false ? "hooks-disabled" : hasConfiguredInternalHooks(params.cfg) ? "configured" : "not-configured";
	const gmailWatcher = !params.cfg.hooks?.enabled ? "hooks-disabled" : !params.cfg.hooks.gmail?.account ? "no-gmail-account" : isTruthyEnvValue((params.env ?? process.env).OPENCLAW_SKIP_GMAIL_WATCHER) ? "disabled-by-environment" : "scheduled";
	return {
		internalHooks,
		gatewayStartHooks: params.gatewayStartHooks,
		gmailWatcher,
		gmailModel: params.cfg.hooks?.gmail?.model ? "scheduled" : "not-configured"
	};
}
/** Create the complete initial outcome set; awaited startup work may replace entries later. */
function createGatewayStartupOutcomeRecorder(params) {
	const plan = resolveOutcomePlan(params);
	const internalHooks = plan.internalHooks === "configured" ? skipped("internal-hooks", "no-handlers-loaded") : skipped("internal-hooks", plan.internalHooks);
	const internalStartupHook = plan.internalHooks === "hooks-disabled" ? skipped("internal-startup-hook", "hooks-disabled") : skipped("internal-startup-hook", "no-handlers-loaded");
	const outcomes = /* @__PURE__ */ new Map([
		["internal-hooks", internalHooks],
		["internal-startup-hook", internalStartupHook],
		["gateway-start-hooks", plan.gatewayStartHooks ? {
			subsystem: "gateway-start-hooks",
			status: "scheduled"
		} : skipped("gateway-start-hooks", "no-handlers-loaded")],
		["gmail-watcher", plan.gmailWatcher === "scheduled" ? {
			subsystem: "gmail-watcher",
			status: "scheduled"
		} : skipped("gmail-watcher", plan.gmailWatcher)],
		["gmail-model", plan.gmailModel === "scheduled" ? {
			subsystem: "gmail-model",
			status: "scheduled"
		} : skipped("gmail-model", "not-configured")]
	]);
	return {
		record: (outcome) => {
			outcomes.set(outcome.subsystem, outcome);
		},
		snapshot: () => GATEWAY_STARTUP_SUBSYSTEMS.flatMap((subsystem) => {
			const outcome = outcomes.get(subsystem);
			return outcome ? [outcome] : [];
		})
	};
}
/** Format outcomes in canonical order regardless of collection order. */
function formatGatewayStartupOutcomes(outcomes) {
	const bySubsystem = new Map(outcomes.map((outcome) => [outcome.subsystem, outcome]));
	return `gateway startup outcomes: ${GATEWAY_STARTUP_SUBSYSTEMS.flatMap((subsystem) => {
		const outcome = bySubsystem.get(subsystem);
		if (!outcome) return [];
		const detail = "reason" in outcome ? ` (${outcome.reason})` : "";
		return `${outcome.subsystem}=${outcome.status}${detail}`;
	}).join("; ")}`;
}
//#endregion
//#region src/gateway/system-ca-warmup.ts
const SYSTEM_CA_WARMUP_TIMEOUT_MS = 1e4;
const SYSTEM_CA_WORKER_SOURCE = String.raw`
  const { getCACertificates } = require("node:tls");
  const { parentPort } = require("node:worker_threads");

  try {
    const certificateCount = getCACertificates("default").length;
    parentPort.postMessage({ ok: true, certificateCount });
  } catch (error) {
    parentPort.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    parentPort.close();
  }
`;
function isSystemCaWarmupMessage(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const message = value;
	return message.ok === true ? typeof message.certificateCount === "number" : message.ok === false && typeof message.error === "string";
}
function isWorkerPermissionDenied(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "ERR_ACCESS_DENIED";
}
/** Warm Node's effective default CA set without blocking the gateway event loop on macOS. */
async function warmMacOSSystemCaOffMainThread(options = {}) {
	const env = options.env ?? process.env;
	if ((options.platform ?? process.platform) !== "darwin" || options.env === void 0 && options.platform === void 0 && isVitestRuntimeEnv(env)) return;
	let worker;
	try {
		worker = (options.createWorker ?? ((source, workerOptions) => new Worker(source, workerOptions)))(SYSTEM_CA_WORKER_SOURCE, { eval: true });
	} catch (error) {
		const reason = isWorkerPermissionDenied(error) ? "Node denied worker-thread permission" : `worker creation failed: ${formatErrorMessage(error)}`;
		options.log?.warn(`macOS CA warmup skipped because ${reason}; trust settings will load lazily`);
		return;
	}
	await new Promise((resolve) => {
		let settled = false;
		const timeoutMs = options.timeoutMs ?? SYSTEM_CA_WARMUP_TIMEOUT_MS;
		const settle = (warning, terminate = false) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			worker.removeAllListeners();
			worker.once("error", () => {});
			if (terminate) worker.terminate().catch(() => {});
			if (warning) options.log?.warn(warning);
			resolve();
		};
		worker.once("message", (value) => {
			if (!isSystemCaWarmupMessage(value)) {
				settle("macOS CA warmup returned an invalid result; gateway startup will continue and trust settings will load lazily", true);
				return;
			}
			if (!value.ok) {
				settle(`macOS CA warmup failed: ${value.error}; gateway startup will continue and trust settings will load lazily`, true);
				return;
			}
			settle();
		});
		worker.once("error", (error) => {
			settle(`macOS CA warmup worker failed: ${error.message}; gateway startup will continue and trust settings will load lazily`);
		});
		worker.once("exit", (code) => {
			settle(`macOS CA warmup worker exited before replying (code ${code}); gateway startup will continue and trust settings will load lazily`);
		});
		const timeout = setTimeout(() => {
			settle(`macOS CA warmup timed out after ${timeoutMs}ms; gateway startup will continue and trust settings will load lazily`, true);
		}, timeoutMs);
		timeout.unref?.();
		worker.unref();
	});
}
//#endregion
//#region src/gateway/server-startup-post-attach.ts
const ACP_BACKEND_READY_TIMEOUT_MS = 5e3;
const ACP_BACKEND_READY_POLL_MS = 50;
const PROVIDER_AUTH_PREWARM_START_DELAY_MS = 5e3;
const PROVIDER_AUTH_REWARM_DELAY_MS = 1e3;
const DEFERRED_SIDECAR_START_DELAY_MS = 100;
const SKIP_STARTUP_MODEL_PREWARM_ENV = "OPENCLAW_SKIP_STARTUP_MODEL_PREWARM";
const loadMainSessionRestartRecoveryModule = createLazyRuntimeModule(() => import("./main-session-restart-recovery-CY1fQWF5.js"));
const loadMainSessionRestartRecoveryMarkingModule = createLazyRuntimeModule(() => import("./main-session-restart-recovery-marking-BLpJyH8G.js"));
const loadAgentDefaultsModule = createLazyRuntimeModule(() => import("./defaults-RjT9WtG0.js"));
const loadAgentModelSelectionModule = createLazyRuntimeModule(() => import("./model-selection-0mI527hu.js"));
const loadInternalHooksModule = createLazyRuntimeModule(() => import("./internal-hooks-CBg3wstz.js"));
const loadGatewayRestartSentinelModule = createLazyRuntimeModule(() => import("./server-restart-sentinel-C4m8HNYm.js"));
/** Stop sidecars immediately when shutdown has already started before they are reported. */
function stopPostReadySidecarsAfterCloseStarted(params) {
	if (!params.closeStarted) return;
	for (const postReadySidecar of params.postReadySidecars) postReadySidecar.stop();
}
/** Measure provider-auth warming without letting event-loop stalls hide in wall time. */
async function measureProviderAuthWarm(run) {
	const eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
	eventLoopDelay.enable();
	const startMs = performance.now();
	try {
		await run();
	} finally {
		eventLoopDelay.disable();
	}
	return {
		elapsedMs: performance.now() - startMs,
		eventLoopMaxMs: eventLoopDelay.max / 1e6
	};
}
function formatProviderAuthWarmMetrics(metrics) {
	return `in ${metrics.elapsedMs.toFixed(0)}ms eventLoopMax=${metrics.eventLoopMaxMs.toFixed(1)}ms`;
}
function shouldCheckRestartSentinel(env = process.env) {
	return !env.VITEST && env.NODE_ENV !== "test";
}
function shouldSkipStartupModelPrewarm(env = process.env) {
	return isTruthyEnvValue(env[SKIP_STARTUP_MODEL_PREWARM_ENV]);
}
function schedulePostAttachUpdateSentinelRefresh(params) {
	setImmediate(() => {
		runWithGatewayIndependentRootWorkAdmission(async () => {
			await measureStartup(params.startupTrace, "post-attach.update-sentinel", async () => {
				await params.refreshLatestUpdateRestartSentinel();
			});
		}).catch((err) => {
			params.log.warn(`restart sentinel refresh failed: ${String(err)}`);
		});
	}).unref?.();
}
function scheduleProviderAuthStatePrewarm(params) {
	let stopped = false;
	let startupTimer;
	let rewarmTimer;
	let rewarmInFlight = false;
	let pendingRewarmReason;
	const isStopped = () => stopped;
	const delayMs = params.delayMs ?? PROVIDER_AUTH_PREWARM_START_DELAY_MS;
	runWithGatewayIndependentRootWorkAdmission(async () => {
		const [{ setAuthProfileFailureHook }, { clearCurrentProviderAuthState }] = await Promise.all([import("./failure-hook-DL7zdDho.js"), import("./model-provider-auth-state-CKEnjneK.js")]);
		const loadProviderAuthWarmModule = () => import("./model-provider-auth-Bncg9tWE.js");
		const runRewarm = async (reason) => {
			await runWithGatewayIndependentRootWorkAdmission(async () => {
				if (isStopped()) return;
				const cfg = params.getConfig();
				rewarmInFlight = true;
				try {
					const { warmCurrentProviderAuthStateOffMainThread } = await loadProviderAuthWarmModule();
					const metrics = await measureProviderAuthWarm(() => warmCurrentProviderAuthStateOffMainThread(cfg, { isCancelled: isStopped }));
					if (isStopped()) return;
					params.log.info(`provider auth state re-warmed (${reason}) ${formatProviderAuthWarmMetrics(metrics)}`);
				} catch (err) {
					params.log.warn(`provider auth state rewarm failed: ${String(err)}`);
				} finally {
					rewarmInFlight = false;
					const nextReason = pendingRewarmReason;
					pendingRewarmReason = void 0;
					if (nextReason && !isStopped()) scheduleAuthMapRewarm(nextReason);
				}
			});
		};
		const scheduleAuthMapRewarm = (reason) => {
			if (isStopped()) return;
			pendingRewarmReason = reason;
			if (rewarmTimer || rewarmInFlight) return;
			rewarmTimer = setTimeout(() => {
				rewarmTimer = void 0;
				const nextReason = pendingRewarmReason ?? reason;
				pendingRewarmReason = void 0;
				runRewarm(nextReason);
			}, PROVIDER_AUTH_REWARM_DELAY_MS);
			rewarmTimer.unref?.();
		};
		if (isStopped()) return;
		setAuthProfileFailureHook(() => {
			if (isStopped()) return;
			clearCurrentProviderAuthState();
			scheduleAuthMapRewarm("auth-profile-failure");
		});
		if (!params.startupWarmEnabled) return;
		startupTimer = setTimeout(() => {
			runWithGatewayIndependentRootWorkAdmission(async () => {
				if (isStopped()) return;
				const cfg = params.getConfig();
				const { warmCurrentProviderAuthStateOffMainThread } = await loadProviderAuthWarmModule();
				const metrics = await measureProviderAuthWarm(() => warmCurrentProviderAuthStateOffMainThread(cfg, { isCancelled: isStopped }));
				if (isStopped()) return;
				params.log.info(`provider auth state pre-warmed ${formatProviderAuthWarmMetrics(metrics)}`);
			}).catch((err) => {
				params.log.warn(`provider auth state pre-warm failed: ${String(err)}`);
			});
		}, Math.max(0, delayMs));
		startupTimer.unref?.();
	}).catch((err) => {
		params.log.warn(`provider auth state pre-warm setup failed: ${String(err)}`);
	});
	return { stop: () => {
		stopped = true;
		if (startupTimer) {
			clearTimeout(startupTimer);
			startupTimer = void 0;
		}
		if (rewarmTimer) {
			clearTimeout(rewarmTimer);
			rewarmTimer = void 0;
		}
	} };
}
function schedulePostReadySidecarTask(params) {
	let stopped = false;
	const abortController = new AbortController();
	const isStopped = () => stopped;
	const handle = setImmediate(() => {
		(async () => {
			await params.waitForPostReadyWork?.();
			if (isStopped()) return;
			await runWithGatewayIndependentRootWorkAdmission(async () => {
				await measureStartup(params.startupTrace, params.name, () => params.run(isStopped, abortController.signal));
			});
		})().catch((err) => {
			params.log.warn(`${params.name} failed after gateway ready: ${String(err)}`);
		});
	});
	handle.unref?.();
	return { stop: async () => {
		stopped = true;
		abortController.abort();
		clearImmediate(handle);
		await params.stop?.();
	} };
}
function scheduleGatewayGenerationTimer(params) {
	let stopped = false;
	let timer;
	const isStopped = () => stopped;
	timer = setTimeout(() => {
		timer = void 0;
		if (isStopped()) return;
		runWithGatewayIndependentRootWorkAdmission(async () => {
			await params.run(isStopped);
		}).catch((err) => {
			if (!isStopped()) params.onError(err);
		});
	}, params.delayMs);
	timer.unref?.();
	return { stop: () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	} };
}
function scheduleRestartSentinelWakeAfterReady(params) {
	return scheduleGatewayGenerationTimer({
		delayMs: 750,
		run: async (isStopped) => {
			const { scheduleRestartSentinelWake } = await loadGatewayRestartSentinelModule();
			if (isStopped()) return;
			await scheduleRestartSentinelWake({ deps: params.deps });
		},
		onError: (err) => params.log.warn(`restart sentinel wake failed to schedule: ${String(err)}`)
	});
}
function scheduleTranscriptsAutoStartSidecar(params) {
	let stopTranscriptsAutoStart;
	return schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.transcripts-auto-start",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		run: async (isStopped) => {
			const { createTranscriptsAutoStartService } = await import("./transcripts-tool-ZBhAZei-.js");
			if (isStopped()) return;
			const service = createTranscriptsAutoStartService({
				config: params.cfg,
				stateDir: resolveStateDir(),
				logger: params.log
			});
			stopTranscriptsAutoStart = () => service.stop();
			service.start();
		},
		stop: async () => {
			await stopTranscriptsAutoStart?.();
		}
	});
}
async function hasRestartSentinelFast(env = process.env) {
	return await hasRestartSentinel(env);
}
async function refreshLatestUpdateRestartSentinelIfPresent() {
	if (!await hasRestartSentinelFast()) return null;
	return await (await loadGatewayRestartSentinelModule()).refreshLatestUpdateRestartSentinel();
}
function hasGatewayStartHooks(pluginRegistry) {
	return pluginRegistry.typedHooks.some((hook) => hook.hookName === "gateway_start");
}
async function hasGatewayStartupInternalHookListeners() {
	const { hasInternalHookListeners } = await loadInternalHooksModule();
	return hasInternalHookListeners("gateway", "startup");
}
async function waitForAcpRuntimeBackendReady(params) {
	const { getAcpRuntimeBackend } = await import("./registry-BukgkQAe.js");
	const timeoutMs = params.timeoutMs ?? ACP_BACKEND_READY_TIMEOUT_MS;
	const pollMs = params.pollMs ?? ACP_BACKEND_READY_POLL_MS;
	const deadline = Date.now() + timeoutMs;
	do {
		const backend = getAcpRuntimeBackend(params.backendId);
		if (backend) try {
			if (!backend.healthy || backend.healthy()) return true;
		} catch {}
		await setTimeout$1(pollMs, void 0, { ref: false });
	} while (Date.now() < deadline);
	return false;
}
async function prewarmConfiguredPrimaryModel(params) {
	await publishConfiguredModelRuntimeSnapshots(params);
}
async function hydrateConfiguredExternalCliAuth(params) {
	const deps = params.deps ?? await Promise.all([
		import("./agent-scope-B7ocz6pI.js"),
		import("./prepared-model-runtime.configured-BFlXkMEV.js"),
		import("./store-Dc85tB1X.js"),
		import("./external-cli-discovery-BTVc_qCn.js")
	]).then(([scope, configured, store, external]) => ({
		listAgentIds: scope.listAgentIds,
		resolveAgentDir: scope.resolveAgentDir,
		collectConfiguredRefs: configured.collectPreparedModelRuntimeConfiguredRefs,
		hydrate: (agentDir, providers) => {
			const discovery = external.externalCliDiscoveryForProviders({
				cfg: params.cfg,
				providers
			});
			if (discovery.mode === "none") return;
			store.ensureAuthProfileStore(agentDir, {
				config: params.cfg,
				externalCli: discovery,
				allowKeychainPrompt: false,
				readOnly: true,
				syncExternalCli: false
			});
		}
	}));
	const hydratedDirs = /* @__PURE__ */ new Set();
	for (const agentId of deps.listAgentIds(params.cfg)) {
		const providers = deps.collectConfiguredRefs(params.cfg, agentId).flatMap(({ value }) => {
			const separator = value.indexOf("/");
			return separator > 0 ? [value.slice(0, separator)] : [];
		});
		const agentDir = deps.resolveAgentDir(params.cfg, agentId);
		if (providers.length === 0 || hydratedDirs.has(agentDir)) continue;
		hydratedDirs.add(agentDir);
		try {
			deps.hydrate(agentDir, providers);
		} catch (error) {
			params.log.warn(`startup external CLI auth hydration failed for agent ${agentId}: ${String(error)}`);
		}
	}
}
async function publishConfiguredModelRuntimeSnapshots(params) {
	const { refreshPreparedModelRuntimeSnapshots } = await import("./prepared-model-runtime-BmAY52y7.js");
	await refreshPreparedModelRuntimeSnapshots(params.cfg, {
		gatewayLifecycle: true,
		catalogMode: "static",
		allowGatewaySubagentBinding: true,
		...params.workspaceDir ? { defaultWorkspaceDir: params.workspaceDir } : {},
		...params.startupTrace ? { onBuildStats: (stats) => params.startupTrace?.detail("sidecars.model-runtime-build", [
			["agentCount", stats.agentCount],
			["workspaceGroupCount", stats.workspaceGroupCount],
			["configuredFactsGroupCount", stats.configuredFactsGroupCount],
			["catalogSourceCount", stats.catalogSourceCount],
			["credentialGroupCount", stats.credentialGroupCount],
			["catalogGroupCount", stats.catalogGroupCount],
			["runtimeRegistryCount", stats.runtimeRegistryCount],
			["configuredRuntimeModelCount", stats.configuredRuntimeModelCount],
			["generatedCatalogPluginCount", stats.generatedCatalogPluginCount],
			["generatedCatalogReadCount", stats.generatedCatalogReadCount],
			["workspaceFactsMs", stats.workspaceFactsMs],
			["runtimePluginMs", stats.runtimePluginMs],
			["pluginMetadataMs", stats.pluginMetadataMs],
			["staticProviderCatalogMs", stats.staticProviderCatalogMs],
			["ambientCredentialsMs", stats.ambientCredentialsMs],
			["agentFactsMs", stats.agentFactsMs],
			["configuredProjectionMs", stats.configuredProjectionMs],
			["catalogSourceMs", stats.catalogSourceMs],
			["registryMs", stats.registryMs],
			["sourceConcurrencyLimitCount", stats.sourceConcurrencyLimit],
			["fullCatalogConcurrencyLimitCount", stats.fullCatalogConcurrencyLimit]
		]) } : {}
	});
}
async function publishStartupModelRuntime(params, prewarm = prewarmConfiguredPrimaryModel) {
	await (shouldSkipStartupModelPrewarm() ? publishConfiguredModelRuntimeSnapshots : prewarm)(params);
}
/** Start post-ready sidecars such as channels, hooks, plugin services, and cleanup tasks. */
async function startGatewaySidecars(params) {
	const postReadySidecars = [];
	const internalHooksConfigured = hasConfiguredInternalHooks(params.cfg);
	await measureStartup(params.startupTrace, "sidecars.internal-hooks", async () => {
		try {
			if (internalHooksConfigured) {
				const [{ setInternalHooksEnabled }, { loadInternalHooks }] = await Promise.all([loadInternalHooksModule(), import("./loader-HA5fSJMb.js")]);
				setInternalHooksEnabled(params.cfg.hooks?.internal?.enabled !== false);
				const loadedCount = await loadInternalHooks(params.cfg, params.defaultWorkspaceDir);
				if (loadedCount > 0) {
					params.startupOutcomes?.record({
						subsystem: "internal-hooks",
						status: "loaded"
					});
					params.logHooks.info(`loaded ${loadedCount} internal hook handler${loadedCount > 1 ? "s" : ""}`);
				} else params.startupOutcomes?.record({
					subsystem: "internal-hooks",
					status: "skipped",
					reason: "no-handlers-loaded"
				});
			}
		} catch (err) {
			params.startupOutcomes?.record({
				subsystem: "internal-hooks",
				status: "failed",
				reason: "see earlier log"
			});
			params.logHooks.error(`failed to load hooks: ${String(err)}`);
		}
	});
	const skipChannels = isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS);
	await measureStartup(params.startupTrace, "sidecars.main-session-recovery", async () => {
		try {
			const { markStartupOrphanedMainSessionsForRecovery } = await measureStartup(params.startupTrace, "sidecars.main-session-recovery-load", loadMainSessionRestartRecoveryMarkingModule);
			await measureStartup(params.startupTrace, "sidecars.main-session-recovery-scan", () => markStartupOrphanedMainSessionsForRecovery({ cfg: params.cfg }));
		} catch (err) {
			params.log.warn(`main-session startup orphan marking failed before channel startup: ${String(err)}`);
		}
	});
	await measureStartup(params.startupTrace, "sidecars.model-auth", () => hydrateConfiguredExternalCliAuth({
		cfg: params.cfg,
		log: params.log
	}));
	await measureStartup(params.startupTrace, "sidecars.model-runtime", () => publishStartupModelRuntime({
		cfg: params.cfg,
		workspaceDir: params.defaultWorkspaceDir,
		log: params.log,
		startupTrace: params.startupTrace
	}, params.prewarmPrimaryModel));
	await measureStartup(params.startupTrace, "sidecars.reply-runtime", async () => {
		const { prewarmConfigDrivenReplyRuntime } = await loadGetReplyFromConfigRuntime();
		await prewarmConfigDrivenReplyRuntime();
	});
	await measureStartup(params.startupTrace, "sidecars.chat-metadata", async () => {
		await params.refreshChatMetadata?.();
	});
	await measureStartup(params.startupTrace, "sidecars.channels", async () => {
		if (!skipChannels) try {
			await measureStartup(params.startupTrace, "sidecars.channel-start", () => params.startChannels());
		} catch (err) {
			params.logChannels.error(`channel startup failed: ${String(err)}`);
		}
		else await measureStartup(params.startupTrace, "sidecars.channel-skip", () => params.logChannels.info("skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)"));
	});
	await params.onChannelsStarted?.();
	let pluginServices = params.shouldStartPluginServices?.() === false ? null : await measureStartup(params.startupTrace, "sidecars.plugin-services", async () => {
		try {
			const { startPluginServices } = await import("./services-ELgLocJn.js");
			return await startPluginServices({
				registry: params.pluginRegistry,
				config: params.cfg,
				workspaceDir: params.defaultWorkspaceDir,
				startupTrace: params.startupTrace,
				broadcastPluginEvent: params.broadcastPluginEvent
			});
		} catch (err) {
			params.log.warn(`plugin services failed to start: ${String(err)}`);
			return null;
		}
	});
	if (pluginServices && params.shouldStartPluginServices?.() === false) {
		await pluginServices.stop().catch((err) => {
			params.log.warn(`plugin services stop after close failed: ${String(err)}`);
		});
		pluginServices = null;
	}
	params.onPluginServices?.(pluginServices);
	if (internalHooksConfigured || await hasGatewayStartupInternalHookListeners()) {
		params.startupOutcomes?.record({
			subsystem: "internal-startup-hook",
			status: "scheduled"
		});
		postReadySidecars.push(scheduleGatewayGenerationTimer({
			delayMs: 250,
			run: async (isStopped) => {
				const { createInternalHookEvent, triggerInternalHook } = await loadInternalHooksModule();
				if (isStopped()) return;
				await triggerInternalHook(createInternalHookEvent("gateway", "startup", "gateway:startup", {
					cfg: params.cfg,
					deps: params.deps,
					workspaceDir: params.defaultWorkspaceDir
				}));
			},
			onError: (err) => params.logHooks.warn(`gateway startup hook failed: ${String(err)}`)
		}));
	}
	if (params.cfg.acp?.enabled) runWithGatewayIndependentRootWorkAdmission(async () => {
		const ready = await measureStartup(params.startupTrace, "sidecars.acp.runtime-ready", () => waitForAcpRuntimeBackendReady({ backendId: params.cfg.acp?.backend }));
		params.startupTrace?.detail("sidecars.acp.runtime-ready", [["readyCount", ready ? 1 : 0], ["backend", params.cfg.acp?.backend ?? "default"]]);
		await measureStartup(params.startupTrace, "sidecars.acp.identity-reconcile", async () => {
			const [{ getAcpSessionManager }, { ACP_SESSION_IDENTITY_RENDERER_VERSION }] = await Promise.all([import("./acp/control-plane/manager.js"), import("./acp-core/runtime/session-identifiers.js")]);
			const result = await getAcpSessionManager().reconcilePendingSessionIdentities({ cfg: params.cfg });
			if (result.checked === 0) return;
			params.log.warn(`acp startup identity reconcile (renderer=${ACP_SESSION_IDENTITY_RENDERER_VERSION}): checked=${result.checked} resolved=${result.resolved} failed=${result.failed}`);
		});
	}).catch((err) => {
		params.log.warn(`acp startup identity reconcile failed: ${String(err)}`);
	});
	let restartSentinelWake;
	postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.restart-sentinel",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		run: async (isStopped) => {
			if (!shouldCheckRestartSentinel() || isStopped()) return;
			if (!await hasRestartSentinelFast() || isStopped()) return;
			restartSentinelWake = scheduleRestartSentinelWakeAfterReady({
				deps: params.deps,
				log: params.log
			});
		},
		stop: async () => {
			await restartSentinelWake?.stop();
		}
	}));
	if (params.cfg.hooks?.enabled && params.cfg.hooks.gmail?.account) postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.gmail-watch",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		run: async (isStopped, signal) => {
			const { startGmailWatcherWithLogs } = await import("./gmail-watcher-lifecycle-Bw0C-oXO.js");
			if (isStopped()) return;
			await startGmailWatcherWithLogs({
				cfg: params.cfg,
				log: params.logHooks,
				isCancelled: isStopped,
				signal
			});
		}
	}));
	if (params.cfg.hooks?.gmail?.model) postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.gmail-model",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		run: async (isStopped) => {
			const [{ DEFAULT_MODEL, DEFAULT_PROVIDER }, { loadPreparedModelCatalog }, { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel }] = await Promise.all([
				loadAgentDefaultsModule(),
				import("./prepared-model-catalog-BGLDTo2i.js"),
				loadAgentModelSelectionModule()
			]);
			if (isStopped()) return;
			const hooksModelRef = resolveHooksGmailModel({
				cfg: params.cfg,
				defaultProvider: DEFAULT_PROVIDER
			});
			if (hooksModelRef) {
				const { provider: resolvedDefaultProvider, model: defaultModel } = resolveConfiguredModelRef({
					cfg: params.cfg,
					defaultProvider: DEFAULT_PROVIDER,
					defaultModel: DEFAULT_MODEL
				});
				const catalog = await loadPreparedModelCatalog({
					config: params.cfg,
					readOnly: true,
					providerDiscoveryProviderIds: [hooksModelRef.provider],
					scopedLiveProviderDiscovery: true
				});
				const status = getModelRefStatus({
					cfg: params.cfg,
					catalog,
					ref: hooksModelRef,
					defaultProvider: resolvedDefaultProvider,
					defaultModel
				});
				if (!status.allowed) params.logHooks.warn(`hooks.gmail.model "${status.key}" not allowed by agents.defaults.modelPolicy.allow (will use primary instead)`);
				if (!status.inCatalog) params.logHooks.warn(`hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`);
			}
		}
	}));
	return {
		pluginServices,
		postReadySidecars
	};
}
const defaultGatewayPostAttachRuntimeDeps = {
	getGlobalHookRunner: async () => (await import("./plugins/hook-runner-global.js")).getGlobalHookRunner(),
	logGatewayStartup: async (params) => (await import("./server-startup-log-DDIEUfpZ.js")).logGatewayStartup(params),
	refreshLatestUpdateRestartSentinel: refreshLatestUpdateRestartSentinelIfPresent,
	scheduleGatewayUpdateCheck: async (...args) => (await import("./update-startup-dh_5Q2z9.js")).scheduleGatewayUpdateCheck(...args),
	startGatewaySidecars,
	warmSystemCa: warmMacOSSystemCaOffMainThread,
	startGatewayTailscaleExposure: async (...args) => (await import("./server-tailscale-DqPrw0uc.js")).startGatewayTailscaleExposure(...args)
};
function createDeferredGatewayUpdateCheck(params) {
	let started = false;
	let stopped = false;
	let stopUpdateCheck = null;
	let latestUpdateAvailable = null;
	let latestSchedule;
	const broadcastUpdateAvailable = (payload) => {
		const detailedConnIds = params.getClientConnIds((client) => canReadDetailedUpdateMetadata(client.connect.role ?? "operator", client.connect.scopes ?? []));
		const legacyConnIds = new Set(params.getClientConnIds());
		for (const connId of detailedConnIds) legacyConnIds.delete(connId);
		params.broadcastToConnIds(GATEWAY_EVENT_UPDATE_AVAILABLE, payload, detailedConnIds, { dropIfSlow: true });
		params.broadcastToConnIds(GATEWAY_EVENT_UPDATE_AVAILABLE, { updateAvailable: projectUpdateAvailable(payload.updateAvailable, false) ?? null }, legacyConnIds, { dropIfSlow: true });
	};
	const stop = () => {
		stopped = true;
		stopUpdateCheck?.();
		stopUpdateCheck = null;
	};
	const start = () => {
		if (started || stopped) return;
		started = true;
		(async () => {
			await params.waitForPostReadyWork?.();
			if (stopped) return;
			setImmediate(() => {
				if (stopped) return;
				runWithGatewayIndependentRootWorkAdmission(async () => await measureStartup(params.startupTrace, "post-attach.update-check", () => params.runtimeDeps.scheduleGatewayUpdateCheck({
					cfg: params.cfg,
					log: params.log,
					isNixMode: params.isNixMode,
					...params.activeWorkInspectors ? { activeWorkInspectors: params.activeWorkInspectors } : {},
					onUpdateAvailableChange: (updateAvailable) => {
						latestUpdateAvailable = updateAvailable;
						const payload = {
							updateAvailable,
							...latestSchedule ? { schedule: latestSchedule } : {}
						};
						broadcastUpdateAvailable(payload);
					},
					onUpdateScheduleChange: (schedule) => {
						latestSchedule = schedule;
						broadcastUpdateAvailable({
							updateAvailable: latestUpdateAvailable,
							schedule
						});
					}
				}))).then((nextStop) => {
					if (stopped) {
						nextStop();
						return;
					}
					stopUpdateCheck = nextStop;
				}).catch((err) => {
					if (stopped) return;
					params.log.warn(`gateway update check failed to start: ${String(err)}`);
				});
			});
		})().catch((err) => {
			if (!stopped) params.log.warn(`gateway update check readiness wait failed: ${String(err)}`);
		});
	};
	return {
		start,
		stop
	};
}
/** Start work that depends on the HTTP server being attached and visible. */
async function startGatewayPostAttachRuntime(params, runtimeDeps = defaultGatewayPostAttachRuntimeDeps) {
	const controlUiRootLifecycle = params.controlUiRootLifecycle;
	let controlUiAssetsSidecar;
	params.residentRegistry.register({
		name: "control-ui-assets",
		start: () => {
			controlUiAssetsSidecar = !params.minimalTestGateway && controlUiRootLifecycle?.state?.kind === "preparing" ? schedulePostReadySidecarTask({
				name: "sidecars.control-ui-assets",
				startupTrace: params.startupTrace,
				log: params.log,
				run: controlUiRootLifecycle.start,
				stop: controlUiRootLifecycle.stop
			}) : void 0;
			if (controlUiAssetsSidecar) params.onGatewayLifetimeSidecars?.([controlUiAssetsSidecar]);
			return controlUiAssetsSidecar;
		},
		stop: async () => await controlUiAssetsSidecar?.stop()
	}).start();
	if (!params.minimalTestGateway) await measureStartup(params.startupTrace, "post-attach.system-ca", () => runtimeDeps.warmSystemCa({ log: params.log }));
	let pluginRegistry = params.pluginRegistry;
	let startupPluginsLoaded = false;
	let startupPluginsLoadPromise = null;
	const loadStartupPluginsIfNeeded = async () => {
		if (params.minimalTestGateway || !params.loadStartupPlugins) return {
			pluginRegistry,
			gatewayMethods: []
		};
		if (startupPluginsLoaded) return {
			pluginRegistry,
			gatewayMethods: []
		};
		startupPluginsLoadPromise ??= (async () => {
			params.onStartupPluginsLoading?.();
			const loaded = await measureStartup(params.startupTrace, "plugins.runtime-post-bind", () => params.loadStartupPlugins());
			pluginRegistry = loaded.pluginRegistry;
			startupPluginsLoaded = true;
			params.startupTrace?.detail("plugins.runtime-post-bind", [["loadedPluginCount", pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").length], ["gatewayMethodCount", loaded.gatewayMethods.length]]);
			await params.onStartupPluginsLoaded?.(loaded);
			return loaded;
		})();
		return await startupPluginsLoadPromise;
	};
	const startupPluginsResident = params.residentRegistry.register({
		name: "startup-plugin-load",
		start: loadStartupPluginsIfNeeded,
		stop: () => {}
	});
	await startupPluginsResident.start();
	const startupOutcomes = createGatewayStartupOutcomeRecorder({
		cfg: params.gatewayPluginConfigAtStart,
		gatewayStartHooks: hasGatewayStartHooks(pluginRegistry)
	});
	const startupLogPromise = measureStartup(params.startupTrace, "post-attach.log", () => runtimeDeps.logGatewayStartup({
		cfg: params.cfgAtStart,
		activationSourceConfig: params.activationSourceConfig,
		env: process.env,
		manifestRecords: params.pluginManifestRecords,
		...params.ambientEnvTriggers ? { ambientEnvTriggers: params.ambientEnvTriggers } : {},
		bindHost: params.bindHost,
		bindHosts: params.bindHosts,
		port: params.port,
		tlsEnabled: params.tlsEnabled,
		loadedPluginIds: pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id),
		log: params.log,
		isNixMode: params.isNixMode,
		startupStartedAt: params.startupStartedAt
	}));
	const updateCheck = params.minimalTestGateway ? {
		start: () => {},
		stop: () => {}
	} : createDeferredGatewayUpdateCheck({
		startupTrace: params.startupTrace,
		runtimeDeps,
		cfg: params.cfgAtStart,
		log: params.log,
		isNixMode: params.isNixMode,
		broadcastToConnIds: params.broadcastToConnIds,
		getClientConnIds: params.getClientConnIds,
		waitForPostReadyWork: params.waitForPostReadyWork,
		activeWorkInspectors: params.activeWorkInspectors
	});
	const updateCheckResident = params.residentRegistry.register({
		name: "update-check",
		start: updateCheck.start,
		stop: updateCheck.stop
	});
	let tailscaleCleanupPromise;
	params.residentRegistry.register({
		name: "tailscale-exposure",
		start: () => {
			tailscaleCleanupPromise = params.minimalTestGateway ? Promise.resolve(null) : params.tailscaleMode === "off" && !params.resetOnExit ? Promise.resolve(null) : measureStartup(params.startupTrace, "post-attach.tailscale", () => runtimeDeps.startGatewayTailscaleExposure({
				tailscaleMode: params.tailscaleMode,
				resetOnExit: params.resetOnExit,
				serviceName: params.serviceName,
				preserveFunnel: params.preserveFunnel,
				port: params.port,
				controlUiBasePath: params.controlUiBasePath,
				logTailscale: params.logTailscale
			}));
			return tailscaleCleanupPromise;
		},
		stop: async () => await (await tailscaleCleanupPromise)?.()
	}).start();
	let pluginServicesReported = false;
	let reportedPluginServices = null;
	const reportPluginServices = (pluginServices) => {
		pluginServicesReported = true;
		reportedPluginServices = pluginServices;
		params.onPluginServices?.(pluginServices);
	};
	const waitForSidecarStartTurn = () => new Promise((resolve) => {
		if (params.sidecarStartup === "defer") {
			setTimeout(resolve, DEFERRED_SIDECAR_START_DELAY_MS).unref?.();
			return;
		}
		setImmediate(resolve);
	});
	const startSidecars = () => params.minimalTestGateway ? Promise.resolve({
		pluginServices: null,
		pluginRegistry,
		postReadySidecars: [],
		gatewayLifetimeSidecars: []
	}) : waitForSidecarStartTurn().then(async () => {
		await startupPluginsResident.start();
		const workerEnvironmentSidecar = params.isClosing?.() ? null : await params.startWorkerEnvironmentRuntime?.() ?? null;
		params.log.info("starting channels and sidecars...");
		const loaderStatsBefore = getPluginModuleLoaderStats();
		const result = await (async () => {
			try {
				return await measureStartup(params.startupTrace, "sidecars.total", () => runtimeDeps.startGatewaySidecars({
					cfg: params.gatewayPluginConfigAtStart,
					pluginRegistry,
					defaultWorkspaceDir: params.defaultWorkspaceDir,
					deps: params.deps,
					startChannels: params.startChannels,
					refreshChatMetadata: params.refreshChatMetadata,
					log: params.log,
					logHooks: params.logHooks,
					logChannels: params.logChannels,
					startupTrace: params.startupTrace,
					onChannelsStarted: params.onChannelsStarted,
					onPluginServices: reportPluginServices,
					shouldStartPluginServices: () => params.isClosing?.() !== true,
					broadcastPluginEvent: params.broadcastPluginEvent,
					startupOutcomes,
					waitForPostReadyWork: params.waitForPostReadyWork
				}));
			} catch (error) {
				await workerEnvironmentSidecar?.stop();
				throw error;
			}
		})();
		const loaderStatsAfter = getPluginModuleLoaderStats();
		params.startupTrace?.detail("sidecars.plugin-loader", [
			["callsCount", loaderStatsAfter.calls - loaderStatsBefore.calls],
			["nativeHitsCount", loaderStatsAfter.nativeHits - loaderStatsBefore.nativeHits],
			["nativeMissesCount", loaderStatsAfter.nativeMisses - loaderStatsBefore.nativeMisses],
			["sourceTransformForcedCount", loaderStatsAfter.sourceTransformForced - loaderStatsBefore.sourceTransformForced],
			["sourceTransformFallbacksCount", loaderStatsAfter.sourceTransformFallbacks - loaderStatsBefore.sourceTransformFallbacks]
		]);
		let mainSessionRecoverySidecar;
		try {
			if (params.isClosing?.() !== true) {
				const { scheduleRestartAbortedMainSessionRecovery } = await loadMainSessionRestartRecoveryModule();
				if (params.isClosing?.() !== true) mainSessionRecoverySidecar = scheduleRestartAbortedMainSessionRecovery({
					delayMs: 0,
					getConfig: params.getConfig,
					shouldContinue: () => params.isClosing?.() !== true,
					waitForStart: params.waitForPostReadyWork,
					gatewayRuntime: params.recoveryRuntime
				});
			}
		} catch (err) {
			params.log.warn(`main-session restart recovery failed to schedule: ${String(err)}`);
		}
		try {
			const { scheduleSubagentRegistrySweep } = await import("./subagent-registry-CpjELXpy.js");
			scheduleSubagentRegistrySweep();
		} catch (err) {
			params.log.warn(`subagent restart recovery failed to schedule: ${String(err)}`);
		}
		params.unlockStartupMethods();
		if (!pluginServicesReported) reportPluginServices(result.pluginServices);
		const postReadySidecars = [...result.postReadySidecars];
		const gatewayLifetimeSidecars = [
			...controlUiAssetsSidecar ? [controlUiAssetsSidecar] : [],
			scheduleContextCachePrewarm(params),
			scheduleGatewayHandlerPrewarm(params),
			...mainSessionRecoverySidecar ? [mainSessionRecoverySidecar] : []
		];
		if (workerEnvironmentSidecar) gatewayLifetimeSidecars.push(workerEnvironmentSidecar);
		if (params.providerAuthPrewarm && params.providerAuthPrewarm.enabled !== false) gatewayLifetimeSidecars.push(scheduleProviderAuthStatePrewarm({
			getConfig: params.providerAuthPrewarm.getConfig ?? (() => params.cfgAtStart),
			log: params.log,
			delayMs: params.providerAuthPrewarm.delayMs,
			startupWarmEnabled: params.providerAuthPrewarm.enabled === true
		}));
		if (params.gatewayPluginConfigAtStart.transcripts?.autoStart?.length) gatewayLifetimeSidecars.push(scheduleTranscriptsAutoStartSidecar({
			cfg: params.gatewayPluginConfigAtStart,
			startupTrace: params.startupTrace,
			log: params.log,
			waitForPostReadyWork: params.waitForPostReadyWork
		}));
		params.onPostReadySidecars?.(postReadySidecars);
		params.onGatewayLifetimeSidecars?.(gatewayLifetimeSidecars);
		params.log.info(formatGatewayStartupOutcomes(startupOutcomes.snapshot()));
		params.onSidecarsReady?.();
		params.startupTrace?.detail("sidecars.ready", [["loadedPluginCount", pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").length], ["postReadySidecarCount", postReadySidecars.length + gatewayLifetimeSidecars.length]]);
		params.startupTrace?.mark("sidecars.ready");
		if (params.sidecarStartup !== "defer") params.log.info("gateway ready");
		return {
			...result,
			postReadySidecars,
			gatewayLifetimeSidecars,
			pluginRegistry
		};
	});
	let startedSidecars;
	const sidecarSequenceResident = params.residentRegistry.register({
		name: "sidecar-sequence",
		start: () => {
			startedSidecars ??= startSidecars();
			return startedSidecars;
		},
		stop: async () => {
			const result = await startedSidecars;
			for (const sidecar of result?.postReadySidecars ?? []) await sidecar.stop();
		}
	});
	const sidecarsPromise = params.residentRegistry.register({
		name: "per-config-sidecars",
		start: sidecarSequenceResident.start,
		stop: async () => {
			const result = await startedSidecars;
			for (const sidecar of result?.gatewayLifetimeSidecars ?? []) await sidecar.stop();
		}
	}).start();
	sidecarsPromise.then(async (sidecarsResult) => {
		if (params.minimalTestGateway) return;
		await params.waitForPostReadyWork?.();
		if (params.isClosing?.()) return;
		schedulePostAttachUpdateSentinelRefresh({
			startupTrace: params.startupTrace,
			log: params.log,
			refreshLatestUpdateRestartSentinel: runtimeDeps.refreshLatestUpdateRestartSentinel
		});
		setImmediate(() => {
			sweepSessionStateWatchNotices();
		}).unref?.();
		if (!hasGatewayStartHooks(sidecarsResult.pluginRegistry)) return;
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		const hookRunner = await runtimeDeps.getGlobalHookRunner();
		if (hookRunner?.hasHooks("gateway_start")) {
			const { withPluginHttpRouteRegistry } = await import("./http-registry-DwnjBWcs.js");
			runWithGatewayIndependentRootWorkAdmission(async () => {
				await withPluginHttpRouteRegistry(sidecarsResult.pluginRegistry, () => hookRunner.runGatewayStart({ port: params.port }, {
					port: params.port,
					config: params.gatewayPluginConfigAtStart,
					workspaceDir: params.defaultWorkspaceDir,
					getCron: () => params.getCronService?.() ?? params.deps.cron
				}));
			}).catch((err) => {
				params.log.warn(`gateway_start hook failed: ${String(err)}`);
			});
		}
	}).catch((err) => {
		params.log.warn(`gateway sidecars failed to start: ${String(err)}`);
	});
	if (params.sidecarStartup !== "defer") {
		const [, tailscaleCleanup, sidecarsResult] = await Promise.all([
			startupLogPromise,
			tailscaleCleanupPromise,
			sidecarsPromise
		]);
		updateCheckResident.start();
		return {
			stopGatewayUpdateCheck: updateCheckResident.stop,
			tailscaleCleanup,
			pluginServices: sidecarsResult.pluginServices
		};
	}
	const [, tailscaleCleanup] = await Promise.all([startupLogPromise, tailscaleCleanupPromise]);
	updateCheckResident.start();
	return {
		stopGatewayUpdateCheck: updateCheckResident.stop,
		tailscaleCleanup,
		pluginServices: reportedPluginServices
	};
}
const testing = {
	providerAuthPrewarmStartDelayMs: PROVIDER_AUTH_PREWARM_START_DELAY_MS,
	hasRestartSentinelFast,
	prewarmConfiguredPrimaryModel,
	hydrateConfiguredExternalCliAuth,
	publishConfiguredModelRuntimeSnapshots,
	publishStartupModelRuntime,
	refreshLatestUpdateRestartSentinelIfPresent,
	scheduleProviderAuthStatePrewarm,
	scheduleRestartSentinelWakeAfterReady,
	shouldSkipStartupModelPrewarm,
	stopPostReadySidecarsAfterCloseStarted
};
//#endregion
export { startGatewayPostAttachRuntime, startGatewaySidecars, stopPostReadySidecarsAfterCloseStarted, testing };
