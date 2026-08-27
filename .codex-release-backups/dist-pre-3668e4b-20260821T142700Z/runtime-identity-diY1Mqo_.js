import { s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-C42FH9jo.js";
import "./provider-auth-DqOUi0El.js";
//#region extensions/github-copilot/runtime-identity.ts
const COPILOT_RUNTIME_INTEGRATION_ID = "copilot-developer-cli";
/** Build the static request identity shared by Copilot inference transports. */
function buildCopilotRuntimeHeaders() {
	return {
		...buildCopilotIdeHeaders(),
		"Copilot-Integration-Id": COPILOT_RUNTIME_INTEGRATION_ID,
		"Openai-Organization": "github-copilot"
	};
}
//#endregion
export { buildCopilotRuntimeHeaders as n, COPILOT_RUNTIME_INTEGRATION_ID as t };
