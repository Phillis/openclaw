import { Z as AcpRuntimeSessionMode, n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import { t as ChannelId } from "./channel-id.types-myn0PI2A.js";
import "./types.public-B6kp1nO6.js";
import { o as SessionBindingRecord } from "./session-binding.types-iPttD8T3.js";
//#region src/acp/persistent-bindings.types.d.ts
type ConfiguredAcpBindingChannel = ChannelId;
/** Normalized configured binding that maps one channel conversation to one ACP session. */
type ConfiguredAcpBindingSpec = {
  channel: ConfiguredAcpBindingChannel;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  /** Owning OpenClaw agent id (used for session identity/storage). */
  agentId: string;
  /** ACP harness agent id override (falls back to agentId when omitted). */
  acpAgentId?: string;
  mode: AcpRuntimeSessionMode;
  model?: string;
  cwd?: string;
  backend?: string;
  label?: string;
};
type ResolvedConfiguredAcpBinding = {
  spec: ConfiguredAcpBindingSpec;
  record: SessionBindingRecord;
};
//#endregion
//#region src/acp/persistent-bindings.resolve.d.ts
/** Resolves a configured ACP binding for a concrete channel conversation. */
declare function resolveConfiguredAcpBindingRecord(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
}): ResolvedConfiguredAcpBinding | null;
//#endregion
export { ResolvedConfiguredAcpBinding as n, resolveConfiguredAcpBindingRecord as t };