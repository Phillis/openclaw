import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as info, t as danger } from "./globals-CAwGc4B6.js";
import { n as runCommandWithRuntime } from "./cli-utils-NPN0egNa.js";
import { r as resolveBrowserConfig } from "./config-UUh1etbS.js";
import { t as ensureExtensionRelayToken } from "./relay-auth-Cwei20kM.js";
import { a as resolveChromeExtensionLoadPath, n as installChromeExtensionBootstrap, o as uninstallChromeExtensionNativeHosts, r as normalizeExtensionInstallWaitMs, t as browserExtensionStatus } from "./extension-install-5EuOnKQs.js";
import { t as buildBrowserExtensionPairing } from "./extension-pairing-uSWQLip4.js";
import "./core-api-BP8tuv9T.js";
import { m as relayKeyIdFromHex, n as BROWSER_RELAY_AUTH_COMPLETE_PATH, p as BROWSER_RELAY_AUTH_LABEL, t as BROWSER_RELAY_AUTH_CHALLENGE_PATH } from "./auth-v2-Bg7Y5-gQ.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region extensions/browser/src/cli/browser-cli-extension.ts
/**
* `openclaw browser extension` CLI: install the unpacked Chrome extension,
* register its native bootstrap host, and retain advanced manual pairing.
*/
/** Absolute path to the bundled unpacked Chrome extension directory. */
function resolveChromeExtensionDir(pluginRoot) {
	if (pluginRoot) return path.join(pluginRoot, "chrome-extension");
	const here = path.dirname(fileURLToPath(import.meta.url));
	return path.resolve(here, "..", "..", "chrome-extension");
}
function resolveBrowserPluginRoot(pluginRoot) {
	return pluginRoot ?? path.resolve(resolveChromeExtensionDir(), "..");
}
function firstExtensionProfile(resolved) {
	for (const [name, profile] of Object.entries(resolved.profiles)) if (profile.driver === "extension") return {
		name,
		relayPort: profile.cdpPort ?? resolved.extensionRelayPorts[name] ?? resolved.extensionRelayDefaultPort
	};
	return null;
}
async function buildPairingString(gatewayUrl) {
	const result = await buildBrowserExtensionPairing({
		cfg: getRuntimeConfig(),
		gatewayUrl
	});
	return {
		pairing: result.pairingString,
		relayPort: result.relayPort,
		remote: result.topology === "direct-remote"
	};
}
/** Resolve safe v2 metadata, with an explicit gated legacy credential escape hatch. */
async function buildCdpEndpoint(options) {
	const cfg = getRuntimeConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const token = await ensureExtensionRelayToken();
	const relayPort = firstExtensionProfile(resolved)?.relayPort ?? resolved.extensionRelayDefaultPort;
	const browserUrl = `http://127.0.0.1:${relayPort}`;
	const metadata = {
		browserUrl,
		wsEndpoint: `ws://127.0.0.1:${relayPort}/cdp`,
		auth: {
			label: BROWSER_RELAY_AUTH_LABEL,
			version: 2,
			keyId: relayKeyIdFromHex(token),
			challengeUrl: new URL(BROWSER_RELAY_AUTH_CHALLENGE_PATH, browserUrl).toString(),
			completeUrl: new URL(BROWSER_RELAY_AUTH_COMPLETE_PATH, browserUrl).toString(),
			role: "cdp",
			transport: "connection",
			method: "SEQUENCE",
			resource: "/json/version -> /cdp",
			flow: "cdp"
		}
	};
	if (!options.legacyBearer) return metadata;
	if (!resolved.extensionRelay.allowLegacyAuth) throw new Error("Legacy browser relay auth is disabled; remove --legacy-bearer and use Browser Relay Authentication v2.");
	return {
		...metadata,
		headers: { Authorization: `Bearer ${token}` }
	};
}
/** Register `openclaw browser extension` lifecycle and compatibility commands. */
function registerBrowserExtensionCommands(browser, _parentOpts, pluginRoot) {
	const extension = browser.command("extension").description("Install and inspect the OpenClaw Chrome extension bootstrap");
	extension.command("path").description("Print the unpacked Chrome extension directory (Load unpacked)").action(async () => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			defaultRuntime.log(await resolveChromeExtensionLoadPath(resolveChromeExtensionDir(pluginRoot)));
		});
	});
	extension.command("install").description("Install the stable extension copy and register its native bootstrap host").option("--json", "Print a machine-readable status report").option("--wait-ms <ms>", "How long to wait after pre-registration for Chrome to verify the unpacked extension", String(3e4)).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const waitMs = normalizeExtensionInstallWaitMs(opts.waitMs);
			const bundledDir = resolveChromeExtensionDir(pluginRoot);
			if (opts.json !== true) defaultRuntime.log(info("Preparing the OpenClaw Chrome extension. Keep Chrome running…"));
			const status = await installChromeExtensionBootstrap({
				bundledDir,
				pluginRoot: resolveBrowserPluginRoot(pluginRoot),
				waitMs,
				onProgress: opts.json === true ? void 0 : (message) => defaultRuntime.log(info(message))
			});
			if (opts.json === true) defaultRuntime.writeJson(status);
			else {
				for (const issue of status.issues) defaultRuntime.error(theme.warn(issue));
				defaultRuntime.log(status.manualSetupRequired ? theme.warn(status.platformSupport === "manual_required" ? "Automatic native bootstrap is not supported on this platform; use Settings for manual pairing." : "Automatic setup was not verified. Keep Chrome running, rerun install, and use Load unpacked only after the command says native bootstrap is ready. If this extension already attempted setup before the host existed, restart Chrome once before retrying.") : info(`Native host and deterministic extension identity verified for ${status.discovered.length} profile registration(s). The extension connects automatically.`));
			}
			if (status.manualSetupRequired) defaultRuntime.exit(1);
		}, (err) => {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		});
	});
	extension.command("status").description("Inspect extension copies, Chrome IDs, and native-host registrations").option("--json", "Print a machine-readable status report").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const status = await browserExtensionStatus({ bundledDir: resolveChromeExtensionDir(pluginRoot) });
			if (opts.json === true) {
				defaultRuntime.writeJson(status);
				return;
			}
			defaultRuntime.log([
				`Extension copy: ${status.installedCopy.owned ? "installed" : "bundled fallback"}`,
				`Load unpacked:  ${status.installedCopy.owned ? status.installedCopy.path : status.bundledPath}`,
				`Chrome IDs:     ${status.discovered.length > 0 ? status.discovered.map((entry) => `${entry.extensionId} (${entry.browser}/${entry.profile})`).join(", ") : "none detected"}`,
				`Native hosts:   ${status.registrations.filter((entry) => entry.state === "owned").length} owned`,
				`Setup:          ${status.manualSetupRequired ? "manual action required" : "automatic bootstrap ready"}`
			].join("\n"));
		});
	});
	extension.command("uninstall-host").description("Remove only OpenClaw-owned Chrome native-host registrations").option("--json", "Print a machine-readable removal report").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await uninstallChromeExtensionNativeHosts();
			if (opts.json === true) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.log(result.manualRequired ? theme.warn("Windows native-host removal is manual; no registry key was changed.") : info(`Removed ${result.removed.length} owned native-host artifact(s).`));
			for (const refused of result.refused) defaultRuntime.error(theme.warn(`Refused foreign registration: ${refused}`));
		});
	});
	extension.command("pair").description("Print an advanced manual pairing string").option("--json", "Print the pairing string as JSON").option("--gateway-url <url>", "Print a remote pairing string for a Chrome on another machine (e.g. wss://gateway.example.com)").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await buildPairingString(opts.gatewayUrl);
			if (opts.json === true) {
				defaultRuntime.writeJson({
					pairingString: result.pairing,
					relayPort: result.relayPort,
					remote: result.remote
				});
				return;
			}
			const setupLine = result.remote ? info("Remote pairing: load and pair the extension on the machine running Chrome; it connects to this gateway over wss://.") : info("Run this on the machine that hosts the browser (gateway host or browser node).");
			defaultRuntime.log([
				setupLine,
				info("1. Load the extension: chrome://extensions → Developer mode → Load unpacked →"),
				`   ${resolveChromeExtensionDir(pluginRoot)}`,
				info("2. Open the OpenClaw popup and paste this pairing string:"),
				"",
				theme.heading(result.pairing),
				"",
				info("The relay key is a host-local secret; keep it private.")
			].join("\n"));
		}, (err) => {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		});
	});
	extension.command("cdp").description("Print non-secret Browser Relay Authentication v2 CDP metadata").option("--json", "Print the endpoint as JSON").option("--legacy-bearer", "Print the legacy Bearer header while browser.extensionRelay.allowLegacyAuth is enabled").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const legacyBearer = opts.legacyBearer === true;
			const endpoint = await buildCdpEndpoint({ legacyBearer });
			if (legacyBearer) defaultRuntime.error(theme.warn("Warning: --legacy-bearer reveals the relay key in an authorization header. Migrate this client to Browser Relay Authentication v2."));
			if (opts.json === true) {
				defaultRuntime.writeJson(endpoint);
				return;
			}
			const lines = [
				info("Relay CDP endpoint (pair the extension first):"),
				`browserUrl: ${endpoint.browserUrl}`,
				`wsEndpoint: ${endpoint.wsEndpoint}`,
				`auth:       ${endpoint.auth.label} v${endpoint.auth.version}`,
				`keyId:      ${endpoint.auth.keyId}`,
				`challenge:  POST ${endpoint.auth.challengeUrl}`,
				`complete:   POST ${endpoint.auth.completeUrl}`,
				`sequence:   ${endpoint.auth.resource}`
			];
			if (endpoint.headers) lines.push(`legacy:     Authorization: ${endpoint.headers.Authorization}`);
			else lines.push("", info("No relay key or authorization header is printed."));
			defaultRuntime.log(lines.join("\n"));
		}, (err) => {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		});
	});
}
//#endregion
export { registerBrowserExtensionCommands };
