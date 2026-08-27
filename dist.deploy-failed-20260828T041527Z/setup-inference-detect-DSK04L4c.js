import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, p as resolveAmbientOwnerAgentId, r as listAgentEntries, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { i as legacyModelKey, s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-DbjoXfPH.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-CbU9a7ui.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-Cs_eB1UN.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-FOWiRwM8.js";
import { n as readCodexCliCredentialsCached, r as readGeminiCliCredentialsCached } from "./cli-credentials-DZ9rGNcm.js";
import { d as loadAuthProfileStoreForRuntime } from "./store-C6iqqcJy.js";
import { i as resolveCliBackendConfig } from "./cli-backends-TpSzxqso.js";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-Rrd1VaX1.js";
import "./model-selection-Cp8EGD61.js";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-CXAwbaGj.js";
import { a as probeLocalCommand } from "./overview-CefSkUmi.js";
import { a as GEMINI_CLI_DEFAULT_MODEL_REF, i as CODEX_APP_SERVER_DEFAULT_MODEL_REF, r as CLAUDE_CLI_DEFAULT_MODEL_REF, s as detectAmbientInferenceBackends, t as resolveSetupInferenceCandidateBrandId } from "./setup-inference-brand-DkVeLzTp.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-QVxAzcU7.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-DZw3W3ra.js";
import { a as supportsSetupTextInference, n as listSetupInferenceManualProviders, r as listSetupInferencePrepareOptions, t as listSetupInferenceAuthOptions } from "./setup-inference-auth-options-DDoD9isn.js";
import { n as loadAuthoredSetupConfig } from "./onboarding-welcome-BnR7bfUE.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-CAYqRcuv.js";
import os from "node:os";
import path from "node:path";
import { randomInt, randomUUID } from "node:crypto";
//#region src/commands/onboard-inference.ts
function detectCliCredentialState(params) {
	if (!params.probe.found) return;
	if (params.hasStoredCredentials) return true;
	return params.platform === "darwin" ? void 0 : false;
}
const CLI_AUTH_KIND_LABEL = {
	"api-key": "API key (usage-billed)",
	"chatgpt-subscription": "ChatGPT subscription",
	"claude-subscription": "Claude subscription"
};
function describeCliDetail(state, loginHint) {
	if (state.authKind) return `logged in · ${CLI_AUTH_KIND_LABEL[state.authKind]}`;
	if (state.credentials === true) return "logged in";
	if (state.credentials === false) return `installed, not logged in — ${loginHint}, then check again`;
	return "installed";
}
function describeGeminiCliDetail(credentials) {
	return credentials === true ? "installed; credentials found" : "installed; login status unavailable";
}
async function classifyCodexLoginStatus(probe, command) {
	const status = await probe(command, ["login", "status"], { timeoutMs: 3e3 });
	if (status.error) return { credentials: void 0 };
	if (status.version === "Logged in using ChatGPT") return {
		credentials: true,
		authKind: "chatgpt-subscription"
	};
	if (/^Logged in using an API key - .+$/u.test(status.version ?? "")) return {
		credentials: true,
		authKind: "api-key"
	};
	return { credentials: true };
}
async function detectClaudeLoginState(probe, command) {
	const status = await probe(command, [
		"auth",
		"status",
		"--text"
	], { timeoutMs: 3e3 });
	if (status.timedOut) return { credentials: void 0 };
	if (status.error) return { credentials: false };
	const method = status.version?.replace(/^Login method:\s*/iu, "").trim();
	return {
		credentials: true,
		...method ? { authKind: /api\s*key/iu.test(method) ? "api-key" : "claude-subscription" } : {}
	};
}
function randomizeClaudeCodexTie(candidates, pickRandomInt) {
	const claudeIndex = candidates.findIndex((candidate) => candidate.kind === "claude-cli" && candidate.credentials !== false);
	const codexIndex = candidates.findIndex((candidate) => candidate.kind === "codex-cli" && candidate.credentials !== false);
	if (claudeIndex === -1 || codexIndex === -1 || pickRandomInt(2) === 0) return;
	const claudeCandidate = candidates[claudeIndex];
	const codexCandidate = candidates[codexIndex];
	candidates[claudeIndex] = expectDefined(codexCandidate, "Codex onboarding candidate");
	candidates[codexIndex] = expectDefined(claudeCandidate, "Claude onboarding candidate");
}
const CODEX_MACOS_APP_NAMES = [
	"ChatGPT.app",
	"Codex.app",
	"Codex Beta.app"
];
const CODEX_MACOS_APP_PROBE_TIMEOUT_MS = 3e3;
async function probeCodexCommand(params) {
	const pathProbe = await params.probe("codex");
	if (pathProbe.found || params.platform !== "darwin") return pathProbe;
	const home = params.env.HOME?.trim() || os.homedir();
	const appExecutables = new Set(CODEX_MACOS_APP_NAMES.flatMap((appName) => [path.join("/Applications", appName, "Contents", "Resources", "codex"), path.join(home, "Applications", appName, "Contents", "Resources", "codex")]));
	for (const executable of appExecutables) {
		const appProbe = await params.probe(executable, ["--version"], { timeoutMs: CODEX_MACOS_APP_PROBE_TIMEOUT_MS });
		if (appProbe.found) return appProbe;
	}
	return pathProbe;
}
/** Detects a native Codex App Server without coupling it to inference selection. */
async function detectNativeCodexAppServer(options = {}) {
	return await probeCodexCommand({
		probe: options.probeLocalCommand ?? probeLocalCommand,
		env: options.env ?? process.env,
		platform: options.platform ?? process.platform
	});
}
/**
* Detect usable inference backends in ladder order. Returns candidates only
* for backends that exist on this machine; the first entry is the bootstrap
* default. Backends that are definitively logged out sink below logged-in and
* unknown ones so a stale install never outranks a working login.
*/
async function detectInferenceBackends(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const probe = options.deps?.probeLocalCommand ?? probeLocalCommand;
	const readCodex = options.deps?.readCodexCliCredentials ?? (() => readCodexCliCredentialsCached({
		allowKeychainPrompt: false,
		ttlMs: 6e4
	}));
	const readGemini = options.deps?.readGeminiCliCredentials ?? (() => readGeminiCliCredentialsCached({ ttlMs: 6e4 }));
	const candidates = [];
	const defaultAgentId = options.config ? options.agentId?.trim() || tryResolveLegacyCompatibilityAgentId(options.config) : void 0;
	if (resolveAgentModelPrimaryValue(options.config && defaultAgentId ? resolveAgentConfig(options.config, defaultAgentId)?.model : void 0) ?? resolveAgentModelPrimaryValue(options.config?.agents?.defaults?.model)) {
		const resolved = resolveDefaultModelForAgent({
			cfg: options.config ?? {},
			...defaultAgentId ? { agentId: defaultAgentId } : {}
		});
		const modelRef = `${resolved.provider}/${resolved.model}`;
		candidates.push({
			kind: "existing-model",
			modelRef,
			label: "Current model",
			detail: `${modelRef} — already configured`,
			credentials: true
		});
	}
	const envCandidates = detectAmbientInferenceBackends(env).filter((candidate) => candidate.kind === "openai-api-key" || candidate.kind === "anthropic-api-key");
	const [claudeProbe, codexProbe, geminiProbe] = await Promise.all([
		probe("claude"),
		detectNativeCodexAppServer({
			probeLocalCommand: probe,
			env,
			platform
		}),
		probe("gemini")
	]);
	const cliCandidates = [];
	const subscriptionPromotionEligibleCliKinds = /* @__PURE__ */ new Set();
	if (claudeProbe.found && !claudeProbe.timedOut) {
		const loginState = options.deps?.detectClaudeLoginState ? await options.deps.detectClaudeLoginState(probe, claudeProbe.command) : await detectClaudeLoginState(probe, claudeProbe.command);
		const credentials = loginState.credentials;
		if (credentials === true && loginState.authKind === "claude-subscription") subscriptionPromotionEligibleCliKinds.add("claude-cli");
		const detail = describeCliDetail(loginState, "run `claude auth login`");
		cliCandidates.push({
			kind: "claude-cli",
			modelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			label: "Claude Code",
			detail,
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (codexProbe.found && !codexProbe.timedOut) {
		const codexCredential = readCodex();
		const loginState = options.deps?.detectCodexLoginState ? { credentials: await options.deps.detectCodexLoginState(probe, codexProbe.command) } : options.deps?.readCodexCliCredentials ? {
			credentials: detectCliCredentialState({
				probe: codexProbe,
				hasStoredCredentials: codexCredential !== null,
				platform
			}),
			...codexCredential?.type === "oauth" ? { authKind: "chatgpt-subscription" } : {}
		} : await classifyCodexLoginStatus(probe, codexProbe.command);
		const credentials = loginState.credentials;
		if (credentials === true && codexCredential?.type === "oauth") subscriptionPromotionEligibleCliKinds.add("codex-cli");
		cliCandidates.push({
			kind: "codex-cli",
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			label: "Codex",
			detail: describeCliDetail(loginState, "run `codex login`"),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (geminiProbe.found && !geminiProbe.timedOut) {
		const credentials = readGemini() !== null ? true : void 0;
		cliCandidates.push({
			kind: "gemini-cli",
			modelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			label: "Gemini CLI",
			detail: describeGeminiCliDetail(credentials),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	randomizeClaudeCodexTie(cliCandidates, options.deps?.randomInt ?? randomInt);
	const loggedInSubscriptionCliCandidates = cliCandidates.filter((candidate) => candidate.credentials === true && subscriptionPromotionEligibleCliKinds.has(candidate.kind));
	const remainingCliCandidates = cliCandidates.filter((candidate) => !loggedInSubscriptionCliCandidates.includes(candidate));
	candidates.push(...loggedInSubscriptionCliCandidates, ...envCandidates, ...remainingCliCandidates.filter((candidate) => candidate.credentials !== false), ...remainingCliCandidates.filter((candidate) => candidate.credentials === false));
	return candidates;
}
//#endregion
//#region src/system-agent/setup-inference-core.ts
const setupInferenceLog = createSubsystemLogger("system-agent/setup-inference");
/**
* Inference is the one required onboarding step (docs/cli/setup.md
* "Setup bootstrap"). This module gives structured clients (macOS app) the
* same ladder the conversation uses, with one hard guarantee: a candidate is
* persisted as the default model only after a real completion round-trips.
* A failing candidate must never leave config pointing at a broken model.
*/
const SETUP_INFERENCE_TEST_TIMEOUT_MS = 9e4;
const SETUP_INFERENCE_TEST_PROMPT = "Reply with the single word OK. Do not use tools.";
const PROVIDER_AUTO_SETUP_KIND_PREFIX = "provider-auto:";
const AUTO_LOCAL_MODEL_LEAN_ANNOUNCEMENT = "This model is small, so I set up the lean surface — switching to a bigger model later lifts it.";
/**
* The config commit may have happened, so callers must verify current setup
* instead of treating this like a definitive candidate failure and retrying.
*/
var SetupInferenceActivationIndeterminateError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SetupInferenceActivationIndeterminateError";
	}
};
var SetupInferenceActivationUnavailableError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "SetupInferenceActivationUnavailableError";
	}
};
/**
* The live-tested owner no longer matches current config. Activation maps this
* to `{ ok: false, status: "auth" }` so the guided-onboarding ladder can move
* to its next candidate instead of crashing the CLI.
*/
var SetupInferenceOwnerDriftError = class extends Error {
	constructor(..._args3) {
		super(..._args3);
		this.name = "SetupInferenceOwnerDriftError";
	}
};
var SetupInferenceCancelledError = class extends Error {
	constructor() {
		super("Provider login was cancelled.");
	}
};
function throwIfSetupInferenceCancelled(params) {
	if (params.signal?.aborted || params.isCancelled?.()) throw new SetupInferenceCancelledError();
}
async function waitForProviderAuth(promise, signal) {
	if (!signal) return await promise;
	if (signal.aborted) throw new SetupInferenceCancelledError();
	let rejectAborted;
	const aborted = new Promise((_resolve, reject) => {
		rejectAborted = reject;
	});
	const onAbort = () => rejectAborted?.(new SetupInferenceCancelledError());
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		return await Promise.race([promise, aborted]);
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
}
function toProviderAutoSetupKind(choiceId) {
	return `${PROVIDER_AUTO_SETUP_KIND_PREFIX}${encodeURIComponent(choiceId)}`;
}
function parseProviderAutoSetupChoiceId(kind) {
	if (!kind.startsWith(PROVIDER_AUTO_SETUP_KIND_PREFIX)) return;
	const encoded = kind.slice(14);
	if (!encoded) return;
	try {
		return decodeURIComponent(encoded) || void 0;
	} catch {
		return;
	}
}
function invalidSetupConfigError(snapshot) {
	const issue = snapshot.issues?.[0];
	const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
	return `OpenClaw config ${snapshot.path} is invalid${detail}. Fix it before running setup.`;
}
async function redactSetupInferenceError(message, ...apiKeys) {
	const secrets = new Set(apiKeys.flatMap((apiKey) => [apiKey, apiKey?.trim()]).filter((value) => Boolean(value)));
	let redacted = message;
	for (const secret of Array.from(secrets).toSorted((a, b) => b.length - a.length)) redacted = redacted.split(secret).join("[redacted]");
	const { redactToolPayloadText } = await import("./redact-BDNsSTaH.js");
	return redactToolPayloadText(redacted);
}
function resolveCandidatePresentation(candidate, authChoices) {
	const choice = authChoices.find((entry) => entry.choiceId === candidate.kind || entry.deprecatedChoiceIds?.includes(candidate.kind) === true);
	const brandId = resolveSetupInferenceCandidateBrandId(candidate, choice?.providerId);
	return {
		...brandId ? { brandId } : {},
		...choice?.icon ? { icon: choice.icon } : {},
		...choice?.website ? { website: choice.website } : {}
	};
}
async function resolveSetupInferenceWorkspace(params) {
	const { authoredConfig, hasAuthoredSetup } = await loadAuthoredSetupConfig(params);
	const { DEFAULT_WORKSPACE } = await import("./onboard-helpers-Cwjb9WEP.js");
	return {
		workspace: resolveUserPath(authoredConfig?.agents?.defaults?.workspace?.trim() || DEFAULT_WORKSPACE),
		hasAuthoredSetup
	};
}
//#endregion
//#region src/system-agent/setup-inference-plan-helpers.ts
function configureCodexCliPreparedAuth(cfg, homeScope) {
	const entry = cfg.plugins?.entries?.codex;
	const pluginConfig = entry?.config ?? {};
	const appServer = pluginConfig.appServer && typeof pluginConfig.appServer === "object" ? pluginConfig.appServer : {};
	const transport = "transport" in appServer ? appServer.transport : void 0;
	if (typeof transport === "string" && transport !== "stdio") return err(`Codex setup needs a local stdio app-server for prepared sign-in, but plugins.entries.codex.config.appServer.transport is "${transport}". Remove that transport override to let setup manage a local Codex, or finish Codex sign-in on the remote app-server host and retry.`);
	return ok({
		...cfg,
		plugins: {
			...cfg.plugins,
			entries: {
				...cfg.plugins?.entries,
				codex: {
					...entry,
					config: {
						...pluginConfig,
						appServer: {
							...appServer,
							transport: "stdio",
							homeScope
						}
					}
				}
			}
		}
	});
}
async function extractRunWinnerError(plan, result) {
	const winnerProvider = result.meta?.executionTrace?.winnerProvider?.trim();
	const winnerModel = result.meta?.executionTrace?.winnerModel?.trim();
	if (!winnerProvider || !winnerModel) return "The inference run did not report which provider and model produced its reply.";
	if (winnerProvider === plan.provider) {
		if (winnerModel === plan.model) return;
		const { resolveDirectBundledProviderPolicySurface } = await import("./provider-policy-surface-9sddpXyM.js");
		if (resolveDirectBundledProviderPolicySurface(plan.provider)?.isResponseModelEquivalent?.({
			provider: plan.provider,
			requestedModelId: plan.model,
			responseModelId: winnerModel
		}) === true) return;
	}
	return `The inference run answered through ${winnerProvider}/${winnerModel} instead of the requested ${plan.provider}/${plan.model}. Disable model-routing overrides or choose the working route directly, then retry.`;
}
function resolveToolFreeCliSetupError(plan) {
	if (plan.runner !== "cli") return;
	const backend = resolveCliBackendConfig(plan.provider, plan.config, plan.agentId ? { agentId: plan.agentId } : {});
	if (backend?.sideQuestionToolMode === "disabled") return;
	const geminiCliProvider = parseRef(GEMINI_CLI_DEFAULT_MODEL_REF).provider;
	if (backend?.nativeToolMode === "none" && plan.provider !== geminiCliProvider) return;
	return plan.provider === geminiCliProvider ? "Gemini CLI cannot be used for inference-gated setup because it has no hard tool-free mode. Choose Claude Code, Codex, or an API-key provider; normal Gemini CLI agent runs remain available after setup." : `CLI backend ${backend?.id ?? plan.provider} cannot be used for inference-gated setup because it has no hard tool-free mode. Choose another inference provider.`;
}
function resolveStrictSetupAuthProfileError(params) {
	const profileId = params.plan.authProfileId?.trim();
	if (!profileId) return;
	const credential = (params.deps.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime)(params.plan.agentDir, {
		readOnly: true,
		allowKeychainPrompt: false,
		config: params.plan.config,
		externalCliProviderIds: [params.plan.provider]
	}).profiles[profileId];
	if (!credential) return `No credentials found for the configured setup profile "${profileId}".`;
	if (params.plan.runner === "embedded") {
		if (buildAgentRuntimeAuthPlan({
			provider: params.plan.provider,
			authProfileProvider: credential.provider,
			authProfileMode: credential.type,
			sessionAuthProfileId: profileId,
			config: params.plan.config,
			workspaceDir: params.workspaceDir,
			harnessId: params.plan.agentHarnessRuntimeOverride,
			harnessRuntime: params.plan.agentHarnessRuntimeOverride,
			allowHarnessAuthProfileForwarding: true
		}).forwardedAuthProfileId === profileId) return;
	} else {
		const aliasContext = {
			config: params.plan.config,
			workspaceDir: params.workspaceDir
		};
		try {
			if (resolveProviderIdForAuth(params.plan.provider, aliasContext) === resolveProviderIdForAuth(credential.provider, aliasContext)) return;
		} catch {
			return `Could not verify that configured setup profile "${profileId}" belongs to the selected ${params.plan.provider} inference route.`;
		}
	}
	return `Configured setup profile "${profileId}" belongs to ${credential.provider}, not the selected ${params.plan.provider} inference route.`;
}
function parseRef(modelRef) {
	const slash = modelRef.indexOf("/");
	return slash === -1 ? {
		provider: modelRef,
		model: ""
	} : {
		provider: modelRef.slice(0, slash),
		model: modelRef.slice(slash + 1)
	};
}
function projectSetupTargetModelMetadata(config, modelRef, agentId) {
	const target = parseRef(modelRef);
	const canonicalKey = modelKey(target.provider, target.model);
	const keys = new Set([
		canonicalKey,
		legacyModelKey(target.provider, target.model),
		`${target.provider}/${canonicalKey}`
	].filter((key) => Boolean(key)));
	const project = (models) => Object.fromEntries([...keys].map((key) => [key, Object.hasOwn(models ?? {}, key) ? {
		exists: true,
		value: structuredClone(models?.[key])
	} : { exists: false }]));
	const defaultAgentId = resolveAmbientOwnerAgentId(config, agentId);
	const agent = listAgentEntries(config).find((entry) => normalizeAgentId(entry.id) === defaultAgentId);
	return {
		defaultAgentId,
		defaults: project(config.agents?.defaults?.models),
		agent: project(agent?.models)
	};
}
function resolveSetupAgentRuntimeId(kind) {
	if (kind === "codex-cli") return "codex";
	if (kind === "openai-api-key" || kind === "anthropic-api-key" || kind === "api-key" || kind === "provider-auth" || parseProviderAutoSetupChoiceId(kind) !== void 0) return "openclaw";
}
const SETUP_STATUS_BY_FAILOVER_REASON = {
	auth: "auth",
	auth_permanent: "auth",
	format: "format",
	rate_limit: "rate_limit",
	overloaded: "rate_limit",
	billing: "billing",
	server_error: "unknown",
	timeout: "timeout",
	tls_certificate: "unknown",
	context_overflow: "unknown",
	model_not_found: "format",
	session_expired: "unknown",
	empty_response: "unknown",
	no_error_details: "unknown",
	unclassified: "unknown",
	unknown: "unknown"
};
function mapFailoverReasonToSetupStatus(reason) {
	return reason ? SETUP_STATUS_BY_FAILOVER_REASON[reason] ?? "unknown" : "unknown";
}
function prepareManualAuthForActivation(params) {
	const selectedProfile = params.profiles.find((profile) => profile.profileId === params.selectedProfileId);
	if (!selectedProfile) throw new Error("The selected setup credential was not returned by its provider.");
	const selectedProfileId = `${normalizeProviderId(selectedProfile.credential.provider) || "provider"}:setup-${randomUUID()}`;
	const profile = {
		...selectedProfile,
		profileId: selectedProfileId
	};
	return {
		config: projectManualInferenceConfig({
			...params,
			selectedProfile,
			selectedProfileId
		}),
		profiles: [profile],
		selectedProfileId
	};
}
function copySelectedModelMetadata(params) {
	const preparedDefaultModels = params.prepared.agents?.defaults?.models;
	if (preparedDefaultModels && Object.hasOwn(preparedDefaultModels, params.modelRef)) params.target.agents = {
		...params.target.agents,
		defaults: {
			...params.target.agents?.defaults,
			models: {
				...params.target.agents?.defaults?.models,
				[params.modelRef]: structuredClone(expectDefined(preparedDefaultModels[params.modelRef], "prepared default models entry at params.model ref"))
			}
		}
	};
	const defaultAgentId = resolveAmbientOwnerAgentId(params.target, params.agentId);
	const preparedAgent = listAgentEntries(params.prepared).find((agent) => normalizeAgentId(agent.id) === defaultAgentId);
	if (!preparedAgent?.models || !Object.hasOwn(preparedAgent.models, params.modelRef)) return;
	const targetEntryKey = Object.keys(params.target.agents?.entries ?? {}).find((agentId) => normalizeAgentId(agentId) === defaultAgentId);
	if (!targetEntryKey || !params.target.agents?.entries?.[targetEntryKey]) return;
	const nextEntries = structuredClone(params.target.agents.entries);
	const targetAgent = expectDefined(nextEntries[targetEntryKey], "target agent entry");
	targetAgent.models = {
		...targetAgent.models,
		[params.modelRef]: structuredClone(expectDefined(preparedAgent.models[params.modelRef], "models entry at params.model ref"))
	};
	params.target.agents = {
		...params.target.agents,
		entries: nextEntries
	};
}
function findSelectedProviderConfigKey(config, providerId) {
	const providers = config.models?.providers;
	if (!providers) return;
	if (Object.hasOwn(providers, providerId)) return providerId;
	const normalizedProvider = normalizeProviderId(providerId);
	return Object.keys(providers).find((candidate) => normalizeProviderId(candidate) === normalizedProvider);
}
/**
* Provider auth hooks are untrusted setup input. Carry only the selected
* inference route's config into the probe; OpenClaw owns every other setup
* surface after intelligence exists.
*/
function projectManualInferenceConfig(params) {
	const config = structuredClone(params.baseConfig);
	if (params.selectedProfile && params.selectedProfileId) {
		const metadata = params.preparedConfig.auth?.profiles?.[params.selectedProfile.profileId] ?? {
			provider: params.selectedProfile.credential.provider,
			mode: params.selectedProfile.credential.type
		};
		config.auth = {
			...config.auth,
			profiles: {
				...config.auth?.profiles,
				[params.selectedProfileId]: structuredClone(metadata)
			}
		};
	}
	const providerConfigKey = findSelectedProviderConfigKey(params.preparedConfig, params.providerId);
	if (providerConfigKey) {
		const preparedProvider = params.preparedConfig.models?.providers?.[providerConfigKey];
		if (preparedProvider === void 0) throw new Error(`Prepared provider config missing for ${providerConfigKey}`);
		config.models = {
			...config.models,
			providers: {
				...config.models?.providers,
				[providerConfigKey]: structuredClone(preparedProvider)
			}
		};
	}
	if (params.pluginId) {
		const preparedEntry = params.preparedConfig.plugins?.entries?.[params.pluginId];
		if (preparedEntry !== void 0) config.plugins = {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[params.pluginId]: structuredClone(preparedEntry)
			}
		};
	}
	copySelectedModelMetadata({
		target: config,
		prepared: params.preparedConfig,
		modelRef: params.modelRef,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return config;
}
function canonicalizeSetupModelRef(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider
	});
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex
	});
	return resolved ? `${resolved.ref.provider}/${resolved.ref.model}` : params.raw;
}
//#endregion
//#region src/system-agent/setup-inference-detect.ts
function resolveConfiguredCandidateKind(config, modelRef, agentId) {
	if (!modelRef) return;
	const ref = parseRef(modelRef);
	const runtime = normalizeOptionalAgentRuntimeId(resolveModelRuntimePolicy({
		config,
		provider: ref.provider,
		modelId: ref.model,
		agentId: resolveAmbientOwnerAgentId(config ?? {}, agentId)
	}).policy?.id);
	if (runtime === "codex") return "codex-cli";
	if (runtime === "claude-cli") return "claude-cli";
}
/**
* Manual setup options only — no CLI probing, no credential discovery. Used
* when guarded onboarding declines the "look around" step: the option lists
* derive from config and plugin manifests, never from scanning the machine.
*/
async function listManualSetupInferenceOptions(deps = {}, agentId) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const targetAgentId = resolveAmbientOwnerAgentId(cfg, agentId);
	const { workspace } = await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	});
	const authChoices = (deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: cfg,
		workspaceDir: workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).filter((choice) => (deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId).enabled);
	return {
		manualProviders: listSetupInferenceManualProviders(authChoices),
		authOptions: listSetupInferenceAuthOptions(authChoices),
		prepareOptions: listSetupInferencePrepareOptions(authChoices),
		workspace,
		setupComplete: Boolean(resolveAgentEffectiveModelPrimary(cfg, targetAgentId))
	};
}
async function detectSetupInference(deps = {}, agentId) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const targetAgentId = resolveAmbientOwnerAgentId(cfg, agentId);
	const detected = await (deps.detectInferenceBackends ?? detectInferenceBackends)({
		config: cfg,
		agentId: targetAgentId
	});
	const unavailableCandidates = [];
	const deferredUnavailableCandidates = [];
	const probe = deps.probeLocalCommand ?? probeLocalCommand;
	const [pi, opencode] = await Promise.all([probe("pi"), probe("opencode")]);
	if (pi.found && !pi.timedOut) deferredUnavailableCandidates.push({
		id: "pi-cli",
		label: "Pi CLI",
		detail: "installed",
		reason: "Pi CLI is installed, but its whole-agent sessions require separate setup and are not a reusable guided-setup inference route."
	});
	if (opencode.found && !opencode.timedOut) deferredUnavailableCandidates.push({
		id: "opencode-cli",
		label: "OpenCode CLI",
		detail: "installed",
		reason: "OpenCode CLI is installed, but its ACP harness requires separate setup and is not a reusable guided-setup inference route."
	});
	const configuredModel = detected.find((candidate) => candidate.kind === "existing-model")?.modelRef;
	const configuredCandidateKind = resolveConfiguredCandidateKind(cfg, configuredModel, targetAgentId);
	const raw = detected.filter((candidate) => candidate.kind !== "gemini-cli" && !(candidate.kind === configuredCandidateKind && configuredModel && areRuntimeModelRefsEquivalent(candidate.modelRef, configuredModel, { config: cfg })));
	const { workspace } = await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	});
	const authChoices = (deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: cfg,
		workspaceDir: workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).filter((choice) => (deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId).enabled);
	const manualProviders = listSetupInferenceManualProviders(authChoices);
	const authOptions = listSetupInferenceAuthOptions(authChoices);
	const prepareOptions = listSetupInferencePrepareOptions(authChoices);
	unavailableCandidates.push(...deferredUnavailableCandidates);
	const candidates = raw.map((candidate) => Object.assign(candidate, { recommended: false }, resolveCandidatePresentation(candidate, authChoices)));
	const discoveryChoices = authChoices.filter((choice) => choice.appGuidedDiscovery === true && supportsSetupTextInference(choice.onboardingScopes));
	if (discoveryChoices.length > 0) {
		const discovery = await withPluginLifecycleLease({}, async () => {
			let discoveryConfig = cfg;
			const enabledChoices = [];
			for (const choice of discoveryChoices) {
				if (!(await enablePluginWithCapabilityConsent(cfg, choice.pluginId, { workspaceDir: workspace })).enabled) continue;
				discoveryConfig = (deps.enablePluginInConfig ?? enablePluginInConfig)(discoveryConfig, choice.pluginId).config;
				enabledChoices.push(choice);
			}
			const providers = enabledChoices.length ? (deps.resolvePluginProviders ?? resolvePluginProvidersCore)({
				config: discoveryConfig,
				workspaceDir: workspace,
				mode: "setup",
				includeUntrustedWorkspacePlugins: false,
				onlyPluginIds: [...new Set(enabledChoices.map((choice) => choice.pluginId))]
			}) : [];
			return {
				discoveryConfig,
				enabledChoices,
				providers
			};
		});
		const discovered = await Promise.all(discovery.enabledChoices.map(async (choice) => {
			const method = discovery.providers.find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId(candidate.id) === normalizeProviderId(choice.providerId))?.auth.find((candidate) => candidate.id === choice.methodId);
			if (!method?.appGuidedSetup) return null;
			try {
				const candidate = await method.appGuidedSetup.detect({
					config: discovery.discoveryConfig,
					env: process.env,
					workspaceDir: workspace
				});
				if (!candidate) return null;
				const ref = parseRef(candidate.modelRef);
				if (!ref.model || normalizeProviderId(ref.provider) !== normalizeProviderId(choice.providerId)) {
					setupInferenceLog.warn(`Ignoring invalid app-guided model ${candidate.modelRef} from ${choice.choiceId}.`);
					return null;
				}
				return Object.assign({
					kind: toProviderAutoSetupKind(choice.choiceId),
					brandId: choice.providerId,
					label: choice.choiceLabel,
					detail: candidate.detail?.trim() || "available locally",
					modelRef: candidate.modelRef,
					recommended: false,
					credentials: true
				}, choice.icon ? { icon: choice.icon } : {}, choice.website ? { website: choice.website } : {});
			} catch (error) {
				setupInferenceLog.debug(`App-guided discovery failed for ${choice.choiceId}: ${formatErrorMessage(error)}`);
				return null;
			}
		}));
		candidates.push(...discovered.filter((candidate) => candidate !== null));
	}
	return {
		candidates,
		unavailableCandidates,
		manualProviders,
		authOptions,
		prepareOptions,
		recommendedInstalls: listRecommendedToolInstalls(),
		workspace,
		...configuredModel ? { configuredModel } : {},
		setupComplete: Boolean(configuredModel)
	};
}
//#endregion
export { redactSetupInferenceError as C, waitForProviderAuth as D, throwIfSetupInferenceCancelled as E, parseProviderAutoSetupChoiceId as S, setupInferenceLog as T, SetupInferenceActivationIndeterminateError as _, extractRunWinnerError as a, SetupInferenceOwnerDriftError as b, prepareManualAuthForActivation as c, resolveSetupAgentRuntimeId as d, resolveStrictSetupAuthProfileError as f, SETUP_INFERENCE_TEST_TIMEOUT_MS as g, SETUP_INFERENCE_TEST_PROMPT as h, configureCodexCliPreparedAuth as i, projectManualInferenceConfig as l, AUTO_LOCAL_MODEL_LEAN_ANNOUNCEMENT as m, listManualSetupInferenceOptions as n, mapFailoverReasonToSetupStatus as o, resolveToolFreeCliSetupError as p, canonicalizeSetupModelRef as r, parseRef as s, detectSetupInference as t, projectSetupTargetModelMetadata as u, SetupInferenceActivationUnavailableError as v, resolveSetupInferenceWorkspace as w, invalidSetupConfigError as x, SetupInferenceCancelledError as y };
