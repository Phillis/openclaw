import { redactSensitiveUrlLikeString } from "@openclaw/net-policy/redact-sensitive-url";
// Cached remote capability snapshot for configured model endpoints and remote Gateway.
import { asNullableRecord } from "@openclaw/normalization-core/record-coerce";
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import { resolveMemorySearchConfig } from "../agents/memory-search.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { fetchWithSsrFGuard } from "../infra/net/fetch-guard.js";
import type {
  HealthCapabilityState,
  HealthRemoteCapabilitiesSummary,
  HealthRemoteEndpointProbeSummary,
} from "./health.types.js";

const CACHE_TTL_MS = 60_000;
const PROBE_TIMEOUT_MS = 1_500;

type ModelEndpointCandidate = {
  id: string;
  label: string;
  baseUrl: string;
  api: "ollama" | "openai-compatible";
  models: string[];
};

let cached: { ts: number; result: HealthRemoteCapabilitiesSummary } | null = null;
let refresh: Promise<HealthRemoteCapabilitiesSummary> | null = null;

function asRecord(value: unknown): Record<string, unknown> | null {
  return asNullableRecord(value);
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeBaseUrl(value: unknown): string | undefined {
  const raw = getString(value);
  if (!raw) {
    return undefined;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return raw.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

function redactUrl(value: string): string {
  return redactSensitiveUrlLikeString(value.replace(/\/+$/, ""));
}

function buildConfiguredEndpointPolicy(baseUrl: string) {
  try {
    return {
      hostnameAllowlist: [new URL(baseUrl).hostname],
      allowPrivateNetwork: true,
    };
  } catch {
    return undefined;
  }
}

function buildProbeUrl(candidate: ModelEndpointCandidate): string {
  return candidate.api === "ollama"
    ? `${candidate.baseUrl}/api/tags`
    : `${candidate.baseUrl}/models`;
}

function endpointKey(candidate: ModelEndpointCandidate): string {
  return `${candidate.api}\0${candidate.baseUrl}`;
}

function mergeCandidate(
  byEndpoint: Map<string, ModelEndpointCandidate>,
  candidate: ModelEndpointCandidate | null,
) {
  if (!candidate) {
    return;
  }
  const key = endpointKey(candidate);
  const existing = byEndpoint.get(key);
  if (!existing) {
    byEndpoint.set(key, {
      ...candidate,
      models: Array.from(new Set(candidate.models.filter(Boolean))),
    });
    return;
  }
  existing.label = existing.label.includes(candidate.label)
    ? existing.label
    : `${existing.label}, ${candidate.label}`;
  for (const model of candidate.models) {
    if (model && !existing.models.includes(model)) {
      existing.models.push(model);
    }
  }
}

function collectMemorySearchEndpoint(
  cfg: OpenClawConfig,
  defaultAgentId: string,
): ModelEndpointCandidate | null {
  try {
    const memory = resolveMemorySearchConfig(cfg, defaultAgentId);
    const baseUrl = normalizeBaseUrl(memory?.remote?.baseUrl);
    if (!memory || !baseUrl) {
      return null;
    }
    return {
      id: "memory-search",
      label: "memory embeddings",
      baseUrl,
      api: memory.provider === "ollama" ? "ollama" : "openai-compatible",
      models: [memory.model],
    };
  } catch {
    return null;
  }
}

function collectMemoryLancedbPluginEndpoints(cfg: OpenClawConfig): ModelEndpointCandidate[] {
  const pluginConfig = asRecord(cfg.plugins?.entries?.["memory-lancedb"]?.config);
  if (!pluginConfig) {
    return [];
  }
  const candidates: ModelEndpointCandidate[] = [];
  const embedding = asRecord(pluginConfig.embedding);
  const embeddingBaseUrl = normalizeBaseUrl(embedding?.baseUrl);
  const embeddingModel = getString(embedding?.model);
  if (embeddingBaseUrl) {
    candidates.push({
      id: "memory-lancedb-embedding",
      label: "lancedb embeddings",
      baseUrl: embeddingBaseUrl,
      api: "openai-compatible",
      models: embeddingModel ? [embeddingModel] : [],
    });
  }
  const reranker = asRecord(pluginConfig.reranker);
  const rerankerEnabled = reranker?.enabled !== false;
  const rerankerBaseUrl = normalizeBaseUrl(reranker?.baseUrl);
  const rerankerModel = getString(reranker?.model);
  if (rerankerEnabled && rerankerBaseUrl) {
    candidates.push({
      id: "memory-lancedb-reranker",
      label: "memory reranker",
      baseUrl: rerankerBaseUrl,
      api: "openai-compatible",
      models: rerankerModel ? [rerankerModel] : [],
    });
  }
  return candidates;
}

function collectModelProviderEndpoints(cfg: OpenClawConfig): ModelEndpointCandidate[] {
  const candidates: ModelEndpointCandidate[] = [];
  for (const [providerId, provider] of Object.entries(cfg.models?.providers ?? {})) {
    const baseUrl = normalizeBaseUrl(provider?.baseUrl);
    if (!baseUrl) {
      continue;
    }
    const api = normalizeLowercaseStringOrEmpty(provider?.api);
    if (api !== "ollama" && api !== "openai-completions" && api !== "openai-compatible") {
      continue;
    }
    candidates.push({
      id: `models-${providerId}`,
      label: `${providerId} models`,
      baseUrl,
      api: api === "ollama" ? "ollama" : "openai-compatible",
      models: [],
    });
  }
  return candidates;
}

function collectModelEndpointCandidates(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
}): ModelEndpointCandidate[] {
  const byEndpoint = new Map<string, ModelEndpointCandidate>();
  mergeCandidate(byEndpoint, collectMemorySearchEndpoint(params.cfg, params.defaultAgentId));
  for (const candidate of collectMemoryLancedbPluginEndpoints(params.cfg)) {
    mergeCandidate(byEndpoint, candidate);
  }
  for (const candidate of collectModelProviderEndpoints(params.cfg)) {
    mergeCandidate(byEndpoint, candidate);
  }
  return Array.from(byEndpoint.values()).toSorted((a, b) => a.baseUrl.localeCompare(b.baseUrl));
}

function normalizeModelIds(value: unknown): Set<string> {
  const ids = new Set<string>();
  const record = asRecord(value);
  const data = Array.isArray(record?.data)
    ? record.data
    : Array.isArray(record?.models)
      ? record.models
      : Array.isArray(value)
        ? value
        : [];
  for (const entry of data) {
    const item = asRecord(entry);
    const id = getString(item?.id) ?? getString(item?.name) ?? getString(item?.model);
    if (id) {
      ids.add(id);
    }
  }
  return ids;
}

async function probeModelEndpoint(
  candidate: ModelEndpointCandidate,
): Promise<HealthRemoteEndpointProbeSummary> {
  const started = Date.now();
  const url = buildProbeUrl(candidate);
  try {
    const { response, release } = await fetchWithSsrFGuard({
      url,
      init: { method: "GET" },
      policy: buildConfiguredEndpointPolicy(candidate.baseUrl),
      timeoutMs: PROBE_TIMEOUT_MS,
      auditContext: "health-remote-model-endpoint",
    });
    try {
      const elapsedMs = Date.now() - started;
      const modelIds =
        candidate.models.length > 0
          ? normalizeModelIds(
              await response
                .clone()
                .json()
                .catch(() => null),
            )
          : new Set<string>();
      const missingModels = candidate.models.filter((model) => !modelIds.has(model));
      const visibleModels =
        candidate.models.length > 0 && modelIds.size > 0
          ? `${candidate.models.length - missingModels.length}/${candidate.models.length} models visible`
          : candidate.models.length > 0
            ? `${candidate.models.length} model${candidate.models.length === 1 ? "" : "s"} configured`
            : "reachable";
      const detailParts = [
        `${redactUrl(candidate.baseUrl)} ${response.ok ? "reachable" : `HTTP ${response.status}`}`,
        visibleModels,
        missingModels.length > 0 ? `missing ${missingModels.join(", ")}` : null,
      ].filter(Boolean);
      return {
        id: candidate.id,
        label: candidate.label,
        state: response.ok && missingModels.length === 0 ? "ok" : "warn",
        detail: detailParts.join(" · "),
        url: redactUrl(candidate.baseUrl),
        status: response.status,
        elapsedMs,
      };
    } finally {
      await release();
    }
  } catch (error) {
    return {
      id: candidate.id,
      label: candidate.label,
      state: "missing",
      detail: `${redactUrl(candidate.baseUrl)} unreachable · ${String(error).split("\n", 1)[0]}`,
      url: redactUrl(candidate.baseUrl),
      elapsedMs: Date.now() - started,
    };
  }
}

function rollupEndpointState(probes: HealthRemoteEndpointProbeSummary[]): HealthCapabilityState {
  if (probes.length === 0) {
    return "off";
  }
  if (probes.every((probe) => probe.state === "ok")) {
    return "ok";
  }
  if (probes.every((probe) => probe.state === "missing")) {
    return "missing";
  }
  return "warn";
}

function buildModelEndpointsDetail(probes: HealthRemoteEndpointProbeSummary[]): string {
  if (probes.length === 0) {
    return "no configured remote model endpoints";
  }
  const ok = probes.filter((probe) => probe.state === "ok").length;
  const warn = probes.filter((probe) => probe.state === "warn").length;
  const missing = probes.filter((probe) => probe.state === "missing").length;
  return [
    `${ok}/${probes.length} reachable`,
    warn > 0 ? `${warn} warn` : null,
    missing > 0 ? `${missing} missing` : null,
    probes.map((probe) => `${probe.label}: ${probe.detail}`).join(" ; "),
  ]
    .filter(Boolean)
    .join(" · ");
}

async function buildModelEndpointsSummary(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
}): Promise<NonNullable<HealthRemoteCapabilitiesSummary["modelEndpoints"]>> {
  const candidates = collectModelEndpointCandidates(params);
  const probes = await Promise.all(candidates.map((candidate) => probeModelEndpoint(candidate)));
  return {
    state: rollupEndpointState(probes),
    detail: buildModelEndpointsDetail(probes),
    probes,
  };
}

async function buildRemoteGatewaySummary(
  cfg: OpenClawConfig,
): Promise<NonNullable<HealthRemoteCapabilitiesSummary["gateway"]>> {
  const remote = cfg.gateway?.remote;
  const enabled = remote?.enabled !== false;
  const url = getString(remote?.url);
  if (!enabled || !url) {
    return {
      state: "off",
      detail: enabled ? "not configured" : "disabled",
    };
  }
  const httpUrl = url.replace(/^ws:/, "http:").replace(/^wss:/, "https:");
  let healthUrl: string;
  try {
    healthUrl = new URL("/healthz", httpUrl).toString();
  } catch {
    return {
      state: "warn",
      detail: `invalid remote gateway URL ${redactSensitiveUrlLikeString(url)}`,
      url: redactSensitiveUrlLikeString(url),
    };
  }
  const started = Date.now();
  try {
    const { response, release } = await fetchWithSsrFGuard({
      url: healthUrl,
      init: { method: "GET" },
      policy: buildConfiguredEndpointPolicy(healthUrl),
      timeoutMs: PROBE_TIMEOUT_MS,
      auditContext: "health-remote-gateway",
    });
    try {
      return {
        state: response.ok ? "ok" : "warn",
        detail: `${redactSensitiveUrlLikeString(url)} ${
          response.ok ? "reachable" : `HTTP ${response.status}`
        }`,
        url: redactSensitiveUrlLikeString(url),
        status: response.status,
        elapsedMs: Date.now() - started,
      };
    } finally {
      await release();
    }
  } catch (error) {
    return {
      state: "missing",
      detail: `${redactSensitiveUrlLikeString(url)} unreachable · ${String(error).split("\n", 1)[0]}`,
      url: redactSensitiveUrlLikeString(url),
      elapsedMs: Date.now() - started,
    };
  }
}

async function buildRemoteCapabilities(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
}): Promise<HealthRemoteCapabilitiesSummary> {
  const [modelEndpoints, gateway] = await Promise.all([
    buildModelEndpointsSummary(params),
    buildRemoteGatewaySummary(params.cfg),
  ]);
  return {
    checkedAt: Date.now(),
    modelEndpoints,
    gateway,
  };
}

export async function getHealthRemoteCapabilitiesSnapshot(params: {
  cfg: OpenClawConfig;
  defaultAgentId: string;
  bypassCache?: boolean;
}): Promise<HealthRemoteCapabilitiesSummary> {
  const now = Date.now();
  if (params.bypassCache) {
    cached = null;
  }
  if (!params.bypassCache && cached && now - cached.ts < CACHE_TTL_MS) {
    return cached.result;
  }
  if (!refresh) {
    refresh = buildRemoteCapabilities(params)
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

function formatRemoteCapabilityLine(label: string, detail: string | undefined): string | null {
  const trimmed = detail?.trim();
  if (!trimmed) {
    return null;
  }
  return `${label}: ${trimmed}`;
}

export function formatRemoteCapabilityLines(
  remoteCapabilities: HealthRemoteCapabilitiesSummary | undefined,
): string[] {
  if (!remoteCapabilities) {
    return [];
  }
  return [
    formatRemoteCapabilityLine("Remote models", remoteCapabilities.modelEndpoints?.detail),
    formatRemoteCapabilityLine("Remote gateway", remoteCapabilities.gateway?.detail),
    formatRemoteCapabilityLine("Remote nodes", remoteCapabilities.detail),
  ].filter((value): value is string => Boolean(value));
}
