import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { i as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-BxSN0sUe.js";
import crypto from "node:crypto";
//#region src/gateway/mcp-grant-store.ts
const clientGrantRevocationListeners = /* @__PURE__ */ new Set();
const DEFAULT_TTL_MS = 3600 * 1e3;
const MAX_TTL_MS = 720 * 60 * 1e3;
const grantsByToken = resolveGlobalMap(Symbol.for("openclaw.mcpAttachGrants"), "close-and-restart");
const clientGrantsByToken = resolveGlobalMap(Symbol.for("openclaw.mcpLoopbackClientGrants"), "close-and-restart");
function clampTtlMs(ttlMs) {
	if (!Number.isFinite(ttlMs) || ttlMs <= 0) return DEFAULT_TTL_MS;
	return Math.min(ttlMs, MAX_TTL_MS);
}
function mintAttachGrant(params) {
	const sessionKey = params.sessionKey?.trim() ?? "";
	if (!sessionKey) throw new Error("mintAttachGrant: sessionKey is required");
	const agentId = sessionKey === "global" ? params.agentId?.trim() || void 0 : void 0;
	const nowMs = params.nowMs ?? Date.now();
	sweepExpiredAttachGrants(nowMs);
	const grant = {
		token: crypto.randomBytes(32).toString("hex"),
		sessionKey,
		...agentId ? { agentId } : {},
		issuedAtMs: nowMs,
		expiresAtMs: nowMs + clampTtlMs(params.ttlMs)
	};
	grantsByToken.set(grant.token, grant);
	return grant;
}
function resolveAttachGrant(token, nowMs = Date.now()) {
	const grant = grantsByToken.get(token);
	if (!grant) return;
	if (nowMs >= grant.expiresAtMs) {
		grantsByToken.delete(token);
		return;
	}
	return grant;
}
function revokeAttachGrant(token) {
	return grantsByToken.delete(token);
}
/** Revokes every attach grant minted for one session. Returns the count removed. */
function revokeAttachGrantsForSession(sessionKey) {
	const key = sessionKey.trim();
	let removed = 0;
	for (const [token, grant] of grantsByToken) if (grant.sessionKey === key) {
		grantsByToken.delete(token);
		removed += 1;
	}
	return removed;
}
function sweepExpiredAttachGrants(nowMs = Date.now()) {
	let removed = 0;
	for (const [token, grant] of grantsByToken) if (nowMs >= grant.expiresAtMs) {
		grantsByToken.delete(token);
		removed += 1;
	}
	return removed;
}
function mintMcpLoopbackClientGrant(params) {
	const sessionKey = params.context.sessionKey.trim();
	if (!sessionKey) throw new Error("mintMcpLoopbackClientGrant: context.sessionKey is required");
	const runtimeOwnerToken = params.runtimeOwnerToken.trim();
	if (!runtimeOwnerToken) throw new Error("mintMcpLoopbackClientGrant: runtimeOwnerToken is required");
	const grant = {
		token: crypto.randomBytes(32).toString("hex"),
		context: structuredClone({
			...params.context,
			sessionKey
		}),
		runtimeOwnerToken,
		...params.admittedRunContext ? { admittedRunContext: params.admittedRunContext } : {},
		...params.toolAuth ? { toolAuth: structuredClone(params.toolAuth) } : {}
	};
	clientGrantsByToken.set(grant.token, grant);
	return structuredClone({
		token: grant.token,
		context: grant.context
	});
}
/** Attaches the exact late CLI admission before the grant can execute tools. */
function bindMcpLoopbackClientGrantAdmission(params) {
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken || grant.admittedRunContext && grant.admittedRunContext !== params.admittedRunContext) return false;
	clientGrantsByToken.set(params.token, {
		...grant,
		admittedRunContext: params.admittedRunContext
	});
	return true;
}
/** Bind the active execution attempt's capture before its child process starts. */
function activateMcpLoopbackClientGrantCapture(params) {
	const captureKey = params.captureKey.trim();
	if (!captureKey) throw new Error("activateMcpLoopbackClientGrantCapture: captureKey is required");
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken) return false;
	clientGrantsByToken.set(params.token, {
		...grant,
		activeCaptureKey: captureKey
	});
	return true;
}
/** Release only the attempt that still owns this grant's active capture. */
function deactivateMcpLoopbackClientGrantCapture(params) {
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken || grant.activeCaptureKey !== params.captureKey) return false;
	const { activeCaptureKey: _activeCaptureKey, ...inactiveGrant } = grant;
	clientGrantsByToken.set(params.token, inactiveGrant);
	return true;
}
function resolveMcpLoopbackClientGrant(params) {
	const grant = clientGrantsByToken.get(params.token);
	if (!grant || grant.runtimeOwnerToken !== params.runtimeOwnerToken || !grant.admittedRunContext || !getAdmittedRunDelegatedAuthority(grant.admittedRunContext) || !grant.activeCaptureKey || grant.activeCaptureKey !== params.captureKey) return;
	return {
		context: structuredClone(grant.context),
		captureKey: grant.activeCaptureKey,
		...grant.admittedRunContext ? { admittedRunContext: grant.admittedRunContext } : {},
		...grant.toolAuth ? { toolAuth: grant.toolAuth } : {}
	};
}
/** Registers cleanup tied to the exact lifetime of loopback client grants. */
function registerMcpLoopbackClientGrantRevocationListener(listener) {
	clientGrantRevocationListeners.add(listener);
	return () => clientGrantRevocationListeners.delete(listener);
}
function revokeMcpLoopbackClientGrant(token) {
	const grant = clientGrantsByToken.get(token);
	if (!grant || !clientGrantsByToken.delete(token)) return false;
	for (const listener of clientGrantRevocationListeners) listener({
		token,
		runtimeOwnerToken: grant.runtimeOwnerToken
	});
	return true;
}
function revokeMcpLoopbackClientGrantsForRuntime(runtimeOwnerToken) {
	let removed = 0;
	for (const [token, grant] of clientGrantsByToken) if (grant.runtimeOwnerToken === runtimeOwnerToken) removed += revokeMcpLoopbackClientGrant(token) ? 1 : 0;
	return removed;
}
//#endregion
export { mintMcpLoopbackClientGrant as a, resolveMcpLoopbackClientGrant as c, revokeMcpLoopbackClientGrant as d, revokeMcpLoopbackClientGrantsForRuntime as f, mintAttachGrant as i, revokeAttachGrant as l, bindMcpLoopbackClientGrantAdmission as n, registerMcpLoopbackClientGrantRevocationListener as o, deactivateMcpLoopbackClientGrantCapture as r, resolveAttachGrant as s, activateMcpLoopbackClientGrantCapture as t, revokeAttachGrantsForSession as u };
