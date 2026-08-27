import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { s as readChannelAllowFromStore } from "./pairing-store-L1ejw2gC.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-DFUizwTs.js";
import { r as dispatchChannelInboundTurn } from "./channel-inbound-C_BpWedI.js";
import "./runtime-config-snapshot-HfaoynDJ.js";
import "./conversation-runtime-C-lCCwrS.js";
import "./skill-commands-runtime-15QcbodI.js";
import { t as loadTelegramSendModule } from "./send-runtime-Cb8k7MwZ.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu--urrpCMU.js";
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
