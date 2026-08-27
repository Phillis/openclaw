import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { c as asFiniteNumberInRange, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { c as stripSelfProviderModelPrefix, n as normalizeBuiltInProviderModelId } from "./provider-model-id-normalization-DvssXFxG.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as getChildLogger } from "./logger-ij8OHrrv.js";
import { I as markHostPluginUsageDiagnosticEvent, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { o as normalizeModelRef } from "./model-ref-shared-D4yx0hwT.js";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-DbjoXfPH.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { o as normalizeUsage } from "./usage-DNKCVmJi.js";
import "./logging-aRZskxqi.js";
import { c as resolveThinkingProfile } from "./thinking-DLPyZXEW.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuqTHyA8.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-CVbhwZGU.js";
//#region src/plugins/runtime/runtime-llm-isolated.ts
const MAX_TIMER_DELAY_MS = 2147483647;
function completionError$1(code, message, cause) {
	const error = new Error(message, cause === void 0 ? void 0 : { cause });
	error.name = "LlmCompleteError";
	error.code = code;
	return error;
}
function requireIsolatedUserPrompt(params) {
	if (params.execution?.mode !== "isolated-agent-runtime" || !Array.isArray(params.messages) || params.messages.length !== 1 || params.messages[0]?.role !== "user" || typeof params.messages[0].content !== "string") throw completionError$1("LLM_ISOLATED_INPUT_REJECTED", "Isolated agent-runtime completion requires exactly one user message; pass system instructions through systemPrompt.");
	return params.messages[0].content;
}
function isIsolatedAgentRuntimeRequest(params) {
	return params.execution?.mode === "isolated-agent-runtime";
}
function assertSupportedExecutionMode(params) {
	const execution = params.execution;
	if (execution === void 0) return;
	if (!execution || typeof execution !== "object" || Array.isArray(execution) || execution.mode !== "isolated-agent-runtime") throw completionError$1("LLM_ISOLATED_INPUT_REJECTED", "Plugin LLM completion execution.mode must be \"isolated-agent-runtime\" when execution is provided.");
}
function resolveIsolatedTimeoutMs(value) {
	if (value === void 0) return 3e4;
	const timeoutMs = asFiniteNumber(value);
	if (timeoutMs === void 0 || !Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_TIMER_DELAY_MS) throw completionError$1("LLM_ISOLATED_INPUT_REJECTED", `Isolated agent-runtime completion timeoutMs must be an integer from 1 through ${MAX_TIMER_DELAY_MS}.`);
	return timeoutMs;
}
function assertIsolatedReasoningSupported(params) {
	if (params.reasoning === void 0) return;
	const catalog = buildConfiguredModelCatalog({ cfg: params.cfg });
	const profile = resolveThinkingProfile({
		provider: params.provider,
		model: params.model,
		agentRuntime: resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: params.provider,
			modelId: params.model
		}),
		...catalog.length > 0 ? { catalog } : {}
	});
	if (profile.levels.some((level) => level.id === params.reasoning)) return;
	throw completionError$1("LLM_ISOLATED_INPUT_REJECTED", `Thinking level "${params.reasoning}" is not supported for ${params.provider}/${params.model}. Use one of: ${profile.levels.map((level) => level.label).join(", ")}.`);
}
async function runIsolatedAgentRuntimeCompletion(params) {
	const prompt = requireIsolatedUserPrompt(params.request);
	const timeoutMs = resolveIsolatedTimeoutMs(params.request.execution.timeoutMs);
	assertIsolatedReasoningSupported({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		reasoning: params.request.reasoning
	});
	const controller = new AbortController();
	let timedOut = false;
	const abortFromCaller = () => controller.abort(params.request.signal?.reason);
	if (params.request.signal?.aborted) throw completionError$1("LLM_COMPLETION_ABORTED", "Plugin LLM completion was aborted.");
	params.request.signal?.addEventListener("abort", abortFromCaller, { once: true });
	const timer = setTimeout(() => {
		timedOut = true;
		controller.abort(/* @__PURE__ */ new Error(`Isolated completion timed out after ${timeoutMs}ms.`));
	}, timeoutMs);
	timer.unref?.();
	let rejectOnAbort;
	const abortPromise = new Promise((_resolve, reject) => {
		rejectOnAbort = () => {
			const reason = controller.signal.reason;
			reject(reason instanceof Error ? reason : /* @__PURE__ */ new Error("Isolated completion was aborted."));
		};
		controller.signal.addEventListener("abort", rejectOnAbort, { once: true });
	});
	try {
		const operation = (async () => {
			const { runIsolatedCompletion } = await import("./isolated-completion-FsMnFWGM.js");
			return await runIsolatedCompletion({
				config: params.cfg,
				provider: params.provider,
				model: params.model,
				authProfileId: params.authProfileId,
				agentId: params.agentId,
				systemPrompt: params.request.systemPrompt ?? "",
				prompt,
				timeoutMs,
				abortSignal: controller.signal,
				thinkLevel: params.request.reasoning,
				streamParams: {
					maxTokens: asFiniteNumber(params.request.maxTokens),
					temperature: asFiniteNumber(params.request.temperature)
				}
			});
		})();
		return await Promise.race([operation, abortPromise]);
	} catch (error) {
		if (timedOut) throw completionError$1("LLM_COMPLETION_TIMEOUT", `Plugin LLM completion timed out after ${timeoutMs}ms.`, error);
		if (params.request.signal?.aborted) throw completionError$1("LLM_COMPLETION_ABORTED", "Plugin LLM completion was aborted.", error);
		const isolatedError = error;
		if (isolatedError.code === "unsupported") throw completionError$1("LLM_ISOLATED_UNSUPPORTED", typeof isolatedError.message === "string" ? isolatedError.message : "Configured agent runtime does not support isolated completion.", error);
		if (isolatedError.code === "runtime-unavailable") throw completionError$1("LLM_RUNTIME_UNAVAILABLE", typeof isolatedError.message === "string" ? isolatedError.message : "Configured agent runtime is unavailable.", error);
		if (isolatedError.code === "input-rejected") throw completionError$1("LLM_ISOLATED_INPUT_REJECTED", typeof isolatedError.message === "string" ? isolatedError.message : "Isolated completion input was rejected.", error);
		if (isolatedError.code === "output-rejected") throw completionError$1("LLM_COMPLETION_OUTPUT_REJECTED", typeof isolatedError.message === "string" ? isolatedError.message : "Isolated completion output was rejected.", error);
		throw completionError$1("LLM_COMPLETION_FAILED", "Plugin LLM completion failed.", error);
	} finally {
		clearTimeout(timer);
		if (rejectOnAbort) controller.signal.removeEventListener("abort", rejectOnAbort);
		params.request.signal?.removeEventListener("abort", abortFromCaller);
	}
}
//#endregion
//#region src/plugins/runtime/runtime-llm.runtime.ts
const defaultLogger = getChildLogger({ capability: "runtime.llm" });
function toRuntimeLogger(logger) {
	return {
		debug: (message, meta) => logger.debug?.(meta, message),
		info: (message, meta) => logger.info(meta, message),
		warn: (message, meta) => logger.warn(meta, message),
		error: (message, meta) => logger.error(meta, message)
	};
}
function normalizeCaller(caller, fallback) {
	const source = caller ?? fallback;
	if (!source) return { kind: "unknown" };
	return {
		kind: source.kind,
		...normalizeOptionalString(source.id) ? { id: source.id.trim() } : {},
		...normalizeOptionalString(source.name) ? { name: source.name.trim() } : {}
	};
}
function completionError(code, message, cause) {
	const error = new Error(message, cause === void 0 ? void 0 : { cause });
	error.name = "LlmCompleteError";
	error.code = code;
	return error;
}
function resolveTrustedCaller(authority) {
	if (authority?.caller?.kind === "context-engine") return normalizeCaller(authority.caller);
	const scopedPluginId = normalizeOptionalString(getPluginRuntimeGatewayRequestScope()?.pluginId);
	if (scopedPluginId) return {
		kind: "plugin",
		id: scopedPluginId
	};
	return normalizeCaller(authority?.caller);
}
function resolveRuntimeConfig(options) {
	const cfg = options.getConfig?.();
	if (!cfg) throw new Error("Plugin LLM completion requires an injected runtime config scope.");
	return cfg;
}
async function resolveAgentId(params) {
	const authorityAgentIdRaw = normalizeOptionalString(params.authority?.agentId);
	const requestedAgentIdRaw = normalizeOptionalString(params.request.agentId);
	const authorityAgentId = authorityAgentIdRaw ? normalizeAgentId(authorityAgentIdRaw) : void 0;
	const requestedAgentId = requestedAgentIdRaw ? normalizeAgentId(requestedAgentIdRaw) : void 0;
	if (params.authority?.requiresBoundAgent && !authorityAgentId) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion is not bound to an active session agent.");
	if (authorityAgentId) {
		if (requestedAgentId && requestedAgentId !== authorityAgentId && !params.allowAgentIdOverride) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the active session agent.");
		return authorityAgentId;
	}
	if (requestedAgentId) {
		if (!params.allowAgentIdOverride) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the target agent.");
		return requestedAgentId;
	}
	const { resolveAmbientOwnerAgentId } = await import("./agent-scope-WWPxWnDc.js");
	return resolveAmbientOwnerAgentId(params.cfg);
}
function buildSystemPrompt(params) {
	const segments = [normalizeOptionalString(params.systemPrompt), ...params.messages.filter((message) => message.role === "system").map((message) => normalizeOptionalString(message.content))].filter((segment) => Boolean(segment));
	return segments.length > 0 ? segments.join("\n\n") : void 0;
}
function buildMessages(params) {
	const now = Date.now();
	return params.request.messages.filter((message) => message.role !== "system").map((message) => message.role === "user" ? {
		role: "user",
		content: message.content,
		timestamp: now
	} : {
		role: "assistant",
		content: [{
			type: "text",
			text: message.content
		}],
		api: params.api,
		provider: params.provider,
		model: params.model,
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
		stopReason: "stop",
		timestamp: now
	});
}
function readFiniteNonNegativeNumber(value) {
	return asFiniteNumberInRange(value, { min: 0 });
}
function readExplicitCostUsd(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const cost = raw.cost;
	if (typeof cost === "number") return readFiniteNonNegativeNumber(cost);
	if (!cost || typeof cost !== "object" || Array.isArray(cost)) return;
	return readFiniteNonNegativeNumber(cost.totalUsd) ?? readFiniteNonNegativeNumber(cost.total);
}
function buildUsage(params) {
	const costConfig = resolveModelCostConfig({
		provider: params.provider,
		model: params.model,
		config: params.cfg
	});
	const costUsd = readExplicitCostUsd(params.rawUsage) ?? estimateUsageCost({
		usage: params.normalized,
		cost: costConfig
	});
	return {
		...params.normalized?.input !== void 0 ? { inputTokens: params.normalized.input } : {},
		...params.normalized?.output !== void 0 ? { outputTokens: params.normalized.output } : {},
		...params.normalized?.cacheRead !== void 0 ? { cacheReadTokens: params.normalized.cacheRead } : {},
		...params.normalized?.cacheWrite !== void 0 ? { cacheWriteTokens: params.normalized.cacheWrite } : {},
		...params.normalized?.total !== void 0 ? { totalTokens: params.normalized.total } : {},
		...costUsd !== void 0 ? { costUsd } : {}
	};
}
function finalizeCompletion(params) {
	const normalized = normalizeUsage(params.rawUsage);
	const usage = buildUsage({
		rawUsage: params.rawUsage,
		normalized,
		cfg: params.cfg,
		provider: params.result.provider,
		model: params.result.model
	});
	params.logger.info("plugin llm completion", {
		caller: params.result.audit.caller,
		purpose: params.result.audit.purpose,
		sessionKey: params.result.audit.sessionKey,
		agentId: params.result.agentId,
		provider: params.result.provider,
		model: params.result.model,
		executionMode: params.result.execution.mode,
		executionOwner: params.result.execution.owner,
		usage
	});
	const input = normalized?.input ?? 0;
	const output = normalized?.output ?? 0;
	const cacheRead = normalized?.cacheRead ?? 0;
	const cacheWrite = normalized?.cacheWrite ?? 0;
	const promptTokens = input + cacheRead + cacheWrite;
	const total = normalized?.total ?? promptTokens + output;
	const hasPositiveUsage = [
		input,
		output,
		cacheRead,
		cacheWrite,
		total,
		usage.costUsd
	].some((value) => typeof value === "number" && Number.isFinite(value) && value > 0);
	if (params.suppressUsage !== true && isDiagnosticsEnabled(params.cfg) && hasPositiveUsage) emitTrustedDiagnosticEvent(markHostPluginUsageDiagnosticEvent({
		type: "model.usage",
		...params.result.audit.sessionKey ? { sessionKey: params.result.audit.sessionKey } : {},
		agentId: params.result.agentId,
		provider: params.result.provider,
		model: params.result.model,
		usage: {
			input,
			output,
			cacheRead,
			cacheWrite,
			promptTokens,
			total
		},
		...usage.costUsd !== void 0 ? { costUsd: usage.costUsd } : {}
	}, params.hostPluginId));
	return {
		...params.result,
		usage
	};
}
function normalizeAllowedModelRef(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return "*";
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return null;
	const modelId = normalizeBuiltInProviderModelId(parsed.provider, stripSelfProviderModelPrefix(parsed.provider, parsed.modelId));
	return modelKey(parsed.provider, modelId);
}
function normalizeModelAllowlist(params) {
	const models = /* @__PURE__ */ new Set();
	let allowAny = false;
	for (const modelRef of params.values ?? []) {
		const normalizedModelRef = normalizeAllowedModelRef(modelRef);
		if (!normalizedModelRef) continue;
		if (normalizedModelRef === "*") {
			allowAny = true;
			continue;
		}
		models.add(normalizedModelRef);
	}
	return {
		configured: params.configured,
		allowAny,
		models
	};
}
function buildPolicyFromEntry(entry) {
	return {
		allowAgentIdOverride: entry.allowAgentIdOverride === true,
		allowModelOverride: entry.allowModelOverride === true,
		allowAuthProfileOverride: entry.allowAuthProfileOverride === true,
		overrideModels: normalizeModelAllowlist({
			configured: entry.hasAllowedModelsConfig === true,
			values: entry.allowedModels
		}),
		completionModels: normalizeModelAllowlist({
			configured: entry.hasAllowedCompletionModelsConfig === true,
			values: entry.allowedCompletionModels
		})
	};
}
function resolvePluginPolicyId(authority, caller) {
	const authorityPluginId = normalizeOptionalString(authority?.pluginIdForPolicy);
	if (authorityPluginId) return authorityPluginId;
	if (caller.kind !== "plugin") return;
	return normalizeOptionalString(caller.id);
}
function resolvePluginLlmPolicy(cfg, pluginId) {
	if (!pluginId) return;
	const entry = normalizePluginsConfig(cfg.plugins).entries[pluginId]?.llm;
	return entry ? buildPolicyFromEntry(entry) : void 0;
}
function resolveAuthorityModelPolicy(authority) {
	if (authority?.allowAgentIdOverride !== true && authority?.allowModelOverride !== true && authority?.allowAuthProfileOverride !== true && authority?.allowedModels === void 0 && authority?.allowedCompletionModels === void 0) return;
	return buildPolicyFromEntry({
		allowAgentIdOverride: authority.allowAgentIdOverride,
		allowModelOverride: authority.allowModelOverride,
		allowAuthProfileOverride: authority.allowAuthProfileOverride,
		hasAllowedModelsConfig: authority.allowedModels !== void 0,
		allowedModels: authority.allowedModels,
		hasAllowedCompletionModelsConfig: authority.allowedCompletionModels !== void 0,
		allowedCompletionModels: authority.allowedCompletionModels
	});
}
function assertAllowedAuthProfileOverride(params) {
	if (!params.authProfileId) return;
	if (params.authorityPolicy?.allowAuthProfileOverride === true || params.pluginPolicy?.allowAuthProfileOverride === true) return;
	throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the auth profile. Enable plugins.entries.<id>.llm.allowAuthProfileOverride to authorize it.");
}
function assertOverrideModelAllowed(params) {
	const allowlist = params.policy?.overrideModels;
	if (!allowlist?.configured) return;
	if (allowlist.allowAny) return;
	if (allowlist.models.size === 0) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion model override allowlist has no valid models.");
	if (!params.resolvedModelRef) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion model override allowlist requires a resolvable provider/model target.");
	if (!allowlist.models.has(params.resolvedModelRef)) {
		const owner = params.policyOwnerPluginId ? ` for plugin "${params.policyOwnerPluginId}"` : "";
		throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion model override "${params.resolvedModelRef}" is not allowlisted${owner}.`);
	}
}
function assertAllowedModelOverride(params) {
	if (params.authorityPolicy?.allowModelOverride !== true && params.pluginPolicy?.allowModelOverride !== true) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the target model.");
	assertOverrideModelAllowed({
		resolvedModelRef: params.resolvedModelRef,
		policy: params.authorityPolicy
	});
	assertOverrideModelAllowed({
		resolvedModelRef: params.resolvedModelRef,
		policy: params.pluginPolicy,
		policyOwnerPluginId: params.pluginPolicyId
	});
}
function assertCompletionModelAllowed(params) {
	const allowlist = params.policy?.completionModels;
	if (!allowlist?.configured) return;
	if (allowlist.allowAny) return;
	if (allowlist.models.size === 0) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion model allowlist has no valid models.");
	if (!params.resolvedModelRef) throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion model allowlist requires a resolvable provider/model target.");
	if (!allowlist.models.has(params.resolvedModelRef)) {
		const owner = params.policyOwnerPluginId ? ` for plugin "${params.policyOwnerPluginId}"` : "";
		throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion model "${params.resolvedModelRef}" is not allowlisted for completions${owner}.`);
	}
}
/**
* Create the host-owned generic LLM completion runtime for trusted plugin callers.
*/
function createRuntimeLlm(options = {}) {
	const logger = options.logger ?? toRuntimeLogger(defaultLogger);
	return { complete: async (params) => {
		const caller = resolveTrustedCaller(options.authority);
		if (options.authority?.allowComplete === false) {
			const reason = options.authority.denyReason ?? "capability denied";
			logger.warn("plugin llm completion denied", {
				caller,
				purpose: params.purpose,
				reason
			});
			throw completionError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion denied: ${reason}`);
		}
		assertSupportedExecutionMode(params);
		const [{ prepareSimpleCompletionModelForAgent, completeWithPreparedSimpleCompletionModel, resolveSimpleCompletionSelectionForAgent }, cfg] = await Promise.all([import("./simple-completion-runtime-BKUvF4ve.js"), Promise.resolve(resolveRuntimeConfig(options))]);
		const pluginPolicyId = resolvePluginPolicyId(options.authority, caller);
		const pluginPolicy = resolvePluginLlmPolicy(cfg, pluginPolicyId);
		const authorityPolicy = resolveAuthorityModelPolicy(options.authority);
		const preferredProfile = normalizeOptionalString(options.authority?.preferredProfile);
		const audit = {
			caller,
			...params.purpose ? { purpose: params.purpose } : {},
			...options.authority?.sessionKey ? { sessionKey: options.authority.sessionKey } : {}
		};
		const agentId = await resolveAgentId({
			request: params,
			cfg,
			authority: options.authority,
			allowAgentIdOverride: options.authority?.allowAgentIdOverride === false ? false : authorityPolicy?.allowAgentIdOverride === true || pluginPolicy?.allowAgentIdOverride === true
		});
		const requestedModel = normalizeOptionalString(params.model);
		const requestedModelProfile = requestedModel ? normalizeOptionalString(splitTrailingAuthProfile(requestedModel).profile) : void 0;
		const selection = resolveSimpleCompletionSelectionForAgent({
			cfg,
			agentId,
			modelRef: requestedModel
		});
		if (!selection) throw completionError("LLM_COMPLETION_FAILED", `No model configured for agent ${agentId}.`);
		const normalizedSelection = normalizeModelRef(selection.provider, selection.modelId);
		const resolvedModelRef = modelKey(normalizedSelection.provider, normalizedSelection.model);
		assertCompletionModelAllowed({
			resolvedModelRef,
			policy: authorityPolicy
		});
		assertCompletionModelAllowed({
			resolvedModelRef,
			policy: pluginPolicy,
			policyOwnerPluginId: pluginPolicyId
		});
		if (requestedModel) assertAllowedModelOverride({
			resolvedModelRef,
			pluginPolicyId,
			authorityPolicy,
			pluginPolicy
		});
		const isolatedRequest = isIsolatedAgentRuntimeRequest(params);
		const executionProfile = isolatedRequest ? normalizeOptionalString(params.execution.authProfileId) : void 0;
		const modelProfile = normalizeOptionalString(selection.profileId);
		if (executionProfile && requestedModelProfile && executionProfile !== requestedModelProfile) throw completionError("LLM_ISOLATED_INPUT_REJECTED", "Isolated completion received conflicting auth profiles in model and execution.authProfileId.");
		if (isolatedRequest) {
			assertAllowedAuthProfileOverride({
				authProfileId: executionProfile ?? requestedModelProfile,
				authorityPolicy,
				pluginPolicy
			});
			const result = await runIsolatedAgentRuntimeCompletion({
				request: params,
				cfg,
				agentId,
				provider: selection.provider,
				model: selection.modelId,
				authProfileId: executionProfile ?? requestedModelProfile ?? preferredProfile ?? modelProfile
			});
			return finalizeCompletion({
				cfg,
				hostPluginId: pluginPolicyId,
				rawUsage: result.usage,
				logger,
				result: {
					text: result.text,
					provider: result.provider,
					model: result.model,
					agentId,
					execution: {
						mode: params.execution.mode,
						owner: result.owner
					},
					audit
				}
			});
		}
		const prepared = await prepareSimpleCompletionModelForAgent({
			cfg,
			agentId,
			modelRef: params.model,
			preferredProfile,
			allowBundledStaticCatalogFallback: true,
			allowMissingApiKeyModes: ["aws-sdk"],
			skipAgentDiscovery: true
		});
		if ("error" in prepared) throw new Error(`Plugin LLM completion failed: ${prepared.error}`);
		const context = {
			systemPrompt: buildSystemPrompt(params),
			messages: buildMessages({
				request: params,
				provider: prepared.model.provider,
				model: prepared.model.id,
				api: prepared.model.api
			})
		};
		const result = await completeWithPreparedSimpleCompletionModel({
			model: prepared.model,
			auth: prepared.auth,
			cfg,
			context,
			options: {
				maxTokens: asFiniteNumber(params.maxTokens),
				temperature: asFiniteNumber(params.temperature),
				...params.reasoning !== void 0 ? { reasoning: params.reasoning } : {},
				signal: params.signal
			}
		});
		const text = result.content.filter((c) => c.type === "text").map((c) => c.text).join("");
		return finalizeCompletion({
			cfg,
			hostPluginId: pluginPolicyId,
			suppressUsage: !text.trim() || ![
				"stop",
				"length",
				"toolUse"
			].includes(result.stopReason),
			rawUsage: result.usage,
			logger,
			result: {
				text,
				provider: prepared.selection.provider,
				model: prepared.selection.modelId,
				agentId,
				execution: {
					mode: "direct-provider",
					owner: {
						kind: "provider",
						id: prepared.selection.provider
					}
				},
				audit
			}
		});
	} };
}
//#endregion
export { createRuntimeLlm };
