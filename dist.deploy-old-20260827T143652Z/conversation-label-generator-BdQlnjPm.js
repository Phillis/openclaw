import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./agent-scope-BizOtGGz.js";
import { p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { i as resolveSimpleCompletionSelectionForAgent } from "./simple-completion-runtime-CaHEMuty.js";
import { t as runIsolatedCompletion } from "./isolated-completion-Dddfh3XY.js";
//#region src/auto-reply/reply/conversation-label-generator.ts
const DEFAULT_MAX_LABEL_LENGTH = 128;
const CONVERSATION_LABEL_MAX_TOKENS = 4096;
const TIMEOUT_MS = 15e3;
function resolveMaxLabelLength(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_MAX_LABEL_LENGTH;
}
function resolveTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : TIMEOUT_MS;
}
function resolveAttemptSelection(params) {
	return resolveSimpleCompletionSelectionForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		...params.attempt.modelRef ? { modelRef: params.attempt.modelRef } : {},
		...params.attempt.useUtilityModel !== void 0 ? { useUtilityModel: params.attempt.useUtilityModel } : {}
	});
}
function resolveRawModelProvider(modelRef) {
	const model = splitTrailingAuthProfile(modelRef?.trim() ?? "").model;
	const separator = model.indexOf("/");
	return (separator > 0 ? model.slice(0, separator).trim().toLowerCase() : "") || void 0;
}
function resolveAttemptKey(params) {
	const selection = resolveAttemptSelection(params);
	if (selection) return [
		"resolved",
		selection.provider,
		selection.runtimeProvider ?? "",
		selection.modelId,
		selection.profileId ?? params.attempt.preferredProfile ?? ""
	].join("\0");
	const rawRef = splitTrailingAuthProfile(params.attempt.modelRef?.trim() ?? "");
	return [
		"raw",
		rawRef.model,
		rawRef.profile ?? params.attempt.preferredProfile ?? ""
	].join("\0");
}
async function completeLabel(params) {
	const selection = resolveAttemptSelection(params);
	if (!selection) throw new Error("conversation label model selection unavailable");
	return truncateUtf16Safe((await runIsolatedCompletion({
		config: params.cfg,
		provider: selection.runtimeProvider ?? selection.provider,
		model: selection.modelId,
		authProfileId: selection.profileId ?? params.attempt.preferredProfile,
		agentId: params.agentId,
		agentDir: params.agentDir ?? selection.agentDir,
		...params.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride } : {},
		systemPrompt: params.prompt,
		prompt: params.userMessage,
		timeoutMs: params.timeoutMs,
		streamParams: { maxTokens: CONVERSATION_LABEL_MAX_TOKENS }
	})).text.trim(), params.maxLength) || null;
}
async function runLabelAttempts(params) {
	const seen = /* @__PURE__ */ new Set();
	const failures = [];
	for (const [index, attempt] of params.attempts.entries()) {
		const key = resolveAttemptKey({
			...params,
			attempt
		});
		if (seen.has(key)) continue;
		seen.add(key);
		try {
			const label = await completeLabel({
				...params,
				attempt
			});
			const normalized = label && params.normalizeLabel ? params.normalizeLabel(label) : label;
			if (normalized) return normalized;
		} catch {
			failures.push(index === params.attempts.length - 1 ? "primary fallback" : "utility");
		}
	}
	if (failures.length > 0) throw new Error(`conversation label generation failed (${failures.join(", ")})`);
	return null;
}
/** Generates a bounded human-readable label for a session, or null for empty output. */
async function generateConversationLabel(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
	const attempts = params.modelRef ? [{ modelRef: params.modelRef }] : [{ useUtilityModel: true }, { useUtilityModel: false }];
	return await runLabelAttempts({
		cfg: params.cfg,
		agentId,
		agentDir: params.agentDir,
		...params.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride } : {},
		attempts,
		userMessage: params.userMessage,
		prompt: params.prompt,
		timeoutMs: resolveTimeoutMs(params.timeoutMs),
		maxLength: resolveMaxLabelLength(params.maxLength)
	});
}
/** Tries an explicit utility model once, then the regular model once when needed. */
async function generateConversationLabelWithFallback(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
	const regularAttempt = {
		modelRef: params.regularModelRef,
		...params.preferredProfile ? { preferredProfile: params.preferredProfile } : {}
	};
	const utilityRef = params.utilityModelRef?.trim();
	let utilityAttempt;
	if (utilityRef) {
		const candidate = { modelRef: utilityRef };
		const utilitySelection = resolveAttemptSelection({
			cfg: params.cfg,
			agentId,
			agentDir: params.agentDir,
			attempt: candidate
		});
		const regularSelection = resolveAttemptSelection({
			cfg: params.cfg,
			agentId,
			agentDir: params.agentDir,
			attempt: regularAttempt
		});
		const utilityAuthProvider = utilitySelection?.provider ?? resolveRawModelProvider(utilityRef);
		const regularAuthProvider = regularSelection?.provider ?? resolveRawModelProvider(params.regularModelRef);
		const utilityRawProfile = splitTrailingAuthProfile(utilityRef).profile;
		utilityAttempt = params.preferredProfile && !utilitySelection?.profileId && !utilityRawProfile && utilityAuthProvider && utilityAuthProvider === regularAuthProvider ? { modelRef: `${utilityRef}@${params.preferredProfile}` } : candidate;
	}
	return await runLabelAttempts({
		cfg: params.cfg,
		agentId,
		agentDir: params.agentDir,
		...params.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride } : {},
		attempts: [...utilityAttempt ? [utilityAttempt] : [], regularAttempt],
		userMessage: params.userMessage,
		prompt: params.prompt,
		timeoutMs: resolveTimeoutMs(params.timeoutMs),
		maxLength: resolveMaxLabelLength(params.maxLength),
		normalizeLabel: params.normalizeLabel
	});
}
//#endregion
export { generateConversationLabelWithFallback as n, generateConversationLabel as t };
