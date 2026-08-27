import "./plugin-entry-Bvo-51M-.js";
import "./types.config-CGDAHrEQ.js";
import { z as BaseProbeResult } from "./types.adapters-UsYT95C9.js";
import { n as ChannelPlugin } from "./types.public-BgN3WB8T.js";
import "./media-runtime-B2cHH870.js";
import { z as z$1 } from "zod";
//#region extensions/feishu/src/config-schema.d.ts
declare const FeishuConfigSchema: z$1.ZodObject<{
  dmPolicy: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodEnum<{
    disabled: "disabled";
    pairing: "pairing";
    allowlist: "allowlist";
    open: "open";
  }>>>;
  reactionNotifications: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodOptional<z$1.ZodEnum<{
    off: "off";
    all: "all";
    own: "own";
  }>>>>;
  groupPolicy: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodUnion<readonly [z$1.ZodEnum<{
    disabled: "disabled";
    allowlist: "allowlist";
    open: "open";
  }>, z$1.ZodPipe<z$1.ZodLiteral<"allowall">, z$1.ZodTransform<"open", "allowall">>]>>>;
  requireMention: z$1.ZodOptional<z$1.ZodBoolean>;
  groupSessionScope: z$1.ZodOptional<z$1.ZodEnum<{
    group: "group";
    group_sender: "group_sender";
    group_topic: "group_topic";
    group_topic_sender: "group_topic_sender";
  }>>;
  topicSessionMode: z$1.ZodOptional<z$1.ZodEnum<{
    disabled: "disabled";
    enabled: "enabled";
  }>>;
  dynamicAgentCreation: z$1.ZodOptional<z$1.ZodObject<{
    enabled: z$1.ZodOptional<z$1.ZodBoolean>;
    workspaceTemplate: z$1.ZodOptional<z$1.ZodString>;
    agentDirTemplate: z$1.ZodOptional<z$1.ZodString>;
    maxAgents: z$1.ZodOptional<z$1.ZodNumber>;
  }, z$1.core.$strict>>;
  typingIndicator: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodBoolean>>;
  resolveSenderNames: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodBoolean>>;
  webhookHost: z$1.ZodOptional<z$1.ZodString>;
  webhookPort: z$1.ZodOptional<z$1.ZodNumber>;
  capabilities: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
  markdown: z$1.ZodOptional<z$1.ZodObject<{
    mode: z$1.ZodOptional<z$1.ZodEnum<{
      native: "native";
      strip: "strip";
      escape: "escape";
    }>>;
    tableMode: z$1.ZodOptional<z$1.ZodEnum<{
      native: "native";
      ascii: "ascii";
      simple: "simple";
    }>>;
  }, z$1.core.$strict>>;
  configWrites: z$1.ZodOptional<z$1.ZodBoolean>;
  replyToMode: z$1.ZodOptional<z$1.ZodUnion<readonly [z$1.ZodLiteral<"off">, z$1.ZodLiteral<"first">, z$1.ZodLiteral<"all">, z$1.ZodLiteral<"batched">]>>;
  responsePrefix: z$1.ZodOptional<z$1.ZodString>;
  allowFrom: z$1.ZodOptional<z$1.ZodArray<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodNumber]>>>;
  groupAllowFrom: z$1.ZodOptional<z$1.ZodArray<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodNumber]>>>;
  groupSenderAllowFrom: z$1.ZodOptional<z$1.ZodArray<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodNumber]>>>;
  groups: z$1.ZodOptional<z$1.ZodRecord<z$1.ZodString, z$1.ZodOptional<z$1.ZodObject<{
    systemPrompt: z$1.ZodOptional<z$1.ZodString>;
    enabled: z$1.ZodOptional<z$1.ZodBoolean>;
    allowFrom: z$1.ZodOptional<z$1.ZodArray<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodNumber]>>>;
    requireMention: z$1.ZodOptional<z$1.ZodBoolean>;
    tools: z$1.ZodOptional<z$1.ZodObject<{
      allow: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
      alsoAllow: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
      deny: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
    }, z$1.core.$strict>> & z$1.ZodOptional<z$1.ZodObject<{
      allow: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
      deny: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
    }, z$1.core.$strict>>;
    skills: z$1.ZodOptional<z$1.ZodArray<z$1.ZodString>>;
    groupSessionScope: z$1.ZodOptional<z$1.ZodEnum<{
      group: "group";
      group_sender: "group_sender";
      group_topic: "group_topic";
      group_topic_sender: "group_topic_sender";
    }>>;
    topicSessionMode: z$1.ZodOptional<z$1.ZodEnum<{
      disabled: "disabled";
      enabled: "enabled";
    }>>;
    replyInThread: z$1.ZodOptional<z$1.ZodEnum<{
      disabled: "disabled";
      enabled: "enabled";
    }>>;
  }, z$1.core.$strict>>>>;
  historyLimit: z$1.ZodOptional<z$1.ZodNumber>;
  dmHistoryLimit: z$1.ZodOptional<z$1.ZodNumber>;
  dms: z$1.ZodOptional<z$1.ZodRecord<z$1.ZodString, z$1.ZodOptional<z$1.ZodObject<{
    enabled: z$1.ZodOptional<z$1.ZodBoolean>;
    systemPrompt: z$1.ZodOptional<z$1.ZodString>;
  }, z$1.core.$strict>>>>;
  textChunkLimit: z$1.ZodOptional<z$1.ZodNumber>;
  mediaMaxMb: z$1.ZodOptional<z$1.ZodNumber>;
  httpTimeoutMs: z$1.ZodOptional<z$1.ZodNumber>;
  heartbeatVisibility: z$1.ZodOptional<z$1.ZodObject<{
    visibility: z$1.ZodOptional<z$1.ZodEnum<{
      visible: "visible";
      hidden: "hidden";
    }>>;
    intervalMs: z$1.ZodOptional<z$1.ZodNumber>;
  }, z$1.core.$strict>>;
  renderMode: z$1.ZodOptional<z$1.ZodEnum<{
    raw: "raw";
    card: "card";
    auto: "auto";
  }>>;
  streaming: z$1.ZodOptional<z$1.ZodObject<{
    mode: z$1.ZodOptional<z$1.ZodEnum<{
      off: "off";
      partial: "partial";
    }>>;
    chunkMode: z$1.ZodOptional<z$1.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z$1.ZodOptional<z$1.ZodObject<{
      enabled: z$1.ZodOptional<z$1.ZodBoolean>;
      coalesce: z$1.ZodOptional<z$1.ZodObject<{
        minChars: z$1.ZodOptional<z$1.ZodNumber>;
        maxChars: z$1.ZodOptional<z$1.ZodNumber>;
        idleMs: z$1.ZodOptional<z$1.ZodNumber>;
      }, z$1.core.$strict>>;
    }, z$1.core.$strict>>;
  }, z$1.core.$strict>>;
  tools: z$1.ZodOptional<z$1.ZodObject<{
    doc: z$1.ZodOptional<z$1.ZodBoolean>;
    chat: z$1.ZodOptional<z$1.ZodBoolean>;
    wiki: z$1.ZodOptional<z$1.ZodBoolean>;
    drive: z$1.ZodOptional<z$1.ZodBoolean>;
    perm: z$1.ZodOptional<z$1.ZodBoolean>;
    scopes: z$1.ZodOptional<z$1.ZodBoolean>;
    bitable: z$1.ZodOptional<z$1.ZodBoolean>;
  }, z$1.core.$strict>>;
  actions: z$1.ZodOptional<z$1.ZodObject<{
    reactions: z$1.ZodOptional<z$1.ZodBoolean>;
    sticker: z$1.ZodOptional<z$1.ZodBoolean>;
  }, z$1.core.$strict>>;
  replyInThread: z$1.ZodOptional<z$1.ZodEnum<{
    disabled: "disabled";
    enabled: "enabled";
  }>>;
  allowBots: z$1.ZodOptional<z$1.ZodBoolean>;
  vcAutoJoin: z$1.ZodOptional<z$1.ZodBoolean>;
  tts: z$1.ZodOptional<z$1.ZodObject<{
    auto: z$1.ZodOptional<z$1.ZodEnum<{
      off: "off";
      inbound: "inbound";
      always: "always";
      tagged: "tagged";
    }>>;
    enabled: z$1.ZodOptional<z$1.ZodBoolean>;
    mode: z$1.ZodOptional<z$1.ZodEnum<{
      all: "all";
      final: "final";
    }>>;
    provider: z$1.ZodOptional<z$1.ZodString>;
    persona: z$1.ZodOptional<z$1.ZodString>;
    personas: z$1.ZodOptional<z$1.ZodRecord<z$1.ZodString, z$1.ZodRecord<z$1.ZodString, z$1.ZodUnknown>>>;
    summaryModel: z$1.ZodOptional<z$1.ZodString>;
    modelOverrides: z$1.ZodOptional<z$1.ZodRecord<z$1.ZodString, z$1.ZodUnknown>>;
    providers: z$1.ZodOptional<z$1.ZodRecord<z$1.ZodString, z$1.ZodRecord<z$1.ZodString, z$1.ZodUnknown>>>;
    prefsPath: z$1.ZodOptional<z$1.ZodString>;
    maxTextLength: z$1.ZodOptional<z$1.ZodNumber>;
    timeoutMs: z$1.ZodOptional<z$1.ZodNumber>;
  }, z$1.core.$strict>>;
  enabled: z$1.ZodOptional<z$1.ZodBoolean>;
  stickerSets: z$1.ZodOptional<z$1.ZodRecord<z$1.ZodString, z$1.ZodRecord<z$1.ZodString, z$1.ZodArray<z$1.ZodString>>>>;
  appId: z$1.ZodOptional<z$1.ZodString>;
  appSecret: z$1.ZodOptional<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodDiscriminatedUnion<[z$1.ZodObject<{
    source: z$1.ZodLiteral<"env">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"store">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"file">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"exec">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>], "source">]>>;
  encryptKey: z$1.ZodOptional<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodDiscriminatedUnion<[z$1.ZodObject<{
    source: z$1.ZodLiteral<"env">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"store">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"file">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"exec">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>], "source">]>>;
  verificationToken: z$1.ZodOptional<z$1.ZodUnion<readonly [z$1.ZodString, z$1.ZodDiscriminatedUnion<[z$1.ZodObject<{
    source: z$1.ZodLiteral<"env">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"store">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"file">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>, z$1.ZodObject<{
    source: z$1.ZodLiteral<"exec">;
    provider: z$1.ZodString;
    id: z$1.ZodString;
  }, z$1.core.$strict>], "source">]>>;
  domain: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodUnion<readonly [z$1.ZodEnum<{
    feishu: "feishu";
    lark: "lark";
  }>, z$1.ZodString]>>>;
  connectionMode: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodEnum<{
    webhook: "webhook";
    websocket: "websocket";
  }>>>;
  webhookPath: z$1.ZodDefault<z$1.ZodOptional<z$1.ZodString>>;
  accounts: z$1.ZodOptional<z$1.ZodType<Record<string, {
    groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
    topicSessionMode?: "disabled" | "enabled" | undefined;
    webhookHost?: string | undefined;
    webhookPort?: number | undefined;
    capabilities?: string[] | undefined;
    markdown?: {
      mode?: "native" | "strip" | "escape" | undefined;
      tableMode?: "native" | "ascii" | "simple" | undefined;
    } | undefined;
    configWrites?: boolean | undefined;
    replyToMode?: "off" | "first" | "all" | "batched" | undefined;
    responsePrefix?: string | undefined;
    dmPolicy?: "disabled" | "pairing" | "allowlist" | "open" | undefined;
    allowFrom?: (string | number)[] | undefined;
    groupPolicy?: "disabled" | "allowlist" | "open" | undefined;
    groupAllowFrom?: (string | number)[] | undefined;
    groupSenderAllowFrom?: (string | number)[] | undefined;
    requireMention?: boolean | undefined;
    groups?: Record<string, {
      systemPrompt?: string | undefined;
      enabled?: boolean | undefined;
      allowFrom?: (string | number)[] | undefined;
      requireMention?: boolean | undefined;
      tools?: ({
        allow?: string[] | undefined;
        alsoAllow?: string[] | undefined;
        deny?: string[] | undefined;
      } & {
        allow?: string[] | undefined;
        deny?: string[] | undefined;
      }) | undefined;
      skills?: string[] | undefined;
      groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
      topicSessionMode?: "disabled" | "enabled" | undefined;
      replyInThread?: "disabled" | "enabled" | undefined;
    } | undefined> | undefined;
    historyLimit?: number | undefined;
    dmHistoryLimit?: number | undefined;
    dms?: Record<string, {
      enabled?: boolean | undefined;
      systemPrompt?: string | undefined;
    } | undefined> | undefined;
    textChunkLimit?: number | undefined;
    mediaMaxMb?: number | undefined;
    httpTimeoutMs?: number | undefined;
    heartbeatVisibility?: {
      visibility?: "visible" | "hidden" | undefined;
      intervalMs?: number | undefined;
    } | undefined;
    renderMode?: "raw" | "card" | "auto" | undefined;
    streaming?: {
      mode?: "off" | "partial" | undefined;
      chunkMode?: "length" | "newline" | undefined;
      block?: {
        enabled?: boolean | undefined;
        coalesce?: {
          minChars?: number | undefined;
          maxChars?: number | undefined;
          idleMs?: number | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    tools?: {
      doc?: boolean | undefined;
      chat?: boolean | undefined;
      wiki?: boolean | undefined;
      drive?: boolean | undefined;
      perm?: boolean | undefined;
      scopes?: boolean | undefined;
      bitable?: boolean | undefined;
    } | undefined;
    actions?: {
      reactions?: boolean | undefined;
      sticker?: boolean | undefined;
    } | undefined;
    replyInThread?: "disabled" | "enabled" | undefined;
    reactionNotifications?: "off" | "all" | "own" | undefined;
    typingIndicator?: boolean | undefined;
    resolveSenderNames?: boolean | undefined;
    allowBots?: boolean | undefined;
    vcAutoJoin?: boolean | undefined;
    tts?: {
      auto?: "off" | "inbound" | "always" | "tagged" | undefined;
      enabled?: boolean | undefined;
      mode?: "all" | "final" | undefined;
      provider?: string | undefined;
      persona?: string | undefined;
      personas?: Record<string, Record<string, unknown>> | undefined;
      summaryModel?: string | undefined;
      modelOverrides?: Record<string, unknown> | undefined;
      providers?: Record<string, Record<string, unknown>> | undefined;
      prefsPath?: string | undefined;
      maxTextLength?: number | undefined;
      timeoutMs?: number | undefined;
    } | undefined;
    enabled?: boolean | undefined;
    name?: string | undefined;
    appId?: string | undefined;
    appSecret?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    encryptKey?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    verificationToken?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    domain?: string | undefined;
    connectionMode?: "webhook" | "websocket" | undefined;
    webhookPath?: string | undefined;
  } | undefined>, Record<string, {
    groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
    topicSessionMode?: "disabled" | "enabled" | undefined;
    webhookHost?: string | undefined;
    webhookPort?: number | undefined;
    capabilities?: string[] | undefined;
    markdown?: {
      mode?: "native" | "strip" | "escape" | undefined;
      tableMode?: "native" | "ascii" | "simple" | undefined;
    } | undefined;
    configWrites?: boolean | undefined;
    replyToMode?: "off" | "first" | "all" | "batched" | undefined;
    responsePrefix?: string | undefined;
    dmPolicy?: "disabled" | "pairing" | "allowlist" | "open" | undefined;
    allowFrom?: (string | number)[] | undefined;
    groupPolicy?: "disabled" | "allowlist" | "open" | "allowall" | undefined;
    groupAllowFrom?: (string | number)[] | undefined;
    groupSenderAllowFrom?: (string | number)[] | undefined;
    requireMention?: boolean | undefined;
    groups?: Record<string, {
      systemPrompt?: string | undefined;
      enabled?: boolean | undefined;
      allowFrom?: (string | number)[] | undefined;
      requireMention?: boolean | undefined;
      tools?: ({
        allow?: string[] | undefined;
        alsoAllow?: string[] | undefined;
        deny?: string[] | undefined;
      } & {
        allow?: string[] | undefined;
        deny?: string[] | undefined;
      }) | undefined;
      skills?: string[] | undefined;
      groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
      topicSessionMode?: "disabled" | "enabled" | undefined;
      replyInThread?: "disabled" | "enabled" | undefined;
    } | undefined> | undefined;
    historyLimit?: number | undefined;
    dmHistoryLimit?: number | undefined;
    dms?: Record<string, {
      enabled?: boolean | undefined;
      systemPrompt?: string | undefined;
    } | undefined> | undefined;
    textChunkLimit?: number | undefined;
    mediaMaxMb?: number | undefined;
    httpTimeoutMs?: number | undefined;
    heartbeatVisibility?: {
      visibility?: "visible" | "hidden" | undefined;
      intervalMs?: number | undefined;
    } | undefined;
    renderMode?: "raw" | "card" | "auto" | undefined;
    streaming?: {
      mode?: "off" | "partial" | undefined;
      chunkMode?: "length" | "newline" | undefined;
      block?: {
        enabled?: boolean | undefined;
        coalesce?: {
          minChars?: number | undefined;
          maxChars?: number | undefined;
          idleMs?: number | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    tools?: {
      doc?: boolean | undefined;
      chat?: boolean | undefined;
      wiki?: boolean | undefined;
      drive?: boolean | undefined;
      perm?: boolean | undefined;
      scopes?: boolean | undefined;
      bitable?: boolean | undefined;
    } | undefined;
    actions?: {
      reactions?: boolean | undefined;
      sticker?: boolean | undefined;
    } | undefined;
    replyInThread?: "disabled" | "enabled" | undefined;
    reactionNotifications?: "off" | "all" | "own" | undefined;
    typingIndicator?: boolean | undefined;
    resolveSenderNames?: boolean | undefined;
    allowBots?: boolean | undefined;
    vcAutoJoin?: boolean | undefined;
    tts?: {
      auto?: "off" | "inbound" | "always" | "tagged" | undefined;
      enabled?: boolean | undefined;
      mode?: "all" | "final" | undefined;
      provider?: string | undefined;
      persona?: string | undefined;
      personas?: Record<string, Record<string, unknown>> | undefined;
      summaryModel?: string | undefined;
      modelOverrides?: Record<string, unknown> | undefined;
      providers?: Record<string, Record<string, unknown>> | undefined;
      prefsPath?: string | undefined;
      maxTextLength?: number | undefined;
      timeoutMs?: number | undefined;
    } | undefined;
    enabled?: boolean | undefined;
    name?: string | undefined;
    appId?: string | undefined;
    appSecret?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    encryptKey?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    verificationToken?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    domain?: string | undefined;
    connectionMode?: "webhook" | "websocket" | undefined;
    webhookPath?: string | undefined;
  } | undefined>, z$1.core.$ZodTypeInternals<Record<string, {
    groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
    topicSessionMode?: "disabled" | "enabled" | undefined;
    webhookHost?: string | undefined;
    webhookPort?: number | undefined;
    capabilities?: string[] | undefined;
    markdown?: {
      mode?: "native" | "strip" | "escape" | undefined;
      tableMode?: "native" | "ascii" | "simple" | undefined;
    } | undefined;
    configWrites?: boolean | undefined;
    replyToMode?: "off" | "first" | "all" | "batched" | undefined;
    responsePrefix?: string | undefined;
    dmPolicy?: "disabled" | "pairing" | "allowlist" | "open" | undefined;
    allowFrom?: (string | number)[] | undefined;
    groupPolicy?: "disabled" | "allowlist" | "open" | undefined;
    groupAllowFrom?: (string | number)[] | undefined;
    groupSenderAllowFrom?: (string | number)[] | undefined;
    requireMention?: boolean | undefined;
    groups?: Record<string, {
      systemPrompt?: string | undefined;
      enabled?: boolean | undefined;
      allowFrom?: (string | number)[] | undefined;
      requireMention?: boolean | undefined;
      tools?: ({
        allow?: string[] | undefined;
        alsoAllow?: string[] | undefined;
        deny?: string[] | undefined;
      } & {
        allow?: string[] | undefined;
        deny?: string[] | undefined;
      }) | undefined;
      skills?: string[] | undefined;
      groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
      topicSessionMode?: "disabled" | "enabled" | undefined;
      replyInThread?: "disabled" | "enabled" | undefined;
    } | undefined> | undefined;
    historyLimit?: number | undefined;
    dmHistoryLimit?: number | undefined;
    dms?: Record<string, {
      enabled?: boolean | undefined;
      systemPrompt?: string | undefined;
    } | undefined> | undefined;
    textChunkLimit?: number | undefined;
    mediaMaxMb?: number | undefined;
    httpTimeoutMs?: number | undefined;
    heartbeatVisibility?: {
      visibility?: "visible" | "hidden" | undefined;
      intervalMs?: number | undefined;
    } | undefined;
    renderMode?: "raw" | "card" | "auto" | undefined;
    streaming?: {
      mode?: "off" | "partial" | undefined;
      chunkMode?: "length" | "newline" | undefined;
      block?: {
        enabled?: boolean | undefined;
        coalesce?: {
          minChars?: number | undefined;
          maxChars?: number | undefined;
          idleMs?: number | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    tools?: {
      doc?: boolean | undefined;
      chat?: boolean | undefined;
      wiki?: boolean | undefined;
      drive?: boolean | undefined;
      perm?: boolean | undefined;
      scopes?: boolean | undefined;
      bitable?: boolean | undefined;
    } | undefined;
    actions?: {
      reactions?: boolean | undefined;
      sticker?: boolean | undefined;
    } | undefined;
    replyInThread?: "disabled" | "enabled" | undefined;
    reactionNotifications?: "off" | "all" | "own" | undefined;
    typingIndicator?: boolean | undefined;
    resolveSenderNames?: boolean | undefined;
    allowBots?: boolean | undefined;
    vcAutoJoin?: boolean | undefined;
    tts?: {
      auto?: "off" | "inbound" | "always" | "tagged" | undefined;
      enabled?: boolean | undefined;
      mode?: "all" | "final" | undefined;
      provider?: string | undefined;
      persona?: string | undefined;
      personas?: Record<string, Record<string, unknown>> | undefined;
      summaryModel?: string | undefined;
      modelOverrides?: Record<string, unknown> | undefined;
      providers?: Record<string, Record<string, unknown>> | undefined;
      prefsPath?: string | undefined;
      maxTextLength?: number | undefined;
      timeoutMs?: number | undefined;
    } | undefined;
    enabled?: boolean | undefined;
    name?: string | undefined;
    appId?: string | undefined;
    appSecret?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    encryptKey?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    verificationToken?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    domain?: string | undefined;
    connectionMode?: "webhook" | "websocket" | undefined;
    webhookPath?: string | undefined;
  } | undefined>, Record<string, {
    groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
    topicSessionMode?: "disabled" | "enabled" | undefined;
    webhookHost?: string | undefined;
    webhookPort?: number | undefined;
    capabilities?: string[] | undefined;
    markdown?: {
      mode?: "native" | "strip" | "escape" | undefined;
      tableMode?: "native" | "ascii" | "simple" | undefined;
    } | undefined;
    configWrites?: boolean | undefined;
    replyToMode?: "off" | "first" | "all" | "batched" | undefined;
    responsePrefix?: string | undefined;
    dmPolicy?: "disabled" | "pairing" | "allowlist" | "open" | undefined;
    allowFrom?: (string | number)[] | undefined;
    groupPolicy?: "disabled" | "allowlist" | "open" | "allowall" | undefined;
    groupAllowFrom?: (string | number)[] | undefined;
    groupSenderAllowFrom?: (string | number)[] | undefined;
    requireMention?: boolean | undefined;
    groups?: Record<string, {
      systemPrompt?: string | undefined;
      enabled?: boolean | undefined;
      allowFrom?: (string | number)[] | undefined;
      requireMention?: boolean | undefined;
      tools?: ({
        allow?: string[] | undefined;
        alsoAllow?: string[] | undefined;
        deny?: string[] | undefined;
      } & {
        allow?: string[] | undefined;
        deny?: string[] | undefined;
      }) | undefined;
      skills?: string[] | undefined;
      groupSessionScope?: "group" | "group_sender" | "group_topic" | "group_topic_sender" | undefined;
      topicSessionMode?: "disabled" | "enabled" | undefined;
      replyInThread?: "disabled" | "enabled" | undefined;
    } | undefined> | undefined;
    historyLimit?: number | undefined;
    dmHistoryLimit?: number | undefined;
    dms?: Record<string, {
      enabled?: boolean | undefined;
      systemPrompt?: string | undefined;
    } | undefined> | undefined;
    textChunkLimit?: number | undefined;
    mediaMaxMb?: number | undefined;
    httpTimeoutMs?: number | undefined;
    heartbeatVisibility?: {
      visibility?: "visible" | "hidden" | undefined;
      intervalMs?: number | undefined;
    } | undefined;
    renderMode?: "raw" | "card" | "auto" | undefined;
    streaming?: {
      mode?: "off" | "partial" | undefined;
      chunkMode?: "length" | "newline" | undefined;
      block?: {
        enabled?: boolean | undefined;
        coalesce?: {
          minChars?: number | undefined;
          maxChars?: number | undefined;
          idleMs?: number | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    tools?: {
      doc?: boolean | undefined;
      chat?: boolean | undefined;
      wiki?: boolean | undefined;
      drive?: boolean | undefined;
      perm?: boolean | undefined;
      scopes?: boolean | undefined;
      bitable?: boolean | undefined;
    } | undefined;
    actions?: {
      reactions?: boolean | undefined;
      sticker?: boolean | undefined;
    } | undefined;
    replyInThread?: "disabled" | "enabled" | undefined;
    reactionNotifications?: "off" | "all" | "own" | undefined;
    typingIndicator?: boolean | undefined;
    resolveSenderNames?: boolean | undefined;
    allowBots?: boolean | undefined;
    vcAutoJoin?: boolean | undefined;
    tts?: {
      auto?: "off" | "inbound" | "always" | "tagged" | undefined;
      enabled?: boolean | undefined;
      mode?: "all" | "final" | undefined;
      provider?: string | undefined;
      persona?: string | undefined;
      personas?: Record<string, Record<string, unknown>> | undefined;
      summaryModel?: string | undefined;
      modelOverrides?: Record<string, unknown> | undefined;
      providers?: Record<string, Record<string, unknown>> | undefined;
      prefsPath?: string | undefined;
      maxTextLength?: number | undefined;
      timeoutMs?: number | undefined;
    } | undefined;
    enabled?: boolean | undefined;
    name?: string | undefined;
    appId?: string | undefined;
    appSecret?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    encryptKey?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    verificationToken?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | undefined;
    domain?: string | undefined;
    connectionMode?: "webhook" | "websocket" | undefined;
    webhookPath?: string | undefined;
  } | undefined>>>>;
  defaultAccount: z$1.ZodOptional<z$1.ZodString>;
}, z$1.core.$strip>;
//#endregion
//#region extensions/feishu/src/types.d.ts
type FeishuConfig = z$1.infer<typeof FeishuConfigSchema>;
type FeishuDomain = "feishu" | "lark" | (string & {});
type FeishuDefaultAccountSelectionSource = "explicit-default" | "mapped-default" | "fallback";
type FeishuAccountSelectionSource = "explicit" | FeishuDefaultAccountSelectionSource;
type ResolvedFeishuAccount = {
  accountId: string;
  selectionSource: FeishuAccountSelectionSource;
  enabled: boolean;
  configured: boolean;
  name?: string;
  appId?: string;
  appSecret?: string;
  encryptKey?: string;
  verificationToken?: string;
  domain: FeishuDomain;
  /** Merged config (top-level defaults + account-specific overrides) */
  config: FeishuConfig;
};
interface FeishuProbeResult extends BaseProbeResult {
  appId?: string;
  botName?: string;
  botOpenId?: string;
}
//#endregion
//#region extensions/feishu/src/channel.d.ts
declare const feishuPlugin: ChannelPlugin<ResolvedFeishuAccount, FeishuProbeResult>;
//#endregion
export { feishuPlugin as t };