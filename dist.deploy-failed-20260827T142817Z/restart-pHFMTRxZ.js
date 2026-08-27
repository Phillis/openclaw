import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as readActiveGatewayLockIdentity } from "./gateway-lock-EiOnxvh_.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as requestGatewayRestartWithSignalAdmission } from "./restart-B3HJgSVH.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as scheduleSafeGatewayRestart, t as createSafeGatewayRestartPreflight } from "./restart-coordinator-BslexF3N.js";
//#region src/gateway/server-methods/restart.ts
function isRestartRequestParams(value) {
	return isRecord(value);
}
function normalizeReason(value) {
	return typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), 200) : void 0;
}
function normalizeSkipDeferral(value) {
	return value === true;
}
function parseTargetedGatewayRestart(value) {
	if (value === void 0) return;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const target = value;
	if (typeof target.pid !== "number" || !Number.isSafeInteger(target.pid) || target.pid <= 0 || typeof target.ownerId !== "string" || !target.ownerId.trim() || typeof target.port !== "number" || !Number.isInteger(target.port) || target.port <= 0 || target.port > 65535) return null;
	return {
		pid: target.pid,
		ownerId: target.ownerId.trim(),
		port: target.port
	};
}
function parseTargetedRestartIntent(value, reason) {
	if (value !== void 0 && (!value || typeof value !== "object" || Array.isArray(value))) return null;
	const raw = value ?? {};
	const force = raw.force === true;
	const waitMs = typeof raw.waitMs === "number" && Number.isSafeInteger(raw.waitMs) && raw.waitMs >= 0 && raw.waitMs <= 2147e6 ? raw.waitMs : void 0;
	if (raw.force !== void 0 && typeof raw.force !== "boolean" || raw.waitMs !== void 0 && waitMs === void 0 || force && waitMs !== void 0) return null;
	return {
		...reason ? { reason } : {},
		...force ? { force: true } : {},
		...waitMs !== void 0 ? { waitMs } : {}
	};
}
/** Gateway request handlers for safe restart coordination. */
const restartHandlers = {
	"gateway.restart.request": async ({ respond, params }) => {
		if (!isRestartRequestParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid gateway.restart.request params"));
			return;
		}
		const reason = normalizeReason(params.reason);
		const target = parseTargetedGatewayRestart(params.target);
		if (target === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart"));
			return;
		}
		if (target) {
			const intent = parseTargetedRestartIntent(params.restartIntent, reason);
			if (!intent) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart intent"));
				return;
			}
			const activeLock = await readActiveGatewayLockIdentity().catch(() => void 0);
			if (!activeLock || activeLock.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "target gateway no longer owns the active lock"));
				return;
			}
			const result = requestGatewayRestartWithSignalAdmission(reason, intent);
			if (result.status === "failed") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "target gateway restart delivery failed"));
				return;
			}
			respond(true, {
				ok: true,
				status: result.status,
				pid: process.pid
			});
			return;
		}
		respond(true, scheduleSafeGatewayRestart({
			reason,
			delayMs: 0,
			skipDeferral: normalizeSkipDeferral(params.skipDeferral)
		}));
	},
	"gateway.restart.preflight": async ({ respond }) => {
		respond(true, createSafeGatewayRestartPreflight());
	}
};
//#endregion
export { restartHandlers };
