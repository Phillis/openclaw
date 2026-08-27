import { a as ProviderUsageModelBreakdown, c as UsageWindow, i as ProviderUsageCostHistory, n as ProviderUsageCostBreakdown, o as ProviderUsageSnapshot, r as ProviderUsageCostDaily, s as UsageProviderId, t as ProviderUsageBilling } from "../provider-usage.types-CSw7pG9h.js";

//#region src/infra/provider-usage.fetch.claude.d.ts
declare function fetchClaudeUsage(token: string, timeoutMs: number, fetchFn: typeof fetch): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.codex.d.ts
declare function fetchCodexUsage(token: string, accountId: string | undefined, timeoutMs: number, fetchFn: typeof fetch): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.deepseek.d.ts
declare function fetchDeepSeekUsage(apiKey: string, timeoutMs: number, fetchFn: typeof fetch): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.gemini.d.ts
declare function fetchGeminiUsage(token: string, timeoutMs: number, fetchFn: typeof fetch, provider: UsageProviderId): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.minimax.d.ts
type FetchMinimaxUsageOptions = {
  baseUrl?: string;
};
declare function fetchMinimaxUsage(apiKey: string, timeoutMs: number, fetchFn: typeof fetch, options?: FetchMinimaxUsageOptions): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.fetch.zai.d.ts
declare function fetchZaiUsage(apiKey: string, timeoutMs: number, fetchFn: typeof fetch): Promise<ProviderUsageSnapshot>;
//#endregion
//#region src/infra/provider-usage.shared.d.ts
declare const PROVIDER_LABELS: {
  readonly anthropic: "Claude";
  readonly clawrouter: "ClawRouter";
  readonly deepseek: "DeepSeek";
  readonly "github-copilot": "Copilot";
  readonly "google-gemini-cli": "Gemini";
  readonly minimax: "MiniMax";
  readonly openai: "OpenAI";
  readonly openrouter: "OpenRouter";
  readonly venice: "Venice";
  readonly xiaomi: "Xiaomi";
  readonly "xiaomi-token-plan": "Xiaomi Token Plan";
  readonly zai: "z.ai";
};
declare const clampPercent: (value: number) => number;
//#endregion
//#region src/infra/provider-usage.admin.d.ts
type ProviderUsagePageRequest = {
  url: URL;
  headers: HeadersInit;
};
type ProviderUsageDailyAccumulator = ProviderUsageCostDaily & {
  categories: Map<string, number>;
  models: Map<string, ProviderUsageModelBreakdown>;
};
declare function cleanProviderUsageCredential(raw: string | undefined): string | undefined;
declare function encodeProviderUsageAdminToken(prefix: string, token: string): string;
declare function decodeProviderUsageAdminToken(prefix: string, raw: string): string | undefined;
declare function asProviderUsageObject(value: unknown): Record<string, unknown> | undefined;
declare function parseProviderUsageNumber(value: unknown): number | undefined;
declare function parseProviderUsageNonNegativeNumber(value: unknown): number | undefined;
declare function parseProviderUsageNonNegativeInteger(value: unknown): number;
declare function resolveProviderUsageDisplayName(value: unknown, fallback: string): string;
declare function resolveProviderUsageDailyPeriod(params: {
  now: number;
  periodDays?: number;
  defaultPeriodDays: number;
}): {
  periodDays: number;
  startMs: number;
  endMs: number;
};
declare function fetchProviderUsagePages(params: {
  responseLabel: string;
  responseMaxBytes: number;
  timeoutMs: number;
  fetchFn: typeof fetch;
  buildRequest: (page: string | undefined) => ProviderUsagePageRequest;
}): Promise<{
  ok: true;
  data: unknown[];
} | {
  ok: false;
  status?: number;
}>;
declare function createProviderUsageDailyAccumulator(date: string, includeRequests?: boolean): ProviderUsageDailyAccumulator;
declare function addProviderUsageModel(accumulator: ProviderUsageDailyAccumulator, name: string, usage: Omit<ProviderUsageModelBreakdown, "name">): void;
declare function buildProviderUsageHistorySnapshot(params: {
  provider: UsageProviderId;
  displayName: string;
  plan: string;
  periodDays: number;
  unit: string;
  scope?: string;
  daily: Iterable<ProviderUsageDailyAccumulator>;
  formatSummary: (totals: {
    requests: number;
    totalTokens: number;
  }) => string;
}): ProviderUsageSnapshot;
//#endregion
//#region src/infra/provider-usage.fetch.shared.d.ts
/** Fetches JSON-compatible provider usage endpoints with an abort timeout. */
declare function fetchJson(url: string, init: RequestInit, timeoutMs: number, fetchFn: typeof fetch): Promise<Response>;
type BuildUsageHttpErrorSnapshotOptions = {
  provider: UsageProviderId;
  status: number;
  message?: string;
  tokenExpiredStatuses?: readonly number[];
};
/** Builds a provider usage snapshot for non-HTTP fetch or parse failures. */
declare function buildUsageErrorSnapshot(provider: UsageProviderId, error: string): ProviderUsageSnapshot;
declare function buildUsageHttpErrorSnapshot(options: BuildUsageHttpErrorSnapshotOptions): ProviderUsageSnapshot;
//#endregion
export { PROVIDER_LABELS, type ProviderUsageBilling, type ProviderUsageCostBreakdown, type ProviderUsageCostDaily, type ProviderUsageCostHistory, type ProviderUsageModelBreakdown, type ProviderUsageSnapshot, type UsageProviderId, type UsageWindow, addProviderUsageModel, asProviderUsageObject, buildProviderUsageHistorySnapshot, buildUsageErrorSnapshot, buildUsageHttpErrorSnapshot, clampPercent, cleanProviderUsageCredential, createProviderUsageDailyAccumulator, decodeProviderUsageAdminToken, encodeProviderUsageAdminToken, fetchClaudeUsage, fetchCodexUsage, fetchDeepSeekUsage, fetchGeminiUsage, fetchJson, fetchMinimaxUsage, fetchProviderUsagePages, fetchZaiUsage, parseProviderUsageNonNegativeInteger, parseProviderUsageNonNegativeNumber, parseProviderUsageNumber, resolveProviderUsageDailyPeriod, resolveProviderUsageDisplayName };