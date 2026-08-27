import { t as sleep } from "./sleep-Bd74jGcV.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, wn as number } from "./schemas-CZ9Toj_c.js";
import { l as hasConfiguredSecretInput } from "./types.secrets-BrIfhxSG.js";
import { g as MarkdownConfigSchema, u as GroupPolicySchema } from "./zod-schema.core-DlR2bhDb.js";
import { a as buildChannelConfigSchema } from "./config-schema-7k2vg2UM.js";
import { t as defineChannelSetupContract } from "./setup-contract-DNfi_CdO.js";
import "./runtime-env-COkbgBI4.js";
import { r as buildSecretInputSchema } from "./secret-input-Dv7SE4A5.js";
import { t as applyAccountNameToChannelSection } from "./setup-helpers-DKfRvbZ6.js";
import { k as runSingleChannelSecretStep, x as patchTopLevelChannelConfigSection } from "./setup-wizard-helpers-BI1PZFar.js";
import "./setup-BcJSTbge.js";
import "./setup-runtime-jPhXOAPk.js";
import "./channel-setup-BDsIe7lJ.js";
import "./channel-config-schema-B2VBzFY9.js";
import { d as parseBuzzTarget, i as resolveBuzzPublicKey, o as BUZZ_CHANNEL_ID_PATTERN, r as resolveBuzzAccount, t as decodeBuzzPrivateKey } from "./types-D-Az035w.js";
import { i as generateSecretKey, o as nip19_exports } from "./esm-B8-t-Wx3.js";
import { a as parseBuzzRoomMembershipEvent, c as parseBuzzAuthTag, l as openBuzzRelaySubscription, s as connectAuthenticatedBuzzRelaySession, t as BUZZ_ROOM_MEMBERSHIP_KIND } from "./room-membership-Bw0WUD3B.js";
import { isIP } from "node:net";
//#region extensions/buzz/src/config-schema.ts
const BuzzGroupConfigSchema = object({
	enabled: boolean().optional(),
	requireMention: boolean().optional()
}).strict();
const BuzzConfigSchema = buildChannelConfigSchema(object({
	name: string().optional(),
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	markdown: MarkdownConfigSchema,
	relayUrl: string().url().and(string().regex(/^[wW][sS][sS]?:\/\//, "Buzz relay URL must use ws:// or wss://")).optional(),
	privateKey: buildSecretInputSchema().optional(),
	authTag: buildSecretInputSchema().optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groupAllowFrom: array(union([string(), number()])).optional(),
	groups: record(string().regex(BUZZ_CHANNEL_ID_PATTERN, "Buzz group key must be a channel UUID"), BuzzGroupConfigSchema).optional(),
	defaultTo: string().optional()
}).strict());
//#endregion
//#region extensions/buzz/src/room-membership-notification.ts
const BUZZ_MEMBER_ADDED_NOTIFICATION_KIND = 44100;
const BUZZ_MEMBER_REMOVED_NOTIFICATION_KIND = 44101;
const MEMBERSHIP_NOTIFICATION_CLOSE_REASON = "membership notification shutdown";
function parseBuzzRoomMembershipNotification(params) {
	const { event } = params;
	if (event.kind !== 44100 && event.kind !== BUZZ_MEMBER_REMOVED_NOTIFICATION_KIND || event.pubkey.toLowerCase() !== params.relayPublicKey || !event.tags.some((tag) => tag[0] === "p" && tag[1]?.toLowerCase() === params.botPublicKey)) return;
	const roomId = event.tags.find((tag) => tag[0] === "h")?.[1]?.trim().toLowerCase();
	if (!roomId || !BUZZ_CHANNEL_ID_PATTERN.test(roomId)) return;
	return {
		eventId: event.id,
		kind: event.kind,
		roomId
	};
}
function startBuzzRoomMembershipNotifications(params) {
	const configuredRoomIds = new Set(params.configuredRoomIds.map(parseBuzzTarget));
	const subscription = openBuzzRelaySubscription(params.relay, [{
		kinds: [BUZZ_MEMBER_ADDED_NOTIFICATION_KIND, BUZZ_MEMBER_REMOVED_NOTIFICATION_KIND],
		authors: [params.relayPublicKey],
		"#p": [params.botPublicKey],
		since: params.since
	}], {
		onevent: (event) => {
			const notification = parseBuzzRoomMembershipNotification({
				event,
				relayPublicKey: params.relayPublicKey,
				botPublicKey: params.botPublicKey
			});
			if (notification && configuredRoomIds.has(notification.roomId)) params.onFatalError(/* @__PURE__ */ new Error(`Buzz room ${notification.roomId} membership changed; rebuilding subscriptions`));
		},
		onclose: (reason) => {
			if (reason !== MEMBERSHIP_NOTIFICATION_CLOSE_REASON && reason !== "relay connection closed by us" && reason !== "shutdown" && !params.signal?.aborted) params.onFatalError(/* @__PURE__ */ new Error(`Buzz membership notification subscription closed: ${reason}`));
		}
	});
	const close = () => {
		if (!subscription.closed) subscription.close(MEMBERSHIP_NOTIFICATION_CLOSE_REASON);
	};
	params.signal?.addEventListener("abort", close, { once: true });
	if (params.signal?.aborted) close();
}
//#endregion
//#region extensions/buzz/src/room-discovery.ts
const METADATA_KIND = 39e3;
const DEFAULT_QUERY_TIMEOUT_MS = 1e4;
function tagValue(event, name) {
	return event.tags.find((tag) => tag[0] === name)?.[1];
}
async function queryRelay(params) {
	params.signal?.throwIfAborted();
	return await new Promise((resolve, reject) => {
		const events = [];
		const state = {
			settled: false,
			receivedEose: false
		};
		const finish = (error) => {
			if (state.settled) return;
			state.settled = true;
			if (state.timeout) clearTimeout(state.timeout);
			params.signal?.removeEventListener("abort", onAbort);
			if (state.receivedEose) state.subscription?.close("query complete");
			if (error !== void 0) reject(error instanceof Error ? error : new Error("Buzz room query failed", { cause: error }));
			else resolve(events);
		};
		const onAbort = () => finish(params.signal?.reason ?? /* @__PURE__ */ new Error("Buzz room query aborted"));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		state.timeout = setTimeout(() => {
			finish(/* @__PURE__ */ new Error("Timed out querying Buzz room membership"));
			params.relay.close();
		}, params.timeoutMs);
		try {
			state.subscription = openBuzzRelaySubscription(params.relay, [params.filter], {
				onevent: (event) => events.push(event),
				oneose: () => {
					state.receivedEose = true;
					if (state.settled) state.subscription?.close("query complete");
					else finish();
				},
				onclose: (reason) => {
					if (reason !== "query complete") finish(/* @__PURE__ */ new Error(`Buzz room query closed: ${reason}`));
				}
			});
		} catch (error) {
			finish(error);
			return;
		}
		if (state.settled && state.receivedEose) state.subscription.close("query complete");
	});
}
async function discoverBuzzRoomsOnRelay(params) {
	const timeoutMs = params.timeoutMs ?? DEFAULT_QUERY_TIMEOUT_MS;
	const membershipEvents = await queryRelay({
		relay: params.relay,
		filter: {
			kinds: [BUZZ_ROOM_MEMBERSHIP_KIND],
			authors: [params.relayPublicKey],
			"#p": [params.publicKey],
			limit: 1e3
		},
		timeoutMs,
		signal: params.signal
	});
	const roomIds = [...new Set(membershipEvents.map((event) => parseBuzzRoomMembershipEvent(event, params.relayPublicKey)).filter((membership) => membership?.roles.get(params.publicKey) === "bot").map((membership) => membership?.roomId).filter((roomId) => Boolean(roomId?.match(BUZZ_CHANNEL_ID_PATTERN))))].toSorted();
	if (roomIds.length === 0) return [];
	const metadataEvents = await queryRelay({
		relay: params.relay,
		filter: {
			kinds: [METADATA_KIND],
			authors: [params.relayPublicKey],
			"#d": roomIds,
			limit: roomIds.length
		},
		timeoutMs,
		signal: params.signal
	});
	const latestMetadata = /* @__PURE__ */ new Map();
	for (const event of metadataEvents) {
		const roomId = tagValue(event, "d")?.toLowerCase();
		const current = roomId ? latestMetadata.get(roomId) : void 0;
		if (event.kind !== METADATA_KIND || event.pubkey.toLowerCase() !== params.relayPublicKey || !roomId || !roomIds.includes(roomId) || current && (current.created_at > event.created_at || current.created_at === event.created_at && current.id <= event.id)) continue;
		latestMetadata.set(roomId, event);
	}
	return roomIds.flatMap((id) => {
		const metadata = latestMetadata.get(id);
		if (metadata?.tags.some((tag) => tag[0] === "archived" && tag[1] === "true")) return [];
		const name = metadata ? tagValue(metadata, "name")?.trim() : void 0;
		const about = metadata ? tagValue(metadata, "about")?.trim() : void 0;
		const room = {
			id,
			name: name || id
		};
		if (about) room.about = about;
		return [room];
	});
}
async function discoverBuzzRooms(params) {
	const secretKey = decodeBuzzPrivateKey(params.privateKey);
	const publicKey = resolveBuzzPublicKey(params.privateKey);
	const timeoutMs = params.timeoutMs ?? DEFAULT_QUERY_TIMEOUT_MS;
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeoutSignal]) : timeoutSignal;
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: params.relayUrl,
		secretKey,
		authTag: parseBuzzAuthTag(params.authTag ?? ""),
		signal
	});
	try {
		return await discoverBuzzRoomsOnRelay({
			relay,
			relayPublicKey,
			publicKey,
			timeoutMs,
			signal
		});
	} finally {
		if (relay.connected) relay.close();
	}
}
//#endregion
//#region extensions/buzz/src/setup-core.ts
function validRelayUrl(value) {
	try {
		const url = new URL(value ?? "");
		return url.protocol === "ws:" || url.protocol === "wss:";
	} catch {
		return false;
	}
}
function resolveComparableCurrentKey(cfg) {
	const configured = cfg.channels?.buzz?.privateKey;
	if (configured !== void 0) return typeof configured === "string" ? configured.trim() || void 0 : void 0;
	return process.env.BUZZ_PRIVATE_KEY?.trim() || void 0;
}
function isSameBuzzIdentity(currentKey, nextKey) {
	if (!currentKey || !nextKey) return false;
	try {
		return resolveBuzzPublicKey(currentKey) === resolveBuzzPublicKey(nextKey);
	} catch {
		return false;
	}
}
const buzzSetupContract = defineChannelSetupContract({
	fields: {
		relayUrl: {
			kind: "string",
			cli: {
				flags: "--relay-url <url>",
				description: "Buzz relay WebSocket URL"
			}
		},
		privateKey: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--private-key <key>",
				description: "Buzz bot Nostr private key"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use BUZZ_PRIVATE_KEY with the supplied relay URL"
			},
			envVars: ["BUZZ_PRIVATE_KEY"]
		}
	},
	adapter: {
		resolveAccountId: () => DEFAULT_ACCOUNT_ID,
		applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
			cfg,
			channelKey: "buzz",
			accountId,
			name
		}),
		validateInput: ({ accountId, input }) => {
			if (accountId !== "default") return "Buzz currently supports only the default account.";
			if (!validRelayUrl(input.relayUrl)) return "Buzz requires --relay-url with a ws:// or wss:// URL.";
			if (input.useEnv) return null;
			const privateKey = input.privateKey?.trim();
			if (!privateKey) return "Buzz requires --private-key or --use-env.";
			try {
				decodeBuzzPrivateKey(privateKey);
			} catch (error) {
				return error instanceof Error ? error.message : "Invalid Buzz private key.";
			}
			return null;
		},
		applyAccountConfig: ({ cfg, input }) => {
			const keepAuthTag = isSameBuzzIdentity(resolveComparableCurrentKey(cfg), input.useEnv ? process.env.BUZZ_PRIVATE_KEY?.trim() : input.privateKey?.trim());
			const { privateKey: _privateKey, authTag, ...existing } = cfg.channels?.buzz ?? {};
			return {
				...cfg,
				channels: {
					...cfg.channels,
					buzz: {
						...existing,
						enabled: true,
						relayUrl: input.relayUrl?.trim(),
						...keepAuthTag && authTag !== void 0 ? { authTag } : {},
						...input.useEnv ? {} : { privateKey: input.privateKey?.trim() }
					}
				}
			};
		}
	}
});
//#endregion
//#region extensions/buzz/src/room-access-wait.ts
const DEFAULT_WAIT_TIMEOUT_MS = 9e4;
const DISCOVERY_RETRY_DELAYS_MS = [
	0,
	500,
	1500
];
const DISCOVERY_POLL_INTERVAL_MS = 2e3;
function hasTag(event, name, value) {
	return event.tags.some((tag) => tag[0] === name && tag[1] === value);
}
function hasValidRoomTag(event) {
	return event.tags.some((tag) => tag[0] === "h" && Boolean(tag[1]?.toLowerCase().match(BUZZ_CHANNEL_ID_PATTERN)));
}
async function sleepWithSignal(delayMs, signal) {
	if (delayMs === 0) {
		signal.throwIfAborted();
		return;
	}
	await new Promise((resolve, reject) => {
		const finish = (error) => {
			clearTimeout(timer);
			signal.removeEventListener("abort", onAbort);
			if (error !== void 0) reject(error instanceof Error ? error : new Error("Buzz room access wait failed", { cause: error }));
			else resolve();
		};
		const onAbort = () => {
			finish(signal.reason ?? /* @__PURE__ */ new Error("Buzz room access wait aborted"));
		};
		const timer = setTimeout(() => finish(), delayMs);
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
}
async function waitForBuzzRoomAccess(params) {
	const secretKey = decodeBuzzPrivateKey(params.privateKey);
	const publicKey = resolveBuzzPublicKey(params.privateKey);
	const timeoutSignal = AbortSignal.timeout(params.timeoutMs ?? DEFAULT_WAIT_TIMEOUT_MS);
	const signal = params.signal ? AbortSignal.any([params.signal, timeoutSignal]) : timeoutSignal;
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: params.relayUrl,
		secretKey,
		authTag: parseBuzzAuthTag(params.authTag ?? ""),
		signal
	});
	try {
		return await new Promise((resolve, reject) => {
			let settled = false;
			let checking = false;
			let queuedRetry = false;
			const subscriptionRef = {};
			let pollTimer;
			const seenEvents = /* @__PURE__ */ new Set();
			const finish = (error, rooms) => {
				if (settled) return;
				settled = true;
				signal.removeEventListener("abort", onAbort);
				if (pollTimer) clearInterval(pollTimer);
				if (error !== void 0) reject(error instanceof Error ? error : new Error("Buzz room access wait failed", { cause: error }));
				else resolve(rooms ?? []);
			};
			const onAbort = () => {
				if (timeoutSignal.aborted && !params.signal?.aborted) {
					finish();
					return;
				}
				finish(signal.reason ?? /* @__PURE__ */ new Error("Buzz room access wait aborted"));
			};
			const checkRooms = async (retry) => {
				if (checking) {
					queuedRetry ||= retry;
					return;
				}
				checking = true;
				try {
					const delays = retry ? DISCOVERY_RETRY_DELAYS_MS : [0];
					for (const delayMs of delays) {
						await sleepWithSignal(delayMs, signal);
						try {
							const rooms = await discoverBuzzRoomsOnRelay({
								relay,
								relayPublicKey,
								publicKey,
								timeoutMs: 1e4,
								signal
							});
							if (rooms.length > 0) {
								finish(void 0, rooms);
								return;
							}
						} catch (error) {
							if (signal.aborted) throw error;
						}
					}
				} catch (error) {
					finish(error);
				} finally {
					checking = false;
					if (queuedRetry && !settled) {
						queuedRetry = false;
						checkRooms(true);
					}
				}
			};
			signal.addEventListener("abort", onAbort, { once: true });
			subscriptionRef.current = openBuzzRelaySubscription(relay, [{
				kinds: [BUZZ_MEMBER_ADDED_NOTIFICATION_KIND],
				"#p": [publicKey],
				since: Math.floor(Date.now() / 1e3) - 30
			}], {
				onevent: (event) => {
					if (event.kind !== 44100 || seenEvents.has(event.id) || !hasTag(event, "p", publicKey) || !hasValidRoomTag(event)) return;
					seenEvents.add(event.id);
					checkRooms(true);
				},
				oneose: () => {
					checkRooms(false);
					pollTimer ??= setInterval(() => {
						checkRooms(false);
					}, DISCOVERY_POLL_INTERVAL_MS);
					pollTimer.unref?.();
				},
				onclose: (reason) => {
					if (reason !== "room access found") finish(/* @__PURE__ */ new Error(`Buzz room access subscription closed: ${reason}`));
				}
			});
		});
	} finally {
		relay.close();
	}
}
//#endregion
//#region extensions/buzz/src/setup-verify.ts
const GATEWAY_RELOAD_WAIT_MS = 15e3;
const GATEWAY_RELOAD_POLL_MS = 500;
function hasSuccessfulBuzzProbe(payload, accountId, target) {
	const accounts = payload?.channelAccounts?.buzz;
	return Boolean(accounts?.some((account) => account.accountId === accountId && account.probe?.ok === true && account.probe.rooms?.some((room) => room.id === target)));
}
function isGatewayNotRunningError(error) {
	const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
	const identifiesMissingListener = message.includes("econnrefused") || message.includes("connection refused") || message.includes("no listener");
	if (identifiesMissingListener && typeof error === "object" && error !== null && "name" in error && "kind" in error && "code" in error && error.name === "GatewayTransportError" && error.kind === "closed" && error.code === 1006) return true;
	return identifiesMissingListener;
}
async function verifyBuzzAfterSetup(params) {
	try {
		const { callGatewayFromCli } = await import("./plugin-sdk/gateway-runtime.js");
		const reloadDeadline = Date.now() + GATEWAY_RELOAD_WAIT_MS;
		let reloadPending = false;
		while (true) {
			try {
				const configState = await callGatewayFromCli("config.get", {
					timeout: "5000",
					json: true
				}, {}, {
					expectFinal: false,
					progress: false
				});
				if (!configState.configRevisionHash) throw new Error("Gateway config status did not include a saved revision hash");
				if (configState.appliedConfigHash === configState.configRevisionHash) break;
				if (!reloadPending) {
					params.runtime.log("Buzz config saved. Waiting for the Gateway to apply it...");
					reloadPending = true;
				}
			} catch (error) {
				if (!reloadPending || !isGatewayNotRunningError(error)) throw error;
			}
			const remainingMs = reloadDeadline - Date.now();
			if (remainingMs <= 0) throw new Error(`Gateway did not apply the saved Buzz configuration within ${GATEWAY_RELOAD_WAIT_MS / 1e3} seconds`);
			await sleep(Math.min(GATEWAY_RELOAD_POLL_MS, remainingMs));
		}
		if (!hasSuccessfulBuzzProbe(await callGatewayFromCli("channels.status", {
			timeout: "15000",
			json: true
		}, {
			channel: "buzz",
			probe: true,
			timeoutMs: 1e4
		}, {
			expectFinal: false,
			progress: false
		}), params.accountId, params.target)) {
			params.runtime.log(`Buzz config was saved and applied, but the Gateway did not confirm authenticated membership in ${params.target}. Run \`openclaw channels status --probe\` before sending.`);
			return;
		}
		params.runtime.log("Buzz authenticated successfully and the configured room membership is visible.");
	} catch (error) {
		if (isGatewayNotRunningError(error)) {
			params.runtime.log("Buzz config was saved. Start OpenClaw to connect: openclaw gateway");
			return;
		}
		const message = error instanceof Error ? error.message : String(error);
		params.runtime.log(`Buzz config was saved, but post-setup verification did not complete: ${message}. Run \`openclaw channels status --probe\` after the Gateway reloads.`);
	}
}
//#endregion
//#region extensions/buzz/src/setup-surface.ts
const channel = "buzz";
function patchBuzzConfig(cfg, patch) {
	return patchTopLevelChannelConfigSection({
		cfg,
		channel,
		patch
	});
}
function validateRelayUrl(value) {
	try {
		const url = new URL(value.trim());
		return url.protocol === "ws:" || url.protocol === "wss:" ? void 0 : "Use a ws:// or wss:// relay URL";
	} catch {
		return "Enter a valid Buzz relay WebSocket URL";
	}
}
function isRemoteInsecureRelayUrl(value) {
	const url = new URL(value);
	const hostname = url.hostname.replace(/^\[|\]$/gu, "").toLowerCase();
	const isIpv4Loopback = isIP(hostname) === 4 && hostname.startsWith("127.");
	const isLoopback = hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || isIpv4Loopback;
	return url.protocol === "ws:" && !isLoopback;
}
function isBuzzSetupConfigured(cfg) {
	const buzzConfig = cfg.channels?.buzz;
	return Boolean((buzzConfig?.relayUrl?.trim() || process.env.BUZZ_RELAY_URL?.trim()) && (hasConfiguredSecretInput(buzzConfig?.privateKey, cfg.secrets?.defaults) || process.env.BUZZ_PRIVATE_KEY?.trim()));
}
async function promptRelayUrl(params) {
	while (true) {
		const relayUrl = (await params.prompter.text({
			message: "Buzz relay WebSocket URL",
			placeholder: "wss://buzz.example.com",
			initialValue: params.initialValue,
			validate: validateRelayUrl
		})).trim();
		if (!isRemoteInsecureRelayUrl(relayUrl)) return relayUrl;
		if (await params.prompter.confirm({
			message: "This remote ws:// relay is unencrypted. Continue anyway?",
			initialValue: false
		})) return relayUrl;
	}
}
async function resolveRelayUrl(params) {
	const configuredValue = params.configuredValue?.trim();
	if (configuredValue && validateRelayUrl(configuredValue) === void 0) {
		if (!isRemoteInsecureRelayUrl(configuredValue)) return configuredValue;
		if (await params.prompter.confirm({
			message: "This remote ws:// relay is unencrypted. Continue anyway?",
			initialValue: false
		})) return configuredValue;
	}
	return await promptRelayUrl({
		...configuredValue ? { initialValue: configuredValue } : {},
		prompter: params.prompter
	});
}
function resolvedConfiguredKey(cfg) {
	const value = cfg.channels?.buzz?.privateKey;
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function resolvedCurrentKey(cfg) {
	return cfg.channels?.buzz?.privateKey === void 0 ? process.env.BUZZ_PRIVATE_KEY?.trim() || void 0 : resolvedConfiguredKey(cfg);
}
async function resolvePrivateKey(params) {
	const hasExistingIdentity = hasConfiguredSecretInput(params.cfg.channels?.buzz?.privateKey, params.cfg.secrets?.defaults) || Boolean(process.env.BUZZ_PRIVATE_KEY?.trim());
	const currentPrivateKey = resolvedCurrentKey(params.cfg);
	if (hasExistingIdentity) {
		const resolvedPrivateKey = currentPrivateKey;
		if (resolvedPrivateKey) decodeBuzzPrivateKey(resolvedPrivateKey);
		return {
			cfg: params.cfg,
			resolvedPrivateKey
		};
	}
	if (params.secretInputMode !== "ref") {
		let privateKey = params.generatedPrivateKeys.get(params.prompter);
		if (!privateKey) {
			privateKey = nip19_exports.nsecEncode(params.generate());
			params.generatedPrivateKeys.set(params.prompter, privateKey);
		}
		return {
			cfg: patchBuzzConfig(params.cfg, {
				enabled: true,
				privateKey,
				authTag: void 0
			}),
			resolvedPrivateKey: privateKey
		};
	}
	const secretStep = await params.runSecretStep({
		cfg: params.cfg,
		prompter: params.prompter,
		providerHint: channel,
		credentialLabel: "Buzz bot private key",
		secretInputMode: params.secretInputMode,
		accountConfigured: false,
		hasConfigToken: false,
		allowEnv: true,
		envValue: process.env.BUZZ_PRIVATE_KEY,
		envPrompt: "Use BUZZ_PRIVATE_KEY?",
		keepPrompt: "Keep the existing Buzz bot private key?",
		inputPrompt: "Buzz bot private key (nsec or 64-character hex)",
		preferredEnvVar: "BUZZ_PRIVATE_KEY",
		applyUseEnv: (cfg) => {
			const envPrivateKey = process.env.BUZZ_PRIVATE_KEY?.trim();
			const keepAuthTag = isSameBuzzIdentity(currentPrivateKey, envPrivateKey);
			const { privateKey: _privateKey, authTag, ...buzz } = cfg.channels?.buzz ?? {};
			return {
				...cfg,
				channels: {
					...cfg.channels,
					buzz: {
						...buzz,
						enabled: true,
						...keepAuthTag && authTag !== void 0 ? { authTag } : {}
					}
				}
			};
		},
		applySet: (cfg, value, resolvedValue) => patchBuzzConfig(cfg, {
			enabled: true,
			privateKey: value,
			...isSameBuzzIdentity(currentPrivateKey, resolvedValue) ? {} : { authTag: void 0 }
		})
	});
	const resolvedPrivateKey = secretStep.resolvedValue ?? (secretStep.action === "keep" ? resolvedConfiguredKey(secretStep.cfg) ?? currentPrivateKey : void 0);
	if (resolvedPrivateKey) decodeBuzzPrivateKey(resolvedPrivateKey);
	return {
		cfg: secretStep.cfg,
		resolvedPrivateKey
	};
}
async function promptRooms(params) {
	if (params.rooms.length === 1) return [params.rooms[0].id];
	const configuredRooms = new Set(params.configuredRoomIds);
	const preservedRoomIds = params.rooms.map((room) => room.id).filter((roomId) => configuredRooms.has(roomId));
	return await params.prompter.multiselect({
		message: "Select authorized Buzz rooms",
		options: params.rooms.map((room) => ({
			value: room.id,
			label: room.name,
			hint: room.about ?? room.id
		})),
		initialValues: preservedRoomIds.length > 0 ? preservedRoomIds : params.rooms.map((room) => room.id)
	});
}
function pauseBuzzSetup(cfg) {
	return {
		cfg: patchBuzzConfig(cfg, { enabled: false }),
		completion: "paused"
	};
}
async function noteBuzzAccessInstructions(params) {
	const npub = params.publicKey ? nip19_exports.npubEncode(params.publicKey) : "<BOT_PUBLIC_KEY>";
	const hex = params.publicKey ?? "<64_CHAR_BOT_PUBLIC_KEY>";
	await params.prompter.note([
		...params.discoveryError ? [`Status: ${params.discoveryError}`, ""] : [],
		`Relay: ${params.relayUrl}`,
		`Bot npub: ${npub}`,
		`Bot hex public key: ${hex}`,
		"",
		"Run as the existing human room owner/admin:",
		`buzz channels add-member --channel <ROOM_UUID> --pubkey ${hex} --role bot`,
		"",
		"OpenClaw is waiting for Buzz to confirm the Bot role automatically.",
		"Local `just dev` needs no separate community-member step.",
		`Closed relay only: first run buzz-admin add-member --pubkey ${hex} --role member.`,
		"Never paste that human private key into OpenClaw."
	].join("\n"), "Buzz room access required");
}
function createBuzzSetupWizard(dependencies = {}) {
	const discoverRooms = dependencies.discoverRooms ?? discoverBuzzRooms;
	const generate = dependencies.generateSecretKey ?? generateSecretKey;
	const runSecretStep = dependencies.runSecretStep ?? runSingleChannelSecretStep;
	const waitForRoomAccess = dependencies.waitForRoomAccess ?? waitForBuzzRoomAccess;
	const verifyAfterWrite = dependencies.verifyAfterWrite ?? verifyBuzzAfterSetup;
	const generatedPrivateKeys = /* @__PURE__ */ new WeakMap();
	return {
		channel,
		getStatus: async ({ cfg }) => {
			const buzzConfig = cfg.channels?.buzz;
			const configured = isBuzzSetupConfigured(cfg);
			const enabled = buzzConfig?.enabled !== false;
			const status = !configured ? "needs relay URL and bot identity" : enabled ? "configured" : "configured but disabled";
			return {
				channel,
				configured,
				statusLines: [`Buzz: ${status}`],
				selectionHint: status
			};
		},
		configure: async ({ cfg, prompter, options }) => {
			const existingBuzzConfig = cfg.channels?.buzz;
			const hasExistingAccessConfig = existingBuzzConfig?.groupPolicy !== void 0 || existingBuzzConfig?.groupAllowFrom !== void 0 || existingBuzzConfig?.groups !== void 0;
			const useFreshAccessDefaults = !isBuzzSetupConfigured(cfg) && !hasExistingAccessConfig;
			const relayUrl = await resolveRelayUrl({
				configuredValue: existingBuzzConfig?.relayUrl?.trim() || process.env.BUZZ_RELAY_URL?.trim(),
				prompter
			});
			let next = patchBuzzConfig(cfg, {
				enabled: true,
				relayUrl
			});
			const identity = await resolvePrivateKey({
				cfg: next,
				prompter,
				secretInputMode: options?.secretInputMode,
				generate,
				generatedPrivateKeys,
				runSecretStep
			});
			next = identity.cfg;
			const privateKey = identity.resolvedPrivateKey;
			let publicKey;
			if (privateKey) publicKey = resolveBuzzPublicKey(privateKey);
			if (!privateKey) {
				await prompter.note("OpenClaw cannot resolve the configured private-key reference during setup, so room access cannot be verified. The relay URL and identity reference will be saved with Buzz disabled. Make the secret available and rerun setup.", "Buzz setup paused");
				return pauseBuzzSetup(next);
			}
			let discoveredRooms = [];
			let discoveryError;
			const authTag = resolveBuzzAccount({ cfg: next }).authTag;
			const discoverAuthorizedRooms = async () => {
				try {
					const rooms = await discoverRooms({
						relayUrl,
						privateKey,
						...authTag ? { authTag } : {}
					});
					discoveryError = rooms.length === 0 ? "No authorized rooms were returned for this bot." : void 0;
					return rooms;
				} catch (error) {
					discoveryError = `Authenticated room discovery failed: ${error instanceof Error ? error.message : String(error)}.`;
					return [];
				}
			};
			discoveredRooms = await discoverAuthorizedRooms();
			if (discoveredRooms.length === 0) {
				await noteBuzzAccessInstructions({
					relayUrl,
					publicKey,
					prompter,
					discoveryError
				});
				const progress = prompter.progress("Waiting for Buzz room access...");
				try {
					discoveredRooms = await waitForRoomAccess({
						relayUrl,
						privateKey,
						...authTag ? { authTag } : {}
					});
					progress.stop(discoveredRooms.length > 0 ? "Buzz room access confirmed" : "Buzz room access wait expired");
				} catch (error) {
					progress.stop("Buzz room access check failed");
					await prompter.note(error instanceof Error ? error.message : String(error), "Buzz room access check failed");
				}
			}
			while (discoveredRooms.length === 0) {
				await prompter.select({
					message: "Buzz room access is not ready",
					options: [{
						value: "retry",
						label: "Retry authenticated room discovery",
						hint: "Use after the bot has been added to a room with the Bot role"
					}],
					initialValue: "retry"
				});
				const progress = prompter.progress("Checking Buzz room access...");
				discoveredRooms = await discoverAuthorizedRooms();
				progress.stop(discoveredRooms.length > 0 ? "Buzz room access confirmed" : "Buzz room access not found");
				if (discoveredRooms.length === 0 && discoveryError) await prompter.note(discoveryError, "Buzz room access not ready");
			}
			const configuredGroups = cfg.channels?.buzz?.groups ?? {};
			const roomIds = await promptRooms({
				rooms: discoveredRooms,
				configuredRoomIds: Object.keys(configuredGroups),
				prompter
			});
			if (roomIds.length === 0) {
				await prompter.note("No rooms were selected. Relay URL and bot identity will be saved with Buzz disabled.", "Buzz setup paused");
				return pauseBuzzSetup(next);
			}
			const existingDefault = cfg.channels?.buzz?.defaultTo;
			const defaultTo = roomIds.length === 1 ? roomIds[0] : await prompter.select({
				message: "Choose the default Buzz room target",
				options: roomIds.map((roomId) => {
					return {
						value: roomId,
						label: discoveredRooms.find((candidate) => candidate.id === roomId)?.name ?? roomId,
						hint: roomId
					};
				}),
				initialValue: existingDefault && roomIds.includes(existingDefault) ? existingDefault : roomIds[0]
			});
			next = patchBuzzConfig(next, {
				...useFreshAccessDefaults ? {
					groupPolicy: "open",
					groupAllowFrom: void 0
				} : {},
				groups: Object.fromEntries(roomIds.map((roomId) => [roomId, {
					enabled: configuredGroups[roomId]?.enabled ?? true,
					requireMention: configuredGroups[roomId]?.requireMention ?? !useFreshAccessDefaults
				}])),
				defaultTo
			});
			options?.onPostWriteHook?.({
				channel,
				accountId: DEFAULT_ACCOUNT_ID,
				run: async ({ runtime }) => await verifyAfterWrite({
					accountId: DEFAULT_ACCOUNT_ID,
					target: defaultTo,
					runtime
				})
			});
			return {
				cfg: next,
				accountId: DEFAULT_ACCOUNT_ID
			};
		},
		disable: (cfg) => patchBuzzConfig(cfg, { enabled: false })
	};
}
const buzzSetupWizard = createBuzzSetupWizard();
//#endregion
export { BuzzConfigSchema as a, startBuzzRoomMembershipNotifications as i, buzzSetupContract as n, discoverBuzzRooms as r, buzzSetupWizard as t };
