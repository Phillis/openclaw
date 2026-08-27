import { r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { b as ChannelMessagingAdapter } from "./types.core-CInSoozE.js";
import { c as SessionEntry } from "./types-ByIHlRxL.js";
import { s as MsgContext } from "./templating-DzyASgcc.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { ko as ModelFallbackRouteResolution } from "./host-capability-types-BQXGgYpD.js";
//#region src/channels/native-command-session-targets.d.ts
/**
 * Inputs for resolving where a native channel command should attach session state.
 */
type ResolveNativeCommandSessionTargetsParams = {
  agentId: string;
  sessionPrefix: string;
  userId: string;
  targetSessionKey: string;
  boundSessionKey?: string;
  sessionKeyCase?: NonNullable<ChannelMessagingAdapter["targetIdComparison"]>;
};
/**
 * Resolves the storage session key and command target key for native command events.
 */
declare function resolveNativeCommandSessionTargets(params: ResolveNativeCommandSessionTargetsParams): {
  sessionKey: string;
  commandTargetSessionKey: string;
};
//#endregion
//#region src/auto-reply/command-auth.d.ts
type CommandAuthorization = {
  providerId?: ChannelId;
  ownerList: string[];
  senderId?: string;
  senderIsOwner: boolean;
  isAuthorizedSender: boolean;
  from?: string;
  to?: string;
};
declare function resolveCommandAuthorization(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  commandAuthorized: boolean;
}): CommandAuthorization;
//#endregion
//#region src/auto-reply/reply/stored-model-override.d.ts
/** Model override loaded from the current session or its parent session. */
type StoredModelOverride = {
  provider?: string;
  model: string;
  source: "session" | "parent";
  routeResolution: ModelFallbackRouteResolution;
};
/** Resolves the persisted model override visible to the current session. */
declare function resolveStoredModelOverride(params: {
  loadSessionEntry?: (sessionKey: string) => SessionEntry | undefined;
  sessionEntry?: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey?: string;
  parentSessionKey?: string;
  defaultProvider: string;
}): StoredModelOverride | null;
//#endregion
export { ResolveNativeCommandSessionTargetsParams as a, resolveCommandAuthorization as i, resolveStoredModelOverride as n, resolveNativeCommandSessionTargets as o, CommandAuthorization as r, StoredModelOverride as t };