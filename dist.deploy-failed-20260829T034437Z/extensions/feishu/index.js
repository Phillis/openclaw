import { r as loadBundledEntryExportSync, t as defineBundledChannelEntry } from "../../channel-entry-contract-DmYo-ZOH.js";
import { t as registerFeishuSubagentHooks } from "../../subagent-hooks-api-CvsiyrCx.js";
//#region extensions/feishu/index.ts
var feishu_default = defineBundledChannelEntry({
	id: "feishu",
	name: "Feishu",
	description: "Feishu/Lark channel plugin",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "feishuPlugin"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: "./runtime-api.js",
		exportName: "setFeishuRuntime"
	},
	registerFull(api) {
		registerFeishuSubagentHooks(api);
		for (const exportName of [
			"registerFeishuDocTools",
			"registerFeishuChatTools",
			"registerFeishuWikiTools",
			"registerFeishuDriveTools",
			"registerFeishuPermTools",
			"registerFeishuBitableTools"
		]) loadBundledEntryExportSync(import.meta.url, {
			specifier: "./api.js",
			exportName
		})(api);
	}
});
//#endregion
export { feishu_default as default };
