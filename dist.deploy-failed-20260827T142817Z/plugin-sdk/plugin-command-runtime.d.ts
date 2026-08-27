import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { Ja as PLUGIN_COMMAND_DISPATCH, U as PluginCommandContext, W as PluginCommandResult, Ya as PluginCommandReplyOptions } from "../host-capability-types-3XBDy-df.js";

//#region src/plugins/plugin-command-runtime.d.ts
declare const pluginCommandDispatchBrand: unique symbol;
type PluginCommandDispatchContext = Readonly<{
  senderId?: string;
  channel: string;
  channelId?: PluginCommandContext["channelId"];
  isAuthorizedSender: boolean;
  senderIsOwner?: boolean;
  gatewayClientScopes?: PluginCommandContext["gatewayClientScopes"];
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
  runtimeContext?: {
    compactCurrent?: (signal?: AbortSignal) => ReturnType<NonNullable<NonNullable<PluginCommandContext["runtimeContext"]>["compactCurrent"]>>;
  };
}>;
/** Opaque capability bound to one selected command in one registry generation. */
type PluginCommandDispatch = Readonly<{
  kind: "plugin";
  execute: (context: PluginCommandDispatchContext) => Promise<PluginCommandResult>;
  [pluginCommandDispatchBrand]: true;
}>;
type PluginCommandCatalogDecision = PluginCommandDispatch | Readonly<{
  kind: "non-plugin";
}>;
type PluginCommandNativeCandidate = Readonly<{
  name: string;
  description: string;
  descriptionLocalizations?: Readonly<Record<string, string>>;
  acceptsArgs: boolean;
  requireAuth: boolean;
  progressMessage?: string;
  prepareDispatch: (rawArgs?: string) => PluginCommandCatalogDecision;
}>;
type PluginCommandRuntime = Readonly<{
  listNativeCandidates: (provider: string) => readonly PluginCommandNativeCandidate[];
  retainNativeCatalog: (provider: string) => void;
}>;
/** Creates one command runtime bound permanently to the current scoped registry generation. */
declare function createPluginCommandRuntime(): PluginCommandRuntime;
//#endregion
export { PLUGIN_COMMAND_DISPATCH, type PluginCommandCatalogDecision, type PluginCommandDispatch, type PluginCommandDispatchContext, type PluginCommandNativeCandidate, type PluginCommandReplyOptions, type PluginCommandRuntime, createPluginCommandRuntime };