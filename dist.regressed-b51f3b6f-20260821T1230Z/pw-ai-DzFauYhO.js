import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { M as resolveNonNegativeIntegerOption, b as parseFiniteNumber, j as resolveIntegerOption } from "./number-coercion-oCkfUEEq.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-LRU688AB.js";
import "./media-mime-DQ4Ibr5o.js";
import { o as DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS } from "./constants-0X-2im2J.js";
import { n as ACT_MAX_VIEWPORT_DIMENSION, o as resolveActInteractionTimeoutMs, r as ACT_MAX_WAIT_TIME_MS, s as resolveActWaitTimeoutMs, t as ACT_MAX_CLICK_DELAY_MS, u as resolveBrowserNavigationTimeoutMs } from "./act-policy-BrghP9Kf.js";
import { s as DEFAULT_TRACE_DIR, u as resolveStrictExistingUploadPaths } from "./config-UUh1etbS.js";
import { M as playwrightCore } from "./tmp-openclaw-dir-DEhTWXIG.js";
import "./errors-D1Txg4_L.js";
import { C as buildRoleSnapshotFromAriaSnapshot, E as parseRoleRef, I as withBrowserNavigationPolicy, N as assertBrowserNavigationResultAllowed, S as buildRoleSnapshotFromAiSnapshot, g as formatAriaSnapshot, j as assertBrowserNavigationAllowed, w as finalizeRoleSnapshot } from "./chrome-C03Trt69.js";
import { i as planAnnotations, l as matchBrowserUrlPattern, n as buildOverlayClearScript, r as buildOverlayInjectionScript, t as appendSnapshotUrls, u as normalizeBrowserEvaluateFunctionSource } from "./snapshot-urls-xkh7aq-p.js";
import { A as respondToObservedDialogOnPage, C as beginActionDownloadCaptureOnPage, D as ensurePageState, E as createObservedDialogAbortSignalForPage, M as storeRoleRefsForTarget, N as createDownloadCaptureForPage, O as getObservedBrowserStateForPage, P as isBrowserObservedDialogBlockedError, S as retirePlaywrightBrowserConnectionExact, T as armObservedDialogResponseOnPage, _ as wasBrowserNavigationSourcePreservedAfterPolicyDenial, a as forceDisconnectPlaywrightForTarget, b as getPageForTargetId, c as listPagesViaPlaywright, d as withPageScopedCdpClient, f as assertPageNavigationCompletedSafely, g as quarantineBlockedNavigationTarget, h as isPolicyDenyNavigationError, i as focusPageByTargetIdViaPlaywright, j as restoreRoleRefsForTarget, k as markObservedDialogsHandledRemotelyForPage, l as refLocator, m as gotoPageWithNavigationGuard, n as closePlaywrightBrowserConnection, o as getMainFrameDocumentIdentityViaPlaywright, p as closeBlockedNavigationTarget, r as createPageViaPlaywright, s as getObservedBrowserStateViaPlaywright, t as closePageByTargetIdViaPlaywright, u as markBackendDomRefsOnPage, v as withPageNavigationRequestGuard, w as isDownloadStartingNavigationError, x as retirePlaywrightBrowserConnection, y as ensureContextState } from "./pw-session-BQnuh0uP.js";
import { t as writeExternalFileWithinOutputRoot } from "./output-files-BNOHIy99.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser/pw-tools-core.activity.ts
/** Returns captured page errors, optionally clearing the per-page buffer. */
async function getPageErrorsViaPlaywright(opts) {
	const state = ensurePageState(await getPageForTargetId(opts));
	const errors = [...state.errors];
	if (opts.clear) state.errors = [];
	return { errors };
}
/** Returns captured network requests, with optional URL substring filtering and clearing. */
async function getNetworkRequestsViaPlaywright(opts) {
	const state = ensurePageState(await getPageForTargetId(opts));
	const raw = [...state.requests];
	const filter = typeof opts.filter === "string" ? opts.filter.trim() : "";
	const requests = filter ? raw.filter((r) => r.url.includes(filter)) : raw;
	if (opts.clear) {
		state.requests = [];
		state.requestIds = /* @__PURE__ */ new WeakMap();
	}
	return { requests };
}
function consolePriority(level) {
	switch (level) {
		case "error": return 3;
		case "warning": return 2;
		case "info":
		case "log": return 1;
		case "debug": return 0;
		default: return 1;
	}
}
/** Returns captured console messages at or above the requested priority level. */
async function getConsoleMessagesViaPlaywright(opts) {
	const state = ensurePageState(await getPageForTargetId(opts));
	if (!opts.level) return [...state.console];
	const min = consolePriority(opts.level);
	return state.console.filter((msg) => consolePriority(msg.type) >= min);
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.shared.ts
/**
* Shared validation and normalization helpers for Playwright-backed browser
* tool implementations.
*/
let nextUploadArmId = 0;
let nextDownloadArmId = 0;
/** Returns a new monotonic id for the currently armed file upload waiter. */
function bumpUploadArmId() {
	nextUploadArmId += 1;
	return nextUploadArmId;
}
/** Returns a new monotonic id for the currently armed download waiter. */
function bumpDownloadArmId() {
	nextDownloadArmId += 1;
	return nextDownloadArmId;
}
/** Normalizes role refs and raw element refs into the locator id format. */
function requireRef(value) {
	const raw = normalizeOptionalString(value) ?? "";
	const ref = (raw ? parseRoleRef(raw) : null) ?? (raw.startsWith("@") ? raw.slice(1) : raw);
	if (!ref) throw new Error("ref is required");
	return ref;
}
/** Requires either a role ref or CSS selector and returns the trimmed selector mode. */
function requireRefOrSelector(ref, selector) {
	const trimmedRef = normalizeOptionalString(ref) ?? "";
	const trimmedSelector = normalizeOptionalString(selector) ?? "";
	if (!trimmedRef && !trimmedSelector) throw new Error("ref or selector is required");
	return {
		ref: trimmedRef || void 0,
		selector: trimmedSelector || void 0
	};
}
/** Bounds user-facing timeout options to Playwright-safe limits. */
function normalizeTimeoutMs(timeoutMs, fallback) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(500, Math.min(12e4, Math.floor(parsed ?? fallback)));
}
/** Converts common Playwright locator failures into model-actionable messages. */
function toAIFriendlyError(error, selector) {
	const message = formatErrorMessage(error);
	if (message.includes("strict mode violation")) {
		const countMatch = message.match(/resolved to (\d+) elements/);
		const count = countMatch ? countMatch[1] : "multiple";
		return /* @__PURE__ */ new Error(`Selector "${selector}" matched ${count} elements. Run a new snapshot to get updated refs, or use a different ref.`);
	}
	if ((message.includes("Timeout") || message.includes("waiting for")) && (message.includes("to be visible") || message.includes("not visible") || message.includes("waiting for locator("))) return /* @__PURE__ */ new Error(`Element "${selector}" not found or not visible. Run a new snapshot to see current page elements.`);
	if (message.includes("intercepts pointer events") || message.includes("not visible") || message.includes("not receive pointer events")) return /* @__PURE__ */ new Error(`Element "${selector}" is not interactable (hidden or covered). Try scrolling it into view, closing overlays, or re-snapshotting.`);
	return error instanceof Error ? error : new Error(message);
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.navigation.ts
function interactionNavigationPolicy(opts) {
	return withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
}
function hasInteractionNavigationPolicy(policy) {
	return Boolean(policy.ssrfPolicy || policy.browserProxyMode);
}
const pendingInteractionNavigationGuardCleanup = /* @__PURE__ */ new WeakMap();
function resolveBoundedDelayMs(value, label, maxMs) {
	const normalized = Math.floor(value ?? 0);
	if (!Number.isFinite(normalized) || normalized < 0) throw new Error(`${label} must be >= 0`);
	if (normalized > maxMs) throw new Error(`${label} exceeds maximum of ${maxMs}ms`);
	return normalized;
}
async function getRestoredPageForTarget(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	return page;
}
function toFriendlyInteractionError(err, label) {
	return isBrowserObservedDialogBlockedError(err) ? err : toAIFriendlyError(err, label);
}
function reconcileRemoteDialogAfterActionSettled(page, signal) {
	if (isBrowserObservedDialogBlockedError(signal?.reason)) markObservedDialogsHandledRemotelyForPage(page);
}
function throwIfInteractionAborted(signal) {
	if (signal?.aborted) throw toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection");
}
function didCrossDocumentUrlChange(page, previousUrl) {
	const currentUrl = page.url();
	if (currentUrl === previousUrl) return false;
	try {
		const prev = new URL(previousUrl);
		const curr = new URL(currentUrl);
		if (prev.origin === curr.origin && prev.pathname === curr.pathname && prev.search === curr.search) return false;
	} catch {}
	return true;
}
function isHashOnlyNavigation(currentUrl, previousUrl) {
	if (currentUrl === previousUrl) return false;
	try {
		const prev = new URL(previousUrl);
		const curr = new URL(currentUrl);
		return prev.origin === curr.origin && prev.pathname === curr.pathname && prev.search === curr.search;
	} catch {
		return false;
	}
}
function isMainFrameNavigation(page, frame) {
	if (typeof page.mainFrame !== "function") return true;
	return frame === page.mainFrame();
}
async function assertSubframeNavigationAllowed(frameUrl, navigationPolicy) {
	if (!navigationPolicy.ssrfPolicy && !navigationPolicy.browserProxyMode || !frameUrl.startsWith("http://") && !frameUrl.startsWith("https://")) return;
	await assertBrowserNavigationResultAllowed({
		url: frameUrl,
		...navigationPolicy
	});
}
function snapshotNetworkFrameUrl(frame) {
	try {
		const frameUrl = frame.url();
		return frameUrl.startsWith("http://") || frameUrl.startsWith("https://") ? frameUrl : null;
	} catch {
		return null;
	}
}
async function assertObservedDelayedNavigations(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	let subframeError;
	try {
		for (const frameUrl of opts.observed.subframes) await assertSubframeNavigationAllowed(frameUrl, navigationPolicy);
	} catch (err) {
		subframeError = err;
	}
	if (opts.observed.mainFrameNavigated) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		...navigationPolicy,
		targetId: opts.targetId
	});
	if (subframeError) throw toErrorObject(subframeError, "Non-Error thrown");
}
function observeDelayedInteractionNavigation(page, previousUrl) {
	if (didCrossDocumentUrlChange(page, previousUrl)) return Promise.resolve({
		mainFrameNavigated: true,
		subframes: []
	});
	if (typeof page.on !== "function" || typeof page.off !== "function") return Promise.resolve({
		mainFrameNavigated: false,
		subframes: []
	});
	return new Promise((resolve) => {
		const subframes = [];
		const onFrameNavigated = (frame) => {
			if (!isMainFrameNavigation(page, frame)) {
				const frameUrl = snapshotNetworkFrameUrl(frame);
				if (frameUrl) subframes.push(frameUrl);
				return;
			}
			if (isHashOnlyNavigation(page.url(), previousUrl)) return;
			cleanup();
			resolve({
				mainFrameNavigated: true,
				subframes
			});
		};
		const timeout = setTimeout(() => {
			cleanup();
			resolve({
				mainFrameNavigated: didCrossDocumentUrlChange(page, previousUrl),
				subframes
			});
		}, 250);
		const cleanup = () => {
			clearTimeout(timeout);
			page.off("framenavigated", onFrameNavigated);
		};
		page.on("framenavigated", onFrameNavigated);
	});
}
function scheduleDelayedInteractionNavigationGuard(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	if (!hasInteractionNavigationPolicy(navigationPolicy)) return Promise.resolve();
	const page = opts.page;
	if (didCrossDocumentUrlChange(page, opts.previousUrl)) return assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		...navigationPolicy,
		targetId: opts.targetId
	});
	if (typeof page.on !== "function" || typeof page.off !== "function") return Promise.resolve();
	pendingInteractionNavigationGuardCleanup.get(opts.page)?.();
	return new Promise((resolve, reject) => {
		const settle = (err) => {
			cleanup();
			if (err) {
				reject(toErrorObject(err, "Non-Error rejection"));
				return;
			}
			resolve();
		};
		const subframes = [];
		const onFrameNavigated = (frame) => {
			if (!isMainFrameNavigation(page, frame)) {
				const frameUrl = snapshotNetworkFrameUrl(frame);
				if (frameUrl) subframes.push(frameUrl);
				return;
			}
			if (isHashOnlyNavigation(page.url(), opts.previousUrl)) return;
			cleanup();
			assertObservedDelayedNavigations({
				cdpUrl: opts.cdpUrl,
				page: opts.page,
				...navigationPolicy,
				targetId: opts.targetId,
				observed: {
					mainFrameNavigated: true,
					subframes
				}
			}).then(() => settle(), settle);
		};
		const timeout = setTimeout(() => {
			cleanup();
			assertObservedDelayedNavigations({
				cdpUrl: opts.cdpUrl,
				page: opts.page,
				...navigationPolicy,
				targetId: opts.targetId,
				observed: {
					mainFrameNavigated: didCrossDocumentUrlChange(page, opts.previousUrl),
					subframes
				}
			}).then(() => settle(), settle);
		}, 250);
		const cleanup = () => {
			clearTimeout(timeout);
			page.off("framenavigated", onFrameNavigated);
			if (pendingInteractionNavigationGuardCleanup.get(opts.page) === settle) pendingInteractionNavigationGuardCleanup.delete(opts.page);
		};
		pendingInteractionNavigationGuardCleanup.set(opts.page, settle);
		page.on("framenavigated", onFrameNavigated);
	});
}
async function assertInteractionNavigationCompletedSafely(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	if (!hasInteractionNavigationPolicy(navigationPolicy)) return await opts.action();
	const navPage = opts.page;
	let navigatedDuringAction = false;
	const subframeNavigationsDuringAction = [];
	const onFrameNavigated = (frame) => {
		if (!isMainFrameNavigation(navPage, frame)) {
			const frameUrl = snapshotNetworkFrameUrl(frame);
			if (frameUrl) subframeNavigationsDuringAction.push(frameUrl);
			return;
		}
		if (!isHashOnlyNavigation(opts.page.url(), opts.previousUrl)) navigatedDuringAction = true;
	};
	if (typeof navPage.on === "function") navPage.on("framenavigated", onFrameNavigated);
	let result;
	let actionError = null;
	try {
		result = await opts.action();
	} catch (err) {
		actionError = err;
	} finally {
		if (typeof navPage.off === "function") navPage.off("framenavigated", onFrameNavigated);
	}
	const navigationObserved = navigatedDuringAction || didCrossDocumentUrlChange(opts.page, opts.previousUrl);
	let subframeError;
	try {
		for (const frameUrl of subframeNavigationsDuringAction) await assertSubframeNavigationAllowed(frameUrl, navigationPolicy);
	} catch (err) {
		subframeError = err;
	}
	if (navigationObserved) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		...navigationPolicy,
		targetId: opts.targetId
	});
	else if (actionError) {
		const observed = await observeDelayedInteractionNavigation(opts.page, opts.previousUrl);
		if (observed.mainFrameNavigated || observed.subframes.length > 0) await assertObservedDelayedNavigations({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			...navigationPolicy,
			targetId: opts.targetId,
			observed
		});
	} else await scheduleDelayedInteractionNavigationGuard({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		previousUrl: opts.previousUrl,
		...navigationPolicy,
		targetId: opts.targetId
	});
	if (subframeError) throw toErrorObject(subframeError, "Non-Error thrown");
	if (actionError) throw toErrorObject(actionError, "Non-Error thrown");
	return result;
}
async function awaitActionWithAbort(actionPromise, abortPromise, onActionResolvedAfterAbort) {
	if (!abortPromise) return await actionPromise;
	try {
		return await Promise.race([actionPromise, abortPromise]);
	} catch (err) {
		actionPromise.then(() => onActionResolvedAfterAbort?.(), () => {});
		throw err;
	}
}
async function awaitNavigationGuardedInteraction(opts, abortPromise, signal, onActionResolvedAfterAbort) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	const hasNavigationPolicy = hasInteractionNavigationPolicy(navigationPolicy);
	let observedPolicyError;
	const activePolicyChecks = /* @__PURE__ */ new Set();
	let unsafeSourceQuarantine;
	const quarantineUnsafeSource = () => unsafeSourceQuarantine ??= quarantineBlockedNavigationTarget({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		targetId: opts.targetId
	});
	const guardedAction = withPageNavigationRequestGuard({
		page: opts.page,
		...navigationPolicy,
		onPolicyCheckStarted: (check) => {
			const tracked = check.then(() => ({ state: "allowed" }), (error) => ({
				state: "failed",
				error
			}));
			activePolicyChecks.add(tracked);
			tracked.then((outcome) => {
				if (outcome.state === "allowed") activePolicyChecks.delete(tracked);
			});
		},
		onPolicyDenied: (event) => {
			observedPolicyError = event.error;
			if (event.state === "handled" && !event.sourcePreserved) quarantineUnsafeSource().catch(() => {});
		},
		action: async (baselineUrl) => {
			let actionSettledAtMs;
			try {
				return await assertInteractionNavigationCompletedSafely({
					...opts,
					action: async () => {
						try {
							throwIfInteractionAborted(signal);
							return await opts.action();
						} finally {
							actionSettledAtMs = Date.now();
						}
					},
					previousUrl: baselineUrl
				});
			} finally {
				if (hasNavigationPolicy && actionSettledAtMs !== void 0) {
					const elapsedMs = Math.max(0, Date.now() - actionSettledAtMs);
					const remainingMs = Math.max(0, 250 - elapsedMs);
					if (remainingMs > 0) await new Promise((resolve) => {
						setTimeout(resolve, remainingMs);
					});
					await assertPageNavigationCompletedSafely({
						cdpUrl: opts.cdpUrl,
						page: opts.page,
						response: null,
						...navigationPolicy,
						targetId: opts.targetId
					});
				}
			}
		}
	}).catch(async (err) => {
		if (isPolicyDenyNavigationError(err) && !wasBrowserNavigationSourcePreservedAfterPolicyDenial(err)) await quarantineUnsafeSource();
		throw err;
	});
	try {
		return await awaitActionWithAbort(guardedAction, abortPromise, onActionResolvedAfterAbort);
	} catch (err) {
		if (observedPolicyError === void 0 && activePolicyChecks.size > 0) observedPolicyError = (await Promise.all(activePolicyChecks)).find((outcome) => outcome.state === "failed" && isPolicyDenyNavigationError(outcome.error))?.error;
		if (observedPolicyError !== void 0) {
			await guardedAction;
			throw toErrorObject(observedPolicyError, "Non-Error thrown");
		}
		throw err;
	}
}
function createAbortPromiseWithListener(signal, onAbort) {
	if (!signal) return { cleanup: () => {} };
	let abortListener;
	const abortPromise = signal.aborted ? (() => {
		onAbort?.(signal.reason);
		return Promise.reject(toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
	})() : new Promise((_, reject) => {
		abortListener = () => {
			onAbort?.(signal.reason);
			reject(toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
		};
		signal.addEventListener("abort", abortListener, { once: true });
	});
	abortPromise.catch(() => {});
	return {
		abortPromise,
		cleanup: () => {
			if (abortListener) signal.removeEventListener("abort", abortListener);
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.actions.ts
async function highlightViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const ref = requireRef(opts.ref);
	try {
		await refLocator(page, ref).highlight();
	} catch (err) {
		throw toFriendlyInteractionError(err, ref);
	}
}
async function clickViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = opts.resolvedPage ?? await getRestoredPageForTarget(opts);
	if (opts.resolvedPage) {
		ensurePageState(page);
		restoreRoleRefsForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			page
		});
	}
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const timeout = resolveActInteractionTimeoutMs(opts.timeoutMs);
	const signal = opts.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal, (reason) => {
		if (isBrowserObservedDialogBlockedError(reason)) return;
		forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy,
			reason: "click aborted"
		}).catch(() => {});
	});
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => {
				const delayMs = resolveBoundedDelayMs(opts.delayMs, "click delayMs", ACT_MAX_CLICK_DELAY_MS);
				if (delayMs > 0) {
					await locator.hover({ timeout });
					throwIfInteractionAborted(signal);
					await sleepWithAbort(delayMs, signal);
					throwIfInteractionAborted(signal);
				}
				if (opts.doubleClick) {
					await locator.dblclick({
						timeout,
						button: opts.button,
						modifiers: opts.modifiers
					});
					return;
				}
				await locator.click({
					timeout,
					button: opts.button,
					modifiers: opts.modifiers
				});
			},
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, signal, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
async function clickCoordsViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	await awaitNavigationGuardedInteraction({
		action: async () => {
			await page.mouse.click(opts.x, opts.y, {
				button: opts.button,
				clickCount: opts.doubleClick ? 2 : 1,
				delay: resolveBoundedDelayMs(opts.delayMs, "clickCoords delayMs", ACT_MAX_CLICK_DELAY_MS)
			});
		},
		cdpUrl: opts.cdpUrl,
		page,
		...interactionNavigationPolicy(opts),
		targetId: opts.targetId
	}, abortPromise, opts.signal, reconcileRemoteDialog).finally(cleanup);
}
async function hoverViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => await locator.hover({ timeout: resolveActInteractionTimeoutMs(opts.timeoutMs) }),
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
async function dragViaPlaywright(opts) {
	const resolvedStart = requireRefOrSelector(opts.startRef, opts.startSelector);
	const resolvedEnd = requireRefOrSelector(opts.endRef, opts.endSelector);
	const page = await getRestoredPageForTarget(opts);
	const startLocator = resolvedStart.ref ? refLocator(page, requireRef(resolvedStart.ref)) : page.locator(resolvedStart.selector);
	const endLocator = resolvedEnd.ref ? refLocator(page, requireRef(resolvedEnd.ref)) : page.locator(resolvedEnd.selector);
	const startLabel = resolvedStart.ref ?? resolvedStart.selector;
	const endLabel = resolvedEnd.ref ?? resolvedEnd.selector;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => await startLocator.dragTo(endLocator, { timeout: resolveActInteractionTimeoutMs(opts.timeoutMs) }),
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, `${startLabel} -> ${endLabel}`);
	} finally {
		cleanup();
	}
}
async function selectOptionViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	if (!opts.values?.length) throw new Error("values are required");
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => {
				await locator.selectOption(opts.values, { timeout: resolveActInteractionTimeoutMs(opts.timeoutMs) });
			},
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
async function pressKeyViaPlaywright(opts) {
	const key = normalizeOptionalString(opts.key) ?? "";
	if (!key) throw new Error("key is required");
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => {
				await page.keyboard.press(key, { delay: resolveNonNegativeIntegerOption(opts.delayMs, 0) });
			},
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} finally {
		cleanup();
	}
}
async function typeViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const text = opts.text ?? "";
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const timeout = resolveActInteractionTimeoutMs(opts.timeoutMs);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => {
				if (opts.slowly) {
					await locator.click({ timeout });
					throwIfInteractionAborted(opts.signal);
					await locator.type(text, {
						timeout,
						delay: 75
					});
				} else await locator.fill(text, { timeout });
				if (opts.submit) {
					throwIfInteractionAborted(opts.signal);
					await locator.press("Enter", { timeout });
				}
			},
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
async function fillFormViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const timeout = resolveActInteractionTimeoutMs(opts.timeoutMs);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		for (const field of opts.fields) {
			const ref = field.ref.trim();
			if (!ref) continue;
			const type = (field.type || "text").trim() || "text";
			const rawValue = field.value;
			const value = typeof rawValue === "string" ? rawValue : typeof rawValue === "number" || typeof rawValue === "boolean" ? String(rawValue) : "";
			const locator = refLocator(page, ref);
			try {
				await awaitNavigationGuardedInteraction({
					action: async () => {
						if (type === "checkbox" || type === "radio") {
							const checked = rawValue === true || rawValue === 1 || rawValue === "1" || rawValue === "true";
							await locator.setChecked(checked, { timeout });
						} else await locator.fill(value, { timeout });
					},
					cdpUrl: opts.cdpUrl,
					page,
					...interactionNavigationPolicy(opts),
					targetId: opts.targetId
				}, abortPromise, opts.signal, reconcileRemoteDialog);
			} catch (err) {
				throw toFriendlyInteractionError(err, ref);
			}
		}
	} finally {
		cleanup();
	}
}
async function evaluateViaPlaywright(opts) {
	const fnText = normalizeOptionalString(opts.fn) ?? "";
	if (!fnText) throw new Error("function is required");
	const fnSource = normalizeBrowserEvaluateFunctionSource(fnText, opts.ref ? { argumentName: "el" } : void 0);
	const page = await getRestoredPageForTarget(opts);
	const outerTimeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	let evaluateTimeout = Math.max(1e3, Math.min(12e4, outerTimeout - 500));
	evaluateTimeout = Math.min(evaluateTimeout, outerTimeout);
	const signal = opts.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal, (reason) => {
		if (isBrowserObservedDialogBlockedError(reason)) return;
		forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy,
			reason: "evaluate aborted"
		}).catch(() => {});
	});
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	try {
		const navigationPolicy = interactionNavigationPolicy(opts);
		const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, signal);
		if (opts.ref) {
			const locator = refLocator(page, opts.ref);
			const elementEvaluator = new Function("el", "args", `
        "use strict";
        var fnSource = args.fnSource, timeoutMs = args.timeoutMs;
        try {
          var candidate = eval("(" + fnSource + ")");
          if (typeof candidate !== "function") {
            throw new Error("evaluate source did not produce a function");
          }
          var result = candidate(el);
          if (result && typeof result.then === "function") {
            return Promise.race([
              result,
              new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("evaluate timed out after " + timeoutMs + "ms")); }, timeoutMs);
              })
            ]);
          }
          return result;
        } catch (err) {
          throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));
        }
        `);
			return await awaitNavigationGuardedInteraction({
				action: async () => await locator.evaluate(elementEvaluator, {
					fnSource,
					timeoutMs: evaluateTimeout
				}),
				cdpUrl: opts.cdpUrl,
				page,
				...navigationPolicy,
				targetId: opts.targetId
			}, abortPromise, signal, reconcileRemoteDialog);
		}
		const browserEvaluator = new Function("args", `
        "use strict";
        var fnSource = args.fnSource, timeoutMs = args.timeoutMs;
        try {
          var candidate = eval("(" + fnSource + ")");
          if (typeof candidate !== "function") {
            throw new Error("evaluate source did not produce a function");
          }
          var result = candidate();
          if (result && typeof result.then === "function") {
            return Promise.race([
              result,
              new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("evaluate timed out after " + timeoutMs + "ms")); }, timeoutMs);
              })
            ]);
          }
          return result;
        } catch (err) {
          throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));
        }
      `);
		return await awaitNavigationGuardedInteraction({
			action: async () => await page.evaluate(browserEvaluator, {
				fnSource,
				timeoutMs: evaluateTimeout
			}),
			cdpUrl: opts.cdpUrl,
			page,
			...navigationPolicy,
			targetId: opts.targetId
		}, abortPromise, signal, reconcileRemoteDialog);
	} finally {
		cleanup();
	}
}
async function scrollIntoViewViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => await locator.scrollIntoViewIfNeeded({ timeout }),
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.content.ts
const DEFAULT_UPLOAD_MIME_TYPE = "application/octet-stream";
const PLAYWRIGHT_FILE_PAYLOAD_SIZE_LIMIT_BYTES = 50 * 1024 * 1024;
async function toPlaywrightFilePayloads(paths) {
	const stats = await Promise.all(paths.map(async (filePath) => await fs.stat(filePath)));
	if (stats.reduce((size, stat) => size + stat.size, 0) >= PLAYWRIGHT_FILE_PAYLOAD_SIZE_LIMIT_BYTES) throw new Error("Cannot set buffer larger than 50Mb, please write it to a file and pass its path instead.");
	return await Promise.all(paths.map(async (filePath, index) => {
		const buffer = await fs.readFile(filePath);
		return {
			name: path.basename(filePath),
			mimeType: await detectMime({
				buffer,
				filePath
			}) ?? DEFAULT_UPLOAD_MIME_TYPE,
			buffer,
			lastModifiedMs: stats[index]?.mtimeMs
		};
	}));
}
function shouldUsePlaywrightFilePayloads(opts) {
	return Boolean(opts.ssrfPolicy) && opts.browserFilesystemLocal !== true;
}
function createBrowserWaitPredicate(source) {
	return new Function("state", `
      if (state.document !== this.document) throw "Wait predicate document changed";
      state.predicate ??= (${source});
      var settled = state.settled;
      if (settled) {
        delete state.settled;
        if (settled.kind === "error") throw settled.error;
        if (!!settled.value) return true;
      }
      if (state.pending) return false;
      var predicate = state.predicate;
      var value = predicate();
      if (!value || typeof value.then !== "function") return !!value;
      state.pending = true;
      value.then(
        function(resolved) {
          state.settled = { kind: "value", value: resolved };
          delete state.pending;
        },
        function(error) {
          state.settled = { error: error, kind: "error" };
          delete state.pending;
        }
      );
      return false;
    `);
}
async function waitForViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const timeout = resolveActWaitTimeoutMs(opts.timeoutMs);
	const fn = normalizeOptionalString(opts.fn) ?? "";
	const predicateSource = fn ? normalizeBrowserEvaluateFunctionSource(fn) : "";
	const predicate = fn ? createBrowserWaitPredicate(predicateSource) : void 0;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	const waitForStep = async (stepPromise) => {
		await awaitActionWithAbort(stepPromise, abortPromise, reconcileRemoteDialog);
	};
	const waitForSettledStep = async (stepPromise) => {
		await stepPromise;
		reconcileRemoteDialog();
		throwIfInteractionAborted(opts.signal);
	};
	const runWaitSequence = async (waitFor) => {
		if (typeof opts.timeMs === "number" && Number.isFinite(opts.timeMs)) await waitFor(page.waitForTimeout(resolveBoundedDelayMs(opts.timeMs, "wait timeMs", ACT_MAX_WAIT_TIME_MS)));
		if (opts.text) await waitFor(page.getByText(opts.text).first().waitFor({
			state: "visible",
			timeout
		}));
		if (opts.textGone) await waitFor(page.getByText(opts.textGone).first().waitFor({
			state: "hidden",
			timeout
		}));
		if (opts.selector) {
			const selector = normalizeOptionalString(opts.selector) ?? "";
			if (selector) await waitFor(page.locator(selector).first().waitFor({
				state: "visible",
				timeout
			}));
		}
		if (opts.url) {
			const url = normalizeOptionalString(opts.url) ?? "";
			if (url) await waitFor(page.waitForURL(url, { timeout }));
		}
		if (opts.loadState) await waitFor(page.waitForLoadState(opts.loadState, { timeout }));
		if (fn) {
			const documentHandle = await page.evaluateHandle(() => globalThis.document);
			try {
				throwIfInteractionAborted(opts.signal);
				await waitFor(page.waitForFunction(predicate, { document: documentHandle }, { timeout }));
			} finally {
				await documentHandle.dispose();
			}
		}
	};
	try {
		if (!fn) {
			await runWaitSequence(waitForStep);
			return;
		}
		await awaitNavigationGuardedInteraction({
			action: async () => await runWaitSequence(waitForSettledStep),
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} finally {
		cleanup();
	}
}
async function takeScreenshotViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const type = opts.type ?? "png";
	const elementLocator = opts.ref ? refLocator(page, opts.ref) : opts.element ? page.locator(opts.element).first() : void 0;
	if (elementLocator) {
		if (opts.fullPage) throw new Error("fullPage is not supported for element screenshots");
		return { buffer: await elementLocator.screenshot({
			type,
			timeout: opts.timeoutMs
		}) };
	}
	return { buffer: await page.screenshot({
		type,
		fullPage: Boolean(opts.fullPage),
		timeout: opts.timeoutMs
	}) };
}
async function screenshotWithLabelsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const type = opts.type ?? "png";
	const maxLabels = typeof opts.maxLabels === "number" && Number.isFinite(opts.maxLabels) ? Math.max(1, Math.floor(opts.maxLabels)) : 150;
	const refKey = normalizeOptionalString(opts.ref) ?? void 0;
	const elementSelector = normalizeOptionalString(opts.element) ?? void 0;
	const space = opts.fullPage ? "fullpage" : refKey || elementSelector ? "element" : "viewport";
	const view = await page.evaluate(() => ({
		x: window.scrollX || 0,
		y: window.scrollY || 0,
		width: window.innerWidth || 0,
		height: window.innerHeight || 0
	}));
	const scroll = {
		x: view.x,
		y: view.y
	};
	let elementRect;
	if (space === "element") {
		const box = await resolveElementBoundingBoxForLabels(page, refKey, elementSelector);
		if (!box) throw new Error(`screenshotWithLabelsViaPlaywright: element not found for ${refKey ? `ref="${refKey}"` : `selector="${elementSelector ?? ""}"`}`);
		elementRect = {
			x: box.x + scroll.x,
			y: box.y + scroll.y,
			width: box.width,
			height: box.height
		};
	}
	const refKeys = Object.keys(opts.refs ?? {});
	const inputs = [];
	let bboxFailures = 0;
	for (const ref of refKeys) {
		const refInfo = opts.refs[ref];
		if (refInfo === void 0) continue;
		const box = await refLocator(page, ref).boundingBox().catch(() => null);
		if (!box) {
			bboxFailures += 1;
			continue;
		}
		inputs.push({
			ref,
			role: refInfo.role,
			name: refInfo.name,
			doc: {
				x: box.x + scroll.x,
				y: box.y + scroll.y,
				width: box.width,
				height: box.height
			}
		});
	}
	const plan = planAnnotations({
		inputs,
		space,
		scroll,
		viewport: {
			width: view.width,
			height: view.height
		},
		elementRect,
		maxLabels
	});
	try {
		if (plan.overlayItems.length > 0) {
			const captureY = space === "element" ? elementRect?.y : space === "viewport" ? scroll.y : 0;
			await page.evaluate(buildOverlayInjectionScript({
				items: plan.overlayItems,
				captureY
			}));
		}
		return {
			buffer: space === "element" ? await captureElementScreenshotForLabels(page, refKey, elementSelector, type, opts.timeoutMs) : await page.screenshot({
				type,
				fullPage: Boolean(opts.fullPage),
				timeout: opts.timeoutMs
			}),
			labels: plan.overlayItems.length,
			skipped: plan.skipped + bboxFailures,
			annotations: plan.annotations
		};
	} finally {
		await page.evaluate(buildOverlayClearScript()).catch(() => {});
	}
}
async function resolveElementBoundingBoxForLabels(page, refKey, cssSelector) {
	if (refKey) try {
		return await refLocator(page, refKey).boundingBox();
	} catch {
		return null;
	}
	if (cssSelector) try {
		return await page.locator(cssSelector).first().boundingBox();
	} catch {
		return null;
	}
	return null;
}
async function captureElementScreenshotForLabels(page, refKey, cssSelector, type, timeoutMs) {
	if (refKey) return await refLocator(page, refKey).screenshot({
		type,
		timeout: timeoutMs
	});
	if (cssSelector) return await page.locator(cssSelector).first().screenshot({
		type,
		timeout: timeoutMs
	});
	throw new Error("captureElementScreenshotForLabels: requires refKey or cssSelector");
}
async function setFileChooserFilesViaPlaywright(opts) {
	const resolvedResult = await resolveStrictExistingUploadPaths({ requestedPaths: opts.paths });
	if (!resolvedResult.ok) throw new Error(resolvedResult.error);
	const resolvedPaths = resolvedResult.paths;
	const resolvedFiles = shouldUsePlaywrightFilePayloads(opts) ? await toPlaywrightFilePayloads(resolvedPaths) : resolvedPaths;
	await awaitNavigationGuardedInteraction({
		action: async () => {
			await opts.fileChooser.setFiles(resolvedFiles, { timeout: opts.timeoutMs });
		},
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		...interactionNavigationPolicy(opts),
		targetId: opts.targetId
	});
}
async function setInputFilesViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	if (!opts.paths.length) throw new Error("paths are required");
	const inputRef = normalizeOptionalString(opts.inputRef) ?? "";
	const element = normalizeOptionalString(opts.element) ?? "";
	if (inputRef && element) throw new Error("inputRef and element are mutually exclusive");
	if (!inputRef && !element) throw new Error("inputRef or element is required");
	const locator = inputRef ? refLocator(page, inputRef) : page.locator(element).first();
	const resolvedResult = await resolveStrictExistingUploadPaths({ requestedPaths: opts.paths });
	if (!resolvedResult.ok) throw new Error(resolvedResult.error);
	const resolvedPaths = resolvedResult.paths;
	const resolvedFiles = shouldUsePlaywrightFilePayloads(opts) ? await toPlaywrightFilePayloads(resolvedPaths) : resolvedPaths;
	try {
		await awaitNavigationGuardedInteraction({
			action: async () => {
				await locator.setInputFiles(resolvedFiles);
			},
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId
		});
	} catch (err) {
		throw toFriendlyInteractionError(err, inputRef || element);
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.snapshot.ts
/**
* Snapshot, navigation, viewport, close, and PDF helpers for Playwright-backed
* browser tools.
*/
function resolveBoundedTimeoutMs(timeoutMs, fallbackMs, minMs, maxMs) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(minMs, Math.min(maxMs, Math.floor(parsed ?? fallbackMs)));
}
function resolveSnapshotTimeoutMs(timeoutMs) {
	return resolveBoundedTimeoutMs(timeoutMs, 5e3, 500, 6e4);
}
function resolveViewportDimension(value, label) {
	const dimension = resolveIntegerOption(value, 1, { min: 1 });
	if (dimension > 8192) throw new Error(`viewport ${label} exceeds maximum of ${ACT_MAX_VIEWPORT_DIMENSION}`);
	return dimension;
}
async function collectSnapshotUrls(page) {
	const urls = await page.evaluate(() => {
		const seen = /* @__PURE__ */ new Set();
		const out = [];
		for (const anchor of Array.from(document.querySelectorAll("a[href]"))) {
			const href = anchor instanceof HTMLAnchorElement ? anchor.href : "";
			if (!href || seen.has(href)) continue;
			const text = (anchor.textContent || anchor.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 121) || href;
			seen.add(href);
			out.push({
				text,
				url: href
			});
			if (out.length >= 100) break;
		}
		return out;
	}).catch(() => []);
	return Array.isArray(urls) ? urls.map((entry) => {
		entry.text = truncateUtf16Safe(entry.text, 120) || entry.url;
		return entry;
	}) : [];
}
function buildStoredAriaRefs(nodes, markedRefs) {
	const refs = {};
	const counts = /* @__PURE__ */ new Map();
	const refsByKey = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		const role = normalizeLowercaseStringOrEmpty(node.role) || "unknown";
		const name = node.name.trim() || void 0;
		const key = `${role}:${name ?? ""}`;
		const nth = counts.get(key) ?? 0;
		counts.set(key, nth + 1);
		const refsForKey = refsByKey.get(key);
		if (refsForKey) refsForKey.push(node.ref);
		else refsByKey.set(key, [node.ref]);
		refs[node.ref] = {
			role,
			...name ? { name } : {},
			...nth > 0 ? { nth } : {},
			...markedRefs.has(node.ref) ? { domMarker: true } : {}
		};
	}
	for (const refsForKey of refsByKey.values()) {
		if (refsForKey.length > 1) continue;
		const ref = refsForKey[0];
		if (ref) delete refs[ref]?.nth;
	}
	return refs;
}
/** Stores aria snapshot refs so later tool calls can resolve stable element refs. */
async function storeAriaSnapshotRefsViaPlaywright(opts) {
	const page = opts.page ?? await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId
	});
	ensurePageState(page);
	const markedRefs = await markBackendDomRefsOnPage({
		page,
		refs: opts.nodes.flatMap((node) => typeof node.backendDOMNodeId === "number" ? [{
			ref: node.ref,
			backendDOMNodeId: node.backendDOMNodeId
		}] : [])
	});
	storeRoleRefsForTarget({
		page,
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		refs: buildStoredAriaRefs(opts.nodes, markedRefs),
		mode: "role"
	});
}
async function prepareSnapshotPageViaPlaywright(opts) {
	const page = await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId
	});
	ensurePageState(page);
	if (opts.ssrfPolicy) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page,
		response: null,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	return page;
}
/** Captures a raw accessibility tree snapshot and stores matching role refs. */
async function snapshotAriaViaPlaywright(opts) {
	const limit = resolveIntegerOption(opts.limit, 500, {
		min: 1,
		max: 2e3
	});
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const ariaTimeoutMs = typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) && opts.timeoutMs > 0 ? Math.max(500, Math.min(6e4, Math.floor(opts.timeoutMs))) : void 0;
	const collectAxTree = withPageScopedCdpClient({
		cdpUrl: opts.cdpUrl,
		page,
		targetId: opts.targetId,
		fn: async (send) => {
			await send("Accessibility.enable").catch(() => {});
			return await send("Accessibility.getFullAXTree");
		}
	});
	const res = await (ariaTimeoutMs === void 0 ? collectAxTree : (() => {
		let timer;
		const timeout = new Promise((_, reject) => {
			timer = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`Aria snapshot via Playwright timed out after ${ariaTimeoutMs}ms.`));
			}, ariaTimeoutMs);
			timer.unref?.();
		});
		return Promise.race([collectAxTree, timeout]).finally(() => {
			if (timer) clearTimeout(timer);
		});
	})());
	const formatted = formatAriaSnapshot(Array.isArray(res?.nodes) ? res.nodes : [], limit);
	await storeAriaSnapshotRefsViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		nodes: formatted,
		page
	});
	return { nodes: formatted };
}
/** Captures Playwright's AI aria snapshot with optional URL appendix and truncation. */
async function snapshotAiViaPlaywright(opts) {
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	return await withSnapshotFrameGuard({
		page,
		run: async (isFrameCurrent) => {
			let snapshot = await page.ariaSnapshot({
				mode: "ai",
				timeout: resolveSnapshotTimeoutMs(opts.timeoutMs)
			});
			if (opts.urls) snapshot = appendSnapshotUrls(snapshot, await collectSnapshotUrls(page));
			const built = buildRoleSnapshotFromAiSnapshot(snapshot);
			const finalized = finalizeRoleSnapshot({
				snapshot,
				refs: built.refs,
				maxChars: opts.maxChars,
				delta: opts.delta
			});
			assertSnapshotFrameCurrent(isFrameCurrent);
			storeRoleRefsForTarget({
				page,
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				refs: finalized.refs,
				mode: "aria"
			});
			return finalized;
		}
	});
}
function assertSnapshotFrameCurrent(isFrameCurrent) {
	if (!isFrameCurrent()) throw new Error("Frame changed while its browser snapshot was being captured; retry.");
}
async function withSnapshotFrameGuard(opts) {
	let frameCurrent = true;
	const onFrameChanged = (frame) => {
		if (!opts.frame || frame === opts.frame) frameCurrent = false;
	};
	opts.page.on("framenavigated", onFrameChanged);
	opts.page.on("framedetached", onFrameChanged);
	try {
		return await opts.run(() => frameCurrent);
	} finally {
		opts.page.off("framenavigated", onFrameChanged);
		opts.page.off("framedetached", onFrameChanged);
	}
}
async function finalizeRoleSnapshotViaPlaywright(params) {
	const snapshot = params.urls ? appendSnapshotUrls(params.built.snapshot, await collectSnapshotUrls(params.page)) : params.built.snapshot;
	if (params.isFrameCurrent) assertSnapshotFrameCurrent(params.isFrameCurrent);
	const finalized = finalizeRoleSnapshot({
		snapshot,
		refs: params.built.refs,
		maxChars: params.maxChars,
		delta: params.delta
	});
	storeRoleRefsForTarget({
		page: params.page,
		cdpUrl: params.cdpUrl,
		targetId: params.targetId,
		refs: finalized.refs,
		...params.frameSelector ? { frameSelector: params.frameSelector } : {},
		...params.frame ? { frame: params.frame } : {},
		mode: params.mode
	});
	return finalized;
}
/** Captures a role-ref snapshot used by model-facing browser interaction tools. */
async function snapshotRoleViaPlaywright(opts) {
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const ariaSnapshotTimeout = resolveSnapshotTimeoutMs(opts.timeoutMs);
	if (opts.refsMode === "aria") {
		if (normalizeOptionalString(opts.selector) || normalizeOptionalString(opts.frameSelector)) throw new Error("refs=aria does not support selector/frame snapshots yet.");
		return await withSnapshotFrameGuard({
			page,
			run: async (isFrameCurrent) => {
				const built = buildRoleSnapshotFromAiSnapshot(await page.ariaSnapshot({
					mode: "ai",
					timeout: ariaSnapshotTimeout
				}), opts.options);
				return await finalizeRoleSnapshotViaPlaywright({
					page,
					cdpUrl: opts.cdpUrl,
					targetId: opts.targetId,
					isFrameCurrent,
					built,
					mode: "aria",
					urls: opts.urls,
					maxChars: opts.maxChars,
					delta: opts.delta
				});
			}
		});
	}
	const frameSelector = normalizeOptionalString(opts.frameSelector) ?? "";
	const selector = normalizeOptionalString(opts.selector) ?? "";
	const frameElement = frameSelector ? await page.locator(frameSelector).elementHandle({ timeout: ariaSnapshotTimeout }) : void 0;
	let frame;
	if (frameElement) try {
		frame = await frameElement.contentFrame() ?? void 0;
	} finally {
		await frameElement.dispose();
	}
	if (frameSelector && !frame) throw new Error("Frame was unavailable while its browser snapshot was being captured.");
	return await withSnapshotFrameGuard({
		page,
		frame: frame ?? page.mainFrame(),
		run: async (isFrameCurrent) => {
			const built = buildRoleSnapshotFromAriaSnapshot(await (frame ? selector ? frame.locator(selector) : frame.locator(":root") : selector ? page.locator(selector) : page.locator(":root")).ariaSnapshot({ timeout: ariaSnapshotTimeout }) ?? "", opts.options);
			return await finalizeRoleSnapshotViaPlaywright({
				page,
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				frameSelector: frameSelector || void 0,
				frame: frame ?? void 0,
				isFrameCurrent,
				built,
				mode: "role",
				urls: opts.urls,
				maxChars: opts.maxChars,
				delta: opts.delta
			});
		}
	});
}
/** Navigates the target page while enforcing browser SSRF policy before and after load. */
async function navigateViaPlaywright(opts) {
	const isRetryableNavigateError = (err) => {
		const msg = typeof err === "string" ? err.toLowerCase() : err instanceof Error ? err.message.toLowerCase() : "";
		return msg.includes("frame has been detached") || msg.includes("target page, context or browser has been closed");
	};
	const url = normalizeOptionalString(opts.url) ?? "";
	if (!url) throw new Error("url is required");
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	await assertBrowserNavigationAllowed({
		url,
		...navigationPolicy
	});
	const timeout = resolveBrowserNavigationTimeoutMs(opts.timeoutMs);
	let page = await getPageForTargetId(opts);
	let pageState = ensurePageState(page);
	const navigate = async () => await gotoPageWithNavigationGuard({
		cdpUrl: opts.cdpUrl,
		page,
		url,
		timeoutMs: timeout,
		ssrfPolicy: opts.ssrfPolicy,
		browserProxyMode: opts.browserProxyMode,
		targetId: opts.targetId
	});
	const navigateWithDownloadCapture = async () => {
		const downloadCapture = createDownloadCaptureForPage(page, pageState, timeout, {
			mode: "passive",
			timeoutMessage: "Timeout waiting for navigation download",
			beforeSave: async (download) => {
				await assertBrowserNavigationResultAllowed({
					url: download.url || url,
					...navigationPolicy
				});
			}
		});
		downloadCapture.promise.catch(() => {});
		try {
			const response = await navigate();
			downloadCapture.cancel();
			return { response };
		} catch (err) {
			if (!isDownloadStartingNavigationError(err, url) || !downloadCapture.armed) {
				downloadCapture.cancel();
				throw err;
			}
			try {
				return {
					response: null,
					download: await downloadCapture.promise
				};
			} catch (downloadErr) {
				if (downloadErr instanceof Error && downloadErr.message === "Timeout waiting for navigation download") throw err;
				if (isPolicyDenyNavigationError(downloadErr)) await closeBlockedNavigationTarget({
					cdpUrl: opts.cdpUrl,
					page,
					targetId: opts.targetId
				});
				throw downloadErr;
			}
		}
	};
	let navigationResult;
	try {
		navigationResult = await navigateWithDownloadCapture();
	} catch (err) {
		if (!isRetryableNavigateError(err)) throw err;
		await forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy,
			reason: "retry navigate after detached frame"
		}).catch(() => {});
		page = await getPageForTargetId(opts);
		pageState = ensurePageState(page);
		navigationResult = await navigateWithDownloadCapture();
	}
	try {
		if (!navigationResult.download) await assertPageNavigationCompletedSafely({
			cdpUrl: opts.cdpUrl,
			page,
			response: navigationResult.response,
			ssrfPolicy: opts.ssrfPolicy,
			browserProxyMode: opts.browserProxyMode,
			targetId: opts.targetId
		});
	} catch (err) {
		if (isPolicyDenyNavigationError(err)) await closeBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: opts.targetId
		});
		throw err;
	}
	return {
		url: navigationResult.download?.url || page.url(),
		...navigationResult.download ? { download: navigationResult.download } : {}
	};
}
/** Resizes the target page viewport within the browser action policy bounds. */
async function resizeViewportViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.setViewportSize({
		width: resolveViewportDimension(opts.width, "width"),
		height: resolveViewportDimension(opts.height, "height")
	});
}
/** Closes the target Playwright page. */
async function closePageViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.close();
}
/** Renders the target page to a PDF buffer. */
async function pdfViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	return { buffer: await page.pdf({ printBackground: true }) };
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.execution.ts
const ACT_DOWNLOAD_MAX_DRAIN_MS = 1e3;
async function executeSingleAction(action, cdpUrl, targetId, evaluateEnabled, navigationPolicy = {}, depth = 0, signal) {
	if (depth > 5) throw new Error(`Batch nesting depth exceeds maximum of 5`);
	const effectiveTargetId = action.targetId ?? targetId;
	switch (action.kind) {
		case "click":
			await clickViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				doubleClick: action.doubleClick,
				button: action.button,
				modifiers: action.modifiers,
				delayMs: action.delayMs,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "clickCoords":
			await clickCoordsViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				x: action.x,
				y: action.y,
				doubleClick: action.doubleClick,
				button: action.button,
				delayMs: action.delayMs,
				...navigationPolicy,
				signal
			});
			break;
		case "type":
			await typeViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				text: action.text,
				submit: action.submit,
				slowly: action.slowly,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "press":
			await pressKeyViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				key: action.key,
				delayMs: action.delayMs,
				...navigationPolicy,
				signal
			});
			break;
		case "hover":
			await hoverViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "scrollIntoView":
			await scrollIntoViewViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "drag":
			await dragViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				startRef: action.startRef,
				startSelector: action.startSelector,
				endRef: action.endRef,
				endSelector: action.endSelector,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "select":
			await selectOptionViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				values: action.values,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "fill":
			await fillFormViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				fields: action.fields,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "resize":
			await resizeViewportViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				width: action.width,
				height: action.height
			});
			break;
		case "wait":
			if (action.fn && !evaluateEnabled) throw new Error("wait --fn is disabled by config (browser.evaluateEnabled=false)");
			await waitForViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				timeMs: action.timeMs,
				text: action.text,
				textGone: action.textGone,
				selector: action.selector,
				url: action.url,
				loadState: action.loadState,
				fn: action.fn,
				timeoutMs: action.timeoutMs,
				...navigationPolicy,
				signal
			});
			break;
		case "evaluate":
			if (!evaluateEnabled) throw new Error("act:evaluate is disabled by config (browser.evaluateEnabled=false)");
			return await evaluateViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				...navigationPolicy,
				fn: action.fn,
				ref: action.ref,
				timeoutMs: action.timeoutMs,
				signal
			});
		case "close":
			await closePageViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId
			});
			break;
		case "batch":
			await batchViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				...navigationPolicy,
				actions: action.actions,
				stopOnError: action.stopOnError,
				evaluateEnabled,
				depth: depth + 1,
				signal
			});
			break;
		default: throw new Error(`Unsupported batch action kind: ${action.kind}`);
	}
}
function actionUsesNavigationRequestGuard(action) {
	if (action.kind === "batch") return action.actions.some(actionUsesNavigationRequestGuard);
	return action.kind === "wait" ? Boolean(action.fn) : action.kind !== "close" && action.kind !== "resize";
}
function actionNeedsStandaloneDownloadGrace(action, navigationPolicy) {
	return actionUsesNavigationRequestGuard(action) && !hasInteractionNavigationPolicy(navigationPolicy);
}
async function executeActViaPlaywright(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	const page = await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const downloadCapture = beginActionDownloadCaptureOnPage(page, { beforeSave: async (download) => {
		if (!download.url) throw new Error("Action download URL is unavailable");
		await assertBrowserNavigationResultAllowed({
			url: download.url,
			...navigationPolicy
		});
	} });
	const downloadGraceMs = actionNeedsStandaloneDownloadGrace(opts.action, navigationPolicy) ? 250 : 0;
	const drainDownloads = async (firstEventGraceMs = downloadGraceMs) => await downloadCapture.drain({
		firstEventGraceMs,
		maxWaitMs: ACT_DOWNLOAD_MAX_DRAIN_MS,
		quietMs: 250
	});
	const dialogAbort = createObservedDialogAbortSignalForPage({
		page,
		parentSignal: opts.signal
	});
	try {
		if (opts.action.kind === "batch") {
			const batch = await batchViaPlaywright({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				page,
				...navigationPolicy,
				actions: opts.action.actions,
				stopOnError: opts.action.stopOnError,
				evaluateEnabled: opts.evaluateEnabled,
				signal: dialogAbort.signal
			});
			const newDownloads = await drainDownloads();
			return {
				results: batch.results,
				...batch.aborted ? { aborted: batch.aborted } : {},
				...newDownloads ? { downloads: newDownloads } : {}
			};
		}
		const result = await executeSingleAction(opts.action, opts.cdpUrl, opts.targetId, opts.evaluateEnabled, navigationPolicy, 0, dialogAbort.signal);
		const newDownloads = await drainDownloads();
		if (opts.action.kind === "evaluate") return {
			result,
			...newDownloads ? { downloads: newDownloads } : {}
		};
		return newDownloads ? { downloads: newDownloads } : {};
	} catch (err) {
		let failure = err;
		try {
			await drainDownloads(dialogAbort.signal.aborted && actionUsesNavigationRequestGuard(opts.action) ? 250 : downloadGraceMs);
		} catch (downloadErr) {
			failure = downloadErr;
		}
		if (isBrowserObservedDialogBlockedError(failure)) return {
			blockedByDialog: true,
			browserState: failure.browserState
		};
		if (isPolicyDenyNavigationError(failure) && !wasBrowserNavigationSourcePreservedAfterPolicyDenial(failure)) await quarantineBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: opts.targetId
		});
		throw failure;
	} finally {
		downloadCapture.dispose();
		dialogAbort.cleanup();
	}
}
async function batchViaPlaywright(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	const depth = opts.depth ?? 0;
	if (depth > 5) throw new Error(`Batch nesting depth exceeds maximum of 5`);
	if (opts.actions.length > 100) throw new Error(`Batch exceeds maximum of 100 actions`);
	const page = opts.page ?? await getPageForTargetId(opts);
	const results = [];
	const finishAborted = (reason, afterAction, url, skipped) => skipped === 0 ? { results } : {
		results,
		aborted: {
			reason,
			afterAction,
			url,
			skipped
		}
	};
	let mainFrameNavigations = 0;
	let navigationsAtLastDispatch = 0;
	const currentMainFrameUrl = () => page.mainFrame?.().url() ?? page.url();
	const onFrameNavigated = (frame) => {
		if (frame === page.mainFrame?.()) mainFrameNavigations += 1;
	};
	const finishNavigation = (afterAction, skipped) => {
		const url = currentMainFrameUrl();
		const lastResult = results.at(-1);
		if (lastResult) results[results.length - 1] = {
			...lastResult,
			navigated: true,
			url
		};
		return finishAborted("navigation", afterAction, url, skipped);
	};
	page.on?.("framenavigated", onFrameNavigated);
	try {
		for (const [index, action] of opts.actions.entries()) {
			if (opts.signal?.aborted) throw opts.signal.reason ?? /* @__PURE__ */ new Error("aborted");
			if (mainFrameNavigations > navigationsAtLastDispatch) return finishNavigation(index, opts.actions.length - index);
			if (page.isClosed?.()) return finishAborted("closed", index, currentMainFrameUrl(), opts.actions.length - index);
			navigationsAtLastDispatch = mainFrameNavigations;
			try {
				await executeSingleAction(action, opts.cdpUrl, opts.targetId, opts.evaluateEnabled, navigationPolicy, depth, opts.signal);
				results.push({ ok: true });
				if (page.isClosed?.()) return finishAborted("closed", index + 1, currentMainFrameUrl(), opts.actions.length - index - 1);
				if (mainFrameNavigations > navigationsAtLastDispatch) return finishNavigation(index + 1, opts.actions.length - index - 1);
			} catch (err) {
				if (isBrowserObservedDialogBlockedError(err)) throw err;
				if (isPolicyDenyNavigationError(err)) throw err;
				const message = formatErrorMessage(err);
				results.push({
					ok: false,
					error: message
				});
				if (page.isClosed?.()) return finishAborted("closed", index + 1, currentMainFrameUrl(), opts.actions.length - index - 1);
				if (mainFrameNavigations > navigationsAtLastDispatch) return finishNavigation(index + 1, opts.actions.length - index - 1);
				if (opts.stopOnError !== false) break;
			}
		}
		return { results };
	} finally {
		page.off?.("framenavigated", onFrameNavigated);
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.downloads.ts
/**
* File chooser, dialog, and download helpers for Playwright-backed browser
* tools.
*/
async function dismissFileChooser(page) {
	await page.keyboard.press("Escape").catch(() => {});
}
const activeAtomicUploads = /* @__PURE__ */ new Map();
const pendingUploadClaims = /* @__PURE__ */ new Map();
function createExplicitDownloadCapture(params) {
	params.state.armIdDownload = bumpDownloadArmId();
	const armId = params.state.armIdDownload;
	return createDownloadCaptureForPage(params.page, params.state, params.timeoutMs, {
		mode: "explicit",
		outputPath: params.outPath,
		outputRoot: params.rootDir,
		beforeSave: () => {
			if (params.state.armIdDownload !== armId) throw new Error("Download was superseded by another waiter");
		}
	});
}
function resolveImplicitDownloadRoot() {
	return path.join(resolvePreferredOpenClawTmpDir(), "downloads");
}
/** Arms the next page file chooser and fills it with strict existing paths. */
async function armFileUploadViaPlaywright(opts) {
	const key = opts.cdpUrl;
	const armId = bumpUploadArmId();
	pendingUploadClaims.set(key, armId);
	try {
		const active = activeAtomicUploads.get(key);
		if (active) {
			active.controller.abort(/* @__PURE__ */ new Error("File upload was superseded by another waiter"));
			await active.settled;
		}
		if (pendingUploadClaims.get(key) !== armId) return;
		const page = await getPageForTargetId(opts);
		if (pendingUploadClaims.get(key) !== armId) return;
		const state = ensurePageState(page);
		const timeout = normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS);
		state.armIdUpload = armId;
		page.waitForEvent("filechooser", { timeout }).then(async (fileChooser) => {
			if (state.armIdUpload !== armId) return;
			if (!opts.paths?.length) {
				await dismissFileChooser(page);
				return;
			}
			const uploadPathsResult = await resolveStrictExistingUploadPaths({ requestedPaths: opts.paths });
			if (!uploadPathsResult.ok) {
				await dismissFileChooser(page);
				return;
			}
			await setFileChooserFilesViaPlaywright({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				page,
				fileChooser,
				paths: uploadPathsResult.paths,
				timeoutMs: timeout,
				browserFilesystemLocal: opts.browserFilesystemLocal,
				ssrfPolicy: opts.ssrfPolicy,
				browserProxyMode: opts.browserProxyMode
			});
		}).catch(() => {});
	} finally {
		if (pendingUploadClaims.get(key) === armId) pendingUploadClaims.delete(key);
	}
}
/** Clicks a ref and completes its file chooser as one request-owned operation. */
async function uploadViaPlaywright(opts) {
	opts.signal?.throwIfAborted();
	const key = opts.cdpUrl;
	const timeout = normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS);
	const armId = bumpUploadArmId();
	pendingUploadClaims.set(key, armId);
	const previous = activeAtomicUploads.get(key);
	const controller = new AbortController();
	const abortFromCaller = () => controller.abort(opts.signal?.reason ?? /* @__PURE__ */ new Error("File upload aborted"));
	opts.signal?.addEventListener("abort", abortFromCaller, { once: true });
	if (opts.signal?.aborted) abortFromCaller();
	const deadline = Date.now() + timeout;
	const timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`Timeout ${timeout}ms exceeded while completing file upload`)), timeout);
	let rejectAborted;
	const aborted = new Promise((_resolve, reject) => {
		rejectAborted = reject;
	});
	aborted.catch(() => {});
	let started = false;
	let rejectQueuedAbort;
	const queuedAbort = new Promise((_resolve, reject) => {
		rejectQueuedAbort = reject;
	});
	queuedAbort.catch(() => {});
	const rejectOnAbort = () => {
		const reason = controller.signal.reason ?? /* @__PURE__ */ new Error("File upload aborted");
		rejectAborted(reason);
		if (!started) rejectQueuedAbort(reason);
	};
	controller.signal.addEventListener("abort", rejectOnAbort, { once: true });
	if (controller.signal.aborted) rejectOnAbort();
	const execution = Promise.resolve().then(async () => {
		await previous?.settled;
		if (activeAtomicUploads.get(key) !== active || pendingUploadClaims.get(key) !== armId) throw controller.signal.reason ?? /* @__PURE__ */ new Error("File upload was superseded by another waiter");
		controller.signal.throwIfAborted();
		const page = await Promise.race([getPageForTargetId(opts), aborted]);
		if (activeAtomicUploads.get(key) !== active || pendingUploadClaims.get(key) !== armId) throw controller.signal.reason ?? /* @__PURE__ */ new Error("File upload was superseded by another waiter");
		controller.signal.throwIfAborted();
		started = true;
		const state = ensurePageState(page);
		state.armIdUpload = armId;
		let resolveChooser;
		let rejectChooser;
		const chooserPromise = new Promise((resolve, reject) => {
			resolveChooser = resolve;
			rejectChooser = reject;
		});
		chooserPromise.catch(() => {});
		let chooser;
		let chooserListening = true;
		const onChooser = (observed) => {
			if (chooser) return;
			chooser = observed;
			page.off("filechooser", onChooser);
			chooserListening = false;
			resolveChooser(observed);
		};
		page.on("filechooser", onChooser);
		let phase = "idle";
		let abortCleanup;
		const onAbort = () => {
			const reason = controller.signal.reason ?? /* @__PURE__ */ new Error("File upload aborted");
			rejectChooser(reason);
			if (phase === "click" || phase === "setFiles") abortCleanup ??= forceDisconnectPlaywrightForTarget({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				ssrfPolicy: opts.ssrfPolicy,
				reason: "file upload aborted"
			}).catch(() => {});
		};
		controller.signal.addEventListener("abort", onAbort, { once: true });
		if (controller.signal.aborted) onAbort();
		try {
			controller.signal.throwIfAborted();
			phase = "click";
			await clickViaPlaywright({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				ref: opts.ref,
				timeoutMs: Math.max(1, deadline - Date.now()),
				ssrfPolicy: opts.ssrfPolicy,
				browserProxyMode: opts.browserProxyMode,
				resolvedPage: page
			});
			phase = "chooser";
			chooser = await chooserPromise;
			if (state.armIdUpload !== armId) throw new Error("File upload was superseded by another waiter");
			controller.signal.throwIfAborted();
			phase = "validation";
			const uploadPathsResult = await Promise.race([resolveStrictExistingUploadPaths({ requestedPaths: opts.paths }), aborted]);
			if (!uploadPathsResult.ok) throw new Error(uploadPathsResult.error);
			controller.signal.throwIfAborted();
			phase = "setFiles";
			try {
				await setFileChooserFilesViaPlaywright({
					cdpUrl: opts.cdpUrl,
					targetId: opts.targetId,
					page,
					fileChooser: chooser,
					paths: uploadPathsResult.paths,
					timeoutMs: Math.max(1, deadline - Date.now()),
					browserFilesystemLocal: opts.browserFilesystemLocal,
					ssrfPolicy: opts.ssrfPolicy,
					browserProxyMode: opts.browserProxyMode
				});
			} finally {
				phase = "idle";
			}
			controller.signal.throwIfAborted();
		} catch (error) {
			throw controller.signal.aborted ? controller.signal.reason : error;
		} finally {
			controller.signal.removeEventListener("abort", onAbort);
			if (chooserListening) page.off("filechooser", onChooser);
			if (state.armIdUpload === armId) state.armIdUpload = bumpUploadArmId();
			await abortCleanup;
		}
	});
	const settled = execution.then(() => {}, () => {});
	const active = {
		controller,
		settled
	};
	activeAtomicUploads.set(key, active);
	previous?.controller.abort(/* @__PURE__ */ new Error("File upload was superseded by another waiter"));
	settled.then(() => {
		controller.signal.removeEventListener("abort", rejectOnAbort);
		if (activeAtomicUploads.get(key) === active) activeAtomicUploads.delete(key);
		if (pendingUploadClaims.get(key) === armId) pendingUploadClaims.delete(key);
	});
	try {
		await Promise.race([execution, queuedAbort]);
	} finally {
		clearTimeout(timer);
		opts.signal?.removeEventListener("abort", abortFromCaller);
	}
}
/** Accepts or dismisses a pending dialog, or arms the next matching dialog response. */
async function armDialogViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS);
	try {
		await respondToObservedDialogOnPage({
			page,
			accept: opts.accept,
			closedBy: "agent",
			...opts.dialogId !== void 0 ? { dialogId: opts.dialogId } : {},
			...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
		});
		return;
	} catch (err) {
		if (opts.dialogId || err instanceof Error && !err.message.includes("No dialog is pending")) throw err;
	}
	armObservedDialogResponseOnPage({
		page,
		accept: opts.accept,
		timeoutMs: timeout,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
	});
}
/** Waits for the next page download and writes it under the configured output root. */
async function waitForDownloadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const capture = createExplicitDownloadCapture({
		page,
		state: ensurePageState(page),
		timeoutMs: normalizeTimeoutMs(opts.timeoutMs, 12e4),
		outPath: opts.path,
		rootDir: opts.path?.trim() ? opts.rootDir : opts.rootDir ?? resolveImplicitDownloadRoot()
	});
	try {
		return await capture.promise;
	} catch (err) {
		capture.cancel();
		throw err;
	}
}
/** Clicks an element ref and saves the download triggered by that click. */
async function downloadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	const ref = requireRef(opts.ref);
	const outPath = opts.path?.trim() ?? "";
	if (!outPath) throw new Error("path is required");
	const capture = createExplicitDownloadCapture({
		page,
		state,
		timeoutMs: timeout,
		outPath,
		rootDir: opts.rootDir
	});
	try {
		const locator = refLocator(page, ref);
		try {
			await locator.click({ timeout });
		} catch (err) {
			throw toAIFriendlyError(err, ref);
		}
		return await capture.promise;
	} catch (err) {
		capture.cancel();
		throw err;
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.responses.ts
/**
* Response-body retrieval for Playwright-backed browser tools.
*/
/** Waits for a response URL pattern and returns a bounded text body. */
async function responseBodyViaPlaywright(opts) {
	const pattern = normalizeOptionalString(opts.url) ?? "";
	if (!pattern) throw new Error("url is required");
	const maxChars = typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars) ? Math.max(1, Math.min(5e6, Math.floor(opts.maxChars))) : 2e5;
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	const maxBytes = maxChars * 4;
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const resp = await new Promise((resolve, reject) => {
		let done = false;
		let timer;
		const cleanup = () => {
			if (timer) clearTimeout(timer);
			timer = void 0;
			if (handler) page.off("response", handler);
		};
		const handler = (resp) => {
			if (done) return;
			const u = resp.url?.() || "";
			if (!matchBrowserUrlPattern(pattern, u)) return;
			done = true;
			cleanup();
			resolve(resp);
		};
		page.on("response", handler);
		timer = setTimeout(() => {
			if (done) return;
			done = true;
			cleanup();
			reject(/* @__PURE__ */ new Error(`Response not found for url pattern "${pattern}". Run 'openclaw browser requests' to inspect recent network activity.`));
		}, timeout);
	});
	const url = resp.url?.() || "";
	const status = resp.status?.();
	const headers = resp.headers?.();
	let bodyText = "";
	let bodyByteLength = 0;
	try {
		if (typeof resp.body === "function") {
			const buf = await resp.body();
			bodyByteLength = buf.byteLength;
			bodyText = new TextDecoder("utf-8").decode(buf.subarray(0, maxBytes));
		}
	} catch (err) {
		throw new Error(`Failed to read response body for "${url}": ${String(err)}`, { cause: err });
	}
	return {
		url,
		status,
		headers,
		body: bodyText.length > maxChars ? truncateUtf16Safe(bodyText, maxChars) : bodyText,
		truncated: bodyByteLength > maxBytes || bodyText.length > maxChars ? true : void 0
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.state.ts
/**
* Browser context and emulation state helpers for Playwright-backed tools.
*/
const { devices: playwrightDevices } = playwrightCore;
function resolvePageEmulationState(state) {
	return state.emulation ??= {};
}
function resolvePageEmulationSession(page, state) {
	const emulation = resolvePageEmulationState(state);
	if (emulation.session) return emulation.session;
	const pending = page.context().newCDPSession(page);
	emulation.session = pending;
	pending.catch(() => {
		if (emulation.session === pending) delete emulation.session;
	});
	return pending;
}
async function withPageEmulationCdpClient(params) {
	const session = await resolvePageEmulationSession(params.page, params.state);
	return await params.run((method, values) => session.send(method, values));
}
async function runDeviceTransition(params) {
	params.signal?.throwIfAborted();
	const emulation = resolvePageEmulationState(params.state);
	const transition = (emulation.deviceTransitionTail ?? Promise.resolve()).catch(() => {}).then(async () => {
		params.signal?.throwIfAborted();
		await params.run();
	});
	const tail = transition.catch(() => {});
	emulation.deviceTransitionTail = tail;
	try {
		await transition;
	} finally {
		if (emulation.deviceTransitionTail === tail) delete emulation.deviceTransitionTail;
	}
}
/** Toggles offline mode for the target page context. */
async function setOfflineViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.context().setOffline(opts.offline);
}
/** Replaces extra HTTP headers for the target page context. */
async function setExtraHTTPHeadersViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.context().setExtraHTTPHeaders(opts.headers);
}
/** Sets or clears HTTP basic-auth credentials for the target page context. */
async function setHttpCredentialsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.clear) {
		await page.context().setHTTPCredentials(null);
		return;
	}
	const username = opts.username ?? "";
	const password = opts.password ?? "";
	if (!username) throw new Error("username is required (or set clear=true)");
	await page.context().setHTTPCredentials({
		username,
		password
	});
}
/** Sets or clears geolocation and grants page-origin geolocation permission. */
async function setGeolocationViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const context = page.context();
	if (opts.clear) {
		await context.setGeolocation(null);
		await context.clearPermissions().catch(() => {});
		return;
	}
	if (typeof opts.latitude !== "number" || typeof opts.longitude !== "number") throw new Error("latitude and longitude are required (or set clear=true)");
	await context.setGeolocation({
		latitude: opts.latitude,
		longitude: opts.longitude,
		accuracy: typeof opts.accuracy === "number" ? opts.accuracy : void 0
	});
	const origin = normalizeOptionalString(opts.origin) || (() => {
		try {
			return new URL(page.url()).origin;
		} catch {
			return "";
		}
	})();
	if (origin) await context.grantPermissions(["geolocation"], { origin }).catch(() => {});
}
/** Emulates the requested media color scheme on the target page. */
async function emulateMediaViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.emulateMedia({ colorScheme: opts.colorScheme });
}
/** Applies a locale override through page-scoped CDP. */
async function setLocaleViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const pageState = ensurePageState(page);
	const locale = normalizeOptionalString(opts.locale) ?? "";
	if (!locale) throw new Error("locale is required");
	await withPageEmulationCdpClient({
		page,
		state: pageState,
		run: async (send) => {
			try {
				await send("Emulation.setLocaleOverride", { locale });
			} catch (err) {
				if (String(err).includes("Another locale override is already in effect")) return;
				throw err;
			}
		}
	});
}
/** Applies a timezone override through page-scoped CDP. */
async function setTimezoneViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const pageState = ensurePageState(page);
	const timezoneId = normalizeOptionalString(opts.timezoneId) ?? "";
	if (!timezoneId) throw new Error("timezoneId is required");
	await withPageEmulationCdpClient({
		page,
		state: pageState,
		run: async (send) => {
			try {
				await send("Emulation.setTimezoneOverride", { timezoneId });
			} catch (err) {
				const msg = String(err);
				if (msg.includes("Timezone override is already in effect")) return;
				if (msg.includes("Invalid timezone")) throw new Error(`Invalid timezone ID: ${timezoneId}`, { cause: err });
				throw err;
			}
		}
	});
}
/** Applies a Playwright device descriptor to viewport, user agent, and touch state. */
async function setDeviceViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const pageState = ensurePageState(page);
	const name = normalizeOptionalString(opts.name) ?? "";
	if (!name) throw new Error("device name is required");
	const descriptor = playwrightDevices[name];
	if (!descriptor) throw new Error(`Unknown device "${name}".`);
	await runDeviceTransition({
		page,
		state: pageState,
		signal: opts.signal,
		run: async () => {
			const screen = descriptor.screen ?? descriptor.viewport;
			const isLandscape = screen.width > screen.height;
			await page.setViewportSize({
				width: descriptor.viewport.width,
				height: descriptor.viewport.height
			});
			await withPageEmulationCdpClient({
				page,
				state: pageState,
				run: async (send) => {
					await send("Emulation.setUserAgentOverride", { userAgent: descriptor.userAgent });
					await send("Emulation.setDeviceMetricsOverride", {
						mobile: descriptor.isMobile,
						width: descriptor.viewport.width,
						height: descriptor.viewport.height,
						deviceScaleFactor: descriptor.deviceScaleFactor,
						screenWidth: screen.width,
						screenHeight: screen.height,
						screenOrientation: descriptor.isMobile && !isLandscape ? {
							angle: 0,
							type: "portraitPrimary"
						} : {
							angle: descriptor.isMobile ? 90 : 0,
							type: "landscapePrimary"
						}
					});
					await send("Emulation.setTouchEmulationEnabled", { enabled: descriptor.hasTouch });
				}
			});
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.storage.ts
/**
* Cookie and Web Storage helpers for Playwright-backed browser tools.
*/
/** Returns cookies visible to the target browser context. */
async function cookiesGetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	return { cookies: await page.context().cookies() };
}
/** Adds or replaces a cookie in the target browser context. */
async function cookiesSetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const cookie = opts.cookie;
	if (!cookie.name || cookie.value === void 0) throw new Error("cookie name and value are required");
	const hasUrl = typeof cookie.url === "string" && cookie.url.trim();
	const hasDomainPath = typeof cookie.domain === "string" && cookie.domain.trim() && typeof cookie.path === "string" && cookie.path.trim();
	if (!hasUrl && !hasDomainPath) throw new Error("cookie requires url, or domain+path");
	await page.context().addCookies([cookie]);
}
/**
* Add cookies in bounded batches on one browser context. On a batch error, retry
* that batch cookie-by-cookie so one cookie Playwright rejects neither drops the
* whole batch nor aborts the import. Returns the count actually added so callers
* can report rejects instead of leaving an ambiguous partial write.
*/
async function cookiesSetManyViaPlaywright(opts) {
	opts.signal?.throwIfAborted();
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const context = page.context();
	let added = 0;
	for (let index = 0; index < opts.cookies.length; index += 500) {
		opts.signal?.throwIfAborted();
		const batch = opts.cookies.slice(index, index + 500);
		try {
			await context.addCookies(batch);
			added += batch.length;
		} catch {
			for (const cookie of batch) {
				opts.signal?.throwIfAborted();
				try {
					await context.addCookies([cookie]);
					added += 1;
				} catch {}
			}
		}
	}
	opts.signal?.throwIfAborted();
	return { added };
}
/** Clears cookies in the target browser context. */
async function cookiesClearViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.context().clearCookies();
}
/** Reads localStorage or sessionStorage values from the target page. */
async function storageGetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const kind = opts.kind;
	const key = readStringValue(opts.key);
	return { values: await page.evaluate(({ kind: kind2, key: key2 }) => {
		const store = kind2 === "session" ? window.sessionStorage : window.localStorage;
		if (key2) {
			const value = store.getItem(key2);
			return value === null ? {} : { [key2]: value };
		}
		const out = {};
		for (let i = 0; i < store.length; i += 1) {
			const k = store.key(i);
			if (!k) continue;
			const v = store.getItem(k);
			if (v !== null) out[k] = v;
		}
		return out;
	}, {
		kind,
		key
	}) ?? {} };
}
/** Writes one localStorage or sessionStorage value on the target page. */
async function storageSetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const key = opts.key;
	if (!key) throw new Error("key is required");
	await page.evaluate(({ kind, key: k, value }) => {
		(kind === "session" ? window.sessionStorage : window.localStorage).setItem(k, value);
	}, {
		kind: opts.kind,
		key,
		value: opts.value
	});
}
/** Clears localStorage or sessionStorage on the target page. */
async function storageClearViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.evaluate(({ kind }) => {
		(kind === "session" ? window.sessionStorage : window.localStorage).clear();
	}, { kind: opts.kind });
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.trace.ts
/**
* Playwright trace lifecycle helpers for Browser plugin diagnostics.
*/
/** Starts Playwright tracing for the target page context. */
async function traceStartViaPlaywright(opts) {
	const context = (await getPageForTargetId(opts)).context();
	const ctxState = ensureContextState(context);
	if (ctxState.traceActive) throw new Error("Trace already running. Stop the current trace before starting a new one.");
	await context.tracing.start({
		screenshots: opts.screenshots ?? true,
		snapshots: opts.snapshots ?? true,
		sources: opts.sources ?? false
	});
	ctxState.traceActive = true;
}
/** Stops Playwright tracing and returns the committed trace zip path. */
async function traceStopViaPlaywright(opts) {
	const context = (await getPageForTargetId(opts)).context();
	const ctxState = ensureContextState(context);
	if (!ctxState.traceActive) throw new Error("No active trace. Start a trace before stopping it.");
	return await writeExternalFileWithinOutputRoot({
		rootDir: DEFAULT_TRACE_DIR,
		path: opts.path,
		write: async (tempPath) => {
			await context.tracing.stop({ path: tempPath });
			ctxState.traceActive = false;
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-ai.ts
/** Playwright-backed browser helpers loaded as one optional runtime object. */
const pwAi = {
	closePageByTargetIdViaPlaywright,
	closePlaywrightBrowserConnection,
	retirePlaywrightBrowserConnection,
	retirePlaywrightBrowserConnectionExact,
	createPageViaPlaywright,
	ensurePageState,
	forceDisconnectPlaywrightForTarget,
	focusPageByTargetIdViaPlaywright,
	createObservedDialogAbortSignalForPage,
	getObservedBrowserStateForPage,
	getObservedBrowserStateViaPlaywright,
	getMainFrameDocumentIdentityViaPlaywright,
	getPageForTargetId,
	isBrowserObservedDialogBlockedError,
	listPagesViaPlaywright,
	markObservedDialogsHandledRemotelyForPage,
	refLocator,
	respondToObservedDialogOnPage,
	armDialogViaPlaywright,
	armFileUploadViaPlaywright,
	batchViaPlaywright,
	clickViaPlaywright,
	closePageViaPlaywright,
	cookiesClearViaPlaywright,
	cookiesGetViaPlaywright,
	cookiesSetManyViaPlaywright,
	cookiesSetViaPlaywright,
	downloadViaPlaywright,
	dragViaPlaywright,
	emulateMediaViaPlaywright,
	evaluateViaPlaywright,
	executeActViaPlaywright,
	fillFormViaPlaywright,
	getConsoleMessagesViaPlaywright,
	getNetworkRequestsViaPlaywright,
	getPageErrorsViaPlaywright,
	highlightViaPlaywright,
	hoverViaPlaywright,
	navigateViaPlaywright,
	pdfViaPlaywright,
	pressKeyViaPlaywright,
	resizeViewportViaPlaywright,
	responseBodyViaPlaywright,
	scrollIntoViewViaPlaywright,
	selectOptionViaPlaywright,
	setDeviceViaPlaywright,
	setExtraHTTPHeadersViaPlaywright,
	setGeolocationViaPlaywright,
	setHttpCredentialsViaPlaywright,
	setInputFilesViaPlaywright,
	setLocaleViaPlaywright,
	setOfflineViaPlaywright,
	setTimezoneViaPlaywright,
	snapshotAiViaPlaywright,
	snapshotAriaViaPlaywright,
	snapshotRoleViaPlaywright,
	storeAriaSnapshotRefsViaPlaywright,
	screenshotWithLabelsViaPlaywright,
	storageClearViaPlaywright,
	storageGetViaPlaywright,
	storageSetViaPlaywright,
	takeScreenshotViaPlaywright,
	traceStartViaPlaywright,
	traceStopViaPlaywright,
	typeViaPlaywright,
	uploadViaPlaywright,
	waitForDownloadViaPlaywright,
	waitForViaPlaywright
};
//#endregion
export { pwAi };
