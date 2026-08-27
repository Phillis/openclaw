import { d as resolveProviderModelRouteAuthRequirement, u as resolveProviderModelMaterializationAuthMode } from "./openai-model-routes-lYZ0ONoM.js";
import { B as shouldPreferProviderRuntimeResolvedModel } from "./provider-runtime-D4zJxL0d.js";
import { t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-GozlON-Q.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BwpyFizB.js";
//#region src/agents/runtime-plan/credential-scoped-model.ts
function providerUsesCredentialScopedModelMetadata(params) {
	return shouldPreferProviderRuntimeResolvedModel({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		context: {
			config: params.config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: params.modelId
		}
	});
}
/** Reuses forwarded model auth only when the prepared plan owns the exact target. */
function resolveReusableRuntimeModelAuth(params) {
	const plan = params.plan && agentRuntimeAuthPlanMatchesTarget(params.plan, {
		provider: params.provider,
		modelId: params.modelId
	}) ? params.plan : void 0;
	const authProfileId = params.authProfileId ?? plan?.forwardedAuthProfileId;
	const authProfileMode = resolveProviderModelMaterializationAuthMode(plan?.selectedAuthMode);
	return {
		plan,
		authProfileId,
		modelAuth: authProfileId !== void 0 ? { authProfileId } : authProfileMode !== void 0 ? { authProfileMode } : void 0
	};
}
/** Direct auth after a profile attempt must drop credential-scoped model metadata. */
function shouldForceDirectAuthFallbackModelResolve(params) {
	return params.attempt.kind === "direct" && params.priorProfileAttempted;
}
/** Re-resolves when the selected profile or direct credential can change provider metadata. */
function shouldForceCredentialScopedModelResolve(plan, requestedProfileId, providerUsesProfileScopedModelMetadata = false) {
	return Boolean(plan.forwardedAuthProfileId || requestedProfileId || providerUsesProfileScopedModelMetadata && plan.selectedAuthMode);
}
/** Re-resolves metadata whenever the prepared credential can change provider limits. */
function shouldMaterializeAuthPlanModel(plan, requestedProfileId, providerUsesProfileScopedModelMetadata = false) {
	return Boolean(plan.modelRoute || shouldForceCredentialScopedModelResolve(plan, requestedProfileId, providerUsesProfileScopedModelMetadata));
}
function resolveCredentialScopedAuthAttemptModelDecision(params) {
	const forceResolve = shouldForceDirectAuthFallbackModelResolve(params);
	const shouldMaterialize = shouldMaterializeAuthPlanModel(params.attempt.plan, params.requestedProfileId, params.providerUsesProfileScopedModelMetadata) || forceResolve;
	return {
		forceResolve,
		shouldMaterialize,
		authRequirement: params.attempt.plan.modelRoute?.authRequirement ?? (shouldMaterialize && params.providerUsesProfileScopedModelMetadata ? resolveProviderModelRouteAuthRequirement(params.attempt.plan.selectedAuthMode) : void 0)
	};
}
function hasPreparedAuthAttemptModelMetadata(params) {
	return params.attempts.some((attempt) => params.providerUsesProfileScopedModelMetadata && (attempt.kind === "profile" || Boolean(attempt.plan.forwardedAuthProfileId)) || Boolean(attempt.plan.modelRoute) || attempt.allowAuthProfileFallback !== void 0);
}
function createPreparedRuntimeModelMaterializer(params) {
	const materializedRouteModels = /* @__PURE__ */ new WeakMap();
	const materializeUncached = async (plan, forceResolve = false) => {
		const model = params.getModel();
		if (params.nativeModelOwned) return model;
		return await materializePreparedRuntimeModel({
			plan,
			provider: params.provider,
			modelId: params.modelId,
			config: params.config,
			model,
			forceResolve: forceResolve || shouldForceCredentialScopedModelResolve(plan, params.requestedProfileId, params.providerUsesProfileScopedModelMetadata),
			resolveModel: (request) => params.resolveModel(request)
		}) ?? model;
	};
	const materialize = (plan) => {
		if (!plan.modelRoute) return materializeUncached(plan);
		const cached = materializedRouteModels.get(plan);
		if (cached) return cached;
		const materialized = materializeUncached(plan);
		materializedRouteModels.set(plan, materialized);
		return materialized;
	};
	return {
		materialize,
		materializeUncached
	};
}
//#endregion
export { resolveReusableRuntimeModelAuth as a, resolveCredentialScopedAuthAttemptModelDecision as i, hasPreparedAuthAttemptModelMetadata as n, shouldForceDirectAuthFallbackModelResolve as o, providerUsesCredentialScopedModelMetadata as r, createPreparedRuntimeModelMaterializer as t };
