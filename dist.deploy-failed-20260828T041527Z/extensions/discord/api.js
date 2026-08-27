import { i as resolveOpenProviderRuntimeGroupPolicy } from "../../runtime-group-policy-GURwo_0L.js";
import "../../runtime-group-policy-BLXPwMdH.js";
import { a as DISCORD_MODAL_CUSTOM_ID_KEY, c as buildDiscordModalCustomId, d as parseDiscordComponentCustomId, f as parseDiscordComponentCustomIdForInteraction, i as DISCORD_COMPONENT_CUSTOM_ID_KEY, m as parseDiscordModalCustomIdForInteraction, p as parseDiscordModalCustomId, s as buildDiscordComponentCustomId, t as buildDiscordInteractiveComponents } from "../../shared-interactive-Bc9FmZin.js";
import { a as listEnabledDiscordAccounts, c as resolveDiscordAccount, o as mergeDiscordAccountConfig, p as resolveDiscordMaxLinesPerMessage, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId, t as createDiscordActionGate, u as resolveDiscordAccountConfig } from "../../accounts-DWE66f3w.js";
import { a as buildDiscordComponentMessageFlags, c as readDiscordComponentSpec, i as buildDiscordComponentMessage, l as resolveDiscordComponentAttachmentName, n as DiscordFormModal, o as DISCORD_COMPONENT_ATTACHMENT_PREFIX, r as createDiscordFormModal, t as formatDiscordComponentEventText } from "../../components-ff8c52vl.js";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "../../api-xmKL-v32.js";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "../../target-parsing-CcbK_-tL.js";
import { i as normalizeDiscordOutboundTarget, n as looksLikeDiscordTargetId, r as normalizeDiscordMessagingTarget } from "../../normalize-By3GFKNK.js";
import { n as resolveDiscordTarget, r as parseDiscordSendTarget } from "../../target-resolver-Hct3FMk9.js";
import { t as inspectDiscordAccount } from "../../account-inspect-CvEWqlsl.js";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "../../timeouts-DfTLdOJX.js";
import "../../targets-BpkLtqCM.js";
import { i as shouldSuppressLocalDiscordExecApprovalPrompt, n as isDiscordExecApprovalApprover, r as isDiscordExecApprovalClientEnabled, t as getDiscordExecApprovalApprovers } from "../../exec-approvals-c5JXQjHw.js";
import { i as resolveDiscordGroupToolPolicy, n as collectDiscordStatusIssues, r as resolveDiscordGroupRequireMention, t as discordPlugin } from "../../channel-CuUEYb00.js";
import { t as normalizeExplicitDiscordSessionKey } from "../../session-key-normalization-DMFhoSvb.js";
import { t as discordSetupPlugin } from "../../channel.setup-CpmtHsag.js";
import { n as handleDiscordSubagentEnded, t as handleDiscordSubagentDeliveryTarget } from "../../subagent-hooks-C-gZ5QjW.js";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "../../handle-action.guild-admin-B9lVI5HJ.js";
import { n as listDiscordDirectoryPeersFromConfig, t as listDiscordDirectoryGroupsFromConfig } from "../../directory-config-D0x_vKRD.js";
import { t as fetchPluralKitMessageInfo } from "../../pluralkit-4mNXEG7X.js";
import { i as probeDiscord, n as fetchDiscordApplicationSummary, o as resolveDiscordPrivilegedIntentsFromFlags, r as parseApplicationIdFromToken, t as fetchDiscordApplicationId } from "../../probe-B8IZlCNA.js";
import { t as collectDiscordSecurityAuditFindings } from "../../security-audit-C1zH1kHy.js";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("../../channel-actions.runtime-BJXrMrdf.js")).handleDiscordMessageAction(...args);
/**
* @deprecated Shipped `@openclaw/discord/api` compatibility only. Use native
* `AbortSignal.any` after filtering optional signals. Removal with the next
* plugin-SDK major.
*/
function mergeAbortSignals(signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	return activeSignals.length > 1 ? AbortSignal.any(activeSignals) : activeSignals[0];
}
//#endregion
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentEnded, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
