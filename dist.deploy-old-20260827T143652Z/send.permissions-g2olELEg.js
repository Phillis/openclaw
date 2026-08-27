import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { t as danger } from "./globals-CAwGc4B6.js";
import { r as makeProxyFetch } from "./proxy-fetch-SiDxAIza.js";
import "./runtime-env-COkbgBI4.js";
import "./fetch-runtime-CGFA9obr.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-D7ikroCS.js";
import { t as normalizeDiscordToken } from "./token-B6lDBmt6.js";
import { a as mergeDiscordAccountConfig, s as resolveDiscordAccount } from "./accounts-B99sjC_p.js";
import { $ as getCurrentUser, Dt as getGuildMember, Et as getGuild, Vt as ChannelType, Xt as PermissionFlagsBits, dt as getThreadMember, h as RequestClient, lt as getChannel } from "./discord-BinpTEur.js";
import { n as createDiscordRetryRunner } from "./retry-CG6LCfkJ.js";
//#region extensions/discord/src/proxy-fetch.ts
function resolveDiscordProxyUrl(account, cfg) {
	const accountProxy = normalizeOptionalString(account.config.proxy);
	if (accountProxy) return accountProxy;
	return normalizeOptionalString(cfg?.channels?.discord?.proxy);
}
function resolveDiscordProxyFetchByUrl(proxyUrl, runtime) {
	return withValidatedDiscordProxy(proxyUrl, runtime, (proxy) => makeProxyFetch(proxy));
}
function resolveDiscordProxyFetchForAccount(account, cfg, runtime) {
	return resolveDiscordProxyFetchByUrl(resolveDiscordProxyUrl(account, cfg), runtime);
}
function withValidatedDiscordProxy(proxyUrl, runtime, createValue) {
	const proxy = proxyUrl?.trim();
	if (!proxy) return;
	try {
		validateDiscordProxyUrl(proxy);
		return createValue(proxy);
	} catch (err) {
		runtime?.error?.(danger(`discord: invalid rest proxy: ${String(err)}`));
		return;
	}
}
function validateDiscordProxyUrl(proxyUrl) {
	let parsed;
	try {
		parsed = new URL(proxyUrl);
	} catch {
		throw new Error("Proxy URL must be a valid http or https URL");
	}
	if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Proxy URL must use http or https");
	if (!parsed.hostname) throw new Error("Proxy URL must include a host");
	return proxyUrl;
}
//#endregion
//#region extensions/discord/src/monitor/gateway-registry.ts
/**
* Module-level registry of active Discord GatewayPlugin instances.
* Bridges the gap between agent tool handlers (which only have REST access)
* and the gateway WebSocket (needed for operations like updatePresence).
* Follows the same pattern as presence-cache.ts.
*/
const gatewayRegistry = /* @__PURE__ */ new Map();
const DEFAULT_ACCOUNT_KEY = "\0__default__";
function resolveAccountKey(accountId) {
	return accountId ?? DEFAULT_ACCOUNT_KEY;
}
/** Register a GatewayPlugin instance for an account. */
function registerGateway(accountId, gateway) {
	gatewayRegistry.set(resolveAccountKey(accountId), gateway);
}
/** Unregister a GatewayPlugin instance for an account. */
function unregisterGateway(accountId) {
	gatewayRegistry.delete(resolveAccountKey(accountId));
}
/** Get the GatewayPlugin for an account. Returns undefined if not registered. */
function getGateway(accountId) {
	return gatewayRegistry.get(resolveAccountKey(accountId));
}
/** Clear all registered gateways (for testing). */
function clearGateways() {
	gatewayRegistry.clear();
}
//#endregion
//#region extensions/discord/src/proxy-request-client.ts
const DISCORD_REST_TIMEOUT_MS = 15e3;
function createDiscordRequestClient(token, options) {
	if (!options?.fetch) return new RequestClient(token, options);
	return new RequestClient(token, {
		runtimeProfile: "persistent",
		maxQueueSize: 1e3,
		timeout: DISCORD_REST_TIMEOUT_MS,
		...options,
		fetch: options.fetch
	});
}
//#endregion
//#region extensions/discord/src/client.ts
function createDiscordRuntimeAccountContext(params) {
	return {
		cfg: params.cfg,
		accountId: normalizeAccountId(params.accountId)
	};
}
function resolveDiscordClientAccountContext(opts, runtime) {
	const resolvedCfg = requireRuntimeConfig(opts.cfg, "Discord client");
	const account = resolveAccountWithoutToken({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	return {
		cfg: resolvedCfg,
		account,
		proxyFetch: resolveDiscordProxyFetchForAccount(account, resolvedCfg, runtime)
	};
}
function resolveToken(params) {
	const fallback = normalizeDiscordToken(params.fallbackToken, "channels.discord.token");
	if (!fallback) {
		if (params.account.tokenStatus === "configured_unavailable") throw new Error(`Discord bot token configured for account "${params.accountId}" is unavailable; resolve SecretRefs against the active runtime snapshot before using this account.`);
		throw new Error(`Discord bot token missing for account "${params.accountId}" (set discord.accounts.${params.accountId}.token or DISCORD_BOT_TOKEN for default).`);
	}
	return fallback;
}
function resolveRest(token, account, cfg, rest, proxyFetch, signal, timeoutMs) {
	if (rest) return rest;
	const resolvedProxyFetch = proxyFetch ?? resolveDiscordProxyFetchForAccount(account, cfg);
	return createDiscordRequestClient(token, {
		...resolvedProxyFetch ? { fetch: resolvedProxyFetch } : {},
		...signal ? { signal } : {},
		...timeoutMs !== void 0 ? { timeout: timeoutMs } : {}
	});
}
function resolveAccountWithoutToken(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = mergeDiscordAccountConfig(params.cfg, accountId);
	const baseEnabled = params.cfg.channels?.discord?.enabled !== false;
	const accountEnabled = merged.enabled !== false;
	return {
		accountId,
		enabled: baseEnabled && accountEnabled,
		name: normalizeOptionalString(merged.name),
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		config: merged
	};
}
function createDiscordRestClient(opts) {
	const explicitToken = normalizeDiscordToken(opts.token, "channels.discord.token");
	const proxyContext = resolveDiscordClientAccountContext(opts);
	const resolvedCfg = proxyContext.cfg;
	const account = explicitToken ? proxyContext.account : resolveDiscordAccount({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	const token = explicitToken ?? resolveToken({
		account,
		accountId: account.accountId,
		fallbackToken: account.token
	});
	return {
		token,
		rest: resolveRest(token, account, resolvedCfg, opts.rest, proxyContext.proxyFetch, opts.signal, opts.timeoutMs),
		account
	};
}
function createDiscordClient(opts) {
	const { token, rest, account } = createDiscordRestClient(opts);
	return {
		token,
		rest,
		request: createDiscordRetryRunner({
			retry: opts.retry,
			verbose: opts.verbose,
			isGatewayDisconnected: () => {
				const gateway = getGateway(account.accountId);
				return gateway !== void 0 && !gateway.isConnected;
			}
		})
	};
}
function resolveDiscordRest(opts) {
	return createDiscordRestClient(opts).rest;
}
//#endregion
//#region extensions/discord/src/send.permissions.ts
const PERMISSION_ENTRIES = Object.entries(PermissionFlagsBits).filter(([, value]) => typeof value === "bigint");
const ALL_PERMISSIONS = PERMISSION_ENTRIES.reduce((acc, [, value]) => acc | value, 0n);
const ADMINISTRATOR_BIT = PermissionFlagsBits.Administrator;
function addPermissionBits(base, add) {
	if (!add) return base;
	return base | BigInt(add);
}
function removePermissionBits(base, deny) {
	if (!deny) return base;
	return base & ~BigInt(deny);
}
function bitfieldToPermissions(bitfield) {
	return PERMISSION_ENTRIES.filter(([, value]) => (bitfield & value) === value).map(([name]) => name).toSorted();
}
function hasAdministrator(bitfield) {
	return (bitfield & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
}
function hasPermissionBit(bitfield, permission) {
	return (bitfield & permission) === permission;
}
function isThreadChannelType(channelType) {
	return channelType === ChannelType.GuildNewsThread || channelType === ChannelType.GuildPublicThread || channelType === ChannelType.GuildPrivateThread;
}
async function fetchBotUserId(rest) {
	const me = await getCurrentUser(rest);
	if (!me?.id) throw new Error("Failed to resolve bot user id");
	return me.id;
}
function resolveMemberGuildPermissionBits(params) {
	const rolesByIdLocal = new Map((params.guild.roles ?? []).map((role) => [role.id, role]));
	const everyoneRole = rolesByIdLocal.get(params.guild.id);
	let permissions = 0n;
	if (everyoneRole?.permissions) permissions = addPermissionBits(permissions, everyoneRole.permissions);
	for (const roleId of params.member.roles ?? []) {
		const role = rolesByIdLocal.get(roleId);
		if (role?.permissions) permissions = addPermissionBits(permissions, role.permissions);
	}
	return permissions;
}
function rolesById(guild) {
	return new Map((guild.roles ?? []).map((role) => [role.id, role]));
}
function rolePosition(role) {
	return typeof role?.position === "number" ? role.position : -1;
}
function highestMemberRolePosition(guild, member) {
	const roles = rolesById(guild);
	return Math.max(...(member.roles ?? []).map((roleId) => rolePosition(roles.get(roleId))), 0);
}
function resolveMemberChannelPermissionBits(params) {
	let permissions = resolveMemberGuildPermissionBits({
		guild: params.guild,
		member: params.member
	});
	if (hasAdministrator(permissions)) return ALL_PERMISSIONS;
	const overwrites = "permission_overwrites" in params.channel ? params.channel.permission_overwrites ?? [] : [];
	for (const overwrite of overwrites) if (overwrite.id === params.guildId) {
		permissions = removePermissionBits(permissions, overwrite.deny ?? "0");
		permissions = addPermissionBits(permissions, overwrite.allow ?? "0");
	}
	let roleDeny = 0n;
	let roleAllow = 0n;
	for (const overwrite of overwrites) if (params.member.roles?.includes(overwrite.id)) {
		roleDeny = addPermissionBits(roleDeny, overwrite.deny ?? "0");
		roleAllow = addPermissionBits(roleAllow, overwrite.allow ?? "0");
	}
	permissions = permissions & ~roleDeny;
	permissions = permissions | roleAllow;
	for (const overwrite of overwrites) if (overwrite.id === params.userId) {
		permissions = removePermissionBits(permissions, overwrite.deny ?? "0");
		permissions = addPermissionBits(permissions, overwrite.allow ?? "0");
	}
	return permissions;
}
async function resolveChannelPermissionSubject(rest, channel) {
	const channelType = "type" in channel ? channel.type : void 0;
	const parentId = "parent_id" in channel ? channel.parent_id : void 0;
	if (isThreadChannelType(channelType) && parentId) return await getChannel(rest, parentId);
	return channel;
}
/**
* Fetch guild-level permissions for a user. This does not include channel-specific overwrites.
*/
async function fetchMemberGuildPermissionsDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return ALL_PERMISSIONS;
		return resolveMemberGuildPermissionBits({
			guild,
			member
		});
	} catch {
		return null;
	}
}
async function canViewDiscordGuildChannel(guildId, channelId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const channel = await getChannel(rest, channelId);
		const permissionChannel = await resolveChannelPermissionSubject(rest, channel);
		if (("guild_id" in permissionChannel ? permissionChannel.guild_id : void 0) !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		const permissions = resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		});
		if (!hasPermissionBit(permissions, PermissionFlagsBits.ViewChannel)) return false;
		if ("type" in channel && channel.type === ChannelType.GuildPrivateThread) {
			if (hasPermissionBit(permissions, PermissionFlagsBits.ManageThreads)) return true;
			await getThreadMember(rest, channel.id, userId);
		}
		return true;
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit
* after applying channel/category overwrites.
*/
async function hasAnyChannelPermissionDiscord(guildId, channelId, userId, requiredPermissions, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const permissionChannel = await resolveChannelPermissionSubject(rest, await getChannel(rest, channelId));
		if (("guild_id" in permissionChannel ? permissionChannel.guild_id : void 0) !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		const permissions = resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		});
		return requiredPermissions.some((permission) => hasPermissionBit(permissions, permission));
	} catch {
		return false;
	}
}
async function canManageGuildMemberRoleDiscord(guildId, senderUserId, targetUserId, roleId, opts, requirements) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember, targetMember] = await Promise.all([
			getGuild(rest, guildId),
			getGuildMember(rest, guildId, senderUserId),
			getGuildMember(rest, guildId, targetUserId)
		]);
		if (guild.owner_id === senderUserId) return true;
		if (guild.owner_id === targetUserId) return false;
		const targetRole = rolesById(guild).get(roleId);
		const targetRolePosition = rolePosition(targetRole);
		if (targetRolePosition < 0) return false;
		const senderPermissions = resolveMemberGuildPermissionBits({
			guild,
			member: senderMember
		});
		if (requirements?.assignablePermissionCeiling && !hasAdministrator(senderPermissions) && (BigInt(targetRole?.permissions ?? "0") & ~senderPermissions) !== 0n) return false;
		const senderHighestRolePosition = highestMemberRolePosition(guild, senderMember);
		if (senderHighestRolePosition <= targetRolePosition) return false;
		return senderHighestRolePosition > highestMemberRolePosition(guild, targetMember);
	} catch {
		return false;
	}
}
async function canManageGuildRoleDiscord(guildId, senderUserId, roleId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, senderUserId)]);
		const targetRole = rolesById(guild).get(roleId);
		if (!targetRole) return null;
		if (guild.owner_id === senderUserId) return true;
		return highestMemberRolePosition(guild, senderMember) > rolePosition(targetRole);
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or required permission bits
* matching the provided predicate.
*/
async function hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, check, opts) {
	const permissions = await fetchMemberGuildPermissionsDiscord(guildId, userId, opts);
	if (permissions === null) return false;
	if (hasAdministrator(permissions)) return true;
	return check(permissions, requiredPermissions);
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit.
*/
async function hasAnyGuildPermissionDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, (permissions, required) => required.some((permission) => hasPermissionBit(permissions, permission)), opts);
}
/**
* Returns true when the user has ADMINISTRATOR or all required permission bits.
*/
async function hasAllGuildPermissionsDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, (permissions, required) => required.every((permission) => hasPermissionBit(permissions, permission)), opts);
}
async function fetchChannelPermissionsDiscord(channelId, opts) {
	opts.signal?.throwIfAborted();
	const rest = resolveDiscordRest(opts);
	const channel = await getChannel(rest, channelId);
	opts.signal?.throwIfAborted();
	const channelType = "type" in channel ? channel.type : void 0;
	const guildId = "guild_id" in channel ? channel.guild_id : void 0;
	if (!guildId) return {
		channelId,
		permissions: [],
		raw: "0",
		isDm: true,
		channelType
	};
	const botId = await fetchBotUserId(rest);
	opts.signal?.throwIfAborted();
	const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, botId)]);
	opts.signal?.throwIfAborted();
	const permissions = resolveMemberChannelPermissionBits({
		guildId,
		userId: botId,
		guild,
		member,
		channel
	});
	return {
		channelId,
		guildId,
		permissions: bitfieldToPermissions(permissions),
		raw: permissions.toString(),
		isDm: false,
		channelType
	};
}
//#endregion
export { withValidatedDiscordProxy as S, getGateway as _, fetchMemberGuildPermissionsDiscord as a, resolveDiscordProxyFetchForAccount as b, hasAnyGuildPermissionDiscord as c, createDiscordRestClient as d, createDiscordRuntimeAccountContext as f, clearGateways as g, DISCORD_REST_TIMEOUT_MS as h, fetchChannelPermissionsDiscord as i, isThreadChannelType as l, resolveDiscordRest as m, canManageGuildRoleDiscord as n, hasAllGuildPermissionsDiscord as o, resolveDiscordClientAccountContext as p, canViewDiscordGuildChannel as r, hasAnyChannelPermissionDiscord as s, canManageGuildMemberRoleDiscord as t, createDiscordClient as u, registerGateway as v, validateDiscordProxyUrl as x, unregisterGateway as y };
