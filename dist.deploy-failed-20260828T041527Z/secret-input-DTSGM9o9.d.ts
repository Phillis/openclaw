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
//#endregion
export { buildSecretInputSchema as t };