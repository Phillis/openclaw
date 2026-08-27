import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import "./server-utils-C6TbeiRj.js";
//#region src/gateway/talk-session-registry.ts
/**
* Process-local registry that lets Talk protocol methods resolve opaque
* `sessionId` values to the concrete relay or managed-room backend.
*/
const unifiedTalkSessions = resolveGlobalMap(Symbol.for("openclaw.unifiedTalkSessions"), "close-and-restart");
const talkConnectionCleanups = resolveGlobalMap(Symbol.for("openclaw.talkConnectionCleanups"), "close-and-restart");
/**
* Keeps one owner cleanup per relay kind until the connection closes.
* Replacing by kind stays bounded while the owner cleanup scans all live sessions.
*/
function registerTalkConnectionCleanup(connId, kind, cleanup) {
	const cleanups = talkConnectionCleanups.get(connId) ?? /* @__PURE__ */ new Map();
	cleanups.set(kind, cleanup);
	talkConnectionCleanups.set(connId, cleanups);
}
/** Runs and forgets every Talk cleanup owned by a disconnected gateway connection. */
function cleanupTalkConnection(connId, log) {
	const cleanups = talkConnectionCleanups.get(connId);
	if (!cleanups) return;
	talkConnectionCleanups.delete(connId);
	for (const [kind, cleanup] of cleanups) try {
		cleanup();
	} catch (error) {
		log.warn(`failed to run ${kind} Talk cleanup after connection disconnect: ${formatErrorMessage(error)}`);
	}
}
/** Associates a public Talk session id with its concrete gateway backend. */
function rememberUnifiedTalkSession(sessionId, session) {
	unifiedTalkSessions.set(sessionId, session);
}
/** Resolves a Talk session id or throws the protocol-facing unknown-session error. */
function getUnifiedTalkSession(sessionId) {
	const session = unifiedTalkSessions.get(sessionId);
	if (!session) throw new Error("Unknown Talk session");
	return session;
}
/** Removes a Talk session id after the concrete backend closes. */
function forgetUnifiedTalkSession(sessionId) {
	unifiedTalkSessions.delete(sessionId);
}
/** Enforces that a relay-backed Talk session is controlled by its owner socket. */
function requireUnifiedTalkSessionConn(session, connId) {
	if (!connId || session.connId !== connId) throw new Error("Talk session is not owned by this connection");
	return connId;
}
//#endregion
export { rememberUnifiedTalkSession as a, registerTalkConnectionCleanup as i, forgetUnifiedTalkSession as n, requireUnifiedTalkSessionConn as o, getUnifiedTalkSession as r, cleanupTalkConnection as t };
