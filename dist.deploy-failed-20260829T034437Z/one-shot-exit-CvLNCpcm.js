import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
//#region src/cli/one-shot-exit.ts
const SYSTEM_CA_FLAG = "--use-system-ca";
const ONE_SHOT_EXIT_DRAIN_TIMEOUT_MS = 5e3;
let requestedExitCode;
function resolveVitestWorkerMarkers() {
	const processMarkers = process;
	const globalMarkers = globalThis;
	return {
		tinypoolState: processMarkers["__tinypool_state__"],
		vitestWorker: globalMarkers["__vitest_worker__"]
	};
}
function hasNodeRuntimeOption(option, env, execArgv) {
	const normalize = (value) => value.replaceAll("_", "-");
	if (execArgv.some((arg) => normalize(arg) === option)) return true;
	return (env.NODE_OPTIONS ?? "").split(/\s+/u).some((token) => {
		const quote = token[0];
		const unquoted = (quote === "\"" || quote === "'") && token.at(-1) === quote ? token.slice(1, -1) : token;
		return normalize(unquoted) === option;
	});
}
function resolveProcessExitCode(fallback = 0) {
	const value = process.exitCode;
	if (typeof value === "number") return Number.isInteger(value) ? value : fallback;
	if (typeof value === "string" && /^-?\d+$/u.test(value.trim())) return Number.parseInt(value, 10);
	return fallback;
}
function isVitestWorker(env, markers = resolveVitestWorkerMarkers()) {
	return (env.VITEST === "true" || env.VITEST === "1" || env.VITEST_POOL_ID !== void 0 || env.VITEST_WORKER_ID !== void 0) && (markers.tinypoolState !== void 0 || markers.vitestWorker !== void 0);
}
function requestExitAfterSystemCaCliCompletion(runtime = defaultRuntime, params = {}) {
	const env = params.env ?? process.env;
	const execArgv = params.execArgv ?? process.execArgv;
	const platform = params.platform ?? process.platform;
	const usesSystemCa = env.NODE_USE_SYSTEM_CA === "1" || hasNodeRuntimeOption(SYSTEM_CA_FLAG, env, execArgv);
	if (platform !== "darwin" || !usesSystemCa || runtime !== defaultRuntime) return false;
	if (requestedExitCode === void 0) requestedExitCode = params.exitCode ?? "process";
	return true;
}
async function runCliWithExitFinalization(params) {
	const runtime = params.runtime ?? defaultRuntime;
	try {
		await params.run();
	} catch (error) {
		await params.onError(error);
		requestExitAfterOneShotOutput(runtime, resolveProcessExitCode(1));
	} finally {
		requestExitAfterSystemCaCliCompletion(runtime, {
			env: params.env,
			execArgv: params.execArgv,
			platform: params.platform
		});
		flushExitAfterOneShotOutput(runtime, params.env, params.markers);
	}
}
function requestExitAfterOneShotOutput(runtime = defaultRuntime, exitCode) {
	if (runtime !== defaultRuntime) return false;
	requestedExitCode = exitCode ?? "process";
	return true;
}
function flushExitAfterOneShotOutput(runtime = defaultRuntime, env = process.env, markers = resolveVitestWorkerMarkers()) {
	const requestedCode = requestedExitCode;
	requestedExitCode = void 0;
	if (requestedCode === void 0 || runtime !== defaultRuntime || isVitestWorker(env, markers)) return;
	const exit = () => runtime.exit(requestedCode === "process" ? resolveProcessExitCode() : requestedCode);
	let pendingStreams = 2;
	const fallback = setTimeout(exit, ONE_SHOT_EXIT_DRAIN_TIMEOUT_MS);
	fallback.unref();
	const drain = (stream) => {
		stream.write("", () => {
			pendingStreams -= 1;
			if (pendingStreams === 0) {
				clearTimeout(fallback);
				setImmediate(exit);
			}
		});
	};
	drain(process.stdout);
	drain(process.stderr);
}
//#endregion
export { runCliWithExitFinalization as n, requestExitAfterOneShotOutput as t };
