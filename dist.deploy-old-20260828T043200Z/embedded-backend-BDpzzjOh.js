import { i as waitForAbortSignal } from "./abort-signal-D2k14JsD.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { i as agentSessionKeysMatchByRequestKey } from "./session-key-Dbce_H9p.js";
import { g as registerConfigWriteListener, n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as buildAllowedModelSet, r as buildConfiguredModelCatalog } from "./model-selection-shared-I5TmV9jL.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { i as logWarn, r as logInfo } from "./logger-D4iLuGk3.js";
import { u as onAgentEvent } from "./agent-events-CcZImb5w.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import "./config-B2bSneS2.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import "./message-channel-BZwx7FCw.js";
import { xt as applySessionPatchProjection } from "./session-accessor-B-FKZX9M.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-DCSDDfZL.js";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C2lazUOH.js";
import { G as setEmbeddedPluginApprovalBroker, U as EmbeddedPluginApprovalBroker, W as clearEmbeddedPluginApprovalBroker, q as setEmbeddedMode } from "./agent-tools.before-tool-call-DoS1-Lb6.js";
import { t as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-7tauRyL1.js";
import { d as refreshPreparedModelRuntimeSnapshots } from "./prepared-model-runtime-afzKiwqZ.js";
import "./model-selection-DHDS-v4K.js";
import { n as resolveThinkingDefault } from "./model-thinking-default-Bs5EBLjZ.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome, s as isDefinitiveRunLifecycle, t as AGENT_RUN_TERMINAL_RETRY_GRACE_MS } from "./agent-run-terminal-outcome-DafVNgmX.js";
import { i as resolveTextCommand } from "./commands-registry-normalize-BiPnveAs.js";
import { g as resolveActiveEmbeddedRunSessionId } from "./run-state-CmAt4u6E.js";
import { v as queueEmbeddedAgentMessageWithOutcomeAsync } from "./runs-DpT-JSmi.js";
import { i as parseGoalCommand, t as executeSessionGoalCommand } from "./commands-goal-Crbaa5Bn.js";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-BLySVFXs.js";
import { A as resolveEffectiveChatHistoryMaxChars, g as capArrayByJsonBytes } from "./session-transcript-readers-CgCxlOAj.js";
import { n as resolveSessionModelRef } from "./session-model-ref-BtF53_Cz.js";
import { t as getSessionDefaults } from "./session-utils-model-jI_nhKzG.js";
import { i as buildGatewaySessionInfo, r as listSessionsFromStoreAsync } from "./session-utils-list-Bb0Qg6y4.js";
import { t as ensureContextWindowCacheLoaded } from "./context-Bj-w-uhp.js";
import { f as resolveGatewaySessionStoreTargetWithStore, i as loadGatewaySessionEntryReadOnly, n as listAgentsForGateway, o as resolveCanonicalGatewaySessionStoreKey, r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import { C as buildCollectPrompt, O as previewQueueSummaryPrompt, j as waitForQueueDebounce, t as resolveQueueSettingsCore, x as applyQueueDropPolicy } from "./settings-Cpt08fNP.js";
import "./session-utils-BTR52tOf.js";
import { r as readToolValidationErrorSummary } from "./tool-error-summary-Bw_A4yhp.js";
import "./commands-registry-DmQwXgfM.js";
import { a as isChatStopCommandText } from "./chat-abort-BpfXA9KF.js";
import { c as projectLiveAssistantBufferedText, d as shouldSuppressAssistantEventForLiveChat, l as resolveAssistantLiveChatInput, s as normalizeLiveAssistantBufferedText, u as resolveMergedAssistantText } from "./server-chat-state-BuGrMjm1.js";
import { t as createDefaultDeps } from "./deps-BpqcLmo3.js";
import { c as getMaxChatHistoryMessagesBytes } from "./server-constants-DKuFNbQH.js";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-Bkfphvb1.js";
import { r as agentCommandFromIngress } from "./agent-command-6lP6pUAw.js";
import { s as performGatewaySessionReset } from "./session-reset-service-DWeu0DWn.js";
import { s as isAgentLifecycleYieldedWaiting } from "./session-event-payload-Cf_KowSS.js";
import { c as replaceOversizedChatHistoryMessages, i as readChatHistoryPage, r as enrichChatHistoryCompactionMarkers, s as CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES } from "./chat-C9Dr0d5-.js";
import { n as createGatewaySession } from "./session-create-service-CjNljuQX.js";
import { t as projectSessionsPatchEntry } from "./sessions-patch-dmrJnDzC.js";
import { t as resolveLocalRunShutdownGraceMs } from "./local-run-shutdown-CGxQk6FN.js";
import { u as formatTuiErrorMessage } from "./tui-formatters-B-SSk8AU.js";
import { randomUUID } from "node:crypto";
//#region src/tui/embedded-prepared-runtime.ts
var EmbeddedPreparedModelRuntimeHost = class {
	constructor() {
		this.ready = Promise.resolve();
	}
	publish(config) {
		this.ready = refreshPreparedModelRuntimeSnapshots(config, { catalogMode: "static" });
	}
	async waitUntilReady() {
		for (;;) {
			const ready = this.ready;
			await ready;
			if (ready === this.ready) return;
		}
	}
};
//#endregion
//#region src/tui/embedded-backend.ts
const TUI_STATE_BY_TERMINAL_CLASSIFICATION = {
	success: void 0,
	timeout: "error",
	cancellation: "aborted",
	failure: "error"
};
const silentRuntime = {
	log: (..._args) => void 0,
	error: (..._args) => void 0,
	exit: (code) => {
		throw new Error(`embedded tui runtime exit ${String(code)}`);
	}
};
const embeddedSessionStartupMigrationLog = {
	info: (message) => logInfo(message, silentRuntime),
	warn: (message) => logWarn(message, silentRuntime)
};
function hasProviderWildcardModelAllowlist(cfg) {
	return [cfg.agents?.defaults?.models, ...listAgentEntries(cfg).map((agent) => agent.models)].some((models) => Object.keys(models ?? {}).some((key) => key.trim().endsWith("/*")));
}
function resolveConfiguredReplaceModeCatalog(cfg) {
	if (cfg.models?.mode !== "replace") return;
	if (hasProviderWildcardModelAllowlist(cfg)) return;
	return buildConfiguredModelCatalog({ cfg });
}
function shouldLoadFullGatewayCatalogForReplaceMode(cfg) {
	return cfg.models?.mode === "replace" && hasProviderWildcardModelAllowlist(cfg);
}
function ensureEmbeddedHistoryRuntimePluginsLoaded(params) {
	try {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.sessionAgentId);
		const registry = loadAgentRuntimePluginRegistryHandle({
			config: params.cfg,
			workspaceDir
		});
		return {
			status: "warmed",
			...registry ? { registry } : {}
		};
	} catch (err) {
		return {
			status: "failed",
			error: formatTuiErrorMessage(err)
		};
	}
}
async function loadEmbeddedTuiModelCatalog(cfg) {
	const configuredCatalog = resolveConfiguredReplaceModeCatalog(cfg);
	if (configuredCatalog !== void 0) return configuredCatalog;
	return await loadGatewayModelCatalog(shouldLoadFullGatewayCatalogForReplaceMode(cfg) ? { readOnly: false } : void 0);
}
function resolveBtwQuestion(message) {
	const question = /^\/(?:btw|side)(?::|\s)+(.*)$/i.exec(message.trim())?.[1]?.trim();
	return question ? question : void 0;
}
function buildLocalQueuedPrompt(queue) {
	return [previewQueueSummaryPrompt({
		state: queue,
		noun: "message"
	}), queue.mode === "collect" && queue.messages.length > 1 ? buildCollectPrompt({
		title: "[Queued messages while agent was busy]",
		items: queue.messages,
		renderItem: (message, index) => `---\nQueued #${index + 1}\n${message}`
	}) : queue.messages[0] ?? ""].filter(Boolean).join("\n\n");
}
function payloadText(parts) {
	if (!Array.isArray(parts)) return "";
	return parts.map((part) => {
		if (!part || typeof part !== "object") return "";
		const payload = part;
		return typeof payload.text === "string" ? payload.text.trim() : "";
	}).filter(Boolean).join("\n\n").trim();
}
function assistantChatMessage(text) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text
		}],
		timestamp: Date.now()
	};
}
function timeoutSecondsFromMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs) || timeoutMs < 0) return;
	return String(Math.max(0, Math.ceil(timeoutMs / 1e3)));
}
function resolveDeltaPayload(text, previousText) {
	if (previousText === void 0) return { deltaText: text };
	if (!text.startsWith(previousText)) return {
		deltaText: text,
		replace: true
	};
	return { deltaText: text.slice(previousText.length) };
}
function createQueuedRunReadiness() {
	let markReady;
	return {
		promise: new Promise((ready) => {
			markReady = ready;
		}),
		markReady
	};
}
async function waitForLocalRunShutdown(promises) {
	if (promises.length === 0) return true;
	const timeoutMs = resolveLocalRunShutdownGraceMs();
	if (timeoutMs <= 0) return false;
	let timeout;
	let completed = false;
	await Promise.race([Promise.allSettled(promises).then(() => {
		completed = true;
	}), new Promise((resolve) => {
		timeout = setTimeout(resolve, timeoutMs);
		timeout.unref?.();
	})]);
	if (timeout) clearTimeout(timeout);
	return completed;
}
async function waitForQueuedLocalRun(previousRun, runId) {
	await previousRun.run.queuedRunReady;
	if (previousRun.run.controller.signal.aborted && previousRun.run.queuedAfter) return await waitForQueuedLocalRun(previousRun.run.queuedAfter, runId);
	if (!previousRun.run.finishing && !previousRun.run.lifecycleEnded) {
		await previousRun.promise;
		return;
	}
	const timeoutMs = resolveLocalRunShutdownGraceMs();
	if (timeoutMs <= 0) throw new Error(`timed out waiting for previous local run to finish post-turn maintenance for ${runId}`);
	let timeout;
	try {
		await Promise.race([previousRun.promise, new Promise((_, reject) => {
			timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`timed out waiting for previous local run to finish post-turn maintenance for ${runId}`));
			}, timeoutMs);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
var EmbeddedTuiBackend = class {
	constructor() {
		this.connection = { url: "local embedded" };
		this.deps = createDefaultDeps();
		this.runs = /* @__PURE__ */ new Map();
		this.runPromises = /* @__PURE__ */ new Map();
		this.seq = 0;
		this.pendingLifecycleErrors = /* @__PURE__ */ new Map();
		this.pluginApprovalBroker = new EmbeddedPluginApprovalBroker();
		this.preparedModelRuntime = new EmbeddedPreparedModelRuntimeHost();
		this.ready = Promise.resolve();
	}
	withRuntimePluginRegistry(run) {
		return withPluginRuntimeRegistryScope(this.runtimePluginRegistry, run);
	}
	start() {
		if (this.unsubscribe) return;
		setEmbeddedMode(true);
		ensureContextWindowCacheLoaded();
		this.previousRuntimeLog = defaultRuntime.log;
		this.previousRuntimeError = defaultRuntime.error;
		defaultRuntime.log = silentRuntime.log;
		defaultRuntime.error = silentRuntime.error;
		this.unsubscribe = onAgentEvent((evt) => this.handleAgentEvent(evt));
		setEmbeddedPluginApprovalBroker(this.pluginApprovalBroker);
		this.unsubscribePluginApprovals = this.pluginApprovalBroker.subscribe((event) => {
			this.emit(event.event, event.payload);
		});
		const config = getRuntimeConfig();
		this.unsubscribeConfigWrites = registerConfigWriteListener((event) => {
			this.preparedModelRuntime.publish(event.runtimeConfig);
		});
		this.preparedModelRuntime.publish(config);
		this.ready = (async () => {
			const { runSessionStartupMigration } = await import("./startup-migration-uzhQE5b9.js");
			await runSessionStartupMigration({
				cfg: config,
				env: process.env,
				log: embeddedSessionStartupMigrationLog
			});
		})();
		queueMicrotask(() => {
			this.onConnected?.();
		});
	}
	async stop() {
		this.unsubscribeConfigWrites?.();
		this.unsubscribeConfigWrites = void 0;
		clearEmbeddedPluginApprovalBroker(this.pluginApprovalBroker);
		this.unsubscribePluginApprovals?.();
		this.unsubscribePluginApprovals = void 0;
		const maintenancePromises = [];
		for (const [runId, run] of this.runs) {
			if (run.finishing || run.lifecycleEnded) {
				const promise = this.runPromises.get(runId);
				if (promise) maintenancePromises.push(promise);
				continue;
			}
			run.controller.abort();
		}
		this.pluginApprovalBroker.stop();
		if (!await waitForLocalRunShutdown(maintenancePromises)) {
			for (const run of this.runs.values()) if (run.finishing || run.lifecycleEnded) run.controller.abort();
		}
		this.unsubscribe?.();
		this.unsubscribe = void 0;
		this.pendingLifecycleErrors.forEach(clearTimeout);
		this.pendingLifecycleErrors.clear();
		for (const run of this.runs.values()) run.controller.abort();
		this.runs.clear();
		this.runPromises.clear();
		defaultRuntime.log = this.previousRuntimeLog ?? defaultRuntime.log;
		defaultRuntime.error = this.previousRuntimeError ?? defaultRuntime.error;
		this.previousRuntimeLog = void 0;
		this.previousRuntimeError = void 0;
		setEmbeddedMode(false);
	}
	async sendChat(opts) {
		await this.ready;
		await this.preparedModelRuntime.waitUntilReady();
		const runId = opts.runId ?? randomUUID();
		const question = resolveBtwQuestion(opts.message);
		const isQueueCommand = resolveTextCommand(opts.message)?.command.key === "queue";
		const agentId = resolveSessionAgentId({
			sessionKey: opts.sessionKey,
			config: getRuntimeConfig(),
			agentId: opts.agentId
		});
		const runScope = {
			sessionKey: opts.sessionKey,
			agentId
		};
		const stopCommand = this.hasAbortableSessionRun(runScope) && isChatStopCommandText(opts.message);
		const queuedAfter = question || stopCommand || isQueueCommand ? void 0 : this.findQueuedSessionRunPromise(runScope);
		if (stopCommand) {
			this.abortSessionRuns(runScope);
			return { runId };
		}
		let pendingQueue;
		if (queuedAfter) {
			const loadOptions = opts.agentId ? { agentId: opts.agentId } : void 0;
			const { cfg, canonicalKey, entry } = loadGatewaySessionEntry(opts.sessionKey, loadOptions);
			let queueSettings = resolveQueueSettingsCore({
				cfg,
				channel: INTERNAL_MESSAGE_CHANNEL,
				sessionEntry: entry
			});
			if (queueSettings.mode === "steer") {
				const activeSessionId = resolveActiveEmbeddedRunSessionId(canonicalKey);
				if (activeSessionId) {
					if ((await queueEmbeddedAgentMessageWithOutcomeAsync(activeSessionId, opts.message, {
						steeringMode: "all",
						debounceMs: queueSettings.debounceMs ?? 500,
						isInboundUserMessage: true
					}).catch(() => void 0))?.queued) return { runId: queuedAfter.runId };
				}
				queueSettings = {
					...queueSettings,
					mode: "followup"
				};
			}
			if (queueSettings.mode === "interrupt") this.abortSessionRuns(runScope);
			else {
				const queued = this.enqueuePendingLocalMessage({
					runScope,
					message: opts.message,
					settings: queueSettings,
					fallbackRunId: queuedAfter.runId
				});
				if (queued.kind === "handled") return { runId: queued.runId };
				pendingQueue = queued.queue;
			}
		}
		const controller = new AbortController();
		const queuedRunReadiness = createQueuedRunReadiness();
		this.runs.set(runId, {
			sessionKey: opts.sessionKey,
			agentId,
			controller,
			buffer: "",
			isBtw: Boolean(question),
			question,
			finishing: false,
			lifecycleEnded: false,
			registered: false,
			...pendingQueue ? { pendingQueue } : {},
			...queuedAfter ? { queuedAfter } : {},
			queuedRunReady: queuedRunReadiness.promise,
			markQueuedRunReady: queuedRunReadiness.markReady
		});
		const runPromise = this.runTurn({
			runId,
			sessionKey: opts.sessionKey,
			agentId: opts.agentId,
			message: opts.message,
			thinking: opts.thinking,
			deliver: opts.deliver,
			timeoutMs: opts.timeoutMs,
			controller,
			queuedAfter
		});
		this.runPromises.set(runId, runPromise);
		runPromise.finally(() => {
			this.runPromises.delete(runId);
		});
		if (isQueueCommand) await runPromise;
		return { runId };
	}
	async abortChat(opts) {
		if (!opts.runId) {
			let aborted = false;
			const runIds = [];
			for (const [runId, run] of this.runs) {
				if (run.isBtw) continue;
				if (run.sessionKey !== opts.sessionKey) continue;
				if (opts.sessionKey === "global") {
					const defaultAgentId = resolveDefaultAgentId(getRuntimeConfig());
					const requestedAgentId = opts.agentId ? normalizeAgentId(opts.agentId) : defaultAgentId;
					if ((run.agentId ? normalizeAgentId(run.agentId) : defaultAgentId) !== requestedAgentId) continue;
				}
				if (!this.isAbortableRun(runId, run)) continue;
				run.controller.abort();
				aborted = true;
				runIds.push(runId);
			}
			return {
				ok: true,
				aborted,
				runIds
			};
		}
		const run = this.runs.get(opts.runId);
		if (!run || run.sessionKey !== opts.sessionKey) return {
			ok: true,
			aborted: false,
			runIds: []
		};
		if (opts.sessionKey === "global") {
			const defaultAgentId = resolveDefaultAgentId(getRuntimeConfig());
			const requestedAgentId = opts.agentId ? normalizeAgentId(opts.agentId) : defaultAgentId;
			if ((run.agentId ? normalizeAgentId(run.agentId) : defaultAgentId) !== requestedAgentId) return {
				ok: true,
				aborted: false,
				runIds: []
			};
		}
		if (!this.isAbortableRun(opts.runId, run)) return {
			ok: true,
			aborted: false,
			runIds: []
		};
		run.controller.abort();
		return {
			ok: true,
			aborted: true,
			runIds: [opts.runId]
		};
	}
	async loadHistory(opts) {
		await this.ready;
		const loadOptions = opts.agentId ? { agentId: opts.agentId } : void 0;
		const { cfg, storePath, store, entry, canonicalKey } = loadGatewaySessionEntryReadOnly(opts.sessionKey, {
			...loadOptions,
			includeStoreChildEntries: true
		});
		const sessionId = entry?.sessionId;
		const sessionAgentId = resolveSessionAgentId({
			sessionKey: opts.sessionKey,
			config: cfg,
			agentId: opts.agentId
		});
		const runtimePluginsPrewarm = ensureEmbeddedHistoryRuntimePluginsLoaded({
			cfg,
			sessionAgentId
		});
		this.runtimePluginRegistry = runtimePluginsPrewarm.status === "warmed" ? runtimePluginsPrewarm.registry : void 0;
		const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
		const max = Math.min(CHAT_HISTORY_MAX_ENTRIES, typeof opts.limit === "number" ? opts.limit : 200);
		const maxHistoryBytes = getMaxChatHistoryMessagesBytes();
		const effectiveMaxChars = resolveEffectiveChatHistoryMaxChars(cfg);
		const messages = capArrayByJsonBytes(replaceOversizedChatHistoryMessages({
			messages: enrichChatHistoryCompactionMarkers((await readChatHistoryPage({
				entry,
				provider: resolvedSessionModel.provider,
				sessionId,
				storePath,
				sessionAgentId,
				canonicalKey,
				max,
				maxHistoryBytes,
				effectiveMaxChars,
				offset: void 0,
				messageId: void 0
			})).messages, entry),
			maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, maxHistoryBytes)
		}).messages, maxHistoryBytes).items;
		const newestInFlightRun = [...this.runs.entries()].findLast(([, run]) => !run.isBtw && run.terminalState !== "final" && agentSessionKeysMatchByRequestKey(run.sessionKey, opts.sessionKey) && normalizeAgentId(run.agentId) === normalizeAgentId(sessionAgentId));
		const inFlightRun = newestInFlightRun ? {
			runId: newestInFlightRun[0],
			text: projectLiveAssistantBufferedText(normalizeLiveAssistantBufferedText(newestInFlightRun[1].buffer).trim(), { suppressLeadFragments: true }).text.trim()
		} : void 0;
		let thinkingLevel = entry?.thinkingLevel;
		if (!thinkingLevel) {
			const catalog = await this.withRuntimePluginRegistry(() => loadEmbeddedTuiModelCatalog(cfg));
			thinkingLevel = resolveThinkingDefault({
				cfg,
				provider: resolvedSessionModel.provider,
				model: resolvedSessionModel.model,
				catalog
			});
		}
		const defaults = getSessionDefaults(cfg, void 0, { allowPluginNormalization: false });
		const sessionInfo = buildGatewaySessionInfo({
			cfg,
			storePath,
			store,
			key: canonicalKey,
			entry,
			agentId: opts.agentId
		});
		sessionInfo.thinkingLevel = thinkingLevel;
		sessionInfo.verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
		return {
			sessionKey: opts.sessionKey,
			sessionId,
			messages,
			defaults,
			sessionInfo,
			thinkingLevel,
			fastMode: entry?.fastMode,
			verboseLevel: sessionInfo.verboseLevel,
			runtimePluginsPrewarm: runtimePluginsPrewarm.status === "warmed" ? { status: "warmed" } : runtimePluginsPrewarm,
			...inFlightRun ? { inFlightRun } : {}
		};
	}
	async listSessions(opts) {
		await this.ready;
		const cfg = getRuntimeConfig();
		const { storePath, store } = loadCombinedSessionStoreForGatewayCore(cfg, {
			agentId: opts?.agentId,
			projection: "list"
		});
		return await listSessionsFromStoreAsync({
			cfg,
			storePath,
			store,
			opts: opts ?? {}
		});
	}
	async listAgents() {
		return listAgentsForGateway(getRuntimeConfig());
	}
	async patchSession(opts) {
		await this.ready;
		const cfg = getRuntimeConfig();
		const target = resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: opts.key,
			agentId: opts.agentId,
			exactRead: true
		});
		const applied = await applySessionPatchProjection({
			...opts.label === void 0 ? { sessionKeys: target.storeKeys } : {},
			storePath: target.storePath,
			resolveTarget: ({ store }) => {
				const { target: migratedTarget, primaryKey } = resolveCanonicalGatewaySessionStoreKey({
					cfg,
					key: opts.key,
					store,
					agentId: opts.agentId
				});
				return {
					primaryKey,
					candidateKeys: migratedTarget.storeKeys
				};
			},
			project: async ({ primaryKey, existingEntry, isLabelInUse }) => await projectSessionsPatchEntry({
				cfg,
				existingEntry,
				isLabelInUse,
				storeKey: primaryKey,
				agentId: opts.agentId,
				patch: opts,
				loadGatewayModelCatalog: () => this.withRuntimePluginRegistry(() => loadEmbeddedTuiModelCatalog(cfg))
			})
		});
		if (!applied.ok) throw new Error(applied.error.message);
		const agentId = resolveSessionAgentId({
			sessionKey: target.canonicalKey ?? opts.key,
			config: cfg,
			agentId: opts.agentId
		});
		const resolved = resolveSessionModelRef(cfg, applied.entry, agentId);
		return {
			ok: true,
			path: target.storePath,
			key: target.canonicalKey ?? opts.key,
			entry: { ...applied.entry },
			resolved: {
				modelProvider: resolved.provider,
				model: resolved.model
			}
		};
	}
	async resetSession(key, reason, opts) {
		await this.ready;
		if (loadGatewaySessionEntryReadOnly(key, opts).entry?.incognito === true) throw new Error("Incognito sessions cannot reset in place.");
		const result = await performGatewaySessionReset({
			key,
			operatorRoleActor: { kind: "system" },
			...opts?.agentId ? { agentId: opts.agentId } : {},
			reason: reason === "new" ? "new" : "reset",
			commandSource: "tui:embedded",
			armSessionDiffBaselineCapture: true
		});
		if (!result.ok) throw new Error(result.error.message);
		if ("incognitoDeleted" in result) return {
			ok: true,
			key: result.key,
			deleted: true
		};
		return {
			ok: true,
			key: result.key,
			entry: result.entry,
			resolved: result.resolved
		};
	}
	async createSession(opts) {
		await this.ready;
		const cfg = getRuntimeConfig();
		const result = await createGatewaySession({
			cfg,
			operatorRoleActor: { kind: "system" },
			...opts,
			creation: {
				via: "operator",
				actor: { type: "human" }
			},
			armSessionDiffBaselineCapture: true,
			emitCommandHooks: Boolean(opts.parentSessionKey),
			commandSource: "tui:embedded",
			loadGatewayModelCatalog: () => this.withRuntimePluginRegistry(() => loadEmbeddedTuiModelCatalog(cfg))
		});
		if (!result.ok) throw new Error(result.error.message);
		return {
			ok: true,
			key: result.key,
			entry: result.entry,
			resolved: result.resolved
		};
	}
	async runBtwTurn(params) {
		const loadOptions = params.agentId ? { agentId: params.agentId } : void 0;
		const { cfg, canonicalKey, storePath, store, entry } = loadGatewaySessionEntry(params.sessionKey, loadOptions);
		if (!entry?.sessionId) throw new Error("/btw requires an active session with existing context.");
		const sessionAgentId = resolveSessionAgentId({
			sessionKey: canonicalKey,
			config: cfg,
			agentId: params.agentId
		});
		const resolvedModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
		const timeoutSeconds = timeoutSecondsFromMs(params.timeoutMs);
		const { runBtwSideQuestion } = await import("./btw-B4cc-IAf.js");
		const reply = await runBtwSideQuestion({
			cfg,
			agentDir: resolveAgentDir(cfg, sessionAgentId),
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			question: params.question,
			sessionEntry: entry,
			sessionStore: store,
			sessionKey: canonicalKey,
			storePath,
			resolvedThinkLevel: "off",
			resolvedReasoningLevel: "off",
			opts: {
				runId: params.runId,
				abortSignal: params.controller.signal,
				...timeoutSeconds !== void 0 ? { timeoutOverrideSeconds: Number(timeoutSeconds) } : {}
			},
			isNewSession: false,
			messageChannel: INTERNAL_MESSAGE_CHANNEL,
			messageProvider: INTERNAL_MESSAGE_CHANNEL,
			currentChannelId: INTERNAL_MESSAGE_CHANNEL
		});
		const text = reply?.text?.trim() ?? "";
		if (!text) throw new Error("/btw produced no answer.");
		return {
			sessionKey: canonicalKey,
			text,
			isError: reply?.isError === true
		};
	}
	async getGatewayStatus() {
		return `local embedded mode${this.runs.size > 0 ? ` (${String(this.runs.size)} active run${this.runs.size === 1 ? "" : "s"})` : ""}`;
	}
	async listPluginApprovals() {
		return this.pluginApprovalBroker.listPending();
	}
	async resolvePluginApproval(id, decision) {
		return { ok: this.pluginApprovalBroker.resolve(id, decision) };
	}
	async listModels(opts) {
		const cfg = getRuntimeConfig();
		const { allowedCatalog } = buildAllowedModelSet({
			cfg,
			catalog: await this.withRuntimePluginRegistry(() => loadEmbeddedTuiModelCatalog(cfg)),
			defaultProvider: DEFAULT_PROVIDER,
			agentId: opts?.agentId
		});
		return allowedCatalog.map((entry) => ({
			id: entry.id,
			name: entry.name ?? entry.id,
			provider: entry.provider,
			contextWindow: entry.contextWindow,
			reasoning: entry.reasoning
		}));
	}
	async runGoalCommand(opts) {
		await this.ready;
		const loadOptions = opts.agentId ? { agentId: opts.agentId } : void 0;
		const { canonicalKey, storePath, entry } = loadGatewaySessionEntry(opts.sessionKey, loadOptions);
		const sessionKey = canonicalKey ?? opts.sessionKey;
		const parsed = parseGoalCommand(opts.command.trim());
		if (!parsed) throw new Error("invalid goal command");
		const result = await executeSessionGoalCommand({
			parsed,
			sessionKey,
			storePath,
			fallbackEntry: entry ?? {
				sessionId: randomUUID(),
				updatedAt: Date.now()
			},
			agentId: opts.agentId
		});
		return result.continuationPrompt ? {
			text: result.text,
			continuationPrompt: result.continuationPrompt
		} : { text: result.text };
	}
	async runUsageCostCommand(opts) {
		await this.ready;
		const { cfg, canonicalKey, storePath, entry } = loadGatewaySessionEntry(opts.sessionKey, opts.agentId ? { agentId: opts.agentId } : void 0);
		const { formatSessionUsageCostSummary } = await import("./commands-session-cost.runtime.js");
		return { text: await formatSessionUsageCostSummary({
			cfg,
			sessionKey: canonicalKey ?? opts.sessionKey,
			agentId: opts.agentId,
			sessionEntry: entry,
			storePath
		}) };
	}
	enqueuePendingLocalMessage(params) {
		const pendingMessages = this.listPendingLocalMessages(params.runScope);
		const overflowQueue = {
			items: [...pendingMessages],
			cap: params.settings.cap ?? 20,
			dropPolicy: params.settings.dropPolicy ?? "summarize",
			droppedCount: 0,
			summaryLines: []
		};
		if (!applyQueueDropPolicy({
			queue: overflowQueue,
			summarize: (item) => item.message
		})) return {
			kind: "handled",
			runId: params.fallbackRunId
		};
		const retained = new Set(overflowQueue.items);
		const droppedByRun = /* @__PURE__ */ new Map();
		for (const dropped of pendingMessages) {
			if (retained.has(dropped)) continue;
			const indices = droppedByRun.get(dropped.run) ?? [];
			indices.push(dropped.messageIndex);
			droppedByRun.set(dropped.run, indices);
		}
		const inheritedSummaryLines = [];
		for (const [run, indices] of droppedByRun) {
			for (const index of indices.toSorted((a, b) => b - a)) run.pendingQueue?.messages.splice(index, 1);
			if (run.pendingQueue?.messages.length === 0) {
				inheritedSummaryLines.push(...run.pendingQueue.summaryLines);
				overflowQueue.droppedCount += run.pendingQueue.droppedCount;
				run.controller.abort();
			}
		}
		overflowQueue.summaryLines.unshift(...inheritedSummaryLines);
		if (overflowQueue.summaryLines.length > overflowQueue.cap) overflowQueue.summaryLines.splice(0, overflowQueue.summaryLines.length - overflowQueue.cap);
		const enqueuedAt = Date.now();
		for (const run of this.runs.values()) {
			if (!this.isSameRunScope(run, params.runScope) || !run.pendingQueue) continue;
			run.pendingQueue.lastEnqueuedAt = enqueuedAt;
			run.pendingQueue.debounceMs = params.settings.debounceMs ?? 500;
		}
		if (params.settings.mode === "collect") {
			const target = [...this.runs.entries()].findLast(([, run]) => this.isSameRunScope(run, params.runScope) && run.pendingQueue);
			const targetQueue = target?.[1].pendingQueue;
			if (target && targetQueue?.mode === "collect" && !target[1].controller.signal.aborted) {
				const [targetRunId] = target;
				targetQueue.messages.push(params.message);
				targetQueue.dropPolicy = params.settings.dropPolicy ?? "summarize";
				targetQueue.droppedCount += overflowQueue.droppedCount;
				targetQueue.summaryLines.push(...overflowQueue.summaryLines);
				return {
					kind: "handled",
					runId: targetRunId
				};
			}
		}
		return {
			kind: "enqueue",
			queue: {
				mode: params.settings.mode === "collect" ? "collect" : "followup",
				messages: [params.message],
				debounceMs: params.settings.debounceMs ?? 500,
				lastEnqueuedAt: enqueuedAt,
				dropPolicy: params.settings.dropPolicy ?? "summarize",
				droppedCount: overflowQueue.droppedCount,
				summaryLines: overflowQueue.summaryLines
			}
		};
	}
	listPendingLocalMessages(params) {
		const pending = [];
		for (const run of this.runs.values()) {
			if (!this.isSameRunScope(run, params) || !run.pendingQueue) continue;
			run.pendingQueue.messages.forEach((message, messageIndex) => {
				pending.push({
					run,
					messageIndex,
					message
				});
			});
		}
		return pending;
	}
	findQueuedSessionRunPromise(params) {
		let queuedAfter;
		for (const [runId, run] of this.runs) if (this.isSameRunScope(run, params) && !run.isBtw) {
			const promise = this.runPromises.get(runId);
			if (promise) queuedAfter = {
				runId,
				run,
				promise
			};
		}
		return queuedAfter;
	}
	abortSessionRuns(params) {
		for (const [runId, run] of this.runs) if (this.isSameRunScope(run, params) && !run.isBtw && this.isAbortableRun(runId, run)) run.controller.abort();
	}
	hasAbortableSessionRun(params) {
		for (const [runId, run] of this.runs) if (this.isSameRunScope(run, params) && !run.isBtw && this.isAbortableRun(runId, run)) return true;
		return false;
	}
	isSameRunScope(run, params) {
		return run.sessionKey === params.sessionKey && (params.sessionKey !== "global" || run.agentId === params.agentId);
	}
	isAbortableRun(runId, run) {
		return !run.lifecycleEnded || this.runPromises.has(runId);
	}
	emit(event, payload) {
		this.onEvent?.({
			event,
			payload,
			seq: ++this.seq
		});
	}
	clearPendingLifecycleError(runId) {
		clearTimeout(this.pendingLifecycleErrors.get(runId));
		this.pendingLifecycleErrors.delete(runId);
	}
	scheduleChatError(runId, run, errorMessage) {
		this.clearPendingLifecycleError(runId);
		const timer = setTimeout(() => {
			this.pendingLifecycleErrors.delete(runId);
			this.emitChatTerminal(runId, run, "error", errorMessage, "provisional");
		}, AGENT_RUN_TERMINAL_RETRY_GRACE_MS);
		timer.unref?.();
		this.pendingLifecycleErrors.set(runId, timer);
	}
	emitChatDelta(runId, run) {
		const projected = projectLiveAssistantBufferedText(normalizeLiveAssistantBufferedText(run.buffer).trim(), { suppressLeadFragments: true });
		const text = projected.text.trim();
		if (!text || projected.suppress) return;
		const deltaPayload = resolveDeltaPayload(text, run.lastBroadcastText);
		if (!deltaPayload.deltaText && !deltaPayload.replace) return;
		run.registered = true;
		run.lastBroadcastText = text;
		this.emit("chat", {
			runId,
			sessionKey: run.sessionKey,
			agentId: run.agentId,
			state: "delta",
			...deltaPayload,
			message: assistantChatMessage(text)
		});
	}
	emitChatTerminal(runId, run, state, detail, terminalState = "final") {
		this.clearPendingLifecycleError(runId);
		if (run.terminalState === "final" || run.terminalState === terminalState) return;
		run.terminalState = terminalState;
		if (terminalState === "final") {
			run.markQueuedRunReady();
			run.finishing = false;
			run.lifecycleEnded = true;
		}
		run.registered = true;
		run.lastBroadcastText = void 0;
		const projected = projectLiveAssistantBufferedText(normalizeLiveAssistantBufferedText(run.buffer).trim(), { suppressLeadFragments: false });
		const text = state === "final" && !projected.suppress ? projected.text.trim() : "";
		this.emit("chat", {
			runId,
			sessionKey: run.sessionKey,
			agentId: run.agentId,
			state,
			...state === "final" && detail ? { stopReason: detail } : {},
			...state === "final" && run.lifecycleYielded ? { yielded: true } : {},
			...text ? { message: assistantChatMessage(text) } : {},
			...state !== "final" && (detail || state === "aborted" && run.toolErrorSummary) ? { errorMessage: formatTuiErrorMessage(detail ?? run.toolErrorSummary) } : {}
		});
	}
	projectTerminalOutcome(runId, run, metadata, options = {}) {
		const terminalError = metadata.error && typeof metadata.error === "object" && "message" in metadata.error ? metadata.error.message : metadata.error;
		const outcome = options.terminalOutcome ?? buildAgentRunTerminalOutcomeFromLifecycleEvent({
			phase: metadata.phase === "error" || terminalError ? "error" : "end",
			data: {
				...metadata,
				error: terminalError ? formatTuiErrorMessage(terminalError) : void 0
			},
			abortSignal: run.controller.signal
		});
		const state = TUI_STATE_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(outcome)];
		if (!state) return false;
		const diagnostic = state === "aborted" ? readToolValidationErrorSummary(metadata.toolErrorSummary) : outcome.reason === "failed" && options.visibleText || outcome.error || (outcome.status === "timeout" ? "The provider timed out. Please try again." : "Agent run failed.");
		if (metadata.phase === "error" && !isDefinitiveRunLifecycle({
			phase: "error",
			data: metadata
		})) this.scheduleChatError(runId, run, diagnostic);
		else this.emitChatTerminal(runId, run, state, diagnostic);
		return true;
	}
	ensureRunRegistered(runId, run) {
		if (run.registered || run.isBtw) return;
		run.registered = true;
		run.lastBroadcastText = "";
		this.emit("chat", {
			runId,
			sessionKey: run.sessionKey,
			agentId: run.agentId,
			state: "delta",
			deltaText: "",
			message: assistantChatMessage("")
		});
	}
	handleAgentEvent(evt) {
		const run = this.runs.get(evt.runId);
		if (!run) return;
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : "";
		if (evt.stream !== "lifecycle" || lifecyclePhase !== "error") this.clearPendingLifecycleError(evt.runId);
		if (evt.stream !== "assistant") this.ensureRunRegistered(evt.runId, run);
		this.emit("agent", {
			runId: evt.runId,
			sessionKey: run.sessionKey,
			agentId: run.agentId,
			stream: evt.stream,
			data: evt.data
		});
		if (evt.stream === "assistant" || evt.stream === "tool" && evt.data?.phase === "start") run.toolErrorSummary = void 0;
		else if (evt.stream === "tool" && evt.data?.phase === "result") run.toolErrorSummary = readToolValidationErrorSummary(evt.data.toolErrorSummary);
		const assistantLiveChatInput = evt.stream === "assistant" ? resolveAssistantLiveChatInput(evt.data) : void 0;
		if (assistantLiveChatInput && !run.isBtw && !shouldSuppressAssistantEventForLiveChat(evt.data)) {
			run.buffer = resolveMergedAssistantText({
				previousText: run.buffer,
				nextText: assistantLiveChatInput.text,
				nextDelta: assistantLiveChatInput.delta
			});
			this.emitChatDelta(evt.runId, run);
			return;
		}
		if (evt.stream !== "lifecycle") return;
		const phase = lifecyclePhase;
		if (phase === "finishing") {
			run.finishing = true;
			run.markQueuedRunReady();
			run.lifecycleStopReason = typeof evt.data?.stopReason === "string" ? evt.data.stopReason : void 0;
			return;
		}
		if (phase !== "end" && phase !== "error") return;
		run.finishing = false;
		if (phase === "error") run.buffer = "";
		if (this.projectTerminalOutcome(evt.runId, run, evt.data)) return;
		run.lifecycleEnded = true;
		run.markQueuedRunReady();
		run.lifecycleStopReason = typeof evt.data?.stopReason === "string" ? evt.data.stopReason : void 0;
		run.lifecycleYielded = isAgentLifecycleYieldedWaiting(evt.data);
	}
	async runTurn(params) {
		try {
			const recheckPreparedRuntimeAtAdmission = params.queuedAfter !== void 0;
			if (params.queuedAfter) {
				try {
					await Promise.race([waitForQueuedLocalRun(params.queuedAfter, params.runId), waitForAbortSignal(params.controller.signal)]);
				} catch (error) {
					const run = this.runs.get(params.runId);
					if (run) {
						const errorMessage = error instanceof Error ? error.message : String(error);
						this.emitChatTerminal(params.runId, run, "error", `previous run did not finish cleanly: ${errorMessage}`);
					}
					return;
				}
				if (params.controller.signal.aborted) {
					const run = this.runs.get(params.runId);
					if (run) this.emitChatTerminal(params.runId, run, "aborted");
					return;
				}
			}
			const activeRun = this.runs.get(params.runId);
			delete activeRun?.queuedAfter;
			let message = params.message;
			if (activeRun?.pendingQueue) {
				await waitForQueueDebounce(activeRun.pendingQueue, params.controller.signal);
				if (params.controller.signal.aborted) {
					this.emitChatTerminal(params.runId, activeRun, "aborted");
					return;
				}
				message = buildLocalQueuedPrompt(activeRun.pendingQueue);
				delete activeRun.pendingQueue;
			}
			if (recheckPreparedRuntimeAtAdmission) {
				await this.preparedModelRuntime.waitUntilReady();
				if (params.controller.signal.aborted) {
					if (activeRun) this.emitChatTerminal(params.runId, activeRun, "aborted");
					return;
				}
			}
			if (activeRun?.isBtw && activeRun.question) {
				const result = await this.runBtwTurn({
					runId: params.runId,
					sessionKey: params.sessionKey,
					...params.agentId ? { agentId: params.agentId } : {},
					question: activeRun.question,
					timeoutMs: params.timeoutMs,
					controller: params.controller
				});
				const run = this.runs.get(params.runId);
				if (!run) return;
				if (params.controller.signal.aborted) {
					this.emitChatTerminal(params.runId, run, "aborted");
					return;
				}
				this.emit("chat.side_result", {
					kind: "btw",
					runId: params.runId,
					sessionKey: result.sessionKey,
					agentId: run.agentId,
					question: run.question,
					text: result.text,
					...result.isError ? { isError: true } : {}
				});
				this.emitChatTerminal(params.runId, run, "final");
				return;
			}
			const loadOptions = params.agentId ? { agentId: params.agentId } : void 0;
			const { canonicalKey, entry } = loadGatewaySessionEntry(params.sessionKey, loadOptions);
			const result = await agentCommandFromIngress({
				message,
				sessionKey: canonicalKey,
				...params.agentId ? { agentId: params.agentId } : {},
				...entry?.sessionId ? { sessionId: entry.sessionId } : {},
				thinking: params.thinking,
				deliver: params.deliver,
				channel: INTERNAL_MESSAGE_CHANNEL,
				runContext: { messageChannel: INTERNAL_MESSAGE_CHANNEL },
				timeout: timeoutSecondsFromMs(params.timeoutMs),
				runId: params.runId,
				abortSignal: params.controller.signal,
				allowModelOverride: false
			}, silentRuntime, this.deps);
			const run = this.runs.get(params.runId);
			if (!run) return;
			if (this.projectTerminalOutcome(params.runId, run, result?.meta ?? {}, { visibleText: payloadText(result?.payloads) })) return;
			run.lifecycleYielded ||= isAgentLifecycleYieldedWaiting({
				phase: "end",
				...result?.meta
			});
			if (run.isBtw) {
				const text = payloadText(result?.payloads);
				if (run.question && text) this.emit("chat.side_result", {
					kind: "btw",
					runId: params.runId,
					sessionKey: run.sessionKey,
					agentId: run.agentId,
					question: run.question,
					text
				});
				this.emitChatTerminal(params.runId, run, "final");
				return;
			}
			if (run.terminalState !== "final") {
				const finalText = payloadText(result?.payloads);
				if (finalText) run.buffer = finalText;
				const stopReason = run.lifecycleStopReason ?? (typeof result?.meta?.stopReason === "string" ? result.meta.stopReason : void 0);
				this.emitChatTerminal(params.runId, run, "final", stopReason);
			}
		} catch (error) {
			const run = this.runs.get(params.runId);
			if (!run) return;
			const errorMessage = error instanceof Error ? error.message : String(error);
			const outcome = findAgentRunTerminalOutcome(error);
			this.projectTerminalOutcome(params.runId, run, outcome ?? {
				status: "error",
				error: errorMessage
			}, outcome ? { terminalOutcome: outcome } : {});
		} finally {
			this.runs.get(params.runId)?.markQueuedRunReady();
			this.runs.delete(params.runId);
		}
	}
};
//#endregion
export { EmbeddedTuiBackend };
