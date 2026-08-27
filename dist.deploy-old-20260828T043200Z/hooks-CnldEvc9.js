import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { E as resolveDateTimestampMs, I as resolveTimestampMsToIsoString } from "./number-coercion-CLj0HTDM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { m as redactToolPayloadText } from "./redact-CWP17HFN.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./agent-scope-DigoIwHb.js";
import { a as listAgentIds } from "./agent-scope-config-CUBiGmG3.js";
import { b as toAgentStoreSessionKey, l as isUnscopedSessionKeySentinel } from "./session-key-Dbce_H9p.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { a as closeRequestAfterResponse } from "./http-body-DthsuKdw.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { b as resolveRequestClientIp } from "./net-DeK7gO-9.js";
import { a as AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH, h as normalizeRateLimitClientIp, p as createAuthRateLimiter } from "./auth-rate-limit-C6x9QPnp.js";
import { o as readPreparedGatewayIngressAttribution } from "./ingress-attribution-CVTrlUeM.js";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { v as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CTDt7IQ1.js";
import { c as requestHeartbeat } from "./heartbeat-wake-irhQifW2.js";
import { a as enqueueSystemEvent, h as withSystemEventOwner } from "./system-events-BVZAS_Ok.js";
import "./sessions-CdrF1uzY.js";
import { r as resolveHookExternalContentSource } from "./external-content-source-DI01uOKv.js";
import "./external-content-IQUFD6xt.js";
import { n as runWithScheduledGatewayContext, t as fenceScheduledGatewayContextResolver } from "./scheduled-run-gateway-context-Bc8uToso.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BcM5GBXo.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B1taGHmD.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-cxjR1aAq.js";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-BTn_GTYc.js";
import { n as DEDUPE_TTL_MS, t as DEDUPE_MAX } from "./server-constants-DKuFNbQH.js";
import { s as sendJson } from "./http-common-m4pDgMA2.js";
import { _ as resolveHookPathBodyLimit, a as getHookSessionKeyPrefixError, b as applyHookMappings, c as normalizeAgentPayload, d as normalizeWakePayload, f as readJsonBody, g as resolveHookIdempotencyKey, h as resolveHookDeliver, i as getHookChannelError, l as normalizeHookDispatchSessionKey, m as resolveHookChannel, n as extractHookToken, o as isHookAgentAllowed, p as resolveEffectiveHookTargetAgentId, r as getHookAgentPolicyError, s as isSessionKeyAllowedByPrefix, u as normalizeHookHeaders, v as resolveHookSessionKey } from "./hooks-DlIfwGMP.js";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/server/hooks-request-handler.ts
const HOOK_AUTH_FAILURE_LIMIT = 20;
const HOOK_AUTH_FAILURE_WINDOW_MS = 6e4;
const HOOK_FAN_OUT_RESPONSE_DEADLINE_MS = 8e3;
const HOOK_FAN_OUT_DERIVED_IDEMPOTENCY = "hook-fanout-item";
const FAN_OUT_PENDING = Symbol("hook-fanout-pending");
async function settleFanOutDispatches(dispatches, deadlineMs) {
	const guarded = dispatches.map((dispatch) => dispatch.catch((err) => ({
		ok: false,
		statusCode: 502,
		error: String(err)
	})));
	let deadlineTimer;
	const deadline = new Promise((resolve) => {
		deadlineTimer = setTimeout(() => resolve(FAN_OUT_PENDING), deadlineMs);
		deadlineTimer.unref?.();
	});
	try {
		return await Promise.all(guarded.map((dispatch) => Promise.race([dispatch, deadline])));
	} finally {
		if (deadlineTimer) clearTimeout(deadlineTimer);
	}
}
function sendAgentDispatchResult(res, result) {
	if (result.ok) {
		sendJson(res, 200, {
			ok: true,
			runId: result.runId
		});
		return;
	}
	sendJson(res, result.statusCode, {
		ok: false,
		error: result.error,
		...result.runId ? { runId: result.runId } : {}
	});
}
function sendFanOutDispatchResult(res, settled) {
	const first = settled[0];
	if (settled.length === 1 && first !== void 0 && first !== FAN_OUT_PENDING) {
		sendAgentDispatchResult(res, first);
		return;
	}
	const runIds = [];
	const failures = [];
	let pending = 0;
	for (const result of settled) if (result === FAN_OUT_PENDING) pending += 1;
	else if (result.ok) runIds.push(result.runId);
	else failures.push(result);
	if (failures.length === 0 && pending === 0) {
		sendJson(res, 200, {
			ok: true,
			runId: runIds[0],
			runIds,
			dispatched: runIds.length
		});
		return;
	}
	const failure = failures[0];
	sendJson(res, failure ? failure.statusCode : 503, {
		ok: false,
		error: `hook fan-out incomplete: ${runIds.length}/${settled.length} dispatched, ${failures.length} failed, ${pending} pending`,
		runIds,
		...failures.length > 0 ? { errors: failures.slice(0, 5).map((entry) => entry.error) } : {}
	});
}
function resolveMappedHookExternalContentSource(params) {
	if (params.subPath === "gmail") return "gmail";
	return resolveHookExternalContentSource(params.sessionKey) ?? "webhook";
}
function createHooksRequestHandler(opts) {
	const { getHooksConfig, logHooks, dispatchAgentHook, dispatchWakeHook, getClientIpConfig } = opts;
	const fanoutResponseDeadlineMs = opts.fanoutResponseDeadlineMs ?? HOOK_FAN_OUT_RESPONSE_DEADLINE_MS;
	const hookReplayCache = /* @__PURE__ */ new Map();
	const pendingHookReplays = /* @__PURE__ */ new Map();
	const hookAuthLimiter = createAuthRateLimiter({
		maxAttempts: HOOK_AUTH_FAILURE_LIMIT,
		windowMs: HOOK_AUTH_FAILURE_WINDOW_MS,
		lockoutMs: HOOK_AUTH_FAILURE_WINDOW_MS,
		exemptLoopback: false,
		pruneIntervalMs: 0
	});
	const resolveHookClientKey = (req) => {
		const attribution = readPreparedGatewayIngressAttribution(req);
		if (attribution && attribution.kind !== "unattributable-proxy") return normalizeRateLimitClientIp(attribution.rateLimit.subject.key);
		const clientIpConfig = getClientIpConfig?.();
		return normalizeRateLimitClientIp(resolveRequestClientIp(req, clientIpConfig?.trustedProxies, clientIpConfig?.allowRealIpFallback === true) ?? req.socket?.remoteAddress);
	};
	const pruneHookReplayCache = (now) => {
		const cutoff = now - DEDUPE_TTL_MS;
		for (const [key, entry] of hookReplayCache) if (entry.ts < cutoff) hookReplayCache.delete(key);
		pruneMapToMaxSize(hookReplayCache, DEDUPE_MAX);
	};
	const buildHookReplayCacheKey = (params) => {
		const idem = params.idempotencyKey?.trim();
		if (!idem) return;
		const tokenFingerprint = createHash("sha256").update(params.token ?? "", "utf8").digest("hex");
		const idempotencyFingerprint = createHash("sha256").update(idem, "utf8").digest("hex");
		return `${tokenFingerprint}:${createHash("sha256").update(JSON.stringify({
			pathKey: params.pathKey,
			dispatchScope: params.dispatchScope
		}), "utf8").digest("hex")}:${idempotencyFingerprint}`;
	};
	const resolveCachedHookRunId = (key, now) => {
		if (!key) return;
		pruneHookReplayCache(now);
		const cached = hookReplayCache.get(key);
		if (!cached) return;
		hookReplayCache.delete(key);
		hookReplayCache.set(key, cached);
		return cached.runId;
	};
	const rememberHookRunId = (key, runId, now) => {
		if (!key) return;
		hookReplayCache.delete(key);
		hookReplayCache.set(key, {
			ts: now,
			runId
		});
		pruneHookReplayCache(now);
	};
	const resolveHookReplay = (key, now) => {
		if (!key) return;
		const cachedRunId = resolveCachedHookRunId(key, now);
		if (cachedRunId) return {
			ok: true,
			runId: cachedRunId
		};
		return pendingHookReplays.get(key);
	};
	const dispatchAgentHookWithReplay = (key, now, dispatch) => {
		if (!key) return dispatch();
		const existing = resolveHookReplay(key, now);
		if (existing) return existing;
		const pending = Promise.resolve().then(dispatch).then((result) => {
			if (result.ok) rememberHookRunId(key, result.runId, now);
			return result;
		}).finally(() => {
			if (pendingHookReplays.get(key) === pending) pendingHookReplays.delete(key);
		});
		pendingHookReplays.set(key, pending);
		return pending;
	};
	return async (req, res) => {
		const hooksConfig = getHooksConfig();
		if (!hooksConfig) return false;
		const url = new URL(req.url ?? "/", "http://localhost");
		const basePath = hooksConfig.basePath;
		if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false;
		if (url.searchParams.has("token")) {
			res.statusCode = 400;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Hook token must be provided via Authorization: Bearer <token> or X-OpenClaw-Token header (query parameters are not allowed).");
			return true;
		}
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "POST");
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Method Not Allowed");
			return true;
		}
		const token = extractHookToken(req);
		const clientKey = resolveHookClientKey(req);
		if (!safeEqualSecret(token, hooksConfig.token)) {
			const throttle = hookAuthLimiter.check(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
			if (!throttle.allowed) {
				const retryAfter = throttle.retryAfterMs > 0 ? Math.ceil(throttle.retryAfterMs / 1e3) : 1;
				res.statusCode = 429;
				res.setHeader("Retry-After", String(retryAfter));
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("Too Many Requests");
				logHooks.warn(`hook auth throttled for ${clientKey}; retry-after=${retryAfter}s`);
				return true;
			}
			hookAuthLimiter.recordFailure(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
			res.statusCode = 401;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Unauthorized");
			return true;
		}
		hookAuthLimiter.reset(clientKey, AUTH_RATE_LIMIT_SCOPE_HOOK_AUTH);
		const subPath = url.pathname.slice(basePath.length).replace(/^\/+/, "");
		if (!subPath) {
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Not Found");
			return true;
		}
		const body = await readJsonBody(req, resolveHookPathBodyLimit(hooksConfig, subPath));
		if (!body.ok) {
			const status = body.error === "payload too large" ? 413 : body.error === "request body timeout" ? 408 : 400;
			if (status === 413 || status === 408) closeRequestAfterResponse(req, res);
			sendJson(res, status, {
				ok: false,
				error: body.error
			});
			return true;
		}
		const payload = typeof body.value === "object" && body.value !== null ? body.value : {};
		const headers = normalizeHookHeaders(req);
		const idempotencyKey = resolveHookIdempotencyKey({
			payload,
			headers
		});
		const now = Date.now();
		const resolveDispatchSessionKeyOrRespond = (sessionKeyValue, targetAgentId) => {
			const dispatchSessionKey = normalizeHookDispatchSessionKey({
				sessionKey: sessionKeyValue,
				targetAgentId
			});
			const allowedPrefixes = hooksConfig.sessionPolicy.allowedSessionKeyPrefixes;
			if (allowedPrefixes && !isSessionKeyAllowedByPrefix(dispatchSessionKey, allowedPrefixes)) {
				sendJson(res, 400, {
					ok: false,
					error: getHookSessionKeyPrefixError(allowedPrefixes)
				});
				return null;
			}
			return dispatchSessionKey;
		};
		const resolveTargetAgentOrRespond = (agentId, source) => {
			const resolution = resolveEffectiveHookTargetAgentId(hooksConfig, agentId, source);
			if (!resolution.ok) {
				sendJson(res, 400, {
					ok: false,
					error: resolution.error
				});
				return null;
			}
			if (!isHookAgentAllowed(hooksConfig, resolution.effectiveAgentId)) {
				sendJson(res, 400, {
					ok: false,
					error: getHookAgentPolicyError()
				});
				return null;
			}
			return resolution;
		};
		const dispatchWakeActionOrRespond = (value, targetAgentId, source) => {
			let dispatchSessionKey;
			if (value.sessionKey) {
				const sessionKey = resolveHookSessionKey({
					hooksConfig,
					source,
					sessionKey: value.sessionKey
				});
				if (!sessionKey.ok) {
					sendJson(res, 400, {
						ok: false,
						error: sessionKey.error
					});
					return false;
				}
				const resolvedSessionKey = resolveDispatchSessionKeyOrRespond(sessionKey.value, targetAgentId);
				if (resolvedSessionKey === null) return false;
				dispatchSessionKey = resolvedSessionKey;
			}
			dispatchWakeHook({
				text: value.text,
				mode: value.mode,
				...dispatchSessionKey ? { sessionKey: dispatchSessionKey } : {}
			}, targetAgentId);
			return true;
		};
		if (subPath === "wake") {
			const normalized = normalizeWakePayload(payload);
			if (!normalized.ok) {
				sendJson(res, 400, {
					ok: false,
					error: normalized.error
				});
				return true;
			}
			const target = resolveTargetAgentOrRespond(normalized.value.agentId, "request");
			if (!target) return true;
			if (!dispatchWakeActionOrRespond(normalized.value, target.effectiveAgentId, "request")) return true;
			sendJson(res, 200, {
				ok: true,
				mode: normalized.value.mode
			});
			return true;
		}
		if (subPath === "agent") {
			const normalized = normalizeAgentPayload(payload);
			if (!normalized.ok) {
				sendJson(res, 400, {
					ok: false,
					error: normalized.error
				});
				return true;
			}
			const target = resolveTargetAgentOrRespond(normalized.value.agentId, "request");
			if (!target) return true;
			if (normalized.value.sessionMode === "persistent" && !normalized.value.sessionKey) {
				sendJson(res, 400, {
					ok: false,
					error: "sessionKey is required when sessionMode is persistent"
				});
				return true;
			}
			const sessionKey = resolveHookSessionKey({
				hooksConfig,
				source: "request",
				sessionKey: normalized.value.sessionKey
			});
			if (!sessionKey.ok) {
				sendJson(res, 400, {
					ok: false,
					error: sessionKey.error
				});
				return true;
			}
			if (normalized.value.sessionMode === "persistent" && !hooksConfig.sessionPolicy.allowedSessionKeyPrefixes?.length) {
				sendJson(res, 400, {
					ok: false,
					error: "hooks.allowedSessionKeyPrefixes is required when direct hook sessionMode is persistent"
				});
				return true;
			}
			const replayKey = buildHookReplayCacheKey({
				pathKey: "agent",
				token,
				idempotencyKey,
				dispatchScope: {
					agentId: target.effectiveAgentId,
					sessionKey: normalized.value.sessionKey ?? hooksConfig.sessionPolicy.defaultSessionKey ?? null,
					message: normalized.value.message,
					name: normalized.value.name,
					wakeMode: normalized.value.wakeMode,
					sessionMode: normalized.value.sessionMode,
					deliver: normalized.value.deliver,
					channel: normalized.value.channel,
					to: normalized.value.to ?? null,
					accountId: normalized.value.accountId ?? null,
					model: normalized.value.model ?? null,
					thinking: normalized.value.thinking ?? null,
					timeoutSeconds: normalized.value.timeoutSeconds ?? null
				}
			});
			const replay = resolveHookReplay(replayKey, now);
			if (replay) {
				sendAgentDispatchResult(res, await replay);
				return true;
			}
			const dispatchSessionKey = resolveDispatchSessionKeyOrRespond(sessionKey.value, target.effectiveAgentId);
			if (dispatchSessionKey === null) return true;
			sendAgentDispatchResult(res, await dispatchAgentHookWithReplay(replayKey, now, () => dispatchAgentHook({
				...normalized.value,
				effectiveAgentId: target.effectiveAgentId,
				idempotencyKey,
				sessionKey: dispatchSessionKey,
				sourcePath: `${basePath}/agent`,
				agentId: target.selectedAgentId,
				externalContentSource: "webhook"
			})));
			return true;
		}
		if (hooksConfig.mappings.length > 0) try {
			const mapped = await applyHookMappings(hooksConfig.mappings, {
				payload,
				headers,
				url,
				path: subPath
			});
			if (mapped) {
				if (!mapped.ok) {
					sendJson(res, 400, {
						ok: false,
						error: mapped.error
					});
					return true;
				}
				if (mapped.dropped > 0) logHooks.warn(`hook mapping ${subPath} fan-out dropped ${mapped.dropped} items beyond the 200-item cap`);
				if (mapped.actions.length === 0) {
					if (mapped.fanout) logHooks.info(`hook mapping ${subPath} matched with no items to dispatch`);
					res.statusCode = 204;
					res.end();
					return true;
				}
				const fanOutScopeOccurrences = /* @__PURE__ */ new Map();
				const prepareMappedAgentDispatchOrRespond = (action) => {
					const channel = resolveHookChannel(action.channel);
					if (!channel) {
						sendJson(res, 400, {
							ok: false,
							error: getHookChannelError()
						});
						return null;
					}
					const deliver = resolveHookDeliver(action.deliver);
					const delivery = deliver ? {
						mode: "announce",
						channel,
						to: action.to
					} : { mode: "none" };
					const target = resolveTargetAgentOrRespond(action.agentId, "mapping");
					if (!target) return null;
					if (action.sessionMode === "persistent" && !action.sessionKey && !hooksConfig.sessionPolicy.defaultSessionKey) {
						sendJson(res, 400, {
							ok: false,
							error: "sessionKey or hooks.defaultSessionKey is required when mapped hook sessionMode is persistent"
						});
						return null;
					}
					const sessionKey = resolveHookSessionKey({
						hooksConfig,
						source: action.sessionKeySource === "static" ? "mapping-static" : "mapping-templated",
						sessionKey: action.sessionKey
					});
					if (!sessionKey.ok) {
						sendJson(res, 400, {
							ok: false,
							error: sessionKey.error
						});
						return null;
					}
					const dispatchSessionKey = resolveDispatchSessionKeyOrRespond(sessionKey.value, target.effectiveAgentId);
					if (dispatchSessionKey === null) return null;
					const dispatchScope = {
						agentId: target.effectiveAgentId,
						sessionKey: action.sessionKey ?? hooksConfig.sessionPolicy.defaultSessionKey ?? null,
						message: action.message,
						name: action.name ?? "Hook",
						wakeMode: action.wakeMode,
						sessionMode: action.sessionMode,
						deliver,
						channel,
						to: action.to ?? null,
						model: action.model ?? null,
						thinking: action.thinking ?? null,
						timeoutSeconds: action.timeoutSeconds ?? null
					};
					if (mapped.fanout) {
						const fingerprint = JSON.stringify(dispatchScope);
						const occurrence = fanOutScopeOccurrences.get(fingerprint) ?? 0;
						fanOutScopeOccurrences.set(fingerprint, occurrence + 1);
						dispatchScope.occurrence = occurrence;
					}
					const replayKey = buildHookReplayCacheKey({
						pathKey: subPath || "mapping",
						token,
						idempotencyKey: mapped.fanout ? idempotencyKey ?? HOOK_FAN_OUT_DERIVED_IDEMPOTENCY : idempotencyKey,
						dispatchScope
					});
					return () => dispatchAgentHookWithReplay(replayKey, now, () => dispatchAgentHook({
						message: action.message,
						name: action.name ?? "Hook",
						idempotencyKey,
						agentId: target.selectedAgentId,
						effectiveAgentId: target.effectiveAgentId,
						wakeMode: action.wakeMode,
						sessionKey: dispatchSessionKey,
						sessionMode: action.sessionMode,
						sourcePath: `${basePath}/${subPath}`,
						deliver,
						channel,
						to: action.to,
						delivery,
						model: action.model,
						thinking: action.thinking,
						timeoutSeconds: action.timeoutSeconds,
						mappingId: action.mappingId,
						allowUnsafeExternalContent: action.allowUnsafeExternalContent,
						...mapped.fanout ? { admissionMode: "background" } : {},
						externalContentSource: resolveMappedHookExternalContentSource({
							subPath,
							sessionKey: sessionKey.value
						})
					}));
				};
				const dispatches = [];
				let wakeMode;
				for (const action of mapped.actions) {
					if (action.kind === "wake") {
						const target = resolveTargetAgentOrRespond(action.agentId, "mapping");
						if (!target) return true;
						if (!dispatchWakeActionOrRespond({
							text: action.text,
							mode: action.mode,
							sessionKey: action.sessionKey
						}, target.effectiveAgentId, action.sessionKeySource === "static" ? "mapping-static" : "mapping-templated")) return true;
						wakeMode = action.mode;
						continue;
					}
					const prepared = prepareMappedAgentDispatchOrRespond(action);
					if (!prepared) return true;
					dispatches.push(prepared);
				}
				if (dispatches.length === 0) {
					sendJson(res, 200, {
						ok: true,
						mode: wakeMode ?? "now"
					});
					return true;
				}
				if (!mapped.fanout) {
					sendAgentDispatchResult(res, await dispatches[0]());
					return true;
				}
				sendFanOutDispatchResult(res, await settleFanOutDispatches(dispatches.map((dispatch) => Promise.resolve(dispatch())), fanoutResponseDeadlineMs));
				return true;
			}
		} catch (err) {
			logHooks.warn(`hook mapping failed: ${String(err)}`);
			sendJson(res, 500, {
				ok: false,
				error: "hook mapping failed"
			});
			return true;
		}
		res.statusCode = 404;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Not Found");
		return true;
	};
}
//#endregion
//#region src/gateway/server/hooks.ts
const HOOK_AGENT_START_ADMISSION_TIMEOUT_MS = 15e3;
const HOOK_AGENT_START_ADMISSION_TIMEOUT_ERROR = "hook agent run did not start before admission timeout";
const HOOK_AGENT_SESSION_CONFLICT_ERROR = "hook agent run was rejected because the target session changed";
const HOOK_AGENT_PREPARATION_ERROR = "hook agent run failed before entering the agent runner";
function resolveHookEventTarget(params) {
	if (params.cfg.session?.scope === "global") return {
		eventSessionKey: "global",
		heartbeatTarget: { agentId: params.resolvedAgentId }
	};
	const eventSessionKey = params.sessionKey ? canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.resolvedAgentId,
		sessionKey: toAgentStoreSessionKey({
			agentId: params.resolvedAgentId,
			requestKey: params.sessionKey,
			mainKey: params.cfg.session?.mainKey
		})
	}) : resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.resolvedAgentId
	});
	return {
		eventSessionKey,
		heartbeatTarget: {
			agentId: params.resolvedAgentId,
			sessionKey: eventSessionKey
		}
	};
}
function shouldAnnounceHookRunResult(params) {
	if (params.result.status !== "ok") return true;
	return params.deliver && params.result.delivered !== true && params.result.deliveryAttempted !== true;
}
function resolveHookRunSummary(result) {
	return (result.status !== "ok" ? normalizeOptionalString(result.diagnostics?.summary) : void 0) || normalizeOptionalString(result.summary) || normalizeOptionalString(result.error) || result.status;
}
function sanitizeHookConsoleValue(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	return truncateUtf16Safe(Array.from(normalized, (char) => {
		const code = char.charCodeAt(0);
		return code < 32 || code === 127 ? " " : char;
	}).join("").replace(/\s+/gu, " ").trim(), 500);
}
function sanitizeHookLogMetadata(meta) {
	return Object.fromEntries(Object.entries(meta).filter(([, value]) => value !== void 0).map(([key, value]) => [key, typeof value === "string" ? sanitizeHookConsoleValue(redactToolPayloadText(value).replace(/\p{Cc}/gu, " ")) : value]));
}
function createHookAdmissionFailure(params) {
	const statusCode = params.statusCode ?? (params.disposition === "session-conflict" ? 409 : 502);
	return {
		ok: false,
		statusCode,
		error: statusCode === 409 ? HOOK_AGENT_SESSION_CONFLICT_ERROR : statusCode === 503 ? HOOK_AGENT_START_ADMISSION_TIMEOUT_ERROR : HOOK_AGENT_PREPARATION_ERROR,
		runId: params.runId
	};
}
function createSessionKeyedHookDispatchQueue() {
	const hookAgentDispatchTails = /* @__PURE__ */ new Map();
	return (sessionKey, operation) => {
		const previousTail = hookAgentDispatchTails.get(sessionKey);
		const run = previousTail ? previousTail.catch(() => void 0).then(operation) : operation();
		const tail = run.then(() => void 0, () => void 0);
		hookAgentDispatchTails.set(sessionKey, tail);
		tail.finally(() => {
			if (hookAgentDispatchTails.get(sessionKey) === tail) hookAgentDispatchTails.delete(sessionKey);
		});
		return run;
	};
}
function validateHookAgentDeliveryAccount(params) {
	if (params.value.delivery.mode !== "announce" || params.value.delivery.channel === "last" || !params.value.delivery.to) return params.value;
	const accountId = params.value.delivery.accountId ? validateExplicitMessageAccountSelection({
		cfg: params.cfg,
		channel: params.value.delivery.channel,
		accountId: params.value.delivery.accountId
	}) : (() => {
		const plugin = resolveOutboundChannelPlugin({
			channel: params.value.delivery.channel,
			cfg: params.cfg
		});
		if (!plugin) throw new Error(`Channel ${params.value.delivery.channel} is unavailable.`);
		return resolveChannelDefaultAccountId({
			plugin,
			cfg: params.cfg
		});
	})();
	if (!accountId) throw new Error(`Channel ${params.value.delivery.channel} did not resolve an account.`);
	return {
		...params.value,
		accountId,
		delivery: {
			...params.value.delivery,
			accountId
		}
	};
}
/** Creates one lifecycle-owned dispatcher shared by HTTP hooks and trusted plugins. */
function createGatewayHookDispatcher(params) {
	const { deps, logHooks, resolveGatewayContext, agentStartAdmissionTimeoutMs = HOOK_AGENT_START_ADMISSION_TIMEOUT_MS } = params;
	const scheduledGatewayContextResolver = fenceScheduledGatewayContextResolver(resolveGatewayContext);
	const enqueueHookAgentDispatch = createSessionKeyedHookDispatchQueue();
	let isolatedAgentModulePromise;
	const loadIsolatedAgentModule = () => isolatedAgentModulePromise ??= import("./isolated-agent-BEfReXUU.js");
	const dispatchWakeHook = (value, agentId) => {
		const target = resolveHookEventTarget({
			cfg: getRuntimeConfig(),
			resolvedAgentId: agentId,
			sessionKey: value.sessionKey
		});
		const sessionKey = target.eventSessionKey;
		const eventOptions = { sessionKey };
		enqueueSystemEvent(value.text, isUnscopedSessionKeySentinel(sessionKey) ? withSystemEventOwner(eventOptions, agentId) : eventOptions);
		if (value.mode === "now") requestHeartbeat({
			source: "hook",
			intent: "immediate",
			reason: "hook:wake",
			...target.heartbeatTarget
		});
	};
	const dispatchAgentHook = async (value, pluginId) => {
		const sessionKey = value.sessionKey;
		const safeName = sanitizeHookConsoleValue(value.name) ?? "Hook";
		const jobId = randomUUID();
		const runId = randomUUID();
		const logContext = sanitizeHookLogMetadata({
			runId,
			jobId,
			sourcePath: value.sourcePath,
			name: value.name,
			agentId: value.effectiveAgentId,
			logicalSessionKey: sessionKey
		});
		const logHookRunTerminal = (result) => {
			const meta = {
				...logContext,
				...sanitizeHookLogMetadata({
					status: result.status,
					sessionId: result.sessionId,
					sessionKey: result.sessionKey,
					deliver: value.deliver,
					delivered: result.delivered,
					deliveryAttempted: result.deliveryAttempted,
					deliveryError: result.deliveryError,
					deliverySuppressionReason: result.deliverySuppressionReason,
					model: result.model ?? value.model,
					summary: result.status !== "ok" ? resolveHookRunSummary(result) : void 0
				})
			};
			const message = truncateUtf16Safe(["hook agent run completed", ...[
				"runId",
				"status",
				"deliveryError",
				"summary",
				"model"
			].flatMap((key) => meta[key] === void 0 ? [] : [`${key}=${String(meta[key])}`])].join(" "), 500);
			const level = result.status !== "ok" || result.deliveryError ? "warn" : "info";
			logHooks[level](message, meta);
		};
		const nowMs = resolveDateTimestampMs(Date.now());
		const job = {
			id: jobId,
			agentId: value.effectiveAgentId,
			name: safeName,
			enabled: true,
			createdAtMs: nowMs,
			updatedAtMs: nowMs,
			schedule: {
				kind: "at",
				at: resolveTimestampMsToIsoString(nowMs)
			},
			sessionTarget: value.sessionMode === "persistent" ? `session:${sessionKey}` : "isolated",
			wakeMode: value.wakeMode,
			payload: {
				kind: "agentTurn",
				message: value.message,
				model: value.model,
				thinking: value.thinking,
				timeoutSeconds: value.timeoutSeconds,
				allowUnsafeExternalContent: value.allowUnsafeExternalContent,
				externalContentSource: value.externalContentSource
			},
			delivery: value.delivery,
			state: { nextRunAtMs: nowMs }
		};
		let hookEventTarget;
		const resolveGlobalTerminalAgentId = (status) => {
			const acceptedAgentId = hookEventTarget?.heartbeatTarget.agentId;
			if (acceptedAgentId && listAgentIds(getRuntimeConfig()).includes(acceptedAgentId)) return acceptedAgentId;
			logHooks.warn("hook agent terminal event suppressed", {
				...logContext,
				...sanitizeHookLogMetadata({
					acceptedAgentId,
					status
				}),
				reason: "accepted-agent-removed"
			});
		};
		const reportHookFailure = (err) => {
			logHookRunTerminal({
				status: "error",
				error: String(err)
			});
			const eventTarget = hookEventTarget ?? resolveHookEventTarget({
				cfg: getRuntimeConfig(),
				resolvedAgentId: value.effectiveAgentId
			});
			const eventSessionKey = eventTarget.eventSessionKey;
			const isGlobalEvent = isUnscopedSessionKeySentinel(eventSessionKey);
			let heartbeatTarget;
			if (isGlobalEvent && hookEventTarget) {
				const globalTerminalAgentId = resolveGlobalTerminalAgentId("error");
				if (!globalTerminalAgentId) return;
				heartbeatTarget = { agentId: globalTerminalAgentId };
			} else heartbeatTarget = eventTarget.heartbeatTarget;
			const failureEventOptions = { sessionKey: eventSessionKey };
			enqueueSystemEvent(`Hook ${safeName} (error): ${String(err)}`, isGlobalEvent && heartbeatTarget.agentId ? withSystemEventOwner(failureEventOptions, heartbeatTarget.agentId) : failureEventOptions);
			if (value.wakeMode === "now") requestHeartbeat({
				source: "hook",
				intent: "immediate",
				reason: `hook:${jobId}:error`,
				...heartbeatTarget
			});
		};
		let dispatchCfg;
		try {
			dispatchCfg = getRuntimeConfig();
		} catch (err) {
			runWithGatewayIndependentRootWorkContinuation(async () => reportHookFailure(err));
			return createHookAdmissionFailure({ runId });
		}
		let acceptedValue;
		try {
			acceptedValue = validateHookAgentDeliveryAccount({
				cfg: dispatchCfg,
				value
			});
			job.delivery = acceptedValue.delivery;
		} catch (err) {
			return {
				ok: false,
				statusCode: 400,
				error: formatErrorMessage(err),
				runId
			};
		}
		const agentId = acceptedValue.effectiveAgentId;
		const queueKey = resolveCronAgentSessionKey({
			sessionKey,
			agentId,
			mainKey: dispatchCfg.session?.mainKey,
			cfg: dispatchCfg
		});
		let settleAdmission;
		let admissionSettled = false;
		let admissionTimedOut = false;
		let admissionTimer;
		const admission = new Promise((resolve) => {
			settleAdmission = (result) => {
				if (admissionSettled) return;
				admissionSettled = true;
				if (admissionTimer) {
					clearTimeout(admissionTimer);
					admissionTimer = void 0;
				}
				resolve(result);
			};
		});
		const admissionTimeoutError = /* @__PURE__ */ new Error(HOOK_AGENT_START_ADMISSION_TIMEOUT_ERROR);
		const startupAbortController = new AbortController();
		const settleSuccessfulAdmission = () => {
			startupAbortController.signal.throwIfAborted();
			settleAdmission({
				ok: true,
				runId
			});
		};
		if (value.admissionMode !== "background") {
			admissionTimer = setTimeout(() => {
				admissionTimedOut = true;
				startupAbortController.abort(admissionTimeoutError);
				settleAdmission(createHookAdmissionFailure({
					runId,
					statusCode: 503
				}));
			}, agentStartAdmissionTimeoutMs);
			admissionTimer.unref?.();
		}
		runWithGatewayIndependentRootWorkContinuation(() => enqueueHookAgentDispatch(queueKey, async () => {
			if (startupAbortController.signal.aborted) return;
			try {
				const cfg = getRuntimeConfig();
				try {
					validateHookAgentDeliveryAccount({
						cfg,
						value: acceptedValue
					});
				} catch (err) {
					settleAdmission({
						ok: false,
						statusCode: 400,
						error: formatErrorMessage(err),
						runId
					});
					return;
				}
				const eventTarget = resolveHookEventTarget({
					cfg,
					resolvedAgentId: agentId
				});
				hookEventTarget = eventTarget;
				const { runCronIsolatedAgentTurn } = await loadIsolatedAgentModule();
				if (startupAbortController.signal.aborted) return;
				const runHookIsolatedTurn = async () => await runCronIsolatedAgentTurn({
					cfg,
					deps,
					job,
					message: acceptedValue.message,
					sessionKey,
					agentId,
					lane: "hook-dispatch",
					executionIdentity: { ingress: pluginId ? {
						kind: "webhook",
						boundary: "gateway.hooks.plugin",
						state: "present",
						rawSourceRef: `${pluginId}:${safeName}`
					} : {
						kind: "webhook",
						boundary: "gateway.hooks.agent",
						state: "present",
						...acceptedValue.mappingId ? { rawSourceRef: acceptedValue.mappingId } : {}
					} },
					abortSignal: startupAbortController.signal,
					onLaneWait: (info) => {
						if (info?.waiting === false) settleSuccessfulAdmission();
					},
					onExecutionStarted: settleSuccessfulAdmission
				});
				const result = await runWithScheduledGatewayContext({
					...scheduledGatewayContextResolver ? { resolveGatewayContext: scheduledGatewayContextResolver } : {},
					run: runHookIsolatedTurn
				});
				if (admissionTimedOut) return;
				const summary = resolveHookRunSummary(result);
				if (!admissionSettled) settleAdmission(result.status === "ok" || result.executionStarted === true ? {
					ok: true,
					runId
				} : createHookAdmissionFailure({
					runId,
					disposition: result.admissionDisposition
				}));
				const prefix = result.status === "ok" ? `Hook ${safeName}` : `Hook ${safeName} (${result.status})`;
				const shouldAnnounce = shouldAnnounceHookRunResult({
					deliver: value.deliver,
					result
				});
				logHookRunTerminal(result);
				if (shouldAnnounce) {
					const eventSessionKey = eventTarget.eventSessionKey;
					const isGlobalEvent = isUnscopedSessionKeySentinel(eventSessionKey);
					let announceEventOptions = { sessionKey: eventSessionKey };
					let heartbeatTarget;
					if (isGlobalEvent) {
						const globalTerminalAgentId = resolveGlobalTerminalAgentId(result.status);
						if (!globalTerminalAgentId) return;
						announceEventOptions = withSystemEventOwner(announceEventOptions, globalTerminalAgentId);
						heartbeatTarget = { agentId: globalTerminalAgentId };
					} else heartbeatTarget = eventTarget.heartbeatTarget;
					enqueueSystemEvent(`${prefix}: ${summary}`.trim(), announceEventOptions);
					if (value.wakeMode === "now") requestHeartbeat({
						source: "hook",
						intent: "immediate",
						reason: `hook:${jobId}`,
						...heartbeatTarget
					});
				}
			} catch (err) {
				if (admissionTimedOut) return;
				settleAdmission(createHookAdmissionFailure({ runId }));
				reportHookFailure(err);
			}
		})).catch((err) => {
			if (admissionTimedOut) return;
			settleAdmission(createHookAdmissionFailure({ runId }));
			reportHookFailure(err);
		});
		return await admission;
	};
	const pluginHookReplays = /* @__PURE__ */ new Map();
	const dispatchHookAgentTurn = async (value, pluginId) => {
		const agentId = normalizeOptionalString(value.agentId);
		if (!agentId) return {
			ok: false,
			reason: "agentId is required"
		};
		const sessionKey = normalizeHookDispatchSessionKey({
			sessionKey: value.sessionKey,
			targetAgentId: agentId
		});
		if (sessionKey !== value.sessionKey || !sessionKey.startsWith("hook:") || sessionKey.length <= 5 || /[\s\p{Cc}]/u.test(sessionKey)) return {
			ok: false,
			reason: "sessionKey must start with hook: and contain no whitespace or control characters"
		};
		if (value.externalContentSource !== "email") return {
			ok: false,
			reason: "externalContentSource must be email"
		};
		const run = async () => {
			const result = await dispatchAgentHook({
				name: value.name,
				agentId,
				effectiveAgentId: agentId,
				sessionKey,
				message: value.message,
				deliver: value.deliver,
				model: value.model,
				thinking: value.thinking,
				timeoutSeconds: value.timeoutSeconds,
				idempotencyKey: value.idempotencyKey,
				sessionMode: "isolated",
				sourcePath: `plugin:${pluginId}`,
				wakeMode: "now",
				channel: "last",
				delivery: value.deliver ? {
					mode: "announce",
					channel: "last"
				} : { mode: "none" },
				externalContentSource: "email"
			}, pluginId);
			return result.ok ? result : {
				ok: false,
				reason: result.error
			};
		};
		const idempotencyKey = normalizeOptionalString(value.idempotencyKey);
		if (!idempotencyKey) return await run();
		const now = Date.now();
		for (const [key, entry] of pluginHookReplays) if (entry.createdAt < now - 3e5) pluginHookReplays.delete(key);
		const replayKey = JSON.stringify({
			pluginId,
			idempotencyKey,
			name: value.name,
			agentId,
			sessionKey,
			message: value.message,
			externalContentSource: value.externalContentSource,
			deliver: value.deliver,
			model: value.model,
			thinking: value.thinking,
			timeoutSeconds: value.timeoutSeconds
		});
		const replay = pluginHookReplays.get(replayKey);
		if (replay) return await replay.result;
		const result = run().then((outcome) => {
			if (!outcome.ok) pluginHookReplays.delete(replayKey);
			return outcome;
		}, (error) => {
			pluginHookReplays.delete(replayKey);
			throw error;
		});
		pluginHookReplays.set(replayKey, {
			createdAt: now,
			result
		});
		pruneMapToMaxSize(pluginHookReplays, DEDUPE_MAX);
		return await result;
	};
	return {
		dispatchWakeHook,
		dispatchAgentHook,
		dispatchHookAgentTurn
	};
}
/** Creates the HTTP handler used by gateway hook endpoints. */
function createGatewayHooksRequestHandler(params) {
	const { getHooksConfig, bindHost, port, logHooks, getClientIpConfig } = params;
	const { dispatchAgentHook, dispatchWakeHook } = params.dispatcher ?? createGatewayHookDispatcher(params);
	return createHooksRequestHandler({
		getHooksConfig,
		bindHost,
		port,
		logHooks,
		getClientIpConfig,
		dispatchAgentHook,
		dispatchWakeHook
	});
}
//#endregion
export { createGatewayHookDispatcher, createGatewayHooksRequestHandler };
