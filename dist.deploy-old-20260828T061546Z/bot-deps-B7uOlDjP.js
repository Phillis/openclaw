import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-DO-F9-0m.js";
import { n as loadWebMedia } from "./web-media-CUWAcYnl.js";
import { c as readAmbientTranscriptWatermark, l as readSessionUpdatedAt, m as resolveStorePath, r as getSessionEntry, y as resolveAmbientTranscriptWatermarkKey } from "./session-store-runtime-ZfR7yV2q.js";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-CaHBZG2x.js";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-5Uqxw7WI.js";
import "./routing-DM8631ts.js";
import { r as buildChannelInboundEventContext } from "./run-channel-turn-CVly42eY.js";
import { t as recordInboundSession } from "./session-34EfLyjk.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-Ct2HR2BF.js";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.js";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-DNjQLson.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-B8vDEFnr.js";
import "./approval-gateway-runtime-DelVRdGm.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-BaNyIk3G.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-DV2Qvx-t.js";
import "./channel-inbound-BmDzyYQ4.js";
import "./web-media-Bv-g2Q23.js";
import "./system-event-runtime-DR8oiLor.js";
import "./runtime-config-snapshot-FUsn-9bA.js";
import "./conversation-runtime-DVCtT9bJ.js";
import "./security-runtime-qrFVi6LG.js";
import { t as buildModelsProviderData } from "./commands-models-h5b_qhwI.js";
import "./models-provider-runtime-BuS04h_K.js";
import "./skill-commands-runtime-DNtI8-iC.js";
import { B as recordOutboundMessageForPromptContext, b as editMessageTelegram, z as wasSentByBot } from "./send-B3vmt1UE.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-DqM04cME.js";
import { n as emitTelegramMessageSentHooks, t as deliverReplies } from "./delivery-_qsN6cBd.js";
import { t as createTelegramDraftStream } from "./draft-stream-BgKZRfK6.js";
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
