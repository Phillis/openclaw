import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-_cgCYAPa.js";
import { n as hasBundledChannelPackageState } from "./package-state-probes-svezGy7i.js";
import { r as resolveChannelConfigRecord, t as hasMeaningfulChannelConfigShallow } from "./channel-configured-shared-D-E7LjSj.js";
//#region src/config/channel-configured.ts
/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
function isChannelConfigured(cfg, channelId, env = process.env) {
	if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId))) return true;
	if (hasBundledChannelPackageState({
		metadataKey: "configuredState",
		channelId,
		cfg,
		env
	})) return true;
	const plugin = getBootstrapChannelPlugin(channelId);
	return Boolean(plugin?.config?.hasConfiguredState?.({
		cfg,
		env
	}));
}
//#endregion
export { isChannelConfigured as t };
