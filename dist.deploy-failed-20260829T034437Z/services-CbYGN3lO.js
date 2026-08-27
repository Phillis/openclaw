import { r as STATE_DIR } from "./paths-BBSTUjD5.js";
import { L as markTrustedOtelDiagnosticListener, S as registerDiagnosticTracePropagationBridge, b as waitForDiagnosticEventsDrained, g as onTrustedInternalDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData } from "./diagnostic-events-BGzDm6gu.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.js";
import { i as recordDiagnosticExporterHealth } from "./diagnostic-stability-qy3YzwfS.js";
import { n as withPluginHttpRouteRegistry } from "./http-registry--mJJX8Q3.js";
import { r as subscribePluginSessionsChanged } from "./gateway-events-BIgYHxyk.js";
import { t as createPluginServiceHealthGeneration } from "./service-health-B_BPWOKb.js";
//#region src/plugins/services.ts
/** Starts, stops, and inspects plugin service registrations. */
const log = createSubsystemLogger("plugins");
const PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS = 5e3;
var PluginServiceReplacementTimeoutError = class extends Error {};
function createPluginServiceCapabilityLease() {
	let active = true;
	const cleanups = /* @__PURE__ */ new Set();
	const assertActive = (capability) => {
		if (!active) throw new Error(`plugin service ${capability} is no longer active`);
	};
	const retain = (cleanup) => {
		if (!active) {
			cleanup();
			assertActive("capability lease");
		}
		const release = () => {
			if (cleanups.delete(release)) cleanup();
		};
		cleanups.add(release);
		return release;
	};
	return {
		isActive: () => active,
		assertActive,
		retain,
		revoke: () => {
			if (!active) return;
			active = false;
			for (const cleanup of cleanups) cleanup();
		}
	};
}
function createPluginLogger() {
	return {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
}
function createServiceContext(params) {
	const isDiagnosticsExporter = params.service?.pluginId === params.service?.service.id && (params.service?.service.id === "diagnostics-otel" || params.service?.service.id === "diagnostics-prometheus");
	const isOtelExporter = isDiagnosticsExporter && params.service.service.id === "diagnostics-otel";
	const internalDiagnostics = isDiagnosticsExporter && (params.service?.origin === "bundled" || params.service?.trustedOfficialInstall === true) ? {
		emit: (event, privateData) => {
			params.lease.assertActive("internal diagnostic emitter");
			emitTrustedDiagnosticEventWithPrivateData(event, privateData);
		},
		onEvent: (listener) => {
			params.lease.assertActive("internal diagnostic listener");
			const trustedListener = isOtelExporter ? markTrustedOtelDiagnosticListener(listener) : listener;
			return params.lease.retain(onTrustedInternalDiagnosticEvent(trustedListener));
		},
		registerTracePropagationBridge: (bridge) => {
			params.lease.assertActive("diagnostic trace propagation bridge");
			return params.lease.retain(registerDiagnosticTracePropagationBridge(bridge));
		},
		reportExporterHealth: (update) => {
			if (params.lease.isActive()) recordDiagnosticExporterHealth(params.service.service.id, update);
		}
	} : void 0;
	return {
		config: params.config,
		workspaceDir: params.workspaceDir,
		stateDir: STATE_DIR,
		logger: createPluginLogger(),
		serviceHealth: params.serviceHealth,
		...params.gatewayEvents ? { gatewayEvents: params.gatewayEvents } : {},
		...params.startupTrace ? { startupTrace: createScopedPluginServiceStartupTrace(params.startupTrace, createPluginServiceTraceName(params.service)) } : {},
		...internalDiagnostics ? { internalDiagnostics } : {}
	};
}
function createScopedGatewayEvents(params) {
	if (!params.broadcast) return {};
	const broadcast = params.broadcast;
	return { gatewayEvents: {
		emit: (event, payload, opts) => {
			params.lease.assertActive("gateway event emitter");
			if (!/^[a-z][a-z0-9_-]*$/u.test(event)) throw new Error(`invalid plugin gateway event name: ${event}`);
			if (!isPluginJsonValue(payload)) throw new Error("plugin gateway event payload must be bounded JSON");
			if (opts?.scope !== "operator.read" && opts?.scope !== "operator.write" && opts?.scope !== "operator.admin") throw new Error("plugin gateway event scope must be an operator scope");
			broadcast(`plugin.${params.pluginId}.${event}`, payload, opts.scope);
		},
		onSessionsChanged: (handler) => {
			params.lease.assertActive("gateway event subscriber");
			return params.lease.retain(subscribePluginSessionsChanged(handler));
		}
	} };
}
function createPluginServiceTraceName(entry) {
	return `sidecars.plugin-services.${encodeStartupTraceSegment(entry.pluginId)}.${encodeStartupTraceSegment(entry.service.id)}`;
}
function createScopedPluginServiceStartupTrace(startupTrace, prefix) {
	const scopeName = (name) => `${prefix}.${name.split(".").map((segment) => encodeStartupTraceSegment(segment)).join(".")}`;
	return {
		measure: (name, run) => startupTrace.measure(scopeName(name), run),
		...startupTrace.detail ? { detail: (name, metrics) => startupTrace.detail?.(scopeName(name), metrics) } : {}
	};
}
async function startPluginServices(params) {
	const healthGeneration = createPluginServiceHealthGeneration(params.registry);
	const running = [];
	const runBeforeDeadline = async (run, deadline, label, owner) => {
		const operation = Promise.resolve(run());
		const remaining = deadline - Date.now();
		const timeoutError = () => new PluginServiceReplacementTimeoutError(`${label} timed out after ${PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS}ms${owner ? ` (${owner})` : ""}`);
		if (remaining <= 0) {
			await Promise.race([operation, Promise.reject(timeoutError())]);
			return;
		}
		let timer;
		try {
			await Promise.race([operation, new Promise((_, reject) => {
				timer = setTimeout(() => reject(timeoutError()), remaining);
				timer.unref?.();
			})]);
		} finally {
			clearTimeout(timer);
		}
	};
	const stopService = async (entry, failures, deadline) => {
		try {
			if (entry.stop) {
				const cleanup = () => withPluginHttpRouteRegistry(params.registry, () => entry.stop?.(), entry.lease);
				if (deadline === void 0) await cleanup();
				else await runBeforeDeadline(cleanup, deadline, "plugin service stop");
			}
		} catch (err) {
			log.warn(`plugin service stop failed (${entry.id}): ${String(err)}`);
			failures?.push(deadline === void 0 ? err : new Error(`plugin service stop failed (plugin=${entry.pluginId}, service=${entry.id}): ${err instanceof PluginServiceReplacementTimeoutError ? err.message : `rejected: ${String(err)}`}`, { cause: err }));
		} finally {
			entry.lease.revoke();
		}
	};
	const startupSettled = createDeferredCore();
	startupSettled.promise.catch(() => {});
	let stopRequested = false;
	let stopPromise;
	const handle = { stop: (options) => {
		stopRequested = true;
		if (!stopPromise) {
			const strict = options?.strict === true;
			const deadline = strict ? options.deadlineAtMs : void 0;
			stopPromise = Promise.resolve().then(async () => {
				const failures = [];
				if (deadline === void 0) await startupSettled.promise.catch(() => {});
				else try {
					const starting = running.at(-1);
					await runBeforeDeadline(() => startupSettled.promise.catch(() => {}), deadline, "plugin service startup settlement", starting ? `plugin=${starting.pluginId}, service=${starting.id}` : void 0);
				} catch (error) {
					failures.push(error);
					for (const entry of running) entry.lease.revoke();
				}
				const reversed = running.toReversed();
				const diagnosticsExporters = reversed.filter((entry) => entry.diagnosticsExporter);
				const exporterFailures = strict ? failures : [];
				const stopServices = async (services, collected) => {
					for (const entry of services) await stopService(entry, collected, deadline);
				};
				await stopServices(reversed.filter((entry) => !entry.diagnosticsExporter), strict ? failures : void 0);
				if (diagnosticsExporters.length > 0) if (deadline === void 0) await waitForDiagnosticEventsDrained();
				else try {
					await runBeforeDeadline(waitForDiagnosticEventsDrained, deadline, "plugin diagnostic event drain", diagnosticsExporters.map((entry) => `plugin=${entry.pluginId}, service=${entry.id}`).join("; "));
				} catch (error) {
					failures.push(error);
				}
				await stopServices(diagnosticsExporters, exporterFailures);
				if (strict && failures.length > 0) throw new AggregateError(failures, "plugin service replacement cleanup failed");
				if (exporterFailures.length === 1) throw exporterFailures[0];
				if (exporterFailures.length > 1) throw new AggregateError(exporterFailures, "multiple diagnostics exporters failed to stop");
			});
			stopPromise.then(healthGeneration.retire, healthGeneration.retire);
		}
		return stopPromise;
	} };
	params.onHandle?.(handle);
	try {
		let failedCount = 0;
		for (const entry of params.registry.services) {
			if (stopRequested) break;
			const service = entry.service;
			const traceName = createPluginServiceTraceName(entry);
			const lease = createPluginServiceCapabilityLease();
			const scopedGatewayEvents = createScopedGatewayEvents({
				pluginId: entry.pluginId,
				broadcast: params.broadcastPluginEvent,
				lease
			});
			const serviceHealth = healthGeneration.createReporter(entry);
			lease.retain(serviceHealth.revoke);
			const serviceContext = createServiceContext({
				config: params.config,
				startupTrace: params.startupTrace,
				workspaceDir: params.workspaceDir,
				service: entry,
				serviceHealth: serviceHealth.health,
				gatewayEvents: scopedGatewayEvents.gatewayEvents,
				lease
			});
			const runningService = {
				id: service.id,
				pluginId: entry.pluginId,
				diagnosticsExporter: serviceContext.internalDiagnostics !== void 0,
				stop: service.stop ? () => service.stop?.(serviceContext) : void 0,
				lease
			};
			running.push(runningService);
			try {
				const startService = () => withPluginHttpRouteRegistry(params.registry, () => service.start(serviceContext), lease);
				if (params.startupTrace) await params.startupTrace.measure(traceName, startService);
				else await startService();
			} catch (err) {
				running.splice(running.indexOf(runningService), 1);
				failedCount += 1;
				serviceContext.serviceHealth?.reportFailure(err);
				const error = err;
				log.error(`plugin service failed (${service.id}, plugin=${entry.pluginId}, root=${entry.rootDir ?? "unknown"}): ${error?.message ?? String(err)}`);
				await stopService(runningService, void 0, Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS);
			}
		}
		params.startupTrace?.detail?.("sidecars.plugin-services.summary", [
			["serviceCount", params.registry.services.length],
			["startedCount", running.length],
			["failedCount", failedCount]
		]);
		startupSettled.resolve();
		return handle;
	} catch (error) {
		startupSettled.reject(error);
		throw error;
	}
}
//#endregion
export { PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS, startPluginServices };
