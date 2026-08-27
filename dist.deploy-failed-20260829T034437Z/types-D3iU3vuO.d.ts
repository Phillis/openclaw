import { Dt as MediaKind, U as MessageReceipt, k as BaseProbeResult } from "./channel-contract-Pji552cX.js";
import "./channel-outbound-BhlIlPtN.js";
import "./media-runtime-DnpuJTB9.js";
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
  historyLimit?: number;
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
type LineRichCard = {
  type: "media_player";
  title: string;
  artist?: string;
  source?: string;
  imageUrl?: string;
  status?: "playing" | "paused";
} | {
  type: "event";
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
} | {
  type: "agenda";
  title: string;
  events: Array<{
    title: string;
    time?: string;
    location?: string;
  }>;
} | {
  type: "device";
  name: string;
  deviceType?: string;
  status?: string;
  controls?: Array<{
    label: string;
    action: string;
  }>;
} | {
  type: "appletv_remote";
  name?: string;
  status?: string;
};
type LineQuickReplyItem = {
  label: string;
  action: {
    type: "command";
    command: string;
  } | {
    type: "callback";
    value: string;
  };
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
  quickReplyItems?: LineQuickReplyItem[];
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
  card?: LineRichCard;
  flexMessage?: LineFlexMessagePayload;
  templateMessage?: LineTemplateMessagePayload;
};
type LineOutboundMediaKind = Extract<MediaKind, "image" | "video" | "audio">;
//#endregion
export { LineProbeResult as a, ResolvedLineAccount as c, LineOutboundMediaKind as i, LineConfig as n, LineSendResult as o, LineGroupConfig as r, LineTemplateMessagePayload as s, LineChannelData as t };