import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { i as isPerAgentSessionStoreConfig, n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-BGbniDph.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { a as measureDiagnosticsTimelineSpan, o as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DwkG9AHk.js";
import { h as readAgentRunIndexVersion, n as buildProjectedAgentRunIndex } from "./agent-run-registry-cxavoLf6.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-CoZdm5gl.js";
import { qt as listSessionEntriesReadOnly } from "./session-accessor-Bi6bzKQE.js";
import { s as resolveExistingAgentSessionStoreTargetsSync, t as isConfiguredSessionStoreAgentId } from "./targets-DxP0vsft.js";
import { _ as readSessionIdentityMutationVersion } from "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { y as loadTranscriptEvents } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { i as readSessionTranscriptUpdateVersion } from "./transcript-events-D-a7D51Y.js";
import { Gr as validateSessionsListParams, Qr as validateSessionsPreviewParams, ii as validateSessionsSearchParams, jr as validateSessionsDescribeParams, ni as validateSessionsResolveParams, oi as validateSessionsSendReconcileParams, xr as validateSessionsCleanupParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-BoGkmc3E.js";
import { u as listSessionMembershipKeys } from "./sessions-D-jhKYGW.js";
import { i as serializeSessionCleanupResult, r as runSessionsCleanup } from "./cleanup-service-DfYBGbUO.js";
import { d as readSessionPreviewItemsFromTranscript, i as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-CJcK7eRo.js";
import { M as resolveGatewaySessionStoreTarget, N as resolveGatewaySessionStoreTargetWithStore, k as resolveCanonicalSessionEntryFromStoreKeys, p as readSessionAutomationVersion, t as buildGatewaySessionRow, u as readSessionTitleProjectionUnavailableVersion } from "./session-utils-row-pCr636Wc.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId, t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { r as listSessionsFromStoreAsync } from "./session-utils-list-B0UK93uu.js";
import "./session-utils-CCDcSRdK.js";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript-BVy1mkbt.js";
import { t as searchSessionTranscripts } from "./session-transcript-search-DpQeXU8V.js";
import { h as resolveSessionVisibility, l as createSessionListEntryFilter, m as resolveSessionSharingTarget, o as canAccessIncognitoSession, p as resolveSessionSharingRole, u as isGatewayAdmin, v as gatewayClientSessionCreator } from "./session-sharing-DOLHhSnW.js";
import { i as resolveVisibleActiveSessionRunState, t as collectTrackedActiveSessionRuns } from "./session-active-runs-DKnYoEyq.js";
import { i as readSessionsMutationVersion, n as emitSessionsChanged } from "./session-change-event-DpwrobLa.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as readPreparedServerMethodModelCatalog } from "./optional-model-catalog-CLG2tIS6.js";
import { a as readSessionLifecyclePersistenceVersion } from "./session-lifecycle-state-DzLIsG_S.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-DHgDJRdP.js";
import { t as projectWorkerSessionPlacement } from "./placement-projector-CzC20wfT.js";
import { l as requireSessionKey, n as filterSessionStoreToConfiguredAgents, o as loadSessionEntriesForTarget } from "./sessions-shared-DsqJJjAE.js";
//#region src/gateway/server-methods/sessions-list-cache.ts
const SESSIONS_LIST_COMPLETED_CACHE_LIMIT = 64;
const sessionListsByContext = /* @__PURE__ */ new WeakMap();
function readSessionListFence(context) {
	return {
		agentRunIndexVersion: readAgentRunIndexVersion(),
		lifecyclePersistenceVersion: readSessionLifecyclePersistenceVersion(),
		sessionAutomationVersion: readSessionAutomationVersion(),
		sessionIdentityMutationVersion: readSessionIdentityMutationVersion(),
		sessionsMutationVersion: readSessionsMutationVersion(context),
		sessionTranscriptUpdateVersion: readSessionTranscriptUpdateVersion(),
		titleProjectionUnavailableVersion: readSessionTitleProjectionUnavailableVersion(),
		workerPlacementDiskSpaceVersion: context.workerPlacementDiskSpaceReader?.version() ?? 0
	};
}
function matchesSessionListFence(value, fence) {
	return value.agentRunIndexVersion === fence.agentRunIndexVersion && value.lifecyclePersistenceVersion === fence.lifecyclePersistenceVersion && value.sessionAutomationVersion === fence.sessionAutomationVersion && value.sessionIdentityMutationVersion === fence.sessionIdentityMutationVersion && value.sessionsMutationVersion === fence.sessionsMutationVersion && value.sessionTranscriptUpdateVersion === fence.sessionTranscriptUpdateVersion && value.titleProjectionUnavailableVersion === fence.titleProjectionUnavailableVersion && value.workerPlacementDiskSpaceVersion === fence.workerPlacementDiskSpaceVersion;
}
function sessionListVisibilityIdentity(client) {
	if (isGatewayAdmin(client)) return "admin";
	const profileId = gatewayClientSessionCreator(client)?.id;
	return profileId ? `profile:${profileId}` : "anonymous";
}
function sessionListWorkKey(params, client) {
	return JSON.stringify([sessionListVisibilityIdentity(client), Object.entries(params).toSorted(([left], [right]) => left.localeCompare(right))]);
}
function sessionListState(context, config) {
	let state = sessionListsByContext.get(context);
	if (!state || state.config !== config) {
		state = {
			completed: /* @__PURE__ */ new Map(),
			config,
			inFlight: /* @__PURE__ */ new Map()
		};
		sessionListsByContext.set(context, state);
	}
	return state;
}
function rememberCompletedSessionList(state, workKey, completed) {
	state.completed.delete(workKey);
	state.completed.set(workKey, completed);
	while (state.completed.size > SESSIONS_LIST_COMPLETED_CACHE_LIMIT) {
		const oldest = state.completed.keys().next().value;
		if (oldest === void 0) break;
		state.completed.delete(oldest);
	}
}
function resolveSessionListExpiration(result) {
	let expiresAt;
	for (const session of result.sessions) {
		if (session.hasActiveRun || session.hasActiveSubagentRun || session.childSessions?.length) return null;
		const statusExpiration = session.agentStatus?.expiresAt;
		if (statusExpiration !== void 0 && (expiresAt === void 0 || statusExpiration < expiresAt)) expiresAt = statusExpiration;
	}
	return expiresAt;
}
async function respondWithCachedSessionList(params) {
	const workKey = sessionListWorkKey(params.request, params.client);
	const state = sessionListState(params.context, params.config);
	const fence = readSessionListFence(params.context);
	const cacheCompleted = params.request.activeMinutes === void 0 && !params.request.spawnedBy;
	const completed = cacheCompleted ? state.completed.get(workKey) : void 0;
	if (completed && matchesSessionListFence(completed, fence) && (completed.expiresAt === void 0 || completed.expiresAt > Date.now())) {
		params.respond(true, completed.result, void 0);
		return;
	}
	const pending = state.inFlight.get(workKey);
	if (pending && matchesSessionListFence(pending, fence)) {
		params.respond(true, await pending.promise, void 0);
		return;
	}
	const promise = Promise.resolve().then(params.run).then((result) => {
		if (cacheCompleted && matchesSessionListFence(readSessionListFence(params.context), fence)) {
			const expiresAt = resolveSessionListExpiration(result);
			if (expiresAt !== null && (expiresAt === void 0 || expiresAt > Date.now())) rememberCompletedSessionList(state, workKey, {
				...fence,
				result,
				expiresAt
			});
		}
		return result;
	});
	const operation = {
		...fence,
		promise
	};
	state.inFlight.set(workKey, operation);
	try {
		params.respond(true, await promise, void 0);
	} finally {
		if (state.inFlight.get(workKey) === operation) state.inFlight.delete(workKey);
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-search-scope.ts
function resolveSessionSearchScope(cfg, params) {
	const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	const resolvedSessionKeys = params.sessionKeys ? [] : void 0;
	for (const sessionKey of params.sessionKeys ?? []) {
		const requestedAgent = requestedAgentId && !isConfiguredSessionStoreAgentId(cfg, requestedAgentId) && resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey).kind === "none" ? {
			ok: true,
			agentId: requestedAgentId
		} : resolveRequestedSessionAgentId(cfg, sessionKey, requestedAgentId);
		if (!requestedAgent.ok) return {
			ok: false,
			error: requestedAgent.error
		};
		resolvedSessionKeys?.push({
			sessionKey: requestedAgent.agentId ? resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId: requestedAgent.agentId,
				sessionKey
			}) : resolveSessionStoreKey({
				cfg,
				sessionKey
			}),
			agentId: requestedAgent.agentId
		});
	}
	const sessionKeys = resolvedSessionKeys?.map((resolved) => resolved.sessionKey);
	const agentIds = new Set(resolvedSessionKeys?.map((resolved) => resolved.agentId ? resolved.agentId : resolveSessionStoreAgentId(cfg, resolved.sessionKey)));
	if (agentIds.size > 1 || requestedAgentId && [...agentIds].some((agentId) => agentId !== requestedAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.search supports one agent per call")
	};
	let agentId = requestedAgentId ?? agentIds.values().next().value;
	if (!agentId) {
		const fallbackAgent = resolveRequestedSessionAgentId(cfg, "main");
		if (!fallbackAgent.ok) return {
			ok: false,
			error: fallbackAgent.error
		};
		agentId = fallbackAgent.agentId;
	}
	return {
		ok: true,
		agentId,
		configured: isConfiguredSessionStoreAgentId(cfg, agentId),
		requestedAgentId,
		sessionKeys
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-read.ts
const projectContextWorkerPlacement = (context, record) => projectWorkerSessionPlacement(record, context.workerPlacementDiskSpaceReader?.read(record));
const sessionReadHandlers = {
	"sessions.search": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsSearchParams, "sessions.search", respond)) return;
		const query = params.query.trim();
		if (!query) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must not be empty"));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const restrictIncognito = Boolean(gatewayClientSessionCreator(client)) && !isGatewayAdmin(client);
		const canSearchSessionKey = (sessionKey) => !isIncognitoSessionKey(sessionKey) || canAccessIncognitoSession({
			cfg,
			client: client ?? null,
			sessionKey
		});
		const scope = resolveSessionSearchScope(cfg, params);
		if (!scope.ok) {
			respond(false, void 0, scope.error);
			return;
		}
		const { agentId, configured, requestedAgentId, sessionKeys } = scope;
		if (requestedAgentId && !params.sessionKeys && configured) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId requires sessionKeys"));
			return;
		}
		const scopedSessionKeys = (configured ? sessionKeys : sessionKeys?.filter((sessionKey) => {
			return (requestedAgentId && (sessionKey === "global" || sessionKey === "unknown") ? requestedAgentId : resolveSessionStoreAgentId(cfg, sessionKey)) === agentId;
		}))?.filter(canSearchSessionKey);
		if (!configured && scopedSessionKeys?.length === 0) {
			respond(true, { results: [] }, void 0);
			return;
		}
		const existingTargets = configured ? [] : resolveExistingAgentSessionStoreTargetsSync(cfg, agentId);
		if (!configured && existingTargets.length === 0) {
			respond(true, { results: [] }, void 0);
			return;
		}
		try {
			const configuredVisibleSessionKeys = restrictIncognito && configured && scopedSessionKeys === void 0 ? listSessionEntriesReadOnly({
				agentId,
				storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
			}).map((entry) => entry.sessionKey).filter(canSearchSessionKey) : void 0;
			const targetResults = (configured ? [void 0] : existingTargets).flatMap((target) => {
				const targetSessionKeys = scopedSessionKeys ?? configuredVisibleSessionKeys ?? (target && (restrictIncognito || !isPerAgentSessionStoreConfig(cfg.session?.store)) ? listSessionEntriesReadOnly({
					agentId: target.agentId,
					storePath: target.storePath
				}).map((entry) => entry.sessionKey).filter((sessionKey) => {
					if (!canSearchSessionKey(sessionKey)) return false;
					const parsed = parseAgentSessionKey(sessionKey);
					return !parsed || normalizeAgentId(parsed.agentId) === agentId;
				}) : void 0);
				if (targetSessionKeys?.length === 0) return [];
				return [searchSessionTranscripts({
					agentId: target?.agentId ?? agentId,
					query,
					limit: configured ? params.limit : 25,
					...targetSessionKeys ? { sessionKeys: targetSessionKeys } : {},
					...target ? { storePath: target.storePath } : {}
				})];
			});
			const limit = params.limit ?? 10;
			const sortedHits = targetResults.flatMap((result) => result.hits).toSorted((left, right) => right.score - left.score || right.timestamp - left.timestamp || left.messageId.localeCompare(right.messageId));
			const seenHits = /* @__PURE__ */ new Set();
			const hits = sortedHits.filter((hit) => {
				const identity = `${hit.sessionKey}\u0000${hit.sessionId}\u0000${hit.messageId}`;
				if (seenHits.has(identity)) return false;
				seenHits.add(identity);
				return true;
			});
			respond(true, {
				results: hits.slice(0, limit),
				...targetResults.some((result) => result.indexing) ? { indexing: true } : {},
				...targetResults.some((result) => result.truncated) || hits.length > limit ? { truncated: true } : {}
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"sessions.list": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionsListParams, "sessions.list", respond)) return;
		const p = params;
		const cfg = context.getRuntimeConfig();
		const configuredAgentsOnly = p.configuredAgentsOnly === true;
		const run = () => measureDiagnosticsTimelineSpan("gateway.sessions.list", async function listVisibleSessions(options = {}) {
			let loaded = options.loaded;
			if (!loaded) {
				const modelCatalog = await measureDiagnosticsTimelineSpan("gateway.sessions.list.model_catalog", () => readPreparedServerMethodModelCatalog(context, p.agentId ? { agentId: p.agentId } : void 0), {
					config: cfg,
					phase: "sessions.list"
				});
				const { durableStorePath, storePath, store } = measureDiagnosticsTimelineSpanSync("gateway.sessions.list.store_load", () => loadCombinedSessionStoreForGatewayCore(cfg, {
					agentId: p.agentId,
					projection: "list"
				}), {
					config: cfg,
					phase: "sessions.list",
					attributes: {
						agentId: p.agentId ?? null,
						configuredAgentsOnly
					}
				});
				loaded = {
					durableStorePath,
					listStore: configuredAgentsOnly ? filterSessionStoreToConfiguredAgents(cfg, store) : store,
					modelCatalog,
					storePath
				};
			}
			if (!loaded) throw new Error("sessions.list store input was not loaded");
			const { durableStorePath, listStore, modelCatalog, storePath } = loaded;
			const visibilityFilter = createSessionListEntryFilter({ client });
			const entryFilter = visibilityFilter || options.excludedKeys?.size ? (key, entry) => !options.excludedKeys?.has(key) && (visibilityFilter?.(key, entry) ?? true) : void 0;
			const result = await measureDiagnosticsTimelineSpan("gateway.sessions.list.rows", () => listSessionsFromStoreAsync({
				cfg,
				durableStorePath,
				...entryFilter ? { entryFilter } : {},
				storePath,
				store: listStore,
				modelCatalog,
				opts: p
			}), {
				config: cfg,
				phase: "sessions.list"
			});
			const identityId = gatewayClientSessionCreator(client)?.id;
			const { sharingTargets, membershipKeys } = await measureDiagnosticsTimelineSpan("gateway.sessions.list.sharing", () => {
				const sharingStoreCache = /* @__PURE__ */ new Map();
				const targetDiscoveryCache = /* @__PURE__ */ new Map();
				const resolvedSharingTargets = result.sessions.map((session) => resolveSessionSharingTarget({
					cfg,
					projection: "list",
					sessionKey: session.key,
					storeCache: sharingStoreCache,
					targetDiscoveryCache,
					...session.key === "global" && p.agentId ? { agentId: p.agentId } : {}
				}));
				const resolvedMembershipKeys = /* @__PURE__ */ new Set();
				if (identityId && !isGatewayAdmin(client)) {
					const groups = /* @__PURE__ */ new Map();
					for (const target of resolvedSharingTargets) {
						if (!target) continue;
						const groupKey = `${target.agentId}\0${target.storePath}`;
						const group = groups.get(groupKey) ?? {
							agentId: target.agentId,
							sessionKeys: [],
							storePath: target.storePath
						};
						group.sessionKeys.push(target.storeKey);
						groups.set(groupKey, group);
					}
					for (const group of groups.values()) {
						const firstSessionKey = group.sessionKeys[0];
						if (!firstSessionKey) continue;
						for (const sessionKey of listSessionMembershipKeys({
							agentId: group.agentId,
							sessionKey: firstSessionKey,
							storePath: group.storePath
						}, group.sessionKeys, identityId)) resolvedMembershipKeys.add(`${group.agentId}\0${group.storePath}\0${sessionKey}`);
					}
				}
				return {
					sharingTargets: resolvedSharingTargets,
					membershipKeys: resolvedMembershipKeys
				};
			}, {
				config: cfg,
				phase: "sessions.list",
				attributes: { sessions: result.sessions.length }
			});
			const placementsBySessionId = context.workerSessionPlacementService?.getMany(result.sessions.flatMap((session) => session.sessionId ? [session.sessionId] : []));
			const trackedActiveRuns = collectTrackedActiveSessionRuns(context);
			const projectedAgentRunIndex = buildProjectedAgentRunIndex();
			const sessions = measureDiagnosticsTimelineSpanSync("gateway.sessions.list.active_run_flags", () => {
				return result.sessions.map((session, index) => {
					const sharingTarget = sharingTargets[index];
					const visibility = sharingTarget ? resolveSessionVisibility(sharingTarget.entry) : "shared";
					const placementRecord = session.sessionId ? placementsBySessionId?.get(session.sessionId) : void 0;
					const activeRunState = resolveVisibleActiveSessionRunState({
						context,
						requestedKey: session.key,
						canonicalKey: session.key,
						sessionId: session.sessionId,
						agentId: session.agentId,
						defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, session.key),
						trackedActiveRuns,
						projectedAgentRunIndex
					});
					return Object.assign({}, session, {
						visibility,
						...sharingTarget ? { sharingRole: resolveSessionSharingRole({
							client,
							target: sharingTarget,
							isMember: membershipKeys.has(`${sharingTarget.agentId}\0${sharingTarget.storePath}\0${sharingTarget.storeKey}`)
						}) } : {},
						hasActiveRun: activeRunState.active,
						...placementRecord ? { placement: projectContextWorkerPlacement(context, placementRecord) } : {},
						...activeRunState.runIds.length > 0 ? { activeRunIds: activeRunState.runIds } : {}
					});
				});
			}, {
				config: cfg,
				phase: "sessions.list",
				attributes: { sessions: result.sessions.length }
			});
			const visibleSessions = !identityId || isGatewayAdmin(client) ? sessions : sessions.filter((session) => !session.incognito && (session.visibility !== "draft" || session.sharingRole === "owner"));
			if (visibleSessions.length !== sessions.length) {
				const visibleKeys = new Set(visibleSessions.map((session) => session.key));
				const excludedKeys = new Set(options.excludedKeys);
				for (const session of sessions) if (!visibleKeys.has(session.key)) excludedKeys.add(session.key);
				if (!options.rowRepairAttempted) return await listVisibleSessions({
					...options,
					excludedKeys,
					loaded,
					rowRepairAttempted: true
				});
				if (options.allowFullReload !== false) return await listVisibleSessions({ allowFullReload: false });
				return {
					...result,
					count: visibleSessions.length,
					sessions: visibleSessions
				};
			}
			return {
				...result,
				sessions: visibleSessions
			};
		}, {
			config: cfg,
			phase: "sessions.list",
			attributes: {
				agentId: p.agentId ?? null,
				configuredAgentsOnly
			}
		});
		await respondWithCachedSessionList({
			client,
			config: cfg,
			context,
			request: p,
			respond,
			run
		});
	},
	"sessions.cleanup": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsCleanupParams, "sessions.cleanup", respond)) return;
		try {
			const { mode, appliedSummaries } = await runSessionsCleanup({
				cfg: context.getRuntimeConfig(),
				opts: {
					agent: params.agent,
					allAgents: params.allAgents,
					enforce: params.enforce,
					activeKey: params.activeKey,
					fixMissing: params.fixMissing,
					fixDmScope: params.fixDmScope
				}
			});
			respond(true, serializeSessionCleanupResult({
				mode,
				dryRun: false,
				summaries: appliedSummaries
			}), void 0);
			for (const summary of appliedSummaries) {
				emitSessionsChanged(context, {
					reason: "cleanup",
					sessionKey: void 0
				});
				if (summary.wouldMutate) context.logGateway.debug(`sessions.cleanup applied ${summary.storePath}: ${summary.beforeCount} -> ${summary.afterCount}`);
			}
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
		}
	},
	"sessions.preview": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsPreviewParams, "sessions.preview", respond)) return;
		const p = params;
		const keys = (Array.isArray(p.keys) ? p.keys : []).map((key) => normalizeOptionalString(key ?? "")).filter((key) => Boolean(key)).slice(0, 64);
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, p.limit) : 12;
		const maxChars = typeof p.maxChars === "number" && Number.isFinite(p.maxChars) ? Math.max(20, p.maxChars) : 240;
		if (keys.length === 0) {
			respond(true, {
				ts: Date.now(),
				previews: []
			}, void 0);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const storeCache = /* @__PURE__ */ new Map();
		const previews = [];
		for (const key of keys) {
			const requestedAgent = resolveRequestedSessionAgentId(cfg, key);
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			try {
				const cachedStoreTarget = resolveGatewaySessionStoreTargetWithStore({
					cfg,
					key,
					agentId: requestedAgent.agentId
				});
				const storeCacheKey = `${cachedStoreTarget.agentId}\u0000${cachedStoreTarget.storePath}`;
				const store = storeCache.get(storeCacheKey) ?? cachedStoreTarget.store;
				storeCache.set(storeCacheKey, store);
				const target = resolveGatewaySessionStoreTarget({
					cfg,
					key,
					agentId: requestedAgent.agentId,
					store
				});
				const entry = resolveCanonicalSessionEntryFromStoreKeys(store, target.storeKeys);
				if (!entry?.sessionId) {
					previews.push({
						key,
						status: "missing",
						items: []
					});
					continue;
				}
				const items = readSessionPreviewItemsFromTranscript({
					agentId: target.agentId,
					sessionEntry: entry,
					sessionId: entry.sessionId,
					sessionKey: target.canonicalKey,
					storePath: target.storePath
				}, limit, maxChars);
				previews.push({
					key,
					status: items.length > 0 ? "ok" : "empty",
					items
				});
			} catch {
				previews.push({
					key,
					status: "error",
					items: []
				});
			}
		}
		respond(true, {
			ts: Date.now(),
			previews
		}, void 0);
	},
	"sessions.describe": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsDescribeParams, "sessions.describe", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { target, storePath, store, entry } = loadSessionEntriesForTarget({
			key,
			cfg,
			...requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {}
		});
		if (!entry) {
			respond(true, { session: null }, void 0);
			return;
		}
		const row = buildGatewaySessionRow({
			cfg,
			storePath,
			store,
			key: target.canonicalKey,
			entry,
			includeDerivedTitles: params.includeDerivedTitles,
			includeLastMessage: params.includeLastMessage,
			transcriptUsageMaxBytes: 64 * 1024
		});
		const placement = row.sessionId ? context.workerSessionPlacementService?.getMany([row.sessionId]).get(row.sessionId) : void 0;
		const projectedPlacement = placement ? projectContextWorkerPlacement(context, placement) : void 0;
		respond(true, { session: projectedPlacement ? {
			...row,
			placement: projectedPlacement
		} : row }, void 0);
	},
	"sessions.resolve": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsResolveParams, "sessions.resolve", respond)) return;
		const p = params;
		const resolved = await resolveSessionKeyFromResolveParams({
			cfg: context.getRuntimeConfig(),
			client,
			p
		});
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		if ("missing" in resolved) {
			respond(true, { ok: false }, void 0);
			return;
		}
		if ("ambiguous" in resolved) {
			respond(true, {
				ok: false,
				candidates: resolved.candidates
			}, void 0);
			return;
		}
		respond(true, {
			ok: true,
			key: resolved.key,
			agentId: resolved.agentId
		}, void 0);
	},
	"sessions.get": async ({ params, respond, context }) => {
		const p = params;
		const key = requireSessionKey(p.key ?? p.sessionKey, respond);
		if (!key) return;
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, Math.floor(p.limit)) : 200;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, normalizeOptionalString(p.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { storePath, entry } = loadSessionEntriesForTarget({
			key,
			cfg,
			agentId: requestedAgent.agentId
		});
		if (!entry?.sessionId) {
			respond(true, { messages: [] }, void 0);
			return;
		}
		const { messages } = await readRecentSessionMessagesWithStatsAsync({
			agentId: requestedAgent.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: key,
			storePath
		}, {
			maxMessages: limit,
			maxLines: limit * 20 + 20,
			allowResetArchiveFallback: true
		});
		respond(true, { messages }, void 0);
	},
	"sessions.sendReconcile": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsSendReconcileParams, "sessions.sendReconcile", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, normalizeOptionalString(p.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { target, storePath, entry } = loadSessionEntriesForTarget({
			key,
			cfg,
			agentId: requestedAgent.agentId
		});
		const canonicalKey = target.canonicalKey;
		const resolvedAgentId = target.agentId ?? resolveDefaultAgentId(cfg);
		const sessionId = entry?.sessionId;
		const resultBase = {
			key: canonicalKey,
			agentId: resolvedAgentId,
			runId: p.runId
		};
		const liveEntry = collectTrackedActiveSessionRuns(context).find((run) => run.runId === p.runId);
		if (liveEntry && liveEntry.sessionKey === canonicalKey && isLiveEntryAgentMatch(liveEntry.agentId, resolvedAgentId)) {
			respond(true, {
				...resultBase,
				status: "active"
			}, void 0);
			return;
		}
		if (!sessionId) {
			respond(true, {
				...resultBase,
				status: "not_found"
			}, void 0);
			return;
		}
		const idempotencyKey = buildRunUserTurnIdempotencyKey(p.runId);
		let found = false;
		try {
			found = (await loadTranscriptEvents({
				agentId: resultBase.agentId,
				sessionId,
				...canonicalKey ? { sessionKey: canonicalKey } : {},
				storePath
			})).some((event) => {
				if (!event || typeof event !== "object" || Array.isArray(event)) return false;
				const message = event.message;
				if (!message || typeof message !== "object" || Array.isArray(message)) return false;
				const record = message;
				return record.role === "user" && record.idempotencyKey === idempotencyKey;
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error), { retryable: true }));
			return;
		}
		if (found) {
			respond(true, {
				...resultBase,
				status: "applied"
			}, void 0);
			return;
		}
		respond(true, {
			...resultBase,
			status: "not_found"
		}, void 0);
	}
};
function isLiveEntryAgentMatch(liveAgentId, resolvedAgentId) {
	if (liveAgentId === void 0) return true;
	return normalizeAgentId(liveAgentId) === normalizeAgentId(resolvedAgentId);
}
//#endregion
export { sessionReadHandlers as t };
