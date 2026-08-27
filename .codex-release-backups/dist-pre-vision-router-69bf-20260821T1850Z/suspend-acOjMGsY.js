import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Gt as validateGatewaySuspendResumeParams, Kt as validateGatewaySuspendStatusParams, Wt as validateGatewaySuspendPrepareParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { i as resumeGatewaySuspend, n as prepareGatewaySuspend, t as getGatewaySuspendStatus } from "./gateway-suspend-coordinator-T8VpTk9u.js";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-DvXAfFIM.js";
//#region src/gateway/server-methods/suspend.ts
function invalidParams(method) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params`);
}
function schedulerRecoveryError(retryAfterMs) {
	return errorShape(ErrorCodes.UNAVAILABLE, "gateway scheduler recovery is pending", {
		retryable: true,
		retryAfterMs,
		details: { reason: "scheduler-resume-failed" }
	});
}
const suspendHandlers = {
	"gateway.suspend.prepare": async ({ respond, params, context }) => {
		if (!validateGatewaySuspendPrepareParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.prepare"));
			return;
		}
		const result = prepareGatewaySuspend({
			requestId: params.requestId.trim(),
			terminalPolicy: params.terminalPolicy ?? "preserve",
			pauseScheduling: () => context.cron.pauseScheduling(),
			resumeScheduling: () => context.cron.resumeScheduling(),
			inspect: createGatewayServerActiveWorkInspectors(context),
			warn: (message) => context.logGateway.warn(message)
		});
		if (result.status === "conflict") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "another gateway suspension is already prepared", {
				retryable: true,
				retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
				details: {
					reason: "gateway-suspension-conflict",
					expiresAtMs: result.expiresAtMs
				}
			}));
			return;
		}
		if (result.status === "recovering") {
			respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
			return;
		}
		respond(true, result);
	},
	"gateway.suspend.status": async ({ respond, params }) => {
		if (!validateGatewaySuspendStatusParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.status"));
			return;
		}
		const result = getGatewaySuspendStatus(params.suspensionId.trim());
		if (result.status === "conflict") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "a different gateway suspension is prepared", {
				retryable: true,
				retryAfterMs: Math.max(0, result.expiresAtMs - Date.now()),
				details: {
					reason: "gateway-suspension-conflict",
					expiresAtMs: result.expiresAtMs
				}
			}));
			return;
		}
		if (result.status === "recovering") {
			respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
			return;
		}
		respond(true, result);
	},
	"gateway.suspend.resume": async ({ respond, params }) => {
		if (!validateGatewaySuspendResumeParams(params)) {
			respond(false, void 0, invalidParams("gateway.suspend.resume"));
			return;
		}
		const result = resumeGatewaySuspend(params.suspensionId.trim());
		if (!result.ok) {
			if (result.reason === "scheduler-resume-failed") {
				respond(false, void 0, schedulerRecoveryError(result.retryAfterMs));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway suspension id does not match"));
			return;
		}
		respond(true, result);
	}
};
//#endregion
export { suspendHandlers };
