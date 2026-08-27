import { n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { _t as MessageReceipt, z as BaseProbeResult } from "./setup-wizard-types-BJbOEFA2.js";
import { E as MediaKind } from "./templating-B3rf5Xpv.js";
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
//#region extensions/line/src/types.d.ts
type LineTokenSource = "config" | "env" | "file" | "none";
type LineCredentialStatus = "available" | "configured_unavailable" | "missing";
type LineCredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
interface LineThreadBindingsConfig {
  enabled?: boolean;
  idleHours?: number;
  maxAgeHours?: number;
  spawnSessions?: boolean;
  defaultSpawnContext?: "isolated" | "fork";
}
interface LineAccountBaseConfig {
  enabled?: boolean;
  channelAccessToken?: string;
  channelSecret?: string;
  tokenFile?: string;
  secretFile?: string;
  name?: string;
  allowFrom?: Array<string | number>;
  groupAllowFrom?: Array<string | number>;
  dmPolicy?: "open" | "allowlist" | "pairing" | "disabled";
  groupPolicy?: "open" | "allowlist" | "disabled";
  responsePrefix?: string;
  mediaMaxMb?: number;
  webhookPath?: string;
  threadBindings?: LineThreadBindingsConfig;
  groups?: Record<string, LineGroupConfig>;
}
interface LineConfig extends LineAccountBaseConfig {
  accounts?: Record<string, LineAccountConfig>;
  defaultAccount?: string;
}
interface LineAccountConfig extends LineAccountBaseConfig {}
interface LineGroupConfig {
  enabled?: boolean;
  allowFrom?: Array<string | number>;
  requireMention?: boolean;
  systemPrompt?: string;
  skills?: string[];
}
interface ResolvedLineAccount {
  accountId: string;
  name?: string;
  enabled: boolean;
  channelAccessToken: string;
  channelSecret: string;
  tokenSource: LineTokenSource;
  signingSecretSource?: LineTokenSource;
  tokenStatus?: LineCredentialStatus;
  signingSecretStatus?: LineCredentialStatus;
  credentialDiagnostics?: LineCredentialUnavailableDiagnostic[];
  config: LineConfig & LineAccountConfig;
}
interface LineSendResult {
  messageId: string;
  chatId: string;
  receipt: MessageReceipt;
}
type LineProbeResult = BaseProbeResult<string> & {
  elapsedMs?: number;
  bot?: {
    displayName?: string;
    userId?: string;
    basicId?: string;
    pictureUrl?: string;
  };
};
type LineFlexMessagePayload = {
  altText: string;
  contents: unknown;
};
type LineTemplateMessagePayload = {
  type: "confirm";
  text: string;
  confirmLabel: string;
  confirmData: string;
  cancelLabel: string;
  cancelData: string;
  altText?: string;
} | {
  type: "buttons";
  title?: string;
  text: string;
  actions: Array<{
    type: "message" | "uri" | "postback";
    label: string;
    data?: string;
    uri?: string;
  }>;
  thumbnailImageUrl?: string;
  altText?: string;
} | {
  type: "carousel";
  columns: Array<{
    title?: string;
    text: string;
    thumbnailImageUrl?: string;
    actions: Array<{
      type: "message" | "uri" | "postback";
      label: string;
      data?: string;
      uri?: string;
    }>;
  }>;
  altText?: string;
};
type LineChannelData = {
  quickReplies?: string[];
  mediaKind?: LineOutboundMediaKind;
  previewImageUrl?: string;
  durationMs?: number;
  trackingId?: string;
  location?: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  flexMessage?: LineFlexMessagePayload;
  templateMessage?: LineTemplateMessagePayload;
};
type LineOutboundMediaKind = Extract<MediaKind, "image" | "video" | "audio">;
//#endregion
//#region extensions/line/src/accounts.d.ts
declare function resolveLineAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedLineAccount;
declare function listLineAccountIds(cfg: OpenClawConfig): string[];
declare function resolveDefaultLineAccountId(cfg: OpenClawConfig): string;
declare function normalizeAccountId(accountId: string | undefined): string;
//#endregion
export { LineChannelData as a, LineOutboundMediaKind as c, LineTemplateMessagePayload as d, ResolvedLineAccount as f, resolveLineAccount as i, LineProbeResult as l, normalizeAccountId as n, LineConfig as o, resolveDefaultLineAccountId as r, LineGroupConfig as s, listLineAccountIds as t, LineSendResult as u };