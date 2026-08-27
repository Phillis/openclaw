import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-CEvoxZOx.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { n as loadWebMedia } from "./web-media-Dk8VJTPc.js";
import { c as readAmbientTranscriptWatermark, l as readSessionUpdatedAt, m as resolveStorePath, r as getSessionEntry, y as resolveAmbientTranscriptWatermarkKey } from "./session-store-runtime-BsqwEEwm.js";
import { o as resolveInboundLastRouteSessionKey } from "./resolve-route-CUq-ePT_.js";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-DqJhfdto.js";
import "./routing-DG_rmd7A.js";
import "./security-runtime-Bm9RUgAZ.js";
import { r as buildChannelInboundEventContext } from "./run-channel-turn-DAz9V1-z.js";
import { t as recordInboundSession } from "./session-CApmOK5h.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-DJ0SqAqU.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-L1ejw2gC.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-C3YRDMi0.js";
import "./approval-gateway-runtime-BVpJGZ_B.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-DFUizwTs.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-DZi2XRk2.js";
import "./channel-inbound-BNkCsISu.js";
import "./web-media-C_Sfgi4B.js";
import "./system-event-runtime-C8UpxWZo.js";
import "./runtime-config-snapshot-HfaoynDJ.js";
import "./conversation-runtime-CodUKCtR.js";
import { t as buildModelsProviderData } from "./commands-models-DqzZwAja.js";
import "./models-provider-runtime-lzDaK52R.js";
import "./skill-commands-runtime-15QcbodI.js";
import { E as editMessageTelegram, et as wasSentByBot, tt as recordOutboundMessageForPromptContext } from "./send-6bnUJ0aR.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu--urrpCMU.js";
import { n as emitTelegramMessageSentHooks, t as deliverReplies } from "./delivery-3phbZSn0.js";
import { t as createTelegramDraftStream } from "./draft-stream-CDKwT01E.js";
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
