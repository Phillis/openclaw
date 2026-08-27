import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { s as readChannelAllowFromStore } from "./pairing-store-BmIXp5gX.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-dA8eNdfr.js";
import { r as dispatchChannelInboundTurn } from "./channel-inbound-d8SJMJZS.js";
import "./runtime-config-snapshot-BB4KOaGn.js";
import "./conversation-runtime-D-E5kiap.js";
import "./skill-commands-runtime-0O05vdab.js";
import { t as loadTelegramSendModule } from "./send-runtime-IlG_VLAy.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-CGhlm0zJ.js";
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
