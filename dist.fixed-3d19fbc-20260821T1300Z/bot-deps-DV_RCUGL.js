import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-CP6yKwU3.js";
import { a as enqueueSystemEvent } from "./system-events-DecgSLEt.js";
import { n as loadWebMedia } from "./web-media-DRJtrLMa.js";
import { c as readAmbientTranscriptWatermark, l as readSessionUpdatedAt, m as resolveStorePath, r as getSessionEntry, y as resolveAmbientTranscriptWatermarkKey } from "./session-store-runtime-De3jWY_Z.js";
import { o as resolveInboundLastRouteSessionKey } from "./resolve-route-Dz19j5-0.js";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-C0uxEJYi.js";
import "./routing-CERGQFBr.js";
import "./security-runtime-fAO34zGh.js";
import { r as buildChannelInboundEventContext } from "./run-channel-turn-RWr0qaKO.js";
import { t as recordInboundSession } from "./session-CgCdqcVt.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-TvT8xyuy.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-CwP5wxfq.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-CcbJKXAJ.js";
import "./approval-gateway-runtime-3ii5FzIG.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-N-cOAiJm.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-C0SQK-CC.js";
import "./channel-inbound-tRRtLmIr.js";
import "./web-media-BtTeEG1w.js";
import "./system-event-runtime-OWc-9LlT.js";
import "./runtime-config-snapshot-D2wEj--P.js";
import "./conversation-runtime-CfwcNjq1.js";
import { t as buildModelsProviderData } from "./commands-models-9w3BldbS.js";
import "./models-provider-runtime-BOkhDZ2u.js";
import "./skill-commands-runtime-DLWPVkGw.js";
import { E as editMessageTelegram, et as wasSentByBot, tt as recordOutboundMessageForPromptContext } from "./send-BOEoBdMU.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-D_-qCOLN.js";
import { n as emitTelegramMessageSentHooks, t as deliverReplies } from "./delivery-uDa2988Q.js";
import { t as createTelegramDraftStream } from "./draft-stream-DzDepcgW.js";
//#region extensions/telegram/src/bot-deps.ts
const defaultTelegramBotDeps = {
	get getRuntimeConfig() {
		return getRuntimeConfig;
	},
	get resolveStorePath() {
		return resolveStorePath;
	},
	get getSessionEntry() {
		return getSessionEntry;
	},
	get readChannelAllowFromStore() {
		return readChannelAllowFromStore;
	},
	get readSessionUpdatedAt() {
		return readSessionUpdatedAt;
	},
	get readAmbientTranscriptWatermark() {
		return readAmbientTranscriptWatermark;
	},
	get resolveAmbientTranscriptWatermarkKey() {
		return resolveAmbientTranscriptWatermarkKey;
	},
	get recordInboundSession() {
		return recordInboundSession;
	},
	get recordChannelActivity() {
		return recordChannelActivity;
	},
	get resolveInboundLastRouteSessionKey() {
		return resolveInboundLastRouteSessionKey;
	},
	get resolvePinnedMainDmOwnerFromAllowlist() {
		return resolvePinnedMainDmOwnerFromAllowlist;
	},
	get buildChannelInboundEventContext() {
		return buildChannelInboundEventContext;
	},
	get upsertChannelPairingRequest() {
		return upsertChannelPairingRequest;
	},
	get enqueueSystemEvent() {
		return enqueueSystemEvent;
	},
	get dispatchReplyWithBufferedBlockDispatcher() {
		return dispatchReplyWithBufferedBlockDispatcher;
	},
	get loadWebMedia() {
		return loadWebMedia;
	},
	get buildModelsProviderData() {
		return buildModelsProviderData;
	},
	get listSkillCommandsForAgents() {
		return listSkillCommandsForAgents;
	},
	get syncTelegramMenuCommands() {
		return syncTelegramMenuCommands;
	},
	get wasSentByBot() {
		return wasSentByBot;
	},
	get resolveApproval() {
		return resolveApprovalOverGateway;
	},
	get createTelegramDraftStream() {
		return createTelegramDraftStream;
	},
	get deliverReplies() {
		return deliverReplies;
	},
	get deliverInboundReplyWithMessageSendContext() {
		return deliverInboundReplyWithMessageSendContext;
	},
	get emitTelegramMessageSentHooks() {
		return emitTelegramMessageSentHooks;
	},
	get editMessageTelegram() {
		return editMessageTelegram;
	},
	get recordOutboundMessageForPromptContext() {
		return recordOutboundMessageForPromptContext;
	},
	get createChannelMessageReplyPipeline() {
		return createChannelReplyPipeline;
	}
};
//#endregion
export { defaultTelegramBotDeps as t };
