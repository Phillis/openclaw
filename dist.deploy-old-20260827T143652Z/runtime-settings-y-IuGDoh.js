import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
//#region src/context-engine/runtime-settings.ts
const RUNTIME_REASON_CODES = /* @__PURE__ */ new Set([
	"provider_timeout",
	"provider_unavailable",
	"rate_limited",
	"context_overflow",
	"runtime_unavailable",
	"unknown"
]);
const RUNTIME_REASON_PATTERNS = [
	["provider_timeout", /timeout/iu],
	["rate_limited", /rate|limit|429/iu],
	["context_overflow", /overflow|context|pressure/iu],
	["runtime_unavailable", /runtime/iu],
	["provider_unavailable", /provider|primary|unavailable/iu]
];
function normalizeReasonCode(value) {
	const normalized = normalizeNullableString(value);
	if (!normalized) return null;
	if (RUNTIME_REASON_CODES.has(normalized)) return normalized;
	return RUNTIME_REASON_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "unknown";
}
function buildContextEngineRuntimeSettings(params) {
	const hostId = normalizeNullableString(params.contextEngineHost.id);
	const selectedId = normalizeNullableString(params.selectedContextEngineId);
	const selectionSource = params.contextEngineSelectionSource ?? (selectedId ? "configured" : "unknown");
	const requestedModel = normalizeNullableString(params.requestedModel);
	const resolvedModel = normalizeNullableString(params.resolvedModel);
	const fallbackReason = normalizeReasonCode(params.fallbackReason);
	const degradedReason = normalizeReasonCode(params.degradedReason);
	const resolvedViaFallback = requestedModel !== null && resolvedModel !== null && requestedModel !== resolvedModel;
	return {
		schemaVersion: 1,
		runtime: {
			host: "openclaw",
			mode: params.mode ?? (degradedReason ? "degraded" : fallbackReason || resolvedViaFallback ? "fallback" : "normal"),
			harnessId: normalizeNullableString(params.harnessId),
			runtimeId: normalizeNullableString(params.runtimeId)
		},
		model: {
			requested: requestedModel,
			resolved: resolvedModel,
			provider: normalizeNullableString(params.provider),
			family: normalizeNullableString(params.modelFamily)
		},
		contextEngineSelection: {
			selectedId,
			source: selectionSource
		},
		executionHost: {
			id: hostId,
			label: normalizeNullableString(params.contextEngineHost.label)
		},
		limits: {
			promptTokenBudget: asFiniteNumber(params.promptTokenBudget) ?? null,
			maxOutputTokens: asFiniteNumber(params.maxOutputTokens) ?? null
		},
		diagnostics: {
			fallbackReason,
			degradedReason
		}
	};
}
//#endregion
export { buildContextEngineRuntimeSettings as t };
