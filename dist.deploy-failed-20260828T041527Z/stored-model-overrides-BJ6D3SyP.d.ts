import { Xa as ModelFallbackRouteResolution } from "./agent-harness-runtime-CESurA0d.js";
import { r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import { b as ChannelMessagingAdapter } from "./types.core-CMY5bxhQ.js";
import { c as SessionEntry } from "./types-CheMd8wT.js";
import { s as MsgContext } from "./templating-D4gA1hJr.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./types.public-C6NHtWqx.js";
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
//#region src/sessions/stored-model-overrides.d.ts
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