import { Xo as OpenClawPluginApi, Yo as OpenClawPluginConfigSchema, ac as GatewayRequestContext, bc as PluginRegistry, cc as GatewayRequestOptions, dl as PluginInteractiveHandlerRegistration, ec as AgentPromptSurfaceKind, fl as PluginInteractiveRegistration, ha as RuntimeLogger, ic as GatewayContextResolver, nc as PluginCommandContext, rc as PluginCommandResult, tc as OpenClawPluginCommandDefinition, yr as PluginRuntime } from "../agent-harness-runtime-D3DJE4wK.js";
import { r as OpenClawConfig } from "../types.openclaw-Cjm06lg9.js";
import { t as PluginOrigin } from "../plugin-origin.types-DOQEvsWL.js";
import { i as ReplyPayload } from "../reply-payload-BLqBLl6E.js";
import { t as getGlobalHookRunner } from "../hook-runner-global-CAS94Rk5.js";
import { n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "../conversation-binding.types-CqqiKINU.js";
import { t as getPluginCommandSpecs } from "../command-specs-Co5dn5rF.js";
import { i as requestPluginConversationBinding } from "../conversation-binding-CcCR6qgo.js";
//#region src/plugins/command-registry-state.d.ts
type RegisteredPluginCommand = OpenClawPluginCommandDefinition & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  trustedOwnerStatusExposure?: true;
};
declare function clearPluginCommands(): void;
declare function listRegisteredPluginAgentPromptGuidance(params?: {
  surface?: AgentPromptSurfaceKind;
  includeLegacyGlobalGuidance?: boolean;
}): string[];
//#endregion
//#region src/plugins/command-registration.d.ts
/** Result returned when a plugin command registration succeeds or fails validation. */
type CommandRegistrationResult = {
  ok: boolean;
  error?: string;
};
declare function registerPluginCommand(pluginId: string, command: OpenClawPluginCommandDefinition, opts?: {
  pluginName?: string;
  pluginRoot?: string;
  allowReservedCommandNames?: boolean;
  allowOwnerStatusExposure?: boolean;
}): CommandRegistrationResult;
//#endregion
//#region src/plugins/commands.d.ts
/** Match one compatibility command invocation against the current command registry. */
declare function matchPluginCommand(commandBody: string, options?: {
  channel?: string;
}): {
  command: RegisteredPluginCommand;
  args?: string;
} | null;
declare function executePluginCommand(params: {
  command: RegisteredPluginCommand;
  args?: string;
  senderId?: string;
  channel: string;
  channelId?: PluginCommandContext["channelId"];
  isAuthorizedSender: boolean;
  senderIsOwner?: boolean;
  gatewayClientScopes?: PluginCommandContext["gatewayClientScopes"];
  /** Host-resolved agent authority for plugin-owned or non-agent-shaped session keys. */
  agentId?: string;
  sessionKey?: PluginCommandContext["sessionKey"];
  sessionId?: PluginCommandContext["sessionId"];
  sessionTarget?: PluginCommandContext["sessionTarget"];
  sessionFile?: PluginCommandContext["sessionFile"];
  authProfileId?: string;
  commandBody: string;
  config: OpenClawConfig;
  from?: PluginCommandContext["from"];
  to?: PluginCommandContext["to"];
  originatingTo?: string;
  accountId?: PluginCommandContext["accountId"];
  messageThreadId?: PluginCommandContext["messageThreadId"];
  threadParentId?: PluginCommandContext["threadParentId"];
  diagnosticsSessions?: PluginCommandContext["diagnosticsSessions"];
  diagnosticsUploadApproved?: PluginCommandContext["diagnosticsUploadApproved"];
  diagnosticsPreviewOnly?: PluginCommandContext["diagnosticsPreviewOnly"];
  diagnosticsPrivateRouted?: PluginCommandContext["diagnosticsPrivateRouted"];
}): Promise<PluginCommandResult>;
//#endregion
//#region src/plugins/interactive-binding-helpers.d.ts
type RegisteredInteractiveMetadata = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
type PluginBindingConversation = Parameters<typeof requestPluginConversationBinding>[0]["conversation"];
declare function createInteractiveConversationBindingHelpers(params: {
  registration: RegisteredInteractiveMetadata;
  senderId?: string;
  conversation: PluginBindingConversation;
}): {
  requestConversationBinding: (binding?: PluginConversationBindingRequestParams) => Promise<{
    status: "bound";
    binding: PluginConversationBinding;
  } | {
    status: "pending";
    approvalId: string;
    reply: ReplyPayload;
  } | {
    status: "error";
    message: string;
  }>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
//#endregion
//#region src/plugins/interactive-registry.d.ts
/** Registered interactive handler with owning plugin metadata. */
type RegisteredInteractiveHandler = PluginInteractiveHandlerRegistration & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
/** Registration result for plugin interactive namespace handlers. */
type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};
/** Registers one process-global interactive handler. */
declare function registerPluginInteractiveHandler(pluginId: string, registration: PluginInteractiveHandlerRegistration, opts?: {
  pluginName?: string;
  pluginRoot?: string;
}): InteractiveRegistrationResult;
/** Clears all active plugin interactive handlers. */
declare function clearPluginInteractiveHandlers(): void;
//#endregion
//#region src/plugins/interactive.d.ts
type InteractiveDispatchResult<TResult = unknown> = {
  matched: false;
  handled: false;
  duplicate: false;
} | {
  matched: true;
  handled: boolean;
  duplicate: boolean;
  result?: TResult;
};
type PluginInteractiveDispatchRegistration = {
  channel: string;
  namespace: string;
};
/** Resolved interactive handler match passed to plugin callback dispatch. */
type PluginInteractiveMatch<TRegistration extends PluginInteractiveDispatchRegistration> = {
  registration: RegisteredInteractiveHandler & TRegistration;
  namespace: string;
  payload: string;
};
type ChannelInteractivePayload = {
  data: string;
  namespace: string;
  payload: string;
};
type ChannelInteractiveDispatchPayload<T> = T extends ChannelInteractivePayload ? Omit<T, keyof ChannelInteractivePayload> : never;
type ChannelInteractiveDispatchBase = {
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  senderId?: string;
  threadId?: string | number;
  auth: {
    isAuthorizedSender: boolean;
  };
};
type ChannelInteractiveHandlerContext<TChannel extends string, TInteractiveKey extends PropertyKey> = ChannelInteractiveDispatchBase & {
  channel: TChannel;
  respond: unknown;
} & Record<TInteractiveKey, ChannelInteractivePayload>;
type ChannelInteractiveOwnedContextKey<TInteractiveKey> = TInteractiveKey | "respond" | "channel" | "requestConversationBinding" | "detachConversationBinding" | "getCurrentConversationBinding";
type ChannelInteractiveDispatchContext<TContext, TInteractiveKey extends keyof TContext, TDispatchInteractiveKey extends PropertyKey> = Omit<TContext, ChannelInteractiveOwnedContextKey<TInteractiveKey>> & ChannelInteractiveDispatchBase & Record<TDispatchInteractiveKey, ChannelInteractiveDispatchPayload<TContext[TInteractiveKey]>>;
/** Dispatches one interactive callback payload to a matching plugin handler. */
declare function dispatchPluginInteractiveHandler<TRegistration extends PluginInteractiveDispatchRegistration, TResult extends {
  handled?: boolean;
} | void = {
  handled?: boolean;
} | void>(params: {
  channel: TRegistration["channel"];
  data: string;
  dedupeId?: string;
  onMatched?: () => Promise<void> | void;
  invoke: (match: PluginInteractiveMatch<TRegistration>) => Promise<TResult> | TResult;
  afterInvoke?: (result: TResult) => Promise<void> | void;
}): Promise<InteractiveDispatchResult<TResult>>;
/** Creates a channel dispatcher for plugin-owned interactive callbacks. */
declare function createChannelInteractiveDispatcher<TChannel extends string, TInteractiveKey extends PropertyKey, TContext extends ChannelInteractiveHandlerContext<TChannel, TInteractiveKey>, TResult extends {
  handled?: boolean;
} | void = {
  handled?: boolean;
} | void, TDispatchInteractiveKey extends PropertyKey = TInteractiveKey>(config: {
  channel: TChannel;
  interactiveKey: TInteractiveKey;
  dispatchInteractiveKey?: TDispatchInteractiveKey;
}): (params: {
  data: string;
  dedupeId: string;
  ctx: ChannelInteractiveDispatchContext<TContext, TInteractiveKey, TDispatchInteractiveKey>;
  respond: TContext["respond"];
  conversation?: Parameters<typeof createInteractiveConversationBindingHelpers>[0]["conversation"];
  onMatched?: () => Promise<void> | void;
  afterInvoke?: (result: TResult) => Promise<void> | void;
}) => Promise<InteractiveDispatchResult<TResult>>;
//#endregion
//#region src/plugins/lazy-service-module.d.ts
type LazyServiceModule = Record<string, unknown>;
type LazyPluginServiceHandle = {
  stop: () => Promise<void>;
};
declare function startLazyPluginServiceModule(params: {
  skipEnvVar?: string;
  overrideEnvVar?: string;
  validateOverrideSpecifier?: (specifier: string) => string;
  loadDefaultModule: () => Promise<LazyServiceModule>;
  loadOverrideModule?: (specifier: string) => Promise<LazyServiceModule>;
  startExportNames: string[];
  stopExportNames?: string[];
}): Promise<LazyPluginServiceHandle | null>;
//#endregion
//#region src/plugins/runtime/gateway-request-scope.d.ts
type PluginRuntimeGatewayRequestScope = {
  context?: GatewayRequestContext;
  resolveGatewayContext?: GatewayContextResolver;
  client?: GatewayRequestOptions["client"];
  isWebchatConnect: GatewayRequestOptions["isWebchatConnect"];
  pluginId?: string;
  pluginSource?: string;
  pluginOrigin?: PluginOrigin;
  pluginTrustedOfficialInstall?: boolean;
  gatewayMethodDispatchAllowed?: boolean;
  pluginRegistry?: PluginRegistry;
};
/**
 * Returns the current plugin gateway request scope when called from a plugin request handler.
 */
declare function getPluginRuntimeGatewayRequestScope(): PluginRuntimeGatewayRequestScope | undefined;
//#endregion
export { type LazyPluginServiceHandle, type OpenClawPluginApi, type OpenClawPluginConfigSchema, type PluginConversationBinding, type PluginConversationBindingRequestParams, type PluginConversationBindingRequestResult, type PluginInteractiveRegistration, type PluginRuntime, type RuntimeLogger, clearPluginCommands, clearPluginInteractiveHandlers, createChannelInteractiveDispatcher, createInteractiveConversationBindingHelpers, dispatchPluginInteractiveHandler, executePluginCommand, getGlobalHookRunner, getPluginCommandSpecs, getPluginRuntimeGatewayRequestScope, listRegisteredPluginAgentPromptGuidance, matchPluginCommand, registerPluginCommand, registerPluginInteractiveHandler, startLazyPluginServiceModule };