import { C as PluginManifestSetupProvider, b as PluginManifestProviderAuthChoice } from "../manifest-registry-BvU-V0_L.js";
import { An as ProviderPlugin, Gn as ProviderPluginCatalog, Qn as ProviderPluginWizardSetup, Yn as ProviderAuthMethod, n as OpenClawPluginConfigSchema, p as OpenClawPluginApi, t as OpenClawPluginDefinition } from "../types-CiLdD6DO.js";
import "../plugin-entry-CBJtciq8.js";
import { t as createProviderApiKeyAuthMethod } from "../provider-api-key-auth-5ePB6A4P.js";
import { d as OpenAICompatibleModelDiscoveryOptions } from "../provider-catalog-live-runtime-CyNY0IuH.js";
import { p as buildSingleProviderApiKeyCatalog } from "../provider-catalog-shared-BimTCKhh.js";
//#region src/plugin-sdk/provider-entry.d.ts
type ApiKeyAuthMethodOptions = Parameters<typeof createProviderApiKeyAuthMethod>[0];
type SingleProviderPluginManifestAuthChoice = Pick<PluginManifestProviderAuthChoice, "provider" | "method" | "choiceId" | "choiceLabel" | "choiceHint" | "groupId" | "groupLabel" | "groupHint" | "optionKey" | "cliFlag" | "assistantPriority" | "onboardingFeatured"> & {
  assistantVisibility?: string;
  onboardingScopes?: readonly string[];
};
type SingleProviderPluginManifest = {
  setup?: {
    providers?: readonly Pick<PluginManifestSetupProvider, "id" | "envVars">[];
  };
  providerAuthChoices?: readonly SingleProviderPluginManifestAuthChoice[];
  modelCatalog?: {
    providers?: Readonly<Record<string, unknown>>;
    discovery?: Readonly<Record<string, unknown>>;
  };
};
/**
 * API-key auth options for single-provider plugins, with provider id filled in by the entry helper.
 */
type SingleProviderPluginApiKeyAuthOptions = Omit<ApiKeyAuthMethodOptions, "providerId" | "expectedProviders" | "wizard"> & {
  /**
   * Provider ids this auth method is allowed to satisfy; defaults to the single
   * provider id declared by the plugin entry.
   */
  expectedProviders?: string[];
  /**
   * Wizard metadata for setup flows, or `false` when the method should be
   * registered without an onboarding choice.
   */
  wizard?: false | ProviderPluginWizardSetup;
};
type ManifestProviderAuthOptions = Omit<SingleProviderPluginApiKeyAuthOptions, "methodId" | "label" | "optionKey" | "flagName" | "envVar" | "promptMessage"> & {
  promptMessage?: string;
};
/**
 * Catalog configuration accepted by the single-provider entry helper.
 */
type SingleProviderPluginCatalogOptions = {
  /**
   * Builds the live provider catalog through the shared API-key catalog path.
   */
  buildProvider?: Parameters<typeof buildSingleProviderApiKeyCatalog>[0]["buildProvider"];
  /**
   * Builds a static catalog for cheap model discovery before credentials are resolved.
   */
  buildStaticProvider?: Parameters<typeof buildSingleProviderApiKeyCatalog>[0]["buildProvider"];
  /**
   * Allows operator-configured base URLs to override the provider catalog base URL.
   */
  allowExplicitBaseUrl?: boolean;
  /**
   * Discovers text/chat models from the provider's OpenAI-compatible model-list endpoint.
   */
  liveModelDiscovery?: true | OpenAICompatibleModelDiscoveryOptions;
  run?: never;
  order?: never;
  staticRun?: never;
} | {
  /**
   * Runs a fully custom provider catalog implementation.
   */
  run: ProviderPluginCatalog["run"];
  /**
   * Optional static variant for custom catalog implementations.
   */
  staticRun?: ProviderPluginCatalog["run"];
  /**
   * Catalog ordering contract forwarded to the core provider registry.
   */
  order?: ProviderPluginCatalog["order"];
  buildProvider?: never;
  buildStaticProvider?: never;
  allowExplicitBaseUrl?: never;
  liveModelDiscovery?: never;
};
/**
 * Defines one provider plugin plus optional extra registration hooks.
 */
type SingleProviderPluginDefinition = {
  /**
   * Provider id override when the runtime provider id differs from the plugin id.
   */
  id?: string;
  /**
   * Human-readable provider label.
   */
  label: string;
  /**
   * Documentation route used by provider setup and diagnostics.
   */
  docsPath: string;
  /**
   * Alternate provider ids accepted by routing and configuration lookups.
   */
  aliases?: string[];
  /**
   * Explicit environment variables advertised for credentials.
   */
  envVars?: string[];
  /**
   * API-key auth methods converted through the shared provider auth helper.
   */
  auth?: SingleProviderPluginApiKeyAuthOptions[];
  /**
   * Provider-owned behavior layered over manifest-derived API-key auth.
   */
  manifestAuth?: ManifestProviderAuthOptions;
  /**
   * Non-API-key or provider-owned auth methods appended after generated methods.
   */
  extraAuth?: ProviderAuthMethod[];
  /**
   * Live/static catalog implementation for this provider.
   */
  catalog: SingleProviderPluginCatalogOptions;
} & Omit<ProviderPlugin, "id" | "label" | "docsPath" | "aliases" | "envVars" | "auth" | "catalog" | "staticCatalog">;
type SingleProviderPluginOptions = {
  /**
   * Plugin id and default provider id when `provider.id` is omitted.
   */
  id: string;
  /**
   * Display name registered for the plugin entry.
   */
  name: string;
  /**
   * Short plugin description surfaced by plugin registries and setup flows.
   */
  description: string;
  /**
   * Plugin-owned metadata used to derive API-key auth and model catalogs
   * without repeating the manifest in the runtime entry.
   */
  manifest?: SingleProviderPluginManifest;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition["kind"];
  /**
   * Optional plugin configuration schema or lazy schema factory.
   */
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  /**
   * Primary provider registration. Extra provider fields are forwarded after
   * the helper-owned id/auth/catalog fields are normalized.
   */
  provider?: SingleProviderPluginDefinition | ((api: OpenClawPluginApi) => SingleProviderPluginDefinition);
  /**
   * Optional hook for registering companion capabilities with the same plugin entry.
   */
  register?: (api: OpenClawPluginApi) => void;
};
/**
 * Builds a plugin entry for providers whose runtime exports exactly one primary model provider.
 */
declare function defineSingleProviderPluginEntry(options: SingleProviderPluginOptions): Omit<{
  id: string;
  name: string;
  description: string;
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
}, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
//#endregion
export { SingleProviderPluginApiKeyAuthOptions, SingleProviderPluginCatalogOptions, SingleProviderPluginOptions, defineSingleProviderPluginEntry };