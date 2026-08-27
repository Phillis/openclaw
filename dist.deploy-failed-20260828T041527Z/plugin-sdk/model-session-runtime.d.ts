import { r as OpenClawConfig } from "../types.openclaw-CflOMr0r.js";
import { n as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-DRFVcTqK.js";
import { c as SessionEntry, i as InternalSessionEntry } from "../types-CheMd8wT.js";
import { n as ThinkLevel } from "../thinking.shared-pIjcXkcY.js";
import "../model-catalog-xKn2-2qd.js";
import { t as AgentModelPrimaryWriteTarget } from "../agent-scope-D0f3GU21.js";
import "../sessions-IH61nUyJ.js";
import { t as ModelCatalogEntry } from "../model-catalog.types-S2wdJ1AQ.js";
import { a as resolveAgentMaxConcurrent, i as isModelSelectionLocked, n as ModelSelectionLockedError, o as resolveChannelModelOverride, r as applyModelOverrideToSessionEntry, t as MODEL_SELECTION_LOCKED_MESSAGE } from "../model-overrides-E-jU6gUn.js";
//#region src/agents/session-runtime-compat.d.ts
/** Persisted runtime fields used to recover session runtime compatibility. */
type SessionRuntimeCompatEntry = Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
declare function resolvePersistedSessionRuntimeId(entry?: SessionRuntimeCompatEntry): string | undefined;
//#endregion
//#region src/agents/session-model-ref.d.ts
type SessionModelEntry = SessionEntry | Pick<SessionEntry, "model" | "modelProvider" | "modelOverride" | "providerOverride" | "modelOverrideRouteResolution">;
declare function resolveSessionModelRef(cfg: OpenClawConfig, entry?: SessionModelEntry, agentId?: string, options?: {
  allowPluginNormalization?: boolean;
}): {
  provider: string;
  model: string;
};
//#endregion
//#region src/agents/sticky-model-selection.d.ts
type StickyModelSelectionDispatchOutcome = "requested" | "skipped-immutable";
//#endregion
//#region src/model-picker/apply-session-model-selection.d.ts
type SessionModelSelectionRequest = {
  provider: string;
  model: string;
  isDefault: boolean;
  alias?: string;
  profileOverride?: string;
  runtime: {
    kind: "unchanged";
  } | {
    kind: "clear";
  } | {
    kind: "set";
    runtime: string;
  };
};
type ApplySessionModelSelectionParams = {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  storePath?: string;
  sessionEntry: InternalSessionEntry;
  sessionStore: Record<string, InternalSessionEntry>;
  allowCreate?: boolean;
  defaultProvider: string;
  defaultModel: string;
  currentProvider: string;
  currentModel: string;
  allowedModelKeys: ReadonlySet<string>;
  modelCatalog: readonly ModelCatalogEntry[];
  thinkingCatalog?: readonly ModelCatalogEntry[];
  canPersistStickyModelSelection?: boolean;
  stickyModelSelectionTarget?: AgentModelPrimaryWriteTarget;
  request: SessionModelSelectionRequest;
  /** Raw directive text used only by the existing session patch hook. */
  patchModel?: string;
  markLiveSwitchPending: true;
};
type ApplySessionModelSelectionResult = {
  status: "applied";
  provider: string;
  model: string;
  effectiveModelRef: string;
  changed: boolean;
  contextTokens: number;
  configuredDefaultUpdate?: StickyModelSelectionDispatchOutcome;
  runtimeChange?: {
    kind: "clear";
  } | {
    kind: "set";
    runtime: string;
  };
  thinkingRemap?: {
    from: ThinkLevel;
    to: ThinkLevel;
    provider: string;
    model: string;
  };
} | {
  status: "rejected";
  reason: "locked" | "not-allowed" | "invalid-runtime";
  message: string;
} | {
  status: "conflict";
  message: string;
};
/** Applies one validated picker selection to the authoritative live session. */
declare function applySessionModelSelection(params: ApplySessionModelSelectionParams): Promise<ApplySessionModelSelectionResult>;
//#endregion
//#region src/sessions/auth-profile-preservation.d.ts
type ModelOverrideSelection = {
  provider: string;
  model: string;
  isDefault?: boolean;
};
/** Applies a user model selection without dropping a compatible pinned auth profile. */
declare function applyModelOverrideWithAuthProfileCompatibility(params: {
  cfg: OpenClawConfig;
  agentDir: string;
  entry: SessionEntry;
  currentProvider: string;
  selection: ModelOverrideSelection;
  profileOverride?: string;
  profileOverrideSource?: "auto" | "user";
  selectionSource?: "auto" | "user";
  markLiveSwitchPending?: boolean;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
}): {
  updated: boolean;
};
//#endregion
export { type ApplySessionModelSelectionParams, type ApplySessionModelSelectionResult, MODEL_SELECTION_LOCKED_MESSAGE, ModelSelectionLockedError, type SessionModelSelectionRequest, applyModelOverrideToSessionEntry, applyModelOverrideWithAuthProfileCompatibility, applySessionModelSelection, isModelSelectionLocked, resolveAgentMaxConcurrent, resolveChannelModelOverride, resolvePersistedSessionRuntimeId, resolveSessionModelRef };