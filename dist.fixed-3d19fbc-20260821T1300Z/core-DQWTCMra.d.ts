import { n as ChannelConfigSchema, r as ChannelConfigUiHint } from "./types.config-C6_VK-8V.js";
import { Type } from "typebox";
import { ZodTypeAny, z } from "zod";

//#region src/channels/plugins/config-schema.d.ts
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<string, ChannelConfigUiHint>; /** Select input mode when transforms must expose accepted config values to editors. */
  jsonSchemaMode?: "input" | "output";
};
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(schema: ZodTypeAny, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
//#endregion
export { buildChannelConfigSchema as t };