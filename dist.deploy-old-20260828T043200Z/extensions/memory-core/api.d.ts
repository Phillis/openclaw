import { st as OpenClawPluginToolContext } from "../../plugin-entry-SSZcu2d5.js";
import { $ as MemorySearchResult, X as MemoryProviderStatus, at as MemorySyncProgressUpdate, n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../config-contracts-OcWhZue9.js";
import { t as MemoryEmbeddingProbeResult } from "../../memory-core-host-engine-storage-DfiWY6Es.js";
import { c as ShortTermRecallEntry, n as resolveMemoryRemDreamingConfig, r as PromotionCandidate, t as resolveMemoryDeepDreamingConfig } from "../../memory-core-host-runtime-core-CyAEehpL.js";
import { n as configureMemoryCoreDreamingState } from "../../dreaming-state-v04whxTT.js";
import { n as pluginStateIsolatedDoctorCheckIds, r as registerMemoryCoreDoctorChecks, t as MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID } from "../../doctor-health-C4H_TDFF.js";
//#region extensions/memory-core/src/dreaming-narrative.d.ts
declare function writeBackfillDiaryEntries(params: {
  workspaceDir: string;
  entries: Array<{
    isoDay: string;
    bodyLines: string[];
    sourcePath?: string;
  }>;
  preserveExisting?: boolean;
  timezone?: string;
}): Promise<{
  dreamsPath: string;
  written: number;
  replaced: number;
}>;
declare function removeBackfillDiaryEntries(params: {
  workspaceDir: string;
}): Promise<{
  dreamsPath: string;
  removed: number;
}>;
declare function dedupeDreamDiaryEntries(params: {
  workspaceDir: string;
}): Promise<{
  dreamsPath: string;
  removed: number;
  kept: number;
}>;
//#endregion
//#region extensions/memory-core/src/rem-evidence.d.ts
type GroundedRemPreviewItem = {
  text: string;
  refs: string[];
};
type GroundedRemCandidate = GroundedRemPreviewItem & {
  lean: "likely_durable" | "unclear" | "likely_situational";
};
type GroundedRemFilePreview = {
  path: string;
  facts: GroundedRemPreviewItem[];
  reflections: GroundedRemPreviewItem[];
  memoryImplications: GroundedRemPreviewItem[];
  candidates: GroundedRemCandidate[];
  renderedMarkdown: string;
};
type GroundedRemPreviewResult = {
  workspaceDir: string;
  scannedFiles: number;
  files: GroundedRemFilePreview[];
};
declare function previewGroundedRemMarkdown(params: {
  workspaceDir: string;
  inputPaths: string[];
}): Promise<GroundedRemPreviewResult>;
//#endregion
//#region extensions/memory-core/src/dreaming-phases.d.ts
declare function filterRecallEntriesWithinLookback(params: {
  entries: readonly ShortTermRecallEntry[];
  nowMs: number;
  lookbackDays: number;
}): ShortTermRecallEntry[];
type RemTruthSelection = {
  key: string;
  snippet: string;
  confidence: number;
  evidence: string;
};
type RemTruthCandidate = Omit<RemTruthSelection, "key">;
type RemDreamingPreview = {
  sourceEntryCount: number;
  reflections: string[];
  candidateTruths: RemTruthCandidate[];
  candidateKeys: string[];
  bodyLines: string[];
};
//#endregion
//#region extensions/memory-core/src/rem-harness.d.ts
type MemoryRemHarnessRemConfig = ReturnType<typeof resolveMemoryRemDreamingConfig>;
type MemoryRemHarnessDeepConfig = ReturnType<typeof resolveMemoryDeepDreamingConfig>;
type PreviewRemHarnessOptions = {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  grounded?: boolean;
  groundedInputPaths?: string[];
  groundedFileLimit?: number;
  includePromoted?: boolean;
  candidateLimit?: number;
  remPreviewLimit?: number;
  nowMs?: number;
};
type PreviewRemHarnessResult = {
  workspaceDir: string;
  nowMs: number;
  remConfig: MemoryRemHarnessRemConfig;
  deepConfig: MemoryRemHarnessDeepConfig;
  recallEntryCount: number;
  remSkipped: boolean;
  rem: RemDreamingPreview;
  groundedInputPaths: string[];
  grounded: GroundedRemPreviewResult | null;
  deep: {
    candidateLimit?: number;
    candidateCount: number;
    truncated: boolean;
    candidates: PromotionCandidate[];
  };
};
declare function previewRemHarness(params: PreviewRemHarnessOptions): Promise<PreviewRemHarnessResult>;
//#endregion
//#region extensions/memory-core/src/session-search-visibility.d.ts
type ConversationRecallContext = NonNullable<OpenClawPluginToolContext["conversationRecall"]>;
declare function filterMemorySearchHitsBySessionVisibility(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  requesterSessionKey: string | undefined;
  sandboxed: boolean;
  hits: MemorySearchResult[];
  conversationRecall?: ConversationRecallContext;
  /** Trusted control-plane calls may authorize only hits already scoped to this agent. */
  trustedAgentScope?: boolean;
}): Promise<MemorySearchResult[]>;
//#endregion
//#region extensions/memory-core/src/memory/local-embedding-provider.d.ts
declare const MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE: string;
//#endregion
export { MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID, MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE, type MemoryEmbeddingProbeResult, type MemoryProviderStatus, type MemorySyncProgressUpdate, type OpenClawConfig, type PreviewRemHarnessOptions, type PreviewRemHarnessResult, configureMemoryCoreDreamingState, dedupeDreamDiaryEntries, filterMemorySearchHitsBySessionVisibility, filterRecallEntriesWithinLookback, pluginStateIsolatedDoctorCheckIds, previewGroundedRemMarkdown, previewRemHarness, registerMemoryCoreDoctorChecks, removeBackfillDiaryEntries, writeBackfillDiaryEntries };