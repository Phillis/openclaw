import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { g as resolveSessionAgentIds } from "./agent-scope-BizOtGGz.js";
import { l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { _ as isDefaultAgentRuntimeId, i as isOpenAIProvider, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
import { a as unwrapSecretSentinelsForProviderEgress, i as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BZ7aTRBx.js";
import { Pt as listSessionEntriesCore, Qt as loadSessionEntry } from "./session-accessor-Bi6bzKQE.js";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore } from "./store-2zwMbXSG.js";
import { a as isCliRuntimeProvider, i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DoD-DaGs.js";
import { l as resolveAgentHarnessPreparedAuthSupport, u as resolveAgentHarnessPreparedRouteSupport } from "./thinking-runtime-F3zRbZ0D.js";
import { r as applySecretRefHeaderSentinels } from "./model-auth-Dv8Z8nNS.js";
import { a as resolveAgentRunSessionTarget } from "./builtin-openclaw-FyAH3ReK.js";
import { r as prepareAgentRuntimeAuth, t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-GozlON-Q.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-9Zisrbl5.js";
import { r as resolveModelAsync } from "./model-BsbKjtEM.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BwpyFizB.js";
import { c as selectAgentHarness, l as selectAgentHarnessForPreparedModelProviders, r as resolveAgentHarnessNativeToolPolicyRestricted } from "./selection-DW5A2v-w.js";
import { n as resolvePreparedRuntimeModelAuth, t as resolvePreparedRuntimeAuthAttempts } from "./resolve-auth-DqRqAIhp.js";
import path from "node:path";
//#region src/agents/harness/compaction-recovery.ts
/** Returns whether a native harness failure reason indicates a recoverable binding issue. */
function isRecoverableNativeHarnessBindingReason(reason) {
	if (typeof reason !== "string") return false;
	const normalized = reason.trim().toLowerCase();
	return normalized === "missing_thread_binding" || normalized === "stale_thread_binding" || normalized.includes("thread not found") || normalized.includes("no thread binding");
}
/** Returns whether a compact result failed due to a recoverable native binding issue. */
function isRecoverableNativeHarnessBindingFailure(result) {
	return result?.ok === false && (isRecoverableNativeHarnessBindingReason(result.failure?.reason) || isRecoverableNativeHarnessBindingReason(result.reason));
}
//#endregion
//#region src/agents/harness/compaction.ts
/**
* Routes compaction through selected native agent harnesses when supported.
*/
const log = createSubsystemLogger("agents/harness-compaction");
function runtimePlanRequiresHostApiKey(plan) {
	return plan?.modelRoute?.authRequirement === "api-key";
}
function resolveHarnessCompactIdentity(params) {
	const agentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	return {
		agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId),
		agentId: params.agentId ?? agentIds.sessionAgentId
	};
}
function stripHarnessOwnedAuthInputs(params) {
	const result = { ...params };
	delete result.resolvedApiKey;
	delete result.runtimeModel;
	return result;
}
function buildHarnessCompactionModelProvider(params) {
	const route = params.plan?.modelRoute;
	return {
		api: route?.api ?? params.model?.api,
		baseUrl: route?.baseUrl ?? params.model?.baseUrl,
		...resolveAgentHarnessPreparedRouteSupport(params.plan),
		...params.plan ? { preparedAuth: resolveAgentHarnessPreparedAuthSupport({
			plan: params.plan,
			source: params.attempt?.kind === "implicit" ? void 0 : params.attempt?.kind
		}) } : {}
	};
}
async function resolveHarnessCompactApiKey(params) {
	const { agentDir, compactParams, initialHarness } = params;
	if (!compactParams.provider?.trim() || !compactParams.model?.trim()) {
		const existing = compactParams.resolvedApiKey?.trim();
		return existing ? {
			harness: initialHarness,
			apiKey: existing
		} : { harness: initialHarness };
	}
	const provider = compactParams.provider;
	const modelId = compactParams.model;
	const providedRuntimeAuthPlan = compactParams.runtimeAuthPlan ?? compactParams.runtimePlan?.auth;
	const reusableRuntimeAuthPlan = providedRuntimeAuthPlan && agentRuntimeAuthPlanMatchesTarget(providedRuntimeAuthPlan, {
		provider,
		modelId
	}) ? providedRuntimeAuthPlan : void 0;
	const workspaceDir = resolveUserPath(compactParams.workspaceDir);
	const callerRuntimeModel = compactParams.runtimeModel;
	const fallbackResolution = (harness, runtimeModel, runtimeAuthPlan) => {
		const apiKey = compactParams.resolvedApiKey?.trim() || void 0;
		if (harness.authBootstrap === "harness" && !runtimeAuthPlan && apiKey) throw new Error(`Unable to prepare a route-locked native compaction attempt for ${provider}/${modelId}; refusing harness-owned ambient auth.`);
		return {
			harness,
			...apiKey ? { apiKey } : {},
			...runtimeModel ? { runtimeModel } : {},
			...runtimeAuthPlan ? { runtimeAuthPlan } : {}
		};
	};
	const selectPreparedHarness = (attempts, preparedModel) => selectAgentHarnessForPreparedModelProviders({
		provider,
		modelId,
		modelProviders: attempts.map((attempt) => buildHarnessCompactionModelProvider({
			model: preparedModel,
			plan: attempt.plan,
			attempt
		})),
		config: compactParams.config,
		agentId: parseAgentSessionKey(params.sessionKey) ? void 0 : params.agentId,
		sessionKey: params.sessionKey,
		agentHarnessId: params.pinnedHarnessId
	});
	if (reusableRuntimeAuthPlan) {
		const reusableHarness = selectPreparedHarness([{
			kind: "implicit",
			plan: reusableRuntimeAuthPlan
		}], callerRuntimeModel);
		if ((reusableHarness.authBootstrap === "harness" || reusableRuntimeAuthPlan.harnessAuthProvider) && !runtimePlanRequiresHostApiKey(reusableRuntimeAuthPlan)) return fallbackResolution(reusableHarness, callerRuntimeModel, reusableRuntimeAuthPlan);
	}
	const resolvePreparedModel = ({ config, authProfileId: profileId, authProfileMode }) => resolveModelAsync(provider, modelId, agentDir, config, {
		authProfileId: profileId,
		authProfileMode,
		skipAgentDiscovery: true,
		allowBundledStaticCatalogFallback: true,
		preferBundledStaticCatalogTransport: true,
		workspaceDir,
		agentId: params.agentId,
		...compactParams.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
	});
	let model = callerRuntimeModel;
	if (!model) try {
		model = (await resolveModelAsync(provider, modelId, agentDir, compactParams.config, {
			authProfileId: reusableRuntimeAuthPlan?.forwardedAuthProfileId ?? compactParams.authProfileId?.trim() ?? void 0,
			workspaceDir,
			agentId: params.agentId,
			...compactParams.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
		})).model;
	} catch (error) {
		log.warn(`native compaction model resolution failed for ${provider}/${modelId}: ${error instanceof Error ? error.message : String(error)}`);
		return fallbackResolution(initialHarness);
	}
	if (!model) return fallbackResolution(initialHarness);
	const runtimeAuthProfileStore = isOpenAIProvider(provider) ? ensureAuthProfileStore(agentDir, {
		externalCliProviderIds: ["openai"],
		allowKeychainPrompt: false
	}) : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
	const prepareRuntimeAuth = (harness) => prepareAgentRuntimeAuth({
		provider,
		modelId,
		modelApi: model.api,
		modelBaseUrl: model.baseUrl,
		config: compactParams.config,
		env: process.env,
		agentDir,
		workspaceDir,
		authProfileStore: runtimeAuthProfileStore,
		sessionAuthProfileId: compactParams.authProfileId,
		sessionAuthProfileSource: compactParams.authProfileIdSource,
		harnessId: harness.id,
		harnessRuntime: harness.id,
		harnessAuthBootstrap: harness.authBootstrap
	});
	let preparation;
	if (reusableRuntimeAuthPlan) preparation = {
		plan: reusableRuntimeAuthPlan,
		attempts: [{
			kind: "implicit",
			plan: reusableRuntimeAuthPlan
		}]
	};
	else try {
		preparation = prepareRuntimeAuth(initialHarness);
	} catch (error) {
		log.warn(`native compaction auth preparation failed for ${provider}/${modelId}: ${error instanceof Error ? error.message : String(error)}`);
		return fallbackResolution(initialHarness, model);
	}
	let harness = params.pinnedHarnessId ? initialHarness : selectPreparedHarness(preparation.attempts, model);
	if (!params.pinnedHarnessId && !reusableRuntimeAuthPlan && harness.id !== initialHarness.id) {
		try {
			preparation = prepareRuntimeAuth(harness);
		} catch (error) {
			log.warn(`native compaction auth preparation failed for ${provider}/${modelId}: ${error instanceof Error ? error.message : String(error)}`);
			return fallbackResolution(harness, model);
		}
		const confirmedHarness = selectPreparedHarness(preparation.attempts, model);
		if (confirmedHarness.id !== harness.id) throw new Error(`Prepared native compaction auth routes did not converge on one agent harness for ${provider}/${modelId}.`);
		harness = confirmedHarness;
	}
	const materializeModel = async (input) => {
		const materialized = await materializePreparedRuntimeModel({
			plan: input.plan,
			provider,
			modelId,
			config: compactParams.config,
			model: input.model,
			forceResolve: input.forceResolve,
			rejectMismatchedModel: true,
			resolveModel: resolvePreparedModel
		});
		if (!materialized) throw new Error(`Unable to materialize ${provider}/${modelId} for native compaction.`);
		return applySecretRefHeaderSentinels(materialized, compactParams.config);
	};
	let resolved;
	try {
		resolved = await resolvePreparedRuntimeAuthAttempts({
			attempts: preparation.attempts,
			store: runtimeAuthProfileStore,
			modelId,
			model,
			materializeModel,
			resolveAuth: async ({ attempt, model: attemptModel }) => {
				if ((harness.authBootstrap === "harness" || attempt.plan.harnessAuthProvider) && !runtimePlanRequiresHostApiKey(attempt.plan)) return {
					plan: attempt.plan,
					auth: {}
				};
				const existing = attempt.plan.forwardedAuthProfileSource === "auto" && Boolean(attempt.plan.forwardedAuthProfileId || attempt.plan.forwardedAuthProfileCandidateIds?.length) ? void 0 : compactParams.resolvedApiKey?.trim();
				if (existing) return {
					plan: attempt.plan,
					auth: { apiKey: existing }
				};
				const auth = await resolvePreparedRuntimeModelAuth({
					plan: attempt.plan,
					model: attemptModel,
					cfg: compactParams.config,
					store: runtimeAuthProfileStore,
					agentDir,
					workspaceDir,
					...attempt.allowAuthProfileFallback !== void 0 ? { allowAuthProfileFallback: attempt.allowAuthProfileFallback } : {},
					secretSentinels: true
				});
				return {
					plan: auth.plan,
					auth: { apiKey: auth.auth.apiKey?.trim() || void 0 }
				};
			},
			errorMessage: `Prepared native compaction auth attempts could not be resolved for ${provider}/${modelId}.`
		});
	} catch (error) {
		log.warn(`native compaction prepared auth resolution failed for ${provider}/${modelId}: ${error instanceof Error ? error.message : String(error)}`);
		return fallbackResolution(harness, model, preparation.plan);
	}
	return {
		harness,
		apiKey: resolved.auth.apiKey,
		runtimeModel: resolved.model,
		runtimeAuthPlan: resolved.plan
	};
}
/** Runs harness-provided compaction when the selected runtime supports it. */
async function maybeCompactAgentHarnessSession(params, options = {}) {
	const selectedRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const pinnedHarnessId = selectedRuntime && !isDefaultAgentRuntimeId(selectedRuntime) ? selectedRuntime : void 0;
	if (!pinnedHarnessId && params.provider && isCliRuntimeProvider(params.provider, { config: params.config })) return;
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const runtimePolicyAgentId = params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId;
	const runtimeAuthPlan = params.runtimeAuthPlan ?? params.runtimePlan?.auth;
	const modelRoute = runtimeAuthPlan?.modelRoute;
	if (runtimeAuthPlan && modelRoute && (!params.provider || !params.model || !agentRuntimeAuthPlanMatchesTarget(runtimeAuthPlan, {
		provider: params.provider,
		modelId: params.model ?? ""
	}))) throw new Error(`Prepared runtime auth route ${modelRoute.provider}/${modelRoute.modelId} does not match the compaction target ${params.provider ?? "unknown"}/${params.model ?? "unknown"}.`);
	const runtime = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	}).runtime;
	if (isCliRuntimeAliasForProvider({
		runtime: pinnedHarnessId ?? runtime,
		provider: params.provider,
		cfg: params.config
	})) return;
	const harnessSelectionParams = {
		provider: params.provider ?? "",
		modelId: params.model,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessId: pinnedHarnessId
	};
	let harness = runtimeAuthPlan ? selectAgentHarnessForPreparedModelProviders({
		...harnessSelectionParams,
		modelProviders: [buildHarnessCompactionModelProvider({
			model: params.runtimeModel,
			plan: runtimeAuthPlan
		})]
	}) : selectAgentHarness(harnessSelectionParams);
	const initialInternalHarness = harness;
	if (options.nativeCompactionRequest === "after_context_engine" && !initialInternalHarness.compactAfterContextEngine) return;
	if (!options.nativeCompactionRequest && !harness.compact) {
		if (harness.id !== "openclaw") return {
			ok: false,
			compacted: false,
			reason: `Agent harness "${harness.id}" does not support compaction.`,
			failure: { reason: "unsupported_harness_compaction" }
		};
		return;
	}
	const compactIdentity = resolveHarnessCompactIdentity(params);
	let resolvedRuntimeAuthPlan = runtimeAuthPlan;
	const resolveNativeToolPolicyRestricted = (targetHarness) => resolveAgentHarnessNativeToolPolicyRestricted({
		...params,
		agentId: compactIdentity.agentId,
		provider: params.provider ?? "",
		modelId: params.model ?? ""
	}, targetHarness);
	const compactParams = {
		...params,
		agentDir: compactIdentity.agentDir,
		agentId: compactIdentity.agentId,
		...resolvedRuntimeAuthPlan ? {
			runtimeAuthPlan: resolvedRuntimeAuthPlan,
			...params.runtimePlan ? { runtimePlan: {
				...params.runtimePlan,
				auth: resolvedRuntimeAuthPlan
			} } : {}
		} : {}
	};
	const resolved = await resolveHarnessCompactApiKey({
		agentDir: compactIdentity.agentDir,
		compactParams,
		initialHarness: harness,
		agentId: compactIdentity.agentId,
		sessionKey: runtimePolicySessionKey,
		pinnedHarnessId
	});
	harness = resolved.harness;
	const nativeToolPolicyRestricted = resolveNativeToolPolicyRestricted(harness);
	compactParams.nativeToolSurface = nativeToolPolicyRestricted ? "host-isolated" : "unrestricted";
	resolvedRuntimeAuthPlan = resolved.runtimeAuthPlan ?? resolvedRuntimeAuthPlan;
	const internalHarness = harness;
	const shouldCompactAfterContextEngine = options.nativeCompactionRequest === "after_context_engine";
	if (shouldCompactAfterContextEngine && !internalHarness.compactAfterContextEngine) return;
	if (!options.nativeCompactionRequest && !harness.compact) {
		if (harness.id !== "openclaw") return {
			ok: false,
			compacted: false,
			reason: `Agent harness "${harness.id}" does not support compaction.`,
			failure: { reason: "unsupported_harness_compaction" }
		};
		return;
	}
	if (nativeToolPolicyRestricted && harness.id !== "openclaw" && harness.conversationToolPolicySupport !== "exact") throw new Error(`Agent harness ${harness.id} cannot enforce the host-isolated tool policy required for compaction`);
	const harnessOwnsAuth = harness.authBootstrap === "harness" && !runtimePlanRequiresHostApiKey(resolvedRuntimeAuthPlan);
	const resolvedApiKey = harnessOwnsAuth ? void 0 : resolved.apiKey;
	const runtimeModel = harnessOwnsAuth && !resolvedRuntimeAuthPlan ? void 0 : resolved.runtimeModel;
	const compactParamsWithResolvedAuth = resolvedRuntimeAuthPlan ? {
		...compactParams,
		authProfileId: resolvedRuntimeAuthPlan.forwardedAuthProfileId,
		authProfileIdSource: resolvedRuntimeAuthPlan.forwardedAuthProfileSource,
		runtimeAuthPlan: resolvedRuntimeAuthPlan,
		...compactParams.runtimePlan ? { runtimePlan: {
			...compactParams.runtimePlan,
			auth: resolvedRuntimeAuthPlan
		} } : {}
	} : compactParams;
	const handoffCompactParams = harnessOwnsAuth ? stripHarnessOwnedAuthInputs(compactParamsWithResolvedAuth) : compactParamsWithResolvedAuth;
	const resolvedCompactParams = resolvedApiKey || runtimeModel ? {
		...handoffCompactParams,
		...resolvedApiKey ? { resolvedApiKey: unwrapSecretSentinelsForProviderEgress(resolvedApiKey, "plugin harness compaction handoff") } : {},
		...runtimeModel ? { runtimeModel: unwrapModelHeaderSentinelsForProviderEgress(runtimeModel, "plugin harness compaction handoff") } : {}
	} : handoffCompactParams;
	if (shouldCompactAfterContextEngine) return internalHarness.compactAfterContextEngine?.(resolvedCompactParams);
	return harness.compact?.(resolvedCompactParams);
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-successor.ts
/** Resolve a context engine's successor without letting it cross the active store binding. */
async function resolveContextEngineCompactionSuccessor(params) {
	const current = params.currentTarget;
	const result = params.result.result;
	const target = result?.sessionTarget;
	const successorId = target?.sessionId ?? result?.sessionId;
	const successorFile = result?.sessionFile;
	if (target) {
		if (result?.sessionId && target.sessionId && target.sessionId !== result.sessionId) throw new Error("Context-engine successor identity is inconsistent");
		const resolvedTarget = await resolveAgentRunSessionTarget({
			agentId: target.agentId ?? current.agentId,
			config: params.config,
			missingSessionKey: "resolve-existing",
			sessionId: target.sessionId ?? successorId ?? current.sessionId,
			sessionFile: successorFile,
			sessionKey: target.sessionKey ?? current.sessionKey,
			sessionTarget: {
				...target,
				storePath: target.storePath ?? current.storePath
			}
		});
		assertSameSessionBinding(current, resolvedTarget, "Context-engine");
		return {
			sessionId: resolvedTarget.sessionId,
			sessionFile: resolvedTarget.sessionKey,
			sessionTarget: resolvedTarget
		};
	}
	if (successorFile) {
		const marker = parseSqliteSessionFileMarker(successorFile);
		if (marker && (marker.agentId !== current.agentId || successorId && marker.sessionId !== successorId)) throw new Error("Legacy context-engine successor identity is inconsistent");
		const isSessionKey = successorFile.startsWith("agent:");
		const keyedEntry = isSessionKey ? loadSessionEntry({
			agentId: current.agentId,
			sessionKey: successorFile,
			storePath: current.storePath
		}) : void 0;
		if (isSessionKey && (resolveAgentIdFromSessionKey(successorFile) !== current.agentId || !keyedEntry?.sessionId || successorId && keyedEntry.sessionId !== successorId)) throw new Error("Legacy context-engine successor identity is inconsistent");
		const keyedSessionId = isSessionKey ? successorId ?? keyedEntry?.sessionId : void 0;
		const retainedMarkerEntry = marker ? loadSessionEntry({
			agentId: marker.agentId,
			sessionKey: current.sessionKey,
			storePath: marker.storePath
		}) : void 0;
		const markerMatches = marker ? listSessionEntriesCore({
			agentId: marker.agentId,
			storePath: marker.storePath
		}).filter(({ entry }) => entry.sessionId === marker.sessionId) : [];
		const preferredMarkerSessionKey = marker ? resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), marker.sessionId) : void 0;
		const markerMappedToRetainedKey = markerMatches.some(({ sessionKey }) => sessionKey === current.sessionKey);
		const markerSessionKey = marker ? retainedMarkerEntry?.sessionId === marker.sessionId || retainedMarkerEntry?.sessionId === current.sessionId && (markerMatches.length === 0 || markerMappedToRetainedKey) ? current.sessionKey : preferredMarkerSessionKey ?? (markerMatches.length === 0 && !retainedMarkerEntry ? current.sessionKey : void 0) : void 0;
		const legacyTarget = marker ? markerSessionKey ? {
			...marker,
			sessionId: marker.sessionId,
			sessionKey: markerSessionKey
		} : void 0 : keyedSessionId ? {
			...current,
			sessionId: keyedSessionId,
			sessionKey: successorFile
		} : void 0;
		if (!legacyTarget) throw new Error("Legacy context-engine successor files are unsupported; return a structured sessionTarget");
		const resolvedTarget = await resolveAgentRunSessionTarget({
			agentId: legacyTarget.agentId,
			config: params.config,
			missingSessionKey: "resolve-existing",
			sessionId: legacyTarget.sessionId,
			sessionKey: legacyTarget.sessionKey,
			sessionTarget: legacyTarget
		});
		assertSameSessionBinding(current, resolvedTarget, "Legacy context-engine");
		return {
			sessionId: resolvedTarget.sessionId,
			sessionFile: marker ? formatSqliteSessionFileMarker(resolvedTarget) : resolvedTarget.sessionKey,
			sessionTarget: resolvedTarget
		};
	}
	return {
		sessionId: successorId ?? current.sessionId,
		sessionFile: params.currentSessionFile,
		sessionTarget: successorId ? {
			...current,
			sessionId: successorId
		} : current
	};
}
function assertSameSessionBinding(currentTarget, successorTarget, label) {
	if (successorTarget.agentId !== currentTarget.agentId || successorTarget.sessionKey !== currentTarget.sessionKey || path.resolve(successorTarget.storePath) !== path.resolve(currentTarget.storePath)) throw new Error(`${label} successor target changed the active session binding`);
}
//#endregion
export { maybeCompactAgentHarnessSession as n, isRecoverableNativeHarnessBindingFailure as r, resolveContextEngineCompactionSuccessor as t };
