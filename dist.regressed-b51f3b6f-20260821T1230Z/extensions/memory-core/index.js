import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { g as resolveSessionAgentIds } from "../../agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "../../agent-id-Db0rqw_J.js";
import { a as listAgentIds } from "../../agent-scope-config-BdXMWufB.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-CMI0yx54.js";
import { D as resolveMemoryRemDreamingConfig } from "../../dreaming-BMAUTQQQ.js";
import { l as parseNonNegativeByteSize } from "../../zod-schema-CLzqhoa9.js";
import { t as ErrorCodes } from "../../gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "../../error-codes-CMSvT5-d.js";
import { _ as readToolStringParam, p as readPositiveIntegerParam } from "../../common-BGOZLJ2_.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { t as resolveMemorySearchConfig } from "../../memory-search-DOWf4PbD.js";
import { n as resolveCronStyleNow } from "../../current-time-D-I8cLSc.js";
import { n as DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR } from "../../openclaw-runtime-Dskjn7_5.js";
import { t as resolveMemoryBackendConfig } from "../../backend-config-D3tXhXDP.js";
import "../../routing-DG_rmd7A.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-D7ikroCS.js";
import "../../gateway-runtime-Vk_KkezP.js";
import "../../channel-actions-CeWsyukw.js";
import "../../memory-core-host-status-DrMh3wbR.js";
import "../../memory-core-host-runtime-core-DV0-o8e2.js";
import "../../memory-core-host-runtime-files-DtT0bklL.js";
import { S as writeMemoryCoreWorkspaceEntry, b as readMemoryCoreWorkspaceEntry, m as deleteMemoryCoreWorkspaceEntry, n as DREAMING_DAILY_PROVENANCE_NAMESPACE, p as configureMemoryCoreDreamingState } from "../../dreaming-state-DWEtHClN.js";
import { t as resolveMemoryCoreNowMs } from "../../time-BMwrNv3r.js";
import { t as registerShortTermPromotionDreaming } from "../../dreaming-CDUoZMTz.js";
import { t as normalizeSessionBackfillSelection } from "../../session-backfill-selection-CjIn4YJO.js";
import { createHash } from "node:crypto";
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
function normalizeAgentMemoryPath(relativePath) {
	const normalized = relativePath.replaceAll("\\", "/").replace(/^\.\//u, "");
	if ([
		"MEMORY.md",
		"memory.md",
		"USER.md"
	].includes(normalized)) return normalized;
	if (!normalized.startsWith("memory/") || !normalized.endsWith(".md") || normalized.startsWith("memory/dreaming/") || normalized.startsWith("memory/.dreams/")) return;
	return normalized;
}
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
	const softThresholdTokens = normalizeNonNegativeInt(defaults?.softThresholdTokens) ?? DEFAULT_MEMORY_FLUSH_SOFT_TOKENS;
	const forceFlushTranscriptBytes = parseNonNegativeByteSize(defaults?.forceFlushTranscriptBytes) ?? DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES;
	const reserveTokensFloor = DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR;
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
		relativePath,
		recordWriteProvenance: async (write) => {
			const writtenPath = normalizeAgentMemoryPath(write.relativePath);
			if (!writtenPath) return;
			const hash = (value) => createHash("sha256").update(value).digest("hex");
			const existing = await readMemoryCoreWorkspaceEntry({
				namespace: DREAMING_DAILY_PROVENANCE_NAMESPACE,
				workspaceDir: write.workspaceDir,
				key: writtenPath
			});
			const originClass = write.originClass === "agent" && (!existing || existing?.originClass === "agent" && existing.fileHash === hash(write.contentBefore)) ? "agent" : "untrusted";
			await writeMemoryCoreWorkspaceEntry({
				namespace: DREAMING_DAILY_PROVENANCE_NAMESPACE,
				workspaceDir: write.workspaceDir,
				key: writtenPath,
				value: {
					fileHash: hash(write.contentAfter),
					originClass,
					observedAt: write.observedAt
				}
			});
			return async () => {
				if (existing) {
					await writeMemoryCoreWorkspaceEntry({
						namespace: DREAMING_DAILY_PROVENANCE_NAMESPACE,
						workspaceDir: write.workspaceDir,
						key: writtenPath,
						value: existing
					});
					return;
				}
				await deleteMemoryCoreWorkspaceEntry({
					namespace: DREAMING_DAILY_PROVENANCE_NAMESPACE,
					workspaceDir: write.workspaceDir,
					key: writtenPath
				});
			};
		},
		clearWriteProvenance: async ({ workspaceDir, relativePath: writtenPath }) => {
			const normalized = normalizeAgentMemoryPath(writtenPath);
			if (!normalized) return;
			await deleteMemoryCoreWorkspaceEntry({
				namespace: DREAMING_DAILY_PROVENANCE_NAMESPACE,
				workspaceDir,
				key: normalized
			});
		}
	};
}
//#endregion
//#region extensions/memory-core/src/prompt-section.ts
const buildPromptSection = ({ availableTools, citationsMode }) => {
	const hasMemorySearch = availableTools.has("memory_search");
	const hasMemoryGet = availableTools.has("memory_get");
	if (!hasMemorySearch && !hasMemoryGet) return [];
	let toolGuidance;
	if (hasMemorySearch && hasMemoryGet) toolGuidance = "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md + indexed session transcripts; then use memory_get to pull only the needed lines. If low confidence after search, say you checked.";
	else if (hasMemorySearch) toolGuidance = "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md + indexed session transcripts and answer from the matching results. If low confidence after search, say you checked.";
	else toolGuidance = "Before answering anything about prior work, decisions, dates, people, preferences, or todos that already point to a specific memory file or note: run memory_get to pull only the needed lines. If low confidence after reading them, say you checked.";
	const lines = ["## Memory Recall", toolGuidance];
	if (citationsMode === "off") lines.push("Citations are disabled: do not mention file paths or line numbers in replies unless the user explicitly asks.");
	else lines.push("Citations: include Source: <path#line> when it helps the user verify memory snippets.");
	lines.push("");
	return lines;
};
//#endregion
//#region extensions/memory-core/src/session-backfill-gateway.ts
const SESSION_BACKFILL_GATEWAY_METHODS = {
	preview: "memory.sessionBackfill.preview",
	apply: "memory.sessionBackfill.apply",
	rollback: "memory.sessionBackfill.rollback"
};
var InvalidSessionBackfillRequestError = class extends Error {};
const loadSessionBackfillGatewayRuntime = createLazyRuntimeModule(() => import("../../session-backfill-gateway.runtime-BgKNfFil.js"));
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
	const remConfig = resolveMemoryRemDreamingConfig({
		cfg: config,
		pluginConfig: resolvePluginConfigObject(config, "memory-core")
	});
	return {
		workspaceDir,
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
const loadMemoryToolsModule = createLazyRuntimeModule(() => import("../../tools-DEr_IeRd.js"));
const loadStandingIntentsModule = createLazyRuntimeModule(() => import("../../standing-intents-PjEukdlk.js"));
const loadStandingIntentToolModule = createLazyRuntimeModule(() => import("../../standing-intents-tool-BfQlNb5e.js"));
const loadRuntimeProviderModule = createLazyRuntimeModule(() => import("../../runtime-provider-HnTdI6eL.js"));
function getToolConfig(options) {
	return options.getConfig?.() ?? options.config;
}
function hasMemoryToolContext(options) {
	const cfg = getToolConfig(options);
	if (!cfg) return false;
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		sessionKey: options.agentSessionKey,
		config: cfg,
		agentId: options.agentId
	});
	return Boolean(resolveMemorySearchConfig(cfg, agentId));
}
const MemorySearchSchema = {
	type: "object",
	properties: {
		query: { type: "string" },
		maxResults: {
			type: "integer",
			minimum: 1
		},
		minScore: { type: "number" },
		corpus: {
			type: "string",
			enum: [
				"memory",
				"wiki",
				"all",
				"sessions"
			]
		}
	},
	required: ["query"],
	additionalProperties: false
};
const MemoryGetSchema = {
	type: "object",
	properties: {
		path: { type: "string" },
		from: {
			type: "integer",
			minimum: 1
		},
		lines: {
			type: "integer",
			minimum: 1
		},
		corpus: {
			type: "string",
			enum: [
				"memory",
				"wiki",
				"all"
			]
		}
	},
	required: ["path"],
	additionalProperties: false
};
function createLazyMemoryTool(params) {
	if (!hasMemoryToolContext(params.options)) return null;
	let toolPromise;
	const loadTool = async () => {
		toolPromise ??= loadMemoryToolsModule().then((module) => params.load(module, params.options));
		return await toolPromise;
	};
	return {
		label: params.label,
		name: params.name,
		description: params.description,
		parameters: params.parameters,
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
		label: "Memory Search",
		name: "memory_search",
		description: "Mandatory recall step: semantically search MEMORY.md + memory/*.md (and optional session transcripts) before answering questions about prior work, decisions, dates, people, preferences, or todos. Optional `corpus=wiki` or `corpus=all` also searches registered compiled-wiki supplements. `corpus=memory` restricts hits to indexed memory files (excludes session transcript chunks from ranking). `corpus=sessions` restricts hits to indexed session transcripts (same visibility rules as session history tools). If response has disabled=true, memory retrieval is unavailable and should be surfaced to the user.",
		parameters: MemorySearchSchema,
		load: (module, loadOptions) => module.createMemorySearchTool(loadOptions)
	});
}
function createLazyMemoryGetTool(options) {
	return createLazyMemoryTool({
		options,
		label: "Memory Get",
		name: "memory_get",
		description: "Safe exact excerpt read from MEMORY.md or memory/*.md. Defaults to a bounded excerpt when lines are omitted, includes truncation/continuation info when more content exists, and `corpus=wiki` reads from registered compiled-wiki supplements.",
		parameters: MemoryGetSchema,
		load: (module, loadOptions) => module.createMemoryGetTool(loadOptions)
	});
}
function createLazyStandingIntentTool(ctx) {
	if (ctx.senderIsOwner !== true) return null;
	const cfg = ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
	const provider = ctx.messageChannel?.trim();
	const senderId = ctx.requesterSenderId?.trim();
	if (!cfg) return null;
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
		description: "Create, list, or explicitly cancel event-conditioned standing intents. A created intent is armed; the system injects the reminder automatically when it triggers. Do not deliver it early or cancel it unless the user asks. Use cron or scheduled tasks for time-based reminders.",
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
	const getConfig = () => ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
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
			promptBuilder: buildPromptSection,
			flushPlanResolver: buildMemoryFlushPlan,
			runtime: memoryRuntime,
			publicArtifacts: { async listArtifacts(params) {
				const { listMemoryCorePublicArtifacts } = await import("../../public-artifacts-BN40Cme0.js");
				return await listMemoryCorePublicArtifacts(params);
			} }
		});
		api.registerTool((ctx) => createLazyMemorySearchTool(resolveMemoryToolOptions(ctx, host)), { names: ["memory_search"] });
		api.registerTool((ctx) => createLazyMemoryGetTool(resolveMemoryToolOptions(ctx, host)), { names: ["memory_get"] });
		api.registerTool((ctx) => createLazyStandingIntentTool(ctx), { names: ["intent"] });
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
				const { handleDreamingCommand } = await import("../../dreaming-command-D9gxHAlI.js");
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
