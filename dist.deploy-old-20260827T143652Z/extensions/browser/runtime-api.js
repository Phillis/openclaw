import { d as resolveExistingPathsWithinRoot, i as writeExternalFileWithinRoot } from "../../fs-safe-C9N8pCh1.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { n as redactCdpUrl } from "../../browser-config-B_uQJIyR.js";
import { f as DEFAULT_OPENCLAW_BROWSER_COLOR, m as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, r as DEFAULT_AI_SNAPSHOT_MAX_CHARS, s as DEFAULT_BROWSER_EVALUATE_ENABLED } from "../../constants-0X-2im2J.js";
import { a as resolveProfile, c as DEFAULT_UPLOAD_DIR, r as resolveBrowserConfig } from "../../config-ChuJBdOZ.js";
import "../../tmp-openclaw-dir-dS-1ArW-.js";
import { n as resolveBrowserControlAuth, t as ensureBrowserControlAuth } from "../../control-auth-BBJ8Ai-O.js";
import { B as parseBrowserMajorVersion, U as resolveGoogleChromeExecutableForPlatform, V as readBrowserVersion } from "../../chrome-COUNz8dw.js";
import { t as getBrowserProfileCapabilities } from "../../profile-capabilities-BlUTzZZq.js";
import { t as movePathToTrash } from "../../trash-DbUVw_yo.js";
import { t as createBrowserRouteContext } from "../../server-context-DrhV4-XI.js";
import { _ as browserStatus, a as untrackSessionBrowserTab, b as browserTabAction, c as browserDeleteProfile, f as browserOpenTab, g as browserStart, h as browserSnapshot, i as trackSessionBrowserTab, l as browserDoctor, m as browserResetProfile, o as browserCloseTab, p as browserProfiles, s as browserCreateProfile, t as closeTrackedBrowserTabsForSessions, u as browserFocusTab, v as browserStop, x as browserTabs } from "../../session-tab-registry-4FaeH-h4.js";
import { i as createBrowserTool, n as browserHandlers, r as handleBrowserGatewayRequest, t as createBrowserPluginService } from "../../plugin-service-CYpgSEXk.js";
import { a as persistBrowserProxyFiles, c as browserAct, f as browserNavigate, i as applyBrowserProxyPaths, l as browserArmDialog, n as startBrowserBridgeServer, o as browserConsoleMessages, p as browserScreenshotAction, r as stopBrowserBridgeServer, s as browserPdfSave, t as runBrowserProxyCommand, u as browserArmFileChooser } from "../../core-api-DdHktJcQ.js";
import { t as registerBrowserRoutes } from "../../routes-SRWznHFw.js";
import { n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware } from "../../server-middleware-DKf4KCm9.js";
import { c as stopBrowserRuntime, o as createBrowserRuntimeState, r as getBrowserControlState, t as createBrowserControlContext } from "../../browser-control-state-CRclhuSW.js";
import { a as resolveRequestedBrowserProfile, i as normalizeBrowserRequestPath, r as isPersistentBrowserProfileMutation, t as createBrowserRouteDispatcher } from "../../dispatcher-DtnCeEDz.js";
import { c as normalizeBrowserFormFieldValue, s as normalizeBrowserFormField } from "../../snapshot-urls-xkh7aq-p.js";
import { n as stopBrowserControlService, t as startBrowserControlServiceFromConfig } from "../../control-service-CyF1smmu.js";
import { n as closePlaywrightBrowserConnection } from "../../pw-session-BYsQ8sXs.js";
import { t as registerBrowserCli } from "../../browser-cli-DHzSVrQn.js";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { chmod, copyFile } from "node:fs/promises";
//#region extensions/browser/src/attached-browser-tool-runtime.ts
/**
* Attach-only Browser tool runtime for a caller-owned loopback Chrome process.
*
* The bridge owns only authenticated Browser HTTP ingress. Chrome remains owned
* by the caller and survives bridge disposal.
*/
const ATTACHED_PROFILE_NAME = "worker";
async function persistAttachedScreenshot(params) {
	const extension = params.type === "jpeg" ? "jpg" : "png";
	const fileName = `screenshot-${randomBytes(8).toString("hex")}.${extension}`;
	return (await writeExternalFileWithinRoot({
		rootDir: params.workspaceDir,
		path: path.join(".artifacts", "cloud-worker-browser", fileName),
		fallbackFileName: fileName,
		write: async (stagedPath) => {
			await copyFile(params.sourcePath, stagedPath);
			await chmod(stagedPath, 384);
		}
	})).path;
}
function normalizeAttachedCdpUrl(raw) {
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error("Attached Browser CDP URL must be a loopback HTTP URL with an explicit port.");
	}
	const port = Number(parsed.port);
	if (parsed.protocol !== "http:" || parsed.hostname !== "127.0.0.1" || parsed.username !== "" || parsed.password !== "" || parsed.port === "" || !Number.isInteger(port) || port < 1 || port > 65535 || parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "") throw new Error("Attached Browser CDP URL must be a loopback HTTP URL with an explicit port.");
	return parsed.toString().replace(/\/$/u, "");
}
/** Create a normal Browser agent tool pinned to one raw, attach-only CDP profile. */
async function createAttachedBrowserToolRuntime(params) {
	const cdpUrl = normalizeAttachedCdpUrl(params.cdpUrl);
	const resolved = resolveBrowserConfig({
		enabled: true,
		attachOnly: true,
		cdpUrl,
		defaultProfile: ATTACHED_PROFILE_NAME,
		profiles: { [ATTACHED_PROFILE_NAME]: {
			driver: "openclaw",
			attachOnly: true,
			cdpUrl
		} }
	});
	resolved.profiles = { [ATTACHED_PROFILE_NAME]: {
		driver: "openclaw",
		attachOnly: true,
		cdpUrl
	} };
	resolved.extensionRelayPorts = {};
	resolved.extensionRelayInternalTokens = {};
	delete resolved.extensionRelayToken;
	const bridge = await startBrowserBridgeServer({
		resolved,
		host: "127.0.0.1",
		port: 0,
		authToken: randomBytes(32).toString("base64url"),
		onEnsureAttachTarget: async () => await params.ensureAttachTarget()
	});
	const dispose = async () => {
		try {
			await stopBrowserBridgeServer(bridge.server);
		} finally {
			await closePlaywrightBrowserConnection({ cdpUrl });
		}
	};
	try {
		return {
			tool: createBrowserTool({
				sandboxBridgeUrl: bridge.baseUrl,
				allowHostControl: false,
				...params.agentSessionKey !== void 0 ? { agentSessionKey: params.agentSessionKey } : {},
				...params.agentDir !== void 0 ? { agentDir: params.agentDir } : {},
				...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
				screenshotResultMode: "path",
				persistScreenshot: async ({ sourcePath, type }) => await persistAttachedScreenshot({
					sourcePath,
					workspaceDir: params.workspaceDir,
					type
				})
			}),
			dispose
		};
	} catch (error) {
		await dispose();
		throw error;
	}
}
//#endregion
export { DEFAULT_AI_SNAPSHOT_MAX_CHARS, DEFAULT_BROWSER_EVALUATE_ENABLED, DEFAULT_OPENCLAW_BROWSER_COLOR, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, DEFAULT_UPLOAD_DIR, applyBrowserProxyPaths, browserAct, browserArmDialog, browserArmFileChooser, browserCloseTab, browserConsoleMessages, browserCreateProfile, browserDeleteProfile, browserDoctor, browserFocusTab, browserHandlers, browserNavigate, browserOpenTab, browserPdfSave, browserProfiles, browserResetProfile, browserScreenshotAction, browserSnapshot, browserStart, browserStatus, browserStop, browserTabAction, browserTabs, closeTrackedBrowserTabsForSessions, createAttachedBrowserToolRuntime, createBrowserControlContext, createBrowserPluginService, createBrowserRouteContext, createBrowserRouteDispatcher, createBrowserRuntimeState, createBrowserTool, definePluginEntry, ensureBrowserControlAuth, getBrowserControlState, getBrowserProfileCapabilities, handleBrowserGatewayRequest, installBrowserAuthMiddleware, installBrowserCommonMiddleware, isPersistentBrowserProfileMutation, movePathToTrash, normalizeBrowserFormField, normalizeBrowserFormFieldValue, normalizeBrowserRequestPath, parseBrowserMajorVersion, persistBrowserProxyFiles, readBrowserVersion, redactCdpUrl, registerBrowserCli, registerBrowserRoutes, resolveBrowserConfig, resolveBrowserControlAuth, resolveExistingPathsWithinRoot, resolveGoogleChromeExecutableForPlatform, resolveProfile, resolveRequestedBrowserProfile, runBrowserProxyCommand, startBrowserBridgeServer, startBrowserControlServiceFromConfig, stopBrowserBridgeServer, stopBrowserControlService, stopBrowserRuntime, trackSessionBrowserTab, untrackSessionBrowserTab };
