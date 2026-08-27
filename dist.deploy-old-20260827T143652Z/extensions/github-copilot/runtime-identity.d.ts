//#region extensions/github-copilot/runtime-identity.d.ts
declare const COPILOT_RUNTIME_INTEGRATION_ID = "copilot-developer-cli";
/** Build the static request identity shared by Copilot inference transports. */
declare function buildCopilotRuntimeHeaders(): Record<string, string>;
//#endregion
export { COPILOT_RUNTIME_INTEGRATION_ID, buildCopilotRuntimeHeaders };