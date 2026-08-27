import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as hasSessionActiveAutoModelFallback, T as hasUserPinnedModelSelection, w as hasSessionAutoModelFallbackProvenance } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { t as resolveCommitHash } from "./git-commit-Bbf_PCaF.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-I5TmV9jL.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { a as resolveMainSessionKey } from "./main-session-CPkeRwvL.js";
import { d as sessionDeliveryOrigin, u as sessionDeliveryChannel } from "./delivery-context.shared-azPdmUls.js";
import { c as resolveSessionPluginTraceLines, o as resolveFreshSessionTotalTokens, s as resolveSessionPluginStatusLines } from "./types-BEJRKmOU.js";
import { D as formatTokenCount } from "./sessions-CdrF1uzY.js";
import { o as resolveSessionLifecycleTimestamps } from "./lifecycle-DzPMUp4j.js";
import { t as resolveProjectedSessionContextTokens } from "./context-token-provenance-B2eCPcfc.js";
import { t as formatDurationCompact } from "./format-duration-CfGzOxKC.js";
import { c as shouldPreferActiveRuntimeAliasAuthLabel, t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CGiGCCsY.js";
import { o as resolveModelAuthMode } from "./model-auth-e0nL7cI2.js";
import "./model-selection-DHDS-v4K.js";
import { o as formatFastModeStatusValue } from "./fast-mode-CCX0YiYh.js";
import { i as resolveModelCostConfig, n as formatUsd, t as estimateUsageCost } from "./usage-format-DErPHjcA.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Jg1T3gN6.js";
import { t as resolveStatusTtsSnapshot } from "./status-config-JtUmSrRt.js";
import "./sandbox-BUq3Yn9r.js";
import { S as resolveOpenAITextVerbosity } from "./proxy-CaTLJXqb.js";
import { i as resolveExtraParams } from "./extra-params-DztvRYf4.js";
import { r as readRecentSessionUsageFromTranscript } from "./session-transcript-readers-CgCxlOAj.js";
import { c as resolveAuthoredModelContextTokens } from "./context-resolution-PMHXNyx7.js";
import { a as resolveContextTokensForModel } from "./context-Bj-w-uhp.js";
import { t as resolveFastModeState } from "./fast-mode-Dd78Dxbu.js";
import { n as resolveCronStyleNow } from "./current-time-CCCy7gvK.js";
import { t as resolveChannelModelOverride } from "./model-overrides-CRX6avLD.js";
import { n as findDecisionReason, s as summarizeDecisionReason } from "./runner.entries-BdFbwPcl.js";
import { t as resolveAgentRuntimeLabel } from "./agent-runtime-label-eHV8w5gB.js";
import { n as formatTimeAgo } from "./format-relative-DerIyym2.js";
import { n as resolveSelectedAndActiveModel, t as formatProviderModelRef } from "./model-runtime-BzIef07I.js";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-CGM-_NeA.js";
//#region src/status/status-message.ts
function normalizeAuthMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	if (normalized === "api-key" || normalized.startsWith("api-key ")) return "api-key";
	if (normalized === "oauth" || normalized.startsWith("oauth ")) return "oauth";
	if (normalized === "token" || normalized.startsWith("token ")) return "token";
	if (normalized === "aws-sdk" || normalized.startsWith("aws-sdk ")) return "aws-sdk";
	if (normalized === "native" || normalized.startsWith("native ")) return "native";
	if (normalized === "mixed" || normalized.startsWith("mixed ")) return "mixed";
	if (normalized === "unknown") return "unknown";
}
function resolveConfiguredTextVerbosity(params) {
	const provider = params.provider?.trim();
	const model = params.model?.trim();
	if (!provider || !model || provider !== "openai") return;
	return resolveOpenAITextVerbosity(resolveExtraParams({
		cfg: params.config,
		provider,
		modelId: model,
		agentId: params.agentId
	}));
}
function resolveExecutionLabel(args) {
	const sessionKey = args.sessionKey?.trim();
	if (args.config && sessionKey) {
		const runtimeStatus = resolveSandboxRuntimeStatus({
			cfg: args.config,
			sessionKey
		});
		const sandboxMode = runtimeStatus.mode ?? "off";
		if (sandboxMode === "off") return "direct";
		return `${runtimeStatus.sandboxed ? "docker" : sessionKey ? "direct" : "unknown"}/${sandboxMode}`;
	}
	const sandboxMode = args.agent?.sandbox?.mode ?? "off";
	if (sandboxMode === "off") return "direct";
	return `${(() => {
		if (!sessionKey) return false;
		if (sandboxMode === "all") return true;
		if (args.config) return resolveSandboxRuntimeStatus({
			cfg: args.config,
			sessionKey
		}).sandboxed;
		const mainKey = resolveMainSessionKey({ session: { scope: args.sessionScope ?? "per-sender" } });
		return sessionKey !== mainKey.trim();
	})() ? "docker" : sessionKey ? "direct" : "unknown"}/${sandboxMode}`;
}
const formatTokens = (total, contextTokens) => {
	const ctx = contextTokens ?? null;
	if (total == null) return `?/${ctx ? formatTokenCount(ctx) : "?"}`;
	const pct = ctx ? Math.min(999, Math.round(total / ctx * 100)) : null;
	return `${formatTokenCount(total)}/${ctx ? formatTokenCount(ctx) : "?"}${pct !== null ? ` (${pct}%)` : ""}`;
};
const formatEstimatedContextBudgetTokens = (status, contextTokens) => {
	if (!status || status.source !== "pre-prompt-estimate") return null;
	const estimatedPromptTokens = typeof status.estimatedPromptTokens === "number" && Number.isFinite(status.estimatedPromptTokens) && status.estimatedPromptTokens >= 0 ? Math.floor(status.estimatedPromptTokens) : void 0;
	if (estimatedPromptTokens === void 0) return null;
	const ctx = typeof contextTokens === "number" && Number.isFinite(contextTokens) && contextTokens > 0 ? contextTokens : typeof status.contextTokenBudget === "number" && Number.isFinite(status.contextTokenBudget) && status.contextTokenBudget > 0 ? status.contextTokenBudget : void 0;
	const pct = ctx ? Math.min(999, Math.round(estimatedPromptTokens / ctx * 100)) : null;
	return `~${formatTokenCount(estimatedPromptTokens)}/${ctx ? formatTokenCount(ctx) : "?"}${pct !== null ? ` (${pct}% est)` : " (est)"}`;
};
const formatContextUsageShort = (total, contextTokens) => `Context ${formatTokens(total, contextTokens ?? null)}`;
const formatQueueDetails = (queue) => {
	if (!queue) return "";
	const depth = typeof queue.depth === "number" ? `depth ${queue.depth}` : null;
	if (!queue.showDetails) return depth ? ` (${depth})` : "";
	const detailParts = [];
	if (depth) detailParts.push(depth);
	if (typeof queue.debounceMs === "number") {
		const ms = Math.max(0, Math.round(queue.debounceMs));
		const label = ms >= 1e3 ? `${ms % 1e3 === 0 ? ms / 1e3 : (ms / 1e3).toFixed(1)}s` : `${ms}ms`;
		detailParts.push(`debounce ${label}`);
	}
	if (typeof queue.cap === "number") detailParts.push(`cap ${queue.cap}`);
	if (queue.dropPolicy) detailParts.push(`drop ${queue.dropPolicy}`);
	return detailParts.length ? ` (${detailParts.join(" · ")})` : "";
};
const readUsageFromSessionLog = (sessionId, sessionEntry, agentId, sessionKey, storePath) => {
	if (!sessionId) return;
	try {
		const snapshot = readRecentSessionUsageFromTranscript({
			agentId: agentId ?? (sessionKey ? resolveAgentIdFromSessionKey(sessionKey) : void 0),
			sessionEntry,
			sessionId,
			sessionKey,
			storePath
		}, 256 * 1024);
		if (!snapshot) return;
		const input = snapshot.inputTokens ?? 0;
		const output = snapshot.outputTokens ?? 0;
		const cacheRead = snapshot.cacheRead ?? 0;
		const cacheWrite = snapshot.cacheWrite ?? 0;
		const promptTokens = snapshot.totalTokens ?? input + cacheRead + cacheWrite;
		const total = promptTokens + output;
		if (promptTokens === 0 && total === 0) return;
		const model = snapshot.modelProvider ? snapshot.model ? `${snapshot.modelProvider}/${snapshot.model}` : snapshot.modelProvider : snapshot.model;
		return {
			input,
			output,
			cacheRead,
			cacheWrite,
			promptTokens,
			total,
			totalTokensFresh: snapshot.totalTokensFresh === true,
			model
		};
	} catch {
		return;
	}
};
const formatTokensPairValue = (input, output) => {
	if (input == null && output == null) return null;
	return `${typeof input === "number" ? formatTokenCount(input) : "?"} in / ${typeof output === "number" ? formatTokenCount(output) : "?"} out`;
};
const formatCacheHitValue = (input, cacheRead, cacheWrite) => {
	if (!cacheRead && !cacheWrite) return null;
	if ((typeof cacheRead !== "number" || cacheRead <= 0) && (typeof cacheWrite !== "number" || cacheWrite <= 0)) return null;
	const cachedLabel = typeof cacheRead === "number" ? formatTokenCount(cacheRead) : "0";
	const newLabel = typeof cacheWrite === "number" ? formatTokenCount(cacheWrite) : "0";
	const totalInput = (typeof cacheRead === "number" ? cacheRead : 0) + (typeof cacheWrite === "number" ? cacheWrite : 0) + (typeof input === "number" ? input : 0);
	return `${totalInput > 0 && typeof cacheRead === "number" ? Math.round(cacheRead / totalInput * 100) : 0}% hit · ${cachedLabel} cached, ${newLabel} new`;
};
const formatMediaUnderstandingLine = (decisions) => {
	if (!decisions || decisions.length === 0) return null;
	const parts = decisions.map((decision) => {
		const count = decision.attachments.length;
		const countLabel = count > 1 ? ` x${count}` : "";
		if (decision.outcome === "success") {
			const chosen = decision.attachments.find((entry) => entry.chosen)?.chosen;
			const provider = chosen?.provider?.trim();
			const model = chosen?.model?.trim();
			const modelLabel = provider ? model && model !== provider ? `${provider}/${model}` : provider : null;
			const backendLabel = chosen?.observedBackend ? ` observed=${chosen.observedBackend}` : chosen?.requestedBackend ? ` requested=${chosen.requestedBackend}` : "";
			return `${decision.capability}${countLabel} ok${modelLabel ? ` (${modelLabel}${backendLabel})` : ""}`;
		}
		if (decision.outcome === "no-attachment") return `${decision.capability} none`;
		if (decision.outcome === "disabled") return `${decision.capability} off`;
		if (decision.outcome === "scope-deny") return `${decision.capability} denied`;
		if (decision.outcome === "skipped") {
			const shortReason = summarizeDecisionReason(findDecisionReason(decision));
			return `${decision.capability} skipped${shortReason ? ` (${shortReason})` : ""}`;
		}
		if (decision.outcome === "failed") {
			const shortReason = summarizeDecisionReason(findDecisionReason(decision, "failed"));
			return `${decision.capability} failed${shortReason ? ` (${shortReason})` : ""}`;
		}
		return null;
	}).filter((part) => part != null);
	if (parts.length === 0) return null;
	if (parts.every((part) => part.endsWith(" none"))) return null;
	return `📎 Media: ${parts.join(" · ")}`;
};
const formatVoiceModeLine = (config, sessionEntry, agentId) => {
	if (!config) return null;
	const snapshot = resolveStatusTtsSnapshot({
		cfg: config,
		sessionAuto: sessionEntry?.ttsAuto,
		agentId
	});
	if (!snapshot) return null;
	const parts = [`🔊 Voice: ${snapshot.autoMode}`, `provider=${snapshot.provider}`];
	if (snapshot.persona) parts.push(`persona=${snapshot.persona}`);
	if (snapshot.displayName) parts.push(`name=${snapshot.displayName}`);
	if (snapshot.model) parts.push(`model=${snapshot.model}`);
	if (snapshot.voice) parts.push(`voice=${snapshot.voice}`);
	if (snapshot.baseUrl) parts.push(snapshot.customBaseUrl ? `endpoint=custom(${snapshot.baseUrl})` : `endpoint=${snapshot.baseUrl}`);
	parts.push(`limit=${snapshot.maxLength}`, `summary=${snapshot.summarize ? "on" : "off"}`);
	return parts.join(" · ");
};
function resolveChannelModelNote(params) {
	if (!params.config || !params.entry) return;
	if (normalizeOptionalString(params.entry.modelOverride) || normalizeOptionalString(params.entry.providerOverride)) return;
	const channelOverride = resolveChannelModelOverride({
		cfg: params.config,
		channel: sessionDeliveryChannel(params.entry),
		groupId: params.entry.groupId,
		groupChatType: params.entry.chatType ?? sessionDeliveryOrigin(params.entry)?.chatType,
		groupChannel: params.entry.groupChannel,
		groupSubject: params.entry.subject,
		parentSessionKey: params.parentSessionKey,
		directUserIds: [
			sessionDeliveryOrigin(params.entry)?.nativeDirectUserId,
			sessionDeliveryOrigin(params.entry)?.from,
			sessionDeliveryOrigin(params.entry)?.to
		]
	});
	if (!channelOverride) return;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.config,
		defaultProvider: DEFAULT_PROVIDER,
		allowPluginNormalization: false
	});
	const resolvedOverride = resolveModelRefFromString({
		raw: channelOverride.model,
		defaultProvider: DEFAULT_PROVIDER,
		aliasIndex,
		allowPluginNormalization: false
	});
	if (!resolvedOverride) return;
	if (resolvedOverride.ref.provider !== params.selectedProvider || resolvedOverride.ref.model !== params.selectedModel) return;
	return "channel override";
}
function buildStatusMessage(args) {
	return buildStatusMessageParts(args).text;
}
function buildStatusMessageParts(args) {
	const now = args.now ?? Date.now();
	const cronNow = args.config ? resolveCronStyleNow(args.config, now) : void 0;
	const timeLine = args.timeLine ?? cronNow?.timeLine;
	const uptimeLine = args.uptimeValue ? `⏱️ Uptime: ${args.uptimeValue}` : void 0;
	const entry = args.sessionEntry;
	const selectionConfig = { agents: { defaults: args.agent ?? {} } };
	const contextConfig = args.config ? {
		...args.config,
		agents: {
			...args.config.agents,
			defaults: {
				...args.config.agents?.defaults,
				...args.agent
			}
		}
	} : { agents: { defaults: args.agent ?? {} } };
	const resolved = resolveConfiguredModelRef({
		cfg: selectionConfig,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: false
	});
	const selectedProvider = entry?.providerOverride ?? resolved.provider ?? "openai";
	const selectedModel = entry?.modelOverride ?? resolved.model ?? "gpt-5.6-sol";
	const modelRefs = resolveSelectedAndActiveModel({
		selectedProvider,
		selectedModel,
		sessionEntry: entry,
		parseSelectedProvider: Boolean(entry?.modelOverride?.trim() && !entry?.providerOverride?.trim())
	});
	const selectedLookupProvider = modelRefs.selected.provider || selectedProvider;
	const selectedLookupModel = modelRefs.selected.model || selectedModel;
	const initialFallbackState = resolveActiveFallbackState({
		selectedModelRef: modelRefs.selected.label || "unknown",
		activeModelRef: modelRefs.active.label || "unknown",
		config: args.config,
		state: entry
	});
	let activeProvider = modelRefs.active.provider;
	let activeModel = modelRefs.active.model;
	let contextLookupProvider = activeProvider;
	let contextLookupModel = activeModel;
	const runtimeModelRaw = normalizeOptionalString(entry?.model) ?? "";
	const runtimeProviderRaw = normalizeOptionalString(entry?.modelProvider) ?? "";
	if (runtimeModelRaw && !runtimeProviderRaw && runtimeModelRaw.includes("/")) {
		const slashIndex = runtimeModelRaw.indexOf("/");
		const embeddedProvider = normalizeOptionalLowercaseString(runtimeModelRaw.slice(0, slashIndex)) ?? "";
		const fallbackMatchesRuntimeModel = initialFallbackState.active && normalizeLowercaseStringOrEmpty(runtimeModelRaw) === normalizeLowercaseStringOrEmpty(normalizeOptionalString(entry?.fallbackNotice?.activeModel ?? "") ?? "");
		const runtimeMatchesSelectedModel = normalizeLowercaseStringOrEmpty(runtimeModelRaw) === normalizeLowercaseStringOrEmpty(modelRefs.selected.label || "unknown");
		if ((fallbackMatchesRuntimeModel || runtimeMatchesSelectedModel) && embeddedProvider === normalizeLowercaseStringOrEmpty(activeProvider)) {
			contextLookupProvider = activeProvider;
			contextLookupModel = activeModel;
		} else {
			contextLookupProvider = void 0;
			contextLookupModel = runtimeModelRaw;
		}
	}
	let inputTokens = entry?.inputTokens;
	let outputTokens = entry?.outputTokens;
	let cacheRead = entry?.cacheRead;
	let cacheWrite = entry?.cacheWrite;
	const freshTotalTokens = resolveFreshSessionTotalTokens(entry);
	const allowTranscriptContextUsage = entry?.totalTokensFresh !== false && freshTotalTokens === void 0;
	let totalTokens = freshTotalTokens;
	if (args.includeTranscriptUsage) {
		const logUsage = readUsageFromSessionLog(entry?.sessionId, entry, args.agentId, args.sessionKey, args.sessionStorePath);
		if (logUsage) {
			const candidate = logUsage.totalTokensFresh ? logUsage.promptTokens || logUsage.total : void 0;
			if (allowTranscriptContextUsage && candidate !== void 0 && candidate > 0 && (!totalTokens || totalTokens === 0 || candidate > totalTokens)) totalTokens = candidate;
			if (!entry?.model && logUsage.model) {
				const slashIndex = logUsage.model.indexOf("/");
				if (slashIndex > 0) {
					const provider = logUsage.model.slice(0, slashIndex).trim();
					const model = logUsage.model.slice(slashIndex + 1).trim();
					if (provider && model) {
						activeProvider = provider;
						activeModel = model;
						contextLookupProvider = void 0;
						contextLookupModel = logUsage.model;
					}
				} else {
					activeModel = logUsage.model;
					contextLookupProvider = activeProvider;
					contextLookupModel = logUsage.model;
				}
			}
			if (!inputTokens || inputTokens === 0) inputTokens = logUsage.input;
			if (!outputTokens || outputTokens === 0) outputTokens = logUsage.output;
			if (typeof cacheRead !== "number" || cacheRead <= 0) cacheRead = logUsage.cacheRead;
			if (typeof cacheWrite !== "number" || cacheWrite <= 0) cacheWrite = logUsage.cacheWrite;
		}
	}
	const activeModelLabel = formatProviderModelRef(activeProvider, activeModel) || "unknown";
	const runtimeDiffersFromSelected = activeModelLabel !== (modelRefs.selected.label || "unknown");
	const selectedContextTokens = resolveContextTokensForModel({
		cfg: contextConfig,
		provider: selectedLookupProvider,
		model: selectedLookupModel,
		allowAsyncLoad: false
	});
	const explicitRuntimeContextTokens = typeof args.runtimeContextTokens === "number" && args.runtimeContextTokens > 0 ? args.runtimeContextTokens : void 0;
	const resolvedActiveContextTokens = resolveContextTokensForModel({
		cfg: contextConfig,
		...contextLookupProvider ? { provider: contextLookupProvider } : {},
		model: contextLookupModel,
		allowAsyncLoad: false
	});
	const activeContextTokens = typeof explicitRuntimeContextTokens === "number" && typeof resolvedActiveContextTokens === "number" ? Math.min(explicitRuntimeContextTokens, resolvedActiveContextTokens) : explicitRuntimeContextTokens ?? resolvedActiveContextTokens;
	const channelModelNote = resolveChannelModelNote({
		config: args.config,
		entry,
		selectedProvider: selectedLookupProvider,
		selectedModel: selectedLookupModel,
		parentSessionKey: args.parentSessionKey
	});
	const projectedActiveContextTokens = resolveProjectedSessionContextTokens({
		entry,
		provider: contextLookupProvider,
		model: contextLookupModel,
		agentHarnessId: args.resolvedHarness,
		resolvedContextTokens: activeContextTokens,
		authoredContextTokens: resolveAuthoredModelContextTokens({
			cfg: contextConfig,
			provider: contextLookupProvider,
			model: contextLookupModel
		})
	});
	const runtimeSnapshotHasFallbackProvenance = initialFallbackState.active || hasSessionAutoModelFallbackProvenance(entry) || areRuntimeModelRefsEquivalent(activeModelLabel, modelRefs.selected.label || "unknown", { config: args.config });
	const contextTokens = entry?.modelSelectionLocked !== true && runtimeDiffersFromSelected && !runtimeSnapshotHasFallbackProvenance ? selectedContextTokens ?? 2e5 : projectedActiveContextTokens ?? 2e5;
	const thinkLevel = args.resolvedThink ?? args.sessionEntry?.thinkingLevel ?? args.agent?.thinkingDefault ?? "off";
	const verboseLevel = args.resolvedVerbose ?? args.sessionEntry?.verboseLevel ?? args.agent?.verboseDefault ?? "off";
	const fastMode = args.resolvedFast ?? args.sessionEntry?.fastMode ?? false;
	const fastModeState = resolveFastModeState({
		cfg: args.config,
		provider: activeProvider,
		model: activeModel,
		agentId: args.agentId,
		sessionEntry: args.sessionEntry
	});
	const reasoningLevel = args.resolvedReasoning ?? args.sessionEntry?.reasoningLevel ?? args.agent?.reasoningDefault ?? "off";
	const elevatedLevel = args.resolvedElevated ?? args.sessionEntry?.elevatedLevel ?? args.agent?.elevatedDefault ?? "on";
	const execution = { label: resolveExecutionLabel(args) };
	const agentRuntimeLabel = resolveAgentRuntimeLabel({
		config: args.config,
		sessionEntry: args.sessionEntry,
		resolvedHarness: args.resolvedHarness,
		fallbackProvider: activeProvider
	});
	const updatedAt = entry?.updatedAt;
	const sessionStartedAt = resolveSessionLifecycleTimestamps({
		entry,
		agentId: args.agentId,
		sessionKey: args.sessionKey,
		storePath: args.sessionStorePath
	}).sessionStartedAt;
	const sessionDuration = typeof sessionStartedAt === "number" ? formatDurationCompact(now - sessionStartedAt, { spaced: true }) : void 0;
	const sessionValue = [
		args.sessionKey ?? "unknown",
		sessionDuration ? `duration ${sessionDuration}` : null,
		typeof updatedAt === "number" ? `updated ${formatTimeAgo(now - updatedAt)}` : "no activity"
	].filter(Boolean).join(" • ");
	const groupActivationValue = entry?.chatType === "group" || entry?.chatType === "channel" || Boolean(args.sessionKey?.includes(":group:")) || Boolean(args.sessionKey?.includes(":channel:")) ? args.groupActivation ?? entry?.groupActivation ?? "mention" : void 0;
	const contextUsageLabel = totalTokens == null || totalTokens === 0 ? formatEstimatedContextBudgetTokens(entry?.contextBudgetStatus, contextTokens) ?? formatTokens(totalTokens, contextTokens ?? null) : formatTokens(totalTokens, contextTokens ?? null);
	const queueMode = args.queue?.mode ?? "unknown";
	const queueDetails = formatQueueDetails(args.queue);
	const verboseLabel = verboseLevel === "full" ? "verbose:full" : verboseLevel === "on" ? "verbose" : null;
	const traceLevel = entry?.traceLevel === "raw" ? "raw" : entry?.traceLevel === "on" ? "on" : "off";
	const traceLabel = traceLevel === "raw" ? "trace:raw" : traceLevel === "on" ? "trace" : null;
	const pluginStatusLines = verboseLevel !== "off" ? resolveSessionPluginStatusLines(entry) : [];
	const pluginTraceLines = traceLevel === "on" || traceLevel === "raw" ? resolveSessionPluginTraceLines(entry) : [];
	const pluginStatusLine = pluginStatusLines.length > 0 || pluginTraceLines.length > 0 ? [...pluginStatusLines, ...pluginTraceLines].join(" · ") : null;
	const elevatedLabel = elevatedLevel && elevatedLevel !== "off" ? elevatedLevel === "on" ? "elevated" : `elevated:${elevatedLevel}` : null;
	const textVerbosity = resolveConfiguredTextVerbosity({
		config: args.config,
		agentId: args.agentId,
		provider: activeProvider,
		model: activeModel
	});
	const fastModeValue = formatFastModeStatusValue({
		mode: fastMode,
		fastAutoOnSeconds: fastModeState.fastAutoOnSeconds
	});
	const optionFlagsValue = [
		verboseLabel,
		traceLabel,
		elevatedLabel
	].filter(Boolean).join(" · ");
	const modesValue = [
		`think ${thinkLevel}`,
		`fast ${fastModeValue}`,
		textVerbosity ? `text ${textVerbosity}` : null,
		reasoningLevel !== "off" ? `reasoning ${reasoningLevel}` : null,
		optionFlagsValue || null
	].filter(Boolean).join(" · ");
	const selectedModelLabel = modelRefs.selected.label || "unknown";
	const runtimeAliasModelEquivalent = areRuntimeModelRefsEquivalent(selectedModelLabel, activeModelLabel, { config: args.config });
	const selectedAuthMode = normalizeAuthMode(args.modelAuth) ?? resolveModelAuthMode(selectedLookupProvider, args.config);
	const rawSelectedAuthLabelValue = selectedAuthMode && selectedAuthMode !== "unknown" ? args.modelAuth ?? selectedAuthMode : void 0;
	const activeAuthMode = normalizeAuthMode(args.activeModelAuth) ?? resolveModelAuthMode(activeProvider, args.config);
	const activeAuthLabelValue = activeAuthMode && activeAuthMode !== "unknown" ? args.activeModelAuth ?? activeAuthMode : void 0;
	const selectedAuthLabelValue = shouldPreferActiveRuntimeAliasAuthLabel({
		runtimeAliasModelEquivalent,
		selectedAuthLabel: rawSelectedAuthLabelValue,
		activeAuthLabel: activeAuthLabelValue
	}) ? activeAuthLabelValue : rawSelectedAuthLabelValue ?? (runtimeAliasModelEquivalent ? activeAuthLabelValue : void 0);
	const fallbackState = resolveActiveFallbackState({
		selectedModelRef: selectedModelLabel,
		activeModelRef: activeModelLabel,
		config: args.config,
		state: entry
	});
	const hasUsage = typeof inputTokens === "number" || typeof outputTokens === "number" || typeof cacheRead === "number" || typeof cacheWrite === "number";
	const costConfig = hasUsage ? resolveModelCostConfig({
		provider: activeProvider,
		model: activeModel,
		config: args.config,
		allowPluginNormalization: false
	}) : void 0;
	const cost = hasUsage ? estimateUsageCost({
		usage: {
			input: inputTokens ?? void 0,
			output: outputTokens ?? void 0,
			cacheRead: cacheRead ?? void 0,
			cacheWrite: cacheWrite ?? void 0
		},
		cost: costConfig
	}) : void 0;
	const costLabel = hasUsage ? formatUsd(cost) : void 0;
	const modelNote = channelModelNote ? ` · ${channelModelNote}` : "";
	const configuredDefaultModelLabel = normalizeOptionalString(args.configuredDefaultModelLabel);
	const sessionHasPersistedModelSelection = hasUserPinnedModelSelection(entry);
	const sessionHasAutoFallback = hasSessionActiveAutoModelFallback(entry);
	const overrideLabel = (sessionHasPersistedModelSelection || sessionHasAutoFallback) && configuredDefaultModelLabel && selectedModelLabel !== configuredDefaultModelLabel && !areRuntimeModelRefsEquivalent(selectedModelLabel, configuredDefaultModelLabel, { config: args.config }) ? sessionHasPersistedModelSelection ? ` · pinned session; config primary ${configuredDefaultModelLabel} · clear /model default` : ` · auto fallback; config primary ${configuredDefaultModelLabel} · check provider` : "";
	const liveSwitchNote = entry?.liveModelSwitchPending ? " · ⏳ live switch pending" : "";
	const modelLines = [`🧠 Model: ${selectedModelLabel}${modelNote}${overrideLabel}${liveSwitchNote}`];
	const configuredFallbacks = (() => {
		const modelConfig = args.agent?.model;
		if (typeof modelConfig === "object" && modelConfig && Array.isArray(modelConfig.fallbacks)) return sessionHasPersistedModelSelection ? void 0 : modelConfig.fallbacks;
	})();
	const configuredFallbacksLine = configuredFallbacks?.length ? `🔄 Fallbacks: ${configuredFallbacks.join(", ")}` : null;
	const showFallbackAuth = activeAuthLabelValue && activeAuthLabelValue !== selectedAuthLabelValue;
	const fallbackValue = fallbackState.active ? `${activeModelLabel}${showFallbackAuth ? ` · 🔑 ${activeAuthLabelValue}` : ""} (${fallbackState.reason ?? "selected model unavailable"})` : null;
	const fallbackLine = fallbackValue ? `↪️ Fallback: ${fallbackValue}` : null;
	const commit = resolveCommitHash({ moduleUrl: import.meta.url });
	const versionLine = `🦞 OpenClaw ${VERSION}${commit ? ` (${commit})` : ""}`;
	const tokensValue = formatTokensPairValue(inputTokens, outputTokens);
	const usagePair = tokensValue ? `🧮 Tokens: ${tokensValue}` : null;
	const cacheValue = formatCacheHitValue(inputTokens, cacheRead, cacheWrite);
	const cacheLine = cacheValue ? `🗄️ Cache: ${cacheValue}` : null;
	const costLine = costLabel ? `💵 Cost: ${costLabel}` : null;
	const queueHasSignal = (args.queue?.depth ?? 0) > 0 || args.queue?.showDetails === true;
	const compactionCount = entry?.compactionCount ?? 0;
	const contextPct = typeof totalTokens === "number" && totalTokens > 0 && contextTokens > 0 ? Math.min(999, Math.round(totalTokens / contextTokens * 100)) : null;
	const contextMeter = contextPct !== null ? (() => {
		const filled = Math.min(10, Math.max(0, Math.round(contextPct / 10)));
		return `${"▰".repeat(filled)}${"▱".repeat(10 - filled)} `;
	})() : "";
	const mediaLine = formatMediaUnderstandingLine(args.mediaDecisions);
	const voiceLine = formatVoiceModeLine(args.config, args.sessionEntry, args.agentId);
	const text = [
		[
			versionLine,
			timeLine,
			uptimeLine
		],
		[
			...modelLines,
			selectedAuthLabelValue ? `🔑 Auth: ${selectedAuthLabelValue}` : null,
			configuredFallbacksLine,
			fallbackLine
		],
		[
			usagePair,
			costLine,
			cacheLine,
			`📚 Context: ${contextUsageLabel}`,
			compactionCount > 0 ? `🧹 Compactions: ${compactionCount}` : null,
			mediaLine,
			args.usageLine
		],
		[
			`🧵 Session: ${sessionValue}`,
			args.subagentsLine,
			args.taskLine
		],
		[
			`⚙️ Execution: ${execution.label}`,
			`🤖 Runtime: ${agentRuntimeLabel}`,
			modesValue ? `🎛️ Modes: ${modesValue}` : null,
			groupActivationValue ? `👥 Activation: ${groupActivationValue}` : null,
			`🪢 Queue: ${queueMode}${queueHasSignal ? queueDetails : ""}`
		],
		[
			args.channelFeatureLine,
			args.pluginHealthLine,
			pluginStatusLine ? `🧩 ${pluginStatusLine}` : null,
			voiceLine
		]
	].map((section) => section.filter((line) => Boolean(line)).join("\n")).filter(Boolean).join("\n\n");
	const statusRows = [];
	const pushStatusRow = (label, value) => {
		const cell = typeof value === "number" ? String(value) : value?.trim() ?? "";
		if (cell) statusRows.push([label, cell]);
	};
	pushStatusRow("🧠 Model", `${selectedModelLabel}${modelNote}${overrideLabel}${liveSwitchNote}`);
	pushStatusRow("🔑 Auth", selectedAuthLabelValue);
	pushStatusRow("🔄 Fallbacks", configuredFallbacks?.join(", "));
	pushStatusRow("↪️ Fallback", fallbackValue);
	pushStatusRow("🧮 Tokens", tokensValue);
	pushStatusRow("💵 Cost", costLabel);
	pushStatusRow("🗄️ Cache", cacheValue);
	pushStatusRow("📚 Context", `${contextMeter}${contextUsageLabel}`);
	pushStatusRow("🧹 Compactions", compactionCount > 0 ? compactionCount : null);
	pushStatusRow("🧵 Session", sessionValue);
	pushStatusRow("⚙️ Execution", execution.label);
	pushStatusRow("Runtime", agentRuntimeLabel);
	pushStatusRow("🎛️ Modes", modesValue);
	pushStatusRow("👥 Activation", groupActivationValue);
	pushStatusRow("🪢 Queue", queueHasSignal ? `${queueMode}${queueDetails}` : queueMode);
	const contextBlock = (value) => value?.trim() ? [{
		type: "context",
		text: value
	}] : [];
	const clockUptimeValue = [cronNow ? `${cronNow.formattedTime} (${cronNow.userTimezone})` : args.timeLine, args.uptimeValue ? `⏱️ ${args.uptimeValue}` : null].filter(Boolean).join(" · ");
	const contextPressureLine = contextPct !== null && contextPct >= 80 ? `⚠️ Context ${contextPct}% full` : null;
	return {
		text,
		presentation: {
			title: versionLine,
			blocks: [
				...contextBlock(clockUptimeValue),
				{
					type: "table",
					caption: "Session status",
					headers: ["Item", "Value"],
					rows: statusRows,
					rowHeaderColumnIndex: 0
				},
				...contextPressureLine ? [{
					type: "text",
					text: contextPressureLine
				}] : [],
				...contextBlock(mediaLine),
				...contextBlock(args.usageLine),
				...contextBlock(args.subagentsLine),
				...contextBlock(args.taskLine),
				...contextBlock(args.pluginHealthLine),
				...contextBlock(pluginStatusLine ? `🧩 ${pluginStatusLine}` : null),
				...contextBlock(voiceLine)
			]
		}
	};
}
//#endregion
export { buildStatusMessageParts as n, formatContextUsageShort as r, buildStatusMessage as t };
