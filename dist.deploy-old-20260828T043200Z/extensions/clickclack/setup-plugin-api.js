import { g as clickClackMeta, h as clickClackConfigAdapter, n as clickClackSetupContract, p as clickClackConfigSchema, t as clickClackSetupWizard } from "./setup-surface-u7Mgy8Wp.js";
//#region extensions/clickclack/src/channel.setup.ts
const clickClackSetupPlugin = {
	id: "clickclack",
	meta: clickClackMeta,
	capabilities: {
		chatTypes: ["direct", "group"],
		threads: true,
		blockStreaming: true
	},
	reload: { configPrefixes: ["channels.clickclack"] },
	configSchema: clickClackConfigSchema,
	config: clickClackConfigAdapter,
	setupContract: clickClackSetupContract,
	setupWizard: clickClackSetupWizard
};
//#endregion
export { clickClackSetupPlugin };
