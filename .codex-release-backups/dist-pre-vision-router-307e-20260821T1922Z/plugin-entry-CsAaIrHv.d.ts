import { Gr as ProviderBuiltInModelSuppressionContext$1, v as OpenClawPluginDefinition, y as OpenClawPluginConfigSchema } from "./host-capability-types-BQXGgYpD.js";
//#region src/plugin-sdk/plugin-entry.d.ts
type ProviderBuiltInModelSuppressionContext = ProviderBuiltInModelSuppressionContext$1;
/** Options for a plugin entry that registers providers, tools, commands, or services. */
type DefinePluginEntryOptions = {
  id: string;
  name: string;
  description: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
};
/** Normalized object shape that OpenClaw loads from a plugin entry module. */
type DefinedPluginEntry = Omit<DefinePluginEntryOptions, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
/**
 * Canonical entry helper for non-channel plugins.
 *
 * Use this for provider, tool, command, service, memory, and context-engine
 * plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
 * `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
 */
declare function definePluginEntry({
  id,
  name,
  description,
  kind,
  configSchema,
  reload,
  nodeHostCommands,
  securityAuditCollectors,
  register
}: DefinePluginEntryOptions): DefinedPluginEntry;
//#endregion
export { definePluginEntry as n, ProviderBuiltInModelSuppressionContext as t };