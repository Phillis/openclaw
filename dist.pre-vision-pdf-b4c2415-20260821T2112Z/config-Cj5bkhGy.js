import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as parseBooleanValue } from "./boolean-DmBL0YJK.js";
import { o as normalizeOptionalTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { d as resolveExistingPathsWithinRoot, f as resolveStrictExistingPathsWithinRoot } from "./fs-safe-C9N8pCh1.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { t as CONFIG_DIR } from "./utils-DEqefz4f.js";
import { _ as resolveGatewayPort } from "./paths-CqeDjSA4.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { m as mergeSsrFPolicies } from "./ssrf-UFPP-fbI.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-policy-DykNyVe7.js";
import "./text-utility-runtime-LRU688AB.js";
import "./core-BEnl4KjI.js";
import "./plugin-config-runtime-D7ikroCS.js";
import "./config-mutation-C7qu4yQE.js";
import "./runtime-config-snapshot-HfaoynDJ.js";
import { t as parseBrowserHttpUrl } from "./browser-config-B_uQJIyR.js";
import { c as DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS, f as DEFAULT_OPENCLAW_BROWSER_COLOR, i as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, l as DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS, m as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME } from "./constants-0X-2im2J.js";
import "./tmp-openclaw-dir-D8YnNVMn.js";
import { r as resolveExtensionRelayToken } from "./relay-auth-Cwei20kM.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/sdk-config.ts
/**
* Browser-local SDK config bridge plus Browser-specific default port helpers.
*/
const DEFAULT_BROWSER_CDP_PORT_RANGE_START$1 = 18800;
const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
const DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN = DEFAULT_BROWSER_CDP_PORT_RANGE_END - DEFAULT_BROWSER_CDP_PORT_RANGE_START$1;
/** Default loopback port for the Browser control server. */
const DEFAULT_BROWSER_CONTROL_PORT = 18791;
function isValidPort(port) {
	return Number.isFinite(port) && port > 0 && port <= 65535;
}
function clampPort(port, fallback) {
	return isValidPort(port) ? port : fallback;
}
function derivePort(base, offset, fallback) {
	return clampPort(base + offset, fallback);
}
/** Derives the Browser control port from the gateway port. */
function deriveDefaultBrowserControlPort(gatewayPort) {
	return derivePort(gatewayPort, 2, DEFAULT_BROWSER_CONTROL_PORT);
}
/** Derives the managed Chrome CDP port range from the Browser control port. */
function deriveDefaultBrowserCdpPortRange(browserControlPort) {
	const start = derivePort(browserControlPort, 9, DEFAULT_BROWSER_CDP_PORT_RANGE_START$1);
	const end = start + DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN;
	if (end <= 65535) return {
		start,
		end
	};
	return {
		start: DEFAULT_BROWSER_CDP_PORT_RANGE_START$1,
		end: DEFAULT_BROWSER_CDP_PORT_RANGE_END
	};
}
//#endregion
//#region extensions/browser/src/browser/paths.ts
/**
* Browser filesystem path helpers.
*
* Defines browser output roots and resolves upload/media references while
* enforcing root-scoped path access for Browser tool file inputs.
*/
const DEFAULT_FALLBACK_BROWSER_TMP_DIR = "/tmp/openclaw";
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
const DEFAULT_BROWSER_TMP_DIR = canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : DEFAULT_FALLBACK_BROWSER_TMP_DIR;
/** Default root directory for browser trace files. */
const DEFAULT_TRACE_DIR = DEFAULT_BROWSER_TMP_DIR;
/** Default root directory for browser downloads. */
const DEFAULT_DOWNLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "downloads");
/** Default root directory for browser upload inputs. */
const DEFAULT_UPLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "uploads");
/** Default root directory for managed inbound media references. */
const DEFAULT_INBOUND_MEDIA_DIR = path.join(CONFIG_DIR, "media", "inbound");
function normalizeUploadPathSource(source) {
	const trimmed = source.trim();
	if (/^media:\/\//i.test(trimmed)) return trimmed;
	return trimmed.replace(/^\s*MEDIA\s*:\s*/i, "").trim();
}
function decodeInboundMediaId(value, source) {
	let id;
	try {
		id = decodeURIComponent(value);
	} catch {
		return {
			ok: false,
			error: `Invalid media reference: ${source}`
		};
	}
	if (!id || id === "." || id === ".." || id.includes("/") || id.includes("\\") || id.includes("\0")) return {
		ok: false,
		error: `Invalid media reference: ${source}`
	};
	return {
		ok: true,
		path: id
	};
}
function resolveManagedInboundMediaRef(source, inboundMediaDir) {
	const normalizedSource = normalizeUploadPathSource(source);
	if (!normalizedSource) return null;
	if (/^media:\/\//i.test(normalizedSource)) {
		const rawPath = /^media:\/\/[^/?#]*([^?#]*)/iu.exec(normalizedSource)?.[1] ?? "";
		let parsed;
		try {
			parsed = new URL(normalizedSource);
		} catch {
			return {
				ok: false,
				error: `Invalid media reference: ${normalizedSource}`
			};
		}
		if (parsed.hostname !== "inbound") return {
			ok: false,
			error: `Unsupported media reference location: ${parsed.hostname || "(missing)"}`
		};
		if (!rawPath.startsWith("/") || rawPath.slice(1).includes("/") || rawPath.includes("\\")) return {
			ok: false,
			error: `Invalid media reference: ${normalizedSource}`
		};
		const decoded = decodeInboundMediaId(rawPath.slice(1), normalizedSource);
		return decoded?.ok ? {
			ok: true,
			path: path.join(inboundMediaDir, decoded.path),
			uploadRootPrecedence: false
		} : decoded;
	}
	const relativeMatch = /^(?:\.\/)?media\/inbound\/([^/\\]+)$/u.exec(normalizedSource);
	if (!relativeMatch?.[1]) return null;
	const decoded = decodeInboundMediaId(relativeMatch[1], normalizedSource);
	return decoded?.ok ? {
		ok: true,
		path: path.join(inboundMediaDir, decoded.path),
		uploadRootPrecedence: true
	} : decoded;
}
async function isDirectInboundMediaFile(params) {
	let inboundRoot;
	try {
		inboundRoot = await fs.realpath(params.inboundMediaDir);
	} catch {
		inboundRoot = path.resolve(params.inboundMediaDir);
	}
	const relativePath = path.relative(inboundRoot, params.resolvedPath);
	return Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath) && !relativePath.includes("/") && !relativePath.includes("\\");
}
async function resolveDirectInboundMediaPath(params) {
	const inboundPathsResult = params.strict ? await resolveStrictExistingPathsWithinRoot({
		rootDir: params.inboundMediaDir,
		requestedPaths: [params.requestedPath],
		scopeLabel: `inbound media directory (${params.inboundMediaDir})`
	}) : await resolveExistingPathsWithinRoot({
		rootDir: params.inboundMediaDir,
		requestedPaths: [params.requestedPath],
		scopeLabel: `inbound media directory (${params.inboundMediaDir})`
	});
	if (!inboundPathsResult.ok) return inboundPathsResult;
	const resolvedPath = inboundPathsResult.paths[0] ?? params.requestedPath;
	if (!await isDirectInboundMediaFile({
		inboundMediaDir: params.inboundMediaDir,
		resolvedPath
	})) return {
		ok: false,
		error: `Invalid media reference: must be a direct child of inbound media directory (${params.inboundMediaDir})`
	};
	return inboundPathsResult;
}
/** Resolve upload paths and managed media references into existing file paths. */
async function resolveExistingUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = managedMediaPathResult?.uploadRootPrecedence === true ? await resolveStrictExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			}) : await resolveExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			});
			if (uploadPathsResult.ok) {
				paths.push(uploadPathsResult.paths[0] ?? requestedPath);
				continue;
			}
		}
		const inboundPathsResult = await resolveDirectInboundMediaPath({
			inboundMediaDir,
			requestedPath: managedMediaPathResult?.path ?? requestedPath,
			strict: false
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
/** Strictly resolve upload paths under the upload root only. */
async function resolveStrictExistingUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = await resolveStrictExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			});
			if (uploadPathsResult.ok) {
				paths.push(uploadPathsResult.paths[0] ?? requestedPath);
				continue;
			}
		}
		const inboundPathsResult = await resolveDirectInboundMediaPath({
			inboundMediaDir,
			requestedPath: managedMediaPathResult?.path ?? requestedPath,
			strict: true
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
//#endregion
//#region extensions/browser/src/browser/config.ts
/**
* Browser config resolution.
*
* Normalizes raw browser config into resolved runtime defaults, profile
* records, SSRF policy, timeouts, headless mode, and managed Chrome settings.
*/
/** Read a named browser profile without falling through to inherited object keys. */
function getOwnBrowserProfile(profiles, name) {
	return profiles && Object.hasOwn(profiles, name) ? profiles[name] : void 0;
}
const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
const DEFAULT_BROWSER_REMOTE_CDP_TIMEOUT_MS = 1500;
const DEFAULT_BROWSER_REMOTE_CDP_HANDSHAKE_TIMEOUT_MS = 3e3;
/**
* Default extension relay port offset from the browser control port. Sits just
* below the CDP allocation range (controlPort+9..) so profile port allocation
* can never hand this port to a managed profile.
*/
const EXTENSION_RELAY_PORT_OFFSET = 8;
/** Username half of the process-only internal relay credential. */
const EXTENSION_RELAY_CDP_USER = "openclaw-internal";
/** Environment variable that overrides managed Chrome headless mode. */
const BROWSER_HEADLESS_ENV_KEY = "OPENCLAW_BROWSER_HEADLESS";
function normalizeExecutablePath(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	if (!/^~(?=$|[\\/])/.test(value)) return value;
	return path.resolve(value.replace(/^~(?=$|[\\/])/, os.homedir()));
}
function normalizeExistingSessionCdpUrl(raw, profileName) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`browser.profiles.${profileName}.cdpUrl must be a valid URL.`);
	}
	if (![
		"http:",
		"https:",
		"ws:",
		"wss:"
	].includes(parsed.protocol)) throw new Error(`browser.profiles.${profileName}.cdpUrl must use http, https, ws, or wss.`);
	return {
		cdpUrl: parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString().replace(/\/$/, "") : parsed.toString(),
		cdpHost: parsed.hostname,
		cdpIsLoopback: isLoopbackHost(parsed.hostname)
	};
}
function hasLinuxDisplay(env) {
	return Boolean(env.DISPLAY?.trim() || env.WAYLAND_DISPLAY?.trim());
}
function isLocalManagedProfile(profile) {
	return profile.driver === "openclaw" && profile.cdpIsLoopback && !profile.attachOnly;
}
function resolveBrowserTabCleanupConfig(cfg) {
	return {
		enabled: (cfg?.tabCleanup)?.enabled ?? true,
		idleMinutes: 120,
		maxTabsPerSession: 8,
		sweepMinutes: 5
	};
}
const normalizeStringList = normalizeOptionalTrimmedStringList;
function resolveBrowserSsrFPolicy(cfg) {
	const rawPolicy = cfg?.ssrfPolicy;
	const allowPrivateNetwork = rawPolicy?.allowPrivateNetwork;
	const dangerouslyAllowPrivateNetwork = rawPolicy?.dangerouslyAllowPrivateNetwork;
	const hasExplicitPrivateSetting = allowPrivateNetwork !== void 0 || dangerouslyAllowPrivateNetwork !== void 0;
	const resolved = mergeSsrFPolicies({
		...rawPolicy,
		allowedHostnames: normalizeStringList(rawPolicy?.allowedHostnames)
	});
	if (resolved && hasExplicitPrivateSetting) {
		delete resolved.allowPrivateNetwork;
		resolved.dangerouslyAllowPrivateNetwork = allowPrivateNetwork === true || dangerouslyAllowPrivateNetwork === true;
	}
	return resolved ?? (hasExplicitPrivateSetting ? { dangerouslyAllowPrivateNetwork: false } : {});
}
function ensureDefaultProfile(profiles, legacyCdpPort, derivedDefaultCdpPort, legacyCdpUrl) {
	const result = { ...profiles };
	if (!result["openclaw"]) result[DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME] = {
		cdpPort: legacyCdpPort ?? derivedDefaultCdpPort ?? DEFAULT_BROWSER_CDP_PORT_RANGE_START,
		...legacyCdpUrl ? { cdpUrl: legacyCdpUrl } : {}
	};
	return result;
}
function ensureDefaultUserBrowserProfile(profiles) {
	const result = { ...profiles };
	if (result.user) return result;
	result.user = {
		driver: "existing-session",
		attachOnly: true
	};
	return result;
}
/** Built-in profile for the Chrome extension relay (user's signed-in browser). */
function ensureDefaultChromeExtensionProfile(profiles) {
	const result = { ...profiles };
	if (result.chrome) return result;
	result.chrome = { driver: "extension" };
	return result;
}
/**
* Assign a distinct loopback relay port to each extension-driver profile that
* does not pin its own cdpPort. Ports count down from the default (controlPort+8)
* — below the managed CDP allocation band (controlPort+9..) — so extension
* relays and managed Chrome never contend, and two extension profiles never
* share one port. Deterministic (sorted names) so restarts keep the same URLs.
*/
function resolveExtensionRelayPorts(profiles, defaultPort) {
	const names = Object.entries(profiles).filter(([, profile]) => profile.driver === "extension" && profile.cdpPort == null).map(([name]) => name).toSorted();
	const reservedPorts = new Set(Object.values(profiles).map((profile) => profile.cdpPort).filter((port) => typeof port === "number"));
	const ports = {};
	const minimumPort = defaultPort - EXTENSION_RELAY_PORT_OFFSET;
	let nextPort = defaultPort;
	for (const name of names) {
		while (nextPort > minimumPort && reservedPorts.has(nextPort)) nextPort -= 1;
		if (nextPort <= minimumPort) throw new Error("No available extension relay ports in the reserved browser relay port range");
		ports[name] = nextPort;
		reservedPorts.add(nextPort);
		nextPort -= 1;
	}
	return ports;
}
function applyLegacyCdpUrlToExistingSessionDefaultProfile(profiles, defaultProfile, legacyCdpUrl) {
	if (!legacyCdpUrl) return profiles;
	const profile = getOwnBrowserProfile(profiles, defaultProfile);
	if (!profile || profile.driver !== "existing-session" || normalizeOptionalString(profile.cdpUrl)) return profiles;
	return {
		...profiles,
		[defaultProfile]: {
			...profile,
			cdpUrl: legacyCdpUrl
		}
	};
}
/** Resolve raw browser config into runtime browser defaults. */
function resolveBrowserConfig(cfg, rootConfig) {
	const enabled = cfg?.enabled ?? true;
	const evaluateEnabled = cfg?.evaluateEnabled ?? true;
	const controlPort = deriveDefaultBrowserControlPort(resolveGatewayPort(rootConfig) ?? 18791);
	const remoteCdpTimeoutMs = DEFAULT_BROWSER_REMOTE_CDP_TIMEOUT_MS;
	const remoteCdpHandshakeTimeoutMs = DEFAULT_BROWSER_REMOTE_CDP_HANDSHAKE_TIMEOUT_MS;
	const localLaunchTimeoutMs = DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS;
	const localCdpReadyTimeoutMs = DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS;
	const actionTimeoutMs = DEFAULT_BROWSER_ACTION_TIMEOUT_MS;
	const derivedCdpRange = deriveDefaultBrowserCdpPortRange(controlPort);
	const cdpPortRangeStart = derivedCdpRange.start;
	const cdpPortRangeEnd = derivedCdpRange.end;
	const rawCdpUrl = (cfg?.cdpUrl ?? "").trim();
	let cdpInfo;
	if (rawCdpUrl) cdpInfo = parseBrowserHttpUrl(rawCdpUrl, "browser.cdpUrl");
	else {
		const derivedPort = controlPort + 1;
		if (derivedPort > 65535) throw new Error(`Derived CDP port (${derivedPort}) is too high; check gateway port configuration.`);
		const derived = new URL(`http://127.0.0.1:${derivedPort}`);
		cdpInfo = {
			parsed: derived,
			port: derivedPort,
			normalized: derived.toString().replace(/\/$/, "")
		};
	}
	const headless = cfg?.headless === true;
	const headlessSource = typeof cfg?.headless === "boolean" ? "config" : "default";
	const extensionRelayToken = resolveExtensionRelayToken() ?? void 0;
	const noSandbox = cfg?.noSandbox === true;
	const attachOnly = cfg?.attachOnly === true;
	const executablePath = normalizeExecutablePath(cfg?.executablePath);
	const defaultProfileFromConfig = normalizeOptionalString(cfg?.defaultProfile);
	const legacyCdpPort = rawCdpUrl ? cdpInfo.port : void 0;
	const isWsUrl = cdpInfo.parsed.protocol === "ws:" || cdpInfo.parsed.protocol === "wss:";
	const legacyCdpUrl = rawCdpUrl && isWsUrl ? cdpInfo.normalized : void 0;
	let profiles = ensureDefaultChromeExtensionProfile(ensureDefaultUserBrowserProfile(ensureDefaultProfile(cfg?.profiles, legacyCdpPort, cdpPortRangeStart, legacyCdpUrl)));
	const cdpProtocol = cdpInfo.parsed.protocol === "https:" ? "https" : "http";
	const defaultProfile = defaultProfileFromConfig ?? (profiles["openclaw"] ? "openclaw" : profiles["openclaw"] ? "openclaw" : "user");
	profiles = applyLegacyCdpUrlToExistingSessionDefaultProfile(profiles, defaultProfile, rawCdpUrl ? cdpInfo.normalized : void 0);
	const extraArgs = Array.isArray(cfg?.extraArgs) ? cfg.extraArgs.filter((value) => typeof value === "string" && value.trim().length > 0) : [];
	return {
		enabled,
		evaluateEnabled,
		controlPort,
		cdpPortRangeStart,
		cdpPortRangeEnd,
		cdpProtocol,
		cdpHost: cdpInfo.parsed.hostname,
		cdpIsLoopback: isLoopbackHost(cdpInfo.parsed.hostname),
		remoteCdpTimeoutMs,
		remoteCdpHandshakeTimeoutMs,
		localLaunchTimeoutMs,
		localCdpReadyTimeoutMs,
		actionTimeoutMs,
		color: DEFAULT_OPENCLAW_BROWSER_COLOR,
		executablePath,
		headless,
		headlessSource,
		noSandbox,
		attachOnly,
		defaultProfile,
		profiles,
		tabCleanup: resolveBrowserTabCleanupConfig(cfg),
		ssrfPolicy: resolveBrowserSsrFPolicy(cfg),
		extraArgs,
		extensionRelayDefaultPort: controlPort + EXTENSION_RELAY_PORT_OFFSET,
		extensionRelayPorts: resolveExtensionRelayPorts(profiles, controlPort + EXTENSION_RELAY_PORT_OFFSET),
		extensionRelay: { allowLegacyAuth: cfg?.extensionRelay?.allowLegacyAuth ?? true },
		extensionRelayInternalTokens: {},
		...extensionRelayToken ? { extensionRelayToken } : {}
	};
}
/** Resolve one configured browser profile by name. */
function resolveProfile(resolved, profileName) {
	const profile = getOwnBrowserProfile(resolved.profiles, profileName);
	if (!profile) return null;
	const rawProfileUrl = profile.cdpUrl?.trim() ?? "";
	let cdpHost = resolved.cdpHost;
	let cdpPort = profile.cdpPort ?? 0;
	let cdpUrl;
	const driver = profile.driver === "existing-session" || profile.driver === "extension" ? profile.driver : "openclaw";
	const headless = profile.headless ?? resolved.headless;
	const headlessSource = typeof profile.headless === "boolean" ? "profile" : resolved.headlessSource;
	const executablePath = normalizeExecutablePath(profile.executablePath) ?? resolved.executablePath;
	if (driver === "extension") {
		const relayPort = profile.cdpPort ?? resolved.extensionRelayPorts[profileName] ?? resolved.extensionRelayDefaultPort;
		const token = resolved.extensionRelayInternalTokens[profileName];
		return {
			name: profileName,
			cdpPort: relayPort,
			cdpUrl: token ? `http://${EXTENSION_RELAY_CDP_USER}:${encodeURIComponent(token)}@127.0.0.1:${relayPort}` : `http://127.0.0.1:${relayPort}`,
			cdpHost: "127.0.0.1",
			cdpIsLoopback: true,
			color: DEFAULT_OPENCLAW_BROWSER_COLOR,
			driver,
			executablePath,
			headless: false,
			headlessSource: "default",
			attachOnly: true
		};
	}
	if (driver === "existing-session") {
		const existingSessionCdp = normalizeExistingSessionCdpUrl(rawProfileUrl, profileName);
		return {
			name: profileName,
			cdpPort: 0,
			cdpUrl: existingSessionCdp?.cdpUrl ?? "",
			cdpHost: existingSessionCdp?.cdpHost ?? "",
			cdpIsLoopback: existingSessionCdp?.cdpIsLoopback ?? true,
			userDataDir: resolveUserPath(profile.userDataDir?.trim() || "") || void 0,
			mcpCommand: normalizeOptionalString(profile.mcpCommand),
			mcpArgs: normalizeStringList(profile.mcpArgs) ?? void 0,
			color: DEFAULT_OPENCLAW_BROWSER_COLOR,
			driver,
			executablePath,
			headless,
			headlessSource,
			attachOnly: true
		};
	}
	if (rawProfileUrl !== "" && cdpPort > 0 && /^wss?:\/\//i.test(rawProfileUrl) && /\/devtools\/browser\//i.test(rawProfileUrl)) {
		cdpHost = new URL(rawProfileUrl).hostname;
		cdpUrl = `${resolved.cdpProtocol}://${cdpHost}:${cdpPort}`;
	} else if (rawProfileUrl) {
		const parsed = parseBrowserHttpUrl(rawProfileUrl, `browser.profiles.${profileName}.cdpUrl`);
		cdpHost = parsed.parsed.hostname;
		if (parsed.hasExplicitPort) {
			cdpPort = parsed.port;
			cdpUrl = parsed.normalizedWithPort;
		} else if (cdpPort) {
			const rebuilt = new URL(rawProfileUrl);
			rebuilt.port = String(cdpPort);
			cdpUrl = rebuilt.toString().replace(/\/$/, "");
		} else {
			cdpPort = parsed.port;
			cdpUrl = parsed.normalized;
		}
	} else if (cdpPort) cdpUrl = `${resolved.cdpProtocol}://${resolved.cdpHost}:${cdpPort}`;
	else throw new Error(`Profile "${profileName}" must define cdpPort or cdpUrl.`);
	return {
		name: profileName,
		cdpPort,
		cdpUrl,
		cdpHost,
		cdpIsLoopback: isLoopbackHost(cdpHost),
		color: DEFAULT_OPENCLAW_BROWSER_COLOR,
		driver,
		executablePath,
		headless,
		headlessSource,
		attachOnly: profile.attachOnly ?? resolved.attachOnly
	};
}
/** Resolve effective headless mode for a managed browser profile. */
function resolveManagedBrowserHeadlessMode(resolved, profile, params = {}) {
	if (!isLocalManagedProfile(profile)) return {
		headless: profile.headless,
		source: profile.headlessSource ?? "default"
	};
	if (typeof params.headlessOverride === "boolean") return {
		headless: params.headlessOverride,
		source: "request"
	};
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const envHeadless = parseBooleanValue(env[BROWSER_HEADLESS_ENV_KEY]);
	if (envHeadless !== void 0) return {
		headless: envHeadless,
		source: "env"
	};
	const profileHeadlessSource = profile.headlessSource ?? "default";
	if (profileHeadlessSource !== "default") return {
		headless: profile.headless,
		source: profileHeadlessSource
	};
	if (platform === "linux" && !hasLinuxDisplay(env)) return {
		headless: true,
		source: "linux-display-fallback"
	};
	return {
		headless: resolved.headless,
		source: "default"
	};
}
/** Return a Linux display error for headed managed Chrome when no display exists. */
function getManagedBrowserMissingDisplayError(resolved, profile, params = {}) {
	if (!isLocalManagedProfile(profile)) return null;
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	if (platform !== "linux" || hasLinuxDisplay(env)) return null;
	const mode = resolveManagedBrowserHeadlessMode(resolved, profile, {
		...params,
		env,
		platform
	});
	if (mode.headless || mode.source === "linux-display-fallback") return null;
	const sourceHint = mode.source === "request" ? "request override" : mode.source === "env" ? `${BROWSER_HEADLESS_ENV_KEY}=0` : mode.source === "profile" ? `browser.profiles.${profile.name}.headless=false` : "browser.headless=false";
	return {
		message: `Headed browser start requested for profile "${profile.name}" via ${sourceHint}, but no Linux display server was detected (\$DISPLAY/\$WAYLAND_DISPLAY unset). Set ${BROWSER_HEADLESS_ENV_KEY}=1, remove the headed override, or launch under Xvfb.`,
		headlessSource: mode.source
	};
}
//#endregion
export { resolveProfile as a, DEFAULT_UPLOAD_DIR as c, deriveDefaultBrowserCdpPortRange as d, resolveManagedBrowserHeadlessMode as i, resolveExistingUploadPaths as l, getOwnBrowserProfile as n, DEFAULT_DOWNLOAD_DIR as o, resolveBrowserConfig as r, DEFAULT_TRACE_DIR as s, getManagedBrowserMissingDisplayError as t, resolveStrictExistingUploadPaths as u };
