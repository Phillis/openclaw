import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as computeBackoff, s as sleepWithAbort } from "./src-BQ327IOM.js";
import { f as parseThreadSessionSuffix } from "./session-key-utils-D8x_bjrd.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { f as createChannelMessageAdapterFromOutbound } from "./channel-outbound-CI0BSGM5.js";
import { n as describeAccountSnapshot } from "./account-helpers-CEliAVvN.js";
import "./runtime-env-dZQRmQRq.js";
import "./routing-CERGQFBr.js";
import "./text-utility-runtime-BSdEoze8.js";
import { a as waitUntilAbort } from "./channel-lifecycle.core-C98dobNq.js";
import "./logging-core-ClEDRBwn.js";
import { i as createChatChannelPlugin, n as buildThreadAwareOutboundSessionRoute, t as buildChannelOutboundSessionRoute } from "./core-C2t7ybgt.js";
import { r as buildChannelInboundEventContext } from "./run-channel-turn-D-wKbOUy.js";
import { r as resolveChannelInboundRouteEnvelope } from "./envelope-BcRdGSOY.js";
import "./channel-inbound-BQIYtmB7.js";
import { r as channelReadyPatch } from "./gateway-runtime-Bdl1Q2-8.js";
import { d as createDefaultChannelRuntimeState, u as createComputedAccountStatusAdapter } from "./status-helpers-CRFbyFxI.js";
import "./channel-core-CRsxonki.js";
import { s as resolveStableChannelMessageIngress } from "./channel-ingress-runtime-CH0-nCCh.js";
import { t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-CBy-zfTh.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import { t as createChannelReplayGuard } from "./persistent-dedupe-DHEVh0HN.js";
import { a as resolveDefaultBuzzAccountId, c as isConfiguredBuzzChannel, d as parseBuzzTarget, i as resolveBuzzPublicKey, l as looksLikeBuzzTarget, n as listBuzzAccountIds, r as resolveBuzzAccount, s as buildBuzzTarget, t as decodeBuzzPrivateKey, u as normalizeBuzzTarget } from "./types-C5tYJCky.js";
import { a as BuzzConfigSchema, i as startBuzzRoomMembershipNotifications, n as buzzSetupContract, r as discoverBuzzRooms, t as buzzSetupWizard } from "./setup-surface-D9WHxl6x.js";
import { r as finalizeEvent } from "./esm-wjc48qKt.js";
import { n as listBuzzDirectoryPeersFromConfig, t as listBuzzDirectoryGroupsFromConfig } from "./directory-config-CXa477_j.js";
import { a as parseBuzzRoomMembershipEvent, c as parseBuzzAuthTag, i as parseBuzzRoomMembershipChangeEvent, l as openBuzzRelaySubscription, n as BUZZ_ROOM_SYSTEM_KIND, o as connectAuthenticatedBuzzRelay, r as isNewerBuzzRoomMembership, s as connectAuthenticatedBuzzRelaySession, t as BUZZ_ROOM_MEMBERSHIP_KIND } from "./room-membership-skLLXQAv.js";
import { a as formatBuzzMessageForAgent, c as inspectBuzzMentionSyntax, i as buildBuzzMessageTags, l as resolveBuzzMessageMentions, n as BUZZ_INBOUND_MESSAGE_KINDS, o as isBuzzInboundMessageKind, r as BUZZ_TYPING_INDICATOR_KIND, s as parseBuzzMessageEvent, t as BUZZ_DIFF_MESSAGE_KIND } from "./message-event-BkJPnme8.js";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-Bwo0i9o2.js";
const BUZZ_ROOM_METADATA_KIND = 39e3;
const DEFAULT_BUZZ_DIRECTORY_PROFILE_LIMIT = 2e3;
const HEX_PUBLIC_KEY_PATTERN = /^[0-9a-f]{64}$/u;
const MAX_DIRECTORY_NAME_CHARS = 512;
const MAX_DIRECTORY_HANDLE_CHARS = 320;
const MAX_DIRECTORY_URL_CHARS = 4096;
function normalizeBoundedString(value, maxChars) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	return truncateUtf16Safe(trimmed, maxChars);
}
function readPreferredString(params) {
	if (Object.hasOwn(params.content, params.primary)) return normalizeBoundedString(params.content[params.primary], params.maxChars);
	return normalizeBoundedString(params.content[params.fallback], params.maxChars);
}
function isNewerEvent(candidate, current) {
	return !current || candidate.createdAt > current.createdAt || candidate.createdAt === current.createdAt && candidate.eventId < current.eventId;
}
function fallbackPublicKeyLabel(publicKey) {
	return `${publicKey.slice(0, 8)}...${publicKey.slice(-6)}`;
}
function matchesDirectoryQuery(entry, query) {
	if (!query) return true;
	return [
		entry.id,
		entry.name,
		entry.handle
	].some((value) => value?.toLowerCase().includes(query));
}
function applyQueryAndLimit(entries, params) {
	const query = params.query?.trim().toLowerCase() ?? "";
	const limit = typeof params.limit === "number" && params.limit > 0 ? Math.floor(params.limit) : void 0;
	const result = [];
	for (const entry of entries) {
		if (!matchesDirectoryQuery(entry, query)) continue;
		result.push(entry);
		if (limit !== void 0 && result.length >= limit) break;
	}
	return result;
}
function parseBuzzDirectoryProfileEvent(event) {
	const publicKey = event.pubkey.trim().toLowerCase();
	if (event.kind !== 0 || !HEX_PUBLIC_KEY_PATTERN.test(publicKey)) return;
	let content;
	try {
		const parsed = JSON.parse(event.content);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return;
		content = parsed;
	} catch {
		return;
	}
	return {
		publicKey,
		displayName: readPreferredString({
			content,
			primary: "display_name",
			fallback: "name",
			maxChars: MAX_DIRECTORY_NAME_CHARS
		}),
		handle: normalizeBoundedString(content.nip05, MAX_DIRECTORY_HANDLE_CHARS),
		avatarUrl: readPreferredString({
			content,
			primary: "picture",
			fallback: "image",
			maxChars: MAX_DIRECTORY_URL_CHARS
		}),
		createdAt: event.created_at,
		eventId: event.id
	};
}
function parseBuzzDirectoryRoomEvent(event) {
	if (event.kind !== 39e3) return;
	const roomId = event.tags.find((tag) => tag[0] === "d")?.[1]?.trim().toLowerCase();
	if (!roomId) return;
	try {
		parseBuzzTarget(roomId);
	} catch {
		return;
	}
	return {
		roomId,
		name: normalizeBoundedString(event.tags.find((tag) => tag[0] === "name")?.[1], MAX_DIRECTORY_NAME_CHARS),
		archived: event.tags.some((tag) => tag[0] === "archived" && tag[1] === "true"),
		createdAt: event.created_at,
		eventId: event.id
	};
}
var BuzzDirectoryState = class {
	#publicKey;
	#fallbackProfileName;
	#configuredRoomIds;
	#profileLimit;
	#memberships = /* @__PURE__ */ new Map();
	#profilePublicKeys = /* @__PURE__ */ new Set();
	#profiles = /* @__PURE__ */ new Map();
	#rooms = /* @__PURE__ */ new Map();
	constructor(params) {
		this.#publicKey = params.publicKey.trim().toLowerCase();
		this.#fallbackProfileName = params.fallbackProfileName.trim() || "OpenClaw";
		this.#configuredRoomIds = new Set(params.channelIds.map(parseBuzzTarget));
		const requestedProfileLimit = params.profileLimit ?? DEFAULT_BUZZ_DIRECTORY_PROFILE_LIMIT;
		this.#profileLimit = Number.isFinite(requestedProfileLimit) && requestedProfileLimit >= 0 ? Math.floor(requestedProfileLimit) : DEFAULT_BUZZ_DIRECTORY_PROFILE_LIMIT;
		if (this.#profileLimit > 0) this.#profilePublicKeys.add(this.#publicKey);
	}
	replaceMemberships(memberships) {
		const nextMemberships = /* @__PURE__ */ new Map();
		const memberPublicKeys = /* @__PURE__ */ new Set();
		for (const roomId of this.#configuredRoomIds) {
			const membership = memberships.get(roomId);
			if (!membership) continue;
			nextMemberships.set(roomId, membership);
			for (const publicKey of membership.members) memberPublicKeys.add(publicKey);
		}
		memberPublicKeys.delete(this.#publicKey);
		const nextProfilePublicKeys = this.#profileLimit === 0 ? /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set([this.#publicKey, ...[...memberPublicKeys].toSorted().slice(0, this.#profileLimit - 1)]);
		const profileSelectionChanged = nextProfilePublicKeys.size !== this.#profilePublicKeys.size || [...nextProfilePublicKeys].some((publicKey) => !this.#profilePublicKeys.has(publicKey));
		this.#memberships = nextMemberships;
		this.#profilePublicKeys = nextProfilePublicKeys;
		for (const publicKey of this.#profiles.keys()) if (!nextProfilePublicKeys.has(publicKey)) this.#profiles.delete(publicKey);
		return profileSelectionChanged;
	}
	profilePublicKeys() {
		return [...this.#profilePublicKeys];
	}
	activeRoomIds() {
		return [...this.#configuredRoomIds].filter((roomId) => !this.#rooms.get(roomId)?.archived);
	}
	isRoomArchived(roomId) {
		return this.#rooms.get(parseBuzzTarget(roomId))?.archived === true;
	}
	applyProfileEvent(event) {
		const profile = parseBuzzDirectoryProfileEvent(event);
		if (!profile || !this.#profilePublicKeys.has(profile.publicKey) || !isNewerEvent(profile, this.#profiles.get(profile.publicKey))) return false;
		this.#profiles.set(profile.publicKey, profile);
		return true;
	}
	applyRoomEvent(event) {
		const room = parseBuzzDirectoryRoomEvent(event);
		if (!room || !this.#configuredRoomIds.has(room.roomId) || !isNewerEvent(room, this.#rooms.get(room.roomId))) return false;
		this.#rooms.set(room.roomId, room);
		return true;
	}
	resolveSenderName(publicKey) {
		const normalized = publicKey.trim().toLowerCase();
		return this.#profiles.get(normalized)?.displayName ?? fallbackPublicKeyLabel(normalized);
	}
	resolveRoomName(roomId) {
		const normalized = parseBuzzTarget(roomId);
		return this.#rooms.get(normalized)?.name ?? normalized;
	}
	self() {
		return this.#buildUserEntry(this.#publicKey);
	}
	listPeers(params) {
		const peers = /* @__PURE__ */ new Set();
		for (const roomId of this.activeRoomIds()) {
			const membership = this.#memberships.get(roomId);
			if (!membership) continue;
			for (const publicKey of membership.members) if (publicKey !== this.#publicKey) peers.add(publicKey);
		}
		return applyQueryAndLimit([...peers].map((publicKey) => this.#buildUserEntry(publicKey)).toSorted(compareDirectoryEntries), params);
	}
	listGroups(params) {
		return applyQueryAndLimit(this.activeRoomIds().map((roomId) => this.#buildRoomEntry(roomId)).toSorted(compareDirectoryEntries), params);
	}
	listGroupMembers(params) {
		let roomId;
		try {
			roomId = parseBuzzTarget(params.groupId);
		} catch {
			return [];
		}
		if (this.#rooms.get(roomId)?.archived) return [];
		const membership = this.#memberships.get(roomId);
		if (!membership) return [];
		return applyQueryAndLimit([...membership.members].map((publicKey) => {
			const entry = this.#buildUserEntry(publicKey);
			entry.raw = {
				publicKey,
				role: membership.roles.get(publicKey),
				roomId
			};
			return entry;
		}).toSorted(compareDirectoryEntries), { limit: params.limit });
	}
	mentionMembers(roomId) {
		const normalized = parseBuzzTarget(roomId);
		if (this.#rooms.get(normalized)?.archived) return;
		const membership = this.#memberships.get(normalized);
		if (!membership) return;
		return [...membership.members].map((publicKey) => ({
			publicKey,
			displayName: this.#profiles.get(publicKey)?.displayName
		})).toSorted((left, right) => left.publicKey.localeCompare(right.publicKey));
	}
	#buildUserEntry(publicKey) {
		const profile = this.#profiles.get(publicKey);
		return {
			kind: "user",
			id: publicKey,
			name: profile?.displayName ?? (publicKey === this.#publicKey ? this.#fallbackProfileName : fallbackPublicKeyLabel(publicKey)),
			handle: profile?.handle,
			avatarUrl: profile?.avatarUrl,
			raw: { publicKey }
		};
	}
	#buildRoomEntry(roomId) {
		const room = this.#rooms.get(roomId);
		return {
			kind: "group",
			id: buildBuzzTarget(roomId),
			name: room?.name ?? roomId,
			handle: room?.name ? `#${room.name}` : void 0,
			raw: { roomId }
		};
	}
};
function compareDirectoryEntries(a, b) {
	const aLabel = a.name ?? a.handle ?? a.id;
	const bLabel = b.name ?? b.handle ?? b.id;
	return aLabel.localeCompare(bLabel) || a.id.localeCompare(b.id);
}
//#endregion
//#region extensions/buzz/src/directory-relay.ts
const BUZZ_ROOM_QUERY_CHUNK_SIZE = 1e3;
const PROFILE_SUBSCRIPTION_REPLACED_REASON = "directory profile subscription replaced";
const PROFILE_SUBSCRIPTION_FAILED_REASON = "directory profile subscription generation failed";
const DIRECTORY_SHUTDOWN_REASON = "directory shutdown";
const DIRECTORY_QUERY_COMPLETE_REASON = "directory query complete";
const DIRECTORY_QUERY_TIMEOUT_MS = 1e4;
const PROFILE_SUBSCRIPTION_READY_TIMEOUT_MS = 1e4;
function chunkValues(values, size) {
	const chunks = [];
	for (let index = 0; index < values.length; index += size) chunks.push(values.slice(index, index + size));
	return chunks;
}
async function queryBuzzDirectoryBatch(params) {
	params.signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		let settled = false;
		let receivedEose = false;
		const timeout = setTimeout(() => {
			const error = /* @__PURE__ */ new Error("Timed out loading Buzz directory snapshot");
			finish(error);
			if (params.onTimeout) params.onTimeout(error);
			else params.relay.close();
		}, DIRECTORY_QUERY_TIMEOUT_MS);
		const subscriptionRef = {};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			if (receivedEose) subscriptionRef.current?.close(DIRECTORY_QUERY_COMPLETE_REASON);
			if (error === void 0) resolve();
			else reject(error instanceof Error ? error : new Error("Buzz directory query failed", { cause: error }));
		};
		const onAbort = () => finish(params.signal?.reason ?? /* @__PURE__ */ new Error("Buzz directory query aborted"));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		try {
			subscriptionRef.current = openBuzzRelaySubscription(params.relay, [params.filter], {
				onevent: params.onEvent,
				oneose: () => {
					receivedEose = true;
					if (settled) subscriptionRef.current?.close(DIRECTORY_QUERY_COMPLETE_REASON);
					else finish();
				},
				onclose: (reason) => {
					if (reason !== DIRECTORY_QUERY_COMPLETE_REASON) finish(/* @__PURE__ */ new Error(`Buzz directory query closed: ${reason}`));
				}
			});
		} catch (error) {
			finish(error);
			return;
		}
		if (settled && receivedEose) subscriptionRef.current.close(DIRECTORY_QUERY_COMPLETE_REASON);
		if (params.signal?.aborted) onAbort();
	});
}
async function queryBuzzDirectoryProfiles(params) {
	for (const authors of chunkValues(params.publicKeys, 200)) await queryBuzzDirectoryBatch({
		relay: params.relay,
		filter: {
			kinds: [0],
			authors,
			limit: authors.length
		},
		onEvent: (event) => {
			params.state.applyProfileEvent(event);
		},
		onTimeout: params.onTimeout,
		signal: params.signal
	});
}
async function queryBuzzDirectoryRooms(params) {
	for (const roomIds of chunkValues(params.channelIds, BUZZ_ROOM_QUERY_CHUNK_SIZE)) await queryBuzzDirectoryBatch({
		relay: params.relay,
		filter: {
			kinds: [BUZZ_ROOM_METADATA_KIND],
			authors: [params.relayPublicKey],
			"#d": roomIds,
			limit: roomIds.length
		},
		onEvent: (event) => {
			if (event.pubkey.toLowerCase() === params.relayPublicKey && params.state.applyRoomEvent(event)) params.onRoomChanged?.();
		},
		onTimeout: params.onTimeout,
		signal: params.signal
	});
}
function startBuzzDirectoryRelay(params) {
	let closed = false;
	let profileGeneration;
	let queuedProfilePublicKeys;
	const pendingRoomIds = /* @__PURE__ */ new Set();
	let refreshInFlight;
	let fatalErrorReported = false;
	const reportError = (error) => {
		if (closed || params.signal?.aborted) return;
		params.onError?.(error instanceof Error ? error : new Error("Buzz directory refresh failed", { cause: error }));
	};
	const reportFatalError = (error) => {
		if (closed || params.signal?.aborted || fatalErrorReported) return;
		fatalErrorReported = true;
		params.onFatalError?.(error);
		params.relay.close();
	};
	const closeProfileGeneration = (reason, skip) => {
		const current = profileGeneration;
		profileGeneration = void 0;
		if (!current) return;
		if (current.readyTimeout) clearTimeout(current.readyTimeout);
		for (const subscription of current.subscriptions) if (subscription !== skip && !subscription.closed) subscription.close(reason);
	};
	const applyQueuedProfilePublicKeys = () => {
		if (closed || params.signal?.aborted || queuedProfilePublicKeys === void 0 || profileGeneration?.opening || (profileGeneration?.pendingReady ?? 0) > 0) return;
		const publicKeys = queuedProfilePublicKeys;
		queuedProfilePublicKeys = void 0;
		closeProfileGeneration(PROFILE_SUBSCRIPTION_REPLACED_REASON);
		const authorChunks = chunkValues(publicKeys, 200);
		if (authorChunks.length === 0) return;
		const generation = {
			subscriptions: [],
			pendingReady: authorChunks.length,
			opening: true
		};
		generation.readyTimeout = setTimeout(() => {
			if (profileGeneration !== generation || generation.pendingReady === 0) return;
			reportFatalError(/* @__PURE__ */ new Error("Timed out loading Buzz profile subscriptions"));
		}, PROFILE_SUBSCRIPTION_READY_TIMEOUT_MS);
		profileGeneration = generation;
		try {
			for (const authors of authorChunks) {
				let ready = false;
				const markReady = () => {
					if (ready || profileGeneration !== generation) return;
					ready = true;
					generation.pendingReady -= 1;
					if (generation.pendingReady === 0 && generation.readyTimeout) {
						clearTimeout(generation.readyTimeout);
						generation.readyTimeout = void 0;
					}
					if (!generation.opening && generation.pendingReady === 0) applyQueuedProfilePublicKeys();
				};
				const subscription = openBuzzRelaySubscription(params.relay, [{
					kinds: [0],
					authors,
					limit: authors.length
				}], {
					onevent: (event) => {
						params.state.applyProfileEvent(event);
					},
					oneose: markReady,
					onclose: (reason) => {
						if (profileGeneration === generation) {
							queuedProfilePublicKeys = void 0;
							if (reason === "relay connection closed by us") {
								if (generation.readyTimeout) clearTimeout(generation.readyTimeout);
								profileGeneration = void 0;
							} else closeProfileGeneration(PROFILE_SUBSCRIPTION_FAILED_REASON, subscription);
						}
						if (reason !== PROFILE_SUBSCRIPTION_REPLACED_REASON && reason !== PROFILE_SUBSCRIPTION_FAILED_REASON && reason !== DIRECTORY_SHUTDOWN_REASON && reason !== "relay connection closed by us") reportError(/* @__PURE__ */ new Error(`Buzz profile subscription closed: ${reason}`));
					}
				});
				generation.subscriptions.push(subscription);
			}
		} catch (error) {
			if (profileGeneration === generation) closeProfileGeneration(PROFILE_SUBSCRIPTION_REPLACED_REASON);
			reportError(error);
			return;
		}
		generation.opening = false;
		if (generation.pendingReady === 0) applyQueuedProfilePublicKeys();
	};
	const replaceProfilePublicKeys = (publicKeys) => {
		if (closed || params.signal?.aborted) return;
		queuedProfilePublicKeys = publicKeys.slice();
		applyQueuedProfilePublicKeys();
	};
	const refreshRooms = (channelIds) => {
		if (closed || params.signal?.aborted) return Promise.resolve();
		for (const channelId of channelIds) pendingRoomIds.add(channelId);
		if (refreshInFlight) return refreshInFlight;
		refreshInFlight = (async () => {
			while (pendingRoomIds.size > 0) {
				if (closed || params.signal?.aborted) {
					pendingRoomIds.clear();
					return;
				}
				const nextRoomIds = [...pendingRoomIds];
				pendingRoomIds.clear();
				await queryBuzzDirectoryRooms({
					relay: params.relay,
					relayPublicKey: params.relayPublicKey,
					state: params.state,
					channelIds: nextRoomIds,
					onRoomChanged: params.onRoomChanged,
					onTimeout: reportFatalError,
					signal: params.signal
				});
				const changedRoomId = nextRoomIds.find((channelId) => params.subscribedRoomIds?.has(channelId) === params.state.isRoomArchived(channelId));
				if (changedRoomId) {
					reportFatalError(/* @__PURE__ */ new Error(`Buzz room ${changedRoomId} archive status changed; rebuilding subscriptions`));
					return;
				}
			}
		})().finally(() => {
			refreshInFlight = void 0;
		});
		return refreshInFlight;
	};
	return {
		replaceProfilePublicKeys,
		refreshRooms,
		close: () => {
			closed = true;
			queuedProfilePublicKeys = void 0;
			closeProfileGeneration(DIRECTORY_SHUTDOWN_REASON);
			pendingRoomIds.clear();
		}
	};
}
//#endregion
//#region extensions/buzz/src/profile.ts
const PROFILE_KIND = 0;
const AGENT_PROFILE_KIND = 10100;
const DEFAULT_CHANNEL_ADD_POLICY = "anyone";
const CHANNEL_ADD_POLICIES = /* @__PURE__ */ new Set([
	"anyone",
	"owner_only",
	"nobody"
]);
const PROFILE_QUERY_TIMEOUT_MS = 1e4;
function parseProfileContent(event) {
	if (!event) return {};
	try {
		const parsed = JSON.parse(event.content);
		return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? { ...parsed } : {};
	} catch {
		return {};
	}
}
function resolveProfileTags(event, authTag) {
	const existingTags = event?.tags ?? [];
	if (!authTag) return existingTags.map((tag) => tag.slice());
	return [...existingTags.filter((tag) => tag[0] !== "auth").map((tag) => tag.slice()), [...authTag]];
}
function hasConfiguredAuthTag(event, authTag) {
	if (!authTag) return true;
	const authTags = event?.tags.filter((tag) => tag[0] === "auth") ?? [];
	return authTags.length === 1 && JSON.stringify(authTags[0]) === JSON.stringify(authTag);
}
function readNonEmptyString(content, key) {
	const value = content[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
async function queryCurrentProfiles(params) {
	params.signal?.throwIfAborted();
	return await new Promise((resolve, reject) => {
		const latestByKind = /* @__PURE__ */ new Map();
		const state = {
			settled: false,
			receivedEose: false
		};
		const timeout = setTimeout(() => {
			const error = /* @__PURE__ */ new Error("Timed out loading current Buzz profile");
			finish(error);
			params.onTimeout?.(error);
			params.relay.close();
		}, PROFILE_QUERY_TIMEOUT_MS);
		const finish = (error) => {
			if (state.settled) return;
			state.settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			if (state.receivedEose) state.subscription?.close("profile query complete");
			if (error !== void 0) {
				reject(error instanceof Error ? error : new Error("Buzz profile query failed", { cause: error }));
				return;
			}
			resolve(latestByKind);
		};
		const onAbort = () => finish(params.signal?.reason ?? /* @__PURE__ */ new Error("Buzz profile query aborted"));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		state.subscription = openBuzzRelaySubscription(params.relay, [{
			kinds: [PROFILE_KIND],
			authors: [params.publicKey],
			limit: 1
		}, {
			kinds: [AGENT_PROFILE_KIND],
			authors: [params.publicKey],
			limit: 1
		}], {
			onevent: (event) => {
				const current = latestByKind.get(event.kind);
				if (!current || event.created_at > current.created_at) latestByKind.set(event.kind, event);
			},
			oneose: () => {
				state.receivedEose = true;
				if (state.settled) state.subscription?.close("profile query complete");
				else finish();
			},
			onclose: (reason) => {
				if (reason !== "profile query complete") finish(/* @__PURE__ */ new Error(`Buzz profile query closed: ${reason}`));
			}
		});
		if (state.settled && state.receivedEose) state.subscription.close("profile query complete");
	});
}
function buildProfileEvent(params) {
	const now = Math.floor(Date.now() / 1e3);
	return finalizeEvent({
		kind: params.kind,
		content: JSON.stringify(params.content),
		created_at: params.current ? Math.max(now, params.current.created_at + 1) : now,
		tags: params.tags
	}, params.secretKey);
}
async function syncBuzzProfile(params) {
	const displayName = params.displayName.trim();
	if (!displayName) return { status: "unchanged" };
	const currentProfiles = await queryCurrentProfiles({
		...params,
		onTimeout: params.onFatalError
	});
	const currentMetadata = currentProfiles.get(PROFILE_KIND);
	const currentAgentProfile = currentProfiles.get(AGENT_PROFILE_KIND);
	const metadataContent = parseProfileContent(currentMetadata);
	const agentContent = parseProfileContent(currentAgentProfile);
	const resolvedDisplayName = readNonEmptyString(metadataContent, "display_name") ?? readNonEmptyString(agentContent, "display_name") ?? readNonEmptyString(agentContent, "name") ?? displayName;
	const events = [];
	if (metadataContent.display_name !== resolvedDisplayName || !hasConfiguredAuthTag(currentMetadata, params.authTag)) {
		metadataContent.display_name = resolvedDisplayName;
		events.push(buildProfileEvent({
			kind: PROFILE_KIND,
			content: metadataContent,
			current: currentMetadata,
			tags: resolveProfileTags(currentMetadata, params.authTag),
			secretKey: params.secretKey
		}));
	}
	let agentProfileChanged = false;
	if (!readNonEmptyString(agentContent, "name")) {
		agentContent.name = resolvedDisplayName;
		agentProfileChanged = true;
	}
	if (!readNonEmptyString(agentContent, "display_name")) {
		agentContent.display_name = resolvedDisplayName;
		agentProfileChanged = true;
	}
	if (typeof agentContent.channel_add_policy !== "string" || !CHANNEL_ADD_POLICIES.has(agentContent.channel_add_policy)) {
		agentContent.channel_add_policy = DEFAULT_CHANNEL_ADD_POLICY;
		agentProfileChanged = true;
	}
	if (agentProfileChanged) events.push(buildProfileEvent({
		kind: AGENT_PROFILE_KIND,
		content: agentContent,
		current: currentAgentProfile,
		tags: currentAgentProfile?.tags.map((tag) => tag.slice()) ?? [],
		secretKey: params.secretKey
	}));
	if (events.length === 0) return { status: "unchanged" };
	for (const event of events) await params.relay.publish(event);
	const lastEvent = events.at(-1);
	return lastEvent ? {
		status: "published",
		eventId: lastEvent.id
	} : { status: "unchanged" };
}
//#endregion
//#region extensions/buzz/src/replay-dispatch.ts
const REPLAY_DISPATCH_CONCURRENCY = 8;
const BUZZ_REPLAY_DISPATCH_MAX_PENDING = 1024;
const REPLAY_HISTORY_MAX_PER_ROOM = 100;
function createBuzzReplayDispatchQueue(params) {
	const pending = [];
	let pendingHead = 0;
	let active = 0;
	let closed = false;
	let resolveDrained;
	const drained = new Promise((resolve) => {
		resolveDrained = resolve;
	});
	const settleDrained = () => {
		if (closed && active === 0) {
			resolveDrained?.();
			resolveDrained = void 0;
		}
	};
	let reserved = 0;
	const reservationWaiters = [];
	const availableCapacity = () => BUZZ_REPLAY_DISPATCH_MAX_PENDING - (pending.length - pendingHead) - reserved;
	const compactPending = () => {
		if (pendingHead > 256 && pendingHead * 2 >= pending.length) {
			pending.splice(0, pendingHead);
			pendingHead = 0;
		}
	};
	const drain = () => {
		if (closed) return;
		const startCount = Math.min(REPLAY_DISPATCH_CONCURRENCY - active, pending.length - pendingHead);
		for (let index = 0; index < startCount; index += 1) {
			const task = pending[pendingHead];
			pendingHead += 1;
			compactPending();
			if (!task) continue;
			active += 1;
			Promise.resolve().then(task).catch(params.onTaskError).finally(() => {
				active -= 1;
				settleDrained();
				drain();
			});
		}
		settleReservationWaiters();
	};
	const enqueueTask = (task) => {
		if (closed) return "closed";
		if (active < REPLAY_DISPATCH_CONCURRENCY) {
			pending.push(task);
			drain();
			return "accepted";
		}
		if (availableCapacity() <= 0) return "overflow";
		pending.push(task);
		return "accepted";
	};
	const createReservation = (slots) => {
		let remaining = slots;
		reserved += slots;
		return {
			enqueue(task) {
				if (closed) return "closed";
				if (remaining === 0) return "overflow";
				remaining -= 1;
				reserved -= 1;
				pending.push(task);
				drain();
				return "accepted";
			},
			release() {
				reserved -= remaining;
				remaining = 0;
				settleReservationWaiters();
			}
		};
	};
	const settleReservationWaiters = () => {
		while (reservationWaiters.length > 0) {
			const waiter = reservationWaiters[0];
			if (!waiter) {
				reservationWaiters.shift();
				continue;
			}
			if (closed) {
				reservationWaiters.shift();
				waiter.resolve(void 0);
				continue;
			}
			if (availableCapacity() < waiter.slots) return;
			reservationWaiters.shift();
			waiter.resolve(createReservation(waiter.slots));
		}
	};
	return {
		enqueue: enqueueTask,
		async reserveCapacity(slots) {
			if (closed) return;
			if (reservationWaiters.length === 0 && availableCapacity() >= slots) return createReservation(slots);
			return await new Promise((resolve) => {
				reservationWaiters.push({
					slots,
					resolve
				});
			});
		},
		async close() {
			closed = true;
			pending.length = 0;
			pendingHead = 0;
			settleReservationWaiters();
			settleDrained();
			await drained;
		}
	};
}
function resolveBuzzRoomHistoryLimit(roomCount) {
	return Math.min(REPLAY_HISTORY_MAX_PER_ROOM, Math.max(1, Math.floor(1032 / Math.max(1, roomCount))));
}
//#endregion
//#region extensions/buzz/src/room-membership-query.ts
const RELAY_QUERY_EVENT_LIMIT = 1e3;
const MEMBERSHIP_QUERY_COMPLETE_REASON = "membership snapshot loaded";
const MEMBERSHIP_QUERY_TIMEOUT_MS = 1e4;
async function queryBuzzRoomMembershipBatch(params) {
	const configuredRooms = new Set(params.channelIds);
	const memberships = /* @__PURE__ */ new Map();
	return await new Promise((resolve, reject) => {
		let settled = false;
		let receivedEose = false;
		const timeout = setTimeout(() => {
			finish(/* @__PURE__ */ new Error("Timed out loading Buzz room membership snapshot"));
			params.relay.close();
		}, MEMBERSHIP_QUERY_TIMEOUT_MS);
		const subscriptionRef = {};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			if (receivedEose) subscriptionRef.current?.close(MEMBERSHIP_QUERY_COMPLETE_REASON);
			if (error === void 0) resolve(memberships);
			else reject(error instanceof Error ? error : new Error("Buzz room membership query failed", { cause: error }));
		};
		const onAbort = () => finish(params.signal?.reason ?? /* @__PURE__ */ new Error("Buzz room membership query aborted"));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		try {
			subscriptionRef.current = openBuzzRelaySubscription(params.relay, [{
				kinds: [BUZZ_ROOM_MEMBERSHIP_KIND],
				authors: [params.relayPublicKey],
				"#d": params.channelIds,
				limit: params.channelIds.length
			}], {
				onevent: (event) => {
					const membership = parseBuzzRoomMembershipEvent(event, params.relayPublicKey);
					if (!membership || !configuredRooms.has(membership.roomId) || !isNewerBuzzRoomMembership(membership, memberships.get(membership.roomId))) return;
					memberships.set(membership.roomId, membership);
				},
				oneose: () => {
					receivedEose = true;
					if (settled) subscriptionRef.current?.close(MEMBERSHIP_QUERY_COMPLETE_REASON);
					else finish();
				},
				onclose: (reason) => {
					if (reason !== MEMBERSHIP_QUERY_COMPLETE_REASON) finish(/* @__PURE__ */ new Error(`Buzz room membership query closed: ${reason}`));
				}
			});
		} catch (error) {
			finish(error);
			return;
		}
		if (settled && receivedEose) subscriptionRef.current.close(MEMBERSHIP_QUERY_COMPLETE_REASON);
		if (params.signal?.aborted) onAbort();
	});
}
async function queryBuzzRoomMemberships(params) {
	const memberships = /* @__PURE__ */ new Map();
	for (let index = 0; index < params.channelIds.length; index += RELAY_QUERY_EVENT_LIMIT) {
		const batch = await queryBuzzRoomMembershipBatch({
			...params,
			channelIds: params.channelIds.slice(index, index + RELAY_QUERY_EVENT_LIMIT)
		});
		for (const [roomId, membership] of batch) if (isNewerBuzzRoomMembership(membership, memberships.get(roomId))) memberships.set(roomId, membership);
	}
	return memberships;
}
//#endregion
//#region extensions/buzz/src/history-catchup.ts
const HISTORY_PAGE_TIMEOUT_MS = 1e4;
const HISTORY_PAGE_COMPLETE_REASON = "buzz room history page loaded";
async function queryBuzzRoomHistoryPage(params) {
	const events = [];
	let overLimit = false;
	return await new Promise((resolve, reject) => {
		let settled = false;
		let receivedEose = false;
		const timeout = setTimeout(() => {
			const error = /* @__PURE__ */ new Error(`Timed out loading Buzz room history for ${params.channelId}`);
			finish(error);
			params.relay.close();
		}, HISTORY_PAGE_TIMEOUT_MS);
		const subscriptionRef = {};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", onAbort);
			if (receivedEose) subscriptionRef.current?.close(HISTORY_PAGE_COMPLETE_REASON);
			if (error === void 0) resolve({
				events,
				overLimit
			});
			else reject(error instanceof Error ? error : new Error("Buzz room history query failed", { cause: error }));
		};
		const onAbort = () => finish(params.signal?.reason ?? /* @__PURE__ */ new Error("Buzz room history query aborted"));
		params.signal?.addEventListener("abort", onAbort, { once: true });
		try {
			subscriptionRef.current = openBuzzRelaySubscription(params.relay, [{
				kinds: [...BUZZ_INBOUND_MESSAGE_KINDS],
				"#h": [params.channelId],
				since: params.since,
				until: params.until,
				...params.requestLimit === void 0 ? {} : { limit: params.requestLimit }
			}], {
				onevent: (event) => {
					if (params.skipEventIds?.has(event.id)) return;
					if (events.length < params.maxEvents) events.push(event);
					else overLimit = true;
				},
				oneose: () => {
					receivedEose = true;
					if (settled) subscriptionRef.current?.close(HISTORY_PAGE_COMPLETE_REASON);
					else finish();
				},
				onclose: (reason) => {
					if (reason !== HISTORY_PAGE_COMPLETE_REASON) finish(/* @__PURE__ */ new Error(`Buzz room history query closed for ${params.channelId}: ${reason}`));
				}
			});
		} catch (error) {
			finish(error);
			return;
		}
		if (settled && receivedEose) subscriptionRef.current.close(HISTORY_PAGE_COMPLETE_REASON);
		if (params.signal?.aborted) onAbort();
	});
}
async function drainBuzzRoomHistoryRange(params) {
	if (params.signal?.aborted) return "aborted";
	const page = await queryBuzzRoomHistoryPage({
		relay: params.relay,
		channelId: params.channelId,
		since: params.since,
		until: params.until,
		maxEvents: BUZZ_REPLAY_DISPATCH_MAX_PENDING,
		skipEventIds: params.skipEventIds,
		signal: params.signal
	});
	if (!page.overLimit) {
		if (page.events.length === 0) return "complete";
		const reservation = await params.reserveCapacity(page.events.length);
		if (!reservation) return "aborted";
		try {
			for (const event of page.events) params.onEvent(event, reservation);
		} finally {
			reservation.release();
		}
		return "complete";
	}
	if (params.since === params.until) {
		const reservation = await params.reserveCapacity(page.events.length);
		if (!reservation) return "aborted";
		try {
			for (const event of page.events) params.onEvent(event, reservation);
		} finally {
			reservation.release();
		}
		return "timestamp-over-limit";
	}
	const midpoint = Math.floor((params.since + params.until) / 2);
	const newer = await drainBuzzRoomHistoryRange({
		...params,
		since: midpoint + 1
	});
	if (newer !== "complete") return newer;
	return await drainBuzzRoomHistoryRange({
		...params,
		until: midpoint
	});
}
async function catchUpBuzzRoomHistory(params) {
	let until = params.until;
	while (!params.signal?.aborted) {
		const reservation = await params.reserveCapacity(params.limit);
		if (!reservation) return "aborted";
		let page;
		try {
			page = await queryBuzzRoomHistoryPage({
				relay: params.relay,
				channelId: params.channelId,
				since: params.since,
				until,
				requestLimit: params.limit,
				maxEvents: params.limit,
				signal: params.signal
			});
			if (page.events.length === 0) return "complete";
			for (const event of page.events) params.onEvent(event, reservation);
		} finally {
			reservation.release();
		}
		let oldest = until;
		for (const event of page.events) oldest = Math.min(oldest, event.created_at);
		const skipEventIds = new Set(page.events.map((event) => event.id));
		if (page.overLimit) return await drainBuzzRoomHistoryRange({
			relay: params.relay,
			channelId: params.channelId,
			since: params.since,
			until,
			skipEventIds,
			reserveCapacity: params.reserveCapacity,
			onEvent: params.onEvent,
			signal: params.signal
		});
		if (page.events.length < params.limit) return "complete";
		if (oldest >= until) {
			const outcome = await drainBuzzRoomHistoryRange({
				relay: params.relay,
				channelId: params.channelId,
				since: until,
				until,
				skipEventIds,
				reserveCapacity: params.reserveCapacity,
				onEvent: params.onEvent,
				signal: params.signal
			});
			if (outcome !== "complete") return outcome;
			if (until <= params.since) return "complete";
			until -= 1;
			continue;
		}
		until = oldest;
	}
	return "aborted";
}
//#endregion
//#region extensions/buzz/src/room-membership-tracker.ts
const MEMBERSHIP_READY_TIMEOUT_MS = 1e4;
const MEMBERSHIP_TRACKER_SETUP_CLOSE_REASON = "membership tracker setup failed";
const BUZZ_ROOM_METADATA_EDIT_KIND = 9002;
const MEMBERSHIP_REFRESH_DELAYS_MS = [
	100,
	500,
	1500,
	3e3
];
const MEMBERSHIP_EVENT_CACHE_MAX_ENTRIES = 1e4;
async function sleepWithSignal(delayMs, signal) {
	signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
			if (error === void 0) resolve();
			else reject(error instanceof Error ? error : new Error("Buzz room membership refresh failed", { cause: error }));
		};
		const onAbort = () => finish(signal?.reason ?? /* @__PURE__ */ new Error("Buzz room membership refresh aborted"));
		const timer = setTimeout(() => finish(), delayMs);
		signal?.addEventListener("abort", onAbort, { once: true });
		if (signal?.aborted) onAbort();
	});
}
async function createBuzzRoomMembershipTracker(params) {
	const historicalRooms = /* @__PURE__ */ new Set();
	const historyPages = /* @__PURE__ */ new Map();
	const seenEventIds = /* @__PURE__ */ new Map();
	const blockedRooms = /* @__PURE__ */ new Set();
	const deniedMembers = /* @__PURE__ */ new Map();
	const pendingMemberships = /* @__PURE__ */ new Map();
	const refreshes = /* @__PURE__ */ new Map();
	let membershipQueryTail = Promise.resolve();
	const memberships = await queryBuzzRoomMemberships(params);
	const effectiveMemberships = () => {
		if (blockedRooms.size === 0 && deniedMembers.size === 0) return memberships;
		const effective = /* @__PURE__ */ new Map();
		for (const [channelId, membership] of memberships) {
			if (blockedRooms.has(channelId)) continue;
			const denied = deniedMembers.get(channelId);
			if (!denied || denied.size === 0) {
				effective.set(channelId, membership);
				continue;
			}
			effective.set(channelId, {
				...membership,
				members: new Set([...membership.members].filter((publicKey) => !denied.has(publicKey))),
				roles: new Map([...membership.roles].filter(([publicKey]) => !denied.has(publicKey)))
			});
		}
		return effective;
	};
	const isMember = (channelId, publicKey) => !blockedRooms.has(channelId) && !deniedMembers.get(channelId)?.has(publicKey.trim().toLowerCase()) && memberships.get(channelId)?.members.has(publicKey.trim().toLowerCase()) === true;
	const markSystemEventSeen = (eventId) => {
		if (seenEventIds.has(eventId)) return false;
		seenEventIds.set(eventId, true);
		if (seenEventIds.size > MEMBERSHIP_EVENT_CACHE_MAX_ENTRIES) {
			const oldestEventId = seenEventIds.keys().next().value;
			if (oldestEventId) seenEventIds.delete(oldestEventId);
		}
		return true;
	};
	const reportSystemEventError = (error) => {
		if (params.signal?.aborted) return;
		params.onFatalError?.(error instanceof Error ? error : new Error(String(error)));
		params.relay.close();
	};
	const queryMembership = (channelId) => {
		const query = membershipQueryTail.then(async () => (await queryBuzzRoomMemberships({
			relay: params.relay,
			relayPublicKey: params.relayPublicKey,
			channelIds: [channelId],
			signal: params.signal
		})).get(channelId));
		membershipQueryTail = query.then(() => void 0, () => void 0);
		return query;
	};
	const refreshMembership = async (channelId, state) => {
		const baseline = memberships.get(channelId);
		if (!baseline) throw new Error(`Missing Buzz room membership for ${channelId}`);
		for (const delayMs of MEMBERSHIP_REFRESH_DELAYS_MS) {
			const generation = state.generation;
			state.lastAttemptedGeneration = generation;
			await sleepWithSignal(delayMs, params.signal);
			if (state.generation !== generation) continue;
			let refreshed;
			try {
				refreshed = await queryMembership(channelId);
			} catch (error) {
				if (params.signal?.aborted) throw error;
				continue;
			}
			if (state.generation !== generation || !refreshed) continue;
			const pending = pendingMemberships.get(channelId);
			const pendingMatches = !pending || [...pending].every(([publicKey, expected]) => refreshed.members.has(publicKey) === (expected === "present"));
			const botMembershipChanged = pending?.has(params.botPublicKey) === true;
			if (!pendingMatches || botMembershipChanged && !isNewerBuzzRoomMembership(refreshed, baseline)) continue;
			if (refreshed.roles.get(params.botPublicKey) !== "bot" || !refreshed.members.has(params.botPublicKey)) {
				blockedRooms.add(channelId);
				throw new Error(`Buzz bot no longer has the Bot role in room ${channelId}`);
			}
			memberships.set(channelId, refreshed);
			pendingMemberships.delete(channelId);
			deniedMembers.delete(channelId);
			blockedRooms.delete(channelId);
			params.onMembershipsChanged?.(effectiveMemberships());
			return;
		}
		if (state.generation !== state.lastAttemptedGeneration) return;
		blockedRooms.add(channelId);
		throw new Error(`Could not refresh Buzz room membership for ${channelId}`);
	};
	const refreshMembershipOnce = (channelId) => {
		const current = refreshes.get(channelId);
		if (current) {
			current.generation += 1;
			return current.promise;
		}
		const state = {
			generation: 1,
			lastAttemptedGeneration: 0,
			promise: Promise.resolve()
		};
		state.promise = refreshMembership(channelId, state).finally(() => {
			if (refreshes.get(channelId) === state) refreshes.delete(channelId);
			if (state.generation !== state.lastAttemptedGeneration && pendingMemberships.has(channelId) && !params.signal?.aborted) refreshMembershipOnce(channelId).catch(reportSystemEventError);
		});
		refreshes.set(channelId, state);
		return state.promise;
	};
	const handleSystemEvent = (event) => {
		if (!markSystemEventSeen(event.id)) return;
		const channelId = event.tags.find((tag) => tag[0] === "h")?.[1]?.trim().toLowerCase();
		if (!channelId) return;
		if (event.kind === BUZZ_ROOM_METADATA_EDIT_KIND) {
			params.onRoomMetadataChanged?.(channelId);
			return;
		}
		const membership = memberships.get(channelId);
		if (!membership) return;
		const change = parseBuzzRoomMembershipChangeEvent(event, membership);
		if (!change) return;
		const expected = change.type === "member_joined" ? "present" : "absent";
		const pending = pendingMemberships.get(channelId) ?? /* @__PURE__ */ new Map();
		pending.set(change.targetPublicKey, expected);
		pendingMemberships.set(channelId, pending);
		if (expected === "absent") {
			const denied = deniedMembers.get(channelId) ?? /* @__PURE__ */ new Set();
			denied.add(change.targetPublicKey);
			deniedMembers.set(channelId, denied);
		}
		if (change.targetPublicKey === params.botPublicKey) blockedRooms.add(channelId);
		params.onMembershipsChanged?.(effectiveMemberships());
		return refreshMembershipOnce(channelId);
	};
	const handleRoomEvent = (event, reservation) => {
		if (isBuzzInboundMessageKind(event.kind)) {
			params.onMessageEvent(event, isMember, reservation);
			return;
		}
		handleSystemEvent(event)?.catch(reportSystemEventError);
	};
	for (const channelId of params.channelIds) if (memberships.get(channelId)?.roles.get(params.botPublicKey) !== "bot") throw new Error(`Buzz bot does not have the Bot role in configured room ${channelId}`);
	let resolveHistorical;
	let rejectHistorical;
	const historicalReady = new Promise((resolve, reject) => {
		resolveHistorical = resolve;
		rejectHistorical = reject;
	});
	const historicalTimeout = setTimeout(() => {
		rejectHistorical?.(/* @__PURE__ */ new Error("Timed out loading Buzz room membership changes"));
		params.relay.close();
	}, MEMBERSHIP_READY_TIMEOUT_MS);
	const subscriptions = [];
	try {
		for (const channelId of params.channelIds) subscriptions.push(openBuzzRelaySubscription(params.relay, [{
			kinds: [BUZZ_ROOM_SYSTEM_KIND, BUZZ_ROOM_METADATA_EDIT_KIND],
			"#h": [channelId],
			since: params.since
		}, {
			kinds: [...BUZZ_INBOUND_MESSAGE_KINDS],
			"#h": [channelId],
			since: params.messageSince,
			limit: params.messageLimit
		}], {
			onevent: (event) => {
				if (!historicalRooms.has(channelId) && isBuzzInboundMessageKind(event.kind)) {
					const page = historyPages.get(channelId);
					if (page) {
						page.count += 1;
						page.oldest = Math.min(page.oldest, event.created_at);
					} else historyPages.set(channelId, {
						count: 1,
						oldest: event.created_at
					});
				}
				handleRoomEvent(event);
			},
			oneose: () => {
				historicalRooms.add(channelId);
				if (historicalRooms.size === params.channelIds.length) resolveHistorical?.();
			},
			onclose: (reason) => {
				if (!historicalRooms.has(channelId)) rejectHistorical?.(/* @__PURE__ */ new Error(`Buzz membership subscription closed for ${channelId}: ${reason}`));
				else if (reason !== "shutdown" && reason !== "relay connection closed by us" && reason !== MEMBERSHIP_TRACKER_SETUP_CLOSE_REASON && !params.signal?.aborted) params.onFatalError?.(/* @__PURE__ */ new Error(`Buzz membership subscription closed for ${channelId}: ${reason}`));
			}
		}));
		await historicalReady;
	} catch (error) {
		if (params.relay.connected) {
			for (const subscription of subscriptions) if (!subscription.closed) subscription.close(MEMBERSHIP_TRACKER_SETUP_CLOSE_REASON);
		}
		throw error;
	} finally {
		clearTimeout(historicalTimeout);
	}
	return {
		memberships: effectiveMemberships,
		catchUpHistory: async () => {
			for (const channelId of params.channelIds) {
				const page = historyPages.get(channelId);
				if (params.signal?.aborted) return;
				if (!page || page.count < params.messageLimit) continue;
				try {
					if (await catchUpBuzzRoomHistory({
						relay: params.relay,
						channelId,
						since: params.messageSince,
						until: page.oldest,
						limit: params.messageLimit,
						reserveCapacity: params.reserveDispatchCapacity,
						onEvent: handleRoomEvent,
						signal: params.signal
					}) === "timestamp-over-limit") params.onHistoryError?.(/* @__PURE__ */ new Error(`Buzz room ${channelId} kept more than ${BUZZ_REPLAY_DISPATCH_MAX_PENDING} additional messages at one timestamp; older history was not recovered`));
				} catch (error) {
					if (params.signal?.aborted) return;
					reportSystemEventError(error instanceof Error ? error : new Error(`Buzz room history recovery failed for ${channelId}`, { cause: error }));
					return;
				}
			}
		}
	};
}
//#endregion
//#region extensions/buzz/src/subscription-budget.ts
const BUZZ_RELAY_MAX_SUBSCRIPTIONS = 1024;
const BUZZ_RELAY_NON_ROOM_PROFILE_SUBSCRIPTION_RESERVE = 4;
const BUZZ_DIRECTORY_MAX_PROFILE_SUBSCRIPTIONS = 10;
function resolveBuzzSubscriptionBudget(roomCount) {
	if (!Number.isSafeInteger(roomCount) || roomCount < 0) throw new Error("Buzz configured room count must be a non-negative integer");
	const availableProfileSubscriptions = BUZZ_RELAY_MAX_SUBSCRIPTIONS - BUZZ_RELAY_NON_ROOM_PROFILE_SUBSCRIPTION_RESERVE - roomCount;
	if (availableProfileSubscriptions < 0) throw new Error(`Buzz supports at most ${BUZZ_RELAY_MAX_SUBSCRIPTIONS - BUZZ_RELAY_NON_ROOM_PROFILE_SUBSCRIPTION_RESERVE} configured rooms per account`);
	return { profileLimit: Math.min(BUZZ_DIRECTORY_MAX_PROFILE_SUBSCRIPTIONS, availableProfileSubscriptions) * 200 };
}
//#endregion
//#region extensions/buzz/src/buzz-bus.ts
const PRESENCE_KIND = 20001;
const PRESENCE_HEARTBEAT_INTERVAL_MS = 3e4;
const REPLAY_TTL_MS = 720 * 60 * 60 * 1e3;
const REPLAY_MAX_ENTRIES = 1e4;
const REPLAY_STATE_MAX_ENTRIES = 5e4;
const REPLAY_NAMESPACE_PREFIX = "buzz.inbound-dedupe";
function buildBuzzTextEvent(params) {
	return finalizeEvent({
		kind: 9,
		content: params.text,
		created_at: Math.floor(Date.now() / 1e3),
		tags: buildBuzzMessageTags(params)
	}, params.secretKey);
}
function buildBuzzTypingEvent(params) {
	return finalizeEvent({
		kind: BUZZ_TYPING_INDICATOR_KIND,
		content: "",
		created_at: Math.floor(Date.now() / 1e3),
		tags: buildBuzzMessageTags(params)
	}, params.secretKey);
}
function buildBuzzPresenceEvent(secretKey) {
	return finalizeEvent({
		kind: PRESENCE_KIND,
		content: "online",
		created_at: Math.floor(Date.now() / 1e3),
		tags: []
	}, secretKey);
}
function startBuzzPresenceHeartbeat(params) {
	let stopped = false;
	let publishInFlight = false;
	let errorReported = false;
	const publishOnline = async () => {
		if (stopped || publishInFlight) return;
		publishInFlight = true;
		try {
			await params.relay.publish(buildBuzzPresenceEvent(params.secretKey));
			errorReported = false;
		} catch (error) {
			if (!stopped && !errorReported) {
				errorReported = true;
				params.onError?.(error instanceof Error ? error : new Error("Buzz presence heartbeat failed", { cause: error }));
			}
		} finally {
			publishInFlight = false;
		}
	};
	publishOnline();
	const timer = setInterval(() => {
		publishOnline();
	}, PRESENCE_HEARTBEAT_INTERVAL_MS);
	timer.unref?.();
	return () => {
		stopped = true;
		clearInterval(timer);
	};
}
async function sendBuzzTextOneShot(params) {
	const secretKey = decodeBuzzPrivateKey(params.privateKey);
	const mentionSyntax = inspectBuzzMentionSyntax(params.text);
	if (mentionSyntax.hasAtMention || mentionSyntax.hasExplicitIdentity) {
		const signal = AbortSignal.timeout(3e4);
		const publicKey = resolveBuzzPublicKey(params.privateKey);
		const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
			relayUrl: params.relayUrl,
			secretKey,
			authTag: parseBuzzAuthTag(params.authTag ?? ""),
			signal
		});
		try {
			const directory = new BuzzDirectoryState({
				publicKey,
				fallbackProfileName: "OpenClaw",
				channelIds: [params.channelId]
			});
			directory.replaceMemberships(await queryBuzzRoomMemberships({
				relay,
				relayPublicKey,
				channelIds: [params.channelId],
				signal
			}));
			if (mentionSyntax.hasAtMention) await queryBuzzDirectoryProfiles({
				relay,
				state: directory,
				publicKeys: directory.profilePublicKeys(),
				signal
			});
			const mentionedPubkeys = resolveBuzzMessageMentions({
				text: params.text,
				members: directory.mentionMembers(params.channelId),
				senderPublicKey: publicKey
			});
			const event = buildBuzzTextEvent({
				...params,
				secretKey,
				mentionedPubkeys
			});
			await relay.publish(event);
			return event.id;
		} finally {
			relay.close();
		}
	}
	const relay = await connectAuthenticatedBuzzRelay({
		relayUrl: params.relayUrl,
		secretKey,
		authTag: parseBuzzAuthTag(params.authTag ?? "")
	});
	try {
		const event = buildBuzzTextEvent({
			...params,
			secretKey
		});
		await relay.publish(event);
		return event.id;
	} finally {
		relay.close();
	}
}
async function startBuzzBus(options) {
	const subscriptionBudget = resolveBuzzSubscriptionBudget(options.channelIds.length);
	const secretKey = decodeBuzzPrivateKey(options.privateKey);
	const publicKey = resolveBuzzPublicKey(options.privateKey);
	const authTag = parseBuzzAuthTag(options.authTag ?? "");
	const sessionStartedAt = Math.floor(Date.now() / 1e3);
	const lifecycleAbort = new AbortController();
	const signal = options.signal ? AbortSignal.any([options.signal, lifecycleAbort.signal]) : lifecycleAbort.signal;
	let fatalErrorReported = false;
	const reportFatalError = (error) => {
		if (signal.aborted || fatalErrorReported) return;
		fatalErrorReported = true;
		options.onFatalError?.(error);
	};
	const replayGuard = createChannelReplayGuard({
		dedupe: {
			pluginId: "buzz",
			namespacePrefix: REPLAY_NAMESPACE_PREFIX,
			ttlMs: REPLAY_TTL_MS,
			memoryMaxSize: REPLAY_MAX_ENTRIES,
			stateMaxEntries: REPLAY_STATE_MAX_ENTRIES,
			onDiskError: (error) => {
				options.onDedupeError?.(error instanceof Error ? error : new Error(String(error)));
			}
		},
		buildReplayKey: (event) => event.id,
		namespace: () => options.accountId
	});
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: options.relayUrl,
		secretKey,
		authTag,
		signal
	});
	const dispatchQueue = createBuzzReplayDispatchQueue({ onTaskError: (error) => {
		options.onMessageError?.(error instanceof Error ? error : new Error(String(error)));
	} });
	const directory = new BuzzDirectoryState({
		publicKey,
		fallbackProfileName: options.profileName ?? "OpenClaw",
		channelIds: options.channelIds,
		profileLimit: subscriptionBudget.profileLimit
	});
	let directoryRelay;
	let stopPresenceHeartbeat = () => {};
	const bus = {
		publicKey,
		directory,
		refreshDirectory: async () => await directoryRelay?.refreshRooms(options.channelIds),
		sendText: async ({ channelId, text, threadId, replyToId }) => {
			signal.throwIfAborted();
			const mentionSyntax = inspectBuzzMentionSyntax(text);
			const mentionedPubkeys = mentionSyntax.hasAtMention || mentionSyntax.hasExplicitIdentity ? resolveBuzzMessageMentions({
				text,
				members: directory.mentionMembers(channelId),
				senderPublicKey: publicKey
			}) : [];
			const event = buildBuzzTextEvent({
				secretKey,
				channelId,
				text,
				threadId,
				replyToId,
				mentionedPubkeys
			});
			await relay.publish(event);
			return event.id;
		},
		sendTyping: async ({ channelId, threadId, replyToId }) => {
			if (signal.aborted || !relay.connected) return;
			const event = buildBuzzTypingEvent({
				secretKey,
				channelId,
				threadId,
				replyToId
			});
			await relay.send(JSON.stringify(["EVENT", event]));
		},
		close: async () => {
			lifecycleAbort.abort(/* @__PURE__ */ new Error("Buzz bus closed"));
			await dispatchQueue.close();
			stopPresenceHeartbeat();
			directoryRelay?.close();
			replayGuard.clearMemory();
			relay.close();
		}
	};
	try {
		await queryBuzzDirectoryRooms({
			relay,
			relayPublicKey,
			state: directory,
			channelIds: options.channelIds,
			signal
		});
		const activeChannelIds = directory.activeRoomIds();
		directoryRelay = startBuzzDirectoryRelay({
			relay,
			relayPublicKey,
			state: directory,
			subscribedRoomIds: new Set(activeChannelIds),
			signal,
			onError: options.onDirectoryError,
			onFatalError: reportFatalError,
			onRoomChanged: options.onRoomDirectoryChanged
		});
		startBuzzRoomMembershipNotifications({
			relay,
			relayPublicKey,
			botPublicKey: publicKey,
			configuredRoomIds: options.channelIds,
			since: sessionStartedAt,
			signal,
			onFatalError: reportFatalError
		});
		const membershipTracker = activeChannelIds.length > 0 ? await createBuzzRoomMembershipTracker({
			relay,
			relayPublicKey,
			channelIds: activeChannelIds,
			botPublicKey: publicKey,
			since: sessionStartedAt,
			messageSince: options.since ?? sessionStartedAt,
			messageLimit: resolveBuzzRoomHistoryLimit(activeChannelIds.length),
			reserveDispatchCapacity: (slots) => dispatchQueue.reserveCapacity(slots),
			onHistoryError: options.onHistoryError,
			onMessageEvent: (event, isMember, reservation) => {
				if (signal.aborted || event.pubkey === publicKey) return;
				const message = parseBuzzMessageEvent(event);
				if (!message || !isMember(message.channelId, event.pubkey)) return;
				if ((reservation ?? dispatchQueue).enqueue(async () => {
					await replayGuard.processGuarded(event, async () => {
						await options.onMessage(message, bus, signal);
					});
				}) !== "overflow") return;
				if (reservation) {
					options.onHistoryError?.(/* @__PURE__ */ new Error(`Buzz room ${message.channelId} returned more history than the ${BUZZ_REPLAY_DISPATCH_MAX_PENDING}-message pending limit allows`));
					return;
				}
				dispatchQueue.close();
				reportFatalError(/* @__PURE__ */ new Error(`Buzz inbound replay exceeded the ${BUZZ_REPLAY_DISPATCH_MAX_PENDING}-message pending limit`));
			},
			onFatalError: reportFatalError,
			onMembershipsChanged: (memberships) => {
				if (directory.replaceMemberships(memberships)) directoryRelay?.replaceProfilePublicKeys(directory.profilePublicKeys());
			},
			onRoomMetadataChanged: (channelId) => {
				directoryRelay?.refreshRooms([channelId]).catch((error) => {
					if (!signal.aborted) options.onDirectoryError?.(error instanceof Error ? error : new Error("Buzz room directory refresh failed", { cause: error }));
				});
			},
			signal
		}) : void 0;
		directory.replaceMemberships(membershipTracker?.memberships() ?? /* @__PURE__ */ new Map());
		directoryRelay.replaceProfilePublicKeys(directory.profilePublicKeys());
		membershipTracker?.catchUpHistory();
		stopPresenceHeartbeat = startBuzzPresenceHeartbeat({
			relay,
			secretKey,
			onError: options.onPresenceError
		});
		if (options.profileName?.trim()) syncBuzzProfile({
			relay,
			secretKey,
			publicKey,
			displayName: options.profileName,
			authTag,
			onFatalError: reportFatalError,
			signal
		}).then((result) => {
			if (result.status === "published") options.onProfilePublished?.(result.eventId);
		}).catch((error) => {
			if (signal.aborted) return;
			options.onProfileError?.(error instanceof Error ? error : new Error("Buzz profile sync failed", { cause: error }));
		});
		return bus;
	} catch (error) {
		lifecycleAbort.abort(error);
		await dispatchQueue.close();
		directoryRelay?.close();
		relay.close();
		throw error;
	}
}
//#endregion
//#region extensions/buzz/src/runtime.ts
const { setRuntime: setBuzzRuntime, getRuntime: getBuzzRuntime } = createPluginRuntimeStore({
	pluginId: "buzz",
	errorMessage: "Buzz runtime not initialized"
});
//#endregion
//#region extensions/buzz/src/inbound.ts
const log = createSubsystemLogger("buzz/inbound");
async function handleBuzzInbound(params) {
	const runtime = getBuzzRuntime();
	const { account, cfg, bus, message, signal } = params;
	const channelId = parseBuzzTarget(message.channelId);
	const target = buildBuzzTarget(channelId);
	const textForAgent = formatBuzzMessageForAgent(message);
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg,
		channel: "buzz",
		accountId: account.accountId,
		peer: {
			kind: "group",
			id: target
		}
	});
	const supportsTextInterpretation = message.kind !== BUZZ_DIFF_MESSAGE_KIND;
	const textMention = supportsTextInterpretation && runtime.channel.mentions.matchesMentionPatterns(message.text, runtime.channel.mentions.buildMentionRegexes(cfg, route.agentId));
	const wasMentioned = message.mentionedPubkeys.includes(bus.publicKey) || textMention;
	const shouldComputeCommandAuthorized = supportsTextInterpretation && runtime.channel.commands.shouldComputeCommandAuthorized(message.text, cfg);
	const hasControlCommand = shouldComputeCommandAuthorized && runtime.channel.text.hasControlCommand(message.text, cfg);
	const groupConfig = account.config.groups?.[channelId];
	const access = await resolveStableChannelMessageIngress({
		channelId: "buzz",
		accountId: account.accountId,
		identity: {
			key: "buzz-pubkey",
			entryIdPrefix: "buzz-entry"
		},
		subject: { stableId: message.senderPubkey },
		conversation: {
			kind: "group",
			id: channelId,
			threadId: message.threadId
		},
		contextBinding: {
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			messageId: message.id,
			inboundEventKind: "user_request"
		},
		mentionFacts: {
			canDetectMention: true,
			wasMentioned
		},
		groupPolicy: account.config.groupPolicy,
		groupAllowFrom: account.config.groupAllowFrom,
		policy: { activation: {
			requireMention: groupConfig?.requireMention ?? true,
			allowTextCommands: true
		} },
		command: shouldComputeCommandAuthorized ? {
			allowTextCommands: true,
			hasControlCommand
		} : void 0
	});
	if (access.ingress.admission !== "dispatch") return;
	const senderName = bus.directory.resolveSenderName(message.senderPubkey);
	const roomName = bus.directory.resolveRoomName(channelId);
	const body = buildEnvelope({
		channel: "Buzz",
		from: senderName,
		timestamp: /* @__PURE__ */ new Date(message.createdAt * 1e3),
		body: textForAgent
	});
	const ctxPayload = (params.buildContext ?? buildChannelInboundEventContext)({
		channelIngress: access,
		channel: "buzz",
		accountId: route.accountId ?? account.accountId,
		messageId: message.id,
		messageIdFull: message.id,
		timestamp: message.createdAt * 1e3,
		from: target,
		sender: {
			id: message.senderPubkey,
			name: senderName
		},
		conversation: {
			kind: "group",
			id: channelId,
			label: roomName,
			threadId: message.threadId,
			nativeChannelId: channelId
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: target,
			originatingTo: target,
			replyToId: message.id,
			messageThreadId: message.threadId,
			threadParentId: message.threadId ? channelId : void 0
		},
		message: {
			body,
			bodyForAgent: textForAgent,
			rawBody: message.text,
			commandBody: supportsTextInterpretation ? message.text : ""
		},
		access: {
			commands: { authorized: access.commandAccess.authorized },
			mentions: {
				canDetectMention: true,
				wasMentioned
			}
		},
		extra: {
			GroupSubject: roomName,
			BuzzEventKind: message.kind
		}
	});
	await runtime.channel.inbound.dispatch({
		cfg,
		channel: "buzz",
		accountId: account.accountId,
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		delivery: {
			deliver: async (payload) => {
				const text = payload && typeof payload === "object" && "text" in payload ? payload.text ?? "" : "";
				if (!text.trim()) return;
				await bus.sendText({
					channelId,
					text,
					threadId: message.threadId,
					replyToId: message.id
				});
			},
			onError: (error) => {
				throw error instanceof Error ? error : new Error(String(error));
			}
		},
		replyOptions: { abortSignal: signal },
		replyPipeline: { typing: {
			start: async () => {
				await bus.sendTyping({
					channelId,
					threadId: message.threadId,
					replyToId: message.id
				});
			},
			keepaliveIntervalMs: 3e3,
			onStartError: (error) => {
				log.error(`[${account.accountId}] Buzz typing failed for ${channelId}: ${String(error)}`);
			}
		} },
		record: { onRecordError: (error) => {
			throw error instanceof Error ? error : /* @__PURE__ */ new Error(`Buzz session record failed: ${String(error)}`);
		} }
	});
}
//#endregion
//#region extensions/buzz/src/gateway.ts
const activeBuses = /* @__PURE__ */ new Map();
const RECONNECT_BACKOFF = {
	initialMs: 1e3,
	maxMs: 3e4,
	factor: 2,
	jitter: .2
};
const RECONNECT_STABLE_MS = 6e4;
const RECONNECT_LOOKBACK_SECONDS = 1440 * 60;
function getActiveBuzzBus(accountId) {
	return activeBuses.get(accountId);
}
function resolveBuzzProfileName(params) {
	const explicitName = params.account.config.name?.trim();
	if (explicitName) return explicitName;
	const runtime = getBuzzRuntime();
	const agentIds = new Set(params.channelIds.map((channelId) => runtime.channel.routing.resolveAgentRoute({
		cfg: params.cfg,
		channel: "buzz",
		accountId: params.account.accountId,
		peer: {
			kind: "group",
			id: buildBuzzTarget(channelId)
		}
	}).agentId));
	if (agentIds.size !== 1) return "OpenClaw";
	const agentId = agentIds.values().next().value;
	return agentId ? runtime.agent.resolveAgentIdentity(params.cfg, agentId)?.name?.trim() || "OpenClaw" : "OpenClaw";
}
async function startBuzzGatewayAccount(ctx) {
	const buildContext = ctx.channelRuntime?.inbound.buildContext;
	const account = resolveBuzzAccount({
		cfg: ctx.cfg,
		accountId: ctx.account.accountId
	});
	if (!account.configured) throw new Error(`Buzz is not configured for account "${account.accountId}"`);
	const channelIds = Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([channelId]) => parseBuzzTarget(channelId));
	if (channelIds.length === 0) throw new Error("Buzz requires at least one channels.buzz.groups entry");
	const configuredChannelIds = new Set(channelIds);
	const profileName = resolveBuzzProfileName({
		cfg: ctx.cfg,
		account,
		channelIds
	});
	let hasAttemptedSession = false;
	let reconnectAttempt = 0;
	while (!ctx.abortSignal.aborted) {
		let bus;
		let cycleError;
		let connectedAt;
		let reportBusFailure = () => {};
		const busFailure = new Promise((resolve) => {
			reportBusFailure = resolve;
		});
		try {
			const sessionSince = Math.floor(Date.now() / 1e3) - (hasAttemptedSession ? RECONNECT_LOOKBACK_SECONDS : 0);
			hasAttemptedSession = true;
			bus = await startBuzzBus({
				accountId: account.accountId,
				relayUrl: account.relayUrl,
				privateKey: account.privateKey,
				authTag: account.authTag,
				profileName,
				channelIds,
				since: sessionSince,
				signal: ctx.abortSignal,
				onMessage: async (message, sessionBus, signal) => {
					if (!isConfiguredBuzzChannel(configuredChannelIds, message.channelId)) return;
					await handleBuzzInbound({
						account,
						cfg: ctx.cfg,
						bus: sessionBus,
						message,
						signal,
						buildContext
					});
				},
				onMessageError: (error) => {
					ctx.log?.error?.(`[${account.accountId}] Buzz message failed: ${error.message}`);
				},
				onFatalError: (error) => {
					ctx.log?.error?.(`[${account.accountId}] Buzz bus failed: ${error.message}`);
					reportBusFailure(error);
				},
				onDedupeError: (error) => {
					ctx.log?.error?.(`[${account.accountId}] Buzz replay state failed: ${error.message}`);
				},
				onHistoryError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz history recovery incomplete: ${error.message}`);
				},
				onPresenceError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz presence heartbeat failed: ${error.message}`);
				},
				onProfilePublished: () => {
					ctx.log?.info?.(`[${account.accountId}] Buzz bot profile published as "${profileName}"`);
				},
				onProfileError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz bot profile sync failed: ${error.message}`);
				},
				onDirectoryError: (error) => {
					ctx.log?.warn?.(`[${account.accountId}] Buzz directory refresh failed: ${error.message}`);
				},
				onRoomDirectoryChanged: ctx.invalidateDirectoryCache
			});
			ctx.invalidateDirectoryCache?.();
			connectedAt = Date.now();
			activeBuses.set(account.accountId, bus);
			ctx.setStatus(channelReadyPatch({
				accountId: account.accountId,
				configured: true,
				enabled: account.enabled,
				baseUrl: account.relayUrl,
				publicKey: bus.publicKey
			}));
			ctx.log?.info?.(`[${account.accountId}] Buzz connected to ${account.relayUrl} for ${bus.directory.activeRoomIds().length} channel(s)`);
			const fatalError = await Promise.race([waitUntilAbort(ctx.abortSignal).then(() => void 0), busFailure]);
			if (fatalError) throw fatalError;
		} catch (error) {
			if (ctx.abortSignal.aborted) return;
			cycleError = error instanceof Error ? error : new Error(String(error));
		} finally {
			await bus?.close();
			if (activeBuses.get(account.accountId) === bus) activeBuses.delete(account.accountId);
			ctx.setStatus({
				accountId: account.accountId,
				running: false,
				...cycleError ? { lifecycle: "recovering" } : {},
				...cycleError ? { lastError: cycleError.message } : {}
			});
		}
		if (!cycleError || ctx.abortSignal.aborted) return;
		if (connectedAt !== void 0 && Date.now() - connectedAt >= RECONNECT_STABLE_MS) reconnectAttempt = 0;
		reconnectAttempt += 1;
		const delayMs = computeBackoff(RECONNECT_BACKOFF, reconnectAttempt);
		ctx.log?.info?.(`[${account.accountId}] Buzz reconnecting in ${delayMs}ms after: ${cycleError.message}`);
		try {
			await sleepWithAbort(delayMs, ctx.abortSignal);
		} catch {
			if (!ctx.abortSignal.aborted) throw cycleError;
		}
	}
}
const buzzOutboundAdapter = {
	deliveryMode: "direct",
	textChunkLimit: 16e3,
	deliveryCapabilities: { durableFinal: {
		text: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	sendText: async ({ cfg, to, text, accountId, threadId, replyToId }) => {
		const runtime = getBuzzRuntime();
		const resolvedAccountId = accountId ?? resolveDefaultBuzzAccountId(cfg);
		const account = resolveBuzzAccount({
			cfg,
			accountId: resolvedAccountId
		});
		if (!account.enabled) throw new Error(`Buzz is disabled for account ${resolvedAccountId}`);
		if (!account.configured) throw new Error(`Buzz is not configured for account ${resolvedAccountId}`);
		const bus = activeBuses.get(resolvedAccountId);
		const channelId = parseBuzzTarget(to);
		const tableMode = runtime.channel.text.resolveMarkdownTableMode({
			cfg,
			channel: "buzz",
			accountId: resolvedAccountId
		});
		const outboundMessage = {
			channelId,
			text: runtime.channel.text.convertMarkdownTables(text ?? "", tableMode),
			threadId: threadId == null ? void 0 : String(threadId),
			replyToId: replyToId == null ? void 0 : String(replyToId)
		};
		return attachChannelToResult("buzz", {
			to: channelId,
			messageId: bus ? await bus.sendText(outboundMessage) : await sendBuzzTextOneShot({
				relayUrl: account.relayUrl,
				privateKey: account.privateKey,
				authTag: account.authTag,
				...outboundMessage
			})
		});
	}
};
async function sendBuzzTyping(params) {
	const resolvedAccountId = params.accountId ?? resolveDefaultBuzzAccountId(params.cfg);
	const bus = activeBuses.get(resolvedAccountId);
	if (!bus) return;
	await bus.sendTyping({
		channelId: parseBuzzTarget(params.to),
		threadId: params.threadId == null ? void 0 : String(params.threadId)
	});
}
//#endregion
//#region extensions/buzz/src/directory.ts
const DIRECTORY_LIVE_TIMEOUT_MS = 1e4;
function resolveConfiguredRoomIds(account) {
	return Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([roomId]) => parseBuzzTarget(roomId));
}
function createConfiguredDirectoryState(params) {
	const account = resolveBuzzAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.publicKey) return null;
	const channelIds = resolveConfiguredRoomIds(account);
	return {
		account,
		channelIds,
		state: new BuzzDirectoryState({
			publicKey: account.publicKey,
			fallbackProfileName: account.name ?? "OpenClaw",
			channelIds
		})
	};
}
async function loadBuzzDirectoryState(params, options) {
	const configured = createConfiguredDirectoryState(params);
	if (!configured || !configured.account.configured || configured.channelIds.length === 0) return configured?.state ?? null;
	const activeBus = getActiveBuzzBus(configured.account.accountId);
	if (activeBus) {
		if (options.refreshRooms) try {
			await activeBus.refreshDirectory();
		} catch {}
		return activeBus.directory;
	}
	const timeoutSignal = AbortSignal.timeout(DIRECTORY_LIVE_TIMEOUT_MS);
	const { relay, relayPublicKey } = await connectAuthenticatedBuzzRelaySession({
		relayUrl: configured.account.relayUrl,
		secretKey: decodeBuzzPrivateKey(configured.account.privateKey),
		authTag: parseBuzzAuthTag(configured.account.authTag),
		signal: timeoutSignal
	});
	try {
		await queryBuzzDirectoryRooms({
			relay,
			relayPublicKey,
			state: configured.state,
			channelIds: configured.channelIds,
			signal: timeoutSignal
		});
		const activeChannelIds = configured.state.activeRoomIds();
		configured.state.replaceMemberships(activeChannelIds.length > 0 ? await queryBuzzRoomMemberships({
			relay,
			relayPublicKey,
			channelIds: activeChannelIds,
			signal: timeoutSignal
		}) : /* @__PURE__ */ new Map());
		await queryBuzzDirectoryProfiles({
			relay,
			state: configured.state,
			publicKeys: configured.state.profilePublicKeys(),
			signal: timeoutSignal
		});
		return configured.state;
	} finally {
		relay.close();
	}
}
async function getBuzzDirectorySelf(params) {
	return (await loadBuzzDirectoryState(params, { refreshRooms: false }))?.self() ?? null;
}
async function listBuzzDirectoryPeersLive(params) {
	return (await loadBuzzDirectoryState(params, { refreshRooms: false }))?.listPeers({
		query: params.query,
		limit: params.limit
	}) ?? [];
}
async function listBuzzDirectoryGroupsLive(params) {
	return (await loadBuzzDirectoryState(params, { refreshRooms: true }))?.listGroups({
		query: params.query,
		limit: params.limit
	}) ?? [];
}
async function listBuzzDirectoryGroupMembers(params) {
	return (await loadBuzzDirectoryState(params, { refreshRooms: false }))?.listGroupMembers({
		groupId: params.groupId,
		limit: params.limit
	}) ?? [];
}
//#endregion
//#region extensions/buzz/src/channel.ts
const buzzMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "buzz",
	outbound: buzzOutboundAdapter
});
const buzzPlugin = createChatChannelPlugin({
	base: {
		id: "buzz",
		meta: {
			id: "buzz",
			label: "Buzz",
			selectionLabel: "Buzz",
			docsPath: "/channels/buzz",
			docsLabel: "buzz",
			blurb: "Connect OpenClaw agents to Buzz team rooms.",
			markdownCapable: true,
			order: 56
		},
		capabilities: {
			chatTypes: ["group"],
			threads: true
		},
		agentPrompt: { messageToolHints: () => ["- Buzz targets: use a configured room UUID, `buzz:<ROOM_UUID>`, or a unique current room name. Use the UUID when room names are ambiguous.", "- Buzz mentions: write a unique current room member as `@Display Name`. For an explicit identity, include `nostr:npub...`; the public key must belong to the target room. Any unresolved or ambiguous label needs an explicit identity for every intended member."] },
		reload: { configPrefixes: ["channels.buzz"] },
		configSchema: BuzzConfigSchema,
		setupContract: buzzSetupContract,
		setupWizard: buzzSetupWizard,
		config: {
			listAccountIds: listBuzzAccountIds,
			resolveAccount: (cfg, accountId) => resolveBuzzAccount({
				cfg,
				accountId
			}),
			defaultAccountId: resolveDefaultBuzzAccountId,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured,
				extra: {
					baseUrl: account.relayUrl,
					publicKey: account.publicKey
				}
			}),
			resolveAllowFrom: ({ cfg, accountId }) => resolveBuzzAccount({
				cfg,
				accountId
			}).config.groupAllowFrom,
			resolveDefaultTo: ({ cfg, accountId }) => resolveBuzzAccount({
				cfg,
				accountId
			}).config.defaultTo
		},
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		messaging: {
			targetPrefixes: ["buzz"],
			normalizeTarget: normalizeBuzzTarget,
			inferTargetChatType: () => "group",
			targetResolver: {
				looksLikeId: looksLikeBuzzTarget,
				hint: "<room UUID|configured room name>"
			},
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target, replyToId, threadId, currentSessionKey }) => {
				const normalized = buildBuzzTarget(parseBuzzTarget(target));
				return buildThreadAwareOutboundSessionRoute({
					route: buildChannelOutboundSessionRoute({
						cfg,
						agentId,
						channel: "buzz",
						accountId,
						recipientSessionExact: true,
						peer: {
							kind: "group",
							id: normalized
						},
						chatType: "group",
						from: `buzz:${accountId ?? "default"}`,
						to: normalized
					}),
					replyToId,
					threadId,
					currentSessionKey,
					canRecoverCurrentThread: () => true
				});
			},
			resolveSessionConversation: ({ rawId }) => {
				const { baseSessionKey, threadId } = parseThreadSessionSuffix(rawId);
				const channelId = parseBuzzTarget(baseSessionKey ?? rawId);
				return {
					id: channelId,
					threadId,
					baseConversationId: channelId,
					parentConversationCandidates: [channelId]
				};
			}
		},
		status: {
			...createComputedAccountStatusAdapter({
				defaultRuntime: createDefaultChannelRuntimeState("default"),
				buildChannelSummary: ({ snapshot }) => ({
					ok: snapshot.configured,
					label: snapshot.configured ? "configured" : "missing config",
					detail: snapshot.baseUrl ?? ""
				}),
				resolveAccountSnapshot: ({ account }) => ({
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured: account.configured,
					baseUrl: account.relayUrl,
					publicKey: account.publicKey
				})
			}),
			probeAccount: async ({ account, timeoutMs }) => {
				const rooms = await discoverBuzzRooms({
					relayUrl: account.relayUrl,
					privateKey: account.privateKey,
					authTag: account.authTag,
					timeoutMs
				});
				return {
					ok: true,
					publicKey: account.publicKey,
					roomCount: rooms.length,
					rooms: rooms.map((room) => ({
						id: room.id,
						name: room.name
					}))
				};
			}
		},
		gateway: { startAccount: startBuzzGatewayAccount },
		heartbeat: { sendTyping: sendBuzzTyping },
		directory: createChannelDirectoryAdapter({
			self: getBuzzDirectorySelf,
			listPeers: listBuzzDirectoryPeersFromConfig,
			listPeersLive: listBuzzDirectoryPeersLive,
			listGroups: listBuzzDirectoryGroupsFromConfig,
			listGroupsLive: listBuzzDirectoryGroupsLive,
			listGroupMembers: listBuzzDirectoryGroupMembers
		}),
		message: buzzMessageAdapter
	},
	outbound: buzzOutboundAdapter
});
//#endregion
export { getBuzzRuntime as n, setBuzzRuntime as r, buzzPlugin as t };
