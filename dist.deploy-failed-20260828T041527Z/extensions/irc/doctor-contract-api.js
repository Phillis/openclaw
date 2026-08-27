import { defineChannelAliasMigration } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/irc/doctor-contract-api.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "irc",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingReplacesRoot: true
});
const legacyConfigRules = streamingAliasMigration.legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
	return streamingAliasMigration.normalizeChannelConfig({ cfg });
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
