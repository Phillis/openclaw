import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./errors-CSNUPl5U.js";
import { spawn } from "node:child_process";
//#region src/process/spawn-utils.ts
const DEFAULT_RETRY_CODES = ["EBADF"];
function resolveCommandStdio(params) {
	return [
		params.hasInput ? "pipe" : params.preferInherit ? "inherit" : "pipe",
		"pipe",
		"pipe"
	];
}
function shouldRetry(err, codes) {
	const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
	return code.length > 0 && codes.includes(code);
}
async function spawnAndWaitForSpawn(spawnImpl, argv, options) {
	const child = spawnImpl(expectDefined(argv[0], "argv entry at 0"), argv.slice(1), options);
	return await new Promise((resolve, reject) => {
		let settled = false;
		const cleanup = () => {
			child.removeListener("error", onError);
			child.removeListener("spawn", onSpawn);
		};
		const finishResolve = () => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(child);
		};
		const onError = (err) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(toErrorObject(err, "Non-Error rejection"));
		};
		const onSpawn = () => {
			finishResolve();
		};
		child.once("error", onError);
		child.once("spawn", onSpawn);
		process.nextTick(() => {
			if (typeof child.pid === "number") finishResolve();
		});
	});
}
async function spawnWithFallback(params) {
	const spawnImpl = params.spawnImpl ?? spawn;
	const retryCodes = params.retryCodes ?? DEFAULT_RETRY_CODES;
	const baseOptions = { ...params.options };
	const fallbacks = params.fallbacks ?? [];
	const attempts = [{ options: baseOptions }, ...fallbacks.map((fallback) => ({
		label: fallback.label,
		options: {
			...baseOptions,
			...fallback.options
		}
	}))];
	let lastError;
	for (const [index, attempt] of attempts.entries()) try {
		return {
			child: await spawnAndWaitForSpawn(spawnImpl, params.argv, attempt.options),
			usedFallback: index > 0,
			fallbackLabel: attempt.label
		};
	} catch (err) {
		lastError = err;
		const nextFallback = fallbacks[index];
		if (!nextFallback || !shouldRetry(err, retryCodes)) throw err;
		params.onFallback?.(err, nextFallback);
	}
	throw lastError;
}
//#endregion
export { spawnWithFallback as n, resolveCommandStdio as t };
