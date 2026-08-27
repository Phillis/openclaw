import { z } from "zod";

//#region extensions/reef/src/friend-types.d.ts
declare const ReefAutonomySchema: z.ZodEnum<{
  "notify-only": "notify-only";
  bounded: "bounded";
  extended: "extended";
}>;
declare const ReefPeerTrustSchema: z.ZodObject<{
  autonomy: z.ZodEnum<{
    "notify-only": "notify-only";
    bounded: "bounded";
    extended: "extended";
  }>;
  ed25519PublicKey: z.ZodString;
  x25519PublicKey: z.ZodString;
  keyEpoch: z.ZodNumber;
  safetyNumberChanged: z.ZodBoolean;
  approvedAt: z.ZodNumber;
}, z.core.$strict>;
declare const ReefPeerIdentitySchema: z.ZodObject<{
  ed25519PublicKey: z.ZodString;
  x25519PublicKey: z.ZodString;
  keyEpoch: z.ZodNumber;
}, z.core.$strict>;
type ReefAutonomy = z.infer<typeof ReefAutonomySchema>;
type ReefPeerIdentity = z.infer<typeof ReefPeerIdentitySchema>;
type ReefPeerTrust = z.infer<typeof ReefPeerTrustSchema>;
//#endregion
//#region extensions/reef/src/config-schema.d.ts
declare const ReefChannelConfigSchema: z.ZodObject<{
  enabled: z.ZodDefault<z.ZodBoolean>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  relayUrl: z.ZodDefault<z.ZodString>;
  handle: z.ZodOptional<z.ZodString>;
  email: z.ZodOptional<z.ZodEmail>;
  guard: z.ZodOptional<z.ZodObject<{
    provider: z.ZodEnum<{
      anthropic: "anthropic";
      openai: "openai";
    }>;
    pinnedModel: z.ZodString;
    apiKeyEnv: z.ZodString;
    policyVersion: z.ZodString;
    timeoutMs: z.ZodNumber;
  }, z.core.$strict>>;
  stateDir: z.ZodOptional<z.ZodString>;
  requestPolicy: z.ZodDefault<z.ZodEnum<{
    open: "open";
    "code-only": "code-only";
    "friends-of-friends": "friends-of-friends";
  }>>;
  friends: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
type ReefChannelConfig = z.infer<typeof ReefChannelConfigSchema>;
//#endregion
export { ReefPeerTrust as a, ReefPeerIdentity as i, ReefChannelConfigSchema as n, ReefAutonomy as r, ReefChannelConfig as t };