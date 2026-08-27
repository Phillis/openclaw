import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "../../errors-Ccx0R-_Z.js";
import "../../error-runtime-CmA1H4Zg.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
//#region extensions/matrix/src/plugin-entry.runtime.ts
const loadMatrixVerificationRuntime = createLazyRuntimeModule(() => import("../../verification-CHzoVHqB.js"));
function sendError(respond, err) {
	respond(false, { error: formatErrorMessage(err) });
}
async function handleVerifyRecoveryKey({ params, respond }) {
	try {
		const { verifyMatrixRecoveryKey } = await loadMatrixVerificationRuntime();
		const key = normalizeOptionalString(params?.key);
		if (!key) {
			respond(false, { error: "key required" });
			return;
		}
		const result = await verifyMatrixRecoveryKey(key, { accountId: normalizeOptionalString(params?.accountId) });
		respond(result.success, result);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationBootstrap({ params, respond }) {
	try {
		const { bootstrapMatrixVerification } = await loadMatrixVerificationRuntime();
		const result = await bootstrapMatrixVerification({
			accountId: normalizeOptionalString(params?.accountId),
			recoveryKey: typeof params?.recoveryKey === "string" ? params.recoveryKey : void 0,
			forceResetCrossSigning: params?.forceResetCrossSigning === true
		});
		respond(result.success, result);
	} catch (err) {
		sendError(respond, err);
	}
}
async function handleVerificationStatus({ params, respond }) {
	try {
		const { getMatrixVerificationStatus } = await loadMatrixVerificationRuntime();
		respond(true, await getMatrixVerificationStatus({
			accountId: normalizeOptionalString(params?.accountId),
			includeRecoveryKey: params?.includeRecoveryKey === true
		}));
	} catch (err) {
		sendError(respond, err);
	}
}
//#endregion
export { handleVerificationBootstrap, handleVerificationStatus, handleVerifyRecoveryKey };
