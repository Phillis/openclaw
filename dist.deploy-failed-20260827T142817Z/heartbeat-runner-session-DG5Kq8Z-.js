import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, r as listAgentEntries, s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { a as isSubagentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { b as toAgentStoreSessionKey, f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { b as resolveModelRefFromString } from "./model-selection-shared-DT9x3Cg2.js";
import { a as getActivePluginChannelRegistry } from "./runtime-CTbL314X.js";
import { d as readStoredDeviceIdentityReadOnly, r as loadOrCreateDeviceIdentity } from "./device-identity-BTcjEaGA.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-er-Gn_t_.js";
import { Qt as loadSessionEntry, en as patchSessionEntryCore } from "./session-accessor-CVnxp3UM.js";
import { t as getChannelPlugin } from "./registry-CWrpiLCs.js";
import "./plugins-2lW9dSyY.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-CvHDRR81.js";
import "./model-selection-BhpnS-Rv.js";
import { c as resolveHeartbeatPromptCore, l as resolveHeartbeatPromptForResponseTool } from "./heartbeat-BB6nm0Fy.js";
import { i as resolveAmbientHeartbeatAgentId, n as resolveHeartbeatIntervalMs } from "./heartbeat-summary-D3cbsUP0.js";
import { i as resolveUserTimezone } from "./date-time-DeTgYjja.js";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-NqTMmlKu.js";
import { t as resolveDefaultModel } from "./directive-handling.defaults-CoPwvo28.js";
import { createHash } from "node:crypto";
//#region src/infra/heartbeat-active-hours.ts
const ACTIVE_HOURS_TIME_PATTERN = /^(?:([01]\d|2[0-3]):([0-5]\d)|24:00)$/;
/** Resolve the timezone used to evaluate heartbeat active hours. */
function resolveActiveHoursTimezone(cfg, raw) {
	const trimmed = raw?.trim();
	if (!trimmed || trimmed === "user") return resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
	if (trimmed === "local") return Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || "UTC";
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(/* @__PURE__ */ new Date());
		return trimmed;
	} catch {
		return resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
	}
}
function parseActiveHoursTime(opts, raw) {
	if (!raw || !ACTIVE_HOURS_TIME_PATTERN.test(raw)) return null;
	const [hourStr, minuteStr] = raw.split(":");
	const hour = Number(hourStr);
	const minute = Number(minuteStr);
	if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
	if (hour === 24) {
		if (!opts.allow24 || minute !== 0) return null;
		return 1440;
	}
	return hour * 60 + minute;
}
function resolveMinutesInTimeZone(nowMs, formatter) {
	try {
		const parts = formatter.formatToParts(new Date(nowMs));
		const map = {};
		for (const part of parts) if (part.type !== "literal") map[part.type] = part.value;
		const hour = Number(map.hour);
		const minute = Number(map.minute);
		if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
		return hour * 60 + minute;
	} catch {
		return null;
	}
}
/** Prepare one active-hours predicate for repeated schedule probes. */
function createActiveHoursPredicate(cfg, heartbeat) {
	const active = heartbeat?.activeHours;
	if (!active) return () => true;
	const startMin = parseActiveHoursTime({ allow24: false }, active.start);
	const endMin = parseActiveHoursTime({ allow24: true }, active.end);
	if (startMin === null || endMin === null) return () => true;
	if (startMin === endMin) return () => false;
	const timeZone = resolveActiveHoursTimezone(cfg, active.timezone);
	let formatter;
	try {
		formatter = new Intl.DateTimeFormat("en-US", {
			timeZone,
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		});
	} catch {
		return () => true;
	}
	return (nowMs) => {
		const currentMin = resolveMinutesInTimeZone(nowMs, formatter);
		if (currentMin === null) return true;
		if (endMin > startMin) return currentMin >= startMin && currentMin < endMin;
		return currentMin >= startMin || currentMin < endMin;
	};
}
/** Return true when the current time is inside the configured heartbeat window. */
function isWithinActiveHours(cfg, heartbeat, nowMs) {
	return createActiveHoursPredicate(cfg, heartbeat)(nowMs ?? Date.now());
}
//#endregion
//#region src/infra/heartbeat-runner-config.ts
const heartbeatLog = createSubsystemLogger("gateway/heartbeat");
const DEFAULT_HEARTBEAT_TIMEOUT_SECONDS = 600;
function resolveHeartbeatChannelPlugin(channel) {
	return getActivePluginChannelRegistry()?.channels.find((entry) => entry.plugin.id === channel)?.plugin ?? getChannelPlugin(channel);
}
function resolveHeartbeatTimeoutOverrideSeconds(cfg, heartbeat) {
	if (typeof heartbeat?.timeoutSeconds === "number") return heartbeat.timeoutSeconds;
	const agentDefaultTimeoutSeconds = cfg.agents?.defaults?.timeoutSeconds;
	if (typeof agentDefaultTimeoutSeconds === "number" && Number.isFinite(agentDefaultTimeoutSeconds)) return agentDefaultTimeoutSeconds === 0 ? 0 : Math.max(1, Math.floor(agentDefaultTimeoutSeconds));
	const intervalMs = resolveHeartbeatIntervalMs(cfg, void 0, heartbeat);
	if (!intervalMs) return DEFAULT_HEARTBEAT_TIMEOUT_SECONDS;
	return Math.max(1, Math.min(DEFAULT_HEARTBEAT_TIMEOUT_SECONDS, Math.ceil(intervalMs / 1e3)));
}
function resolveActiveHoursSchedule(cfg, heartbeat) {
	const activeHours = heartbeat?.activeHours;
	if (!activeHours) return;
	return {
		start: activeHours.start,
		end: activeHours.end,
		timezone: resolveActiveHoursTimezone(cfg, activeHours.timezone)
	};
}
function activeHoursConfigMatch(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.start === b.start && a.end === b.end && a.timezone === b.timezone;
}
function resolveHeartbeatSchedulerSeed(explicitSeed, options = {}) {
	const normalized = normalizeOptionalString(explicitSeed);
	if (normalized) return normalized;
	const env = options.env ?? process.env;
	try {
		const identity = options.readOnly ? readStoredDeviceIdentityReadOnly({ env }) : loadOrCreateDeviceIdentity({ env });
		if (identity) return identity.deviceId;
	} catch {}
	return createHash("sha256").update(env.HOME ?? "").update("\0").update(process.cwd()).digest("hex");
}
function hasExplicitHeartbeatAgents(cfg) {
	return listAgentEntries(cfg).some((entry) => Boolean(entry?.heartbeat));
}
function resolveHeartbeatConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.heartbeat;
	if (!agentId) return defaults;
	const overrides = resolveAgentConfig(cfg, agentId)?.heartbeat;
	if (!defaults && !overrides) return overrides;
	return {
		...defaults,
		...overrides
	};
}
function omitExplicitHeartbeatDestination(heartbeat) {
	if (!heartbeat) return;
	const next = { ...heartbeat };
	delete next.to;
	delete next.accountId;
	return next;
}
function resolveHeartbeatForWake(params) {
	const base = params.configuredHeartbeat ?? resolveHeartbeatConfig(params.cfg, params.agentId);
	const heartbeat = params.requestedHeartbeat && params.mergeRequestedHeartbeat ? {
		...base,
		...params.requestedHeartbeat
	} : params.requestedHeartbeat ?? base;
	return params.source === "cron" && params.requestedHeartbeat?.target === "last" ? omitExplicitHeartbeatDestination(heartbeat) : heartbeat;
}
function resolveHeartbeatAgents(cfg) {
	const list = listAgentEntries(cfg);
	if (hasExplicitHeartbeatAgents(cfg)) return list.filter((entry) => entry?.heartbeat).map((entry) => {
		const id = normalizeAgentId(entry.id);
		return {
			agentId: id,
			heartbeat: resolveHeartbeatConfig(cfg, id)
		};
	}).filter((entry) => entry.agentId);
	const configuredAgentId = normalizeOptionalString(cfg.agents?.defaults?.heartbeat?.agentId);
	if (configuredAgentId) {
		const agentId = normalizeAgentId(configuredAgentId);
		return [{
			agentId,
			heartbeat: resolveHeartbeatConfig(cfg, agentId)
		}];
	}
	if (cfg.agents?.defaults?.heartbeat) return listAgentIds(cfg).map((agentId) => ({
		agentId,
		heartbeat: resolveHeartbeatConfig(cfg, agentId)
	}));
	const fallbackId = resolveAmbientHeartbeatAgentId(cfg);
	return [{
		agentId: fallbackId,
		heartbeat: resolveHeartbeatConfig(cfg, fallbackId)
	}];
}
function resolveHeartbeatPromptRaw(cfg, heartbeat) {
	return heartbeat?.prompt ?? cfg.agents?.defaults?.heartbeat?.prompt;
}
function resolveConfiguredHeartbeatPrompt(cfg, heartbeat) {
	return resolveHeartbeatPromptCore(resolveHeartbeatPromptRaw(cfg, heartbeat));
}
function resolveHeartbeatResponseToolPrompt(cfg, heartbeat) {
	return resolveHeartbeatPromptForResponseTool(resolveHeartbeatPromptRaw(cfg, heartbeat));
}
function resolveHeartbeatModelRef(params) {
	const { defaultProvider, defaultModel, aliasIndex } = resolveDefaultModel({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const heartbeatRaw = normalizeOptionalString(params.heartbeat?.model) ?? normalizeOptionalString(params.cfg.agents?.defaults?.heartbeat?.model) ?? "";
	const heartbeatRef = heartbeatRaw ? resolveModelRefFromString({
		raw: heartbeatRaw,
		defaultProvider,
		aliasIndex
	})?.ref : void 0;
	if (heartbeatRef) return heartbeatRef;
	return {
		provider: normalizeOptionalString(params.entry?.providerOverride) ?? normalizeOptionalString(params.entry?.modelProvider) ?? defaultProvider,
		model: normalizeOptionalString(params.entry?.modelOverride) ?? normalizeOptionalString(params.entry?.model) ?? defaultModel
	};
}
function usesCodexHarness(params) {
	const modelRef = resolveHeartbeatModelRef(params);
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	}) === "codex";
}
function shouldUseHeartbeatResponseToolPrompt(params) {
	const chatType = normalizeChatType(params.chatType);
	const visibleReplies = chatType === "group" || chatType === "channel" ? params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies : params.cfg.messages?.visibleReplies;
	if (visibleReplies === "message_tool") return true;
	if (visibleReplies === "automatic") return false;
	return usesCodexHarness(params);
}
function resolveHeartbeatAckMaxChars(_cfg, _heartbeat) {
	return 300;
}
function isHeartbeatTypingEnabled(params) {
	if (!params.hasChatDelivery) return false;
	return (resolveAgentConfig(params.cfg, params.agentId)?.typingMode ?? params.cfg.agents?.defaults?.typingMode) !== "never";
}
function resolveHeartbeatTypingIntervalSeconds(cfg) {
	const configured = cfg.agents?.defaults?.typingIntervalSeconds;
	return typeof configured === "number" && configured > 0 ? configured : void 0;
}
//#endregion
//#region src/infra/heartbeat-runner-session.ts
function resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const sessionCfg = cfg.session;
	const scope = sessionCfg?.scope ?? "per-sender";
	const resolvedAgentId = normalizeAgentId(agentId ?? resolveAmbientHeartbeatAgentId(cfg));
	const mainSessionKey = scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId: resolvedAgentId
	});
	const storePath = resolveSessionStorePathCore(sessionCfg?.store, {
		agentId: resolvedAgentId,
		env
	});
	const mainSession = (suppressOriginatingContext = false) => ({
		sessionKey: mainSessionKey,
		storePath,
		suppressOriginatingContext
	});
	if (scope === "global") return mainSession();
	const forced = forcedSessionKey?.trim();
	if (forced && isSubagentSessionKey(forced)) return mainSession(true);
	if (forced && !isSubagentSessionKey(forced)) {
		const forcedCandidate = toAgentStoreSessionKey({
			agentId: resolvedAgentId,
			requestKey: forced,
			mainKey: cfg.session?.mainKey
		});
		if (!isSubagentSessionKey(forcedCandidate)) {
			const forcedCanonical = canonicalizeMainSessionAlias({
				cfg,
				agentId: resolvedAgentId,
				sessionKey: forcedCandidate
			});
			if (forcedCanonical !== "global" && !isSubagentSessionKey(forcedCanonical)) {
				if (resolveAgentIdFromSessionKey(forcedCanonical) === normalizeAgentId(resolvedAgentId)) return {
					sessionKey: resolveMainScopedEventSessionKey({
						cfg,
						sessionKey: forcedCanonical,
						agentId: resolvedAgentId
					}) ?? forcedCanonical,
					storePath,
					suppressOriginatingContext: false
				};
			}
		}
	}
	const trimmed = heartbeat?.session?.trim() ?? "";
	if (!trimmed || isSubagentSessionKey(trimmed)) return mainSession();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (normalized === "main" || normalized === "global") return mainSession();
	const candidate = toAgentStoreSessionKey({
		agentId: resolvedAgentId,
		requestKey: trimmed,
		mainKey: cfg.session?.mainKey
	});
	if (isSubagentSessionKey(candidate)) return mainSession();
	const canonical = canonicalizeMainSessionAlias({
		cfg,
		agentId: resolvedAgentId,
		sessionKey: candidate
	});
	if (canonical !== "global" && !isSubagentSessionKey(canonical)) {
		if (resolveAgentIdFromSessionKey(canonical) === normalizeAgentId(resolvedAgentId)) return {
			sessionKey: canonical,
			storePath,
			suppressOriginatingContext: false
		};
	}
	return mainSession();
}
function resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const resolved = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env);
	return {
		...resolved,
		entry: loadSessionEntry({
			storePath: resolved.storePath,
			sessionKey: resolved.sessionKey,
			env
		})
	};
}
function resolveIsolatedHeartbeatSessionKey(params) {
	const storedBaseSessionKey = params.sessionEntry?.heartbeatIsolatedBaseSessionKey?.trim();
	if (params.configuredSessionKey === "global") {
		const isolatedSessionKey = toAgentStoreSessionKey({
			agentId: params.agentId,
			requestKey: "global:heartbeat"
		});
		const suffix = params.sessionKey.slice(isolatedSessionKey.length);
		if (params.sessionKey === "global" || storedBaseSessionKey === "global" && (params.sessionKey === isolatedSessionKey || params.sessionKey.startsWith(isolatedSessionKey) && /^(:heartbeat)+$/.test(suffix))) return {
			isolatedSessionKey,
			isolatedBaseSessionKey: "global"
		};
	}
	if (storedBaseSessionKey) {
		const suffix = params.sessionKey.slice(storedBaseSessionKey.length);
		if (params.sessionKey.startsWith(storedBaseSessionKey) && suffix.length > 0 && /^(:heartbeat)+$/.test(suffix)) return {
			isolatedSessionKey: `${storedBaseSessionKey}:heartbeat`,
			isolatedBaseSessionKey: storedBaseSessionKey
		};
	}
	const configuredSuffix = params.sessionKey.slice(params.configuredSessionKey.length);
	if (params.sessionKey.startsWith(params.configuredSessionKey) && /^(:heartbeat)+$/.test(configuredSuffix) && !params.configuredSessionKey.endsWith(":heartbeat")) return {
		isolatedSessionKey: `${params.configuredSessionKey}:heartbeat`,
		isolatedBaseSessionKey: params.configuredSessionKey
	};
	return {
		isolatedSessionKey: `${params.sessionKey}:heartbeat`,
		isolatedBaseSessionKey: params.sessionKey
	};
}
function resolveStaleHeartbeatIsolatedSessionKey(params) {
	if (params.sessionKey === params.isolatedSessionKey) return;
	const suffix = params.sessionKey.slice(params.isolatedBaseSessionKey.length);
	if (params.sessionKey.startsWith(params.isolatedBaseSessionKey) && suffix.length > 0 && /^(:heartbeat)+$/.test(suffix)) return params.sessionKey;
}
async function restoreHeartbeatUpdatedAt(params) {
	const { storePath, sessionKey, updatedAt } = params;
	if (typeof updatedAt !== "number") return;
	const entry = loadSessionEntry({
		storePath,
		sessionKey
	});
	if (!entry) return;
	const nextUpdatedAt = Math.max(entry.updatedAt ?? 0, updatedAt);
	if (entry.updatedAt === nextUpdatedAt) return;
	await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (nextEntry, context) => {
		if (!context.existingEntry) return null;
		const resolvedUpdatedAt = Math.max(nextEntry.updatedAt ?? 0, updatedAt);
		if (nextEntry.updatedAt === resolvedUpdatedAt) return null;
		return {
			...nextEntry,
			updatedAt: resolvedUpdatedAt
		};
	}, { replaceEntry: true });
}
//#endregion
export { resolveHeartbeatTimeoutOverrideSeconds as _, restoreHeartbeatUpdatedAt as a, createActiveHoursPredicate as b, isHeartbeatTypingEnabled as c, resolveHeartbeatAckMaxChars as d, resolveHeartbeatAgents as f, resolveHeartbeatSchedulerSeed as g, resolveHeartbeatResponseToolPrompt as h, resolveStaleHeartbeatIsolatedSessionKey as i, resolveActiveHoursSchedule as l, resolveHeartbeatForWake as m, resolveHeartbeatSessionKey as n, activeHoursConfigMatch as o, resolveHeartbeatChannelPlugin as p, resolveIsolatedHeartbeatSessionKey as r, heartbeatLog as s, resolveHeartbeatSession as t, resolveConfiguredHeartbeatPrompt as u, resolveHeartbeatTypingIntervalSeconds as v, isWithinActiveHours as x, shouldUseHeartbeatResponseToolPrompt as y };
