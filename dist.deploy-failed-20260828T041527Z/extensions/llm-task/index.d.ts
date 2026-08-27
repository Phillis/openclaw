import { t as definePluginEntry } from "../../plugin-entry-bE5OaTNY.js";
import { g as PluginManifestActivation } from "../../manifest-registry-DdCvbEOK.js";
import { i as JsonSchemaObject } from "../../types.config-CGDAHrEQ.js";
import "../../types.adapters-DVrIc5zd.js";
import { Static, TSchema } from "typebox";
//#region src/plugin-sdk/tool-plugin.d.ts
/** Non-enumerable metadata symbol attached to entries created by `defineToolPlugin`. */
declare const toolPluginMetadataSymbol: unique symbol;
/** Model-facing metadata extracted from each statically declared tool. */
type ToolPluginStaticToolMetadata = {
  name: string;
  label: string;
  description: string;
  parameters: JsonSchemaObject;
  outputSchema?: JsonSchemaObject;
  optional?: boolean;
};
/** Metadata attached to a defined tool plugin for manifest/catalog generation. */
type ToolPluginMetadata = {
  id: string;
  name: string;
  description: string;
  activation: PluginManifestActivation;
  configSchema: JsonSchemaObject;
  tools: ToolPluginStaticToolMetadata[];
};
/** Plugin entry returned by `defineToolPlugin`, including hidden metadata. */
type DefinedToolPluginEntry = ReturnType<typeof definePluginEntry> & {
  [toolPluginMetadataSymbol]: ToolPluginMetadata;
};
//#endregion
//#region extensions/llm-task/index.d.ts
declare const _default: DefinedToolPluginEntry;
//#endregion
export { _default as default };