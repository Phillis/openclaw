import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as redactToolDetail } from "./redact-Cl7lwBnl.js";
import "./utils-DEqefz4f.js";
import "./errors-CSNUPl5U.js";
import "./agent-scope-BizOtGGz.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./version-o4XN9fka.js";
import "./agent-events-Cmj8toCy.js";
import { d as listCodexAppServerExtensionFactories } from "./loader-CwiP0Igf.js";
import "./registry-RzPPae7_.js";
import "./provider-request-config-BK7CLYaF.js";
import "./registry-DOMV71ew.js";
import { g as joinPresentTextSegments, t as getGlobalHookRunner } from "./hook-runner-global-BNCkTxOs.js";
import "./reply-payload-DVcGHORx.js";
import "./session-accessor-CVnxp3UM.js";
import "./agent-tools.before-tool-call-aNXucund.js";
import "./tool-result-error-BPVRZjCB.js";
import "./model-auth-B7VlMZMb.js";
import "./execution-auth-binding-CmucNoqo.js";
import { c as mergeAgentRunAttemptTerminal, d as setAgentRunAttemptTerminalFailure, l as normalizeAgentRunAttemptTerminal, u as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-D3lKKt7D.js";
import "./run-termination-B0y7ra5H.js";
import "./diagnostic-DO3P5TXi.js";
import { g as queueEmbeddedAgentMessageWithOutcome } from "./runs-DdjJNEQM.js";
import "./gateway-Cl3WHu5g.js";
import "./tools-uoGjdHqF.js";
import "./tool-mutation-D4StAzyF.js";
import "./embedded-agent-messaging-BwCqmGjz.js";
import "./hook-helpers-BovEJvO2.js";
import "./gateway-question-y5NFHODa.js";
import { r as inferToolMetaFromArgsCore } from "./tool-display-DNnLx8TW.js";
import "./tool-meta-DQIE1F3a.js";
import "./agent-tools.ring-zero-context-C-QXByzs.js";
import { a as shouldLoadRequesterScopedMcpHarnessRuntime } from "./agent-bundle-mcp-runtime-shared-DkwjMxYn.js";
import "./tool-replay-safety-B_xTwlME.js";
import "./logger-XkrUQwkD.js";
import "./bootstrap-files-BYIPQKgr.js";
import "./fs-bridge-WPcm-FoR.js";
import "./sandbox-CvisDJF6.js";
import "./nodes-utils-D1m1kKFp.js";
import "./settled-turn-finalization-result-BWIM2nfh.js";
import { v as wrapPluginSystemContextSection } from "./attempt-prompt-helpers-gLglSwD1.js";
import "./heartbeat-tool-response-CyHYyyCM.js";
import "./agent-end-side-effects-D3nNsUM5.js";
import "./tools-DYwibo9o.js";
import "./tool-schema-projection-ZrMdwk4s.js";
import "./attempt-tool-construction-plan-D_uFFO7I.js";
import "./embedded-agent-tool-media-DpCH-u1W.js";
import "./embedded-agent-tool-results-BIgvsn9M.js";
import "./embedded-agent-message-tool-source-reply-D2p3llYx.js";
import { s as buildAgentHookContext } from "./lifecycle-hook-helpers-CJUVnzhF.js";
import "./attempt-thread-helpers-8XoZfu0M.js";
import { n as prepareWatchedSessionsPrompt, t as buildWatchedSessionsPromptLines } from "./watched-sessions-prompt-DdBrho6A.js";
import "./transcript-credential-safety-CbpQd_gv.js";
import "./tool-result-middleware-C3XFX1f9.js";
import "./result-fallback-classifier-D8qWB51S.js";
import "./build-CNCLeebz.js";
import "./native-hook-relay-Cd68IilN.js";
//#region src/plugin-sdk/session-write-lock-runtime.ts
const DEFAULT_SESSION_WRITE_LOCK_ACQUIRE_TIMEOUT_MS = 6e4;
const DEFAULT_SESSION_WRITE_LOCK_STALE_MS = 1800 * 1e3;
const DEFAULT_SESSION_WRITE_LOCK_MAX_HOLD_MS = 300 * 1e3;
/**
* @deprecated Session write leases were removed. This compatibility stub is scheduled for
* removal in the 2026.10 release train; use the session lane and durable writer claim/fence.
*/
function resolveSessionWriteLockAcquireTimeoutMs(_config, _env) {
	return DEFAULT_SESSION_WRITE_LOCK_ACQUIRE_TIMEOUT_MS;
}
/**
* @deprecated Session write leases were removed. This compatibility stub is scheduled for
* removal in the 2026.10 release train; use the session lane and durable writer claim/fence.
*/
function resolveSessionWriteLockOptions(_config, _params = {}) {
	return {
		timeoutMs: DEFAULT_SESSION_WRITE_LOCK_ACQUIRE_TIMEOUT_MS,
		staleMs: DEFAULT_SESSION_WRITE_LOCK_STALE_MS,
		maxHoldMs: DEFAULT_SESSION_WRITE_LOCK_MAX_HOLD_MS
	};
}
/**
* @deprecated Session write leases were removed. This no-op compatibility stub is scheduled
* for removal in the 2026.10 release train; use the session lane and durable writer claim/fence.
*/
async function acquireSessionWriteLock(_params) {
	return {
		assertOwned: () => void 0,
		release: async () => void 0
	};
}
//#endregion
//#region src/agents/harness/prompt-compaction-hook-helpers.ts
/**
* Agent harness prompt and compaction hook helpers.
*
* Harness runtimes use this to run plugin hooks around prompt construction and
* compaction while keeping hook failures non-fatal.
*/
const log$1 = createSubsystemLogger("agents/harness");
/** Runs before-prompt hooks and returns the adjusted prompt fields. */
async function resolveAgentHarnessBeforePromptBuildResult(params) {
	const hookRunner = getGlobalHookRunner();
	const hasHeartbeatContribution = params.ctx.trigger === "heartbeat" && Boolean(hookRunner?.hasHooks("heartbeat_prompt_contribution"));
	if (!hasHeartbeatContribution && !hookRunner?.hasHooks("before_prompt_build")) return {
		prompt: params.prompt,
		developerInstructions: params.developerInstructions,
		promptInputRange: {
			start: 0,
			end: params.prompt.length
		}
	};
	const hookCtx = buildAgentHookContext(params.ctx);
	const promptEvent = {
		prompt: params.prompt,
		messages: params.messages
	};
	const heartbeatResult = hasHeartbeatContribution && hookRunner ? await hookRunner.runHeartbeatPromptContribution({
		sessionKey: params.ctx.sessionKey,
		agentId: params.ctx.agentId,
		heartbeatName: "heartbeat"
	}, hookCtx).catch((error) => {
		log$1.warn(`heartbeat_prompt_contribution hook failed: ${String(error)}`);
	}) : void 0;
	const promptBuildResult = hookRunner?.hasHooks("before_prompt_build") ? await hookRunner.runBeforePromptBuild(promptEvent, hookCtx).catch((error) => {
		log$1.warn(`before_prompt_build hook failed: ${String(error)}`);
	}) : void 0;
	const systemPrompt = resolvePromptBuildSystemPrompt({
		developerInstructions: params.developerInstructions,
		promptBuildResult
	});
	const promptPrefix = joinPresentTextSegments([heartbeatResult?.prependContext, promptBuildResult?.prependContext]);
	const promptSuffix = joinPresentTextSegments([heartbeatResult?.appendContext, promptBuildResult?.appendContext]);
	const prompt = joinPresentTextSegments([
		promptPrefix,
		params.prompt,
		promptSuffix
	]) ?? params.prompt;
	const promptInputStart = params.prompt.length === 0 ? promptPrefix?.length ?? 0 : promptPrefix ? promptPrefix.length + 2 : 0;
	return {
		prompt,
		...promptBuildResult?.toolsAllow !== void 0 ? { toolsAllow: promptBuildResult.toolsAllow } : {},
		developerInstructions: joinPresentTextSegments([
			wrapPluginSystemContextSection(promptBuildResult?.prependSystemContext),
			systemPrompt,
			wrapPluginSystemContextSection(promptBuildResult?.appendSystemContext)
		]) ?? systemPrompt,
		promptInputRange: {
			start: promptInputStart,
			end: promptInputStart + params.prompt.length
		}
	};
}
function resolvePromptBuildSystemPrompt(params) {
	if (typeof params.promptBuildResult?.systemPrompt === "string") return params.promptBuildResult.systemPrompt;
	return params.developerInstructions;
}
/** Runs best-effort before-compaction hooks for a harness session. */
async function runAgentHarnessBeforeCompactionHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_compaction")) return;
	try {
		await hookRunner.runBeforeCompaction({
			messageCount: params.messages?.length ?? -1,
			...params.messages ? { messages: params.messages } : {},
			sessionFile: params.sessionFile
		}, buildAgentHookContext(params.ctx));
	} catch (error) {
		log$1.warn(`before_compaction hook failed: ${String(error)}`);
	}
}
/** Runs best-effort after-compaction hooks for a harness session. */
async function runAgentHarnessAfterCompactionHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("after_compaction")) return;
	try {
		await hookRunner.runAfterCompaction({
			messageCount: params.messages?.length ?? -1,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile
		}, buildAgentHookContext(params.ctx));
	} catch (error) {
		log$1.warn(`after_compaction hook failed: ${String(error)}`);
	}
}
//#endregion
//#region src/agents/harness/codex-app-server-extensions.ts
/**
* Codex app-server extension runner.
*
* Harness integration uses this to let registered extensions observe and adjust
* tool results before they are returned to the agent runtime.
*/
const log = createSubsystemLogger("agents/harness");
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
function createCodexAppServerToolResultExtensionRunner(ctx, factories = listCodexAppServerExtensionFactories()) {
	const handlers = [];
	const runtime = { on(event, handler) {
		if (event === "tool_result") handlers.push(handler);
	} };
	const initPromise = (async () => {
		for (const factory of factories) await factory(runtime);
	})();
	return { async applyToolResultExtensions(event) {
		await initPromise;
		let current = event.result;
		for (const handler of handlers) try {
			const next = await handler({
				...event,
				result: current
			}, ctx);
			if (next?.result) current = next.result;
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			log.warn(`[codex] tool_result extension failed for ${event.toolName}: ${detail}`);
		}
		return current;
	} };
}
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.ts
/** Default truncation limit for user-facing tool progress output. */
const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8e3;
/**
* Renders the Watched Sessions prompt block for plugin-owned harness prompts.
* Harness runtimes that assemble their own instruction layers (e.g. Codex)
* must surface the same watched-session facts as the embedded prompt, or the
* model keeps refusing cross-session questions on those runtimes (openclaw#114797).
*/
function buildWatchedSessionsHarnessContext(params) {
	const lines = buildWatchedSessionsPromptLines(prepareWatchedSessionsPrompt({
		enabled: true,
		...params
	}));
	return lines.length > 0 ? lines.join("\n").trimEnd() : void 0;
}
const agentHarnessAttemptTerminal = {
	merge: mergeAgentRunAttemptTerminal,
	normalize: normalizeAgentRunAttemptTerminal,
	project: projectAgentRunAttemptTerminal,
	setFailure: setAgentRunAttemptTerminalFailure
};
/**
* @deprecated Active-run queueing is an internal runtime concern. This legacy
* boolean API only reports immediate queue eligibility and cannot observe async
* runtime rejection; runtime-owned delivery paths should use acceptance-aware
* steering instead of public SDK queueing.
*/
function queueAgentHarnessMessage(sessionId, text, options) {
	return queueEmbeddedAgentMessageWithOutcome(sessionId, text, options).queued;
}
/** Detect prompt image references and load them through the same limits used by embedded runs. */
async function detectAndLoadAgentHarnessPromptImages(params) {
	const [{ resolveImageSanitizationLimits }, { detectAndLoadPromptImages }, { MAX_IMAGE_BYTES }] = await Promise.all([
		import("./image-sanitization-BghTEphW.js"),
		import("./images-CCqzzyIP.js"),
		import("./media-core/constants.js")
	]);
	return detectAndLoadPromptImages({
		prompt: params.prompt,
		workspaceDir: params.workspaceDir,
		model: params.model,
		existingImages: params.existingImages,
		imageOrder: params.imageOrder,
		media: params.media,
		maxBytes: MAX_IMAGE_BYTES,
		maxDimensionPx: resolveImageSanitizationLimits(params.config).maxDimensionPx,
		workspaceOnly: params.workspaceOnly,
		localRoots: params.localRoots,
		sandbox: params.sandbox
	});
}
/** Load Codex bundle MCP thread config without forcing the heavy config module into SDK imports. */
async function loadCodexBundleMcpThreadConfig(params) {
	const { loadCodexBundleMcpThreadConfigCore: load } = await import("./codex-mcp-config-toU7PWc4.js");
	return load(params);
}
/**
* Materialize an MCP App view for a tool executed by a harness-native MCP client.
* The harness supplies a runtime adapter so the view keeps using that exact connection.
*/
async function prepareHarnessNativeMcpAppPreview(params) {
	if (params.runtime.mcpAppsEnabled !== true) return;
	const { buildMcpAppCanvasPayload, fetchMcpAppView } = await import("./mcp-ui-resource-D4qSMNhn.js");
	const view = await fetchMcpAppView({
		runtime: params.runtime,
		agentId: params.agentId,
		serverName: params.serverName,
		toolName: params.toolName,
		uiResourceUri: params.uiResourceUri,
		toolCallId: params.toolCallId,
		toolInput: params.toolInput,
		toolResult: params.toolResult,
		allowedAppToolNames: params.allowedAppToolNames
	});
	if (!view) return;
	return { mcpAppPreview: buildMcpAppCanvasPayload({
		...view,
		...params.runtime.sessionKey ? { originSessionKey: params.runtime.sessionKey } : {},
		...params.resultMetaState ? { resultMetaState: params.resultMetaState } : {}
	}) };
}
/**
* Materialize requester-scoped MCP tools for a harness run (dynamic tools, not
* harness-native MCP config). Lazy-loaded so harness plugins avoid the MCP manager graph.
*/
async function materializeRequesterScopedMcpToolsForHarnessRun(params) {
	if (!shouldLoadRequesterScopedMcpHarnessRuntime(params)) return;
	const { materializeRequesterScopedMcpToolsForHarnessRunCore: materialize } = await import("./agent-bundle-mcp-harness-DRQ7YNUN.js");
	return materialize(params);
}
/** Infer compact display metadata for one tool invocation from its name and arguments. */
function inferToolMetaFromArgs(toolName, args, options) {
	return inferToolMetaFromArgsCore(toolName, args, options);
}
/**
* Prepare verbose tool output for user-facing progress messages.
*/
function formatToolProgressOutput(output, options) {
	const trimmed = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
	if (!trimmed) return;
	const redacted = redactToolDetail(trimmed);
	const maxChars = options?.maxChars ?? 8e3;
	if (redacted.length <= maxChars) return redacted;
	return `${truncateUtf16Safe(redacted, maxChars)}\n...(truncated)...`;
}
/**
* Classify terminal harness turns that completed without assistant output that
* should advance fallback. Deliberate silent replies such as NO_REPLY count as
* intentional output, while whitespace-only text remains fallback-eligible.
* This is intentionally SDK-level so plugin harness adapters such as Codex
* preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
* without re-implementing terminal-result policy.
*/
function classifyAgentHarnessTerminalOutcome(params) {
	if (!params.turnCompleted || params.promptError !== void 0 && params.promptError !== null || hasVisibleAssistantText(params.assistantTexts)) return;
	if (params.planText?.trim()) return "planning-only";
	if (params.reasoningText?.trim()) return "reasoning-only";
	return "empty";
}
function hasVisibleAssistantText(assistantTexts) {
	return assistantTexts.some((text) => text.trim().length > 0);
}
//#endregion
export { resolveSessionWriteLockAcquireTimeoutMs as _, detectAndLoadAgentHarnessPromptImages as a, loadCodexBundleMcpThreadConfig as c, queueAgentHarnessMessage as d, createCodexAppServerToolResultExtensionRunner as f, acquireSessionWriteLock as g, runAgentHarnessBeforeCompactionHook as h, classifyAgentHarnessTerminalOutcome as i, materializeRequesterScopedMcpToolsForHarnessRun as l, runAgentHarnessAfterCompactionHook as m, agentHarnessAttemptTerminal as n, formatToolProgressOutput as o, resolveAgentHarnessBeforePromptBuildResult as p, buildWatchedSessionsHarnessContext as r, inferToolMetaFromArgs as s, TOOL_PROGRESS_OUTPUT_MAX_CHARS as t, prepareHarnessNativeMcpAppPreview as u, resolveSessionWriteLockOptions as v };
