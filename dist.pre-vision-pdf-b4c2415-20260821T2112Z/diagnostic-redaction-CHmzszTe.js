import { i as redactSecrets } from "./redact-Cl7lwBnl.js";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-DPHUXa81.js";
//#region src/agents/diagnostic-redaction.ts
function redactAgentDiagnosticPayload(value) {
	return redactSecrets(sanitizeDiagnosticPayload(value));
}
//#endregion
export { redactAgentDiagnosticPayload as t };
