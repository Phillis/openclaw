import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-XnskQsTT.js";
import { t as DesktopCredentialsRequiredError } from "./host-source-errors-46uOYNUn.js";
import { r as mintDesktopObserverToken } from "./observe-bridge-C1k_dya5.js";
//#region src/gateway/desktop/node-source.ts
function invocationError(result) {
	const message = result.error?.message?.trim();
	return new Error(message || "node desktop stream closed before attachment");
}
async function stopActiveStream(active) {
	if (active.stopped) return;
	retireActiveStream(active);
	await active.invocation?.catch(() => void 0);
}
function retireActiveStream(active) {
	if (active.stopped) return;
	active.stopped = true;
	clearTimeout(active.unclaimedTimer);
	active.ticket?.cancel();
	active.controller.abort();
	if (!active.reservationTransferred) active.reservation?.release();
	active.stream?.destroy();
}
/** Combines node command policy, ticket redemption, and desktop session ownership. */
function createNodeDesktopService(params) {
	const ownerEpochs = /* @__PURE__ */ new Map();
	const sessions = /* @__PURE__ */ new Map();
	const ensureSession = async (request) => {
		const current = sessions.get(request.sourceKey);
		if (current?.connId === request.connId && current.pairingGeneration === request.pairingGeneration) {
			await params.desktopRegistry.activate({
				sourceKey: request.sourceKey,
				ownerEpoch: current.ownerEpoch
			});
			return current;
		}
		const ownerEpoch = (ownerEpochs.get(request.sourceKey) ?? 0) + 1;
		ownerEpochs.set(request.sourceKey, ownerEpoch);
		const session = {
			connId: request.connId,
			pairingGeneration: request.pairingGeneration,
			ownerEpoch,
			active: /* @__PURE__ */ new Set()
		};
		sessions.set(request.sourceKey, session);
		try {
			await params.desktopRegistry.activate({
				sourceKey: request.sourceKey,
				ownerEpoch,
				teardown: async () => {
					if (sessions.get(request.sourceKey) === session) sessions.delete(request.sourceKey);
					await Promise.all([...session.active].map(stopActiveStream));
					session.active.clear();
				}
			});
			return session;
		} catch (error) {
			if (sessions.get(request.sourceKey) === session) sessions.delete(request.sourceKey);
			throw error;
		}
	};
	return {
		async stopNode(nodeId) {
			const sourceKey = `node:${nodeId}`;
			const session = sessions.get(sourceKey);
			if (session) await params.desktopRegistry.stop(sourceKey, session.ownerEpoch);
		},
		async observe(request) {
			const node = params.nodeRegistry.get(request.nodeId);
			if (!node?.pairingGeneration) throw new Error("node desktop is unavailable; reconnect and approve the node capability");
			const pairingGeneration = node.pairingGeneration;
			const allowlist = resolveNodeCommandAllowlist(params.getConfig(), node);
			if (!isNodeCommandAllowed({
				command: "desktop.stream",
				declaredCommands: node.commands,
				allowlist
			}).ok) throw new Error("node desktop is not enabled; explicitly allow and approve desktop.stream for this node");
			const sourceKey = `node:${request.nodeId}`;
			const session = await ensureSession({
				sourceKey,
				connId: node.connId,
				pairingGeneration
			});
			const active = {
				controller: new AbortController(),
				reservation: params.desktopRegistry.reserveObserver(sourceKey, session.ownerEpoch),
				reservationTransferred: false,
				stopped: false
			};
			if (!active.reservation) throw new Error("node desktop observer limit reached");
			session.active.add(active);
			active.ticket = params.streamBroker.mint({
				nodeId: request.nodeId,
				connId: node.connId,
				pairingGeneration
			});
			active.invocation = params.nodeRegistry.invoke({
				nodeId: request.nodeId,
				expectedConnId: node.connId,
				expectedPairingGeneration: pairingGeneration,
				command: NODE_DESKTOP_STREAM_COMMAND,
				params: {
					ticket: active.ticket.ticket,
					attachPath: active.ticket.attachPath
				},
				timeoutMs: 0,
				onProgress: () => {},
				signal: active.controller.signal
			});
			const invocationFinished = active.invocation.then((result) => {
				throw invocationError(result);
			});
			invocationFinished.catch(() => void 0);
			let attached;
			try {
				attached = await Promise.race([active.ticket.attached, invocationFinished]);
			} catch (error) {
				await stopActiveStream(active);
				session.active.delete(active);
				throw error;
			}
			active.stream = attached.stream;
			let password;
			try {
				if (attached.auth === "vnc-password") {
					password = attached.vncPassword ?? request.credentials?.password;
					if (!password) throw new DesktopCredentialsRequiredError("vnc-password", "VNC password is required to observe this node");
					registerSecretValueForRedaction(password);
				} else {
					const username = request.credentials?.username?.trim() ?? "";
					const ardPassword = request.credentials?.password ?? "";
					if (!username || !ardPassword) throw new DesktopCredentialsRequiredError("ard-account", "macOS account credentials are required to observe this node");
					registerSecretValueForRedaction(ardPassword);
				}
			} catch (error) {
				await stopActiveStream(active);
				session.active.delete(active);
				throw error;
			}
			const attachment = params.desktopRegistry.publishStream({
				sourceKey,
				ownerEpoch: session.ownerEpoch,
				stream: attached.stream,
				reservation: active.reservation
			});
			if (!attachment) {
				await stopActiveStream(active);
				session.active.delete(active);
				throw new Error("node desktop session was superseded before publication");
			}
			active.reservationTransferred = true;
			const credentials = request.credentials;
			const preauth = attached.auth === "ard-account" ? {
				auth: attached.auth,
				credentials: {
					username: credentials?.username?.trim() ?? "",
					password: credentials?.password ?? ""
				}
			} : {
				auth: attached.auth,
				credentials: { password: password ?? credentials?.password ?? "" }
			};
			const minted = mintDesktopObserverToken({
				sourceKey,
				ownerEpoch: session.ownerEpoch,
				control: request.control,
				attachment,
				preauth
			});
			active.unclaimedTimer = setTimeout(() => {
				if (params.desktopRegistry.hasPendingStream(attachment)) stopActiveStream(active).then(() => session.active.delete(active));
			}, Math.max(0, minted.expiresAtMs - Date.now()));
			active.unclaimedTimer.unref?.();
			active.invocation.finally(() => {
				retireActiveStream(active);
				session.active.delete(active);
			}).catch(() => void 0);
			return {
				transport: "rfb",
				wsPath: `/desktop/observe?token=${minted.token}`,
				expiresAtMs: minted.expiresAtMs,
				control: request.control,
				auth: attached.auth,
				preauthenticated: true
			};
		}
	};
}
//#endregion
export { createNodeDesktopService };
