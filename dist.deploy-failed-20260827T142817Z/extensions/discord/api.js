import { i as resolveOpenProviderRuntimeGroupPolicy } from "../../runtime-group-policy-6UJsFi-Z.js";
import "../../runtime-group-policy-N6jVf60n.js";
import { a as mergeDiscordAccountConfig, f as resolveDiscordMaxLinesPerMessage, i as listEnabledDiscordAccounts, l as resolveDiscordAccountConfig, o as resolveDefaultDiscordAccountId, r as listDiscordAccountIds, s as resolveDiscordAccount, t as createDiscordActionGate } from "../../accounts-CafjbqFC.js";
import { a as DISCORD_MODAL_CUSTOM_ID_KEY, c as buildDiscordModalCustomId, d as parseDiscordComponentCustomId, f as parseDiscordComponentCustomIdForInteraction, i as DISCORD_COMPONENT_CUSTOM_ID_KEY, m as parseDiscordModalCustomIdForInteraction, p as parseDiscordModalCustomId, s as buildDiscordComponentCustomId, t as buildDiscordInteractiveComponents } from "../../shared-interactive-BupIDjee.js";
import { a as buildDiscordComponentMessageFlags, c as resolveDiscordComponentAttachmentName, i as buildDiscordComponentMessage, n as DiscordFormModal, o as DISCORD_COMPONENT_ATTACHMENT_PREFIX, r as createDiscordFormModal, s as readDiscordComponentSpec, t as formatDiscordComponentEventText } from "../../components-j6xvqpjw.js";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "../../api-DwRE6QOm2.js";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "../../target-parsing-D0nvF4Pn.js";
import { i as normalizeDiscordOutboundTarget, n as looksLikeDiscordTargetId, r as normalizeDiscordMessagingTarget } from "../../normalize-fLlrnMmq.js";
import { n as resolveDiscordTarget, r as parseDiscordSendTarget } from "../../target-resolver-CEz-dVXP.js";
import { t as inspectDiscordAccount } from "../../account-inspect-DSo9M8l6.js";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "../../timeouts-BTHN67kZ.js";
import "../../targets-CffO_Tes.js";
import { i as shouldSuppressLocalDiscordExecApprovalPrompt, n as isDiscordExecApprovalApprover, r as isDiscordExecApprovalClientEnabled, t as getDiscordExecApprovalApprovers } from "../../exec-approvals-Bv3ZM_Ag.js";
import { i as resolveDiscordGroupToolPolicy, n as collectDiscordStatusIssues, r as resolveDiscordGroupRequireMention, t as discordPlugin } from "../../channel-BR_dXteP.js";
import { t as normalizeExplicitDiscordSessionKey } from "../../session-key-normalization-ClNnKMs4.js";
import { t as discordSetupPlugin } from "../../channel.setup-7vvddrEP.js";
import { n as handleDiscordSubagentEnded, r as handleDiscordSubagentSpawning, t as handleDiscordSubagentDeliveryTarget } from "../../subagent-hooks-Blpihgaz.js";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "../../handle-action.guild-admin-CrClIzsa.js";
import { n as listDiscordDirectoryPeersFromConfig, t as listDiscordDirectoryGroupsFromConfig } from "../../directory-config-Dby6vAhM.js";
import { t as fetchPluralKitMessageInfo } from "../../pluralkit-DldNNlqO.js";
import { i as probeDiscord, n as fetchDiscordApplicationSummary, o as resolveDiscordPrivilegedIntentsFromFlags, r as parseApplicationIdFromToken, t as fetchDiscordApplicationId } from "../../probe-Ch0LHMK9.js";
import { t as collectDiscordSecurityAuditFindings } from "../../security-audit-C_HaG9BT.js";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("../../channel-actions.runtime-r2h0THxN.js")).handleDiscordMessageAction(...args);
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
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentEnded, handleDiscordSubagentSpawning, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
