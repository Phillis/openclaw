import { ft as AskUserQuestionOptionIndices, h as AcpSessionStoreEntry } from "./runtime-api-B8urSeFb.js";
import { n as OpenClawConfig } from "./types.openclaw-R2xZRh0U.js";
import "./types-BRhHKLsn.js";
import "./config-contracts-CGgezQeX.js";
import "./types-PnKhFk44.js";
import { Mt as LegacyInteractiveReply } from "./channel-contract-C7AAps4m.js";
import "./plugin-state-store.types-Cvq44_Mh.js";
import { A as Modal, I as MessagePayloadObject, L as TopLevelComponents, N as ComponentParserResult, Q as APIEmbed, R as Embed, Z as APIAllowedMentions, j as TextDisplay, k as Label } from "./runtime.messaging.shared-CkKyhXMl.js";
import "./channel-outbound-Y2zUxgcH.js";
import "./accounts-BA9QOPWH.js";
import "./conversation-binding-Bp3O7Xyp.js";
import "./runtime-env-CSgh0t1v.js";
import "./media-runtime-DOU9CuQT.js";
//#region extensions/discord/src/monitor/thread-bindings.types.d.ts
type ThreadBindingTargetKind = "subagent" | "acp";
type ThreadBindingRecord = {
  accountId: string;
  channelId: string;
  threadId: string;
  targetKind: ThreadBindingTargetKind;
  targetSessionKey: string;
  agentId: string;
  label?: string;
  webhookId?: string;
  webhookToken?: string;
  boundBy: string;
  boundAt: number;
  lastActivityAt: number;
  /** Inactivity timeout window in milliseconds (0 disables inactivity auto-unfocus). */
  idleTimeoutMs?: number;
  /** Hard max-age window in milliseconds from bind time (0 disables hard cap). */
  maxAgeMs?: number;
  metadata?: Record<string, unknown>;
};
type ThreadBindingManager = {
  accountId: string;
  getIdleTimeoutMs: () => number;
  getMaxAgeMs: () => number;
  getByThreadId: (threadId: string) => ThreadBindingRecord | undefined;
  getBySessionKey: (targetSessionKey: string) => ThreadBindingRecord | undefined;
  listBySessionKey: (targetSessionKey: string) => ThreadBindingRecord[];
  listBindings: () => ThreadBindingRecord[];
  touchThread: (params: {
    threadId: string;
    at?: number;
    persist?: boolean;
  }) => ThreadBindingRecord | null;
  bindTarget: (params: {
    threadId?: string | number;
    channelId?: string;
    createThread?: boolean;
    threadName?: string;
    targetKind: ThreadBindingTargetKind;
    targetSessionKey: string;
    agentId?: string;
    label?: string;
    boundBy?: string;
    introText?: string;
    webhookId?: string;
    webhookToken?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<ThreadBindingRecord | null>;
  unbindThread: (params: {
    threadId: string;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord | null;
  unbindBySessionKey: (params: {
    targetSessionKey: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord[];
  stop: () => void;
};
//#endregion
//#region src/channels/thread-bindings-policy.d.ts
/** Resolves the effective enabled flag for thread bindings. */
declare function resolveThreadBindingsEnabled(params: {
  channelEnabledRaw: unknown;
  sessionEnabledRaw: unknown;
}): boolean;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.config.d.ts
declare function resolveDiscordThreadBindingIdleTimeoutMs(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): number;
declare function resolveDiscordThreadBindingMaxAgeMs(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): number;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.lifecycle.d.ts
type AcpThreadBindingReconciliationResult = {
  checked: number;
  removed: number;
  staleSessionKeys: string[];
};
type AcpThreadBindingHealthStatus = "healthy" | "stale" | "uncertain";
type AcpThreadBindingHealthProbe = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  sessionKey: string;
  binding: ThreadBindingRecord;
  session: AcpSessionStoreEntry;
}) => Promise<{
  status: AcpThreadBindingHealthStatus;
  reason?: string;
}>;
declare function listThreadBindingsForAccount(accountId?: string): ThreadBindingRecord[];
declare function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[];
declare function autoBindSpawnedDiscordSubagent(params: {
  cfg: OpenClawConfig;
  accountId?: string;
  channel?: string;
  to?: string;
  threadId?: string | number;
  childSessionKey: string;
  agentId: string;
  label?: string;
  boundBy?: string;
}): Promise<ThreadBindingRecord | null>;
declare function unbindThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
  farewellText?: string;
}): ThreadBindingRecord[];
declare function reconcileAcpThreadBindingsOnStartup(params: {
  cfg: OpenClawConfig;
  accountId?: string;
  sendFarewell?: boolean;
  healthProbe?: AcpThreadBindingHealthProbe;
}): Promise<AcpThreadBindingReconciliationResult>;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.manager.d.ts
declare function createThreadBindingManager(params: {
  accountId?: string;
  token?: string;
  cfg: OpenClawConfig;
  persist?: boolean;
  enableSweeper?: boolean;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
}): ThreadBindingManager;
declare function createNoopThreadBindingManager(accountId?: string): ThreadBindingManager;
declare function getThreadBindingManager(accountId?: string): ThreadBindingManager | null;
//#endregion
//#region extensions/discord/src/component-custom-id.d.ts
declare const DISCORD_COMPONENT_CUSTOM_ID_KEY = "occomp";
declare const DISCORD_MODAL_CUSTOM_ID_KEY = "ocmodal";
declare function buildDiscordComponentCustomId(params: {
  componentId: string;
  modalId?: string;
}): string;
declare function buildDiscordModalCustomId(modalId: string): string;
declare function parseDiscordComponentCustomId(id: string): {
  componentId: string;
  modalId?: string;
} | null;
declare function parseDiscordModalCustomId(id: string): string | null;
declare function parseDiscordComponentCustomIdForInteraction(id: string): ComponentParserResult;
declare function parseDiscordModalCustomIdForInteraction(id: string): ComponentParserResult;
//#endregion
//#region extensions/discord/src/components.types.d.ts
type DiscordComponentButtonStyle = "primary" | "secondary" | "success" | "danger" | "link";
type DiscordComponentSelectType = "string" | "user" | "role" | "mentionable" | "channel";
type DiscordComponentCallbackDataKind = "command" | "callback";
type DiscordComponentModalFieldType = "text" | "checkbox" | "radio" | "select" | "role-select" | "user-select";
type DiscordComponentButtonSpec = {
  label: string;
  style?: DiscordComponentButtonStyle;
  url?: string;
  callbackData?: string;
  callbackDataKind?: DiscordComponentCallbackDataKind;
  /** Internal use only: bypass dynamic component ids with a fixed custom id. */
  internalCustomId?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  disabled?: boolean;
  /** Keep this action available after a successful interaction. */
  reusable?: boolean;
  /** Optional allowlist of users who can interact with this button (ids or names). */
  allowedUsers?: string[];
};
type DiscordComponentSelectOption = {
  label: string;
  value: string;
  description?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  default?: boolean;
};
type DiscordComponentSelectSpec = {
  type?: DiscordComponentSelectType;
  callbackData?: string;
  callbackDataKind?: DiscordComponentCallbackDataKind;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  options?: DiscordComponentSelectOption[];
  allowedUsers?: string[];
};
type DiscordComponentSectionAccessory = {
  type: "thumbnail";
  url: string;
} | {
  type: "button";
  button: DiscordComponentButtonSpec;
};
type DiscordComponentSeparatorSpacing = "small" | "large" | 1 | 2;
type DiscordComponentBlock = {
  type: "text";
  text: string;
} | {
  type: "section";
  text?: string;
  texts?: string[];
  accessory?: DiscordComponentSectionAccessory;
} | {
  type: "separator";
  spacing?: DiscordComponentSeparatorSpacing;
  divider?: boolean;
} | {
  type: "actions";
  buttons?: DiscordComponentButtonSpec[];
  select?: DiscordComponentSelectSpec;
} | {
  type: "media-gallery";
  items: Array<{
    url: string;
    description?: string;
    spoiler?: boolean;
  }>;
} | {
  type: "file";
  file: `attachment://${string}`;
  spoiler?: boolean;
};
type DiscordModalFieldSpec = {
  type: DiscordComponentModalFieldType;
  name?: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: DiscordComponentSelectOption[];
  minValues?: number;
  maxValues?: number;
  minLength?: number;
  maxLength?: number;
  style?: "short" | "paragraph";
};
type DiscordModalSpec = {
  title: string;
  callbackData?: string;
  triggerLabel?: string;
  triggerStyle?: DiscordComponentButtonStyle;
  allowedUsers?: string[];
  fields: DiscordModalFieldSpec[];
};
type DiscordComponentMessageSpec = {
  text?: string;
  reusable?: boolean;
  container?: {
    accentColor?: string | number;
    spoiler?: boolean;
  };
  blocks?: DiscordComponentBlock[];
  modal?: DiscordModalSpec;
};
type DiscordComponentEntry = {
  id: string;
  kind: "button" | "select" | "modal-trigger";
  label: string;
  callbackData?: string;
  callbackDataKind?: DiscordComponentCallbackDataKind;
  selectType?: DiscordComponentSelectType;
  options?: Array<{
    value: string;
    label: string;
  }>;
  modalId?: string;
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
  reusable?: boolean;
  consumptionGroupId?: string;
  consumptionGroupEntryIds?: string[];
  allowedUsers?: string[];
  messageId?: string;
  createdAt?: number;
  expiresAt?: number;
};
type DiscordModalFieldDefinition = {
  id: string;
  name: string;
  label: string;
  type: DiscordComponentModalFieldType;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: DiscordComponentSelectOption[];
  minValues?: number;
  maxValues?: number;
  minLength?: number;
  maxLength?: number;
  style?: "short" | "paragraph";
};
type DiscordModalEntry = {
  id: string;
  title: string;
  callbackData?: string;
  fields: DiscordModalFieldDefinition[];
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
  reusable?: boolean;
  messageId?: string;
  createdAt?: number;
  expiresAt?: number;
  allowedUsers?: string[];
};
type DiscordComponentBuildResult = {
  components: TopLevelComponents[];
  entries: DiscordComponentEntry[];
  modals: DiscordModalEntry[];
};
//#endregion
//#region extensions/discord/src/components.builders.d.ts
declare function buildDiscordComponentMessage(params: {
  spec: DiscordComponentMessageSpec;
  fallbackText?: string;
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
}): DiscordComponentBuildResult;
declare function buildDiscordComponentMessageFlags(components: TopLevelComponents[]): number | undefined;
//#endregion
//#region extensions/discord/src/components.parse.d.ts
declare const DISCORD_COMPONENT_ATTACHMENT_PREFIX = "attachment://";
declare function resolveDiscordComponentAttachmentName(value: string): string;
declare function readDiscordComponentSpec(raw: unknown): DiscordComponentMessageSpec | null;
//#endregion
//#region extensions/discord/src/components.modal.d.ts
declare const ModalBase: typeof Modal;
declare class DiscordFormModal extends ModalBase {
  title: string;
  customId: string;
  components: Array<Label | TextDisplay>;
  customIdParser: typeof parseDiscordModalCustomIdForInteraction;
  constructor(params: {
    modalId: string;
    title: string;
    fields: DiscordModalFieldDefinition[];
  });
  run(): Promise<void>;
}
declare function createDiscordFormModal(entry: DiscordModalEntry): Modal;
//#endregion
//#region extensions/discord/src/shared-interactive.d.ts
/**
 * @deprecated Use buildDiscordPresentationComponents with MessagePresentation.
 */
declare function buildDiscordInteractiveComponents(interactive?: LegacyInteractiveReply, options?: DiscordPresentationBuildOptions): DiscordComponentMessageSpec | undefined;
type DiscordPresentationBuildOptions = {
  questionOptionIndices?: AskUserQuestionOptionIndices;
};
//#endregion
//#region extensions/discord/src/components.d.ts
declare function formatDiscordComponentEventText(params: {
  kind: "button" | "select";
  label: string;
  values?: string[];
}): string;
//#endregion
//#region extensions/discord/src/monitor/timeouts.d.ts
declare const DISCORD_DEFAULT_LISTENER_TIMEOUT_MS = 120000;
declare const DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS: number;
declare const DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS = 60000;
declare const DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS = 120000;
/** @deprecated Discord listener timeouts are compatibility-only. */
declare function normalizeDiscordListenerTimeoutMs(raw: number | undefined): number;
/** @deprecated Discord no longer applies channel-owned inbound run timeouts. */
declare function normalizeDiscordInboundWorkerTimeoutMs(raw: number | undefined): number | undefined;
/** @deprecated Compatibility helper for old Discord timeout integrations. */
declare function isAbortError(error: unknown): boolean;
/** @deprecated Discord no longer uses this for channel-owned message run timeouts. */
declare function runDiscordTaskWithTimeout(params: {
  run: (abortSignal: AbortSignal | undefined) => Promise<void>;
  timeoutMs?: number;
  abortSignals?: Array<AbortSignal | undefined>;
  onTimeout: (timeoutMs: number) => void | Promise<void>;
  onAbortAfterTimeout?: () => void;
  onErrorAfterTimeout?: (error: unknown) => void;
}): Promise<boolean>;
//#endregion
//#region extensions/discord/src/reply-reference.d.ts
type DiscordReplyReference = Readonly<{
  messageId: string;
  scope: "all" | "first";
}>;
//#endregion
//#region extensions/discord/src/send.message-request.d.ts
type DiscordMessageComponents = NonNullable<MessagePayloadObject["components"]>;
type DiscordSendComponentFactory = (text: string) => TopLevelComponents[];
type DiscordSendComponents = TopLevelComponents[] | DiscordSendComponentFactory;
type DiscordSendEmbeds = Array<APIEmbed | Embed>;
type DiscordAllowedMentions = APIAllowedMentions;
declare function resolveDiscordSendComponents(params: {
  components?: DiscordSendComponents | DiscordMessageComponents;
  text: string;
  isFirst: boolean;
}): DiscordMessageComponents | undefined;
//#endregion
export { reconcileAcpThreadBindingsOnStartup as $, DiscordComponentSectionAccessory as A, buildDiscordComponentCustomId as B, DiscordComponentBlock as C, DiscordComponentEntry as D, DiscordComponentButtonStyle as E, DiscordModalFieldDefinition as F, parseDiscordModalCustomIdForInteraction as G, parseDiscordComponentCustomId as H, DiscordModalFieldSpec as I, getThreadBindingManager as J, createNoopThreadBindingManager as K, DiscordModalSpec as L, DiscordComponentSelectSpec as M, DiscordComponentSelectType as N, DiscordComponentMessageSpec as O, DiscordModalEntry as P, listThreadBindingsForAccount as Q, DISCORD_COMPONENT_CUSTOM_ID_KEY as R, buildDiscordComponentMessageFlags as S, DiscordComponentButtonSpec as T, parseDiscordComponentCustomIdForInteraction as U, buildDiscordModalCustomId as V, parseDiscordModalCustomId as W, autoBindSpawnedDiscordSubagent as X, AcpThreadBindingReconciliationResult as Y, listThreadBindingsBySessionKey as Z, createDiscordFormModal as _, DiscordReplyReference as a, ThreadBindingRecord as at, resolveDiscordComponentAttachmentName as b, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS as c, normalizeDiscordInboundWorkerTimeoutMs as d, unbindThreadBindingsBySessionKey as et, normalizeDiscordListenerTimeoutMs as f, DiscordFormModal as g, buildDiscordInteractiveComponents as h, resolveDiscordSendComponents as i, ThreadBindingManager as it, DiscordComponentSelectOption as j, DiscordComponentModalFieldType as k, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS as l, formatDiscordComponentEventText as m, DiscordSendComponents as n, resolveDiscordThreadBindingMaxAgeMs as nt, DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS as o, ThreadBindingTargetKind as ot, runDiscordTaskWithTimeout as p, createThreadBindingManager as q, DiscordSendEmbeds as r, resolveThreadBindingsEnabled as rt, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS as s, DiscordAllowedMentions as t, resolveDiscordThreadBindingIdleTimeoutMs as tt, isAbortError as u, DISCORD_COMPONENT_ATTACHMENT_PREFIX as v, DiscordComponentBuildResult as w, buildDiscordComponentMessage as x, readDiscordComponentSpec as y, DISCORD_MODAL_CUSTOM_ID_KEY as z };