import { K as GroupPolicy, l as TelegramAccountConfig$1, n as OpenClawConfig } from "./types.openclaw-DhIzMzKO.js";
import { U as ChannelMessageActionAdapter, rn as ReplyPayload, vt as ExecApprovalRequest } from "./types.adapters-BxgsWXLj.js";
import { n as MonitorTelegramOpts } from "./runtime-7q77T6si.js";
import { z } from "zod";
import { DatabaseSync } from "node:sqlite";
//#region src/infra/net/proxy-fetch.d.ts
/**
 * Create a fetch function that routes requests through the given HTTP proxy.
 * Uses undici's ProxyAgent under the hood.
 */
declare function makeProxyFetch(proxyUrl: string): typeof fetch;
//#endregion
//#region packages/acp-core/src/runtime/errors.d.ts
declare const ACP_ERROR_CODES: readonly ["ACP_BACKEND_MISSING", "ACP_BACKEND_UNAVAILABLE", "ACP_BACKEND_UNSUPPORTED_CONTROL", "ACP_DISPATCH_DISABLED", "ACP_INVALID_RUNTIME_OPTION", "ACP_SESSION_INIT_FAILED", "ACP_TURN_FAILED"];
type AcpRuntimeErrorCode = (typeof ACP_ERROR_CODES)[number];
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
declare class AcpRuntimeError extends Error {
  readonly code: AcpRuntimeErrorCode;
  /**
   * Backend-specific structured failure code (e.g. acpx "SESSION_RESUME_REQUIRED"),
   * preserved so recovery decisions key on the failure kind rather than parsing
   * the human-readable message.
   */
  readonly detailCode?: string;
  readonly cause?: unknown;
  constructor(code: AcpRuntimeErrorCode, message: string, options?: {
    cause?: unknown;
    detailCode?: string;
  });
}
//#endregion
//#region extensions/telegram/src/config-schema.d.ts
declare const TelegramConfigSchema: z.ZodObject<{
  linkPreview: z.ZodOptional<z.ZodBoolean>;
  silentErrorReplies: z.ZodOptional<z.ZodBoolean>;
  errorPolicy: z.ZodOptional<z.ZodEnum<{
    silent: "silent";
    always: "always";
    once: "once";
  }>>;
  apiRoot: z.ZodOptional<z.ZodString>;
  trustedLocalFileRoots: z.ZodOptional<z.ZodArray<z.ZodString>>;
  autoTopicLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    prompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>]>>;
  ackReaction?: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: z.ZodOptional<z.ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>> | undefined;
  reactionNotifications?: z.ZodOptional<z.ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  execApprovals: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
    approvers: z.ZodOptional<z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    target: z.ZodOptional<z.ZodEnum<{
      channel: "channel";
      dm: "dm";
      both: "both";
    }>>;
  }, z.core.$strict>>;
  commands: z.ZodOptional<z.ZodObject<{
    native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
    nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  }, z.core.$strict>>;
  customCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
    command: z.ZodString;
    description: z.ZodString;
  }, z.core.$strict>>>;
  botToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  tokenFile: z.ZodOptional<z.ZodString>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    ingest: z.ZodOptional<z.ZodBoolean>;
    disableAudioPreflight: z.ZodOptional<z.ZodBoolean>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      open: "open";
      allowlist: "allowlist";
      disabled: "disabled";
    }>>;
    topics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      requireMention: z.ZodOptional<z.ZodBoolean>;
      ingest: z.ZodOptional<z.ZodBoolean>;
      disableAudioPreflight: z.ZodOptional<z.ZodBoolean>;
      groupPolicy: z.ZodOptional<z.ZodEnum<{
        open: "open";
        allowlist: "allowlist";
        disabled: "disabled";
      }>>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
      agentId: z.ZodOptional<z.ZodString>;
      errorPolicy: z.ZodOptional<z.ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
    }, z.core.$strict>>>>;
    errorPolicy: z.ZodOptional<z.ZodEnum<{
      silent: "silent";
      always: "always";
      once: "once";
    }>>;
  }, z.core.$strict>>>>;
  direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      open: "open";
      pairing: "pairing";
      allowlist: "allowlist";
      disabled: "disabled";
    }>>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      requireMention: z.ZodOptional<z.ZodBoolean>;
      ingest: z.ZodOptional<z.ZodBoolean>;
      disableAudioPreflight: z.ZodOptional<z.ZodBoolean>;
      groupPolicy: z.ZodOptional<z.ZodEnum<{
        open: "open";
        allowlist: "allowlist";
        disabled: "disabled";
      }>>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
      agentId: z.ZodOptional<z.ZodString>;
      errorPolicy: z.ZodOptional<z.ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
    }, z.core.$strict>>>>;
    errorPolicy: z.ZodOptional<z.ZodEnum<{
      silent: "silent";
      always: "always";
      once: "once";
    }>>;
    requireTopic: z.ZodOptional<z.ZodBoolean>;
    autoTopicLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      prompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
  }, z.core.$strict>>>>;
  richMessages: z.ZodOptional<z.ZodBoolean>;
  network: z.ZodOptional<z.ZodObject<{
    autoSelectFamily: z.ZodOptional<z.ZodBoolean>;
    dnsResultOrder: z.ZodOptional<z.ZodEnum<{
      ipv4first: "ipv4first";
      verbatim: "verbatim";
    }>>;
    dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  proxy: z.ZodOptional<z.ZodString>;
  webhookUrl: z.ZodOptional<z.ZodString>;
  webhookSecret: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  webhookPath: z.ZodOptional<z.ZodString>;
  webhookHost: z.ZodOptional<z.ZodString>;
  webhookPort: z.ZodOptional<z.ZodNumber>;
  webhookCertPath: z.ZodOptional<z.ZodString>;
  actions: z.ZodOptional<z.ZodObject<{
    reactions: z.ZodOptional<z.ZodBoolean>;
    sendMessage: z.ZodOptional<z.ZodBoolean>;
    poll: z.ZodOptional<z.ZodBoolean>;
    deleteMessage: z.ZodOptional<z.ZodBoolean>;
    editMessage: z.ZodOptional<z.ZodBoolean>;
    sticker: z.ZodOptional<z.ZodBoolean>;
    createForumTopic: z.ZodOptional<z.ZodBoolean>;
    editForumTopic: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  threadBindings: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    idleHours: z.ZodOptional<z.ZodNumber>;
    maxAgeHours: z.ZodOptional<z.ZodNumber>;
    spawnSessions: z.ZodOptional<z.ZodBoolean>;
    defaultSpawnContext: z.ZodOptional<z.ZodEnum<{
      isolated: "isolated";
      fork: "fork";
    }>>;
  }, z.core.$strict>>;
  name: z.ZodOptional<z.ZodString>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  capabilities: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodObject<{
    inlineButtons: z.ZodOptional<z.ZodEnum<{
      group: "group";
      off: "off";
      all: "all";
      allowlist: "allowlist";
      dm: "dm";
    }>>;
  }, z.core.$strict>]>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  defaultTo: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  mentionPatterns: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  streaming: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
      progress: "progress";
      block: "block";
      off: "off";
      partial: "partial";
    }>>;
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    progress: z.ZodOptional<z.ZodObject<{
      label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
      labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      maxLines: z.ZodOptional<z.ZodNumber>;
      maxLineChars: z.ZodOptional<z.ZodNumber>;
      toolProgress: z.ZodOptional<z.ZodBoolean>;
      commandText: z.ZodOptional<z.ZodEnum<{
        raw: "raw";
        status: "status";
      }>>;
      commentary: z.ZodOptional<z.ZodBoolean>;
      narration: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    preview: z.ZodOptional<z.ZodObject<{
      chunk: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
      }, z.core.$strict>>;
      toolProgress: z.ZodOptional<z.ZodBoolean>;
      commandText: z.ZodOptional<z.ZodEnum<{
        raw: "raw";
        status: "status";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      off: "off";
      bullets: "bullets";
      code: "code";
    }>>;
  }, z.core.$strict>>;
  dmPolicy: z.ZodOptional<z.ZodEnum<{
    open: "open";
    pairing: "pairing";
    allowlist: "allowlist";
    disabled: "disabled";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    open: "open";
    pairing: "pairing";
    allowlist: "allowlist";
    disabled: "disabled";
  }>>>;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    open: "open";
    allowlist: "allowlist";
    disabled: "disabled";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    open: "open";
    allowlist: "allowlist";
    disabled: "disabled";
  }>>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    linkPreview: z.ZodOptional<z.ZodBoolean>;
    silentErrorReplies: z.ZodOptional<z.ZodBoolean>;
    errorPolicy: z.ZodOptional<z.ZodEnum<{
      silent: "silent";
      always: "always";
      once: "once";
    }>>;
    apiRoot: z.ZodOptional<z.ZodString>;
    trustedLocalFileRoots: z.ZodOptional<z.ZodArray<z.ZodString>>;
    autoTopicLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      prompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    ackReaction?: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: z.ZodOptional<z.ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>> | undefined;
    reactionNotifications?: z.ZodOptional<z.ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    execApprovals: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      approvers: z.ZodOptional<z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
      agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      target: z.ZodOptional<z.ZodEnum<{
        channel: "channel";
        dm: "dm";
        both: "both";
      }>>;
    }, z.core.$strict>>;
    commands: z.ZodOptional<z.ZodObject<{
      native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
    }, z.core.$strict>>;
    customCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
      command: z.ZodString;
      description: z.ZodString;
    }, z.core.$strict>>>;
    botToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    tokenFile: z.ZodOptional<z.ZodString>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
      ingest: z.ZodOptional<z.ZodBoolean>;
      disableAudioPreflight: z.ZodOptional<z.ZodBoolean>;
      groupPolicy: z.ZodOptional<z.ZodEnum<{
        open: "open";
        allowlist: "allowlist";
        disabled: "disabled";
      }>>;
      topics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        requireMention: z.ZodOptional<z.ZodBoolean>;
        ingest: z.ZodOptional<z.ZodBoolean>;
        disableAudioPreflight: z.ZodOptional<z.ZodBoolean>;
        groupPolicy: z.ZodOptional<z.ZodEnum<{
          open: "open";
          allowlist: "allowlist";
          disabled: "disabled";
        }>>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        agentId: z.ZodOptional<z.ZodString>;
        errorPolicy: z.ZodOptional<z.ZodEnum<{
          silent: "silent";
          always: "always";
          once: "once";
        }>>;
      }, z.core.$strict>>>>;
      errorPolicy: z.ZodOptional<z.ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
    }, z.core.$strict>>>>;
    direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      dmPolicy: z.ZodOptional<z.ZodEnum<{
        open: "open";
        pairing: "pairing";
        allowlist: "allowlist";
        disabled: "disabled";
      }>>;
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
      topics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        requireMention: z.ZodOptional<z.ZodBoolean>;
        ingest: z.ZodOptional<z.ZodBoolean>;
        disableAudioPreflight: z.ZodOptional<z.ZodBoolean>;
        groupPolicy: z.ZodOptional<z.ZodEnum<{
          open: "open";
          allowlist: "allowlist";
          disabled: "disabled";
        }>>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        agentId: z.ZodOptional<z.ZodString>;
        errorPolicy: z.ZodOptional<z.ZodEnum<{
          silent: "silent";
          always: "always";
          once: "once";
        }>>;
      }, z.core.$strict>>>>;
      errorPolicy: z.ZodOptional<z.ZodEnum<{
        silent: "silent";
        always: "always";
        once: "once";
      }>>;
      requireTopic: z.ZodOptional<z.ZodBoolean>;
      autoTopicLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        prompt: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>;
    }, z.core.$strict>>>>;
    richMessages: z.ZodOptional<z.ZodBoolean>;
    network: z.ZodOptional<z.ZodObject<{
      autoSelectFamily: z.ZodOptional<z.ZodBoolean>;
      dnsResultOrder: z.ZodOptional<z.ZodEnum<{
        ipv4first: "ipv4first";
        verbatim: "verbatim";
      }>>;
      dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    proxy: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    webhookSecret: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    webhookPath: z.ZodOptional<z.ZodString>;
    webhookHost: z.ZodOptional<z.ZodString>;
    webhookPort: z.ZodOptional<z.ZodNumber>;
    webhookCertPath: z.ZodOptional<z.ZodString>;
    actions: z.ZodOptional<z.ZodObject<{
      reactions: z.ZodOptional<z.ZodBoolean>;
      sendMessage: z.ZodOptional<z.ZodBoolean>;
      poll: z.ZodOptional<z.ZodBoolean>;
      deleteMessage: z.ZodOptional<z.ZodBoolean>;
      editMessage: z.ZodOptional<z.ZodBoolean>;
      sticker: z.ZodOptional<z.ZodBoolean>;
      createForumTopic: z.ZodOptional<z.ZodBoolean>;
      editForumTopic: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    threadBindings: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      idleHours: z.ZodOptional<z.ZodNumber>;
      maxAgeHours: z.ZodOptional<z.ZodNumber>;
      spawnSessions: z.ZodOptional<z.ZodBoolean>;
      defaultSpawnContext: z.ZodOptional<z.ZodEnum<{
        isolated: "isolated";
        fork: "fork";
      }>>;
    }, z.core.$strict>>;
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    capabilities: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodObject<{
      inlineButtons: z.ZodOptional<z.ZodEnum<{
        group: "group";
        off: "off";
        all: "all";
        allowlist: "allowlist";
        dm: "dm";
      }>>;
    }, z.core.$strict>]>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    defaultTo: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    mentionPatterns: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
      denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    streaming: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        progress: "progress";
        block: "block";
        off: "off";
        partial: "partial";
      }>>;
      chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      progress: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
        labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        maxLines: z.ZodOptional<z.ZodNumber>;
        maxLineChars: z.ZodOptional<z.ZodNumber>;
        toolProgress: z.ZodOptional<z.ZodBoolean>;
        commandText: z.ZodOptional<z.ZodEnum<{
          raw: "raw";
          status: "status";
        }>>;
        commentary: z.ZodOptional<z.ZodBoolean>;
        narration: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      block: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        coalesce: z.ZodOptional<z.ZodObject<{
          minChars: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          idleMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      preview: z.ZodOptional<z.ZodObject<{
        chunk: z.ZodOptional<z.ZodObject<{
          minChars: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
        }, z.core.$strict>>;
        toolProgress: z.ZodOptional<z.ZodBoolean>;
        commandText: z.ZodOptional<z.ZodEnum<{
          raw: "raw";
          status: "status";
        }>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        off: "off";
        bullets: "bullets";
        code: "code";
      }>>;
    }, z.core.$strict>>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      open: "open";
      pairing: "pairing";
      allowlist: "allowlist";
      disabled: "disabled";
    }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      open: "open";
      pairing: "pairing";
      allowlist: "allowlist";
      disabled: "disabled";
    }>>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      open: "open";
      allowlist: "allowlist";
      disabled: "disabled";
    }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      open: "open";
      allowlist: "allowlist";
      disabled: "disabled";
    }>>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//#endregion
//#region extensions/telegram/src/group-access.d.ts
declare const resolveTelegramRuntimeGroupPolicy: (params: {
  providerConfigPresent: boolean;
  groupPolicy?: TelegramAccountConfig$1["groupPolicy"];
  defaultGroupPolicy?: TelegramAccountConfig$1["groupPolicy"];
}) => {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
//#endregion
//#region extensions/telegram/src/exec-approval-forwarding.d.ts
declare function shouldSuppressTelegramExecApprovalForwardingFallback(params: {
  cfg: OpenClawConfig;
  target: {
    channel: string;
    accountId?: string | null;
  };
  request: ExecApprovalRequest;
}): boolean;
declare function buildTelegramExecApprovalPendingPayload(params: {
  request: ExecApprovalRequest;
  nowMs: number;
}): ReplyPayload;
//#endregion
//#region extensions/telegram/src/channel-actions.d.ts
declare const telegramMessageActions: ChannelMessageActionAdapter;
//#endregion
//#region extensions/telegram/src/monitor.d.ts
declare function monitorTelegramProvider(opts?: MonitorTelegramOpts): Promise<void>;
//#endregion
//#region extensions/telegram/src/poll-visibility.d.ts
declare function resolveTelegramPollVisibility(params: {
  pollAnonymous?: boolean;
  pollPublic?: boolean;
}): boolean | undefined;
//#endregion
//#region extensions/telegram/runtime-api.d.ts
type TelegramAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["telegram"]>;
type TelegramActionConfig = NonNullable<TelegramAccountConfig["actions"]>;
type TelegramNetworkConfig = NonNullable<TelegramAccountConfig["network"]>;
//#endregion
export { monitorTelegramProvider as a, shouldSuppressTelegramExecApprovalForwardingFallback as c, AcpRuntimeError as d, AcpRuntimeErrorCode as f, resolveTelegramPollVisibility as i, resolveTelegramRuntimeGroupPolicy as l, TelegramActionConfig as n, telegramMessageActions as o, makeProxyFetch as p, TelegramNetworkConfig as r, buildTelegramExecApprovalPendingPayload as s, TelegramAccountConfig as t, TelegramConfigSchema as u };