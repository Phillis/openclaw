import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-ChWDbSFK.js";
import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.js";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import "./errors-Ccx0R-_Z.js";
import { n as signalProcessTree } from "./kill-tree-CR2oLt9D.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import { n as runExec } from "./exec-D2kbpwdA.js";
import { t as TAILSCALE_ROUTE_OWNER_ARG } from "./tailscale-route-owner-protocol-B2D1XMya.js";
import { t as TailscaleRouteOwnershipConflictError } from "./tailscale-route-ownership-error-E8nE1Fea.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";
import { fork } from "node:child_process";
//#region src/infra/tailscale.ts
const TAILSCALE_STATUS_ATTEMPTS = 3;
const TAILSCALE_STATUS_RETRY_DELAY_MS = 500;
const TAILSCALE_ROUTE_START_TIMEOUT_MS = 15e3;
const TAILSCALE_ROUTE_STOP_TIMEOUT_MS = 4e3;
function parsePossiblyNoisyJsonObject(stdout) {
	const trimmed = stdout.trim();
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");
	if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
	return JSON.parse(trimmed);
}
function tailnetHostnameFromStatus(parsed) {
	const self = typeof parsed.Self === "object" && parsed.Self !== null ? parsed.Self : void 0;
	const dns = typeof self?.DNSName === "string" ? self.DNSName : void 0;
	const ips = Array.isArray(self?.TailscaleIPs) ? parsed.Self.TailscaleIPs ?? [] : [];
	if (dns && dns.length > 0) return dns.replace(/\.$/, "");
	const [firstIp] = ips;
	if (firstIp !== void 0) return firstIp;
	throw new Error("Could not determine Tailscale DNS or IP");
}
function isTransientTailscaleStatusError(error) {
	const record = asNullableObjectRecord(error);
	const detail = [
		error instanceof Error ? error.message : void 0,
		typeof record?.stderr === "string" ? record.stderr : void 0,
		typeof record?.stdout === "string" ? record.stdout : void 0
	].filter((value) => Boolean(value)).join("\n").toLowerCase();
	return record?.timedOut === true || detail.includes("failed to connect to local tailscale daemon") || detail.includes("failed to connect to local tailscale service") || detail.includes("connection refused") || detail.includes("503 service unavailable");
}
/**
* Locate Tailscale binary using multiple strategies:
* 1. PATH lookup (via which command)
* 2. Known macOS app path
* 3. find /Applications for Tailscale.app
* 4. locate database (if available)
*
* @returns Path to Tailscale binary or null if not found
*/
async function findTailscaleBinary() {
	const checkBinary = async (filePath) => {
		if (!filePath || !existsSync(filePath)) return false;
		try {
			await runExec(filePath, ["--version"], { timeoutMs: 3e3 });
			return true;
		} catch {
			return false;
		}
	};
	try {
		const { stdout } = await runExec("which", ["tailscale"]);
		const fromPath = stdout.trim();
		if (fromPath && await checkBinary(fromPath)) return fromPath;
	} catch {}
	const macAppPath = "/Applications/Tailscale.app/Contents/MacOS/Tailscale";
	if (await checkBinary(macAppPath)) return macAppPath;
	try {
		const { stdout } = await runExec("find", [
			"/Applications",
			"-maxdepth",
			"3",
			"-name",
			"Tailscale",
			"-path",
			"*/Tailscale.app/Contents/MacOS/Tailscale"
		], { timeoutMs: 5e3 });
		const found = stdout.trim().split("\n")[0];
		if (found && await checkBinary(found)) return found;
	} catch {}
	try {
		const { stdout } = await runExec("locate", ["Tailscale.app"]);
		const candidates = stdout.trim().split("\n").filter((line) => line.includes("/Tailscale.app/Contents/MacOS/Tailscale"));
		for (const candidate of candidates) if (await checkBinary(candidate)) return candidate;
	} catch {}
	return null;
}
async function getTailnetHostname(exec = runExec, detectedBinary) {
	const candidates = detectedBinary ? [detectedBinary] : ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
	let lastError;
	for (const candidate of candidates) {
		if (candidate.startsWith("/") && !existsSync(candidate)) continue;
		try {
			const { stdout } = await exec(candidate, ["status", "--json"], {
				timeoutMs: 5e3,
				maxBuffer: 4e5
			});
			return tailnetHostnameFromStatus(stdout ? parsePossiblyNoisyJsonObject(stdout) : {});
		} catch (err) {
			lastError = err;
		}
	}
	throw toErrorObject(lastError ?? /* @__PURE__ */ new Error("Could not determine Tailscale DNS or IP"), "Non-Error thrown");
}
/**
* Get the Tailscale binary command to use.
* Returns a cached detected binary or the default "tailscale" command.
*/
let cachedTailscaleBinary = null;
function getTestTailscaleBinaryOverride(env = process.env) {
	if (!isVitestRuntimeEnv(env)) return null;
	return env.OPENCLAW_TEST_TAILSCALE_BINARY?.trim() || null;
}
async function getTailscaleBinary() {
	const forcedBinary = getTestTailscaleBinaryOverride();
	if (forcedBinary) {
		cachedTailscaleBinary = forcedBinary;
		return forcedBinary;
	}
	if (cachedTailscaleBinary) return cachedTailscaleBinary;
	cachedTailscaleBinary = await findTailscaleBinary();
	return cachedTailscaleBinary ?? "tailscale";
}
function resolveTailscaleRouteOwnerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "infra", "tailscale-route-owner.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./tailscale-route-owner.worker${extension}`, currentModuleUrl);
}
function isPort443RouteConflict(message) {
	return /listener already exists for port 443/i.test(`${message.stderr}\n${message.stdout}`);
}
function routeClaimError(message) {
	if (isPort443RouteConflict(message)) return new TailscaleRouteOwnershipConflictError();
	const detail = [message.stderr.trim(), message.stdout.trim()].find(Boolean);
	return Object.assign(new Error(detail || "Tailscale route owner exited before claiming route"), {
		code: message.code,
		stdout: message.stdout,
		stderr: message.stderr
	});
}
function waitWithTimeout(promise, timeoutMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(() => resolve(false), timeoutMs);
		timer.unref?.();
		promise.then(() => {
			clearTimeout(timer);
			resolve(true);
		}, () => {
			clearTimeout(timer);
			resolve(true);
		});
	});
}
async function startTailscaleRouteOwner(argv) {
	const workerUrl = resolveTailscaleRouteOwnerUrl();
	const execArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	const worker = fork(fileURLToPath(workerUrl), [TAILSCALE_ROUTE_OWNER_ARG, JSON.stringify({ argv })], {
		execArgv,
		stdio: [
			"ignore",
			"ignore",
			"ignore",
			"ipc"
		]
	});
	let routePid;
	let ready = false;
	let active = false;
	let stopping = false;
	let startupSettled = false;
	let failure;
	let resolveExit;
	const exited = new Promise((resolve) => {
		resolveExit = resolve;
	});
	const startup = new Promise((resolve, reject) => {
		const settle = (error) => {
			if (startupSettled) return;
			startupSettled = true;
			clearTimeout(startupTimer);
			if (error) reject(error);
			else resolve();
		};
		const startupTimer = setTimeout(() => settle(/* @__PURE__ */ new Error("Tailscale route claim did not become ready within 15 seconds")), TAILSCALE_ROUTE_START_TIMEOUT_MS);
		startupTimer.unref?.();
		worker.on("message", (message) => {
			const event = asNullableObjectRecord(message);
			if (!event) return;
			if (event.type === "spawned") {
				if (typeof event.pid !== "number") return;
				routePid = event.pid;
			} else if (event.type === "ready") {
				ready = true;
				active = true;
				settle();
			} else if (event.type === "failed") {
				if (event.code !== null && typeof event.code !== "number" || typeof event.stdout !== "string" || typeof event.stderr !== "string") return;
				failure = routeClaimError({
					code: event.code,
					stdout: event.stdout,
					stderr: event.stderr
				});
				if (!ready) settle(failure);
			}
		});
		worker.once("error", (error) => settle(toErrorObject(error, "Tailscale route owner failed")));
		worker.once("exit", (code, signal) => {
			active = false;
			resolveExit();
			if (!ready) settle(failure ?? /* @__PURE__ */ new Error(`Tailscale route owner exited before readiness (${signal ? `signal ${signal}` : `code ${code ?? "unknown"}`})`));
		});
	});
	const stop = async () => {
		if (stopping) {
			await exited;
			return;
		}
		stopping = true;
		if (worker.connected) try {
			worker.send({ type: "stop" }, () => void 0);
		} catch {
			worker.kill("SIGTERM");
		}
		else worker.kill("SIGTERM");
		if (await waitWithTimeout(exited, TAILSCALE_ROUTE_STOP_TIMEOUT_MS)) return;
		if (routePid) signalProcessTree(routePid, "SIGKILL", { detached: process.platform !== "win32" });
		worker.kill("SIGKILL");
		await exited;
	};
	try {
		await startup;
		return {
			exited,
			isActive: () => active,
			stop
		};
	} catch (error) {
		await stop();
		throw failure ?? error;
	}
}
async function claimTailscaleRoute(mode, target) {
	const tailscaleBin = await getTailscaleBinary();
	const args = [
		mode,
		"--yes",
		"--bg=false",
		`${target}`
	];
	try {
		return await startTailscaleRouteOwner([tailscaleBin, ...args]);
	} catch (error) {
		if (!isPermissionDeniedError(error)) throw error;
		return await startTailscaleRouteOwner([
			"sudo",
			"-n",
			tailscaleBin,
			...args
		]);
	}
}
/** Resolve the hostname after Serve startup, while the local daemon may still be settling. */
async function getTailnetHostnameAfterServe(exec = runExec) {
	const candidate = await getTailscaleBinary();
	return tailnetHostnameFromStatus(await retryAsync(async () => {
		const { stdout } = await exec(candidate, ["status", "--json"], {
			timeoutMs: 5e3,
			maxBuffer: 4e5,
			logOutput: false
		});
		return stdout ? parsePossiblyNoisyJsonObject(stdout) : {};
	}, {
		attempts: TAILSCALE_STATUS_ATTEMPTS,
		minDelayMs: TAILSCALE_STATUS_RETRY_DELAY_MS,
		maxDelayMs: TAILSCALE_STATUS_RETRY_DELAY_MS,
		jitter: 0,
		shouldRetry: isTransientTailscaleStatusError
	}));
}
const whoisCache = /* @__PURE__ */ new Map();
function extractExecErrorText(err) {
	const errOutput = err;
	return {
		stdout: typeof errOutput.stdout === "string" ? errOutput.stdout : "",
		stderr: typeof errOutput.stderr === "string" ? errOutput.stderr : "",
		message: typeof errOutput.message === "string" ? errOutput.message : "",
		code: typeof errOutput.code === "string" ? errOutput.code : ""
	};
}
function isPermissionDeniedError(err) {
	const { stdout, stderr, message, code } = extractExecErrorText(err);
	if (code.toUpperCase() === "EACCES") return true;
	const combined = normalizeLowercaseStringOrEmpty(`${stdout}\n${stderr}\n${message}`);
	return combined.includes("permission denied") || combined.includes("access denied") || combined.includes("operation not permitted") || combined.includes("not permitted") || combined.includes("requires root") || combined.includes("must be run as root") || combined.includes("must be run with sudo") || combined.includes("requires sudo") || combined.includes("need sudo");
}
async function hasTailscaleFunnelRouteForPort(port, exec = runExec) {
	const { stdout } = await exec(await getTailscaleBinary(), [
		"funnel",
		"status",
		"--json"
	], {
		maxBuffer: 2e5,
		timeoutMs: 5e3
	});
	return tailscaleFunnelStatusCoversPort(stdout ? parsePossiblyNoisyJsonObject(stdout) : {}, port);
}
const TAILSCALE_LOOPBACK_PROXY_HOSTS = /* @__PURE__ */ new Set([
	"127.0.0.1",
	"localhost",
	"[::1]",
	"::1"
]);
function tailscaleFunnelStatusCoversPort(status, port) {
	for (const proxy of funnelStatusBackendsForPort(status)) if (tailscaleProxyMatchesLoopbackPort(proxy, port)) return true;
	return false;
}
function tailscaleProxyMatchesLoopbackPort(proxy, port) {
	const stripped = proxy.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, "").replace(/\/.*$/, "");
	if (stripped === String(port)) return true;
	const sep = stripped.lastIndexOf(":");
	if (sep < 0) return false;
	const host = stripped.slice(0, sep);
	if (stripped.slice(sep + 1) !== String(port)) return false;
	return TAILSCALE_LOOPBACK_PROXY_HOSTS.has(host);
}
function funnelStatusBackendsForPort(status) {
	const backends = /* @__PURE__ */ new Set();
	const allowFunnel = status.AllowFunnel ?? {};
	const enabledHosts = new Set(Object.entries(allowFunnel).filter(([, value]) => value === true).map(([host]) => host));
	if (enabledHosts.size === 0) return backends;
	const web = status.Web;
	if (!web || typeof web !== "object") return backends;
	for (const [host, handlers] of Object.entries(web)) {
		if (!enabledHosts.has(host)) continue;
		if (!handlers || typeof handlers !== "object") continue;
		const handlerEntries = handlers.Handlers;
		if (!handlerEntries || typeof handlerEntries !== "object") continue;
		for (const handler of Object.values(handlerEntries)) {
			const proxy = handler?.Proxy;
			if (typeof proxy === "string" && proxy.length > 0) backends.add(proxy);
		}
	}
	return backends;
}
function parseWhoisIdentity(payload) {
	const userProfile = asNullableObjectRecord(payload.UserProfile) ?? asNullableObjectRecord(payload.userProfile) ?? asNullableObjectRecord(payload.User);
	const login = normalizeOptionalString(userProfile?.LoginName) ?? normalizeOptionalString(userProfile?.Login) ?? normalizeOptionalString(userProfile?.login) ?? normalizeOptionalString(payload.LoginName) ?? normalizeOptionalString(payload.login);
	if (!login) return null;
	return {
		login,
		name: normalizeOptionalString(userProfile?.DisplayName) ?? normalizeOptionalString(userProfile?.Name) ?? normalizeOptionalString(userProfile?.displayName) ?? normalizeOptionalString(payload.DisplayName) ?? normalizeOptionalString(payload.name)
	};
}
function readCachedWhois(ip, now) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) return;
	const cached = whoisCache.get(ip);
	if (!cached) return;
	const expiresAt = asDateTimestampMs(cached.expiresAt);
	if (expiresAt === void 0 || expiresAt <= validNow) {
		whoisCache.delete(ip);
		return;
	}
	return cached.value;
}
function writeCachedWhois(ip, value, ttlMs) {
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs);
	if (expiresAt !== void 0) whoisCache.set(ip, {
		value,
		expiresAt
	});
}
async function readTailscaleWhoisIdentity(ip, exec = runExec, opts) {
	const normalized = ip.trim();
	if (!normalized) return null;
	const cached = readCachedWhois(normalized, Date.now());
	if (cached !== void 0) return cached;
	const cacheTtlMs = opts?.cacheTtlMs ?? 6e4;
	const errorTtlMs = opts?.errorTtlMs ?? 5e3;
	try {
		const result = await exec(await getTailscaleBinary(), [
			"whois",
			"--json",
			normalized
		], {
			timeoutMs: opts?.timeoutMs ?? 5e3,
			maxBuffer: 2e5
		});
		const identity = parseWhoisIdentity(result.stdout ? parsePossiblyNoisyJsonObject(result.stdout) : {});
		writeCachedWhois(normalized, identity, cacheTtlMs);
		return identity;
	} catch {
		writeCachedWhois(normalized, null, errorTtlMs);
		return null;
	}
}
//#endregion
export { hasTailscaleFunnelRouteForPort as a, getTailnetHostnameAfterServe as i, findTailscaleBinary as n, readTailscaleWhoisIdentity as o, getTailnetHostname as r, claimTailscaleRoute as t };
