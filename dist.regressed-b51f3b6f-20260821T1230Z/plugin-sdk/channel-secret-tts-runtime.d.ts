import { n as SecretDefaults, t as ResolverContext } from "../runtime-shared-C8XB3oPE.js";

//#region src/secrets/channel-secret-basic-runtime.d.ts
type ChannelAccountEntry = {
  accountId: string;
  account: Record<string, unknown>;
  enabled: boolean;
};
/** Resolved view of a channel config, including synthetic default-account fallback. */
type ChannelAccountSurface = {
  hasExplicitAccounts: boolean;
  channelEnabled: boolean;
  accounts: ChannelAccountEntry[];
};
/** Predicate used by channel helpers to decide whether an account-owned secret is active. */
type ChannelAccountPredicate = (entry: ChannelAccountEntry) => boolean;
//#endregion
//#region src/secrets/channel-secret-tts-runtime.d.ts
/** Collects nested TTS provider SecretRefs from channel root and account-specific blocks. */
declare function collectNestedChannelTtsAssignments(params: {
  /** Channel config key used in runtime warning/assignment paths. */channelKey: string; /** Nested channel config field that owns the `tts` block, such as `outbound`. */
  nestedKey: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext; /** Whether the top-level nested `tts` block can affect runtime behavior. */
  topLevelActive: boolean;
  topInactiveReason: string; /** Per-account activity predicate for account-specific nested `tts` blocks. */
  accountActive: ChannelAccountPredicate;
  accountInactiveReason: string | ((entry: {
    accountId: string;
    account: Record<string, unknown>;
    enabled: boolean;
  }) => string);
}): void;
//#endregion
export { collectNestedChannelTtsAssignments };