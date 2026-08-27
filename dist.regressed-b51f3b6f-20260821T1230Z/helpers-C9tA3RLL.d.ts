import { T as ChannelConfigUiHint, w as ChannelConfigSchema } from "./manifest-registry-BzRPksH-.js";
import { ZodTypeAny, z } from "zod";

//#region src/channels/plugins/config-schema.d.ts
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<string, ChannelConfigUiHint>; /** Select input mode when transforms must expose accepted config values to editors. */
  jsonSchemaMode?: "input" | "output";
};
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(schema: ZodTypeAny, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
//#endregion
//#region src/channels/plugins/helpers.d.ts
declare function formatPairingApproveHint(channelId: string): string;
//#endregion
export { buildChannelConfigSchema as n, formatPairingApproveHint as t };