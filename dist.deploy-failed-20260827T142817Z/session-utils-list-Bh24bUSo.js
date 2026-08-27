import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey, r as isCronRunSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { n as withPinnedActivePluginRegistryWorkspaceDir } from "./runtime-workspace-state-kLYmgwOl.js";
import { d as sessionDeliveryOrigin, u as sessionDeliveryChannel } from "./delivery-context.shared-D-qPZITK.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId } from "./session-store-key-CoZdm5gl.js";
import { r as buildGroupDisplayName } from "./store-entry-shape-BcuqmtLR.js";
import { i as readAcpSessionMetaBatch } from "./session-meta-BrtiZ04k.js";
import "./sessions-B_ifzq5W.js";
import { i as resolveSessionModelIdentityRef } from "./placement-session-runtime-Bg1IJ7s4.js";
import { a as shouldKeepSubagentRunChildLink } from "./subagent-run-liveness-Xp6SfCLg.js";
import { c as getSessionDisplaySubagentRunByChildSessionKey, i as countActiveDescendantRuns } from "./subagent-registry-read-XIK3os_w.js";
import { o as resolveSessionDisplayModelIdentityRefCached, t as getSessionDefaults } from "./session-utils-model-B0LBQVk2.js";
import { C as isGroupOrChannelDisplaySession, D as parseGroupKey, E as loadGatewaySessionEntryReadOnly, F as isCurrentSessionChildOwner, I as isFinitePositiveTimestamp, L as shouldKeepStoreOnlyChildLink, P as deriveSessionTitle, a as buildSingleRowStoreChildSessionsByKey, i as buildSessionListRowMetadataContext, l as readSessionTitleFieldsFromTranscriptBatch, n as projectSessionActor, o as resolveSessionSelectedModelRef, r as buildSessionListRowContext, t as buildGatewaySessionRow } from "./session-utils-row-CriEgq90.js";
//#region src/gateway/session-utils-search.ts
function resolveSessionListSearchDisplayName(key, entry) {
	if (entry?.displayName) return entry.displayName;
	const parsed = parseGroupKey(key);
	const channel = sessionDeliveryChannel(entry) ?? parsed?.channel;
	if (isGroupOrChannelDisplaySession(entry, parsed) && channel) return buildGroupDisplayName({
		provider: channel,
		subject: entry?.subject,
		groupChannel: entry?.groupChannel,
		space: entry?.space,
		id: parsed?.id,
		key
	});
	return entry?.label ?? sessionDeliveryOrigin(entry)?.label;
}
function addSessionListSearchModelFields(fields, identity) {
	const provider = normalizeOptionalString(identity.provider);
	const model = normalizeOptionalString(identity.model);
	fields.push(provider, model);
	if (provider && model) fields.push(`${provider}/${model}`);
}
function matchesSessionListSearch(fields, search) {
	return fields.some((field) => typeof field === "string" && normalizeLowercaseStringOrEmpty(field).includes(search));
}
function appendStoredSessionModelSearchFields(fields, entry) {
	const provider = normalizeOptionalString(entry?.modelProvider);
	const model = normalizeOptionalString(entry?.model);
	fields.push(provider, model);
	if (provider && model) fields.push(`${provider}/${model}`);
}
function shouldResolveDerivedSessionModelSearchFields(search) {
	return !search.startsWith("agent:");
}
function resolveSessionListRowContext(params) {
	return params.rowContext ?? params.getRowContext?.();
}
function resolveSessionListSearchModelFields(params) {
	const agentId = normalizeAgentId(parseAgentSessionKey(params.key)?.agentId ?? params.agentId ?? resolveSessionStoreAgentId(params.cfg, params.key));
	const subagentRun = params.rowContext ? params.rowContext.subagentRuns.getDisplaySubagentRun(params.key) : getSessionDisplaySubagentRunByChildSessionKey(params.key);
	const selectedModel = resolveSessionSelectedModelRef({
		cfg: params.cfg,
		entry: params.entry,
		agentId,
		rowContext: params.rowContext,
		allowPluginNormalization: false
	});
	const resolvedModel = resolveSessionModelIdentityRef(params.cfg, params.entry, agentId, subagentRun?.model, { allowPluginNormalization: false });
	const displayModelIdentity = resolveSessionDisplayModelIdentityRefCached({
		cfg: params.cfg,
		agentId,
		provider: selectedModel.provider,
		model: selectedModel.model,
		rowContext: params.rowContext
	});
	const fields = [];
	addSessionListSearchModelFields(fields, {
		provider: params.entry?.modelProvider,
		model: params.entry?.model
	});
	addSessionListSearchModelFields(fields, resolvedModel);
	addSessionListSearchModelFields(fields, selectedModel);
	addSessionListSearchModelFields(fields, displayModelIdentity);
	return fields;
}
function loadGatewaySessionSnapshot(sessionKey, options, lightweight = false) {
	const now = options?.now ?? Date.now();
	const { cfg, storePath, store, entry, canonicalKey } = loadGatewaySessionEntryReadOnly(sessionKey, {
		clone: false,
		includeStoreChildEntries: true,
		...options?.agentId ? { agentId: options.agentId } : {}
	});
	if (!entry) return { row: null };
	const storeChildSessionsByKey = buildSingleRowStoreChildSessionsByKey({
		storePath,
		store,
		key: canonicalKey,
		now
	});
	const lifecycleRunId = entry.lifecycleRunId;
	return {
		...lifecycleRunId === void 0 ? {} : { lifecycleRunId },
		row: buildGatewaySessionRow({
			cfg,
			storePath,
			store,
			key: canonicalKey,
			entry,
			now,
			includeDerivedTitles: options?.includeDerivedTitles,
			includeLastMessage: options?.includeLastMessage,
			transcriptUsageMaxBytes: options?.transcriptUsageMaxBytes,
			storeChildSessionsByKey,
			skipTranscriptUsageFallback: lightweight,
			lightweightListRow: lightweight,
			...options?.agentId ? { agentId: options.agentId } : {}
		})
	};
}
function loadGatewaySessionLifecycleSnapshot(sessionKey, options) {
	return loadGatewaySessionSnapshot(sessionKey, options, true);
}
function loadGatewaySessionRow(sessionKey, options) {
	return loadGatewaySessionSnapshot(sessionKey, options).row;
}
function buildGatewaySessionInfo(params) {
	const now = params.now ?? Date.now();
	const storeChildSessionsByKey = buildSingleRowStoreChildSessionsByKey({
		storePath: params.storePath,
		store: params.store,
		key: params.key,
		now
	});
	return buildGatewaySessionRow({
		cfg: params.cfg,
		storePath: params.storePath,
		store: params.store,
		key: params.key,
		entry: params.entry,
		agentId: params.agentId,
		modelCatalog: params.modelCatalog,
		now,
		storeChildSessionsByKey,
		skipTranscriptUsageFallback: true,
		lightweightListRow: true
	});
}
//#endregion
//#region src/gateway/session-list-order.ts
const SESSIONS_LIST_TOP_N_LIMIT = 200;
function compareSessionEntryPairs(a, b, sortBy = "updatedAt") {
	if (sortBy !== "lastInteractionAt") {
		const aPinnedAt = a[1]?.pinnedAt ?? 0;
		const bPinnedAt = b[1]?.pinnedAt ?? 0;
		if (aPinnedAt !== bPinnedAt) return bPinnedAt - aPinnedAt;
	}
	const aTimestamp = sortBy === "lastInteractionAt" ? a[1]?.lastInteractionAt : a[1]?.updatedAt;
	const byTimestamp = ((sortBy === "lastInteractionAt" ? b[1]?.lastInteractionAt : b[1]?.updatedAt) ?? 0) - (aTimestamp ?? 0);
	if (byTimestamp !== 0) return byTimestamp;
	return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
}
function selectNewestLimitedEntries(entries, limit, sortBy) {
	const selected = [];
	for (const entry of entries) {
		const insertAt = selected.findIndex((candidate) => compareSessionEntryPairs(entry, candidate, sortBy) < 0);
		if (insertAt >= 0) {
			selected.splice(insertAt, 0, entry);
			if (selected.length > limit) selected.pop();
		} else if (selected.length < limit) selected.push(entry);
	}
	return selected;
}
function sortAndLimitSessionEntries(entries, limit, sortBy) {
	if (limit !== void 0 && limit <= SESSIONS_LIST_TOP_N_LIMIT) return selectNewestLimitedEntries(entries, limit, sortBy);
	const sorted = entries.toSorted((a, b) => compareSessionEntryPairs(a, b, sortBy));
	return limit === void 0 ? sorted : sorted.slice(0, limit);
}
//#endregion
//#region src/gateway/session-utils-list.ts
/**
* Number of session rows to build per batch before yielding to the event loop.
* Keeps the main thread responsive during large session list operations while
* avoiding excessive yielding overhead for small stores.
*/
const SESSIONS_LIST_YIELD_BATCH_SIZE = 10;
const SESSIONS_LIST_DEFAULT_LIMIT = 100;
const SESSIONS_LIST_TRANSCRIPT_FIELD_ROWS = 100;
const SESSIONS_LIST_TRANSCRIPT_USAGE_MAX_BYTES = 64 * 1024;
function preferredCreatorIdentityValue(current, candidate) {
	if (!current || !candidate) return current ?? candidate;
	return candidate < current ? candidate : current;
}
function addSessionCreatorIdentity(creators, entry, userProfileIdentityById) {
	const actor = projectSessionActor(entry.createdActor, userProfileIdentityById);
	const id = normalizeOptionalString(actor?.id);
	if (!id) return;
	const label = normalizeOptionalString(actor?.label);
	const avatarUrl = normalizeOptionalString(actor?.avatarUrl);
	const existing = creators.get(id);
	const preferredLabel = preferredCreatorIdentityValue(existing?.label, label);
	const preferredAvatarUrl = preferredCreatorIdentityValue(existing?.avatarUrl, avatarUrl);
	if (!existing || preferredLabel !== existing.label || preferredAvatarUrl !== existing.avatarUrl) creators.set(id, {
		id,
		...preferredLabel ? { label: preferredLabel } : {},
		...preferredAvatarUrl ? { avatarUrl: preferredAvatarUrl } : {}
	});
}
function sortSessionCreatorIdentities(creators) {
	return [...creators.values()].toSorted((a, b) => {
		return (a.label ?? a.id).localeCompare(b.label ?? b.id) || a.id.localeCompare(b.id);
	});
}
function populateSessionListAcpMetadata(params) {
	if (!params.rowContext || params.entries.length === 0) return;
	const entries = params.entries.map(([key, entry]) => {
		const agentId = normalizeAgentId(parseAgentSessionKey(key)?.agentId ?? params.opts.agentId ?? resolveSessionStoreAgentId(params.cfg, key));
		return {
			sessionKey: resolveStoredSessionKeyForAgentStore({
				cfg: params.cfg,
				agentId,
				sessionKey: key
			}),
			agentId,
			entry
		};
	});
	params.rowContext.acpSessionMetaByEntry = readAcpSessionMetaBatch({
		entries,
		cfg: params.cfg
	});
}
function resolveSessionsListLimit(opts, defaultLimit) {
	if (typeof opts.limit !== "number" || !Number.isFinite(opts.limit)) return defaultLimit;
	return Math.max(1, Math.floor(opts.limit));
}
function resolveSessionsListOffset(opts) {
	if (typeof opts.offset !== "number" || !Number.isFinite(opts.offset)) return 0;
	return Math.max(0, Math.floor(opts.offset));
}
function resolveSessionsListWindowLimit(limit, offset) {
	if (limit === void 0) return;
	const windowLimit = offset + limit;
	return Number.isFinite(windowLimit) ? Math.min(windowLimit, Number.MAX_SAFE_INTEGER) : void 0;
}
function filterSessionEntries(params) {
	const { cfg, store, opts, now } = params;
	const includeGlobal = opts.includeGlobal === true;
	const includeUnknown = opts.includeUnknown === true;
	const spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
	const label = normalizeOptionalString(opts.label) ?? "";
	const boardFace = opts.boardFace;
	const agentId = typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : "";
	const search = normalizeLowercaseStringOrEmpty(opts.search);
	const activeMinutes = typeof opts.activeMinutes === "number" && Number.isFinite(opts.activeMinutes) ? Math.max(1, Math.floor(opts.activeMinutes)) : void 0;
	const creatorId = normalizeOptionalString(opts.creatorId);
	const activeCutoff = activeMinutes === void 0 ? void 0 : now - activeMinutes * 6e4;
	const entries = [];
	const creators = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) {
		if (params.entryFilter && !params.entryFilter(key, entry)) continue;
		if (isCronRunSessionKey(key) || !includeGlobal && key === "global" || !includeUnknown && key === "unknown") continue;
		if (agentId) if (key === "global") {
			if (!includeGlobal) continue;
		} else if (key === "unknown") continue;
		else {
			const parsed = parseAgentSessionKey(key);
			if (!parsed || normalizeAgentId(parsed.agentId) !== agentId) continue;
		}
		if (isPhantomAgentStoreListEntry(key, entry)) continue;
		if (spawnedBy) {
			if (key === "unknown" || key === "global") continue;
			const filterRowContext = resolveSessionListRowContext(params);
			const latest = filterRowContext ? filterRowContext.subagentRuns.getDisplaySubagentRun(key) : getSessionDisplaySubagentRunByChildSessionKey(key);
			if (!(latest ? isCurrentSessionChildOwner({
				entry,
				ownerSessionKey: spawnedBy,
				controllerSessionKey: normalizeOptionalString(latest.controllerSessionKey) || normalizeOptionalString(latest.requesterSessionKey)
			}) && shouldKeepSubagentRunChildLink(latest, {
				activeDescendants: filterRowContext ? filterRowContext.subagentRuns.countActiveDescendantRuns(key) : countActiveDescendantRuns(key),
				now
			}) : shouldKeepStoreOnlyChildLink(entry, now) && (entry.spawnedBy === spawnedBy || entry.parentSessionKey === spawnedBy))) continue;
		}
		if (opts.archived !== "all") {
			const archived = entry.archivedAt !== void 0;
			if (opts.archived === true ? !archived : archived) continue;
		}
		if (opts.requireLastInteraction === true && (!isFinitePositiveTimestamp(entry.lastInteractionAt) || normalizeOptionalString(entry.heartbeatIsolatedBaseSessionKey))) continue;
		if (label && entry.label !== label || boardFace && entry.boardFace !== boardFace) continue;
		if (search) {
			const cheapFields = [
				resolveSessionListSearchDisplayName(key, entry),
				entry.label,
				entry.subject,
				entry.sessionId,
				key
			];
			appendStoredSessionModelSearchFields(cheapFields, entry);
			const cheapMatch = matchesSessionListSearch(cheapFields, search);
			const derivedMatch = !cheapMatch && shouldResolveDerivedSessionModelSearchFields(search) && matchesSessionListSearch(resolveSessionListSearchModelFields({
				...agentId ? { agentId } : {},
				cfg,
				key,
				entry,
				rowContext: resolveSessionListRowContext(params)
			}), search);
			if (!cheapMatch && !derivedMatch) continue;
		}
		if (activeCutoff !== void 0 && (entry.updatedAt ?? 0) < activeCutoff) continue;
		if (params.userProfileIdentityById) addSessionCreatorIdentity(creators, entry, params.userProfileIdentityById);
		if (creatorId && entry.createdActor?.id !== creatorId) continue;
		entries.push([key, entry]);
	}
	return {
		entries,
		creators: sortSessionCreatorIdentities(creators)
	};
}
function isPhantomAgentStoreListEntry(key, entry) {
	return parseAgentSessionKey(key)?.rest === "sessions" && !normalizeOptionalString(entry?.sessionId) && entry?.updatedAt == null;
}
function selectSessionEntries(params) {
	const { creators, entries: filtered } = filterSessionEntries(params);
	const limit = resolveSessionsListLimit(params.opts, params.defaultLimit);
	const offset = resolveSessionsListOffset(params.opts);
	const sortedWindow = sortAndLimitSessionEntries(filtered, resolveSessionsListWindowLimit(limit, offset), params.opts.sortBy);
	const entries = limit === void 0 ? sortedWindow.slice(offset) : sortedWindow.slice(offset, offset + limit);
	const nextOffset = offset + entries.length;
	const hasMore = nextOffset < filtered.length;
	return {
		entries,
		creators,
		totalCount: filtered.length,
		limitApplied: limit,
		offset,
		nextOffset: hasMore ? nextOffset : null,
		hasMore
	};
}
function prepareSessionList(params) {
	const { cfg, store, opts } = params;
	const now = Date.now();
	const userProfileIdentityById = /* @__PURE__ */ new Map();
	let rowContext;
	const getRowContext = () => {
		rowContext ??= buildSessionListRowContext({
			store,
			now,
			userProfileIdentityById
		});
		return rowContext;
	};
	const hasSpawnedByFilter = typeof opts.spawnedBy === "string" && opts.spawnedBy.length > 0;
	const filteredSessionKeys = /* @__PURE__ */ new Set();
	let hasIncognito = false;
	const entryFilter = (key, entry) => {
		if (params.entryFilter && !params.entryFilter(key, entry)) {
			filteredSessionKeys.add(key);
			return false;
		}
		hasIncognito ||= entry.incognito === true || isIncognitoSessionKey(key);
		return true;
	};
	const selection = selectSessionEntries({
		cfg,
		store,
		opts,
		now,
		entryFilter,
		getRowContext: hasSpawnedByFilter || Boolean(normalizeOptionalString(opts.search)) ? getRowContext : void 0,
		defaultLimit: SESSIONS_LIST_DEFAULT_LIMIT,
		userProfileIdentityById
	});
	const fullRowContext = rowContext || hasSpawnedByFilter || filteredSessionKeys.size > 0 || selection.entries.length > SESSIONS_LIST_YIELD_BATCH_SIZE ? getRowContext() : void 0;
	if (fullRowContext && filteredSessionKeys.size > 0) for (const [parentKey, childKeys] of fullRowContext.storeChildSessionsByKey) fullRowContext.storeChildSessionsByKey.set(parentKey, childKeys.filter((key) => !filteredSessionKeys.has(key)));
	const sharedRowContext = fullRowContext ?? (selection.entries.length > 0 ? buildSessionListRowMetadataContext({
		now,
		userProfileIdentityById
	}) : void 0);
	populateSessionListAcpMetadata({
		cfg,
		entries: selection.entries,
		opts,
		rowContext: sharedRowContext
	});
	return {
		...selection,
		includeDerivedTitles: opts.includeDerivedTitles === true,
		includeLastMessage: opts.includeLastMessage === true,
		now,
		rowContext: sharedRowContext,
		storeChildSessionsByKey: fullRowContext?.storeChildSessionsByKey,
		storePath: hasIncognito ? params.storePath : params.durableStorePath ?? params.storePath
	};
}
function buildSessionsListResult(params) {
	const { list, sessions } = params;
	return {
		ts: list.now,
		path: list.storePath,
		count: sessions.length,
		totalCount: list.totalCount,
		limitApplied: list.limitApplied,
		offset: list.offset > 0 ? list.offset : void 0,
		nextOffset: list.nextOffset,
		hasMore: list.hasMore,
		creators: list.creators,
		defaults: getSessionDefaults(params.cfg, params.modelCatalog, {
			...params.agentId ? { agentId: params.agentId } : {},
			allowPluginNormalization: false
		}),
		sessions
	};
}
function filterAndSortSessionEntries(params) {
	return selectSessionEntries(params).entries;
}
function listSessionsFromStore(params) {
	const { cfg, store, opts } = params;
	const list = prepareSessionList(params);
	const sessions = list.entries.map(([key, entry], index) => {
		const includeTranscriptFields = index < SESSIONS_LIST_TRANSCRIPT_FIELD_ROWS;
		const rowAgentId = !parseAgentSessionKey(key) && typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : void 0;
		const storeChildSessionsByKey = list.storeChildSessionsByKey ?? buildSingleRowStoreChildSessionsByKey({
			store,
			storePath: list.storePath,
			key,
			now: list.now
		});
		return buildGatewaySessionRow({
			cfg,
			storePath: list.storePath,
			store,
			key,
			entry,
			agentId: rowAgentId,
			modelCatalog: params.modelCatalog,
			now: list.now,
			includeDerivedTitles: includeTranscriptFields && list.includeDerivedTitles,
			includeLastMessage: includeTranscriptFields && list.includeLastMessage,
			transcriptUsageMaxBytes: SESSIONS_LIST_TRANSCRIPT_USAGE_MAX_BYTES,
			storeChildSessionsByKey,
			rowContext: list.rowContext,
			skipTranscriptUsageFallback: params.lightweightListRows === true,
			lightweightListRow: params.lightweightListRows === true
		});
	});
	return buildSessionsListResult({
		cfg,
		list,
		modelCatalog: params.modelCatalog,
		sessions,
		agentId: opts.agentId
	});
}
/**
* Async version of listSessionsFromStore that yields to the event loop between
* batches of session row builds. This prevents large session stores from
* blocking the event loop during sessions.list requests.
*
* The synchronous file I/O in readSessionTitleFieldsFromTranscript (head/tail
* reads for derived titles and last-message previews) is the dominant blocker.
* By yielding every SESSIONS_LIST_YIELD_BATCH_SIZE rows, we keep the event
* loop responsive for WebSocket heartbeats, channel I/O, and concurrent RPC.
*/
async function listSessionsFromStoreAsync(params) {
	return withPinnedActivePluginRegistryWorkspaceDir(async () => {
		const { cfg, store, opts } = params;
		const list = prepareSessionList(params);
		const sessions = [];
		const transcriptFields = readSessionTitleFieldsFromTranscriptBatch(list.entries.slice(0, SESSIONS_LIST_TRANSCRIPT_FIELD_ROWS).flatMap(([key, entry]) => {
			if (!entry.sessionId || !list.includeDerivedTitles && !list.includeLastMessage) return [];
			return [{
				agentId: normalizeAgentId(parseAgentSessionKey(key)?.agentId ?? opts.agentId ?? resolveSessionStoreAgentId(cfg, key)),
				sessionEntry: entry,
				sessionId: entry.sessionId,
				sessionKey: key,
				storePath: list.storePath
			}];
		}));
		let transcriptFieldIndex = 0;
		for (let i = 0; i < list.entries.length; i++) {
			const [key, entry] = expectDefined(list.entries[i], "entries entry at i");
			const includeTranscriptFields = i < SESSIONS_LIST_TRANSCRIPT_FIELD_ROWS;
			const rowAgentId = !parseAgentSessionKey(key) && typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : void 0;
			const storeChildSessionsByKey = list.storeChildSessionsByKey ?? buildSingleRowStoreChildSessionsByKey({
				store,
				storePath: list.storePath,
				key,
				now: list.now
			});
			const row = buildGatewaySessionRow({
				cfg,
				storePath: list.storePath,
				store,
				key,
				entry,
				agentId: rowAgentId,
				modelCatalog: params.modelCatalog,
				now: list.now,
				includeDerivedTitles: false,
				includeLastMessage: false,
				transcriptUsageMaxBytes: SESSIONS_LIST_TRANSCRIPT_USAGE_MAX_BYTES,
				storeChildSessionsByKey,
				rowContext: list.rowContext,
				skipTranscriptUsageFallback: true,
				lightweightListRow: true
			});
			if (entry?.sessionId && includeTranscriptFields && (list.includeDerivedTitles || list.includeLastMessage)) {
				const fields = expectDefined(transcriptFields[transcriptFieldIndex], "batched transcript fields at transcriptFieldIndex");
				transcriptFieldIndex += 1;
				if (list.includeDerivedTitles) row.derivedTitle = deriveSessionTitle(entry, fields.firstUserMessage, row.displayName);
				if (list.includeLastMessage && fields.lastMessagePreview) row.lastMessagePreview = fields.lastMessagePreview;
			}
			sessions.push(row);
			if ((i + 1) % SESSIONS_LIST_YIELD_BATCH_SIZE === 0 && i + 1 < list.entries.length) await new Promise((resolve) => {
				setImmediate(resolve);
			});
		}
		return buildSessionsListResult({
			cfg,
			list,
			modelCatalog: params.modelCatalog,
			sessions,
			agentId: opts.agentId
		});
	});
}
//#endregion
export { loadGatewaySessionLifecycleSnapshot as a, buildGatewaySessionInfo as i, listSessionsFromStore as n, loadGatewaySessionRow as o, listSessionsFromStoreAsync as r, filterAndSortSessionEntries as t };
