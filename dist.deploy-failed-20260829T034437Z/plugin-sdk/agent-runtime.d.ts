import { Ao as saveAuthProfileStore, Bo as resolveApiKeyForProfile, Co as ensureAuthProfileStore, Do as loadAuthProfileStoreForSecretsRuntime, Eo as loadAuthProfileStoreForRuntime, Ga as EmbeddedBlockChunker, Ho as resolveAuthProfileOrder, Ma as DEFAULT_PROVIDER, Mo as clearRuntimeAuthProfileStoreSnapshots, No as replaceRuntimeAuthProfileStoreSnapshots, Oo as loadAuthProfileStoreWithoutExternalProfiles, Ro as listProfilesForProvider, So as isProfileInCooldown, To as findPersistedAuthProfileCredential, Uo as ProviderAuthAliasLookupParams, Vo as resolveAuthProfileEligibility, Wo as resolveProviderIdForAuth, _a as agentCommandFromIngress, ao as getTtsProvider, bo as resolveProfilesUnavailableReason, co as resolveTtsPrefsPath, do as ResolvedTtsConfig, ko as resolvePersistedAuthProfileOwnerAgentDir, mo as resolveApiKeyForProviderCore, so as resolveTtsConfig, vo as markAuthProfileBlockedUntil, xo as clearExpiredCooldowns, yo as resolveProfileUnusableUntilForDisplay, zo as refreshOAuthCredentialForRuntime } from "../agent-harness-runtime-D3DJE4wK.js";
import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import { r as AssistantMessage } from "../types-CL_qQaPo.js";
import { n as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-gOlGvA-L.js";
import "../index-BSAlQ8TI.js";
import { C as AuthProfileCredential, E as OAuthCredential, T as AuthProfileStore, w as AuthProfileFailureReason } from "../types-DY2Fz8pS.js";
import { c as readNonNegativeIntegerParam, f as readStringArrayParam, m as readToolStringParam, u as readPositiveIntegerParam } from "../common-BcF4g4is.js";
import { t as jsonResult } from "../tool-results-CKFyNsQ1.js";
import { r as findModelInCatalog, t as modelSupportsVision } from "../model-catalog-XuC1CoX4.js";
import { a as setAgentEffectiveModelPrimary, i as resolveSessionAgentIds, n as resolveAgentEffectiveModelPrimary } from "../agent-scope-BbRoyveY.js";
import { a as resolveAgentWorkspaceDir, i as resolveAgentDir, n as resolveAgentConfig, o as resolveDefaultAgentDir, s as resolveDefaultAgentId, t as listAgentIds } from "../agent-scope-config-BXJ1Cy-i.js";
import { n as ModelCatalogSnapshot, t as ModelCatalogEntry } from "../model-catalog.types-BA_Lii60.js";
import { c as resolveAckReaction, d as resolveHumanDelayConfig, f as resolveIdentityNamePrefix, l as resolveAgentIdentity } from "../ack-reactions-ukUy-RZU.js";
import { t as CODEX_APP_SERVER_AUTH_MARKER } from "../model-auth-markers-DT9cUGpZ.js";
import { a as buildModelAliasIndex, c as parseModelRef, i as buildConfiguredModelCatalog, l as resolveDefaultModelForAgent, n as resolveThinkingDefaultWithRuntimeCatalog, o as resolveModelRefFromString, r as resolveAllowedModelRefCore, s as findNormalizedProviderValue, t as resolveThinkingDefault } from "../model-selection-D3Dbjk7o.js";
//#region src/agents/auth-profiles/paths.d.ts
/** Resolve the user-facing path for the database selected by the auth store loader. */
declare function resolveAuthStorePathForDisplay(agentDir?: string): string;
//#endregion
//#region src/agents/prepared-model-catalog.d.ts
type LoadPreparedModelCatalogParams = {
  agentId?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  readOnly?: boolean;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  providerDiscoveryProviderIds?: readonly string[];
  /** Rebuilds a completed full catalog instead of reusing this generation's cache. */
  refreshFullCatalog?: boolean;
  /** Scoped read-only loads may run live discovery for the scoped providers only. */
  scopedLiveProviderDiscovery?: boolean;
  allowGatewaySubagentBinding?: boolean;
};
/** Returns the configured catalog for the current generation without starting discovery. */
declare function getPreparedModelCatalogSnapshot(params?: LoadPreparedModelCatalogParams): ModelCatalogSnapshot | undefined;
declare function loadPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogEntry[]>;
//#endregion
//#region src/agents/identity-avatar.d.ts
type AgentAvatarResolution = {
  kind: "none";
  reason: string;
  source?: string;
} | {
  kind: "local";
  filePath: string;
  source: string;
} | {
  kind: "remote";
  url: string;
  source: string;
} | {
  kind: "data";
  url: string;
  source: string;
};
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string): AgentAvatarResolution;
//#endregion
//#region src/agents/embedded-agent-utils.d.ts
/** Extract sanitized assistant text across all text content blocks. */
declare function extractEmbeddedAssistantText(msg: AssistantMessage): string;
/** Format reasoning text for markdown-friendly channel surfaces. */
declare function formatReasoningMessage(text: string): string;
//#endregion
//#region src/plugin-sdk/agent-runtime.d.ts
type LoadModelCatalogCompatibilityParams = LoadPreparedModelCatalogParams & {
  /** @deprecated Lifecycle publication owns refreshes; retained for source compatibility. */
  useCache?: boolean;
  /** @deprecated Use getPreparedModelCatalogSnapshot for new nonblocking readers. */
  cacheOnly?: boolean;
  /** @deprecated Plugin metadata belongs to the published lifecycle generation. */
  metadataSnapshot?: PluginMetadataSnapshot;
};
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
declare function loadModelCatalog(params?: LoadModelCatalogCompatibilityParams): Promise<ModelCatalogEntry[]>;
//#endregion
export { type AgentAvatarResolution, type AuthProfileCredential, type AuthProfileFailureReason, type AuthProfileStore, CODEX_APP_SERVER_AUTH_MARKER, DEFAULT_PROVIDER, EmbeddedBlockChunker, type ModelCatalogEntry, type OAuthCredential, type ProviderAuthAliasLookupParams, type ResolvedTtsConfig, agentCommandFromIngress, buildConfiguredModelCatalog, buildModelAliasIndex, clearExpiredCooldowns, clearRuntimeAuthProfileStoreSnapshots, ensureAuthProfileStore, extractEmbeddedAssistantText as extractAssistantText, findModelInCatalog, findNormalizedProviderValue, findPersistedAuthProfileCredential, formatReasoningMessage, getPreparedModelCatalogSnapshot, getTtsProvider, isProfileInCooldown, jsonResult, listAgentIds, listProfilesForProvider, loadAuthProfileStoreForRuntime, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles, loadModelCatalog, loadPreparedModelCatalog, markAuthProfileBlockedUntil, modelSupportsVision, parseModelRef, readNonNegativeIntegerParam, readPositiveIntegerParam, readStringArrayParam, readToolStringParam as readStringParam, refreshOAuthCredentialForRuntime, replaceRuntimeAuthProfileStoreSnapshots, resolveAckReaction, resolveAgentAvatar, resolveAgentConfig, resolveAgentDir, resolveAgentEffectiveModelPrimary, resolveAgentIdentity, resolveAgentWorkspaceDir, resolveAllowedModelRefCore as resolveAllowedModelRef, resolveApiKeyForProfile, resolveApiKeyForProviderCore as resolveApiKeyForProvider, resolveAuthProfileEligibility, resolveAuthProfileOrder, resolveAuthStorePathForDisplay, resolveDefaultAgentDir, resolveDefaultAgentId, resolveDefaultModelForAgent, resolveHumanDelayConfig, resolveIdentityNamePrefix, resolveModelRefFromString, resolvePersistedAuthProfileOwnerAgentDir, resolveProfileUnusableUntilForDisplay, resolveProfilesUnavailableReason, resolveProviderIdForAuth, resolveSessionAgentIds, resolveThinkingDefault, resolveThinkingDefaultWithRuntimeCatalog, resolveTtsConfig, resolveTtsPrefsPath, saveAuthProfileStore, setAgentEffectiveModelPrimary };