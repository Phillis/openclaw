// Cached local capability snapshot for runtime install provenance, memory, auth, and local CLIs.
import path from "node:path";
import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import { resolveDefaultAgentDir } from "../agents/agent-scope-config.js";
import { buildAuthHealthSummary } from "../agents/auth-health.js";
import {
  ensureAuthProfileStore,
  externalCliDiscoveryForConfigStatus,
} from "../agents/auth-profiles.js";
import { resolveMemorySearchConfig } from "../agents/memory-search.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { isSecretRef } from "../config/types.secrets.js";
import { aggregateOAuthStatus } from "../gateway/server-methods/models-auth-status.js";
import { detectBinary } from "../infra/detect-binary.js";
import { pathExists } from "../infra/fs-safe.js";
import { resolveOpenClawPackageRootSync } from "../infra/openclaw-root.js";
import { readPackageVersion } from "../infra/package-json.js";
import { createLazyImportLoader } from "../shared/lazy-promise.js";
import type {
  HealthAgentRuntimeProbeSummary,
  HealthAgentRuntimesCapabilitySummary,
  HealthAuthCapabilitySummary,
  HealthCapabilityState,
  HealthLocalCapabilitiesSummary,
  HealthMemoryCapabilitySummary,
  HealthRuntimeInstallSummary,
} from "./health.types.js";
import {
  resolveMemoryPluginStatus,
  resolveSharedMemoryStatusSnapshot,
  type MemoryStatusSnapshot,
} from "./status.scan.shared.js";

const CACHE_TTL_MS = 60_000;

const statusScanDepsRuntimeModuleLoader = createLazyImportLoader(
  () => import("./status.scan.deps.runtime.js"),
);

let cached: { ts: number; result: HealthLocalCapabilitiesSummary } | null = null;
let refresh: Promise<HealthLocalCapabilitiesSummary> | null = null;

function loadStatusScanDepsRuntimeModule() {
  return statusScanDepsRuntimeModuleLoader.load();
}

async function isSourceCheckoutRoot(candidate: string): Promise<boolean> {
  const hasRepoMarker =
    (await pathExists(path.join(candidate, ".git"))) ||
    (await pathExists(path.join(candidate, "pnpm-workspace.yaml")));
  if (!hasRepoMarker) {
    return false;
  }
  return (
    (await pathExists(path.join(candidate, "src"))) &&
    (await pathExists(path.join(candidate, "extensions")))
  );
}

function formatAuthCounts(counts: HealthAuthCapabilitySummary["counts"]): string {
  return [
    counts.ok > 0 ? `${counts.ok} ok` : null,
    counts.expiring > 0 ? `${counts.expiring} expiring` : null,
    counts.missing > 0 ? `${counts.missing} missing` : null,
    counts.expired > 0 ? `${counts.expired} expired` : null,
    counts.static > 0 ? `${counts.static} static` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function resolveConfiguredAuthProviders(cfg: OpenClawConfig): {
  providers: string[];
  expectsOAuth: Set<string>;
} {
  const providers = new Set<string>();
  const expectsOAuth = new Set<string>();
  const envBacked = new Set<string>();

  for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
    const apiKey = provider?.apiKey;
    if (!id || apiKey === undefined || apiKey === null) {
      continue;
    }
    let resolvable = false;
    if (typeof apiKey === "string" && apiKey.length > 0) {
      resolvable = true;
    } else if (isSecretRef(apiKey)) {
      if (apiKey.source === "env") {
        const envValue = process.env[apiKey.id];
        resolvable = typeof envValue === "string" && envValue.length > 0;
      } else {
        resolvable = true;
      }
    }
    if (resolvable) {
      envBacked.add(normalizeProviderId(id));
    }
  }

  for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
    if (!id) {
      continue;
    }
    const mode = provider?.auth;
    if (mode !== "oauth" && mode !== "token") {
      continue;
    }
    if (envBacked.has(normalizeProviderId(id))) {
      continue;
    }
    providers.add(id);
    if (mode === "oauth") {
      expectsOAuth.add(normalizeProviderId(id));
    }
  }

  for (const profile of Object.values(cfg.auth?.profiles ?? {})) {
    const provider = profile?.provider;
    const mode = profile?.mode;
    if (
      typeof provider !== "string" ||
      provider.length === 0 ||
      (mode !== "oauth" && mode !== "token")
    ) {
      continue;
    }
    if (envBacked.has(normalizeProviderId(provider))) {
      continue;
    }
    providers.add(provider);
    if (mode === "oauth") {
      expectsOAuth.add(normalizeProviderId(provider));
    }
  }

  return { providers: Array.from(providers), expectsOAuth };
}

async function buildRuntimeInstallSummary(): Promise<HealthRuntimeInstallSummary> {
  const packageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url }) ?? undefined;
  if (!packageRoot) {
    return {
      state: "unknown",
      detail: "unable to resolve package root for the running gateway",
    };
  }
  const [packageVersion, sourceCheckout] = await Promise.all([
    readPackageVersion(packageRoot),
    isSourceCheckoutRoot(packageRoot),
  ]);
  const installLabel = sourceCheckout ? "source checkout" : "installed package";
  return {
    state: "ok",
    detail: `${installLabel}${packageVersion ? ` ${packageVersion}` : ""} · ${packageRoot}`,
    packageRoot,
    ...(packageVersion ? { packageVersion } : {}),
    sourceCheckout,
  };
}

async function buildMemorySummary(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
}): Promise<HealthMemoryCapabilitySummary | undefined> {
  const memoryPlugin = resolveMemoryPluginStatus(params.cfg);
  if (!memoryPlugin.enabled) {
    return {
      state: "off",
      detail: `disabled${memoryPlugin.reason ? ` (${memoryPlugin.reason})` : ""}`,
      pluginSlot: memoryPlugin.slot,
    };
  }

  const { getMemorySearchManager } = await loadStatusScanDepsRuntimeModule();
  const memory = await resolveSharedMemoryStatusSnapshot({
    cfg: params.cfg,
    agentStatus: { defaultId: params.defaultAgentId },
    memoryPlugin,
    resolveMemoryConfig: resolveMemorySearchConfig,
    getMemorySearchManager,
  });

  if (!memory) {
    return {
      state: "unknown",
      detail: `enabled${memoryPlugin.slot ? ` (${memoryPlugin.slot})` : ""}; status not checked`,
      pluginSlot: memoryPlugin.slot,
    };
  }

  const embeddingDetail = await probeMemoryEmbeddingDetail({
    cfg: params.cfg,
    defaultAgentId: params.defaultAgentId,
  });
  const vectorState = resolveMemoryVectorDetail(memory);
  const parts = [
    memory.backend === "builtin" ? "builtin memory" : "qmd memory",
    memory.provider ? `provider ${memory.provider}` : null,
    vectorState,
    embeddingDetail,
    memoryPlugin.slot ? `plugin ${memoryPlugin.slot}` : null,
    typeof memory.files === "number" && typeof memory.chunks === "number"
      ? `${memory.files} files · ${memory.chunks} chunks`
      : null,
    memory.dirty ? "dirty" : null,
  ].filter(Boolean);

  const state =
    memory.vector?.available === false || embeddingDetail?.startsWith("embeddings warn")
      ? "warn"
      : "ok";

  return {
    state,
    detail: parts.join(" · "),
    backend: memory.backend,
    provider: memory.provider,
    pluginSlot: memoryPlugin.slot,
  };
}

function resolveMemoryVectorDetail(memory: MemoryStatusSnapshot): string {
  const vector = memory.vector;
  if (!vector?.enabled) {
    return "vector off";
  }
  if (
    vector.available === true ||
    vector.storeAvailable === true ||
    vector.semanticAvailable === true
  ) {
    return "vector ok";
  }
  if (vector.loadError) {
    return "vector warn";
  }
  return "vector pending";
}

async function probeMemoryEmbeddingDetail(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
}): Promise<string | null> {
  const { getMemorySearchManager } = await loadStatusScanDepsRuntimeModule();
  const { manager } = await getMemorySearchManager({
    cfg: params.cfg,
    agentId: params.defaultAgentId,
    purpose: "status",
  });
  if (!manager?.probeEmbeddingAvailability) {
    return null;
  }
  try {
    const probe = await manager.probeEmbeddingAvailability();
    return probe.ok ? "embeddings ok" : "embeddings warn";
  } catch {
    return "embeddings warn";
  } finally {
    await manager.close?.().catch(() => {});
  }
}

async function buildAuthSummary(
  cfg: OpenClawConfig,
): Promise<HealthAuthCapabilitySummary | undefined> {
  const configured = resolveConfiguredAuthProviders(cfg);
  const agentDir = resolveDefaultAgentDir(cfg);
  const store = ensureAuthProfileStore(agentDir, {
    externalCli: externalCliDiscoveryForConfigStatus({ cfg }),
    allowKeychainPrompt: false,
    readOnly: true,
  });
  const authHealth = buildAuthHealthSummary({
    store,
    cfg,
    providers: configured.providers.length > 0 ? configured.providers : undefined,
    allowKeychainPrompt: false,
  });

  if (authHealth.providers.length === 0) {
    return {
      state: "off",
      detail: "no configured refreshable auth providers",
      providers: 0,
      counts: { ok: 0, expiring: 0, expired: 0, missing: 0, static: 0 },
    };
  }

  const counts: HealthAuthCapabilitySummary["counts"] = {
    ok: 0,
    expiring: 0,
    expired: 0,
    missing: 0,
    static: 0,
  };
  for (const provider of authHealth.providers) {
    const rollup = aggregateOAuthStatus(
      provider,
      Date.now(),
      configured.expectsOAuth.has(provider.provider),
    );
    counts[rollup.status] += 1;
  }
  const failing = counts.missing + counts.expired;
  const state: HealthCapabilityState =
    failing >= authHealth.providers.length
      ? "missing"
      : failing > 0 || counts.expiring > 0
        ? "warn"
        : "ok";
  return {
    state,
    detail: `${authHealth.providers.length} provider${authHealth.providers.length === 1 ? "" : "s"} · ${formatAuthCounts(counts)}`,
    providers: authHealth.providers.length,
    counts,
  };
}

async function buildAgentRuntimesSummary(): Promise<HealthAgentRuntimesCapabilitySummary> {
  const probes: HealthAgentRuntimeProbeSummary[] = await Promise.all(
    [
      { id: "openclaw", label: "OpenClaw CLI", command: "openclaw" },
      { id: "codex", label: "Codex CLI", command: "codex" },
      { id: "claude", label: "Claude CLI", command: "claude" },
      { id: "opencode", label: "OpenCode CLI", command: "opencode" },
    ].map(async (probe) =>
      Object.assign(probe, {
        available: await detectBinary(probe.command),
      }),
    ),
  );
  const available = probes.filter((probe) => probe.available);
  return {
    state: available.length > 0 ? "ok" : "missing",
    detail: probes.map((probe) => `${probe.id} ${probe.available ? "yes" : "no"}`).join(" · "),
    probes,
  };
}

async function buildLocalCapabilities(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
}): Promise<HealthLocalCapabilitiesSummary> {
  const [runtime, memory, auth, agentRuntimes] = await Promise.all([
    buildRuntimeInstallSummary(),
    buildMemorySummary(params),
    buildAuthSummary(params.cfg),
    buildAgentRuntimesSummary(),
  ]);
  return {
    checkedAt: Date.now(),
    runtime,
    ...(memory ? { memory } : {}),
    ...(auth ? { auth } : {}),
    agentRuntimes,
  };
}

export async function getHealthLocalCapabilitiesSnapshot(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
  bypassCache?: boolean;
}): Promise<HealthLocalCapabilitiesSummary> {
  const now = Date.now();
  if (params.bypassCache) {
    cached = null;
  }
  if (!params.bypassCache && cached && now - cached.ts < CACHE_TTL_MS) {
    return cached.result;
  }
  if (!refresh) {
    refresh = buildLocalCapabilities(params)
      .then((result) => {
        cached = { ts: Date.now(), result };
        return result;
      })
      .finally(() => {
        refresh = null;
      });
  }
  return await refresh;
}

function formatLocalCapabilityLine(label: string, detail: string | undefined): string | null {
  const trimmed = detail?.trim();
  if (!trimmed) {
    return null;
  }
  return `${label}: ${trimmed}`;
}

export function formatLocalCapabilityLines(
  localCapabilities: HealthLocalCapabilitiesSummary | undefined,
): string[] {
  if (!localCapabilities) {
    return [];
  }
  return [
    formatLocalCapabilityLine("Runtime", localCapabilities.runtime.detail),
    formatLocalCapabilityLine("Memory", localCapabilities.memory?.detail),
    formatLocalCapabilityLine("Model auth", localCapabilities.auth?.detail),
    formatLocalCapabilityLine("Agent runtimes", localCapabilities.agentRuntimes?.detail),
  ].filter((value): value is string => Boolean(value));
}
