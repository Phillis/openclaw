import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CLj0HTDM.js";
import { t as createAbortError } from "./abort-signal-D2k14JsD.js";
import { t as isValidAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { a as emitInternalDiagnosticEvent, f as isDiagnosticsEnabled, t as areDiagnosticsEnabledForProcess, u as getInternalDiagnosticEventSequence } from "./diagnostic-events-BGzDm6gu.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { l as resolveCronJobsStorePath, r as loadCronJobsStoreSync } from "./store-jPtUD1Vb.js";
import "./config-B_0xOnKq.js";
import { p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import "./session-accessor-fcDZuc2H.js";
import { v as loadLatestAssistantText } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
import { t as runAbortableTimeout } from "./with-timeout-DxxscSuL.js";
import { g as stopDiagnosticRunActivityTracking, h as startDiagnosticRunActivityTracking, o as getDiagnosticEmbeddedRunActivitySequence, p as resetDiagnosticRunActivityForTest, r as clearDiagnosticEmbeddedRunActivityForSession, s as getDiagnosticSessionActivitySnapshot, t as BLOCKED_TOOL_CALL_ABORT_FLOOR_MS } from "./diagnostic-run-activity-CxbnPTtN.js";
import { a as pruneDiagnosticSessionStates, i as peekDiagnosticSessionState, n as getDiagnosticSessionState, o as resetDiagnosticSessionStateForTest, r as isDiagnosticSessionStateCurrent, t as diagnosticSessionStates } from "./diagnostic-session-state-DnMasH0f.js";
import { a as logMessageQueuedWithBacklogPolicy, n as getLastDiagnosticActivityAt, o as markDiagnosticActivity, s as resetDiagnosticActivityForTest, t as diagnosticLogger } from "./diagnostic-runtime-IUeGlWCe.js";
import { n as getRecentDiagnosticPhases, r as resetDiagnosticPhasesForTest, t as getCurrentDiagnosticPhase } from "./diagnostic-phase-wlaZXgp0.js";
import { a as resetDiagnosticStabilityRecorderForTest, c as stopDiagnosticStabilityRecorder, s as startDiagnosticStabilityRecorder } from "./diagnostic-stability-qy3YzwfS.js";
import { o as resetDiagnosticStabilityBundleForTest, r as installDiagnosticStabilityFatalHook, s as uninstallDiagnosticStabilityFatalHook } from "./diagnostic-stability-bundle-D-lqvuOF.js";
import { totalmem } from "node:os";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import { getHeapStatistics } from "node:v8";
//#region src/agents/embedded-agent-runner/compaction-safety-timeout.ts
/**
* Wraps compaction calls with a safety timeout and abort cleanup.
*/
const EMBEDDED_COMPACTION_TIMEOUT_MS = 18e4;
function abortErrorFromSignal(signal) {
	const reason = "reason" in signal ? signal.reason : void 0;
	if (reason instanceof Error) return reason;
	return createAbortError("aborted", reason ? { cause: reason } : void 0);
}
function resolveCompactionTimeoutMs(cfg) {
	return finiteSecondsToTimerSafeMilliseconds(cfg?.agents?.defaults?.compaction?.timeoutSeconds, { floorSeconds: true }) ?? EMBEDDED_COMPACTION_TIMEOUT_MS;
}
async function compactWithSafetyTimeout(compact, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, opts) {
	let canceled = false;
	const cancel = () => {
		if (canceled) return;
		canceled = true;
		try {
			opts?.onCancel?.();
		} catch {}
	};
	return await runAbortableTimeout(async (timeoutSignal) => {
		let timeoutListener;
		let externalAbortListener;
		let externalAbortPromise;
		const abortSignal = opts?.abortSignal;
		const composedAbortSignal = timeoutSignal && abortSignal ? AbortSignal.any([timeoutSignal, abortSignal]) : timeoutSignal ?? abortSignal;
		if (timeoutSignal) {
			timeoutListener = () => {
				cancel();
			};
			timeoutSignal.addEventListener("abort", timeoutListener, { once: true });
		}
		if (abortSignal) {
			if (abortSignal.aborted) {
				cancel();
				throw abortErrorFromSignal(abortSignal);
			}
			externalAbortPromise = new Promise((_, reject) => {
				externalAbortListener = () => {
					cancel();
					reject(abortErrorFromSignal(abortSignal));
				};
				abortSignal.addEventListener("abort", externalAbortListener, { once: true });
			});
		}
		try {
			const compactPromise = compact(composedAbortSignal);
			if (externalAbortPromise) return await Promise.race([compactPromise, externalAbortPromise]);
			return await compactPromise;
		} finally {
			if (timeoutListener) timeoutSignal?.removeEventListener("abort", timeoutListener);
			if (externalAbortListener) abortSignal?.removeEventListener("abort", externalAbortListener);
		}
	}, timeoutMs, "Compaction");
}
/**
* Invoke a plugin-owned {@link ContextEngine.compact} bounded by the same
* finite safety timeout that protects native runtime compaction.
*
* Plugin context engines that advertise `ownsCompaction` previously had their
* `compact()` awaited with no timeout, no watchdog, and no abort signal — a
* slow or hung plugin compaction would hang the agent turn indefinitely. This
* wrapper closes that gap:
*  - the call is bounded by `timeoutMs` (host-resolved, default
*    {@link EMBEDDED_COMPACTION_TIMEOUT_MS}); on timeout it rejects with a
*    "Compaction timed out" error so the caller's existing failure handling
*    runs instead of hanging;
*  - the timeout signal and caller `abortSignal` are both raced against the
*    call (so a non-cooperating engine is still bounded) and threaded into the
*    `compact()` params (so cooperating engines can cancel their own in-flight
*    work).
*
* Callers keep their existing try/catch — a timeout or abort surfaces as a
* thrown error, never a silent hang.
*/
function compactContextEngineWithSafetyTimeout(contextEngine, params, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, abortSignal) {
	return compactWithSafetyTimeout((compactAbortSignal) => contextEngine.compact(compactAbortSignal ? {
		...params,
		abortSignal: compactAbortSignal
	} : params), timeoutMs, abortSignal ? { abortSignal } : void 0);
}
//#endregion
//#region src/logging/diagnostic-memory.ts
const MB = 1024 * 1024;
const GB = 1024 * MB;
const DEFAULT_RSS_WARNING_BYTES = 1536 * MB;
const DEFAULT_RSS_CRITICAL_BYTES = 3072 * MB;
const DEFAULT_HEAP_WARNING_BYTES = 1024 * MB;
const DEFAULT_HEAP_CRITICAL_BYTES = 2048 * MB;
const DEFAULT_HEAP_WARNING_RATIO = .5;
const DEFAULT_HEAP_CRITICAL_RATIO = .75;
const DEFAULT_HEAP_WARNING_MAX_BYTES = 4 * GB;
const DEFAULT_HEAP_CRITICAL_MAX_BYTES = 6 * GB;
const DEFAULT_RSS_GROWTH_WARNING_BYTES = 512 * MB;
const DEFAULT_RSS_GROWTH_CRITICAL_BYTES = 1024 * MB;
const DEFAULT_GROWTH_WINDOW_MS = 600 * 1e3;
const DEFAULT_PRESSURE_REPEAT_MS = 300 * 1e3;
const BYTE_UNITS = [
	"B",
	"KiB",
	"MiB",
	"GiB",
	"TiB"
];
const DEFAULT_HEAP_SIZE_LIMIT_BYTES = getHeapStatistics().heap_size_limit;
const DEFAULT_PROCESS_MEMORY_LIMIT_BYTES = process.constrainedMemory();
const DEFAULT_PHYSICAL_MEMORY_BYTES = totalmem();
const DEFAULT_IS_BUN_RUNTIME = typeof process.versions.bun === "string";
const log = createSubsystemLogger("gateway").child("diagnostics/memory");
function isPositiveMemoryLimit(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveProcessMemoryLimitBytes(processMemoryLimitBytes, physicalMemoryBytes) {
	if (!isPositiveMemoryLimit(processMemoryLimitBytes)) return;
	return isPositiveMemoryLimit(physicalMemoryBytes) ? Math.min(processMemoryLimitBytes, physicalMemoryBytes) : processMemoryLimitBytes;
}
const state = {
	lastSample: null,
	lastPressureAtByKey: /* @__PURE__ */ new Map()
};
function normalizeMemoryUsage(memory) {
	return {
		rssBytes: memory.rss,
		heapTotalBytes: memory.heapTotal,
		heapUsedBytes: memory.heapUsed,
		externalBytes: memory.external,
		arrayBuffersBytes: memory.arrayBuffers
	};
}
function resolveThresholds(thresholds, heapSizeLimitBytes, processMemoryLimitBytes, physicalMemoryBytes, isBunRuntime = false) {
	const hasHeapLimit = isPositiveMemoryLimit(heapSizeLimitBytes);
	const heapWarningBytes = hasHeapLimit ? Math.min(Math.floor(heapSizeLimitBytes * DEFAULT_HEAP_WARNING_RATIO), DEFAULT_HEAP_WARNING_MAX_BYTES) : DEFAULT_HEAP_WARNING_BYTES;
	const heapCriticalBytes = hasHeapLimit ? Math.min(Math.floor(heapSizeLimitBytes * DEFAULT_HEAP_CRITICAL_RATIO), DEFAULT_HEAP_CRITICAL_MAX_BYTES) : DEFAULT_HEAP_CRITICAL_BYTES;
	const usableProcessMemoryLimitBytes = resolveProcessMemoryLimitBytes(processMemoryLimitBytes, physicalMemoryBytes);
	const hasProcessMemoryLimit = usableProcessMemoryLimitBytes !== void 0;
	const useBunRssCaps = isBunRuntime && hasProcessMemoryLimit;
	const useHeapForRss = !isBunRuntime && hasHeapLimit;
	const rssWarningBase = useBunRssCaps ? DEFAULT_HEAP_WARNING_MAX_BYTES : useHeapForRss ? heapWarningBytes : DEFAULT_RSS_WARNING_BYTES;
	const rssCriticalBase = useBunRssCaps ? DEFAULT_HEAP_CRITICAL_MAX_BYTES : useHeapForRss ? heapCriticalBytes : DEFAULT_RSS_CRITICAL_BYTES;
	const processWarningBytes = hasProcessMemoryLimit ? Math.floor(usableProcessMemoryLimitBytes * DEFAULT_HEAP_WARNING_RATIO) : rssWarningBase;
	const processCriticalBytes = hasProcessMemoryLimit ? Math.floor(usableProcessMemoryLimitBytes * DEFAULT_HEAP_CRITICAL_RATIO) : rssCriticalBase;
	return {
		rssWarningBytes: thresholds?.rssWarningBytes ?? Math.min(rssWarningBase, processWarningBytes),
		rssCriticalBytes: thresholds?.rssCriticalBytes ?? Math.min(rssCriticalBase, processCriticalBytes),
		heapUsedWarningBytes: thresholds?.heapUsedWarningBytes ?? heapWarningBytes,
		heapUsedCriticalBytes: thresholds?.heapUsedCriticalBytes ?? heapCriticalBytes,
		rssGrowthWarningBytes: thresholds?.rssGrowthWarningBytes ?? DEFAULT_RSS_GROWTH_WARNING_BYTES,
		rssGrowthCriticalBytes: thresholds?.rssGrowthCriticalBytes ?? DEFAULT_RSS_GROWTH_CRITICAL_BYTES,
		growthWindowMs: thresholds?.growthWindowMs ?? DEFAULT_GROWTH_WINDOW_MS,
		pressureRepeatMs: thresholds?.pressureRepeatMs ?? DEFAULT_PRESSURE_REPEAT_MS
	};
}
function pickThresholdPressure(params) {
	const { memory, thresholds } = params;
	if (memory.rssBytes >= thresholds.rssCriticalBytes) return {
		level: "critical",
		reason: "rss_threshold",
		memory,
		thresholdBytes: thresholds.rssCriticalBytes
	};
	if (memory.heapUsedBytes >= thresholds.heapUsedCriticalBytes) return {
		level: "critical",
		reason: "heap_threshold",
		memory,
		thresholdBytes: thresholds.heapUsedCriticalBytes
	};
	if (memory.rssBytes >= thresholds.rssWarningBytes) return {
		level: "warning",
		reason: "rss_threshold",
		memory,
		thresholdBytes: thresholds.rssWarningBytes
	};
	if (memory.heapUsedBytes >= thresholds.heapUsedWarningBytes) return {
		level: "warning",
		reason: "heap_threshold",
		memory,
		thresholdBytes: thresholds.heapUsedWarningBytes
	};
	return null;
}
function pickGrowthPressure(params) {
	const { previous, current, thresholds } = params;
	if (!previous) return null;
	const windowMs = current.ts - previous.ts;
	if (windowMs <= 0 || windowMs > thresholds.growthWindowMs) return null;
	const rssGrowthBytes = current.memory.rssBytes - previous.memory.rssBytes;
	if (rssGrowthBytes >= thresholds.rssGrowthCriticalBytes) return {
		level: "critical",
		reason: "rss_growth",
		memory: current.memory,
		thresholdBytes: thresholds.rssGrowthCriticalBytes,
		rssGrowthBytes,
		windowMs
	};
	if (rssGrowthBytes >= thresholds.rssGrowthWarningBytes) return {
		level: "warning",
		reason: "rss_growth",
		memory: current.memory,
		thresholdBytes: thresholds.rssGrowthWarningBytes,
		rssGrowthBytes,
		windowMs
	};
	return null;
}
function shouldEmitPressure(pressure, now, repeatMs) {
	const key = `${pressure.level}:${pressure.reason}`;
	const lastAt = state.lastPressureAtByKey.get(key);
	if (lastAt !== void 0 && now - lastAt < repeatMs) return false;
	state.lastPressureAtByKey.set(key, now);
	return true;
}
function formatOptionalPressureMetric(label, value) {
	return typeof value === "number" && Number.isFinite(value) ? ` ${label}=${value}` : "";
}
function formatScaledNumber(value) {
	return (value >= 10 ? value.toFixed(1) : value.toFixed(2)).replace(/\.0+$/u, "").replace(/(\.\d*[1-9])0$/u, "$1");
}
function formatReadableBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	let scaled = value;
	let unitIndex = 0;
	while (scaled >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
		scaled /= 1024;
		unitIndex++;
	}
	return unitIndex === 0 ? `${Math.round(scaled)} ${BYTE_UNITS[unitIndex]}` : `${formatScaledNumber(scaled)} ${BYTE_UNITS[unitIndex]}`;
}
function formatPressureRatio(params) {
	const { pressure, thresholdBytes } = params;
	if (!Number.isFinite(thresholdBytes) || thresholdBytes <= 0) return;
	const value = pressure.reason === "heap_threshold" ? pressure.memory.heapUsedBytes : pressure.reason === "rss_growth" ? pressure.rssGrowthBytes : pressure.memory.rssBytes;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return `${formatScaledNumber(value / thresholdBytes * 100)}%`;
}
function formatPressureSummary(pressure) {
	return [
		`rss=${formatReadableBytes(pressure.memory.rssBytes)}`,
		`heap=${formatReadableBytes(pressure.memory.heapUsedBytes)}`,
		pressure.thresholdBytes !== void 0 ? `threshold=${formatReadableBytes(pressure.thresholdBytes)}` : "",
		pressure.thresholdBytes !== void 0 ? `thresholdRatio=${formatPressureRatio({
			pressure,
			thresholdBytes: pressure.thresholdBytes
		})}` : "",
		pressure.rssGrowthBytes !== void 0 ? `rssGrowth=${formatReadableBytes(pressure.rssGrowthBytes)}` : ""
	].filter((part) => Boolean(part)).join(" ");
}
function formatPressureNextStep(pressure) {
	return pressure.level === "critical" ? "nextStep=inspect latest stability bundle or run openclaw gateway diagnostics export; restart gateway if process is unstable" : "nextStep=run openclaw gateway status --deep and openclaw gateway diagnostics export; restart gateway if pressure persists";
}
function logMemoryPressure(pressure) {
	const message = `memory pressure: level=${pressure.level} reason=${pressure.reason} ${formatPressureSummary(pressure)} rssBytes=${pressure.memory.rssBytes} heapUsedBytes=${pressure.memory.heapUsedBytes}` + formatOptionalPressureMetric("thresholdBytes", pressure.thresholdBytes) + formatOptionalPressureMetric("rssGrowthBytes", pressure.rssGrowthBytes) + formatOptionalPressureMetric("windowMs", pressure.windowMs) + (pressure.level === "critical" ? " memoryPressureSnapshot=disabled" : "") + ` ${formatPressureNextStep(pressure)}`;
	log.warn(message);
}
function emitDiagnosticMemorySample(options) {
	const now = options?.now ?? Date.now();
	const memory = normalizeMemoryUsage(options?.memoryUsage ?? process.memoryUsage());
	const current = {
		ts: now,
		memory
	};
	const thresholds = resolveThresholds(options?.thresholds, options?.heapSizeLimitBytes ?? DEFAULT_HEAP_SIZE_LIMIT_BYTES, options?.processMemoryLimitBytes ?? DEFAULT_PROCESS_MEMORY_LIMIT_BYTES, options?.physicalMemoryBytes ?? DEFAULT_PHYSICAL_MEMORY_BYTES, options?.isBunRuntime ?? DEFAULT_IS_BUN_RUNTIME);
	if (options?.emitSample !== false) emitInternalDiagnosticEvent({
		type: "diagnostic.memory.sample",
		memory,
		uptimeMs: options?.uptimeMs ?? Math.round(process.uptime() * 1e3)
	});
	const pressure = pickThresholdPressure({
		memory,
		thresholds
	}) ?? pickGrowthPressure({
		previous: state.lastSample,
		current,
		thresholds
	});
	state.lastSample = current;
	if (pressure && shouldEmitPressure(pressure, now, thresholds.pressureRepeatMs)) {
		emitInternalDiagnosticEvent({
			type: "diagnostic.memory.pressure",
			...pressure
		});
		logMemoryPressure(pressure);
		if (pressure.level === "critical") log.warn("critical memory pressure snapshot disabled");
	}
	return memory;
}
/** Clears process-local memory diagnostic state for isolated tests. */
function resetDiagnosticMemoryForTest() {
	state.lastSample = null;
	state.lastPressureAtByKey.clear();
}
//#endregion
//#region src/logging/diagnostic-session-attention.ts
function classifySessionAttention(params) {
	if (params.activity.activeWorkKind) {
		const lastProgressAgeMs = params.activity.lastProgressAgeMs ?? 0;
		if (params.activity.hasActiveEmbeddedRun === true && typeof params.stuckSessionAbortMs === "number" && (params.activity.repeatedRequestNoProgressAgeMs ?? 0) >= params.stuckSessionAbortMs) return {
			eventType: "session.stalled",
			reason: "repeated_model_requests_without_progress",
			classification: "stalled_agent_run",
			activeWorkKind: params.activity.activeWorkKind,
			recoveryEligible: false
		};
		if (params.state === "idle" && params.queueDepth > 0 && params.activity.hasActiveEmbeddedRun !== true && lastProgressAgeMs > params.staleMs) return {
			eventType: "session.stuck",
			reason: "queued_work_without_active_run",
			classification: "stale_session_state",
			recoveryEligible: true
		};
		if (params.activity.activeWorkKind === "tool_call" && (params.activity.activeToolAgeMs ?? 0) > params.staleMs && lastProgressAgeMs > params.staleMs) return {
			eventType: "session.stalled",
			reason: "blocked_tool_call",
			classification: "blocked_tool_call",
			activeWorkKind: params.activity.activeWorkKind,
			recoveryEligible: false
		};
		if (params.queueDepth > 0 && params.activity.activeWorkKind === "embedded_run" && isTerminalDiagnosticProgressReason(params.activity.lastProgressReason)) return {
			eventType: "session.stalled",
			reason: "queued_behind_terminal_active_work",
			classification: "stalled_agent_run",
			activeWorkKind: params.activity.activeWorkKind,
			recoveryEligible: false
		};
		if (params.activity.activeWorkKind === "model_call" && params.activity.hasActiveEmbeddedRun === true && lastProgressAgeMs > params.staleMs) {
			if (typeof params.stuckSessionAbortMs === "number" && lastProgressAgeMs >= params.stuckSessionAbortMs) return {
				eventType: "session.stalled",
				reason: "active_work_without_progress",
				classification: "stalled_agent_run",
				activeWorkKind: params.activity.activeWorkKind,
				recoveryEligible: false
			};
			return {
				eventType: "session.long_running",
				reason: "active_model_call_without_progress",
				classification: "long_running",
				activeWorkKind: params.activity.activeWorkKind,
				recoveryEligible: false
			};
		}
		if (lastProgressAgeMs > params.staleMs) return {
			eventType: "session.stalled",
			reason: "active_work_without_progress",
			classification: "stalled_agent_run",
			activeWorkKind: params.activity.activeWorkKind,
			recoveryEligible: false
		};
		return {
			eventType: "session.long_running",
			reason: params.queueDepth > 0 ? "queued_behind_active_work" : "active_work",
			classification: "long_running",
			activeWorkKind: params.activity.activeWorkKind,
			recoveryEligible: false
		};
	}
	return {
		eventType: "session.stuck",
		reason: params.queueDepth > 0 ? "queued_work_without_active_run" : "stale_session_state",
		classification: "stale_session_state",
		recoveryEligible: true
	};
}
function isTerminalDiagnosticProgressReason(reason) {
	if (!reason) return false;
	return reason === "run:completed" || reason === "embedded_run:ended" || reason.includes("response.completed") || reason.includes("rawResponseItem/completed") || reason.includes("raw_response_item.completed") || reason.includes("output_item.done");
}
//#endregion
//#region src/logging/diagnostic-session-context.ts
const MAX_QUOTED_FIELD_CHARS = 140;
function quoteLogField(value) {
	const oneLine = value.replace(/\s+/g, " ").trim();
	return `"${(oneLine.length > MAX_QUOTED_FIELD_CHARS ? `${truncateUtf16Safe(oneLine, Math.max(0, MAX_QUOTED_FIELD_CHARS - 3))}...` : oneLine).replace(/["\\]/g, "\\$&")}"`;
}
function parseCronRunSessionKey(parsed) {
	const parts = parsed.rest.split(":");
	if (parts[0] !== "cron" || !parts[1]) return {};
	const runIndex = parts.indexOf("run", 2);
	return {
		cronJobId: parts[1],
		cronRunId: runIndex >= 0 ? parts[runIndex + 1] : void 0
	};
}
function readCronJobName(cronJobId) {
	if (!cronJobId) return;
	try {
		const job = loadCronJobsStoreSync(resolveCronJobsStorePath()).jobs.find((entry) => entry.id === cronJobId);
		return typeof job?.name === "string" && job.name.trim() ? job.name.trim() : void 0;
	} catch {
		return;
	}
}
function resolveCronSessionDiagnosticContext(params) {
	const sessionKey = params.sessionKey?.trim();
	if (isIncognitoSessionKey(sessionKey)) return {};
	const parsedAgent = parseAgentSessionKey(sessionKey);
	if (!sessionKey || !parsedAgent || !isValidAgentId(parsedAgent.agentId)) return {};
	const cron = parseCronRunSessionKey(parsedAgent);
	const context = {
		agentId: parsedAgent.agentId,
		...cron,
		...cron.cronJobId ? { cronJobName: readCronJobName(cron.cronJobId) } : {}
	};
	const activeSessionId = params.activeSessionId?.trim();
	if (!activeSessionId) return context;
	try {
		const sessionScope = {
			agentId: parsedAgent.agentId,
			sessionKey
		};
		if (loadSessionEntryReadOnly(sessionScope)?.sessionId === activeSessionId) context.lastAssistant = loadLatestAssistantText({
			...sessionScope,
			sessionId: activeSessionId
		})?.text;
	} catch {}
	return context;
}
function formatCronSessionDiagnosticFields(context) {
	const fields = [];
	if (context.cronJobId) fields.push(`cronJobId=${context.cronJobId}`);
	if (context.cronRunId) fields.push(`cronRunId=${context.cronRunId}`);
	if (context.cronJobName) fields.push(`cronJob=${quoteLogField(context.cronJobName)}`);
	if (context.lastAssistant) fields.push(`lastAssistant=${quoteLogField(context.lastAssistant)}`);
	return fields.join(" ");
}
function formatStoppedCronSessionDiagnosticFields(context) {
	const fields = [];
	if (context.cronJobName) fields.push(`stopped=${quoteLogField(context.cronJobName)}`);
	const rest = formatCronSessionDiagnosticFields({
		cronJobId: context.cronJobId,
		cronRunId: context.cronRunId,
		lastAssistant: context.lastAssistant
	});
	if (rest) fields.push(rest);
	return fields.join(" ");
}
//#endregion
//#region src/logging/diagnostic-session-recovery.ts
function resolveStuckSessionRecoveryRef(params) {
	return params.sessionKey?.trim() || params.sessionId?.trim() || void 0;
}
function recoveryOutcomeClearsQueuedSessionState(outcome) {
	return (outcome.status === "released" || outcome.status === "aborted" && outcome.released > 0) && (outcome.queuedCount ?? 0) === 0;
}
function formatRecoveryOutcome(outcome) {
	const fields = [
		`status=${outcome.status}`,
		`action=${outcome.action}`,
		`sessionId=${outcome.sessionId ?? outcome.activeSessionId ?? "unknown"}`,
		`sessionKey=${outcome.sessionKey ?? "unknown"}`
	];
	if (outcome.activeSessionId) fields.push(`activeSessionId=${outcome.activeSessionId}`);
	if (outcome.activeWorkKind) fields.push(`activeWorkKind=${outcome.activeWorkKind}`);
	if (outcome.lane) fields.push(`lane=${outcome.lane}`);
	if ("reason" in outcome) fields.push(`reason=${outcome.reason}`);
	if ("aborted" in outcome) fields.push(`aborted=${outcome.aborted}`, `drained=${outcome.drained}`, `forceCleared=${outcome.forceCleared}`);
	if ("released" in outcome) fields.push(`released=${outcome.released}`);
	if ((outcome.status === "aborted" || outcome.status === "released") && outcome.queuedCount !== void 0) fields.push(`queuedCount=${outcome.queuedCount}`);
	if ("activeCount" in outcome && outcome.activeCount !== void 0) fields.push(`laneActive=${outcome.activeCount}`);
	if (outcome.status === "skipped" && outcome.queuedCount !== void 0) fields.push(`laneQueued=${outcome.queuedCount}`);
	if ("error" in outcome) fields.push(`error=${outcome.error}`);
	return fields.join(" ");
}
//#endregion
//#region src/logging/diagnostic-session-recovery-coordinator.ts
const recoveryRequestsInFlight = /* @__PURE__ */ new Set();
function emitSessionRecoveryRequested(params) {
	emitInternalDiagnosticEvent({
		type: "session.recovery.requested",
		sessionId: params.request.sessionId,
		sessionKey: params.request.sessionKey,
		state: params.request.expectedState ?? "processing",
		stateGeneration: params.request.stateGeneration,
		ageMs: params.request.ageMs,
		queueDepth: params.request.queueDepth,
		reason: params.classification.reason,
		activeWorkKind: params.classification.activeWorkKind,
		allowActiveAbort: params.request.allowActiveAbort
	});
}
function emitSessionRecoveryCompleted(params) {
	emitInternalDiagnosticEvent({
		type: "session.recovery.completed",
		sessionId: params.request.sessionId,
		sessionKey: params.request.sessionKey,
		state: params.request.expectedState ?? "processing",
		stateGeneration: params.request.stateGeneration,
		ageMs: params.request.ageMs,
		queueDepth: params.request.queueDepth,
		activeWorkKind: params.outcome.activeWorkKind,
		status: params.outcome.status,
		action: params.outcome.action,
		outcomeReason: "reason" in params.outcome ? params.outcome.reason : void 0,
		released: "released" in params.outcome ? params.outcome.released || void 0 : void 0,
		stale: params.stale
	});
}
function isRecoveryPromiseLike(value) {
	return typeof value?.then === "function";
}
function applyRecoveryOutcomeToDiagnosticState(params) {
	if (!params.outcome) return;
	if (params.outcome.status !== "aborted" && params.outcome.status !== "released") {
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome: params.outcome
		});
		return;
	}
	const expectedState = params.request.expectedState ?? "processing";
	const currentState = peekDiagnosticSessionState(params.request);
	const currentGeneration = currentState?.generation ?? 0;
	const requestGeneration = params.request.stateGeneration ?? 0;
	if (!(expectedState === "idle" && params.request.stateGeneration !== void 0 && params.outcome.action === "abort_embedded_run" ? currentState?.state === "idle" && (currentGeneration === requestGeneration || currentGeneration === requestGeneration + 1) : isDiagnosticSessionStateCurrent({
		sessionId: params.request.sessionId,
		sessionKey: params.request.sessionKey,
		generation: params.request.stateGeneration,
		state: expectedState
	}))) {
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome: params.outcome,
			stale: true
		});
		return;
	}
	const state = getDiagnosticSessionState(params.request);
	if (clearDiagnosticEmbeddedRunActivityForSession({
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		activeSessionId: params.outcome.activeSessionId,
		recoveryStartedAfterEmbeddedRunSequence: params.recoveryStartedAfterEmbeddedRunSequence,
		recoveryStartedAfterDiagnosticEventSequence: params.recoveryStartedAfterDiagnosticEventSequence
	}).blockedByActiveEmbeddedRun) {
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome: params.outcome,
			stale: true
		});
		return;
	}
	const prevState = state.state;
	state.state = "idle";
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	const preserveQueuedIdleWork = params.request.expectedState === "idle" && (params.outcome.queuedCount ?? 0) > 0;
	state.queueDepth = recoveryOutcomeClearsQueuedSessionState(params.outcome) ? 0 : preserveQueuedIdleWork ? Math.max(state.queueDepth, params.request.queueDepth ?? 0) : Math.max(0, state.queueDepth - 1);
	emitInternalDiagnosticEvent({
		type: "session.state",
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		prevState,
		state: "idle",
		reason: `stuck_recovery:${params.outcome.status}`,
		queueDepth: state.queueDepth
	});
	emitSessionRecoveryCompleted({
		request: params.request,
		outcome: params.outcome
	});
	markDiagnosticActivity();
}
function requestStuckSessionRecoveryOutcome(params) {
	const inFlightKey = resolveStuckSessionRecoveryRef(params.request);
	if (inFlightKey && recoveryRequestsInFlight.has(inFlightKey)) {
		const outcome = {
			status: "skipped",
			action: "observe_only",
			reason: "already_in_flight",
			sessionId: params.request.sessionId,
			sessionKey: params.request.sessionKey,
			activeWorkKind: params.classification.activeWorkKind
		};
		emitSessionRecoveryCompleted({
			request: params.request,
			outcome
		});
		return Promise.resolve(outcome);
	}
	if (inFlightKey) recoveryRequestsInFlight.add(inFlightKey);
	emitSessionRecoveryRequested({
		request: params.request,
		classification: params.classification
	});
	const recoveryStartedAfterEmbeddedRunSequence = getDiagnosticEmbeddedRunActivitySequence();
	const recoveryStartedAfterDiagnosticEventSequence = getInternalDiagnosticEventSequence();
	const clearInFlight = () => {
		if (inFlightKey) recoveryRequestsInFlight.delete(inFlightKey);
	};
	const completeRecovery = (outcome) => {
		applyRecoveryOutcomeToDiagnosticState({
			request: params.request,
			outcome,
			recoveryStartedAfterEmbeddedRunSequence,
			recoveryStartedAfterDiagnosticEventSequence
		});
		return outcome;
	};
	const failRecovery = (err) => {
		const outcome = {
			status: "failed",
			action: "none",
			reason: "exception",
			sessionId: params.request.sessionId,
			sessionKey: params.request.sessionKey,
			error: String(err)
		};
		applyRecoveryOutcomeToDiagnosticState({
			request: params.request,
			outcome,
			recoveryStartedAfterEmbeddedRunSequence,
			recoveryStartedAfterDiagnosticEventSequence
		});
		return outcome;
	};
	try {
		const result = params.recover(params.request);
		if (isRecoveryPromiseLike(result)) return result.then((outcome) => completeRecovery(outcome ?? void 0)).catch(failRecovery).finally(clearInFlight);
		const outcome = completeRecovery(result ?? void 0);
		clearInFlight();
		return Promise.resolve(outcome);
	} catch (err) {
		try {
			return Promise.resolve(failRecovery(err));
		} finally {
			clearInFlight();
		}
	}
}
function requestStuckSessionRecovery(params) {
	requestStuckSessionRecoveryOutcome(params);
}
function resetDiagnosticSessionRecoveryCoordinatorForTest() {
	recoveryRequestsInFlight.clear();
}
//#endregion
//#region src/logging/diagnostic.ts
const webhookStats = {
	received: 0,
	processed: 0,
	errors: 0,
	lastReceived: 0
};
const DEFAULT_STUCK_SESSION_WARN_MS = 12e4;
const MIN_STALLED_EMBEDDED_RUN_ABORT_MS = 5 * 6e4;
const STALLED_EMBEDDED_RUN_ABORT_WARN_MULTIPLIER = 3;
const RECENT_DIAGNOSTIC_ACTIVITY_MS = 12e4;
const DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS = 1e3;
const DEFAULT_LIVENESS_EVENT_LOOP_UTILIZATION_WARN = .95;
const DEFAULT_LIVENESS_CPU_CORE_RATIO_WARN = .9;
const DEFAULT_LIVENESS_WARN_COOLDOWN_MS = 12e4;
const DIAGNOSTIC_HEARTBEAT_INTERVAL_MS = 3e4;
const loadStuckSessionRecoveryRuntime = createLazyRuntimeModule(() => import("./diagnostic-stuck-session-recovery.runtime.js"));
let diagnosticLivenessMonitor = null;
let lastDiagnosticLivenessWallAt = 0;
let lastDiagnosticLivenessCpuUsage = null;
let lastDiagnosticLivenessEventLoopUtilization = null;
let lastDiagnosticLivenessEventAt = 0;
let lastDiagnosticLivenessWarnAt = 0;
const loadCommandPollBackoffRuntime = createLazyRuntimeModule(() => import("./command-poll-backoff.runtime.js"));
async function recoverStuckSession(params) {
	return loadStuckSessionRecoveryRuntime().then(({ recoverStuckDiagnosticSession }) => recoverStuckDiagnosticSession(params)).catch((err) => {
		diagnosticLogger.warn(`stuck session recovery unavailable: ${String(err)}`);
		return {
			status: "failed",
			action: "none",
			reason: "exception",
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			error: String(err)
		};
	});
}
function formatDiagnosticWorkLabel(state, now) {
	const label = state.sessionKey ?? state.sessionId ?? "unknown";
	const ageSeconds = Math.round(Math.max(0, now - state.lastActivity) / 1e3);
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: state.sessionId,
		sessionKey: state.sessionKey
	}, now);
	const workKind = activity.activeWorkKind ? `/${activity.activeWorkKind}` : "";
	const lastProgress = activity.lastProgressReason ? ` last=${activity.lastProgressReason}` : "";
	return `${label}(${state.state}${workKind},q=${state.queueDepth},age=${ageSeconds}s${lastProgress})`;
}
function pushLimitedDiagnosticLabel(labels, label, limit = 5) {
	if (labels.length < limit) labels.push(label);
}
function resolveDiagnosticQueuedBacklog(state) {
	return Math.max(0, state.queueDepth - (state.state === "processing" && state.activeQueuedTurn ? 1 : 0));
}
function getDiagnosticWorkSnapshot(now = Date.now()) {
	let activeCount = 0;
	let waitingCount = 0;
	let queuedCount = 0;
	const activeLabels = [];
	const waitingLabels = [];
	const queuedLabels = [];
	for (const state of diagnosticSessionStates.values()) {
		if (state.state === "processing") {
			activeCount += 1;
			pushLimitedDiagnosticLabel(activeLabels, formatDiagnosticWorkLabel(state, now));
		} else if (state.state === "waiting") {
			waitingCount += 1;
			pushLimitedDiagnosticLabel(waitingLabels, formatDiagnosticWorkLabel(state, now));
		}
		const queuedBacklog = resolveDiagnosticQueuedBacklog(state);
		if (queuedBacklog > 0) pushLimitedDiagnosticLabel(queuedLabels, formatDiagnosticWorkLabel(state, now));
		queuedCount += queuedBacklog;
	}
	return {
		activeCount,
		waitingCount,
		queuedCount,
		activeLabels,
		waitingLabels,
		queuedLabels
	};
}
function hasOpenDiagnosticWork(snapshot) {
	return snapshot.activeCount > 0 || snapshot.waitingCount > 0 || snapshot.queuedCount > 0;
}
function hasRecentDiagnosticActivity(now) {
	const lastActivityAt = getLastDiagnosticActivityAt();
	return lastActivityAt > 0 && now - lastActivityAt <= RECENT_DIAGNOSTIC_ACTIVITY_MS;
}
function roundDiagnosticMetric(value, digits = 3) {
	if (!Number.isFinite(value)) return 0;
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}
function nanosecondsToMilliseconds(value) {
	return roundDiagnosticMetric(value / 1e6, 1);
}
function formatOptionalDiagnosticMetric(value) {
	return value === void 0 ? "unknown" : String(value);
}
function startDiagnosticLivenessSampler() {
	lastDiagnosticLivenessWallAt = Date.now();
	lastDiagnosticLivenessCpuUsage = process.cpuUsage();
	lastDiagnosticLivenessEventLoopUtilization = performance.eventLoopUtilization();
	lastDiagnosticLivenessEventAt = 0;
	lastDiagnosticLivenessWarnAt = 0;
	if (diagnosticLivenessMonitor) {
		diagnosticLivenessMonitor.reset();
		return;
	}
	try {
		diagnosticLivenessMonitor = monitorEventLoopDelay({ resolution: 20 });
		diagnosticLivenessMonitor.enable();
		diagnosticLivenessMonitor.reset();
	} catch (err) {
		diagnosticLivenessMonitor = null;
		diagnosticLogger.debug(`diagnostic liveness monitor unavailable: ${String(err)}`);
	}
}
function stopDiagnosticLivenessSampler() {
	diagnosticLivenessMonitor?.disable();
	diagnosticLivenessMonitor = null;
	lastDiagnosticLivenessWallAt = 0;
	lastDiagnosticLivenessCpuUsage = null;
	lastDiagnosticLivenessEventLoopUtilization = null;
	lastDiagnosticLivenessEventAt = 0;
	lastDiagnosticLivenessWarnAt = 0;
}
function sampleDiagnosticLiveness(now) {
	if (!diagnosticLivenessMonitor || !lastDiagnosticLivenessCpuUsage || !lastDiagnosticLivenessEventLoopUtilization || lastDiagnosticLivenessWallAt <= 0) {
		startDiagnosticLivenessSampler();
		return null;
	}
	const intervalMs = Math.max(1, now - lastDiagnosticLivenessWallAt);
	const cpuUsage = process.cpuUsage(lastDiagnosticLivenessCpuUsage);
	const currentEventLoopUtilization = performance.eventLoopUtilization();
	const eventLoopUtilization = performance.eventLoopUtilization(currentEventLoopUtilization, lastDiagnosticLivenessEventLoopUtilization).utilization;
	const eventLoopDelayP99Ms = nanosecondsToMilliseconds(diagnosticLivenessMonitor.percentile(99));
	const eventLoopDelayMaxMs = nanosecondsToMilliseconds(diagnosticLivenessMonitor.max);
	diagnosticLivenessMonitor.reset();
	lastDiagnosticLivenessWallAt = now;
	lastDiagnosticLivenessCpuUsage = process.cpuUsage();
	lastDiagnosticLivenessEventLoopUtilization = currentEventLoopUtilization;
	const cpuUserMs = roundDiagnosticMetric(cpuUsage.user / 1e3, 1);
	const cpuSystemMs = roundDiagnosticMetric(cpuUsage.system / 1e3, 1);
	const cpuTotalMs = roundDiagnosticMetric(cpuUserMs + cpuSystemMs, 1);
	const cpuCoreRatio = roundDiagnosticMetric(cpuTotalMs / intervalMs, 3);
	const eventLoopUtilizationRatio = roundDiagnosticMetric(eventLoopUtilization, 3);
	const reasons = [];
	if (eventLoopDelayP99Ms >= DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS || eventLoopDelayMaxMs >= DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS) reasons.push("event_loop_delay");
	if (eventLoopUtilizationRatio >= DEFAULT_LIVENESS_EVENT_LOOP_UTILIZATION_WARN) reasons.push("event_loop_utilization");
	if (cpuCoreRatio >= DEFAULT_LIVENESS_CPU_CORE_RATIO_WARN) reasons.push("cpu");
	if (reasons.length === 0) return null;
	return {
		reasons,
		intervalMs,
		eventLoopDelayP99Ms,
		eventLoopDelayMaxMs,
		eventLoopUtilization: eventLoopUtilizationRatio,
		cpuUserMs,
		cpuSystemMs,
		cpuTotalMs,
		cpuCoreRatio
	};
}
function shouldEmitDiagnosticLivenessEvent(now) {
	if (lastDiagnosticLivenessEventAt > 0 && now - lastDiagnosticLivenessEventAt < DEFAULT_LIVENESS_WARN_COOLDOWN_MS) return false;
	lastDiagnosticLivenessEventAt = now;
	return true;
}
function shouldEmitDiagnosticLivenessWarning(now, work) {
	if (!hasOpenDiagnosticWork(work)) return false;
	if (lastDiagnosticLivenessWarnAt > 0 && now - lastDiagnosticLivenessWarnAt < DEFAULT_LIVENESS_WARN_COOLDOWN_MS) return false;
	lastDiagnosticLivenessWarnAt = now;
	return true;
}
function emitDiagnosticLivenessWarning(sample, work, now) {
	const phase = getCurrentDiagnosticPhase();
	const recentPhases = getRecentDiagnosticPhases(6, { completedAfter: now - Math.max(0, sample.intervalMs) });
	const recentPhaseSummary = formatRecentDiagnosticPhases(recentPhases);
	const workLabelSummary = formatDiagnosticWorkLabels(work);
	const message = `liveness warning: reasons=${sample.reasons.join(",")} interval=${Math.round(sample.intervalMs / 1e3)}s${sample.degradedSinceMs === void 0 ? "" : ` degradedFor=${Math.round(sample.degradedSinceMs / 1e3)}s`} eventLoopDelayP99Ms=${formatOptionalDiagnosticMetric(sample.eventLoopDelayP99Ms)} eventLoopDelayMaxMs=${formatOptionalDiagnosticMetric(sample.eventLoopDelayMaxMs)} eventLoopUtilization=${formatOptionalDiagnosticMetric(sample.eventLoopUtilization)} cpuCoreRatio=${formatOptionalDiagnosticMetric(sample.cpuCoreRatio)} active=${work.activeCount} waiting=${work.waitingCount} queued=${work.queuedCount}${phase ? ` phase=${phase}` : ""}${recentPhaseSummary ? ` recentPhases=${recentPhaseSummary}` : ""}${workLabelSummary ? ` work=[${workLabelSummary}]` : ""}`;
	const hasBlockingWork = work.waitingCount > 0 || work.queuedCount > 0;
	const hasPersistentDegradation = sample.degradedSinceMs !== void 0;
	const hasSustainedEventLoopDelay = (sample.eventLoopDelayP99Ms ?? 0) >= DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS;
	if (hasPersistentDegradation || hasBlockingWork || hasOpenDiagnosticWork(work) && hasSustainedEventLoopDelay) diagnosticLogger.warn(message);
	else diagnosticLogger.debug(message);
	emitInternalDiagnosticEvent({
		type: "diagnostic.liveness.warning",
		reasons: sample.reasons,
		intervalMs: sample.intervalMs,
		degradedSinceMs: sample.degradedSinceMs,
		eventLoopDelayP99Ms: sample.eventLoopDelayP99Ms,
		eventLoopDelayMaxMs: sample.eventLoopDelayMaxMs,
		eventLoopUtilization: sample.eventLoopUtilization,
		cpuUserMs: sample.cpuUserMs,
		cpuSystemMs: sample.cpuSystemMs,
		cpuTotalMs: sample.cpuTotalMs,
		cpuCoreRatio: sample.cpuCoreRatio,
		active: work.activeCount,
		waiting: work.waitingCount,
		queued: work.queuedCount,
		phase,
		recentPhases,
		activeWorkLabels: work.activeLabels,
		waitingWorkLabels: work.waitingLabels,
		queuedWorkLabels: work.queuedLabels
	});
	markDiagnosticActivity();
}
function formatRecentDiagnosticPhases(phases) {
	return phases.map((phase) => `${phase.name}:${Math.round(phase.durationMs ?? 0)}ms`).join(",");
}
function formatDiagnosticWorkLabels(work) {
	return [
		work.activeLabels.length > 0 ? `active=${work.activeLabels.join("|")}` : "",
		work.waitingLabels.length > 0 ? `waiting=${work.waitingLabels.join("|")}` : "",
		work.queuedLabels.length > 0 ? `queued=${work.queuedLabels.join("|")}` : ""
	].filter(Boolean).join(" ");
}
function resolveStuckSessionWarnMs() {
	return DEFAULT_STUCK_SESSION_WARN_MS;
}
function resolveStuckSessionAbortMs(stuckSessionWarnMs) {
	return resolveStalledEmbeddedRunAbortMs(stuckSessionWarnMs);
}
function resolveStalledEmbeddedRunAbortMs(stuckSessionWarnMs) {
	return Math.max(MIN_STALLED_EMBEDDED_RUN_ABORT_MS, stuckSessionWarnMs * STALLED_EMBEDDED_RUN_ABORT_WARN_MULTIPLIER);
}
function isStalledEmbeddedRunRecoveryEligible(params) {
	const lastProgressAgeMs = params.activity?.lastProgressAgeMs;
	return params.classification?.eventType === "session.stalled" && params.classification.classification === "stalled_agent_run" && params.classification.activeWorkKind === "embedded_run" && typeof lastProgressAgeMs === "number" && lastProgressAgeMs >= params.stuckSessionAbortMs;
}
function isBlockedToolCallRecoveryEligible(params) {
	const toolAgeMs = params.activity?.activeToolAgeMs;
	const lastProgressAgeMs = params.activity?.lastProgressAgeMs;
	const abortMs = Math.max(params.stuckSessionAbortMs, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS);
	return params.classification?.eventType === "session.stalled" && params.classification.classification === "blocked_tool_call" && params.classification.activeWorkKind === "tool_call" && typeof toolAgeMs === "number" && typeof lastProgressAgeMs === "number" && toolAgeMs >= abortMs && lastProgressAgeMs >= abortMs;
}
function isStalledModelCallRecoveryEligible(params) {
	const lastProgressAgeMs = params.activity?.lastProgressAgeMs;
	const effectiveAbortMs = Math.max(params.stuckSessionAbortMs, params.activity?.activeModelCallRequestTimeoutMs ?? 0);
	return params.classification?.eventType === "session.stalled" && params.classification.classification === "stalled_agent_run" && params.classification.activeWorkKind === "model_call" && typeof lastProgressAgeMs === "number" && lastProgressAgeMs >= effectiveAbortMs;
}
function isActiveAbortRecoveryEligible(params) {
	const effectiveModelAbortMs = Math.max(params.stuckSessionAbortMs, params.activity?.activeModelCallRequestTimeoutMs ?? 0);
	const activeModelCallRequestTimeoutMs = params.activity?.activeModelCallRequestTimeoutMs;
	const activeModelCallAllowanceExpired = activeModelCallRequestTimeoutMs === void 0 || (params.activity?.lastProgressAgeMs ?? 0) >= activeModelCallRequestTimeoutMs;
	return params.classification?.eventType === "session.stalled" && params.classification.classification === "stalled_agent_run" && params.activity?.hasActiveEmbeddedRun === true && (params.activity.repeatedRequestNoProgressAgeMs ?? 0) >= effectiveModelAbortMs && activeModelCallAllowanceExpired || isStalledEmbeddedRunRecoveryEligible(params) || isBlockedToolCallRecoveryEligible(params) || isStalledModelCallRecoveryEligible(params);
}
function isIdleQueuedRecoverableSessionStall(params) {
	const hasEmbeddedOwner = params.activity.activeWorkKind === "embedded_run" || params.activity.hasActiveEmbeddedRun === true;
	const hasOrphanedActivity = params.activity.activeWorkKind !== void 0 && params.activity.hasActiveEmbeddedRun !== true;
	return params.state.state === "idle" && params.state.queueDepth > 0 && (hasEmbeddedOwner || hasOrphanedActivity) && (params.activity.lastProgressAgeMs ?? 0) > params.staleMs;
}
function logWebhookReceived(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	webhookStats.received += 1;
	webhookStats.lastReceived = Date.now();
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`webhook received: channel=${params.channel} type=${params.updateType ?? "unknown"} chatId=${params.chatId ?? "unknown"} total=${webhookStats.received}`);
	emitInternalDiagnosticEvent({
		type: "webhook.received",
		channel: params.channel,
		updateType: params.updateType,
		chatId: params.chatId
	});
	markDiagnosticActivity();
}
function logWebhookProcessed(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	webhookStats.processed += 1;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`webhook processed: channel=${params.channel} type=${params.updateType ?? "unknown"} chatId=${params.chatId ?? "unknown"} duration=${params.durationMs ?? 0}ms processed=${webhookStats.processed}`);
	emitInternalDiagnosticEvent({
		type: "webhook.processed",
		channel: params.channel,
		updateType: params.updateType,
		chatId: params.chatId,
		durationMs: params.durationMs
	});
	markDiagnosticActivity();
}
function logWebhookError(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	webhookStats.errors += 1;
	diagnosticLogger.error(`webhook error: channel=${params.channel} type=${params.updateType ?? "unknown"} chatId=${params.chatId ?? "unknown"} error="${params.error}" errors=${webhookStats.errors}`);
	emitInternalDiagnosticEvent({
		type: "webhook.error",
		channel: params.channel,
		updateType: params.updateType,
		chatId: params.chatId,
		error: params.error
	});
	markDiagnosticActivity();
}
function logMessageQueued(params) {
	logMessageQueuedWithBacklogPolicy(params, true);
}
function logMessageReceived(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`message received: channel=${params.channel ?? "unknown"} chatId=${params.chatId ?? "unknown"} messageId=${params.messageId ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} source=${params.source}`);
	emitInternalDiagnosticEvent({
		type: "message.received",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		channel: params.channel,
		messageId: params.messageId,
		chatId: params.chatId,
		source: params.source
	});
	markDiagnosticActivity();
}
function logMessageDispatchStarted(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`message dispatch started: channel=${params.channel ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} source=${params.source}`);
	emitInternalDiagnosticEvent({
		type: "message.dispatch.started",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		channel: params.channel,
		source: params.source
	});
	markDiagnosticActivity();
}
function logMessageDispatchCompleted(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled(params.outcome === "error" ? "error" : "debug")) {
		const payload = `message dispatch completed: channel=${params.channel ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} source=${params.source} outcome=${params.outcome} duration=${params.durationMs}ms${params.reason ? ` reason=${params.reason}` : ""}${params.error ? ` error="${params.error}"` : ""}`;
		if (params.outcome === "error") diagnosticLogger.error(payload);
		else diagnosticLogger.debug(payload);
	}
	emitInternalDiagnosticEvent({
		type: "message.dispatch.completed",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		channel: params.channel,
		source: params.source,
		durationMs: params.durationMs,
		outcome: params.outcome,
		reason: params.reason,
		error: params.error
	});
	markDiagnosticActivity();
}
function logMessageProcessed(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (params.outcome === "error" ? diagnosticLogger.isEnabled("error") : diagnosticLogger.isEnabled("debug")) {
		const payload = `message processed: channel=${params.channel} chatId=${params.chatId ?? "unknown"} messageId=${params.messageId ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} outcome=${params.outcome} duration=${params.durationMs ?? 0}ms${params.reason ? ` reason=${params.reason}` : ""}${params.error ? ` error="${params.error}"` : ""}`;
		if (params.outcome === "error") diagnosticLogger.error(payload);
		else diagnosticLogger.debug(payload);
	}
	emitInternalDiagnosticEvent({
		type: "message.processed",
		channel: params.channel,
		chatId: params.chatId,
		messageId: params.messageId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		durationMs: params.durationMs,
		outcome: params.outcome,
		reason: params.reason,
		error: params.error
	});
	markDiagnosticActivity();
}
function logSessionTurnCreated(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	if (diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`session turn created: runId=${params.runId} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} agentId=${params.agentId ?? "unknown"} channel=${params.channel ?? "unknown"} trigger=${params.trigger}`);
	emitInternalDiagnosticEvent({
		type: "session.turn.created",
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		channel: params.channel,
		trigger: params.trigger
	});
	markDiagnosticActivity();
}
function logSessionStateChange(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const state = getDiagnosticSessionState(params);
	const isProbeSession = state.sessionId?.startsWith("probe-") ?? false;
	const prevState = state.state;
	state.state = params.state;
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	if (params.state === "processing" && prevState !== "processing") state.activeQueuedTurn = state.queueDepth > 0;
	if (params.state === "idle") {
		state.queueDepth = Math.max(0, state.queueDepth - 1);
		state.activeQueuedTurn = false;
	}
	if (!isProbeSession && diagnosticLogger.isEnabled("debug")) diagnosticLogger.debug(`session state: sessionId=${state.sessionId ?? "unknown"} sessionKey=${state.sessionKey ?? "unknown"} prev=${prevState} new=${params.state} reason="${params.reason ?? ""}" queueDepth=${state.queueDepth}`);
	emitInternalDiagnosticEvent({
		type: "session.state",
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		prevState,
		state: params.state,
		reason: params.reason,
		queueDepth: state.queueDepth
	});
	markDiagnosticActivity();
}
function markDiagnosticSessionProgress(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const state = getDiagnosticSessionState(params);
	state.lastActivity = Date.now();
	state.generation = (state.generation ?? 0) + 1;
	state.lastStuckWarnAgeMs = void 0;
	state.lastLongRunningWarnAgeMs = void 0;
	markDiagnosticActivity();
}
function sessionAttentionFields(params) {
	const terminalProgressStale = isTerminalDiagnosticProgressReason(params.activity.lastProgressReason);
	return {
		...params.classification.activeWorkKind ? { activeWorkKind: params.classification.activeWorkKind } : {},
		...params.activity.lastProgressAgeMs !== void 0 ? { lastProgressAgeMs: params.activity.lastProgressAgeMs } : {},
		...params.activity.lastProgressReason ? { lastProgressReason: params.activity.lastProgressReason } : {},
		...params.activity.activeToolName ? { activeToolName: params.activity.activeToolName } : {},
		...params.activity.activeToolCallId ? { activeToolCallId: params.activity.activeToolCallId } : {},
		...params.activity.activeToolAgeMs !== void 0 ? { activeToolAgeMs: params.activity.activeToolAgeMs } : {},
		...params.activity.repeatedRequestNoProgressAgeMs !== void 0 ? { repeatedRequestNoProgressAgeMs: params.activity.repeatedRequestNoProgressAgeMs } : {},
		...terminalProgressStale ? { terminalProgressStale: true } : {}
	};
}
function formatSessionActivityLogFields(activity) {
	const fields = [];
	if (activity.lastProgressReason) fields.push(`lastProgress=${activity.lastProgressReason}`);
	if (activity.lastProgressAgeMs !== void 0) fields.push(`lastProgressAge=${Math.round(activity.lastProgressAgeMs / 1e3)}s`);
	if (activity.activeToolName) fields.push(`activeTool=${activity.activeToolName}`);
	if (activity.activeToolCallId) fields.push(`activeToolCallId=${activity.activeToolCallId}`);
	if (activity.activeToolAgeMs !== void 0) fields.push(`activeToolAge=${Math.round(activity.activeToolAgeMs / 1e3)}s`);
	if (activity.repeatedRequestNoProgressAgeMs !== void 0) fields.push(`repeatedRequestNoProgressAge=${Math.round(activity.repeatedRequestNoProgressAgeMs / 1e3)}s`);
	if (isTerminalDiagnosticProgressReason(activity.lastProgressReason)) fields.push("terminalProgressStale=true");
	return fields.join(" ");
}
function logSessionAttention(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const state = getDiagnosticSessionState(params);
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: state.sessionId,
		sessionKey: state.sessionKey
	}, Date.now());
	const stuckSessionAbortMs = params.abortThresholdMs ?? resolveStalledEmbeddedRunAbortMs(params.thresholdMs);
	const queueDepth = resolveDiagnosticQueuedBacklog(state);
	const classification = classifySessionAttention({
		state: state.state,
		queueDepth,
		activity,
		staleMs: params.thresholdMs,
		stuckSessionAbortMs
	});
	const recoveryEligible = classification.recoveryEligible || isActiveAbortRecoveryEligible({
		classification,
		activity,
		stuckSessionAbortMs
	});
	let suppressWarning = false;
	if (classification.eventType === "session.stuck") {
		const nextWarnAgeMs = state.lastStuckWarnAgeMs === void 0 ? params.thresholdMs : Math.max(state.lastStuckWarnAgeMs + params.thresholdMs, state.lastStuckWarnAgeMs * 2);
		if (params.ageMs < nextWarnAgeMs) {
			if (!recoveryEligible) return;
			suppressWarning = true;
		} else state.lastStuckWarnAgeMs = params.ageMs;
	}
	if (classification.eventType === "session.long_running") {
		const nextWarnAgeMs = state.lastLongRunningWarnAgeMs === void 0 ? params.thresholdMs : Math.max(state.lastLongRunningWarnAgeMs + params.thresholdMs, state.lastLongRunningWarnAgeMs * 2);
		if (params.ageMs < nextWarnAgeMs) {
			if (!recoveryEligible) return;
			suppressWarning = true;
		} else state.lastLongRunningWarnAgeMs = params.ageMs;
	}
	if (suppressWarning) return classification;
	const label = classification.eventType === "session.stuck" ? "stuck session" : classification.eventType === "session.stalled" ? "stalled session" : "long-running session";
	const detailFields = [formatSessionActivityLogFields(activity), formatCronSessionDiagnosticFields(resolveCronSessionDiagnosticContext({
		sessionKey: state.sessionKey,
		activeSessionId: state.sessionId
	}))].filter(Boolean).join(" ");
	const message = `${label}: sessionId=${state.sessionId ?? "unknown"} sessionKey=${state.sessionKey ?? "unknown"} state=${params.state} age=${Math.round(params.ageMs / 1e3)}s queueDepth=${queueDepth} reason=${classification.reason} classification=${classification.classification}${classification.activeWorkKind ? ` activeWorkKind=${classification.activeWorkKind}` : ""}${detailFields ? ` ${detailFields}` : ""} recovery=${recoveryEligible ? "checking" : "none"}`;
	if (classification.eventType === "session.long_running" && queueDepth <= 0) diagnosticLogger.debug(message);
	else diagnosticLogger.warn(message);
	const baseEvent = {
		sessionId: state.sessionId,
		sessionKey: state.sessionKey,
		state: params.state,
		ageMs: params.ageMs,
		queueDepth,
		reason: classification.reason,
		...sessionAttentionFields({
			classification,
			activity
		})
	};
	if (classification.eventType === "session.long_running") emitInternalDiagnosticEvent({
		type: "session.long_running",
		...baseEvent,
		classification: "long_running"
	});
	else if (classification.eventType === "session.stalled") emitInternalDiagnosticEvent({
		type: "session.stalled",
		...baseEvent,
		classification: classification.classification
	});
	else emitInternalDiagnosticEvent({
		type: "session.stuck",
		...baseEvent,
		classification: "stale_session_state"
	});
	markDiagnosticActivity();
	return classification;
}
function logToolLoopAction(params) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const payload = `tool loop: sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} tool=${params.toolName} level=${params.level} action=${params.action} detector=${params.detector} count=${params.count}${params.pairedToolName ? ` pairedTool=${params.pairedToolName}` : ""} message="${params.message}"`;
	if (params.level === "critical") diagnosticLogger.error(payload);
	else diagnosticLogger.warn(payload);
	emitInternalDiagnosticEvent({
		type: "tool.loop",
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.toolName,
		level: params.level,
		action: params.action,
		detector: params.detector,
		count: params.count,
		message: params.message,
		pairedToolName: params.pairedToolName
	});
	markDiagnosticActivity();
}
let heartbeatInterval = null;
let lastDiagnosticHeartbeatTickAt;
function startDiagnosticHeartbeat(config, opts) {
	if (!areDiagnosticsEnabledForProcess() || !isDiagnosticsEnabled(config)) return;
	startDiagnosticRunActivityTracking();
	startDiagnosticStabilityRecorder();
	installDiagnosticStabilityFatalHook();
	if (heartbeatInterval) return;
	if (!opts?.sampleLiveness) startDiagnosticLivenessSampler();
	const livenessGraceUntil = opts?.startupGraceMs != null && opts.startupGraceMs > 0 ? Date.now() + opts.startupGraceMs : 0;
	lastDiagnosticHeartbeatTickAt = Date.now();
	heartbeatInterval = setInterval(() => {
		let heartbeatConfig = config;
		if (!heartbeatConfig) try {
			heartbeatConfig = (opts?.getConfig ?? getRuntimeConfig)();
		} catch {
			heartbeatConfig = void 0;
		}
		const stuckSessionWarnMs = opts?.testTimings?.stuckSessionWarnMs ?? resolveStuckSessionWarnMs();
		const stuckSessionAbortMs = opts?.testTimings?.stuckSessionAbortMs ?? resolveStuckSessionAbortMs(stuckSessionWarnMs);
		const compactionSafetyTimeoutMs = resolveCompactionTimeoutMs(heartbeatConfig);
		const now = Date.now();
		const heartbeatElapsedMs = lastDiagnosticHeartbeatTickAt === void 0 ? 0 : now - lastDiagnosticHeartbeatTickAt;
		lastDiagnosticHeartbeatTickAt = now;
		const heartbeatOverdueMs = Math.max(0, heartbeatElapsedMs - DIAGNOSTIC_HEARTBEAT_INTERVAL_MS);
		const inStartupGrace = livenessGraceUntil > 0 && now < livenessGraceUntil;
		const recoveryObservationNow = now - heartbeatOverdueMs;
		const shouldDeferRecovery = heartbeatOverdueMs >= DEFAULT_LIVENESS_EVENT_LOOP_DELAY_WARN_MS;
		if (shouldDeferRecovery && !inStartupGrace) diagnosticLogger.warn(`liveness heartbeat delayed: overdue=${Math.round(heartbeatOverdueMs)}ms elapsed=${Math.round(heartbeatElapsedMs)}ms; deferring recovery decisions`);
		pruneDiagnosticSessionStates(now, true);
		const work = getDiagnosticWorkSnapshot(now);
		const rawLivenessSample = (opts?.sampleLiveness ?? sampleDiagnosticLiveness)(now, work);
		const livenessSample = inStartupGrace ? null : rawLivenessSample;
		const shouldEmitLivenessEvent = livenessSample !== null && shouldEmitDiagnosticLivenessEvent(now);
		const shouldEmitLivenessWarning = livenessSample !== null && shouldEmitDiagnosticLivenessWarning(now, work);
		const shouldEmitLivenessReport = shouldEmitLivenessEvent || shouldEmitLivenessWarning;
		const shouldRecordMemorySample = shouldEmitLivenessReport || hasRecentDiagnosticActivity(now) || hasOpenDiagnosticWork(work);
		if (opts?.emitMemorySample) opts.emitMemorySample({ emitSample: shouldRecordMemorySample });
		else emitDiagnosticMemorySample({ emitSample: shouldRecordMemorySample });
		if (!shouldRecordMemorySample) return;
		if (shouldEmitLivenessReport && livenessSample) emitDiagnosticLivenessWarning(livenessSample, work, now);
		diagnosticLogger.debug(`heartbeat: webhooks=${webhookStats.received}/${webhookStats.processed}/${webhookStats.errors} active=${work.activeCount} waiting=${work.waitingCount} queued=${work.queuedCount}`);
		emitInternalDiagnosticEvent({
			type: "diagnostic.heartbeat",
			webhooks: {
				received: webhookStats.received,
				processed: webhookStats.processed,
				errors: webhookStats.errors
			},
			active: work.activeCount,
			waiting: work.waitingCount,
			queued: work.queuedCount
		});
		loadCommandPollBackoffRuntime().then(({ pruneStaleCommandPolls }) => {
			for (const [, state] of diagnosticSessionStates) pruneStaleCommandPolls(state);
		}).catch((err) => {
			diagnosticLogger.debug(`command-poll-backoff prune failed: ${String(err)}`);
		});
		for (const [, state] of diagnosticSessionStates) {
			const ageMs = recoveryObservationNow - state.lastActivity;
			const activity = getDiagnosticSessionActivitySnapshot({
				sessionId: state.sessionId,
				sessionKey: state.sessionKey
			}, recoveryObservationNow);
			const idleQueuedRecoverableStall = isIdleQueuedRecoverableSessionStall({
				state,
				activity,
				staleMs: stuckSessionWarnMs
			});
			const ownedWorkAgeMs = activity.activeWorkKind ? activity.lastProgressAgeMs ?? 0 : 0;
			const attentionAgeMs = idleQueuedRecoverableStall ? activity.lastProgressAgeMs ?? ageMs : Math.max(ageMs, activity.repeatedRequestNoProgressAgeMs ?? 0, ownedWorkAgeMs);
			if (state.state === "processing" && attentionAgeMs > stuckSessionWarnMs || idleQueuedRecoverableStall) {
				const classification = logSessionAttention({
					sessionId: state.sessionId,
					sessionKey: state.sessionKey,
					state: state.state,
					ageMs: attentionAgeMs,
					thresholdMs: stuckSessionWarnMs,
					abortThresholdMs: stuckSessionAbortMs
				});
				if (!classification || shouldDeferRecovery) continue;
				const activeAbortEligible = !classification.recoveryEligible && isActiveAbortRecoveryEligible({
					classification,
					activity,
					stuckSessionAbortMs
				});
				if (!classification.recoveryEligible && !activeAbortEligible) continue;
				requestStuckSessionRecovery({
					recover: opts?.recoverStuckSession ?? recoverStuckSession,
					classification,
					request: {
						sessionId: state.sessionId,
						sessionKey: state.sessionKey,
						sessionFile: state.sessionFile,
						ageMs: attentionAgeMs,
						queueDepth: resolveDiagnosticQueuedBacklog(state),
						expectedState: state.state,
						stateGeneration: state.generation,
						...activeAbortEligible ? { allowActiveAbort: true } : { staleActiveProgressAbortMs: stuckSessionAbortMs },
						compactionSafetyTimeoutMs
					}
				});
			}
		}
	}, DIAGNOSTIC_HEARTBEAT_INTERVAL_MS);
	heartbeatInterval.unref?.();
}
function stopDiagnosticHeartbeat() {
	if (heartbeatInterval) {
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
	}
	lastDiagnosticHeartbeatTickAt = void 0;
	stopDiagnosticRunActivityTracking();
	stopDiagnosticLivenessSampler();
	stopDiagnosticStabilityRecorder();
	uninstallDiagnosticStabilityFatalHook();
}
function resetDiagnosticStateForTest() {
	stopDiagnosticHeartbeat();
	resetDiagnosticSessionRecoveryCoordinatorForTest();
	resetDiagnosticSessionStateForTest();
	resetDiagnosticActivityForTest();
	resetDiagnosticRunActivityForTest();
	webhookStats.received = 0;
	webhookStats.processed = 0;
	webhookStats.errors = 0;
	webhookStats.lastReceived = 0;
	resetDiagnosticMemoryForTest();
	resetDiagnosticPhasesForTest();
	resetDiagnosticStabilityRecorderForTest();
	resetDiagnosticStabilityBundleForTest();
}
const testing = {
	resetDiagnosticStateForTest,
	resolveStuckSessionAbortMs,
	resolveStuckSessionWarnMs
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.diagnosticTestApi")] = testing;
//#endregion
export { formatStoppedCronSessionDiagnosticFields as _, logMessageReceived as a, compactWithSafetyTimeout as b, logToolLoopAction as c, logWebhookReceived as d, markDiagnosticSessionProgress as f, resolveStuckSessionRecoveryRef as g, formatRecoveryOutcome as h, logMessageQueued as i, logWebhookError as l, stopDiagnosticHeartbeat as m, logMessageDispatchStarted as n, logSessionStateChange as o, startDiagnosticHeartbeat as p, logMessageProcessed as r, logSessionTurnCreated as s, logMessageDispatchCompleted as t, logWebhookProcessed as u, resolveCronSessionDiagnosticContext as v, resolveCompactionTimeoutMs as x, compactContextEngineWithSafetyTimeout as y };
