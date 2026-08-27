import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-vVeKbh9E.js";
import { n as loadWebMedia } from "./web-media-DSbBQ0o1.js";
import { c as readAmbientTranscriptWatermark, l as readSessionUpdatedAt, m as resolveStorePath, r as getSessionEntry, y as resolveAmbientTranscriptWatermarkKey } from "./session-store-runtime-BNwfvw44.js";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-CaHBZG2x.js";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-AwbVZrOd.js";
import "./routing-DM8631ts.js";
import { r as buildChannelInboundEventContext } from "./run-channel-turn-CMWbyBYF.js";
import { t as recordInboundSession } from "./session-BON_pp2B.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-CPb9R2bq.js";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.js";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-CHm2POOL.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-DZwKp22W.js";
import "./approval-gateway-runtime-CSUO9x_v.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-Dcfrq91n.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-9L4L6dJP.js";
import "./channel-inbound-Db8kr_sV.js";
import "./web-media-Cxkh7M6r.js";
import "./system-event-runtime-CjKFC8Vz.js";
import "./runtime-config-snapshot-CZCUfSAV.js";
import "./conversation-runtime-BCniVCys.js";
import "./security-runtime-CYUTzVOk.js";
import { t as buildModelsProviderData } from "./commands-models-V05NGgfu.js";
import "./models-provider-runtime-D33PXCuI.js";
import "./skill-commands-runtime-tTfbLu04.js";
import { B as recordOutboundMessageForPromptContext, b as editMessageTelegram, z as wasSentByBot } from "./send-CG2Pplul.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-CvkJJsMu.js";
import { n as emitTelegramMessageSentHooks, t as deliverReplies } from "./delivery-B9W7RsQo.js";
import { t as createTelegramDraftStream } from "./draft-stream-DWDqIxRy.js";
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
