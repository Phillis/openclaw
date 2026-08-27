import "./types.openclaw-CflOMr0r.js";
import { i as JsonSchemaObject, n as ChannelConfigSchema, r as ChannelConfigUiHint } from "./types.config-CGDAHrEQ.js";
import { ZodRawShape, ZodTypeAny, z } from "zod";
//#region src/plugin-sdk/provider-model-types.d.ts
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */
  compatibleIds: readonly string[];
};
//#endregion
//#region src/channels/plugins/config-schema.d.ts
type ExtendableZodObject = ZodTypeAny & {
  extend: (shape: Record<string, ZodTypeAny>) => ZodTypeAny;
};
/** Optional allowlist array used by channel config schema builders. */
declare const AllowFromListSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
/** Canonical per-group/room channel policy shape. */
declare const ChannelGroupEntrySchema: z.ZodObject<{
  requireMention: z.ZodOptional<z.ZodBoolean>;
  tools: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  systemPrompt: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type ChannelGroupEntryField = keyof typeof ChannelGroupEntrySchema.shape;
/** Extend the canonical group/room policy shape with channel-owned fields. */
declare function buildGroupEntrySchema<T extends ZodRawShape = Record<never, never>, const TOmit extends readonly ChannelGroupEntryField[] = []>(extraShape?: T, options?: {
  omit?: TOmit;
}): z.ZodObject<Omit<{
  requireMention: z.ZodOptional<z.ZodBoolean>;
  tools: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  systemPrompt: z.ZodOptional<z.ZodString>;
}, TOmit[number]> & T extends (infer T_1) ? { -readonly [P in keyof T_1]: T_1[P]; } : never, z.core.$strict>;
/** Build the common nested DM config block used by channel account schemas. */
declare function buildNestedDmConfigSchema(extraShape?: ZodRawShape): z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  policy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    pairing: "pairing";
    open: "open";
    allowlist: "allowlist";
  }>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
}, z.core.$strip>>;
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(accountSchema: T): T;
type MultiAccountSchemaBaseOptions<TAccount extends ZodTypeAny, TOptional extends boolean> = {
  accountSchema?: TAccount;
  accountsMode?: "record" | "catchall";
  optionalAccount?: TOptional;
};
type MultiAccountRefinement<T extends z.ZodObject> = (value: z.output<T>, ctx: z.RefinementCtx) => void | Promise<void>;
type MultiAccountSchemaOptions<T extends z.ZodObject, TAccount extends ZodTypeAny, TOptional extends boolean> = (MultiAccountSchemaBaseOptions<TAccount, TOptional> & {
  refine?: undefined;
}) | (MultiAccountSchemaBaseOptions<T, TOptional> & {
  refine: MultiAccountRefinement<T>;
});
type OptionalAccountValue<T, TOptional extends boolean> = TOptional extends true ? T | undefined : T;
type MultiAccountEnvelopeShape<TAccount extends ZodTypeAny, TOptional extends boolean> = {
  accounts: z.ZodOptional<z.ZodType<Record<string, OptionalAccountValue<z.output<TAccount>, TOptional>>, Record<string, OptionalAccountValue<z.input<TAccount>, TOptional>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
};
type MultiAccountChannelSchema<T extends z.ZodObject, TAccount extends ZodTypeAny, TOptional extends boolean> = z.ZodObject<z.util.Extend<T["shape"], MultiAccountEnvelopeShape<TAccount, TOptional>>>;
/** Add the standard accounts/defaultAccount envelope and optional shared account/root refinement. */
declare function buildMultiAccountChannelSchema<T extends z.ZodObject, TAccount extends ZodTypeAny = T, TOptional extends boolean = false>(baseSchema: T, options?: MultiAccountSchemaOptions<T, TAccount, TOptional>): MultiAccountChannelSchema<T, TAccount, TOptional>;
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<string, ChannelConfigUiHint>;
  /** Select input mode when transforms must expose accepted config values to editors. */
  jsonSchemaMode?: "input" | "output";
};
type BuildJsonChannelConfigSchemaOptions = {
  cacheKey?: string;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigSchema["runtime"];
};
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
declare function buildJsonChannelConfigSchema(schema: JsonSchemaObject, options?: BuildJsonChannelConfigSchemaOptions): ChannelConfigSchema;
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(schema: ZodTypeAny, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
/** Return a channel config schema for channels that intentionally accept no config keys. */
declare function emptyChannelConfigSchema(): ChannelConfigSchema;
//#endregion
export { buildGroupEntrySchema as a, buildNestedDmConfigSchema as c, ProviderModelRouteRuntimePolicy as d, ProviderRouteOverridePresence as f, buildChannelConfigSchema as i, emptyChannelConfigSchema as l, ChannelGroupEntrySchema as n, buildJsonChannelConfigSchema as o, buildCatchallMultiAccountChannelSchema as r, buildMultiAccountChannelSchema as s, AllowFromListSchema as t, ProviderModelRouteAuthRequirement as u };