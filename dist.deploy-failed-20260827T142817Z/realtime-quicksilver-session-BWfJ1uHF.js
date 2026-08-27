import { c as readRequestBodyWithLimit } from "./http-body-D5I0NwSl.js";
import { i as resolveAcceptedBrowserOrigin } from "./origin-check-DudmUihq.js";
import { s as resolveProviderAuthProfileApiKey } from "./provider-auth-DVDSRG1v.js";
import "./webhook-request-guards-BMy0C0la.js";
import { n as resolveCodexAuthIdentity } from "./openai-chatgpt-auth-identity-DhZtpbFV.js";
import { n as isOpenAIGptLiveModel } from "./realtime-quicksilver-BdMyAyC5.js";
import { c as createOpenAIQuicksilverCall, f as resolveOpenAIQuicksilverVoice, l as hangupOpenAIRealtimeCall, r as buildOpenAIQuicksilverSession } from "./realtime-quicksilver-wire-Y8vgTEVb.js";
import { t as OpenAIQuicksilverDelegationController } from "./realtime-quicksilver-delegation-controller-CzRIB2iD.js";
import { n as reserveOpenAIQuicksilverSession, t as releaseOpenAIQuicksilverSession } from "./realtime-quicksilver-session-limit-C_rvr0yn.js";
import { t as connectOpenAIQuicksilverSideband } from "./realtime-quicksilver-sideband-DaPlFqay.js";
import { t as assertOpenAIRealtimeAudioOnlyOffer } from "./realtime-sdp-offer-DNU1ghm4.js";
import { randomBytes, randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-quicksilver-session.ts
const OPENAI_QUICKSILVER_OFFER_PATH = "/plugins/openai/realtime/calls";
const OPENAI_QUICKSILVER_CAPABILITIES = {
	transports: ["webrtc", "gateway-relay"],
	handlesAgentConsult: true,
	supportsToolCalls: false,
	supportsVideoFrames: false
};
const OPENAI_QUICKSILVER_PENDING_TTL_MS = 6e4;
const OPENAI_QUICKSILVER_SESSION_TTL_MS = 30 * 6e4;
const OPENAI_REALTIME_MAX_SESSIONS_PER_OWNER = 2;
const OPENAI_QUICKSILVER_MAX_SDP_BYTES = 256 * 1024;
const OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS = 3e4;
const WEBSOCKET_OPEN = 1;
function createResponseDeliveryWaiter(res, onDelivered) {
	let settle;
	const result = new Promise((resolve) => {
		settle = (delivered) => {
			res.removeListener("finish", onFinish);
			res.removeListener("close", onClose);
			resolve(delivered);
		};
	});
	const onFinish = () => {
		onDelivered();
		settle(true);
	};
	const onClose = () => settle(false);
	res.once("finish", onFinish);
	res.once("close", onClose);
	return {
		result,
		cancel: () => settle(false)
	};
}
function respondText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("cache-control", "no-store");
	res.setHeader("content-type", "text/plain; charset=utf-8");
	res.setHeader("x-content-type-options", "nosniff");
	res.end(body);
}
function applyRealtimeOfferCorsHeaders(req, res, cfg) {
	if (!req.headers.origin) return true;
	const origin = resolveAcceptedBrowserOrigin({
		req,
		cfg
	});
	if (!origin) return false;
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Vary", "Origin");
	return true;
}
function readBearerToken(req) {
	return (req.headers.authorization?.trim())?.match(/^Bearer\s+([^\s]+)$/i)?.[1];
}
async function resolveOpenAIChatGptSubscriptionAuth(params) {
	const token = await resolveProviderAuthProfileApiKey({
		provider: "openai",
		cfg: params.cfg,
		agentDir: params.agentDir,
		profileTypes: ["oauth"],
		includeExternalCliAuth: false
	});
	if (!token) return;
	const accountId = resolveCodexAuthIdentity({ accessToken: token }).accountId;
	if (!accountId) throw new Error("The selected ChatGPT OAuth profile is missing its account id");
	return {
		type: "oauth",
		token,
		accountId
	};
}
function createOpenAIQuicksilverBrowserSessionBroker(params) {
	const pendingOffers = /* @__PURE__ */ new Map();
	const inFlightOffers = /* @__PURE__ */ new Map();
	const activeSessions = /* @__PURE__ */ new Map();
	const reservations = /* @__PURE__ */ new Set();
	const reservationOwners = /* @__PURE__ */ new Map();
	const inFlightHandlers = /* @__PURE__ */ new Set();
	const shutdownController = new AbortController();
	const createSocket = params.webSocketFactory ?? ((url, options) => new WebSocket$1(url, options));
	let cleanedUp = false;
	const releaseReservation = (token) => {
		reservations.delete(token);
		reservationOwners.delete(token);
		releaseOpenAIQuicksilverSession(token);
	};
	const expirePendingOffer = (token, offer) => {
		if (pendingOffers.get(token) !== offer) return;
		pendingOffers.delete(token);
		clearTimeout(offer.timer);
		releaseReservation(token);
		offer.request.gatewayControl?.onClose?.("completed");
	};
	const activeSessionLease = {
		adopt: (token, wire) => {
			const session = {
				token,
				...wire
			};
			activeSessions.set(token, session);
			reserveOpenAIQuicksilverSession(token);
			return session;
		},
		close: async (session) => {
			if (session.closing) return session.closing;
			if (activeSessions.get(session.token) !== session) return;
			activeSessions.delete(session.token);
			releaseReservation(session.token);
			clearTimeout(session.timer);
			session.closing = Promise.resolve();
			session.closing = Promise.resolve(session.dispose());
			return session.closing;
		},
		expireIn: (session, ttlMs) => {
			clearTimeout(session.timer);
			session.timer = setTimeout(() => void activeSessionLease.close(session), Math.max(0, ttlMs));
			session.timer.unref?.();
		},
		deliverAnswer: async (session, signal, deliver) => {
			if (!await deliver() || signal.aborted) await activeSessionLease.close(session);
		}
	};
	const attachSidebandHandlers = (session) => {
		if (!session.socket) return;
		const socket = session.socket;
		socket.on("message", (data, isBinary) => {
			session.handleFrame?.(data, isBinary);
		});
		socket.on("error", (error) => {
			params.logger.warn(`OpenAI GPT-Live sideband socket failed: ${error.message}`);
			activeSessionLease.close(session);
		});
		socket.on("close", () => void activeSessionLease.close(session));
	};
	const prunePendingOffers = () => {
		const now = Date.now();
		for (const [token, offer] of pendingOffers) if (offer.expiresAt <= now) expirePendingOffer(token, offer);
	};
	const broker = {
		capabilities: OPENAI_QUICKSILVER_CAPABILITIES,
		createBrowserSession: async (request, auth) => {
			if (cleanedUp || shutdownController.signal.aborted) throw new Error("OpenAI GPT-Live sessions are stopping; restart Gateway and try again");
			const model = request.model?.trim();
			if (!model) throw new Error("OpenAI realtime browser sessions require a model");
			if (isOpenAIGptLiveModel(model) && !request.runAgentConsult) throw new Error("OpenAI GPT-Live requires the Gateway agent-consult runtime");
			prunePendingOffers();
			if (request.gaSideband && request.ownerConnId && Array.from(reservationOwners.values()).filter((owner) => owner === request.ownerConnId).length >= OPENAI_REALTIME_MAX_SESSIONS_PER_OWNER) throw new Error("Too many concurrent OpenAI realtime sessions for this client");
			const voice = resolveOpenAIQuicksilverVoice(request.voice);
			const token = randomBytes(32).toString("base64url");
			const expiresAt = Date.now() + OPENAI_QUICKSILVER_PENDING_TTL_MS;
			reserveOpenAIQuicksilverSession(token, { expiresAtMs: expiresAt });
			const offer = {
				auth,
				expiresAt,
				requestIds: {
					realtimeSessionId: randomUUID(),
					sessionId: randomUUID(),
					threadId: randomUUID()
				},
				request: {
					...request,
					model,
					voice
				},
				timer: setTimeout(() => expirePendingOffer(token, offer), OPENAI_QUICKSILVER_PENDING_TTL_MS)
			};
			offer.timer.unref?.();
			pendingOffers.set(token, offer);
			reservations.add(token);
			if (request.gaSideband && request.ownerConnId) reservationOwners.set(token, request.ownerConnId);
			return {
				provider: "openai",
				transport: "webrtc",
				clientSecret: token,
				offerUrl: OPENAI_QUICKSILVER_OFFER_PATH,
				...request.gaSideband ? {} : {
					model,
					voice
				},
				expiresAt
			};
		},
		cancelBrowserSession: async (session) => {
			if (session.transport !== "webrtc") return;
			const pending = pendingOffers.get(session.clientSecret);
			if (pending) {
				pendingOffers.delete(session.clientSecret);
				clearTimeout(pending.timer);
			}
			inFlightOffers.get(session.clientSecret)?.abort(/* @__PURE__ */ new Error("OpenAI realtime session canceled"));
			const active = activeSessions.get(session.clientSecret);
			if (active) await activeSessionLease.close(active);
			else releaseReservation(session.clientSecret);
		}
	};
	const handleOffer = async (req, res) => {
		const corsAllowed = applyRealtimeOfferCorsHeaders(req, res, params.getConfig());
		if (req.method === "OPTIONS") {
			if (!corsAllowed) {
				respondText(res, 403, "Origin not allowed");
				return true;
			}
			res.statusCode = 204;
			res.setHeader("cache-control", "no-store");
			res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
			res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
			res.setHeader("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
			if (req.headers["access-control-request-private-network"] === "true") res.setHeader("Access-Control-Allow-Private-Network", "true");
			res.setHeader("Access-Control-Max-Age", "600");
			res.end();
			return true;
		}
		if (!corsAllowed) {
			respondText(res, 403, "Origin not allowed");
			return true;
		}
		if (req.method !== "POST") {
			respondText(res, 405, "Method not allowed");
			return true;
		}
		if (req.headers["content-type"]?.split(";", 1)[0]?.trim().toLowerCase() !== "application/sdp") {
			respondText(res, 415, "Expected application/sdp");
			return true;
		}
		prunePendingOffers();
		const token = readBearerToken(req);
		const offer = token ? pendingOffers.get(token) : void 0;
		if (!token || !offer || offer.expiresAt <= Date.now()) {
			respondText(res, 401, "Invalid or expired realtime session token");
			return true;
		}
		pendingOffers.delete(token);
		clearTimeout(offer.timer);
		const requestController = new AbortController();
		let browserDisconnected = false;
		inFlightOffers.set(token, requestController);
		const abortFromBrowser = () => {
			browserDisconnected = true;
			requestController.abort(/* @__PURE__ */ new Error("Browser GPT-Live offer request closed"));
		};
		req.once("aborted", abortFromBrowser);
		res.once("close", abortFromBrowser);
		const detachBrowserAbort = () => {
			req.removeListener("aborted", abortFromBrowser);
			res.removeListener("close", abortFromBrowser);
		};
		const lifecycleSignal = AbortSignal.any([shutdownController.signal, requestController.signal]);
		let session;
		let responseDeliveryWaiter;
		const deliverActiveAnswer = async (status, answerSdp) => {
			responseDeliveryWaiter = createResponseDeliveryWaiter(res, detachBrowserAbort);
			res.statusCode = status;
			res.setHeader("cache-control", "no-store");
			res.setHeader("content-type", "application/sdp");
			res.setHeader("x-content-type-options", "nosniff");
			res.end(answerSdp);
			const delivered = await responseDeliveryWaiter.result;
			responseDeliveryWaiter = void 0;
			return delivered;
		};
		try {
			const offerStartedAt = Date.now();
			const sdp = await readRequestBodyWithLimit(req, {
				maxBytes: OPENAI_QUICKSILVER_MAX_SDP_BYTES,
				timeoutMs: 15e3
			});
			if (!sdp.trim()) {
				respondText(res, 400, "SDP offer is required");
				return true;
			}
			const upstreamSignal = AbortSignal.any([lifecycleSignal, AbortSignal.timeout(OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS)]);
			const gaSideband = offer.request.gaSideband;
			if (gaSideband) {
				try {
					assertOpenAIRealtimeAudioOnlyOffer(sdp);
				} catch (error) {
					respondText(res, 400, error instanceof Error ? error.message : "Invalid SDP offer");
					return true;
				}
				if (offer.auth.type !== "api-key") throw new Error("OpenAI Realtime Gateway control requires a Platform API key");
				const callStartedAt = Date.now();
				const call = await createOpenAIQuicksilverCall({
					auth: offer.auth,
					requestIds: offer.requestIds,
					sdp,
					session: gaSideband.session,
					gaSideband: true,
					signal: upstreamSignal,
					fetchImpl: params.fetchImpl
				});
				if (call.kind !== "ga-sideband") throw new Error("OpenAI Realtime call did not create a sideband session");
				const callCreatedAt = Date.now();
				let bridge;
				try {
					bridge = gaSideband.createBridge({
						apiKey: offer.auth.token,
						callId: call.callId,
						onTerminal: () => {
							const active = activeSessions.get(token);
							if (active) activeSessionLease.close(active);
						}
					});
				} catch (error) {
					await hangupOpenAIRealtimeCall({
						apiKey: offer.auth.token,
						callId: call.callId,
						signal: AbortSignal.timeout(OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS),
						fetchImpl: params.fetchImpl
					}).catch(() => void 0);
					throw error;
				}
				const active = activeSessionLease.adopt(token, { dispose: async () => {
					try {
						bridge.close();
					} catch (error) {
						params.logger.warn(`OpenAI Realtime sideband close failed: ${error instanceof Error ? error.message : String(error)}`);
					}
					try {
						await hangupOpenAIRealtimeCall({
							apiKey: offer.auth.token,
							callId: call.callId,
							signal: AbortSignal.timeout(OPENAI_QUICKSILVER_UPSTREAM_TIMEOUT_MS),
							fetchImpl: params.fetchImpl
						});
					} catch (error) {
						params.logger.warn(`OpenAI Realtime call cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
					}
				} });
				activeSessionLease.expireIn(active, OPENAI_QUICKSILVER_SESSION_TTL_MS);
				session = active;
				await bridge.connect();
				if (lifecycleSignal.aborted || activeSessions.get(token) !== active) throw lifecycleSignal.reason ?? /* @__PURE__ */ new Error("OpenAI Realtime sideband stopped during startup");
				const sidebandReadyAt = Date.now();
				const metrics = {
					callCreateMs: callCreatedAt - callStartedAt,
					sidebandReadyMs: sidebandReadyAt - callCreatedAt,
					totalOfferMs: sidebandReadyAt - offerStartedAt
				};
				params.logger.debug?.(`OpenAI Realtime sideband offer ready ${JSON.stringify(metrics)}`);
				await activeSessionLease.deliverAnswer(active, lifecycleSignal, () => deliverActiveAnswer(call.status, call.answerSdp));
				return true;
			}
			const call = await createOpenAIQuicksilverCall({
				auth: offer.auth,
				requestIds: offer.requestIds,
				sdp,
				session: buildOpenAIQuicksilverSession({
					model: offer.request.model,
					instructions: offer.request.instructions,
					voice: offer.request.voice,
					initialItems: offer.request.initialItems
				}),
				signal: upstreamSignal,
				fetchImpl: params.fetchImpl
			});
			if (call.kind === "ga-realtime") {
				res.statusCode = call.status;
				res.setHeader("cache-control", "no-store");
				res.setHeader("content-type", "application/sdp");
				res.setHeader("x-content-type-options", "nosniff");
				res.end(call.answerSdp);
				return true;
			}
			const runAgentConsult = offer.request.runAgentConsult;
			if (!runAgentConsult) throw new Error("OpenAI GPT-Live requires the Gateway agent-consult runtime");
			const connected = await connectOpenAIQuicksilverSideband({
				auth: offer.auth,
				createSocket,
				requestIds: offer.requestIds,
				signal: lifecycleSignal,
				url: call.sidebandUrl
			});
			if (lifecycleSignal.aborted) {
				connected.socket.close(1e3, "session stopped");
				throw lifecycleSignal.reason;
			}
			const abortController = new AbortController();
			const delegations = new OpenAIQuicksilverDelegationController({
				getSocket: () => connected.socket,
				logger: params.logger,
				onFatalError: () => {
					if (session) activeSessionLease.close(session);
				},
				onSessionStarted: (expiresAt) => {
					if (session && expiresAt !== void 0) {
						const upstreamTtlMs = expiresAt * 1e3 - Date.now();
						activeSessionLease.expireIn(session, Math.min(OPENAI_QUICKSILVER_SESSION_TTL_MS, upstreamTtlMs));
					}
				},
				runAgentConsult,
				signal: abortController.signal
			});
			session = activeSessionLease.adopt(token, {
				dispose: () => {
					delegations.stop(/* @__PURE__ */ new Error("GPT-Live delegation stopped"));
					abortController.abort(/* @__PURE__ */ new Error("GPT-Live session closed"));
					if (connected.socket.readyState === WEBSOCKET_OPEN) try {
						connected.socket.send(JSON.stringify({ type: "session.close" }));
					} catch {}
					try {
						connected.socket.close(1e3, "session closed");
					} catch {}
				},
				handleFrame: (data, isBinary) => delegations.handleFrame(data, isBinary),
				socket: connected.socket
			});
			activeSessionLease.expireIn(session, OPENAI_QUICKSILVER_SESSION_TTL_MS);
			attachSidebandHandlers(session);
			const terminalEvent = connected.detachBuffer();
			for (const frame of connected.bufferedFrames) session.handleFrame?.(frame.data, frame.isBinary);
			if (terminalEvent && activeSessions.get(token) === session) {
				if (terminalEvent.kind === "error") params.logger.warn(`OpenAI GPT-Live sideband socket failed: ${terminalEvent.error.message}`);
				activeSessionLease.close(session);
			}
			if (activeSessions.get(token) !== session) throw new Error("OpenAI GPT-Live sideband failed during startup");
			await activeSessionLease.deliverAnswer(session, lifecycleSignal, () => deliverActiveAnswer(200, call.answerSdp));
			return true;
		} catch (error) {
			if (session) await activeSessionLease.close(session);
			if (browserDisconnected) return true;
			respondText(res, 502, error instanceof Error ? error.message : "OpenAI realtime session failed");
			return true;
		} finally {
			responseDeliveryWaiter?.cancel();
			detachBrowserAbort();
			inFlightOffers.delete(token);
			if (!session) releaseReservation(token);
		}
	};
	const handler = (req, res) => {
		const handling = handleOffer(req, res);
		inFlightHandlers.add(handling);
		return handling.finally(() => inFlightHandlers.delete(handling));
	};
	const cleanup = async () => {
		if (cleanedUp) return;
		cleanedUp = true;
		shutdownController.abort(/* @__PURE__ */ new Error("OpenAI realtime broker stopped"));
		for (const [token, offer] of pendingOffers) expirePendingOffer(token, offer);
		for (const controller of inFlightOffers.values()) controller.abort(/* @__PURE__ */ new Error("OpenAI realtime broker stopped"));
		const closingSessions = Array.from(activeSessions.values(), (session) => activeSessionLease.close(session));
		await Promise.allSettled(inFlightHandlers);
		await Promise.allSettled(closingSessions);
		for (const token of reservations) releaseOpenAIQuicksilverSession(token);
		reservations.clear();
		reservationOwners.clear();
	};
	return {
		broker,
		handler,
		cleanup,
		getSessionCounts: () => ({
			pending: pendingOffers.size,
			inFlight: inFlightOffers.size,
			active: activeSessions.size,
			reservations: reservations.size
		})
	};
}
//#endregion
export { resolveOpenAIChatGptSubscriptionAuth as i, OPENAI_QUICKSILVER_OFFER_PATH as n, createOpenAIQuicksilverBrowserSessionBroker as r, OPENAI_QUICKSILVER_CAPABILITIES as t };
