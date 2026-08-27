import { s as readJsonBodyWithLimit } from "./http-body-B0Ouh_va.js";
import { n as logError } from "./logger-frf2HPJn.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { b as resolveRequestClientIp } from "./net-BRYQcUG8.js";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.js";
import { _ as readToolStringParam } from "./common-ciEJghJz.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { n as assertWidgetHtmlSize, r as isCompleteHtmlDocument, t as WidgetHtmlInputError } from "./widget-html-Dy17hllR.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./text-utility-runtime-BSdEoze8.js";
import "./logging-core-ClEDRBwn.js";
import "./provider-http-D7FntVgP.js";
import "./channel-actions-Ht8PCq9o.js";
import "./webhook-ingress-Bfu_BdL5.js";
import { t as WEBHOOK_BODY_READ_DEFAULTS } from "./webhook-request-guards-DNMZaVoi.js";
import { n as isDiscordAccountEnabledForRuntime, r as listDiscordAccountIds, s as resolveDiscordAccount } from "./accounts-nD0JW5tp.js";
import { i as resolveDiscordActivitiesConfig, r as setDiscordActivitiesRuntime, t as DiscordActivitiesRuntime } from "./runtime-xrt02v_W.js";
import { l as parseDiscordActivityCustomId, n as buildDiscordPresentationComponents } from "./shared-interactive-C0KgX4ax.js";
import { r as sendDiscordComponentMessage } from "./send.components-DU3MWl8t.js";
import { n as resolveDiscordChannelId$1 } from "./target-parsing-CE3KimkZ.js";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import { Type } from "typebox";
//#region extensions/discord/src/activities/discord-api.ts
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/v10/users/@me";
const DISCORD_HOST = "discord.com";
const JSON_MAX_BYTES = 64 * 1024;
const INSTANCE_ID_MAX_LENGTH = 256;
function normalizeInstanceId(value) {
	const instanceId = value?.trim();
	let hasControlCharacter = false;
	for (let index = 0; index < (instanceId?.length ?? 0); index += 1) {
		const codePoint = instanceId?.charCodeAt(index) ?? 0;
		if (codePoint < 32 || codePoint === 127) {
			hasControlCharacter = true;
			break;
		}
	}
	if (!instanceId || instanceId.length > INSTANCE_ID_MAX_LENGTH || hasControlCharacter) return;
	return instanceId;
}
async function fetchDiscordJson(params) {
	const { response, release } = await params.fetchGuard({
		url: params.url,
		fetchImpl: params.fetchImpl,
		init: params.init,
		policy: { allowedHostnames: [DISCORD_HOST] },
		auditContext: params.auditContext,
		timeoutMs: 15e3
	});
	try {
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			return {
				ok: false,
				status: response.status
			};
		}
		return {
			ok: true,
			status: response.status,
			body: await readProviderJsonResponse(response, "Discord Activity OAuth", { maxBytes: JSON_MAX_BYTES })
		};
	} finally {
		await release();
	}
}
async function resolveActivityInstanceChannel(params) {
	let result;
	try {
		result = await fetchDiscordJson({
			fetchGuard: params.fetchGuard,
			fetchImpl: params.proxyFetch,
			url: `https://discord.com/api/v10/applications/${encodeURIComponent(params.applicationId)}/activity-instances/${encodeURIComponent(params.instanceId)}`,
			init: { headers: { Authorization: `Bot ${params.botAuth}` } },
			auditContext: "discord.activities.instance"
		});
	} catch {
		return;
	}
	if (!result.ok || !Array.isArray(result.body?.users) || !result.body.users.includes(params.discordUserId) || !result.body.location || typeof result.body.location !== "object") return;
	const channelId = result.body.location.channel_id;
	return typeof channelId === "string" && /^\d+$/.test(channelId) ? channelId : void 0;
}
//#endregion
//#region extensions/discord/src/activities/rate-limit.ts
const TOKEN_RATE_LIMIT = 10;
const TOKEN_GLOBAL_RATE_LIMIT = 60;
const TOKEN_RATE_WINDOW_MS = 6e4;
const TOKEN_RATE_MAX_KEYS = 1024;
var TokenRateLimiter = class {
	constructor(now) {
		this.now = now;
		this.attempts = /* @__PURE__ */ new Map();
		this.globalAttempts = [];
	}
	allowKey(key) {
		const now = this.now();
		const active = (this.attempts.get(key) ?? []).filter((timestamp) => timestamp > now - TOKEN_RATE_WINDOW_MS);
		if (active.length >= TOKEN_RATE_LIMIT) {
			this.attempts.delete(key);
			this.attempts.set(key, active);
			return false;
		}
		if (!this.attempts.has(key) && this.attempts.size >= TOKEN_RATE_MAX_KEYS) {
			const oldestKey = this.attempts.keys().next().value;
			if (typeof oldestKey === "string") this.attempts.delete(oldestKey);
		}
		active.push(now);
		this.attempts.delete(key);
		this.attempts.set(key, active);
		return true;
	}
	reserveGlobal() {
		const now = this.now();
		this.globalAttempts = this.globalAttempts.filter((reservation) => reservation.at > now - TOKEN_RATE_WINDOW_MS);
		if (this.globalAttempts.length >= TOKEN_GLOBAL_RATE_LIMIT) return null;
		const reservation = { at: now };
		this.globalAttempts.push(reservation);
		return reservation;
	}
	releaseGlobal(reservation) {
		const index = this.globalAttempts.indexOf(reservation);
		if (index >= 0) this.globalAttempts.splice(index, 1);
	}
};
//#endregion
//#region extensions/discord/src/activities/shell.ts
const DISCORD_ACTIVITY_ROUTE_PREFIX = "/discord/activity";
const DISCORD_ACTIVITY_TOKEN_REQUEST_TIMEOUT_MS = 35e3;
const DISCORD_ACTIVITY_WIDGET_REQUEST_TIMEOUT_MS = 2e4;
const DISCORD_ACTIVITY_SHELL_CSP = "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; frame-src 'self'; img-src data:; base-uri 'none'; frame-ancestors *";
const DISCORD_ACTIVITY_SHELL_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OpenClaw widget</title><style>
:root{color-scheme:dark;font:14px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#1e1f22;color:#dbdee1}
*{box-sizing:border-box}html,body,#app{height:100%;margin:0}#app{display:grid;place-items:center}main{max-width:560px;padding:32px;text-align:center}
h1{font-size:18px;margin:0 0 8px;color:#f2f3f5}p{margin:0;color:#b5bac1;line-height:1.5}.widget{display:grid;grid-template-rows:42px 1fr;width:100%;height:100%;background:#111214}
.bar{display:flex;align-items:center;padding:0 14px;border-bottom:1px solid #2b2d31;font-weight:600;color:#f2f3f5}.widget iframe{border:0;width:100%;height:100%;background:#111214}
</style></head><body><div id="app"><main><h1>Opening widget</h1><p>Connecting to Discord…</p></main></div>
<script type="module" src="./shell.js"><\/script></body></html>`;
const DISCORD_ACTIVITY_SHELL_JS = `import { DiscordSDK } from "./vendor/embedded-app-sdk.mjs";

const tokenRequestTimeoutMs = ${DISCORD_ACTIVITY_TOKEN_REQUEST_TIMEOUT_MS};
const widgetRequestTimeoutMs = ${DISCORD_ACTIVITY_WIDGET_REQUEST_TIMEOUT_MS};
const app = document.querySelector("#app");
function show(message, detail) {
  app.className = "";
  app.innerHTML = "";
  const main = document.createElement("main");
  const heading = document.createElement("h1");
  const paragraph = document.createElement("p");
  heading.textContent = message;
  paragraph.textContent = detail;
  main.append(heading, paragraph);
  app.append(main);
}
function proxiedDocUrl(value) {
  const url = new URL(value, window.location.origin);
  if (window.location.hostname.endsWith(".discordsays.com")) {
    // The ROOT mapping target already includes this prefix; strip it before proxying.
    const gatewayPrefix = "/discord/activity";
    const mappedPath = url.pathname.startsWith(gatewayPrefix + "/")
      ? url.pathname.slice(gatewayPrefix.length)
      : url.pathname;
    return "/.proxy" + mappedPath + url.search;
  }
  return url.pathname + url.search;
}
async function readJson(response) {
  let body;
  try {
    body = await response.json();
  } catch (error) {
    // Error responses may legitimately omit JSON details; successful responses must not
    // turn an aborted or malformed body into an apparently valid empty payload.
    if (response.ok) throw error;
    body = {};
  }
  if (!response.ok) {
    const error = new Error(typeof body.error === "string" ? body.error : "request failed");
    error.status = response.status;
    throw error;
  }
  return body;
}
async function fetchJsonWithDeadline(input, init, timeoutMs) {
  // Activities also run in mobile webviews; avoid requiring the newer
  // AbortSignal.timeout() static API just to enforce this request boundary.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await readJson(await fetch(input, { ...init, signal: controller.signal }));
  } finally {
    clearTimeout(timeout);
  }
}
async function run() {
  const match = window.location.hostname.match(/^(\\d+)\\.discordsays\\.com$/i);
  if (!match) {
    show("Open inside Discord", "This widget must be launched from its Discord button.");
    return;
  }
  const clientId = match[1];
  const sdk = new DiscordSDK(clientId);
  await sdk.ready();
  const { code } = await sdk.commands.authorize({
    client_id: clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });
  const auth = await fetchJsonWithDeadline(
    "./api/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    },
    tokenRequestTimeoutMs,
  );
  await sdk.commands.authenticate({ access_token: auth.access_token });
  const query = new URLSearchParams({
    custom_id: sdk.customId ?? "",
    instance_id: sdk.instanceId,
  });
  const widget = await fetchJsonWithDeadline(
    "./api/widget?" + query,
    { headers: { Authorization: "Bearer " + auth.session_token } },
    widgetRequestTimeoutMs,
  );
  app.className = "widget";
  app.innerHTML = "";
  const bar = document.createElement("div");
  const frame = document.createElement("iframe");
  bar.className = "bar";
  bar.textContent = widget.title;
  frame.title = widget.title;
  // Intentionally minimal: no top-navigation, popups, or same-origin access.
  frame.setAttribute("sandbox", "allow-scripts");
  frame.referrerPolicy = "no-referrer";
  frame.src = proxiedDocUrl(widget.docUrl);
  app.append(bar, frame);
}
run().catch((error) => {
  if (error?.status === 404) {
    show("Widget unavailable", "No widget could be resolved for this channel.");
  } else {
    show("Gateway offline", "The OpenClaw gateway could not load this widget. Try again shortly.");
  }
});
`;
//#endregion
//#region extensions/discord/src/activities/http.ts
const BODY_MAX_BYTES = 8 * 1024;
const WIDGET_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/;
const DOC_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const DISCORD_ACTIVITY_WIDGET_CSP = "sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; frame-ancestors *";
function setCommonHeaders(res) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
}
function respond(res, statusCode, body, contentType, headers) {
	res.statusCode = statusCode;
	setCommonHeaders(res);
	res.setHeader("Content-Type", contentType);
	for (const [key, value] of Object.entries(headers ?? {})) res.setHeader(key, value);
	res.end(body);
	return true;
}
function respondJson(res, statusCode, body) {
	return respond(res, statusCode, `${JSON.stringify(body)}\n`, "application/json; charset=utf-8");
}
function notFound(res, widgetDocument = false) {
	return respond(res, 404, "not found", "text/plain; charset=utf-8", widgetDocument ? { "Content-Security-Policy": DISCORD_ACTIVITY_WIDGET_CSP } : void 0);
}
function readHeader(req, name) {
	const value = req.headers[name];
	return Array.isArray(value) ? value[0] : value;
}
function extractApplicationId(req) {
	for (const header of [readHeader(req, "origin"), readHeader(req, "referer")]) {
		if (!header) continue;
		try {
			const match = new URL(header).hostname.match(/^(\d+)\.discordsays\.com$/i);
			if (match?.[1]) return match[1];
		} catch {}
	}
}
function bearerToken(req) {
	return ((readHeader(req, "authorization")?.trim())?.match(/^Bearer\s+([A-Za-z0-9_-]{43})$/i))?.[1];
}
function widgetIdFromCustomId(customId) {
	if (WIDGET_ID_PATTERN.test(customId)) return customId;
	return parseDiscordActivityCustomId(customId)?.widgetId;
}
function createDiscordActivityHttpHandler(deps) {
	const fetchGuard = deps.fetchGuard ?? fetchWithSsrFGuard;
	const limiter = new TokenRateLimiter(deps.now ?? Date.now);
	const readVendorAsset = deps.readVendorAsset ?? ((assetPath) => fs.readFile(assetPath));
	const reportError = deps.logError ?? logError;
	const bodyTimeoutMs = deps.bodyTimeoutMs ?? WEBHOOK_BODY_READ_DEFAULTS.preAuth.timeoutMs;
	let vendorAsset;
	let pendingLaunchFailureLogged = false;
	function logPendingLaunchFailure(error) {
		if (pendingLaunchFailureLogged) return;
		pendingLaunchFailureLogged = true;
		reportError(`discord activity: failed to consume pending launch: ${String(error)}`);
	}
	async function handleToken(req, res) {
		const cfg = deps.runtime.currentConfig();
		const sourceIp = resolveRequestClientIp(req, cfg.gateway?.trustedProxies, cfg.gateway?.allowRealIpFallback === true) ?? "unknown";
		if (!limiter.allowKey(sourceIp)) return respondJson(res, 429, { error: "too many token requests" });
		const applicationId = extractApplicationId(req);
		const account = deps.runtime.resolveHttpAccount(applicationId);
		if (!account) return respondJson(res, 503, { error: "Discord Activities is not fully configured" });
		const bodyResult = await readJsonBodyWithLimit(req, {
			maxBytes: BODY_MAX_BYTES,
			timeoutMs: bodyTimeoutMs,
			emptyObjectOnEmpty: true
		});
		if (!bodyResult.ok && bodyResult.code === "REQUEST_BODY_TIMEOUT") return respondJson(res, 408, { error: "request body timeout" });
		const body = bodyResult.ok && bodyResult.value && typeof bodyResult.value === "object" && !Array.isArray(bodyResult.value) ? bodyResult.value : null;
		const code = typeof body?.code === "string" ? body.code.trim() : "";
		if (!code) return respondJson(res, 401, { error: "invalid authorization code" });
		const reservation = limiter.reserveGlobal();
		if (reservation === null) return respondJson(res, 429, { error: "too many token requests" });
		let completed = false;
		try {
			let tokenResponse;
			try {
				tokenResponse = await fetchDiscordJson({
					fetchGuard,
					fetchImpl: account.proxyFetch,
					url: DISCORD_TOKEN_URL,
					init: {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: new URLSearchParams({
							grant_type: "authorization_code",
							client_id: account.applicationId,
							client_secret: account.clientSecret,
							code
						})
					},
					auditContext: "discord.activities.oauth.token"
				});
			} catch {
				return respondJson(res, 503, { error: "Discord token exchange unavailable" });
			}
			const granted = typeof tokenResponse.body?.access_token === "string" ? tokenResponse.body.access_token.trim() : "";
			if (!tokenResponse.ok || !granted) return respondJson(res, 401, { error: "invalid authorization code" });
			let userResponse;
			try {
				userResponse = await fetchDiscordJson({
					fetchGuard,
					fetchImpl: account.proxyFetch,
					url: DISCORD_USER_URL,
					init: { headers: { Authorization: `Bearer ${granted}` } },
					auditContext: "discord.activities.oauth.user"
				});
			} catch {
				return respondJson(res, 503, { error: "Discord user lookup unavailable" });
			}
			const discordUserId = typeof userResponse.body?.id === "string" ? userResponse.body.id : void 0;
			if (!userResponse.ok || !discordUserId) return respondJson(res, 401, { error: "Discord user lookup failed" });
			const minted = await deps.runtime.store.createSession({
				discordUserId,
				accountId: account.accountId
			});
			completed = true;
			return respondJson(res, 200, {
				access_token: granted,
				session_token: minted
			});
		} finally {
			if (!completed) limiter.releaseGlobal(reservation);
		}
	}
	async function handleWidget(req, res, url) {
		const token = bearerToken(req);
		const session = token ? await deps.runtime.store.lookupSession(token) : void 0;
		if (!session) return respondJson(res, 401, { error: "invalid session" });
		const customId = url.searchParams.get("custom_id")?.trim() ?? "";
		const instanceId = normalizeInstanceId(url.searchParams.get("instance_id"));
		const account = deps.runtime.resolveAccount(session.accountId);
		const channelId = instanceId && account ? await resolveActivityInstanceChannel({
			fetchGuard,
			applicationId: account.applicationId,
			instanceId,
			discordUserId: session.discordUserId,
			botAuth: account.botAuth,
			proxyFetch: account.proxyFetch
		}) : void 0;
		if (!channelId) return respondJson(res, 404, { error: "widget not found" });
		let resolved = null;
		const requestedWidgetId = widgetIdFromCustomId(customId);
		if (requestedWidgetId) {
			const widget = await deps.runtime.store.lookupWidget(requestedWidgetId);
			if (widget?.accountId !== session.accountId || widget.channelId !== channelId) return respondJson(res, 404, { error: "widget not found" });
			resolved = {
				id: requestedWidgetId,
				widget
			};
			try {
				await deps.runtime.store.retirePendingLaunch(session.accountId, channelId, session.discordUserId, requestedWidgetId);
			} catch (error) {
				logPendingLaunchFailure(error);
			}
		} else {
			try {
				const pendingLaunch = await deps.runtime.store.consumePendingLaunch(session.accountId, channelId, session.discordUserId);
				if (pendingLaunch) {
					const widget = await deps.runtime.store.lookupWidget(pendingLaunch.widgetId);
					if (widget?.accountId === session.accountId && widget.channelId === channelId) resolved = {
						id: pendingLaunch.widgetId,
						widget
					};
				}
			} catch (error) {
				logPendingLaunchFailure(error);
			}
			resolved ??= await deps.runtime.store.latestPostedWidgetForChannel(session.accountId, channelId);
		}
		if (!resolved) return respondJson(res, 404, { error: "widget not found" });
		const docToken = await deps.runtime.store.createDocToken({
			widgetId: resolved.id,
			accountId: session.accountId
		});
		return respondJson(res, 200, {
			id: resolved.id,
			title: resolved.widget.title,
			docUrl: `${DISCORD_ACTIVITY_ROUTE_PREFIX}/api/widget/${encodeURIComponent(resolved.id)}/doc?wt=${encodeURIComponent(docToken)}`
		});
	}
	async function handleDocument(res, widgetId, token) {
		if (!WIDGET_ID_PATTERN.test(widgetId) || !DOC_TOKEN_PATTERN.test(token)) return notFound(res, true);
		const capability = await deps.runtime.store.consumeDocToken(token);
		if (!capability || capability.widgetId !== widgetId) return notFound(res, true);
		const widget = await deps.runtime.store.lookupWidget(widgetId);
		if (!widget || widget.accountId !== capability.accountId) return notFound(res, true);
		return respond(res, 200, widget.html, "text/html; charset=utf-8", { "Content-Security-Policy": DISCORD_ACTIVITY_WIDGET_CSP });
	}
	return { async handleHttpRequest(req, res) {
		const url = new URL(req.url ?? "/", "http://localhost");
		if (url.pathname !== "/discord/activity" && !url.pathname.startsWith(`/discord/activity/`)) return false;
		const relative = url.pathname.slice(17) || "/";
		if (req.method === "GET" && (relative === "/" || relative === "/index.html")) return respond(res, 200, DISCORD_ACTIVITY_SHELL_HTML, "text/html; charset=utf-8", { "Content-Security-Policy": DISCORD_ACTIVITY_SHELL_CSP });
		if (req.method === "GET" && relative === "/shell.js") return respond(res, 200, DISCORD_ACTIVITY_SHELL_JS, "text/javascript; charset=utf-8");
		if (req.method === "GET" && relative === "/vendor/embedded-app-sdk.mjs") {
			const pendingAsset = vendorAsset ??= readVendorAsset(deps.vendorAssetPath);
			try {
				return respond(res, 200, await pendingAsset, "text/javascript; charset=utf-8");
			} catch {
				if (vendorAsset === pendingAsset) vendorAsset = void 0;
				return notFound(res);
			}
		}
		if (req.method === "POST" && relative === "/api/token") return await handleToken(req, res);
		if (req.method === "GET" && relative === "/api/widget") return await handleWidget(req, res, url);
		const documentMatch = relative.match(/^\/api\/widget\/([^/]+)\/doc$/);
		if (req.method === "GET" && documentMatch?.[1]) {
			let widgetId;
			try {
				widgetId = decodeURIComponent(documentMatch[1]);
			} catch {
				return notFound(res, true);
			}
			return await handleDocument(res, widgetId, url.searchParams.get("wt") ?? "");
		}
		return notFound(res);
	} };
}
//#endregion
//#region extensions/discord/src/activities/store.ts
const DAY_MS = 1440 * 60 * 1e3;
const DISCORD_EPOCH_MS = 14200704e5;
const WIDGET_TTL_MS = 7 * DAY_MS;
const SESSION_TTL_MS = 900 * 1e3;
const DOC_TOKEN_TTL_MS = 60 * 1e3;
const PENDING_LAUNCH_TTL_MS = 120 * 1e3;
function requireAtomicUpdate(store) {
	if (!store.update) throw new Error("Discord Activities require atomic plugin state updates");
	return store;
}
function openDiscordActivityStores(openKeyedStore) {
	return {
		widgets: requireAtomicUpdate(openKeyedStore({
			namespace: "activities-widgets",
			maxEntries: 64,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: WIDGET_TTL_MS
		})),
		sessions: openKeyedStore({
			namespace: "activities-sessions",
			maxEntries: 256,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: SESSION_TTL_MS
		}),
		docTokens: openKeyedStore({
			namespace: "activities-doc-tokens",
			maxEntries: 256,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: DOC_TOKEN_TTL_MS
		}),
		launches: requireAtomicUpdate(openKeyedStore({
			namespace: "activities-launches",
			maxEntries: 256,
			overflowPolicy: "evict-oldest",
			defaultTtlMs: PENDING_LAUNCH_TTL_MS
		}))
	};
}
function pendingLaunchKey(accountId, channelId, discordUserId) {
	return `${accountId}:${channelId}:${discordUserId}`;
}
var DiscordActivityStore = class {
	constructor(stores) {
		this.stores = stores;
		this.lastWidgetCreatedAt = 0;
	}
	async createWidget(value) {
		const id = randomBytes(16).toString("base64url");
		const createdAt = Math.max(value.createdAt, this.lastWidgetCreatedAt + 1);
		this.lastWidgetCreatedAt = createdAt;
		await this.stores.widgets.register(id, {
			...value,
			createdAt,
			deliveredMessageId: null
		});
		return id;
	}
	async markWidgetDelivered(id, messageId) {
		if (!/^\d+$/u.test(messageId)) throw new Error("Discord Activity delivery returned an invalid message ID");
		if (!await this.stores.widgets.update(id, (widget) => widget ? {
			...widget,
			deliveredMessageId: messageId
		} : void 0)) throw new Error("Discord Activity widget disappeared before delivery was recorded");
	}
	async deleteWidget(id) {
		await this.stores.widgets.delete(id);
	}
	async lookupWidget(id) {
		return await this.stores.widgets.lookup(id);
	}
	async latestPostedWidgetForChannel(accountId, channelId) {
		const entries = await this.stores.widgets.entries();
		let match;
		for (const entry of entries) {
			if (entry.value.accountId !== accountId || entry.value.channelId !== channelId) continue;
			if (entry.value.deliveredMessageId === null) continue;
			const deliveryOrder = entry.value.deliveredMessageId ? BigInt(entry.value.deliveredMessageId) : BigInt(Math.max(0, Math.trunc(entry.value.createdAt - DISCORD_EPOCH_MS))) << 22n;
			if (!match || deliveryOrder > match.deliveryOrder) match = {
				entry,
				deliveryOrder
			};
		}
		return match ? {
			id: match.entry.key,
			widget: match.entry.value
		} : null;
	}
	async createSession(value) {
		const token = randomBytes(32).toString("base64url");
		await this.stores.sessions.register(token, value);
		return token;
	}
	async lookupSession(token) {
		return await this.stores.sessions.lookup(token);
	}
	async createDocToken(value) {
		const token = randomBytes(32).toString("base64url");
		await this.stores.docTokens.register(token, value);
		return token;
	}
	async consumeDocToken(token) {
		return await this.stores.docTokens.consume(token);
	}
	async recordPendingLaunch(params) {
		const key = pendingLaunchKey(params.accountId, params.channelId, params.discordUserId);
		await this.stores.launches.update(key, (existing) => {
			return existing && (existing.state === "ambiguous" || existing.widgetId !== params.widgetId) ? {
				state: "ambiguous",
				createdAt: params.createdAt
			} : {
				state: "single",
				widgetId: params.widgetId,
				createdAt: params.createdAt
			};
		});
	}
	async retirePendingLaunch(accountId, channelId, discordUserId, widgetId) {
		const key = pendingLaunchKey(accountId, channelId, discordUserId);
		await this.stores.launches.update(key, (existing) => existing?.state === "single" && existing.widgetId === widgetId ? void 0 : existing);
	}
	async consumePendingLaunch(accountId, channelId, discordUserId) {
		const launch = await this.stores.launches.consume(pendingLaunchKey(accountId, channelId, discordUserId));
		return launch?.state === "single" ? launch : void 0;
	}
};
//#endregion
//#region extensions/discord/src/activities/tool.ts
const DISCORD_WIDGET_HTML_MAX_BYTES = 48 * 1024;
const DiscordWidgetParameters = Type.Object({
	html: Type.String({ description: "Self-contained HTML document or body fragment" }),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	button_label: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	}))
});
const ShowWidgetParameters = Type.Object({
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	widget_code: Type.String({ description: "Self-contained HTML document or body fragment" }),
	button_label: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	}))
});
function currentConfig(context, runtime) {
	return context.getRuntimeConfig?.() ?? context.runtimeConfig ?? context.config ?? runtime.currentConfig();
}
function resolveDiscordChannelId(context) {
	const raw = context.nativeChannelId?.trim() || context.deliveryContext?.to?.trim();
	if (!raw) return;
	try {
		return resolveDiscordChannelId$1(raw);
	} catch {
		return;
	}
}
function buildDiscordWidgetDocument(title, html) {
	if (isCompleteHtmlDocument(html)) return html;
	return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
<style>:root{color-scheme:dark;background:#111214;color:#dbdee1;font:14px system-ui,sans-serif}*{box-sizing:border-box}html,body{margin:0;min-height:100%}body{padding:16px}</style></head><body>${html}</body></html>`;
}
const DISCORD_WIDGET_VARIANT = {
	name: "discord_widget",
	label: "Discord Widget",
	description: "Deprecated: use show_widget. Show an interactive, self-contained HTML widget to the user in Discord.",
	htmlParam: "html",
	parameters: DiscordWidgetParameters
};
const SHOW_WIDGET_VARIANT = {
	name: "show_widget",
	label: "Show Widget",
	description: "Show an interactive, self-contained HTML widget to the user on their current surface. In Discord, posts an Activity launch button.",
	htmlParam: "widget_code",
	parameters: ShowWidgetParameters
};
function createDiscordWidgetToolVariant(context, deps, variant) {
	if (context.messageChannel !== "discord") return null;
	const cfg = currentConfig(context, deps.runtime);
	const account = resolveDiscordAccount({
		cfg,
		accountId: context.agentAccountId ?? context.deliveryContext?.accountId
	});
	if (!deps.runtime.isAccountEnabled(account.accountId, cfg)) return null;
	return {
		label: variant.label,
		name: variant.name,
		description: variant.description,
		parameters: variant.parameters,
		execute: async (_toolCallId, rawParams) => {
			const params = rawParams;
			const html = readToolStringParam(params, variant.htmlParam, {
				required: true,
				trim: false
			});
			const title = readToolStringParam(params, "title", { required: true });
			const buttonLabel = readToolStringParam(params, "button_label") || "Open widget";
			if (!html.trim()) throw new WidgetHtmlInputError(`${variant.htmlParam} is required`);
			assertWidgetHtmlSize(html, DISCORD_WIDGET_HTML_MAX_BYTES, { inputName: variant.htmlParam });
			if (title.length > 80) throw new WidgetHtmlInputError("title must be 80 characters or fewer");
			if (!buttonLabel.trim() || buttonLabel.length > 80) throw new WidgetHtmlInputError("button_label must be 1 to 80 characters");
			const channelId = resolveDiscordChannelId(context);
			if (!channelId) throw new WidgetHtmlInputError(`${variant.name} requires a concrete Discord channel in the current session`);
			const widgetId = await deps.runtime.store.createWidget({
				html: buildDiscordWidgetDocument(title, html),
				title,
				channelId,
				accountId: account.accountId,
				createdAt: (deps.now ?? Date.now)()
			});
			let result;
			let deliveredResult;
			let deliveryRecord;
			let deliveryRecordError;
			const recordDelivery = async (deliveryResult) => {
				deliveredResult = deliveryResult;
				deliveryRecord ??= deps.runtime.store.markWidgetDelivered(widgetId, deliveryResult.messageId);
				try {
					await deliveryRecord;
				} catch (error) {
					deliveryRecordError ??= new Error("Discord widget was delivered, but its delivery state could not be saved", { cause: error });
					throw deliveryRecordError;
				}
			};
			try {
				const components = buildDiscordPresentationComponents({ blocks: [{
					type: "buttons",
					buttons: [{
						label: buttonLabel.trim(),
						action: {
							type: "web-app",
							widgetId
						}
					}]
				}] });
				if (!components) throw new Error("Discord widget launch button could not be rendered");
				result = await (deps.sendComponentMessage ?? sendDiscordComponentMessage)(`channel:${channelId}`, {
					...components,
					text: title
				}, {
					cfg,
					accountId: account.accountId,
					allowedMentions: { parse: [] },
					onDeliveryResult: recordDelivery
				});
				await recordDelivery(result);
			} catch (error) {
				if (deliveryRecordError) throw deliveryRecordError;
				if (!deliveredResult) {
					await deps.runtime.store.deleteWidget(widgetId);
					throw error;
				}
				result = deliveredResult;
			}
			return jsonResult({
				widgetId,
				messageId: result.messageId,
				channelId: result.channelId
			});
		}
	};
}
function createDiscordWidgetTool(context, deps) {
	return createDiscordWidgetToolVariant(context, deps, DISCORD_WIDGET_VARIANT);
}
function createDiscordShowWidgetTool(context, deps) {
	return createDiscordWidgetToolVariant(context, deps, SHOW_WIDGET_VARIANT);
}
//#endregion
//#region extensions/discord/src/activities/register.ts
function registerDiscordActivities$1(api) {
	setDiscordActivitiesRuntime(void 0);
	const enabledAccountIds = [];
	for (const accountId of listDiscordAccountIds(api.config)) {
		const account = resolveDiscordAccount({
			cfg: api.config,
			accountId
		});
		if (!isDiscordAccountEnabledForRuntime(account, api.config)) continue;
		const resolution = resolveDiscordActivitiesConfig(account.config);
		if (resolution.enabled) {
			enabledAccountIds.push(account.accountId);
			continue;
		}
		if (resolution.reason === "missing-client-secret") api.logger.warn(`[discord] activities configured for account ${account.accountId}, but no client secret resolved; feature disabled`);
	}
	if (enabledAccountIds.length === 0) return;
	const runtime = new DiscordActivitiesRuntime(new DiscordActivityStore(openDiscordActivityStores((options) => api.runtime.state.openKeyedStore(options))), api.config, api.runtime.config?.current ? () => api.runtime.config.current() : void 0);
	setDiscordActivitiesRuntime(runtime);
	const http = createDiscordActivityHttpHandler({
		runtime,
		vendorAssetPath: api.resolvePath("assets/embedded-app-sdk.mjs")
	});
	api.registerHttpRoute({
		path: DISCORD_ACTIVITY_ROUTE_PREFIX,
		auth: "plugin",
		match: "prefix",
		handler: async (req, res) => await http.handleHttpRequest(req, res)
	});
	api.registerTool((context) => createDiscordShowWidgetTool(context, { runtime }), { name: "show_widget" });
	api.registerTool((context) => createDiscordWidgetTool(context, { runtime }), { name: "discord_widget" });
}
//#endregion
//#region extensions/discord/activities-api.ts
function registerDiscordActivities(api) {
	registerDiscordActivities$1(api);
}
//#endregion
export { registerDiscordActivities as t };
