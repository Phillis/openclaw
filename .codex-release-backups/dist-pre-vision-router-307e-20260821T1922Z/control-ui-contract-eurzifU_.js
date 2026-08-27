//#region src/gateway/control-ui-contract.ts
/** HTTP path for the Control UI bootstrap config payload. */
const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/control-ui-config.json";
/** Fragment marker selecting the host-authorized browser-owner bootstrap profile. */
const CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM = "bootstrapProfile";
const CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT = "owner";
/** Authenticated same-origin prefix for plugin manifest/catalog icon bytes. */
const CONTROL_UI_PLUGIN_ICON_PATH_PREFIX = "/__openclaw__/plugin-icon";
/** Authenticated same-origin prefix for allowlisted catalog icon bytes. */
const CONTROL_UI_CATALOG_ICON_PATH_PREFIX = "/__openclaw__/catalog-icon";
/** Authenticated same-origin prefix for a session workspace's own project icon. */
const CONTROL_UI_WORKSPACE_ICON_PATH_PREFIX = "/__openclaw__/workspace-icon";
/** Lifetime shared by server-minted plugin-tab grants and parent-side renewal. */
const CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS = 300 * 1e3;
/** Targeted pushed PR snapshot event for subscribed Control UI connections. */
const CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT = "controlUi.sessionPullRequests.changed";
/** Reserved query key for the sandbox cookie capability probe. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY = "__openclaw_plugin_frame_auth_probe";
/** Exact parent origin that may receive the successful probe message. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY = "__openclaw_plugin_frame_auth_origin";
/** Message emitted only by a successful sandbox cookie capability probe. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE = "openclaw-plugin-frame-auth-probe";
/** Extracts the same-origin route pathname from a tab descriptor URL. */
function resolveControlUiPluginTabPathname(path) {
	try {
		const baseUrl = new URL("http://openclaw.invalid");
		const tabUrl = new URL(path, baseUrl);
		return tabUrl.origin === baseUrl.origin ? tabUrl.pathname : void 0;
	} catch {
		return;
	}
}
/** Carries the gateway-configured Control UI mount path into browser bootstrap. */
const CONTROL_UI_BASE_PATH_ATTRIBUTE = "data-openclaw-control-ui-base-path";
/** Marks whether the served document CSP permits the terminal WASM runtime. */
const CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE = "data-openclaw-terminal-enabled";
//#endregion
export { CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT as a, CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY as c, CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT as d, CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE as f, CONTROL_UI_CATALOG_ICON_PATH_PREFIX as i, CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY as l, resolveControlUiPluginTabPathname as m, CONTROL_UI_BOOTSTRAP_CONFIG_PATH as n, CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS as o, CONTROL_UI_WORKSPACE_ICON_PATH_PREFIX as p, CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM as r, CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE as s, CONTROL_UI_BASE_PATH_ATTRIBUTE as t, CONTROL_UI_PLUGIN_ICON_PATH_PREFIX as u };
