import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { s as readChannelAllowFromStore } from "./pairing-store-CHm2POOL.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-Dcfrq91n.js";
import { r as dispatchChannelInboundTurn } from "./channel-inbound-BllqRtTK.js";
import "./runtime-config-snapshot-CZCUfSAV.js";
import "./conversation-runtime-CNL8Afdg.js";
import "./skill-commands-runtime-tTfbLu04.js";
import { t as loadTelegramSendModule } from "./send-runtime-CdTDND9_.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-CvkJJsMu.js";
//#region extensions/telegram/src/bot-native-command-deps.runtime.ts
const defaultTelegramNativeCommandDeps = {
	get getRuntimeConfig() {
		return getRuntimeConfig;
	},
	get readChannelAllowFromStore() {
		return readChannelAllowFromStore;
	},
	get dispatchChannelInboundTurn() {
		return dispatchChannelInboundTurn;
	},
	get listSkillCommandsForAgents() {
		return listSkillCommandsForAgents;
	},
	get syncTelegramMenuCommands() {
		return syncTelegramMenuCommands;
	},
	async runModelsAuthLoginFlow(opts) {
		const { runModelsAuthLoginFlow } = await import("./plugin-sdk/provider-auth-login-flow-runtime.js");
		return await runModelsAuthLoginFlow(opts);
	},
	async editMessageTelegram(...args) {
		const { editMessageTelegram } = await loadTelegramSendModule();
		return await editMessageTelegram(...args);
	},
	async sendMessageTelegram(...args) {
		const { sendMessageTelegram } = await loadTelegramSendModule();
		return await sendMessageTelegram(...args);
	}
};
//#endregion
export { defaultTelegramNativeCommandDeps as t };
