import { d as isSecretRef, f as normalizeResolvedSecretInputString, i as SecretInputStringResolutionMode, l as coerceSecretRef, m as resolveSecretInputString, n as SecretInput, p as normalizeSecretInputString, r as SecretInputStringResolution, u as hasConfiguredSecretInput } from "../types.secrets-BBdlv1za.js";
import { n as normalizeSecretInput, r as isValidSecretRef } from "../normalize-secret-input-Cb_5pGru.js";
import { z } from "zod";

//#region src/plugin-sdk/secret-input-schema.d.ts
/**
 * Returns the shared secret-input schema for plaintext values and env/file/exec/store refs.
 * Reusing this singleton preserves sensitive-path registration for config redaction.
 */
declare function buildSecretInputSchema(): z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  source: z.ZodLiteral<"env">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"store">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"file">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"exec">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>], "source">]>;
/** Register a plugin-owned config schema leaf for redaction in host config projections. */
declare function registerSensitiveConfigSchema<TSchema extends z.ZodType>(schema: TSchema): TSchema;
//#endregion
//#region src/plugin-sdk/secret-input.d.ts
/**
 * Builds an optional secret-input schema for config fields that may be omitted.
 * The inner schema stays shared so sensitive-path redaction still recognizes it.
 */
declare function buildOptionalSecretInputSchema(): z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  source: z.ZodLiteral<"env">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"store">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"file">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"exec">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>], "source">]>>;
/**
 * Builds an array schema for provider/channel config that accepts multiple secret inputs.
 * Each element uses the shared schema so plaintext and ref validation stay identical.
 */
declare function buildSecretInputArraySchema(): z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  source: z.ZodLiteral<"env">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"store">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"file">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"exec">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>], "source">]>>;
//#endregion
export { type SecretInput, type SecretInputStringResolution, type SecretInputStringResolutionMode, buildOptionalSecretInputSchema, buildSecretInputArraySchema, buildSecretInputSchema, coerceSecretRef, hasConfiguredSecretInput, isSecretRef, isValidSecretRef, normalizeResolvedSecretInputString, normalizeSecretInput, normalizeSecretInputString, registerSensitiveConfigSchema, resolveSecretInputString };