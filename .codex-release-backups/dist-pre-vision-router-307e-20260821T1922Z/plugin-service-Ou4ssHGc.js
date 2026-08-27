import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { F as resolveTimerTimeoutMs, N as resolveOptionalIntegerOption, a as addTimerTimeoutGraceMs, m as clampTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-oCkfUEEq.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { _ as readToolStringParam, d as readNonNegativeIntegerParam, o as imageResultFromFile, p as readPositiveIntegerParam } from "./common-BGOZLJ2_.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { d as saveMediaBuffer } from "./store-CNsqBmYb.js";
import { t as callGatewayTool } from "./gateway-IJglwWNi.js";
import { a as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-BV5DLgUC.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-Cru_no7H.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-LRU688AB.js";
import "./media-store-DwVYtNFY.js";
import { t as startLazyPluginServiceModule } from "./plugin-runtime-NSNAAoKx.js";
import { t as parseGatewayPayload } from "./server-json-CUC0gj3q.js";
import { n as respondUnavailableOnNodeInvokeError } from "./nodes.helpers-CkPbEFOM.js";
import { t as describeImageFile } from "./runtime-DX1IaRYA.js";
import "./param-readers-BF3rNe0k.js";
import { n as BROWSER_PROXY_UPLOAD_COMMAND, r as browserProxyUploadUnavailableMessage, t as BROWSER_PROXY_COMMAND } from "./browser-node-commands-CIbUPKdY.js";
import { a as parseBrowserTabToolBinding, i as applyBrowserTabToolBinding, n as BrowserToolSchema, r as describeBrowserTool, t as BrowserToolOutputSchema } from "./browser-tool.schema-B9msxQvK.js";
import { i as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, r as DEFAULT_AI_SNAPSHOT_MAX_CHARS } from "./constants-0X-2im2J.js";
import { l as resolveBrowserActRequestTimeoutMs, u as resolveBrowserNavigationTimeoutMs } from "./act-policy-BrghP9Kf.js";
import { a as resolveProfile, l as resolveExistingUploadPaths, r as resolveBrowserConfig } from "./config-DqhZ9eIx.js";
import { X as withTimeout } from "./tmp-openclaw-dir-CQvAbCRW.js";
import "./errors-DVJFzD7N.js";
import { P as parseBrowserNavigationUrl } from "./chrome-CerjrCF5.js";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-BlUTzZZq.js";
import "./sdk-setup-tools-HQbRkkdy.js";
import { C as fetchBrowserJson, S as BrowserServiceError, _ as browserStatus, a as untrackSessionBrowserTab, d as browserImportProfile, f as browserOpenTab, g as browserStart, h as browserSnapshot, i as trackSessionBrowserTab, l as browserDoctor, o as browserCloseTab, p as browserProfiles, r as touchSessionBrowserTab, u as browserFocusTab, v as browserStop, x as browserTabs, y as browserSystemProfiles } from "./session-tab-registry-DzT1jzwh.js";
import { _ as prepareBrowserProxyUploadRequest, a as persistBrowserProxyFiles, c as browserAct, d as browserDownload, f as browserNavigate, g as isBrowserProxyUploadRequest, i as applyBrowserProxyPaths, l as browserArmDialog, m as browserWaitForDownload, o as browserConsoleMessages, p as browserScreenshotAction, s as browserPdfSave, u as browserArmFileChooser, v as BROWSER_PROXY_ERROR_ENVELOPE, y as parseBrowserProxyFailure } from "./core-api-CVCqsZwk.js";
import { i as DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES, o as normalizeBrowserScreenshot, r as parseSystemProfileDomains } from "./routes-Bp-g4UDO.js";
import { t as createBrowserControlContext } from "./browser-control-state-Bv6MNTSF.js";
import { a as resolveRequestedBrowserProfile, n as isBrowserHostLocalRoute, r as isPersistentBrowserProfileMutation, t as createBrowserRouteDispatcher } from "./dispatcher-CzWONwaW.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-DTEoMP8u.js";
import crypto from "node:crypto";
import path from "node:path";
import { readFile } from "node:fs/promises";
//#region extensions/browser/src/browser-node-fallback.ts
/**
* Browser-node fallback classification.
*
* Only the node host's explicit pre-dispatch reachability failure is safe to
* retry on the Gateway host. Other failures may follow a mutating action.
*/
const BROWSER_CONTROL_HOST_UNREACHABLE = /\bbrowser control host is not reachable\b/i;
function isBrowserControlHostUnavailableError(value) {
	const seen = /* @__PURE__ */ new Set();
	const visit = (candidate, depth) => {
		if (typeof candidate === "string") return BROWSER_CONTROL_HOST_UNREACHABLE.test(candidate);
		if (!candidate || typeof candidate !== "object" || depth > 3 || seen.has(candidate)) return false;
		seen.add(candidate);
		const record = candidate;
		if (typeof record.message === "string" && BROWSER_CONTROL_HOST_UNREACHABLE.test(record.message)) return true;
		return [
			record.error,
			record.cause,
			record.details,
			record.nodeError
		].some((entry) => visit(entry, depth + 1));
	};
	return visit(value, 0);
}
//#endregion
//#region extensions/browser/src/browser/screenshot-sharing.ts
/** Stages a bounded screenshot copy in the sandbox-authorized outbound store. */
async function stageBrowserScreenshotForSharing(filePath, maxDimensionPx) {
	const normalized = await normalizeBrowserScreenshot(await readFile(filePath), {
		maxSide: maxDimensionPx ?? 2e3,
		maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES
	});
	return (await saveMediaBuffer(normalized.buffer, normalized.contentType, "outbound", DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES, path.basename(filePath))).path;
}
//#endregion
//#region extensions/browser/src/browser-tool.runtime.ts
/**
* Runtime dependency barrel for the Browser agent tool.
*
* Kept separate from browser-tool.ts so tests can mock the tool boundary while
* production still imports SDK helpers and browser client actions lazily.
*/
/** Resolve global image downscaling for screenshots returned to agent tools. */
function resolveRuntimeImageSanitization() {
	const maxDimensionPx = resolveOptionalIntegerOption(getRuntimeConfig().agents?.defaults?.imageMaxDimensionPx, { min: 1 });
	if (maxDimensionPx === void 0) return;
	return { maxDimensionPx };
}
//#endregion
//#region extensions/browser/src/browser-node-proxy.ts
const logger$1 = createSubsystemLogger("browser");
const DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 2e4;
const BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS = 5e3;
var BrowserNodeSafeFallbackError = class extends Error {
	constructor(message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BrowserNodeSafeFallbackError";
	}
};
function unwrapBrowserProxyPayload(payload) {
	if (payload?.payload !== void 0) return payload.payload;
	if (typeof payload?.payloadJSON !== "string" || !payload.payloadJSON.trim()) return null;
	try {
		return JSON.parse(payload.payloadJSON);
	} catch {
		return null;
	}
}
async function callBrowserProxy(params) {
	const proxyTimeoutMs = Math.min(resolveTimerTimeoutMs(params.timeoutMs, DEFAULT_BROWSER_PROXY_TIMEOUT_MS), MAX_TIMER_TIMEOUT_MS - 2 * BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS);
	const nodeInvokeTimeoutMs = addTimerTimeoutGraceMs(proxyTimeoutMs, BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS) ?? proxyTimeoutMs;
	const gatewayTimeoutMs = addTimerTimeoutGraceMs(nodeInvokeTimeoutMs, BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS) ?? nodeInvokeTimeoutMs;
	if (isBrowserProxyUploadRequest(params) && !params.declaredCommands.includes("browser.proxy.upload.v1")) throw new BrowserNodeSafeFallbackError(browserProxyUploadUnavailableMessage(params.pendingDeclaredCommands));
	const preparedUpload = await prepareBrowserProxyUploadRequest({
		method: params.method,
		path: params.path,
		body: params.body,
		signal: params.signal
	});
	const command = preparedUpload.upload ? BROWSER_PROXY_UPLOAD_COMMAND : BROWSER_PROXY_COMMAND;
	let payload;
	try {
		payload = await callGatewayTool("node.invoke", { timeoutMs: gatewayTimeoutMs }, {
			nodeId: params.nodeId,
			command,
			timeoutMs: nodeInvokeTimeoutMs,
			params: {
				method: params.method,
				path: params.path,
				query: params.query,
				body: preparedUpload.body,
				upload: preparedUpload.upload,
				timeoutMs: proxyTimeoutMs,
				profile: params.profile,
				errorEnvelope: BROWSER_PROXY_ERROR_ENVELOPE
			},
			idempotencyKey: crypto.randomUUID()
		}, {
			scopes: ["operator.admin"],
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.allowAutomaticHostFallback && isBrowserControlHostUnavailableError(error)) throw new BrowserNodeSafeFallbackError("browser node control host unavailable", error);
		throw error;
	}
	const parsed = unwrapBrowserProxyPayload(payload);
	const failure = parseBrowserProxyFailure(parsed);
	if (failure) {
		const { status, body } = failure.error;
		throw new BrowserServiceError(body.error, "reason" in body ? body : void 0, status);
	}
	if (!parsed || typeof parsed !== "object" || !("result" in parsed)) throw new Error("browser proxy failed");
	return parsed;
}
async function callLocalBrowserControl(params) {
	const url = new URL(params.path, "http://localhost");
	for (const [key, value] of Object.entries(params.query ?? {})) if (value !== void 0) url.searchParams.set(key, String(value));
	if (params.profile) url.searchParams.set("profile", params.profile);
	return await fetchBrowserJson(`${url.pathname}${url.search}`, {
		method: params.method,
		body: params.body === void 0 ? void 0 : JSON.stringify(params.body),
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
function createBrowserNodeProxyRequest(params) {
	let hostFallbackActive = false;
	const dispatch = async (request) => {
		const requestWithSignal = request.signal || params.signal ? {
			...request,
			signal: request.signal ?? params.signal
		} : request;
		if (hostFallbackActive) return await callLocalBrowserControl(requestWithSignal);
		try {
			const proxy = await callBrowserProxy({
				nodeId: params.nodeTarget.nodeId,
				declaredCommands: params.nodeTarget.commands ?? [],
				pendingDeclaredCommands: params.nodeTarget.pendingDeclaredCommands ?? [],
				allowAutomaticHostFallback: params.allowAutomaticHostFallback,
				...requestWithSignal
			});
			const mapping = await persistBrowserProxyFiles(proxy.files);
			applyBrowserProxyPaths(proxy.result, mapping);
			return proxy.result;
		} catch (error) {
			if (!params.allowAutomaticHostFallback || !(error instanceof BrowserNodeSafeFallbackError)) throw error;
			hostFallbackActive = true;
			logger$1.warn(`browser node ${params.nodeTarget.label ?? params.nodeTarget.nodeId} unavailable before dispatch (${error.message}); falling back to Gateway host`);
			return await callLocalBrowserControl(requestWithSignal);
		}
	};
	return Object.assign(dispatch, { isHostFallbackActive: () => hostFallbackActive });
}
//#endregion
//#region extensions/browser/src/browser-node-routing.ts
/** Shared browser-node selection for agent tools and Gateway requests. */
/** Select the same authorized browser-capable node on every request surface. */
function resolveBrowserNodeTarget(params) {
	const mode = params.policy?.mode ?? "auto";
	const explicit = params.explicitTarget || Boolean(params.requestedNode?.trim());
	if (mode === "off") {
		if (explicit) throw new Error("Node browser proxy is disabled (gateway.nodes.browser.mode=off).");
		return null;
	}
	const requested = params.requestedNode?.trim() || params.policy?.node?.trim();
	if (mode === "manual" && !explicit && !requested) return null;
	const browserNodes = params.nodes.filter((node) => {
		if (params.requireConnected && !node.connected) return false;
		return node.caps?.includes("browser") || node.commands?.includes("browser.proxy");
	});
	if (browserNodes.length === 0) {
		if (explicit || requested) throw new Error("No connected browser-capable nodes.");
		return null;
	}
	if (requested) {
		const nodeId = resolveNodeIdFromList(browserNodes, requested, false, { allowCompactDisplayName: true });
		return browserNodes.find((node) => node.nodeId === nodeId) ?? null;
	}
	if (browserNodes.length === 1) return browserNodes[0] ?? null;
	if (explicit) throw new Error(`Multiple browser-capable nodes connected (${browserNodes.length}). Set gateway.nodes.browser.node or pass node=<id>.`);
	return null;
}
//#endregion
//#region extensions/browser/src/browser-tool-session-tabs.ts
/**
* Session tracking for tabs created through the browser tool.
*/
function readOpenedTab(result) {
	if (!result || typeof result !== "object" || Array.isArray(result)) return { aliases: [] };
	const opened = result;
	const targetId = normalizeOptionalString(opened.targetId);
	const aliases = [
		targetId,
		normalizeOptionalString(opened.tabId),
		normalizeOptionalString(opened.label),
		normalizeOptionalString(opened.suggestedTargetId)
	].filter((alias) => Boolean(alias));
	const profile = normalizeOptionalString(opened.resolvedProfile);
	const rawOwnership = opened.ownership && typeof opened.ownership === "object" ? opened.ownership : void 0;
	const ownership = rawOwnership?.status === "durable" && !profile ? void 0 : rawOwnership;
	return {
		targetId,
		aliases: [...new Set(aliases)],
		profile,
		ownership
	};
}
function stripBrowserOpenInternalMetadata(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	const { ownership: _ownership, resolvedProfile: _resolvedProfile, ...agentVisible } = value;
	return agentVisible;
}
async function trackOpenedBrowserTab(params) {
	const opened = readOpenedTab(params.result);
	const profile = opened.profile ?? params.fallbackProfile;
	try {
		params.track({
			sessionKey: params.sessionKey,
			targetId: opened.targetId,
			baseUrl: params.baseUrl,
			profile,
			...params.fallbackProfile && opened.profile && opened.profile !== params.fallbackProfile ? { profileAliases: [params.fallbackProfile] } : {},
			ownership: params.baseUrl ? void 0 : opened.ownership,
			aliases: opened.aliases
		});
	} catch (trackingError) {
		if (!opened.targetId) throw trackingError;
		try {
			await params.closeTab(opened.targetId, profile);
		} catch (closeError) {
			throw Object.assign(new Error("Failed to register browser tab cleanup and close the newly opened tab", { cause: closeError }), {
				name: "BrowserTabTrackingCompensationError",
				errors: [trackingError, closeError]
			});
		}
		throw trackingError;
	}
}
function createBrowserToolSessionTabs(params) {
	const profile = params.requestedProfile ?? params.defaultProfile;
	const isTrackedRoute = () => !params.isHostFallbackActive || params.isHostFallbackActive();
	const trackedBaseUrl = () => params.isHostFallbackActive ? void 0 : params.baseUrl;
	const trackedProfile = () => trackedBaseUrl() && !params.requestedProfile ? void 0 : profile;
	const identity = (targetId) => ({
		sessionKey: params.sessionKey,
		targetId,
		baseUrl: trackedBaseUrl(),
		profile: trackedProfile()
	});
	return {
		touch: (targetId) => {
			if (targetId && isTrackedRoute()) params.registry.touchSessionBrowserTab(identity(targetId));
		},
		untrack: (targetId) => {
			if (targetId && isTrackedRoute()) params.registry.untrackSessionBrowserTab(identity(targetId));
		},
		trackOpened: async (result, closeTab) => {
			if (!isTrackedRoute()) return;
			const baseUrl = trackedBaseUrl();
			await trackOpenedBrowserTab({
				result,
				sessionKey: params.sessionKey,
				fallbackProfile: baseUrl && !params.requestedProfile ? void 0 : profile,
				baseUrl,
				track: params.registry.trackSessionBrowserTab,
				closeTab
			});
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/vision.ts
/**
* Browser screenshot description helpers built on the shared media image
* understanding contract. No browser-specific model registry lives here.
*/
/** Default prompt for turning browser screenshots into text-only page context. */
const DEFAULT_BROWSER_SCREENSHOT_DESCRIPTION_PROMPT = "Describe what is visible in this browser screenshot. Capture page layout, headings, primary content blocks, visible text, and notable interactive elements so a text-only assistant can reason about the page.";
function normalizeActiveModel(activeModel) {
	const provider = activeModel?.provider?.trim();
	if (!provider) return;
	const model = activeModel?.model?.trim();
	return model ? {
		provider,
		model
	} : { provider };
}
async function resolveImageUnderstandingFilePath(ctx, deps) {
	const maxDimensionPx = ctx.imageSanitization?.maxDimensionPx;
	if (typeof maxDimensionPx !== "number" || !Number.isFinite(maxDimensionPx)) return ctx.filePath;
	const source = await readFile(ctx.filePath);
	const normalized = await deps.normalizeBrowserScreenshot(source, { maxSide: Math.max(1, Math.floor(maxDimensionPx)) });
	if (normalized.buffer === source) return ctx.filePath;
	return (await deps.saveMediaBuffer(normalized.buffer, normalized.contentType ?? "image/jpeg", "browser")).path;
}
/** Produces a text description for a browser screenshot, or null when no text was produced. */
async function describeBrowserScreenshot(ctx, deps) {
	const filePath = await resolveImageUnderstandingFilePath(ctx, deps);
	const described = await deps.describeImageFile({
		filePath,
		cfg: ctx.cfg,
		prompt: DEFAULT_BROWSER_SCREENSHOT_DESCRIPTION_PROMPT,
		agentDir: ctx.agentDir,
		workspaceDir: ctx.workspaceDir,
		activeModel: normalizeActiveModel(ctx.activeModel),
		scopeContext: ctx.mediaScope
	});
	const text = described.text?.trim();
	if (!text) return null;
	return {
		text,
		provider: described.provider,
		model: described.model,
		decision: described.decision
	};
}
/** Neutralizes model-generated MEDIA directives before feeding text back to tools. */
function neutralizeMediaDirectives(text) {
	if (!text || !/media:/i.test(text)) return text;
	const lines = text.split("\n");
	let changed = false;
	for (const [i, line] of lines.entries()) {
		const leading = line.length - line.trimStart().length;
		const rest = line.slice(leading);
		if (/^MEDIA:/i.test(rest)) {
			lines[i] = `${line.slice(0, leading)}[neutralized] ${rest}`;
			changed = true;
		}
	}
	return changed ? lines.join("\n") : text;
}
//#endregion
//#region extensions/browser/src/browser-tool.snapshot.ts
/** Wrap page-controlled JSON payloads as untrusted browser content. */
function wrapBrowserExternalJson(params) {
	return {
		wrappedText: wrapExternalContent(JSON.stringify(params.payload, (_key, value) => typeof value === "string" ? neutralizeMediaDirectives(value) : value, 2), {
			source: "browser",
			includeWarning: params.includeWarning ?? true
		}),
		safeDetails: {
			ok: true,
			externalContent: {
				untrusted: true,
				source: "browser",
				kind: params.kind,
				wrapped: true
			}
		}
	};
}
function isAriaRefsUnsupportedError(err) {
	const msg = String(err).toLowerCase();
	return msg.includes("refs=aria") && msg.includes("not support");
}
function withRoleRefsFallback(snapshotQuery) {
	return {
		...snapshotQuery,
		refs: "role"
	};
}
/** Execute and format browser snapshots for agent consumption. */
async function executeSnapshotAction(params) {
	const { input, baseUrl, profile, proxyRequest } = params;
	const snapshotDefaults = getRuntimeConfig().browser?.snapshotDefaults;
	const format = input.snapshotFormat === "ai" ? "ai" : input.snapshotFormat === "aria" ? "aria" : void 0;
	const formatExplicit = format !== void 0;
	const mode = input.mode === "efficient" ? "efficient" : !formatExplicit && format !== "aria" && snapshotDefaults?.mode === "efficient" ? "efficient" : void 0;
	const labels = typeof input.labels === "boolean" ? input.labels : void 0;
	const urls = typeof input.urls === "boolean" ? input.urls : void 0;
	const refs = input.refs === "aria" || input.refs === "role" ? input.refs : void 0;
	const hasMaxChars = Object.hasOwn(input, "maxChars");
	const targetId = normalizeOptionalString(input.targetId);
	const limit = readPositiveIntegerParam(input, "limit", { message: "limit must be a positive integer." });
	const maxCharsRaw = readNonNegativeIntegerParam(input, "maxChars", { message: "maxChars must be a non-negative integer." });
	const maxChars = maxCharsRaw !== void 0 && maxCharsRaw > 0 ? maxCharsRaw : void 0;
	const interactive = typeof input.interactive === "boolean" ? input.interactive : void 0;
	const compact = typeof input.compact === "boolean" ? input.compact : void 0;
	const depth = readNonNegativeIntegerParam(input, "depth", { message: "depth must be a non-negative integer." });
	const selector = normalizeOptionalString(input.selector);
	const frame = normalizeOptionalString(input.frame);
	const resolvedMaxChars = format === "ai" ? hasMaxChars ? maxChars : mode === "efficient" ? void 0 : DEFAULT_AI_SNAPSHOT_MAX_CHARS : hasMaxChars ? maxChars : void 0;
	const snapshotTimeoutMs = readPositiveIntegerParam(input, "timeoutMs", { message: "timeoutMs must be a positive integer." }) ?? 2e4;
	const snapshotQuery = {
		...format ? { format } : {},
		targetId,
		limit,
		...typeof resolvedMaxChars === "number" ? { maxChars: resolvedMaxChars } : {},
		refs,
		interactive,
		compact,
		depth,
		selector,
		frame,
		labels,
		urls,
		mode,
		timeoutMs: snapshotTimeoutMs
	};
	let refsFallback;
	const readSnapshot = async (query) => proxyRequest ? await proxyRequest({
		method: "GET",
		path: "/snapshot",
		profile,
		query,
		timeoutMs: snapshotTimeoutMs
	}) : await browserSnapshot(baseUrl, {
		...query,
		profile
	});
	let snapshot;
	try {
		snapshot = await readSnapshot(snapshotQuery);
	} catch (err) {
		if (refs !== "aria" || !isAriaRefsUnsupportedError(err)) throw err;
		refsFallback = "role";
		snapshot = await readSnapshot(withRoleRefsFallback(snapshotQuery));
	}
	params.onTabActivity?.(readStringValue(snapshot.targetId) ?? targetId);
	if (snapshot.format === "ai") {
		const dialogStateFields = {
			...snapshot.blockedByDialog ? { blockedByDialog: true } : {},
			...snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {}
		};
		if (snapshot.blockedByDialog) {
			const wrapped = wrapBrowserExternalJson({
				kind: "snapshot",
				payload: {
					format: snapshot.format,
					targetId: snapshot.targetId,
					url: snapshot.url,
					...dialogStateFields
				}
			});
			return {
				content: [{
					type: "text",
					text: wrapped.wrappedText
				}],
				details: {
					...wrapped.safeDetails,
					format: snapshot.format,
					targetId: snapshot.targetId,
					url: snapshot.url,
					...dialogStateFields
				}
			};
		}
		const wrappedSnapshot = wrapExternalContent(neutralizeMediaDirectives(snapshot.snapshot ?? ""), {
			source: "browser",
			includeWarning: true
		});
		const safeDetails = {
			ok: true,
			format: snapshot.format,
			targetId: snapshot.targetId,
			url: snapshot.url,
			truncated: snapshot.truncated,
			newElements: snapshot.newElements,
			stats: snapshot.stats,
			refs: snapshot.refs ? Object.keys(snapshot.refs).length : void 0,
			labels: snapshot.labels,
			labelsCount: snapshot.labelsCount,
			labelsSkipped: snapshot.labelsSkipped,
			annotations: snapshot.annotations,
			imagePath: snapshot.imagePath,
			imageType: snapshot.imageType,
			refsFallback,
			...dialogStateFields,
			externalContent: {
				untrusted: true,
				source: "browser",
				kind: "snapshot",
				format: "ai",
				wrapped: true
			}
		};
		if (labels && snapshot.imagePath) return await imageResultFromFile({
			label: "browser:snapshot",
			path: snapshot.imagePath,
			extraText: wrappedSnapshot,
			details: {
				...safeDetails,
				media: { outbound: false }
			},
			imageSanitization: resolveRuntimeImageSanitization()
		});
		return {
			content: [{
				type: "text",
				text: wrappedSnapshot
			}],
			details: safeDetails
		};
	}
	{
		const wrapped = wrapBrowserExternalJson({
			kind: "snapshot",
			payload: snapshot
		});
		return {
			content: [{
				type: "text",
				text: wrapped.wrappedText
			}],
			details: {
				...wrapped.safeDetails,
				format: "aria",
				targetId: snapshot.targetId,
				url: snapshot.url,
				nodeCount: snapshot.nodes.length,
				...snapshot.blockedByDialog ? { blockedByDialog: true } : {},
				...snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {},
				externalContent: {
					untrusted: true,
					source: "browser",
					kind: "snapshot",
					format: "aria",
					wrapped: true
				}
			}
		};
	}
}
function withPageStateUnavailableHint(result, reason) {
	return {
		...result,
		content: [...result.content, {
			type: "text",
			text: `[page snapshot unavailable: ${reason}. Use action=snapshot to read the page.]`
		}]
	};
}
/**
* Attach fresh page state to the result of an action that changed the page
* document (navigate, act that navigated). The model can act on the new page
* without a follow-up snapshot call. The inline state uses the efficient
* interactive tier so the unsolicited payload stays bounded on every profile
* (mode=efficient forces the capped ai format even where the profile default
* would be an uncapped aria tree); a full snapshot stays one explicit call away.
*/
async function appendNavigatedPageState(params) {
	const hostFallbackWasActive = params.proxyRequest?.isHostFallbackActive?.() ?? false;
	let snapshot;
	try {
		snapshot = await executeSnapshotAction({
			input: {
				targetId: params.targetId,
				mode: "efficient"
			},
			baseUrl: params.baseUrl,
			profile: params.profile,
			proxyRequest: params.proxyRequest
		});
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") throw err;
		return withPageStateUnavailableHint(params.result, wrapExternalContent(neutralizeMediaDirectives(formatErrorMessage(err)), {
			source: "browser",
			includeWarning: false
		}));
	}
	if (!hostFallbackWasActive && params.proxyRequest?.isHostFallbackActive?.()) return withPageStateUnavailableHint(params.result, "the browser node became unreachable");
	const baseDetails = params.result.details && typeof params.result.details === "object" ? params.result.details : {};
	return {
		content: [...params.result.content, ...snapshot.content],
		details: {
			...baseDetails,
			pageState: snapshot.details
		}
	};
}
//#endregion
//#region extensions/browser/src/browser-tool.actions.ts
const browserToolActionDeps = {
	browserAct,
	browserConsoleMessages,
	browserDownload,
	browserTabs,
	browserWaitForDownload,
	getRuntimeConfig
};
const BROWSER_DOWNLOAD_REQUEST_TIMEOUT_SLACK_MS = 5e3;
function normalizePositiveTimeoutMs(value) {
	return readPositiveIntegerParam({ value }, "value", { message: "timeoutMs must be a positive integer." });
}
function normalizeNonNegativeDurationMs(value) {
	return readNonNegativeIntegerParam({ value }, "value", { message: "timeMs must be a non-negative integer." });
}
function supportsBrowserActTimeout(request) {
	switch (request.kind) {
		case "click":
		case "type":
		case "hover":
		case "scrollIntoView":
		case "drag":
		case "select":
		case "fill":
		case "evaluate":
		case "wait": return true;
		default: return false;
	}
}
function existingSessionRejectsActTimeout(request) {
	switch (request.kind) {
		case "type":
		case "hover":
		case "scrollIntoView":
		case "drag":
		case "select":
		case "fill": return true;
		default: return false;
	}
}
function usesExistingSessionProfile(profileName) {
	const cfg = browserToolActionDeps.getRuntimeConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const profile = resolveProfile(resolved, profileName ?? resolved.defaultProfile);
	return profile ? getBrowserProfileCapabilities(profile).usesChromeMcp : false;
}
function withConfiguredActTimeout(request, profileName) {
	const typedRequest = request;
	if (normalizePositiveTimeoutMs(typedRequest.timeoutMs) !== void 0) return request;
	if (!supportsBrowserActTimeout(request)) return request;
	if (existingSessionRejectsActTimeout(request) && usesExistingSessionProfile(profileName)) return request;
	return {
		...typedRequest,
		timeoutMs: DEFAULT_BROWSER_ACTION_TIMEOUT_MS
	};
}
function resolveActProxyTimeoutMs(request) {
	return resolveBrowserActRequestTimeoutMs(request);
}
function formatAgentTab(tab) {
	if (!tab || typeof tab !== "object") return { value: tab };
	const source = tab;
	const targetId = readStringValue(source.targetId);
	const tabId = readStringValue(source.tabId);
	const label = readStringValue(source.label);
	const suggestedTargetId = readStringValue(source.suggestedTargetId) ?? label ?? tabId ?? targetId;
	return {
		...suggestedTargetId ? { suggestedTargetId } : {},
		...tabId ? { tabId } : {},
		...label ? { label } : {},
		title: source.title,
		url: source.url,
		type: source.type,
		...targetId ? { targetId } : {},
		...source.wsUrl ? { wsUrl: source.wsUrl } : {}
	};
}
function formatTabsToolResult(tabs) {
	const formattedTabs = tabs.map((tab) => formatAgentTab(tab));
	const wrapped = wrapBrowserExternalJson({
		kind: "tabs",
		payload: { tabs: formattedTabs },
		includeWarning: false
	});
	return {
		content: [{
			type: "text",
			text: wrapped.wrappedText
		}],
		details: {
			...wrapped.safeDetails,
			tabCount: tabs.length,
			tabs: formattedTabs
		}
	};
}
/** Protect page-controlled model text while preserving the shipped structured result contract. */
function formatBrowserExternalToolResult(params) {
	const result = jsonResult(params.payload);
	const wrapped = wrapBrowserExternalJson({
		kind: params.kind,
		payload: params.payload,
		includeWarning: false
	});
	return {
		...result,
		content: [{
			type: "text",
			text: wrapped.wrappedText
		}]
	};
}
function formatConsoleToolResult(result) {
	const wrapped = wrapBrowserExternalJson({
		kind: "console",
		payload: result,
		includeWarning: false
	});
	return {
		content: [{
			type: "text",
			text: wrapped.wrappedText
		}],
		details: {
			...wrapped.safeDetails,
			targetId: readStringValue(result.targetId),
			url: readStringValue(result.url),
			messageCount: Array.isArray(result.messages) ? result.messages.length : void 0
		}
	};
}
function isChromeStaleTargetError(profile, err) {
	if (!profile) return false;
	const status = err && typeof err === "object" && "status" in err ? err.status : null;
	const msg = String(err);
	const isTabNotFound = (status === 404 || msg.includes("404:")) && msg.includes("tab not found");
	if (profile === "user") return isTabNotFound;
	const cfg = browserToolActionDeps.getRuntimeConfig();
	const browserProfile = resolveProfile(resolveBrowserConfig(cfg.browser, cfg), profile);
	if (!browserProfile || !getBrowserProfileCapabilities(browserProfile).usesChromeMcp) return false;
	return isTabNotFound;
}
function replaceStaleTargetIdInActRequest(request, targetId) {
	if (!normalizeOptionalString(request.targetId) || !targetId) return null;
	return {
		...request,
		targetId
	};
}
function canRetryChromeActAfterSoleTargetRefresh(request) {
	if (request.kind !== "wait" || normalizeNonNegativeDurationMs(request.timeMs) === void 0) return false;
	return [
		request.fn,
		request.text,
		request.textGone,
		request.selector,
		request.url,
		request.loadState
	].every((value) => !normalizeOptionalString(value));
}
async function executeTabsAction(params) {
	const { baseUrl, profile, timeoutMs, proxyRequest } = params;
	if (proxyRequest) return formatTabsToolResult(((await proxyRequest({
		method: "GET",
		path: "/tabs",
		profile,
		timeoutMs
	})).tabs ?? []).filter((tab) => !params.targetId || readStringValue(tab?.targetId) === params.targetId));
	return formatTabsToolResult((await browserToolActionDeps.browserTabs(baseUrl, {
		profile,
		timeoutMs
	})).filter((tab) => !params.targetId || readStringValue(tab.targetId) === params.targetId));
}
/** Validate the /act wire payload's abort summary once for note and page-state decisions. */
function readBrowserBatchAbort(result) {
	if (!result || typeof result !== "object") return null;
	const aborted = result.aborted;
	if (!aborted || typeof aborted !== "object") return null;
	const { reason, afterAction, url, skipped } = aborted;
	if (reason !== "navigation" && reason !== "closed" || typeof afterAction !== "number" || typeof url !== "string" || typeof skipped !== "number") return null;
	return {
		reason,
		afterAction,
		url,
		skipped
	};
}
/** True when an /act response reports a cross-document navigation. */
function actObservedNavigation(result, aborted) {
	if (aborted?.reason === "navigation") return true;
	const results = result?.results;
	return Array.isArray(results) && results.some((entry) => entry?.navigated === true);
}
/** Execute browser console retrieval and wrap page-controlled messages. */
async function executeConsoleAction(params) {
	const { input, baseUrl, profile, proxyRequest } = params;
	const level = normalizeOptionalString(input.level);
	const targetId = normalizeOptionalString(input.targetId);
	if (proxyRequest) return formatConsoleToolResult(await proxyRequest({
		method: "GET",
		path: "/console",
		profile,
		query: {
			level,
			targetId
		}
	}));
	return formatConsoleToolResult(await browserToolActionDeps.browserConsoleMessages(baseUrl, {
		level,
		targetId,
		profile
	}));
}
function resolveDownloadProxyTimeoutMs(timeoutMs) {
	return (timeoutMs ?? 12e4) + BROWSER_DOWNLOAD_REQUEST_TIMEOUT_SLACK_MS;
}
function readBrowserDownloadRequest(action, input) {
	if (action === "download") return {
		action,
		route: "/download",
		ref: readToolStringParam(input, "ref", { required: true }),
		path: readToolStringParam(input, "path", { required: true })
	};
	return {
		action,
		route: "/wait/download",
		path: readToolStringParam(input, "path")
	};
}
/** Execute explicit Browser download operations through the local or node-host path. */
async function executeDownloadAction(params) {
	const { action, input, baseUrl, profile, proxyRequest } = params;
	const targetId = normalizeOptionalString(input.targetId);
	const timeoutMs = normalizePositiveTimeoutMs(input.timeoutMs);
	const request = readBrowserDownloadRequest(action, input);
	const result = proxyRequest ? await proxyRequest({
		method: "POST",
		path: request.route,
		profile,
		timeoutMs: resolveDownloadProxyTimeoutMs(timeoutMs),
		body: request.action === "download" ? {
			ref: request.ref,
			path: request.path,
			targetId,
			timeoutMs
		} : {
			path: request.path,
			targetId,
			timeoutMs
		}
	}) : request.action === "download" ? await browserToolActionDeps.browserDownload(baseUrl, {
		ref: request.ref,
		path: request.path,
		targetId,
		timeoutMs,
		profile
	}) : await browserToolActionDeps.browserWaitForDownload(baseUrl, {
		path: request.path,
		targetId,
		timeoutMs,
		profile
	});
	params.onTabActivity?.(readStringValue(result.targetId) ?? targetId);
	return formatBrowserExternalToolResult({
		kind: "download",
		payload: result
	});
}
/** Execute browser actions with profile-aware timeout defaults and stale-tab recovery. */
async function executeActAction(params) {
	const { request, baseUrl, profile, proxyRequest } = params;
	const effectiveRequest = withConfiguredActTimeout(request, profile);
	const finishActResult = async (result, resolvedTargetId) => {
		params.onTabActivity?.(resolvedTargetId);
		const aborted = readBrowserBatchAbort(result);
		const formatted = formatActToolResult(result, aborted);
		if (!actObservedNavigation(result, aborted)) return formatted;
		return await appendNavigatedPageState({
			result: formatted,
			targetId: resolvedTargetId,
			baseUrl,
			profile,
			proxyRequest
		});
	};
	try {
		const result = proxyRequest ? await proxyRequest({
			method: "POST",
			path: "/act",
			profile,
			body: effectiveRequest,
			timeoutMs: resolveActProxyTimeoutMs(effectiveRequest)
		}) : await browserToolActionDeps.browserAct(baseUrl, effectiveRequest, { profile });
		return await finishActResult(result, readStringValue(result.targetId) ?? readStringValue(effectiveRequest.targetId));
	} catch (err) {
		if (isChromeStaleTargetError(profile, err)) {
			const tabs = proxyRequest ? (await proxyRequest({
				method: "GET",
				path: "/tabs",
				profile
			})).tabs ?? [] : await browserToolActionDeps.browserTabs(baseUrl, { profile }).catch(() => []);
			const freshTargetId = tabs.length === 1 ? readStringValue(tabs[0]?.targetId) : void 0;
			const retryRequest = freshTargetId ? replaceStaleTargetIdInActRequest(effectiveRequest, freshTargetId) : null;
			if (retryRequest && canRetryChromeActAfterSoleTargetRefresh(effectiveRequest) && tabs.length === 1) {
				const retryResult = proxyRequest ? await proxyRequest({
					method: "POST",
					path: "/act",
					profile,
					body: retryRequest,
					timeoutMs: resolveActProxyTimeoutMs(retryRequest)
				}) : await browserToolActionDeps.browserAct(baseUrl, retryRequest, { profile });
				return await finishActResult(retryResult, readStringValue(retryResult.targetId) ?? readStringValue(retryRequest.targetId));
			}
			if (!tabs.length) throw new Error(`No browser tabs found for profile="${profile}". Make sure the configured Chromium-based browser (v144+) is running and has open tabs, then retry.`, { cause: err });
			throw new Error(`Chrome tab not found (stale targetId?). Run action=tabs profile="${profile}" and use one of the returned targetIds.`, { cause: err });
		}
		throw err;
	}
}
function formatActToolResult(result, aborted) {
	const formatted = formatBrowserExternalToolResult({
		kind: "act",
		payload: result
	});
	if (!aborted) return formatted;
	const note = aborted.reason === "navigation" ? `Batch aborted after action ${aborted.afterAction} because the page navigated; ${aborted.skipped} remaining action(s) skipped. Earlier refs are stale.` : `Batch aborted after action ${aborted.afterAction} because the page or browser context closed; ${aborted.skipped} remaining action(s) skipped. Take a new snapshot before continuing.`;
	return {
		...formatted,
		content: [...formatted.content, {
			type: "text",
			text: note
		}]
	};
}
//#endregion
//#region extensions/browser/src/browser-tool.ts
/**
* Browser agent tool registration.
*
* Builds the model-facing browser tool, chooses sandbox/host/node routing, and
* maps high-level actions onto browser control client calls.
*/
const browserToolDeps = {
	browserAct,
	browserArmDialog,
	browserArmFileChooser,
	browserCloseTab,
	browserDoctor,
	browserFocusTab,
	browserImportProfile,
	browserNavigate,
	browserOpenTab,
	browserPdfSave,
	browserProfiles,
	browserSystemProfiles,
	browserScreenshotAction,
	browserStart,
	browserStatus,
	browserStop,
	describeImageFile,
	getRuntimeConfig,
	imageResultFromFile,
	listNodes,
	normalizeBrowserScreenshot,
	saveMediaBuffer,
	stageBrowserScreenshotForSharing,
	touchSessionBrowserTab,
	trackSessionBrowserTab,
	untrackSessionBrowserTab
};
function readOptionalTargetAndTimeout(params) {
	return {
		targetId: normalizeOptionalString(params.targetId),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs", { message: "timeoutMs must be a positive integer." })
	};
}
function readTargetUrlParam(params) {
	const targetUrl = readToolStringParam(params, "targetUrl") ?? readToolStringParam(params, "url", {
		required: true,
		label: "targetUrl"
	});
	parseBrowserNavigationUrl(targetUrl);
	return targetUrl;
}
function formatScreenshotShareHint(filePath) {
	return `[Screenshot saved to ${JSON.stringify(filePath)}. Use this path with the message tool to share the screenshot explicitly.]`;
}
const SCREENSHOT_SHARE_UNAVAILABLE = "[Screenshot sharing is unavailable because an outbound copy could not be prepared.]";
const LEGACY_BROWSER_ACT_REQUEST_KEYS = [
	"kind",
	"actions",
	"stopOnError",
	"targetId",
	"ref",
	"doubleClick",
	"button",
	"modifiers",
	"x",
	"y",
	"text",
	"submit",
	"slowly",
	"key",
	"delayMs",
	"startRef",
	"endRef",
	"values",
	"fields",
	"width",
	"height",
	"timeMs",
	"textGone",
	"selector",
	"url",
	"loadState",
	"fn",
	"timeoutMs"
];
const LEGACY_BROWSER_ACT_SHARED_REQUEST_KEYS = /* @__PURE__ */ new Set(["targetId"]);
function readActRequestParam(params) {
	const requestParam = params.request;
	if (requestParam && typeof requestParam === "object") {
		const request = { ...requestParam };
		const hasMismatchedKind = typeof request.kind === "string" && typeof params.kind === "string" && request.kind !== params.kind;
		for (const key of LEGACY_BROWSER_ACT_REQUEST_KEYS) {
			if (Object.hasOwn(request, key) || !Object.hasOwn(params, key)) continue;
			if (hasMismatchedKind && !LEGACY_BROWSER_ACT_SHARED_REQUEST_KEYS.has(key)) continue;
			request[key] = params[key];
		}
		return request;
	}
	if (!readToolStringParam(params, "kind")) return;
	const request = {};
	for (const key of LEGACY_BROWSER_ACT_REQUEST_KEYS) {
		if (!Object.hasOwn(params, key)) continue;
		request[key] = params[key];
	}
	return request;
}
async function resolveBrowserToolNodeTarget(params) {
	if (params.allowHostControl === false) {
		if (params.target === "node" || params.requestedNode) throw new Error("Node browser control is disabled by sandbox policy.");
		return null;
	}
	const policy = browserToolDeps.getRuntimeConfig().gateway?.nodes?.browser;
	const explicitTarget = params.target === "node";
	const requestedNode = params.requestedNode?.trim();
	if (policy?.mode === "off") {
		resolveBrowserNodeTarget({
			nodes: [],
			policy,
			requestedNode,
			explicitTarget
		});
		return null;
	}
	if (params.sandboxBridgeUrl?.trim() && !explicitTarget && !requestedNode) return null;
	if (params.target && !explicitTarget) return null;
	if (policy?.mode === "manual" && !explicitTarget && !requestedNode && !policy.node?.trim()) return null;
	const node = resolveBrowserNodeTarget({
		nodes: await browserToolDeps.listNodes({}),
		policy,
		requestedNode,
		explicitTarget,
		requireConnected: true
	});
	return node ? {
		nodeId: node.nodeId,
		label: node.displayName ?? node.remoteIp ?? node.nodeId,
		commands: node.commands ?? [],
		pendingDeclaredCommands: node.pendingDeclaredCommands ?? []
	} : null;
}
function resolveBrowserBaseUrl(params) {
	const cfg = getRuntimeConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const normalizedSandbox = params.sandboxBridgeUrl?.trim() ?? "";
	if ((params.target ?? (normalizedSandbox ? "sandbox" : "host")) === "sandbox") {
		if (!normalizedSandbox) throw new Error("Sandbox browser is unavailable. Enable agents.defaults.sandbox.browser.enabled or use target=\"host\" if allowed.");
		return normalizedSandbox.replace(/\/$/, "");
	}
	if (params.allowHostControl === false) throw new Error("Host browser control is disabled by sandbox policy.");
	if (!resolved.enabled) throw new Error("Browser control is disabled. Set browser.enabled=true in ~/.openclaw/openclaw.json.");
}
/**
* Read importable system profiles from the host control server. Discovery must
* match where import runs (host-local), so it never uses a node proxy or the
* sandbox base URL. Returns [] when host control is unavailable.
*/
async function readHostSystemProfiles(params) {
	if (params.allowHostControl === false) return [];
	let hostBaseUrl;
	try {
		hostBaseUrl = resolveBrowserBaseUrl({
			target: "host",
			sandboxBridgeUrl: params.sandboxBridgeUrl,
			allowHostControl: params.allowHostControl
		});
	} catch {
		return [];
	}
	return await browserToolDeps.browserSystemProfiles(hostBaseUrl, { timeoutMs: params.timeoutMs }).catch(() => []);
}
function shouldPreferHostForProfile(profileName) {
	if (!profileName) return false;
	const cfg = browserToolDeps.getRuntimeConfig();
	const profile = resolveProfile(resolveBrowserConfig(cfg.browser, cfg), profileName);
	if (!profile) return false;
	return getBrowserProfileCapabilities(profile).usesChromeMcp;
}
const DEFAULT_EXISTING_SESSION_MANAGE_TIMEOUT_MS = 45e3;
const EXISTING_SESSION_MANAGE_ACTIONS = /* @__PURE__ */ new Set([
	"status",
	"start",
	"stop",
	"profiles",
	"tabs",
	"open",
	"focus",
	"close"
]);
function usesExistingSessionManageFlow(params) {
	if (!EXISTING_SESSION_MANAGE_ACTIONS.has(params.action)) return false;
	const cfg = browserToolDeps.getRuntimeConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const profile = resolveProfile(resolved, params.profileName ?? resolved.defaultProfile);
	if (profile && getBrowserProfileCapabilities(profile).usesChromeMcp) return true;
	if (params.action !== "profiles") return false;
	return Object.keys(resolved.profiles).some((name) => {
		const candidate = resolveProfile(resolved, name);
		return candidate ? getBrowserProfileCapabilities(candidate).usesChromeMcp : false;
	});
}
function readToolTimeoutMs(params) {
	return readPositiveIntegerParam(params, "timeoutMs", { message: "timeoutMs must be a positive integer." });
}
/** Create the Browser tool exposed to agents. */
function createBrowserTool(opts) {
	return {
		label: "Browser",
		name: "browser",
		resultContentSource: "network",
		description: describeBrowserTool({
			targetDefault: opts?.sandboxBridgeUrl ? "sandbox" : "host",
			hostHint: opts?.allowHostControl === false ? "Host target blocked by policy." : "Host target allowed."
		}),
		parameters: BrowserToolSchema,
		outputSchema: BrowserToolOutputSchema,
		execute: async (_toolCallId, args, signal) => {
			const bindingResult = opts?.runToolBinding === void 0 ? void 0 : parseBrowserTabToolBinding(opts.runToolBinding);
			if (bindingResult && !bindingResult.ok) throw new Error(`invalid browser run binding: ${bindingResult.error}`);
			const params = bindingResult?.ok ? applyBrowserTabToolBinding(args, bindingResult.binding) : args;
			const action = readToolStringParam(params, "action", { required: true });
			const profile = readToolStringParam(params, "profile");
			const requestedNode = readToolStringParam(params, "node");
			const requestedTimeoutMs = readToolTimeoutMs(params);
			let target = readToolStringParam(params, "target");
			const runtimeConfig = browserToolDeps.getRuntimeConfig();
			const resolvedBrowser = resolveBrowserConfig(runtimeConfig.browser, runtimeConfig);
			const configuredNode = runtimeConfig.gateway?.nodes?.browser?.node?.trim();
			if (requestedNode && target && target !== "node") throw new Error("node is only supported with target=\"node\".");
			if (action === "importprofile") {
				if (target === "sandbox" || target === "node" || requestedNode) throw new Error("system profile import must run on the host; omit target or use target=\"host\".");
				target = "host";
			}
			const isUserBrowserProfile = shouldPreferHostForProfile(profile);
			if (isUserBrowserProfile) {
				if (target === "sandbox") throw new Error(`profile="${profile}" cannot use the sandbox browser; use target="host" or omit target.`);
			}
			let nodeTarget = null;
			try {
				nodeTarget = await resolveBrowserToolNodeTarget({
					requestedNode: requestedNode ?? void 0,
					target,
					sandboxBridgeUrl: opts?.sandboxBridgeUrl,
					allowHostControl: opts?.allowHostControl
				});
			} catch (error) {
				if (!(isUserBrowserProfile && !target && !requestedNode && !configuredNode)) throw error;
			}
			if (isUserBrowserProfile && !target && !requestedNode && !nodeTarget) target = "host";
			const baseUrl = nodeTarget ? void 0 : resolveBrowserBaseUrl({
				target: target === "node" ? void 0 : target,
				sandboxBridgeUrl: opts?.sandboxBridgeUrl,
				allowHostControl: opts?.allowHostControl
			});
			const allowAutomaticHostFallback = Boolean(nodeTarget && !target && !requestedNode && !configuredNode && opts?.allowHostControl !== false);
			const proxyRequest = nodeTarget ? createBrowserNodeProxyRequest({
				nodeTarget,
				allowAutomaticHostFallback,
				signal
			}) : null;
			const toolTimeoutMs = requestedTimeoutMs ?? (usesExistingSessionManageFlow({
				action,
				profileName: profile
			}) ? DEFAULT_EXISTING_SESSION_MANAGE_TIMEOUT_MS : void 0);
			const sessionTabs = createBrowserToolSessionTabs({
				sessionKey: opts?.agentSessionKey,
				requestedProfile: profile,
				defaultProfile: resolvedBrowser.defaultProfile,
				baseUrl,
				isHostFallbackActive: proxyRequest?.isHostFallbackActive,
				registry: browserToolDeps
			});
			const readBrowserStatus = async () => proxyRequest ? await proxyRequest({
				method: "GET",
				path: "/",
				profile,
				timeoutMs: toolTimeoutMs
			}) : await browserToolDeps.browserStatus(baseUrl, {
				profile,
				timeoutMs: toolTimeoutMs
			});
			const executeTrackedTabRequest = async (path, body, runLocal) => {
				const result = proxyRequest ? await proxyRequest({
					method: "POST",
					path,
					profile,
					body
				}) : await runLocal();
				sessionTabs.touch(readStringValue(result.targetId) ?? readStringValue(body.targetId));
				return jsonResult(result);
			};
			switch (action) {
				case "doctor": return jsonResult(proxyRequest ? await proxyRequest({
					method: "GET",
					path: "/doctor",
					profile
				}) : await browserToolDeps.browserDoctor(baseUrl, { profile }));
				case "status": return jsonResult(await readBrowserStatus());
				case "start":
				case "stop":
					if (proxyRequest) await proxyRequest({
						method: "POST",
						path: `/${action}`,
						profile,
						timeoutMs: toolTimeoutMs
					});
					else await (action === "start" ? browserToolDeps.browserStart : browserToolDeps.browserStop)(baseUrl, {
						profile,
						timeoutMs: toolTimeoutMs
					});
					return jsonResult(await readBrowserStatus());
				case "profiles": {
					const systemProfiles = await readHostSystemProfiles({
						allowHostControl: opts?.allowHostControl,
						sandboxBridgeUrl: opts?.sandboxBridgeUrl,
						timeoutMs: toolTimeoutMs
					});
					if (proxyRequest) {
						const result = await proxyRequest({
							method: "GET",
							path: "/profiles",
							timeoutMs: toolTimeoutMs
						});
						return jsonResult({
							...result && typeof result === "object" ? result : { profiles: result },
							systemProfiles
						});
					}
					return jsonResult({
						profiles: await browserToolDeps.browserProfiles(baseUrl, { timeoutMs: toolTimeoutMs }),
						systemProfiles
					});
				}
				case "importprofile": {
					if (proxyRequest) throw new Error("system profile import must run on the browser host");
					const domains = parseSystemProfileDomains(params.domains);
					return jsonResult(await browserToolDeps.browserImportProfile(baseUrl, {
						browser: normalizeOptionalString(params.browser) ?? "chrome",
						systemProfile: normalizeOptionalString(params.systemProfile) ?? "Default",
						into: normalizeOptionalString(params.into) ?? "imported",
						domains
					}));
				}
				case "tabs": return await executeTabsAction({
					baseUrl,
					profile,
					timeoutMs: toolTimeoutMs,
					proxyRequest,
					targetId: bindingResult?.ok ? bindingResult.binding.targetId : void 0
				});
				case "open": {
					const targetUrl = readTargetUrlParam(params);
					const label = normalizeOptionalString(params.label);
					const opened = proxyRequest ? await proxyRequest({
						method: "POST",
						path: "/tabs/open",
						profile,
						body: {
							url: targetUrl,
							...label ? { label } : {}
						},
						timeoutMs: toolTimeoutMs
					}) : await browserToolDeps.browserOpenTab(baseUrl, targetUrl, {
						profile,
						label,
						timeoutMs: toolTimeoutMs
					});
					const closeOpenedTab = async (targetId, openedProfile) => {
						if (proxyRequest) await proxyRequest({
							method: "DELETE",
							path: `/tabs/${encodeURIComponent(targetId)}`,
							profile: openedProfile,
							timeoutMs: toolTimeoutMs
						});
						else await browserToolDeps.browserCloseTab(baseUrl, targetId, {
							profile: openedProfile,
							timeoutMs: toolTimeoutMs
						});
					};
					await sessionTabs.trackOpened(opened, closeOpenedTab);
					return formatBrowserExternalToolResult({
						kind: "tabs",
						payload: stripBrowserOpenInternalMetadata(opened)
					});
				}
				case "focus": {
					const targetId = readToolStringParam(params, "targetId", { required: true });
					const result = proxyRequest ? await proxyRequest({
						method: "POST",
						path: "/tabs/focus",
						profile,
						body: { targetId },
						timeoutMs: toolTimeoutMs
					}) : await browserToolDeps.browserFocusTab(baseUrl, targetId, {
						profile,
						timeoutMs: toolTimeoutMs
					});
					sessionTabs.touch(readStringValue(result.targetId) ?? targetId);
					return jsonResult(proxyRequest ? result : { ok: true });
				}
				case "close": {
					const targetId = readToolStringParam(params, "targetId");
					if (proxyRequest) {
						const result = targetId ? await proxyRequest({
							method: "DELETE",
							path: `/tabs/${encodeURIComponent(targetId)}`,
							profile,
							timeoutMs: toolTimeoutMs
						}) : await proxyRequest({
							method: "POST",
							path: "/act",
							profile,
							body: { kind: "close" },
							timeoutMs: toolTimeoutMs
						});
						sessionTabs.untrack(targetId);
						return jsonResult(result);
					}
					if (targetId) {
						await browserToolDeps.browserCloseTab(baseUrl, targetId, {
							profile,
							timeoutMs: toolTimeoutMs
						});
						sessionTabs.untrack(targetId);
					} else await browserToolDeps.browserAct(baseUrl, { kind: "close" }, {
						profile,
						timeoutMs: toolTimeoutMs
					});
					return jsonResult({ ok: true });
				}
				case "snapshot": return await executeSnapshotAction({
					input: params,
					baseUrl,
					profile,
					proxyRequest,
					onTabActivity: sessionTabs.touch
				});
				case "screenshot": {
					const targetId = readToolStringParam(params, "targetId");
					const fullPage = Boolean(params.fullPage);
					const ref = readToolStringParam(params, "ref");
					const element = readToolStringParam(params, "element");
					const labels = typeof params.labels === "boolean" ? params.labels : void 0;
					const type = params.type === "jpeg" ? "jpeg" : "png";
					const effectiveTimeoutMs = requestedTimeoutMs ?? 2e4;
					const result = proxyRequest ? await proxyRequest({
						method: "POST",
						path: "/screenshot",
						profile,
						timeoutMs: effectiveTimeoutMs,
						body: {
							targetId,
							fullPage,
							ref,
							element,
							type,
							labels,
							timeoutMs: effectiveTimeoutMs
						}
					}) : await browserToolDeps.browserScreenshotAction(baseUrl, {
						targetId,
						fullPage,
						ref,
						element,
						type,
						labels,
						timeoutMs: effectiveTimeoutMs,
						profile
					});
					sessionTabs.touch(readStringValue(result.targetId) ?? targetId);
					if (opts?.screenshotResultMode === "path") {
						const artifactPath = opts.persistScreenshot ? await opts.persistScreenshot({
							sourcePath: result.path,
							type,
							targetId: readStringValue(result.targetId) ?? targetId
						}) : result.path;
						if (artifactPath.length > 4096) throw new Error("Browser screenshot artifact path exceeds 4096 characters");
						const resultRecord = result;
						const resultTargetId = readStringValue(resultRecord.targetId) ?? targetId;
						const resultUrl = readStringValue(resultRecord.url);
						return jsonResult({
							ok: resultRecord.ok === true,
							path: artifactPath,
							...resultTargetId ? { targetId: truncateUtf16Safe(resultTargetId, 256) } : {},
							...resultUrl ? { url: truncateUtf16Safe(resultUrl, 2048) } : {},
							...Array.isArray(resultRecord.annotations) ? { annotationCount: resultRecord.annotations.length } : {},
							media: { outbound: false }
						});
					}
					const screenshotPath = result.path;
					const screenshotCfg = browserToolDeps.getRuntimeConfig();
					const imageSanitization = resolveRuntimeImageSanitization();
					let shareHint = SCREENSHOT_SHARE_UNAVAILABLE;
					try {
						shareHint = formatScreenshotShareHint(await browserToolDeps.stageBrowserScreenshotForSharing(screenshotPath, imageSanitization?.maxDimensionPx));
					} catch {}
					const screenshotDetails = {
						...result,
						media: { outbound: false }
					};
					try {
						const described = await describeBrowserScreenshot({
							cfg: screenshotCfg,
							filePath: screenshotPath,
							agentDir: opts?.agentDir,
							workspaceDir: opts?.workspaceDir,
							activeModel: opts?.activeModel,
							mediaScope: opts?.mediaScope,
							imageSanitization
						}, {
							describeImageFile: browserToolDeps.describeImageFile,
							normalizeBrowserScreenshot: browserToolDeps.normalizeBrowserScreenshot,
							saveMediaBuffer: browserToolDeps.saveMediaBuffer
						});
						if (described) {
							const headerLines = [`[analyzed by ${described.provider && described.model ? `${described.provider}/${described.model}` : "media image understanding"}]`];
							const wrappedDescription = wrapExternalContent(neutralizeMediaDirectives(described.text.trim()), {
								source: "browser",
								includeWarning: true
							});
							return {
								content: [{
									type: "text",
									text: `${headerLines.join("\n")}\n${wrappedDescription}\n${shareHint}`
								}],
								details: {
									...result,
									vision: {
										provider: described.provider,
										model: described.model,
										decision: described.decision
									}
								}
							};
						}
					} catch (err) {
						const extraText = `[browser screenshot vision failed: ${wrapExternalContent(neutralizeMediaDirectives(err instanceof Error ? err.message : String(err)), {
							source: "browser",
							includeWarning: false
						})}]\n${shareHint}`;
						return await browserToolDeps.imageResultFromFile({
							label: "browser:screenshot",
							path: screenshotPath,
							extraText,
							details: screenshotDetails,
							imageSanitization
						});
					}
					return await browserToolDeps.imageResultFromFile({
						label: "browser:screenshot",
						path: screenshotPath,
						extraText: shareHint,
						details: screenshotDetails,
						imageSanitization
					});
				}
				case "navigate": {
					const targetUrl = readTargetUrlParam(params);
					const targetId = readToolStringParam(params, "targetId");
					const timeoutMs = requestedTimeoutMs === void 0 ? void 0 : resolveBrowserNavigationTimeoutMs(requestedTimeoutMs);
					const result = proxyRequest ? await proxyRequest({
						method: "POST",
						path: "/navigate",
						profile,
						body: {
							url: targetUrl,
							targetId,
							timeoutMs
						},
						timeoutMs
					}) : await browserToolDeps.browserNavigate(baseUrl, {
						url: targetUrl,
						targetId,
						timeoutMs,
						profile
					});
					const navigatedTargetId = readStringValue(result.targetId) ?? targetId;
					sessionTabs.touch(navigatedTargetId);
					const formatted = formatBrowserExternalToolResult({
						kind: result.download ? "download" : "act",
						payload: result
					});
					if (result.download) return formatted;
					return await appendNavigatedPageState({
						result: formatted,
						targetId: navigatedTargetId,
						baseUrl,
						profile,
						proxyRequest
					});
				}
				case "console": {
					const result = await executeConsoleAction({
						input: params,
						baseUrl,
						profile,
						proxyRequest
					});
					const targetId = readToolStringParam(params, "targetId");
					const canonicalTargetId = readStringValue(result.details?.targetId);
					sessionTabs.touch(canonicalTargetId ?? targetId);
					return result;
				}
				case "pdf": {
					const targetId = normalizeOptionalString(params.targetId);
					const result = proxyRequest ? await proxyRequest({
						method: "POST",
						path: "/pdf",
						profile,
						body: { targetId }
					}) : await browserToolDeps.browserPdfSave(baseUrl, {
						targetId,
						profile
					});
					sessionTabs.touch(readStringValue(result.targetId) ?? targetId);
					return {
						content: [{
							type: "text",
							text: `FILE:${result.path}`
						}],
						details: result
					};
				}
				case "download":
				case "waitfordownload": return await executeDownloadAction({
					action,
					input: params,
					baseUrl,
					profile,
					proxyRequest,
					onTabActivity: sessionTabs.touch
				});
				case "upload": {
					const paths = Array.isArray(params.paths) ? params.paths.map((p) => String(p)) : [];
					if (paths.length === 0) throw new Error("paths required");
					const resolvedResult = await resolveExistingUploadPaths({ requestedPaths: paths });
					if (!resolvedResult.ok) throw new Error(resolvedResult.error);
					const normalizedPaths = resolvedResult.paths;
					const ref = readToolStringParam(params, "ref");
					const inputRef = readToolStringParam(params, "inputRef");
					const element = readToolStringParam(params, "element");
					const { targetId, timeoutMs } = readOptionalTargetAndTimeout(params);
					const request = {
						paths: normalizedPaths,
						ref,
						inputRef,
						element,
						targetId,
						timeoutMs
					};
					return await executeTrackedTabRequest("/hooks/file-chooser", request, async () => await browserToolDeps.browserArmFileChooser(baseUrl, {
						...request,
						profile
					}));
				}
				case "dialog": {
					const accept = Boolean(params.accept);
					const promptText = readStringValue(params.promptText);
					const dialogId = readStringValue(params.dialogId);
					const { targetId, timeoutMs } = readOptionalTargetAndTimeout(params);
					const request = {
						accept,
						promptText,
						dialogId,
						targetId,
						timeoutMs
					};
					return await executeTrackedTabRequest("/hooks/dialog", request, async () => await browserToolDeps.browserArmDialog(baseUrl, {
						...request,
						profile
					}));
				}
				case "act": {
					const request = readActRequestParam(params);
					if (!request) throw new Error("request required");
					return await executeActAction({
						request,
						baseUrl,
						profile,
						proxyRequest,
						onTabActivity: sessionTabs.touch
					});
				}
				default: throw new Error(`Unknown action: ${action}`);
			}
		}
	};
}
//#endregion
//#region extensions/browser/src/gateway/browser-request.ts
/**
* Gateway handler for browser.request, including optional node-host proxy
* dispatch and local Browser control route dispatch.
*/
const logger = createSubsystemLogger("browser");
/** Handles one browser.request gateway call and streams a success/error response. */
async function handleBrowserGatewayRequest({ params, respond, context }) {
	const typed = params;
	const methodRaw = (normalizeOptionalString(typed.method) ?? "").toUpperCase();
	const path = normalizeOptionalString(typed.path) ?? "";
	const query = typed.query && typeof typed.query === "object" ? typed.query : void 0;
	const body = typed.body;
	const timeoutMs = clampTimerTimeoutMs(typed.timeoutMs);
	if (!methodRaw || !path) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "method and path are required"));
		return;
	}
	if (methodRaw !== "GET" && methodRaw !== "POST" && methodRaw !== "DELETE") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "method must be GET, POST, or DELETE"));
		return;
	}
	const cfg = getRuntimeConfig();
	const configuredNode = normalizeOptionalString(cfg.gateway?.nodes?.browser?.node);
	const forceHostLocal = isBrowserHostLocalRoute(methodRaw, path);
	let nodeTarget = null;
	if (!forceHostLocal) try {
		nodeTarget = resolveBrowserNodeTarget({
			nodes: context.nodeRegistry.listConnected(),
			policy: cfg.gateway?.nodes?.browser
		});
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
		return;
	}
	if (nodeTarget && isPersistentBrowserProfileMutation(methodRaw, path)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "browser.request cannot mutate persistent browser profiles over a node proxy"));
		return;
	}
	let preparedUpload = null;
	let proxyCommand = BROWSER_PROXY_COMMAND;
	if (nodeTarget) {
		if (isBrowserProxyUploadRequest({
			method: methodRaw,
			path,
			body
		}) && !nodeTarget.commands?.includes("browser.proxy.upload.v1")) {
			const message = browserProxyUploadUnavailableMessage(nodeTarget.declaredCommands);
			if (configuredNode) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message));
				return;
			}
			logger.warn(`browser node ${nodeTarget.displayName ?? nodeTarget.nodeId} lacks ${BROWSER_PROXY_UPLOAD_COMMAND}; falling back to Gateway host`);
			nodeTarget = null;
		}
	}
	if (nodeTarget) {
		try {
			preparedUpload = await prepareBrowserProxyUploadRequest({
				method: methodRaw,
				path,
				body
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
			return;
		}
		if (preparedUpload.upload) proxyCommand = BROWSER_PROXY_UPLOAD_COMMAND;
	}
	if (nodeTarget && preparedUpload) {
		const allowlist = resolveNodeCommandAllowlist(cfg, nodeTarget);
		const allowed = isNodeCommandAllowed({
			command: proxyCommand,
			declaredCommands: nodeTarget.commands,
			allowlist
		});
		if (!allowed.ok) {
			const platform = nodeTarget.platform ?? "unknown";
			const hint = `node command not allowed: ${allowed.reason} (platform: ${platform}, command: ${proxyCommand})`;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, hint, { details: {
				reason: allowed.reason,
				command: proxyCommand
			} }));
			return;
		}
		const proxyParams = {
			method: methodRaw,
			path,
			query,
			body: preparedUpload.body,
			upload: preparedUpload.upload,
			timeoutMs,
			profile: resolveRequestedBrowserProfile({
				query,
				body
			}),
			errorEnvelope: BROWSER_PROXY_ERROR_ENVELOPE
		};
		const res = await context.nodeRegistry.invoke({
			nodeId: nodeTarget.nodeId,
			command: proxyCommand,
			params: proxyParams,
			timeoutMs,
			idempotencyKey: crypto.randomUUID()
		});
		if (!configuredNode && isBrowserControlHostUnavailableError(res.error) && !res.ok) logger.warn(`browser node ${nodeTarget.displayName ?? nodeTarget.nodeId} control host unavailable; falling back to Gateway host`);
		else {
			if (!respondUnavailableOnNodeInvokeError(respond, res)) return;
			const payload = res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload;
			const failure = parseBrowserProxyFailure(payload);
			if (failure) {
				const { status, body: errorBody } = failure.error;
				respond(false, void 0, errorShape(status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, errorBody.error, { details: errorBody }));
				return;
			}
			const proxy = payload && typeof payload === "object" ? payload : null;
			if (!proxy || !("result" in proxy)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "browser proxy failed"));
				return;
			}
			const success = proxy;
			const mapping = await persistBrowserProxyFiles(success.files);
			applyBrowserProxyPaths(success.result, mapping);
			respond(true, success.result);
			return;
		}
	}
	if (!await startBrowserControlServiceFromConfig()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "browser control is disabled"));
		return;
	}
	let dispatcher;
	try {
		dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
		return;
	}
	let result;
	try {
		result = timeoutMs ? await withTimeout((signal) => dispatcher.dispatch({
			method: methodRaw,
			path,
			query,
			body,
			signal
		}), timeoutMs, "browser request") : await dispatcher.dispatch({
			method: methodRaw,
			path,
			query,
			body
		});
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
		return;
	}
	if (result.status >= 400) {
		const message = result.body && typeof result.body === "object" && "error" in result.body ? String(result.body.error) : `browser request failed (${result.status})`;
		respond(false, void 0, errorShape(result.status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, message, { details: result.body }));
		return;
	}
	respond(true, result.body);
}
/** Gateway request handler map contributed by the Browser plugin. */
const browserHandlers = { "browser.request": handleBrowserGatewayRequest };
//#endregion
//#region extensions/browser/src/plugin-service.ts
/**
* Browser plugin service factory that lazily starts the control server.
*/
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER = /^(?:data|http|https|node):/i;
function validateBrowserControlOverrideSpecifier(specifier) {
	const trimmed = specifier.trim();
	if (UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER.test(trimmed)) throw new Error(`Refusing unsafe browser control override specifier: ${trimmed}`);
	return trimmed;
}
/** Creates the Browser plugin service registered by the plugin entrypoint. */
function createBrowserPluginService() {
	let handle = null;
	return {
		id: "browser-control",
		start: async () => {
			if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
			if (handle) return;
			handle = await startLazyPluginServiceModule({
				skipEnvVar: "OPENCLAW_SKIP_BROWSER_CONTROL_SERVER",
				overrideEnvVar: "OPENCLAW_BROWSER_CONTROL_MODULE",
				validateOverrideSpecifier: validateBrowserControlOverrideSpecifier,
				loadDefaultModule: async () => await import("./server-CB55bR3b.js"),
				startExportNames: ["startBrowserControlServiceFromConfig", "startBrowserControlServerFromConfig"],
				stopExportNames: ["stopBrowserControlService", "stopBrowserControlServer"]
			});
		},
		stop: async () => {
			const current = handle;
			if (current) {
				await current.stop();
				if (handle === current) handle = null;
				return;
			}
			const { stopBrowserControlService } = await import("./control-service-B_k6Bykj.js");
			await stopBrowserControlService();
		}
	};
}
//#endregion
export { createBrowserTool as i, browserHandlers as n, handleBrowserGatewayRequest as r, createBrowserPluginService as t };
