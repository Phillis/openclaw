import { B as cloneCronRuntimeAuthority } from "./row-codec-BXU8Ei5n.js";
import { randomBytes } from "node:crypto";
//#region src/gateway/cron-creator-authority-grant.ts
const grantsByToken = /* @__PURE__ */ new Map();
function expiredAuthorityError() {
	return Object.assign(/* @__PURE__ */ new TypeError("Configured MCP cron authority is no longer active for this run. Retry the automation mutation from the active local operator turn."), {
		name: "CronCreatorAuthorityExpiredError",
		status: 403
	});
}
function createCronCreatorAuthorityRunScope(runId) {
	const abortController = new AbortController();
	return {
		runId,
		signal: abortController.signal,
		grantTokens: /* @__PURE__ */ new Set(),
		active: true,
		abort: () => abortController.abort(expiredAuthorityError())
	};
}
function mintCronCreatorAuthorityGrant(scope, operationSignal, runtimeAuthority) {
	if (!scope.active || scope.signal.aborted || operationSignal?.aborted) throw expiredAuthorityError();
	const token = randomBytes(32).toString("base64url");
	const normalizedRuntimeAuthority = runtimeAuthority ? cloneCronRuntimeAuthority(runtimeAuthority) : void 0;
	if (runtimeAuthority && !normalizedRuntimeAuthority) throw new TypeError("cron creator runtime authority is invalid");
	const entry = {
		scope,
		operationSignal,
		...normalizedRuntimeAuthority ? { runtimeAuthority: normalizedRuntimeAuthority } : {}
	};
	if (operationSignal) entry.onOperationAbort = () => revokeCronCreatorAuthorityGrant(token);
	grantsByToken.set(token, entry);
	scope.grantTokens.add(token);
	if (operationSignal && entry.onOperationAbort) operationSignal.addEventListener("abort", entry.onOperationAbort, { once: true });
	return Object.freeze({
		runId: scope.runId,
		token
	});
}
function revokeCronCreatorAuthorityGrant(token) {
	const entry = grantsByToken.get(token);
	if (!entry) return;
	grantsByToken.delete(token);
	entry.scope.grantTokens.delete(token);
	if (entry.operationSignal && entry.onOperationAbort) entry.operationSignal.removeEventListener("abort", entry.onOperationAbort);
}
function revokeCronCreatorAuthorityRunScope(scope) {
	if (!scope.active) return;
	scope.active = false;
	scope.abort();
	for (const token of scope.grantTokens) revokeCronCreatorAuthorityGrant(token);
}
/** Consumes one live exact-run grant synchronously at the cron commit boundary. */
function consumeCronCreatorAuthorityGrant(grant) {
	const runId = grant.runId.trim();
	const token = grant.token.trim();
	const entry = token ? grantsByToken.get(token) : void 0;
	if (!entry) throw expiredAuthorityError();
	const scope = entry.scope;
	if (!scope.active || scope.signal.aborted || entry.operationSignal?.aborted || scope.runId !== runId) {
		if (!scope.active || scope.signal.aborted || entry.operationSignal?.aborted) revokeCronCreatorAuthorityGrant(token);
		throw expiredAuthorityError();
	}
	revokeCronCreatorAuthorityGrant(token);
	return entry.runtimeAuthority ? cloneCronRuntimeAuthority(entry.runtimeAuthority) : void 0;
}
//#endregion
export { revokeCronCreatorAuthorityRunScope as i, createCronCreatorAuthorityRunScope as n, mintCronCreatorAuthorityGrant as r, consumeCronCreatorAuthorityGrant as t };
