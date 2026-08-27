import { n as OpenClawConfig } from "./types.openclaw-CZEJqSSW.js";
import { k as SecretInput } from "./types.models-DQnz5K9u.js";
import "./setup-wizard-types-BW-DTrda.js";
import "./types.public-BY_aSVd6.js";
import "./channel-contract-DCFFV2MY.js";
import "./config-contracts-CAOod931.js";
import "./channel-plugin-common-CNA0SYXx.js";
import "./secret-input-CHvO7eLi.js";
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