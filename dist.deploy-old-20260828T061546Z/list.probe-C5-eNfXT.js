import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput, v as resolveSecretInputRef } from "./types.secrets-Bre8L6Ts.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { r as resolveMergedModelProviderEntry } from "./model-provider-config-B3wTMsqG.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { l as resolveConfigSecretRef, n as copyConfigResolutionFacts, r as copyConfigResolutionFactsExcept } from "./resolution-facts-DIK_QG79.js";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-DRjRnS6Y.js";
import { t as resolveSecretRefString } from "./resolve-DvvnAG2w.js";
import { l as disposeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-BEQsKM0c.js";
import { n as listProfilesForProvider } from "./profile-list-CFe_FbXc.js";
import { a as resolveAuthProfileOrderWithMetadata, r as resolveAuthProfileEligibility } from "./order-BxFkXXxj.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-Dy2BML3M.js";
import { m as resolveAuthProfileDatabasePath } from "./sqlite-BsvahKHa.js";
import { n as clearRuntimeAuthProfileStoreSnapshot, r as ensureAuthProfileStore } from "./store-C6iqqcJy.js";
import { a as loadPreparedModelCatalog } from "./prepared-model-catalog-hBq_POnm.js";
import { t as resolveEnvApiKey } from "./model-auth-env-C2cLUS85.js";
import "./workspace-DJ__UUS2.js";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-wr_j3m1O.js";
import { i as externalCliDiscoveryScoped } from "./external-cli-discovery-kohNMVnn.js";
import { d as upsertAuthProfileWithLock } from "./profiles-FGrQtdwI.js";
import { a as hasSyntheticLocalProviderAuthConfig, b as resolveProviderEntryApiKeyProfileReference, o as hasUsableCustomProviderApiKey, x as resolveUsableCustomProviderApiKey, y as resolveProviderEntryApiKeyBinding } from "./model-auth-provider-config-6V9HXTpM.js";
import "./model-auth-BWLQILnV.js";
import "./model-selection-Cp8EGD61.js";
import { a as describeFailoverError } from "./failover-error-DVBvcQuA.js";
import { o as prepareSystemAgentRunAdmission } from "./admitted-run-context-KQIZywud.js";
import { n as removeInternalSessionEffectsSession, t as prepareInternalSessionEffectsSession } from "./internal-session-effects-DXOpVUug.js";
import { n as extractAgentRunTerminalError, t as agentRunHasVisibleReply } from "./agent-run-result-DFovjOVm.js";
import { n as formatMs } from "./shared-ShmnGmtF.js";
import { f as redactStatusSecrets } from "./format-RnFU6E2P.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import pMap from "p-map";
//#region src/commands/models/list.probe.models.ts
/** Groups configured model candidates by their requested provider identity. */
function buildProbeCandidateMap(modelCandidates) {
	const map = /* @__PURE__ */ new Map();
	for (const raw of modelCandidates) {
		const parsed = parseModelRef(raw ?? "", DEFAULT_PROVIDER);
		if (!parsed) continue;
		const list = map.get(parsed.provider) ?? [];
		if (!list.includes(parsed.model)) list.push(parsed.model);
		map.set(parsed.provider, list);
	}
	return map;
}
function probePriority(provider, modelId) {
	const id = modelId.trim().toLowerCase();
	if (provider !== "anthropic") return 50;
	if (/^claude-haiku-4-5-\d{8}$/.test(id)) return 0;
	if (id === "claude-haiku-4-5") return 1;
	if (id === "claude-sonnet-5" || id.startsWith("claude-sonnet-5-")) return 2;
	if (id === "claude-sonnet-4-6" || id.startsWith("claude-sonnet-4-6-")) return 3;
	if (id.startsWith("claude-sonnet-4-")) return 4;
	if (id.startsWith("claude-3-")) return 100;
	return 50;
}
/** Selects a requested-provider candidate before falling back to its catalog rows. */
function selectProbeModel(params) {
	const { provider, candidates, catalog } = params;
	const direct = candidates.get(provider)?.[0];
	if (direct) return {
		provider,
		model: direct
	};
	const fromCatalog = catalog.filter((entry) => normalizeProviderId(entry.provider) === provider && entry.status !== "deprecated" && entry.status !== "disabled").toSorted((a, b) => probePriority(provider, a.id) - probePriority(provider, b.id))[0];
	return fromCatalog ? {
		provider,
		model: fromCatalog.id
	} : null;
}
//#endregion
//#region src/commands/models/list.probe.ts
/** Auth probe planning and execution helpers for model diagnostics. */
const PROBE_PROMPT = "Reply with OK. Do not use tools.";
/** Scrubs credential-shaped text before probe failures cross a UI or CLI boundary. */
function redactAuthProbeError(error) {
	return redactStatusSecrets(error);
}
const embeddedRunnerModuleLoader = createLazyImportLoader(() => import("./embedded-agent-fNRs635m.js"));
function loadEmbeddedRunnerModule() {
	return embeddedRunnerModuleLoader.load();
}
const PROBE_STATUS_BY_FAILOVER_REASON = {
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
/** Maps runtime failover reasons into stable auth probe status buckets. */
function mapFailoverReasonToProbeStatus(reason) {
	return reason ? PROBE_STATUS_BY_FAILOVER_REASON[reason] ?? "unknown" : "unknown";
}
function mapEligibilityReasonToProbeReasonCode(reasonCode) {
	if (reasonCode === "missing_credential") return "missing_credential";
	if (reasonCode === "expired") return "expired";
	if (reasonCode === "invalid_expires") return "invalid_expires";
	if (reasonCode === "unresolved_ref") return "unresolved_ref";
	return "ineligible_profile";
}
function formatMissingCredentialProbeError(reasonCode) {
	const legacyLine = "Auth profile credentials are missing or expired.";
	if (reasonCode === "expired") return `${legacyLine}\n↳ Auth reason [expired]: token credentials are expired.`;
	if (reasonCode === "invalid_expires") return `${legacyLine}\n↳ Auth reason [invalid_expires]: token expires must be a positive Unix ms timestamp.`;
	if (reasonCode === "missing_credential") return `${legacyLine}\n↳ Auth reason [missing_credential]: no inline credential or SecretRef is configured.`;
	if (reasonCode === "unresolved_ref") return `${legacyLine}\n↳ Auth reason [unresolved_ref]: configured SecretRef could not be resolved.`;
	return `${legacyLine}\n↳ Auth reason [ineligible_profile]: profile is incompatible with provider config.`;
}
function resolveProbeSecretRef(profile, cfg) {
	const defaults = cfg.secrets?.defaults;
	if (profile.type === "api_key") return resolveSecretInputRef({
		value: profile.key,
		refValue: profile.keyRef,
		defaults
	}).ref;
	if (profile.type === "token") return resolveSecretInputRef({
		value: profile.token,
		refValue: profile.tokenRef,
		defaults
	}).ref;
	return null;
}
function formatUnresolvedRefProbeError(refLabel) {
	return `Auth profile credentials are missing or expired.\n↳ Auth reason [unresolved_ref]: could not resolve SecretRef "${refLabel}".`;
}
function withDirectCredential(cfg, provider, value, mode) {
	const providers = cfg.models?.providers ?? {};
	const configuredEntry = resolveMergedModelProviderEntry(cfg, provider);
	const configKey = configuredEntry?.providerKey ?? provider;
	const configured = configuredEntry?.providerConfig;
	if (!configured) return withoutProfileFallback(cfg, provider);
	const auth = mode === "oauth" || mode === "token" ? mode : "api-key";
	const next = {
		...cfg,
		models: {
			...cfg.models,
			providers: {
				...providers,
				[configKey]: {
					...configured,
					apiKey: value,
					auth
				}
			}
		},
		auth: {
			...cfg.auth,
			order: {
				...cfg.auth?.order,
				[provider]: []
			}
		}
	};
	copyConfigResolutionFactsExcept(cfg, next, [`models.providers.${configKey}.apiKey`]);
	return next;
}
function withoutProfileFallback(cfg, provider) {
	const next = {
		...cfg,
		auth: {
			...cfg.auth,
			order: {
				...cfg.auth?.order,
				[provider]: []
			}
		}
	};
	copyConfigResolutionFacts(cfg, next);
	return next;
}
async function resolveConfiguredProbeCredential(params) {
	const ref = resolveConfigSecretRef({
		config: params.cfg,
		path: params.path,
		value: params.input,
		defaults: params.cfg.secrets?.defaults
	});
	if (!ref) return normalizeSecretInputString(params.input) ?? null;
	try {
		return await resolveSecretRefString(ref, {
			config: params.cfg,
			env: process.env,
			cache: params.cache
		});
	} catch {
		return null;
	}
}
async function maybeResolveUnresolvedRefIssue(params) {
	if (!params.profile) return null;
	const ref = resolveProbeSecretRef(params.profile, params.cfg);
	if (!ref) return null;
	try {
		await resolveSecretRefString(ref, {
			config: params.cfg,
			env: process.env,
			cache: params.cache
		});
		return null;
	} catch {
		return {
			reasonCode: "unresolved_ref",
			error: formatUnresolvedRefProbeError(`${ref.source}:${ref.provider}:${ref.id}`)
		};
	}
}
/** Builds probe targets plus preflight failures for missing/invalid credentials. */
async function buildProbeTargets(params) {
	const { cfg, agentDir, providers, modelCandidates, options, workspaceDir } = params;
	const authAliasLookupParams = {
		config: cfg,
		workspaceDir
	};
	const store = ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryScoped({
		config: cfg,
		allowKeychainPrompt: false,
		providerIds: providers.map((provider) => resolveProviderIdForAuth(provider, authAliasLookupParams)),
		profileIds: options.profileIds
	}) });
	const providerFilter = options.provider?.trim();
	const providerFilterKey = providerFilter ? normalizeProviderId(providerFilter) : null;
	const profileFilter = new Set(normalizeUniqueStringEntries(options.profileIds));
	const refResolveCache = {};
	const catalog = await loadPreparedModelCatalog({
		config: cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...agentDir ? { agentDir } : {},
		...workspaceDir ? { workspaceDir } : {},
		readOnly: true,
		providerDiscoveryProviderIds: providers
	});
	const candidates = buildProbeCandidateMap(modelCandidates);
	const targets = [];
	const results = [];
	for (const provider of providers) {
		const providerKey = normalizeProviderId(provider);
		const authProviderKey = resolveProviderIdForAuth(providerKey, authAliasLookupParams);
		if (providerFilterKey && providerKey !== providerFilterKey) continue;
		const model = selectProbeModel({
			provider: providerKey,
			candidates,
			catalog
		});
		const configuredProviderEntry = resolveMergedModelProviderEntry(cfg, providerKey);
		const configuredProvider = configuredProviderEntry?.providerConfig;
		const hasConfiguredProviderSecretRef = Boolean(configuredProviderEntry && resolveConfigSecretRef({
			config: cfg,
			path: `models.providers.${configuredProviderEntry.providerKey}.apiKey`,
			value: configuredProvider?.apiKey,
			defaults: cfg.secrets?.defaults
		}));
		const includeDirectKeys = options.includeDirectKeys === true && profileFilter.size === 0;
		const includeConfigKey = includeDirectKeys && profileFilter.size === 0 && hasConfiguredSecretInput(configuredProvider?.apiKey, cfg.secrets?.defaults);
		const profileIds = [.../* @__PURE__ */ new Set([...listProfilesForProvider(store, authProviderKey), ...authProviderKey === providerKey ? [] : listProfilesForProvider(store, providerKey)])];
		const configuredReference = includeConfigKey ? resolveProviderEntryApiKeyProfileReference({
			cfg,
			provider: providerKey,
			store
		}) : { kind: "none" };
		const configuredBinding = configuredReference.kind === "profile" && !profileIds.includes(configuredReference.profileId) ? await resolveProviderEntryApiKeyBinding({
			cfg,
			provider: providerKey,
			store,
			agentDir
		}) : null;
		const configuredValue = configuredProviderEntry && includeConfigKey && configuredReference.kind !== "profile" && configuredReference.kind !== "profile-incompatible" ? configuredReference.kind === "marker" ? resolveUsableCustomProviderApiKey({
			cfg,
			provider: providerKey,
			env: process.env
		})?.apiKey ?? null : await resolveConfiguredProbeCredential({
			cfg,
			input: configuredProvider?.apiKey,
			path: `models.providers.${configuredProviderEntry.providerKey}.apiKey`,
			cache: refResolveCache
		}) : null;
		const configuredMode = configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token" ? configuredProvider.auth : "api_key";
		const resolvedEnvironmentValue = includeDirectKeys && !hasConfiguredProviderSecretRef ? resolveEnvApiKey(authProviderKey, process.env, {
			config: cfg,
			workspaceDir
		}) : null;
		const environmentValue = resolvedEnvironmentValue?.apiKey === configuredValue ? null : resolvedEnvironmentValue;
		const configuredTargetLabel = configuredReference.kind === "marker" && configuredValue && isNonSecretApiKeyMarker(configuredValue, { includeEnvVarName: false }) ? "provider" : "config";
		const appendDirectTargets = () => {
			if (includeConfigKey) if (configuredReference.kind === "profile-incompatible") results.push({
				provider: providerKey,
				model: model ? `${model.provider}/${model.model}` : void 0,
				profileId: configuredReference.profileId,
				label: "config",
				source: "models.json",
				mode: configuredMode,
				status: "unknown",
				reasonCode: "ineligible_profile",
				error: "Configured API key references an incompatible auth profile."
			});
			else if (configuredReference.kind === "profile") {
				if (!profileIds.includes(configuredReference.profileId)) if (configuredBinding?.kind === "profile-resolved" && model) targets.push({
					provider: providerKey,
					model,
					profileId: configuredBinding.auth.profileId,
					label: "config",
					source: "models.json",
					mode: configuredBinding.auth.mode,
					boundValue: configuredBinding.auth.apiKey
				});
				else results.push({
					provider: providerKey,
					model: model ? `${model.provider}/${model.model}` : void 0,
					profileId: configuredReference.profileId,
					label: "config",
					source: "models.json",
					mode: configuredMode,
					status: model ? "unknown" : "no_model",
					reasonCode: model ? "unresolved_ref" : "no_model",
					error: model ? "Configured auth profile could not be resolved." : "No model available for probe"
				});
			} else if (!configuredValue) results.push({
				provider: providerKey,
				model: model ? `${model.provider}/${model.model}` : void 0,
				label: "config",
				source: "models.json",
				mode: configuredMode,
				status: model ? "unknown" : "no_model",
				reasonCode: model ? "unresolved_ref" : "no_model",
				error: model ? "Configured API key could not be resolved." : "No model available for probe"
			});
			else if (model) targets.push({
				provider: providerKey,
				model,
				label: configuredTargetLabel,
				source: "models.json",
				mode: configuredMode,
				boundValue: configuredValue,
				...configuredReference.kind === "marker" ? { useRuntimeAuth: true } : {}
			});
			else results.push({
				provider: providerKey,
				model: void 0,
				label: configuredTargetLabel,
				source: "models.json",
				mode: configuredMode,
				status: "no_model",
				reasonCode: "no_model",
				error: "No model available for probe"
			});
			if (environmentValue) {
				const mode = configuredProvider?.auth === "oauth" || configuredProvider?.auth === "token" ? configuredProvider.auth : environmentValue.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key";
				if (model) targets.push({
					provider: providerKey,
					model,
					label: environmentValue.source,
					source: "env",
					mode,
					boundValue: environmentValue.apiKey
				});
				else results.push({
					provider: providerKey,
					model: void 0,
					label: environmentValue.source,
					source: "env",
					mode,
					status: "no_model",
					reasonCode: "no_model",
					error: "No model available for probe"
				});
			}
		};
		const explicitOrder = findNormalizedProviderValue(store.order, authProviderKey) ?? findNormalizedProviderValue(store.order, providerKey) ?? findNormalizedProviderValue(cfg?.auth?.order, authProviderKey) ?? findNormalizedProviderValue(cfg?.auth?.order, providerKey);
		const orderResolution = resolveAuthProfileOrderWithMetadata({
			cfg,
			store,
			provider: providerKey,
			forModel: model?.model
		});
		const allowedProfiles = orderResolution.hasExplicitOrder ? new Set(orderResolution.profileIds) : null;
		const filteredProfiles = profileFilter.size ? profileIds.filter((id) => profileFilter.has(id)) : profileIds;
		if (filteredProfiles.length > 0) {
			for (const profileId of filteredProfiles) {
				const profile = store.profiles[profileId];
				const mode = profile?.type;
				const label = resolveAuthProfileDisplayLabel({
					cfg,
					store,
					profileId
				});
				const isConfigBoundProfile = includeConfigKey && configuredReference.kind === "profile" && profileId === configuredReference.profileId;
				if (!isConfigBoundProfile && explicitOrder && !explicitOrder.includes(profileId)) {
					results.push({
						provider: providerKey,
						profileId,
						model: model ? `${model.provider}/${model.model}` : void 0,
						label,
						source: "profile",
						mode,
						status: "unknown",
						reasonCode: "excluded_by_auth_order",
						error: "Excluded by auth.order for this provider."
					});
					continue;
				}
				if (!isConfigBoundProfile && allowedProfiles && !allowedProfiles.has(profileId)) {
					const reasonCode = mapEligibilityReasonToProbeReasonCode(resolveAuthProfileEligibility({
						cfg,
						store,
						provider: providerKey,
						profileId
					}).reasonCode);
					results.push({
						provider: providerKey,
						model: model ? `${model.provider}/${model.model}` : void 0,
						profileId,
						label,
						source: "profile",
						mode,
						status: "unknown",
						reasonCode,
						error: formatMissingCredentialProbeError(reasonCode)
					});
					continue;
				}
				const unresolvedRefIssue = await maybeResolveUnresolvedRefIssue({
					cfg,
					profile,
					cache: refResolveCache
				});
				if (unresolvedRefIssue) {
					results.push({
						provider: providerKey,
						model: model ? `${model.provider}/${model.model}` : void 0,
						profileId,
						label,
						source: "profile",
						mode,
						status: "unknown",
						reasonCode: unresolvedRefIssue.reasonCode,
						error: unresolvedRefIssue.error
					});
					continue;
				}
				if (!model) {
					results.push({
						provider: providerKey,
						model: void 0,
						profileId,
						label,
						source: "profile",
						mode,
						status: "no_model",
						reasonCode: "no_model",
						error: "No model available for probe"
					});
					continue;
				}
				targets.push({
					provider: providerKey,
					model,
					profileId,
					label,
					source: "profile",
					mode
				});
			}
			appendDirectTargets();
			continue;
		}
		if (profileFilter.size > 0) continue;
		appendDirectTargets();
		if (includeConfigKey || environmentValue) continue;
		const hasUsableModelsJsonKey = hasUsableCustomProviderApiKey(cfg, providerKey);
		const hasSyntheticLocalAuth = hasSyntheticLocalProviderAuthConfig({
			cfg,
			provider: providerKey
		});
		if (orderResolution.hasExplicitOrder && !hasUsableModelsJsonKey && !hasSyntheticLocalAuth) continue;
		const envKey = orderResolution.hasExplicitOrder || hasConfiguredProviderSecretRef ? null : resolveEnvApiKey(authProviderKey, process.env, {
			config: cfg,
			workspaceDir
		});
		if (!envKey && !hasUsableModelsJsonKey && !hasSyntheticLocalAuth) continue;
		const label = envKey ? "env" : "models.json";
		const source = envKey ? "env" : "models.json";
		const mode = envKey?.source.includes("OAUTH_TOKEN") ? "oauth" : "api_key";
		if (!model) {
			results.push({
				provider: providerKey,
				model: void 0,
				label,
				source,
				mode,
				status: "no_model",
				reasonCode: "no_model",
				error: "No model available for probe"
			});
			continue;
		}
		targets.push({
			provider: providerKey,
			model,
			label,
			source,
			mode,
			...hasSyntheticLocalAuth && !envKey && !hasUsableModelsJsonKey ? { useRuntimeAuth: true } : {}
		});
	}
	return {
		targets,
		results
	};
}
async function probeTarget(params) {
	const { cfg, agentId, agentDir, workspaceDir, storePath, target, timeoutMs, maxTokens } = params;
	const probeConfig = target.useRuntimeAuth ? withoutProfileFallback(cfg, target.provider) : !target.boundValue ? cfg : withDirectCredential(cfg, target.provider, target.boundValue, target.mode);
	if (!target.model) return {
		provider: target.provider,
		model: void 0,
		profileId: target.profileId,
		label: target.label,
		source: target.source,
		mode: target.mode,
		status: "no_model",
		reasonCode: "no_model",
		error: "No model available for probe"
	};
	const model = target.model;
	const runId = `probe-${target.provider}-${crypto.randomUUID()}`;
	let isolatedAgentDir = null;
	let isolatedProfileId;
	let sessionTarget;
	let preparedRunAdmission;
	const start = Date.now();
	const buildResult = (status, error) => ({
		provider: target.provider,
		model: `${model.provider}/${model.model}`,
		profileId: target.profileId,
		label: target.label,
		source: target.source,
		mode: target.mode,
		status,
		...error ? { error } : {},
		latencyMs: Date.now() - start
	});
	try {
		sessionTarget = await prepareInternalSessionEffectsSession({
			agentId,
			cwd: workspaceDir,
			runId,
			storePath
		});
		if (target.boundValue || target.useRuntimeAuth) isolatedAgentDir = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-auth-probe-")));
		if (target.boundValue && !target.useRuntimeAuth && isolatedAgentDir) {
			isolatedProfileId = `${target.provider}:probe-${crypto.randomUUID()}`;
			const value = target.boundValue;
			const profile = target.mode === "oauth" ? {
				type: "oauth",
				provider: target.provider,
				access: value,
				refresh: "not-a-real",
				expires: Date.now() + 3600 * 1e3
			} : target.mode === "token" ? {
				type: "token",
				provider: target.provider,
				token: value
			} : {
				type: "api_key",
				provider: target.provider,
				key: value
			};
			if (!await upsertAuthProfileWithLock({
				profileId: isolatedProfileId,
				credential: profile,
				agentDir: isolatedAgentDir
			})) throw new Error("Could not prepare isolated auth probe profile");
		}
		const { runEmbeddedAgent } = await loadEmbeddedRunnerModule();
		preparedRunAdmission = prepareSystemAgentRunAdmission(probeConfig, runId, agentId, "models.auth-probe");
		const runResult = await runEmbeddedAgent({
			preparedRunAdmission,
			sessionId: sessionTarget.sessionId,
			sessionKey: sessionTarget.sessionKey,
			sessionTarget,
			agentId,
			workspaceDir,
			agentDir: isolatedAgentDir ?? agentDir,
			config: probeConfig,
			prompt: PROBE_PROMPT,
			provider: target.model.provider,
			model: target.model.model,
			modelFallbacksOverride: [],
			authProfileId: isolatedProfileId ?? target.profileId,
			authProfileIdSource: isolatedProfileId || target.profileId ? "user" : void 0,
			timeoutMs,
			runId,
			lane: `auth-probe:${target.provider}:${target.profileId ?? target.source}`,
			thinkLevel: "off",
			reasoningLevel: "off",
			verboseLevel: "off",
			streamParams: { maxTokens },
			agentHarnessRuntimeOverride: "openclaw",
			disableTools: true,
			modelRun: true,
			cleanupBundleMcpOnRunEnd: true,
			...isolatedAgentDir ? { preparedModelRuntimeMode: "isolated-read-only" } : {},
			abortSignal: params.abortSignal
		});
		const terminalError = extractAgentRunTerminalError(runResult);
		if (terminalError) {
			const described = describeFailoverError(new Error(terminalError));
			return buildResult(mapFailoverReasonToProbeStatus(described.reason), redactAuthProbeError(described.message));
		}
		if (!agentRunHasVisibleReply(runResult)) return buildResult("format", "The model did not return a visible probe response.");
		return buildResult("ok");
	} catch (err) {
		const described = describeFailoverError(err);
		return buildResult(mapFailoverReasonToProbeStatus(described.reason), redactAuthProbeError(described.message));
	} finally {
		preparedRunAdmission?.close();
		await removeInternalSessionEffectsSession(sessionTarget);
		if (isolatedAgentDir) {
			clearRuntimeAuthProfileStoreSnapshot(isolatedAgentDir);
			disposeOpenClawAgentDatabaseByPath(resolveAuthProfileDatabasePath(isolatedAgentDir));
			await fs.rm(isolatedAgentDir, {
				recursive: true,
				force: true
			});
		}
	}
}
async function runTargetsWithConcurrency(params) {
	const { cfg, targets, timeoutMs, maxTokens, onProgress } = params;
	const concurrency = Math.max(1, Math.min(targets.length || 1, params.concurrency));
	const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
	const agentDir = params.agentDir ?? resolveAgentDir(cfg, agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	await fs.mkdir(workspaceDir, { recursive: true });
	let completed = 0;
	return await pMap(targets, async (target) => {
		onProgress?.({
			completed,
			total: targets.length,
			label: `Probing ${target.provider}${target.profileId ? ` (${target.label})` : ""}`
		});
		const result = await probeTarget({
			cfg,
			agentId,
			agentDir,
			workspaceDir,
			storePath,
			target,
			timeoutMs,
			maxTokens,
			abortSignal: params.abortSignal
		});
		completed += 1;
		onProgress?.({
			completed,
			total: targets.length
		});
		return result;
	}, {
		concurrency,
		stopOnError: true,
		...params.abortSignal ? { signal: params.abortSignal } : {}
	});
}
function formatActiveGatewayModelsProbeRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Stop the Gateway first (${formatCliCommand("openclaw gateway stop")}), then rerun models status --probe.`;
}
/** Own canonical state only for direct CLI probes; Gateway RPC probes already run under its lock. */
async function withAuthProbeStateOwnership(ownership, run) {
	if (!ownership) return await run();
	const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-jf6c1djH.js");
	const signalBridge = createEmbeddedStateSignalBridge(ownership.process ?? process);
	let stateLock;
	try {
		stateLock = await acquireEmbeddedStateLock({
			options: ownership.gatewayLockOptions,
			signal: signalBridge.signal,
			formatActiveGatewayRefusal: formatActiveGatewayModelsProbeRefusal
		});
		return await run(signalBridge.signal);
	} finally {
		await stateLock?.release();
		signalBridge.dispose();
	}
}
/** Runs all auth probes with bounded concurrency and returns a summary. */
async function runAuthProbes(params) {
	return await withAuthProbeStateOwnership(params.stateOwnership, async (abortSignal) => {
		const startedAt = Date.now();
		const plan = await buildProbeTargets({
			cfg: params.cfg,
			...params.agentId ? { agentId: params.agentId } : {},
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			providers: params.providers,
			modelCandidates: params.modelCandidates,
			options: params.options
		});
		const totalTargets = plan.targets.length;
		params.onProgress?.({
			completed: 0,
			total: totalTargets
		});
		const results = totalTargets ? await runTargetsWithConcurrency({
			cfg: params.cfg,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			targets: plan.targets,
			timeoutMs: params.options.timeoutMs,
			maxTokens: params.options.maxTokens,
			concurrency: params.options.concurrency,
			onProgress: params.onProgress,
			abortSignal
		}) : [];
		const finishedAt = Date.now();
		return {
			startedAt,
			finishedAt,
			durationMs: finishedAt - startedAt,
			totalTargets,
			options: params.options,
			results: [...plan.results, ...results]
		};
	});
}
/** Formats probe latency for table output. */
function formatProbeLatency(latencyMs) {
	if (!latencyMs && latencyMs !== 0) return "-";
	return formatMs(latencyMs);
}
/** Sorts probe results by provider and display label. */
function sortProbeResults(results) {
	return results.slice().toSorted((a, b) => {
		const provider = a.provider.localeCompare(b.provider);
		if (provider !== 0) return provider;
		const aLabel = a.label || a.profileId || "";
		const bLabel = b.label || b.profileId || "";
		return aLabel.localeCompare(bLabel);
	});
}
/** Produces the terse completion line for auth probe output. */
function describeProbeSummary(summary) {
	if (summary.totalTargets === 0) return "No probe targets.";
	return `Probed ${summary.totalTargets} target${summary.totalTargets === 1 ? "" : "s"} in ${formatMs(summary.durationMs)}`;
}
//#endregion
export { redactAuthProbeError as a, withAuthProbeStateOwnership as c, mapFailoverReasonToProbeStatus as i, describeProbeSummary as n, runAuthProbes as o, formatProbeLatency as r, sortProbeResults as s, buildProbeTargets as t };
