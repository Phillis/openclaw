import { t as logDebug } from "./logger-D4iLuGk3.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import "./runtime-env-_YEv0JPQ.js";
import { d as upsertChannelPairingRequest } from "./pairing-store-CHm2POOL.js";
import "./conversation-runtime-BCniVCys.js";
import "./logging-core-BaUBu9tm.js";
import { a as createChannelIngressResolver, c as defineStableChannelIngressIdentity } from "./channel-ingress-runtime-BcONVz10.js";
import { t as createChannelPairingChallengeIssuer } from "./channel-pairing-CPNZh_3Y.js";
import { n as isDiscordGroupAllowedByPolicy, r as normalizeDiscordAllowList, v as resolveGroupDmAllow } from "./allow-list-CtAHaFe6.js";
import { r as canViewDiscordGuildChannel } from "./send.permissions-_uPaFgjs.js";
//#region extensions/discord/src/monitor/dm-command-auth.ts
const DISCORD_ALLOW_LIST_PREFIXES = [
	"discord:",
	"user:",
	"pk:"
];
const DISCORD_CHANNEL_ID = "discord";
const DISCORD_USER_ID_KIND = "stable-id";
const DISCORD_USER_NAME_KIND = "username";
function normalizeDiscordIdEntry(entry) {
	const text = entry.trim();
	if (!text) return null;
	const maybeId = text.replace(/^<@!?/, "").replace(/>$/, "");
	if (/^\d+$/.test(maybeId)) return maybeId;
	const prefix = DISCORD_ALLOW_LIST_PREFIXES.find((entryPrefix) => text.startsWith(entryPrefix));
	if (prefix) return text.slice(prefix.length).trim() || null;
	return null;
}
function normalizeDiscordNameEntry(entry) {
	const text = entry.trim();
	if (!text || text === "*" || normalizeDiscordIdEntry(text) || /#\d{4}$/.test(text)) return null;
	const nameSlug = normalizeDiscordAllowList([text], DISCORD_ALLOW_LIST_PREFIXES)?.names.values().next().value;
	return typeof nameSlug === "string" && nameSlug ? nameSlug : null;
}
function normalizeDiscordTagEntry(entry) {
	const text = entry.trim();
	return /#\d{4}$/.test(text) ? normalizeDiscordNameSubject(text) : null;
}
function normalizeDiscordNameSubject(value) {
	const nameSlug = normalizeDiscordAllowList([value], DISCORD_ALLOW_LIST_PREFIXES)?.names.values().next().value;
	return typeof nameSlug === "string" && nameSlug ? nameSlug : null;
}
const discordIngressIdentity = defineStableChannelIngressIdentity({
	key: "discordUserId",
	kind: DISCORD_USER_ID_KIND,
	authentication: "verified",
	normalizeEntry: normalizeDiscordIdEntry,
	normalizeSubject: (value) => value.trim() || null,
	sensitivity: "pii",
	aliases: [["discordUserName", normalizeDiscordNameEntry], ["discordUserTag", normalizeDiscordTagEntry]].map(([key, normalizeEntry]) => ({
		key,
		kind: DISCORD_USER_NAME_KIND,
		normalizeEntry,
		normalizeSubject: normalizeDiscordNameSubject,
		authentication: "mutable",
		sensitivity: "pii"
	}))
});
function createDiscordDmIngressSubject(sender) {
	return {
		stableId: sender.id,
		aliases: {
			discordUserName: sender.name,
			discordUserTag: sender.tag
		},
		...sender.isPluralKit ? { authentication: { discordUserId: "asserted" } } : {}
	};
}
function createDiscordDynamicAccessGroupResolver(params) {
	if (!params.cfg) return;
	const cfg = params.cfg;
	return async ({ name, group, accountId, subject }) => {
		if (group.type !== "discord.channelAudience") return false;
		const senderId = String(subject.stableId ?? "").trim();
		if (!senderId) return false;
		if ((group.membership ?? "canViewChannel") !== "canViewChannel") return false;
		try {
			return await canViewDiscordGuildChannel(group.guildId, group.channelId, senderId, {
				cfg,
				accountId,
				token: params.token,
				rest: params.rest
			});
		} catch (err) {
			logVerbose(`discord: accessGroup:${name} lookup failed for user ${senderId}: ${String(err)}`);
			throw err;
		}
	};
}
function createDiscordIngressResolver(params) {
	return createChannelIngressResolver({
		channelId: DISCORD_CHANNEL_ID,
		accountId: params.accountId,
		identity: discordIngressIdentity,
		cfg: params.cfg,
		resolveAccessGroupMembership: createDiscordDynamicAccessGroupResolver({
			cfg: params.cfg,
			token: params.token,
			rest: params.rest
		}),
		...params.readStoreAllowFrom ? { readStoreAllowFrom: params.readStoreAllowFrom } : {},
		...params.useDefaultPairingStore !== void 0 ? { useDefaultPairingStore: params.useDefaultPairingStore } : {}
	});
}
function syntheticAccessGroupMembership(groupName, allowed) {
	return allowed ? {
		kind: "matched",
		groupName,
		source: "dynamic",
		matchedEntryIds: [groupName]
	} : {
		kind: "not-matched",
		groupName,
		source: "dynamic"
	};
}
async function resolveDiscordDmCommandAccess(params) {
	return await createDiscordIngressResolver({
		accountId: params.accountId,
		cfg: params.cfg,
		token: params.token,
		rest: params.rest,
		readStoreAllowFrom: params.readStoreAllowFrom,
		useDefaultPairingStore: params.readStoreAllowFrom == null
	}).message({
		subject: createDiscordDmIngressSubject(params.sender),
		conversation: {
			kind: "direct",
			id: params.conversationId ?? params.sender.id,
			parentId: params.conversationParentId,
			threadId: params.conversationThreadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		event: {
			kind: params.eventKind ?? "native-command",
			authMode: "inbound",
			mayPair: true
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: "disabled",
		policy: {
			mutableIdentifierMatching: params.allowNameMatching ? "enabled" : "disabled",
			...params.minIdentifierAuthentication ? { minIdentifierAuthentication: params.minIdentifierAuthentication } : {}
		},
		allowFrom: params.configuredAllowFrom,
		command: {
			hasControlCommand: false,
			modeWhenAccessGroupsOff: "configured"
		}
	});
}
async function resolveDiscordTextCommandAccess(params) {
	const ownerAllowFrom = (params.ownerAllowFrom ?? []).filter((entry) => entry.trim() !== "*");
	const memberAccessGroup = "discord-member-access";
	const commandGroup = params.memberAccessConfigured ? [`accessGroup:${memberAccessGroup}`] : [];
	const accessGroupMembership = params.memberAccessConfigured ? [syntheticAccessGroupMembership(memberAccessGroup, params.memberAllowed)] : [];
	return await createDiscordIngressResolver({
		accountId: params.accountId,
		cfg: params.cfg,
		token: params.token,
		rest: params.rest
	}).command({
		subject: createDiscordDmIngressSubject(params.sender),
		conversation: {
			kind: "channel",
			id: params.conversationId ?? "discord-command",
			parentId: params.conversationParentId,
			threadId: params.conversationThreadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		accessGroupMembership,
		dmPolicy: "allowlist",
		groupPolicy: "allowlist",
		policy: {
			mutableIdentifierMatching: params.allowNameMatching ? "enabled" : "disabled",
			...params.minIdentifierAuthentication ? { minIdentifierAuthentication: params.minIdentifierAuthentication } : {}
		},
		allowFrom: ownerAllowFrom,
		groupAllowFrom: commandGroup,
		command: {
			allowTextCommands: params.allowTextCommands,
			hasControlCommand: params.hasControlCommand,
			modeWhenAccessGroupsOff: "configured"
		}
	});
}
//#endregion
//#region extensions/discord/src/monitor/dm-command-decision.ts
async function handleDiscordDmCommandDecision(params) {
	if (params.senderAccess.decision === "allow") return true;
	if (params.senderAccess.decision === "pairing") {
		const upsertPairingRequest = params.upsertPairingRequest ?? upsertChannelPairingRequest;
		const result = await createChannelPairingChallengeIssuer({
			channel: "discord",
			accountId: params.accountId,
			upsertPairingRequest: async ({ id, meta }) => await upsertPairingRequest({
				channel: "discord",
				id,
				accountId: params.accountId,
				meta
			})
		})({
			senderId: params.sender.id,
			senderIdLine: `Your Discord user id: ${params.sender.id}`,
			meta: {
				tag: params.sender.tag,
				name: params.sender.name
			},
			sendPairingReply: async () => {}
		});
		if (result.created && result.code) await params.onPairingCreated(result.code);
		return false;
	}
	await params.onUnauthorized();
	return false;
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-channel-access.ts
function resolveDiscordPreflightChannelAccess(params) {
	if (params.isGuildMessage && params.channelConfig?.enabled === false) {
		logDebug(`[discord-preflight] drop: channel disabled`);
		logVerbose(`Blocked discord channel ${params.messageChannelId} (channel disabled, ${params.channelMatchMeta})`);
		return {
			allowed: false,
			channelAllowlistConfigured: false,
			channelAllowed: false
		};
	}
	const groupDmAllowed = params.isGroupDm && resolveGroupDmAllow({
		channels: params.groupDmChannels,
		channelId: params.messageChannelId,
		channelName: params.displayChannelName,
		channelSlug: params.displayChannelSlug
	});
	if (params.isGroupDm && !groupDmAllowed) return {
		allowed: false,
		channelAllowlistConfigured: false,
		channelAllowed: false
	};
	const channelAllowlistConfigured = Boolean(params.guildInfo?.channels) && Object.keys(params.guildInfo?.channels ?? {}).length > 0;
	const channelAllowed = params.channelConfig?.allowed !== false;
	if (params.isGuildMessage && !isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(params.guildInfo),
		channelAllowlistConfigured,
		channelAllowed
	})) {
		if (params.groupPolicy === "disabled") {
			logDebug(`[discord-preflight] drop: groupPolicy disabled`);
			logVerbose(`discord: drop guild message (groupPolicy: disabled, ${params.channelMatchMeta})`);
		} else if (!channelAllowlistConfigured) {
			logDebug(`[discord-preflight] drop: groupPolicy allowlist, no channel allowlist configured`);
			logVerbose(`discord: drop guild message (groupPolicy: allowlist, no channel allowlist, ${params.channelMatchMeta})`);
		} else {
			logDebug(`[discord] Ignored message from channel ${params.messageChannelId} (not in guild allowlist). Add to guilds.<guildId>.channels to enable.`);
			logVerbose(`Blocked discord channel ${params.messageChannelId} not in guild channel allowlist (groupPolicy: allowlist, ${params.channelMatchMeta})`);
		}
		return {
			allowed: false,
			channelAllowlistConfigured,
			channelAllowed
		};
	}
	if (params.isGuildMessage && params.channelConfig?.allowed === false) {
		logDebug(`[discord-preflight] drop: channelConfig.allowed===false`);
		logVerbose(`Blocked discord channel ${params.messageChannelId} not in guild channel allowlist (${params.channelMatchMeta})`);
		return {
			allowed: false,
			channelAllowlistConfigured,
			channelAllowed
		};
	}
	if (params.isGuildMessage) {
		logDebug(`[discord-preflight] pass: channel allowed`);
		logVerbose(`discord: allow channel ${params.messageChannelId} (${params.channelMatchMeta})`);
	}
	return {
		allowed: true,
		channelAllowlistConfigured,
		channelAllowed
	};
}
//#endregion
export { resolveDiscordTextCommandAccess as i, handleDiscordDmCommandDecision as n, resolveDiscordDmCommandAccess as r, resolveDiscordPreflightChannelAccess as t };
