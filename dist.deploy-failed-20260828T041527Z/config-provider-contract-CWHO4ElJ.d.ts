//#region packages/normalization-core/src/number-coercion.d.ts
/** Returns a finite number only when it is greater than zero. */
declare function asPositiveFiniteNumber(value: unknown): number | undefined;
//#endregion
//#region extensions/migrate-hermes/config-provider-contract.d.ts
type OpenClawModelApi = "anthropic-messages" | "openai-completions" | "openai-responses" | "openai-chatgpt-responses";
type HermesModelConfig = {
  id: string;
  contextWindow?: number;
  maxTokens?: number;
  supportsVision?: boolean;
};
type HermesProviderConfig = {
  id: string;
  baseUrl: string;
  api: OpenClawModelApi;
  apiKeyEnv?: string;
  headers?: Record<string, unknown>;
  models: HermesModelConfig[];
  sensitive?: boolean;
};
declare const HERMES_TRANSPORTS: Record<string, OpenClawModelApi>;
declare function resolveHermesProviderBaseUrlEnv(providerId: string | undefined, env: Record<string, string>): string | undefined;
declare function resolveHermesProviderApiKeyEnv(providerId: string | undefined): string | undefined;
declare function resolveHermesImplicitBaseUrl(providerId: string | undefined): string | undefined;
declare function resolveProviderApi(raw: Record<string, unknown>, providerId?: string): OpenClawModelApi | undefined;
declare function readEnvReference(value: unknown): string | undefined;
declare function readProviderApiKeyEnv(raw: Record<string, unknown>): string | undefined;
declare function resolveHermesEndpointApiKeyEnv(baseUrl: string): string | undefined;
declare function collectProviderModels(raw: Record<string, unknown>): HermesModelConfig[];
declare function providerConfig(entry: HermesProviderConfig): Record<string, unknown>;
declare function readProviderBaseUrl(raw: Record<string, unknown>, env: Record<string, string>): {
  baseUrl?: string;
  sensitive: boolean;
  unresolved: boolean;
};
declare function readProviderHeaders(raw: Record<string, unknown>, env: Record<string, string>, includeSecrets: boolean): {
  blocked: boolean;
  headers?: Record<string, unknown>;
  invalid: boolean;
  sensitive: boolean;
  unresolved: boolean;
};
//#endregion
export { readEnvReference as a, readProviderHeaders as c, resolveHermesProviderApiKeyEnv as d, resolveHermesProviderBaseUrlEnv as f, providerConfig as i, resolveHermesEndpointApiKeyEnv as l, asPositiveFiniteNumber as m, HermesProviderConfig as n, readProviderApiKeyEnv as o, resolveProviderApi as p, collectProviderModels as r, readProviderBaseUrl as s, HERMES_TRANSPORTS as t, resolveHermesImplicitBaseUrl as u };