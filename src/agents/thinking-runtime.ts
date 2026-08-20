import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import {
  isThinkingLevelSupported,
  resolveSupportedThinkingLevel,
  type ThinkLevel,
  type ThinkingCatalogEntry,
} from "../auto-reply/thinking.js";
/** Resolves the concrete harness runtime that owns the next agent turn. */
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveAgentHarnessPolicy } from "./harness/policy.js";
import { resolveAutoAgentHarnessId } from "./harness/support.js";
import { resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat.js";

/**
 * Recognizes MiniMax M3 and forward-compatible M3.x models across routed
 * provider aliases (native minimax, minimax-portal/CN, openrouter vendor
 * prefixes, ollama cloud tags) by normalizing the model basename. Provider
 * thinking profiles only match their own provider ids, so fallback revalidation
 * must match M3 by model id alone: M3 always requires adaptive thinking and
 * cannot carry an incompatible primary level.
 */
export function isMinimaxM3Model(modelId: string | undefined | null): boolean {
  const normalized = normalizeOptionalString(modelId);
  if (!normalized) {
    return false;
  }
  const basename = normalized.split("/").at(-1)?.split(":")[0] ?? "";
  return /^MiniMax-M3(?:\b|[-.])/i.test(basename);
}

export function hasResolvedThinkingCatalogEntry(params: {
  catalog?: readonly ThinkingCatalogEntry[];
  provider: string;
  model: string;
}): boolean {
  const modelId = normalizeOptionalString(params.model);
  if (!modelId) {
    return false;
  }
  const normalizedProvider = normalizeProviderId(params.provider);
  const entry = params.catalog?.find(
    (candidate) =>
      normalizeProviderId(candidate.provider) === normalizedProvider && candidate.id === modelId,
  );
  return entry?.reasoning !== undefined;
}

export function normalizeThinkingCatalogProviders<T extends ThinkingCatalogEntry>(
  catalog: readonly T[],
): T[] {
  return catalog.map((entry) => {
    const provider = normalizeProviderId(entry.provider);
    return provider === entry.provider ? entry : Object.assign({}, entry, { provider });
  });
}

/** Convert residual auto policy into the built-in fallback when no registry selection is needed. */
export function concretizeAgentRuntime(runtime: string): string {
  return runtime === "auto" ? "openclaw" : runtime;
}

/** Resolves an explicit session override before configured model/provider policy. */
export function resolveEffectiveAgentRuntime(params: {
  cfg: OpenClawConfig;
  provider: string;
  modelId: string;
  modelApi?: string | null;
  modelBaseUrl?: unknown;
  agentId?: string;
  sessionKey?: string;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride">;
}): string {
  const sessionRuntime = resolveSessionRuntimeOverrideForProvider({
    provider: params.provider,
    entry: params.sessionEntry,
    cfg: params.cfg,
  });
  const runtime =
    sessionRuntime ??
    resolveAgentHarnessPolicy({
      provider: params.provider,
      modelId: params.modelId,
      modelApi: params.modelApi,
      modelBaseUrl: params.modelBaseUrl,
      config: params.cfg,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
    }).runtime;
  if (runtime === "auto") {
    // Reuse the loaded harness registry without triggering plugin discovery.
    // This keeps thinking policy aligned with the harness that would own the turn.
    return (
      resolveAutoAgentHarnessId({
        provider: params.provider,
        modelId: params.modelId,
        config: params.cfg,
      }) ?? "openclaw"
    );
  }
  return concretizeAgentRuntime(runtime);
}

/** Revalidates a turn-local thinking level after fallback selects its actual model/runtime. */
export function resolveCandidateThinkingLevel(params: {
  cfg?: OpenClawConfig;
  provider: string;
  modelId: string;
  level?: ThinkLevel;
  catalog?: ThinkingCatalogEntry[];
  agentId?: string;
  sessionKey?: string;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride">;
  /** Concrete harness already selected by the caller, when selection is pinned. */
  agentRuntime?: string | null;
}): ThinkLevel | undefined {
  if (isMinimaxM3Model(params.modelId)) {
    // MiniMax M3 always runs adaptive thinking; never carry an incompatible
    // primary level (unset/off/high/max/ultra) into the selected candidate.
    return "adaptive";
  }
  if (!params.level) {
    return undefined;
  }
  const concreteRuntime = params.agentRuntime?.trim().toLowerCase();
  const agentRuntime =
    concreteRuntime && concreteRuntime !== "auto" && concreteRuntime !== "default"
      ? concreteRuntime
      : resolveEffectiveAgentRuntime({
          cfg: params.cfg ?? {},
          provider: params.provider,
          modelId: params.modelId,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          sessionEntry: params.sessionEntry,
        });
  const policy = {
    provider: params.provider,
    model: params.modelId,
    level: params.level,
    catalog: params.catalog,
    agentRuntime,
  };
  return isThinkingLevelSupported(policy) ? params.level : resolveSupportedThinkingLevel(policy);
}
