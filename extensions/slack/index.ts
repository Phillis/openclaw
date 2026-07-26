// Slack plugin entrypoint registers its OpenClaw integration.
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { registerSlackPluginHttpRoutes } from "./http-routes-api.js";

const loadSlackAccessVerifyRuntime = createLazyRuntimeModule(
  () => import("./access-verify.runtime.js"),
);

export function registerSlackFullRuntime(
  api: Parameters<typeof registerSlackPluginHttpRoutes>[0],
): void {
  registerSlackPluginHttpRoutes(api);
  api.registerGatewayMethod(
    "slack.access.verify",
    async (ctx) => {
      const { handleSlackAccessVerify } = await loadSlackAccessVerifyRuntime();
      await handleSlackAccessVerify(ctx);
    },
    { scope: "operator.read" },
  );
}

export default defineBundledChannelEntry({
  id: "slack",
  name: "Slack",
  description: "Slack channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "slackPlugin",
  },
  secrets: {
    specifier: "./secret-contract-api.js",
    exportName: "channelSecrets",
  },
  runtime: {
    specifier: "./runtime-setter-api.js",
    exportName: "setSlackRuntime",
  },
  accountInspect: {
    specifier: "./account-inspect-api.js",
    exportName: "inspectSlackReadOnlyAccount",
  },
  registerFull: registerSlackFullRuntime,
});
