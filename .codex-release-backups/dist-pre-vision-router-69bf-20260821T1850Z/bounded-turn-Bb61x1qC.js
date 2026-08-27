import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { u as readStringField } from "./record-coerce-DItp3I4t.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { r as withTempWorkspace } from "./private-temp-workspace-zVw6pimH.js";
import "./temp-path-Buyb_0PI.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { x as resolveCodexAppServerRuntimeOptions } from "./session-binding-CUhCtBPp.js";
import { l as isCodexAppServerStartSelectionChangedError, ut as isJsonObject } from "./shared-client-CueuLl3e.js";
import { o as createDeferred } from "./extension-shared-D4oakjAV.js";
import { _ as readCodexNotificationTurnId, a as closeCodexStartupClientBestEffort, o as interruptCodexTurnAndWaitBestEffort, t as CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS } from "./attempt-client-cleanup-gqxRxZ3G.js";
import { b as isTerminalTurnStatus, n as normalizeCodexResponseTokenUsage, x as readCodexNotificationItem, y as isRetryableErrorNotification } from "./event-projector-usage-DRBRAzdu.js";
import { C as mergeCodexThreadConfigs, a as attestCodexRestrictedToolSurfaceMcpServersDisabled, c as readCodexInheritedMcpServerNames, i as assertCodexRestrictedToolSurfaceHasNoManagedHooks, o as buildCodexRingZeroThreadConfigPatch, s as buildCodexRuntimeThreadConfig } from "./thread-lifecycle-DSuIkaAw.js";
import { a as assertCodexThreadStartResponse, c as readCodexErrorNotification, o as assertCodexTurnStartResponse, u as readCodexTurnCompletedNotification } from "./protocol-validators-DQMpwHD0.js";
import { r as readModelListResult } from "./models-B9PZ3Gn4.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/codex/src/app-server/bounded-turn.ts
const CODEX_APP_SERVER_ARGS_ENV_KEY = "OPENCLAW_CODEX_APP_SERVER_ARGS";
const CODEX_BOUNDED_THREAD_CONFIG = {
	"agents.enabled": false,
	"features.multi_agent": false,
	"features.multi_agent_v2": false,
	"features.apps": false,
	"features.plugins": false,
	"features.image_generation": false,
	"features.standalone_web_search": false,
	web_search: "disabled"
};
const CODEX_PRIVATE_BOUNDED_THREAD_CONFIG = {
	"features.hooks": false,
	notify: []
};
const CODEX_SETTLED_FINALIZER_THREAD_CONFIG = {
	"skills.include_instructions": false,
	include_environment_context: false
};
var CodexBoundedTurnTimeoutError = class extends Error {
	constructor(taskLabel, timeoutMs) {
		const bound = timeoutMs % 1e3 === 0 ? `${timeoutMs / 1e3}s` : `${timeoutMs}ms`;
		super(`codex app-server ${taskLabel} turn timed out after ${bound}`);
		this.name = "TimeoutError";
	}
};
async function runBoundedCodexAppServerTurn(params) {
	const appServer = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.options.pluginConfig,
		managedCommandOrder: params.isolation === "private-stdio" ? "package-first" : void 0
	});
	if (params.isolation === "configured-transport") return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, { cwd: params.agentDir?.trim() || process.cwd() });
	if (appServer.start.transport !== "stdio") throw new Error("Bounded Codex turns require stdio transport so native tools can be isolated.");
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "codex-bounded-turn-"
	}, async (workspace) => {
		const codexHome = path.join(workspace.dir, "codex-home");
		const cwd = path.join(workspace.dir, "workspace");
		await Promise.all([fs.mkdir(codexHome, { recursive: true }), fs.mkdir(cwd, { recursive: true })]);
		return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, {
			codexHome,
			cwd
		});
	});
}
async function runBoundedCodexAppServerTurnInWorkspace(params, appServer, workspace, selectionAttempt = 0, timing) {
	const totalTimeoutMs = timing?.timeoutMs ?? resolveTimerTimeoutMs(params.timeoutMs, 100, 100);
	const timeoutError = new CodexBoundedTurnTimeoutError(params.taskLabel, totalTimeoutMs);
	const deadline = timing?.deadline ?? Date.now() + totalTimeoutMs;
	const timeoutMs = deadline - Date.now();
	if (timeoutMs <= 0) throw timeoutError;
	const agentDir = params.agentDir?.trim() || void 0;
	const isolatedStartOptions = workspace.codexHome ? buildPrivateCodexAppServerStartOptions(appServer.start, workspace.codexHome) : appServer.start;
	const startOptions = workspace.codexHome && params.preparedAuth ? {
		...isolatedStartOptions,
		homeScope: "agent"
	} : isolatedStartOptions;
	const ownsClient = !params.options.clientFactory;
	const authSelection = params.preparedAuth ? { preparedAuth: params.preparedAuth } : { authProfileId: params.profile };
	const client = params.options.clientFactory ? await params.options.clientFactory({
		startOptions,
		...authSelection,
		authRequirement: params.authRequirement,
		agentDir,
		config: params.config,
		timeoutMs,
		...params.signal ? { abandonSignal: params.signal } : {}
	}) : await import("./shared-client-DNp78rRs.js").then(({ createIsolatedCodexAppServerClient }) => createIsolatedCodexAppServerClient({
		startOptions,
		timeoutMs,
		...authSelection,
		authRequirement: params.authRequirement,
		agentDir,
		authProfileStore: params.authProfileStore,
		config: params.config,
		...params.signal ? { abandonSignal: params.signal } : {}
	}));
	const abortController = new AbortController();
	let activeThreadId;
	let activeTurnId = "";
	let interruptPromise;
	const requestInterrupt = () => {
		if (!activeThreadId || interruptPromise) return;
		interruptPromise = interruptCodexTurnAndWaitBestEffort(client, {
			threadId: activeThreadId,
			turnId: activeTurnId,
			timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS
		});
	};
	const abortRun = (reason) => {
		abortController.abort(reason);
		requestInterrupt();
	};
	const abortFromCaller = () => abortRun(params.signal?.reason ?? "aborted");
	if (params.signal?.aborted) abortFromCaller();
	else params.signal?.addEventListener("abort", abortFromCaller, { once: true });
	const remainingRunMs = deadline - Date.now();
	if (remainingRunMs <= 0) abortRun(timeoutError);
	const timeout = setTimeout(() => abortRun(timeoutError), Math.max(1, remainingRunMs));
	timeout.unref?.();
	let retrySelection = false;
	try {
		const model = await resolveCodexBoundedTurnModel({
			client,
			selection: params.model,
			requiredModalities: params.requiredModalities,
			timeoutMs,
			signal: abortController.signal
		});
		const inheritedMcpServerNames = params.requireNoExternalCapabilities ? await readCodexInheritedMcpServerNames(client, workspace.cwd, abortController.signal) : [];
		if (params.requireNoExternalCapabilities) await assertCodexRestrictedToolSurfaceHasNoManagedHooks(client, abortController.signal);
		const threadConfig = buildCodexRuntimeThreadConfig(resolveBoundedThreadConfig(params, workspace, inheritedMcpServerNames), { nativeCodeModeEnabled: false });
		const thread = assertCodexThreadStartResponse(await client.request("thread/start", {
			model,
			...params.modelProvider ? { modelProvider: params.modelProvider } : {},
			cwd: workspace.cwd,
			approvalPolicy: "on-request",
			sandbox: "read-only",
			serviceName: "OpenClaw",
			...params.requireNoExternalCapabilities ? { baseInstructions: "" } : {},
			developerInstructions: params.developerInstructions,
			config: threadConfig,
			environments: [],
			dynamicTools: [],
			experimentalRawEvents: true,
			ephemeral: true
		}, {
			timeoutMs,
			signal: abortController.signal
		}));
		activeThreadId = thread.thread.id;
		if (abortController.signal.aborted) requestInterrupt();
		if (params.requireNoExternalCapabilities) await attestCodexRestrictedToolSurfaceMcpServersDisabled(client, thread.thread.id, threadConfig, abortController.signal);
		if (params.historyItems?.length) await client.request("thread/inject_items", {
			threadId: thread.thread.id,
			items: params.historyItems
		}, {
			timeoutMs,
			signal: abortController.signal
		});
		const collector = createCodexBoundedTurnCollector(thread.thread.id, params.taskLabel, params.allowEmptyText === true);
		const cleanup = client.addNotificationHandler(collector.handleNotification);
		const requestCleanup = client.addRequestHandler(createCodexBoundedApprovalHandler(params.taskLabel));
		try {
			const turn = assertCodexTurnStartResponse(await client.request("turn/start", {
				threadId: thread.thread.id,
				input: params.input,
				approvalPolicy: "on-request",
				model,
				effort: "low"
			}, {
				timeoutMs,
				signal: abortController.signal
			}));
			activeTurnId = turn.turn.id;
			if (abortController.signal.aborted) requestInterrupt();
			return {
				...await collector.collect(turn.turn, {
					signal: abortController.signal,
					timeoutError
				}),
				model
			};
		} finally {
			await interruptPromise;
			requestCleanup();
			cleanup();
		}
	} catch (error) {
		if (abortController.signal.aborted) throw resolveCodexBoundedTurnAbortError(abortController.signal, params.taskLabel, timeoutError);
		if (ownsClient && isCodexAppServerStartSelectionChangedError(error) && selectionAttempt === 0) retrySelection = true;
		else throw error;
	} finally {
		clearTimeout(timeout);
		params.signal?.removeEventListener("abort", abortFromCaller);
		await interruptPromise;
		if (ownsClient) await closeCodexStartupClientBestEffort(client);
	}
	if (retrySelection) return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, workspace, selectionAttempt + 1, {
		deadline,
		timeoutMs: totalTimeoutMs
	});
	throw new Error("Codex bounded turn selection retry exited unexpectedly");
}
function resolveBoundedThreadConfig(params, workspace, inheritedMcpServerNames) {
	const boundedConfig = mergeCodexThreadConfigs(CODEX_BOUNDED_THREAD_CONFIG, params.threadConfig) ?? CODEX_BOUNDED_THREAD_CONFIG;
	const privateConfig = workspace.codexHome ? mergeCodexThreadConfigs(boundedConfig, CODEX_PRIVATE_BOUNDED_THREAD_CONFIG) ?? boundedConfig : boundedConfig;
	if (!params.requireNoExternalCapabilities) return privateConfig;
	return mergeCodexThreadConfigs(privateConfig, CODEX_SETTLED_FINALIZER_THREAD_CONFIG, buildCodexRingZeroThreadConfigPatch({ toolsAllow: ["openclaw"] }, true, inheritedMcpServerNames)) ?? privateConfig;
}
function buildPrivateCodexAppServerStartOptions(start, codexHome) {
	const providerArgs = start.args.flatMap((arg, index) => {
		const override = arg === "-c" || arg === "--config" ? start.args[index + 1] : arg.startsWith("--config=") ? arg.slice(9) : void 0;
		return override && /^\s*(?:openai_base_url|model_catalog_json)\s*=/u.test(override) ? ["-c", override] : [];
	});
	const privateEnv = Object.fromEntries(Object.entries(start.env ?? {}).filter(([name]) => name.trim().toUpperCase() !== CODEX_APP_SERVER_ARGS_ENV_KEY));
	const clearEnv = (start.clearEnv ?? []).filter((name) => {
		const normalized = name.trim().toUpperCase();
		return normalized !== "CODEX_HOME" && normalized !== CODEX_APP_SERVER_ARGS_ENV_KEY;
	});
	return {
		...start,
		args: [
			"app-server",
			...providerArgs,
			"--listen",
			"stdio://"
		],
		env: {
			...privateEnv,
			CODEX_HOME: codexHome
		},
		clearEnv: [...clearEnv, CODEX_APP_SERVER_ARGS_ENV_KEY]
	};
}
function createCodexBoundedApprovalHandler(taskLabel) {
	return (request) => {
		if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return {
			decision: "decline",
			reason: `OpenClaw Codex ${taskLabel} does not grant tool or file approvals.`
		};
		if (request.method === "item/permissions/requestApproval") return {
			permissions: {},
			scope: "turn"
		};
		if (request.method.includes("requestApproval")) return {
			decision: "decline",
			reason: `OpenClaw Codex ${taskLabel} does not grant native approvals.`
		};
		if (request.method === "mcpServer/elicitation/request") return { action: "decline" };
	};
}
async function resolveCodexBoundedTurnModel(params) {
	const listed = readModelListResult(await params.client.request("model/list", {
		limit: null,
		cursor: null,
		includeHidden: false
	}, {
		timeoutMs: Math.min(params.timeoutMs, 5e3),
		signal: params.signal
	})).models;
	if (params.selection.mode === "live-default") {
		const supported = listed.filter((entry) => params.requiredModalities.every((modality) => entry.inputModalities.includes(modality)));
		const selected = supported.find((entry) => entry.isDefault) ?? supported[0];
		if (!selected) throw new Error(`Codex app-server has no model supporting ${params.requiredModalities.join(" and ")} input.`);
		return selected.model;
	}
	const model = params.selection.id;
	const match = listed.find((entry) => entry.model === model || entry.id === model);
	if (!match) throw new Error(`Codex app-server model not found: ${model}`);
	if (params.requiredModalities.includes("image") && !match.inputModalities.includes("image")) throw new Error(`Codex app-server model does not support images: ${model}`);
	if (params.requiredModalities.includes("text") && !match.inputModalities.includes("text")) throw new Error(`Codex app-server model does not support text: ${model}`);
	return model;
}
function createCodexBoundedTurnCollector(threadId, taskLabel, allowEmptyText) {
	let turnId;
	let completedTurn;
	let promptError;
	let responseUsage;
	const pending = [];
	const completedItems = /* @__PURE__ */ new Map();
	const assistantTextByItem = /* @__PURE__ */ new Map();
	const assistantItemOrder = [];
	const { promise: completion, resolve: resolveCompletion } = createDeferred();
	const rememberAssistantText = (itemId, text) => {
		if (!text) return;
		if (!assistantTextByItem.has(itemId)) assistantItemOrder.push(itemId);
		assistantTextByItem.set(itemId, text);
	};
	const handleNotification = (notification) => {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params || readStringField(params, "threadId") !== threadId) return;
		if (!turnId) {
			pending.push(notification);
			return;
		}
		if (readCodexNotificationTurnId(params) !== turnId) return;
		if (notification.method === "item/completed") {
			const item = readCodexNotificationItem(notification.params);
			if (item) {
				completedItems.set(item.id, item);
				if (item.type === "agentMessage" && typeof item.text === "string") rememberAssistantText(item.id, item.text);
			}
			return;
		}
		if (notification.method === "item/agentMessage/delta") {
			const itemId = readStringField(params, "itemId") ?? readStringField(params, "id") ?? "assistant";
			const delta = readStringField(params, "delta") ?? "";
			rememberAssistantText(itemId, `${assistantTextByItem.get(itemId) ?? ""}${delta}`);
			return;
		}
		if (notification.method === "rawResponse/completed") {
			const usage = isJsonObject(params.usage) ? params.usage : void 0;
			responseUsage = usage ? normalizeCodexResponseTokenUsage(usage) : void 0;
			return;
		}
		if (notification.method === "turn/completed") {
			completedTurn = readCodexTurnCompletedNotification(notification.params)?.turn ?? completedTurn;
			resolveCompletion();
			return;
		}
		if (notification.method === "error") {
			if (isRetryableErrorNotification(notification.params)) return;
			promptError = readCodexErrorNotification(notification.params)?.error.message ?? `codex app-server ${taskLabel} turn failed`;
			resolveCompletion();
		}
	};
	return {
		handleNotification,
		async collect(startedTurn, options) {
			turnId = startedTurn.id;
			if (isTerminalTurnStatus(startedTurn.status)) completedTurn = startedTurn;
			for (const notification of pending.splice(0)) handleNotification(notification);
			if (!completedTurn && !promptError) await waitForTurnCompletion({
				completion,
				signal: options.signal,
				taskLabel,
				timeoutError: options.timeoutError
			});
			if (promptError) throw new Error(promptError);
			if (completedTurn?.status === "failed") throw new Error(completedTurn.error?.message ?? `codex app-server ${taskLabel} turn failed`);
			if (completedTurn?.status !== "completed") throw new Error(`codex app-server ${taskLabel} turn ended with status ${completedTurn?.status ?? "unknown"}`);
			const items = collectCompletedItems(completedTurn?.items, completedItems);
			const itemText = collectAssistantTextFromItems(items);
			const deltaText = assistantItemOrder.map((itemId) => assistantTextByItem.get(itemId)?.trim()).filter((text) => Boolean(text)).join("\n\n").trim();
			const text = (itemText || deltaText).trim();
			if (!text && !allowEmptyText) throw new Error(`Codex app-server ${taskLabel} turn returned no text.`);
			return {
				text,
				items,
				...responseUsage ? { usage: responseUsage } : {}
			};
		}
	};
}
function collectCompletedItems(turnItems, notificationItems) {
	const items = new Map(notificationItems);
	for (const item of turnItems ?? []) items.set(item.id, item);
	return [...items.values()];
}
async function waitForTurnCompletion(params) {
	if (params.signal.aborted) throw resolveCodexBoundedTurnAbortError(params.signal, params.taskLabel, params.timeoutError);
	let cleanupAbort;
	try {
		await Promise.race([params.completion, new Promise((_, reject) => {
			const abortListener = () => reject(resolveCodexBoundedTurnAbortError(params.signal, params.taskLabel, params.timeoutError));
			params.signal.addEventListener("abort", abortListener, { once: true });
			cleanupAbort = () => params.signal.removeEventListener("abort", abortListener);
		})]);
	} finally {
		cleanupAbort?.();
	}
}
function resolveCodexBoundedTurnAbortError(signal, taskLabel, timeoutError) {
	return signal.reason === timeoutError ? timeoutError : /* @__PURE__ */ new Error(`codex app-server ${taskLabel} turn aborted`);
}
function collectAssistantTextFromItems(items) {
	return (items ?? []).filter((item) => item.type === "agentMessage").map((item) => item.text.trim()).filter(Boolean).join("\n\n").trim();
}
//#endregion
export { runBoundedCodexAppServerTurn as t };
