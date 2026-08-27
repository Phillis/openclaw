import { F as chunkTextForOutbound, H as createChannelPairingController, Q as buildChannelConfigSchema, U as buildBaseAccountStatusSnapshot, bt as DEFAULT_ACCOUNT_ID, ct as PluginRuntime, ft as resolveInboundMentionDecision, ut as createChannelReplyPipeline, v as OpenClawPluginToolContext, wt as AnyAgentTool, xt as normalizeAccountId } from "../../plugin-entry-GuVBIlyS.js";
import { N as GroupToolPolicyConfig, Y as MarkdownTableMode, n as OpenClawConfig } from "../../types.openclaw-VfFCsbZD.js";
import { B as ChannelDirectoryEntry, F as ChannelAccountSnapshot, N as BaseProbeResult, U as ChannelMessageActionAdapter, V as ChannelGroupContext, q as ChannelStatusIssue } from "../../types.adapters-BCj_O1Hf.js";
import { O as RuntimeEnv } from "../../manifest-registry-dA0dB5pr.js";
import { c as deliverTextOrMediaReply, l as isNumericTargetId, o as OutboundReplyPayload, s as ReplyPayload, u as sendPayloadWithChunkedTextAndMedia } from "../../media-services-CCiq3Bcu.js";
import { n as ChannelPlugin } from "../../types.public-C3sFjEH3.js";
import { t as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-eJLRWqMz.js";
import { t as isDangerousNameMatchingEnabled } from "../../dangerous-name-matching-BiK-SlwM.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, i as resolveOpenProviderRuntimeGroupPolicy, n as summarizeMapping, r as resolveDefaultGroupPolicy, t as mergeAllowlist } from "../../resolve-utils-qjw06L_3.js";
import { t as loadOutboundMediaFromUrl } from "../../outbound-media-CQ0_nxYf.js";
import { t as zalouserPlugin } from "../../channel-CVWeCIYZ.js";
import { t as zalouserSetupPlugin } from "../../channel.setup-BkhHJVig.js";
import { i as createZalouserTool, n as createZalouserSetupWizardProxy, r as zalouserSetupAdapter, t as zalouserSetupWizard } from "../../api-Dt3jsSwo.js";
import { n as isZalouserMutableGroupEntry, t as collectZalouserSecurityAuditFindings } from "../../security-audit-R59v805r.js";

//#region src/infra/outbound/reply-payload-parts.d.ts
/** Derived sendability facts for text/media outbound payload delivery. */
type SendableOutboundReplyParts = {
  /** Raw text selected for delivery before trimming. */text: string; /** Text after trimming whitespace for sendability checks. */
  trimmedText: string; /** Normalized non-empty media URLs. */
  mediaUrls: string[]; /** Number of normalized media URLs. */
  mediaCount: number; /** Whether trimmed text is sendable. */
  hasText: boolean; /** Whether at least one media URL is sendable. */
  hasMedia: boolean; /** Whether the payload has any sendable text or media. */
  hasContent: boolean;
};
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
declare function resolveSendableOutboundReplyParts(payload: {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
}, options?: {
  text?: string;
}): SendableOutboundReplyParts;
//#endregion
//#region src/plugin-sdk/allow-from.d.ts
/** Lowercase and optionally strip prefixes from allowlist entries before sender comparisons. */
declare function formatAllowFromLowercase(params: {
  /** Raw allowlist entries from config or channel-specific overrides. */allowFrom: Array<string | number>; /** Optional prefix remover for channel aliases such as `tg:` or `zalo:`. */
  stripPrefixRe?: RegExp;
}): string[];
//#endregion
//#region extensions/zalouser/src/runtime.d.ts
declare const setZalouserRuntime: (next: PluginRuntime) => void, getZalouserRuntime: () => PluginRuntime;
//#endregion
export { type AnyAgentTool, type BaseProbeResult, type ChannelAccountSnapshot, type ChannelDirectoryEntry, type ChannelGroupContext, type ChannelMessageActionAdapter, type ChannelPlugin, type ChannelStatusIssue, DEFAULT_ACCOUNT_ID, type GroupToolPolicyConfig, type MarkdownTableMode, type OpenClawConfig, type OpenClawPluginToolContext, type OutboundReplyPayload, type PluginRuntime, type ReplyPayload, type RuntimeEnv, buildBaseAccountStatusSnapshot, buildChannelConfigSchema, chunkTextForOutbound, collectZalouserSecurityAuditFindings, createChannelReplyPipeline as createChannelMessageReplyPipeline, createChannelPairingController, createZalouserSetupWizardProxy, createZalouserTool, deliverTextOrMediaReply, formatAllowFromLowercase, isDangerousNameMatchingEnabled, isNumericTargetId, isZalouserMutableGroupEntry, loadOutboundMediaFromUrl, mergeAllowlist, normalizeAccountId, resolveDefaultGroupPolicy, resolveInboundMentionDecision, resolveOpenProviderRuntimeGroupPolicy, resolvePreferredOpenClawTmpDir, resolveSendableOutboundReplyParts, sendPayloadWithChunkedTextAndMedia, setZalouserRuntime, summarizeMapping, warnMissingProviderGroupPolicyFallbackOnce, zalouserPlugin, zalouserSetupAdapter, zalouserSetupPlugin, zalouserSetupWizard };