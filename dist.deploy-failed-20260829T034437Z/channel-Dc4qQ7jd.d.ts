import "./plugin-entry-SSZcu2d5.js";
import { H as DmConfig, dt as GroupPolicy, gt as ReplyToMode, lt as DmPolicy, st as ChannelDeliveryStreamingConfig, xt as SecretInput } from "./types.openclaw-Dbu8qmVI.js";
import "./setup-wizard-types-DKtF7yYx.js";
import { t as ChannelPlugin } from "./types.public-uc4adrAK.js";
import "./config-contracts-OcWhZue9.js";
import "./runtime-api-DwxMBNtP.js";
import "./setup-CfYyK6bp.js";
import "./account-core-CWVw1iS6.js";
import { ZodTypeAny, z } from "zod";
//#region node_modules/@openclaw/fs-safe/dist/errors.d.ts
type FsSafeErrorCode = "already-exists" | "denied-path" | "device-path" | "hardlink" | "helper-failed" | "helper-unavailable" | "invalid-path" | "insecure-permissions" | "not-empty" | "not-file" | "not-found" | "not-owned" | "not-removable" | "outside-workspace" | "path-alias" | "path-mismatch" | "permission-unverified" | "read-failed" | "secret-exists" | "store-reentrant-update" | "symlink" | "timeout" | "too-large" | "unsupported-platform";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/secret-file.d.ts
type SecretFileReadOptions = {
  maxBytes?: number;
  rejectSymlink?: boolean;
  rejectHardlinks?: boolean;
};
//#endregion
//#region src/infra/secret-file.d.ts
type CredentialUnavailableDiagnostic = {
  code: "CREDENTIAL_FILE_UNAVAILABLE";
  path: string;
  reason: FsSafeErrorCode;
};
/** Closed credential state used by channel account resolvers. */
type CredentialResult<T> = {
  status: "available";
  value: T;
} | {
  status: "configured_unavailable";
  diagnostic: CredentialUnavailableDiagnostic;
} | {
  status: "missing";
};
type ConfiguredCredentialResult<T> = Exclude<CredentialResult<T>, {
  status: "missing";
}>;
type CredentialFileReadOptions = SecretFileReadOptions & {
  credentialDiagnostic: {
    configPath: string;
    report: (diagnostic: CredentialUnavailableDiagnostic) => void;
  };
};
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: CredentialFileReadOptions): string | undefined;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options?: SecretFileReadOptions): string | undefined;
/** Reads an explicitly configured credential file without exposing its filesystem path. */
declare function tryReadSecretFileSync(filePath: string, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): ConfiguredCredentialResult<string>;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): CredentialResult<string>;
//#endregion
//#region extensions/nextcloud-talk/src/api-credentials.d.ts
type NextcloudTalkCredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
//#endregion
//#region extensions/nextcloud-talk/src/types.d.ts
type NextcloudTalkRoomConfig = {
  requireMention?: boolean;
  /** Optional tool policy overrides for this room. */
  tools?: {
    allow?: string[];
    deny?: string[];
  };
  /** If specified, only load these skills for this room. Omit = all skills; empty = no skills. */
  skills?: string[];
  /** If false, disable the bot for this room. */
  enabled?: boolean;
  /** Optional allowlist for room senders (user ids). */
  allowFrom?: string[];
  /** Optional system prompt snippet for this room. */
  systemPrompt?: string;
};
type NextcloudTalkNetworkConfig = {
  /** Dangerous opt-in for self-hosted Nextcloud Talk on trusted private/internal hosts. */
  dangerouslyAllowPrivateNetwork?: boolean;
};
type NextcloudTalkAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */
  name?: string;
  /** If false, do not start this Nextcloud Talk account. Default: true. */
  enabled?: boolean;
  /** Reply-threading mode for this account. */
  replyToMode?: ReplyToMode;
  /** Base URL of the Nextcloud instance (e.g., "https://cloud.example.com"). */
  baseUrl?: string;
  /** Bot shared secret from occ talk:bot:install output. */
  botSecret?: SecretInput;
  /** Path to file containing bot secret (for secret managers). */
  botSecretFile?: string;
  /** Optional API user for room lookups (DM detection). */
  apiUser?: string;
  /** Optional API password/app password for room lookups. */
  apiPassword?: SecretInput;
  /** Path to file containing API password/app password. */
  apiPasswordFile?: string;
  /** Direct message policy (default: pairing). */
  dmPolicy?: DmPolicy;
  /** Webhook server port. Default: 8788. */
  webhookPort?: number;
  /** Webhook server host. Default: "0.0.0.0". */
  webhookHost?: string;
  /** Webhook endpoint path. Default: "/nextcloud-talk-webhook". */
  webhookPath?: string;
  /** Public URL for the webhook (used if behind reverse proxy). */
  webhookPublicUrl?: string;
  /** Optional allowlist of user IDs allowed to DM the bot. */
  allowFrom?: string[];
  /** Optional allowlist for Nextcloud Talk room senders (user ids). */
  groupAllowFrom?: string[];
  /** Group message policy (default: allowlist). */
  groupPolicy?: GroupPolicy;
  /** Per-room configuration (key is room token). */
  rooms?: Record<string, NextcloudTalkRoomConfig>;
  /** Max group messages to keep as history context (0 disables). */
  historyLimit?: number;
  /** Max DM turns to keep as history context. */
  dmHistoryLimit?: number;
  /** Per-DM config overrides keyed by user ID. */
  dms?: Record<string, DmConfig>;
  /** Outbound text chunk size (chars). Default: 4000. */
  textChunkLimit?: number;
  /** Delivery streaming config: chunk mode plus block streaming controls. */
  streaming?: ChannelDeliveryStreamingConfig;
  /** Outbound response prefix override for this channel/account. */
  responsePrefix?: string;
  /** Media upload max size in MB. */
  mediaMaxMb?: number;
  /** Network policy overrides for self-hosted Nextcloud Talk on trusted private/internal hosts. */
  network?: NextcloudTalkNetworkConfig;
};
//#endregion
//#region extensions/nextcloud-talk/src/accounts.d.ts
type ResolvedNextcloudTalkAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  baseUrl: string;
  secret: string;
  secretSource: "env" | "secretFile" | "config" | "none";
  tokenStatus?: "available" | "configured_unavailable" | "missing";
  apiCredentialStatus?: "available" | "configured_unavailable" | "missing";
  credentialDiagnostics?: NextcloudTalkCredentialUnavailableDiagnostic[];
  config: NextcloudTalkAccountConfig;
};
//#endregion
//#region extensions/nextcloud-talk/src/channel.d.ts
declare const nextcloudTalkPlugin: ChannelPlugin<ResolvedNextcloudTalkAccount>;
//#endregion
export { nextcloudTalkPlugin as t };