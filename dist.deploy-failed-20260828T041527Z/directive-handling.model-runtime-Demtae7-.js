import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import { i as resolveSessionRuntimeOverrideForProvider, t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-CuMcNwkW.js";
import "./model-selection-Cp8EGD61.js";
//#region src/auto-reply/reply/directive-handling.model-runtime.ts
/** Resolves and applies explicit runtime selections attached to `/model`. */
/** Validates a requested runtime against the provider selected by the same directive. */
function resolveModelRuntimeDirective(params) {
	const rawRuntime = params.rawRuntime?.trim();
	if (!rawRuntime) {
		if (params.sessionEntry?.agentRuntimeOverride?.trim() && !resolveSessionRuntimeOverrideForProvider({
			provider: params.provider,
			entry: params.sessionEntry,
			cfg: params.cfg
		})) return { kind: "clear" };
		return { kind: "unchanged" };
	}
	const runtime = normalizeOptionalAgentRuntimeId(rawRuntime);
	if (isDefaultAgentRuntimeId(runtime)) return { kind: "clear" };
	const provider = normalizeProviderId(params.provider);
	const compatibleRuntime = resolveCompatibleAgentRuntimeForProvider({
		provider,
		runtime,
		cfg: params.cfg
	});
	if (compatibleRuntime) return {
		kind: "set",
		runtime: compatibleRuntime
	};
	return {
		kind: "invalid",
		runtime: rawRuntime,
		errorText: `Runtime "${rawRuntime}" is not supported for ${provider || params.provider}.`
	};
}
/** Applies a validated runtime choice without disturbing existing pins when no choice was given. */
function applyModelRuntimeDirective(entry, resolution) {
	if (resolution.kind === "clear") {
		const updated = entry.agentRuntimeOverride !== void 0;
		delete entry.agentRuntimeOverride;
		return { updated };
	}
	if (resolution.kind === "set") {
		const updated = entry.agentRuntimeOverride !== resolution.runtime;
		entry.agentRuntimeOverride = resolution.runtime;
		return { updated };
	}
	return { updated: false };
}
//#endregion
export { resolveModelRuntimeDirective as n, applyModelRuntimeDirective as t };
