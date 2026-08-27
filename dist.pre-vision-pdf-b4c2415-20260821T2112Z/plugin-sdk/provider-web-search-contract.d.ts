import { A as WebSearchCredentialResolutionSource, M as WebSearchProviderSetupContext, N as WebSearchProviderToolDefinition, P as WebSearchProviderToolExecutionContext, j as WebSearchProviderPlugin } from "../types-BJ8oTDFw.js";
import { t as enableProviderPluginInConfig } from "../provider-enable-config-D47pg238.js";
import { a as setProviderWebSearchPluginConfigValue, i as resolveProviderWebSearchPluginConfig, n as getTopLevelCredentialValue, o as setScopedCredentialValue, r as mergeScopedSearchConfig, s as setTopLevelCredentialValue, t as getScopedCredentialValue } from "../web-search-provider-config-DpjPsCXg.js";
import { i as WebSearchProviderContractFields, n as WebSearchProviderConfiguredCredential, r as WebSearchProviderContractCredential, t as CreateWebSearchProviderContractFieldsOptions } from "../provider-web-search-contract-fields-CfJWeTK7.js";

//#region src/plugin-sdk/provider-web-search-contract.d.ts
type CreateWebSearchProviderSelectionOptions = CreateWebSearchProviderContractFieldsOptions & {
  /** Plugin id to enable when this provider is selected through setup/configuration flows. */selectionPluginId?: string;
};
/** Build the public web-search provider hooks, including optional selection-time plugin enabling. */
declare function createWebSearchProviderContractFields(options: CreateWebSearchProviderSelectionOptions): Pick<WebSearchProviderPlugin, "inactiveSecretPaths" | "getCredentialValue" | "setCredentialValue"> & Partial<Pick<WebSearchProviderPlugin, "applySelectionConfig" | "getConfiguredCredentialValue" | "setConfiguredCredentialValue">>;
//#endregion
export { type CreateWebSearchProviderContractFieldsOptions, type WebSearchCredentialResolutionSource, type WebSearchProviderConfiguredCredential, type WebSearchProviderContractCredential, type WebSearchProviderContractFields, type WebSearchProviderPlugin, type WebSearchProviderSetupContext, type WebSearchProviderToolDefinition, type WebSearchProviderToolExecutionContext, createWebSearchProviderContractFields, enableProviderPluginInConfig as enablePluginInConfig, getScopedCredentialValue, getTopLevelCredentialValue, mergeScopedSearchConfig, resolveProviderWebSearchPluginConfig, setProviderWebSearchPluginConfigValue, setScopedCredentialValue, setTopLevelCredentialValue };