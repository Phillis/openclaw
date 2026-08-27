import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { p as resolveEffectiveModelFallbacks, v as resolveSubagentModelFallbacksOverride } from "./agent-scope-BizOtGGz.js";
import "./agent-scope-config-BdXMWufB.js";
import "./thinking.shared-bHYuuc1L.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import "./thinking-dphnnN-M.js";
import { k as resolveCronDeliverySessionKey } from "./row-codec-BXU8Ei5n.js";
import "./session-accessor-Bi6bzKQE.js";
import "./restart-recovery-state-BoowPFT5.js";
import { r as resolveModelCandidateChain } from "./model-fallback-candidates-BGnJ8Xq9.js";
import "./thinking-runtime-F3zRbZ0D.js";
import "./session-runtime-compat-B5omAB7u.js";
import "./model-thinking-default-B9IHGxZs.js";
import "./model-selection-cli-BKHYNvuu.js";
import "./workspace-CiE104ur.js";
import "./runtime-plugin-xWTIHJ0n.js";
import "./timeout-CRSytcvC.js";
import { r as resolveStaticSessionMcpServerNames } from "./agent-bundle-mcp-runtime-config-tbNGVEfV.js";
import "./bootstrap-budget-BjndRqg9.js";
import "./lanes-CI0_P-yC.js";
import "./lifecycle-hook-helpers-BIigCxgL.js";
import "./current-time-D-I8cLSc.js";
import "./model-fallback-runner-BQBHjYs7.js";
import { t as createSourceDeliveryPlan } from "./source-delivery-plan-D53JVwm5.js";
import "./result-fallback-classifier-D8qWB51S.js";
import { n as createCronRunDiagnosticsFromError, r as createCronRunDiagnosticsFromMissingWebSearchProvider, s as toolsAllowRequestsWebSearch } from "./run-diagnostics-6Nuqo5uy.js";
import { n as resolveCronDeliveryPlan, t as hasExplicitCronDeliveryTarget } from "./delivery-plan-BXORs7EB.js";
import { i as resolveCodexMcpToolOverridesForAgent } from "./bundle-mcp-codex-B_a7gOZx.js";
//#region src/cron/isolated-agent/channel-output-policy.ts
/** Reads channel plugin output/threading policy for isolated cron delivery. */
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-DCGcYMgp.js"));
/** Resolves channel-specific cron output preferences from loaded channel plugins. */
async function resolveCronChannelOutputPolicy(channel, opts) {
	const channelId = normalizeOptionalLowercaseString(channel);
	if (!channelId) return { preferFinalAssistantVisibleText: opts?.deliveryRequested !== true };
	const { getChannelPlugin } = await channelPluginRuntimeLoader.load();
	return { preferFinalAssistantVisibleText: getChannelPlugin(channelId)?.outbound?.preferFinalAssistantVisibleText === true };
}
/** Resolves the provider-specific current-thread target for a delivery address. */
async function resolveCurrentChannelTarget(params) {
	if (!params.to) return;
	const channelId = normalizeOptionalLowercaseString(params.channel);
	if (!channelId) return params.to;
	const { getChannelPlugin } = await channelPluginRuntimeLoader.load();
	return getChannelPlugin(channelId)?.threading?.resolveCurrentChannelId?.({
		to: params.to,
		threadId: params.threadId
	}) ?? params.to;
}
//#endregion
//#region src/cron/isolated-agent/source-delivery-plan.ts
function resolveCronSourceDeliveryPlan(params) {
	const target = {
		channel: params.resolvedDelivery.channel,
		to: params.resolvedDelivery.to,
		accountId: params.resolvedDelivery.accountId,
		threadId: params.resolvedDelivery.threadId
	};
	if (params.deliveryPlan.mode === "webhook") return createSourceDeliveryPlan({
		owner: "none",
		reason: "cron_webhook",
		messageToolEnabled: false,
		directFallback: false
	});
	if (params.deliveryPlan.mode === "none") return createSourceDeliveryPlan({
		owner: "none",
		reason: "cron_none",
		target,
		messageToolEnabled: true,
		messageToolForced: false,
		directFallback: false
	});
	return createSourceDeliveryPlan({
		owner: "direct_fallback",
		reason: "cron_announce",
		target,
		messageToolEnabled: true,
		messageToolForced: false,
		requireExplicitMessageTarget: true,
		requireExplicitMessageTargetEvidence: true,
		directFallback: true,
		skipFallbackWhenMessageToolSentToTarget: params.resolvedDelivery.ok ?? true
	});
}
//#endregion
//#region src/cron/isolated-agent/run-delivery-trace.ts
const cronDeliveryRuntimeLoader = createLazyImportLoader(() => import("./run-delivery.runtime.js"));
const codexNativeWebSearchLoader = createLazyImportLoader(() => import("./codex-native-web-search-Bebhn2Id.js"));
const webToolRuntimeContextLoader = createLazyImportLoader(() => import("./web-tool-runtime-context-DfmIxOgh.js"));
const webSearchRuntimeLoader = createLazyImportLoader(() => import("./runtime-BhhJkR9F.js"));
async function loadCronDeliveryRuntime() {
	return await cronDeliveryRuntimeLoader.load();
}
async function loadCodexNativeWebSearch() {
	return await codexNativeWebSearchLoader.load();
}
function normalizeCronTraceTarget(target) {
	if (!target) return;
	return {
		...target.channel ? { channel: target.channel } : {},
		...target.to !== void 0 ? { to: target.to } : {},
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId !== void 0 ? { threadId: target.threadId } : {},
		...target.source ? { source: target.source } : {}
	};
}
function normalizeMessagingToolTarget(delivery, resolvedDelivery) {
	const { target } = delivery;
	const channel = target.provider?.trim();
	if (!channel) return;
	return {
		channel: channel === "message" && resolvedDelivery.ok && delivery.verifiedTarget ? resolvedDelivery.channel : channel,
		...target.to ? { to: target.to } : {},
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId ? { threadId: target.threadId } : {}
	};
}
function buildResolvedCronTraceTarget(resolvedDelivery) {
	if (resolvedDelivery.ok) return {
		ok: true,
		...normalizeCronTraceTarget({
			channel: resolvedDelivery.channel,
			to: resolvedDelivery.to,
			accountId: resolvedDelivery.accountId,
			threadId: resolvedDelivery.threadId,
			source: resolvedDelivery.mode === "implicit" ? "last" : "explicit"
		})
	};
	return {
		ok: false,
		...normalizeCronTraceTarget({
			channel: resolvedDelivery.channel,
			to: resolvedDelivery.to ?? null,
			accountId: resolvedDelivery.accountId,
			threadId: resolvedDelivery.threadId,
			source: resolvedDelivery.mode === "implicit" ? "last" : "explicit"
		}),
		error: resolvedDelivery.error.message
	};
}
function buildCronDeliveryTrace(params) {
	const intended = normalizeCronTraceTarget({
		channel: params.deliveryPlan.channel ?? "last",
		to: params.deliveryPlan.to ?? null,
		accountId: params.deliveryPlan.accountId,
		threadId: params.deliveryPlan.threadId,
		source: params.deliveryPlan.channel === "last" || !params.deliveryPlan.channel ? "last" : "explicit"
	});
	const resolved = params.deliveryPlan.mode !== "none" || hasExplicitCronDeliveryTarget(params.deliveryPlan) ? buildResolvedCronTraceTarget(params.resolvedDelivery) : void 0;
	const messageToolSentTo = params.sourceDeliveryOutcome.visibleDeliveries.map((delivery) => normalizeMessagingToolTarget(delivery, params.resolvedDelivery)).filter((target) => Boolean(target));
	return {
		...intended ? { intended } : {},
		...resolved ? { resolved } : {},
		...messageToolSentTo.length > 0 ? { messageToolSentTo } : {},
		fallbackUsed: params.fallbackUsed,
		delivered: params.delivered
	};
}
async function createCronToolsAllowPreflightDiagnostics(params) {
	const toolsAllow = params.agentPayload?.toolsAllow;
	if (params.agentPayload?.toolsAllowIsDefault === true) {
		const hasEnabledStaticMcp = resolveStaticSessionMcpServerNames({
			workspaceDir: params.workspaceDir,
			cfg: params.cfg,
			toolOverrides: resolveCodexMcpToolOverridesForAgent(params.cfg, {
				agentId: params.agentId,
				toolOverrides: void 0
			})
		}).length > 0;
		if (params.agentRuntime === "codex" && hasEnabledStaticMcp && params.toolsAllowProvenance?.source !== "final-executable-surface") return createCronRunDiagnosticsFromError("cron-preflight", `This automation's inherited tool cap predates final configured-MCP capture, so it continues with its stored finite tools and may omit MCP capabilities. Reauthorize in place with an exact explicit cap: openclaw automations edit ${params.jobId} --tools <tool,...>.`, { severity: "warn" });
		return;
	}
	if (!toolsAllowRequestsWebSearch(toolsAllow)) return;
	try {
		const { shouldSuppressManagedWebSearchTool } = await loadCodexNativeWebSearch();
		if (shouldSuppressManagedWebSearchTool({
			config: params.cfg,
			modelProvider: params.provider,
			modelApi: params.modelApi,
			modelId: params.model,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			agentDir: params.agentDir
		})) return;
		const { resolveWebSearchToolRuntimeContext } = await webToolRuntimeContextLoader.load();
		const { config, preferRuntimeProviders, runtimeWebSearch } = resolveWebSearchToolRuntimeContext({
			config: params.cfg,
			lateBindRuntimeConfig: true
		});
		const { hasUsableWebSearchProvider } = await webSearchRuntimeLoader.load();
		return createCronRunDiagnosticsFromMissingWebSearchProvider({
			toolsAllow,
			hasWebSearchProvider: hasUsableWebSearchProvider({
				config,
				agentDir: params.agentDir,
				runtimeWebSearch,
				preferRuntimeProviders
			})
		});
	} catch (error) {
		logWarn(`[cron:${params.jobId}] Failed to inspect web_search provider state for toolsAllow diagnostics: ${String(error)}`);
		return;
	}
}
/** Resolves the delivery plan and concrete target for one isolated cron run. */
async function resolveCronDeliveryContext(params) {
	const deliveryPlan = resolveCronDeliveryPlan(params.job);
	if (deliveryPlan.mode === "webhook") {
		const resolvedDelivery = {
			ok: false,
			channel: void 0,
			to: void 0,
			accountId: void 0,
			threadId: void 0,
			mode: "implicit",
			error: /* @__PURE__ */ new Error("webhook delivery has no chat target")
		};
		return {
			deliveryPlan,
			deliveryRequested: deliveryPlan.requested,
			resolvedDelivery,
			sourceDelivery: resolveCronSourceDeliveryPlan({
				deliveryPlan,
				resolvedDelivery
			})
		};
	}
	if (deliveryPlan.mode === "none" && !hasExplicitCronDeliveryTarget(deliveryPlan)) {
		const resolvedDelivery = {
			ok: false,
			channel: void 0,
			to: void 0,
			accountId: void 0,
			threadId: void 0,
			mode: "implicit",
			error: /* @__PURE__ */ new Error("delivery is disabled")
		};
		return {
			deliveryPlan,
			deliveryRequested: false,
			resolvedDelivery,
			sourceDelivery: resolveCronSourceDeliveryPlan({
				deliveryPlan,
				resolvedDelivery
			})
		};
	}
	const { resolveDeliveryTarget } = await loadCronDeliveryRuntime();
	const resolvedDelivery = await resolveDeliveryTarget(params.cfg, params.agentId, {
		channel: deliveryPlan.channel ?? "last",
		to: deliveryPlan.to,
		threadId: deliveryPlan.threadId,
		accountId: deliveryPlan.accountId,
		sessionKey: resolveCronDeliverySessionKey(params.job)
	});
	return {
		deliveryPlan,
		deliveryRequested: deliveryPlan.requested,
		resolvedDelivery,
		sourceDelivery: resolveCronSourceDeliveryPlan({
			deliveryPlan,
			resolvedDelivery
		})
	};
}
function appendCronDeliveryInstruction(params) {
	if (!params.deliveryRequested) return params.commandBody;
	if (params.messageToolEnabled) {
		const targetHint = params.requireExplicitMessageTarget || !params.resolvedDeliveryOk ? "with an explicit target" : "for the current chat";
		return `${params.commandBody}\n\nUse the message tool if you need to notify the user directly ${targetHint}. If you do not send directly, your final plain-text reply will be delivered automatically.`.trim();
	}
	return `${params.commandBody}\n\nYour response will be delivered automatically. If the task explicitly calls for messaging a specific external recipient, note who/where it should go instead of sending it yourself.`.trim();
}
//#endregion
//#region src/cron/isolated-agent/run-execution.runtime.ts
const cronExecutionCliRuntimeLoader = createLazyImportLoader(() => import("./run-execution-cli.runtime.js"));
/** Lazily resolves complete CLI bindings so cron continuations preserve reuse metadata. */
async function getCliSessionBinding(...args) {
	return (await cronExecutionCliRuntimeLoader.load()).getCliSessionBinding(...args);
}
/** Lazily runs the CLI-backed agent path used by isolated cron execution. */
async function runCliAgent(...args) {
	return (await cronExecutionCliRuntimeLoader.load()).runCliAgent(...args);
}
//#endregion
//#region src/cron/isolated-agent/run-fallback-policy.ts
/** Resolves model fallback chains for isolated cron runs and preflight. */
/** Resolves cron model fallbacks, giving explicit payload fallbacks precedence over subagent/default policy. */
function resolveCronFallbacksOverride(params) {
	const payload = params.job.payload.kind === "agentTurn" ? params.job.payload : void 0;
	const payloadFallbacks = Array.isArray(payload?.fallbacks) ? payload.fallbacks : void 0;
	const hasCronPayloadModelOverride = typeof payload?.model === "string" && payload.model.trim().length > 0;
	if (payloadFallbacks !== void 0) return payloadFallbacks;
	if (params.useSubagentFallbacks === true && !hasCronPayloadModelOverride) {
		const subagentFallbacksOverride = resolveSubagentModelFallbacksOverride(params.cfg, params.agentId);
		if (subagentFallbacksOverride !== void 0) return subagentFallbacksOverride;
	}
	if (!hasCronPayloadModelOverride && params.inheritDefaultFallbacksForAgentStringModel === true) {
		const defaultFallbacks = resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
		if (defaultFallbacks.length > 0) return defaultFallbacks;
	}
	return resolveEffectiveModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId,
		hasSessionModelOverride: hasCronPayloadModelOverride,
		modelOverrideSource: hasCronPayloadModelOverride ? "auto" : void 0
	});
}
/** Builds the ordered model candidates used by cron preflight checks. */
function resolveCronPreflightCandidates(params) {
	const fallbacksOverride = resolveCronFallbacksOverride({
		cfg: params.cfg,
		job: params.job,
		agentId: params.agentId,
		useSubagentFallbacks: params.useSubagentFallbacks,
		inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel
	});
	return resolveModelCandidateChain({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		requestedRouteResolution: "resolved",
		fallbacksOverride
	});
}
//#endregion
export { appendCronDeliveryInstruction as a, loadCronDeliveryRuntime as c, resolveCurrentChannelTarget as d, runCliAgent as i, resolveCronDeliveryContext as l, resolveCronPreflightCandidates as n, buildCronDeliveryTrace as o, getCliSessionBinding as r, createCronToolsAllowPreflightDiagnostics as s, resolveCronFallbacksOverride as t, resolveCronChannelOutputPolicy as u };
