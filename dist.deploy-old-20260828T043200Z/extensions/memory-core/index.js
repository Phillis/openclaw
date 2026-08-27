import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { g as resolveSessionAgentIds } from "../../agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "../../agent-id-CeT3w4ap.js";
import { a as listAgentIds } from "../../agent-scope-config-CUBiGmG3.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-DbQz-n_m.js";
import { D as resolveMemoryRemDreamingConfig } from "../../dreaming-14k0XOwK.js";
import { v as parseNonNegativeByteSize } from "../../zod-schema-AsvAsngV.js";
import { t as ErrorCodes } from "../../gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "../../validation-errors-rELRlKfn.js";
import { t as resolveEffectiveCompactionReserveTokens } from "../../agent-compaction-constants-CzVH4jGZ.js";
import { _ as readToolStringParam, p as readPositiveIntegerParam } from "../../common-CI1GnPjt.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { n as resolveCronStyleNow } from "../../current-time-CCCy7gvK.js";
import { n as DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR } from "../../openclaw-runtime-BO0Slf1E.js";
import { t as resolveMemoryBackendConfig } from "../../backend-config-D3tXhXDP.js";
import "../../routing-DM8631ts.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-C2UoeqsI.js";
import "../../gateway-runtime-CwascfPd.js";
import "../../channel-actions-AIJ6nLei.js";
import "../../memory-core-host-status-DpSwQz8-.js";
import "../../memory-core-host-runtime-core-l5CDi0zI.js";
import "../../memory-core-host-runtime-files-B1FCGhDz.js";
import { p as configureMemoryCoreDreamingState } from "../../dreaming-state-B0qd2W7q.js";
import { t as resolveMemoryCoreNowMs } from "../../time-BhFVUM0b.js";
import { t as registerShortTermPromotionDreaming } from "../../dreaming-CqcZPbGf.js";
import { i as resolveMemoryToolContext, n as MEMORY_SEARCH_TOOL_CONTRACT, r as buildMemoryPromptSection, t as MEMORY_GET_TOOL_CONTRACT } from "../../memory-tool-contract-Bx_LBgwL.js";
import { t as normalizeSessionBackfillSelection } from "../../session-backfill-selection-CjIn4YJO.js";
//#region extensions/memory-core/src/flush-plan.ts
const DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4e3;
const DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES = 2 * 1024 * 1024;
const MEMORY_FLUSH_TARGET_HINT = "Store durable memories only in memory/YYYY-MM-DD.md (create memory/ if needed).";
const MEMORY_FLUSH_APPEND_ONLY_HINT = "If memory/YYYY-MM-DD.md already exists, APPEND new content only and do not overwrite existing entries.";
const MEMORY_FLUSH_READ_ONLY_HINT = "Treat workspace bootstrap/reference files such as MEMORY.md, DREAMS.md, SOUL.md, and AGENTS.md as read-only during this flush; never overwrite, replace, or edit them.";
const MEMORY_FLUSH_REQUIRED_HINTS = [
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT
];
const DEFAULT_MEMORY_FLUSH_PROMPT = [
	"Pre-compaction memory flush.",
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	"Do NOT create timestamped variant files (e.g., YYYY-MM-DD-HHMM.md); always use the canonical YYYY-MM-DD.md filename.",
	`If nothing to store, reply with ${SILENT_REPLY_TOKEN}.`
].join(" ");
const DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT = [
	"Pre-compaction memory flush turn.",
	"The session is near auto-compaction; capture durable memories to disk.",
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	`You may reply, but usually ${SILENT_REPLY_TOKEN} is correct.`
].join(" ");
function formatDateStampInTimezone(nowMs, timezone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(new Date(nowMs));
	const year = parts.find((part) => part.type === "year")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const day = parts.find((part) => part.type === "day")?.value;
	if (year && month && day) return `${year}-${month}-${day}`;
	return new Date(resolveMemoryCoreNowMs(nowMs)).toISOString().slice(0, 10);
}
function normalizeNonNegativeInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	const int = Math.floor(value);
	return int >= 0 ? int : null;
}
function ensureNoReplyHint(text) {
	if (text.includes("NO_REPLY")) return text;
	return `${text}\n\nIf no user-visible reply is needed, start with ${SILENT_REPLY_TOKEN}.`;
}
function ensureMemoryFlushSafetyHints(text) {
	let next = text.trim();
	for (const hint of MEMORY_FLUSH_REQUIRED_HINTS) if (!next.includes(hint)) next = next ? `${next}\n\n${hint}` : hint;
	return next;
}
function appendCurrentTimeLine(text, timeLine) {
	const trimmed = text.trimEnd();
	if (!trimmed) return timeLine;
	if (trimmed.includes("Current time:")) return trimmed;
	return `${trimmed}\n${timeLine}`;
}
function buildMemoryFlushPlan(params = {}) {
	const resolved = params;
	const nowMs = resolveMemoryCoreNowMs(resolved.nowMs);
	const cfg = resolved.cfg;
	const defaults = cfg?.agents?.defaults?.compaction?.memoryFlush;
	if (defaults?.enabled === false) return null;
	let softThresholdTokens = normalizeNonNegativeInt(defaults?.softThresholdTokens) ?? DEFAULT_MEMORY_FLUSH_SOFT_TOKENS;
	const forceFlushTranscriptBytes = parseNonNegativeByteSize(defaults?.forceFlushTranscriptBytes) ?? DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES;
	let reserveTokensFloor = DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR;
	const contextWindowTokens = normalizeNonNegativeInt(params.contextWindowTokens);
	if (contextWindowTokens !== null && contextWindowTokens > 0) {
		reserveTokensFloor = resolveEffectiveCompactionReserveTokens({
			contextTokenBudget: contextWindowTokens,
			reserveTokens: reserveTokensFloor
		});
		softThresholdTokens = Math.min(softThresholdTokens, Math.floor((contextWindowTokens - reserveTokensFloor) / 2));
	}
	const { timeLine, userTimezone } = resolveCronStyleNow(cfg ?? {}, nowMs);
	const dateStamp = formatDateStampInTimezone(nowMs, userTimezone);
	const relativePath = `memory/${dateStamp}.md`;
	const promptBase = ensureNoReplyHint(ensureMemoryFlushSafetyHints(DEFAULT_MEMORY_FLUSH_PROMPT));
	const systemPrompt = ensureNoReplyHint(ensureMemoryFlushSafetyHints(DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT));
	return {
		softThresholdTokens,
		forceFlushTranscriptBytes,
		reserveTokensFloor,
		model: defaults?.model?.trim() || void 0,
		prompt: appendCurrentTimeLine(promptBase.replaceAll("YYYY-MM-DD", dateStamp), timeLine),
		systemPrompt: systemPrompt.replaceAll("YYYY-MM-DD", dateStamp),
		relativePath
	};
}
//#endregion
//#region extensions/memory-core/src/session-backfill-gateway.ts
const SESSION_BACKFILL_GATEWAY_METHODS = {
	preview: "memory.sessionBackfill.preview",
	apply: "memory.sessionBackfill.apply",
	rollback: "memory.sessionBackfill.rollback"
};
var InvalidSessionBackfillRequestError = class extends Error {};
const loadSessionBackfillGatewayRuntime = createLazyRuntimeModule(() => import("../../session-backfill-gateway.runtime-DhHpTfM1.js"));
function paramsRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("params must be an object.");
	return value;
}
function assertOnlyKeys(params, allowed) {
	const unexpected = Object.keys(params).filter((key) => !allowed.has(key));
	if (unexpected.length > 0) throw new Error(`unexpected parameter: ${unexpected[0]}`);
}
function readOptionalSessionBoundary(params, key) {
	const raw = params[key];
	if (raw !== void 0 && typeof raw !== "string") throw new Error(`${key} must be a string.`);
	return readToolStringParam(params, key);
}
function readGatewayParams(value) {
	const params = paramsRecord(value);
	assertOnlyKeys(params, /* @__PURE__ */ new Set([
		"agentId",
		"from",
		"to",
		"limitDays"
	]));
	return {
		agentId: normalizeAgentId(readToolStringParam(params, "agentId", { required: true })),
		...normalizeSessionBackfillSelection({
			from: readOptionalSessionBoundary(params, "from"),
			to: readOptionalSessionBoundary(params, "to"),
			limitDays: readPositiveIntegerParam(params, "limitDays")
		}, {
			from: "from",
			to: "to",
			limitDays: "limitDays"
		})
	};
}
function readRollbackParams(value) {
	const params = paramsRecord(value);
	assertOnlyKeys(params, /* @__PURE__ */ new Set(["agentId"]));
	return { agentId: normalizeAgentId(readToolStringParam(params, "agentId", { required: true })) };
}
function resolveExecutionContext(api, agentId) {
	const config = api.runtime.config.current();
	if (!listAgentIds(config).includes(agentId)) throw new InvalidSessionBackfillRequestError(`Unknown agent id "${agentId}".`);
	const workspaceDir = api.runtime.agent.resolveAgentWorkspaceDir(config, agentId);
	const pluginConfig = resolvePluginConfigObject(config, "memory-core");
	const remConfig = resolveMemoryRemDreamingConfig({
		cfg: config,
		pluginConfig
	});
	return {
		workspaceDir,
		...pluginConfig ? { pluginConfig } : {},
		...remConfig.timezone !== void 0 ? { timezone: remConfig.timezone } : {}
	};
}
function gatewayResult(result, options) {
	return {
		days: result.days.length,
		candidates: result.candidateCount,
		perDay: result.days.map((day) => ({
			day: day.day,
			candidateCount: day.candidateCount,
			sample: day.topCandidates.slice(0, 3)
		})),
		staged: result.stagedEntries,
		...!options.includeCursor ? { truncated: options.continuation.hasMore } : {},
		...options.includeCursor ? { cursor: {
			advanced: options.continuation.advanced,
			exhausted: result.candidateCount === 0 && !options.continuation.hasMore,
			hasMore: options.continuation.hasMore
		} } : {}
	};
}
function respondInvalid(respond, error) {
	const message = error instanceof Error ? error.message : String(error);
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
function respondUnavailable(respond, error) {
	const message = error instanceof Error ? error.message : String(error);
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message));
}
function registerSessionBackfillGatewayMethods(api) {
	const registerBackfill = (method, apply) => {
		api.registerGatewayMethod(method, async ({ params, respond }) => {
			let request;
			try {
				request = readGatewayParams(params);
			} catch (error) {
				respondInvalid(respond, error);
				return;
			}
			try {
				const context = resolveExecutionContext(api, request.agentId);
				const { executeSessionBackfillBatch } = await loadSessionBackfillGatewayRuntime();
				const execution = await executeSessionBackfillBatch({
					...request,
					...context,
					...apply ? { apply: true } : {}
				});
				respond(true, gatewayResult(execution.result, {
					includeCursor: apply,
					continuation: execution.continuation
				}));
			} catch (error) {
				if (error instanceof InvalidSessionBackfillRequestError) respondInvalid(respond, error);
				else respondUnavailable(respond, error);
			}
		}, { scope: apply ? "operator.admin" : "operator.read" });
	};
	registerBackfill(SESSION_BACKFILL_GATEWAY_METHODS.preview, false);
	registerBackfill(SESSION_BACKFILL_GATEWAY_METHODS.apply, true);
	api.registerGatewayMethod(SESSION_BACKFILL_GATEWAY_METHODS.rollback, async ({ params, respond }) => {
		let request;
		try {
			request = readRollbackParams(params);
		} catch (error) {
			respondInvalid(respond, error);
			return;
		}
		try {
			const context = resolveExecutionContext(api, request.agentId);
			const { executeSessionBackfill } = await loadSessionBackfillGatewayRuntime();
			const result = await executeSessionBackfill({
				...request,
				...context,
				rollback: true
			});
			respond(true, {
				removedDiaryEntries: result.rollback?.removedDiaryEntries ?? 0,
				removedStagedEntries: result.rollback?.removedStagedEntries ?? 0
			});
		} catch (error) {
			if (error instanceof InvalidSessionBackfillRequestError) respondInvalid(respond, error);
			else respondUnavailable(respond, error);
		}
	}, { scope: "operator.admin" });
}
//#endregion
//#region extensions/memory-core/index.ts
const loadMemoryToolsModule = createLazyRuntimeModule(() => import("../../tools-BlK7DG-M.js"));
const loadStandingIntentsModule = createLazyRuntimeModule(() => import("../../standing-intents-EeqMEOR5.js"));
const loadStandingIntentToolModule = createLazyRuntimeModule(() => import("../../standing-intents-tool-Crrhh8uZ.js"));
const loadRuntimeProviderModule = createLazyRuntimeModule(() => import("../../runtime-provider-DlbblFXy.js"));
function createLazyMemoryTool(params) {
	const initialContext = resolveMemoryToolContext(params.options);
	if (!initialContext) return null;
	let toolPromise;
	const loadTool = async () => {
		toolPromise ??= loadMemoryToolsModule().then((module) => params.load(module, params.options));
		return await toolPromise;
	};
	return {
		label: params.contract.label,
		name: params.contract.name,
		description: params.contract.describe(initialContext.sources),
		parameters: params.contract.parameters,
		execute: async (toolCallId, toolParams, signal, onUpdate) => {
			const tool = await loadTool();
			if (!tool) return jsonResult({
				disabled: true,
				unavailable: true,
				error: "memory search unavailable"
			});
			return await tool.execute(toolCallId, toolParams, signal, onUpdate);
		}
	};
}
function createLazyMemorySearchTool(options) {
	return createLazyMemoryTool({
		options,
		contract: MEMORY_SEARCH_TOOL_CONTRACT,
		load: (module, loadOptions) => module.createMemorySearchTool(loadOptions)
	});
}
function createLazyMemoryGetTool(options) {
	return createLazyMemoryTool({
		options,
		contract: MEMORY_GET_TOOL_CONTRACT,
		load: (module, loadOptions) => module.createMemoryGetTool(loadOptions)
	});
}
function createLazyStandingIntentTool(ctx, reportUnavailable) {
	if (ctx.senderIsOwner !== true) return null;
	const cfg = ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
	const provider = ctx.messageChannel?.trim();
	const senderId = ctx.requesterSenderId?.trim();
	if (!cfg) {
		reportUnavailable("runtime config is unavailable for this turn");
		return null;
	}
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		sessionKey: ctx.sessionKey,
		config: cfg,
		agentId: ctx.agentId
	});
	let toolPromise;
	const loadTool = async () => {
		toolPromise ??= loadStandingIntentToolModule().then((module) => module.createStandingIntentTool({
			agentId,
			...ctx.sessionId ? { sourceSessionId: ctx.sessionId } : {},
			...ctx.nativeChannelId ? { conversationId: ctx.nativeChannelId } : {},
			...provider ? { provider } : {},
			...ctx.agentAccountId ? { accountId: ctx.agentAccountId } : {},
			...senderId ? { senderId } : {}
		}));
		return await toolPromise;
	};
	return {
		label: "Standing Intent",
		name: "intent",
		description: "Create, list, or explicitly cancel event-conditioned standing intents. A created intent is armed; the system injects the reminder automatically when it triggers. Do not deliver it early or cancel it unless the user asks. Use scheduled tasks for time-based reminders.",
		parameters: {
			type: "object",
			properties: {
				action: {
					type: "string",
					enum: [
						"create",
						"list",
						"cancel"
					]
				},
				id: { type: "string" },
				description: { type: "string" },
				triggerKeywords: {
					type: "array",
					items: { type: "string" }
				},
				scope: {
					type: "string",
					enum: [
						"conversation",
						"channel",
						"anywhere"
					],
					default: "channel"
				},
				senderScope: {
					type: "string",
					enum: ["sender", "anyone"],
					default: "sender"
				},
				expiresAt: { type: "string" },
				maxFires: {
					type: "integer",
					minimum: 1
				},
				cooldownSeconds: {
					type: "integer",
					minimum: 0
				},
				status: {
					type: "string",
					enum: [
						"pending",
						"armed",
						"fired",
						"done",
						"cancelled",
						"expired"
					]
				}
			},
			required: ["action"],
			additionalProperties: false
		},
		execute: async (toolCallId, params, signal, onUpdate) => {
			return await (await loadTool()).execute(toolCallId, params, signal, onUpdate);
		}
	};
}
function resolveMemoryToolOptions(ctx, host) {
	const getConfig = ctx.getRuntimeConfig ? () => ctx.getRuntimeConfig?.() : () => ctx.runtimeConfig ?? ctx.config;
	return {
		config: getConfig(),
		getConfig,
		agentId: ctx.agentId,
		agentSessionKey: ctx.sessionKey,
		sandboxed: ctx.sandboxed,
		oneShotCliRun: ctx.oneShotCliRun,
		conversationRecall: ctx.conversationRecall,
		activeProjectKeys: ctx.activeProjectKeys,
		...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {}
	};
}
function createLazyMemoryRuntime(host) {
	return {
		async getMemorySearchManager(params) {
			const { createMemoryRuntime } = await loadRuntimeProviderModule();
			return await createMemoryRuntime(host).getMemorySearchManager(params);
		},
		async authorizeSearchHits(params) {
			const { createMemoryRuntime } = await loadRuntimeProviderModule();
			const runtime = createMemoryRuntime(host);
			if (!runtime.authorizeSearchHits) throw new Error("memory-core runtime search authorization is unavailable");
			return await runtime.authorizeSearchHits(params);
		},
		async classifyWorkspaceMemoryPaths(params) {
			const [{ classifyWorkspaceMemoryPaths }, dreamingState] = await Promise.all([import("../../workspace-path-classifier-qylgJBfw.js"), import("../../dreaming-state-C8InVCcK.js")]);
			if (host.openKeyedStore) dreamingState.configureMemoryCoreDreamingState(host.openKeyedStore);
			return await classifyWorkspaceMemoryPaths(params);
		},
		resolveMemoryBackendConfig(params) {
			return resolveMemoryBackendConfig(params);
		},
		async closeAllMemorySearchManagers() {
			const { memoryRuntime: runtime } = await loadRuntimeProviderModule();
			await runtime.closeAllMemorySearchManagers?.();
		},
		async closeMemorySearchManager(params) {
			const { memoryRuntime: runtime } = await loadRuntimeProviderModule();
			await runtime.closeMemorySearchManager?.(params);
		}
	};
}
var memory_core_default = definePluginEntry({
	id: "memory-core",
	name: "OpenClaw Memory",
	description: "File-backed memory search tools and CLI",
	kind: "memory",
	register(api) {
		const acquireLocalService = (...args) => api.runtime.llm.acquireLocalService(...args);
		const openKeyedStore = (options) => api.runtime.state.openKeyedStore(options);
		const host = {
			acquireLocalService,
			openKeyedStore
		};
		configureMemoryCoreDreamingState(openKeyedStore);
		const memoryRuntime = createLazyMemoryRuntime(host);
		registerShortTermPromotionDreaming(api);
		registerSessionBackfillGatewayMethods(api);
		api.registerMemoryCapability({
			deterministicRecallToolName: "memory_search",
			supportsPrivateTranscriptRecall: true,
			promptBuilder: (params) => {
				if (!params.availableTools.has("memory_search") && !params.availableTools.has("memory_get")) return [];
				const context = resolveMemoryToolContext({
					config: api.runtime.config?.current ? api.runtime.config.current() : api.config,
					agentId: params.agentId,
					agentSessionKey: params.agentSessionKey
				});
				return context ? buildMemoryPromptSection({
					...params,
					sources: context.sources
				}) : [];
			},
			flushPlanResolver: buildMemoryFlushPlan,
			runtime: memoryRuntime,
			publicArtifacts: { async listArtifacts(params) {
				const { listMemoryCorePublicArtifacts } = await import("../../public-artifacts-yR0QmlsU.js");
				return await listMemoryCorePublicArtifacts(params);
			} }
		});
		api.registerTool((ctx) => createLazyMemorySearchTool(resolveMemoryToolOptions(ctx, host)), { names: ["memory_search"] });
		api.registerTool((ctx) => createLazyMemoryGetTool(resolveMemoryToolOptions(ctx, host)), { names: ["memory_get"] });
		api.registerTool((ctx) => createLazyStandingIntentTool(ctx, (reason) => {
			api.logger.warn(`memory-core: intent tool unavailable: ${reason}`);
		}), { names: ["intent"] });
		api.on("before_prompt_build", async (event, ctx) => {
			if (ctx.trigger !== "user") return;
			try {
				const module = await loadStandingIntentsModule();
				if (!module.isEligibleStandingIntentTurn(ctx)) return;
				const config = api.runtime.config?.current?.() ?? api.config;
				const { sessionAgentId: agentId } = resolveSessionAgentIds({
					sessionKey: ctx.sessionKey,
					config,
					agentId: ctx.agentId
				});
				const intents = module.matchStandingIntents({
					agentId,
					prompt: event.prompt,
					...ctx.channelId ?? ctx.chatId ? { channel: ctx.channelId ?? ctx.chatId } : {},
					...ctx.channel ?? ctx.messageProvider ? { provider: ctx.channel ?? ctx.messageProvider } : {},
					...ctx.accountId ? { accountId: ctx.accountId } : {},
					...ctx.senderId ? { senderId: ctx.senderId } : {}
				});
				const prependContext = module.buildStandingIntentContext(intents);
				return prependContext ? { prependContext } : void 0;
			} catch (error) {
				api.logger.warn?.(`memory-core: standing intent matching failed: ${error instanceof Error ? error.message : String(error)}`);
				return;
			}
		});
		api.on("before_agent_reply", async (_event, ctx) => {
			if (ctx.trigger !== "heartbeat" && ctx.trigger !== "cron") return;
			try {
				const module = await loadStandingIntentsModule();
				const config = api.runtime.config?.current?.() ?? api.config;
				const { sessionAgentId: agentId } = resolveSessionAgentIds({
					sessionKey: ctx.sessionKey,
					config,
					agentId: ctx.agentId
				});
				module.sweepStandingIntents({ agentId });
			} catch (error) {
				api.logger.warn?.(`memory-core: standing intent maintenance failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}, { eligibleTriggers: ["heartbeat", "cron"] });
		api.registerCommand({
			name: "dreaming",
			description: "Enable or disable memory dreaming.",
			acceptsArgs: true,
			exposeSenderIsOwner: true,
			handler: async (ctx) => {
				const { handleDreamingCommand } = await import("../../dreaming-command-FzerB9U_.js");
				return await handleDreamingCommand(api, ctx);
			}
		});
		api.registerCli(async ({ program }) => {
			const { registerMemoryCli } = await import("./cli.js");
			registerMemoryCli(program, host);
		}, { descriptors: [{
			name: "memory",
			description: "Search, inspect, and reindex memory files",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { memory_core_default as default };
