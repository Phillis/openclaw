import { x as NODE_WORKER_PORTAL_STREAM_COMMAND } from "./node-commands-DRxP7loh.js";
//#region src/gateway/worker-environments/portal-node-carrier.ts
const UNSUPPORTED_NODE_PORTAL_MESSAGE = "Portals require a current cloud-worker node with portal stream support; move the session back to the gateway with sessions.move";
function snapshotNodePortalBinding(record, ownerEpoch) {
	if (!record || record.state !== "ready" && record.state !== "idle" && record.state !== "attached" || record.destroyRequestedAtMs !== null || !record.leaseId || !record.nodeDeviceId || record.sshEndpoint !== null || record.ownerEpoch !== ownerEpoch) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
	return {
		environmentId: record.environmentId,
		leaseId: record.leaseId,
		nodeDeviceId: record.nodeDeviceId,
		ownerEpoch: record.ownerEpoch
	};
}
function isNodePortalBindingCurrent(store, binding) {
	const current = store.get(binding.environmentId);
	return Boolean(current && (current.state === "ready" || current.state === "idle" || current.state === "attached") && current.destroyRequestedAtMs === null && current.leaseId === binding.leaseId && current.nodeDeviceId === binding.nodeDeviceId && current.sshEndpoint === null && current.ownerEpoch === binding.ownerEpoch);
}
function nodePortalAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Worker environment node portal owner stopped");
}
function raceNodePortalAbort(operation, signal) {
	if (signal.aborted) return Promise.reject(nodePortalAbortError(signal));
	return new Promise((resolve, reject) => {
		const onAbort = () => reject(nodePortalAbortError(signal));
		signal.addEventListener("abort", onAbort, { once: true });
		operation.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
/** Opens one ticketed node connection per request while its durable portal owner remains current. */
function createWorkerNodePortalCarrier(options) {
	let runtime;
	const activePortals = /* @__PURE__ */ new Set();
	const bindingIsCurrent = (binding, capturedRuntime, node) => runtime === capturedRuntime && isNodePortalBindingCurrent(options.store, binding) && node.workerHost.portalStream === 1 && capturedRuntime.transport.isCurrent(node, false);
	const findCurrentNode = async (binding, capturedRuntime, signal) => {
		const discovery = capturedRuntime.transport.listCurrentNodes();
		const nodes = signal ? await raceNodePortalAbort(discovery, signal) : await discovery;
		signal?.throwIfAborted();
		const node = nodes.find((candidate) => candidate.nodeId === binding.nodeDeviceId);
		if (!node || !bindingIsCurrent(binding, capturedRuntime, node)) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
		return node;
	};
	const retireStream = (active) => {
		if (active.stopped) return;
		active.stopped = true;
		active.ticket?.cancel();
		active.controller.abort(/* @__PURE__ */ new Error("Worker environment node portal stream stopped"));
		active.stream?.destroy();
		active.portal.streams.delete(active);
	};
	const stopStream = async (active) => {
		retireStream(active);
		await active.invocation?.catch(() => void 0);
	};
	const closePortal = async (portal) => {
		if (portal.closed) return;
		portal.closed = true;
		portal.controller.abort(/* @__PURE__ */ new Error("Worker environment node portal owner stopped"));
		activePortals.delete(portal);
		await Promise.all([...portal.streams].map(stopStream));
	};
	const connectPortal = async (portal, remotePort) => {
		const capturedRuntime = runtime;
		if (!capturedRuntime || portal.closed || portal.controller.signal.aborted) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
		const active = {
			portal,
			controller: new AbortController(),
			stopped: false
		};
		portal.streams.add(active);
		try {
			const node = await findCurrentNode(portal.binding, capturedRuntime, active.controller.signal);
			active.ticket = capturedRuntime.streamBroker.mintPortal({
				nodeId: node.nodeId,
				connId: node.connId,
				pairingGeneration: node.pairingGeneration
			});
			active.invocation = capturedRuntime.transport.invoke({
				node,
				command: NODE_WORKER_PORTAL_STREAM_COMMAND,
				params: {
					ticket: active.ticket.ticket,
					attachPath: active.ticket.attachPath,
					port: remotePort
				},
				timeoutMs: 0,
				signal: active.controller.signal,
				isDispatchAuthorized: () => !portal.closed && bindingIsCurrent(portal.binding, capturedRuntime, node)
			});
			const invocationFinished = active.invocation.then((result) => {
				throw new Error(result.error?.message?.trim() || "Worker environment node portal closed before attachment");
			});
			invocationFinished.catch(() => void 0);
			active.stream = (await Promise.race([active.ticket.attached, invocationFinished])).stream;
			if (portal.closed || !bindingIsCurrent(portal.binding, capturedRuntime, node)) throw new Error("Worker environment node portal owner changed before attachment");
			active.stream.once("close", () => retireStream(active));
			active.invocation.finally(() => retireStream(active)).catch(() => void 0);
			return active.stream;
		} catch (error) {
			await stopStream(active);
			throw error;
		}
	};
	return {
		bindRuntime(next) {
			if (runtime && runtime !== next) for (const portal of activePortals) for (const stream of portal.streams) retireStream(stream);
			runtime = next;
		},
		async supports(environmentId, ownerEpoch) {
			const capturedRuntime = runtime;
			if (!capturedRuntime) return false;
			try {
				const binding = snapshotNodePortalBinding(options.store.get(environmentId), ownerEpoch);
				await findCurrentNode(binding, capturedRuntime);
				return true;
			} catch {
				return false;
			}
		},
		async open(request) {
			const binding = snapshotNodePortalBinding(options.store.get(request.environmentId), request.ownerEpoch);
			const capturedRuntime = runtime;
			if (!capturedRuntime) throw new Error(UNSUPPORTED_NODE_PORTAL_MESSAGE);
			const portal = {
				binding,
				controller: new AbortController(),
				streams: /* @__PURE__ */ new Set(),
				closed: false
			};
			activePortals.add(portal);
			try {
				await findCurrentNode(binding, capturedRuntime, portal.controller.signal);
				return {
					connect: () => connectPortal(portal, request.remotePort),
					close: () => closePortal(portal)
				};
			} catch (error) {
				await closePortal(portal);
				throw error;
			}
		},
		async stop(environmentId, ownerEpoch) {
			await Promise.all([...activePortals].filter((portal) => portal.binding.environmentId === environmentId && (ownerEpoch === void 0 || portal.binding.ownerEpoch === ownerEpoch)).map(closePortal));
		},
		async stopAll() {
			await Promise.all([...activePortals].map(closePortal));
		}
	};
}
//#endregion
export { createWorkerNodePortalCarrier };
