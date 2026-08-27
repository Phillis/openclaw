import { TSchema } from "typebox";

//#region src/shared/config-ui-hints-types.d.ts
type ConfigUiPresentation = "phone-number";
//#endregion
//#region src/shared/json-schema.types.d.ts
/** TypeBox schema value widened for generic JSON-schema object transforms. */
type JsonSchemaObject = TSchema & Record<string, unknown>;
//#endregion
//#region src/channels/plugins/types.config.d.ts
/** Optional UI metadata for a JSON Schema property. */
type ChannelConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  presentation?: ConfigUiPresentation;
  itemTemplate?: unknown;
};
/** Normalized validation issue emitted by a channel runtime parser. */
type ChannelConfigRuntimeIssue = {
  path?: Array<string | number>;
  message?: string;
  code?: string;
} & Record<string, unknown>;
/** Minimal safeParse result shape accepted from channel-owned validators. */
type ChannelConfigRuntimeParseResult = {
  success: true;
  data: unknown;
} | {
  success: false;
  issues: ChannelConfigRuntimeIssue[];
};
/** Runtime validator contract paired with the JSON Schema config surface. */
type ChannelConfigRuntimeSchema = {
  safeParse: (value: unknown) => ChannelConfigRuntimeParseResult;
};
/** Complete channel config schema description exposed to host tooling. */
type ChannelConfigSchema = {
  schema: JsonSchemaObject;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
};
//#endregion
export { ConfigUiPresentation as a, JsonSchemaObject as i, ChannelConfigSchema as n, ChannelConfigUiHint as r, ChannelConfigRuntimeSchema as t };