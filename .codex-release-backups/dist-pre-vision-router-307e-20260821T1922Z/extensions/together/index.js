import { t as defineSingleProviderPluginEntry } from "../../provider-entry-C87pT-oh.js";
import { t as openclaw_plugin_default } from "../../openclaw.plugin-CzE7JkIG.js";
import { n as applyTogetherConfig } from "../../onboard-BGWX2ElQ.js";
import { t as buildTogetherVideoGenerationProvider } from "../../video-generation-provider-Dm0e3zVq.js";
var together_default = defineSingleProviderPluginEntry({
	id: "together",
	name: "Together Provider",
	description: "Bundled Together provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Together",
		docsPath: "/providers/together",
		manifestAuth: { applyConfig: applyTogetherConfig },
		catalog: { liveModelDiscovery: true },
		classifyFailoverReason: ({ errorMessage }) => /\bconcurrency limit\b.*\b(?:breached|reached)\b/i.test(errorMessage) ? "rate_limit" : void 0
	},
	register(api) {
		api.registerVideoGenerationProvider(buildTogetherVideoGenerationProvider());
	}
});
//#endregion
export { together_default as default };
