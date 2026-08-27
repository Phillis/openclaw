import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { r as withTempWorkspace } from "./private-temp-workspace-DLvP_dJe.js";
import "./config-B2bSneS2.js";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DDjt_91x.js";
import { n as getRegisteredAgentHarness } from "./registry-lPXwErEe.js";
import { a as unwrapSecretSentinelsForProviderEgress, i as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BXpRqyF7.js";
import { r as ensureAuthProfileStore } from "./store-C0UG5FOx.js";
import { a as resolveCliRuntimeCanonicalProvider, i as resolveCliBackendConfig } from "./cli-backends-BMTJeHWV.js";
import { i as isCliRuntimeAliasForProvider, s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-CGiGCCsY.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-1slENmfx.js";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-afzKiwqZ.js";
import "./model-auth-e0nL7cI2.js";
import { o as prepareSystemAgentRunAdmission } from "./admitted-run-context-KQIZywud.js";
import { i as preparedAgentRuntimeProfileAttemptHasCandidate, n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-Bc5sTa5K.js";
import { r as resolveModelWithRegistry } from "./model-mZvi1Kcu.js";
import { n as prepareSimpleCompletionModel } from "./simple-completion-runtime-DRfxcemm.js";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-DxbVzdBl.js";
import { r as scopeAuthProfileStoreToPreparedPlan } from "./resolve-auth-BtbMS_IR.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Gs3Etsvo.js";
import { a as normalizeCliModel } from "./helpers-rowy3mQI.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/agents/isolated-completion.ts
/**
* Fresh, prompt-only inference with an exact zero-tool execution contract.
*
* This operation deliberately bypasses the ordinary agent attempt, retry,
* transcript, hook, and delivery lifecycle. Execution owners either prove a
* literal empty native tool surface or fail before inference starts.
*/
var IsolatedCompletionError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "IsolatedCompletionError";
		this.code = code;
	}
};
function clampIsolatedStreamParams(streamParams, modelMaxTokens) {
	if (streamParams?.maxTokens === void 0 || modelMaxTokens === void 0) return streamParams;
	return {
		...streamParams,
		maxTokens: Math.min(streamParams.maxTokens, modelMaxTokens)
	};
}
function selectIsolatedHarnessAuthPlan(attempt) {
	if (attempt.kind !== "profile") return attempt.plan;
	return {
		...attempt.plan,
		forwardedAuthProfileId: attempt.profileId,
		forwardedAuthProfileCandidateIds: [attempt.profileId]
	};
}
function requireIsolatedAssistantText(assistant) {
	if (assistant.stopReason !== "stop" && assistant.stopReason !== "length") throw new IsolatedCompletionError("output-rejected", `Isolated completion failed with stop reason ${assistant.stopReason}.`);
	const textParts = [];
	for (const block of assistant.content) {
		if (block.type === "text") {
			textParts.push(block.text);
			continue;
		}
		if (block.type === "thinking") continue;
		throw new IsolatedCompletionError("output-rejected", "Isolated completion returned a tool call; the result was rejected.");
	}
	const text = textParts.join("").trim();
	if (!text) throw new IsolatedCompletionError("output-rejected", "Isolated completion returned empty output.");
	return text;
}
function hasCliSideEffectEvidence(result) {
	return Boolean(result.didSendViaMessagingTool || result.didDeliverSourceReplyViaMessageTool || result.messagingToolSentTexts?.length || result.messagingToolSentMediaUrls?.length || result.messagingToolSentTargets?.length || result.messagingToolSourceReplyPayloads?.length || result.acceptedSessionSpawns?.length || result.successfulCronAdds);
}
async function runCliIsolatedCompletion(params) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-isolated-completion-"
	}, async ({ dir }) => {
		const { runCliAgent } = await import("./cli-runner.runtime.js");
		const sessionId = `isolated-completion-${randomUUID()}`;
		const config = params.request.config ?? getRuntimeConfig();
		const preparedRunAdmission = prepareSystemAgentRunAdmission(config, sessionId, params.agentId, "isolated-completion");
		try {
			const result = await runCliAgent({
				preparedRunAdmission,
				sessionId,
				sessionFile: path.join(dir, "session.json"),
				workspaceDir: params.workspaceDir,
				cwd: dir,
				agentDir: params.agentDir,
				agentId: params.agentId,
				config,
				prompt: params.request.prompt,
				extraSystemPrompt: params.request.systemPrompt,
				timeoutMs: params.request.timeoutMs,
				runId: sessionId,
				provider: params.provider,
				modelProvider: params.modelProvider,
				model: params.request.model,
				authProfileId: params.request.authProfileId,
				thinkLevel: params.request.thinkLevel,
				streamParams: params.request.streamParams,
				abortSignal: params.request.abortSignal,
				executionMode: "side-question",
				cliToolAvailability: {
					native: [],
					openClaw: []
				},
				disableTools: true,
				disableCliLiveSession: true,
				cleanupCliLiveSessionOnRunEnd: true,
				cleanupBundleMcpOnRunEnd: true,
				requireExplicitMessageTarget: true,
				isolatedCompletion: true
			});
			if (hasCliSideEffectEvidence(result)) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned side-effect evidence; result rejected.");
			const payloads = result.payloads ?? [];
			if (payloads.some((payload) => payload.isError || payload.mediaUrl || payload.mediaUrls?.length || payload.audioAsVoice || payload.channelData)) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned non-text output; result rejected.");
			const text = payloads.filter((payload) => !payload.isReasoning && typeof payload.text === "string").map((payload) => payload.text ?? "").join("\n").trim();
			if (!text) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned empty output.");
			const backend = resolveCliBackendConfig(params.provider, params.request.config, { agentId: params.agentId });
			if (!backend) throw new IsolatedCompletionError("runtime-unavailable", `CLI backend ${params.provider} became unavailable after execution.`);
			const usage = result.meta?.agentMeta?.usage;
			return {
				text,
				model: normalizeCliModel(params.request.model, backend.config),
				...usage ? { usage } : {}
			};
		} finally {
			preparedRunAdmission.close();
		}
	});
}
function resolveCliOwner(params) {
	if (isCliRuntimeAliasForProvider({
		runtime: params.runtime,
		provider: params.provider,
		cfg: params.request.config
	})) return params.runtime;
	if (params.request.agentHarnessRuntimeOverride) return;
	return resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.request.config,
		agentId: params.agentId,
		modelId: params.request.model,
		authProfileId: params.request.authProfileId
	}) ?? resolveEmbeddedCliBackendDispatchEligibility({
		provider: params.provider,
		model: params.request.model,
		agentId: params.agentId,
		authProfileId: params.request.authProfileId,
		config: params.request.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	})?.provider;
}
async function resolveHarness(runtime) {
	if (runtime === "openclaw") {
		const { createOpenClawAgentHarness } = await import("./builtin-openclaw-iP69rf4R.js");
		return createOpenClawAgentHarness();
	}
	const harness = getRegisteredAgentHarness(runtime)?.harness;
	if (!harness) throw new IsolatedCompletionError("runtime-unavailable", `Agent harness ${runtime} is unavailable for isolated completion.`);
	return harness;
}
function prepareIsolatedHarnessParams(harness, params) {
	if (harness.id === "openclaw") return params;
	const boundary = "plugin harness isolated completion handoff";
	const apiKey = params.auth.apiKey ? unwrapSecretSentinelsForProviderEgress(params.auth.apiKey, boundary) : params.auth.apiKey;
	const model = unwrapModelHeaderSentinelsForProviderEgress(params.model, boundary);
	if (apiKey === params.auth.apiKey && model === params.model) return params;
	return {
		...params,
		model,
		auth: {
			...params.auth,
			apiKey
		}
	};
}
function prepareIsolatedHarnessParamsV2(harness, params) {
	if (harness.id === "openclaw" || params.authorization.owner === "harness") return params;
	const boundary = "plugin harness isolated completion handoff";
	const apiKey = params.authorization.auth.apiKey ? unwrapSecretSentinelsForProviderEgress(params.authorization.auth.apiKey, boundary) : params.authorization.auth.apiKey;
	const model = unwrapModelHeaderSentinelsForProviderEgress(params.authorization.model, boundary);
	if (apiKey === params.authorization.auth.apiKey && model === params.authorization.model) return params;
	return {
		...params,
		authorization: {
			...params.authorization,
			model,
			auth: {
				...params.authorization.auth,
				apiKey
			}
		}
	};
}
async function prepareHostAuthorization(params) {
	const prepared = await prepareSimpleCompletionModel({
		cfg: params.config,
		agentId: params.agentId,
		provider: params.provider,
		modelId: params.modelId,
		agentDir: params.agentDir,
		profileId: params.authProfileId,
		allowMissingApiKeyModes: ["aws-sdk"],
		allowBundledStaticCatalogFallback: true,
		skipAgentDiscovery: true,
		bindAuthOwner: true,
		workspaceDir: params.workspaceDir,
		preparedModelRuntime: params.preparedModelRuntime
	});
	if ("error" in prepared) throw new Error(`Isolated completion preparation failed: ${prepared.error}`);
	return {
		owner: "host",
		model: prepared.model,
		auth: prepared.auth,
		...prepared.sourceAuthFingerprint ? { sourceAuthFingerprint: prepared.sourceAuthFingerprint } : {}
	};
}
/** Run one fresh completion without any model-callable tool surface or fallback. */
async function runIsolatedCompletion(request) {
	const config = request.config ?? {};
	const agentId = request.agentId ?? resolveDefaultAgentId(config);
	const agentDir = request.agentDir ?? resolveAgentDir(config, agentId);
	const workspaceDir = request.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
	const provider = resolveCliRuntimeCanonicalProvider({
		runtime: request.provider,
		config,
		includeSetupRegistry: true
	}) ?? request.provider;
	const lease = await acquireAgentRunPreparedModelRuntime({
		config,
		agentId,
		agentDir,
		workspaceDir,
		runtimePluginSelections: [{
			provider,
			modelId: request.model,
			...request.agentHarnessRuntimeOverride ? { runtime: request.agentHarnessRuntimeOverride } : {},
			agentId
		}]
	}, {
		catalogMode: "static",
		abortSignal: request.abortSignal
	});
	const pluginRegistry = lease.snapshot.pluginRegistry;
	try {
		const run = async () => {
			await ensureSelectedAgentHarnessPlugin({
				provider,
				modelId: request.model,
				config,
				agentId,
				agentHarnessId: request.agentHarnessRuntimeOverride,
				agentHarnessRuntimeOverride: request.agentHarnessRuntimeOverride,
				workspaceDir,
				pluginRegistry
			});
			const runtime = request.agentHarnessRuntimeOverride ?? resolveEffectiveAgentRuntime({
				cfg: config,
				provider,
				modelId: request.model,
				agentId
			});
			const cliOwner = resolveCliOwner({
				request,
				provider,
				runtime,
				agentId,
				agentDir,
				workspaceDir
			});
			if (cliOwner) {
				const completion = await runCliIsolatedCompletion({
					request,
					provider: cliOwner,
					modelProvider: provider,
					agentId,
					agentDir,
					workspaceDir
				});
				return {
					text: completion.text,
					provider,
					model: completion.model,
					owner: {
						kind: "cli",
						id: cliOwner
					},
					...completion.usage ? { usage: completion.usage } : {}
				};
			}
			const harness = await resolveHarness(runtime);
			if (!harness.runIsolatedCompletionV2 && !harness.runIsolatedCompletion) throw new IsolatedCompletionError("unsupported", `Agent harness ${harness.id} does not support isolated completion.`);
			const commonParams = {
				provider,
				modelId: request.model,
				config,
				agentId,
				agentDir,
				workspaceDir,
				systemPrompt: request.systemPrompt,
				prompt: request.prompt,
				timeoutMs: request.timeoutMs,
				abortSignal: request.abortSignal,
				thinkLevel: request.thinkLevel
			};
			let result;
			if (harness.runIsolatedCompletionV2) {
				let modelMaxTokens;
				let authProfileStore;
				let authAttempts;
				if (harness.authBootstrap === "harness") {
					const { modelRegistry } = lease.snapshot.createStores();
					const runtimeModel = resolveModelWithRegistry({
						provider,
						modelId: request.model,
						modelRegistry,
						cfg: config
					});
					if (!runtimeModel) throw new IsolatedCompletionError("runtime-unavailable", `Unknown isolated completion model ${provider}/${request.model}.`);
					modelMaxTokens = runtimeModel.maxTokens;
					authProfileStore = ensureAuthProfileStore(agentDir, {
						readOnly: true,
						allowKeychainPrompt: false,
						config
					});
					authAttempts = prepareAgentRuntimeAuth({
						provider: runtimeModel.provider,
						modelId: runtimeModel.id,
						modelApi: runtimeModel.api,
						modelBaseUrl: runtimeModel.baseUrl,
						config,
						env: process.env,
						agentDir,
						workspaceDir,
						authProfileStore,
						sessionAuthProfileId: request.authProfileId,
						sessionAuthProfileSource: request.authProfileId ? "user" : void 0,
						harnessId: harness.id,
						harnessRuntime: harness.id,
						harnessAuthBootstrap: harness.authBootstrap
					}).attempts;
				}
				let firstError;
				let priorProfileAttempted = false;
				for (const preparedAttempt of authAttempts?.length ? authAttempts : [void 0]) {
					const attempt = preparedAttempt?.kind === "profile" ? {
						...preparedAttempt,
						plan: selectIsolatedHarnessAuthPlan(preparedAttempt)
					} : preparedAttempt;
					if (attempt && !canRunPreparedAgentRuntimeAuthAttempt({
						attempt,
						priorProfileAttempted
					})) {
						firstError ??= /* @__PURE__ */ new Error("Prepared direct auth requires a prior profile attempt.");
						continue;
					}
					if (attempt?.kind === "profile" && authProfileStore && !preparedAgentRuntimeProfileAttemptHasCandidate({
						attempt,
						store: authProfileStore,
						modelId: request.model
					})) {
						firstError ??= /* @__PURE__ */ new Error("Prepared runtime auth candidates are temporarily unavailable.");
						continue;
					}
					try {
						let authorization;
						if (attempt?.plan.harnessAuthProvider && attempt.plan.modelRoute?.authRequirement !== "api-key" && authProfileStore) {
							const plan = attempt.plan;
							authorization = {
								owner: "harness",
								plan,
								authProfileStore: scopeAuthProfileStoreToPreparedPlan(authProfileStore, plan)
							};
						} else {
							authorization = await prepareHostAuthorization({
								config,
								agentId,
								agentDir,
								provider,
								modelId: request.model,
								authProfileId: attempt?.kind === "profile" ? attempt.profileId : request.authProfileId,
								workspaceDir,
								preparedModelRuntime: lease.snapshot
							});
							modelMaxTokens = authorization.model.maxTokens;
						}
						if (attempt?.kind === "profile" && authProfileStore && !preparedAgentRuntimeProfileAttemptHasCandidate({
							attempt,
							store: authProfileStore,
							modelId: request.model
						})) throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
						const pending = harness.runIsolatedCompletionV2(prepareIsolatedHarnessParamsV2(harness, {
							...commonParams,
							authorization,
							streamParams: clampIsolatedStreamParams(request.streamParams, modelMaxTokens)
						}));
						priorProfileAttempted ||= attempt?.kind === "profile";
						result = await pending;
						break;
					} catch (error) {
						if (request.abortSignal?.aborted) throw error;
						firstError ??= error;
					}
				}
				if (!result) {
					if (firstError instanceof Error) throw firstError;
					throw new Error("No prepared auth attempt succeeded.", { cause: firstError });
				}
			} else {
				const authorization = await prepareHostAuthorization({
					config,
					agentId,
					agentDir,
					provider,
					modelId: request.model,
					authProfileId: request.authProfileId,
					workspaceDir,
					preparedModelRuntime: lease.snapshot
				});
				const harnessParams = {
					...commonParams,
					streamParams: clampIsolatedStreamParams(request.streamParams, authorization.model.maxTokens),
					model: authorization.model,
					auth: authorization.auth,
					...authorization.sourceAuthFingerprint ? { sourceAuthFingerprint: authorization.sourceAuthFingerprint } : {}
				};
				result = await harness.runIsolatedCompletion(prepareIsolatedHarnessParams(harness, harnessParams));
			}
			if (!result) throw new IsolatedCompletionError("runtime-unavailable", "Isolated completion failed.");
			return {
				text: requireIsolatedAssistantText(result.assistant),
				provider: result.assistant.provider,
				model: result.assistant.model,
				owner: {
					kind: "harness",
					id: harness.id
				},
				usage: result.assistant.usage
			};
		};
		return await withPluginRuntimeGenerationScope(lease.snapshot, run);
	} finally {
		lease.release();
	}
}
//#endregion
export { runIsolatedCompletion as t };
