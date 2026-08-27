import { r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
//#region src/channels/plugins/pairing.types.d.ts
/**
 * Channel pairing hooks used by setup and allowlist approval flows.
 */
type ChannelPairingAdapter = {
  idLabel: string;
  normalizeAllowEntry?: (entry: string) => string;
  /** Derive the persisted approval entry from the locally issued request. */
  resolveApprovalStoreEntry?: (request: {
    id: string;
    meta?: Record<string, string>;
  }) => string | null | undefined;
  notifyApproval?: (params: {
    cfg: OpenClawConfig;
    id: string;
    accountId?: string;
    meta?: Record<string, string>;
    runtime?: RuntimeEnv;
  }) => Promise<void>;
};
//#endregion
export { ChannelPairingAdapter as t };