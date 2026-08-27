import { createHash } from "node:crypto";
import { asNonNegativeFiniteNumber } from "@openclaw/normalization-core/number-coercion";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { resolveAuthoredModelContextTokens } from "../agents/context-resolution.js";
import { resolveContextTokensForModel } from "../agents/context.js";
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from "../agents/defaults.js";
import { resolveFastModeState } from "../agents/fast-mode.js";
import { findModelCatalogEntry, type ModelCatalogEntry } from "../agents/model-catalog.js";
import { resolveModelContextWindowProfile } from "../agents/model-context-window.js";
import { resolveSessionModelIdentityRef } from "../agents/session-model-ref.js";
import {
  countActiveDescendantRuns,
  getSessionDisplaySubagentRunByChildSessionKey,
  getSubagentSessionRuntimeMs,
  getSubagentSessionStartedAt,
  isSubagentRunLive,
  resolveSubagentSessionStatus,
} from "../agents/subagents/registry/subagent-registry-read.js";
import { resolveQueueSettingsCore } from "../auto-reply/reply/queue/settings.js";
import { resolveEffectiveResponseUsage } from "../auto-reply/thinking.js";
import {
  buildGroupDisplayName,
  buildGroupDisplayTitle,
  resolveFreshSessionTotalTokens,
  resolveSessionGoalDisplayState,
  resolveProjectedSessionContextTokens,
  SESSION_TOTAL_TOKENS_VERSION,
  type InternalSessionEntry,
  type SessionEntry,
} from "../config/sessions.js";
import { resolveSessionModelOverrideSource } from "../config/sessions/model-override-provenance.js";
import { sessionEntryForkedFromParent } from "../config/sessions/session-entry-lineage.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { projectPluginSessionExtensionsSync } from "../plugins/host-hook-state.js";
import { normalizeAgentId, parseAgentSessionKey } from "../routing/session-key.js";
import { classifySessionKind } from "../sessions/classify-session-kind.js";
import { resolveActiveSessionAgentStatus } from "../sessions/session-agent-status.js";
import { projectSessionDeliveryFields } from "../utils/delivery-context.shared.js";
import { INTERNAL_MESSAGE_CHANNEL } from "../utils/message-channel-constants.js";
import { buildControlUiChannelAvatarUrl } from "./control-ui-contract.js";
import { normalizeControlUiBasePath } from "./control-ui-shared.js";
import { sessionHasAutomation } from "./session-automation-index.js";
import { sessionClassificationForRow } from "./session-classification.js";
import {
  hasSessionCreatorProfileProvenance,
  projectSessionActor,
  projectSessionOwner,
  projectSessionParticipants,
} from "./session-identity-projection.js";
import {
  resolveSessionStoreAgentId,
  resolveStoredSessionKeyForAgentStore,
} from "./session-store-key.js";
import { readSessionTitleFieldsFromTranscript as readScopedSessionTitleFieldsFromTranscript } from "./session-transcript-title-reader.js";
import type { SessionListRowContext } from "./session-utils-contracts.js";
import {
  buildCompactionCheckpointPreview,
  deriveSessionTitle,
  deriveSessionUnread,
  resolveEstimatedSessionCostUsd,
  resolveLatestCompactionCheckpoint,
  resolvePositiveNumber,
  resolveProjectableCompactionCheckpoints,
  resolveRuntimeChildSessionKeys,
} from "./session-utils-core.js";
import {
  resolveGatewaySessionThinkingProjectionInternal,
  resolveSessionDisplayModelIdentityRefCached,
} from "./session-utils-model.js";
import {
  mergeChildSessionKeys,
  resolveChildSessionKeys,
  resolveSessionSelectedModelRef,
  resolveTranscriptUsageFallback,
} from "./session-utils-projection.js";
import { isGroupOrChannelDisplaySession, parseGroupKey } from "./session-utils-store.js";
import type { GatewaySessionRow, SessionListModelCatalog } from "./session-utils.types.js";
import { projectWorkerPlacementAgentRuntime } from "./worker-environments/placement-session-runtime.js";

/** Adds current actor display data without persisting rename-prone metadata. */
/** Opaque cache-busting revision for the channel-avatar route; never leaks the reference. */
function channelAvatarRevision(reference: string): string {
  return createHash("sha256").update(reference).digest("base64url").slice(0, 12);
}

/**
 * Projects an entry's `archivedBy` for the gateway row surface. A rotation
 * archive actor (`type: "rotation"`) has no human identity and is projected as
 * undefined (the archived state is carried by archivedAt/archived themselves).
 */
function resolveRowArchivedBy(
  actor: SessionEntry["archivedBy"],
  userProfileIdentityById: Map<string, SessionActorProfileIdentity | undefined> = new Map(),
): SessionCreatedActor | undefined {
  if (!actor || actor.type === "rotation") {
    return undefined;
  }
  return projectSessionActor(actor, userProfileIdentityById);
}
