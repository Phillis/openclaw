import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { h as redactSecretDegradationReason, t as SECRET_DEGRADATION_RETRY_HINT } from "./runtime-degraded-state-D5EZZ925.js";
//#region src/commands/doctor-secret-runtime-degradation.ts
const DOCTOR_SECRET_OWNER_ID_MAX_CHARS = 96;
const DOCTOR_SECRET_OWNER_PATH_MAX_CHARS = 120;
const DOCTOR_SECRET_OWNER_VISIBLE_PATHS = 3;
function safeDoctorSecretOwnerText(value, maxChars) {
	const safe = sanitizeTerminalText(redactSensitiveUrlLikeString(value));
	return safe.length <= maxChars ? safe : `${truncateUtf16Safe(safe, maxChars - 1)}…`;
}
/** Projects Gateway-owned secret degradation into the shared bounded Doctor display shape. */
function projectDoctorSecretRuntimeDegradations(status) {
	return (status.degradedSecretOwners ?? []).map((owner) => {
		const ownerId = safeDoctorSecretOwnerText(owner.ownerId, DOCTOR_SECRET_OWNER_ID_MAX_CHARS);
		const target = `${owner.ownerKind}:${ownerId}`;
		const visiblePaths = owner.paths.slice(0, DOCTOR_SECRET_OWNER_VISIBLE_PATHS).map((configPath) => safeDoctorSecretOwnerText(configPath, DOCTOR_SECRET_OWNER_PATH_MAX_CHARS));
		const omittedPaths = owner.paths.length - visiblePaths.length;
		const paths = visiblePaths.join(", ") + (omittedPaths > 0 ? ` (+${omittedPaths} paths omitted)` : "");
		return {
			message: `${owner.degradationState ?? "cold"} ${target} (${paths || "no affected paths reported"}): ${redactSecretDegradationReason(owner.reason)}`,
			path: visiblePaths[0] ?? "gateway",
			target,
			retryHint: SECRET_DEGRADATION_RETRY_HINT
		};
	});
}
//#endregion
export { projectDoctorSecretRuntimeDegradations as t };
