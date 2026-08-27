//#region extensions/acpx/src/runtime-proxy.ts
/** Start an ACP turn through a lazy runtime resolver without awaiting resolution up front. */
function lazyStartRuntimeTurn(resolveRuntime, input) {
	const turnPromise = resolveRuntime().then((runtime) => runtime.startTurn(input));
	return {
		requestId: input.requestId,
		get promptStarted() {
			return turnPromise.then((turn) => turn.promptStarted);
		},
		events: { async *[Symbol.asyncIterator]() {
			yield* (await turnPromise).events;
		} },
		result: turnPromise.then((turn) => turn.result),
		cancel(inputArgs) {
			return turnPromise.then((turn) => turn.cancel(inputArgs));
		},
		closeStream(inputArgs) {
			return turnPromise.then((turn) => turn.closeStream(inputArgs));
		}
	};
}
/** Create an ACP runtime facade backed by an async runtime resolver. */
function createLazyAcpRuntimeProxy(resolveRuntime) {
	return {
		async ensureSession(input) {
			return await (await resolveRuntime()).ensureSession(input);
		},
		startTurn(input) {
			return lazyStartRuntimeTurn(resolveRuntime, input);
		},
		async *runTurn(input) {
			yield* (await resolveRuntime()).runTurn(input);
		},
		async getCapabilities(input) {
			return await (await resolveRuntime()).getCapabilities(input);
		},
		async getStatus(input) {
			return await (await resolveRuntime()).getStatus(input);
		},
		async setMode(input) {
			await (await resolveRuntime()).setMode(input);
		},
		async setConfigOption(input) {
			await (await resolveRuntime()).setConfigOption(input);
		},
		async doctor() {
			return await (await resolveRuntime()).doctor();
		},
		async prepareFreshSession(input) {
			await (await resolveRuntime()).prepareFreshSession(input);
		},
		async cancel(input) {
			await (await resolveRuntime()).cancel(input);
		},
		async close(input) {
			await (await resolveRuntime()).close(input);
		}
	};
}
//#endregion
export { createLazyAcpRuntimeProxy as t };
