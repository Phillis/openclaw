import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./utils-Bw16L5tB.js";
import { D as resolveSessionModelOverrideSource } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, a as listAgentIds } from "./agent-scope-config-CUBiGmG3.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, d as parseSessionDeliveryRoute, f as parseThreadSessionSuffix, i as isCronSessionKey, n as isAcpSessionKey, o as normalizeSessionKeyPreservingOpaquePeerIds, r as isCronRunSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { dt as stripInboundMetadata } from "./openclaw-state-db-CeAO_dqo.js";
import { n as withPinnedActivePluginRegistryWorkspaceDir } from "./runtime-workspace-state-kLYmgwOl.js";
import { x as findModelCatalogEntry } from "./model-selection-shared-I5TmV9jL.js";
import "./defaults-CdX9UGcX.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { d as resolveEffectiveResponseUsage } from "./thinking.shared-bHYuuc1L.js";
import { k as projectPluginSessionExtensionsSync } from "./loader-D0AfkRZe.js";
import { c as looksLikeAvatarPath } from "./agent-workspace-roster-transition-DoqG2wNw.js";
import { j as resolveCronSessionTargetSessionKey } from "./row-codec-LoN9q1nV.js";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-l0wakFAx.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId } from "./session-store-key-DRF7yKG5.js";
import { E as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import { d as sessionDeliveryOrigin, l as projectSessionDeliveryFields, u as sessionDeliveryChannel } from "./delivery-context.shared-azPdmUls.js";
import { v as buildGroupDisplayName, y as buildGroupDisplayTitle } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { t as SESSION_AGENT_ATTENTION_ICON_IDS } from "./session-agent-status-Cz4bCpx5.js";
import { n as isTerminalSessionStatus, o as resolveFreshSessionTotalTokens } from "./types-BEJRKmOU.js";
import { P as isSessionTranscriptProjectionUnavailableError, n as readSessionTranscriptWatermarkBatch, r as readSessionTranscriptTitleProbeBatch, t as readSessionTranscriptWatermark, u as readSessionTranscriptMessageEventPage, x as resolveConcreteSessionStorePath } from "./session-accessor-B-FKZX9M.js";
import { b as classifySessionKind } from "./session-state-events-BkuyPMaw.js";
import { w as resolveSessionGoalDisplayState } from "./sessions-CdrF1uzY.js";
import { t as resolveProjectedSessionContextTokens } from "./context-token-provenance-B2eCPcfc.js";
import "./model-catalog-BCGmKLlL.js";
import "./thinking-CNREPJ80.js";
import { s as normalizeStoredOverrideModel } from "./model-selection-DHDS-v4K.js";
import { t as renderUserFacingText } from "./user-facing-text-BcBNmELa.js";
import { i as readAcpSessionMetaBatch } from "./session-meta-BgX5x3e6.js";
import { n as resolveAgentIdentity } from "./identity-Cc11oAxY.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-DErPHjcA.js";
import { a as hasInterSessionUserProvenance } from "./input-provenance-CCQsDhUy.js";
import { a as shouldKeepSubagentRunChildLink, l as resolveSubagentSessionStatus, o as getSubagentSessionRuntimeMs, s as getSubagentSessionStartedAt } from "./subagent-run-liveness-CpuKir5n.js";
import { c as getSessionDisplaySubagentRunByChildSessionKey, d as isSubagentRunLive, i as countActiveDescendantRuns, m as listSubagentRunsForController, r as buildSubagentSessionListReadIndex } from "./subagent-registry-read-kfj2Ed2f.js";
import { d as sqliteMessageEventWithSeq, f as toTranscriptReadScope, j as projectSessionDisplayMessage, r as readRecentSessionUsageFromTranscript, u as resolveTranscriptReadTarget, x as resolveCurrentUserProfileDisplay } from "./session-transcript-readers-CgCxlOAj.js";
import { n as buildControlUiChannelAvatarUrl, r as buildControlUiResourcePath } from "./control-ui-contract-CgrOMhfo.js";
import { n as resolveSessionModelRef, t as resolveSessionModelIdentityRef } from "./session-model-ref-BtF53_Cz.js";
import { a as resolveGatewaySessionThinkingProjectionInternal, o as resolveSessionDisplayModelIdentityRefCached, s as createSessionRowModelCacheKey, t as getSessionDefaults } from "./session-utils-model-jI_nhKzG.js";
import { c as resolveAuthoredModelContextTokens } from "./context-resolution-PMHXNyx7.js";
import { a as resolveContextTokensForModel } from "./context-Bj-w-uhp.js";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.js";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-B05qBClU.js";
import { a as parseGroupKey, i as loadGatewaySessionEntryReadOnly, t as isGroupOrChannelDisplaySession } from "./session-utils-store-DtQnSTMm.js";
import { t as resolveFastModeState } from "./fast-mode-Dd78Dxbu.js";
import { t as resolveQueueSettingsCore } from "./settings-Cpt08fNP.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BcM5GBXo.js";
import { createHash } from "node:crypto";
//#region src/gateway/session-utils-core.ts
const DERIVED_TITLE_MAX_LEN = 60;
function truncateTitle(text, maxLen) {
	if (text.length <= maxLen) return text;
	const cut = truncateUtf16Safe(text, maxLen - 1);
	const lastSpace = cut.lastIndexOf(" ");
	if (lastSpace > maxLen * .6) return cut.slice(0, lastSpace) + "…";
	return cut + "…";
}
function deriveSessionTitle(entry, firstUserMessage, externalDisplayName) {
	if (!entry) return;
	const label = normalizeOptionalString(entry.label);
	if (label) return label;
	const displayName = normalizeOptionalString(externalDisplayName) ?? normalizeOptionalString(entry.displayName);
	if (displayName) return displayName;
	const subject = normalizeOptionalString(entry.subject);
	if (subject) return subject;
	const normalized = firstUserMessage ? stripInboundMetadata(firstUserMessage).replace(/\s+/g, " ").trim() : "";
	if (normalized) return truncateTitle(normalized, DERIVED_TITLE_MAX_LEN);
}
function resolvePositiveNumber(value) {
	return asPositiveFiniteNumber(value);
}
function deriveSessionUnread(entry) {
	const unreadBaselineAt = entry?.lastReadAt ?? entry?.createdAt;
	return entry?.markedUnreadAt !== void 0 || unreadBaselineAt !== void 0 && Math.max(entry?.lastInteractionAt ?? 0, entry?.lastActivityAt ?? 0) > unreadBaselineAt;
}
function isProjectableCompactionCheckpoint(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const checkpoint = value;
	return Boolean(normalizeOptionalString(checkpoint.checkpointId)) && typeof checkpoint.createdAt === "number" && Number.isFinite(checkpoint.createdAt) && (checkpoint.reason === "manual" || checkpoint.reason === "auto-threshold" || checkpoint.reason === "overflow-retry" || checkpoint.reason === "timeout-retry");
}
function resolveProjectableCompactionCheckpoints(entry) {
	const checkpoints = entry?.compactionCheckpoints;
	if (!Array.isArray(checkpoints) || checkpoints.length === 0) return [];
	return checkpoints.filter(isProjectableCompactionCheckpoint);
}
function resolveLatestCompactionCheckpoint(checkpoints) {
	return checkpoints.reduce((latest, checkpoint) => !latest || checkpoint.createdAt > latest.createdAt ? checkpoint : latest, void 0);
}
function buildCompactionCheckpointPreview(checkpoint) {
	if (!checkpoint) return;
	const checkpointId = normalizeOptionalString(checkpoint.checkpointId);
	const createdAt = checkpoint.createdAt;
	const reason = checkpoint.reason;
	if (!checkpointId || typeof createdAt !== "number" || !Number.isFinite(createdAt)) return;
	if (reason !== "manual" && reason !== "auto-threshold" && reason !== "overflow-retry" && reason !== "timeout-retry") return;
	return {
		checkpointId,
		createdAt,
		reason
	};
}
function resolveModelCostConfigCached(provider, model, cfg, rowContext) {
	if (!rowContext) return resolveModelCostConfig({
		provider,
		model,
		config: cfg
	});
	const key = createSessionRowModelCacheKey(provider, model);
	if (rowContext.modelCostConfigByModelRef.has(key)) return rowContext.modelCostConfigByModelRef.get(key);
	const value = resolveModelCostConfig({
		provider,
		model,
		config: cfg
	});
	rowContext.modelCostConfigByModelRef.set(key, value);
	return value;
}
function resolveEstimatedSessionCostUsd(params) {
	const explicitCostUsd = asNonNegativeFiniteNumber(params.explicitCostUsd ?? params.entry?.estimatedCostUsd);
	if (explicitCostUsd !== void 0) return explicitCostUsd;
	const input = resolvePositiveNumber(params.entry?.inputTokens);
	const output = resolvePositiveNumber(params.entry?.outputTokens);
	const cacheRead = resolvePositiveNumber(params.entry?.cacheRead);
	const cacheWrite = resolvePositiveNumber(params.entry?.cacheWrite);
	if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0) return;
	const cost = resolveModelCostConfigCached(params.provider, params.model, params.cfg, params.rowContext);
	if (!cost) return;
	return asNonNegativeFiniteNumber(estimateUsageCost({
		usage: {
			...input !== void 0 ? { input } : {},
			...output !== void 0 ? { output } : {},
			...cacheRead !== void 0 ? { cacheRead } : {},
			...cacheWrite !== void 0 ? { cacheWrite } : {}
		},
		cost
	}));
}
const STALE_STORE_ONLY_CHILD_LINK_MS = 3600 * 1e3;
const SINGLE_ROW_CONTEXT_CACHE_MAX_ENTRIES = 64;
function isFinitePositiveTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function shouldKeepStoreOnlyChildLink(entry, now) {
	if (isTerminalSessionStatus(entry.status) || isFinitePositiveTimestamp(entry.endedAt)) {
		const endedAt = isFinitePositiveTimestamp(entry.endedAt) ? entry.endedAt : entry.updatedAt;
		return isFinitePositiveTimestamp(endedAt) && now - endedAt <= 18e5;
	}
	if (entry.status === "running" || isFinitePositiveTimestamp(entry.startedAt)) return true;
	return isFinitePositiveTimestamp(entry.updatedAt) && now - entry.updatedAt <= STALE_STORE_ONLY_CHILD_LINK_MS;
}
const singleRowChildSessionCandidateCache = /* @__PURE__ */ new Map();
function rememberSingleRowChildSessionCandidateCacheEntry(storePath, entry) {
	if (singleRowChildSessionCandidateCache.has(storePath)) singleRowChildSessionCandidateCache.delete(storePath);
	singleRowChildSessionCandidateCache.set(storePath, entry);
	pruneMapToMaxSize(singleRowChildSessionCandidateCache, SINGLE_ROW_CONTEXT_CACHE_MAX_ENTRIES);
}
function buildStoreChildSessionCandidateIndex(store) {
	const childSessionsByKey = /* @__PURE__ */ new Map();
	if (!store) return childSessionsByKey;
	for (const [key, entry] of Object.entries(store)) {
		if (!entry) continue;
		const parentKeys = [normalizeOptionalString(entry.spawnedBy), normalizeOptionalString(entry.parentSessionKey)].filter((value) => Boolean(value) && value !== key);
		for (const parentKey of parentKeys) addChildSessionKey(childSessionsByKey, parentKey, key);
	}
	return childSessionsByKey;
}
function singleRowChildSessionCacheMatches(cached, store) {
	const entries = Object.entries(store);
	return entries.length === cached.entriesByKey.size && entries.every(([key, entry]) => cached.entriesByKey.get(key) === entry);
}
function getSingleRowChildSessionCandidates(params) {
	if (!params.store) return /* @__PURE__ */ new Map();
	const cached = singleRowChildSessionCandidateCache.get(params.storePath);
	if (cached && singleRowChildSessionCacheMatches(cached, params.store)) return cached.childSessionCandidatesByParentKey;
	const childSessionCandidatesByParentKey = buildStoreChildSessionCandidateIndex(params.store);
	rememberSingleRowChildSessionCandidateCacheEntry(params.storePath, {
		entriesByKey: new Map(Object.entries(params.store)),
		childSessionCandidatesByParentKey
	});
	return childSessionCandidatesByParentKey;
}
function resolveRuntimeChildSessionKeys(controllerSessionKey, now = Date.now(), subagentRuns) {
	const childSessionKeys = /* @__PURE__ */ new Set();
	const controllerKey = controllerSessionKey.trim();
	const runs = subagentRuns ? subagentRuns.runsByControllerSessionKey.get(controllerKey) ?? [] : listSubagentRunsForController(controllerSessionKey);
	for (const entry of runs) {
		const childSessionKey = normalizeOptionalString(entry.childSessionKey);
		if (!childSessionKey) continue;
		const latest = subagentRuns ? subagentRuns.getDisplaySubagentRun(childSessionKey) : getSessionDisplaySubagentRunByChildSessionKey(childSessionKey);
		if (!latest) continue;
		if ((normalizeOptionalString(latest?.controllerSessionKey) || normalizeOptionalString(latest?.requesterSessionKey)) !== controllerSessionKey) continue;
		if (!shouldKeepSubagentRunChildLink(latest, {
			activeDescendants: subagentRuns ? subagentRuns.countActiveDescendantRuns(childSessionKey) : countActiveDescendantRuns(childSessionKey),
			now
		})) continue;
		childSessionKeys.add(childSessionKey);
	}
	const childSessions = Array.from(childSessionKeys);
	return childSessions.length > 0 ? childSessions : void 0;
}
function addChildSessionKey(childSessionsByKey, parentKey, childKey) {
	const current = childSessionsByKey.get(parentKey);
	if (current) {
		if (!current.includes(childKey)) current.push(childKey);
		return;
	}
	childSessionsByKey.set(parentKey, [childKey]);
}
function isCurrentSessionChildOwner(params) {
	return params.controllerSessionKey === params.ownerSessionKey || normalizeOptionalString(params.entry.parentSessionKey) === params.ownerSessionKey;
}
function buildStoreChildSessionIndex(store, now = Date.now(), subagentRuns) {
	const childSessionsByKey = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) {
		if (!entry) continue;
		const parentKeys = [normalizeOptionalString(entry.spawnedBy), normalizeOptionalString(entry.parentSessionKey)].filter((value) => Boolean(value) && value !== key);
		if (parentKeys.length === 0) continue;
		const latest = subagentRuns ? subagentRuns.getDisplaySubagentRun(key) : getSessionDisplaySubagentRunByChildSessionKey(key);
		let latestControllerSessionKey;
		if (latest) {
			latestControllerSessionKey = normalizeOptionalString(latest.controllerSessionKey) || normalizeOptionalString(latest.requesterSessionKey);
			if (!shouldKeepSubagentRunChildLink(latest, {
				activeDescendants: subagentRuns ? subagentRuns.countActiveDescendantRuns(key) : countActiveDescendantRuns(key),
				now
			})) continue;
		} else if (!shouldKeepStoreOnlyChildLink(entry, now)) continue;
		for (const parentKey of parentKeys) {
			if (latestControllerSessionKey && !isCurrentSessionChildOwner({
				entry,
				ownerSessionKey: parentKey,
				controllerSessionKey: latestControllerSessionKey
			})) continue;
			addChildSessionKey(childSessionsByKey, parentKey, key);
		}
	}
	return childSessionsByKey;
}
function resolveStoreChildSessionKeysFromCandidates(params) {
	const childSessionKeys = [];
	for (const childKey of params.candidates.get(params.key) ?? []) {
		const entry = params.store[childKey];
		if (!entry) continue;
		const latest = getSessionDisplaySubagentRunByChildSessionKey(childKey);
		if (latest) {
			const latestControllerSessionKey = normalizeOptionalString(latest.controllerSessionKey) || normalizeOptionalString(latest.requesterSessionKey);
			if (!isCurrentSessionChildOwner({
				entry,
				ownerSessionKey: params.key,
				controllerSessionKey: latestControllerSessionKey
			})) continue;
			if (!shouldKeepSubagentRunChildLink(latest, {
				activeDescendants: countActiveDescendantRuns(childKey),
				now: params.now
			})) continue;
			childSessionKeys.push(childKey);
			continue;
		}
		if (!shouldKeepStoreOnlyChildLink(entry, params.now)) continue;
		childSessionKeys.push(childKey);
	}
	return childSessionKeys.length > 0 ? childSessionKeys : void 0;
}
//#endregion
//#region src/sessions/session-agent-status.ts
const SESSION_AGENT_STATUS_NOTE_MAX_CHARS = 120;
const SESSION_AGENT_STATUS_DEFAULT_TTL_MINUTES = 30;
const ATTENTION_ICON_IDS = new Set(SESSION_AGENT_ATTENTION_ICON_IDS);
function isSessionAgentAttentionIconId(value) {
	return typeof value === "string" && ATTENTION_ICON_IDS.has(value);
}
function sanitizeSessionAgentStatusNote(value) {
	return truncateUtf16Safe(renderUserFacingText(value, { errorContext: true }).replace(/\s+/g, " ").trim(), SESSION_AGENT_STATUS_NOTE_MAX_CHARS).trimEnd();
}
function resolveActiveSessionAgentStatus(status, now) {
	if (!status || !status.note.trim() || !Number.isFinite(status.expiresAt) || status.expiresAt <= now) return;
	if (status.attention !== void 0 && !isSessionAgentAttentionIconId(status.attention)) return;
	return status;
}
function sessionAgentStatusExpiresAt(now, ttlMinutes) {
	return now + (ttlMinutes ?? SESSION_AGENT_STATUS_DEFAULT_TTL_MINUTES) * 6e4;
}
//#endregion
//#region src/cron/job-session-bindings.ts
/**
* Resolves every canonical session key a job is bound to: the session the run
* joins (main/isolated/session:<key>) plus the explicit wake/delivery lane in
* job.sessionKey. Keys use the same canonicalization as cron run/session
* creation, so they compare equal to gateway session-store row keys.
*/
function resolveCronJobBoundSessionKeys(job, opts) {
	const agentId = normalizeAgentId(job.agentId ?? opts.defaultAgentId);
	const keys = /* @__PURE__ */ new Set();
	const add = (sessionKey) => {
		const trimmed = sessionKey?.trim();
		if (!trimmed) return;
		keys.add(resolveCronAgentSessionKey({
			sessionKey: trimmed,
			agentId,
			mainKey: opts.cfg.session?.mainKey,
			cfg: opts.cfg
		}));
	};
	try {
		if (job.sessionTarget === "main") add("main");
		else if (job.sessionTarget === "isolated" || job.sessionTarget === "current") add(`cron:${job.id}`);
		else add(resolveCronSessionTargetSessionKey(job.sessionTarget));
		add(job.sessionKey);
	} catch {
		keys.clear();
	}
	return keys;
}
/** Signals a locked re-check found the job no longer bound; a per-job no-op. */
var CronJobBindingStaleError = class extends Error {
	constructor() {
		super("cron job binding changed concurrently");
	}
};
/** Disables enabled jobs bound to any archived session with one job-list scan. */
async function disableCronJobsBoundToSessions(params) {
	const sessionKeys = [...new Set(params.sessionKeys.map((key) => key.trim()).filter(Boolean))];
	const disabledBySession = new Map(sessionKeys.map((sessionKey) => [sessionKey, []]));
	if (sessionKeys.length === 0) return disabledBySession;
	const targetKeys = new Set(sessionKeys);
	const jobs = await params.cron.list();
	const defaultAgentId = params.cron.getDefaultAgentId();
	const matchingSessionKeys = (job) => {
		if (!job.enabled) return [];
		return [...resolveCronJobBoundSessionKeys(job, {
			cfg: params.cfg,
			defaultAgentId
		})].filter((sessionKey) => targetKeys.has(sessionKey));
	};
	const failures = [];
	for (const job of jobs) {
		if (matchingSessionKeys(job).length === 0) continue;
		try {
			let lockedMatches = [];
			await params.cron.updateWithPrecondition(job.id, { enabled: false }, (currentJob) => {
				lockedMatches = matchingSessionKeys(currentJob);
				if (lockedMatches.length === 0) throw new CronJobBindingStaleError();
			});
			for (const sessionKey of lockedMatches) disabledBySession.get(sessionKey)?.push(job.id);
		} catch (error) {
			if (error instanceof CronJobBindingStaleError) continue;
			failures.push(error);
		}
	}
	if (failures.length > 0) {
		const subject = sessionKeys.length === 1 ? `bound to ${sessionKeys[0]}` : `bound to ${sessionKeys.length} archived sessions`;
		throw new AggregateError(failures, `failed to disable ${failures.length} cron job(s) ${subject}`);
	}
	return disabledBySession;
}
//#endregion
//#region src/gateway/session-automation-index.ts
let source = null;
let sourceVersion = 0;
let epochCounter = 0;
let registeredEpoch = 0;
let memo = null;
/**
* Claimed at cron service build time so registration authority follows build
* order: a stale service whose start resolves after a config reload cannot
* clobber the replacement's registration.
*/
function claimSessionAutomationEpoch() {
	return ++epochCounter;
}
/** Registered by the gateway cron owner; newer epochs win over stale services. */
function registerSessionAutomationSource(next, epoch) {
	const effectiveEpoch = epoch ?? claimSessionAutomationEpoch();
	if (effectiveEpoch < registeredEpoch) return;
	registeredEpoch = effectiveEpoch;
	source = next;
	memo = null;
	sourceVersion += 1;
}
/**
* Owner-compare unregistration: a stopped cron service must not clear a
* replacement's registration when config reloads race the lazy service build.
*/
function unregisterSessionAutomationSource(owner) {
	if (source !== owner) return;
	source = null;
	memo = null;
	sourceVersion += 1;
}
/** Called from the cron onEvent hook after any job/store change. */
function bumpSessionAutomationVersion() {
	sourceVersion += 1;
}
/** sessions.list cache fence input: hasAutomation is projected per row from
* this index, so cached lists are stale the moment a binding changes. */
function readSessionAutomationVersion() {
	return sourceVersion;
}
function buildAutomationKeys(jobs, cfg, defaultAgentId) {
	const keys = /* @__PURE__ */ new Set();
	for (const job of jobs) {
		if (!job.enabled) continue;
		for (const key of resolveCronJobBoundSessionKeys(job, {
			cfg,
			defaultAgentId
		})) {
			const agentId = job.owner?.agentId ?? defaultAgentId;
			if (parseAgentSessionKey(key)) keys.add(key);
			else if (agentId) keys.add(`${normalizeAgentId(agentId)}\0${key}`);
		}
	}
	return keys;
}
/** True when an enabled cron job is bound to the canonical session key. */
function sessionHasAutomation(sessionKey, cfg, agentId) {
	const jobs = source?.getJobs();
	if (!source || !jobs || jobs.length === 0) return false;
	if (!memo || memo.jobs !== jobs || memo.version !== sourceVersion || memo.cfg !== cfg) memo = {
		jobs,
		version: sourceVersion,
		cfg,
		keys: buildAutomationKeys(jobs, cfg, source.getDefaultAgentId())
	};
	const identity = parseAgentSessionKey(sessionKey) ? sessionKey : agentId ? `${normalizeAgentId(agentId)}\0${sessionKey}` : void 0;
	return identity ? memo.keys.has(identity) : false;
}
//#endregion
//#region src/gateway/session-classification.ts
/** Builds non-sensitive, client-useful classification facts for Gateway session rows. */
const BACKGROUND_CLASSIFICATIONS = /* @__PURE__ */ new Set([
	"acp",
	"cron",
	"dreaming",
	"harness",
	"heartbeat",
	"hook",
	"subagent",
	"system"
]);
function classifyRest(rest) {
	const normalized = normalizeLowercaseStringOrEmpty(rest);
	if (normalized.startsWith("dashboard:")) return "dashboard";
	if (normalized.startsWith("tui-")) return "tui";
	if (normalized.startsWith("explicit:")) return "explicit";
	if (normalized.startsWith("hook:")) return "hook";
	if (normalized.startsWith("node-") || normalized.startsWith("node:")) return "node";
	if (normalized.startsWith("harness:")) return "harness";
	if (normalized.startsWith("voice:")) return "voice";
	if (normalized.startsWith("dreaming-narrative-")) return "dreaming";
	if (normalized === "boot" || normalized.startsWith("internal-session-effects:")) return "system";
	return "custom";
}
/**
* Derive portable facts without exposing peer ids, transcript text, absolute
* paths, or other data that is not already a session-list field.
*/
function sessionClassificationForRow(cfg, key, agentId, entry) {
	const canonicalKey = normalizeSessionKeyPreservingOpaquePeerIds(key);
	const isMain = canonicalKey === "global" ? cfg.session?.scope === "global" : canonicalKey === resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	const parsedAgent = parseAgentSessionKey(canonicalKey);
	const resolvedAgentId = parsedAgent?.agentId ?? normalizeOptionalString(agentId);
	const rest = parsedAgent?.rest ?? canonicalKey;
	const parsedThread = parseThreadSessionSuffix(canonicalKey);
	const route = parseSessionDeliveryRoute(canonicalKey);
	const hasLegacyDirectPeer = /^(?:direct|dm):.+$/i.test(parseAgentSessionKey(parsedThread.baseSessionKey)?.rest ?? "");
	const hasDirectPeer = route?.peerKind === "direct" || route?.peerKind === "dm" || hasLegacyDirectPeer || entry?.chatType === "direct";
	let classification;
	if (canonicalKey === "global") classification = "global";
	else if (canonicalKey === "unknown") classification = "unknown";
	else if (entry?.heartbeatIsolatedBaseSessionKey) classification = "heartbeat";
	else if (isMain) classification = "main";
	else if (entry?.spawnedBy) classification = "subagent";
	else if (isSubagentSessionKey(canonicalKey)) classification = "subagent";
	else if (isAcpSessionKey(canonicalKey)) classification = "acp";
	else if (isCronSessionKey(canonicalKey)) classification = "cron";
	else if (parsedThread.threadId) classification = "thread";
	else if (route?.peerKind === "group") classification = "group";
	else if (route?.peerKind === "channel") classification = "channel";
	else if (hasDirectPeer) classification = "direct";
	else if (entry?.chatType === "direct" || entry?.chatType === "group" || entry?.chatType === "channel") classification = entry.chatType;
	else classification = classifyRest(rest);
	const peerKind = route?.peerKind === "dm" || hasLegacyDirectPeer ? "direct" : route?.peerKind;
	return {
		classification,
		...resolvedAgentId ? { agentId: resolvedAgentId } : {},
		...route?.accountId ? { accountId: route.accountId } : {},
		...peerKind ? { peerKind } : {},
		isMain,
		isBackground: BACKGROUND_CLASSIFICATIONS.has(classification)
	};
}
//#endregion
//#region src/gateway/session-transcript-title-reader.ts
const EMPTY_SESSION_TITLE_FIELDS = {
	firstUserMessage: null,
	lastMessagePreview: null
};
let sessionTitleProjectionUnavailableVersion = 0;
function readSessionTitleProjectionUnavailableVersion() {
	return sessionTitleProjectionUnavailableVersion;
}
const SQLITE_TITLE_PROBE_INITIAL_MESSAGES = 20;
const SQLITE_TITLE_PROBE_MAX_MESSAGES = 100;
const SQLITE_TITLE_FIELD_CACHE_MAX_ENTRIES = 256;
const sqliteTitleFieldCache = /* @__PURE__ */ new Map();
function sqliteTitleFieldCacheKey(target) {
	return `${target.agentId ?? ""}\0${target.sessionId}\0${target.storePath ?? ""}`;
}
function setSqliteTitleFieldCache(key, entry) {
	sqliteTitleFieldCache.delete(key);
	sqliteTitleFieldCache.set(key, entry);
	pruneMapToMaxSize(sqliteTitleFieldCache, SQLITE_TITLE_FIELD_CACHE_MAX_ENTRIES);
}
function readSqliteTitleProbeRange(scope, totalMessages, start, endExclusive) {
	const end = Math.min(totalMessages, endExclusive);
	const boundedStart = Math.min(Math.max(0, start), end);
	if (boundedStart === end) return [];
	return readSessionTranscriptMessageEventPage(scope, {
		maxMessages: end - boundedStart,
		offset: totalMessages - end
	}).events;
}
function findFirstTitleUserMessage(entries, includeInterSession) {
	return entries.map(sqliteMessageEventWithSeq).find((message) => {
		if (projectSessionDisplayMessage(message)?.role !== "user") return false;
		return includeInterSession || !hasInterSessionUserProvenance(message);
	});
}
function findLastMessageText(entries) {
	return entries.toReversed().map(sqliteMessageEventWithSeq).map((message) => projectSessionDisplayMessage(message, { flattenMarkdown: true })).find(Boolean)?.text ?? null;
}
function readSqliteTitleFields(target, opts) {
	const scope = toTranscriptReadScope(target);
	const cacheKey = sqliteTitleFieldCacheKey(target);
	const watermark = readSessionTranscriptWatermark(scope);
	const variant = opts?.includeInterSession === true ? "includeInterSession" : "default";
	const cached = sqliteTitleFieldCache.get(cacheKey);
	const cachedFields = cached?.generation === watermark.generation && cached.maxSeq === watermark.maxSeq ? cached.fields[variant] : void 0;
	if (cached && cachedFields) {
		setSqliteTitleFieldCache(cacheKey, cached);
		return { ...cachedFields };
	}
	let fields;
	try {
		const tail = readSessionTranscriptMessageEventPage(scope, {
			maxMessages: SQLITE_TITLE_PROBE_INITIAL_MESSAGES,
			offset: 0
		});
		let lastText = findLastMessageText(tail.events);
		if (!lastText && tail.totalMessages > SQLITE_TITLE_PROBE_INITIAL_MESSAGES) lastText = findLastMessageText(readSqliteTitleProbeRange(scope, tail.totalMessages, tail.totalMessages - SQLITE_TITLE_PROBE_MAX_MESSAGES, tail.totalMessages - SQLITE_TITLE_PROBE_INITIAL_MESSAGES));
		let firstUser = findFirstTitleUserMessage(tail.totalMessages <= SQLITE_TITLE_PROBE_INITIAL_MESSAGES ? tail.events : readSqliteTitleProbeRange(scope, tail.totalMessages, 0, SQLITE_TITLE_PROBE_INITIAL_MESSAGES), opts?.includeInterSession === true);
		if (!firstUser && tail.totalMessages > SQLITE_TITLE_PROBE_INITIAL_MESSAGES) firstUser = findFirstTitleUserMessage(readSqliteTitleProbeRange(scope, tail.totalMessages, SQLITE_TITLE_PROBE_INITIAL_MESSAGES, SQLITE_TITLE_PROBE_MAX_MESSAGES), opts?.includeInterSession === true);
		fields = {
			firstUserMessage: firstUser ? projectSessionDisplayMessage(firstUser)?.text ?? null : null,
			lastMessagePreview: lastText
		};
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		sessionTitleProjectionUnavailableVersion += 1;
		return { ...EMPTY_SESSION_TITLE_FIELDS };
	}
	const fieldsByVariant = cached?.generation === watermark.generation && cached.maxSeq === watermark.maxSeq ? cached.fields : {};
	fieldsByVariant[variant] = fields;
	setSqliteTitleFieldCache(cacheKey, {
		...watermark,
		fields: fieldsByVariant
	});
	return { ...fields };
}
function readSqliteTitleFieldsOrEmpty(target, opts) {
	try {
		return readSqliteTitleFields(target, opts);
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		sessionTitleProjectionUnavailableVersion += 1;
		return { ...EMPTY_SESSION_TITLE_FIELDS };
	}
}
/** Batch-hydrates list title fields once per store, with canonical widening only for misses. */
function readSessionTitleFieldsFromTranscriptBatchCurrent(scopes, opts) {
	const targets = [];
	const variant = opts?.includeInterSession === true ? "includeInterSession" : "default";
	const results = /* @__PURE__ */ new Map();
	const misses = [];
	const cachedCandidates = [];
	for (const [index, scope] of scopes.entries()) {
		const target = resolveTranscriptReadTarget(scope);
		targets.push(target);
		const cacheKey = sqliteTitleFieldCacheKey(target);
		const cached = sqliteTitleFieldCache.get(cacheKey);
		const cachedFields = cached?.fields[variant];
		if (cached && cachedFields) {
			cachedCandidates.push({
				cacheKey,
				cached,
				cachedFields,
				index,
				scope,
				target
			});
			continue;
		}
		misses.push({
			cacheKey,
			index,
			scope,
			target
		});
	}
	const watermarks = readSessionTranscriptWatermarkBatch(cachedCandidates.map((candidate) => toTranscriptReadScope(candidate.target)));
	for (const [candidateIndex, candidate] of cachedCandidates.entries()) {
		const watermark = watermarks[candidateIndex];
		if (watermark && candidate.cached.generation === watermark.generation && candidate.cached.maxSeq === watermark.maxSeq) {
			setSqliteTitleFieldCache(candidate.cacheKey, candidate.cached);
			results.set(candidate.index, { ...candidate.cachedFields });
			continue;
		}
		misses.push({
			cacheKey: candidate.cacheKey,
			index: candidate.index,
			scope: candidate.scope,
			target: candidate.target
		});
	}
	const probes = misses.length > 0 ? readSessionTranscriptTitleProbeBatch(misses.map((miss) => toTranscriptReadScope(miss.target))) : [];
	for (const [probeIndex, miss] of misses.entries()) {
		const probe = probes[probeIndex];
		if (!probe) {
			results.set(miss.index, readSqliteTitleFieldsOrEmpty(miss.target, opts));
			continue;
		}
		const cached = sqliteTitleFieldCache.get(miss.cacheKey);
		const cachedFields = cached?.generation === probe.generation && cached.maxSeq === probe.maxSeq ? cached.fields[variant] : void 0;
		if (cached && cachedFields) {
			setSqliteTitleFieldCache(miss.cacheKey, cached);
			results.set(miss.index, { ...cachedFields });
			continue;
		}
		const firstUser = findFirstTitleUserMessage(probe.head, opts?.includeInterSession === true);
		const lastText = findLastMessageText(probe.tail);
		if (probe.totalMessages > SQLITE_TITLE_PROBE_INITIAL_MESSAGES && (!firstUser || !lastText)) {
			results.set(miss.index, readSqliteTitleFieldsOrEmpty(miss.target, opts));
			continue;
		}
		const fields = {
			firstUserMessage: firstUser ? projectSessionDisplayMessage(firstUser)?.text ?? null : null,
			lastMessagePreview: lastText
		};
		const fieldsByVariant = cached?.generation === probe.generation && cached.maxSeq === probe.maxSeq ? cached.fields : {};
		fieldsByVariant[variant] = fields;
		setSqliteTitleFieldCache(miss.cacheKey, {
			generation: probe.generation,
			maxSeq: probe.maxSeq,
			fields: fieldsByVariant
		});
		results.set(miss.index, { ...fields });
	}
	return targets.map((target, index) => {
		const fields = results.get(index);
		if (!fields) throw new Error(`Missing batched title fields for session ${target.sessionId}`);
		return fields;
	});
}
/** Batch-hydrates list title fields while isolating a rebuilding projection to its session. */
function readSessionTitleFieldsFromTranscriptBatch(scopes, opts) {
	try {
		return readSessionTitleFieldsFromTranscriptBatchCurrent(scopes, opts);
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		return scopes.map((scope) => readSqliteTitleFieldsOrEmpty(resolveTranscriptReadTarget(scope), opts));
	}
}
/** Reads title and preview text from a transcript through the reader seam. */
function readSessionTitleFieldsFromTranscript(scope, opts) {
	return readSqliteTitleFieldsOrEmpty(resolveTranscriptReadTarget(scope), opts);
}
/** Reads title and preview text asynchronously through the reader seam. */
async function readSessionTitleFieldsFromTranscriptAsync(scope, opts) {
	return readSqliteTitleFieldsOrEmpty(resolveTranscriptReadTarget(scope), opts);
}
//#endregion
//#region src/gateway/session-utils-projection.ts
function buildSessionListRowContext(params) {
	const subagentRuns = buildSubagentSessionListReadIndex(params.now);
	return buildSessionListRowContextFromParts({
		subagentRuns,
		storeChildSessionsByKey: buildStoreChildSessionIndex(params.store, params.now, subagentRuns),
		userProfileIdentityById: params.userProfileIdentityById
	});
}
function buildSessionListRowContextFromParts(params) {
	return {
		subagentRuns: params.subagentRuns,
		storeChildSessionsByKey: params.storeChildSessionsByKey,
		selectedModelByOverrideRef: /* @__PURE__ */ new Map(),
		thinkingMetadataByModelRef: /* @__PURE__ */ new Map(),
		displayModelIdentityByKey: /* @__PURE__ */ new Map(),
		modelCostConfigByModelRef: /* @__PURE__ */ new Map(),
		userProfileIdentityById: params.userProfileIdentityById ?? /* @__PURE__ */ new Map(),
		acpSessionMetaByEntry: /* @__PURE__ */ new Map()
	};
}
function buildSessionListRowMetadataContext(params) {
	return buildSessionListRowContextFromParts({
		subagentRuns: buildSubagentSessionListReadIndex(params.now),
		storeChildSessionsByKey: /* @__PURE__ */ new Map(),
		userProfileIdentityById: params.userProfileIdentityById
	});
}
function buildSingleRowStoreChildSessionsByKey(params) {
	const storeChildSessions = resolveStoreChildSessionKeysFromCandidates({
		store: params.store,
		key: params.key,
		now: params.now,
		candidates: getSingleRowChildSessionCandidates({
			storePath: params.storePath,
			store: params.store
		})
	});
	return storeChildSessions ? /* @__PURE__ */ new Map([[params.key, storeChildSessions]]) : /* @__PURE__ */ new Map();
}
function resolveSessionSelectedModelRef(params) {
	const override = normalizeStoredOverrideModel({
		providerOverride: params.entry?.providerOverride,
		modelOverride: params.entry?.modelOverride
	});
	if (!params.rowContext) return resolveSessionModelRef(params.cfg, params.entry, params.agentId, { allowPluginNormalization: params.allowPluginNormalization });
	const key = [
		normalizeAgentId(params.agentId),
		override.providerOverride ?? "",
		override.modelOverride ?? ""
	].join("\0");
	const cached = params.rowContext.selectedModelByOverrideRef.get(key);
	if (cached) return cached;
	const selected = resolveSessionModelRef(params.cfg, params.entry, params.agentId, { allowPluginNormalization: params.allowPluginNormalization });
	params.rowContext.selectedModelByOverrideRef.set(key, selected);
	return selected;
}
function mergeChildSessionKeys(runtimeChildSessions, storeChildSessions) {
	if (!runtimeChildSessions?.length) return storeChildSessions?.length ? storeChildSessions : void 0;
	if (!storeChildSessions?.length) return runtimeChildSessions;
	return uniqueStrings([...runtimeChildSessions, ...storeChildSessions]);
}
function resolveChildSessionKeys(controllerSessionKey, store, now = Date.now(), subagentRuns) {
	return mergeChildSessionKeys(resolveRuntimeChildSessionKeys(controllerSessionKey, now, subagentRuns), buildStoreChildSessionIndex(store, now, subagentRuns).get(controllerSessionKey));
}
function resolveTranscriptUsageFallback(params) {
	const entry = params.entry;
	if (!entry?.sessionId) return null;
	const parsed = parseAgentSessionKey(params.key);
	const agentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : normalizeAgentId(params.agentId ?? resolveSessionStoreAgentId(params.cfg, params.key));
	const storePath = resolveConcreteSessionStorePath(params.storePath) ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	let snapshot;
	try {
		snapshot = readRecentSessionUsageFromTranscript({
			agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: params.key,
			storePath
		}, typeof params.maxTranscriptBytes === "number" ? params.maxTranscriptBytes : 256 * 1024);
	} catch {
		return null;
	}
	if (!snapshot) return null;
	const modelProvider = snapshot.modelProvider ?? params.fallbackProvider;
	const model = snapshot.model ?? params.fallbackModel;
	const estimatedCostUsd = resolveEstimatedSessionCostUsd({
		cfg: params.cfg,
		provider: modelProvider,
		model,
		explicitCostUsd: snapshot.costUsd,
		entry: {
			inputTokens: snapshot.inputTokens,
			outputTokens: snapshot.outputTokens,
			cacheRead: snapshot.cacheRead,
			cacheWrite: snapshot.cacheWrite
		},
		rowContext: params.rowContext
	});
	return {
		modelProvider,
		model,
		totalTokens: resolvePositiveNumber(snapshot.totalTokens),
		totalTokensFresh: snapshot.totalTokensFresh === true,
		estimatedCostUsd
	};
}
//#endregion
//#region src/gateway/session-utils-row.ts
/** Adds current actor display data without persisting rename-prone metadata. */
/** Opaque cache-busting revision for the channel-avatar route; never leaks the reference. */
function channelAvatarRevision(reference) {
	return createHash("sha256").update(reference).digest("base64url").slice(0, 12);
}
function projectSessionActor(actor, userProfileIdentityById = /* @__PURE__ */ new Map(), cfg) {
	if (!actor) return;
	const id = normalizeOptionalString(actor.id);
	if (actor.type === "agent" && id && cfg) {
		const identity = resolveAgentIdentity(cfg, id);
		const label = normalizeOptionalString(identity?.name);
		const avatar = normalizeOptionalString(identity?.avatar);
		const avatarUrl = avatar && looksLikeAvatarPath(avatar) ? buildControlUiResourcePath("agentAvatar", normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath), id) : void 0;
		return {
			type: actor.type,
			id,
			...label ? { label } : {},
			...avatarUrl ? { avatarUrl } : {}
		};
	}
	if (actor.type !== "human" || !id) return {
		type: actor.type,
		...id ? { id } : {}
	};
	let identity = userProfileIdentityById.get(id);
	if (!userProfileIdentityById.has(id)) {
		const display = resolveCurrentUserProfileDisplay(id);
		identity = display.kind === "unresolved" ? void 0 : {
			...display.label ? { label: display.label } : {},
			...display.hasUploadedAvatar ? { avatarUrl: display.avatarUrl } : {}
		};
		userProfileIdentityById.set(id, identity);
	}
	return {
		type: actor.type,
		id,
		...identity
	};
}
/** Projects an identity only when it can own a session durably. */
function projectAssignableSessionOwner(actor, userProfileIdentityById, cfg, configuredAgentIds) {
	if (!actor || actor.type !== "human" && actor.type !== "agent") return;
	const rawId = normalizeOptionalString(actor.id);
	if (!rawId) return;
	const id = actor.type === "agent" ? normalizeAgentId(rawId) : rawId;
	if (actor.type === "agent" && !(configuredAgentIds ?? new Set(listAgentIds(cfg))).has(id)) return;
	const projected = projectSessionActor({
		type: actor.type,
		id
	}, userProfileIdentityById, cfg);
	if (!projected?.id || actor.type === "human" && userProfileIdentityById.get(id) === void 0) return;
	return {
		type: actor.type,
		id,
		...projected.label ? { label: projected.label } : {},
		...projected.avatarUrl ? { avatarUrl: projected.avatarUrl } : {}
	};
}
function projectSessionOwner(entry, userProfileIdentityById, cfg, configuredAgentIds) {
	const persisted = entry?.owner;
	const identities = userProfileIdentityById ?? /* @__PURE__ */ new Map();
	const actor = projectAssignableSessionOwner(persisted?.actor ?? entry?.createdActor, identities, cfg, configuredAgentIds);
	if (!actor) return;
	const assignedBy = projectSessionActor(persisted?.assignedBy, identities, cfg);
	return {
		actor,
		...assignedBy ? { assignedBy } : {},
		...persisted?.assignedAt !== void 0 ? { assignedAt: persisted.assignedAt } : {}
	};
}
function projectSessionParticipants(entry, userProfileIdentityById, cfg) {
	const participants = entry?.participants?.flatMap((participant) => {
		const projected = projectSessionActor(participant, userProfileIdentityById, cfg);
		return projected ? [projected] : [];
	});
	return participants?.length ? participants.slice(0, 4) : void 0;
}
function buildGatewaySessionRow(params) {
	const { cfg, storePath, store, key, entry } = params;
	const lightweight = params.lightweightListRow === true;
	const now = params.now ?? Date.now();
	const agentStatus = resolveActiveSessionAgentStatus(entry?.agentStatus, now);
	const observerDigest = entry?.observerDigest && (entry.startedAt === void 0 || entry.observerDigest.updatedAt > entry.startedAt) ? entry.observerDigest : void 0;
	const updatedAt = entry?.updatedAt ?? null;
	const parsed = parseGroupKey(key);
	const sessionKind = classifySessionKind(key, entry);
	const gatewayKind = sessionKind === "cron" || sessionKind === "spawn-child" ? "direct" : sessionKind;
	const deliveryFields = projectSessionDeliveryFields(entry?.delivery);
	const channel = deliveryFields.channel ?? parsed?.channel;
	const subject = entry?.subject;
	const groupChannel = entry?.groupChannel;
	const space = entry?.space;
	const id = parsed?.id;
	const storedOrigin = deliveryFields.origin;
	const avatar = normalizeOptionalString(storedOrigin?.avatar);
	const origin = storedOrigin ? (({ avatar: _avatar, ...safeOrigin }) => safeOrigin)(storedOrigin) : void 0;
	const originLabel = origin?.label;
	const controlUiBasePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
	const channelAvatarUrl = avatar ? buildControlUiChannelAvatarUrl(controlUiBasePath, key, channelAvatarRevision(avatar)) : void 0;
	const parsedAgent = parseAgentSessionKey(key);
	const isDashboardSession = parsedAgent?.rest.startsWith("dashboard:") === true;
	const isGroupSession = isGroupOrChannelDisplaySession(entry, parsed);
	const displayName = entry?.label ?? (isGroupSession ? buildGroupDisplayTitle({
		subject,
		groupChannel,
		space
	}) : void 0) ?? entry?.displayName ?? (isGroupSession && channel ? buildGroupDisplayName({
		provider: channel,
		subject,
		groupChannel,
		space,
		id,
		key
	}) : void 0) ?? (isDashboardSession ? void 0 : originLabel);
	const sessionAgentId = normalizeAgentId(parsedAgent?.agentId ?? params.agentId ?? resolveSessionStoreAgentId(cfg, key));
	const skipTranscriptUsage = params.skipTranscriptUsageFallback === true;
	const rowContext = params.rowContext;
	const subagentRun = rowContext ? rowContext.subagentRuns.getDisplaySubagentRun(key) : getSessionDisplaySubagentRunByChildSessionKey(key);
	const subagentOwner = normalizeOptionalString(subagentRun?.controllerSessionKey) || normalizeOptionalString(subagentRun?.requesterSessionKey);
	const liveSubagentRunActive = isSubagentRunLive(subagentRun);
	const hasActiveSubagentRun = liveSubagentRunActive || (rowContext?.subagentRuns.countActiveDescendantRuns(key) ?? countActiveDescendantRuns(key)) > 0;
	const persistedSessionStatus = entry?.status;
	const persistedSessionEndedAt = entry?.endedAt;
	const persistedSessionStartedAt = entry?.startedAt;
	const persistedSessionRuntimeMs = entry?.runtimeMs;
	const subagentRunState = subagentRun ? liveSubagentRunActive ? "active" : typeof subagentRun.execution.endedAt === "number" || persistedSessionStatus === "done" || persistedSessionStatus === "failed" || persistedSessionStatus === "killed" || persistedSessionStatus === "timeout" || typeof persistedSessionEndedAt === "number" ? "historical" : "interrupted" : void 0;
	const subagentStatus = subagentRun ? liveSubagentRunActive ? resolveSubagentSessionStatus(subagentRun) : persistedSessionStatus === "running" ? void 0 : persistedSessionStatus ?? (typeof subagentRun.execution.endedAt === "number" ? resolveSubagentSessionStatus(subagentRun) : void 0) : void 0;
	const subagentStartedAt = subagentRun ? liveSubagentRunActive ? getSubagentSessionStartedAt(subagentRun) : persistedSessionStartedAt ?? getSubagentSessionStartedAt(subagentRun) : void 0;
	const subagentEndedAt = subagentRun ? liveSubagentRunActive ? subagentRun.execution.endedAt : persistedSessionEndedAt ?? subagentRun.execution.endedAt : void 0;
	const subagentRuntimeMs = subagentRun ? liveSubagentRunActive ? getSubagentSessionRuntimeMs(subagentRun, now) : persistedSessionRuntimeMs ?? (typeof subagentRun.execution.endedAt === "number" ? getSubagentSessionRuntimeMs(subagentRun, now) : void 0) : void 0;
	const selectedModel = resolveSessionSelectedModelRef({
		cfg,
		entry,
		agentId: sessionAgentId,
		rowContext,
		allowPluginNormalization: !lightweight
	});
	const resolvedModel = resolveSessionModelIdentityRef(cfg, entry, sessionAgentId, subagentRun?.model, { allowPluginNormalization: !lightweight });
	const freshSessionTotalTokens = asNonNegativeFiniteNumber(resolveFreshSessionTotalTokens(entry));
	const needsTranscriptTotalTokens = freshSessionTotalTokens === void 0;
	const needsTranscriptEstimatedCostUsd = !skipTranscriptUsage && resolveEstimatedSessionCostUsd({
		cfg,
		provider: resolvedModel.provider,
		model: resolvedModel.model ?? "gpt-5.6-sol",
		entry,
		rowContext
	}) === void 0;
	const transcriptUsage = !skipTranscriptUsage && (needsTranscriptTotalTokens || needsTranscriptEstimatedCostUsd) ? resolveTranscriptUsageFallback({
		cfg,
		key,
		entry,
		storePath,
		fallbackProvider: resolvedModel.provider,
		fallbackModel: resolvedModel.model ?? "gpt-5.6-sol",
		maxTranscriptBytes: params.transcriptUsageMaxBytes,
		rowContext: params.rowContext,
		agentId: sessionAgentId
	}) : null;
	const totalTokens = freshSessionTotalTokens ?? asNonNegativeFiniteNumber(transcriptUsage?.totalTokens);
	const totalTokensFresh = freshSessionTotalTokens !== void 0 || typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0 ? true : transcriptUsage?.totalTokensFresh === true;
	const goal = entry?.goal ? resolveSessionGoalDisplayState({
		goal: entry.goal,
		totalTokens,
		totalTokensFresh,
		totalTokensVersion: totalTokensFresh ? 1 : void 0
	}, now, { adoptFreshBaseline: false }) : void 0;
	const childSessions = params.storeChildSessionsByKey ? mergeChildSessionKeys(resolveRuntimeChildSessionKeys(key, now, rowContext?.subagentRuns), params.storeChildSessionsByKey.get(key)) : resolveChildSessionKeys(key, store, now, rowContext?.subagentRuns);
	const compactionCheckpoints = resolveProjectableCompactionCheckpoints(entry);
	const compactionCheckpointCount = Array.isArray(entry?.compactionCheckpoints) ? compactionCheckpoints.length : void 0;
	const latestCompactionCheckpoint = buildCompactionCheckpointPreview(resolveLatestCompactionCheckpoint(compactionCheckpoints));
	const selectedModelProvider = selectedModel.provider;
	const selectedModelId = selectedModel.model;
	const rowModelIdentity = lightweight ? {
		provider: selectedModelProvider,
		model: selectedModelId
	} : resolveSessionDisplayModelIdentityRefCached({
		cfg,
		agentId: sessionAgentId,
		provider: selectedModelProvider,
		model: selectedModelId,
		rowContext: params.rowContext
	});
	const rowModelProvider = rowModelIdentity.provider;
	const rowModel = rowModelIdentity.model;
	const acpSessionKey = resolveStoredSessionKeyForAgentStore({
		cfg,
		agentId: sessionAgentId,
		sessionKey: key
	});
	const estimatedCostUsd = lightweight ? asNonNegativeFiniteNumber(entry?.estimatedCostUsd) : resolveEstimatedSessionCostUsd({
		cfg,
		provider: rowModelProvider,
		model: rowModel,
		entry,
		rowContext: params.rowContext
	}) ?? asNonNegativeFiniteNumber(transcriptUsage?.estimatedCostUsd);
	let derivedTitle;
	let lastMessagePreview;
	if (entry?.sessionId && (params.includeDerivedTitles || params.includeLastMessage)) {
		const fields = readSessionTitleFieldsFromTranscript({
			agentId: sessionAgentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: key,
			storePath
		});
		if (params.includeDerivedTitles) derivedTitle = deriveSessionTitle(entry, fields.firstUserMessage, displayName);
		if (params.includeLastMessage && fields.lastMessagePreview) lastMessagePreview = fields.lastMessagePreview;
	}
	const thinkingProvider = rowModelProvider ?? "openai";
	const thinkingModel = rowModel ?? "gpt-5.6-sol";
	const rowModelCatalog = params.modelCatalog instanceof Map ? params.modelCatalog.get(sessionAgentId) : params.modelCatalog;
	const thinkingProjection = resolveGatewaySessionThinkingProjectionInternal({
		cfg,
		agentId: sessionAgentId,
		provider: thinkingProvider,
		model: thinkingModel,
		sessionKey: acpSessionKey,
		entry,
		modelCatalog: rowModelCatalog ?? (lightweight ? [] : void 0),
		rowContext,
		providerPolicySource: lightweight ? "active" : void 0
	});
	const catalogEntry = rowModelCatalog && rowModelProvider && rowModel ? findModelCatalogEntry(rowModelCatalog, {
		provider: rowModelProvider,
		modelId: rowModel
	}) : void 0;
	const contextWindowProfile = resolveModelContextWindowProfile({
		catalogEntry,
		selected: entry?.contextWindow
	});
	const resolvedModelContextTokens = resolvePositiveNumber(resolveContextTokensForModel({
		cfg,
		provider: rowModelProvider,
		model: rowModel,
		modelContextTokens: catalogEntry?.contextTokens,
		modelContextWindow: contextWindowProfile.contextTokens,
		allowAsyncLoad: false
	}));
	const resolvedCurrentContextTokens = contextWindowProfile.contextTokens ? Math.min(resolvedModelContextTokens ?? contextWindowProfile.contextTokens, contextWindowProfile.contextTokens) : resolvedModelContextTokens;
	const authoredContextTokens = resolvePositiveNumber(resolveAuthoredModelContextTokens({
		cfg,
		provider: rowModelProvider,
		model: rowModel
	}));
	const contextTokens = resolveProjectedSessionContextTokens({
		entry,
		provider: rowModelProvider,
		model: rowModel,
		agentHarnessId: thinkingProjection.agentRuntime.id,
		resolvedContextTokens: resolvedCurrentContextTokens,
		authoredContextTokens
	});
	const fastModeState = resolveFastModeState({
		cfg,
		provider: selectedModelProvider,
		model: selectedModelId,
		agentId: sessionAgentId,
		sessionEntry: entry?.fastMode !== void 0 ? { fastMode: entry.fastMode } : void 0
	});
	const pluginExtensions = !lightweight && entry ? projectPluginSessionExtensionsSync({
		sessionKey: key,
		entry
	}) : [];
	return {
		key,
		visibility: entry ? entry.visibility ?? "shared" : void 0,
		incognito: entry?.incognito,
		spawnedBy: subagentOwner || entry?.spawnedBy,
		controlOwnerSessionKey: subagentOwner || entry?.spawnedBy,
		swarmGroupId: entry?.swarmGroupId,
		spawnedWorkspaceDir: entry?.spawnedWorkspaceDir,
		spawnedCwd: entry?.spawnedCwd,
		permissionMode: entry?.permissionMode,
		...entry?.permissionMode !== void 0 && entry.sessionRoot !== void 0 ? { sessionRoot: entry.sessionRoot } : {},
		worktree: entry?.worktree,
		execNode: entry?.execNode,
		execCwd: entry?.execCwd,
		forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
		spawnDepth: entry?.spawnDepth,
		subagentRole: entry?.subagentRole,
		subagentControlScope: entry?.subagentControlScope,
		createdVia: entry?.createdVia,
		createdActor: projectSessionActor(entry?.createdActor, rowContext?.userProfileIdentityById, cfg),
		owner: projectSessionOwner(entry, rowContext?.userProfileIdentityById, cfg, params.configuredAgentIds),
		participants: projectSessionParticipants(entry, rowContext?.userProfileIdentityById, cfg),
		participantCount: entry?.participantCount,
		createdAt: entry?.createdAt,
		forkSource: entry?.forkSource,
		previousSessionId: entry?.previousSessionId,
		kind: gatewayKind,
		label: entry?.label,
		icon: entry?.icon,
		channelAvatarUrl,
		category: entry?.category,
		boardFace: entry?.boardFace,
		...sessionClassificationForRow(cfg, key, sessionAgentId, entry),
		displayName,
		derivedTitle,
		lastMessagePreview,
		channel,
		subject,
		groupChannel,
		space,
		chatType: entry?.chatType,
		origin,
		updatedAt,
		archived: entry?.archivedAt !== void 0,
		archivedAt: entry?.archivedAt,
		archivedBy: projectSessionActor(entry?.archivedBy, rowContext?.userProfileIdentityById, cfg),
		pinned: entry?.pinnedAt !== void 0,
		pinnedAt: entry?.pinnedAt,
		unread: deriveSessionUnread(entry),
		lastReadAt: entry?.lastReadAt,
		markedUnreadAt: entry?.markedUnreadAt,
		agentStatus,
		observerDigest: observerDigest ? {
			...observerDigest.agentId ? { agentId: observerDigest.agentId } : {},
			runId: observerDigest.runId,
			headline: observerDigest.headline,
			health: observerDigest.health,
			updatedAt: observerDigest.updatedAt,
			revision: observerDigest.revision
		} : void 0,
		lastInteractionAt: entry?.lastInteractionAt,
		lastActivityAt: entry?.lastActivityAt,
		sessionId: entry?.sessionId,
		systemSent: entry?.systemSent,
		abortedLastRun: entry?.abortedLastRun,
		restartRecoveryStatus: entry?.mainRestartRecovery?.tombstone ? "tombstoned" : void 0,
		thinkingLevel: thinkingProjection.thinkingLevel,
		contextWindow: contextWindowProfile.contextWindow,
		contextWindows: contextWindowProfile.contextWindows,
		contextWindowDefault: contextWindowProfile.contextWindowDefault,
		thinkingLevels: thinkingProjection.thinkingLevels,
		thinkingOptions: thinkingProjection.thinkingOptions,
		thinkingDefault: thinkingProjection.thinkingDefault,
		fastMode: entry?.fastMode,
		toolOverrides: entry?.toolOverrides,
		effectiveFastMode: fastModeState.mode,
		effectiveFastModeSource: fastModeState.source,
		fastAutoOnSeconds: fastModeState.fastAutoOnSeconds,
		verboseLevel: entry?.verboseLevel,
		traceLevel: entry?.traceLevel,
		reasoningLevel: entry?.reasoningLevel,
		elevatedLevel: entry?.elevatedLevel,
		sendPolicy: entry?.sendPolicy,
		inputTokens: entry?.inputTokens,
		outputTokens: entry?.outputTokens,
		totalTokens,
		totalTokensFresh,
		goal,
		estimatedCostUsd,
		status: subagentRun ? subagentStatus : entry?.status,
		lastRunError: entry?.lastRunError,
		lastRunId: entry?.lastRunId,
		hasAutomation: sessionHasAutomation(key, cfg, sessionAgentId) ? true : void 0,
		subagentRunState,
		hasActiveSubagentRun: subagentRun || hasActiveSubagentRun ? hasActiveSubagentRun : void 0,
		startedAt: subagentRun ? subagentStartedAt : entry?.startedAt,
		endedAt: subagentRun ? subagentEndedAt : entry?.endedAt,
		runtimeMs: subagentRun ? subagentRuntimeMs : entry?.runtimeMs,
		parentSessionKey: entry?.parentSessionKey,
		childSessions,
		responseUsage: entry?.responseUsage,
		effectiveResponseUsage: resolveEffectiveResponseUsage(entry?.responseUsage, cfg.messages?.responseUsage, channel),
		queueMode: entry?.queueMode,
		effectiveQueueMode: resolveQueueSettingsCore({
			cfg,
			channel: INTERNAL_MESSAGE_CHANNEL,
			sessionEntry: entry
		}).mode,
		modelProvider: rowModelProvider,
		model: rowModel,
		modelOverrideSource: resolveSessionModelOverrideSource(entry),
		modelSelectionLocked: entry?.modelSelectionLocked,
		agentRuntime: projectWorkerPlacementAgentRuntime(thinkingProjection.agentRuntime),
		contextTokens,
		contextBudgetStatus: entry?.contextBudgetStatus,
		deliveryContext: deliveryFields.deliveryContext,
		lastChannel: deliveryFields.lastChannel,
		lastTo: deliveryFields.lastTo,
		lastAccountId: deliveryFields.lastAccountId,
		lastThreadId: deliveryFields.lastThreadId,
		compactionCheckpointCount,
		latestCompactionCheckpoint,
		pluginExtensions: pluginExtensions.length > 0 ? pluginExtensions : void 0
	};
}
//#endregion
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
function addSessionOwnerFacetIdentity(ownerFacet, actor) {
	const existing = ownerFacet.get(actor.id);
	if (!existing || existing.type === "human" && actor.type === "agent") ownerFacet.set(actor.id, actor);
}
function sortSessionOwnerFacet(ownerFacet) {
	return [...ownerFacet.values()].toSorted((a, b) => {
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
	const ownerId = normalizeOptionalString(opts.ownerId);
	const involvingActorId = normalizeOptionalString(params.involvingActorId);
	const ownerFirstActorId = normalizeOptionalString(params.ownerFirstActorId);
	const activeCutoff = activeMinutes === void 0 ? void 0 : now - activeMinutes * 6e4;
	const entries = [];
	const ownerEntries = [];
	const ownerFacet = /* @__PURE__ */ new Map();
	let configuredAgentIds = params.configuredAgentIds;
	let filterOwnerIdentityById;
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
				entry.category,
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
		let effectiveOwner;
		if (params.userProfileIdentityById) {
			configuredAgentIds ??= new Set(listAgentIds(cfg));
			effectiveOwner = projectAssignableSessionOwner(entry.owner?.actor ?? entry.createdActor, params.userProfileIdentityById, cfg, configuredAgentIds);
			if (effectiveOwner) addSessionOwnerFacetIdentity(ownerFacet, effectiveOwner);
		} else if (ownerId || involvingActorId || ownerFirstActorId) {
			filterOwnerIdentityById ??= /* @__PURE__ */ new Map();
			configuredAgentIds ??= new Set(listAgentIds(cfg));
			effectiveOwner = projectAssignableSessionOwner(entry.owner?.actor ?? entry.createdActor, filterOwnerIdentityById, cfg, configuredAgentIds);
		}
		if (creatorId && entry.createdActor?.id !== creatorId) continue;
		if (ownerId && effectiveOwner?.id !== ownerId) continue;
		if (involvingActorId) {
			const viewerOwns = effectiveOwner?.type === "human" && effectiveOwner.id === involvingActorId;
			const viewerParticipates = entry.participants?.some((participant) => participant.type === "human" && participant.source === "profile" && participant.id === involvingActorId);
			if (!viewerOwns && !viewerParticipates) continue;
		}
		if (effectiveOwner?.type === "human" && effectiveOwner.id === ownerFirstActorId) ownerEntries.push([key, entry]);
		entries.push([key, entry]);
	}
	return {
		entries,
		ownerEntries,
		ownerFacet: sortSessionOwnerFacet(ownerFacet)
	};
}
function isPhantomAgentStoreListEntry(key, entry) {
	return parseAgentSessionKey(key)?.rest === "sessions" && !normalizeOptionalString(entry?.sessionId) && entry?.updatedAt == null;
}
function selectSessionEntries(params) {
	const { ownerFacet, ownerEntries, entries: filtered } = filterSessionEntries(params);
	const limit = resolveSessionsListLimit(params.opts, params.defaultLimit);
	const offset = resolveSessionsListOffset(params.opts);
	const sortedWindow = sortAndLimitSessionEntries(filtered, resolveSessionsListWindowLimit(limit, offset), params.opts.sortBy);
	const sharedEntries = limit === void 0 ? sortedWindow.slice(offset) : sortedWindow.slice(offset, offset + limit);
	let entries = sharedEntries;
	let ownerCount = 0;
	if (params.ownerFirstActorId && offset === 0) {
		const owned = sortAndLimitSessionEntries(ownerEntries, Math.min(limit ?? 60, 60), params.opts.sortBy);
		ownerCount = owned.length;
		const ownedKeys = new Set(owned.map(([key]) => key));
		entries = [...owned, ...sharedEntries.filter(([key]) => !ownedKeys.has(key))];
	}
	const nextOffset = offset + sharedEntries.length;
	const hasMore = nextOffset < filtered.length;
	return {
		entries,
		ownerCount,
		ownerFacet,
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
	const configuredAgentIds = new Set(listAgentIds(cfg));
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
		userProfileIdentityById,
		configuredAgentIds,
		involvingActorId: params.involvingActorId,
		ownerFirstActorId: params.ownerFirstActorId
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
		transcriptFieldRows: SESSIONS_LIST_TRANSCRIPT_FIELD_ROWS + selection.ownerCount,
		now,
		configuredAgentIds,
		rowContext: sharedRowContext,
		storeChildSessionsByKey: fullRowContext?.storeChildSessionsByKey,
		storePath: hasIncognito ? params.storePath : params.durableStorePath ?? params.storePath
	};
}
function buildSessionsListResult(params) {
	const { list, sessions } = params;
	const defaultsCatalog = params.modelCatalog instanceof Map ? params.modelCatalog.get(params.agentId ? normalizeAgentId(params.agentId) : normalizeAgentId(tryResolveLegacyCompatibilityAgentId(params.cfg) ?? "main")) : params.modelCatalog;
	return {
		ts: list.now,
		path: list.storePath,
		count: sessions.length,
		totalCount: list.totalCount,
		limitApplied: list.limitApplied,
		offset: list.offset > 0 ? list.offset : void 0,
		nextOffset: list.nextOffset,
		hasMore: list.hasMore,
		owners: list.ownerFacet,
		defaults: getSessionDefaults(params.cfg, defaultsCatalog, {
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
		const includeTranscriptFields = index < list.transcriptFieldRows;
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
			configuredAgentIds: list.configuredAgentIds,
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
		const transcriptFields = readSessionTitleFieldsFromTranscriptBatch(list.entries.slice(0, list.transcriptFieldRows).flatMap(([key, entry]) => {
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
			const includeTranscriptFields = i < list.transcriptFieldRows;
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
export { sessionAgentStatusExpiresAt as C, sanitizeSessionAgentStatusNote as S, unregisterSessionAutomationSource as _, loadGatewaySessionLifecycleSnapshot as a, isSessionAgentAttentionIconId as b, projectAssignableSessionOwner as c, readSessionTitleFieldsFromTranscriptAsync as d, readSessionTitleProjectionUnavailableVersion as f, registerSessionAutomationSource as g, readSessionAutomationVersion as h, buildGatewaySessionInfo as i, projectSessionActor as l, claimSessionAutomationEpoch as m, listSessionsFromStore as n, loadGatewaySessionRow as o, bumpSessionAutomationVersion as p, listSessionsFromStoreAsync as r, buildGatewaySessionRow as s, filterAndSortSessionEntries as t, readSessionTitleFieldsFromTranscript as u, disableCronJobsBoundToSessions as v, deriveSessionTitle as w, resolveActiveSessionAgentStatus as x, resolveCronJobBoundSessionKeys as y };
