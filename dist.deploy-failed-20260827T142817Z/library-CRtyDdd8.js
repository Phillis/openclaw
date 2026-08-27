import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeE164 } from "./utils-DEqefz4f.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { i as loadConfig } from "./io-D1h6pxaD.js";
import "./config-CW-q_d35.js";
import { i as handlePortError, n as describePortOwner, r as ensurePortAvailable, t as PortInUseError } from "./ports-DGhqGvd9.js";
import { n as resolveSessionKey, t as deriveSessionKey } from "./session-key-B8nsvliu.js";
import { t as applyTemplate } from "./templating-CLmjS51i.js";
import { r as saveLegacySessionStore, t as loadLegacySessionStore } from "./state-migrations.legacy-session-store-Cb9sBdkB.js";
import { t as createDefaultDeps } from "./deps-24ucZA7X.js";
//#region src/cli/wait.ts
function waitForever() {
	setInterval(() => {}, 1e6);
	return new Promise(() => {});
}
//#endregion
//#region src/library.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("./reply.runtime.js"));
const loadPromptRuntime = createLazyRuntimeModule(() => import("./prompt-CJf0HRd8.js"));
const loadBinariesRuntime = createLazyRuntimeModule(() => import("./binaries-C_e35urS.js"));
const loadExecRuntime = createLazyRuntimeModule(() => import("./exec-s6dAX9VK.js"));
const loadWebChannelRuntime = createLazyRuntimeModule(() => import("./runtime-web-channel-plugin-BPEnGgZH.js"));
const getReplyFromConfig = async (...args) => (await loadReplyRuntime()).getReplyFromConfig(...args);
const promptYesNo = async (...args) => (await loadPromptRuntime()).promptYesNo(...args);
const ensureBinary = async (...args) => (await loadBinariesRuntime()).ensureBinary(...args);
const runExec = async (...args) => (await loadExecRuntime()).runExec(...args);
const runCommandWithTimeout = async (...args) => (await loadExecRuntime()).runCommandWithTimeout(...args);
const monitorWebChannel = async (...args) => (await loadWebChannelRuntime()).monitorWebChannel(...args);
/**
* @deprecated Legacy sessions.json compatibility for package-root consumers.
* Use SQLite-backed session APIs. Remove after 2026-10-12, once the v2026.7.x
* upgrade window no longer requires the legacy doctor importer.
*/
async function saveSessionStore(storePath, store, options) {
	await saveLegacySessionStore(storePath, store, options);
}
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadLegacySessionStore as loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveSessionStorePathCore as resolveStorePath, runCommandWithTimeout, runExec, saveSessionStore, waitForever };
