import { i as resolveSignalAccount, n as listSignalAccountIds, r as resolveDefaultSignalAccountId, t as listEnabledSignalAccounts } from "./accounts-DO4HMqaK.js";
import { n as normalizeSignalMessagingTarget, t as looksLikeSignalTargetId } from "./normalize-l_b99hap.js";
import { a as normalizeSignalAllowRecipient, c as resolveSignalSender, i as isSignalSenderAllowed, l as looksLikeUuid, n as formatSignalSenderDisplay, o as resolveSignalPeerId, r as formatSignalSenderId, s as resolveSignalRecipient, t as formatSignalPairingIdLine } from "./identity-YXPmgFMu.js";
import { c as resolveSignalReactionLevel, d as markdownToSignalTextChunks, s as signalMessageActions, t as detectSignalTransport, u as markdownToSignalText } from "./transport-detection-BoKa3jTK.js";
import { n as sendReactionSignal, t as removeReactionSignal } from "./reaction-runtime-api-Ch0dk2sh.js";
import { a as normalizeSignalAccountInput, d as probeSignalTransport, f as writeSignalAccountTransport, l as signalSetupContract, n as createSignalPluginBase, p as resolveSignalOutboundTarget, r as signalSetupWizard, t as signalPlugin, u as prepareSignalManagedNativeTransport } from "./channel-DsM2X2Pt.js";
import { i as installSignalCli } from "./install-signal-cli-Cpiyk0k1.js";
import { t as monitorSignalProvider } from "./monitor-Dp9vMuuT.js";
import { n as sendReadReceiptSignal, r as sendTypingSignal, t as sendMessageSignal } from "./send-CZhFs2H_.js";
import { t as probeSignal } from "./probe-C1RCC-z3.js";
//#region extensions/signal/src/channel.setup.ts
const signalSetupPlugin = { ...createSignalPluginBase({
	setupWizard: signalSetupWizard,
	setupContract: signalSetupContract
}) };
//#endregion
export { detectSignalTransport, formatSignalPairingIdLine, formatSignalSenderDisplay, formatSignalSenderId, installSignalCli, isSignalSenderAllowed, listEnabledSignalAccounts, listSignalAccountIds, looksLikeSignalTargetId, looksLikeUuid, markdownToSignalText, markdownToSignalTextChunks, monitorSignalProvider, normalizeSignalAccountInput, normalizeSignalAllowRecipient, normalizeSignalMessagingTarget, prepareSignalManagedNativeTransport, probeSignal, probeSignalTransport, removeReactionSignal, resolveDefaultSignalAccountId, resolveSignalAccount, resolveSignalOutboundTarget, resolveSignalPeerId, resolveSignalReactionLevel, resolveSignalRecipient, resolveSignalSender, sendMessageSignal, sendReactionSignal, sendReadReceiptSignal, sendTypingSignal, signalMessageActions, signalPlugin, signalSetupPlugin, writeSignalAccountTransport };
