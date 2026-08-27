import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { n as defaultSlotIdForKey } from "./slots-CQdAEuat.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { f as isLoopbackIpAddress } from "./ip-Bc6HA4HC.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BknYMhkx.js";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-l0wakFAx.js";
import { t as resolveGatewayProbeTarget } from "./probe-target-DkyOfsU2.js";
import { r as resolveTailscalePublishedHost } from "./tailscale-status-CYn6ebpC.js";
import { a as isProbeReachable, t as pickGatewaySelfPresence } from "./gateway-presence-CaZolUZ1.js";
import { existsSync } from "node:fs";
//#region src/commands/status.scan.shared.ts
const gatewayProbeModuleLoader = createLazyImportLoader(() => import("./status.gateway-probe-BOeDNwyA.js"));
const probeGatewayModuleLoader = createLazyImportLoader(() => import("./probe-DqRn0bbr.js"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-Dplee5Oc.js"));
const memoryEngineStorageModuleLoader = createLazyImportLoader(() => import("./engine-storage-nAHv9qXk.js"));
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
function loadGatewayProbeModule() {
	return gatewayProbeModuleLoader.load();
}
function loadProbeGatewayModule() {
	return probeGatewayModuleLoader.load();
}
function loadGatewayCallModule() {
	return gatewayCallModuleLoader.load();
}
async function hasBuiltInMemoryState(databasePath) {
	if (!existsSync(databasePath)) return false;
	const { MEMORY_INDEX_CHUNKS_TABLE, MEMORY_INDEX_META_TABLE, MEMORY_INDEX_SOURCES_TABLE } = await memoryEngineStorageModuleLoader.load();
	let db;
	try {
		db = openNodeSqliteDatabase(databasePath, { readOnly: true });
		const builtInMemoryTableSets = [{
			meta: MEMORY_INDEX_META_TABLE,
			sources: MEMORY_INDEX_SOURCES_TABLE,
			chunks: MEMORY_INDEX_CHUNKS_TABLE
		}, {
			meta: "meta",
			sources: "files",
			chunks: "chunks"
		}];
		const builtInMemoryTables = builtInMemoryTableSets.flatMap(({ meta, sources, chunks }) => [
			meta,
			sources,
			chunks
		]);
		const tableNames = new Set(db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${builtInMemoryTables.map(() => "?").join(", ")})`).all(...builtInMemoryTables).map((row) => row.name).filter((name) => typeof name === "string"));
		for (const tables of builtInMemoryTableSets) {
			if (tableNames.has(tables.meta) && db.prepare(`SELECT 1 AS ok FROM ${tables.meta} WHERE key = ? LIMIT 1`).get(MEMORY_INDEX_META_KEY)) return true;
			for (const tableName of [tables.sources, tables.chunks]) if (tableNames.has(tableName) && db.prepare(`SELECT 1 AS ok FROM ${tableName} LIMIT 1`).get()) return true;
		}
		return false;
	} catch {
		return false;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
function isLoopbackGatewayUrl(rawUrl) {
	try {
		const hostname = new URL(rawUrl).hostname.toLowerCase();
		const unbracketed = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
		return unbracketed === "localhost" || isLoopbackIpAddress(unbracketed);
	} catch {
		return false;
	}
}
function shouldTryLocalStatusRpcFallback(params) {
	if (params.gatewayMode !== "local" || !params.gatewayProbe || params.gatewayProbe.ok || !isLoopbackGatewayUrl(params.gatewayUrl)) return false;
	return (params.gatewayProbe.error?.toLowerCase() ?? "").includes("timeout") || params.gatewayProbe.auth?.capability === "unknown";
}
async function applyLocalStatusRpcFallback(params) {
	if (params.enabled === false) return params.gatewayProbe;
	if (!shouldTryLocalStatusRpcFallback(params)) return params.gatewayProbe;
	const boundedFallbackTimeoutMs = Math.min(2e3, params.timeoutMsExplicit ? params.timeoutMs : Math.max(1e3, params.timeoutMs));
	const status = await loadGatewayCallModule().then(({ callGateway }) => callGateway({
		config: params.cfg,
		configPath: params.configPath,
		method: "status",
		token: params.gatewayProbeAuth.token,
		password: params.gatewayProbeAuth.password,
		timeoutMs: boundedFallbackTimeoutMs,
		mode: GATEWAY_CLIENT_MODES.BACKEND,
		clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT
	})).catch(() => null);
	if (!status) return params.gatewayProbe;
	const auth = params.gatewayProbe.auth;
	return {
		...params.gatewayProbe,
		ok: true,
		status,
		...auth ? { auth: auth.capability === "unknown" ? {
			...auth,
			capability: "read_only"
		} : auth } : {}
	};
}
function hasExplicitMemorySearchConfig(cfg, agentId) {
	if (cfg.memory && Object.hasOwn(cfg.memory, "search")) return true;
	return listAgentEntries(cfg).some((agent) => normalizeAgentId(agent.id) === normalizeAgentId(agentId) && agent.memory != null && Object.hasOwn(agent.memory, "search"));
}
/** Resolves whether memory status should be shown and which slot owns it. */
function resolveMemoryPluginStatus(cfg) {
	if (!(cfg.plugins?.enabled !== false)) return {
		enabled: false,
		slot: null,
		reason: "plugins disabled"
	};
	const raw = normalizeOptionalString(cfg.plugins?.slots?.memory) ?? "";
	if (normalizeOptionalLowercaseString(raw) === "none") return {
		enabled: false,
		slot: null,
		reason: "plugins.slots.memory=\"none\""
	};
	return {
		enabled: true,
		slot: raw || defaultSlotIdForKey("memory")
	};
}
/** Resolves gateway connection details, probe result, auth warnings, and call overrides. */
async function resolveGatewayProbeSnapshot(params) {
	const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({
		config: params.cfg,
		configPath: params.configPath
	});
	const { gatewayMode, remoteUrlMissing } = resolveGatewayProbeTarget(params.cfg);
	const shouldResolveAuth = params.opts.skipProbe !== true && (!remoteUrlMissing || params.opts.resolveAuthWhenRemoteUrlMissing === true);
	const shouldProbe = params.opts.skipProbe !== true && (!remoteUrlMissing || params.opts.probeWhenRemoteUrlMissing === true);
	const gatewayProbeAuthResolution = shouldResolveAuth ? await loadGatewayProbeModule().then(({ resolveGatewayProbeAuthResolution }) => resolveGatewayProbeAuthResolution(params.cfg, params.env)) : {
		auth: {},
		warning: void 0
	};
	let gatewayProbeAuthWarning = gatewayProbeAuthResolution.warning;
	const defaultProbeTimeoutMs = params.opts.all ? 5e3 : 2500;
	const timeoutMsExplicit = params.opts.timeoutMs !== void 0;
	const probeTimeoutMs = params.opts.timeoutMs ?? defaultProbeTimeoutMs;
	const initialGatewayProbe = shouldProbe ? await loadProbeGatewayModule().then(({ probeGateway }) => probeGateway({
		url: gatewayConnection.url,
		config: params.cfg,
		auth: gatewayProbeAuthResolution.auth,
		env: params.env,
		timeoutMs: probeTimeoutMs,
		detailLevel: params.opts.detailLevel ?? "presence"
	})).catch(() => null) : null;
	const gatewayProbe = await applyLocalStatusRpcFallback({
		cfg: params.cfg,
		configPath: params.configPath,
		gatewayMode,
		gatewayUrl: gatewayConnection.url,
		gatewayProbe: initialGatewayProbe,
		gatewayProbeAuth: gatewayProbeAuthResolution.auth,
		timeoutMs: probeTimeoutMs,
		timeoutMsExplicit,
		enabled: params.opts.localStatusRpcFallback !== false
	});
	if ((params.opts.mergeAuthWarningIntoProbeError ?? true) && gatewayProbeAuthWarning && gatewayProbe?.ok === false) {
		gatewayProbe.error = gatewayProbe.error ? `${gatewayProbe.error}; ${gatewayProbeAuthWarning}` : gatewayProbeAuthWarning;
		gatewayProbeAuthWarning = void 0;
	}
	const gatewayReachable = gatewayProbe ? isProbeReachable(gatewayProbe) : false;
	const gatewaySelf = gatewayProbe?.presence ? pickGatewaySelfPresence(gatewayProbe.presence) : null;
	return {
		gatewayConnection,
		remoteUrlMissing,
		gatewayMode,
		gatewayProbeAuth: gatewayProbeAuthResolution.auth,
		gatewayProbeAuthWarning,
		gatewayProbe,
		gatewayReachable,
		gatewaySelf,
		...remoteUrlMissing ? { gatewayCallOverrides: {
			url: gatewayConnection.url,
			token: gatewayProbeAuthResolution.auth.token,
			password: gatewayProbeAuthResolution.auth.password
		} } : {}
	};
}
/** Builds the published Tailscale HTTPS Control UI URL when exposure is enabled. */
function buildTailscaleHttpsUrl(params) {
	const host = resolveTailscalePublishedHost({
		tailscaleMode: params.tailscaleMode,
		tailnetHost: params.tailscaleDns
	});
	return params.tailscaleMode !== "off" && host ? `https://${host}${normalizeControlUiBasePath(params.controlUiBasePath)}` : null;
}
/** Resolves memory provider status without creating default stores just for status output. */
async function resolveSharedMemoryStatusSnapshot(params) {
	const { cfg, agentStatus, memoryPlugin } = params;
	if (!memoryPlugin.enabled || !memoryPlugin.slot) return null;
	const agentId = agentStatus.defaultId;
	if (!agentId) return null;
	if (memoryPlugin.slot !== defaultSlotIdForKey("memory")) return await resolveMemoryManagerStatusSnapshot(params, agentId);
	const hasExplicitConfig = hasExplicitMemorySearchConfig(cfg, agentId);
	const defaultDatabasePath = params.requireDefaultDatabasePath?.(agentId);
	if (defaultDatabasePath && !hasExplicitConfig && !await hasBuiltInMemoryState(defaultDatabasePath)) return null;
	const resolvedMemory = params.resolveMemoryConfig(cfg, agentId);
	if (!resolvedMemory) return null;
	if (!(hasExplicitConfig || await hasBuiltInMemoryState(resolvedMemory.store.databasePath))) return null;
	return await resolveMemoryManagerStatusSnapshot(params, agentId);
}
async function resolveMemoryManagerStatusSnapshot(params, agentId) {
	const { manager } = await params.getMemorySearchManager({
		cfg: params.cfg,
		agentId,
		purpose: "status",
		inspectSources: true
	});
	if (!manager) return null;
	try {
		try {
			if (manager.status().backend === "builtin" && manager.probeVectorStoreAvailability) await manager.probeVectorStoreAvailability();
			else await manager.probeVectorAvailability();
		} catch {}
		return {
			agentId,
			...manager.status()
		};
	} finally {
		await manager.close?.().catch(() => {});
	}
}
//#endregion
export { resolveSharedMemoryStatusSnapshot as i, resolveGatewayProbeSnapshot as n, resolveMemoryPluginStatus as r, buildTailscaleHttpsUrl as t };
