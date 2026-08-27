import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { i as revokeCronCreatorAuthorityRunScope, n as createCronCreatorAuthorityRunScope, r as mintCronCreatorAuthorityGrant } from "./cron-creator-authority-grant-D3euz7r4.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/cron-creator-authority-context.ts
function createCronCreatorAuthorityCapability(runId) {
	const normalizedRunId = runId.trim();
	return normalizedRunId ? createCronCreatorAuthorityRunScope(normalizedRunId) : void 0;
}
const activeCronCreatorAuthority = new AsyncLocalStorage();
const activeCronCreatorAuthorityResolver = new AsyncLocalStorage();
function shouldAdmitFreshChannelOwnerCronAuthority(params) {
	return params.senderIsOwner && Boolean(params.messageProvider) && Boolean(normalizeOptionalString(params.senderId)) && !params.isHeartbeat && !params.isRoomEvent && params.inputProvenance === void 0 && params.spawnedBy === void 0 && params.suppressNextUserMessagePersistence !== true;
}
/** Owns one explicitly transported creator-authority capability until run settlement. */
function runWithCronCreatorAuthorityCapability(scope, run, signal) {
	const revoke = () => revokeCronCreatorAuthorityRunScope(scope);
	signal?.addEventListener("abort", revoke, { once: true });
	if (signal?.aborted) revoke();
	try {
		const result = activeCronCreatorAuthority.run(scope, run);
		if (isPromiseLike(result)) return Promise.resolve(result).finally(() => {
			signal?.removeEventListener("abort", revoke);
			revoke();
		});
		signal?.removeEventListener("abort", revoke);
		revoke();
		return result;
	} catch (error) {
		signal?.removeEventListener("abort", revoke);
		revoke();
		throw error;
	}
}
/** Combines an admitted capability with a late exact-thread tool-surface resolver. */
function bindCronCreatorAuthorityResolver(params) {
	const normalizedRunId = params.runId?.trim();
	const authority = params.capability;
	if (!normalizedRunId || authority?.active !== true || authority.runId !== normalizedRunId) return;
	return async (options) => {
		const operationSignal = options?.signal;
		authority.signal.throwIfAborted();
		operationSignal?.throwIfAborted();
		const signal = operationSignal ? AbortSignal.any([authority.signal, operationSignal]) : authority.signal;
		const snapshot = await params.resolve({ signal });
		authority.signal.throwIfAborted();
		operationSignal?.throwIfAborted();
		if (!authority.active) authority.signal.throwIfAborted();
		return Object.freeze({
			tools: snapshot.tools,
			provenance: snapshot.provenance,
			grant: mintCronCreatorAuthorityGrant(authority, operationSignal, snapshot.runtimeAuthority)
		});
	};
}
/** Installs an explicitly transported capability only for synchronous tool construction. */
function runWithCronCreatorAuthorityCapabilityResolver(params) {
	const normalizedRunId = params.runId?.trim();
	const authority = params.capability;
	if (!normalizedRunId || authority?.active !== true || authority.runId !== normalizedRunId) return params.run();
	return activeCronCreatorAuthority.run(authority, () => activeCronCreatorAuthorityResolver.run({
		runId: normalizedRunId,
		resolve: params.resolve
	}, params.run));
}
/** Carries a bundled-Codex resolver through synchronous core tool construction. */
function runWithCronCreatorAuthorityResolver(params) {
	return activeCronCreatorAuthorityResolver.run({
		runId: params.runId.trim(),
		resolve: params.resolve
	}, params.run);
}
/** Binds the resolver to the exact active run and revokes retained callbacks at settlement. */
function bindActiveCronCreatorAuthorityResolver(runId) {
	const authority = activeCronCreatorAuthority.getStore();
	const resolver = activeCronCreatorAuthorityResolver.getStore();
	const normalizedRunId = runId?.trim();
	if (!normalizedRunId || resolver?.runId !== normalizedRunId) return;
	return bindCronCreatorAuthorityResolver({
		capability: authority,
		runId: normalizedRunId,
		resolve: resolver.resolve
	});
}
//#endregion
export { runWithCronCreatorAuthorityResolver as a, runWithCronCreatorAuthorityCapabilityResolver as i, createCronCreatorAuthorityCapability as n, shouldAdmitFreshChannelOwnerCronAuthority as o, runWithCronCreatorAuthorityCapability as r, bindActiveCronCreatorAuthorityResolver as t };
