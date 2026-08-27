import { o as toStructuredErrorObject } from "./error-coercion-DisD0JTb.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-gKE3myqW.js";
import { Ft as recordOpenClawDatabaseQuarantine, f as recordOpenClawStateDatabaseOpenFailure, o as confirmOpenClawStateDatabaseIntegrity } from "./openclaw-state-db-BciZ4rHE.js";
import { _ as recordOpenClawAgentDatabaseOpenFailure, s as confirmOpenClawAgentDatabaseIntegrity } from "./openclaw-agent-db-C8vnaZ56.js";
import { E as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";
import { fork } from "node:child_process";
//#region src/state/openclaw-database-verify.impl.ts
const OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS = 5 * 6e4;
const OPENCLAW_DATABASE_VERIFY_INTERVAL_MS = 1440 * 6e4;
const OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_ENV = "OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS";
/**
* Let large installations defer the full integrity scan until the gateway has
* remained stable. The daily cadence is unchanged, and the override is bounded
* so startup verification cannot be silently disabled.
*/
function resolveOpenClawDatabaseVerifyInitialDelayMs(env) {
	const raw = env[OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_ENV]?.trim();
	if (!raw) return OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS;
	return Math.min(OPENCLAW_DATABASE_VERIFY_INTERVAL_MS, Math.max(OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS, Math.round(parsed)));
}
const log$1 = createSubsystemLogger("state/database-verify");
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
function resolveDatabaseVerifyWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "state", "openclaw-database-verify.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./openclaw-database-verify.worker${extension}`, currentModuleUrl);
}
function isVerifyResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const result = value;
	return typeof result.path === "string" && typeof result.ok === "boolean" && (result.error === void 0 || typeof result.error === "string") && (result.terminal === void 0 || typeof result.terminal === "boolean");
}
function runDatabaseVerifyWorker(targets, options = {}) {
	const workerUrl = options.workerUrl ?? resolveDatabaseVerifyWorkerUrl();
	const execArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = fork(fileURLToPath(workerUrl), [DATABASE_VERIFY_CHILD_ARG], {
			execArgv,
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			]
		});
	} catch (error) {
		return Promise.reject(toStructuredErrorObject(error));
	}
	options.onWorker?.(worker);
	return new Promise((resolve, reject) => {
		let settled = false;
		let result;
		let protocolError;
		let exit;
		let disconnected = !worker.connected;
		const settle = (finish) => {
			if (settled) return;
			settled = true;
			worker.removeAllListeners();
			options.onWorker?.(void 0);
			finish();
		};
		const settleAfterExitAndDisconnect = () => {
			const completedExit = exit;
			if (!completedExit || !disconnected) return;
			settle(() => {
				if (protocolError) reject(protocolError);
				else if (completedExit.code !== 0) reject(/* @__PURE__ */ new Error(`database verification worker exited with ${completedExit.signal ? `signal ${completedExit.signal}` : `code ${completedExit.code}`}`));
				else if (!result) reject(/* @__PURE__ */ new Error("database verification worker exited without results"));
				else resolve(result);
			});
		};
		worker.once("message", (message) => {
			if (!Array.isArray(message) || !message.every(isVerifyResult)) {
				protocolError = /* @__PURE__ */ new Error("database verification worker returned invalid results");
				worker.kill();
				return;
			}
			result = message;
		});
		worker.once("error", (error) => settle(() => reject(toStructuredErrorObject(error))));
		worker.once("disconnect", () => {
			disconnected = true;
			settleAfterExitAndDisconnect();
		});
		worker.once("exit", (code, signal) => {
			exit = {
				code,
				signal
			};
			disconnected ||= !worker.connected;
			settleAfterExitAndDisconnect();
		});
		worker.send(targets, (error) => {
			if (!error) return;
			worker.kill();
			settle(() => reject(toStructuredErrorObject(error)));
		});
	});
}
async function terminateDatabaseVerifyWorker(worker) {
	if (worker.exitCode !== null || worker.signalCode !== null) return;
	await new Promise((resolve) => {
		worker.once("exit", () => resolve());
		if (!worker.kill()) resolve();
	});
}
/** Resolve the state database and current registered agent database paths. */
function collectOpenClawDatabaseVerifyTargets(options) {
	const targets = /* @__PURE__ */ new Map();
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	if (existsSync(statePath)) targets.set(statePath, {
		kind: "state",
		label: "OpenClaw state database",
		path: statePath
	});
	let registeredDatabases = [];
	try {
		registeredDatabases = listOpenClawRegisteredAgentDatabases({ env: options.env });
	} catch (error) {
		log$1.warn("failed to collect registered agent databases for integrity verification", { error: String(error) });
	}
	for (const registered of registeredDatabases) {
		const agentPath = path.resolve(registered.path);
		if (!existsSync(agentPath) || targets.has(agentPath)) continue;
		targets.set(agentPath, {
			kind: "agent",
			label: `OpenClaw agent database ${registered.agentId}`,
			path: agentPath
		});
	}
	return [...targets.values()];
}
/** Reconfirm worker failures on live owners before quarantine and latching. */
function applyOpenClawDatabaseVerificationResults(options) {
	const targetByPath = new Map(options.targets.map((target) => [target.path, target]));
	for (const result of options.results) {
		const target = targetByPath.get(result.path);
		if (!target) continue;
		if (result.ok) {
			log$1.info("database integrity verification passed", {
				kind: target.kind,
				label: target.label,
				path: result.path
			});
			continue;
		}
		if (!result.terminal) {
			log$1.warn("database integrity verification was inconclusive", {
				kind: target.kind,
				label: target.label,
				path: result.path,
				error: result.error
			});
			continue;
		}
		const confirmation = target.kind === "state" ? confirmOpenClawStateDatabaseIntegrity(result.path) : confirmOpenClawAgentDatabaseIntegrity(result.path);
		if (confirmation.status === "healthy") {
			log$1.info("discarding stale database integrity verification result", {
				kind: target.kind,
				label: target.label,
				path: result.path
			});
			continue;
		}
		if (!confirmation.terminal) {
			log$1.warn("database integrity verification was inconclusive", {
				kind: target.kind,
				label: target.label,
				path: result.path,
				error: confirmation.error.message
			});
			continue;
		}
		if (!(target.kind === "state" ? recordOpenClawStateDatabaseOpenFailure(result.path, confirmation.error, confirmation.generation) : recordOpenClawAgentDatabaseOpenFailure(result.path, confirmation.error, confirmation.generation))) {
			log$1.info("discarding database integrity result after database generation changed", {
				kind: target.kind,
				label: target.label,
				path: result.path
			});
			continue;
		}
		if (!recordOpenClawDatabaseQuarantine({
			env: options.env,
			generation: confirmation.generation,
			kind: target.kind,
			path: result.path,
			reason: confirmation.error.message
		})) log$1.error("failed to persist database quarantine; quarantine is process-local", {
			kind: target.kind,
			path: result.path
		});
		log$1.error("database integrity verification failed", {
			kind: target.kind,
			label: target.label,
			path: result.path,
			error: confirmation.error.message
		});
	}
}
//#endregion
//#region src/state/openclaw-database-verify.ts
const log = createSubsystemLogger("state/database-verify");
/** Start the Gateway-owned delayed daily integrity verifier. */
function startOpenClawDatabaseIntegrityVerifier(options) {
	let activeWorker;
	let stopped = false;
	let timer;
	const schedule = (delayMs) => {
		timer = setTimeout(() => void run(), delayMs);
		timer.unref?.();
	};
	const run = async () => {
		timer = void 0;
		try {
			const targets = collectOpenClawDatabaseVerifyTargets(options);
			if (targets.length > 0) {
				const results = await runDatabaseVerifyWorker(targets, { onWorker: (worker) => {
					activeWorker = worker;
				} });
				if (!stopped) applyOpenClawDatabaseVerificationResults({
					...options,
					results,
					targets
				});
			}
		} catch (error) {
			if (!stopped) log.error("database integrity verifier failed", { error: String(error) });
		} finally {
			activeWorker = void 0;
			if (!stopped) schedule(OPENCLAW_DATABASE_VERIFY_INTERVAL_MS);
		}
	};
	schedule(resolveOpenClawDatabaseVerifyInitialDelayMs(options.env));
	return { stop: async () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		if (activeWorker) await terminateDatabaseVerifyWorker(activeWorker);
		activeWorker = void 0;
	} };
}
//#endregion
export { startOpenClawDatabaseIntegrityVerifier };
