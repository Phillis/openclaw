import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { s as readChannelAllowFromStore } from "./pairing-store-CwP5wxfq.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-N-cOAiJm.js";
import { r as dispatchChannelInboundTurn } from "./channel-inbound-tRRtLmIr.js";
import "./runtime-config-snapshot-D2wEj--P.js";
import "./conversation-runtime-CfwcNjq1.js";
import "./skill-commands-runtime-DLWPVkGw.js";
import { t as loadTelegramSendModule } from "./send-runtime-CtkPgejY.js";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-D_-qCOLN.js";
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
