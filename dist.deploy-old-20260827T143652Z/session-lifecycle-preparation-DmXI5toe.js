//#region src/gateway/session-lifecycle-preparation.ts
async function rollbackGatewaySessionPreparation(params) {
	try {
		await params.prepared?.rollback?.();
	} catch (error) {
		params.onError?.(error);
	}
}
//#endregion
export { rollbackGatewaySessionPreparation as t };
