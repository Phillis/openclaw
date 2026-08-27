import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import "./secret-input-Dv7SE4A5.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-D7ikroCS.js";
import { r as loadOutboundMediaFromUrl } from "./outbound-media-Ci_bzMDI.js";
import { t as createPluginStateErrorReporter } from "./plugin-state-runtime-DAP586jS.js";
import "./channel-plugin-common-BP9KEgN5.js";
import "./channel-status-yY5FGndl.js";
import "./channel-config-schema-B2VBzFY9.js";
import "./channel-actions-CeWsyukw.js";
import "./global-singleton-lspSlNkM.js";
import { s as resolveDiscordAccount } from "./accounts-B99sjC_p.js";
import { D as serializePayload, Vt as ChannelType, X as stripUndefinedFields, ct as editChannelMessage, rt as createChannelMessage } from "./discord-BinpTEur.js";
import { T as parseAndResolveChannelRecipient, g as createDiscordMessageNonce, l as resolveChannelId, m as SUPPRESS_NOTIFICATIONS_FLAG, t as buildDiscordSendError, u as resolveDiscordChannel } from "./send.shared-CblqS8jj.js";
import { u as createDiscordClient } from "./send.permissions-g2olELEg.js";
import { n as getOptionalDiscordRuntime } from "./runtime-Dg4d9hPu.js";
import { a as buildDiscordComponentMessageFlags, c as resolveDiscordComponentAttachmentName, i as buildDiscordComponentMessage } from "./components-C2i6A_i7.js";
import "./config-schema-ysh-xpzB.js";
import "./channel-api-CWlbI7Qw.js";
import "./outbound-session-route-2qf9cpbr.js";
import { t as sendMessageDiscord } from "./send.outbound-XNvT1kRh.js";
import { r as createDiscordSendResult } from "./send.receipt-g9xE8OC3.js";
//#region extensions/discord/src/components-registry-state.ts
const discordComponentRegistryState = resolveGlobalSingleton(Symbol.for("openclaw.discord.componentRegistryState"), () => ({
	componentEntries: /* @__PURE__ */ new Map(),
	modalEntries: /* @__PURE__ */ new Map(),
	persistentComponentStore: void 0,
	persistentModalStore: void 0,
	persistentRegistryDisabled: false
}), (state) => {
	state.componentEntries.clear();
	state.modalEntries.clear();
	state.persistentComponentStore = void 0;
	state.persistentModalStore = void 0;
	state.persistentRegistryDisabled = false;
});
//#endregion
//#region extensions/discord/src/components-registry.ts
const DEFAULT_COMPONENT_TTL_MS = 1800 * 1e3;
const PERSISTENT_COMPONENT_NAMESPACE = "discord.components";
const PERSISTENT_MODAL_NAMESPACE = "discord.modals";
const PERSISTENT_COMPONENT_MAX_ENTRIES = 500;
const PERSISTENT_MODAL_MAX_ENTRIES = 500;
function getComponentEntries() {
	return discordComponentRegistryState.componentEntries;
}
function getModalEntries() {
	return discordComponentRegistryState.modalEntries;
}
function formatRegistryError(error) {
	if (!(error instanceof Error)) return { error: formatRegistryErrorValue(error) };
	const details = {
		error: String(error),
		errorName: error.name,
		errorMessage: error.message
	};
	if (error.stack) details.errorStack = error.stack;
	const cause = error.cause;
	if (cause instanceof Error) {
		details.errorCause = String(cause);
		details.errorCauseName = cause.name;
		details.errorCauseMessage = cause.message;
		if (cause.stack) details.errorCauseStack = cause.stack;
	} else if (cause !== void 0) details.errorCause = formatRegistryErrorValue(cause);
	return details;
}
const reportPersistentComponentRegistryError = createPluginStateErrorReporter(getOptionalDiscordRuntime, "discord", "component-registry-state", "Discord persistent component registry state failed", formatRegistryError);
function formatRegistryErrorValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
	if (value === null) return "null";
	try {
		return JSON.stringify(value) ?? Object.prototype.toString.call(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
function disablePersistentComponentRegistry(error) {
	discordComponentRegistryState.persistentRegistryDisabled = true;
	discordComponentRegistryState.persistentComponentStore = void 0;
	discordComponentRegistryState.persistentModalStore = void 0;
	reportPersistentComponentRegistryError(error);
}
function getPersistentComponentStore() {
	if (discordComponentRegistryState.persistentRegistryDisabled) return;
	if (discordComponentRegistryState.persistentComponentStore) return discordComponentRegistryState.persistentComponentStore;
	const runtime = getOptionalDiscordRuntime();
	if (!runtime) return;
	try {
		discordComponentRegistryState.persistentComponentStore = runtime.state.openKeyedStore({
			namespace: PERSISTENT_COMPONENT_NAMESPACE,
			maxEntries: PERSISTENT_COMPONENT_MAX_ENTRIES,
			defaultTtlMs: DEFAULT_COMPONENT_TTL_MS
		});
		return discordComponentRegistryState.persistentComponentStore;
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return;
	}
}
function getPersistentModalStore() {
	if (discordComponentRegistryState.persistentRegistryDisabled) return;
	if (discordComponentRegistryState.persistentModalStore) return discordComponentRegistryState.persistentModalStore;
	const runtime = getOptionalDiscordRuntime();
	if (!runtime) return;
	try {
		discordComponentRegistryState.persistentModalStore = runtime.state.openKeyedStore({
			namespace: PERSISTENT_MODAL_NAMESPACE,
			maxEntries: PERSISTENT_MODAL_MAX_ENTRIES,
			defaultTtlMs: DEFAULT_COMPONENT_TTL_MS
		});
		return discordComponentRegistryState.persistentModalStore;
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return;
	}
}
function isExpired(entry, now) {
	return entry.expiresAt !== void 0 && !isFutureDateTimestampMs(entry.expiresAt, { nowMs: now });
}
function normalizeEntryTimestamps(entry, now, ttlMs) {
	const createdAt = resolveDateTimestampMs(entry.createdAt, now);
	const expiresAt = asDateTimestampMs(entry.expiresAt) ?? resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: createdAt }) ?? 0;
	return {
		...entry,
		createdAt,
		expiresAt
	};
}
function pruneUndefinedRegistryValues(value) {
	if (Array.isArray(value)) return value.filter((entry) => entry !== void 0).map((entry) => pruneUndefinedRegistryValues(entry));
	if (!value || typeof value !== "object") return value;
	const result = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry === void 0) continue;
		result[key] = pruneUndefinedRegistryValues(entry);
	}
	return result;
}
function registerEntries(entries, store, params) {
	const normalizedEntries = [];
	for (const entry of entries) {
		const normalized = normalizeEntryTimestamps({
			...entry,
			messageId: params.messageId ?? entry.messageId
		}, params.now, params.ttlMs);
		store.set(entry.id, normalized);
		normalizedEntries.push(normalized);
	}
	return normalizedEntries;
}
function resolveEntry(store, params) {
	const entry = store.get(params.id);
	if (!entry) return null;
	if (isExpired(entry, Date.now())) {
		store.delete(params.id);
		return null;
	}
	if (params.consume !== false) store.delete(params.id);
	return entry;
}
function readPersistedRegistryEntry(persisted) {
	if (persisted?.version !== 1 || typeof persisted.entry?.id !== "string") return null;
	return persisted.entry;
}
function registerPersistentRegistryEntries(params) {
	if (params.entries.length === 0) return;
	const store = params.openStore();
	if (!store) return;
	for (const entry of params.entries) {
		const persistedEntry = pruneUndefinedRegistryValues(entry);
		store.register(entry.id, {
			version: 1,
			entry: persistedEntry
		}, { ttlMs: params.ttlMs }).catch(disablePersistentComponentRegistry);
	}
}
function registerPersistentEntries(params) {
	registerPersistentRegistryEntries({
		entries: params.entries,
		ttlMs: params.ttlMs,
		openStore: getPersistentComponentStore
	});
	registerPersistentRegistryEntries({
		entries: params.modals,
		ttlMs: params.ttlMs,
		openStore: getPersistentModalStore
	});
}
function deletePersistentEntry(params) {
	const store = params.openStore();
	if (!store) return;
	store.delete(params.id).catch(disablePersistentComponentRegistry);
}
function resolveComponentConsumptionIds(entry) {
	if (!entry.consumptionGroupId) return [entry.id];
	const ids = entry.consumptionGroupEntryIds?.filter((id) => typeof id === "string" && id) ?? [];
	return ids.length > 0 ? uniqueStrings(ids) : [entry.id];
}
function deleteComponentConsumptionGroup(entry) {
	const store = getComponentEntries();
	for (const id of resolveComponentConsumptionIds(entry)) store.delete(id);
}
function deletePersistentComponentConsumptionGroup(entry) {
	const store = getPersistentComponentStore();
	if (!store) return;
	for (const id of resolveComponentConsumptionIds(entry)) store.delete(id).catch(disablePersistentComponentRegistry);
}
async function resolvePersistentRegistryEntry(params) {
	const store = params.openStore();
	if (!store) return null;
	try {
		return readPersistedRegistryEntry(params.consume === false ? await store.lookup(params.id) : await store.consume(params.id));
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return null;
	}
}
function registerDiscordComponentEntries(params) {
	const now = Date.now();
	const ttlMs = params.ttlMs ?? DEFAULT_COMPONENT_TTL_MS;
	registerPersistentEntries({
		entries: registerEntries(params.entries, getComponentEntries(), {
			now,
			ttlMs,
			messageId: params.messageId
		}),
		modals: registerEntries(params.modals, getModalEntries(), {
			now,
			ttlMs,
			messageId: params.messageId
		}),
		ttlMs
	});
}
function resolveDiscordComponentEntry(params) {
	const entry = resolveEntry(getComponentEntries(), params);
	if (entry && params.consume !== false) deleteComponentConsumptionGroup(entry);
	return entry;
}
async function resolveDiscordComponentEntryWithPersistence(params) {
	const inMemory = resolveDiscordComponentEntry(params);
	if (inMemory) {
		if (params.consume !== false) deletePersistentComponentConsumptionGroup(inMemory);
		return inMemory;
	}
	const persisted = await resolvePersistentRegistryEntry({
		...params,
		openStore: getPersistentComponentStore
	});
	if (persisted && params.consume !== false) deletePersistentComponentConsumptionGroup(persisted);
	return persisted;
}
function resolveDiscordModalEntry(params) {
	return resolveEntry(getModalEntries(), params);
}
async function resolveDiscordModalEntryWithPersistence(params) {
	const inMemory = resolveDiscordModalEntry(params);
	if (inMemory) {
		if (params.consume !== false) deletePersistentEntry({
			...params,
			openStore: getPersistentModalStore
		});
		return inMemory;
	}
	return await resolvePersistentRegistryEntry({
		...params,
		openStore: getPersistentModalStore
	});
}
//#endregion
//#region extensions/discord/src/send.components.ts
const DISCORD_FORUM_LIKE_TYPES = /* @__PURE__ */ new Set([ChannelType.GuildForum, ChannelType.GuildMedia]);
function extractComponentAttachmentNames(spec) {
	const names = [];
	for (const block of spec.blocks ?? []) if (block.type === "file") names.push(resolveDiscordComponentAttachmentName(block.file));
	return names;
}
function hasComponentAttachmentBlock(spec) {
	return (spec.blocks ?? []).some((block) => block.type === "file");
}
function withImplicitComponentAttachmentBlock(spec, attachmentName) {
	if (!attachmentName || hasComponentAttachmentBlock(spec)) return spec;
	return {
		...spec,
		blocks: [...spec.blocks ?? [], {
			type: "file",
			file: `attachment://${attachmentName}`
		}]
	};
}
function hasClassicOnlyBlocks(spec) {
	return (spec.blocks ?? []).every((block) => block.type === "text" || block.type === "file");
}
function hasUnsupportedClassicFeatures(spec) {
	return Boolean(spec.modal || spec.container);
}
function hasAtMostOneNonSpoilerFile(spec) {
	let fileBlockCount = 0;
	for (const block of spec.blocks ?? []) {
		if (block.type !== "file") continue;
		fileBlockCount += 1;
		if (block.spoiler) return false;
	}
	return fileBlockCount <= 1;
}
/**
* Keep the downgrade rules explicit because this path is only safe when the
* spec means exactly what a plain Discord message can represent.
*/
function getClassicDiscordMessageDecision(spec) {
	if (hasUnsupportedClassicFeatures(spec)) return {
		mode: "components",
		reason: "unsupported-feature"
	};
	if (!hasClassicOnlyBlocks(spec)) return {
		mode: "components",
		reason: "unsupported-block"
	};
	if (!hasAtMostOneNonSpoilerFile(spec)) return {
		mode: "components",
		reason: "multiple-or-spoiler-files"
	};
	return {
		mode: "classic",
		reason: "plain-text-single-file"
	};
}
function collapseClassicComponentText(spec) {
	const parts = [];
	const addPart = (value) => {
		if (typeof value !== "string") return;
		const trimmed = value.trim();
		if (!trimmed || parts.includes(trimmed)) return;
		parts.push(trimmed);
	};
	addPart(spec.text);
	for (const block of spec.blocks ?? []) if (block.type === "text") addPart(block.text);
	return parts.join("\n\n");
}
function registerBuiltDiscordComponentMessage(params) {
	registerDiscordComponentEntries({
		entries: params.buildResult.entries,
		modals: params.buildResult.modals,
		messageId: params.messageId,
		ttlMs: params.ttlMs
	});
}
function resolveDiscordComponentRegistryTtlMs(accountConfig) {
	const ttlMs = accountConfig?.agentComponents?.ttlMs;
	return typeof ttlMs === "number" && Number.isFinite(ttlMs) && ttlMs > 0 ? Math.floor(ttlMs) : void 0;
}
async function buildDiscordComponentPayload(params) {
	const messageReference = params.opts.reply ? {
		message_id: params.opts.reply.messageId,
		fail_if_not_exists: false
	} : void 0;
	let spec = params.spec;
	let resolvedFileName;
	let files;
	if (params.opts.mediaUrl) {
		const media = await loadOutboundMediaFromUrl(params.opts.mediaUrl, {
			mediaAccess: params.opts.mediaAccess,
			mediaLocalRoots: params.opts.mediaLocalRoots,
			mediaReadFile: params.opts.mediaReadFile
		});
		resolvedFileName = params.opts.filename?.trim() || media.fileName || "upload";
		spec = withImplicitComponentAttachmentBlock(spec, resolvedFileName);
		files = [{
			data: media.buffer,
			name: resolvedFileName,
			contentType: media.contentType
		}];
	}
	const uniqueAttachmentNames = uniqueStrings(extractComponentAttachmentNames(spec));
	if (uniqueAttachmentNames.length > 1) throw new Error("Discord component attachments currently support a single file. Use media-gallery for multiple files.");
	const expectedAttachmentName = uniqueAttachmentNames[0];
	if (expectedAttachmentName && resolvedFileName && expectedAttachmentName !== resolvedFileName) throw new Error(`Component file block expects attachment "${expectedAttachmentName}", but the uploaded file is "${resolvedFileName}". Update components.blocks[].file or provide a matching filename.`);
	if (!params.opts.mediaUrl && expectedAttachmentName) throw new Error("Discord component file blocks require a media attachment (media/path/filePath).");
	const buildResult = buildDiscordComponentMessage({
		spec,
		sessionKey: params.opts.sessionKey,
		agentId: params.opts.agentId,
		accountId: params.accountId
	});
	const flags = buildDiscordComponentMessageFlags(buildResult.components);
	const finalFlags = params.opts.silent ? (flags ?? 0) | SUPPRESS_NOTIFICATIONS_FLAG : flags ?? void 0;
	return {
		body: stripUndefinedFields({
			...serializePayload({
				components: buildResult.components,
				allowed_mentions: params.opts.allowedMentions,
				...finalFlags ? { flags: finalFlags } : {},
				...files ? { files } : {}
			}),
			...messageReference ? { message_reference: messageReference } : {}
		}),
		buildResult
	};
}
async function sendDiscordComponentMessage(to, spec, opts) {
	const classicDecision = getClassicDiscordMessageDecision(spec);
	if (opts.mediaUrl && classicDecision.mode === "classic") return await sendMessageDiscord(to, collapseClassicComponentText(spec), {
		cfg: opts.cfg,
		accountId: opts.accountId,
		token: opts.token,
		rest: opts.rest,
		mediaUrl: opts.mediaUrl,
		filename: opts.filename,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile,
		mediaAccess: opts.mediaAccess,
		reply: opts.reply,
		silent: opts.silent,
		textLimit: opts.textLimit,
		maxLinesPerMessage: opts.maxLinesPerMessage,
		tableMode: opts.tableMode,
		chunkMode: opts.chunkMode,
		onDeliveryResult: opts.onDeliveryResult,
		onPlatformSendDispatch: opts.onPlatformSendDispatch,
		...opts.suppressEmbeds === void 0 ? {} : { suppressEmbeds: opts.suppressEmbeds }
	});
	const cfg = requireRuntimeConfig(opts.cfg, "Discord component send");
	const accountInfo = resolveDiscordAccount({
		cfg,
		accountId: opts.accountId
	});
	const { token, rest, request } = createDiscordClient({
		...opts,
		cfg
	});
	const { channelId } = await resolveChannelId(rest, await parseAndResolveChannelRecipient(to, cfg, opts.accountId), request);
	const channel = await resolveDiscordChannel(rest, channelId);
	if (channel && DISCORD_FORUM_LIKE_TYPES.has(channel.type)) throw new Error("Discord components are not supported in forum-style channels");
	const { body: componentBody, buildResult } = await buildDiscordComponentPayload({
		spec,
		opts,
		accountId: accountInfo.accountId
	});
	const body = {
		...componentBody,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true
	};
	let result;
	try {
		await opts.onPlatformSendDispatch?.();
		result = await request(() => createChannelMessage(rest, channelId, { body }), "components", { safety: "nonce-protected-create" });
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	const deliveryResult = createDiscordSendResult({
		result,
		fallbackChannelId: channelId,
		kind: "card",
		...opts.reply ? { reply: opts.reply } : {}
	});
	await opts.onDeliveryResult?.(deliveryResult);
	registerBuiltDiscordComponentMessage({
		buildResult,
		messageId: result.id,
		ttlMs: resolveDiscordComponentRegistryTtlMs(accountInfo.config)
	});
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return deliveryResult;
}
async function editDiscordComponentMessage(to, messageId, spec, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord component edit");
	const accountInfo = resolveDiscordAccount({
		cfg,
		accountId: opts.accountId
	});
	const { token, rest, request } = createDiscordClient({
		...opts,
		cfg
	});
	const { channelId } = await resolveChannelId(rest, await parseAndResolveChannelRecipient(to, cfg, opts.accountId), request);
	const { body, buildResult } = await buildDiscordComponentPayload({
		spec,
		opts,
		accountId: accountInfo.accountId
	});
	let result;
	try {
		result = await request(() => editChannelMessage(rest, channelId, messageId, { body }), "components");
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	registerBuiltDiscordComponentMessage({
		buildResult,
		messageId: result.id ?? messageId,
		ttlMs: resolveDiscordComponentRegistryTtlMs(accountInfo.config)
	});
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return createDiscordSendResult({
		result: {
			id: result.id ?? messageId,
			channel_id: result.channel_id
		},
		fallbackChannelId: channelId,
		kind: "card",
		...opts.reply ? { reply: opts.reply } : {}
	});
}
//#endregion
export { resolveDiscordModalEntryWithPersistence as a, resolveDiscordComponentEntryWithPersistence as i, registerBuiltDiscordComponentMessage as n, sendDiscordComponentMessage as r, editDiscordComponentMessage as t };
