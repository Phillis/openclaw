import "./ai-transport-host-zGUr_-Q4.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { defaultApiRegistry, defaultLlmRuntime } from "@openclaw/ai/internal/runtime";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
//#region src/llm/model-runtime-binding.ts
const MODEL_LLM_RUNTIME = Symbol("openclaw.modelLlmRuntime");
const streamLlmRuntimes = /* @__PURE__ */ new WeakMap();
/** Carries the prepared lifecycle runtime without changing the serialized model shape. */
function bindModelLlmRuntime(model, runtime) {
	const bound = { ...model };
	Object.defineProperty(bound, MODEL_LLM_RUNTIME, {
		value: runtime,
		enumerable: false
	});
	return bound;
}
function getModelLlmRuntime(model) {
	return model[MODEL_LLM_RUNTIME];
}
/** Associates a prepared stream entry point with the runtime that owns it. */
function bindStreamLlmRuntime(streamFn, runtime) {
	streamLlmRuntimes.set(streamFn, runtime);
}
function getStreamLlmRuntime(streamFn) {
	return streamFn ? streamLlmRuntimes.get(streamFn) : void 0;
}
//#endregion
//#region src/llm/stream.ts
registerBuiltInApiProviders(defaultApiRegistry);
let transportRuntimeHostPromise;
async function ensureTransportRuntimeHost() {
	transportRuntimeHostPromise ??= import("./ai-transport-runtime-host-8sLRuuNH.js").then(({ configureAiTransportRuntimeHost }) => configureAiTransportRuntimeHost());
	await transportRuntimeHostPromise;
}
function createRuntimeHostErrorMessage(model, error) {
	return {
		role: "assistant",
		content: [],
		api: model.api,
		provider: model.provider,
		model: model.id,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "error",
		errorMessage: error instanceof Error ? error.message : String(error),
		timestamp: Date.now()
	};
}
function deferUntilTransportRuntimeHost(model, start) {
	const output = (0, event_stream_exports.createAssistantMessageEventStream)();
	(async () => {
		try {
			await ensureTransportRuntimeHost();
			for await (const event of start()) output.push(event);
		} catch (error) {
			const message = createRuntimeHostErrorMessage(model, error);
			output.push({
				type: "error",
				reason: "error",
				error: message
			});
		} finally {
			output.end();
		}
	})();
	return output;
}
function resolveRuntime(model) {
	return getModelLlmRuntime(model) ?? defaultLlmRuntime;
}
function stream(model, context, options) {
	return deferUntilTransportRuntimeHost(model, () => resolveRuntime(model).stream(model, context, options));
}
async function complete(model, context, options) {
	await ensureTransportRuntimeHost();
	return await resolveRuntime(model).complete(model, context, options);
}
function streamSimple(model, context, options) {
	return deferUntilTransportRuntimeHost(model, () => resolveRuntime(model).streamSimple(model, context, options));
}
async function completeSimple(model, context, options) {
	await ensureTransportRuntimeHost();
	return await resolveRuntime(model).completeSimple(model, context, options);
}
//#endregion
export { bindModelLlmRuntime as a, getStreamLlmRuntime as c, streamSimple as i, completeSimple as n, bindStreamLlmRuntime as o, stream as r, getModelLlmRuntime as s, complete as t };
