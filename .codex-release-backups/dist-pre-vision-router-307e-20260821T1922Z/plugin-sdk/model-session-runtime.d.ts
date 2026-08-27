import { r as OpenClawConfig } from "../types.openclaw-D3TBp_34.js";
import { n as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-C7yXs8r5.js";
import { c as SessionEntry } from "../types-ByIHlRxL.js";
import { n as ThinkLevel } from "../thinking.shared-Dn7xz8fk.js";
import { t as ModelCatalogEntry } from "../model-catalog.types-CNC2UliR.js";
import { a as resolveAgentMaxConcurrent, i as isModelSelectionLocked, n as ModelSelectionLockedError, o as resolveChannelModelOverride, r as applyModelOverrideToSessionEntry, t as MODEL_SELECTION_LOCKED_MESSAGE } from "../model-overrides-CbdAbwuO.js";

//#region src/agents/session-runtime-compat.d.ts
/** Persisted runtime fields used to recover session runtime compatibility. */
type SessionRuntimeCompatEntry = Pick<SessionEntry, "agentHarnessEpoch" | "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
declare function resolvePersistedSessionRuntimeId(entry?: SessionRuntimeCompatEntry): string | undefined;
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
  sessionEntry: SessionEntry;
  sessionStore: Record<string, SessionEntry>;
  allowCreate?: boolean;
  defaultProvider: string;
  defaultModel: string;
  currentProvider: string;
  currentModel: string;
  allowedModelKeys: ReadonlySet<string>;
  modelCatalog: readonly ModelCatalogEntry[];
  thinkingCatalog?: readonly ModelCatalogEntry[];
  canPersistStickyModelSelection?: boolean;
  request: SessionModelSelectionRequest; /** Raw directive text used only by the existing session patch hook. */
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
/** Checks whether a pinned session auth profile can authenticate the selected provider. */
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
export { type ApplySessionModelSelectionParams, type ApplySessionModelSelectionResult, MODEL_SELECTION_LOCKED_MESSAGE, ModelSelectionLockedError, type SessionModelSelectionRequest, applyModelOverrideToSessionEntry, applyModelOverrideWithAuthProfileCompatibility, applySessionModelSelection, isModelSelectionLocked, resolveAgentMaxConcurrent, resolveChannelModelOverride, resolvePersistedSessionRuntimeId };