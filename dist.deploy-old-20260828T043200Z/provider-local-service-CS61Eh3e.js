import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { P as resolvePositiveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { f as redactSensitiveText, r as isSensitiveFieldKey } from "./redact-CWP17HFN.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as mergeProcessEnv } from "./process-env-CW4bkwqq.js";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-Bc6HA4HC.js";
import { r as unwrapHeadersInitSentinelsForProviderEgress } from "./provider-secret-egress-BXpRqyF7.js";
import { n as shouldDetachChildForProcessTree, r as signalChildProcessTree, t as forceKillChildProcessTree } from "./child-process-tree-DO3eGAOe.js";
import { r as setManagedProviderLocalServicesActive } from "./provider-runtime-lifecycle-Cn0O7tiR.js";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
//#region src/agents/provider-local-service.ts
/**
* Manages optional local provider sidecar processes attached to models. Leases
* keep shared services alive while requests run and stop them after idle.
*/
const log = createSubsystemLogger("provider-local-service");
const DEFAULT_READY_TIMEOUT_MS = 12e4;
const DEFAULT_PROBE_TIMEOUT_MS = 2e3;
const PROBE_INTERVAL_MS = 250;
const LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES = 8 * 1024;
const MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL = Symbol.for("openclaw.modelProviderLocalService");
const services = /* @__PURE__ */ new Map();
let exitHandlerInstalled = false;
/** Bind local-service acquisition to a host-owned config snapshot. */
function createConfiguredProviderLocalServiceAcquirer(getConfig) {
	return async (target, signal) => {
		const provider = getConfig().models?.providers?.[target.providerId];
		const service = provider?.localService;
		if (!service) return;
		if (!isConfiguredProviderBaseUrl(target.baseUrl, readConfiguredProviderBaseUrl(provider))) throw new Error(`Local service target must match models.providers.${target.providerId}.baseUrl`);
		return await ensureProviderLocalService({
			...target,
			service
		}, signal);
	};
}
function readConfiguredProviderBaseUrl(provider) {
	const canonical = provider?.baseUrl?.trim();
	if (canonical) return canonical;
	const alternate = provider?.baseURL;
	return typeof alternate === "string" && alternate.trim() ? alternate.trim() : void 0;
}
function normalizeProviderBaseUrl(value) {
	const trimmed = value.trim();
	const candidates = /^[a-z][a-z\d+.-]*:\/\//iu.test(trimmed) ? [trimmed] : [`http://${trimmed}`];
	for (const candidate of candidates) try {
		const url = new URL(candidate);
		if (url.protocol !== "http:" && url.protocol !== "https:") continue;
		url.search = "";
		url.hash = "";
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString().replace(/\/$/u, "");
	} catch {
		continue;
	}
}
function configuredProviderBaseUrlVariants(value) {
	const normalized = normalizeProviderBaseUrl(value);
	if (!normalized) return /* @__PURE__ */ new Set();
	const withoutOpenAiPath = normalized.replace(/\/v1$/iu, "");
	return /* @__PURE__ */ new Set([
		normalized,
		withoutOpenAiPath,
		`${withoutOpenAiPath}/v1`
	]);
}
function isLoopbackProviderBaseUrl(value) {
	const normalized = normalizeProviderBaseUrl(value);
	if (!normalized) return false;
	const hostname = new URL(normalized).hostname.toLowerCase();
	return hostname === "localhost" || hostname === "[::1]" || isCanonicalDottedDecimalIPv4(hostname) && isLoopbackIpAddress(hostname);
}
function isConfiguredProviderBaseUrl(targetBaseUrl, configuredBaseUrl) {
	const target = normalizeProviderBaseUrl(targetBaseUrl);
	if (!target) return false;
	const configured = configuredBaseUrl?.trim();
	return configured ? configuredProviderBaseUrlVariants(configured).has(target) : isLoopbackProviderBaseUrl(target);
}
/** Attach local-service startup metadata to a model without mutating the original object. */
function attachModelProviderLocalService(model, service) {
	if (!service) return model;
	const next = { ...model };
	next[MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL] = service;
	return next;
}
/** Read local-service startup metadata attached to a model. */
function getModelProviderLocalService(model) {
	return model[MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL];
}
/** Ensure a model's local provider service is healthy and return a lease. */
async function ensureModelProviderLocalService(model, probeHeaders, signal) {
	const service = getModelProviderLocalService(model);
	return await ensureProviderLocalService({
		providerId: model.provider,
		baseUrl: model.baseUrl,
		headers: buildHealthProbeHeaders(model.headers, probeHeaders),
		service
	}, signal);
}
/** Ensure a provider endpoint's local service is healthy and return a request lease. */
async function ensureProviderLocalService(target, signal) {
	const service = target.service;
	if (!service) return;
	throwIfAborted(signal);
	validateLocalServiceConfig(service, target.providerId);
	const healthUrl = resolveHealthUrl(service, target.baseUrl);
	const healthHeaders = buildHealthProbeHeaders(target.headers, void 0);
	const key = localServiceKey(target.providerId, service, healthUrl);
	installExitHandler();
	const managed = services.get(key) ?? { active: 0 };
	services.set(key, managed);
	setManagedProviderLocalServicesActive(true);
	clearIdleTimer(managed);
	managed.active += 1;
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		managed.active = Math.max(0, managed.active - 1);
		scheduleIdleStop(key, managed, service);
	};
	try {
		if (managed.process && !hasLocalServiceProcessExited(managed.process) && await probeHealth(healthUrl, healthHeaders, signal)) return { release };
		if (!managed.starting) {
			const startupAbort = new AbortController();
			managed.startupAbort = startupAbort;
			managed.starting = startAndWaitForLocalService({
				provider: target.providerId,
				service,
				healthUrl,
				healthHeaders,
				managed,
				signal: startupAbort.signal
			}).finally(() => {
				managed.starting = void 0;
				if (managed.startupAbort === startupAbort) managed.startupAbort = void 0;
			});
		}
		await waitForAbort(managed.starting, signal);
		if (!managed.process || hasLocalServiceProcessExited(managed.process)) {
			release();
			return;
		}
		return { release };
	} catch (error) {
		const abortingStartup = isAbortForSignal(error, signal) && Boolean(managed.starting);
		release();
		if (isAbortForSignal(error, signal)) {
			if (abortingStartup && managed.active === 0) {
				managed.startupAbort?.abort(toAbortError(signal));
				stopManagedService(key, managed, "startup-aborted");
			}
		} else stopManagedService(key, managed, "startup-failed");
		throw error;
	}
}
/** Stop all managed local services owned by this process. */
function stopManagedProviderLocalServices() {
	for (const [key, managed] of services) stopManagedService(key, managed, "host-shutdown");
	services.clear();
	setManagedProviderLocalServicesActive(false);
}
/** Return bounded local-service state for focused lifecycle tests. */
function getManagedProviderLocalServiceDiagnosticsForTest() {
	return structuredClone([...services.values()].map((managed) => managed.diagnostics).filter((value) => value !== void 0));
}
function validateLocalServiceConfig(service, provider) {
	if (!path.isAbsolute(service.command)) throw new Error(`models.providers.${provider}.localService.command must be an absolute path`);
}
function resolveHealthUrl(service, baseUrl) {
	return service.healthUrl?.trim() || `${baseUrl.replace(/\/+$/, "")}/models`;
}
function localServiceKey(provider, service, healthUrl) {
	return JSON.stringify({
		provider,
		command: service.command,
		args: service.args ?? [],
		cwd: service.cwd ?? "",
		envHash: hashStringRecord(service.env),
		healthUrl
	});
}
function hashStringRecord(record) {
	const sorted = Object.entries(record ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
	return createHash("sha256").update(JSON.stringify(sorted)).digest("hex");
}
function buildHealthProbeHeaders(providerHeaders, requestHeaders) {
	const headers = new Headers();
	const appendHeaders = (input) => {
		if (!input) return;
		for (const [key, value] of new Headers(input)) if (value.trim().length > 0 && value.trim().toLowerCase() !== "null") headers.set(key, value);
	};
	appendHeaders(providerHeaders);
	appendHeaders(requestHeaders);
	return [...headers].length > 0 ? headers : void 0;
}
async function probeHealth(url, headers, signal) {
	throwIfAborted(signal);
	const egressHeaders = unwrapHeadersInitSentinelsForProviderEgress(headers, "to probe local model provider health");
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), DEFAULT_PROBE_TIMEOUT_MS);
	timeout.unref?.();
	const onAbort = () => controller.abort(toAbortError(signal));
	signal?.addEventListener("abort", onAbort, { once: true });
	let response;
	try {
		response = await fetch(url, {
			headers: egressHeaders,
			signal: controller.signal
		});
		return response.ok;
	} catch {
		if (signal?.aborted) throw toAbortError(signal);
		return false;
	} finally {
		clearTimeout(timeout);
		signal?.removeEventListener("abort", onAbort);
		await response?.body?.cancel?.().catch(() => void 0);
	}
}
async function startAndWaitForLocalService(params) {
	const { provider, service, healthUrl, healthHeaders, managed, signal } = params;
	if (await probeHealth(healthUrl, healthHeaders, signal)) return;
	if (managed.process && !hasLocalServiceProcessExited(managed.process)) {
		log.info(`restarting unhealthy ${provider} local service`);
		await stopManagedProcessForRestart(managed, signal);
	}
	const startedAt = Date.now();
	const diagnostics = {
		providerId: provider,
		healthUrl,
		startedAt,
		stdoutTail: "",
		stderrTail: ""
	};
	managed.diagnostics = diagnostics;
	throwIfAborted(signal);
	log.info(`starting ${provider} local service: ${service.command}`);
	managed.process = spawn(service.command, service.args ?? [], {
		cwd: service.cwd,
		env: service.env ? mergeProcessEnv([process.env, service.env]) : process.env,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		detached: shouldDetachChildForProcessTree()
	});
	const child = managed.process;
	diagnostics.pid = child.pid;
	managed.lastExit = void 0;
	child.stdout?.setEncoding("utf8");
	child.stderr?.setEncoding("utf8");
	const captureStdout = (chunk) => {
		diagnostics.stdoutTail = appendLocalServiceOutputTail(diagnostics.stdoutTail, chunk, service.env, process.env, service.args, healthHeaders);
	};
	const captureStderr = (chunk) => {
		diagnostics.stderrTail = appendLocalServiceOutputTail(diagnostics.stderrTail, chunk, service.env, process.env, service.args, healthHeaders);
	};
	child.stdout?.on("data", captureStdout);
	child.stderr?.on("data", captureStderr);
	child.unref();
	child.once("exit", (code, signalLocal) => {
		const exit = {
			code,
			signal: signalLocal
		};
		diagnostics.lastExit = exit;
		log.info(`${provider} local service exited: ${signalLocal ? `signal=${signalLocal}` : `code=${code ?? 0}`}`);
		if (managed.process === child) {
			managed.lastExit = exit;
			managed.process = void 0;
		}
	});
	const spawnError = await waitForSpawnResult(child, signal);
	if (spawnError) throw new Error(`${provider} local service failed to start: ${spawnError.message}${formatLocalServiceDiagnosticTail(diagnostics)}`);
	diagnostics.spawnedAt = Date.now();
	const readyTimeoutMs = resolvePositiveTimerTimeoutMs(service.readyTimeoutMs, DEFAULT_READY_TIMEOUT_MS);
	const deadline = Date.now() + readyTimeoutMs;
	for (;;) {
		if (await probeHealth(healthUrl, healthHeaders, signal)) {
			diagnostics.readyAt = Date.now();
			diagnostics.lastHealthyAt = diagnostics.readyAt;
			diagnostics.stdoutTail = "";
			diagnostics.stderrTail = "";
			drainLocalServiceOutput(child);
			log.info(`${provider} local service ready: pid=${diagnostics.pid ?? "unknown"} spawnMs=${diagnostics.spawnedAt - startedAt} readyMs=${diagnostics.readyAt - startedAt}`);
			return;
		}
		if (managed.lastExit) throw new Error(`${provider} local service exited before readiness with ${formatLocalServiceExit(managed.lastExit)}${formatLocalServiceDiagnosticTail(diagnostics)}`);
		if (Date.now() >= deadline) throw new Error(`${provider} local service did not become ready at ${healthUrl}`);
		await sleepWithAbort(PROBE_INTERVAL_MS, signal, { ref: false });
	}
}
function appendLocalServiceOutputTail(current, chunk, serviceEnv, inheritedEnv, serviceArgs, healthHeaders) {
	let redacted = redactSensitiveText(`${current}${chunk.toString()}`, { mode: "tools" });
	for (const value of Object.values(serviceEnv ?? {})) if (value) redacted = redacted.replaceAll(value, "[redacted]");
	for (const [key, value] of Object.entries(inheritedEnv)) if (value && isSensitiveFieldKey(key)) redacted = redacted.replaceAll(value, "[redacted]");
	for (const value of serviceArgs ?? []) if (value) redacted = redacted.replaceAll(value, "[redacted]");
	for (const [, value] of new Headers(healthHeaders)) if (value) redacted = redacted.replaceAll(value, "[redacted]");
	const bytes = Buffer.from(redacted);
	if (bytes.byteLength <= LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES) return redacted;
	let start = bytes.byteLength - LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES;
	while (start < bytes.byteLength) {
		const byte = bytes.at(start);
		if (byte === void 0 || (byte & 192) !== 128) break;
		start += 1;
	}
	return bytes.subarray(start).toString("utf8");
}
function unrefLocalServiceOutput(stream) {
	stream?.unref?.();
}
function drainLocalServiceOutput(child) {
	child.stdout?.removeAllListeners("data");
	child.stderr?.removeAllListeners("data");
	child.stdout?.resume();
	child.stderr?.resume();
	unrefLocalServiceOutput(child.stdout);
	unrefLocalServiceOutput(child.stderr);
}
function formatLocalServiceDiagnosticTail(diagnostics) {
	return diagnostics.stderrTail ? `; stderr: ${diagnostics.stderrTail}` : "";
}
function scheduleIdleStop(key, managed, service) {
	const idleStopMs = clampPositiveTimerTimeoutMs(service.idleStopMs);
	if (managed.active > 0) return;
	if (!managed.process) {
		if (!managed.starting) {
			services.delete(key);
			setManagedProviderLocalServicesActive(services.size > 0);
		}
		return;
	}
	if (idleStopMs === void 0) return;
	managed.idleTimer = setTimeout(() => {
		if (managed.active === 0) stopManagedService(key, managed, "idle");
	}, idleStopMs);
	managed.idleTimer.unref?.();
}
function clearIdleTimer(managed) {
	if (managed.idleTimer) {
		clearTimeout(managed.idleTimer);
		managed.idleTimer = void 0;
	}
}
function stopManagedService(key, managed, reason) {
	clearIdleTimer(managed);
	managed.startupAbort?.abort(/* @__PURE__ */ new Error(`local service stopped: ${reason}`));
	managed.startupAbort = void 0;
	const child = managed.process;
	managed.process = void 0;
	managed.lastExit = void 0;
	services.delete(key);
	setManagedProviderLocalServicesActive(services.size > 0);
	if (child) drainLocalServiceOutput(child);
	if (child && !hasLocalServiceProcessExited(child)) {
		log.info(`stopping local model service: reason=${reason}`);
		signalChildProcessTree(child, "SIGTERM");
	}
}
async function stopManagedProcessForRestart(managed, signal) {
	const child = managed.process;
	managed.process = void 0;
	managed.lastExit = void 0;
	if (!child || hasLocalServiceProcessExited(child)) return;
	drainLocalServiceOutput(child);
	signalChildProcessTree(child, "SIGTERM");
	await waitForChildExit(child, signal, DEFAULT_PROBE_TIMEOUT_MS);
	if (!hasLocalServiceProcessExited(child)) {
		forceKillChildProcessTree(child);
		await waitForChildExit(child, signal, DEFAULT_PROBE_TIMEOUT_MS);
	}
}
function formatLocalServiceExit(exit) {
	return exit.signal ? `signal ${exit.signal}` : `code ${exit.code ?? 0}`;
}
function installExitHandler() {
	if (exitHandlerInstalled) return;
	exitHandlerInstalled = true;
	process.once("exit", () => {
		for (const [key, managed] of services) stopManagedService(key, managed, "process-exit");
	});
}
function toAbortError(signal) {
	if (signal?.reason instanceof Error) return signal.reason;
	const error = /* @__PURE__ */ new Error("The operation was aborted.");
	error.name = "AbortError";
	return error;
}
function throwIfAborted(signal) {
	if (signal?.aborted) throw toAbortError(signal);
}
function isAbortForSignal(error, signal) {
	return Boolean(signal?.aborted) && (error === signal?.reason || error instanceof Error && error.name === "AbortError");
}
function waitForAbort(promise, signal) {
	throwIfAborted(signal);
	if (!signal) return promise;
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			cleanup();
			reject(toAbortError(signal));
		};
		const cleanup = () => signal.removeEventListener("abort", onAbort);
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			cleanup();
			resolve(value);
		}, (error) => {
			cleanup();
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
function waitForSpawnResult(child, signal) {
	throwIfAborted(signal);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			child.off("error", onError);
			child.off("spawn", onSpawn);
			signal?.removeEventListener("abort", onAbort);
			resolve(error);
		};
		const onError = (error) => finish(error);
		const onSpawn = () => finish();
		const onAbort = () => finish(toAbortError(signal));
		child.once("error", onError);
		child.once("spawn", onSpawn);
		signal?.addEventListener("abort", onAbort, { once: true });
		setImmediate(() => {
			if (child.pid) finish();
		});
	});
}
function waitForChildExit(child, signal, timeoutMs) {
	if (hasLocalServiceProcessExited(child)) return Promise.resolve();
	throwIfAborted(signal);
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timeout);
			child.off("exit", onExit);
			signal.removeEventListener("abort", onAbort);
		};
		const finish = () => {
			cleanup();
			resolve();
		};
		const onExit = () => finish();
		const onAbort = () => {
			cleanup();
			reject(toAbortError(signal));
		};
		const timeout = setTimeout(finish, timeoutMs);
		timeout.unref?.();
		child.once("exit", onExit);
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
/** Return whether a child process has already reported an exit code or signal. */
function hasLocalServiceProcessExited(child) {
	return child.exitCode !== null || child.signalCode !== null;
}
//#endregion
export { getManagedProviderLocalServiceDiagnosticsForTest as a, stopManagedProviderLocalServices as c, ensureProviderLocalService as i, createConfiguredProviderLocalServiceAcquirer as n, getModelProviderLocalService as o, ensureModelProviderLocalService as r, hasLocalServiceProcessExited as s, attachModelProviderLocalService as t };
