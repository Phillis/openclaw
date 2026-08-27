//#region src/gateway/server-reload-contracts.ts
let currentReloadGeneration = 0;
let abortGeneration;
function nextGatewayReloadGeneration() {
	return ++currentReloadGeneration;
}
function isCurrentGatewayReloadGeneration(generation) {
	return generation === currentReloadGeneration;
}
function isGatewayReloadGenerationAborted(generation) {
	return abortGeneration !== void 0 && generation <= abortGeneration;
}
/** Signal any in-progress deferred channel reload to abort immediately. */
function abortPendingChannelReloads() {
	abortGeneration = currentReloadGeneration;
}
var GatewayHotReloadCancelledError = class extends Error {
	constructor() {
		super("config hot reload cancelled by config supersession or in-process restart");
		this.name = "GatewayHotReloadCancelledError";
	}
};
var GatewayHotReloadRecoveryError = class extends Error {
	constructor(surface) {
		super(`config hot reload committed but could not schedule recovery for ${surface}`);
		this.name = "GatewayHotReloadRecoveryError";
	}
};
var GatewayReloadRequiresRecoveryOwnerError = class extends Error {
	constructor(surface) {
		super(`config reload requires a managed gateway restart owner for ${surface}`);
		this.name = "GatewayReloadRequiresRecoveryOwnerError";
	}
};
var GatewayHotReloadStaleSecretsError = class extends Error {
	constructor() {
		super("runtime secrets changed while config hot reload was deferred");
		this.name = "GatewayHotReloadStaleSecretsError";
	}
};
var GatewayConfigReloadSupersededError = class extends Error {
	constructor() {
		super("config reload superseded by a newer runtime config source");
		this.name = "GatewayConfigReloadSupersededError";
	}
};
function assertReloadPublicationCurrent(publicationCurrent, restartStopped) {
	if (!publicationCurrent) throw new GatewayConfigReloadSupersededError();
	if (restartStopped) throw new GatewayHotReloadCancelledError();
}
//#endregion
export { GatewayReloadRequiresRecoveryOwnerError as a, isCurrentGatewayReloadGeneration as c, GatewayHotReloadStaleSecretsError as i, isGatewayReloadGenerationAborted as l, GatewayHotReloadCancelledError as n, abortPendingChannelReloads as o, GatewayHotReloadRecoveryError as r, assertReloadPublicationCurrent as s, GatewayConfigReloadSupersededError as t, nextGatewayReloadGeneration as u };
