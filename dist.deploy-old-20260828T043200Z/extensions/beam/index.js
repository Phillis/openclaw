import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.js";
import { i as normalizeBoundedOptionalString } from "../../string-coerce-CIXf7egm.js";
import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import { g as resolveSessionAgentIds } from "../../agent-scope-DigoIwHb.js";
import { g as resolveDefaultAgentId } from "../../agent-scope-config-CUBiGmG3.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "../../ssrf-arYIaOWE.js";
import { i as fetchWithSsrFGuard, n as GuardedFetchRedirectError } from "../../fetch-guard-D2tMUB-B.js";
import { i as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-B19X7f09.js";
import { t as resolveConfiguredSecretInputString } from "../../resolve-configured-secret-input-string-DCrdl1eX.js";
import { r as buildControlUiCatalogSessionUrl } from "../../src-3ZTr3FeO.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import "../../ssrf-runtime-CpSMUPcn.js";
import "../../agent-runtime-BKn3ysXa.js";
import "../../plugin-runtime-BgsiNjBF.js";
import { t as listActiveSessionCatalogs } from "../../session-catalog-runtime-7LB1Og_9.js";
import "../../secret-input-runtime-CMP_ZlQP.js";
import "../../text-utility-runtime-BNhX-3os.js";
import { a as createFixedWindowRateLimiter } from "../../webhook-ingress-IarruVNi.js";
import { a as createWebhookInFlightLimiter, i as beginWebhookRequestPipelineOrReject, s as readJsonWebhookBodyOrReject } from "../../webhook-request-guards-BYzmIdMp.js";
import { createHash } from "node:crypto";
//#region extensions/beam/src/types.ts
const BEAM_HOST_ID = "gateway";
const BEAM_MAX_BODY_BYTES = 56 * 1024;
const BEAM_RETENTION_MS = 10080 * 60 * 1e3;
const BEAM_MAX_ITEM_CHARS = 6e3;
const TOP_LEVEL_KEYS = /* @__PURE__ */ new Set([
	"version",
	"beamId",
	"source",
	"title",
	"updatedAt",
	"completed",
	"truncated",
	"hookEvent",
	"items"
]);
const ITEM_KEYS = /* @__PURE__ */ new Set(["type", "text"]);
const ITEM_TYPES = /* @__PURE__ */ new Set([
	"userMessage",
	"agentMessage",
	"other"
]);
function hasOnlyKeys(value, allowed) {
	return Object.keys(value).every((key) => allowed.has(key));
}
function isIsoTimestamp(value) {
	const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
	if (!match || !Number.isFinite(Date.parse(value))) return false;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const hour = Number(match[4]);
	const minute = Number(match[5]);
	const second = Number(match[6]);
	const offsetHour = Number(match[8] ?? 0);
	const offsetMinute = Number(match[9] ?? 0);
	if (hour > 23 || minute > 59 || second > 59 || offsetHour > 23 || offsetMinute > 59) return false;
	const calendar = /* @__PURE__ */ new Date(0);
	calendar.setUTCFullYear(year, month - 1, day);
	calendar.setUTCHours(hour, minute, second, 0);
	return calendar.getUTCFullYear() === year && calendar.getUTCMonth() === month - 1 && calendar.getUTCDate() === day && calendar.getUTCHours() === hour && calendar.getUTCMinutes() === minute && calendar.getUTCSeconds() === second;
}
function parseBeamUpload(value) {
	if (!isRecord(value) || !hasOnlyKeys(value, TOP_LEVEL_KEYS)) return {
		ok: false,
		error: "request body must be a closed Beam object"
	};
	if (value.version !== 1) return {
		ok: false,
		error: "version must be 1"
	};
	const beamId = normalizeBoundedOptionalString(value.beamId, 64);
	if (!beamId || !/^[a-f0-9]{32}$/i.test(beamId)) return {
		ok: false,
		error: "beamId must be a 32-character hex id"
	};
	const source = normalizeBoundedOptionalString(value.source, 32);
	if (!source || !/^[a-z0-9._-]+$/i.test(source)) return {
		ok: false,
		error: "source must be a short identifier"
	};
	const title = normalizeBoundedOptionalString(value.title, 160);
	if (!title) return {
		ok: false,
		error: "title must be a non-empty string"
	};
	const updatedAt = normalizeBoundedOptionalString(value.updatedAt, 64);
	if (!updatedAt || !isIsoTimestamp(updatedAt)) return {
		ok: false,
		error: "updatedAt must be an ISO timestamp"
	};
	if (typeof value.completed !== "boolean") return {
		ok: false,
		error: "completed must be a boolean"
	};
	if (value.truncated !== void 0 && typeof value.truncated !== "boolean") return {
		ok: false,
		error: "truncated must be a boolean"
	};
	const hookEvent = value.hookEvent === void 0 ? void 0 : normalizeBoundedOptionalString(value.hookEvent, 64);
	if (value.hookEvent !== void 0 && !hookEvent) return {
		ok: false,
		error: "hookEvent must be a short string"
	};
	if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 200) return {
		ok: false,
		error: `items must contain 1-200 entries`
	};
	const items = [];
	for (const rawItem of value.items) {
		if (!isRecord(rawItem) || !hasOnlyKeys(rawItem, ITEM_KEYS)) return {
			ok: false,
			error: "each transcript item must be a closed object"
		};
		if (typeof rawItem.type !== "string" || !ITEM_TYPES.has(rawItem.type)) return {
			ok: false,
			error: "transcript item type is invalid"
		};
		const text = normalizeBoundedOptionalString(rawItem.text, BEAM_MAX_ITEM_CHARS);
		if (!text) return {
			ok: false,
			error: `transcript item text must be 1-${BEAM_MAX_ITEM_CHARS} characters`
		};
		items.push({
			type: rawItem.type,
			text
		});
	}
	return {
		ok: true,
		value: {
			version: 1,
			beamId: beamId.toLowerCase(),
			source: source.toLowerCase(),
			title,
			updatedAt,
			completed: value.completed,
			...value.truncated === true ? { truncated: true } : {},
			...hookEvent ? { hookEvent } : {},
			items
		}
	};
}
//#endregion
//#region extensions/beam/src/http.ts
function sendJson(res, status, value) {
	res.statusCode = status;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(value));
}
function firstHeader(req, name) {
	const value = req.headers[name];
	return (Array.isArray(value) ? value[0] : value)?.trim() || void 0;
}
function currentRequestClient(req) {
	const client = getPluginRuntimeGatewayRequestScope()?.client;
	return {
		clientIp: client?.clientIp ?? req.socket.remoteAddress ?? "unknown",
		scopes: client?.connect?.scopes ?? []
	};
}
function canPublish(scopes) {
	return scopes.includes("operator.write") || scopes.includes("operator.admin");
}
function createBeamRequestHandler(params) {
	const rateLimiter = createFixedWindowRateLimiter({
		windowMs: 6e4,
		maxRequests: 60,
		maxTrackedKeys: 2048
	});
	const inFlightLimiter = createWebhookInFlightLimiter({
		maxInFlightPerKey: 2,
		maxTrackedKeys: 2048
	});
	return async (req, res) => {
		const client = params.resolveClient?.(req) ?? currentRequestClient(req);
		if (!canPublish(client.scopes)) {
			sendJson(res, 403, {
				ok: false,
				error: "operator.write is required"
			});
			return true;
		}
		const pipeline = beginWebhookRequestPipelineOrReject({
			req,
			res,
			allowMethods: ["POST"],
			requireJsonContentType: true,
			rateLimiter,
			rateLimitKey: client.clientIp,
			inFlightLimiter,
			inFlightKey: client.clientIp
		});
		if (!pipeline.ok) return true;
		try {
			const contentLength = Number(firstHeader(req, "content-length"));
			if (Number.isFinite(contentLength) && contentLength > 57344) {
				sendJson(res, 413, {
					ok: false,
					error: "Payload Too Large"
				});
				return true;
			}
			const body = await readJsonWebhookBodyOrReject({
				req,
				res,
				maxBytes: BEAM_MAX_BODY_BYTES,
				timeoutMs: 1e4,
				emptyObjectOnEmpty: false,
				invalidJsonMessage: "invalid Beam request body"
			});
			if (!body.ok) return true;
			const parsed = parseBeamUpload(body.value);
			if (!parsed.ok) {
				sendJson(res, 400, {
					ok: false,
					error: parsed.error
				});
				return true;
			}
			const receivedAt = params.now?.() ?? Date.now();
			const existing = await params.store.get(parsed.value.beamId);
			await params.store.put({
				...parsed.value,
				createdAt: existing?.createdAt ?? receivedAt,
				receivedAt
			});
			sendJson(res, 200, {
				ok: true,
				beamId: parsed.value.beamId,
				url: buildControlUiCatalogSessionUrl({
					namespace: "chat",
					...params.resolveControlUiTarget(),
					catalog: "beam",
					host: BEAM_HOST_ID,
					thread: parsed.value.beamId
				})
			});
			return true;
		} finally {
			pipeline.release();
		}
	};
}
//#endregion
//#region extensions/beam/src/mirror.ts
const MIRROR_CONFIG_PATH = "plugins.entries.beam.config.mirror";
const MIRROR_TOKEN_PATH = `${MIRROR_CONFIG_PATH}.token`;
const DEFAULT_POLL_SECONDS = 30;
const DEFAULT_ACTIVE_WINDOW_MINUTES = 180;
const MIRROR_LIST_LIMIT = 100;
const MIRROR_READ_LIMIT = 50;
const MIRROR_MAX_SESSIONS = 32;
const MIRROR_BODY_BUDGET_BYTES = BEAM_MAX_BODY_BYTES - 2048;
const MIRROR_WARN_INTERVAL_MS = 5 * 6e4;
const MIRROR_UPLOAD_TIMEOUT_MS = 15e3;
function isLoopbackHostname(hostname) {
	const bare = hostname.replace(/^\[|\]$/g, "");
	return bare === "localhost" || bare === "127.0.0.1" || bare === "::1";
}
const MIRROR_KEYS = /* @__PURE__ */ new Set([
	"endpoint",
	"token",
	"catalogs",
	"pollSeconds",
	"activeWindowMinutes"
]);
function boundedNumber(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(max, Math.max(min, value));
}
/** Returns the mirror config, undefined when mirroring is not configured, or an error string. */
function parseBeamMirrorConfig(config) {
	if (!isRecord(config)) return;
	const plugins = isRecord(config.plugins) ? config.plugins : void 0;
	const entries = isRecord(plugins?.entries) ? plugins.entries : void 0;
	const entry = isRecord(entries?.beam) ? entries.beam : void 0;
	const mirror = (isRecord(entry?.config) ? entry.config : void 0)?.mirror;
	if (mirror === void 0) return;
	if (!isRecord(mirror) || !Object.keys(mirror).every((key) => MIRROR_KEYS.has(key))) return `${MIRROR_CONFIG_PATH} must be a closed object with endpoint/token/catalogs/pollSeconds/activeWindowMinutes`;
	const endpoint = typeof mirror.endpoint === "string" ? mirror.endpoint.trim() : "";
	let parsedEndpoint;
	try {
		parsedEndpoint = new URL(endpoint);
	} catch {
		return `${MIRROR_CONFIG_PATH}.endpoint must be an absolute URL`;
	}
	if (parsedEndpoint.protocol === "http:") {
		if (!isLoopbackHostname(parsedEndpoint.hostname)) return `${MIRROR_CONFIG_PATH}.endpoint must use https for non-loopback hosts`;
	} else if (parsedEndpoint.protocol !== "https:") return `${MIRROR_CONFIG_PATH}.endpoint must use http(s)`;
	if (!Array.isArray(mirror.catalogs) || mirror.catalogs.length === 0 || mirror.catalogs.some((id) => typeof id !== "string" || !id.trim())) return `${MIRROR_CONFIG_PATH}.catalogs must explicitly list the catalog ids to mirror`;
	const catalogs = mirror.catalogs.map((id) => id.trim().toLowerCase());
	return {
		endpoint,
		...mirror.token !== void 0 ? { token: mirror.token } : {},
		catalogs,
		pollSeconds: boundedNumber(mirror.pollSeconds, DEFAULT_POLL_SECONDS, 10, 3600),
		activeWindowMinutes: boundedNumber(mirror.activeWindowMinutes, DEFAULT_ACTIVE_WINDOW_MINUTES, 1, 10080)
	};
}
function beamMirrorId(catalogId, hostId, threadId) {
	return createHash("sha256").update(`${catalogId}\0${hostId}\0${threadId}`).digest("hex").slice(0, 32);
}
function clipText(text) {
	return truncateUtf16Safe(text, BEAM_MAX_ITEM_CHARS);
}
function droppedSummary(counts) {
	if (counts.size === 0) return;
	return `${[...counts.entries()].map(([kind, count]) => `${count} ${kind}`).join(", ")}; raw content dropped`;
}
/**
* Reduce catalog transcript items to the Beam wire shape. Only user/agent
* message text crosses the wire; reasoning, tool calls, tool results, and raw
* payloads collapse into compact counts, matching the beam skill's redaction
* contract so the mirror never widens what a manual publish would share.
*/
function buildBeamMirrorItems(items) {
	const out = [];
	let dropped = /* @__PURE__ */ new Map();
	let droppedRaw = 0;
	const flush = () => {
		const summary = droppedSummary(dropped);
		if (summary) {
			out.push({
				type: "other",
				text: clipText(summary)
			});
			dropped = /* @__PURE__ */ new Map();
		}
	};
	const droppedLabel = (type) => {
		switch (type) {
			case "toolCall": return "tool calls";
			case "toolResult": return "tool results";
			case "reasoning": return "reasoning items";
			default: return "other entries";
		}
	};
	for (const item of items) {
		const text = item.text?.trim();
		if ((item.type === "userMessage" || item.type === "agentMessage") && text) {
			flush();
			out.push({
				type: item.type,
				text: clipText(text)
			});
			continue;
		}
		droppedRaw += 1;
		const label = droppedLabel(item.type);
		dropped.set(label, (dropped.get(label) ?? 0) + 1);
	}
	flush();
	return {
		items: out,
		droppedRaw
	};
}
/** Drop oldest items until the payload fits the receiver's item and byte caps. */
function fitBeamMirrorUpload(upload) {
	let items = upload.items.slice(-200);
	const truncatedByCount = upload.truncated === true || items.length < upload.items.length;
	let fitted = {
		...upload,
		items,
		...truncatedByCount ? { truncated: true } : {}
	};
	while (items.length > 1 && Buffer.byteLength(JSON.stringify(fitted), "utf8") > MIRROR_BODY_BUDGET_BYTES) {
		items = items.slice(1);
		fitted = {
			...upload,
			items,
			truncated: true
		};
	}
	return fitted;
}
function hostCandidates(catalogId, hosts, activeSinceMs) {
	const out = [];
	for (const host of hosts) {
		if (host.kind !== "gateway") continue;
		for (const session of host.sessions) {
			const recencyAt = session.recencyAt ?? session.updatedAt ?? 0;
			if (recencyAt < activeSinceMs) continue;
			out.push({
				catalogId,
				hostId: host.hostId,
				threadId: session.threadId,
				title: session.name?.trim() || `${catalogId} session`,
				recencyAt
			});
		}
	}
	return out;
}
function createBeamMirrorRunner(params) {
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now;
	const listCatalogs = params.listCatalogs ?? listActiveSessionCatalogs;
	const tracked = /* @__PURE__ */ new Map();
	const controller = new AbortController();
	const { signal } = controller;
	let lastWarnAt = 0;
	let warnedProcessHomeIsolation = false;
	let redirectBlockedEndpoint;
	let activeTick;
	let stopPromise;
	const stopError = /* @__PURE__ */ new Error("Beam mirror stopped");
	const raceCatalog = async (operation) => {
		let rejectAbort;
		const aborted = new Promise((_, reject) => {
			rejectAbort = reject;
		});
		const abort = () => rejectAbort(stopError);
		signal.addEventListener("abort", abort, { once: true });
		try {
			if (signal.aborted) abort();
			return await Promise.race([operation, aborted]);
		} finally {
			signal.removeEventListener("abort", abort);
		}
	};
	const warnThrottled = (message) => {
		if (now() - lastWarnAt >= MIRROR_WARN_INTERVAL_MS) {
			lastWarnAt = now();
			params.logger.warn(message);
		}
	};
	const upload = async (endpoint, token, payload) => {
		if (signal.aborted || redirectBlockedEndpoint === endpoint) return false;
		redirectBlockedEndpoint = void 0;
		let guarded;
		try {
			guarded = await fetchWithSsrFGuard({
				url: endpoint,
				fetchImpl: params.fetchFn,
				timeoutMs: MIRROR_UPLOAD_TIMEOUT_MS,
				signal,
				policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(endpoint),
				auditContext: "beam.mirror_upload",
				maxRedirects: 0,
				init: {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...token ? { Authorization: `Bearer ${token}` } : {}
					},
					body: JSON.stringify(payload)
				}
			});
		} catch (error) {
			signal.throwIfAborted();
			if (error instanceof GuardedFetchRedirectError) {
				redirectBlockedEndpoint = endpoint;
				params.logger.warn(`beam mirror upload blocked for ${payload.source}: receiver returned redirect (${error.status}); redirects are not followed; configure the final endpoint`);
				return false;
			}
			throw error;
		}
		const { response, release } = guarded;
		try {
			signal.throwIfAborted();
			if (!response.ok) {
				warnThrottled(`beam mirror upload failed (${response.status}) for ${payload.source}`);
				return false;
			}
			return true;
		} finally {
			await response.body?.cancel().catch(() => void 0);
			await release();
		}
	};
	const buildUpload = async (agentId, catalog, candidate, completed) => {
		const transcript = await raceCatalog(catalog.read({
			agentId,
			hostId: candidate.hostId,
			threadId: candidate.threadId,
			limit: MIRROR_READ_LIMIT
		}));
		signal.throwIfAborted();
		const reduced = buildBeamMirrorItems(transcript.items);
		const items = reduced.items.length ? reduced.items : [{
			type: "other",
			text: "no shareable messages yet"
		}];
		return fitBeamMirrorUpload({
			version: 1,
			beamId: beamMirrorId(candidate.catalogId, candidate.hostId, candidate.threadId),
			source: candidate.catalogId,
			title: truncateUtf16Safe(candidate.title, 160),
			updatedAt: new Date(candidate.recencyAt || now()).toISOString(),
			completed,
			items
		});
	};
	const mirrorFingerprint = (payload) => createHash("sha256").update(JSON.stringify({
		title: payload.title,
		completed: payload.completed,
		items: payload.items
	})).digest("hex");
	const scan = async () => {
		try {
			const config = params.runtime.config.current();
			const mirror = parseBeamMirrorConfig(config);
			if (mirror === void 0) return;
			if (typeof mirror === "string") {
				warnThrottled(`beam mirror disabled: ${mirror}`);
				return;
			}
			let agentId;
			try {
				agentId = resolveSessionAgentIds({ config }).defaultAgentId;
			} catch (error) {
				warnThrottled(`beam mirror disabled: ${String(error)}`);
				return;
			}
			let token;
			if (mirror.token !== void 0) {
				const resolved = await resolveConfiguredSecretInputString({
					config,
					env,
					value: mirror.token,
					path: MIRROR_TOKEN_PATH
				});
				signal.throwIfAborted();
				if (!resolved.value) {
					warnThrottled(`beam mirror token unresolved${resolved.unresolvedRefReason ? `: ${resolved.unresolvedRefReason}` : ""}`);
					return;
				}
				token = resolved.value;
			}
			const activeSinceMs = now() - mirror.activeWindowMinutes * 6e4;
			const catalogs = listCatalogs().filter((catalog) => catalog.id !== "beam" && mirror.catalogs.includes(catalog.id));
			if (!warnedProcessHomeIsolation && catalogs.some((catalog) => !catalog.processHomeFallbackAllowed)) {
				warnedProcessHomeIsolation = true;
				params.logger.warn("beam mirror process-HOME fallback disabled: isolated state; only explicit catalog roots can be mirrored");
			}
			const catalogById = new Map(catalogs.map((catalog) => [catalog.id, catalog]));
			const candidates = [];
			for (const catalog of catalogs) {
				signal.throwIfAborted();
				try {
					const hosts = await raceCatalog(catalog.list({
						agentId,
						limitPerHost: MIRROR_LIST_LIMIT
					}));
					signal.throwIfAborted();
					candidates.push(...hostCandidates(catalog.id, hosts, activeSinceMs));
				} catch (error) {
					signal.throwIfAborted();
					warnThrottled(`beam mirror list failed for ${catalog.id}: ${String(error)}`);
				}
			}
			candidates.sort((left, right) => right.recencyAt - left.recencyAt);
			const selected = candidates.slice(0, MIRROR_MAX_SESSIONS);
			const selectedKeys = /* @__PURE__ */ new Set();
			for (const candidate of selected) {
				signal.throwIfAborted();
				const key = `${candidate.catalogId}\0${candidate.hostId}\0${candidate.threadId}`;
				selectedKeys.add(key);
				const catalog = catalogById.get(candidate.catalogId);
				if (!catalog) continue;
				try {
					const payload = await buildUpload(agentId, catalog, candidate, false);
					signal.throwIfAborted();
					const fingerprint = mirrorFingerprint(payload);
					if (tracked.get(key)?.fingerprint === fingerprint) continue;
					const uploaded = await upload(mirror.endpoint, token, payload);
					signal.throwIfAborted();
					if (uploaded) tracked.set(key, {
						candidate,
						fingerprint
					});
				} catch (error) {
					signal.throwIfAborted();
					warnThrottled(`beam mirror upload failed for ${candidate.catalogId}: ${String(error)}`);
				}
			}
			for (const [key, entry] of tracked) {
				signal.throwIfAborted();
				if (selectedKeys.has(key)) continue;
				tracked.delete(key);
				const catalog = catalogById.get(entry.candidate.catalogId);
				if (!catalog) continue;
				try {
					const payload = await buildUpload(agentId, catalog, entry.candidate, true);
					signal.throwIfAborted();
					await upload(mirror.endpoint, token, payload);
				} catch {}
			}
		} catch (error) {
			if (!signal.aborted) throw error;
		}
	};
	return {
		tick: () => {
			if (signal.aborted) return stopPromise ?? Promise.resolve();
			activeTick ??= scan().finally(() => {
				activeTick = void 0;
			});
			return activeTick;
		},
		stop: () => {
			if (!stopPromise) {
				stopPromise = activeTick ?? Promise.resolve();
				controller.abort();
			}
			return stopPromise;
		}
	};
}
function createBeamMirrorService(params) {
	let interval;
	let runner;
	return {
		id: "beam-mirror",
		start(ctx) {
			const mirror = parseBeamMirrorConfig(params.runtime.config.current());
			if (mirror === void 0) return;
			if (typeof mirror === "string") {
				ctx.logger.warn(`beam mirror disabled: ${mirror}`);
				return;
			}
			runner = createBeamMirrorRunner({
				runtime: params.runtime,
				logger: ctx.logger
			});
			interval = setInterval(() => {
				runner?.tick();
			}, mirror.pollSeconds * 1e3);
			interval.unref?.();
			ctx.logger.info(`beam mirror active: ${mirror.catalogs.join(", ")} -> ${mirror.endpoint}`);
			runner.tick();
		},
		stop() {
			if (interval) {
				clearInterval(interval);
				interval = void 0;
			}
			return runner?.stop() ?? Promise.resolve();
		}
	};
}
//#endregion
//#region extensions/beam/src/session-catalog.ts
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
function boundedLimit(value) {
	return Math.min(MAX_LIMIT, Math.max(1, value ?? DEFAULT_LIMIT));
}
function cursorOffset(value) {
	if (!value || !/^\d+$/.test(value)) return 0;
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}
function searchableText(session) {
	return `${session.title}\n${session.source}`.toLowerCase();
}
function transcriptItems(session) {
	return session.items.map((item, index) => ({
		id: `${session.beamId}:${index}`,
		type: item.type,
		text: item.text,
		timestamp: session.updatedAt
	}));
}
function transcriptRevision(session) {
	return createHash("sha256").update(JSON.stringify(session.items)).digest("base64url");
}
function encodeTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function decodeTranscriptCursor(value) {
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && typeof parsed.revision === "string" && /^[A-Za-z0-9_-]{43}$/.test(parsed.revision) && typeof parsed.end === "number" && Number.isSafeInteger(parsed.end) && parsed.end >= 0) return parsed;
	} catch {}
	throw new Error("invalid Beam transcript cursor");
}
function transcriptPage(items, limit, revision, cursor) {
	if (cursor && cursor.revision !== revision) throw new Error("stale Beam transcript cursor");
	const end = Math.min(items.length, Math.max(0, cursor?.end ?? items.length));
	const start = Math.max(0, end - limit);
	return {
		items: items.slice(start, end),
		...start > 0 ? { nextCursor: encodeTranscriptCursor({
			revision,
			end: start
		}) } : {}
	};
}
function createBeamSessionCatalog(store) {
	return {
		id: "beam",
		label: "Beam",
		supportsProcessHomeIsolation: true,
		async list(params) {
			const search = params.search?.trim().toLowerCase();
			const sessions = (await store.list()).filter((session) => !search || searchableText(session).includes(search)).toSorted((left, right) => right.receivedAt - left.receivedAt);
			const offset = cursorOffset(params.cursors?.[BEAM_HOST_ID]);
			const limit = boundedLimit(params.limitPerHost);
			const page = sessions.slice(offset, offset + limit);
			return [{
				hostId: BEAM_HOST_ID,
				label: "Beamed sessions",
				kind: "gateway",
				connected: true,
				sessions: page.map((session) => ({
					threadId: session.beamId,
					name: session.title,
					status: session.completed ? "completed" : "live",
					createdAt: session.createdAt,
					updatedAt: session.receivedAt,
					recencyAt: session.receivedAt,
					source: session.source,
					archived: false,
					canContinue: false,
					canArchive: false
				})),
				...offset + page.length < sessions.length ? { nextCursor: String(offset + page.length) } : {}
			}];
		},
		async read(params) {
			if (params.hostId !== "gateway") throw new Error(`unknown Beam host: ${params.hostId}`);
			const session = await store.get(params.threadId);
			if (!session) throw new Error(`unknown Beam session: ${params.threadId}`);
			const page = transcriptPage(transcriptItems(session), boundedLimit(params.limit), transcriptRevision(session), params.cursor === void 0 ? void 0 : decodeTranscriptCursor(params.cursor));
			return {
				hostId: BEAM_HOST_ID,
				label: session.title,
				threadId: session.beamId,
				...page
			};
		}
	};
}
//#endregion
//#region extensions/beam/src/store.ts
function createBeamStore(runtime) {
	const store = runtime.state.openKeyedStore({
		namespace: "sessions",
		maxEntries: 500,
		overflowPolicy: "evict-oldest",
		defaultTtlMs: BEAM_RETENTION_MS
	});
	return {
		put: async (session) => {
			await store.register(session.beamId, session);
		},
		get: (beamId) => store.lookup(beamId),
		list: async () => (await store.entries()).map((entry) => entry.value)
	};
}
//#endregion
//#region extensions/beam/index.ts
var beam_default = definePluginEntry({
	id: "beam",
	name: "Beam",
	description: "Receive redacted local coding sessions as a read-only catalog",
	register(api) {
		const store = createBeamStore(api.runtime);
		api.registerSessionCatalog(createBeamSessionCatalog(store));
		api.registerHttpRoute({
			path: "/api/v1/beam/sessions",
			auth: "gateway",
			match: "exact",
			handler: createBeamRequestHandler({
				store,
				resolveControlUiTarget: () => {
					const config = api.runtime.config.current();
					return {
						agentId: resolveDefaultAgentId(config),
						basePath: config.gateway?.controlUi?.basePath
					};
				}
			})
		});
		api.registerService(createBeamMirrorService({ runtime: api.runtime }));
	}
});
//#endregion
export { beam_default as default };
