import { t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-runtime-A9GJIIpB.js";
import "./simple-completion-runtime-CLuUg43j.js";
//#region extensions/codex/harness.ts
const DEFAULT_CODEX_HARNESS_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai"]);
const SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER = Symbol.for("openclaw.codexAppServerClientDisposer");
const CODEX_TOOL_POLICY_SAFE_DENY_NAMES = [
	"web_fetch",
	"x_search",
	"memory_search",
	"memory_get",
	"dashboard",
	"canvas",
	"show_widget",
	"message",
	"heartbeat_respond",
	"automations",
	"gateway",
	"skill_workshop",
	"music_generate",
	"video_generate",
	"tts"
];
const CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES = [
	"bootstrap",
	"assemble-before-prompt",
	"after-turn",
	"maintain",
	"compact",
	"runtime-llm-complete",
	"thread-bootstrap-projection"
];
async function runCodexHostPreparedIsolatedCompletion(params) {
	const timeoutSignal = AbortSignal.timeout(params.timeoutMs);
	const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, timeoutSignal]) : timeoutSignal;
	return { assistant: await completeWithPreparedSimpleCompletionModel({
		model: params.model,
		auth: params.auth,
		cfg: params.config,
		context: {
			systemPrompt: params.systemPrompt,
			messages: [{
				role: "user",
				content: params.prompt,
				timestamp: Date.now()
			}],
			tools: []
		},
		options: {
			maxTokens: params.streamParams?.maxTokens,
			temperature: params.streamParams?.temperature,
			reasoning: params.thinkLevel,
			signal
		}
	}) };
}
async function disposeSharedCodexAppServerClients() {
	const dispose = globalThis[SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER];
	await dispose?.();
}
/**
* Creates the Codex app-server harness used for attempts, side questions,
* compaction, reset, and disposal.
*/
function createCodexAppServerAgentHarness(options) {
	const harnessRuntimeId = options?.id ?? "codex";
	const normalizedHarnessRuntimeId = harnessRuntimeId.trim().toLowerCase();
	const providerIds = new Set([...options?.providerIds ?? DEFAULT_CODEX_HARNESS_PROVIDER_IDS].map((id) => id.trim().toLowerCase()));
	const sessionCatalogControl = options.sessionCatalogControl;
	const sessionRuntime = options.runtime;
	return {
		id: harnessRuntimeId,
		label: options?.label ?? "Codex agent harness",
		autoSelection: { providerIds: [...providerIds] },
		cloudPlacement: { mode: "remote-exec" },
		delegatedExecutionPluginIds: ["voice-call"],
		contextEngineHostCapabilities: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES,
		conversationToolPolicySupport: "exact",
		conversationToolPolicySafeDenyTools: CODEX_TOOL_POLICY_SAFE_DENY_NAMES,
		deliveryDefaults: { visibleReplies: "message_tool" },
		authBootstrap: "harness",
		...sessionCatalogControl && sessionRuntime ? { sessionFork: {
			upstreamKinds: ["codex-app-server"],
			fork: async (params) => {
				const { forkCodexUpstreamSession } = await import("./upstream-session-fork-T8eU8kuA.js");
				return await forkCodexUpstreamSession(params, {
					bindingStore: options.bindingStore,
					control: sessionCatalogControl,
					harnessRuntimeId,
					resolveConfig: options.resolveConfig,
					runtime: sessionRuntime
				});
			}
		} } : {},
		authBinding: { fingerprint: async (params) => {
			const { fingerprintCodexAppServerAuthBinding } = await import("./auth-binding-DKJk5M0s.js");
			return fingerprintCodexAppServerAuthBinding(params);
		} },
		runtimeArtifact: { validate: async (binding) => {
			const { validateCodexAppServerRuntimeArtifact } = await import("./runtime-artifact-DJdhMXoL.js");
			return validateCodexAppServerRuntimeArtifact(binding);
		} },
		fetchUsageSnapshot: async (ctx) => {
			const { fetchCodexAppServerUsageSnapshot } = await import("./usage-BFT7sK1M.js");
			return await fetchCodexAppServerUsageSnapshot(ctx, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		loadMcpToolCatalog: async (params) => {
			const { loadCodexEffectiveMcpCatalog } = await import("./effective-mcp-catalog-Fo03ZLJ3.js");
			return await loadCodexEffectiveMcpCatalog(params, { bindingStore: options.bindingStore });
		},
		supports: (ctx) => {
			const provider = ctx.provider.trim().toLowerCase();
			if (!providerIds.has(provider)) return {
				supported: false,
				reason: `provider is not one of: ${[...providerIds].toSorted().join(", ")}`
			};
			if (ctx.modelProvider?.requestTransportOverrides === "present") return {
				supported: false,
				reason: "Codex cannot reproduce authored request transport overrides",
				fallbackRuntime: "openclaw"
			};
			const preparedAuth = ctx.modelProvider?.preparedAuth;
			const runtimePolicy = ctx.modelProvider?.runtimePolicy;
			if (runtimePolicy) {
				if (!runtimePolicy.compatibleIds.some((id) => id.trim().toLowerCase() === normalizedHarnessRuntimeId)) return {
					supported: false,
					reason: "Codex cannot reproduce the prepared provider route"
				};
			} else if (ctx.modelProvider && provider !== "codex") return {
				supported: false,
				reason: "provider route compatibility with Codex is not declared"
			};
			if (preparedAuth?.requirement === "subscription") {
				if (!(preparedAuth.source === "profile" && (preparedAuth.mode === "oauth" || preparedAuth.mode === "token"))) return {
					supported: false,
					reason: "Codex subscription auth requires a prepared OAuth or token profile"
				};
			} else if (preparedAuth?.requirement === "api-key") {
				if (!(preparedAuth.source !== "none" && preparedAuth.source !== "harness" && (preparedAuth.mode === "api-key" || preparedAuth.mode === "api_key"))) return {
					supported: false,
					reason: "Codex Platform auth requires a prepared API key"
				};
			}
			return {
				supported: true,
				priority: 100
			};
		},
		runAttempt: async (params) => {
			const { runCodexAppServerAttempt } = await import("./codex/app-server/run-attempt.js");
			return runCodexAppServerAttempt(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
				nativeHookRelay: { enabled: true }
			});
		},
		runIsolatedCompletionV2: async (params) => {
			if (params.authorization.owner === "host") {
				const { authorization, ...commonParams } = params;
				return runCodexHostPreparedIsolatedCompletion({
					...commonParams,
					model: authorization.model,
					auth: authorization.auth,
					...authorization.sourceAuthFingerprint ? { sourceAuthFingerprint: authorization.sourceAuthFingerprint } : {}
				});
			}
			const { runCodexIsolatedCompletion } = await import("./isolated-completion-CgcWMJb8.js");
			return runCodexIsolatedCompletion(params, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		runIsolatedCompletion: async (params) => {
			return runCodexHostPreparedIsolatedCompletion(params);
		},
		finalizeSettledTurn: async (params) => {
			const { runCodexSettledTurnFinalization } = await import("./settled-turn-finalizer-CN4Q709x.js");
			return runCodexSettledTurnFinalization(params, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		runSideQuestion: async (params) => {
			const { runCodexAppServerSideQuestion } = await import("./side-question-DDWDVFO5.js");
			return runCodexAppServerSideQuestion(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
				nativeHookRelay: { enabled: true }
			});
		},
		compact: async (params) => {
			const { maybeCompactCodexAppServerSession } = await import("./compact-D2qHDyOb.js");
			return maybeCompactCodexAppServerSession(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig
			});
		},
		compactAfterContextEngine: async (params) => {
			const { maybeCompactCodexAppServerSession } = await import("./compact-D2qHDyOb.js");
			return maybeCompactCodexAppServerSession(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
				allowNonManualNativeRequest: true
			});
		},
		reset: async (params) => {
			if (params.sessionId) {
				const [{ reclaimCurrentCodexSessionGeneration, sessionBindingIdentity }, { retireCodexAppServerSessionGeneration }] = await Promise.all([import("./session-binding-CU068Uuv.js"), import("./session-retirement-CAa1Ko51.js")]);
				const identity = sessionBindingIdentity({
					agentId: params.agentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				});
				const resetGeneration = () => retireCodexAppServerSessionGeneration({
					bindingStore: options.bindingStore,
					identity,
					mode: params.reason === "deleted" ? "retire" : "reset"
				});
				let reset = await resetGeneration();
				if (reset === "conflict") {
					if (await reclaimCurrentCodexSessionGeneration({
						bindingStore: options.bindingStore,
						identity,
						config: options.resolveConfig?.()
					})) reset = await resetGeneration();
				}
				if (reset === "conflict") throw new Error(`Codex binding generation changed before session ${params.sessionId} could reset`);
			}
		},
		dispose: disposeSharedCodexAppServerClients
	};
}
//#endregion
export { createCodexAppServerAgentHarness as t };
