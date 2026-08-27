import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-connection-notifications.ts
const DEFAULT_PRIMARY_DELAY_MS = 750;
const DEFAULT_FALLBACK_DELAY_MS = 5e3;
function isMacNotificationNode(node) {
	const platform = node.platform?.trim().toLowerCase() ?? "";
	return (platform === "darwin" || platform.startsWith("macos")) && node.commands.includes("system.notify");
}
function compareActivity(left, right) {
	const activeDelta = (right.lastActiveAtMs ?? -1) - (left.lastActiveAtMs ?? -1);
	if (activeDelta !== 0) return activeDelta;
	return (right.presenceUpdatedAtMs ?? -1) - (left.presenceUpdatedAtMs ?? -1);
}
function connectionLabel(node) {
	return sliceUtf16Safe((normalizeOptionalString(node.displayName) ?? node.nodeId).replace(/\s+/g, " "), 0, 80);
}
/** One gateway-runtime router with short-lived first-connection timers. */
var NodeConnectionNotificationRouter = class {
	constructor(registry, options = {}) {
		this.registry = registry;
		this.pendingByNodeId = /* @__PURE__ */ new Map();
		this.primaryDelayMs = options.primaryDelayMs ?? DEFAULT_PRIMARY_DELAY_MS;
		this.fallbackDelayMs = options.fallbackDelayMs ?? DEFAULT_FALLBACK_DELAY_MS;
	}
	onConnected(source, isFirstConnection) {
		if (!isFirstConnection && !this.pendingByNodeId.has(source.nodeId)) return;
		const previous = this.pendingByNodeId.get(source.nodeId);
		if (previous?.timer) clearTimeout(previous.timer);
		const pending = {
			nodeId: source.nodeId,
			connId: source.connId,
			pairingIdentity: source.pairingIdentity,
			pairingGeneration: source.pairingGeneration
		};
		this.pendingByNodeId.set(source.nodeId, pending);
		this.armTimer(pending, this.primaryDelayMs, () => this.deliverPrimary(pending));
	}
	dispose() {
		for (const pending of this.pendingByNodeId.values()) if (pending.timer) clearTimeout(pending.timer);
		this.pendingByNodeId.clear();
	}
	async deliverPrimary(pending) {
		const connected = await this.registry.listCurrentConnected();
		const source = this.currentSource(pending, connected);
		if (!source) {
			this.finishAlert(pending);
			return;
		}
		const primary = this.notificationTargets(connected).filter((node) => node.lastActiveAtMs !== void 0).toSorted(compareActivity).at(0);
		const delivered = primary ? await this.notify(primary, source, pending) : false;
		if (!this.attemptIsCurrent(pending)) return;
		if (delivered) {
			this.finishAlert(pending);
			return;
		}
		this.armTimer(pending, this.fallbackDelayMs, () => this.deliverFallback(pending, primary?.connId));
	}
	async deliverFallback(pending, attemptedConnId) {
		const connected = await this.registry.listCurrentConnected();
		const source = this.currentSource(pending, connected);
		if (!source) {
			this.finishAlert(pending);
			return;
		}
		const targets = this.notificationTargets(connected).filter((node) => node.connId !== attemptedConnId);
		await Promise.all(targets.map(async (node) => await this.notify(node, source, pending)));
		if (this.attemptIsCurrent(pending)) this.finishAlert(pending);
	}
	currentSource(pending, connected) {
		if (!this.attemptIsCurrent(pending)) return;
		return connected.find((node) => node.nodeId === pending.nodeId && node.connId === pending.connId && node.pairingIdentity === pending.pairingIdentity && node.pairingGeneration === pending.pairingGeneration);
	}
	attemptIsCurrent(pending) {
		return this.pendingByNodeId.get(pending.nodeId) === pending;
	}
	finishAlert(pending) {
		if (this.attemptIsCurrent(pending)) {
			if (pending.timer) clearTimeout(pending.timer);
			this.pendingByNodeId.delete(pending.nodeId);
		}
	}
	notificationTargets(connected) {
		return connected.filter(isMacNotificationNode);
	}
	async sourceIsCurrent(pending) {
		if (!this.attemptIsCurrent(pending)) return false;
		const connected = await this.registry.listCurrentConnected();
		if (!this.currentSource(pending, connected)) return false;
		return await this.registry.isConnectionCurrentPairingState(pending.connId);
	}
	async notify(target, source, pending) {
		try {
			if (!await this.sourceIsCurrent(pending) || !this.attemptIsCurrent(pending)) return false;
			return (await this.registry.invoke({
				nodeId: target.nodeId,
				expectedConnId: target.connId,
				expectedPairingGeneration: target.pairingGeneration,
				command: "system.notify",
				params: {
					title: "Node connected",
					body: `${connectionLabel(source)} connected to OpenClaw.`,
					priority: "active",
					delivery: "auto"
				},
				timeoutMs: 1e4,
				idempotencyKey: randomUUID()
			})).ok;
		} catch {
			return false;
		}
	}
	armTimer(pending, delayMs, deliver) {
		if (pending.timer) clearTimeout(pending.timer);
		pending.timer = setTimeout(() => {
			pending.timer = void 0;
			deliver();
		}, delayMs);
	}
};
const routersByRegistry = /* @__PURE__ */ new WeakMap();
/** Schedules a staged alert for one newly connected node. */
function scheduleNodeConnectionNotification(registry, source, options) {
	let router = routersByRegistry.get(registry);
	if (!options.isFirstConnection && !router) return;
	if (!router) {
		router = new NodeConnectionNotificationRouter(registry);
		routersByRegistry.set(registry, router);
	}
	router.onConnected(source, options.isFirstConnection);
}
/** Cancels staged alerts owned by a gateway node registry during shutdown. */
function disposeNodeConnectionNotifications(registry) {
	const router = routersByRegistry.get(registry);
	if (!router) return;
	router.dispose();
	routersByRegistry.delete(registry);
}
//#endregion
export { scheduleNodeConnectionNotification as n, disposeNodeConnectionNotifications as t };
