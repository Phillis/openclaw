import { n as OpenClawConfig, q as SecretInput } from "./types.openclaw-Djf9z9fV.js";
import { z } from "zod";

//#region extensions/nostr/src/config-schema.d.ts
interface NostrProfile {
  name?: string;
  displayName?: string;
  about?: string;
  picture?: string;
  banner?: string;
  website?: string;
  nip05?: string;
  lud16?: string;
}
//#endregion
//#region extensions/nostr/src/types.d.ts
interface NostrAccountConfig {
  enabled?: boolean;
  name?: string;
  defaultAccount?: string;
  privateKey?: SecretInput;
  relays?: string[];
  dmPolicy?: "pairing" | "allowlist" | "open" | "disabled";
  allowFrom?: Array<string | number>;
  profile?: NostrProfile;
}
interface ResolvedNostrAccount {
  accountId: string;
  name?: string;
  enabled: boolean;
  configured: boolean;
  privateKey: string;
  publicKey: string;
  relays: string[];
  profile?: NostrProfile;
  config: NostrAccountConfig;
}
/**
 * Resolve a Nostr account from config
 */
declare function resolveNostrAccount(opts: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedNostrAccount;
//#endregion
export { resolveNostrAccount as n, NostrProfile as r, ResolvedNostrAccount as t };