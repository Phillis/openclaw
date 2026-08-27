import { s as sleepWithAbort, t as RetrySupervisor } from "./src-BQ327IOM.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { r as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { p as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { i as listChannelPlugins, o as resolveChannelPluginRegistration, t as getChannelPlugin } from "./registry-B3yYjPW1.js";
import { n as resolveChannelApprovalCapability } from "./plugins-cwOWOggC.js";
import "./backoff-BkMI1WEL.js";
import { o as clearActiveCredentialDegradedOwner, p as setActiveCredentialDegradedOwner, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DqIBoQI-.js";
import { n as resolveNormalizedAccountEntry, t as resolveAccountEntry } from "./account-lookup-gtl3eJfy.js";
import { r as resetDirectoryCache } from "./target-resolver--eBeHIN9.js";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-C-WC19Mc.js";
import { t as getCredentialUnavailableDiagnostics } from "./account-snapshot-fields-BFfRc-QZ.js";
import { n as withGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-BSAo6TQe.js";
import { n as withPluginCommandAccountStartScope } from "./plugin-command-account-start-scope-Dr3w7h_I.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-Tv9LYgST.js";
import { a as isExecApprovalChannelRuntimeTerminalStartError } from "./approval-native-runtime-B1NZ5UJq.js";
import { n as createChannelApprovalHandlerFromCapability } from "./approval-handler-runtime-DTi_kV6g.js";
import { i as watchChannelRuntimeContexts, n as getChannelRuntimeContext, r as registerChannelRuntimeContext, t as createTaskScopedChannelRuntime } from "./channel-runtime-context-gztTEkoq.js";
import { n as isChannelIngressUnavailableError } from "./ingress-unavailable-BoKetfUD.js";
import { i as resolveChannelAccountState, t as applyChannelAccountState } from "./account-state-Bav3alE5.js";
import { n as withPluginHttpRouteRegistry } from "./http-registry-Rr5OP2r6.js";
import { i as formatGatewayCrashLoopManualChannelStartHint } from "./gateway-boot-lifecycle-_xaa0ZpV.js";
//#region src/infra/approval-handler-bootstrap.ts
const APPROVAL_HANDLER_BOOTSTRAP_RETRY_MS = 1e3;
function isRetryableApprovalBootstrapStartError(error) {
	const message = String(error);
	return message.includes("gateway readiness unavailable before approval client start") || message.includes("gateway approval client start aborted before readiness") || message.includes("gateway readiness unavailable before exec approval runtime start") || message.includes("gateway approval runtime start aborted before readiness") || message.includes("gateway event loop readiness timeout") || message.includes("gateway starting") || message.includes("code=1013") || message.includes("close code 1013");
}
function formatRetryableApprovalBootstrapStartError(error) {
	const message = String(error);
	if (message.includes("gateway event loop readiness timeout")) return "gateway readiness unavailable before approval handler start";
	return message;
}
/** Starts the native approval handler for a channel runtime context and returns its cleanup hook. */
async function startChannelApprovalHandlerBootstrap(params) {
	const capability = resolveChannelApprovalCapability(params.plugin);
	if (!capability?.nativeRuntime || !params.channelRuntime) return async () => {};
	const channelLabel = params.plugin.meta.label || params.plugin.id;
	const logger = params.logger ?? createSubsystemLogger(`${params.plugin.id}/approval-bootstrap`);
	let activeGeneration = 0;
	let activeHandler = null;
	let retryTimer = null;
	const invalidateActiveHandler = () => {
		activeGeneration += 1;
	};
	const clearRetryTimer = () => {
		if (!retryTimer) return;
		clearTimeout(retryTimer);
		retryTimer = null;
	};
	const stopHandler = async () => {
		const handler = activeHandler;
		activeHandler = null;
		if (!handler) return;
		await handler.stop();
	};
	const startHandlerForContext = async (context, generation) => {
		if (generation !== activeGeneration) return;
		await stopHandler();
		if (generation !== activeGeneration) return;
		const handler = await withGatewayNativeApprovalRuntime(params.gatewayRuntime, () => createChannelApprovalHandlerFromCapability({
			capability,
			label: `${params.plugin.id}/native-approvals`,
			clientDisplayName: `${channelLabel} Native Approvals (${params.accountId})`,
			channel: params.plugin.id,
			channelLabel,
			cfg: params.cfg,
			accountId: params.accountId,
			context
		}));
		if (!handler) return;
		if (generation !== activeGeneration) {
			await handler.stop().catch(() => {});
			return;
		}
		activeHandler = handler;
		try {
			await withGatewayNativeApprovalRuntime(params.gatewayRuntime, () => handler.start());
		} catch (error) {
			if (activeHandler === handler) activeHandler = null;
			await handler.stop().catch(() => {});
			throw error;
		}
	};
	const spawn = (label, promise) => {
		promise.catch((error) => {
			logger.error(`${label}: ${String(error)}`);
		});
	};
	const scheduleRetryForContext = (context, generation) => {
		if (generation !== activeGeneration) return;
		clearRetryTimer();
		retryTimer = setTimeout(() => {
			retryTimer = null;
			if (generation !== activeGeneration) return;
			spawn("failed to retry native approval handler", startHandlerForRegisteredContext(context, generation));
		}, APPROVAL_HANDLER_BOOTSTRAP_RETRY_MS);
		retryTimer.unref?.();
	};
	const startHandlerForRegisteredContext = async (context, generation) => {
		try {
			await startHandlerForContext(context, generation);
		} catch (error) {
			if (generation === activeGeneration) {
				if (isExecApprovalChannelRuntimeTerminalStartError(error)) {
					logger.error(`native approval handler disabled: ${String(error)}`);
					return;
				}
				if (isRetryableApprovalBootstrapStartError(error)) {
					logger.warn(`native approval handler deferred until gateway readiness recovers: ${formatRetryableApprovalBootstrapStartError(error)}`);
					scheduleRetryForContext(context, generation);
					return;
				}
				logger.error(`failed to start native approval handler: ${String(error)}`);
				scheduleRetryForContext(context, generation);
			}
		}
	};
	const unsubscribe = watchChannelRuntimeContexts({
		channelRuntime: params.channelRuntime,
		channelId: params.plugin.id,
		accountId: params.accountId,
		capability: "approval.native",
		onEvent: (event) => {
			if (event.type === "registered") {
				clearRetryTimer();
				invalidateActiveHandler();
				const generation = activeGeneration;
				spawn("failed to start native approval handler", startHandlerForRegisteredContext(event.context, generation));
				return;
			}
			clearRetryTimer();
			invalidateActiveHandler();
			spawn("failed to stop native approval handler", stopHandler());
		}
	}) ?? (() => {});
	const existingContext = getChannelRuntimeContext({
		channelRuntime: params.channelRuntime,
		channelId: params.plugin.id,
		accountId: params.accountId,
		capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY
	});
	if (existingContext !== void 0) {
		clearRetryTimer();
		invalidateActiveHandler();
		spawn("failed to start native approval handler", startHandlerForRegisteredContext(existingContext, activeGeneration));
	}
	return async () => {
		unsubscribe();
		clearRetryTimer();
		invalidateActiveHandler();
		await stopHandler();
	};
}
//#endregion
//#region src/gateway/server-channels.ts
const RESTART_POLICY = {
	initialMs: 5e3,
	maxMs: 5 * 6e4,
	factor: 2,
	jitter: .1
};
const MAX_RESTARTS = 10;
const CHANNEL_STABLE_RUN_MS = RESTART_POLICY.maxMs;
const CHANNEL_STOP_ABORT_TIMEOUT_MS = 5e3;
const CHANNEL_STARTUP_CONCURRENCY = 4;
const CHANNEL_APPROVAL_GATEWAY_RUNTIME_CONTEXT_CAPABILITY = "approval.gateway";
function waitForChannelStartupHandoff() {
	return new Promise((resolve) => {
		setImmediate(resolve).unref?.();
	});
}
function sanitizeAbortedTaskStatusPatch(patch, current) {
	const next = { ...patch };
	delete next.running;
	delete next.restartPending;
	delete next.reconnectAttempts;
	delete next.lastStartAt;
	delete next.lastStopAt;
	delete next.lifecycle;
	if (next.connected === true) {
		delete next.connected;
		delete next.lastConnectedAt;
		delete next.lastEventAt;
		delete next.lastTransportActivityAt;
	}
	if (next.lastError === null && current.lastError) delete next.lastError;
	return next;
}
function createRuntimeStore() {
	return {
		aborts: /* @__PURE__ */ new Map(),
		pluginCommandCatalogOwners: /* @__PURE__ */ new Map(),
		starting: /* @__PURE__ */ new Map(),
		stops: /* @__PURE__ */ new Map(),
		tasks: /* @__PURE__ */ new Map(),
		runtimes: /* @__PURE__ */ new Map()
	};
}
function resolveDefaultRuntime(channelId) {
	return getChannelPlugin(channelId)?.status?.defaultRuntime ?? { accountId: "default" };
}
function cloneDefaultRuntime(channelId, accountId) {
	return {
		...resolveDefaultRuntime(channelId),
		accountId
	};
}
async function waitForChannelStopGracefully(task, timeoutMs) {
	if (!task) return true;
	return await new Promise((resolve) => {
		let settled = false;
		const timer = setTimeout(() => {
			if (!settled) {
				settled = true;
				resolve(false);
			}
		}, timeoutMs);
		timer.unref?.();
		const resolveSettled = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve(true);
		};
		task.then(resolveSettled, resolveSettled);
	});
}
async function waitForDeferredAccountStart(deferred, abortSignal) {
	if (abortSignal.aborted) return;
	await Promise.race([deferred, new Promise((resolve) => {
		abortSignal.addEventListener("abort", () => resolve(), { once: true });
	})]);
}
function createChannelManager(opts) {
	const { getRuntimeConfig, channelLogs, channelRuntimeEnvs, channelRuntime, resolveChannelRuntime, getPluginHttpRouteRegistry, startupTrace } = opts;
	const channelStores = /* @__PURE__ */ new Map();
	const restarts = /* @__PURE__ */ new Map();
	const manuallyStopped = /* @__PURE__ */ new Set();
	const recoveryStopTimedOut = /* @__PURE__ */ new Set();
	const recoveryStartRequested = /* @__PURE__ */ new Set();
	const pendingAutoRestarts = /* @__PURE__ */ new Set();
	let autostartSuppression = null;
	let ambientAutostartSuppressedChannelIds = new Set(opts.ambientAutostartSuppressedChannelIds ?? []);
	const restartKey = (channelId, accountId) => `${channelId}:${accountId}`;
	const clearPluginCommandCatalogOwner = (store, accountId, owner) => {
		if (owner && store.pluginCommandCatalogOwners.get(accountId) !== owner) return;
		store.pluginCommandCatalogOwners.delete(accountId);
	};
	const ensureChannelLog = (channelId) => {
		channelLogs[channelId] ??= createSubsystemLogger("channels").child(channelId);
		return channelLogs[channelId];
	};
	const ensureChannelRuntime = (channelId) => {
		channelRuntimeEnvs[channelId] ??= runtimeForLogger(ensureChannelLog(channelId));
		return channelRuntimeEnvs[channelId];
	};
	const resolveAccountHealthMonitorOverride = (channelConfig, accountId) => {
		if (!channelConfig?.accounts) return;
		const direct = resolveAccountEntry(channelConfig.accounts, accountId);
		if (typeof direct?.healthMonitor?.enabled === "boolean") return direct.healthMonitor.enabled;
		const normalizedAccountId = normalizeOptionalAccountId(accountId);
		if (!normalizedAccountId) return;
		const match = resolveNormalizedAccountEntry(channelConfig.accounts, normalizedAccountId, normalizeAccountId);
		if (typeof match?.healthMonitor?.enabled !== "boolean") return;
		return match.healthMonitor.enabled;
	};
	const isHealthMonitorEnabled = (channelId, accountId) => {
		const cfg = getRuntimeConfig();
		const channelConfig = cfg.channels?.[channelId];
		const accountOverride = resolveAccountHealthMonitorOverride(channelConfig, accountId);
		const channelOverride = channelConfig?.healthMonitor?.enabled;
		if (typeof accountOverride === "boolean") return accountOverride;
		if (typeof channelOverride === "boolean") return channelOverride;
		const plugin = resolveChannelPluginRegistration(channelId)?.plugin;
		if (!plugin) return true;
		try {
			plugin.config.resolveAccount(cfg, accountId);
		} catch (err) {
			ensureChannelLog(channelId).warn?.(`[${channelId}:${accountId}] health-monitor: failed to resolve account; skipping monitor (${formatErrorMessage(err)})`);
			return false;
		}
		return true;
	};
	const getStore = (channelId) => {
		const existing = channelStores.get(channelId);
		if (existing) return existing;
		const next = createRuntimeStore();
		channelStores.set(channelId, next);
		return next;
	};
	const getRuntime = (channelId, accountId) => {
		return getStore(channelId).runtimes.get(accountId) ?? cloneDefaultRuntime(channelId, accountId);
	};
	const setRuntime = (channelId, accountId, patch) => {
		const store = getStore(channelId);
		const current = getRuntime(channelId, accountId);
		const hasExplicitReadyRecovery = Object.hasOwn(patch, "lifecycle") && patch.lifecycle === "ready" && Object.hasOwn(patch, "terminalDisconnect") && patch.terminalDisconnect === void 0;
		const lifecycle = current.lifecycle === "blocked" && current.terminalDisconnect === true && patch.lifecycle !== "starting" && !hasExplicitReadyRecovery ? "blocked" : patch.lifecycle ?? (patch.restartPending === true ? "recovering" : patch.connected === true ? "ready" : void 0);
		const next = {
			...current,
			...patch,
			...lifecycle ? { lifecycle } : {},
			accountId
		};
		store.runtimes.set(accountId, next);
		return next;
	};
	const setRuntimeFromTaskStatus = (channelId, accountId, patch, abortSignal) => {
		const safePatch = abortSignal?.aborted ? sanitizeAbortedTaskStatusPatch(patch, getRuntime(channelId, accountId)) : patch;
		return setRuntime(channelId, accountId, safePatch);
	};
	const setStoppedRuntime = (channelId, accountId, patch = {}) => {
		const current = getRuntime(channelId, accountId);
		return setRuntime(channelId, accountId, {
			accountId,
			running: false,
			lifecycle: patch.restartPending === true ? "recovering" : "stopped",
			...typeof current.connected === "boolean" ? { connected: false } : {},
			...patch
		});
	};
	const getChannelRuntime = async () => {
		if (channelRuntime) return channelRuntime;
		return await resolveChannelRuntime?.();
	};
	const measureStartup = async (name, run) => {
		return startupTrace ? startupTrace.measure(name, run) : await run();
	};
	const evictStaleChannelAccountState = (channelId, store, accountIds) => {
		const activeAccountIds = new Set(accountIds);
		for (const id of store.runtimes.keys()) {
			if (activeAccountIds.has(id) || store.aborts.has(id) || store.starting.has(id) || store.stops.has(id) || store.tasks.has(id)) continue;
			store.runtimes.delete(id);
			store.pluginCommandCatalogOwners.delete(id);
			restarts.delete(restartKey(channelId, id));
			manuallyStopped.delete(restartKey(channelId, id));
			recoveryStartRequested.delete(restartKey(channelId, id));
		}
	};
	const startChannelProcessOwned = async (channelId, accountId, optsValue = {}) => {
		const registration = resolveChannelPluginRegistration(channelId);
		const plugin = registration?.plugin;
		const startAccount = plugin?.gateway?.startAccount;
		if (!startAccount) return;
		const { preserveRestartAttempts = false, preserveManualStop = false } = optsValue;
		const cfg = getRuntimeConfig();
		resetDirectoryCache({
			cfg,
			channel: channelId,
			accountId
		});
		const store = getStore(channelId);
		const accountIds = accountId ? [accountId] : await measureStartup(`channels.${channelId}.list-accounts`, () => plugin.config.listAccountIds(cfg));
		if (!accountId) evictStaleChannelAccountState(channelId, store, accountIds);
		if (accountIds.length === 0) return;
		if (autostartSuppression && optsValue.manual !== true) {
			const suffix = accountId ? ` account ${accountId}` : "";
			ensureChannelLog(channelId).warn?.(`channel autostart suppressed by crash-loop breaker; refusing automatic start for ${channelId}${suffix}. ${formatGatewayCrashLoopManualChannelStartHint({
				channelId,
				...accountId ? { accountId } : {}
			})}`);
			for (const id of accountIds) setStoppedRuntime(channelId, id, {
				restartPending: false,
				lastError: autostartSuppression.message
			});
			return;
		}
		if (ambientAutostartSuppressedChannelIds.has(channelId) && optsValue.manual !== true) {
			for (const id of accountIds) setStoppedRuntime(channelId, id, {
				restartPending: false,
				lastError: "ambient channel credentials suppressed; configure the channel or start the gateway with --ambient-channels"
			});
			return;
		}
		const startup = await runTasksWithConcurrency({
			limit: CHANNEL_STARTUP_CONCURRENCY,
			tasks: accountIds.map((id) => async () => {
				const rKey = restartKey(channelId, id);
				if (store.stops.has(id)) return;
				if (store.tasks.has(id)) {
					let clearedTimedOutRecoveryTask = false;
					if (recoveryStopTimedOut.has(rKey)) {
						if (!preserveManualStop) manuallyStopped.delete(rKey);
						if (manuallyStopped.has(rKey)) return;
						if (recoveryStartRequested.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							recoveryStartRequested.delete(rKey);
							restarts.delete(rKey);
							store.aborts.delete(id);
							store.tasks.delete(id);
							clearedTimedOutRecoveryTask = true;
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: false,
								reconnectAttempts: 0
							});
						} else {
							recoveryStartRequested.add(rKey);
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: true
							});
							return;
						}
					}
					if (!clearedTimedOutRecoveryTask) return;
				}
				const existingStart = store.starting.get(id);
				if (existingStart) {
					await existingStart;
					return;
				}
				let resolveStart;
				const startGate = new Promise((resolve) => {
					resolveStart = resolve;
				});
				store.starting.set(id, startGate);
				const abort = new AbortController();
				store.aborts.set(id, abort);
				clearPluginCommandCatalogOwner(store, id);
				let handedOffTask = false;
				let startAccountLifetimeActive = false;
				const log = ensureChannelLog(channelId);
				const runtime = ensureChannelRuntime(channelId);
				let scopedChannelRuntime = null;
				let channelRuntimeForTask;
				let stopApprovalBootstrap = async () => {};
				const stopTaskScopedApprovalRuntime = async () => {
					const scopedRuntime = scopedChannelRuntime;
					scopedChannelRuntime = null;
					const stopBootstrap = stopApprovalBootstrap;
					stopApprovalBootstrap = async () => {};
					scopedRuntime?.dispose();
					await stopBootstrap();
				};
				const cleanupTaskScopedApprovalRuntime = async (label) => {
					try {
						await stopTaskScopedApprovalRuntime();
					} catch (error) {
						log.error?.(`[${id}] ${label}: ${formatErrorMessage(error)}`);
					}
				};
				try {
					const secretOwnerId = `${channelId}:${normalizeAccountId(id)}`;
					clearActiveCredentialDegradedOwner("account", secretOwnerId);
					assertSecretOwnerAvailable("account", secretOwnerId);
					const account = plugin.config.resolveAccount(cfg, id);
					const described = plugin.config.describeAccount?.(account, cfg);
					if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) {
						setRuntime(channelId, id, {
							accountId: id,
							enabled: false,
							running: false,
							restartPending: false
						});
						return;
					}
					const credentialDiagnostics = getCredentialUnavailableDiagnostics(account);
					if (credentialDiagnostics.length > 0) {
						setActiveCredentialDegradedOwner({
							ownerKind: "account",
							ownerId: secretOwnerId,
							state: "unavailable",
							paths: credentialDiagnostics.map((diagnostic) => diagnostic.path),
							refKeys: [],
							reason: "credential file is unavailable"
						});
						assertSecretOwnerAvailable("account", secretOwnerId);
					}
					let configured = true;
					if (plugin.config.isConfigured) configured = await measureStartup(`channels.${channelId}.is-configured`, () => plugin.config.isConfigured(account, cfg));
					if (!configured) {
						setRuntime(channelId, id, {
							accountId: id,
							enabled: true,
							configured: false,
							linked: void 0,
							running: false,
							restartPending: false
						});
						return;
					}
					setRuntime(channelId, id, {
						accountId: id,
						enabled: true,
						configured: true,
						...plugin.config.isLinked ? { linked: void 0 } : {}
					});
					const fallbackLinked = described?.linked ?? getRuntime(channelId, id).linked;
					const linkState = plugin.config.isLinked ? await measureStartup(`channels.${channelId}.is-linked`, () => plugin.config.isLinked(account, cfg)) : fallbackLinked === true ? "linked" : fallbackLinked === false ? "not-linked" : void 0;
					if (linkState === "not-linked" || linkState === "unknown") {
						setRuntime(channelId, id, {
							accountId: id,
							enabled: true,
							linked: linkState === "not-linked" ? false : void 0,
							running: false,
							restartPending: false
						});
						return;
					}
					if (!preserveManualStop) manuallyStopped.delete(rKey);
					if (abort.signal.aborted || manuallyStopped.has(rKey)) {
						setStoppedRuntime(channelId, id, {
							restartPending: false,
							lastStopAt: Date.now()
						});
						return;
					}
					scopedChannelRuntime = await measureStartup(`channels.${channelId}.runtime`, async () => createTaskScopedChannelRuntime({ channelRuntime: registration?.resolveChannelRuntime?.() ?? await getChannelRuntime() }));
					channelRuntimeForTask = scopedChannelRuntime.channelRuntime;
					if (!preserveRestartAttempts) restarts.delete(rKey);
					try {
						stopApprovalBootstrap = await measureStartup(`channels.${channelId}.approval-bootstrap`, () => startChannelApprovalHandlerBootstrap({
							plugin,
							cfg,
							accountId: id,
							channelRuntime: channelRuntimeForTask,
							gatewayRuntime: opts.getNativeApprovalRuntime?.(),
							logger: log
						}));
					} catch (error) {
						log.error?.(`[${id}] native approval bootstrap failed: ${formatErrorMessage(error)}`);
					}
					let channelRunDurationMs;
					setRuntime(channelId, id, {
						accountId: id,
						enabled: true,
						...linkState === "linked" ? { linked: true } : {},
						running: true,
						lifecycle: "starting",
						restartPending: false,
						lastStartAt: Date.now(),
						lastError: null,
						ingressUnavailable: void 0,
						terminalDisconnect: void 0,
						reconnectAttempts: preserveRestartAttempts ? restarts.get(rKey)?.attempts ?? 0 : 0
					});
					const trackedPromise = Promise.resolve().then(async () => {
						if (optsValue.deferAccountStartUntil) await waitForDeferredAccountStart(optsValue.deferAccountStartUntil, abort.signal);
						else if (startupTrace) await waitForChannelStartupHandoff();
						if (abort.signal.aborted || manuallyStopped.has(rKey)) return;
						const gatewayApprovalRuntime = opts.getNativeApprovalRuntime?.();
						if (channelRuntimeForTask && gatewayApprovalRuntime) registerChannelRuntimeContext({
							channelRuntime: channelRuntimeForTask,
							channelId,
							accountId: id,
							capability: CHANNEL_APPROVAL_GATEWAY_RUNTIME_CONTEXT_CAPABILITY,
							context: { request: async (method, requestParams, requestOptions) => {
								if (method !== "approval.resolve") throw new Error(`channel approval runtime cannot dispatch ${method}`);
								return await gatewayApprovalRuntime.request("approval.resolve", requestParams, requestOptions);
							} },
							abortSignal: abort.signal
						});
						let startAccountTask;
						await measureStartup(`channels.${channelId}.start-account-handoff`, () => {
							if (abort.signal.aborted || manuallyStopped.has(rKey)) return;
							const runStartAccount = () => {
								const startedAt = Date.now();
								const recordDuration = () => {
									channelRunDurationMs = Date.now() - startedAt;
									startAccountLifetimeActive = false;
									clearPluginCommandCatalogOwner(store, id, abort);
								};
								const retainCatalog = () => {
									if (!startAccountLifetimeActive || abort.signal.aborted || store.aborts.get(id) !== abort || !isCurrentTask()) return;
									store.pluginCommandCatalogOwners.set(id, abort);
								};
								try {
									startAccountLifetimeActive = true;
									return withPluginCommandAccountStartScope({
										channelId,
										retainCatalog
									}, () => withGatewayNativeApprovalRuntime(opts.getNativeApprovalRuntime?.(), () => startAccount({
										cfg,
										accountId: id,
										account,
										runtime,
										abortSignal: abort.signal,
										log,
										getStatus: () => getRuntime(channelId, id),
										setStatus: (next) => isCurrentTask() ? setRuntimeFromTaskStatus(channelId, id, next, abort.signal) : getRuntime(channelId, id),
										invalidateDirectoryCache: () => resetDirectoryCache({
											cfg,
											channel: channelId,
											accountId: id
										}),
										...channelRuntimeForTask ? { channelRuntime: channelRuntimeForTask } : {}
									}))).finally(recordDuration);
								} catch (error) {
									recordDuration();
									throw error;
								}
							};
							const routeRegistry = getPluginHttpRouteRegistry?.();
							startAccountTask = routeRegistry ? withPluginHttpRouteRegistry(routeRegistry, runStartAccount) : runStartAccount();
						});
						if (!startAccountTask) return;
						await startAccountTask;
					}).then(() => {
						if (abort.signal.aborted || manuallyStopped.has(rKey) || !isCurrentTask()) return;
						if (getRuntime(channelId, id).terminalDisconnect) return;
						const message = "channel exited without an error";
						setRuntime(channelId, id, {
							accountId: id,
							lastError: message
						});
						log.error?.(`[${id}] ${message}`);
					}).catch((err) => {
						if (!isCurrentTask() || store.stops.has(id)) return;
						const message = formatErrorMessage(err);
						setRuntime(channelId, id, {
							accountId: id,
							lastError: message,
							...isChannelIngressUnavailableError(err) ? { ingressUnavailable: true } : {}
						});
						log.error?.(`[${id}] channel exited: ${message}`);
					}).then(async () => {
						await cleanupTaskScopedApprovalRuntime("channel cleanup failed");
						if (!isCurrentTask() || store.stops.has(id)) return;
						setStoppedRuntime(channelId, id, { lastStopAt: Date.now() });
					}).then(async () => {
						if (!isCurrentTask() || store.stops.has(id)) return;
						if (manuallyStopped.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							recoveryStartRequested.delete(rKey);
							return;
						}
						if (getRuntime(channelId, id).terminalDisconnect) {
							recoveryStopTimedOut.delete(rKey);
							recoveryStartRequested.delete(rKey);
							restarts.delete(rKey);
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: false,
								reconnectAttempts: 0
							});
							log.info?.(`[${id}] auto-restart skipped, terminal disconnect`);
							return;
						}
						if (recoveryStopTimedOut.has(rKey)) {
							recoveryStopTimedOut.delete(rKey);
							if (!recoveryStartRequested.delete(rKey)) {
								setRuntime(channelId, id, {
									accountId: id,
									restartPending: false,
									reconnectAttempts: 0
								});
								if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
								if (store.aborts.get(id) === abort) store.aborts.delete(id);
								return;
							}
							restarts.delete(rKey);
							log.info?.(`[${id}] restarting after timed-out channel stop completed`);
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: true,
								reconnectAttempts: 0
							});
							if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
							if (store.aborts.get(id) === abort) store.aborts.delete(id);
							abort.abort();
							try {
								await startChannelInternal(channelId, id, { preserveManualStop: true });
							} catch {}
							return;
						}
						if (channelRunDurationMs !== void 0 && channelRunDurationMs >= CHANNEL_STABLE_RUN_MS) restarts.delete(rKey);
						const restart = restarts.get(rKey) ?? new RetrySupervisor(RESTART_POLICY, MAX_RESTARTS);
						restarts.set(rKey, restart);
						const retry = restart.next(abort.signal);
						if (!retry) {
							setRuntime(channelId, id, {
								accountId: id,
								restartPending: false,
								reconnectAttempts: restart.attempts
							});
							log.error?.(`[${id}] giving up after ${MAX_RESTARTS} restart attempts`);
							return;
						}
						log.info?.(`[${id}] auto-restart attempt ${restart.attempts}/${MAX_RESTARTS} in ${Math.round(retry.delayMs / 1e3)}s`);
						setRuntime(channelId, id, {
							accountId: id,
							restartPending: true,
							reconnectAttempts: restart.attempts
						});
						pendingAutoRestarts.add(rKey);
						try {
							await sleepWithAbort(retry.delayMs, retry.signal);
							if (manuallyStopped.has(rKey)) return;
							if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
							if (store.aborts.get(id) === abort) store.aborts.delete(id);
							abort.abort();
							await startChannelInternal(channelId, id, {
								preserveRestartAttempts: true,
								preserveManualStop: true
							});
						} catch {} finally {
							pendingAutoRestarts.delete(rKey);
						}
					}).finally(() => {
						if (store.tasks.get(id) === trackedPromise) store.tasks.delete(id);
						if (store.aborts.get(id) === abort) store.aborts.delete(id);
						abort.abort();
					});
					function isCurrentTask() {
						return store.tasks.get(id) === trackedPromise;
					}
					handedOffTask = true;
					store.tasks.set(id, trackedPromise);
				} catch (error) {
					if (!handedOffTask) setStoppedRuntime(channelId, id, {
						restartPending: false,
						lastError: formatErrorMessage(error)
					});
					throw error;
				} finally {
					resolveStart?.();
					if (store.starting.get(id) === startGate) store.starting.delete(id);
					if (!handedOffTask) await cleanupTaskScopedApprovalRuntime("channel startup cleanup failed");
					if (!handedOffTask && store.aborts.get(id) === abort) store.aborts.delete(id);
				}
			})
		});
		if (startup.hasError) throw startup.firstError;
	};
	const startChannelInternal = (...args) => runOutsideGatewayRootWorkAdmission(() => startChannelProcessOwned(...args));
	const startChannel = async (channelId, accountId, optsValue = {}) => {
		await startChannelInternal(channelId, accountId, optsValue);
	};
	const stopChannel = async (channelId, accountId, optsLocal = {}) => {
		const manual = optsLocal.manual ?? true;
		const plugin = getChannelPlugin(channelId);
		const store = getStore(channelId);
		const lifecycleIds = /* @__PURE__ */ new Set([
			...store.aborts.keys(),
			...store.starting.keys(),
			...store.stops.keys(),
			...store.tasks.keys()
		]);
		if (!accountId && lifecycleIds.size === 0) return;
		if (!plugin?.gateway?.stopAccount && lifecycleIds.size === 0) return;
		const cfg = getRuntimeConfig();
		const knownIds = /* @__PURE__ */ new Set([...lifecycleIds, ...plugin ? plugin.config.listAccountIds(cfg) : []]);
		if (accountId) {
			knownIds.clear();
			knownIds.add(accountId);
		}
		const failedStop = (await Promise.all(Array.from(knownIds.values()).map(async (id) => {
			const rKey = restartKey(channelId, id);
			if (manual) manuallyStopped.add(rKey);
			const runStopAttempt = async (previousOutcome) => {
				const abort = store.aborts.get(id);
				const task = store.tasks.get(id);
				if (!abort && !task && !plugin?.gateway?.stopAccount) return previousOutcome;
				abort?.abort();
				const log = ensureChannelLog(channelId);
				const runtime = ensureChannelRuntime(channelId);
				let outcome = { status: "fulfilled" };
				if (plugin?.gateway?.stopAccount) try {
					const account = plugin.config.resolveAccount(cfg, id);
					let stopAttemptAbandoned = false;
					if (!await waitForChannelStopGracefully(plugin.gateway.stopAccount({
						cfg,
						accountId: id,
						account,
						runtime,
						abortSignal: abort?.signal ?? new AbortController().signal,
						log,
						getStatus: () => getRuntime(channelId, id),
						setStatus: (next) => {
							setRuntime(channelId, id, stopAttemptAbandoned ? sanitizeAbortedTaskStatusPatch(next, getRuntime(channelId, id)) : next);
						}
					}).catch((error) => {
						if (stopAttemptAbandoned) {
							log.warn?.(`[${id}] abandoned stopAccount failed late: ${formatErrorMessage(error)}`);
							return;
						}
						outcome = {
							status: "rejected",
							error
						};
						log.warn?.(`[${id}] stopAccount failed: ${formatErrorMessage(error)}`);
					}), CHANNEL_STOP_ABORT_TIMEOUT_MS)) {
						stopAttemptAbandoned = true;
						log.warn?.(`[${id}] stopAccount exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms; continuing stop`);
					}
				} catch (error) {
					outcome = {
						status: "rejected",
						error
					};
					log.warn?.(`[${id}] stopAccount failed: ${formatErrorMessage(error)}`);
				}
				const stoppedCleanly = await waitForChannelStopGracefully(task, CHANNEL_STOP_ABORT_TIMEOUT_MS);
				if (!stoppedCleanly) log.warn?.(`[${id}] channel stop exceeded ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms after abort; continuing shutdown`);
				if (outcome.status === "rejected") {
					recoveryStopTimedOut.delete(rKey);
					recoveryStartRequested.delete(rKey);
					if (stoppedCleanly) {
						if (store.aborts.get(id) === abort) store.aborts.delete(id);
						if (store.tasks.get(id) === task) store.tasks.delete(id);
					}
					setRuntime(channelId, id, {
						accountId: id,
						running: true,
						restartPending: false,
						lastError: formatErrorMessage(outcome.error)
					});
					return outcome;
				}
				if (!stoppedCleanly) {
					const stoppedPatch = {
						restartPending: !manual,
						lastError: `channel stop timed out after ${CHANNEL_STOP_ABORT_TIMEOUT_MS}ms`
					};
					if (manual) setRuntime(channelId, id, {
						accountId: id,
						running: true,
						...stoppedPatch
					});
					else {
						clearPluginCommandCatalogOwner(store, id, abort);
						setStoppedRuntime(channelId, id, stoppedPatch);
						recoveryStopTimedOut.add(rKey);
					}
					return outcome;
				}
				recoveryStopTimedOut.delete(rKey);
				recoveryStartRequested.delete(rKey);
				clearPluginCommandCatalogOwner(store, id, abort);
				if (store.aborts.get(id) === abort) store.aborts.delete(id);
				if (store.tasks.get(id) === task) store.tasks.delete(id);
				setStoppedRuntime(channelId, id, {
					restartPending: false,
					lastStopAt: Date.now()
				});
				return outcome;
			};
			const currentStop = store.stops.get(id);
			const stopAttempt = (currentStop?.status === "stopping" ? currentStop.attempt : Promise.resolve(currentStop ?? { status: "fulfilled" })).then(runStopAttempt);
			store.stops.set(id, {
				status: "stopping",
				attempt: stopAttempt
			});
			const outcome = await stopAttempt;
			const latestStop = store.stops.get(id);
			if (latestStop?.status === "stopping" && latestStop.attempt === stopAttempt) if (outcome.status === "rejected") store.stops.set(id, outcome);
			else store.stops.delete(id);
			return outcome;
		}))).find((outcome) => outcome.status === "rejected");
		if (failedStop?.status === "rejected") throw failedStop.error;
	};
	const startChannelsWithOptions = async (startOptions = {}) => {
		let releaseAccountStarts;
		const deferAccountStartUntil = opts.deferStartupAccountStartsUntil ?? (startupTrace ? new Promise((resolve) => {
			releaseAccountStarts = () => {
				setImmediate(resolve).unref?.();
			};
		}) : void 0);
		try {
			await runTasksWithConcurrency({
				limit: CHANNEL_STARTUP_CONCURRENCY,
				tasks: [...listChannelPlugins()].map((plugin) => async () => {
					try {
						await measureStartup(`channels.${plugin.id}.start`, () => startChannelInternal(plugin.id, void 0, {
							...startOptions,
							...deferAccountStartUntil ? { deferAccountStartUntil } : {}
						}));
					} catch (err) {
						ensureChannelLog(plugin.id).error?.(`[${plugin.id}] channel startup failed: ${formatErrorMessage(err)}`);
					}
				})
			});
		} finally {
			releaseAccountStarts?.();
		}
	};
	const startChannels = async () => await startChannelsWithOptions();
	const recoverAutostartSuppression = async () => {
		if (!autostartSuppression || !opts.tryRecoverAutostartSuppression?.()) return false;
		autostartSuppression = null;
		await startChannelsWithOptions({ preserveManualStop: true });
		return true;
	};
	const markChannelLoggedOut = (channelId, cleared, accountId) => {
		const plugin = getChannelPlugin(channelId);
		if (!plugin) return;
		const cfg = getRuntimeConfig();
		const resolvedId = accountId ?? resolveChannelDefaultAccountId({
			plugin,
			cfg
		});
		const current = getRuntime(channelId, resolvedId);
		setStoppedRuntime(channelId, resolvedId, {
			...cleared ? { linked: false } : {},
			restartPending: false,
			lastError: cleared ? "logged out" : current.lastError
		});
	};
	const getRuntimeSnapshot = () => {
		const cfg = getRuntimeConfig();
		const channels = {};
		const channelAccounts = {};
		for (const plugin of listChannelPlugins()) {
			const store = getStore(plugin.id);
			const accountIds = plugin.config.listAccountIds(cfg);
			const defaultAccountId = resolveChannelDefaultAccountId({
				plugin,
				cfg,
				accountIds
			});
			const accounts = {};
			for (const id of accountIds) {
				const account = plugin.config.resolveAccount(cfg, id);
				const enabled = plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account);
				const described = plugin.config.describeAccount?.(account, cfg);
				const current = store.runtimes.get(id) ?? cloneDefaultRuntime(plugin.id, id);
				const state = resolveChannelAccountState({
					enabled,
					configured: described?.configured ?? current.configured ?? true,
					linked: plugin.config.isLinked ? current.linked : typeof current.linked === "boolean" ? current.linked : described?.linked,
					runtime: current,
					disabledReason: plugin.config.disabledReason?.(account, cfg),
					unconfiguredReason: plugin.config.unconfiguredReason?.(account, cfg),
					unlinkedReason: plugin.config.unlinkedReason?.(account, cfg)
				});
				const next = {
					...current,
					accountId: id,
					enabled
				};
				applyChannelAccountState(next, state);
				if (described?.mode !== void 0) next.mode = described.mode;
				accounts[id] = next;
			}
			const defaultAccount = accounts[defaultAccountId] ?? cloneDefaultRuntime(plugin.id, defaultAccountId);
			channels[plugin.id] = defaultAccount;
			channelAccounts[plugin.id] = accounts;
		}
		return {
			channels,
			channelAccounts
		};
	};
	const getPluginCommandCatalogAccounts = () => new Map([...channelStores].filter(([, store]) => store.pluginCommandCatalogOwners.size > 0).map(([channelId, store]) => [channelId, new Set(store.pluginCommandCatalogOwners.keys())]));
	const isManuallyStoppedFlag = (channelId, accountId) => {
		return manuallyStopped.has(restartKey(channelId, accountId));
	};
	const isAutoRestartScheduled = (channelId, accountId) => {
		return pendingAutoRestarts.has(restartKey(channelId, accountId));
	};
	const resetRestartAttempts = (channelId, accountId) => {
		restarts.delete(restartKey(channelId, accountId));
	};
	return {
		getRuntimeSnapshot,
		getPluginCommandCatalogAccounts,
		startChannels,
		startChannel,
		stopChannel,
		setAutostartSuppression: (suppression) => {
			autostartSuppression = suppression;
		},
		getAutostartSuppression: () => autostartSuppression,
		recoverAutostartSuppression,
		setAmbientAutostartSuppressedChannelIds: (channelIds) => {
			ambientAutostartSuppressedChannelIds = new Set(channelIds);
		},
		isAmbientAutostartSuppressed: (channelId) => ambientAutostartSuppressedChannelIds.has(channelId),
		markChannelLoggedOut,
		isManuallyStopped: isManuallyStoppedFlag,
		isAutoRestartScheduled,
		resetRestartAttempts,
		isHealthMonitorEnabled
	};
}
//#endregion
export { createChannelManager };
