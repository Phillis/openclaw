//#region src/audit/audit-config.ts
/**
* The ledger is on by default: an audit trail enabled only after an incident
* cannot explain the incident. `logging.audit.enabled: false` stops new event inserts after
* restart; audit queries still serve retained rows until they expire.
*/
function isAuditLedgerEnabled(cfg) {
	return cfg?.logging?.audit?.enabled !== false;
}
/** Execution identity is retained only after an explicit startup-scoped opt-in. */
function isExecutionIdentityCollectionEnabled(cfg) {
	return isAuditLedgerEnabled(cfg) && cfg?.logging?.audit?.executionIdentity === true;
}
/** Message metadata remains an explicit opt-in inside the default-on ledger. */
function resolveAuditMessageMode(cfg) {
	return cfg?.logging?.audit?.messages ?? "off";
}
//#endregion
export { isExecutionIdentityCollectionEnabled as n, resolveAuditMessageMode as r, isAuditLedgerEnabled as t };
