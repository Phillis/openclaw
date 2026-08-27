import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.js";
import "./process-runtime-BTtGkRx5.js";
import "./text-utility-runtime-LRU688AB.js";
import "./security-runtime-Bm9RUgAZ.js";
import { n as resolveTailscalePublishedHost, t as resolveTailnetHostWithRunner } from "./tailscale-status-C8p6ZWI6.js";
import "./core-B7ndpj_o.js";
import { D as BOOTSTRAP_HANDOFF_OPERATOR_SCOPES, o as issueDeviceBootstrapToken } from "./device-bootstrap-ftwhmc0m.js";
import "./device-bootstrap-BFZsczn2.js";
import { t as expandTelegramAllowFromWithAccessGroups } from "./access-groups-CQPV0TPr.js";
import { t as mergeTelegramAccountConfig } from "./account-config-wdGYzZF3.js";
import { o as resolveTelegramAccount } from "./accounts-BhIUBDEJ.js";
import { r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "./allow-from-Byf7JKVc.js";
import crypto from "node:crypto";
//#region extensions/telegram/src/miniapp/owner.ts
async function isTelegramMiniAppOwner(params) {
	const userId = params.userId.trim();
	if (!isNumericTelegramSenderUserId(userId)) return false;
	const allowFrom = [...mergeTelegramAccountConfig(params.cfg, params.accountId).allowFrom ?? [], ...params.cfg.commands?.ownerAllowFrom ?? []];
	return (await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		accountId: params.accountId,
		allowFrom,
		senderId: userId
	})).some((entry) => normalizeTelegramAllowFromEntry(entry) === userId);
}
//#endregion
//#region extensions/telegram/src/miniapp/url.ts
const TELEGRAM_MINIAPP_PATH_PREFIX = "/__openclaw_tg_miniapp/";
const TELEGRAM_MINIAPP_URL_ERROR = "Mini App needs an HTTPS gateway URL. Set `gateway.tailscale.mode: serve` or `funnel`, then retry.";
async function resolveTelegramMiniAppUrls(params) {
	const mode = params.cfg.gateway?.tailscale?.mode ?? "off";
	if (mode !== "serve" && mode !== "funnel") throw new Error(TELEGRAM_MINIAPP_URL_ERROR);
	const publishedHost = resolveTailscalePublishedHost({
		tailscaleMode: mode,
		tailnetHost: await resolveTailnetHostWithRunner(params.runCommand ?? runCommandWithTimeout),
		serviceName: params.cfg.gateway?.tailscale?.serviceName
	});
	if (!publishedHost) throw new Error(TELEGRAM_MINIAPP_URL_ERROR);
	const controlUiPath = normalizeControlUiBasePath(params.cfg.gateway?.controlUi?.basePath);
	const controlUiUrl = `https://${publishedHost}${controlUiPath}`;
	return {
		pageUrl: `https://${publishedHost}${TELEGRAM_MINIAPP_PATH_PREFIX}`,
		controlUiUrl,
		gatewayUrl: `wss://${publishedHost}${controlUiPath}`
	};
}
function normalizeControlUiBasePath(value) {
	const raw = typeof value === "string" ? value.trim() : "";
	if (!raw || raw === "/") return "";
	return (raw.startsWith("/") ? raw : `/${raw}`).replace(/\/+$/, "");
}
//#endregion
//#region extensions/telegram/src/miniapp/command.ts
function registerTelegramMiniAppCommand(api, launchTickets) {
	api.registerCommand(createTelegramMiniAppDashboardCommand(api, launchTickets));
}
function createTelegramMiniAppDashboardCommand(api, launchTickets) {
	return {
		name: "dashboard",
		description: "Open the OpenClaw dashboard",
		channels: ["telegram"],
		requireAuth: true,
		exposeSenderIsOwner: true,
		handler: async (ctx) => {
			if (!isTelegramDirectCommand(ctx)) return { text: "open this in a DM with the bot" };
			const cfg = currentConfig$1(api);
			const accountId = normalizeAccountId(ctx.accountId ?? "default");
			const userId = resolveTelegramDirectUserId(ctx);
			if (!await isTelegramMiniAppOwner({
				cfg,
				accountId,
				userId
			})) return { text: "Restricted to the bot owner." };
			let pageUrl;
			try {
				pageUrl = new URL((await resolveTelegramMiniAppUrls({ cfg })).pageUrl);
			} catch {
				return { text: TELEGRAM_MINIAPP_URL_ERROR };
			}
			pageUrl.searchParams.set("accountId", accountId);
			pageUrl.hash = new URLSearchParams({ launchTicket: launchTickets.issue({
				accountId,
				userId
			}) }).toString();
			return {
				text: "Open OpenClaw dashboard.",
				presentation: { blocks: [{
					type: "buttons",
					buttons: [{
						label: "Open dashboard",
						webApp: { url: pageUrl.toString() }
					}]
				}] }
			};
		}
	};
}
function currentConfig$1(api) {
	return api.runtime.config?.current?.() ?? api.config;
}
function isTelegramDirectCommand(ctx) {
	const from = ctx.from?.trim() ?? "";
	const sessionKey = ctx.sessionKey?.trim() ?? "";
	if (from.startsWith("telegram:group:") || sessionKey.includes(":telegram:group:")) return false;
	return /^telegram:\d+$/.test(from) || sessionKey.includes(":telegram:direct:");
}
function resolveTelegramDirectUserId(ctx) {
	const senderId = ctx.senderId?.trim() ?? "";
	if (/^\d+$/.test(senderId)) return senderId;
	return /^telegram:(\d+)$/.exec(ctx.from?.trim() ?? "")?.[1] ?? "";
}
//#endregion
//#region extensions/telegram/src/miniapp/launch-ticket.ts
const LAUNCH_TICKET_TTL_MS = 5 * 6e4;
const LAUNCH_TICKET_LIMIT = 1e3;
function createTelegramMiniAppLaunchTickets() {
	const tickets = /* @__PURE__ */ new Map();
	function prune() {
		const now = Date.now();
		for (const [ticket, launch] of tickets) if (launch.expiresAtMs <= now) tickets.delete(ticket);
	}
	return {
		issue({ accountId, userId }) {
			prune();
			const ticket = crypto.randomBytes(32).toString("base64url");
			tickets.set(ticket, {
				accountId,
				userId,
				expiresAtMs: Date.now() + LAUNCH_TICKET_TTL_MS
			});
			while (tickets.size > LAUNCH_TICKET_LIMIT) {
				const oldest = tickets.keys().next().value;
				if (!oldest) break;
				tickets.delete(oldest);
			}
			return ticket;
		},
		consume({ ticket, accountId, userId }) {
			prune();
			const launch = tickets.get(ticket);
			if (!launch || launch.accountId !== accountId || launch.userId !== userId) return false;
			tickets.delete(ticket);
			return true;
		}
	};
}
//#endregion
//#region extensions/telegram/src/miniapp/init-data.ts
const INIT_DATA_MAX_AGE_MS = 3e5;
function validateTelegramMiniAppInitData(params) {
	const initData = params.initData.trim();
	const botToken = params.botToken.trim();
	if (!initData || !botToken) return null;
	const parsed = new URLSearchParams(initData);
	const receivedHash = parsed.get("hash")?.trim() ?? "";
	const authDateRaw = parsed.get("auth_date")?.trim() ?? "";
	const userRaw = parsed.get("user")?.trim() ?? "";
	if (!receivedHash || !authDateRaw || !userRaw) return null;
	const authDateSeconds = Number(authDateRaw);
	if (!Number.isInteger(authDateSeconds) || authDateSeconds <= 0) return null;
	const authDateMs = authDateSeconds * 1e3;
	const ageMs = (params.nowMs ?? Date.now()) - authDateMs;
	if (ageMs < 0 || ageMs > INIT_DATA_MAX_AGE_MS) return null;
	const entries = [...parsed.entries()].filter(([key]) => key !== "hash").map(([key, value]) => `${key}=${value}`).toSorted();
	const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
	if (!safeEqualSecret(crypto.createHmac("sha256", secret).update(entries.join("\n")).digest("hex"), receivedHash)) return null;
	const user = parseTelegramMiniAppUser(userRaw);
	if (!user?.id || !/^\d+$/.test(user.id)) return null;
	return {
		hash: receivedHash,
		authDateMs,
		userId: user.id
	};
}
function parseTelegramMiniAppUser(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (typeof parsed.id === "number" && Number.isSafeInteger(parsed.id) && parsed.id > 0) return { id: String(parsed.id) };
		return typeof parsed.id === "string" && /^\d+$/.test(parsed.id) ? { id: parsed.id } : null;
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/telegram/src/miniapp/page.ts
const TELEGRAM_MINIAPP_EXPIRED_MESSAGE = "This link expired. Reopen the dashboard from your bot chat.";
const TELEGRAM_MINIAPP_AUTH_TIMEOUT_MS = 15e3;
function renderTelegramMiniAppPage(params) {
	const accountId = JSON.stringify(params.accountId);
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>OpenClaw</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: Canvas; color: CanvasText; }
    main { width: min(28rem, calc(100vw - 2rem)); }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    p { margin: 0; line-height: 1.5; }
  </style>
  <script src="https://telegram.org/js/telegram-web-app.js"><\/script>
</head>
<body>
  <main>
    <h1>OpenClaw</h1>
    <p id="status">Opening dashboard...</p>
  </main>
  <script nonce="${escapeHtml(params.scriptNonce)}">
    const accountId = ${accountId};
    const launchTicket = new URLSearchParams(location.hash.slice(1)).get("launchTicket") || "";
    const status = document.getElementById("status");
    const showExpired = () => {
      status.textContent = ${JSON.stringify(TELEGRAM_MINIAPP_EXPIRED_MESSAGE)};
    };
    const webApp = window.Telegram && window.Telegram.WebApp;
    const initData = webApp && typeof webApp.initData === "string" ? webApp.initData : "";
    if (!initData || !launchTicket) {
      showExpired();
    } else {
      webApp.ready();
      // AbortController works in WebViews that predate AbortSignal.timeout.
      // Clear the timer after either outcome so a successful handoff is not aborted later.
      const authController = new AbortController();
      const authTimeout = setTimeout(function () {
        authController.abort();
      }, ${TELEGRAM_MINIAPP_AUTH_TIMEOUT_MS});
      fetch("auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ initData, accountId, launchTicket }),
        credentials: "same-origin",
        signal: authController.signal
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("auth failed");
        }
        return await response.json();
      }).then((payload) => {
        const next = new URL(payload.controlUiUrl);
        next.hash = "gatewayUrl=" + encodeURIComponent(payload.gatewayUrl) +
          "&bootstrapToken=" + encodeURIComponent(payload.bootstrapToken);
        location.replace(next.toString());
      }).catch(showExpired).then(function () {
        clearTimeout(authTimeout);
      });
    }
  <\/script>
</body>
</html>`;
}
//#endregion
//#region extensions/telegram/src/miniapp/routes.ts
const AUTH_PATH = `${TELEGRAM_MINIAPP_PATH_PREFIX}auth`;
const MAX_BODY_BYTES = 4096;
const REPLAY_CACHE_LIMIT = 1e3;
const RATE_LIMIT_WINDOW_MS = 6e4;
const RATE_LIMIT_MAX = 10;
const replayCache = /* @__PURE__ */ new Map();
const rateLimit = /* @__PURE__ */ new Map();
function registerTelegramMiniAppRoutes(api, launchTickets) {
	api.registerHttpRoute({
		path: TELEGRAM_MINIAPP_PATH_PREFIX,
		match: "prefix",
		auth: "plugin",
		handler: async (req, res) => {
			const url = new URL(req.url ?? "", "http://openclaw.local");
			if (url.pathname === "/__openclaw_tg_miniapp/") {
				await handlePage(req, res, url);
				return true;
			}
			if (url.pathname === AUTH_PATH) {
				await handleAuth(api, launchTickets, req, res);
				return true;
			}
			sendText(res, 404, "Not found");
			return true;
		}
	});
}
async function handlePage(req, res, url) {
	if (req.method !== "GET") {
		sendText(res, 405, "Method not allowed");
		return;
	}
	const accountId = normalizeAccountId(url.searchParams.get("accountId") ?? "default");
	const nonce = crypto.randomBytes(16).toString("base64url");
	sendHtml(res, 200, renderTelegramMiniAppPage({
		accountId,
		scriptNonce: nonce
	}), nonce);
}
async function handleAuth(api, launchTickets, req, res) {
	if (req.method !== "POST") {
		sendText(res, 405, "Method not allowed");
		return;
	}
	if ((req.headers["content-type"] ?? "").toLowerCase().split(";")[0]?.trim() !== "application/json") {
		sendText(res, 415, "Unsupported media type");
		return;
	}
	if (!consumeRateLimit(req.socket.remoteAddress ?? "unknown")) {
		sendText(res, 429, "Too many requests");
		return;
	}
	const body = await readJsonBody(req);
	if (body === "too-large") {
		sendText(res, 413, "Payload too large");
		return;
	}
	if (!body) {
		sendText(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
		return;
	}
	const accountId = normalizeAccountId(body.accountId ?? "default");
	const cfg = currentConfig(api);
	const account = resolveTelegramAccount({
		cfg,
		accountId
	});
	const validated = validateTelegramMiniAppInitData({
		initData: body.initData,
		botToken: account.token
	});
	if (!validated) {
		sendText(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
		return;
	}
	if (!await isTelegramMiniAppOwner({
		cfg,
		accountId,
		userId: validated.userId
	})) {
		sendText(res, 403, "Restricted to the bot owner.");
		return;
	}
	let urls;
	try {
		urls = await resolveTelegramMiniAppUrls({ cfg });
	} catch {
		sendText(res, 503, TELEGRAM_MINIAPP_URL_ERROR);
		return;
	}
	if (!launchTickets.consume({
		ticket: body.launchTicket,
		accountId,
		userId: validated.userId
	})) {
		sendText(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
		return;
	}
	if (!rememberReplay(validated.hash, validated.authDateMs + 3e5)) {
		sendText(res, 401, TELEGRAM_MINIAPP_EXPIRED_MESSAGE);
		return;
	}
	sendJson(res, 200, {
		bootstrapToken: (await issueDeviceBootstrapToken({ profile: {
			roles: ["operator"],
			scopes: BOOTSTRAP_HANDOFF_OPERATOR_SCOPES,
			purpose: "control-ui"
		} })).token,
		controlUiUrl: urls.controlUiUrl,
		gatewayUrl: urls.gatewayUrl
	});
}
function currentConfig(api) {
	return api.runtime.config?.current?.() ?? api.config;
}
async function readJsonBody(req) {
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buffer.length;
		if (total > MAX_BODY_BYTES) return "too-large";
		chunks.push(buffer);
	}
	try {
		const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
		if (typeof parsed.initData !== "string" || typeof parsed.launchTicket !== "string") return null;
		return {
			initData: parsed.initData,
			launchTicket: parsed.launchTicket,
			...typeof parsed.accountId === "string" ? { accountId: parsed.accountId } : {}
		};
	} catch {
		return null;
	}
}
function consumeRateLimit(ip) {
	const now = Date.now();
	const current = rateLimit.get(ip);
	if (!current || current.resetAtMs <= now) {
		rateLimit.set(ip, {
			count: 1,
			resetAtMs: now + RATE_LIMIT_WINDOW_MS
		});
		return true;
	}
	current.count += 1;
	return current.count <= RATE_LIMIT_MAX;
}
function rememberReplay(hash, expiresAtMs) {
	pruneReplayCache();
	if (replayCache.has(hash)) return false;
	replayCache.set(hash, expiresAtMs);
	while (replayCache.size > REPLAY_CACHE_LIMIT) {
		const first = replayCache.keys().next().value;
		if (!first) return true;
		replayCache.delete(first);
	}
	return true;
}
function pruneReplayCache() {
	const now = Date.now();
	for (const [hash, expiresAtMs] of replayCache) if (expiresAtMs <= now) replayCache.delete(hash);
}
function securityHeaders(extra) {
	return {
		"Cache-Control": "no-store",
		"Referrer-Policy": "no-referrer",
		"X-Robots-Tag": "noindex",
		...extra
	};
}
function sendHtml(res, status, body, nonce) {
	res.writeHead(status, securityHeaders({
		"Content-Type": "text/html; charset=utf-8",
		"Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}' https://telegram.org; connect-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'`
	}));
	res.end(body);
}
function sendJson(res, status, body) {
	res.writeHead(status, securityHeaders({ "Content-Type": "application/json; charset=utf-8" }));
	res.end(JSON.stringify(body));
}
function sendText(res, status, body) {
	res.writeHead(status, securityHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
	res.end(body);
}
//#endregion
//#region extensions/telegram/miniapp-api.ts
function registerTelegramMiniApp(api) {
	const launchTickets = createTelegramMiniAppLaunchTickets();
	registerTelegramMiniAppRoutes(api, launchTickets);
	registerTelegramMiniAppCommand(api, launchTickets);
}
//#endregion
export { registerTelegramMiniApp as t };
