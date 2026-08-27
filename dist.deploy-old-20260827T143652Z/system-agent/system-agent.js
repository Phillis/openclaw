import { a as writeRuntimeJson, r as defaultRuntime } from "../runtime-DtFIMC-W.js";
import { i as loadSystemAgentOverview, n as formatSystemAgentOverview } from "../overview-DHobpgIW.js";
import { a as resolveSystemAgentVerifiedInferenceRoute } from "../verified-inference-CcE6I3BD.js";
import { a as parseSystemAgentOperation, i as isPersistentSystemAgentOperation, t as executeSystemAgentOperation } from "../operations-nR44JMF_.js";
import { r as withProgress } from "../progress-F0nzmXYd.js";
import { t as SystemAgentInferenceUnavailableError } from "../inference-error-CLaGK7fO.js";
import { n as resolveSystemAgentOperation } from "../dialogue-BLVkjqBl.js";
import { stdin, stdout } from "node:process";
//#region src/system-agent/system-agent.ts
function systemAgentCommandDepsFromOptions(opts) {
	if (!opts.deps && !opts.formatOverview && !opts.loadOverview) return;
	return {
		...opts.deps,
		...opts.formatOverview ? { formatOverview: opts.formatOverview } : {},
		...opts.loadOverview ? { loadOverview: opts.loadOverview } : {}
	};
}
async function requireVerifiedInference(opts) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		if (await resolveSystemAgentVerifiedInferenceRoute(opts.verifiedInference, opts.deps)) return;
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
async function requirePersistentApplyInference(opts, runtime) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		const { resolvePersistentApplyInference } = await import("./setup-inference.js");
		if (await resolvePersistentApplyInference({
			binding: opts.verifiedInference,
			runtime,
			deps: opts.deps
		})) return;
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
async function runOneShot(operation, runtime, opts) {
	if (operation.kind === "none" && operation.message === "") return;
	await requireVerifiedInference(opts);
	await executeSystemAgentOperation(operation, runtime, {
		approved: opts.yes === true || !isPersistentSystemAgentOperation(operation),
		deps: systemAgentCommandDepsFromOptions(opts),
		beforePersistentApply: async () => {
			await requirePersistentApplyInference(opts, runtime);
		}
	});
}
/** Run OpenClaw in JSON, one-shot message, or interactive TUI mode. */
async function runSystemAgent(opts, runtime = defaultRuntime) {
	const binding = opts?.verifiedInference;
	if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
	const boundOpts = {
		...opts,
		verifiedInference: binding
	};
	await requireVerifiedInference(boundOpts);
	if (boundOpts.json) {
		writeRuntimeJson(runtime, await (boundOpts.loadOverview ?? loadSystemAgentOverview)());
		return;
	}
	if (boundOpts.message?.trim()) {
		const parsed = parseSystemAgentOperation(boundOpts.message);
		if (parsed.kind === "overview") {
			await runOneShot(parsed, runtime, boundOpts);
			return;
		}
		const overview = await withProgress({
			label: "Loading OpenClaw overview…",
			indeterminate: true,
			delayMs: 0,
			fallback: "none"
		}, async () => await (boundOpts.loadOverview ?? loadSystemAgentOverview)());
		runtime.log((boundOpts.formatOverview ?? formatSystemAgentOverview)(overview));
		runtime.log("");
		await runOneShot(await resolveSystemAgentOperation(boundOpts.message, runtime, {
			...boundOpts,
			loadOverview: async () => overview
		}), runtime, boundOpts);
		return;
	}
	if (boundOpts.interactive === false) {
		const overview = await (boundOpts.loadOverview ?? loadSystemAgentOverview)();
		runtime.log((boundOpts.formatOverview ?? formatSystemAgentOverview)(overview));
		return;
	}
	const input = boundOpts.input ?? stdin;
	const output = boundOpts.output ?? stdout;
	const inputIsTty = input.isTTY === true;
	const outputIsTty = output.isTTY === true;
	if (!inputIsTty || !outputIsTty) {
		runtime.error("OpenClaw needs an interactive TTY. Use --message for one command.");
		runtime.exit(1);
		return;
	}
	const runInteractiveTui = boundOpts.runInteractiveTui ?? (await import("../tui-backend-CYGDgJPa.js")).runSystemAgentTui;
	boundOpts.onReady?.();
	await runInteractiveTui(boundOpts, runtime);
}
//#endregion
export { runSystemAgent };
