import { t as getProviderEnvVars } from "../../provider-env-vars-D88PwWxT.js";
import { n as listMemoryEmbeddingProviders } from "../../memory-embedding-provider-runtime-BsgKV5VN.js";
import { t as DEFAULT_LOCAL_MODEL } from "../../memory-core-host-embedding-registry-TEchzxMP.js";
import { t as hasConfiguredMemorySecretInput } from "../../secret-input-DoknW-xw.js";
import { n as resolveMemoryFtsState, r as resolveMemoryVectorState, t as resolveMemoryCacheSummary } from "../../status-format-ExS6-yQO.js";
import "../../memory-core-host-status-DrMh3wbR.js";
import "../../provider-env-vars-DMH3SV0s.js";
import { p as configureMemoryCoreDreamingState } from "../../dreaming-state-DWEtHClN.js";
import { i as repairShortTermPromotionArtifacts, n as auditShortTermPromotionArtifacts, p as loadShortTermPromotionDreamingStats, r as removeGroundedShortTermCandidates } from "../../short-term-promotion-BjqkJVMc.js";
import { t as createEmbeddingProvider } from "../../embeddings-DNRO5KEQ.js";
import { r as getMemorySearchManager } from "../../memory-DV0ztLK3.js";
import { n as memoryRuntime } from "../../runtime-provider-CkxEG5Kt.js";
import { n as repairDreamingArtifacts, t as auditDreamingArtifacts } from "../../dreaming-repair-fVB89FuK.js";
//#region extensions/memory-core/src/memory/provider-adapters.ts
function getBuiltinMemoryEmbeddingProviderAdapter(id) {
	return listMemoryEmbeddingProviders().find((adapter) => adapter.id === id);
}
function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId) {
	const adapter = getBuiltinMemoryEmbeddingProviderAdapter(providerId);
	if (!adapter) return null;
	const authProviderId = adapter.authProviderId ?? adapter.id;
	return {
		providerId: adapter.id,
		authProviderId,
		envVars: getProviderEnvVars(authProviderId),
		transport: adapter.transport === "local" ? "local" : "remote",
		autoSelectPriority: adapter.autoSelectPriority
	};
}
function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata() {
	return listMemoryEmbeddingProviders().filter((adapter) => typeof adapter.autoSelectPriority === "number").toSorted((a, b) => (a.autoSelectPriority ?? 0) - (b.autoSelectPriority ?? 0)).map((adapter) => {
		const authProviderId = adapter.authProviderId ?? adapter.id;
		return {
			providerId: adapter.id,
			authProviderId,
			envVars: getProviderEnvVars(authProviderId),
			transport: adapter.transport === "local" ? "local" : "remote",
			autoSelectPriority: adapter.autoSelectPriority
		};
	});
}
//#endregion
export { DEFAULT_LOCAL_MODEL, auditDreamingArtifacts, auditShortTermPromotionArtifacts, configureMemoryCoreDreamingState, createEmbeddingProvider, getBuiltinMemoryEmbeddingProviderDoctorMetadata, getMemorySearchManager, hasConfiguredMemorySecretInput, listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata, loadShortTermPromotionDreamingStats, memoryRuntime, removeGroundedShortTermCandidates, repairDreamingArtifacts, repairShortTermPromotionArtifacts, resolveMemoryCacheSummary, resolveMemoryFtsState, resolveMemoryVectorState };
