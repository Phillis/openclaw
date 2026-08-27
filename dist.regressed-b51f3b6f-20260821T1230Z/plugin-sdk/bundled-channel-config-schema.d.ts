import { C as IMessageReactionNotificationMode, E as CommonChannelMessagingConfig, L as ProviderCommandsConfig, S as IMessageActionConfig, T as ChannelReadReceiptConfig, _ as TelegramNetworkConfig, d as TelegramActionConfig, f as TelegramCapabilitiesConfig, g as TelegramGroupConfig, h as TelegramExecApprovalConfig, l as AutoTopicLabelConfig, m as TelegramDirectConfig, ot as GroupToolPolicyBySenderConfig, p as TelegramCustomCommand, st as GroupToolPolicyConfig, u as TelegramAccountConfig, v as TelegramPreviewStreamingConfig, w as IMessageSendTransport, x as IMessageAccountConfig, y as TelegramThreadBindingsConfig } from "../types.openclaw-6A5yUI1l.js";
import { n as ChannelConfigSchema, r as ChannelConfigUiHint } from "../types.config-C8M7Vrm6.js";
import { a as GroupPolicySchema, f as requireAllowlistAllowFrom, i as DmPolicySchema, n as ContextVisibilityModeSchema, o as MarkdownConfigSchema, p as requireOpenAllowFrom, r as DmConfigSchema, s as ReplyRuntimeConfigSchemaShape, t as BlockStreamingCoalesceSchema } from "../zod-schema.core-BwpU3Me1.js";
import { ZodObject, ZodOptional, ZodRawShape, ZodType, ZodTypeAny, z } from "zod";

//#region src/channels/plugins/config-schema.d.ts
type ExtendableZodObject = ZodTypeAny & {
  extend: (shape: Record<string, ZodTypeAny>) => ZodTypeAny;
};
/** Optional allowlist array used by channel config schema builders. */
declare const AllowFromListSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
/** Canonical per-group/room channel policy shape. */
declare const ChannelGroupEntrySchema: z.ZodObject<{
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
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  systemPrompt: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type ChannelGroupEntryField = keyof typeof ChannelGroupEntrySchema.shape;
/** Extend the canonical group/room policy shape with channel-owned fields. */
declare function buildGroupEntrySchema<T extends ZodRawShape = Record<never, never>, const TOmit extends readonly ChannelGroupEntryField[] = []>(extraShape?: T, options?: {
  omit?: TOmit;
}): z.ZodObject<Omit<{
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
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  systemPrompt: z.ZodOptional<z.ZodString>;
}, TOmit[number]> & T extends infer T_1 ? { -readonly [P in keyof T_1]: T_1[P] } : never, z.core.$strict>;
/** Build the common nested DM config block used by channel account schemas. */
declare function buildNestedDmConfigSchema(extraShape?: ZodRawShape): z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  policy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
}, z.core.$strip>>;
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(accountSchema: T): T;
type MultiAccountSchemaBaseOptions<TAccount extends ZodTypeAny, TOptional extends boolean> = {
  accountSchema?: TAccount;
  accountsMode?: "record" | "catchall";
  optionalAccount?: TOptional;
};
type MultiAccountRefinement<T extends z.ZodObject> = (value: z.output<T>, ctx: z.RefinementCtx) => void | Promise<void>;
type MultiAccountSchemaOptions<T extends z.ZodObject, TAccount extends ZodTypeAny, TOptional extends boolean> = (MultiAccountSchemaBaseOptions<TAccount, TOptional> & {
  refine?: undefined;
}) | (MultiAccountSchemaBaseOptions<T, TOptional> & {
  refine: MultiAccountRefinement<T>;
});
type OptionalAccountValue<T, TOptional extends boolean> = TOptional extends true ? T | undefined : T;
type MultiAccountEnvelopeShape<TAccount extends ZodTypeAny, TOptional extends boolean> = {
  accounts: z.ZodOptional<z.ZodType<Record<string, OptionalAccountValue<z.output<TAccount>, TOptional>>, Record<string, OptionalAccountValue<z.input<TAccount>, TOptional>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
};
type MultiAccountChannelSchema<T extends z.ZodObject, TAccount extends ZodTypeAny, TOptional extends boolean> = z.ZodObject<z.util.Extend<T["shape"], MultiAccountEnvelopeShape<TAccount, TOptional>>>;
/** Add the standard accounts/defaultAccount envelope and optional shared account/root refinement. */
declare function buildMultiAccountChannelSchema<T extends z.ZodObject, TAccount extends ZodTypeAny = T, TOptional extends boolean = false>(baseSchema: T, options?: MultiAccountSchemaOptions<T, TAccount, TOptional>): MultiAccountChannelSchema<T, TAccount, TOptional>;
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<string, ChannelConfigUiHint>; /** Select input mode when transforms must expose accepted config values to editors. */
  jsonSchemaMode?: "input" | "output";
};
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(schema: ZodTypeAny, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
//#endregion
//#region src/config/zod-schema.agent-runtime.d.ts
declare const ToolPolicySchema: z.ZodOptional<z.ZodObject<{
  allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/zod-schema.providers-googlechat.d.ts
declare const GoogleChatConfigSchema: z.ZodObject<{
  allowBots: z.ZodOptional<z.ZodBoolean> | z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"mentions">]>>;
  botLoopProtection: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
    windowSeconds: z.ZodOptional<z.ZodNumber>;
    cooldownSeconds: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
  requireMention: z.ZodOptional<z.ZodBoolean>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    botLoopProtection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
      windowSeconds: z.ZodOptional<z.ZodNumber>;
      cooldownSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    users: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  serviceAccount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
    source: z.ZodLiteral<"env">;
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
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"store">;
    provider: z.ZodString;
    id: z.ZodString;
  }, z.core.$strict>], "source">]>>;
  serviceAccountFile: z.ZodOptional<z.ZodString>;
  audienceType: z.ZodOptional<z.ZodEnum<{
    "app-url": "app-url";
    "project-number": "project-number";
  }>>;
  audience: z.ZodOptional<z.ZodString>;
  appPrincipal: z.ZodOptional<z.ZodString>;
  webhookPath: z.ZodOptional<z.ZodString>;
  webhookUrl: z.ZodOptional<z.ZodString>;
  botUser: z.ZodOptional<z.ZodString>;
  dm: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  typingIndicator: z.ZodOptional<z.ZodEnum<{
    none: "none";
    message: "message";
    reaction: "reaction";
  }>>;
  name: z.ZodOptional<z.ZodString>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      off: "off";
      code: "code";
      bullets: "bullets";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  streaming: z.ZodOptional<z.ZodObject<{
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    allowBots: z.ZodOptional<z.ZodBoolean> | z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"mentions">]>>;
    botLoopProtection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
      windowSeconds: z.ZodOptional<z.ZodNumber>;
      cooldownSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      botLoopProtection: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
        windowSeconds: z.ZodOptional<z.ZodNumber>;
        cooldownSeconds: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      users: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    serviceAccount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
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
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    serviceAccountFile: z.ZodOptional<z.ZodString>;
    audienceType: z.ZodOptional<z.ZodEnum<{
      "app-url": "app-url";
      "project-number": "project-number";
    }>>;
    audience: z.ZodOptional<z.ZodString>;
    appPrincipal: z.ZodOptional<z.ZodString>;
    webhookPath: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    botUser: z.ZodOptional<z.ZodString>;
    dm: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    typingIndicator: z.ZodOptional<z.ZodEnum<{
      none: "none";
      message: "message";
      reaction: "reaction";
    }>>;
    name: z.ZodOptional<z.ZodString>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        off: "off";
        code: "code";
        bullets: "bullets";
      }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    defaultTo: z.ZodOptional<z.ZodString>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
    }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
    }>>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    streaming: z.ZodOptional<z.ZodObject<{
      chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      block: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        coalesce: z.ZodOptional<z.ZodObject<{
          minChars: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          idleMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.providers-whatsapp.d.ts
declare const WhatsAppConfigSchema: z.ZodObject<{
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    authDir: z.ZodOptional<z.ZodString>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    pluginHooks: z.ZodOptional<z.ZodObject<{
      messageReceived: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    ackReaction?: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>> | undefined;
    reactionLevel?: z.ZodOptional<z.ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    reactionAllowlist?: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>> | undefined;
    reactionNotifications?: z.ZodOptional<z.ZodEnum<{
      [x: string]: string;
    }>> | undefined;
    sendReadReceipts: z.ZodOptional<z.ZodBoolean>;
    selfChatMode: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    mentionPatterns: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
      denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        off: "off";
        code: "code";
        bullets: "bullets";
      }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
      pairing: "pairing";
    }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
      pairing: "pairing";
    }>>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultTo: z.ZodOptional<z.ZodString>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
    }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      disabled: "disabled";
      open: "open";
      allowlist: "allowlist";
    }>>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    streaming: z.ZodOptional<z.ZodObject<{
      chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      block: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        coalesce: z.ZodOptional<z.ZodObject<{
          minChars: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          idleMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
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
  mediaMaxMb: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  actions: z.ZodOptional<z.ZodObject<{
    reactions: z.ZodOptional<z.ZodBoolean>;
    sendMessage: z.ZodOptional<z.ZodBoolean>;
    polls: z.ZodOptional<z.ZodBoolean>;
    calls: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  pluginHooks: z.ZodOptional<z.ZodObject<{
    messageReceived: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  ackReaction?: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: z.ZodOptional<z.ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>> | undefined;
  reactionNotifications?: z.ZodOptional<z.ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  sendReadReceipts: z.ZodOptional<z.ZodBoolean>;
  selfChatMode: z.ZodOptional<z.ZodBoolean>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  mentionPatterns: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      off: "off";
      code: "code";
      bullets: "bullets";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  dmPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
    pairing: "pairing";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
    pairing: "pairing";
  }>>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  streaming: z.ZodOptional<z.ZodObject<{
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//#endregion
//#region src/plugin-sdk/bundled-channel-config-schema.d.ts
/**
 * @deprecated Compatibility for external channel packages published through 2026.7.1.
 * Their package manifests remain the validation owner. Remove after the minimum supported
 * Slack, Discord, Signal, and Teams packages use plugin-owned config schemas.
 */
declare const SlackConfigSchema: z.ZodObject<{}, z.core.$loose>;
/** @deprecated See SlackConfigSchema. */
declare const DiscordConfigSchema: z.ZodObject<{}, z.core.$loose>;
/** @deprecated See SlackConfigSchema. */
declare const SignalConfigSchema: z.ZodObject<{}, z.core.$loose>;
/** @deprecated See SlackConfigSchema. */
declare const MSTeamsConfigSchema: z.ZodObject<{}, z.core.$loose>;
type ConfigSchemaShape<TOutput extends object> = { -readonly [K in keyof TOutput]-?: Pick<TOutput, K> extends Required<Pick<TOutput, K>> ? ZodType<TOutput[K]> : ZodOptional<ZodType<Exclude<TOutput[K], undefined>>> };
type BundledObjectConfigSchema<TOutput extends object> = ZodObject<ConfigSchemaShape<TOutput>>;
declare const IMessageConfigSchema: BundledObjectConfigSchema<{
  accounts?: Record<string, IMessageAccountConfig>;
  defaultAccount?: string;
} & Omit<CommonChannelMessagingConfig, "mentionPatterns" | "replyToMode"> & ChannelReadReceiptConfig & {
  reactionNotifications?: IMessageReactionNotificationMode | undefined;
  reactionLevel?: undefined;
  ackReaction?: undefined;
} & Record<never, never> & {
  cliPath?: string;
  dbPath?: string;
  remoteHost?: string;
  actions?: IMessageActionConfig;
  service?: "imessage" | "sms" | "auto";
  sendTransport?: IMessageSendTransport;
  region?: string;
  includeAttachments?: boolean;
  attachmentRoots?: string[];
  remoteAttachmentRoots?: string[];
  probeTimeoutMs?: number;
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    systemPrompt?: string;
  }>;
  catchup?: {
    enabled?: boolean;
    maxAgeMinutes?: number;
    perRunLimit?: number;
    firstRunLookbackMinutes?: number;
    maxFailureRetries?: number;
  };
}>;
declare const TelegramConfigSchema: BundledObjectConfigSchema<{
  accounts?: Record<string, TelegramAccountConfig>;
  defaultAccount?: string;
} & CommonChannelMessagingConfig<TelegramCapabilitiesConfig, string | number, string | number, TelegramPreviewStreamingConfig> & {
  reactionNotifications?: "off" | "own" | "all" | undefined;
  reactionLevel?: "off" | "ack" | "minimal" | "extensive" | undefined;
  ackReaction?: string | undefined;
} & Record<never, never> & {
  execApprovals?: TelegramExecApprovalConfig;
  commands?: ProviderCommandsConfig;
  customCommands?: TelegramCustomCommand[];
  botToken?: string;
  tokenFile?: string;
  groups?: Record<string, TelegramGroupConfig>;
  direct?: Record<string, TelegramDirectConfig>;
  richMessages?: boolean;
  network?: TelegramNetworkConfig;
  proxy?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  webhookPath?: string;
  webhookHost?: string;
  webhookPort?: number;
  webhookCertPath?: string;
  actions?: TelegramActionConfig;
  threadBindings?: TelegramThreadBindingsConfig;
  linkPreview?: boolean;
  silentErrorReplies?: boolean;
  errorPolicy?: "always" | "once" | "silent";
  apiRoot?: string;
  trustedLocalFileRoots?: string[];
  autoTopicLabel?: AutoTopicLabelConfig;
}>;
//#endregion
export { AllowFromListSchema, BlockStreamingCoalesceSchema, ChannelGroupEntrySchema, ContextVisibilityModeSchema, DiscordConfigSchema, DmConfigSchema, DmPolicySchema, GoogleChatConfigSchema, GroupPolicySchema, IMessageConfigSchema, MSTeamsConfigSchema, MarkdownConfigSchema, ReplyRuntimeConfigSchemaShape, SignalConfigSchema, SlackConfigSchema, TelegramConfigSchema, ToolPolicySchema, WhatsAppConfigSchema, buildCatchallMultiAccountChannelSchema, buildChannelConfigSchema, buildGroupEntrySchema, buildMultiAccountChannelSchema, buildNestedDmConfigSchema, requireAllowlistAllowFrom, requireOpenAllowFrom };