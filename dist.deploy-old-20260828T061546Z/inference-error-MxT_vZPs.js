import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
//#region src/system-agent/inference-error.ts
const INFERENCE_UNAVAILABLE_MESSAGE = "OpenClaw could not reach working inference. Run `openclaw onboard` on the machine running OpenClaw to reconnect — it live-tests the route before saving it. Then try again.";
const INFERENCE_FAILURE_SUMMARY_MAX_CHARS = 300;
function inferenceUnavailableMessage(failures) {
	const detail = failures.length > 0 ? formatErrorMessage(failures[0]).trim() : "";
	if (!detail) return INFERENCE_UNAVAILABLE_MESSAGE;
	const summary = detail.length > INFERENCE_FAILURE_SUMMARY_MAX_CHARS ? `${truncateUtf16Safe(detail, INFERENCE_FAILURE_SUMMARY_MAX_CHARS - 1)}…` : detail;
	return `${INFERENCE_UNAVAILABLE_MESSAGE} Cause: ${summary}`;
}
/** Safe public error for an OpenClaw turn that could not complete with intelligence. */
var SystemAgentInferenceUnavailableError = class extends Error {
	constructor(stage, failures = []) {
		super(inferenceUnavailableMessage(failures));
		this.stage = stage;
		this.failures = failures;
		this.code = "SYSTEM_AGENT_INFERENCE_UNAVAILABLE";
		this.name = "SystemAgentInferenceUnavailableError";
	}
};
function isSystemAgentInferenceUnavailableError(error) {
	return error instanceof SystemAgentInferenceUnavailableError || error instanceof Error && "code" in error && error.code === "SYSTEM_AGENT_INFERENCE_UNAVAILABLE";
}
//#endregion
export { isSystemAgentInferenceUnavailableError as n, SystemAgentInferenceUnavailableError as t };
