import { n as runExec } from "./exec-BL80Wdzl.js";
import { C as resolveCodexComputerUseConfig, x as resolveCodexAppServerRuntimeOptions } from "./session-binding-BqXBlQHR.js";
import { F as isCodexAppServerIndeterminateRequestCancellationError, I as isCodexAppServerIndeterminateTransportError, P as isCodexAppServerConnectionClosedError, b as acquireCodexNativeConfigFence, d as releaseLeasedSharedCodexAppServerClient, dt as resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath, p as resolveCodexNativeConfigFenceKey, s as getLeasedSharedCodexAppServerClient } from "./shared-client-DWF1E3DT.js";
import "./process-runtime-BTtGkRx5.js";
import { n as describeControlFailure } from "./capabilities-CPs19Wxb.js";
import { r as requestCodexAppServerJson } from "./request-CtW-4Zw1.js";
import { existsSync } from "node:fs";
//#region extensions/codex/src/app-server/computer-use-process-repair.ts
const COMPUTER_USE_PROCESS_LIST_TIMEOUT_MS = 2e3;
const COMPUTER_USE_PROCESS_LIST_MAX_BUFFER_BYTES = 5 * 1024 * 1024;
function scopedRepairUnavailableStatus() {
	return {
		attempted: false,
		killedPids: [],
		warnings: ["Computer Use auto-repair skipped because no scoped Codex app-server process was available."],
		message: "Computer Use stale child repair requires a scoped local app-server PID."
	};
}
async function killStaleComputerUseMcpChildren(options = {}) {
	if (process.platform !== "darwin") return {
		attempted: true,
		killedPids: [],
		warnings: [`Computer Use stale child repair is currently macOS-only, not ${process.platform}.`],
		message: "Computer Use stale child repair skipped on this platform."
	};
	if (!options.ancestorPid || !Number.isSafeInteger(options.ancestorPid) || options.ancestorPid <= 0) return scopedRepairUnavailableStatus();
	let stdout;
	try {
		stdout = (await runExec("/bin/ps", ["-axo", "pid=,ppid=,command="], {
			logOutput: false,
			maxBuffer: COMPUTER_USE_PROCESS_LIST_MAX_BUFFER_BYTES,
			timeoutMs: COMPUTER_USE_PROCESS_LIST_TIMEOUT_MS
		})).stdout;
	} catch (error) {
		return {
			attempted: true,
			killedPids: [],
			warnings: [`Could not list processes for Computer Use repair: ${describeControlFailure(error)}`],
			message: "Computer Use stale child repair could not inspect running processes."
		};
	}
	const killedPids = [];
	const warnings = [];
	const processInfos = parsePsOutput(stdout);
	for (const processInfo of processInfos) {
		if (!isStaleComputerUseMcpChild(processInfo.command)) continue;
		if (!isDescendantOfPid(processInfo.pid, options.ancestorPid, processInfos)) continue;
		try {
			process.kill(processInfo.pid, "SIGTERM");
			killedPids.push(processInfo.pid);
		} catch (error) {
			warnings.push(`Could not terminate stale Computer Use MCP child pid ${processInfo.pid}: ${describeControlFailure(error)}`);
		}
	}
	return {
		attempted: true,
		killedPids,
		warnings,
		message: killedPids.length === 0 ? "No stale Computer Use MCP children were found under the scoped Codex app-server process." : `Terminated ${killedPids.length} stale Computer Use MCP child process${killedPids.length === 1 ? "" : "es"} under the scoped Codex app-server process.`
	};
}
function parsePsOutput(stdout) {
	return stdout.split(/\r?\n/u).flatMap((line) => {
		const match = /^\s*(\d+)\s+(\d+)\s+(.+)$/u.exec(line);
		if (!match) return [];
		return [{
			pid: Number(match[1]),
			ppid: Number(match[2]),
			command: match[3] ?? ""
		}];
	}).filter((processInfo) => Number.isSafeInteger(processInfo.pid) && processInfo.pid > 0 && Number.isSafeInteger(processInfo.ppid) && processInfo.ppid >= 0);
}
function isStaleComputerUseMcpChild(command) {
	return command.includes("SkyComputerUseClient") && /(?:^|\s)mcp(?:\s|$)/u.test(command);
}
function isDescendantOfPid(pid, ancestorPid, processInfos) {
	const parents = new Map(processInfos.map((processInfo) => [processInfo.pid, processInfo.ppid]));
	const seen = /* @__PURE__ */ new Set();
	let current = pid;
	while (!seen.has(current)) {
		seen.add(current);
		const parent = parents.get(current);
		if (!parent || parent <= 0) return false;
		if (parent === ancestorPid) return true;
		current = parent;
	}
	return false;
}
//#endregion
//#region extensions/codex/src/app-server/computer-use.ts
/**
* Computer Use plugin/MCP readiness checks and optional install flow for Codex
* app-server sessions.
*/
var CodexComputerUseSetupError = class extends Error {
	constructor(status) {
		super(status.message);
		this.name = "CodexComputerUseSetupError";
		this.status = status;
	}
};
const CURATED_MARKETPLACE_POLL_INTERVAL_MS = 2e3;
const COMPUTER_USE_MARKETPLACE_NAME_PRIORITY = [
	"openai-bundled",
	"openai-curated",
	"openai-api-curated",
	"openai-curated-remote",
	"local"
];
const COMPUTER_USE_LIVE_TEST_RETRY_COUNT = 1;
const COMPUTER_USE_LIVE_TEST_THREAD_NAME = "OpenClaw Computer Use readiness probe";
/** Reads Computer Use readiness without installing or mutating app-server state. */
async function readCodexComputerUseStatus(params = {}) {
	const config = resolveComputerUseConfig(params);
	if (!config.enabled) return disabledStatus(config);
	try {
		return await inspectCodexComputerUse({
			...params,
			computerUseConfig: config,
			installPlugin: false
		});
	} catch (error) {
		return unavailableStatus(config, "check_failed", `Computer Use check failed: ${describeControlFailure(error)}`);
	}
}
/**
* Ensures Computer Use is ready when enabled, optionally installing when config
* allows safe auto-install.
*/
async function ensureCodexComputerUse(params = {}) {
	const config = resolveComputerUseConfig(params);
	if (!config.enabled) return disabledStatus(config);
	const status = await inspectCodexComputerUse({
		...params,
		computerUseConfig: config,
		installPlugin: false
	});
	if (status.ready) return status;
	if (isNonStrictLiveTestStartupAllowed(status, config)) return status;
	if (config.autoInstall) {
		const blockedAutoInstallStatus = blockUnsafeAutoInstallStatus(config);
		if (blockedAutoInstallStatus) throw new CodexComputerUseSetupError(blockedAutoInstallStatus);
		const installedStatus = await inspectCodexComputerUse({
			...params,
			computerUseConfig: config,
			installPlugin: true
		});
		if (isNonStrictLiveTestStartupAllowed(installedStatus, config)) return installedStatus;
		if (!installedStatus.ready) throw new CodexComputerUseSetupError(installedStatus);
		return installedStatus;
	}
	if (!status.ready) throw new CodexComputerUseSetupError(status);
	return status;
}
/** Forces Computer Use plugin installation and returns the ready status. */
async function installCodexComputerUse(params = {}) {
	const config = resolveComputerUseConfig({
		...params,
		forceEnable: true,
		overrides: {
			...params.overrides,
			enabled: true,
			autoInstall: true
		}
	});
	const status = await inspectCodexComputerUse({
		...params,
		computerUseConfig: config,
		installPlugin: true
	});
	if (!status.ready) throw new CodexComputerUseSetupError(status);
	return status;
}
async function inspectCodexComputerUse(params) {
	if (!params.installPlugin) return await inspectCodexComputerUseWithoutFence(params);
	const runtime = params.client ? void 0 : resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.pluginConfig,
		managedCommandOrder: "desktop-first"
	});
	const fenceKey = resolveCodexNativeConfigFenceKey({
		client: params.client,
		startOptions: runtime?.start,
		agentDir: params.agentDir,
		config: params.config
	});
	if (!fenceKey) return await inspectCodexComputerUseWithoutFence(params);
	const release = await acquireCodexNativeConfigFence(fenceKey, {
		signal: params.signal,
		timeoutMs: params.timeoutMs ?? runtime?.requestTimeoutMs,
		timeoutMessage: "Codex Computer Use install timed out waiting for native config",
		abortMessage: "Codex Computer Use install aborted waiting for native config"
	});
	let releaseFenceOnReturn = true;
	let leasedClient;
	try {
		let client = params.client;
		if (!client && !params.request) {
			if (!runtime) throw new Error("Computer Use install could not resolve its app-server runtime");
			client = await getLeasedSharedCodexAppServerClient({
				startOptions: runtime.start,
				pluginConfig: params.pluginConfig,
				timeoutMs: params.timeoutMs ?? runtime.requestTimeoutMs,
				config: params.config,
				agentDir: params.agentDir,
				abandonSignal: params.signal
			});
			leasedClient = client;
		}
		try {
			return await inspectCodexComputerUseWithoutFence({
				...params,
				...client ? {
					client,
					timeoutMs: params.timeoutMs ?? runtime?.requestTimeoutMs
				} : {}
			});
		} catch (error) {
			if (client && (isCodexAppServerIndeterminateRequestCancellationError(error) || isCodexAppServerIndeterminateTransportError(error) || isCodexAppServerConnectionClosedError(error))) {
				releaseFenceOnReturn = false;
				await client.closeAndRunAfterExit(release, "Computer Use config mutation");
			}
			throw error;
		} finally {
			if (leasedClient) releaseLeasedSharedCodexAppServerClient(leasedClient);
		}
	} finally {
		if (releaseFenceOnReturn) release();
	}
}
async function inspectCodexComputerUseWithoutFence(params) {
	const request = createComputerUseRequest(params);
	const repairComputerUseMcpChildren = params.repairComputerUseMcpChildren ?? (params.client ? () => killStaleComputerUseMcpChildren({ ancestorPid: params.client?.getTransportPid() }) : void 0);
	if (params.installPlugin) await request("experimentalFeature/enablement/set", { enablement: { plugins: true } });
	const marketplace = await resolveMarketplaceRef({
		request,
		config: params.computerUseConfig,
		allowAdd: params.installPlugin,
		signal: params.signal,
		defaultBundledMarketplacePath: params.defaultBundledMarketplacePath,
		defaultBundledMarketplacePathCandidates: params.defaultBundledMarketplacePathCandidates
	});
	if (!marketplace.marketplace) return unavailableStatus(params.computerUseConfig, "marketplace_missing", marketplace.message ?? `No Codex marketplace containing ${params.computerUseConfig.pluginName} is registered. Configure computerUse.marketplaceSource or computerUse.marketplacePath, then run /codex computer-use install.`);
	const pluginInspection = await ensureComputerUsePlugin({
		request,
		config: params.computerUseConfig,
		marketplace: marketplace.marketplace,
		installPlugin: params.installPlugin
	});
	if (!pluginInspection.ok) return pluginInspection.status;
	return await readComputerUseTools({
		request,
		config: params.computerUseConfig,
		plugin: pluginInspection.plugin,
		installPlugin: params.installPlugin,
		repairComputerUseMcpChildren
	});
}
async function ensureComputerUsePlugin(params) {
	let plugin = await readComputerUsePlugin(params.request, params.marketplace, params.config.pluginName);
	if (!plugin.summary.installed || !plugin.summary.enabled) {
		if (!params.installPlugin) return {
			ok: false,
			status: statusFromPlugin({
				config: params.config,
				plugin,
				tools: [],
				reason: pluginSetupReason(plugin),
				message: pluginSetupMessage(params.config, plugin)
			})
		};
		await params.request("plugin/install", pluginRequestParams(params.marketplace, params.config.pluginName));
		await reloadMcpServers(params.request);
		plugin = await readComputerUsePlugin(params.request, params.marketplace, params.config.pluginName);
	}
	if (!plugin.summary.installed || !plugin.summary.enabled) return {
		ok: false,
		status: statusFromPlugin({
			config: params.config,
			plugin,
			tools: [],
			reason: pluginSetupReason(plugin),
			message: pluginSetupMessage(params.config, plugin)
		})
	};
	return {
		ok: true,
		plugin
	};
}
async function readComputerUseTools(params) {
	let server = await readMcpServerStatus(params.request, params.config.mcpServerName);
	let tools = Object.keys(server?.tools ?? {}).toSorted();
	if ((!server || tools.length === 0) && params.installPlugin) {
		await reloadMcpServers(params.request);
		server = await readMcpServerStatus(params.request, params.config.mcpServerName);
		tools = Object.keys(server?.tools ?? {}).toSorted();
	}
	if (!server) return statusFromPlugin({
		config: params.config,
		plugin: params.plugin,
		tools: [],
		reason: "mcp_missing",
		message: `Computer Use is installed, but the ${params.config.mcpServerName} MCP server is not available.`
	});
	if (tools.length === 0) return statusFromPlugin({
		config: params.config,
		plugin: params.plugin,
		tools,
		reason: "mcp_missing",
		message: `Computer Use is installed, but the ${params.config.mcpServerName} MCP server exposes no tools.`
	});
	const status = statusFromPlugin({
		config: params.config,
		plugin: params.plugin,
		tools,
		reason: "ready",
		message: "Computer Use is ready."
	});
	const { liveTest, repair } = await runCodexComputerUseLiveTest({
		request: params.request,
		config: params.config,
		repairComputerUseMcpChildren: params.repairComputerUseMcpChildren
	});
	const compatibilityStartupAllowed = !liveTest.ok && !params.config.strictReadiness;
	return {
		...status,
		ready: liveTest.ok,
		reason: liveTest.ok ? "ready" : "live_test_failed",
		liveTest,
		...repair ? { repair } : {},
		warnings: [
			...status.warnings,
			...repair?.warnings ?? [],
			...compatibilityStartupAllowed ? ["Computer Use live test failed, but compatibility startup remains enabled; set computerUse.strictReadiness to true to fail closed."] : []
		],
		message: liveTest.ok ? "Computer Use is ready." : compatibilityStartupAllowed ? `${liveTest.message} Startup is allowed because computerUse.strictReadiness is false.` : liveTest.message
	};
}
function isNonStrictLiveTestStartupAllowed(status, config) {
	return !config.strictReadiness && status.reason === "live_test_failed" && status.installed && status.pluginEnabled && status.mcpServerAvailable && status.installation.ok && status.exposure.ok;
}
async function runCodexComputerUseLiveTest(params) {
	const startedAt = Date.now();
	let lastError;
	let repair;
	for (let attempt = 0; attempt <= COMPUTER_USE_LIVE_TEST_RETRY_COUNT; attempt += 1) {
		let threadId;
		try {
			threadId = (await params.request("thread/start", {
				input: [],
				developerInstructions: COMPUTER_USE_LIVE_TEST_THREAD_NAME,
				sandbox: "danger-full-access",
				approvalPolicy: "never",
				ephemeral: true
			}, { timeoutMs: params.config.liveTestTimeoutMs })).thread.id;
			await params.request("mcpServer/tool/call", {
				threadId,
				server: params.config.mcpServerName,
				tool: "list_apps",
				arguments: {}
			}, { timeoutMs: params.config.toolCallTimeoutMs });
			return {
				liveTest: {
					status: "passed",
					ok: true,
					attempted: true,
					attempts: attempt + 1,
					timeoutMs: params.config.liveTestTimeoutMs,
					retried: attempt > 0,
					repaired: Boolean(repair?.attempted),
					durationMs: Math.max(0, Date.now() - startedAt),
					message: "Computer Use live test passed."
				},
				...repair ? { repair } : {}
			};
		} catch (error) {
			lastError = error;
			if (attempt >= COMPUTER_USE_LIVE_TEST_RETRY_COUNT) break;
			if (params.config.autoRepair) repair = params.repairComputerUseMcpChildren ? await params.repairComputerUseMcpChildren() : scopedRepairUnavailableStatus();
		} finally {
			if (threadId) await cleanupComputerUseProbeThread(params.request, threadId, params.config);
		}
	}
	const errorMessage = describeControlFailure(lastError);
	return {
		liveTest: {
			status: "failed",
			ok: false,
			attempted: true,
			attempts: 2,
			timeoutMs: params.config.liveTestTimeoutMs,
			retried: true,
			repaired: Boolean(repair?.attempted),
			durationMs: Math.max(0, Date.now() - startedAt),
			message: `Computer Use live test failed after 2 attempts: ${errorMessage}`,
			error: errorMessage
		},
		...repair ? { repair } : {}
	};
}
async function cleanupComputerUseProbeThread(request, threadId, config) {
	await Promise.allSettled([request("thread/unsubscribe", { threadId }, { timeoutMs: config.liveTestTimeoutMs }), request("thread/archive", { threadId }, { timeoutMs: config.liveTestTimeoutMs })]);
}
async function resolveMarketplaceRef(params) {
	let preferredMarketplaceName = params.config.marketplaceName;
	if (params.config.marketplaceSource && params.allowAdd) {
		const added = await params.request("marketplace/add", { source: params.config.marketplaceSource });
		preferredMarketplaceName ??= added.marketplaceName;
	}
	if (params.config.marketplacePath) return { marketplace: preferredMarketplaceName ? {
		kind: "local",
		name: preferredMarketplaceName,
		path: params.config.marketplacePath
	} : {
		kind: "local",
		path: params.config.marketplacePath
	} };
	let candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	const bundledMarketplacePath = resolveBundledComputerUseMarketplacePath(params);
	if (candidates.length === 0 && bundledMarketplacePath && shouldAddBundledComputerUseMarketplace(params)) {
		const added = await params.request("marketplace/add", { source: bundledMarketplacePath });
		preferredMarketplaceName ??= added.marketplaceName;
		candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	}
	const waitUntil = marketplaceDiscoveryWaitUntil(params);
	while (candidates.length === 0) {
		if (Date.now() >= waitUntil) break;
		await delay(Math.min(CURATED_MARKETPLACE_POLL_INTERVAL_MS, waitUntil - Date.now()), params.signal);
		candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	}
	if (preferredMarketplaceName) {
		const preferred = candidates.find((candidate) => candidate.name === preferredMarketplaceName);
		if (preferred) return { marketplace: preferred };
		return { message: `Configured Codex marketplace ${preferredMarketplaceName} was not found or does not contain ${params.config.pluginName}. Run /codex computer-use install with a source or path to install from a new marketplace.` };
	}
	if (candidates.length > 1) {
		const preferred = chooseKnownComputerUseMarketplace(candidates);
		if (preferred) return { marketplace: preferred };
		return { message: `Multiple Codex marketplaces contain ${params.config.pluginName}. Configure computerUse.marketplaceName or computerUse.marketplacePath to choose one.` };
	}
	if (params.config.marketplaceSource && !params.allowAdd && candidates.length === 0) return { message: "Computer Use marketplace source is configured but has not been registered. Run /codex computer-use install to register it." };
	const marketplace = candidates[0];
	return marketplace ? { marketplace } : {};
}
async function listComputerUseMarketplaceCandidates(request, config) {
	return findComputerUseMarketplaces(await request("plugin/list", { cwds: [] }), config.pluginName);
}
function blockUnsafeAutoInstallStatus(config) {
	if (!config.marketplaceSource) return;
	return unavailableStatus(config, "auto_install_blocked", "Computer Use auto-install only uses marketplaces Codex app-server has already discovered. Run /codex computer-use install to install from a configured marketplace source.");
}
function shouldAddBundledComputerUseMarketplace(params) {
	return params.allowAdd && !params.config.marketplaceSource && !params.config.marketplacePath && !params.config.marketplaceName && Boolean(resolveBundledComputerUseMarketplacePath(params));
}
function resolveBundledComputerUseMarketplacePath(params) {
	if (params.defaultBundledMarketplacePath) return existsSync(params.defaultBundledMarketplacePath) ? params.defaultBundledMarketplacePath : void 0;
	return resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath({ candidates: params.defaultBundledMarketplacePathCandidates });
}
function findComputerUseMarketplaces(listed, pluginName) {
	return listed.marketplaces.flatMap((marketplace) => {
		const plugin = marketplace.plugins.find((candidate) => candidate.name === pluginName || candidate.id === pluginName || candidate.id === `${pluginName}@${marketplace.name}`);
		if (!plugin) return [];
		if (marketplace.path) return [{
			kind: "local",
			name: marketplace.name,
			path: marketplace.path
		}];
		const remotePluginId = plugin.remotePluginId?.trim();
		if (!remotePluginId) return [];
		return [{
			kind: "remote",
			name: marketplace.name,
			remoteMarketplaceName: marketplace.name,
			remotePluginId
		}];
	});
}
function chooseKnownComputerUseMarketplace(candidates) {
	for (const marketplaceName of COMPUTER_USE_MARKETPLACE_NAME_PRIORITY) {
		const candidate = candidates.find((marketplace) => marketplace.name === marketplaceName);
		if (candidate) return candidate;
	}
}
function marketplaceDiscoveryWaitUntil(params) {
	if (params.allowAdd && !params.config.marketplaceSource && !params.config.marketplacePath && !params.config.marketplaceName) return Date.now() + params.config.marketplaceDiscoveryTimeoutMs;
	return 0;
}
async function delay(ms, signal) {
	if (signal?.aborted) throw abortError(signal);
	await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
			reject(abortError(signal));
		};
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function abortError(signal) {
	const reason = signal?.reason;
	return reason instanceof Error ? reason : /* @__PURE__ */ new Error("Computer Use setup was aborted.");
}
async function readComputerUsePlugin(request, marketplace, pluginName) {
	return (await request("plugin/read", pluginRequestParams(marketplace, pluginName))).plugin;
}
async function readMcpServerStatus(request, serverName) {
	let cursor;
	do {
		const response = await request("mcpServerStatus/list", {
			cursor,
			limit: 100,
			detail: "toolsAndAuthOnly"
		});
		const found = response.data.find((server) => server.name === serverName);
		if (found) return found;
		cursor = response.nextCursor;
	} while (cursor);
}
async function reloadMcpServers(request) {
	await request("config/mcpServer/reload", void 0);
}
function pluginRequestParams(marketplace, pluginName) {
	return marketplace.kind === "local" ? {
		marketplacePath: marketplace.path,
		pluginName
	} : {
		remoteMarketplaceName: marketplace.remoteMarketplaceName,
		pluginName: marketplace.remotePluginId
	};
}
function pluginSetupReason(plugin) {
	return plugin.summary.installed ? "plugin_disabled" : "plugin_not_installed";
}
function pluginSetupMessage(config, plugin) {
	if (!plugin.summary.installed) return "Computer Use is available but not installed. Run /codex computer-use install or enable computerUse.autoInstall.";
	return `Computer Use is installed, but the ${config.pluginName} plugin is disabled. Run /codex computer-use install or enable computerUse.autoInstall to re-enable it.`;
}
function statusFromPlugin(params) {
	return {
		enabled: true,
		ready: params.plugin.summary.installed && params.plugin.summary.enabled && params.tools.length > 0,
		reason: params.reason,
		installed: params.plugin.summary.installed,
		pluginEnabled: params.plugin.summary.enabled,
		mcpServerAvailable: params.tools.length > 0,
		pluginName: params.config.pluginName,
		mcpServerName: params.config.mcpServerName,
		marketplaceName: params.plugin.marketplaceName,
		...params.plugin.marketplacePath ? { marketplacePath: params.plugin.marketplacePath } : {},
		tools: params.tools,
		installation: installationStatusFromPlugin(params.plugin, params.message),
		exposure: exposureStatusFromTools(params.config, params.tools),
		liveTest: skippedLiveTestStatus(params.config, "Computer Use live test was not run."),
		warnings: pluginWarnings(params.plugin),
		message: params.message
	};
}
function disabledStatus(config) {
	return {
		enabled: false,
		ready: false,
		reason: "disabled",
		installed: false,
		pluginEnabled: false,
		mcpServerAvailable: false,
		pluginName: config.pluginName,
		mcpServerName: config.mcpServerName,
		tools: [],
		installation: {
			status: "disabled",
			ok: false,
			message: "Computer Use is disabled."
		},
		exposure: {
			status: "skipped",
			ok: false,
			message: "MCP exposure was not checked because Computer Use is disabled."
		},
		liveTest: skippedLiveTestStatus(config, "Computer Use live test was not run because Computer Use is disabled."),
		warnings: [],
		message: "Computer Use is disabled."
	};
}
function unavailableStatus(config, reason, message) {
	return {
		enabled: true,
		ready: false,
		reason,
		installed: false,
		pluginEnabled: false,
		mcpServerAvailable: false,
		pluginName: config.pluginName,
		mcpServerName: config.mcpServerName,
		...config.marketplaceName ? { marketplaceName: config.marketplaceName } : {},
		...config.marketplacePath ? { marketplacePath: config.marketplacePath } : {},
		tools: [],
		installation: {
			status: reason === "marketplace_missing" ? "marketplace_missing" : "not_installed",
			ok: false,
			message
		},
		exposure: {
			status: "skipped",
			ok: false,
			message: "MCP exposure was not checked because Computer Use installation is not ready."
		},
		liveTest: skippedLiveTestStatus(config, "Computer Use live test was not run because installation is not ready."),
		warnings: [],
		message
	};
}
function installationStatusFromPlugin(plugin, message) {
	if (!plugin.summary.installed) return {
		status: "not_installed",
		ok: false,
		message
	};
	if (!plugin.summary.enabled) return {
		status: "installed_disabled",
		ok: false,
		message
	};
	return {
		status: "installed",
		ok: true,
		message: "Computer Use plugin is installed and enabled."
	};
}
function exposureStatusFromTools(config, tools) {
	if (tools.length === 0) return {
		status: "missing",
		ok: false,
		message: `Computer Use MCP server ${config.mcpServerName} is not exposed.`
	};
	return {
		status: "available",
		ok: true,
		message: `Computer Use MCP server ${config.mcpServerName} exposes ${tools.length} tools.`
	};
}
function skippedLiveTestStatus(config, message) {
	return {
		status: "skipped",
		ok: false,
		attempted: false,
		attempts: 0,
		timeoutMs: config.liveTestTimeoutMs,
		retried: false,
		repaired: false,
		message
	};
}
function pluginWarnings(plugin) {
	const warnings = [];
	const source = plugin.summary.source;
	if (source && typeof source === "object" && "type" in source && source.type === "remote") warnings.push("Computer Use plugin is resolved from a remote marketplace; live local bundles are preferred.");
	return warnings;
}
function createComputerUseRequest(params) {
	if (params.request) return params.request;
	if (params.client) return async (method, requestParams, options) => await params.client.request(method, requestParams, {
		timeoutMs: options?.timeoutMs ?? params.timeoutMs,
		signal: params.signal
	});
	const runtime = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.pluginConfig,
		managedCommandOrder: "desktop-first"
	});
	return async (method, requestParams, options) => await requestCodexAppServerJson({
		method,
		requestParams,
		timeoutMs: options?.timeoutMs ?? params.timeoutMs ?? runtime.requestTimeoutMs,
		pluginConfig: params.pluginConfig,
		startOptions: runtime.start,
		config: params.config,
		agentDir: params.agentDir
	});
}
function resolveComputerUseConfig(params) {
	const overrides = params.forceEnable ? {
		...params.overrides,
		enabled: true
	} : params.overrides;
	return resolveCodexComputerUseConfig({
		pluginConfig: params.pluginConfig,
		overrides
	});
}
//#endregion
//#region extensions/codex/src/app-server/plugin-metadata-cache.ts
const CODEX_PLUGIN_METADATA_CACHE_TTL_MS = 3600 * 1e3;
/** Process-local plugin metadata cache with coalesced loads per query. */
var CodexPluginMetadataCache = class {
	constructor(nowMs = Date.now) {
		this.nowMs = nowMs;
		this.entries = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
		this.generations = /* @__PURE__ */ new Map();
		this.clearGeneration = 0;
	}
	/** Returns a fresh cached snapshot without issuing a request. */
	read(appCacheKey, queryKind, requestParams, catalogScope) {
		const entryKey = buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope);
		const entry = this.entries.get(entryKey);
		if (!entry) return;
		if (entry.expiresAtMs <= this.nowMs()) {
			this.entries.delete(entryKey);
			return;
		}
		return entry.snapshot;
	}
	/** Returns a fresh snapshot or coalesces one catalog or installed-plugin request. */
	async load(params) {
		const entryKey = buildMetadataCacheEntryKey(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		const cached = this.read(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		if (cached) return cached;
		const pending = this.inFlight.get(entryKey);
		if (pending) try {
			return await pending.promise;
		} catch {
			if (this.inFlight.get(entryKey) === pending) this.inFlight.delete(entryKey);
			return await this.load(params);
		}
		const generation = this.generations.get(params.appCacheKey) ?? 0;
		const clearGeneration = this.clearGeneration;
		const promise = (async () => {
			const method = params.queryKind === "installed" ? "plugin/installed" : "plugin/list";
			const response = await params.request(method, params.requestParams);
			const snapshot = {
				appCacheKey: params.appCacheKey,
				queryKind: params.queryKind,
				response
			};
			if (generation === (this.generations.get(params.appCacheKey) ?? 0) && clearGeneration === this.clearGeneration && !hasMarketplaceLoadErrors(response) && (params.cacheable?.(response) ?? true)) this.entries.set(entryKey, {
				snapshot,
				expiresAtMs: this.nowMs() + CODEX_PLUGIN_METADATA_CACHE_TTL_MS
			});
			return snapshot;
		})();
		this.inFlight.set(entryKey, {
			appCacheKey: params.appCacheKey,
			promise
		});
		try {
			return await promise;
		} finally {
			if (this.inFlight.get(entryKey)?.promise === promise) this.inFlight.delete(entryKey);
		}
	}
	/** Invalidates all plugin metadata queries for one app-server runtime. */
	invalidate(appCacheKey) {
		this.generations.set(appCacheKey, (this.generations.get(appCacheKey) ?? 0) + 1);
		for (const [entryKey, entry] of this.entries) if (entry.snapshot.appCacheKey === appCacheKey) this.entries.delete(entryKey);
		for (const [entryKey, pending] of this.inFlight) if (pending.appCacheKey === appCacheKey) this.inFlight.delete(entryKey);
	}
	/** Clears snapshots and prevents late in-flight loads from repopulating them. */
	clear() {
		this.clearGeneration += 1;
		this.generations.clear();
		this.entries.clear();
		this.inFlight.clear();
	}
};
/** Shared plugin metadata cache used by Codex app-server runtime paths. */
const defaultCodexPluginMetadataCache = new CodexPluginMetadataCache();
function hasMarketplaceLoadErrors(response) {
	return response.marketplaceLoadErrors.length > 0;
}
function buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope) {
	if (queryKind !== "installed") {
		const listParams = requestParams;
		const entry = [
			appCacheKey,
			queryKind,
			listParams?.cwds ?? [],
			Array.from(new Set(listParams?.marketplaceKinds ?? [])).toSorted(),
			...catalogScope ? [catalogScope] : []
		];
		return JSON.stringify(entry);
	}
	const installedParams = requestParams;
	return JSON.stringify([
		appCacheKey,
		queryKind,
		installedParams?.cwds ?? [],
		Array.from(new Set(installedParams?.installSuggestionPluginNames ?? [])).toSorted()
	]);
}
//#endregion
export { runCodexComputerUseLiveTest as a, readCodexComputerUseStatus as i, ensureCodexComputerUse as n, killStaleComputerUseMcpChildren as o, installCodexComputerUse as r, defaultCodexPluginMetadataCache as t };
