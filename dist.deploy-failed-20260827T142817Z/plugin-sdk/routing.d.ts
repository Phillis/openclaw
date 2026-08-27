import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { t as resolveAccountEntry } from "../account-lookup-AwHuXBzh.js";
import { a as parseThreadSessionSuffix, i as parseAgentSessionKey, n as isCronSessionKey, r as isSubagentSessionKey, t as isAcpSessionKey } from "../session-key-utils-YPdhOQyR.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { a as resolveAgentIdFromSessionKey, i as normalizeMainKey, n as buildAgentMainSessionKey, o as resolveThreadSessionKeys, r as buildGroupHistoryKey, s as sanitizeAgentId, t as DEFAULT_MAIN_KEY } from "../session-key-BPZ64Z44.js";
import { a as buildAgentSessionKey, c as resolveInboundLastRouteSessionKey, i as RoutePeerKind, n as ResolvedAgentRoute, o as deriveLastRoutePolicy, r as RoutePeer, s as resolveAgentRoute } from "../resolve-route-CbLzYrI1.js";

//#region packages/normalization-core/src/agent-id.d.ts
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
declare function normalizeAgentId(value: string | undefined | null): string;
//#endregion
//#region src/shared/incognito-session-key.d.ts
/** Classifies process-only agent session keys without consulting runtime registry state. */
declare function isIncognitoSessionKey(sessionKey: string | undefined | null): boolean;
//#endregion
//#region src/routing/bindings.d.ts
declare function listBoundAccountIds(cfg: OpenClawConfig, channelId: string): string[];
declare function resolveDefaultAgentBoundAccountId(cfg: OpenClawConfig, channelId: string): string | null;
//#endregion
//#region src/routing/default-account-warnings.d.ts
declare function formatSetExplicitDefaultInstruction(channelKey: string): string;
declare function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string;
//#endregion
//#region src/infra/outbound/base-session-key.d.ts
/**
 * Builds the canonical outbound base-session key for a resolved route peer.
 *
 * Mirrors the routing layer's session-scope rules so outbound-only sends and
 * inbound route resolution keep the same `dmScope` and identity-link behavior.
 */
declare function buildOutboundBaseSessionKey(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
}): string;
//#endregion
//#region src/infra/outbound/thread-id.d.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
declare function normalizeOutboundThreadId(value?: string | number | null): string | undefined;
//#endregion
//#region src/utils/message-channel-core.d.ts
/**
 * Shared message-channel normalization for delivery, routing, config, and gateway headers.
 *
 * Built-in aliases normalize through channel ids, while plugin-owned channel ids
 * stay accepted even when core has no bundled alias for them.
 */
/** Normalizes raw channel names, aliases, and internal webchat into canonical ids. */
declare function normalizeMessageChannel(raw?: string | null): string | undefined;
//#endregion
//#region src/utils/message-channel-normalize.d.ts
/** Normalizes and validates a raw channel value for Gateway routing. */
declare function resolveGatewayMessageChannel(raw?: string | null): string | undefined;
//#endregion
export { DEFAULT_ACCOUNT_ID, DEFAULT_MAIN_KEY, type ResolvedAgentRoute, type RoutePeer, type RoutePeerKind, buildAgentMainSessionKey, buildAgentSessionKey, buildGroupHistoryKey, buildOutboundBaseSessionKey, deriveLastRoutePolicy, formatSetExplicitDefaultInstruction, formatSetExplicitDefaultToConfiguredInstruction, isAcpSessionKey, isCronSessionKey, isIncognitoSessionKey, isSubagentSessionKey, listBoundAccountIds, normalizeAccountId, normalizeAgentId, normalizeMainKey, normalizeMessageChannel, normalizeOptionalAccountId, normalizeOutboundThreadId, parseAgentSessionKey, parseThreadSessionSuffix, resolveAccountEntry, resolveAgentIdFromSessionKey, resolveAgentRoute, resolveDefaultAgentBoundAccountId, resolveGatewayMessageChannel, resolveInboundLastRouteSessionKey, resolveThreadSessionKeys, sanitizeAgentId };