import { r as closeOpenClawStateDatabase } from "../openclaw-state-db-DlCMR4eQ.js";
import { l as pruneExpiredAuditEvents, n as processExecutionIdentityAdmissionWork, o as pruneExpiredExecutionDecisionFacts, r as pruneExpiredExecutionIdentityContexts, s as recordExecutionDecisionFact, u as recordAuditEvent } from "../execution-identity-context-C5ir-Jwh.js";
import { parentPort, workerData } from "node:worker_threads";
//#region src/audit/audit-event-writer.worker.ts
/** Worker-thread entrypoint for serialized audit writes and retention maintenance. */
const AUDIT_MAINTENANCE_INTERVAL_MS = 60 * 6e4;
const stateDir = workerData && typeof workerData === "object" && typeof workerData.stateDir === "string" ? workerData.stateDir : void 0;
if (!parentPort || !stateDir) throw new Error("audit event writer requires a parent port and state directory");
const port = parentPort;
const database = { env: { OPENCLAW_STATE_DIR: stateDir } };
function executionIdentityFailureMessage(error) {
	const message = error instanceof Error ? error.message : String(error);
	if (message.includes("audit identity key is missing") || message.includes("audit identity key is corrupt")) return "audit execution identity key unavailable";
	if (message.includes("execution identity context conflict")) return "audit execution identity context conflict";
	if (message.includes("execution identity recovery evidence unavailable")) return "audit execution identity recovery evidence unavailable";
	if (message.includes("admission envelope") || message.includes("admission work") || message.includes("admission token")) return "audit execution identity envelope rejected";
	return "audit execution identity persistence failed";
}
function reportMaintenance() {
	try {
		pruneExpiredAuditEvents({ database });
	} catch (error) {
		port.postMessage({
			type: "maintenance-error",
			error: String(error)
		});
	}
	try {
		pruneExpiredExecutionIdentityContexts({ database });
	} catch (error) {
		port.postMessage({
			type: "maintenance-error",
			error: String(error)
		});
	}
	try {
		pruneExpiredExecutionDecisionFacts({ database });
	} catch (error) {
		port.postMessage({
			type: "maintenance-error",
			error: String(error)
		});
	}
}
reportMaintenance();
const maintenanceTimer = setInterval(reportMaintenance, AUDIT_MAINTENANCE_INTERVAL_MS);
port.postMessage({ type: "ready" });
port.on("message", (message) => {
	if (message.type === "record-event") {
		try {
			recordAuditEvent(message.input, database);
			port.postMessage({ type: "recorded" });
		} catch (error) {
			port.postMessage({
				type: "record-error",
				error: String(error)
			});
		}
		return;
	}
	if (message.type === "record-execution-identity") {
		try {
			processExecutionIdentityAdmissionWork(message.work, database);
			port.postMessage({ type: "recorded" });
		} catch (error) {
			port.postMessage({
				type: "record-error",
				error: executionIdentityFailureMessage(error)
			});
		}
		return;
	}
	if (message.type === "record-execution-decision") {
		try {
			recordExecutionDecisionFact(message.receipt, database);
			port.postMessage({ type: "recorded" });
		} catch {
			port.postMessage({
				type: "record-error",
				error: "audit execution decision rejected"
			});
		}
		return;
	}
	clearInterval(maintenanceTimer);
	reportMaintenance();
	try {
		closeOpenClawStateDatabase();
	} catch (error) {
		port.postMessage({
			type: "maintenance-error",
			error: String(error)
		});
	}
	port.postMessage({ type: "stopped" });
	port.close();
});
//#endregion
export {};
