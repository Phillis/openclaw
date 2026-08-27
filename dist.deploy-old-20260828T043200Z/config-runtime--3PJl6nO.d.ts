import { _ as ResolvedTalkConfig, r as OpenClawConfig, v as TalkConfig } from "./types.openclaw-Cjm06lg9.js";
import { S as MarkdownTableMode, f as ContextVisibilityMode } from "./types.base-nhGY37Gp.js";
import "./types-336a6ztO.js";
import "./io-CN6VZK8B.js";
import "./config-C5ZMVTaL.js";
import "./types-CNsppBy_.js";
import "./transcript-B37nXJYC.js";
import "./agent-scope-BbRoyveY.js";
import "./sessions-D0GtEQ5l.js";
import "./session-store-runtime-B0PPClsY.js";
import { n as ResolveMarkdownTableModeParams } from "./markdown-tables.types-DOCLU5vv.js";
import "./group-policy-psuc5AAP.js";
import "./plugin-config-runtime-K2dz87OD.js";
import "./shared-DaSnRuLA.js";
import "./model-overrides-ZEGXtr3U.js";
import "./commands-B1dYii7J.js";
import "./resolve-configured-secret-input-string-CYdvRcBM.js";
//#region src/config/context-visibility.d.ts
type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
      /**
       * Global default supplemental context visibility for channels without a local override.
       */
      contextVisibility?: ContextVisibilityMode;
    };
  };
};
/** Reads the global channel default supplemental context visibility mode. */
declare function resolveDefaultContextVisibility(cfg: ContextVisibilityDefaultsConfig): ContextVisibilityMode | undefined;
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
declare function resolveChannelContextVisibilityMode(params: {
  /** Full OpenClaw config containing channel defaults and per-channel overrides. */
  cfg: OpenClawConfig;
  /** Channel id whose visibility policy is being resolved. */
  channel: string;
  /** Optional channel account id used for account-specific overrides. */
  accountId?: string | null;
  /** Runtime adapter override that takes precedence over config-backed policy. */
  configuredContextVisibility?: ContextVisibilityMode;
}): ContextVisibilityMode;
//#endregion
//#region src/config/markdown-tables.d.ts
declare function resolveMarkdownTableMode(params: ResolveMarkdownTableModeParams): MarkdownTableMode;
//#endregion
//#region src/config/talk.d.ts
/**
 * Resolve the single active Talk speech provider and its provider-owned config.
 * Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
 */
declare function resolveActiveTalkProviderConfig(talk: TalkConfig | undefined): ResolvedTalkConfig | undefined;
//#endregion
//#region src/config/dangerous-name-matching.d.ts
type DangerousNameMatchingConfig = {
  dangerouslyAllowNameMatching?: boolean;
};
type DangerousNameMatchingResolverInput = {
  providerConfig?: DangerousNameMatchingConfig | null | undefined;
  accountConfig?: DangerousNameMatchingConfig | null | undefined;
};
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
declare function isDangerousNameMatchingEnabled(config: DangerousNameMatchingConfig | null | undefined): boolean;
/** Resolves account-level dangerous name matching, inheriting the provider flag when unset. */
declare function resolveDangerousNameMatchingEnabled(input: DangerousNameMatchingResolverInput): boolean;
//#endregion
export { resolveChannelContextVisibilityMode as a, resolveMarkdownTableMode as i, resolveDangerousNameMatchingEnabled as n, resolveDefaultContextVisibility as o, resolveActiveTalkProviderConfig as r, isDangerousNameMatchingEnabled as t };