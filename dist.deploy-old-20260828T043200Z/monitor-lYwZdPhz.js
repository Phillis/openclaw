import { o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { h as createChannelIngressError } from "./channel-outbound-0oFCMpw9.js";
import "./reply-payload-i0RzN2iF.js";
import { i as resolveOutboundMediaUrls } from "./reply-payload-parts-CJuHXrph.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as createChannelInboundEnvelopeBuilder } from "./envelope-j-M2cFFH.js";
import "./channel-inbound-BllqRtTK.js";
import { n as createChannelIngressMonitor } from "./ingress-monitor-5WsYdIbW.js";
import { a as createChannelIngressResolver, c as defineStableChannelIngressIdentity } from "./channel-ingress-runtime-BcONVz10.js";
import { a as normalizeTwitchChannel } from "./twitch-BKxAoH-v.js";
import { i as getOrCreateClientManager, l as HttpStatusCodeError, n as stripMarkdownForTwitch } from "./markdown-DJYjSH7V.js";
import { t as getTwitchRuntime } from "./runtime-SvsAyoAA.js";
//#region extensions/twitch/src/access-control.ts
const twitchUserIdentity = defineStableChannelIngressIdentity({
	key: "sender-id",
	entryIdPrefix: "twitch-user-entry"
});
const twitchRoleIdentity = defineStableChannelIngressIdentity({
	key: "role-moderator",
	kind: "role",
	normalizeEntry: normalizeTwitchModeratorRole,
	normalizeSubject: normalizeTwitchRole,
	aliases: [
		"owner",
		"vip",
		"subscriber"
	].map((role) => ({
		key: `role-${role}`,
		kind: "role",
		normalizeEntry: (value) => normalizeSpecificTwitchRole(value, role),
		normalizeSubject: normalizeTwitchRole
	})),
	isWildcardEntry: (entry) => normalizeTwitchRole(entry) === "all",
	resolveEntryId: ({ entryIndex }) => `twitch-role-entry-${entryIndex + 1}`
});
async function checkTwitchAccessControl(params) {
	const { message, account, botUsername } = params;
	const policyKind = resolveTwitchPolicyKind(account);
	const resolved = await createChannelIngressResolver({
		channelId: "twitch",
		accountId: "default",
		identity: policyKind === "role" ? twitchRoleIdentity : twitchUserIdentity
	}).message({
		subject: policyKind === "role" ? twitchRoleSubject(message) : { stableId: message.userId },
		conversation: {
			kind: "group",
			id: message.channel
		},
		contextBinding: params.contextBinding,
		event: { mayPair: false },
		mentionFacts: {
			canDetectMention: true,
			wasMentioned: mentionsBot(message.message, botUsername)
		},
		dmPolicy: "open",
		groupPolicy: policyKind === "open" ? "open" : "allowlist",
		policy: { activation: {
			requireMention: account.requireMention ?? true,
			allowTextCommands: false,
			order: "before-sender"
		} },
		groupAllowFrom: policyKind === "allowFrom" ? account.allowFrom : policyKind === "role" ? account.allowedRoles : void 0
	});
	const decision = resolved.ingress;
	if (decision.decisiveGateId === "activation" && decision.admission !== "dispatch") return {
		allowed: false,
		reason: "message does not mention the bot (requireMention is enabled)"
	};
	if (decision.admission === "dispatch") {
		if (policyKind === "allowFrom") return {
			allowed: true,
			channelIngress: resolved,
			matchKey: params.message.userId,
			matchSource: "allowlist"
		};
		if (policyKind === "role") return {
			allowed: true,
			channelIngress: resolved,
			matchKey: params.account.allowedRoles?.join(","),
			matchSource: "role"
		};
		return {
			allowed: true,
			channelIngress: resolved
		};
	}
	if (policyKind === "allowFrom") {
		if (!params.message.userId) return {
			allowed: false,
			reason: "sender user ID not available for allowlist check"
		};
		return {
			allowed: false,
			reason: "sender is not in allowFrom allowlist"
		};
	}
	if (policyKind === "role") return {
		allowed: false,
		reason: `sender does not have any of the required roles: ${params.account.allowedRoles?.join(", ") ?? ""}`
	};
	return {
		allowed: false,
		reason: reasonForTwitchIngressDecision(decision)
	};
}
function resolveTwitchPolicyKind(account) {
	if (account.allowFrom !== void 0) return "allowFrom";
	if (account.allowedRoles && account.allowedRoles.length > 0) return "role";
	return "open";
}
function twitchRoleSubject(message) {
	return {
		stableId: message.isMod ? "moderator" : void 0,
		aliases: {
			"role-owner": message.isOwner ? "owner" : void 0,
			"role-vip": message.isVip ? "vip" : void 0,
			"role-subscriber": message.isSub ? "subscriber" : void 0
		}
	};
}
function normalizeTwitchRole(value) {
	const role = normalizeLowercaseStringOrEmpty(value);
	if (role === "*") return "all";
	return role === "moderator" || role === "owner" || role === "vip" || role === "subscriber" || role === "all" ? role : null;
}
function normalizeTwitchModeratorRole(value) {
	return normalizeSpecificTwitchRole(value, "moderator");
}
function normalizeSpecificTwitchRole(value, expected) {
	const role = normalizeTwitchRole(value);
	return role === expected ? role : null;
}
function reasonForTwitchIngressDecision(decision) {
	switch (decision.reasonCode) {
		case "activation_skipped": return "message does not mention the bot (requireMention is enabled)";
		case "group_policy_empty_allowlist":
		case "group_policy_not_allowlisted": return "sender is not in allowFrom allowlist";
		default: return decision.reasonCode;
	}
}
function mentionsBot(message, botUsername) {
	const expected = normalizeLowercaseStringOrEmpty(botUsername);
	const mentionRegex = /@(\w+)/g;
	let match;
	while ((match = mentionRegex.exec(message)) !== null) if ((match[1] ? normalizeLowercaseStringOrEmpty(match[1]) : "") === expected) return true;
	return false;
}
//#endregion
//#region extensions/twitch/src/twitch-ingress.ts
const TWITCH_INGRESS_PAYLOAD_VERSION = 1;
const TWITCH_INGRESS_DRAIN_INTERVAL_MS = 1e3;
const TwitchIngressPermanentError = createChannelIngressError("TwitchIngressPermanentError");
function inspectTwitchIngressEvent(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) throw new TwitchIngressPermanentError("Twitch ingress event must be an object.");
	const candidate = event;
	const eventId = normalizeNullableString(candidate.id);
	if (!eventId) throw new TwitchIngressPermanentError("Twitch ingress event is missing its message id.");
	const rawChannel = normalizeNullableString(candidate.channel);
	const channel = rawChannel ? normalizeTwitchChannel(rawChannel) : "";
	if (!channel) throw new TwitchIngressPermanentError("Twitch ingress event is missing its channel.");
	return {
		eventId,
		laneKey: `channel:${channel}`
	};
}
function deserializeTwitchIngressEvent(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new TwitchIngressPermanentError("Twitch ingress event JSON is invalid.", { cause: error });
	}
	return parsed;
}
function normalizeClaimedTwitchMessage(event, claimedId) {
	const candidate = event;
	const username = normalizeNullableString(candidate.username);
	const rawChannel = normalizeNullableString(candidate.channel);
	if (!username || typeof candidate.message !== "string" || !rawChannel) throw new TwitchIngressPermanentError("Twitch ingress event shape is invalid.");
	return {
		...candidate,
		id: claimedId,
		username,
		message: candidate.message,
		channel: normalizeTwitchChannel(rawChannel)
	};
}
function isTwitchAuthenticationFailure(error) {
	let current = error;
	for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
		if (current instanceof HttpStatusCodeError && (current.statusCode === 401 || current.statusCode === 403)) return true;
		current = current.cause;
	}
	return false;
}
function stoppedError() {
	return /* @__PURE__ */ new Error("Twitch ingress stopped before dispatch.");
}
function createTwitchIngress(options) {
	const queue = options.queue ?? getTwitchRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const shutdown = new AbortController();
	let stopped = false;
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: (message) => inspectTwitchIngressEvent(message),
		payload: {
			storage: "raw-event",
			version: TWITCH_INGRESS_PAYLOAD_VERSION,
			serialize: (message) => JSON.stringify(message),
			deserialize: (rawEvent) => deserializeTwitchIngressEvent(rawEvent),
			createClaimError: (kind) => new TwitchIngressPermanentError(kind === "invalid-version" ? "Twitch ingress payload is invalid." : "Twitch ingress event identity changed after durable admission.")
		},
		deliver: async (rawEvent, lifecycle, claim) => {
			const message = normalizeClaimedTwitchMessage(rawEvent, claim.id);
			let handedOff = false;
			const deliveryAbortSignal = AbortSignal.any([lifecycle.abortSignal, shutdown.signal]);
			try {
				await options.deliver(message, {
					admission: lifecycle.admission,
					abortSignal: deliveryAbortSignal,
					onAdopted: async () => {
						handedOff = true;
						await lifecycle.onAdopted();
					},
					onDeferred: () => {
						handedOff = true;
						lifecycle.onDeferred();
					},
					onAbandoned: async () => {
						handedOff = true;
						await lifecycle.onAbandoned();
					}
				});
			} catch (error) {
				if (stopped || deliveryAbortSignal.aborted) return {
					kind: "failed-retryable",
					error
				};
				throw error;
			}
			if (!handedOff && (stopped || deliveryAbortSignal.aborted)) return {
				kind: "failed-retryable",
				error: stoppedError()
			};
		},
		deferredClaims: "manual",
		pollIntervalMs: options.pollIntervalMs ?? TWITCH_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e3,
			failedMaxEntries: 1e3
		},
		drain: {
			resolveNonRetryableFailure: (error) => {
				if (error instanceof TwitchIngressPermanentError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isTwitchAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: formatErrorMessage(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(`twitch ingress: ${message}`)
		},
		abortSignal: shutdown.signal,
		createStoppedError: stoppedError,
		onError: (error) => options.runtime.error?.(`Twitch ingress drain failed: ${formatErrorMessage(error)}`)
	});
	let stopTask;
	return {
		accept: (message) => {
			if (stopped) return Promise.reject(stoppedError());
			return monitor.admit(message).then(() => void 0);
		},
		start: () => {
			if (!stopped) monitor.start();
		},
		stop: () => {
			stopTask ??= (async () => {
				stopped = true;
				shutdown.abort(stoppedError());
				await monitor.pause();
				await monitor.waitForIdle();
				await monitor.waitForDeferredClaims();
				await monitor.stop();
			})();
			return stopTask;
		}
	};
}
//#endregion
//#region extensions/twitch/src/monitor.ts
/**
* Process an incoming Twitch message and dispatch to agent.
*/
async function processTwitchMessage(params) {
	const { message, account, accountId, config, runtime, core, turnAdoptionLifecycle, statusSink } = params;
	const cfg = config;
	const route = core.channel.routing.resolveAgentRoute({
		cfg,
		channel: "twitch",
		accountId,
		peer: {
			kind: "group",
			id: message.channel
		}
	});
	const exactAccess = await checkTwitchAccessControl({
		message,
		account,
		botUsername: normalizeLowercaseStringOrEmpty(account.username),
		contextBinding: {
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			messageId: message.id,
			inboundEventKind: "user_request"
		}
	});
	if (!exactAccess.allowed) return;
	await core.channel.inbound.run({
		channel: "twitch",
		accountId,
		raw: message,
		turnAdoptionLifecycle,
		adapter: {
			ingest: (incoming) => ({
				id: incoming.id,
				timestamp: incoming.timestamp,
				rawText: incoming.message,
				textForAgent: incoming.message,
				textForCommands: incoming.message,
				raw: incoming
			}),
			resolveTurn: async (input) => {
				const senderId = message.userId ?? message.username;
				const fromLabel = message.displayName ?? message.username;
				const body = createChannelInboundEnvelopeBuilder({
					cfg,
					route
				})({
					channel: "Twitch",
					from: fromLabel,
					timestamp: input.timestamp,
					body: input.rawText
				});
				const ctxPayload = core.channel.inbound.buildContext({
					channelIngress: exactAccess.channelIngress,
					channel: "twitch",
					accountId,
					messageId: input.id,
					timestamp: input.timestamp,
					from: `twitch:user:${senderId}`,
					sender: {
						id: senderId,
						name: fromLabel,
						username: message.username
					},
					conversation: {
						kind: "group",
						id: message.channel,
						label: message.channel
					},
					route: {
						agentId: route.agentId,
						dmScope: route.dmScope,
						accountId: route.accountId,
						routeSessionKey: route.sessionKey
					},
					reply: { to: `twitch:channel:${message.channel}` },
					message: {
						body,
						rawBody: input.rawText,
						bodyForAgent: input.textForAgent,
						commandBody: input.textForCommands
					}
				});
				const tableMode = core.channel.text.resolveMarkdownTableMode({
					cfg,
					channel: "twitch",
					accountId
				});
				return {
					cfg,
					channel: "twitch",
					accountId,
					route: {
						agentId: route.agentId,
						dmScope: route.dmScope,
						sessionKey: route.sessionKey
					},
					ctxPayload,
					delivery: {
						durable: () => ({ to: `twitch:channel:${message.channel}` }),
						deliver: async (payload) => {
							return await deliverTwitchReply({
								payload,
								channel: message.channel,
								account,
								accountId,
								config,
								tableMode,
								runtime
							});
						},
						onDelivered: (_payload, _info, result) => {
							if (result?.visibleReplySent !== false) statusSink?.({ lastOutboundAt: Date.now() });
						},
						onError: (err, info) => {
							runtime.error?.(`Twitch ${info.kind} reply failed: ${String(err)}`);
						}
					},
					replyPipeline: {},
					record: { onRecordError: (err) => {
						runtime.error?.(`Failed updating session meta: ${String(err)}`);
					} }
				};
			}
		}
	});
}
/**
* Deliver a reply to Twitch chat.
*/
async function deliverTwitchReply(params) {
	const { payload, channel, account, accountId, config, runtime } = params;
	try {
		const clientManager = getOrCreateClientManager(accountId, {
			info: (msg) => runtime.log?.(msg),
			warn: (msg) => runtime.log?.(msg),
			error: (msg) => runtime.error?.(msg),
			debug: (msg) => runtime.log?.(msg)
		});
		const textToSend = stripMarkdownForTwitch([payload.text, ...resolveOutboundMediaUrls(payload)].filter(Boolean).join(" "));
		if (!textToSend) {
			runtime.error?.(`No text to send in reply payload`);
			return { visibleReplySent: false };
		}
		const result = await clientManager.sendMessage(account, channel, textToSend, config, accountId);
		if (!result.ok) throw new Error(result.error ?? "Send failed");
		return { visibleReplySent: true };
	} catch (err) {
		runtime.error?.(`Failed to send reply: ${String(err)}`);
		return { visibleReplySent: false };
	}
}
/**
* Main monitor provider for Twitch.
*
* Sets up message handlers and processes incoming messages.
*/
async function monitorTwitchProvider(options) {
	const { account, accountId, config, runtime, abortSignal, statusSink } = options;
	const core = getTwitchRuntime();
	let stopped = false;
	let stopTask;
	const coreLogger = core.logging.getChildLogger({ module: "twitch" });
	const logVerboseMessage = (message) => {
		if (!core.logging.shouldLogVerbose()) return;
		coreLogger.debug?.(message);
	};
	const clientManager = getOrCreateClientManager(accountId, {
		info: (msg) => coreLogger.info(msg),
		warn: (msg) => coreLogger.warn(msg),
		error: (msg) => coreLogger.error(msg),
		debug: logVerboseMessage
	}, statusSink);
	try {
		await clientManager.getClient(account, config, accountId);
	} catch (error) {
		const errorMsg = formatErrorMessage(error);
		runtime.error?.(`Failed to connect: ${errorMsg}`);
		throw error;
	}
	const ingress = createTwitchIngress({
		accountId,
		runtime,
		deliver: async (message, turnAdoptionLifecycle) => {
			const botUsername = normalizeLowercaseStringOrEmpty(account.username);
			if (normalizeLowercaseStringOrEmpty(message.username) === botUsername) return;
			if (!(await checkTwitchAccessControl({
				message,
				account,
				botUsername
			})).allowed) return;
			statusSink?.({ lastInboundAt: Date.now() });
			await processTwitchMessage({
				message,
				account,
				accountId,
				config,
				runtime,
				core,
				turnAdoptionLifecycle,
				statusSink
			});
		}
	});
	ingress.start();
	const unregisterHandler = clientManager.onMessage(account, (message) => {
		if (stopped) return;
		ingress.accept(message).catch((err) => {
			runtime.error?.(`Message durable admission failed: ${String(err)}`);
		});
	});
	const stop = () => {
		stopTask ??= (async () => {
			stopped = true;
			unregisterHandler();
			await ingress.stop();
		})();
		return stopTask;
	};
	abortSignal.addEventListener("abort", () => {
		stop().catch((error) => {
			runtime.error?.(`Twitch ingress stop failed: ${String(error)}`);
		});
	}, { once: true });
	return { stop };
}
//#endregion
export { monitorTwitchProvider };
