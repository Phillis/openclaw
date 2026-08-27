import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { a as enqueueSystemEvent } from "./system-events-B0eLVp5j.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-aGOT1sXi.js";
import { n as loadWebMedia } from "./web-media-CJi3g5iH.js";
import { c as readAmbientTranscriptWatermark, l as readSessionUpdatedAt, m as resolveStorePath, r as getSessionEntry, y as resolveAmbientTranscriptWatermarkKey } from "./session-store-runtime-NOuoTqlj.js";
import { o as resolveInboundLastRouteSessionKey } from "./resolve-route-CUq-ePT_.js";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-C9SzMBWN.js";
import "./routing-DG_rmd7A.js";
import "./security-runtime-B0k67yNr.js";
import { r as buildChannelInboundEventContext } from "./run-channel-turn-Bx6-D0QW.js";
import { t as recordInboundSession } from "./session-DrA6IlwV.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-DZ8TcoFf.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-BmIXp5gX.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-BhcENTil.js";
import "./approval-gateway-runtime-LGxWGloX.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-dA8eNdfr.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-C-xAYkLq.js";
import "./channel-inbound-d8SJMJZS.js";
import "./web-media-DhtaWWmQ.js";
import "./system-event-runtime-Ca1jEmiR.js";
import "./runtime-config-snapshot-BB4KOaGn.js";
import "./conversation-runtime-D-E5kiap.js";
import { t as buildModelsProviderData } from "./commands-models-BLPnwW8S.js";
import "./models-provider-runtime-BbgeJQWw.js";
import "./skill-commands-runtime-0O05vdab.js";
import { E as editMessageTelegram, et as wasSentByBot, tt as recordOutboundMessageForPromptContext } from "./send-OfWBMNtf.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-CGhlm0zJ.js";
import { n as emitTelegramMessageSentHooks, t as deliverReplies } from "./delivery-DdKSgQoX.js";
import { t as createTelegramDraftStream } from "./draft-stream-CQ3LR1LA.js";
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
