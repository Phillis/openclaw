import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { t as listSystemPresence } from "./system-presence-5NV70380.js";
//#region src/gateway/server-methods/session-typing-state.ts
const TYPING_THROTTLE_MS = 1e3;
const TYPING_ACTIVE_TTL_MS = 2500;
const MAX_TYPING_THROTTLE_KEYS = 2048;
function clearSessionTypingStateValue(state) {
	for (const entry of state.broadcasts.values()) if (entry.timer) clearTimeout(entry.timer);
	state.broadcasts.clear();
	state.connections.clear();
}
const sessionTypingState = resolveGlobalSingleton(Symbol.for("openclaw.sessionTypingState"), () => ({
	broadcasts: /* @__PURE__ */ new Map(),
	connections: /* @__PURE__ */ new Map()
}), clearSessionTypingStateValue);
const typingBroadcastState = sessionTypingState.broadcasts;
const typingConnections = sessionTypingState.connections;
function clearSessionTypingState() {
	clearSessionTypingStateValue(sessionTypingState);
}
function liveViewerIdentities(sessionKeys) {
	return new Set(listSystemPresence().filter((entry) => entry.user?.id && entry.watchedSessions?.some((sessionKey) => sessionKeys.has(sessionKey))).map((entry) => entry.user?.id).filter((id) => Boolean(id)));
}
function rememberTypingBroadcast(key, state) {
	typingBroadcastState.delete(key);
	typingBroadcastState.set(key, state);
	if (typingBroadcastState.size <= MAX_TYPING_THROTTLE_KEYS) return;
	const oldestKey = typingBroadcastState.keys().next().value;
	if (!oldestKey) return;
	const oldest = typingBroadcastState.get(oldestKey);
	if (oldest?.timer) clearTimeout(oldest.timer);
	typingBroadcastState.delete(oldestKey);
}
function broadcastTypingThrottled(params) {
	const previous = typingBroadcastState.get(params.key);
	if (!previous || params.now - previous.at >= TYPING_THROTTLE_MS) {
		if (previous?.timer) clearTimeout(previous.timer);
		const emitted = params.emit();
		if (emitted) rememberTypingBroadcast(params.key, {
			at: params.now,
			typing: params.typing
		});
		else typingBroadcastState.delete(params.key);
		return emitted;
	}
	if (params.typing === previous.typing && previous.pending?.typing !== params.typing) {
		if (previous.timer) clearTimeout(previous.timer);
		delete previous.pending;
		delete previous.timer;
		if (!params.typing) {
			rememberTypingBroadcast(params.key, previous);
			return false;
		}
	}
	previous.pending = {
		typing: params.typing,
		emit: params.emit
	};
	if (!previous.timer) {
		const timer = setTimeout(() => {
			const current = typingBroadcastState.get(params.key);
			if (!current || current.timer !== timer || !current.pending) return;
			const pending = current.pending;
			const next = {
				at: Date.now(),
				typing: pending.typing
			};
			if (pending.emit()) rememberTypingBroadcast(params.key, next);
			else typingBroadcastState.delete(params.key);
		}, TYPING_THROTTLE_MS - (params.now - previous.at));
		timer.unref?.();
		previous.timer = timer;
	}
	rememberTypingBroadcast(params.key, previous);
	return false;
}
function updateTypingConnections(params) {
	for (const [typingKey, activeConnections] of typingConnections) {
		for (const [connectionId, updatedAt] of activeConnections) if (params.now - updatedAt >= TYPING_ACTIVE_TTL_MS) activeConnections.delete(connectionId);
		if (activeConnections.size === 0) typingConnections.delete(typingKey);
	}
	const connections = typingConnections.get(params.key) ?? /* @__PURE__ */ new Map();
	if (params.typing) connections.set(params.connectionId, params.now);
	else connections.delete(params.connectionId);
	if (connections.size === 0) {
		typingConnections.delete(params.key);
		return false;
	}
	typingConnections.delete(params.key);
	typingConnections.set(params.key, connections);
	pruneMapToMaxSize(typingConnections, MAX_TYPING_THROTTLE_KEYS);
	return true;
}
//#endregion
export { updateTypingConnections as i, clearSessionTypingState as n, liveViewerIdentities as r, broadcastTypingThrottled as t };
