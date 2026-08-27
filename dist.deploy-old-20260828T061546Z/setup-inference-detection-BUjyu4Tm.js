import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-DNxmF3kK.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-CXAwbaGj.js";
import { s as detectAmbientInferenceBackends, t as resolveSetupInferenceCandidateBrandId } from "./setup-inference-brand-DkVeLzTp.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/system-agent/setup-inference-detection.ts
const SETUP_INFERENCE_DETECTION_TIMEOUT_MS = 3e4;
const log = createSubsystemLogger("system-agent/setup-inference-detection");
var SetupInferenceDetectionTimeoutError = class extends Error {
	constructor(timeoutMs) {
		super(`AI access detection did not finish after ${timeoutMs / 1e3}s. This Gateway may still be checking — try again.`);
		this.name = "SetupInferenceDetectionTimeoutError";
	}
};
let inFlightDetection;
let workerShutdown;
function trackWorkerShutdown(worker) {
	const current = worker.terminate().then(() => void 0, (error) => {
		log.warn(`Setup inference detection worker termination failed: ${String(error)}`);
	});
	workerShutdown = current;
	current.finally(() => {
		if (workerShutdown === current) workerShutdown = void 0;
	});
}
function resolveDetectionWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "system-agent", "setup-inference-detection.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./setup-inference-detection.worker${extension}`, currentModuleUrl);
}
function parseDetectionWorkerMessage(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const message = value;
	if ((message.type === "partial" || message.type === "result") && message.detection && typeof message.detection === "object") return message;
	if (message.ok === false && typeof message.error === "string") return message;
}
function withAmbientCandidates(detection, env) {
	const existing = new Set(detection.candidates.map((candidate) => `${candidate.kind}\0${candidate.modelRef}`));
	const ambient = detectAmbientInferenceBackends(env).filter((candidate) => !existing.has(`${candidate.kind}\0${candidate.modelRef}`)).map((candidate) => {
		const brandId = resolveSetupInferenceCandidateBrandId(candidate);
		return Object.assign(candidate, brandId ? { brandId } : {}, { recommended: false });
	});
	if (ambient.length === 0) return detection;
	return {
		...detection,
		candidates: [...detection.candidates, ...ambient]
	};
}
function createUndetectedFallback() {
	return {
		candidates: [],
		unavailableCandidates: [],
		manualProviders: [],
		authOptions: [],
		recommendedInstalls: listRecommendedToolInstalls(),
		workspace: DEFAULT_AGENT_WORKSPACE_DIR,
		setupComplete: false
	};
}
async function runDetectionWorker(options = {}) {
	const workerUrl = options.workerUrl ?? resolveDetectionWorkerUrl();
	const worker = new Worker(workerUrl, {
		execArgv: workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0,
		...options.workerData === void 0 ? options.agentId ? { workerData: { agentId: options.agentId } } : {} : { workerData: options.workerData }
	});
	const timeoutMs = options.timeoutMs ?? SETUP_INFERENCE_DETECTION_TIMEOUT_MS;
	return await new Promise((resolve, reject) => {
		let settled = false;
		let partialDetection;
		const settle = (finish) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			worker.removeAllListeners();
			worker.on("error", () => void 0);
			trackWorkerShutdown(worker);
			finish();
		};
		worker.on("message", (value) => {
			const message = parseDetectionWorkerMessage(value);
			if (message && "type" in message && message.type === "partial") {
				partialDetection = message.detection;
				return;
			}
			settle(() => {
				if (!message) {
					reject(/* @__PURE__ */ new Error("setup inference detection worker returned an invalid result"));
					return;
				}
				if ("ok" in message) {
					reject(new Error(message.error));
					return;
				}
				resolve(message.detection);
			});
		});
		worker.once("error", (error) => settle(() => reject(error instanceof Error ? error : new Error(String(error)))));
		worker.once("exit", (code) => {
			if (code !== 0) settle(() => reject(/* @__PURE__ */ new Error(`setup inference detection worker exited with code ${code}`)));
			else settle(() => reject(/* @__PURE__ */ new Error("setup inference detection worker exited without results")));
		});
		const timer = setTimeout(() => {
			settle(() => {
				log.warn(`Setup inference detection timed out after ${timeoutMs}ms; using partial signal if available.`);
				const env = options.fallbackEnv ?? process.env;
				const detection = withAmbientCandidates(partialDetection ?? createUndetectedFallback(), env);
				if (detection.candidates.length > 0 || detection.unavailableCandidates.length > 0) {
					resolve(detection);
					return;
				}
				reject(new SetupInferenceDetectionTimeoutError(timeoutMs));
			});
		}, timeoutMs);
		worker.unref();
	});
}
/** Coalesce read-only detection and isolate native/plugin discovery from Gateway liveness. */
async function detectSetupInferenceIsolated(options = {}) {
	const agentId = options.agentId?.trim() || void 0;
	if (inFlightDetection) {
		if (inFlightDetection.agentId === agentId) return await inFlightDetection.promise;
		await inFlightDetection.promise.catch(() => void 0);
		return await detectSetupInferenceIsolated(options);
	}
	if (workerShutdown) {
		await workerShutdown;
		return await detectSetupInferenceIsolated(options);
	}
	const current = runDetectionWorker(options);
	inFlightDetection = {
		agentId,
		promise: current
	};
	try {
		return await current;
	} finally {
		if (inFlightDetection?.promise === current) inFlightDetection = void 0;
	}
}
//#endregion
export { detectSetupInferenceIsolated };
