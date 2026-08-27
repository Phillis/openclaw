import { G as MemoryPluginRuntime } from "../../types-CbXjz50O.js";
import { R as MemorySearchManager, n as OpenClawConfig } from "../../types.openclaw-BBJILky4.js";
import { a as ShortTermAuditSummary, i as RepairShortTermPromotionArtifactsResult, o as ShortTermDreamingStats, s as ShortTermDreamingStatsEntry } from "../../memory-core-host-runtime-core-DsCA5o13.js";
import { n as configureMemoryCoreDreamingState } from "../../dreaming-state-IcHUT7HP.js";
import { t as MemoryCoreAcquireLocalService } from "../../embedding-local-service-BCpPp3QB.js";
import { o as createEmbeddingProvider } from "../../embeddings-COwc-kaP.js";

//#region extensions/memory-core/src/short-term-promotion-stats.d.ts
declare function loadShortTermPromotionDreamingStats(params: {
  workspaceDir: string;
  nowMs: number;
  timezone?: string;
}): Promise<ShortTermDreamingStats>;
//#endregion
//#region extensions/memory-core/src/short-term-promotion-artifacts.d.ts
declare function auditShortTermPromotionArtifacts(params: {
  workspaceDir: string;
}): Promise<ShortTermAuditSummary>;
declare function repairShortTermPromotionArtifacts(params: {
  workspaceDir: string;
}): Promise<RepairShortTermPromotionArtifactsResult>;
declare function removeGroundedShortTermCandidates(params: {
  workspaceDir: string;
}): Promise<{
  removed: number;
  storePath: string;
}>;
//#endregion
//#region packages/memory-host-sdk/src/host/status-format.d.ts
/** Display tone used by memory status renderers. */
type Tone = "ok" | "warn" | "muted";
/** Resolve vector indexing state from enabled and availability flags. */
declare function resolveMemoryVectorState(vector: {
  enabled: boolean;
  available?: boolean;
}): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled" | "unknown";
};
/** Resolve full-text search state from enabled and availability flags. */
declare function resolveMemoryFtsState(fts: {
  enabled: boolean;
  available: boolean;
}): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled";
};
/** Format cache state as concise status text with optional entry count. */
declare function resolveMemoryCacheSummary(cache: {
  enabled: boolean;
  entries?: number;
}): {
  tone: Tone;
  text: string;
};
//#endregion
//#region extensions/memory-core/src/memory/search-manager.d.ts
type MemorySearchManagerPurpose = "default" | "status" | "cli";
type MemorySearchManagerParams = {
  cfg: OpenClawConfig;
  agentId: string;
  purpose?: MemorySearchManagerPurpose;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
type MemorySearchManagerResult = {
  manager: MemorySearchManager | null;
  error?: string;
  debug?: {
    backend: "builtin";
    purpose: MemorySearchManagerPurpose;
    managerMs: number;
  };
};
declare function getMemorySearchManager(params: MemorySearchManagerParams): Promise<MemorySearchManagerResult>;
//#endregion
//#region extensions/memory-core/src/runtime-provider.d.ts
declare const memoryRuntime: MemoryPluginRuntime;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-defaults.d.ts
/** Default local embedding model used when config omits an explicit model. */
declare const DEFAULT_LOCAL_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
//#endregion
//#region extensions/memory-core/src/memory/provider-adapters.d.ts
type BuiltinMemoryEmbeddingProviderDoctorMetadata = {
  providerId: string;
  authProviderId: string;
  envVars: string[];
  transport: "local" | "remote";
  autoSelectPriority?: number;
};
declare function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId: string): BuiltinMemoryEmbeddingProviderDoctorMetadata | null;
declare function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata(): Array<BuiltinMemoryEmbeddingProviderDoctorMetadata>;
//#endregion
//#region packages/memory-host-sdk/src/host/secret-input.d.ts
/** Return true when a configured memory secret contains a literal value or reference. */
declare function hasConfiguredMemorySecretInput(value: unknown): boolean;
//#endregion
//#region extensions/memory-core/src/dreaming-repair.d.ts
type DreamingArtifactsAuditIssue = {
  severity: "warn" | "error";
  code: "dreaming-session-corpus-unreadable" | "dreaming-session-corpus-self-ingested" | "dreaming-session-ingestion-unreadable" | "dreaming-diary-unreadable";
  message: string;
  fixable: boolean;
};
type DreamingArtifactsAuditSummary = {
  dreamsPath?: string;
  sessionCorpusDir: string;
  sessionCorpusFileCount: number;
  suspiciousSessionCorpusFileCount: number;
  suspiciousSessionCorpusLineCount: number;
  sessionIngestionPath: string;
  sessionIngestionExists: boolean;
  issues: DreamingArtifactsAuditIssue[];
};
type RepairDreamingArtifactsResult = {
  changed: boolean;
  archiveDir?: string;
  archivedDreamsDiary: boolean;
  archivedSessionCorpus: boolean;
  archivedSessionIngestion: boolean;
  archivedPaths: string[];
  warnings: string[];
};
declare function auditDreamingArtifacts(params: {
  workspaceDir: string;
}): Promise<DreamingArtifactsAuditSummary>;
declare function repairDreamingArtifacts(params: {
  workspaceDir: string;
  archiveDiary?: boolean;
  now?: Date;
}): Promise<RepairDreamingArtifactsResult>;
//#endregion
export { type BuiltinMemoryEmbeddingProviderDoctorMetadata, DEFAULT_LOCAL_MODEL, type DreamingArtifactsAuditSummary, type RepairDreamingArtifactsResult, type RepairShortTermPromotionArtifactsResult, type ShortTermAuditSummary, type ShortTermDreamingStats, type ShortTermDreamingStatsEntry, type Tone, auditDreamingArtifacts, auditShortTermPromotionArtifacts, configureMemoryCoreDreamingState, createEmbeddingProvider, getBuiltinMemoryEmbeddingProviderDoctorMetadata, getMemorySearchManager, hasConfiguredMemorySecretInput, listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata, loadShortTermPromotionDreamingStats, memoryRuntime, removeGroundedShortTermCandidates, repairDreamingArtifacts, repairShortTermPromotionArtifacts, resolveMemoryCacheSummary, resolveMemoryFtsState, resolveMemoryVectorState };