import { v as NODE_WORKER_DESKTOP_LAUNCH_COMMAND, y as NODE_WORKER_DESKTOP_STREAM_COMMAND } from "./node-commands-DRxP7loh.js";
import { t as DesktopSessionStaleOwnerError } from "./session-registry-CXjtG6_S.js";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worker-environments/node-desktop-carrier.ts
const APP_LAUNCH_TIMEOUT_MS = 3e4;
function snapshotNodeDesktopBinding(record) {
	if (record.state !== "ready" && record.state !== "idle" && record.state !== "attached" || record.destroyRequestedAtMs !== null || !record.leaseId || !record.nodeDeviceId || record.sshEndpoint !== null || !record.desktop) throw new Error("Worker environment node desktop owner is not active");
	return {
		environmentId: record.environmentId,
		leaseId: record.leaseId,
		nodeDeviceId: record.nodeDeviceId,
		ownerEpoch: record.ownerEpoch,
		desktop: structuredClone(record.desktop)
	};
}
function isBindingCurrent(store, binding) {
	const current = store.get(binding.environmentId);
	return Boolean(current && (current.state === "ready" || current.state === "idle" || current.state === "attached") && current.destroyRequestedAtMs === null && current.leaseId === binding.leaseId && current.nodeDeviceId === binding.nodeDeviceId && current.sshEndpoint === null && current.ownerEpoch === binding.ownerEpoch && current.desktop !== null && isDeepStrictEqual(current.desktop, binding.desktop));
}
function invocationError(result) {
	const message = result.error?.message?.trim();
	return new Error(message || "worker node desktop stream closed before attachment");
}
function requireLaunchReady(result) {
	if (!result.ok) throw invocationError(result);
	let payload;
	try {
		payload = result.payloadJSON ? JSON.parse(result.payloadJSON) : void 0;
	} catch {
		throw new Error("Worker environment node desktop launcher returned malformed JSON");
	}
	if (!payload || typeof payload !== "object" || Array.isArray(payload) || Object.keys(payload).length !== 1 || !("status" in payload) || payload.status !== "ready") throw new Error("Worker environment node desktop launcher returned an invalid result");
}
function launchKey(binding, app) {
	return `${binding.environmentId}\0${app.id}`;
}
function signalError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Worker environment node desktop operation aborted");
}
function raceWithSignal(operation, signal) {
	if (signal.aborted) return Promise.reject(signalError(signal));
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			reject(signalError(signal));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		operation.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : /* @__PURE__ */ new Error("Node desktop operation failed"));
		});
	});
}
/** Carries one durable worker environment's desktop over its private node connection. */
function createWorkerNodeDesktopCarrier(options) {
	let runtime;
	const claimedEpochs = /* @__PURE__ */ new Map();
	const activeStreams = /* @__PURE__ */ new Set();
	const activeLaunches = /* @__PURE__ */ new Map();
	const bindingIsCurrent = (binding, capturedRuntime, node) => runtime === capturedRuntime && isBindingCurrent(options.store, binding) && capturedRuntime.transport.isCurrent(node, false);
	const findCurrentNode = async (binding, capturedRuntime, signal) => {
		signal.throwIfAborted();
		const nodes = await raceWithSignal(capturedRuntime.transport.listCurrentNodes(), signal);
		signal.throwIfAborted();
		const node = nodes.find((candidate) => candidate.nodeId === binding.nodeDeviceId);
		if (!node || !bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop connection is not current");
		return node;
	};
	const retireStream = (active) => {
		if (active.stopped) return;
		active.stopped = true;
		clearTimeout(active.unclaimedTimer);
		active.ticket?.cancel();
		active.controller.abort(/* @__PURE__ */ new Error("Worker environment node desktop owner stopped"));
		if (!active.reservationTransferred) active.reservation?.release();
		active.stream?.destroy();
		activeStreams.delete(active);
	};
	const stopStream = async (active) => {
		retireStream(active);
		await active.invocation?.catch(() => void 0);
	};
	const stopLaunch = async (active) => {
		active.controller.abort(/* @__PURE__ */ new Error("Worker environment node desktop owner stopped"));
		await active.operation.catch(() => void 0);
	};
	const stopOwnedOperations = async (environmentId, ownerEpoch) => {
		const streams = [...activeStreams].filter((active) => active.binding.environmentId === environmentId && (ownerEpoch === void 0 || active.binding.ownerEpoch === ownerEpoch));
		const launches = [...activeLaunches.values()].filter((active) => active.binding.environmentId === environmentId && (ownerEpoch === void 0 || active.binding.ownerEpoch === ownerEpoch));
		await Promise.all([...streams.map(stopStream), ...launches.map(stopLaunch)]);
	};
	const claimOwner = async (binding) => {
		let advanced;
		try {
			advanced = options.desktopRegistry.claimOwnerEpoch(binding.environmentId, binding.ownerEpoch);
		} catch (error) {
			if (error instanceof DesktopSessionStaleOwnerError) throw new Error("Worker environment node desktop owner epoch is stale", { cause: error });
			throw error;
		}
		const previousEpoch = claimedEpochs.get(binding.environmentId);
		if (previousEpoch === void 0 || binding.ownerEpoch > previousEpoch) claimedEpochs.set(binding.environmentId, binding.ownerEpoch);
		if (!advanced) return;
		const staleStreams = [...activeStreams].filter((active) => active.binding.environmentId === binding.environmentId && active.binding.ownerEpoch < binding.ownerEpoch);
		const staleLaunches = [...activeLaunches.values()].filter((active) => active.binding.environmentId === binding.environmentId && active.binding.ownerEpoch < binding.ownerEpoch);
		await options.desktopRegistry.stopSuperseded(binding.environmentId, binding.ownerEpoch);
		await Promise.all([...staleStreams.map(stopStream), ...staleLaunches.map(stopLaunch)]);
	};
	const observe = async (request) => {
		const binding = snapshotNodeDesktopBinding(request.record);
		const active = {
			binding,
			controller: new AbortController(),
			reservationTransferred: false,
			stopped: false
		};
		activeStreams.add(active);
		try {
			await claimOwner(binding);
			active.controller.signal.throwIfAborted();
			await options.desktopRegistry.activate({
				sourceKey: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				teardown: async () => {
					await stopOwnedOperations(binding.environmentId, binding.ownerEpoch);
				}
			});
			active.controller.signal.throwIfAborted();
			const capturedRuntime = runtime;
			if (!capturedRuntime) throw new Error("Worker environment node desktop runtime is unavailable");
			const node = await findCurrentNode(binding, capturedRuntime, active.controller.signal);
			active.reservation = options.desktopRegistry.reserveObserver(binding.environmentId, binding.ownerEpoch);
			if (!active.reservation) throw new Error("Worker environment desktop observer limit reached");
			active.ticket = capturedRuntime.streamBroker.mint({
				nodeId: node.nodeId,
				connId: node.connId,
				pairingGeneration: node.pairingGeneration
			});
			active.invocation = capturedRuntime.transport.invoke({
				node,
				command: NODE_WORKER_DESKTOP_STREAM_COMMAND,
				params: {
					ticket: active.ticket.ticket,
					attachPath: active.ticket.attachPath,
					port: binding.desktop.port,
					...binding.desktop.passwordFilePath ? { passwordFilePath: binding.desktop.passwordFilePath } : {}
				},
				timeoutMs: 0,
				signal: active.controller.signal,
				isDispatchAuthorized: () => bindingIsCurrent(binding, capturedRuntime, node)
			});
			const invocationFinished = active.invocation.then((result) => {
				throw invocationError(result);
			});
			invocationFinished.catch(() => void 0);
			const attached = await Promise.race([active.ticket.attached, invocationFinished]);
			active.stream = attached.stream;
			if (!bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop owner changed before attachment");
			if (attached.auth !== "vnc-password" || !attached.vncPassword) throw new Error("Worker environment node desktop did not provide VNC authentication");
			const { DESKTOP_OBSERVE_PATH, mintDesktopObserverToken } = await import("./observe-bridge-Bgx0jLjl.js");
			if (!bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop owner changed before publication");
			const attachment = options.desktopRegistry.publishStream({
				sourceKey: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				stream: attached.stream,
				reservation: active.reservation
			});
			if (!attachment) throw new Error("Worker environment node desktop owner changed before publication");
			active.reservationTransferred = true;
			const issuedAtMs = Date.now();
			const minted = mintDesktopObserverToken({
				sourceKey: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				control: request.control,
				attachment,
				preauth: {
					auth: "vnc-password",
					credentials: { password: attached.vncPassword }
				},
				nowMs: issuedAtMs
			});
			active.unclaimedTimer = setTimeout(() => {
				if (options.desktopRegistry.hasPendingStream(attachment)) stopStream(active);
			}, Math.max(0, minted.expiresAtMs - Date.now()));
			active.unclaimedTimer.unref?.();
			active.invocation.finally(() => retireStream(active)).catch(() => void 0);
			return {
				transport: "rfb",
				wsPath: `${DESKTOP_OBSERVE_PATH}?token=${minted.token}`,
				expiresAtMs: minted.expiresAtMs,
				control: request.control
			};
		} catch (error) {
			await stopStream(active);
			throw error;
		}
	};
	const launchApp = (request) => {
		const binding = snapshotNodeDesktopBinding(request.record);
		const advertisedApp = binding.desktop.apps?.find((app) => app.id === request.app.id);
		if (!advertisedApp || !isDeepStrictEqual(advertisedApp, request.app)) return Promise.reject(/* @__PURE__ */ new Error("Worker environment node desktop app descriptor is not current"));
		const app = structuredClone(advertisedApp);
		const key = launchKey(binding, app);
		const current = activeLaunches.get(key);
		if (current?.binding.ownerEpoch === binding.ownerEpoch && isDeepStrictEqual(current.app, app)) return current.operation;
		const previous = current;
		const token = {};
		const controller = new AbortController();
		let start;
		const startGate = new Promise((resolve) => {
			start = resolve;
		});
		const operation = (async () => {
			await startGate;
			await claimOwner(binding);
			if (previous) {
				previous.controller.abort(/* @__PURE__ */ new Error("Worker environment node desktop launch owner replaced"));
				await previous.operation.catch(() => void 0);
			}
			controller.signal.throwIfAborted();
			const capturedRuntime = runtime;
			if (!capturedRuntime) throw new Error("Worker environment node desktop runtime is unavailable");
			const node = await findCurrentNode(binding, capturedRuntime, controller.signal);
			const active = activeLaunches.get(key);
			if (active?.token !== token) throw new Error("Worker environment node desktop launch owner was replaced");
			active.invocation = capturedRuntime.transport.invoke({
				node,
				command: NODE_WORKER_DESKTOP_LAUNCH_COMMAND,
				params: app,
				timeoutMs: APP_LAUNCH_TIMEOUT_MS,
				signal: controller.signal,
				isDispatchAuthorized: () => bindingIsCurrent(binding, capturedRuntime, node)
			});
			requireLaunchReady(await active.invocation);
			if (!bindingIsCurrent(binding, capturedRuntime, node)) throw new Error("Worker environment node desktop launch owner changed");
		})();
		const entry = {
			binding,
			app,
			token,
			controller,
			operation
		};
		activeLaunches.set(key, entry);
		start();
		operation.finally(() => {
			if (activeLaunches.get(key) === entry) activeLaunches.delete(key);
		}).catch(() => void 0);
		return operation;
	};
	const stop = async (environmentId, ownerEpoch) => {
		await Promise.all([options.desktopRegistry.stop(environmentId, ownerEpoch), stopOwnedOperations(environmentId, ownerEpoch)]);
	};
	const stopAll = async () => {
		await Promise.all([...claimedEpochs].map(([environmentId, ownerEpoch]) => stop(environmentId, ownerEpoch)));
	};
	return {
		bindRuntime(next) {
			runtime = next;
		},
		launchApp,
		observe,
		stop,
		stopAll
	};
}
//#endregion
export { createWorkerNodeDesktopCarrier };
