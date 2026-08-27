import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { i as isDiagnosticsTimelineEnabled, n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-DhDccUEp.js";
import { i as withDiagnosticPhase } from "./diagnostic-phase-wlaZXgp0.js";
import { c as recordGatewayRestartTraceDetail, l as recordGatewayRestartTraceSpan } from "./restart-trace-DGYy4fPv.js";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
//#region src/gateway/server-startup-trace.ts
/** Measure a startup step when tracing is active, otherwise run it directly. */
async function measureStartup(startupTrace, name, run) {
	return startupTrace ? startupTrace.measure(name, run) : await run();
}
function createGatewayStartupTrace(log) {
	const logEnabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
	let timelineConfig;
	let eventLoopDelay;
	const timelineOptions = () => ({
		...timelineConfig ? { config: timelineConfig } : {},
		env: process.env
	});
	const eventLoopTimelineEnabled = () => isDiagnosticsTimelineEnabled(timelineOptions()) && isTruthyEnvValue(process.env.OPENCLAW_DIAGNOSTICS_EVENT_LOOP);
	const ensureEventLoopDelay = () => {
		if (eventLoopDelay || !logEnabled && !eventLoopTimelineEnabled()) return;
		eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
		eventLoopDelay.enable();
	};
	ensureEventLoopDelay();
	const started = performance.now();
	let last = started;
	let spanSequence = 0;
	const formatMetric = (key, value) => `${key}=${typeof value === "number" ? value.toFixed(1) : value}`;
	const mapTimelineName = (name) => {
		switch (name) {
			case "config.snapshot": return "config.load";
			case "config.auth":
			case "config.final-snapshot":
			case "runtime.config": return "config.normalize";
			case "plugins.bootstrap": return "plugins.load";
			case "runtime.post-attach":
			case "ready": return "gateway.ready";
			default: return name;
		}
	};
	const takeEventLoopSample = () => {
		if (!eventLoopDelay) return;
		const sample = {
			p50Ms: eventLoopDelay.percentile(50) / 1e6,
			p95Ms: eventLoopDelay.percentile(95) / 1e6,
			p99Ms: eventLoopDelay.percentile(99) / 1e6,
			maxMs: eventLoopDelay.max / 1e6
		};
		eventLoopDelay.reset();
		return sample;
	};
	const emitEventLoopTimelineSample = (activeSpanName, sample) => {
		if (!eventLoopTimelineEnabled() || !sample) return;
		emitDiagnosticsTimelineEvent({
			type: "eventLoop.sample",
			name: "eventLoop",
			phase: "startup",
			activeSpanName: mapTimelineName(activeSpanName),
			attributes: activeSpanName === mapTimelineName(activeSpanName) ? void 0 : { traceName: activeSpanName },
			...sample
		}, timelineOptions());
	};
	const emit = (name, durationMs, totalMs, eventLoopSample, extras = []) => {
		const metrics = [["eventLoopMax", `${(eventLoopSample?.maxMs ?? 0).toFixed(1)}ms`], ...extras];
		recordGatewayRestartTraceSpan(`restart.ready.${name}`, durationMs, totalMs, metrics);
		if (logEnabled) log.info(`startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`);
	};
	return {
		setConfig(config) {
			timelineConfig = config;
			ensureEventLoopDelay();
		},
		mark(name) {
			const now = performance.now();
			const eventLoopSample = takeEventLoopSample();
			emit(name, now - last, now - started, eventLoopSample);
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: mapTimelineName(name),
				phase: "startup",
				durationMs: now - started,
				attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
			}, timelineOptions());
			emitEventLoopTimelineSample(name, eventLoopSample);
			last = now;
			if (name === "ready") eventLoopDelay?.disable();
		},
		detail(name, metrics) {
			const attributes = Object.fromEntries(metrics);
			recordGatewayRestartTraceDetail(`restart.ready.${name}`, metrics);
			if (logEnabled) log.info(`startup trace: ${name} ${metrics.map(([key, value]) => formatMetric(key, value)).join(" ")}`);
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: mapTimelineName(name),
				phase: "startup",
				attributes: {
					traceName: name,
					...attributes
				}
			}, timelineOptions());
		},
		async measure(name, run, options = {}) {
			const before = performance.now();
			const spanId = `gateway-startup-${++spanSequence}`;
			emitDiagnosticsTimelineEvent({
				type: "span.start",
				name: mapTimelineName(name),
				phase: "startup",
				spanId,
				attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
			}, timelineOptions());
			try {
				const result = await withDiagnosticPhase(mapTimelineName(name), run, { traceName: name });
				const now = performance.now();
				emitDiagnosticsTimelineEvent({
					type: "span.end",
					name: mapTimelineName(name),
					phase: "startup",
					spanId,
					durationMs: now - before,
					attributes: name === mapTimelineName(name) ? void 0 : { traceName: name }
				}, timelineOptions());
				return result;
			} catch (error) {
				const now = performance.now();
				emitDiagnosticsTimelineEvent({
					type: "span.error",
					name: mapTimelineName(name),
					phase: "startup",
					spanId,
					durationMs: now - before,
					attributes: name === mapTimelineName(name) ? void 0 : { traceName: name },
					errorName: error instanceof Error ? error.name : typeof error,
					...options.omitErrorMessage ? {} : { errorMessage: error instanceof Error ? error.message : String(error) }
				}, timelineOptions());
				throw error;
			} finally {
				const now = performance.now();
				const eventLoopSample = takeEventLoopSample();
				emit(name, now - before, now - started, eventLoopSample);
				emitEventLoopTimelineSample(name, eventLoopSample);
				last = now;
			}
		}
	};
}
//#endregion
export { measureStartup as n, createGatewayStartupTrace as t };
