import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { D as resolveExpiresAtMsFromDurationMs, b as parseFiniteNumber, g as isFutureDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { h as sanitizeUntrustedFileName } from "./fs-safe-C9N8pCh1.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as SsrFBlockedError } from "./ssrf-UFPP-fbI.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { n as rawDataToString } from "./ws-C3ckvj65.js";
import "./webhook-ingress-h_3NGYrN.js";
import { o as DEFAULT_DOWNLOAD_DIR } from "./config-DqhZ9eIx.js";
import { A as withCdpSocket, B as PLAYWRIGHT_TARGET_INFO_TIMEOUT_MS, G as withManagedProxyForCdpUrl, J as stripCdpUrlCredentials, K as withNoProxyForCdpUrl, M as playwrightCore, a as fetchJson, c as isWebSocketUrl, f as scopeCdpPolicyToConfiguredEndpoint, k as openCdpWebSocket, l as normalizeCdpHttpBaseForJsonEndpoints, n as assertCdpEndpointAllowed, q as getHeadersWithAuth, t as appendCdpPath, u as redactCdpErrorText, w as BrowserTabNotFoundError } from "./tmp-openclaw-dir-CQvAbCRW.js";
import "./errors-DVJFzD7N.js";
import { A as InvalidBrowserNavigationUrlError, I as withBrowserNavigationPolicy, L as readCdpMainFrameDocumentIdentity, M as assertBrowserNavigationRedirectChainAllowed, N as assertBrowserNavigationResultAllowed, j as assertBrowserNavigationAllowed, n as getChromeWebSocketEndpoint, p as AX_REF_PATTERN, v as normalizeCdpWsUrl } from "./chrome-CerjrCF5.js";
import { t as writeExternalFileWithinOutputRoot } from "./output-files-BU9Z2d3u.js";
import crypto from "node:crypto";
import path from "node:path";
import WebSocket$1 from "ws";
//#region extensions/browser/src/browser/pw-session-contracts.ts
/** Raised when an action is blocked by an observed modal dialog. */
var BrowserObservedDialogBlockedError = class extends Error {
	constructor(browserState) {
		super("Browser action blocked by a modal dialog.");
		this.name = "BrowserObservedDialogBlockedError";
		this.browserState = browserState;
	}
};
/** Type guard for observed-dialog blocked errors. */
function isBrowserObservedDialogBlockedError(err) {
	return err instanceof BrowserObservedDialogBlockedError;
}
const pageStates = /* @__PURE__ */ new WeakMap();
const contextStates = /* @__PURE__ */ new WeakMap();
const observedContexts = /* @__PURE__ */ new WeakSet();
const observedPages = /* @__PURE__ */ new WeakSet();
const cachedByCdpUrl = /* @__PURE__ */ new Map();
const connectingByCdpUrl = /* @__PURE__ */ new Map();
const retainedClosingByCdpUrl = /* @__PURE__ */ new Map();
const closeConnectionPromises = /* @__PURE__ */ new WeakMap();
const closedConnections = /* @__PURE__ */ new WeakSet();
const PLAYWRIGHT_CONNECTION_CLOSE_TIMEOUT_MS = 2e3;
const blockedTargetsByCdpUrl = /* @__PURE__ */ new Set();
const blockedPageRefsByCdpUrl = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/browser/src/browser/pw-download-capture.ts
/** Shared Playwright download capture and output handling. */
function buildManagedDownloadPath(rootDir, fileName) {
	const id = crypto.randomUUID();
	const safeName = sanitizeUntrustedFileName(fileName, "download.bin");
	return path.join(rootDir, `${id}-${safeName}`);
}
/** Validate metadata and atomically save one Playwright download. */
async function saveBrowserDownload(download, opts = {}) {
	const suggestedFilename = download.suggestedFilename?.() || "download.bin";
	const candidate = {
		url: download.url?.() || "",
		suggestedFilename
	};
	await opts.beforeSave?.(candidate);
	const saveAs = download.saveAs?.bind(download);
	if (!saveAs) throw new Error("Download cannot be saved");
	const requestedPath = opts.outputPath?.trim();
	const implicitRoot = opts.outputRoot ?? DEFAULT_DOWNLOAD_DIR;
	const managedPath = requestedPath || buildManagedDownloadPath(implicitRoot, suggestedFilename);
	const savedPath = await writeExternalFileWithinOutputRoot({
		rootDir: requestedPath ? opts.outputRoot : implicitRoot,
		path: managedPath,
		write: async (tempPath) => {
			await saveAs(tempPath);
		}
	});
	return {
		...candidate,
		path: savedPath
	};
}
/** Arm one page download while maintaining explicit/passive ownership depth. */
function createDownloadCaptureForPage(page, state, timeoutMs, opts = {}) {
	if (opts.mode !== "explicit" && state.downloadWaiterDepth > 0) return {
		armed: false,
		promise: new Promise(() => {}),
		cancel: () => {}
	};
	state.downloadWaiterDepth += 1;
	let done = false;
	let depthReleased = false;
	let timer;
	let handler;
	const cleanup = () => {
		if (!depthReleased) {
			depthReleased = true;
			state.downloadWaiterDepth = Math.max(0, state.downloadWaiterDepth - 1);
		}
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		if (handler) {
			page.off("download", handler);
			handler = void 0;
		}
	};
	return {
		armed: true,
		promise: new Promise((resolve, reject) => {
			handler = (download) => {
				if (done) return;
				done = true;
				cleanup();
				saveBrowserDownload(download, opts).then(resolve, reject);
			};
			page.on("download", handler);
			timer = setTimeout(() => {
				if (done) return;
				done = true;
				cleanup();
				reject(new Error(opts.timeoutMessage ?? "Timeout waiting for download"));
			}, Math.max(1, timeoutMs));
			timer.unref?.();
		}),
		cancel: () => {
			if (done) return;
			done = true;
			cleanup();
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-session-dialogs.ts
function resolveObservedDialogTimeoutMs(timeoutMs) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(1, Math.floor(parsed ?? 12e4));
}
function appendRecentDialog(state, record) {
	state.recentDialogs.push(record);
	while (state.recentDialogs.length > 20) state.recentDialogs.shift();
}
function serializeDialogRecord(dialog) {
	return {
		id: dialog.id,
		type: dialog.type,
		message: dialog.message,
		...dialog.defaultValue !== void 0 ? { defaultValue: dialog.defaultValue } : {},
		openedAt: dialog.openedAt,
		...dialog.closedAt !== void 0 ? { closedAt: dialog.closedAt } : {},
		...dialog.closedBy !== void 0 ? { closedBy: dialog.closedBy } : {}
	};
}
function serializePendingDialog(dialog) {
	return serializeDialogRecord(dialog);
}
function serializeObservedBrowserState(state) {
	return { dialogs: {
		pending: state.pendingDialogs.map(serializePendingDialog),
		recent: state.recentDialogs.map(serializeDialogRecord)
	} };
}
function clearArmedDialogResponse(state) {
	if (state.armedDialogResponse?.timer) clearTimeout(state.armedDialogResponse.timer);
	state.armedDialogResponse = void 0;
}
function abortActionsBlockedByDialog(state) {
	if (state.dialogAbortControllers.size === 0) return;
	const err = new BrowserObservedDialogBlockedError(serializeObservedBrowserState(state));
	for (const controller of state.dialogAbortControllers) if (!controller.signal.aborted) controller.abort(err);
	state.dialogAbortControllers.clear();
}
function isNoDialogShowingError(err) {
	return (err instanceof Error ? err.message : String(err)).toLowerCase().includes("no dialog is showing");
}
async function settleObservedDialog(params) {
	const { state, pending } = params;
	state.pendingDialogs = state.pendingDialogs.filter((dialog) => dialog.id !== pending.id);
	let closedBy = params.closedBy;
	try {
		if (params.accept) await pending.dialog.accept(params.promptText);
		else await pending.dialog.dismiss();
	} catch (err) {
		if (!isNoDialogShowingError(err)) {
			if (params.closedBy === "agent") state.pendingDialogs.push(pending);
			throw err;
		}
		closedBy = "remote";
	}
	const record = {
		id: pending.id,
		type: pending.type,
		message: pending.message,
		...pending.defaultValue !== void 0 ? { defaultValue: pending.defaultValue } : {},
		openedAt: pending.openedAt,
		closedAt: (/* @__PURE__ */ new Date()).toISOString(),
		closedBy
	};
	appendRecentDialog(state, record);
	return record;
}
function observeDialog(pageState, dialog) {
	pageState.nextObservedDialogId += 1;
	const type = dialog.type();
	const defaultValue = dialog.defaultValue();
	const pending = {
		id: `d${pageState.nextObservedDialogId}`,
		type,
		message: dialog.message(),
		openedAt: (/* @__PURE__ */ new Date()).toISOString(),
		dialog,
		...type === "prompt" ? { defaultValue } : {}
	};
	pageState.pendingDialogs.push(pending);
	const armed = pageState.armedDialogResponse;
	if (armed && isFutureDateTimestampMs(armed.expiresAt)) {
		clearArmedDialogResponse(pageState);
		settleObservedDialog({
			state: pageState,
			pending,
			accept: armed.accept,
			...armed.promptText !== void 0 ? { promptText: armed.promptText } : {},
			closedBy: "armed"
		}).catch(() => {});
		return;
	}
	if (armed) clearArmedDialogResponse(pageState);
	abortActionsBlockedByDialog(pageState);
}
function resolvePendingDialogForResponse(params) {
	const dialogId = normalizeOptionalString(params.dialogId);
	if (dialogId) {
		const found = params.state.pendingDialogs.find((dialog) => dialog.id === dialogId);
		if (found) return found;
		throw new Error(`Dialog "${dialogId}" is not pending.`);
	}
	if (params.state.pendingDialogs.length === 1) return expectDefined(params.state.pendingDialogs.at(0), "single pending browser dialog");
	if (params.state.pendingDialogs.length > 1) throw new Error("Multiple dialogs are pending; pass dialogId.");
	throw new Error("No dialog is pending.");
}
/** Respond to a pending observed dialog on a page. */
//#endregion
//#region extensions/browser/src/browser/pw-session-state.ts
const roleRefsByTarget = /* @__PURE__ */ new Map();
const MAX_ROLE_REFS_CACHE = 50;
let roleRefsCacheGeneration = 0;
function normalizeCdpUrl(raw) {
	return raw.replace(/\/$/, "");
}
function findNetworkRequestById(state, id) {
	for (let i = state.requests.length - 1; i >= 0; i -= 1) {
		const candidate = state.requests[i];
		if (candidate && candidate.id === id) return candidate;
	}
}
function targetKey(cdpUrl, targetId) {
	return `${normalizeCdpUrl(cdpUrl)}::${targetId}`;
}
function roleRefsKey(cdpUrl, targetId) {
	return targetKey(cdpUrl, targetId);
}
function bindRoleRefsTarget(page, cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId ?? void 0);
	if (!normalizedTargetId) return;
	const state = ensurePageState(page);
	const key = roleRefsKey(cdpUrl, normalizedTargetId);
	const invalidBeforeGeneration = state.roleRefsInvalidBeforeGeneration;
	const ariaInvalidBeforeGeneration = state.roleRefsAriaInvalidBeforeGeneration;
	const cached = roleRefsByTarget.get(key);
	if (cached && (invalidBeforeGeneration !== void 0 && cached.generation <= invalidBeforeGeneration || ariaInvalidBeforeGeneration !== void 0 && cached.mode === "aria" && cached.generation <= ariaInvalidBeforeGeneration)) roleRefsByTarget.delete(key);
	state.roleRefsInvalidBeforeGeneration = void 0;
	state.roleRefsAriaInvalidBeforeGeneration = void 0;
	state.roleRefsTargetKey = key;
	if (!state.roleRefs) state.roleRefsTargetGeneration = roleRefsByTarget.get(key)?.generation;
}
/** Cache role refs for a target id after a snapshot. */
function rememberRoleRefsForTarget(opts) {
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (!targetId) return;
	const key = roleRefsKey(opts.cdpUrl, targetId);
	if (opts.frameSelector) {
		roleRefsByTarget.delete(key);
		return;
	}
	const generation = ++roleRefsCacheGeneration;
	roleRefsByTarget.set(key, {
		refs: opts.refs,
		...opts.mode ? { mode: opts.mode } : {},
		generation
	});
	while (roleRefsByTarget.size > MAX_ROLE_REFS_CACHE) {
		const first = roleRefsByTarget.keys().next();
		if (first.done) break;
		roleRefsByTarget.delete(first.value);
	}
	return generation;
}
/** Store role refs on the page and target cache. */
function storeRoleRefsForTarget(opts) {
	if (opts.frameSelector && !opts.frame) throw new Error("Frame-scoped role refs require their resolved frame.");
	const state = ensurePageState(opts.page);
	state.roleRefs = opts.refs;
	state.roleRefsFrameSelector = opts.frameSelector;
	state.roleRefsFrame = opts.frame;
	state.roleRefsMode = opts.mode;
	const targetId = normalizeOptionalString(opts.targetId);
	if (!targetId) {
		state.roleRefsTargetKey = void 0;
		state.roleRefsTargetGeneration = void 0;
		return;
	}
	bindRoleRefsTarget(opts.page, opts.cdpUrl, targetId);
	state.roleRefsTargetGeneration = rememberRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId,
		refs: opts.refs,
		frameSelector: opts.frameSelector,
		mode: opts.mode
	});
}
function clearRoleRefs(state) {
	if (state.roleRefsTargetKey) {
		if (roleRefsByTarget.get(state.roleRefsTargetKey)?.generation === state.roleRefsTargetGeneration) roleRefsByTarget.delete(state.roleRefsTargetKey);
	}
	state.roleRefs = void 0;
	state.roleRefsMode = void 0;
	state.roleRefsFrameSelector = void 0;
	state.roleRefsFrame = void 0;
	state.roleRefsTargetKey = void 0;
	state.roleRefsTargetGeneration = void 0;
}
function currentTargetRoleRefsMode(state) {
	if (!state.roleRefsTargetKey) return;
	const cached = roleRefsByTarget.get(state.roleRefsTargetKey);
	return cached && cached.generation === state.roleRefsTargetGeneration ? cached.mode : void 0;
}
/** Restore cached role refs onto a newly resolved page. */
function restoreRoleRefsForTarget(opts) {
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (!targetId) return;
	const cacheKey = roleRefsKey(opts.cdpUrl, targetId);
	bindRoleRefsTarget(opts.page, opts.cdpUrl, targetId);
	const cached = roleRefsByTarget.get(cacheKey);
	if (!cached) return;
	const state = ensurePageState(opts.page);
	if (state.roleRefs) return;
	state.roleRefsTargetKey = cacheKey;
	state.roleRefsTargetGeneration = cached.generation;
	state.roleRefs = cached.refs;
	state.roleRefsMode = cached.mode;
}
/** Ensure and attach state listeners for a Playwright page. */
function ensurePageState(page) {
	const existing = pageStates.get(page);
	if (existing) return existing;
	const state = {
		console: [],
		errors: [],
		requests: [],
		requestIds: /* @__PURE__ */ new WeakMap(),
		nextRequestId: 0,
		armIdUpload: 0,
		armIdDownload: 0,
		downloadWaiterDepth: 0,
		nextObservedDialogId: 0,
		pendingDialogs: [],
		recentDialogs: [],
		dialogAbortControllers: /* @__PURE__ */ new Set()
	};
	pageStates.set(page, state);
	if (!observedPages.has(page)) {
		observedPages.add(page);
		page.on("console", (msg) => {
			const entry = {
				type: msg.type(),
				text: msg.text(),
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				location: msg.location()
			};
			state.console.push(entry);
			if (state.console.length > 500) state.console.shift();
		});
		page.on("pageerror", (err) => {
			state.errors.push({
				message: err.message || String(err),
				name: err.name || void 0,
				stack: err.stack || void 0,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
			if (state.errors.length > 200) state.errors.shift();
		});
		page.on("request", (req) => {
			state.nextRequestId += 1;
			const id = `r${state.nextRequestId}`;
			state.requestIds.set(req, id);
			state.requests.push({
				id,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				method: req.method(),
				url: req.url(),
				resourceType: req.resourceType()
			});
			if (state.requests.length > 500) state.requests.shift();
		});
		page.on("response", (resp) => {
			const req = resp.request();
			const id = state.requestIds.get(req);
			if (!id) return;
			const rec = findNetworkRequestById(state, id);
			if (!rec) return;
			rec.status = resp.status();
			rec.ok = resp.ok();
		});
		page.on("requestfailed", (req) => {
			const id = state.requestIds.get(req);
			if (!id) return;
			const rec = findNetworkRequestById(state, id);
			if (!rec) return;
			rec.failureText = req.failure()?.errorText;
			rec.ok = false;
		});
		page.on("dialog", (dialog) => {
			observeDialog(state, dialog);
		});
		page.on("download", (download) => {
			if (state.downloadWaiterDepth > 0) return;
			const actionCapture = state.actionDownloadCapture;
			const beforeSave = actionCapture?.beforeSave;
			const managedSave = saveBrowserDownload(download, actionCapture && beforeSave ? { beforeSave: (candidate) => {
				const validation = Promise.resolve().then(() => beforeSave(candidate));
				actionCapture.validations.push(validation);
				return validation;
			} } : void 0);
			managedSave.catch(() => {});
			download.path = async () => (await managedSave).path;
			if (actionCapture) actionCapture.lastEventAtMs = Date.now();
			actionCapture?.pending.push(managedSave);
			for (const finish of actionCapture?.waiters.splice(0) ?? []) finish();
		});
		page.on("framenavigated", (frame) => {
			const isMainFrame = frame === page.mainFrame();
			if (!(state.roleRefsTargetKey !== void 0)) if (isMainFrame) state.roleRefsInvalidBeforeGeneration = roleRefsCacheGeneration;
			else state.roleRefsAriaInvalidBeforeGeneration = roleRefsCacheGeneration;
			const pageWideAriaRefs = state.roleRefsMode === "aria" || currentTargetRoleRefsMode(state) === "aria";
			if (isMainFrame || pageWideAriaRefs || frame === state.roleRefsFrame) clearRoleRefs(state);
		});
		page.on("framedetached", (frame) => {
			if (!state.roleRefsTargetKey) if (frame === page.mainFrame()) state.roleRefsInvalidBeforeGeneration = roleRefsCacheGeneration;
			else state.roleRefsAriaInvalidBeforeGeneration = roleRefsCacheGeneration;
			if (state.roleRefsMode === "aria" || currentTargetRoleRefsMode(state) === "aria" || frame === state.roleRefsFrame) clearRoleRefs(state);
		});
		page.on("close", () => {
			const emulationSession = state.emulation?.session;
			state.emulation = void 0;
			emulationSession?.then((session) => session.detach()).catch(() => {});
			clearArmedDialogResponse(state);
			for (const controller of state.dialogAbortControllers) if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("Page closed before browser action completed."));
			state.dialogAbortControllers.clear();
			state.pendingDialogs = [];
			pageStates.delete(page);
			observedPages.delete(page);
		});
	}
	return state;
}
/** Read observed dialog state from a Playwright page. */
function getObservedBrowserStateForPage(page) {
	return serializeObservedBrowserState(ensurePageState(page));
}
/** Resolve a page and read its observed browser state. */
async function respondToObservedDialogOnPage(opts) {
	const state = ensurePageState(opts.page);
	return await settleObservedDialog({
		state,
		pending: resolvePendingDialogForResponse({
			state,
			...opts.dialogId !== void 0 ? { dialogId: opts.dialogId } : {}
		}),
		accept: opts.accept,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {},
		closedBy: opts.closedBy ?? "agent"
	});
}
/** Mark pending observed dialogs as handled by a remote/browser-side hook. */
function markObservedDialogsHandledRemotelyForPage(page) {
	const state = ensurePageState(page);
	const pending = state.pendingDialogs.splice(0);
	const closedAt = (/* @__PURE__ */ new Date()).toISOString();
	for (const dialog of pending) appendRecentDialog(state, {
		id: dialog.id,
		type: dialog.type,
		message: dialog.message,
		...dialog.defaultValue !== void 0 ? { defaultValue: dialog.defaultValue } : {},
		openedAt: dialog.openedAt,
		closedAt,
		closedBy: "remote"
	});
	return serializeObservedBrowserState(state);
}
/** Arm a one-shot automatic dialog response for a page. */
function armObservedDialogResponseOnPage(opts) {
	const state = ensurePageState(opts.page);
	clearArmedDialogResponse(state);
	const timeoutMs = resolveObservedDialogTimeoutMs(opts.timeoutMs);
	const expiresAt = resolveExpiresAtMsFromDurationMs(timeoutMs);
	if (expiresAt === void 0) return;
	const response = {
		accept: opts.accept,
		expiresAt,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
	};
	response.timer = setTimeout(() => {
		if (state.armedDialogResponse === response) state.armedDialogResponse = void 0;
	}, timeoutMs);
	state.armedDialogResponse = response;
}
/** Create an abort signal that fires while a dialog blocks the page. */
function createObservedDialogAbortSignalForPage(opts) {
	const state = ensurePageState(opts.page);
	const controller = new AbortController();
	const abortForCurrentDialog = () => {
		if (!controller.signal.aborted) controller.abort(new BrowserObservedDialogBlockedError(serializeObservedBrowserState(state)));
	};
	const abortForParent = () => {
		if (!controller.signal.aborted) controller.abort(opts.parentSignal?.reason ?? /* @__PURE__ */ new Error("aborted"));
	};
	if (state.pendingDialogs.length > 0) abortForCurrentDialog();
	else state.dialogAbortControllers.add(controller);
	if (opts.parentSignal) if (opts.parentSignal.aborted) abortForParent();
	else opts.parentSignal.addEventListener("abort", abortForParent, { once: true });
	return {
		signal: controller.signal,
		cleanup: () => {
			state.dialogAbortControllers.delete(controller);
			opts.parentSignal?.removeEventListener("abort", abortForParent);
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-session-downloads.ts
function isDownloadStartingNavigationError(err, expectedUrl) {
	const message = formatErrorMessage(err).toLowerCase();
	if (message.includes("download is starting")) return true;
	const normalizedUrl = normalizeOptionalString(expectedUrl)?.toLowerCase();
	return Boolean(normalizedUrl && message.includes("net::err_aborted") && message.includes(normalizedUrl));
}
/** Capture downloads started synchronously by one Browser action. */
function beginActionDownloadCaptureOnPage(page, opts = {}) {
	const state = ensurePageState(page);
	const capture = {
		pending: [],
		validations: [],
		waiters: [],
		...opts.beforeSave ? { beforeSave: opts.beforeSave } : {}
	};
	state.actionDownloadCapture = capture;
	const detach = () => {
		if (state.actionDownloadCapture === capture) state.actionDownloadCapture = void 0;
		for (const finish of capture.waiters.splice(0)) finish();
	};
	return {
		drain: async (drainOpts = {}) => {
			const waitForEvent = async (timeoutMs) => {
				await new Promise((resolve) => {
					const finish = () => {
						clearTimeout(timer);
						capture.waiters = capture.waiters.filter((waiter) => waiter !== finish);
						resolve();
					};
					const timer = setTimeout(finish, timeoutMs);
					capture.waiters.push(finish);
				});
			};
			const firstEventGraceMs = Math.max(0, drainOpts.firstEventGraceMs ?? 0);
			const maxWaitMs = Math.max(0, drainOpts.maxWaitMs ?? Number.POSITIVE_INFINITY);
			const deadlineAtMs = Date.now() + maxWaitMs;
			const remainingBudgetMs = () => Math.max(0, deadlineAtMs - Date.now());
			if (capture.pending.length === 0 && firstEventGraceMs > 0) await waitForEvent(Math.min(firstEventGraceMs, remainingBudgetMs()));
			const quietMs = Math.max(0, drainOpts.quietMs ?? 0);
			if (quietMs > 0) while (capture.lastEventAtMs !== void 0) {
				const remainingQuietMs = Math.min(quietMs - (Date.now() - capture.lastEventAtMs), remainingBudgetMs());
				if (remainingQuietMs <= 0) break;
				await waitForEvent(remainingQuietMs);
			}
			detach();
			const pending = capture.pending.slice();
			await Promise.all(capture.validations.slice());
			const downloads = await Promise.all(pending);
			return downloads.length > 0 ? downloads : void 0;
		},
		dispose: detach
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-session-cdp-transport.ts
const { chromium: chromium$1 } = playwrightCore;
async function connectOverCdpPinnedTransport(connectionUrl, opts) {
	const ws = openCdpWebSocket(connectionUrl, {
		headers: opts.headers,
		handshakeTimeoutMs: opts.timeout,
		lookup: opts.lookup,
		playwrightTransportDefaults: true
	});
	try {
		await new Promise((resolve, reject) => {
			ws.once("open", () => resolve());
			ws.once("error", reject);
			ws.once("close", () => reject(/* @__PURE__ */ new Error("CDP socket closed")));
		});
		let onMessage;
		let onClose;
		const pendingMessages = [];
		let pendingCloseReason;
		let transportClosed = false;
		let transportCloseScheduled = false;
		const notifyTransportClosed = (reason) => {
			if (transportClosed) return;
			transportClosed = true;
			if (onClose) {
				onClose(reason);
				return;
			}
			pendingCloseReason = reason;
		};
		const scheduleTransportClosed = (reason) => {
			if (transportClosed || transportCloseScheduled) return;
			transportCloseScheduled = true;
			setImmediate(() => {
				transportCloseScheduled = false;
				notifyTransportClosed(reason);
			});
		};
		const closeTransportSocket = (reason = "CDP socket closed") => {
			notifyTransportClosed(reason);
			ws.close();
			setTimeout(() => {
				if (ws.readyState !== WebSocket$1.CLOSED) ws.terminate();
			}, 100).unref?.();
		};
		const scheduleMessage = (message) => {
			setImmediate(() => {
				if (transportClosed) return;
				if (!onMessage) {
					pendingMessages.push(message);
					return;
				}
				try {
					onMessage(message);
				} catch (error) {
					closeTransportSocket(formatErrorMessage(error));
				}
			});
		};
		const transport = {
			send: (message) => {
				ws.send(JSON.stringify(message));
			},
			close: () => {
				closeTransportSocket();
			},
			get onmessage() {
				return onMessage;
			},
			set onmessage(handler) {
				onMessage = handler;
				if (!handler) return;
				while (pendingMessages.length > 0) {
					const pending = pendingMessages.shift();
					if (pending) scheduleMessage(pending);
				}
			},
			get onclose() {
				return onClose;
			},
			set onclose(handler) {
				onClose = handler;
				if (handler && pendingCloseReason !== void 0) {
					const reason = pendingCloseReason;
					pendingCloseReason = void 0;
					handler(reason);
				}
			}
		};
		ws.on("message", (raw) => {
			try {
				const parsed = JSON.parse(rawDataToString(raw));
				scheduleMessage(parsed);
			} catch {
				closeTransportSocket();
			}
		});
		ws.on("close", () => {
			scheduleTransportClosed("CDP socket closed");
		});
		ws.on("error", (error) => {
			scheduleTransportClosed(formatErrorMessage(error));
		});
		return await chromium$1.connectOverCDP(transport, { timeout: opts.timeout });
	} catch (error) {
		ws.close();
		throw error;
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-session-connection.ts
const { chromium } = playwrightCore;
function resolveCdpConnectRetryDelayMs(attempt) {
	return 250 + attempt * 250;
}
function hasCachedPlaywrightBrowserConnection(cdpUrl) {
	return cachedByCdpUrl.has(normalizeCdpUrl(cdpUrl));
}
function isRecoverablePlaywrightDisconnectError(err) {
	const message = formatErrorMessage(err).toLowerCase();
	return message.includes("target page, context or browser has been closed") || message.includes("browser has been closed") || message.includes("browser disconnected") || message.includes("target closed") || message.includes("connection closed") || message.includes("websocket closed") || message.includes("cdp socket closed");
}
function isRecoverableStalePageSelectionError(err, reusedCachedBrowser) {
	if (!reusedCachedBrowser) return false;
	if (err instanceof Error && err.message.includes("No pages available in the connected browser.")) return true;
	if (err instanceof BrowserTabNotFoundError) return true;
	return (err instanceof Error ? err.message : formatErrorMessage(err)).toLowerCase().includes("tab not found");
}
function isBlockedTarget(cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId) ?? "";
	if (!normalizedTargetId) return false;
	return blockedTargetsByCdpUrl.has(targetKey(cdpUrl, normalizedTargetId));
}
function markTargetBlocked(cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId) ?? "";
	if (!normalizedTargetId) return;
	blockedTargetsByCdpUrl.add(targetKey(cdpUrl, normalizedTargetId));
}
function clearBlockedTarget(cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId) ?? "";
	if (!normalizedTargetId) return;
	blockedTargetsByCdpUrl.delete(targetKey(cdpUrl, normalizedTargetId));
}
function clearBlockedTargetsForCdpUrl(cdpUrl) {
	if (!cdpUrl) {
		blockedTargetsByCdpUrl.clear();
		return;
	}
	const prefix = `${normalizeCdpUrl(cdpUrl)}::`;
	for (const key of blockedTargetsByCdpUrl) if (key.startsWith(prefix)) blockedTargetsByCdpUrl.delete(key);
}
function blockedPageRefsForCdpUrl(cdpUrl) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const existing = blockedPageRefsByCdpUrl.get(normalized);
	if (existing) return existing;
	const created = /* @__PURE__ */ new WeakSet();
	blockedPageRefsByCdpUrl.set(normalized, created);
	return created;
}
function isBlockedPageRef(cdpUrl, page) {
	return blockedPageRefsByCdpUrl.get(normalizeCdpUrl(cdpUrl))?.has(page) ?? false;
}
function markPageRefBlocked(cdpUrl, page) {
	blockedPageRefsForCdpUrl(cdpUrl).add(page);
}
function clearBlockedPageRefsForCdpUrl(cdpUrl) {
	if (!cdpUrl) {
		blockedPageRefsByCdpUrl.clear();
		return;
	}
	blockedPageRefsByCdpUrl.delete(normalizeCdpUrl(cdpUrl));
}
function clearBlockedPageRef(cdpUrl, page) {
	blockedPageRefsByCdpUrl.get(normalizeCdpUrl(cdpUrl))?.delete(page);
}
function takeCachedPlaywrightBrowserConnection(cdpUrl) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const cur = cachedByCdpUrl.get(normalized);
	cachedByCdpUrl.delete(normalized);
	const pending = connectingByCdpUrl.get(normalized);
	if (pending) pending.attempt.cancelled = true;
	connectingByCdpUrl.delete(normalized);
	if (!cur) return null;
	if (cur.onDisconnected && typeof cur.browser.off === "function") cur.browser.off("disconnected", cur.onDisconnected);
	return cur;
}
/** Raised when a page target has been quarantined after policy denial. */
var BlockedBrowserTargetError = class extends Error {
	constructor() {
		super("Browser target is unavailable after SSRF policy blocked its navigation.");
		this.name = "BlockedBrowserTargetError";
	}
};
function retainClosingPlaywrightConnection(connection) {
	const retained = retainedClosingByCdpUrl.get(connection.cdpUrl) ?? /* @__PURE__ */ new Set();
	retained.add(connection);
	retainedClosingByCdpUrl.set(connection.cdpUrl, retained);
}
function releaseClosingPlaywrightConnection(connection) {
	const retained = retainedClosingByCdpUrl.get(connection.cdpUrl);
	retained?.delete(connection);
	if (retained?.size === 0) retainedClosingByCdpUrl.delete(connection.cdpUrl);
}
async function closeTrackedPlaywrightConnection(connection) {
	if (closedConnections.has(connection)) return;
	const existing = closeConnectionPromises.get(connection);
	if (existing) return await existing;
	retainClosingPlaywrightConnection(connection);
	const closing = (async () => {
		try {
			await connection.browser.close();
			closedConnections.add(connection);
			releaseClosingPlaywrightConnection(connection);
		} finally {
			closeConnectionPromises.delete(connection);
		}
	})();
	closeConnectionPromises.set(connection, closing);
	return await closing;
}
async function withPlaywrightCloseTimeout(task) {
	let timer;
	try {
		await Promise.race([task, new Promise((_, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error("Playwright adapter disconnect timed out.")), PLAYWRIGHT_CONNECTION_CLOSE_TIMEOUT_MS);
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
/** Capture and retire only the adapter handles currently owned by one lifecycle transition. */
function retirePlaywrightBrowserConnectionExact(opts) {
	const normalized = normalizeCdpUrl(opts.cdpUrl);
	clearBlockedTargetsForCdpUrl(normalized);
	clearBlockedPageRefsForCdpUrl(normalized);
	const connections = /* @__PURE__ */ new Set();
	const closeAttempts = /* @__PURE__ */ new Map();
	const pendingCollections = /* @__PURE__ */ new Set();
	let retired = false;
	const startClosing = () => {
		for (const connection of connections) {
			if (closeAttempts.has(connection)) continue;
			const closing = closeTrackedPlaywrightConnection(connection);
			closeAttempts.set(connection, closing);
			closing.catch(() => {});
		}
	};
	const awaitClosing = async () => {
		const attempts = [...closeAttempts];
		const results = await Promise.allSettled(attempts.map(([, closing]) => closing));
		let firstError;
		for (const [index, result] of results.entries()) if (result.status === "rejected") {
			const [connection, closing] = attempts[index] ?? [];
			if (connection && closeAttempts.get(connection) === closing) closeAttempts.delete(connection);
			firstError ??= toErrorObject(result.reason, "Playwright adapter disconnect failed.");
		}
		if (firstError) throw firstError;
	};
	const capture = () => {
		const pending = connectingByCdpUrl.get(normalized);
		const cached = takeCachedPlaywrightBrowserConnection(normalized);
		for (const connection of retainedClosingByCdpUrl.get(normalized) ?? []) connections.add(connection);
		if (cached) {
			connections.add(cached);
			retainClosingPlaywrightConnection(cached);
		}
		if (pending) {
			const collection = pending.promise.then((connection) => {
				connections.add(connection);
			}, () => {
				if (pending.attempt.retired) connections.add(pending.attempt.retired);
			});
			pendingCollections.add(collection);
			collection.then(() => {
				pendingCollections.delete(collection);
				startClosing();
			});
		}
		startClosing();
		const captured = Boolean(pending || connections.size > 0);
		retired ||= captured;
		return captured;
	};
	capture();
	return {
		get retired() {
			return retired;
		},
		refresh: capture,
		close: async () => {
			await withPlaywrightCloseTimeout((async () => {
				startClosing();
				await Promise.all(pendingCollections);
				startClosing();
				await awaitClosing();
			})());
		}
	};
}
/** Retire a scoped adapter immediately; its CDP disconnect may settle later. */
function retirePlaywrightBrowserConnection(opts) {
	return retirePlaywrightBrowserConnectionExact(opts).retired;
}
function evictStalePlaywrightBrowserConnection(cdpUrl, expectedBrowser) {
	const current = cachedByCdpUrl.get(normalizeCdpUrl(cdpUrl));
	if (expectedBrowser && current?.browser !== expectedBrowser) return;
	const cur = takeCachedPlaywrightBrowserConnection(cdpUrl);
	if (cur) closeTrackedPlaywrightConnection(cur).catch(() => {});
}
function hasBlockedTargetsForCdpUrl(cdpUrl) {
	const prefix = `${normalizeCdpUrl(cdpUrl)}::`;
	for (const key of blockedTargetsByCdpUrl) if (key.startsWith(prefix)) return true;
	return false;
}
/** Raised when a page target has been quarantined after policy denial. */
function observeContext(context) {
	if (observedContexts.has(context)) return;
	observedContexts.add(context);
	ensureContextState(context);
	for (const page of context.pages()) ensurePageState(page);
	context.on("page", (page) => ensurePageState(page));
}
/** Ensure shared Playwright browser-context state. */
function ensureContextState(context) {
	const existing = contextStates.get(context);
	if (existing) return existing;
	const state = { traceActive: false };
	contextStates.set(context, state);
	return state;
}
function observeBrowser(browser) {
	for (const context of browser.contexts()) observeContext(context);
}
async function connectBrowser(cdpUrl, ssrfPolicy) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const cached = cachedByCdpUrl.get(normalized);
	if (cached) return cached;
	const configuredPin = await assertCdpEndpointAllowed(normalized, ssrfPolicy);
	const connecting = connectingByCdpUrl.get(normalized);
	if (connecting) return await connecting.promise;
	const connectionAttempt = { cancelled: false };
	const connectWithRetry = async () => {
		let lastErr;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			if (connectionAttempt.cancelled) break;
			try {
				const timeout = 5e3 + attempt * 2e3;
				let endpointDiscoveryError;
				const resolvedEndpoint = await getChromeWebSocketEndpoint(normalized, timeout, ssrfPolicy).catch((err) => {
					endpointDiscoveryError = err;
					return null;
				});
				const hasUrlCredentials = stripCdpUrlCredentials(normalized) !== normalized;
				if (!resolvedEndpoint && hasUrlCredentials && !isWebSocketUrl(normalized)) throw new Error("Authenticated CDP HTTP endpoint did not expose a usable WebSocket URL.");
				if (!resolvedEndpoint && ssrfPolicy && !isWebSocketUrl(normalized)) {
					const detail = endpointDiscoveryError ? ` Reason: ${redactCdpErrorText(formatErrorMessage(endpointDiscoveryError))}` : "";
					throw new Error(`Guarded CDP endpoint did not expose a usable WebSocket URL.${detail}`);
				}
				const normalizedCdpHostname = new URL(normalized).hostname;
				const needsPinnedDependencyConnect = Boolean(configuredPin?.lookup) && !isLoopbackHost(normalizedCdpHostname);
				const endpointUrl = resolvedEndpoint?.url ?? normalized;
				const endpointLookup = resolvedEndpoint?.lookup ?? (needsPinnedDependencyConnect ? configuredPin?.lookup : void 0);
				const connectEndpoint = async (target, lookup) => {
					const headers = getHeadersWithAuth(target);
					const connectionUrl = stripCdpUrlCredentials(target);
					return await withManagedProxyForCdpUrl(connectionUrl, () => withNoProxyForCdpUrl(connectionUrl, async () => {
						if (lookup) return await connectOverCdpPinnedTransport(connectionUrl, {
							timeout,
							headers,
							lookup
						});
						return await chromium.connectOverCDP(connectionUrl, {
							timeout,
							headers
						});
					}));
				};
				let browser;
				try {
					browser = await connectEndpoint(endpointUrl, endpointLookup);
				} catch (err) {
					if (!isWebSocketUrl(normalized) || endpointUrl === normalized) throw err;
					browser = await connectEndpoint(normalized, configuredPin?.lookup);
				}
				if (connectionAttempt.cancelled) {
					connectionAttempt.retired = {
						browser,
						cdpUrl: normalized
					};
					closeTrackedPlaywrightConnection(connectionAttempt.retired).catch(() => {});
					throw new Error("Playwright connection attempt was superseded.");
				}
				const onDisconnected = () => {
					if (cachedByCdpUrl.get(normalized)?.browser === browser) cachedByCdpUrl.delete(normalized);
				};
				const connected = {
					browser,
					cdpUrl: normalized,
					onDisconnected
				};
				cachedByCdpUrl.set(normalized, connected);
				browser.on("disconnected", onDisconnected);
				observeBrowser(browser);
				return connected;
			} catch (err) {
				lastErr = err;
				if (connectionAttempt.cancelled) break;
				if (formatErrorMessage(err).includes("rate limit")) break;
				const delay = resolveCdpConnectRetryDelayMs(attempt);
				await new Promise((r) => {
					setTimeout(r, delay);
				});
			}
		}
		const message = lastErr ? formatErrorMessage(lastErr) : "CDP connect failed";
		throw new Error(redactCdpErrorText(message));
	};
	const pending = connectWithRetry().finally(() => {
		if (connectingByCdpUrl.get(normalized)?.attempt === connectionAttempt) connectingByCdpUrl.delete(normalized);
	});
	connectingByCdpUrl.set(normalized, {
		attempt: connectionAttempt,
		promise: pending
	});
	return await pending;
}
async function getAllPages(browser) {
	return browser.contexts().flatMap((c) => c.pages());
}
async function partitionAccessiblePages(opts) {
	const accessible = [];
	let blockedCount = 0;
	for (const page of opts.pages) {
		if (isBlockedPageRef(opts.cdpUrl, page)) {
			blockedCount += 1;
			continue;
		}
		ensurePageState(page);
		const targetId = (await pageTargetInfo(page).catch(() => null))?.targetId ?? null;
		if (!targetId) {
			if (hasBlockedTargetsForCdpUrl(opts.cdpUrl)) {
				blockedCount += 1;
				continue;
			}
			accessible.push({
				page,
				targetId: null
			});
			continue;
		}
		if (isBlockedTarget(opts.cdpUrl, targetId)) {
			blockedCount += 1;
			continue;
		}
		bindRoleRefsTarget(page, opts.cdpUrl, targetId);
		accessible.push({
			page,
			targetId
		});
	}
	return {
		accessible,
		blockedCount
	};
}
const targetInfoReads = /* @__PURE__ */ new WeakMap();
async function readPageTargetInfo(page) {
	let session;
	let timer;
	let timedOut = false;
	let detachStarted = false;
	const detach = () => {
		if (!session || detachStarted) return;
		detachStarted = true;
		session.detach().catch(() => {});
	};
	const timeout = new Promise((resolve) => {
		timer = setTimeout(() => {
			timedOut = true;
			detach();
			resolve(null);
		}, PLAYWRIGHT_TARGET_INFO_TIMEOUT_MS);
		timer.unref?.();
	});
	const read = (async () => {
		session = await page.context().newCDPSession(page);
		if (timedOut) {
			detach();
			return null;
		}
		try {
			const { targetInfo } = await session.send("Target.getTargetInfo");
			const targetId = normalizeOptionalString(targetInfo.targetId) ?? "";
			if (!targetId) return null;
			return {
				targetId,
				title: targetInfo.title
			};
		} finally {
			detach();
		}
	})();
	try {
		return await Promise.race([read, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
function pageTargetInfo(page) {
	const existing = targetInfoReads.get(page);
	if (existing) return existing;
	const pending = readPageTargetInfo(page);
	targetInfoReads.set(page, pending);
	const evict = () => {
		if (targetInfoReads.get(page) === pending) targetInfoReads.delete(page);
	};
	pending.then(evict, evict);
	return pending;
}
async function getPageForTargetIdOnce(opts) {
	if (opts.targetId && isBlockedTarget(opts.cdpUrl, opts.targetId)) throw new BlockedBrowserTargetError();
	const { browser } = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
	const pages = await getAllPages(browser);
	if (!pages.length) throw new Error("No pages available in the connected browser.");
	const { accessible, blockedCount } = await partitionAccessiblePages({
		cdpUrl: opts.cdpUrl,
		pages
	});
	if (!accessible.length) {
		if (blockedCount > 0) throw new BlockedBrowserTargetError();
		throw new Error("No pages available in the connected browser.");
	}
	const first = expectDefined(accessible.at(0), "non-empty accessible browser pages");
	if (!opts.targetId) {
		bindRoleRefsTarget(first.page, opts.cdpUrl, first.targetId);
		return first.page;
	}
	const found = accessible.find((entry) => entry.targetId === opts.targetId);
	if (found) {
		bindRoleRefsTarget(found.page, opts.cdpUrl, found.targetId);
		return found.page;
	}
	throw new BrowserTabNotFoundError();
}
/** Resolve a Playwright page by target id, reconnecting once on stale state. */
async function getPageForTargetId(opts) {
	const reusedCachedBrowser = hasCachedPlaywrightBrowserConnection(opts.cdpUrl);
	try {
		return await getPageForTargetIdOnce(opts);
	} catch (err) {
		if (!isRecoverableStalePageSelectionError(err, reusedCachedBrowser)) throw err;
		retirePlaywrightBrowserConnection({ cdpUrl: opts.cdpUrl });
		return await getPageForTargetIdOnce(opts);
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-session-navigation.ts
/** Classify requests that can navigate the selected page or one of its frames. */
function classifyBrowserDocumentNavigationRequest(page, request) {
	let kind;
	let frameResolutionFailed = false;
	try {
		kind = request.frame() === page.mainFrame() ? "top-level" : "subframe";
	} catch {
		kind = "top-level";
		frameResolutionFailed = true;
	}
	try {
		if (request.isNavigationRequest()) return kind;
	} catch {}
	try {
		if (request.resourceType() === "document") return kind;
	} catch {}
	return frameResolutionFailed ? "subframe" : null;
}
/** Return true when an error is a browser navigation policy denial. */
function isPolicyDenyNavigationError(err) {
	return err instanceof SsrFBlockedError || err instanceof InvalidBrowserNavigationUrlError;
}
async function quarantineBlockedNavigationTarget(opts) {
	markPageRefBlocked(opts.cdpUrl, opts.page);
	const resolvedTargetId = (await pageTargetInfo(opts.page).catch(() => null))?.targetId ?? null;
	const fallbackTargetId = normalizeOptionalString(opts.targetId) ?? "";
	const targetIdToBlock = resolvedTargetId || fallbackTargetId;
	if (targetIdToBlock) markTargetBlocked(opts.cdpUrl, targetIdToBlock);
}
/** Quarantine and close a tab that OpenClaw navigated to a blocked URL. */
async function closeBlockedNavigationTarget(opts) {
	await quarantineBlockedNavigationTarget(opts);
	await opts.page.close().catch(() => {});
}
/** Validate a completed page navigation and quarantine policy-denied targets. */
async function assertPageNavigationCompletedSafely(opts) {
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	try {
		await assertBrowserNavigationRedirectChainAllowed({
			request: opts.response?.request(),
			...navigationPolicy
		});
		await assertBrowserNavigationResultAllowed({
			url: opts.page.url(),
			...navigationPolicy
		});
	} catch (err) {
		if (isPolicyDenyNavigationError(err)) await quarantineBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			targetId: opts.targetId
		});
		throw err;
	}
}
async function continueRouteSafely(route) {
	try {
		await route.continue();
	} catch (err) {
		if ((err instanceof Error ? err.message : "").includes("Route is already handled")) return;
		throw err;
	}
}
async function fallbackRouteSafely(route) {
	try {
		await route.fallback();
	} catch (err) {
		if ((err instanceof Error ? err.message : "").includes("Route is already handled")) return;
		throw err;
	}
}
const sourcePreservedPolicyDenials = /* @__PURE__ */ new WeakSet();
async function removePageNavigationRequestGuard(page, handler) {
	try {
		await page.unroute("**", handler);
	} catch (err) {
		try {
			if (page.isClosed()) return;
		} catch {}
		return err;
	}
}
/** Return true when policy denial left the selected page on its source document. */
function wasBrowserNavigationSourcePreservedAfterPolicyDenial(err) {
	return typeof err === "object" && err !== null && sourcePreservedPolicyDenials.has(err);
}
/** Run one selected-page action while guarding document requests. */
async function withPageNavigationRequestGuard(opts) {
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	if (!navigationPolicy.ssrfPolicy && !navigationPolicy.browserProxyMode) return await opts.action(opts.page.url());
	const inFlight = /* @__PURE__ */ new Set();
	let hasGuardError = false;
	let firstGuardError;
	let deniedDocumentCount = 0;
	let fulfilledDeniedDocumentCount = 0;
	let pendingDeniedDocumentCount = 0;
	let unpreservedDocumentCount = 0;
	let policyDeniedDetected = false;
	let lastNotifiedSourcePreserved;
	const recordGuardError = (err) => {
		if (hasGuardError) {
			if (!isPolicyDenyNavigationError(firstGuardError) && isPolicyDenyNavigationError(err)) firstGuardError = err;
			return;
		}
		hasGuardError = true;
		firstGuardError = err;
	};
	const emitPolicyDenied = (event) => {
		try {
			opts.onPolicyDenied?.(event);
		} catch {}
	};
	const updateImmediateSourcePreservation = () => {
		if (typeof firstGuardError !== "object" || firstGuardError === null) return;
		let sourcePreserved;
		if (unpreservedDocumentCount > 0) sourcePreserved = false;
		else if (isPolicyDenyNavigationError(firstGuardError) && deniedDocumentCount > 0 && pendingDeniedDocumentCount === 0 && fulfilledDeniedDocumentCount === deniedDocumentCount) sourcePreserved = true;
		if (sourcePreserved === void 0) {
			sourcePreservedPolicyDenials.delete(firstGuardError);
			return;
		}
		if (sourcePreserved) sourcePreservedPolicyDenials.add(firstGuardError);
		else sourcePreservedPolicyDenials.delete(firstGuardError);
		if (policyDeniedDetected && sourcePreserved !== lastNotifiedSourcePreserved) {
			lastNotifiedSourcePreserved = sourcePreserved;
			emitPolicyDenied({
				state: "handled",
				error: firstGuardError,
				sourcePreserved
			});
		}
	};
	const notifyPolicyDeniedDetected = () => {
		if (policyDeniedDetected || !isPolicyDenyNavigationError(firstGuardError)) return;
		policyDeniedDetected = true;
		emitPolicyDenied({
			state: "detected",
			error: firstGuardError
		});
	};
	const stopGuardedRoute = async (route, preserveDocument, requestError) => {
		if (preserveDocument && isPolicyDenyNavigationError(requestError)) {
			deniedDocumentCount += 1;
			pendingDeniedDocumentCount += 1;
			try {
				await route.fulfill({
					status: 204,
					body: ""
				});
				fulfilledDeniedDocumentCount += 1;
				pendingDeniedDocumentCount -= 1;
				updateImmediateSourcePreservation();
				return;
			} catch {
				pendingDeniedDocumentCount -= 1;
			}
		}
		if (preserveDocument) {
			unpreservedDocumentCount += 1;
			updateImmediateSourcePreservation();
		}
		await route.abort().catch(() => {});
	};
	const handleRoute = async (route, request) => {
		if (!classifyBrowserDocumentNavigationRequest(opts.page, request)) {
			try {
				await fallbackRouteSafely(route);
			} catch (err) {
				recordGuardError(err);
				await stopGuardedRoute(route, false, err);
			}
			return;
		}
		const policyCheck = assertBrowserNavigationAllowed({
			url: request.url(),
			...navigationPolicy
		});
		try {
			opts.onPolicyCheckStarted?.(policyCheck);
		} catch {}
		try {
			await policyCheck;
		} catch (err) {
			recordGuardError(err);
			notifyPolicyDeniedDetected();
			await stopGuardedRoute(route, true, err);
			return;
		}
		try {
			await fallbackRouteSafely(route);
		} catch (err) {
			recordGuardError(err);
			await stopGuardedRoute(route, true, err);
		}
	};
	const handler = (route, request) => {
		const operation = handleRoute(route, request).catch(async (err) => {
			recordGuardError(err);
			await stopGuardedRoute(route, true, err);
		});
		inFlight.add(operation);
		operation.finally(() => inFlight.delete(operation));
		return operation;
	};
	try {
		await opts.page.route("**", handler);
	} catch (err) {
		await removePageNavigationRequestGuard(opts.page, handler);
		throw err;
	}
	let result;
	let actionFailed = false;
	let actionError;
	try {
		let baselineUrl = opts.page.url();
		await assertBrowserNavigationResultAllowed({
			url: baselineUrl,
			...navigationPolicy
		});
		const latestUrl = opts.page.url();
		if (latestUrl !== baselineUrl) {
			await assertBrowserNavigationResultAllowed({
				url: latestUrl,
				...navigationPolicy
			});
			baselineUrl = latestUrl;
		}
		result = await opts.action(baselineUrl);
	} catch (err) {
		actionFailed = true;
		actionError = err;
		if (isPolicyDenyNavigationError(err)) {
			recordGuardError(err);
			notifyPolicyDeniedDetected();
			unpreservedDocumentCount += 1;
			updateImmediateSourcePreservation();
		}
	}
	const cleanupError = await removePageNavigationRequestGuard(opts.page, handler);
	while (inFlight.size > 0) await Promise.allSettled(inFlight);
	if (hasGuardError) {
		const sourcePreserved = isPolicyDenyNavigationError(firstGuardError) && deniedDocumentCount > 0 && fulfilledDeniedDocumentCount === deniedDocumentCount && unpreservedDocumentCount === 0 && !(actionFailed && isPolicyDenyNavigationError(actionError)) && typeof firstGuardError === "object" && firstGuardError !== null;
		if (typeof firstGuardError === "object" && firstGuardError !== null) if (sourcePreserved) sourcePreservedPolicyDenials.add(firstGuardError);
		else sourcePreservedPolicyDenials.delete(firstGuardError);
		throw toErrorObject(firstGuardError, "Non-Error thrown");
	}
	if (actionFailed) throw toErrorObject(actionError, "Non-Error thrown");
	if (cleanupError !== void 0) throw toErrorObject(cleanupError, "Non-Error thrown");
	return result;
}
/** Navigate a page while guarding requested URL and redirect chain. */
async function gotoPageWithNavigationGuard(opts) {
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	let blockedError = null;
	const handler = async (route, request) => {
		if (blockedError) {
			await route.abort().catch(() => {});
			return;
		}
		const requestKind = classifyBrowserDocumentNavigationRequest(opts.page, request);
		if (!requestKind) {
			await continueRouteSafely(route);
			return;
		}
		try {
			await assertBrowserNavigationAllowed({
				url: request.url(),
				...navigationPolicy
			});
		} catch (err) {
			if (isPolicyDenyNavigationError(err)) {
				if (requestKind === "top-level") blockedError = err;
				await route.abort().catch(() => {});
				return;
			}
			throw err;
		}
		await continueRouteSafely(route);
	};
	try {
		await opts.page.route("**", handler);
	} catch (err) {
		await removePageNavigationRequestGuard(opts.page, handler);
		throw err;
	}
	let response = null;
	let navigationFailed = false;
	let navigationError;
	try {
		response = await opts.page.goto(opts.url, { timeout: opts.timeoutMs });
	} catch (err) {
		navigationFailed = true;
		navigationError = err;
	}
	const cleanupError = await removePageNavigationRequestGuard(opts.page, handler);
	if (blockedError) {
		await closeBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			targetId: opts.targetId
		});
		throw toErrorObject(blockedError, "Non-Error thrown");
	}
	if (navigationFailed) throw navigationError;
	if (cleanupError !== void 0) throw toErrorObject(cleanupError, "Non-Error thrown");
	return response;
}
/** Resolve a browser snapshot ref into a Playwright locator. */
//#endregion
//#region extensions/browser/src/browser/pw-session.page-cdp.ts
/**
* Playwright page-scoped CDP helpers.
*
* Opens a CDP session through Playwright pages and marks backend DOM nodes with
* temporary browser refs for role-snapshot interactions.
*/
/** Attribute used to mark DOM nodes that correspond to generated browser refs. */
const BROWSER_REF_MARKER_ATTRIBUTE = "data-openclaw-browser-ref";
async function withPlaywrightPageCdpSession(page, fn) {
	const session = await page.context().newCDPSession(page);
	try {
		return await fn(session);
	} finally {
		await session.detach().catch(() => {});
	}
}
/** Run a function with a CDP send helper scoped to one Playwright page. */
async function withPageScopedCdpClient(opts) {
	return await withPlaywrightPageCdpSession(opts.page, async (session) => {
		return await opts.fn((method, params) => session.send(method, params));
	});
}
/** Read the browser-owned loader identity for a Playwright page's main frame. */
async function readMainFrameDocumentIdentityForPage(page) {
	return await withPlaywrightPageCdpSession(page, async (session) => await readCdpMainFrameDocumentIdentity((method, params) => session.send(method, params)));
}
/** Mark backend DOM node ids on the page with browser ref attributes. */
async function markBackendDomRefsOnPage(opts) {
	await opts.page.locator(`[${BROWSER_REF_MARKER_ATTRIBUTE}]`).evaluateAll((elements, attr) => {
		for (const element of elements) if (element instanceof Element) element.removeAttribute(attr);
	}, BROWSER_REF_MARKER_ATTRIBUTE).catch(() => {});
	const refs = opts.refs.filter((entry) => /^ax\d+$/.test(entry.ref) && Number.isFinite(entry.backendDOMNodeId) && Math.floor(entry.backendDOMNodeId) > 0);
	const marked = /* @__PURE__ */ new Set();
	if (!refs.length) return marked;
	return await withPlaywrightPageCdpSession(opts.page, async (session) => {
		const send = async (method, params) => await session.send(method, params);
		await send("DOM.enable").catch(() => {});
		const backendNodeIds = uniqueValues(refs.map((entry) => Math.floor(entry.backendDOMNodeId)));
		const pushed = await send("DOM.pushNodesByBackendIdsToFrontend", { backendNodeIds }).catch(() => ({}));
		const nodeIds = Array.isArray(pushed.nodeIds) ? pushed.nodeIds : [];
		const nodeIdByBackendId = /* @__PURE__ */ new Map();
		for (let index = 0; index < backendNodeIds.length; index += 1) {
			const backendNodeId = backendNodeIds[index];
			const nodeId = nodeIds[index];
			if (backendNodeId && typeof nodeId === "number" && nodeId > 0) nodeIdByBackendId.set(backendNodeId, nodeId);
		}
		for (const entry of refs) {
			const nodeId = nodeIdByBackendId.get(Math.floor(entry.backendDOMNodeId));
			if (!nodeId) continue;
			try {
				await send("DOM.setAttributeValue", {
					nodeId,
					name: BROWSER_REF_MARKER_ATTRIBUTE,
					value: entry.ref
				});
				marked.add(entry.ref);
			} catch {}
		}
		return marked;
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-session-actions.ts
async function getObservedBrowserStateViaPlaywright(opts) {
	return getObservedBrowserStateForPage(await getPageForTargetId(opts));
}
/** Resolve a page and read its current main-frame document identity. */
async function getMainFrameDocumentIdentityViaPlaywright(opts) {
	return await readMainFrameDocumentIdentityForPage(await getPageForTargetId(opts));
}
function refLocator(page, ref) {
	const normalized = ref.startsWith("@") ? ref.slice(1) : ref.startsWith("ref=") ? ref.slice(4) : ref;
	if (/^e\d+$/.test(normalized)) {
		const state = pageStates.get(page);
		if (state?.roleRefsMode === "aria") return (state.roleRefsFrame ?? page).locator(`aria-ref=${normalized}`);
		const info = state?.roleRefs?.[normalized];
		if (!info) throw new Error(`Unknown ref "${normalized}". Run a new snapshot and use a ref from that snapshot.`);
		const locAny = state?.roleRefsFrame ?? page;
		const locator = info.name ? locAny.getByRole(info.role, {
			name: info.name,
			exact: true
		}) : locAny.getByRole(info.role);
		return info.nth !== void 0 ? locator.nth(info.nth) : locator;
	}
	if (AX_REF_PATTERN.test(normalized)) {
		const state = pageStates.get(page);
		const info = state?.roleRefs?.[normalized];
		if (!info) throw new Error(`Unknown ref "${normalized}". Run a new snapshot and use a ref from that snapshot.`);
		const scope = state.roleRefsFrame ?? page;
		if (info.domMarker) return scope.locator(`[${BROWSER_REF_MARKER_ATTRIBUTE}="${normalized}"]`);
		const locAny = scope;
		const locator = info.name ? locAny.getByRole(info.role, {
			name: info.name,
			exact: true
		}) : locAny.getByRole(info.role);
		return info.nth !== void 0 ? locator.nth(info.nth) : locator;
	}
	return page.locator(`aria-ref=${normalized}`);
}
/** Close one or all cached Playwright browser connections. */
async function closePlaywrightBrowserConnection(opts) {
	const normalized = opts?.cdpUrl ? normalizeCdpUrl(opts.cdpUrl) : null;
	if (normalized) {
		await retirePlaywrightBrowserConnectionExact({ cdpUrl: normalized }).close();
		return;
	}
	const cdpUrls = /* @__PURE__ */ new Set([
		...cachedByCdpUrl.keys(),
		...connectingByCdpUrl.keys(),
		...retainedClosingByCdpUrl.keys()
	]);
	clearBlockedTargetsForCdpUrl();
	clearBlockedPageRefsForCdpUrl();
	const failed = (await Promise.allSettled([...cdpUrls].map(async (cdpUrl) => await retirePlaywrightBrowserConnectionExact({ cdpUrl }).close()))).find((result) => result.status === "rejected");
	if (failed) throw failed.reason;
}
function cdpSocketNeedsAttach(wsUrl) {
	try {
		const pathname = new URL(wsUrl).pathname;
		return pathname === "/cdp" || pathname.endsWith("/cdp") || pathname.includes("/devtools/browser/");
	} catch {
		return false;
	}
}
async function tryTerminateExecutionViaCdp(opts) {
	await assertCdpEndpointAllowed(opts.cdpUrl, opts.ssrfPolicy);
	const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(opts.cdpUrl, opts.ssrfPolicy);
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(opts.cdpUrl);
	const pages = await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), 2e3, void 0, cdpControlPolicy).catch(() => null);
	if (!pages || pages.length === 0) return;
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	const wsUrlRaw = normalizeOptionalString(pages.find((p) => normalizeOptionalString(p.id) === targetId)?.webSocketDebuggerUrl) ?? "";
	if (!wsUrlRaw) return;
	const wsUrl = normalizeCdpWsUrl(wsUrlRaw, cdpHttpBase);
	const wsPin = await assertCdpEndpointAllowed(wsUrl, cdpControlPolicy, {
		source: "discovered",
		configuredUrl: opts.cdpUrl
	});
	const needsAttach = cdpSocketNeedsAttach(wsUrl);
	const runWithTimeout = async (work, ms) => {
		let timer;
		const timeoutPromise = new Promise((_, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error("CDP command timed out")), ms);
		});
		try {
			return await Promise.race([work, timeoutPromise]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	};
	await withCdpSocket(wsUrl, async (send) => {
		let sessionId;
		try {
			if (needsAttach) {
				const attachedSessionId = normalizeOptionalString((await runWithTimeout(send("Target.attachToTarget", {
					targetId: opts.targetId,
					flatten: true
				}), 1500))?.sessionId);
				if (attachedSessionId) sessionId = attachedSessionId;
			}
			await runWithTimeout(send("Runtime.terminateExecution", void 0, sessionId), 1500);
			if (sessionId) send("Target.detachFromTarget", { sessionId }).catch(() => {});
		} catch {}
	}, {
		handshakeTimeoutMs: 2e3,
		...wsPin?.lookup ? { lookup: wsPin.lookup } : {}
	}).catch(() => {});
}
/**
* Best-effort cancellation for stuck page operations.
*
* Playwright serializes CDP commands per page; a long-running or stuck operation (notably evaluate)
* can block all subsequent commands. We cannot safely "cancel" an individual command, and we do
* not want to close the actual Chromium tab. Instead, we disconnect Playwright's CDP connection
* so in-flight commands fail fast and the next request reconnects transparently.
*
* IMPORTANT: We CANNOT call Connection.close() because Playwright shares a single Connection
* across all objects (BrowserType, Browser, etc.). Closing it corrupts the entire Playwright
* instance, preventing reconnection.
*
* Instead we:
* 1. Retire the scoped cached or in-flight connection so the next call reconnects
* 2. Fire-and-forget browser.close() — it may hang but won't block us
* 3. The next connectBrowser() creates a completely new CDP WebSocket connection
*
* The old browser.close() eventually resolves when the in-browser evaluate timeout fires,
* or the old connection gets GC'd. Either way, it doesn't affect the fresh connection.
*/
/** Force-disconnect a Playwright connection to unblock a stuck target operation. */
async function forceDisconnectPlaywrightForTarget(opts) {
	const normalized = normalizeCdpUrl(opts.cdpUrl);
	const cur = takeCachedPlaywrightBrowserConnection(normalized);
	if (!cur) return;
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (targetId) await tryTerminateExecutionViaCdp({
		cdpUrl: normalized,
		targetId,
		ssrfPolicy: opts.ssrfPolicy
	}).catch(() => {});
	closeTrackedPlaywrightConnection(cur).catch(() => {});
}
async function withPlaywrightSafeReadReconnect(opts, run) {
	const connected = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
	try {
		return await run(connected.browser);
	} catch (err) {
		if (!isRecoverablePlaywrightDisconnectError(err) || opts.attempt?.cancelled) throw err;
		evictStalePlaywrightBrowserConnection(opts.cdpUrl, connected.browser);
		if (opts.attempt?.cancelled) throw err;
		return await run((await connectBrowser(opts.cdpUrl, opts.ssrfPolicy)).browser);
	}
}
async function readPagesViaPlaywright(opts, attempt) {
	return await withPlaywrightSafeReadReconnect({
		cdpUrl: opts.cdpUrl,
		ssrfPolicy: opts.ssrfPolicy,
		attempt
	}, async (browser) => {
		const candidatePages = (await getAllPages(browser)).filter((page) => !isBlockedPageRef(opts.cdpUrl, page));
		return (await Promise.all(candidatePages.map(async (page) => {
			let targetInfo;
			try {
				targetInfo = await pageTargetInfo(page);
			} catch (err) {
				if (isRecoverablePlaywrightDisconnectError(err)) throw err;
				targetInfo = null;
			}
			if (!targetInfo || isBlockedTarget(opts.cdpUrl, targetInfo.targetId)) return null;
			let url = "";
			try {
				url = page.url();
			} catch (err) {
				if (isRecoverablePlaywrightDisconnectError(err)) throw err;
			}
			return {
				targetId: targetInfo.targetId,
				title: targetInfo.title,
				url,
				type: "page"
			};
		}))).filter((result) => result !== null);
	});
}
/**
* List all pages/tabs from the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/list is ephemeral.
*/
/** List pages through the persistent Playwright connection. */
async function listPagesViaPlaywright(opts) {
	const timeoutMs = typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? Math.max(1, Math.floor(opts.timeoutMs)) : void 0;
	if (timeoutMs === void 0) return await readPagesViaPlaywright(opts);
	let timer;
	let timeoutError;
	const attempt = { cancelled: false };
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => {
			attempt.cancelled = true;
			timeoutError = /* @__PURE__ */ new Error(`Playwright page enumeration timed out after ${timeoutMs}ms`);
			reject(timeoutError);
		}, timeoutMs);
		timer.unref?.();
	});
	try {
		return await Promise.race([readPagesViaPlaywright(opts, attempt), timeout]);
	} catch (err) {
		if (err === timeoutError) await forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			ssrfPolicy: opts.ssrfPolicy,
			reason: "Playwright page enumeration"
		}).catch(() => {});
		throw err;
	} finally {
		if (timer) clearTimeout(timer);
	}
}
/**
* Create a new page/tab using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/new is ephemeral.
* Returns the new page's targetId and metadata.
*/
/** Create and optionally navigate a page through Playwright. */
async function createPageViaPlaywright(opts) {
	const { browser } = await connectBrowser(opts.cdpUrl, opts.cdpPolicy ?? opts.ssrfPolicy);
	const context = browser.contexts()[0] ?? await browser.newContext();
	ensureContextState(context);
	const page = await context.newPage();
	ensurePageState(page);
	clearBlockedPageRef(opts.cdpUrl, page);
	const createdTargetId = (await pageTargetInfo(page).catch(() => null))?.targetId ?? null;
	clearBlockedTarget(opts.cdpUrl, createdTargetId ?? void 0);
	const targetUrl = opts.url.trim() || "about:blank";
	if (targetUrl !== "about:blank") {
		await assertBrowserNavigationAllowed({
			url: targetUrl,
			...withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode })
		});
		let response = null;
		try {
			response = await gotoPageWithNavigationGuard({
				cdpUrl: opts.cdpUrl,
				page,
				url: targetUrl,
				timeoutMs: 3e4,
				ssrfPolicy: opts.ssrfPolicy,
				browserProxyMode: opts.browserProxyMode,
				targetId: createdTargetId ?? void 0
			});
		} catch (err) {
			if (isPolicyDenyNavigationError(err) || err instanceof BlockedBrowserTargetError) throw err;
		}
		try {
			await assertPageNavigationCompletedSafely({
				cdpUrl: opts.cdpUrl,
				page,
				response,
				ssrfPolicy: opts.ssrfPolicy,
				browserProxyMode: opts.browserProxyMode,
				targetId: createdTargetId ?? void 0
			});
		} catch (err) {
			if (isPolicyDenyNavigationError(err)) await closeBlockedNavigationTarget({
				cdpUrl: opts.cdpUrl,
				page,
				targetId: createdTargetId ?? void 0
			});
			throw err;
		}
	}
	const tid = createdTargetId ?? (await pageTargetInfo(page).catch(() => null))?.targetId ?? null;
	if (!tid) throw new Error("Failed to get targetId for new page");
	return {
		targetId: tid,
		title: await page.title().catch(() => ""),
		url: page.url(),
		type: "page"
	};
}
/**
* Close a page/tab by targetId using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/close is ephemeral.
*/
async function closePageByTargetIdViaPlaywright(opts) {
	await (await getPageForTargetId(opts)).close();
}
/**
* Focus a page/tab by targetId using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/activate can be ephemeral.
*/
async function focusPageByTargetIdViaPlaywright(opts) {
	await (await getPageForTargetId(opts)).bringToFront();
}
//#endregion
export { respondToObservedDialogOnPage as A, beginActionDownloadCaptureOnPage as C, ensurePageState as D, createObservedDialogAbortSignalForPage as E, storeRoleRefsForTarget as M, createDownloadCaptureForPage as N, getObservedBrowserStateForPage as O, isBrowserObservedDialogBlockedError as P, retirePlaywrightBrowserConnectionExact as S, armObservedDialogResponseOnPage as T, wasBrowserNavigationSourcePreservedAfterPolicyDenial as _, forceDisconnectPlaywrightForTarget as a, getPageForTargetId as b, listPagesViaPlaywright as c, withPageScopedCdpClient as d, assertPageNavigationCompletedSafely as f, quarantineBlockedNavigationTarget as g, isPolicyDenyNavigationError as h, focusPageByTargetIdViaPlaywright as i, restoreRoleRefsForTarget as j, markObservedDialogsHandledRemotelyForPage as k, refLocator as l, gotoPageWithNavigationGuard as m, closePlaywrightBrowserConnection as n, getMainFrameDocumentIdentityViaPlaywright as o, closeBlockedNavigationTarget as p, createPageViaPlaywright as r, getObservedBrowserStateViaPlaywright as s, closePageByTargetIdViaPlaywright as t, markBackendDomRefsOnPage as u, withPageNavigationRequestGuard as v, isDownloadStartingNavigationError as w, retirePlaywrightBrowserConnection as x, ensureContextState as y };
