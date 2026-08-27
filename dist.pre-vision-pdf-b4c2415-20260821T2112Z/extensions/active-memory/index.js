import { d as resolveAgentWorkspaceDir, l as resolveAgentDir } from "../../agent-scope-config-BdXMWufB.js";
import { s as normalizePluginsConfig } from "../../config-state-CpuWFwzR.js";
import "../../agent-runtime-BWHKIUtK.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { n as resolveLivePluginConfigObject } from "../../plugin-config-runtime-D7ikroCS.js";
import { L as MAX_SETUP_GRACE_TIMEOUT_MS, M as HOOK_TIMEOUT_RECOVERY_GRACE_MS, R as MAX_TIMEOUT_MS } from "../../types-CyvGmPEE.js";
import { c as resetActiveMemoryConfigForTests, f as setMinimumTimeoutMsForTests, i as isMissingRegisteredMemoryToolsError, o as normalizePluginConfig, p as setSetupGraceTimeoutMsForTests, r as hasDeprecatedModelFallbackPolicy, t as applyCliRuntimeRecallTimeoutDefault } from "../../config-CiBtP-uQ.js";
import { n as shouldEscalateRecall } from "../../escalation-Cm_RlPnS.js";
import { n as buildSearchQuery, o as getModelRef, r as extractRecentTurns, t as buildQuery } from "../../query-C5v8xuAa.js";
import { n as buildPromptPrefix, t as buildMetadata } from "../../prompt-wFd4tXbE.js";
import { a as getCircuitBreakerEntry, c as resetActiveRecallStateForTests, f as setCachedResult, i as getCachedResult, m as toSingleLineErrorMessage, n as buildCircuitBreakerKey, o as isCircuitBreakerOpen, p as shouldCacheResult, r as forgetActiveRecallRun, t as buildCacheKey } from "../../recall-state-zLm7Bkw2.js";
import { i as resolveCanonicalSessionKeyFromSessionId, n as buildPluginStatusLine, o as resolveStatusUpdateAgentId, r as persistPluginStatusLines } from "../../session-ku-lJ8jm.js";
import { s as hasUsableMemoryResultInSessionRecord, t as createActiveMemoryHookDeadline } from "../../transcript-MY-e4N6r.js";
import { t as readActiveMemorySearchDebug } from "../../transcript-watch-CE6ugQRm.js";
import { a as readPartialAssistantText, c as resetActiveMemoryTranscriptForTests, l as setTimeoutPartialDataGraceMsForTests } from "../../transcript-result-DFxbGfEf.js";
import { t as maybeResolveActiveRecall } from "../../recall-D594meDY.js";
import { _ as updateActiveMemoryGlobalEnabledInConfig, a as isActiveMemoryPluginEnabled, c as isEligibleInteractiveSession, d as isSessionActiveMemoryDisabled, f as lacksAdminToMutateActiveMemoryGlobal, g as shouldSkipActiveMemoryForHarnessSession, h as shouldRememberAcrossConversations, i as isActiveMemoryGloballyEnabled, l as isEnabledForAgent, m as setSessionActiveMemoryDisabled, n as formatActiveMemoryCommandHelp, o as isAllowedChatId, p as resolveCommandSessionKey, s as isAllowedChatType, t as ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT, u as isPrivateRecallDestination } from "../../session-policy-CPwqqHk-.js";
import { c as resolveTriggerRecall, i as forgetTriggerRecallPrewarm, o as prewarmTriggerRecall, s as resetTriggerRecallPrewarmsForTests } from "../../trigger-recall-qbExL-3s.js";
//#region extensions/active-memory/index.ts
/**
* Active Memory plugin entry. Runtime behavior lives in focused sibling modules.
*/
const MEMORY_CORE_PLUGIN_ID = "memory-core";
/** Plugin entry registering Active Memory hooks, tools, config schema, and doctor cleanup. */
var active_memory_default = definePluginEntry({
	id: "active-memory",
	name: "Active Memory",
	description: "Proactively surfaces relevant memory before eligible conversational replies.",
	register(api) {
		const readCurrentConfig = () => {
			try {
				return api.runtime.config?.current?.() ?? api.config;
			} catch {
				return api.config;
			}
		};
		let config = normalizePluginConfig(api.pluginConfig, readCurrentConfig());
		const warnDeprecatedModelFallbackPolicy = (pluginConfig) => {
			if (hasDeprecatedModelFallbackPolicy(pluginConfig)) api.logger.warn?.("active-memory: config.modelFallbackPolicy is deprecated and no longer changes runtime behavior. config.modelFallback is a chain-resolution last-resort (consulted only when config.model, the current run's model, and the agent's configured default all resolve to nothing) — it is NOT a runtime failover that substitutes a different model when the resolved model errors out.");
		};
		warnDeprecatedModelFallbackPolicy(api.pluginConfig);
		const refreshLiveConfigFromRuntime = () => {
			const livePluginConfig = resolveLivePluginConfigObject(api.runtime.config?.current ? () => api.runtime.config.current() : void 0, "active-memory", api.pluginConfig);
			const liveConfig = readCurrentConfig();
			config = normalizePluginConfig(liveConfig && !isActiveMemoryPluginEnabled(liveConfig) ? { enabled: false } : livePluginConfig ?? {}, liveConfig);
			if (livePluginConfig) warnDeprecatedModelFallbackPolicy(livePluginConfig);
		};
		api.registerCommand({
			name: "active-memory",
			description: "Enable, disable, or inspect Active Memory for this session.",
			acceptsArgs: true,
			exposeSenderIsOwner: true,
			handler: async (ctx) => {
				const tokens = ctx.args?.trim().split(/\s+/).filter(Boolean) ?? [];
				const isGlobal = tokens.includes("--global");
				const action = (tokens.find((token) => token !== "--global") ?? "status").toLowerCase();
				if (action === "help") return { text: formatActiveMemoryCommandHelp() };
				refreshLiveConfigFromRuntime();
				if (isGlobal) {
					const currentConfig = api.runtime.config.current();
					if (action === "status") return { text: `Active Memory: ${isActiveMemoryGloballyEnabled(currentConfig) ? "on" : "off"} globally.` };
					if (lacksAdminToMutateActiveMemoryGlobal({
						senderIsOwner: ctx.senderIsOwner,
						gatewayClientScopes: ctx.gatewayClientScopes
					})) return { text: ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT };
					if (action === "on" || action === "enable" || action === "enabled") {
						await api.runtime.config.mutateConfigFile({
							afterWrite: { mode: "auto" },
							mutate: (draft) => {
								const nextConfig = updateActiveMemoryGlobalEnabledInConfig(draft, true);
								Object.assign(draft, nextConfig);
							}
						});
						refreshLiveConfigFromRuntime();
						return { text: "Active Memory: on globally." };
					}
					if (action === "off" || action === "disable" || action === "disabled") {
						await api.runtime.config.mutateConfigFile({
							afterWrite: { mode: "auto" },
							mutate: (draft) => {
								const nextConfig = updateActiveMemoryGlobalEnabledInConfig(draft, false);
								Object.assign(draft, nextConfig);
							}
						});
						refreshLiveConfigFromRuntime();
						return { text: "Active Memory: off globally." };
					}
				}
				const sessionKey = resolveCommandSessionKey({
					api,
					config,
					sessionKey: ctx.sessionKey,
					sessionId: ctx.sessionId
				});
				if (!sessionKey) return { text: "Active Memory: session toggle unavailable because this command has no session context." };
				const commandAgentId = resolveStatusUpdateAgentId({ sessionKey });
				const liveConfig = readCurrentConfig() ?? api.config;
				if (!(isEnabledForAgent(config, commandAgentId) || config.enabled && shouldRememberAcrossConversations(liveConfig, commandAgentId))) return { text: "Active Memory: off for this session." };
				if (action === "status") return { text: `Active Memory: ${await isSessionActiveMemoryDisabled({
					api,
					sessionKey
				}) ? "off" : "on"} for this session.` };
				if (action === "on" || action === "enable" || action === "enabled") {
					await setSessionActiveMemoryDisabled({
						api,
						sessionKey,
						disabled: false
					});
					return { text: "Active Memory: on for this session." };
				}
				if (action === "off" || action === "disable" || action === "disabled") {
					await setSessionActiveMemoryDisabled({
						api,
						sessionKey,
						disabled: true
					});
					await persistPluginStatusLines({
						api,
						agentId: resolveStatusUpdateAgentId({ sessionKey }),
						sessionKey
					});
					return { text: "Active Memory: off for this session." };
				}
				return { text: `Unknown Active Memory action: ${action}\n\n${formatActiveMemoryCommandHelp()}` };
			}
		});
		const beforePromptBuildTimeoutMs = MAX_TIMEOUT_MS + MAX_SETUP_GRACE_TIMEOUT_MS + HOOK_TIMEOUT_RECOVERY_GRACE_MS * 2;
		api.on("before_prompt_build", async (event, ctx) => {
			refreshLiveConfigFromRuntime();
			const liveConfig = readCurrentConfig() ?? api.config;
			const timeoutAgentId = resolveStatusUpdateAgentId(ctx);
			const timeoutModelRef = (timeoutAgentId ? getModelRef(liveConfig, timeoutAgentId, config, {
				modelProviderId: ctx.modelProviderId,
				modelId: ctx.modelId
			}) : {
				provider: ctx.modelProviderId,
				model: ctx.modelId
			}) ?? {};
			const cliDispatchEligibility = api.runtime.agent.resolveCliBackendDispatchEligibility({
				provider: timeoutModelRef.provider,
				model: timeoutModelRef.model,
				config: liveConfig,
				...timeoutAgentId ? {
					agentId: timeoutAgentId,
					agentDir: resolveAgentDir(liveConfig, timeoutAgentId),
					workspaceDir: resolveAgentWorkspaceDir(liveConfig, timeoutAgentId)
				} : {}
			});
			const invocationConfig = applyCliRuntimeRecallTimeoutDefault(config, cliDispatchEligibility !== void 0);
			const liveRecallTimeoutMs = invocationConfig.timeoutMs + invocationConfig.setupGraceTimeoutMs + HOOK_TIMEOUT_RECOVERY_GRACE_MS;
			const deadlineController = new AbortController();
			const hookDeadline = createActiveMemoryHookDeadline();
			const armHookDeadline = (timeoutMs, phase) => {
				hookDeadline.arm(timeoutMs, () => {
					deadlineController.abort(/* @__PURE__ */ new Error(`active-memory ${phase} timeout after ${timeoutMs}ms`));
					api.logger.warn?.(`active-memory: before_prompt_build ${phase} timed out after ${String(timeoutMs)}ms; skipping memory lookup`);
				});
			};
			armHookDeadline(HOOK_TIMEOUT_RECOVERY_GRACE_MS, "preflight");
			const handlerPromise = (async () => {
				try {
					const resolvedAgentId = resolveStatusUpdateAgentId(ctx);
					const resolvedSessionKey = ctx.sessionKey?.trim() || (resolvedAgentId ? resolveCanonicalSessionKeyFromSessionId({
						api,
						agentId: resolvedAgentId,
						sessionId: ctx.sessionId
					}) : void 0);
					const effectiveAgentId = resolvedAgentId || resolveStatusUpdateAgentId({ sessionKey: resolvedSessionKey });
					if (shouldSkipActiveMemoryForHarnessSession({
						api,
						agentId: effectiveAgentId,
						sessionKey: resolvedSessionKey
					})) return;
					const sessionDisabled = await isSessionActiveMemoryDisabled({
						api,
						sessionKey: resolvedSessionKey
					});
					deadlineController.signal.throwIfAborted();
					if (sessionDisabled) {
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey
						});
						return;
					}
					const sessionContext = {
						...ctx,
						sessionKey: resolvedSessionKey ?? ctx.sessionKey
					};
					if (!isEligibleInteractiveSession(sessionContext)) {
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey
						});
						return;
					}
					const destinationContext = {
						...sessionContext,
						mainKey: liveConfig.session?.mainKey ?? api.config.session?.mainKey
					};
					const recentTurns = extractRecentTurns(event.messages);
					const searchQuery = buildSearchQuery({
						latestUserMessage: event.prompt,
						recentTurns
					});
					const memorySlot = normalizePluginsConfig(liveConfig.plugins).slots.memory;
					const chatIdAllowed = isAllowedChatId(invocationConfig, {
						sessionKey: destinationContext.sessionKey,
						messageProvider: destinationContext.messageProvider,
						channelId: destinationContext.channelId
					});
					const activeMemoryConfigured = isEnabledForAgent(invocationConfig, effectiveAgentId);
					let laneOne = {
						hasStrongHit: false,
						injectedCount: 0
					};
					if (activeMemoryConfigured && effectiveAgentId && memorySlot === MEMORY_CORE_PLUGIN_ID && isPrivateRecallDestination(destinationContext) && chatIdAllowed) {
						laneOne = await resolveTriggerRecall({
							cfg: liveConfig,
							agentId: effectiveAgentId,
							query: searchQuery,
							message: event.prompt,
							activeProjectKeys: ctx.activeProjectKeys,
							signal: AbortSignal.timeout(HOOK_TIMEOUT_RECOVERY_GRACE_MS),
							runId: ctx.runId
						}).catch((error) => {
							api.logger.debug?.(`active-memory: lane-1 trigger recall failed: ${toSingleLineErrorMessage(error)}`);
							return {
								hasStrongHit: false,
								injectedCount: 0
							};
						});
						if (laneOne.context && laneOne.injectedCount > 0 && invocationConfig.logging) api.logger.info?.(`active-memory: lane-1 injected ${laneOne.injectedCount} trigger-matched entries`);
					}
					const laneOneContext = laneOne.context;
					const activeMemoryAllowed = activeMemoryConfigured && isAllowedChatType(invocationConfig, destinationContext) && chatIdAllowed;
					const productRecallRequested = Boolean(invocationConfig.enabled && resolvedSessionKey && shouldRememberAcrossConversations(liveConfig, effectiveAgentId) && isPrivateRecallDestination(destinationContext) && chatIdAllowed);
					const productRecallEligible = productRecallRequested && memorySlot === MEMORY_CORE_PLUGIN_ID;
					if (productRecallRequested && !productRecallEligible) api.logger.warn?.("active-memory: the current memory provider does not support protected private transcript recall; skipping Remember across conversations");
					const productRecallAllowed = productRecallEligible && invocationConfig.toolsAllow.includes("memory_search");
					if (productRecallEligible && !productRecallAllowed) api.logger.warn?.("active-memory: memory_search is unavailable; skipping Remember across conversations private transcript recall");
					if (!activeMemoryAllowed && !productRecallAllowed) {
						await persistPluginStatusLines({
							api,
							agentId: effectiveAgentId,
							sessionKey: resolvedSessionKey
						});
						return laneOneContext ? { prependContext: laneOneContext } : void 0;
					}
					if (!shouldEscalateRecall({
						mode: invocationConfig.mode,
						message: event.prompt,
						hasStrongLaneOneHit: laneOne.hasStrongHit
					})) return laneOneContext ? { prependContext: laneOneContext } : void 0;
					const conversationRecall = productRecallAllowed && resolvedSessionKey ? {
						anchorSessionKey: resolvedSessionKey,
						scope: "same-agent-private",
						corpus: activeMemoryAllowed ? "configured" : "sessions"
					} : void 0;
					const recallConfig = productRecallAllowed && !activeMemoryAllowed ? {
						...invocationConfig,
						toolsAllow: ["memory_search"]
					} : invocationConfig;
					const query = buildQuery({
						latestUserMessage: event.prompt,
						recentTurns,
						config: recallConfig
					});
					armHookDeadline(liveRecallTimeoutMs, "recall");
					const result = await maybeResolveActiveRecall({
						api,
						runtimeConfig: liveConfig,
						config: recallConfig,
						agentId: effectiveAgentId,
						sessionKey: resolvedSessionKey,
						sessionId: ctx.sessionId,
						messageProvider: ctx.messageProvider,
						channelId: ctx.channelId,
						query,
						searchQuery,
						currentModelProviderId: ctx.modelProviderId,
						currentModelId: ctx.modelId,
						conversationRecall,
						abortSignal: deadlineController.signal,
						runId: ctx.runId
					});
					deadlineController.signal.throwIfAborted();
					if (!result.summary) return laneOneContext ? { prependContext: laneOneContext } : void 0;
					const promptPrefix = buildPromptPrefix(result.summary);
					if (!promptPrefix) return laneOneContext ? { prependContext: laneOneContext } : void 0;
					return { prependContext: [laneOneContext, promptPrefix].filter(Boolean).join("\n") };
				} catch (error) {
					if (deadlineController.signal.aborted) return;
					const message = toSingleLineErrorMessage(error);
					api.logger.warn?.(`active-memory: before_prompt_build failed, skipping memory lookup: ${message}`);
					return;
				}
			})();
			try {
				const result = await Promise.race([handlerPromise, hookDeadline.promise]);
				return typeof result === "symbol" ? void 0 : result;
			} finally {
				hookDeadline.stop();
			}
		}, { timeoutMs: beforePromptBuildTimeoutMs });
		api.on("before_model_resolve", async (event, ctx) => {
			refreshLiveConfigFromRuntime();
			const liveConfig = readCurrentConfig() ?? api.config;
			const effectiveAgentId = resolveStatusUpdateAgentId(ctx);
			const sessionContext = {
				...ctx,
				sessionKey: ctx.sessionKey?.trim() || (effectiveAgentId ? resolveCanonicalSessionKeyFromSessionId({
					api,
					agentId: effectiveAgentId,
					sessionId: ctx.sessionId
				}) : void 0),
				mainKey: liveConfig.session?.mainKey ?? api.config.session?.mainKey
			};
			if (!isEligibleInteractiveSession(sessionContext) || !isEnabledForAgent(config, effectiveAgentId) || !effectiveAgentId || normalizePluginsConfig(liveConfig.plugins).slots.memory !== MEMORY_CORE_PLUGIN_ID || !isPrivateRecallDestination(sessionContext) || !isAllowedChatId(config, sessionContext)) return;
			if (await isSessionActiveMemoryDisabled({
				api,
				sessionKey: sessionContext.sessionKey
			})) return;
			prewarmTriggerRecall({
				cfg: liveConfig,
				agentId: effectiveAgentId,
				query: buildSearchQuery({ latestUserMessage: event.prompt }),
				activeProjectKeys: ctx.activeProjectKeys,
				runId: ctx.runId
			}).catch((error) => {
				api.logger.debug?.(`active-memory: lane-1 prewarm failed: ${toSingleLineErrorMessage(error)}`);
			});
		});
		api.on("agent_end", (event, ctx) => {
			const runId = event.runId ?? ctx.runId;
			forgetActiveRecallRun(runId);
			forgetTriggerRecallPrewarm(runId);
		});
	}
});
const testing = {
	buildSearchQuery,
	buildCacheKey,
	buildCircuitBreakerKey,
	buildMetadata,
	buildPluginStatusLine,
	buildPromptPrefix,
	getCachedResult,
	hasUsableMemoryResultInSessionRecord,
	isCircuitBreakerOpen,
	isMissingRegisteredMemoryToolsError,
	normalizePluginConfig,
	readActiveMemorySearchDebug,
	readPartialAssistantText,
	shouldCacheResult,
	resetActiveRecallCacheForTests() {
		resetActiveRecallStateForTests();
		resetActiveMemoryConfigForTests();
		resetActiveMemoryTranscriptForTests();
		resetTriggerRecallPrewarmsForTests();
	},
	setMinimumTimeoutMsForTests,
	setSetupGraceTimeoutMsForTests,
	setTimeoutPartialDataGraceMsForTests,
	setCachedResult,
	getCircuitBreakerEntry
};
//#endregion
export { active_memory_default as default, testing };
