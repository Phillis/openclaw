import { n as OpenClawConfig } from "./types.openclaw-3CDavCPO.js";
import { z } from "zod";

//#region extensions/buzz/src/config-schema.d.ts
declare const RawBuzzConfigSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      off: "off";
      code: "code";
      bullets: "bullets";
      block: "block";
    }>>;
  }, z.core.$strict>>;
  relayUrl: z.ZodOptional<z.ZodIntersection<z.ZodString, z.ZodString>>;
  privateKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  authTag: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  defaultTo: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type BuzzConfig = z.output<typeof RawBuzzConfigSchema>;
//#endregion
//#region extensions/buzz/src/types.d.ts
interface ResolvedBuzzAccount {
  accountId: string;
  name?: string;
  enabled: boolean;
  configured: boolean;
  relayUrl: string;
  privateKey: string;
  authTag: string;
  publicKey: string;
  config: BuzzConfig;
}
declare function listBuzzAccountIds(cfg: OpenClawConfig): string[];
declare function resolveDefaultBuzzAccountId(_cfg: OpenClawConfig): string;
declare function resolveBuzzAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedBuzzAccount;
//#endregion
export { resolveDefaultBuzzAccountId as i, listBuzzAccountIds as n, resolveBuzzAccount as r, ResolvedBuzzAccount as t };