import { r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-uyT2Z2BT.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { s as ensureDir } from "./utils-D9gvQMP6.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import "./runtime-env-dZQRmQRq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-BSdEoze8.js";
import "./security-runtime-fAO34zGh.js";
import "./state-paths-BIUvtBLx.js";
import "./media-mime-DQ4Ibr5o.js";
import { a as isA2uiPath, i as injectCanvasRuntime, n as CANVAS_HOST_PATH, t as A2UI_PATH } from "./a2ui-shared-DDz7uktk.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { clearTimeout, setTimeout } from "node:timers";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
//#region extensions/canvas/src/host/file-resolver.ts
/**
* Safe file resolution helpers for Canvas-hosted static assets.
*/
/** Normalizes a decoded URL path into a leading-slash POSIX path. */
function normalizeUrlPath(rawPath) {
	const decoded = decodeURIComponent(rawPath || "/");
	const normalized = path.posix.normalize(decoded);
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
function pathEscapesRoot(decodedPath) {
	let depth = 0;
	for (const segment of decodedPath.split("/")) {
		if (segment === "" || segment === ".") continue;
		if (segment === "..") {
			if (depth === 0) return true;
			depth--;
			continue;
		}
		depth++;
	}
	return false;
}
function tryNormalizeUrlPath(rawPath) {
	let decoded;
	try {
		decoded = decodeURIComponent(rawPath || "/");
	} catch {
		return null;
	}
	if (pathEscapesRoot(decoded)) return null;
	const normalized = path.posix.normalize(decoded);
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
/** Opens a Canvas-hosted file only when the request stays inside the root. */
async function resolveFileWithinRoot(rootReal, urlPath) {
	const normalized = tryNormalizeUrlPath(urlPath);
	if (normalized === null) return null;
	const rel = normalized.replace(/^\/+/, "");
	if (rel.split("/").some((p) => p === "..")) return null;
	const root$1 = await root(rootReal);
	const tryOpen = async (relative) => {
		try {
			return await root$1.open(relative);
		} catch (err) {
			if (err instanceof FsSafeError) return null;
			throw err;
		}
	};
	if (normalized.endsWith("/")) return await tryOpen(path.posix.join(rel, "index.html"));
	try {
		const st = await root$1.stat(rel);
		if (st.isSymbolicLink) return null;
		if (st.isDirectory) return await tryOpen(path.posix.join(rel, "index.html"));
	} catch (err) {
		if (err instanceof FsSafeError) return null;
		throw err;
	}
	return await tryOpen(rel);
}
//#endregion
//#region extensions/canvas/src/host/a2ui.ts
/**
* HTTP handler for serving bundled A2UI assets through Canvas host routes.
*/
let cachedA2uiRootReal;
let resolvingA2uiRoot = null;
let cachedA2uiResolvedAtMs = 0;
const A2UI_ROOT_RETRY_NULL_AFTER_MS = 1e4;
async function resolveA2uiRoot() {
	const here = path.dirname(fileURLToPath(import.meta.url));
	const entryDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : null;
	const candidates = [
		path.resolve(here, "a2ui"),
		path.resolve(here, "canvas-host/a2ui"),
		...entryDir ? [path.resolve(entryDir, "a2ui"), path.resolve(entryDir, "canvas-host/a2ui")] : [],
		path.resolve(here, "../../extensions/canvas/src/host/a2ui"),
		path.resolve(here, "../extensions/canvas/src/host/a2ui"),
		path.resolve(process.cwd(), "extensions/canvas/src/host/a2ui"),
		path.resolve(process.cwd(), "dist/canvas-host/a2ui")
	];
	if (process.execPath) candidates.unshift(path.resolve(path.dirname(process.execPath), "a2ui"));
	for (const dir of candidates) try {
		const indexPath = path.join(dir, "index.html");
		const bundlePath = path.join(dir, "a2ui.bundle.js");
		await fs.stat(indexPath);
		await fs.stat(bundlePath);
		return dir;
	} catch {}
	return null;
}
async function resolveA2uiRootReal() {
	if (cachedA2uiRootReal !== void 0 && (cachedA2uiRootReal !== null || Date.now() - cachedA2uiResolvedAtMs < A2UI_ROOT_RETRY_NULL_AFTER_MS)) return cachedA2uiRootReal;
	if (!resolvingA2uiRoot) resolvingA2uiRoot = (async () => {
		const root = await resolveA2uiRoot();
		cachedA2uiRootReal = root ? await fs.realpath(root) : null;
		cachedA2uiResolvedAtMs = Date.now();
		resolvingA2uiRoot = null;
		return cachedA2uiRootReal;
	})();
	return resolvingA2uiRoot;
}
async function handleA2uiHttpRequestWithRootResolver(req, res, resolveRootReal, options) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	const url = new URL(urlRaw, "http://localhost");
	const basePath = isA2uiPath(url.pathname) ? A2UI_PATH : void 0;
	if (!basePath) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Method Not Allowed");
		return true;
	}
	const a2uiRootReal = await resolveRootReal();
	if (!a2uiRootReal) {
		res.statusCode = 503;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("A2UI assets not found");
		return true;
	}
	const result = await resolveFileWithinRoot(a2uiRootReal, url.pathname.slice(basePath.length) || "/");
	if (!result) {
		res.statusCode = 404;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("not found");
		return true;
	}
	try {
		const lower = lowercasePreservingWhitespace(result.realPath);
		const mime = lower.endsWith(".html") || lower.endsWith(".htm") ? "text/html" : await detectMime({ filePath: result.realPath }) ?? "application/octet-stream";
		res.setHeader("Cache-Control", "no-store");
		if (mime === "text/html") {
			const body = injectCanvasRuntime(await result.handle.readFile({ encoding: "utf8" }), options);
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			if (req.method === "HEAD") {
				res.setHeader("Content-Length", String(Buffer.byteLength(body)));
				res.end();
				return true;
			}
			res.end(body);
			return true;
		}
		res.setHeader("Content-Type", mime);
		if (req.method === "HEAD") {
			res.setHeader("Content-Length", String(result.stat.size));
			res.end();
			return true;
		}
		res.end(await result.handle.readFile());
		return true;
	} finally {
		await result.handle.close().catch(() => {});
	}
}
/** Handles one HTTP request for the hosted A2UI asset surface. */
async function handleA2uiHttpRequest(req, res, options = {}) {
	return await handleA2uiHttpRequestWithRootResolver(req, res, resolveA2uiRootReal, options);
}
//#endregion
//#region extensions/canvas/src/host/server.ts
/**
* Canvas host server and static-file/live-reload handler implementation.
*/
const CANVAS_LIVE_RELOAD_MAX_INBOUND_MESSAGE_BYTES = 64 * 1024;
function defaultIndexHTML() {
	return `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>OpenClaw Canvas</title>
<style>
  html, body { height: 100%; margin: 0; background: #000; color: #fff; font: 16px/1.4 -apple-system, BlinkMacSystemFont, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
  .wrap { min-height: 100%; display: grid; place-items: center; padding: 24px; }
  .card { width: min(720px, 100%); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 18px 18px 14px; }
  .title { display: flex; align-items: baseline; gap: 10px; }
  h1 { margin: 0; font-size: 22px; letter-spacing: 0.2px; }
  .sub { opacity: 0.75; font-size: 13px; }
  .row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
  button { appearance: none; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.10); color: #fff; padding: 10px 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
  button:active { transform: translateY(1px); }
  .ok { color: #24e08a; }
  .bad { color: #ff5c5c; }
  .log { margin-top: 14px; opacity: 0.85; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; white-space: pre-wrap; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); padding: 10px; border-radius: 12px; }
</style>
<div class="wrap">
  <div class="card">
    <div class="title">
      <h1>OpenClaw Canvas</h1>
      <div class="sub">Interactive test page</div>
    </div>

    <div class="row">
      <button id="btn-hello">Hello</button>
      <button id="btn-time">Time</button>
      <button id="btn-photo">Photo</button>
      <button id="btn-dalek">Dalek</button>
    </div>

    <div id="status" class="sub" style="margin-top: 10px;"></div>
    <div id="log" class="log">Ready.</div>
  </div>
</div>
<script>
(() => {
  const logEl = document.getElementById("log");
  const statusEl = document.getElementById("status");
  const log = (msg) => { logEl.textContent = String(msg); };

  const hasIOS = () =>
    !!(
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.openclawCanvasA2UIAction
    );
  const hasAndroid = () =>
    !!(
      (window.openclawCanvasA2UIAction &&
        typeof window.openclawCanvasA2UIAction.postMessage === "function")
    );
  const hasHelper = () => typeof window.openclawSendUserAction === "function";
  const helperReady = hasHelper();
  statusEl.textContent = "";
  statusEl.appendChild(document.createTextNode("Bridge: "));
  const bridgeStatus = document.createElement("span");
  bridgeStatus.className = helperReady ? "ok" : "bad";
  bridgeStatus.textContent = helperReady ? "ready" : "missing";
  statusEl.appendChild(bridgeStatus);
  statusEl.appendChild(
    document.createTextNode(
      " · iOS=" + (hasIOS() ? "yes" : "no") + " · Android=" + (hasAndroid() ? "yes" : "no"),
    ),
  );

  const onStatus = (ev) => {
    const d = ev && ev.detail || {};
    log("Action status: id=" + (d.id || "?") + " ok=" + String(!!d.ok) + (d.error ? (" error=" + d.error) : ""));
  };
  window.addEventListener("openclaw:a2ui-action-status", onStatus);

  function send(name, sourceComponentId) {
    if (!hasHelper()) {
      log("No action bridge found. Ensure you're viewing this on an iOS/Android OpenClaw node canvas.");
      return;
    }
    const sendUserAction =
      typeof window.openclawSendUserAction === "function"
        ? window.openclawSendUserAction
        : undefined;
    const ok = sendUserAction({
      name,
      surfaceId: "main",
      sourceComponentId,
      context: { t: Date.now() },
    });
    log(ok ? ("Sent action: " + name) : ("Failed to send action: " + name));
  }

  document.getElementById("btn-hello").onclick = () => send("hello", "demo.hello");
  document.getElementById("btn-time").onclick = () => send("time", "demo.time");
  document.getElementById("btn-photo").onclick = () => send("photo", "demo.photo");
  document.getElementById("btn-dalek").onclick = () => send("dalek", "demo.dalek");
})();
<\/script>
`;
}
function isDisabledByEnv() {
	if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_CANVAS_HOST)) return true;
	if (process.env.VITEST) return true;
	return false;
}
function normalizeBasePath(rawPath) {
	const trimmed = (rawPath ?? "/__openclaw__/canvas").trim();
	let normalized;
	try {
		normalized = normalizeUrlPath(trimmed || "/__openclaw__/canvas");
	} catch {
		normalized = normalizeUrlPath(CANVAS_HOST_PATH);
	}
	if (normalized === "/") return "/";
	return normalized.replace(/\/+$/, "");
}
async function prepareCanvasRoot(rootDir) {
	await ensureDir(rootDir);
	const rootReal = await fs.realpath(rootDir);
	try {
		const indexPath = path.join(rootReal, "index.html");
		await fs.stat(indexPath);
	} catch {
		try {
			await fs.writeFile(path.join(rootReal, "index.html"), defaultIndexHTML(), "utf8");
		} catch {}
	}
	return rootReal;
}
function resolveDefaultCanvasRoot() {
	return path.join(resolveStateDir(), "canvas");
}
function shouldIgnoreCanvasWatchPath(rootReal, candidatePath) {
	const relative = path.relative(rootReal, candidatePath);
	if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`)) return false;
	return relative.split(/[\\/]/u).some((segment) => segment.startsWith(".") || segment === "node_modules");
}
/** Creates a Canvas static-file handler with optional live reload. */
async function createCanvasHostHandler(opts) {
	const basePath = normalizeBasePath(opts.basePath);
	if (isDisabledByEnv() && opts.allowInTests !== true) return {
		rootDir: "",
		basePath,
		handleHttpRequest: async () => false,
		handleUpgrade: () => false,
		close: async () => {}
	};
	const rootDir = resolveUserPath(opts.rootDir ?? resolveDefaultCanvasRoot());
	const rootReal = await prepareCanvasRoot(rootDir);
	const liveReload = opts.liveReload !== false;
	const testMode = opts.allowInTests === true;
	const reloadDebounceMs = testMode ? 12 : 75;
	const writeStabilityThresholdMs = testMode ? 12 : 75;
	const writePollIntervalMs = testMode ? 5 : 10;
	const WebSocketServerClass = opts.webSocketServerClass ?? WebSocketServer;
	const wss = liveReload ? new WebSocketServerClass({
		noServer: true,
		maxPayload: CANVAS_LIVE_RELOAD_MAX_INBOUND_MESSAGE_BYTES
	}) : null;
	wss?.on("connection", (ws) => {
		ws.on("error", () => {});
	});
	let debounce = null;
	const broadcastReload = () => {
		if (!wss) return;
		wss.clients.forEach((ws) => ws.send("reload"));
	};
	const scheduleReload = () => {
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(() => {
			debounce = null;
			broadcastReload();
		}, reloadDebounceMs);
		if (!testMode) debounce.unref?.();
	};
	let watcherClosed = false;
	const watcher = liveReload ? (opts.watchFactory ?? chokidar.watch)(rootReal, {
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: writeStabilityThresholdMs,
			pollInterval: writePollIntervalMs
		},
		usePolling: testMode,
		ignored: (candidatePath) => shouldIgnoreCanvasWatchPath(rootReal, candidatePath)
	}) : null;
	watcher?.on("all", () => scheduleReload());
	watcher?.on("error", (err) => {
		if (watcherClosed) return;
		watcherClosed = true;
		opts.runtime.error(`Canvas host watcher error: ${String(err)} (live reload disabled; consider plugins.entries.canvas.config.host.liveReload=false or a smaller plugins.entries.canvas.config.host.root)`);
		watcher.close().catch(() => {});
	});
	const handleUpgrade = (req, socket, head) => {
		if (!wss) return false;
		if (new URL(req.url ?? "/", "http://localhost").pathname !== "/__openclaw__/ws") return false;
		wss.handleUpgrade(req, socket, head, (ws) => {
			wss.emit("connection", ws, req);
		});
		return true;
	};
	const handleHttpRequest = async (req, res) => {
		const urlRaw = req.url;
		if (!urlRaw) return false;
		try {
			const url = new URL(urlRaw, "http://localhost");
			if (url.pathname === "/__openclaw__/ws") {
				res.statusCode = liveReload ? 426 : 404;
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end(liveReload ? "upgrade required" : "not found");
				return true;
			}
			let urlPath = url.pathname;
			if (basePath !== "/") {
				if (urlPath !== basePath && !urlPath.startsWith(`${basePath}/`)) return false;
				urlPath = urlPath === basePath ? "/" : urlPath.slice(basePath.length) || "/";
			}
			if (urlPath === "/documents" || urlPath.startsWith("/documents/")) return false;
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.statusCode = 405;
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("Method Not Allowed");
				return true;
			}
			const opened = await resolveFileWithinRoot(rootReal, urlPath);
			if (!opened) {
				if (urlPath === "/" || urlPath.endsWith("/")) {
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/html; charset=utf-8");
					res.end(`<!doctype html><meta charset="utf-8" /><title>OpenClaw Canvas</title><pre>Missing file.\nCreate ${rootDir}/index.html</pre>`);
					return true;
				}
				res.statusCode = 404;
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("not found");
				return true;
			}
			const { handle, realPath } = opened;
			let data;
			try {
				data = await handle.readFile();
			} finally {
				await handle.close().catch(() => {});
			}
			const lower = lowercasePreservingWhitespace(realPath);
			const mime = lower.endsWith(".html") || lower.endsWith(".htm") ? "text/html" : await detectMime({ filePath: realPath }) ?? "application/octet-stream";
			res.setHeader("Cache-Control", "no-store");
			if (mime === "text/html") {
				const html = data.toString("utf8");
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.end(injectCanvasRuntime(html, { liveReload }));
				return true;
			}
			res.setHeader("Content-Type", mime);
			res.end(data);
			return true;
		} catch (err) {
			opts.runtime.error(`Canvas host request failed: ${String(err)}`);
			res.statusCode = 500;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("error");
			return true;
		}
	};
	return {
		rootDir,
		basePath,
		handleHttpRequest,
		handleUpgrade,
		close: async () => {
			if (debounce) clearTimeout(debounce);
			watcherClosed = true;
			await watcher?.close().catch(() => {});
			wss?.clients.forEach((ws) => ws.terminate());
			if (wss) await new Promise((resolve) => {
				wss.close(() => resolve());
			});
		}
	};
}
//#endregion
export { handleA2uiHttpRequest as n, createCanvasHostHandler as t };
