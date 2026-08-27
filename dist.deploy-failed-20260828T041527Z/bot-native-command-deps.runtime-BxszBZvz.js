import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { s as readChannelAllowFromStore } from "./pairing-store-DNjQLson.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-BaNyIk3G.js";
import { r as dispatchChannelInboundTurn } from "./channel-inbound-BmDzyYQ4.js";
import "./runtime-config-snapshot-FUsn-9bA.js";
import "./conversation-runtime-DVCtT9bJ.js";
import "./skill-commands-runtime-DNtI8-iC.js";
import { t as loadTelegramSendModule } from "./send-runtime-BAMVGIgY.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-DqM04cME.js";
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
