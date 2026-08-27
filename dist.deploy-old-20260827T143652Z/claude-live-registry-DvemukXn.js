import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { p as resolveFailoverStatus, t as FailoverError } from "./failover-error-EKvoWJQa.js";
import { r as cliBackendLog } from "./log-ClSqV59J.js";
import { t as LIVE_SESSION_LIMITS } from "./claude-live-session-policy-D5q03_Jx.js";
//#region src/agents/cli-runner/claude-live-registry.ts
const liveSessions = /* @__PURE__ */ new Map();
const liveSessionCreates = /* @__PURE__ */ new Map();
const liveSessionTurns = new KeyedAsyncQueue();
function buildClaudeLiveOwnerKey(owner) {
	return `${owner.backendId}:${buildClaudeOwnerKey(owner)}`;
}
/** Hashes the account/agent/auth/session tuple shared by queue and registry ownership. */
function buildClaudeOwnerKey(input) {
	return sha256Hex(JSON.stringify({
		agentAccountId: input.agentAccountId,
		agentId: input.agentId,
		authProfileId: input.authProfileId,
		sessionId: input.sessionId,
		sessionKey: input.sessionKey
	}));
}
function buildClaudeLiveKey(context) {
	return buildClaudeLiveOwnerKey({
		backendId: context.backendResolved.id,
		agentAccountId: context.params.agentAccountId,
		agentId: context.params.agentId,
		authProfileId: context.effectiveAuthProfileId,
		sessionId: context.params.sessionId,
		sessionKey: context.params.sessionKey
	});
}
/** Returns whether this owner still has an in-process Claude stdio session. */
function hasClaudeSession(owner) {
	return getClaudeGeneration(owner) !== void 0;
}
/** Returns the opaque generation of this owner's current or pending Claude stdio session. */
function getClaudeGeneration(owner) {
	const key = buildClaudeLiveOwnerKey(owner);
	return liveSessions.get(key)?.generation ?? liveSessionCreates.get(key)?.generation;
}
function getClaudeSession(key) {
	return liveSessions.get(key);
}
function registerClaudeSession(session, pending) {
	if (liveSessionCreates.get(session.key) !== pending || pending.closeReason) {
		session.close(pending.closeReason ?? "restart");
		return;
	}
	liveSessions.set(session.key, session);
	cliBackendLog.info(`claude live session start: provider=${session.providerId} model=${session.modelId} activeSessions=${liveSessions.size}`);
}
function removeClaudeSession(session) {
	if (liveSessions.get(session.key) === session) liveSessions.delete(session.key);
}
function beginClaudeSessionCreate(key, generation) {
	const create = { generation };
	liveSessionCreates.set(key, create);
	return create;
}
function finishClaudeSessionCreate(key, create) {
	if (liveSessionCreates.get(key) === create) liveSessionCreates.delete(key);
}
function enqueueClaudeTurn(key, task) {
	return liveSessionTurns.enqueue(key, task);
}
/** Closes the live Claude session associated with a prepared run context, if one exists. */
async function closeClaudeSession(context, reason) {
	const key = buildClaudeLiveKey(context);
	const session = liveSessions.get(key);
	const pending = liveSessionCreates.get(key);
	if (session) session.close(reason);
	if (pending) {
		pending.closeReason = reason;
		liveSessionCreates.delete(key);
	}
	if (session) await session.waitForExit();
}
function closeOldestIdleSession() {
	for (const session of liveSessions.values()) if (session.isIdle()) {
		session.close("idle");
		return true;
	}
	return false;
}
function ensureClaudeSessionCapacity(key, context) {
	if (liveSessions.has(key) || liveSessionCreates.has(key) || liveSessions.size + liveSessionCreates.size < LIVE_SESSION_LIMITS.maxSessions) return;
	if (closeOldestIdleSession()) return;
	throw new FailoverError("Too many Claude CLI live sessions are active.", {
		reason: "rate_limit",
		provider: context.params.provider,
		model: context.modelId,
		status: resolveFailoverStatus("rate_limit")
	});
}
/** Closes all live Claude CLI sessions and clears creation promises for tests. */
function resetClaudeLiveSessionsForTest() {
	for (const session of liveSessions.values()) session.close("restart");
	liveSessions.clear();
	for (const pending of liveSessionCreates.values()) pending.closeReason = "restart";
	liveSessionCreates.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.claudeLiveRegistryReset")] = resetClaudeLiveSessionsForTest;
//#endregion
export { enqueueClaudeTurn as a, getClaudeGeneration as c, registerClaudeSession as d, removeClaudeSession as f, closeClaudeSession as i, getClaudeSession as l, buildClaudeLiveKey as n, ensureClaudeSessionCapacity as o, buildClaudeOwnerKey as r, finishClaudeSessionCreate as s, beginClaudeSessionCreate as t, hasClaudeSession as u };
