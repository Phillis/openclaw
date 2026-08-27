import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as resolveNodeServiceIdentityEnvironment, l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, n as GATEWAY_SERVICE_KIND, p as resolveGatewaySystemdServiceName, r as GATEWAY_SERVICE_MARKER } from "./constants-ChqKLfPp.js";
import { t as isBunRuntime } from "./runtime-binary-nmSHaTFz.js";
import { t as resolveNodeStartupTlsEnvironment } from "./node-startup-env-D9U9HRyU.js";
import { n as isSqliteWalResetSafeVersion } from "./sqlite-runtime-version-BnALlaD_.js";
import { i as getWindowsProgramFilesRoots } from "./windows-install-roots-BdGcwph2.js";
import { n as resolveGatewayStateDir } from "./paths-CzCbqt0l.js";
import { r as resolveGatewayHeapNodeOptions } from "./gateway-heap-BfwKOqCU.js";
import { i as isSupportedNodeVersion, r as isSupportedBunVersion } from "./runtime-guard-xF0n8O8f.js";
import { t as resolveStableNodePath } from "./stable-node-path-CysbL5Xo.js";
import { n as runExec } from "./exec-D2kbpwdA.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/daemon/service-env.ts
/** Builds minimal, portable environment blocks for managed daemon services. */
const SERVICE_PROXY_ENV_KEYS = [
	"OPENCLAW_PROXY_URL",
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"NO_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"no_proxy",
	"all_proxy"
];
function readServiceProxyEnvironment(env) {
	const proxyUrl = normalizeOptionalString(env.OPENCLAW_PROXY_URL);
	return proxyUrl ? { OPENCLAW_PROXY_URL: proxyUrl } : {};
}
function normalizeServicePathDir(dir) {
	const trimmed = dir?.trim();
	if (!trimmed || !path.posix.isAbsolute(trimmed)) return;
	return path.posix.normalize(trimmed);
}
function realpathServicePathDir(dir) {
	try {
		return path.posix.normalize(fs.realpathSync.native(dir));
	} catch {
		return;
	}
}
function realpathExistingServicePathDir(dir) {
	const parts = [];
	let current = dir;
	while (current && current !== path.posix.dirname(current)) {
		const realCurrent = realpathServicePathDir(current);
		if (realCurrent) return path.posix.normalize(path.posix.join(realCurrent, ...parts.toReversed()));
		parts.push(path.posix.basename(current));
		current = path.posix.dirname(current);
	}
	const realRoot = realpathServicePathDir(current);
	return realRoot ? path.posix.normalize(path.posix.join(realRoot, ...parts.toReversed())) : void 0;
}
function isSameOrChildPath(candidate, parent) {
	return candidate === parent || candidate.startsWith(`${parent}/`);
}
function isUnsafeProcPath(candidate) {
	return candidate === "/proc" || candidate.startsWith("/proc/");
}
function isWorkspaceDerivedPath(dir, options) {
	if (isUnsafeProcPath(dir)) return true;
	const cwd = normalizeServicePathDir(options.cwd ?? process.cwd());
	if (!cwd) return false;
	const home = normalizeServicePathDir(options.home);
	if (home && cwd === home) return false;
	if (isSameOrChildPath(dir, cwd)) return true;
	const realDir = realpathExistingServicePathDir(dir);
	const realCwd = realpathServicePathDir(cwd);
	const realHome = home ? realpathServicePathDir(home) : void 0;
	return Boolean(realDir && realCwd && realHome !== realCwd && isSameOrChildPath(realDir, realCwd));
}
function addEnvConfiguredBinDir(dirs, dir, options) {
	const normalized = normalizeServicePathDir(dir);
	if (!normalized || isWorkspaceDerivedPath(normalized, options)) return;
	dirs.push(normalized);
}
function appendSubdir(base, subdir) {
	if (!base) return;
	return base.endsWith(`/${subdir}`) ? base : path.posix.join(base, subdir);
}
function addExistingDir(dirs, candidate, existsSync) {
	if (existsSync(candidate)) dirs.push(candidate);
}
function addCommonUserBinDirs(dirs, home, existsSync, includeMissingDefaults) {
	const addDefault = includeMissingDefaults ? (candidate) => dirs.push(candidate) : (candidate) => addExistingDir(dirs, candidate, existsSync);
	addDefault(`${home}/.local/bin`);
	addDefault(`${home}/.npm-global/bin`);
	addDefault(`${home}/bin`);
	addExistingDir(dirs, `${home}/.volta/bin`, existsSync);
	addExistingDir(dirs, `${home}/.asdf/shims`, existsSync);
	addExistingDir(dirs, `${home}/.bun/bin`, existsSync);
}
function addCommonEnvConfiguredBinDirs(dirs, env, options) {
	addEnvConfiguredBinDir(dirs, env?.PNPM_HOME, options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.PNPM_HOME, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.NPM_CONFIG_PREFIX, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.BUN_INSTALL, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.VOLTA_HOME, "bin"), options);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.ASDF_DATA_DIR, "shims"), options);
}
function addNixProfileBinDirs(dirs, home, env, options, includeMissingDefault, existsSync) {
	const nixProfiles = env?.NIX_PROFILES?.trim();
	if (nixProfiles) for (const profile of nixProfiles.split(/\s+/).toReversed()) addEnvConfiguredBinDir(dirs, appendSubdir(profile, "bin"), options);
	else {
		const defaultProfileBin = `${home}/.nix-profile/bin`;
		if (includeMissingDefault) dirs.push(defaultProfileBin);
		else addExistingDir(dirs, defaultProfileBin, existsSync);
	}
}
function resolveSystemPathDirs(platform) {
	if (platform === "darwin") return [
		"/opt/homebrew/bin",
		"/opt/homebrew/sbin",
		"/usr/local/bin",
		"/usr/bin",
		"/bin",
		"/usr/sbin",
		"/sbin"
	];
	if (platform === "linux") return [
		"/usr/local/bin",
		"/usr/bin",
		"/bin"
	];
	return [];
}
/** Resolve common user bin directories while preserving platform-specific manager roots. */
function resolveUserBinDirs(home, platform, env, existsSync = fs.existsSync, options = {}) {
	if (!home) return [];
	const dirs = [];
	const pathOptions = {
		...options,
		home
	};
	const includeMissingUserBinDefaults = options.includeMissingUserBinDefaults ?? true;
	addCommonEnvConfiguredBinDirs(dirs, env, pathOptions);
	addEnvConfiguredBinDir(dirs, platform === "darwin" ? env?.NVM_DIR : appendSubdir(env?.NVM_DIR, "current/bin"), pathOptions);
	addEnvConfiguredBinDir(dirs, appendSubdir(env?.FNM_DIR, "aliases/default/bin"), pathOptions);
	if (platform === "linux") addEnvConfiguredBinDir(dirs, appendSubdir(env?.FNM_DIR, "current/bin"), pathOptions);
	addCommonUserBinDirs(dirs, home, existsSync, includeMissingUserBinDefaults);
	addNixProfileBinDirs(dirs, home, env, pathOptions, includeMissingUserBinDefaults, existsSync);
	const managerDirs = platform === "darwin" ? [
		"Library/Application Support/fnm/aliases/default/bin",
		".fnm/aliases/default/bin",
		"Library/pnpm/bin",
		"Library/pnpm",
		".local/share/pnpm/bin",
		".local/share/pnpm"
	] : [
		".nvm/current/bin",
		".local/share/fnm/aliases/default/bin",
		".local/share/fnm/current/bin",
		".fnm/aliases/default/bin",
		".fnm/current/bin",
		".local/share/pnpm/bin",
		".local/share/pnpm"
	];
	for (const directory of managerDirs) addExistingDir(dirs, `${home}/${directory}`, existsSync);
	return dirs;
}
function getMinimalServicePathParts(options = {}) {
	const platform = options.platform ?? process.platform;
	if (platform === "win32") return [];
	const extraDirs = options.extraDirs ?? [];
	const systemDirs = resolveSystemPathDirs(platform);
	const includeUserDirs = options.includeUserDirs ?? platform !== "darwin";
	const existsSync = options.existsSync ?? fs.existsSync;
	const userDirs = includeUserDirs && (platform === "linux" || platform === "darwin") ? resolveUserBinDirs(options.home, platform, options.env, existsSync, options) : [];
	return [...new Set([
		...extraDirs,
		...systemDirs,
		...userDirs
	].filter(Boolean))];
}
function getMinimalServicePathPartsFromEnv(options = {}) {
	const env = options.env ?? process.env;
	return getMinimalServicePathParts({
		...options,
		home: options.home ?? env.HOME,
		env
	});
}
function buildMinimalServicePath(options = {}) {
	const env = options.env ?? process.env;
	return getMinimalServicePathPartsFromEnv({
		...options,
		env
	}).join(path.posix.delimiter);
}
function resolveGatewaySystemdUnitEnv(env) {
	const override = normalizeOptionalString(env.OPENCLAW_SYSTEMD_UNIT);
	if (override) return override.endsWith(".service") ? override : `${override}.service`;
	return `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
function buildServiceEnvironment(params) {
	const { env, port, launchdLabel, extraPathDirs } = params;
	const platform = params.platform ?? process.platform;
	const sharedEnv = resolveSharedServiceEnvironmentFields(env, platform, extraPathDirs, params.execPath);
	const profile = env.OPENCLAW_PROFILE;
	const wrapperPath = normalizeOptionalString(env.OPENCLAW_WRAPPER);
	const resolvedLaunchdLabel = launchdLabel || (platform === "darwin" ? resolveGatewayLaunchAgentLabel(profile) : void 0);
	const systemdUnit = resolveGatewaySystemdUnitEnv(env);
	return {
		...buildCommonServiceEnvironment(env, sharedEnv),
		NODE_OPTIONS: resolveGatewayHeapNodeOptions(params.existingNodeOptions),
		OPENCLAW_PROFILE: profile,
		OPENCLAW_WRAPPER: wrapperPath,
		OPENCLAW_GATEWAY_PORT: String(port),
		OPENCLAW_LAUNCHD_LABEL: resolvedLaunchdLabel,
		OPENCLAW_SYSTEMD_UNIT: systemdUnit,
		OPENCLAW_WINDOWS_TASK_NAME: resolveGatewayWindowsTaskName(profile),
		OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		OPENCLAW_SERVICE_MARKER: GATEWAY_SERVICE_MARKER,
		OPENCLAW_SERVICE_KIND: GATEWAY_SERVICE_KIND
	};
}
function buildNodeServiceEnvironment(params) {
	const { env, extraPathDirs } = params;
	const platform = params.platform ?? process.platform;
	const sharedEnv = resolveSharedServiceEnvironmentFields(env, platform, extraPathDirs, params.execPath);
	const gatewayToken = normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN);
	const gatewayPassword = normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD);
	const cloudflareAccessClientId = normalizeOptionalString(env.CF_ACCESS_CLIENT_ID);
	const cloudflareAccessClientSecret = normalizeOptionalString(env.CF_ACCESS_CLIENT_SECRET);
	const allowInsecurePrivateWs = normalizeOptionalString(env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS);
	return {
		...buildCommonServiceEnvironment(env, sharedEnv),
		OPENCLAW_GATEWAY_TOKEN: gatewayToken,
		OPENCLAW_GATEWAY_PASSWORD: gatewayPassword,
		CF_ACCESS_CLIENT_ID: cloudflareAccessClientId,
		CF_ACCESS_CLIENT_SECRET: cloudflareAccessClientSecret,
		OPENCLAW_ALLOW_INSECURE_PRIVATE_WS: allowInsecurePrivateWs,
		NODE_DISABLE_COMPILE_CACHE: platform === "darwin" ? "1" : void 0,
		...resolveNodeServiceIdentityEnvironment()
	};
}
function buildCommonServiceEnvironment(env, sharedEnv) {
	const serviceEnv = {
		HOME: env.HOME,
		TMPDIR: sharedEnv.tmpDir,
		NODE_EXTRA_CA_CERTS: sharedEnv.nodeCaCerts,
		NODE_USE_SYSTEM_CA: sharedEnv.nodeUseSystemCa,
		OPENCLAW_STATE_DIR: sharedEnv.stateDir,
		OPENCLAW_CONFIG_PATH: sharedEnv.configPath,
		...sharedEnv.proxyEnv
	};
	if (sharedEnv.minimalPath) serviceEnv.PATH = sharedEnv.minimalPath;
	return serviceEnv;
}
function resolveServiceTmpDir(env, platform) {
	if (platform === "darwin") try {
		return path.join(resolveGatewayStateDir(env), "tmp");
	} catch {
		return env.TMPDIR?.trim() || os.tmpdir();
	}
	return env.TMPDIR?.trim() || os.tmpdir();
}
function resolveSharedServiceEnvironmentFields(env, platform, extraPathDirs, execPath) {
	const stateDir = env.OPENCLAW_STATE_DIR;
	const configPath = env.OPENCLAW_CONFIG_PATH;
	const tmpDir = resolveServiceTmpDir(env, platform);
	const startupTlsEnv = resolveNodeStartupTlsEnvironment({
		env,
		platform,
		execPath
	});
	return {
		stateDir,
		configPath,
		tmpDir,
		minimalPath: platform === "win32" ? void 0 : buildMinimalServicePath({
			env,
			platform,
			extraDirs: extraPathDirs
		}),
		proxyEnv: readServiceProxyEnvironment(env),
		nodeCaCerts: startupTlsEnv.NODE_EXTRA_CA_CERTS,
		nodeUseSystemCa: startupTlsEnv.NODE_USE_SYSTEM_CA
	};
}
//#endregion
//#region src/daemon/service-path-policy.ts
/** Classifies service PATH entries that should not be frozen into daemons. */
function getPathModule$1(platform) {
	return platform === "win32" ? path.win32 : path.posix;
}
function normalizeServicePathEntry(entry, platform) {
	const normalized = getPathModule$1(platform).normalize(entry).replaceAll("\\", "/");
	if (platform === "win32") return normalizeLowercaseStringOrEmpty(normalized);
	return normalized;
}
function isNonMinimalServicePathEntry(entry, platform) {
	if (platform === "win32") return false;
	const normalized = normalizeServicePathEntry(entry, platform);
	return normalized.includes("/.nvm/") || normalized.includes("/.fnm/") || normalized.includes("/.local/share/fnm/") || normalized.includes("/.volta/") || normalized.includes("/.asdf/") || normalized.includes("/.n/") || normalized.includes("/.nodenv/") || normalized.includes("/.nodebrew/") || normalized.includes("/nvs/") || normalized.includes("/.local/share/pnpm/") || normalized.includes("/pnpm/") || normalized.endsWith("/pnpm");
}
//#endregion
//#region src/daemon/runtime-paths.ts
/** Selects stable runtime executable paths for daemon installs across platforms. */
const VERSION_MANAGER_MARKERS = [
	"/.nvm/",
	"/.fnm/",
	"/.local/share/fnm/",
	"/library/application support/fnm/",
	"/.volta/",
	"/.asdf/",
	"/.local/share/mise/",
	"/.n/",
	"/.nodenv/",
	"/.nodebrew/",
	"/nvs/"
];
function getPathModule(platform) {
	return platform === "win32" ? path.win32 : path.posix;
}
function isNodeExecPath(execPath, platform) {
	const base = normalizeLowercaseStringOrEmpty(getPathModule(platform).basename(execPath));
	return base === "node" || base === "node.exe";
}
function normalizeForCompare(input, platform) {
	const normalized = getPathModule(platform).normalize(input).replaceAll("\\", "/");
	if (platform === "win32") return normalizeLowercaseStringOrEmpty(normalized);
	return normalized;
}
function buildSystemNodeCandidates(env, platform) {
	if (platform === "darwin") return [
		"/opt/homebrew/bin/node",
		"/opt/homebrew/opt/node/bin/node",
		"/opt/homebrew/opt/node@24/bin/node",
		"/opt/homebrew/opt/node@22/bin/node",
		"/usr/local/bin/node",
		"/usr/local/opt/node/bin/node",
		"/usr/local/opt/node@24/bin/node",
		"/usr/local/opt/node@22/bin/node",
		"/usr/bin/node"
	];
	if (platform === "linux") return ["/usr/local/bin/node", "/usr/bin/node"];
	if (platform === "win32") {
		const pathModule = getPathModule(platform);
		return getWindowsProgramFilesRoots(env).map((root) => pathModule.join(root, "nodejs", "node.exe"));
	}
	return [];
}
function buildBunCandidates(env, platform, execPath) {
	const pathModule = getPathModule(platform);
	const executable = platform === "win32" ? "bun.exe" : "bun";
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	const addCandidate = (candidate) => {
		if (!candidate || !pathModule.isAbsolute(candidate)) return;
		const normalized = normalizeForCompare(candidate, platform);
		if (seen.has(normalized)) return;
		seen.add(normalized);
		candidates.push(candidate);
	};
	const bunInstall = env.BUN_INSTALL?.trim();
	if (bunInstall) addCandidate(pathModule.join(bunInstall, "bin", executable));
	const home = (platform === "win32" ? env.USERPROFILE : env.HOME)?.trim();
	if (home) addCandidate(pathModule.join(home, ".bun", "bin", executable));
	const pathEnv = env.PATH ?? env.Path ?? env.path ?? "";
	const delimiter = platform === "win32" ? ";" : ":";
	for (const entry of pathEnv.split(delimiter)) {
		const trimmed = entry.trim();
		if (trimmed) addCandidate(pathModule.join(trimmed, executable));
	}
	if (isBunRuntime(execPath)) addCandidate(execPath);
	for (const candidate of platform === "darwin" ? [
		"/opt/homebrew/bin/bun",
		"/usr/local/bin/bun",
		"/usr/bin/bun"
	] : platform === "linux" ? ["/usr/local/bin/bun", "/usr/bin/bun"] : []) addCandidate(candidate);
	return candidates;
}
const RUNTIME_PROBE_TIMEOUT_MS = 5e3;
const execFileAsync = async (file, args, options) => await runExec(file, [...args], {
	logOutput: false,
	timeoutMs: options.timeoutMs
});
const NODE_RUNTIME_PROBE = String.raw`
let sqliteVersion = null;
try {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(":memory:");
  try {
    sqliteVersion = db.prepare("SELECT sqlite_version() AS version").get()?.version ?? null;
  } finally {
    db.close();
  }
} catch {}
const variables = (process.config && process.config.variables) || {};
const nodeSharedSqlite = variables.node_shared_sqlite === true || variables.node_shared_sqlite === "true";
process.stdout.write(JSON.stringify({ nodeVersion: process.versions.node, sqliteVersion, nodeSharedSqlite }));
`;
const BUN_RUNTIME_PROBE = String.raw`
let hasNodeSqlite = false;
let sqliteVersion = null;
try {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(":memory:");
  try {
    sqliteVersion = db.prepare("SELECT sqlite_version() AS version").get()?.version ?? null;
    hasNodeSqlite = true;
  } finally {
    db.close();
  }
} catch {}
process.stdout.write(JSON.stringify({ bunVersion: process.versions.bun ?? null, hasNodeSqlite, sqliteVersion }));
`;
async function resolveNodeRuntimeInfo(nodePath, execFileImpl) {
	try {
		const { stdout } = await execFileImpl(nodePath, ["-e", NODE_RUNTIME_PROBE], {
			encoding: "utf8",
			timeoutMs: RUNTIME_PROBE_TIMEOUT_MS
		});
		const parsed = JSON.parse(stdout);
		if (!isRecord(parsed)) throw new Error("Node runtime probe returned invalid output");
		const nodeVersion = typeof parsed.nodeVersion === "string" ? parsed.nodeVersion : null;
		const sqliteVersion = typeof parsed.sqliteVersion === "string" ? parsed.sqliteVersion : null;
		return {
			nodeVersion,
			sqliteVersion,
			nodeSharedSqlite: parsed.nodeSharedSqlite === true || parsed.nodeSharedSqlite === "true",
			supported: isSupportedNodeVersion(nodeVersion) && sqliteVersion !== null && isSqliteWalResetSafeVersion(sqliteVersion)
		};
	} catch {
		return {
			nodeVersion: null,
			sqliteVersion: null,
			nodeSharedSqlite: false,
			supported: false
		};
	}
}
/** Probes whether a Bun executable satisfies the managed daemon runtime contract. */
async function resolveBunRuntimeInfo(bunPath, execFileImpl = execFileAsync) {
	try {
		const { stdout } = await execFileImpl(bunPath, ["-e", BUN_RUNTIME_PROBE], {
			encoding: "utf8",
			timeoutMs: RUNTIME_PROBE_TIMEOUT_MS
		});
		const parsed = JSON.parse(stdout);
		if (!isRecord(parsed)) throw new Error("Bun runtime probe returned invalid output");
		const version = typeof parsed.bunVersion === "string" ? parsed.bunVersion : null;
		const hasNodeSqlite = parsed.hasNodeSqlite === true;
		const sqliteVersion = typeof parsed.sqliteVersion === "string" ? parsed.sqliteVersion : null;
		return {
			version,
			hasNodeSqlite,
			sqliteVersion,
			supported: isSupportedBunVersion(version) && hasNodeSqlite && sqliteVersion !== null && isSqliteWalResetSafeVersion(sqliteVersion)
		};
	} catch {
		return {
			version: null,
			hasNodeSqlite: false,
			sqliteVersion: null,
			supported: false
		};
	}
}
async function isVersionManagedRealNodePath(nodePath, platform) {
	try {
		return isVersionManagedNodePath(await fs$1.realpath(nodePath), platform);
	} catch {
		return false;
	}
}
/** True when a Node path lives under a known user version-manager root. */
function isVersionManagedNodePath(nodePath, platform = process.platform) {
	const normalized = normalizeLowercaseStringOrEmpty(normalizeForCompare(nodePath, platform));
	return VERSION_MANAGER_MARKERS.some((marker) => normalized.includes(marker));
}
/** True when a Node path matches known system install candidates for the platform. */
function isSystemNodePath(nodePath, env = process.env, platform = process.platform) {
	const normalized = normalizeForCompare(nodePath, platform);
	return buildSystemNodeCandidates(env, platform).some((candidate) => {
		const normalizedCandidate = normalizeForCompare(candidate, platform);
		return normalized === normalizedCandidate;
	});
}
/** Resolves the first available system Node candidate for the platform. */
async function resolveSystemNodePath(env = process.env, platform = process.platform) {
	const candidates = buildSystemNodeCandidates(env, platform);
	for (const candidate of candidates) try {
		await fs$1.access(candidate);
		return candidate;
	} catch {}
	return null;
}
/** Resolves system Node info, preferring a supported non-version-managed install. */
async function resolveSystemNodeInfo(params) {
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const execFileImpl = params.execFile ?? execFileAsync;
	let firstAvailable = null;
	for (const systemNode of buildSystemNodeCandidates(env, platform)) {
		try {
			await fs$1.access(systemNode);
		} catch {
			continue;
		}
		if (await isVersionManagedRealNodePath(systemNode, platform)) continue;
		const runtime = await resolveNodeRuntimeInfo(systemNode, execFileImpl);
		const info = {
			path: systemNode,
			sqliteVersion: runtime.sqliteVersion,
			version: runtime.nodeVersion,
			nodeSharedSqlite: runtime.nodeSharedSqlite,
			supported: runtime.supported
		};
		if (info.supported) return info;
		firstAvailable ??= info;
	}
	return firstAvailable;
}
/** Renders a warning when the system Node exists but is unsuitable for the daemon. */
function renderSystemNodeWarning(systemNode, selectedNodePath) {
	if (!systemNode || systemNode.supported) return null;
	const selectedLabel = selectedNodePath ? ` Using ${selectedNodePath} for the daemon.` : "";
	if (systemNode.version === null) return `System Node at ${systemNode.path} is available, but its version could not be determined.${selectedLabel} Install Node 24.15+ (recommended) or Node 22.22.3+ from nodejs.org or Homebrew.`;
	const versionLabel = systemNode.version;
	if (isSupportedNodeVersion(systemNode.version)) {
		const sqliteLabel = systemNode.sqliteVersion ?? "unknown";
		if (systemNode.nodeSharedSqlite) return `System Node ${versionLabel} at ${systemNode.path} uses shared system SQLite ${sqliteLabel}, which is not WAL-reset-safe.${selectedLabel} Upgrade the system SQLite library to 3.51.3+ (or patched 3.50.7+/3.44.6+), or install a Node build that embeds a safe version.`;
		return `System Node ${versionLabel} at ${systemNode.path} uses SQLite ${sqliteLabel}, which is not WAL-reset-safe.${selectedLabel} Install Node 24.15+ (recommended) or Node 22.22.3+ from nodejs.org or Homebrew.`;
	}
	return `System Node ${versionLabel} at ${systemNode.path} is outside the supported range.${selectedLabel} Install Node 24.15+ (recommended) or Node 22.22.3+ from nodejs.org or Homebrew.`;
}
/** Resolves the Node binary the daemon should use for a node runtime. */
async function resolvePreferredNodePath(params) {
	if (params.runtime !== "node") return;
	const platform = params.platform ?? process.platform;
	const currentExecPath = params.execPath ?? process.execPath;
	const execFileImpl = params.execFile ?? execFileAsync;
	if (currentExecPath && isNodeExecPath(currentExecPath, platform)) {
		if ((await resolveNodeRuntimeInfo(currentExecPath, execFileImpl)).supported) {
			const stableCurrentPath = await resolveStableNodePath(currentExecPath);
			if (!isVersionManagedNodePath(currentExecPath, platform)) return stableCurrentPath;
			const systemNode = await resolveSystemNodeInfo({
				env: params.env,
				platform,
				execFile: execFileImpl
			});
			if (systemNode?.supported) return systemNode.path;
			return stableCurrentPath;
		}
	}
	const systemNode = await resolveSystemNodeInfo(params);
	if (!systemNode?.supported) return;
	return systemNode.path;
}
/** Resolves a stable Bun binary that satisfies the daemon runtime contract. */
async function resolvePreferredBunPath(params) {
	if (params.runtime !== "bun") return;
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const execFileImpl = params.execFile ?? execFileAsync;
	const currentExecPath = params.execPath ?? process.execPath;
	for (const candidate of buildBunCandidates(env, platform, currentExecPath)) if ((await resolveBunRuntimeInfo(candidate, execFileImpl)).supported) return candidate;
}
//#endregion
export { resolvePreferredBunPath as a, resolveSystemNodePath as c, SERVICE_PROXY_ENV_KEYS as d, buildNodeServiceEnvironment as f, resolveBunRuntimeInfo as i, isNonMinimalServicePathEntry as l, getMinimalServicePathPartsFromEnv as m, isVersionManagedNodePath as n, resolvePreferredNodePath as o, buildServiceEnvironment as p, renderSystemNodeWarning as r, resolveSystemNodeInfo as s, isSystemNodePath as t, normalizeServicePathEntry as u };
