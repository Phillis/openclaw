import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { r as normalizeOptionalAccountId } from "./account-id-BH0zJUew.js";
import { u as normalizeMainKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { An as executeSqliteQuerySync, Bt as tableHasColumn, Mn as getNodeSqliteKysely, Nn as iterateSqliteQuerySync, jn as executeSqliteQueryTakeFirstSync, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { s as createSqliteLifecycleAggregateError } from "./state-database-coordinator-DNHhmvRb.js";
import { n as getPluginRegistryState } from "./runtime-state-B4nZOuAi.js";
import { n as capturePluginLifecycleAuthority } from "./registry-lifecycle-DYhl0RY-.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { c as deferOpenClawAgentPostCommitPublication, y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CM8nAOgX.js";
import { C as hasValidSessionEntryIdentity, S as normalizeConversationPeerId, T as FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS, g as SESSION_PARTICIPANTS_TABLE, v as ensureSessionParticipantsSchema, w as parseSqliteSessionEntryRecord, x as buildConversationRef, y as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import "./openclaw-agent-db-migration-required-RkIFq1cn.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-CRlF3oxo.js";
import { t as resolveConversationLabel } from "./conversation-label-DYC5BXIh.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, d as sessionDeliveryOrigin, f as sessionDeliveryRoute, n as deliveryContextFromSession, s as normalizeDeliveryContext, t as deliveryContextFromChannelRoute, u as sessionDeliveryChannel } from "./delivery-context.shared-azPdmUls.js";
import "./message-channel-BZwx7FCw.js";
import { b as resolveGroupSessionKey, l as isCompetingSessionWorkAdmissionActive, p as runExclusiveSessionLifecycleMutation, v as buildGroupDisplayName } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-scope-DDjt_91x.js";
import { a as normalizeStoreSessionKey, g as stripRuntimeOnlySessionSkillsFields, h as projectCanonicalSessionEntryShape, n as foldedSessionKeyAliasCandidates, o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-CwpzgKGD.js";
import { a as normalizeSqliteSessionKey, i as getSessionKysely, m as toDatabaseOptions, p as runExclusiveSqliteSessionWrite, s as resolveSqliteReadScope, t as cloneSessionEntry } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { sql } from "kysely";
//#region src/config/sessions/metadata.ts
function isSystemEventProvider(provider) {
	return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
const mergeSessionOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	const nextProvider = next?.provider;
	const nextIsDeliverableChannel = nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && !isSystemEventProvider(nextProvider);
	if (existing != null && nextIsDeliverableChannel && (existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.avatar;
		delete merged.accountId;
		delete merged.threadId;
	}
	if (next?.label) merged.label = next.label;
	if (next?.provider) merged.provider = next.provider;
	if (next?.surface) merged.surface = next.surface;
	if (next?.chatType) merged.chatType = next.chatType;
	if (next?.from) merged.from = next.from;
	if (next?.to) merged.to = next.to;
	if (next?.nativeChannelId) merged.nativeChannelId = next.nativeChannelId;
	if (next?.nativeDirectUserId) merged.nativeDirectUserId = next.nativeDirectUserId;
	if (next?.avatar) merged.avatar = next.avatar;
	if (next?.accountId) merged.accountId = next.accountId;
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
/** Derives session origin metadata from an inbound message context. */
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && isSystemEventProvider(ctx.Provider)) return;
	const label = normalizeOptionalString(resolveConversationLabel(ctx));
	const provider = normalizeMessageChannel(typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider);
	const surface = normalizeOptionalLowercaseString(ctx.Surface);
	const chatType = normalizeChatType(ctx.ChatType) ?? void 0;
	const from = normalizeOptionalString(ctx.From);
	const to = normalizeOptionalString(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To);
	const nativeChannelId = normalizeOptionalString(ctx.NativeChannelId);
	const nativeDirectUserId = normalizeOptionalString(ctx.NativeDirectUserId);
	const avatar = normalizeOptionalString(ctx.ConversationAvatar);
	const accountId = normalizeOptionalString(ctx.AccountId);
	const threadId = ctx.MessageThreadId ?? void 0;
	const origin = {};
	if (label) origin.label = label;
	if (provider) origin.provider = provider;
	if (surface) origin.surface = surface;
	if (chatType) origin.chatType = chatType;
	if (from) origin.from = from;
	if (to) origin.to = to;
	if (nativeChannelId) origin.nativeChannelId = nativeChannelId;
	if (nativeDirectUserId) origin.nativeDirectUserId = nativeDirectUserId;
	if (avatar) origin.avatar = avatar;
	if (accountId) origin.accountId = accountId;
	if (threadId != null && threadId !== "") origin.threadId = threadId;
	return Object.keys(origin).length > 0 ? origin : void 0;
}
function deriveGroupSessionPatch(params) {
	const resolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	if (!resolution?.channel) return null;
	const channel = resolution.channel;
	const subject = params.ctx.GroupSubject?.trim();
	const space = params.ctx.GroupSpace?.trim();
	const explicitChannel = params.ctx.GroupChannel?.trim();
	const subjectLooksChannel = Boolean(subject?.startsWith("#"));
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeChannelId(channel) : null;
	const isChannelProvider = Boolean(normalizedChannel && getLoadedChannelPlugin(normalizedChannel)?.capabilities.chatTypes.includes("channel"));
	const nextGroupChannel = explicitChannel ?? (subjectLooksChannel && subject && (resolution.chatType === "channel" || isChannelProvider) ? subject : void 0);
	const nextSubject = nextGroupChannel ? void 0 : subject;
	const patch = {
		chatType: resolution.chatType ?? "group",
		groupId: resolution.id
	};
	if (nextSubject) {
		patch.subject = nextSubject;
		patch.groupChannel = void 0;
	}
	if (nextGroupChannel) {
		patch.groupChannel = nextGroupChannel;
		patch.subject = void 0;
	}
	if (space) patch.space = space;
	const displayName = buildGroupDisplayName({
		provider: channel,
		subject: nextSubject ?? (nextGroupChannel ? void 0 : params.existing?.subject),
		groupChannel: nextGroupChannel ?? (nextSubject ? void 0 : params.existing?.groupChannel),
		space: space ?? params.existing?.space,
		id: resolution.id,
		key: params.sessionKey
	});
	if (displayName) patch.displayName = displayName;
	return patch;
}
function deriveSessionMetaPatch(params) {
	const groupPatch = deriveGroupSessionPatch(params);
	const origin = deriveSessionOrigin(params.ctx, { skipSystemEventOrigin: params.skipSystemEventOrigin });
	if (!groupPatch && !origin) return null;
	const patch = groupPatch ? { ...groupPatch } : {};
	const existingOrigin = sessionDeliveryOrigin(params.existing);
	const mergedOrigin = mergeSessionOrigin(existingOrigin, origin);
	if (mergedOrigin) {
		if (!patch.chatType && mergedOrigin.chatType) patch.chatType = mergedOrigin.chatType;
		const nextProvider = origin?.provider;
		const nextOwnsExternalRoute = Boolean(nextProvider && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && !isSystemEventProvider(nextProvider));
		const existingRoute = sessionDeliveryRoute(params.existing);
		const existingRouteAccountId = existingRoute?.accountId ?? deliveryContextFromSession(params.existing)?.accountId;
		const freshRouteOwnsNextProvider = params.preserveExistingDeliveryRoute === true && nextProvider != null && existingRoute?.channel === nextProvider && (origin?.accountId == null || existingRouteAccountId === origin.accountId);
		const deliveryIdentityChanged = nextOwnsExternalRoute && !freshRouteOwnsNextProvider && (!existingOrigin || existingOrigin.provider != null && nextProvider !== existingOrigin.provider || existingOrigin.surface != null && origin?.surface != null && origin.surface !== existingOrigin.surface || existingOrigin.accountId != null && origin?.accountId != null && origin.accountId !== existingOrigin.accountId);
		patch.delivery = normalizeSessionDeliveryState({
			route: deliveryIdentityChanged ? void 0 : sessionDeliveryRoute(params.existing),
			context: deliveryIdentityChanged ? {
				channel: mergedOrigin.provider,
				to: mergedOrigin.to,
				accountId: mergedOrigin.accountId,
				threadId: mergedOrigin.threadId
			} : deliveryContextFromSession(params.existing),
			origin: mergedOrigin
		});
	}
	return Object.keys(patch).length > 0 ? patch : null;
}
function withoutThread(identity) {
	if (!identity || identity.threadId == null) return identity;
	const next = { ...identity };
	delete next.threadId;
	return next;
}
/**
* Derives the last-route/delivery patch for an inbound routing update. Route
* updates must not refresh activity timestamps; idle/daily reset evaluation
* relies on updatedAt from actual session turns (#49515). Shared by the file
* store and the SQLite accessor so both backends apply one routing policy.
*/
function deriveLastRoutePatch(params) {
	const { channel, to, accountId, threadId, ctx, existing } = params;
	const explicitContext = normalizeDeliveryContext(params.deliveryContext);
	const inlineContext = normalizeDeliveryContext({
		channel,
		to,
		accountId,
		threadId
	});
	const routeContext = deliveryContextFromChannelRoute(params.route);
	const mergedInput = mergeDeliveryContext(routeContext, mergeDeliveryContext(explicitContext, inlineContext));
	const explicitDeliveryContext = params.deliveryContext;
	const explicitThreadValue = (explicitDeliveryContext != null && Object.hasOwn(explicitDeliveryContext, "threadId") ? explicitDeliveryContext.threadId : void 0) ?? (threadId != null && threadId !== "" ? threadId : void 0);
	const clearThreadFromFallback = Boolean(routeContext?.channel || routeContext?.to || explicitContext?.channel || explicitContext?.to || inlineContext?.channel || inlineContext?.to) && explicitThreadValue == null;
	const fallbackContext = clearThreadFromFallback ? withoutThread(deliveryContextFromSession(existing)) : deliveryContextFromSession(existing);
	const existingOrigin = sessionDeliveryOrigin(existing);
	const fallbackOrigin = clearThreadFromFallback ? withoutThread(existingOrigin) : existingOrigin;
	const merged = mergeDeliveryContext(mergedInput, fallbackContext);
	const delivery = normalizeSessionDeliveryState({
		route: params.route,
		context: {
			channel: merged?.channel,
			to: merged?.to,
			accountId: merged?.accountId,
			threadId: merged?.threadId
		},
		origin: fallbackOrigin
	});
	const nextEntry = existing ? {
		...existing,
		delivery
	} : { delivery };
	const metaPatch = ctx ? deriveSessionMetaPatch({
		ctx,
		sessionKey: params.sessionKey,
		existing: nextEntry,
		groupResolution: params.groupResolution,
		preserveExistingDeliveryRoute: routeContext != null
	}) : null;
	const basePatch = { delivery };
	return metaPatch ? {
		...basePatch,
		...metaPatch
	} : basePatch;
}
//#endregion
//#region src/agents/harness/session-deletion.ts
/** Reuse the registered harness owner; deletion is not a second plugin registration surface. */
function captureAgentHarnessSessionDeletions() {
	const scopedRegistry = () => getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scoped = scopedRegistry();
	const registry = scoped ?? getPluginRegistryState()?.activeRegistry;
	const owners = registry?.agentHarnesses.flatMap((registration) => {
		const prepare = registration.harness.withSessionDeletion;
		if (!prepare) return [];
		const record = registry.plugins.find((plugin) => plugin.id === registration.pluginId);
		return [{
			registration,
			prepare,
			current: record || registration.pluginId === "core" ? capturePluginLifecycleAuthority(registry, record, { scopedRuntime: scoped === registry }) : void 0
		}];
	}) ?? [];
	return owners.length === 0 ? void 0 : async (targets, run) => {
		const pending = targets.flatMap((target) => owners.filter(({ registration }) => !target.agentHarnessId || target.agentHarnessId === registration.harness.id).map((owner) => ({
			owner,
			target
		})));
		const prepared = /* @__PURE__ */ new Map();
		const prepareNext = async (index) => {
			const candidate = pending[index];
			if (!candidate) return await run(prepared);
			const { owner, target } = candidate;
			let active = true;
			const assertCurrent = () => {
				if (!active || !owner.current?.() || scoped && scopedRegistry() !== scoped || !registry?.agentHarnesses.includes(owner.registration) || owner.registration.harness.withSessionDeletion !== owner.prepare) throw new Error(`Session deletion harness owner changed: ${owner.registration.harness.id}`);
			};
			try {
				assertCurrent();
				const result = await owner.prepare({
					...target,
					assertCurrent
				}, async (mutation) => {
					assertCurrent();
					const mutations = prepared.get(target.sessionKey) ?? [];
					mutations.push({
						assertCurrent,
						commit: () => {
							assertCurrent();
							mutation.commit();
						},
						rollback: () => {
							assertCurrent();
							mutation.rollback();
						}
					});
					prepared.set(target.sessionKey, mutations);
					return await prepareNext(index + 1);
				});
				assertCurrent();
				return result;
			} finally {
				active = false;
			}
		};
		return await prepareNext(0);
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-deletion.ts
const deletions = new AsyncLocalStorage();
const transactionMutations = new AsyncLocalStorage();
/** Keep ordinary updates serialized; release the writer only for native or artifact preparation. */
async function runPreparedSqliteSessionWrite(scope, prepare) {
	const prepared = await runExclusiveSqliteSessionWrite(scope, async () => {
		const write = await prepare();
		return write.deletedEntries.length || write.beforeCommit ? { write } : { result: await write.commit() };
	});
	if (!prepared.write) return prepared.result;
	const write = prepared.write;
	return await withSqliteSessionDeletions(scope, write.deletedEntries, async (assertCurrent) => {
		await write.beforeCommit?.();
		return await runExclusiveSqliteSessionWrite(scope, async () => {
			assertCurrent();
			return await write.commit();
		});
	});
}
/** Prepare owner leases before entering a physical writer or changing any transcript state. */
async function withSqliteSessionDeletions(scope, entries, run) {
	const targets = [...new Map(entries.filter(({ entry }) => entry.sessionId).map(({ sessionKey, entry }) => [sessionKey, {
		agentId: parseAgentSessionKey(sessionKey)?.agentId ?? scope.agentId,
		sessionKey,
		sessionId: entry.sessionId,
		...entry.lifecycleRevision ? { lifecycleRevision: entry.lifecycleRevision } : {},
		...entry.agentHarnessId ? { agentHarnessId: entry.agentHarnessId } : {}
	}])).values()].toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
	const ownerStorePath = scope.ownerStorePath ?? resolveSessionStorePathCore(void 0, {
		agentId: scope.agentId,
		env: scope.env
	});
	const assertTargetIdle = (target) => {
		if (isCompetingSessionWorkAdmissionActive(ownerStorePath, [target.sessionKey, target.sessionId])) throw new Error(`Cannot delete session while competing work is in flight for ${target.sessionKey}; retry after the run completes`);
	};
	targets.forEach(assertTargetIdle);
	const prepare = captureAgentHarnessSessionDeletions();
	const invoke = async (prepared) => {
		const assertCurrent = () => {
			targets.forEach(assertTargetIdle);
			for (const mutations of prepared.values()) mutations.forEach((mutation) => mutation.assertCurrent());
		};
		assertCurrent();
		return await deletions.run(new Map(targets.map((target) => [target.sessionKey, {
			target,
			mutations: prepared.get(target.sessionKey) ?? [],
			assertIdle: () => assertTargetIdle(target)
		}])), () => run(assertCurrent));
	};
	return await runExclusiveSessionLifecycleMutation({
		scope: ownerStorePath,
		identities: targets.flatMap((target) => [target.sessionKey, target.sessionId]),
		run: async () => prepare ? await prepare(targets, invoke) : await invoke(/* @__PURE__ */ new Map())
	});
}
/** Called only at the synchronous SQL edge, after the operation revalidates its row snapshot. */
function commitSqliteSessionDeletion(sessionKey, entry) {
	const prepared = deletions.getStore()?.get(sessionKey);
	if (!prepared) {
		if (captureAgentHarnessSessionDeletions()) throw new Error(`Session deletion requires prepared harness ownership: ${sessionKey}`);
		return;
	}
	if (prepared.target.sessionId !== entry.sessionId || prepared.target.lifecycleRevision !== entry.lifecycleRevision) throw new Error(`Session changed before deletion: ${sessionKey}`);
	prepared.assertIdle();
	const rollback = transactionMutations.getStore();
	if (!rollback) throw new Error(`Session deletion requires its synchronous transaction: ${sessionKey}`);
	for (const mutation of prepared.mutations) {
		rollback.push(mutation);
		mutation.commit();
	}
}
/** Roll back companion state only if SQLite failed before COMMIT, never after publication. */
function runSqliteSessionDeletionTransaction(operation, options, transactionOptions) {
	if (!deletions.getStore() || transactionMutations.getStore()) return runOpenClawAgentWriteTransaction(operation, options, transactionOptions);
	const rollback = [];
	let committed = false;
	try {
		return transactionMutations.run(rollback, () => runOpenClawAgentWriteTransaction((database) => {
			deferOpenClawAgentPostCommitPublication(database, () => {
				committed = true;
			});
			return operation(database);
		}, options, transactionOptions));
	} catch (error) {
		const failures = [error];
		if (!committed) for (const mutation of rollback.toReversed()) try {
			mutation.rollback();
		} catch (rollbackError) {
			failures.push(rollbackError);
		}
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Session deletion rollback failed", error);
		throw error;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-owner-projection.ts
const ownerColumnAvailability = /* @__PURE__ */ new WeakMap();
function actorFromColumns(type, id) {
	const normalizedType = type === "human" || type === "agent" || type === "system" ? type : null;
	const normalizedId = normalizeOptionalString(id);
	return normalizedType && normalizedId ? {
		type: normalizedType,
		id: normalizedId
	} : void 0;
}
function projectSqliteSessionOwner(entry, row) {
	const actor = actorFromColumns(row.owner_actor_type, row.owner_actor_id);
	if (!actor) return entry;
	const assignedBy = actorFromColumns(row.owner_assigned_by_type, row.owner_assigned_by_id);
	const assignedAt = typeof row.owner_assigned_at === "number" && Number.isFinite(row.owner_assigned_at) ? row.owner_assigned_at : void 0;
	return {
		...entry,
		owner: {
			actor,
			...assignedBy ? { assignedBy } : {},
			...assignedAt !== void 0 ? { assignedAt } : {}
		}
	};
}
function hasSqliteSessionOwnerColumns(database) {
	const db = getSessionKysely(database);
	const schema = executeSqliteQueryTakeFirstSync(database, db.selectFrom(sql`pragma_schema_version`.as("pragma_schema")).select(sql`schema_version`.as("schema_version")));
	const schemaVersion = typeof schema?.schema_version === "number" ? schema.schema_version : -1;
	const cached = ownerColumnAvailability.get(database);
	if (cached?.schemaVersion === schemaVersion) return cached.available;
	const tableInfoRows = executeSqliteQuerySync(database, db.selectFrom(sql`pragma_table_info('session_nodes')`.as("pragma_columns")).select(sql`name`.as("name"))).rows;
	const columns = new Set(tableInfoRows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	const available = FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.every(({ columnName }) => columns.has(columnName));
	ownerColumnAvailability.set(database, {
		available,
		schemaVersion
	});
	return available;
}
//#endregion
//#region src/config/sessions/session-entry-provenance.ts
const MAX_SESSION_PARTICIPANTS = 32;
function mergeSessionParticipantSource(current, incoming) {
	if (current === "profile" || incoming === "profile") return "profile";
	const next = incoming === "channel" || incoming === "agent" ? incoming : null;
	if (next) return next;
	return current === "channel" || current === "agent" ? current : null;
}
function resolveProfileParticipantIdFromSessionCreation(creation) {
	const profileId = creation?.actor?.id?.trim();
	return creation?.actor?.type === "human" && (creation.via === "operator" || creation.via === "run") && profileId ? profileId : void 0;
}
function buildSessionCreationStamp(params) {
	return {
		createdVia: params.via,
		...params.actor ? { createdActor: params.actor } : {},
		createdAt: params.now ?? Date.now(),
		...params.sandbox === "required" ? { sandbox: "required" } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participant-projection.ts
function resolveBoundedProfileParticipantSnapshot(records, currentProfileId) {
	const profileIds = new Set(records.flatMap((record) => record.actor.type === "human" && record.source === "profile" ? [record.actor.id] : []));
	const current = currentProfileId?.trim();
	if (current && !profileIds.has(current) && records.length < 32) profileIds.add(current);
	return {
		profileIds: [...profileIds],
		incomplete: records.length >= 32
	};
}
function projectParticipantRow(row) {
	if (row.actor_type !== "agent" && row.actor_type !== "human") return null;
	return {
		actor: {
			type: row.actor_type,
			id: row.actor_id
		},
		contributionCount: row.contribution_count ?? 1,
		firstPromptedAt: row.first_prompted_at,
		lastPromptedAt: row.last_prompted_at,
		...row.actor_source === "profile" || row.actor_source === "channel" || row.actor_source === "agent" ? { source: row.actor_source } : {}
	};
}
function readParticipantRows(database, sessionKeys) {
	if (!tableExists(database, "session_participants") || sessionKeys?.length === 0) return [];
	const hasActorSource = tableHasColumn(database, SESSION_PARTICIPANTS_TABLE, "actor_source");
	const hasContributionCount = tableHasColumn(database, SESSION_PARTICIPANTS_TABLE, "contribution_count");
	let query = getSessionKysely(database).selectFrom("session_participants").select([
		"session_key",
		"actor_type",
		"actor_id",
		...hasActorSource ? ["actor_source"] : [],
		...hasContributionCount ? ["contribution_count"] : [],
		"first_prompted_at",
		"last_prompted_at"
	]);
	if (sessionKeys) query = query.where("session_key", "in", sessionKeys);
	return executeSqliteQuerySync(database, query.orderBy("session_key").orderBy("first_prompted_at").orderBy("actor_id").orderBy("actor_type")).rows;
}
function participantRecordsBySessionKey(database, sessionKeys) {
	const records = /* @__PURE__ */ new Map();
	for (const row of readParticipantRows(database, sessionKeys)) {
		const projected = projectParticipantRow(row);
		if (!projected) continue;
		const participants = records.get(row.session_key) ?? [];
		participants.push(projected);
		records.set(row.session_key, participants);
	}
	return records;
}
function withProjectedParticipants(entry, records) {
	const owner = entry.owner?.actor ?? entry.createdActor;
	const effective = records.filter((participant) => participant.actor.type !== owner?.type || participant.actor.id !== owner.id);
	if (effective.length === 0) return entry;
	return {
		...entry,
		participants: effective.map((participant) => ({
			...participant.actor,
			...participant.source ? { source: participant.source } : {}
		})),
		participantCount: effective.length
	};
}
function projectSqliteSessionParticipants(database, sessionKey, entry) {
	return withProjectedParticipants(entry, participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
function projectSqliteSessionParticipantsBatch(database, entries) {
	const records = participantRecordsBySessionKey(database, [...entries.keys()]);
	return new Map([...entries].map(([sessionKey, entry]) => [sessionKey, withProjectedParticipants(entry, records.get(sessionKey) ?? [])]));
}
function listSessionParticipantsReadOnly(scope) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => participantRecordsBySessionKey(database.db, scope.sessionKey ? [scope.sessionKey] : void 0), toDatabaseOptions(resolveSqliteReadScope(scope)));
	return result.found ? result.value : /* @__PURE__ */ new Map();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-status.ts
function normalizeStatus(value) {
	return value === "running" || value === "done" || value === "failed" || value === "killed" || value === "timeout" ? value : null;
}
function parseSessionEntryJson(row) {
	const record = parseSqliteSessionEntryRecord(row);
	return record ? projectSqliteSessionOwner(projectCanonicalSessionEntryShape(record), row) : null;
}
function readSessionEntriesByStatus(database, statuses, sessionKeys) {
	const selectedStatuses = [...new Set(statuses)];
	const selectedSessionKeys = sessionKeys ? [...new Set(sessionKeys)] : void 0;
	if (selectedStatuses.length === 0 || selectedSessionKeys?.length === 0) return [];
	let query = getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll().where("status", "in", selectedStatuses);
	if (selectedSessionKeys) query = query.where("session_key", "in", selectedSessionKeys);
	return executeSqliteQuerySync(database.db, query).rows.flatMap((row) => {
		const entry = parseSessionEntryJson(row);
		return entry ? [{
			entry,
			sessionKey: row.session_key
		}] : [];
	}).toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.ts
const MAX_INCREMENTAL_ENTRY_READ_KEYS = 500;
const sessionEntryCaches = /* @__PURE__ */ new WeakMap();
const sessionNodesGenerationTrackerSchemaVersions = /* @__PURE__ */ new WeakMap();
function readDataVersion(database) {
	const row = database.prepare("PRAGMA data_version").get();
	if (typeof row.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
function ensureSessionNodesGenerationTracker(database) {
	const schemaRow = database.prepare("PRAGMA schema_version").get();
	if (typeof schemaRow.schema_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA schema_version");
	const trackedSchemaVersion = sessionNodesGenerationTrackerSchemaVersions.get(database);
	if (trackedSchemaVersion === schemaRow.schema_version) return;
	database.exec(`
    CREATE TEMP TABLE IF NOT EXISTS openclaw_session_nodes_cache_generation (id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1), generation INTEGER NOT NULL) STRICT;
    INSERT OR IGNORE INTO openclaw_session_nodes_cache_generation (id, generation) VALUES (1, 0);
    ${trackedSchemaVersion === void 0 ? "" : "UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1;"}
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_insert;
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_update;
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_delete;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_insert
      AFTER INSERT ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_update
      AFTER UPDATE ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_delete
      AFTER DELETE ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
  `);
	sessionNodesGenerationTrackerSchemaVersions.set(database, schemaRow.schema_version);
}
function readSessionNodesGeneration(database) {
	ensureSessionNodesGenerationTracker(database);
	const row = database.prepare("SELECT generation FROM temp.openclaw_session_nodes_cache_generation WHERE id = 1").get();
	if (typeof row.generation !== "number") throw new Error("SQLite session_nodes cache generation is unavailable");
	return row.generation;
}
function readCacheValidityToken(database) {
	return {
		dataVersion: readDataVersion(database),
		sessionNodesGeneration: readSessionNodesGeneration(database)
	};
}
function cacheValidityTokensEqual(left, right) {
	return left.dataVersion === right.dataVersion && left.sessionNodesGeneration === right.sessionNodesGeneration;
}
/** Bracket one accessor-owned row write so its publication cannot hide earlier raw DML. */
function trackSessionEntryCacheWrite(database, write) {
	const before = sessionEntryCaches.has(database.db) ? readSessionNodesGeneration(database.db) : void 0;
	write();
	return before === void 0 ? void 0 : {
		before,
		after: readSessionNodesGeneration(database.db)
	};
}
function createListProjection(entry) {
	const projected = { ...entry };
	delete projected.skillsSnapshot;
	delete projected.systemPromptReport;
	return projected;
}
function createLazyListProjections(entries, projectedByKey) {
	return { get: (sessionKey) => {
		const cached = projectedByKey.get(sessionKey);
		if (cached) return cached;
		const entry = entries.get(sessionKey);
		if (!entry) return;
		const projected = createListProjection(entry);
		projectedByKey.set(sessionKey, projected);
		return projected;
	} };
}
function loadSessionEntrySnapshot(database) {
	const db = getSessionKysely(database.db);
	const rows = hasSqliteSessionOwnerColumns(database.db) ? executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"entry_json",
		"updated_at",
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]).orderBy("session_key")).rows : executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"entry_json",
		"updated_at"
	]).orderBy("session_key")).rows;
	const parsedEntries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		parsedEntries.set(row.session_key, entry);
	}
	const entries = projectSqliteSessionParticipantsBatch(database.db, parsedEntries);
	const listProjections = /* @__PURE__ */ new Map();
	return {
		entries,
		keys: rows.map((row) => row.session_key),
		listEntries: createLazyListProjections(entries, listProjections),
		listProjections,
		updatedAtByKey: new Map(rows.map((row) => [row.session_key, row.updated_at]))
	};
}
function incrementallyRevalidateSessionEntrySnapshot(database, cached, validityToken) {
	const db = getSessionKysely(database.db);
	const versions = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "updated_at"])).rows;
	const updatedAtByKey = new Map(versions.map((row) => [row.session_key, row.updated_at]));
	const changedKeys = versions.filter((row) => cached.updatedAtByKey.get(row.session_key) !== row.updated_at).map((row) => row.session_key);
	const removedKeys = cached.keys.filter((sessionKey) => !updatedAtByKey.has(sessionKey));
	if (changedKeys.length === 0 && removedKeys.length === 0) {
		cached.validityToken = validityToken;
		return cached;
	}
	if (changedKeys.length > MAX_INCREMENTAL_ENTRY_READ_KEYS) return {
		...loadSessionEntrySnapshot(database),
		validityToken
	};
	const entries = new Map(cached.entries);
	const listProjections = new Map(cached.listProjections);
	for (const sessionKey of [...changedKeys, ...removedKeys]) {
		entries.delete(sessionKey);
		listProjections.delete(sessionKey);
	}
	if (changedKeys.length > 0) {
		const changedRows = hasSqliteSessionOwnerColumns(database.db) ? executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"session_key",
			"entry_json",
			"owner_actor_type",
			"owner_actor_id",
			"owner_assigned_by_type",
			"owner_assigned_by_id",
			"owner_assigned_at"
		]).where("session_key", "in", changedKeys)).rows : executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "entry_json"]).where("session_key", "in", changedKeys)).rows;
		for (const row of changedRows) {
			const entry = parseSessionEntryJson(row);
			if (entry) entries.set(row.session_key, projectSqliteSessionParticipants(database.db, row.session_key, entry));
		}
	}
	return {
		entries,
		keys: versions.map((row) => row.session_key).toSorted(),
		listEntries: createLazyListProjections(entries, listProjections),
		listProjections,
		updatedAtByKey,
		validityToken
	};
}
function readSessionEntryCache(database, options) {
	if (!options.cache || options.latest || database.db.isTransaction) return loadSessionEntrySnapshot(database);
	const validityToken = readCacheValidityToken(database.db);
	const cached = sessionEntryCaches.get(database.db);
	if (cached && cacheValidityTokensEqual(cached.validityToken, validityToken)) return cached;
	if (cached && cached.validityToken.dataVersion === validityToken.dataVersion) {
		const revalidated = incrementallyRevalidateSessionEntrySnapshot(database, cached, validityToken);
		if (readDataVersion(database.db) !== validityToken.dataVersion) {
			const reloadToken = readCacheValidityToken(database.db);
			const next = {
				...loadSessionEntrySnapshot(database),
				validityToken: reloadToken
			};
			sessionEntryCaches.set(database.db, next);
			return next;
		}
		sessionEntryCaches.set(database.db, revalidated);
		return revalidated;
	}
	const next = {
		...loadSessionEntrySnapshot(database),
		validityToken
	};
	sessionEntryCaches.set(database.db, next);
	return next;
}
function invalidateTrackedCache(database) {
	const invalidate = () => {
		sessionEntryCaches.delete(database.db);
	};
	if (deferOpenClawAgentPostCommitPublication(database, invalidate)) return;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	invalidate();
}
function publishTrackedCacheUpdate(database, publish) {
	if (deferOpenClawAgentPostCommitPublication(database, publish)) return;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	publish();
}
function publishSqliteSessionEntryCacheUpsert(database, row, writeGeneration) {
	const ownerRow = hasSqliteSessionOwnerColumns(database.db) ? executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select([
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]).where("session_key", "=", row.session_key).limit(1)).rows[0] : void 0;
	const parsedEntry = parseSessionEntryJson({
		current_session_id: row.current_session_id,
		entry_json: row.entry_json,
		updated_at: row.updated_at,
		...ownerRow
	});
	if (!parsedEntry) {
		invalidateTrackedCache(database);
		return;
	}
	const entry = projectSqliteSessionParticipants(database.db, row.session_key, parsedEntry);
	if (!writeGeneration) {
		invalidateTrackedCache(database);
		return;
	}
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (!cached) return;
		const generationIsContinuous = cached.validityToken.sessionNodesGeneration === writeGeneration.before;
		cached.entries.set(row.session_key, entry);
		cached.listProjections.delete(row.session_key);
		const knownKey = cached.updatedAtByKey.has(row.session_key);
		cached.updatedAtByKey.set(row.session_key, row.updated_at);
		if (!knownKey) cached.keys = [...cached.keys, row.session_key].toSorted();
		if (generationIsContinuous) cached.validityToken = {
			...cached.validityToken,
			sessionNodesGeneration: writeGeneration.after
		};
	});
}
function publishSessionEntryCacheInvalidation(database, row, writeGeneration) {
	if (row) {
		publishSqliteSessionEntryCacheUpsert(database, row, writeGeneration);
		return;
	}
	invalidateTrackedCache(database);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-equality.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.name = "SqliteSessionMutationConflictError";
	}
};
function sqliteSessionEntriesEqual(left, right) {
	if (!left || !right) return left === right;
	const { participants: _leftParticipants, participantCount: _leftParticipantCount, ...leftEntry } = left;
	const { participants: _rightParticipants, participantCount: _rightParticipantCount, ...rightEntry } = right;
	return JSON.stringify(leftEntry) === JSON.stringify(rightEntry);
}
function sqliteSessionSnapshotRowsEqual(left, right) {
	return left.length === right.length && left.every((row, index) => row.sessionKey === right[index]?.sessionKey && sqliteSessionEntriesEqual(row.entry, right[index]?.entry));
}
function sqliteLifecycleTargetSnapshotsEqual(expected, current) {
	return expected.primary?.key === current.primary?.key && sqliteSessionEntriesEqual(expected.primary?.entry, current.primary?.entry) && sqliteSessionSnapshotRowsEqual(expected.rows, current.rows);
}
function assertSessionEntrySelectionUnchanged(expected, current, operationLabel) {
	if (!(expected.selected?.row.session_key === current.selected?.row.session_key && sqliteSessionEntriesEqual(expected.selected?.entry, current.selected?.entry)) || !sqliteSessionSnapshotRowsEqual(expected.selectedRows, current.selectedRows)) throw new SqliteSessionMutationConflictError(operationLabel);
}
function assertLifecycleTargetSnapshotUnchanged(expected, current, operationLabel) {
	if (!sqliteLifecycleTargetSnapshotsEqual(expected, current)) throw new SqliteSessionMutationConflictError(operationLabel);
}
//#endregion
//#region src/config/sessions/conversation-route-context.ts
const MAX_ROUTE_CONTEXT_ID_LENGTH = 512;
const MAX_ROUTE_CONTEXT_ROLE_IDS = 256;
const MAX_STORED_ROUTE_CONTEXT_LENGTH = 14e4;
function normalizeBoundedId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= MAX_ROUTE_CONTEXT_ID_LENGTH ? normalized : void 0;
}
function normalizeRoleIds(value) {
	if (value === void 0) return { valid: true };
	if (!Array.isArray(value) || value.length > MAX_ROUTE_CONTEXT_ROLE_IDS) return { valid: false };
	const roleIds = [];
	for (const item of value) {
		const roleId = normalizeBoundedId(item);
		if (!roleId) return { valid: false };
		roleIds.push(roleId);
	}
	const unique = [...new Set(roleIds)].toSorted();
	return unique.length > 0 ? {
		valid: true,
		value: unique
	} : { valid: true };
}
/** Parses the closed, bounded route facts used to replay configured routing precedence. */
function parseConversationRouteContext(value) {
	if (!isRecord(value)) return;
	const guildId = normalizeBoundedId(value.guildId);
	const peerId = normalizeBoundedId(value.peerId);
	const teamId = normalizeBoundedId(value.teamId);
	const parentPeerId = normalizeBoundedId(value.parentPeerId);
	const memberRoleIds = normalizeRoleIds(value.memberRoleIds);
	if (value.peerId !== void 0 && !peerId || value.guildId !== void 0 && !guildId || value.teamId !== void 0 && !teamId || value.parentPeerId !== void 0 && !parentPeerId || !memberRoleIds.valid) return;
	if (!peerId && !guildId && !teamId && !parentPeerId && !memberRoleIds.value) return;
	return {
		...peerId ? { peerId } : {},
		...guildId ? { guildId } : {},
		...teamId ? { teamId } : {},
		...parentPeerId ? { parentPeerId } : {},
		...memberRoleIds.value ? { memberRoleIds: memberRoleIds.value } : {}
	};
}
/** Captures only authoritative inbound facts needed to replay configured route precedence. */
function conversationRouteContextFromMsgContext(ctx) {
	const channel = normalizeOptionalLowercaseString(ctx.OriginatingChannel ?? ctx.Provider);
	const spaceId = normalizeBoundedId(ctx.GroupSpace);
	const parentPeerId = normalizeBoundedId(ctx.ThreadParentId);
	return parseConversationRouteContext({
		...ctx.ConversationRoutePeerId !== void 0 ? { peerId: ctx.ConversationRoutePeerId } : {},
		...channel === "discord" && spaceId ? { guildId: spaceId } : {},
		...(channel === "slack" || channel === "mattermost" || channel === "msteams") && spaceId ? { teamId: spaceId } : {},
		...parentPeerId ? { parentPeerId } : {},
		...ctx.MemberRoleIds !== void 0 ? { memberRoleIds: ctx.MemberRoleIds } : {}
	});
}
function serializeStoredConversationRouteContext(context, observedAt) {
	const canonical = context === null ? null : parseConversationRouteContext(context);
	if (context !== null && !canonical) throw new Error("Invalid conversation route context");
	return JSON.stringify({
		version: 1,
		writeId: randomUUID(),
		observedAt,
		context: canonical ?? null
	});
}
function parseStoredConversationRouteContext(value, expectedObservedAt) {
	if (!value || value.length > MAX_STORED_ROUTE_CONTEXT_LENGTH) return;
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	if (!isRecord(parsed) || parsed.version !== 1 || typeof parsed.writeId !== "string" || parsed.writeId.length === 0 || typeof parsed.observedAt !== "number" || parsed.observedAt !== expectedObservedAt) return;
	const context = parseConversationRouteContext(parsed.context);
	if (parsed.context !== null && !context) return;
	return context ? { context } : {};
}
function refreshStoredConversationRouteContext(value, previousObservedAt, observedAt) {
	const stored = parseStoredConversationRouteContext(value, previousObservedAt);
	return stored ? serializeStoredConversationRouteContext(stored.context ?? null, observedAt) : null;
}
//#endregion
//#region src/config/sessions/conversation-identity.ts
function normalizeThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeOptionalString(value);
}
function normalizeKind(value) {
	const normalized = normalizeChatType(typeof value === "string" ? value : void 0);
	if (normalized === "channel") return "channel";
	if (normalized === "group") return "group";
	return "direct";
}
function resolvePairedOriginPeerId(params) {
	if (params.kind !== "direct") return;
	const origin = sessionDeliveryOrigin(params.entry);
	const originFrom = normalizeOptionalString(origin?.from);
	const originTo = normalizeOptionalString(origin?.to);
	const originChannel = normalizeOptionalString(origin?.provider)?.toLowerCase();
	const deliveryChannel = normalizeOptionalString(params.deliveryContext?.channel)?.toLowerCase();
	if (!originFrom || originTo !== params.deliveryTarget || !originChannel || originChannel !== deliveryChannel || normalizeChatType(origin?.chatType) !== params.kind || (normalizeOptionalAccountId(origin?.accountId) ?? "default") !== (normalizeOptionalAccountId(params.deliveryContext?.accountId) ?? "default") || normalizeThreadId(origin?.threadId) !== normalizeThreadId(params.deliveryContext?.threadId)) return;
	return originFrom;
}
/** Builds one stable transport address from authoritative channel route facts. */
function buildConversationIdentity(params) {
	const channel = normalizeOptionalString(params.channel)?.toLowerCase();
	const rawPeerId = normalizeOptionalString(params.peerId);
	if (!channel || !rawPeerId) return null;
	const peerId = normalizeConversationPeerId(channel, rawPeerId);
	if (!peerId) return null;
	const deliveryTarget = normalizeOptionalString(params.deliveryTarget);
	if (!deliveryTarget) return null;
	const accountId = normalizeOptionalAccountId(params.accountId) ?? "default";
	const rawParent = normalizeOptionalString(params.parentConversationRef);
	const parentConversationRef = rawParent ? rawParent.startsWith("conv_") ? rawParent : buildConversationRef({
		channel,
		accountId,
		kind: params.kind,
		peerId: normalizeConversationPeerId(channel, rawParent)
	}) : void 0;
	const threadId = normalizeThreadId(params.threadId);
	return {
		conversationRef: buildConversationRef({
			channel,
			accountId,
			kind: params.kind,
			peerId,
			parentConversationRef,
			threadId
		}),
		channel,
		accountId,
		kind: params.kind,
		peerId,
		deliveryTarget,
		...parentConversationRef ? { parentConversationRef } : {},
		...threadId ? { threadId } : {},
		...normalizeOptionalString(params.nativeChannelId) ? { nativeChannelId: normalizeOptionalString(params.nativeChannelId) } : {},
		...normalizeOptionalString(params.nativeDirectUserId) ? { nativeDirectUserId: normalizeOptionalString(params.nativeDirectUserId) } : {},
		...normalizeOptionalString(params.label) ? { label: normalizeOptionalString(params.label) } : {},
		...params.metadata ? { metadata: params.metadata } : {}
	};
}
/** Derives a transport address from the canonical route snapshot persisted on a session. */
function conversationIdentityFromSessionEntry(entry, routeContext) {
	const deliveryContext = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	const kind = normalizeKind(entry.chatType);
	const routeTarget = normalizeOptionalString(deliveryContext?.to);
	const deliveryTarget = routeTarget ?? (kind === "direct" ? normalizeOptionalString(origin?.from) : void 0);
	const routeOwnsTarget = Boolean(routeTarget);
	const channel = routeOwnsTarget ? deliveryContext?.channel : normalizeOptionalString(origin?.provider);
	const pairedOriginPeerId = routeTarget ? resolvePairedOriginPeerId({
		entry,
		deliveryContext,
		deliveryTarget: routeTarget,
		kind
	}) : void 0;
	return buildConversationIdentity({
		channel,
		accountId: routeOwnsTarget ? deliveryContext?.accountId : origin?.accountId,
		kind,
		peerId: routeContext?.peerId ?? pairedOriginPeerId ?? deliveryTarget,
		deliveryTarget,
		threadId: routeOwnsTarget ? deliveryContext?.threadId : origin?.threadId,
		nativeChannelId: origin?.nativeChannelId,
		nativeDirectUserId: origin?.nativeDirectUserId,
		label: entry.displayName ?? entry.label
	});
}
/** Derives the same stable address from live inbound channel facts. */
function conversationIdentityFromMsgContext(params) {
	const route = deriveSessionOrigin(params.ctx);
	const explicitDeliveryContext = normalizeDeliveryContext(params.deliveryContext);
	const deliveryContext = mergeDeliveryContext(explicitDeliveryContext, normalizeDeliveryContext({
		channel: route?.provider,
		to: route?.to,
		accountId: route?.accountId,
		threadId: route?.threadId
	}));
	const groupResolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	const routeContext = conversationRouteContextFromMsgContext(params.ctx);
	const kind = groupResolution?.chatType ?? normalizeKind(params.ctx.ChatType);
	const directIngressTarget = kind === "direct" ? normalizeOptionalString(params.ctx.From) : void 0;
	const useDirectIngressTarget = Boolean(directIngressTarget && !explicitDeliveryContext?.to);
	const deliveryTarget = useDirectIngressTarget ? directIngressTarget : normalizeOptionalString(deliveryContext?.to) ?? normalizeOptionalString(params.ctx.OriginatingTo) ?? normalizeOptionalString(params.ctx.To);
	return buildConversationIdentity({
		channel: useDirectIngressTarget ? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider) : deliveryContext?.channel ?? groupResolution?.channel ?? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider),
		accountId: useDirectIngressTarget ? route?.accountId ?? params.ctx.AccountId : deliveryContext?.accountId ?? route?.accountId ?? params.ctx.AccountId,
		kind,
		peerId: routeContext?.peerId ?? deliveryTarget,
		deliveryTarget,
		threadId: useDirectIngressTarget ? route?.threadId ?? params.ctx.MessageThreadId : deliveryContext?.threadId ?? params.ctx.MessageThreadId,
		nativeChannelId: params.ctx.NativeChannelId ?? route?.nativeChannelId,
		nativeDirectUserId: params.ctx.NativeDirectUserId ?? route?.nativeDirectUserId,
		label: normalizeOptionalString(resolveConversationLabel(params.ctx)) ?? route?.label
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-conversation.ts
/** Shared-main DMs multiplex peers through one context; every other routed session has one primary. */
function prepareSessionConversation(params) {
	const routeContext = params.routeContext === null ? null : params.routeContext === void 0 ? void 0 : parseConversationRouteContext(params.routeContext);
	if (params.routeContext !== void 0 && params.routeContext !== null && !routeContext) throw new Error("Invalid conversation route context");
	const identity = conversationIdentityFromSessionEntry(params.entry, routeContext);
	if (!identity) return null;
	return {
		identity,
		role: params.sessionScope === "shared-main" && identity.kind === "direct" ? "participant" : "primary",
		...routeContext !== void 0 ? { routeContext } : {}
	};
}
/** Keeps a previously observed route peer when a generic session writer has no route facts. */
function preserveSessionConversationIdentity(params) {
	if (params.sessionIds.length === 0) return params.identity;
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQuerySync(params.database.db, db.selectFrom("session_conversations as sc").innerJoin("conversations as c", "c.conversation_id", "sc.conversation_id").select([
		"c.conversation_id",
		"c.channel",
		"c.account_id",
		"c.kind",
		"c.peer_id",
		"c.delivery_target",
		"c.parent_conversation_id",
		"c.thread_id",
		"c.native_channel_id",
		"c.native_direct_user_id",
		"c.label",
		"c.metadata_json"
	]).where("sc.session_id", "in", params.sessionIds).where("c.channel", "=", params.identity.channel).where("c.account_id", "=", params.identity.accountId).where("c.kind", "=", params.identity.kind).where("c.delivery_target", "=", params.identity.deliveryTarget).where("sc.role", "in", ["primary", "participant"]).where("c.thread_id", params.identity.threadId ? "=" : "is", params.identity.threadId ?? null).orderBy("sc.last_seen_at", "desc").limit(1)).rows[0];
	let metadata;
	if (row?.metadata_json) try {
		const parsed = JSON.parse(row.metadata_json);
		metadata = isRecord(parsed) ? parsed : void 0;
	} catch {
		metadata = void 0;
	}
	return row ? {
		conversationRef: row.conversation_id,
		channel: row.channel,
		accountId: row.account_id,
		kind: params.identity.kind,
		peerId: row.peer_id,
		deliveryTarget: row.delivery_target,
		...row.parent_conversation_id ? { parentConversationRef: row.parent_conversation_id } : {},
		...row.thread_id ? { threadId: row.thread_id } : {},
		...row.native_channel_id ? { nativeChannelId: row.native_channel_id } : {},
		...row.native_direct_user_id ? { nativeDirectUserId: row.native_direct_user_id } : {},
		...params.identity.label ?? row.label ? { label: params.identity.label ?? row.label } : {},
		...metadata ? { metadata } : {}
	} : params.identity;
}
function prepareSessionConversationForWrite(params) {
	const conversation = prepareSessionConversation(params);
	if (!conversation || params.routeContext !== void 0) return conversation;
	conversation.identity = preserveSessionConversationIdentity({
		database: params.database,
		identity: conversation.identity,
		sessionIds: [params.entry.sessionId, params.previousEntry?.sessionId].filter((sessionId) => Boolean(sessionId))
	});
	return conversation;
}
/** Upserts the address before the session row so its primary-conversation FK is always valid. */
function upsertConversationIdentity(database, identity, updatedAt) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("conversations").values({
		conversation_id: identity.conversationRef,
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet({
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		updated_at: updatedAt
	})));
}
/** Links one external address to its local context without conflating the two identities. */
function linkSessionConversation(params) {
	const { database, sessionId, conversation, updatedAt } = params;
	const db = getSessionKysely(database.db);
	const readAssociation = (candidateSessionId) => executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select(["last_seen_at", "route_context_json"]).where("session_id", "=", candidateSessionId).where("conversation_id", "=", conversation.identity.conversationRef).orderBy("last_seen_at", "desc").limit(1)).rows[0];
	const existingAssociation = readAssociation(sessionId) ?? (params.previousSessionId && params.previousSessionId !== sessionId ? readAssociation(params.previousSessionId) : void 0);
	const routeContextJson = conversation.routeContext === void 0 ? existingAssociation ? refreshStoredConversationRouteContext(existingAssociation.route_context_json, existingAssociation.last_seen_at, updatedAt) : null : serializeStoredConversationRouteContext(conversation.routeContext, updatedAt);
	if (conversation.role === "primary") {
		const stalePrimaryRows = executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select([
			"conversation_id",
			"first_seen_at",
			"last_seen_at",
			"route_context_json"
		]).where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef)).rows;
		if (stalePrimaryRows.length > 0) {
			executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values(stalePrimaryRows.map((row) => ({
				session_id: sessionId,
				conversation_id: row.conversation_id,
				role: "related",
				route_context_json: refreshStoredConversationRouteContext(row.route_context_json, row.last_seen_at, updatedAt),
				first_seen_at: row.first_seen_at,
				last_seen_at: updatedAt
			}))).onConflict((conflict) => conflict.columns([
				"session_id",
				"conversation_id",
				"role"
			]).doUpdateSet((eb) => ({
				route_context_json: eb.ref("excluded.route_context_json"),
				last_seen_at: updatedAt
			}))));
			executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef));
		}
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("conversation_id", "=", conversation.identity.conversationRef).where("role", "!=", conversation.role));
	executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values({
		session_id: sessionId,
		conversation_id: conversation.identity.conversationRef,
		role: conversation.role,
		route_context_json: routeContextJson,
		first_seen_at: updatedAt,
		last_seen_at: updatedAt
	}).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({
		route_context_json: routeContextJson,
		last_seen_at: updatedAt
	})));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-node-artifacts.ts
function clearSessionCollaborationForKey(database, sessionKey, options = {}) {
	const presentTables = readSessionNodeArtifactTables(database);
	const db = getSessionKysely(database.db);
	if (presentTables.has("session_members")) executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
	if (options.clearSuggestions !== false && presentTables.has("session_suggestions")) executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("session_key", "=", sessionKey));
}
/** Copy logical-session artifacts into their canonical node within one agent store or across two. */
function copySessionNodeArtifactsForRepair(source, destination, sourceKeys, canonicalKey, options = {}) {
	const keys = [...new Set(sourceKeys)];
	if (keys.length === 0) return;
	const sourceDb = getSessionKysely(source.db);
	const destinationDb = getSessionKysely(destination.db);
	const sourceKeyReferences = new Set(keys.flatMap((key) => [key, key.trim()]));
	const sourceTables = readSessionNodeArtifactTables(source);
	let destinationTables = readSessionNodeArtifactTables(destination);
	if (options.includeParticipants !== false && sourceTables.has("session_participants") && !destinationTables.has("session_participants")) {
		ensureSessionParticipantsSchema(destination.db);
		destinationTables = readSessionNodeArtifactTables(destination);
	}
	if (options.includeParticipants !== false && destinationTables.has("session_participants")) ensureSessionParticipantsSchema(destination.db);
	if (sourceTables.has("session_progress_cards")) {
		const progressCards = executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_progress_cards").selectAll().where("session_key", "in", keys)).rows;
		if (progressCards.length > 0 && !destinationTables.has("session_progress_cards")) {
			ensureOpenClawAgentProgressCardSchemaInTransaction(destination.db);
			destinationTables = readSessionNodeArtifactTables(destination);
		}
		for (const progressCard of progressCards) {
			const canonicalProgressCard = {
				...progressCard,
				session_key: canonicalKey
			};
			executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_progress_cards").values(canonicalProgressCard).onConflict((conflict) => conflict.column("session_key").doUpdateSet(canonicalProgressCard).where((eb) => eb.or([eb("revision", "<", progressCard.revision), eb.and([eb("revision", "=", progressCard.revision), eb("updated_at", "<", progressCard.updated_at)])]))));
		}
	}
	if (sourceTables.has("board_tabs") && sourceTables.has("board_widgets") && destinationTables.has("board_tabs") && destinationTables.has("board_widgets")) {
		for (const tab of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_tabs").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_tabs").values({
			...tab,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
			title: tab.title,
			position: tab.position,
			chat_dock: tab.chat_dock,
			created_by: tab.created_by,
			revision: tab.revision
		}).where("revision", "<", tab.revision)));
		for (const widget of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_widgets").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_widgets").values({
			...widget,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
			...widget,
			session_key: canonicalKey
		}).where((eb) => eb.or([eb("revision", "<", widget.revision), eb.and([eb("revision", "=", widget.revision), eb("updated_at", "<", widget.updated_at)])]))));
	}
	if (options.includeMembers !== false && sourceTables.has("session_members") && destinationTables.has("session_members")) for (const member of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_members").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_members").values({
		...member,
		session_key: canonicalKey
	}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing()));
	if (sourceTables.has("session_suggestions") && destinationTables.has("session_suggestions")) if (source.db === destination.db) executeSqliteQuerySync(destination.db, destinationDb.updateTable("session_suggestions").set({ session_key: canonicalKey }).where("session_key", "in", keys));
	else for (const suggestion of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_suggestions").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_suggestions").values({
		...suggestion,
		session_key: canonicalKey
	}).onConflict((conflict) => conflict.column("id").doNothing()));
	if (sourceTables.has("heartbeat_outcomes") && destinationTables.has("heartbeat_outcomes")) for (const heartbeat of executeSqliteQuerySync(source.db, sourceDb.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("heartbeat_outcomes").values({
		...heartbeat,
		session_key: canonicalKey,
		run_session_key: sourceKeyReferences.has(heartbeat.run_session_key) ? canonicalKey : heartbeat.run_session_key
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		...heartbeat,
		session_key: canonicalKey,
		run_session_key: sourceKeyReferences.has(heartbeat.run_session_key) ? canonicalKey : heartbeat.run_session_key
	}).where((eb) => eb.or([eb("updated_at", "<", heartbeat.updated_at), eb.and([eb("updated_at", "=", heartbeat.updated_at), eb("occurred_at", "<", heartbeat.occurred_at)])]))));
	if (options.includeParticipants !== false && sourceTables.has("session_participants") && destinationTables.has("session_participants")) for (const participant of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_participants").selectAll().where("session_key", "in", keys)).rows) {
		if (source.db === destination.db && participant.session_key === canonicalKey) continue;
		const existing = executeSqliteQueryTakeFirstSync(destination.db, destinationDb.selectFrom("session_participants").select([
			"actor_source",
			"contribution_count",
			"first_prompted_at",
			"last_prompted_at"
		]).where("session_key", "=", canonicalKey).where("actor_type", "=", participant.actor_type).where("actor_id", "=", participant.actor_id));
		const incomingProfile = participant.actor_type === "human" && participant.actor_source === "profile";
		const existingProfile = existing?.actor_source === "profile";
		const incomingCount = participant.contribution_count ?? 1;
		const existingCount = existing?.contribution_count ?? 1;
		const contributionCount = !incomingProfile ? existing?.contribution_count ?? null : !existingProfile ? incomingCount : source.db === destination.db ? existingCount + incomingCount : Math.max(existingCount, incomingCount);
		executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_participants").values({
			...participant,
			contribution_count: incomingProfile ? participant.contribution_count ?? 1 : null,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns([
			"session_key",
			"actor_type",
			"actor_id"
		]).doUpdateSet({
			actor_source: mergeSessionParticipantSource(existing?.actor_source, participant.actor_source),
			contribution_count: contributionCount,
			first_prompted_at: incomingProfile && !existingProfile ? participant.first_prompted_at : existingProfile && !incomingProfile ? existing.first_prompted_at : Math.min(existing?.first_prompted_at ?? participant.first_prompted_at, participant.first_prompted_at),
			last_prompted_at: Math.max(existing?.last_prompted_at ?? participant.last_prompted_at, participant.last_prompted_at)
		})));
	}
}
/** Membership is authorization state; canonical repair replaces it from the selected winner. */
function deleteSessionMembersForRepair(database, sessionKey) {
	if (!readSessionNodeArtifactTables(database).has("session_members")) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
}
function deleteSessionDeliveryArtifacts(database, sessionKey, additionalKeys = []) {
	const db = getSessionKysely(database.db);
	const trimmedKey = sessionKey.trim();
	const lookupKeys = uniqueStrings([
		sessionKey,
		trimmedKey,
		normalizeStoreSessionKey(trimmedKey),
		...additionalKeys
	]);
	const competingIdentities = new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => row.session_key === sessionKey ? [] : [normalizeStoreSessionKey(row.session_key.trim())]));
	const sessionKeys = lookupKeys.filter((key) => key === sessionKey || !competingIdentities.has(normalizeStoreSessionKey(key.trim())));
	executeSqliteQuerySync(database.db, db.deleteFrom("conversation_deliveries").where("source_session_key", "in", sessionKeys));
}
function deleteSessionNodeArtifacts(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const presentTables = readSessionNodeArtifactTables(database);
	if (presentTables.has("board_tabs") && presentTables.has("board_widgets")) {
		executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "=", sessionKey));
		executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "=", sessionKey));
	}
	for (const table of [
		"heartbeat_outcomes",
		"session_participants",
		"session_progress_cards"
	]) {
		if (!presentTables.has(table)) continue;
		executeSqliteQuerySync(database.db, db.deleteFrom(table).where("session_key", "=", sessionKey));
	}
	clearSessionCollaborationForKey(database, sessionKey);
}
function readSessionNodeArtifactTables(database) {
	const db = getSessionKysely(database.db);
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", [
		"board_tabs",
		"board_widgets",
		"heartbeat_outcomes",
		"session_members",
		"session_participants",
		"session_progress_cards",
		"session_suggestions"
	])).rows.flatMap((row) => row.name ? [row.name] : []));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-provenance.ts
function bindSessionEntryProvenance(entry) {
	const hookSource = entry.hookExternalContentSource;
	const persistedHookSource = hookSource === "email" ? "webhook" : hookSource;
	return {
		session_entry_provenance: 1,
		acp_owned: entry.acp ? 1 : 0,
		plugin_owner_id: typeof entry.pluginOwnerId === "string" && entry.pluginOwnerId.trim() ? entry.pluginOwnerId.trim() : null,
		hook_external_content_source: persistedHookSource === "gmail" || persistedHookSource === "webhook" ? persistedHookSource : null
	};
}
function resolveSessionEntryProvenanceRow(params) {
	const db = getNodeSqliteKysely(params.database.db);
	const existingRoot = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("session_windows").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source"
	]).where("session_id", "=", params.entry.sessionId));
	const hasTranscript = Boolean(executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1)));
	if (existingRoot?.session_entry_provenance === 0 && (params.previousEntry?.sessionId === params.entry.sessionId || hasTranscript)) return {
		...params.boundSessionRow,
		session_entry_provenance: 0,
		acp_owned: 0,
		plugin_owner_id: null,
		hook_external_content_source: null
	};
	return existingRoot?.session_entry_provenance === 1 ? {
		...params.boundSessionRow,
		acp_owned: existingRoot.acp_owned === 1 ? 1 : params.boundSessionRow.acp_owned,
		plugin_owner_id: params.boundSessionRow.plugin_owner_id ?? existingRoot.plugin_owner_id,
		hook_external_content_source: params.boundSessionRow.hook_external_content_source ?? existingRoot.hook_external_content_source
	} : params.boundSessionRow;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-references.ts
/** Every transcript generation retained by one canonical logical-session record. */
function collectSessionStateIdsForEntry(entry) {
	const sessionIds = [];
	const add = (sessionId) => {
		const normalized = sessionId?.trim();
		if (normalized) sessionIds.push(normalized);
	};
	add(entry.sessionId);
	add(entry.previousSessionId);
	for (const sessionId of entry.usageFamilySessionIds ?? []) add(sessionId);
	for (const checkpoint of entry.compactionCheckpoints ?? []) {
		add(checkpoint.sessionId);
		add(checkpoint.preCompaction.sessionId);
		add(checkpoint.postCompaction.sessionId);
	}
	return uniqueStrings(sessionIds);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-normalize.ts
function createFallbackSessionEntry(patch) {
	const now = Date.now();
	return {
		sessionId: patch.sessionId ?? randomUUID(),
		updatedAt: patch.updatedAt ?? now,
		...patch
	};
}
function normalizeText(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function normalizeSessionRowChatType(value) {
	if (value === "direct" || value === "group" || value === "channel") return value;
	return null;
}
function coerceSqliteNumber(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-session-row.ts
function normalizeSessionEntryTimestamp(entry) {
	const hasLegacyDeliveryFields = [
		"route",
		"deliveryContext",
		"origin",
		"channel",
		"lastChannel",
		"lastTo",
		"lastAccountId",
		"lastThreadId"
	].some((key) => key in entry);
	const delivery = entry.delivery ?? (hasLegacyDeliveryFields ? void 0 : { kind: "none" });
	if (typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)) {
		if (entry.delivery === delivery) return entry;
		return delivery ? {
			...entry,
			delivery
		} : entry;
	}
	const updatedAt = typeof entry.sessionStartedAt === "number" && Number.isFinite(entry.sessionStartedAt) ? entry.sessionStartedAt : Date.now();
	return delivery ? {
		...entry,
		delivery,
		updatedAt
	} : {
		...entry,
		updatedAt
	};
}
function bindSessionRoot(params) {
	const updatedAt = Number.isFinite(params.entry.updatedAt) ? params.entry.updatedAt : params.updatedAt;
	return {
		session_id: params.entry.sessionId,
		session_key: params.sessionKey,
		reason: null,
		created_at: resolveSqliteSessionCreatedAt(params.entry, updatedAt),
		updated_at: updatedAt,
		...bindSessionEntryProvenance(params.entry),
		...bindSessionWindowEntryProjection(params),
		primary_conversation_id: null
	};
}
function bindSessionWindowEntryProjection(params) {
	return {
		previous_session_id: normalizeText(params.entry.previousSessionId),
		session_scope: resolveSqliteSessionScope(params.entry, params.sessionKey),
		started_at: finiteSqliteNumber(params.entry.startedAt),
		ended_at: finiteSqliteNumber(params.entry.endedAt),
		status: normalizeStatus(params.entry.status),
		chat_type: normalizeSessionRowChatType(params.entry.chatType),
		channel: resolveSqliteSessionChannel(params.entry),
		account_id: resolveSqliteSessionAccountId(params.entry),
		model_provider: normalizeText(params.entry.modelProvider),
		model: normalizeText(params.entry.model),
		agent_harness_id: normalizeText(params.entry.agentHarnessId),
		parent_session_key: normalizeText(params.entry.parentSessionKey),
		spawned_by: normalizeText(params.entry.spawnedBy),
		display_name: resolveSqliteSessionDisplayName(params.entry)
	};
}
/** Project the canonical entry blob into the logical-node query columns. */
function bindSessionNode(params) {
	const canonicalEntry = projectCanonicalSessionEntryShape({ ...params.entry });
	const actor = params.entry.createdActor;
	const legacyActorId = normalizeText(params.entry.createdBy?.id);
	return {
		session_key: params.sessionKey,
		current_session_id: params.entry.sessionId,
		entry_json: JSON.stringify(stripRuntimeOnlySessionSkillsFields(canonicalEntry)),
		entry_valid: 1,
		updated_at: params.updatedAt,
		status: normalizeStatus(params.entry.status),
		created_at: finiteSqliteNumber(params.entry.createdAt),
		created_via: normalizeSqliteCreatedVia(params.entry.createdVia),
		created_actor_type: normalizeSqliteCreatedActorType(actor?.type) ?? (legacyActorId ? "human" : null),
		created_actor_id: normalizeText(actor?.id) ?? legacyActorId,
		project_id: normalizeText(params.entry.projectId),
		parent_session_key: normalizeText(params.entry.parentSessionKey) ?? normalizeText(params.entry.spawnedBy),
		spawned_by: normalizeText(params.entry.spawnedBy),
		fork_source_session_key: normalizeText(params.entry.forkSource?.sessionKey),
		fork_source_session_id: normalizeText(params.entry.forkSource?.sessionId),
		fork_source_entry_id: normalizeText(params.entry.forkSource?.entryId),
		label: normalizeText(params.entry.label),
		display_name: normalizeText(params.entry.displayName),
		category: normalizeText(params.entry.category),
		icon: normalizeText(canonicalEntry.icon),
		pinned_at: finiteSqliteNumber(params.entry.pinnedAt),
		archived_at: finiteSqliteNumber(params.entry.archivedAt),
		last_read_at: finiteSqliteNumber(params.entry.lastReadAt),
		last_interaction_at: finiteSqliteNumber(params.entry.lastInteractionAt),
		last_activity_at: finiteSqliteNumber(params.entry.lastActivityAt)
	};
}
function normalizeSqliteCreatedVia(value) {
	return value === "operator" || value === "spawn" || value === "channel" || value === "cron" || value === "talk" || value === "run" || value === "plugin" || value === "internal" ? value : null;
}
function normalizeSqliteCreatedActorType(value) {
	return value === "human" || value === "agent" || value === "system" ? value : null;
}
function resolveSqliteSessionScope(entry, sessionKey) {
	const chatType = normalizeSessionRowChatType(entry.chatType);
	const normalizedKey = sessionKey.trim().toLowerCase();
	if (chatType === "direct" && (normalizedKey === "main" || normalizedKey.endsWith(":main"))) return "shared-main";
	if (chatType === "group" || chatType === "channel") return chatType;
	return "conversation";
}
function resolveSqliteSessionCreatedAt(entry, updatedAt) {
	for (const candidate of [
		entry.sessionStartedAt,
		entry.startedAt,
		entry.updatedAt,
		updatedAt
	]) if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) return candidate;
	return updatedAt;
}
function finiteSqliteNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function resolveSqliteSessionChannel(entry) {
	return normalizeText(sessionDeliveryChannel(entry));
}
function resolveSqliteSessionAccountId(entry) {
	return normalizeText(deliveryContextFromSession(entry)?.accountId);
}
function resolveSqliteSessionDisplayName(entry) {
	return normalizeText(entry.displayName) ?? normalizeText(entry.label) ?? normalizeText(entry.subject) ?? normalizeText(entry.groupId);
}
//#endregion
//#region src/config/sessions/session-canonical-key.ts
const SESSION_CANONICAL_KEY_REPAIR_COMMAND = "openclaw doctor --fix";
const validatedDatabases = /* @__PURE__ */ new WeakSet();
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run ${SESSION_CANONICAL_KEY_REPAIR_COMMAND}`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
function isCanonicalSessionKey(sessionKey) {
	const trimmed = sessionKey.trim();
	if (!trimmed || sessionKey !== trimmed) return false;
	if (normalizeStoreSessionKey(sessionKey) !== sessionKey) return false;
	const parsed = parseAgentSessionKey(trimmed);
	return trimmed === "global" || trimmed === "unknown" || parsed !== null && trimmed.startsWith(`agent:${parsed.agentId}:`);
}
function assertCanonicalSessionKeyWrite(sessionKey, expectedAgentId) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!isCanonicalSessionKey(sessionKey) || expectedAgentId && parsed && parsed.agentId !== normalizeAgentId(expectedAgentId)) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
}
function readCanonicalSessionMainKey(database) {
	const db = getNodeSqliteKysely(database.db);
	return normalizeMainKey(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key);
}
function assertCanonicalSessionMainKeyWrite(sessionKey, mainKey) {
	if (parseAgentSessionKey(sessionKey)?.rest === "main" && mainKey !== "main") throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
}
function assertCanonicalSessionEntryLineageWrite(database, entry) {
	const sessionKeys = [
		entry.parentSessionKey,
		entry.spawnedBy,
		entry.forkSource?.sessionKey
	].filter((sessionKey) => sessionKey !== void 0);
	if (sessionKeys.length === 0) return;
	const mainKey = readCanonicalSessionMainKey(database);
	for (const sessionKey of sessionKeys) {
		assertCanonicalSessionKeyWrite(sessionKey);
		assertCanonicalSessionMainKeyWrite(sessionKey, mainKey);
	}
}
function assertCanonicalSessionKeyWriteMatchesDatabase(database, sessionKey) {
	assertCanonicalSessionKeyWrite(sessionKey);
	assertCanonicalSessionMainKeyWrite(sessionKey, readCanonicalSessionMainKey(database));
}
function canonicalSessionKeyMigrationRequiredError(detail) {
	return new SessionCanonicalKeyMigrationRequiredError(detail);
}
function scanCanonicalSqliteSessionEntries(database, visit, mainKey) {
	const db = getNodeSqliteKysely(database.db);
	const storedMainKey = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key;
	const canonicalMainKey = normalizeMainKey(mainKey ?? storedMainKey);
	let count = 0;
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").leftJoin("session_windows as retained_window", (join) => join.onRef("retained_window.session_id", "=", "session_nodes.current_session_id").onRef("retained_window.session_key", "=", "session_nodes.session_key")).select([
		"session_nodes.session_key",
		"session_nodes.current_session_id",
		"session_nodes.entry_json",
		"session_nodes.entry_valid",
		"session_nodes.fork_source_session_key",
		"session_nodes.parent_session_key",
		"session_nodes.spawned_by",
		"retained_window.session_id as retained_window_id"
	]).orderBy("session_nodes.session_key"))) {
		if (row.entry_json === "{}" && row.entry_valid === -1 && row.retained_window_id === row.current_session_id) continue;
		if (row.entry_valid !== 1) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const record = parseSqliteSessionEntryRecord(row);
		if (!record) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const entry = projectCanonicalSessionEntryShape(record);
		if ((row.parent_session_key ?? void 0) !== (entry.parentSessionKey ?? entry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (entry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (entry.forkSource?.sessionKey ?? void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(row.session_key, entry);
		if (deliveryCanonicalKey !== row.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
		const trimmed = row.session_key.trim();
		const parsed = parseAgentSessionKey(trimmed);
		if (row.session_key !== trimmed || normalizeStoreSessionKey(trimmed) !== trimmed || !parsed && trimmed !== "global" && trimmed !== "unknown" || parsed && parsed.rest === "main" && canonicalMainKey !== "main") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${trimmed || row.session_key}`);
		for (const lineageKey of [
			row.parent_session_key,
			row.spawned_by,
			row.fork_source_session_key
		]) {
			if (!lineageKey) continue;
			const normalized = normalizeStoreSessionKey(lineageKey);
			const lineageParsed = parseAgentSessionKey(normalized);
			if (normalized !== lineageKey || !lineageParsed && normalized !== "global" && normalized !== "unknown" || lineageParsed?.rest === "main" && canonicalMainKey !== "main") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${normalized || lineageKey}`);
		}
		visit?.({
			entry,
			sessionKey: row.session_key
		});
		count += 1;
	}
	validatedDatabases.add(database.db);
	return count;
}
function assertCanonicalSqliteSessionKeysCurrent(database, mainKey) {
	if (!validatedDatabases.has(database.db)) scanCanonicalSqliteSessionEntries(database, void 0, mainKey);
}
function setCanonicalSqliteSessionMainKey(database, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const db = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey) return;
	executeSqliteQuerySync(database.db, db.insertInto("session_key_contract").values({
		id: 1,
		main_key: canonicalMainKey,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("id").doUpdateSet({
		main_key: canonicalMainKey,
		updated_at: Date.now()
	})));
	validatedDatabases.delete(database.db);
}
/** Checks the startup contract without joining the writable database lifecycle. */
function isCanonicalSqliteSessionMainKeyCurrent(options, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getNodeSqliteKysely(database.db);
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("schema_meta").select("schema_version").where("meta_key", "=", "primary"))?.schema_version !== 17) return false;
		return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey;
	}, options);
	return result.found && result.value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-state.ts
function createTranscriptGeneration() {
	return randomUUID().replaceAll("-", "");
}
/** Read the current raw transcript generation inside the caller's transaction. */
function readTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId))?.generation;
}
/** Materialize a generation once; pure appends must preserve an existing token. */
function ensureTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doNothing()));
	return readTranscriptGenerationInTransaction(database, sessionId) ?? generation;
}
/** Rotate the watermark in the same transaction as destructive transcript replacement. */
function rotateTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		generation,
		updated_at: Date.now()
	})));
	return generation;
}
function ensureTranscriptSessionRoot(database, scope, updatedAt, options = {}) {
	const db = getSessionKysely(database.db);
	if (!options.allowStoredAlias) {
		assertCanonicalSqliteSessionKeysCurrent(database);
		assertCanonicalSessionKeyWriteMatchesDatabase(database, scope.sessionKey);
		const persistedSessionKey = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", scope.sessionId))?.session_key;
		if (persistedSessionKey && persistedSessionKey !== scope.sessionKey) throw new Error(`Transcript session ${scope.sessionId} is owned by ${persistedSessionKey}, not ${scope.sessionKey}; resolve the transcript target again before retrying.`);
		const lookupKeys = uniqueStrings([scope.sessionKey, ...foldedSessionKeyAliasCandidates(normalizeStoreSessionKey(scope.sessionKey))]);
		const candidates = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"current_session_id",
			"entry_json",
			"entry_valid",
			"session_key",
			"updated_at"
		]).where("session_key", "in", lookupKeys)).rows;
		for (const candidate of candidates) {
			const entry = parseSessionEntryJson(candidate);
			if (!entry) {
				if (!(candidate.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", candidate.current_session_id).where("session_key", "=", candidate.session_key)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${candidate.session_key}`);
				continue;
			}
			if (resolveDeliveryProvenCanonicalSessionKey(candidate.session_key, entry) !== candidate.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${candidate.session_key}`);
		}
		const existing = candidates.find((candidate) => candidate.session_key === scope.sessionKey);
		if (existing && existing.entry_valid !== 1) {
			if (!(existing.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", existing.current_session_id).where("session_key", "=", scope.sessionKey)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${scope.sessionKey}`);
		}
	}
	if ((executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
		session_key: scope.sessionKey,
		current_session_id: scope.sessionId,
		entry_json: "{}",
		entry_valid: -1,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("session_key").doNothing())).numAffectedRows ?? 0n) > 0n) {
		executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: -1 }).where("session_key", "=", scope.sessionKey));
		publishSessionEntryCacheInvalidation(database);
	}
	executeSqliteQuerySync(database.db, db.insertInto("session_windows").values({
		session_id: scope.sessionId,
		session_key: scope.sessionKey,
		previous_session_id: null,
		reason: null,
		session_scope: "conversation",
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({ updated_at: updatedAt })));
}
function readNextTranscriptSeq(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId));
	return (row?.max_seq === null || row?.max_seq === void 0 ? -1 : coerceSqliteNumber(row.max_seq)) + 1;
}
function normalizeTranscriptMutationAtMs(value) {
	const timestamp = Math.floor(value);
	return Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : void 0;
}
function readTranscriptMutationStateInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["transcript_observed_at", "transcript_updated_at"]).where("session_id", "=", sessionId));
	return {
		observedAt: row?.transcript_observed_at ?? null,
		updatedAt: row?.transcript_updated_at ?? null
	};
}
function advanceTranscriptMutationAtInTransaction(database, sessionId, value, options = {}) {
	const transcriptUpdatedAt = normalizeTranscriptMutationAtMs(value);
	if (transcriptUpdatedAt === void 0) return;
	const state = readTranscriptMutationStateInTransaction(database, sessionId);
	const next = options.strictly ? Math.max(transcriptUpdatedAt, (state.updatedAt ?? -1) + 1, (state.observedAt ?? -1) + 1) : Math.max(transcriptUpdatedAt, state.updatedAt ?? 0);
	if (state.updatedAt !== null && state.updatedAt >= next) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ transcript_updated_at: next }).where("session_id", "=", sessionId));
}
function touchTranscriptMutationInTransaction(database, sessionId) {
	const now = normalizeTranscriptMutationAtMs(Date.now());
	if (now !== void 0) advanceTranscriptMutationAtInTransaction(database, sessionId, now, { strictly: true });
}
function deleteTranscriptEventsInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", sessionId));
	return (executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId)).numAffectedRows ?? 0n) > 0n;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-store.ts
function parseReadableSqliteSessionEntryRow(database, row) {
	const record = parseSqliteSessionEntryRecord(row);
	if (record) {
		const entry = projectSqliteSessionParticipants(database.db, row.session_key, projectSqliteSessionOwner(projectCanonicalSessionEntryShape(record), row));
		if (resolveDeliveryProvenCanonicalSessionKey(row.session_key, entry) !== row.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${row.session_key}`);
		return entry;
	}
	if (row.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key)) : void 0) return null;
	throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
}
function readSessionIdentitySnapshot(database, sessionKeys) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const sessionKey of uniqueStrings([...sessionKeys].map((key) => key.trim()))) {
		const row = readExactSessionEntryRow(database, sessionKey);
		if (row) snapshot.set(sessionKey, cloneSessionEntry(row.entry));
	}
	return snapshot;
}
function createSessionIdentitySnapshot(rows) {
	return new Map(rows.map((row) => [row.sessionKey, cloneSessionEntry(row.entry)]));
}
function readSessionEntryRow(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return readSessionEntryRowUnchecked(database, sessionKey);
}
function readSessionEntryRowUnchecked(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const lookupKeys = collectSessionEntryLookupKeys(database, sessionKey);
	if (lookupKeys.length === 0) return;
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "in", lookupKeys).orderBy("session_key", "asc")).rows;
	let selected;
	for (const row of rows) {
		const entry = parseReadableSqliteSessionEntryRow(database, row);
		if (!entry || row.session_key !== sessionKey.trim()) continue;
		selected = {
			entry,
			legacyKeys: [],
			row
		};
	}
	return selected;
}
function readSessionEntrySelectionSnapshot(database, sessionKey, exact) {
	return {
		selected: exact ? readExactSessionEntryRow(database, sessionKey) : readSessionEntryRow(database, sessionKey),
		selectedRows: collectSessionEntryLookupKeys(database, sessionKey).toSorted().flatMap((candidateKey) => {
			const row = readExactSessionEntryRow(database, candidateKey);
			return row ? [{
				entry: cloneSessionEntry(row.entry),
				sessionKey: candidateKey
			}] : [];
		})
	};
}
function readExactSessionEntryRow(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "=", sessionKey));
	if (!row) return;
	const entry = parseReadableSqliteSessionEntryRow(database, row);
	return entry ? {
		entry,
		legacyKeys: [],
		row
	} : void 0;
}
function readExactSessionEntryJson(database, sessionKey) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("entry_json").where("session_key", "=", sessionKey))?.entry_json;
}
function readExactSessionEntryRowValidated(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return readExactSessionEntryRow(database, sessionKey);
}
function readSessionEntryStore(database, options = {}) {
	if (options.allowCanonicalRepair !== true) assertCanonicalSqliteSessionKeysCurrent(database);
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().orderBy("session_key")).rows;
	const store = {};
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function readSessionEntryCount(database) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("entry_json")).rows.reduce((count, row) => count + (parseSessionEntryJson(row) ? 1 : 0), 0);
}
function readSessionEntryKeys(database) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["entry_json", "session_key"]).orderBy("session_key", "asc")).rows.flatMap((row) => parseSessionEntryJson(row) ? [row.session_key] : []);
}
function resolveLifecyclePrimaryEntry(database, target, options = {}) {
	const rows = target.storeKeys.flatMap((key) => {
		const sessionKey = key.trim();
		const row = readExactSessionEntryRow(database, sessionKey);
		return row ? [{
			key: sessionKey,
			entry: row.entry
		}] : [];
	});
	if (rows.length > 1) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${target.canonicalKey}`);
	const [row] = rows;
	if (row && row.key !== target.canonicalKey && options.allowCanonicalMove !== true) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${target.canonicalKey}`);
	return row;
}
function readLifecycleTargetSnapshot(database, target, options = {}) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const normalized = normalizeLifecycleTarget(target);
	return {
		primary: resolveLifecyclePrimaryEntry(database, normalized, options),
		rows: normalized.storeKeys.flatMap((sessionKey) => {
			const row = readExactSessionEntryRow(database, sessionKey);
			return row ? [{
				entry: cloneSessionEntry(row.entry),
				sessionKey
			}] : [];
		})
	};
}
function normalizeLifecycleTarget(target) {
	const canonicalKey = normalizeSqliteSessionKey(target.canonicalKey);
	return {
		canonicalKey,
		storeKeys: uniqueStrings([canonicalKey, ...target.storeKeys.map(normalizeSqliteSessionKey)])
	};
}
function deleteSessionEntryRows(database, sessionKey, options = {}) {
	const previousEntry = options.validatedEntry ?? readExactSessionEntryRow(database, sessionKey)?.entry;
	if (previousEntry) commitSqliteSessionDeletion(sessionKey, previousEntry);
	const db = getSessionKysely(database.db);
	const windows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "=", sessionKey)).rows;
	const survivingNodes = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"entry_json",
		"session_key"
	]).where("session_key", "!=", sessionKey).orderBy("session_key", "asc")).rows;
	for (const window of windows) {
		const survivingNode = survivingNodes.find((node) => {
			if (node.current_session_id === window.session_id) return true;
			const entry = parseSessionEntryJson(node);
			return entry ? collectSessionStateIdsForEntry(entry).includes(window.session_id) : false;
		});
		if (survivingNode) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: survivingNode.session_key }).where("session_id", "=", window.session_id));
	}
	if (options.deleteOwnedWindows) {
		deleteSessionDeliveryArtifacts(database, sessionKey, options.deliveryCleanupKeys);
		deleteSessionNodeArtifacts(database, sessionKey);
		executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
		publishSessionEntryCacheInvalidation(database);
		return;
	}
	const remainingWindow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id", "updated_at"]).where("session_key", "=", sessionKey).orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(1));
	if (remainingWindow) {
		deleteSessionNodeArtifacts(database, sessionKey);
		clearSqliteSessionEntryPreservingWindows(database, {
			sessionId: remainingWindow.session_id,
			sessionKey,
			updatedAt: remainingWindow.updated_at
		});
		publishSessionEntryCacheInvalidation(database);
		return;
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
	publishSessionEntryCacheInvalidation(database);
}
/** Remove the logical entry while retaining its node-owned transcript windows. */
function clearSqliteSessionEntryPreservingWindows(database, params) {
	const db = getSessionKysely(database.db);
	const cleared = {
		current_session_id: params.sessionId,
		entry_json: "{}",
		entry_valid: -1,
		updated_at: params.updatedAt,
		status: null,
		created_at: null,
		created_via: null,
		created_actor_type: null,
		created_actor_id: null,
		project_id: null,
		parent_session_key: null,
		spawned_by: null,
		fork_source_session_key: null,
		fork_source_session_id: null,
		fork_source_entry_id: null,
		label: null,
		display_name: null,
		category: null,
		icon: null,
		pinned_at: null,
		archived_at: null,
		last_read_at: null,
		last_interaction_at: null,
		last_activity_at: null,
		...hasSqliteSessionOwnerColumns(database.db) ? {
			owner_actor_type: null,
			owner_actor_id: null,
			owner_assigned_by_type: null,
			owner_assigned_by_id: null,
			owner_assigned_at: null
		} : {}
	};
	executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
		session_key: params.sessionKey,
		...cleared
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet(cleared)));
	executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: -1 }).where("session_key", "=", params.sessionKey));
}
function deleteLifecycleTargetRows(database, target) {
	for (const sessionKey of uniqueStrings([target.canonicalKey, ...target.storeKeys])) {
		const trimmed = sessionKey.trim();
		if (trimmed) deleteSessionEntryRows(database, trimmed);
	}
}
function sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry) {
	const current = resolveLifecyclePrimaryEntry(database, target)?.entry;
	if (!current || !expectedEntry) return current === expectedEntry;
	return sqliteSessionEntriesEqual(current, expectedEntry);
}
function assertLifecycleTargetUnchanged(database, target, expectedEntry, operation) {
	if (sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry)) return;
	throw new Error(`SQLite session entry changed before ${operation} lifecycle mutation`);
}
function deleteLegacySessionEntryRows(database, legacyKeys, sessionKey, options = {}) {
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const legacyKey of legacyKeys) {
		if (legacyKey === sessionKey) continue;
		const previousEntry = options.validatedEntries?.get(legacyKey) ?? readExactSessionEntryRow(database, legacyKey)?.entry;
		if (previousEntry) commitSqliteSessionDeletion(legacyKey, previousEntry);
		rehomeSessionWindows(database, sessionKey, [legacyKey]);
		copySessionNodeArtifactsForRepair(database, database, [legacyKey], sessionKey, { includeMembers: options.rehomeMembers });
		executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", legacyKey));
		publishSessionEntryCacheInvalidation(database);
	}
}
/** Move retained generations to the canonical node before removing key aliases. */
function rehomeSessionWindows(database, canonicalKey, previousKeys) {
	const legacyKeys = uniqueStrings([...previousKeys].map((key) => key.trim())).filter((key) => key && key !== canonicalKey);
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: canonicalKey }).where("session_key", "in", legacyKeys));
}
function writeSessionEntry(database, sessionKey, entry, options = {}) {
	const db = getSessionKysely(database.db);
	if (!options.allowStoredAliases) {
		assertCanonicalSessionKeyWriteMatchesDatabase(database, sessionKey);
		assertCanonicalSessionEntryLineageWrite(database, entry);
		if (resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
	}
	const normalizedEntry = normalizeSessionEntryTimestamp(entry);
	if (!hasValidSessionEntryIdentity(normalizedEntry)) throw new Error("Refusing invalid SQLite session entry identity");
	const updatedAt = normalizedEntry.updatedAt;
	const canonicalPreviousEntry = (options.allowStoredAliases && options.previousEntry !== void 0 ? void 0 : readExactSessionEntryRow(database, sessionKey))?.entry ?? (options.allowStoredAliases && options.previousEntry !== void 0 ? options.previousEntry ?? void 0 : void 0);
	const previousEntry = options.previousEntry === void 0 ? canonicalPreviousEntry : options.previousEntry ?? void 0;
	if (previousEntry && previousEntry.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.visibility;
	if (canonicalPreviousEntry && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId) clearSessionCollaborationForKey(database, sessionKey, { clearSuggestions: options.preserveNodeSuggestions !== true });
	const transcriptObservedAt = readTranscriptMutationStateInTransaction(database, normalizedEntry.sessionId).updatedAt ?? updatedAt;
	const boundSessionRoot = bindSessionRoot({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const conversation = prepareSessionConversationForWrite({
		database,
		entry: normalizedEntry,
		previousEntry,
		...options.routeContext !== void 0 ? { routeContext: options.routeContext } : {},
		sessionScope: boundSessionRoot.session_scope
	});
	if (conversation) upsertConversationIdentity(database, conversation.identity, updatedAt);
	const sessionRow = resolveSessionEntryProvenanceRow({
		boundSessionRow: {
			...boundSessionRoot,
			primary_conversation_id: conversation?.role === "primary" ? conversation.identity.conversationRef : null,
			transcript_observed_at: transcriptObservedAt
		},
		database,
		entry: normalizedEntry,
		previousEntry
	});
	const sessionNode = bindSessionNode({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values(sessionNode).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
			current_session_id: sessionNode.current_session_id,
			entry_json: sessionNode.entry_json,
			entry_valid: sessionNode.entry_valid,
			updated_at: sessionNode.updated_at,
			status: sessionNode.status,
			created_at: sessionNode.created_at,
			created_via: sessionNode.created_via,
			created_actor_type: sessionNode.created_actor_type,
			created_actor_id: sessionNode.created_actor_id,
			project_id: sessionNode.project_id,
			parent_session_key: sessionNode.parent_session_key,
			spawned_by: sessionNode.spawned_by,
			fork_source_session_key: sessionNode.fork_source_session_key,
			fork_source_session_id: sessionNode.fork_source_session_id,
			fork_source_entry_id: sessionNode.fork_source_entry_id,
			label: sessionNode.label,
			display_name: sessionNode.display_name,
			category: sessionNode.category,
			icon: sessionNode.icon,
			pinned_at: sessionNode.pinned_at,
			archived_at: sessionNode.archived_at,
			last_read_at: sessionNode.last_read_at,
			last_interaction_at: sessionNode.last_interaction_at,
			last_activity_at: sessionNode.last_activity_at
		})));
		executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", sessionKey));
	});
	executeSqliteQuerySync(database.db, db.insertInto("session_windows").values(sessionRow).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		session_key: sessionKey,
		previous_session_id: sessionRow.previous_session_id,
		reason: sessionRow.reason,
		session_scope: sessionRow.session_scope,
		transcript_observed_at: transcriptObservedAt,
		session_entry_provenance: sessionRow.session_entry_provenance,
		acp_owned: sessionRow.acp_owned,
		plugin_owner_id: sessionRow.plugin_owner_id,
		hook_external_content_source: sessionRow.hook_external_content_source,
		updated_at: updatedAt,
		started_at: sessionRow.started_at,
		ended_at: sessionRow.ended_at,
		status: sessionRow.status,
		chat_type: sessionRow.chat_type,
		channel: sessionRow.channel,
		account_id: sessionRow.account_id,
		primary_conversation_id: sessionRow.primary_conversation_id,
		model_provider: sessionRow.model_provider,
		model: sessionRow.model,
		agent_harness_id: sessionRow.agent_harness_id,
		parent_session_key: sessionRow.parent_session_key,
		spawned_by: sessionRow.spawned_by,
		display_name: sessionRow.display_name
	})));
	if (conversation) linkSessionConversation({
		database,
		...previousEntry?.sessionId ? { previousSessionId: previousEntry.sessionId } : {},
		sessionId: sessionRow.session_id,
		conversation,
		updatedAt
	});
	publishSessionEntryCacheInvalidation(database, sessionNode, writeGeneration);
}
/** Resolves the parent fork decision using SQLite transcript rows when totals are stale. */
//#endregion
export { publishSessionEntryCacheInvalidation as $, assertCanonicalSessionKeyWrite as A, copySessionNodeArtifactsForRepair as B, ensureTranscriptGenerationInTransaction as C, readTranscriptMutationStateInTransaction as D, readTranscriptGenerationInTransaction as E, setCanonicalSqliteSessionMainKey as F, conversationIdentityFromMsgContext as G, deleteSessionMembersForRepair as H, bindSessionWindowEntryProjection as I, parseStoredConversationRouteContext as J, conversationRouteContextFromMsgContext as K, coerceSqliteNumber as L, canonicalSessionKeyMigrationRequiredError as M, isCanonicalSqliteSessionMainKeyCurrent as N, rotateTranscriptGenerationInTransaction as O, scanCanonicalSqliteSessionEntries as P, sqliteSessionEntriesEqual as Q, createFallbackSessionEntry as R, deleteTranscriptEventsInTransaction as S, readNextTranscriptSeq as T, upsertConversationIdentity as U, deleteSessionDeliveryArtifacts as V, buildConversationIdentity as W, assertSessionEntrySelectionUnchanged as X, assertLifecycleTargetSnapshotUnchanged as Y, sqliteLifecycleTargetSnapshotsEqual as Z, readSessionIdentitySnapshot as _, deriveSessionOrigin as _t, deleteSessionEntryRows as a, resolveBoundedProfileParticipantSnapshot as at, writeSessionEntry as b, readExactSessionEntryJson as c, mergeSessionParticipantSource as ct, readLifecycleTargetSnapshot as d, projectSqliteSessionOwner as dt, readSessionEntryCache as et, readSessionEntryCount as f, runPreparedSqliteSessionWrite as ft, readSessionEntryStore as g, deriveSessionMetaPatch as gt, readSessionEntrySelectionSnapshot as h, deriveLastRoutePatch as ht, deleteLifecycleTargetRows as i, listSessionParticipantsReadOnly as it, assertCanonicalSqliteSessionKeysCurrent as j, touchTranscriptMutationInTransaction as k, readExactSessionEntryRow as l, resolveProfileParticipantIdFromSessionCreation as lt, readSessionEntryRow as m, withSqliteSessionDeletions as mt, createSessionIdentitySnapshot as n, parseSessionEntryJson as nt, normalizeLifecycleTarget as o, MAX_SESSION_PARTICIPANTS as ot, readSessionEntryKeys as p, runSqliteSessionDeletionTransaction as pt, parseConversationRouteContext as q, deleteLegacySessionEntryRows as r, readSessionEntriesByStatus as rt, parseReadableSqliteSessionEntryRow as s, buildSessionCreationStamp as st, assertLifecycleTargetUnchanged as t, trackSessionEntryCacheWrite as tt, readExactSessionEntryRowValidated as u, hasSqliteSessionOwnerColumns as ut, rehomeSessionWindows as v, ensureTranscriptSessionRoot as w, advanceTranscriptMutationAtInTransaction as x, resolveLifecyclePrimaryEntry as y, collectSessionStateIdsForEntry as z };
