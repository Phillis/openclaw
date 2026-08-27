import { i as OpenClawConfig } from "../types.openclaw-D9FrGbix.js";
import { a as PluginCommandContext, i as OpenClawPluginCommandDefinition, o as PluginCommandResult } from "../host-capability-types-BzWjoGQ2.js";
import { n as loadPluginRegistryHandle, r as loadOpenClawPlugins } from "../loader-CJnoaaWB.js";

//#region src/plugins/command-registry-state.d.ts
type RegisteredPluginCommand = OpenClawPluginCommandDefinition & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  trustedOwnerStatusExposure?: true;
};
declare function clearPluginCommands(): void;
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
  gatewayClientScopes?: PluginCommandContext["gatewayClientScopes"]; /** Host-resolved agent authority for plugin-owned or non-agent-shaped session keys. */
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
//#region src/plugins/command-specs.d.ts
type PluginCommandSpecOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
};
declare function getPluginCommandSpecs(provider?: string, options?: PluginCommandSpecOptions): Array<{
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
}>;
//#endregion
export { clearPluginCommands, executePluginCommand, getPluginCommandSpecs, loadOpenClawPlugins, loadPluginRegistryHandle, matchPluginCommand };