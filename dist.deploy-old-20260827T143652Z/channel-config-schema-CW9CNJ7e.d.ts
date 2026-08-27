import { ZodRawShape, ZodTypeAny, z } from "zod";

//#region src/config/zod-schema.core.d.ts
declare const MentionPatternsPolicySchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
  allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
declare const DmConfigSchema: z.ZodObject<{
  historyLimit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const ReplyToModeSchema: z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>;
declare const GroupPolicySchema: z.ZodEnum<{
  disabled: "disabled";
  open: "open";
  allowlist: "allowlist";
}>;
declare const DmPolicySchema: z.ZodEnum<{
  disabled: "disabled";
  pairing: "pairing";
  open: "open";
  allowlist: "allowlist";
}>;
declare const ContextVisibilityModeSchema: z.ZodEnum<{
  all: "all";
  allowlist: "allowlist";
  allowlist_quote: "allowlist_quote";
}>;
declare const BlockStreamingCoalesceSchema: z.ZodObject<{
  minChars: z.ZodOptional<z.ZodNumber>;
  maxChars: z.ZodOptional<z.ZodNumber>;
  idleMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const TextChunkModeSchema: z.ZodEnum<{
  length: "length";
  newline: "newline";
}>;
declare const ChannelStreamingBlockSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  coalesce: z.ZodOptional<z.ZodObject<{
    minChars: z.ZodOptional<z.ZodNumber>;
    maxChars: z.ZodOptional<z.ZodNumber>;
    idleMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>;
/** Delivery-only nested streaming config for channels without preview modes. */
declare const ChannelDeliveryStreamingConfigSchema: z.ZodObject<{
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
}, z.core.$strict>;
declare const ReplyRuntimeConfigSchemaShape: {
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
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
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
};
declare const BlockStreamingChunkSchema: z.ZodObject<{
  minChars: z.ZodOptional<z.ZodNumber>;
  maxChars: z.ZodOptional<z.ZodNumber>;
  breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
}, z.core.$strict>;
declare const MarkdownConfigSchema: z.ZodOptional<z.ZodObject<{
  tables: z.ZodOptional<z.ZodEnum<{
    code: "code";
    block: "block";
    off: "off";
    bullets: "bullets";
  }>>;
}, z.core.$strict>>;
declare const TtsConfigSchema: z.ZodOptional<z.ZodObject<{
  auto: z.ZodOptional<z.ZodEnum<{
    off: "off";
    always: "always";
    inbound: "inbound";
    tagged: "tagged";
  }>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  mode: z.ZodOptional<z.ZodEnum<{
    all: "all";
    final: "final";
  }>>;
  provider: z.ZodOptional<z.ZodString>;
  persona: z.ZodOptional<z.ZodString>;
  personas: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    fallbackPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"preserve-persona">, z.ZodLiteral<"provider-defaults">, z.ZodLiteral<"fail">]>>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
  }, z.core.$strict>>>;
  summaryModel: z.ZodOptional<z.ZodString>;
  modelOverrides: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowText: z.ZodOptional<z.ZodBoolean>;
    allowProvider: z.ZodOptional<z.ZodBoolean>;
    allowVoice: z.ZodOptional<z.ZodBoolean>;
    allowModelId: z.ZodOptional<z.ZodBoolean>;
    allowVoiceSettings: z.ZodOptional<z.ZodBoolean>;
    allowNormalization: z.ZodOptional<z.ZodBoolean>;
    allowSeed: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
  maxTextLength: z.ZodOptional<z.ZodNumber>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>>;
declare const requireOpenAllowFrom: (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: z.RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
/**
 * Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
 * Without this, all DMs are silently dropped because the allowlist is empty
 * and no senders can match.
 */
declare const requireAllowlistAllowFrom: (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: z.RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
declare const MSTeamsReplyStyleSchema: z.ZodEnum<{
  thread: "thread";
  "top-level": "top-level";
}>;
declare const ExecutableTokenSchema: z.ZodString;
declare const ProviderCommandsSchema: z.ZodOptional<z.ZodObject<{
  native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/zod-schema.channels-config.d.ts
declare const ChannelBotLoopProtectionSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
  windowSeconds: z.ZodOptional<z.ZodNumber>;
  cooldownSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.channel-messaging-common.d.ts
declare const UnifiedStreamingModeSchema: z.ZodEnum<{
  block: "block";
  off: "off";
  progress: "progress";
  partial: "partial";
}>;
declare const ChannelStreamingPreviewSchema: z.ZodObject<{
  chunk: z.ZodOptional<z.ZodObject<{
    minChars: z.ZodOptional<z.ZodNumber>;
    maxChars: z.ZodOptional<z.ZodNumber>;
    breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
  }, z.core.$strict>>;
  toolProgress: z.ZodOptional<z.ZodBoolean>;
  commandText: z.ZodOptional<z.ZodEnum<{
    status: "status";
    raw: "raw";
  }>>;
}, z.core.$strict>;
declare const ChannelStreamingProgressSchema: z.ZodObject<{
  label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
  labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
  maxLines: z.ZodOptional<z.ZodNumber>;
  maxLineChars: z.ZodOptional<z.ZodNumber>;
  toolProgress: z.ZodOptional<z.ZodBoolean>;
  commandText: z.ZodOptional<z.ZodEnum<{
    status: "status";
    raw: "raw";
  }>>;
  commentary: z.ZodOptional<z.ZodBoolean>;
  narration: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
declare const ChannelPreviewStreamingConfigSchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodEnum<{
    block: "block";
    off: "off";
    progress: "progress";
    partial: "partial";
  }>>;
  chunkMode: z.ZodOptional<z.ZodEnum<{
    length: "length";
    newline: "newline";
  }>>;
  preview: z.ZodOptional<z.ZodObject<{
    chunk: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
    }, z.core.$strict>>;
    toolProgress: z.ZodOptional<z.ZodBoolean>;
    commandText: z.ZodOptional<z.ZodEnum<{
      status: "status";
      raw: "raw";
    }>>;
  }, z.core.$strict>>;
  progress: z.ZodOptional<z.ZodObject<{
    label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxLines: z.ZodOptional<z.ZodNumber>;
    maxLineChars: z.ZodOptional<z.ZodNumber>;
    toolProgress: z.ZodOptional<z.ZodBoolean>;
    commandText: z.ZodOptional<z.ZodEnum<{
      status: "status";
      raw: "raw";
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
}, z.core.$strict>;
declare const CommonCapabilitiesSchema: z.ZodOptional<z.ZodArray<z.ZodString>>;
declare const CommonIdListSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
declare const CommonDefaultToSchema: z.ZodOptional<z.ZodString>;
declare const CommonMentionPatternsSchema: z.ZodOptional<z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
  allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>>;
declare const CommonStreamingSchema: z.ZodOptional<z.ZodObject<{
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
declare const CommonMediaMaxMbSchema: z.ZodOptional<z.ZodNumber>;
declare const CommonReplyToModeSchema: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
type CommonChannelAccountShapeOptions<TCapabilities extends ZodTypeAny = typeof CommonCapabilitiesSchema, TAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TDefaultTo extends z.ZodType<string | number | undefined> = typeof CommonDefaultToSchema, TGroupAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TMentionPatterns extends ZodTypeAny = typeof CommonMentionPatternsSchema, TStreaming extends ZodTypeAny = typeof CommonStreamingSchema, TMediaMaxMb extends ZodTypeAny = typeof CommonMediaMaxMbSchema, TReplyToMode extends ZodTypeAny = typeof CommonReplyToModeSchema> = {
  useDefaults?: boolean;
  dmPolicyDefault?: boolean;
  groupPolicyDefault?: boolean;
  omit?: readonly CommonChannelAccountField[];
  capabilities?: TCapabilities;
  allowFrom?: TAllowFrom;
  defaultTo?: TDefaultTo;
  groupAllowFrom?: TGroupAllowFrom;
  mentionPatterns?: TMentionPatterns;
  streaming?: TStreaming;
  mediaMaxMb?: TMediaMaxMb;
  replyToMode?: TReplyToMode;
};
declare function createCommonChannelAccountShape<TCapabilities extends ZodTypeAny = typeof CommonCapabilitiesSchema, TAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TDefaultTo extends z.ZodType<string | number | undefined> = typeof CommonDefaultToSchema, TGroupAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TMentionPatterns extends ZodTypeAny = typeof CommonMentionPatternsSchema, TStreaming extends ZodTypeAny = typeof CommonStreamingSchema, TMediaMaxMb extends ZodTypeAny = typeof CommonMediaMaxMbSchema, TReplyToMode extends ZodTypeAny = typeof CommonReplyToModeSchema>(options: CommonChannelAccountShapeOptions<TCapabilities, TAllowFrom, TDefaultTo, TGroupAllowFrom, TMentionPatterns, TStreaming, TMediaMaxMb, TReplyToMode>): {
  name: z.ZodOptional<z.ZodString>;
  capabilities: TCapabilities;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      code: "code";
      block: "block";
      off: "off";
      bullets: "bullets";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  dmPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    pairing: "pairing";
    open: "open";
    allowlist: "allowlist";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    pairing: "pairing";
    open: "open";
    allowlist: "allowlist";
  }>>>;
  allowFrom: TAllowFrom;
  defaultTo: TDefaultTo;
  groupAllowFrom: TGroupAllowFrom;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>>>;
  mentionPatterns: TMentionPatterns;
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
  streaming: TStreaming;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: TMediaMaxMb;
  replyToMode: TReplyToMode;
};
type CommonChannelAccountShape = ReturnType<typeof createCommonChannelAccountShape>;
type CommonChannelAccountField = keyof CommonChannelAccountShape;
/** Build shared channel account leaves while preserving channel-specific omissions and schemas. */
declare function buildCommonChannelAccountShape<TCapabilities extends ZodTypeAny = typeof CommonCapabilitiesSchema, TAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TDefaultTo extends z.ZodType<string | number | undefined> = typeof CommonDefaultToSchema, TGroupAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TMentionPatterns extends ZodTypeAny = typeof CommonMentionPatternsSchema, TStreaming extends ZodTypeAny = typeof CommonStreamingSchema, TMediaMaxMb extends ZodTypeAny = typeof CommonMediaMaxMbSchema, TReplyToMode extends ZodTypeAny = typeof CommonReplyToModeSchema, const TOmit extends readonly CommonChannelAccountField[] = []>(options?: Omit<CommonChannelAccountShapeOptions<TCapabilities, TAllowFrom, TDefaultTo, TGroupAllowFrom, TMentionPatterns, TStreaming, TMediaMaxMb, TReplyToMode>, "omit"> & {
  omit?: TOmit;
}): Omit<{
  name: z.ZodOptional<z.ZodString>;
  capabilities: TCapabilities;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      code: "code";
      block: "block";
      off: "off";
      bullets: "bullets";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  dmPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    pairing: "pairing";
    open: "open";
    allowlist: "allowlist";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    pairing: "pairing";
    open: "open";
    allowlist: "allowlist";
  }>>>;
  allowFrom: TAllowFrom;
  defaultTo: TDefaultTo;
  groupAllowFrom: TGroupAllowFrom;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>> | z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    disabled: "disabled";
    open: "open";
    allowlist: "allowlist";
  }>>>;
  mentionPatterns: TMentionPatterns;
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
  streaming: TStreaming;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: TMediaMaxMb;
  replyToMode: TReplyToMode;
}, TOmit[number]>;
declare const ChannelDangerouslyAllowNameMatchingSchema: z.ZodOptional<z.ZodBoolean>;
declare const ChannelSendReadReceiptsSchema: z.ZodOptional<z.ZodBoolean>;
/** Build the shared allowBots leaf without widening boolean-only channels. */
declare function buildChannelAllowBotsSchema(options?: {
  allowMentions?: boolean;
}): z.ZodOptional<z.ZodBoolean> | z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"mentions">]>>;
/** Build native exec-approval routing with channel-specific approver ids and extras. */
declare function buildChannelExecApprovalsSchema<T extends ZodRawShape = Record<never, never>>(approverSchema: ZodTypeAny, extraShape?: T): z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  approvers: z.ZodOptional<z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
  agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
  sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
  target: z.ZodOptional<z.ZodEnum<{
    dm: "dm";
    channel: "channel";
    both: "both";
  }>>;
} & T extends infer T_1 ? { -readonly [P in keyof T_1]: T_1[P] } : never, z.core.$strict>>;
type ChannelReactionShapeOptions = {
  notificationModes?: readonly [string, string, ...string[]];
  reactionLevels?: readonly [string, string, ...string[]];
  reactionAllowlist?: boolean;
  ackReaction?: ZodTypeAny;
};
/** Build the repeated reaction leaves while retaining each channel's exact enum. */
declare function buildChannelReactionShape(options: ChannelReactionShapeOptions): {
  ackReaction?: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>> | undefined;
  reactionLevel?: z.ZodOptional<z.ZodEnum<{
    [x: string]: string;
  }>> | undefined;
  reactionAllowlist?: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>> | undefined;
  reactionNotifications?: z.ZodOptional<z.ZodEnum<{
    [x: string]: string;
  }>> | undefined;
};
//#endregion
//#region src/config/zod-schema.implicit-mentions.d.ts
declare const ChannelImplicitMentionsSchema: z.ZodObject<{
  replyToBot: z.ZodOptional<z.ZodBoolean>;
  quotedBot: z.ZodOptional<z.ZodBoolean>;
  threadParticipation: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.agent-runtime.d.ts
declare const ToolPolicySchema: z.ZodOptional<z.ZodObject<{
  allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>>;
//#endregion
export { TtsConfigSchema as A, MSTeamsReplyStyleSchema as C, ReplyRuntimeConfigSchemaShape as D, ProviderCommandsSchema as E, requireOpenAllowFrom as M, ReplyToModeSchema as O, GroupPolicySchema as S, MentionPatternsPolicySchema as T, ChannelStreamingBlockSchema as _, ChannelSendReadReceiptsSchema as a, DmPolicySchema as b, UnifiedStreamingModeSchema as c, buildChannelReactionShape as d, buildCommonChannelAccountShape as f, ChannelDeliveryStreamingConfigSchema as g, BlockStreamingCoalesceSchema as h, ChannelPreviewStreamingConfigSchema as i, requireAllowlistAllowFrom as j, TextChunkModeSchema as k, buildChannelAllowBotsSchema as l, BlockStreamingChunkSchema as m, ChannelImplicitMentionsSchema as n, ChannelStreamingPreviewSchema as o, ChannelBotLoopProtectionSchema as p, ChannelDangerouslyAllowNameMatchingSchema as r, ChannelStreamingProgressSchema as s, ToolPolicySchema as t, buildChannelExecApprovalsSchema as u, ContextVisibilityModeSchema as v, MarkdownConfigSchema as w, ExecutableTokenSchema as x, DmConfigSchema as y };