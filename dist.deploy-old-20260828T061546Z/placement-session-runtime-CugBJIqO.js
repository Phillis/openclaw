import "./openai-routing-Chr0R2hQ.js";
import { n as getRegisteredAgentHarness } from "./registry-CWcxV14-.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuqTHyA8.js";
import { n as resolveSessionModelRef } from "./session-model-ref-Dc9mG8e_.js";
//#region src/gateway/worker-environments/placement-session-runtime.ts
function resolveWorkerPlacementSessionRuntime(params) {
	const selectedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: selectedModel.provider,
		modelId: selectedModel.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	});
}
function resolveWorkerPlacementExecutionMode(runtime) {
	return resolveWorkerPlacementCapabilities(runtime).executionMode;
}
function resolveWorkerPlacementCapabilities(runtime) {
	const runtimeId = runtime.trim();
	if (runtimeId === "openclaw") return {
		executionMode: "worker-turn",
		devicePlacement: {
			requiredNodeCommands: [],
			consumesWorkerSlot: true
		}
	};
	const placement = getRegisteredAgentHarness(runtimeId)?.harness.cloudPlacement;
	if (!placement) return {};
	const requirement = placement.devicePlacement;
	if (!requirement) return { executionMode: placement.mode };
	const requiredNodeCommands = [...new Set(requirement.requiredNodeCommands)].toSorted();
	if (requiredNodeCommands.length > 32 || requiredNodeCommands.some((command) => command.length === 0 || command.length > 128 || command.trim() !== command)) return { executionMode: placement.mode };
	return {
		executionMode: placement.mode,
		devicePlacement: {
			requiredNodeCommands,
			consumesWorkerSlot: requirement.consumesWorkerSlot
		}
	};
}
function projectWorkerPlacementAgentRuntime(runtime) {
	const { source, ...identity } = runtime;
	const { executionMode, devicePlacement } = resolveWorkerPlacementCapabilities(runtime.id);
	return {
		...identity,
		cloudPlacementSupported: executionMode !== void 0,
		...executionMode ? { cloudPlacementExecutionMode: executionMode } : {},
		...devicePlacement ? { devicePlacement } : {},
		devicePlacementSupported: devicePlacement !== void 0,
		source
	};
}
//#endregion
export { resolveWorkerPlacementSessionRuntime as i, resolveWorkerPlacementCapabilities as n, resolveWorkerPlacementExecutionMode as r, projectWorkerPlacementAgentRuntime as t };
